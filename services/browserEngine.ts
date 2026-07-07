export const activeSessions = new Map<string, any>();
const pendingResumes = new Map<string, (value: any) => void>();

export function registerPendingResume(taskId: string): Promise<any> {
  return new Promise((resolve) => {
    pendingResumes.set(taskId, resolve);
  });
}

export function resumeTaskSession(taskId: string, data?: any): boolean {
  const resolve = pendingResumes.get(taskId);
  if (resolve) {
    resolve(data);
    pendingResumes.delete(taskId);
    return true;
  }
  return false;
}

export async function createStagehandSession(taskId: string) {
  return { stagehand: {}, liveViewUrl: "", sessionId: "" };
}

export function getSession(taskId: string): any {
  return activeSessions.get(taskId);
}

export async function runAct(taskId: string, instruction: string) {
  return {};
}

export async function runExtract(
  taskId: string, 
  instruction: string, 
  schema?: any
) {
  return {};
}

export async function runObserve(taskId: string, instruction: string) {
  return [];
}

export async function navigateTo(taskId: string, url: string) {
  return;
}

export async function closeSession(taskId: string) {
  activeSessions.delete(taskId);
}
