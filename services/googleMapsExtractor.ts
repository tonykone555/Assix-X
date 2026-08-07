import { formatPhone } from './firebase';
import { db } from '../firebase-client-wrapper';

async function logAction(taskId: string, msg: string, type = 'info') {
  if (!taskId) return;
  const entry = { time: new Date().toLocaleTimeString('en-GB'), msg, type, timestamp: Date.now() };
  try {
    await db.collection('assix_tasks').doc(taskId).collection('logs').add(entry);
  } catch (e) {
    console.error('Firestore log error:', e);
  }
}

export async function extractGoogleMapsLeadsReal(
  page: any,
  maxLeads: number,
  taskId?: string,
  searchQuery?: string
): Promise<any[]> {
  const leads: any[] = [];
  let listings = await page.$$('div[role="feed"] > div').catch(() => []);
  if (!listings || listings.length === 0) {
    listings = await page.$$('div[role="feed"] .Nv2PK, div[role="article"]').catch(() => []);
  }

  // Handle single place page directly if no feed listings found
  if (listings.length === 0) {
    const singleName = await page.$eval('h1', (el: any) => el.textContent?.trim()).catch(() => null);
    if (singleName && !singleName.includes('Google Maps')) {
      if (taskId) await logAction(taskId, `Single place page detected for "${singleName}". Extracting directly...`, 'info');

      let phone = await page.$eval('button[data-item-id*="phone"]', (el: any) => el.getAttribute('aria-label')?.replace(/[^\d+]/g, '') || null).catch(() => null);
      if (!phone) {
        const panelText = await page.$eval('body', (el: any) => el.innerText).catch(() => '');
        const phoneMatch = panelText.match(/(\+?\d[\d\s().-]{7,}\d)/);
        phone = phoneMatch ? phoneMatch[0] : null;
      }

      let website: string | null = null;
      const websiteSelectors = [
        'a[data-item-id="authority"]',
        'a[aria-label*="Website" i]',
        'a[aria-label*="Site Web" i]',
        'a[data-tooltip*="Website" i]'
      ];
      for (const sel of websiteSelectors) {
        const href = await page.$eval(sel, (el: any) => el.href).catch(() => null);
        if (href && !href.includes('google.com')) {
          website = href;
          break;
        }
      }

      const address = await page.$eval('button[data-item-id="address"]', (el: any) => el.getAttribute('aria-label')?.replace('Address: ', '') || el.textContent?.trim() || null).catch(() => null);
      const rating = await page.$eval('span.MW434e, span.ZkP33', (el: any) => el.textContent).catch(() => '');
      const reviewsCount = await page.$eval('span.UY7F9, span.R432e', (el: any) => el.textContent?.replace(/[()]/g, '')).catch(() => '');

      const formattedPhone = phone ? formatPhone(phone, searchQuery || '', address || '') : null;
      leads.push({
        name: singleName,
        businessName: singleName,
        company: singleName,
        phone: formattedPhone || null,
        website: website || null,
        address: address || null,
        rating: rating || '',
        reviewsCount: reviewsCount || '',
        photos: [],
        reviews: [],
        email: ''
      });
      return leads;
    }
  }

  for (const listing of listings.slice(0, maxLeads)) {
    try {
      await listing.click().catch(() => {});
      await new Promise(r => setTimeout(r, 1200));

      const name = await page.$eval('h1', (el: any) => el.textContent).catch(() => null);
      if (!name) continue;

      // Real phone extraction: dedicated button first
      let phone = await page.$eval(
        'button[data-item-id*="phone"]',
        (el: any) => el.getAttribute('aria-label')?.replace(/[^\d+]/g, '') || null
      ).catch(() => null);

      // Fallback: regex scan of the detail panel text
      if (!phone) {
        const panelText = await page.$eval('[role="main"]', (el: any) => el.innerText).catch(() => '');
        const phoneMatch = panelText.match(/(\+?\d[\d\s().-]{7,}\d)/);
        phone = phoneMatch ? phoneMatch[0] : null;
      }

      // Explicit render-wait for detail panel elements
      await new Promise(r => setTimeout(r, 800));

      // Real website link extraction with multi-selector fallback chain
      let website: string | null = null;
      const websiteSelectors = [
        'a[data-item-id="authority"]',
        'a[aria-label*="Website" i]',
        'a[aria-label*="Site Web" i]',
        'a[data-tooltip*="Website" i]',
        'a[data-tooltip*="Site Web" i]',
      ];
      for (const sel of websiteSelectors) {
        const href = await page.$eval(sel, (el: any) => el.href).catch(() => null);
        if (href && !href.includes('google.com')) {
          website = href;
          break;
        }
      }
      if (taskId && !website) {
        await logAction(taskId, `No website found for ${name} after trying ${websiteSelectors.length} selectors`, 'info');
      }

      // REAL fetch fallback: if website exists but phone still missing, fetch it directly
      if (!phone && website) {
        if (taskId) await logAction(taskId, `No phone on Maps for ${name}, fetching ${website} directly...`, 'info');
        try {
          const siteRes = await fetch(website, { signal: AbortSignal.timeout(8000) });
          const html = await siteRes.text();
          const sitePhoneMatch = html.match(/(\+?\d[\d\s().-]{7,}\d)/);
          if (sitePhoneMatch) phone = sitePhoneMatch[0];
        } catch (fetchErr: any) {
          if (taskId) await logAction(taskId, `Website fetch failed for ${name}: ${fetchErr.message}`, 'warning');
        }
      }

      const address = await page.$eval('button[data-item-id="address"]', (el: any) => el.getAttribute('aria-label')?.replace('Address: ', '') || null).catch(() => null);
      const rating = await page.$eval('span.MW434e, span.ZkP33', (el: any) => el.textContent).catch(() => '');
      const reviewsCount = await page.$eval('span.UY7F9, span.R432e', (el: any) => el.textContent?.replace(/[()]/g, '')).catch(() => '');

      // Extract high-resolution Google Maps business photos
      const photos = await page.evaluate(() => {
        const images: string[] = [];
        const selectors = [
          'button[aria-label*="Photo"] img',
          'div[role="region"] img',
          'button[data-photo-index] img',
          'img[src*="googleusercontent.com"]',
          'img[src*="ggpht.com"]'
        ];
        const elements = Array.from(document.querySelectorAll(selectors.join(',')));
        for (const el of elements) {
          const src = (el as HTMLImageElement).src || (el as HTMLImageElement).getAttribute('src') || '';
          if (src && (src.includes('googleusercontent.com') || src.includes('ggpht.com')) && !src.includes('avatar') && !src.includes('icon') && !src.includes('streetview')) {
            const highRes = src.replace(/=w\d+-h\d+-[a-z0-9-]+/gi, '=w1200-h800-k-no').replace(/=s\d+-[a-z0-9-]+/gi, '=s1200');
            if (!images.includes(highRes)) {
              images.push(highRes);
            }
          }
        }
        return images.slice(0, 8);
      }).catch(() => []);

      // Extract reviews from Google Maps listing
      const reviews = await page.evaluate(() => {
        const list: Array<{ name: string; text: string; rating: number; date?: string }> = [];
        const reviewNodes = Array.from(document.querySelectorAll('div.jftiEf, div.My4L3d, div[data-review-id]'));
        for (const node of reviewNodes.slice(0, 6)) {
          const nameEl = node.querySelector('.d4r55, .X43p2b, .fontBodyMedium');
          const textEl = node.querySelector('.wiN1D, .My4L3d, .K310vd, .zSc2A');
          const ratingEl = node.querySelector('span.kvMif, span[aria-label*="star"], span[aria-label*="étoile"]');
          const timeEl = node.querySelector('.rN83ee, .r432e');

          const name = nameEl?.textContent?.trim() || 'Verified Client';
          const text = textEl?.textContent?.trim() || '';
          let rVal = 5;
          if (ratingEl) {
            const aria = ratingEl.getAttribute('aria-label') || ratingEl.textContent || '';
            const match = aria.match(/(\d([\.,]\d)?)/);
            if (match) rVal = parseFloat(match[1].replace(',', '.'));
          }

          if (text && text.length > 5) {
            list.push({
              name,
              text,
              rating: rVal,
              date: timeEl?.textContent?.trim() || ''
            });
          }
        }
        return list;
      }).catch(() => []);

      const formattedPhone = phone ? formatPhone(phone, searchQuery || '', address || '') : null;

      leads.push({ 
        name, 
        businessName: name,
        company: name,
        phone: formattedPhone || null, 
        website: website || null, 
        address: address || null,
        rating: rating || '',
        reviewsCount: reviewsCount || '',
        photos: photos || [],
        reviews: reviews || [],
        email: ''
      });

      if (taskId) await logAction(taskId, `Extracted: ${name} — phone: ${formattedPhone ? formattedPhone : 'not found'}, website: ${website ? 'found' : 'not found'}, photos: ${photos.length}, reviews: ${reviews.length}`, 'info');
    } catch (err: any) {
      if (taskId) await logAction(taskId, `Skipped one listing: ${err.message}`, 'warning');
      continue;
    }
  }

  return leads;
}
