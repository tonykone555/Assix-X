import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  QrCode, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  Loader2, 
  Link2, 
  RefreshCw,
  XCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface WhatsAppBulkSendProps {
  selectedLeads: any[];
  serverUrl?: string;
}

export const WhatsAppBulkSend: React.FC<WhatsAppBulkSendProps> = ({ 
  selectedLeads,
  serverUrl = window.location.origin
}) => {
  const [customUrl, setCustomUrl] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [progress, setProgress] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeWaitMsg, setActiveWaitMsg] = useState('');

  // Determine which URL to use (custom input or proxied)
  const getServiceUrl = () => {
    if (customUrl.trim()) {
      return customUrl.trim().replace(/\/$/, '');
    }
    // Default to the proxied server endpoints
    return `${serverUrl}/api/whatsapp`;
  };

  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const url = getServiceUrl();
      // If we are using the proxy, status is at /api/whatsapp/status, otherwise at /api/status
      const endpoint = customUrl.trim() ? `${url}/api/status` : `${url}/status`;
      
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStatus(data);
    } catch (err: any) {
      console.error('Failed to fetch WhatsApp status:', err);
      setStatus({ ready: false, qrCode: null, error: err.message || 'Offline' });
    } finally {
      setLoadingStatus(false);
    }
  };

  // Poll status every 5 seconds when QR code needs to be scanned
  useEffect(() => {
    fetchStatus();
    
    const interval = setInterval(() => {
      if (!status?.ready && !sending) {
        fetchStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [customUrl, status?.ready, sending]);

  const sendToAll = async () => {
    if (!message.trim()) return;
    setSending(true);
    setProgress([]);
    setLogs([]);
    setActiveWaitMsg('');

    const phoneNumbers = selectedLeads
      .map(l => l.phone || l.phoneNumber)
      .filter(Boolean);

    if (phoneNumbers.length === 0) {
      setLogs(['Error: No selected leads have phone numbers.']);
      setSending(false);
      return;
    }

    const serviceUrl = getServiceUrl();
    const endpoint = customUrl.trim() ? `${serviceUrl}/api/send-bulk` : `${serviceUrl}/send-bulk`;

    setLogs([`Initiating bulk campaign to ${phoneNumbers.length} recipients...`]);

    const url = `${endpoint}?message=${encodeURIComponent(message)}&phoneNumbers=${encodeURIComponent(JSON.stringify(phoneNumbers))}`;
    
    try {
      const es = new EventSource(url);

      es.addEventListener('sent', (e: any) => {
        try {
          const data = JSON.parse(e.data);
          setProgress(p => [...p, data]);
          
          const statusText = data.success 
            ? `✓ Message sent successfully to ${data.number}`
            : `✕ Failed to send to ${data.number}: ${data.error || 'Unknown error'}`;
          
          setLogs(prev => [...prev, `[${data.index}/${data.total}] ${statusText}`]);
          setActiveWaitMsg('');
        } catch (err) {
          console.error(err);
        }
      });

      es.addEventListener('waiting', (e: any) => {
        try {
          const data = JSON.parse(e.data);
          setActiveWaitMsg(data.message);
          setLogs(prev => [...prev, `Pacing: ${data.message}`]);
        } catch (err) {
          console.error(err);
        }
      });

      es.addEventListener('done', (e: any) => {
        setLogs(prev => [...prev, '✓ Bulk campaign complete!']);
        setSending(false);
        setActiveWaitMsg('');
        es.close();
        fetchStatus();
      });

      es.onerror = (err) => {
        console.error('SSE Error:', err);
        setLogs(prev => [...prev, '✕ Connection lost or service encountered an error. Please verify client connection.']);
        setSending(false);
        setActiveWaitMsg('');
        es.close();
      };
    } catch (err: any) {
      setLogs(prev => [...prev, `✕ Execution failed: ${err.message}`]);
      setSending(false);
    }
  };

  const successCount = progress.filter(p => p.success).length;
  const failureCount = progress.filter(p => p.success === false).length;

  return (
    <div className="bg-[#0F0F12] border border-[#1A1A1E] rounded-lg p-5 w-full max-w-4xl mx-auto mt-4 font-sans text-zinc-100 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#222] pb-4 mb-4">
        <div>
          <h3 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-2">
            <MessageSquare size={14} className="text-[#25D366]" /> WhatsApp Bulk Dispatch Engine
          </h3>
          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">
            Real-time deliberate pacing, randomized delays, and status feedback
          </p>
        </div>

        {/* Custom Connection Input */}
        <div className="flex items-center gap-2 w-full md:w-auto bg-[#0A0A0C] border border-[#222] p-1.5 rounded-md">
          <Link2 size={11} className="text-zinc-600 shrink-0 ml-1" />
          <input 
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Built-in Service (Default)"
            className="bg-transparent text-[10px] font-mono outline-none text-zinc-300 w-full md:w-48 placeholder-zinc-700"
          />
          <button 
            onClick={fetchStatus}
            disabled={loadingStatus}
            className="p-1 hover:bg-[#222] rounded text-zinc-400 hover:text-white transition cursor-pointer"
            title="Refresh status"
          >
            <RefreshCw size={10} className={loadingStatus ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Connection status card (Col 4) */}
        <div className="md:col-span-4 bg-[#0A0A0C] border border-[#222] rounded-md p-4 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">CLIENT STATUS</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                status?.ready 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {status?.ready ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {/* If ready, display connected screen */}
            {status?.ready ? (
              <div className="space-y-3 py-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle size={14} /> Local WhatsApp Ready
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Your local WhatsApp instance is active and authenticated. Ready to dispatch personalized bulks safely with humanized spacing.
                </p>
              </div>
            ) : status?.qrCode ? (
              /* If not ready and QR is available, display QR scanner */
              <div className="flex flex-col items-center justify-center space-y-3 py-1">
                <p className="text-[10px] text-zinc-400 text-center leading-tight">
                  Scan this QR code using Link Device in your phone's WhatsApp:
                </p>
                <div className="bg-white p-2 rounded-md shadow-lg border border-zinc-200 shrink-0">
                  <img src={status.qrCode} alt="WhatsApp QR Code" className="w-28 h-28" />
                </div>
                <div className="text-[8px] text-zinc-500 text-center animate-pulse flex items-center gap-1 justify-center">
                  <Loader2 size={8} className="animate-spin" /> Waiting for scan...
                </div>
              </div>
            ) : (
              /* Connecting/starting state */
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Loader2 size={16} className="text-[#25D366] animate-spin mb-2" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">CONNECTING SERVICE...</span>
                <span className="text-[8px] text-zinc-600 uppercase mt-1 leading-normal">
                  Initializing WhatsApp headless browser in sandbox. Please wait...
                </span>
                {status?.error && (
                  <span className="text-[8px] text-amber-500 font-mono mt-2 block break-all">
                    {status.error}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-[#222] pt-3 mt-3">
            <span className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase block mb-1">CAMPAIGN TARGETS</span>
            <div className="text-sm font-black text-white">
              {selectedLeads.length} <span className="text-zinc-500 text-[10px] font-bold">RECIPIENTS SELECTED</span>
            </div>
          </div>
        </div>

        {/* Message composer & Campaign controller (Col 8) */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-1">
                MESSAGE BODY <HelpCircle size={10} className="text-zinc-600 hover:text-zinc-400 cursor-help" title="Compose standard message. All numbers receive this message with human-like delays." />
              </label>
              <span className="text-[9px] text-zinc-600 font-mono font-bold">
                {message.length} chars
              </span>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the personalized message to dispatch. Tip: Be polite, concise, and clear..."
              rows={4}
              disabled={sending}
              className="w-full bg-[#0A0A0C] border border-[#222] text-[#F5F5F5] rounded-lg p-3 text-xs outline-none focus:border-[#25D366] transition placeholder-[#52525B] font-sans resize-none"
            />
          </div>

          {/* Progress visualizer */}
          {sending && (
            <div className="bg-[#0A0A0C] border border-[#222] rounded p-3 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Loader2 size={10} className="animate-spin text-[#25D366]" /> Dispatches in Progress
                </span>
                <span className="font-mono">
                  {progress.length} / {selectedLeads.length}
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#25D366] h-full transition-all duration-500"
                  style={{ width: `${(progress.length / selectedLeads.length) * 100}%` }}
                />
              </div>
              {activeWaitMsg && (
                <div className="text-[9px] text-amber-400 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                  <Clock size={10} className="animate-pulse" /> {activeWaitMsg}
                </div>
              )}
            </div>
          )}

          {/* Control Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={sendToAll}
              disabled={sending || !status?.ready || !message.trim() || selectedLeads.length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#1ebd59] text-black text-xs font-extrabold tracking-wider uppercase rounded shadow-lg transition-all duration-200 disabled:opacity-40 disabled:hover:bg-[#25D366] cursor-pointer"
            >
              {sending ? (
                <>
                  <Loader2 size={12} className="animate-spin" /> Sending campaign...
                </>
              ) : (
                <>
                  <Send size={12} /> Dispatch message to {selectedLeads.length} leads
                </>
              )}
            </button>
          </div>

          {/* Console logger logs */}
          {(logs.length > 0 || progress.length > 0) && (
            <div className="bg-[#050507] border border-[#222] rounded p-3">
              <span className="text-[8px] font-bold tracking-widest text-zinc-600 uppercase block mb-1.5">CAMPAIGN DISPATCH CONSOLE LOGS</span>
              <div className="max-h-24 overflow-y-auto font-mono text-[9px] text-zinc-500 space-y-1 scrollbar-thin">
                {logs.map((log, i) => (
                  <div key={i} className={
                    log.includes('✓') ? 'text-emerald-400/90 font-medium' :
                    log.includes('✕') ? 'text-red-400/95 font-medium' :
                    log.includes('Pacing') ? 'text-amber-500/80 italic' : 'text-zinc-500'
                  }>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
