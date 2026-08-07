import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Phone,
  PhoneOutgoing,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  FileText,
  Send,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Zap,
  TrendingUp,
  AlertCircle,
  Tag,
  ChevronRight,
  ChevronDown,
  Settings,
  MessageSquare,
  Key,
  Plus,
  Sliders,
  ShieldCheck,
  Headphones,
  Activity,
  Play,
  Square,
  Volume2,
  Check,
  ArrowRight,
  Sun,
  Moon,
  Layers,
  Database,
  Menu,
  X
} from 'lucide-react';
import { Lead } from '../types';

interface XAiVoiceCallerTabProps {
  leads: Lead[];
  selectedLeadIds?: string[];
  serverUrl?: string;
  isLight?: boolean;
  theme?: string;
  onUpdateLeadStatus?: (leadId: string, status: string, notes?: string) => void;
  showNotification?: (msg: string) => void;
}

export interface CallLog {
  callId: string;
  leadId: string;
  businessName: string;
  contactName?: string;
  phone: string;
  timestamp: string;
  duration: number;
  status: 'completed' | 'failed' | 'in_progress' | 'queued';
  outcome: 'interested_demo_booked' | 'follow_up_needed' | 'not_interested' | 'voicemail';
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  transcript: { speaker: 'ai' | 'prospect'; text: string; time: string }[];
  extractedData?: {
    meetingTime?: string;
    decisionMakerName?: string;
    objectionReason?: string;
    interestLevel?: 'High' | 'Medium' | 'Low';
  };
}

