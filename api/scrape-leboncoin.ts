import { db } from '../firebase-client-wrapper';
import { launchBrowserbaseSession } from './_lib/browserbaseSession';

export const config = { maxDuration: 300 };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category, city, count, taskId, userId } = req.body;
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
      taskType: 'leboncoin_scrape',
      label: `Leboncoin Scrape [${category} in ${city}]`,
      config: { category, city, count },
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

    const searchUrl = `https://www.leboncoin.fr/recherche?category=${encodeURIComponent(category)}&locations=${encodeURIComponent(city)}`;
    
    await updateFirestore({
      step: 'navigating',
      description: `Navigating to Leboncoin search page...`
    });

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000); // Wait for page elements to load

    let screenshot = '';
    try {
      screenshot = (await page.screenshot({ type: 'jpeg', quality: 50 })).toString('base64');
    } catch (e) {
      screenshot = '';
    }

    await updateFirestore({
      step: 'scrolling',
      description: 'Scrolling to load more listings...',
      ...(screenshot ? { screenshot } : {})
    });

    // Try scrolling a few times
    try {
      await page.evaluate(async () => {
        for (let i = 0; i < 4; i++) {
          window.scrollBy(0, 1000);
          await new Promise(r => setTimeout(r, 1000));
        }
      });
    } catch (scrollErr) {
      console.warn('Scrolling Leboncoin failed:', scrollErr);
    }

    try {
      screenshot = (await page.screenshot({ type: 'jpeg', quality: 50 })).toString('base64');
    } catch (e) {
      screenshot = '';
    }

    await updateFirestore({
      step: 'extracting',
      description: 'Extracting listings details...',
      ...(screenshot ? { screenshot } : {})
    });

    // Direct evaluation extraction
    const results = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).filter(a => {
        const href = a.getAttribute('href') || '';
        return href.includes('/recherche/') || href.includes('/ad/') || href.includes('/locations/') || href.includes('/ventes_immobilieres/');
      });
      
      return links.map(link => {
        const title = link.querySelector('h2, h3, [class*="title"], [class*="Title"]')?.textContent?.trim() || link.getAttribute('aria-label') || '';
        const price = link.querySelector('[class*="price"], [class*="Price"], [data-qa-id*="price"]')?.textContent?.trim() || '';
        const location = link.querySelector('[class*="location"], [class*="Location"]')?.textContent?.trim() || '';
        const url = link.href || '';
        
        return {
          title,
          price,
          location,
          url
        };
      }).filter(item => item.title && item.url);
    });

    // Limit to requested count
    const finalResults = results.slice(0, count || 20);

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
        const errMsg = `Failed to add Leboncoin lead: ${addErr?.message || String(addErr)}`;
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
      description: `Task complete — ${savedCount} leboncoin listings found`,
      leadsCount: savedCount,
      results: { saved: savedCount, leads: finalResults },
      ...(screenshot ? { screenshot } : {})
    };

    await updateFirestore(finalUpdate);
    return res.status(200).json({ success: true, taskId, savedCount });

  } catch (err: any) {
    console.error('Leboncoin task error:', err);
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
