import React, { useState, useEffect } from 'react';
import { X, Sparkles, Download, Share2, Globe, RefreshCw, Code, Check, ExternalLink, Play, Languages, Image, Upload, Trash2, Wand2, Search, Star, MessageSquare } from 'lucide-react';

interface NestaWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export const NestaWebsiteModal: React.FC<NestaWebsiteModalProps> = ({ isOpen, onClose, lead }) => {
  const [loading, setLoading] = useState(false);
  const [modifying, setModifying] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const [selectedLang, setSelectedLang] = useState<string>('auto');

  const [siteData, setSiteData] = useState<{
    siteId: string;
    content: any;
    html: string;
    previewUrl: string;
  } | null>(null);

  const [aiPrompt, setAiPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'schema' | 'export' | 'media' | 'templates'>('preview');
  const [downloadingTemplateId, setDownloadingTemplateId] = useState<string | null>(null);
  const [behanceImportUrl, setBehanceImportUrl] = useState('');
  const [importingBehance, setImportingBehance] = useState(false);
  const [scrapedBehanceData, setScrapedBehanceData] = useState<{
    url: string;
    title: string;
    description: string;
    category: string;
    templateStyle: string;
    images: string[];
  } | null>(null);
  const [selectedScrapedImages, setSelectedScrapedImages] = useState<string[]>([]);

  const BEHANCE_TEMPLATES_LIST = [
    {
      id: 'behance-construction',
      name: 'Industrial Construction & Building',
      behanceUrl: 'https://www.behance.net/gallery/253285809/Landing-page-dlja-stroitelnoj-kompanii-lending-sajt',
      category: 'Construction & Renovation',
      badge: 'Behance Featured',
      thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop',
      description: 'Heavy dark slate canvas, architectural blueprint lines, interactive estimate cost calculator, project specifications grid.'
    },
    {
      id: 'behance-cleaning',
      name: 'FreshSparkle Home Cleaning',
      behanceUrl: 'https://www.behance.net/gallery/163204349/Home-Cleaning-Service-website',
      category: 'Home Services & Housekeeping',
      badge: 'Behance Gold',
      thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80&auto=format&fit=crop',
      description: 'Ultra-fresh sky blue & mint layout, interactive room cleaning price calculator slider, eco-friendly green seal.'
    },
    {
      id: 'behance-plumbing',
      name: 'AquaFlow Pro Emergency Plumbing',
      behanceUrl: 'https://www.behance.net/gallery/245989723/Modern-Plumbing-Services-Website-Design',
      category: 'Plumbing & Repairs',
      badge: 'Behance Pro',
      thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format&fit=crop',
      description: 'Deep ocean aquatic blue theme, 24/7 emergency dispatch ticker banner, upfront transparent price matrix.'
    },
    {
      id: 'behance-restaurant',
      name: 'LuxBite Premium Dining & Fast Food',
      behanceUrl: 'https://www.behance.net/gallery/245591699/Restaurant-Web-Site-Design',
      category: 'Dining & Fast Food',
      badge: 'LuxBite Signature',
      thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop',
      description: 'Dark luxury aesthetic, Playfair Display typography, crimson & gold accents, interactive food menu tabs, special deals, photo gallery & online table booking.'
    }
  ];
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [scrapingPhotos, setScrapingPhotos] = useState(false);
  const [scrapedPhotosList, setScrapedPhotosList] = useState<string[]>([]);
  const [jsonText, setJsonText] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);

  const [researchQuery, setResearchQuery] = useState('');
  const [researchingPhotos, setResearchingPhotos] = useState(false);
  const [researchedPhotosList, setResearchedPhotosList] = useState<string[]>([]);
  const [openSelectorUrl, setOpenSelectorUrl] = useState<string | null>(null);

  const [uploadingZip, setUploadingZip] = useState(false);
  const [zipSuccessMessage, setZipSuccessMessage] = useState<string | null>(null);

  const [netlifyToken, setNetlifyToken] = useState<string>(() => localStorage.getItem('NETLIFY_AUTH_TOKEN') || '');
  const [deployingNetlify, setDeployingNetlify] = useState(false);
  const [netlifyDeployResult, setNetlifyDeployResult] = useState<{ url: string; siteName?: string; adminUrl?: string; message?: string; note?: string; requiresToken?: boolean } | null>(null);

