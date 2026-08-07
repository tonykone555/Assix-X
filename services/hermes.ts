const HERMES_URL = process.env.HERMES_URL;
const HERMES_PASSWORD = process.env.HERMES_PASSWORD;
export const HERMES_MODAL_BRIDGE_URL = process.env.HERMES_MODAL_BRIDGE_URL || "https://tonykone21--hermes-browser-bridge-run-hermes-task.modal.run";

export async function runHermesModalTask(task: string, url: string): Promise<any> {
  const targetUrl = url.startsWith('http') ? url : `https://${url}`;
  const response = await fetch(HERMES_MODAL_BRIDGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task,
      url: targetUrl
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Hermes Modal Bridge HTTP ${response.status}: ${errText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await response.json();
  } else {
    const text = await response.text();
    return { status: 'completed', output: text };
  }
}

export async function sendToHermes(
  instruction: string
): Promise<string> {
  const res = await fetch(
    `${HERMES_URL}/v1/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HERMES_PASSWORD}`
      },
      body: JSON.stringify({
        model: 'hermes',
        messages: [{ role: 'user', content: instruction }],
        stream: false
      })
    }
  );
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// Hermes centralized task and live-view reporter registry
let wsBroadcaster: ((taskId: string, data: any) => void) | null = null;
let socketBroadcaster: ((taskId: string, event: string, data: any) => void) | null = null;

export function registerHermesBroadcasters(
  ws: (taskId: string, data: any) => void,
  socket: (taskId: string, event: string, data: any) => void
) {
  wsBroadcaster = ws;
  socketBroadcaster = socket;
}

export async function reportStage(taskId: string, stage: string, description?: string) {
  console.log(`[HERMES REPORT] Task ${taskId} - Stage: ${stage} - ${description || ''}`);
  if (wsBroadcaster) {
    wsBroadcaster(taskId, { type: 'status', taskId, stage, description: description || stage });
  }
  if (socketBroadcaster) {
    socketBroadcaster(taskId, 'task_progress', { taskId, stage, description: description || stage });
  }

  // Optionally log to Hermes LLM/chat history if HERMES_URL is configured
  if (HERMES_URL && HERMES_PASSWORD) {
    try {
      await sendToHermes(`Log stage transition for task ${taskId}: ${stage} - ${description || ''}`);
    } catch (e) {
      console.error('Hermes stage notification log failed:', e);
    }
  }
}

export async function reportScreenshot(taskId: string, imageBase64: string) {
  if (wsBroadcaster) {
    wsBroadcaster(taskId, { type: 'screenshot', taskId, imageBase64 });
  }
  if (socketBroadcaster) {
    socketBroadcaster(taskId, 'task_progress', { taskId, screenshot: imageBase64 });
  }
}

export async function reportProgress(taskId: string, progress: number, total: number) {
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0;
  if (wsBroadcaster) {
    wsBroadcaster(taskId, { type: 'status', taskId, progress, total, progressPct: pct });
  }
  if (socketBroadcaster) {
    socketBroadcaster(taskId, 'task_progress', { taskId, step: progress, progress, total, progressPct: pct });
  }
}

export async function reportComplete(taskId: string, results: any) {
  if (wsBroadcaster) {
    wsBroadcaster(taskId, { type: 'complete', taskId, results });
  }
  if (socketBroadcaster) {
    socketBroadcaster(taskId, 'task_complete', { taskId, results });
  }
}

export async function reportError(taskId: string, error: string) {
  if (wsBroadcaster) {
    wsBroadcaster(taskId, { type: 'error', taskId, error });
  }
  if (socketBroadcaster) {
    socketBroadcaster(taskId, 'task_error', { taskId, error });
  }
}
