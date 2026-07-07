import { callAI } from "./aiService";
import { Agent, BusinessContext, GTMPlan, Segment } from "../src/types";

const REPO_BASE = 'https://raw.githubusercontent.com/tonykone555/agency-agents/main';

export const AGENT_LIBRARY: Record<string, { name: string; division: string; skills: string[]; systemPrompt: string }> = {
  growth_hacker: {
    name: 'Growth Hacker', division: 'Marketing',
    skills: ['viral growth', 'acquisition', 'A/B testing', 'funnel optimization'],
    systemPrompt: `You are an obsessive growth hacker. You find 
      unconventional high-leverage tactics others miss. You always 
      ask "what's the 10x version?" Deliver 3-5 growth experiments 
      with measurable metrics for everything.`
  },
  content_creator: {
    name: 'Content Creator', division: 'Marketing',
    skills: ['blog writing', 'social media', 'SEO content', 'email'],
    systemPrompt: `You are a content creator who produces compelling 
      platform-native content. Great content serves the reader first, 
      brand second. Deliver publication-ready content with clear CTAs.`
  },
  seo_specialist: {
    name: 'SEO Specialist', division: 'Marketing',
    skills: ['keyword research', 'on-page SEO', 'link building', 'technical SEO'],
    systemPrompt: `You treat search engines as systems to understand, 
      not trick. You find keywords that convert, not just rank. 
      Deliver actionable SEO plans with traffic projections.`
  },
  reddit_builder: {
    name: 'Reddit Community Builder', division: 'Marketing',
    skills: ['community management', 'Reddit strategy', 'authentic engagement'],
    systemPrompt: `You are not marketing on Reddit — you are becoming 
      a valued community member who happens to represent a brand. 
      You never post ads. You deliver genuine value.`
  },
  linkedin_creator: {
    name: 'LinkedIn Content Creator', division: 'Marketing',
    skills: ['thought leadership', 'B2B content', 'personal branding'],
    systemPrompt: `You create LinkedIn content that builds authority 
      and generates inbound leads. You understand the algorithm favors 
      conversation over broadcasting.`
  },
  outbound_strategist: {
    name: 'Outbound Strategist', division: 'Sales',
    skills: ['cold outreach', 'email sequences', 'LinkedIn prospecting'],
    systemPrompt: `You believe cold outreach should feel warm. 
      You write messages that 
      reference something real. Target 15%+ response rates.`
  },
  proposal_strategist: {
    name: 'Proposal Strategist', division: 'Sales',
    skills: ['proposal writing', 'pricing strategy', 'ROI calculation'],
    systemPrompt: `You write proposals that win. Lead with client pain, 
      not your credentials. Quantify ROI before mentioning price.`
  },
  trend_researcher: {
    name: 'Trend Researcher', division: 'Product',
    skills: ['market research', 'competitor analysis', 'opportunity mapping'],
    systemPrompt: `You spot trends before they peak. Combine 
      quantitative signals with qualitative patterns. Deliver 
      research that reveals opportunities, not just information.`
  },
  data_analyst: {
    name: 'Analytics Reporter', division: 'Support',
    skills: ['data analysis', 'reporting', 'KPI tracking', 'insight generation'],
    systemPrompt: `You turn data into decisions. You find the story 
      in the numbers. Lead with the insight, not the methodology.`
  },
  technical_writer: {
    name: 'Technical Writer', division: 'Engineering',
    skills: ['documentation', 'API docs', 'user guides'],
    systemPrompt: `You make complex things clear. You write for the 
      frustrated reader, not the expert. Deliver documentation that 
      reduces support tickets.`
  }
};

