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

    const { stagehand, liveViewUrl } = await launchStagehandSession();
    stagehandInstance = stagehand;

    await updateFirestore({
      steelDebugUrl: liveViewUrl,
      description: 'Browser session connected.'
    });

    const searchUrl = `https://www.leboncoin.fr/recherche?category=${encodeURIComponent(category)}&locations=${encodeURIComponent(city)}`;
    
    await updateFirestore({
      step: 'navigating',
      description: `Navigating to: ${searchUrl}`
    });

    const page = stagehand.context.activePage();
    if (!page) {
      throw new Error("No active page found in Stagehand session");
    }
    await page.goto(searchUrl, { waitUntil: 'load' });

    // Inform user of progress
    await updateFirestore({
      step: 'extracting',
      description: 'Extracting Leboncoin business/classified listings...'
    });

    const extraction: any = await stagehand.extract(
      `Extract a list of classified listings matching category "${category}" in "${city}", up to ${count || 20} items. Find listing title, price, location, and the listing url.`,
      LeboncoinLeadSchema
    );

    const finalResults = extraction?.listings || [];

    let savedCount = 0;
    const leadsCollection = db.collection('leads');

    for (const lead of finalResults) {
      const businessName = lead.title || 'Leboncoin Listing';
      const website = lead.url || '';
      const address = lead.location || '';
      const price = lead.price || '';

      if (website) {
        try {
          const exists = await leadsCollection.where('website', '==', website).limit(1).get();
          if (!exists.empty) continue;
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
      } catch (addErr: any) {
        console.error('Failed to add Leboncoin lead:', addErr);
      }
    }

    await updateFirestore({
      status: 'complete',
      step: 'complete',
      description: `Task complete — ${savedCount} listings saved`,
      leadsCount: savedCount,
      results: { saved: savedCount, leads: finalResults }
    });

    return res.status(200).json({ success: true, taskId, savedCount });

  } catch (err: any) {
    console.error('Leboncoin task error:', err);
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
    if (stagehandInstance) {
      try {
        await stagehandInstance.close();
      } catch (e) {}
    }
  }
}
