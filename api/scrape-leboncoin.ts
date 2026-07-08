import { scrapeLeboncoin } from '../services/agentBrowser';
import { db } from '../firebase-client-wrapper';

export const config = { maxDuration: 300 };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category, city, count, taskId, userId } = req.body;
  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId' });
  }

  const initialTask = {
    taskId,
    taskType: 'leboncoin_scrape',
    label: `Leboncoin Scrape [${category} in ${city}]`,
    config: { category, city, count },
    status: 'running',
    step: 'starting',
    description: 'Browser starting...',
    leadsCount: 0,
    progress: 0,
    total: count || 20,
    createdAt: new Date().toISOString()
  };

  try {
    await db.collection('tasks').doc(taskId).set(initialTask);
    await db.collection('assix_tasks').doc(taskId).set(initialTask);
  } catch (err) {
    console.warn('Initial Firestore write failed:', err);
  }

  const onProgress = async (update: any) => {
    const updateData: any = {};
    if (update.status) updateData.status = update.status === 'done' ? 'complete' : (update.status === 'failed' ? 'failed' : update.status);
    if (update.step) updateData.step = update.step;
    if (update.message) updateData.description = update.message;
    if (update.screenshot) updateData.screenshot = update.screenshot;
    
    try {
      await db.collection('tasks').doc(taskId).update(updateData);
      await db.collection('assix_tasks').doc(taskId).update(updateData);
    } catch (err) {
      console.warn('Firestore progress write failed:', err);
    }
  };

  try {
    const results = await scrapeLeboncoin(category, city, count || 20, onProgress);
    
    let savedCount = 0;
    const leadsCollection = db.collection('leads');

    if (Array.isArray(results)) {
      for (const lead of results) {
        const businessName = lead.title || lead.Title || lead.owner || lead['Owner name if visible'] || 'Leboncoin Listing';
        const website = lead.url || lead['Listing URL'] || lead.listingUrl || '';
        const address = lead.location || lead.Location || '';
        const price = lead.price || lead.Price || '';

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
        } catch (addErr) {
          console.error('Failed to add Leboncoin lead:', addErr);
        }
      }
    }

    const finalUpdate = {
      status: 'complete',
      step: 'complete',
      description: `Task complete — ${savedCount} leboncoin listings found`,
      leadsCount: savedCount,
      results: { saved: savedCount, leads: results }
    };

    try {
      await db.collection('tasks').doc(taskId).update(finalUpdate);
      await db.collection('assix_tasks').doc(taskId).update(finalUpdate);
    } catch (err) {
      console.warn('Final Firestore write failed:', err);
    }

    return res.status(200).json({ success: true, taskId, savedCount });
  } catch (err: any) {
    const failedUpdate = {
      status: 'failed',
      step: 'error',
      description: err.message || 'Unknown error'
    };
    try {
      await db.collection('tasks').doc(taskId).update(failedUpdate);
      await db.collection('assix_tasks').doc(taskId).update(failedUpdate);
    } catch (firestoreErr) {
      console.warn('Failed Firestore write on error:', firestoreErr);
    }

    return res.status(500).json({ error: err.message });
  }
}
