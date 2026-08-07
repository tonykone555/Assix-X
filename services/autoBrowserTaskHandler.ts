import { createSession, observeSession, callBrowserTool, closeSession, getNoVncUrl } from './autoBrowserClient';
import { callAI, callGroq } from './aiService';

export interface ProgressUpdate {
  step: string;
  status: 'running' | 'paused' | 'done' | 'failed' | 'warning';
  data: {
    message: string;
    screenshot?: string;
    novncUrl?: string;
    stepsUsed?: number;
    obstacle?: string;
    [key: string]: any;
  };
}

export async function runGeneralBrowserTask(
  userId: string,
  instruction: string,
  startUrl: string,
  onProgress: (update: ProgressUpdate) => void,
  authProfile?: string,
  maxSteps: number = 15
) {
  let session: any;
  try {
    session = await createSession(`task-${Date.now()}`, startUrl, authProfile);
  } catch (err: any) {
    onProgress({
      step: "session_failed",
      status: "failed",
      data: { message: `Failed to initialize Auto Browser session: ${err.message}` }
    });
    return { status: "failed", error: err.message };
  }

  const sessionId = session.id;

  onProgress({
    step: "session_started",
    status: "running",
    data: { message: `Browser session started, navigating to ${startUrl}`, sessionId }
  });

  let stepCount = 0;
  let done = false;

  try {
    while (stepCount < maxSteps && !done) {
      stepCount++;

      let observation: any;
      try {
        observation = await observeSession(sessionId);
      } catch (err: any) {
        onProgress({
          step: "observe_error",
          status: "warning",
          data: { message: `Step ${stepCount}: Observation failed: ${err.message}` }
        });
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }

      onProgress({
        step: "observed",
        status: "running",
        data: {
          message: `Step ${stepCount}: Reading page state and visual DOM...`,
          screenshot: observation?.screenshot
        }
      });

      const promptText = `Task: "${instruction}"\nStep ${stepCount}/${maxSteps}.
DOM summary: ${JSON.stringify(observation?.dom_summary || {})}

Decide the next action. Respond ONLY with JSON format:
{
  "action": "click" | "type" | "scroll" | "navigate" | "download" | "done" | "stuck",
  "selector": "CSS selector if clicking, typing, or downloading",
  "text": "text string if typing",
  "url": "URL if navigating",
  "reasoning": "Brief explanation of why this step is taken",
  "obstacle": "Specific description of why you are stuck (e.g. CAPTCHA, 2FA prompt) only if action is 'stuck'"
}`;

      let decisionText = '';
      try {
        if (observation?.screenshot) {
          decisionText = await callGroq([
            { role: "user", content: promptText }
          ], true, observation.screenshot);
        } else {
          decisionText = await callAI("vision_agent", [
            { role: "user", content: promptText }
          ]);
        }
      } catch (err: any) {
        console.warn(`Fallback to standard AI model for step ${stepCount}...`);
        decisionText = await callAI("vision_agent", [
          { role: "user", content: promptText }
        ]).catch(() => '{}');
      }

      let parsed: any;
      try {
        const cleaned = decisionText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch {
        onProgress({
          step: "warning",
          status: "running",
          data: { message: `Step ${stepCount}: Couldn't parse decision JSON, retrying step...` }
        });
        continue;
      }

      onProgress({
        step: "action",
        status: "running",
        data: { message: `Step ${stepCount}: ${parsed.action || 'processing'} — ${parsed.reasoning || ''}` }
      });

      switch (parsed.action) {
        case "click":
          await callBrowserTool("browser.click", { session_id: sessionId, selector: parsed.selector });
          break;
        case "type":
          await callBrowserTool("browser.type", { session_id: sessionId, selector: parsed.selector, text: parsed.text });
          break;
        case "scroll":
          await callBrowserTool("browser.scroll", { session_id: sessionId, direction: "down" });
          break;
        case "navigate":
          await callBrowserTool("browser.navigate", { session_id: sessionId, url: parsed.url });
          break;
        case "download":
          await callBrowserTool("browser.download", { session_id: sessionId, selector: parsed.selector });
          break;
        case "stuck":
          onProgress({
            step: "human_needed",
            status: "paused",
            data: {
              message: parsed.obstacle || "Human intervention required (CAPTCHA/Auth)",
              novncUrl: getNoVncUrl()
            }
          });
          return { status: "paused", sessionId, reason: parsed.obstacle };
        case "done":
          done = true;
          break;
        default:
          await new Promise(r => setTimeout(r, 1000));
          break;
      }
    }

    onProgress({
      step: "task_complete",
      status: "done",
      data: {
        message: done ? "Task completed successfully" : "Reached maximum execution step limit",
        stepsUsed: stepCount
      }
    });

    return { status: done ? "complete" : "max_steps_reached", sessionId };
  } finally {
    if (done) {
      await closeSession(sessionId);
    }
  }
}
