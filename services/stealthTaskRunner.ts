import { 
  spawnBrowser, 
  navigate, 
  clickElement, 
  typeText, 
  takeScreenshot, 
  getPageContent, 
  closeInstance, 
  extractText, 
  extractImage, 
  checkStealthConnection,
  getInstanceState
} from "./stealthBrowserClient";
import { callAI } from "./aiService";
import { registerPendingResume } from "./browserEngine";

export async function runStealthAutomation(
  taskId: string,
  instruction: string,
  startUrl: string,
  onProgress: (update: any) => void
) {
  onProgress({ step: "connecting", status: "running", data: { message: "Connecting to Stealth Browser MCP..." } });

  const status = await checkStealthConnection();
  if (!status.connected) {
    onProgress({ step: "error", status: "failed", data: { message: `Stealth Browser MCP unreachable: ${status.error}` } });
    throw new Error(status.error);
  }
  onProgress({ step: "connected", status: "running", data: { message: `Connected — ${status.toolCount} tools available` } });

  const spawnResult = await spawnBrowser({});
  const spawnText = extractText(spawnResult);
  
  let instanceId = "";
  let liveViewUrl = "";
  
  try {
    const parsed = JSON.parse(spawnText);
    instanceId = parsed.instance_id;
    liveViewUrl = parsed.live_view_url || parsed.liveViewUrl || parsed.viewer_url || parsed.sessionViewerUrl || "";
  } catch {
    const match = spawnText.match(/"instance_id"\s*:\s*"([^"]+)"/);
    if (match) instanceId = match[1];
  }

  if (!instanceId) {
    throw new Error(`Failed to parse instance_id from spawnResult: ${spawnText}`);
  }

  // Fallback check to get instance state if liveViewUrl was not in the spawn result
  if (!liveViewUrl) {
    try {
      const stateResult = await getInstanceState(instanceId);
      const stateText = extractText(stateResult);
      const parsedState = JSON.parse(stateText);
      liveViewUrl = parsedState.live_view_url || parsedState.liveViewUrl || parsedState.viewer_url || parsedState.sessionViewerUrl || "";
    } catch (e) {
      console.warn("Failed to retrieve liveViewUrl from getInstanceState:", e);
    }
  }

  onProgress({ 
    step: "session_started", 
    status: "running", 
    browserId: instanceId,
    data: { 
      message: `Stealth browser instance ${instanceId} spawned`,
      liveViewUrl: liveViewUrl || `https://docs.steel.dev`, // fallback if no URL found
      browserId: instanceId,
      currentUrl: startUrl
    } 
  });

  await navigate(instanceId, startUrl);
  let currentActiveUrl = startUrl;
  onProgress({ step: "navigated", status: "running", data: { message: `Navigated to ${startUrl}`, currentUrl: startUrl } });

  const maxSteps = 15;
  let stepCount = 0;
  let done = false;
  let lastScreenshot = "";
  let userGuidance = "";

  try {
    while (stepCount < maxSteps && !done) {
      stepCount++;

      const screenshotResult = await takeScreenshot(instanceId);
      const screenshot = extractImage(screenshotResult);
      if (screenshot) {
        lastScreenshot = screenshot;
        onProgress({ step: "screenshot", status: "running", data: { screenshot, currentUrl: currentActiveUrl } });
      }

      const contentResult = await getPageContent(instanceId);
      const pageText = extractText(contentResult).slice(0, 8000);

      let promptContent = `Task: "${instruction}"\n`;
      if (userGuidance) {
        promptContent += `User provided guidance: "${userGuidance}"\n`;
        // Reset guidance for the next cycle
        userGuidance = "";
      }
      promptContent += `Step ${stepCount}/${maxSteps}. Current page text: ${pageText}\n` +
        `Decide the single next action. Respond ONLY with JSON:\n` +
        `{"action": "click"|"type"|"stuck"|"done", "selector": "css selector if needed", "text": "text to type if needed", "reasoning": "why", "obstacle": "description of what's blocking, only if action is stuck"}\n` +
        `Use "done" only when the task is genuinely complete.`;

      const aiDecision = await callAI("browser_agent", [{
        role: "user",
        content: promptContent
      }]);

      let decision;
      try {
        decision = JSON.parse(aiDecision.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch {
        onProgress({ step: "warning", status: "running", data: { message: `Step ${stepCount}: could not parse AI decision, retrying` } });
        continue;
      }

      onProgress({ step: "action", status: "running", data: { message: `Step ${stepCount}: ${decision.action} — ${decision.reasoning}` } });

      if (decision.action === "click") {
        await clickElement(instanceId, decision.selector);
        onProgress({ step: "action_complete", status: "running", data: { message: `Clicked: ${decision.selector}`, currentUrl: currentActiveUrl } });
      } else if (decision.action === "type") {
        await typeText(instanceId, decision.selector, decision.text);
        onProgress({ step: "action_complete", status: "running", data: { message: `Typed into: ${decision.selector}`, currentUrl: currentActiveUrl } });
      } else if (decision.action === "stuck") {
        onProgress({
          step: "human_needed",
          status: "paused",
          data: {
            message: `Automation paused: ${decision.obstacle || "AI reported being stuck."}`,
            screenshot: lastScreenshot,
            currentUrl: currentActiveUrl,
            type: "stuck"
          }
        });

        // Pause and wait for human input via the existing resumeTask mechanism
        const resumeData = await registerPendingResume(taskId);
        userGuidance = resumeData?.instruction || "continue";
        onProgress({ step: "resumed", status: "running", data: { message: `Resuming with guidance: ${userGuidance}` } });
      } else if (decision.action === "done") {
        done = true;
        onProgress({ step: "action_complete", status: "running", data: { message: `Task complete: ${decision.reasoning}`, currentUrl: currentActiveUrl } });
      }
    }

    onProgress({ 
      step: "complete", 
      status: "done", 
      data: { 
        extraction: done ? "Automation completed successfully" : "Reached max steps without completion",
        summary: done ? "Automation completed successfully" : "Reached max steps without completion", 
        stepsUsed: stepCount,
        screenshot: lastScreenshot,
        currentUrl: currentActiveUrl
      } 
    });
  } catch (err: any) {
    onProgress({ step: "error", status: "failed", data: { message: err.message, screenshot: lastScreenshot, currentUrl: currentActiveUrl } });
    throw err;
  } finally {
    try {
      await closeInstance(instanceId);
    } catch (e) {
      console.warn("Failed to close stealth browser instance:", e);
    }
    onProgress({ step: "session_closed", status: "done", data: { message: "Stealth browser instance closed" } });
  }
}
