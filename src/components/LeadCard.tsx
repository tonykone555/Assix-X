import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Phone, 
  MapPin, 
  ExternalLink, 
  CheckCircle, 
  Check,
  Mail, 
  Linkedin, 
  MessageSquare, 
  X, 
  Sparkles,
  Facebook,
  Instagram,
  Twitter,
  Star,
  Clock,
  LayoutTemplate,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  User,
  ShieldCheck,
  RefreshCw,
  MoreVertical,
  Copy
} from 'lucide-react';
import { WebsiteGeneratorPanel } from './WebsiteGeneratorPanel';
import { formatBusinessName } from '../../services/nicheEmailTemplates';

interface LeadCardProps {
  lead: any;
  onPushLead?: (leadId: string) => void;
  isPushing?: boolean;
  serverUrl?: string;
  onSkip?: (leadId: string) => void;
  selected?: boolean;
  onSelectToggle?: (leadId: string) => void;
  onGenerateWebsite?: (lead: any) => void;
  onEnrichLead?: (lead: any) => Promise<void> | void;
  isEnriching?: boolean;
  leadNumber?: number;
  onOpenInbox?: (lead: any) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  onPushLead, 
  isPushing, 
  serverUrl,
  onSkip,
  selected = false,
  onSelectToggle,
  onGenerateWebsite,
  onEnrichLead,
  isEnriching: isEnrichingProps = false,
  leadNumber,
  onOpenInbox
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedSecondaryPhone, setCopiedSecondaryPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isEnrichingState, setIsEnrichingState] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const activeEnriching = isEnrichingProps || isEnrichingState;
  const [enrichResult, setEnrichResult] = useState<{ email?: string; phone?: string; secondaryPhone?: string; socialLinks?: any; websiteAudit?: any; uniqueness?: string } | null>(
    lead.email || lead.phone || lead.secondaryPhone || lead.socialLinks || lead.websiteAudit || lead.uniqueness || lead.pitch
      ? { email: lead.email, phone: lead.phone, secondaryPhone: lead.secondaryPhone, socialLinks: lead.socialLinks, websiteAudit: lead.websiteAudit, uniqueness: lead.uniqueness || lead.pitch } 
      : null
  );

  useEffect(() => {
    if (lead.email || lead.phone || lead.secondaryPhone || lead.socialLinks || lead.websiteAudit || lead.uniqueness || lead.pitch) {
      setEnrichResult(prev => ({
        ...prev,
        email: lead.email || prev?.email,
        phone: lead.phone || prev?.phone,
        secondaryPhone: lead.secondaryPhone || prev?.secondaryPhone,
        socialLinks: lead.socialLinks || prev?.socialLinks,
        websiteAudit: lead.websiteAudit || prev?.websiteAudit,
        uniqueness: lead.uniqueness || lead.pitch || prev?.uniqueness
      }));
    }
  }, [lead.email, lead.phone, lead.secondaryPhone, lead.socialLinks, lead.websiteAudit, lead.uniqueness, lead.pitch, lead.enriched]);

  const handleCopyPhone = () => {
    const phone = primaryPhone || lead.phone || '';
    if (phone) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleEnrich = async () => {
    setIsEnrichingState(true);
    try {
      if (onEnrichLead) {
        await onEnrichLead(lead);
      } else {
        const res = await fetch(`${serverUrl || ''}/api/lead/enrich`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: lead.leadId || lead.id,
            websiteUrl: lead.website,
            businessName: lead.businessName || lead.company || lead.name,
            company: lead.company || lead.businessName || lead.name,
            name: lead.name || lead.businessName || lead.company,
            city: lead.city || lead.location,
            address: lead.address,
            siren: lead.siren,
            siret: lead.siret,
            contactName: lead.contactName || lead.dirigeant,
            dirigeant: lead.dirigeant || lead.contactName,
            nafCode: lead.nafCode,
            phone: lead.phone,
            email: lead.email,
            niche: lead.niche || lead.sector,
            userId: 'user',
            sessionId: `session-${Date.now()}`
          })
        });
        const data = await res.json();
        if (data.success) {
          const foundPhone = data.phone || data.secondaryPhone;
          const foundUniqueness = data.uniqueness || data.pitch;
          setEnrichResult({ 
            email: data.email, 
            phone: foundPhone,
            secondaryPhone: data.secondaryPhone,
            socialLinks: data.socialLinks, 
            websiteAudit: data.websiteAudit,
            uniqueness: foundUniqueness
          });
          lead.email = data.email || lead.email;
          if (foundPhone) lead.phone = foundPhone;
          lead.secondaryPhone = data.secondaryPhone || lead.secondaryPhone;
          lead.socialLinks = data.socialLinks || lead.socialLinks;
          lead.websiteAudit = data.websiteAudit || lead.websiteAudit;
          if (data.website) lead.website = data.website;
          if (foundUniqueness) {
            lead.uniqueness = foundUniqueness;
            lead.pitch = foundUniqueness;
          }
          lead.enriched = true;
        }
      }
    } catch (err) {
      console.error("Enrichment error:", err);
    } finally {
      setIsEnrichingState(false);
    }
  };

  const rawWebsite = lead.website || '';
  const isGoogleMapsUrl = (url: string) => {
    if (!url) return false;
    const l = url.toLowerCase();
    return l.includes('google.com/maps') || l.includes('maps.google.com') || l.includes('goo.gl/maps') || l.includes('maps.app.goo.gl') || l.includes('google.com/place') || l.includes('search.google.com');
  };
  const hasGoogleMapsOnly = isGoogleMapsUrl(rawWebsite);
  const hasRealWebsite = Boolean(rawWebsite && !hasGoogleMapsOnly);
  const currentEmail = enrichResult?.email || lead.email;
  const primaryPhone = enrichResult?.phone || enrichResult?.secondaryPhone || lead.phone;
  const secondaryPhone = (enrichResult?.secondaryPhone && enrichResult.secondaryPhone !== primaryPhone) 
    ? enrichResult.secondaryPhone 
    : (lead.secondaryPhone !== primaryPhone ? lead.secondaryPhone : null);

  const domain = lead.website ? lead.website.replace(/https?:\/\/|www\./g, '') : '';
  const faviconUrl = lead.website ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(lead.website)}&sz=64` : null;
  const companyLogoUrl = lead.logo || lead.avatar || lead.profilePic || lead.photo || faviconUrl;

  const formatSourceTitle = (l: any) => {
    if (l.sourceRun && l.sourceRun.trim()) return l.sourceRun.trim();
    if (l.sourceTitle && l.sourceTitle.trim()) return l.sourceTitle.trim();
    if (l.query && l.query.trim()) return `Query: ${l.query.trim()}`;
    if (l.searchQuery && l.searchQuery.trim()) return `Query: ${l.searchQuery.trim()}`;
    if (l.category && l.category.trim()) return `Category: ${l.category.trim()}`;
    if (l.niche && l.niche.trim()) return `Niche: ${l.niche.trim()}`;
    if (l.sector && l.sector.trim()) return `Sector: ${l.sector.trim()}`;
    if (l.source && l.source.trim()) return `Source: ${l.source.replace(/_/g, ' ').toUpperCase()}`;
    return 'Campaign: Discovery Run';
  };

  const sourceRunTitle = formatSourceTitle(lead);
  const displayName = formatBusinessName(
    lead.company || lead.businessName || lead.name || lead.title || 'Prospect Lead'
  );
  const displaySector = lead.sector || lead.source || 'Niche';
  const displayCity = lead.city || 'City';

  return (
    <div className={`bg-slate-50 dark:bg-[#070709] backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full group shadow-md dark:shadow-xl dark:shadow-black/70 relative font-['SF_Pro_Text','Helvetica_Neue',Helvetica,Arial,sans-serif] ${selected ? 'border-[#7C5335] ring-2 ring-[#7C5335]/40 shadow-[#7C5335]/15' : 'border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-500/40 hover:bg-slate-100/60 dark:hover:bg-[#0d0e15] hover:shadow-emerald-500/10'}`}>
      
      {/* CARD TOP INFO ROW - Seamless Header (Faded into the card body) */}
      <div className="p-3.5 flex items-center justify-between gap-2.5 bg-slate-100/60 dark:bg-white/[0.03] rounded-t-2xl border-b border-slate-200/60 dark:border-white/[0.04]">
        <div className="flex items-center gap-2 truncate">
          {leadNumber !== undefined && (
            <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/60 border border-blue-300/60 dark:border-blue-400/30 text-blue-800 dark:text-blue-100 font-mono text-[9px] font-black rounded-md shrink-0">
              #{leadNumber}
            </span>
          )}
          {onSelectToggle && (
            <input 
              type="checkbox"
              checked={selected}
              onChange={() => onSelectToggle(lead.leadId)}
              className="mr-0.5 bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 rounded text-red-500 focus:ring-red-500 w-3.5 h-3.5 cursor-pointer"
            />
          )}

          {/* Company Logo or Website Favicon (with fallback to default avatar icon) */}
          <div className="w-6.5 h-6.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300/80 dark:border-zinc-700/80 text-slate-500 dark:text-zinc-400 flex items-center justify-center shrink-0 overflow-hidden select-none shadow-sm p-0.5">
            {companyLogoUrl && typeof companyLogoUrl === 'string' && companyLogoUrl.startsWith('http') ? (
              <img 
                src={companyLogoUrl} 
                alt={displayName} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded" 
                onError={(e) => { 
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <User size={13} className="text-slate-500 dark:text-zinc-400" />
            )}
          </div>

          {lead.source?.startsWith('facebook') && (
            <Facebook className="w-3.5 h-3.5 text-[#1877F2] shrink-0" />
          )}

          <div className="truncate flex flex-col min-w-0">
            <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate" title={displayName}>
              {displayName}
            </h4>
            <span className="text-[8.5px] font-bold text-blue-600 dark:text-blue-400 opacity-90 truncate flex items-center gap-1 mt-0.5" title={`Source Campaign / Run: ${sourceRunTitle}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block shrink-0"></span>
              <span className="truncate">{sourceRunTitle}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Demo Data Badge if applicable */}
          {lead.isFallback && (
            <div className="px-2 py-0.5 rounded border border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400 text-[8px] font-extrabold tracking-wider select-none">
              DEMO
            </div>
          )}

          {/* Enrichment Status Indicator */}
          {activeEnriching ? (
            <div className="px-2 py-0.5 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[8.5px] font-extrabold tracking-wider uppercase select-none flex items-center gap-1 animate-pulse">
              <RefreshCw size={8} className="animate-spin text-amber-500 dark:text-amber-400" />
              <span>Enriching...</span>
            </div>
          ) : lead.enriched ? (
            <div className="px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8.5px] font-black uppercase tracking-wider select-none flex items-center gap-1">
              <Check size={8} />
              <span>Enriched</span>
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded-full border border-slate-300 dark:border-zinc-700/60 bg-slate-100 dark:bg-zinc-800/60 text-slate-500 dark:text-zinc-400 text-[8.5px] font-bold uppercase tracking-wider select-none flex items-center gap-1">
              <span>Unenriched</span>
            </div>
          )}

          {/* 3 DOTS MENU BUTTON & DROPDOWN */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="More Options"
            >
              <MoreVertical size={15} />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-7 w-48 bg-white dark:bg-[#12131A] border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs font-sans animate-fade-in space-y-0.5"
                onClick={() => setShowMenu(false)}
              >
                <button 
                  onClick={handleEnrich}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-bold flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={12} className="text-amber-500" />
                  <span>Enrich Lead Data</span>
                </button>

                {(currentEmail || lead.email) && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(currentEmail || lead.email);
                      setCopiedEmail(true);
                      setTimeout(() => setCopiedEmail(false), 2000);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Copy size={12} className="text-emerald-500" />
                    <span>Copy Email Address</span>
                  </button>
                )}

                {(primaryPhone || lead.phone) && (
                  <button 
                    onClick={handleCopyPhone}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Phone size={12} className="text-blue-500" />
                    <span>Copy Phone Number</span>
                  </button>
                )}

                {lead.website && (
                  <a 
                    href={lead.website}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Globe size={12} className="text-indigo-500" />
                    <span>Visit Website</span>
                  </a>
                )}

                <button 
                  onClick={() => {
                    if (onGenerateWebsite) onGenerateWebsite(lead);
                    else setShowGenerator(true);
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Pitch Website Concept</span>
                </button>

                {onPushLead && (
                  <button 
                    onClick={() => onPushLead(lead.leadId)}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer border-t border-slate-100 dark:border-zinc-800/60 pt-1.5"
                  >
                    <CheckCircle size={12} className="text-emerald-400" />
                    <span>Sync to CRM</span>
                  </button>
                )}

                {onSkip && (
                  <button 
                    onClick={() => onSkip(lead.leadId)}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-red-600 dark:text-red-400 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <X size={12} />
                    <span>Remove Lead</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Niche & Location */}
          <div className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-zinc-300 uppercase flex items-center gap-1">
            <span className="text-emerald-600 dark:text-emerald-400 capitalize">{displaySector.replace(/_/g, ' ')}</span>
            <span>·</span>
            <span className="text-slate-800 dark:text-white font-extrabold">{displayCity}</span>
          </div>

          {/* Key B2B Metadata (Address, Website, Phone, Reviews) - Seamless without heavy inner frames */}
          <div className="bg-slate-50/50 dark:bg-white/[0.02] rounded-xl p-3 space-y-2.5 font-sans text-[11px]">
            {/* Primary Phone */}
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div className="flex-1 truncate">
                <span className="text-slate-500 dark:text-zinc-400 font-medium mr-1 uppercase text-[8.5px] tracking-wider block">Phone Number</span>
                {primaryPhone ? (
                  <button 
                    onClick={handleCopyPhone}
                    className="text-slate-800 dark:text-white hover:text-slate-950 dark:hover:text-emerald-300 hover:underline text-left cursor-pointer font-mono font-medium"
                    title="Click to copy phone"
                  >
                    {copiedPhone ? 'Copied to clipboard!' : primaryPhone}
                  </button>
                ) : (
                  <span className="text-slate-400 dark:text-zinc-500 italic">Not listed</span>
                )}
              </div>
            </div>

            {/* Secondary / Alternative Phone */}
            {secondaryPhone && secondaryPhone !== primaryPhone && (
              <div className="flex items-start gap-2 pt-1 border-t border-slate-200/40 dark:border-white/[0.03]">
                <Phone className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="flex-1 truncate">
                  <span className="text-slate-500 dark:text-zinc-400 font-bold uppercase text-[8.5px] tracking-wider block">Alt / 2nd Phone</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(secondaryPhone);
                      setCopiedSecondaryPhone(true);
                      setTimeout(() => setCopiedSecondaryPhone(false), 2000);
                    }}
                    className="text-slate-700 dark:text-white hover:text-slate-950 dark:hover:text-blue-300 hover:underline text-left cursor-pointer font-mono font-medium text-[10.5px]"
                    title="Click to copy 2nd phone number"
                  >
                    {copiedSecondaryPhone ? 'Copied to clipboard!' : secondaryPhone}
                  </button>
                </div>
              </div>
            )}

            {/* Email Address Section */}
            <div className="flex items-start gap-2 pt-1 border-t border-slate-200/40 dark:border-white/[0.03]">
              <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium uppercase text-[8.5px] tracking-wider block">Email Address</span>
                  {currentEmail ? (
                    <span className="px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-wider rounded flex items-center gap-1 shrink-0 select-none">
                      <Check size={9} /> Enriched
                    </span>
                  ) : null}
                </div>
                {currentEmail ? (
                  <div className="flex items-center justify-between gap-1">
                    <button 
                      onClick={() => onOpenInbox ? onOpenInbox({ ...lead, email: currentEmail }) : null}
                      className="text-slate-900 dark:text-emerald-400 hover:underline font-mono font-bold text-[11px] truncate block text-left cursor-pointer"
                      title="Click to compose email in app"
                    >
                      {currentEmail}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 dark:text-zinc-500 italic text-[10.5px]">Not listed</span>
                    <button
                      onClick={handleEnrich}
                      disabled={activeEnriching}
                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/60 rounded text-[8.5px] font-extrabold tracking-wider uppercase transition cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                      title="Search web & directories to discover official email"
                    >
                      {activeEnriching && <RefreshCw size={9} className="animate-spin text-white" />}
                      <span>{activeEnriching ? 'Searching...' : 'Find Email'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Website Section */}
            <div className="flex items-start gap-2 pt-1 border-t border-slate-200/40 dark:border-white/[0.03]">
              <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-zinc-500 font-medium uppercase text-[8.5px] tracking-wider block">Website</span>
                  
                  {/* Show Enrich Lead button */}
                  {lead.enriched && currentEmail && primaryPhone && !primaryPhone.includes('Click "Enrich"') ? (
                    <span className="px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-black uppercase tracking-wider rounded flex items-center gap-1 shrink-0 select-none">
                      <Check size={9} /> Verified
                    </span>
                  ) : (
                    <button
                      onClick={handleEnrich}
                      disabled={activeEnriching}
                      className="px-2 py-0.5 bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-700/60 rounded text-[8.5px] font-extrabold tracking-wider uppercase transition cursor-pointer flex items-center gap-1 shrink-0"
                      title="Fetch phone numbers, contact details & website via directory search"
                    >
                      {activeEnriching && <RefreshCw size={9} className="animate-spin text-blue-300" />}
                      <span>{activeEnriching ? 'Enriching...' : 'Enrich Lead'}</span>
                    </button>
                  )}
                </div>

                {hasRealWebsite ? (
                  <a 
                    href={rawWebsite} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-400 hover:text-blue-300 hover:underline font-['SF_Pro_Text','Helvetica_Neue',Helvetica,Arial,sans-serif] font-medium truncate block text-[11px]"
                  >
                    {rawWebsite}
                  </a>
                ) : hasGoogleMapsOnly ? (
                  <a 
                    href={rawWebsite} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-400 hover:text-blue-300 hover:underline font-['SF_Pro_Text','Helvetica_Neue',Helvetica,Arial,sans-serif] font-medium truncate text-[10.5px] flex items-center gap-1"
                  >
                    <MapPin size={10} className="text-blue-400 shrink-0" /> Google Maps Listing Only
                  </a>
                ) : (
                  <span className="text-zinc-600 italic block text-[11px]">No website URL provided</span>
                )}
              </div>
            </div>

            {/* Highlighted Verified Enriched Email Card */}
            {currentEmail && (
              <div className="flex items-center justify-between gap-2 bg-[#10B981]/15 border border-[#10B981]/40 p-2.5 rounded-xl shadow-sm my-1">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-7 h-7 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0 border border-[#10B981]/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[#10B981] font-black uppercase text-[8px] tracking-wider block">Verified Enriched Email</span>
                    <button 
                      onClick={() => onOpenInbox ? onOpenInbox({ ...lead, email: currentEmail }) : null}
                      className="text-slate-900 dark:text-white font-mono font-bold text-[11px] hover:text-[#10B981] hover:underline truncate block text-left cursor-pointer"
                      title="Click to send email in app"
                    >
                      {currentEmail}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentEmail);
                      setCopiedEmail(true);
                      setTimeout(() => setCopiedEmail(false), 2000);
                    }}
                    className="px-2 py-1 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-[9px] font-bold rounded-lg transition cursor-pointer"
                    title="Copy email address"
                  >
                    {copiedEmail ? 'Copied!' : 'Copy'}
                  </button>
                  <button 
                    onClick={() => {
                      if (onOpenInbox) {
                        onOpenInbox({ ...lead, email: currentEmail });
                      }
                    }}
                    className="px-2.5 py-1 bg-[#10B981] hover:bg-[#059669] text-black font-extrabold text-[9px] uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center gap-1 shadow-sm"
                    title="Send email to prospect in app"
                  >
                    <Mail size={10} /> Send
                  </button>
                </div>
              </div>
            )}

            {/* Social Media Details (Instagram, Facebook, LinkedIn, Twitter, YouTube, TikTok, WhatsApp) */}
            {(() => {
              const instagram = enrichResult?.socialLinks?.instagram || lead.socialLinks?.instagram || lead.socials?.instagram || lead.instagram || lead.instagramUrl;
              const facebook = enrichResult?.socialLinks?.facebook || lead.socialLinks?.facebook || lead.socials?.facebook || lead.facebook;
              const linkedin = enrichResult?.socialLinks?.linkedin || lead.socialLinks?.linkedin || lead.socials?.linkedin || lead.linkedin || lead.linkedinUrl;
              const twitter = enrichResult?.socialLinks?.twitter || lead.socialLinks?.twitter || lead.socials?.twitter || lead.twitter;
              const youtube = enrichResult?.socialLinks?.youtube || lead.socialLinks?.youtube || lead.socials?.youtube || lead.youtube;
              const tiktok = enrichResult?.socialLinks?.tiktok || lead.socialLinks?.tiktok || lead.socials?.tiktok || lead.tiktok;
              const whatsapp = enrichResult?.socialLinks?.whatsapp || lead.socialLinks?.whatsapp || lead.whatsappPhone || (lead.phone && lead.phone.startsWith('06') ? `https://wa.me/33${lead.phone.substring(1)}` : null);

              if (!instagram && !facebook && !linkedin && !twitter && !youtube && !tiktok && !whatsapp) return null;

              return (
                <div className="flex items-start gap-2 bg-slate-100/40 dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200/30 dark:border-white/[0.03]">
                  <div className="flex-1">
                    <span className="text-slate-500 dark:text-zinc-300 font-bold uppercase text-[8px] tracking-wider block mb-1">Social Media & Messaging</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {instagram && (
                        <a
                          href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@','')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-rose-900/40 hover:from-purple-800/60 hover:to-rose-800/60 border border-pink-500/40 text-pink-300 rounded text-[10px] font-semibold transition"
                          title="View Instagram Profile"
                        >
                          <Instagram className="w-3 h-3 text-pink-400 shrink-0" />
                          <span className="truncate max-w-[140px]">
                            {instagram.replace(/https?:\/\/(www\.)?instagram\.com\/?/i, '@').replace(/\/$/, '') || 'Instagram'}
                          </span>
                        </a>
                      )}
                      {facebook && (
                        <a
                          href={facebook.startsWith('http') ? facebook : `https://facebook.com/${facebook}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2 py-0.5 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 text-blue-300 rounded text-[10px] font-semibold transition"
                          title="View Facebook Profile"
                        >
                          <Facebook className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="truncate max-w-[120px]">Facebook</span>
                        </a>
                      )}
                      {linkedin && (
                        <a
                          href={linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2 py-0.5 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/30 text-sky-300 rounded text-[10px] font-semibold transition"
                          title="View LinkedIn Profile"
                        >
                          <Linkedin className="w-3 h-3 text-sky-400 shrink-0" />
                          <span className="truncate max-w-[120px]">LinkedIn</span>
                        </a>
                      )}
                      {twitter && (
                        <a
                          href={twitter.startsWith('http') ? twitter : `https://x.com/${twitter.replace('@','')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-600/30 text-zinc-300 rounded text-[10px] font-semibold transition"
                          title="View Twitter/X Profile"
                        >
                          <Twitter className="w-3 h-3 text-zinc-300 shrink-0" />
                          <span className="truncate max-w-[120px]">Twitter / X</span>
                        </a>
                      )}
                      {whatsapp && (
                        <a
                          href={whatsapp.startsWith('http') ? whatsapp : `https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2 py-0.5 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 rounded text-[10px] font-semibold transition"
                          title="Open WhatsApp Direct Chat"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Address */}
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-slate-500 dark:text-zinc-400 font-medium mr-1 uppercase text-[8.5px] tracking-wider block">Address</span>
                {lead.address ? (
                  <span className="text-slate-800 dark:text-white block select-text leading-tight font-medium">{lead.address}</span>
                ) : (
                  <span className="text-slate-400 dark:text-zinc-500 italic">No physical address listed</span>
                )}
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-start gap-2">
              <Star className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0 fill-amber-500/20" />
              <div className="flex-1">
                <span className="text-slate-500 dark:text-zinc-400 font-medium mr-1 uppercase text-[8.5px] tracking-wider block">Rating & Reviews</span>
                <div className="flex items-center gap-1.5 text-slate-800 dark:text-white font-medium">
                  {lead.rating ? (
                    <span className="font-bold text-amber-500 dark:text-amber-400">{lead.rating} ★</span>
                  ) : (
                    <span className="text-slate-400 dark:text-zinc-500">Unrated</span>
                  )}
                  {lead.rating && lead.reviewsCount && <span className="text-slate-400 dark:text-zinc-500">·</span>}
                  {lead.reviewsCount ? (
                    <span className="text-slate-600 dark:text-zinc-200 font-medium">({lead.reviewsCount} reviews)</span>
                  ) : lead.rating ? (
                    <span className="text-slate-400 dark:text-zinc-500 italic text-[10px]">(reviews hidden)</span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Official Government Register / SIRENE Data Block - Seamless without heavy frames */}
            {(lead.siren || lead.siret || lead.contactName || lead.nafCode) && (
              <div className="mt-2 pt-2 bg-indigo-50/40 dark:bg-indigo-950/20 p-2.5 rounded-xl space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between gap-2 border-b border-indigo-200/30 dark:border-indigo-500/20 pb-1">
                  <span className="text-indigo-800 dark:text-white font-black uppercase text-[8.5px] tracking-widest flex items-center gap-1">
                    <ShieldCheck size={11} className="text-indigo-600 dark:text-indigo-400" /> Official Govt Register (Gouv.fr)
                  </span>
                  {lead.siren && (
                    <a
                      href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${lead.siren}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-1.5 py-0.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-700 dark:text-indigo-200 border border-indigo-500/30 rounded text-[8px] font-mono font-bold transition flex items-center gap-1"
                      title="View Official French Government Registry Page"
                    >
                      <ExternalLink size={8} /> Gouv.fr Profile
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {lead.siren && (
                    <div>
                      <span className="text-slate-500 dark:text-zinc-300 text-[8px] uppercase font-bold block">SIREN / SIRET</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white select-all">{lead.siren} {lead.siret ? `(${lead.siret.slice(-5)})` : ''}</span>
                    </div>
                  )}

                  {(lead.contactName || lead.dirigeant) && (
                    <div>
                      <span className="text-slate-500 dark:text-zinc-300 text-[8px] uppercase font-bold block">Dirigeant / CEO</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate block">{lead.contactName || lead.dirigeant}</span>
                    </div>
                  )}

                  {lead.nafCode && (
                    <div className={lead.siren && (lead.contactName || lead.dirigeant) ? "col-span-2" : ""}>
                      <span className="text-slate-500 dark:text-zinc-300 text-[8px] uppercase font-bold block">NAF / APE Activity</span>
                      <span className="font-mono text-slate-800 dark:text-white text-[9.5px] font-bold">{lead.nafCode}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Business Focus Detail - Seamless */}
            {(enrichResult?.uniqueness || lead.uniqueness || lead.pitch) && (
              <div className="mt-2 pt-2 bg-slate-100/40 dark:bg-white/[0.02] p-2.5 rounded-xl space-y-1 text-[10.5px]">
                <div className="flex items-center justify-between gap-2 pb-0.5">
                  <span className="text-slate-800 dark:text-white font-extrabold uppercase text-[8.5px] tracking-wider flex items-center gap-1">
                    <Sparkles size={10} className="text-blue-500 dark:text-blue-400 shrink-0" /> Business Focus
                  </span>
                </div>
                <div className="text-slate-900 dark:text-white text-[10px] leading-snug space-y-0.5 font-bold">
                  {(enrichResult?.uniqueness || lead.uniqueness || lead.pitch)
                    .split('\n')
                    .filter((line: string) => line.trim().length > 0)
                    .slice(0, 3)
                    .map((line: string, lIdx: number) => (
                      <div key={lIdx} className="flex items-start gap-1.5 truncate">
                        <span className="text-slate-400 dark:text-zinc-400 font-bold shrink-0">•</span>
                        <span className="truncate text-slate-900 dark:text-white font-medium">{line.replace(/^[•\-\*\d\.]+\s*/, '')}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* WEBSITE SHAPE & MODERNIZATION CALLOUT (Only shown after lead is enriched) */}
          {(() => {
            const isEnriched = lead.enriched || Boolean(enrichResult);
            if (!isEnriched) return null;

            const audit = enrichResult?.websiteAudit || lead.websiteAudit;
            const isNoWebsite = !hasRealWebsite;
            const isOutdated = isNoWebsite || audit?.needsRedesign || audit?.isOutdated || (audit?.score && audit?.score < 75);

            if (!isOutdated && audit) {
              return (
                <div className="p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-[9.5px]">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-emerald-700 dark:text-emerald-300">Modern Website Active</span>
                    </div>
                    <button
                      onClick={() => {
                        if (onGenerateWebsite) onGenerateWebsite(lead);
                        else setShowGenerator(true);
                      }}
                      className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[8.5px] rounded transition cursor-pointer shrink-0 flex items-center gap-1 shadow-sm"
                    >
                      <Sparkles size={8} /> Preview Redesign
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div className="p-2.5 rounded-lg border border-blue-500/30 bg-blue-500/10 dark:bg-blue-950/20 text-slate-900 dark:text-blue-100 font-sans text-[10px] space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-blue-700 dark:text-blue-300 font-bold text-[9.5px] tracking-wide flex items-center gap-1.5">
                    <AlertTriangle size={11} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    {isNoWebsite ? 'No Website Found' : 'Website Needs Modernization'}
                  </span>
                  <button
                    onClick={() => {
                      if (onGenerateWebsite) onGenerateWebsite(lead);
                      else setShowGenerator(true);
                    }}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[8.5px] rounded uppercase tracking-wider transition cursor-pointer shrink-0 flex items-center gap-1 shadow-sm"
                    title="Generate modern website concept to pitch this prospect"
                  >
                    <Sparkles size={8} /> Pitch Site
                  </button>
                </div>

                <p className="text-[9.5px] text-slate-700 dark:text-zinc-300 leading-tight">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Pitch Strategy:</span> "Here's a modern, high-converting website concept created for {displayName}."
                </p>
              </div>
            );
          })()}
        </div>

        {/* CARD ACTIONS */}
        <div className="pt-3.5 border-t border-[#1C1C1F] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {/* Email Button */}
            {(currentEmail || lead.email) && (
              <button 
                onClick={() => {
                  if (onOpenInbox) {
                    onOpenInbox({ ...lead, email: currentEmail || lead.email });
                  }
                }}
                className="p-1.5 bg-[#1C1C22] hover:bg-[#10B981] text-zinc-400 hover:text-white border border-[#27272A] hover:border-[#10B981] rounded transition cursor-pointer"
                title={`Send Email to ${currentEmail || lead.email}`}
              >
                <Mail size={12} />
              </button>
            )}

            {/* LinkedIn Button */}
            {lead.linkedinUrl && (
              <a 
                href={lead.linkedinUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="p-1.5 bg-[#1C1C22] hover:bg-[#0077B5] text-zinc-400 hover:text-white border border-[#27272A] hover:border-[#0077B5] rounded transition cursor-pointer"
                title="View LinkedIn Profile"
              >
                <Linkedin size={12} />
              </a>
            )}

            {/* WhatsApp Button */}
            {lead.phone && (
              <a 
                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  lead.pitch && lead.pitch.length > 20
                    ? lead.pitch
                    : `Bonjour ${formatBusinessName(lead.name || lead.businessName || '')}, je suis tombé sur ${formatBusinessName(lead.businessName || lead.name || 'votre établissement')} et j'ai remarqué que votre site web pourrait bénéficier d'une modernisation pour booster vos conversions clients. Seriez-vous ouvert à l'idée de découvrir une maquette gratuite ?`
                )}`}
                target="_blank" 
                rel="noreferrer" 
                className={`p-1.5 bg-black hover:bg-zinc-900 text-[#10B981] hover:text-[#25D366] border rounded transition cursor-pointer flex items-center gap-1 justify-center shadow-sm ${
                  lead.hasWhatsapp || lead.isWhatsapp || lead.whatsappStatus === 'whatsapp'
                    ? 'border-[#10B981] bg-[#10B981]/10'
                    : 'border-[#10B981]/40 hover:border-[#10B981]'
                }`}
                title={
                  lead.hasWhatsapp || lead.isWhatsapp || lead.whatsappStatus === 'whatsapp'
                    ? "Verified WhatsApp Account Active - Send Direct Message"
                    : "Send Direct WhatsApp Message"
                }
              >
                <MessageSquare size={12} className="text-[#10B981]" />
                {(lead.hasWhatsapp || lead.isWhatsapp || lead.whatsappStatus === 'whatsapp') && (
                  <ShieldCheck size={11} className="text-[#10B981]" />
                )}
              </a>
            )}

            {/* Website External Link */}
            {lead.website && (
              <a 
                href={lead.website} 
                target="_blank" 
                rel="noreferrer" 
                className="p-1.5 bg-[#1C1C22] hover:bg-[#6366F1] text-zinc-400 hover:text-white border border-[#27272A] hover:border-[#6366F1] rounded transition cursor-pointer"
                title="Visit Website"
              >
                <Globe size={12} />
              </a>
            )}

            {/* Nesta Landing Page Generator Button */}
            <button
              onClick={() => {
                if (onGenerateWebsite) {
                  onGenerateWebsite(lead);
                } else {
                  setShowGenerator(!showGenerator);
                }
              }}
              className="px-2.5 py-1 bg-white hover:bg-zinc-200 text-black border border-zinc-300 rounded transition cursor-pointer flex items-center gap-1.5 text-[10px] font-extrabold shadow-sm"
              title="Open Nesta Website AI Popup Modal"
            >
              <LayoutTemplate size={12} />
              <span>Website AI</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Skip Button */}
            {onSkip && (
              <button 
                onClick={() => onSkip(lead.leadId)}
                className="p-1.5 bg-transparent hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded transition cursor-pointer"
                title="Skip Lead"
              >
                <X size={12} />
              </button>
            )}

            {/* CRM Sync Button */}
            {onPushLead && (
              lead.sentToClose ? (
                <div className="flex items-center gap-1 text-[#10B981] font-bold text-[7.5px] tracking-widest uppercase select-none bg-[#10B981]/5 px-2 py-1 border border-[#10B981]/20 rounded">
                  <CheckCircle size={8} /> SYNCED
                </div>
              ) : (
                <button 
                  onClick={() => onPushLead(lead.leadId)}
                  disabled={isPushing}
                  className="px-2 py-1 bg-[#1C1C22] hover:bg-[#10B981] text-[#A1A1AA] hover:text-white border border-[#27272A] hover:border-[#10B981] disabled:opacity-40 text-[7.5px] font-extrabold tracking-widest uppercase rounded transition cursor-pointer"
                >
                  {isPushing ? 'SYNCING...' : 'SYNC CRM'}
                </button>
              )
            )}
          </div>
        </div>

        {/* EXPANDABLE WEBSITE GENERATOR PANEL */}
        {showGenerator && (
          <div className="pt-2 border-t border-[#1C1C1F]">
            <WebsiteGeneratorPanel lead={lead} />
          </div>
        )}
      </div>
    </div>
  );
};
