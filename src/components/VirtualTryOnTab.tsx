import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Upload, ShoppingBag, CheckCircle2, 
  Camera, Wand2, RefreshCw, Download, 
  Globe, Search, Shirt, Scissors, Gem, Home, Eye, Sparkle, Link as LinkIcon, 
  Maximize2, FileUp, Loader2, ZoomIn, X, AlertTriangle, Key, Settings, Check, ExternalLink
} from 'lucide-react';

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  niche: 'fashion' | 'wigs' | 'beauty' | 'eyewear' | 'jewelry' | 'home';
  price: string;
  originalPrice?: string;
  image: string;
  tag?: string;
  description: string;
}

const NICHES = [
  { id: 'all', label: 'All Products', icon: ShoppingBag },
  { id: 'fashion', label: 'Fashion & Apparel', icon: Shirt },
  { id: 'wigs', label: 'Wigs & Hair Extensions', icon: Scissors },
  { id: 'beauty', label: 'Skincare & Beauty', icon: Sparkle },
  { id: 'eyewear', label: 'Designer Eyewear', icon: Eye },
  { id: 'jewelry', label: 'Fine Jewelry', icon: Gem },
  { id: 'home', label: 'Home & Wellness', icon: Home },
];

const SAMPLE_SCRAPE_URLS = [
  {
    name: 'Shopify Silk Satin Wrap Dress',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop',
    title: 'Silk Satin Wrap Evening Dress',
    price: '$129.00',
    category: 'Fashion & Apparel'
  },
  {
    name: 'AliExpress HD Lace Front Wig',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop',
    title: '24" HD Swiss Lace Front Virgin Hair Wig',
    price: '$210.00',
    category: 'Wigs & Hair Extensions'
  },
  {
    name: 'Amazon Designer Titanium Frames',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop',
    title: 'Round Titanium Wireframe Polarized Sunglasses',
    price: '$145.00',
    category: 'Designer Eyewear'
  }
];

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'f1',
    title: 'Silk Satin Wrap Dress',
    category: 'Fashion & Apparel',
    niche: 'fashion',
    price: '$89.00',
    originalPrice: '$130.00',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop',
    tag: 'Best Seller',
    description: 'Luxurious 100% mulberry silk wrap dress with fluid silhouette.'
  },
  {
    id: 'f2',
    title: 'Oversized Cashmere Trench',
    category: 'Fashion & Apparel',
    niche: 'fashion',
    price: '$149.00',
    originalPrice: '$210.00',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop',
    tag: 'Trending',
    description: 'Double-breasted trench coat crafted from Mongolian cashmere.'
  },
  {
    id: 'f3',
    title: 'Tailored Linen Blazer',
    category: 'Fashion & Apparel',
    niche: 'fashion',
    price: '$112.00',
    originalPrice: '$160.00',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&auto=format&fit=crop',
    tag: 'New',
    description: 'Structured lightweight blazer for contemporary effortless tailoring.'
  },
  {
    id: 'w1',
    title: 'HD Lace Front Human Hair Wig (24")',
    category: 'Wigs & Hair Extensions',
    niche: 'wigs',
    price: '$210.00',
    originalPrice: '$290.00',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop',
    tag: '100% Virgin Hair',
    description: 'Invisible HD Swiss lace melt with pre-plucked natural hairline.'
  },
  {
    id: 'w2',
    title: 'Seamless Clip-In Extensions (Honey Blonde 20")',
    category: 'Wigs & Hair Extensions',
    niche: 'wigs',
    price: '$135.00',
    originalPrice: '$180.00',
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop',
    tag: 'Seamless Clip',
    description: '7-piece ultra-flat clip-in set for instant volume and length.'
  },
  {
    id: 'e1',
    title: 'Round Titanium Wireframe Sunglasses',
    category: 'Designer Eyewear',
    niche: 'eyewear',
    price: '$145.00',
    originalPrice: '$195.00',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop',
    tag: 'Polarized',
    description: 'Ultralight Japanese titanium frame with anti-reflective UV400 lenses.'
  },
  {
    id: 'j1',
    title: '18k Solid Gold Herringbone Chain',
    category: 'Fine Jewelry',
    niche: 'jewelry',
    price: '$195.00',
    originalPrice: '$280.00',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop',
    tag: '18k Solid Gold',
    description: 'Sleek liquid gold herringbone link crafted in Italy.'
  }
];

// Sample default user photo for initial view before user uploads their own
const SAMPLE_CUSTOMER_BASE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop';

