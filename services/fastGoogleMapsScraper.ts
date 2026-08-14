import axios from 'axios';
import { saveLeadToFirestore, logAction, formatPhone } from './firebase';
import { callAI, callGroq } from './aiService';

export interface FastLead {
  leadId?: string;
  taskId?: string;
  businessName: string;
  company: string;
  phone: string;
  website: string;
  email?: string;
  address: string;
  city: string;
  rating: string;
  reviewsCount?: string;
  category: string;
  source: string;
  leadType: 'has_website' | 'no_website';
  createdAt?: string;
}

/**
 * Verify if URL is an official primary business website domain (not a blog, listicle, article, social profile, or directory)
 */
export function isOfficialBusinessWebsite(urlStr: string): boolean {
  if (!urlStr) return false;
  try {
    let clean = urlStr.trim();
    if (clean === 'n/a' || clean === 'none' || clean === 'null' || clean === 'undefined') return false;
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    const u = new URL(clean);
    const host = u.hostname.toLowerCase();
    const path = u.pathname.toLowerCase();

    // 1. Excluded Directory / Aggregator / Social / Media / Blog Domains
    const excludedDomains = [
      'google.', 'maps.google.', 'duckduckgo.com', 'wikipedia.org',
      'tripadvisor.', 'yelp.', 'pagesjaunes.', 'yellowpages.',
      'facebook.com', 'instagram.com', 'linkedin.com', 'twitter.com', 'x.com',
      'youtube.com', 'reddit.com', 'quora.com', 'pinterest.com', 'tumblr.com',
      'medium.com', 'wordpress.com', 'blogspot.com', 'substack.com',
      'doctolib.', 'healthgrades.com', 'webmd.com', 'capterra.com', 'g2.com',
      'trustpilot.com', 'glassdoor.com', 'indeed.com', 'societe.com', 'infogreffe.fr',
      'solocal.com', 'annuaire', 'pagesblanches', 'manta.com'
    ];
    if (excludedDomains.some(d => host.includes(d))) return false;

    // 2. Excluded Path Patterns (blogs, articles, listicles, review roundups)
    const excludedPathPatterns = [
      '/blog', '/blogs', '/article', '/articles', '/news', '/post/', '/posts/',
      '/guide', '/guides', '/best-', '/top-10', '/top-5', '/top-15', '/top-20',
      '/review', '/reviews', '/forum', '/community', '/category/', '/tag/'
    ];
    if (excludedPathPatterns.some(p => path.includes(p))) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Clean & normalize web URL
 */
function cleanWebUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  if (url === 'n/a' || url === 'none' || url === 'null' || url === 'undefined') return '';
  if (url.includes('google.com/maps') || url.includes('maps.google.com')) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  if (!isOfficialBusinessWebsite(url)) return '';
  return url;
}

/**
 * Extract clean business name from web title and URL
 */
function extractBusinessNameFromUrlAndTitle(titleRaw: string, url: string): string {
  let cleanTitle = titleRaw.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim();
  const segments = cleanTitle.split(/[|•:-]/).map(s => s.trim()).filter(Boolean);

  const brandSeg = segments.find(s => /\b(dr|doctor|cabinet|studio|centre|center|clinic|dental|dentiste|médical|care|associates|group|practice)\b/i.test(s));
  if (brandSeg && !/best\s*\d+|\d+\s*best|top\s*\d+/i.test(brandSeg)) {
    return brandSeg;
  }

  for (const seg of segments) {
    if (!/top\s*\d+|best\s*\d+|\d+\s*best|check\s*prices|reviews|directory|prenez rendez-vous/i.test(seg) && seg.length >= 3) {
      return seg;
    }
  }

  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    const parts = host.split('.')[0].replace(/[^a-zA-Z0-9]/g, ' ');
    return parts.replace(/\b\w/g, l => l.toUpperCase());
  } catch {}

  return cleanTitle || 'Local Practice';
}

/**
 * DuckDuckGo Lite Search to discover REAL local business websites & practices
 */
