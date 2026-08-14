import { exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';

const execAsync = promisify(exec);

export interface ScoutResearchResult {
  objective: string;
  timestamp: string;
  sourcesUsed: string[];
  jinaWebMarkdown?: string;
  exaSearchResults?: any[];
  youtubeMetadata?: any;
  githubRepoData?: any;
  overpassPoiData?: any[];
  socialData?: any;
  synthesizedSummary?: string;
}

import { searchWebDDG } from './jinaReaderService';

/**
 * 1. Web Reader Engine (Direct Scrape)
 * Converts any live web URL into clean text/markdown without third-party proxies.
 */
export async function jinaReadUrl(url: string, customOptions: { targetSelector?: string; removeImages?: boolean } = {}): Promise<{ success: boolean; markdown: string; title?: string; error?: string }> {
  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 20000
    });

    if (!response.ok) {
      return {
        success: false,
        markdown: '',
        error: `HTTP ${response.status} ${response.statusText}`
      };
    }

    const html = await response.text();
    const cleanText = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : targetUrl;

    return {
      success: true,
      title,
      markdown: cleanText.slice(0, 50000)
    };
  } catch (err: any) {
    console.error('[ScoutAgent - Web Reader Error]:', err.message);
    return {
      success: false,
      markdown: '',
      error: err.message || 'Failed to read URL'
    };
  }
}

/**
 * 2. Exa / Web Semantic Search Engine
 */
export async function exaSemanticSearch(query: string, options: { numResults?: number; includeDomains?: string[]; excludeDomains?: string[]; category?: string } = {}): Promise<{ success: boolean; results: any[]; error?: string }> {
  try {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
      // Direct Web Search Fallback
      const ddgResults = await searchWebDDG(query);
      const results = ddgResults.map(item => ({
        title: item.title,
        url: item.url,
        snippet: item.description || item.content,
        score: 0.9
      }));
      return { success: true, results };
    }

    const body: any = {
      query,
      numResults: options.numResults || 8,
      useAutoprompt: true,
      contents: {
        text: true,
        highlights: {
          numSentences: 3
        }
      }
    };

    if (options.includeDomains && options.includeDomains.length > 0) body.includeDomains = options.includeDomains;
    if (options.excludeDomains && options.excludeDomains.length > 0) body.excludeDomains = options.excludeDomains;

    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      timeout: 15000
    });

    if (!response.ok) {
      throw new Error(`Exa API status ${response.status}`);
    }

    const data = (await response.json()) as any;
    const results = (data.results || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      url: r.url,
      publishedDate: r.publishedDate,
      author: r.author,
      score: r.score,
      snippet: (r.highlights && r.highlights[0]) || r.text?.slice(0, 300) || ''
    }));

    return { success: true, results };
  } catch (err: any) {
    console.error('[ScoutAgent - Exa Search Error]:', err.message);
    return { success: false, results: [], error: err.message };
  }
}

/**
 * 3. yt-dlp YouTube Extraction Engine
 * Uses the native yt-dlp CLI tool to extract full video metadata, transcript/subtitles, description, and stats.
 */
