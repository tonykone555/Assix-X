import React, { useState, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, Video, CheckCircle, Clock, Copy, Check, 
  ExternalLink, Search, RefreshCw, Trash2, Mail, User, Eye, Play, Sparkles, AlertCircle, X, Plus
} from 'lucide-react';

interface ClientIntakeDashboardTabProps {
  serverUrl: string;
  showNotification: (msg: string) => void;
  theme?: string;
}

export default function ClientIntakeDashboardTab({
  serverUrl,
  showNotification,
  theme = 'dark'
}: ClientIntakeDashboardTabProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending_video' | 'video_sent'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Submission Lightbox / Video Modal
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // Custom Intake Link Generator State
  const [linkLeadName, setLinkLeadName] = useState<string>('');
  const [linkLeadEmail, setLinkLeadEmail] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : serverUrl;
  const publicUploadUrl = `${baseUrl}/upload`;

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/api/asset-submissions`);
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Failed to fetch asset submissions:', err);
      showNotification('Failed to load intake submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (subId: string, updates: { status?: string; videoUrl?: string; notes?: string }) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${serverUrl}/api/asset-submissions/${subId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.status === 'success') {
        showNotification('Submission status updated successfully');
        fetchSubmissions();
        if (selectedSub && selectedSub.id === subId) {
          setSelectedSub(prev => prev ? { ...prev, ...updates } : null);
        }
      } else {
        showNotification(`Update failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      showNotification(`Error: ${err.message || 'Failed to update'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSubmission = async (subId: string) => {
    if (!confirm('Are you sure you want to delete this intake submission?')) return;
    try {
      const res = await fetch(`${serverUrl}/api/asset-submissions/${subId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.status === 'success') {
        showNotification('Submission deleted');
        setSubmissions(prev => prev.filter(s => s.id !== subId));
        if (selectedSub?.id === subId) setSelectedSub(null);
      }
    } catch (err: any) {
      showNotification(`Error: ${err.message || 'Failed to delete'}`);
    }
  };

  const buildPersonalizedLink = () => {
    const params = new URLSearchParams();
    if (linkLeadName.trim()) params.set('name', linkLeadName.trim());
    if (linkLeadEmail.trim()) params.set('email', linkLeadEmail.trim());
    const str = params.toString();
    return str ? `${publicUploadUrl}?${str}` : publicUploadUrl;
  };

  const copyLinkToClipboard = (urlToCopy: string) => {
    navigator.clipboard.writeText(urlToCopy);
    setCopiedLink(true);
    showNotification('Personalized intake link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Filter logic
  const filteredSubmissions = submissions.filter(s => {
    if (filterStatus === 'pending_video' && s.status !== 'pending_video') return false;
    if (filterStatus === 'video_sent' && s.status !== 'video_sent') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name?.toLowerCase().includes(q);
      const matchEmail = s.email?.toLowerCase().includes(q);
      const matchNotes = s.notes?.toLowerCase().includes(q);
      return matchName || matchEmail || matchNotes;
    }
    return true;
  });

  const pendingCount = submissions.filter(s => s.status === 'pending_video').length;
  const sentCount = submissions.filter(s => s.status === 'video_sent').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Upload size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Client Image Intake Portal & Submissions
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold animate-pulse">
                    {pendingCount} Pending Video{pendingCount > 1 ? 's' : ''}
                  </span>
                )}
              </h1>
              <p className="text-xs text-zinc-400">
                View leads who submitted screenshots/specs and copy personalized upload links for cold emails.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSubmissions}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            title="Refresh submissions"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <a
            href="/upload"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
          >
            <ExternalLink size={14} /> Open Public Upload Portal
          </a>
        </div>
      </div>

      {/* Intake Link Generator Card */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Sparkles size={14} className="text-blue-400" />
            <span>Generate Personalized Email Link For Outreach</span>
          </div>
          <span className="text-[11px] text-zinc-400">Add to your email templates as <code>[Upload Specs Here]</code></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Lead Name (e.g. John Smith)"
            value={linkLeadName}
            onChange={(e) => setLinkLeadName(e.target.value)}
            className="px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Lead Email (optional)"
            value={linkLeadEmail}
            onChange={(e) => setLinkLeadEmail(e.target.value)}
            className="px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={buildPersonalizedLink()}
              className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 font-mono text-[11px] select-all truncate"
            />
            <button
              onClick={() => copyLinkToClipboard(buildPersonalizedLink())}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition shrink-0 flex items-center gap-1 cursor-pointer"
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>Copy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              filterStatus === 'all' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending_video')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'pending_video' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock size={13} />
            <span>Pending Video ({pendingCount})</span>
          </button>
          <button
            onClick={() => setFilterStatus('video_sent')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'video_sent' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckCircle size={13} />
            <span>Video Sent ({sentCount})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Submissions Grid */}
      {loading ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Loading client intake submissions...</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="p-12 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center space-y-3">
          <ImageIcon size={36} className="mx-auto text-zinc-600" />
          <h3 className="text-sm font-bold text-zinc-300">No Intake Submissions Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {searchQuery ? 'No submissions match your search query.' : 'Include the public intake link in your cold email outreach campaigns to receive image specs directly!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubmissions.map((sub) => {
            const isPending = sub.status === 'pending_video';
            const imgCount = Array.isArray(sub.images) ? sub.images.length : 0;
            const firstImg = imgCount > 0 ? (sub.images[0].url || sub.images[0]) : null;

            return (
              <div
                key={sub.id}
                className={`rounded-2xl border transition hover:border-zinc-700 bg-zinc-900/80 p-4 space-y-3 relative group ${
                  isPending ? 'border-amber-500/30 shadow-lg shadow-amber-500/5' : 'border-zinc-800'
                }`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-white truncate max-w-[180px]">
                      {sub.name || 'Anonymous Client'}
                    </h3>
                    <p className="text-[11px] text-zinc-400 flex items-center gap-1 truncate">
                      <Mail size={11} className="text-zinc-500 shrink-0" />
                      <span>{sub.email || 'No email provided'}</span>
                    </p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 flex items-center gap-1 ${
                    isPending 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {isPending ? <Clock size={10} /> : <CheckCircle size={10} />}
                    {isPending ? 'Pending Video' : 'Video Sent'}
                  </span>
                </div>

                {/* Thumbnail Preview Box */}
                <div
                  onClick={() => {
                    setSelectedSub(sub);
                    setVideoUrlInput(sub.videoUrl || '');
                    setActiveImageIdx(0);
                  }}
                  className="relative aspect-video rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden cursor-pointer group/img"
                >
                  {firstImg ? (
                    <img src={firstImg} alt={sub.name} className="w-full h-full object-cover group-hover/img:scale-105 transition" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <ImageIcon size={24} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center gap-1 text-xs font-bold text-white">
                    <Eye size={16} /> View {imgCount} Image{imgCount > 1 ? 's' : ''}
                  </div>

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-semibold text-zinc-300">
                    {imgCount} File{imgCount > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Notes if provided */}
                {sub.notes && (
                  <p className="text-[11px] text-zinc-400 bg-zinc-950 p-2 rounded-lg border border-zinc-800/80 italic truncate" title={sub.notes}>
                    "{sub.notes}"
                  </p>
                )}

                {/* Timestamp & Actions */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/80">
                  <span>{new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedSub(sub);
                        setVideoUrlInput(sub.videoUrl || '');
                        setActiveImageIdx(0);
                      }}
                      className="text-blue-400 hover:text-blue-300 font-bold transition cursor-pointer"
                    >
                      Inspect Specs &rarr;
                    </button>
                    <button
                      onClick={() => handleDeleteSubmission(sub.id)}
                      className="text-zinc-600 hover:text-red-400 transition cursor-pointer p-1"
                      title="Delete submission"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INSPECT & VIDEO URL MODAL LIGHTBOX */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedSub.name} &bull; Image Specs</h3>
                  <p className="text-[11px] text-zinc-400">{selectedSub.email || 'No email'} &bull; Submitted {new Date(selectedSub.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Image Lightbox Carousel */}
              {Array.isArray(selectedSub.images) && selectedSub.images.length > 0 && (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl bg-black border border-zinc-800 overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedSub.images[activeImageIdx]?.url || selectedSub.images[activeImageIdx]}
                      alt="Uploaded spec"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Image Thumbnails Strip */}
                  {selectedSub.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedSub.images.map((img: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-16 h-12 rounded-lg border overflow-hidden shrink-0 transition cursor-pointer ${
                            activeImageIdx === idx ? 'border-blue-500 ring-1 ring-blue-500' : 'border-zinc-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img.url || img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes block */}
              {selectedSub.notes && (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <span className="font-bold text-zinc-400 block">Specific Notes from Client:</span>
                  <p className="text-zinc-200">{selectedSub.notes}</p>
                </div>
              )}

              {/* Video Walkthrough Fulfillment Box */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Video size={14} className="text-blue-400" />
                    Attach Walkthrough Video URL
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedSub.status === 'video_sent' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {selectedSub.status === 'video_sent' ? 'Video Delivered' : 'Pending Fulfillment'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="e.g. https://loom.com/share/..."
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleUpdateStatus(selectedSub.id, { videoUrl: videoUrlInput, status: 'video_sent' })}
                    disabled={isUpdating || !videoUrlInput.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition disabled:opacity-50 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <CheckCircle size={14} />
                    Save & Mark Video Sent
                  </button>
                </div>

                {selectedSub.videoUrl && (
                  <div className="pt-1 flex items-center gap-2 text-xs text-emerald-400">
                    <Check size={14} />
                    <span>Video link recorded:</span>
                    <a href={selectedSub.videoUrl} target="_blank" rel="noopener noreferrer" className="underline truncate max-w-xs font-mono text-[11px]">
                      {selectedSub.videoUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <button
                onClick={() => handleDeleteSubmission(selectedSub.id)}
                className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={13} /> Delete Submission
              </button>

              <button
                onClick={() => setSelectedSub(null)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
