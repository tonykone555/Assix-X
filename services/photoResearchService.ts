/**
 * photoResearchService.ts
 * Advanced Photo Research & Extraction Service
 * Combines Deep Google Maps Profile Scraping + Pinterest / Web Image Search + Unsplash Niche Collections
 */

export interface SearchedPhoto {
  url: string;
  title: string;
  source?: string;
  width?: number;
  height?: number;
}

/**
 * Perform a two-step web / Pinterest image search (DuckDuckGo Image Engine)
 * Returns high-resolution real photos from the web & Pinterest
 */
export async function searchWebPhotos(query: string, count: number = 20): Promise<SearchedPhoto[]> {
  try {
    const searchTerms = `${query} hd photo`.trim();
    // Step 1: Obtain vqd token
    const res1 = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(searchTerms)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    const text1 = await res1.text();
    const vqdMatch = text1.match(/vqd=([0-9-]+)/) || text1.match(/vqd=\"([0-9-]+)\"/);
    if (!vqdMatch) {
      console.warn('[Photo Research] No vqd token returned from DDG, falling back to Unsplash topic search');
      return getUnsplashFallbackPhotos(query, count);
    }

    const vqd = vqdMatch[1];

    // Step 2: Query image search API with vqd
    const res2 = await fetch(`https://duckduckgo.com/i.js?q=${encodeURIComponent(searchTerms)}&vqd=${vqd}&o=json&p=1&f=,,,&ia=images`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://duckduckgo.com/'
      }
    });

    const data: any = await res2.json();
    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      return getUnsplashFallbackPhotos(query, count);
    }

    const photos: SearchedPhoto[] = [];
    for (const item of data.results) {
      const imgUrl = item.image || item.thumbnail || '';
      if (imgUrl && typeof imgUrl === 'string' && imgUrl.startsWith('http') && !imgUrl.includes('.svg') && !imgUrl.includes('logo') && !imgUrl.includes('icon')) {
        // Skip tiny thumbnails if original image is available
        photos.push({
          url: imgUrl,
          title: item.title || query,
          source: item.source || 'web',
          width: item.width,
          height: item.height
        });
        if (photos.length >= count) break;
      }
    }

    if (photos.length < count) {
      const fallback = getUnsplashFallbackPhotos(query, count - photos.length);
      photos.push(...fallback);
    }

    return photos;
  } catch (err: any) {
    console.error('[Photo Research Error]:', err.message);
    return getUnsplashFallbackPhotos(query, count);
  }
}

/**
 * Deep Scrape Google Maps Profile Photos
 * Clicks into the Photos tab and iteratively scrolls the gallery grid to extract ALL photos
 */
