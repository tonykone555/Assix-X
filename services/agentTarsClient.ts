export interface AgentTarsRunOptions {
  instruction: string;
  url: string;
  taskId?: string;
  mode?: 'hybrid' | 'vision' | 'dom';
  screenshotBase64?: string;
}

export interface AgentTarsRunResult {
  success: boolean;
  result?: {
    action?: string;
    targetId?: string;
    selector?: string;
    x?: number;
    y?: number;
    text?: string;
    reasoning?: string;
    message?: string;
    data?: any;
  };
  error?: string;
}

/**
 * Client interface for Agent TARS (Tier 3 fallback service running on Cloud Run or custom host).
 * Uses hybrid vision + DOM execution to resolve navigation or extraction bottlenecks when Tier 2 struggles.
 */
export async function runAgentTarsFallback(
  instruction: string,
  url: string,
  taskId?: string,
  options: Partial<AgentTarsRunOptions> = {}
): Promise<AgentTarsRunResult> {
  const baseUrl = process.env.AGENT_TARS_URL?.replace(/\/$/, '');

  if (!baseUrl) {
    console.warn("[AgentTARS] AGENT_TARS_URL environment variable is not configured. Tier 3 fallback skipped.");
    return {
      success: false,
      error: "AGENT_TARS_URL is not configured on server. Please deploy Agent TARS to Cloud Run and set AGENT_TARS_URL in secrets/env."
    };
  }

  try {
    console.log(`[AgentTARS] Dispatching task to Agent TARS at ${baseUrl}/api/run ...`);
    const response = await fetch(`${baseUrl}/api/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        instruction,
        url,
        taskId,
        mode: options.mode || "hybrid",
        screenshot: options.screenshotBase64 || null
      })
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Agent TARS HTTP ${response.status}: ${errText || response.statusText}`);
    }

    const data = await response.json();
    console.log(`[AgentTARS] Received response from Agent TARS:`, data);

    return {
      success: data.success !== false,
      result: data.result || data,
      error: data.error || undefined
    };
  } catch (err: any) {
    console.error(`[AgentTARS] Failed to communicate with Agent TARS instance: ${err.message}`);
    return {
      success: false,
      error: `Agent TARS communication error: ${err.message}`
    };
  }
}
