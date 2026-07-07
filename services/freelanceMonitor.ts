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
      url: `https://reddit.com\${p.permalink}`,
      author: p.author,
      postedAt: new Date(p.created_utc * 1000)
        .toISOString()
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
    url: h.url || `https://news.ycombinator.com/item?id=\${h.objectID}`,
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
    someone with these skills: \${userSkills.join(', ')}
    
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
    content: `Job: \${job.title}\n\${job.description}`
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

  const allJobs: any[] = [];

  for (const platform of platforms) {
    try {
      const jobs = await fetchRedditJobs(
        platform.url, keywords
      );
      allJobs.push(...jobs.map(j => ({
        ...j, platform: platform.name
      })));
    } catch (err) {
      console.error(`Failed to fetch jobs for \${platform.name}:`, err);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  try {
    const hnJobs = await fetchHNJobs();
    allJobs.push(...hnJobs);
  } catch (err) {
    console.error(`Failed to fetch HN jobs:`, err);
  }

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
      console.error(`Failed to process job \${job.id}:`, err);
    }
  }
}
