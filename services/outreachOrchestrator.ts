import { createSession, observeSession, callBrowserTool, closeSession, saveAuthProfile, getNoVncUrl } from './autoBrowserClient';
import { callAI } from './aiService';

export async function sendOutreachMessage(
  userId: string,
  platform: 'linkedin' | 'instagram' | 'leboncoin' | 'whatsapp',
  profileUrl: string,
  message: string,
  taskId?: string,
  logActionFn?: (taskId: string, msg: string, status: string) => Promise<void>
) {
  const authProfile = `${userId}-${platform}`; // reuses the saved login for this user+platform combo

  const session = await createSession(`outreach-${Date.now()}`, profileUrl, authProfile);
  const sessionId = session.id;

  try {
    if (taskId && logActionFn) {
      await logActionFn(taskId, `Session created (${sessionId}), observing page...`, 'info');
    }

    const observation = await observeSession(sessionId);

    // Gemini reads the DOM summary + screenshot to decide the message-box locator
    const decision = await callAI("vision_agent", [
      {
        role: "user",
        content: `Find the message/DM input on this page. DOM summary: ${JSON.stringify(observation.dom_summary || {})}\nRespond ONLY with JSON: {"selector": "..."}`
      }
    ]);

    let selector = "textarea, input[type='text'], [contenteditable='true']";
    try {
      const parsed = JSON.parse(decision.replace(/```json/g, "").replace(/```/g, "").trim());
      if (parsed.selector) selector = parsed.selector;
    } catch (e) {
      console.warn("Failed to parse selector JSON, falling back to default textarea selector", e);
    }

    await callBrowserTool("browser.type", { session_id: sessionId, selector, text: message });
    await callBrowserTool("browser.press_key", { session_id: sessionId, selector, key: "Enter" });

    if (taskId && logActionFn) {
      await logActionFn(taskId, `Message sent via Auto Browser`, 'success');
    }

    return { success: true, sessionId };
  } catch (err: any) {
    if (taskId && logActionFn) {
      await logActionFn(taskId, `Auto Browser outreach failed: ${err.message}`, 'error');
    }
    throw err;
  } finally {
    await closeSession(sessionId);
  }
}
