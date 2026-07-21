import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { Groq } from "groq-sdk";
import { db } from "../firebase-client-wrapper";

export async function callGroq(messages: any[], isJson?: boolean, imageBase64?: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const groq = new Groq({ apiKey });
  // Choose vision or text model
  const model = imageBase64 ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile";
  console.log(`[Groq API] Calling model ${model}...`);

  const formattedMessages: any[] = [];
  
  // Format messages
  for (const m of messages) {
    const role = m.role === "system" ? "system" : (m.role === "assistant" || m.role === "agent" || m.role === "model" ? "assistant" : "user");
    const text = typeof m.content === "string" ? m.content : (m.msg || "");
    
    if (role === "user" && imageBase64) {
      formattedMessages.push({
        role: "user",
        content: [
          { type: "text", text: text },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      });
    } else {
      formattedMessages.push({ role, content: text });
    }
  }

  if (formattedMessages.length === 0) {
    formattedMessages.push({ role: "user", content: "Hello" });
  }

  const chatCompletion = await groq.chat.completions.create({
    model,
    messages: formattedMessages,
    response_format: isJson ? { type: "json_object" } : undefined,
    temperature: 0.1
  });

  const content = chatCompletion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from Groq API");
  }

  return content;
}

const GEMINI_TASKS = [
  "browser_agent",
  "mortgage_research",
  "lead_scoring",
  "report_generation",
  "task_planning",
  "lead_classifier"
];

const POE_TASKS = [
  "chatbot",
  "whatsapp_message",
  "simple_response"
];

const POE_MODELS = [
  "Claude-Sonnet-4-6",
  "Gemini-2.0-Flash",
  "GPT-4o-mini",
  "Llama-3.1-70b"
];

// Reusable function to translate OpenAI-style messages to Gemini format
export function translateMessagesToGemini(messages: any[], image?: string) {
  let systemInstruction = "";
  const sanitized: any[] = [];
  
  for (const m of messages) {
    const role = m.role === "system" ? "system" : (m.role === "assistant" || m.role === "agent" || m.role === "model" ? "model" : "user");
    const text = typeof m.content === "string" ? m.content : (m.msg || "");
    
    if (role === "system") {
      systemInstruction += (systemInstruction ? "\n" : "") + text;
    } else {
      if (sanitized.length > 0 && sanitized[sanitized.length - 1].role === role) {
        sanitized[sanitized.length - 1].parts.push({ text });
      } else {
        sanitized.push({
          role,
          parts: [{ text }]
        });
      }
    }
  }

  // Gemini requires the conversation to start with a 'user' message
  while (sanitized.length > 0 && sanitized[0].role !== "user") {
    sanitized.shift();
  }

  if (sanitized.length === 0) {
    sanitized.push({
      role: "user",
      parts: [{ text: "Hello" }]
    });
  }

  // If there is an image, append it to the last user message
  if (image) {
    const lastUserIndex = sanitized.map(s => s.role).lastIndexOf("user");
    if (lastUserIndex !== -1) {
      sanitized[lastUserIndex].parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: image
        }
      });
    } else {
      sanitized[0].parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: image
        }
      });
    }
  }

  return { contents: sanitized, systemInstruction };
}

// Call Gemini directly with the translated structure, featuring automatic retries and fallback models
async function callGemini(contents: any[], systemInstruction?: string, isJson?: boolean): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  const aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: { "User-Agent": "aistudio-build" }
    }
  });

  const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    const maxRetries = 3;
    let delayMs = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini API] Querying ${modelName} (attempt ${attempt}/${maxRetries})...`);
        const response = await aiClient.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: systemInstruction || undefined,
            responseMimeType: isJson ? "application/json" : undefined
          }
        });
        
        if (response.text) {
          console.log(`[Gemini API] Success with ${modelName}`);
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const errStatus = err?.status || "";
        const errCode = err?.code || 0;
        
        const isQuotaExceeded = 
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("quota") ||
          errMsg.includes("Quota") ||
          errMsg.includes("rate-limits") ||
          errStatus === "RESOURCE_EXHAUSTED" ||
          errCode === 429;

        if (isQuotaExceeded) {
          console.warn(`[Gemini API] Quota exceeded on ${modelName}. Moving immediately to the next fallback model.`);
          break; // Immediately break retry loop for this model to try the next model
        }

        const isTransient = 
          errMsg.includes("503") || 
          errMsg.includes("UNAVAILABLE") || 
          errMsg.includes("overloaded") ||
          errMsg.includes("high demand") ||
          errStatus === "UNAVAILABLE" ||
          errCode === 503;

        if (isTransient) {
          if (attempt < maxRetries) {
            console.warn(`[Gemini API] Transient error on ${modelName}: "${errMsg}". Retrying in ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            delayMs *= 2; // Exponential backoff
          } else {
            console.warn(`[Gemini API] Model ${modelName} failed after ${maxRetries} attempts.`);
          }
        } else {
          // If it's a structural error or other issue, don't retry, move on to fallback
          console.error(`[Gemini API] Non-transient error on ${modelName}:`, errMsg);
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to get response from Gemini models");
}