export async function orchestrateAgency(
  userGoal: string,
  onProgress: (update: any) => void
): Promise<any> {

  onProgress({ step: 'planning', status: 'running',
    message: 'Assembling your specialist team...' });

  const agentList = Object.entries(AGENT_LIBRARY)
    .map(([id, a]) => `${id}: ${a.name} — ${a.skills.join(', ')}`)
    .join('\n');

  const planResponse = await callAI('agency_orchestrator', [{
    role: 'system',
    content: `You are the Assix Agency Orchestrator.
Given a user goal, select 2-4 specialist agents and plan their tasks.
Return ONLY valid JSON:
{
  "selectedAgents": ["agent_id_1", "agent_id_2"],
  "reasoning": "Why these agents",
  "tasks": [{
    "agentId": "agent_id",
    "taskDescription": "Specific task",
    "expectedOutput": "What this delivers"
  }],
  "serviceIdeas": ["Service idea 1", "Service idea 2", "Service idea 3"]
}
Available agents:\n${agentList}`
  }, {
    role: 'user',
    content: `Goal: ${userGoal}`
  }]);

  let plan: any;
  try {
    const cleaned = planResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    plan = JSON.parse(cleaned);
  } catch (err) {
    const match = planResponse.match(/\{[\s\S]*\}/);
    if (match) {
      plan = JSON.parse(match[0]);
    } else {
      throw err;
    }
  }

  onProgress({
    step: 'team_assembled', status: 'running',
    message: `Team: ${plan.selectedAgents
      .map((id: string) => AGENT_LIBRARY[id]?.name || id).join(', ')}`,
    data: { plan }
  });

  const results = await Promise.allSettled(
    plan.tasks.map(async (task: any) => {
      const agent = AGENT_LIBRARY[task.agentId];
      if (!agent) return null;

      onProgress({ step: `executing_${task.agentId}`,
        status: 'running',
        message: `${agent.name}: ${task.taskDescription}` });

      const result = await callAI('agent_task', [{
        role: 'system', content: agent.systemPrompt
      }, {
        role: 'user', content: task.taskDescription
      }]);

      return { agentId: task.agentId, 
               agentName: agent.name, result };
    })
  );

  const successResults = results
    .filter(r => r.status === 'fulfilled')
    .map((r: any) => r.value)
    .filter(val => val !== null);

  const synthesis = await callAI('synthesis', [{
    role: 'user',
    content: `Synthesize these specialist outputs for goal: "${userGoal}"
Results: ${JSON.stringify(successResults)}
Produce a clear actionable summary combining all outputs.`
  }]);

  onProgress({
    step: 'complete', status: 'done',
    message: 'Agency task complete',
    data: { plan, results: successResults, 
            synthesis, serviceIdeas: plan.serviceIdeas }
  });

  return { plan, results: successResults, synthesis };
}

// =========================================================================
// NEW ENHANCED AGENCY SYSTEM CORE FUNCTIONS
// =========================================================================

async function fetchAgentFromRepo(path: string): Promise<string> {
  try {
    const res = await fetch(`${REPO_BASE}/${path}`);
    if (!res.ok) throw new Error('Not found');
    return await res.text();
  } catch {
    return '';
  }
}

export async function loadAgentLibrary(): Promise<Agent[]> {
  try {
    const res = await fetch(`${REPO_BASE}/index.json`);
    if (!res.ok) throw new Error('Failed to fetch index');
    return await res.json();
  } catch {
    // Fallback minimal library if repo unavailable
    return [
      { id: 'trend_researcher', name: 'Trend Researcher', path: 'product/trend-researcher.md' },
      { id: 'outbound_strategist', name: 'Outbound Strategist', path: 'sales/outbound-strategist.md' },
      { id: 'growth_hacker', name: 'Growth Hacker', path: 'marketing/growth-hacker.md' },
      { id: 'proposal_strategist', name: 'Proposal Strategist', path: 'sales/proposal-strategist.md' },
      { id: 'content_creator', name: 'Content Creator', path: 'marketing/content-creator.md' },
      { id: 'linkedin_creator', name: 'LinkedIn Creator', path: 'marketing/linkedin-content-creator.md' },
      { id: 'seo_specialist', name: 'SEO Specialist', path: 'marketing/seo-specialist.md' },
      { id: 'reddit_builder', name: 'Reddit Community Builder', path: 'marketing/reddit-community-builder.md' },
      { id: 'data_analyst', name: 'Analytics Reporter', path: 'support/analytics-reporter.md' },
      { id: 'technical_writer', name: 'Technical Writer', path: 'engineering/technical-writer.md' }
    ];
  }
}

