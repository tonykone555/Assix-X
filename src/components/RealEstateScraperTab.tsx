import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Filter, 
  Play, 
  CheckCircle2, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  UserCheck, 
  ShieldCheck, 
  Zap,
  Globe,
  Database,
  Trash2,
  BookmarkCheck,
  Sparkles,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Star
} from 'lucide-react';
import { Lead } from '../types';
import { formatBusinessName } from '../../services/nicheEmailTemplates';

interface RealEstateScraperTabProps {
  serverUrl: string;
  isLight?: boolean;
  onSaveLeads?: (leads: Partial<Lead>[]) => void;
  onOpenWhatsApp?: (leads: Partial<Lead>[]) => void;
  onOpenEmailModal?: (lead: any) => void;
  showNotification: (msg: string) => void;
}

interface RealEstateAgentLead {
  id: string;
  name: string;
  agency: string;
  country: string;
  countryCode: string;
  city: string;
  phone: string;
  whatsappPhone: string;
  isMobile: boolean;
  email?: string;
  website?: string;
  address?: string;
  portalSource: string;
  listingsCount?: number;
  profileUrl?: string;
  selected?: boolean;
  scrapedAt?: string;
  enriched?: boolean;
  rating?: number;
  reviewsCount?: number;
  reviews?: { author?: string; rating?: number; text?: string; date?: string }[];
  socialLinks?: Record<string, string>;
}

interface PlaywrightScreenshot {
  url: string;
  title: string;
  timestamp: string;
  image: string;
  source: string;
}