let poeHealthy = true;
let checkedPoeStatus = false;

async function checkPoeHealth(): Promise<boolean> {
  if (checkedPoeStatus) return poeHealthy;
  try {
    const currentKeyHash = process.env.POE_API_KEY ? String(process.env.POE_API_KEY).slice(-6) : "";
    const doc = await db.collection("system_config").doc("ai_status").get();
    if (doc.exists) {
      const data = doc.data();
      const storedKeyHash = data?.keyHash || "";
      if (data && data.poeHealthy === false && storedKeyHash === currentKeyHash) {
        poeHealthy = false;
        console.log("[aiService] Loaded Poe health from Firestore: marked unhealthy (credits exhausted).");
      } else if (storedKeyHash !== currentKeyHash) {
        console.log("[aiService] POE_API_KEY has changed. Resetting poeHealthy to true.");
        poeHealthy = true;
        db.collection("system_config").doc("ai_status").set({ poeHealthy: true, keyHash: currentKeyHash }).catch(() => {});
      }
    } else {
      // Initialize first state
      db.collection("system_config").doc("ai_status").set({ poeHealthy: true, keyHash: currentKeyHash }).catch(() => {});
    }
    checkedPoeStatus = true;
  } catch (err: any) {
    console.warn("[aiService] Error checking Poe health in Firestore:", err.message || err);
  }
  return poeHealthy;
}

// Call Poe rotation
async function callPoeWithRotation(messages: any[]): Promise<string> {
  if (!process.env.POE_API_KEY) {
    throw new Error("POE_API_KEY is not configured");
  }

  if (!poeHealthy) {
    throw new Error("Poe service is marked unhealthy due to previous failures or exhausted credits.");
  }

  const currentKeyHash = process.env.POE_API_KEY ? String(process.env.POE_API_KEY).slice(-6) : "";

  for (const model of POE_MODELS) {
    try {
      console.log(`[Poe API] Trying model ${model}...`);
      const response = await axios.post("https://api.poe.com/v1/chat/completions", {
        model,
        messages: messages.map(m => ({
          role: m.role === "agent" || m.role === "model" ? "assistant" : m.role,
          content: typeof m.content === "string" ? m.content : (m.msg || "")
        }))
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.POE_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 8000 // Reduced timeout for faster fallback
      });

      if (response.data && response.data.choices && response.data.choices[0]) {
        console.log(`[Poe API] Successfully called Poe with model ${model}`);
        return response.data.choices[0].message.content;
      }
    } catch (err: any) {
      console.warn(`[Poe API] Model ${model} failed, trying next. Error: ${err.message || err}`);
      const status = err?.response?.status;
      if (status === 402) {
        console.warn(`[Poe API] Received 402 (Payment Required) for ${model}. Disabling Poe for this session.`);
        poeHealthy = false;
        db.collection("system_config").doc("ai_status").set({ poeHealthy: false, keyHash: currentKeyHash }).catch(saveErr => {
          console.error("[aiService] Failed to save Poe status to Firestore:", saveErr);
        });
        throw new Error("Poe credits exhausted (402)");
      }
    }
  }

  console.warn(`[Poe API] All Poe models failed. Disabling Poe for this session.`);
  poeHealthy = false;
  db.collection("system_config").doc("ai_status").set({ poeHealthy: false, keyHash: currentKeyHash }).catch(saveErr => {
    console.error("[aiService] Failed to save Poe status to Firestore:", saveErr);
  });
  throw new Error("All Poe models exhausted");
}

