import { Stagehand } from '@browserbasehq/stagehand';
import Steel from 'steel-sdk';

export async function launchStagehandSession() {
  const apiKey = process.env.STEEL_API_KEY;
  if (!apiKey) {
    throw new Error("STEEL_API_KEY is not configured in Settings/environment.");
  }

  const steel = new Steel({ steelAPIKey: apiKey });
  const session = await steel.sessions.create();
  const liveViewUrl = session.sessionViewerUrl || "";

  const stagehand = new Stagehand({
    env: "LOCAL",
    localBrowserLaunchOptions: {
      cdpUrl: `${session.websocketUrl}&apiKey=${apiKey}`,
    },
    model: "google/gemini-2.5-flash",
    modelApiKey: process.env.GEMINI_API_KEY,
    modelBaseUrl: process.env.GEMINI_BASE_URL,
    selfHeal: true,
    domSettleTimeout: 30000,
  } as any);

  try {
    await stagehand.init();
  } catch (err: any) {
    throw new Error(`Failed to initialize remote browser session: ${err.message || err}`);
  }

  const sessionId = session.id;
  (stagehand as any)._steelSessionId = sessionId;

  return { stagehand, liveViewUrl, sessionId };
}
