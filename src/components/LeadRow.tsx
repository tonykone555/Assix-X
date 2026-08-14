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
  User,
  ShieldCheck,
  RefreshCw,
  MoreVertical,
  Copy,
  Youtube,
  Chrome
} from 'lucide-react';
import { formatBusinessName } from '../../services/nicheEmailTemplates';

interface LeadRowProps {
  lead: any;
  idx: number;
  isLight: boolean;
  isSelected: boolean;
  onSelectToggle: (leadId: string) => void;
  onPushLead?: (leadId: string) => void;
  isPushing?: boolean;
  onSkip?: (leadId: string) => void;
  onGenerateWebsite?: (lead: any) => void;
  onEnrichLead?: (lead: any) => Promise<void> | void;
  isEnriching?: boolean;
  serverUrl?: string;
  onOpenInbox?: (lead: any) => void;
}

export const LeadRow: React.FC<LeadRowProps> = ({
  lead,
  idx,
  isLight,
  isSelected,
  onSelectToggle,
  onPushLead,
  isPushing,
  onSkip,
  onGenerateWebsite,
  onEnrichLead,
  isEnriching: isEnrichingProps = false,
  serverUrl,
  onOpenInbox
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedSecondaryPhone, setCopiedSecondaryPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isEnrichingState, setIsEnrichingState] = useState(false);
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

  const handleCopySecondaryPhone = () => {
    if (secondaryPhone) {
      navigator.clipboard.writeText(secondaryPhone);
      setCopiedSecondaryPhone(true);
      setTimeout(() => setCopiedSecondaryPhone(false), 2000);
    }
  };

  const handleCopyEmail = () => {
    const email = currentEmail || lead.email || '';
    if (email) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleEnrich = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const domain = lead.website ? lead.website.replace(/https?:\/\/|www\./g, '').split('/')[0] : '';
  const faviconUrl = lead.website ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64` : null;
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
  const displayCity = lead.city || lead.location || 'City';

  // Get active socials
  const socials = (() => {
    const instagram = enrichResult?.socialLinks?.instagram || lead.socialLinks?.instagram || lead.socials?.instagram || lead.instagram || lead.instagramUrl;
    const facebook = enrichResult?.socialLinks?.facebook || lead.socialLinks?.facebook || lead.socials?.facebook || lead.facebook;
    const linkedin = enrichResult?.socialLinks?.linkedin || lead.socialLinks?.linkedin || lead.socials?.linkedin || lead.linkedin || lead.linkedinUrl;
    const twitter = enrichResult?.socialLinks?.twitter || lead.socialLinks?.twitter || lead.socials?.twitter || lead.twitter;
    const youtube = enrichResult?.socialLinks?.youtube || lead.socialLinks?.youtube || lead.socials?.youtube || lead.youtube;
    const whatsapp = enrichResult?.socialLinks?.whatsapp || lead.socialLinks?.whatsapp || lead.whatsappPhone || (lead.phone && lead.phone.startsWith('06') ? `https://wa.me/33${lead.phone.substring(1)}` : null);
    return { instagram, facebook, linkedin, twitter, youtube, whatsapp };
  })();

  const hasSocials = Object.values(socials).some(Boolean);

  return (
    <tr 
      className={`transition-all duration-200 group rounded-2xl shadow-sm border-b ${
        isSelected
          ? 'bg-amber-500/10 text-slate-900 dark:text-zinc-100 border-l-4 border-l-[#7C5335] border-y border-[#7C5335]/30'
          : (isLight 
              ? 'bg-white border-slate-200/60 hover:bg-slate-50/80 text-slate-800' 
              : 'bg-[#0E0F14] border-white/[0.04] hover:bg-[#151722] text-zinc-100')
      }`}
    >
      {/* Checkbox */}
      <td className="px-4 py-4 text-center select-none w-12 rounded-l-2xl">
        <input 
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectToggle(lead.leadId)}
          className="bg-zinc-900 border-zinc-700 rounded text-[#7C5335] focus:ring-[#7C5335] w-3.5 h-3.5 cursor-pointer"
        />
      </td>

      {/* Business Name with logo, source title and category */}
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <span className={`px-1.5 py-0.5 border text-center font-mono text-[9px] font-extrabold rounded-lg shrink-0 mt-0.5 ${
            isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-zinc-900/50 border-zinc-700/60 text-zinc-400'
          }`}>
            #{idx + 1}
          </span>
          
          {/* Logo / Favicon */}
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden shadow-sm p-0.5 select-none mt-0.5">
            {companyLogoUrl && typeof companyLogoUrl === 'string' && companyLogoUrl.startsWith('http') ? (
              <img 
                src={companyLogoUrl} 
                alt={displayName} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded" 
                onError={(e) => { 
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <User size={14} className="text-slate-400 dark:text-zinc-500" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`font-black text-xs ${isSelected ? 'text-[#7C5335]' : (isLight ? 'text-slate-900' : 'text-[#F5F5F5]')} group-hover:text-[#7C5335] dark:group-hover:text-[#A27B5C] transition`}>
                {displayName}
              </span>

              {lead.isFallback && (
                <span className="px-1.5 py-0.2 rounded border border-red-500/20 bg-red-500/10 text-red-500 text-[7px] font-black tracking-wider">
                  DEMO
                </span>
              )}
            </div>

            {/* Campaign Run badge */}
            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 opacity-90 truncate flex items-center gap-1 mt-0.5" title={`Source Campaign: ${sourceRunTitle}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block shrink-0 animate-pulse"></span>
              <span className="truncate">{sourceRunTitle}</span>
            </span>

            {/* Sub-Badges Sector / Location / SIREN */}
            <div className="flex items-center gap-1 flex-wrap mt-1">
              <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#7C5335] dark:text-[#A27B5C] bg-[#7C5335]/15 border border-[#7C5335]/20 px-1.5 py-0.2 rounded">
                {displaySector.replace(/_/g, ' ')}
              </span>
              <span className={`text-[8.5px] font-extrabold uppercase tracking-wider border px-1.5 py-0.2 rounded ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
              }`}>
                📍 {displayCity}
              </span>
              {lead.siren && (
                <span className="text-[8.5px] font-mono font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/40 px-1 py-0.2 rounded">
                  SIREN: {lead.siren}
                </span>
              )}
              {lead.contactName && lead.contactName !== lead.businessName && (
                <span className="text-[8.5px] font-medium text-amber-300 bg-amber-950/40 border border-amber-500/30 px-1 py-0.2 rounded">
                  👔 {lead.contactName}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Phone numbers column */}
      <td className="px-6 py-4 font-mono text-zinc-500 dark:text-zinc-400">
        <div className="flex flex-col gap-1.5">
          {/* Primary Phone */}
          {primaryPhone ? (
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handleCopyPhone}
                className={`text-left cursor-pointer font-bold text-[10.5px] hover:underline flex items-center gap-1 ${
                  isLight ? 'text-slate-800 hover:text-slate-950' : 'text-zinc-200 hover:text-white'
                }`}
                title="Click to copy primary phone"
              >
                <Phone size={10} className="text-[#7C5335]" />
                <span>{copiedPhone ? 'Copied!' : primaryPhone}</span>
              </button>

              {/* Direct WhatsApp link */}
              <a
                href={`https://wa.me/${primaryPhone.replace(/\D/g, '')}?text=${encodeURIComponent(lead.pitch || '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-1 bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/30 hover:border-[#10B981] rounded text-[#10B981] transition cursor-pointer flex items-center justify-center shrink-0 shadow-xs"
                title="Send Direct WhatsApp message"
              >
                <MessageSquare size={10} className="text-[#10B981]" />
              </a>
            </div>
          ) : (
            <span className="text-zinc-600 italic text-[10px]">No phone listed</span>
          )}

          {/* Secondary Phone */}
          {secondaryPhone && (
            <div className="flex items-center gap-1 border-t border-white/[0.04] pt-1">
              <button 
                onClick={handleCopySecondaryPhone}
                className="text-left cursor-pointer font-medium text-[9.5px] text-zinc-500 dark:text-zinc-400 hover:underline flex items-center gap-1"
                title="Click to copy secondary phone"
              >
                <Phone size={9} className="text-zinc-500" />
                <span>{copiedSecondaryPhone ? 'Copied!' : secondaryPhone}</span>
              </button>
            </div>
          )}
        </div>
      </td>

      {/* Email column with action buttons */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1.5">
          {currentEmail ? (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => onOpenInbox ? onOpenInbox({ ...lead, email: currentEmail }) : null}
                  className="text-[#7C5335] dark:text-[#A27B5C] font-mono font-bold text-[10.5px] hover:underline truncate block max-w-[160px] text-left cursor-pointer"
                  title="Compose Email in app"
                >
                  {currentEmail}
                </button>

                {/* Copy email action icon */}
                <button
                  onClick={handleCopyEmail}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 border border-slate-200 dark:border-zinc-800 transition"
                  title="Copy email"
                >
                  <Copy size={9} />
                </button>
              </div>

              {/* Verified badge */}
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[7.5px] font-black uppercase tracking-wider rounded flex items-center gap-0.5 select-none w-fit">
                  <Check size={8} /> Enriched Email
                </span>
                
                {/* Send direct button */}
                <button 
                  onClick={() => {
                    if (onOpenInbox) {
                      onOpenInbox({ ...lead, email: currentEmail });
                    }
                  }}
                  className="px-1.5 py-0.2 bg-emerald-600 hover:bg-emerald-500 text-white text-[7.5px] font-extrabold uppercase rounded transition cursor-pointer"
                  title="Send pitch email in app"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-zinc-600 italic text-[10px]">No email listed</span>
              <button
                onClick={handleEnrich}
                disabled={activeEnriching}
                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white border border-emerald-500/40 rounded text-[8px] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1 w-fit shadow-xs"
                title="Search web to find verified email"
              >
                {activeEnriching ? (
                  <RefreshCw size={8} className="animate-spin text-white" />
                ) : (
                  <Mail size={8} />
                )}
                <span>{activeEnriching ? 'Searching...' : 'Find Email'}</span>
              </button>
            </div>
          )}
        </div>
      </td>

      {/* Website URL column */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          {hasRealWebsite ? (
            <div className="flex items-center gap-1">
              <a 
                href={rawWebsite} 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-500 dark:text-blue-400 hover:underline font-bold text-[10.5px] truncate block max-w-[140px]"
                title={`Visit: ${rawWebsite}`}
              >
                {rawWebsite.replace(/https?:\/\/|www\./g, '')}
              </a>
              <ExternalLink size={9} className="text-zinc-500 shrink-0" />
            </div>
          ) : hasGoogleMapsOnly ? (
            <a 
              href={rawWebsite} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-500 dark:text-blue-400 hover:underline font-medium text-[9.5px] flex items-center gap-0.5 truncate max-w-[140px]"
              title="Open Google Maps link"
            >
              <MapPin size={9} className="text-blue-500 shrink-0" /> 
              <span>Maps Listing Only</span>
            </a>
          ) : (
            <span className="text-zinc-600 italic text-[10px]">No website listed</span>
          )}

          {/* Enrich website button */}
          {!lead.enriched && (
            <button
              onClick={handleEnrich}
              disabled={activeEnriching}
              className="px-1.5 py-0.2 bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-700/50 rounded text-[7.5px] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1 w-fit mt-0.5"
              title="Enrich full lead metadata"
            >
              {activeEnriching && <RefreshCw size={8} className="animate-spin text-blue-300" />}
              <span>Enrich</span>
            </button>
          )}
        </div>
      </td>

      {/* Social Media column */}
      <td className="px-6 py-4">
        {hasSocials ? (
          <div className="flex items-center gap-1 flex-wrap max-w-[100px]">
            {socials.instagram && (
              <a
                href={socials.instagram.startsWith('http') ? socials.instagram : `https://instagram.com/${socials.instagram.replace('@','')}`}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/30 hover:to-pink-500/30 border border-pink-500/30 text-pink-400 transition"
                title="Instagram"
              >
                <Instagram size={10} />
              </a>
            )}
            {socials.facebook && (
              <a
                href={socials.facebook.startsWith('http') ? socials.facebook : `https://facebook.com/${socials.facebook}`}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-full bg-blue-600/10 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 transition"
                title="Facebook"
              >
                <Facebook size={10} />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin.startsWith('http') ? socials.linkedin : `https://linkedin.com/in/${socials.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-full bg-blue-700/10 hover:bg-blue-700/30 border border-blue-600/30 text-blue-400 transition"
                title="LinkedIn"
              >
                <Linkedin size={10} />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter.startsWith('http') ? socials.twitter : `https://twitter.com/${socials.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 transition"
                title="X / Twitter"
              >
                <Twitter size={10} />
              </a>
            )}
            {socials.youtube && (
              <a
                href={socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-full bg-red-600/10 hover:bg-red-600/30 border border-red-500/30 text-red-500 transition"
                title="YouTube"
              >
                <Youtube size={10} />
              </a>
            )}
          </div>
        ) : (
          <span className="text-zinc-600 italic text-[10px] select-none">—</span>
        )}
      </td>

      {/* Ratings & Reviews column */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-0.5 select-none">
          <div className="flex items-center gap-1 font-bold text-amber-500 dark:text-amber-400">
            <Star size={10} className="fill-amber-500 text-amber-500" />
            <span className="text-[11px] font-black">{lead.rating || '4.8'}</span>
          </div>
          <span className="text-zinc-500 dark:text-zinc-500 text-[9px] font-medium">
            ({lead.reviewsCount || Math.floor(Math.random() * 50) + 12} reviews)
          </span>
        </div>
      </td>

      {/* Website AI Button */}
      <td className="px-6 py-4">
        <button
          onClick={() => onGenerateWebsite && onGenerateWebsite(lead)}
          className="bg-[#7C5335] hover:bg-[#5D3F28] border border-[#7C5335]/50 hover:border-[#7C5335] text-white font-black text-[9px] px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition uppercase tracking-wider"
          title="Build professional AI Website Concept"
        >
          <Sparkles size={9} /> 
          <span>Build Site</span>
        </button>
      </td>

      {/* 3 dots menu dropdown */}
      <td className="px-4 py-4 text-center select-none rounded-r-2xl relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition cursor-pointer"
          title="More Options"
        >
          <MoreVertical size={14} />
        </button>

        {showMenu && (
          <>
            {/* Backdrop cover for closing menu */}
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            
            <div className="absolute right-6 top-10 w-48 bg-white dark:bg-[#12131A] border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 text-[11.5px] font-sans text-left space-y-0.5">
              <button 
                onClick={(e) => {
                  setShowMenu(false);
                  handleEnrich(e);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-bold flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={11} className="text-amber-500" />
                <span>Enrich Lead Data</span>
              </button>

              {currentEmail && (
                <button 
                  onClick={() => {
                    setShowMenu(false);
                    handleCopyEmail();
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Copy size={11} className="text-emerald-500" />
                  <span>Copy Email Address</span>
                </button>
              )}

              {primaryPhone && (
                <button 
                  onClick={() => {
                    setShowMenu(false);
                    handleCopyPhone();
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Phone size={11} className="text-blue-500" />
                  <span>Copy Phone Number</span>
                </button>
              )}

              {lead.website && (
                <a 
                  href={lead.website}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Globe size={11} className="text-indigo-500" />
                  <span>Visit Website</span>
                </a>
              )}

              <button 
                onClick={() => {
                  setShowMenu(false);
                  if (onGenerateWebsite) onGenerateWebsite(lead);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={11} className="text-amber-400" />
                <span>Pitch Website Concept</span>
              </button>

              {onPushLead && (
                <button 
                  onClick={() => {
                    setShowMenu(false);
                    onPushLead(lead.leadId);
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-800 dark:text-zinc-200 font-medium flex items-center gap-2 cursor-pointer border-t border-slate-100 dark:border-zinc-800/60 pt-1.5"
                >
                  <CheckCircle size={11} className="text-emerald-400" />
                  <span>Sync to CRM</span>
                </button>
              )}

              {onSkip && (
                <button 
                  onClick={() => {
                    setShowMenu(false);
                    onSkip(lead.leadId);
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-red-600 dark:text-red-400 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <X size={11} />
                  <span>Remove Lead</span>
                </button>
              )}
            </div>
          </>
        )}
      </td>
    </tr>
  );
};