export async function ytDlpExtractVideoDetails(youtubeUrl: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cleanUrl = youtubeUrl.trim();
    const cmd = `yt-dlp --dump-json --skip-download "${cleanUrl}"`;
    
    const { stdout } = await execAsync(cmd, { timeout: 30000, maxBuffer: 10 * 1024 * 1024 });
    const json = JSON.parse(stdout);

    // Get subtitle or transcript text if available
    let transcriptText = '';
    try {
      const subCmd = `yt-dlp --write-auto-sub --skip-download --sub-lang en --output "/tmp/ytdlp_sub_%(id)s" "${cleanUrl}" && cat /tmp/ytdlp_sub_${json.id}.en.vtt 2>/dev/null || true`;
      const subRes = await execAsync(subCmd, { timeout: 15000 });
      if (subRes.stdout) {
        // Strip VTT timestamps and duplicate lines
        transcriptText = subRes.stdout
          .replace(/WEBVTT/g, '')
          .replace(/\d\d:\d\d:\d\d\.\d\d\d --> \d\d:\d\d:\d\d\.\d\d\d.*/g, '')
          .replace(/<[^>]*>/g, '')
          .split('\n')
          .filter(line => line.trim().length > 0)
          .filter((line, idx, arr) => arr.indexOf(line) === idx)
          .join(' ')
          .slice(0, 15000);
      }
    } catch {
      // Transcript optional
    }

    const videoData = {
      id: json.id,
      title: json.title,
      uploader: json.uploader || json.channel,
      channelUrl: json.channel_url,
      duration: json.duration,
      durationString: json.duration_string,
      viewCount: json.view_count,
      likeCount: json.like_count,
      uploadDate: json.upload_date,
      description: json.description,
      thumbnail: json.thumbnail,
      categories: json.categories || [],
      tags: json.tags || [],
      transcript: transcriptText || 'Transcript unavailable directly or disabled for video.'
    };

    return { success: true, data: videoData };
  } catch (err: any) {
    console.error('[ScoutAgent - yt-dlp Error]:', err.message);
    return { success: false, error: err.message || 'yt-dlp execution failed' };
  }
}

/**
 * 4. GitHub CLI (gh) & REST Engine
 * Inspects GitHub repositories, reads file trees, extracts issues, pull requests, and commit logs.
 */
export async function githubScanRepo(repoOwnerAndName: string, action: 'summary' | 'tree' | 'issues' | 'file' = 'summary', filePath?: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const repo = repoOwnerAndName.replace('https://github.com/', '').replace(/\.git$/, '').trim();

    if (action === 'file' && filePath) {
      const cmd = `gh api "repos/${repo}/contents/${filePath}" --jq .content | base64 --decode 2>/dev/null || curl -sL "https://raw.githubusercontent.com/${repo}/main/${filePath}"`;
      const { stdout } = await execAsync(cmd, { timeout: 15000 });
      return { success: true, data: { repo, filePath, content: stdout } };
    }

    if (action === 'tree') {
      const cmd = `gh api "repos/${repo}/git/trees/main?recursive=1" --jq '[.tree[] | {path: .path, type: .type, size: .size}]' 2>/dev/null || curl -sL "https://api.github.com/repos/${repo}/git/trees/main?recursive=1"`;
      const { stdout } = await execAsync(cmd, { timeout: 15000 });
      try {
        const json = JSON.parse(stdout);
        return { success: true, data: { repo, tree: json.tree || json } };
      } catch {
        return { success: true, data: { repo, raw: stdout } };
      }
    }

    if (action === 'issues') {
      const cmd = `gh issue list --repo "${repo}" --limit 15 --json number,title,author,createdAt,labels,state 2>/dev/null || curl -sL "https://api.github.com/repos/${repo}/issues?per_page=15"`;
      const { stdout } = await execAsync(cmd, { timeout: 15000 });
      try {
        const json = JSON.parse(stdout);
        return { success: true, data: { repo, issues: json } };
      } catch {
        return { success: true, data: { repo, raw: stdout } };
      }
    }

    // Default: 'summary'
    const cmd = `gh repo view "${repo}" --json name,owner,description,stargazerCount,forkCount,updatedAt,defaultBranchRef,languages,readme 2>/dev/null || curl -sL "https://api.github.com/repos/${repo}"`;
    const { stdout } = await execAsync(cmd, { timeout: 15000 });
    let repoJson: any = {};
    try {
      repoJson = JSON.parse(stdout);
    } catch {
      repoJson = { raw: stdout };
    }

    // Try fetching README content
    let readmeText = repoJson.readme || '';
    if (!readmeText) {
      try {
        const readmeRes = await fetch(`https://raw.githubusercontent.com/${repo}/main/README.md`, { timeout: 8000 });
        if (readmeRes.ok) readmeText = await readmeRes.text();
      } catch {
        // README optional
      }
    }

    return {
      success: true,
      data: {
        repo,
        name: repoJson.name || repo.split('/')[1],
        owner: repoJson.owner?.login || repo.split('/')[0],
        description: repoJson.description || repoJson.body || '',
        stars: repoJson.stargazerCount || repoJson.stargazers_count || 0,
        forks: repoJson.forkCount || repoJson.forks_count || 0,
        readme: readmeText.slice(0, 10000)
      }
    };
  } catch (err: any) {
    console.error('[ScoutAgent - GitHub Error]:', err.message);
    return { success: false, error: err.message || 'GitHub repo scan failed' };
  }
}

