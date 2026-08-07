const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CRAWL4AI_URL = process.env.CRAWL4AI_URL || 'https://crawl4ai-production-8e63.up.railway.app';

// In-memory sessions map
const sessions = new Map();
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function closeSessionInternal(taskId) {
  const session = sessions.get(taskId);
  if (session) {
    console.log(`[Browser Service] Cleaning up session for task ${taskId}`);
    session.browser.close().catch(err => console.error(`Error closing session browser for task ${taskId}:`, err.message));
    sessions.delete(taskId);
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'assix-browser-service', activeSessions: sessions.size });
});

// Start persistent session
app.post('/session/start', async (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ success: false, error: 'taskId is required' });
  }

  if (sessions.has(taskId)) {
    console.log(`[Browser Service] Session for task ${taskId} already exists, reusing.`);
    return res.json({ success: true, message: 'Session already exists' });
  }

  try {
    console.log(`[Browser Service] Starting persistent browser session for task ${taskId}`);
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    
    sessions.set(taskId, {
      browser,
      context,
      page,
      createdAt: Date.now()
    });

    // Auto-cleanup after timeout (30 minutes)
    setTimeout(() => {
      closeSessionInternal(taskId);
    }, SESSION_TIMEOUT_MS);

    res.json({ success: true });
  } catch (err) {
    console.error(`[Browser Service] Failed to start session for task ${taskId}:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Close session
app.post('/session/close', async (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ success: false, error: 'taskId is required' });
  }
  
  closeSessionInternal(taskId);
  res.json({ success: true });
});

// Take page screenshot
app.post('/screenshot', async (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ success: false, error: 'taskId is required' });
  }

  const session = sessions.get(taskId);
  if (!session) {
    return res.status(404).json({ success: false, error: `No session found for task ${taskId}` });
  }

  try {
    const buffer = await session.page.screenshot({ type: 'jpeg', quality: 50 });
    const base64 = buffer.toString('base64');
    const currentUrl = session.page.url();
    res.json({ success: true, screenshot: base64, currentUrl });
  } catch (err) {
    console.error(`[Browser Service] Screenshot failed for task ${taskId}:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Scrape page content and perform optional AI extraction
app.post('/scrape', async (req, res) => {
  const { url, instruction, taskId } = req.body;

  let page;
  let browserToClose = null;
  let session = null;

  if (taskId) {
    session = sessions.get(taskId);
  }

  try {
    if (session) {
      console.log(`[Browser Service] Using persistent page for task ${taskId}`);
      page = session.page;
    } else {
      console.log(`[Browser Service] No persistent session found for task ${taskId || 'none'}. Launching ad-hoc browser.`);
      browserToClose = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const context = await browserToClose.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });

      page = await context.newPage();
    }

    if (url) {
      console.log(`[Browser Service] Navigating to: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    let finalUrl = page.url() || url || '';
    console.log(`[Browser Service] Reached page: ${finalUrl}`);

    if (finalUrl && finalUrl.includes('consent.google.com')) {
      console.log(`[Browser Service] Google consent page detected. Attempting to bypass.`);
      const selectors = [
        'button[aria-label*="Accept all"]',
        'button[aria-label*="Accept"]',
        'button[aria-label*="Agree"]',
        'button[aria-label*="Tout accepter"]',
        'button[aria-label*="Aceptar todo"]',
        'button[aria-label*="Alle akzeptieren"]',
        'form[action*="consent"] button',
        'form button',
        'button:has-text("Accept all")',
        'button:has-text("I agree")',
        'button:has-text("Agree")',
        'button:has-text("Tout accepter")'
      ];

      for (const selector of selectors) {
        try {
          const isVisible = await page.locator(selector).first().isVisible({ timeout: 2000 }).catch(() => false);
          if (isVisible) {
            console.log(`[Browser Service] Clicking consent button with selector: ${selector}`);
            await page.click(selector);
            await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
            finalUrl = page.url();
            console.log(`[Browser Service] Bypassed consent. Current URL: ${finalUrl}`);
            if (!finalUrl.includes('consent.google.com')) {
              break;
            }
          }
        } catch (e) {
          console.warn(`[Browser Service] Selector "${selector}" failed:`, e.message);
        }
      }
    }

    // Call Crawl4AI
    let markdown = '';
    let html = '';
    let crawlSuccess = false;

    if (finalUrl && finalUrl !== 'about:blank') {
      try {
        console.log(`[Browser Service] Calling Crawl4AI at: ${CRAWL4AI_URL}/crawl`);
        const crawlResponse = await fetch(`${CRAWL4AI_URL}/crawl`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            urls: [finalUrl],
            word_count_threshold: 10,
          }),
        });

        if (crawlResponse.ok) {
          const crawlData = await crawlResponse.json();
          const result = Array.isArray(crawlData.results) ? crawlData.results[0] : crawlData;
          markdown = result?.markdown?.raw_markdown || result?.markdown || '';
          html = result?.cleaned_html || result?.html || '';
          crawlSuccess = !!markdown;
        }
      } catch (crawlErr) {
        console.error('[Browser Service] Crawl4AI failed:', crawlErr.message);
      }
    }

    // Fallback if Crawl4AI failed or returned empty
    if (!markdown && page) {
      console.log('[Browser Service] Crawl4AI failed, falling back to local extraction');
      markdown = await page.evaluate(() => document.body.innerText.slice(0, 25000));
      html = await page.content();
    }

    let data = [];
    if (instruction) {
      console.log(`[Browser Service] Performing structured extraction with instruction: "${instruction}"`);
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          // Use SDK
          const { GoogleGenAI } = require('@google/genai');
          const ai = new GoogleGenAI({ apiKey });
          
          const prompt = `Extract structured lead or business information matching this query/instruction: "${instruction}"
From the following webpage content:

${markdown.slice(0, 30000)}

Return a JSON array of objects representing the extracted businesses. Each object MUST strictly follow this flat schema:
{
  "businessName": "Company name",
  "name": "Company name",
  "phone": "Phone number",
  "website": "Website URL",
  "url": "Website URL",
  "email": "Email address",
  "address": "Full physical address",
  "rating": "Rating or review count if applicable"
}

Format the response strictly as a JSON object with a single "results" property containing the array:
{ "results": [...] }

Return ONLY the valid raw JSON object. Do not wrap in markdown blocks, do not add explanation.`;

          const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });

          const rawText = aiResponse.text || '';
          console.log(`[Browser Service] Gemini response text length: ${rawText.length}`);
          const parsed = JSON.parse(rawText.trim());
          data = parsed.results || parsed || [];
        } catch (geminiErr) {
          console.error('[Browser Service] Gemini SDK extraction failed:', geminiErr.message);
        }
      } else {
        console.warn('[Browser Service] GEMINI_API_KEY is missing. Returning empty data array.');
      }
    }

    res.json({
      success: true,
      url: finalUrl,
      markdown,
      data,
    });

  } catch (err) {
    console.error('[Browser Service] Scraping error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (browserToClose) {
      try {
        await browserToClose.close();
      } catch (closeErr) {
        console.error('[Browser Service] Error closing browser:', closeErr.message);
      }
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Browser Service] Microservice running on port ${PORT}`);
});
