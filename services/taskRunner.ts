import { Server } from 'socket.io';
import { runTask as runStagehandTask } from './taskOrchestrator';
import { saveTaskToFirestore, updateTaskInFirestore, getTaskFromFirestore } from './firebase';
import { resumeTaskSession } from './browserEngine';
import { db } from '../firebase-client-wrapper';

let globalSendWS: ((taskId: string, data: any) => void) | null = null;

export function setSendWS(fn: (taskId: string, data: any) => void) {
  globalSendWS = fn;
}

async function logAction(taskId: string, msg: string, type = 'info') {
  const entry = { time: new Date().toLocaleTimeString('en-GB'), msg, type, timestamp: Date.now() };
  try {
    await db.collection('assix_tasks').doc(taskId).collection('logs').add(entry);
  } catch (e) {
    console.error('Firestore log error in taskRunner:', e);
  }
  if (globalSendWS) {
    globalSendWS(taskId, { type: 'log', taskId, ...entry });
  }
}

export async function runTask(
  taskId: string,
  intent: string,
  userId: string,
  io: Server,
  useStealth: boolean = false
): Promise<void> {
  const socket = io.to(taskId);

  // Fetch existing task document to preserve taskType, label, config, progress, etc.
  const existingTask = await getTaskFromFirestore(taskId);
  const isStealth = useStealth || existingTask?.config?.useStealth || existingTask?.useStealth || false;

  // Initialize status in Firestore
  await saveTaskToFirestore(taskId, {
    userId,
    intent,
    taskType: existingTask?.taskType || 'dynamic',
    label: existingTask?.label || intent,
    status: 'planning',
    progress: existingTask?.progress !== undefined ? existingTask.progress : 0,
    total: existingTask?.total !== undefined ? existingTask.total : 10,
    createdAt: existingTask?.createdAt || new Date().toISOString(),
    useStealth: isStealth
  }, { merge: true });

  try {
    socket.emit('task_status', {
      taskId,
      status: 'planning',
      message: 'Initializing Stagehand session...'
    });

    socket.emit('task_update', { taskId, message: 'Initializing browser session...' });
    await logAction(taskId, 'Initializing browser session...', 'info');

    const urlMatch = intent.match(/https?:\/\/[^\s]+/);
    const startUrl = urlMatch ? urlMatch[0] : '';

    await runStagehandTask(taskId, intent, startUrl, socket, async (update) => {
      // Handle progress callbacks from Stagehand
      if (update.step === 'session_started') {
        const liveViewUrl = update.data?.liveViewUrl || '';
        const currentUrl = update.data?.currentUrl || startUrl;
        const browserId = update.browserId || update.data?.browserId || '';
        
        // Save liveViewUrl in task document so UI can pull it if refreshed
        await updateTaskInFirestore(taskId, {
          status: 'running',
          liveViewUrl,
          currentUrl,
          browserId,
          progress: 20
        });

        // Emit task_planned so the frontend transitions out of planning mode
        socket.emit('task_planned', { taskId, totalSteps: 5 });

        socket.emit('task_progress', {
          taskId,
          step: 20,
          description: `Live session started.`,
          status: 'running',
          currentUrl,
          browserId,
          data: { ...update.data, browserId }
        });

        socket.emit('task_update', { taskId, message: `Browser session started. Current URL: ${currentUrl || 'about:blank'}` });
        await logAction(taskId, `Browser session started successfully. Current URL: ${currentUrl || 'about:blank'}`, 'success');
      } else if (update.step === 'screenshot') {
        const currentUrl = update.data?.currentUrl || '';
        const screenshot = update.data?.screenshot || '';

        await updateTaskInFirestore(taskId, {
          screenshot,
          currentUrl
        });

        socket.emit('task_progress', {
          taskId,
          status: 'running',
          currentUrl,
          data: { screenshot, currentUrl }
        });
      } else if (update.step === 'navigating') {
        const msg = update.data?.message || 'Navigating...';
        await logAction(taskId, msg, 'info');
      } else if (update.step === 'extracting') {
        const msg = update.data?.message || 'Reading page content...';
        await logAction(taskId, msg, 'info');
      } else if (update.step === 'navigated') {
        const currentUrl = update.data?.currentUrl || startUrl;
        await updateTaskInFirestore(taskId, {
          progress: 40,
          currentUrl
        });

        socket.emit('task_progress', {
          taskId,
          step: 40,
          description: `Navigated to target page.`,
          status: 'running',
          currentUrl,
          data: update.data
        });

        socket.emit('task_update', { taskId, message: `Navigating to: ${currentUrl}` });
        await logAction(taskId, `Successfully navigated to: ${currentUrl}`, 'info');
      } else if (update.step === 'human_needed') {
        const currentUrl = update.data?.currentUrl || '';
        const type = update.data?.type || 'login';
        const message = update.data?.message || 'Human intervention required.';

        await updateTaskInFirestore(taskId, {
          status: 'paused_input',
          currentUrl
        });

        socket.emit('human_needed', {
          taskId,
          type,
          message,
          currentUrl
        });

        socket.emit('task_update', { taskId, message: `Human intervention needed: ${message}` });
        await logAction(taskId, `⚠️ Human intervention needed: ${message}`, 'warning');
      } else if (update.step === 'action_complete') {
        const currentUrl = update.data?.currentUrl || '';
        await updateTaskInFirestore(taskId, {
          progress: 80,
          currentUrl
        });

        socket.emit('task_progress', {
          taskId,
          step: 80,
          description: `AI Action completed successfully.`,
          status: 'running',
          currentUrl,
          data: update.data
        });

        socket.emit('task_update', { taskId, message: `Action completed. Current URL: ${currentUrl}` });
        await logAction(taskId, `✓ AI action completed. Current URL: ${currentUrl}`, 'success');
      } else if (update.step === 'complete') {
        const extraction = update.data?.extraction;
        const currentUrl = update.data?.currentUrl || '';
        const screenshot = update.data?.screenshot || '';
        const summary = typeof extraction === 'string' ? extraction : JSON.stringify(extraction || update.data);
        const resultsCount = Array.isArray(extraction) ? extraction.length : (update.data?.results ? update.data.results.length : 0);

        await updateTaskInFirestore(taskId, {
          status: 'completed',
          progress: 100,
          summary,
          currentUrl,
          screenshot,
          completedAt: new Date().toISOString()
        });

        socket.emit('task_complete', {
          taskId,
          summary,
          currentUrl,
          screenshot,
          results: extraction || update.data
        });

        const leadCount = update.data?.leadCount;
        const completeMsg = leadCount !== undefined ? `Task complete — ${leadCount} leads found.` : `Task complete. ${summary}`;
        socket.emit('task_update', { taskId, message: completeMsg, status: 'done' });
        await logAction(taskId, `✓ ${completeMsg}`, 'success');
      } else if (update.step === 'error') {
        const errorMsg = update.data?.message || 'Execution error';
        const currentUrl = update.data?.currentUrl || '';
        const screenshot = update.data?.screenshot || '';

        await updateTaskInFirestore(taskId, {
          status: 'failed',
          error: errorMsg,
          currentUrl,
          screenshot,
          failedAt: new Date().toISOString()
        });

        socket.emit('task_error', {
          taskId,
          error: errorMsg,
          currentUrl,
          screenshot
        });

        socket.emit('task_update', { taskId, message: `Error: ${errorMsg}`, status: 'failed' });
        await logAction(taskId, `❌ Error: ${errorMsg}`, 'error');
      } else {
        const msg = update.data?.message || update.message || update.description || '';
        if (msg) {
          socket.emit('task_update', { taskId, message: msg });
          await logAction(taskId, msg, 'info');
        }
      }
    }, isStealth);

  } catch (err: any) {
    const errorMsg = err.message || String(err);
    
    await updateTaskInFirestore(taskId, {
      status: 'failed',
      error: errorMsg,
      failedAt: new Date().toISOString()
    });

    socket.emit('task_error', {
      taskId,
      error: errorMsg
    });

    socket.emit('task_update', {
      taskId,
      message: `Execution failed: ${errorMsg}`
    });
    await logAction(taskId, `❌ Execution failed: ${errorMsg}`, 'error');
  }
}

export function resumeTask(taskId: string, data?: any): boolean {
  return resumeTaskSession(taskId, data);
}