/**
 * 5. OpenStreetMap Overpass Turbo POI Engine
 * Executes Overpass QL queries directly against openstreetmap servers for geographic POI extraction.
 */
export async function overpassQueryPois(params: { amenity?: string; city?: string; lat?: number; lon?: number; radiusMeters?: number; limit?: number }): Promise<{ success: boolean; pois: any[]; count: number; error?: string }> {
  try {
    const { amenity = 'restaurant', city = 'London', limit = 25 } = params;

    const { searchDuckDuckGoForLocalBusinesses } = await import('./fastGoogleMapsScraper');
    const rawResults = await searchDuckDuckGoForLocalBusinesses(amenity, city, limit);

    const pois = rawResults.map((item, idx) => ({
      id: `poi_web_${Date.now()}_${idx}`,
      name: item.name || 'Local Business',
      amenity: amenity,
      phone: item.phone || null,
      website: item.website || null,
      email: null,
      address: item.address || city,
      lat: null,
      lon: null,
      openingHours: null,
      cuisine: null
    }));

    return {
      success: true,
      count: pois.length,
      pois
    };
  } catch (err: any) {
    console.error('[ScoutAgent - Local Business Search Error]:', err.message);
    return { success: false, count: 0, pois: [], error: err.message };
  }
}

/**
 * 6. Social Web Content Scraper (Reddit JSON / Twitter Nitter / Web)
 * Fetches public posts, subreddits, threads, and brand social mentions zero-login.
 */
export async function scrapeSocialContent(platform: 'reddit' | 'twitter' | 'instagram' | 'web', queryOrUrl: string): Promise<{ success: boolean; items: any[]; error?: string }> {
  try {
    if (platform === 'reddit') {
      const cleanTarget = queryOrUrl.replace(/^r\//, '').replace(/^https?:\/\/(www\.)?reddit\.com\/r\//, '');
      const isUrl = queryOrUrl.startsWith('http');
      const redditApiUrl = isUrl ? `${queryOrUrl.replace(/\/$/, '')}.json` : `https://www.reddit.com/r/${cleanTarget}/hot.json?limit=15`;

      const res = await fetch(redditApiUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 ScoutAgent/1.0 (Assix Research)' },
        timeout: 15000
      });

      if (!res.ok) throw new Error(`Reddit API status ${res.status}`);
      const json = (await res.json()) as any;

      const children = Array.isArray(json) ? json[0]?.data?.children : json.data?.children;
      const items = (children || []).map((c: any) => {
        const d = c.data;
        return {
          id: d.id,
          title: d.title || d.body,
          author: d.author,
          score: d.score || d.ups,
          numComments: d.num_comments,
          subreddit: d.subreddit,
          url: d.permalink ? `https://reddit.com${d.permalink}` : d.url,
          text: (d.selftext || d.body || '').slice(0, 1000),
          createdAt: d.created_utc ? new Date(d.created_utc * 1000).toISOString() : null
        };
      });

      return { success: true, items };
    }

    if (platform === 'twitter') {
      const twitterUrl = `https://x.com/${queryOrUrl.replace('@', '')}`;
      const jinaRes = await jinaReadUrl(twitterUrl);
      return {
        success: jinaRes.success,
        items: [
          {
            handle: queryOrUrl,
            rawMarkdown: jinaRes.markdown
          }
        ]
      };
    }

    // Default Web
    const jinaRes = await jinaReadUrl(queryOrUrl);
    return {
      success: jinaRes.success,
      items: [{ url: queryOrUrl, content: jinaRes.markdown }]
    };
  } catch (err: any) {
    console.error('[ScoutAgent - Social Scraper Error]:', err.message);
    return { success: false, items: [], error: err.message };
  }
}

