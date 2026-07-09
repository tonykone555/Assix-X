import { launchStagehandSession } from '../api/_lib/stagehandSession';
import { z } from 'zod';

const GenericResponseSchema = z.object({
  answer: z.string().describe("A summarized text response answering or detailing the result of the instruction"),
  data: z.any().optional().describe("Any structured data extracted during the task, such as lists, links, or contact info")
});

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

  let stagehandInstance: any = null;

  try {
    const { stagehand, liveViewUrl } = await launchStagehandSession();
    stagehandInstance = stagehand;

    notifyProgress({
      step: 'session_started',
      browserId: taskId,
      data: { liveViewUrl, currentUrl: '', browserId: taskId }
    });

    // Run action
    notifyProgress({
      step: 'navigated',
      browserId: taskId,
      data: { currentUrl: '' }
    });

    await stagehand.act(userInstruction);

    // Extract results
    notifyProgress({
      step: 'action_complete',
      browserId: taskId,
      data: { currentUrl: '' }
    });

    const result = await stagehand.extract(
      `Extract the results answering the user's instruction: "${userInstruction}"`,
      GenericResponseSchema
    );

    notifyProgress({
      step: 'complete',
      browserId: taskId,
      data: { extraction: result.answer || result }
    });

    return result;

  } catch (err: any) {
    notifyProgress({
      step: 'error',
      status: 'failed',
      data: { message: err.message || String(err) }
    });
    throw err;
  } finally {
    if (stagehandInstance) {
      try {
        await stagehandInstance.close();
      } catch (e) {
        console.warn('Failed to close Stagehand session in taskOrchestrator:', e);
      }
    }
  }
}
