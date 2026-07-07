import { runBrowserTask } from './agentBrowser';

export async function runTask(
  taskId: string,
  userInstruction: string,
  arg3?: any,
  arg4?: any,
  arg5?: (update: any) => void
): Promise<any> {
  const onProgress = typeof arg3 === 'function' ? arg3 : arg5 || (() => {});
  const socket = typeof arg3 !== 'function' ? arg4 : null;

  const notifyProgress = (update: any) => {
    onProgress(update);
    if (socket) {
      socket.emit('task_update', { taskId, ...update });
    }
  };

  try {
    const result = await runBrowserTask(userInstruction, (update) => {
      // Map agent-browser updates to compatible taskRunner updates
      let mappedStep = update.step;
      let mappedData = update.data || {};
      
      if (update.step === 'starting') {
        mappedStep = 'session_started';
        mappedData = { liveViewUrl: '', currentUrl: '', browserId: taskId };
      } else if (update.step === 'executing') {
        mappedStep = 'navigated';
        mappedData = { currentUrl: '', screenshot: update.screenshot || '' };
      } else if (update.step === 'screenshot') {
        mappedStep = 'action_complete';
        mappedData = { currentUrl: '', screenshot: update.screenshot || '' };
      } else if (update.step === 'complete') {
        mappedStep = 'complete';
        mappedData = { extraction: update.data };
      }

      notifyProgress({
        ...update,
        step: mappedStep,
        data: mappedData,
        browserId: taskId
      });
    });

    return result;
  } catch (err: any) {
    notifyProgress({
      step: 'error',
      status: 'failed',
      data: { message: err.message }
    });
    throw err;
  }
}
