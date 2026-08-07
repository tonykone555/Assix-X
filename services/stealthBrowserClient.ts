import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const STEALTH_URL = process.env.STEALTH_BROWSER_URL || "";
const STEALTH_TOKEN = process.env.STEALTH_BROWSER_MCP_AUTH_TOKEN || "";

let client: Client | null = null;
let connectionError: string | null = null;

export async function getStealthClient(): Promise<Client> {
  if (client) return client;
  try {
    const transport = new StreamableHTTPClientTransport(
      new URL(`${STEALTH_URL}/mcp/`),
      { requestInit: { headers: { Authorization: `Bearer ${STEALTH_TOKEN}` } } }
    );
    client = new Client({ name: "assix-backend", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);
    connectionError = null;
    return client;
  } catch (err: any) {
    connectionError = err.message;
    throw new Error(`Failed to connect to Stealth Browser MCP: ${err.message}`);
  }
}

export async function checkStealthConnection(): Promise<{ connected: boolean; toolCount?: number; error?: string }> {
  try {
    const c = await getStealthClient();
    const tools = await c.listTools();
    return { connected: true, toolCount: tools.tools.length };
  } catch (err: any) {
    return { connected: false, error: err.message };
  }
}

async function call(toolName: string, args: Record<string, any> = {}): Promise<any> {
  const c = await getStealthClient();
  const result = await c.callTool({ name: toolName, arguments: args });
  if (result.isError) {
    throw new Error(`Tool '${toolName}' failed: ${JSON.stringify(result.content)}`);
  }
  return result;
}

function extractText(result: any): string {
  return result?.content?.find((c: any) => c.type === "text")?.text || "";
}

function extractImage(result: any): string {
  return result?.content?.find((c: any) => c.type === "image")?.data || "";
}

// Browser lifecycle
export const spawnBrowser = (opts: any = {}) => call("spawn_browser", opts);
export const closeInstance = (instance_id: string) => call("close_instance", { instance_id });
export const listInstances = () => call("list_instances");
export const getInstanceState = (instance_id: string) => call("get_instance_state", { instance_id });

// Navigation
export const navigate = (instance_id: string, url: string) => call("navigate", { instance_id, url });
export const goBack = (instance_id: string) => call("go_back", { instance_id });
export const reloadPage = (instance_id: string) => call("reload_page", { instance_id });

// Real actions — the core of automation, not just reading
export const queryElements = (instance_id: string, selector: string) => call("query_elements", { instance_id, selector });
export const clickElement = (instance_id: string, selector: string) => call("click_element", { instance_id, selector });
export const typeText = (instance_id: string, selector: string, text: string) => call("type_text", { instance_id, selector, text });
export const selectOption = (instance_id: string, selector: string, value: string) => call("select_option", { instance_id, selector, value });
export const scrollPage = (instance_id: string, amount?: number) => call("scroll_page", { instance_id, amount });
export const waitForElement = (instance_id: string, selector: string) => call("wait_for_element", { instance_id, selector });

// Observation
export const takeScreenshot = (instance_id: string) => call("take_screenshot", { instance_id });
export const getPageContent = (instance_id: string) => call("get_page_content", { instance_id });

export { extractText, extractImage };
