const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CRAWL4AI_URL = process.env.CRAWL4AI_URL || 'https://crawl4ai-production-8e63.up.railway.app';

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'assix-browser-service' });
});

app.post('/scrape', async (req, res) => {
  const { url, instruction } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }

  let browser;
  try {
    console.log(`[Browser Service] Launching browser for: ${url}`);
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    console.log(`[Browser Service] Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    let finalUrl = page.url();
    console.log(`[Browser Service] Reached page: ${finalUrl}`);

    if (finalUrl.includes('consent.google.com')) {
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

    // Fallback if Crawl4AI failed or returned empty
    if (!markdown) {
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
          // Fallback simple parse from rawText if malformed or return empty array
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
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error('[Browser Service] Error closing browser:', closeErr.message);
      }
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Browser Service] Microservice running on port ${PORT}`);
});