export async function deepScrapeGoogleMapsPhotos(
  companyName: string,
  addressOrCity: string,
  launchSessionFn: () => Promise<any>
): Promise<string[]> {
  const searchQuery = `${companyName} ${addressOrCity}`.trim();
  console.log(`[Deep Google Photos Scraper] Starting deep photo search for: "${searchQuery}"`);

  let stagehandInstance: any = null;
  let photos: string[] = [];

  try {
    const { stagehand } = await launchSessionFn();
    stagehandInstance = stagehand;
    const page = stagehand.page || (stagehand.context?.activePage ? stagehand.context.activePage() : stagehand.context?.pages?.()[0]);

    if (page) {
      const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
      await page.goto(mapUrl, { timeoutMs: 25000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 2000));

      // 1. Click first listing if multiple results feed is present
      await page.evaluate(() => {
        const listing = document.querySelector('div[role="feed"] > div, div[role="feed"] .Nv2PK, div[role="article"]') as HTMLElement;
        if (listing) listing.click();
      }).catch(() => {});
      await new Promise(r => setTimeout(r, 2000));

      // 2. Click "Photos" tab or cover photo button to open full gallery grid
      const photoOpened = await page.evaluate(() => {
        // Look for buttons that open photos gallery
        const candidates = Array.from(document.querySelectorAll('button, a, div[role="button"]')) as HTMLElement[];
        for (const el of candidates) {
          const label = (el.getAttribute('aria-label') || el.textContent || '').toLowerCase();
          const jsaction = el.getAttribute('jsaction') || '';
          if (
            label.includes('photo') ||
            label.includes('photos') ||
            label.includes('voir les') ||
            label.includes('all photos') ||
            jsaction.includes('photo') ||
            el.classList.contains('ao3pGe')
          ) {
            el.click();
            return true;
          }
        }
        return false;
      }).catch(() => false);

      await new Promise(r => setTimeout(r, 2500));

      // 3. Iteratively scroll the photo gallery pane to lazy-load DOM image elements
      for (let scrollStep = 0; scrollStep < 8; scrollStep++) {
        await page.evaluate(() => {
          const scrollables = Array.from(document.querySelectorAll('div.m6QE1c, div[role="region"], div.section-layout, div.D3LThd, div.G19B3b')) as HTMLElement[];
          for (const s of scrollables) {
            s.scrollTop += 1200;
          }
        }).catch(() => {});
        await new Promise(r => setTimeout(r, 600));
      }

      // 4. Extract all image URLs from img tags, background-images, and data-photo elements
      photos = await page.evaluate(() => {
        const foundUrls: string[] = [];

        function cleanAndBoostUrl(urlStr: string): string | null {
          if (!urlStr || typeof urlStr !== 'string') return null;
          let cleaned = urlStr.trim();
          if (cleaned.startsWith('url(')) {
            cleaned = cleaned.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
          }
          if (
            (cleaned.includes('googleusercontent.com') || cleaned.includes('ggpht.com')) &&
            !cleaned.includes('avatar') &&
            !cleaned.includes('icon') &&
            !cleaned.includes('streetview') &&
            !cleaned.includes('maps/vt')
          ) {
            // Upgrade thumbnail to high-res 1600x1200
            const highRes = cleaned
              .replace(/=w\d+-h\d+-[a-z0-9-]+/gi, '=w1600-h1200-k-no')
              .replace(/=s\d+-[a-z0-9-]+/gi, '=s1600')
              .replace(/=w\d+-h\d+/gi, '=w1600-h1200')
              .replace(/=s\d+/gi, '=s1600');
            return highRes;
          }
          return null;
        }

        // a) Query <img> elements
        const imgEls = Array.from(document.querySelectorAll('img'));
        for (const img of imgEls) {
          const src = img.src || img.getAttribute('src') || img.getAttribute('data-src') || '';
          const boosted = cleanAndBoostUrl(src);
          if (boosted && !foundUrls.includes(boosted)) {
            foundUrls.push(boosted);
          }
        }

        // b) Query elements with style background-image
        const allNodes = Array.from(document.querySelectorAll('*[style*="background-image"], *[data-photo-index], a[data-photo-index]'));
        for (const node of allNodes) {
          const style = node.getAttribute('style') || '';
          const bgMatch = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
          if (bgMatch) {
            const boosted = cleanAndBoostUrl(bgMatch[1]);
            if (boosted && !foundUrls.includes(boosted)) {
              foundUrls.push(boosted);
            }
          }
        }

        return foundUrls;
      }).catch(() => []);

    }
  } catch (err: any) {
    console.error('[Deep Google Photos Scraper Error]:', err.message);
  } finally {
    if (stagehandInstance) {
      stagehandInstance.close().catch(() => {});
    }
  }

  console.log(`[Deep Google Photos Scraper] Found ${photos.length} photos in Google profile gallery.`);
  return photos;
}

/**
 * Fallback Unsplash topic photos by business niche/query
 */
export function getUnsplashFallbackPhotos(query: string, count: number = 15): SearchedPhoto[] {
  const lower = query.toLowerCase();

  const collections: Record<string, string[]> = {
    food: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=800&fit=crop'
    ],
    realestate: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop'
    ],
    crafts: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=800&fit=crop'
    ]
  };

  let pool = collections.crafts;
  if (lower.includes('restau') || lower.includes('traite') || lower.includes('food') || lower.includes('bistro') || lower.includes('pizza') || lower.includes('cater')) {
    pool = collections.food;
  } else if (lower.includes('immo') || lower.includes('real estate') || lower.includes('maison') || lower.includes('appartement')) {
    pool = collections.realestate;
  }

  return pool.slice(0, count).map((url, i) => ({
    url,
    title: `${query} photo #${i + 1}`,
    source: 'unsplash'
  }));
}
