import { chromium } from 'playwright';
import gifenc from 'gifenc';
const { GIFEncoder, quantize, applyPalette } = gifenc;
import jpeg from 'jpeg-js';
import { db } from '../firebase-client-wrapper';

const gifCache = new Map<string, { gifBase64: string; expiresAt: number }>();

export async function generateWebsiteGif(siteId: string, htmlContent?: string): Promise<{ success: boolean; gifBase64?: string; error?: string }> {
  // Check memory cache first
  const cached = gifCache.get(siteId);
  if (cached && cached.expiresAt > Date.now()) {
    console.log(`[GIF Generator] Found cached GIF in-memory for site ${siteId}`);
    return { success: true, gifBase64: cached.gifBase64 };
  }

  let siteHtml = htmlContent || '';

  // Check Firestore cache if no htmlContent passed
  if (!siteHtml) {
    try {
      const docPromise = db.collection('generated_sites').doc(siteId).get();
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      const doc: any = await Promise.race([docPromise, timeoutPromise]);
      if (doc && doc.exists) {
        const data = doc.data();
        if (data?.gifBase64) {
          console.log(`[GIF Generator] Found cached GIF in Firestore for site ${siteId}`);
          gifCache.set(siteId, { gifBase64: data.gifBase64, expiresAt: Date.now() + 30 * 60 * 1000 });
          return { success: true, gifBase64: data.gifBase64 };
        }
        if (data?.html) {
          siteHtml = data.html;
        }
      }
    } catch (err: any) {
      console.warn('[GIF Generator] Firestore cache lookup warning:', err.message);
    }
  }

  console.log(`[GIF Generator] Launching browser to generate GIF for site ${siteId}...`);
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const context = await browser.newContext({
      viewport: { width: 800, height: 600 },
      deviceScaleFactor: 1
    });

    const page = await context.newPage();
    
    if (siteHtml && siteHtml.length > 50) {
      console.log(`[GIF Generator] Loading HTML content directly into Playwright (${siteHtml.length} chars)...`);
      await page.setContent(siteHtml, { waitUntil: 'domcontentloaded', timeout: 12000 });
    } else {
      const previewUrl = `http://127.0.0.1:3000/preview/${siteId}`;
      console.log(`[GIF Generator] Navigating to preview URL: ${previewUrl}`);
      await page.goto(previewUrl, { waitUntil: 'domcontentloaded', timeout: 12000 }).catch(async () => {
        await page.goto(`http://localhost:3000/preview/${siteId}`, { waitUntil: 'load', timeout: 10000 }).catch(() => {});
      });
    }
    
    // Wait slightly for any entering CSS transitions or fonts
    await page.waitForTimeout(1200);

    const framesCount = 4;
    const scrollStep = 300;
    const jpegBuffers: Buffer[] = [];

    // Capture scrolling screenshots
    for (let i = 0; i < framesCount; i++) {
      console.log(`[GIF Generator] Capturing frame ${i + 1}/${framesCount} at scroll position ${i * scrollStep}`);
      const screenshotBuffer = await page.screenshot({
        type: 'jpeg',
        quality: 60
      });
      jpegBuffers.push(screenshotBuffer);

      // Scroll down for the next frame
      if (i < framesCount - 1) {
        await page.evaluate((amount) => {
          window.scrollBy(0, amount);
        }, scrollStep);
        await page.waitForTimeout(600); // Allow scrolling animation/lazy loads to settle
      }
    }

    await browser.close();
    browser = null;

    console.log(`[GIF Generator] Processing ${jpegBuffers.length} frames with gifenc and jpeg-js...`);

    // Combine JPEG frames into a GIF using gifenc
    const gif = GIFEncoder();
    const width = 800;
    const height = 600;

    for (let i = 0; i < jpegBuffers.length; i++) {
      const decoded = jpeg.decode(jpegBuffers[i], { useTArray: true });
      
      // Quantize to 128 colors (fewer colors means smaller size and faster compression!)
      const palette = quantize(decoded.data, 128, { format: 'rgb565' });
      const index = applyPalette(decoded.data, palette, 'rgb565');
      
      // Use 1000ms delay per frame (1 second scroll interval)
      gif.writeFrame(index, width, height, {
        palette,
        delay: 1000
      });
    }

    gif.finish();
    const gifBytes = gif.bytesView();
    const gifBuffer = Buffer.from(gifBytes);
    const gifBase64 = gifBuffer.toString('base64');

    console.log(`[GIF Generator] GIF created successfully. Size: ${(gifBuffer.length / 1024).toFixed(1)} KB`);

    // Cache to Firestore asynchronously
    db.collection('generated_sites').doc(siteId).update({
      gifBase64,
      gifCreatedAt: new Date().toISOString()
    }).catch(err => {
      console.warn('[GIF Generator] Failed to save GIF to Firestore:', err.message);
    });

    // Cache in memory
    gifCache.set(siteId, { gifBase64, expiresAt: Date.now() + 30 * 60 * 1000 });

    return { success: true, gifBase64 };
  } catch (err: any) {
    console.error('[GIF Generator] Error generating GIF:', err);
    if (browser) {
      await browser.close().catch(() => {});
    }
    return { success: false, error: err.message || 'Failed to generate website GIF' };
  }
}

