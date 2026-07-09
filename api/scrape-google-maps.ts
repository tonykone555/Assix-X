import { db } from '../firebase-client-wrapper';
import { launchBrowserbaseSession } from './_lib/browserbaseSession';

export const config = { maxDuration: 300 };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, city, count, taskId, userId } = req.body;
  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId' });
  }

  let session: any;
  let browser: any;

  const updateFirestore = async (fields: any) => {
    try {
      await db.collection('tasks').doc(taskId).update(fields);
      await db.collection('assix_tasks').doc(taskId).update(fields);
    } catch (e) {
      console.warn('Firestore write failed:', e);
    }
  };

  try {
    const conn = await launchBrowserbaseSession();
    session = conn.session;
    browser = conn.browser;
    const page = conn.page;

    const initialTask = {
      taskId,
      taskType: 'google_maps_scrape',
      label: `Google Maps Scrape [${query} in ${city}]`,
      config: { query, city, count },
      status: 'running',
      step: 'starting',
      description: 'Browser starting...',
      steelDebugUrl: conn.debugUrl, // reuse existing field name LiveViewer already checks
      leadsCount: 0,
      progress: 0,
      total: count || 20,
      createdAt: new Date().toISOString()
    };

    await db.collection('tasks').doc(taskId).set(initialTask);
    await db.collection('assix_tasks').doc(taskId).set(initialTask);

    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query + ' ' + city)}`;
    
    await updateFirestore({
      step: 'navigating',
      description: `Navigating to search page...`
    });

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000); // Wait for results to stabilize

    let screenshot = '';
    try {
      screenshot = (await page.screenshot({ type: 'jpeg', quality: 50 })).toString('base64');
    } catch (e) {
      screenshot = '';
    }

    await updateFirestore({
      step: 'scrolling',
      description: 'Scrolling results pane...',
      ...(screenshot ? { screenshot } : {})
    });

    // Try to scroll the feed list
    try {
      await page.evaluate(async () => {
        const feed = document.querySelector('div[role="feed"]');
        if (feed) {
          for (let i = 0; i < 5; i++) {
            feed.scrollBy(0, 1000);
            await new Promise(r => setTimeout(r, 1000));
          }
        } else {
          window.scrollBy(0, 1000);
          await new Promise(r => setTimeout(r, 1000));
        }
      });
    } catch (scrollErr) {
      console.warn('Scrolling failed:', scrollErr);
    }

    try {
      screenshot = (await page.screenshot({ type: 'jpeg', quality: 50 })).toString('base64');
    } catch (e) {
      screenshot = '';
    }

    await updateFirestore({
      step: 'extracting',
      description: 'Extracting business leads...',
      ...(screenshot ? { screenshot } : {})
    });

    // Direct evaluation extraction
    const results = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/maps/place/"]'));
      return links.map(link => {
        const container = link.closest('div[role="article"]') || link.parentElement?.parentElement?.parentElement;
        const name = container?.querySelector('div.fontHeadlineLarge, h1, .qBF1Pd')?.textContent?.trim() || link.getAttribute('aria-label') || '';
        const textContent = container?.textContent || '';
        const phoneMatch = textContent.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        const phone = phoneMatch ? phoneMatch[0] : '';
        const ratingElement = container?.querySelector('span.MW4etd');
        const rating = ratingElement ? ratingElement.textContent?.trim() : '';
        const websiteElement = container?.querySelector('a[data-value="Site Web"], a[data-item-id="authority"]');
        const website = websiteElement ? websiteElement.getAttribute('href') || '' : '';
        const addressElement = container?.querySelector('button[data-item-id*="address"]')?.textContent?.trim() || '';

        return {
          businessName: name,
          phone: phone,
          website: website,
          rating: rating,
          address: addressElement || textContent.replace(/\s+/g, ' ').trim().slice(0, 150)
        };
      }).filter(item => item.businessName);
    });

    // Limit to requested count
    const finalResults = results.slice(0, count || 20);

    let savedCount = 0;
    const leadsCollection = db.collection('leads');

    for (const lead of finalResults) {
      const businessName = lead.businessName || 'Google Maps Lead';
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
        const errMsg = `Failed to add Google Maps lead: ${addErr?.message || String(addErr)}`;
        await updateFirestore({ description: errMsg });
      }
    }

    try {
      screenshot = (await page.screenshot({ type: 'jpeg', quality: 50 })).toString('base64');
    } catch (e) {
      screenshot = '';
    }

    const finalUpdate = {
      status: 'complete',
      step: 'complete',
      description: `Task complete — ${savedCount} leads found`,
      leadsCount: savedCount,
      results: { saved: savedCount, leads: finalResults },
      ...(screenshot ? { screenshot } : {})
    };

    await updateFirestore(finalUpdate);
    return res.status(200).json({ success: true, taskId, savedCount });

  } catch (err: any) {
    console.error('Google Maps task error:', err);
    let errMsg = err?.message || String(err);
    if (errMsg.includes('limit') || errMsg.includes('quota')) {
      errMsg = 'Browserbase free tier limit reached this month.';
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
      if (browser) await browser.close();
    } catch (e) {}
  }
}