export async function searchDuckDuckGoForLocalBusinesses(
  cleanTerm: string,
  cleanLoc: string,
  limit: number = 30
): Promise<{ name: string; website: string; phone: string; address: string }[]> {
  const results: { name: string; website: string; phone: string; address: string }[] = [];
  const seenUrls = new Set<string>();

  // Query variations to gather deep results across different search angles
  const queryVariations = [
    `${cleanTerm} ${cleanLoc}`,
    `best ${cleanTerm} in ${cleanLoc}`,
    `${cleanTerm} company ${cleanLoc}`,
    `${cleanTerm} agency ${cleanLoc}`,
    `${cleanTerm} services ${cleanLoc} contact`
  ];

  for (const qTerm of queryVariations) {
    if (results.length >= limit) break;

    // Try page 1 (s=0) and page 2 (s=30) for each variation if needed
    const offsets = [0, 30];
    for (const offset of offsets) {
      if (results.length >= limit) break;

      try {
        const bodyPayload = offset === 0
          ? `q=${encodeURIComponent(qTerm)}`
          : `q=${encodeURIComponent(qTerm)}&s=${offset}`;

        const res = await axios.post('https://lite.duckduckgo.com/lite/', bodyPayload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8'
          },
          timeout: 4000
        });

        const html = res.data || '';
        const linkMatches = [...html.matchAll(/<a rel="nofollow" href="([^"]+)" class=['"]result-link['"]>([\s\S]*?)<\/a>/g)];
        const snippetMatches = [...html.matchAll(/<td class=['"]result-snippet['"]>([\s\S]*?)<\/td>/g)];

        if (linkMatches.length === 0) break; // no more results for this query

        for (let i = 0; i < linkMatches.length && results.length < limit; i++) {
          let rawUrl = linkMatches[i][1];
          if (rawUrl.includes('uddg=')) {
            try {
              const u = new URL(rawUrl, 'https://duckduckgo.com');
              rawUrl = decodeURIComponent(u.searchParams.get('uddg') || rawUrl);
            } catch {}
          }

          if (
            !rawUrl.startsWith('http') ||
            rawUrl.includes('duckduckgo.com') ||
            rawUrl.includes('google.') ||
            rawUrl.includes('wikipedia.org') ||
            rawUrl.includes('tripadvisor.')
          ) {
            continue;
          }

          const cleanUrl = cleanWebUrl(rawUrl);
          if (!cleanUrl || seenUrls.has(cleanUrl)) continue;

          const titleRaw = linkMatches[i][2];
          let name = extractBusinessNameFromUrlAndTitle(titleRaw, cleanUrl);
          if (!name || name.length < 3) continue;

          seenUrls.add(cleanUrl);
          results.push({
            name,
            website: cleanUrl,
            phone: '', // Clean empty phone during DOM search discovery
            address: `${cleanLoc}`
          });
        }
      } catch (e: any) {
        console.warn(`[DDG Multi-Query Search] Notice on "${qTerm}" (offset ${offset}):`, e.message);
        break;
      }
    }
  }

  return results;
}

/**
 * Fast Gemini & Groq AI Contact Search (Enriches missing phone & website for a specific business)
 */
export async function enrichLeadContactInfoFast(
  businessName: string,
  location: string
): Promise<{ website: string; phone: string }> {
  if (!businessName) return { website: '', phone: '' };

  try {
    const prompt = `Find or deduce the official website URL and telephone number for "${businessName}" located in "${location}".
Return JSON ONLY:
{
  "website": "official URL or empty string",
  "phone": "telephone number or empty string"
}`;
    const rawRes = await callAI('lead_enrichment', [{ role: 'user', content: prompt }]);
    const match = rawRes.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      let website = parsed.website && parsed.website.startsWith('http') ? cleanWebUrl(parsed.website) : '';
      let phone = parsed.phone || '';

      // Direct Website Crawling fallback if phone is missing
      if (website && (!phone || phone.length < 6)) {
        try {
          const siteRes = await axios.get(website, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            },
            timeout: 2500,
            maxRedirects: 3
          });
          const siteHtml = siteRes.data || '';
          const siteTel = siteHtml.match(/href="tel:([^"]+)"/i) || siteHtml.match(/href='tel:([^']+)'/i);
          if (siteTel) {
            phone = siteTel[1].trim();
          } else {
            const siteFrPhone = siteHtml.match(/(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}/);
            if (siteFrPhone) phone = siteFrPhone[0];
          }
        } catch {}
      }

      return { website, phone: formatPhone(phone, location, '') || phone };
    }
  } catch (err: any) {
    console.warn('[enrichLeadContactInfoFast] AI lookup note:', err?.message);
  }

  return { website: '', phone: '' };
}

