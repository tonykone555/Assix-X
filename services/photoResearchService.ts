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
 * Specifically search Pinterest & web aesthetic photos for a query
 */
export async function searchPinterestPhotos(query: string, count: number = 20): Promise<SearchedPhoto[]> {
  const pinterestQuery = `site:pinterest.com ${query} photo design`.trim();
  return searchWebPhotos(pinterestQuery, count);
}

/**
 * Automatically searches Pinterest & HD Web Photos for a given business niche
 * and fills all empty/default image slots across the site content so it NEVER comes up empty!
 */
export async function autoFillContentImagesWithPinterest(content: any, lead: any): Promise<any> {
  const updated = { ...content };
  const niche = content?.nicheOverride || lead?.niche || lead?.sector || lead?.category || lead?.source || 'services';
  const companyName = lead?.name || lead?.companyName || lead?.company || content?.brandName || 'Business';
  
  // Search query prioritizing NICHE FIRST
  const primaryNicheQuery = `${niche} pinterest hd photo design architecture`.trim();
  const searchQuery = `${niche} ${companyName} pinterest photo design`.trim();
  
  let researched: SearchedPhoto[] = [];
  try {
    const nichePhotos = await searchWebPhotos(primaryNicheQuery, 16);
    const companyPhotos = await searchWebPhotos(searchQuery, 16);
    researched = [...nichePhotos, ...companyPhotos];
  } catch (e) {
    researched = getUnsplashFallbackPhotos(primaryNicheQuery, 24);
  }

  if (researched.length === 0) {
    researched = getUnsplashFallbackPhotos(niche, 24);
  }

  const urls = Array.from(new Set(researched.map(r => r.url).filter(u => !!u)));
  if (urls.length === 0) return updated;

  // 1. Ensure photos array has photos
  const existingPhotos = Array.isArray(updated.photos) ? updated.photos : [];
  updated.photos = Array.from(new Set([...urls, ...existingPhotos]));

  let imgIdx = 0;
  const nextPhoto = () => urls[imgIdx++ % urls.length];

  // 2. Hero Image
  if (!updated.heroImage || updated.heroImage.includes('placeholder') || updated.heroImage === '') {
    updated.heroImage = nextPhoto();
  }

  // 3. About Image
  if (!updated.aboutImage || updated.aboutImage.includes('placeholder') || updated.aboutImage === '') {
    updated.aboutImage = nextPhoto();
  }

  // 4. Cutout & Feature Images
  if (!updated.showcaseCarImage || updated.showcaseCarImage.includes('placeholder')) {
    updated.showcaseCarImage = nextPhoto();
  }
  if (!updated.notebookImage || updated.notebookImage.includes('placeholder')) {
    updated.notebookImage = nextPhoto();
  }
  if (!updated.tabletImage || updated.tabletImage.includes('placeholder')) {
    updated.tabletImage = nextPhoto();
  }
  if (!updated.program1Image || updated.program1Image.includes('placeholder')) {
    updated.program1Image = nextPhoto();
  }
  if (!updated.program2Image || updated.program2Image.includes('placeholder')) {
    updated.program2Image = nextPhoto();
  }
  if (!updated.steeringWheelImage || updated.steeringWheelImage.includes('placeholder')) {
    updated.steeringWheelImage = nextPhoto();
  }
  if (!updated.motorcycleImage || updated.motorcycleImage.includes('placeholder')) {
    updated.motorcycleImage = nextPhoto();
  }
  if (!updated.card1Image || updated.card1Image.includes('placeholder')) {
    updated.card1Image = nextPhoto();
  }
  if (!updated.card2Image || updated.card2Image.includes('placeholder')) {
    updated.card2Image = nextPhoto();
  }
  if (!updated.card3Image || updated.card3Image.includes('placeholder')) {
    updated.card3Image = nextPhoto();
  }

  // 5. Gallery Images
  if (!Array.isArray(updated.galleryImages) || updated.galleryImages.length < 3) {
    updated.galleryImages = [nextPhoto(), nextPhoto(), nextPhoto(), nextPhoto()];
  }

  // 6. Service Cards
  if (Array.isArray(updated.services)) {
    updated.services = updated.services.map((srv: any) => {
      if (!srv.image || srv.image.includes('placeholder') || srv.image === '') {
        return { ...srv, image: nextPhoto() };
      }
      return srv;
    });
  }

  // 7. Portfolio Cards
  if (Array.isArray(updated.portfolio)) {
    updated.portfolio = updated.portfolio.map((port: any) => {
      if (!port.image || port.image.includes('placeholder') || port.image === '') {
        return { ...port, image: nextPhoto() };
      }
      return port;
    });
  }

  return updated;
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

export interface SearchedVideo {
  url: string;
  title: string;
  source: string;
  thumbnail?: string;
}

const TRANSLATIONS: Record<string, string> = {
  peintre: 'painter',
  peinture: 'painter',
  toiture: 'roof',
  couvreur: 'roof',
  renovation: 'renovation',
  construction: 'construction',
  restoration: 'renovation',
  nettoyage: 'cleaning',
  menage: 'cleaning',
  restaurant: 'restaurant',
  barber: 'barber',
  coiffeur: 'barber',
  garage: 'mechanic',
  mecanicien: 'mechanic',
  auto: 'car',
  immobilier: 'real-estate',
  maison: 'house',
  bureau: 'office',
  comptable: 'office',
  wellness: 'yoga',
  sante: 'yoga',
  sport: 'yoga'
};

function getProxiedUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('/api/leads/video-proxy')) return url;
  return `/api/leads/video-proxy?url=${encodeURIComponent(url)}`;
}