async function selectAgentsForGoal(context: BusinessContext, allAgents: Agent[]): Promise<Agent[]> {
  const agentList = allAgents
    .map(a => `${a.id}: ${a.name}`)
    .join('\n');

  const response = await callAI('lead_classifier', [{
    role: 'system',
    content: `You are selecting specialist agents for any business goal. You have 232 agents available.
    This works for ANY type: SaaS products, physical products, service businesses, local businesses, creators, agencies, anything.
    Select 3-5 agents that together cover:
    1. Understanding the market opportunity
    2. Finding and reaching the right people
    3. Converting interest to revenue
    4. Growing and scaling
    Return ONLY a valid JSON array of agent IDs. Example: ["id1", "id2", "id3"]
    Strict rules:
    - No emojis.
    - No markdown formatting in output, return raw JSON string.
    - Select only from the available agents list.
    Available agents:\n${agentList}`
  }, {
    role: 'user',
    content: `Goal: ${context.goal}
    Type: ${context.type}
    Target ICP: ${context.target}
    Problem solved: ${context.problem}
    Price: ${context.price}
    Markets: ${context.markets.join(', ')}`
  }]);

  let selectedIds: string[];
  try {
    const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
    selectedIds = JSON.parse(cleaned);
  } catch {
    selectedIds = ['trend_researcher', 'outbound_strategist', 'growth_hacker', 'proposal_strategist'];
  }

  // Load full prompts from repo for selected agents
  return Promise.all(
    selectedIds.map(async (id) => {
      const agent = allAgents.find(a => a.id === id);
      if (!agent) return null;
      let systemPrompt = await fetchAgentFromRepo(agent.path);
      if (!systemPrompt) {
        // Find in AGENT_LIBRARY local fallback
        const fallback = AGENT_LIBRARY[id];
        systemPrompt = fallback ? fallback.systemPrompt : `You are ${agent.name}, a specialist agent.`;
      }
      return { ...agent, systemPrompt };
    })
  ).then(agents => agents.filter(Boolean) as Agent[]);
}

