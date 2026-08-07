import { 
  spawnBrowser, 
  navigate, 
  getPageContent, 
  takeScreenshot, 
  closeBrowser, 
  setCookies,
  clickElement,
  typeText
} from './stealthBrowser';
import { callAI } from './aiService';
import { db } from '../firebase-client-wrapper';

export function getGeminiEnv() {
  return {
    AI_GATEWAY_API_KEY: process.env.VERCEL_AI_GATEWAY_KEY || '',
    AI_GATEWAY_MODEL: process.env.AI_GATEWAY_MODEL || 'google/gemini-2.5-flash',
    AI_GATEWAY_URL: process.env.AI_GATEWAY_URL || 'https://ai-gateway.vercel.sh'
  };
}

export function getLiCookies() {
  return [{
    name: 'li_at',
    value: process.env.LINKEDIN_LI_AT || '',
    domain: '.linkedin.com'
  }];
}

export async function generateNicheConfig(
  goal: string,
  targetDescription: string,
  productOffer: string,
  language: 'fr' | 'en' = 'fr'
): Promise<any> {
  
  const response = await callAI('niche_generator', [{
    role: 'system',
    content: `You generate LinkedIn outreach niche 
    configurations for any business type.
    
    Return ONLY valid JSON:
    {
      "niche_id": "snake_case_id",
      "label": "Human readable label",
      "search_query": "site:linkedin.com/in [specific query]",
      "pain_signals": ["signal1", "signal2", "signal3",
                       "signal4", "signal5"],
      "missing_tool_keywords": ["tool1", "tool2", "tool3"],
      "positive_signals": ["signal1", "signal2"],
      "competitor_mentions": ["comp1", "comp2"],
      "budget_indicators": {
        "team_size_min": 1,
        "team_size_max": 50,
        "agency_keywords": ["keyword1", "keyword2"]
      },
      "product_offer": {
        "name": "product name",
        "pitch_core": "one sentence value prop",
        "pricing_tiers": [
          {"tier": 1, "price": "X€", "unit": "/mo",
           "desc": "what they get"}
        ]
      },
      "scoring_weights": {
        "pain_signal_match": 35,
        "missing_tool": 25,
        "recent_activity": 20,
        "budget_fit": 15,
        "competitor_already_used": -30
      },
      "score_threshold": 60,
      "language": "\${language}"
    }`
  }, {
    role: 'user',
    content: `Goal: \${goal}
Target: \${targetDescription}
Product: \${productOffer}
Language: \${language}

Generate the niche config.`
  }]);

  const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

async function findProfiles(
  nicheConfig: any,
  count: number = 20
): Promise<any[]> {
  const res = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.EXA_API_KEY || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: nicheConfig.search_query,
      numResults: count,
      contents: { text: true }
    })
  });
  const data = await res.json();
  return (data.results || []).map((r: any) => ({
    name: r.title,
    profileUrl: r.url,
    profileId: r.url.split('/in/')?.[1]
      ?.split('/')?.[0] || '',
    headline: r.text?.substring(0, 200) || '',
    linkedin: {
      headline: r.title,
      about: r.text?.substring(0, 500) || '',
      recent_posts: []
    }
  })).filter((p: any) => 
    p.profileUrl.includes('linkedin.com/in/')
  );
}

async function sendConnection(
  profileUrl: string,
  message: string,
  onProgress: (msg: string) => void
): Promise<boolean> {
  try {
    const browserId = await spawnBrowser();
    try {
      await setCookies(browserId, getLiCookies());
      await navigate(browserId, profileUrl);
      await new Promise(r => setTimeout(r, 3000));
      
      onProgress(`Opened profile: \${profileUrl}`);

      await clickElement(browserId, 
        '[aria-label="Connect"]');
      await new Promise(r => setTimeout(r, 1500));
      
      await clickElement(browserId,
        '[aria-label="Add a note"]');
      await new Promise(r => setTimeout(r, 1000));
      
      await typeText(browserId, message);
      await new Promise(r => setTimeout(r, 500));
      
      await clickElement(browserId,
        '[aria-label="Send now"]');
      await new Promise(r => setTimeout(r, 2000));

      onProgress(`Connection sent!`);
      return true;
    } finally {
      await closeBrowser(browserId);
    }
  } catch (err: any) {
    onProgress(`Failed: \${err.message}`);
    return false;
  }
}

