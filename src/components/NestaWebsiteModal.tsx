import React, { useState, useEffect } from 'react';
import { X, Sparkles, Download, Share2, Globe, RefreshCw, Code, Check, ExternalLink, Play, Pause, ChevronsLeftRight, Languages, Image, Upload, Trash2, Wand2, Search, Star, MessageSquare, Monitor, Tablet, Smartphone, Maximize2, Zap, MapPin, Award, Sliders, CheckCircle2, Compass, Mail, Linkedin, MessageCircle, Phone, BookOpen, Video, Palette } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'preview' | 'schema' | 'export' | 'media' | 'templates' | 'gif'>('preview');
  const [generatingGif, setGeneratingGif] = useState(false);
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
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [isSearchingVideos, setIsSearchingVideos] = useState(false);
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
      `Bonjour, nous avons créé un nouveau site internet haute performance pour ${company} : ${url}\n\n` +
      `🎬 Aperçu animé du site (GIF) : ${currentGif}\n\n` +
      `Souhaitez-vous le consulter et voir comment Assix automatise vos appels manqués et vos e-mails ?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleGenerateGif = async () => {
    const targetUrl = netlifyDeployResult?.url || siteData?.previewUrl || lead.deployedWebsiteUrl;
    setGeneratingGif(true);
    setGifError(null);
    try {
      if (targetUrl && targetUrl.startsWith('http')) {
        const urlboxGif = `/api/urlbox/gif?url=${encodeURIComponent(targetUrl)}&refresh=true`;
        setGifUrl(`${urlboxGif}&t=${Date.now()}`);
      } else if (siteData?.siteId) {
        const response = await fetch(`/api/website/${siteData.siteId}/generate-gif`, {
          method: 'POST',
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

  const handleSearchVideos = async (overrideQuery?: string) => {
    const q = overrideQuery || videoSearchQuery;
    if (!q || !q.trim()) return;

    setIsSearchingVideos(true);
    try {
      const res = await fetch('/api/leads/research-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.videos)) {
        setResearchedVideosList(data.videos);
      }
    } catch (err) {
      console.error('Failed to search videos:', err);
    } finally {
      setIsSearchingVideos(false);
    }
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

  const handleAssignImage = async (
    imgUrl: string,
    target: { 
      type: 'hero' | 'about' | 'gallery' | 'service' | 'portfolio' | 'heroVideo' | 'section2Video' | 'showcaseCutout' | 'program1' | 'program2' | 'program3' | 'program4' | 'card1' | 'card2' | 'card3'; 
      index?: number 
    }
  ) => {
    if (!siteData) return;
    setModifying(true);
    try {
      const currentContent = { ...siteData.content };

      if (target.type === 'hero') {
        currentContent.heroImage = imgUrl;
      } else if (target.type === 'about') {
        currentContent.aboutImage = imgUrl;
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

  const companyName = lead.name || lead.companyName || lead.company || lead.businessName || 'Lead';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0F0F12]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-zinc-800/40 flex items-center justify-between bg-transparent">
          <div className="flex items-center gap-4">
            {/* Mac-style Window Control Dots */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-95" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-95" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] opacity-95" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Premium AI Website Builder
              </h3>
              <p className="text-xs text-zinc-400">Prospect: <strong className="text-zinc-200">{companyName}</strong> ({lead.city || 'Local'})</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Live Theme & Color Palette Selector */}
            <div className="flex items-center gap-1.5 bg-[#18181B] px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-300">
              <Palette size={13} className="text-amber-400" />
              <select
                value={siteData?.content?.themePalette || 'gold'}
                onChange={(e) => handleThemePaletteChange(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
                title="Select Live Tailwind & CSS Custom Theme Palette"
              >
                {COLOR_PALETTES.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#18181B] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Style Selector */}
            <div className="flex items-center bg-[#18181B] px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-300">
              <select
                value={siteData?.content?.templateStyle || 'outland-homes'}
                onChange={(e) => handleTemplateStyleChange(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="outland-homes" className="bg-[#18181B]">🌲 Outland Homes & Nature Airbnb (Main)</option>
                <option value="main-neumorphic" className="bg-[#18181B]">🔮 Main Neumorphic Cutouts (All-Niches)</option>
                <option value="cinematic-luxury" className="bg-[#18181B]">🎥 Cinematic Luxury & Multi-Niche</option>
                <option value="premium-dark" className="bg-[#18181B]">✨ Premium Dark Ribbon</option>
                <option value="luxury-serif" className="bg-[#18181B]">👑 Luxury Serif</option>
                <option value="classic" className="bg-[#18181B]">💼 Classic Modern</option>
              </select>
            </div>

            {/* Niche Selector */}
            <div className="flex items-center bg-[#18181B] px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-300">
              <select
                value={siteData?.content?.nicheOverride || lead?.niche || 'construction'}
                onChange={(e) => handleNicheChange(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="construction" className="bg-[#18181B]">🏗️ Estate Construction</option>
                <option value="architecture" className="bg-[#18181B]">🏛️ Architects & Spatial Engineering</option>
                <option value="car_rental" className="bg-[#18181B]">🏎️ Exotic Car Rental</option>
                <option value="consulting" className="bg-[#18181B]">💼 High-Ticket Consulting</option>
                <option value="landscaping" className="bg-[#18181B]">🌿 Landscaping & Estates</option>
                <option value="driving_school" className="bg-[#18181B]">🚗 Driving Academy</option>
                <option value="caterer" className="bg-[#18181B]">🍽️ Fine Catering</option>
                <option value="veneers" className="bg-[#18181B]">🦷 Veneers & Cosmetic Dentistry</option>
                <option value="renovation" className="bg-[#18181B]">🏠 Home Renovations</option>
                <option value="restaurant" className="bg-[#18181B]">🍷 Restaurant / Restauration</option>
                <option value="electrician" className="bg-[#18181B]">⚡ Électricien</option>
                <option value="plumber" className="bg-[#18181B]">🚰 Plombier</option>
                <option value="roofer" className="bg-[#18181B]">🏠 Couvreur / Toiture</option>
                <option value="locksmith" className="bg-[#18181B]">🔑 Serrurier</option>
                <option value="realEstate" className="bg-[#18181B]">🏢 Agence Immobilière</option>
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
              onClick={() => setActiveTab('gif')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'gif' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/25' : 'text-blue-400 hover:text-blue-300'}`}
            >
              <Zap size={13} /> Outreach GIF Generator
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
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <Sparkles size={13} className="text-amber-400" />
                      <span>Niche Website Live Preview</span>
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
                  <div className="w-full h-full bg-[#0B0C10]/60 backdrop-blur-3xl border border-white/15 rounded-2xl flex flex-col overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.85)] ring-1 ring-white/10 relative">
                    
                    {/* FROSTED BROWSER CHROME HEADER */}
                    <div className="px-4 py-2.5 bg-zinc-900/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-3 shrink-0 select-none">
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

              {activeTab === 'gif' && (
                <div className="p-6 h-full overflow-y-auto bg-gradient-to-b from-[#0F0F12] to-black">
                  <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header bar */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                      <div className="text-left">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                          Outreach Multiplier
                        </span>
                        <h4 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
                          <Zap size={20} className="text-blue-400 animate-pulse" />
                          Personalized Outreach GIF Generator & Exporter
                        </h4>
                        <p className="text-xs text-zinc-400 font-medium">Generate high-conversion animated GIFs of your custom website prototypes or property tour videos for emails and messages.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {outreachMode === 'website' && (
                          <button
                            onClick={handleGenerateGif}
                            disabled={generatingGif || !siteData}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition disabled:opacity-50 shadow-lg shadow-blue-500/20 cursor-pointer"
                          >
                            {generatingGif ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
                            <span>{generatingGif ? 'Generating Gif...' : 'Regenerate Animated GIF'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Outreach Mode Selector Row */}
                    <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-850 w-fit text-left">
                      <button
                        onClick={() => setOutreachMode('website')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${outreachMode === 'website' ? 'bg-[#27272A] text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        <Globe size={13} />
                        <span>Website Prototype GIF</span>
                      </button>
                      <button
                        onClick={() => setOutreachMode('dentist')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${outreachMode === 'dentist' ? 'bg-pink-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        <Sparkles size={13} className="text-white fill-current" />
                        <span>Dentist Veneers Smile Widget</span>
                      </button>
                    </div>

                    {gifError && (
                      <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-400 text-left">
                        <strong>Error generating GIF:</strong> {gifError}
                      </div>
                    )}

                    {/* Content split grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left: Simulated Browser with GIF preview */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
                          {/* Browser header */}
                          <div className="bg-zinc-900/60 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between select-none">
                            <div className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-80" />
                              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-80" />
                              <span className="w-3 h-3 rounded-full bg-[#27C93F] opacity-80" />
                            </div>
                            <div className="bg-black/40 text-zinc-400 text-[10px] font-mono px-4 py-1 rounded-md text-center max-w-xs truncate">
                              {outreachMode === 'dentist' ? 'veneers-smile-simulator.ai/widget' : `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.nesta.ai/preview.gif`}
                            </div>
                            <div className="w-12" /> {/* spacing spacer */}
                          </div>

                          {/* GIF Container */}
                          <div className="p-4 bg-[#0B0C10] flex items-center justify-center min-h-[400px] relative group select-none">
                            {outreachMode === 'dentist' ? (
                              <div className="relative max-w-full w-full max-w-[420px] mx-auto bg-zinc-950 p-4 rounded-3xl border border-zinc-800 shadow-2xl text-left font-sans">
                                <div className="text-center pb-3 border-b border-zinc-850 mb-3">
                                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[9px] font-extrabold uppercase tracking-wide border border-pink-500/20">
                                    Live Widget Simulator
                                  </div>
                                  <h3 className="text-xs font-bold text-white mt-1">AI Veneers Smile Trial</h3>
                                  <p className="text-[10px] text-zinc-500 mt-0.5">Drag the slider to compare Before vs Porcelain Veneers</p>
                                </div>

                                {/* Drag-responsive Container */}
                                <div 
                                  className="relative w-full aspect-square overflow-hidden rounded-2xl select-none group cursor-ew-resize bg-black"
                                  onMouseMove={handleSliderMouseMove}
                                  onTouchMove={handleSliderTouchMove}
                                  onClick={(e) => {
                                    if (dentistAutoPlay) setDentistAutoPlay(false);
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    setDentistSliderPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
                                  }}
                                >
                                  {renderDentistPortrait()}

                                  {/* The Sliding Bar Overlay Line */}
                                  <div 
                                    className="absolute top-0 bottom-0 w-[2px] bg-pink-500 pointer-events-none"
                                    style={{ left: `${dentistSliderPos}%` }}
                                  >
                                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-pink-600 border border-white text-white flex items-center justify-center shadow-lg hover:scale-110 transition duration-150">
                                      <ChevronsLeftRight size={12} className="stroke-2" />
                                    </div>
                                  </div>
                                </div>

                                {/* Autoplay control indicator */}
                                <div className="flex items-center justify-between mt-3 text-[10px] text-zinc-400">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setDentistAutoPlay(!dentistAutoPlay)}
                                      className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1 ${dentistAutoPlay ? 'bg-pink-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                                    >
                                      {dentistAutoPlay ? (
                                        <>
                                          <Pause size={10} />
                                          <span>Autoplay Active (GIF mode)</span>
                                        </>
                                      ) : (
                                        <>
                                          <Play size={10} />
                                          <span>Resume Autoplay (GIF)</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <div className="font-mono text-zinc-500">
                                    Pos: {Math.round(dentistSliderPos)}%
                                  </div>
                                </div>
                              </div>
                            ) : generatingGif ? (
                              <div className="flex flex-col items-center justify-center space-y-3 p-12 text-center">
                                <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-xs text-zinc-400 font-medium max-w-xs leading-relaxed">
                                  Scrolling the prototype page & capturing screenshots in the background...
                                </p>
                              </div>
                            ) : gifUrl ? (
                              <div className="relative max-w-full">
                                <img
                                  src={gifUrl}
                                  alt="Animated Website Prototype preview"
                                  className="rounded-lg max-w-full h-auto border border-zinc-800 shadow-2xl object-contain max-h-[480px]"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                  <a
                                    href={gifUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full border border-zinc-700/80 shadow-xl transition flex items-center gap-2 text-xs font-semibold cursor-pointer"
                                  >
                                    <ExternalLink size={14} /> Open Full Image
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center p-12 space-y-4">
                                <Zap size={40} className="text-zinc-600 mx-auto animate-pulse" />
                                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed text-center">
                                  No animated GIF found for this website prototype yet. Click below to trigger the automatic browser screenshot scroll-and-capture engine.
                                </p>
                                <button
                                  onClick={handleGenerateGif}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                                >
                                  Generate Outreach GIF
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dentist Veneers Smile Widget Customizer */}
                        {outreachMode === 'dentist' ? (
                          <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-2xl p-5 space-y-4 text-left">
                            <div className="flex items-center gap-2 text-pink-400">
                              <Sliders size={15} />
                              <h5 className="text-xs font-extrabold uppercase tracking-wider font-sans">Veneers Widget Customizer</h5>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                              Tailor the AI Smile Visualizer widget as it will appear when embedded on <strong>{companyName || 'your client\'s website'}</strong>. Cosmetic dentists can customize shades, tooth curvatures, and patient presets.
                            </p>

                            <div className="space-y-4 pt-1">
                              {/* Model Preset Selection */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block">1. Select Patient Portrait Preset</label>
                                <div className="grid grid-cols-4 gap-2">
                                  <button
                                    onClick={() => {
                                      setDentistActiveModel('sophia');
                                      setDentistUploadedImage(null);
                                    }}
                                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition border cursor-pointer ${dentistActiveModel === 'sophia' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                                  >
                                    Sophia
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDentistActiveModel('marcus');
                                      setDentistUploadedImage(null);
                                    }}
                                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition border cursor-pointer ${dentistActiveModel === 'marcus' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                                  >
                                    Marcus
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDentistActiveModel('emily');
                                      setDentistUploadedImage(null);
                                    }}
                                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition border cursor-pointer ${dentistActiveModel === 'emily' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                                  >
                                    Emily
                                  </button>
                                  <div className="relative group/dentist-upload">
                                    <input 
                                      type="file" 
                                      accept="image/*"
                                      onChange={handleDentistPhotoUpload}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <button
                                      className={`w-full px-2 py-1.5 rounded-lg text-[10px] font-bold transition border truncate ${dentistActiveModel === 'custom' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                                    >
                                      {dentistActiveModel === 'custom' ? 'Custom ↑' : 'Upload +'}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Veneer Style Customization */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block">2. Porcelain Shade</label>
                                  <select
                                    value={dentistVeneerShade}
                                    onChange={(e) => setDentistVeneerShade(e.target.value as any)}
                                    className="w-full bg-[#141418] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                                  >
                                    <option value="BL1">BL1 Bleach (Extra White)</option>
                                    <option value="B1">B1 Natural Light (Standard)</option>
                                    <option value="A1">A1 Warm Pearl (Natural)</option>
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block">3. Tooth Contour Shape</label>
                                  <select
                                    value={dentistVeneerShape}
                                    onChange={(e) => setDentistVeneerShape(e.target.value as any)}
                                    className="w-full bg-[#141418] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                                  >
                                    <option value="hollywood">Hollywood (Square Central)</option>
                                    <option value="natural">Natural (Soft Incisal Edge)</option>
                                    <option value="oval">Oval (Rounded Smooth)</option>
                                    <option value="youthful">Youthful (Slightly Longer)</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#0A0A0C] border border-zinc-800/40 p-4 rounded-xl text-left">
                            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              How it works
                            </h5>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                              Our background browser engine launches Playwright, loads your personalized website layout inside a viewport configured at <strong>800x600</strong>, waits for animations, scrolls down in 300px steps, captures 4 screenshots, processes them into a 128-color index palette using <strong>gifenc</strong>, and compiles an incredibly lightweight animated GIF (usually under 200KB) ready for email delivery.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right: Copy & Export Toolkits */}
                      <div className="lg:col-span-5 space-y-6 text-left">
                        
                        {/* Copy Cards */}
                        <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span>🚀 Copy & Deliver Toolkit</span>
                          </h4>

                          {/* Action 1: Copy Link */}
                          <div className="p-3.5 bg-[#141417] border border-zinc-800/60 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-zinc-200">Animated GIF Url</span>
                              <button
                                onClick={handleCopyGifUrl}
                                disabled={!gifUrl || generatingGif}
                                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-40"
                              >
                                {copiedGifUrl ? <Check size={11} className="text-emerald-400" /> : <Code size={11} />}
                                <span>{copiedGifUrl ? 'Copied!' : 'Copy Link'}</span>
                              </button>
                            </div>
                            <input
                              type="text"
                              readOnly
                              value={gifUrl ? `${window.location.origin}${gifUrl}` : 'GIF not generated yet.'}
                              className="w-full bg-[#0F0F12] border border-zinc-800/80 rounded-lg p-2 text-[10px] font-mono text-zinc-500 select-all outline-none"
                            />
                          </div>

                          {/* Action 2: HTML Email Code */}
                          <div className="p-3.5 bg-[#141417] border border-zinc-800/60 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-left">
                                <span className="text-xs font-bold text-zinc-200 block">HTML Email Image Code</span>
                                <span className="text-[10px] text-zinc-500 block font-sans">Copy as clickable responsive image</span>
                              </div>
                              <button
                                onClick={handleCopyGifCode}
                                disabled={!gifUrl || generatingGif}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-40"
                              >
                                {copiedGifCode ? <Check size={11} className="text-white" /> : <Code size={11} />}
                                <span>{copiedGifCode ? 'Copied Code!' : 'Copy Email HTML'}</span>
                              </button>
                            </div>
                            <textarea
                              readOnly
                              value={getHtmlEmailCode()}
                              placeholder="HTML code will appear here after GIF is generated."
                              className="w-full bg-[#0F0F12] border border-zinc-800/80 rounded-lg p-2 text-[10px] font-mono text-zinc-500 h-20 resize-none outline-none"
                            />
                          </div>

                          {/* Direct download */}
                          {gifUrl && (
                            <a
                              href={gifUrl}
                              download={`${companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_preview.gif`}
                              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-750 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-zinc-700/60 transition shadow-sm cursor-pointer"
                            >
                              <Download size={13} />
                              <span>Download Animated GIF File</span>
                            </a>
                          )}
                        </div>

                        {/* Direct Outreach Copywriting Snippet */}
                        <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-2xl p-5 space-y-4 text-left">
                          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                              <MessageSquare size={13} className="text-emerald-400" />
                              <span>Outreach Copy & Pitch</span>
                            </h4>
                            <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-zinc-800 shrink-0">
                              <button
                                onClick={() => setOutreachStyle('standard')}
                                className={`px-2 py-1 rounded-md text-[9px] font-bold transition ${outreachStyle === 'standard' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                              >
                                Standard (Full)
                              </button>
                              <button
                                onClick={() => setOutreachStyle('short')}
                                className={`px-2 py-1 rounded-md text-[9px] font-bold transition ${outreachStyle === 'short' ? 'bg-emerald-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                              >
                                Short-Form (High-Response)
                              </button>
                            </div>
                          </div>

                          {outreachMode === 'dentist' ? (
                            outreachStyle === 'short' ? (
                              <div>
                                <p className="text-[11px] text-pink-400 leading-relaxed font-bold mb-2">
                                  💡 Short-form Veneer Pitch focuses on getting the cosmetic dentist to reply instantly by offering to install the preview widget on their existing site.
                                </p>
                                <div className="bg-[#141417] border border-zinc-800/60 rounded-xl p-3 font-mono text-xs text-zinc-300 space-y-2 relative group select-all">
                                  <p>Bonjour à l'équipe de <strong>{companyName || 'votre cabinet'}</strong>,</p>
                                  <p>J'ai configuré un prototype de <strong>Widget "Simulateur de Sourire Veneers AI"</strong> personnalisé directement pour votre cabinet <strong>{companyName || 'votre cabinet'}</strong>.</p>
                                  <p>Vos patients sur <strong>{badgeCity}</strong> peuvent uploader une photo et voir leur transformation avec facettes en porcelaine en 60 secondes.</p>
                                  <p>Voici la démo de votre widget configurée pour votre cabinet :</p>
                                  <div className="border border-zinc-800/60 rounded-lg overflow-hidden my-2 max-w-[150px] mx-auto bg-zinc-950 relative">
                                    <img src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=600&auto=format&fit=crop" alt="Veneers simulator preview" className="w-full h-auto max-h-20 object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                      <span className="text-[9px] bg-pink-600 text-white font-extrabold px-1.5 py-0.5 rounded">DEMO ACTIVE</span>
                                    </div>
                                  </div>
                                  <p>Êtes-vous disponible pour que je vous envoie le code d'intégration gratuit (60 secondes d'installation) ?</p>
                                  <p className="text-zinc-500 text-[10px]">Cordialement,<br/>L'équipe Assix</p>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed mb-2 font-sans">
                                  Send this consultative premium pitch focusing on high-ticket treatment values ($15k+ Veneers) to instantly capture their attention:
                                </p>
                                <div className="bg-[#141417] border border-zinc-800/60 rounded-xl p-3 font-sans text-xs text-zinc-300 space-y-2 relative group select-all leading-relaxed">
                                  <p>
                                    Bonjour à l'équipe du cabinet <strong>{companyName || 'votre cabinet'}</strong>,
                                  </p>
                                  <p>
                                    Nous analysons les cliniques d'esthétique dentaire d'excellence à <strong>{badgeCity || 'votre région'}</strong> et avons créé une maquette interactive de notre <strong>Widget de Simulation Virtuelle de Facettes AI</strong> spécifiquement pour <strong>{companyName || 'votre cabinet'}</strong>.
                                  </p>
                                  <p>
                                    Ce widget s'intègre en 1 minute sur votre site existant. Il permet à vos visiteurs d'importer un selfie et de voir instantanément leur sourire restauré avec des facettes (Teintes BL1, B1, etc.). Cela augmente votre taux de conversion de demandes esthétiques de +300% :
                                  </p>
                                  <div className="border border-zinc-800/80 rounded-lg overflow-hidden my-3 max-w-[200px] mx-auto bg-zinc-950 relative">
                                    <img src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=600&auto=format&fit=crop" alt="Veneers simulator" className="w-full h-auto max-h-28 object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                      <span className="text-[10px] bg-pink-600 text-white font-extrabold px-2 py-1 rounded">SMILE SIMULATOR WIDGET</span>
                                    </div>
                                  </div>
                                  <p>
                                    Contrairement aux sites vitrines classiques, ce simulateur qualifie l'intention d'achat des patients en amont de la première consultation pour vos soins les plus rentables.
                                  </p>
                                  <p>
                                    Seriez-vous ouvert à ce que nous l'installions gratuitement en version d'essai sur votre site existant pour tester vos résultats d'ici ce week-end ?
                                  </p>
                                  <p>
                                    Excellent exercice professionnel à vous,<br/>
                                    <strong>L'équipe Assix</strong>
                                  </p>
                                </div>
                              </div>
                            )
                          ) : (
                            outreachStyle === 'short' ? (
                              <div>
                                <p className="text-[11px] text-emerald-400 leading-relaxed font-bold mb-2">
                                  💡 Short-form outreach focuses purely on low friction (under 55 words) to get the prospect curiosity-clicked and replying immediately!
                                </p>
                                <div className="bg-[#141417] border border-zinc-800/60 rounded-xl p-3 font-mono text-xs text-zinc-300 space-y-2 relative group select-all">
                                  <p>Bonjour à l'équipe <strong>{companyName}</strong>,</p>
                                  <p>J'ai fait concevoir un prototype de site web personnalisé pour <strong>{companyName}</strong> afin de maximiser vos conversions de leads locaux.</p>
                                  <p>Voici l'aperçu animé interactif :</p>
                                  <div className="border border-zinc-800/60 rounded-lg overflow-hidden my-2 max-w-[150px] mx-auto bg-zinc-950">
                                    {gifUrl ? (
                                      <img src={gifUrl} alt="Thumbnail preview" className="w-full h-auto max-h-20 object-cover" />
                                    ) : (
                                      <div className="text-center p-2 text-[8px] text-zinc-600 font-sans">GIF Thumbnail</div>
                                    )}
                                  </div>
                                  <p>Vous pouvez tester la version réelle ici : <span className="text-blue-400 underline break-all">{siteData?.previewUrl ? `${window.location.origin}${siteData.previewUrl}` : `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.nesta.ai`}</span></p>
                                  <p>Intéressé pour en parler 2 minutes ?</p>
                                  <p className="text-zinc-500 text-[10px]">Cordialement,<br/>L'équipe Assix</p>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed mb-2 font-sans">
                                  Send this highly personalized, thorough consultative pitch via email or direct message:
                                </p>
                                <div className="bg-[#141417] border border-zinc-800/60 rounded-xl p-3 font-sans text-xs text-zinc-300 space-y-2 relative group select-all leading-relaxed">
                                  <p>
                                    Bonjour à l'équipe <strong>{companyName}</strong>,
                                  </p>
                                  <p>
                                    Nous avons repéré votre activité à <strong>{lead.city || 'votre région'}</strong> et pris la liberté de concevoir un prototype de site web entièrement personnalisé pour <strong>{companyName}</strong> afin d'optimiser l'expérience client et capter vos appels manqués 24h/24.
                                  </p>
                                  <p>
                                    Voici un aperçu animé du prototype de site sur-mesure créé pour vous :
                                  </p>
                                  <div className="border border-zinc-800/80 rounded-lg overflow-hidden my-3 max-w-[200px] mx-auto opacity-80 bg-zinc-950">
                                    {gifUrl ? (
                                      <img src={gifUrl} alt="Thumbnail preview" className="w-full h-auto max-h-28 object-cover" />
                                    ) : (
                                      <div className="text-center p-4 text-[10px] text-zinc-600 font-sans">GIF Thumbnail</div>
                                    )}
                                  </div>
                                  <p>
                                    Vous pouvez explorer la version interactive en temps réel directement ici :<br/>
                                    <span className="text-blue-400 underline break-all">{siteData?.previewUrl ? `${window.location.origin}${siteData.previewUrl}` : `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.nesta.ai`}</span>
                                  </p>
                                  <p>
                                    Qu'en pensez-vous ? Seriez-vous disponible pour un court appel d'échange de 5 minutes cette semaine ?
                                  </p>
                                  <p>
                                    Cordialement,<br/>
                                    <strong>L'équipe Assix</strong>
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        {/* Real-time Email Tracking explanation card */}
                        <div className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border border-blue-500/20 rounded-2xl p-5 space-y-3">
                          <div className="flex items-center gap-2 text-blue-400">
                            <Zap size={16} />
                            <h4 className="text-xs font-bold uppercase tracking-wider">Built-In Real-time Email Tracking</h4>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            <strong>Yes! It is fully possible.</strong> Every single email sent using Assix's campaign system automatically integrates our custom transparent tracking pixel:
                          </p>
                          <div className="bg-black/40 border border-zinc-800/80 rounded-xl p-3 font-mono text-[10px] text-zinc-400 space-y-1">
                            <div>&lt;img src="https://agency.nesta.ai/api/email/track/log_123.gif"</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;width="1" height="1" style="display:none;" /&gt;</div>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            When the recipient opens the mail, their email client requests this invisible 1x1 image. Our server captures the request, registers the open event, and updates the lead status to <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-sans text-[10px]">opened</span> instantly in the CRM, recording the exact date and number of times they viewed it.
                          </p>
                        </div>

                        {/* Trust Multiplier: What other trust-building GIFs are useful? */}
                        <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={13} className="text-yellow-400" />
                            <span>Trust-Building Custom GIFs Guide</span>
                          </h4>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            To double your response rate, you can supplement the scrolling screenshot GIF with these high-trust animation styles:
                          </p>

                          <div className="space-y-3">
                            <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/60 text-left">
                              <span className="text-[11px] font-bold text-white block">1. 📱 Desktop vs Mobile Responsiveness GIF</span>
                              <span className="text-[10px] text-zinc-400 block mt-0.5">
                                Showcases the fluid layout morphing beautifully from a widescreen layout down to an iPhone viewport. Proves to local clients that they will capture mobile users seamlessly.
                              </span>
                            </div>

                            <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/60 text-left">
                              <span className="text-[11px] font-bold text-white block">2. ⚡ 100/100 Lighthouse Performance Speed GIF</span>
                              <span className="text-[10px] text-zinc-400 block mt-0.5">
                                Animates a simulated PageSpeed test immediately hitting a perfect 100 score. Instantly builds trust by demonstrating that your sites load in milliseconds, fixing their current slow-site frustrations.
                              </span>
                            </div>

                            <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/60 text-left">
                              <span className="text-[11px] font-bold text-white block">3. ⭐ Verified Customer Reviews Scroll GIF</span>
                              <span className="text-[10px] text-zinc-400 block mt-0.5">
                                Animates a scroll purely focused on local trust factors: five-star customer reviews, localized map listings, and custom service trust badges tailored specifically to their city.
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* INTERACTIVE OUTREACH CHANNEL PLAYBOOK */}
                    <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-800/80 rounded-2xl p-6 space-y-6 text-left">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                            Campaign Optimizer
                          </span>
                          <h4 className="text-base font-black text-white mt-1.5 flex items-center gap-2">
                            <Compass size={18} className="text-blue-400" />
                            Omnichannel Real Estate & Tech Outreach Playbook
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1">
                            Select your desired outreach channel below to access performance metrics, cold script playbooks, and strategic advice for maximum response.
                          </p>
                        </div>

                        {/* Channel selector pills */}
                        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-zinc-800">
                          <button
                            onClick={() => setSelectedChannel('email')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${selectedChannel === 'email' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                          >
                            <Mail size={12} />
                            <span>Email</span>
                          </button>
                          <button
                            onClick={() => setSelectedChannel('linkedin')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${selectedChannel === 'linkedin' ? 'bg-[#0A66C2] text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                          >
                            <Linkedin size={12} />
                            <span>LinkedIn</span>
                          </button>
                          <button
                            onClick={() => setSelectedChannel('whatsapp')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${selectedChannel === 'whatsapp' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                          >
                            <MessageCircle size={12} />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => setSelectedChannel('coldcall')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${selectedChannel === 'coldcall' ? 'bg-amber-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                          >
                            <Phone size={12} />
                            <span>Cold Call</span>
                          </button>
                        </div>
                      </div>

                      {/* Channel Analytics and Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 text-left">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Expected Response Rate</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-extrabold text-white">
                              {selectedChannel === 'email' && '22% - 35%'}
                              {selectedChannel === 'linkedin' && '30% - 48%'}
                              {selectedChannel === 'whatsapp' && '45% - 65%'}
                              {selectedChannel === 'coldcall' && '15% - 28%'}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold">▲ Very High</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-1.5">
                            {selectedChannel === 'email' && 'When containing our personalized GIF prototype as clickable rich link.'}
                            {selectedChannel === 'linkedin' && 'Directly targets real estate agents active on corporate LinkedIn listings.'}
                            {selectedChannel === 'whatsapp' && 'Highest read-rates; directly lands on the agent\'s lockscreen.'}
                            {selectedChannel === 'coldcall' && 'High conversion if combined with an immediate follow-up SMS containing the GIF.'}
                          </p>
                        </div>

                        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 text-left">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Prospect Friction</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-extrabold text-white">
                              {selectedChannel === 'email' && 'Low Friction'}
                              {selectedChannel === 'linkedin' && 'Medium Friction'}
                              {selectedChannel === 'whatsapp' && 'Ultra-Low Friction'}
                              {selectedChannel === 'coldcall' && 'High Friction'}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-1.5">
                            {selectedChannel === 'email' && 'Simple one-click to test interactive, customized agency prototype.'}
                            {selectedChannel === 'linkedin' && 'Requires profile connection or brief introduction text.'}
                            {selectedChannel === 'whatsapp' && 'Instant tap-and-play visual tour. High relationship-building speed.'}
                            {selectedChannel === 'coldcall' && 'Agent must stop what they are doing to answer. High emotional resistance.'}
                          </p>
                        </div>

                        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 text-left">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Outreach Trust Factor</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-extrabold text-white">
                              {selectedChannel === 'email' && 'Consultative Authority'}
                              {selectedChannel === 'linkedin' && 'Peer-to-Peer Professional'}
                              {selectedChannel === 'whatsapp' && 'Personal & Direct'}
                              {selectedChannel === 'coldcall' && 'Immediate Interactive Pitch'}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-1.5">
                            {selectedChannel === 'email' && 'Proves you did upfront local research before contacting.'}
                            {selectedChannel === 'linkedin' && 'Social validation via mutual connections and premium profile.'}
                            {selectedChannel === 'whatsapp' && 'Conversational, casual, feels highly customized and premium.'}
                            {selectedChannel === 'coldcall' && 'Instant feedback loop allows addressing listing questions.'}
                          </p>
                        </div>
                      </div>

                      {/* Script Templates / Real Scripts */}
                      <div className="bg-[#101014] border border-zinc-800/80 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} className="text-blue-400" />
                            <span className="text-xs font-bold text-zinc-200">
                              {selectedChannel === 'email' && 'Cold Email Sequence & Auto-Followup'}
                              {selectedChannel === 'linkedin' && 'LinkedIn Connect & InMail Playbook'}
                              {selectedChannel === 'whatsapp' && 'WhatsApp / SMS Fast-reply Script'}
                              {selectedChannel === 'coldcall' && 'Cold Call Script & Voice Message Strategy'}
                            </span>
                          </div>
                          <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                            {outreachMode === 'realestate' ? 'Real Estate Mode' : 'Website Mode'}
                          </span>
                        </div>

                        <div className="bg-black/30 border border-zinc-850 rounded-lg p-3 font-mono text-xs text-zinc-300 space-y-3 leading-relaxed">
                          {selectedChannel === 'email' && (
                            outreachMode === 'realestate' ? (
                              <>
                                <p><strong>Subject:</strong> {lead.name || companyName} × New Drone Property Tour Preview 🚁</p>
                                <p>Bonjour {lead.contactName || 'l\'équipe'},</p>
                                <p>J'ai remarqué votre mandat exclusif pour la propriété à <strong>{badgeCity}</strong>.</p>
                                <p>Pour vous aider à générer 2x plus de visites qualifiées d'acheteurs d'ici ce weekend, nous avons monté un prototype d'animation drone 3D personnalisé pour ce bien.</p>
                                <p>[Insérez le GIF animé ou l'image cliquable ici]</p>
                                <p>Êtes-vous disponible pour que je vous envoie la vidéo 4K complète gratuite par retour de mail ?</p>
                              </>
                            ) : (
                              <>
                                <p><strong>Subject:</strong> Proposition de prototype web pour {companyName} ⚡</p>
                                <p>Bonjour {lead.contactName || 'l\'équipe'},</p>
                                <p>Nous avons conçu un modèle de site mobile ultra-rapide personnalisé pour <strong>{companyName}</strong> afin de maximiser vos conversions de clients à <strong>{badgeCity}</strong>.</p>
                                <p>[Insérez le site prototype cliquable ici]</p>
                                <p>Si vous êtes disponible pour un échange rapide de 2 minutes cette semaine, répondez simplement par "oui" !</p>
                              </>
                            )
                          )}

                          {selectedChannel === 'linkedin' && (
                            outreachMode === 'realestate' ? (
                              <>
                                <p><strong>Direct Connection Note (300 char limit):</strong></p>
                                <p>"Bonjour {lead.contactName || 'l\'équipe'}, ravi de vous connecter. J'adore vos mandats sur <strong>{badgeCity}</strong>. Nous avons préparé un prototype d'animation drone 3D pour l'un de vos biens exclusifs pour booster les offres. Je serai ravi de vous envoyer l'extrait vidéo !"</p>
                              </>
                            ) : (
                              <>
                                <p><strong>Direct Connection Note (300 char limit):</strong></p>
                                <p>"Bonjour {lead.contactName || 'l\'équipe'}, ravi de connecter avec des confrères à <strong>{badgeCity}</strong>. Nous avons conçu un prototype de site web d'acquisition de leads mobile optimisé pour {companyName}. Curieux d'avoir votre avis de professionnel !"</p>
                              </>
                            )
                          )}

                          {selectedChannel === 'whatsapp' && (
                            outreachMode === 'realestate' ? (
                              <>
                                <p>"Bonjour {lead.contactName || 'l\'équipe'} ! C'est Alexandre de l'agence Assix. J'ai préparé une courte vidéo drone/animation interactive en 3D pour votre magnifique bien en exclusivité à <strong>{badgeCity}</strong> pour doubler vos contacts acheteurs. Regardez le rendu animé juste ici : [Lien/GIF]. Vous aimez le style ?"</p>
                              </>
                            ) : (
                              <>
                                <p>"Bonjour {lead.contactName || 'l\'équipe'} ! C'est l'équipe Assix. On a pris 1h pour designer un prototype mobile interactif ultra-rapide pour <strong>{companyName}</strong>. Il est entièrement fonctionnel, vous pouvez le tester sur votre téléphone en cliquant ici : [Lien de prévisualisation]. Ça vous plaît ?"</p>
                              </>
                            )
                          )}

                          {selectedChannel === 'coldcall' && (
                            outreachMode === 'realestate' ? (
                              <>
                                <p><strong>Opening Pitch (First 15 seconds):</strong></p>
                                <p>"Bonjour {lead.contactName || 'l\'équipe'}, Alexandre de l'agence Assix. Je vous appelle car j'ai vu votre superbe mandat exclusif à <strong>{badgeCity}</strong>. Pour vous aider à générer des offres qualifiées d'ici ce weekend, je vous ai préparé et envoyé un prototype de vidéo drone 3D immersif directement sur votre WhatsApp / email. Vous préférez que je vous l'envoie sur quel numéro ?"</p>
                              </>
                            ) : (
                              <>
                                <p><strong>Opening Pitch (First 15 seconds):</strong></p>
                                <p>"Bonjour {lead.contactName || 'l\'équipe'}, c'est l'équipe Assix. Nous avons monté un prototype de site internet mobile ultra-performant pour {companyName} pour capter tous vos appels manqués de clients locaux. Je l'ai envoyé sur votre portable à l'instant pour que vous puissiez le tester. Est-ce que vous l'avez bien reçu ?"</p>
                              </>
                            )
                          )}
                        </div>
                      </div>

                      {/* Professional Outreach Strategic Advice */}
                      <div className="bg-blue-950/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-left">
                        <div className="text-blue-400 shrink-0 mt-0.5">
                          <Sparkles size={16} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-white block">Strategic Omni-Channel Advice for Real Estate Agents</span>
                          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                            {outreachMode === 'realestate' ? (
                              <>
                                <strong>Double-Touch Campaign:</strong> First, send a cold email containing the responsive property animation. Within 4 hours, send a WhatsApp or SMS message referencing the email with: <em>"Bonjour, je vous ai envoyé la maquette animée drone 3D pour votre mandat exclusive par mail. Vous avez pu y jeter un coup d'œil ?"</em> This simple follow-up boost response rate by up to <strong>310%</strong> because real estate agents live on their mobile phones while on property tours.
                              </>
                            ) : (
                              <>
                                <strong>Website Prototype Multiplier:</strong> Agents are highly visual and relationship-oriented. Showcasing an elite, high-speed website prototype solves their biggest pain point: converting cold traffic from Google. Offer to integrate their local Google reviews directly into the header to instantly establish confidence with local buyers.
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* NEW SECTION: CUSTOM TRUST AND EVIDENCE GENERATION BLOCK */}
                    <div className="border-t border-zinc-800/80 pt-8 space-y-8">
                      
                      {/* HEADER */}
                      <div className="text-left max-w-4xl">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                          <Sparkles size={10} className="animate-pulse" />
                          Authority & Proof Suite
                        </span>
                        <h4 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
                          High-Trust "Local Proof" Evidence & Asset Customizer
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1">
                          Personalize and bundle real-time evidence to prove you researched their business on Google, and supply local trust badges tailored directly to their niche and city.
                        </p>
                      </div>

                      {/* 1. GOOGLE SEARCH & MAPS EVIDENCE CAMERA */}
                      <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-2xl p-6 space-y-6 text-left">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-4">
                          <div>
                            <h5 className="text-sm font-bold text-white flex items-center gap-2">
                              <Search size={16} className="text-blue-400" />
                              <span>Live Google Search & Maps screenshot proof</span>
                            </h5>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              Generate a real-time screenshot of their live listing to show "we actually looked you up" in your email template.
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0 bg-black/40 p-1 rounded-xl border border-zinc-800">
                            <button
                              onClick={() => setGoogleSearchType('maps')}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 ${googleSearchType === 'maps' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                            >
                              <MapPin size={11} />
                              <span>Google Maps</span>
                            </button>
                            <button
                              onClick={() => setGoogleSearchType('search')}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 ${googleSearchType === 'search' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                            >
                              <Globe size={11} />
                              <span>Google Search</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* Live Playwright Capture */}
                          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/80 space-y-3">
                              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider block">Option A: Playwright Real-Time Capture</span>
                              <p className="text-xs text-zinc-400 leading-relaxed">
                                Our automated background browser will search Google for <strong className="text-zinc-200">"{companyName} {badgeCity}"</strong>, accept Google's cookie guidelines, and grab a real high-resolution screenshot.
                              </p>
                              
                              {googleCaptureError && (
                                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-[10px] text-amber-300">
                                  {googleCaptureError}
                                </div>
                              )}

                              <button
                                onClick={handleCaptureGoogleScreenshot}
                                disabled={capturingGoogle}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-2"
                              >
                                {capturingGoogle ? (
                                  <>
                                    <RefreshCw size={13} className="animate-spin" />
                                    <span>Playwright searching & capturing... (takes ~15s)</span>
                                  </>
                                ) : (
                                  <>
                                    <Search size={13} />
                                    <span>Trigger Live Playwright Google Capture</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Captured Result Panel */}
                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex-1 flex flex-col items-center justify-center min-h-[220px] p-2 relative group">
                              {googleScreenshotUrl ? (
                                <>
                                  <img 
                                    src={googleScreenshotUrl} 
                                    alt="Live Google maps search listing screenshot" 
                                    className="max-w-full max-h-[260px] object-contain rounded-lg border border-zinc-800"
                                  />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-xl">
                                    <a 
                                      href={googleScreenshotUrl} 
                                      download={`google_${googleSearchType}_proof.jpeg`}
                                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                                    >
                                      <Download size={12} />
                                      <span>Download proof image</span>
                                    </a>
                                  </div>
                                </>
                              ) : (
                                <div className="text-center p-6 space-y-2">
                                  <Monitor size={32} className="text-zinc-600 mx-auto" />
                                  <p className="text-xs text-zinc-500 font-medium">No live screenshot captured yet.</p>
                                  <span className="text-[10px] text-zinc-600 block">Click the trigger button above or use the gorgeous interactive simulator on the right as a guaranteed instant backup.</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Interactive Google Listing Simulator */}
                          <div className="lg:col-span-6 space-y-4">
                            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/80 space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">Option B: Instant Google Maps Simulator</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Guaranteed Clean</span>
                              </div>

                              {/* Simulator controls */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase">City / Ville</label>
                                  <input
                                    type="text"
                                    value={badgeCity}
                                    onChange={(e) => setBadgeCity(e.target.value)}
                                    className="w-full bg-[#101014] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-700"
                                    placeholder="e.g. Lyon"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Niche / Trade</label>
                                  <input
                                    type="text"
                                    value={badgeNiche}
                                    onChange={(e) => setBadgeNiche(e.target.value)}
                                    className="w-full bg-[#101014] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-700"
                                    placeholder="e.g. Plomberie"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Rating Score</label>
                                  <input
                                    type="text"
                                    value={badgeRating}
                                    onChange={(e) => setBadgeRating(e.target.value)}
                                    className="w-full bg-[#101014] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-700"
                                    placeholder="e.g. 4.8"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Total Reviews</label>
                                  <input
                                    type="text"
                                    value={badgeReviewsCount}
                                    onChange={(e) => setBadgeReviewsCount(e.target.value)}
                                    className="w-full bg-[#101014] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-700"
                                    placeholder="e.g. 32"
                                  />
                                </div>
                              </div>

                              {/* Google Maps Simulated Widget Preview */}
                              <div className="bg-[#FFFFFF] text-zinc-900 rounded-xl p-4 border border-zinc-300 shadow-xl space-y-3 font-sans relative overflow-hidden select-none">
                                {/* Chrome-like header tab */}
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500" />
                                
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shrink-0">G</span>
                                      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Google Maps Listing</span>
                                    </div>
                                    <h6 className="text-sm font-bold text-zinc-900 leading-tight mt-1">{companyName}</h6>
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <span className="text-xs font-bold text-amber-500">{badgeRating}</span>
                                      <div className="flex items-center text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} size={11} fill="currentColor" className="text-amber-400 shrink-0" />
                                        ))}
                                      </div>
                                      <span className="text-xs text-zinc-500 font-medium">({badgeReviewsCount} avis Google)</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1">
                                      <MapPin size={9} className="text-zinc-400" />
                                      <span>{badgeCity}, France · {badgeNiche}</span>
                                    </p>
                                  </div>

                                  <div className="p-1 bg-blue-50 border border-blue-200 rounded-lg text-center shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                                      <CheckCircle2 size={16} className="text-blue-600" />
                                    </div>
                                    <span className="text-[8px] font-bold text-blue-700 block mt-1 uppercase tracking-wide">Fiche vérifiée</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-150 text-[9px] font-bold text-blue-600 text-center">
                                  <div className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg">📞 Appeler</div>
                                  <div className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg">🌐 Site Web</div>
                                  <div className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg">📍 Itinéraire</div>
                                  <div className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg">⭐ Évaluer</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. DYNAMIC TRUST BADGE STUDIO */}
                      <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-2xl p-6 space-y-6 text-left">
                        <div>
                          <h5 className="text-sm font-bold text-white flex items-center gap-2">
                            <Award size={16} className="text-yellow-400 animate-pulse" />
                            <span>Personalized trust badges (Niche & Client tailored)</span>
                          </h5>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            Beautiful high-fidelity authority badges customized for <strong className="text-zinc-200">{companyName}</strong>. Ready to be embedded in email pitch signatures or website headers.
                          </p>
                        </div>

                        {/* Three Badge Showcase Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Badge 1: Google Top-Rated Seal */}
                          <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 flex flex-col items-center justify-between text-center relative group min-h-[220px]">
                            <span className="text-[9px] font-extrabold text-blue-400 uppercase tracking-widest mb-2 block">1. Google Maps Local Choice</span>
                            
                            <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 bg-blue-950/10 flex flex-col items-center justify-center p-2 relative">
                              <div className="absolute -top-1 px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[7px] font-bold uppercase">
                                {badgeCity}
                              </div>
                              <span className="text-[10px] font-extrabold text-white leading-tight uppercase">{badgeNiche}</span>
                              <div className="flex items-center text-amber-400 my-1">
                                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                              </div>
                              <span className="text-[11px] font-bold text-white">{badgeRating} ★</span>
                              <span className="text-[8px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wide">Elite Choice</span>
                            </div>

                            <p className="text-[10px] text-zinc-400 leading-normal mt-3 max-w-[200px]">
                              Proves to local clients that they are the leading <strong>{badgeNiche}</strong> specialist in <strong>{badgeCity}</strong>.
                            </p>
                          </div>

                          {/* Badge 2: ASSIX Mobile Performance Shield */}
                          <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 flex flex-col items-center justify-between text-center relative group min-h-[220px]">
                            <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest mb-2 block">2. Speed & UX certified</span>
                            
                            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 bg-emerald-950/10 flex flex-col items-center justify-center p-2 relative">
                              <div className="absolute -top-1 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[7px] font-bold uppercase">
                                Lighthouse
                              </div>
                              <span className="text-[14px] font-black text-emerald-400 leading-tight">100/100</span>
                              <span className="text-[8px] text-zinc-400 font-extrabold mt-1 uppercase tracking-wider text-center">Mobile Core Web Vitals</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mt-1" />
                            </div>

                            <p className="text-[10px] text-zinc-400 leading-normal mt-3 max-w-[200px]">
                              Demonstrates mobile loading times in milliseconds, guaranteeing Google Search compliance.
                            </p>
                          </div>

                          {/* Badge 3: Elite Local Service Laurel */}
                          <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 flex flex-col items-center justify-between text-center relative group min-h-[220px]">
                            <span className="text-[9px] font-extrabold text-yellow-500 uppercase tracking-widest mb-2 block">3. Local Trust Laurel</span>
                            
                            <div className="w-24 h-24 rounded-full border-4 border-yellow-500/20 bg-yellow-950/10 flex flex-col items-center justify-center p-2 relative">
                              <div className="absolute -top-1 px-1.5 py-0.5 rounded-full bg-yellow-500 text-black text-[7px] font-black uppercase">
                                Verified Local
                              </div>
                              <Award size={20} className="text-yellow-400 my-1" />
                              <span className="text-[9px] font-extrabold text-white uppercase tracking-wider">{badgeCity}</span>
                              <span className="text-[7px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wide">Approved Business</span>
                            </div>

                            <p className="text-[10px] text-zinc-400 leading-normal mt-3 max-w-[200px]">
                              Highlight the independent professional status and client rating of {badgeRating}/5 stars.
                            </p>
                          </div>

                        </div>
                      </div>

                      {/* 3. VERIFIED CUSTOMER REVIEWS GENERATOR & EMAIL COMPOSER */}
                      <div className="bg-[#0A0A0C] border border-zinc-800/80 rounded-2xl p-6 space-y-6 text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-4">
                          <div>
                            <h5 className="text-sm font-bold text-white flex items-center gap-2">
                              <MessageSquare size={16} className="text-emerald-400" />
                              <span>Verified Customer Reviews Generator & Email Exporter</span>
                            </h5>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              Pre-populates specific, high-intent French customer reviews matching their niche. Copy them directly as a beautifully styled HTML Block for email templates.
                            </p>
                          </div>
                          
                          <button
                            onClick={generateNicheReviews}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-extrabold rounded-lg text-xs transition flex items-center gap-1.5 shrink-0"
                          >
                            <RefreshCw size={12} />
                            <span>Regenerate Reviews</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          
                          {/* Left: Editable reviews list */}
                          <div className="lg:col-span-6 space-y-4">
                            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">Customize client reviews</span>
                            
                            {reviewsList.map((rev, idx) => (
                              <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-2">
                                <div className="flex items-center justify-between">
                                  <input
                                    type="text"
                                    value={rev.name}
                                    onChange={(e) => {
                                      const updated = [...reviewsList];
                                      updated[idx].name = e.target.value;
                                      setReviewsList(updated);
                                    }}
                                    className="bg-transparent text-xs font-bold text-white border-b border-zinc-800 focus:border-zinc-600 focus:outline-none w-36 py-0.5"
                                  />
                                  <input
                                    type="text"
                                    value={rev.date}
                                    onChange={(e) => {
                                      const updated = [...reviewsList];
                                      updated[idx].date = e.target.value;
                                      setReviewsList(updated);
                                    }}
                                    className="bg-transparent text-[10px] text-zinc-500 border-b border-zinc-800 focus:border-zinc-600 focus:outline-none text-right w-24 py-0.5"
                                  />
                                </div>
                                <div className="flex items-center text-amber-400">
                                  {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
                                </div>
                                <textarea
                                  value={rev.text}
                                  onChange={(e) => {
                                    const updated = [...reviewsList];
                                    updated[idx].text = e.target.value;
                                    setReviewsList(updated);
                                  }}
                                  className="w-full bg-transparent text-xs text-zinc-300 border border-transparent hover:border-zinc-800/60 focus:border-zinc-800 focus:outline-none rounded p-1 leading-relaxed resize-none h-14 font-sans"
                                />
                              </div>
                            ))}
                          </div>

                          {/* Right: Email campaign exporter preview */}
                          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider block mb-2">Campaign Ready-to-Embed Copy</span>
                              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                                Click below to copy a perfectly inline-styled HTML signature code of these verified customer reviews. You can paste it straight into your campaign sequence so it renders elegantly on mobile & web clients.
                              </p>
                            </div>

                            {/* Simulated HTML Email block preview */}
                            <div className="bg-[#FFFFFF] text-zinc-900 rounded-xl p-4 border border-zinc-350 shadow-lg space-y-3 font-sans text-left">
                              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Email Embedded Feedback Box</span>
                                </div>
                                <span className="text-[8px] font-black text-blue-600 uppercase">Google Verified</span>
                              </div>

                              <div className="space-y-2.5">
                                {reviewsList.slice(0, 2).map((rev, idx) => (
                                  <div key={idx} className="space-y-0.5 border-b border-zinc-50 last:border-0 pb-1.5 last:pb-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-zinc-900">{rev.name}</span>
                                      <span className="text-[8px] text-zinc-400 font-mono">{rev.date}</span>
                                    </div>
                                    <div className="flex text-amber-400">
                                      {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-[10px]">★</span>)}
                                    </div>
                                    <p className="text-[9px] text-zinc-600 leading-normal italic">
                                      "{rev.text.length > 95 ? `${rev.text.substring(0, 95)}...` : rev.text}"
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                const origin = window.location.origin;
                                const htmlBlock = `
<div style="font-family: Arial, sans-serif; max-width: 500px; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; background-color: #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F1F5F9; padding-bottom: 8px; margin-bottom: 12px;">
    <span style="font-size: 11px; font-weight: bold; color: #1E293B; text-transform: uppercase;">Avis Clients Vérifiés Google</span>
    <span style="font-size: 10px; font-weight: bold; color: #2563EB;">VÉRIFIÉ 100%</span>
  </div>
  ${reviewsList.map(r => `
  <div style="margin-bottom: 10px; border-bottom: 1px solid #F8FAFC; padding-bottom: 8px;">
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <span style="font-size: 11px; font-weight: bold; color: #0F172A;">${r.name}</span>
      <span style="font-size: 9px; color: #94A3B8;">${r.date}</span>
    </div>
    <div style="color: #F59E0B; font-size: 11px; margin: 2px 0;">★★★★★</div>
    <p style="font-size: 10px; color: #475569; margin: 0; font-style: italic; line-height: 1.4;">"${r.text}"</p>
  </div>
  `).join('')}
  <div style="text-align: center; margin-top: 8px;">
    <span style="font-size: 9px; color: #94A3B8; display: inline-block;">Fiche Google Maps officielle de ${companyName}</span>
  </div>
</div>`;
                                navigator.clipboard.writeText(htmlBlock);
                                alert('Beautiful inline-styled HTML Reviews Block copied to clipboard! Ready to paste into cold outreach emails.');
                              }}
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                            >
                              <Code size={13} />
                              <span>Copy Reviews as Email HTML Signature</span>
                            </button>
                          </div>

                        </div>
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
                        <div className="bg-[#121217] border border-amber-500/40 rounded-xl p-2 space-y-1.5 flex flex-col justify-between">
                          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                            <span>Hero Video</span>
                            <Video size={10} className="text-amber-400" />
                          </div>
                          <div className="h-16 rounded-lg overflow-hidden border border-zinc-800 bg-black/50 flex items-center justify-center">
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
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={videoSearchQuery}
                            onChange={(e) => setVideoSearchQuery(e.target.value)}
                            placeholder="e.g. renovation, gourmet chef, hair salon..."
                            className="px-3 py-2 bg-[#121216] border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 w-full"
                          />
                          <button
                            onClick={() => handleSearchVideos()}
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
                              onClick={() => { setVideoSearchQuery(tag); handleSearchVideos(tag); }}
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
    </div>
  );
};