/**
 * Advanced Stock Video Curation and search engine.
 * Delivers working, high-resolution direct .mp4 streaming files for website hero backgrounds and showcases.
 */
export async function searchWebVideos(query: string, source: string = 'mixkit', page: number = 1): Promise<SearchedVideo[]> {
  const lower = query.toLowerCase();
  
  // Find clean English category slug
  let term = lower.trim();
  for (const [key, val] of Object.entries(TRANSLATIONS)) {
    if (lower.includes(key)) {
      term = val;
      break;
    }
  }

  const results: SearchedVideo[] = [];

  try {
    if (source === 'pexels' && process.env.PEXELS_API_KEY) {
      console.log(`[Video API] Querying Pexels for "${term}", page ${page}`);
      const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(term)}&per_page=15&page=${page}`, {
        headers: { 'Authorization': process.env.PEXELS_API_KEY }
      });
      if (res.ok) {
        const data = await res.json();
        for (const video of data.videos || []) {
          const file = video.video_files?.find((f: any) => f.quality === 'hd') || video.video_files?.[0];
          if (file) {
            results.push({
              url: getProxiedUrl(file.link),
              title: `Pexels Video #${video.id}`,
              source: 'pexels',
              thumbnail: video.image
            });
          }
        }
      }
      return results;
    }
    
    if (source === 'pixabay' && process.env.PIXABAY_API_KEY) {
      console.log(`[Video API] Querying Pixabay for "${term}", page ${page}`);
      const res = await fetch(`https://pixabay.com/api/videos/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(term)}&page=${page}`);
      if (res.ok) {
        const data = await res.json();
        for (const hit of data.hits || []) {
          const file = hit.videos?.large || hit.videos?.medium || hit.videos?.small;
          if (file?.url) {
            results.push({
              url: getProxiedUrl(file.url),
              title: `Pixabay Video #${hit.id}`,
              source: 'pixabay',
              thumbnail: hit.picture_id ? `https://i.vimeocdn.com/video/${hit.picture_id}_640x360.jpg` : undefined
            });
          }
        }
      }
      return results;
    }

    // Default to Mixkit web scrape (No pagination naturally natively available via simple fetch without API, but we just return results)
    const slug = encodeURIComponent(term.replace(/\s+/g, '-'));
    console.log(`[Video Scraping] Querying Mixkit page for term: "${term}" (slug: "${slug}")`);
    const res = await fetch(`https://mixkit.co/free-stock-video/${slug}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (res.status === 200) {
      const html = await res.text();
      // Match all direct stock video mp4 assets of various sizes (-1080.mp4, -720.mp4, -360.mp4, etc.)
      const mp4s = html.match(/https:\/\/assets\.mixkit\.co\/videos\/\d+\/\d+-[^\s\"']+\.mp4/g) || [];
      const uniqueMp4s = Array.from(new Set(mp4s));

      // Group by video ID to select the highest resolution available
      const videoMap = new Map<string, { url: string; resolution: number }>();

      for (const mp4 of uniqueMp4s) {
        const match = mp4.match(/\/videos\/(\d+)\//);
        if (match) {
          const id = match[1];
          let resolution = 360;
          if (mp4.includes('-1080')) resolution = 1080;
          else if (mp4.includes('-720')) resolution = 720;
          else if (mp4.includes('-360')) resolution = 360;
          else if (mp4.includes('large') || mp4.includes('preview')) resolution = 480;

          const existing = videoMap.get(id);
          if (!existing || resolution > existing.resolution) {
            videoMap.set(id, { url: mp4, resolution });
          }
        }
      }

      for (const [id, info] of videoMap.entries()) {
        results.push({
          url: getProxiedUrl(info.url),
          title: `${query.charAt(0).toUpperCase() + query.slice(1)} - Loop #${id}`,
          source: 'mixkit',
          thumbnail: `https://assets.mixkit.co/videos/${id}/${id}-thumb-720-0.jpg`
        });
      }

      // If no standard assets found, fallback to legacy large previews
      if (results.length === 0) {
        const previewMp4s = html.match(/https:\/\/assets\.mixkit\.co\/videos\/preview\/[^\s\"']+\.mp4/g) || [];
        const uniquePreviews = Array.from(new Set(previewMp4s));
        for (const mp4 of uniquePreviews) {
          const nameMatch = mp4.match(/preview\/mixkit-([^\s\"']+)-large\.mp4/);
          const prettyName = nameMatch ? nameMatch[1].replace(/-/g, ' ') : 'Premium Scene';
          results.push({
            url: getProxiedUrl(mp4),
            title: `${query.charAt(0).toUpperCase() + query.slice(1)} - ${prettyName.charAt(0).toUpperCase() + prettyName.slice(1)}`,
            source: 'mixkit',
            thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop'
          });
        }
      }
    }
  } catch (err: any) {
    console.error('[Video Scraping Error]:', err.message);
  }

  // Pre-scraped static catalog as backup/supplement to ensure we ALWAYS return multiple high-quality matches
  const videoCatalog = [
    {
      keywords: ['reno', 'renov', 'construct', 'build', 'house', 'maison', 'home', 'work', 'travaux', 'architecture'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4',
      title: 'Home Renovation & Designing Process',
      thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop'
    },
    {
      keywords: ['paint', 'peint', 'color', 'wall', 'mural', 'decorat'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-painter-hand-painting-a-wall-with-roller-42525-large.mp4',
      title: 'Expert Painter Rolling Fresh Coat Loop',
      thumbnail: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=200&fit=crop'
    },
    {
      keywords: ['roof', 'toit', 'roofing', 'couvreur', 'charpente'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-construction-worker-installing-a-roof-tile-42521-large.mp4',
      title: 'Professional Roofing Installation Loop',
      thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop'
    },
    {
      keywords: ['plumb', 'plomb', 'leak', 'water', 'pipe', 'tuyau', 'robinet', 'sanitaire'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-plumber-repairing-a-kitchen-sink-42171-large.mp4',
      title: 'Plumber Repairing Sink Under Counter',
      thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop'
    },
    {
      keywords: ['electric', 'electri', 'wire', 'cable', 'panel', 'disjoncteur', 'panne', 'court-circuit'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-fixing-wires-42175-large.mp4',
      title: 'Electrician Cabinet Wiring & Assembly',
      thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop'
    },
    {
      keywords: ['garden', 'landscap', 'jardin', 'paysag', 'green', 'gazon', 'pelouse', 'flower', 'fleur', 'arrosage'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-gardener-mowing-the-lawn-41221-large.mp4',
      title: 'Professional Lawn Mowing & Landscaping',
      thumbnail: 'https://images.unsplash.com/photo-1558904541-efa8c1a68f6a?w=300&h=200&fit=crop'
    },
    {
      keywords: ['food', 'restau', 'traite', 'chef', 'cook', 'cuisine', 'bistro', 'gourmet', 'plat', 'repas'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-chef-plating-a-prestige-dish-in-slow-motion-41381-large.mp4',
      title: 'Gourmet Chef Plating Culinary Masterpiece',
      thumbnail: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=300&h=200&fit=crop'
    },
    {
      keywords: ['salon', 'hair', 'barber', 'coiff', 'cut', 'spa', 'massage', 'esthetique', 'beaute', 'ongle', 'nail'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-hair-stylist-drying-customer-hair-41561-large.mp4',
      title: 'Hair Salon Blow-dry Styling Routine',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop'
    },
    {
      keywords: ['clean', 'nettoy', 'prop', 'dust', 'window', 'lavage', 'menage', 'bureau'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-vacuum-cleaner-head-moving-on-carpet-42661-large.mp4',
      title: 'Deep Steam Cleaning & Vacuuming',
      thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop'
    },
    {
      keywords: ['dentist', 'denti', 'teeth', 'dent', 'care', 'medical', 'doct', 'clinique'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-patients-teeth-with-instruments-42172-large.mp4',
      title: 'Premium Dental Care & Checkup Consultation',
      thumbnail: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=300&h=200&fit=crop'
    },
    {
      keywords: ['car', 'aut', 'garag', 'mechanic', 'repair', 'pneu', 'tire', 'moteur', 'frein'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-mechanic-repairing-a-car-engine-42173-large.mp4',
      title: 'Certified Mechanic Engine Diagnostics',
      thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop'
    },
    {
      keywords: ['immo', 'real estate', 'house', 'maison', 'agency', 'agence', 'flat', 'appartement'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-realtor-presenting-a-modern-apartment-43033-large.mp4',
      title: 'Luxury Real Estate Walkthrough Tour',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop'
    },
    {
      keywords: ['office', 'corp', 'typing', 'comp', 'law', 'avoc', 'consult', 'bureau', 'meeting', 'tax', 'compta'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-man-typing-on-laptop-with-creative-lighting-42401-large.mp4',
      title: 'Professional Modern Office Consultation Loop',
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop'
    },
    {
      keywords: ['yoga', 'fitness', 'wellness', 'coach', 'sport', 'gym', 'health', 'sante'],
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-exercises-at-home-43039-large.mp4',
      title: 'Calming Yoga & Wellness Morning Routine',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop'
    }
  ];

  // Supplement results with keyword matched catalog items to ensure the user gets a wide choice list!
  const matchedCatalog = videoCatalog.filter(v =>
    v.keywords.some(keyword => lower.includes(keyword) || term.includes(keyword))
  );

  for (const m of matchedCatalog) {
    const proxiedTarget = getProxiedUrl(m.url);
    if (!results.some(r => r.url === proxiedTarget)) {
      results.push({
        url: proxiedTarget,
        title: m.title,
        source: 'mixkit',
        thumbnail: m.thumbnail
      });
    }
  }

  // Final absolute fallback in case both Mixkit fetch and catalog yield nothing
  if (results.length === 0) {
    results.push(
      {
        url: getProxiedUrl('https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4'),
        title: 'Premium Craftsmanship & Execution Loop',
        source: 'mixkit',
        thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop'
      },
      {
        url: getProxiedUrl('https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-fixing-wires-42175-large.mp4'),
        title: 'Professional Service Detail Work',
        source: 'mixkit',
        thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop'
      },
      {
        url: getProxiedUrl('https://assets.mixkit.co/videos/preview/mixkit-gardener-mowing-the-lawn-41221-large.mp4'),
        title: 'Professional Exterior Landscaping Work',
        source: 'mixkit',
        thumbnail: 'https://images.unsplash.com/photo-1558904541-efa8c1a68f6a?w=300&h=200&fit=crop'
      }
    );
  }

  return results.slice(0, 16); // limit to top 16 beautiful matching results
}

/**
 * Capture Google search or maps page as a live screenshot
 */
export async function captureGoogleScreenshot(query: string, type: 'search' | 'maps' = 'search'): Promise<{ success: boolean; imageBase64?: string; error?: string }> {
  try {
    const { chromium } = await import('playwright');
    const url = type === 'maps'
      ? `https://www.google.com/maps/search/${encodeURIComponent(query)}`
      : `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1500);
    const buffer = await page.screenshot({ type: 'jpeg', quality: 80 });
    await browser.close();
    return {
      success: true,
      imageBase64: buffer.toString('base64')
    };
  } catch (err: any) {
    console.error('[Google Screenshot Error]:', err);
    return {
      success: false,
      error: err.message || 'Failed to capture Google screenshot'
    };
  }
}

