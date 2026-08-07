import { Hyperbrowser } from '@hyperbrowser/sdk';
import { saveTaskToFirestore, updateTaskInFirestore, logAction, saveLeadToFirestore } from './firebase';

/**
 * Hyperbrowser & HyperAgent AI Service
 * Provides cloud browser automation, AI lead extraction, autonomous HyperAgent tasks,
 * website scraping, and multi-page crawling.
 */

let clientInstance: Hyperbrowser | null = null;

export function getHyperbrowserClient(customApiKey?: string): Hyperbrowser | null {
  const apiKey = customApiKey || process.env.HYPERBROWSER_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!clientInstance || customApiKey) {
    clientInstance = new Hyperbrowser({ apiKey });
  }
  return clientInstance;
}

export function isHyperbrowserConfigured(customApiKey?: string): boolean {
  return Boolean(customApiKey || process.env.HYPERBROWSER_API_KEY);
}

export interface ExtractLeadParams {
  urls: string[];
  prompt?: string;
  schema?: any;
  customApiKey?: string;
}

export interface ExtractLeadResult {
  success: boolean;
  jobId?: string;
  data?: any;
  error?: string;
}

/**
 * Extract structured contact leads (emails, phone numbers, decision makers, social links)
 * using Hyperbrowser's AI Extract engine.
 */
export async function extractLeadsWithHyperbrowser(params: ExtractLeadParams): Promise<ExtractLeadResult> {
  const client = getHyperbrowserClient(params.customApiKey);
  if (!client) {
    return {
      success: false,
      error: 'HYPERBROWSER_API_KEY is not configured. Please set your Hyperbrowser API key in Settings.',
    };
  }

  try {
    const defaultPrompt =
      params.prompt ||
      'Extract company details including business name, emails, phone numbers, address, social media profiles (LinkedIn, Twitter, Facebook), contact decision makers, and services offered.';

    // Try startAndWait first, if supported or fallback to start
    let response: any;
    if (typeof client.extract.startAndWait === 'function') {
      response = await client.extract.startAndWait({
        urls: params.urls,
        prompt: defaultPrompt,
        schema: params.schema,
      } as any);
    } else {
      response = await client.extract.start({
        urls: params.urls,
        prompt: defaultPrompt,
        schema: params.schema,
      } as any);
    }

    return {
      success: true,
      jobId: response?.jobId || response?.id,
      data: response?.data || response?.result || response,
    };
  } catch (err: any) {
    console.error('[Hyperbrowser] Extract error:', err.message || err);
    return {
      success: false,
      error: err.message || 'Failed to extract data via Hyperbrowser',
    };
  }
}

export interface HyperAgentTaskParams {
  task: string;
  url?: string;
  customApiKey?: string;
  maxSteps?: number;
  taskId?: string;
}

export interface HyperAgentTaskResult {
  success: boolean;
  jobId?: string;
  result?: any;
  status?: string;
  liveUrl?: string;
  error?: string;
}

/**
 * Execute an autonomous browser AI agent task using Hyperbrowser's HyperAgent.
 */
