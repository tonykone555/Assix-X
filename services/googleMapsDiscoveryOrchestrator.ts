import { getGoogleMapsLeadsWithContacts } from "./apifyClient";
import { enrichWebsiteViaPlaywriter } from "./websiteEnrichment";
import { saveLeadToFirestore, saveTaskToFirestore, updateTaskInFirestore, logAction } from "./firebase";

export async function runGoogleMapsWithEnrichment(
  userId: string, 
  sessionId: string, 
  searchTerm: string, 
  location: string,
  maxResults: number, 
  onProgress: (u: any) => void, 
  taskId?: string,
  autoEnrich: boolean = false,
  noWebsiteOnly: boolean = false
) {
  const finalTaskId = taskId || 'gmaps-apify-' + Date.now();

  try {
    // 1. Create/save the task document in Firestore so it appears in task lists and lead queries
    await saveTaskToFirestore(finalTaskId, {
      taskId: finalTaskId,
      userId: userId || 'system',
      status: "running",
      niche: searchTerm || "Local Business",
      city: location || "Global",
      targetCount: maxResults || 50,
      source: "apify",
      taskType: "google_maps_scrape",
      title: `Google Maps (${searchTerm || 'Search'} in ${location || 'Region'})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await logAction(finalTaskId, `Started Google Maps (Apify Actor) discovery for "${searchTerm}" in "${location}"${noWebsiteOnly ? ' [FILTER: NO WEBSITE ONLY]' : ''}`, 'info');
    onProgress({ taskId: finalTaskId, step: "discovering", status: "running", data: { message: `Searching "${searchTerm}" in ${location} via Apify actor...` } });

    let leads: any[] = [];
    try {
      leads = await getGoogleMapsLeadsWithContacts(searchTerm, location, maxResults, noWebsiteOnly);
    } catch (apifyErr: any) {
      await logAction(finalTaskId, `Apify extraction notice (${apifyErr.message}). Launching fast Search & DOM Scraper fallback...`, 'warning');
      leads = [];
    }

    // Top-up with DOM & Search Scraper if Apify returns fewer leads than requested maxResults
    const targetCount = maxResults || 20;
    if (leads.length < targetCount) {
      const needed = targetCount - leads.length;
      await logAction(finalTaskId, `Apify yielded ${leads.length} leads. Scraping ${needed} additional leads to hit target count (${targetCount})...`, 'info');
      try {
        const { scrapeGoogleMapsSearchFast } = await import("./fastGoogleMapsScraper");
        const extraLeads = await scrapeGoogleMapsSearchFast(searchTerm, location, needed, { noWebsiteOnly, taskId: finalTaskId });
        const existingNames = new Set(leads.map(l => (l.name || l.businessName || l.company || '').toLowerCase().trim()));
        for (const extra of extraLeads) {
          if (leads.length >= targetCount) break;
          const eName = extra.businessName || extra.company;
          if (!eName) continue;
          const k = eName.toLowerCase().trim();
          if (!existingNames.has(k)) {
            existingNames.add(k);
            leads.push({
              name: eName,
              businessName: eName,
              company: eName,
              phone: extra.phone || '',
              website: extra.website || '',
              address: extra.address || '',
              city: extra.city || location,
              rating: extra.rating || 4.8,
              category: extra.category || searchTerm,
              email: extra.email || null,
              source: 'google_maps_apify'
            });
          }
        }
      } catch (fallbackErr: any) {
        console.warn('[googleMapsDiscoveryOrchestrator] Fallback top-up error:', fallbackErr.message);
      }
    }

    onProgress({ taskId: finalTaskId, step: "found", status: "running", data: { message: `Found ${leads.length} businesses. Saving leads to database...`, count: leads.length } });

    let savedCount = 0;
    const savedNames = new Set<string>();

    for (const lead of leads) {
      const bName = lead.name || lead.businessName || lead.company;
      if (!bName) continue;
      const nKey = bName.toLowerCase().trim();
      if (savedNames.has(nKey)) continue;

      if (noWebsiteOnly && lead.website) {
        await logAction(finalTaskId, `Skipping ${bName} (has website: ${lead.website}) - No-Website leads filter enabled`, 'info');
        continue;
      }

      const leadDoc = {
        ...lead,
        taskId: finalTaskId,
        sourceRun: finalTaskId,
        businessName: bName,
        company: bName,
        name: bName,
        phone: lead.phone || '',
        email: lead.email || null,
        website: lead.website || '',
        address: lead.address || '',
        city: lead.city || location,
        rating: lead.rating || 4.9,
        source: 'google_maps_apify',
        leadType: lead.website ? 'has_website' : 'no_website',
        enriched: Boolean(lead.email),
        pitch: `High conversion outreach strategy for ${bName} in ${location}.`,
        createdAt: new Date().toISOString()
      };

      const saved = await saveLeadToFirestore(leadDoc);
      if (saved) {
        savedCount++;
        savedNames.add(nKey);
        onProgress({
          taskId: finalTaskId,
          step: "lead",
          status: "running",
          data: { message: `Saved lead: ${bName}`, lead: leadDoc },
          lead: leadDoc
        });
      }
    }

    onProgress({ taskId: finalTaskId, step: "saving", status: "running", data: { message: `Saved ${savedCount} leads to database.`, savedCount } });

    if (autoEnrich) {
      let enrichedCount = 0;
      for (const lead of leads) {
        if (lead.website && (!lead.email || !lead.phone)) {
          onProgress({ taskId: finalTaskId, step: "enriching", status: "running", data: { message: `Enriching ${lead.name || lead.businessName} via Playwriter...` } });
          const enrichment = await enrichWebsiteViaPlaywriter(userId, sessionId, lead.website, finalTaskId);
          if (enrichment.email) lead.email = enrichment.email;
          if (enrichment.phone) lead.phone = enrichment.phone;
          if (enrichment.socialLinks) lead.socialLinks = enrichment.socialLinks;
          if (enrichment.email || enrichment.phone) enrichedCount++;
          await new Promise(r => setTimeout(r, 500));
        }
      }
      await updateTaskInFirestore(finalTaskId, {
        status: "completed",
        completedAt: new Date().toISOString(),
        leadsCount: savedCount,
        updatedAt: new Date().toISOString()
      });
      await logAction(finalTaskId, `Completed task: ${savedCount} leads saved, ${enrichedCount} emails enriched`, 'success');
      onProgress({ taskId: finalTaskId, step: "complete", status: "done", data: { message: `Complete: ${savedCount} leads saved, ${enrichedCount} emails enriched`, total: savedCount, enrichedCount } });
    } else {
      await updateTaskInFirestore(finalTaskId, {
        status: "completed",
        completedAt: new Date().toISOString(),
        leadsCount: savedCount,
        updatedAt: new Date().toISOString()
      });
      await logAction(finalTaskId, `Completed task: ${savedCount} leads saved`, 'success');
      onProgress({ taskId: finalTaskId, step: "complete", status: "done", data: { message: `Complete: ${savedCount} leads saved!`, total: savedCount } });
    }
  } catch (err: any) {
    console.error("runGoogleMapsWithEnrichment error:", err);
    await updateTaskInFirestore(finalTaskId, {
      status: "failed",
      error: err.message || "Apify run failed",
      updatedAt: new Date().toISOString()
    }).catch(() => {});
    await logAction(finalTaskId, `Task failed: ${err.message || 'Apify run failed'}`, 'error').catch(() => {});
    onProgress({ taskId: finalTaskId, step: "error", status: "failed", data: { message: err.message || "Apify run failed" } });
  }
}


