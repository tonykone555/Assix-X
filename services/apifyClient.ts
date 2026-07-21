const APIFY_TOKEN = process.env.APIFY_API_TOKEN || "";

async function runApifyActor(actorId: string, input: Record<string, any>): Promise<any[]> {
  if (!APIFY_TOKEN) {
    throw new Error("APIFY_API_TOKEN is not configured in environment or Settings.");
  }

  const runResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  
  if (!runResponse.ok) {
    const errText = await runResponse.text();
    throw new Error(`Failed to start Apify actor ${actorId}: ${errText}`);
  }

  const runData = await runResponse.json();
  const runId = runData.data?.id;
  if (!runId) {
    throw new Error(`Failed to retrieve run ID from Apify response: ${JSON.stringify(runData)}`);
  }

  let status = "RUNNING";
  let datasetId = null;
  // Poll up to 60 times, 3s each (approx 3 mins timeout)
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
    if (!statusRes.ok) continue;
    const statusData = await statusRes.json();
    status = statusData.data?.status || "RUNNING";
    datasetId = statusData.data?.defaultDatasetId;
    if (status === "SUCCEEDED") break;
    if (status === "FAILED" || status === "ABORTED" || status === "TIMED-OUT") {
      throw new Error(`Apify run ended with status: ${status}`);
    }
  }
  if (status !== "SUCCEEDED") throw new Error("Apify run timed out waiting for completion");
  if (!datasetId) throw new Error("No default dataset ID associated with successful run");

  const resultsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`);
  if (!resultsRes.ok) {
    throw new Error(`Failed to fetch dataset items for dataset: ${datasetId}`);
  }
  return resultsRes.json();
}

export async function discoverProfilesByNiche(niche: string, maxProfiles: number): Promise<any[]> {
  // Return the first maxProfiles results from apify profile finder
  return runApifyActor("scrapers-hub~instagram-profile-finder", {
    keywords: [niche],
    max_leads: maxProfiles,
  });
}

export async function getProfilePosts(username: string, maxPosts: number): Promise<any[]> {
  return runApifyActor("apify~instagram-post-scraper", {
    username: [username],
    resultsLimit: maxPosts,
  });
}

export async function getPostComments(postUrl: string, maxComments: number): Promise<any[]> {
  const results = await runApifyActor("apify~instagram-comment-scraper", {
    directUrls: [postUrl],
    resultsLimit: maxComments,
  });
  return results.map((c: any) => ({
    username: c.ownerUsername || c.username,
    text: c.text,
    profileUrl: `https://www.instagram.com/${c.ownerUsername || c.username}/`,
    likeCount: c.likesCount || 0,
  }));
}

// Real-time cost estimate, shown to the user BEFORE they run anything
export function estimateCost(maxProfiles: number, maxPosts: number, maxComments: number) {
  const profileCost = maxProfiles * 0.003;       // profile finder, approx
  const postCost = maxProfiles * maxPosts * 0.0015; // post scraper, approx
  const commentCost = maxProfiles * maxPosts * maxComments * 0.0023; // confirmed real rate
  return {
    profileCost, postCost, commentCost,
    total: profileCost + postCost + commentCost,
    estimatedComments: maxProfiles * maxPosts * maxComments,
  };
}
