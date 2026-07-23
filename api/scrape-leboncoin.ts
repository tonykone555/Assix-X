import { z } from 'zod';
import { db } from '../firebase-client-wrapper';
import { launchStagehandSession } from './_lib/stagehandSession';

export const config = { maxDuration: 300 };

const LeboncoinLeadSchema = z.object({
  listings: z.array(z.object({
    title: z.string().describe("The title of the listing"),
    price: z.string().optional().describe("The price listed, e.g., '150 €'"),
    location: z.string().optional().describe("The city or location of the listing"),
    url: z.string().describe("The full url of the listing or relative path if direct")
  })).describe("List of classified listings found on Leboncoin")
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category, city, count, taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId' });
  }

  let stagehandInstance: any = null;

  const logAction = async (msg: string, type = 'info') => {
    const entry = {
      time: new Date().toLocaleTimeString('en-GB'),
      msg,
      type,
      timestamp: Date.now()
    };
    try {
      await db.collection('assix_tasks').doc(taskId).collection('logs').add(entry);
    } catch (e) {
      console.warn('Firestore log write failed:', e);
    }
    const sendWS = req.app?.get('sendWS');
    if (sendWS) {
      sendWS(taskId, { type: 'log', taskId, ...entry });
    }
  };

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
      taskType: 'leboncoin_scrape',
      label: `Leboncoin Scrape [${category} in ${city}]`,
      config: { category, city, count },
      status: 'running',
      step: 'starting',
      description: 'Launching Stagehand Browser Session...',
      leadsCount: 0,
      progress: 0,
      total: count || 20,
      createdAt: new Date().toISOString()
    };

    await db.collection('tasks').doc(taskId).set(initialTask);
    await db.collection('assix_tasks').doc(taskId).set(initialTask);
    await logAction(`Initializing Leboncoin scraper for "${category}" in "${city}"...`, 'info');
    await logAction('Launching remote browser session with Steel...', 'info');

    const { stagehand, liveViewUrl } = await launchStagehandSession();
    stagehandInstance = stagehand;

    await updateFirestore({
      steelDebugUrl: liveViewUrl,
      description: 'Browser session connected.'
    });
    await logAction('Remote browser session connected successfully. Live viewer ready.', 'success');

    const searchUrl = `https://www.leboncoin.fr/recherche?category=${encodeURIComponent(category)}&locations=${encodeURIComponent(city)}`;
    
    await updateFirestore({
      step: 'navigating',
      description: `Navigating to: ${searchUrl}`
    });
    await logAction(`Navigating Chromium browser to: ${searchUrl}`, 'info');

    const page = stagehand.context.activePage();
    if (!page) {
      throw new Error("No active page found in Stagehand session");
    }
    await page.goto(searchUrl, { waitUntil: 'load' });
    await logAction('Successfully loaded Leboncoin search results.', 'success');

    // Inform user of progress
    await updateFirestore({
      step: 'extracting',
      description: 'Extracting Leboncoin business/classified listings...'
    });
    await logAction('Invoking AI Stagehand extractor to identify listings details...', 'info');

    const extraction: any = await stagehand.extract(
      `Extract a list of classified listings matching category "${category}" in "${city}", up to ${count || 20} items. Find listing title, price, location, and the listing url.`,
      LeboncoinLeadSchema
    );

    const finalResults = extraction?.listings || [];
    await logAction(`AI extraction complete. Identified ${finalResults.length} potential listings on page.`, 'success');

    let savedCount = 0;
    const leadsCollection = db.collection('leads');

    await logAction('Filtering duplicates and saving new listings to Firestore database...', 'info');

    for (const lead of finalResults) {
      const businessName = lead.title || 'Leboncoin Listing';
      const website = lead.url || '';
      const address = lead.location || '';
      const price = lead.price || '';

      if (website) {
        try {
          const exists = await leadsCollection.where('website', '==', website).limit(1).get();
          if (!exists.empty) {
            await logAction(`Listing "${businessName}" already exists in lead directory, skipping.`, 'info');
            continue;
          }
        } catch {}
      }

      try {
        await leadsCollection.add({
          taskId,
          businessName,
          company: businessName,
          phone: '',
          website,
          address,
          city,
          sector: category,
          source: 'leboncoin',
          leadType: website ? 'has_website' : 'no_website',
          createdAt: new Date().toISOString(),
          sentToClose: false,
          status: 'new',
          isFallback: false,
          price
        });
        savedCount++;
        await updateFirestore({ leadsCount: savedCount });
        await logAction(`Saved listing: "${businessName}" [Price: ${price || 'N/A'}]`, 'success');
      } catch (addErr: any) {
        console.error('Failed to add Leboncoin lead:', addErr);
      }
    }

    let finalScreenshotBase64 = '';
    try {
      const page = stagehandInstance.context.activePage();
      if (page) {
        const buffer = await page.screenshot({ type: 'jpeg', quality: 60 });
        finalScreenshotBase64 = buffer.toString('base64');
      }
    } catch (e) {}

    const completionFields: any = {
      status: 'complete',
      step: 'complete',
      description: `Task complete — ${savedCount} listings saved`,
      leadsCount: savedCount,
      results: { saved: savedCount, leads: finalResults }
    };
    if (finalScreenshotBase64) {
      completionFields.screenshot = finalScreenshotBase64;
    }
    await updateFirestore(completionFields);
    await logAction(`✓ Scrape complete! ${savedCount} listings saved successfully.`, 'success');

    return res.status(200).json({ success: true, taskId, savedCount });

  } catch (err: any) {
    console.error('Leboncoin task error:', err);
    let errMsg = err?.message || String(err);
    if (errMsg.includes('limit') || errMsg.includes('quota') || errMsg.includes('credits')) {
      errMsg = 'Browserbase free tier limit or quota reached this month.';
    } else if (errMsg.includes('timeout') || errMsg.includes('disconnected')) {
      errMsg = `Browserbase session expired or disconnected: ${errMsg}`;
    }

    let finalScreenshotBase64 = '';
    try {
      if (stagehandInstance) {
        const page = stagehandInstance.context.activePage();
        if (page) {
          const buffer = await page.screenshot({ type: 'jpeg', quality: 60 });
          finalScreenshotBase64 = buffer.toString('base64');
        }
      }
    } catch (e) {}

    const failureFields: any = {
      status: 'failed',
      step: 'error',
      description: errMsg
    };
    if (finalScreenshotBase64) {
      failureFields.screenshot = finalScreenshotBase64;
    }
    await updateFirestore(failureFields);
    await logAction(`Session failure error: ${errMsg}`, 'error');
    return res.status(500).json({ error: errMsg });
  } finally {
    if (stagehandInstance) {
      console.log(`[Leboncoin] Keeping Steel session alive for 10 minutes for user interaction...`);
      setTimeout(async () => {
        try {
          console.log(`[Leboncoin] Delayed closing of Stagehand instance for task ${taskId}...`);
          await stagehandInstance.close();
        } catch (e) {}
      }, 10 * 60 * 1000);
    }
  }
}
