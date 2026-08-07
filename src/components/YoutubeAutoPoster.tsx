import React, { useState, useEffect } from 'react';
import { 
  Youtube, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Send, 
  History, 
  Trash2, 
  Settings, 
  Loader2, 
  Info, 
  AlertTriangle, 
  Play, 
  Sparkles,
  RefreshCw,
  Video,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface YoutubeStatus {
  connected: boolean;
  configured: boolean;
  channelName?: string;
  customUrl?: string;
  avatarUrl?: string;
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
}

interface ScheduledPost {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  privacyStatus: string;
  scheduledTime: string;
  brandName?: string;
  source: string;
  status: string;
  error?: string;
}

interface PublishedLog {
  id: string;
  videoId: string;
  videoLink: string;
  title: string;
  source: string;
  privacyStatus: string;
  publishedAt: string;
}

interface YoutubeAutoPosterProps {
  // Option to trigger automatic export flow directly from parent
  triggerVideo?: {
    videoUrl: string;
    defaultTitle: string;
    defaultDescription: string;
    source: 'ugc' | 'clipper';
    brandName?: string;
  } | null;
  onCloseTrigger?: () => void;
}

export default function YoutubeAutoPoster({ triggerVideo, onCloseTrigger }: YoutubeAutoPosterProps) {
  const [status, setStatus] = useState<YoutubeStatus>({ connected: false, configured: false });
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [history, setHistory] = useState<PublishedLog[]>([]);
  const [channelVideos, setChannelVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'scheduler' | 'history' | 'channel_videos' | 'setup'>('scheduler');

  // Export Form State
  const [formOpen, setFormOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState('private');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [formSource, setFormSource] = useState<'ugc' | 'clipper'>('ugc');
  const [formBrand, setFormBrand] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/youtube/status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('Failed to fetch YouTube status:', e);
    }
  };

  const fetchScheduled = async () => {
    try {
      const res = await fetch('/api/youtube/scheduled');
      const data = await res.json();
      setScheduledPosts(data);
    } catch (e) {}
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/youtube/history');
      const data = await res.json();
      setHistory(data);
    } catch (e) {}
  };

  const fetchChannelVideos = async () => {
    try {
      const res = await fetch('/api/youtube/channel-videos');
      const data = await res.json();
      if (data.videos) {
        setChannelVideos(data.videos);
      }
    } catch (e) {}
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStatus(), fetchScheduled(), fetchHistory(), fetchChannelVideos()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Listen for OAuth Success Messages, Storage Events, and Window Focus
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'YOUTUBE_AUTH_SUCCESS') {
        loadAllData();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'youtube_auth_success') {
        loadAllData();
      }
    };

    const handleFocus = () => {
      loadAllData();
    };

    window.addEventListener('message', handleOAuthMessage);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('message', handleOAuthMessage);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Watch for external trigger
  useEffect(() => {
    if (triggerVideo) {
      setVideoUrl(triggerVideo.videoUrl);
      setTitle(triggerVideo.defaultTitle);
      setDescription(triggerVideo.defaultDescription);
      setFormSource(triggerVideo.source);
      setFormBrand(triggerVideo.brandName || '');
      setIsScheduled(false);
      setFormOpen(true);
      // scroll to form
      setTimeout(() => {
        document.getElementById('yt-export-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [triggerVideo]);

  const handleConnect = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/youtube/auth-url');
      const data = await res.json();
      if (data.configured && data.url) {
        // Real Google OAuth Provider URL -> Open directly in popup
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        const popup = window.open(
          data.url, 
          'youtube_oauth_popup', 
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
        );
        
        if (!popup) {
          alert('Popup blocker detected. Please allow popups to connect your YouTube Channel.');
          setActionLoading(false);
          return;
        }

        // Start polling for connection completion
        let elapsed = 0;
        const interval = setInterval(async () => {
          elapsed += 1500;
          const statusRes = await fetch('/api/youtube/status');
          const statusData = await statusRes.json();
          
          if (statusData.connected || elapsed >= 45000 || popup.closed) {
            clearInterval(interval);
            setActionLoading(false);
            if (statusData.connected) {
              setStatus(statusData);
              loadAllData();
            }
          }
        }, 1500);

      } else {
        // Unconfigured/Demo fallback: Connect in-app directly without container popups
        const demoRes = await fetch('/api/youtube/demo-connect', { method: 'POST' });
        const demoData = await demoRes.json();
        if (demoData.success) {
          await loadAllData();
        } else {
          alert('Could not connect demo channel: ' + (demoData.error || 'Unknown error'));
        }
        setActionLoading(false);
      }
    } catch (err: any) {
      alert('OAuth Error: ' + err.message);
      setActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your YouTube Channel? This will stop automated scheduled posts.')) return;
    setActionLoading(true);
    try {
      await fetch('/api/youtube/disconnect', { method: 'POST' });
      await loadAllData();
    } catch (e) {}
    setActionLoading(false);
  };

  const handleExportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status.connected) {
      alert('Please connect your YouTube Channel first!');
      return;
    }

    setActionLoading(true);
    try {
      let scheduledTime = null;
      if (isScheduled && scheduleDate && scheduleTime) {
        scheduledTime = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      }

      const res = await fetch('/api/youtube/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl,
          title,
          description,
          privacyStatus,
          scheduledTime,
          brandName: formBrand,
          source: formSource
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Export failed');

      alert(result.message || 'Action completed successfully!');
      setFormOpen(false);
      if (onCloseTrigger) onCloseTrigger();
      await loadAllData();
    } catch (err: any) {
      alert('Export failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteScheduled = async (id: string) => {
    if (!confirm('Cancel this scheduled post?')) return;
    try {
      await fetch(`/api/youtube/scheduled/${id}`, { method: 'DELETE' });
      await fetchScheduled();
    } catch (e) {}
  };

  return (
    <div className="bg-[#0D0D11] border border-[#1C1C22] rounded-2xl p-6 flex flex-col gap-5 w-full select-none">
      
      {/* YouTube Connection Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#14141A] border border-[#22222E] rounded-xl p-4.5">
        <div className="flex items-start md:items-center gap-3.5">
          {status.connected && status.avatarUrl ? (
            <img 
              src={status.avatarUrl} 
              alt={status.channelName} 
              className="w-12 h-12 rounded-full border border-red-500/40 object-cover shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-red-950/50 flex items-center justify-center border border-red-900/40 text-red-500 shrink-0">
              <Youtube className="w-6 h-6 animate-pulse" />
            </div>
          )}
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
                {status.connected ? status.channelName : 'YouTube Data Automation'}
              </h3>
              {status.connected ? (
                <span className="flex items-center gap-1 text-[9px] bg-emerald-950 text-emerald-400 font-bold border border-emerald-900 px-2 py-0.5 rounded-full uppercase">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Connected
                </span>
              ) : (
                <span className="text-[9px] bg-amber-950 text-amber-400 font-bold border border-amber-900 px-2 py-0.5 rounded-full uppercase">
                  Disconnected
                </span>
              )}
            </div>

            {status.connected ? (
              <div className="flex items-center gap-3 text-xs text-[#A1A1AA] flex-wrap mt-0.5">
                {status.customUrl && (
                  <span className="text-red-400 font-medium">{status.customUrl}</span>
                )}
                <span className="bg-[#1C1C24] border border-[#272732] text-white px-2.5 py-0.5 rounded-md font-semibold text-[11px] flex items-center gap-1">
                  <Video className="w-3 h-3 text-red-400" />
                  <strong>{Number(status.videoCount || 0).toLocaleString()}</strong> Videos
                </span>
                <span className="bg-[#1C1C24] border border-[#272732] text-white px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
                  <strong>{Number(status.subscriberCount || 0).toLocaleString()}</strong> Subscribers
                </span>
                {status.viewCount && (
                  <span className="bg-[#1C1C24] border border-[#272732] text-[#D4D4D8] px-2.5 py-0.5 rounded-md font-medium text-[11px]">
                    <strong>{Number(status.viewCount || 0).toLocaleString()}</strong> Total Views
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#71717A]">
                Link your channel via Google OAuth to automate video posting, schedule campaigns, and track history.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          {status.connected ? (
            <>
              <button
                onClick={loadAllData}
                disabled={actionLoading}
                title="Refresh Channel Live Stats"
                className="p-2 bg-[#27272A] hover:bg-[#3F3F46] text-[#D4D4D8] rounded-lg transition border border-[#3F3F46] cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleDisconnect}
                disabled={actionLoading}
                className="w-full md:w-auto px-4 py-2 bg-[#27272A] hover:bg-red-950/30 hover:text-red-400 text-xs font-bold uppercase tracking-wider text-[#D4D4D8] rounded-lg transition border border-[#3F3F46] hover:border-red-900/50 cursor-pointer"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={actionLoading}
              className="w-full md:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-[#1C1C22] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:text-[#52525B]"
            >
              {actionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Youtube className="w-3.5 h-3.5" />
                  Connect YouTube Channel
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {!status.configured && !status.connected && (
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-xl p-4.5 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-300">
            <strong className="block uppercase font-bold text-[10px] tracking-wider mb-1">OAuth Credentials Needed</strong>
            Provide your <strong>YOUTUBE_CLIENT_ID</strong> and <strong>YOUTUBE_CLIENT_SECRET</strong> in the Settings menu or `.env` to start connecting your channels.
          </div>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('scheduler')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer uppercase ${
              activeSubTab === 'scheduler' ? 'bg-[#1C1C22] text-[#F5F5F5] border border-[#27272A]' : 'text-[#71717A] hover:text-[#A1A1AA]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Scheduled Queue ({scheduledPosts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer uppercase ${
              activeSubTab === 'history' ? 'bg-[#1C1C22] text-[#F5F5F5] border border-[#27272A]' : 'text-[#71717A] hover:text-[#A1A1AA]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Posting History ({history.length})
          </button>
          {status.connected && (
            <button
              onClick={() => setActiveSubTab('channel_videos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer uppercase ${
                activeSubTab === 'channel_videos' ? 'bg-[#1C1C22] text-[#F5F5F5] border border-[#27272A]' : 'text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              Live Channel Videos ({channelVideos.length})
            </button>
          )}
        </div>

        <button 
          onClick={() => {
            setFormOpen(!formOpen);
            if (!formOpen) {
              setVideoUrl('');
              setTitle('');
              setDescription('');
            }
          }}
          className="text-xs font-extrabold uppercase tracking-wider text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-950/20 border border-red-900/50 px-2.5 py-1 rounded-md transition cursor-pointer"
        >
          <Video className="w-3.5 h-3.5" />
          + Manual Upload / Post
        </button>
      </div>

      <div id="yt-export-form-anchor" />

      {/* Manual Upload / Export Form */}
      <AnimatePresence>
        {formOpen && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#121215] border border-[#27272A] rounded-xl p-5 flex flex-col gap-4"
            onSubmit={handleExportSubmit}
          >
            <div className="flex items-center justify-between border-b border-[#27272A] pb-2">
              <span className="text-[10px] font-extrabold tracking-widest text-red-400 uppercase bg-red-950/40 px-2.5 py-1 rounded border border-red-900/50">
                🚀 Create YouTube Video Campaign
              </span>
              <button 
                type="button" 
                onClick={() => {
                  setFormOpen(false);
                  if (onCloseTrigger) onCloseTrigger();
                }}
                className="text-xs text-[#71717A] hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Video Source URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-[#1C1C22] border border-[#27272A] rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="The best marketing hacks..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1C1C22] border border-[#27272A] rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Video Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What is this video about? Add tags, call-to-actions, and links..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1C1C22] border border-[#27272A] rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Privacy Status</label>
                <select
                  value={privacyStatus}
                  onChange={(e) => setPrivacyStatus(e.target.value)}
                  className="w-full bg-[#1C1C22] border border-[#27272A] rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-red-500"
                >
                  <option value="private">Private (Default/Safe)</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="public">Public (Immediate Post)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Posting Method</label>
                <div className="flex items-center gap-4 h-full">
                  <label className="flex items-center gap-2 text-xs text-[#A1A1AA] cursor-pointer">
                    <input
                      type="radio"
                      checked={!isScheduled}
                      onChange={() => setIsScheduled(false)}
                      className="accent-red-500"
                    />
                    Publish Instantly
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#A1A1AA] cursor-pointer">
                    <input
                      type="radio"
                      checked={isScheduled}
                      onChange={() => setIsScheduled(true)}
                      className="accent-red-500"
                    />
                    Automate / Schedule
                  </label>
                </div>
              </div>

              {isScheduled && (
                <div className="grid grid-cols-2 gap-3 md:col-span-2 bg-[#1C1C22] p-4 rounded-xl border border-[#27272A]">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Publish Date</label>
                    <input
                      type="date"
                      required={isScheduled}
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full bg-[#121215] border border-[#27272A] rounded-lg p-2 text-xs text-[#F5F5F5] focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Publish Time</label>
                    <input
                      type="time"
                      required={isScheduled}
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full bg-[#121215] border border-[#27272A] rounded-lg p-2 text-xs text-[#F5F5F5] focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={actionLoading || !status.connected}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-[#27272A] text-white text-xs font-extrabold uppercase tracking-widest py-3 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:text-[#52525B]"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Video Export...
                </>
              ) : isScheduled ? (
                <>
                  <Clock className="w-4 h-4" />
                  Confirm & Schedule Post
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Publish Live to YouTube Now
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Sub Tabs Contents */}
      <div className="flex-1 min-h-[160px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#71717A] mb-2" />
            <span className="text-xs text-[#52525B]">Synchronizing auto-posting queue...</span>
          </div>
        ) : (
          <>
            {/* SCHEDULER TAB */}
            {activeSubTab === 'scheduler' && (
              <div className="flex flex-col gap-3">
                {scheduledPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 border border-dashed border-[#1C1C22] rounded-xl">
                    <Calendar className="w-8 h-8 text-[#52525B] mb-2" />
                    <span className="text-xs text-[#71717A] font-bold uppercase tracking-wider">Queue is Empty</span>
                    <span className="text-[10px] text-[#52525B] mt-1">Schedule video campaigns to post them automatically.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scheduledPosts.map((post) => (
                      <div 
                        key={post.id}
                        className="bg-[#121215] border border-[#27272A] rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-red-950/40 transition"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[8px] font-extrabold tracking-wider bg-red-950/40 text-red-400 px-2 py-0.5 rounded border border-red-900/40 uppercase">
                              Scheduled
                            </span>
                            <span className="text-[9px] text-[#71717A] flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {new Date(post.scheduledTime).toLocaleString()}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[#F5F5F5] mt-2 line-clamp-1">{post.title}</h4>
                          <p className="text-[11px] text-[#71717A] mt-1 line-clamp-2">{post.description}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#1C1C22] pt-2.5">
                          <span className="text-[9px] text-[#52525B]">Source: <strong className="text-[#A1A1AA] uppercase">{post.source}</strong></span>
                          <button
                            onClick={() => handleDeleteScheduled(post.id)}
                            className="text-[#71717A] hover:text-red-400 p-1 rounded hover:bg-red-950/10 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* HISTORY TAB */}
            {activeSubTab === 'history' && (
              <div className="flex flex-col gap-3">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 border border-dashed border-[#1C1C22] rounded-xl">
                    <History className="w-8 h-8 text-[#52525B] mb-2" />
                    <span className="text-xs text-[#71717A] font-bold uppercase tracking-wider">No Export History</span>
                    <span className="text-[10px] text-[#52525B] mt-1">Videos you publish immediately or automate will show up here.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                    {history.map((log) => (
                      <div 
                        key={log.id}
                        className="bg-[#121215] border border-[#27272A] rounded-xl p-3 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-red-950/20 border border-red-900/30 flex items-center justify-center text-red-500 shrink-0">
                            <Play className="w-4 h-4 fill-current" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#F5F5F5]">{log.title}</h4>
                            <div className="flex items-center gap-2 text-[9px] text-[#71717A] mt-0.5">
                              <span>Source: <strong className="text-[#A1A1AA] uppercase">{log.source}</strong></span>
                              <span>•</span>
                              <span>{new Date(log.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <a
                          href={log.videoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-[#1C1C22] hover:bg-red-600 hover:text-white transition rounded-lg text-[10px] font-extrabold uppercase tracking-wider border border-[#27272A] text-red-400 flex items-center gap-1 cursor-pointer"
                        >
                          <Youtube className="w-3.5 h-3.5" />
                          View live
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LIVE CHANNEL VIDEOS TAB */}
            {activeSubTab === 'channel_videos' && (
              <div className="flex flex-col gap-3">
                {channelVideos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 border border-dashed border-[#1C1C22] rounded-xl">
                    <Youtube className="w-8 h-8 text-[#52525B] mb-2" />
                    <span className="text-xs text-[#71717A] font-bold uppercase tracking-wider">No Public Videos Found</span>
                    <span className="text-[10px] text-[#52525B] mt-1">Make sure your connected channel has uploaded public or unlisted videos.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {channelVideos.map((vid, idx) => (
                      <div 
                        key={idx}
                        className="bg-[#121215] border border-[#27272A] rounded-xl p-3 flex gap-3 items-center hover:border-red-900/40 transition"
                      >
                        <img 
                          src={vid.thumbnailUrl} 
                          alt={vid.title} 
                          className="w-20 h-14 object-cover rounded-lg shrink-0 border border-[#27272A]"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-[#F5F5F5] truncate leading-tight" title={vid.title}>
                            {vid.title}
                          </h4>
                          <span className="text-[9.5px] text-[#71717A] mt-1">
                            Published: {vid.publishedAt ? new Date(vid.publishedAt).toLocaleDateString() : 'Recent'}
                          </span>
                          <a
                            href={vid.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 mt-1 cursor-pointer"
                          >
                            Watch on YouTube <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
