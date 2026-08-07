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

/**
 * 1. Jina Reader Engine (r.jina.ai)
 * Converts any live web URL into clean markdown using Jina's LLM-friendly reader service.
 */
export async function jinaReadUrl(url: string, customOptions: { targetSelector?: string; removeImages?: boolean } = {}): Promise<{ success: boolean; markdown: string; title?: string; error?: string }> {
  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const jinaEndpoint = `https://r.jina.ai/${targetUrl}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'X-No-Cache': 'true'
    };

    if (process.env.JINA_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.JINA_API_KEY}`;
    }

    if (customOptions.targetSelector) {
      headers['X-Target-Selector'] = customOptions.targetSelector;
    }

    const response = await fetch(jinaEndpoint, {
      method: 'GET',
      headers,
      timeout: 20000
    });

    if (!response.ok) {
      // Fallback to raw text fetch if JSON fails
      const rawRes = await fetch(jinaEndpoint, { headers: { 'User-Agent': 'Mozilla/5.0 ScoutAgent/1.0' }, timeout: 15000 });
      const rawText = await rawRes.text();
      return {
        success: true,
        markdown: rawText.slice(0, 50000)
      };
    }

    const data = (await response.json()) as any;
    const content = data.data?.content || data.content || JSON.stringify(data);
    const title = data.data?.title || data.title || '';

    return {
      success: true,
      title,
      markdown: content.slice(0, 50000)
    };
  } catch (err: any) {
    console.error('[ScoutAgent - Jina Reader Error]:', err.message);
    return {
      success: false,
      markdown: '',
      error: err.message || 'Failed to read URL via Jina'
    };
  }
}

/**
 * 2. Exa Semantic Search Engine
 * Deep semantic search across web documents and company databases via Exa API.
 */
export async function exaSemanticSearch(query: string, options: { numResults?: number; includeDomains?: string[]; excludeDomains?: string[]; category?: string } = {}): Promise<{ success: boolean; results: any[]; error?: string }> {
  try {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
      // Fallback: If Exa API key is not present, use Jina Search or duckduckgo / google fallback
      const jinaSearchUrl = `https://s.jina.ai/${encodeURIComponent(query)}`;
      const res = await fetch(jinaSearchUrl, { headers: { 'Accept': 'application/json' }, timeout: 15000 });
      if (res.ok) {
        const json = (await res.ok ? res.json() : {}) as any;
        const results = (json.data || []).map((item: any) => ({
          title: item.title,
          url: item.url,
          snippet: item.content || item.description,
          score: item.score || 0.9
        }));
        return { success: true, results };
      }
      return { success: true, results: [] };
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
    const { amenity = 'restaurant', city, lat, lon, radiusMeters = 5000, limit = 25 } = params;

    let locationFilter = '';
    if (lat && lon) {
      locationFilter = `(around:${radiusMeters},${lat},${lon})`;
    } else if (city) {
      locationFilter = `(area.searchArea)`;
    } else {
      locationFilter = `(around:10000,51.5074,-0.1278)`; // Default London
    }

    const areaHeader = city ? `area["name"="${city}"]->.searchArea;` : '';

    const overpassQuery = `
      [out:json][timeout:25];
      ${areaHeader}
      (
        node["amenity"="${amenity}"]${locationFilter};
        way["amenity"="${amenity}"]${locationFilter};
        node["shop"="${amenity}"]${locationFilter};
        way["shop"="${amenity}"]${locationFilter};
      );
      out body ${limit};
      >;
      out skel qt;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(overpassQuery)}`,
      timeout: 25000
    });

    if (!response.ok) {
      throw new Error(`Overpass API error status ${response.status}`);
    }

    const data = (await response.json()) as any;
    const elements = data.elements || [];

    const pois = elements
      .filter((el: any) => el.tags && (el.tags.name || el.tags.brand))
      .slice(0, limit)
      .map((el: any) => {
        const tags = el.tags || {};
        return {
          id: el.id,
          name: tags.name || tags.brand || 'Local Business',
          amenity: tags.amenity || tags.shop || amenity,
          phone: tags.phone || tags['contact:phone'] || tags['phone:mobile'] || null,
          website: tags.website || tags['contact:website'] || tags.url || null,
          email: tags.email || tags['contact:email'] || null,
          address: [
            tags['addr:housenumber'],
            tags['addr:street'],
            tags['addr:postcode'],
            tags['addr:city'] || city
          ].filter(Boolean).join(', ') || null,
          lat: el.lat || el.center?.lat || null,
          lon: el.lon || el.center?.lon || null,
          openingHours: tags.opening_hours || null,
          cuisine: tags.cuisine || null,
          osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`
        };
      });

    return {
      success: true,
      count: pois.length,
      pois
    };
  } catch (err: any) {
    console.error('[ScoutAgent - Overpass POI Error]:', err.message);
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
      // Use Jina Reader or Nitter instance for zero-auth Twitter/X profile / topic extraction
      const nitterUrl = `https://r.jina.ai/https://x.com/${queryOrUrl.replace('@', '')}`;
      const jinaRes = await jinaReadUrl(nitterUrl);
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
 * Synthesizes data across Jina, Exa, yt-dlp, GitHub, Overpass POIs, and Reddit into a unified research dossier!
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

  // 1. Direct URL handling via Jina Reader
  if (isUrl && !isYoutube && !isGithub) {
    tasks.push((async () => {
      sourcesUsed.push('Jina Reader (r.jina.ai)');
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
        sourcesUsed.push('OpenStreetMap Overpass Turbo Engine');
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
