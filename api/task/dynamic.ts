import { runBrowserTask } from '../../services/agentBrowser';
import { db } from '../../firebase-client-wrapper';

export const config = { maxDuration: 300 };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { goal, context, taskId: providedTaskId } = req.body;
  const taskId = providedTaskId || `dyn-${Date.now()}`;

  const initialTask = {
    taskId,
    taskType: 'dynamic',
    label: `Smart Automation: ${goal.slice(0, 30)}...`,
    config: { goal, context },
    status: 'running',
    step: 'starting',
    description: 'Browser starting...',
    leadsCount: 0,
    progress: 0,
    total: 10,
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
    const result = await runBrowserTask(goal, onProgress);

    let parsedLeads: any[] = [];
    try {
      parsedLeads = JSON.parse(result);
    } catch {
      // Not JSON output, or just text summary
    }

    let savedCount = 0;
    if (Array.isArray(parsedLeads)) {
      const leadsCollection = db.collection('leads');
      for (const lead of parsedLeads) {
        const businessName = lead.businessName || lead.company || lead.name || 'Dynamic Lead';
        const phone = lead.phone || '';
        const website = lead.website || lead.url || '';
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
            address,
            city: lead.city || '',
            sector: lead.sector || goal.slice(0, 30),
            source: 'dynamic',
            leadType: website ? 'has_website' : 'no_website',
            createdAt: new Date().toISOString(),
            sentToClose: false,
            status: 'new',
            isFallback: false
          });
          savedCount++;
        } catch (addErr) {
          console.error('Failed to add dynamic lead:', addErr);
        }
      }
    }

    const finalUpdate = {
      status: 'complete',
      step: 'complete',
      description: `Task complete — ${savedCount || 'No JSON'} leads found`,
      leadsCount: savedCount,
      results: { saved: savedCount, result, leads: parsedLeads }
    };

    try {
      await db.collection('tasks').doc(taskId).update(finalUpdate);
      await db.collection('assix_tasks').doc(taskId).update(finalUpdate);
    } catch (err) {
      console.warn('Final Firestore write failed:', err);
    }

    return res.status(200).json({ success: true, taskId, result });
  } catch (err: any) {
    console.error('Task launch error (dynamic):', err);
    const failedUpdate = {
      status: 'failed',
      step: 'error',
      description: `Sandbox error: ${err?.message || String(err)}`
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

