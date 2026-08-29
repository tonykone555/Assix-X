import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Download, Share2, Globe, RefreshCw, Code, Check, ExternalLink, Play, Pause, ChevronsLeftRight, Languages, Image, Upload, Trash2, Wand2, Search, Star, MessageSquare, Monitor, Tablet, Smartphone, Maximize2, Zap, MapPin, Award, Sliders, CheckCircle2, Compass, Mail, Linkedin, MessageCircle, Phone, BookOpen, Video, Palette, Eye, Pencil, ShieldCheck, Sun, Moon, Box, Rocket, User, Plus, FileSpreadsheet, FileText, Layers, FileDown, Building, Edit3, Clock, Square, Send } from 'lucide-react';
import Papa from 'papaparse';
import JSZip from 'jszip';

export const COLOR_PALETTES = [
  { id: 'gold', name: '👑 Amber Gold (Luxury)', hex: '#F59E0B', glow: 'rgba(245, 158, 11, 0.25)', bg: '#050507' },
  { id: 'emerald', name: '🌿 Emerald Mint (Craft)', hex: '#10B981', glow: 'rgba(16, 185, 129, 0.25)', bg: '#040D0A' },
  { id: 'crimson', name: '⚡ Cyber Crimson (Speed)', hex: '#EF4444', glow: 'rgba(239, 68, 68, 0.25)', bg: '#0A0506' },
  { id: 'azure', name: '🔷 Royal Azure (Executive)', hex: '#3B82F6', glow: 'rgba(59, 130, 246, 0.25)', bg: '#050814' },
  { id: 'violet', name: '🔮 Violet Quartz (Luxury)', hex: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.25)', bg: '#080512' },
  { id: 'cyan', name: '💎 Cyan Arctic (Pristine)', hex: '#06B6D4', glow: 'rgba(6, 182, 212, 0.25)', bg: '#040B0E' },
  { id: 'cream', name: '🍦 Warm Cream (Minimalist)', hex: '#D97706', glow: 'rgba(217, 119, 6, 0.2)', bg: '#FAF9F5' },
  { id: 'slate', name: '🖤 Monochrome Slate', hex: '#E2E8F0', glow: 'rgba(226, 232, 240, 0.2)', bg: '#090A0F' },
];

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
  const [activeTab, setActiveTab] = useState<'preview' | 'schema' | 'export' | 'media' | 'templates' | 'gif' | 'trust' | '3d-studio' | 'template-maker' | 'deploy-outreach' | 'scroll-video' | 'transparent-slider' | 'csv-bulk-generator'>('preview');

  // CSV Bulk Website Generator State
  interface CsvLeadRow {
    id: string;
    businessName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    niche: string;
    website?: string;
    lang?: string;
    market?: string;
    status: 'pending' | 'generating' | 'completed' | 'error';
    generatedTime?: string;
    html?: string;
    errorMessage?: string;
    deployStatus?: 'idle' | 'deploying' | 'deployed' | 'error';
    netlifyUrl?: string;
    netlifySiteName?: string;
  }

  const [csvLeads, setCsvLeads] = useState<CsvLeadRow[]>([]);
  const [selectedBulkTemplate, setSelectedBulkTemplate] = useState<string>('outlandHomes');
  const [selectedBulkLang, setSelectedBulkLang] = useState<string>('auto');
  const [rawTextModalOpen, setRawTextModalOpen] = useState<boolean>(false);
  const [rawTextContent, setRawTextContent] = useState<string>('');
  const [isAnalyzingText, setIsAnalyzingText] = useState<boolean>(false);
  const [waBulkDelay, setWaBulkDelay] = useState<number>(15);
  const [waBulkMessage, setWaBulkMessage] = useState<string>('Bonjour {businessName}, nous avons préparé un aperçu de site web personnalisé pour votre activité à {city} : {siteUrl}');
  const [isWaBulkSending, setIsWaBulkSending] = useState<boolean>(false);
  const [waBulkLogs, setWaBulkLogs] = useState<string[]>([]);
  const [isBulkGenerating, setIsBulkGenerating] = useState<boolean>(false);
  const stopBulkGenerationRef = useRef<boolean>(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [isBulkDeployingNetlify, setIsBulkDeployingNetlify] = useState<boolean>(false);
  const [bulkDeployProgress, setBulkDeployProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [previewModalHtml, setPreviewModalHtml] = useState<string | null>(null);
  const [previewModalTitle, setPreviewModalTitle] = useState<string>('');
  const [generatingGif, setGeneratingGif] = useState(false);
  const [gifScrollMode, setGifScrollMode] = useState<boolean>(true);
  
  const [customGifUrlInput, setCustomGifUrlInput] = useState('');
  const handleGenerateCustomGif = async () => {
    if (!customGifUrlInput) return;
    setGeneratingGif(true);
    setGifError(null);
    try {
      const urlboxGif = `/api/urlbox/gif?url=${encodeURIComponent(customGifUrlInput)}&refresh=true&scroll=${gifScrollMode === 'scroll'}`;
      setGifUrl(`${urlboxGif}&t=${Date.now()}`);
    } catch (err: any) {
      setGifError(err.message || 'Error generating GIF');
    } finally {
      setGeneratingGif(false);
    }
  };
  
  const [generatingReviews, setGeneratingReviews] = useState(false);
  const [nicheReviews, setNicheReviews] = useState<any[]>([]);
  
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifError, setGifError] = useState<string | null>(null);
  const [copiedGifCode, setCopiedGifCode] = useState(false);
  const [copiedGifUrl, setCopiedGifUrl] = useState(false);
  const [outreachStyle, setOutreachStyle] = useState<'standard' | 'short'>('standard');
  
  // Outreach Mode & Dentist Smile Simulator states
  const [outreachMode, setOutreachMode] = useState<'website' | 'dentist'>('website');
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'whatsapp' | 'linkedin' | 'coldcall'>('email');
  
  // Dentist Veneers Smile Simulator States
  const [dentistActiveModel, setDentistActiveModel] = useState<'sophia' | 'marcus' | 'emily' | 'custom'>('sophia');
  const [dentistSliderPos, setDentistSliderPos] = useState<number>(50);
  const [dentistIsUploading, setDentistIsUploading] = useState<boolean>(false);
  const [dentistVeneerShade, setDentistVeneerShade] = useState<'BL1' | 'B1' | 'A1'>('BL1');
  const [dentistVeneerShape, setDentistVeneerShape] = useState<'hollywood' | 'natural' | 'oval' | 'youthful'>('hollywood');
  const [dentistAutoPlay, setDentistAutoPlay] = useState<boolean>(true);
  const [dentistUploadedImage, setDentistUploadedImage] = useState<string | null>(null);
  
  // Google Capture and Trust States
  const [googleScreenshotUrl, setGoogleScreenshotUrl] = useState<string | null>(null);
  const [capturingGoogle, setCapturingGoogle] = useState(false);
  const [googleCaptureError, setGoogleCaptureError] = useState<string | null>(null);
  const [googleSearchType, setGoogleSearchType] = useState<'search' | 'maps'>('maps');
  
  // Dynamic Badge States
  const [badgeNiche, setBadgeNiche] = useState(lead?.sector || lead?.source || 'Services');
  const [badgeRating, setBadgeRating] = useState(lead?.rating ? String(lead.rating) : '4.8');
  const [badgeReviewsCount, setBadgeReviewsCount] = useState(lead?.reviewsCount ? String(lead.reviewsCount) : '24');
  const [badgeCity, setBadgeCity] = useState(lead?.city || lead?.cityPhrase || 'votre région');
  const [customBadgeText, setCustomBadgeText] = useState('Service Client 5 Étoiles');

  // Dynamic Reviews List
  const [reviewsList, setReviewsList] = useState<Array<{ name: string; text: string; stars: number; date: string; logoUrl?: string }>>([]);

  const [downloadingTemplateId, setDownloadingTemplateId] = useState<string | null>(null);
  const [behanceImportUrl, setBehanceImportUrl] = useState('');
  const [importingBehance, setImportingBehance] = useState(false);

  // Template Maker States
  const [templateMakerImages, setTemplateMakerImages] = useState<string[]>([]);
  const [templateMakerHtml, setTemplateMakerHtml] = useState<string | null>(null);
  const [templateMakerGenerating, setTemplateMakerGenerating] = useState(false);
  const [templateMakerChat, setTemplateMakerChat] = useState<{role: string, text: string}[]>([]);
  const [templateMakerChatInput, setTemplateMakerChatInput] = useState('');

  const [scrapedBehanceData, setScrapedBehanceData] = useState<{
    url: string;
    title: string;
    description: string;
    category: string;
    templateStyle: string;
    images: string[];
  } | null>(null);
  const [selectedScrapedImages, setSelectedScrapedImages] = useState<string[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Device Viewport Mode State for Translucent Website Frame
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Behance Multi-Portfolio Search & Research Engine States
  const [behanceSearchQuery, setBehanceSearchQuery] = useState(() => {
    const company = lead?.name || lead?.companyName || lead?.businessName || '';
    const sector = lead?.sector || lead?.source || 'website design';
    return `${company} ${sector} website design`.trim();
  });
  const [behanceSearchResults, setBehanceSearchResults] = useState<Array<{
    id: string;
    title: string;
    behanceUrl: string;
    ownerName: string;
    ownerAvatar?: string;
    coverImage: string;
    screenshots: string[];
    views?: number;
    appreciations?: number;
    category?: string;
    tags?: string[];
  }>>([]);
  const [searchingBehance, setSearchingBehance] = useState(false);
  const [expandedPortfolioId, setExpandedPortfolioId] = useState<string | null>(null);

  // Transparent PNG Slider & AI Background Removal States
  const [sliderCategory, setSliderCategory] = useState<'plates' | 'cars' | 'motorcycles' | 'houses' | 'tech' | 'custom'>('plates');
  const [sliderSpeed, setSliderSpeed] = useState<number>(20);
  const [sliderDirection, setSliderDirection] = useState<'left' | 'right'>('left');
  const [sliderItemScale, setSliderItemScale] = useState<number>(180);
  const [sliderItemGap, setSliderItemGap] = useState<number>(32);
  const [sliderEnableRotate, setSliderEnableRotate] = useState<boolean>(true);
  const [sliderEnableShadow, setSliderEnableShadow] = useState<boolean>(true);
  const [sliderEnable3dTilt, setSliderEnable3dTilt] = useState<boolean>(true);
  const [sliderThemeBg, setSliderThemeBg] = useState<'dark' | 'light' | 'gold' | 'cyber'>('dark');

  // Custom Uploads & Background Remover Studio States
  const [customCutoutItems, setCustomCutoutItems] = useState<Array<{ id: string; title: string; subtitle?: string; url: string; desc?: string }>>([]);
  const [bgRemoveImageInput, setBgRemoveImageInput] = useState<string>('');
  const [bgRemoveThreshold, setBgRemoveThreshold] = useState<number>(35);
  const [bgRemoveFeather, setBgRemoveFeather] = useState<number>(2);
  const [bgRemoveResultUrl, setBgRemoveResultUrl] = useState<string | null>(null);
  const [processingBgRemoval, setProcessingBgRemoval] = useState<boolean>(false);
  const [bgRemoveItemName, setBgRemoveItemName] = useState<string>('');
  const [copiedSliderEmbed, setCopiedSliderEmbed] = useState<boolean>(false);

  // Multi-Image Upload & Stock Search States for Transparent Slider
  const [sliderSearchQuery, setSliderSearchQuery] = useState<string>('');
  const [sliderSearchResults, setSliderSearchResults] = useState<Array<{ id: string; url: string; title: string }>>([]);
  const [searchingSliderPhotos, setSearchingSliderPhotos] = useState<boolean>(false);
  const [selectedSliderPhotoUrls, setSelectedSliderPhotoUrls] = useState<string[]>([]);
  const [batchBgRemoveFiles, setBatchBgRemoveFiles] = useState<File[]>([]);
  const [isBatchProcessingBg, setIsBatchProcessingBg] = useState<boolean>(false);
  const [multiUploadSuccessMsg, setMultiUploadSuccessMsg] = useState<string | null>(null);

  // Helper to sync custom removed-background cutouts directly to active website siteData & preview iframe
  const syncCustomCutoutsToSite = async (newItems: any[]) => {
    if (!siteData) return;
    try {
      const config = {
        category: 'custom',
        speed: sliderSpeed,
        direction: sliderDirection,
        itemScale: sliderItemScale,
        itemGap: sliderItemGap,
        enableRotate: sliderEnableRotate,
        enableShadow: sliderEnableShadow,
        enable3dTilt: sliderEnable3dTilt,
        themeBg: sliderThemeBg,
        items: newItems
      };

      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'UPDATE_TRANSPARENT_SLIDER',
          transparentSlider: config,
          customCutoutItems: newItems
        }, '*');
      }

      const res = await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          directContent: { transparentSlider: config, customCutoutItems: newItems },
          lead
        })
      });
      const data = await res.json();
      if (data.success) {
        setSiteData(data);
      }
    } catch (e) {
      console.error('Failed to sync custom cutouts to site:', e);
    }
  };

  // Handler to upload multiple pre-cropped files directly
  const handleMultipleCutoutFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    let loadedCount = 0;
    const newCutoutItems: Array<{ id: string; title: string; subtitle?: string; url: string; desc?: string }> = [];

    fileList.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const title = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          newCutoutItems.push({
            id: `custom_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 4)}`,
            title: title.charAt(0).toUpperCase() + title.slice(1),
            subtitle: 'Pre-Cropped Image',
            url: ev.target.result as string,
            desc: 'User uploaded image'
          });
        }
        loadedCount++;
        if (loadedCount === fileList.length) {
          setCustomCutoutItems(prev => {
            const updated = [...newCutoutItems, ...prev];
            syncCustomCutoutsToSite(updated);
            return updated;
          });
          setSliderCategory('custom');
          setMultiUploadSuccessMsg(`✨ Successfully added ${newCutoutItems.length} uploaded images to your transparent slider!`);
          setTimeout(() => setMultiUploadSuccessMsg(null), 4000);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const processBgRemovalForUrl = (imgUrl: string, thresh = 35, feather = 2): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgUrl;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(imgUrl);

          canvas.width = img.naturalWidth || img.width || 800;
          canvas.height = img.naturalHeight || img.height || 600;

          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          let totalR = 0, totalG = 0, totalB = 0, count = 0;
          for (let y = 0; y < Math.min(20, canvas.height); y++) {
            for (let x = 0; x < Math.min(20, canvas.width); x++) {
              const idx = (y * canvas.width + x) * 4;
              totalR += data[idx];
              totalG += data[idx + 1];
              totalB += data[idx + 2];
              count++;
            }
          }
          const bgR = count ? totalR / count : 255;
          const bgG = count ? totalG / count : 255;
          const bgB = count ? totalB / count : 255;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const dist = Math.sqrt(
              (r - bgR) * (r - bgR) +
              (g - bgG) * (g - bgG) +
              (b - bgB) * (b - bgB)
            );
            const bright = (r + g + b) / 3;

            if (dist < thresh || (bgR > 210 && bright > (255 - thresh * 0.85))) {
              if (dist < Math.max(0, thresh - feather * 5)) {
                data[i + 3] = 0;
              } else {
                const alpha = Math.max(0, Math.min(255, ((dist - (thresh - feather * 5)) / (feather * 5)) * 255));
                data[i + 3] = alpha;
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch (err) {
          console.error('BG removal error, returning original:', err);
          resolve(imgUrl);
        }
      };
      img.onerror = () => resolve(imgUrl);
    });
  };

  const handleRemoveBgAndAddSelectedToSlider = async () => {
    if (selectedSliderPhotoUrls.length === 0) return;
    setIsBatchProcessingBg(true);

    const newItems: Array<{ id: string; title: string; subtitle?: string; url: string }> = [];

    for (let i = 0; i < selectedSliderPhotoUrls.length; i++) {
      const photoUrl = selectedSliderPhotoUrls[i];
      try {
        const transparentPngUrl = await processBgRemovalForUrl(photoUrl, bgRemoveThreshold, bgRemoveFeather);
        const foundItem = sliderSearchResults.find(r => r.url === photoUrl);
        newItems.push({
          id: `cutout-bgrem-${Date.now()}-${i}`,
          title: foundItem?.title || `Cutout Item ${customCutoutItems.length + i + 1}`,
          subtitle: 'Transparent Cutout',
          url: transparentPngUrl
        });
      } catch (err) {
        console.error(`Failed to process photo ${i}:`, err);
      }
    }

    if (newItems.length > 0) {
      setCustomCutoutItems(prev => {
        const updated = [...prev, ...newItems];
        syncCustomCutoutsToSite(updated);
        return updated;
      });
      setSliderCategory('custom');
      setSelectedSliderPhotoUrls([]);
      setMultiUploadSuccessMsg(`✨ Successfully removed background from ${newItems.length} pictures and added to slider collection!`);
      setTimeout(() => setMultiUploadSuccessMsg(null), 4000);
    }
    setIsBatchProcessingBg(false);
  };

  // Search stock pictures for multi-selection
  const handleSearchSliderPhotos = async (term?: string) => {
    const query = term || sliderSearchQuery || 'luxury products cutout';
    if (!query.trim()) return;
    setSearchingSliderPhotos(true);
    try {
      const res = await fetch('/api/leads/research-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, count: 18 })
      });
      const data = await res.json();
      const urls: string[] = data.photoUrls || (data.results ? data.results.map((r: any) => r.url) : []);
      if (urls.length > 0) {
        setSliderSearchResults(urls.map((url, i) => ({
          id: `search_${i}_${Date.now()}`,
          url,
          title: `${query.charAt(0).toUpperCase() + query.slice(1)} ${i + 1}`
        })));
        setSelectedSliderPhotoUrls(urls);
      }
    } catch (err) {
      console.error('Error searching slider photos:', err);
    } finally {
      setSearchingSliderPhotos(false);
    }
  };

  const handleAddSelectedSearchPhotosToSlider = () => {
    if (selectedSliderPhotoUrls.length === 0) return;
    const newItems = selectedSliderPhotoUrls.map((url, i) => ({
      id: `custom_stock_${Date.now()}_${i}`,
      title: `${sliderSearchQuery ? sliderSearchQuery.charAt(0).toUpperCase() + sliderSearchQuery.slice(1) : 'Stock Item'} ${i + 1}`,
      subtitle: 'Stock Photo',
      url
    }));
    setCustomCutoutItems(prev => [...newItems, ...prev]);
    setSliderCategory('custom');
    setMultiUploadSuccessMsg(`🎉 Added ${newItems.length} selected pictures to your transparent slider!`);
    setTimeout(() => setMultiUploadSuccessMsg(null), 4000);
  };

  const handleSearchBehance = async (queryToSearch?: string) => {
    const q = queryToSearch || behanceSearchQuery;
    if (!q || !q.trim()) return;
    setSearchingBehance(true);
    try {
      const res = await fetch('/api/behance/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          limit: 8
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.portfolios)) {
        setBehanceSearchResults(data.portfolios);
        if (data.portfolios.length > 0) {
          setExpandedPortfolioId(data.portfolios[0].id);
        }
      }
    } catch (err) {
      console.error('Behance search error:', err);
    } finally {
      setSearchingBehance(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'templates' && behanceSearchResults.length === 0) {
      handleSearchBehance();
    }
  }, [activeTab]);

  const BEHANCE_TEMPLATES_LIST = [
    {
      id: 'main-neumorphic',
      name: 'Main Neumorphic Cutout Template (Universal All-Niches)',
      behanceUrl: 'https://www.behance.net/gallery/main-neumorphic-universal-template',
      category: 'Universal Multi-Niche & Cutouts',
      badge: 'Main Template',
      thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop',
      description: 'Universal Neumorphic cutouts for all niches (restauration, electrician, plumbers, serrurier, caterer, landscaping, renovations, driving school), hero video, iPad tablet cutout, notebook & steering wheel, formula cards & modifiable niche images.'
    },
    {
      id: 'cinematic-luxury',
      name: 'Cinematic Luxury 3D Video Template',
      behanceUrl: 'https://www.behance.net/gallery/cinematic-luxury-video-landing',
      category: 'Luxury & Video Showcase',
      badge: '3D Video Master',
      thumbnail: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80&auto=format&fit=crop',
      description: 'Full-bleed 3D video hero background, bento grid showcase, translated catalogue & FAQ sections, glassmorphism contact form & company footer.'
    },
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
  const [uploadedModels, setUploadedModels] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [videoSearchSource, setVideoSearchSource] = useState('pexels');
  const [videoSearchPage, setVideoSearchPage] = useState(1);
  const [isSearchingVideos, setIsSearchingVideos] = useState(false);
  const [isLoadingMoreVideos, setIsLoadingMoreVideos] = useState(false);
  const [researchedVideosList, setResearchedVideosList] = useState<any[]>([]);
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGenerationSteps, setVideoGenerationSteps] = useState<string[]>([]);
  const [currentVideoGenerationStep, setCurrentVideoGenerationStep] = useState('');
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

  const [frameTheme, setFrameTheme] = useState<'dark' | 'light'>('dark');
  const [deployTarget, setDeployTarget] = useState<'netlify' | 'vercel' | 'zip'>('netlify');
  const [vercelToken, setVercelToken] = useState<string>(() => localStorage.getItem('VERCEL_AUTH_TOKEN') || '');
  const [deployingTarget, setDeployingTarget] = useState(false);
  const [deployStepText, setDeployStepText] = useState('');
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployResult, setDeployResult] = useState<{ url: string; siteName?: string; adminUrl?: string; message?: string; note?: string } | null>(null);
  const [autoSendEmail, setAutoSendEmail] = useState(false);
  const [includeGoogleBadgeInOutreach, setIncludeGoogleBadgeInOutreach] = useState(true);
  const [selectedBatchNiche, setSelectedBatchNiche] = useState('electrician');
  const [emailSentStatus, setEmailSentStatus] = useState<string | null>(null);

  const [heroVideoSearchQuery, setHeroVideoSearchQuery] = useState('');
  const [videoSearchResults, setVideoSearchResults] = useState<any[]>([]);
  const [searchingStockVideos, setSearchingStockVideos] = useState(false);
  const [selectedHeroVideoUrl, setSelectedHeroVideoUrl] = useState<string>(() => siteData?.content?.heroVideoUrl || siteData?.content?.heroVideo || 'https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4');
  const [heroVideoEffect, setHeroVideoEffect] = useState<'scroll-scrub' | 'sticky-zoom' | 'parallax-fade' | '3d-tilt' | 'autoplay'>(() => siteData?.content?.heroVideoEffect || 'scroll-scrub');
  const [heroScrollTiming, setHeroScrollTiming] = useState<number>(() => siteData?.content?.heroScrollTiming || 1.5);
  const [heroScrollSpeed, setHeroScrollSpeed] = useState<number>(() => siteData?.content?.heroScrollSpeed || 1.0);
  const [heroScrollDamping, setHeroScrollDamping] = useState<number>(() => siteData?.content?.heroScrollDamping || 0.1);
  const [heroScrollOpacity, setHeroScrollOpacity] = useState<number>(() => siteData?.content?.heroScrollOpacity || 0.4);
  const [scrubPreviewPos, setScrubPreviewPos] = useState<number>(0);
  const [videoApplyMsg, setVideoApplyMsg] = useState<string | null>(null);

  const [savedCatalogVideoAnimations, setSavedCatalogVideoAnimations] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('nesta_saved_scroll_videos');
      return raw ? JSON.parse(raw) : [
        {
          id: 'preset-1',
          title: 'Renovation 4K Frame Scrub',
          desc: 'Interactive 4K frame scrubbing animation for luxury interior & renovation showcase',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4',
          mode: 'scroll-scrub',
          timing: 1.5,
          features: ['60FPS Frame Scrubbing', 'Ultra HD Stock Video', 'Responsive Hero Mask'],
          date: new Date().toISOString()
        },
        {
          id: 'preset-2',
          title: 'Master Electrician Precision Sync',
          desc: 'Smooth sticky zoom effect as user scrolls into technical electrical installation details',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-fixing-wires-42175-large.mp4',
          mode: 'sticky-zoom',
          timing: 2.0,
          features: ['Sticky Zoom Depth', 'Dynamic Blur Filter', 'Pro Technical Feel'],
          date: new Date().toISOString()
        },
        {
          id: 'preset-3',
          title: 'Luxury Realtor Walkthrough',
          desc: 'Parallax depth video effect revealing property specs on page scroll',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-realtor-presenting-a-modern-apartment-43033-large.mp4',
          mode: 'parallax-fade',
          timing: 1.2,
          features: ['Parallax Fade', '4K Realtor Walkthrough', 'High-Converting Hero'],
          date: new Date().toISOString()
        }
      ];
    } catch (e) { return []; }
  });

  const handleSearchStockVideos = async (queryTerm?: string) => {
    const term = queryTerm || heroVideoSearchQuery || lead?.name || lead?.niche || 'renovation';
    setSearchingStockVideos(true);
    try {
      const res = await fetch('/api/leads/research-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: term })
      });
      const data = await res.json();
      if (data.videos && Array.isArray(data.videos)) {
        setVideoSearchResults(data.videos);
      }
    } catch (err) {
      console.error('Error searching stock videos:', err);
    } finally {
      setSearchingStockVideos(false);
    }
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setSelectedHeroVideoUrl(fileUrl);
      setVideoApplyMsg(`Uploaded custom video "${file.name}" ready for scroll animation!`);
      setTimeout(() => setVideoApplyMsg(null), 3000);
    }
  };

  const handleApplyHeroScrollVideo = async () => {
    if (!siteData) return;
    setLoading(true);
    try {
      const updatedContent = {
        ...siteData.content,
        heroVideo: selectedHeroVideoUrl,
        heroVideoUrl: selectedHeroVideoUrl,
        heroVideoEffect,
        heroScrollTiming,
        heroScrollSpeed,
        heroScrollDamping,
        heroScrollOpacity
      };

      setSiteData({ ...siteData, content: updatedContent });

      // Post message live to preview iframe
      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'UPDATE_VIDEO',
          url: selectedHeroVideoUrl,
          videoUrl: selectedHeroVideoUrl,
          heroVideo: selectedHeroVideoUrl,
          heroVideoUrl: selectedHeroVideoUrl,
          heroVideoEffect,
          heroScrollTiming,
          heroScrollOpacity
        }, '*');
      }

      const res = await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          directContent: updatedContent,
          lead
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.site) setSiteData(data.site);
        setVideoApplyMsg('🎉 Hero Scroll-Driven Video Animation applied to website successfully!');
        setTimeout(() => setVideoApplyMsg(null), 4000);
      }
    } catch (e) {
      console.error('Error applying video animation:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVideoToCatalog = async (customAnim?: any) => {
    const animToSave = customAnim || {
      id: `anim-${Date.now()}`,
      title: `${companyName} ${heroVideoEffect.toUpperCase()} Animation`,
      desc: `Interactive hero video scroll animation (${heroVideoEffect}) with ${heroScrollTiming}x timing`,
      videoUrl: selectedHeroVideoUrl,
      mode: heroVideoEffect,
      timing: heroScrollTiming,
      features: [`Effect: ${heroVideoEffect}`, `Timing: ${heroScrollTiming}x`, `Speed: ${heroScrollSpeed}x`],
      date: new Date().toISOString()
    };

    if (customAnim?.videoUrl) {
      setSelectedHeroVideoUrl(customAnim.videoUrl);
      if (customAnim.mode) setHeroVideoEffect(customAnim.mode);
      if (customAnim.timing) setHeroScrollTiming(customAnim.timing);
    }

    const newSaved = [animToSave, ...savedCatalogVideoAnimations.filter(a => a.id !== animToSave.id)];
    setSavedCatalogVideoAnimations(newSaved);
    try {
      localStorage.setItem('nesta_saved_scroll_videos', JSON.stringify(newSaved));
    } catch (e) {}

    if (siteData) {
      const updatedCatalogList = [
        {
          title: animToSave.title,
          desc: animToSave.desc,
          img: siteData.content?.heroImage || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
          video: animToSave.videoUrl,
          videoUrl: animToSave.videoUrl,
          features: animToSave.features
        },
        ...(siteData.content?.catalogList || [])
      ];

      const updatedContent = {
        ...siteData.content,
        heroVideo: animToSave.videoUrl,
        heroVideoUrl: animToSave.videoUrl,
        heroVideoEffect: animToSave.mode || heroVideoEffect,
        catalogList: updatedCatalogList
      };

      setSiteData({ ...siteData, content: updatedContent });

      await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          directContent: updatedContent,
          lead
        })
      });
    }

    setVideoApplyMsg('⭐ Video animation saved and added directly to the website Catalogue!');
    setTimeout(() => setVideoApplyMsg(null), 4000);
  };

  const handleDeployToVercel = async () => {
    if (!siteData?.html && !siteData?.content && !siteData?.zipBase64) return;
    setDeployingTarget(true);
    setDeployProgress(20);
    setDeployStepText('Compiling static asset bundle for Vercel...');
    try {
      if (vercelToken) {
        localStorage.setItem('VERCEL_AUTH_TOKEN', vercelToken);
      }
      setDeployProgress(60);
      setDeployStepText('Uploading build package & provisioning Vercel edge domain...');
      
      const res = await fetch('/api/vercel/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: siteData.html || '',
          name: lead?.name || lead?.companyName || lead?.company || 'site',
          siteName: (lead?.name || lead?.companyName || lead?.company || 'site').toLowerCase().replace(/[^a-z0-9]/g, ''),
          vercelToken,
          leadId: lead?.id || lead?.leadId
        })
      });
      const data = await res.json();
      setDeployProgress(100);
      if (data.success && data.url) {
        setDeployResult(data);
        if (siteData) {
          setSiteData({ ...siteData, previewUrl: data.url });
        }
        if (lead) {
          lead.deployedWebsiteUrl = data.url;
          lead.previewUrl = data.url;
        }

        if (autoSendEmail && lead?.email) {
          setDeployStepText('Sending automated cold email with website preview...');
          await handleSendAutoEmail(data.url);
        }
      }
    } catch (err: any) {
      console.error('Vercel deployment error:', err);
    } finally {
      setDeployingTarget(false);
      setDeployProgress(0);
    }
  };

  const handleSendAutoEmail = async (targetUrl: string) => {
    try {
      const company = lead?.name || lead?.companyName || lead?.company || 'votre entreprise';
      const city = lead?.city || 'votre région';
      const niche = selectedBatchNiche || lead?.niche || lead?.sector || 'votre secteur';
      const badgeText = includeGoogleBadgeInOutreach ? '\n\n⭐️⭐️⭐️⭐️⭐️ Fiche Officielle Google Business (4.9/5 - 84 avis clients)' : '';
      const emailBody = `Bonjour ${company},\n\nJ'accompagne régulièrement les professionnels du secteur ${niche} à ${city} dans leur développement web. La présence numérique est un levier majeur sur lequel j'aide votre profession.\n\nJe me suis permis de créer un aperçu de votre nouveau site web haute performance :\n${targetUrl}${badgeText}\n\nQu'en pensez-vous ? Je reste disponible pour en échanger !`;

      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: lead?.email,
          subject: `Aperçu de votre nouveau site web - ${company}`,
          body: emailBody,
          leadId: lead?.id || lead?.leadId
        })
      });
      const data = await res.json();
      if (data.success) {
        setEmailSentStatus('Email envoyé avec succès au prospect !');
      } else {
        setEmailSentStatus('Simulation envoi email réussie !');
      }
    } catch (e) {
      setEmailSentStatus('Email préparé et prêt à l\'envoi !');
    }
  };

  const handleExecuteDeployment = async () => {
    if (deployTarget === 'zip') {
      await handleDownloadZip();
      return;
    }
    setDeployingTarget(true);
    setDeployProgress(15);
    setDeployStepText(`Packaging website assets for ${deployTarget.toUpperCase()}...`);

    if (deployTarget === 'netlify') {
      setTimeout(() => setDeployProgress(45), 300);
      setTimeout(() => setDeployStepText('Optimizing CSS & images for Netlify CDN...'), 600);
      setTimeout(() => setDeployProgress(75), 900);
      await handleDeployToNetlify();
      setDeployProgress(100);
      setDeployingTarget(false);
      if (autoSendEmail && lead?.email) {
        const deployedUrl = netlifyDeployResult?.url || lead?.deployedWebsiteUrl || siteData?.previewUrl;
        if (deployedUrl) await handleSendAutoEmail(deployedUrl);
      }
    } else if (deployTarget === 'vercel') {
      await handleDeployToVercel();
    }
  };

  
  const handleSaveProject = () => {
    try {
      const projectData = {
        siteData,
        aiPrompt,
        badgeNiche,
        dentistActiveModel,
        dentistVeneerShade,
        dentistVeneerShape,
        dentistSliderPos,
        dentistAutoPlay,
        dentistUploadedImage,
        googleScreenshotUrl,
        selectedLang
      };
      localStorage.setItem('assix_saved_project', JSON.stringify(projectData));
      alert('Project saved successfully! You can load it later.');
    } catch (e) {
      console.error(e);
      alert('Failed to save project.');
    }
  };

  const handleLoadProject = () => {
    try {
      const saved = localStorage.getItem('assix_saved_project');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.siteData) setSiteData(parsed.siteData);
        if (parsed.aiPrompt) setAiPrompt(parsed.aiPrompt);
        if (parsed.badgeNiche) setBadgeNiche(parsed.badgeNiche);
        if (parsed.dentistActiveModel) setDentistActiveModel(parsed.dentistActiveModel);
        if (parsed.dentistVeneerShade) setDentistVeneerShade(parsed.dentistVeneerShade);
        if (parsed.dentistVeneerShape) setDentistVeneerShape(parsed.dentistVeneerShape);
        if (parsed.dentistSliderPos) setDentistSliderPos(parsed.dentistSliderPos);
        if (parsed.dentistAutoPlay !== undefined) setDentistAutoPlay(parsed.dentistAutoPlay);
        if (parsed.dentistUploadedImage) setDentistUploadedImage(parsed.dentistUploadedImage);
        if (parsed.googleScreenshotUrl) setGoogleScreenshotUrl(parsed.googleScreenshotUrl);
        if (parsed.selectedLang) setSelectedLang(parsed.selectedLang);
        alert('Project loaded successfully!');
      } else {
        alert('No saved project found.');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to load project.');
    }
  };
  const handleDeployToNetlify = async () => {
    if (!siteData?.html && !siteData?.content && !siteData?.zipBase64) return;
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
          zipBase64: siteData.zipBase64 || siteData.zipFile || undefined,
          files: siteData.files || undefined,
          name: lead.name || lead.companyName || lead.company || 'site',
          siteName: (lead.name || lead.companyName || lead.company || 'site').toLowerCase().replace(/[^a-z0-9]/g, ''),
          netlifyToken,
          leadId: lead.id || lead.leadId
        })
      });
      const data = await res.json();
      if (data.success && data.url) {
        setNetlifyDeployResult(data);
        if (data.gifUrl) {
          setGifUrl(data.gifUrl);
        }
        if (siteData) {
          setSiteData({ ...siteData, previewUrl: data.url, gifUrl: data.gifUrl || siteData.gifUrl });
        }
        lead.deployedWebsiteUrl = data.url;
        if (data.gifUrl) lead.deployedWebsiteGif = data.gifUrl;
        lead.previewUrl = data.url;
      }
    } catch (err: any) {
      console.error('Netlify deployment error:', err);
    } finally {
      setDeployingNetlify(false);
    }
  };

  const handleShareToWhatsApp = () => {
    const url = netlifyDeployResult?.url || siteData?.previewUrl || lead.deployedWebsiteUrl || '';
    const rawPhone = lead.phone || '';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const company = lead.companyName || lead.name || lead.company || 'votre entreprise';
    const currentGif = gifUrl || netlifyDeployResult?.gifUrl || lead.deployedWebsiteGif || (url ? `${window.location.origin}/api/urlbox/gif?url=${encodeURIComponent(url)}` : '');
    const text = encodeURIComponent(
      `Bonjour, nous avons créé un nouveau site internet haute performance pour ${company} : ${url}` +
      `🎬 Aperçu animé du site (GIF) : ${currentGif}` +
      `Souhaitez-vous le consulter et voir comment Assix automatise vos appels manqués et vos e-mails ?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleGenerateGif = async () => {
    // Only use targetUrl if it's a real deployed Netlify URL without a fallback note, or a previously saved lead.deployedWebsiteUrl
    let targetUrl = '';
    if (netlifyDeployResult?.url && !netlifyDeployResult?.note) {
      targetUrl = netlifyDeployResult.url;
    } else if (lead.deployedWebsiteUrl && !lead.deployedWebsiteUrl.includes('nesta.ai')) {
      targetUrl = lead.deployedWebsiteUrl;
    }

    setGeneratingGif(true);
    setGifError(null);
    try {
      if (targetUrl && targetUrl.startsWith('http')) {
        const urlboxGif = `/api/urlbox/gif?url=${encodeURIComponent(targetUrl)}&refresh=true&scroll=${gifScrollMode === 'scroll'}`;
        setGifUrl(`${urlboxGif}&t=${Date.now()}`);
      } else if (siteData?.siteId) {
        const response = await fetch(`/api/website/${siteData.siteId}/generate-gif`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scroll: gifScrollMode === 'scroll', html: siteData.html || '' })
        });
        const data = await response.json();
        if (data.success && data.gifUrl) {
          setGifUrl(`${data.gifUrl}?t=${Date.now()}`);
        } else {
          setGifError(data.error || 'Failed to generate GIF');
        }
      }
    } catch (err: any) {
      setGifError(err.message || 'Error generating GIF');
    } finally {
      setGeneratingGif(false);
    }
  };

  const getHtmlEmailCode = () => {
    if (outreachMode === 'dentist') {
      const title = companyName ? `AI Veneers Smile Trial for ${companyName}` : 'AI Veneers Smile Trial Widget';
      const fallbackUrl = 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=600&auto=format&fit=crop';
      return `<div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
  <div style="background-color: #0F172A; padding: 24px; text-align: center;">
    <h2 style="color: #FFFFFF; margin: 0 0 8px 0; font-size: 18px; font-weight: 800; letter-spacing: -0.5px;">Transformez l'Acquisition de Vos Patients 🦷</h2>
    <p style="color: #94A3B8; margin: 0; font-size: 12px;">Ajoutez notre Simulateur Virtuel de Sourire AI sur votre site internet</p>
  </div>
  <div style="padding: 24px; text-align: center; background-color: #F8FAFC;">
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 18px 0;">
      Notre widget interactif permet à vos patients de tester instantanément des facettes dentaires en porcelaine ultra-réalistes (BL1 Bleach) en uploadant un simple selfie depuis leur smartphone.
    </p>
    <div style="border: 2px solid #E2E8F0; border-radius: 12px; overflow: hidden; background-color: #000000; position: relative;">
      <img src="${fallbackUrl}" alt="${title}" style="width:100%; display:block; filter: brightness(0.9);" />
      <div style="position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.8); color: #F472B6; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; font-family: sans-serif;">
        🦷 SIMULATEUR DE SOURIRE ACTIF SUR VOTRE SITE
      </div>
    </div>
    <div style="margin-top: 20px;">
      <a href="https://agency.nesta.ai" target="_blank" style="display: inline-block; background-color: #E11D48; color: #FFFFFF; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 13px;">
        Tester la démo installée sur votre site
      </a>
    </div>
  </div>
</div>`;
    }
    const origin = window.location.origin;
    const destLink = netlifyDeployResult?.url || siteData?.previewUrl || lead.deployedWebsiteUrl || (siteData?.siteId ? `${origin}/preview/${siteData.siteId}` : '');
    
    let srcLink = gifUrl || netlifyDeployResult?.gifUrl || lead.deployedWebsiteGif || siteData?.gifUrl || '';
    if (!srcLink && destLink && destLink.startsWith('http')) {
      srcLink = `${origin}/api/urlbox/gif?url=${encodeURIComponent(destLink)}`;
    } else if (!srcLink && siteData?.siteId) {
      srcLink = `${origin}/api/website/${siteData.siteId}/preview.gif`;
    }

    if (!destLink && !srcLink) return '';

    return `<a href="${destLink}" target="_blank" style="display:inline-block; text-decoration:none;">
  <img src="${srcLink.startsWith('http') ? srcLink : `${origin}${srcLink}`}" alt="Animated Website Prototype" style="width:100%; max-width:600px; height:auto; border:2px solid #E2E8F0; border-radius:12px; display:block; box-shadow:0 10px 25px rgba(0,0,0,0.1);" />
 </a>`;
  };

  const handleCopyGifUrl = () => {
    if (outreachMode === 'dentist') {
      navigator.clipboard.writeText('https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=600&auto=format&fit=crop');
      setCopiedGifUrl(true);
      setTimeout(() => setCopiedGifUrl(false), 2000);
      return;
    }
    const origin = window.location.origin;
    const destLink = netlifyDeployResult?.url || siteData?.previewUrl || lead.deployedWebsiteUrl || '';
    let srcLink = gifUrl || netlifyDeployResult?.gifUrl || lead.deployedWebsiteGif || siteData?.gifUrl || '';
    if (!srcLink && destLink && destLink.startsWith('http')) {
      srcLink = `${origin}/api/urlbox/gif?url=${encodeURIComponent(destLink)}`;
    } else if (!srcLink && siteData?.siteId) {
      srcLink = `${origin}/api/website/${siteData.siteId}/preview.gif`;
    }
    const fullUrl = srcLink.startsWith('http') ? srcLink : `${origin}${srcLink}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedGifUrl(true);
    setTimeout(() => setCopiedGifUrl(false), 2000);
  };

  const handleCopyGifCode = () => {
    const code = getHtmlEmailCode();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedGifCode(true);
    setTimeout(() => setCopiedGifCode(false), 2000);
  };

  const generateNicheReviews = () => {
    const niche = badgeNiche || 'Services';
    const city = badgeCity || 'votre région';
    const company = companyName || 'notre entreprise';

    const firstNames = ['Jean', 'Sophie', 'Michel', 'Aurélie', 'Pierre', 'Nathalie', 'Thomas', 'Valérie', 'Antoine'];
    const lastNames = ['Dupond', 'Martin', 'Moreau', 'Lefebvre', 'Bernard', 'Petit', 'Roux', 'Garnier', 'Faure'];
    
    const reviewsTemplates = [
      {
        stars: 5,
        text: `Très satisfaite de leur réactivité ! Équipe très professionnelle à ${city} pour nos besoins en ${niche.toLowerCase()}. Le travail est soigné et l'expérience client excellente, je recommande vivement ${company} !`,
        offsetDays: 3
      },
      {
        stars: 5,
        text: `Prestation impeccable ! J'ai contacté ${company} pour un dépannage urgent et ils sont intervenus presque immédiatement. Un grand merci pour leur réactivité exemplaire.`,
        offsetDays: 14
      },
      {
        stars: 5,
        text: `Un accueil chaleureux et une vraie expertise locale. C'est sans doute la meilleure adresse à ${city} pour tout projet lié au ${niche.toLowerCase()}. Contactez-les en toute confiance !`,
        offsetDays: 28
      }
    ];

    const generated = reviewsTemplates.map((item, idx) => {
      const fName = firstNames[(idx * 3 + company.charCodeAt(0)) % firstNames.length];
      const lName = lastNames[(idx * 7 + city.charCodeAt(0)) % lastNames.length];
      return {
        name: `${fName} ${lName.substring(0, 1)}.`,
        text: item.text,
        stars: item.stars,
        date: `Il y a ${item.offsetDays} jours`
      };
    });

    setReviewsList(generated);
  };

  const handleCaptureGoogleScreenshot = async () => {
    setCapturingGoogle(true);
    setGoogleCaptureError(null);
    try {
      const queryStr = `${companyName} ${badgeCity}`.trim();
      const response = await fetch('/api/lead/google-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryStr,
          type: googleSearchType
        })
      });
      const data = await response.json();
      if (data.success && data.imageBase64) {
        setGoogleScreenshotUrl(`data:image/jpeg;base64,${data.imageBase64}`);
      } else {
        setGoogleCaptureError(data.error || 'Failed to capture live screenshot. Google Maps might be blocking headless requests or cookie consent is gating the search. Use our beautiful simulated backup below!');
      }
    } catch (err: any) {
      setGoogleCaptureError(err.message || 'Error communicating with screenshot engine');
    } finally {
      setCapturingGoogle(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'gif' && !gifUrl) {
      const netlifyUrl = netlifyDeployResult?.url || siteData?.previewUrl || lead?.deployedWebsiteUrl;
      if (netlifyUrl && netlifyUrl.startsWith('http')) {
        setGifUrl(`/api/urlbox/gif?url=${encodeURIComponent(netlifyUrl)}`);
      } else if (siteData?.siteId) {
        setGifUrl(`/api/website/${siteData.siteId}/preview.gif`);
      } else if (lead?.deployedWebsiteGif) {
        setGifUrl(lead.deployedWebsiteGif);
      }
    }
  }, [activeTab, siteData, gifUrl, netlifyDeployResult, lead]);

  useEffect(() => {
    if (activeTab === 'gif') {
      generateNicheReviews();
    }
  }, [activeTab, badgeNiche, badgeCity]);

  // Sync selectedBatchNiche with actual site/lead niche
  useEffect(() => {
    const currentNiche = siteData?.content?.nicheOverride || lead?.niche || lead?.sector || lead?.category;
    if (currentNiche) {
      const lower = currentNiche.toLowerCase();
      if (lower.includes('restau') || lower.includes('food') || lower.includes('gastro')) {
        setSelectedBatchNiche('restaurant');
      } else if (lower.includes('real') || lower.includes('immob') || lower.includes('estate') || lower.includes('home')) {
        setSelectedBatchNiche('realEstate');
      } else if (lower.includes('plumb') || lower.includes('plomb')) {
        setSelectedBatchNiche('plumber');
      } else if (lower.includes('auto') || lower.includes('driv') || lower.includes('permis')) {
        setSelectedBatchNiche('driving_school');
      } else if (lower.includes('renov') || lower.includes('travaux') || lower.includes('btp')) {
        setSelectedBatchNiche('renovation');
      } else if (lower.includes('electr') || lower.includes('électr')) {
        setSelectedBatchNiche('electrician');
      } else {
        setSelectedBatchNiche(currentNiche);
      }
    }
  }, [siteData?.content?.nicheOverride, lead?.niche, lead?.sector, lead?.category]);

  // Dentist Auto-play simulation effect
  useEffect(() => {
    if (!dentistAutoPlay || outreachMode !== 'dentist') return;
    let dir = 1;
    const interval = setInterval(() => {
      setDentistSliderPos(prev => {
        if (prev >= 95) {
          dir = -1;
          return 95;
        }
        if (prev <= 5) {
          dir = 1;
          return 5;
        }
        return prev + dir * 1.5;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [dentistAutoPlay, outreachMode]);

  const handleDentistPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDentistIsUploading(true);
    setDentistAutoPlay(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        setDentistUploadedImage(event.target?.result as string);
        setDentistActiveModel('custom');
        setDentistIsUploading(false);
        setDentistSliderPos(50);
      }, 1200); // Simulate processing time
    };
    reader.readAsDataURL(file);
  };

  const renderVeneersSVGPaths = () => {
    return (
      <>
        <defs>
          <linearGradient id="shadeBL1_modal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F9FAFB" />
            <stop offset="85%" stopColor="#ECEFF1" />
            <stop offset="100%" stopColor="#CFD8DC" />
          </linearGradient>
          <linearGradient id="shadeB1_modal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFDF6" />
            <stop offset="40%" stopColor="#F5F4EC" />
            <stop offset="85%" stopColor="#E4E3DA" />
            <stop offset="100%" stopColor="#C8C6B9" />
          </linearGradient>
          <linearGradient id="shadeA1_modal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAF6EA" />
            <stop offset="40%" stopColor="#EFECE0" />
            <stop offset="85%" stopColor="#DFD9C8" />
            <stop offset="100%" stopColor="#C4BCAF" />
          </linearGradient>
        </defs>

        <g id="customTeethRowModal">
          {/* Tooth 1: Left Premolar */}
          <rect 
            x="12" y="14" width="16" height="24" 
            rx={dentistVeneerShape === 'natural' || dentistVeneerShape === 'oval' ? 6 : 2} 
            fill={`url(#shade${dentistVeneerShade}_modal)`} 
            stroke="#CFD8DC" strokeWidth="0.4"
          />
          {/* Tooth 2: Left Canine */}
          <path 
            d="M 28,12 L 46,12 C 46,12 47,31 43,33 C 39,35 28,32 28,32 Z" 
            fill={`url(#shade${dentistVeneerShade}_modal)`} 
            stroke="#CFD8DC" strokeWidth="0.4"
          />
          {/* Tooth 3: Left Lateral Incisor */}
          <rect 
            x="46" y="9" width="20" height="29" 
            rx={dentistVeneerShape === 'oval' ? 8 : dentistVeneerShape === 'natural' ? 5 : 2} 
            fill={`url(#shade${dentistVeneerShade}_modal)`} 
            stroke="#CFD8DC" strokeWidth="0.4"
          />
          {/* Tooth 4: Left Central Incisor */}
          <path 
            d="M 66,7 L 90,7 C 90,7 91,37 89,38 C 85,38 66,35 66,35 Z" 
            fill={`url(#shade${dentistVeneerShade}_modal)`} 
            stroke="#B0BEC5" strokeWidth="0.5"
          />
          {/* Tooth 5: Right Central Incisor */}
          <path 
            d="M 90,7 L 114,7 C 114,7 114,35 111,38 C 109,38 90,37 90,37 Z" 
            fill={`url(#shade${dentistVeneerShade}_modal)`} 
            stroke="#B0BEC5" strokeWidth="0.5"
          />
          {/* Tooth 6: Right Lateral Incisor */}
          <rect 
            x="114" y="9" width="20" height="29" 
            rx={dentistVeneerShape === 'oval' ? 8 : dentistVeneerShape === 'natural' ? 5 : 2} 
            fill={`url(#shade${dentistVeneerShade}_modal)`} 
            stroke="#CFD8DC" strokeWidth="0.4"
          />
          {/* Tooth 7: Right Canine */}
          <path 
            d="M 134,12 L 152,12 C 152,12 152,32 152,32 Q 141,35 137,33 C 133,31 134,12 134,12 Z" 
            fill={`url(#shade${dentistVeneerShade}_modal)`} 
            stroke="#CFD8DC" strokeWidth="0.4"
          />
          {/* Tooth 8: Right Premolar */}
          <rect 
            x="152" y="14" width="16" height="24" 
            rx={dentistVeneerShape === 'natural' || dentistVeneerShape === 'oval' ? 6 : 2} 
            fill={`url(#shade${dentistVeneerShade}_modal)`} 
            stroke="#CFD8DC" strokeWidth="0.4"
          />
        </g>
        {/* Incisal Translucency highlight */}
        <path 
          d="M 14,24 Q 90,16 166,24 Q 90,26 14,24 Z" 
          fill="#FFFFFF" 
          opacity="0.75" 
        />
      </>
    );
  };

  const renderVeneerOverlaySVG = () => {
    return (
      <svg viewBox="0 0 180 65" className="w-full h-full drop-shadow-[0_4px_12px_rgba(255,255,255,0.25)]">
        {renderVeneersSVGPaths()}
      </svg>
    );
  };

  const renderDentistPortrait = () => {
    if (dentistIsUploading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-3 p-12 text-center h-full w-full bg-[#10131B] rounded-2xl border border-zinc-800">
          <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-pink-400">AI SMILE ENGINE INITIALIZING</p>
          <p className="text-[10px] text-zinc-400 max-w-xs animate-pulse">
            Analyzing facial geometry, mapping gingival line & synthesizing veneers...
          </p>
        </div>
      );
    }

    if (dentistActiveModel === 'custom' && dentistUploadedImage) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-850">
          <img 
            src={dentistUploadedImage} 
            alt="Custom patient preview" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div 
            className="absolute select-none pointer-events-none"
            style={{
              left: '50%',
              top: '55%',
              transform: 'translate(-50%, -50%) scale(0.95)',
              width: '160px',
              height: '58px',
              clipPath: `polygon(0 0, ${dentistSliderPos}% 0, ${dentistSliderPos}% 100%, 0 100%)`
            }}
          >
            {renderVeneerOverlaySVG()}
          </div>
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-pink-400 font-bold tracking-wide uppercase">
            Veneers (Left)
          </div>
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-zinc-400 font-bold tracking-wide uppercase">
            Original (Right)
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        {dentistActiveModel === 'sophia' && (
          <svg viewBox="0 0 400 400" className="w-full h-full bg-gradient-to-tr from-slate-900 via-[#10131B] to-slate-950">
            <defs>
              <radialGradient id="skinGlow" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFE0CC" />
                <stop offset="100%" stopColor="#E6B399" />
              </radialGradient>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4A3B32" />
                <stop offset="100%" stopColor="#1C1510" />
              </linearGradient>
              <clipPath id="sliderClipSophia">
                <rect x="0" y="0" width={400 * (dentistSliderPos / 100)} height="400" />
              </clipPath>
            </defs>
            <path d="M120,150 Q70,220 100,320 L300,320 Q330,220 280,150 Z" fill="url(#hairGrad)" opacity="0.9" />
            <ellipse cx="200" cy="210" rx="65" ry="85" fill="url(#skinGlow)" stroke="#3E2010" strokeWidth="0.5" />
            <path d="M135,180 Q160,110 200,140 Q240,110 265,180 Q280,140 200,120 Q120,140 135,180" fill="url(#hairGrad)" />
            <ellipse cx="175" cy="195" rx="8" ry="4" fill="#FFFFFF" />
            <circle cx="175" cy="195" r="4" fill="#3B82F6" />
            <circle cx="176" cy="194" r="1.5" fill="#FFFFFF" />
            <ellipse cx="225" cy="195" rx="8" ry="4" fill="#FFFFFF" />
            <circle cx="225" cy="195" r="4" fill="#3B82F6" />
            <circle cx="226" cy="194" r="1.5" fill="#FFFFFF" />
            <path d="M162,187 Q175,182 185,188" stroke="#1C1510" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M238,187 Q225,182 215,188" stroke="#1C1510" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M200,195 L197,222 Q200,226 203,222 Z" fill="#D2997A" opacity="0.7" />
            
            <path d="M150,250 Q200,285 250,250 Q200,298 150,250" fill="#E11D48" stroke="#BE123C" strokeWidth="1" />
            
            <g transform="translate(162, 252) scale(0.95)">
              <rect x="0" y="0" width="9" height="12" rx="2" fill="#EAE2B7" stroke="#D3C165" strokeWidth="0.5" />
              <rect x="9" y="0" width="8" height="11" rx="1.5" fill="#DDD595" stroke="#CBB952" strokeWidth="0.5" transform="rotate(-4 13 5)" />
              <rect x="17" y="1" width="7" height="9" rx="1.5" fill="#D0C888" stroke="#BCA745" strokeWidth="0.5" />
              <path d="M 24,0 L 33,0 L 33,13 Q 29,13 28,12 L 24,10 Z" fill="#F4E9CD" stroke="#DDD1AC" strokeWidth="0.5" />
              <rect x="33" y="0" width="9" height="14" rx="2.5" fill="#F2E6C3" stroke="#D9C898" strokeWidth="0.5" />
              <rect x="42" y="0" width="8" height="10" rx="1.5" fill="#DDD595" stroke="#CBB952" strokeWidth="0.5" transform="rotate(6 46 5)" />
              <rect x="50" y="1" width="7" height="9" rx="1" fill="#D0C888" stroke="#BCA745" strokeWidth="0.5" />
              <rect x="57" y="2" width="6" height="8" rx="1" fill="#C5B670" stroke="#AA9539" strokeWidth="0.5" />
            </g>

            <g clipPath="url(#sliderClipSophia)" transform="translate(111, 246) scale(0.98)">
              {renderVeneersSVGPaths()}
            </g>

            <path d="M175,295 Q200,305 225,295" stroke="#D2997A" strokeWidth="1.5" fill="none" opacity="0.4" />
          </svg>
        )}

        {dentistActiveModel === 'marcus' && (
          <svg viewBox="0 0 400 400" className="w-full h-full bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0F172A]">
            <defs>
              <radialGradient id="marcusSkin" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="0.1%" stopColor="#9C785C" />
                <stop offset="100%" stopColor="#5C3F2E" />
              </radialGradient>
              <linearGradient id="beardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2D1A10" />
                <stop offset="100%" stopColor="#140804" />
              </linearGradient>
              <clipPath id="sliderClipMarcus">
                <rect x="0" y="0" width={400 * (dentistSliderPos / 100)} height="400" />
              </clipPath>
            </defs>
            <path d="M130,220 Q200,320 270,220" fill="url(#beardGrad)" />
            <ellipse cx="200" cy="210" rx="63" ry="83" fill="url(#marcusSkin)" stroke="#23120B" strokeWidth="0.5" />
            <path d="M132,180 Q130,130 200,120 Q270,130 268,180 Q278,240 270,260 Q260,300 200,300 Q140,300 130,260 Q122,240 132,180 Z" fill="none" stroke="url(#beardGrad)" strokeWidth="12" />
            <path d="M138,150 Q200,140 262,150" fill="url(#beardGrad)" />
            <ellipse cx="178" cy="195" rx="7.5" ry="3.5" fill="#FFFFFF" />
            <circle cx="178" cy="195" r="3.5" fill="#4B5563" />
            <circle cx="179" cy="194" r="1.2" fill="#FFFFFF" />
            <ellipse cx="222" cy="195" rx="7.5" ry="3.5" fill="#FFFFFF" />
            <circle cx="222" cy="195" r="3.5" fill="#4B5563" />
            <circle cx="223" cy="194" r="1.2" fill="#FFFFFF" />
            <path d="M165,188 H190" stroke="#140804" strokeWidth="3" strokeLinecap="round" />
            <path d="M235,188 H210" stroke="#140804" strokeWidth="3" strokeLinecap="round" />
            <path d="M200,195 L198,220 Q200,224 204,220 Z" fill="#432818" opacity="0.6" />
            
            <path d="M148,248 Q200,288 252,248 Q200,300 148,248" fill="#B33939" stroke="#8C2525" strokeWidth="1" />
            
            <g transform="translate(160, 252) scale(1.02)">
              <rect x="2" y="0" width="8" height="11" rx="1.5" fill="#EEE5C3" stroke="#D5C58A" strokeWidth="0.5" />
              <rect x="10" y="0" width="8" height="12" rx="1.5" fill="#E8DBA8" stroke="#CDBC77" strokeWidth="0.5" />
              <rect x="18" y="0" width="9" height="15" rx="2" fill="#F4E9CD" stroke="#DDD1AC" strokeWidth="0.5" />
              <rect x="31" y="0" width="9" height="15" rx="2" fill="#F4E9CD" stroke="#DDD1AC" strokeWidth="0.5" />
              <rect x="40" y="0" width="8" height="12" rx="1.5" fill="#E8DBA8" stroke="#CDBC77" strokeWidth="0.5" />
              <rect x="48" y="0" width="8" height="11" rx="1.5" fill="#EEE5C3" stroke="#D5C58A" strokeWidth="0.5" />
            </g>

            <g clipPath="url(#sliderClipMarcus)" transform="translate(108, 243) scale(1.02)">
              {renderVeneersSVGPaths()}
            </g>
          </svg>
        )}

        {dentistActiveModel === 'emily' && (
          <svg viewBox="0 0 400 400" className="w-full h-full bg-gradient-to-tr from-[#1E1B4B] via-[#0F172A] to-[#111827]">
            <defs>
              <radialGradient id="emilySkin" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF0EB" />
                <stop offset="100%" stopColor="#FFD4C2" />
              </radialGradient>
              <linearGradient id="blondeHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
              <clipPath id="sliderClipEmily">
                <rect x="0" y="0" width={400 * (dentistSliderPos / 100)} height="400" />
              </clipPath>
            </defs>
            <path d="M110,120 Q50,220 80,330 L320,330 Q350,220 290,120 Z" fill="url(#blondeHair)" />
            <ellipse cx="200" cy="210" rx="66" ry="84" fill="url(#emilySkin)" stroke="#4A1E0B" strokeWidth="0.5" />
            <path d="M130,170 Q140,100 200,100 Q260,100 270,170 Q285,130 200,110 Q115,130 130,170" fill="url(#blondeHair)" />
            <ellipse cx="174" cy="195" rx="8" ry="4" fill="#FFFFFF" />
            <circle cx="174" cy="195" r="4.2" fill="#10B981" />
            <circle cx="175" cy="194" r="1.5" fill="#FFFFFF" />
            <ellipse cx="226" cy="195" rx="8" ry="4" fill="#FFFFFF" />
            <circle cx="226" cy="195" r="4.2" fill="#10B981" />
            <circle cx="227" cy="194" r="1.5" fill="#FFFFFF" />
            <path d="M160,186 Q175,180 186,186" stroke="#CA8A04" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M240,186 Q225,180 214,186" stroke="#CA8A04" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M200,195 L198,222 Q200,225 202,222 Z" fill="#D39276" opacity="0.6" />
            
            <path d="M152,249 Q200,286 248,249 Q200,296 152,249" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
            
            <g transform="translate(163, 252) scale(0.97)">
              <rect x="0" y="1" width="8" height="9" rx="1.5" fill="#D4AF37" stroke="#9A7B1C" strokeWidth="0.5" opacity="0.85" />
              <rect x="8" y="0" width="8" height="11" rx="1.5" fill="#EAD595" stroke="#CCA74A" strokeWidth="0.5" />
              <rect x="16" y="0" width="10" height="14" rx="2.2" fill="#EAD89D" stroke="#CCA74A" strokeWidth="0.5" transform="rotate(-6 21 6)" />
              <rect x="25" y="0" width="10" height="15" rx="2.5" fill="#FAF1D2" stroke="#DFCCA2" strokeWidth="0.5" transform="rotate(3 29 6)" />
              <rect x="34" y="1" width="9" height="11" rx="1.5" fill="#F0DFAD" stroke="#D3BD80" strokeWidth="0.5" transform="rotate(-15 38 6)" />
              <rect x="43" y="1" width="8" height="9" rx="1.5" fill="#E2CC80" stroke="#C5AA4E" strokeWidth="0.5" />
              <rect x="51" y="2" width="7" height="8" rx="1.5" fill="#CEB14C" stroke="#B1942E" strokeWidth="0.5" />
            </g>

            <g clipPath="url(#sliderClipEmily)" transform="translate(112, 244) scale(0.97)">
              {renderVeneersSVGPaths()}
            </g>
          </svg>
        )}
      </div>
    );
  };

  const handleSliderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dentistAutoPlay) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setDentistSliderPos(pct);
  };

  const handleSliderTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dentistAutoPlay) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setDentistSliderPos(pct);
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingZip(true);
    setZipSuccessMessage(null);
    try {
      let htmlText: string | undefined = undefined;
      let base64Data: string | undefined = undefined;

      const filename = file.name.toLowerCase();
      const isHtml = filename.endsWith('.html') || filename.endsWith('.htm') || file.type.includes('html');

      if (isHtml) {
        htmlText = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsText(file, 'utf-8');
        });
      } else {
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      }

      const res = await fetch('/api/leads/adapt-zip-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipBase64: base64Data,
          htmlText: htmlText,
          targetLead: lead,
          langOverride: selectedLang !== 'auto' ? selectedLang : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));
        setZipSuccessMessage(`Successfully imported custom website design! Adapted all contact details and content for ${lead.name || lead.companyName || 'the target business'}.`);
        setTimeout(() => setZipSuccessMessage(null), 6000);
      } else {
        alert(data.error || 'Failed to adapt HTML or ZIP template');
      }
    } catch (err) {
      console.error('Failed to import template file:', err);
      alert('Error parsing file. Make sure it is a valid HTML file or ZIP archive.');
    } finally {
      setUploadingZip(false);
    }
  };

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
        if (lead.userUploadedVideos && Array.isArray(lead.userUploadedVideos)) {
          setUploadedVideos(lead.userUploadedVideos);
        } else {
          setUploadedVideos([]);
        }
        if (lead?.userUploadedModels) {
          setUploadedModels(lead.userUploadedModels);
        } else {
          setUploadedModels([]);
        }
        setVideoSearchQuery(lead.niche || lead.sector || 'renovation');
        setResearchedVideosList([]);

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

  const [generating3d, setGenerating3d] = useState(false);
  const [model3dResult, setModel3dResult] = useState<string | null>(null);
  const [imageTo3dUrl, setImageTo3dUrl] = useState('');

  const handleImageUploadFor3D = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImageTo3dUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadForTemplateMaker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setTemplateMakerImages(prev => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleGenerateTemplateMaker = async () => {
    if (templateMakerImages.length === 0) return;
    setTemplateMakerGenerating(true);
    try {
      const res = await fetch('/api/templates/generate-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: templateMakerImages })
      });
      const data = await res.json();
      if (data.success) {
        setTemplateMakerHtml(data.html);
      } else {
        alert(data.error || 'Failed to generate template');
      }
    } catch(err) {
      console.error(err);
      alert('Error generating template');
    }
    setTemplateMakerGenerating(false);
  };

  const handleTemplateMakerChat = async () => {
    if (!templateMakerChatInput.trim() || !templateMakerHtml) return;
    const userMsg = templateMakerChatInput.trim();
    setTemplateMakerChatInput('');
    setTemplateMakerChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setTemplateMakerGenerating(true);
    try {
      const res = await fetch('/api/templates/chat-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: templateMakerHtml, prompt: userMsg })
      });
      const data = await res.json();
      if (data.success) {
        setTemplateMakerHtml(data.html);
        setTemplateMakerChat(prev => [...prev, { role: 'assistant', text: 'Template updated based on your instructions.' }]);
      } else {
        setTemplateMakerChat(prev => [...prev, { role: 'assistant', text: `Error: ${data.error}` }]);
      }
    } catch (err) {
      setTemplateMakerChat(prev => [...prev, { role: 'assistant', text: 'Error refining template.' }]);
    }
    setTemplateMakerGenerating(false);
  };

  const handleGenerate3D = async (url: string) => {
    if (!url) return;
    setGenerating3d(true);
    try {
      const res = await fetch('/api/3d/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url })
      });
      const data = await res.json();
      if (data.success && data.modelUrl) {
        setModel3dResult(data.modelUrl);
        // Optionally update siteData immediately
        if (siteData?.siteId) {
          await fetch('/api/leads/modify-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              siteId: siteData.siteId,
              currentContent: siteData.content,
              directContent: { model3dUrl: data.modelUrl, show3dHero: true },
              lead
            })
          });
          // Optimistically update frontend state
          const newContent = { ...siteData.content, model3dUrl: data.modelUrl, show3dHero: true };
          setSiteData({ ...siteData, content: newContent });
          setJsonText(JSON.stringify(newContent, null, 2));
        }
      } else {
        alert(data.error || 'Failed to generate 3D model');
      }
    } catch (err) {
      console.error(err);
      alert('Error generating 3D model');
    }
    setGenerating3d(false);
  };

  const handleApply3dToHero = async (enable: boolean) => {
    if (!siteData?.siteId || !siteData.content?.model3dUrl) return;
    setModifying(true);
    try {
      await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          directContent: { show3dHero: enable, show3dCatalog: false },
          lead
        })
      });
      const newContent = { ...siteData.content, show3dHero: enable, show3dCatalog: false };
      setSiteData({ ...siteData, content: newContent });
      setJsonText(JSON.stringify(newContent, null, 2));
    } catch (err) {}
    setModifying(false);
  };

  const handleApply3dToCatalog = async (enable: boolean) => {
    if (!siteData?.siteId || !siteData.content?.model3dUrl) return;
    setModifying(true);
    try {
      await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          directContent: { show3dCatalog: enable, show3dHero: false },
          lead
        })
      });
      const newContent = { ...siteData.content, show3dCatalog: enable, show3dHero: false };
      setSiteData({ ...siteData, content: newContent });
      setJsonText(JSON.stringify(newContent, null, 2));
    } catch (err) {}
    setModifying(false);
  };

  const handleVisionConvertDesign = async (targetImageUrl?: string | string[], imageBase64?: string | string[]) => {
    setLoading(true);
    try {
      const targetLang = selectedLang !== 'auto' ? selectedLang : (lead.market?.includes('english') ? 'en' : 'fr');
      const imagesList = Array.isArray(targetImageUrl) ? targetImageUrl : (targetImageUrl ? [targetImageUrl] : []);
      const imagesB64List = Array.isArray(imageBase64) ? imageBase64 : (imageBase64 ? [imageBase64] : []);

      const res = await fetch('/api/leads/vision-convert-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: typeof targetImageUrl === 'string' ? targetImageUrl : undefined,
          imageBase64: typeof imageBase64 === 'string' ? imageBase64 : undefined,
          images: imagesList,
          imagesBase64: imagesB64List,
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

  
  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setModifying(true);
    try {
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

      const updated = [...uploadedModels, ...newBase64s];
      setUploadedModels(updated);

      if (siteData) {
        const res = await fetch('/api/leads/modify-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId: siteData.siteId,
            currentContent: siteData.content,
            directContent: { uploadedModels: updated },
            lead: { ...lead, userUploadedModels: updated }
          })
        });
        const data = await res.json();
        if (data.success) {
          setSiteData(data);
          setJsonText(JSON.stringify(data.content, null, 2));
        }
      }
    } catch (err) {
      console.error('Failed to upload model:', err);
    } finally {
      setModifying(false);
    }
  };

  const handleDeleteUploadedModel = async (indexToRemove: number) => {
    const updated = uploadedModels.filter((_, idx) => idx !== indexToRemove);
    setUploadedModels(updated);

    if (siteData) {
      setModifying(true);
      try {
        const res = await fetch('/api/leads/modify-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId: siteData.siteId,
            currentContent: siteData.content,
            directContent: { uploadedModels: updated },
            lead: { ...lead, userUploadedModels: updated }
          })
        });
        const data = await res.json();
        if (data.success) {
          setSiteData(data);
          setJsonText(JSON.stringify(data.content, null, 2));
        }
      } catch (err) {
        console.error('Failed to delete model:', err);
      } finally {
        setModifying(false);
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingVideo(true);
    try {
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

      const updated = [...uploadedVideos, ...newBase64s];
      setUploadedVideos(updated);

      if (siteData) {
        setModifying(true);
        const res = await fetch('/api/leads/modify-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId: siteData.siteId,
            currentContent: siteData.content,
            directContent: { uploadedVideos: updated },
            lead
          })
        });
        const data = await res.json();
        if (data.success) {
          setSiteData(data);
          setJsonText(JSON.stringify(data.content, null, 2));
        }
      }
    } catch (err) {
      console.error('Failed to upload video:', err);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleDeleteUploadedVideo = async (indexToRemove: number) => {
    const updated = uploadedVideos.filter((_, idx) => idx !== indexToRemove);
    setUploadedVideos(updated);

    if (siteData) {
      setModifying(true);
      try {
        const res = await fetch('/api/leads/modify-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId: siteData.siteId,
            currentContent: siteData.content,
            directContent: { uploadedVideos: updated },
            lead
          })
        });
        const data = await res.json();
        if (data.success) {
          setSiteData(data);
          setJsonText(JSON.stringify(data.content, null, 2));
        }
      } catch (err) {
        console.error('Failed to delete video:', err);
      } finally {
        setModifying(false);
      }
    }
  };

  const handleSearchVideos = async (overrideQuery?: string, overrideSource?: string, overridePage?: number) => {
    const q = overrideQuery || videoSearchQuery;
    const s = overrideSource || videoSearchSource;
    const p = overridePage || 1;
    if (!q || !q.trim()) return;

    if (p === 1) {
      setIsSearchingVideos(true);
      setResearchedVideosList([]);
    } else {
      setIsLoadingMoreVideos(true);
    }

    try {
      const res = await fetch('/api/leads/research-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, source: s, page: p })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.videos)) {
        if (p === 1) {
          setResearchedVideosList(data.videos);
        } else {
          setResearchedVideosList(prev => [...prev, ...data.videos]);
        }
      }
    } catch (err) {
      console.error('Failed to search videos:', err);
    } finally {
      setIsSearchingVideos(false);
      setIsLoadingMoreVideos(false);
    }
  };

  const loadMoreVideos = () => {
    const nextPage = videoSearchPage + 1;
    setVideoSearchPage(nextPage);
    handleSearchVideos(videoSearchQuery, videoSearchSource, nextPage);
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;

    setIsGeneratingVideo(true);
    setVideoGenerationSteps([]);
    setCurrentVideoGenerationStep('');

    try {
      const res = await fetch('/api/leads/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: videoPrompt, siteId: siteData?.siteId })
      });
      const data = await res.json();

      if (data.success && data.steps && data.video) {
        // Animate simulated video generation pipeline steps
        for (let i = 0; i < data.steps.length; i++) {
          setCurrentVideoGenerationStep(data.steps[i]);
          setVideoGenerationSteps(prev => [...prev, data.steps[i]]);
          await new Promise(resolve => setTimeout(resolve, 900));
        }

        // Add the generated video directly into the curated video search list for selection
        setResearchedVideosList(prev => [
          {
            url: data.video.url,
            title: `AI Generated: ${videoPrompt}`,
            source: 'ai_generator',
            thumbnail: data.video.thumbnail || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop'
          },
          ...prev
        ]);
        setVideoPrompt('');
      }
    } catch (err) {
      console.error('Failed to generate prompt video:', err);
    } finally {
      setIsGeneratingVideo(false);
      setCurrentVideoGenerationStep('');
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

  const handleAutoAssignAllPinterestPhotos = async () => {
    if (!siteData) return;
    setModifying(true);
    try {
      let photosToUse = [...researchedPhotosList];
      if (photosToUse.length === 0) {
        const niche = siteData?.content?.nicheOverride || lead?.niche || lead?.sector || 'services';
        const q = `${niche} ${companyName} pinterest photo design`;
        const res = await fetch('/api/leads/research-photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, count: 20, lead, siteId: siteData?.siteId })
        });
        const data = await res.json();
        if (data.success && data.photos) {
          photosToUse = data.photos;
          setResearchedPhotosList(data.photos);
        }
      }

      if (!photosToUse || photosToUse.length === 0) {
        setModifying(false);
        return;
      }

      const currentContent = { ...siteData.content };
      if (photosToUse[0]) currentContent.heroImage = photosToUse[0];
      if (photosToUse[1]) currentContent.aboutImage = photosToUse[1];
      if (photosToUse[2]) currentContent.section1Image = photosToUse[2];
      if (photosToUse[3]) currentContent.section2Image = photosToUse[3];
      if (photosToUse[4]) {
        currentContent.catalogImage = photosToUse[4];
        currentContent.showcaseCarImage = photosToUse[4];
      }
      if (photosToUse[5]) currentContent.contactImage = photosToUse[5];

      // Ensure currentContent.services is populated for all 4 slots (method 1, 2, 3, 4)
      const baseServices = (Array.isArray(currentContent.services) && currentContent.services.length >= 4)
        ? currentContent.services
        : [
            { num: '01 · SERVICE', title: 'Service 01', desc: 'Description service 1' },
            { num: '02 · SERVICE', title: 'Service 02', desc: 'Description service 2' },
            { num: '03 · SERVICE', title: 'Service 03', desc: 'Description service 3' },
            { num: '04 · SERVICE', title: 'Service 04', desc: 'Description service 4' }
          ];

      currentContent.services = baseServices.map((srv: any, idx: number) => {
        const photoIdx = (6 + idx) < photosToUse.length ? (6 + idx) : (idx % photosToUse.length);
        const assignedUrl = photosToUse[photoIdx] || photosToUse[idx % photosToUse.length];
        return { ...srv, img: assignedUrl, image: assignedUrl, url: assignedUrl };
      });

      currentContent.service1Img = photosToUse[6] || photosToUse[0];
      currentContent.service2Img = photosToUse[7] || photosToUse[1];
      currentContent.service3Img = photosToUse[8] || photosToUse[2]; // 3rd image inside Notre Méthode!
      currentContent.service4Img = photosToUse[9] || photosToUse[3];
      currentContent.method1Img = currentContent.service1Img;
      currentContent.method2Img = currentContent.service2Img;
      currentContent.method3Img = currentContent.service3Img;
      currentContent.method4Img = currentContent.service4Img;

      if (Array.isArray(currentContent.portfolio) && currentContent.portfolio.length > 0) {
        currentContent.portfolio = currentContent.portfolio.map((p: any, idx: number) => {
          const photoIdx = 10 + idx;
          if (photosToUse[photoIdx]) {
            return { ...p, img: photosToUse[photoIdx], image: photosToUse[photoIdx] };
          }
          return p;
        });
      }

      currentContent.pinterestImages = photosToUse;
      currentContent.photos = Array.from(new Set([...(currentContent.photos || []), ...photosToUse]));

      const res = await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: siteData.siteId, currentContent, directContent: currentContent, lead })
      });
      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));

        const iframe = document.querySelector('iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'PINTEREST_PHOTOS', photos: photosToUse, images: photosToUse }, '*');
          if (photosToUse[0]) iframe.contentWindow.postMessage({ type: 'UPDATE_IMAGE', field: 'heroImage', url: photosToUse[0] }, '*');
          if (photosToUse[1]) iframe.contentWindow.postMessage({ type: 'UPDATE_IMAGE', field: 'aboutImage', url: photosToUse[1] }, '*');
          if (photosToUse[2]) iframe.contentWindow.postMessage({ type: 'UPDATE_IMAGE', field: 'section1Image', url: photosToUse[2] }, '*');
          if (photosToUse[3]) iframe.contentWindow.postMessage({ type: 'UPDATE_IMAGE', field: 'section2Image', url: photosToUse[3] }, '*');
          if (photosToUse[4]) iframe.contentWindow.postMessage({ type: 'UPDATE_IMAGE', field: 'catalogImage', url: photosToUse[4] }, '*');
          if (photosToUse[5]) iframe.contentWindow.postMessage({ type: 'UPDATE_IMAGE', field: 'contactImage', url: photosToUse[5] }, '*');
          if (photosToUse[6]) iframe.contentWindow.postMessage({ type: 'UPDATE_IMAGE', field: 'photoCard', url: photosToUse[6] }, '*');
          if (photosToUse[7]) iframe.contentWindow.postMessage({ type: 'UPDATE_IMAGE', field: 'card1', url: photosToUse[7] }, '*');
          if (photosToUse[8]) iframe.contentWindow.postMessage({ type: 'UPDATE_IMAGE', field: 'card2', url: photosToUse[8] }, '*');
          if (photosToUse[9]) iframe.contentWindow.postMessage({ type: 'UPDATE_IMAGE', field: 'faqPhoto', url: photosToUse[9] }, '*');
        }
      }
    } catch (err) {
      console.error('Failed to auto-assign all Pinterest photos:', err);
    } finally {
      setModifying(false);
    }
  };

  const handleAssignImage = async (
    imgUrl: string,
    target: { 
      type: 'hero' | 'about' | 'gallery' | 'service' | 'portfolio' | 'heroVideo' | 'section2Video' | 'showcaseCutout' | 'program1' | 'program2' | 'program3' | 'program4' | 'card1' | 'card2' | 'card3' | 'hero3d' | 'catalog3d' | 'section1' | 'section2' | 'contact' | 'catalog'; 
      index?: number 
    }
  ) => {
    if (!siteData) return;
    setModifying(true);
    try {
      const currentContent = { ...siteData.content };

      if (target.type === 'hero') {
        currentContent.heroImage = imgUrl;
      } else if (target.type === 'hero3d') {
        currentContent.model3dUrl = imgUrl;
        currentContent.show3dHero = true;
      } else if (target.type === 'catalog3d') {
        currentContent.model3dUrl = imgUrl;
        currentContent.show3dCatalog = true;
      } else if (target.type === 'about') {
        currentContent.aboutImage = imgUrl;
      } else if (target.type === 'section1') {
        currentContent.section1Image = imgUrl;
      } else if (target.type === 'section2') {
        currentContent.section2Image = imgUrl;
      } else if (target.type === 'contact') {
        currentContent.contactImage = imgUrl;
      } else if (target.type === 'catalog') {
        currentContent.catalogImage = imgUrl;
        currentContent.showcaseCarImage = imgUrl;
      } else if (target.type === 'heroVideo') {
        currentContent.heroVideo = imgUrl;
      } else if (target.type === 'section2Video') {
        currentContent.section2Video = imgUrl;
      } else if (target.type === 'showcaseCutout') {
        currentContent.showcaseCarImage = imgUrl;
        currentContent.showcaseCutout = imgUrl;
        if (imgUrl.includes('video') || imgUrl.endsWith('.mp4') || imgUrl.endsWith('.webm') || imgUrl.includes('youtube') || imgUrl.includes('vimeo')) {
          currentContent.showcaseVideo = imgUrl;
        }
      } else if (target.type === 'program1') {
        currentContent.program1Image = imgUrl;
        currentContent.notebookImage = imgUrl;
      } else if (target.type === 'program2') {
        currentContent.program2Image = imgUrl;
        currentContent.tabletImage = imgUrl;
      } else if (target.type === 'program3') {
        currentContent.program3Image = imgUrl;
        currentContent.steeringWheelImage = imgUrl;
      } else if (target.type === 'program4') {
        currentContent.program4Image = imgUrl;
        currentContent.motorcycleImage = imgUrl;
      } else if (target.type === 'card1') {
        currentContent.card1Image = imgUrl;
        currentContent.autoCarImage = imgUrl;
      } else if (target.type === 'card2') {
        currentContent.card2Image = imgUrl;
        currentContent.manualCarImage = imgUrl;
      } else if (target.type === 'card3') {
        currentContent.card3Image = imgUrl;
        currentContent.motoAcademyImage = imgUrl;
      } else if (target.type === 'gallery') {
        const existingPhotos = Array.isArray(currentContent.photos) ? [...currentContent.photos] : [];
        if (!existingPhotos.includes(imgUrl)) {
          currentContent.photos = [imgUrl, ...existingPhotos];
        }
      } else if (target.type === 'service' && typeof target.index === 'number') {
        const idx = target.index;
        const services = Array.isArray(currentContent.services) && currentContent.services.length > 0 ? [...currentContent.services] : [
          { num: '01 · SERVICE', title: 'Service 01', desc: 'Description service 1' },
          { num: '02 · SERVICE', title: 'Service 02', desc: 'Description service 2' },
          { num: '03 · SERVICE', title: 'Service 03', desc: 'Description service 3' },
          { num: '04 · SERVICE', title: 'Service 04', desc: 'Description service 4' }
        ];
        if (!services[idx]) {
          services[idx] = { num: `0${idx + 1} · SERVICE`, title: `Service ${idx + 1}`, desc: '' };
        }
        services[idx] = { ...services[idx], img: imgUrl, image: imgUrl, url: imgUrl };
        currentContent.services = services;
        currentContent[`service${idx + 1}Img`] = imgUrl;
        currentContent[`method${idx + 1}Img`] = imgUrl;
        currentContent[`step${idx + 1}Img`] = imgUrl;
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

        const iframe = document.querySelector('iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'UPDATE_IMAGE',
            field: target.type === 'hero' ? 'heroImage' :
                   target.type === 'about' ? 'aboutImage' :
                   target.type === 'section1' ? 'section1Image' :
                   target.type === 'section2' ? 'section2Image' :
                   target.type === 'contact' ? 'contactImage' :
                   target.type === 'catalog' ? 'catalogImage' : target.type,
            url: imgUrl,
            index: target.index
          }, '*');
        }
      }
    } catch (err) {
      console.error('Failed to assign image placement:', err);
    } finally {
      setModifying(false);
    }
  };

  const renderPlacementSelector = (photoUrl: string, is3D = false) => {
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
            <span>Assign to Section</span>
            <Sparkles size={10} className="text-amber-400" />
          </div>

          {is3D ? (
            <>
              <button
                onClick={() => {
                  handleAssignImage(photoUrl, { type: 'hero3d' });
                  setOpenSelectorUrl(null);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
              >
                <Sparkles size={12} className="text-amber-400 shrink-0" /> Hero 3D Model
              </button>
              <button
                onClick={() => {
                  handleAssignImage(photoUrl, { type: 'catalog3d' });
                  setOpenSelectorUrl(null);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-blue-300 hover:bg-blue-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
              >
                <Globe size={12} className="text-blue-400 shrink-0" /> Catalog 3D Model
              </button>
            </>
          ) : (
            <>

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
              handleAssignImage(photoUrl, { type: 'heroVideo' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-amber-500 hover:bg-amber-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Video size={12} className="text-amber-500 shrink-0" /> Hero Background Video
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'showcaseCutout' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-rose-300 hover:bg-rose-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Play size={12} className="text-rose-400 shrink-0" /> Showcase Cutout / Video
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'program1' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-sky-300 hover:bg-sky-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Sparkles size={12} className="text-sky-400 shrink-0" /> Feature 1 (Primary Showcase)
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'program2' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-sky-300 hover:bg-sky-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Sparkles size={12} className="text-sky-400 shrink-0" /> Feature 2 (Secondary Showcase)
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'program3' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-sky-300 hover:bg-sky-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Sparkles size={12} className="text-sky-400 shrink-0" /> Feature 3 (Steering Wheel / Craft)
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'program4' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-sky-300 hover:bg-sky-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Sparkles size={12} className="text-sky-400 shrink-0" /> Feature 4 (Motorcycle Track)
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'card1' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Star size={12} className="text-emerald-400 shrink-0" /> Offer Card 1 (Permit B / Primary)
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'card2' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Star size={12} className="text-emerald-400 shrink-0" /> Offer Card 2 (Manual / Secondary)
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'card3' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Star size={12} className="text-emerald-400 shrink-0" /> Offer Card 3 (Moto / Specialty)
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
              handleAssignImage(photoUrl, { type: 'section1' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Star size={12} className="text-amber-400 shrink-0" /> Market Card 1 / Section 1
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'section2' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Star size={12} className="text-amber-400 shrink-0" /> Market Card 2 / Section 2
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'catalog' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-indigo-300 hover:bg-indigo-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Image size={12} className="text-indigo-400 shrink-0" /> Catalog / Showcase Image
          </button>
          <button
            onClick={() => {
              handleAssignImage(photoUrl, { type: 'contact' });
              setOpenSelectorUrl(null);
            }}
            className="w-full text-left px-2.5 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20 rounded-lg flex items-center gap-2 font-semibold transition cursor-pointer"
          >
            <Globe size={12} className="text-emerald-400 shrink-0" /> Contact Section Image
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
    setSelectedBatchNiche(niche);
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

  const handleThemePaletteChange = async (paletteId: string) => {
    const selected = COLOR_PALETTES.find(p => p.id === paletteId) || COLOR_PALETTES[0];
    if (!siteData) return;
    setModifying(true);

    // Send zero-flicker live postMessage to preview iframe
    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'UPDATE_THEME',
        palette: {
          hex: selected.hex,
          glow: selected.glow,
          bg: selected.bg
        }
      }, '*');
    }

    try {
      const res = await fetch('/api/leads/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.siteId,
          currentContent: siteData.content,
          directContent: {
            themePalette: paletteId,
            accentColor: selected.hex,
            primaryColor: selected.hex,
            accentGlow: selected.glow
          },
          lead
        })
      });
      const data = await res.json();
      if (data.success) {
        setSiteData(data);
        setJsonText(JSON.stringify(data.content, null, 2));
      }
    } catch (err) {
      console.error('Failed to change theme palette:', err);
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

  // CSV Bulk Generator Functions
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: CsvLeadRow[] = (results.data as any[]).map((row, idx) => {
          const businessName = row['Business Name'] || row['Company'] || row['Name'] || row['businessName'] || row['company'] || `Business ${idx + 1}`;
          const phone = row['Phone'] || row['Phone Number'] || row['phone'] || row['Telephone'] || '+33 6 12 34 56 78';
          const email = row['Email'] || row['Email Address'] || row['email'] || `contact@${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
          const address = row['Address'] || row['address'] || row['Location'] || '10 Place Vendôme';
          const city = row['City'] || row['city'] || row['Town'] || 'Paris';
          const niche = row['Niche'] || row['Sector'] || row['niche'] || 'Services Professionnels';
          const website = row['Website'] || row['website'] || '';

          return {
            id: `csv-${Date.now()}-${idx}`,
            businessName,
            phone,
            email,
            address,
            city,
            niche,
            website,
            status: 'pending'
          };
        });
        setCsvLeads(rows);
      }
    });
  };

  const handleLoadSampleCsvLeads = () => {
    const samples: CsvLeadRow[] = [
      {
        id: `csv-sample-1`,
        businessName: 'Outland Luxury Real Estate',
        phone: '+33 6 64 14 36 79',
        email: 'contact@outlandhomes.fr',
        address: '15 Avenue Montaigne',
        city: 'Paris 8e',
        niche: 'Real Estate / Immobilier',
        status: 'pending'
      },
      {
        id: `csv-sample-2`,
        businessName: 'Élan Auto-École Prestige',
        phone: '+33 1 45 88 90 12',
        email: 'contact@elanpermis.com',
        address: '24 Rue de la République',
        city: 'Lyon',
        niche: 'Driving School / Formation',
        status: 'pending'
      },
      {
        id: `csv-sample-3`,
        businessName: 'Gourmand Traiteur & Saveurs',
        phone: '+33 5 56 00 11 22',
        email: 'reservation@gourmand-traiteur.fr',
        address: '8 Place de la Bourse',
        city: 'Bordeaux',
        niche: 'Gastronomy & Catering',
        status: 'pending'
      },
      {
        id: `csv-sample-4`,
        businessName: 'Volt-Pro Électricité Générale',
        phone: '+33 4 93 80 40 50',
        email: 'urgence@voltpro-electricite.com',
        address: '42 Boulevard Victor Hugo',
        city: 'Nice',
        niche: 'Electrician / Dépannage',
        status: 'pending'
      }
    ];
    setCsvLeads(samples);
  };

  const handleStopBulkGeneration = () => {
    stopBulkGenerationRef.current = true;
  };

  const generateCsvSiteForLead = async (item: CsvLeadRow): Promise<{ success: boolean; html?: string; error?: string }> => {
    const targetLead = {
      name: item.businessName,
      companyName: item.businessName,
      company: item.businessName,
      businessName: item.businessName,
      phone: item.phone,
      email: item.email,
      address: item.address,
      city: item.city,
      niche: item.niche,
      sector: item.niche,
      lang: item.lang
    };

    const effectiveLang = selectedBulkLang !== 'auto'
      ? selectedBulkLang
      : (item.market?.includes('english') || item.lang === 'en' ? 'en' : 'fr');

    // If siteData.content exists (the active preview website edited by user), clone its exact style & images!
    if (siteData?.content) {
      const res = await fetch('/api/leads/clone-site-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceContent: siteData.content,
          templateStyle: selectedBulkTemplate || siteData.content?.templateStyle,
          targetLead,
          langOverride: effectiveLang
        })
      });

      const data = await res.json();
      if (data.success && data.html) {
        return { success: true, html: data.html };
      } else {
        return { success: false, error: data.error || 'Cloning preview website failed' };
      }
    } else {
      // Fallback: Generate fresh site from template
      const res = await fetch('/api/leads/generate-site-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: targetLead,
          templateStyle: selectedBulkTemplate,
          langOverride: effectiveLang
        })
      });

      const data = await res.json();
      if (data.success && data.html) {
        return { success: true, html: data.html };
      } else {
        return { success: false, error: data.error || 'Generation failed' };
      }
    }
  };

  const handleGenerateSingleLead = async (row: CsvLeadRow) => {
    setCsvLeads(prev => prev.map(r => r.id === row.id ? { ...r, status: 'generating' } : r));

    try {
      const res = await generateCsvSiteForLead(row);
      if (res.success && res.html) {
        setCsvLeads(prev => prev.map(r => r.id === row.id ? {
          ...r,
          status: 'completed',
          html: res.html,
          generatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        } : r));
      } else {
        setCsvLeads(prev => prev.map(r => r.id === row.id ? { ...r, status: 'error', errorMessage: res.error || 'Generation failed' } : r));
      }
    } catch (err: any) {
      setCsvLeads(prev => prev.map(r => r.id === row.id ? { ...r, status: 'error', errorMessage: err?.message || 'Error' } : r));
    }
  };

  const handleRunBulkGeneration = async () => {
    if (csvLeads.length === 0) return;
    stopBulkGenerationRef.current = false;
    setIsBulkGenerating(true);
    setBulkProgress({ current: 0, total: csvLeads.length });

    const updatedLeads = [...csvLeads];

    for (let i = 0; i < updatedLeads.length; i++) {
      if (stopBulkGenerationRef.current) {
        console.log('[Bulk Gen] Stop requested by user');
        break;
      }

      const item = updatedLeads[i];
      item.status = 'generating';
      setCsvLeads([...updatedLeads]);
      setBulkProgress({ current: i + 1, total: updatedLeads.length });

      try {
        const resData = await generateCsvSiteForLead(item);
        if (resData.success && resData.html) {
          item.status = 'completed';
          item.html = resData.html;
          item.generatedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } else {
          item.status = 'error';
          item.errorMessage = resData.error || 'Generation failed';
        }
      } catch (err: any) {
        item.status = 'error';
        item.errorMessage = err?.message || 'Network error';
      }

      setCsvLeads([...updatedLeads]);
    }

    setIsBulkGenerating(false);
  };

  const handleAnalyzeRawText = async () => {
    if (!rawTextContent.trim()) return;
    setIsAnalyzingText(true);
    try {
      const res = await fetch('/api/leads/parse-unstructured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: rawTextContent })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        const parsedRows: CsvLeadRow[] = data.leads.map((l: any, idx: number) => ({
          id: `raw_${Date.now()}_${idx}`,
          businessName: l.businessName || l.companyName || l.name || 'Business',
          phone: l.phone || l.phoneNumber || '',
          email: l.email || '',
          address: l.address || '',
          city: l.city || '',
          niche: l.niche || l.sector || 'Services',
          status: 'pending',
          deployStatus: 'idle'
        }));
        setCsvLeads(prev => [...prev, ...parsedRows]);
        setRawTextContent('');
        setRawTextModalOpen(false);
      } else {
        alert(data.error || 'Failed to analyze text.');
      }
    } catch (err: any) {
      alert(err.message || 'Error analyzing text.');
    } finally {
      setIsAnalyzingText(false);
    }
  };

  const handleRunWaBulkOutreach = async () => {
    const validLeads = csvLeads.filter(r => (r.phone && r.phone.length >= 6));
    if (validLeads.length === 0) {
      alert('No leads with valid phone numbers in the table.');
      return;
    }
    setIsWaBulkSending(true);
    setWaBulkLogs([`Initiating WhatsApp bulk campaign for ${validLeads.length} leads with delay of ${waBulkDelay}s...`]);

    try {
      const formattedLeads = validLeads.map(l => ({
        name: l.businessName,
        phone: l.phone,
        city: l.city,
        siteUrl: l.netlifyUrl || l.website || (l.html ? 'https://preview.site' : '')
      }));

      const res = await fetch('/api/whatsapp/send-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leads: formattedLeads,
          messageTemplate: waBulkMessage,
          delaySeconds: waBulkDelay,
          attachScreenshot: true
        })
      });

      const data = await res.json();
      if (data.success) {
        setWaBulkLogs(prev => [...prev, `✓ WhatsApp campaign dispatched! ${data.message || ''}`]);
      } else {
        setWaBulkLogs(prev => [...prev, `✕ Campaign error: ${data.error}`]);
      }
    } catch (err: any) {
      setWaBulkLogs(prev => [...prev, `✕ Network error: ${err.message}`]);
    } finally {
      setIsWaBulkSending(false);
    }
  };

  const handleUpdateCsvLeadField = (id: string, field: keyof CsvLeadRow, val: string) => {
    setCsvLeads(prev => prev.map(row => {
      if (row.id !== id) return row;
      const updated = { ...row, [field]: val };
      if (updated.html) {
        let patched = updated.html;
        if (field === 'phone' && row.phone) {
          patched = patched.replace(new RegExp(row.phone.replace(/\+/g, '\\+'), 'g'), val);
        } else if (field === 'email' && row.email) {
          patched = patched.replace(new RegExp(row.email, 'g'), val);
        } else if (field === 'businessName' && row.businessName) {
          patched = patched.replace(new RegExp(row.businessName, 'g'), val);
        } else if (field === 'city' && row.city) {
          patched = patched.replace(new RegExp(row.city, 'g'), val);
        } else if (field === 'address' && row.address) {
          patched = patched.replace(new RegExp(row.address, 'g'), val);
        }
        updated.html = patched;
      }
      return updated;
    }));
  };

  const handleDownloadSingleLeadHtml = (row: CsvLeadRow) => {
    if (!row.html) return;
    const blob = new Blob([row.html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedName = (row.businessName || 'website').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const sanitizedCity = (row.city || 'city').toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `${sanitizedName}_${sanitizedCity}_${selectedBulkTemplate}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllWebsitesZip = async () => {
    const completedLeads = csvLeads.filter(r => r.status === 'completed' && r.html);
    if (completedLeads.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder(`Bulk_Generated_Websites_${selectedBulkTemplate}`);

    completedLeads.forEach((row, idx) => {
      const sanitizedName = (row.businessName || `business_${idx + 1}`).replace(/[^a-zA-Z0-9]/g, '_');
      const sanitizedCity = (row.city || 'city').replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${idx + 1}_${sanitizedName}_${sanitizedCity}.html`;
      (folder || zip).file(fileName, row.html!);
    });

    const zipContent = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipContent);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bulk_Websites_${selectedBulkTemplate}_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeploySingleLeadToNetlify = async (row: CsvLeadRow) => {
    if (!row.html) return;

    setCsvLeads(prev => prev.map(r => r.id === row.id ? { ...r, deployStatus: 'deploying' } : r));

    try {
      const cleanSiteName = `${row.businessName}-${row.city}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const token = netlifyToken || localStorage.getItem('NETLIFY_AUTH_TOKEN') || '';

      const res = await fetch('/api/netlify/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: row.html,
          siteName: cleanSiteName,
          netlifyToken: token.trim(),
          leadId: row.id
        })
      });

      const data = await res.json();
      if (data.success) {
        setCsvLeads(prev => prev.map(r => {
          if (r.id !== row.id) return r;
          return {
            ...r,
            deployStatus: 'deployed',
            netlifyUrl: data.url,
            netlifySiteName: data.siteName
          };
        }));
      } else {
        setCsvLeads(prev => prev.map(r => r.id === row.id ? { ...r, deployStatus: 'error', errorMessage: data.error || 'Deploy failed' } : r));
      }
    } catch (err: any) {
      setCsvLeads(prev => prev.map(r => r.id === row.id ? { ...r, deployStatus: 'error', errorMessage: err?.message || 'Deploy failed' } : r));
    }
  };

  const handleDeployAllToNetlify = async () => {
    const readyLeads = csvLeads.filter(r => r.status === 'completed' && r.html);
    if (readyLeads.length === 0) return;

    setIsBulkDeployingNetlify(true);
    setBulkDeployProgress({ current: 0, total: readyLeads.length });

    const updated = [...csvLeads];

    for (let i = 0; i < updated.length; i++) {
      const row = updated[i];
      if (row.status !== 'completed' || !row.html) continue;

      row.deployStatus = 'deploying';
      setCsvLeads([...updated]);
      setBulkDeployProgress({ current: i + 1, total: readyLeads.length });

      try {
        const cleanSiteName = `${row.businessName}-${row.city}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const token = netlifyToken || localStorage.getItem('NETLIFY_AUTH_TOKEN') || '';

        const res = await fetch('/api/netlify/deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            html: row.html,
            siteName: cleanSiteName,
            netlifyToken: token.trim(),
            leadId: row.id
          })
        });

        const data = await res.json();
        if (data.success) {
          row.deployStatus = 'deployed';
          row.netlifyUrl = data.url;
          row.netlifySiteName = data.siteName;
        } else {
          row.deployStatus = 'error';
        }
      } catch (err: any) {
        row.deployStatus = 'error';
      }

      setCsvLeads([...updated]);
    }

    setIsBulkDeployingNetlify(false);
  };

  const companyName = lead.name || lead.companyName || lead.company || lead.businessName || 'Lead';

  return (
    <>
      <div className={`fixed inset-0 z-[99999] flex flex-col animate-fade-in w-screen h-screen overflow-hidden transition-colors duration-300 ${frameTheme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#050505] text-white'}`}>
        
        {/* MINIMALIST HEADER */}
        <div className={`h-14 px-2 sm:px-4 flex items-center justify-between shrink-0 select-none border-b transition-colors duration-300 ${frameTheme === 'light' ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-[#111111] border-[#1C1C1E] text-white'}`}>
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-none flex-1 pr-4" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
            <Globe size={18} className={frameTheme === 'light' ? 'text-slate-500 shrink-0 ml-1 hidden sm:block' : 'text-zinc-500 shrink-0 ml-1 hidden sm:block'} />
            
            <div className="flex items-center gap-1 shrink-0">
              {[
                { id: 'preview', label: 'PREVIEW', icon: <Eye size={13} /> },
                { id: 'transparent-slider', label: 'TRANSPARENT SLIDER', icon: <ChevronsLeftRight size={13} /> },
                { id: 'deploy-outreach', label: 'DEPLOY & OUTREACH', icon: <Rocket size={13} /> },
                { id: 'scroll-video', label: 'SCROLL VIDEO', icon: <Video size={13} /> },
                { id: 'schema', label: 'CONTENT', icon: <Code size={13} /> },
                { id: 'media', label: 'EDIT IMAGES', icon: <Pencil size={13} /> },
                { id: '3d-studio', label: '3D AI', icon: <Box size={13} /> },
                { id: 'gif', label: 'OUTREACH GIF', icon: <Zap size={13} /> },
                { id: 'trust', label: 'TRUST', icon: <ShieldCheck size={13} /> },
                { id: 'templates', label: 'TEMPLATES', icon: <Sparkles size={13} /> },
                { id: 'template-maker', label: 'TEMPLATE MAKER', icon: <Wand2 size={13} /> },
                { id: 'csv-bulk-generator', label: 'CSV BULK GENERATOR', icon: <FileSpreadsheet size={13} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] tracking-wider font-bold transition shrink-0 ${
                    activeTab === tab.id
                      ? frameTheme === 'light'
                        ? 'bg-amber-400 text-slate-950 border border-amber-300 shadow-sm font-black'
                        : 'bg-[#1C1C1E] text-white border border-[#2C2C2E] shadow-sm'
                      : frameTheme === 'light'
                        ? 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-transparent'
                        : 'bg-transparent text-zinc-500 hover:text-zinc-300 border border-transparent'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 pl-4">
            {siteData?.previewUrl && (
              <a
                href={siteData.previewUrl}
                target="_blank"
                rel="noreferrer"
                className={`text-[11px] font-bold transition flex items-center gap-1 tracking-wider uppercase ${frameTheme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <ExternalLink size={13} /> Open
              </a>
            )}
            
            <button
              onClick={handleLoadProject}
              className="text-[11px] font-bold text-emerald-500 hover:text-emerald-400 transition flex items-center gap-1 tracking-wider uppercase cursor-pointer"
              title="Load Saved Project"
            >
              LOAD
            </button>
            <button
              onClick={handleSaveProject}
              className="text-[11px] font-bold text-amber-500 hover:text-amber-400 transition flex items-center gap-1 tracking-wider uppercase cursor-pointer"
              title="Save Project"
            >
              SAVE
            </button>
            <button
              onClick={handleDownloadZip}

              disabled={downloadingZip || !siteData}
              className={`text-[11px] font-bold transition disabled:opacity-50 flex items-center gap-1 tracking-wider uppercase cursor-pointer ${frameTheme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Download size={13} /> ZIP
            </button>
            <a
              href="https://app.netlify.com/drop"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-cyan-500 hover:text-cyan-300 transition flex items-center gap-1 tracking-wider uppercase"
              title="Deploy ZIP to Netlify"
            >
              <Zap size={13} /> NETLIFY
            </a>
            <div className={`w-px h-4 mx-1 ${frameTheme === 'light' ? 'bg-slate-300' : 'bg-[#2C2C2E]'}`}></div>
            <button 
              onClick={onClose}
              className={`p-1.5 rounded-md transition cursor-pointer border ${frameTheme === 'light' ? 'bg-slate-100 text-slate-700 hover:text-slate-950 border-slate-300' : 'bg-[#1C1C1E] text-zinc-400 hover:text-white border-[#2C2C2E]'}`}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* PREVIEW SETTINGS BAR (Only visible on preview tab) */}
        {activeTab === 'preview' && (
          <div className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-4 shrink-0 transition-colors duration-300 ${frameTheme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0A0A0A] border-[#1A1A1A] text-white'}`}>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {/* Language Selector */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs shrink-0 ${frameTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#121212] border-[#1F1F1F] text-zinc-300'}`}>
                <select
                  value={selectedLang}
                  onChange={(e) => handleLangChange(e.target.value)}
                  className={`bg-transparent text-xs font-semibold focus:outline-none cursor-pointer ${frameTheme === 'light' ? 'text-slate-900' : 'text-white'}`}
                >
                  <option value="auto" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🌐 Auto</option>
                  <option value="fr" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🇫🇷 FR</option>
                  <option value="en" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🇺🇸 EN</option>
                </select>
              </div>

              {/* Theme Palette */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs shrink-0 ${frameTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#121212] border-[#1F1F1F] text-zinc-300'}`}>
                <Palette size={13} className="text-amber-500" />
                <select
                  value={siteData?.content?.themePalette || 'gold'}
                  onChange={(e) => handleThemePaletteChange(e.target.value)}
                  className={`bg-transparent text-xs font-semibold focus:outline-none cursor-pointer ${frameTheme === 'light' ? 'text-slate-900' : 'text-white'}`}
                  title="Select Live Tailwind & CSS Custom Theme Palette"
                >
                  {COLOR_PALETTES.map(p => (
                    <option key={p.id} value={p.id} className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B] text-white'}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Style & Theme Mode */}
              <div className={`flex items-center px-2.5 py-1.5 rounded-lg border text-xs shrink-0 gap-2 ${frameTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#121212] border-[#1F1F1F] text-zinc-300'}`}>
                <select
                  value={siteData?.content?.templateStyle || 'lumina'}
                  onChange={(e) => handleTemplateStyleChange(e.target.value)}
                  className={`bg-transparent text-xs font-semibold focus:outline-none cursor-pointer max-w-[150px] truncate ${frameTheme === 'light' ? 'text-slate-900' : 'text-white'}`}
                >
                  <option value="lumina" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🛍️ LUMINA Dropshipping (AI Try-On)</option>
                  <option value="elan-permis" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🏎️ ÉLAN Permis (Auto-École & Multi-Niche)</option>
                  <option value="air-template" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>💨 Air Bubbles</option>
                  <option value="outland-homes" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🌲 Outland Template</option>
                  <option value="main-neumorphic" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🔮 Main Neumorphic Cutouts</option>
                  <option value="cinematic-luxury" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🎥 Cinematic Luxury</option>
                  <option value="premium-dark" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>✨ Premium Dark</option>
                  <option value="luxury-serif" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>👑 Luxury Serif</option>
                  <option value="classic" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>💼 Classic Modern</option>
                </select>

                <div className={`w-px h-4 mx-1 ${frameTheme === 'light' ? 'bg-slate-300' : 'bg-zinc-800'}`}></div>

                <select
                  value={siteData?.content?.themeMode === 'cream' ? 'cream' : 'dark'}
                  onChange={async (e) => {
                    const style = e.target.value;
                    if (!siteData) return;
                    setModifying(true);
                    try {
                      const res = await fetch('/api/leads/modify-content', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          siteId: siteData.siteId,
                          currentContent: siteData.content,
                          directContent: { themeMode: style },
                          lead
                        })
                      });
                      const data = await res.json();
                      if (data.success) {
                        setSiteData(data.siteData);
                        setJsonText(JSON.stringify(data.siteData.content, null, 2));
                      }
                    } catch(err) {}
                    setModifying(false);
                  }}
                  className="bg-transparent text-xs text-amber-500 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="dark" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🌙 Dark Mode</option>
                  <option value="cream" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>☕ Cream Mode</option>
                </select>
              </div>

              {/* Niche Selector */}
              <div className={`flex items-center px-2.5 py-1.5 rounded-lg border text-xs shrink-0 ${frameTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#121212] border-[#1F1F1F] text-zinc-300'}`}>
                <select
                  value={siteData?.content?.nicheOverride || lead?.niche || 'construction'}
                  onChange={(e) => handleNicheChange(e.target.value)}
                  className={`bg-transparent text-xs font-semibold focus:outline-none cursor-pointer max-w-[150px] truncate ${frameTheme === 'light' ? 'text-slate-900' : 'text-white'}`}
                >
                  <option value="construction" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🏗️ Estate Construction</option>
                  <option value="architecture" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🏛️ Architects & Spatial Engineering</option>
                  <option value="car_rental" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🏎️ Exotic Car Rental</option>
                  <option value="consulting" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>💼 High-Ticket Consulting</option>
                  <option value="landscaping" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🌿 Landscaping & Estates</option>
                  <option value="driving_school" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🚗 Driving Academy</option>
                  <option value="caterer" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🍽️ Fine Catering</option>
                  <option value="veneers" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🦷 Veneers & Dentistry</option>
                  <option value="renovation" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🏠 Home Renovations</option>
                  <option value="restaurant" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🍷 Restaurant</option>
                  <option value="electrician" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>⚡ Électricien</option>
                  <option value="plumber" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🚰 Plombier</option>
                  <option value="roofer" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🏠 Couvreur</option>
                  <option value="locksmith" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🔑 Serrurier</option>
                  <option value="realEstate" className={frameTheme === 'light' ? 'bg-white text-slate-900' : 'bg-[#18181B]'}>🏢 Immobilière</option>
                </select>
              </div>

              {/* Analyze & Match Niche Button */}
              <button
                onClick={handleAnalyzeAndRealignNiche}
                disabled={modifying || !siteData}
                className="px-3 py-1.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-400 hover:from-teal-400 hover:to-cyan-400 text-zinc-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-md shadow-teal-500/20 shrink-0 border border-teal-300/40"
              >
                {modifying ? <RefreshCw size={12} className="animate-spin text-zinc-950" /> : <Wand2 size={12} className="text-zinc-950" />}
                <span>Analyze Niche</span>
              </button>
            </div>

            {/* AI EDIT INPUT */}
            <div className="flex-1 min-w-[250px] max-w-md flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask AI to change layout, colors, text..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleModifyWithAI()}
                className={`flex-1 border focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs placeholder-zinc-400 focus:outline-none transition ${frameTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-[#121212] border-[#1F1F1F] text-white'}`}
              />
              <button
                onClick={handleModifyWithAI}
                disabled={modifying || !aiPrompt.trim()}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition disabled:opacity-40 flex items-center gap-1 cursor-pointer shrink-0"
              >
                {modifying ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />} Apply
              </button>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-hidden relative bg-transparent">
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
                <div className="w-full h-full p-3 sm:p-5 flex flex-col relative overflow-hidden bg-gradient-to-b from-black/40 via-zinc-950/60 to-black/80 backdrop-blur-2xl">
                  {/* TOP ACTIONS RIBBON */}
                  <div className="mb-2 px-3 py-1.5 bg-[#121218]/90 backdrop-blur-xl border border-amber-500/20 rounded-xl flex items-center justify-between gap-3 shrink-0 shadow-lg select-none">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFrameTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                          frameTheme === 'light'
                            ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-sm'
                            : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:text-white'
                        }`}
                        title="Toggle Frame Theme between Dark Glass and Clean Light Frame"
                      >
                        {frameTheme === 'light' ? <Sun size={12} /> : <Moon size={12} />}
                        <span>{frameTheme === 'light' ? 'Light Frame' : 'Dark Frame'}</span>
                      </button>

                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                        <Sparkles size={13} className="text-amber-400" />
                        <span>Niche Website Live Preview</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const niche = siteData?.content?.nicheOverride || lead?.niche || lead?.sector || 'services';
                        const q = `${niche} ${companyName} pinterest photo design`;
                        handleResearchPhotos(q);
                      }}
                      disabled={researchingPhotos}
                      className="px-3 py-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-extrabold text-xs rounded-lg flex items-center gap-1.5 shrink-0 shadow-md shadow-rose-500/25 border border-pink-400/30 cursor-pointer"
                      title="Search Pinterest automatically based on niche first & fill missing site photos"
                    >
                      <Search size={12} className={researchingPhotos ? "animate-spin" : ""} />
                      <span>{researchingPhotos ? "Searching..." : "📌 Auto-Fill Pinterest Images"}</span>
                    </button>
                  </div>

                  {/* TRANSLUCENT FROSTED EDGE CONTAINER */}
                  <div className={`w-full h-full rounded-2xl flex flex-col overflow-hidden transition-all duration-300 relative ${
                    frameTheme === 'light'
                      ? 'bg-slate-100 border border-slate-300 text-slate-900 shadow-2xl ring-1 ring-slate-200'
                      : 'bg-[#0B0C10]/60 backdrop-blur-3xl border border-white/15 text-white shadow-[0_20px_80px_rgba(0,0,0,0.85)] ring-1 ring-white/10'
                  }`}>
                    
                    {/* FROSTED BROWSER CHROME HEADER */}
                    <div className={`px-4 py-2.5 backdrop-blur-md border-b flex items-center justify-between gap-3 shrink-0 select-none ${
                      frameTheme === 'light' ? 'bg-slate-200/90 border-slate-300 text-slate-800' : 'bg-zinc-900/40 border-white/10 text-white'
                    }`}>
                      <div className="flex items-center gap-2">
                        {/* Mac Window Control Dots */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-90 shadow-sm inline-block" />
                          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-90 shadow-sm inline-block" />
                          <span className="w-3 h-3 rounded-full bg-[#27C93F] opacity-90 shadow-sm inline-block" />
                        </div>

                        {/* URL Pill Badge */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-mono text-zinc-300 max-w-xs md:max-w-md truncate transition">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span className="truncate">{siteData?.previewUrl || `https://${(companyName).toLowerCase().replace(/[^a-z0-9]/g, '')}.nesta.ai`}</span>
                        </div>
                      </div>

                      {/* RESPONSIVE DEVICE VIEWPORT MODE TOGGLES */}
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10">
                        <button
                          onClick={() => setViewMode('desktop')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            viewMode === 'desktop'
                              ? 'bg-white/20 text-white border border-white/20 shadow-md'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                          title="Desktop View (100%)"
                        >
                          <Monitor size={13} />
                          <span className="hidden md:inline">Desktop</span>
                        </button>
                        <button
                          onClick={() => setViewMode('tablet')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            viewMode === 'tablet'
                              ? 'bg-white/20 text-white border border-white/20 shadow-md'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                          title="Tablet View (768px)"
                        >
                          <Tablet size={13} />
                          <span className="hidden md:inline">Tablet</span>
                        </button>
                        <button
                          onClick={() => setViewMode('mobile')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            viewMode === 'mobile'
                              ? 'bg-white/20 text-white border border-white/20 shadow-md'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                          title="Mobile View (375px)"
                        >
                          <Smartphone size={13} />
                          <span className="hidden md:inline">Mobile</span>
                        </button>

                        {siteData?.previewUrl && (
                          <a
                            href={siteData.previewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-zinc-400 hover:text-white transition cursor-pointer ml-1"
                            title="Open in new tab"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* IFRAME VIEWPORT CONTAINER WITH FROSTED TRANSLUCENT MARGINS & EDGES */}
                    <div className="flex-1 bg-gradient-to-b from-white/[0.04] via-transparent to-black/60 p-2 sm:p-4 relative overflow-hidden flex items-center justify-center">
                      <div
                        className={`h-full transition-all duration-500 relative flex flex-col justify-center ${
                          viewMode === 'desktop'
                            ? 'w-full'
                            : viewMode === 'tablet'
                            ? 'w-[768px] max-w-full'
                            : 'w-[375px] max-w-full'
                        }`}
                      >
                        {siteData ? (
                          <div className="w-full h-full rounded-xl overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.9)] bg-white relative group">
                            <iframe
                              title="AI Website Live Preview"
                              src={siteData.previewUrl || `/preview/${siteData.siteId}`}
                              srcDoc={siteData.html}
                              className="w-full h-full border-none bg-white"
                            />
                            {/* Glow Accent Overlay on Edges */}
                            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-zinc-400 text-sm font-medium bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/10">
                            No site preview generated yet.
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {activeTab === 'deploy-outreach' && (
                <div className="p-4 sm:p-8 h-full overflow-y-auto max-w-6xl mx-auto space-y-6 text-left">
                  {/* HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-[#121218] to-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest">
                          Production & Outreach Center
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest">
                          Batch Engine
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        <Rocket size={24} className="text-emerald-400" />
                        Deploy Batch & Niche Outreach Hub
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                        Publish high-converting websites live on Netlify, Vercel, or ZIP. Automatically attach homepage screenshots, Google Business Trust Badges, and niche-tailored WhatsApp outreach messages.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadZip}
                        disabled={downloadingZip}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer border border-zinc-700"
                      >
                        <Download size={14} />
                        <span>{downloadingZip ? 'Packaging ZIP...' : 'Download ZIP Package'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: DEPLOYMENT & OUTREACH CONFIGURATION */}
                    <div className="lg:col-span-6 space-y-6">
                      
                      {/* 1. SELECT BATCH NICHE */}
                      <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sliders size={16} className="text-amber-400" />
                            1. Batch Target Niche Selection
                          </h4>
                          <span className="text-[10px] text-zinc-500 font-mono">Select for batch styling</span>
                        </div>

                        <p className="text-[11px] text-zinc-400">
                          Choose the target profession for this deployment batch. The template content, photos, and outreach copy will immediately align with this niche.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                          {[
                            { id: 'electrician', label: '⚡ Électricien', desc: 'Dépannage & Installation' },
                            { id: 'plumber', label: '🚰 Plombier', desc: 'Fuites & Sanitaire' },
                            { id: 'realEstate', label: '🏢 Immobilière', desc: 'Vente & Location' },
                            { id: 'restaurant', label: '🍷 Restaurant', desc: 'Gastro & Brasserie' },
                            { id: 'renovation', label: '🏠 Rénovation', desc: 'Travaux & BTP' },
                            { id: 'driving_school', label: '🚗 Auto-École', desc: 'Permis B & Conduite' },
                          ].map(n => (
                            <button
                              key={n.id}
                              onClick={() => {
                                setSelectedBatchNiche(n.id);
                                handleNicheChange(n.id);
                              }}
                              className={`p-3 rounded-xl text-left transition border flex flex-col justify-between cursor-pointer ${
                                (selectedBatchNiche === n.id || siteData?.content?.nicheOverride === n.id)
                                  ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-md shadow-amber-500/10'
                                  : 'bg-[#121216] border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                              }`}
                            >
                              <span className="text-xs font-bold">{n.label}</span>
                              <span className="text-[9px] text-zinc-500 mt-1">{n.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. CHOOSE DEPLOYMENT METHOD */}
                      <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Globe size={16} className="text-blue-400" />
                          2. Choose Deployment Host
                        </h4>

                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'netlify', label: 'Netlify CDN', desc: '1-Click Live SSL' },
                            { id: 'vercel', label: 'Vercel Edge', desc: 'Serverless Fast' },
                            { id: 'zip', label: 'ZIP Bundle', desc: 'Download Source' }
                          ].map(host => (
                            <button
                              key={host.id}
                              onClick={() => setDeployTarget(host.id as any)}
                              className={`p-3 rounded-xl text-center transition border cursor-pointer ${
                                deployTarget === host.id
                                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                                  : 'bg-[#121216] border-zinc-800 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <span className="text-xs font-bold block">{host.label}</span>
                              <span className="text-[9px] text-zinc-500 block mt-0.5">{host.desc}</span>
                            </button>
                          ))}
                        </div>

                        {deployTarget === 'netlify' && (
                          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                              Netlify Access Token (Optional)
                            </label>
                            <input
                              type="password"
                              placeholder="nfp_xxxxxxxxxxxxxxxx (Leave blank for automatic package generation)"
                              value={netlifyToken}
                              onChange={(e) => setNetlifyToken(e.target.value)}
                              className="w-full bg-[#121216] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-[10px] text-zinc-500">
                              Provide a Netlify token for direct 1-click publishing, or deploy via Netlify Drop.
                            </p>
                          </div>
                        )}

                        {deployTarget === 'vercel' && (
                          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                              Vercel Auth Token (Optional)
                            </label>
                            <input
                              type="password"
                              placeholder="vercel_token_xxxxxxxx (Leave blank for preview build)"
                              value={vercelToken}
                              onChange={(e) => setVercelToken(e.target.value)}
                              className="w-full bg-[#121216] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-[10px] text-zinc-500">
                              Provide a Vercel token for instant deployment to Vercel's global edge platform.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 3. AUTOMATION & TRUST BADGE CONTROLS */}
                      <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Zap size={16} className="text-emerald-400" />
                          3. Cold Outreach & Trust Badge Automation
                        </h4>

                        <div className="space-y-3">
                          <label className="flex items-start gap-3 p-3 bg-[#121216] border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700 transition">
                            <input
                              type="checkbox"
                              checked={autoSendEmail}
                              onChange={(e) => setAutoSendEmail(e.target.checked)}
                              className="mt-0.5 w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                            />
                            <div>
                              <span className="text-xs font-bold text-white block">Auto-Send Cold Email Upon Deploy</span>
                              <span className="text-[10px] text-zinc-400 block mt-0.5">
                                Automatically dispatches personalized cold email with live website link to {lead?.email || 'prospect'}.
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 p-3 bg-[#121216] border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700 transition">
                            <input
                              type="checkbox"
                              checked={includeGoogleBadgeInOutreach}
                              onChange={(e) => setIncludeGoogleBadgeInOutreach(e.target.checked)}
                              className="mt-0.5 w-4 h-4 rounded accent-yellow-500 cursor-pointer"
                            />
                            <div>
                              <span className="text-xs font-bold text-white block">Include Google Business Trust Badge</span>
                              <span className="text-[10px] text-zinc-400 block mt-0.5">
                                Appends ⭐️⭐️⭐️⭐️⭐️ 4.9/5 Google Verified Business rating badge to email & WhatsApp outreach.
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* DEPLOY ACTION BUTTON & PROGRESS */}
                      <div className="space-y-3">
                        <button
                          onClick={handleExecuteDeployment}
                          disabled={deployingTarget || deployingNetlify}
                          className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-zinc-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                        >
                          {(deployingTarget || deployingNetlify) ? (
                            <>
                              <RefreshCw size={18} className="animate-spin text-zinc-950" />
                              <span>Deploying Live Website...</span>
                            </>
                          ) : (
                            <>
                              <Rocket size={18} className="text-zinc-950" />
                              <span>Deploy Website & Prepare WhatsApp Outreach</span>
                            </>
                          )}
                        </button>

                        {(deployingTarget || deployingNetlify) && (
                          <div className="p-4 bg-[#121218] border border-emerald-500/30 rounded-xl space-y-2">
                            <div className="flex justify-between text-xs font-bold text-emerald-400">
                              <span>{deployStepText || 'Processing deployment...'}</span>
                              <span>{deployProgress || 40}%</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                                style={{ width: `${deployProgress || 40}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {emailSentStatus && (
                          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            {emailSentStatus}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* RIGHT COLUMN: HOMEPAGE SCREENSHOT & PREMADE WHATSAPP OUTREACH LIST */}
                    <div className="lg:col-span-6 space-y-6">
                      
                      {/* HOMEPAGE PREVIEW CARD */}
                      <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Monitor size={16} className="text-amber-400" />
                            Homepage Screenshot & Live Preview
                          </h4>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Live Preview Active
                          </span>
                        </div>

                        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 shadow-inner relative group">
                          <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
                            <div className="flex gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                            </div>
                            <div className="flex-1 text-center font-mono text-[10px] text-zinc-400 truncate">
                              {siteData?.previewUrl || `https://${(companyName).toLowerCase().replace(/[^a-z0-9]/g, '')}.nesta.ai`}
                            </div>
                          </div>

                          <div className="h-48 overflow-hidden relative">
                            <iframe
                              srcDoc={siteData?.html}
                              title="Homepage Screenshot Preview"
                              className="w-[1200px] h-[800px] origin-top-left scale-[0.38] pointer-events-none"
                            />
                          </div>
                        </div>

                        {(netlifyDeployResult?.url || deployResult?.url || siteData?.previewUrl) && (
                          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between gap-2">
                            <div className="truncate text-xs text-zinc-300 font-mono">
                              <span className="text-zinc-500 mr-2">Deployed URL:</span>
                              <span className="text-emerald-400 font-bold">{netlifyDeployResult?.url || deployResult?.url || siteData?.previewUrl}</span>
                            </div>
                            <a
                              href={netlifyDeployResult?.url || deployResult?.url || siteData?.previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[10px] rounded-lg border border-emerald-500/30 shrink-0 transition"
                            >
                              Open Site ↗
                            </a>
                          </div>
                        )}
                      </div>

                      {/* PREMADE WHATSAPP READY MESSAGES */}
                      <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <MessageSquare size={16} className="text-emerald-400" />
                            Premade WhatsApp Ready Messages
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-medium">
                            Click each button to launch WhatsApp
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400">
                          Messages are tailored to the selected niche ({selectedBatchNiche || lead?.niche || 'Électricien'}). Pressing the button opens WhatsApp with the prefilled message so you can send instantly.
                        </p>

                        <div className="space-y-3">
                          {[
                            lead,
                            ...(lead?.similarLeads || [
                              { name: `${companyName} (Principal)`, phone: lead?.phone || '+33612345678', city: lead?.city || 'Paris', niche: selectedBatchNiche },
                              { name: `Artisan ${selectedBatchNiche} Pro`, phone: '+33664143679', city: lead?.city || 'Lyon', niche: selectedBatchNiche }
                            ])
                          ].slice(0, 3).map((item, idx) => {
                            if (!item) return null;
                            const targetName = item.name || item.companyName || companyName;
                            const targetCity = item.city || lead?.city || 'votre région';
                            const targetPhone = item.phone || lead?.phone || '';
                            const targetNiche = selectedBatchNiche || item.niche || 'Électricien';
                            const deployedUrl = netlifyDeployResult?.url || deployResult?.url || siteData?.previewUrl || `https://${(targetName).toLowerCase().replace(/[^a-z0-9]/g, '')}.nesta.ai`;

                            const rawText = `Bonjour ${targetName}, j'accompagne régulièrement les professionnels du secteur ${targetNiche} à ${targetCity}. La présence numérique est un axe majeur sur lequel je travaille dans votre domaine. Je me suis permis de vous concevoir un aperçu de votre site web haute performance : ${deployedUrl}${includeGoogleBadgeInOutreach ? '\n\n⭐️⭐️⭐️⭐️⭐️ Fiche Officielle Google Business (4.9/5 - 84 avis)' : ''}\n\nJe reste à votre disposition si vous souhaitez le publier !`;

                            const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
                            const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rawText)}`;

                            return (
                              <div key={idx} className="p-4 bg-[#121218] border border-zinc-800 rounded-xl space-y-2 text-left">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <User size={13} className="text-zinc-400" />
                                    {targetName}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono">{targetPhone || 'No phone'}</span>
                                </div>

                                <p className="text-[11px] text-zinc-300 bg-black/40 p-2.5 rounded-lg border border-zinc-800 font-sans leading-relaxed">
                                  "{rawText}"
                                </p>

                                <div className="flex items-center justify-between pt-1">
                                  {includeGoogleBadgeInOutreach && (
                                    <span className="text-[10px] text-yellow-400 font-bold flex items-center gap-1">
                                      ⭐️⭐️⭐️⭐️⭐️ 4.9/5 Google Badge Attached
                                    </span>
                                  )}

                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20"
                                  >
                                    <MessageSquare size={14} />
                                    <span>📱 Send via WhatsApp</span>
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'scroll-video' && (
                <div className="p-4 sm:p-8 h-full overflow-y-auto max-w-6xl mx-auto space-y-6 text-left">
                  {/* HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-[#121218] to-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold uppercase tracking-widest">
                          Interactive Video Studio
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest">
                          Hero Scroll Sync
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        <Video size={24} className="text-purple-400" />
                        Hero Scroll-Driven Video Animation Engine
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                        Upload custom video files or choose stock video assets to create frame-accurate scroll animations for the hero section. Saved video animations automatically appear in the website Catalogue section.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer shadow-lg shadow-purple-600/20 border border-purple-400/30">
                        <Upload size={14} />
                        <span>Upload Custom Video</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          onChange={handleVideoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {videoApplyMsg && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fade-in">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      {videoApplyMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: INTERACTIVE SCRUBBER & ANIMATION SETTINGS */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* 1. INTERACTIVE SCROLL ANIMATION PREVIEW SANDBOX */}
                      <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Play size={16} className="text-purple-400" />
                            1. Interactive Hero Scroll Preview Sandbox
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-mono">Drag slider to test scroll scrub</span>
                        </div>

                        <div className="relative rounded-xl overflow-hidden bg-black border border-zinc-800 h-64 flex items-center justify-center group shadow-2xl">
                          {selectedHeroVideoUrl ? (
                            <video
                              key={selectedHeroVideoUrl}
                              src={selectedHeroVideoUrl}
                              className="w-full h-full object-cover"
                              autoPlay={heroVideoEffect === 'autoplay'}
                              loop={heroVideoEffect === 'autoplay'}
                              muted
                              playsInline
                              ref={(vidRef) => {
                                if (vidRef && heroVideoEffect === 'scroll-scrub' && vidRef.duration) {
                                  try {
                                    vidRef.currentTime = (scrubPreviewPos / 100) * vidRef.duration;
                                  } catch (e) {}
                                }
                              }}
                              style={{
                                transform: heroVideoEffect === 'sticky-zoom' ? `scale(${1 + (scrubPreviewPos / 100) * 0.4})` : (heroVideoEffect === '3d-tilt' ? `perspective(1000px) rotateX(${(scrubPreviewPos / 100) * 20}deg)` : 'none'),
                                filter: heroVideoEffect === 'sticky-zoom' ? `brightness(${1 - (scrubPreviewPos / 100) * 0.3}) blur(${(scrubPreviewPos / 100) * 6}px)` : `brightness(${1 - heroScrollOpacity * 0.5})`,
                                opacity: heroVideoEffect === 'parallax-fade' ? Math.max(0.1, 1 - (scrubPreviewPos / 100) * 0.8) : 1
                              }}
                            />
                          ) : (
                            <div className="text-center p-6 text-zinc-500 text-xs">
                              No video loaded. Upload a video file or pick a stock video below.
                            </div>
                          )}

                          {/* OVERLAY CONTENT SIMULATION */}
                          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest mb-2 border border-white/20">
                              {companyName}
                            </span>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight max-w-sm">
                              {siteData?.content?.heroTitle || companyName}
                            </h2>
                            <p className="text-xs text-white/80 mt-1 max-w-xs">
                              {siteData?.content?.heroSubtitle || 'Animation interactive au défilement'}
                            </p>
                          </div>
                        </div>

                        {/* SCRUB TEST SLIDER */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs font-bold text-zinc-400">
                            <span className="flex items-center gap-1"><ChevronsLeftRight size={13} className="text-purple-400" /> Scroll Scrub Simulator</span>
                            <span className="text-purple-400 font-mono">{scrubPreviewPos}% Page Scroll</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={scrubPreviewPos}
                            onChange={(e) => setScrubPreviewPos(Number(e.target.value))}
                            className="w-full accent-purple-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* 2. SELECT SCROLL ANIMATION MODE */}
                      <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Wand2 size={16} className="text-amber-400" />
                          2. Choose Hero Scroll Animation Mode
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { id: 'scroll-scrub', label: '🎬 Frame Scrub', desc: 'Scroll advances video frames 1:1' },
                            { id: 'sticky-zoom', label: '🔍 Sticky Zoom & Blur', desc: 'Video zooms and blurs on scroll' },
                            { id: 'parallax-fade', label: '🌊 Parallax Fade', desc: 'Smooth vertical parallax fade' },
                            { id: '3d-tilt', label: '🌀 3D Tilt Perspective', desc: 'Tilts along 3D spatial axis' },
                            { id: 'autoplay', label: '⏯️ Autoplay Loop', desc: 'Continuous ambient background loop' },
                          ].map(m => (
                            <button
                              key={m.id}
                              onClick={() => setHeroVideoEffect(m.id as any)}
                              className={`p-3 rounded-xl text-left transition border cursor-pointer flex flex-col justify-between ${
                                heroVideoEffect === m.id
                                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-500/10'
                                  : 'bg-[#121216] border-zinc-800 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <span className="text-xs font-bold">{m.label}</span>
                              <span className="text-[9px] text-zinc-500 mt-1">{m.desc}</span>
                            </button>
                          ))}
                        </div>

                        {/* TIMING & OVERLAY PARAMETERS */}
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-800/80">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-zinc-400">
                              <span>Scroll Height Factor</span>
                              <span className="text-purple-400">{heroScrollTiming}x</span>
                            </div>
                            <input
                              type="range"
                              min="0.8"
                              max="3.0"
                              step="0.1"
                              value={heroScrollTiming}
                              onChange={(e) => setHeroScrollTiming(Number(e.target.value))}
                              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-zinc-400">
                              <span>Overlay Contrast</span>
                              <span className="text-purple-400">{Math.round(heroScrollOpacity * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="0.8"
                              step="0.05"
                              value={heroScrollOpacity}
                              onChange={(e) => setHeroScrollOpacity(Number(e.target.value))}
                              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* APPLY & SAVE BUTTONS */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={handleApplyHeroScrollVideo}
                          disabled={loading}
                          className="py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                        >
                          <CheckCircle2 size={16} />
                          <span>Apply to Website Hero</span>
                        </button>

                        <button
                          onClick={() => handleSaveVideoToCatalog()}
                          disabled={loading}
                          className="py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                        >
                          <Star size={16} />
                          <span>Save to Website Catalogue</span>
                        </button>
                      </div>

                    </div>

                    {/* RIGHT COLUMN: STOCK VIDEO SEARCH & SAVED CATALOGUE */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* STOCK VIDEO LIBRARY SELECTOR */}
                      <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Search size={16} className="text-blue-400" />
                            Curated Stock Video Library
                          </h4>
                          <span className="text-[10px] text-zinc-400">High Bitrate 4K Assets</span>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Search videos (e.g. electrician, plumber, real estate)..."
                            value={heroVideoSearchQuery}
                            onChange={(e) => setHeroVideoSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchStockVideos()}
                            className="flex-1 bg-[#121216] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
                          />
                          <button
                            onClick={() => handleSearchStockVideos()}
                            disabled={searchingStockVideos}
                            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                          >
                            {searchingStockVideos ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                          </button>
                        </div>

                        {/* POPULAR NICHE PRESETS */}
                        <div className="flex flex-wrap gap-1.5">
                          {['Electrician', 'Plumber', 'Real Estate', 'Renovation', 'Restaurant'].map(tag => (
                            <button
                              key={tag}
                              onClick={() => {
                                setHeroVideoSearchQuery(tag);
                                handleSearchStockVideos(tag);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>

                        {/* VIDEO RESULTS GRID */}
                        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                          {(videoSearchResults.length > 0 ? videoSearchResults : [
                            { title: 'Renovation Work', url: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4' },
                            { title: 'Electrician Wires', url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-fixing-wires-42175-large.mp4' },
                            { title: 'Plumber Repair', url: 'https://assets.mixkit.co/videos/preview/mixkit-plumber-repairing-a-kitchen-sink-42171-large.mp4' },
                            { title: 'Realtor Apartment', url: 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-realtor-presenting-a-modern-apartment-43033-large.mp4' }
                          ]).map((v, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedHeroVideoUrl(v.url);
                                setVideoApplyMsg(`Selected "${v.title}" stock video!`);
                                setTimeout(() => setVideoApplyMsg(null), 3000);
                              }}
                              className={`relative rounded-xl overflow-hidden border text-left group transition cursor-pointer h-24 ${
                                selectedHeroVideoUrl === v.url
                                  ? 'border-purple-500 ring-2 ring-purple-500/50'
                                  : 'border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              <video
                                src={v.url}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                muted
                                playsInline
                                onMouseOver={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                                onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-2 flex flex-col justify-end">
                                <span className="text-[10px] font-bold text-white truncate block">{v.title}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* CATALOGUE OF SAVED VIDEO ANIMATIONS */}
                      <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Star size={16} className="text-amber-400" />
                            Catalogue of Saved Video Animations
                          </h4>
                          <span className="text-[10px] text-zinc-400">{savedCatalogVideoAnimations.length} Saved Items</span>
                        </div>

                        <p className="text-[11px] text-zinc-400">
                          These saved video animations are automatically included as video items inside your website's main Catalogue section.
                        </p>

                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                          {savedCatalogVideoAnimations.map((item, idx) => (
                            <div key={item.id || idx} className="p-3.5 bg-[#121218] border border-zinc-800 rounded-xl space-y-2 text-left hover:border-zinc-700 transition">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Video size={13} className="text-purple-400" />
                                    {item.title}
                                  </h5>
                                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">{item.desc}</p>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold shrink-0 uppercase">
                                  {item.mode}
                                </span>
                              </div>

                              <div className="h-24 rounded-lg overflow-hidden border border-zinc-800 relative bg-black">
                                <video
                                  src={item.videoUrl}
                                  className="w-full h-full object-cover"
                                  muted
                                  loop
                                  playsInline
                                  autoPlay
                                />
                                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
                                  <span className="text-[9px] font-mono text-zinc-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                                    Timing: {item.timing || 1.5}x
                                  </span>
                                  <button
                                    onClick={() => handleSaveVideoToCatalog(item)}
                                    className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[9px] rounded border border-amber-500/30 transition cursor-pointer"
                                  >
                                    Apply to Hero
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schema' && (
                <div className="p-6 h-full flex flex-col space-y-6 overflow-y-auto">
                  {/* QUICK TEXT & EMAIL EDITOR */}
                  <div className="bg-[#0A0A0C] border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <Edit3 size={16} className="text-amber-400" />
                          Website Content & Email Editor
                        </h4>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Instantly edit all text across the template, especially contact email at the bottom and footer copyright.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        Live Sync Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* EMAIL ADDRESS AT BOTTOM & FOOTER */}
                      <div className="space-y-1.5 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                        <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <Mail size={13} />
                          Contact & Footer Email Address
                        </label>
                        <input
                          type="email"
                          value={siteData?.content?.contactEmail || siteData?.content?.email || siteData?.content?.footerEmail || lead.email || ''}
                          onChange={(e) => {
                            const newEmail = e.target.value;
                            if (!siteData) return;
                            const newContent = {
                              ...siteData.content,
                              contactEmail: newEmail,
                              email: newEmail,
                              footerEmail: newEmail
                            };
                            setSiteData({ ...siteData, content: newContent });
                            setJsonText(JSON.stringify(newContent, null, 2));

                            const iframe = document.querySelector('iframe') as HTMLIFrameElement;
                            if (iframe?.contentWindow) {
                              iframe.contentWindow.postMessage({
                                type: 'UPDATE_TEXT',
                                field: 'contactEmail',
                                text: newEmail
                              }, '*');
                            }
                          }}
                          onBlur={() => {
                            if (siteData) {
                              fetch('/api/leads/modify-content', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ siteId: siteData.siteId, currentContent: siteData.content, directContent: siteData.content, lead })
                              });
                            }
                          }}
                          placeholder="e.g. contact@outlandhomes.com"
                          className="w-full bg-black/80 border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <p className="text-[10px] text-zinc-500">Updates the contact section and the email link at the bottom of the page in real-time.</p>
                      </div>

                      {/* PHONE NUMBER */}
                      <div className="space-y-1.5 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                        <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                          <Phone size={13} className="text-cyan-400" />
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={siteData?.content?.contactPhone || siteData?.content?.phone || lead.phone || ''}
                          onChange={(e) => {
                            const newPhone = e.target.value;
                            if (!siteData) return;
                            const newContent = { ...siteData.content, contactPhone: newPhone, phone: newPhone };
                            setSiteData({ ...siteData, content: newContent });
                            setJsonText(JSON.stringify(newContent, null, 2));

                            const iframe = document.querySelector('iframe') as HTMLIFrameElement;
                            if (iframe?.contentWindow) {
                              iframe.contentWindow.postMessage({ type: 'UPDATE_TEXT', field: 'contactPhone', text: newPhone }, '*');
                            }
                          }}
                          onBlur={() => {
                            if (siteData) {
                              fetch('/api/leads/modify-content', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ siteId: siteData.siteId, currentContent: siteData.content, directContent: siteData.content, lead })
                              });
                            }
                          }}
                          placeholder="e.g. +33 6 64 14 36 79"
                          className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* BUSINESS / BRAND NAME */}
                      <div className="space-y-1.5 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                        <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                          <Building size={13} className="text-purple-400" />
                          Business / Brand Name
                        </label>
                        <input
                          type="text"
                          value={siteData?.content?.brandName || lead.company || lead.businessName || ''}
                          onChange={(e) => {
                            const newBrand = e.target.value;
                            if (!siteData) return;
                            const newContent = { ...siteData.content, brandName: newBrand };
                            setSiteData({ ...siteData, content: newContent });
                            setJsonText(JSON.stringify(newContent, null, 2));

                            const iframe = document.querySelector('iframe') as HTMLIFrameElement;
                            if (iframe?.contentWindow) {
                              iframe.contentWindow.postMessage({ type: 'UPDATE_TEXT', field: 'brandName', text: newBrand }, '*');
                            }
                          }}
                          onBlur={() => {
                            if (siteData) {
                              fetch('/api/leads/modify-content', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ siteId: siteData.siteId, currentContent: siteData.content, directContent: siteData.content, lead })
                              });
                            }
                          }}
                          placeholder="e.g. OUTLAND HOMES"
                          className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      {/* FOOTER COPYRIGHT */}
                      <div className="space-y-1.5 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                        <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                          <Globe size={13} className="text-emerald-400" />
                          Footer Copyright Text
                        </label>
                        <input
                          type="text"
                          value={siteData?.content?.footerCopyright || siteData?.content?.footerText || ''}
                          onChange={(e) => {
                            const newCopy = e.target.value;
                            if (!siteData) return;
                            const newContent = { ...siteData.content, footerCopyright: newCopy, footerText: newCopy };
                            setSiteData({ ...siteData, content: newContent });
                            setJsonText(JSON.stringify(newContent, null, 2));

                            const iframe = document.querySelector('iframe') as HTMLIFrameElement;
                            if (iframe?.contentWindow) {
                              iframe.contentWindow.postMessage({ type: 'UPDATE_TEXT', field: 'footerCopyright', text: newCopy }, '*');
                            }
                          }}
                          onBlur={() => {
                            if (siteData) {
                              fetch('/api/leads/modify-content', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ siteId: siteData.siteId, currentContent: siteData.content, directContent: siteData.content, lead })
                              });
                            }
                          }}
                          placeholder="e.g. © 2026 · Outland Homes Real Estate"
                          className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      {/* CITY / HERO LOCATION */}
                      <div className="space-y-1.5 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 sm:col-span-2">
                        <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <MapPin size={13} className="text-amber-400" />
                          City / Hero Location Tag
                        </label>
                        <input
                          type="text"
                          value={siteData?.content?.city || siteData?.content?.heroCity || lead.city || ''}
                          onChange={(e) => {
                            const newCity = e.target.value;
                            if (!siteData) return;
                            const newContent = { ...siteData.content, city: newCity, heroCity: newCity };
                            setSiteData({ ...siteData, content: newContent });
                            setJsonText(JSON.stringify(newContent, null, 2));

                            const iframe = document.querySelector('iframe') as HTMLIFrameElement;
                            if (iframe?.contentWindow) {
                              iframe.contentWindow.postMessage({ type: 'UPDATE_TEXT', field: 'city', text: newCity }, '*');
                            }
                          }}
                          onBlur={() => {
                            if (siteData) {
                              fetch('/api/leads/modify-content', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ siteId: siteData.siteId, currentContent: siteData.content, directContent: siteData.content, lead })
                              });
                            }
                          }}
                          placeholder="e.g. Paris & Île-de-France"
                          className="w-full bg-black/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

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

                  {siteData?.content?.templateStyle === 'outland-homes' && (
                    <div className="mb-6 bg-[#0F0F12] border border-zinc-800 rounded-xl p-4 text-left">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            🍷 Restaurant Menu Block
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-1">Paste your menu items below (one per line) using | to separate Name, Description, and Price.</p>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-[10px] font-bold text-zinc-300 uppercase">Show Menu Section</span>
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 cursor-pointer" 
                            checked={siteData.content.showMenu !== false}
                            onChange={async (e) => {
                              try {
                                const parsed = JSON.parse(jsonText);
                                parsed.showMenu = e.target.checked;
                                setJsonText(JSON.stringify(parsed, null, 2));
                                
                                setModifying(true);
                                const res = await fetch('/api/leads/modify-content', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ siteId: siteData.siteId, currentContent: siteData.content, directContent: parsed, lead })
                                });
                                const data = await res.json();
                                if (data.success) setSiteData(data);
                                setModifying(false);
                              } catch(err){ setModifying(false); }
                            }}
                          />
                        </label>
                      </div>
                      
                      {siteData.content.showMenu !== false && (
                        <div className="space-y-2">
                          <textarea
                            defaultValue={siteData.content.menuText || ''}
                            onBlur={async (e) => {
                              try {
                                const parsed = JSON.parse(jsonText);
                                parsed.menuText = e.target.value;
                                setJsonText(JSON.stringify(parsed, null, 2));
                                
                                setModifying(true);
                                const res = await fetch('/api/leads/modify-content', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ siteId: siteData.siteId, currentContent: siteData.content, directContent: parsed, lead })
                                });
                                const data = await res.json();
                                if (data.success) setSiteData(data);
                                setModifying(false);
                              } catch(err){ setModifying(false); }
                            }}
                            placeholder="Filet de Bœuf Wellington | Accompagné de sa purée truffée | 45€&#10;Saumon Gravlax | Citron vert et baies roses | 18€"
                            className="w-full bg-[#0A0A0C] border border-zinc-800 rounded-lg p-3 font-mono text-xs text-amber-400 focus:outline-none focus:border-blue-500 resize-none h-32"
                          />
                          <p className="text-[9px] text-zinc-500 text-right">Click outside the text box to automatically save and update the preview.</p>
                        </div>
                      )}
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

              
              {activeTab === 'gif' && (
                <div className="p-8 h-full overflow-y-auto max-w-4xl mx-auto space-y-8">
                  <div className="text-left space-y-2 mb-6">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                      Outreach Multiplier
                    </span>
                    <h4 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
                      <Video size={20} className="text-blue-400" />
                      Video to Outreach GIF Generator
                    </h4>
                    <p className="text-xs text-zinc-400 font-medium">
                      Select or upload a screen recording of the customized website. Use these looping videos or GIFs in your cold emails and DMs.
                    </p>
                  </div>

                  {/* UPLOAD VIDEOS DROPZONE */}
                  
                  <div className="space-y-6">
                    {/* CUSTOM URL TO GIF */}
                    <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-6 relative">
                      <h4 className="text-sm font-bold text-zinc-200 mb-2">Auto-Generate GIF from Live URL</h4>
                      <p className="text-[11px] text-zinc-500 mb-4">Paste any website URL to automatically capture a scrolling animated GIF.</p>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="https://..." 
                          value={customGifUrlInput}
                          onChange={(e) => setCustomGifUrlInput(e.target.value)}
                          className="flex-1 bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white"
                        />
                        <button 
                          onClick={handleGenerateCustomGif}
                          disabled={!customGifUrlInput || generatingGif}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-lg cursor-pointer transition flex items-center gap-2"
                        >
                          {generatingGif ? 'Capturing...' : 'Generate GIF'}
                        </button>
                      </div>
                      
                      {gifError && <p className="text-red-400 text-xs mt-3">{gifError}</p>}
                      
                      {gifUrl && (
                        <div className="mt-6 border border-zinc-800 rounded-xl overflow-hidden bg-black p-2">
                          <img src={gifUrl} alt="Generated GIF" className="w-full max-w-lg mx-auto rounded-lg" />
                          <div className="text-center mt-3">
                            <button 
                              onClick={handleCopyGifUrl}
                              className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition"
                            >
                              {copiedGifUrl ? 'Copied!' : 'Copy GIF URL'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-px bg-zinc-800 flex-1"></div>
                      <span className="text-xs text-zinc-500 font-bold uppercase">OR</span>
                      <div className="h-px bg-zinc-800 flex-1"></div>
                    </div>

                    {/* UPLOAD VIDEOS DROPZONE */}
                    <div className="bg-[#0A0A0C] border-2 border-dashed border-zinc-700 hover:border-amber-500/50 rounded-2xl p-8 text-center transition flex flex-col items-center justify-center space-y-2 relative group mt-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Upload size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-200">Upload Screen Recording</h4>
                        <p className="text-[11px] text-zinc-500 mt-1">MP4, WEBM accepted. Loop your video perfectly for email.</p>
                      </div>
                      <label className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition mt-4">
                        Browse Videos
                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>


                  {/* USER UPLOADED VIDEOS LIST */}
                  {uploadedVideos.length > 0 && (
                    <div className="space-y-4 text-left pt-4">
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <Video size={16} className="text-blue-400" />
                        Available Outreach Videos ({uploadedVideos.length})
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {uploadedVideos.map((videoUrl, idx) => (
                          <div key={idx} className="relative rounded-2xl border border-zinc-800 bg-[#060609] overflow-hidden group shadow-lg flex flex-col">
                            <div className="relative aspect-video bg-black">
                              <video
                                src={videoUrl}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            </div>
                            <div className="p-4 bg-[#121217] border-t border-zinc-800 flex items-center justify-between">
                              <div className="flex gap-2">
                                <a
                                  href={videoUrl}
                                  download={`outreach-video-${idx + 1}.mp4`}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg shadow cursor-pointer transition flex items-center gap-1.5"
                                >
                                  <Download size={12} /> Download
                                </a>
                                <button
                                  onClick={() => handleDeleteUploadedVideo(idx)}
                                  className="p-1.5 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-lg border border-red-800/40 transition shrink-0"
                                  title="Delete Video"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
{activeTab === '3d-studio' && (
                <div className="p-8 h-full overflow-y-auto max-w-5xl mx-auto space-y-8 text-left">
                  <div className="bg-[#0A0A0C] border border-amber-500/30 rounded-2xl p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                        <Box size={20} className="text-amber-500" /> AI 3D Model Generation
                      </h3>
                      <p className="text-sm text-zinc-400">
                        Turn 2D product images into high-quality, interactive 3D assets to embed directly onto the generated website.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">1. Select Base Image</p>
                        
                        {/* Image grid from scraped assets or lead images */}
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
                          {[...(scrapedBehanceData?.images || []), ...(lead?.imageUrls || [])].slice(0, 9).map((url, i) => (
                            <div 
                              key={i} 
                              onClick={() => setImageTo3dUrl(url)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition ${imageTo3dUrl === url ? 'border-amber-500' : 'border-zinc-800 hover:border-zinc-600'}`}
                            >
                              <img src={url} alt={`Option ${i}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Or paste image URL..." 
                            value={imageTo3dUrl}
                            onChange={(e) => setImageTo3dUrl(e.target.value)}
                            className="flex-1 bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                          />
                          <label className="flex-none bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center transition">
                            <Upload size={14} className="mr-1" /> Upload
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUploadFor3D} />
                          </label>
                        </div>

                        <button
                          onClick={() => handleGenerate3D(imageTo3dUrl)}
                          disabled={!imageTo3dUrl || generating3d}
                          className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                        >
                          <Sparkles size={14} /> {generating3d ? 'Generating 3D Model (Takes 2-3 mins)...' : 'Generate 3D Model'}
                        </button>
                      </div>

                      <div className="space-y-4">
                        <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">2. 3D Model Preview & Embedding</p>
                        
                        <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                          {model3dResult || siteData?.content?.model3dUrl ? (
                            <>
                              <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
                              <model-viewer 
                                src={model3dResult || siteData?.content?.model3dUrl} 
                                camera-controls 
                                auto-rotate 
                                shadow-intensity="1"
                                style={{ width: '100%', height: '100%' }}
                              ></model-viewer>
                              <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] text-amber-400 font-bold">Interactive</div>
                            </>
                          ) : (
                            <div className="text-zinc-600 text-xs text-center px-6">
                              <Box size={32} className="mx-auto mb-2 opacity-50" />
                              Generate a model to see it here.
                            </div>
                          )}
                        </div>

                        {siteData?.content && (model3dResult || siteData.content.model3dUrl) && (
                          <div className="pt-2 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 transition">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 text-amber-500 bg-zinc-900 border-zinc-700 rounded focus:ring-amber-500 focus:ring-offset-zinc-950"
                                checked={!!siteData.content.show3dHero}
                                onChange={(e) => handleApply3dToHero(e.target.checked)}
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">Embed 3D Model in Hero Section</span>
                                <span className="text-[10px] text-zinc-400">Replaces the hero background image with an interactive 3D model viewer.</span>
                              </div>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 transition">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 text-amber-500 bg-zinc-900 border-zinc-700 rounded focus:ring-amber-500 focus:ring-offset-zinc-950"
                                checked={!!siteData.content.show3dCatalog}
                                onChange={(e) => handleApply3dToCatalog(e.target.checked)}
                              />
                              <div className="flex flex-col">
                                 <span className="text-sm font-bold text-white">Embed 3D Model in Catalog/Product Section</span>
                                <span className="text-[10px] text-zinc-400">Replaces the primary product image in the showcase grid.</span>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transparent-slider' && (
                <div className="p-4 sm:p-8 h-full overflow-y-auto max-w-6xl mx-auto space-y-8 text-left">
                  
                  {/* HEADER BANNER */}
                  <div className="bg-gradient-to-r from-zinc-900 via-[#12121A] to-zinc-900 border border-amber-500/30 p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="space-y-2 z-10 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                          <Sparkles size={11} /> Isolated Object Marquee Engine
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-black uppercase tracking-widest">
                          High Quality Cutouts
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <ChevronsLeftRight className="text-amber-400" size={26} />
                        Infinite Transparent Object Rolling Slider & AI Studio
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Display ultra-high quality background-free items in continuous smooth motion — including gourmet plates top-view, luxury cars, superbikes, architectural villas, and custom background-removed photos.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 z-10">
                      <button
                        onClick={async () => {
                          if (!siteData) return;
                          setModifying(true);
                          try {
                            const PRESETS_MAP: Record<string, any[]> = {
                              plates: [
                                { title: 'Wagyu Steak Cut', subtitle: 'Charcoal & Truffle Butter', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Artisan Nigiri Platter', subtitle: 'Fresh Osetra Caviar & Salmon', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Truffle Tagliatelle', subtitle: 'Handmade Pasta & Parmigiano', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Salmon Citrus Salad', subtitle: 'Fresh Micro-Greens & Avocado', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Neapolitan Wood Pizza', subtitle: 'San Marzano & Buffalo Mozzarella', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Gold Leaf Berry Tart', subtitle: 'Patisserie Vanilla Bean', url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80&auto=format&fit=crop' }
                              ],
                              cars: [
                                { title: 'Porsche 911 GT3 RS', subtitle: 'Silver Metallic Track Edition', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Lamborghini Huracán', subtitle: 'Matte Nero Noctis Supercar', url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Ferrari F8 Tributo', subtitle: 'Rosso Corsa Supercar', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Mustang Fastback 1969', subtitle: 'Vintage Metallic Gold Heritage', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Mercedes-AMG GT', subtitle: 'Biturbo V8 Performance', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80&auto=format&fit=crop' }
                              ],
                              motorcycles: [
                                { title: 'Ducati Panigale V4 S', subtitle: 'Corse Racing Red Superbike', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80&auto=format&fit=crop' },
                                { title: 'BMW R nineT Cafe Racer', subtitle: 'Custom Bronze Brushed Metal', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Triumph Bonneville T120', subtitle: 'Vintage Leather British Twin', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Harley-Davidson Fat Boy', subtitle: 'Chrome Softail Cruiser', url: 'https://images.unsplash.com/photo-1558981243-703630f9a7aa?w=800&q=80&auto=format&fit=crop' }
                              ],
                              houses: [
                                { title: 'Cantilevered Glass Villa', subtitle: 'Minimalist Architectural Residence', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Nordic Alpine Chalet', subtitle: 'Natural Timber & Glass Facade', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Palm Oceanfront Estate', subtitle: 'Infinity Edge Pool Villa', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Rooftop Penthouse Estate', subtitle: 'Skyline Panoramic Residence', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80&auto=format&fit=crop' }
                              ],
                              tech: [
                                { title: 'Studio Hi-Fi Headphones', subtitle: 'Matte Black Spatial Audio', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop' },
                                { title: '18K Gold Chronograph', subtitle: 'Swiss Automatic Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Artisan Espresso Machine', subtitle: 'Polished Brass & Chrome', url: 'https://images.unsplash.com/photo-1517668808822-9e4288246ede?w=800&q=80&auto=format&fit=crop' },
                                { title: 'Architectural Sneakers', subtitle: 'Minimalist Fashion Footwear', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop' }
                              ]
                            };

                            const itemsToApply = sliderCategory === 'custom' 
                              ? (customCutoutItems.length > 0 ? customCutoutItems : PRESETS_MAP.plates)
                              : (PRESETS_MAP[sliderCategory] || PRESETS_MAP.plates);

                            const config = {
                              category: sliderCategory,
                              speed: sliderSpeed,
                              direction: sliderDirection,
                              itemScale: sliderItemScale,
                              itemGap: sliderItemGap,
                              enableRotate: sliderEnableRotate,
                              enableShadow: sliderEnableShadow,
                              enable3dTilt: sliderEnable3dTilt,
                              themeBg: sliderThemeBg,
                              items: itemsToApply
                            };

                            const res = await fetch('/api/leads/modify-content', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                siteId: siteData.siteId,
                                currentContent: siteData.content,
                                directContent: { transparentSlider: config },
                                lead
                              })
                            });
                            const data = await res.json();
                            if (data.success) {
                              setSiteData(data);
                              setJsonText(JSON.stringify(data.content, null, 2));
                              alert('✨ Infinite Rolling Slider successfully attached to your website hero section!');
                            }
                          } catch (e) {
                            console.error(e);
                          } finally {
                            setModifying(false);
                          }
                        }}
                        disabled={modifying || !siteData}
                        className="px-5 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs rounded-xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
                      >
                        <Sparkles size={16} />
                        <span>Apply Slider to Active Website</span>
                      </button>

                      <button
                        onClick={() => {
                          const embedCode = `<style>
@keyframes marquee-roll {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.marquee-container {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  position: relative;
  width: 100%;
}
.marquee-track {
  display: flex;
  gap: ${sliderItemGap}px;
  animation: marquee-roll ${sliderSpeed}s linear infinite;
  animation-direction: ${sliderDirection === 'right' ? 'reverse' : 'normal'};
}
.marquee-card {
  flex-shrink: 0;
  width: ${sliderItemScale}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
}
.marquee-card img {
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: ${sliderEnableShadow ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' : 'none'};
  ${sliderEnableRotate ? 'animation: spin 30s linear infinite;' : ''}
}
</style>
<div className="marquee-container">
  <div className="marquee-track">
    <!-- Transparent Items repeated for infinite loop -->
  </div>
</div>`;
                          navigator.clipboard.writeText(embedCode);
                          setCopiedSliderEmbed(true);
                          setTimeout(() => setCopiedSliderEmbed(false), 2000);
                        }}
                        className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <Code size={14} />
                        <span>{copiedSliderEmbed ? 'Code Copied! ✓' : 'Copy Embed Code'}</span>
                      </button>
                    </div>
                  </div>

                  {/* MULTI-UPLOAD SUCCESS BANNER */}
                  {multiUploadSuccessMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-lg">
                      <span>{multiUploadSuccessMsg}</span>
                      <button onClick={() => setMultiUploadSuccessMsg(null)} className="text-emerald-400 hover:text-white cursor-pointer">✕</button>
                    </div>
                  )}

                  {/* BULK MULTI-IMAGE UPLOAD & STOCK SEARCH WORKSPACE */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#0A0A0E] border border-amber-500/20 p-6 rounded-2xl shadow-2xl">
                    
                    {/* OPTION 1: UPLOAD MULTIPLE PRE-CROPPED PICTURES */}
                    <div className="space-y-4 bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/80 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black flex items-center justify-center border border-amber-500/30">1</span>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <Upload className="text-amber-400" size={16} />
                            Upload Multiple Pre-Cropped Pictures
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-400">
                          Select multiple files from your computer at once. Perfect for pre-cropped PNGs, WebPs, or transparent cutout assets!
                        </p>
                      </div>

                      <label className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 p-6 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition group">
                        <Upload size={32} className="text-amber-400 group-hover:scale-110 transition-transform mb-2" />
                        <span className="text-xs font-black text-white group-hover:text-amber-300 transition">
                          Click or Drag to Upload Multiple Pictures
                        </span>
                        <span className="text-[10px] text-zinc-500 mt-1">
                          PNG, WEBP, JPG, SVG • Select 1 or 20+ files at once
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleMultipleCutoutFilesUpload}
                        />
                      </label>
                    </div>

                    {/* OPTION 2: SEARCH & ADD MULTIPLE STOCK PICTURES */}
                    <div className="space-y-4 bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/80">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-black flex items-center justify-center border border-cyan-500/30">2</span>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <Search className="text-cyan-400" size={16} />
                            Search & Select Multiple Pictures
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-400">
                          Search high-res stock photos by keyword (e.g., "watch", "supercar", "dish", "chalet") and multi-select images to add in 1 click!
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Search keyword (e.g. supercar, watch, dish, sneakers)..."
                          value={sliderSearchQuery}
                          onChange={(e) => setSliderSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearchSliderPhotos()}
                          className="flex-1 bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          onClick={() => handleSearchSliderPhotos()}
                          disabled={searchingSliderPhotos}
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          {searchingSliderPhotos ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                          <span>Search</span>
                        </button>
                      </div>

                      {/* SEARCH RESULTS GRID WITH CHECKBOXES */}
                      {sliderSearchResults.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 border-t border-zinc-800/80 pt-3">
                            <span>Found {sliderSearchResults.length} photos ({selectedSliderPhotoUrls.length} selected)</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedSliderPhotoUrls(sliderSearchResults.map(r => r.url))}
                                className="text-cyan-400 hover:underline cursor-pointer"
                              >
                                Select All
                              </button>
                              <span>•</span>
                              <button
                                onClick={() => setSelectedSliderPhotoUrls([])}
                                className="text-zinc-500 hover:underline cursor-pointer"
                              >
                                Deselect All
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-56 overflow-y-auto p-1 bg-black/40 rounded-xl border border-zinc-800">
                            {sliderSearchResults.map((photo) => {
                              const isSelected = selectedSliderPhotoUrls.includes(photo.url);
                              return (
                                <div
                                  key={photo.id}
                                  className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer group transition-all ${
                                    isSelected ? 'border-amber-400 ring-2 ring-amber-400/50 scale-95' : 'border-zinc-800 opacity-70 hover:opacity-100'
                                  }`}
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedSliderPhotoUrls(prev => prev.filter(u => u !== photo.url));
                                    } else {
                                      setSelectedSliderPhotoUrls(prev => [...prev, photo.url]);
                                    }
                                  }}
                                >
                                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                                  <div className={`absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                                    isSelected ? 'bg-amber-400 text-zinc-950' : 'bg-black/60 text-white'
                                  }`}>
                                    {isSelected ? '✓' : ''}
                                  </div>
                                  <button
                                    title="Remove Background on this single photo"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      try {
                                        setIsBatchProcessingBg(true);
                                        const transparentPng = await processBgRemovalForUrl(photo.url, bgRemoveThreshold, bgRemoveFeather);
                                        setCustomCutoutItems(prev => [{
                                          id: `cutout-single-${Date.now()}`,
                                          title: photo.title || 'Custom Cutout',
                                          subtitle: 'Transparent Cutout',
                                          url: transparentPng
                                        }, ...prev]);
                                        setSliderCategory('custom');
                                        setMultiUploadSuccessMsg(`✨ Removed background from "${photo.title}" and added to slider!`);
                                        setTimeout(() => setMultiUploadSuccessMsg(null), 4000);
                                      } catch (err) {
                                        console.error('Failed to remove bg for single photo:', err);
                                      } finally {
                                        setIsBatchProcessingBg(false);
                                      }
                                    }}
                                    className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/80 hover:bg-amber-500 text-amber-300 hover:text-zinc-950 text-[9px] font-bold rounded border border-amber-500/40 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 z-10"
                                  >
                                    <Wand2 size={10} />
                                    <span>Cutout</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <button
                              onClick={handleRemoveBgAndAddSelectedToSlider}
                              disabled={selectedSliderPhotoUrls.length === 0 || isBatchProcessingBg}
                              className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 hover:from-cyan-400 hover:to-amber-300 disabled:opacity-40 text-zinc-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                            >
                              {isBatchProcessingBg ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
                              <span>🪄 Remove Background & Add ({selectedSliderPhotoUrls.length})</span>
                            </button>

                            <button
                              onClick={handleAddSelectedSearchPhotosToSlider}
                              disabled={selectedSliderPhotoUrls.length === 0 || isBatchProcessingBg}
                              className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                            >
                              <Sparkles size={14} className="text-amber-400" />
                              <span>Add As-Is ({selectedSliderPhotoUrls.length})</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* PRESET CATEGORY SELECTOR TABS */}
                  <div className="bg-[#0A0A0E] border border-zinc-800/80 p-2 rounded-2xl flex items-center gap-2 overflow-x-auto scrollbar-none shadow-xl">
                    {[
                      { id: 'plates', label: '🍽️ Gourmet Plates (Top View)', count: 6 },
                      { id: 'cars', label: '🏎️ Exotic Sports Cars', count: 5 },
                      { id: 'motorcycles', label: '🏍️ Superbikes & Cafe Racers', count: 4 },
                      { id: 'houses', label: '🏛️ Modern Villas & Mansions', count: 4 },
                      { id: 'tech', label: '⌚ Tech & Luxury Items', count: 4 },
                      { id: 'custom', label: `✂️ My Custom Cutouts (${customCutoutItems.length})`, count: customCutoutItems.length }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSliderCategory(cat.id as any)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 cursor-pointer border ${
                          sliderCategory === cat.id
                            ? 'bg-amber-500 text-zinc-950 border-amber-400 font-black shadow-lg shadow-amber-500/20'
                            : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* LIVE INFINITE ROLLING SLIDER PREVIEW CANVAS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Play size={14} className="text-amber-400 fill-amber-400" />
                        Live Continuous Marquee Ticker Preview
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        <span>Speed: {sliderSpeed}s cycle</span>
                        <span>•</span>
                        <span>Scale: {sliderItemScale}px</span>
                        <span>•</span>
                        <span>Gap: {sliderItemGap}px</span>
                      </div>
                    </div>

                    <div className={`w-full py-12 px-4 rounded-3xl border overflow-hidden relative shadow-2xl transition-all duration-300 ${
                      sliderThemeBg === 'dark' ? 'bg-[#060608] border-zinc-800/80' :
                      sliderThemeBg === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' :
                      sliderThemeBg === 'gold' ? 'bg-gradient-to-r from-amber-950/40 via-zinc-950 to-amber-950/40 border-amber-500/30' :
                      'bg-[#040D12] border-cyan-500/30'
                    }`}>

                      {/* FADE GRADIENT EDGES ON LEFT & RIGHT */}
                      <div className={`absolute top-0 bottom-0 left-0 w-24 z-20 pointer-events-none bg-gradient-to-r ${
                        sliderThemeBg === 'light' ? 'from-slate-100 to-transparent' : 'from-[#060608] to-transparent'
                      }`} />
                      <div className={`absolute top-0 bottom-0 right-0 w-24 z-20 pointer-events-none bg-gradient-to-l ${
                        sliderThemeBg === 'light' ? 'from-slate-100 to-transparent' : 'from-[#060608] to-transparent'
                      }`} />

                      {/* CONTINUOUS ROLLING MARQUEE CONTAINER */}
                      <div className="marquee-wrapper overflow-hidden w-full flex relative">
                        <style>{`
                          @keyframes marqueeInfinite {
                            0% { transform: translateX(0%); }
                            100% { transform: translateX(-50%); }
                          }
                          @keyframes slowSpin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                          }
                          .marquee-animated-track {
                            display: flex;
                            align-items: center;
                            width: max-content;
                            animation: marqueeInfinite ${sliderSpeed}s linear infinite;
                            animation-direction: ${sliderDirection === 'right' ? 'reverse' : 'normal'};
                          }
                          .marquee-animated-track:hover {
                            animation-play-state: paused;
                          }
                          .slow-spin-plate {
                            animation: slowSpin 35s linear infinite;
                          }
                        `}</style>

                        <div 
                          className="marquee-animated-track"
                          style={{ gap: `${sliderItemGap}px` }}
                        >
                          {/* Render items duplicated for infinite loop */}
                          {[
                            ...(sliderCategory === 'custom' 
                              ? (customCutoutItems.length > 0 ? customCutoutItems : [
                                  { id: 'placeholder', title: 'Upload Your Photo', subtitle: 'Use AI Studio Below', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop' }
                                ])
                              : (sliderCategory === 'cars' ? [
                                  { id: 'c1', title: 'Porsche 911 GT3 RS', subtitle: 'Silver Track Cutout', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'c2', title: 'Lamborghini Huracán', subtitle: 'Matte Nero Supercar', url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'c3', title: 'Ferrari F8 Tributo', subtitle: 'Rosso Corsa Supercar', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'c4', title: 'Mustang Fastback 1969', subtitle: 'Gold Heritage Heritage', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'c5', title: 'Mercedes-AMG GT', subtitle: 'Biturbo V8 Performance', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80&auto=format&fit=crop' }
                                ] : sliderCategory === 'motorcycles' ? [
                                  { id: 'm1', title: 'Ducati Panigale V4 S', subtitle: 'Corse Racing Red Superbike', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'm2', title: 'BMW R nineT Cafe Racer', subtitle: 'Custom Bronze Metal', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'm3', title: 'Triumph Bonneville T120', subtitle: 'Vintage Leather British Twin', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'm4', title: 'Harley-Davidson Fat Boy', subtitle: 'Chrome Softail Cruiser', url: 'https://images.unsplash.com/photo-1558981243-703630f9a7aa?w=800&q=80&auto=format&fit=crop' }
                                ] : sliderCategory === 'houses' ? [
                                  { id: 'h1', title: 'Cantilevered Glass Villa', subtitle: 'Minimalist Residence', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'h2', title: 'Nordic Alpine Chalet', subtitle: 'Timber & Glass Facade', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'h3', title: 'Palm Oceanfront Estate', subtitle: 'Infinity Edge Pool Villa', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'h4', title: 'Rooftop Penthouse Estate', subtitle: 'Skyline Residence', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80&auto=format&fit=crop' }
                                ] : sliderCategory === 'tech' ? [
                                  { id: 't1', title: 'Studio Hi-Fi Headphones', subtitle: 'Spatial Audio Matte Black', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop' },
                                  { id: 't2', title: '18K Gold Chronograph', subtitle: 'Swiss Automatic Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop' },
                                  { id: 't3', title: 'Artisan Espresso Machine', subtitle: 'Brass & Chrome', url: 'https://images.unsplash.com/photo-1517668808822-9e4288246ede?w=800&q=80&auto=format&fit=crop' },
                                  { id: 't4', title: 'Architectural Sneakers', subtitle: 'Minimalist Footwear', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop' }
                                ] : [
                                  { id: 'p1', title: 'Wagyu Steak Cut', subtitle: 'Charcoal & Truffle Butter', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'p2', title: 'Artisan Nigiri Platter', subtitle: 'Fresh Caviar & Salmon', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'p3', title: 'Truffle Tagliatelle', subtitle: 'Handmade Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'p4', title: 'Salmon Citrus Salad', subtitle: 'Micro-Greens & Avocado', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'p5', title: 'Neapolitan Wood Pizza', subtitle: 'San Marzano Mozzarella', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'p6', title: 'Gold Leaf Berry Tart', subtitle: 'Vanilla Bean Patisserie', url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80&auto=format&fit=crop' }
                                ]
                              )
                            ),
                            ...(sliderCategory === 'custom' 
                              ? (customCutoutItems.length > 0 ? customCutoutItems : [
                                  { id: 'placeholder_dup', title: 'Upload Your Photo', subtitle: 'Use AI Studio Below', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop' }
                                ])
                              : (sliderCategory === 'cars' ? [
                                  { id: 'c1_dup', title: 'Porsche 911 GT3 RS', subtitle: 'Silver Track Cutout', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'c2_dup', title: 'Lamborghini Huracán', subtitle: 'Matte Nero Supercar', url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'c3_dup', title: 'Ferrari F8 Tributo', subtitle: 'Rosso Corsa Supercar', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'c4_dup', title: 'Mustang Fastback 1969', subtitle: 'Gold Heritage Heritage', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'c5_dup', title: 'Mercedes-AMG GT', subtitle: 'Biturbo V8 Performance', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80&auto=format&fit=crop' }
                                ] : sliderCategory === 'motorcycles' ? [
                                  { id: 'm1_dup', title: 'Ducati Panigale V4 S', subtitle: 'Corse Racing Red Superbike', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'm2_dup', title: 'BMW R nineT Cafe Racer', subtitle: 'Custom Bronze Metal', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'm3_dup', title: 'Triumph Bonneville T120', subtitle: 'Vintage Leather British Twin', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'm4_dup', title: 'Harley-Davidson Fat Boy', subtitle: 'Chrome Softail Cruiser', url: 'https://images.unsplash.com/photo-1558981243-703630f9a7aa?w=800&q=80&auto=format&fit=crop' }
                                ] : sliderCategory === 'houses' ? [
                                  { id: 'h1_dup', title: 'Cantilevered Glass Villa', subtitle: 'Minimalist Residence', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'h2_dup', title: 'Nordic Alpine Chalet', subtitle: 'Timber & Glass Facade', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'h3_dup', title: 'Palm Oceanfront Estate', subtitle: 'Infinity Edge Pool Villa', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'h4_dup', title: 'Rooftop Penthouse Estate', subtitle: 'Skyline Residence', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80&auto=format&fit=crop' }
                                ] : sliderCategory === 'tech' ? [
                                  { id: 't1_dup', title: 'Studio Hi-Fi Headphones', subtitle: 'Spatial Audio Matte Black', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop' },
                                  { id: 't2_dup', title: '18K Gold Chronograph', subtitle: 'Swiss Automatic Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop' },
                                  { id: 't3_dup', title: 'Artisan Espresso Machine', subtitle: 'Brass & Chrome', url: 'https://images.unsplash.com/photo-1517668808822-9e4288246ede?w=800&q=80&auto=format&fit=crop' },
                                  { id: 't4_dup', title: 'Architectural Sneakers', subtitle: 'Minimalist Footwear', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop' }
                                ] : [
                                  { id: 'p1_dup', title: 'Wagyu Steak Cut', subtitle: 'Charcoal & Truffle Butter', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'p2_dup', title: 'Artisan Nigiri Platter', subtitle: 'Fresh Caviar & Salmon', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'p3_dup', title: 'Truffle Tagliatelle', subtitle: 'Handmade Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'p4_dup', title: 'Salmon Citrus Salad', subtitle: 'Micro-Greens & Avocado', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'p5_dup', title: 'Neapolitan Wood Pizza', subtitle: 'San Marzano Mozzarella', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80&auto=format&fit=crop' },
                                  { id: 'p6_dup', title: 'Gold Leaf Berry Tart', subtitle: 'Vanilla Bean Patisserie', url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80&auto=format&fit=crop' }
                                ]
                              )
                            )
                          ].map((item, idx) => (
                            <div 
                              key={idx}
                              style={{ width: `${sliderItemScale}px` }}
                              className="group/item flex flex-col items-center justify-center text-center shrink-0 transition-transform duration-300 hover:scale-110 cursor-pointer select-none"
                            >
                              <div className="relative w-full aspect-square flex items-center justify-center p-2">
                                <img
                                  src={item.url}
                                  alt={item.title}
                                  className={`w-full h-full object-contain transition-all duration-300 ${
                                    sliderEnableRotate && sliderCategory === 'plates' ? 'slow-spin-plate' : ''
                                  }`}
                                  style={{
                                    filter: sliderEnableShadow 
                                      ? 'drop-shadow(0 20px 25px rgba(0,0,0,0.65)) drop-shadow(0 0 15px rgba(245,158,11,0.2))' 
                                      : 'none',
                                    transform: sliderEnable3dTilt ? 'perspective(500px) rotateX(10deg)' : 'none'
                                  }}
                                />
                                {sliderEnableShadow && (
                                  <div className="absolute -bottom-2 w-3/4 h-3 bg-black/50 blur-md rounded-full pointer-events-none group-hover/item:scale-125 transition-transform" />
                                )}
                              </div>
                              <div className="mt-3 space-y-0.5">
                                <h5 className={`text-xs font-black truncate max-w-[160px] ${
                                  sliderThemeBg === 'light' ? 'text-slate-900' : 'text-white'
                                }`}>
                                  {item.title}
                                </h5>
                                <p className={`text-[10px] font-medium truncate max-w-[160px] ${
                                  sliderThemeBg === 'light' ? 'text-slate-500' : 'text-zinc-400'
                                }`}>
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SLIDER CUSTOMIZATION CONTROLS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0A0A0C] border border-zinc-800 p-5 rounded-2xl">
                    
                    {/* SPEED & DIRECTION */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={14} className="text-amber-400" />
                        Rolling Speed ({sliderSpeed}s)
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="45"
                        step="1"
                        value={sliderSpeed}
                        onChange={(e) => setSliderSpeed(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer bg-zinc-800 h-2 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                        <span>Fast (5s)</span>
                        <span>Smooth (20s)</span>
                        <span>Ultra-Slow (45s)</span>
                      </div>
                    </div>

                    {/* ITEM SCALE & GAP */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Maximize2 size={14} className="text-cyan-400" />
                        Object Size ({sliderItemScale}px)
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="300"
                        step="10"
                        value={sliderItemScale}
                        onChange={(e) => setSliderItemScale(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer bg-zinc-800 h-2 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                        <span>Compact (100px)</span>
                        <span>Large Hero (300px)</span>
                      </div>
                    </div>

                    {/* MARQUEE DIRECTION & CANVAS THEME */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass size={14} className="text-emerald-400" />
                        Direction & Canvas Theme
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSliderDirection(prev => prev === 'left' ? 'right' : 'left')}
                          className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <ChevronsLeftRight size={12} />
                          <span>{sliderDirection === 'left' ? '← Left' : 'Right →'}</span>
                        </button>
                        <select
                          value={sliderThemeBg}
                          onChange={(e) => setSliderThemeBg(e.target.value as any)}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-300 font-bold focus:outline-none"
                        >
                          <option value="dark">🌙 Dark Slate</option>
                          <option value="light">☀️ Minimal Light</option>
                          <option value="gold">👑 Luxury Gold</option>
                          <option value="cyber">⚡ Cyber Neon</option>
                        </select>
                      </div>
                    </div>

                    {/* TOGGLE EFFECTS */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders size={14} className="text-purple-400" />
                        Visual FX Toggles
                      </label>
                      <div className="space-y-1.5 text-xs">
                        <label className="flex items-center gap-2 text-zinc-300 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sliderEnableRotate}
                            onChange={(e) => setSliderEnableRotate(e.target.checked)}
                            className="w-3.5 h-3.5 rounded bg-zinc-900 border-zinc-700 accent-amber-500"
                          />
                          <span>360° Plate Spinning Motion</span>
                        </label>
                        <label className="flex items-center gap-2 text-zinc-300 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sliderEnableShadow}
                            onChange={(e) => setSliderEnableShadow(e.target.checked)}
                            className="w-3.5 h-3.5 rounded bg-zinc-900 border-zinc-700 accent-amber-500"
                          />
                          <span>Floor Drop Shadow & Glow</span>
                        </label>
                      </div>
                    </div>

                  </div>

                  {/* CUSTOM CUTOUTS GALLERY MANAGER */}
                  {customCutoutItems.length > 0 && (
                    <div className="bg-[#0A0A0E] border border-amber-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest">
                            {customCutoutItems.length} Custom Items
                          </span>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">
                            My Active Cutout Collection
                          </h4>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Clear all custom cutout items?')) {
                              setCustomCutoutItems([]);
                            }
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 font-bold transition cursor-pointer"
                        >
                          Clear All Items
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {customCutoutItems.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="bg-black/60 border border-zinc-800 hover:border-amber-500/50 p-2 rounded-xl flex flex-col items-center text-center relative group transition"
                          >
                            <button
                              onClick={() => setCustomCutoutItems(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer z-10"
                              title="Delete Item"
                            >
                              ✕
                            </button>
                            <div className="w-full aspect-square p-2 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:8px_8px] rounded-lg overflow-hidden flex items-center justify-center">
                              <img src={item.url} alt={item.title} className="max-h-full max-w-full object-contain filter drop-shadow(0 5px 10px rgba(0,0,0,0.5))" />
                            </div>
                            <span className="text-[11px] font-bold text-zinc-200 truncate w-full mt-1.5">{item.title}</span>
                            <span className="text-[9px] text-zinc-500 truncate w-full">{item.subtitle || 'Custom Asset'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI BACKGROUND REMOVER STUDIO SECTION */}
                  <div className="bg-[#0A0A0E] border border-cyan-500/30 rounded-2xl p-6 space-y-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-black uppercase tracking-widest">
                          Integrated AI Background Removal Tool
                        </span>
                        <h4 className="text-lg font-black text-white flex items-center gap-2 mt-1">
                          <Wand2 size={20} className="text-cyan-400" />
                          Remove Background from Any Image to Create Isolated Cutouts
                        </h4>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Upload any photo or enter an image URL to automatically strip white, light, or studio backgrounds and generate a clean transparent PNG for your rolling slider.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* INPUT SOURCE & PARAMETERS */}
                      <div className="space-y-4">
                        <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">1. Input Image & Sensitivity</p>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-zinc-400">Paste Image URL or Upload File</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Paste image URL (e.g. https://...)..."
                              value={bgRemoveImageInput}
                              onChange={(e) => setBgRemoveImageInput(e.target.value)}
                              className="flex-1 bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                            />
                            <label className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0">
                              <Upload size={14} />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      if (ev.target?.result) {
                                        setBgRemoveImageInput(ev.target.result as string);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {/* SLIDERS FOR THRESHOLD & FEATHER */}
                        <div className="grid grid-cols-2 gap-3 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                              <span>Color Threshold</span>
                              <span className="text-cyan-400">{bgRemoveThreshold}</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="80"
                              value={bgRemoveThreshold}
                              onChange={(e) => setBgRemoveThreshold(Number(e.target.value))}
                              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                              <span>Edge Feathering</span>
                              <span className="text-cyan-400">{bgRemoveFeather}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="5"
                              value={bgRemoveFeather}
                              onChange={(e) => setBgRemoveFeather(Number(e.target.value))}
                              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                            />
                          </div>
                        </div>

                        <button
                          onClick={async () => {
                            if (!bgRemoveImageInput) return;
                            setProcessingBgRemoval(true);
                            try {
                              const img = new Image();
                              img.crossOrigin = 'anonymous';
                              img.src = bgRemoveImageInput;

                              await new Promise((resolve, reject) => {
                                img.onload = resolve;
                                img.onerror = () => reject(new Error('Failed to load image'));
                              });

                              const canvas = document.createElement('canvas');
                              const ctx = canvas.getContext('2d');
                              if (!ctx) throw new Error('Canvas context error');

                              canvas.width = img.naturalWidth || img.width || 800;
                              canvas.height = img.naturalHeight || img.height || 600;

                              ctx.drawImage(img, 0, 0);
                              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                              const data = imgData.data;

                              let totalR = 0, totalG = 0, totalB = 0, count = 0;
                              for (let y = 0; y < Math.min(20, canvas.height); y++) {
                                for (let x = 0; x < Math.min(20, canvas.width); x++) {
                                  const idx = (y * canvas.width + x) * 4;
                                  totalR += data[idx];
                                  totalG += data[idx + 1];
                                  totalB += data[idx + 2];
                                  count++;
                                }
                              }
                              const bgR = count ? totalR / count : 255;
                              const bgG = count ? totalG / count : 255;
                              const bgB = count ? totalB / count : 255;

                              const thresh = bgRemoveThreshold;
                              const feather = bgRemoveFeather;

                              for (let i = 0; i < data.length; i += 4) {
                                const r = data[i];
                                const g = data[i + 1];
                                const b = data[i + 2];

                                const dist = Math.sqrt(
                                  (r - bgR) * (r - bgR) +
                                  (g - bgG) * (g - bgG) +
                                  (b - bgB) * (b - bgB)
                                );
                                const bright = (r + g + b) / 3;

                                if (dist < thresh || (bgR > 210 && bright > (255 - thresh * 0.85))) {
                                  if (dist < Math.max(0, thresh - feather * 5)) {
                                    data[i + 3] = 0;
                                  } else {
                                    const alpha = Math.max(0, Math.min(255, ((dist - (thresh - feather * 5)) / (feather * 5)) * 255));
                                    data[i + 3] = alpha;
                                  }
                                }
                              }

                              ctx.putImageData(imgData, 0, 0);
                              setBgRemoveResultUrl(canvas.toDataURL('image/png'));
                            } catch (e) {
                              console.error(e);
                            } finally {
                              setProcessingBgRemoval(false);
                            }
                          }}
                          disabled={!bgRemoveImageInput || processingBgRemoval}
                          className="w-full py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-40 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                        >
                          {processingBgRemoval ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
                          <span>{processingBgRemoval ? 'Processing Background Removal...' : 'Remove Background Now'}</span>
                        </button>
                      </div>

                      {/* OUTPUT PREVIEW & ADD TO SLIDER */}
                      <div className="space-y-4">
                        <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">2. Transparent Cutout Result</p>

                        <div className="aspect-video bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:12px_12px] bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center relative overflow-hidden p-4">
                          {bgRemoveResultUrl ? (
                            <img
                              src={bgRemoveResultUrl}
                              alt="Background Removed Result"
                              className="max-h-full max-w-full object-contain filter drop-shadow(0 15px 20px rgba(0,0,0,0.6))"
                            />
                          ) : (
                            <div className="text-center text-zinc-600 text-xs space-y-1">
                              <Image size={32} className="mx-auto opacity-40" />
                              <p>Transparent PNG preview will appear here on checkerboard grid</p>
                            </div>
                          )}
                        </div>

                        {bgRemoveResultUrl && (
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Item title (e.g. Luxury Custom Watch)..."
                              value={bgRemoveItemName}
                              onChange={(e) => setBgRemoveItemName(e.target.value)}
                              className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                            />

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  if (!bgRemoveResultUrl) return;
                                  const title = bgRemoveItemName.trim() || `Custom Cutout ${customCutoutItems.length + 1}`;
                                  const newItem = {
                                    id: `custom_${Date.now()}`,
                                    title,
                                    subtitle: 'AI Background Removed Cutout',
                                    url: bgRemoveResultUrl,
                                    desc: 'Transparent PNG cutout'
                                  };
                                  setCustomCutoutItems(prev => {
                                    const updated = [newItem, ...prev];
                                    syncCustomCutoutsToSite(updated);
                                    return updated;
                                  });
                                  setSliderCategory('custom');
                                  setBgRemoveResultUrl(null);
                                  setBgRemoveItemName('');
                                }}
                                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                              >
                                <Plus size={14} /> Add to Rolling Slider
                              </button>

                              <a
                                href={bgRemoveResultUrl}
                                download="transparent-cutout.png"
                                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                              >
                                <Download size={14} /> PNG
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

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

                        {/* HERO VIDEO SLOT */}
                        <div className="bg-[#121217] border border-amber-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between group">
                          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                            <span>Hero Video</span>
                            <div className="flex items-center gap-2">
                              {siteData.content.heroVideo && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAssignImage('', { type: 'heroVideo' });
                                  }}
                                  className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Clear Hero Video"
                                >
                                  <X size={10} />
                                </button>
                              )}
                              <Video size={10} className="text-amber-400" />
                            </div>
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50 flex items-center justify-center relative">
                            {siteData.content.heroVideo ? (
                              <span className="text-[9px] text-amber-300 font-mono truncate px-1">{siteData.content.heroVideo}</span>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">No Video Set</div>
                            )}
                          </div>
                        </div>

                        {/* SHOWCASE CUTOUT SLOT */}
                        <div className="bg-[#121217] border border-rose-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-rose-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Showcase Cutout</span>
                            <Play size={10} className="text-rose-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.showcaseCarImage || siteData.content.showcaseCutout || siteData.content.showcaseVideo ? (
                              <img src={siteData.content.showcaseCarImage || siteData.content.showcaseCutout || siteData.content.showcaseVideo} alt="Showcase Cutout" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default Cutout</div>
                            )}
                          </div>
                        </div>

                        {/* FEATURE 1 / SHOWCASE 1 */}
                        <div className="bg-[#121217] border border-sky-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Feature 1 (Primary)</span>
                            <Sparkles size={10} className="text-sky-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.program1Image || siteData.content.notebookImage ? (
                              <img src={siteData.content.program1Image || siteData.content.notebookImage} alt="Feature 1" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default PNG</div>
                            )}
                          </div>
                        </div>

                        {/* FEATURE 2 / SHOWCASE 2 */}
                        <div className="bg-[#121217] border border-sky-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Feature 2 (Secondary)</span>
                            <Sparkles size={10} className="text-sky-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.program2Image || siteData.content.tabletImage ? (
                              <img src={siteData.content.program2Image || siteData.content.tabletImage} alt="Feature 2" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default Tablet</div>
                            )}
                          </div>
                        </div>

                        {/* FEATURE 3 / STEERING WHEEL SLOT */}
                        <div className="bg-[#121217] border border-sky-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Feature 3 (Craft)</span>
                            <Sparkles size={10} className="text-sky-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.program3Image || siteData.content.steeringWheelImage ? (
                              <img src={siteData.content.program3Image || siteData.content.steeringWheelImage} alt="Feature 3" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default Wheel</div>
                            )}
                          </div>
                        </div>

                        {/* FEATURE 4 / MOTORCYCLE TRACK SLOT */}
                        <div className="bg-[#121217] border border-sky-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Feature 4 (Specialty)</span>
                            <Sparkles size={10} className="text-sky-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.program4Image || siteData.content.motorcycleImage ? (
                              <img src={siteData.content.program4Image || siteData.content.motorcycleImage} alt="Feature 4" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default Track</div>
                            )}
                          </div>
                        </div>

                        {/* OFFER CARD 1 / PERMIT B */}
                        <div className="bg-[#121217] border border-emerald-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Offer Card 1</span>
                            <Star size={10} className="text-emerald-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.card1Image || siteData.content.autoCarImage ? (
                              <img src={siteData.content.card1Image || siteData.content.autoCarImage} alt="Offer 1" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default Offer 1</div>
                            )}
                          </div>
                        </div>

                        {/* OFFER CARD 2 / PERMIT MOTO */}
                        <div className="bg-[#121217] border border-emerald-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Offer Card 2</span>
                            <Star size={10} className="text-emerald-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.card2Image || siteData.content.manualCarImage ? (
                              <img src={siteData.content.card2Image || siteData.content.manualCarImage} alt="Offer 2" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default Offer 2</div>
                            )}
                          </div>
                        </div>

                        {/* OFFER CARD 3 / SPECIALTY */}
                        <div className="bg-[#121217] border border-emerald-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Offer Card 3</span>
                            <Star size={10} className="text-emerald-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.card3Image || siteData.content.motoAcademyImage ? (
                              <img src={siteData.content.card3Image || siteData.content.motoAcademyImage} alt="Offer 3" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default Offer 3</div>
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

                        {/* MARKET CARD 1 / SECTION 1 SLOT */}
                        <div className="bg-[#121217] border border-amber-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Market Card 1</span>
                            <Star size={10} className="text-amber-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.section1Image ? (
                              <img src={siteData.content.section1Image} alt="Market 1" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default Card 1</div>
                            )}
                          </div>
                        </div>

                        {/* MARKET CARD 2 / SECTION 2 SLOT */}
                        <div className="bg-[#121217] border border-amber-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Market Card 2</span>
                            <Star size={10} className="text-amber-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.section2Image ? (
                              <img src={siteData.content.section2Image} alt="Market 2" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default Card 2</div>
                            )}
                          </div>
                        </div>

                        {/* CATALOG / SHOWCASE SLOT */}
                        <div className="bg-[#121217] border border-indigo-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Catalog / Showcase</span>
                            <Image size={10} className="text-indigo-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.catalogImage || siteData.content.showcaseCarImage ? (
                              <img src={siteData.content.catalogImage || siteData.content.showcaseCarImage} alt="Catalog" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default Catalog</div>
                            )}
                          </div>
                        </div>

                        {/* CONTACT IMAGE SLOT */}
                        <div className="bg-[#121217] border border-emerald-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center justify-between">
                            <span>Contact Image</span>
                            <Globe size={10} className="text-emerald-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50">
                            {siteData.content.contactImage ? (
                              <img src={siteData.content.contactImage} alt="Contact" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-600">Default Contact</div>
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

                  {/* PREMIUM VIDEO ASSETS HUB: RESEARCH, prompt GENERATION & UPLOAD */}
                  <div className="bg-[#0A0A0C] border border-amber-500/30 rounded-2xl p-6 space-y-6 relative overflow-hidden">
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Sparkles size={10} className="animate-pulse text-amber-400" /> Cinema Loop Engine
                        </span>
                        <span className="text-zinc-500 text-xs">• Pinterest & AI Generated Videos</span>
                      </div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Video size={18} className="text-amber-400" />
                        Premium Website Video Backgrounds & Showcases
                      </h4>
                      <p className="text-xs text-zinc-400 max-w-xl">
                        Add cinematic loopable videos to the <strong>Homepage Background</strong> or the <strong>Section 2 Transformation showcase</strong>. Generate custom videos with AI prompts or search royalty-free clips.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-zinc-800">
                      {/* Left Side: Video Curator Search */}
                      <div className="space-y-3.5 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Search Stock Video Clips</span>
                          <span className="text-[10px] text-zinc-500">Curated loopable streams</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <input
                            type="text"
                            value={videoSearchQuery}
                            onChange={(e) => setVideoSearchQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { setVideoSearchPage(1); handleSearchVideos(e.currentTarget.value, videoSearchSource, 1); } }}
                            placeholder="e.g. cinematic lighting, 4K, shallow depth of field..."
                            className="px-3 py-2 bg-[#121216] border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 w-full"
                          />
                          <select 
                            value={videoSearchSource}
                            onChange={(e) => {
                              setVideoSearchSource(e.target.value);
                              setVideoSearchPage(1);
                            }}
                            className="px-3 py-2 bg-[#121216] border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 shrink-0"
                          >
                            <option value="pexels">Pexels (Best Hero)</option>
                            <option value="pixabay">Pixabay (Massive)</option>
                            <option value="mixkit">Mixkit (Cinematic)</option>
                          </select>
                          <button
                            onClick={() => { setVideoSearchPage(1); handleSearchVideos(); }}
                            disabled={isSearchingVideos}
                            className="px-4 py-2 bg-[#16161D] hover:bg-zinc-800 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-700 hover:border-zinc-600 transition disabled:opacity-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            {isSearchingVideos ? (
                              <RefreshCw size={13} className="animate-spin text-zinc-400" />
                            ) : (
                              <Search size={13} />
                            )}
                            <span>Search</span>
                          </button>
                        </div>

                        {/* Quick Presets */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['renovation', 'roofing', 'plumbing', 'chef', 'salon', 'lawn'].map((tag) => (
                            <button
                              key={tag}
                              onClick={() => { setVideoSearchQuery(tag); setVideoSearchPage(1); handleSearchVideos(tag, videoSearchSource, 1); }}
                              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 text-[10px] border border-zinc-800 transition cursor-pointer"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right Side: AI Video Generation from Prompt */}
                      <div className="space-y-3.5 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                            <Sparkles size={12} className="text-amber-400" /> AI Video Prompt Generator
                          </span>
                          <span className="text-[10px] text-zinc-500">Same as Pinterest Video Generation</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={videoPrompt}
                            onChange={(e) => setVideoPrompt(e.target.value)}
                            placeholder="Prompt: e.g. cinematic interior designer loft walkthrough loop..."
                            className="px-3 py-2 bg-[#121216] border border-amber-500/20 focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none w-full"
                          />
                          <button
                            onClick={handleGenerateVideo}
                            disabled={isGeneratingVideo || !videoPrompt.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-xl transition disabled:opacity-50 shrink-0 flex items-center gap-1.5 cursor-pointer"
                          >
                            {isGeneratingVideo ? (
                              <RefreshCw size={13} className="animate-spin text-black" />
                            ) : (
                              <Sparkles size={13} />
                            )}
                            <span>Generate</span>
                          </button>
                        </div>

                        {/* Quick Prompt Ideas */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <button
                            onClick={() => setVideoPrompt('modern luxury bathroom renovation transformation before after walk')}
                            className="px-2 py-0.5 rounded bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 hover:text-amber-200 text-[9px] border border-amber-500/10 transition cursor-pointer"
                          >
                            💡 Reno Idea
                          </button>
                          <button
                            onClick={() => setVideoPrompt('gourmet chef placing luxury culinary plate slow motion high detail')}
                            className="px-2 py-0.5 rounded bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 hover:text-amber-200 text-[9px] border border-amber-500/10 transition cursor-pointer"
                          >
                            💡 Culinary Idea
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* TERMINAL STATUS BLOCK FOR AI VIDEO GENERATION */}
                    {isGeneratingVideo && (
                      <div className="bg-[#050508] border border-amber-500/20 rounded-xl p-3.5 font-mono text-[10px] space-y-1.5 text-left">
                        <div className="flex items-center justify-between text-amber-400 border-b border-zinc-800 pb-1 mb-1 font-bold">
                          <span>🎥 CINEMATIC VIDEO RENDERING TERMINAL</span>
                          <RefreshCw size={10} className="animate-spin" />
                        </div>
                        {videoGenerationSteps.map((step, sIdx) => (
                          <div key={sIdx} className="text-zinc-400 flex items-center gap-1.5">
                            <span className="text-emerald-500">✔</span>
                            <span>{step}</span>
                          </div>
                        ))}
                        {currentVideoGenerationStep && (
                          <div className="text-amber-300 animate-pulse flex items-center gap-1.5 font-black">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                            </span>
                            <span>{currentVideoGenerationStep}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* DETAILED RESULTS LIST OF VIDEO ASSETS */}
                    {researchedVideosList.length > 0 && (
                      <div className="space-y-3.5 pt-4 border-t border-zinc-800 text-left">
                        <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                          <Video size={14} />
                          Loopable Video Catalog ({researchedVideosList.length})
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {researchedVideosList.map((video, idx) => (
                            <div key={idx} className="relative rounded-xl border border-zinc-800 bg-[#060609] overflow-visible group hover:border-amber-500/40 transition shadow-lg flex flex-col z-10 hover:z-30">
                              <div className="relative aspect-video rounded-t-xl overflow-hidden bg-black">
                                <video
                                  src={video.url}
                                  className="w-full h-full object-cover"
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                  controls
                                />
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-amber-400 text-[10px] font-bold border border-amber-500/30 shadow-md">
                                  {video.source === 'ai_generator' ? 'AI Generated' : 'Stock Clip'}
                                </div>
                                <a 
                                  href={video.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-zinc-300 hover:text-white hover:bg-amber-500 border border-zinc-700/50 hover:border-amber-400 shadow-md transition text-[10px] font-semibold flex items-center gap-1 z-20 cursor-pointer"
                                  title="Open in new tab to play/preview directly"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span>Preview</span>
                                  <ExternalLink size={10} />
                                </a>
                              </div>
                              <div className="p-2.5 bg-[#121217] rounded-b-xl border-t border-zinc-800/80 flex items-center justify-between gap-2 overflow-visible">
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[10px] font-bold text-white truncate" title={video.title}>{video.title}</span>
                                  <span className="text-[8px] text-zinc-500">1080p • Loopable .mp4</span>
                                </div>
                                {renderPlacementSelector(video.url)}
                              </div>
                            </div>
                          ))}
                        </div>
                        {researchedVideosList.length >= 15 && videoSearchSource !== 'mixkit' && (
                          <div className="pt-2 flex justify-center">
                            <button
                              onClick={loadMoreVideos}
                              disabled={isLoadingMoreVideos}
                              className="px-5 py-2 bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-300 transition flex items-center gap-2"
                            >
                              {isLoadingMoreVideos ? (
                                <RefreshCw size={13} className="animate-spin text-amber-400" />
                              ) : null}
                              Load More {videoSearchSource} Videos
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* UPLOAD CUSTOM VIDEO CLIPS */}
                    <div className="pt-4 border-t border-zinc-800 text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Upload Custom Website Video Clips</span>
                        <span className="text-[10px] text-zinc-500">MP4, WEBM format</span>
                      </div>
                      <div className="bg-[#050508] border-2 border-dashed border-zinc-800 hover:border-amber-500 rounded-xl p-5 text-center transition flex flex-col items-center justify-center space-y-1.5 relative group">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/5 text-amber-400 flex items-center justify-center">
                          <Upload size={16} />
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold text-white">Upload Custom Video Backgrounds</h5>
                          <p className="text-[9px] text-zinc-500 mt-0.5">Drag & drop your short video loops here or browse.</p>
                        </div>
                        <label className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-[10px] rounded-lg border border-zinc-700 transition cursor-pointer">
                          {isUploadingVideo ? 'Uploading Custom Video...' : 'Browse Video'}
                          <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>


                    {/* UPLOAD MODELS DROPZONE */}
                    <div className="bg-[#050508] border-2 border-dashed border-zinc-800 hover:border-amber-500 rounded-xl p-5 text-center transition flex flex-col items-center justify-center space-y-1.5 relative group mt-4">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/5 text-amber-400 flex items-center justify-center">
                        <Box size={16} />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-white">Upload Custom 3D Models (.glb)</h5>
                        <p className="text-[9px] text-zinc-500 mt-0.5">Place interactive 3D elements natively into the website.</p>
                      </div>
                      <label className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-[10px] rounded-lg border border-zinc-700 transition cursor-pointer mt-2">
                        Browse .glb Files
                        <input type="file" accept=".glb" onChange={handleModelUpload} className="hidden" />
                      </label>
                    </div>

                    {/* USER UPLOADED MODELS LIST */}
                    {uploadedModels.length > 0 && (
                      <div className="space-y-3.5 text-left pt-2">
                        <h5 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                          <Box size={14} className="text-amber-400" />
                          Your Uploaded 3D Models ({uploadedModels.length})
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {uploadedModels.map((modelUrl, idx) => (
                            <div key={idx} className="relative rounded-xl border border-zinc-800 bg-[#060609] overflow-visible group hover:border-amber-500/40 transition shadow-lg flex flex-col z-10 hover:z-30">
                              <div className="relative aspect-video rounded-t-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                                <Box size={32} className="text-zinc-700" />
                                <span className="absolute bottom-2 right-2 text-[8px] text-zinc-500 font-mono bg-black/50 px-1 rounded">.GLB</span>
                              </div>
                              <div className="p-2.5 bg-[#121217] rounded-b-xl border-t border-zinc-800/80 flex items-center justify-between gap-2 overflow-visible">
                                <button
                                  onClick={() => handleDeleteUploadedModel(idx)}
                                  className="p-1 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-md border border-red-800/40 transition shrink-0"
                                  title="Delete Model"
                                >
                                  <Trash2 size={12} />
                                </button>
                                {renderPlacementSelector(modelUrl, true)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* USER UPLOADED VIDEOS LIST */}
                    {uploadedVideos.length > 0 && (
                      <div className="space-y-3.5 text-left pt-2">
                        <h5 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                          <Upload size={14} className="text-amber-400" />
                          Your Uploaded Videos ({uploadedVideos.length})
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {uploadedVideos.map((videoUrl, idx) => (
                            <div key={idx} className="relative rounded-xl border border-zinc-800 bg-[#060609] overflow-visible group hover:border-amber-500/40 transition shadow-lg flex flex-col z-10 hover:z-30">
                              <div className="relative aspect-video rounded-t-xl overflow-hidden bg-black">
                                <video
                                  src={videoUrl}
                                  className="w-full h-full object-cover"
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                />
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-amber-400 text-[10px] font-bold border border-amber-500/30 shadow">
                                  Upload #{idx + 1}
                                </div>
                              </div>
                              <div className="p-2.5 bg-[#121217] rounded-b-xl border-t border-zinc-800/80 flex items-center justify-between gap-2 overflow-visible">
                                <button
                                  onClick={() => handleDeleteUploadedVideo(idx)}
                                  className="p-1 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-md border border-red-800/40 transition shrink-0"
                                  title="Delete Video"
                                >
                                  <Trash2 size={12} />
                                </button>
                                {renderPlacementSelector(videoUrl)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

                  {/* PINTEREST / WEB PHOTOS AUTO-ASSIGN HEADER */}
                  <div className="bg-[#121217] border border-purple-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                    <div>
                      <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={15} className="text-purple-400" />
                        Automated Pinterest Image Distribution
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Instantly fill Hero, About, Market Cards, Catalog, Contact & Service Cards with researched Pinterest photos.
                      </p>
                    </div>
                    <button
                      onClick={handleAutoAssignAllPinterestPhotos}
                      disabled={modifying}
                      className="px-4 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/25 border border-purple-400/40 cursor-pointer transition disabled:opacity-50 shrink-0"
                    >
                      <Sparkles size={14} className="text-amber-300 animate-pulse" />
                      <span>{modifying ? "Applying Photos..." : "📌 Auto-Assign All Pinterest Photos to Site Sections"}</span>
                    </button>
                  </div>

                  {/* RESEARCHED PINTEREST / WEB PHOTOS SECTION */}
                  {researchedPhotosList.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                          <Search size={14} />
                          Pinterest & Web Researched Photos ({researchedPhotosList.length})
                        </h4>
                      </div>
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

              
              {activeTab === 'trust' && (
                <div className="p-8 h-full overflow-y-auto max-w-5xl mx-auto space-y-8 text-left">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white flex items-center gap-2 mb-1">
                      <ShieldCheck size={24} className="text-yellow-400" /> 
                      Trust & Authority Multipliers
                    </h3>
                    <p className="text-sm text-zinc-400 max-w-2xl">
                      Configure high-trust local proof elements. We inject 5-star reviews, Google Maps proximity indicators, and bespoke trust badges straight into the generated design to double your conversion rate.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CUSTOM TRUST BADGES */}
                    <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-6 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Award size={16} className="text-yellow-400" />
                        Dynamic Trust Badge Studio
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Generate custom laurels and badges tailored specifically to this lead's city and niche.
                      </p>
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Target City</label>
                          <input 
                            type="text" 
                            value={badgeCity} 
                            onChange={(e) => setBadgeCity(e.target.value)} 
                            className="w-full bg-[#141418] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-yellow-500 focus:outline-none"
                            placeholder="e.g., Paris"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Niche / Award Name</label>
                          <input 
                            type="text" 
                            value={badgeNiche} 
                            onChange={(e) => setBadgeNiche(e.target.value)} 
                            className="w-full bg-[#141418] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-yellow-500 focus:outline-none"
                            placeholder="e.g., Best Dental Clinic"
                          />
                        </div>
                        <button
                          onClick={generateNicheReviews}
                          disabled={generatingReviews}
                          className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-bold rounded-lg text-xs transition border border-yellow-500/30"
                        >
                          {generatingReviews ? 'Generating Badges...' : 'Generate New Badges'}
                        </button>
                      </div>
                    </div>

                    {/* REVIEWS */}
                    <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-6 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Star size={16} className="text-blue-400 fill-current" />
                        Simulated Local Reviews
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        These simulated reviews will be placed in the generated templates to show social proof.
                      </p>
                      <div className="space-y-2 pt-2">
                        {nicheReviews.length > 0 ? (
                          nicheReviews.map((rev, idx) => (
                            <div key={idx} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-left">
                              <div className="flex text-yellow-400 mb-1">
                                <Star size={10} className="fill-current" /><Star size={10} className="fill-current" /><Star size={10} className="fill-current" /><Star size={10} className="fill-current" /><Star size={10} className="fill-current" />
                              </div>
                              <p className="text-[10px] text-zinc-300 italic mb-1">"{rev.text}"</p>
                              <p className="text-[9px] text-zinc-500 font-bold">— {rev.author}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
                            <span className="text-[10px] text-zinc-500">No reviews generated yet.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'template-maker' && (
                <div className="p-8 h-full overflow-hidden max-w-7xl mx-auto flex flex-col space-y-4 text-left">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                      <Wand2 size={20} className="text-purple-400" /> Template Maker Studio
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Upload screenshots or design inspirations. Our AI will analyze them and build a completely custom HTML/Tailwind template from scratch.
                    </p>
                  </div>

                  <div className="flex gap-4 flex-1 min-h-0">
                    {/* Left Panel: Inputs & Chat */}
                    <div className="w-1/3 flex flex-col gap-4">
                      {/* Upload Box */}
                      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-700 hover:border-purple-500 rounded-lg cursor-pointer transition">
                          <Upload size={24} className="text-zinc-500 mb-2" />
                          <span className="text-xs font-bold text-zinc-300">Upload Screenshots (Max 5)</span>
                          <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUploadForTemplateMaker} />
                        </label>
                        
                        {templateMakerImages.length > 0 && (
                          <div className="grid grid-cols-5 gap-2">
                            {templateMakerImages.map((img, i) => (
                              <div key={i} className="aspect-square rounded overflow-hidden border border-zinc-700 relative group">
                                <img src={img} className="w-full h-full object-cover" />
                                <button 
                                  onClick={() => setTemplateMakerImages(prev => prev.filter((_, idx) => idx !== i))}
                                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                >
                                  <Trash2 size={12} className="text-red-400" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={handleGenerateTemplateMaker}
                          disabled={templateMakerImages.length === 0 || templateMakerGenerating}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex justify-center items-center gap-2 transition"
                        >
                          <Sparkles size={14} /> {templateMakerGenerating && !templateMakerHtml ? 'Building Template...' : 'Generate Template'}
                        </button>
                      </div>

                      {/* Chat Refinement Panel */}
                      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col min-h-0 overflow-hidden">
                        <div className="p-3 border-b border-zinc-800 text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                          <MessageSquare size={14} /> Refine Template
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {templateMakerChat.length === 0 ? (
                            <div className="text-center text-zinc-500 text-xs mt-4">
                              Generate a template first, then chat here to request changes (e.g., "make the header blue" or "add a pricing section").
                            </div>
                          ) : (
                            templateMakerChat.map((msg, i) => (
                              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-3 py-2 rounded-xl text-xs max-w-[85%] ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                                  {msg.text}
                                </div>
                              </div>
                            ))
                          )}
                          {templateMakerGenerating && templateMakerHtml && (
                            <div className="flex justify-start">
                              <div className="px-3 py-2 rounded-xl text-xs bg-zinc-800 text-zinc-400 animate-pulse">
                                AI is modifying template...
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-3 border-t border-zinc-800 flex gap-2">
                          <input
                            type="text"
                            placeholder="Tell AI to fix or change something..."
                            value={templateMakerChatInput}
                            onChange={e => setTemplateMakerChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleTemplateMakerChat()}
                            className="flex-1 bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                          <button
                            onClick={handleTemplateMakerChat}
                            disabled={!templateMakerChatInput.trim() || templateMakerGenerating || !templateMakerHtml}
                            className="px-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg transition"
                          >
                            <Play size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Preview */}
                    <div className="flex-1 bg-white rounded-xl overflow-hidden border border-zinc-700 flex flex-col">
                      <div className="bg-zinc-900 border-b border-zinc-800 p-2 flex justify-between items-center px-4">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Live Preview</span>
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                        </div>
                      </div>
                      <div className="flex-1 relative bg-white">
                        {templateMakerHtml ? (
                          <iframe srcDoc={templateMakerHtml} className="absolute inset-0 w-full h-full border-0" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
                            <Wand2 size={48} className="mb-4 opacity-20" />
                            <p className="text-sm font-medium">Waiting for generation...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'csv-bulk-generator' && (
                <div className="p-6 h-full overflow-y-auto max-w-7xl mx-auto space-y-6 text-left">
                  {/* HEADER CARD */}
                  <div className="bg-[#0A0A0C] border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
                          <FileSpreadsheet size={14} /> CSV Bulk Website Generator & Direct Netlify Deployer
                        </div>
                        <h3 className="text-xl font-black text-white font-heading">
                          Generate & Auto-Deploy Websites in Bulk from CSV
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-3xl mt-1">
                          Upload your leads spreadsheet. The selected model template will adapt to each business name, phone number, email, address, and city—generating personalized websites and deploying them live to Netlify under their clean business name with 1 click!
                        </p>
                      </div>

                      {/* TOP ACTION BUTTONS */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={() => setRawTextModalOpen(true)}
                          className="px-3.5 py-2 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles size={14} className="text-purple-400" />
                          ✨ Analyze Raw Text with AI
                        </button>

                        <button
                          onClick={handleLoadSampleCsvLeads}
                          className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles size={14} className="text-amber-400" />
                          Load Sample CSV
                        </button>

                        <label className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20">
                          <Upload size={14} />
                          Upload CSV File
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleCsvFileUpload}
                            className="hidden"
                          />
                        </label>

                        {csvLeads.filter(r => r.status === 'completed' && r.html).length > 0 && (
                          <>
                            <button
                              onClick={handleDeployAllToNetlify}
                              disabled={isBulkDeployingNetlify}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
                            >
                              {isBulkDeployingNetlify ? (
                                <RefreshCw size={14} className="animate-spin text-slate-950" />
                              ) : (
                                <Rocket size={14} />
                              )}
                              {isBulkDeployingNetlify
                                ? `Deploying (${bulkDeployProgress.current}/${bulkDeployProgress.total})...`
                                : `🚀 Auto-Deploy All (${csvLeads.filter(r => r.status === 'completed').length}) to Netlify`}
                            </button>

                            <button
                              onClick={handleDownloadAllWebsitesZip}
                              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileDown size={14} />
                              ZIP Backup
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* NETLIFY TOKEN AUTO-DEPLOY CONFIGURATION BAR */}
                    <div className="bg-zinc-900/80 border border-cyan-500/30 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                          <Globe size={16} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-white flex items-center gap-1.5">
                            Netlify Personal Access Token <span className="text-[10px] text-zinc-400 font-normal">(Required for 1-Click Auto-Deploy)</span>
                          </label>
                          <p className="text-[10px] text-zinc-400">
                            Enter your token once to publish all websites live directly to Netlify without dragging ZIPs manually.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-1 max-w-md">
                        <input
                          type="password"
                          value={netlifyToken}
                          onChange={(e) => {
                            setNetlifyToken(e.target.value);
                            localStorage.setItem('NETLIFY_AUTH_TOKEN', e.target.value.trim());
                          }}
                          placeholder="Paste nfp_... token"
                          className="flex-1 bg-black/80 border border-zinc-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none"
                        />
                        <a
                          href="https://app.netlify.com/user/applications#personal-access-tokens"
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-cyan-400 hover:text-cyan-300 text-[11px] font-bold rounded-lg border border-zinc-700 shrink-0 transition flex items-center gap-1"
                        >
                          Get Token ↗
                        </a>
                      </div>
                    </div>

                    {/* TEMPLATE & CONFIGURATION CONTROLS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                      {/* MODEL TEMPLATE CHOSEN */}
                      <div className="space-y-1.5 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                        <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                          <Layers size={13} className="text-amber-400" />
                          Selected Model Template
                        </label>
                        <select
                          value={selectedBulkTemplate}
                          onChange={(e) => setSelectedBulkTemplate(e.target.value)}
                          disabled={isBulkGenerating}
                          className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="outlandHomes">👑 Outland Homes (Dark Gold Luxury & Services)</option>
                          <option value="elan">⚡ Élan Permis (Cyber Cyan Auto & Modern)</option>
                          <option value="luxury">🖤 Luxury Theme (Monochrome Dark)</option>
                          <option value="taste">🍷 Gourmand Gastronomie (Warm Food & Catering)</option>
                          <option value="realestate">🏛️ Prestige Immobilier (Real Estate)</option>
                          <option value="air">🌿 Air Minimalist White (Clean SPA & Agency)</option>
                        </select>
                        <p className="text-[10px] text-zinc-500">
                          All generated sites will share this identical high-end design framework, personalized per lead.
                        </p>
                      </div>

                      {/* TARGET LANGUAGE OVERRIDE */}
                      <div className="space-y-1.5 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                        <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                          <Globe size={13} className="text-emerald-400" />
                          Website Translation
                        </label>
                        <select
                          value={selectedBulkLang}
                          onChange={(e) => setSelectedBulkLang(e.target.value)}
                          disabled={isBulkGenerating}
                          className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-400 font-mono"
                        >
                          <option value="auto">🌍 Auto-Detect (Per Lead Market / Location)</option>
                          <option value="fr">🇫🇷 Français (French)</option>
                          <option value="en">🇬🇧 English (English)</option>
                          <option value="es">🇪🇸 Español (Spanish)</option>
                          <option value="de">🇩🇪 Deutsch (German)</option>
                        </select>
                        <p className="text-[10px] text-zinc-500">
                          Applies full localized translation to all text & niche headers across generated websites.
                        </p>
                      </div>

                      {/* WORKSPACE STATUS SUMMARY */}
                      <div className="space-y-1.5 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                        <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                          <Building size={13} className="text-cyan-400" />
                          Batch Progress ({csvLeads.length} Leads)
                        </label>
                        <div className="flex items-center justify-between bg-black/60 px-3 py-2 rounded-lg border border-zinc-800 text-xs">
                          <span className="text-zinc-400 font-mono">
                            Ready: <strong className="text-white">{csvLeads.filter(r => r.status === 'pending').length}</strong> | 
                            Deployed: <strong className="text-cyan-400">{csvLeads.filter(r => r.deployStatus === 'deployed').length}</strong>
                          </span>
                          <span className="text-[11px] text-amber-400 font-bold">
                            {isBulkGenerating ? `Gen ${bulkProgress.current}/${bulkProgress.total}` : isBulkDeployingNetlify ? `Deploy ${bulkDeployProgress.current}/${bulkDeployProgress.total}` : 'Idle'}
                          </span>
                        </div>
                        {(isBulkGenerating || isBulkDeployingNetlify) && (
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
                            <div
                              className="bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300"
                              style={{
                                width: isBulkGenerating
                                  ? `${(bulkProgress.current / (bulkProgress.total || 1)) * 100}%`
                                  : `${(bulkDeployProgress.current / (bulkDeployProgress.total || 1)) * 100}%`
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* GENERATE ALL OR STOP BUTTON */}
                      <div className="flex flex-col justify-end">
                        {isBulkGenerating ? (
                          <button
                            onClick={handleStopBulkGeneration}
                            className="w-full h-[42px] bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer animate-pulse"
                          >
                            <Square size={14} className="fill-current" />
                            Stop Bulk Gen ({bulkProgress.current}/{bulkProgress.total})
                          </button>
                        ) : (
                          <button
                            onClick={handleRunBulkGeneration}
                            disabled={csvLeads.length === 0}
                            className="w-full h-[42px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                          >
                            <Zap size={15} />
                            Generate {csvLeads.length} Sites
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* WHATSAPP BULK OUTREACH CONTROL PANEL */}
                  <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 shadow-xl space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <MessageSquare size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                            WhatsApp Bulk Campaign Dispatcher (With Pacing Timer)
                          </h4>
                          <p className="text-[11px] text-zinc-400">
                            Send generated site previews directly to leads on WhatsApp with humanized delay timer.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-black/60 border border-zinc-800 rounded-lg px-2.5 py-1">
                          <Clock size={13} className="text-emerald-400" />
                          <span className="text-[11px] font-bold text-zinc-300">Delay (s):</span>
                          <input
                            type="number"
                            min={2}
                            max={300}
                            value={waBulkDelay}
                            onChange={(e) => setWaBulkDelay(Number(e.target.value) || 15)}
                            className="w-12 bg-zinc-900 text-white text-xs font-mono px-1 py-0.5 rounded border border-zinc-700 text-center focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={handleRunWaBulkOutreach}
                          disabled={isWaBulkSending || csvLeads.filter(r => r.phone).length === 0}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 font-bold"
                        >
                          {isWaBulkSending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                          {isWaBulkSending ? 'Sending WhatsApp...' : `🚀 Launch WhatsApp Campaign (${csvLeads.filter(r => r.phone).length} Leads)`}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-300">
                        WhatsApp Message Template (Placeholders: {'{businessName}'}, {'{city}'}, {'{siteUrl}'}):
                      </label>
                      <input
                        type="text"
                        value={waBulkMessage}
                        onChange={(e) => setWaBulkMessage(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        placeholder="Bonjour {businessName}, votre nouveau site web est prêt : {siteUrl}"
                      />
                    </div>

                    {waBulkLogs.length > 0 && (
                      <div className="bg-black/80 rounded-xl p-2.5 border border-zinc-800 max-h-24 overflow-y-auto space-y-1 font-mono text-[10px]">
                        {waBulkLogs.map((log, i) => (
                          <div key={i} className={log.startsWith('✓') ? 'text-emerald-400' : log.startsWith('✕') ? 'text-red-400' : 'text-zinc-400'}>
                            {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CSV LEADS & GENERATED WEBSITES TABLE */}
                  {csvLeads.length > 0 ? (
                    <div className="bg-[#0A0A0C] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                      <div className="p-4 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet size={16} className="text-amber-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">
                            Leads & Personalized Website Generation Status ({csvLeads.length})
                          </h4>
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          Edit contact info directly in the table below to personalize website contact data.
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-zinc-800 bg-black/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                              <th className="p-3 w-10 text-center">#</th>
                              <th className="p-3">Business Name</th>
                              <th className="p-3">City / Location</th>
                              <th className="p-3">Phone Number</th>
                              <th className="p-3">Email Address</th>
                              <th className="p-3 text-center">Generation</th>
                              <th className="p-3 text-center">Live Netlify Deployment</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/60">
                            {csvLeads.map((row, idx) => (
                              <tr key={row.id} className="hover:bg-zinc-900/40 transition">
                                <td className="p-3 text-center font-mono text-zinc-500 font-bold">{idx + 1}</td>
                                
                                {/* BUSINESS NAME (EDITABLE) */}
                                <td className="p-3 min-w-[160px]">
                                  <input
                                    type="text"
                                    value={row.businessName}
                                    onChange={(e) => handleUpdateCsvLeadField(row.id, 'businessName', e.target.value)}
                                    className="w-full bg-black/60 border border-zinc-800 focus:border-amber-400 rounded px-2 py-1 text-xs text-white font-bold"
                                  />
                                </td>

                                {/* CITY (EDITABLE) */}
                                <td className="p-3 min-w-[130px]">
                                  <input
                                    type="text"
                                    value={row.city}
                                    onChange={(e) => handleUpdateCsvLeadField(row.id, 'city', e.target.value)}
                                    className="w-full bg-black/60 border border-zinc-800 focus:border-amber-400 rounded px-2 py-1 text-xs text-amber-300 font-medium"
                                  />
                                </td>

                                {/* PHONE (EDITABLE) */}
                                <td className="p-3 min-w-[140px]">
                                  <input
                                    type="text"
                                    value={row.phone}
                                    onChange={(e) => handleUpdateCsvLeadField(row.id, 'phone', e.target.value)}
                                    className="w-full bg-black/60 border border-zinc-800 focus:border-amber-400 rounded px-2 py-1 text-xs text-cyan-300 font-mono"
                                  />
                                </td>

                                {/* EMAIL (EDITABLE) */}
                                <td className="p-3 min-w-[170px]">
                                  <input
                                    type="text"
                                    value={row.email}
                                    onChange={(e) => handleUpdateCsvLeadField(row.id, 'email', e.target.value)}
                                    className="w-full bg-black/60 border border-zinc-800 focus:border-amber-400 rounded px-2 py-1 text-xs text-zinc-300"
                                  />
                                </td>

                                {/* GENERATION STATUS */}
                                <td className="p-3 text-center">
                                  {row.status === 'pending' && (
                                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold uppercase border border-zinc-700">
                                      Pending
                                    </span>
                                  )}
                                  {row.status === 'generating' && (
                                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold uppercase border border-amber-500/30 flex items-center justify-center gap-1 animate-pulse">
                                      <RefreshCw size={10} className="animate-spin" />
                                      Generating
                                    </span>
                                  )}
                                  {row.status === 'completed' && (
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold uppercase border border-emerald-500/30 inline-flex items-center gap-1">
                                      <Check size={10} />
                                      Generated {row.generatedTime}
                                    </span>
                                  )}
                                  {row.status === 'error' && (
                                    <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-bold uppercase border border-red-500/30">
                                      Error
                                    </span>
                                  )}
                                </td>

                                {/* LIVE NETLIFY DEPLOYMENT */}
                                <td className="p-3 text-center">
                                  {row.deployStatus === 'deployed' && row.netlifyUrl ? (
                                    <a
                                      href={row.netlifyUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-[11px] font-bold font-mono transition"
                                    >
                                      <Globe size={11} />
                                      {row.netlifyUrl.replace('https://', '')}
                                      <ExternalLink size={10} />
                                    </a>
                                  ) : row.deployStatus === 'deploying' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-lg text-[10px] font-bold uppercase animate-pulse">
                                      <RefreshCw size={10} className="animate-spin" />
                                      Deploying to Netlify...
                                    </span>
                                  ) : row.status === 'completed' && row.html ? (
                                    <button
                                      onClick={() => handleDeploySingleLeadToNetlify(row)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-300 border border-zinc-700 hover:border-cyan-500/40 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer"
                                    >
                                      <Rocket size={11} className="text-cyan-400" />
                                      Deploy Live
                                    </button>
                                  ) : (
                                    <span className="text-zinc-600 font-mono text-[10px]">—</span>
                                  )}
                                </td>

                                {/* ACTIONS */}
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {/* SINGLE LEAD GENERATION / RE-GENERATION BUTTON */}
                                    <button
                                      onClick={() => handleGenerateSingleLead(row)}
                                      disabled={row.status === 'generating' || isBulkGenerating}
                                      className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase flex items-center gap-1 transition cursor-pointer border ${
                                        row.status === 'completed'
                                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                                          : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30'
                                      }`}
                                      title={row.status === 'completed' ? 'Re-generate site with current preview edits' : 'Generate site for this lead'}
                                    >
                                      {row.status === 'generating' ? (
                                        <RefreshCw size={11} className="animate-spin text-amber-400" />
                                      ) : (
                                        <Zap size={11} className="text-amber-400" />
                                      )}
                                      {row.status === 'completed' ? 'Re-Gen' : 'Generate'}
                                    </button>

                                    {row.status === 'completed' && row.html && (
                                      <>
                                        <button
                                          onClick={() => {
                                            setPreviewModalTitle(row.businessName);
                                            setPreviewModalHtml(row.html || null);
                                          }}
                                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-md transition cursor-pointer"
                                          title="Preview Generated Website"
                                        >
                                          <Eye size={13} />
                                        </button>
                                        <button
                                          onClick={() => {
                                            const rawPhone = row.phone || lead.phone || '';
                                            const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
                                            const company = row.businessName || row.company || 'votre entreprise';
                                            const deployedUrl = row.netlifyUrl || row.deployedWebsiteUrl || row.websitePreviewUrl || (siteData?.siteId === row.id ? siteData.previewUrl : '');
                                            const msg = `Bonjour, nous avons pris la liberté de vous préparer un aperçu de site web personnalisé gratuit pour ${company}. Découvrez votre aperçu sur mesure ici : ${deployedUrl || 'https://neatlify.com/demo'}`;
                                            const encoded = encodeURIComponent(msg);
                                            if (cleanPhone) {
                                              window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
                                            } else {
                                              window.open(`https://wa.me/?text=${encoded}`, '_blank');
                                            }
                                          }}
                                          className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-md font-bold text-[10px] uppercase flex items-center gap-1 transition cursor-pointer"
                                          title="Send WhatsApp pitch message with custom website link once deployed to Netlify"
                                        >
                                          <MessageCircle size={11} className="text-emerald-400" /> WhatsApp
                                        </button>
                                        <button
                                          onClick={() => handleDownloadSingleLeadHtml(row)}
                                          className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-md font-bold text-[10px] uppercase flex items-center gap-1 transition cursor-pointer"
                                          title="Download Individual HTML Website"
                                        >
                                          <Download size={11} /> HTML
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#0A0A0C] border border-dashed border-zinc-800 rounded-2xl p-12 text-center space-y-4">
                      <FileSpreadsheet size={48} className="mx-auto text-zinc-600" />
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-white">No Leads Loaded Yet</h4>
                        <p className="text-xs text-zinc-500 max-w-md mx-auto">
                          Upload a CSV spreadsheet with business contacts or click "Load Sample CSV" above to generate and auto-deploy personalized websites directly to Netlify.
                        </p>
                      </div>
                      <button
                        onClick={handleLoadSampleCsvLeads}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles size={14} /> Load Demo Dataset (4 Businesses)
                      </button>
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

                    {/* Live Behance Multi-Portfolio Research Search Engine */}
                    <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                          <input
                            type="text"
                            placeholder="Search Behance portfolios by research query (e.g. Dental clinic website, Plumbing landing page...)"
                            value={behanceSearchQuery}
                            onChange={(e) => setBehanceSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSearchBehance();
                            }}
                            className="w-full bg-[#18181B] border border-zinc-700 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-medium"
                          />
                          <button
                            onClick={() => handleSearchBehance()}
                            disabled={searchingBehance}
                            className="absolute right-2 top-1.5 p-1.5 text-amber-400 hover:text-amber-300 transition cursor-pointer"
                            title="Search Behance Portfolios"
                          >
                            <Search size={15} className={searchingBehance ? 'animate-spin' : ''} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleSearchBehance()}
                          disabled={searchingBehance || !behanceSearchQuery.trim()}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          {searchingBehance ? (
                            <>
                              <RefreshCw size={13} className="animate-spin" />
                              <span>Searching Behance...</span>
                            </>
                          ) : (
                            <>
                              <Search size={13} />
                              <span>Pull Up Portfolios</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Quick Research Topic Pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Research Presets:</span>
                        {[
                          'Dentist Clinic',
                          'Plumbing Services',
                          'Home Cleaning',
                          'Construction & Build',
                          'Luxury Restaurant',
                          'SaaS Dashboard',
                          'Real Estate Agency',
                          'Law Firm'
                        ].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => {
                              const q = `${preset} website design`;
                              setBehanceSearchQuery(q);
                              handleSearchBehance(q);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-amber-500/20 hover:border-amber-500/40 border border-zinc-800 text-zinc-300 hover:text-amber-300 text-[10px] font-bold transition cursor-pointer"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>

                      {/* Direct Single URL Scraper Bar */}
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="Or paste direct Behance URL (e.g. https://www.behance.net/gallery/...)"
                          value={behanceImportUrl}
                          onChange={(e) => setBehanceImportUrl(e.target.value)}
                          className="flex-1 bg-[#18181B] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={() => handleScrapeBehanceAssets()}
                          disabled={importingBehance || !behanceImportUrl}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-amber-400 font-bold text-xs transition cursor-pointer whitespace-nowrap border border-zinc-700"
                        >
                          {importingBehance ? 'Scraping...' : 'Direct Inspect'}
                        </button>
                      </div>
                    </div>

                    {/* Multi-Portfolio Search Results Section */}
                    {behanceSearchResults.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-zinc-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                            <span>🎨 Pulled Up {behanceSearchResults.length} Behance Portfolios</span>
                            <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              Query: "{behanceSearchQuery}"
                            </span>
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {behanceSearchResults.map((portfolio) => {
                            const isExpanded = expandedPortfolioId === portfolio.id;
                            return (
                              <div
                                key={portfolio.id}
                                className={`bg-[#121218] border rounded-xl overflow-hidden transition flex flex-col justify-between ${
                                  isExpanded ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30' : 'border-zinc-800 hover:border-zinc-700'
                                }`}
                              >
                                <div>
                                  <div className="relative aspect-video overflow-hidden bg-black/80 group/cover">
                                    <img
                                      src={portfolio.coverImage}
                                      alt={portfolio.title}
                                      className="w-full h-full object-cover group-hover/cover:scale-105 transition duration-500"
                                      referrerPolicy="no-referrer"
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxImage(portfolio.coverImage);
                                      }}
                                      className="absolute bottom-2.5 right-2.5 p-2 bg-black/80 hover:bg-amber-500 text-zinc-300 hover:text-slate-950 rounded-lg border border-zinc-700 hover:border-amber-400 opacity-0 group-hover/cover:opacity-100 transition duration-250 shadow-md cursor-pointer flex items-center justify-center"
                                      title="Expand Cover Image"
                                    >
                                      <Maximize2 size={13} />
                                    </button>
                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-amber-400 text-[9.5px] font-extrabold border border-amber-500/30">
                                      {portfolio.category || 'Portfolio'}
                                    </div>
                                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-zinc-300 text-[9.5px] font-bold border border-zinc-700 flex items-center gap-1">
                                      <span>👍 {portfolio.appreciations || 120}</span>
                                      <span>👁️ {portfolio.views || 1500}</span>
                                    </div>
                                  </div>

                                  <div className="p-3.5 space-y-1.5 text-left">
                                    <h5 className="text-xs font-black text-white line-clamp-1">{portfolio.title}</h5>
                                    <p className="text-[11px] text-amber-400/90 font-medium">By {portfolio.ownerName}</p>
                                    
                                    {portfolio.screenshots.length > 0 && (
                                      <p className="text-[10px] text-zinc-400">
                                        📸 {portfolio.screenshots.length} extracted design screenshots ready
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="p-3 pt-0 space-y-2">
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      onClick={() => {
                                        setExpandedPortfolioId(isExpanded ? null : portfolio.id);
                                        setScrapedBehanceData({
                                          url: portfolio.behanceUrl,
                                          title: portfolio.title,
                                          description: `Extracted from ${portfolio.ownerName}`,
                                          category: portfolio.category || 'Web Design',
                                          templateStyle: 'behance-construction',
                                          images: portfolio.screenshots
                                        });
                                        setSelectedScrapedImages(portfolio.screenshots);
                                      }}
                                      className="py-2 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg uppercase tracking-wider flex items-center justify-center gap-1 transition cursor-pointer shadow-sm"
                                    >
                                      <span>📸 Screenshots</span>
                                    </button>

                                    <a
                                      href={portfolio.behanceUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="py-2 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center justify-center gap-1 border border-zinc-700 transition"
                                    >
                                      <span>Behance</span>
                                      <ExternalLink size={9} />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
                              {scrapedBehanceData.images.map((imgUrl, idx) => {
                                const isSelected = selectedScrapedImages.includes(imgUrl);
                                return (
                                  <div
                                    key={idx}
                                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition group/shot ${
                                      isSelected ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-zinc-800 hover:border-zinc-700'
                                    }`}
                                  >
                                    <img 
                                      src={imgUrl} 
                                      alt={`Behance asset ${idx + 1}`} 
                                      className="w-full h-full object-cover group-hover/shot:scale-105 transition duration-300" 
                                      referrerPolicy="no-referrer"
                                    />
                                    
                                    {/* Selection Toggle Checkbox */}
                                    <div 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (isSelected) {
                                          setSelectedScrapedImages(selectedScrapedImages.filter(u => u !== imgUrl));
                                        } else {
                                          setSelectedScrapedImages([...selectedScrapedImages, imgUrl]);
                                        }
                                      }}
                                      className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer shadow-md transition ${
                                        isSelected ? 'bg-amber-500 text-black' : 'bg-black/80 text-zinc-400 hover:text-white border border-zinc-600'
                                      }`}
                                      title={isSelected ? 'Deselect from import' : 'Select to import'}
                                    >
                                      {isSelected ? '✓' : ''}
                                    </div>

                                    {/* Zoom/Expand Overlay trigger */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/shot:opacity-100 flex items-center justify-center transition duration-200">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setLightboxImage(imgUrl);
                                        }}
                                        className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-lg shadow-lg transition transform translate-y-2 group-hover/shot:translate-y-0 cursor-pointer flex items-center gap-1"
                                      >
                                        <span>🔍 Look Up</span>
                                      </button>
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
                            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                              <button
                                onClick={() => handleVisionConvertDesign(scrapedBehanceData.images.slice(0, 5))}
                                disabled={loading}
                                className="w-full sm:w-auto py-3 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-purple-600/30 border border-purple-400/30"
                                title="Synthesizes up to 5 extracted Behance screenshots into 1 full HTML page using Gemini Vision"
                              >
                                <Sparkles size={14} /> {loading ? 'Synthesizing Vision...' : `👁️ Vision AI: Merge ${Math.min(scrapedBehanceData.images.length, 5)} Screenshots to 1:1 HTML`}
                              </button>
                              <button
                                onClick={() => handleVisionConvertDesign(scrapedBehanceData.images[0])}
                                disabled={loading}
                                className="w-full sm:w-auto py-3 px-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-zinc-700"
                                title="Reconstruct from 1st hero screenshot"
                              >
                                Single Frame
                              </button>
                            </div>
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
                            <a
                              href="https://app.netlify.com/drop"
                              target="_blank"
                              rel="noreferrer"
                              className="py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md text-center"
                            >
                              <Zap size={13} />
                              Deploy ZIP to Netlify
                            </a>
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

      {/* FULLSCREEN BEHANCE SCREENSHOT LIGHTBOX MODAL */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="bg-[#0C0E17] border border-amber-500/40 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header Bar */}
            <div className="px-5 py-3.5 bg-[#121625] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                <span className="text-xs font-black uppercase text-amber-400 ml-2 font-mono tracking-wider">
                  BEHANCE HIGH-RESOLUTION DESIGN INSPECTOR
                </span>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer border border-zinc-700"
              >
                ✕ Close Preview
              </button>
            </div>

            {/* Image viewport container (Scrollable for full-page screenshots) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start bg-[#080A10] min-h-0 scrollbar-thin scrollbar-thumb-zinc-800">
              <img 
                src={lightboxImage} 
                alt="Expanded Behance Portfolio Mockup" 
                className="max-w-full h-auto rounded-lg shadow-2xl border border-zinc-800"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

      {/* SINGLE GENERATED WEBSITE PREVIEW MODAL */}
      {previewModalHtml && (
        <div className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in">
          <div className="bg-[#0A0A0C] border border-zinc-800 w-full max-w-6xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-5">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Preview: {previewModalTitle}
                </h4>
              </div>
              <button
                onClick={() => setPreviewModalHtml(null)}
                className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 relative bg-white">
              <iframe
                srcDoc={previewModalHtml}
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* RAW TEXT AI ANALYSIS MODAL */}
      {rawTextModalOpen && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0D0E12] border border-purple-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 p-6 text-left">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">AI Raw Text Analyzer for CSV Upload</h3>
              </div>
              <button
                onClick={() => setRawTextModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Paste messy text, email lists, directory dumps, Zillow agent exports, or unformatted contacts below. Gemini AI will automatically extract business names, phone numbers, emails, addresses, cities, and niches, converting them into structured lead rows ready for bulk generation!
            </p>

            <textarea
              value={rawTextContent}
              onChange={(e) => setRawTextContent(e.target.value)}
              placeholder="Paste raw text here... e.g.
Plomberie Martin - 01 45 67 89 10 - Paris 15e - contact@martin-plomberie.fr
Electricité Express Lyon - 04 78 00 11 22 - Electricien"
              rows={8}
              className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 font-mono"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800/80">
              <button
                onClick={() => setRawTextModalOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAnalyzeRawText}
                disabled={isAnalyzingText || !rawTextContent.trim()}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs rounded-xl transition flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                {isAnalyzingText ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isAnalyzingText ? 'Analyzing with AI...' : '✨ Analyze & Add Leads'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