  const handleDeployToNetlify = async () => {
    if (!siteData?.html && !siteData?.content) return;
    setDeployingNetlify(true);
    try {
      if (netlifyToken) {
        localStorage.setItem('NETLIFY_AUTH_TOKEN', netlifyToken);
      }
      const res = await fetch('/api/netlify/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: siteData.html || '',
          name: lead.name || lead.companyName || lead.company || 'site',
          siteName: (lead.name || lead.companyName || lead.company || 'site').toLowerCase().replace(/[^a-z0-9]/g, ''),
          netlifyToken,
          leadId: lead.id || lead.leadId
        })
      });
      const data = await res.json();
      if (data.success && data.url) {
        setNetlifyDeployResult(data);
        if (siteData) {
          setSiteData({ ...siteData, previewUrl: data.url });
        }
        lead.deployedWebsiteUrl = data.url;
        lead.previewUrl = data.url;
      }
    } catch (err: any) {
      console.error('Netlify deployment error:', err);
    } finally {
      setDeployingNetlify(false);
    }
  };

  const handleShareToWhatsApp = () => {
    const url = netlifyDeployResult?.url || siteData?.previewUrl || '';
    const rawPhone = lead.phone || '';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const company = lead.companyName || lead.name || lead.company || 'votre entreprise';
    const text = encodeURIComponent(`Bonjour, nous avons créé un nouveau site internet haute performance pour ${company} : ${url}\n\nSouhaitez-vous le consulter et voir comment Assix automatise vos appels manqués et vos e-mails ?`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingZip(true);
    setZipSuccessMessage(null);
    try {
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/leads/adapt-zip-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipBase64: base64Data,
          targetLead: lead,
          langOverride: selectedLang !== 'auto' ? selectedLang : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));
        setZipSuccessMessage(`Successfully imported template! Extracted ${data.extractedPhotosCount || 0} images and adapted all contact info for ${lead.name || lead.companyName || 'the new business'}.`);
        setTimeout(() => setZipSuccessMessage(null), 6000);
      }
    } catch (err) {
      console.error('Failed to import ZIP template:', err);
      alert('Error parsing ZIP file. Make sure it is a valid website ZIP archive.');
    } finally {
      setUploadingZip(false);
    }
  };

  useEffect(() => {
    if (isOpen && lead) {
      const currentLeadId = lead.id || lead.leadId || lead.name || lead.companyName || lead.phone || 'lead';
      if (activeLeadId !== currentLeadId) {
        setActiveLeadId(currentLeadId);
        setSiteData(null);
        setJsonText('');
        const initialQuery = `${lead.name || lead.companyName || 'Business'} ${lead.niche || lead.sector || ''} HD photo`.trim();
        setResearchQuery(initialQuery);
        setResearchedPhotosList([]);

        if (lead.userUploadedImages && Array.isArray(lead.userUploadedImages)) {
          setUploadedImages(lead.userUploadedImages);
        } else {
          setUploadedImages([]);
        }
        if (lead.photos && Array.isArray(lead.photos)) {
          setScrapedPhotosList(lead.photos);
        } else {
          setScrapedPhotosList([]);
        }

        // Auto-detect initial language
        const market = (lead.market || '').toLowerCase();
        const langProp = (lead.language || '').toLowerCase();
        let targetLang = 'fr';
        if (market.includes('english') || market.includes('us') || market.includes('uk') || langProp.includes('en')) {
          targetLang = 'en';
        } else if (market.includes('spanish') || langProp.includes('es')) {
          targetLang = 'es';
        } else if (market.includes('german') || langProp.includes('de')) {
          targetLang = 'de';
        }
        setSelectedLang(targetLang);

        // Immediately trigger generation for this specific lead
        generateSiteForLead(lead, targetLang);
      }
    } else if (!isOpen) {
      setActiveLeadId(null);
      setSiteData(null);
    }
  }, [isOpen, lead]);

  const generateSiteForLead = async (targetLead: any, langOverride?: string, templateStyleOverride?: string) => {
    setLoading(true);
    const targetLang = langOverride || (selectedLang !== 'auto' ? selectedLang : (targetLead.market?.includes('english') ? 'en' : 'fr'));
    try {
      const res = await fetch('/api/leads/generate-site-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: targetLead,
          pitchContext: targetLead.pitch || '',
          langOverride: targetLang,
          templateStyle: templateStyleOverride
        })
      });

      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));
      }
    } catch (err) {
      console.error('Failed to generate site:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVisionConvertDesign = async (targetImageUrl?: string, imageBase64?: string) => {
    setLoading(true);
    try {
      const targetLang = selectedLang !== 'auto' ? selectedLang : (lead.market?.includes('english') ? 'en' : 'fr');
      const res = await fetch('/api/leads/vision-convert-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: targetImageUrl,
          imageBase64,
          lead,
          langOverride: targetLang
        })
      });
      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));
        setActiveTab('preview');
      } else {
        alert(data.error || 'Failed to convert design image with Gemini Vision');
      }
    } catch (err) {
      console.error('Error converting image to HTML via Vision:', err);
      alert('Error processing image with Gemini Vision AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeBehanceAssets = async (targetUrl?: string) => {
    const urlToScrape = targetUrl || behanceImportUrl;
    if (!urlToScrape || !urlToScrape.includes('behance.net')) {
      alert('Please enter a valid Behance gallery link (e.g. https://www.behance.net/gallery/...)');
      return;
    }
    setImportingBehance(true);
    try {
      const res = await fetch('/api/leads/scrape-behance-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ behanceUrl: urlToScrape })
      });
      const data = await res.json();
      if (data.success) {
        setScrapedBehanceData(data);
        setSelectedScrapedImages(data.images || []);
      } else {
        alert(data.error || 'Failed to scrape Behance design assets');
      }
    } catch (err) {
      console.error('Error scraping Behance assets:', err);
      alert('Error fetching Behance design assets.');
    } finally {
      setImportingBehance(false);
    }
  };

  const handleGenerateFromScrapedAssets = async () => {
    if (!scrapedBehanceData) return;
    setLoading(true);
    try {
      const targetLang = selectedLang !== 'auto' ? selectedLang : (lead.market?.includes('english') ? 'en' : 'fr');
      const res = await fetch('/api/leads/import-behance-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          behanceUrl: scrapedBehanceData.url,
          selectedImages: selectedScrapedImages,
          templateStyleOverride: scrapedBehanceData.templateStyle,
          lead,
          langOverride: targetLang
        })
      });
      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));
        setActiveTab('preview');
      } else {
        alert(data.error || 'Failed to generate website from Behance assets');
      }
    } catch (err) {
      console.error('Error building site from Behance assets:', err);
      alert('Failed to build website from Behance assets.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplateZip = async (templateId: string, templateName: string) => {
    setDownloadingTemplateId(templateId);
    try {
      // 1. Generate site with this specific template
      const targetLang = selectedLang !== 'auto' ? selectedLang : (lead.market?.includes('english') ? 'en' : 'fr');
      const resGen = await fetch('/api/leads/generate-site-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          pitchContext: lead.pitch || '',
          langOverride: targetLang,
          templateStyle: templateId
        })
      });
      const dataGen = await resGen.json();
      if (!dataGen.success || !dataGen.html) {
        throw new Error('Failed to render template HTML');
      }

      // 2. Download ZIP
      const resZip = await fetch('/api/leads/download-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: dataGen.html,
          leadName: `${lead.name || lead.companyName || 'nesta'}-${templateId}`
        })
      });

      if (resZip.ok) {
        const blob = await resZip.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${templateId}-${(lead.name || 'website').toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Failed to download template ZIP:', err);
      alert('Error creating template ZIP package.');
    } finally {
      setDownloadingTemplateId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newBase64s: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newBase64s.push(dataUrl);
    }

    const updated = [...uploadedImages, ...newBase64s];
    setUploadedImages(updated);

    if (siteData) {
      setModifying(true);
      try {
        const res = await fetch('/api/leads/modify-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId: siteData.siteId,
            currentContent: siteData.content,
            directContent: { uploadedImages: updated },
            lead
          })
        });
        const data = await res.json();
        if (data.success) {
          setSiteData(data);
          setJsonText(JSON.stringify(data.content, null, 2));
        }
      } catch (err) {
        console.error('Failed to update images:', err);
      } finally {
        setModifying(false);
      }
    }
  };

  const handleDeleteUploadedImage = async (indexToRemove: number) => {
    const updated = uploadedImages.filter((_, idx) => idx !== indexToRemove);
    setUploadedImages(updated);

    if (siteData) {
      setModifying(true);
      try {
        const res = await fetch('/api/leads/modify-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId: siteData.siteId,
            currentContent: siteData.content,
            directContent: { uploadedImages: updated },
            lead
          })
        });
        const data = await res.json();
        if (data.success) {
          setSiteData(data);
          setJsonText(JSON.stringify(data.content, null, 2));
        }
      } catch (err) {
        console.error('Failed to delete image:', err);
      } finally {
        setModifying(false);
      }
    }
  };

  const handleScrapeGooglePhotos = async () => {
    setScrapingPhotos(true);
    try {
      const res = await fetch('/api/leads/scrape-google-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          siteId: siteData?.siteId
        })
      });
      const data = await res.json();
      if (data.success && data.photos) {
        setScrapedPhotosList(data.photos);
        if (data.siteData) {
          setSiteData(data.siteData);
          setJsonText(JSON.stringify(data.siteData.content, null, 2));
        }
      }
    } catch (err) {
      console.error('Failed to scrape Google Photos:', err);
    } finally {
      setScrapingPhotos(false);
    }
  };

  const handleResearchPhotos = async (customQuery?: string) => {
    const queryToUse = customQuery || researchQuery || `${lead.name || lead.companyName} HD photo`;
    setResearchingPhotos(true);
    try {
      const res = await fetch('/api/leads/research-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToUse,
          count: 20,
          lead,
          siteId: siteData?.siteId
        })
      });
      const data = await res.json();
      if (data.success && data.photos) {
        setResearchedPhotosList(data.photos);
        if (data.siteData) {
          setSiteData(data.siteData);
          setJsonText(JSON.stringify(data.siteData.content, null, 2));
        }
      }
    } catch (err) {
      console.error('Failed to research photos:', err);
    } finally {
      setResearchingPhotos(false);
    }
  };

  const handleAssignImage = async (
    imgUrl: string,
    target: { type: 'hero' | 'about' | 'gallery' | 'service' | 'portfolio'; index?: number }
  ) => {
    if (!siteData) return;
    setModifying(true);
    try {
      const currentContent = { ...siteData.content };

      if (target.type === 'hero') {
        currentContent.heroImage = imgUrl;
      } else if (target.type === 'about') {
        currentContent.aboutImage = imgUrl;
      } else if (target.type === 'gallery') {
        const existingPhotos = Array.isArray(currentContent.photos) ? [...currentContent.photos] : [];
        if (!existingPhotos.includes(imgUrl)) {
          currentContent.photos = [imgUrl, ...existingPhotos];
        }
      } else if (target.type === 'service' && typeof target.index === 'number') {
        const services = Array.isArray(currentContent.services) ? [...currentContent.services] : [];
        if (services[target.index]) {
          services[target.index] = { ...services[target.index], image: imgUrl };
          currentContent.services = services;
        }
      } else if (target.type === 'portfolio' && typeof target.index === 'number') {
        const portfolio = Array.isArray(currentContent.portfolio) ? [...currentContent.portfolio] : [];
        if (portfolio[target.index]) {
          portfolio[target.index] = { ...portfolio[target.index], image: imgUrl };
          currentContent.portfolio = portfolio;
        }
      }

      const res = await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          directContent: currentContent,
          lead
        })
      });
      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));
      }
    } catch (err) {
      console.error('Failed to assign image placement:', err);
    } finally {
      setModifying(false);
    }
  };

  const renderPlacementSelector = (photoUrl: string) => {
    const servicesList = siteData?.content?.services || [];
    const portfolioList = siteData?.content?.portfolio || [];
    const isOpen = openSelectorUrl === photoUrl;

    return (
      <div className="relative group/placement inline-block text-left">
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenSelectorUrl(isOpen ? null : photoUrl);
          }}
          className="px-2.5 py-1.5 bg-[#1C1C24] hover:bg-[#7C5335] text-amber-300 hover:text-white font-bold text-[10px] rounded-lg border border-amber-500/40 hover:border-amber-400 shadow-md flex items-center gap-1.5 cursor-pointer transition select-none"
        >
          <Sparkles size={11} className="text-amber-400 group-hover/placement:rotate-12 transition" />
          <span>Attribute ▾</span>
        </button>

        <div 
          className={`absolute bottom-full right-0 mb-1.5 w-60 bg-[#121218] border border-amber-500/50 rounded-xl shadow-2xl p-2 z-[100] transition-all duration-150 space-y-1 text-left max-h-72 overflow-y-auto ${
            isOpen 
              ? 'opacity-100 pointer-events-auto scale-100' 
              : 'opacity-0 group-hover/placement:opacity-100 pointer-events-none group-hover/placement:pointer-events-auto scale-95 group-hover/placement:scale-100'
          }`}
        >
          <div className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider px-2 py-1 bg-amber-500/10 rounded-md mb-1 flex items-center justify-between">
            <span>Assign Picture to Section</span>
            <Sparkles size={10} className="text-amber-400" />
          </div>

          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'hero' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Star size={12} className="text-amber-400 shrink-0" /> Hero Banner Image
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'about' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-blue-300 hover:bg-blue-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Globe size={12} className="text-blue-400 shrink-0" /> About Section Image
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'gallery' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-purple-300 hover:bg-purple-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Image size={12} className="text-purple-400 shrink-0" /> Add to Gallery Grid
          </button>

          {servicesList.length > 0 && (
            <>
              <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider px-2 pt-1.5 pb-0.5 border-t border-zinc-800">Services Cards</div>
              {servicesList.map((s: any, idx: number) => (
                <button
                  key={`srv-${idx}`}
                  onClick={() => {
                    handleAssignImage(photoUrl, { type: 'service', index: idx });
                    setOpenSelectorUrl(null);
                  }}
                  className="w-full text-left px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-lg truncate flex items-center gap-1.5 transition cursor-pointer"
                  title={s.title}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <span className="truncate">{s.title || `Service #${idx + 1}`}</span>
                </button>
              ))}
            </>
          )}

          {portfolioList.length > 0 && (
            <>
              <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider px-2 pt-1.5 pb-0.5 border-t border-zinc-800">Portfolio Items</div>
              {portfolioList.map((p: any, idx: number) => (
                <button
                  key={`port-${idx}`}
                  onClick={() => {
                    handleAssignImage(photoUrl, { type: 'portfolio', index: idx });
                    setOpenSelectorUrl(null);
                  }}
                  className="w-full text-left px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-indigo-500/20 hover:text-indigo-300 rounded-lg truncate flex items-center gap-1.5 transition cursor-pointer"
                  title={p.title}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                  <span className="truncate">{p.title || `Portfolio #${idx + 1}`}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen || !lead) return null;

  const handleGenerateSite = async (langOverride?: string) => {
    await generateSiteForLead(lead, langOverride);
  };

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    handleGenerateSite(lang);
  };

  const handleTemplateStyleChange = async (style: string) => {
    if (!siteData) return;
    setModifying(true);
    try {
      const res = await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          directContent: { templateStyle: style },
          lead
        })
      });
      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));
      }
    } catch (err) {
      console.error('Failed to change template style:', err);
    } finally {
      setModifying(false);
    }
  };

  const handleNicheChange = async (niche: string) => {
    if (!siteData) return;
    setModifying(true);
    try {
      const res = await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          directContent: { nicheOverride: niche },
          lead: { ...lead, niche }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));
      }
    } catch (err) {
      console.error('Failed to change niche:', err);
    } finally {
      setModifying(false);
    }
  };

  const handleAnalyzeAndRealignNiche = async () => {
    if (!siteData) return;
    setModifying(true);
    try {
      const companyName = lead.name || lead.businessName || lead.company || 'Business';
      const activeNiche = siteData?.content?.nicheOverride || lead?.niche || lead?.sector || 'restaurant';
      const targetLang = selectedLang !== 'auto' ? selectedLang : (lead.market?.includes('english') ? 'en' : 'fr');
      
      const realignPrompt = `Analyze this lead's business context (${companyName}, city: ${lead.city || ''}, sector/niche: ${activeNiche}).
Completely rewrite, translate and align ALL website content to match this exact niche (${activeNiche}):
1. All headlines, subheadings, ribbon tickers, and about sections.
2. All service titles, descriptions, and CTA button labels (e.g., if restaurant or traiteur, use "Réserver une table", "Consulter la carte", "Commander en ligne" rather than generic devis buttons).
3. All benefit items, step processes, FAQs, and contact form title/subtitle.
4. All customer reviews/testimonials MUST be fully translated into ${targetLang === 'fr' ? 'French' : targetLang === 'es' ? 'Spanish' : targetLang === 'de' ? 'German' : 'English'}.
Set nicheOverride to "${activeNiche}".`;

      const res = await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          prompt: realignPrompt,
          lead: { ...lead, niche: activeNiche, sector: activeNiche },
          langOverride: targetLang
        })
      });

      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));
      }
    } catch (err) {
      console.error('Failed to realign niche:', err);
    } finally {
      setModifying(false);
    }
  };

  const handleModifyWithAI = async () => {
    if (!aiPrompt.trim() || !siteData) return;
    setModifying(true);
    try {
      const res = await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          prompt: aiPrompt,
          lead,
          langOverride: selectedLang !== 'auto' ? selectedLang : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));
        setAiPrompt('');
      }
    } catch (err) {
      console.error('Failed to modify content:', err);
    } finally {
      setModifying(false);
    }
  };

  const handleApplyJson = async () => {
    if (!siteData) return;
    try {
      const parsed = JSON.parse(jsonText);
      setModifying(true);
      const res = await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          directContent: parsed,
          lead
        })
      });

      const data = await res.json();
      if (data.success) {
        setSiteData(data);
      }
    } catch (err) {
      alert('Invalid JSON structure. Please check your edits.');
    } finally {
      setModifying(false);
    }
  };

  const handleExportWebhook = async () => {
    if (!siteData) return;
    setExporting(true);
    try {
      const res = await fetch('/api/leads/export-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          content: siteData.content,
          webhookUrl: webhookUrl.trim() || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!siteData) return;
    setDownloadingZip(true);
    try {
      const res = await fetch('/api/leads/download-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: siteData.html,
          leadName: lead.name || lead.companyName || lead.businessName
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(lead.name || 'nesta-site').toLowerCase().replace(/[^a-z0-9]/g, '-')}-website.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Download ZIP failed:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleCopyLink = () => {
    if (siteData?.previewUrl) {
      navigator.clipboard.writeText(siteData.previewUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const companyName = lead.name || lead.companyName || lead.company || lead.businessName || 'Lead';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0F0F12] border border-[#27272A] rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-[#27272A] flex items-center justify-between bg-[#0A0A0C]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-black text-sm">
              N
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Nesta Premium AI Website Builder
              </h3>
              <p className="text-xs text-zinc-400">Prospect: <strong className="text-zinc-200">{companyName}</strong> ({lead.city || 'Local'})</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Template Style Selector */}
            <div className="flex items-center bg-[#18181B] px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-300">
              <select
                value={siteData?.content?.templateStyle || 'premium-dark'}
                onChange={(e) => handleTemplateStyleChange(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="premium-dark" className="bg-[#18181B]">Premium Dark Ribbon</option>
                <option value="luxury-serif" className="bg-[#18181B]">👑 Luxury Serif</option>
                <option value="classic" className="bg-[#18181B]">💼 Classic Modern</option>
              </select>
            </div>

            {/* Niche Selector */}
            <div className="flex items-center bg-[#18181B] px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-300">
              <select
                value={siteData?.content?.nicheOverride || lead?.niche || 'restaurant'}
                onChange={(e) => handleNicheChange(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="restaurant" className="bg-[#18181B]">🍷 Restaurant / Restauration</option>
                <option value="traiteur" className="bg-[#18181B]">🍽️ Traiteur / Caterer</option>
                <option value="electrician" className="bg-[#18181B]">⚡ Électricien</option>
                <option value="plumber" className="bg-[#18181B]">🚰 Plombier</option>
                <option value="roofer" className="bg-[#18181B]">🏠 Couvreur / Toiture</option>
                <option value="locksmith" className="bg-[#18181B]">🔑 Serrurier</option>
                <option value="realEstate" className="bg-[#18181B]">🏢 Agence Immobilière</option>
                <option value="fitnessCoach" className="bg-[#18181B]">🏋️ Coach Sportif</option>
                <option value="drivingSchool" className="bg-[#18181B]">🚗 Auto-École</option>
              </select>
            </div>

            {/* Analyze & Match Niche Button - Turquoise */}
            <button
              onClick={handleAnalyzeAndRealignNiche}
              disabled={modifying || !siteData}
              className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-400 hover:from-teal-400 hover:to-cyan-400 text-zinc-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-md shadow-teal-500/20 shrink-0 border border-teal-300/40"
              title="Analyze lead context & align all text, buttons, and reviews to niche"
            >
              {modifying ? <RefreshCw size={13} className="animate-spin text-zinc-950" /> : <Wand2 size={13} className="text-zinc-950" />}
              <span>Analyze & Match Niche</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-[#18181B] px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-300">
              <Languages size={13} className="text-teal-400" />
              <select
                value={selectedLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="fr" className="bg-[#18181B]">🇫🇷 Français</option>
                <option value="en" className="bg-[#18181B]">🇺🇸 English</option>
                <option value="es" className="bg-[#18181B]">🇪🇸 Español</option>
                <option value="de" className="bg-[#18181B]">🇩🇪 Deutsch</option>
              </select>
            </div>

            {siteData?.previewUrl && (
              <a
                href={siteData.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-[#1C1C22] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <ExternalLink size={13} /> Open Tab
              </a>
            )}

            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip || !siteData}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Download size={13} /> {downloadingZip ? 'Packaging...' : 'Download ZIP'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CONTROLS BAR & TABS */}
        <div className="px-6 py-3 border-b border-[#1F1F23] bg-[#0F0F12] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-[#18181B] p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'preview' ? 'bg-[#27272A] text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Globe size={13} className="inline mr-1.5" /> Interactive Preview
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'schema' ? 'bg-[#27272A] text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Code size={13} className="inline mr-1.5" /> JSON Schema & Copy
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'export' ? 'bg-[#27272A] text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Share2 size={13} className="inline mr-1.5" /> API / Webhook Export
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'media' ? 'bg-[#27272A] text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Image size={13} className="inline mr-1.5" /> Photos & Media ({uploadedImages.length + (lead.photos?.length || 0)})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'templates' ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' : 'text-amber-400 hover:text-amber-300'}`}
            >
              <Sparkles size={13} /> Behance Templates ({BEHANCE_TEMPLATES_LIST.length})
            </button>
          </div>

          {/* AI EDIT INPUT */}
          <div className="flex-1 max-w-xl flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI to change anything: layout, button styles, colors, text, fonts, or theme..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleModifyWithAI()}
              className="flex-1 bg-[#18181B] border border-zinc-800 focus:border-blue-500 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              onClick={handleModifyWithAI}
              disabled={modifying || !aiPrompt.trim()}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition disabled:opacity-40 flex items-center gap-1 cursor-pointer shrink-0"
            >
              {modifying ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />} Apply AI
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-hidden relative bg-[#050507]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-zinc-400 font-medium animate-pulse">
                Generating premium niche website for {companyName}...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'preview' && (
                <div className="w-full h-full relative">
                  {siteData ? (
                    <iframe
                      title="Nesta Website Live Preview"
                      src={siteData.previewUrl || `/preview/${siteData.siteId}`}
                      srcDoc={siteData.html}
                      className="w-full h-full border-none bg-white"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                      No site preview generated yet.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'schema' && (
                <div className="p-6 h-full flex flex-col space-y-4 overflow-y-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0A0C] border border-zinc-800 p-4 rounded-xl">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Code size={14} className="text-emerald-400" />
                        Editable JSON Schema & Style Copying
                      </h4>
                      <p className="text-xs text-zinc-400">Copy this layout JSON style to apply to another business, or paste a saved design schema.</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(jsonText);
                          alert('Website design schema copied to clipboard!');
                        }}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-lg text-xs transition cursor-pointer"
                      >
                        Copy Design Style
                      </button>
                      <button
                        onClick={handleApplyJson}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                      >
                        Update Page Content
                      </button>
                    </div>
                  </div>

                  {zipSuccessMessage && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
                      <Check size={14} className="text-emerald-400" />
                      {zipSuccessMessage}
                    </div>
                  )}

                  <textarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className="flex-1 w-full bg-[#0A0A0C] border border-zinc-800 rounded-xl p-4 font-mono text-xs text-emerald-400 focus:outline-none focus:border-blue-500 resize-none min-h-[350px]"
                  />
                </div>
              )}

              {activeTab === 'export' && (
                <div className="p-8 h-full overflow-y-auto max-w-3xl mx-auto space-y-8">
                  {/* UPLOAD ZIP / ADAPT EXISTING WEBSITE TEMPLATE CARD */}
                  <div className="bg-[#0A0A0C] border border-emerald-500/30 rounded-2xl p-6 space-y-4 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 text-left">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                          ZIP Template Adapter
                        </span>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 mt-1">
                          <Upload size={16} className="text-emerald-400" />
                          Upload Existing Website ZIP
                        </h4>
                        <p className="text-xs text-zinc-400 max-w-lg">
                          Upload a saved website <strong className="text-zinc-200">.zip archive</strong> or <strong className="text-zinc-200">HTML template</strong>. We will keep the layout, styles, and images, and automatically adapt all business contact details (name, phone, email, address, city) for <strong className="text-emerald-300">{companyName}</strong>.
                        </p>
                      </div>
                      <label className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition shrink-0">
                        {uploadingZip ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Adapting ZIP...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            <span>Upload ZIP / HTML</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept=".zip,.html"
                          onChange={handleZipUpload}
                          disabled={uploadingZip}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {zipSuccessMessage && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
                        <Check size={14} className="text-emerald-400" />
                        {zipSuccessMessage}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Share2 size={16} className="text-blue-400" />
                      Export Payload via Webhook / REST API
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Push the structured JSON copy along with the standalone, fully-compiled HTML payload to your CRM, automation flow (Zapier/Make), or external server.
                    </p>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-300">Webhook / CRM Endpoint URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://your-crm.com/api/webhook"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          className="flex-1 bg-[#141418] border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={handleExportWebhook}
                          disabled={exporting || !siteData}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
                        >
                          {exporting ? 'Sending...' : 'Trigger Export'}
                        </button>
                      </div>
                      {exportSuccess && (
                        <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-1">
                          <Check size={12} /> Site export payload successfully sent!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* NETLIFY DIRECT DEPLOYMENT INTEGRATION CARD */}
                  <div className="bg-gradient-to-br from-[#0D0F17] to-[#0A0A0E] border border-cyan-500/40 rounded-2xl p-6 space-y-4 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500/20 border-b border-l border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                      Netlify Live Host Engine
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-lg">
                        ⚡
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-2 font-heading">
                          Netlify 1-Click Site Deployment
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Uploads & deploys the full website ZIP package live on Netlify so you have a real, ready link for WhatsApp & Cold Email outreach!
                        </p>
                      </div>
                    </div>

                    {/* Netlify Token Field */}
                    <div className="p-3 bg-[#12141F] border border-zinc-800 rounded-xl space-y-1.5">
                      <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                        <span>Netlify Personal Access Token (Optional for Auto-Deploy)</span>
                        <a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline text-[10px]">Get Netlify Token ↗</a>
                      </label>
                      <input
                        type="password"
                        placeholder="Paste nfp_... token or leave empty for Netlify Drop package link"
                        value={netlifyToken}
                        onChange={(e) => setNetlifyToken(e.target.value)}
                        className="w-full bg-[#0A0A0E] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleDeployToNetlify}
                        disabled={deployingNetlify || (!siteData?.html && !siteData?.content)}
                        className="flex-1 py-3 px-5 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition"
                      >
                        <Globe size={15} />
                        {deployingNetlify ? 'Deploying ZIP to Netlify...' : '🚀 Deploy Website Live to Netlify'}
                      </button>

                      {siteData?.previewUrl && (
                        <button
                          onClick={handleShareToWhatsApp}
                          className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition"
                          title="Share directly via WhatsApp"
                        >
                          <MessageSquare size={15} /> WhatsApp Outreach
                        </button>
                      )}
                    </div>

                    {/* Netlify Deploy Result Notice */}
                    {netlifyDeployResult && (
                      <div className="p-4 bg-cyan-950/40 border border-cyan-500/50 rounded-xl space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                            <Check size={14} className="text-cyan-400" />
                            {netlifyDeployResult.message || 'Website Live on Netlify!'}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">{netlifyDeployResult.siteName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={netlifyDeployResult.url}
                            className="flex-1 bg-[#090C14] border border-cyan-500/30 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono select-all focus:outline-none"
                          />
                          <a
                            href={netlifyDeployResult.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1 transition"
                          >
                            Open <ExternalLink size={12} />
                          </a>
                        </div>

                        {netlifyDeployResult.adminUrl && (
                          <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-1">
                            <span>Manage site or drag ZIP package:</span>
                            <a href={netlifyDeployResult.adminUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Netlify Admin Dashboard ↗</a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* LIVE LINK SHARING */}
                  <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-6 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe size={16} className="text-emerald-400" />
                      Live Pitch Preview Link
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Share this live hosted link directly with the business prospect in your cold outreach emails or WhatsApp messages.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={siteData?.previewUrl || lead.deployedWebsiteUrl || ''}
                        className="flex-1 bg-[#141418] border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-300 font-mono select-all focus:outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-xs transition"
                      >
                        {copiedLink ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="p-8 h-full overflow-y-auto max-w-5xl mx-auto space-y-8">
                  
                  {/* ACTIVE WEBSITE IMAGE MAP */}
                  {siteData?.content && (
                    <div className="bg-[#0A0A0C] border border-amber-500/30 rounded-2xl p-5 space-y-3 text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Star size={14} /> Active Live Site Image Assignments
                          </h4>
                        </div>
                        <span className="text-[11px] text-zinc-400">Where each picture is rendered on the website</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {/* HERO SLOT */}
                        <div className="bg-[#121217] border border-amber-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Hero Banner</span>
                            <Star size={10} className="text-amber-400 fill-amber-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.heroImage ? (
                              <img src={siteData.content.heroImage} alt="Hero" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Auto Default</div>
                            )}
                          </div>
                        </div>

                        {/* ABOUT SLOT */}
                        <div className="bg-[#121217] border border-blue-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-blue-300 uppercase tracking-wider flex items-center justify-between">
                            <span>About Section</span>
                            <Globe size={10} className="text-blue-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.aboutImage ? (
                              <img src={siteData.content.aboutImage} alt="About" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">No Image Set</div>
                            )}
                          </div>
                        </div>

                        {/* SERVICES SLOTS */}
                        {siteData.content.services?.slice(0, 4).map((srv: any, idx: number) => (
                          <div key={`act-srv-${idx}`} className="bg-[#121217] border border-emerald-500/30 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider truncate" title={srv.title}>
                              Srv: {srv.title || `#${idx + 1}`}
                            </div>
                            <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                              {srv.image ? (
                                <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Stock Image</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SCRAPE GOOGLE MAPS PHOTOS CARD */}
                  <div className="bg-[#0A0A0C] border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                          Google Maps Deep Extractor
                        </span>
                        <span className="text-zinc-500 text-xs">• {companyName}</span>
                      </div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Globe size={18} className="text-blue-400" />
                        Deep Scrape All Google Maps Photos
                      </h4>
                      <p className="text-xs text-zinc-400 max-w-xl">
                        Opens the Google Maps business gallery modal, scrolls the photo stream, and extracts high-res interior, exterior, menu, and product photos for <strong>{companyName}</strong>.
                      </p>
                    </div>

                    <button
                      onClick={handleScrapeGooglePhotos}
                      disabled={scrapingPhotos}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 shrink-0 transition disabled:opacity-50 cursor-pointer"
                    >
                      {scrapingPhotos ? (
                        <>
                          <RefreshCw size={15} className="animate-spin text-white" />
                          <span>Scraping All Google Photos...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} className="text-blue-200" />
                          <span>Scrape All Google Photos</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* PINTEREST & WEB AESTHETIC PHOTO RESEARCH */}
                  <div className="bg-[#0A0A0C] border border-purple-500/30 rounded-2xl p-6 space-y-4 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider">
                            Pinterest & Web Visual Research
                          </span>
                          <span className="text-zinc-500 text-xs">• High-Res Aesthetic Photos</span>
                        </div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <Search size={18} className="text-purple-400" />
                          Search Pinterest & Web Photos for {companyName}
                        </h4>
                        <p className="text-xs text-zinc-400 max-w-xl">
                          Search royalty-free aesthetic photos from Pinterest & Unsplash. Type any custom topic or select a quick preset.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={researchQuery}
                          onChange={(e) => setResearchQuery(e.target.value)}
                          placeholder="Search photo topic..."
                          className="px-3.5 py-2.5 bg-[#121216] border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 w-64"
                          onKeyDown={(e) => e.key === 'Enter' && handleResearchPhotos()}
                        />
                        <button
                          onClick={() => handleResearchPhotos()}
                          disabled={researchingPhotos}
                          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2 shrink-0 transition disabled:opacity-50 cursor-pointer"
                        >
                          {researchingPhotos ? (
                            <RefreshCw size={14} className="animate-spin text-white" />
                          ) : (
                            <Search size={14} />
                          )}
                          <span>Search</span>
                        </button>
                      </div>
                    </div>

                    {/* PRESET TAGS */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/80">
                      <span className="text-[11px] text-zinc-400 font-semibold mr-1">Quick Niche Presets:</span>
                      <button
                        onClick={() => { const q = `${companyName} restaurant gastronomique plat gourmet`; setResearchQuery(q); handleResearchPhotos(q); }}
                        className="px-2.5 py-1 bg-[#16161D] hover:bg-purple-950/60 text-purple-300 border border-purple-500/20 rounded-lg text-[11px] transition cursor-pointer"
                      >
                        🍷 Resto Gourmet
                      </button>
                      <button
                        onClick={() => { const q = `${companyName} traiteur buffet cocktail prestige`; setResearchQuery(q); handleResearchPhotos(q); }}
                        className="px-2.5 py-1 bg-[#16161D] hover:bg-purple-950/60 text-purple-300 border border-purple-500/20 rounded-lg text-[11px] transition cursor-pointer"
                      >
                        🍽️ Traiteur Buffet
                      </button>
                      <button
                        onClick={() => { const q = `${companyName} agence immobiliere villa moderne luxe`; setResearchQuery(q); handleResearchPhotos(q); }}
                        className="px-2.5 py-1 bg-[#16161D] hover:bg-purple-950/60 text-purple-300 border border-purple-500/20 rounded-lg text-[11px] transition cursor-pointer"
                      >
                        👑 Villa Luxe
                      </button>
                      <button
                        onClick={() => { const q = `${companyName} renovation salle de bain cuisine contemporaine`; setResearchQuery(q); handleResearchPhotos(q); }}
                        className="px-2.5 py-1 bg-[#16161D] hover:bg-purple-950/60 text-purple-300 border border-purple-500/20 rounded-lg text-[11px] transition cursor-pointer"
                      >
                        🏠 Rénovation Intérieur
                      </button>
                      <button
                        onClick={() => { const q = `${companyName} salon coiffure esthetique spa massage`; setResearchQuery(q); handleResearchPhotos(q); }}
                        className="px-2.5 py-1 bg-[#16161D] hover:bg-purple-950/60 text-purple-300 border border-purple-500/20 rounded-lg text-[11px] transition cursor-pointer"
                      >
                        💇 Salon Beauté & Spa
                      </button>
                    </div>
                  </div>

                  {/* UPLOAD HEADER DROPZONE */}
                  <div className="bg-[#0A0A0C] border-2 border-dashed border-zinc-700 hover:border-amber-500 rounded-2xl p-6 text-center transition flex flex-col items-center justify-center space-y-2 relative group">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Upload size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Upload Custom Photos for {companyName}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">PNG, JPG, WEBP accepted. Drag and drop or browse files.</p>
                    </div>
                    <label className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-lg shadow cursor-pointer transition">
                      Browse Files
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  {/* RESEARCHED PINTEREST / WEB PHOTOS SECTION */}
                  {researchedPhotosList.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                        <Search size={14} />
                        Pinterest & Web Researched Photos ({researchedPhotosList.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {researchedPhotosList.map((photoUrl, idx) => (
                          <div key={idx} className="relative rounded-xl border border-purple-500/30 bg-[#0A0A0C] overflow-visible group hover:border-purple-400/60 transition shadow-lg flex flex-col z-10 hover:z-30">
                            <div className="relative aspect-video rounded-t-xl overflow-hidden bg-black/60">
                              <img src={photoUrl} alt={`Researched ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerpolicy="no-referrer" />
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-purple-300 text-[10px] font-bold border border-purple-500/30 shadow">
                                Pinterest #{idx + 1}
                              </div>
                            </div>
                            <div className="p-2 bg-[#121217] rounded-b-xl border-t border-zinc-800 flex items-center justify-between gap-2 overflow-visible">
                              <span className="text-[10px] font-semibold text-purple-300 truncate">Photo #{idx + 1}</span>
                              {renderPlacementSelector(photoUrl)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* USER UPLOADED IMAGES SECTION */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                        <Upload size={14} className="text-amber-400" />
                        Uploaded Photos ({uploadedImages.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedImages.map((imgUrl, idx) => (
                          <div key={idx} className="relative rounded-xl border border-zinc-800 bg-[#0A0A0C] overflow-visible group hover:border-amber-500/50 transition shadow-lg flex flex-col z-10 hover:z-30">
                            <div className="relative aspect-video rounded-t-xl overflow-hidden bg-black/60">
                              <img src={imgUrl} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-amber-400 text-[10px] font-bold border border-amber-500/30 shadow">
                                Upload #{idx + 1}
                              </div>
                            </div>
                            <div className="p-2 bg-[#121217] rounded-b-xl border-t border-zinc-800 flex items-center justify-between gap-2 overflow-visible">
                              <button
                                onClick={() => handleDeleteUploadedImage(idx)}
                                className="p-1 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-md border border-red-800/40 transition shrink-0"
                                title="Delete Image"
                              >
                                <Trash2 size={12} />
                              </button>
                              {renderPlacementSelector(imgUrl)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SCRAPED GOOGLE MAPS PHOTOS SECTION */}
                  {(scrapedPhotosList.length > 0 || (lead.photos && lead.photos.length > 0)) && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                        <Image size={14} className="text-blue-400" />
                        Google Maps Photos ({scrapedPhotosList.length || lead.photos?.length || 0})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {(scrapedPhotosList.length > 0 ? scrapedPhotosList : lead.photos || []).map((photoUrl: string, idx: number) => (
                          <div key={idx} className="relative rounded-xl border border-zinc-800 bg-[#0A0A0C] overflow-visible group hover:border-blue-500/50 transition shadow-lg flex flex-col z-10 hover:z-30">
                            <div className="relative aspect-video rounded-t-xl overflow-hidden bg-black/60">
                              <img src={photoUrl} alt={`Scraped ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerpolicy="no-referrer" />
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-blue-400 text-[10px] font-bold border border-blue-500/30 shadow">
                                Maps #{idx + 1}
                              </div>
                            </div>
                            <div className="p-2 bg-[#121217] rounded-b-xl border-t border-zinc-800 flex items-center justify-between gap-2 overflow-visible">
                              <span className="text-[10px] font-semibold text-blue-300 truncate">Photo #{idx + 1}</span>
                              {renderPlacementSelector(photoUrl)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'templates' && (
                <div className="p-8 h-full overflow-y-auto max-w-6xl mx-auto space-y-8 text-left">
                  <div className="bg-[#0A0A0C] border border-amber-500/30 rounded-2xl p-6 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
                          <Sparkles size={13} /> Behance Curated Templates & Live URL Scraper
                        </div>
                        <h3 className="text-xl font-black text-white font-heading">
                          High-End Website Designs Inspired by Behance Portfolios
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-2xl">
                          Select any template to render a personalized website for <strong className="text-white">{lead.name || lead.companyName || 'this business'}</strong>, or paste any Behance gallery link below to scrape & generate a matching design!
                        </p>
                      </div>
                    </div>

                    {/* Live Behance URL Scraper Bar */}
                    <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="url"
                        placeholder="Paste any Behance Showcase URL (e.g. https://www.behance.net/gallery/253285809/...)"
                        value={behanceImportUrl}
                        onChange={(e) => setBehanceImportUrl(e.target.value)}
                        className="flex-1 w-full bg-[#18181B] border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => handleScrapeBehanceAssets()}
                        disabled={importingBehance || !behanceImportUrl}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Search size={13} /> {importingBehance ? 'Scraping Assets...' : 'Scrape & Inspect Images'}
                      </button>
                    </div>

                    {/* Scraped Assets & Design Inspector Modal/Panel */}
                    {scrapedBehanceData && (
                      <div className="mt-6 p-6 bg-[#121218] border border-amber-500/40 rounded-2xl space-y-4 animate-fadeIn">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                              {scrapedBehanceData.category}
                            </span>
                            <h4 className="text-base font-black text-white mt-1">{scrapedBehanceData.title}</h4>
                            <p className="text-xs text-zinc-400">
                              Extracted {scrapedBehanceData.images.length} high-resolution project images & design components from Behance.
                            </p>
                          </div>
                          <button
                            onClick={() => setScrapedBehanceData(null)}
                            className="text-zinc-400 hover:text-white text-xs underline cursor-pointer self-start sm:self-center"
                          >
                            Close Inspector
                          </button>
                        </div>

                        {/* Image Gallery Grid with Selection Checkboxes */}
                        <div>
                          <p className="text-xs font-bold text-zinc-300 mb-2 flex items-center justify-between">
                            <span>📸 Extracted Design Images & Mockups ({selectedScrapedImages.length} selected):</span>
                            <span className="text-[11px] text-amber-400 font-normal">Click images to include or exclude from live website</span>
                          </p>

                          {scrapedBehanceData.images.length === 0 ? (
                            <p className="text-xs text-zinc-500 italic">No image assets extracted directly. You can still generate matching styling.</p>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
                              {scrapedBehanceData.images.map((imgUrl, idx) => {
                                const isSelected = selectedScrapedImages.includes(imgUrl);
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedScrapedImages(selectedScrapedImages.filter(u => u !== imgUrl));
                                      } else {
                                        setSelectedScrapedImages([...selectedScrapedImages, imgUrl]);
                                      }
                                    }}
                                    className={`relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition group ${isSelected ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-zinc-800 opacity-60 hover:opacity-100'}`}
                                  >
                                    <img src={imgUrl} alt={`Behance asset ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isSelected ? 'bg-amber-500 text-black' : 'bg-black/80 text-zinc-400 border border-zinc-600'}`}>
                                      {isSelected ? '✓' : ''}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                          <button
                            onClick={handleGenerateFromScrapedAssets}
                            disabled={loading}
                            className="w-full sm:w-auto flex-1 py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
                          >
                            <Sparkles size={14} /> {loading ? 'Building Exact Website...' : '⚡ Generate Website With Extracted Images'}
                          </button>

                          {scrapedBehanceData.images.length > 0 && (
                            <button
                              onClick={() => handleVisionConvertDesign(scrapedBehanceData.images[0])}
                              disabled={loading}
                              className="w-full sm:w-auto py-3 px-5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-purple-600/30 border border-purple-400/30"
                            >
                              <Sparkles size={14} /> {loading ? 'Processing Vision...' : '👁️ Vision AI: Reconstruct HTML 1:1 From Mockup Image'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {BEHANCE_TEMPLATES_LIST.map((tmpl) => (
                      <div key={tmpl.id} className="bg-[#0D0D12] border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition duration-300 flex flex-col justify-between shadow-xl">
                        <div>
                          <div className="relative aspect-video overflow-hidden bg-black/60">
                            <img src={tmpl.thumbnail} alt={tmpl.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 text-[11px] font-extrabold border border-amber-500/30">
                              {tmpl.badge}
                            </div>
                            <a
                              href={tmpl.behanceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white text-[10px] font-bold border border-blue-400/40 flex items-center gap-1 shadow"
                            >
                              Behance Showcase <ExternalLink size={10} />
                            </a>
                          </div>

                          <div className="p-5 space-y-2">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">{tmpl.category}</span>
                            <h4 className="text-base font-extrabold text-white">{tmpl.name}</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">{tmpl.description}</p>
                          </div>
                        </div>

                        <div className="p-5 pt-0 space-y-2">
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                generateSiteForLead(lead, undefined, tmpl.id);
                                setActiveTab('preview');
                              }}
                              className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                            >
                              <Globe size={13} /> Apply & Preview
                            </button>

                            <button
                              onClick={() => handleDownloadTemplateZip(tmpl.id, tmpl.name)}
                              disabled={downloadingTemplateId === tmpl.id}
                              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                            >
                              <Download size={13} />
                              {downloadingTemplateId === tmpl.id ? 'Packaging...' : 'Download ZIP'}
                            </button>
                          </div>

                          <button
                            onClick={() => handleScrapeBehanceAssets(tmpl.behanceUrl)}
                            disabled={importingBehance}
                            className="w-full py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer border border-zinc-700"
                          >
                            <Search size={12} /> Inspect Scraped Design Images First
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
