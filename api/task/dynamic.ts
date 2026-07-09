import { db } from '../../firebase-client-wrapper';
import { callAI } from '../../services/aiService';
import { launchBrowserbaseSession } from '../_lib/browserbaseSession';

export const config = { maxDuration: 300 };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { goal, taskId: providedTaskId } = req.body;
  const taskId = providedTaskId || `dyn-${Date.now()}`;
  let session: any;
  let browser: any;

  const updateFirestore = async (fields: any) => {
    try {
      await db.collection('tasks').doc(taskId).update(fields);
      await db.collection('assix_tasks').doc(taskId).update(fields);
    } catch (e) { 
      console.warn('Firestore write failed:', e); 
    }
  };

  try {
    const conn = await launchBrowserbaseSession();
    session = conn.session; 
    browser = conn.browser;
    const page = conn.page;

    const initialTask = {
      taskId, 
      taskType: 'dynamic', 
      status: 'running',
      step: 'starting', 
      description: 'Browser starting...',
      steelDebugUrl: conn.debugUrl, // reuse existing field name LiveViewer already checks
      leadsCount: 0, 
      createdAt: new Date().toISOString()
    };

    await db.collection('tasks').doc(taskId).set(initialTask);
    await db.collection('assix_tasks').doc(taskId).set(initialTask);

    let done = false, attempts = 0;
    const maxAttempts = 20;
    const allResults: any[] = [];

    while (!done && attempts < maxAttempts) {
      attempts++;
      const currentUrl = page.url();
      let screenshot = '';
      try {
        screenshot = (await page.screenshot({ type: 'jpeg', quality: 50 })).toString('base64');
      } catch (e) { 
        screenshot = ''; 
      }

      await updateFirestore({ 
        step: `Analyzing page (step ${attempts}/${maxAttempts})...`, 
        description: `Looking at ${currentUrl}`,
        ...(screenshot ? { screenshot } : {})
      });

      // Exact same natural-language instruction structure as callGeminiVision in server.ts
      const instruction = await callAI("browser_agent", [{
        role: "user",
        content: `You are a browser automation agent. You MUST extract data before saying done. Current URL: ${currentUrl}. Goal: ${goal}. Rules: NEVER say done until you have extracted at least 5 items if the goal involves finding multiple things. If you see relevant items, extract them immediately. Return ONLY valid JSON: {"action":"click|type|scroll|extract|done","description":"what you are doing","selector":"CSS selector","text":"text to type","url":"URL if goto","data":[{"name":"","phone":"","address":"","website":""}],"done":false,"reason":"why done"}`
      }], screenshot);

      let parsed: any;
      try {
        parsed = JSON.parse(instruction.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch (e) {
        parsed = { action: 'scroll', description: 'Could not parse AI response, scrolling' };
      }

      await updateFirestore({ 
        description: parsed.description || parsed.action, 
        step: `Step ${attempts}: ${parsed.action}` 
      });

      try {
        if (parsed.action === 'click' && parsed.selector) {
          await page.click(parsed.selector, { timeout: 5000 });
        } else if (parsed.action === 'type' && parsed.selector) {
          await page.fill(parsed.selector, parsed.text || '');
        } else if (parsed.action === 'scroll') {
          await page.mouse.wheel(0, 800);
        } else if (parsed.action === 'goto' && parsed.url) {
          await page.goto(parsed.url, { waitUntil: 'domcontentloaded' });
        }
      } catch (actionErr: any) {
        await updateFirestore({ 
          description: `Action failed: ${actionErr.message || String(actionErr)}, retrying...` 
        });
      }

      if (parsed.data && Array.isArray(parsed.data)) {
        for (const item of parsed.data) {
          if (item.name || item.phone) {
            allResults.push(item);
          }
        }
      }

      // Live update leadsCount in DB
      if (allResults.length > 0) {
        await updateFirestore({ leadsCount: allResults.length });
      }

      if (parsed.action === 'done' || parsed.done) {
        done = true;
      }
      await new Promise(r => setTimeout(r, 800));
    }

    let savedCount = 0;
    const leadsCollection = db.collection('leads');
    for (const item of allResults) {
      try {
        await leadsCollection.add({
          taskId, 
          company: item.name || 'Unknown', 
          businessName: item.name || 'Unknown',
          phone: item.phone || '', 
          website: item.website || '', 
          address: item.address || '',
          sector: goal.slice(0, 40), 
          source: 'dynamic',
          leadType: item.website ? 'has_website' : 'no_website',
          createdAt: new Date().toISOString(), 
          status: 'new', 
          isFallback: false
        });
        savedCount++;
      } catch (leadErr: any) {
        console.error('Failed to add dynamic lead to database:', leadErr);
        const errMsg = `Failed to add dynamic lead: ${leadErr?.message || String(leadErr)}`;
        await updateFirestore({ description: errMsg });
      }
    }

    await updateFirestore({
      status: 'complete', 
      step: 'complete',
      description: `Task complete — ${savedCount} leads found`,
      leadsCount: savedCount, 
      results: { saved: savedCount, leads: allResults }
    });
    return res.status(200).json({ success: true, taskId, savedCount });

  } catch (err: any) {
    console.error('Dynamic task error:', err);
    let errMsg = err?.message || String(err);
    if (errMsg.includes('limit') || errMsg.includes('quota')) {
      errMsg = 'Browserbase free tier limit reached this month.';
    } else if (errMsg.includes('timeout') || errMsg.includes('disconnected')) {
      errMsg = `Browserbase session expired or disconnected: ${errMsg}`;
    }
    await updateFirestore({ 
      status: 'failed', 
      step: 'error', 
      description: errMsg 
    });
    return res.status(500).json({ error: errMsg });
  } finally {
    try { 
      if (browser) await browser.close(); 
    } catch (e) {}
  }
}
