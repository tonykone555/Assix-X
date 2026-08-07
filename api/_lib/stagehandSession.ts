import { Stagehand } from '@browserbasehq/stagehand';
import Steel from 'steel-sdk';

export async function launchStagehandSession() {
  const apiKey = process.env.STEEL_API_KEY;

  // 1. Primary Engine: Steel Cloud Remote Browser Session (if STEEL_API_KEY is configured)
  if (apiKey) {
    try {
      console.log(`[stagehandSession] Initializing Steel cloud browser session...`);
      const steel = new Steel({ steelAPIKey: apiKey });
      const session = await steel.sessions.create({
        useStealth: true,
        dimensions: { width: 1440, height: 900 }
      } as any);

      const liveViewUrl = session.sessionViewerUrl || session.debugUrl || (session.id ? `https://app.steel.dev/sessions/${session.id}` : "");

      console.log(`[stagehandSession] Connecting Stagehand over CDP to Steel session ${session.id}...`);
      const stagehand = new Stagehand({
        env: "LOCAL",
        localBrowserLaunchOptions: {
          cdpUrl: session.websocketUrl,
        },
        model: "google/gemini-2.5-flash",
        modelApiKey: process.env.GEMINI_API_KEY,
        modelBaseUrl: process.env.GEMINI_BASE_URL,
        selfHeal: true,
        domSettleTimeout: 30000,
      } as any);

      await stagehand.init();
      const sessionId = session.id;
      (stagehand as any)._steelSessionId = sessionId;

      console.log(`[stagehandSession] Stagehand session successfully connected to Steel! Live viewer: ${liveViewUrl}`);
      return { stagehand, liveViewUrl, sessionId };
    } catch (steelErr: any) {
      console.warn(`[stagehandSession] Steel cloud browser session launch failed: ${steelErr.message || steelErr}. Falling back to local Playwright...`);
    }
  }

  // 2. Fallback: Local Playwright Browser for Stagehand
  try {
    console.log(`[stagehandSession] Attempting to launch Stagehand with local Playwright browser...`);
    const stagehand = new Stagehand({
      env: "LOCAL",
      headless: true,
      model: "google/gemini-2.5-flash",
      modelApiKey: process.env.GEMINI_API_KEY,
      modelBaseUrl: process.env.GEMINI_BASE_URL,
      selfHeal: true,
      domSettleTimeout: 30000,
    } as any);

    await stagehand.init();
    console.log(`[stagehandSession] Stagehand local browser session initialized successfully.`);
    return { stagehand, liveViewUrl: "", sessionId: `local-stagehand-${Date.now()}` };
  } catch (localErr: any) {
    throw new Error(`Failed to initialize Stagehand session: ${localErr.message || localErr}`);
  }
}


