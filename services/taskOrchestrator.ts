import { createStagehandSession, closeSession, saveSessionState, registerPendingResume, activeSessions } from "./browserEngine";
import { callAI, findTargetUrl } from "./aiService";
import { saveLeadToFirestore, formatPhone } from "./firebase";
import { crawlPage } from "./crawl4ai";
import { withRetry, classifyPlaywrightError } from "./errors";
import { runStealthAutomation } from "./stealthTaskRunner";

const ensureAbsoluteUrl = (url: string): string => {
  if (!url) return 'about:blank';
  let cleaned = url.trim();
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://') || cleaned.startsWith('about:')) {
    return cleaned;
  }
  // If it's a domain name (contains a dot and no spaces, like google.com, maps.google.com)
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/.test(cleaned)) {
    return `https://${cleaned}`;
  }
  // Otherwise, fallback to a search query!
  return `https://duckduckgo.com/?q=${encodeURIComponent(cleaned)}`;
};

export async function runTask(
  taskId: string,
  userInstruction: string,
  startUrl: string,
  socket: any,
  onProgress: (update: any) => void,
  useStealth: boolean = false
) {
  if (useStealth) {
    const targetUrl = startUrl || await findTargetUrl(userInstruction);
    return runStealthAutomation(taskId, userInstruction, ensureAbsoluteUrl(targetUrl), onProgress);
  }

  const { page, liveViewUrl } = await createStagehandSession(taskId);

  // Step 1: tell the frontend the session exists
  // For local runs, we explicitly clear liveViewUrl so the UI knows to render our live streamed screenshots instead of loading a stale Steel iframe.
  onProgress({
    step: "session_started",
    status: "running",
    data: { currentUrl: "", liveViewUrl: "" }
  });
  if (socket) {
    socket.emit('task_update', { taskId, message: "Browser session started successfully." });
  }

  // Set up continuous passive screenshot polling in the background (every 500ms)
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
      // ignore transient page-navigation blockages
    }
  }, 500);

  try {
    onProgress({ step: "navigating", status: "running", data: { message: "Determining best target page..." } });
    if (socket) {
      socket.emit('task_update', { taskId, message: "Determining best target page via Gemini Search..." });
    }
    let targetUrl = startUrl || await findTargetUrl(userInstruction);
    targetUrl = ensureAbsoluteUrl(targetUrl);

    onProgress({ step: "navigating", status: "running", data: { message: `Navigating to ${targetUrl}` } });
    if (socket) {
      socket.emit('task_update', { taskId, message: `Navigating to ${targetUrl}...` });
    }

    try {
      await withRetry(
        async () => {
          await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        },
        {
          maxRetries: 3,
          onRetry: (attempt, error) => {
            onProgress({
              step: "retrying",
              status: "running",
              data: { message: `Retry attempt ${attempt}: ${error.message}` }
            });
            if (socket) {
              socket.emit('task_update', { taskId, message: `Retry attempt ${attempt}: ${error.message}` });
            }
          }
        }
      );
    } catch (gotoErr: any) {
      console.warn(`[taskOrchestrator] Navigation warning/timeout on ${targetUrl}: ${gotoErr.message || gotoErr}. Continuing...`);
      if (socket) {
        socket.emit('task_update', { taskId, message: `Navigation warning: ${gotoErr.message || gotoErr}. Proceeding with agent-loop anyway...` });
      }
    }

    await page.waitForTimeout(3000).catch(() => {});
    await saveSessionState(taskId).catch(() => {});

    // Fast Google Consent Accept bypass
    const initialUrl = page.url() || '';
    if (initialUrl.includes('consent.google.com') && typeof (page as any).click === 'function') {
      onProgress({ step: "navigating", status: "running", data: { message: "Accepting Google cookie consent..." } });
      const selectors = [
        'button[aria-label*="Accept all"]',
        'button[aria-label*="Accept"]',
        'button[aria-label*="Agree"]',
        'form[action*="consent"] button',
        'button:has-text("Accept all")',
        'button:has-text("Agree")'
      ];
      for (const selector of selectors) {
        try {
          const isVisible = await page.locator(selector).first().isVisible({ timeout: 2000 }).catch(() => false);
          if (isVisible) {
            await page.click(selector);
            await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
            if (!page.url().includes('consent.google.com')) break;
          }
        } catch (e) {}
      }
    }
    await saveSessionState(taskId).catch(() => {});

    // Core Intelligent Autonomous Agent Loop
    const maxSteps = 15;
    let stepCount = 0;
    let done = false;
    let userGuidance = "";
    let lastScreenshot = "";
    let finalSummary = "";
    let extractedLeads: any[] = [];

    while (stepCount < maxSteps && !done) {
      stepCount++;
      if (!activeSessions.has(taskId)) {
        console.log(`[taskOrchestrator] Session ${taskId} was aborted/deleted. Terminating agent loop.`);
        done = true;
        break;
      }
      const activeUrl = page.url() || targetUrl;

      // Ensure fresh page snapshot
      let screenshotBase64 = '';
      try {
        const buffer = await page.screenshot({ type: 'jpeg', quality: 50 });
        screenshotBase64 = buffer.toString('base64');
        lastScreenshot = screenshotBase64;
        onProgress({
          step: "screenshot",
          status: "running",
          data: { screenshot: screenshotBase64, currentUrl: activeUrl }
        });
      } catch (e) {
        console.warn('[taskOrchestrator] Step screenshot failed:', e);
      }

      // Fetch metadata and page tree
      const pageTitle = await page.title().catch(() => '');
      const pageText = await page.evaluate(() => document.body?.innerText || '').catch(() => '');
      const slicedText = pageText.slice(0, 10000);

      // Extract and tag interactive targets
      const interactiveElements = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="searchbox"]'));
        return els.map((el, idx) => {
          const rect = el.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
          if (!isVisible) return null;

          const agentId = `agent-el-${idx}`;
          el.setAttribute('data-agent-id', agentId);

          return {
            id: agentId,
            tagName: el.tagName.toLowerCase(),
            text: (el.textContent || '').trim().slice(0, 60),
            placeholder: (el as any).placeholder || '',
            value: (el as any).value || '',
            type: (el as any).type || '',
            role: el.getAttribute('role') || '',
            ariaLabel: el.getAttribute('aria-label') || '',
            title: el.getAttribute('title') || '',
          };
        }).filter(Boolean);
      }).catch(() => [] as any[]);

      const promptContent = `You are a state-of-the-art autonomous browser automation controller.
Task instructions: "${userInstruction}"

---
Step: ${stepCount} of ${maxSteps}
Current Page Title: "${pageTitle}"
Current URL: ${activeUrl}

---
Page Content (Excerpt):
${slicedText}

---
Interactive Elements:
${JSON.stringify(interactiveElements, null, 2)}

---
${userGuidance ? `User guidance for this step: "${userGuidance}"\n` : ''}
Analyze the page. Check if there are Google login overlays, OAuth popups, CAPTCHA blockages, cookie consent screens, or input fields.
Decide on the SINGLE best next step. Return ONLY a valid JSON object in this format, no markdown tags:
{
  "action": "click" | "type" | "scroll" | "wait" | "human_needed" | "done",
  "targetId": "the agent-el-X tag of the interactive element",
  "selector": "alternative CSS selector if targetId is not specified",
  "text": "text to type, only if action is type",
  "direction": "down" | "up",
  "reasoning": "brief description of why this step is taken",
  "message": "user-visible progress status message",
  "stuckReason": "if action is human_needed, explain exactly why so the user can take over"
}

IMPORTANT GUIDANCE REGARDING THE "done" ACTION:
1. Do NOT set action to "done" immediately after clicking on a single business or item card. The goal is to find or scrape multiple listings. One item does not complete the task.
2. If you are on an item detail card/page, you should extract/read the info, and then click BACK or select another element to continue scanning the listings.
3. Only return "done" when the user's high-level objective is fully achieved (e.g. you have collected multiple listings, or the search results are exhausted).`;

      onProgress({ step: "extracting", status: "running", data: { message: `Step ${stepCount}/${maxSteps}: Analyzing current page state...` } });
      if (socket) {
        socket.emit('task_update', { taskId, message: `Step ${stepCount}/${maxSteps}: Analyzing current page state with Gemini...` });
      }

      const aiResponse = await callAI("browser_agent", [{ role: "user", content: promptContent }]);
      let decision: any;
      try {
        decision = JSON.parse(aiResponse.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch (err) {
        console.warn('[taskOrchestrator] AI decision parser error:', err, 'Raw response:', aiResponse);
        decision = {
          action: "wait",
          reasoning: "AI decision parse failed.",
          message: "Could not parse AI response. Pausing to refresh page state..."
        };
      }

      console.log(`[taskOrchestrator] Step ${stepCount} action:`, decision);
      onProgress({
        step: "action",
        status: "running",
        data: { message: `Step ${stepCount}: ${decision.message || decision.reasoning}` }
      });
      if (socket) {
        socket.emit('task_update', { taskId, message: `Step ${stepCount}: ${decision.message || decision.reasoning}` });
      }

      // Execute chosen action
      if (decision.action === "click") {
        let success = false;
        const targetId = decision.targetId;
        const selector = decision.selector;

        if (targetId) {
          try {
            await page.click(`[data-agent-id="${targetId}"]`, { timeout: 5000 });
            success = true;
          } catch (e: any) {
            console.warn(`[taskOrchestrator] Failed to click by agent ID ${targetId}: ${e.message}`);
          }
        }
        if (!success && selector) {
          try {
            await page.click(selector, { timeout: 5000 });
            success = true;
          } catch (e: any) {
            console.warn(`[taskOrchestrator] Failed to click by CSS selector ${selector}: ${e.message}`);
          }
        }
        if (!success && targetId) {
          const match = interactiveElements.find((el: any) => el.id === targetId);
          if (match && match.text) {
            try {
              await page.click(`text="${match.text}"`, { timeout: 5000 });
              success = true;
            } catch (e) {}
          }
        }
        onProgress({ step: "action_complete", status: "running", data: { message: success ? `Clicked target element.` : `Could not click target element.`, currentUrl: page.url() } });
      } 
      else if (decision.action === "type") {
        let success = false;
        const targetId = decision.targetId;
        const selector = decision.selector;
        const text = decision.text || '';

        if (targetId) {
          try {
            await page.fill(`[data-agent-id="${targetId}"]`, text, { timeout: 5000 });
            success = true;
          } catch (e: any) {
            console.warn(`[taskOrchestrator] Failed to fill by agent ID ${targetId}: ${e.message}`);
          }
        }
        if (!success && selector) {
          try {
            await page.fill(selector, text, { timeout: 5000 });
            success = true;
          } catch (e: any) {
            console.warn(`[taskOrchestrator] Failed to fill by selector ${selector}: ${e.message}`);
          }
        }
        onProgress({ step: "action_complete", status: "running", data: { message: success ? `Typed text successfully.` : `Typing failed.`, currentUrl: page.url() } });
      } 
      else if (decision.action === "scroll") {
        try {
          const scrollVal = decision.direction === 'up' ? -600 : 600;
          await page.evaluate((val) => window.scrollBy(0, val), scrollVal);
          onProgress({ step: "action_complete", status: "running", data: { message: `Scrolled page content.`, currentUrl: page.url() } });
        } catch (e) {}
      } 
      else if (decision.action === "wait") {
        await page.waitForTimeout(4000).catch(() => {});
        onProgress({ step: "action_complete", status: "running", data: { message: `Waited for element loads.`, currentUrl: page.url() } });
      } 
      else if (decision.action === "human_needed") {
        // Human attention is required
        onProgress({
          step: "human_needed",
          status: "paused_input",
          data: {
            message: `⚠️ Human Attention Required: ${decision.stuckReason || "An authentication or CAPTCHA window is blocking progress."}`,
            screenshot: lastScreenshot,
            currentUrl: activeUrl,
            type: "login"
          }
        });
        if (socket) {
          socket.emit('task_update', { taskId, message: `⚠️ Human Intervention requested: ${decision.stuckReason || "Please solve on the visual stream!"}` });
        }

        // Wait for user resume/instructions
        const resumeData = await registerPendingResume(taskId);
        userGuidance = resumeData?.instruction || "continue";
        onProgress({ step: "navigating", status: "running", data: { message: `Resumed! Executing: "${userGuidance}"` } });
      } 
      else if (decision.action === "done") {
        done = true;
        finalSummary = decision.reasoning || "All actions completed successfully.";
        onProgress({ step: "action_complete", status: "running", data: { message: `Task finish state reached.`, currentUrl: page.url() } });
      }

      await page.waitForTimeout(1000).catch(() => {});
      await saveSessionState(taskId).catch(() => {});
    }

    // Lead gathering check
    const isLeadsTask = userInstruction.toLowerCase().includes('lead') || 
                        userInstruction.toLowerCase().includes('scrape') || 
                        userInstruction.toLowerCase().includes('find') || 
                        userInstruction.toLowerCase().includes('business') || 
                        userInstruction.toLowerCase().includes('dentist') || 
                        userInstruction.toLowerCase().includes('plumber') || 
                        userInstruction.toLowerCase().includes('hotel') || 
                        userInstruction.toLowerCase().includes('restaurant');

    if (isLeadsTask) {
      onProgress({ step: "extracting", status: "running", data: { message: "Gathering extracted leads..." } });
      const finalPageText = await page.evaluate(() => document.body?.innerText || '').catch(() => '');
      const aiResponse = await callAI("browser_agent", [{
        role: "user",
        content: `Extract leads/businesses from this page text related to: "${userInstruction}"
          Return JSON only, no markdown formatting: { "results": [{ "name": "", "phone": "", "address": "", "email": "", "rating": "", "reviewsCount": "", "url": "" }] }
          Page text: ${finalPageText.slice(0, 15000)}`
      }]);

      try {
        const parsed = JSON.parse(aiResponse.replace(/```json/g, '').replace(/```/g, '').trim());
        extractedLeads = parsed.results || [];
      } catch (e) {}

      for (const item of extractedLeads) {
        if (item.name || item.phone || item.businessName) {
          await saveLeadToFirestore({
            taskId,
            businessName: item.name || item.businessName || 'Unknown',
            phone: formatPhone(item.phone || ''),
            website: item.url || item.website || '',
            rating: item.rating ? String(item.rating) : '',
            reviewsCount: item.reviewsCount ? String(item.reviewsCount) : '',
            address: item.address || '',
            email: item.email || '',
          });
        }
      }
    }

    pollingActive = false;
    clearInterval(screenshotInterval);

    // Final page capture
    let finalScreenshotBase64 = '';
    try {
      const buffer = await page.screenshot({ type: 'jpeg', quality: 60 });
      finalScreenshotBase64 = buffer.toString('base64');
    } catch (e) {}

    onProgress({
      step: "complete",
      status: "done",
      data: {
        results: extractedLeads,
        leadCount: extractedLeads.length,
        summary: finalSummary || `Task successfully complete. Extracted ${extractedLeads.length} items.`,
        currentUrl: page.url(),
        screenshot: finalScreenshotBase64,
        liveViewUrl: ""
      }
    });

    if (socket) {
      socket.emit('task_update', { taskId, message: finalSummary || `Task complete — ${extractedLeads.length} leads saved.` });
    }

  } catch (err: any) {
    pollingActive = false;
    clearInterval(screenshotInterval);

    let finalScreenshotBase64 = '';
    try {
      const buffer = await page.screenshot({ type: 'jpeg', quality: 60 });
      finalScreenshotBase64 = buffer.toString('base64');
    } catch (e) {}

    const classifiedError = classifyPlaywrightError(err);
    onProgress({
      step: "error",
      status: "failed",
      data: { 
        message: `Error [${classifiedError.code}]: ${classifiedError.message}`,
        code: classifiedError.code,
        screenshot: finalScreenshotBase64
      }
    });
    if (socket) {
      socket.emit('task_update', { taskId, message: `Execution failed: Error [${classifiedError.code}]: ${classifiedError.message}` });
    }
    throw err;
  } finally {
    // Keep active browser session alive for 10 minutes after task ends so the user can interact with it
    console.log(`[taskOrchestrator] Keeping active browser session alive for 10 minutes for user interaction...`);
    setTimeout(async () => {
      try {
        console.log(`[taskOrchestrator] Delayed closing of session for task ${taskId}...`);
        await closeSession(taskId);
      } catch (e) {}
    }, 10 * 60 * 1000);
  }
}