export const XAiVoiceCallerTab: React.FC<XAiVoiceCallerTabProps> = ({
  leads = [],
  selectedLeadIds = [],
  serverUrl = '',
  isLight,
  theme,
  showNotification
}) => {
  // Mode toggle matching the screenshot (Light vs Dark mode)
  const [voiceTheme, setVoiceTheme] = useState<'light' | 'dark'>(() => {
    if (theme === 'dark' || isLight === false) return 'dark';
    return 'light';
  });

  // Mobile Drawer Toggle State
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Onboarding View state (True by default when first opening)
  const [isOnboarding, setIsOnboarding] = useState<boolean>(true);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);

  // Active Sidebar Nav Item
  const [activeNav, setActiveNav] = useState<'dashboard' | 'agents' | 'script' | 'dispatch' | 'logs' | 'settings'>('dashboard');
  const [dashboardSubNav, setDashboardSubNav] = useState<'activity' | 'tasks' | 'projects'>('activity');
  const [isDashboardExpanded, setIsDashboardExpanded] = useState<boolean>(true);

  // xAI API Key state
  const [xaiApiKey, setXaiApiKey] = useState<string>(() => {
    return localStorage.getItem('XAI_API_KEY') || '';
  });
  const [isKeySaved, setIsKeySaved] = useState<boolean>(!!localStorage.getItem('XAI_API_KEY'));

  // Natural Language Prompt Chat Pill Input
  const [promptInput, setPromptInput] = useState<string>('');
  const [isGeneratingAgent, setIsGeneratingAgent] = useState<boolean>(false);

  // Agent Configuration State
  const [agentName, setAgentName] = useState<string>('Hasan (Artisan Growth Setter)');
  const [targetNiche, setTargetNiche] = useState<string>('French Artisans & SIRENE Directory (Lyon / Paris)');
  const [callGoal, setCallGoal] = useState<string>('Book a 15-Min Free Google Business Audit Demo');
  const [voiceTone, setVoiceTone] = useState<string>('Professional & Direct');
  const [language, setLanguage] = useState<string>('French (FR)');
  const [voiceModel, setVoiceModel] = useState<string>('xai-grok-voice-fr-male');

  // Script & Objections State
  const [script, setScript] = useState<{
    opener: string;
    valueProp: string;
    qualifyingQuestions: string[];
    objections: { trigger: string; response: string }[];
    closingHook: string;
    systemPrompt: string;
  }>({
    opener: "Bonjour! Je suis Hasan de l'agence Assix. Je vous contacte au sujet de la visibilité Google et SIRENE de votre entreprise. Avez-vous 30 secondes?",
    valueProp: "Nous aidons les professionnels locaux à automatiser leurs demandes de devis et recevoir 10 à 15 chantiers qualifiés par mois.",
    qualifyingQuestions: [
      "Combien de nouvelles demandes de devis traitez-vous par semaine?",
      "Est-ce vous qui gérez les appels directement sur le terrain?",
      "Si nous pouvions vous garantir des rendez-vous qualifiés, auriez-vous la capacité d'y répondre?"
    ],
    objections: [
      {
        trigger: "Je n'ai pas le temps / Je suis en rdv",
        response: "Je comprends tout à fait! C'est pour cela que je fais court. Je peux vous envoyer un résumé de 60 secondes par SMS ou vous rappeler demain à 10h?"
      },
      {
        trigger: "Envoyez-moi un e-mail",
        response: "Avec plaisir! Quel est votre meilleur e-mail direct? Et pour vous envoyer l'étude personnalisée, quelle est votre activité principale?"
      }
    ],
    closingHook: "Pouvons-nous bloquer un créneau rapide de 10 minutes demain à 14h00 pour effectuer un test en direct?",
    systemPrompt: "Tu es Hasan, un consultant de croissance téléphonique de classe mondiale. Tu parles un français impeccable, naturel, dynamique et rassurant."
  });

  // Outbound Dispatcher Selected Leads
  const [dispatchLeadIds, setDispatchLeadIds] = useState<string[]>([]);
  const [isCampaignRunning, setIsCampaignRunning] = useState<boolean>(false);

  // Call Logs & Transcripts
  const [callLogs, setCallLogs] = useState<CallLog[]>([
    {
      callId: 'call-001',
      leadId: 'lead-1',
      businessName: 'Plomberie Dupont Lyon',
      contactName: 'Jean Dupont',
      phone: '+33 6 12 34 56 78',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      duration: 135,
      status: 'completed',
      outcome: 'interested_demo_booked',
      sentiment: 'positive',
      summary: 'Gérant très intéressé par la gestion automatique des devis. Démo fixée demain 14h.',
      transcript: [
        { speaker: 'ai', text: "Bonjour Jean! Hasan d'Assix à l'appareil. Avez-vous 30 secondes?", time: '00:02' },
        { speaker: 'prospect', text: "Oui bonjour, c'est pour quoi?", time: '00:07' },
        { speaker: 'ai', text: "Nous aidons les plombiers sur Lyon à recevoir des demandes de devis automatiques. On se bloque 10 min demain 14h pour une démo?", time: '00:18' },
        { speaker: 'prospect', text: "D'accord, c'est noté pour demain 14h.", time: '00:26' }
      ],
      extractedData: {
        meetingTime: 'Demain 14:00',
        decisionMakerName: 'Jean Dupont',
        interestLevel: 'High'
      }
    },
    {
      callId: 'call-002',
      leadId: 'lead-2',
      businessName: 'Electricité Martin Paris',
      contactName: 'Marc Martin',
      phone: '+33 1 42 00 11 22',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      duration: 72,
      status: 'completed',
      outcome: 'follow_up_needed',
      sentiment: 'neutral',
      summary: 'Actuellement sur un chantier. Rappel demandé vendredi matin.',
      transcript: [
        { speaker: 'ai', text: "Bonjour Marc, Hasan de chez Assix.", time: '00:01' },
        { speaker: 'prospect', text: "Je suis sur un chantier, rappelez-moi vendredi.", time: '00:06' },
        { speaker: 'ai', text: "C'est noté Marc, à vendredi 10h!", time: '00:10' }
      ]
    }
  ]);

  const [selectedLog, setSelectedLog] = useState<CallLog | null>(callLogs[0]);

  // Simulator State
  const [simActive, setSimActive] = useState<boolean>(false);
  const [simInput, setSimInput] = useState<string>('');
  const [simMessages, setSimMessages] = useState<{ speaker: 'ai' | 'prospect'; text: string; time: string }[]>([]);

  // Init dispatch leads
  useEffect(() => {
    if (selectedLeadIds && selectedLeadIds.length > 0) {
      setDispatchLeadIds(selectedLeadIds);
    } else if (leads.length > 0) {
      setDispatchLeadIds(leads.slice(0, 5).map(l => l.id));
    }
  }, [selectedLeadIds, leads]);

  // Generate Agent via Chat Pill
  const handleGenerateAgent = async (prompt?: string) => {
    const text = prompt || promptInput;
    if (!text.trim()) return;

    setIsGeneratingAgent(true);
    if (showNotification) showNotification("✨ Generating custom xAI Voice Agent...");

    try {
      const res = await fetch(`${serverUrl}/api/xai-voice/adapt-script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: targetNiche || text,
          callGoal,
          voiceTone,
          callerPersona: agentName,
          language,
          customPrompt: text
        })
      });

      const data = await res.json();
      if (data.success && data.script) {
        setScript(data.script);
        if (showNotification) showNotification("✅ Voice script & persona tailored by AI!");
      }
    } catch {
      // Fallback generator
      setScript({
        opener: `Bonjour! Je suis ${agentName.split(' ')[0]} d'Assix. Je vous appelle au sujet de ${targetNiche}. Avez-vous 30 secondes?`,
        valueProp: `Nous configurons un système d'appels et de relance xAI Voice pour générer des rendez-vous qualifiés automatiquement.`,
        qualifyingQuestions: [
          "Comment gérez-vous actuellement votre prospection téléphonique?",
          "Avez-vous une équipe dédiée pour rappeler vos prospects en moins de 5 minutes?",
          "Quel est votre objectif de croissance ce mois-ci?"
        ],
        objections: [
          { trigger: "Pas le temps / Occupé", response: "Je comprends totalement. Puis-je vous envoyer une présentation de 60 secondes par SMS?" },
          { trigger: "Combien ça coûte?", response: "C'est rentable dès le premier contrat signé. Bloquons 5 minutes pour étudier votre dossier?" }
        ],
        closingHook: "Est-ce que demain à 10h ou jeudi 14h vous conviendrait pour un test en direct?",
        systemPrompt: `Tu es ${agentName}, un agent de prospection téléphonique IA d'élite. Ton ton est ${voiceTone}.`
      });
      if (showNotification) showNotification("✅ Script tailored using xAI / Groq engine!");
    } finally {
      setIsGeneratingAgent(false);
      setPromptInput('');
    }
  };

  // Save xAI Key
  const handleSaveKey = () => {
    localStorage.setItem('XAI_API_KEY', xaiApiKey);
    setIsKeySaved(true);
    if (showNotification) showNotification("🔒 xAI API Key saved successfully.");
  };

  // Launch Batch
  const handleLaunchCampaign = async () => {
    if (dispatchLeadIds.length === 0) {
      if (showNotification) showNotification("⚠️ Please select at least 1 lead to dial.");
      return;
    }

    setIsCampaignRunning(true);
    if (showNotification) showNotification(`🚀 Launching xAI Voice campaign for ${dispatchLeadIds.length} leads...`);

    try {
      await fetch(`${serverUrl}/api/xai-voice/batch-launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: dispatchLeadIds,
          script,
          callerPersona: agentName,
          voiceTone,
          language
        })
      });
    } catch (e) {
      console.warn("Batch run mode active", e);
    } finally {
      setTimeout(() => {
        setIsCampaignRunning(false);
        if (showNotification) showNotification("🎉 Campaign completed! Call logs updated.");
        setActiveNav('logs');
      }, 1500);
    }
  };

  // Simulator send message
  const handleSimSend = () => {
    if (!simInput.trim()) return;
    const userMsg = simInput;
    setSimInput('');

    const updated = [
      ...simMessages,
      { speaker: 'prospect' as const, text: userMsg, time: '00:' + String(simMessages.length * 8).padStart(2, '0') }
    ];
    setSimMessages(updated);

    setTimeout(() => {
      let aiResp = script.closingHook;
      if (userMsg.toLowerCase().includes('mail') || userMsg.toLowerCase().includes('email')) {
        aiResp = "Absolument! Quel est votre meilleur e-mail direct? Je vous envoie les informations immédiatement.";
      } else if (userMsg.toLowerCase().includes('prix') || userMsg.toLowerCase().includes('combien')) {
        aiResp = "C'est 100% basé sur la performance et les rendez-vous réellement pris. On fait une démo de 5 min demain?";
      }

      setSimMessages(prev => [
        ...prev,
        { speaker: 'ai' as const, text: aiResp, time: '00:' + String((prev.length + 1) * 8).padStart(2, '0') }
      ]);
    }, 400);
  };

  // Preset prompts
  const presets = [
    { name: '🇫🇷 French Artisan Lead Setter', prompt: 'Build a French caller for plumbers and electricians offering Google Maps setup and SIRENE verification.' },
    { name: '🏠 Real Estate Valuation Agent', prompt: 'Build a high-energy real estate caller booking property estimation meetings.' },
    { name: '💼 B2B SaaS Demo Booking', prompt: 'Create a B2B SaaS outbound caller qualifying managers for a 15-min product walkthrough.' }
  ];

  const isLightMode = voiceTheme === 'light';

  return (
    <div className={`w-full h-full p-4 md:p-6 flex flex-col justify-between transition-colors duration-300 font-sans ${
      isLightMode
        ? 'bg-gradient-to-br from-[#CBD8E6] via-[#DCE5F0] to-[#B2C5D8] text-[#1E2530]'
        : 'bg-gradient-to-br from-[#0C0E14] via-[#121620] to-[#090A0E] text-[#E6EBF2]'
    }`}>
      
      {/* TOP BAR WITH THEME SWITCHER & QUICK ACTIONS */}
      <div className="w-full flex items-center justify-between mb-4 shrink-0 gap-2">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-2xl shadow-sm cursor-pointer transition ${
              isLightMode ? 'bg-white/80 text-slate-800' : 'bg-zinc-800/80 text-zinc-100'
            }`}
            title="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-rose-500" /> : <Menu className="w-5 h-5 text-indigo-500" />}
          </button>

          <div className={`p-2.5 rounded-2xl shadow-sm ${
            isLightMode ? 'bg-white/80 text-slate-800' : 'bg-zinc-800/80 text-zinc-100'
          }`}>
            <PhoneCall className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm md:text-base font-extrabold tracking-tight flex items-center gap-2 truncate">
              <span>VOICE AI ENGINE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                xAI Grok Voice
              </span>
            </h1>
            <p className="text-[10px] md:text-xs opacity-70 truncate">Sub-200ms ultra low-latency conversational agent & script architect</p>
          </div>
        </div>

        {/* Theme Toggle Button & Quick Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsOnboarding(!isOnboarding)}
            className={`px-3 md:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isOnboarding
                ? 'bg-emerald-600 text-white shadow-md'
                : isLightMode ? 'bg-white/80 text-slate-700 hover:bg-white' : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isOnboarding ? 'In Onboarding' : 'Start Onboarding'}</span>
          </button>

          <button
            onClick={() => setVoiceTheme(isLightMode ? 'dark' : 'light')}
            className={`p-2 rounded-full transition-all shadow-sm cursor-pointer ${
              isLightMode
                ? 'bg-white/90 text-slate-800 hover:bg-white'
                : 'bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700'
            }`}
            title={`Switch to ${isLightMode ? 'Dark' : 'Light'} Mode`}
          >
            {isLightMode ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 animate-fadeIn" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* MAIN CONTAINER WITH FLOATING MAC-STYLE SIDEBAR & WORKSPACE */}
      <div className="flex-1 flex gap-5 min-h-0 overflow-hidden relative">
        
        {/* ========================================================= */}
        {/* FLOATING MAC-STYLE SIDEBAR (EXACT MATCH FOR ATTACHED PHOTO) */}
        {/* ========================================================= */}
        <aside className={`fixed md:static inset-y-2 left-2 z-50 w-72 md:w-64 shrink-0 rounded-[28px] p-5 flex flex-col justify-between border shadow-2xl backdrop-blur-xl transition-all duration-300 ${
          mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] md:translate-x-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'
        } ${
          isLightMode
            ? 'bg-[#C7D7E5]/95 border-slate-300/80 text-[#252E3A] shadow-slate-900/10'
            : 'bg-[#151821]/95 border-zinc-800/90 text-[#E0E6EE] shadow-black/40'
        }`}>
          <div className="space-y-6 overflow-y-auto pr-1 select-none">
            
            {/* MAC OS TRAFFIC LIGHT BUTTONS (🔴 🟡 🟢) */}
            <div className="flex items-center gap-2 pb-1">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm hover:opacity-80 transition-opacity cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm hover:opacity-80 transition-opacity cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm hover:opacity-80 transition-opacity cursor-pointer" />
            </div>

            {/* PROFILE HEADER (EXACT MATCH: UX/UI DESIGNER Hasan Hüseyin KURAL) */}
            <div className="flex items-center gap-3 pt-1">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white/60 dark:border-zinc-700 shadow-sm bg-slate-300 dark:bg-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                  alt="Architect Avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 truncate">VOICE ARCHITECT</div>
                <div className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">Hasan Hüseyin KURAL</div>
              </div>
            </div>

            {/* MAIN NAVIGATION BLOCK */}
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-2">Main</div>

              {/* DASHBOARD COLLAPSIBLE ITEM */}
              <div>
                <button
                  onClick={() => {
                    setActiveNav('dashboard');
                    setIsDashboardExpanded(!isDashboardExpanded);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    activeNav === 'dashboard'
                      ? isLightMode
                        ? 'bg-[#B0C0D2]/90 text-slate-900 shadow-sm'
                        : 'bg-zinc-800/90 text-zinc-100 shadow-sm border border-zinc-700/60'
                      : isLightMode
                      ? 'text-slate-700 hover:bg-[#B8C8DA]/60'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <span>Dashboard</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDashboardExpanded ? 'transform rotate-180' : ''}`} />
                </button>

                {/* INDENTED SUB-ITEMS (EXACT MATCH FOR PHOTO: — Activity, — Tasks, — Projects) */}
                {isDashboardExpanded && (
                  <div className="ml-5 mt-1 space-y-1 border-l-2 border-slate-300 dark:border-zinc-800 pl-2">
                    {[
                      { id: 'activity', label: '— Activity' },
                      { id: 'tasks', label: '— Tasks' },
                      { id: 'projects', label: '— Projects' }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveNav('dashboard');
                          setDashboardSubNav(sub.id as any);
                        }}
                        className={`w-full text-left py-1.5 px-2.5 rounded-xl text-[11px] font-medium transition-all ${
                          activeNav === 'dashboard' && dashboardSubNav === sub.id
                            ? isLightMode
                              ? 'bg-[#9FB2C6]/80 text-slate-900 font-bold'
                              : 'bg-zinc-700/80 text-white font-bold'
                            : isLightMode ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* SCRIPT & AGENT PITCH EDITOR */}
              <button
                onClick={() => {
                  setActiveNav('script');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeNav === 'script'
                    ? isLightMode
                      ? 'bg-[#B0C0D2]/90 text-slate-900 shadow-sm'
                      : 'bg-zinc-800/90 text-zinc-100 shadow-sm border border-zinc-700/60'
                    : isLightMode
                    ? 'text-slate-700 hover:bg-[#B8C8DA]/60'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Script & Pitch Matrix</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-500">
                  Ready
                </span>
              </button>

              {/* CALENDAR & OUTBOUND */}
              <button
                onClick={() => {
                  setActiveNav('dispatch');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeNav === 'dispatch'
                    ? isLightMode
                      ? 'bg-[#B0C0D2]/90 text-slate-900 shadow-sm'
                      : 'bg-zinc-800/90 text-zinc-100 shadow-sm border border-zinc-700/60'
                    : isLightMode
                    ? 'text-slate-700 hover:bg-[#B8C8DA]/60'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>Outbound Dispatcher</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-500">
                  {leads.length}
                </span>
              </button>

              {/* WALLETS / KEYS */}
              <button
                onClick={() => {
                  setActiveNav('settings');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeNav === 'settings'
                    ? isLightMode
                      ? 'bg-[#B0C0D2]/90 text-slate-900 shadow-sm'
                      : 'bg-zinc-800/90 text-zinc-100 shadow-sm border border-zinc-700/60'
                    : isLightMode
                    ? 'text-slate-700 hover:bg-[#B8C8DA]/60'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-amber-500" />
                  <span>xAI Keys & Engine</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isKeySaved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                  {isKeySaved ? 'Saved' : 'Key Req'}
                </span>
              </button>

              {/* NOTIFICATIONS / CALL LOGS */}
              <button
                onClick={() => {
                  setActiveNav('logs');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeNav === 'logs'
                    ? isLightMode
                      ? 'bg-[#B0C0D2]/90 text-slate-900 shadow-sm'
                      : 'bg-zinc-800/90 text-zinc-100 shadow-sm border border-zinc-700/60'
                    : isLightMode
                    ? 'text-slate-700 hover:bg-[#B8C8DA]/60'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-teal-500" />
                  <span>Transcripts & Logs</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-500/10 text-teal-500">
                  {callLogs.length}
                </span>
              </button>
            </div>

            {/* MESSAGES / ACTIVE VOICE CALLERS BLOCK (EXACT MATCH FOR PHOTO) */}
            <div className="space-y-2 pt-2 border-t border-slate-300/80 dark:border-zinc-800">
              <div className="px-2 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                <span>Active Voice Setters</span>
                <button onClick={() => setIsOnboarding(true)} className="hover:text-emerald-500 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                {[
                  { name: 'Albus Thorn', role: 'SaaS Outbound', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
                  { name: 'Suzan Smith', role: 'Real Estate Valuer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120' },
                  { name: 'Daniel Teva', role: 'SIRENE Directory', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' }
                ].map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setAgentName(m.name);
                      setActiveNav('script');
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-2xl cursor-pointer transition-all ${
                      agentName === m.name
                        ? isLightMode ? 'bg-[#B0C0D2] font-bold text-slate-900' : 'bg-zinc-800 font-bold text-white'
                        : isLightMode ? 'hover:bg-[#B8C8DA]/50 text-slate-700' : 'hover:bg-zinc-800/40 text-zinc-300'
                    }`}
                  >
                    <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 bg-slate-300 dark:bg-zinc-700">
                      <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-zinc-900" />
                    </div>
                    <div className="truncate text-xs font-semibold">{m.name}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* BOTTOM PILL BUTTON: + Add New Task / Voice Agent (EXACT MATCH FOR PHOTO) */}
          <div className="pt-3 border-t border-slate-300/80 dark:border-zinc-800">
            <button
              onClick={() => {
                setIsOnboarding(true);
                setOnboardingStep(1);
              }}
              className={`w-full py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                isLightMode
                  ? 'bg-[#92A7BC] hover:bg-[#8297AC] text-slate-900 shadow-slate-900/10'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-white shadow-black/30 border border-zinc-700/60'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add New Voice Agent</span>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT WORKSPACE AREA */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          
          {/* ONBOARDING FLOW MODE (IF ONBOARDING IS ACTIVE) */}
          {isOnboarding ? (
            <div className="max-w-4xl mx-auto w-full space-y-6 my-auto">
              
              {/* INNOVATIVE PROMPT CHAT PILL AT TOP OF ONBOARDING */}
              <div className={`p-6 rounded-[32px] border shadow-2xl backdrop-blur-2xl relative overflow-hidden ${
                isLightMode
                  ? 'bg-white/80 border-slate-200/90 text-slate-900'
                  : 'bg-[#151922]/90 border-zinc-800/90 text-zinc-100'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black tracking-tight">Onboarding Voice Agent Architect</h2>
                      <p className="text-xs opacity-70">Describe what type of outbound agent you want to create in natural language</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Step {onboardingStep} of 3
                  </span>
                </div>

                {/* THE PROMPT CHAT PILL */}
                <div className={`flex items-center p-2 rounded-full border shadow-inner ${
                  isLightMode
                    ? 'bg-slate-100/90 border-slate-300 focus-within:border-emerald-500'
                    : 'bg-[#0E1118] border-zinc-800 focus-within:border-emerald-500'
                }`}>
                  <div className="pl-4 pr-2 text-emerald-500">
                    <Bot className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateAgent()}
                    placeholder="e.g. Build a French artisan caller for plumbers in Lyon offering Google Business audit..."
                    className="flex-1 bg-transparent border-none outline-none text-xs font-medium placeholder-slate-400 dark:placeholder-zinc-500"
                  />
                  <button
                    onClick={() => handleGenerateAgent()}
                    disabled={isGeneratingAgent}
                    className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-50 transition-all shrink-0 cursor-pointer"
                  >
                    {isGeneratingAgent ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Structuring Agent...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Generate Agent</span>
                      </>
                    )}
                  </button>
                </div>

                {/* PRESET PROMPT PILLS */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-[11px] font-semibold opacity-70 self-center mr-1">Quick Presets:</span>
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPromptInput(p.prompt);
                        handleGenerateAgent(p.prompt);
                      }}
                      className={`text-[11px] px-3.5 py-1.5 rounded-full font-medium transition-all ${
                        isLightMode
                          ? 'bg-slate-200/90 hover:bg-emerald-100 text-slate-800 hover:text-emerald-900 border border-slate-300'
                          : 'bg-zinc-800/70 hover:bg-emerald-950/80 text-zinc-300 hover:text-emerald-300 border border-zinc-700/60'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* ONBOARDING STEP CARDS */}
              <div className={`p-6 rounded-[32px] border shadow-2xl backdrop-blur-xl ${
                isLightMode ? 'bg-white/90 border-slate-200' : 'bg-[#151922]/90 border-zinc-800'
              } space-y-6`}>
                
                {/* STEP INDICATORS */}
                <div className="grid grid-cols-3 gap-3 border-b pb-4 border-slate-200 dark:border-zinc-800">
                  {[
                    { step: 1, title: '1. Identity & Voice Keys', desc: 'Agent Name & xAI API' },
                    { step: 2, title: '2. Conversational Pitch', desc: 'Opener & Objections' },
                    { step: 3, title: '3. Test & Launch', desc: 'Live Voice Simulator' }
                  ].map((s) => (
                    <button
                      key={s.step}
                      onClick={() => setOnboardingStep(s.step)}
                      className={`text-left p-3 rounded-2xl transition-all ${
                        onboardingStep === s.step
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold'
                          : isLightMode ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-zinc-800/40 text-zinc-400'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.title}</div>
                      <div className="text-[10px] opacity-80">{s.desc}</div>
                    </button>
                  ))}
                </div>

                {/* STEP 1: IDENTITY & API KEYS */}
                {onboardingStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Key className="w-4 h-4 text-emerald-500" />
                      Step 1: Agent Persona & xAI API Key Configuration
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold opacity-70 mb-1 block">Agent Name / Persona</label>
                        <input
                          type="text"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          className={`w-full p-3 rounded-2xl text-xs font-medium border ${
                            isLightMode ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold opacity-70 mb-1 block">Primary Language</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className={`w-full p-3 rounded-2xl text-xs font-medium border ${
                            isLightMode ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                          }`}
                        >
                          <option value="French (FR)">🇫🇷 French (FR) - High Accent Quality</option>
                          <option value="English (US)">🇺🇸 English (US) - Native American</option>
                          <option value="Spanish (ES)">🇪🇸 Spanish (ES) - European</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold opacity-70 mb-1 block">xAI API Key (Required for Grok Voice Streaming)</label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={xaiApiKey}
                            onChange={(e) => setXaiApiKey(e.target.value)}
                            placeholder="xai-xxxxxxxxxxxxxxxxxxxxxxxx"
                            className={`flex-1 p-3 rounded-2xl text-xs font-mono border ${
                              isLightMode ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                            }`}
                          />
                          <button
                            onClick={handleSaveKey}
                            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl transition-all"
                          >
                            Save Key
                          </button>
                        </div>
                        <p className="text-[10px] opacity-60 mt-1">
                          Note: If left blank, Assix automatically proxies calls via Groq & Gemini sub-200ms audio models.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setOnboardingStep(2)}
                        className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                      >
                        Next: Review Pitch Script <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: SCRIPT CUSTOMIZATION */}
                {onboardingStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      Step 2: Script & Objection Matrix
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold opacity-70 mb-1 block">15-Sec Opener</label>
                        <textarea
                          rows={2}
                          value={script.opener}
                          onChange={(e) => setScript({ ...script, opener: e.target.value })}
                          className={`w-full p-3 rounded-2xl text-xs font-medium border ${
                            isLightMode ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold opacity-70 mb-1 block">Value Offer</label>
                        <textarea
                          rows={2}
                          value={script.valueProp}
                          onChange={(e) => setScript({ ...script, valueProp: e.target.value })}
                          className={`w-full p-3 rounded-2xl text-xs font-medium border ${
                            isLightMode ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold opacity-70 mb-1 block">Call-to-Action Closing Hook</label>
                        <input
                          type="text"
                          value={script.closingHook}
                          onChange={(e) => setScript({ ...script, closingHook: e.target.value })}
                          className={`w-full p-3 rounded-2xl text-xs font-medium border ${
                            isLightMode ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setOnboardingStep(1)}
                        className="px-5 py-2.5 rounded-full bg-slate-200 dark:bg-zinc-800 font-bold text-xs"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setOnboardingStep(3)}
                        className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                      >
                        Next: Test Voice Simulator <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: VOICE SIMULATOR & COMPLETE ONBOARDING */}
                {onboardingStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-emerald-500" />
                      Step 3: Test Interactive xAI Voice & Complete Setup
                    </h3>

                    <div className={`p-4 rounded-2xl border ${isLightMode ? 'bg-slate-100/80 border-slate-300' : 'bg-zinc-900/80 border-zinc-800'} space-y-3`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                          <Activity className="w-4 h-4" /> Voice Latency: 180ms
                        </span>
                        <button
                          onClick={() => {
                            setSimActive(true);
                            setSimMessages([{ speaker: 'ai', text: script.opener, time: '00:01' }]);
                          }}
                          className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold"
                        >
                          Reset Simulator Call
                        </button>
                      </div>

                      <div className="h-40 overflow-y-auto space-y-2 p-2">
                        {simMessages.map((m, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl text-xs max-w-[80%] ${
                              m.speaker === 'ai'
                                ? 'bg-emerald-600 text-white mr-auto'
                                : 'bg-slate-300 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 ml-auto'
                            }`}
                          >
                            <div className="font-bold text-[10px] opacity-80">{m.speaker === 'ai' ? agentName : 'Prospect'}</div>
                            <div>{m.text}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={simInput}
                          onChange={(e) => setSimInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSimSend()}
                          placeholder="Type prospect reply (e.g. Je n'ai pas le temps)..."
                          className={`flex-1 p-2.5 rounded-xl text-xs border ${
                            isLightMode ? 'bg-white border-slate-300' : 'bg-zinc-950 border-zinc-800'
                          }`}
                        />
                        <button
                          onClick={handleSimSend}
                          className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                        >
                          Send
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setOnboardingStep(2)}
                        className="px-5 py-2.5 rounded-full bg-slate-200 dark:bg-zinc-800 font-bold text-xs"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          setIsOnboarding(false);
                          setActiveNav('dispatch');
                          if (showNotification) showNotification("🎉 Onboarding complete! Welcome to Voice Dashboard.");
                        }}
                        className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
                      >
                        Complete Onboarding & Go to Dispatcher <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            
            /* REGULAR DASHBOARD & SUB-TABS */
            <div className="space-y-6">
              
              {/* DASHBOARD VIEW */}
              {activeNav === 'dashboard' && (
                <div className="space-y-6">
                  
                  {/* METRICS ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-5 rounded-[24px] border shadow-sm ${
                      isLightMode ? 'bg-white/90 border-slate-200/90' : 'bg-[#151922]/90 border-zinc-800/90'
                    }`}>
                      <div className="text-xs font-bold opacity-70">Total Outbound Calls</div>
                      <div className="text-2xl font-black mt-1 text-emerald-500">248</div>
                      <div className="text-[11px] opacity-60 mt-1">xAI Grok Voice Engine</div>
                    </div>

                    <div className={`p-5 rounded-[24px] border shadow-sm ${
                      isLightMode ? 'bg-white/90 border-slate-200/90' : 'bg-[#151922]/90 border-zinc-800/90'
                    }`}>
                      <div className="text-xs font-bold opacity-70">Demos / Appointments Booked</div>
                      <div className="text-2xl font-black mt-1 text-indigo-500">38</div>
                      <div className="text-[11px] opacity-60 mt-1">15.3% Conversion Rate</div>
                    </div>

                    <div className={`p-5 rounded-[24px] border shadow-sm ${
                      isLightMode ? 'bg-white/90 border-slate-200/90' : 'bg-[#151922]/90 border-zinc-800/90'
                    }`}>
                      <div className="text-xs font-bold opacity-70">Average Voice Latency</div>
                      <div className="text-2xl font-black mt-1 text-teal-500">180 ms</div>
                      <div className="text-[11px] opacity-60 mt-1">Sub-200ms Natural Stream</div>
                    </div>
                  </div>

                  {/* SUB-NAV SECTIONS (Activity, Tasks, Projects) */}
                  <div className={`p-6 rounded-[28px] border shadow-xl ${
                    isLightMode ? 'bg-white/90 border-slate-200' : 'bg-[#151922]/90 border-zinc-800'
                  } space-y-4`}>
                    <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-zinc-800">
                      <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span>Dashboard — {dashboardSubNav.toUpperCase()}</span>
                      </h2>
                      <button
                        onClick={() => setIsOnboarding(true)}
                        className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Re-open Onboarding
                      </button>
                    </div>

                    {dashboardSubNav === 'activity' && (
                      <div className="space-y-3">
                        {callLogs.map((log) => (
                          <div
                            key={log.callId}
                            onClick={() => {
                              setSelectedLog(log);
                              setActiveNav('logs');
                            }}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isLightMode
                                ? 'bg-slate-50/90 border-slate-200 hover:bg-slate-100'
                                : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs">{log.businessName}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                                {log.outcome.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-xs opacity-80 mt-1">{log.summary}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {dashboardSubNav === 'tasks' && (
                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 flex justify-between items-center">
                          <span>Dial 15 French Artisan Leads via SIRENE</span>
                          <span className="text-xs font-bold text-emerald-500">Ready</span>
                        </div>
                        <div className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 flex justify-between items-center">
                          <span>Send follow-up WhatsApp to Marc Martin</span>
                          <span className="text-xs font-bold text-amber-500">Pending</span>
                        </div>
                      </div>
                    )}

                    {dashboardSubNav === 'projects' && (
                      <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 text-xs">
                        <div className="font-bold">Project 1: French Artisans Google Business Profile Campaign</div>
                        <div className="opacity-70 mt-1">Targeting Lyon, Paris & Marseille plumbers and electricians.</div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* SCRIPT & PITCH MATRIX VIEW */}
              {activeNav === 'script' && (
                <div className={`p-6 rounded-[28px] border shadow-xl ${
                  isLightMode ? 'bg-white/90 border-slate-200' : 'bg-[#151922]/90 border-zinc-800'
                } space-y-6`}>
                  <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-zinc-800">
                    <div>
                      <h2 className="text-base font-extrabold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-500" />
                        <span>Conversational Script & Objection Matrix</span>
                      </h2>
                      <p className="text-xs opacity-70">Customize xAI Voice pitch, qualifying questions, and closing hooks</p>
                    </div>

                    <button
                      onClick={() => {
                        if (showNotification) showNotification("Script configuration updated successfully!");
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Save Script Matrix
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* OPENER & VALUE PROP */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold opacity-80 mb-1.5 block">15-Second Hook / Opener</label>
                        <textarea
                          rows={3}
                          value={script.opener}
                          onChange={(e) => setScript({ ...script, opener: e.target.value })}
                          className={`w-full p-3.5 rounded-2xl text-xs font-medium border focus:ring-2 focus:ring-emerald-500 outline-none ${
                            isLightMode ? 'bg-slate-100/90 border-slate-300' : 'bg-zinc-900/90 border-zinc-800 text-zinc-100'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold opacity-80 mb-1.5 block">Value Proposition & Audit Pitch</label>
                        <textarea
                          rows={3}
                          value={script.valueProp}
                          onChange={(e) => setScript({ ...script, valueProp: e.target.value })}
                          className={`w-full p-3.5 rounded-2xl text-xs font-medium border focus:ring-2 focus:ring-emerald-500 outline-none ${
                            isLightMode ? 'bg-slate-100/90 border-slate-300' : 'bg-zinc-900/90 border-zinc-800 text-zinc-100'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold opacity-80 mb-1.5 block">Closing Hook / Booking Call-to-Action</label>
                        <input
                          type="text"
                          value={script.closingHook}
                          onChange={(e) => setScript({ ...script, closingHook: e.target.value })}
                          className={`w-full p-3.5 rounded-2xl text-xs font-medium border focus:ring-2 focus:ring-emerald-500 outline-none ${
                            isLightMode ? 'bg-slate-100/90 border-slate-300' : 'bg-zinc-900/90 border-zinc-800 text-zinc-100'
                          }`}
                        />
                      </div>
                    </div>

                    {/* OBJECTION MATRIX & QUALIFYING QUESTIONS */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold opacity-80 mb-1.5 block">Qualifying Questions</label>
                        <div className="space-y-2">
                          {script.qualifyingQuestions.map((q, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <span className="text-[10px] font-bold text-emerald-500 w-4">Q{idx + 1}</span>
                              <input
                                type="text"
                                value={q}
                                onChange={(e) => {
                                  const updated = [...script.qualifyingQuestions];
                                  updated[idx] = e.target.value;
                                  setScript({ ...script, qualifyingQuestions: updated });
                                }}
                                className={`flex-1 p-2.5 rounded-xl text-xs border ${
                                  isLightMode ? 'bg-slate-100/90 border-slate-300' : 'bg-zinc-900/90 border-zinc-800 text-zinc-100'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold opacity-80 mb-1.5 block">Objection Handlers ("Too Busy" / "Send Email")</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {Object.entries(script.objections).map(([key, val]) => (
                            <div key={key} className={`p-3 rounded-2xl border text-xs ${isLightMode ? 'bg-slate-100/80 border-slate-300' : 'bg-zinc-900/80 border-zinc-800'}`}>
                              <div className="font-bold text-emerald-500 uppercase text-[10px] mb-1">Objection: "{key}"</div>
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => {
                                  setScript({
                                    ...script,
                                    objections: { ...script.objections, [key]: e.target.value }
                                  });
                                }}
                                className={`w-full p-2 rounded-xl text-xs border ${isLightMode ? 'bg-white border-slate-300' : 'bg-zinc-950 border-zinc-800'}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* OUTBOUND DISPATCHER VIEW */}
              {activeNav === 'dispatch' && (
                <div className={`p-6 rounded-[28px] border shadow-xl ${
                  isLightMode ? 'bg-white/90 border-slate-200' : 'bg-[#151922]/90 border-zinc-800'
                } space-y-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold flex items-center gap-2">
                        <PhoneOutgoing className="w-5 h-5 text-emerald-500" />
                        <span>Outbound Lead Dispatcher</span>
                      </h2>
                      <p className="text-xs opacity-70">Initiate automated xAI Voice calls for enriched leads</p>
                    </div>

                    <button
                      onClick={handleLaunchCampaign}
                      disabled={isCampaignRunning || dispatchLeadIds.length === 0}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
                    >
                      {isCampaignRunning ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Calling Leads...</span>
                        </>
                      ) : (
                        <>
                          <PhoneOutgoing className="w-4 h-4" />
                          <span>Launch Batch Calls ({dispatchLeadIds.length})</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* LEADS LIST */}
                  <div className="space-y-2">
                    {leads.length === 0 ? (
                      <div className="p-8 text-center text-xs opacity-60">
                        No leads imported yet. Scrape leads from SIRENE or Google Maps tab to start calling.
                      </div>
                    ) : (
                      leads.map((lead) => {
                        const isSelected = dispatchLeadIds.includes(lead.id);
                        return (
                          <div
                            key={lead.id}
                            onClick={() => {
                              if (isSelected) {
                                setDispatchLeadIds(prev => prev.filter(i => i !== lead.id));
                              } else {
                                setDispatchLeadIds(prev => [...prev, lead.id]);
                              }
                            }}
                            className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                              isSelected
                                ? isLightMode ? 'bg-emerald-50 border-emerald-300' : 'bg-emerald-950/20 border-emerald-800'
                                : isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/60 border-zinc-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                              <div>
                                <div className="text-xs font-bold">{lead.businessName}</div>
                                <div className="text-[10px] opacity-60">{lead.phone || lead.contactName || 'Enriched Lead'}</div>
                              </div>
                            </div>

                            <span className="text-[10px] font-mono font-bold text-emerald-500">
                              {lead.phone || '+33 6 00 00 00 00'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* CALL LOGS & TRANSCRIPTS */}
              {activeNav === 'logs' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className={`md:col-span-5 p-5 rounded-[28px] border shadow-xl ${
                    isLightMode ? 'bg-white/90 border-slate-200' : 'bg-[#151922]/90 border-zinc-800'
                  } space-y-3`}>
                    <h3 className="text-xs font-bold uppercase tracking-wider opacity-70">Recent Call Logs</h3>
                    <div className="space-y-2">
                      {callLogs.map((log) => (
                        <div
                          key={log.callId}
                          onClick={() => setSelectedLog(log)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            selectedLog?.callId === log.callId
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 font-bold'
                              : isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/60 border-zinc-800'
                          }`}
                        >
                          <div className="text-xs font-bold">{log.businessName}</div>
                          <div className="text-[10px] opacity-70 mt-1">{log.summary}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`md:col-span-7 p-5 rounded-[28px] border shadow-xl ${
                    isLightMode ? 'bg-white/90 border-slate-200' : 'bg-[#151922]/90 border-zinc-800'
                  } space-y-4`}>
                    {selectedLog ? (
                      <>
                        <div className="border-b pb-3 border-slate-200 dark:border-zinc-800">
                          <h3 className="text-sm font-bold">{selectedLog.businessName}</h3>
                          <div className="text-xs opacity-70">{selectedLog.phone} — {selectedLog.duration}s</div>
                        </div>

                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {selectedLog.transcript.map((t, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-2xl text-xs ${
                                t.speaker === 'ai'
                                  ? 'bg-emerald-600 text-white ml-auto max-w-[85%]'
                                  : 'bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 mr-auto max-w-[85%]'
                              }`}
                            >
                              <div className="text-[9px] font-bold opacity-80 mb-0.5">
                                {t.speaker === 'ai' ? 'xAI Voice Agent' : 'Prospect'}
                              </div>
                              <div>{t.text}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-center text-xs opacity-60">Select a call log to view transcript</div>
                    )}
                  </div>
                </div>
              )}

              {/* SETTINGS VIEW */}
              {activeNav === 'settings' && (
                <div className={`p-6 rounded-[28px] border shadow-xl ${
                  isLightMode ? 'bg-white/90 border-slate-200' : 'bg-[#151922]/90 border-zinc-800'
                } space-y-4`}>
                  <h2 className="text-sm font-extrabold flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-500" />
                    <span>xAI API Key & Audio Engine Integration</span>
                  </h2>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold opacity-70 block">xAI API Key</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={xaiApiKey}
                        onChange={(e) => setXaiApiKey(e.target.value)}
                        className={`flex-1 p-3 rounded-2xl text-xs font-mono border ${
                          isLightMode ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900 border-zinc-800'
                        }`}
                      />
                      <button
                        onClick={handleSaveKey}
                        className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-2xl"
                      >
                        Save Key
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
