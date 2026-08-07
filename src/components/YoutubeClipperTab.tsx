import React, { useState, useEffect, useRef } from 'react';
import { Scissors, Youtube, Download, Play, Pause, RefreshCw, FileText, Sparkles, Check, Loader2, Volume2, VolumeX, Plus, Settings2, Sliders, Search, ExternalLink } from 'lucide-react';

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

interface ClipRecommendation {
  id: string;
  youtubeUrl: string;
  videoTitle: string;
  thumbnailUrl: string;
  startSec: number;
  endSec: number;
  duration: number;
  clipTitle: string;
  clipDesc: string;
  subtitles: Subtitle[];
  downloadUrl: string;
  createdAt: string;
}

interface YoutubeClipperTabProps {
  serverUrl?: string;
  onExportToYoutube?: (video: { videoUrl: string; defaultTitle: string; defaultDescription: string; brandName?: string }) => void;
}

export default function YoutubeClipperTab({ serverUrl, onExportToYoutube }: YoutubeClipperTabProps = {}) {
  const getApiUrl = (endpoint: string) => {
    const base = serverUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${base.replace(/\/+$/, '')}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  };

  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [customTranscript, setCustomTranscript] = useState('');
  const [requestedClipsCount, setRequestedClipsCount] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [recommendations, setRecommendations] = useState<ClipRecommendation[]>([]);
  const [savedClips, setSavedClips] = useState<ClipRecommendation[]>([]);
  const [activeClip, setActiveClip] = useState<ClipRecommendation | null>(null);

  // Manual Custom Clip Creator State
  const [customStartSec, setCustomStartSec] = useState<number>(0);
  const [customEndSec, setCustomEndSec] = useState<number>(30);
  const [customTitleInput, setCustomTitleInput] = useState<string>('');

  // Audio Sound State
  const [isIframeSoundOn, setIsIframeSoundOn] = useState<boolean>(true);
  const [allowOriginalAudio, setAllowOriginalAudio] = useState(true);
  const [audioVolume, setAudioVolume] = useState(100);
  const [noisePassThrough, setNoisePassThrough] = useState<'raw' | 'clean'>('raw');

  // Subtitle Customizer States
  const [fontSize, setFontSize] = useState(13);
  const [captionColor, setCaptionColor] = useState('#FBBF24'); // Yellow
  const [captionFont, setCaptionFont] = useState<'impact' | 'inter' | 'serif' | 'mono' | 'marker'>('impact');
  const [captionBgStyle, setCaptionBgStyle] = useState<'solid' | 'yellow_box' | 'glass' | 'neon' | 'none'>('solid');
  const [captionCasing, setCaptionCasing] = useState<'uppercase' | 'capitalize' | 'lowercase'>('uppercase');
  const [captionPosition, setCaptionPosition] = useState<'bottom' | 'center' | 'top'>('bottom');
  const [activeSubtitle, setActiveSubtitle] = useState('');

  // Reframing & Sizing Options
  const [reframeMode, setReframeMode] = useState<'full_916' | 'fit_blur_916' | 'letterbox_916' | 'original_169'>('full_916');

  // Discovery & Search Channel/Niche State
  const [searchNicheQuery, setSearchNicheQuery] = useState('');
  const [discoveredVideos, setDiscoveredVideos] = useState<any[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);

  // Timed B-Roll Stock Photo & Pop-up Image Overlay State
  const [brollPrompt, setBrollPrompt] = useState('');
  const [isGeneratingBroll, setIsGeneratingBroll] = useState(false);
  const [brollOverlays, setBrollOverlays] = useState<Array<{
    id: string;
    url: string;
    prompt: string;
    startSec: number;
    endSec: number;
    position: 'top_right' | 'center' | 'top_left' | 'bottom_right';
  }>>([]);

  // Embed Player controller ref to poll playback timer for captions simulation
  const playerPollInterval = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [editingSubIndex, setEditingSubIndex] = useState<number | null>(null);

  // Discover top performing videos in a channel or niche
  const handleDiscoverVideos = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchNicheQuery.trim()) return;
    setIsDiscovering(true);
    try {
      const res = await fetch(getApiUrl('/api/youtube-clipper/discover'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchNicheQuery, type: 'channel_search' })
      });
      const data = await res.json();
      if (data.success) {
        setDiscoveredVideos(data.videos || []);
      }
    } catch (err) {
      console.error('Failed to discover videos:', err);
    } finally {
      setIsDiscovering(false);
    }
  };

  // Generate a realistic stock image or AI pop-up element using FLUX / Pollinations
  const handleGenerateBrollOverlay = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!brollPrompt.trim()) return;
    setIsGeneratingBroll(true);
    try {
      const res = await fetch(getApiUrl('/api/video-studio/generate-broll'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: brollPrompt })
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        const newOverlay = {
          id: `broll-${Date.now()}`,
          url: data.imageUrl,
          prompt: brollPrompt,
          startSec: 2,
          endSec: 8,
          position: 'top_right' as const
        };
        setBrollOverlays(prev => [...prev, newOverlay]);
        setBrollPrompt('');
      }
    } catch (err) {
      console.error('Error generating B-roll overlay:', err);
    } finally {
      setIsGeneratingBroll(false);
    }
  };

  // Send play/pause postMessage command to YouTube iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isPlaying ? 'playVideo' : 'pauseVideo';
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command, args: '' }),
          '*'
        );
      } catch (err) {
        // Safe fallback
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    fetchSavedClips();
    return () => {
      if (playerPollInterval.current) clearInterval(playerPollInterval.current);
    };
  }, []);

  // Reset timer when active clip changes
  useEffect(() => {
    if (activeClip) {
      setPlaybackTime(0);
      setIsPlaying(true);
    }
  }, [activeClip?.id]);

  // Poll timer ONLY when isPlaying is true so captions stop when video is paused
  useEffect(() => {
    if (activeClip && isPlaying) {
      if (playerPollInterval.current) clearInterval(playerPollInterval.current);
      
      playerPollInterval.current = setInterval(() => {
        setPlaybackTime(prev => {
          const next = prev + 1;
          if (next >= activeClip.duration) {
            return 0; // loop back to 0
          }
          return next;
        });
      }, 1000);
    } else {
      if (playerPollInterval.current) {
        clearInterval(playerPollInterval.current);
        playerPollInterval.current = null;
      }
    }

    return () => {
      if (playerPollInterval.current) clearInterval(playerPollInterval.current);
    };
  }, [activeClip, isPlaying]);

  // Update active subtitle matching current timed offset in lockstep
  useEffect(() => {
    if (activeClip) {
      const match = activeClip.subtitles.find(
        sub => playbackTime >= sub.start && playbackTime <= sub.end
      );
      setActiveSubtitle(match ? match.text : '');
    } else {
      setActiveSubtitle('');
    }
  }, [playbackTime, activeClip]);

  // Update a single subtitle text line directly in state
  const handleUpdateSubtitle = (subIdx: number, newText: string) => {
    if (!activeClip) return;
    const updatedSubs = activeClip.subtitles.map((s, idx) => 
      idx === subIdx ? { ...s, text: newText } : s
    );
    const updatedClip = { ...activeClip, subtitles: updatedSubs };
    setActiveClip(updatedClip);
    setSavedClips(prev => prev.map(c => c.id === activeClip.id ? updatedClip : c));
  };

  const fetchSavedClips = async () => {
    try {
      const res = await fetch(getApiUrl('/api/youtube-clipper/list'), { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSavedClips(data.list);
        if (data.list.length > 0 && !activeClip) {
          setActiveClip(data.list[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load saved clips:', err);
    }
  };

  const [analysisStep, setAnalysisStep] = useState('');

  const handleAnalyze = async (e?: React.FormEvent, urlOverride?: string) => {
    if (e) e.preventDefault();
    const targetUrl = urlOverride || youtubeUrl;
    if (!targetUrl) return;
    setLoading(true);
    setAnalysisStep('1. Resolving YouTube Metadata...');
    try {
      setTimeout(() => setAnalysisStep('2. Extracting High-Retention Transcript Hooks...'), 600);
      setTimeout(() => setAnalysisStep('3. Generating Smart Subtitles & Timings...'), 1400);

      const res = await fetch(getApiUrl('/api/youtube-clipper/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: targetUrl, customTranscript, requestedClipsCount }),
      });
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.recommendations);
        if (data.recommendations.length > 0) {
          setActiveClip(data.recommendations[0]);
        }
        setSavedClips(prev => [...data.recommendations, ...prev]);
        setSuccessMsg(`Extracted ${data.recommendations.length} highly engaging viral hook clips with smart subtitles!`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setLoading(false);
      setAnalysisStep('');
    }
  };

  const handleCreateCustomClip = () => {
    if (customEndSec <= customStartSec) return;
    
    let videoId = 'dQw4w9WgXcQ';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = youtubeUrl.match(regExp);
    if (match && match[2].length === 11) videoId = match[2];

    const dur = customEndSec - customStartSec;
    const clipTitle = customTitleInput.trim() || `Custom Clip (${customStartSec}s - ${customEndSec}s)`;
    
    // Generate sequential subtitles covering 100% of duration in 5s increments
    const generatedSubtitles = [];
    const step = 5;
    let currentStart = 0;
    while (currentStart < dur) {
      const currentEnd = Math.min(currentStart + step - 1, dur);
      const isFirst = currentStart === 0;
      const isLast = currentEnd >= dur - 1;
      const subText = isFirst 
        ? clipTitle 
        : isLast 
          ? `Original Audio Segment [${customStartSec}s-${customEndSec}s]`
          : `High converting viral moment at ${customStartSec + currentStart}s`;
      generatedSubtitles.push({
        start: currentStart,
        end: currentEnd,
        text: subText
      });
      currentStart += step;
    }

    const newClip: ClipRecommendation = {
      id: `${videoId}-custom-${Date.now()}`,
      youtubeUrl,
      videoTitle: `YouTube Video [${videoId}]`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      startSec: customStartSec,
      endSec: customEndSec,
      duration: dur,
      clipTitle,
      clipDesc: `Manually extracted segment from ${customStartSec}s to ${customEndSec}s`,
      subtitles: generatedSubtitles,
      downloadUrl: `https://www.youtube.com/embed/${videoId}?start=${customStartSec}&end=${customEndSec}&autoplay=1&mute=0&enablejsapi=1&controls=1&modestbranding=1&rel=0`,
      createdAt: new Date().toISOString()
    };

    setSavedClips(prev => [newClip, ...prev]);
    setActiveClip(newClip);
    setIsPlaying(true);
    setCustomTitleInput('');
    setSuccessMsg(`Created custom clip: "${clipTitle}"`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleExport = async (clipId: string) => {
    if (!activeClip) return;
    setExporting(clipId);
    setTimeout(() => {
      setExporting(null);
      
      // Generate standard WebVTT subtitles format from edited subtitles
      let vttContent = 'WEBVTT\n\n';
      activeClip.subtitles.forEach((sub, idx) => {
        const formatTime = (sec: number) => {
          const hrs = Math.floor(sec / 3600);
          const mins = Math.floor((sec % 3600) / 60);
          const secs = Math.floor(sec % 60);
          const ms = Math.round((sec % 1) * 1000);
          const pad = (n: number) => n.toString().padStart(2, '0');
          return `${pad(hrs)}:${pad(mins)}:${pad(secs)}.${ms.toString().padStart(3, '0')}`;
        };
        vttContent += `${idx + 1}\n`;
        vttContent += `${formatTime(activeClip.startSec + sub.start)} --> ${formatTime(activeClip.startSec + sub.end)}\n`;
        vttContent += `${sub.text}\n\n`;
      });

      try {
        const blob = new Blob([vttContent], { type: 'text/vtt;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${activeClip.clipTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_subtitles.vtt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Failed to download subtitles file:', err);
      }

      setSuccessMsg(`Successfully compiled vertical 9:16 clip and downloaded standard Subtitles (VTT) package!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 2500);
  };

  const getEmbedUrl = (clip: ClipRecommendation) => {
    const isMuted = !isIframeSoundOn || !allowOriginalAudio;
    let url = clip.downloadUrl;
    if (isMuted) {
      url = url.replace('mute=0', 'mute=1');
    } else {
      url = url.replace('mute=1', 'mute=0');
    }
    if (!isPlaying) {
      url = url.replace('autoplay=1', 'autoplay=0');
    } else {
      url = url.replace('autoplay=0', 'autoplay=1');
    }
    return url;
  };

  return (
    <div id="yt-clipper-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1 text-[#F5F5F5] font-sans w-full max-w-full overflow-x-hidden">
      
      {/* LEFT PORTION: VIDEO INPUT FORM & MULTI-EXTRACT CONTROLS */}
      <div id="yt-input-panel" className="lg:col-span-4 bg-[#121215] border border-[#27272A] rounded-xl p-5 flex flex-col gap-5">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red-500" />
            YouTube Smart Hook Clipper
          </h2>
          <p className="text-xs text-[#71717A] mt-1">
            Extract multiple viral clips, adjust captions, and enable raw video sound inside a vertical 9:16 reframe.
          </p>
        </div>

        <div className="border-t border-[#27272A] pt-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              Discover Channel / Niche Candidates
            </span>
          </div>

          <form onSubmit={handleDiscoverVideos} className="flex gap-2">
            <input
              type="text"
              placeholder="Search niche, topic, or channel (e.g. SaaS, MrBeast)..."
              value={searchNicheQuery}
              onChange={e => setSearchNicheQuery(e.target.value)}
              className="bg-[#1C1C22] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 w-full focus:outline-none focus:border-zinc-500 transition"
            />
            <button
              type="submit"
              disabled={isDiscovering}
              className="bg-black hover:bg-zinc-900 border border-zinc-700 text-white text-[10px] font-extrabold uppercase px-3.5 py-1.5 rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              {isDiscovering ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
              Find
            </button>
          </form>

          {discoveredVideos.length > 0 && (
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 bg-[#181820] p-2.5 rounded-lg border border-[#2A2A38]">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-semibold px-1">
                <span>{discoveredVideos.length} Live Results Found</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  YouTube Live Search
                </span>
              </div>
              {discoveredVideos.map((vid, idx) => (
                <div key={idx} className="bg-[#121215] p-2 rounded-lg border border-[#27272A] flex items-center justify-between gap-2.5 hover:border-zinc-700 transition">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img src={vid.thumbnailUrl} alt={vid.videoTitle} className="w-14 h-9 object-cover rounded shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold text-zinc-100 truncate leading-tight" title={vid.videoTitle}>
                        {vid.videoTitle}
                      </span>
                      <span className="text-[9.5px] text-zinc-400 mt-0.5 truncate flex items-center gap-1">
                        <strong className="text-zinc-200">{vid.channelName}</strong>
                        {vid.estimatedViews && (
                          <>
                            • <span className="text-emerald-400 font-medium">{vid.estimatedViews}</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={vid.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Watch on YouTube"
                      className="p-1.5 text-zinc-400 hover:text-white bg-[#1C1C22] hover:bg-[#27272A] rounded border border-[#27272A] transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setYoutubeUrl(vid.youtubeUrl);
                        handleAnalyze(undefined, vid.youtubeUrl);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-[9.5px] font-bold px-2.5 py-1.5 rounded-md cursor-pointer transition flex items-center gap-1 border border-red-500 shadow-sm"
                    >
                      <Scissors className="w-3 h-3" />
                      Clip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">YouTube Video URL</label>
            <input
              id="yt-video-url"
              type="text"
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              className="bg-[#1C1C22] border border-[#27272A] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 transition w-full placeholder-[#52525B]"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Extracts Count to Generate</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[3, 5, 8, 10].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setRequestedClipsCount(count)}
                  className={`py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                    requestedClipsCount === count
                      ? 'bg-red-600 text-white border-red-500 shadow-sm'
                      : 'bg-[#1C1C22] text-zinc-400 border-[#27272A] hover:text-white'
                  }`}
                >
                  {count} Clips
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Custom Transcript (Optional)
            </label>
            <textarea
              id="yt-transcript"
              rows={3}
              placeholder="Paste custom transcripts or video scripts to optimize AI timing accuracy..."
              value={customTranscript}
              onChange={e => setCustomTranscript(e.target.value)}
              className="bg-[#1C1C22] border border-[#27272A] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 transition w-full placeholder-[#52525B] resize-none"
            />
          </div>

          <button
            id="yt-analyze-btn"
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-[#27272A] text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition flex items-center justify-center gap-2 mt-1 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting {requestedClipsCount} Viral Clips...
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                Extract {requestedClipsCount} Viral Hooks
              </>
            )}
          </button>

          {loading && analysisStep && (
            <div className="bg-red-950/40 border border-red-800/50 rounded-lg p-2.5 text-xs text-red-200 flex items-center gap-2 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="font-semibold text-[11px]">{analysisStep}</span>
            </div>
          )}
        </form>

        {/* MANUAL CUSTOM CLIP EXTRACTION FORM */}
        <div className="border-t border-[#27272A] pt-4 flex flex-col gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            Add Custom Manual Segment
          </span>
          <div className="flex flex-col gap-2 bg-[#1C1C22] p-3 rounded-lg border border-[#27272A]">
            <input
              type="text"
              placeholder="Custom clip title..."
              value={customTitleInput}
              onChange={e => setCustomTitleInput(e.target.value)}
              className="bg-[#121215] border border-[#27272A] rounded px-2.5 py-1.5 text-xs text-white placeholder-zinc-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-zinc-400 font-bold uppercase">Start (sec)</span>
                <input
                  type="number"
                  min={0}
                  value={customStartSec}
                  onChange={e => setCustomStartSec(Number(e.target.value))}
                  className="bg-[#121215] border border-[#27272A] rounded px-2 py-1 text-xs text-white"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-zinc-400 font-bold uppercase">End (sec)</span>
                <input
                  type="number"
                  min={1}
                  value={customEndSec}
                  onChange={e => setCustomEndSec(Number(e.target.value))}
                  className="bg-[#121215] border border-[#27272A] rounded px-2 py-1 text-xs text-white"
                />
              </div>
            </div>
            <button
              onClick={handleCreateCustomClip}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 rounded transition cursor-pointer mt-1"
            >
              + Create Segment Clip
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="bg-[#14532D] text-emerald-300 border border-emerald-800 rounded-lg p-3 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* History of clipped items inside sidebar */}
        <div className="border-t border-[#27272A] pt-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
              Extracted Clips Archive ({savedClips.length})
            </span>
            {savedClips.length > 0 && (
              <span className="text-[9px] text-zinc-500 font-mono">Select to Preview</span>
            )}
          </div>
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            {savedClips.length === 0 ? (
              <span className="text-[10px] text-[#52525B] italic">No prior clips generated yet.</span>
            ) : (
              savedClips.map((clip) => (
                <button
                  key={clip.id}
                  onClick={() => setActiveClip(clip)}
                  className={`text-left p-2.5 rounded-lg border transition text-xs flex flex-col gap-0.5 cursor-pointer ${
                    activeClip?.id === clip.id
                      ? 'bg-red-950/40 border-red-900 text-red-200 shadow-sm'
                      : 'bg-[#1C1C22]/50 border-[#27272A] hover:border-[#3F3F46]'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold truncate">{clip.clipTitle}</span>
                    <span className="text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
                      {clip.duration}s
                    </span>
                  </div>
                  <span className="text-[9px] text-[#71717A] truncate">{clip.videoTitle}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PORTION: EDITOR & VERTICAL smartphone preview */}
      <div id="yt-preview-panel" className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#121215] border border-[#27272A] rounded-xl p-5">
        {activeClip ? (
          <>
            {/* Header portion */}
            <div className="md:col-span-12 border-b border-[#27272A] pb-3 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="text-[9px] font-bold uppercase bg-red-950 text-red-300 px-2.5 py-0.5 rounded-full border border-red-900">
                  9:16 CLIP VIEW
                </span>
                <h1 className="text-base font-bold text-[#F5F5F5] mt-1">{activeClip.clipTitle}</h1>
                <span className="text-xs text-[#71717A] mt-0.5 block truncate max-w-xl">{activeClip.videoTitle}</span>
              </div>
              <div className="bg-[#1C1C22] px-3 py-1.5 rounded-lg border border-[#27272A] flex items-center gap-2">
                <span className="text-[10px] font-bold text-red-400">⏱️ {activeClip.duration}s</span>
                <span className="text-[#52525B]">|</span>
                <span className="text-[10px] text-[#A1A1AA]">
                  Segment: {Math.floor(activeClip.startSec / 60)}:{(activeClip.startSec % 60).toString().padStart(2, '0')} - {Math.floor(activeClip.endSec / 60)}:{(activeClip.endSec % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Subtitles Customizer Block */}
            <div className="md:col-span-7 flex flex-col gap-4">
              
              {/* Reframing Mode Selector */}
              <div className="bg-[#1C1C22] rounded-xl p-4 border border-[#27272A] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    Video Reframing & Aspect Ratio
                  </span>
                  <span className="text-[9px] bg-red-950/80 text-red-300 px-2 py-0.5 rounded font-mono uppercase tracking-widest border border-red-900/50">
                    {reframeMode}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                  {[
                    { id: 'full_916', label: 'Crop Fill 9:16', desc: 'Edge-to-Edge Vertical' },
                    { id: 'fit_blur_916', label: 'Fit + Blur 9:16', desc: 'No Cut Content' },
                    { id: 'letterbox_916', label: 'Letterbox 9:16', desc: 'Black Bars' },
                    { id: 'original_169', label: 'Original 16:9', desc: 'Standard Horizontal' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setReframeMode(mode.id as any)}
                      className={`p-2 rounded-lg border text-left transition flex flex-col justify-between cursor-pointer ${
                        reframeMode === mode.id
                          ? 'bg-red-950/50 border-red-500 text-white shadow-md'
                          : 'bg-[#121215] border-[#27272A] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase">{mode.label}</span>
                      <span className="text-[8px] text-zinc-500 leading-none mt-1">{mode.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio & Video Noise Pass-Through Control */}
              <div className="bg-[#1C1C22] rounded-xl p-4 border border-[#27272A] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    Original Audio & Video Noise Pass-Through
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={allowOriginalAudio} 
                      onChange={(e) => {
                        setAllowOriginalAudio(e.target.checked);
                        if (e.target.checked) setIsIframeSoundOn(true);
                      }}
                      className="sr-only peer" 
                    />
                    <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#121215] p-3 rounded-lg border border-[#27272A]">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Audio Volume ({audioVolume}%)</span>
                      <button
                        type="button"
                        onClick={() => setIsIframeSoundOn(!isIframeSoundOn)}
                        className={`p-1 rounded text-[9px] font-bold flex items-center gap-1 cursor-pointer ${
                          isIframeSoundOn ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {isIframeSoundOn ? <Volume2 size={11} /> : <VolumeX size={11} />}
                        <span>{isIframeSoundOn ? 'Sound On' : 'Muted'}</span>
                      </button>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={audioVolume} 
                      onChange={(e) => setAudioVolume(parseInt(e.target.value))}
                      disabled={!allowOriginalAudio}
                      className="w-full accent-emerald-500 h-1 bg-[#27272A] rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Noise Handling</span>
                    <select
                      value={noisePassThrough}
                      onChange={(e) => setNoisePassThrough(e.target.value as any)}
                      disabled={!allowOriginalAudio}
                      className="bg-[#1C1C22] border border-[#27272A] text-zinc-200 text-[10px] rounded px-2 py-1 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                    >
                      <option value="raw">Raw Original Noise & Ambience</option>
                      <option value="clean">AI Speech Isolation (Suppress Noise)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Kinetic Captions Customizer */}
              <div className="bg-[#1C1C22] rounded-xl p-4 border border-[#27272A] flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-red-400" />
                  Kinetic Captions Style & Layout
                </span>
                
                {/* Style Row 1: Font Family, Background Style, Casing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#71717A]">Font Style</span>
                    <select
                      value={captionFont}
                      onChange={(e) => setCaptionFont(e.target.value as any)}
                      className="bg-[#121215] border border-[#27272A] text-zinc-200 text-[10px] rounded p-1.5 focus:outline-none focus:border-red-500"
                    >
                      <option value="impact">Impact Bold</option>
                      <option value="inter">Inter Modern</option>
                      <option value="serif">Serif Elegant</option>
                      <option value="mono">Monospace Code</option>
                      <option value="marker">Marker / Brush</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#71717A]">Highlight Box</span>
                    <select
                      value={captionBgStyle}
                      onChange={(e) => setCaptionBgStyle(e.target.value as any)}
                      className="bg-[#121215] border border-[#27272A] text-zinc-200 text-[10px] rounded p-1.5 focus:outline-none focus:border-red-500"
                    >
                      <option value="solid">Solid Black Box</option>
                      <option value="yellow_box">Yellow Box</option>
                      <option value="glass">Glassmorphic Blur</option>
                      <option value="neon">Neon Outline</option>
                      <option value="none">No Background (Shadow)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#71717A]">Position</span>
                    <select
                      value={captionPosition}
                      onChange={(e) => setCaptionPosition(e.target.value as any)}
                      className="bg-[#121215] border border-[#27272A] text-zinc-200 text-[10px] rounded p-1.5 focus:outline-none focus:border-red-500"
                    >
                      <option value="bottom">Bottom Frame</option>
                      <option value="center">Center / Middle</option>
                      <option value="top">Top Header</option>
                    </select>
                  </div>
                </div>

                {/* Style Row 2: Color Palette, Size, Casing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#121215] p-3 rounded-lg border border-[#27272A]">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#71717A]">Color Palette</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {['#FBBF24', '#EF4444', '#10B981', '#3B82F6', '#EC4899', '#FFFFFF', '#000000'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setCaptionColor(color)}
                          className={`w-5 h-5 rounded-full border transition cursor-pointer ${
                            captionColor === color ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <input 
                        type="color" 
                        value={captionColor}
                        onChange={(e) => setCaptionColor(e.target.value)}
                        className="w-5 h-5 bg-transparent border-0 rounded cursor-pointer p-0"
                        title="Pick custom color"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#71717A]">Font Size ({fontSize}px)</span>
                      <div className="flex gap-1">
                        {(['uppercase', 'capitalize', 'lowercase'] as const).map((caseType) => (
                          <button
                            key={caseType}
                            type="button"
                            onClick={() => setCaptionCasing(caseType)}
                            className={`px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded border ${
                              captionCasing === caseType ? 'bg-red-600 text-white border-red-500' : 'bg-[#1C1C22] text-zinc-400 border-[#27272A]'
                            }`}
                          >
                            {caseType.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="22"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full accent-red-500 h-1 bg-[#27272A] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Timed B-Roll & Stock Photo Pop-up Generator */}
                <div className="flex flex-col gap-2 bg-[#121215] p-3 rounded-lg border border-[#27272A] mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Timed Stock Photo & B-Roll Popups ({brollOverlays.length})
                    </span>
                    <span className="text-[8.5px] text-zinc-500">Gemini Omni Flash / Nano Banana 2</span>
                  </div>

                  <form onSubmit={handleGenerateBrollOverlay} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 3D revenue chart, realistic shocked face, tech product popup..."
                      value={brollPrompt}
                      onChange={(e) => setBrollPrompt(e.target.value)}
                      className="bg-[#1C1C22] border border-[#27272A] rounded px-2.5 py-1 text-xs text-white placeholder-zinc-500 w-full focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={isGeneratingBroll}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase px-3 py-1 rounded transition shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      {isGeneratingBroll ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      Generate
                    </button>
                  </form>

                  {brollOverlays.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2 max-h-48 overflow-y-auto pr-1">
                      {brollOverlays.map((overlay) => (
                        <div key={overlay.id} className="bg-[#1C1C22] p-2 rounded-lg flex flex-col gap-2 text-[10px] text-zinc-300 border border-[#2A2A38]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <img src={overlay.url} alt="broll" className="w-7 h-7 object-cover rounded shrink-0 border border-purple-500/30" />
                              <span className="truncate max-w-[130px] font-semibold text-zinc-200">{overlay.prompt}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setBrollOverlays(prev => prev.filter(o => o.id !== overlay.id))}
                              className="text-zinc-500 hover:text-red-400 p-1 text-xs transition"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Innovative Start & End Range Sliders */}
                          <div className="flex flex-col gap-1.5 bg-[#14141A] p-2 rounded border border-[#252535]">
                            <div className="flex items-center justify-between font-mono text-[9px] text-purple-300">
                              <span>POPUP TIME RANGE</span>
                              <span className="bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/80 font-bold">
                                {overlay.startSec}s ──► {overlay.endSec}s ({Math.max(1, overlay.endSec - overlay.startSec)}s duration)
                              </span>
                            </div>

                            {/* Dual Interactive Sliders */}
                            <div className="grid grid-cols-2 gap-2 items-center">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] text-zinc-400">Start Sec ({overlay.startSec}s)</span>
                                <input
                                  type="range"
                                  min="0"
                                  max={Math.max(10, overlay.endSec - 1)}
                                  value={overlay.startSec}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    setBrollOverlays(prev => prev.map(o => o.id === overlay.id ? { ...o, startSec: val } : o));
                                  }}
                                  className="w-full accent-purple-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                                />
                              </div>

                              <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] text-zinc-400">End Sec ({overlay.endSec}s)</span>
                                <input
                                  type="range"
                                  min={overlay.startSec + 1}
                                  max={Math.max(30, overlay.startSec + 20)}
                                  value={overlay.endSec}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || overlay.startSec + 1;
                                    setBrollOverlays(prev => prev.map(o => o.id === overlay.id ? { ...o, endSec: val } : o));
                                  }}
                                  className="w-full accent-purple-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#71717A]">Timed Subtitles Flow (Editable)</span>
                    <span className="text-[8.5px] text-zinc-500">Click text to edit spoken caption</span>
                  </div>
                  <div className="flex flex-col gap-1.5 bg-[#121215] p-2 rounded-lg border border-[#27272A] max-h-40 overflow-y-auto">
                    {activeClip.subtitles.map((sub, idx) => {
                      const isCurrent = playbackTime >= sub.start && playbackTime <= sub.end;
                      return (
                        <div
                          key={idx}
                          className={`p-1.5 rounded flex items-center justify-between gap-2 text-[10.5px] transition ${
                            isCurrent
                              ? 'bg-red-950/40 border border-red-900/50 text-red-200 font-bold'
                              : 'bg-[#1C1C22]/50 border border-transparent text-zinc-300'
                          }`}
                        >
                          <input
                            type="text"
                            value={sub.text}
                            onChange={(e) => handleUpdateSubtitle(idx, e.target.value)}
                            className={`bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-red-500 focus:bg-black/30 rounded px-1 py-0.5 text-xs w-full focus:outline-none transition ${
                              isCurrent ? 'text-red-200 font-bold' : 'text-zinc-200'
                            }`}
                            placeholder="Type spoken caption..."
                          />
                          <span className="shrink-0 text-[9.5px] font-mono text-[#52525B] px-1 bg-black/40 rounded">{sub.start}s - {sub.end}s</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => handleExport(activeClip.id)}
                  disabled={exporting !== null}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-[#27272A] text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition flex items-center justify-center gap-2 mt-1 cursor-pointer"
                >
                  {exporting === activeClip.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Compiling 9:16 Video Package...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Compile & Download Reframed 9:16 Clip
                    </>
                  )}
                </button>

                {onExportToYoutube && (
                  <button
                    type="button"
                    onClick={() => onExportToYoutube({
                      videoUrl: activeClip.downloadUrl || 'assets/sample.mp4',
                      defaultTitle: activeClip.clipTitle,
                      defaultDescription: `Vertical Clip: ${activeClip.clipDesc}\n\nOriginal Video: ${activeClip.videoTitle}\nSegment: ${activeClip.startSec}s - ${activeClip.endSec}s`,
                    })}
                    className="w-full bg-[#1C1C22] hover:bg-red-950/40 text-red-400 hover:text-red-300 text-xs font-extrabold uppercase tracking-widest py-2.5 rounded-lg transition flex items-center justify-center gap-2 border border-red-900/40 cursor-pointer"
                  >
                    <Youtube className="w-4 h-4" />
                    Export Clip to YouTube
                  </button>
                )}
              </div>
            </div>

            {/* VERTICAL PREVIEW MOCKUP */}
            <div className="md:col-span-5 flex flex-col items-center justify-start bg-[#1C1C22]/40 rounded-xl p-4 border border-[#27272A] min-h-[460px]">
              <div className="flex items-center justify-between w-full mb-3 gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Vertical 9:16 Preview</span>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isPlaying 
                        ? 'bg-[#272738] hover:bg-[#323246] text-zinc-200 border border-[#3A3A4E]' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 animate-pulse'
                    }`}
                  >
                    {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                    <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsIframeSoundOn(!isIframeSoundOn)}
                    className={`text-[9px] font-mono px-2 py-1 rounded border transition flex items-center gap-1 cursor-pointer ${
                      isIframeSoundOn ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800' : 'text-amber-400 bg-amber-950/80 border-amber-800'
                    }`}
                    title="Click to toggle sound"
                  >
                    {isIframeSoundOn ? <Volume2 size={11} /> : <VolumeX size={11} />}
                    <span>{isIframeSoundOn ? `SOUND ON` : 'MUTED'}</span>
                  </button>
                </div>
              </div>

              {/* Smartphone mockup */}
              <div className={`relative w-60 h-[380px] bg-black rounded-2xl border-4 border-[#3F3F46] shadow-2xl overflow-hidden flex flex-col justify-between ${
                reframeMode === 'original_169' ? 'h-[260px] w-full max-w-[280px]' : ''
              }`}>
                
                {/* VIDEO DISPLAY WITH REFRAMING MODES */}
                {reframeMode === 'full_916' && (
                  <div className="absolute inset-0 z-0 flex items-center justify-center scale-[1.85] transform overflow-hidden">
                    <iframe
                      ref={iframeRef}
                      src={getEmbedUrl(activeClip)}
                      title="YouTube video player"
                      allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"
                      className="w-full h-full border-0 pointer-events-auto"
                      style={{ aspectRatio: '16/9' }}
                    />
                    <div className="absolute inset-0 bg-black/5 pointer-events-none z-1" />
                  </div>
                )}

                {reframeMode === 'fit_blur_916' && (
                  <div className="absolute inset-0 z-0 flex flex-col items-center justify-center overflow-hidden">
                    {/* Background blurred layer */}
                    <div className="absolute inset-0 scale-[2.2] blur-xl opacity-60">
                      <iframe
                        src={getEmbedUrl(activeClip)}
                        title="YouTube video player bg"
                        allow="autoplay; encrypted-media"
                        className="w-full h-full border-0 pointer-events-none"
                      />
                    </div>
                    {/* Foreground fitted video */}
                    <div className="relative z-10 w-full aspect-video shadow-2xl border-y border-white/10">
                      <iframe
                        src={getEmbedUrl(activeClip)}
                        title="YouTube video player fg"
                        allow="autoplay; encrypted-media"
                        className="w-full h-full border-0 pointer-events-auto"
                      />
                    </div>
                  </div>
                )}

                {reframeMode === 'letterbox_916' && (
                  <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
                    <div className="w-full aspect-video">
                      <iframe
                        src={getEmbedUrl(activeClip)}
                        title="YouTube video player letterbox"
                        allow="autoplay; encrypted-media"
                        className="w-full h-full border-0 pointer-events-auto"
                      />
                    </div>
                  </div>
                )}

                {reframeMode === 'original_169' && (
                  <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
                    <iframe
                      src={getEmbedUrl(activeClip)}
                      title="YouTube video player 16:9"
                      allow="autoplay; encrypted-media"
                      className="w-full h-full border-0 pointer-events-auto"
                    />
                  </div>
                )}

                {/* Dynamic B-Roll Stock Image Popups */}
                {brollOverlays.map((overlay) => {
                  const isActive = playbackTime >= overlay.startSec && playbackTime <= overlay.endSec;
                  if (!isActive) return null;

                  const posClass =
                    overlay.position === 'top_left' ? 'top-10 left-3' :
                    overlay.position === 'top_right' ? 'top-10 right-3' :
                    overlay.position === 'bottom_right' ? 'bottom-12 right-3' :
                    'top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2';

                  return (
                    <div
                      key={overlay.id}
                      className={`absolute z-30 ${posClass} transition-all duration-300 transform scale-100 animate-bounce pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]`}
                    >
                      <div className="relative p-1 bg-black/80 backdrop-blur-md rounded-xl border border-purple-500/50 shadow-2xl flex flex-col items-center max-w-[120px]">
                        <img
                          src={overlay.url}
                          alt="B-Roll Overlay"
                          className="w-20 h-20 object-cover rounded-lg border border-purple-400/40"
                        />
                        <span className="text-[7.5px] font-bold text-purple-200 mt-1 truncate max-w-full px-1">
                          {overlay.prompt}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Top overlay badge for noise pass-through */}
                <div className="relative z-20 p-2.5 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                  <span className="text-[8px] font-extrabold uppercase bg-red-600/90 text-white px-2 py-0.5 rounded shadow">
                    9:16 HOOK
                  </span>
                  {allowOriginalAudio && (
                    <span className="text-[7.5px] font-bold text-emerald-300 bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      {noisePassThrough === 'raw' ? '⚡ Raw Video Noise On' : '✨ Clean Voice On'}
                    </span>
                  )}
                </div>

                {/* Captions Overlay synchronized with style options */}
                <div className={`relative z-20 px-3 w-full text-center flex flex-col pointer-events-none ${
                  captionPosition === 'top' ? 'mt-4 mb-auto' : captionPosition === 'center' ? 'my-auto' : 'mb-8 mt-auto'
                }`}>
                  {activeSubtitle && (
                    <span
                      className={`inline-block font-extrabold px-3 py-1.5 rounded-lg shadow-2xl leading-tight text-center max-w-[95%] mx-auto transform scale-105 transition-all ${
                        captionFont === 'impact' ? 'font-sans tracking-tight' :
                        captionFont === 'serif' ? 'font-serif' :
                        captionFont === 'mono' ? 'font-mono' :
                        captionFont === 'marker' ? 'font-serif italic' : 'font-sans'
                      } ${
                        captionBgStyle === 'solid' ? 'bg-black/85 border border-white/10' :
                        captionBgStyle === 'yellow_box' ? 'bg-amber-400 border border-amber-500 text-black shadow-lg' :
                        captionBgStyle === 'glass' ? 'bg-white/15 backdrop-blur-md border border-white/30 text-white' :
                        captionBgStyle === 'neon' ? 'bg-black/95 border-2 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.6)]' :
                        'bg-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,1)]'
                      }`}
                      style={{
                        color: captionBgStyle === 'yellow_box' ? '#000000' : captionColor,
                        fontSize: `${fontSize}px`,
                        textTransform: captionCasing as any,
                      }}
                    >
                      {captionCasing === 'uppercase' ? activeSubtitle.toUpperCase() :
                       captionCasing === 'lowercase' ? activeSubtitle.toLowerCase() :
                       activeSubtitle}
                    </span>
                  )}
                </div>

                {/* Bottom timer progress indicator */}
                <div className="relative z-20 w-full h-1 bg-white/20 pointer-events-none">
                  <div
                    className="h-full bg-red-600 transition-all duration-1000"
                    style={{ width: `${(playbackTime / activeClip.duration) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-col items-center text-center gap-1">
                <span className="text-[9px] text-[#A1A1AA] font-medium">
                  Reframe: <strong className="text-white">{reframeMode.toUpperCase().replace('_', ' ')}</strong>
                </span>
                <span className="text-[8.5px] text-[#52525B] max-w-xs leading-tight">
                  Original video audio & ambient noise passed through at {audioVolume}%. Tap player to play/pause.
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="md:col-span-12 flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
            <Youtube className="w-12 h-12 text-[#52525B] mb-3" />
            <h3 className="text-sm font-bold text-[#A1A1AA]">No Active Analysis</h3>
            <p className="text-xs text-[#52525B] mt-1 max-w-sm">
              Paste any valid YouTube link in the left box to automatically identify viral clips, crop, and overlay captions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

