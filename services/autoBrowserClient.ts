const AUTO_BROWSER_URL = process.env.AUTO_BROWSER_URL || "http://localhost:8000";
const AUTO_BROWSER_TOKEN = process.env.AUTO_BROWSER_TOKEN || "";

async function autoBrowserRequest(path: string, options: RequestInit = {}) {
  const url = `${AUTO_BROWSER_URL.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${AUTO_BROWSER_TOKEN}`,
      "X-Operator-ID": "assix-backend",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Auto Browser request failed: ${res.status} ${errorText}`);
  }
  return res.json();
}

// Create a session, optionally reusing a saved auth profile (the "login once" pattern)
export async function createSession(name: string, startUrl: string, authProfile?: string) {
  return autoBrowserRequest("/sessions", {
    method: "POST",
    body: JSON.stringify({ name, start_url: startUrl, auth_profile: authProfile }),
  });
}

// Save the current session's login state as a reusable named profile
export async function saveAuthProfile(sessionId: string, profileName: string) {
  return autoBrowserRequest(`/sessions/${sessionId}/save-profile`, {
    method: "POST",
    body: JSON.stringify({ profile_name: profileName }),
  });
}

// Observe current page state - screenshot, DOM summary, everything needed to decide next action
export async function observeSession(sessionId: string) {
  return autoBrowserRequest(`/sessions/${sessionId}/observe`);
}

// Execute an action via MCP tool call
export async function callBrowserTool(toolName: string, args: Record<string, any>) {
  return autoBrowserRequest("/mcp/tools/call", {
    method: "POST",
    body: JSON.stringify({ name: toolName, arguments: args }),
  });
}

export async function closeSession(sessionId: string) {
  return autoBrowserRequest(`/sessions/${sessionId}`, { method: "DELETE" }).catch(() => {});
}

export function getNoVncUrl(AUTO_BROWSER_BASE_URL: string = AUTO_BROWSER_URL): string {
  try {
    const url = new URL(AUTO_BROWSER_BASE_URL);
    if (url.port === "8000") {
      url.port = "6080";
    }
    return `${url.origin}/vnc.html?autoconnect=true`;
  } catch (e) {
    return `${AUTO_BROWSER_BASE_URL}/vnc.html?autoconnect=true`;
  }
}
