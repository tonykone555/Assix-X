import { scrapeGoogleMaps } from '../services/agentBrowser';
import { db } from '../firebase-client-wrapper';

export const config = { maxDuration: 300 };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, city, count, taskId, userId } = req.body;
  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId' });
  }

  const initialTask = {
    taskId,
    taskType: 'google_maps_scrape',
    label: `Google Maps Scrape [${query} in ${city}]`,
    config: { query, city, count },
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
  } catch (err: any) {
    console.warn('Initial Firestore write failed:', err);
    try {
      const errMsg = `Initial Firestore write failed: ${err?.message || String(err)}`;
      await db.collection('tasks').doc(taskId).update({ description: errMsg });
      await db.collection('assix_tasks').doc(taskId).update({ description: errMsg });
    } catch {}
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
    } catch (err: any) {
      console.warn('Firestore progress write failed:', err);
      try {
        const errMsg = `Firestore progress write failed: ${err?.message || String(err)}`;
        await db.collection('tasks').doc(taskId).update({ description: errMsg });
        await db.collection('assix_tasks').doc(taskId).update({ description: errMsg });
      } catch {}
    }
  };

  try {
    const results = await scrapeGoogleMaps(query, city, count || 20, onProgress);
    
    let savedCount = 0;
    const leadsCollection = db.collection('leads');

    if (Array.isArray(results)) {
      for (const lead of results) {
        const businessName = lead.businessName || lead['Business name'] || lead.name || 'Google Maps Lead';
        const phone = lead.phone || lead['Phone number'] || '';
        const website = lead.website || lead['Website URL'] || lead.url || '';
        const rating = lead.rating || lead['Rating and review count'] || '';
        const address = lead.address || lead['Address'] || '';

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
        } catch (addErr: any) {
          console.error('Failed to add Google Maps lead:', addErr);
          try {
            const errMsg = `Failed to add Google Maps lead: ${addErr?.message || String(addErr)}`;
            await db.collection('tasks').doc(taskId).update({ description: errMsg });
            await db.collection('assix_tasks').doc(taskId).update({ description: errMsg });
          } catch {}
        }
      }
    }

    const finalUpdate = {
      status: 'complete',
      step: 'complete',
      description: `Task complete — ${savedCount} leads found`,
      leadsCount: savedCount,
      results: { saved: savedCount, leads: results }
    };

    try {
      await db.collection('tasks').doc(taskId).update(finalUpdate);
      await db.collection('assix_tasks').doc(taskId).update(finalUpdate);
    } catch (err: any) {
      console.warn('Final Firestore write failed:', err);
      try {
        const errMsg = `Final Firestore write failed: ${err?.message || String(err)}`;
        await db.collection('tasks').doc(taskId).update({ description: errMsg });
        await db.collection('assix_tasks').doc(taskId).update({ description: errMsg });
      } catch {}
    }

    return res.status(200).json({ success: true, taskId, savedCount });
  } catch (err: any) {
    const failedUpdate = {
      status: 'failed',
      step: 'error',
      description: err.message || String(err)
    };
    try {
      await db.collection('tasks').doc(taskId).update(failedUpdate);
      await db.collection('assix_tasks').doc(taskId).update(failedUpdate);
    } catch (firestoreErr: any) {
      console.warn('Failed Firestore write on error:', firestoreErr);
    }

    return res.status(500).json({ error: err.message || String(err) });
  }
}