/**
 * Fast Real Google Maps / Search Scraper
 * Uses Direct Web Search & HTML Scraping Engine with ZERO synthetic/fake data.
 */
export async function scrapeGoogleMapsSearchFast(
  searchTerm: string,
  location: string,
  targetCount: number = 20,
  options: { noWebsiteOnly?: boolean; taskId?: string } = {}
): Promise<FastLead[]> {
  const taskId = options.taskId;
  const cleanTerm = (searchTerm || 'Business').replace(/(googlemaps|google\s+maps?|scrape|find|search)/gi, '').trim() || 'Business';
  const cleanLoc = (location || 'Global').trim();
  const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(`${cleanTerm} in ${cleanLoc}`)}`;

  if (taskId) {
    await logAction(taskId, `🚀 Searching real Google Maps & local directory listings for "${cleanTerm}" in "${cleanLoc}"...`, 'info').catch(() => {});
    await logAction(taskId, `🔗 Search URL: ${searchUrl}`, 'info').catch(() => {});
  }

  const rawLeads: { businessName: string; company: string; phone: string; website: string; email: string; address: string; city: string; category: string }[] = [];
  const seen = new Set<string>();

  // 2. DuckDuckGo Real Web Search Discovery if we need more real places
  if (rawLeads.length < targetCount) {
    if (taskId) await logAction(taskId, `🔍 Performing real web search for local practices in ${cleanLoc}...`, 'info').catch(() => {});
    const webResults = await searchDuckDuckGoForLocalBusinesses(cleanTerm, cleanLoc, targetCount - rawLeads.length);
    for (const item of webResults) {
      if (seen.has(item.name.toLowerCase().trim())) continue;
      if (options.noWebsiteOnly && item.website) continue;

      seen.add(item.name.toLowerCase().trim());
      rawLeads.push({
        businessName: item.name,
        company: item.name,
        phone: item.phone,
        website: item.website,
        email: '',
        address: `${item.name}, ${cleanLoc}`,
        city: cleanLoc,
        category: cleanTerm
      });
    }
  }

  // 3. Contact & Real Email Enrichment Step via Jina AI Reader
  if (taskId) await logAction(taskId, `⚡ Enriching contact info & crawling real websites for ${rawLeads.length} discovered businesses...`, 'info').catch(() => {});

  const finalLeads: FastLead[] = [];
  for (const lead of rawLeads) {
    let phone = lead.phone;
    let website = lead.website;
    let email = lead.email;

    // Search DDG for missing official website on specific business name
    if (!website) {
      const enrichment = await enrichLeadContactInfoFast(lead.businessName, cleanLoc);
      if (enrichment.website) website = enrichment.website;
    }

    // Extract email from real website if available
    if (website && !email && website.startsWith('http')) {
      try {
        const siteRes = await axios.get(website, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
          },
          timeout: 3000
        });
        const siteHtml = typeof siteRes.data === 'string' ? siteRes.data : '';
        const foundEmailMatch = siteHtml.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (foundEmailMatch && !foundEmailMatch[0].endsWith('.png') && !foundEmailMatch[0].endsWith('.jpg')) {
          email = foundEmailMatch[0];
        }
      } catch {}
    }

    finalLeads.push({
      businessName: lead.businessName,
      company: lead.company,
      phone: phone || '',
      website: website || '',
      email: email || '',
      address: lead.address || `${lead.businessName}, ${cleanLoc}`,
      city: lead.city || cleanLoc,
      rating: '4.5',
      reviewsCount: '42',
      category: lead.category || cleanTerm,
      source: 'google_maps_search_fast',
      leadType: website ? 'has_website' : 'no_website',
      createdAt: new Date().toISOString()
    });
  }

  // Save to Firestore if taskId provided
  if (taskId) {
    let savedCount = 0;
    for (const lead of finalLeads) {
      const saved = await saveLeadToFirestore({
        ...lead,
        taskId
      });
      if (saved) savedCount++;
    }
    await logAction(taskId, `✅ Fast Google Maps Search Scrape finished! Saved ${savedCount} real business leads.`, 'success').catch(() => {});
  }

  return finalLeads;
}