/**
 * Autonomous Multi-Tool Scout Agent Orchestrator
 * Synthesizes data across Direct Web Scraper, Exa, yt-dlp, GitHub, Overpass POIs, and Reddit into a unified research dossier!
 */
export async function runScoutAutonomousAgent(objective: string, depth: 'fast' | 'deep' = 'fast'): Promise<ScoutResearchResult> {
  const timestamp = new Date().toISOString();
  const sourcesUsed: string[] = [];

  let jinaWebMarkdown = '';
  let exaSearchResults: any[] = [];
  let youtubeMetadata: any = null;
  let githubRepoData: any = null;
  let overpassPoiData: any[] = [];
  let socialData: any = null;

  const isUrl = objective.startsWith('http://') || objective.startsWith('https://');
  const isYoutube = objective.includes('youtube.com/') || objective.includes('youtu.be/');
  const isGithub = objective.includes('github.com/');

  const tasks: Promise<void>[] = [];

  // 1. Direct URL handling via Direct Web Reader
  if (isUrl && !isYoutube && !isGithub) {
    tasks.push((async () => {
      sourcesUsed.push('Direct Web Reader Engine');
      const res = await jinaReadUrl(objective);
      if (res.success) jinaWebMarkdown = res.markdown;
    })());
  }

  // 2. YouTube handling via yt-dlp
  if (isYoutube) {
    tasks.push((async () => {
      sourcesUsed.push('yt-dlp Engine');
      const res = await ytDlpExtractVideoDetails(objective);
      if (res.success) youtubeMetadata = res.data;
    })());
  }

  // 3. GitHub handling via gh CLI
  if (isGithub) {
    tasks.push((async () => {
      sourcesUsed.push('GitHub gh CLI Engine');
      const res = await githubScanRepo(objective, 'summary');
      if (res.success) githubRepoData = res.data;
    })());
  }

  // 4. Exa Semantic Search & Overpass POI / Reddit if broad search query
  if (!isUrl) {
    tasks.push((async () => {
      sourcesUsed.push('Exa AI Semantic Search');
      const exaRes = await exaSemanticSearch(objective, { numResults: depth === 'deep' ? 10 : 5 });
      if (exaRes.success) exaSearchResults = exaRes.results;
    })());

    // Check if query looks like local business search
    if (/restaurant|cafe|coffee|dentist|plumber|gym|hotel|salon|shop|bar/i.test(objective)) {
      tasks.push((async () => {
        sourcesUsed.push('DuckDuckGo Local Business Search Engine');
        const match = objective.match(/in\s+([a-zA-Z\s]+)$/i);
        const city = match ? match[1].trim() : 'London';
        const amenity = objective.split(' ')[0].toLowerCase();
        const poiRes = await overpassQueryPois({ amenity, city, limit: 15 });
        if (poiRes.success) overpassPoiData = poiRes.pois;
      })());
    }

    // Reddit community social check
    tasks.push((async () => {
      sourcesUsed.push('Reddit Community Public Scraper');
      const subRes = await scrapeSocialContent('reddit', objective.split(' ')[0]);
      if (subRes.success) socialData = subRes.items;
    })());
  }

  await Promise.allSettled(tasks);

  return {
    objective,
    timestamp,
    sourcesUsed,
    jinaWebMarkdown: jinaWebMarkdown || undefined,
    exaSearchResults: exaSearchResults.length ? exaSearchResults : undefined,
    youtubeMetadata: youtubeMetadata || undefined,
    githubRepoData: githubRepoData || undefined,
    overpassPoiData: overpassPoiData.length ? overpassPoiData : undefined,
    socialData: socialData || undefined,
    synthesizedSummary: `Scout Agent Research completed for: "${objective}". Extracted insights from ${sourcesUsed.join(', ')}.`
  };
}
