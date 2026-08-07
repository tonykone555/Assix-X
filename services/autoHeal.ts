import { db } from '../firebase-client-wrapper';
import { callAI } from './aiService';

export interface HealedSelector {
  originalSelector: string;
  healedSelector: string;
  pageContext: string; // rough site identifier, e.g. "google-maps-detail-panel"
  healedAt: string;
  confidence: 'high' | 'medium' | 'low';
  fieldDescription?: string;
  reasoning?: string;
}

// In-memory cache for this session
const healedSelectorCache = new Map<string, HealedSelector>();

async function logAction(taskId: string, msg: string, type: 'info' | 'warning' | 'error' = 'info') {
  try {
    const entry = {
      time: new Date().toLocaleTimeString('en-GB'),
      msg,
      type,
      timestamp: Date.now()
    };
    await db.collection('assix_tasks').doc(taskId).collection('logs').add(entry);
  } catch (e) {
    console.warn('[AutoHeal] Firestore log write failed:', e);
  }
}

export async function trySelectorWithHeal(
  page: any,
  selector: string,
  fieldDescription: string, // e.g. "the phone number button"
  pageContext: string,
  taskId?: string
): Promise<{ value: string | null; healed: boolean }> {
  // Check cache first - avoid re-healing the same broken selector repeatedly
  const cacheKey = `${pageContext}:${selector}`;
  const cached = healedSelectorCache.get(cacheKey);
  if (cached) {
    const result = await page.$eval(cached.healedSelector, (el: any) => el.textContent || el.href || el.getAttribute('aria-label')).catch(() => null);
    if (result) return { value: result, healed: true };
  }

  // Try the original selector first
  const original = await page.$eval(selector, (el: any) => el.textContent || el.href || el.getAttribute('aria-label')).catch(() => null);
  if (original) return { value: original, healed: false };

  // Selector failed - attempt to heal it
  if (taskId) await logAction(taskId, `Selector "${selector}" broken for "${fieldDescription}" - attempting auto-heal...`, 'warning');

  let screenshot = '';
  try {
    const buffer = await page.screenshot({ type: 'jpeg', quality: 50 });
    screenshot = typeof buffer === 'string' ? buffer : buffer.toString('base64');
  } catch (e) {}

  const domSnapshot = await page.evaluate(() => document.body.innerHTML.slice(0, 8000)).catch(() => '');

  const healResponse = await callAI("vision_agent", [{
    role: "user",
    content: `The CSS selector "${selector}" no longer finds "${fieldDescription}" on this page (${pageContext}).
Look at this partial HTML: ${domSnapshot}

Find the correct current CSS selector for "${fieldDescription}". Respond ONLY with JSON: {"selector": "the new CSS selector", "confidence": "high", "reasoning": "brief explanation"}`
  }], screenshot);

  try {
    const parsed = JSON.parse(healResponse.replace(/```json/g, "").replace(/```/g, "").trim());
    if (parsed && parsed.selector) {
      const healedValue = await page.$eval(parsed.selector, (el: any) => el.textContent || el.href || el.getAttribute('aria-label')).catch(() => null);

      if (healedValue) {
        const confidenceVal = parsed.confidence === 'high' || parsed.confidence === 'low' ? parsed.confidence : 'medium';
        
        healedSelectorCache.set(cacheKey, {
          originalSelector: selector,
          healedSelector: parsed.selector,
          pageContext,
          healedAt: new Date().toISOString(),
          confidence: confidenceVal,
          fieldDescription,
          reasoning: parsed.reasoning || ''
        });

        if (taskId) await logAction(taskId, `Auto-healed: "${selector}" → "${parsed.selector}" (${confidenceVal} confidence) - ${parsed.reasoning || ''}`, 'info');

        // Persist healed selectors to Firestore so they survive restarts and inform future runs
        try {
          await db.collection('healed_selectors').add({
            originalSelector: selector,
            healedSelector: parsed.selector,
            pageContext,
            fieldDescription,
            confidence: confidenceVal,
            reasoning: parsed.reasoning || '',
            healedAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('[AutoHeal] Firestore save error:', e);
        }

        return { value: healedValue, healed: true };
      }
    }
  } catch (err: any) {
    if (taskId) await logAction(taskId, `Auto-heal failed for "${fieldDescription}": ${err.message}`, 'error');
  }

  return { value: null, healed: false };
}