const screenshotCache = new Map<string, { imageBase64: string; expiresAt: number }>();

export async function captureGoogleScreenshot(query: string, type: 'search' | 'maps' = 'search'): Promise<{ success: boolean; imageBase64?: string; error?: string }> {
  const cacheKey = `${type}_${query}`;
  const cached = screenshotCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    console.log(`[Google Capture] Returning cached screenshot for ${cacheKey}`);
    return { success: true, imageBase64: cached.imageBase64 };
  }

  console.log(`[Google Capture] Launching browser to search Google ${type} for "${query}"...`);
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const context = await browser.newContext({
      viewport: type === 'maps' ? { width: 1280, height: 800 } : { width: 1024, height: 768 },
      deviceScaleFactor: 1.25,
      locale: 'fr-FR',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();
    const url = type === 'maps' 
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      : `https://www.google.com/search?hl=fr&q=${encodeURIComponent(query)}`;

    console.log(`[Google Capture] Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    // Handle cookie consent gate if it pops up
    try {
      const acceptSelectors = [
        'button#L2AGLb', // Classic Google Search accept button
        'button[aria-label="Tout accepter"]', // Google Maps accept button
        'form[action*="consent.google"] button', // Consent form button
        'button:has-text("Tout accepter")',
        'button:has-text("Accepter tout")',
        'button:has-text("Accept all")',
        'button:has-text("J\'accepte")'
      ];

      await page.waitForTimeout(1000);
      let clicked = false;
      for (const sel of acceptSelectors) {
        if (await page.locator(sel).count() > 0) {
          console.log(`[Google Capture] Clicked consent button: ${sel}`);
          await page.locator(sel).first().click();
          clicked = true;
          break;
        }
      }
      if (clicked) {
        await page.waitForTimeout(2000); // Wait for the page to transition or reload
      }
    } catch (err: any) {
      console.log(`[Google Capture] Cookie dialog check bypassed: ${err.message}`);
    }

    // Wait for core content to settle
    await page.waitForTimeout(3000);

    // If Google Maps search took us to a listing directly, or a list, wait for the map & card to show
    if (type === 'maps') {
      try {
        await page.waitForSelector('canvas', { timeout: 5000 });
      } catch (e) {
        console.log('[Google Capture] Canvas not found, proceeding anyway');
      }
    }

    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 75,
      fullPage: false
    });

    await browser.close();
    browser = null;

    const imageBase64 = screenshotBuffer.toString('base64');
    // Cache for 15 minutes
    screenshotCache.set(cacheKey, { imageBase64, expiresAt: Date.now() + 15 * 60 * 1000 });

    return { success: true, imageBase64 };
  } catch (err: any) {
    console.error('[Google Capture] Error taking screenshot:', err);
    if (browser) {
      await browser.close().catch(() => {});
    }
    return { success: false, error: err.message || 'Failed to capture screenshot' };
  }
}

