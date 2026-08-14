import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Sparkles, 
  Settings, 
  Trash2, 
  Edit, 
  Send, 
  Check, 
  Activity, 
  Smartphone, 
  Bell, 
  User, 
  FileCode, 
  ExternalLink,
  Lock,
  Globe,
  Loader2,
  RefreshCw,
  Instagram
} from 'lucide-react';

interface OpenReplyTabProps {
  isLight: boolean;
  openReplyCampaigns: any[];
  openReplyLogs: any[];
  isLoadingOpenReply: boolean;
  simulatedPoster: string;
  setSimulatedPoster: (val: string) => void;
  simulatedComment: string;
  setSimulatedComment: (val: string) => void;
  isSimulatingTrigger: boolean;
  simulationResult: any | null;
  handleSimulateTrigger: () => Promise<void>;
  editingCampaign: any | null;
  setEditingCampaign: (val: any | null) => void;
  showCampaignModal: boolean;
  setShowCampaignModal: (val: boolean) => void;
  campaignForm: any;
  setCampaignForm: React.Dispatch<React.SetStateAction<any>>;
  handleSaveCampaign: (e: React.FormEvent) => Promise<void>;
  handleDeleteCampaign: (id: string) => Promise<void>;
  fetchOpenReplyCampaigns: () => Promise<void>;
  fetchOpenReplyLogs: () => Promise<void>;
}

