import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, Download, AlertCircle, Loader2 } from 'lucide-react';

interface WebsiteGeneratorPanelProps {
  lead: any;
}

export const WebsiteGeneratorPanel: React.FC<WebsiteGeneratorPanelProps> = ({ lead }) => {
  const [generating, setGenerating] = useState(false);
  const [siteData, setSiteData] = useState<any>(null);
  const [templateStyle, setTemplateStyle] = useState<string>('premium-dark');
  const [error, setError] = useState<string | null>(null);

  const behanceTemplates = [
    { id: 'behance-construction', label: '🏗️ Behance Construction', url: 'https://www.behance.net/gallery/253285809/Landing-page-dlja-stroitelnoj-kompanii-lending-sajt' },
    { id: 'behance-cleaning', label: '✨ Behance Home Cleaning', url: 'https://www.behance.net/gallery/163204349/Home-Cleaning-Service-website' },
    { id: 'behance-plumbing', label: '💧 Behance Pro Plumbing', url: 'https://www.behance.net/gallery/245989723/Modern-Plumbing-Services-Website-Design' },
    { id: 'behance-restaurant', label: '🍷 Behance Gourmet Dining', url: 'https://www.behance.net/gallery/245591699/Restaurant-Web-Site-Design' },
  ];

  useEffect(() => {
    setSiteData(null);
    setError(null);
  }, [lead?.id, lead?.leadId, lead?.name]);

  const generateSite = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/leads/generate-site-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, existingContent: { templateStyle } }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${res.status}: ${errText}`);
      }
      const data = await res.json();
      setSiteData(data);
    } catch (err: any) {
      console.error('Site generation failed:', err);
      setError(err.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const downloadZip = async (siteId: string) => {
    try {
      const res = await fetch('/api/leads/download-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId }),
      });
      if (!res.ok) {
        throw new Error(`Failed to download ZIP: ${res.statusText}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${siteId}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download ZIP error:', err);
      alert('Failed to download ZIP file.');
    }
  };

  return (
    <div className="website-generator-panel bg-[#0A0A0C] border border-[#27272A] rounded-lg p-4 space-y-4 my-2 text-zinc-200">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1C1C22]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Nesta Website Generator
          </span>
        </div>

        <div className="template-toggle flex flex-wrap items-center gap-3 text-xs font-medium">
          <select 
            value={templateStyle}
            onChange={(e) => setTemplateStyle(e.target.value)}
            className="bg-[#18181B] text-amber-400 font-bold border border-[#27272A] rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
          >
            <optgroup label="Behance High-End Portfolio Templates">
              <option value="behance-construction">🏗️ Behance Construction & Building</option>
              <option value="behance-cleaning">✨ Behance Home Cleaning</option>
              <option value="behance-plumbing">💧 Behance Pro Plumbing</option>
              <option value="behance-restaurant">🍷 Behance Gourmet Dining</option>
            </optgroup>
            <optgroup label="Standard Design Engines">
              <option value="premium-dark">⚡ Premium Dynamic Dark</option>
              <option value="luxury-serif">💎 Luxury Serif & Gold</option>
            </optgroup>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={generateSite} 
          disabled={generating}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-black font-bold text-xs rounded transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md"
        >
          {generating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Generate Website
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="error-msg flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-md">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Generation failed: {error}</span>
        </div>
      )}

      {siteData && (
        <div className="site-preview-wrap space-y-3 pt-2">
          <div className="preview-toolbar flex items-center justify-between p-2.5 bg-[#121216] border border-[#262832] rounded-md text-xs">
            <div className="flex items-center gap-2 font-mono text-zinc-400 text-[11px] truncate">
              <span className="text-emerald-400 font-bold">LIVE PREVIEW</span>
              <span>•</span>
              <span className="truncate">{siteData.siteId}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a 
                href={siteData.previewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#1C1C22] hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-[#2A2A32] rounded transition flex items-center gap-1.5 font-medium text-[11px]"
              >
                Open in new tab <ExternalLink className="w-3 h-3" />
              </a>
              <button 
                onClick={() => downloadZip(siteData.siteId)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded transition flex items-center gap-1.5 text-[11px] cursor-pointer"
              >
                <Download className="w-3 h-3" />
                Download ZIP
              </button>
            </div>
          </div>

          <iframe
            src={siteData.previewUrl || `/preview/${siteData.siteId}`}
            srcDoc={siteData.html}
            title={`Preview for ${lead?.company || lead?.businessName || lead?.name || 'Lead'}`}
            className="site-preview-iframe"
            style={{ width: '100%', height: '700px', border: '1px solid #262832', borderRadius: '10px', backgroundColor: '#0A0A0C' }}
          />
        </div>
      )}
    </div>
  );
};
