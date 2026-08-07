import axios from 'axios';
import { formatPhone } from './firebase';

export interface JinaScrapeResult {
  success: boolean;
  url: string;
  title: string;
  description: string;
  markdown: string;
  emails: string[];
  phones: string[];
  socialLinks: Record<string, string>;
  error?: string;
}

export interface JinaSearchResult {
  title: string;
  url: string;
  description: string;
  content: string;
}

/**
 * Clean & normalize web URL for Jina Reader
 */
function normalizeUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
}

/**
 * Extract emails from markdown text
 */
export function extractEmailsFromMarkdown(markdown: string): string[] {
  if (!markdown) return [];
  
  // 1. Mailto links
  const mailtoMatches = [...markdown.matchAll(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi)].map(m => m[1]);
  
  // 2. Text regex emails
  const textMatches = [...markdown.matchAll(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g)].map(m => m[0]);
  
  const combined = [...mailtoMatches, ...textMatches];
  
  const junkEndings = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.css', '.js', '.woff', '.ttf'];
  const junkDomains = ['sentry.io', 'example.com', 'domain.com', 'wixpress.com', 'bootstrap.com', 'schema.org', 'gravatar.com', 'github.com', 'npm.js', 'git.io'];

  const filtered = combined.filter(e => {
    if (!e || !e.includes('@')) return false;
    const lower = e.toLowerCase();
    if (junkEndings.some(ext => lower.endsWith(ext))) return false;
    if (junkDomains.some(d => lower.includes(d))) return false;
    return true;
  });

  return Array.from(new Set(filtered));
}

/**
 * Extract phone numbers from markdown text
 */
