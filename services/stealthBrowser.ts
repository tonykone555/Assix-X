const STEALTH_URL = process.env.STEALTH_BROWSER_URL;
const STEALTH_TOKEN = process.env.STEALTH_BROWSER_TOKEN;

async function mcpCall(tool: string, args: object = {}) {
  if (!STEALTH_URL) {
    return null;
  }
  try {
    const res = await fetch(`${STEALTH_URL}/mcp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STEALTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: { name: tool, arguments: args },
        id: Date.now()
      })
    });
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.warn(`mcpCall failed for tool ${tool}:`, err);
    return null;
  }
}

export async function spawnBrowser(): Promise<string> {
  const result = await mcpCall('spawn_browser', {});
  return result?.content?.[0]?.text || 
         result?.browser_id || '';
}

export async function navigate(
  browserId: string, url: string
) {
  return mcpCall('navigate', { 
    instance_id: browserId,
    browser_id: browserId, url 
  });
}

export async function getPageContent(
  browserId: string
): Promise<string> {
  const result = await mcpCall('get_page_content', { 
    instance_id: browserId,
    browser_id: browserId 
  });
  return result?.content?.[0]?.text || '';
}

export async function takeScreenshot(
  browserId: string
): Promise<string> {
  const result = await mcpCall('take_screenshot', { 
    instance_id: browserId,
    browser_id: browserId 
  });
  return result?.content?.[0]?.data || '';
}

export async function clickElement(
  browserId: string,
  selector: string
) {
  return mcpCall('click_element', { 
    instance_id: browserId,
    browser_id: browserId, selector 
  });
}

export async function typeText(
  browserId: string,
  text: string
) {
  return mcpCall('type_text', { 
    instance_id: browserId,
    browser_id: browserId, text 
  });
}

export async function setCookies(
  browserId: string,
  cookies: object[]
) {
  return mcpCall('set_cookies', { 
    instance_id: browserId,
    browser_id: browserId, cookies 
  });
}

export async function closeBrowser(browserId: string) {
  return mcpCall('close_browser', { 
    instance_id: browserId,
    browser_id: browserId 
  });
}