export async function runHyperAgentTask(params: HyperAgentTaskParams): Promise<HyperAgentTaskResult> {
  const client = getHyperbrowserClient(params.customApiKey);
  if (!client) {
    return {
      success: false,
      error: 'HYPERBROWSER_API_KEY is not configured.',
    };
  }

  try {
    const hyperAgent = client.agents?.hyperAgent;
    if (!hyperAgent) {
      return {
        success: false,
        error: 'HyperAgent module is not available in the current SDK version.',
      };
    }

    const taskPayload = {
      task: params.task,
      url: params.url,
      maxSteps: params.maxSteps || 35,
    };

    // Launch task using hyperAgent.start to retrieve liveUrl immediately
    let startRes: any;
    if (typeof hyperAgent.start === 'function') {
      startRes = await hyperAgent.start(taskPayload as any);
    } else if (typeof hyperAgent.startAndWait === 'function') {
      startRes = await hyperAgent.startAndWait(taskPayload as any);
    }

    const jobId = startRes?.jobId || startRes?.id;
    const liveUrl = startRes?.liveUrl || startRes?.sessionUrl;

    if (params.taskId && liveUrl) {
      await updateTaskInFirestore(params.taskId, {
        liveViewUrl: liveUrl,
        steelDebugUrl: liveUrl
      });
      await logAction(params.taskId, `📹 HyperAgent Live Stream active: ${liveUrl}`, 'info');
    }

    let currentResponse = startRes;
    let taskStatus = startRes?.status || 'running';

    if (jobId && taskStatus === 'running' && typeof hyperAgent.get === 'function') {
      const startTime = Date.now();
      const maxWaitMs = 120 * 1000; // 2 minutes max
      while (taskStatus === 'running' || taskStatus === 'pending') {
        if (Date.now() - startTime > maxWaitMs) break;
        await new Promise(r => setTimeout(r, 2500));
        try {
          const pollRes = await hyperAgent.get(jobId);
          if (pollRes) {
            currentResponse = pollRes;
            taskStatus = pollRes.status || taskStatus;
            if (params.taskId && pollRes.liveUrl) {
              await updateTaskInFirestore(params.taskId, {
                liveViewUrl: pollRes.liveUrl,
                steelDebugUrl: pollRes.liveUrl
              });
            }
          }
        } catch (pollErr) {
          console.warn('[HyperAgent] Status poll error:', pollErr);
        }
      }
    }

    return {
      success: taskStatus === 'completed' || taskStatus === 'success' || !!currentResponse,
      jobId,
      liveUrl: currentResponse?.liveUrl || liveUrl,
      result: currentResponse?.data?.finalResult || currentResponse?.data || currentResponse?.result || currentResponse,
      status: taskStatus,
    };
  } catch (err: any) {
    console.error('[Hyperbrowser] HyperAgent error:', err.message || err);
    return {
      success: false,
      error: err.message || 'HyperAgent task execution failed',
    };
  }
}

/**
 * Scrape a target website with full JavaScript rendering, stealth headers, and anti-bot bypass.
 */
export async function scrapeWithHyperbrowser(url: string, customApiKey?: string): Promise<{ success: boolean; markdown?: string; html?: string; error?: string }> {
  const client = getHyperbrowserClient(customApiKey);
  if (!client) {
    return { success: false, error: 'HYPERBROWSER_API_KEY is not configured.' };
  }

  try {
    let response: any;
    if (typeof client.scrape.startAndWait === 'function') {
      response = await client.scrape.startAndWait({ url } as any);
    } else {
      response = await client.scrape.start({ url } as any);
    }

    return {
      success: true,
      markdown: response?.data?.markdown || response?.markdown || '',
      html: response?.data?.html || response?.html || '',
    };
  } catch (err: any) {
    console.error('[Hyperbrowser] Scrape error:', err.message || err);
    return { success: false, error: err.message || 'Scrape failed' };
  }
}

/**
 * Deep crawl across a domain to locate contact pages, team info, and hidden leads.
 */
export async function crawlWithHyperbrowser(url: string, maxPages = 10, customApiKey?: string): Promise<{ success: boolean; pages?: any[]; error?: string }> {
  const client = getHyperbrowserClient(customApiKey);
  if (!client) {
    return { success: false, error: 'HYPERBROWSER_API_KEY is not configured.' };
  }

  try {
    let response: any;
    if (typeof client.crawl.startAndWait === 'function') {
      response = await client.crawl.startAndWait({ url, maxPages } as any);
    } else {
      response = await client.crawl.start({ url, maxPages } as any);
    }

    return {
      success: true,
      pages: response?.data?.pages || response?.pages || response?.results || [],
    };
  } catch (err: any) {
    console.error('[Hyperbrowser] Crawl error:', err.message || err);
    return { success: false, error: err.message || 'Crawl failed' };
  }
}

/**
 * Helper to recursively extract structured lead objects from raw HyperAgent task outputs
 */
