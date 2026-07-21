export type ErrorCode =
  | 'NAVIGATION_FAILED'
  | 'SELECTOR_NOT_FOUND'
  | 'TIMEOUT'
  | 'BROWSER_CRASHED'
  | 'CAPTCHA_DETECTED'
  | 'CONSENT_PAGE'
  | 'UNKNOWN';

export interface ActionError {
  code: ErrorCode;
  message: string;
  severity: 'transient' | 'fatal';
  retryable: boolean;
}

export function classifyPlaywrightError(err: any): ActionError {
  const msg = (err?.message || String(err)).toLowerCase();

  if (msg.includes('timeout')) {
    return { code: 'TIMEOUT', message: err?.message || String(err), severity: 'transient', retryable: true };
  }
  if (msg.includes('selector') || msg.includes('waiting for selector')) {
    return { code: 'SELECTOR_NOT_FOUND', message: err?.message || String(err), severity: 'transient', retryable: true };
  }
  if (msg.includes('net::') || msg.includes('navigation')) {
    return { code: 'NAVIGATION_FAILED', message: err?.message || String(err), severity: 'transient', retryable: true };
  }
  if (msg.includes('crashed') || msg.includes('disconnected') || msg.includes('target closed')) {
    return { code: 'BROWSER_CRASHED', message: err?.message || String(err), severity: 'fatal', retryable: false };
  }
  if (msg.includes('captcha') || msg.includes('datadome') || msg.includes('are you human')) {
    return { code: 'CAPTCHA_DETECTED', message: err?.message || String(err), severity: 'fatal', retryable: false };
  }
  if (msg.includes('consent.google.com')) {
    return { code: 'CONSENT_PAGE', message: err?.message || String(err), severity: 'transient', retryable: true };
  }
  return { code: 'UNKNOWN', message: err?.message || String(err), severity: 'fatal', retryable: false };
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelayMs?: number; onRetry?: (attempt: number, error: ActionError) => void } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 500, onRetry } = options;
  let lastError: ActionError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = classifyPlaywrightError(err);
      if (!lastError.retryable || attempt === maxRetries) {
        throw err;
      }
      if (onRetry) onRetry(attempt + 1, lastError);
      const jitter = Math.random() * 200;
      const delay = baseDelayMs * Math.pow(2, attempt) + jitter;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(lastError?.message || 'Retry failed');
}
