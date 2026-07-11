import { createStagehandSession, closeSession } from "./browserEngine";
import { callAI } from "./aiService";
import { saveLeadToFirestore, formatPhone } from "./firebase";
import { crawlPage } from "./crawl4ai";

export async function runTask(
  taskId: string,
  userInstruction: string,
  startUrl: string,
  socket: any,
  onProgress: (update: any) => void
) {
  const { page } = await createStagehandSession(taskId);

  // Step 1: tell the frontend the session exists (LiveViewer expects this exact step name)
  onProgress({
    step: "session_started",
    status: "running",
    data: { currentUrl: "" }
  });
  if (socket) {
    socket.emit('task_update', { taskId, message: "Browser session started successfully." });
  }

  // Step 2: start continuous screenshot polling in the background.
  // Every 250ms, capture a screenshot. Only send it through onProgress
  // if the frame actually changed since last capture (delta detection),
  // to avoid flooding the socket with identical duplicate frames.
  let lastScreenshotBuffer: Buffer | null = null;
  let pollingActive = true;

  const screenshotInterval = setInterval(async () => {
    if (!pollingActive) return;
    try {
      const buffer = await page.screenshot({ type: 'jpeg', quality: 50, fullPage: false });
      const changed = !lastScreenshotBuffer?.equals(buffer);
      if (changed) {
        lastScreenshotBuffer = buffer;
        onProgress({
          step: "screenshot",
          status: "running",
          data: { screenshot: buffer.toString('base64'), currentUrl: page.url() }
        });
      }
    } catch (e) {
      // page may be mid-navigation between screenshots, skip this tick silently
    }
  }, 250);

  try {
    // Step 3: navigate. If no explicit startUrl was given, default to a
    // Google Maps search built from the user's natural-language instruction.
    const targetUrl = startUrl || `https://www.google.com/maps/search/${encodeURIComponent(userInstruction)}`;
    onProgress({ step: "navigating", status: "running", data: { message: `Navigating to ${targetUrl}` } });
    if (socket) {
      socket.emit('task_update', { taskId, message: `Navigating to ${targetUrl}...` });
    }

    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000)); // let dynamic content (map results) finish rendering

    // Consent page check
    const currentUrl = page.url() || '';
    if (currentUrl.includes('consent.google.com') && typeof (page as any).click === 'function') {
      onProgress({ step: "navigating", status: "running", data: { message: "Accepting Google cookie consent..." } });
      if (socket) {
        socket.emit('task_update', { taskId, message: "Google cookie consent page detected. Attempting to accept consent..." });
      }
      console.log(`[taskOrchestrator] Google cookie consent page detected: ${currentUrl}`);
      
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
            console.log(`[taskOrchestrator] Clicking consent button with selector: ${selector}`);
            await page.click(selector);
            await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
            console.log(`[taskOrchestrator] Cookie consent accepted. Current URL: ${page.url()}`);
            if (socket) {
              socket.emit('task_update', { taskId, message: "Successfully accepted Google cookie consent." });
            }
            if (!page.url().includes('consent.google.com')) {
              break;
            }
          }
        } catch (e: any) {
          console.warn(`[taskOrchestrator] Selector "${selector}" failed during cookie consent bypass: ${e.message}`);
        }
      }
    }

    let results: any[] = [];
    const browserServiceUrl = process.env.BROWSER_SERVICE_URL;

    if (browserServiceUrl) {
      onProgress({ step: "extracting", status: "running", data: { message: "Running remote AI extraction..." } });
      if (socket) {
        socket.emit('task_update', { taskId, message: "Running remote AI extraction on remote browser microservice..." });
      }
      try {
        const extractionPrompt = `Extract leads/businesses from this page text related to: "${userInstruction}"`;
        results = await (page as any).extractLeads(extractionPrompt);
        console.log(`[taskOrchestrator] Remote extraction returned ${results.length} leads`);
      } catch (err: any) {
        console.error('[taskOrchestrator] Remote extraction failed, trying default flow:', err.message);
        if (socket) {
          socket.emit('task_update', { taskId, message: `Remote extraction failed: ${err.message}. Falling back to default extraction.` });
        }
      }
    }

    if (!browserServiceUrl || results.length === 0) {
      // Step 4: pull the visible page text and hand it to the AI to extract structured leads.
      onProgress({ step: "extracting", status: "running", data: { message: "Reading page content..." } });
      if (socket) {
        socket.emit('task_update', { taskId, message: "Fetching page content using Crawl4AI..." });
      }

      const activeUrl = page.url() || targetUrl;
      let pageContent = '';
      let crawlSuccess = false;

      try {
        console.log(`[taskOrchestrator] Attempting Crawl4AI extraction on: ${activeUrl}`);
        const crawlResult = await crawlPage(activeUrl);
        if (crawlResult && crawlResult.success && crawlResult.markdown) {
          pageContent = crawlResult.markdown;
          crawlSuccess = true;
          console.log(`[taskOrchestrator] Crawl4AI successfully extracted page markdown (${pageContent.length} bytes)`);
        }
      } catch (crawlErr: any) {
        console.error('[taskOrchestrator] Crawl4AI extraction failed, using fallback:', crawlErr.message);
      }

      if (!crawlSuccess || !pageContent) {
        console.log('[taskOrchestrator] Falling back to default innerText extraction...');
        if (socket) {
          socket.emit('task_update', { taskId, message: "Crawl4AI extraction unavailable. Falling back to local content parser..." });
        }
        pageContent = await page.evaluate(() => document.body.innerText.slice(0, 20000));
      }

      if (socket) {
        socket.emit('task_update', { taskId, message: "Analyzing page content using Gemini to extract structured leads..." });
      }

      const aiResponse = await callAI("browser_agent", [{
        role: "user",
        content: `Extract leads/businesses from this page text related to: "${userInstruction}"
          Return JSON only, no markdown formatting: { "results": [{ "name": "", "phone": "", "address": "", "email": "", "rating": 0, "url": "" }] }
          Page text: ${pageContent}`
      }]);

      try {
        const parsed = JSON.parse(aiResponse.replace(/```json/g, '').replace(/```/g, '').trim());
        results = parsed.results || [];
      } catch (e) {
        console.error('Failed to parse AI extraction response as JSON:', e, 'Raw response:', aiResponse);
      }
    }

    // Step 5: save each extracted lead to Firestore via the existing helper.
    if (socket && results.length > 0) {
      socket.emit('task_update', { taskId, message: `Saving ${results.length} extracted leads to Leads tab...` });
    }
    for (const item of results) {
      if (item.name || item.phone) {
        await saveLeadToFirestore({
          taskId,
          businessName: item.name || 'Unknown',
          phone: formatPhone(item.phone || ''),
          website: item.url || '',
          rating: item.rating ? String(item.rating) : '',
          address: item.address || '',
          email: item.email || '',
        });
      }
    }

    pollingActive = false;
    clearInterval(screenshotInterval);

    // Step 6: tell the frontend the task is done. taskRunner.ts forwards
    // this as a 'task_complete' event with this exact data shape.
    onProgress({
      step: "complete",
      status: "done",
      data: {
        results,
        leadCount: results.length,
        summary: `Found ${results.length} results`,
        currentUrl: page.url()
      }
    });
    if (socket) {
      socket.emit('task_update', { taskId, message: `Task complete — ${results.length} leads found` });
    }

  } catch (err: any) {
    pollingActive = false;
    clearInterval(screenshotInterval);
    onProgress({
      step: "error",
      status: "failed",
      data: { message: err.message }
    });
    if (socket) {
      socket.emit('task_update', { taskId, message: `Execution failed: ${err.message || 'Unknown error'}` });
    }
    throw err;
  } finally {
    // Always close the browser when the task ends, whether it succeeded or failed.
    await closeSession(taskId);
  }
}