export function extractPhonesFromMarkdown(markdown: string, contextHint: string = ''): string[] {
  if (!markdown) return [];

  const found: string[] = [];

  // 1. Explicit tel: links in markdown or html
  const telMatches = [...markdown.matchAll(/(?:tel:|phone:)\s*([+\d\s().-]{7,20})/gi)].map(m => m[1]);
  for (const tel of telMatches) {
    const digits = tel.replace(/\D/g, '');
    if (digits.length >= 8 && digits.length <= 15) {
      found.push(tel.trim());
    }
  }

  // 2. French numbers (e.g. 01 76 21 65 93 or +33 1 76 21 65 93)
  const frMatches = [...markdown.matchAll(/(?:(?:\+33|0033)\s?|0)[1-9](?:[\s.-]?\d{2}){4}/g)].map(m => m[0]);
  found.push(...frMatches);

  // 3. UK numbers (e.g. +44 20 7946 0958 or 020 7946 0958)
  const ukMatches = [...markdown.matchAll(/(?:(?:\+44|0044)\s?|0)[1-9]\d{1,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g)].map(m => m[0]);
  found.push(...ukMatches);

  // 4. US / Canada numbers (e.g. +1 305-555-0123 or (305) 555-0123)
  const usMatches = [...markdown.matchAll(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g)].map(m => m[0]);
  found.push(...usMatches);

  // 5. General international format (+33123456789, +49301234567, etc.)
  const intlMatches = [...markdown.matchAll(/\+(?:[0-9][\s.-]?){8,15}\d/g)].map(m => m[0]);
  found.push(...intlMatches);

  // Filter and format found numbers
  const validFormatted: string[] = [];
  for (const p of found) {
    const digits = p.replace(/\D/g, '');
    // Ignore timestamps (e.g., 1785146554)
    if (/^(17|18|16|15|19)\d{8,11}$/.test(digits)) continue;
    // Ignore repeated digits (0000000000)
    if (/^(\d)\1+$/.test(digits)) continue;
    // Length check
    if (digits.length < 8 || digits.length > 15) continue;

    const formatted = formatPhone(p, contextHint, '') || p.trim();
    if (formatted && !validFormatted.includes(formatted)) {
      validFormatted.push(formatted);
    }
  }

  return validFormatted;
}

/**
 * Scrape any web URL directly into clean markdown & extracted contact details using Jina AI Reader
 * Endpoint: https://r.jina.ai/<url>
 */
export async function scrapeUrlWithJina(
  targetUrl: string,
  options: { timeoutMs?: number; apiKey?: string } = {}
): Promise<JinaScrapeResult> {
  const cleanUrl = normalizeUrl(targetUrl);
  if (!cleanUrl) {
    return {
      success: false,
      url: targetUrl,
      title: '',
      description: '',
      markdown: '',
      emails: [],
      phones: [],
      socialLinks: {},
      error: 'Invalid or empty URL'
    };
  }

  const jinaEndpoint = `https://r.jina.ai/${cleanUrl}`;
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-With-Generated-Alt': 'true',
    'X-With-Links-Summary': 'true',
    'X-No-Cache': 'true',
    'User-Agent': 'Mozilla/5.0 (Compatible; JinaReaderClient/1.0)'
  };

  if (options.apiKey || process.env.JINA_API_KEY) {
    headers['Authorization'] = `Bearer ${options.apiKey || process.env.JINA_API_KEY}`;
  }

  try {
    const response = await axios.get(jinaEndpoint, {
      headers,
      timeout: options.timeoutMs || 12000
    });

    const data = response.data?.data || response.data || {};
    const markdown = data.content || data.markdown || (typeof response.data === 'string' ? response.data : '');
    const title = data.title || '';
    const description = data.description || '';

    const uniqueEmails = extractEmailsFromMarkdown(markdown);
    const uniquePhones = extractPhonesFromMarkdown(markdown, cleanUrl);

    // Extract social media links
    const socialLinks: Record<string, string> = {};
    const linkMatches = [...markdown.matchAll(/https?:\/\/(?:www\.)?(linkedin|twitter|x|facebook|instagram|youtube|tiktok)\.com\/[A-Za-z0-9_.-]+/gi)];
    for (const match of linkMatches) {
      const platform = match[1].toLowerCase();
      if (!socialLinks[platform]) {
        socialLinks[platform] = match[0];
      }
    }

    return {
      success: true,
      url: cleanUrl,
      title,
      description,
      markdown: markdown.slice(0, 30000), // Cap at 30k chars
      emails: uniqueEmails,
      phones: uniquePhones,
      socialLinks
    };
  } catch (err: any) {
    const is402 = err?.response?.status === 402 || err?.message?.includes('402');
    if (is402) {
      console.log(`[JinaReader] Jina API returned 402 (Payment Required) for ${cleanUrl} - executing direct HTTP website scrape fallback...`);
    }

    // Fallback 1: simple text request via Jina without JSON headers
    try {
      const fallbackRes = await axios.get(jinaEndpoint, {
        headers: { 'X-No-Cache': 'true' },
        timeout: options.timeoutMs || 8000
      });
      const text = typeof fallbackRes.data === 'string' ? fallbackRes.data : JSON.stringify(fallbackRes.data);

      const uniqueEmails = extractEmailsFromMarkdown(text);
      const uniquePhones = extractPhonesFromMarkdown(text, cleanUrl);

      return {
        success: true,
        url: cleanUrl,
        title: cleanUrl,
        description: '',
        markdown: text.slice(0, 20000),
        emails: uniqueEmails,
        phones: uniquePhones,
        socialLinks: {}
      };
    } catch (fallbackErr: any) {
      // Fallback 2: Direct HTTP fetch of target site HTML (bypasses Jina completely if 402/down)
      try {
        const directRes = await axios.get(cleanUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          timeout: options.timeoutMs || 8000
        });
        const html = typeof directRes.data === 'string' ? directRes.data : '';
        const cleanText = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : cleanUrl;

        const uniqueEmails = extractEmailsFromMarkdown(html + '\n' + cleanText);
        const uniquePhones = extractPhonesFromMarkdown(html + '\n' + cleanText, cleanUrl);

        const socialLinks: Record<string, string> = {};
        const linkMatches = [...html.matchAll(/https?:\/\/(?:www\.)?(linkedin|twitter|x|facebook|instagram|youtube|tiktok)\.com\/[A-Za-z0-9_.-]+/gi)];
        for (const match of linkMatches) {
          const platform = match[1].toLowerCase();
          if (!socialLinks[platform]) socialLinks[platform] = match[0];
        }

        return {
          success: true,
          url: cleanUrl,
          title,
          description: cleanText.slice(0, 300),
          markdown: cleanText.slice(0, 20000),
          emails: uniqueEmails,
          phones: uniquePhones,
          socialLinks
        };
      } catch (directErr: any) {
        return {
          success: false,
          url: cleanUrl,
          title: '',
          description: '',
          markdown: '',
          emails: [],
          phones: [],
          socialLinks: {},
          error: directErr?.message || fallbackErr?.message || err?.message || 'Failed to scrape URL'
        };
      }
    }
  }
}

/**
 * Direct DuckDuckGo Web Search Fallback Engine
 */