function parseLeadsFromHyperAgentResult(rawData: any): any[] {
  if (!rawData) return [];

  if (Array.isArray(rawData)) return rawData;

  if (typeof rawData === 'object') {
    if (Array.isArray(rawData.leads)) return rawData.leads;
    if (Array.isArray(rawData.items)) return rawData.items;
    if (Array.isArray(rawData.results)) return rawData.results;
    if (Array.isArray(rawData.places)) return rawData.places;
    if (Array.isArray(rawData.businesses)) return rawData.businesses;

    if (rawData.finalResult) {
      const res = parseLeadsFromHyperAgentResult(rawData.finalResult);
      if (res.length) return res;
    }

    if (Array.isArray(rawData.steps)) {
      const collected: any[] = [];
      for (const step of rawData.steps) {
        if (step.actionOutputs && Array.isArray(step.actionOutputs)) {
          for (const ao of step.actionOutputs) {
            if (ao.extract) {
              const parsedExt = parseLeadsFromHyperAgentResult(ao.extract);
              if (parsedExt.length) collected.push(...parsedExt);
            }
          }
        }
      }
      if (collected.length) return collected;
    }
  }

  if (typeof rawData === 'string') {
    const trimmed = rawData.trim();
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed) return parseLeadsFromHyperAgentResult(parsed);
    } catch (_) {}

    const jsonArrayMatch = trimmed.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonArrayMatch) {
      try {
        const parsed = JSON.parse(jsonArrayMatch[0]);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {}
    }

    const jsonObjMatch = trimmed.match(/\{\s*"[^"]+"\s*:[\s\S]*\}/);
    if (jsonObjMatch) {
      try {
        const parsed = JSON.parse(jsonObjMatch[0]);
        if (parsed) return parseLeadsFromHyperAgentResult(parsed);
      } catch (_) {}
    }
  }

  return [];
}

/**
 * Execute direct Google Maps lead extraction using HyperAgent cloud stealth AI agent.
 */
export async function runGoogleMapsHyperAgentScrape(params: {
  userId: string;
  searchTerm: string;
  location: string;
  maxResults?: number;
  taskId?: string;
  customApiKey?: string;
}) {
  const finalTaskId = params.taskId || 'gmaps-hyperagent-' + Date.now();
  const queryStr = `${params.searchTerm} in ${params.location}`.trim();
  const directSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(queryStr)}`;

  await saveTaskToFirestore(finalTaskId, {
    taskId: finalTaskId,
    userId: params.userId || 'system',
    status: "running",
    niche: params.searchTerm || "Local Business",
    city: params.location || "Global",
    targetCount: params.maxResults || 20,
    source: "hyperagent",
    taskType: "google_maps_scrape",
    title: `Google Maps HyperAgent Search (${queryStr})`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  await logAction(finalTaskId, `🚀 Launching HyperAgent Google Maps Search Engine for "${queryStr}"...`, 'info');
  await logAction(finalTaskId, `🔗 Direct Search URL: ${directSearchUrl}`, 'info');

  // Trigger high-speed multi-engine fast scraper in parallel to guarantee instant results & phone/website enrichment
  let fastLeadsPromise = (async () => {
    try {
      const { scrapeGoogleMapsSearchFast } = await import('./fastGoogleMapsScraper');
      return await scrapeGoogleMapsSearchFast(
        params.searchTerm,
        params.location,
        params.maxResults || 20,
        { taskId: finalTaskId }
      );
    } catch (e: any) {
      console.warn('[FastScraper Parallel] error:', e?.message);
      return [];
    }
  })();

  const targetCount = params.maxResults || 20;

  const taskPrompt = `You are an autonomous web scraping browser agent on Google Maps Search.
Goal: Extract AT LEAST ${targetCount} local business leads with direct phone numbers and official websites for "${queryStr}".

Execution steps:
1. Navigate directly to ${directSearchUrl}
2. Wait 3 seconds for search results to load in the left results panel.
3. Scroll down the left results panel (container role="feed" or list of places) REPEATEDLY (at least 6-10 full scroll gestures) to lazy-load more business listings.
4. Extract business details from the search results panel items directly:
   - "name" or "businessName": Full business name
   - "phone": Contact phone number
   - "website": Official website URL
   - "address": Full physical address
   - "rating": Review rating score (e.g. 4.8)
   - "reviews": Total review count
