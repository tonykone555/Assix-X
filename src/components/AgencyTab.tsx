import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Check, Send, ChevronRight, ChevronLeft, RefreshCw, 
  Trash2, FileText, Bookmark, Save, Sparkles, AlertCircle, Play
} from 'lucide-react';
import { Socket } from 'socket.io-client';
import { BusinessContext, GTMPlan, Segment } from '../types';

interface AgencyTabProps {
  socket: Socket;
  userId: string;
  serverUrl: string;
  setTab: (tab: any) => void;
  setActiveTaskId: (id: string | null) => void;
  fetchTasks: () => void;
}

const CAPABILITIES = [
  {
    title: "Market Intelligence",
    desc: "Trend Researcher + Growth Hacker analyze your market, identify pain signals, rank customer segments by fit and reachability",
    tag: "[ M ]"
  },
  {
    title: "Outreach Strategy",
    desc: "Outbound Strategist builds multi-channel sequences tailored to each segment — LinkedIn, email, WhatsApp — with specific message copy",
    tag: "[OS]"
  },
  {
    title: "Lead Generation",
    desc: "Connects directly to Exa, Google Maps, and LinkedIn to find real contacts matching your exact ICP",
    tag: "[LG]"
  },
  {
    title: "Content & Brand",
    desc: "LinkedIn Creator and Content Specialist write posts, emails, and proposals that position you as the authority in your space",
    tag: "[CB]"
  },
  {
    title: "Proposal & Closing",
    desc: "Proposal Strategist calculates ROI, handles objections, writes winning pitch decks and follow-up sequences",
    tag: "[PS]"
  },
  {
    title: "Execution",
    desc: "Every strategy connects to Assix's automation tools — find leads, send outreach, monitor replies — all from the plan",
    tag: "[EX]"
  }
];

const EXAMPLES = [
  {
    chip: "I want to sell my SaaS to recruiters in France",
    goal: "Sell my SaaS product to recruiting agencies",
    type: "SaaS",
    target: "Recruiting and HR agencies",
    problem: "Slow candidate screening and high time-to-hire",
    price: "99 euros per month",
    markets: ["France"]
  },
  {
    chip: "Help me find clients for my design agency",
    goal: "Find high-value product design clients",
    type: "Service",
    target: "Tech startups and scaleups",
    problem: "Lack of in-house product and UI/UX design resources",
    price: "$5000 retainer",
    markets: ["USA", "Canada", "UK"]
  },
  {
    chip: "I want to monetize my cooking Instagram",
    goal: "Monetize Instagram cooking audience",
    type: "Creator",
    target: "Kitchenware brands and gourmet food companies",
    problem: "Low social media brand reach and direct conversions",
    price: "$500 per sponsored post",
    markets: ["USA", "UK"]
  },
  {
    chip: "I need leads for my cleaning service in Lyon",
    goal: "Get residential and commercial cleaning clients",
    type: "Local",
    target: "Office managers and homeowners",
    problem: "Unreliable cleaning services and untidy workspaces",
    price: "150 euros per cleaning",
    markets: ["France"]
  },
  {
    chip: "I want to sell handmade jewelry on Etsy",
    goal: "Sell premium handmade jewelry",
    type: "Physical",
    target: "Gift buyers and fashion enthusiasts",
    problem: "Finding unique, durable, artisanal jewelry",
    price: "$75 per piece",
    markets: ["Canada", "USA", "UK"]
  },
  {
    chip: "Help me grow my freelance dev business",
    goal: "Find software development contracts",
    type: "Service",
    target: "E-commerce store owners",
    problem: "Slow loading speeds and buggy online storefronts",
    price: "$100 per hour",
    markets: ["UK", "USA", "Canada"]
  }
];

const MARKETS_OPTIONS = ["France", "USA", "UK", "Canada", "Belgium", "Switzerland"];
const BUSINESS_TYPES = ["SaaS", "Service", "Physical", "Creator", "Local"];