export async function searchWebDDG(query: string): Promise<JinaSearchResult[]> {
  if (!query || !query.trim()) return [];
  const cleanQuery = query
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\"\']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  try {
    console.log('[DDG Search] Querying DuckDuckGo Lite for:', cleanQuery);
    const res = await axios.post('https://lite.duckduckgo.com/lite/', 'q=' + encodeURIComponent(cleanQuery), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,es;q=0.7'
      },
      timeout: 9000
    });
    const html = res.data || '';
    console.log('[DDG Search] HTML received length:', html.length, 'Contains result-link:', html.includes('result-link'));
    const results: JinaSearchResult[] = [];
    
    const anchors = [...html.matchAll(/<a[^>]*class=['\"]result-link['\"][^>]*>([\s\S]*?)<\/a>/gi)];
    const snippets = [...html.matchAll(/<td[^>]*class=['\"]result-snippet['\"][^>]*>([\s\S]*?)<\/td>/gi)];
    
    for (let i = 0; i < anchors.length; i++) {
      const fullTag = anchors[i][0];
      const title = anchors[i][1].replace(/<[^>]+>/g, '').trim();
      const hrefMatch = fullTag.match(/href=['\"]([^'\"]+)['\"]/i);
      let url = hrefMatch ? hrefMatch[1] : '';
      if (url.includes('uddg=')) {
        const uMatch = url.match(/uddg=([^&]+)/);
        if (uMatch) url = decodeURIComponent(uMatch[1]);
      }
      const snippet = snippets[i] ? snippets[i][1].replace(/<[^>]+>/g, '').trim() : '';
      if (url.startsWith('http')) {
        results.push({ title, url, description: snippet, content: `${title}\n${snippet}\nURL: ${url}` });
      }
    }
    console.log('[DDG Search] Extracted results count:', results.length);
    return results;
  } catch (err: any) {
    console.warn('[DDG Search] Search fallback error detail:', err?.response?.status || err?.message || err);
    return [];
  }
}

/**
 * Fast Web Search via Jina AI Search Reader with automatic DuckDuckGo fallback
 * Endpoint: https://s.jina.ai/<query>
 */
export async function searchWithJina(
  query: string,
  options: { apiKey?: string; timeoutMs?: number } = {}
): Promise<JinaSearchResult[]> {
  if (!query.trim()) return [];

  const searchEndpoint = `https://s.jina.ai/${encodeURIComponent(query.trim())}`;
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-No-Cache': 'true',
    'User-Agent': 'Mozilla/5.0 (Compatible; JinaSearchClient/1.0)'
  };

  if (options.apiKey || process.env.JINA_API_KEY) {
    headers['Authorization'] = `Bearer ${options.apiKey || process.env.JINA_API_KEY}`;
  }

  try {
    const res = await axios.get(searchEndpoint, { headers, timeout: options.timeoutMs || 8000 });
    const items = res.data?.data || [];
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item: any) => ({
        title: item.title || '',
        url: item.url || '',
        description: item.description || '',
        content: item.content || item.markdown || ''
      }));
    }
  } catch (err: any) {
    const is402 = err?.response?.status === 402 || err?.message?.includes('402');
    if (is402) {
      console.log(`[JinaSearch] Jina API returned 402 Payment Required - falling back seamlessly to web search engine for query: "${query.trim()}"`);
    } else {
      console.log('[JinaSearch] Jina search note:', err?.message || err);
    }
  }

  // Fallback to DuckDuckGo search if Jina fails or returns 0 results
  return await searchWebDDG(query);
}

/**
 * Fast Website Enrichment Engine powered by Jina AI Reader
 */
export async function enrichWebsiteWithJina(websiteUrl: string): Promise<{
  email: string | null;
  phone: string | null;
  socialLinks: Record<string, string>;
  description: string | null;
  title: string | null;
  markdown: string;
}> {
  const scraped = await scrapeUrlWithJina(websiteUrl);

  let email = scraped.emails[0] || null;
  let rawPhone = scraped.phones[0] || null;
  const socialLinks = { ...scraped.socialLinks };

  // If email or phone is missing from homepage, try common subpages via Jina Reader
  if (!email || !rawPhone) {
    const cleanBase = websiteUrl.replace(/\/$/, '');
    const contactSubpaths = ['/contact', '/contact-us', '/about', '/mentions-legales'];
    
    for (const path of contactSubpaths) {
      try {
        const subUrl = `${cleanBase}${path}`;
        const subScraped = await scrapeUrlWithJina(subUrl, { timeoutMs: 8000 });
        if (subScraped.success) {
          if (!email && subScraped.emails.length > 0) email = subScraped.emails[0];
          if (!rawPhone && subScraped.phones.length > 0) rawPhone = subScraped.phones[0];
          if (Object.keys(subScraped.socialLinks).length > 0) {
            Object.assign(socialLinks, subScraped.socialLinks);
          }
          if (email && rawPhone) break; // Found both!
        }
      } catch (e) {
        // Try next subpath
      }
    }
  }

  const phone = rawPhone ? formatPhone(rawPhone, websiteUrl, '') || rawPhone : null;
  const description = scraped.description || (scraped.markdown ? scraped.markdown.slice(0, 280) : null);

  return {
    email,
    phone,
    socialLinks,
    description,
    title: scraped.title || null,
    markdown: scraped.markdown
  };
}
