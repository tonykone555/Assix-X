import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Send, 
  Search, 
  Phone, 
  Sparkles, 
  Users, 
  Sliders, 
  Globe, 
  LogOut, 
  Clock, 
  Check, 
  XCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Bot
} from 'lucide-react';

interface WhatsAppMessage {
  id: string;
  leadId?: string;
  phone: string;
  leadName?: string;
  direction: 'outbound' | 'inbound';
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  timestamp: string;
  error?: string;
}

interface Conversation {
  phone: string;
  leadId?: string;
  leadName?: string;
  businessName?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  messages: WhatsAppMessage[];
}

interface WhatsAppStatus {
  status: 'DISCONNECTED' | 'INITIALIZING' | 'QR_READY' | 'AUTHENTICATING' | 'CONNECTED';
  qrCodeDataUrl: string | null;
  pairingCode: string | null;
  userPhone: string | null;
  userName: string | null;
  error: string | null;
  stats: {
    totalSent: number;
    totalFailed: number;
    activeConversations: number;
  };
}

interface WhatsAppTabProps {
  leads: any[];
  serverUrl?: string;
  showNotification?: (msg: string) => void;
  onGenerateWebsiteForLead?: (lead: any) => void;
  theme?: 'dark' | 'light';
  initialSelectedLeadIds?: string[];
  autoOpenBulkModal?: boolean;
}