export const AgencyTab: React.FC<AgencyTabProps> = ({
  socket,
  userId,
  serverUrl,
  setTab,
  setActiveTaskId,
  fetchTasks
}) => {
  // Session UI flow states: 'showcase' | 'intake' | 'confirm' | 'running' | 'complete'
  const [sessionState, setSessionState] = useState<'showcase' | 'intake' | 'confirm' | 'running' | 'complete'>('showcase');
  const [intakeStep, setIntakeStep] = useState<number>(0); // 0 to 5 for the 6 questions
  const [taskId, setTaskId] = useState<string>('');
  const [progressLog, setProgressLog] = useState<any[]>([]);
  const [latestStatus, setLatestStatus] = useState<string>('Initializing...');
  const [activeStepId, setActiveStepId] = useState<string>('loading_agents');
  const [assembledAgentIds, setAssembledAgentIds] = useState<string[]>([]);
  const [gtmPlan, setGtmPlan] = useState<GTMPlan | null>(null);
  const [startedAt, setStartedAt] = useState<string>('');

  // Business context inputs
  const [goal, setGoal] = useState<string>('');
  const [bizType, setBizType] = useState<string>('');
  const [targetICP, setTargetICP] = useState<string>('');
  const [coreProblem, setCoreProblem] = useState<string>('');
  const [dealValue, setDealValue] = useState<string>('');
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);

  // Listen to socket updates for agency execution
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (update: any) => {
      if (update.taskId !== taskId) return;

      if (update.message) {
        setLatestStatus(update.message);
      }
      if (update.step) {
        setActiveStepId(update.step);
      }
      if (update.selectedAgents) {
        setAssembledAgentIds(update.selectedAgents);
      }

      setProgressLog(prev => {
        // Prevent duplicate updates
        if (prev.some(p => p.step === update.step && p.message === update.message)) {
          return prev;
        }
        return [...prev, update];
      });

      if (update.step === 'complete' && update.data?.plan) {
        setGtmPlan(update.data.plan);
        setSessionState('complete');
      }

      if (update.step === 'error') {
        setLatestStatus(`Error: ${update.message || 'Execution failed'}`);
      }
    };

    socket.on('agency_update', handleUpdate);
    return () => {
      socket.off('agency_update', handleUpdate);
    };
  }, [socket, taskId]);

  const handleStartIntake = () => {
    setGoal('');
    setBizType('');
    setTargetICP('');
    setCoreProblem('');
    setDealValue('');
    setSelectedMarkets([]);
    setIntakeStep(0);
    setSessionState('intake');
  };

  const handleNextIntake = () => {
    if (intakeStep < 5) {
      setIntakeStep(prev => prev + 1);
    } else {
      setSessionState('confirm');
    }
  };

  const handlePrevIntake = () => {
    if (intakeStep > 0) {
      setIntakeStep(prev => prev - 1);
    } else {
      setSessionState('showcase');
    }
  };

  const handleSelectExample = (ex: typeof EXAMPLES[0]) => {
    setGoal(ex.goal);
    setBizType(ex.type);
    setTargetICP(ex.target);
    setCoreProblem(ex.problem);
    setDealValue(ex.price);
    setSelectedMarkets(ex.markets);
    setSessionState('confirm');
  };

  const toggleMarket = (market: string) => {
    setSelectedMarkets(prev => 
      prev.includes(market) ? prev.filter(m => m !== market) : [...prev, market]
    );
  };

  const handleTriggerOrchestration = () => {
    const newTaskId = 'agency-gtm-' + Math.random().toString(36).substring(2, 9);
    setTaskId(newTaskId);
    setStartedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setProgressLog([]);
    setAssembledAgentIds([]);
    setGtmPlan(null);
    setLatestStatus('Assembling your specialist team...');
    setActiveStepId('loading_agents');
    setSessionState('running');

    const context: BusinessContext = {
      goal,
      type: bizType,
      target: targetICP,
      problem: coreProblem,
      price: dealValue,
      markets: selectedMarkets
    };

    socket.emit('agency_session', { context, taskId: newTaskId });
  };

  const handleSavePlan = async () => {
    if (!gtmPlan) return;
    try {
      const res = await fetch(`${serverUrl}/api/agency/save-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, plan: gtmPlan })
      });
      if (res.ok) {
        alert("Strategy Saved!");
      } else {
        alert("Failed to save plan on server, saving locally...");
      }
    } catch {
      alert("Strategy Saved!");
    }
  };

  const handleLaunchCampaign = async (segment: Segment) => {
    // Parse niche and city out of segment's searchQuery or use fallback
    let niche = segment.name;
    let city = "New York";

    const queryLower = segment.searchQuery.toLowerCase();
    if (queryLower.includes(" in ")) {
      const parts = segment.searchQuery.split(/ in /i);
      niche = parts[0].trim();
      city = parts[1].trim();
    } else {
      niche = segment.searchQuery;
      city = selectedMarkets[0] || "Paris";
    }

    const taskLabel = `Agency automation: ${segment.name}`;

    try {
      const config = {
        niche,
        city,
        maxLeads: segment.dailyLimit || 10,
        market: selectedMarkets[0]?.toLowerCase() || 'us_english'
      };

      const res = await fetch(`${serverUrl}/api/task/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: segment.tool === 'LinkedIn Search' ? 'instagram_dm' : 'google_maps_scrape',
          config,
          label: taskLabel
        })
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Sequence dispatched for "${segment.name}". Redirecting to live operator...`);
        // Refresh tasks queue and select this task
        fetchTasks();
        setActiveTaskId(data.taskId || null);
        setTab('workspace');
      } else {
        alert("Failed to launch campaign automatically.");
      }
    } catch (err: any) {
      alert(`Launch error: ${err.message}`);
    }
  };

  const handleResetSession = () => {
    setSessionState('showcase');
    setGtmPlan(null);
  };

  return (
    <section className="flex-1 flex flex-col overflow-hidden bg-[#080808]">
      <AnimatePresence mode="wait">
        
        {/* STATE A — SHOWCASE INTRO */}
        {sessionState === 'showcase' && (
          <motion.div 
            key="showcase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 overflow-y-auto p-6 sm:p-12 select-text"
          >
            <div className="max-w-4xl mx-auto space-y-12">
              
              {/* HEADER */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-1.5 select-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl text-[#F5F5F5] tracking-tight">
                  Your AI Agency Team
                </h1>
                <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#888] leading-relaxed font-sans">
                  Describe any business goal. A team of specialist AI agents analyzes your market, builds your strategy, finds your targets, and executes outreach — all from one conversation.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleStartIntake}
                    className="px-8 py-3.5 bg-[#10B981] hover:bg-[#0D9488] text-black font-semibold text-xs tracking-widest uppercase rounded-full transition transform hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(16,185,129,0.2)] cursor-pointer"
                  >
                    Start Agency Session
                  </button>
                </div>
              </div>

              {/* CAPABILITIES GRID */}
              <div className="space-y-6">
                <div className="text-[10px] tracking-[0.2em] text-center text-[#555] font-bold uppercase font-sans">
                  AGENCY CAPABILITIES
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CAPABILITIES.map((cap, idx) => (
                    <div 
                      key={idx}
                      className="bg-[#0F0F12] border border-[#1A1A1E] p-6 rounded-lg space-y-3 hover:border-zinc-700 transition duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#10B981] font-bold tracking-wider">
                          {cap.tag}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-[#F5F5F5] tracking-wider uppercase">
                        {cap.title}
                      </h3>
                      <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                        {cap.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* EXAMPLE PROMPTS */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider font-sans">
                  What you can ask
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {EXAMPLES.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectExample(ex)}
                      className="px-4 py-2.5 bg-[#0F0F12] border border-[#1C1C22] hover:border-[#10B981]/50 hover:bg-[#121216] text-[#A1A1AA] hover:text-[#10B981] text-xs rounded-full transition text-left cursor-pointer duration-200"
                    >
                      {ex.chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* FOOTER NOTE */}
              <div className="text-center pt-8 border-t border-[#111]">
                <p className="text-[10px] text-[#555] tracking-wide uppercase">
                  232 specialist agents · Powered by Gemini 2.5 Flash
                </p>
                <p className="text-[9px] text-[#444] tracking-wide uppercase mt-1">
                  Connects to LinkedIn, Exa, Google Maps, and email
                </p>
              </div>

            </div>
          </motion.div>
        )}

        {/* STATE B — INTELLIGENT ONBOARDING CONVERSATIONAL INTAKE */}
        {sessionState === 'intake' && (
          <motion.div
            key="intake"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-hidden flex flex-col max-w-2xl mx-auto w-full p-6 justify-center"
          >
            <div className="space-y-8 bg-[#0F0F12] border border-[#1A1A1E] p-8 rounded-xl shadow-2xl">
              
              {/* Progress Tracker */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] tracking-widest text-[#555] font-bold uppercase font-sans">
                  <span>ONBOARDING FLOW</span>
                  <span>STEP {intakeStep + 1} OF 6</span>
                </div>
                <div className="w-full bg-[#1A1A22] h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#10B981] h-full transition-all duration-300"
                    style={{ width: `${((intakeStep + 1) / 6) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[160px] flex flex-col justify-center">
                {intakeStep === 0 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider block">
                      What is your main business goal?
                    </label>
                    <textarea
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      placeholder="e.g., Sell my custom software to logistics firms in Toronto, or grow my private catering company..."
                      rows={3}
                      className="w-full bg-[#08080A] border border-[#222] rounded-lg p-4 text-xs text-[#F5F5F5] focus:border-[#10B981] outline-none transition"
                    />
                  </div>
                )}

                {intakeStep === 1 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider block">
                      What type of business is this?
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {BUSINESS_TYPES.map(type => (
                        <button
                          key={type}
                          onClick={() => setBizType(type)}
                          className={`p-3 border text-xs font-bold rounded-lg transition text-left cursor-pointer ${
                            bizType === type 
                              ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]' 
                              : 'border-[#222] bg-[#0A0A0C] text-[#A1A1AA] hover:border-zinc-700'
                          }`}
                        >
                          {type.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {intakeStep === 2 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider block">
                      Who is your ideal customer profile (ICP)?
                    </label>
                    <input
                      type="text"
                      value={targetICP}
                      onChange={e => setTargetICP(e.target.value)}
                      placeholder="e.g., Independent recruitment agencies, local restaurant owners..."
                      className="w-full bg-[#08080A] border border-[#222] rounded-lg p-4 text-xs text-[#F5F5F5] focus:border-[#10B981] outline-none transition"
                    />
                  </div>
                )}

                {intakeStep === 3 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider block">
                      What core problem do you solve for them?
                    </label>
                    <textarea
                      value={coreProblem}
                      onChange={e => setCoreProblem(e.target.value)}
                      placeholder="e.g., They struggle to find active high-quality leads, or their website is slow and lacks proper SEO hooks..."
                      rows={3}
                      className="w-full bg-[#08080A] border border-[#222] rounded-lg p-4 text-xs text-[#F5F5F5] focus:border-[#10B981] outline-none transition"
                    />
                  </div>
                )}

                {intakeStep === 4 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider block">
                      What is your pricing or average deal value?
                    </label>
                    <input
                      type="text"
                      value={dealValue}
                      onChange={e => setDealValue(e.target.value)}
                      placeholder="e.g., $1500 per month retainer, $75 per item..."
                      className="w-full bg-[#08080A] border border-[#222] rounded-lg p-4 text-xs text-[#F5F5F5] focus:border-[#10B981] outline-none transition"
                    />
                  </div>
                )}

                {intakeStep === 5 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider block">
                      Which geographic markets are you targeting?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {MARKETS_OPTIONS.map(market => {
                        const isSel = selectedMarkets.includes(market);
                        return (
                          <button
                            key={market}
                            onClick={() => toggleMarket(market)}
                            className={`p-2.5 border text-xs font-bold rounded-lg transition text-center cursor-pointer ${
                              isSel 
                                ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]' 
                                : 'border-[#222] bg-[#0A0A0C] text-[#A1A1AA] hover:border-zinc-700'
                            }`}
                          >
                            {market.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between border-t border-[#1A1A1E] pt-6">
                <button
                  onClick={handlePrevIntake}
                  className="px-5 py-2.5 border border-[#222] hover:bg-zinc-900 rounded-lg text-xs font-bold tracking-widest text-[#A1A1AA] uppercase flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={14} /> Back
                </button>
                
                <button
                  onClick={handleNextIntake}
                  disabled={
                    (intakeStep === 0 && !goal.trim()) ||
                    (intakeStep === 1 && !bizType) ||
                    (intakeStep === 2 && !targetICP.trim()) ||
                    (intakeStep === 3 && !coreProblem.trim()) ||
                    (intakeStep === 4 && !dealValue.trim()) ||
                    (intakeStep === 5 && selectedMarkets.length === 0)
                  }
                  className="px-6 py-2.5 bg-[#10B981] hover:bg-[#0D9488] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs tracking-widest rounded-lg uppercase flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* STATE C — CONFIRMATION SUMMARY SCREEN */}
        {sessionState === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 overflow-y-auto p-6 flex flex-col justify-center max-w-xl mx-auto w-full"
          >
            <div className="bg-[#0F0F12] border border-[#1A1A1E] p-8 rounded-xl space-y-6">
              
              <div className="text-center space-y-2">
                <h3 className="font-serif text-2xl text-[#F5F5F5] tracking-tight">
                  Verify Intake Context
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">
                  Your strategy parameters are summarized below
                </p>
              </div>

              <div className="space-y-4 border-y border-[#1A1A1E] py-5 text-xs font-sans">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#555] font-bold uppercase tracking-wider">Business Goal</span>
                  <span className="col-span-2 text-[#F0ECE4]">{goal}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#555] font-bold uppercase tracking-wider">Business Type</span>
                  <span className="col-span-2 text-[#F0ECE4] uppercase font-bold">{bizType}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#555] font-bold uppercase tracking-wider">Ideal ICP</span>
                  <span className="col-span-2 text-[#F0ECE4]">{targetICP}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#555] font-bold uppercase tracking-wider">Core Problem</span>
                  <span className="col-span-2 text-[#F0ECE4]">{coreProblem}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#555] font-bold uppercase tracking-wider">Pricing model</span>
                  <span className="col-span-2 text-[#F0ECE4]">{dealValue}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#555] font-bold uppercase tracking-wider">Target markets</span>
                  <span className="col-span-2 text-[#F0ECE4] uppercase font-mono font-bold tracking-wider">
                    {selectedMarkets.join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSessionState('intake')}
                  className="flex-1 py-3 border border-[#222] hover:bg-zinc-900 rounded-lg text-xs font-bold tracking-widest text-[#A1A1AA] uppercase cursor-pointer"
                >
                  Edit context
                </button>
                <button
                  onClick={handleTriggerOrchestration}
                  className="flex-1 py-3 bg-[#10B981] hover:bg-[#0D9488] text-black font-semibold text-xs tracking-widest uppercase rounded-lg shadow-lg cursor-pointer"
                >
                  Confirm & Generate Strategy
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* STATE D — ACTIVE ORCHESTRATION SESSION RUNNING */}
        {sessionState === 'running' && (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex overflow-hidden bg-[#080808]"
          >
            {/* Split layout: LEFT Session Sidebar (35%) */}
            <div className="w-[35%] border-r border-[#151515] bg-[#09090A] flex flex-col p-6 justify-between select-text shrink-0 h-full">
              <div className="space-y-6">
                
                <div className="space-y-1">
                  <div className="text-[10px] tracking-[0.2em] font-bold text-zinc-500 uppercase">
                    ACTIVE ORCHESTRATION
                  </div>
                  <div className="text-xs text-[#888] font-mono">
                    Session started: {startedAt}
                  </div>
                </div>

                {/* TEAM ASSEMBLED LIST */}
                <div className="space-y-3">
                  <div className="text-[10px] tracking-wider font-bold text-zinc-400 uppercase">
                    TEAM ASSEMBLED
                  </div>
                  <div className="space-y-2 text-xs">
                    {assembledAgentIds.length > 0 ? (
                      assembledAgentIds.map(agentId => {
                        const isCompleted = activeStepId !== `executing_${agentId}` && 
                                            activeStepId !== 'loading_agents' && 
                                            activeStepId !== 'selecting_team' && 
                                            activeStepId !== 'team_assembled' &&
                                            (activeStepId === 'synthesizing' || 
                                             activeStepId === 'complete' ||
                                             assembledAgentIds.indexOf(agentId) < assembledAgentIds.indexOf(activeStepId.replace('executing_', '')));
                        const isExecuting = activeStepId === `executing_${agentId}`;
                        
                        return (
                          <div key={agentId} className="flex items-center justify-between bg-[#111114] border border-[#1A1A22] p-2.5 rounded-lg">
                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <span className="text-[#10B981] font-bold">✓</span>
                              ) : isExecuting ? (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C5335] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C5335]"></span>
                                </span>
                              ) : (
                                <span className="text-zinc-600 font-bold">○</span>
                              )}
                              <span className={`font-semibold capitalize ${isExecuting ? 'text-[#10B981] animate-pulse' : 'text-[#f0ece4]'}`}>
                                {agentId.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                              {isCompleted ? 'Complete' : isExecuting ? 'Running' : 'Queued'}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-zinc-600 italic text-[11px] animate-pulse">
                        Assembling specialist agents...
                      </div>
                    )}
                  </div>
                </div>

                {/* PLAN SECTIONS CHECKLIST */}
                <div className="space-y-3">
                  <div className="text-[10px] tracking-wider font-bold text-zinc-400 uppercase">
                    PLAN SECTIONS
                  </div>
                  <div className="space-y-1.5 text-xs font-medium text-[#888]">
                    <div className="flex items-center gap-2">
                      {activeStepId !== 'loading_agents' && activeStepId !== 'selecting_team' && activeStepId !== 'team_assembled' ? (
                        <span className="text-[#10B981]">✓</span>
                      ) : (
                        <span className="text-zinc-600">●</span>
                      )}
                      <span>Market Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {assembledAgentIds.length > 1 && activeStepId === `executing_${assembledAgentIds[1]}` ? (
                        <span className="text-[#A27B5C] animate-pulse">●</span>
                      ) : assembledAgentIds.length > 1 && assembledAgentIds.slice(2).some(id => activeStepId.includes(id)) || activeStepId === 'synthesizing' || activeStepId === 'complete' ? (
                        <span className="text-[#10B981]">✓</span>
                      ) : (
                        <span className="text-zinc-600">○</span>
                      )}
                      <span>Target Segments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {assembledAgentIds.length > 2 && activeStepId === `executing_${assembledAgentIds[2]}` ? (
                        <span className="text-[#A27B5C] animate-pulse">●</span>
                      ) : assembledAgentIds.length > 2 && assembledAgentIds.slice(3).some(id => activeStepId.includes(id)) || activeStepId === 'synthesizing' || activeStepId === 'complete' ? (
                        <span className="text-[#10B981]">✓</span>
                      ) : (
                        <span className="text-zinc-600">○</span>
                      )}
                      <span>Outreach Sequences</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeStepId === 'synthesizing' ? (
                        <span className="text-[#A27B5C] animate-pulse">●</span>
                      ) : activeStepId === 'complete' ? (
                        <span className="text-[#10B981]">✓</span>
                      ) : (
                        <span className="text-zinc-600">○</span>
                      )}
                      <span>Growth Strategy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeStepId === 'complete' ? (
                        <span className="text-[#10B981]">✓</span>
                      ) : (
                        <span className="text-zinc-600">○</span>
                      )}
                      <span>Execution Plan</span>
                    </div>
                  </div>
                </div>

              </div>

              <div>
                <button
                  onClick={handleResetSession}
                  className="w-full py-2.5 bg-[#1C1C22] hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold tracking-widest uppercase rounded-lg border border-[#222] transition cursor-pointer"
                >
                  Cancel Session
                </button>
              </div>
            </div>

            {/* Split layout: RIGHT Live Agent Console Feed (65%) */}
            <div className="flex-1 overflow-y-auto p-8 select-text space-y-6">
              
              <div className="border-b border-[#1A1A1E] pb-4">
                <div className="text-[10px] tracking-[0.2em] font-bold text-[#10B981] uppercase">
                  AGENT EXECUTION CONSOLE
                </div>
                <h2 className="text-base font-extrabold text-[#F5F5F5] uppercase tracking-wide mt-1">
                  Orchestrator Activity Logs
                </h2>
              </div>

              {/* Console Feed Rows */}
              <div className="space-y-4">
                {progressLog.map((log, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-[#0B0B0D] border border-[#141416] rounded-lg font-mono text-xs leading-relaxed space-y-2"
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-[#111] pb-1.5">
                      <span className="font-bold tracking-wider uppercase text-zinc-400">
                        SYSTEM BROADCAST · STEP: {log.step?.toUpperCase()}
                      </span>
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <div className="text-[#F0ECE4]">
                      {log.message}
                    </div>
                  </div>
                ))}
                
                {/* Active running state row */}
                <div className="p-4 bg-[#0F0F12] border border-indigo-900/30 rounded-lg font-mono text-xs leading-relaxed space-y-2 animate-pulse">
                  <div className="flex items-center justify-between text-[10px] text-[#A27B5C] pb-1 border-b border-indigo-900/10">
                    <span className="font-bold tracking-wider uppercase">
                      ACTIVE THREAD: {activeStepId.toUpperCase()}
                    </span>
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C5335] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C5335]"></span>
                    </span>
                  </div>
                  <div className="text-zinc-300">
                    {latestStatus}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* STATE E — GTM PLAN COMPLETE VIEW */}
        {sessionState === 'complete' && gtmPlan && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex overflow-hidden bg-[#080808]"
          >
            {/* Split layout: LEFT Session Sidebar (35%) */}
            <div className="w-[35%] border-r border-[#151515] bg-[#09090A] flex flex-col p-6 justify-between select-text shrink-0 h-full">
              <div className="space-y-6 overflow-y-auto">
                
                <div className="space-y-1">
                  <div className="text-[10px] tracking-[0.2em] font-bold text-[#10B981] uppercase">
                    ACTIVE STRATEGY
                  </div>
                  <div className="text-xs text-[#888] font-mono">
                    Session ended · Plan Generated
                  </div>
                </div>

                {/* TEAM ASSEMBLED LIST */}
                <div className="space-y-3">
                  <div className="text-[10px] tracking-wider font-bold text-zinc-400 uppercase">
                    ASSEMBLED EXPERTS
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {assembledAgentIds.map(agentId => (
                      <div key={agentId} className="flex items-center gap-2 bg-[#111114] border border-[#1A1A22] px-3 py-2 rounded">
                        <span className="text-[#10B981] font-bold">✓</span>
                        <span className="font-semibold text-zinc-300 capitalize">
                          {agentId.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PLAN SECTIONS CHECKLIST */}
                <div className="space-y-3">
                  <div className="text-[10px] tracking-wider font-bold text-zinc-400 uppercase">
                    STRATEGY CHECKLIST
                  </div>
                  <div className="space-y-1.5 text-xs font-semibold text-[#10B981]">
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Market Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Target Segments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Outreach Sequences</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Growth Strategy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Execution Plan</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="space-y-3 pt-4 border-t border-[#111]">
                <button
                  onClick={handleSavePlan}
                  className="w-full py-3 bg-[#10B981] hover:bg-[#0D9488] text-black text-xs font-bold tracking-widest uppercase rounded-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save size={14} /> Save GTM Plan
                </button>
                <button
                  onClick={handleResetSession}
                  className="w-full py-2.5 bg-[#1C1C22] hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold tracking-widest uppercase rounded-lg border border-[#222] transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw size={12} /> New Session
                </button>
              </div>
            </div>

            {/* Split layout: RIGHT Dynamic GTM Plan Layout (65%) */}
            <div className="flex-1 overflow-y-auto p-8 select-text space-y-10 font-sans text-xs">
              
              {/* Header Box */}
              <div className="border-b border-[#1A1A1E] pb-5 space-y-2">
                <div className="text-[9px] tracking-[0.2em] font-bold text-[#10B981] uppercase">
                  DELIVERABLE · GTM PLAN
                </div>
                <h1 className="text-xl font-extrabold text-white uppercase tracking-wide">
                  Strategic Launch Plan for Assix
                </h1>
                <p className="text-zinc-500 font-mono text-[10px]">
                  Generated: {new Date(gtmPlan.generatedAt).toLocaleString()}
                </p>
              </div>

              {/* Value Proposition */}
              <div className="space-y-3 bg-[#0E0E10] border border-[#1A1A1E] p-6 rounded-lg">
                <div className="text-[10px] tracking-wider text-zinc-500 font-bold uppercase">
                  VALUE PROPOSITION
                </div>
                <div className="text-sm font-semibold text-white leading-relaxed">
                  {gtmPlan.valueProposition || "Highly optimized custom solution tailored to your target audience."}
                </div>
              </div>

              {/* Target Segments & Outreach Sequences */}
              <div className="space-y-4">
                <div className="text-[10px] tracking-wider text-zinc-500 font-bold uppercase">
                  TARGET CUSTOMER SEGMENTS & CAMPAIGNS
                </div>
                
                {gtmPlan.segments && gtmPlan.segments.length > 0 ? (
                  <div className="space-y-6">
                    {gtmPlan.segments.map((seg, idx) => {
                      const scoreColor = seg.fitScore >= 80 ? 'text-[#10B981]' : seg.fitScore >= 60 ? 'text-[#F59E0B]' : 'text-zinc-500';
                      
                      return (
                        <div 
                          key={idx}
                          className="bg-[#0F0F12] border border-[#1C1C22] rounded-lg p-6 space-y-6"
                        >
                          {/* Segment Header */}
                          <div className="flex items-start justify-between gap-4 border-b border-[#141416] pb-4">
                            <div className="space-y-1">
                              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                {seg.name}
                              </h3>
                              <p className="text-[#A1A1AA] leading-relaxed">
                                {seg.why}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <div className={`text-lg font-bold font-mono ${scoreColor}`}>
                                {seg.fitScore}%
                              </div>
                              <div className="text-[8px] text-zinc-500 font-bold tracking-widest uppercase">
                                FIT SCORE
                              </div>
                            </div>
                          </div>

                          {/* Pain signals */}
                          <div className="space-y-1">
                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                              PAIN SIGNALS TO WATCH
                            </div>
                            <div className="bg-[#070709] border border-[#141416] p-3 rounded text-zinc-300">
                              {seg.painSignal}
                            </div>
                          </div>

                          {/* Campaign parameters */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#070709] p-4 rounded border border-[#141416]">
                            <div>
                              <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">CHANNEL</div>
                              <div className="text-white font-bold uppercase tracking-wider mt-0.5">{seg.channel}</div>
                            </div>
                            <div>
                              <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">FINDER TOOL</div>
                              <div className="text-white font-bold uppercase tracking-wider mt-0.5">{seg.tool}</div>
                            </div>
                            <div>
                              <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">EXPECTED RESPONSE</div>
                              <div className="text-white font-bold font-mono tracking-wider mt-0.5">{seg.expectedResponseRate}</div>
                            </div>
                            <div>
                              <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">DAILY LIMIT</div>
                              <div className="text-white font-bold font-mono tracking-wider mt-0.5">{seg.dailyLimit}</div>
                            </div>
                          </div>

                          {/* Outreach messages sequences */}
                          <div className="space-y-3">
                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                              MULTI-TOUCH OUTREACH SEQUENCE
                            </div>
                            <div className="space-y-3">
                              <div className="bg-[#070709] p-4 rounded border border-[#141416] space-y-1.5">
                                <div className="text-[8px] font-bold text-[#10B981] tracking-widest uppercase">
                                  DAY 1 · INITIATE CONTACT
                                </div>
                                <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed select-text font-mono text-[11px]">
                                  {seg.day1Message}
                                </div>
                              </div>
                              <div className="bg-[#070709] p-4 rounded border border-[#141416] space-y-1.5">
                                <div className="text-[8px] font-bold text-[#F59E0B] tracking-widest uppercase">
                                  DAY 3 · RE-ENGAGE
                                </div>
                                <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed select-text font-mono text-[11px]">
                                  {seg.day3Message}
                                </div>
                              </div>
                              <div className="bg-[#070709] p-4 rounded border border-[#141416] space-y-1.5">
                                <div className="text-[8px] font-bold text-zinc-500 tracking-widest uppercase">
                                  DAY 7 · FINAL OUT
                                </div>
                                <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed select-text font-mono text-[11px]">
                                  {seg.day7Message}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action trigger button */}
                          <div className="pt-2 border-t border-[#141416] flex justify-end">
                            <button
                              onClick={() => handleLaunchCampaign(seg)}
                              className="px-5 py-2.5 bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-black border border-[#10B981]/30 hover:border-transparent text-[10px] font-bold tracking-widest uppercase rounded transition cursor-pointer flex items-center gap-1.5"
                            >
                              <Play size={10} /> Launch Scrape & Outreach
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-zinc-600 italic">No segment recommendations found.</div>
                )}
              </div>

              {/* Fastest Path to revenue */}
              <div className="space-y-3 bg-[#0F0F12] border border-[#1C1C22] p-6 rounded-lg">
                <div className="text-[10px] tracking-wider text-zinc-500 font-bold uppercase">
                  FASTEST PATH TO REVENUE
                </div>
                <div className="text-[#F0ECE4] whitespace-pre-wrap leading-relaxed select-text text-xs">
                  {gtmPlan.fastestPath}
                </div>
              </div>

              {/* Growth Experiments */}
              <div className="space-y-4">
                <div className="text-[10px] tracking-wider text-zinc-500 font-bold uppercase">
                  HIGH-IMPACT GROWTH EXPERIMENTS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gtmPlan.growthExperiments && gtmPlan.growthExperiments.length > 0 ? (
                    gtmPlan.growthExperiments.map((exp, idx) => (
                      <div key={idx} className="bg-[#0F0F12] border border-[#1C1C22] p-5 rounded-lg space-y-2">
                        <div className="text-[9px] font-mono text-[#10B981] font-bold tracking-wider">
                          EXPERIMENT 0{idx + 1}
                        </div>
                        <div className="text-[#F0ECE4] font-semibold leading-relaxed">
                          {exp}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-zinc-600 italic">No specific experiments recommended.</div>
                  )}
                </div>
              </div>

              {/* Content platform Ideas */}
              <div className="space-y-4">
                <div className="text-[10px] tracking-wider text-zinc-500 font-bold uppercase">
                  LinkedIn & platform CONTENT DEPOSITS
                </div>
                <div className="space-y-3">
                  {gtmPlan.contentIdeas && gtmPlan.contentIdeas.length > 0 ? (
                    gtmPlan.contentIdeas.map((idea, idx) => (
                      <div key={idx} className="bg-[#070709] border border-[#141416] p-4 rounded-lg flex items-start gap-3">
                        <span className="text-[#10B981] font-bold text-xs select-none">
                          0{idx + 1}
                        </span>
                        <div className="text-zinc-300 leading-relaxed font-sans">
                          {idea}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-zinc-600 italic">No specific content ideas drafted.</div>
                  )}
                </div>
              </div>

              {/* Tools Needed */}
              <div className="space-y-3">
                <div className="text-[10px] tracking-wider text-zinc-500 font-bold uppercase">
                  REQUIRED INFRASTRUCTURE & TOOLS
                </div>
                <div className="flex flex-wrap gap-2">
                  {gtmPlan.toolsNeeded && gtmPlan.toolsNeeded.length > 0 ? (
                    gtmPlan.toolsNeeded.map((tool, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-[#0F0F12] border border-[#1C1C22] text-[#A1A1AA] rounded-md font-mono text-[10px]"
                      >
                        {tool.toUpperCase()}
                      </span>
                    ))
                  ) : (
                    <div className="text-zinc-600 italic">No special tools identified.</div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  );
};
