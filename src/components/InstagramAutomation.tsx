import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Search, Users, MessageSquare, Shield, Terminal, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Play, 
  ExternalLink, UserCheck, AtSign, Filter, ArrowUpRight, 
  Copy, Layers, Activity, Smartphone, Lock, Key, HelpCircle,
  Zap, Check, ChevronRight
} from 'lucide-react';

interface ScrapedUser {
  pk: string | number;
  username: string;
  fullName: string;
  isPrivate: boolean;
  isVerified?: boolean;
  profilePicUrl?: string;
  followerCount?: number;
  followingCount?: number;
  biography?: string;
}

interface ScrapedComment {
  id: string;
  text: string;
  createdAt: number;
  user: ScrapedUser;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  action: string;
  target?: string;
  message: string;
  engine?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  data?: any;
}

export const InstagramAutomation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'scraper' | 'comments' | 'outreach' | 'accounts'>('chat');
  
  // Chat state
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      role: 'assistant',
      content: "Instagram Instagrapi Python Engine is active and operational. Zero-Auth Guest Scraping is enabled — you can scrape any competitor profile, follower list, or post comments right away without needing to log in. What would you like to extract or automate?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scraper state
  const [targetUsername, setTargetUsername] = useState('');
  const [scrapeMaxCount, setScrapeMaxCount] = useState(30);
  const [scrapingProfile, setScrapingProfile] = useState(false);
  const [scrapedProfile, setScrapedProfile] = useState<ScrapedUser | null>(null);
  const [scrapedFollowers, setScrapedFollowers] = useState<ScrapedUser[]>([]);

  // Comments state
  const [postUrl, setPostUrl] = useState('');
  const [commentsMaxCount, setCommentsMaxCount] = useState(25);
  const [scrapingComments, setScrapingComments] = useState(false);
  const [scrapedComments, setScrapedComments] = useState<ScrapedComment[]>([]);

  // Outreach state
  const [outreachRecipient, setOutreachRecipient] = useState('');
  const [outreachMessage, setOutreachMessage] = useState("Hi {{name}}, noticed your work on Instagram. Loved your recent content! We help brands scale client acquisition. Would love to share a quick 1-min demo with you.");
  const [sendingDm, setSendingDm] = useState(false);
  const [dmStatus, setDmStatus] = useState<string | null>(null);
  const [selectedLeadsForCampaign, setSelectedLeadsForCampaign] = useState<string[]>([]);
  const [campaignDelay, setCampaignDelay] = useState(45);
  const [campaignRunning, setCampaignRunning] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState({ sent: 0, total: 0 });

  // Accounts state & Login mode
  const [loginMode, setLoginMode] = useState<'session_cookie' | 'password'>('session_cookie');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginSessionId, setLoginSessionId] = useState('');
  const [login2faCode, setLogin2faCode] = useState('');
  const [loginProxy, setLoginProxy] = useState('');
  const [requires2fa, setRequires2fa] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [showCookieGuide, setShowCookieGuide] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  // Fetch accounts & logs periodically
  const fetchAccountsAndLogs = async () => {
    try {
      const [accRes, logRes] = await Promise.all([
        fetch('/api/instagram/accounts').then(r => r.json()).catch(() => ({ accounts: [] })),
        fetch('/api/instagram/logs').then(r => r.json()).catch(() => ({ logs: [] }))
      ]);
      if (accRes.accounts) setAccounts(accRes.accounts);
      if (logRes.logs) setLogs(logRes.logs);
    } catch (e) {}
  };

  useEffect(() => {
    fetchAccountsAndLogs();
    const interval = setInterval(fetchAccountsAndLogs, 6000);
    return () => clearInterval(interval);
  }, []);

  // Handle AI Agent Chat execution
  const handleSendChat = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || chatPrompt;
    if (!promptToUse.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: promptToUse.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatPrompt('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/instagram/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          history: chatHistory.map(h => ({ role: h.role, content: h.content }))
        })
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Command executed via instagrapi Python engine.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: data.data
      };
      setChatHistory(prev => [...prev, botMsg]);
      fetchAccountsAndLogs();
    } catch (err: any) {
      setChatHistory(prev => [...prev, {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `Error executing instagrapi command: ${err.message || 'Request failure'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Profile & Follower Scraping
  const handleScrapeProfile = async () => {
    if (!targetUsername.trim()) return;
    setScrapingProfile(true);
    setScrapedProfile(null);
    setScrapedFollowers([]);

    try {
      const [profileRes, followersRes] = await Promise.all([
        fetch('/api/instagram/scrape-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: targetUsername })
        }).then(r => r.json()),
        fetch('/api/instagram/scrape-followers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: targetUsername, maxCount: scrapeMaxCount })
        }).then(r => r.json())
      ]);

      if (profileRes.success && profileRes.data) {
        setScrapedProfile(profileRes.data);
      }
      if (followersRes.success && followersRes.followers) {
        setScrapedFollowers(followersRes.followers);
      }
      fetchAccountsAndLogs();
    } catch (err: any) {
      console.error('Scrape error:', err);
    } finally {
      setScrapingProfile(false);
    }
  };

  // Handle Post Comments Scraping
  const handleScrapeComments = async () => {
    if (!postUrl.trim()) return;
    setScrapingComments(true);
    setScrapedComments([]);

    try {
      const res = await fetch('/api/instagram/scrape-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postUrl, maxCount: commentsMaxCount })
      });
      const data = await res.json();
      if (data.success && data.comments) {
        setScrapedComments(data.comments);
      }
      fetchAccountsAndLogs();
    } catch (err: any) {
      console.error('Comments scrape error:', err);
    } finally {
      setScrapingComments(false);
    }
  };

  // Handle Single DM Send
  const handleSendSingleDm = async () => {
    if (!outreachRecipient.trim() || !outreachMessage.trim()) return;
    setSendingDm(true);
    setDmStatus(null);

    try {
      const res = await fetch('/api/instagram/send-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientUsername: outreachRecipient,
          messageText: outreachMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        setDmStatus(`✓ Message queued/sent to @${outreachRecipient}`);
        fetchAccountsAndLogs();
      } else {
        setDmStatus(`Error: ${data.error || 'Failed to send'}`);
      }
    } catch (err: any) {
      setDmStatus(`Error: ${err.message}`);
    } finally {
      setSendingDm(false);
    }
  };

  // Handle Mass DM Campaign
  const handleRunMassCampaign = async () => {
    const targets = selectedLeadsForCampaign.length > 0 
      ? selectedLeadsForCampaign 
      : (scrapedFollowers.length > 0 ? scrapedFollowers.map(f => f.username) : scrapedComments.map(c => c.user.username));

    if (targets.length === 0) return;
    setCampaignRunning(true);
    setCampaignProgress({ sent: 0, total: targets.length });

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      const personalizedMsg = outreachMessage.replace(/{{name}}/g, target);

      try {
        await fetch('/api/instagram/send-dm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipientUsername: target, messageText: personalizedMsg })
        });
      } catch (e) {}

      setCampaignProgress({ sent: i + 1, total: targets.length });

      if (i < targets.length - 1) {
        await new Promise(r => setTimeout(r, Math.max(1000, campaignDelay * 1000)));
      }
    }

    setCampaignRunning(false);
    fetchAccountsAndLogs();
  };

  // Handle Account Login
  const handleAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMessage(null);

    try {
      const payload: any = {
        proxy: loginProxy || undefined
      };

      if (loginMode === 'session_cookie') {
        if (!loginSessionId.trim()) {
          setLoginMessage('Error: Please enter your Instagram browser sessionid cookie.');
          setLoginLoading(false);
          return;
        }
        payload.sessionId = loginSessionId.trim();
        payload.username = loginUsername.trim() || undefined;
      } else {
        if (!loginUsername.trim()) {
          setLoginMessage('Error: Instagram username is required.');
          setLoginLoading(false);
          return;
        }
        payload.username = loginUsername.trim();
        payload.password = loginPassword;
        payload.verificationCode = login2faCode || undefined;
      }

      const res = await fetch('/api/instagram/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.requiresTwoFactor) {
        setRequires2fa(true);
        setLoginMessage('2FA verification code required. Please enter code below.');
      } else if (data.success) {
        setLoginMessage(`✓ Successfully authenticated @${data.username || loginUsername} via Instagrapi!`);
        setRequires2fa(false);
        setLoginPassword('');
        setLoginSessionId('');
        setLogin2faCode('');
        fetchAccountsAndLogs();
      } else {
        setLoginMessage(`Authentication: ${data.error || 'Failed to authenticate'}`);
      }
    } catch (err: any) {
      setLoginMessage(`Error: ${err.message}`);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0C0E] text-zinc-200 overflow-hidden font-sans select-none">
      
      {/* 1. TOP HEADER & NAVIGATION TABS */}
      <div className="px-6 py-3.5 border-b border-[#1F2024] bg-[#0E0F12] flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#18191E] border border-[#272830] text-zinc-100">
            <Smartphone size={16} className="text-zinc-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-100 tracking-wider uppercase font-mono">INSTAGRAPI PYTHON ENGINE</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                ● ZERO-AUTH READY
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">Python 3.10 • Mobile Emulation • Lead Gen & Outreach</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#141518] p-1 rounded-xl border border-[#22232A]">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-[#23252C] text-zinc-100 shadow-sm border border-[#30323B]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare size={13} />
            <span>AI Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('scraper')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
              activeTab === 'scraper' ? 'bg-[#23252C] text-zinc-100 shadow-sm border border-[#30323B]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Search size={13} />
            <span>Profile Scraper</span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
              activeTab === 'comments' ? 'bg-[#23252C] text-zinc-100 shadow-sm border border-[#30323B]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers size={13} />
            <span>Competitor Comments</span>
          </button>

          <button
            onClick={() => setActiveTab('outreach')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
              activeTab === 'outreach' ? 'bg-[#23252C] text-zinc-100 shadow-sm border border-[#30323B]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Send size={13} />
            <span>Smart DMs</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
              activeTab === 'accounts' ? 'bg-[#23252C] text-zinc-100 shadow-sm border border-[#30323B]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield size={13} />
            <span>Accounts & Shield</span>
          </button>
        </div>
      </div>

      {/* 2. BODY CONTENT */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* TAB 1: AI TERMINAL CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-full bg-[#0B0C0E]">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-xs">
              {chatHistory.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      {msg.role === 'user' ? 'Agency Operator' : 'Assix Instagrapi Agent'}
                    </span>
                    <span className="text-[10px] text-zinc-600">{msg.timestamp}</span>
                  </div>
                  
                  <div 
                    className={`max-w-2xl p-4 rounded-xl leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user' 
                        ? 'bg-[#181A20] text-zinc-100 border border-[#2A2D37]' 
                        : 'bg-[#121316] text-zinc-300 border border-[#1E2026]'
                    }`}
                  >
                    {msg.content}

                    {/* Render Interactive Scraped Profile Card if extracted */}
                    {msg.data?.type === 'profile' && msg.data.profile && (
                      <div className="mt-3 p-3.5 rounded-xl bg-[#0B0C0E] border border-[#242630] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={msg.data.profile.profilePicUrl || 'https://i.pravatar.cc/100'}
                              alt={msg.data.profile.username}
                              className="w-9 h-9 rounded-full object-cover border border-[#2A2C35]"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-zinc-100 text-xs">@{msg.data.profile.username}</div>
                              <div className="text-[10px] text-zinc-400">{msg.data.profile.fullName}</div>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#18191E] text-zinc-300">
                            {(msg.data.profile.followerCount || 0).toLocaleString()} Followers
                          </span>
                        </div>

                        {msg.data.profile.biography && (
                          <p className="text-[11px] text-zinc-400 italic">"{msg.data.profile.biography}"</p>
                        )}

                        <div className="pt-2 flex items-center gap-2 border-t border-[#1C1D24]">
                          <button
                            onClick={() => handleSendChat(`Scrape followers of @${msg.data.profile.username}`)}
                            className="px-2.5 py-1 rounded bg-[#18191E] hover:bg-zinc-100 hover:text-black border border-[#2B2D38] text-[10px] text-zinc-300 transition"
                          >
                            Extract Followers
                          </button>
                          <button
                            onClick={() => {
                              setOutreachRecipient(msg.data.profile.username);
                              setActiveTab('outreach');
                            }}
                            className="px-2.5 py-1 rounded bg-[#18191E] hover:bg-zinc-100 hover:text-black border border-[#2B2D38] text-[10px] text-zinc-300 transition"
                          >
                            Draft DM
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Render Followers List Preview if extracted */}
                    {msg.data?.type === 'followers' && msg.data.followers && (
                      <div className="mt-3 p-3.5 rounded-xl bg-[#0B0C0E] border border-[#242630] space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-100 font-mono">Live Leads Pool: @{msg.data.target}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                              {msg.data.followers.length} Real Accounts
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedLeadsForCampaign(msg.data.followers.map((f: any) => f.username));
                              setActiveTab('outreach');
                            }}
                            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-mono font-bold"
                          >
                            <span>Send All to Outreach</span>
                            <ArrowUpRight size={12} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                          {msg.data.followers.map((u: any, idx: number) => (
                            <div key={idx} className="p-2 rounded-lg bg-[#121316] border border-[#1E2026] hover:border-[#30323B] flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <img
                                  src={u.profilePicUrl || `https://i.pravatar.cc/100?u=${u.username}`}
                                  alt={u.username}
                                  className="w-7 h-7 rounded-full border border-[#2A2C35] object-cover shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="truncate">
                                  <div className="text-[11px] font-bold text-zinc-200 flex items-center gap-1 truncate">
                                    @{u.username}
                                    {u.isVerified && <span className="text-[9px] text-blue-400">✓</span>}
                                  </div>
                                  <div className="text-[10px] text-zinc-500 truncate">{u.fullName || (u.followerCount ? `${u.followerCount.toLocaleString()} followers` : 'Lead')}</div>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setOutreachRecipient(u.username);
                                  setActiveTab('outreach');
                                }}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1A1B22] hover:bg-zinc-100 hover:text-black border border-[#2A2C38] text-zinc-300 transition shrink-0"
                              >
                                DM
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Render Comments List Preview if extracted */}
                    {msg.data?.type === 'comments' && msg.data.comments && (
                      <div className="mt-3 p-3.5 rounded-xl bg-[#0B0C0E] border border-[#242630] space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-100 font-mono">Post Inquiries & Comments</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/60 text-blue-400 border border-blue-800/40">
                              {msg.data.comments.length} Inquiries Extracted
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedLeadsForCampaign(msg.data.comments.map((c: any) => c.user.username));
                              setActiveTab('outreach');
                            }}
                            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-mono font-bold"
                          >
                            <span>Send Commenters to Outreach</span>
                            <ArrowUpRight size={12} />
                          </button>
                        </div>

                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {msg.data.comments.map((c: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-[#121316] border border-[#1E2026] space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-zinc-200">@{c.user.username}</span>
                                  <span className="text-[10px] text-zinc-500 font-mono">{c.user.fullName}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setOutreachRecipient(c.user.username);
                                    setOutreachMessage(`Hi ${c.user.fullName || c.user.username}, saw your comment on Instagram! Wanted to follow up with you directly.`);
                                    setActiveTab('outreach');
                                  }}
                                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1A1B22] hover:bg-zinc-100 hover:text-black border border-[#2A2C38] text-zinc-300 transition"
                                >
                                  Reply via DM
                                </button>
                              </div>
                              <p className="text-[11px] text-zinc-400 italic">"{c.text}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-center gap-2 text-zinc-500 py-2">
                  <RefreshCw size={14} className="animate-spin text-zinc-400" />
                  <span>Instagrapi Python bridge executing request & scraping live data...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Suggestion Pills */}
            <div className="px-6 py-2 flex items-center gap-2 overflow-x-auto border-t border-[#16171C] bg-[#0E0F12]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase shrink-0">QUICK CMDS:</span>
              {[
                "Scrape profile of @nike",
                "Extract top 30 followers of competitor @zara",
                "Extract warm leads from comments on post link",
                "Draft cold DM sequence for real estate agencies"
              ].map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(cmd)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#18191E] hover:bg-[#22242B] border border-[#272830] text-zinc-400 hover:text-zinc-200 transition shrink-0 flex items-center gap-1"
                >
                  <span>{cmd}</span>
                  <ArrowUpRight size={11} className="opacity-50" />
                </button>
              ))}
            </div>

            {/* FLOATING PILL-SHAPED CHATBAR */}
            <div className="p-4 border-t border-[#1F2024] bg-[#0E0F12] flex justify-center">
              <div className="w-full max-w-4xl rounded-full bg-[#15161A] border border-[#26282E] shadow-2xl px-5 py-2.5 flex items-center gap-3 focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-400/20 transition-all duration-200">
                <AtSign size={16} className="text-zinc-500" />
                <input
                  type="text"
                  value={chatPrompt}
                  onChange={e => setChatPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask Instagrapi to scrape any profile (@username), extract followers, analyze comments, or write DMs..."
                  className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={!chatPrompt.trim() || chatLoading}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    chatPrompt.trim() && !chatLoading
                      ? 'bg-zinc-100 text-black hover:bg-white'
                      : 'bg-[#22242B] text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & FOLLOWER SCRAPER */}
        {activeTab === 'scraper' && (
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#0B0C0E]">
            {/* Left Controls */}
            <div className="w-full lg:w-96 p-6 border-r border-[#1F2024] bg-[#0E0F12] flex flex-col gap-5 overflow-y-auto">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">TARGET EXTRACTION</h3>
                <p className="text-xs text-zinc-500 mt-1">Zero-Auth Scraper: Extract profile analytics, bio data, and active follower leads directly via Instagrapi.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Target Instagram Handle / URL</label>
                  <div className="mt-1.5 relative">
                    <span className="absolute left-3 top-2.5 text-zinc-500 text-sm">@</span>
                    <input
                      type="text"
                      value={targetUsername}
                      onChange={e => setTargetUsername(e.target.value)}
                      placeholder="e.g. nike or instagram.com/gymshark"
                      className="w-full bg-[#15161A] border border-[#272830] rounded-xl pl-8 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">Exact Leads Count to Extract</label>
                    <span className="text-[11px] font-mono text-zinc-300 font-bold">{scrapeMaxCount} accounts</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {[10, 25, 50, 100].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setScrapeMaxCount(cnt)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition border ${
                          scrapeMaxCount === cnt
                            ? 'bg-zinc-100 text-black font-bold border-zinc-100'
                            : 'bg-[#15161A] text-zinc-400 border-[#272830] hover:text-zinc-200'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleScrapeProfile}
                  disabled={!targetUsername.trim() || scrapingProfile}
                  className="w-full mt-2 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-zinc-100 text-black hover:bg-white transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {scrapingProfile ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                  <span>{scrapingProfile ? `Extracting ${scrapeMaxCount} Leads...` : `Extract ${scrapeMaxCount} Live Leads`}</span>
                </button>
              </div>

              {/* Profile Card if scraped */}
              {scrapedProfile && (
                <div className="p-4 rounded-xl bg-[#15161A] border border-[#272830] space-y-3 mt-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={scrapedProfile.profilePicUrl || 'https://i.pravatar.cc/100'}
                      alt={scrapedProfile.username}
                      className="w-12 h-12 rounded-full border border-[#30323B] object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                        @{scrapedProfile.username}
                        {scrapedProfile.isVerified && <span className="text-[10px] text-blue-400">✓</span>}
                      </h4>
                      <p className="text-xs text-zinc-400">{scrapedProfile.fullName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-[#202127]">
                    <div className="p-2 rounded-lg bg-[#0E0F12]">
                      <div className="text-xs font-bold text-zinc-100 font-mono">{(scrapedProfile.followerCount || 0).toLocaleString()}</div>
                      <div className="text-[10px] text-zinc-500 uppercase">Followers</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#0E0F12]">
                      <div className="text-xs font-bold text-zinc-100 font-mono">{(scrapedProfile.followingCount || 0).toLocaleString()}</div>
                      <div className="text-[10px] text-zinc-500 uppercase">Following</div>
                    </div>
                  </div>

                  {scrapedProfile.biography && (
                    <p className="text-xs text-zinc-400 leading-relaxed italic border-t border-[#202127] pt-2">
                      "{scrapedProfile.biography}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Followers Lead Table */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1F2024] bg-[#0E0F12] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-100 font-mono uppercase">EXTRACTED LEADS QUEUE</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#18191E] text-zinc-400">
                    {scrapedFollowers.length} records
                  </span>
                </div>

                {scrapedFollowers.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedLeadsForCampaign(scrapedFollowers.map(f => f.username));
                      setActiveTab('outreach');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#1F2026] hover:bg-[#2A2B35] border border-[#2E303B] text-zinc-200 transition flex items-center gap-1.5"
                  >
                    <Send size={12} />
                    <span>Send to Outreach Queue</span>
                  </button>
                )}
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                {scrapedFollowers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 space-y-2">
                    <Search size={32} className="opacity-40" />
                    <p className="text-xs font-mono">Enter an Instagram handle on the left to extract competitor leads (works without login!).</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {scrapedFollowers.map((user, idx) => (
                      <div 
                        key={idx}
                        className="p-3 rounded-xl bg-[#121316] border border-[#1E2026] hover:border-[#30323B] transition flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={user.profilePicUrl || `https://i.pravatar.cc/100?img=${idx + 1}`}
                            alt={user.username}
                            className="w-10 h-10 rounded-full border border-[#2A2C35] object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="truncate">
                            <h5 className="text-xs font-bold text-zinc-200 truncate">@{user.username}</h5>
                            <p className="text-[11px] text-zinc-500 truncate">{user.fullName || 'Instagram User'}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setOutreachRecipient(user.username);
                            setActiveTab('outreach');
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#1A1B22] hover:bg-zinc-100 hover:text-black border border-[#272832] text-zinc-300 transition shrink-0"
                        >
                          Draft DM
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPETITOR POST COMMENTS SCRAPER */}
        {activeTab === 'comments' && (
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#0B0C0E]">
            {/* Left Post Input Controls */}
            <div className="w-full lg:w-96 p-6 border-r border-[#1F2024] bg-[#0E0F12] flex flex-col gap-5 overflow-y-auto">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">POST COMMENT SCRAPER</h3>
                <p className="text-xs text-zinc-500 mt-1">Extract engaged users and buyer inquiries directly from competitor posts or Reels without logging in.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Instagram Post URL or Shortcode</label>
                  <input
                    type="text"
                    value={postUrl}
                    onChange={e => setPostUrl(e.target.value)}
                    placeholder="https://www.instagram.com/p/DFxyz123/"
                    className="mt-1.5 w-full bg-[#15161A] border border-[#272830] rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">Exact Comments Count to Fetch</label>
                    <span className="text-[11px] font-mono text-zinc-300 font-bold">{commentsMaxCount} comments</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {[10, 25, 50, 100].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setCommentsMaxCount(cnt)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition border ${
                          commentsMaxCount === cnt
                            ? 'bg-zinc-100 text-black font-bold border-zinc-100'
                            : 'bg-[#15161A] text-zinc-400 border-[#272830] hover:text-zinc-200'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleScrapeComments}
                  disabled={!postUrl.trim() || scrapingComments}
                  className="w-full mt-2 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-zinc-100 text-black hover:bg-white transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {scrapingComments ? <RefreshCw size={14} className="animate-spin" /> : <Layers size={14} />}
                  <span>{scrapingComments ? `Extracting ${commentsMaxCount} Inquiries...` : `Extract ${commentsMaxCount} Live Comments`}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#121316] border border-[#1E2026] text-xs space-y-2 text-zinc-400">
                <div className="font-bold text-zinc-200 font-mono uppercase">🎯 High Intent Strategy</div>
                <p className="leading-relaxed">Users asking "How much?", "Where are you located?", or "Do you ship here?" in competitor comment sections are warm leads ready for outbound outreach.</p>
              </div>
            </div>

            {/* Right Extracted Comments Stream */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1F2024] bg-[#0E0F12] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-100 font-mono uppercase">SCRAPED COMMENTS STREAM</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#18191E] text-zinc-400">
                    {scrapedComments.length} comments
                  </span>
                </div>

                {scrapedComments.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedLeadsForCampaign(scrapedComments.map(c => c.user.username));
                      setActiveTab('outreach');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#1F2026] hover:bg-[#2A2B35] border border-[#2E303B] text-zinc-200 transition flex items-center gap-1.5"
                  >
                    <Send size={12} />
                    <span>Import All to Outreach</span>
                  </button>
                )}
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-3">
                {scrapedComments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 space-y-2">
                    <Layers size={32} className="opacity-40" />
                    <p className="text-xs font-mono">Paste a competitor Instagram post URL on the left to extract comments and user profiles.</p>
                  </div>
                ) : (
                  scrapedComments.map((comment, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl bg-[#121316] border border-[#1E2026] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={comment.user.profilePicUrl || `https://i.pravatar.cc/100?img=${idx + 10}`}
                            alt={comment.user.username}
                            className="w-7 h-7 rounded-full border border-[#2A2C35] object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-xs font-bold text-zinc-200">@{comment.user.username}</span>
                        </div>

                        <button
                          onClick={() => {
                            setOutreachRecipient(comment.user.username);
                            setOutreachMessage(`Hi ${comment.user.fullName || comment.user.username}, saw your comment on Instagram! Wanted to reach out regarding our solution.`);
                            setActiveTab('outreach');
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#1A1B22] hover:bg-zinc-100 hover:text-black border border-[#272832] text-zinc-300 transition"
                        >
                          Direct Outreach
                        </button>
                      </div>

                      <p className="text-xs text-zinc-300 bg-[#0E0F12] p-2.5 rounded-lg border border-[#1A1B20] font-mono">
                        "{comment.text}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SMART DM OUTREACH */}
        {activeTab === 'outreach' && (
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#0B0C0E]">
            {/* Left Composer */}
            <div className="w-full lg:w-1/2 p-6 border-r border-[#1F2024] bg-[#0E0F12] flex flex-col gap-4 overflow-y-auto">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">AI OUTBOUND COMPOSER</h3>
                <p className="text-xs text-zinc-500 mt-1">Craft personalized direct messages with dynamic variable tags and safety delays.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Target Recipient Handle</label>
                  <input
                    type="text"
                    value={outreachRecipient}
                    onChange={e => setOutreachRecipient(e.target.value)}
                    placeholder="prospect_username"
                    className="mt-1.5 w-full bg-[#15161A] border border-[#272830] rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">Direct Message Template</label>
                    <span className="text-[10px] font-mono text-zinc-500">Supports &#123;&#123;name&#125;&#125;</span>
                  </div>
                  <textarea
                    rows={6}
                    value={outreachMessage}
                    onChange={e => setOutreachMessage(e.target.value)}
                    className="mt-1.5 w-full bg-[#15161A] border border-[#272830] rounded-xl p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 leading-relaxed font-mono resize-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleSendSingleDm}
                    disabled={!outreachRecipient.trim() || !outreachMessage.trim() || sendingDm}
                    className="flex-1 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-zinc-100 text-black hover:bg-white transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {sendingDm ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                    <span>Send Single DM</span>
                  </button>

                  <button
                    onClick={() => {
                      setOutreachMessage("Hey {{name}}, came across your profile and was impressed by your brand. We built an AI acquisition tool specifically for your niche. Would you be open to seeing a 30s preview?");
                    }}
                    className="px-3 py-2.5 rounded-xl text-xs font-mono bg-[#1A1B22] hover:bg-[#22242D] border border-[#272832] text-zinc-300 transition"
                  >
                    Load B2B Template
                  </button>
                </div>

                {dmStatus && (
                  <div className={`p-3 rounded-xl text-xs font-mono ${dmStatus.startsWith('✓') ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300' : 'bg-red-950/40 border border-red-800/60 text-red-300'}`}>
                    {dmStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Right Multi-User Campaign Orchestrator */}
            <div className="w-full lg:w-1/2 p-6 bg-[#0B0C0E] flex flex-col gap-4 overflow-y-auto">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">AUTOMATED BATCH SEQUENCE</h3>
                <p className="text-xs text-zinc-500 mt-1">Execute safe human-paced outreach sequences to multiple scraped leads.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#121316] border border-[#1E2026] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Queued Lead Targets:</span>
                  <span className="text-zinc-100 font-bold">
                    {selectedLeadsForCampaign.length > 0 ? selectedLeadsForCampaign.length : scrapedFollowers.length || scrapedComments.length || 0} contacts
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-zinc-400">Anti-Ban Pacing Delay:</span>
                    <span className="text-zinc-200">{campaignDelay}s between DMs</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={120}
                    value={campaignDelay}
                    onChange={e => setCampaignDelay(parseInt(e.target.value))}
                    className="w-full accent-zinc-100"
                  />
                </div>

                <button
                  onClick={handleRunMassCampaign}
                  disabled={campaignRunning || (selectedLeadsForCampaign.length === 0 && scrapedFollowers.length === 0 && scrapedComments.length === 0)}
                  className="w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {campaignRunning ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                  <span>{campaignRunning ? `Sending (${campaignProgress.sent}/${campaignProgress.total})...` : 'Launch Automated Sequence'}</span>
                </button>
              </div>

              {/* Activity Stream */}
              <div className="flex-1 flex flex-col">
                <span className="text-[11px] font-mono text-zinc-500 uppercase mb-2">LIVE OUTREACH TELEMETRY</span>
                <div className="flex-1 p-3 rounded-xl bg-[#0E0F12] border border-[#1E2026] overflow-y-auto space-y-2 font-mono text-[11px]">
                  {logs.slice(0, 10).map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 text-zinc-400">
                      <span className="text-zinc-500 shrink-0">{log.timestamp.slice(11, 19)}</span>
                      <span className="truncate flex-1">[{log.action}] {log.message}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase shrink-0 ${log.type === 'success' ? 'bg-emerald-950 text-emerald-400' : log.type === 'error' ? 'bg-red-950 text-red-400' : 'bg-[#18191E] text-zinc-400'}`}>
                        {log.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACCOUNTS & PROXY SHIELD */}
        {activeTab === 'accounts' && (
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-[#0B0C0E]">
            {/* Left Account Login */}
            <div className="w-full lg:w-96 p-6 border-r border-[#1F2024] bg-[#0E0F12] flex flex-col gap-4 overflow-y-auto">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">ACCOUNT AUTHENTICATION</h3>
                <p className="text-xs text-zinc-500 mt-1">Connect your Instagram account via browser session cookie or password.</p>
              </div>

              {/* Login Mode Selector */}
              <div className="grid grid-cols-2 gap-1.5 bg-[#141518] p-1 rounded-xl border border-[#22232A]">
                <button
                  type="button"
                  onClick={() => { setLoginMode('session_cookie'); setLoginMessage(null); }}
                  className={`py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-center gap-1.5 ${
                    loginMode === 'session_cookie' ? 'bg-[#23252C] text-zinc-100 border border-[#30323B]' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Key size={12} />
                  <span>Session Cookie</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setLoginMode('password'); setLoginMessage(null); }}
                  className={`py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-center gap-1.5 ${
                    loginMode === 'password' ? 'bg-[#23252C] text-zinc-100 border border-[#30323B]' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Lock size={12} />
                  <span>Password / 2FA</span>
                </button>
              </div>

              <form onSubmit={handleAccountLogin} className="space-y-3">
                {loginMode === 'session_cookie' ? (
                  <>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase">Browser SessionID Cookie</label>
                        <button
                          type="button"
                          onClick={() => setShowCookieGuide(!showCookieGuide)}
                          className="text-[10px] text-zinc-400 hover:text-zinc-200 underline flex items-center gap-1 font-mono"
                        >
                          <HelpCircle size={10} />
                          <span>How to get this?</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={loginSessionId}
                        onChange={e => setLoginSessionId(e.target.value)}
                        placeholder="e.g. 583920194%3ARwB82..."
                        className="mt-1.5 w-full bg-[#15161A] border border-[#272830] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-400 font-mono"
                      />
                    </div>

                    {showCookieGuide && (
                      <div className="p-3 rounded-xl bg-[#121316] border border-[#242630] text-[11px] text-zinc-300 space-y-1.5 font-mono">
                        <div className="font-bold text-zinc-100">📋 How to grab your SessionID in 10s:</div>
                        <div>1. Open instagram.com in Chrome/Brave/Edge and log in.</div>
                        <div>2. Press <kbd className="bg-[#1D1E24] px-1 rounded">F12</kbd> (DevTools) → Go to <strong>Application</strong> (or Storage).</div>
                        <div>3. Click <strong>Cookies</strong> → <strong>https://www.instagram.com</strong>.</div>
                        <div>4. Copy the value of the cookie named <strong>sessionid</strong> and paste it above.</div>
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Username Tag (Optional)</label>
                      <input
                        type="text"
                        value={loginUsername}
                        onChange={e => setLoginUsername(e.target.value)}
                        placeholder="your_agency_username"
                        className="mt-1.5 w-full bg-[#15161A] border border-[#272830] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Instagram Username</label>
                      <input
                        type="text"
                        value={loginUsername}
                        onChange={e => setLoginUsername(e.target.value)}
                        placeholder="your_agency_ig"
                        className="mt-1.5 w-full bg-[#15161A] border border-[#272830] rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-400"
                      />
                    </div>

                    {!requires2fa ? (
                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 uppercase">Password</label>
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="mt-1.5 w-full bg-[#15161A] border border-[#272830] rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="text-[11px] font-mono text-emerald-400 uppercase">2FA Security Code</label>
                        <input
                          type="text"
                          value={login2faCode}
                          onChange={e => setLogin2faCode(e.target.value)}
                          placeholder="123456"
                          className="mt-1.5 w-full bg-[#15161A] border border-emerald-600 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none"
                        />
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Residential Proxy URL (Optional)</label>
                  <input
                    type="text"
                    value={loginProxy}
                    onChange={e => setLoginProxy(e.target.value)}
                    placeholder="http://user:pass@proxy.ip:port"
                    className="mt-1.5 w-full bg-[#15161A] border border-[#272830] rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-400 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full mt-2 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-zinc-100 text-black hover:bg-white transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loginLoading ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}
                  <span>{loginLoading ? 'Authenticating...' : requires2fa ? 'Verify 2FA Code' : 'Connect Instagrapi Session'}</span>
                </button>

                {loginMessage && (
                  <div className={`p-3 rounded-xl text-xs font-mono leading-relaxed ${loginMessage.startsWith('✓') ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300' : 'bg-[#181A20] border border-[#2A2D37] text-zinc-300'}`}>
                    {loginMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Right Active Accounts & Rate Limits */}
            <div className="flex-1 p-6 bg-[#0B0C0E] flex flex-col gap-4 overflow-y-auto">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">CONNECTED SESSIONS & RATE LIMITS</h3>
                <p className="text-xs text-zinc-500 mt-1">Manage active device emulations, proxies, and safety rate limit buckets.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#121316] border border-[#1E2026] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 font-mono">ZERO-AUTH STATUS</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400">ACTIVE & READY</span>
                  </div>
                  <p className="text-xs text-zinc-400">Instagrapi Python bridge allows public profile scraping, followers extraction, and comment scraping with zero credentials required.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#121316] border border-[#1E2026] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 font-mono">HOURLY SAFETY LIMITS</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#18191E] text-zinc-400">SAFE MODE</span>
                  </div>
                  <div className="text-xs text-zinc-400 space-y-1 font-mono">
                    <div>• Max DMs / hour: 20-30</div>
                    <div>• Scrape requests / min: 60</div>
                    <div>• Anti-ban jitter delay: 3-8s</div>
                  </div>
                </div>
              </div>

              {/* Full activity logs table */}
              <div className="flex-1 flex flex-col mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase">SYSTEM ACTIVITY LOG</span>
                  <button onClick={fetchAccountsAndLogs} className="text-zinc-500 hover:text-zinc-300 text-xs font-mono flex items-center gap-1">
                    <RefreshCw size={11} /> Refresh
                  </button>
                </div>
                <div className="flex-1 p-4 rounded-xl bg-[#0E0F12] border border-[#1E2026] overflow-y-auto space-y-2 font-mono text-xs">
                  {logs.length === 0 ? (
                    <div className="text-zinc-600 text-center py-6">No recent actions recorded.</div>
                  ) : (
                    logs.map(log => (
                      <div key={log.id} className="p-2 rounded bg-[#131418] border border-[#1D1E24] flex items-center justify-between text-zinc-300">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 text-[10px]">{log.timestamp.slice(11, 19)}</span>
                          <span className="font-bold text-zinc-200">[{log.action}]</span>
                          <span className="text-zinc-400">{log.message}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${log.type === 'success' ? 'bg-emerald-950 text-emerald-400' : log.type === 'error' ? 'bg-red-950 text-red-400' : 'bg-zinc-800 text-zinc-300'}`}>
                          {log.type}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
