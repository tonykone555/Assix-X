import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { db } from '../firebase-client-wrapper';
import { buildNicheHtmlEmail, resolveNicheType, Language } from './nicheEmailTemplates';

export interface ColdEmailStep {
  stepNumber: number;
  delayDays: number;
  subject: string;
  subjectVariations: string[];
  bodyText: string;
  bodyHtml: string;
  callToAction: string;
  purpose: string;
}

export interface ColdEmailSequence {
  id: string;
  campaignName: string;
  campaignType: string;
  targetCompany: string;
  targetName: string;
  targetEmail: string;
  targetNiche: string;
  steps: ColdEmailStep[];
  deliverabilityAudit: {
    spamScore: number; // 0 - 100 (lower is cleaner)
    spamTriggerWordsFound: string[];
    wordCount: number;
    readingTimeSeconds: number;
    personalizationScore: number; // 0 - 100
    recommendations: string[];
  };
  createdAt: string;
}

export interface EmailSenderConfig {
  provider: 'smtp' | 'resend' | 'sendgrid' | 'webhook';
  fromEmail: string;
  fromName: string;
  // SMTP credentials
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
  // API Keys
  apiKey?: string;
  // Webhook
  webhookUrl?: string;
}

// Common spam trigger words to flag in cold outreach
const SPAM_TRIGGER_WORDS = [
  '100% free', 'free', 'guarantee', 'guaranteed', 'buy now', 'click here',
  'earn $', 'make money', 'no risk', 'act now', 'limited time', 'urgent',
  'winner', 'congratulations', 'cash', 'credit card', 'risk-free',
  'special promotion', 'unsolicited', 'marketing budget', 'cheap', 'billion'
];

/**
 * Analyzes cold email body text for spam signals, length, and personalization depth.
 */
export function analyzeEmailSpamScore(bodyText: string, leadData: any) {
  const lower = bodyText.toLowerCase();
  const words = bodyText.trim().split(/\s+/);
  const wordCount = words.length;
  const readingTimeSeconds = Math.ceil(wordCount / 3.5); // ~200 wpm

  const foundSpamWords: string[] = [];
  for (const word of SPAM_TRIGGER_WORDS) {
    if (lower.includes(word.toLowerCase())) {
      foundSpamWords.push(word);
    }
  }

  // Calculate Spam Score (0 = clean, 100 = high risk)
  let spamScore = 10; // base score
  spamScore += foundSpamWords.length * 15;
  if (wordCount > 150) spamScore += 20; // Cold emails over 150 words get lower response
  if (wordCount < 25) spamScore += 10;
  if ((bodyText.match(/!/g) || []).length > 2) spamScore += 15;
  if ((bodyText.match(/\?/g) || []).length > 3) spamScore += 10;
  if (bodyText.toUpperCase() === bodyText && wordCount > 5) spamScore += 40;

  spamScore = Math.min(Math.max(spamScore, 5), 98);

  // Calculate Personalization Score
  let personalizationScore = 30;
  const targetCompany = (leadData.company || leadData.name || '').toLowerCase();
  const targetNiche = (leadData.niche || leadData.category || '').toLowerCase();
  const targetCity = (leadData.city || leadData.location || '').toLowerCase();

  if (targetCompany && lower.includes(targetCompany)) personalizationScore += 25;
  if (targetNiche && lower.includes(targetNiche)) personalizationScore += 20;
  if (targetCity && lower.includes(targetCity)) personalizationScore += 15;
  if (lower.includes('{{') || lower.includes('loom') || lower.includes('teardown') || lower.includes('noticed')) personalizationScore += 10;

  personalizationScore = Math.min(personalizationScore, 100);

  const recommendations: string[] = [];
  if (foundSpamWords.length > 0) {
    recommendations.push(`Remove promotional trigger words: ${foundSpamWords.join(', ')}`);
  }
  if (wordCount > 120) {
    recommendations.push('Keep body text under 100-120 words for maximum mobile response rates.');
  }
  if (personalizationScore < 60) {
    recommendations.push('Include hyper-specific observations about the lead\'s website or active ad campaign.');
  }
  if (!lower.includes('?')) {
    recommendations.push('End with a single low-friction call-to-action question (e.g. "Open to taking a look?")');
  }

  return {
    spamScore,
    spamTriggerWordsFound: foundSpamWords,
    wordCount,
    readingTimeSeconds,
    personalizationScore,
    recommendations
  };
}