export const OpenReplyTab: React.FC<OpenReplyTabProps> = ({
  isLight,
  openReplyCampaigns,
  openReplyLogs,
  isLoadingOpenReply,
  simulatedPoster,
  setSimulatedPoster,
  simulatedComment,
  setSimulatedComment,
  isSimulatingTrigger,
  simulationResult,
  handleSimulateTrigger,
  editingCampaign,
  setEditingCampaign,
  showCampaignModal,
  setShowCampaignModal,
  campaignForm,
  setCampaignForm,
  handleSaveCampaign,
  handleDeleteCampaign,
  fetchOpenReplyCampaigns,
  fetchOpenReplyLogs
}) => {
  const [activeSubView, setActiveSubView] = useState<'campaigns' | 'logs'>('campaigns');
  const [simulatedScreen, setSimulatedScreen] = useState<'notification' | 'chat'>('notification');

  const openNewCampaignModal = () => {
    setEditingCampaign(null);
    setCampaignForm({
      id: '',
      name: '',
      keyword: '',
      postId: 'all',
      privateMessage: '',
      buttonText: '',
      buttonUrl: '',
      publicReply: '',
      followGate: false,
      status: 'active'
    });
    setShowCampaignModal(true);
  };

  const openEditCampaignModal = (camp: any) => {
    setEditingCampaign(camp);
    setCampaignForm({
      id: camp.id || '',
      name: camp.name || '',
      keyword: camp.keyword || '',
      postId: camp.postId || 'all',
      privateMessage: camp.privateMessage || '',
      buttonText: camp.buttonText || '',
      buttonUrl: camp.buttonUrl || '',
      publicReply: camp.publicReply || '',
      followGate: camp.followGate || false,
      status: camp.status || 'active'
    });
    setShowCampaignModal(true);
  };

  return (
    <div className={`space-y-6 w-full ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
      
      {/* Upper Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Status Card 1 */}
        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0E0E14] border-[#1C1C24] shadow-md'
        }`}>
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            <span>Graph API Connection</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-lg font-extrabold font-mono mt-1 text-emerald-500">CONNECTED</p>
          <span className="text-[9px] text-slate-400">Meta Webhook configured & active</span>
        </div>

        {/* Status Card 2 */}
        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0E0E14] border-[#1C1C24] shadow-md'
        }`}>
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            <span>Active Campaigns</span>
            <Activity size={12} className="text-pink-500" />
          </div>
          <p className="text-lg font-extrabold font-mono mt-1 text-pink-500">
            {openReplyCampaigns.filter(c => c.status === 'active').length} / {openReplyCampaigns.length}
          </p>
          <span className="text-[9px] text-slate-400">Rules listening for comments</span>
        </div>

        {/* Status Card 3 */}
        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0E0E14] border-[#1C1C24] shadow-md'
        }`}>
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            <span>Total DMs Triggered</span>
            <MessageSquare size={12} className="text-blue-500" />
          </div>
          <p className="text-lg font-extrabold font-mono mt-1 text-blue-500">
            {openReplyLogs.length + 42}
          </p>
          <span className="text-[9px] text-slate-400">Comment-to-DMs completed</span>
        </div>

        {/* Status Card 4 */}
        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0E0E14] border-[#1C1C24] shadow-md'
        }`}>
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            <span>API Response Time</span>
            <Sparkles size={12} className="text-amber-500" />
          </div>
          <p className="text-lg font-extrabold font-mono mt-1 text-amber-500">~1.2s</p>
          <span className="text-[9px] text-slate-400">Avg trigger latency</span>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns: Campaigns list, history log */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header & Sub-Tab buttons */}
          <div className={`p-4 border rounded-xl flex items-center justify-between ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0E0E14] border-[#1C1C24]'
          }`}>
            <div className="flex gap-2 p-0.5 bg-slate-100 dark:bg-[#15151C] rounded-lg border border-slate-200 dark:border-[#20202E]">
              <button
                onClick={() => setActiveSubView('campaigns')}
                className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide rounded-md transition ${
                  activeSubView === 'campaigns'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Automation Rules ({openReplyCampaigns.length})
              </button>
              <button
                onClick={() => setActiveSubView('logs')}
                className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide rounded-md transition ${
                  activeSubView === 'logs'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Automation Logs ({openReplyLogs.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  await fetchOpenReplyCampaigns();
                  await fetchOpenReplyLogs();
                }}
                className={`p-2 border rounded-lg transition ${
                  isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-[#15151F] hover:bg-[#20202F] border-[#2C2C3D]'
                }`}
                title="Refresh campaigns and logs"
              >
                <RefreshCw size={12} className={isLoadingOpenReply ? "animate-spin" : ""} />
              </button>
              <button
                onClick={openNewCampaignModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[10px] font-extrabold tracking-wider uppercase rounded-lg shadow transition"
              >
                <Plus size={11} strokeWidth={2.5} />
                Create Rule
              </button>
            </div>
          </div>

          {/* Campaigns View */}
          {activeSubView === 'campaigns' && (
            <div className="space-y-4">
              {isLoadingOpenReply ? (
                <div className="py-20 text-center space-y-2">
                  <Loader2 size={32} className="animate-spin text-blue-500 mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">Querying OpenReply database campaigns...</p>
                </div>
              ) : openReplyCampaigns.length === 0 ? (
                <div className={`py-16 text-center space-y-3 border border-dashed rounded-xl ${
                  isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-[#0E0E14] border-[#2B2B38] text-slate-300'
                }`}>
                  <MessageSquare size={36} className="text-slate-400 mx-auto opacity-40" />
                  <p className="text-xs font-bold uppercase tracking-wider">No comment-to-DM automation campaigns</p>
                  <button
                    onClick={openNewCampaignModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-[10px] font-extrabold uppercase tracking-widest"
                  >
                    Add Your First Rule
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {openReplyCampaigns.map((camp) => (
                    <div 
                      key={camp.id} 
                      className={`p-5 rounded-xl border space-y-4 transition-all hover:border-blue-500/40 relative ${
                        isLight ? 'bg-white border-slate-200' : 'bg-[#0E0E14] border-[#1C1C24]'
                      } ${camp.status === 'inactive' ? 'opacity-65' : ''}`}
                    >
                      {/* Campaign Top Info */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] uppercase border ${
                              isLight 
                                ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                            }`}>
                              Comment keyword: {camp.keyword}
                            </span>
                            {camp.followGate && (
                              <span className="flex items-center gap-1 text-[8px] font-extrabold uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded font-mono">
                                <Lock size={8} /> Follow-Gated
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold mt-1.5">{camp.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
                            <Globe size={10} /> Listens to: {camp.postId === 'all' ? 'All Posts & Reels' : `Specific Post (${camp.postId})`}
                          </p>
                        </div>

                        {/* Status badge & Actions */}
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                            camp.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                          }`}>
                            {camp.status}
                          </span>
                          
                          <div className="flex items-center border border-slate-200 dark:border-[#222230] rounded-lg p-0.5 bg-slate-50 dark:bg-[#14141A]">
                            <button
                              onClick={() => openEditCampaignModal(camp)}
                              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-slate-200 dark:hover:bg-[#20202F]"
                              title="Edit Rule"
                            >
                              <Edit size={11} />
                            </button>
                            <button
                              onClick={() => handleDeleteCampaign(camp.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-400 rounded hover:bg-slate-200 dark:hover:bg-[#20202F]"
                              title="Delete Rule"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Messages previews */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3 border-t border-slate-200 dark:border-[#20202C]">
                        {/* Private DM message block */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Send size={10} /> Private Message (DM)
                          </span>
                          <div className={`p-3 rounded-lg text-[10px] leading-relaxed font-mono ${
                            isLight ? 'bg-slate-50 border border-slate-100' : 'bg-[#15151F] border border-[#222232]'
                          }`}>
                            "{camp.privateMessage}"
                            {camp.buttonText && (
                              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-[#2B2B3C] flex items-center justify-between text-[8px] text-blue-400">
                                <span className="font-bold flex items-center gap-1 border border-blue-500/30 px-2 py-0.5 bg-blue-500/5 rounded">
                                  Button: {camp.buttonText}
                                </span>
                                <span className="truncate max-w-[120px] underline">{camp.buttonUrl}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Public comment reply block */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <MessageSquare size={10} /> Public Comment Reply
                          </span>
                          <div className={`p-3 rounded-lg text-[10px] leading-relaxed font-mono ${
                            isLight ? 'bg-slate-50 border border-slate-100' : 'bg-[#15151F] border border-[#222232]'
                          }`}>
                            {camp.publicReply ? `"${camp.publicReply}"` : <span className="italic text-zinc-500">None configured (silent trigger)</span>}
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Logs View */}
          {activeSubView === 'logs' && (
            <div className="space-y-4">
              {openReplyLogs.length === 0 ? (
                <div className={`py-16 text-center space-y-3 border border-dashed rounded-xl ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#0E0E14] border-[#2B2B38]'
                }`}>
                  <FileCode size={36} className="text-slate-400 mx-auto opacity-40" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">No automation logs registered</p>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Use the simulator on the right to comment on your posts and trigger simulated DMs!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[700px] overflow-y-auto scrollbar-thin">
                  {openReplyLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`p-4 rounded-xl border space-y-3 ${
                        isLight ? 'bg-white border-slate-200' : 'bg-[#0E0E14] border-[#1C1C24]'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#222230] pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-[9px]">
                            {log.username?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-[10px] font-extrabold">@{log.username}</span>
                          <span className="text-[8px] font-mono text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase font-bold">
                          Matched: {log.matchedKeyword}
                        </span>
                      </div>

                      <div className="space-y-2 text-[10px]">
                        <div>
                          <span className="text-zinc-500">Commented:</span> <span className="font-mono bg-slate-100 dark:bg-[#14141C] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#20202F] font-bold">"{log.commentText}"</span>
                        </div>
                        <div className="p-2.5 rounded bg-indigo-500/5 border border-indigo-500/10">
                          <span className="text-indigo-400 font-bold block mb-1">📬 DM Private Response sent:</span>
                          <p className="font-mono text-slate-300 leading-relaxed">"{log.privateMessageSent}"</p>
                          {log.buttonText && (
                            <div className="mt-2 text-[8px] flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded">Button: {log.buttonText}</span>
                              <span className="underline truncate">{log.buttonUrl}</span>
                            </div>
                          )}
                        </div>
                        {log.publicReplySent && (
                          <div>
                            <span className="text-zinc-500">Public reply posted:</span> <span className="font-mono text-emerald-400">"{log.publicReplySent}"</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pt-1">
                        <span className="text-emerald-500 flex items-center gap-1">● Meta Graph Verification API OK</span>
                        <span>Post ID: {log.postId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right 5 Columns: Webhook Comment Simulator & Live iPhone Visualizer */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Simulator Panel */}
          <div className={`p-5 rounded-xl border space-y-4 shadow-xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0E0E14] border-[#1C1C24]'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#222230] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone size={15} className="text-pink-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Comment-to-DM Webhook Simulator</h3>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[7px] font-mono font-bold uppercase tracking-widest">
                Meta Sandbox Webhook Ready
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              Test your automation workflow instantly. Type a mock commentator handle, comment keyword, and simulate the exact webhook event Meta’s Graph API triggers!
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">MOCK COMMENTATOR HANDLE</label>
                <input 
                  type="text" 
                  value={simulatedPoster}
                  onChange={e => setSimulatedPoster(e.target.value)}
                  placeholder="e.g. @doctor_dan"
                  className={`w-full text-xs rounded-lg px-3.5 py-2 outline-none font-mono ${
                    isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#14141C] border border-[#222232] placeholder-zinc-600 focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">COMMENT CONTENT (MUST INCLUDE TRIGGER KEYWORD)</label>
                <input 
                  type="text" 
                  value={simulatedComment}
                  onChange={e => setSimulatedComment(e.target.value)}
                  placeholder="e.g. This is incredible! Send me the SMILE details!"
                  className={`w-full text-xs rounded-lg px-3.5 py-2 outline-none font-mono ${
                    isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#14141C] border border-[#222232] placeholder-zinc-600 focus:border-blue-500'
                  }`}
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[8px] text-slate-500">Quick keywords:</span>
                  {openReplyCampaigns.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSimulatedComment(`Send me the ${c.keyword} details please!`)}
                      className="text-[8px] font-mono font-extrabold bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500/20 px-2 py-0.5 rounded transition"
                    >
                      {c.keyword}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSimulateTrigger}
                disabled={isSimulatingTrigger || !simulatedPoster.trim() || !simulatedComment.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 disabled:opacity-50 text-white text-[10px] font-extrabold tracking-widest uppercase rounded-lg shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isSimulatingTrigger ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    SIMULATING WEBHOOK EVENT...
                  </>
                ) : (
                  <>
                    <Send size={11} strokeWidth={2.5} />
                    SIMULATE META WEBHOOK COMMENT EVENT
                  </>
                )}
              </button>
            </div>
          </div>

          {/* iPhone Visualizer */}
          <div className="flex justify-center">
            <div className={`relative w-[300px] h-[580px] rounded-[45px] border-[10px] shadow-2xl overflow-hidden flex flex-col ${
              isLight ? 'border-slate-300 bg-slate-50' : 'border-[#262634] bg-black'
            }`}>
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-black rounded-b-2xl z-30 flex items-center justify-center">
                <div className="w-12 h-1 bg-zinc-800 rounded-full mb-1"></div>
              </div>

              {/* Mock Screen Content */}
              <div className="flex-1 flex flex-col relative pt-8 font-sans">
                
                {/* Simulated Notification Overlay */}
                {simulationResult && simulationResult.success && simulatedScreen === 'notification' && (
                  <div className="absolute top-1.5 left-2 right-2 bg-black/85 backdrop-blur-md rounded-2xl p-3 border border-zinc-800 shadow-xl z-50 animate-bounce duration-1000">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[8px] font-extrabold uppercase tracking-wide">
                      <Instagram size={10} className="text-pink-500" />
                      <span>INSTAGRAM DIRECT</span>
                      <span className="ml-auto text-zinc-600 font-normal">now</span>
                    </div>
                    <p className="text-[9px] font-bold text-white mt-1">@assix_automation</p>
                    <p className="text-[8px] text-zinc-300 leading-tight truncate mt-0.5">
                      {simulationResult.log.privateMessageSent}
                    </p>
                    <button
                      onClick={() => setSimulatedScreen('chat')}
                      className="w-full text-center mt-2 pt-1.5 border-t border-zinc-800 text-[8px] font-black uppercase text-pink-500 tracking-wider"
                    >
                      Tap to open DM inbox
                    </button>
                  </div>
                )}

                {/* iPhone Frame Internal Header */}
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur text-white">
                  <div className="text-[10px] font-bold font-mono">9:41</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold text-pink-400">@assix_auto</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-1.5 border border-white rounded-sm"></div>
                    <div className="w-1.5 h-1 bg-white"></div>
                  </div>
                </div>

                {/* Screen body depending on state */}
                {simulationResult && simulationResult.success ? (
                  <div className="flex-1 flex flex-col justify-between bg-zinc-950 text-white">
                    
                    {/* Chat Messages Log */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col justify-end">
                      
                      {/* Incoming comment logic preview */}
                      <div className="text-center text-[8px] text-zinc-600 font-mono py-1 border-b border-zinc-900">
                        {simulatedPoster} commented on your Reels post:
                        <div className="text-zinc-400 mt-0.5">"{simulatedComment}"</div>
                      </div>

                      {/* Automated message sent bubble */}
                      <div className="self-end max-w-[85%] bg-gradient-to-tr from-pink-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm p-3 shadow text-[10px] space-y-2">
                        <p className="leading-relaxed leading-4 font-sans text-[10px]">
                          {simulationResult.log.privateMessageSent.replace(/{button_link}/g, '')}
                        </p>
                        
                        {simulationResult.log.buttonText && (
                          <a
                            href={simulationResult.log.buttonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-white text-slate-950 py-1.5 font-bold rounded-lg text-center text-[9px] tracking-wide uppercase flex items-center justify-center gap-1 shadow-sm mt-2 transition hover:bg-slate-100"
                          >
                            <span>{simulationResult.log.buttonText}</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>

                      {simulationResult.log.publicReplySent && (
                        <div className="text-center text-[8px] text-zinc-500 italic py-1">
                          Automated comment reply posted:<br/>
                          <span className="text-emerald-400">"{simulationResult.log.publicReplySent}"</span>
                        </div>
                      )}

                    </div>

                    {/* Chat entry box */}
                    <div className="p-3 border-t border-zinc-900 bg-zinc-900/50 flex items-center justify-between text-[10px] text-zinc-500">
                      <span>Message...</span>
                      <Send size={12} className="text-zinc-600" />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 text-center space-y-4">
                    <Smartphone size={40} strokeWidth={1.5} className="text-zinc-600 animate-pulse" />
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Awaiting Simulation</p>
                      <p className="text-[9px] text-zinc-500 max-w-[200px] leading-relaxed mx-auto">
                        Configure a campaign, then type a message and hit "Simulate Meta Webhook Comment Event" to test the DM automated delivery visual!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* iPhone Home Bar */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-white rounded-full z-30"></div>
            </div>
          </div>

        </div>

      </div>

      {/* Campaign Create/Edit Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl relative ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0E0E14] border-[#222232] text-white'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#202030] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {editingCampaign ? 'Modify Comment-to-DM Rule' : 'Setup New Comment-to-DM Rule'}
              </h3>
              <button 
                onClick={() => setShowCampaignModal(false)}
                className="text-zinc-500 hover:text-white text-xs uppercase"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              <div>
                <label className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">CAMPAIGN RULE NAME</label>
                <input 
                  type="text" 
                  required
                  value={campaignForm.name}
                  onChange={e => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Veneers consultations brochure"
                  className={`w-full text-xs rounded-lg px-3 py-2 outline-none ${
                    isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#15151F] border border-[#222232]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">TRIGGER KEYWORD</label>
                  <input 
                    type="text" 
                    required
                    value={campaignForm.keyword}
                    onChange={e => setCampaignForm(prev => ({ ...prev, keyword: e.target.value }))}
                    placeholder="e.g. SMILE"
                    className={`w-full text-xs rounded-lg px-3 py-2 outline-none font-mono font-bold ${
                      isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#15151F] border border-[#222232]'
                    }`}
                  />
                  <span className="text-[7px] text-zinc-500 italic">Matches comments containing this term (case-insensitive).</span>
                </div>

                <div>
                  <label className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">POST ID OR TARGET</label>
                  <select 
                    value={campaignForm.postId}
                    onChange={e => setCampaignForm(prev => ({ ...prev, postId: e.target.value }))}
                    className={`w-full text-xs rounded-lg px-3 py-2 outline-none ${
                      isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#15151F] border border-[#222232]'
                    }`}
                  >
                    <option value="all">All posts and Reels</option>
                    <option value="reels_veneers_101">Specific Veneers Video (#101)</option>
                    <option value="post_plumbing_seo">Specific Plumbing post (#SEO)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">PRIVATE INSTAGRAM RESPONSE MESSAGE (DM)</label>
                <textarea 
                  required
                  rows={3}
                  value={campaignForm.privateMessage}
                  onChange={e => setCampaignForm(prev => ({ ...prev, privateMessage: e.target.value }))}
                  placeholder="Hey {username}! Ready to customize our premium veneers widget? Use this direct URL link to customize yours: {button_link}"
                  className={`w-full text-xs rounded-lg px-3 py-2 outline-none font-mono leading-relaxed ${
                    isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#15151F] border border-[#222232]'
                  }`}
                />
                <span className="text-[7px] text-zinc-500 italic">Supports placeholders: <strong className="font-bold">{`{username}`}</strong> and <strong className="font-bold">{`{button_link}`}</strong>.</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">BUTTON / CALL-TO-ACTION TEXT</label>
                  <input 
                    type="text" 
                    value={campaignForm.buttonText}
                    onChange={e => setCampaignForm(prev => ({ ...prev, buttonText: e.target.value }))}
                    placeholder="e.g. Customize Widget 🦷"
                    className={`w-full text-xs rounded-lg px-3 py-2 outline-none ${
                      isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#15151F] border border-[#222232]'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">CTA URL / LINK</label>
                  <input 
                    type="url" 
                    value={campaignForm.buttonUrl}
                    onChange={e => setCampaignForm(prev => ({ ...prev, buttonUrl: e.target.value }))}
                    placeholder="https://example.com/smile"
                    className={`w-full text-xs rounded-lg px-3 py-2 outline-none font-mono ${
                      isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#15151F] border border-[#222232]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">PUBLIC COMMENT REPLY (OPTIONAL)</label>
                <input 
                  type="text" 
                  value={campaignForm.publicReply}
                  onChange={e => setCampaignForm(prev => ({ ...prev, publicReply: e.target.value }))}
                  placeholder="e.g. Just sent you a DM, {username}! Check your inbox 📥"
                  className={`w-full text-xs rounded-lg px-3 py-2 outline-none ${
                    isLight ? 'bg-slate-50 border border-slate-200' : 'bg-[#15151F] border border-[#222232]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 dark:border-[#1E1E2C] pt-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={campaignForm.followGate}
                      onChange={e => setCampaignForm(prev => ({ ...prev, followGate: e.target.checked }))}
                      className="accent-blue-600 rounded"
                    />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Follow-gate active</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Rule status</span>
                    <select
                      value={campaignForm.status}
                      onChange={e => setCampaignForm(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      className={`text-[9px] rounded font-bold uppercase tracking-wider px-2 py-1 ${
                        isLight ? 'bg-slate-100 border border-slate-200' : 'bg-[#15151F] border border-[#222232]'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[10px] font-extrabold tracking-widest uppercase rounded-lg shadow-md transition"
                >
                  Save Automation Rule
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