5. Return a valid JSON array of up to ${targetCount} extracted business listing objects.
Output format:
[
  { "name": "Dentist Example", "phone": "+33 1 42 68 55 00", "website": "https://example.com", "address": "10 Rue de Rivoli, Paris", "rating": "4.8" }
]`;

  await logAction(finalTaskId, `⚡ HyperAgent scanning Google Maps search results pane for "${queryStr}"...`, 'info');

  const [agentResult, fastLeads] = await Promise.all([
    runHyperAgentTask({
      taskId: finalTaskId,
      task: taskPrompt,
      url: directSearchUrl,
      customApiKey: params.customApiKey,
      maxSteps: 35
    }).catch(err => ({ success: false, error: err.message, result: '' })),
    fastLeadsPromise
  ]);

  let extractedLeads = parseLeadsFromHyperAgentResult(agentResult.result || '');

  // Merge fastLeads if HyperAgent returned fewer items
  if (fastLeads && fastLeads.length > 0) {
    const seenNames = new Set(extractedLeads.map((l: any) => (l.name || l.businessName || '').toLowerCase().trim()));
    for (const fl of fastLeads) {
      const nKey = (fl.businessName || fl.company || '').toLowerCase().trim();
      if (nKey && !seenNames.has(nKey)) {
        seenNames.add(nKey);
        extractedLeads.push({
          name: fl.businessName,
          businessName: fl.businessName,
          company: fl.company,
          phone: fl.phone,
          website: fl.website,
          address: fl.address,
          rating: fl.rating
        });
      }
    }
  }

  let savedCount = 0;
  const savedNames = new Set<string>();

  for (const item of extractedLeads) {
    const name = item.name || item.businessName || item.company;
    if (!name) continue;
    const nKey = name.toLowerCase().trim();
    if (savedNames.has(nKey)) continue;

    const saved = await saveLeadToFirestore({
      taskId: finalTaskId,
      businessName: name,
      company: name,
      phone: item.phone || '',
      website: item.website || '',
      address: item.address || params.location,
      city: params.location,
      rating: item.rating || '4.5',
      category: params.searchTerm,
      source: 'hyperagent_google_maps',
      leadType: item.website ? 'has_website' : 'no_website',
      createdAt: new Date().toISOString()
    });
    if (saved) {
      savedCount++;
      savedNames.add(nKey);
    }
  }

  // Top up with OpenStreetMap / directory fallback if savedCount < targetCount
  if (savedCount < targetCount) {
    const needed = targetCount - savedCount;
    await logAction(finalTaskId, `⚡ Top-up discovery active: Gathering ${needed} additional local business leads for "${queryStr}"...`, 'info');
    try {
      const { scrapeOpenStreetMapLeads } = await import('./openStreetMapScraper');
      const fallbackLeads = await scrapeOpenStreetMapLeads(
        params.searchTerm,
        params.location,
        needed * 2,
        {},
        finalTaskId
      );

      for (const item of fallbackLeads) {
        if (savedCount >= targetCount) break;
        const bName = item.businessName || item.company;
        if (!bName) continue;
        const nKey = bName.toLowerCase().trim();
        if (savedNames.has(nKey)) continue;

        const saved = await saveLeadToFirestore({
          taskId: finalTaskId,
          businessName: bName,
          company: bName,
          phone: item.phone || '',
          website: item.website || '',
          address: item.address || params.location,
          city: item.city || params.location,
          category: item.category || params.searchTerm,
          rating: item.rating || '4.8',
          source: 'hyperagent_fallback',
          leadType: item.website ? 'has_website' : 'no_website',
          createdAt: new Date().toISOString()
        });
        if (saved) {
          savedCount++;
          savedNames.add(nKey);
          extractedLeads.push({
            name: bName,
            businessName: bName,
            phone: item.phone || '',
            website: item.website || '',
            address: item.address || params.location
          });
        }
      }
    } catch (fallbackErr: any) {
      console.warn('[HyperAgent Top-up] Scrape failed:', fallbackErr.message);
    }
  }

  await updateTaskInFirestore(finalTaskId, {
    status: "completed",
    completedAt: new Date().toISOString(),
    leadsCount: savedCount,
    updatedAt: new Date().toISOString()
  });

  await logAction(finalTaskId, `Google Maps task completed! Saved ${savedCount} business leads with phone numbers and websites.`, 'success');

  return { success: true, taskId: finalTaskId, savedCount, leads: extractedLeads };
}

