import React, { useEffect, useState } from 'react';
import { ShieldAlert, RefreshCw, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

export interface HealedSelectorItem {
  originalSelector: string;
  healedSelector: string;
  pageContext: string;
  fieldDescription?: string;
  confidence: 'high' | 'medium' | 'low';
  reasoning?: string;
  healedAt: string;
}

export const HealedSelectorsPanel: React.FC = () => {
  const [items, setItems] = useState<HealedSelectorItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealedSelectors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/healed-selectors');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load healed selectors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealedSelectors();
  }, []);

  return (
    <div className="bg-[#121215] border border-[#27272A] rounded-xl p-5 shadow-lg space-y-4 text-white">
      <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#7C5335]/20 text-[#D97706] rounded-lg border border-[#7C5335]/30">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#F5F5F5]">Self-Healing Selectors Engine</h3>
            <p className="text-[11px] text-[#A1A1AA]">
              Gemini vision auto-repair records when DOM elements break or change structure
            </p>
          </div>
        </div>

        <button
          onClick={fetchHealedSelectors}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1C22] hover:bg-[#27272A] border border-[#27272A] text-xs font-medium text-[#D4D4D8] rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle size={14} />
          <span>{error}</span>
        </div>
      )}

      {items.length === 0 && !loading && !error && (
        <div className="py-8 text-center text-xs text-[#71717A] border border-dashed border-[#27272A] rounded-lg bg-[#0A0A0C]">
          <CheckCircle2 size={24} className="mx-auto mb-2 text-[#10B981] opacity-80" />
          <p className="font-medium text-[#A1A1AA]">No selector failures detected yet</p>
          <p className="text-[10px] mt-1 text-[#71717A]">
            When scraper CSS selectors fail, Gemini vision will repair them automatically and log the healed fix here.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#27272A] text-[#71717A] uppercase text-[10px] tracking-wider">
                <th className="py-2 px-3">Field / Context</th>
                <th className="py-2 px-3">Original Broken Selector</th>
                <th className="py-2 px-3">AI Healed Replacement</th>
                <th className="py-2 px-3">Confidence</th>
                <th className="py-2 px-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C22]">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#1A1A20] transition">
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-[#E4E4E7]">
                      {item.fieldDescription || 'Element'}
                    </div>
                    <div className="text-[10px] text-[#A1A1AA] font-mono">{item.pageContext}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#EF4444] text-[11px] bg-red-500/5 rounded px-2">
                    {item.originalSelector}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#10B981] text-[11px] bg-emerald-500/5 rounded px-2">
                    {item.healedSelector}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        item.confidence === 'high'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.confidence === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {item.confidence}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#71717A] text-[10px] whitespace-nowrap">
                    {new Date(item.healedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
