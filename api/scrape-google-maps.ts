import { z } from 'zod';
import { db } from '../firebase-client-wrapper';
import { launchStagehandSession } from './_lib/stagehandSession';

export const config = { maxDuration: 300 };

const GoogleMapsLeadSchema = z.object({
  leads: z.array(z.object({
    name: z.string().describe("The name of the business"),
    phone: z.string().optional().describe("The phone number of the business if listed"),
    website: z.string().optional().describe("The website URL of the business if listed"),
    address: z.string().optional().describe("The physical address or location of the business"),
    rating: z.string().optional().describe("The user rating, e.g., '4.5'")
  })).describe("List of business listings found on Google Maps")
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, city, count, taskId } = req.body;
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
      taskType: 'google_maps_scrape',
      label: `Google Maps Scrape [${query} in ${city}]`,
      config: { query, city, count },
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

    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query + ' ' + city)}`;
    
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
      description: 'Extracting Google Maps business listings...'
    });

    const extraction: any = await stagehand.extract(
      `Extract a list of business listings matching "${query}" in "${city}" from the search results pane, up to ${count || 20} items. Find company/business name, phone, website, rating, and address.`,
      GoogleMapsLeadSchema
    );

    const finalResults = extraction?.leads || [];

    let savedCount = 0;
    const leadsCollection = db.collection('leads');

    for (const lead of finalResults) {
      if (!lead.name) continue;
      const businessName = lead.name;
      const phone = lead.phone || '';
      const website = lead.website || '';
      const rating = lead.rating || '';
      const address = lead.address || '';

      if (phone) {
        try {
          const exists = await leadsCollection.where('phone', '==', phone).limit(1).get();
          if (!exists.empty) continue;
        } catch {}
      }

      try {
        await leadsCollection.add({
          taskId,
          businessName,
          company: businessName,
          phone,
          website,
          rating,
          address,
          city,
          sector: query,
          source: 'google_maps',
          leadType: website ? 'has_website' : 'no_website',
          createdAt: new Date().toISOString(),
          sentToClose: false,
          status: 'new',
          isFallback: false
        });
        savedCount++;
        await updateFirestore({ leadsCount: savedCount });
      } catch (addErr: any) {
        console.error('Failed to add Google Maps lead:', addErr);
      }
    }

    await updateFirestore({
      status: 'complete',
      step: 'complete',
      description: `Task complete — ${savedCount} leads found`,
      leadsCount: savedCount,
      results: { saved: savedCount, leads: finalResults }
    });

    return res.status(200).json({ success: true, taskId, savedCount });

  } catch (err: any) {
    console.error('Google Maps task error:', err);
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
