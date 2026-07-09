import { db } from '../../firebase-client-wrapper';
import { launchStagehandSession } from '../_lib/stagehandSession';
import { z } from 'zod';

export const config = { maxDuration: 300 };

const leadShape = z.object({
  leads: z.array(z.object({
    name: z.string().describe("The name of the business/company/lead"),
    phone: z.string().describe("The phone number of the business/lead"),
    address: z.string().describe("The address of the business/lead"),
    website: z.string().describe("The website URL of the business/lead")
  })).describe("A list of leads/businesses found on the page matching the query/goal")
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { goal, taskId: providedTaskId, context } = req.body;
  const taskId = providedTaskId || `dyn-${Date.now()}`;
  let stagehandInstance: any = null;

  const updateFirestore = async (fields: any) => {
    try {
      await db.collection('tasks').doc(taskId).update(fields);
      await db.collection('assix_tasks').doc(taskId).update(fields);
    } catch (e) { 
      console.warn('Firestore write failed:', e); 
    }
  };

  try {
    const initialTask = {
      taskId, 
      taskType: 'dynamic', 
      status: 'running',
      step: 'starting', 
      description: 'Launching remote browser session with Stagehand...',
      steelDebugUrl: '', 
      leadsCount: 0, 
      createdAt: new Date().toISOString()
    };

    await db.collection('tasks').doc(taskId).set(initialTask);
    await db.collection('assix_tasks').doc(taskId).set(initialTask);

    // Launch Stagehand Session
    const { stagehand, liveViewUrl } = await launchStagehandSession();
    stagehandInstance = stagehand;

    // Update with live view url so client can view in real-time
    await updateFirestore({
      steelDebugUrl: liveViewUrl,
      description: 'Stagehand session connected. Navigating to start page...'
    });

    const page = stagehand.context.activePage();
    if (!page) {
      throw new Error("No active page found in Stagehand session");
    }

    // Determine initial page
    if (context?.startingUrl) {
      await page.goto(context.startingUrl, { waitUntil: 'load' });
    } else {
      await page.goto('https://www.google.com', { waitUntil: 'load' });
    }

    await updateFirestore({
      step: 'acting',
      description: `Executing action goal: "${goal}"`
    });

    // Execute the goal
    await stagehand.act(goal);

    await updateFirestore({
      step: 'extracting',
      description: `Extracting leads matching goal from browser...`
    });

    // Extract leads using LLM with structured output schema
    const extraction: any = await stagehand.extract(
      `Extract all companies or leads matching: ${goal}. For each lead, find name, phone, address, and website.`,
      leadShape
    );

    const allResults = extraction?.leads || [];

    await updateFirestore({
      description: `Extraction completed. Storing ${allResults.length} leads...`,
      leadsCount: allResults.length
    });

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
      }
    }

    await updateFirestore({
      status: 'complete', 
      step: 'complete',
      description: `Task complete — ${savedCount} leads saved`,
      leadsCount: savedCount, 
      results: { saved: savedCount, leads: allResults }
    });

    return res.status(200).json({ success: true, taskId, savedCount });

  } catch (err: any) {
    console.error('Dynamic task error:', err);
    let errMsg = err?.message || String(err);
    if (errMsg.includes('limit') || errMsg.includes('quota') || errMsg.includes('credits')) {
      errMsg = 'Browserbase free tier limit or quota reached this month.';
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
      if (stagehandInstance) {
        await stagehandInstance.close();
      }
    } catch (e) {}
  }
}