async function checkInbox(): Promise<any[]> {
  const browserId = await spawnBrowser();
  try {
    await setCookies(browserId, getLiCookies());
    await navigate(browserId, 
      'https://www.linkedin.com/messaging/');
    await new Promise(r => setTimeout(r, 4000));
    
    const content = await getPageContent(browserId);
    
    const extracted = await callAI('inbox_extractor', [{
      role: 'system',
      content: `Extract unread LinkedIn messages.
      Return ONLY valid JSON array:
      [{
        "senderName": "name",
        "senderProfileUrl": "url",
        "messageText": "their message",
        "timestamp": "when"
      }]
      Return [] if no unread messages.`
    }, {
      role: 'user',
      content: content.substring(0, 5000)
    }]);
    
    const cleaned = extracted.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned || '[]');
  } catch { return []; }
  finally { await closeBrowser(browserId); }
}

export async function runGapAnalysis(
  nicheConfig: any,
  media: { linkedin: any; instagram: any; website: any }
): Promise<{ score: number; painSignal: string }> {
  const linkedin = media.linkedin || {};
  const content = `\${linkedin.headline || ''}\n\${linkedin.about || ''}\n\${(linkedin.recent_posts || []).join('\n')}`;

  const prompt = `Analyze the following LinkedIn profile content in the context of the niche "\${nicheConfig.label || nicheConfig.niche}" and the gap "\${nicheConfig.gapName || 'N/A'}" ("\${nicheConfig.description || ''}").
Evaluate if there is an active pain signal related to this.
Profile content: "\${content}"

Respond only with a JSON object in the following format:
{
  "score": <number from 0 to 100 representing the likelihood of the gap being a match>,
  "painSignal": "<brief description of pain signal detected, or empty string if none>"
}`;

  try {
    const responseText = await callAI("browser_agent", [
      { role: "system", content: "You are an expert AI assistant that outputs raw JSON data matching the requested schema." },
      { role: "user", content: prompt }
    ]);
    const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("runGapAnalysis in daemon failed, using fallback:", err);
    return {
      score: 75,
      painSignal: `Potential match for \${nicheConfig.label}`
    };
  }
}

export async function generatePitch(
  name: string,
  gap: { score: number; painSignal: string },
  productOffer: any
): Promise<string> {
  const prompt = `Write a highly personalized short outreach message for LinkedIn.
Recipient Name: \${name}
Detected Pain Signal: \${gap.painSignal}
Product Offer Name: \${productOffer?.name || ''}
Product Value Prop: \${productOffer?.pitch_core || ''}

Write a natural, compelling pitch that is under 300 characters. Keep it conversational, human, and direct. Do not sound robotic.`;

  try {
    const pitch = await callAI("chatbot", [
      { role: "user", content: prompt }
    ]);
    return pitch.trim();
  } catch (err) {
    console.error("generatePitch in daemon failed, using fallback:", err);
    return `Hello \&{name}, I noticed your profile and the challenges you face with \${gap.painSignal || 'outreach'}. I'd love to connect!`;
  }
}

export async function classifyReply(messageText: string): Promise<string> {
  const prompt = `Classify this LinkedIn message reply into one of these categories: "interested", "not_interested", "out_of_office", "other".
Reply message: "\${messageText}"
Respond with ONLY the category string, nothing else.`;

  try {
    const category = await callAI("simple_response", [
      { role: "user", content: prompt }
    ]);
    return category.trim().toLowerCase();
  } catch (err) {
    console.error("classifyReply in daemon failed:", err);
    return "other";
  }
}

export async function generateReply(
  senderName: string,
  messageText: string,
  originalPitch: string,
  classification: string,
  nicheLabel: string
): Promise<string> {
  const prompt = `Draft a natural, friendly follow-up or reply on LinkedIn.
Recipient Name: \${senderName}
Their message: "\${messageText}"
Our original pitch: "\${originalPitch}"
Classification: \${classification}
Niche context: \${nicheLabel}

Keep it brief (under 300 characters), professional, and conversational.`;

  try {
    const reply = await callAI("chatbot", [
      { role: "user", content: prompt }
    ]);
    return reply.trim();
  } catch (err) {
    console.error("generateReply in daemon failed:", err);
    return `Hi \${senderName}, thanks for the response! Let me know if you'd like to chat further.`;
  }
}

export async function generateFollowUp(
  name: string,
  originalMessage: string,
  days: number,
  nicheLabel: string
): Promise<string> {
  const prompt = `Write a gentle, non-pushy follow-up message on LinkedIn sent \${days} days after our first message.
Recipient Name: \${name}
Our original message: "\${originalMessage}"
Niche context: \${nicheLabel}

Keep it extremely short (under 200 characters), friendly, and direct.`;

  try {
    const reply = await callAI("chatbot", [
      { role: "user", content: prompt }
    ]);
    return reply.trim();
  } catch (err) {
    console.error("generateFollowUp in daemon failed:", err);
    return `Hi \${name}, just wanted to quickly bump this to see if you had a moment to check my previous message? Thanks!`;
  }
}

