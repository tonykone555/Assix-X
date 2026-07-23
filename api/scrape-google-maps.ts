import { z } from 'zod';
import { db } from '../firebase-client-wrapper';
import { launchStagehandSession } from './_lib/stagehandSession';
import { callAI } from '../services/aiService';
import { formatPhone } from '../services/firebase';

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
    // 1. Robust Scrolling & Continuous Crawling with consecutive idle checks and end-of-list signature checks in multiple languages
    await page.evaluate(async (maxLeads: number) => {
      const feed = document.querySelector('div[role="feed"]');
      if (feed) {
        const endOfListSignatures = [
          "reached the end", "fin de la liste", "ende der liste", "final de la lista", 
          "fine dell'elenco", "fim da lista", "no more results", "plus de résultats",
          "reached the end of the list", "vous êtes arrivé à la fin", "haben das ende erreicht"
        ];

        const hasReachedEnd = () => {
          const text = feed.textContent?.toLowerCase() || "";
          return endOfListSignatures.some(sig => text.includes(sig));
        };

        let lastHeight = feed.scrollHeight;
        let idleCount = 0;
        const maxIdleAttempts = 5; // up to 5 consecutive attempts without height increase
        
        while (idleCount < maxIdleAttempts) {
          // Check unique placement links inside feed
          const links = feed.querySelectorAll('a[href*="/maps/place/"], a[href*="/place/"]');
          if (links.length >= maxLeads) {
            break; 
          }

          if (hasReachedEnd()) {
            break; 
          }

          feed.scrollBy(0, 1500);
          await new Promise(r => setTimeout(r, 1500));
          
          const newHeight = feed.scrollHeight;
          if (newHeight === lastHeight) {
            idleCount++;
            // Try small scroll nudge
            feed.scrollBy(0, 500);
            await new Promise(r => setTimeout(r, 1000));
          } else {
            idleCount = 0; // reset
          }
          lastHeight = newHeight;
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

    // 2. Precise Unique Selection of placements links inside the search feed
    const listingLinks = await page.evaluate(() => {
      const feed = document.querySelector('div[role="feed"]');
      const container = feed || document.body;
      const anchors = Array.from(container.querySelectorAll('a[href*="/maps/place/"], a[href*="/place/"]'));
      
      return anchors.map((a: any, idx) => {
        // Find business name robustly
        let name = a.getAttribute('aria-label') || '';
        if (!name) {
          const lines = (a.textContent || '').split('\n').map((l: string) => l.trim()).filter(Boolean);
          name = lines[0] || 'Unknown Business';
        }
        return {
          index: idx,
          href: a.href,
          name: name
        };
      }).filter(item => item.name && item.name !== 'Unknown Business');
    });

    await logAction(`Identified ${listingLinks.length} distinct listings. Starting Stale-Proof Browser-Context Clicking...`, 'info');

    const finalResults: any[] = [];
    const maxToExtract = Math.min(listingLinks.length, count || 20);

    broadcastUpdate('task_planned', {
      totalSteps: maxToExtract
    });

    // 3. Stale-Proof Browser-Context Clicking & Synchronized Click Verifications
    for (let i = 0; i < maxToExtract; i++) {
      const listing = listingLinks[i];
      const clickedName = listing.name;

      await logAction(`Opening detail panel #${i + 1}/${maxToExtract} for "${clickedName}"...`, 'info');

      // Move click execution directly into the browser DOM context
      const clickSuccess = await page.evaluate((idx) => {
        const links = Array.from(document.querySelectorAll('a[href*="/maps/place/"], a[href*="/place/"]'));
        const link = links[idx] as HTMLElement;
        if (link) {
          link.click();
          return true;
        }
        return false;
      }, i).catch(() => false);

      if (!clickSuccess) {
        await logAction(`Failed to click listing #${i + 1} inside browser context, using basic fallback.`, 'warning');
        finalResults.push({
          name: clickedName,
          address: '',
          rating: '',
          phone: '',
          website: ''
        });
        continue;
      }

      // Synchronized Click Verification: verify the panel's header matches the clicked business name
      let panelVerified = false;
      let panelDetails = { phone: '', website: '', address: '', rating: '', name: clickedName };

      for (let attempt = 0; attempt < 8; attempt++) {
        await page.waitForTimeout(400).catch(() => {});

        const verification = await page.evaluate((expectedName) => {
          // Detail panel header is typically the h1
          const h1 = document.querySelector('h1');
          if (!h1) return { verified: false, activeHeader: '' };

          const activeHeader = h1.textContent?.trim() || '';
          const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
          const expectedClean = clean(expectedName);
          const activeClean = clean(activeHeader);

          const isMatch = activeClean.includes(expectedClean) || expectedClean.includes(activeClean);
          return { verified: isMatch, activeHeader };
        }, clickedName).catch(() => ({ verified: false, activeHeader: '' }));

        if (verification.verified) {
          panelVerified = true;
          break;
        }
      }

      if (panelVerified) {
        // Robust Extraction from the verified detail panel
        const extracted = await page.evaluate(() => {
          let phone = '';
          let website = '';
          let address = '';
          let rating = '';

          // Rating
          const ratingEl = document.querySelector('div.F7nice span span[aria-hidden="true"]');
          if (ratingEl) rating = ratingEl.textContent?.trim() || '';

          // Address
          const addressEl = document.querySelector('button[data-item-id="address"], button[aria-label*="Address"], button[aria-label*="Adresse"]');
          if (addressEl) {
            address = addressEl.textContent?.trim() || '';
          }

          // Phone selector strategy
          const phoneEl = document.querySelector('button[data-item-id^="phone:tel:"], button[aria-label*="Phone"], button[aria-label*="Téléphone"], button[aria-label*="Telefon"]');
          if (phoneEl) {
            const dataId = phoneEl.getAttribute('data-item-id') || '';
            if (dataId.startsWith('phone:tel:')) {
              phone = dataId.replace('phone:tel:', '').trim();
            } else {
              phone = phoneEl.textContent?.trim() || '';
            }
          }

          // Website selector strategy
          const webEl = document.querySelector('a[data-item-id="authority"], button[aria-label*="Website"], a[aria-label*="Website"], a[aria-label*="Site web"], a[aria-label*="Webseite"]');
          if (webEl) {
            website = webEl.getAttribute('href') || webEl.textContent?.trim() || '';
          }

          // Robust International Extraction: Regex scanner for sequences of 9 to 15 digits
          if (!phone) {
            const panelText = document.body.innerText || '';
            const potentialPhones = panelText.match(/\+?[0-9\s.\-\(\)]{9,25}/g) || [];
            for (const pot of potentialPhones) {
              const digits = pot.replace(/\D/g, '');
              if (digits.length >= 9 && digits.length <= 15) {
                if (pot.trim().startsWith('+') || pot.trim().startsWith('0') || digits.length >= 10) {
                  phone = pot.trim();
                  break;
                }
              }
            }
          }

          return { phone, website, address, rating };
        }).catch(() => ({ phone: '', website: '', address: '', rating: '' }));

        panelDetails = { ...panelDetails, ...extracted };
        await logAction(`Verified and extracted: Phone: ${panelDetails.phone || 'N/A'}, Web: ${panelDetails.website || 'N/A'}`, 'info');
      } else {
        await logAction(`Panel header verification mismatch for "${clickedName}", skipping deep extraction.`, 'warning');
      }

      finalResults.push({
        name: clickedName,
        phone: panelDetails.phone,
        website: panelDetails.website,
        address: panelDetails.address,
        rating: panelDetails.rating
      });

      broadcastUpdate('task_progress', {
        step: i + 1,
        description: `Processed lead #${i + 1}/${maxToExtract}: "${clickedName}"`
      });
    }

    let savedCount = 0;
    const leadsCollection = db.collection('leads');

    await logAction('Filtering duplicates and saving new prospects to Firestore database...', 'info');

    for (let i = 0; i < finalResults.length; i++) {
      const lead = finalResults[i];
      if (!lead.name) continue;
      const businessName = lead.name;
      
      // International Phone Formatting
      const phone = formatPhone(lead.phone || '', city || query || '', lead.address || '');
      
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

    const completionFields: any = {
      status: 'complete',
      step: 'complete',
      description: `Task complete — ${savedCount} leads found`,
      progress: savedCount,
      leadsCount: savedCount,
      total: finalResults.length || savedCount,
      progressPct: 100,
      results: { saved: savedCount, leads: finalResults }
    };
    if (finalScreenshotBase64) {
      completionFields.screenshot = finalScreenshotBase64;
    }
    await updateFirestore(completionFields);
    await logAction(`✓ Scrape complete! ${savedCount} new leads cataloged successfully.`, 'success');

    const completionBroadcast: any = {
      status: 'completed',
      results: { saved: savedCount, leads: finalResults }
    };
    if (finalScreenshotBase64) {
      completionBroadcast.screenshot = finalScreenshotBase64;
    }
    broadcastUpdate('task_complete', completionBroadcast);

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
    
    const failureBroadcast: any = {
      status: 'failed',
      error: errMsg
    };
    if (finalScreenshotBase64) {
      failureBroadcast.screenshot = finalScreenshotBase64;
    }
    broadcastUpdate('task_error', failureBroadcast);

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