export const VirtualTryOnTab: React.FC<{ isLight?: boolean }> = ({ isLight = false }) => {
  const [activeMainSubTab, setActiveMainSubTab] = useState<'tryon_studio' | 'storefront'>('tryon_studio');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);

  // Step 1: Importer State (URL Scrape & Direct File Upload)
  const [importMode, setImportMode] = useState<'url' | 'file'>('url');
  const [scrapedUrl, setScrapedUrl] = useState<string>('');
  const [scrapedTitle, setScrapedTitle] = useState<string>('');
  const [scrapedCategory, setScrapedCategory] = useState<string>('Fashion & Apparel');
  const [scrapedPrice, setScrapedPrice] = useState<string>('$95.00');
  const [productImageSrc, setProductImageSrc] = useState<string>('');
  const [isScrapingUrl, setIsScrapingUrl] = useState<boolean>(false);
  const [scrapeSuccessNotice, setScrapeSuccessNotice] = useState<string | null>(null);

  // Step 2: Customer Photo State & Webcam Capture
  const [uploadedUserPhoto, setUploadedUserPhoto] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  // Step 3: IDM-VTON Generation & Hugging Face API Token
  const [hfToken, setHfToken] = useState<string>(() => {
    return localStorage.getItem('hf_api_token') || '';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; message: string; user?: string } | null>(null);

  const handleVerifyToken = async (tokenToVerify?: string) => {
    const t = tokenToVerify || hfToken;
    if (!t) {
      setVerifyResult({ success: false, message: 'Please paste a Hugging Face API token starting with hf_.' });
      return;
    }
    setIsVerifyingToken(true);
    setVerifyResult(null);
    try {
      const res = await fetch('/api/tryon/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hfToken: t })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerifyResult({
          success: true,
          message: data.message || `Token verified active for @${data.user}!`,
          user: data.user
        });
        localStorage.setItem('hf_api_token', t);
      } else {
        setVerifyResult({
          success: false,
          message: data.error || 'Token verification failed. Please check your key on huggingface.co/settings/tokens'
        });
      }
    } catch (err: any) {
      setVerifyResult({
        success: false,
        message: err.message || 'Could not connect to token verification server.'
      });
    } finally {
      setIsVerifyingToken(false);
    }
  };

  useEffect(() => {
    if (isSettingsOpen && hfToken && !verifyResult) {
      handleVerifyToken(hfToken);
    }
  }, [isSettingsOpen]);

  const [selectedTryOnProduct, setSelectedTryOnProduct] = useState<ProductItem>(INITIAL_PRODUCTS[0]);
  const [isProcessingTryOn, setIsProcessingTryOn] = useState<boolean>(false);
  const [tryOnProgress, setTryOnProgress] = useState<number>(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [vtonErrorMessage, setVtonErrorMessage] = useState<string | null>(null);

  // Sync HF Token to LocalStorage whenever modified
  useEffect(() => {
    if (hfToken) {
      localStorage.setItem('hf_api_token', hfToken);
    }
  }, [hfToken]);

  const [tryOnRenderResult, setTryOnRenderResult] = useState<{
    compositeImage: string;
    engineUsed: string;
    timestamp: string;
  } | null>(null);

  const portraitInputRef = useRef<HTMLInputElement>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const customerPhotoToUse = uploadedUserPhoto || SAMPLE_CUSTOMER_BASE;

  // Filter products by niche
  const filteredProducts = selectedNiche === 'all'
    ? products
    : products.filter(p => p.niche === selectedNiche);

  // Handle webcam stream start
  const startWebcam = async () => {
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setIsWebcamActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.log('Video play err:', e));
        }
      }, 100);
    } catch (err: any) {
      setWebcamError('Camera access denied or unmounted. Please upload a photo manually.');
      setIsWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  const captureWebcamPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/png');
      setUploadedUserPhoto(photoDataUrl);
      stopWebcam();
      runTryOnGeneration(selectedTryOnProduct, photoDataUrl);
    }
  };

  // Helper to select a catalog product and sync active garment state
  const handleSelectProduct = (prod: ProductItem) => {
    setSelectedTryOnProduct(prod);
    setProductImageSrc(prod.image);
    setScrapedTitle(prod.title);
    setScrapedCategory(prod.category);
    setScrapedPrice(prod.price);
    runTryOnGeneration(prod, customerPhotoToUse);
  };

  // URL Scraper Trigger
  const handleRunUrlScraper = async (targetUrlToScrape?: string) => {
    const urlToUse = targetUrlToScrape || scrapedUrl.trim();
    if (!urlToUse) return;

    setIsScrapingUrl(true);
    setScrapeSuccessNotice(null);

    try {
      const response = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToUse }),
      });

      const data = await response.json();
      let finalImg = data.success && data.primaryImage ? data.primaryImage : '';
      if (!finalImg) {
        finalImg = urlToUse.startsWith('http') ? urlToUse : INITIAL_PRODUCTS[0].image;
      }
      const finalTitle = data.title || scrapedTitle || 'Scraped Garment Item';
      const finalPrice = data.price || scrapedPrice || '$89.00';
      const finalCat = data.category || scrapedCategory || 'Fashion & Apparel';

      setProductImageSrc(finalImg);
      setScrapedTitle(finalTitle);
      setScrapedPrice(finalPrice);
      setScrapedCategory(finalCat);
      setScrapeSuccessNotice('Product picture locked for IDM-VTON fit.');

      const scrapedProduct: ProductItem = {
        id: `scraped_${Date.now()}`,
        title: finalTitle,
        category: finalCat,
        niche: 'fashion',
        price: finalPrice,
        originalPrice: '$120.00',
        image: finalImg,
        tag: 'Scraped Live',
        description: `Scraped garment from ${urlToUse}`
      };

      setProducts(prev => [scrapedProduct, ...prev.filter(p => p.id !== scrapedProduct.id)]);
      setSelectedTryOnProduct(scrapedProduct);
      runTryOnGeneration(scrapedProduct, customerPhotoToUse);
    } catch (err) {
      const fallback = urlToUse.startsWith('http') ? urlToUse : INITIAL_PRODUCTS[0].image;
      setProductImageSrc(fallback);
      setScrapeSuccessNotice('Picture locked.');
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const handleProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const uploadedImg = ev.target.result as string;
        const title = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setProductImageSrc(uploadedImg);
        setScrapedTitle(title);
        setScrapeSuccessNotice(`Uploaded product photo: ${file.name}`);

        const uploadedProduct: ProductItem = {
          id: `uploaded_${Date.now()}`,
          title,
          category: scrapedCategory || 'Fashion & Apparel',
          niche: 'fashion',
          price: '$95.00',
          originalPrice: '$120.00',
          image: uploadedImg,
          tag: 'Uploaded Custom',
          description: `Custom uploaded garment file (${file.name})`
        };

        setProducts(prev => [uploadedProduct, ...prev.filter(p => p.id !== uploadedProduct.id)]);
        setSelectedTryOnProduct(uploadedProduct);
        runTryOnGeneration(uploadedProduct, customerPhotoToUse);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImportProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalImg = productImageSrc.trim() || scrapedUrl.trim() || INITIAL_PRODUCTS[0].image;
    const title = scrapedTitle.trim() || 'Imported Product Item';
    
    const newProduct: ProductItem = {
      id: `imported_${Date.now()}`,
      title,
      category: scrapedCategory,
      niche: scrapedCategory.toLowerCase().includes('wig') ? 'wigs' 
        : scrapedCategory.toLowerCase().includes('beauty') ? 'beauty'
        : scrapedCategory.toLowerCase().includes('eyewear') ? 'eyewear'
        : scrapedCategory.toLowerCase().includes('jewelry') ? 'jewelry'
        : scrapedCategory.toLowerCase().includes('home') ? 'home'
        : 'fashion',
      price: scrapedPrice || '$89.00',
      originalPrice: '$120.00',
      image: finalImg,
      tag: 'Imported Live',
      description: 'Scraped product item rendered with live IDM-VTON fitting room.'
    };

    setProducts(prev => [newProduct, ...prev]);
    setSelectedTryOnProduct(newProduct);
    setProductImageSrc(finalImg);
    runTryOnGeneration(newProduct, customerPhotoToUse);
  };

  const handlePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const photoUrl = ev.target.result as string;
        setUploadedUserPhoto(photoUrl);
        runTryOnGeneration(selectedTryOnProduct, photoUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Run Real IDM-VTON AI Virtual Try-On Generation
  const runTryOnGeneration = async (
    productToTest?: ProductItem, 
    customerPhoto?: string
  ) => {
    setIsProcessingTryOn(true);
    setTryOnProgress(10);
    setVtonErrorMessage(null);

    const photoToUse = customerPhoto || customerPhotoToUse;

    const progressTimer = setInterval(() => {
      setTryOnProgress(prev => (prev >= 90 ? 90 : prev + 20));
    }, 400);

    // Prioritize active custom uploaded or scraped garment image, then productToTest image
    const targetProductImg = (productImageSrc && productImageSrc.trim())
      ? productImageSrc.trim()
      : (productToTest && productToTest.image)
        ? productToTest.image
        : (selectedTryOnProduct && selectedTryOnProduct.image)
          ? selectedTryOnProduct.image
          : INITIAL_PRODUCTS[0].image;

    const targetProductTitle = (scrapedTitle && scrapedTitle.trim())
      ? scrapedTitle.trim()
      : (productToTest && productToTest.title)
        ? productToTest.title
        : (selectedTryOnProduct && selectedTryOnProduct.title)
          ? selectedTryOnProduct.title
          : 'Apparel Item';

    const targetCategory = scrapedCategory 
      || (productToTest && productToTest.category) 
      || (selectedTryOnProduct && selectedTryOnProduct.category) 
      || 'Fashion & Apparel';

    try {
      const res = await fetch('/api/tryon/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productImage: targetProductImg,
          customerPhoto: photoToUse,
          productTitle: targetProductTitle,
          category: targetCategory,
          hfToken
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.image) {
        setTryOnRenderResult({
          compositeImage: data.image,
          engineUsed: data.engineUsed || 'yisol/IDM-VTON Generative Model',
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        const errText = data.error || data.message || 'IDM-VTON execution did not return a generated photo. Please check your token.';
        setVtonErrorMessage(errText);
      }
    } catch (err: any) {
      setVtonErrorMessage(err.message || 'IDM-VTON server connection error.');
    } finally {
      clearInterval(progressTimer);
      setTryOnProgress(100);
      setIsProcessingTryOn(false);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-y-auto font-sans text-slate-900 ${isLight ? 'bg-[#f4f1ea]' : 'bg-[#0e0f12] text-zinc-100'}`}>
      
      {/* HEADER TOOLBAR & MODE SWITCHER */}
      <div className="sticky top-0 z-20 px-6 py-4 bg-[#f4f1ea] border-b border-[#e2ddd3] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#f4f1ea] flex items-center justify-center font-bold text-sm">
            L
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-[#111111] uppercase font-sans">
              Lumina Dropshipping & IDM-VTON Neural AI Fitting
            </h1>
            <p className="text-[11px] text-stone-600 font-medium font-sans">
              Authentic Open-Source SOTA Virtual Try-On Engine (yisol/IDM-VTON)
            </p>
          </div>
        </div>

        {/* RIGHT ACTION BUTTONS: SETTINGS MODAL TRIGGER & MODE TABS */}
        <div className="flex items-center gap-3">
          {/* API SETTINGS BUTTON */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#e2ddd3] hover:bg-[#d8d3c7] text-[#111111] text-xs font-bold font-sans flex items-center gap-2 transition cursor-pointer relative shadow-sm"
            title="Configure Hugging Face API Settings"
          >
            <Settings size={15} className="text-stone-800" />
            <span className="hidden sm:inline uppercase tracking-wider text-[11px]">API Settings</span>
            {hfToken ? (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200" title="Hugging Face Token Configured" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse ring-2 ring-amber-200" title="Hugging Face Token Missing" />
            )}
          </button>

          {/* MODE SWITCH TABS */}
          <div className="flex items-center gap-1.5 bg-[#e2ddd3] p-1 rounded-xl">
            <button
              onClick={() => setActiveMainSubTab('tryon_studio')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer font-sans ${
                activeMainSubTab === 'tryon_studio'
                  ? 'bg-[#111111] text-[#f4f1ea] shadow-md'
                  : 'text-stone-700 hover:text-[#111111] bg-transparent'
              }`}
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>IDM-VTON STUDIO</span>
            </button>
            
            <button
              onClick={() => setActiveMainSubTab('storefront')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer font-sans ${
                activeMainSubTab === 'storefront'
                  ? 'bg-[#111111] text-[#f4f1ea] shadow-md'
                  : 'text-stone-700 hover:text-[#111111] bg-transparent'
              }`}
            >
              <Globe size={14} />
              <span>SHOPIFY STOREFRONT VIEW</span>
            </button>
          </div>
        </div>
      </div>

      {/* HUGGING FACE API SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-[#fcfbf9] border border-[#e2ddd3] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-[#111111] px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wide">Hugging Face API Settings</h3>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Hugging Face User Access Token (hf_...):
                </label>
                <input
                  type="password"
                  value={hfToken}
                  onChange={(e) => {
                    const val = e.target.value;
                    setHfToken(val);
                    if (val) localStorage.setItem('hf_api_token', val);
                  }}
                  placeholder="Paste hf_..."
                  className="w-full bg-white border border-[#e2ddd3] focus:border-[#111111] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#111111] outline-none shadow-sm"
                />
                <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
                  Token is automatically saved in your browser storage so it stays permanently.
                </p>
              </div>

              <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl space-y-2 text-xs text-stone-700 font-medium">
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-900">
                  <span>Need a free Hugging Face API key?</span>
                  <a 
                    href="https://huggingface.co/settings/tokens" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-amber-800 hover:underline flex items-center gap-1 font-sans"
                  >
                    <span>Get HF Token</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <p className="text-[10.5px] text-stone-600 leading-tight">
                  1. Log into Hugging Face &rarr; Settings &rarr; Access Tokens.<br />
                  2. Create a token (Read permission is sufficient).<br />
                  3. Paste above (`hf_...`).
                </p>
              </div>

              {verifyResult && (
                <div className={`p-3 rounded-xl border text-xs font-bold flex items-start gap-2.5 ${
                  verifyResult.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}>
                  {verifyResult.success ? (
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 text-[11px] font-medium leading-snug">
                    <p className="font-bold">{verifyResult.success ? 'Hugging Face Token Active & Verified!' : 'Token Verification Notice'}</p>
                    <p className="mt-0.5 text-[10.5px] opacity-90">{verifyResult.message}</p>
                  </div>
                </div>
              )}

              {savedNotice && (
                <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                  <span>Token saved permanently!</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#e2ddd3]">
                <button
                  type="button"
                  onClick={() => handleVerifyToken()}
                  disabled={isVerifyingToken || !hfToken}
                  className="px-3.5 py-2 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isVerifyingToken ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-amber-700" />
                      <span>Checking Token...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={13} className="text-amber-700" />
                      <span>Test & Verify Key</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  {hfToken && (
                    <button
                      type="button"
                      onClick={() => {
                        setHfToken('');
                        setVerifyResult(null);
                        localStorage.removeItem('hf_api_token');
                      }}
                      className="px-3 py-2 text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    >
                      Clear Token
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (hfToken) localStorage.setItem('hf_api_token', hfToken);
                      setSavedNotice(true);
                      setTimeout(() => setSavedNotice(false), 2000);
                      setTimeout(() => setIsSettingsOpen(false), 800);
                    }}
                    className="px-5 py-2.5 bg-[#111111] hover:bg-stone-800 text-white text-xs font-bold uppercase rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Check size={14} className="text-amber-400" />
                    <span>Save Token</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 1: AI TRY-ON SHOWCASE TAB */}
      {activeMainSubTab === 'tryon_studio' && (
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 bg-[#f4f1ea]">
          
          {/* WINDOW FRAME MOCKUP WRAPPER */}
          <div className="bg-[#fcfbf9] border border-[#e2ddd3] rounded-2xl shadow-xl overflow-hidden font-sans">
            
            {/* Window Frame Top Bar */}
            <div className="bg-[#e2ddd3]/60 px-5 py-3 border-b border-[#e2ddd3] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-inner" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-inner" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-inner" />
              </div>

              <div className="bg-[#f4f1ea] px-6 py-1 rounded-full text-[11px] font-mono font-semibold text-stone-700 border border-[#d8d3c7] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                https://lumina-store.com/idm-vton-virtual-fitting-room
              </div>

              <div className="flex items-center gap-3 text-stone-600 text-xs font-medium">
                <span className="px-2 py-0.5 rounded bg-[#f4f1ea] border border-[#e2ddd3] text-[10px] font-bold">
                  SOTA MODEL
                </span>
              </div>
            </div>

            {/* Showcase Hero Intro */}
            <div className="p-6 md:p-8 bg-[#f4f1ea] border-b border-[#e2ddd3]">
              <div className="max-w-4xl space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-stone-500 uppercase font-sans">
                  AUTHENTIC NEURAL DENSITY DIFFUSION MODEL (yisol/IDM-VTON)
                </span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111] uppercase font-sans">
                  Pure IDM-VTON Virtual Fitting Studio
                </h2>
                <p className="text-xs text-stone-600 font-medium leading-relaxed font-sans">
                  Generates true photorealistic garment warp and diffusion onto the person without picture overlays or flat compositing.
                </p>
              </div>
            </div>

            {/* 3 STEPS GRID */}
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-[#fcfbf9]">
              
              {/* STEP 1: SCRAPED / UPLOADED PRODUCT IMPORTER */}
              <div className="bg-[#f4f1ea] border border-[#e2ddd3] rounded-xl p-6 space-y-5 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2ddd3]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#111111] text-[#f4f1ea] font-bold text-xs flex items-center justify-center font-sans">
                        1
                      </span>
                      <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider font-sans">
                        Garment Product Input
                      </h3>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-[#e2ddd3] text-stone-800 rounded font-sans uppercase">
                      GARMENT
                    </span>
                  </div>

                  {/* SUB-TABS: URL WEB SCRAPER VS DIRECT FILE UPLOAD */}
                  <div className="grid grid-cols-2 gap-1 bg-[#e2ddd3] p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setImportMode('url')}
                      className={`py-1.5 text-[10px] font-bold uppercase rounded transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        importMode === 'url'
                          ? 'bg-[#111111] text-white shadow'
                          : 'text-stone-700 hover:text-[#111111]'
                      }`}
                    >
                      <LinkIcon size={12} />
                      <span>URL Link</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setImportMode('file')}
                      className={`py-1.5 text-[10px] font-bold uppercase rounded transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        importMode === 'file'
                          ? 'bg-[#111111] text-white shadow'
                          : 'text-stone-700 hover:text-[#111111]'
                      }`}
                    >
                      <FileUp size={12} />
                      <span>Upload Item</span>
                    </button>
                  </div>

                  {/* MODE A: URL WEB SCRAPER */}
                  {importMode === 'url' && (
                    <div className="space-y-3 font-sans">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Product Page Link:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={scrapedUrl}
                            onChange={(e) => setScrapedUrl(e.target.value)}
                            placeholder="Paste product link (Shopify, AliExpress)..."
                            className="w-full bg-[#fcfbf9] border border-[#e2ddd3] focus:border-[#111111] rounded-lg px-3 py-2 text-xs text-[#111111] font-medium outline-none"
                          />

                          <button
                            type="button"
                            onClick={() => handleRunUrlScraper()}
                            disabled={isScrapingUrl || !scrapedUrl.trim()}
                            className="px-3 py-2 bg-[#111111] hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0"
                          >
                            {isScrapingUrl ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
                            <span>Scrape</span>
                          </button>
                        </div>
                      </div>

                      {/* QUICK SAMPLE SCRAPE URLS */}
                      <div>
                        <span className="text-[9px] font-bold text-stone-500 uppercase block mb-1">
                          Sample Garments:
                        </span>
                        <div className="flex flex-col gap-1">
                          {SAMPLE_SCRAPE_URLS.map((sample, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setScrapedUrl(sample.url);
                                setScrapedTitle(sample.title);
                                setScrapedPrice(sample.price);
                                setScrapedCategory(sample.category);
                                setProductImageSrc(sample.url);
                                handleRunUrlScraper(sample.url);
                              }}
                              className="text-left px-2.5 py-1.5 bg-[#fcfbf9] hover:bg-[#e2ddd3] border border-[#e2ddd3] rounded text-[10px] font-medium text-stone-800 transition truncate flex items-center justify-between cursor-pointer"
                            >
                              <span className="truncate">{sample.name}</span>
                              <span className="text-[8px] font-bold px-1.5 py-0.5 bg-[#e2ddd3] rounded text-stone-700 shrink-0 ml-1">
                                SELECT
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE B: DIRECT FILE UPLOAD */}
                  {importMode === 'file' && (
                    <div className="space-y-3 font-sans">
                      <input
                        ref={productFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProductFileUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => productFileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#e2ddd3] hover:border-[#111111] bg-[#fcfbf9] p-4 rounded-xl text-center cursor-pointer transition space-y-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#e2ddd3] text-[#111111] flex items-center justify-center mx-auto">
                          <Upload size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111111]">Browse Garment File</p>
                          <p className="text-[10px] text-stone-500">Supports PNG, JPG, WebP</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRODUCT DETAILS FORM */}
                  <form onSubmit={handleImportProduct} className="space-y-3 font-sans pt-2 border-t border-[#e2ddd3]">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Garment Description / Title:
                      </label>
                      <input
                        type="text"
                        value={scrapedTitle}
                        onChange={(e) => setScrapedTitle(e.target.value)}
                        placeholder="e.g. Silk Evening Dress"
                        className="w-full bg-[#fcfbf9] border border-[#e2ddd3] focus:border-[#111111] rounded-lg px-3 py-2 text-xs text-[#111111] font-medium outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Category:
                        </label>
                        <select
                          value={scrapedCategory}
                          onChange={(e) => setScrapedCategory(e.target.value)}
                          className="w-full bg-[#fcfbf9] border border-[#e2ddd3] focus:border-[#111111] rounded-lg px-2 py-2 text-xs text-[#111111] font-medium outline-none"
                        >
                          <option value="Fashion & Apparel">Upper / Tops</option>
                          <option value="Pants & Skirts">Lower / Pants</option>
                          <option value="Dresses & Gowns">Dresses & Gowns</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Price:
                        </label>
                        <input
                          type="text"
                          value={scrapedPrice}
                          onChange={(e) => setScrapedPrice(e.target.value)}
                          placeholder="$95.00"
                          className="w-full bg-[#fcfbf9] border border-[#e2ddd3] focus:border-[#111111] rounded-lg px-3 py-2 text-xs text-[#111111] font-medium outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#111111] hover:bg-stone-800 text-[#f4f1ea] text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Wand2 size={14} className="text-amber-400" />
                      <span>Lock Garment for IDM-VTON</span>
                    </button>
                  </form>
                </div>

                {/* Active Product Preview */}
                <div className="pt-3 border-t border-[#e2ddd3] space-y-2">
                  {scrapeSuccessNotice && (
                    <div className="p-2 bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />
                      <span className="truncate">{scrapeSuccessNotice}</span>
                    </div>
                  )}

                  <span className="text-[10px] font-bold text-stone-600 uppercase block font-sans">
                    Active Garment Input:
                  </span>
                  <div className="flex items-center gap-3 p-2 bg-[#fcfbf9] border border-[#e2ddd3] rounded-lg">
                    <img
                      src={productImageSrc || selectedTryOnProduct.image}
                      alt="Selected garment"
                      className="w-12 h-14 object-cover rounded border border-[#e2ddd3]"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-[#111111] truncate font-sans">
                        {scrapedTitle || selectedTryOnProduct.title}
                      </h4>
                      <p className="text-[10px] text-stone-600 font-medium font-sans">
                        {scrapedCategory} · <span className="font-bold text-[#111111]">{scrapedPrice}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: CUSTOMER PERSON PHOTO */}
              <div className="bg-[#f4f1ea] border border-[#e2ddd3] rounded-xl p-6 space-y-5 shadow-sm flex flex-col justify-between">
                <div className="space-y-4 font-sans">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2ddd3]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#111111] text-[#f4f1ea] font-bold text-xs flex items-center justify-center">
                        2
                      </span>
                      <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                        Person Photo Input
                      </h3>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-[#e2ddd3] text-stone-800 rounded uppercase">
                      HUMAN MODEL
                    </span>
                  </div>

                  {/* UPLOAD & WEBCAM CAPTURE BUTTONS */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-stone-700 uppercase block">
                      Upload Person Photo or Take Snapshot:
                    </span>

                    <input
                      ref={portraitInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePortraitUpload}
                      className="hidden"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => portraitInputRef.current?.click()}
                        className="py-3 bg-[#111111] hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                      >
                        <Upload size={14} />
                        <span>Upload Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={startWebcam}
                        className="py-3 bg-[#fcfbf9] hover:bg-[#e2ddd3] border border-[#e2ddd3] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Camera size={14} />
                        <span>Take Photo</span>
                      </button>
                    </div>

                    {webcamError && (
                      <p className="text-[10px] font-bold text-red-600 font-sans">{webcamError}</p>
                    )}
                  </div>

                  {/* WEBCAM LIVE CAPTURE MODAL */}
                  {isWebcamActive && (
                    <div className="p-3 bg-stone-900 text-white rounded-xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          Live Camera
                        </span>
                        <button onClick={stopWebcam} className="text-stone-400 hover:text-white">✕</button>
                      </div>

                      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                      </div>

                      <button
                        type="button"
                        onClick={captureWebcamPhoto}
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <Camera size={14} />
                        <span>Snap Photo Now</span>
                      </button>
                    </div>
                  )}

                </div>

                {/* Selected Portrait Preview Box */}
                <div className="pt-3 border-t border-[#e2ddd3]">
                  <span className="text-[10px] font-bold text-stone-600 uppercase block mb-1.5 font-sans">
                    Active Person Photo:
                  </span>
                  <div className="relative h-44 rounded-lg overflow-hidden border border-[#e2ddd3] bg-stone-200">
                    <img
                      src={customerPhotoToUse}
                      alt="Customer photo base"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-[#111111]/85 backdrop-blur text-white px-2 py-0.5 rounded text-[9px] font-mono">
                      {uploadedUserPhoto ? 'Uploaded Person Photo' : 'Sample Person Photo'}
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3: IDM-VTON MODEL EXECUTION & API CREDENTIALS */}
              <div className="bg-[#f4f1ea] border border-[#e2ddd3] rounded-xl p-6 space-y-5 shadow-sm flex flex-col justify-between">
                <div className="space-y-4 font-sans">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e2ddd3]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#111111] text-[#f4f1ea] font-bold text-xs flex items-center justify-center">
                        3
                      </span>
                      <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                        Execute IDM-VTON Generation
                      </h3>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-500 text-black rounded font-mono uppercase">
                      IDM-VTON
                    </span>
                  </div>

                  <div className="p-3 bg-[#fcfbf9] border border-[#e2ddd3] rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-bold text-stone-900 uppercase">
                      <span className="flex items-center gap-1.5">
                        <Key size={13} className="text-amber-600" />
                        Hugging Face Token:
                      </span>
                      {hfToken ? (
                        <span className="text-emerald-700 font-mono font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                          Configured (hf_...)
                        </span>
                      ) : (
                        <span className="text-amber-700 font-mono">Token Optional</span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-600 leading-tight">
                      {hfToken 
                        ? 'Your saved Hugging Face API token is stored permanently and ready for yisol/IDM-VTON neural diffusion.' 
                        : 'Add your free Hugging Face API Token (hf_...) for dedicated fast GPU inference.'}
                    </p>
                    <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-[#e2ddd3]">
                      <button
                        type="button"
                        onClick={() => setIsSettingsOpen(true)}
                        className="px-3 py-1.5 bg-[#111111] hover:bg-stone-800 text-white text-[10px] font-bold uppercase rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <Settings size={12} className="text-amber-400" />
                        <span>{hfToken ? 'Manage Token in Settings' : 'Set HF Token in Settings'}</span>
                      </button>
                      {hfToken && (
                        <span className="text-[10px] font-mono text-stone-500 truncate max-w-[110px]">
                          {hfToken.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>

                  {vtonErrorMessage && (
                    <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-900 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <AlertTriangle size={14} className="text-red-700 shrink-0" />
                        <span>IDM-VTON Direct GPU Required</span>
                      </div>
                      <p className="text-[10.5px] leading-relaxed font-medium">
                        {vtonErrorMessage}
                      </p>
                    </div>
                  )}

                  {/* PRIMARY GENERATE BUTTON */}
                  <button
                    type="button"
                    onClick={() => runTryOnGeneration(selectedTryOnProduct, customerPhotoToUse)}
                    disabled={isProcessingTryOn}
                    className="w-full py-3.5 bg-[#111111] hover:bg-stone-800 text-[#f4f1ea] font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg cursor-pointer flex items-center justify-center gap-2 border border-amber-400/40 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isProcessingTryOn ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-amber-400" />
                        <span>IDM-VTON Neural Warp & Diffusion ({tryOnProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} className="text-amber-400 animate-pulse" />
                        <span>Generate IDM-VTON Photo</span>
                      </>
                    )}
                  </button>

                  <div className="p-3 bg-[#fcfbf9] border border-[#e2ddd3] rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-bold text-stone-700 uppercase">
                      <span>Model Pipeline:</span>
                      <span className="text-emerald-700 font-mono">yisol/IDM-VTON</span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-sans leading-tight">
                      Uses deep garment-to-person diffusion to synthesize realistic clothing drape, texture, and posture alignment. No overlays or picture stacking.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e2ddd3] flex items-center justify-between font-sans">
                  <span className="text-[9px] font-bold text-stone-600 uppercase">
                    Model: IDM-VTON SOTA
                  </span>
                  <button
                    onClick={() => runTryOnGeneration(selectedTryOnProduct, customerPhotoToUse)}
                    className="px-3 py-1.5 bg-[#111111] text-[#f4f1ea] text-[10px] font-bold uppercase rounded hover:bg-stone-800 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} />
                    <span>Re-Run IDM-VTON</span>
                  </button>
                </div>
              </div>

            </div>

            {/* LARGE AI GENERATED PHOTO SHOWCASE STAGE */}
            <div className="p-6 md:p-8 bg-[#111111] border-t border-[#e2ddd3] text-white space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-400 text-black text-[9px] font-bold uppercase tracking-widest rounded">
                      IDM-VTON GENERATED PHOTO
                    </span>
                    <span className="text-stone-400 text-xs font-mono">
                      {tryOnRenderResult?.engineUsed || 'yisol/IDM-VTON Open-Source Model'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-white font-sans mt-1">
                    IDM-VTON Generative Output Stage
                  </h3>
                </div>

                {tryOnRenderResult && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsZoomModalOpen(true)}
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer border border-stone-700"
                    >
                      <Maximize2 size={13} />
                      <span>Enlarge & Zoom</span>
                    </button>

                    <a
                      href={tryOnRenderResult.compositeImage}
                      download="idm-vton-fit.jpg"
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Download size={13} />
                      <span>Download HD Photo</span>
                    </a>
                  </div>
                )}
              </div>

              {/* STAGE MAIN DISPLAY CONTAINER */}
              <div className="relative w-full min-h-[500px] md:min-h-[600px] bg-stone-950 rounded-2xl border-2 border-stone-800 overflow-hidden shadow-2xl flex items-center justify-center p-4">
                {isProcessingTryOn ? (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-20">
                    <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin flex items-center justify-center">
                      <Wand2 size={24} className="text-amber-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                        Executing yisol/IDM-VTON Neural Generation...
                      </h4>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Synthesizing garment warp and fabric diffusion ({tryOnProgress}%)
                      </p>
                    </div>
                  </div>
                ) : tryOnRenderResult ? (
                  <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center group">
                    <img
                      src={tryOnRenderResult.compositeImage}
                      alt="IDM-VTON Result Photo"
                      className="w-full h-full object-contain max-h-[580px] rounded-xl transition duration-300 group-hover:scale-[1.01] cursor-pointer"
                      onClick={() => setIsZoomModalOpen(true)}
                    />

                    {/* OVERLAY THUMBNAILS (CUSTOMER BASE + PRODUCT) */}
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur border border-stone-800 p-2.5 rounded-xl space-y-2 text-xs hidden sm:block">
                      <span className="text-[9px] font-bold text-stone-400 uppercase block font-sans">
                        IDM-VTON Input Pair:
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <img
                            src={customerPhotoToUse}
                            alt="Customer Person"
                            className="w-12 h-16 object-cover rounded border border-stone-700"
                          />
                          <span className="text-[8px] font-mono text-stone-400 block mt-0.5">Person</span>
                        </div>
                        <span className="text-amber-400 font-bold">+</span>
                        <div className="text-center">
                          <img
                            src={productImageSrc || selectedTryOnProduct.image}
                            alt="Garment Item"
                            className="w-12 h-16 object-cover rounded border border-stone-700"
                          />
                          <span className="text-[8px] font-mono text-stone-400 block mt-0.5">Garment</span>
                        </div>
                      </div>
                    </div>

                    {/* OVERLAY BOTTOM INFO BADGE */}
                    <div className="absolute bottom-4 inset-x-4 bg-black/80 backdrop-blur border border-stone-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-[9px] font-bold text-stone-400 uppercase block">Generative Model</span>
                          <span className="text-xs font-bold text-amber-400 font-sans">{tryOnRenderResult.engineUsed}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsZoomModalOpen(true)}
                        className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-stone-200 transition flex items-center gap-1.5 cursor-pointer font-sans"
                      >
                        <ZoomIn size={13} />
                        <span>Enlarge Photo</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-stone-400 space-y-3">
                    <p className="text-sm font-bold uppercase tracking-wider">No IDM-VTON Generation Rendered Yet</p>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      Click "Generate IDM-VTON Photo" above to run the open-source yisol/IDM-VTON generative model pipeline.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FULLSCREEN ZOOM LIGHTBOX MODAL */}
      {isZoomModalOpen && tryOnRenderResult && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Sparkles className="text-amber-400" size={18} />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider font-sans">
                    IDM-VTON Generative Neural Result
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono">
                    {tryOnRenderResult.engineUsed}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={tryOnRenderResult.compositeImage}
                  download="idm-vton-fit.jpg"
                  className="px-3 py-1.5 bg-amber-400 text-black text-xs font-bold rounded-lg hover:bg-amber-300 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => setIsZoomModalOpen(false)}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center bg-stone-950">
              <img
                src={tryOnRenderResult.compositeImage}
                alt="Enlarged IDM-VTON Render"
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl border border-stone-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: LUMINA SHOPIFY STOREFRONT VIEW */}
      {activeMainSubTab === 'storefront' && (
        <div className="flex-1 bg-white text-[#111111] font-sans">
          <div className="bg-[#111111] text-[#f4f1ea] text-center py-2 px-4 text-[11px] font-medium tracking-wide font-sans">
            Free Worldwide Express Shipping on Orders Over $75 · Live IDM-VTON Virtual Fitting Room
          </div>

          <header className="border-b border-stone-200 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold tracking-widest text-[#111111] uppercase font-sans">
                LUMINA<span className="text-stone-400">.</span>
              </span>

              <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wider text-stone-700 uppercase">
                <a href="#catalog" className="hover:text-[#111111]">New Arrivals</a>
                <a href="#catalog" className="hover:text-[#111111]">Collections</a>
                <a href="#catalog" className="hover:text-[#111111]">IDM-VTON Studio</a>
              </nav>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <button 
                onClick={() => setActiveMainSubTab('tryon_studio')}
                className="px-3.5 py-2 bg-[#111111] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={13} className="text-amber-400" />
                <span>IDM-VTON Fitting Studio</span>
              </button>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group border border-stone-200 rounded-xl overflow-hidden bg-white hover:shadow-xl transition duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {prod.tag && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#111111] text-white text-[9px] font-bold uppercase tracking-widest rounded">
                        {prod.tag}
                      </span>
                    )}

                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition duration-300">
                      <button
                        onClick={() => {
                          handleSelectProduct(prod);
                          setActiveMainSubTab('tryon_studio');
                        }}
                        className="w-full py-2.5 bg-white/95 backdrop-blur hover:bg-[#111111] text-[#111111] hover:text-white border border-stone-300 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Run IDM-VTON Fit</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-stone-500 uppercase block font-sans">
                        {prod.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wide font-sans mt-0.5">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-stone-600 font-medium line-clamp-2 mt-1 font-sans">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#111111] font-mono">{prod.price}</span>

                      <button
                        onClick={() => {
                          handleSelectProduct(prod);
                          setActiveMainSubTab('tryon_studio');
                        }}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-[#111111] text-stone-800 hover:text-white rounded text-[10px] font-bold uppercase transition cursor-pointer"
                      >
                        Try On
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
