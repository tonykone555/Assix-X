import crypto from 'crypto';
import axios from 'axios';
import { generateWebsiteGif } from './gifGeneratorService';

export interface UrlboxOptions {
  width?: number;
  height?: number;
  scroll?: boolean;
  duration?: number;
  fps?: number;
  scrollDelay?: number;
  waitFor?: number;
  forceRefresh?: boolean;
}

const gifMemoryCache = new Map<string, { gifUrl: string; gifBase64?: string; expiresAt: number }>();

/**
 * Constructs a URLbox API URL or proxy endpoint for generating animated GIFs from a live URL
 */
export function generateUrlboxGifUrl(targetUrl: string, options: UrlboxOptions = {}): string {
  if (!targetUrl) return '';

  const apiKey = process.env.URLBOX_API_KEY || process.env.URLBOX_KEY;
  const secretKey = process.env.URLBOX_SECRET_KEY || process.env.URLBOX_SECRET;

  const width = options.width || 800;
  const height = options.height || 600;
  const scroll = options.scroll !== false;
  const duration = options.duration || 3500;
  const fps = options.fps || 12;
  const scrollDelay = options.scrollDelay || 800;
  const waitFor = options.waitFor || 1200;

  // If no direct API key configured yet, return server proxy endpoint URL
  if (!apiKey) {
    return `/api/urlbox/gif?url=${encodeURIComponent(targetUrl)}`;
  }

  const queryObj: Record<string, string> = {
    url: targetUrl,
    width: String(width),
    height: String(height),
    scroll: String(scroll),
    duration: String(duration),
    fps: String(fps),
    scroll_delay: String(scrollDelay),
    wait_for: String(waitFor),
    format: 'gif'
  };

  const queryString = Object.keys(queryObj)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObj[key])}`)
    .join('&');

  if (secretKey) {
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(queryString)
      .digest('hex');
    return `https://api.urlbox.io/v2/${apiKey}/gif?${queryString}&sig=${signature}`;
  }

  return `https://api.urlbox.io/v2/${apiKey}/gif?${queryString}`;
}

/**
 * Fetches the raw GIF buffer or base64 from URLbox, falling back to local browser capture if needed
 */
export async function fetchUrlboxGif(targetUrl: string, options: UrlboxOptions = {}): Promise<{ success: boolean; gifUrl: string; gifBase64?: string; buffer?: Buffer; error?: string }> {
  if (!targetUrl) return { success: false, gifUrl: '', error: 'Target URL is required' };

  const cacheKey = `urlbox_${targetUrl}`;
  const cached = gifMemoryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now() && !options.forceRefresh) {
    return { success: true, gifUrl: cached.gifUrl, gifBase64: cached.gifBase64 };
  }

  const apiKey = process.env.URLBOX_API_KEY || process.env.URLBOX_KEY;
  const gifUrl = generateUrlboxGifUrl(targetUrl, options);

  if (apiKey) {
    try {
      console.log(`[URLbox Service] Capturing live website GIF for ${targetUrl} via URLbox API...`);
      const response = await axios.get(gifUrl, { responseType: 'arraybuffer', timeout: 25000 });
      const buffer = Buffer.from(response.data);
      const gifBase64 = buffer.toString('base64');

      gifMemoryCache.set(cacheKey, {
        gifUrl,
        gifBase64,
        expiresAt: Date.now() + 60 * 60 * 1000 // Cache for 1 hour
      });

      return { success: true, gifUrl, gifBase64, buffer };
    } catch (err: any) {
      console.warn(`[URLbox Service] Direct URLbox API fetch notice (${err.message}). Defaulting to local headless capture...`);
    }
  }

  // Fallback to local Playwright generator if API key is unconfigured or call fails
  console.log(`[URLbox Service] Generating website GIF via Playwright for ${targetUrl}...`);
  const siteId = `site_urlbox_${targetUrl.replace(/[^a-z0-9]/gi, '').slice(-20)}`;
  const localGen = await generateWebsiteGif(siteId, undefined);
  if (localGen.success && localGen.gifBase64) {
    const buffer = Buffer.from(localGen.gifBase64, 'base64');
    const proxyUrl = `/api/urlbox/gif?url=${encodeURIComponent(targetUrl)}`;
    gifMemoryCache.set(cacheKey, {
      gifUrl: proxyUrl,
      gifBase64: localGen.gifBase64,
      expiresAt: Date.now() + 60 * 60 * 1000
    });
    return { success: true, gifUrl: proxyUrl, gifBase64: localGen.gifBase64, buffer };
  }

  return { success: false, gifUrl, error: 'Failed to generate website GIF' };
}
