import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  Copy, 
  Globe, 
  Building2, 
  Heart, 
  MessageCircle, 
  Share2, 
  User, 
  Eye,
  Instagram
} from 'lucide-react';

export interface IgProfileVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    username: string;
    fullName?: string;
    followers?: number | string;
    posts?: number | string;
    bio?: string;
    categoryName?: string;
    isBusinessAccount?: boolean;
    isVerified?: boolean;
    profilePicUrl?: string;
    profileUrl?: string;
    postsList?: any[];
  } | null;
  onGenerateWebsite?: (profile: any) => void;
  onSendWhatsApp?: (phone: string, text: string) => void;
  theme?: 'dark' | 'light';
}

export const IgProfileVisualizerModal: React.FC<IgProfileVisualizerProps> = ({
  isOpen,
  onClose,
  profile,
  onGenerateWebsite,
  theme = 'dark'
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'embed' | 'posts'>('card');
  const [copied, setCopied] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  if (!isOpen || !profile) return null;

  const username = profile.username.replace(/^@/, '').trim();
  const directIgUrl = profile.profileUrl || `https://www.instagram.com/${username}/`;
  const embedUrl = `https://www.instagram.com/${username}/embed`;
  const picukiUrl = `https://www.picuki.com/profile/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`@${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border transition-all ${
          isLight 
            ? 'bg-white border-slate-200 text-slate-800' 
            : 'bg-[#0D0D11] border-[#22222B] text-white'
        }`}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${
          isLight ? 'border-slate-100 bg-slate-50' : 'border-[#1C1C24] bg-[#09090D]'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md">
              <Instagram size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className={`font-black text-sm tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  @{username}
                </h3>
                {profile.isVerified && (
                  <CheckCircle2 size={13} className="text-blue-500 fill-blue-500/20" />
                )}
                {profile.isBusinessAccount && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wider">
                    Business
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-zinc-400 font-mono">
                Instagram Profile Visualizer & Intelligence Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isLight 
                ? 'hover:bg-slate-200 text-slate-500' 
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex items-center gap-1 px-5 pt-3 border-b select-none ${
          isLight ? 'border-slate-100 bg-white' : 'border-[#1C1C24] bg-[#0D0D11]'
        }`}>
          <button
            onClick={() => setActiveTab('card')}
            className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition cursor-pointer ${
              activeTab === 'card'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📇 Overview Card
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition cursor-pointer ${
              activeTab === 'embed'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🌐 Live IG Preview
          </button>
          {profile.postsList && profile.postsList.length > 0 && (
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider border-b-2 transition cursor-pointer ${
                activeTab === 'posts'
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              📸 Scraped Posts ({profile.postsList.length})
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'card' && (
            <div className="space-y-5">
              {/* Profile Card Header Box */}
              <div className={`p-5 rounded-2xl border relative overflow-hidden ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121217] border-[#22222A]'
              }`}>
                {/* Background decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 via-rose-500/10 to-amber-500/10 rounded-bl-full pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Avatar Ring */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-lg">
                      {profile.profilePicUrl ? (
                        <img 
                          src={profile.profilePicUrl} 
                          alt={username} 
                          className="w-full h-full rounded-full object-cover bg-zinc-900"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-white font-black text-xl uppercase">
                          {username.substring(0, 2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile info */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h2 className="text-lg font-black tracking-tight text-white dark:text-white">
                          {profile.fullName || username}
                        </h2>
                        <span className="text-xs text-purple-400 font-bold">@{username}</span>
                      </div>
                      {profile.categoryName && (
                        <p className="text-xs font-semibold text-slate-400 dark:text-zinc-400 flex items-center gap-1 justify-center sm:justify-start mt-0.5">
                          <Building2 size={12} className="text-purple-400" /> {profile.categoryName}
                        </p>
                      )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className={`p-2 rounded-xl text-center border ${
                        isLight ? 'bg-white border-slate-200' : 'bg-[#09090C] border-[#1C1C22]'
                      }`}>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Posts</div>
                        <div className="text-sm font-black mt-0.5">{profile.posts || '—'}</div>
                      </div>
                      <div className={`p-2 rounded-xl text-center border ${
                        isLight ? 'bg-white border-slate-200' : 'bg-[#09090C] border-[#1C1C22]'
                      }`}>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Followers</div>
                        <div className="text-sm font-black text-purple-400 mt-0.5">{profile.followers || '—'}</div>
                      </div>
                      <div className={`p-2 rounded-xl text-center border ${
                        isLight ? 'bg-white border-slate-200' : 'bg-[#09090C] border-[#1C1C22]'
                      }`}>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Type</div>
                        <div className="text-xs font-black text-emerald-400 mt-0.5">
                          {profile.isBusinessAccount ? 'Business' : 'Personal'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Biography Box */}
                {profile.bio && (
                  <div className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#0A0A0E] border-[#1C1C24] text-zinc-300'
                  }`}>
                    <p className="whitespace-pre-line font-medium">{profile.bio}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={directIgUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer"
                >
                  <Instagram size={14} /> Open Official Instagram Profile <ExternalLink size={12} />
                </a>

                <a
                  href={picukiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider transition cursor-pointer ${
                    isLight 
                      ? 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800' 
                      : 'bg-[#18181F] border-[#2A2A35] hover:bg-[#20202A] text-zinc-200'
                  }`}
                >
                  <Globe size={14} className="text-amber-400" /> Open Picuki Web Viewer <ExternalLink size={12} />
                </a>

                <a
                  href={`https://www.instagram.com/direct/t/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
                >
                  <MessageSquare size={14} /> Send Direct Instagram DM <ExternalLink size={12} />
                </a>

                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider transition cursor-pointer ${
                    copied 
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                      : isLight ? 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800' : 'bg-[#18181F] border-[#2A2A35] hover:bg-[#20202A] text-zinc-200'
                  }`}
                >
                  <Copy size={14} /> {copied ? 'Copied Handle!' : 'Copy Handle'}
                </button>
              </div>

              {/* Generate AI Website CTA Banner */}
              {onGenerateWebsite && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/20 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} /> Build AI Website Preview
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      Instantly generate a high-converting website pitch for @{username}.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onGenerateWebsite({
                        leadId: `ig-${username}`,
                        companyName: profile.fullName || username,
                        category: profile.categoryName || 'Instagram Creator',
                        website: `https://www.instagram.com/${username}/`,
                        pitch: profile.bio || `Instagram creator with ${profile.followers || 'strong'} followers.`
                      });
                    }}
                    className="px-4 py-2 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow hover:bg-zinc-200 transition cursor-pointer shrink-0"
                  >
                    Build AI Site
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Live Web Preview for @{username}</span>
                <a 
                  href={directIgUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-purple-400 hover:underline flex items-center gap-1 font-bold"
                >
                  Open in New Tab <ExternalLink size={12} />
                </a>
              </div>

              <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center">
                {!iframeError ? (
                  <iframe
                    src={embedUrl}
                    title={`Instagram Preview for ${username}`}
                    className="w-full h-full border-0"
                    onError={() => setIframeError(true)}
                  />
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <Instagram size={32} className="mx-auto text-purple-500" />
                    <p className="text-xs text-zinc-300 font-semibold">
                      Instagram embed is restricted by browser security policies.
                    </p>
                    <div className="flex justify-center gap-2">
                      <a
                        href={directIgUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-lg hover:bg-purple-500 transition"
                      >
                        View on Instagram
                      </a>
                      <a
                        href={picukiUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-zinc-800 text-zinc-200 font-bold text-xs rounded-lg hover:bg-zinc-700 transition"
                      >
                        View on Picuki Mirror
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Scraped Recent Posts for @{username}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.postsList?.map((post: any, idx: number) => (
                  <div 
                    key={post.shortcode || post.id || idx}
                    className={`p-3 rounded-xl border space-y-2 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121217] border-[#22222A]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-purple-400">Post #{idx + 1}</span>
                      <a
                        href={post.postUrl || `https://www.instagram.com/p/${post.shortcode}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-white flex items-center gap-1 text-[10px]"
                      >
                        View Post <ExternalLink size={10} />
                      </a>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-300">
                      <div className="flex items-center gap-1 text-rose-400 font-bold">
                        <Heart size={12} /> {post.likesCount || 0}
                      </div>
                      <div className="flex items-center gap-1 text-blue-400 font-bold">
                        <MessageCircle size={12} /> {post.commentsCount || 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`px-5 py-3 border-t flex items-center justify-between text-[10px] text-zinc-500 font-mono ${
          isLight ? 'border-slate-100 bg-slate-50' : 'border-[#1C1C24] bg-[#09090D]'
        }`}>
          <span>Handle: @{username}</span>
          <span>Assix IG Discovery Visualizer</span>
        </div>
      </div>
    </div>
  );
};
