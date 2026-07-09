import { chromium, Browser, BrowserContext, Page } from "playwright";

interface Session {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  createdAt: number;
}

export const activeSessions = new Map<string, Session>();
const pendingResumes = new Map<string, (value: any) => void>();
const MAX_SESSIONS = 10;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export async function createStagehandSession(taskId: string) {
  const existing = activeSessions.get(taskId);
  if (existing) {
    return { page: existing.page, sessionId: taskId };
  }

  if (activeSessions.size >= MAX_SESSIONS) {
    // Close the oldest session to make room
    let oldestId = '';
    let oldestTime = Infinity;
    for (const [id, s] of activeSessions.entries()) {
      if (s.createdAt < oldestTime) { oldestTime = s.createdAt; oldestId = id; }
    }
    if (oldestId) await closeSession(oldestId);
  }

  const browser = await chromium.launch({
    headless: true,
    timeout: 60000,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  activeSessions.set(taskId, { browser, context, page, createdAt: Date.now() });

  // Auto-cleanup after timeout
  setTimeout(() => {
    if (activeSessions.has(taskId)) closeSession(taskId).catch(() => {});
  }, SESSION_TIMEOUT_MS);

  return { page, sessionId: taskId };
}

export function registerPendingResume(taskId: string): Promise<any> {
  return new Promise((resolve) => { pendingResumes.set(taskId, resolve); });
}

export function resumeTaskSession(taskId: string, data?: any): boolean {
  const resolve = pendingResumes.get(taskId);
  if (resolve) { resolve(data); pendingResumes.delete(taskId); return true; }
  return false;
}

export function getSession(taskId: string): any {
  return activeSessions.get(taskId);
}

export async function closeSession(taskId: string) {
  const session = activeSessions.get(taskId);
  if (session) {
    try {
      await session.browser.close();
    } catch (e) {
      console.warn(`Failed to close browser session for task ${taskId}:`, e);
    }
  }
  activeSessions.delete(taskId);
}

