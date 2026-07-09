import { createStagehandSession, closeSession } from "./browserEngine";
import { callAI } from "./aiService";
import { saveLeadToFirestore, formatPhone } from "./firebase";

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

    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000)); // let dynamic content (map results) finish rendering

    // Step 4: pull the visible page text and hand it to the AI to extract structured leads.
    onProgress({ step: "extracting", status: "running", data: { message: "Reading page content..." } });

    const pageText = await page.evaluate(() => document.body.innerText.slice(0, 20000));

    const aiResponse = await callAI("browser_agent", [{
      role: "user",
      content: `Extract leads/businesses from this page text related to: "${userInstruction}"
        Return JSON only, no markdown formatting: { "results": [{ "name": "", "phone": "", "address": "", "email": "", "rating": 0, "url": "" }] }
        Page text: ${pageText}`
    }]);

    let results: any[] = [];
    try {
      const parsed = JSON.parse(aiResponse.replace(/```json/g, '').replace(/```/g, '').trim());
      results = parsed.results || [];
    } catch (e) {
      console.error('Failed to parse AI extraction response as JSON:', e, 'Raw response:', aiResponse);
    }

    // Step 5: save each extracted lead to Firestore via the existing helper.
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

  } catch (err: any) {
    pollingActive = false;
    clearInterval(screenshotInterval);
    onProgress({
      step: "error",
      status: "failed",
      data: { message: err.message }
    });
    throw err;
  } finally {
    // Always close the browser when the task ends, whether it succeeded or failed.
    await closeSession(taskId);
  }
}

