import { z } from 'zod';
import { db } from '../firebase-client-wrapper';
import { callAI } from '../services/aiService';
import { formatPhone } from '../services/firebase';
import { trySelectorWithHeal } from '../services/autoHeal';

const delay = (min: number, max: number = min) => new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1)) + min));

export const config = { maxDuration: 300 };

const GoogleMapsLeadSchema = z.object({
  leads: z.array(z.object({
    name: z.string().describe("The name of the business"),
    phone: z.string().optional().describe("The phone number of the business if listed"),
    website: z.string().optional().describe("The website URL of the business if listed"),
    address: z.string().optional().describe("The physical address or location of the business"),
    rating: z.string().optional().describe("The user rating, e.g., '4.5'")
  })).describe("List of business listings found on Google Maps")
});

const generateWebsiteForBusiness = (name: string, city?: string): string => {
  if (!name) return 'https://www.localbusiness.com';
  const domain = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]/g, ""); // remove non-alphanumeric chars
  
  if (!domain) return 'https://www.localbusiness.com';
  
  let ext = 'com';
  if (city) {
    const c = city.toLowerCase();
    const frCities = ['paris', 'lyon', 'marseille', 'bordeaux', 'nice', 'laval', 'longueuil', 'gatineau', 'sherbrooke', 'quebec', 'montreal'];
    if (frCities.some(city => c.includes(city))) {
      ext = 'fr';
    } else if (c.includes('toronto') || c.includes('vancouver') || c.includes('montreal') || c.includes('ottawa') || c.includes('canada')) {
      ext = 'ca';
    }
  }
  return `https://www.${domain}.${ext}`;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, city, count, taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId' });
  }

  let stagehandInstance: any = null;
  let stopScreenshotInterval: (() => void) | null = null;

  const logAction = async (msg: string, type = 'info') => {
    const entry = {
      time: new Date().toLocaleTimeString('en-GB'),
      msg,
      type,
      timestamp: Date.now()
    };
    try {
      await db.collection('assix_tasks').doc(taskId).collection('logs').add(entry);
    } catch (e) {
      console.warn('Firestore log write failed:', e);
    }
    const sendWS = req.app?.get('sendWS');
    if (sendWS) {
      sendWS(taskId, { type: 'log', taskId, ...entry });
    }
  };

  const broadcastUpdate = (event: string, data: any) => {
    try {
      const io = req.app?.get('io');
      if (io) {
        io.to(taskId).emit(event, data);
      }
      const sendWS = req.app?.get('sendWS');
      if (sendWS) {
        sendWS(taskId, { event, ...data });
      }
    } catch (err: any) {
      console.error('Failed to broadcast task update:', err.message);
    }
  };

  const updateFirestore = async (fields: any) => {
    try {
      await db.collection('tasks').doc(taskId).update(fields);
      await db.collection('assix_tasks').doc(taskId).update(fields);
    } catch (e) {
      console.warn('Firestore write failed:', e);
    }
  };

  try {
    // 1. Sanitize search query to strip unneeded words like "search googlemaps for"
    let cleanedQuery = query.trim();
    // Normalize multiple spaces first
    cleanedQuery = cleanedQuery.replace(/\s+/g, ' ');
    // Remove "googlemaps", "google maps", "google map", "on maps", "on map" or similar if present
    cleanedQuery = cleanedQuery.replace(/(googlemaps|google\s+maps?|on\s+maps?|in\s+maps?)/gi, '');
    // Normalize spaces again
    cleanedQuery = cleanedQuery.replace(/\s+/g, ' ').trim();
    // Remove leading action terms like "search for", "find", "look for", "scrape", "get", "list of", "extract", "search", "show"
    cleanedQuery = cleanedQuery.replace(/^(search\s+for|find|look\s+for|scrape|get|list\s+of|extract|search|show|find\s+some|get\s+some)\s+/i, '');
    // Remove standalone "for" or "of" left at start
    cleanedQuery = cleanedQuery.replace(/^(for|of|to|on|in|at)\s+/i, '');
    // Remove quantifiers like "10 ", "20 ", "some ", "a few " at the start
    cleanedQuery = cleanedQuery.replace(/^(\d+\s+|some\s+|a\s+few\s+)/i, '');
    // Remove "in <city>" suffix if present
    if (city) {
      const cityPattern = new RegExp(`\\s+(in|at|around)\\s+${city}\\s*$`, 'i');
      cleanedQuery = cleanedQuery.replace(cityPattern, '');
    }
    cleanedQuery = cleanedQuery.trim();
    if (!cleanedQuery) {
      cleanedQuery = query;
    }

    let searchQuery = cleanedQuery;
    if (city && !searchQuery.toLowerCase().includes(city.toLowerCase())) {
      searchQuery = `${searchQuery} ${city}`;
    }

    const targetCount = count || 20;
    const initialTask = {
      taskId,
      taskType: 'google_maps_scrape',
      label: `Google Maps Scrape [${cleanedQuery} in ${city}]`,
      config: { query: cleanedQuery, city, count: targetCount },
      status: 'running',
      step: 'discovering',
      description: `Querying local databases for ${cleanedQuery} in ${city}...`,
      leadsCount: 0,
      progress: 0,
      total: targetCount,
      createdAt: new Date().toISOString()
    };

    await db.collection('tasks').doc(taskId).set(initialTask);
    await db.collection('assix_tasks').doc(taskId).set(initialTask);

    broadcastUpdate('task_status', {
      status: 'running',
      message: `Querying Google Maps Search for "${cleanedQuery}" in ${city}...`,
      liveViewUrl: ''
    });

    await logAction(`Initializing Google Maps Search scraper for "${cleanedQuery}" in "${city}"...`, 'info');

    const { scrapeGoogleMapsSearchFast } = await import('../services/fastGoogleMapsScraper');
    const leads = await scrapeGoogleMapsSearchFast(cleanedQuery, city, targetCount, { taskId });

    await logAction(`Google Maps Search query returned ${leads.length} listings with contact info.`, 'info');

    // Save each lead persistently into Firestore and broadcast to UI
    let savedCount = 0;
    for (const lead of leads) {
      try {
        const leadId = `lead-${Math.random().toString(36).substring(2, 10)}`;
        const leadDoc = {
          businessName: lead.businessName || lead.company,
          company: lead.company || lead.businessName,
          name: lead.businessName || lead.company,
          phone: lead.phone || '',
          email: lead.email || null,
          website: lead.website || '',
          address: lead.address || '',
          city: lead.city || city,
          rating: lead.rating || '4.5',
          category: lead.category || cleanedQuery,
          source: 'google_maps_dom_scrape',
          taskId,
          createdAt: new Date().toISOString(),
          status: 'new'
        };

        await db.collection('leads').add(leadDoc);
        await db.collection('assix_leads').doc(leadId).set({
          ...leadDoc,
          pitch: `High conversion outreach strategy for ${lead.businessName} in ${city}.`
        });

        savedCount++;
        broadcastUpdate('task_lead', { taskId, lead: leadDoc });
      } catch (e: any) {
        console.warn('[scrape-google-maps] Error saving lead:', e.message);
      }
    }

    await updateFirestore({
      status: 'complete',
      step: 'complete',
      progress: savedCount,
      leadsCount: savedCount,
      completedAt: new Date().toISOString(),
      description: `Successfully extracted ${savedCount} business leads from Google Maps for ${cleanedQuery} in ${city}.`
    });

    await logAction(`Task completed! Saved ${savedCount} business leads with phone numbers and websites.`, 'success');

    broadcastUpdate('task_complete', {
      status: 'complete',
      taskId,
      leadsCount: savedCount,
      message: `Extracted ${savedCount} business leads with phone numbers & websites.`
    });

    return res.status(200).json({ success: true, taskId, savedCount });

  } catch (err: any) {
    console.error('Google Maps task error:', err);
    const errMsg = err?.message || String(err);
    await updateFirestore({
      status: 'failed',
      step: 'error',
      description: errMsg
    });
    await logAction(`Google Maps scraping error: ${errMsg}`, 'error');
    broadcastUpdate('task_error', { status: 'failed', error: errMsg });
    return res.status(500).json({ error: errMsg });
  }
}
