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
  whatsapp?: string;
  address?: string;
  error?: string;
}

export function extractAddressFromMarkdown(markdown: string): string {
  if (!markdown) return '';
  // Match French addresses (e.g. 12 rue de la Paix, 75002 Paris)
  const frAddressMatch = markdown.match(/\b\d{1,4}\s+(?:rue|ave|avenue|bd|boulevard|allée|chemin|route|pl|place|cours|impasse|quai|r)\s+[^,.\n]{3,50}\s+\d{5}\s+[^,.\n]{2,30}/i);
  if (frAddressMatch) return frAddressMatch[0].trim();

  // General fallback for postcode city patterns (e.g., 75001 Paris or Austin, TX 78701)
  const zipCityMatch = markdown.match(/(?:\b\d{1,4}\s+[^,.\n]{3,40}\s+,?\s*)?\b\d{5}\s+[A-Za-z\s-]{2,30}/);
  if (zipCityMatch) return zipCityMatch[0].trim();

  const usAddressMatch = markdown.match(/\b\d{1,4}\s+[^,.\n]{3,40}\s+(?:street|st|road|rd|avenue|ave|court|ct|boulevard|blvd|lane|ln|drive|dr|way|circle|cir)\b[^,.\n]*\b[A-Za-z]{2}\s+\d{5}/i);
  if (usAddressMatch) return usAddressMatch[0].trim();

  return '';
}

export function extractWhatsappFromMarkdown(markdown: string): string {
  if (!markdown) return '';
  // Match wa.me link or whatsapp explicitly
  const waMatch = markdown.match(/wa\.me\/([0-9]+)/i) || markdown.match(/api\.whatsapp\.com\/send\?phone=([0-9]+)/i);
  if (waMatch && waMatch[1]) {
    return `https://wa.me/${waMatch[1]}`;
  }
  return '';
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

  // 1. Explicit tel: links and labeled phone fields in markdown or html
  const labelMatches = [...markdown.matchAll(/(?:tel:|phone:|tél:|téléphone:|call:|contact:|mobile:|fixe:|n°|numéro)\s*[:.]?\s*([+\d\s()./-]{8,22})/gi)].map(m => m[1]);
  for (const match of labelMatches) {
    const digits = match.replace(/\D/g, '');
    if (digits.length >= 8 && digits.length <= 15) {
      found.push(match.trim());
    }
  }

  // 2. French numbers (e.g. 01 76 21 65 93, 01.76.21.65.93, 01-76-21-65-93, 01/76/21/65/93, or +33 1 76 21 65 93)
  const frMatches = [...markdown.matchAll(/(?:(?:\+33|0033)\s?|0)[1-9](?:[\s./-]?\d{2}){4}/g)].map(m => m[0]);
  found.push(...frMatches);

  // 3. UK numbers (e.g. +44 20 7946 0958 or 020 7946 0958)
  const ukMatches = [...markdown.matchAll(/(?:(?:\+44|0044)\s?|0)[1-9]\d{1,4}[\s./-]?\d{3,4}[\s./-]?\d{3,4}/g)].map(m => m[0]);
  found.push(...ukMatches);

  // 4. European numbers (e.g., Spain +34, Belgium +32, Switzerland +41, Italy +39, Germany +49)
  const euMatches = [...markdown.matchAll(/(?:(?:\+(?:34|32|41|39|49|31|351|43))|00(?:34|32|41|39|49|31|351|43))\s?[1-9](?:[\s./-]?\d{2,4}){3,4}/g)].map(m => m[0]);
  found.push(...euMatches);

  // 5. US / Canada numbers (e.g. +1 305-555-0123 or (305) 555-0123)
  const usMatches = [...markdown.matchAll(/(?:\+?1[\s./-]?)?\(?\d{3}\)?[\s./-]?\d{3}[\s./-]?\d{4}/g)].map(m => m[0]);
  found.push(...usMatches);

  // 6. General international format (+33123456789, +49301234567, etc.)
  const intlMatches = [...markdown.matchAll(/\+(?:[0-9][\s./-]?){8,15}\d/g)].map(m => m[0]);
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
 * Scrape any web URL directly into clean markdown & extracted contact details
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

  // 1. Try Jina Reader API proxy by default
  try {
    const jinaProxyUrl = `https://r.jina.ai/${cleanUrl}`;
    const headers: Record<string, string> = {
      'Accept': 'text/plain',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    const token = options.apiKey || process.env.JINA_API_KEY;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const jinaRes = await axios.get(jinaProxyUrl, {
      headers,
      timeout: options.timeoutMs || 15000
    });

    const markdown = typeof jinaRes.data === 'string' ? jinaRes.data : JSON.stringify(jinaRes.data);
    
    // Extract title from markdown
    let title = cleanUrl;
    const titleMatch = markdown.match(/Title:\s*(.*)/i) || markdown.match(/^#\s*(.*)/m);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }

    const uniqueEmails = extractEmailsFromMarkdown(markdown);
    const uniquePhones = extractPhonesFromMarkdown(markdown, cleanUrl);

    const socialLinks: Record<string, string> = {};
    const linkMatches = [...markdown.matchAll(/https?:\/\/(?:www\.)?(linkedin|twitter|x|facebook|instagram|youtube|tiktok)\.com\/[A-Za-z0-9_.-]+/gi)];
    for (const match of linkMatches) {
      const platform = match[1].toLowerCase();
      if (!socialLinks[platform]) socialLinks[platform] = match[0];
    }

    const address = extractAddressFromMarkdown(markdown);
    const whatsapp = extractWhatsappFromMarkdown(markdown);

    return {
      success: true,
      url: cleanUrl,
      title,
      description: markdown.slice(0, 500),
      markdown: markdown,
      emails: uniqueEmails,
      phones: uniquePhones,
      socialLinks,
      address,
      whatsapp
    };
  } catch (jinaErr: any) {
    console.warn(`[scrapeUrlWithJina] Jina Reader API failed for ${cleanUrl}, running direct fallback:`, jinaErr.message);
    
    // 2. Direct Fallback HTTP fetch
    try {
      const directRes = await axios.get(cleanUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: options.timeoutMs || 10000
      });
      const html = typeof directRes.data === 'string' ? directRes.data : JSON.stringify(directRes.data);
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

      const address = extractAddressFromMarkdown(html + '\n' + cleanText);
      const whatsapp = extractWhatsappFromMarkdown(html + '\n' + cleanText);

      return {
        success: true,
        url: cleanUrl,
        title,
        description: cleanText.slice(0, 300),
        markdown: cleanText.slice(0, 20000),
        emails: uniqueEmails,
        phones: uniquePhones,
        socialLinks,
        address,
        whatsapp
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
        error: directErr?.message || 'Failed to scrape target URL'
      };
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
    console.log('[Direct DDG Search] Querying DuckDuckGo Lite for:', cleanQuery);
    const res = await axios.post('https://lite.duckduckgo.com/lite/', 'q=' + encodeURIComponent(cleanQuery), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,es;q=0.7'
      },
      timeout: 9000
    });
    const html = res.data || '';
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
    return results;
  } catch (err: any) {
    console.warn('[Direct Web Search] Search error detail:', err?.response?.status || err?.message || err);
    return [];
  }
}

/**
 * Fast Direct Web Search
 */
export async function searchWithJina(
  query: string,
  options: { apiKey?: string; timeoutMs?: number } = {}
): Promise<JinaSearchResult[]> {
  if (!query || !query.trim()) return [];
  // Directly execute search engine query without third-party Jina endpoint
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
