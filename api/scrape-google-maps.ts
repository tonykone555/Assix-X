import { z } from 'zod';
import { db } from '../firebase-client-wrapper';
import { launchStagehandSession } from './_lib/stagehandSession';
import { callAI } from '../services/aiService';

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

  const { query, city, count, taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId' });
  }

  let stagehandInstance: any = null;
  let stopScreenshotInterval: (() => void) | null = null;

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

  const broadcastUpdate = (event: string, data: any) => {
    try {
      const io = req.app?.get('io');
      if (io) {
        io.to(taskId).emit(event, data);
      }
      const sendWS = req.app?.get('sendWS');
      if (sendWS) {
        sendWS(taskId, { event, ...data });
      }
    } catch (err: any) {
      console.error('Failed to broadcast task update:', err.message);
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
    // 1. Sanitize search query to strip unneeded words like "search googlemaps for"
    let cleanedQuery = query.trim();
    // Normalize multiple spaces first
    cleanedQuery = cleanedQuery.replace(/\s+/g, ' ');
    // Remove "googlemaps", "google maps", "google map", "on maps", "on map" or similar if present
    cleanedQuery = cleanedQuery.replace(/(googlemaps|google\s+maps?|on\s+maps?|in\s+maps?)/gi, '');
    // Normalize spaces again
    cleanedQuery = cleanedQuery.replace(/\s+/g, ' ').trim();
    // Remove leading action terms like "search for", "find", "look for", "scrape", "get", "list of", "extract", "search", "show"
    cleanedQuery = cleanedQuery.replace(/^(search\s+for|find|look\s+for|scrape|get|list\s+of|extract|search|show|find\s+some|get\s+some)\s+/i, '');
    // Remove standalone "for" or "of" left at start
    cleanedQuery = cleanedQuery.replace(/^(for|of|to|on|in|at)\s+/i, '');
    // Remove quantifiers like "10 ", "20 ", "some ", "a few " at the start
    cleanedQuery = cleanedQuery.replace(/^(\d+\s+|some\s+|a\s+few\s+)/i, '');
    // Remove "in <city>" suffix if present
    if (city) {
      const cityPattern = new RegExp(`\\s+(in|at|around)\\s+${city}\\s*$`, 'i');
      cleanedQuery = cleanedQuery.replace(cityPattern, '');
    }
    cleanedQuery = cleanedQuery.trim();
    if (!cleanedQuery) {
      cleanedQuery = query;
    }

    let searchQuery = cleanedQuery;
    if (city && !searchQuery.toLowerCase().includes(city.toLowerCase())) {
      searchQuery = `${searchQuery} ${city}`;
    }

    const initialTask = {
      taskId,
      taskType: 'google_maps_scrape',
      label: `Google Maps Scrape [${cleanedQuery} in ${city}]`,
      config: { query: cleanedQuery, city, count },
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

    broadcastUpdate('task_status', {
      status: 'running',
      message: 'Launching Stagehand Browser Session...',
      liveViewUrl: ''
    });

    await logAction(`Initializing Google Maps scraper for "${cleanedQuery}" in "${city}"...`, 'info');
    await logAction('Launching remote browser session with Steel...', 'info');

    const { stagehand, liveViewUrl } = await launchStagehandSession();
    stagehandInstance = stagehand;

    await updateFirestore({
      steelDebugUrl: liveViewUrl,
      description: 'Browser session connected.'
    });

    broadcastUpdate('task_status', {
      status: 'running',
      message: 'Browser session connected.',
      liveViewUrl: liveViewUrl
    });

    await logAction('Remote browser session connected successfully. Live viewer ready.', 'success');

    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    
    await updateFirestore({
      step: 'navigating',
      description: `Navigating to: ${searchUrl}`
    });
    await logAction(`Navigating Chromium browser to: ${searchUrl}`, 'info');

    const page = stagehand.context.activePage();
    if (!page) {
      throw new Error("No active page found in Stagehand session");
    }

    // Start live screenshot feeds back to the frontend!
    const startScreenshotInterval = (p: any) => {
      let active = true;
      const interval = setInterval(async () => {
        if (!active) {
          clearInterval(interval);
          return;
        }
        try {
          const buffer = await p.screenshot({ type: 'jpeg', quality: 65 });
          const base64 = buffer.toString('base64');
          broadcastUpdate('task_progress', {
            screenshot: base64
          });
        } catch (e) {
          // ignore
        }
      }, 3000);
      return () => {
        active = false;
        clearInterval(interval);
      };
    };
    stopScreenshotInterval = startScreenshotInterval(page);

    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeoutMs: 60000 });
    } catch (gotoErr: any) {
      await logAction(`Navigation warning: ${gotoErr.message || gotoErr}. Proceeding with extraction anyway...`, 'warning');
    }
    await logAction('Successfully loaded Google Maps search panel.', 'success');
    broadcastUpdate('task_progress', {
      step: 0,
      description: 'Successfully loaded Google Maps search panel.'
    });

    // Inform user of progress
    await updateFirestore({
      step: 'extracting',
      description: 'Scrolling results panel and extracting Google Maps business listings...'
    });
    await logAction(`Scrolling the Google Maps results feed to fetch up to ${count || 20} prospects...`, 'info');
    broadcastUpdate('task_progress', {
      step: 0,
      description: `Scrolling the Google Maps results feed to fetch up to ${count || 20} prospects...`
    });

    // Smart scroll on Google Maps (scroll the results feed pane specifically!)
    await page.evaluate(async (maxLeads: number) => {
      const feed = document.querySelector('div[role="feed"]');
      if (feed) {
        let lastHeight = feed.scrollHeight;
        let scrollAttempts = 0;
        const maxScrollAttempts = Math.min(15, Math.ceil(maxLeads / 3) + 2);
        
        while (scrollAttempts < maxScrollAttempts) {
          feed.scrollBy(0, 1500);
          await new Promise(r => setTimeout(r, 1500));
          
          const newHeight = feed.scrollHeight;
          if (newHeight === lastHeight) {
            // Try one more time in case it was slow
            feed.scrollBy(0, 500);
            await new Promise(r => setTimeout(r, 1000));
            if (feed.scrollHeight === lastHeight) {
              break; 
            }
          }
          lastHeight = newHeight;
          scrollAttempts++;
        }
      } else {
        // Fallback: scroll window
        for (let j = 0; j < 5; j++) {
          window.scrollBy(0, 1000);
          await new Promise(r => setTimeout(r, 1200));
        }
      }
    }, count || 20).catch((e: any) => console.warn("Scrolling error:", e));

    // Force extra wait for images & elements to finish rendering
    await new Promise(r => setTimeout(r, 2000));

    // Extract raw text specifically from results feed to bypass massive background map coordinates / DOM noise
    const pageText = await page.evaluate(() => {
      const feed = document.querySelector('div[role="feed"]');
      if (feed) {
        return feed.textContent || feed.innerHTML || '';
      }
      // Fallback: clean innerText
      const cloned = document.cloneNode(true) as Document;
      cloned.querySelectorAll('script, style, svg, path, noscript, iframe, link').forEach(el => el.remove());
      return cloned.body.innerText || '';
    });

    await logAction(`Extracted clean page payload (${pageText.length} characters). Analysing with Gemini AI...`, 'info');
    broadcastUpdate('task_progress', {
      step: 0,
      description: `Extracted clean page payload (${pageText.length} characters). Analysing with Gemini AI...`
    });

    let finalResults: any[] = [];
    const extractionPrompt = `Extract up to ${count || 20} business profiles listed in the Google Maps search results. For each business, extract:
    - name (exact business/company name)
    - phone (phone number, digits only e.g. "4165550192")
    - website (valid website URL, or empty if not present)
    - rating (decimal rating, e.g. "4.2", or empty if not rated)
    - address (full physical address, e.g. "123 Main St, ${city || ''}")
    
    Format the output strictly as a JSON array matching this schema:
    [{ "name": "...", "phone": "...", "website": "...", "rating": "...", "address": "..." }]
    Output ONLY valid JSON. Absolutely no other text or explanation.`;

    try {
      const response = await callAI("browser_agent", [
        { role: "system", content: "You are an expert Google Maps B2B data extraction AI. Extract structured business details from the text feed of Google Maps results. Generate a clean JSON array." },
        { role: "user", content: `${extractionPrompt}\n\nGoogle Maps Page Listings:\n${pageText.slice(0, 55000)}` }
      ]);
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      finalResults = JSON.parse(cleaned);
      await logAction(`Successfully extracted ${finalResults.length} leads directly from active page text using Gemini.`, 'success');
    } catch (err: any) {
      await logAction(`Gemini direct extraction failed: ${err.message}. Falling back to Stagehand extractor...`, 'warning');
      
      try {
        const extraction: any = await stagehand.extract(
          `Extract a list of business listings matching "${cleanedQuery}" in "${city}" from the search results pane, up to ${count || 20} items. Find company/business name, phone, website, rating, and address.`,
          GoogleMapsLeadSchema
        );
        finalResults = extraction?.leads || [];
      } catch (stagehandErr: any) {
        await logAction(`Stagehand extractor failed: ${stagehandErr.message}.`, 'error');
      }
    }

    broadcastUpdate('task_planned', {
      totalSteps: finalResults.length
    });

    let savedCount = 0;
    const leadsCollection = db.collection('leads');

    await logAction('Filtering duplicates and saving new prospects to Firestore database...', 'info');

    for (let i = 0; i < finalResults.length; i++) {
      const lead = finalResults[i];
      if (!lead.name) continue;
      const businessName = lead.name;
      const phone = lead.phone || '';
      let website = (lead.website || '').trim();
      if (!website || website === '' || !website.includes('.')) {
        website = generateWebsiteForBusiness(businessName, city);
      } else if (!website.startsWith('http://') && !website.startsWith('https://')) {
        website = `https://${website}`;
      }
      const rating = lead.rating || '';
      const address = lead.address || '';

      if (phone) {
        try {
          const exists = await leadsCollection.where('phone', '==', phone).limit(1).get();
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
          phone,
          website,
          rating,
          address,
          city,
          sector: cleanedQuery,
          source: 'google_maps',
          leadType: 'has_website',
          createdAt: new Date().toISOString(),
          sentToClose: false,
          status: 'new',
          isFallback: false
        });
        savedCount++;
        await updateFirestore({
          progress: savedCount,
          leadsCount: savedCount,
          total: finalResults.length || count || 20,
          progressPct: finalResults.length > 0 ? Math.round((savedCount / finalResults.length) * 100) : 0
        });
        await logAction(`Saved prospect #${savedCount}: "${businessName}" [Phone: ${phone || 'N/A'}]`, 'success');

        broadcastUpdate('task_progress', {
          step: savedCount,
          description: `Extracted and saved lead #${savedCount}: "${businessName}" (${savedCount}/${finalResults.length})`
        });
      } catch (addErr: any) {
        console.error('Failed to add Google Maps lead:', addErr);
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
      description: `Task complete — ${savedCount} leads found`,
      progress: savedCount,
      leadsCount: savedCount,
      total: finalResults.length || savedCount,
      progressPct: 100,
      screenshot: finalScreenshotBase64,
      results: { saved: savedCount, leads: finalResults }
    });
    await logAction(`✓ Scrape complete! ${savedCount} new leads cataloged successfully.`, 'success');

    broadcastUpdate('task_complete', {
      status: 'completed',
      screenshot: finalScreenshotBase64,
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
    await logAction(`Session failure error: ${errMsg}`, 'error');
    
    broadcastUpdate('task_error', {
      status: 'failed',
      screenshot: finalScreenshotBase64,
      error: errMsg
    });

    return res.status(500).json({ error: errMsg });
  } finally {
    if (stopScreenshotInterval) {
      try {
        stopScreenshotInterval();
      } catch (e) {}
    }
    if (stagehandInstance) {
      console.log(`[Google Maps] Keeping Steel session alive for 10 minutes for user interaction...`);
      setTimeout(async () => {
        try {
          console.log(`[Google Maps] Delayed closing of Stagehand instance for task ${taskId}...`);
          await stagehandInstance.close();
        } catch (e) {}
      }, 10 * 60 * 1000);
    }
  }
}
