import { sendToHermes } from './hermes';

export function getGeminiEnv() {
  return {
    AI_GATEWAY_API_KEY: process.env.VERCEL_AI_GATEWAY_KEY || '',
    AI_GATEWAY_MODEL: process.env.AI_GATEWAY_MODEL || 'google/gemini-2.5-flash',
    AI_GATEWAY_URL: process.env.AI_GATEWAY_URL || 'https://ai-gateway.vercel.sh'
  };
}

export function getLiCookies() {
  return [{
    name: 'li_at',
    value: process.env.LINKEDIN_LI_AT || '',
    domain: '.linkedin.com'
  }];
}

export async function runBrowserTask(
  instruction: string,
  onProgress: (update: any) => void
): Promise<any> {

  const { withAgentBrowserSandbox, 
          runAgentBrowserCommand } = 
    await import('@agent-browser/sandbox/vercel');

  try {
    return await withAgentBrowserSandbox(async (sandbox) => {
      
      onProgress({ 
        step: 'starting',
        status: 'running',
        message: 'Browser starting...'
      });

      // Execute the instruction
      const outputPromise = runAgentBrowserCommand(
        sandbox,
        ['chat', instruction]
      );

      // Poll screenshots every 3 seconds while running
      const screenshotInterval = setInterval(async () => {
        try {
          const shot = await runAgentBrowserCommand(
            sandbox,
            ['screenshot', '--base64']
          );
          if (shot.stdout) {
            onProgress({
              step: 'screenshot',
              status: 'running',
              screenshot: shot.stdout.trim()
            });
          }
        } catch {}
      }, 3000);

      try {
        const output = await outputPromise;
        clearInterval(screenshotInterval);
        
        // Final screenshot
        const finalShot = await runAgentBrowserCommand(
          sandbox,
          ['screenshot', '--base64']
        );

        onProgress({
          step: 'complete',
          status: 'done',
          message: 'Task complete',
          screenshot: finalShot.stdout?.trim(),
          data: output.stdout
        });

        try {
          await sendToHermes(`Browser automation task completed. Instruction: "${instruction}". Results: ${JSON.stringify(output.stdout)}`);
        } catch (hermesErr: any) {
          console.error('Failed to report to Hermes:', hermesErr);
          onProgress({
            message: `Hermes error: ${hermesErr?.message || String(hermesErr)}`
          });
        }

        return output.stdout;
        
      } catch (err: any) {
        clearInterval(screenshotInterval);
        onProgress({
          step: 'error',
          status: 'failed',
          message: `Sandbox error: ${err.message || String(err)}`
        });
        try {
          await sendToHermes(`Browser automation task failed. Instruction: "${instruction}". Error: ${err.message}`);
        } catch (hermesErr: any) {
          console.error('Failed to report to Hermes:', hermesErr);
          onProgress({
            message: `Hermes error: ${hermesErr?.message || String(hermesErr)}`
          });
        }
        throw err;
      }
    }, { env: getGeminiEnv() });
  } catch (err: any) {
    onProgress({
      step: 'error',
      status: 'failed',
      message: `Sandbox error: ${err.message || String(err)}`
    });
    throw err;
  }
}

export async function scrapeGoogleMaps(
  query: string,
  city: string,
  count: number = 20,
  onProgress: (update: any) => void
): Promise<any[]> {
  
  const instruction = 
    `Go to https://www.google.com/maps/search/${
      encodeURIComponent(query + ' ' + city)
    }
    Wait for results to load.
    Extract all visible businesses with:
    - Business name
    - Phone number
    - Address
    - Rating and review count
    - Website URL if shown
    Extract up to ${count} businesses.
    Return as JSON array.`;

  const result = await runBrowserTask(
    instruction, onProgress
  );
  
  try {
    return JSON.parse(result);
  } catch {
    return [];
  }
}

export async function scrapeLeboncoin(
  category: string,
  city: string,
  count: number = 20,
  onProgress: (update: any) => void
): Promise<any[]> {

  const instruction =
    `Go to https://www.leboncoin.fr/recherche?
    category=${category}&locations=${city}
    Wait for listings to load.
    Extract all visible listings with:
    - Title
    - Price
    - Location  
    - Listing URL
    - Owner name if visible
    Extract up to ${count} listings.
    Return as JSON array.`;

  const result = await runBrowserTask(
    instruction, onProgress
  );

  try {
    return JSON.parse(result);
  } catch {
    return [];
  }
}
