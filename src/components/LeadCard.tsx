import React, { useState } from 'react';
import { 
  Globe, 
  Phone, 
  MapPin, 
  ExternalLink, 
  CheckCircle, 
  Mail, 
  Linkedin, 
  MessageSquare, 
  X, 
  Sparkles,
  Facebook,
  Star
} from 'lucide-react';

interface LeadCardProps {
  lead: any;
  onPushLead: (leadId: string) => void;
  isPushing: boolean;
  serverUrl?: string;
  onSkip?: (leadId: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  onPushLead, 
  isPushing, 
  onSkip 
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = () => {
    const phone = lead.phone || '';
    if (phone) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const domain = lead.website ? lead.website.replace(/https?:\/\/|www\./g, '') : '';
  const faviconUrl = lead.website ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(lead.website)}&sz=32` : null;
  const score = lead.gapScore || 0;

  // Determine badge colors for gap score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20';
    if (score >= 60) return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
    return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  };

  const displayName = lead.company || lead.businessName || lead.name || 'Unnamed Prospect';
  const displaySector = lead.sector || lead.source || 'Niche';
  const displayCity = lead.city || 'City';

  const gapsArray = Array.isArray(lead.gapFound) 
    ? lead.gapFound 
    : lead.gapFound 
      ? [lead.gapFound] 
      : [];

  return (
    <div className="bg-[#0F0F11] border border-[#1C1C1F] hover:border-[#10B981]/50 rounded-lg overflow-hidden transition-all duration-300 flex flex-col h-full group shadow-md relative">
      
      {/* CARD TOP INFO ROW */}
      <div className="p-4 border-b border-[#1C1C1F] flex items-center justify-between gap-3 bg-[#0A0A0C]/55">
        <div className="flex items-center gap-2.5 truncate">
          {faviconUrl ? (
            <img 
              src={faviconUrl} 
              alt="" 
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-sm bg-zinc-800 object-contain shrink-0"
              onError={(e) => {
                // If favicon fails, replace with placeholder icon style
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-5 h-5 rounded-sm bg-[#1C1C22] border border-[#27272A] flex items-center justify-center text-[10px] text-zinc-400 shrink-0 select-none">
              🏢
            </div>
          )}
          {lead.source?.startsWith('facebook') && (
            <Facebook className="w-3.5 h-3.5 text-[#1877F2] shrink-0" />
          )}
          <h4 className="text-xs font-bold text-[#F5F5F5] group-hover:text-white transition truncate" title={displayName}>
            {displayName}
          </h4>
        </div>

        {/* Gap Score and Fallback Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          {lead.isFallback && (
            <div className="px-2 py-0.5 rounded border border-red-500/20 bg-red-500/10 text-red-400 text-[8px] font-extrabold tracking-wider select-none">
              DEMO DATA
            </div>
          )}
          <div className={`px-2 py-0.5 rounded border text-[8px] font-extrabold tracking-wider shrink-0 select-none ${getScoreColor(score)}`}>
            GAP SCORE: {score}
          </div>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Niche & Location */}
          <div className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1">
            <span className="text-[#10B981] capitalize">{displaySector.replace(/_/g, ' ')}</span>
            <span>·</span>
            <span className="text-zinc-400">{displayCity}</span>
          </div>

          {/* Gaps found */}
          <div className="text-[11px] text-zinc-400 leading-relaxed pb-1">
            <strong className="text-zinc-500">Gaps found:</strong>{' '}
            {gapsArray.length > 0 ? (
              <span className="text-red-400 font-medium">{gapsArray.join(', ')}</span>
            ) : (
              <span className="text-emerald-400 font-medium">None detected</span>
            )}
          </div>

          {/* Key B2B Metadata (Address, Website, Phone, Reviews) */}
          <div className="bg-[#0A0A0C] border border-[#1A1A1F] rounded-md p-3 space-y-2.5 font-sans text-[11px]">
            {/* Phone */}
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
              <div className="flex-1 truncate">
                <span className="text-zinc-500 font-medium mr-1 uppercase text-[8.5px] tracking-wider block">Phone Number</span>
                {lead.phone ? (
                  <button 
                    onClick={handleCopyPhone}
                    className="text-zinc-300 hover:text-white hover:underline text-left cursor-pointer font-mono font-medium"
                    title="Click to copy phone"
                  >
                    {copiedPhone ? 'Copied to clipboard!' : lead.phone}
                  </button>
                ) : (
                  <span className="text-zinc-600 italic">Not listed</span>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start gap-2">
              <Globe className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
              <div className="flex-1 truncate">
                <span className="text-zinc-500 font-medium mr-1 uppercase text-[8.5px] tracking-wider block">Website</span>
                {lead.website ? (
                  <a 
                    href={lead.website} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#A27B5C] hover:underline font-mono truncate block"
                  >
                    {lead.website}
                  </a>
                ) : (
                  <span className="text-zinc-600 italic">No website found</span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-zinc-500 font-medium mr-1 uppercase text-[8.5px] tracking-wider block">Address</span>
                {lead.address ? (
                  <span className="text-zinc-300 block select-text leading-tight">{lead.address}</span>
                ) : (
                  <span className="text-zinc-600 italic">No physical address listed</span>
                )}
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-start gap-2">
              <Star className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0 fill-amber-500/20" />
              <div className="flex-1">
                <span className="text-zinc-500 font-medium mr-1 uppercase text-[8.5px] tracking-wider block">Rating & Reviews</span>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  {lead.rating ? (
                    <span className="font-bold text-amber-400">{lead.rating} ★</span>
                  ) : (
                    <span className="text-zinc-500">Unrated</span>
                  )}
                  {lead.rating && lead.reviewsCount && <span className="text-zinc-600">·</span>}
                  {lead.reviewsCount ? (
                    <span className="text-zinc-400 font-medium">({lead.reviewsCount} reviews)</span>
                  ) : lead.rating ? (
                    <span className="text-zinc-500 italic text-[10px]">(reviews hidden)</span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Pitch Preview */}
          {lead.pitch ? (
            <div className="text-[10.5px] text-[#A1A1AA] italic bg-[#0A0A0C] p-3 rounded border border-[#1A1A1F] leading-relaxed relative">
              <Sparkles size={10} className="text-[#10B981] absolute top-2 right-2 opacity-50" />
              <p className="line-clamp-3 select-text">
                "{lead.pitch.length > 80 ? `${lead.pitch.substring(0, 80)}...` : lead.pitch}"
              </p>
            </div>
          ) : (
            <div className="text-[10.5px] text-zinc-600 italic bg-[#0A0A0C]/40 p-2.5 rounded border border-[#1A1A1F]/50">
              No personalized pitch generated
            </div>
          )}
        </div>

        {/* CARD ACTIONS */}
        <div className="pt-3.5 border-t border-[#1C1C1F] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {/* Email Button */}
            {lead.email && (
              <a 
                href={`mailto:${lead.email}?subject=Quick Question&body=${encodeURIComponent(lead.pitch || '')}`}
                className="p-1.5 bg-[#1C1C22] hover:bg-[#10B981] text-zinc-400 hover:text-white border border-[#27272A] hover:border-[#10B981] rounded transition cursor-pointer"
                title="Send Outreach Email"
              >
                <Mail size={12} />
              </a>
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
                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(lead.pitch || '')}`}
                target="_blank" 
                rel="noreferrer" 
                className="p-1.5 bg-[#1C1C22] hover:bg-[#25D366] text-zinc-400 hover:text-white border border-[#27272A] hover:border-[#25D366] rounded transition cursor-pointer"
                title="Send WhatsApp Message"
              >
                <MessageSquare size={12} />
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
            {lead.sentToClose ? (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