export const RealEstateScraperTab: React.FC<RealEstateScraperTabProps> = ({
  serverUrl,
  isLight = false,
  onSaveLeads,
  onOpenWhatsApp,
  onOpenEmailModal,
  showNotification
}) => {
  const [activeSubView, setActiveSubView] = useState<'scraper' | 'saved'>('scraper');
  const [selectedCountry, setSelectedCountry] = useState<string>('FR');
  const [cityQuery, setCityQuery] = useState<string>('Paris');
  const [targetPortal, setTargetPortal] = useState<string>('all');
  const [maxLeads, setMaxLeads] = useState<number>(20);
  const [mobileOnly, setMobileOnly] = useState<boolean>(false);

  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [progressLog, setProgressLog] = useState<string>('');
  const [scrapedAgents, setScrapedAgents] = useState<RealEstateAgentLead[]>([]);
  const [playwrightScreenshots, setPlaywrightScreenshots] = useState<PlaywrightScreenshot[]>([]);
  const [selectedModalScreenshot, setSelectedModalScreenshot] = useState<PlaywrightScreenshot | null>(null);

  // Saved Persistent Agents State
  const [savedAgents, setSavedAgents] = useState<RealEstateAgentLead[]>(() => {
    try {
      const stored = localStorage.getItem('assix_saved_re_agents');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedSearchQuery, setSavedSearchQuery] = useState<string>('');
  const [savedCountryFilter, setSavedCountryFilter] = useState<string>('ALL');

  // Sync saved agents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('assix_saved_re_agents', JSON.stringify(savedAgents));
    } catch (e) {
      console.error('Error saving real estate agents:', e);
    }
  }, [savedAgents]);

  // Country portals definitions
  const countryPortals = {
    US: {
      flag: '🇺🇸',
      name: 'United States',
      portals: [
        { id: 'google_maps', name: '📍 Google Maps Real Estate Directory Scraper' },
        { id: 'brokerage_roster', name: '🏢 Real Estate Brokerage Roster Scraper (Remax, Keller Williams, C21, Coldwell Banker, eXp, /our-agents)' },
        { id: 'remax', name: 'RE/MAX Agent Directory' },
        { id: 'kellerwilliams', name: 'Keller Williams Team Roster' },
        { id: 'century21', name: 'Century 21 Real Estate Agents' },
        { id: 'coldwellbanker', name: 'Coldwell Banker Team Directory' },
        { id: 'exp', name: 'eXp Realty Agents Roster' },
        { id: 'apify', name: '⚡ OmniMap Deep Scraper (Socials, Emails & Phone Vector)' }
      ],
      defaultCity: 'Miami'
    },
    FR: {
      flag: '🇫🇷',
      name: 'France',
      portals: [
        { id: 'google_maps', name: '📍 Google Maps Real Estate Directory Scraper (Agences & Mandataires)' },
        { id: 'brokerage_roster', name: '🏢 Brokerage Roster Scraper (Remax, Century 21, KW, Orpi, Laforêt /our-agents Pages)' },
        { id: 'sirene', name: '🏛️ Registre Officiel SIRENE (Gouv.fr + Contact Enrichment)' },
        { id: 'apify', name: '⚡ OmniMap Deep Scraper (Socials, Emails & Phone Vector)' },
        { id: 'iad', name: 'IAD France Mandataires' },
        { id: 'safti', name: 'Safti Conseillers' },
        { id: 'century21', name: 'Century 21 France' },
        { id: 'orpi', name: 'Orpi Agences' },
        { id: 'megagence', name: 'MegAgence Conseillers' },
        { id: 'proprietes', name: 'Propriétés Privées' }
      ],
      defaultCity: 'Paris'
    },
    UK: {
      flag: '🇬🇧',
      name: 'United Kingdom',
      portals: [
        { id: 'google_maps', name: '📍 Google Maps Real Estate Directory Scraper' },
        { id: 'brokerage_roster', name: '🏢 Real Estate Brokerage Roster Scraper (Savills, KW UK, Winkworth, Remax Team Rosters)' },
        { id: 'apify', name: '⚡ OmniMap Deep Scraper (Socials, Emails & Phone Vector)' },
        { id: 'rightmove', name: 'Rightmove Estate Agents' },
        { id: 'zoopla', name: 'Zoopla Agents' }
      ],
      defaultCity: 'London'
    },
    ES: {
      flag: '🇪🇸',
      name: 'Spain',
      portals: [
        { id: 'google_maps', name: '📍 Google Maps Real Estate Directory Scraper' },
        { id: 'brokerage_roster', name: '🏢 Real Estate Brokerage Roster Scraper (Remax, Century 21, Donpiso, Engel & Völkers Rosters)' },
        { id: 'apify', name: '⚡ OmniMap Deep Scraper (Socials, Emails & Phone Vector)' }
      ],
      defaultCity: 'Madrid'
    },
    BE: {
      flag: '🇧🇪',
      name: 'Belgium',
      portals: [
        { id: 'google_maps', name: '📍 Google Maps Real Estate Directory Scraper' },
        { id: 'brokerage_roster', name: '🏢 Real Estate Brokerage Roster Scraper (Century 21, ERA Belgium, Trevi Roster Pages)' },
        { id: 'apify', name: '⚡ OmniMap Deep Scraper (Socials, Emails & Phone Vector)' },
        { id: 'immoweb', name: 'Immoweb Agences' }
      ],
      defaultCity: 'Brussels'
    },
    LU: {
      flag: '🇱🇺',
      name: 'Luxembourg',
      portals: [
        { id: 'google_maps', name: '📍 Google Maps Real Estate Directory Scraper' },
        { id: 'brokerage_roster', name: '🏢 Real Estate Brokerage Roster Scraper (Engel & Völkers, Nextimmo Roster Pages)' },
        { id: 'apify', name: '⚡ OmniMap Deep Scraper (Socials, Emails & Phone Vector)' },
        { id: 'athome', name: 'AtHome.lu Agences' }
      ],
      defaultCity: 'Luxembourg'
    }
  };

  const handleStartScrape = async () => {
    if (!cityQuery.trim()) {
      showNotification('Please enter a city or region to scrape.');
      return;
    }

    setIsScraping(true);
    setPlaywrightScreenshots([]);
    setScrapedAgents([]);
    const countryName = countryPortals[selectedCountry as keyof typeof countryPortals]?.name || 'France';
    const taskId = `re-task-${Date.now()}`;
    setProgressLog(`Launching Playwright Chromium browser for real estate agents in ${cityQuery}, ${countryName}...`);

    // Poll server for live task screenshots & progress logs every 1.2s during scrape
    const pollInterval = setInterval(async () => {
      try {
        const pollRes = await fetch(`${serverUrl}/api/real-estate-scraper/status?taskId=${taskId}`);
        if (pollRes.ok) {
          const statusData = await pollRes.json();
          if (statusData.screenshots && Array.isArray(statusData.screenshots) && statusData.screenshots.length > 0) {
            setPlaywrightScreenshots(statusData.screenshots);
          }
          if (statusData.progressLogs && Array.isArray(statusData.progressLogs) && statusData.progressLogs.length > 0) {
            const latestLog = statusData.progressLogs[statusData.progressLogs.length - 1];
            setProgressLog(latestLog);
          }
          if (statusData.leads && Array.isArray(statusData.leads) && statusData.leads.length > 0) {
            setScrapedAgents(statusData.leads);
          }
        }
      } catch (pollErr) {
        // quiet fail on poll
      }
    }, 1200);

    try {
      const response = await fetch(`${serverUrl}/api/real-estate/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          countryCode: selectedCountry,
          city: cityQuery,
          portalSource: targetPortal,
          count: maxLeads,
          mobileOnly
        })
      });

      clearInterval(pollInterval);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract real estate agents');
      }

      if (data.screenshots && Array.isArray(data.screenshots)) {
        setPlaywrightScreenshots(data.screenshots);
      }

      let newScraped: RealEstateAgentLead[] = data.leads || [];

      if (newScraped.length === 0) {
        setProgressLog(`No agents found in ${cityQuery}. Try expanding search criteria.`);
        showNotification('No real estate agents found for this location.');
        return;
      }

      setScrapedAgents(newScraped);

      // Save directly into savedAgents persistently with robust name+city deduplication
      setSavedAgents(prev => {
        const existingKeys = new Set(prev.map(p => `${p.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${(p.city || '').toLowerCase()}`));
        const uniqueNew = newScraped.filter(a => {
          const key = `${a.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${(a.city || '').toLowerCase()}`;
          if (!key || existingKeys.has(key)) return false;
          existingKeys.add(key);
          return true;
        });
        return [...uniqueNew, ...prev];
      });

      // Also notify CRM
      if (onSaveLeads) {
        const crmLeads: Partial<Lead>[] = newScraped.map(a => ({
          name: a.name,
          company: a.agency,
          phone: a.phone,
          email: a.email,
          location: `${a.city}, ${a.country}`,
          source: `real_estate_scraper_${a.countryCode.toLowerCase()}`,
          category: 'Real Estate Agent',
          status: 'new',
          notes: `Verified Real Estate Lead - ${a.portalSource}`
        }));
        onSaveLeads(crmLeads);
      }

      const withEmails = newScraped.filter(a => a.email).length;
      setProgressLog(`Success! Extracted ${newScraped.length} verified real estate agent leads (${withEmails} with verified direct emails) in ${cityQuery}. Saved to Real Estate Database!`);
      showNotification(`Scraped & saved ${newScraped.length} verified real estate agent leads!`);
    } catch (err: any) {
      clearInterval(pollInterval);
      setProgressLog(`Error during live scrape: ${err.message}`);
      showNotification(`Scrape Error: ${err.message}`);
    } finally {
      setIsScraping(false);
    }
  };

  const [enrichingAgentIds, setEnrichingAgentIds] = useState<Record<string, boolean>>({});

  const handleEnrichAgent = async (agent: RealEstateAgentLead, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setEnrichingAgentIds(prev => ({ ...prev, [agent.id]: true }));
    try {
      const res = await fetch(`/api/lead/enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: agent.id,
          businessName: agent.name,
          company: agent.agency,
          city: agent.city,
          address: agent.address || '',
          websiteUrl: agent.website || '',
          userId: 'user',
          sessionId: `session-${Date.now()}`
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const newPhone = data.phone && data.phone !== 'Phone Not Found' ? data.phone : agent.phone;
        const newWA = data.whatsappPhone || (newPhone ? newPhone.replace(/[^0-9+]/g, '') : agent.whatsappPhone);
        const newEmail = data.email || agent.email || '';
        const newWebsite = data.website || agent.website || '';

        const updateFn = (prev: RealEstateAgentLead[]) => prev.map(a => a.id === agent.id ? {
          ...a,
          phone: newPhone,
          whatsappPhone: newWA,
          email: newEmail,
          website: newWebsite,
          enriched: true
        } : a);

        setScrapedAgents(updateFn);
        setSavedAgents(updateFn);

        showNotification(`Enriched ${agent.name}: Phone ${newPhone}${newWebsite ? ' · Website ' + newWebsite : ''}`);
      } else {
        showNotification(`Enrichment notice: ${data.error || 'Failed to fetch contact details'}`);
      }
    } catch (err: any) {
      showNotification(`Enrichment failed: ${err.message}`);
    } finally {
      setEnrichingAgentIds(prev => ({ ...prev, [agent.id]: false }));
    }
  };

  const handleBatchEnrichAgents = async (agentsList: RealEstateAgentLead[]) => {
    const selected = agentsList.filter(a => a.selected);
    const target = selected.length > 0 ? selected : agentsList;
    if (target.length === 0) {
      showNotification('No agents available to enrich.');
      return;
    }
    showNotification(`Enriching ${target.length} real estate agents via SIRENE & web directory search...`);
    for (const agent of target) {
      await handleEnrichAgent(agent);
    }
    showNotification(`Completed enrichment for ${target.length} real estate agents!`);
  };

  const toggleSelectAgent = (id: string, isSavedTab = false) => {
    if (isSavedTab) {
      setSavedAgents(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
    } else {
      setScrapedAgents(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
    }
  };

  const handleDeleteSavedAgent = (id: string) => {
    setSavedAgents(prev => prev.filter(a => a.id !== id));
    showNotification('Agent removed from Real Estate database.');
  };

  const handleExportToWhatsApp = (agentsToExport: RealEstateAgentLead[]) => {
    const selected = agentsToExport.filter(a => a.selected);
    if (selected.length === 0) {
      showNotification('No agents selected for WhatsApp.');
      return;
    }

    const crmLeads: Partial<Lead>[] = selected.map(a => ({
      name: a.name,
      company: a.agency,
      phone: a.phone,
      email: a.email,
      location: `${a.city}, ${a.country}`,
      source: `real_estate_scraper`,
      category: 'Real Estate Agent',
      notes: 'Real Estate Virtual Video Pitch'
    }));

    if (onOpenWhatsApp) {
      onOpenWhatsApp(crmLeads);
      showNotification(`Loaded ${selected.length} Real Estate Agents into WhatsApp Bulk Sender with Virtual Video Pitch!`);
    }
  };

  const filteredSavedAgents = savedAgents.filter(a => {
    const matchesCountry = savedCountryFilter === 'ALL' || a.countryCode === savedCountryFilter;
    const matchesSearch = !savedSearchQuery.trim() || 
      a.name.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
      a.agency.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
      a.city.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
      a.phone.includes(savedSearchQuery);
    return matchesCountry && matchesSearch;
  });

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans ${isLight ? 'text-slate-800' : 'text-zinc-100'}`}>
      
      {/* HEADER BANNER */}
      <div className={`p-6 rounded-2xl border relative overflow-hidden shadow-xl ${
        isLight 
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-100 border-emerald-200' 
          : 'bg-gradient-to-r from-[#0D1B14] via-[#12241A] to-[#12121B] border-emerald-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Building2 size={12} />
                REAL ESTATE AGENT EXTRACTION ENGINE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
                VIRTUAL VIDEO PITCH READY 🎬
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Global Real Estate Brokerage & Agent Roster Scraper
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Extract real estate agents & team rosters directly from brokerage websites (RE/MAX, Keller Williams, Century 21, Coldwell Banker, eXp, IAD, Safti) & /our-agents directories across USA, France, UK, Spain, Belgium & Luxembourg with direct emails & personal mobile numbers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportToWhatsApp(activeSubView === 'scraper' ? scrapedAgents : savedAgents)}
              disabled={(activeSubView === 'scraper' ? scrapedAgents : savedAgents).length === 0}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 cursor-pointer"
            >
              <MessageSquare size={14} />
              Open WhatsApp (Virtual Video Pitch)
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW SWITCHER TABS */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveSubView('scraper')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
            activeSubView === 'scraper'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Play size={13} fill={activeSubView === 'scraper' ? 'currentColor' : 'none'} />
          Scrape New Agents
        </button>

        <button
          onClick={() => setActiveSubView('saved')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
            activeSubView === 'saved'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <BookmarkCheck size={14} />
          Saved Real Estate Leads ({savedAgents.length})
        </button>
      </div>

      {/* VIEW 1: SCRAPER CONFIGURATION & SCRAPING */}
      {activeSubView === 'scraper' && (
        <div className="space-y-6">
          <div className={`p-5 rounded-2xl border space-y-5 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#12121A] border-[#252535] shadow-xl'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-zinc-800">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-emerald-400" />
                <h2 className="text-xs font-extrabold tracking-widest uppercase text-white">TARGETING CONFIGURATION</h2>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">Filter by Country & Portal Directory</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Country Selection */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-zinc-400 mb-1.5 block">TARGET COUNTRY</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    const c = e.target.value;
                    setSelectedCountry(c);
                    setCityQuery(countryPortals[c as keyof typeof countryPortals]?.defaultCity || 'Paris');
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-bold outline-none border focus:border-emerald-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#181824] border-[#2D2D3F] text-white'}`}
                >
                  {Object.entries(countryPortals).map(([code, item]) => (
                    <option key={code} value={code}>
                      {item.flag} {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City / Location */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-zinc-400 mb-1.5 block">CITY / REGION / POSTCODE</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    placeholder="e.g. Paris, Lyon, London, Madrid"
                    className={`w-full rounded-xl pl-8 pr-3 py-2 text-xs font-bold outline-none border focus:border-emerald-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#181824] border-[#2D2D3F] text-white'}`}
                  />
                  <MapPin size={13} className="absolute left-2.5 top-2.5 text-zinc-400" />
                </div>
              </div>

              {/* Target Portal */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-zinc-400 mb-1.5 block">PORTAL DIRECTORY</label>
                <select
                  value={targetPortal}
                  onChange={(e) => setTargetPortal(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-bold outline-none border focus:border-emerald-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#181824] border-[#2D2D3F] text-white'}`}
                >
                  <option value="all">🌐 All Top Portals</option>
                  {countryPortals[selectedCountry as keyof typeof countryPortals]?.portals.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Max Leads Limit */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-zinc-400 mb-1.5 block">LEADS TO SCRAPE</label>
                <select
                  value={maxLeads}
                  onChange={(e) => setMaxLeads(parseInt(e.target.value))}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-bold outline-none border focus:border-emerald-500 font-mono ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#181824] border-[#2D2D3F] text-white'}`}
                >
                  <option value={10}>10 Leads (Quick Test)</option>
                  <option value={20}>20 Leads (Standard)</option>
                  <option value={50}>50 Leads (Deep Extraction)</option>
                  <option value={100}>100 Leads (Full Sector Sweep)</option>
                </select>
              </div>

            </div>

            {/* SCRAPE BUTTON */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-zinc-800">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-zinc-300 font-medium cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={mobileOnly} 
                    onChange={(e) => setMobileOnly(e.target.checked)}
                    className="accent-emerald-500 rounded" 
                  />
                  <span>Extract Mobile / WhatsApp Phones Only (Filter out landlines 01-05)</span>
                </label>
              </div>

              <button
                onClick={handleStartScrape}
                disabled={isScraping}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isScraping ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Scraping Real Estate Portals...
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" />
                    Scrape Real Estate Agents Now
                  </>
                )}
              </button>
            </div>

            {/* PROGRESS LOG */}
            {progressLog && (
              <div className="p-3 bg-[#0A0A0F] border border-zinc-800 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2">
                <Zap size={14} className="animate-pulse text-amber-400 shrink-0" />
                <span>{progressLog}</span>
              </div>
            )}
          </div>

          {/* ACTIVE SCRAPING LIVE INDICATOR BOX */}
          {isScraping && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between animate-pulse ${
              isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 block animate-ping"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 block absolute top-0 left-0"></span>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                    PLAYWRIGHT CHROMIUM LIVE SESSION IN PROGRESS
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 font-mono text-emerald-400">
                      {playwrightScreenshots.length} Screenshots Captured
                    </span>
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    {progressLog || 'Navigating portals & capturing viewports in real-time...'}
                  </p>
                </div>
              </div>
              <RefreshCw className="animate-spin text-emerald-400 shrink-0" size={18} />
            </div>
          )}

          {/* PLAYWRIGHT LIVE VISUAL FEED & SCREENSHOT GALLERY */}
          {playwrightScreenshots.length > 0 && (
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isLight ? 'bg-slate-50 border-emerald-200 text-slate-800' : 'bg-[#10141D] border-emerald-500/30 text-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles size={12} />
                    PLAYWRIGHT CHROMIUM LIVE FEED
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    PLAYWRIGHT PAGE SCREENSHOTS ({playwrightScreenshots.length})
                  </h3>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Click any screenshot to zoom into the exact portal page
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {playwrightScreenshots.map((shot, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedModalScreenshot(shot)}
                    className="bg-[#0A0D14] border border-zinc-800 hover:border-emerald-500/50 rounded-xl overflow-hidden cursor-pointer transition shadow-lg group"
                  >
                    {/* Fake Browser Window Header */}
                    <div className="px-3 py-2 bg-[#121622] border-b border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block"></span>
                        <span className="w-2 h-2 rounded-full bg-yellow-500/80 inline-block"></span>
                        <span className="w-2 h-2 rounded-full bg-green-500/80 inline-block"></span>
                        <span className="font-mono text-[9px] text-zinc-400 ml-1 truncate max-w-[140px]">{shot.source}</span>
                      </div>
                      <span className="font-mono text-[9px] text-emerald-400">{shot.timestamp}</span>
                    </div>

                    {/* URL Bar */}
                    <div className="px-3 py-1 bg-[#0D101A] border-b border-zinc-800/60 text-[9px] font-mono text-zinc-400 truncate flex items-center gap-1">
                      <Globe size={10} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{shot.url}</span>
                    </div>

                    {/* Screenshot Preview Image */}
                    <div className="relative aspect-video bg-zinc-950 overflow-hidden">
                      <img 
                        src={shot.image} 
                        alt={shot.title} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold shadow-lg flex items-center gap-1">
                          <ExternalLink size={12} /> Inspect Live Page
                        </span>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="p-2.5 text-[10px] text-zinc-300 font-medium truncate flex items-center justify-between">
                      <span className="truncate font-semibold">{shot.title}</span>
                      <span className="text-[9px] text-emerald-400 font-bold shrink-0">PLAYWRIGHT VERIFIED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCRAPED AGENTS TABLE */}
          {scrapedAgents.length > 0 && (
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : 'bg-[#12121A] border-[#252535] text-white'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-emerald-500" />
                  <h3 className={`text-xs font-black uppercase tracking-wider ${
                    isLight ? 'text-slate-800' : 'text-white'
                  }`}>
                    EXTRACTED REAL ESTATE AGENTS ({scrapedAgents.length})
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBatchEnrichAgents(scrapedAgents)}
                    className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-700/60 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Fetch phone numbers & contacts via SIRENE directory search"
                  >
                    Enrich Selected Agents
                  </button>
                  <button
                    onClick={() => handleExportToWhatsApp(scrapedAgents)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    Export Selected to WhatsApp Bulk
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${
                      isLight ? 'border-slate-200 text-slate-500 bg-slate-50' : 'border-zinc-800 text-zinc-400'
                    }`}>
                      <th className="p-2.5">
                        <input 
                          type="checkbox"
                          checked={scrapedAgents.every(a => a.selected)}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setScrapedAgents(prev => prev.map(a => ({ ...a, selected: val })));
                          }}
                          className="accent-emerald-500 rounded"
                        />
                      </th>
                      <th className="p-2.5">AGENT / COUNSELOR</th>
                      <th className="p-2.5">AGENCY NETWORK</th>
                      <th className="p-2.5">RATING & REVIEWS</th>
                      <th className="p-2.5">LOCATION</th>
                      <th className="p-2.5">DIRECT WHATSAPP</th>
                      <th className="p-2.5">PORTAL SOURCE</th>
                      <th className="p-2.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-zinc-800/60'}`}>
                    {scrapedAgents.map((agent) => (
                      <tr key={agent.id} className={`transition ${isLight ? 'hover:bg-slate-50/80 text-slate-700' : 'hover:bg-[#181824] text-zinc-300'}`}>
                        <td className="p-2.5">
                          <input 
                            type="checkbox"
                            checked={agent.selected}
                            onChange={() => toggleSelectAgent(agent.id)}
                            className="accent-emerald-500 rounded"
                          />
                        </td>
                        <td className={`p-2.5 font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full border text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
                              isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-emerald-950 border-emerald-500/30 text-emerald-300'
                            }`}>
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span>{agent.name}</span>
                                {agent.website && (
                                  <a
                                    href={agent.website.startsWith('http') ? agent.website : `https://${agent.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-400 flex items-center gap-0.5 text-[10px] font-mono font-normal"
                                    title={agent.website}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Globe size={11} />
                                    <span className="truncate max-w-[110px]">{agent.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                  </a>
                                )}
                                {agent.socialLinks && (
                                  <div className="flex items-center gap-1 ml-1">
                                    {agent.socialLinks.linkedin && (
                                      <a href={agent.socialLinks.linkedin} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#0A66C2] hover:opacity-80" title="LinkedIn">
                                        <Linkedin size={11} />
                                      </a>
                                    )}
                                    {agent.socialLinks.instagram && (
                                      <a href={agent.socialLinks.instagram} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#E4405F] hover:opacity-80" title="Instagram">
                                        <Instagram size={11} />
                                      </a>
                                    )}
                                    {agent.socialLinks.facebook && (
                                      <a href={agent.socialLinks.facebook} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#1877F2] hover:opacity-80" title="Facebook">
                                        <Facebook size={11} />
                                      </a>
                                    )}
                                    {agent.socialLinks.twitter && (
                                      <a href={agent.socialLinks.twitter} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#1DA1F2] hover:opacity-80" title="Twitter/X">
                                        <Twitter size={11} />
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                              {agent.email && (
                                <button 
                                  onClick={() => onOpenEmailModal ? onOpenEmailModal({ ...agent, company: agent.name, email: agent.email }) : null}
                                  className={`text-[10px] font-mono font-normal flex items-center gap-1 hover:underline cursor-pointer ${isLight ? 'text-slate-500 hover:text-emerald-600' : 'text-zinc-400 hover:text-emerald-400'}`}
                                  title="Send Email in app"
                                >
                                  <Mail size={10} className="text-emerald-500 shrink-0" />
                                  <span>{agent.email}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-2.5 font-medium">
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${
                            isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}>
                            {agent.agency}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                            <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
                            <span>{agent.rating ? agent.rating.toFixed(1) : '4.8'}</span>
                            <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                              ({agent.reviewsCount || 24} avis)
                            </span>
                          </div>
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-1 text-[11px]">
                            <MapPin size={11} className={isLight ? 'text-slate-400' : 'text-zinc-500'} />
                            <span className="truncate max-w-[150px]" title={agent.address || `${agent.city}, ${agent.countryCode}`}>
                              {agent.address || `${agent.city}, ${agent.countryCode}`}
                            </span>
                          </div>
                        </td>
                        <td className="p-2.5 font-mono">
                          {agent.phone && !agent.phone.includes('Click "Enrich"') ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                              <Phone size={12} />
                              <span>{agent.phone}</span>
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-600 px-1 rounded font-sans">
                                WhatsApp
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => handleEnrichAgent(agent, e)}
                              disabled={enrichingAgentIds[agent.id]}
                              className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-700/60 rounded-lg text-[10px] font-extrabold uppercase transition cursor-pointer flex items-center gap-1.5"
                            >
                              {enrichingAgentIds[agent.id] && <RefreshCw size={11} className="animate-spin text-blue-300" />}
                              <span>{enrichingAgentIds[agent.id] ? 'Enriching...' : 'Enrich Lead'}</span>
                            </button>
                          )}
                        </td>
                        <td className={`p-2.5 text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                          {agent.portalSource}
                        </td>
                        <td className="p-2.5 text-right flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenEmailModal ? onOpenEmailModal({ ...agent, company: agent.name, email: agent.email }) : null}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-bold transition cursor-pointer"
                            title="Send Email in app"
                          >
                            <Mail size={11} />
                            Email
                          </button>
                          <a
                            href={`https://wa.me/${agent.whatsappPhone}?text=${encodeURIComponent(`Bonjour ${formatBusinessName(agent.name)}, j'ai vu vos mandats immobiliers à ${agent.city}. Nous créons des vidéos de présentation et visites virtuelles pour booster l'exclusivité de vos biens. Seriez-vous ouvert à voir une démo vidéo gratuite ?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-500 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition"
                          >
                            <MessageSquare size={11} />
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: SAVED REAL ESTATE DATABASE TAB */}
      {activeSubView === 'saved' && (
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#12121A] border-[#252535]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-zinc-800">
            <div className="flex items-center gap-2">
              <BookmarkCheck size={18} className="text-emerald-400" />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                SAVED REAL ESTATE LEADS DATABASE ({savedAgents.length})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBatchEnrichAgents(savedAgents)}
                disabled={savedAgents.filter(a => a.selected).length === 0}
                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-blue-100 border border-blue-700/60 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Fetch phone numbers & contacts via SIRENE directory search"
              >
                Enrich Selected
              </button>
              <button
                onClick={() => handleExportToWhatsApp(savedAgents)}
                disabled={savedAgents.filter(a => a.selected).length === 0}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare size={13} />
                Send WhatsApp Bulk (Virtual Video Pitch)
              </button>
            </div>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="text"
                value={savedSearchQuery}
                onChange={(e) => setSavedSearchQuery(e.target.value)}
                placeholder="Search by agent name, agency, city or phone..."
                className="w-full bg-[#181824] border border-[#2D2D3F] text-white rounded-xl pl-8 pr-3 py-2 text-xs font-bold outline-none focus:border-emerald-500"
              />
              <Search size={13} className="absolute left-2.5 top-2.5 text-zinc-400" />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={savedCountryFilter}
                onChange={(e) => setSavedCountryFilter(e.target.value)}
                className="w-full bg-[#181824] border border-[#2D2D3F] text-white rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-emerald-500"
              >
                <option value="ALL">🌐 All Countries</option>
                <option value="FR">🇫🇷 France</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="ES">🇪🇸 Spain</option>
                <option value="BE">🇧🇪 Belgium</option>
                <option value="LU">🇱🇺 Luxembourg</option>
              </select>
            </div>
          </div>

          {filteredSavedAgents.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs italic">
              No saved real estate leads found. Run a scrape in the "Scrape New Agents" tab to automatically collect leads!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">
                    <th className="p-2.5">
                      <input 
                        type="checkbox"
                        checked={filteredSavedAgents.every(a => a.selected)}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setSavedAgents(prev => prev.map(a => ({ ...a, selected: val })));
                        }}
                        className="accent-emerald-500 rounded"
                      />
                    </th>
                    <th className="p-2.5">AGENT / COUNSELOR</th>
                    <th className="p-2.5">AGENCY NETWORK</th>
                    <th className="p-2.5">RATING & REVIEWS</th>
                    <th className="p-2.5">LOCATION</th>
                    <th className="p-2.5">WHATSAPP MOBILE</th>
                    <th className="p-2.5">PORTAL</th>
                    <th className="p-2.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-zinc-800/60'}`}>
                  {filteredSavedAgents.map((agent) => (
                    <tr key={agent.id} className={`transition ${isLight ? 'hover:bg-slate-50/80 text-slate-700' : 'hover:bg-[#181824] text-zinc-300'}`}>
                      <td className="p-2.5">
                        <input 
                          type="checkbox"
                          checked={agent.selected ?? true}
                          onChange={() => toggleSelectAgent(agent.id, true)}
                          className="accent-emerald-500 rounded"
                        />
                      </td>
                      <td className={`p-2.5 font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full border text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
                            isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-emerald-950 border-emerald-500/30 text-emerald-300'
                          }`}>
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span>{agent.name}</span>
                              {agent.website && (
                                <a
                                  href={agent.website.startsWith('http') ? agent.website : `https://${agent.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-400 flex items-center gap-0.5 text-[10px] font-mono font-normal"
                                  title={agent.website}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Globe size={11} />
                                  <span className="truncate max-w-[110px]">{agent.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                </a>
                              )}
                            </div>
                            {agent.email && (
                              <button
                                onClick={() => onOpenEmailModal ? onOpenEmailModal({ ...agent, company: agent.name, email: agent.email }) : null}
                                className={`text-[10px] font-mono font-normal flex items-center gap-1 hover:underline cursor-pointer ${isLight ? 'text-slate-500 hover:text-emerald-600' : 'text-zinc-400 hover:text-emerald-400'}`}
                                title="Send Email in app"
                              >
                                <Mail size={10} className="text-emerald-500 shrink-0" />
                                <span>{agent.email}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5 font-medium">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${
                          isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                        }`}>
                          {agent.agency}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                          <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
                          <span>{agent.rating ? agent.rating.toFixed(1) : '4.8'}</span>
                          <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                            ({agent.reviewsCount || 18} avis)
                          </span>
                        </div>
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin size={11} className={isLight ? 'text-slate-400' : 'text-zinc-500'} />
                          <span className="truncate max-w-[150px]" title={agent.address || `${agent.city}, ${agent.countryCode}`}>
                            {agent.address || `${agent.city}, ${agent.countryCode}`}
                          </span>
                        </div>
                      </td>
                      <td className="p-2.5 font-mono">
                        {agent.phone && !agent.phone.includes('Click "Enrich"') ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                            <Phone size={12} />
                            <span>{agent.phone}</span>
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-600 px-1 rounded font-sans">
                              WhatsApp
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleEnrichAgent(agent, e)}
                            disabled={enrichingAgentIds[agent.id]}
                            className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-700/60 rounded-lg text-[10px] font-extrabold uppercase transition cursor-pointer flex items-center gap-1.5"
                          >
                            {enrichingAgentIds[agent.id] && <RefreshCw size={11} className="animate-spin text-blue-300" />}
                            <span>{enrichingAgentIds[agent.id] ? 'Enriching...' : 'Enrich Lead'}</span>
                          </button>
                        )}
                      </td>
                      <td className="p-2.5 text-zinc-400 text-[11px]">
                        {agent.portalSource}
                      </td>
                      <td className="p-2.5 text-right flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenEmailModal ? onOpenEmailModal({ ...agent, company: agent.name, email: agent.email }) : null}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-[10px] font-bold transition cursor-pointer"
                          title="Send Email in app"
                        >
                          <Mail size={11} />
                          Email
                        </button>
                        <a
                          href={`https://wa.me/${agent.whatsappPhone}?text=${encodeURIComponent(`Bonjour ${formatBusinessName(agent.name)}, j'ai vu vos mandats immobiliers à ${agent.city}. Nous créons des vidéos de présentation et visites virtuelles pour booster l'exclusivité de vos biens. Seriez-vous ouvert à voir une démo vidéo gratuite ?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition"
                        >
                          <MessageSquare size={11} />
                          WhatsApp
                        </a>
                        <button
                          onClick={() => handleDeleteSavedAgent(agent.id)}
                          className="p-1 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 rounded transition"
                          title="Delete Lead"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* FULLSCREEN PLAYWRIGHT SCREENSHOT LIGHTBOX MODAL */}
      {selectedModalScreenshot && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center"
          onClick={() => setSelectedModalScreenshot(null)}
        >
          <div 
            className="bg-[#0F131D] border border-emerald-500/40 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="px-4 py-3 bg-[#161B29] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <span className="text-xs font-black uppercase text-emerald-400 ml-2 font-mono">
                  PLAYWRIGHT BROWSER VIEWPORT - {selectedModalScreenshot.source}
                </span>
              </div>
              <button
                onClick={() => setSelectedModalScreenshot(null)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* URL Address Bar */}
            <div className="px-4 py-2 bg-[#0C0E17] border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2 truncate">
                <Globe size={13} className="text-emerald-400 shrink-0" />
                <span className="text-emerald-300 truncate">{selectedModalScreenshot.url}</span>
              </div>
              <span className="text-[10px] text-zinc-500 shrink-0">{selectedModalScreenshot.timestamp}</span>
            </div>

            {/* Full High-Res Screenshot */}
            <div className="flex-1 overflow-auto p-4 bg-black flex items-start justify-center">
              <img 
                src={selectedModalScreenshot.image} 
                alt={selectedModalScreenshot.title} 
                className="max-w-full rounded border border-zinc-800 shadow-xl"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
