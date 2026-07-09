import { chromium } from 'playwright-core';
import Browserbase from '@browserbasehq/sdk';

export async function launchBrowserbaseSession() {
  const apiKey = process.env.BROWSERBASE_API_KEY;
  const projectId = process.env.BROWSERBASE_PROJECT_ID;

  if (!apiKey || !projectId) {
    throw new Error('BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID environment variables must be set');
  }

  const bb = new Browserbase({ apiKey });
  const session = await bb.sessions.create({
    projectId,
    browserSettings: { timeout: 300 }, // 5 min, matches function maxDuration
  });
  
  const browser = await chromium.connectOverCDP(session.connectUrl);
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();
  const debugUrls = await bb.sessions.debug(session.id);
  
  return { 
    bb, 
    session, 
    browser, 
    page, 
    debugUrl: debugUrls.debuggerUrl 
  };
}