export const WhatsAppTab: React.FC<WhatsAppTabProps> = ({
  leads = [],
  serverUrl = window.location.origin,
  showNotification,
  onGenerateWebsiteForLead,
  theme,
  initialSelectedLeadIds = [],
  autoOpenBulkModal = false
}) => {
  const isLight = theme === 'light' || (typeof document !== 'undefined' && document.documentElement.classList.contains('light'));

  const [statusObj, setStatusObj] = useState<WhatsAppStatus>({
    status: 'DISCONNECTED',
    qrCodeDataUrl: null,
    pairingCode: null,
    userPhone: null,
    userName: null,
    error: null,
    stats: { totalSent: 0, totalFailed: 0, activeConversations: 0 }
  });

  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activePhone, setActivePhone] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Pairing code state
  const [pairingMode, setPairingMode] = useState<'qr' | 'code'>('qr');
  const [pairingPhoneInput, setPairingPhoneInput] = useState('');
  const [isRequestingPairingCode, setIsRequestingPairingCode] = useState(false);

  // QR Code Modal popup state
  const [showQrModal, setShowQrModal] = useState(false);

  // Bulk Messaging state
  const [showBulkModal, setShowBulkModal] = useState(autoOpenBulkModal);
  const [bulkMessageTemplate, setBulkMessageTemplate] = useState(
    'Bonjour {name}, je suis tombé sur {businessName} et j\'ai remarqué que votre site web aurait besoin d\'une modernisation pour booster vos conversions clients. Seriez-vous ouvert à voir une maquette gratuite ?'
  );
  const [bulkDelaySeconds, setBulkDelaySeconds] = useState(6);
  const [attachWebsiteScreenshot, setAttachWebsiteScreenshot] = useState(true);
  const [selectedLeadIdsForBulk, setSelectedLeadIdsForBulk] = useState<string[]>(initialSelectedLeadIds);
  const [bulkSearchQuery, setBulkSearchQuery] = useState('');
  const [selectedSourceRun, setSelectedSourceRun] = useState('ALL');
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number } | null>(null);

  // Verification state
  const [isVerifyingWa, setIsVerifyingWa] = useState(false);
  const [verifyStats, setVerifyStats] = useState<{ total: number; verified: number } | null>(null);
  const [verifiedLeadMap, setVerifiedLeadMap] = useState<Record<string, boolean>>({});
  const [showVerifiedOnlyFilter, setShowVerifiedOnlyFilter] = useState(false);

  const handleVerifyWhatsAppLeads = async () => {
    const idsToVerify = selectedLeadIdsForBulk.length > 0 
      ? selectedLeadIdsForBulk 
      : filteredBulkLeads.map(l => l.leadId);

    if (idsToVerify.length === 0) {
      if (showNotification) showNotification("No leads with phone numbers selected to verify.");
      return;
    }

    setIsVerifyingWa(true);
    try {
      const res = await fetch(`${serverUrl}/api/whatsapp/verify-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: idsToVerify })
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.results)) {
        setVerifyStats({ total: data.totalChecked, verified: data.verifiedWhatsappCount });
        
        const newMap: Record<string, boolean> = { ...verifiedLeadMap };
        const confirmedWaIds: string[] = [];

        data.results.forEach((r: any) => {
          if (r.id) {
            newMap[r.id] = Boolean(r.hasWhatsapp);
            if (r.hasWhatsapp) {
              confirmedWaIds.push(r.id);
            }
          }
        });

        setVerifiedLeadMap(newMap);
        if (confirmedWaIds.length > 0) {
          setSelectedLeadIdsForBulk(confirmedWaIds);
          setShowVerifiedOnlyFilter(true);
        }

        if (showNotification) {
          showNotification(`WhatsApp Analysis Complete! ${data.verifiedWhatsappCount} of ${data.totalChecked} phone numbers have active WhatsApp accounts. Filter applied.`);
        }
      } else {
        if (showNotification) showNotification(`Verification notice: ${data.error}`);
      }
    } catch (err: any) {
      console.error('Error verifying WhatsApp numbers:', err);
      if (showNotification) showNotification(`Verification error: ${err.message}`);
    } finally {
      setIsVerifyingWa(false);
    }
  };

  useEffect(() => {
    if (initialSelectedLeadIds && initialSelectedLeadIds.length > 0) {
      setSelectedLeadIdsForBulk(initialSelectedLeadIds);
      setShowBulkModal(true);

      // Check if selected leads contain Real Estate agent leads
      const selectedLeads = leads.filter(l => initialSelectedLeadIds.includes(l.id));
      const isRealEstate = selectedLeads.some(l => 
        (l.source && l.source.includes('real_estate')) ||
        (l.category && l.category.toLowerCase().includes('real estate')) ||
        (l.notes && l.notes.includes('Real Estate'))
      );

      if (isRealEstate) {
        setBulkMessageTemplate(
          "Bonjour {name}, j'ai vu vos mandats immobiliers à {businessName}. Nous créons des vidéos de présentation et visites virtuelles pour booster l'exclusivité de vos biens. Seriez-vous ouvert à voir une démo vidéo gratuite ?"
        );
      }
    }
  }, [initialSelectedLeadIds, leads]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Poll status regularly
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/whatsapp/status`);
      if (res.ok) {
        const data = await res.json();
        setStatusObj(data);
      }
    } catch (err) {
      console.error('Error fetching WhatsApp status:', err);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/whatsapp/conversations`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.conversations)) {
          setConversations(data.conversations);
          if (!activePhone && data.conversations.length > 0) {
            setActivePhone(data.conversations[0].phone);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchConversations();

    const interval = setInterval(() => {
      fetchStatus();
      fetchConversations();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const safeErrorString = (err: any): string => {
    if (!err) return 'Unknown error occurred';
    if (typeof err === 'string') return err;
    if (typeof err === 'object') {
      if (typeof err.message === 'string') return err.message;
      if (typeof err.error === 'string') return err.error;
    }
    return String(err);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, activePhone]);

  const handleConnect = async (forceFresh = false) => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch(`${serverUrl}/api/whatsapp/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceFresh })
      });
      const data = await res.json();
      if (data.success) {
        if (showNotification) showNotification(forceFresh ? 'Generating fresh WhatsApp QR code...' : 'WhatsApp connection started. Generating QR Code...');
        fetchStatus();
      } else {
        const errStr = safeErrorString(data.error || 'Connection failed');
        if (showNotification) showNotification(`Connection error: ${errStr}`);
      }
    } catch (err: any) {
      const errStr = safeErrorString(err);
      if (showNotification) showNotification(`Failed to connect: ${errStr}`);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch(`${serverUrl}/api/whatsapp/disconnect`, { method: 'POST' });
      if (showNotification) showNotification('WhatsApp disconnected successfully.');
      fetchStatus();
    } catch (err: any) {
      const errStr = safeErrorString(err);
      if (showNotification) showNotification(`Disconnect failed: ${errStr}`);
    }
  };

  const handleRequestPairingCode = async () => {
    if (!pairingPhoneInput.trim()) {
      if (showNotification) showNotification('Please enter your phone number with country code (e.g. 14155552671).');
      return;
    }
    setIsRequestingPairingCode(true);
    try {
      const res = await fetch(`${serverUrl}/api/whatsapp/pairing-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: pairingPhoneInput })
      });
      const data = await res.json();
      if (data.success && data.pairingCode) {
        if (showNotification) showNotification(`8-Digit Pairing Code Generated: ${data.pairingCode}`);
        fetchStatus();
      } else {
        const errStr = safeErrorString(data.error || 'Pairing failed');
        if (showNotification) showNotification(`Pairing code error: ${errStr}`);
      }
    } catch (err: any) {
      const errStr = safeErrorString(err);
      if (showNotification) showNotification(`Failed to request pairing code: ${errStr}`);
    } finally {
      setIsRequestingPairingCode(false);
    }
  };

  const handleSendSingleMessage = async () => {
    if (!activePhone || !composeMessage.trim()) return;
    setIsSending(true);

    const targetConv = conversations.find(c => c.phone === activePhone);
    const lead = leads.find(l => l.phone === activePhone || l.secondaryPhone === activePhone);

    try {
      const res = await fetch(`${serverUrl}/api/whatsapp/send-single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: activePhone,
          message: composeMessage,
          leadId: targetConv?.leadId || lead?.leadId,
          leadName: targetConv?.leadName || lead?.name || lead?.businessName,
          businessName: targetConv?.businessName || lead?.businessName
        })
      });

      const data = await res.json();
      if (data.success) {
        setComposeMessage('');
        fetchConversations();
        if (showNotification) showNotification('WhatsApp message sent!');
      } else {
        if (showNotification) showNotification(`Failed to send: ${data.error}`);
      }
    } catch (err: any) {
      if (showNotification) showNotification(`Error sending message: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleStartConversationWithLead = (lead: any) => {
    const phone = lead.phone || lead.secondaryPhone;
    if (!phone) {
      if (showNotification) showNotification('This lead does not have a valid phone number.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    setActivePhone(cleanPhone);

    // If conversation doesn't exist in set yet, create a local stub
    const exists = conversations.some(c => c.phone === cleanPhone);
    if (!exists) {
      const newConv: Conversation = {
        phone: cleanPhone,
        leadId: lead.leadId,
        leadName: lead.name || lead.businessName,
        businessName: lead.businessName,
        lastMessage: 'Conversation started',
        lastMessageAt: new Date().toISOString(),
        messages: []
      };
      setConversations([newConv, ...conversations]);
    }
  };

  const handleLaunchBulkCampaign = async () => {
    const leadsToTarget = selectedLeadIdsForBulk.length > 0
      ? leads.filter(l => selectedLeadIdsForBulk.includes(l.leadId) && (l.phone || l.secondaryPhone))
      : leads.filter(l => l.phone || l.secondaryPhone);

    if (leadsToTarget.length === 0) {
      if (showNotification) showNotification('No leads with valid phone numbers available for WhatsApp bulk messaging.');
      return;
    }

    setIsBulkSending(true);
    setBulkProgress({ current: 0, total: leadsToTarget.length });

    try {
      const res = await fetch(`${serverUrl}/api/whatsapp/send-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leads: leadsToTarget,
          messageTemplate: bulkMessageTemplate,
          delaySeconds: bulkDelaySeconds,
          attachScreenshot: attachWebsiteScreenshot
        })
      });

      const data = await res.json();
      if (data.success) {
        if (showNotification) showNotification(data.message);
        setShowBulkModal(false);
        fetchConversations();
      } else {
        if (showNotification) showNotification(`Bulk campaign failed: ${data.error}`);
      }
    } catch (err: any) {
      if (showNotification) showNotification(`Error launching bulk campaign: ${err.message}`);
    } finally {
      setIsBulkSending(false);
      setBulkProgress(null);
    }
  };

  const activeConv = conversations.find(c => c.phone === activePhone);
  const activeLead = leads.find(l => (l.phone && l.phone.replace(/\D/g, '') === activePhone) || (l.secondaryPhone && l.secondaryPhone.replace(/\D/g, '') === activePhone));

  const filteredConversations = conversations.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.phone.includes(q) ||
      (c.leadName && c.leadName.toLowerCase().includes(q)) ||
      (c.businessName && c.businessName.toLowerCase().includes(q))
    );
  });

  const numberedScrapeRuns = React.useMemo(() => {
    const runMap = new Map<string, { id: string; label: string; count: number }>();
    leads.forEach(l => {
      const key = l.taskId || l.sourceRun || l.campaign || l.query || l.source || 'General Scrape';
      if (!runMap.has(key)) {
        const nicheText = l.niche || l.category || l.query || 'Scraped Leads';
        const locationText = l.city || l.location ? ` (${l.city || l.location})` : '';
        const srcText = l.source ? ` • ${l.source}` : '';
        runMap.set(key, {
          id: key,
          label: `${nicheText}${locationText}${srcText}`,
          count: 0
        });
      }
      runMap.get(key)!.count += 1;
    });

    return Array.from(runMap.values()).map((run, idx) => ({
      ...run,
      number: idx + 1,
      displayName: `Scrape #${idx + 1}: ${run.label} (${run.count} leads)`
    }));
  }, [leads]);

  const filteredBulkLeads = leads.filter(l => {
    const hasPhone = Boolean(l.phone || l.secondaryPhone);
    if (!hasPhone) return false;

    // Strict Filter for Verified Active WhatsApp accounts
    if (showVerifiedOnlyFilter) {
      const mappedVal = verifiedLeadMap[l.leadId];
      if (mappedVal === false) return false;
      if (mappedVal === undefined) {
        if (l.hasWhatsapp === false || l.isWhatsapp === false || l.whatsappStatus === 'non_whatsapp' || l.whatsappStatus === 'invalid') {
          return false;
        }
      }
    }

    const runKey = l.taskId || l.sourceRun || l.campaign || l.query || l.source || 'General Scrape';
    if (selectedSourceRun !== 'ALL' && runKey !== selectedSourceRun && l.sourceRun !== selectedSourceRun && l.source !== selectedSourceRun) {
      return false;
    }

    if (!bulkSearchQuery.trim()) return true;

    const q = bulkSearchQuery.toLowerCase();
    const name = (l.name || '').toLowerCase();
    const bus = (l.businessName || l.companyName || '').toLowerCase();
    const phone = (l.phone || l.secondaryPhone || '').toLowerCase();
    const source = (l.source || '').toLowerCase();
    const sourceRun = (l.sourceRun || '').toLowerCase();
    const niche = (l.niche || l.category || '').toLowerCase();
    const city = (l.city || l.location || '').toLowerCase();

    return (
      name.includes(q) ||
      bus.includes(q) ||
      phone.includes(q) ||
      source.includes(q) ||
      sourceRun.includes(q) ||
      niche.includes(q) ||
      city.includes(q)
    );
  });

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] font-sans select-none overflow-hidden transition-colors ${
      isLight ? 'bg-[#f0f2f5] text-slate-800' : 'bg-[#0A0A0C] text-zinc-100'
    }`}>
      {/* HEADER / STATUS CONTROL BAR */}
      <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-sm border-b transition-colors ${
        isLight ? 'bg-[#f0f2f5] border-slate-200' : 'bg-[#1a1a22] border-[#2A2A38]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isLight ? 'bg-emerald-100 border border-emerald-300 text-emerald-700' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}>
            <MessageSquare size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-extrabold tracking-wide uppercase transition-colors ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>WhatsApp Outreach Center</h2>
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full transition-colors ${
                isLight ? 'bg-emerald-100 border border-emerald-300 text-emerald-800' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              }`}>
                Baileys WhatsApp Engine
              </span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Pair via QR code, log two-way conversations per lead, and run personalized bulk campaigns.</p>
          </div>
        </div>

        {/* STATUS BADGES & CONTROLS */}
        <div className="flex items-center gap-3">
          {statusObj.status === 'CONNECTED' ? (
            <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border transition-colors ${
              isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-left">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>Connected</span>
                <span className={`text-[11px] font-mono ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>{statusObj.userPhone ? `+${statusObj.userPhone}` : statusObj.userName || 'Online'}</span>
              </div>
              <button
                onClick={() => {
                  setShowQrModal(true);
                  if (!statusObj.qrCodeDataUrl) handleConnect(false);
                }}
                className="ml-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-extrabold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-sm"
                title="Pop up WhatsApp QR Code modal"
              >
                <QrCode size={10} /> QR Code
              </button>
              <button
                onClick={handleDisconnect}
                className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-300 rounded text-[9px] font-extrabold uppercase transition cursor-pointer flex items-center gap-1"
                title="Disconnect WhatsApp Session"
              >
                <LogOut size={10} /> Disconnect
              </button>
            </div>
          ) : statusObj.status === 'QR_READY' ? (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              isLight ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <QrCode size={14} className="animate-pulse" />
              <span>QR Code Ready — Scan Below</span>
            </div>
          ) : statusObj.status === 'INITIALIZING' ? (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              isLight ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}>
              <RefreshCw size={14} className="animate-spin" />
              <span>Starting WhatsApp Engine...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Status: Disconnected</span>
              <button
                onClick={handleConnect}
                disabled={isLoadingStatus}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase rounded-lg shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <QrCode size={14} /> Connect WhatsApp
              </button>
            </div>
          )}

          {/* BULK OUTREACH BUTTON */}
          <button
            onClick={() => {
              if (selectedLeadIdsForBulk.length === 0) {
                const validIds = leads.filter(l => l.phone || l.secondaryPhone).map(l => l.leadId);
                setSelectedLeadIdsForBulk(validIds);
              }
              setShowBulkModal(true);
            }}
            className="px-4 py-2 bg-black hover:bg-zinc-900 text-white border border-zinc-800 font-extrabold text-xs tracking-wider uppercase rounded-lg shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Users size={14} className="text-emerald-400" />
            <span className="text-white font-extrabold">Launch Bulk Campaign</span>
          </button>
        </div>
      </div>

      {/* QR CODE & PAIRING CODE CONNECTION BANNER */}
      {statusObj.status !== 'CONNECTED' && (
        <div className={`border-b p-6 flex flex-col items-center justify-center gap-4 shrink-0 transition-colors ${
          isLight ? 'bg-[#f7f9fa] border-slate-200' : 'bg-[#121218] border-amber-500/30'
        }`}>
          {/* TAB TOGGLE: QR vs PAIRING CODE */}
          <div className={`flex items-center gap-2 p-1 rounded-lg border transition-colors ${
            isLight ? 'bg-slate-200 border-slate-300' : 'bg-[#1A1A22] border-zinc-800'
          }`}>
            <button
              onClick={() => setPairingMode('qr')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                pairingMode === 'qr' ? 'bg-emerald-600 text-white shadow-sm' : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <QrCode size={12} /> Scan QR Code
            </button>
            <button
              onClick={() => setPairingMode('code')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                pairingMode === 'code' ? 'bg-emerald-600 text-white shadow-sm' : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Phone size={12} /> Link with 8-Digit Code
            </button>
          </div>

          {pairingMode === 'qr' ? (
            statusObj.qrCodeDataUrl ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white p-3 rounded-xl shadow-xl border-4 border-emerald-500 relative group">
                    <img src={statusObj.qrCodeDataUrl} alt="WhatsApp QR Code" className="w-48 h-48 block" />
                  </div>
                  <button
                    onClick={() => handleConnect(true)}
                    disabled={isLoadingStatus}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow disabled:opacity-50"
                    title="Force generate a fresh QR Code if scanning timed out"
                  >
                    <RefreshCw size={14} className={isLoadingStatus ? "animate-spin" : ""} /> Refresh QR Code
                  </button>
                </div>
                <div className="max-w-md space-y-3">
                  <div className={`flex items-center gap-2 font-extrabold text-sm uppercase tracking-wider ${
                    isLight ? 'text-emerald-700' : 'text-amber-400'
                  }`}>
                    <ShieldCheck size={18} /> Link via QR Code
                  </div>
                  <ol className={`text-xs space-y-1.5 list-decimal list-inside font-medium leading-relaxed ${
                    isLight ? 'text-slate-700' : 'text-zinc-300'
                  }`}>
                    <li>Open <strong>WhatsApp</strong> on your mobile phone</li>
                    <li>Tap <strong>Settings / Menu (⋮)</strong> &gt; <strong>Linked Devices</strong></li>
                    <li>Tap <strong>Link a Device</strong> and point your camera at this QR Code</li>
                    <li>If WhatsApp asks to scan again or times out, click <strong>Refresh QR Code</strong> above for a fresh code</li>
                  </ol>
                  <p className={`text-[10px] italic ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>This session runs securely inside your container. Messages will send directly from your WhatsApp number.</p>
                </div>
              </div>
            ) : (
              <div className={`max-w-md w-full border p-6 rounded-2xl flex flex-col items-center justify-center gap-4 text-center shadow-lg transition-colors ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#181822] border-emerald-500/30'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  <QrCode size={28} className={statusObj.status === 'INITIALIZING' || isLoadingStatus ? "animate-pulse" : ""} />
                </div>
                <div>
                  <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {statusObj.status === 'INITIALIZING' ? 'Connecting & Generating QR Code...' : 'Connect Your WhatsApp Account'}
                  </h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    {statusObj.status === 'INITIALIZING' 
                      ? 'Establishing secure connection with WhatsApp servers. Please wait a moment...' 
                      : 'Click the button below to generate a fresh QR Code or switch to 8-Digit Pairing Code above.'}
                  </p>
                </div>
                <button
                  onClick={() => handleConnect(true)}
                  disabled={isLoadingStatus}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isLoadingStatus || statusObj.status === 'INITIALIZING' ? "animate-spin" : ""} />
                  {statusObj.status === 'INITIALIZING' ? 'Generating QR Code...' : 'Generate WhatsApp QR Code'}
                </button>
              </div>
            )
          ) : (
            <div className={`max-w-lg w-full border p-5 rounded-xl space-y-4 text-center shadow-md transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#181822] border-emerald-500/30'
            }`}>
              <div className={`flex items-center justify-center gap-2 font-extrabold text-sm uppercase tracking-wider ${
                isLight ? 'text-emerald-700' : 'text-emerald-400'
              }`}>
                <Phone size={18} /> Link via Phone Number &amp; 8-Digit Code
              </div>

              {statusObj.pairingCode ? (
                <div className={`border-2 p-4 rounded-xl space-y-3 transition-colors ${
                  isLight ? 'bg-emerald-50/60 border-emerald-500' : 'bg-zinc-950 border-emerald-500'
                }`}>
                  <span className={`text-[10px] uppercase font-black tracking-widest block ${
                    isLight ? 'text-emerald-800' : 'text-emerald-400'
                  }`}>Your 8-Digit Pairing Code:</span>
                  <span className={`text-3xl font-mono font-black tracking-widest block py-2.5 rounded border select-all ${
                    isLight ? 'text-slate-900 bg-white border-emerald-300 shadow-inner' : 'text-white bg-emerald-950/40 border-emerald-500/40'
                  }`}>
                    {statusObj.pairingCode}
                  </span>
                  <p className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    Enter this code on your phone in WhatsApp under <strong>Linked Devices &gt; Link with phone number instead</strong>.
                  </p>
                  <button
                    onClick={handleRequestPairingCode}
                    disabled={isRequestingPairingCode}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 mx-auto"
                  >
                    <RefreshCw size={12} className={isRequestingPairingCode ? "animate-spin" : ""} /> Get New Code
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
                    Enter your phone number with country code (e.g. <span className="font-mono text-emerald-600 font-bold">14155552671</span> or <span className="font-mono text-emerald-600 font-bold">33612345678</span>) to request a pairing code:
                  </p>
                  <div className="flex items-center gap-2 max-w-sm mx-auto">
                    <input
                      type="text"
                      placeholder="e.g. 14155552671"
                      value={pairingPhoneInput}
                      onChange={(e) => setPairingPhoneInput(e.target.value)}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none border transition-colors ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600' : 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      onClick={handleRequestPairingCode}
                      disabled={isRequestingPairingCode}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isRequestingPairingCode ? <RefreshCw size={14} className="animate-spin" /> : 'Get Code'}
                    </button>
                  </div>
                </div>
              )}

              <ol className={`text-[11px] space-y-1 text-left list-decimal list-inside font-medium p-3 rounded-lg border transition-colors ${
                isLight ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-zinc-950/50 text-zinc-400 border-zinc-800'
              }`}>
                <li>Open <strong>WhatsApp</strong> on your mobile phone</li>
                <li>Go to <strong>Settings / Menu (⋮) &gt; Linked Devices &gt; Link a Device</strong></li>
                <li>Tap <strong>Link with phone number instead</strong> at the bottom of the screen</li>
                <li>Type the 8-character code shown above</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* WORKSPACE BODY (Split View: Conversations Sidebar + Chat Timeline) */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR: CONVERSATIONS & LEADS */}
        <div className={`w-80 border-r flex flex-col shrink-0 transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0E0E12] border-[#1E1E24]'
        }`}>
          {/* SEARCH BAR */}
          <div className={`p-3 border-b ${isLight ? 'border-slate-200' : 'border-[#1E1E24]'}`}>
            <div className="relative">
              <Search size={14} className={`absolute left-3 top-2.5 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
              <input
                type="text"
                placeholder="Search leads or phones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none border transition-colors ${
                  isLight ? 'bg-[#f0f2f5] border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600' : 'bg-[#16161D] border-[#262630] text-zinc-200 placeholder-zinc-500 focus:border-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* CONVERSATION LIST */}
          <div className={`flex-1 overflow-y-auto divide-y ${isLight ? 'divide-slate-100' : 'divide-[#1A1A22]'}`}>
            {filteredConversations.length === 0 ? (
              <div className={`p-6 text-center text-xs space-y-3 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                <MessageSquare size={28} className={`mx-auto ${isLight ? 'text-slate-400' : 'text-zinc-600'}`} />
                <p>No WhatsApp conversations recorded yet.</p>
                {leads.length > 0 && (
                  <div className="pt-2">
                    <p className={`text-[10px] mb-2 uppercase tracking-wider font-bold ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Select a lead below to message:</p>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 text-left">
                      {leads.filter(l => l.phone || l.secondaryPhone).slice(0, 10).map((l, i) => (
                        <button
                          key={i}
                          onClick={() => handleStartConversationWithLead(l)}
                          className={`w-full p-2 rounded text-left transition flex items-center justify-between group cursor-pointer ${
                            isLight ? 'bg-slate-50 hover:bg-slate-100' : 'bg-[#14141A] hover:bg-[#1E1E26]'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <span className={`text-xs font-bold truncate block ${isLight ? 'text-slate-800 group-hover:text-emerald-700' : 'text-zinc-300 group-hover:text-white'}`}>{l.name || l.businessName}</span>
                            <span className={`text-[10px] font-mono block ${isLight ? 'text-emerald-700 font-semibold' : 'text-emerald-400'}`}>{l.phone || l.secondaryPhone}</span>
                          </div>
                          <ChevronRight size={12} className={`group-hover:text-emerald-600 shrink-0 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activePhone === conv.phone;
                return (
                  <button
                    key={conv.phone}
                    onClick={() => setActivePhone(conv.phone)}
                    className={`w-full p-3.5 text-left transition flex items-start gap-3 cursor-pointer ${
                      isActive 
                        ? isLight ? 'bg-[#f0f2f5] border-l-4 border-l-emerald-600' : 'bg-[#181822] border-l-2 border-l-emerald-400'
                        : isLight ? 'hover:bg-[#f5f6f6]' : 'hover:bg-[#121218]'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-extrabold text-xs shrink-0 ${
                      isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {(conv.leadName || conv.phone)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>{conv.leadName || conv.phone}</span>
                        {conv.lastMessageAt && (
                          <span className={`text-[9px] font-mono ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                            {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className={`text-[10px] font-mono truncate ${isLight ? 'text-emerald-700 font-semibold' : 'text-emerald-400'}`}>{conv.phone}</div>
                      {conv.lastMessage && (
                        <p className={`text-[11px] truncate mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{conv.lastMessage}</p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* CENTER MAIN CHAT TIMELINE */}
        <div className={`flex-1 flex flex-col transition-colors ${
          isLight ? 'bg-[#efeae2]' : 'bg-[#070709]'
        }`}>
          {activePhone ? (
            <>
              {/* CHAT HEADER WITH LEAD METADATA */}
              <div className={`border-b px-6 py-3.5 flex items-center justify-between shrink-0 shadow-sm transition-colors ${
                isLight ? 'bg-[#f0f2f5] border-slate-200' : 'bg-[#121218] border-[#1E1E24]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-extrabold text-sm ${
                    isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  }`}>
                    {(activeConv?.leadName || activePhone)[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {activeConv?.leadName || activeLead?.name || activeLead?.businessName || `Lead (+${activePhone})`}
                      {activeLead?.businessName && activeLead.businessName !== activeConv?.leadName && (
                        <span className={`text-xs font-normal ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>({activeLead.businessName})</span>
                      )}
                    </h3>
                    <div className={`flex items-center gap-3 text-[11px] font-mono ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                      <span className={`flex items-center gap-1 font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}><Phone size={10} /> +{activePhone}</span>
                      {activeLead?.secondaryPhone && activeLead.secondaryPhone !== activePhone && (
                        <span className={`flex items-center gap-1 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}><Phone size={10} /> 2nd Phone: {activeLead.secondaryPhone}</span>
                      )}
                      {activeLead?.website && (
                        <a href={activeLead.website} target="_blank" rel="noreferrer" className={`underline flex items-center gap-1 ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}>
                          <Globe size={10} /> {activeLead.website}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* BUILD WEBSITE SHORTCUT */}
                {activeLead && onGenerateWebsiteForLead && (
                  <button
                    onClick={() => onGenerateWebsiteForLead(activeLead)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[10px] uppercase tracking-wider rounded transition cursor-pointer shadow flex items-center gap-1.5"
                  >
                    <Sparkles size={11} /> Build Website Pitch
                  </button>
                )}
              </div>

              {/* MESSAGES TIMELINE */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {!activeConv || activeConv.messages.length === 0 ? (
                  <div className={`h-full flex flex-col items-center justify-center text-center space-y-3 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                    <Bot size={36} className={isLight ? 'text-slate-400' : 'text-zinc-600'} />
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>No message history yet for +{activePhone}</p>
                      <p className={`text-[11px] max-w-sm mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Type a pitch below or use variables like &#123;name&#125; and &#123;website&#125; to send a direct WhatsApp message.</p>
                    </div>
                  </div>
                ) : (
                  activeConv.messages.map((msg) => {
                    const isOutbound = msg.direction === 'outbound';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isOutbound
                              ? isLight 
                                ? 'bg-[#d9fdd3] text-[#111b21] rounded-br-none border border-emerald-200/60 shadow-sm' 
                                : 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-100 rounded-br-none'
                              : isLight 
                                ? 'bg-white text-[#111b21] rounded-bl-none border border-slate-200/80 shadow-sm' 
                                : 'bg-[#181822] border border-[#282836] text-zinc-200 rounded-bl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap select-text font-sans">{msg.message}</p>
                          <div className={`mt-1.5 flex items-center justify-end gap-1.5 text-[9px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isOutbound && (
                              <span>
                                {msg.status === 'sent' || msg.status === 'delivered' ? (
                                  <Check size={11} className={isLight ? 'text-emerald-600 inline font-bold' : 'text-emerald-400 inline'} />
                                ) : msg.status === 'failed' ? (
                                  <XCircle size={11} className="text-red-500 inline" />
                                ) : (
                                  <Clock size={11} className="text-amber-500 inline" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* COMPOSER BAR */}
              <div className={`p-4 border-t space-y-2 shrink-0 transition-colors ${
                isLight ? 'bg-[#f0f2f5] border-slate-200' : 'bg-[#101014] border-[#1E1E24]'
              }`}>
                {/* QUICK VARIABLE CHIPS */}
                <div className="flex items-center gap-2 overflow-x-auto text-[10px]">
                  <span className={`font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Variables:</span>
                  <button
                    onClick={() => setComposeMessage(prev => prev + ' {name}')}
                    className={`px-2 py-0.5 border rounded font-mono font-medium transition cursor-pointer ${
                      isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-emerald-800' : 'bg-[#1C1C24] hover:bg-[#282834] border-[#2E2E3C] text-amber-300'
                    }`}
                  >
                    + &#123;name&#125;
                  </button>
                  <button
                    onClick={() => setComposeMessage(prev => prev + ' {businessName}')}
                    className={`px-2 py-0.5 border rounded font-mono font-medium transition cursor-pointer ${
                      isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-emerald-800' : 'bg-[#1C1C24] hover:bg-[#282834] border-[#2E2E3C] text-amber-300'
                    }`}
                  >
                    + &#123;businessName&#125;
                  </button>
                  <button
                    onClick={() => setComposeMessage(prev => prev + ' {website}')}
                    className={`px-2 py-0.5 border rounded font-mono font-medium transition cursor-pointer ${
                      isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-emerald-800' : 'bg-[#1C1C24] hover:bg-[#282834] border-[#2E2E3C] text-amber-300'
                    }`}
                  >
                    + &#123;website&#125;
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <textarea
                    rows={2}
                    value={composeMessage}
                    onChange={(e) => setComposeMessage(e.target.value)}
                    placeholder="Type your WhatsApp message..."
                    className={`flex-1 rounded-xl p-3 text-xs focus:outline-none border transition resize-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600 shadow-sm' : 'bg-[#181820] border-[#282836] text-white placeholder-zinc-500 focus:border-emerald-500'
                    }`}
                  />
                  <button
                    onClick={handleSendSingleMessage}
                    disabled={isSending || !composeMessage.trim() || statusObj.status !== 'CONNECTED'}
                    className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-40 shrink-0"
                  >
                    <Send size={14} className={isSending ? 'animate-bounce' : ''} />
                    <span>{isSending ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={`h-full flex flex-col items-center justify-center text-center p-8 space-y-4 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
              <MessageSquare size={48} className={isLight ? 'text-slate-300' : 'text-zinc-700'} />
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Select a conversation or lead</h3>
                <p className={`text-xs max-w-sm mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Select a phone number on the left or use the Bulk Outreach tool to start messaging leads via WhatsApp.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BULK OUTREACH MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl transition-colors max-h-[90vh] flex flex-col ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121218] border-[#262632] text-white'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 shrink-0 ${isLight ? 'border-slate-200' : 'border-[#22222E]'}`}>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-emerald-400" />
                <h3 className={`text-sm font-black uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Bulk WhatsApp Campaign Launcher
                </h3>
              </div>
              <button onClick={() => setShowBulkModal(false)} className={`text-xs cursor-pointer px-2 py-1 rounded ${isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
                ✕
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* LEAD SELECTION & FILTER SECTION */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className={`text-[10px] font-extrabold uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    Target Leads ({selectedLeadIdsForBulk.length} of {leads.filter(l => l.phone || l.secondaryPhone).length} Selected)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleVerifyWhatsAppLeads}
                      disabled={isVerifyingWa}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                        isVerifyingWa 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40'
                      }`}
                      title="Analyze phone numbers and verify live active WhatsApp accounts via Baileys engine"
                    >
                      {isVerifyingWa ? (
                        <>
                          <RefreshCw size={11} className="animate-spin" />
                          Verifying WhatsApp...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={11} />
                          Analyze WhatsApp Accounts
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const validIds = filteredBulkLeads.map(l => l.leadId);
                        setSelectedLeadIdsForBulk(prev => Array.from(new Set([...prev, ...validIds])));
                      }}
                      className="text-[10px] font-bold text-emerald-500 hover:underline cursor-pointer"
                    >
                      Select All Filtered
                    </button>
                    <span className="text-zinc-600">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedLeadIdsForBulk([])}
                      className="text-[10px] font-bold text-zinc-400 hover:underline cursor-pointer"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {verifyStats && (
                  <div className="text-[10.5px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      Live Verification Result: <strong>{verifyStats.verified} of {verifyStats.total}</strong> phone numbers have active WhatsApp accounts connected.
                    </span>
                    <button onClick={() => setVerifyStats(null)} className="text-zinc-400 hover:text-white cursor-pointer ml-2">✕</button>
                  </div>
                )}

                {/* SEARCH, SOURCE RUN & VERIFIED FILTERS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search leads by name, phone, or source..."
                      value={bulkSearchQuery}
                      onChange={(e) => setBulkSearchQuery(e.target.value)}
                      className={`w-full text-xs pl-9 pr-3 py-2 rounded-lg border outline-none transition ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600' : 'bg-[#181822] border-[#2A2A3A] text-zinc-200 focus:border-emerald-500'
                      }`}
                    />
                  </div>

                  <div>
                    <select
                      value={selectedSourceRun}
                      onChange={(e) => setSelectedSourceRun(e.target.value)}
                      className={`w-full text-xs px-3 py-2 rounded-lg border outline-none transition cursor-pointer ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600' : 'bg-[#181822] border-[#2A2A3A] text-zinc-200 focus:border-emerald-500'
                      }`}
                    >
                      <option value="ALL">All Numbered Scrapes ({numberedScrapeRuns.length})</option>
                      {numberedScrapeRuns.map(run => (
                        <option key={run.id} value={run.id}>{run.displayName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setShowVerifiedOnlyFilter(prev => !prev)}
                      className={`w-full text-xs py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                        showVerifiedOnlyFilter
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                          : isLight ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900' : 'bg-[#181822] border-[#2A2A3A] text-zinc-400 hover:text-zinc-200'
                      }`}
                      title="Toggle list to show only leads with verified active WhatsApp accounts"
                    >
                      <ShieldCheck size={13} className={showVerifiedOnlyFilter ? 'text-emerald-400' : 'text-zinc-500'} />
                      <span>{showVerifiedOnlyFilter ? 'Showing: Verified WhatsApp Only' : 'Filter: All Phone Numbers'}</span>
                    </button>
                  </div>
                </div>

                {/* SCROLLABLE CHECKBOX LIST OF LEADS */}
                <div className={`border rounded-xl p-2 max-h-44 overflow-y-auto space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#181822] border-[#282838]'
                }`}>
                  {filteredBulkLeads.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-xs text-zinc-400 font-medium">No leads match the current filters.</p>
                      {showVerifiedOnlyFilter && (
                        <button
                          onClick={() => setShowVerifiedOnlyFilter(false)}
                          className="text-[11px] font-bold text-emerald-400 hover:underline mt-1 cursor-pointer"
                        >
                          Show all phone numbers
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredBulkLeads.map(lead => {
                      const isSelected = selectedLeadIdsForBulk.includes(lead.leadId);
                      const phone = lead.phone || lead.secondaryPhone;
                      const runTag = lead.sourceRun || lead.source || lead.campaign || lead.query || 'Direct';

                      const isVerifiedWA = verifiedLeadMap[lead.leadId] === true || lead.hasWhatsapp === true || lead.isWhatsapp === true || lead.whatsappStatus === 'whatsapp';
                      const isUnverifiedNonWA = verifiedLeadMap[lead.leadId] === false || lead.hasWhatsapp === false || lead.whatsappStatus === 'non_whatsapp';

                      return (
                        <div
                          key={lead.leadId}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedLeadIdsForBulk(prev => prev.filter(id => id !== lead.leadId));
                            } else {
                              setSelectedLeadIdsForBulk(prev => [...prev, lead.leadId]);
                            }
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs transition cursor-pointer ${
                            isSelected
                              ? isLight ? 'bg-emerald-50 border border-emerald-300' : 'bg-emerald-950/40 border border-emerald-500/30'
                              : isLight ? 'hover:bg-slate-100' : 'hover:bg-zinc-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // handled by parent div onClick
                              className="accent-emerald-500 rounded cursor-pointer"
                            />
                            <div className="truncate">
                              <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                                {lead.name || lead.businessName || 'Lead'}
                              </span>
                              {lead.businessName && lead.businessName !== lead.name && (
                                <span className="text-[11px] text-zinc-500 ml-1.5">({lead.businessName})</span>
                              )}
                              <span className="text-[11px] font-mono text-emerald-500 ml-2">+{phone}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isVerifiedWA && (
                              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                <ShieldCheck size={10} /> Active WA
                              </span>
                            )}
                            {isUnverifiedNonWA && (
                              <span className="bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                Non-WhatsApp
                              </span>
                            )}
                            <span className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                              isLight ? 'bg-slate-200 text-slate-700' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {runTag}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* MESSAGE TEMPLATE TEXTAREA */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                  <label className={`text-[10px] font-extrabold uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    Message Template
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500 mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setBulkMessageTemplate("Bonjour {name}, j'ai vu vos mandats immobiliers à {businessName}. Nous créons des vidéos de présentation et visites virtuelles pour booster l'exclusivité de vos biens. Seriez-vous ouvert à voir une démo vidéo gratuite ?")}
                      className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[9.5px] font-bold hover:bg-amber-500/30 cursor-pointer"
                    >
                      🏡 Immo (Vidéo Virtuelle)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkMessageTemplate("Bonjour {name}, je suis tombé sur {businessName} et j'ai remarqué que votre site web aurait besoin d'une modernisation pour booster vos conversions clients. Seriez-vous ouvert à voir une maquette gratuite ?")}
                      className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[9.5px] font-bold hover:bg-emerald-500/30 cursor-pointer"
                    >
                      🇫🇷 Web
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkMessageTemplate("Bonjour {name}, j'ai préparé une maquette gratuite et modernisée du site web de {businessName}. Seriez-vous ouvert à la découvrir ?")}
                      className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded text-[9.5px] font-bold hover:bg-blue-500/30 cursor-pointer"
                    >
                      🇫🇷 Court
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkMessageTemplate("Hi {name}, I came across {businessName} and noticed your website could use a modern upgrade to boost customer conversions. Would you be open to seeing a free draft mockup?")}
                      className="px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded text-[9.5px] font-bold hover:bg-zinc-700 cursor-pointer"
                    >
                      🇬🇧 English
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={bulkMessageTemplate}
                  onChange={(e) => setBulkMessageTemplate(e.target.value)}
                  className={`w-full rounded-xl p-3 text-xs focus:outline-none border transition ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600' : 'bg-[#181822] border-[#2A2A3A] text-white placeholder-zinc-500 focus:border-emerald-500'
                  }`}
                />
                <span className={`text-[10px] mt-1 block ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Variables: &#123;name&#125;, &#123;businessName&#125;, &#123;website&#125;</span>
              </div>

              {/* ATTACH SCREENSHOT TOGGLE */}
              <div className={`p-3 rounded-xl border flex items-center justify-between transition ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#181822] border-[#2A2A3A]'
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📸</span>
                  <div>
                    <label className={`text-xs font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Attach Personalized Website Screenshot
                    </label>
                    <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Sends a high-res picture attachment of each lead's website/mockup with their WhatsApp message
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={attachWebsiteScreenshot}
                  onChange={(e) => setAttachWebsiteScreenshot(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              {/* PACING DELAY SLIDER */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`text-[10px] font-extrabold uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    Pacing Delay Between Messages
                  </label>
                  <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-900' : 'text-emerald-400'}`}>{bulkDelaySeconds} seconds</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={bulkDelaySeconds}
                  onChange={(e) => setBulkDelaySeconds(parseInt(e.target.value))}
                  className={`w-full cursor-pointer ${isLight ? 'accent-slate-900' : 'accent-emerald-500'}`}
                />
                <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Recommended 6-10s delay with random jitter to ensure safe WhatsApp delivery.</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className={`flex items-center justify-end gap-3 pt-3 border-t shrink-0 ${isLight ? 'border-slate-200' : 'border-[#22222E]'}`}>
              <button
                onClick={() => setShowBulkModal(false)}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition cursor-pointer ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleLaunchBulkCampaign}
                disabled={isBulkSending || statusObj.status !== 'CONNECTED' || selectedLeadIdsForBulk.length === 0}
                className="px-6 py-2.5 bg-black hover:bg-zinc-900 text-white border border-zinc-800 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2 disabled:opacity-40"
              >
                <Send size={12} className={isBulkSending ? 'animate-spin text-white' : 'text-white'} />
                <span className="text-white font-black">{isBulkSending ? 'Launching Campaign...' : `Start Bulk Campaign (${selectedLeadIdsForBulk.length})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL FOR WHATSAPP QR CODE */}
      {showQrModal && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`max-w-md w-full border rounded-2xl p-6 shadow-2xl space-y-5 transition-colors relative ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#121218] border-emerald-500/40 text-white'
          }`}>
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-800/20 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <XCircle size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl">
                <QrCode size={22} />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-wide uppercase">WhatsApp Account QR Code</h3>
                <p className="text-xs text-zinc-400">Scan this code on your phone under Linked Devices.</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 py-2">
              {statusObj.qrCodeDataUrl ? (
                <div className="bg-white p-3 rounded-2xl border-4 border-emerald-500 shadow-xl">
                  <img src={statusObj.qrCodeDataUrl} alt="WhatsApp QR Code Modal" className="w-52 h-52 block" />
                </div>
              ) : (
                <div className="w-52 h-52 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-4 gap-2">
                  <QrCode size={36} className="text-emerald-500 animate-pulse" />
                  <span className="text-xs font-extrabold text-zinc-300">Generating QR Code...</span>
                  <span className="text-[10px] text-zinc-500">Connecting to WhatsApp Baileys engine</span>
                </div>
              )}

              {statusObj.status === 'CONNECTED' && (
                <div className="text-center px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Currently Connected: +{statusObj.userPhone || 'Active'}
                </div>
              )}

              <div className="flex items-center gap-2 w-full pt-2">
                <button
                  onClick={() => handleConnect(true)}
                  disabled={isLoadingStatus}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isLoadingStatus ? "animate-spin" : ""} /> Refresh Fresh Code
                </button>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
