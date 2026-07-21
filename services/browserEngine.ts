import { chromium, Browser, BrowserContext, Page } from "playwright";
import Steel from "steel-sdk";

interface Session {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  createdAt: number;
  liveViewUrl?: string;
}

export const activeSessions = new Map<string, Session>();
const pendingResumes = new Map<string, (value: any) => void>();
const MAX_SESSIONS = 10;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export async function createStagehandSession(taskId: string) {
  const existing = activeSessions.get(taskId);
  if (existing) {
    return { page: existing.page, sessionId: taskId, liveViewUrl: existing.liveViewUrl };
  }

  const apiKey = process.env.STEEL_API_KEY;
  if (apiKey) {
    console.log(`[browserEngine] STEEL_API_KEY is configured. Launching Steel session...`);
    try {
      const steel = new Steel({ steelAPIKey: apiKey });
      const session = await steel.sessions.create();
      const liveViewUrl = session.sessionViewerUrl || "";
      console.log(`[browserEngine] Steel session created. ID: ${session.id}. LiveView URL: ${liveViewUrl}`);

      const browser = await chromium.connectOverCDP(`${session.websocketUrl}&apiKey=${apiKey}`);
      const contexts = browser.contexts();
      let context = contexts[0];
      if (!context) {
        context = await browser.newContext({
          viewport: { width: 1024, height: 1024 },
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          locale: 'en-US',
          timezoneId: 'America/New_York',
          extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });
      }
      
      await context.addInitScript(() => {
        try {
          Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
          });
        } catch (e) {}
      });

      const pages = context.pages();
      let page = pages[0];
      if (!page) {
        page = await context.newPage();
      }

      activeSessions.set(taskId, { browser, context, page, createdAt: Date.now(), liveViewUrl });

      // Auto-cleanup after timeout
      setTimeout(() => {
        if (activeSessions.has(taskId)) closeSession(taskId).catch(() => {});
      }, SESSION_TIMEOUT_MS);

      return { page, sessionId: taskId, liveViewUrl };
    } catch (err: any) {
      console.error(`[browserEngine] Failed to initialize Steel remote session: ${err.message}. Falling back to local browser.`);
    }
  }

  const browserServiceUrl = process.env.BROWSER_SERVICE_URL;

  if (browserServiceUrl) {
    console.log(`[browserEngine] BROWSER_SERVICE_URL is set to ${browserServiceUrl}. Using remote Browser Service microservice.`);
    
    // Call remote start session
    try {
      console.log(`[browserEngine] Initializing remote session for task ${taskId}...`);
      const startRes = await fetch(`${browserServiceUrl}/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      });
      if (!startRes.ok) {
        console.error(`[browserEngine] Remote session start returned HTTP status ${startRes.status}`);
      }
    } catch (err: any) {
      console.error(`[browserEngine] Failed to connect to remote session start: ${err.message}`);
    }

    const mockPage: any = {
      _url: '',
      _markdown: '',
      _data: [] as any[],
      
      goto: async (url: string, options?: any) => {
        mockPage._url = url;
        console.log(`[Remote Page] Remote goto called: ${url}`);
        try {
          const response = await fetch(`${browserServiceUrl}/scrape`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId, url })
          });
          if (response.ok) {
            const resData = await response.json();
            if (resData.success) {
              mockPage._url = resData.url || url;
              mockPage._markdown = resData.markdown || '';
              console.log(`[Remote Page] Remote goto success. Extracted ${mockPage._markdown.length} bytes of content.`);
            }
          }
        } catch (err: any) {
          console.error(`[Remote Page] Remote goto failed: ${err.message}. Will use local fallback or empty values.`);
        }
      },
      
      url: () => {
        return mockPage._url || 'about:blank';
      },
      
      evaluate: async (fn: any, ...args: any[]) => {
        console.log(`[Remote Page] Remote evaluate called`);
        return mockPage._markdown || '';
      },
      
      screenshot: async (options?: any) => {
        try {
          const response = await fetch(`${browserServiceUrl}/screenshot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId })
          });
          if (response.ok) {
            const resData = await response.json();
            if (resData.success && resData.screenshot) {
              const base64Str = resData.screenshot;
              if (options?.type === 'base64' || options?.encoding === 'base64') {
                return base64Str;
              }
              return Buffer.from(base64Str, 'base64');
            }
          }
        } catch (err: any) {
          console.error(`[Remote Page] Remote screenshot failed: ${err.message}`);
        }
        return null;
      },

      extractLeads: async (prompt: string): Promise<any[]> => {
        console.log(`[Remote Page] Remote extractLeads called with prompt: "${prompt.slice(0, 60)}..."`);
        try {
          const response = await fetch(`${browserServiceUrl}/scrape`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId, url: mockPage._url, instruction: prompt })
          });
          if (response.ok) {
            const resData = await response.json();
            if (resData.success) {
              return resData.data || [];
            }
          }
        } catch (err: any) {
          console.error(`[Remote Page] Remote extractLeads failed: ${err.message}`);
        }
        return [];
      }
    };

    const mockSession = {
      browser: {
        close: async () => {
          console.log(`[Remote Session] Closed session ${taskId}`);
        }
      } as any,
      context: {} as any,
      page: mockPage as any,
      createdAt: Date.now()
    };

    activeSessions.set(taskId, mockSession);
    return { page: mockPage as unknown as Page, sessionId: taskId };
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
    viewport: { width: 1024, height: 1024 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    locale: 'en-US',
    timezoneId: 'America/New_York',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  // Bypass automated/bot detection (such as Google "unusual activity" stops)
  await context.addInitScript(() => {
    try {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    } catch (e) {}
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
  const browserServiceUrl = process.env.BROWSER_SERVICE_URL;
  if (browserServiceUrl) {
    try {
      console.log(`[browserEngine] Closing session ${taskId} on remote browser-service...`);
      await fetch(`${browserServiceUrl}/session/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      });
    } catch (e: any) {
      console.warn(`Failed to close remote browser session for task ${taskId}:`, e.message);
    }
  }

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