// Single entry point for all AI calls
export async function callAI(taskType: string, messages: any[], image?: string): Promise<string> {
  const currentPoeHealthy = await checkPoeHealth();
  const hasPoe = !!process.env.POE_API_KEY && currentPoeHealthy;
  const hasGroq = !!process.env.GROQ_API_KEY;
  const isGeminiFirst = GEMINI_TASKS.includes(taskType) || !hasPoe;
  const isJson = taskType === "browser_agent" || taskType === "lead_classifier";

  if (isGeminiFirst) {
    try {
      console.log(`[aiService] Executing Gemini-first task: ${taskType}`);
      const { contents, systemInstruction } = translateMessagesToGemini(messages, image);
      return await callGemini(contents, systemInstruction, isJson);
    } catch (err: any) {
      if (hasPoe) {
        console.warn(`[aiService] Gemini call failed for ${taskType}. Falling back to Poe rotation. Error: ${err.message || err}`);
        try {
          return await callPoeWithRotation(messages);
        } catch (poeErr: any) {
          console.error(`[aiService] Poe fallback failed too: ${poeErr.message || poeErr}`);
        }
      }
      
      if (hasGroq) {
        console.warn(`[aiService] Trying Groq backup for ${taskType}`);
        try {
          return await callGroq(messages, isJson, image);
        } catch (groqErr: any) {
          console.error(`[aiService] Groq fallback failed too: ${groqErr.message || groqErr}`);
        }
      }
      
      throw err;
    }
  } else {
    // Poe first task
    try {
      console.log(`[aiService] Executing Poe-first task: ${taskType}`);
      return await callPoeWithRotation(messages);
    } catch (err: any) {
      console.warn(`[aiService] Poe rotation failed for ${taskType}. Falling back to Gemini. Error: ${err.message || err}`);
      try {
        const { contents, systemInstruction } = translateMessagesToGemini(messages, image);
        return await callGemini(contents, systemInstruction, isJson);
      } catch (geminiErr: any) {
        console.error(`[aiService] Gemini fallback failed too: ${geminiErr.message || geminiErr}`);
        
        if (hasGroq) {
          console.warn(`[aiService] Trying Groq backup for ${taskType}`);
          try {
            return await callGroq(messages, isJson, image);
          } catch (groqErr: any) {
            console.error(`[aiService] Groq fallback failed too: ${groqErr.message || groqErr}`);
          }
        }
        
        throw geminiErr;
      }
    }
  }
}

export async function findTargetUrl(instruction: string): Promise<string> {
  const lower = instruction.toLowerCase();

  // 1. Check if the instruction already contains a clear URL
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const match = instruction.match(urlRegex);
  if (match) return match[0];

  // 2. Check if a domain name is mentioned (e.g. "google.com", "airbnb.com", "github.com")
  const domainRegex = /(?:^|\s)([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\/[^\s]*)?(?:$|\s)/gi;
  const domainMatch = domainRegex.exec(instruction);
  if (domainMatch) {
    const domain = domainMatch[1].trim();
    if (!domain.startsWith('http')) {
      return `https://${domain}`;
    }
    return domain;
  }

  // 3. Local mappings for popular platforms
  const mappings: { [key: string]: string } = {
    'airbnb': 'https://www.airbnb.com',
    'linkedin': 'https://www.linkedin.com',
    'github': 'https://www.github.com',
    'gitlab': 'https://www.gitlab.com',
    'twitter': 'https://x.com',
    'facebook': 'https://www.facebook.com',
    'instagram': 'https://www.instagram.com',
    'youtube': 'https://www.youtube.com',
    'amazon': 'https://www.amazon.com',
    'google': 'https://www.google.com',
    'reddit': 'https://www.reddit.com',
    'netflix': 'https://www.netflix.com',
    'wikipedia': 'https://www.wikipedia.org',
    'zillow': 'https://www.zillow.com',
    'yelp': 'https://www.yelp.com',
    'tripadvisor': 'https://www.tripadvisor.com',
    'booking': 'https://www.booking.com',
    'ebay': 'https://www.ebay.com',
    'craigslist': 'https://www.craigslist.org',
    'pinterest': 'https://www.pinterest.com',
    'tiktok': 'https://www.tiktok.com',
  };

  for (const key of Object.keys(mappings)) {
    if (new RegExp(`\\b${key}\\b`, 'i').test(lower)) {
      return mappings[key];
    }
  }

  // 4. Try using Gemini Grounding Search if available
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Given this task: "${instruction}", determine the single best real URL to start browsing from. If it names a specific website (e.g. "Airbnb", "LinkedIn"), use that site's real domain directly (e.g. https://www.airbnb.com). If it's a business/lead search with no named site, prefer a Google Maps search URL. Respond with ONLY the URL, nothing else, no explanation.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    const text = (response.text || '').trim();
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (urlMatch) return urlMatch[0];
  } catch (e: any) {
    console.error('[findTargetUrl] Grounding failed, using fallback:', e.message);
  }

  // 5. Intelligent Fallback:
  // If it's explicitly a local or business search or map-related instruction, default to Google Maps search.
  // Otherwise, default to Google Search, which is a much better general start page for any browser task!
  const mapsIndicators = [
    'maps', 'google maps', 'google map', 'near', 'location', 'address', 'city',
    'dentist', 'plumber', 'cafe', 'restaurant', 'hotel', 'bar', 'gym', 'salon',
    'doctor', 'lawyer', 'bakery', 'store', 'shop', 'business in', 'businesses in',
    'leads in', 'scrape in', 'find in', 'search in'
  ];
  
  const isMapsQuery = mapsIndicators.some(indicator => lower.includes(indicator));
  
  if (isMapsQuery) {
    return `https://www.google.com/maps/search/${encodeURIComponent(instruction)}`;
  } else {
    return `https://www.google.com/search?q=${encodeURIComponent(instruction)}`;
  }
}
