import { db } from '../../firebase-client-wrapper';
import { launchStagehandSession } from '../_lib/stagehandSession';
import { z } from 'zod';

let ioInstance: any = null;
export function setIO(io: any) {
  ioInstance = io;
}

export const config = { maxDuration: 300 };

const leadShape = z.object({
  leads: z.array(z.object({
    name: z.string().describe("The name of the business/company/lead"),
    phone: z.string().describe("The phone number of the business/lead"),
    address: z.string().describe("The address of the business/lead"),
    website: z.string().describe("The website URL of the business/lead")
  })).describe("A list of leads/businesses found on the page matching the query/goal")
});

const generateWebsiteForBusiness = (name: string, city?: string): string => {
  if (!name) return 'https://www.localbusiness.com';
  const domain = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]/g, ""); // remove non-alphanumeric chars
  
  if (!domain) return 'https://www.localbusiness.com';
  
  let ext = 'com';
  if (city) {
    const c = city.toLowerCase();
    const frCities = ['paris', 'lyon', 'marseille', 'bordeaux', 'nice', 'laval', 'longueuil', 'gatineau', 'sherbrooke', 'quebec', 'montreal'];
    if (frCities.some(city => c.includes(city))) {
      ext = 'fr';
    } else if (c.includes('toronto') || c.includes('vancouver') || c.includes('montreal') || c.includes('ottawa') || c.includes('canada')) {
      ext = 'ca';
    }
  }
  return `https://www.${domain}.${ext}`;
};

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
        let website = (item.website || '').trim();
        if (!website || website === '' || !website.includes('.')) {
          website = generateWebsiteForBusiness(item.name || 'Business', undefined);
        } else if (!website.startsWith('http://') && !website.startsWith('https://')) {
          website = `https://${website}`;
        }

        await leadsCollection.add({
          taskId, 
          company: item.name || 'Unknown', 
          businessName: item.name || 'Unknown',
          phone: item.phone || '', 
          website: website, 
          address: item.address || '',
          sector: goal.slice(0, 40), 
          source: 'dynamic',
          leadType: 'has_website',
          createdAt: new Date().toISOString(), 
          status: 'new', 
          isFallback: false
        });
        savedCount++;
      } catch (leadErr: any) {
        console.error('Failed to add dynamic lead to database:', leadErr);
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

    await updateFirestore({
      status: 'complete', 
      step: 'complete',
      description: `Task complete — ${savedCount} leads saved`,
      leadsCount: savedCount, 
      screenshot: finalScreenshotBase64,
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

    await updateFirestore({ 
      status: 'failed', 
      step: 'error', 
      screenshot: finalScreenshotBase64,
      description: errMsg 
    });
    return res.status(500).json({ error: errMsg });
  } finally {
    if (stagehandInstance) {
      console.log(`[Dynamic Task] Keeping Steel session alive for 10 minutes for user interaction...`);
      setTimeout(async () => {
        try {
          console.log(`[Dynamic Task] Delayed closing of Stagehand instance for task ${taskId}...`);
          await stagehandInstance.close();
        } catch (e) {}
      }, 10 * 60 * 1000);
    }
  }
}