export async function runLinkedInDaemon(
  userId: string,
  nicheConfig: any,
  onProgress: (update: any) => void
): Promise<void> {

  const DAILY_LIMIT = 15;
  let sent = 0;

  onProgress({ step: 'finding', status: 'running',
    message: `Finding \${nicheConfig.label}...` });

  const profiles = await findProfiles(nicheConfig, 30);
  
  onProgress({ step: 'found', status: 'running',
    message: `Found \${profiles.length} profiles. Scoring...` });

  for (const profile of profiles) {
    if (sent >= DAILY_LIMIT) break;

    // Skip already contacted
    const existing = await db
      .collection('outreach_sequences')
      .doc(userId).collection('profiles')
      .where('profileUrl', '==', profile.profileUrl)
      .get();
    if (!existing.empty) continue;

    // Score with Gap Analysis
    const gap = await runGapAnalysis(nicheConfig, {
      linkedin: profile.linkedin,
      instagram: {},
      website: {}
    });

    if (gap.score < nicheConfig.score_threshold) {
      onProgress({ step: 'scoring', status: 'running',
        message: `\${profile.name}: \${gap.score}/100 — skipped` });
      continue;
    }

    onProgress({ step: 'scoring', status: 'running',
      message: `\${profile.name}: \${gap.score}/100 ✓` });

    // Generate personalized pitch
    const message = await generatePitch(
      profile.name, gap, nicheConfig.product_offer
    );

    onProgress({ step: 'connecting', status: 'running',
      message: `Sending to \${profile.name}...` });

    // Send connection
    const success = await sendConnection(
      profile.profileUrl, message,
      (msg) => onProgress({ step: 'connecting',
        status: 'running', message: msg })
    );

    if (success) {
      await db.collection('outreach_sequences')
        .doc(userId).collection('profiles').add({
          ...profile,
          message,
          gapScore: gap.score,
          gapAnalysis: gap,
          nicheId: nicheConfig.niche_id,
          status: 'pending',
          connectionSentAt: new Date().toISOString()
        });
      sent++;

      onProgress({ step: 'waiting', status: 'running',
        message: `Waiting 30s... (\${sent}/\${DAILY_LIMIT})` });
      await new Promise(r => setTimeout(r, 30000));
    }
  }

  // Check inbox
  onProgress({ step: 'inbox', status: 'running',
    message: 'Checking inbox for replies...' });

  const replies = await checkInbox();
  
  for (const reply of replies) {
    const classification = await classifyReply(
      reply.messageText
    );
    
    const profileDoc = await db
      .collection('outreach_sequences')
      .doc(userId).collection('profiles')
      .where('profileUrl', '==', reply.senderProfileUrl)
      .get();

    const originalPitch = 
      profileDoc.docs[0]?.data()?.message || '';

    const generatedReply = await generateReply(
      reply.senderName, reply.messageText,
      originalPitch, classification,
      nicheConfig.label
    );

    await db.collection('outreach_inbox')
      .doc(userId).collection('messages').add({
        ...reply,
        classification,
        generatedReply,
        originalPitch,
        nicheId: nicheConfig.niche_id,
        status: 'pending_approval',
        createdAt: new Date().toISOString()
      });
  }

  // Check follow-ups
  const sequences = await db
    .collection('outreach_sequences')
    .doc(userId).collection('profiles')
    .where('status', '==', 'connected').get();

  const now = new Date();
  for (const doc of sequences.docs) {
    const p = doc.data();
    const days = Math.floor(
      (now.getTime() - 
       new Date(p.connectionSentAt).getTime()) 
      / 86400000
    );

    if (days >= 3 && !p.followUp1SentAt) {
      const fu = await generateFollowUp(
        p.name, p.message, 3, nicheConfig.label
      );
      await db.collection('outreach_inbox')
        .doc(userId).collection('messages').add({
          senderName: p.name,
          profileUrl: p.profileUrl,
          type: 'followup_day3',
          generatedReply: fu,
          status: 'pending_approval',
          createdAt: now.toISOString()
        });
    }

    if (days >= 7 && p.followUp1SentAt && 
        !p.followUp2SentAt) {
      const fu = await generateFollowUp(
        p.name, p.message, 7, nicheConfig.label
      );
      await db.collection('outreach_inbox')
        .doc(userId).collection('messages').add({
          senderName: p.name,
          profileUrl: p.profileUrl,
          type: 'followup_day7',
          generatedReply: fu,
          status: 'pending_approval',
          createdAt: now.toISOString()
        });
    }
  }

  onProgress({
    step: 'complete', status: 'done',
    message: `Done: \${sent} sent, \${replies.length} replies`
  });
}
