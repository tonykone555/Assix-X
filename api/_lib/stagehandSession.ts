import { Stagehand } from '@browserbasehq/stagehand';

export async function launchStagehandSession() {
  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    apiKey: process.env.BROWSERBASE_API_KEY!,
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    model: {
      modelName: "gemini-2.0-flash",
      apiKey: process.env.GEMINI_API_KEY!
    },
    selfHeal: true,
  });
  await stagehand.init();
  const liveViewUrl = (stagehand as any).browserbaseSessionUrl || (stagehand as any).browserbaseSessionURL || "";
  const sessionId = (stagehand as any).sessionId || (stagehand as any).browserbaseSessionId || "";
  return { stagehand, liveViewUrl, sessionId };
}
