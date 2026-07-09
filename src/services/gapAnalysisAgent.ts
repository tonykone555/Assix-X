export interface NicheConfig {
  niche: string;
  gapName: string;
  description: string;
  messageTemplate: string;
  painSignalKeywords?: string;
}

export async function runGapAnalysis(postContent: string, config: NicheConfig): Promise<{ score: number; painSignal: string }> {
  try {
    const res = await fetch(`/api/outreach/gap-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postContent,
        niche: config.niche,
        gapName: config.gapName,
        description: config.description
      })
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("runGapAnalysis failed, using fallback:", err);
    // Dynamic local fallback scoring if API fails
    const contentLower = postContent.toLowerCase();
    const keywords = (config.painSignalKeywords || "").toLowerCase().split(" ");
    let matchCount = 0;
    keywords.forEach(kw => {
      if (kw && contentLower.includes(kw)) {
        matchCount++;
      }
    });
    const score = matchCount > 0 ? Math.min(60 + matchCount * 10, 95) : 45;
    return {
      score,
      painSignal: matchCount > 0 ? `Matched keywords: ${keywords.filter(k => contentLower.includes(k)).join(', ')}` : "No specific keywords found, but potential interest."
    };
  }
}

export async function generatePitch(params: {
  name: string;
  company: string;
  postContent: string;
  messageTemplate: string;
  painSignal: string;
}): Promise<string> {
  try {
    const res = await fetch(`/api/outreach/generate-pitch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.pitch;
  } catch (err) {
    console.error("generatePitch failed, using fallback template parsing:", err);
    // Simple robust fallback client-side string replacement
    let pitch = params.messageTemplate
      .replace(/\{\{name\}\}/gi, params.name)
      .replace(/\{\{company\}\}/gi, params.company);
    if (params.painSignal) {
      pitch += ` I saw your post mentioning "${params.painSignal.substring(0, 60)}..." and wanted to offer direct help.`;
    }
    return pitch;
  }
}