/**
 * AI Powered 3-Step Cold Email Campaign Generator built on cold outreach research & best practices
 */
export async function generateColdEmailSequence(
  lead: any,
  options: {
    campaignType?: string;
    tone?: string;
    senderName?: string;
    senderTitle?: string;
    customValueProp?: string;
    customPromptInstruction?: string;
    language?: string;
  }
): Promise<ColdEmailSequence> {
  const companyName = lead.company || lead.name || 'Your Company';
  const contactName = lead.contactName || lead.pageName || lead.name || 'there';
  const firstName = contactName.split(' ')[0] || contactName;
  const niche = lead.niche || lead.category || lead.searchKeyword || 'business';
  const websiteUrl = lead.website || lead.websiteUrl || lead.adLibraryUrl || '';
  const email = lead.email || lead.pageUsername ? `${lead.pageUsername}@domain.com` : 'lead@example.com';
  const city = lead.city || lead.location || lead.targetCountry || 'your area';

  const gapSignal = lead.gapSignal || lead.uniqueness || lead.pitch || lead.notes || (
    websiteUrl ? 'No mobile speed optimization & missing clear lead capture form' : 'No active website found on Google Maps listing'
  );

  const campaignType = options.campaignType || 'no_website_dev';
  const tone = options.tone || 'conversational_audit';
  const senderName = options.senderName || 'Alex';
  const senderTitle = options.senderTitle || 'Growth & Tech Lead';
  const customValueProp = options.customValueProp || 'We help local businesses convert 2-3x more inbound leads with high-speed modern digital funnels.';
  const customPromptInstruction = options.customPromptInstruction || '';

  let promptContext = `
You are a world-class Cold Email Copywriter and Outbound Sales Strategist who has generated millions in B2B pipeline.
Generate an elite, 3-step Cold Email Sequence engineered for high inbox deliverability and high reply rates.

LEAD PROFILE:
- Prospect First Name: ${firstName}
- Company/Brand Name: ${companyName}
- Industry / Niche: ${niche}
- Location: ${city}
- Website / Link: ${websiteUrl || 'No Website / Missing Online Presence'}
- Detected Revenue/Tech Gap: ${gapSignal}
- Offer Value Prop: ${customValueProp}
- Sender Name & Role: ${senderName} (${senderTitle})
- Campaign Style/Tone: ${tone}
${customPromptInstruction ? `- SPECIAL PROMPT INSTRUCTIONS / MANDATES FROM USER: "${customPromptInstruction}"` : ''}

COLD EMAIL BEST-PRACTICE RULES:
1. Subject Lines: Short (2-4 words max), lowercase or natural capitalization, neutral/curiosity-driven. Provide 2 variations per step.
2. Step 1 (Day 1 - The Pattern Interrupt Hook):
   - Hook: Hyper-personalized observation referencing their specific gap/niche immediately (no "I hope this email finds you well").
   - Value/Problem: Concise explanation of the missed revenue/opportunity.
   - Low-friction CTA: Soft interest check (e.g., "Worth sending a quick 2-min video teardown?", "Open to taking a look?").
   - Length: Under 100 words!
3. Step 2 (Day 3 - The Soft Value Bump):
   - Reference previous message casually.
   - Share a 1-sentence micro case study or specific feature insight.
   - Keep under 60 words.
4. Step 3 (Day 7 - The Low-Friction Breakup):
   - Polite, respectful closing asking if this is a priority right now or if you should stop following up.
   - Keep under 40 words.

OUTPUT REQUIREMENT:
Respond with a strict JSON object following this exact schema:
{
  "campaignName": "${companyName} Outreach Sequence",
  "steps": [
    {
      "stepNumber": 1,
      "delayDays": 0,
      "purpose": "Initial Hyper-Personalized Pattern Interrupt",
      "subject": "quick question re: ${companyName}",
      "subjectVariations": ["quick question re: ${companyName}", "idea for ${firstName}", "quick thoughts on ${companyName}"],
      "bodyText": "Plain text body...",
      "bodyHtml": "Clean minimalist HTML body...",
      "callToAction": "Open to taking a look?"
    },
    {
      "stepNumber": 2,
      "delayDays": 3,
      "purpose": "Soft Case-Study Value Bump",
      "subject": "Re: quick question re: ${companyName}",
      "subjectVariations": ["Re: quick question re: ${companyName}", "thought of this for ${companyName}"],
      "bodyText": "Plain text body...",
      "bodyHtml": "Clean minimalist HTML body...",
      "callToAction": "Worth a quick 2-min look?"
    },
    {
      "stepNumber": 3,
      "delayDays": 7,
      "purpose": "Low-Friction Breakup",
      "subject": "closing the loop / ${companyName}",
      "subjectVariations": ["closing the loop / ${companyName}", "permission to close your file?"],
      "bodyText": "Plain text body...",
      "bodyHtml": "Clean minimalist HTML body...",
      "callToAction": "Should I close this out?"
    }
  ]
}
`;

  let resultJson: any = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptContext,
        config: { responseMimeType: 'application/json' }
      });
      const text = response.text || '';
      resultJson = JSON.parse(text);
    } catch (err: any) {
      console.warn('[EmailSequenceGen] Gemini API call error:', err?.message || err);
    }
  }

  // Build rich niche-specific HTML for Step 1
  const lang: Language = (options.language as Language) || 'fr';
  const nicheEmail = buildNicheHtmlEmail(lead, lang, {
    senderName,
    senderTitle,
    customPainPoint: gapSignal,
    customDemoLink: websiteUrl || undefined
  });

  // Fallback template builder if AI call fails or key is unconfigured
  if (!resultJson || !resultJson.steps || !Array.isArray(resultJson.steps)) {
    resultJson = {
      campaignName: `${companyName} Cold Outreach Campaign`,
      steps: [
        {
          stepNumber: 1,
          delayDays: 0,
          purpose: "Initial Hyper-Personalized Pattern Interrupt & Niche Offer",
          subject: nicheEmail.subject,
          subjectVariations: [nicheEmail.subject, `quick question re: ${companyName}`, `idea for ${firstName}`],
          bodyText: nicheEmail.text,
          bodyHtml: nicheEmail.html,
          callToAction: "Consulter la démo interactive"
        },
        {
          stepNumber: 2,
          delayDays: 3,
          purpose: "Soft Case-Study Value Bump",
          subject: `Re: ${nicheEmail.subject}`,
          subjectVariations: [`Re: ${nicheEmail.subject}`, `thought of this for ${companyName}`],
          bodyText: `Hey ${firstName},\n\nFollowing up on my previous note regarding ${companyName}.\n\nQuick thought: fixing ${gapSignal} usually takes less than 24 hours and adds $3k-$8k/mo in extra bookings.\n\nWould you be open to taking a look at a 60-second mockup?\n\nBest,\n${senderName}`,
          bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #222222; max-width: 580px;"><p>Hey ${firstName},</p><p>Following up on my previous note regarding <strong>${companyName}</strong>.</p><p>Quick thought: fixing <em>${gapSignal}</em> usually takes less than 24 hours and adds $3k-$8k/mo in extra bookings.</p><p>Would you be open to taking a look at a 60-second mockup?</p><br/><p>Best,<br/><strong>${senderName}</strong></p></div>`,
          callToAction: "Open to taking a look?"
        },
        {
          stepNumber: 3,
          delayDays: 7,
          purpose: "Low-Friction Breakup",
          subject: `closing the loop / ${companyName}`,
          subjectVariations: [`closing the loop / ${companyName}`, `permission to close file?`],
          bodyText: `Hey ${firstName},\n\nAssuming this isn't a priority for ${companyName} right now—totally understand!\n\nI'll close your file for now. Feel free to ping me whenever you're ready to scale your ${niche} bookings.\n\nBest,\n${senderName}`,
          bodyHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #222222; max-width: 580px;"><p>Hey ${firstName},</p><p>Assuming this isn't a priority for ${companyName} right now—totally understand!</p><p>I'll close your file for now. Feel free to ping me whenever you're ready to scale your ${niche} bookings.</p><br/><p>Best,<br/><strong>${senderName}</strong></p></div>`,
          callToAction: "Should I close this out?"
        }
      ]
    };
  } else if (resultJson.steps && resultJson.steps[0]) {
    // Inject rich niche HTML into step 1 if AI produced plain text or basic HTML
    if (!resultJson.steps[0].bodyHtml || resultJson.steps[0].bodyHtml.length < 200) {
      resultJson.steps[0].bodyHtml = nicheEmail.html;
    }
  }

  // Combine full body text for deliverability audit
  const fullText = resultJson.steps.map((s: any) => s.bodyText).join('\n\n');
  const deliverabilityAudit = analyzeEmailSpamScore(fullText, lead);

  const sequence: ColdEmailSequence = {
    id: `seq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    campaignName: resultJson.campaignName || `${companyName} Sequence`,
    campaignType,
    targetCompany: companyName,
    targetName: contactName,
    targetEmail: email,
    targetNiche: niche,
    steps: resultJson.steps,
    deliverabilityAudit,
    createdAt: new Date().toISOString()
  };

  return sequence;
}

/**
 * Dispatches cold email via SMTP, Resend, SendGrid, or Webhook.
 */
export async function sendColdEmail(
  toEmail: string,
  subject: string,
  bodyHtml: string,
  bodyText: string,
  config: EmailSenderConfig
) {
  if (!toEmail || !toEmail.includes('@')) {
    throw new Error('Invalid recipient email address.');
  }

  const fromAddress = config.fromName ? `"${config.fromName}" <${config.fromEmail}>` : config.fromEmail;

  // 1. SMTP Provider (Nodemailer)
  if (config.provider === 'smtp') {
    if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
      throw new Error('SMTP Configuration incomplete. Please specify Host, Username, and Password in System Settings.');
    }

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort || 587,
      secure: Boolean(config.smtpSecure), // true for 465, false for 587
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject,
      text: bodyText,
      html: bodyHtml,
    });

    return { success: true, messageId: info.messageId, provider: 'smtp' };
  }

  // 2. Resend API
  if (config.provider === 'resend') {
    const apiKey = config.apiKey || process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is required for Resend dispatch.');
    }

    const res = await axios.post(
      'https://api.resend.com/emails',
      {
        from: fromAddress,
        to: [toEmail],
        subject,
        html: bodyHtml,
        text: bodyText
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return { success: true, messageId: res.data?.id, provider: 'resend' };
  }

  // 3. SendGrid API
  if (config.provider === 'sendgrid') {
    const apiKey = config.apiKey || process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is required for SendGrid dispatch.');
    }

    const res = await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        personalizations: [{ to: [{ email: toEmail }] }],
        from: { email: config.fromEmail, name: config.fromName || 'ASSIX Outreach' },
        subject,
        content: [
          { type: 'text/plain', value: bodyText },
          { type: 'text/html', value: bodyHtml }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return { success: true, messageId: `sg_${Date.now()}`, provider: 'sendgrid' };
  }

  // 4. Webhook / Instantly / Smartlead dispatch
  if (config.provider === 'webhook') {
    if (!config.webhookUrl) {
      throw new Error('Webhook URL is required for webhook dispatch.');
    }

    const res = await axios.post(config.webhookUrl, {
      event: 'cold_email_dispatch',
      toEmail,
      fromEmail: config.fromEmail,
      fromName: config.fromName,
      subject,
      bodyText,
      bodyHtml,
      timestamp: new Date().toISOString()
    });

    return { success: true, messageId: `wh_${Date.now()}`, provider: 'webhook' };
  }

  throw new Error(`Unsupported email provider: ${config.provider}`);
}
