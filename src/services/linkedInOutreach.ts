const LINKEDIN_AGENT_URL = "https://linkedin-agent-api-production.up.railway.app";

export async function startLinkedInSession() {
  const res = await fetch(`${LINKEDIN_AGENT_URL}/session/open`, {
    method: "POST"
  });
  return res.json();
}

export async function searchLinkedIn(query: string) {
  const res = await fetch(`${LINKEDIN_AGENT_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  return res.json();
}

export async function searchPosts(query: string) {
  const res = await fetch(`${LINKEDIN_AGENT_URL}/search/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  return res.json();
}

export async function getContactInfo(profileId: string) {
  const res = await fetch(`${LINKEDIN_AGENT_URL}/contact/${profileId}`);
  return res.json();
}

export async function connectProfile(profileId: string, message: string) {
  const res = await fetch(`${LINKEDIN_AGENT_URL}/connect`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId, message })
  });
  return res.json();
}

export async function getOutreachInbox() {
  const res = await fetch(`${LINKEDIN_AGENT_URL}/inbox`);
  return res.json();
}

export async function getLinkedInMe() {
  const res = await fetch(`${LINKEDIN_AGENT_URL}/me`);
  return res.json();
}
