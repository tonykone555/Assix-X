import React, { useState } from 'react';
import { 
  Bot, 
  Search, 
  FileText, 
  Youtube, 
  Github, 
  MapPin, 
  MessageSquare, 
  Sparkles, 
  Loader2, 
  ExternalLink, 
  Copy, 
  Check, 
  Zap, 
  Terminal, 
  Globe, 
  ShieldCheck, 
  ChevronRight,
  Database,
  Layers,
  Cpu
} from 'lucide-react';

interface ScoutAgentTabProps {
  serverUrl?: string;
}

export default function ScoutAgentTab({ serverUrl = '' }: ScoutAgentTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'autonomous' | 'jina' | 'exa' | 'youtube' | 'github' | 'overpass' | 'social'>('autonomous');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Autonomous Scout State
  const [scoutObjective, setScoutObjective] = useState('');
  const [scoutDepth, setScoutDepth] = useState<'fast' | 'deep'>('fast');
  const [scoutResult, setScoutResult] = useState<any>(null);

  // Jina Reader State
  const [jinaUrl, setJinaUrl] = useState('');
  const [jinaOutput, setJinaOutput] = useState<any>(null);

  // Exa State
  const [exaQuery, setExaQuery] = useState('');
  const [exaResults, setExaResults] = useState<any[]>([]);

  // YouTube State
  const [ytUrl, setYtUrl] = useState('');
  const [ytResult, setYtResult] = useState<any>(null);

  // GitHub State
  const [githubRepo, setGithubRepo] = useState('');
  const [githubAction, setGithubAction] = useState<'summary' | 'tree' | 'issues' | 'file'>('summary');
  const [githubFilePath, setGithubFilePath] = useState('');
  const [githubResult, setGithubResult] = useState<any>(null);

  // Overpass State
  const [overpassAmenity, setOverpassAmenity] = useState('restaurant');
  const [overpassCity, setOverpassCity] = useState('London');
  const [overpassResults, setOverpassResults] = useState<any[]>([]);

  // Social State
  const [socialPlatform, setSocialPlatform] = useState<'reddit' | 'twitter'>('reddit');
  const [socialTarget, setSocialTarget] = useState('marketing');
  const [socialResults, setSocialResults] = useState<any[]>([]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run Autonomous Scout
  const runAutonomousScout = async () => {
    if (!scoutObjective.trim()) return;
    setLoading(true);
    setScoutResult(null);
    try {
      const res = await fetch(`${serverUrl}/api/scout/autonomous-research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective: scoutObjective, depth: scoutDepth })
      });
      const data = await res.json();
      if (data.success) {
        setScoutResult(data.data);
      } else {
        alert(data.error || 'Scout research failed');
      }
    } catch (err: any) {
      alert('Error running Scout agent: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run Jina Reader
  const runJinaReader = async () => {
    if (!jinaUrl.trim()) return;
    setLoading(true);
    setJinaOutput(null);
    try {
      const res = await fetch(`${serverUrl}/api/scout/jina-reader`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jinaUrl })
      });
      const data = await res.json();
      setJinaOutput(data);
    } catch (err: any) {
      alert('Jina error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run Exa Search
  const runExaSearch = async () => {
    if (!exaQuery.trim()) return;
    setLoading(true);
    setExaResults([]);
    try {
      const res = await fetch(`${serverUrl}/api/scout/exa-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: exaQuery, numResults: 10 })
      });
      const data = await res.json();
      if (data.results) setExaResults(data.results);
    } catch (err: any) {
      alert('Exa error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run YouTube yt-dlp
  const runYoutubeExtractor = async () => {
    if (!ytUrl.trim()) return;
    setLoading(true);
    setYtResult(null);
    try {
      const res = await fetch(`${serverUrl}/api/scout/yt-dlp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: ytUrl })
      });
      const data = await res.json();
      if (data.success) setYtResult(data.data);
      else alert(data.error || 'yt-dlp extraction failed');
    } catch (err: any) {
      alert('yt-dlp error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run GitHub gh scanner
  const runGithubScanner = async () => {
    if (!githubRepo.trim()) return;
    setLoading(true);
    setGithubResult(null);
    try {
      const res = await fetch(`${serverUrl}/api/scout/github-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: githubRepo, action: githubAction, filePath: githubFilePath })
      });
      const data = await res.json();
      if (data.success) setGithubResult(data.data);
      else alert(data.error || 'GitHub scan failed');
    } catch (err: any) {
      alert('GitHub error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run Overpass POI engine
  const runOverpassPois = async () => {
    setLoading(true);
    setOverpassResults([]);
    try {
      const res = await fetch(`${serverUrl}/api/scout/overpass-pois`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amenity: overpassAmenity, city: overpassCity, limit: 20 })
      });
      const data = await res.json();
      if (data.pois) setOverpassResults(data.pois);
    } catch (err: any) {
      alert('Overpass error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run Social Scraper
  const runSocialScraper = async () => {
    if (!socialTarget.trim()) return;
    setLoading(true);
    setSocialResults([]);
    try {
      const res = await fetch(`${serverUrl}/api/scout/social-scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: socialPlatform, target: socialTarget })
      });
      const data = await res.json();
      if (data.items) setSocialResults(data.items);
    } catch (err: any) {
      alert('Social scraper error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0D0D11] text-[#F5F5F5] rounded-xl border border-[#27272A] overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-[#27272A] bg-[#121218] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">GitClaw Lyzr Scout Agent Suite</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Native System Tools Active
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA]">
              Autonomous local researcher powered by Jina Reader, Exa AI, yt-dlp, GitHub gh CLI, Overpass POI, and Social Scrapers.
            </p>
          </div>
        </div>

        {/* System Badges */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs bg-[#1E1E26] border border-[#27272A] rounded-md text-[#A1A1AA] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" /> yt-dlp & gh Installed
          </span>
          <span className="px-2.5 py-1 text-xs bg-[#1E1E26] border border-[#27272A] rounded-md text-[#A1A1AA] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" /> Direct Web Reader & Overpass Active
          </span>
        </div>
      </div>

      {/* Tools Navigation Sub-tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-[#27272A] bg-[#15151E] overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('autonomous')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'autonomous'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E1E28]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Autonomous Scout
        </button>

        <button
          onClick={() => setActiveSubTab('jina')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'jina'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E1E28]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" /> Direct Web Reader
        </button>

        <button
          onClick={() => setActiveSubTab('exa')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'exa'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E1E28]'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" /> Exa AI Search
        </button>

        <button
          onClick={() => setActiveSubTab('youtube')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'youtube'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E1E28]'
          }`}
        >
          <Youtube className="w-3.5 h-3.5 text-red-400" /> yt-dlp Extractor
        </button>

        <button
          onClick={() => setActiveSubTab('github')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'github'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E1E28]'
          }`}
        >
          <Github className="w-3.5 h-3.5 text-purple-400" /> GitHub gh Scanner
        </button>

        <button
          onClick={() => setActiveSubTab('overpass')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'overpass'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E1E28]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-rose-400" /> Local Business Search
        </button>

        <button
          onClick={() => setActiveSubTab('social')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'social'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E1E28]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Social Scraper
        </button>
      </div>

      {/* Main Content Workspace Area */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* SUBTAB 1: Autonomous Multi-Tool Scout Agent */}
        {activeSubTab === 'autonomous' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#14141E] border border-[#27272A] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Autonomous Scout Researcher
                  </h3>
                  <p className="text-xs text-[#71717A] mt-0.5">
                    Provide any research topic, brand URL, YouTube video link, or GitHub repo. Scout will automatically trigger and combine multiple native engines.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScoutDepth('fast')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                      scoutDepth === 'fast'
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                        : 'bg-[#1E1E28] border-[#27272A] text-[#A1A1AA]'
                    }`}
                  >
                    ⚡ Fast Scan
                  </button>
                  <button
                    onClick={() => setScoutDepth('deep')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                      scoutDepth === 'deep'
                        ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                        : 'bg-[#1E1E28] border-[#27272A] text-[#A1A1AA]'
                    }`}
                  >
                    🧠 Deep Research
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. AI automation agencies in London OR https://github.com/torvalds/linux OR https://youtube.com/watch?v=..."
                  value={scoutObjective}
                  onChange={e => setScoutObjective(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runAutonomousScout()}
                  className="flex-1 bg-[#09090D] border border-[#27272A] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={runAutonomousScout}
                  disabled={loading || !scoutObjective.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Launch Scout
                </button>
              </div>
            </div>

            {/* Results Output */}
            {scoutResult && (
              <div className="space-y-4">
                <div className="p-3 bg-[#12121A] border border-[#27272A] rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400">Sources Executed:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scoutResult.sourcesUsed?.map((src: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(JSON.stringify(scoutResult, null, 2))}
                    className="p-1.5 text-[#A1A1AA] hover:text-white bg-[#1E1E28] border border-[#27272A] rounded-md transition"
                    title="Copy Raw Result JSON"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Exa Search Results */}
                {scoutResult.exaSearchResults && (
                  <div className="p-4 bg-[#14141E] border border-[#27272A] rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5" /> Exa Semantic Search Results ({scoutResult.exaSearchResults.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {scoutResult.exaSearchResults.map((r: any, idx: number) => (
                        <div key={idx} className="p-3 bg-[#0D0D14] border border-[#27272A] rounded-lg space-y-1.5">
                          <a href={r.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-300 hover:underline flex items-center gap-1 truncate">
                            {r.title} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                          <p className="text-[11px] text-[#A1A1AA] line-clamp-3">{r.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overpass POI Results */}
                {scoutResult.overpassPoiData && (
                  <div className="p-4 bg-[#14141E] border border-[#27272A] rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Local Business Search ({scoutResult.overpassPoiData.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {scoutResult.overpassPoiData.map((poi: any, idx: number) => (
                        <div key={idx} className="p-3 bg-[#0D0D14] border border-[#27272A] rounded-lg space-y-1">
                          <p className="text-xs font-bold text-white">{poi.name}</p>
                          <p className="text-[10px] text-[#A1A1AA]">{poi.address || 'Address not listed'}</p>
                          {poi.phone && <p className="text-[10px] text-emerald-400">📞 {poi.phone}</p>}
                          {poi.website && (
                            <a href={poi.website} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-400 hover:underline truncate block">
                              🌐 {poi.website}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* YouTube Video Transcript Metadata */}
                {scoutResult.youtubeMetadata && (
                  <div className="p-4 bg-[#14141E] border border-[#27272A] rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5" /> yt-dlp Video & Transcript Details
                    </h4>
                    <div className="p-3 bg-[#0D0D14] border border-[#27272A] rounded-lg space-y-2">
                      <p className="text-xs font-bold text-white">{scoutResult.youtubeMetadata.title}</p>
                      <p className="text-[11px] text-[#A1A1AA]">Channel: {scoutResult.youtubeMetadata.uploader} | Views: {scoutResult.youtubeMetadata.viewCount?.toLocaleString()}</p>
                      <div className="max-h-48 overflow-y-auto p-2 bg-[#050508] border border-[#1E1E28] rounded text-[11px] font-mono text-[#D4D4D8]">
                        {scoutResult.youtubeMetadata.transcript}
                      </div>
                    </div>
                  </div>
                )}

                {/* GitHub Repo Data */}
                {scoutResult.githubRepoData && (
                  <div className="p-4 bg-[#14141E] border border-[#27272A] rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5" /> GitHub Repository Inspection
                    </h4>
                    <div className="p-3 bg-[#0D0D14] border border-[#27272A] rounded-lg space-y-2">
                      <p className="text-xs font-bold text-white">{scoutResult.githubRepoData.repo} (⭐ {scoutResult.githubRepoData.stars} stars)</p>
                      <p className="text-[11px] text-[#A1A1AA]">{scoutResult.githubRepoData.description}</p>
                      {scoutResult.githubRepoData.readme && (
                        <div className="max-h-48 overflow-y-auto p-2 bg-[#050508] border border-[#1E1E28] rounded text-[11px] font-mono text-[#D4D4D8]">
                          {scoutResult.githubRepoData.readme}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Web Reader Content */}
                {scoutResult.jinaWebMarkdown && (
                  <div className="p-4 bg-[#14141E] border border-[#27272A] rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Direct Web Content
                    </h4>
                    <div className="max-h-64 overflow-y-auto p-3 bg-[#050508] border border-[#27272A] rounded-lg font-mono text-[11px] text-[#D4D4D8] whitespace-pre-wrap">
                      {scoutResult.jinaWebMarkdown}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: Web Reader */}
        {activeSubTab === 'jina' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#14141E] border border-[#27272A] space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" /> Direct Web Reader Engine
              </h3>
              <p className="text-xs text-[#71717A]">
                Converts any web URL into LLM-friendly clean markdown, stripping ads and resolving client-side rendering.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. https://news.ycombinator.com or https://techcrunch.com/..."
                  value={jinaUrl}
                  onChange={e => setJinaUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runJinaReader()}
                  className="flex-1 bg-[#09090D] border border-[#27272A] rounded-lg px-3.5 py-2 text-xs text-white"
                />
                <button
                  onClick={runJinaReader}
                  disabled={loading || !jinaUrl.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />} Convert URL
                </button>
              </div>
            </div>

            {jinaOutput && (
              <div className="p-4 bg-[#14141E] border border-[#27272A] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">{jinaOutput.title || 'Markdown Result'}</span>
                  <button onClick={() => handleCopy(jinaOutput.markdown)} className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1">
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy Markdown
                  </button>
                </div>
                <div className="max-h-[500px] overflow-y-auto p-3 bg-[#09090D] border border-[#27272A] rounded-lg font-mono text-xs text-[#D4D4D8] whitespace-pre-wrap">
                  {jinaOutput.markdown}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: Exa AI Search */}
        {activeSubTab === 'exa' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#14141E] border border-[#27272A] space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" /> Exa AI Deep Semantic Search
              </h3>
              <p className="text-xs text-[#71717A]">
                Queries Exa API for high-density document matches, company info, and real-time news across the web.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. top B2B SaaS marketing tools launched in 2026"
                  value={exaQuery}
                  onChange={e => setExaQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runExaSearch()}
                  className="flex-1 bg-[#09090D] border border-[#27272A] rounded-lg px-3.5 py-2 text-xs text-white"
                />
                <button
                  onClick={runExaSearch}
                  disabled={loading || !exaQuery.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />} Search Exa
                </button>
              </div>
            </div>

            {exaResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exaResults.map((r, i) => (
                  <div key={i} className="p-3.5 bg-[#14141E] border border-[#27272A] rounded-xl space-y-2">
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-300 hover:underline flex items-center gap-1 truncate">
                      {r.title} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                    <p className="text-xs text-[#A1A1AA] line-clamp-3">{r.snippet}</p>
                    <div className="text-[10px] text-[#52525B] truncate">{r.url}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 4: yt-dlp Extractor */}
        {activeSubTab === 'youtube' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#14141E] border border-[#27272A] space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-400" /> Native yt-dlp Video & Transcript Engine
              </h3>
              <p className="text-xs text-[#71717A]">
                Uses local binary <code className="text-red-300">yt-dlp</code> to extract exact video details, views, metadata, and automated transcripts.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={ytUrl}
                  onChange={e => setYtUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runYoutubeExtractor()}
                  className="flex-1 bg-[#09090D] border border-[#27272A] rounded-lg px-3.5 py-2 text-xs text-white"
                />
                <button
                  onClick={runYoutubeExtractor}
                  disabled={loading || !ytUrl.trim()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Youtube className="w-3.5 h-3.5" />} Extract Metadata
                </button>
              </div>
            </div>

            {ytResult && (
              <div className="p-4 bg-[#14141E] border border-[#27272A] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{ytResult.title}</h4>
                    <p className="text-[11px] text-[#A1A1AA]">Channel: {ytResult.uploader} | Views: {ytResult.viewCount?.toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleCopy(ytResult.transcript)} className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1">
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy Transcript
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto p-3 bg-[#09090D] border border-[#27272A] rounded-lg font-mono text-xs text-[#D4D4D8] whitespace-pre-wrap">
                  {ytResult.transcript}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 5: GitHub gh Scanner */}
        {activeSubTab === 'github' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#14141E] border border-[#27272A] space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Github className="w-4 h-4 text-purple-400" /> Native GitHub gh CLI Scanner
              </h3>
              <p className="text-xs text-[#71717A]">
                Executes native <code className="text-purple-300">gh</code> CLI commands to inspect repositories, file trees, issues, and raw code.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="e.g. facebook/react"
                  value={githubRepo}
                  onChange={e => setGithubRepo(e.target.value)}
                  className="bg-[#09090D] border border-[#27272A] rounded-lg px-3.5 py-2 text-xs text-white"
                />
                <select
                  value={githubAction}
                  onChange={e => setGithubAction(e.target.value as any)}
                  className="bg-[#09090D] border border-[#27272A] rounded-lg px-3.5 py-2 text-xs text-white"
                >
                  <option value="summary">Repo Summary & README</option>
                  <option value="tree">Repository File Tree</option>
                  <option value="issues">Open Issues List</option>
                  <option value="file">Read Specific File</option>
                </select>
                {githubAction === 'file' && (
                  <input
                    type="text"
                    placeholder="package.json or src/index.ts"
                    value={githubFilePath}
                    onChange={e => setGithubFilePath(e.target.value)}
                    className="bg-[#09090D] border border-[#27272A] rounded-lg px-3.5 py-2 text-xs text-white"
                  />
                )}
              </div>
              <button
                onClick={runGithubScanner}
                disabled={loading || !githubRepo.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Github className="w-3.5 h-3.5" />} Run GitHub Scan
              </button>
            </div>

            {githubResult && (
              <div className="p-4 bg-[#14141E] border border-[#27272A] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">Scan Results for {githubResult.repo}</span>
                  <button onClick={() => handleCopy(JSON.stringify(githubResult, null, 2))} className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1">
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy JSON
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto p-3 bg-[#09090D] border border-[#27272A] rounded-lg font-mono text-xs text-[#D4D4D8] whitespace-pre-wrap">
                  {typeof githubResult.content === 'string' ? githubResult.content : JSON.stringify(githubResult, null, 2)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 6: Overpass POI Engine */}
        {activeSubTab === 'overpass' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#14141E] border border-[#27272A] space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" /> Local Business Search
              </h3>
              <p className="text-xs text-[#71717A]">
                Queries web search indices and public local directories for exact business listings, phone numbers, and addresses.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Amenity (e.g. restaurant, cafe, dentist, gym)"
                  value={overpassAmenity}
                  onChange={e => setOverpassAmenity(e.target.value)}
                  className="bg-[#09090D] border border-[#27272A] rounded-lg px-3.5 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="City (e.g. London, Paris, New York)"
                  value={overpassCity}
                  onChange={e => setOverpassCity(e.target.value)}
                  className="bg-[#09090D] border border-[#27272A] rounded-lg px-3.5 py-2 text-xs text-white"
                />
              </div>
              <button
                onClick={runOverpassPois}
                disabled={loading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />} Search Local Listings
              </button>
            </div>

            {overpassResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {overpassResults.map((poi, idx) => (
                  <div key={idx} className="p-3.5 bg-[#14141E] border border-[#27272A] rounded-xl space-y-1.5">
                    <p className="text-xs font-bold text-white">{poi.name}</p>
                    <p className="text-[11px] text-[#A1A1AA]">{poi.address || 'No street address listed'}</p>
                    {poi.phone && <p className="text-xs text-emerald-400 font-mono">📞 {poi.phone}</p>}
                    {poi.website && (
                      <a href={poi.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline truncate block">
                        🌐 {poi.website}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 7: Social Content Scraper */}
        {activeSubTab === 'social' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#14141E] border border-[#27272A] space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" /> Public Social Community Scraper
              </h3>
              <p className="text-xs text-[#71717A]">
                Scrapes public Reddit subreddits, post discussions, and Twitter/X topics zero-auth.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <select
                  value={socialPlatform}
                  onChange={e => setSocialPlatform(e.target.value as any)}
                  className="bg-[#09090D] border border-[#27272A] rounded-lg px-3.5 py-2 text-xs text-white"
                >
                  <option value="reddit">Reddit Subreddit / Thread</option>
                  <option value="twitter">Twitter / X Handle</option>
                </select>
                <input
                  type="text"
                  placeholder="Target (e.g. marketing or @openai)"
                  value={socialTarget}
                  onChange={e => setSocialTarget(e.target.value)}
                  className="bg-[#09090D] border border-[#27272A] rounded-lg px-3.5 py-2 text-xs text-white"
                />
              </div>
              <button
                onClick={runSocialScraper}
                disabled={loading || !socialTarget.trim()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />} Scrape Social Posts
              </button>
            </div>

            {socialResults.length > 0 && (
              <div className="space-y-3">
                {socialResults.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-[#14141E] border border-[#27272A] rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">{item.title || item.handle || 'Post Item'}</span>
                      {item.score !== undefined && <span className="text-[10px] text-emerald-400 font-mono">⬆ {item.score} ups</span>}
                    </div>
                    {item.text && <p className="text-xs text-[#A1A1AA] line-clamp-3">{item.text}</p>}
                    {item.rawMarkdown && <div className="max-h-48 overflow-y-auto font-mono text-xs text-[#D4D4D8]">{item.rawMarkdown}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
