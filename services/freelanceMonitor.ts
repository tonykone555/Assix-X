import { callAI } from './aiService';
import { db } from '../firebase-client-wrapper';

async function fetchRedditJobs(
  subredditUrl: string,
  keywords: string[]
): Promise<any[]> {
  const res = await fetch(subredditUrl, {
    headers: { 'User-Agent': 'AssixAgent/1.0' }
  });
  const data = await res.json();
  const posts = data?.data?.children || [];
  return posts
    .map((p: any) => p.data)
    .filter((p: any) => {
      const text = (p.title + ' ' + p.selftext)
        .toLowerCase();
      return keywords.some(k => 
        text.includes(k.toLowerCase())
      );
    })
    .map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.selftext?.substring(0, 400),
      platform: 'reddit',
      subreddit: p.subreddit,
      url: `https://reddit.com${p.permalink}`,
      author: p.author,
      postedAt: new Date(p.created_utc * 1000)
        .toISOString()
    }));
}

async function searchRedditByKeyword(keyword: string): Promise<any[]> {
  const targetUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&limit=25&t=day`;
  const res = await fetch(targetUrl, {
    headers: { 'User-Agent': 'AssixAgent/1.0' }
  });
  const data = await res.json();
  const posts = data?.data?.children || [];
  return posts
    .map((p: any) => p.data)
    .map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.selftext?.substring(0, 400),
      platform: 'reddit',
      subreddit: p.subreddit,
      url: `https://reddit.com${p.permalink}`,
      author: p.author,
      postedAt: new Date(p.created_utc * 1000).toISOString()
    }));
}

async function fetchHNJobs(): Promise<any[]> {
  const res = await fetch(
    'https://hn.algolia.com/api/v1/search?' +
    'tags=job&hitsPerPage=20'
  );
  const data = await res.json();
  return (data.hits || []).map((h: any) => ({
    id: h.objectID,
    title: h.title,
    description: h.story_text || h.title,
    platform: 'hackernews',
    url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
    postedAt: h.created_at
  }));
}

async function scoreJob(
  job: any,
  userSkills: string[]
): Promise<any> {
  const response = await callAI('job_scorer', [{
    role: 'system',
    content: `Score this freelance job 0-100 for 
    someone with these skills: ${userSkills.join(', ')}
    
    Return ONLY valid JSON:
    {
      "score": 0-100,
      "category": "research|scraping|content|outreach|automation|other",
      "estimatedBudget": "$X-Y or unknown",
      "canAutomate": true/false,
      "proposal": "personalized proposal (100 words)",
      "reply": "natural Reddit/Twitter reply (60 words)"
    }`
  }, {
    role: 'user',
    content: `Job: ${job.title}\n${job.description}`
  }]);
  
  try {
    const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
  catch { return { score: 0 }; }
}

export async function runFreelanceMonitor(
  userId: string,
  onJobFound: (job: any) => void
): Promise<void> {
  
  const keywords = [
    'looking for', 'need help', 'hiring',
    'automation', 'scraping', 'lead generation',
    'research', 'content writing', 'outreach',
    'need someone', 'ISO', 'seeking'
  ];

  const searchKeywords = [
    // English keywords covering scraping, outreach, lead gen, marketing, automation, tech hiring
    'need web scraper',
    'hire web scraper',
    'web scraping help',
    'lead generation help',
    'need automation',
    'hire automation developer',
    'zapier integration help',
    'make.com automation',
    'cold outreach campaign',
    'LinkedIn outreach setup',
    'outreach specialist',
    'prospecting script',
    'hiring browser automation',
    'scraping expert',
    'zapier developer',
    'make expert automation',
    // French keywords
    'automatisations marketing',
    'génération de leads',
    'web scraping français',
    'recrutement scraping',
    'recherche freelance automation',
    'expert zapier'
  ];

  const userSkills = [
    'web scraping', 'lead generation',
    'data research', 'content writing',
    'LinkedIn outreach', 'browser automation',
    'competitor analysis'
  ];

  const platforms = [
    {
      url: 'https://reddit.com/r/forhire/new.json?limit=25',
      name: 'reddit_forhire'
    },
    {
      url: 'https://reddit.com/r/slavelabour/new.json?limit=25',
      name: 'reddit_slavelabour'
    },
    {
      url: 'https://reddit.com/r/entrepreneur/new.json?limit=25',
      name: 'reddit_entrepreneur'
    },
    {
      url: 'https://reddit.com/r/smallbusiness/new.json?limit=25',
      name: 'reddit_smallbusiness'
    }
  ];

  const monitorJobs: any[] = [];

  // 1. Monitor subreddits as-is
  for (const platform of platforms) {
    try {
      const jobs = await fetchRedditJobs(
        platform.url, keywords
      );
      monitorJobs.push(...jobs.map(j => ({
        ...j,
        platform: platform.name,
        source: platform.name,
        matchType: 'subreddit_monitor' as const
      })));
    } catch (err) {
      console.error(`Failed to fetch jobs for ${platform.name}:`, err);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  // 2. Fetch Hacker News jobs as-is
  try {
    const hnJobs = await fetchHNJobs();
    monitorJobs.push(...hnJobs.map(j => ({
      ...j,
      source: 'hackernews',
      matchType: 'subreddit_monitor' as const
    })));
  } catch (err) {
    console.error(`Failed to fetch HN jobs:`, err);
  }

  // 3. New site-wide keyword search with at least 1.5s delay
  const keywordJobs: any[] = [];
  for (const kw of searchKeywords) {
    try {
      const jobs = await searchRedditByKeyword(kw);
      keywordJobs.push(...jobs.map(j => ({
        ...j,
        source: `reddit_search_${kw.toLowerCase().replace(/\s+/g, '_')}`,
        matchType: 'keyword_search' as const
      })));
    } catch (err) {
      console.error(`Failed keyword search for "${kw}":`, err);
    }
    await new Promise(r => setTimeout(r, 1600));
  }

  // 4. Combine and deduplicate by id
  const seenIds = new Set<string>();
  const allJobs: any[] = [];

  for (const job of monitorJobs) {
    if (!seenIds.has(job.id)) {
      seenIds.add(job.id);
      allJobs.push(job);
    }
  }

  for (const job of keywordJobs) {
    if (!seenIds.has(job.id)) {
      seenIds.add(job.id);
      allJobs.push(job);
    }
  }

  // 5. Score and save to Firestore under the exact existing path
  for (const job of allJobs) {
    try {
      const existing = await db
        .collection('freelance_jobs')
        .doc(userId).collection('jobs').doc(job.id)
        .get();
      if (existing.exists) continue;

      const scored = await scoreJob(job, userSkills);
      if (scored.score < 55 || !scored.canAutomate) continue;

      const fullJob = { ...job, ...scored,
        status: 'queued',
        createdAt: new Date().toISOString()
      };

      await db.collection('freelance_jobs')
        .doc(userId).collection('jobs')
        .doc(job.id).set(fullJob);

      onJobFound(fullJob);
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`Failed to process job ${job.id}:`, err);
    }
  }
}