export async function runAgencySession(
  context: BusinessContext,
  onProgress: (update: any) => void
): Promise<GTMPlan> {

  onProgress({
    step: 'loading_agents',
    status: 'running',
    message: 'Loading specialist library...'
  });

  const allAgents = await loadAgentLibrary();

  onProgress({
    step: 'selecting_team',
    status: 'running',
    message: 'AI selecting optimal team for your goals...'
  });

  const selected = await selectAgentsForGoal(context, allAgents);

  onProgress({
    step: 'team_assembled',
    status: 'running',
    message: `Assembled team: ${selected.map(a => a.name).join(', ')}`,
    selectedAgents: selected.map(a => a.id)
  });

  const results: any[] = [];
  for (const agent of selected) {
    onProgress({
      step: `executing_${agent.id}`,
      status: 'running',
      message: `${agent.name} formulating strategy...`
    });

    const response = await callAI('report_generation', [
      { role: 'system', content: agent.systemPrompt || '' },
      { role: 'user', content: `Develop GTM recommendations for:
      Goal: ${context.goal}
      Type: ${context.type}
      Target ICP: ${context.target}
      Core Problem: ${context.problem}
      Price: ${context.price}
      Markets: ${context.markets.join(', ')}` }
    ]);

    results.push({ agentId: agent.id, agentName: agent.name, output: response });
  }

  onProgress({
    step: 'synthesizing',
    status: 'running',
    message: 'Synthesizing all insights into your GTM plan...'
  });

  const synthesisResponse = await callAI('lead_classifier', [
    {
      role: 'system',
      content: `You are the lead Assix Agency Orchestrator.
      Synthesize all specialist outputs into a pristine GTM strategy.
      Return ONLY a valid JSON matching this schema:
      {
        "segments": [{
          "name": "Segment Name",
          "fitScore": 95,
          "why": "Detailed why",
          "painSignal": "Signal to look for",
          "searchQuery": "Search query for business lookup (e.g., locksmiths in Lyon)",
          "tool": "Google Maps Scrape|LinkedIn Search",
          "channel": "Email|LinkedIn|WhatsApp",
          "day1Message": "Outreach message copy",
          "day3Message": "Followup copy",
          "day7Message": "Final copy",
          "expectedResponseRate": "15%",
          "dailyLimit": 50
        }],
        "growthExperiments": ["Experiment 1", "Experiment 2"],
        "fastestPath": "Fastest monetization path details",
        "contentIdeas": ["LinkedIn post idea 1", "post idea 2"],
        "valueProposition": "Core compelling value prop",
        "toolsNeeded": ["Tool 1", "Tool 2"]
      }
      Strict rules:
      1. No emojis anywhere.
      2. Plan must be comprehensive and professional.
      3. JSON must be parseable. No conversational wrapper.`
    },
    {
      role: 'user',
      content: `Specialists outputs:
      ${JSON.stringify(results)}`
    }
  ]);

  let plan: GTMPlan;
  try {
    const cleaned = synthesisResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    plan = {
      context,
      selectedAgents: selected.map(a => a.id),
      segments: parsed.segments || [],
      growthExperiments: parsed.growthExperiments || [],
      fastestPath: parsed.fastestPath || '',
      contentIdeas: parsed.contentIdeas || [],
      valueProposition: parsed.valueProposition || '',
      toolsNeeded: parsed.toolsNeeded || [],
      generatedAt: new Date().toISOString()
    };
  } catch {
    plan = {
      context,
      selectedAgents: selected.map(a => a.id),
      segments: [{
        name: 'Primary Target ICP',
        fitScore: 85,
        why: 'High-fit default target group',
        painSignal: 'Active outreach',
        searchQuery: `${context.target} in ${context.markets[0]}`,
        tool: 'Google Maps Scrape',
        channel: 'Email',
        day1Message: 'Hello, noticed you are doing outreach...',
        day3Message: 'Just following up...',
        day7Message: 'Last attempt...',
        expectedResponseRate: '12%',
        dailyLimit: 40
      }],
      growthExperiments: ['Cold outreach scaling', 'SEO optimization'],
      fastestPath: 'Direct outreach to primary leads',
      contentIdeas: ['How to solve core problem', 'Why price makes sense'],
      valueProposition: 'Premium solution for ICP',
      toolsNeeded: ['Google Maps Scrape', 'Email Client'],
      generatedAt: new Date().toISOString()
    };
  }

  return plan;
}

export async function enrichLeadSearch(
  query: string
): Promise<{ suggestedMarkets: string[]; targetKeywords: string[]; painSignals: string[]; outreachHook: string }> {
  try {
    const response = await callAI('lead_classifier', [
      {
        role: 'system',
        content: `You analyze business lead search queries to enrich them with GTM signals.
        Return ONLY valid JSON matching this schema:
        {
          "suggestedMarkets": ["Market 1", "Market 2"],
          "targetKeywords": ["keyword1", "keyword2"],
          "painSignals": ["Signal 1", "Signal 2"],
          "outreachHook": "Compelling outbound hook"
        }
        Strict rules:
        1. No emojis.
        2. Response must be valid parseable JSON. No markdown wrappers.`
      },
      { role: 'user', content: `Search Query: ${query}` }
    ]);
    const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      suggestedMarkets: parsed.suggestedMarkets || [],
      targetKeywords: parsed.targetKeywords || [],
      painSignals: parsed.painSignals || [],
      outreachHook: parsed.outreachHook || ""
    };
  } catch {
    return {
      suggestedMarkets: ["US National", "Global"],
      targetKeywords: [query],
      painSignals: ["Actively seeking solutions"],
      outreachHook: `Hello, noticed you might need help with ${query}...`
    };
  }
}
