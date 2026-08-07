import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  Wrench, 
  Utensils, 
  Laptop, 
  HeartPulse, 
  Briefcase, 
  Car, 
  MapPin, 
  Loader2, 
  ArrowRight, 
  Layers, 
  Landmark, 
  Sliders, 
  Sun, 
  Moon, 
  X,
  CheckCircle2,
  Building,
  Users
} from 'lucide-react';

interface FrenchGouvExplorerProps {
  serverUrl: string;
  userId: string;
  onExtractLeads: (niche: string, codeNaf: string, location: string, count: number, country?: string, previewLeads?: any[]) => void;
  onClose?: () => void;
}

interface NicheItem {
  id: string;
  name: string;
  codeNaf: string;
  query: string;
  countEst: string;
  desc: string;
}

interface NicheCategory {
  category: string;
  icon: string;
  items: NicheItem[];
}

export const FrenchGouvExplorer: React.FC<FrenchGouvExplorerProps> = ({
  serverUrl,
  userId,
  onExtractLeads,
  onClose
}) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedCountry, setSelectedCountry] = useState<string>('FR');
  const [availableCountries, setAvailableCountries] = useState<any[]>([]);
  const [currentCountryInfo, setCurrentCountryInfo] = useState<any>(null);
  
  const [categories, setCategories] = useState<NicheCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNiche, setSelectedNiche] = useState<NicheItem | null>(null);
  const [location, setLocation] = useState<string>('France');
  
  // Live Gouv API search & preview state
  const [activeCodeNaf, setActiveCodeNaf] = useState<string>('68.31Z');
  const [activeQuery, setActiveQuery] = useState<string>('agence immobiliere');
  const [activeNicheLabel, setActiveNicheLabel] = useState<string>('Agences Immobilières');
  
  const [page, setPage] = useState<number>(1);
  const [extractCount, setExtractCount] = useState<number>(50);
  const [previewLeads, setPreviewLeads] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  // Auto-sync with app global dark/light theme
  useEffect(() => {
    const checkTheme = () => {
      const isDocDark = document.documentElement.classList.contains('dark') || 
                        document.body.classList.contains('dark');
      setTheme(isDocDark ? 'dark' : 'light');
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Fetch organized niches list when selected country changes
  useEffect(() => {
    fetch(`${serverUrl}/api/gouv/niches?country=${selectedCountry}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.niches || []);
          setCurrentCountryInfo(data);
          if (Array.isArray(data.availableCountries)) {
            setAvailableCountries(data.availableCountries);
          }
          if (data.countryName) {
            setLocation(data.countryName);
          }
          if (data.niches && data.niches.length > 0 && data.niches[0].items.length > 0) {
            const first = data.niches[0].items[0];
            setSelectedNiche(first);
            setActiveCodeNaf(first.codeNaf);
            setActiveQuery(first.query);
            setActiveNicheLabel(first.name);
          }
        }
      })
      .catch(err => console.error('Failed to load Gouv niches:', err));
  }, [serverUrl, selectedCountry]);

  // Query live Gouv API whenever active NAF, query, location, page, or country changes
  useEffect(() => {
    fetchGouvPreview(page, false);
  }, [activeCodeNaf, activeQuery, location, selectedCountry]);

  const fetchGouvPreview = async (targetPage: number, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoadingPreview(true);
      setPage(1);
    }

    try {
      const qParam = encodeURIComponent(activeQuery || '');
      const nafParam = encodeURIComponent(activeCodeNaf || '');
      const locParam = encodeURIComponent(location || currentCountryInfo?.countryName || 'France');
      const pParam = append ? targetPage : 1;

      const res = await fetch(
        `${serverUrl}/api/gouv/explore?country=${selectedCountry}&q=${qParam}&code_naf=${nafParam}&location=${locParam}&page=${pParam}&per_page=20`
      );
      const data = await res.json();

      if (data.success && Array.isArray(data.results)) {
        if (append) {
          setPreviewLeads(prev => [...prev, ...data.results]);
        } else {
          setPreviewLeads(data.results);
        }
        setTotalResults(data.total_results || 0);
        setTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      console.error('Error fetching Gouv API preview:', err);
    } finally {
      setIsLoadingPreview(false);
      setIsLoadingMore(false);
    }
  };

  const handleSelectNiche = (niche: NicheItem) => {
    setSelectedNiche(niche);
    setActiveCodeNaf(niche.codeNaf);
    setActiveQuery(niche.query);
    setActiveNicheLabel(niche.name);
  };

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setActiveCodeNaf('');
    setActiveQuery(searchTerm.trim());
    setActiveNicheLabel(searchTerm.trim());
  };

  const handleLoadNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGouvPreview(nextPage, true);
  };

  const handleStartExtraction = () => {
    setIsExtracting(true);
    onExtractLeads(
      activeNicheLabel || activeQuery,
      activeCodeNaf,
      location || currentCountryInfo?.countryName || 'France',
      extractCount,
      selectedCountry,
      previewLeads
    );
    setTimeout(() => {
      setIsExtracting(false);
      if (onClose) onClose();
    }, 800);
  };

  const renderCategoryIcon = (categoryName: string) => {
    const iconClass = theme === 'light' ? 'text-indigo-600' : 'text-indigo-400';
    if (categoryName.includes('Immobilier')) return <Building2 size={15} className={iconClass} />;
    if (categoryName.includes('Bâtiment')) return <Wrench size={15} className={iconClass} />;
    if (categoryName.includes('Restauration')) return <Utensils size={15} className={iconClass} />;
    if (categoryName.includes('Informatique')) return <Laptop size={15} className={iconClass} />;
    if (categoryName.includes('Santé')) return <HeartPulse size={15} className={iconClass} />;
    if (categoryName.includes('Juridique')) return <Briefcase size={15} className={iconClass} />;
    if (categoryName.includes('Automobile')) return <Car size={15} className={iconClass} />;
    return <Layers size={15} className={iconClass} />;
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden max-w-6xl w-full mx-auto flex flex-col my-2 ${
      isDark 
        ? 'bg-[#0f0f16] border-zinc-800 border-t-zinc-700/60 text-white shadow-[0_20px_50px_rgba(0,0,0,0.9)]' 
        : 'bg-slate-50 border-slate-200 text-slate-900 shadow-slate-300/50'
    }`}>
      {/* Top Banner Header */}
      <div className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-4 transition-colors ${
        isDark 
          ? 'bg-gradient-to-b from-[#1c1c28] via-[#161622] to-[#101018] border-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]' 
          : 'bg-gradient-to-r from-slate-100 via-indigo-50/50 to-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
            isDark 
              ? 'bg-gradient-to-b from-[#2a2a3e] to-[#1a1a2a] border-indigo-500/40 border-t-indigo-400/60 text-indigo-300 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)]' 
              : 'bg-indigo-100 border-indigo-200 text-indigo-700 shadow-indigo-100'
          }`}>
            <Landmark size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className={`text-sm font-black tracking-tight uppercase ${
                isDark ? 'text-white drop-shadow-xs' : 'text-slate-900'
              }`}>
                Official Government Open Data Registries
              </h2>
              {currentCountryInfo && (
                <span className={`text-[9.5px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${
                  isDark 
                    ? 'bg-gradient-to-b from-indigo-900/80 to-indigo-950/90 text-indigo-200 border-indigo-500/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]' 
                    : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                }`}>
                  [{currentCountryInfo.countryCode || selectedCountry}] {currentCountryInfo.countryName} Official API
                </span>
              )}
            </div>
            <p className={`text-xs mt-0.5 ${
              isDark ? 'text-zinc-300 font-medium' : 'text-slate-600'
            }`}>
              Fetch verified businesses across French & English speaking countries with open government data APIs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-0.5 ${
                isDark 
                  ? 'bg-gradient-to-b from-[#28283a] via-[#1e1e2d] to-[#141420] border-zinc-700 border-t-zinc-500/80 border-b-black text-zinc-100 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-0.5 hover:border-zinc-500' 
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
            >
              <X size={16} />
              <span className="hidden sm:inline font-extrabold">Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x min-h-[580px] ${
        isDark ? 'divide-zinc-800/80' : 'divide-slate-200'
      }`}>
        
        {/* Left Column: Organized Sectors & Search */}
        <div className={`lg:col-span-5 p-4 flex flex-col space-y-3.5 max-h-[640px] overflow-y-auto custom-scrollbar ${
          isDark ? 'bg-[#12121a]' : 'bg-slate-100/70'
        }`}>
          
          {/* Country Selection */}
          <div className="space-y-1.5">
            <label className={`text-[10px] font-extrabold uppercase tracking-wider block ${
              isDark ? 'text-zinc-300' : 'text-slate-600'
            }`}>
              Select Target Country (French & English Speaking)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { code: 'FR', name: 'France' },
                { code: 'GB', name: 'UK' },
                { code: 'CA', name: 'Canada' },
                { code: 'US', name: 'USA' },
                { code: 'AU', name: 'Australia' },
                { code: 'BE', name: 'Belgium' },
                { code: 'CH', name: 'Swiss' },
                { code: 'IE', name: 'Ireland' }
              ].map(c => {
                const isSelected = selectedCountry === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCountry(c.code)}
                    className={`py-2 px-2 rounded-xl text-xs font-black border flex items-center justify-center gap-1 transition-all transform active:translate-y-0.5 cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-gradient-to-b from-indigo-600 via-indigo-700 to-indigo-900 border-indigo-400 border-t-indigo-300 border-b-indigo-950 text-white shadow-[0_6px_20px_rgba(99,102,241,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] -translate-y-0.5 ring-2 ring-indigo-400/60 font-black'
                          : 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 -translate-y-0.5 font-extrabold'
                        : isDark
                          ? 'bg-gradient-to-b from-[#282838] via-[#1f1f2c] to-[#161622] border-zinc-700/90 border-t-zinc-600/90 border-b-black text-zinc-100 hover:text-white shadow-[0_4px_10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] hover:-translate-y-0.5 hover:from-[#303042] hover:to-[#1e1e2a]'
                          : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:-translate-y-0.5 shadow-xs'
                    }`}
                  >
                    <span>{c.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official API Data Sources Info Box */}
          {currentCountryInfo && currentCountryInfo.sources && (
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              isDark 
                ? 'bg-gradient-to-b from-[#1a1a26] to-[#12121c] border-zinc-800 border-t-zinc-700/50 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]' 
                : 'bg-indigo-50/60 border-indigo-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-indigo-300' : 'text-indigo-900'
                }`}>
                  <Landmark size={12} /> Official Open Data Sources ({currentCountryInfo.sources.length})
                </span>
                <span className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${
                  isDark ? 'bg-[#222234] text-indigo-300 border-indigo-500/40 shadow-inner' : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                }`}>
                  {currentCountryInfo.totalBusinesses} Registered
                </span>
              </div>
              <div className="space-y-1.5 mt-1">
                {currentCountryInfo.sources.map((src: any, sIdx: number) => (
                  <div key={sIdx} className={`p-2.5 rounded-lg border text-[11px] ${
                    isDark ? 'bg-gradient-to-b from-[#202030] to-[#161622] border-zinc-700/60 shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{src.name}</span>
                      <span className="text-[9.5px] text-emerald-400 font-extrabold uppercase tracking-wider">{src.type}</span>
                    </div>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{src.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {src.provides?.map((p: string, pIdx: number) => (
                        <span key={pIdx} className={`text-[8.5px] font-semibold px-1.5 py-0.2 rounded border ${
                          isDark ? 'bg-[#28283a] text-zinc-200 border-zinc-600/60' : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Search Bar */}
          <form onSubmit={handleCustomSearchSubmit} className="space-y-1.5">
            <label className={`text-[10px] font-extrabold uppercase tracking-wider block ${
              isDark ? 'text-zinc-300' : 'text-slate-600'
            }`}>
              Search Sector or Keyword
            </label>
            <div className="relative flex items-center">
              <Search size={14} className={`absolute left-3.5 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. real estate, dentiste, plombier, lawyer..."
                className={`w-full rounded-xl pl-9 pr-8 py-2.5 text-xs font-semibold outline-none transition ${
                  isDark 
                    ? 'bg-[#12121c] border border-zinc-700/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 text-white placeholder:text-zinc-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)]' 
                    : 'bg-white border border-slate-300 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 shadow-sm'
                }`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 text-xs text-zinc-400 hover:text-white p-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>

          {/* Location Filter */}
          <div className="space-y-1.5">
            <label className={`text-[10px] font-extrabold uppercase tracking-wider block ${
              isDark ? 'text-zinc-300' : 'text-slate-600'
            }`}>
              City / Department / Region
            </label>
            <div className="relative flex items-center">
              <MapPin size={14} className={`absolute left-3.5 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Paris, Lyon, Marseille, 75001, or France"
                className={`w-full rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold outline-none transition ${
                  isDark 
                    ? 'bg-[#12121c] border border-zinc-700/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 text-white placeholder:text-zinc-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)]' 
                    : 'bg-white border border-slate-300 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 shadow-sm'
                }`}
              />
            </div>
          </div>

          <div className={`border-t pt-3 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
            <p className={`text-[10px] font-extrabold uppercase tracking-wider mb-2.5 flex items-center gap-1.5 ${
              isDark ? 'text-indigo-400' : 'text-indigo-700'
            }`}>
              <Sliders size={13} /> Organized Business Sectors
            </p>

            {filteredCategories.length === 0 ? (
              <div className={`p-4 text-center text-xs rounded-xl border ${
                isDark ? 'text-zinc-400 bg-[#1a1a26] border-zinc-800' : 'text-slate-500 bg-white border-slate-200'
              }`}>
                No predefined category matches "{searchTerm}". Press Enter to query custom sector.
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className={`flex items-center gap-2 text-[11px] font-black px-3 py-1.5 rounded-xl border ${
                      isDark 
                        ? 'text-zinc-100 bg-gradient-to-b from-[#242436] to-[#1a1a28] border-zinc-700/80 shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]' 
                        : 'text-slate-800 bg-white border-slate-200 shadow-xs'
                    }`}>
                      {renderCategoryIcon(cat.category)}
                      <span>{cat.category}</span>
                    </div>

                    {/* Segmented Pop-out Button Tabs */}
                    <div className="grid grid-cols-1 gap-2 pl-0.5">
                      {cat.items.map(item => {
                        const isSelected = selectedNiche?.id === item.id || activeCodeNaf === item.codeNaf;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectNiche(item)}
                            className={`group relative p-3 rounded-xl border text-left cursor-pointer flex items-center justify-between gap-3 transition-all duration-200 transform active:translate-y-0.5 ${
                              isSelected
                                ? isDark
                                  ? 'bg-gradient-to-b from-[#2e2e44] via-[#222236] to-[#181828] border-2 border-indigo-400 text-white shadow-[0_8px_24px_rgba(99,102,241,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] -translate-y-0.5 ring-2 ring-indigo-500/50 font-black'
                                  : 'bg-white border-indigo-600 text-indigo-950 shadow-md shadow-indigo-100 -translate-y-0.5 ring-2 ring-indigo-500/20 font-bold'
                                : isDark
                                  ? 'bg-gradient-to-b from-[#222232] via-[#1a1a26] to-[#12121d] border border-zinc-700/80 border-t-zinc-600/80 border-b-black text-zinc-100 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] hover:-translate-y-0.5 hover:border-zinc-500 hover:from-[#2a2a3d] hover:to-[#181826]'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-md hover:-translate-y-0.5'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <span className={`text-xs font-bold block transition-colors ${
                                isSelected 
                                  ? 'text-white font-black' 
                                  : (isDark ? 'text-zinc-100 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-950')
                              }`}>
                                {item.name}
                              </span>
                              <p className={`text-[10.5px] truncate mt-0.5 ${
                                isDark ? 'text-zinc-400 font-medium' : 'text-slate-500'
                              }`}>
                                {item.desc}
                              </p>
                            </div>
                            <span className={`text-[10px] font-extrabold whitespace-nowrap px-2.5 py-1 rounded-full border transition-all ${
                              isSelected
                                ? isDark
                                  ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400/50 font-black shadow-inner'
                                  : 'bg-indigo-100 text-indigo-800 border-indigo-200 font-bold'
                                : isDark
                                  ? 'bg-gradient-to-b from-[#2a2a3c] to-[#1a1a28] text-zinc-200 border-zinc-600/70 group-hover:border-zinc-400'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:border-slate-300'
                            }`}>
                              {item.countEst}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Gouv Results Preview & Controls */}
        <div className={`lg:col-span-7 p-4 flex flex-col space-y-3.5 ${
          isDark ? 'bg-[#0b0b10]' : 'bg-slate-50'
        }`}>
          
          {/* Active Search Live Counter Header Card */}
          <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 transition-all ${
            isDark 
              ? 'bg-gradient-to-b from-[#1c1c2b] via-[#161624] to-[#10101a] border-zinc-800 border-t-zinc-700/60 shadow-[0_6px_20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)]' 
              : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black tracking-wide ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {activeNicheLabel}
                </span>
                <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                  isDark 
                    ? 'bg-gradient-to-b from-cyan-900/80 to-cyan-950/90 text-cyan-300 border-cyan-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] font-bold' 
                    : 'bg-cyan-50 text-cyan-800 border-cyan-200 font-bold'
                }`}>
                  Verified Active Directory
                </span>
              </div>
              <p className={`text-[11px] mt-1 flex items-center gap-1.5 ${
                isDark ? 'text-zinc-300 font-medium' : 'text-slate-500'
              }`}>
                <MapPin size={12} className={isDark ? 'text-zinc-400' : 'text-slate-400'} /> Location: <strong className={isDark ? 'text-white' : 'text-slate-800'}>{location || 'France'}</strong>
              </p>
            </div>

            <div className="text-right">
              {isLoadingPreview ? (
                <div className={`flex items-center gap-2 text-xs font-bold ${
                  isDark ? 'text-indigo-300' : 'text-indigo-600'
                }`}>
                  <Loader2 size={15} className="animate-spin" /> Fetching live totals...
                </div>
              ) : (
                <div>
                  <div className={`text-xl font-black font-mono tracking-tight ${
                    isDark 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-indigo-300 drop-shadow-sm' 
                      : 'text-indigo-700'
                  }`}>
                    {totalResults !== null ? totalResults.toLocaleString() : '...'}
                  </div>
                  <div className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    isDark ? 'text-zinc-400' : 'text-slate-500'
                  }`}>
                    Total Registered Businesses
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Batch Extraction Controls - Pop-out Segmented Tab Style */}
          <div className={`p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
            isDark ? 'bg-gradient-to-b from-[#1a1a28] to-[#12121d] border-zinc-800 border-t-zinc-700/60 shadow-[0_6px_20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap ${
                isDark ? 'text-zinc-300' : 'text-slate-600'
              }`}>
                Elect Lead Amount:
              </span>
              <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
                isDark ? 'bg-[#101018] border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]' : 'bg-slate-100 border-slate-200'
              }`}>
                {[25, 50, 100, 250, 500].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setExtractCount(cnt)}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer active:translate-y-0.5 ${
                      extractCount === cnt
                        ? isDark
                          ? 'bg-gradient-to-b from-indigo-600 via-indigo-700 to-indigo-900 border border-indigo-400 border-t-indigo-300 border-b-indigo-950 text-white shadow-[0_4px_14px_rgba(99,102,241,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] -translate-y-0.5'
                          : 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : isDark
                          ? 'bg-gradient-to-b from-[#262638] to-[#181824] border border-zinc-700/80 border-t-zinc-600/80 border-b-black text-zinc-200 hover:text-white shadow-[0_3px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] hover:-translate-y-0.5'
                          : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartExtraction}
              disabled={isExtracting || !totalResults}
              className={`px-4 py-2.5 font-black text-xs tracking-wide rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 transform active:translate-y-0.5 ${
                isDark
                  ? 'bg-gradient-to-b from-indigo-500 via-indigo-600 to-indigo-800 hover:from-indigo-400 hover:to-indigo-700 text-white border border-indigo-400/80 border-t-indigo-300 border-b-indigo-950 shadow-[0_8px_25px_rgba(99,102,241,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:-translate-y-0.5 shadow-lg'
              }`}
            >
              {isExtracting ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Extracting Prospects...
                </>
              ) : (
                <>
                  <span>Extract {extractCount} Prospects</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>

          {/* Live Scroll Results List */}
          <div className={`flex-1 border rounded-2xl p-3.5 flex flex-col space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar shadow-inner ${
            isDark ? 'border-zinc-800 bg-[#0e0e14]' : 'border-slate-200 bg-white'
          }`}>
            <div className={`flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider px-1 pb-1.5 border-b ${
              isDark ? 'text-zinc-400 border-zinc-800' : 'text-slate-500 border-slate-200'
            }`}>
              <span>Directory Preview ({previewLeads.length} loaded)</span>
              <span>Page {page} of {totalPages}</span>
            </div>

            {isLoadingPreview ? (
              <div className="py-14 text-center text-zinc-500 flex flex-col items-center justify-center space-y-2.5">
                <Loader2 size={26} className={`animate-spin ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <p className={`text-xs ${isDark ? 'text-zinc-300 font-medium' : 'text-slate-600'}`}>
                  Connecting directly to official open data business register...
                </p>
              </div>
            ) : previewLeads.length === 0 ? (
              <div className={`py-14 text-center text-xs ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>
                No registered businesses found matching this query or location.
              </div>
            ) : (
              <div className="space-y-2">
                {previewLeads.map((lead, idx) => (
                  <div
                    key={lead.id || idx}
                    className={`p-3 rounded-xl border transition-all flex flex-col space-y-1.5 ${
                      isDark 
                        ? 'bg-gradient-to-b from-[#1e1e2c] to-[#141420] border-zinc-800 border-t-zinc-700/60 hover:border-indigo-500/70 hover:from-[#242436] hover:to-[#1a1a28] shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5' 
                        : 'border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-white hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className={`text-xs font-black block ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {lead.name}
                        </span>
                        {lead.contactName && lead.contactName !== lead.name && (
                          <span className={`text-[10.5px] font-bold block mt-0.5 ${
                            isDark ? 'text-indigo-300' : 'text-indigo-700'
                          }`}>
                            Executive: {lead.contactName}
                          </span>
                        )}
                      </div>

                      {lead.siren && (
                        <span className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                          isDark 
                            ? 'bg-gradient-to-b from-[#2a2a3c] to-[#1c1c2a] text-zinc-200 border-zinc-600/60 shadow-inner' 
                            : 'bg-slate-200/80 text-slate-700 border-slate-300'
                        }`}>
                          ID: {lead.siren}
                        </span>
                      )}
                    </div>

                    <div className={`text-[11px] font-medium flex items-center gap-1.5 ${
                      isDark ? 'text-zinc-300' : 'text-slate-600'
                    }`}>
                      <MapPin size={12} className={`shrink-0 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
                      <span className="truncate">{lead.address || lead.city}</span>
                    </div>
                  </div>
                ))}

                {/* Load More Scroll Button */}
                {page < totalPages && (
                  <button
                    type="button"
                    onClick={handleLoadNextPage}
                    disabled={isLoadingMore}
                    className={`w-full py-2.5 mt-2 text-xs font-extrabold rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:translate-y-0.5 ${
                      isDark 
                        ? 'bg-gradient-to-b from-[#28283a] via-[#1e1e2e] to-[#141420] border-zinc-700 border-t-zinc-600 border-b-black text-indigo-300 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-0.5 hover:from-[#303046] hover:to-[#1a1a28]' 
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-indigo-700'
                    }`}
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Loading Next Companies...
                      </>
                    ) : (
                      <>
                        Load Next Page ({page + 1}/{totalPages})
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};


