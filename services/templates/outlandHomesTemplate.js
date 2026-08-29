import { detectLanguage, extractCity } from '../siteTemplate.js';
import { renderTransparentSliderSection } from './transparentSliderHelper.js';

export function buildOutlandHomesTemplate(lead = {}, content = {}, nicheKey = 'realEstate') {
  const currentContent = content || {};
  const sanitize = (text) => {
    if (!text || typeof text !== 'string') return text;
    let newText = text;
    const phrasesToScrub = [
      "Au petit Bamako transforme vos espaces par un artisanat d'excellence et un design sur mesure. Expertise et raffinement garantis à Paris.",
      "Au petit Bamako",
      "Fondée il y a plus de 15 ans, Au petit Bamako est née d'une passion pour la création d'espaces intérieurs qui racontent une histoire."
    ];
    phrasesToScrub.forEach(phrase => {
      newText = newText.split(phrase).join('');
    });
    return newText.trim();
  };

  if (currentContent.heroSubtitle) currentContent.heroSubtitle = sanitize(currentContent.heroSubtitle);
  if (currentContent.aboutTitle) currentContent.aboutTitle = sanitize(currentContent.aboutTitle);
  if (currentContent.aboutText) currentContent.aboutText = sanitize(currentContent.aboutText);

  const lang = detectLanguage(lead, currentContent.language);
  const isEn = lang === 'en';

  const brandName = (
    currentContent.brandName ||
    lead.name ||
    lead.companyName ||
    lead.company ||
    lead.businessName ||
    (isEn ? 'OUTLAND HOMES' : 'CHRISTOPHE TOUMIEU')
  );

  const displayCity = currentContent.city || currentContent.heroCity || lead.city || extractCity(lead) || (isEn ? 'Metropolitan Area' : 'Paris & Île-de-France');
  const displayPhone = currentContent.contactPhone || currentContent.phone || lead.phone || (isEn ? '+1 816-555-0192' : '+33 6 64 14 36 79');
  const phoneHref = displayPhone ? `tel:${displayPhone.replace(/\s+/g, '')}` : 'tel:+33664143679';
  const displayEmail = currentContent.contactEmail || currentContent.email || currentContent.footerEmail || lead.email || `contact@${brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'agency'}.com`;
  const displayAddress = currentContent.contactAddress || currentContent.address || lead.address || `${displayCity}`;

  const activeNiche = (
    currentContent.nicheOverride ||
    nicheKey ||
    lead.niche ||
    lead.sector ||
    lead.category ||
    'realEstate'
  ).toLowerCase();

  const isRestaurant = activeNiche.includes('restau') || activeNiche.includes('food') || activeNiche.includes('gastro') || activeNiche.includes('caf') || activeNiche.includes('bistr') || activeNiche.includes('traiteur') || activeNiche.includes('cater');
  const isRealEstate = activeNiche.includes('real') || activeNiche.includes('immob') || activeNiche.includes('estate') || activeNiche.includes('agence') || activeNiche.includes('home') || activeNiche.includes('airbnb') || activeNiche.includes('vacat');
  const isDrivingSchool = activeNiche.includes('auto') || activeNiche.includes('driv') || activeNiche.includes('permis');
  const isElectrician = activeNiche.includes('electr') || activeNiche.includes('électr');
  const isPlumber = activeNiche.includes('plumb') || activeNiche.includes('plomb') || activeNiche.includes('chauff');
  const isLocksmith = activeNiche.includes('lock') || activeNiche.includes('serrur');
  const isHvac = activeNiche.includes('hvac') || activeNiche.includes('clim') || activeNiche.includes('froid');
  const isLandscaping = activeNiche.includes('landscap') || activeNiche.includes('paysag') || activeNiche.includes('jardin');
  const isDisasterRestoration = activeNiche.includes('sinistre') || activeNiche.includes('restor') || activeNiche.includes('eau') || activeNiche.includes('incendie');
  const isAccountant = activeNiche.includes('account') || activeNiche.includes('compt') || activeNiche.includes('law') || activeNiche.includes('avocat') || activeNiche.includes('jurid');

  // Unified Photo Pool
  const photoPool = Array.from(new Set([
    ...(currentContent.photos || []),
    ...(currentContent.pinterestImages || []),
    ...(currentContent.uploadedImages || []),
    ...(lead.photos || []),
    ...(lead.userUploadedImages || []),
    ...(lead.googlePhotos || [])
  ])).filter(Boolean);

  // Fallback Niche Photo Sets
  const realEstateFallbacks = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80'
  ];

  const restaurantFallbacks = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80'
  ];

  const craftFallbacks = [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80'
  ];

  const activeFallbacks = isRestaurant ? restaurantFallbacks : (isRealEstate ? realEstateFallbacks : craftFallbacks);
  const getPhoto = (idx, fallback) => photoPool[idx] || fallback || activeFallbacks[idx % activeFallbacks.length] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  // Core Section Image Binding
  const heroImage = currentContent.heroImage || getPhoto(0, activeFallbacks[0]);
  const aboutImage = currentContent.aboutImage || getPhoto(1, activeFallbacks[1]);
  const section1Image = currentContent.section1Image || getPhoto(2, activeFallbacks[2]);
  const section2Image = currentContent.section2Image || getPhoto(3, activeFallbacks[3]);
  const contactImage = currentContent.contactImage || getPhoto(4, activeFallbacks[4]);

  // =========================================================================
  // 1. RESTAURANT NICHE TEMPLATE
  // =========================================================================
  if (isRestaurant) {
    const heroBgImg = heroImage;
    const officePreviewImg = aboutImage;
    
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} — ${isEn ? 'A culinary symphony guided by passion and seasonal produce' : 'Une symphonie culinaire guidée par la passion et les produits de saison'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-light: #ffffff;
      --bg-dark: #272727;
      --card-cream: #fbfbfa;
      --text-main: #1c1c1c;
      --text-muted: #8e8e8e;
      --font-main: 'Plus Jakarta Sans', sans-serif;
      --radius-lg: 24px;
      --radius-xl: 32px;
      --transition-smooth: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background-color: var(--bg-light); color: var(--text-main); font-family: var(--font-main); overflow-x: hidden; line-height: 1.4; }
    .container { max-width: 1320px; margin: 0 auto; padding: 0 30px; }

    .fade-in { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); will-change: opacity, transform; }
    .fade-in.visible { opacity: 1; transform: translateY(0); }
    .fade-in-delay-1 { transition-delay: 0.15s; }
    .fade-in-delay-2 { transition-delay: 0.3s; }

    .hero-section { position: relative; height: 95vh; min-height: 700px; margin: 10px; border-radius: var(--radius-xl); overflow: hidden; background: #111; color: #fff; display: flex; flex-direction: column; justify-content: space-between; padding: 30px 40px 40px; }
    .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7); z-index: 1; }
    .nav-bar { position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: center; }
    .logo-mark { font-size: 24px; font-weight: 800; tracking: -1px; text-transform: uppercase; }
    .nav-links { display: flex; gap: 32px; list-style: none; }
    .nav-links a { color: #fff; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; opacity: 0.8; transition: opacity 0.2s ease; }
    .nav-links a:hover { opacity: 1; }
    .btn-outline { border: 1px solid rgba(255, 255, 255, 0.6); background: transparent; color: #fff; padding: 10px 24px; border-radius: 999px; font-size: 13px; cursor: pointer; backdrop-filter: blur(4px); transition: var(--transition-smooth); text-decoration: none; display: inline-block; }
    .btn-outline:hover { background: #fff; color: var(--text-main); }
    .hero-image-overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.08) 42%, rgba(0,0,0,0.58) 100%); pointer-events: none; }
    .hero-title-panel { position: relative; z-index: 6; align-self: flex-start; width: min(760px, 70%); margin-top: 8vh; padding: 24px 30px 28px; border-radius: 22px; background: rgba(17,17,17,0.88); border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 20px 60px rgba(0,0,0,0.24); backdrop-filter: blur(8px); }
    .hero-giant-title { position: static; font-size: clamp(48px, 8vw, 120px); font-weight: 300; letter-spacing: -0.045em; line-height: 0.85; text-transform: uppercase; pointer-events: none; }
    .hero-giant-title span { display: block; text-align: right; font-size: 0.42em; letter-spacing: -0.02em; margin-top: 8px; }
    .hero-bottom-content { position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: flex-end; }
    .hero-description { max-width: 480px; }
    .hero-description h2 { font-size: 28px; font-weight: 400; margin-bottom: 12px; letter-spacing: -0.5px; }
    .hero-description p { font-size: 13px; color: rgba(255, 255, 255, 0.85); line-height: 1.5; margin-bottom: 24px; }
    .btn-white { background: #fff; color: var(--text-main); border: none; padding: 14px 28px; border-radius: 999px; font-weight: 600; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-block; transition: transform 0.2s ease, background 0.2s ease; }
    .btn-white:hover { transform: translateY(-2px); background: #f0f0f0; }
    .hero-stat-cards { display: flex; gap: 16px; }
    .stat-card-small { background: var(--card-cream); color: var(--text-main); border-radius: 20px; padding: 16px 20px; min-width: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
    .stat-card-small h3 { font-size: 24px; font-weight: 700; }
    .stat-card-small p { font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }
    .stat-card-large { background: var(--card-cream); color: var(--text-main); border-radius: 24px; padding: 12px; width: 220px; }
    .stat-card-large img { width: 100%; height: 110px; border-radius: 16px; object-fit: cover; margin-bottom: 12px; }
    .stat-card-large .num { font-size: 26px; font-weight: 700; text-align: center; }
    .stat-card-large .sub { font-size: 10px; color: var(--text-muted); text-align: center; line-height: 1.2; margin-top: 4px; }

    /* 2. ABOUT SECTION */
    .section-padding { padding: 100px 0; }
    .section-grid { display: grid; grid-template-columns: 240px 1fr; gap: 40px; }
    .section-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .about-lead-text { font-size: clamp(20px, 2.3vw, 30px); font-weight: 400; line-height: 1.35; color: var(--text-muted); margin-bottom: 50px; text-transform: uppercase; }
    .about-lead-text span { color: var(--text-main); }
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
    .stat-item h3 { font-size: 36px; font-weight: 700; margin-bottom: 8px; }
    .stat-item p { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

    /* FOOD GALLERY TRACK */
    .food-gallery { padding: 40px 0; overflow: hidden; }
    .food-gallery-track { display: flex; gap: 20px; width: max-content; animation: infiniteScroll 28s linear infinite; }
    .food-gallery-slide { width: 340px; height: 240px; border-radius: 20px; overflow: hidden; flex-shrink: 0; }
    .food-gallery-slide img { width: 100%; height: 100%; object-fit: cover; }
    @keyframes infiniteScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

    /* MENU SECTION */
    .menu-section { padding: 80px 0; background: #fafaf7; border-top: 1px solid #eee; border-bottom: 1px solid #eee; }
    .menu-heading { text-align: center; max-width: 600px; margin: 0 auto 50px; }
    .menu-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #888; }
    .menu-heading h2 { font-size: 42px; font-weight: 300; text-transform: uppercase; margin: 8px 0; }
    .menu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .menu-card { background: #fff; border-radius: 22px; padding: 30px; border: 1px solid #eaeaea; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
    .menu-card h3 { font-size: 20px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #111; }
    .menu-item { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px dashed #eee; }
    .menu-item strong { font-size: 14px; font-weight: 600; display: block; }
    .menu-item small { font-size: 11px; color: #777; display: block; margin-top: 2px; }
    .menu-item b { font-size: 15px; font-weight: 800; color: #111; }

    /* RESERVATION SECTION */
    .reservation-section { width: 100%; background: #272727; color: #fff; padding: 80px 30px; margin: 20px 0 0; }
    .reservation-inner { max-width: 1320px; margin: 0 auto; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 60px; align-items: center; }
    .reservation-intro h2 { font-size: clamp(36px, 5vw, 68px); font-weight: 300; line-height: 0.98; letter-spacing: -0.04em; margin: 18px 0; }
    .reservation-intro p { color: rgba(255,255,255,.72); max-width: 460px; }
    .reservation-location { margin-top: 30px; font-size: 14px; line-height: 1.7; color: rgba(255,255,255,.78); }
    .reservation-booking { background: #fff; color: #1c1c1c; border-radius: 24px; padding: 30px; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
    .reservation-days, .reservation-slots { display: grid; gap: 10px; }
    .reservation-days { grid-template-columns: repeat(2, 1fr); margin-bottom: 20px; }
    .reservation-slots { grid-template-columns: repeat(2, 1fr); }
    .reservation-day, .reservation-slot { appearance: none; border: 1px solid #ddd; background: #fff; color: #1c1c1c; border-radius: 12px; min-height: 52px; padding: 12px 14px; font: inherit; cursor: pointer; transition: .2s ease; }
    .reservation-day.active, .reservation-slot:hover, .reservation-slot.selected { background: #1c1c1c; color: #fff; border-color: #1c1c1c; }
    .reservation-selected { min-height: 24px; margin: 20px 0 14px; font-size: 13px; color: #666; font-weight: 600; }
    .reservation-cta { display: block; text-align: center; text-decoration: none; background: #1c1c1c; color: #fff; border-radius: 999px; padding: 15px 18px; font-size: 13px; font-weight: 600; }

    /* CONTACT CARD */
    .contact-card { background: var(--bg-dark); color: #fff; border-radius: var(--radius-xl); padding: 80px 60px 40px; margin: 40px 20px; }
    .contact-title { font-size: clamp(48px, 7vw, 100px); font-weight: 300; letter-spacing: -0.03em; text-transform: uppercase; margin-bottom: 50px; }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
    .input-group { margin-bottom: 25px; }
    .input-field { width: 100%; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.3); padding: 12px 0; color: #fff; font-family: var(--font-main); font-size: 12px; text-transform: uppercase; outline: none; }
    .office-preview-img { width: 100%; height: 160px; border-radius: 16px; object-fit: cover; margin-top: 30px; }
    .footer-bar { margin-top: 60px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; font-size: 11px; color: #777; }

    @media (max-width: 900px) {
      .hero-section { height: auto; min-height: 520px; padding: 20px; margin: 10px; }
      .hero-title-panel { width: 100%; margin-top: 50px; }
      .section-grid, .reservation-inner, .contact-grid { grid-template-columns: 1fr; gap: 30px; }
      .process-grid { grid-template-columns: 1fr 1fr; }
      .menu-grid { grid-template-columns: 1fr; }
      .contact-card { padding: 40px 20px; margin: 10px; }
    }
  </style>
</head>
<body>

  <!-- 1. HERO SECTION -->
  <section class="hero-section" id="home">
    <img class="hero-bg" id="heroBgImg" data-site-img src="${heroBgImg}" alt="${brandName} restaurant">
    <div class="hero-image-overlay" aria-hidden="true"></div>
    
    <nav class="nav-bar">
      <div class="logo-mark">${brandName.substring(0,2).toUpperCase()}</div>
      <ul class="nav-links">
        <li><a href="#home">${isEn ? 'Home' : 'Accueil'}</a></li>
        <li><a href="#about">${isEn ? 'About' : 'À Propos'}</a></li>
        <li><a href="#menu">${isEn ? 'Menu' : 'Menu'}</a></li>
        <li><a href="#contact">${isEn ? 'Contact' : 'Contact'}</a></li>
      </ul>
      <a href="#reservation" class="btn-outline">${isEn ? 'DISCUSS GASTRONOMY' : 'PARLER GASTRONOMIE'}</a>
    </nav>

    <div class="hero-title-panel fade-in">
      <div class="hero-giant-title">
        ${brandName.toUpperCase()}
        <span>${displayCity.toUpperCase()}</span>
      </div>
    </div>

    <div class="hero-bottom-content fade-in fade-in-delay-1">
      <div class="hero-description">
        <h2>${isEn ? 'A culinary symphony guided by passion and seasonal produce' : 'Une symphonie culinaire guidée par la passion et les produits de saison'}</h2>
        <p>${isEn ? 'Authentic Flavors & Fine Dining in ' + displayCity : 'Gastronomie & Saveurs Authentiques à ' + displayCity}</p>
        <a href="#reservation" class="btn-white">${isEn ? 'Reserve a Table' : 'Réserver une Table'}</a>
      </div>

      <div class="hero-stat-cards">
        <div class="stat-card-small">
          <h3>+600</h3>
          <p>${isEn ? 'satisfied guests' : 'clients satisfaits'}</p>
        </div>
        <div class="stat-card-large">
          <img data-site-img src="${getPhoto(1, activeFallbacks[1])}" alt="Spécialité culinaire">
          <div class="num">328</div>
          <div class="sub">${isEn ? 'exceptional dishes served' : 'projets d’exception livrés'}</div>
        </div>
      </div>
    </div>
  </section>

  ${renderTransparentSliderSection(currentContent.transparentSlider || currentContent.sliderConfig)}

  <!-- 2. ABOUT SECTION -->
  <section class="section-padding container" id="about">
    <div class="section-grid">
      <div class="section-label fade-in">${isEn ? 'ABOUT US' : 'À PROPOS'}</div>
      <div>
        <p class="about-lead-text fade-in fade-in-delay-1">
          <span>${isEn ? 'FOR YEARS, OUR CHEFS HAVE CRAFTED SIGNATURE DISHES TO AWAKEN YOUR SENSES AND CELEBRATE FLAVOR.' : 'DEPUIS DES ANNÉES, NOS CHEFS FAÇONNENT DES ASSIETTES SIGNATURES POUR ÉVEILLER VOS SENS ET CÉLÉBRER LE GOÛT.'}</span> ${isEn ? 'WE SELECT EXCLUSIVELY FRESH, LOCAL, AND SEASONAL INGREDIENTS FOR EXCEPTIONAL CULINARY EXPERIENCES.' : 'NOUS SÉLECTIONNONS EXCLUSIVEMENT DES PRODUITS FRAIS, LOCAUX ET DE SAISON POUR DES EXPÉRIENCES CULINAIRES D\'EXCEPTION.'}
        </p>

        <div class="stats-row fade-in fade-in-delay-2">
          <div class="stat-item">
            <h3>${isEn ? '12+ Years' : '12+ Ans'}</h3>
            <p>${isEn ? 'Proven expertise and refined cuisine.' : 'Savoir-faire éprouvé et gastronomie raffinée.'}</p>
          </div>
          <div class="stat-item">
            <h3>${isEn ? '1,256+ Guests' : '1,256+ Clients'}</h3>
            <p>${isEn ? 'Loyal guests trusting our quality and recommendations.' : 'Fidélisés par la qualité de nos prestations et recommandations.'}</p>
          </div>
          <div class="stat-item">
            <h3>${isEn ? '35+ Experts' : '35+ Experts'}</h3>
            <p>${isEn ? 'Passionate chefs and exceptional service at your disposal.' : 'Chefs passionnés et service d\'exception à votre disposition.'}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOD GALLERY SLIDER -->
  <section class="food-gallery" aria-label="Photos des plats">
    <div class="food-gallery-track">
      <figure class="food-gallery-slide"><img data-site-img src="${getPhoto(0, activeFallbacks[0])}" alt="Plat signature"></figure>
      <figure class="food-gallery-slide"><img data-site-img src="${getPhoto(1, activeFallbacks[1])}" alt="Spécialité maison"></figure>
      <figure class="food-gallery-slide"><img data-site-img src="${getPhoto(2, activeFallbacks[2])}" alt="Assortiment gastronomique"></figure>
      <figure class="food-gallery-slide"><img data-site-img src="${getPhoto(3, activeFallbacks[3])}" alt="Dessert & Boissons"></figure>
      <figure class="food-gallery-slide"><img data-site-img src="${getPhoto(0, activeFallbacks[0])}" alt="Plat signature"></figure>
      <figure class="food-gallery-slide"><img data-site-img src="${getPhoto(1, activeFallbacks[1])}" alt="Spécialité maison"></figure>
    </div>
  </section>

  <!-- MENU SECTION -->
  <section class="menu-section" id="menu">
    <div class="menu-heading">
      <span class="menu-eyebrow">${isEn ? 'A LA CARTE' : 'À LA CARTE'}</span>
      <h2>${isEn ? 'Our Menu' : 'Notre Menu'}</h2>
      <p>${isEn ? 'The authentic flavors of our region, prepared with passion and served generously.' : 'Les saveurs de notre terroir, préparées avec passion et servies généreusement.'}</p>
    </div>
    <div class="menu-grid">
      <article class="menu-card">
        <h3>${isEn ? 'Poultry & Meats' : 'Volailles & Viandes'}</h3>
        <div class="menu-item"><div><strong>${isEn ? 'Grilled Half Chicken' : 'Demi Poulet Grillé'}</strong><small>${isEn ? 'Braised with herbs or house spices' : 'Braisé aux herbes ou épices maison'}</small></div><b>15€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'Crispy Chicken Wings' : 'Ailes de Poulet Croustillantes'}</strong><small>${isEn ? 'Served with chef dipping sauce' : 'Accompagnées de sauce chef'}</small></div><b>15€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'Traditional Yassa Chicken' : 'Poulet Yassa Tradition'}</strong><small>${isEn ? 'Lemon marinated chicken & caramelized onions' : 'Poulet mariné au citron & oignons confits'}</small></div><b>15€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'Sautéed Beef Tenderloin' : 'Filet de Bœuf Sauté'}</strong><small>${isEn ? 'Tender beef & seasonal vegetables' : 'Viande tendre & légumes de saison'}</small></div><b>22€</b></div>
      </article>
      <article class="menu-card">
        <h3>${isEn ? 'Fish & Seafood' : 'Poissons & Mer'}</h3>
        <div class="menu-item"><div><strong>${isEn ? 'Fresh Catch Grilled Fish' : 'Poisson Grillé de l\'Arrivage'}</strong><small>${isEn ? 'Slow baked in parchment with herbs' : 'Cuisson lente en papillote aux aromates'}</small></div><b>18€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'Braised Catfish Special' : 'Silure / Poisson Chat Braisé'}</strong><small>${isEn ? 'Aromatic chef recipe' : 'Spécialité du chef parfumée'}</small></div><b>18€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'Garlic Sautéed Shrimp' : 'Crevettes Sautées à l\'Ail'}</strong><small>${isEn ? 'Flambéed with white wine & spices' : 'Flambées au vin blanc & épices'}</small></div><b>20€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'Pan-Seared Whole Sole' : 'Sole Entière Saisie'}</strong><small>${isEn ? 'Lemon butter sauce & fragrant rice' : 'Sauce citronnée et riz parfumé'}</small></div><b>24€</b></div>
      </article>
      <article class="menu-card">
        <h3>${isEn ? 'Broths & Grills' : 'Bouillons & Grillades'}</h3>
        <div class="menu-item"><div><strong>${isEn ? 'Sea Bass Broth' : 'Bouillon de Poisson Bar'}</strong><small>${isEn ? 'Aromatic soup with crunchy vegetables' : 'Soupe parfumée aux légumes croquants'}</small></div><b>25€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'Mutton Stew Broth' : 'Bouillon de Mouton'}</strong><small>${isEn ? 'Rich slow-cooked herbal stew' : 'Mijoté savoureux aux herbes'}</small></div><b>17€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'Grilled Goat Skewers' : 'Brochettes de Chèvre Grillée'}</strong><small>${isEn ? 'Flame-seared marinated meat' : 'Viande marinée et saisie au feu'}</small></div><b>12€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'Crispy Grilled Pork' : 'Porc Grillé Croustillant'}</strong><small>${isEn ? 'Exquisite house seasoning' : 'Assaisonnement d\'exception'}</small></div><b>12€</b></div>
      </article>
      <article class="menu-card">
        <h3>${isEn ? 'Sides & Extras' : 'Accompagnements'}</h3>
        <div class="menu-item"><div><strong>${isEn ? 'Fried Plantains' : 'Plantains / Makemba Frit'}</strong><small>${isEn ? 'Golden fried sweet plantains' : 'Bananes plantains frites dorées'}</small></div><b>4€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'House Beignets' : 'Beignets Maison / Mikate'}</strong><small>${isEn ? 'Traditional fluffy recipe' : 'Recette traditionnelle moelleuse'}</small></div><b>4€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'Fragrant Rice / Fufu' : 'Riz Parfumé / Fufu'}</strong><small>${isEn ? 'Jasmine rice or cassava fufu' : 'Riz jasmin ou pâte de manioc'}</small></div><b>3€</b></div>
        <div class="menu-item"><div><strong>${isEn ? 'Fresh Garden Salad' : 'Salade Fraîche du Potager'}</strong><small>${isEn ? 'Raw veggies & house vinaigrette' : 'Crudités & vinaigrette maison'}</small></div><b>5€</b></div>
      </article>
    </div>
  </section>

  <!-- RESERVATION SECTION -->
  <section class="reservation-section" id="reservation">
    <div class="reservation-inner">
      <div class="reservation-intro">
        <div class="section-label" style="color: #fff;">${isEn ? 'RESERVE A TABLE' : 'RÉSERVER UNE TABLE'}</div>
        <h2>${isEn ? 'Choose your preferred time' : 'Choisissez votre moment'}</h2>
        <p>${isEn ? 'Private dining room • Vegetarian options & events • Warm atmosphere' : 'Salon privé • Options végétariennes & événements • Ambiance chaleureuse'}</p>
        <div class="reservation-location">
          <strong>${brandName}</strong><br>
          ${displayAddress}<br>
          ${displayCity}
        </div>
      </div>
      <div class="reservation-booking">
        <div class="reservation-days">
          <button type="button" class="reservation-day active" onclick="selectDay(this, '${isEn ? 'Today' : 'Aujourd\'hui'}')">${isEn ? 'Today' : 'Aujourd\'hui'}</button>
          <button type="button" class="reservation-day" onclick="selectDay(this, '${isEn ? 'Tomorrow' : 'Demain'}')">${isEn ? 'Tomorrow' : 'Demain'}</button>
        </div>
        <div class="reservation-slots">
          <button type="button" class="reservation-slot" onclick="selectSlot(this, '12:30')">12:30</button>
          <button type="button" class="reservation-slot" onclick="selectSlot(this, '19:30')">19:30</button>
          <button type="button" class="reservation-slot" onclick="selectSlot(this, '20:15')">20:15</button>
          <button type="button" class="reservation-slot" onclick="selectSlot(this, '21:00')">21:00</button>
        </div>
        <div class="reservation-selected" id="reservationStatus">${isEn ? 'Select a reservation time slot' : 'Choisissez un horaire de réservation'}</div>
        <a class="reservation-cta" id="reservationCta" href="${phoneHref}">${isEn ? 'Book by phone · ' + displayPhone : 'Réserver par téléphone · ' + displayPhone}</a>
      </div>
    </div>
  </section>

  <!-- CONTACT FORM SECTION -->
  <section class="contact-card" id="contact">
    <div class="contact-title fade-in">${isEn ? 'LET\'S TALK GASTRONOMY' : 'PARLONS GASTRONOMIE'}</div>

    <div class="contact-grid">
      <form class="fade-in" onsubmit="event.preventDefault(); alert('${isEn ? 'Thank you! Your reservation request has been received.' : 'Merci ! Votre demande a bien été envoyée. Nous vous recontactons sous peu.'}');">
        <div class="input-group">
          <input type="text" class="input-field" placeholder="${isEn ? 'YOUR FULL NAME' : 'VOTRE NOM COMPLET'}" required>
        </div>
        <div class="input-group">
          <input type="tel" class="input-field" placeholder="${isEn ? 'PHONE NUMBER' : 'NUMÉRO DE TÉLÉPHONE'}" required>
        </div>
        <div class="input-group">
          <input type="text" class="input-field" placeholder="${isEn ? 'YOUR MESSAGE OR CATERING REQUEST' : 'VOTRE MESSAGE OU DEMANDE TRAITEUR'}">
        </div>
        <button type="submit" class="btn-white" style="margin-top: 20px;">${isEn ? 'Submit Request' : 'Envoyer la demande'}</button>
      </form>

      <div class="contact-text-right fade-in">
        ${isEn ? 'BENEFIT FROM A PERSONALIZED CONSULTATION FOR YOUR MEALS OR SPECIAL EVENTS.' : 'BÉNÉFICIEZ D\'UNE CONSULTATION ET D\'UN SERVICE PERSONNALISÉ POUR VOS REPAS OU ÉVÉNEMENTS.'}
        <br><br>
        <strong>${displayPhone}</strong> — <a href="mailto:${displayEmail}" style="color: inherit;">${displayEmail}</a>
        <br>
        <span style="font-size: 11px; opacity: 0.8;">${displayAddress}</span>

        <img class="office-preview-img" data-site-img src="${officePreviewImg}" alt="Restaurant ${brandName}">
      </div>
    </div>

    <div class="footer-bar">
      <div>${brandName.toUpperCase()}</div>
      <div>© 2026 ${brandName}. ${isEn ? 'All rights reserved.' : 'Tous droits réservés.'}</div>
      <div class="footer-links">
        <a href="#about">${isEn ? 'About' : 'À Propos'}</a>
        <a href="#menu">${isEn ? 'Menu' : 'Menu'}</a>
        <a href="#contact">${isEn ? 'Contact' : 'Contact'}</a>
      </div>
    </div>
  </section>

  <script>
    let currentDay = '${isEn ? 'Today' : 'Aujourd\'hui'}';
    let currentTime = '';

    function selectDay(btn, day) {
      document.querySelectorAll('.reservation-day').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDay = day;
      updateStatus();
    }

    function selectSlot(btn, time) {
      document.querySelectorAll('.reservation-slot').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentTime = time;
      updateStatus();
    }

    function updateStatus() {
      const el = document.getElementById('reservationStatus');
      if (currentTime) {
        el.textContent = '${isEn ? 'Reservation request: ' : 'Demande de réservation : '}' + currentDay + ' ${isEn ? 'at' : 'à'} ' + currentTime;
      } else {
        el.textContent = '${isEn ? 'Select a time for ' : 'Sélectionnez un horaire pour '}' + currentDay;
      }
    }
  </script>
</body>
</html>`;
  }

  // =========================================================================
  // 2. REAL ESTATE & GENERAL NICHES TEMPLATE
  // =========================================================================
  const displayBrandUpper = brandName.toUpperCase();
  const nameParts = displayBrandUpper.split(' ');
  const firstWord = nameParts[0] || 'CHRISTOPHE';
  const restWords = nameParts.slice(1).join(' ') || 'TOUMIEU';

  const heroVideoUrl = currentContent.heroVideoUrl || currentContent.heroVideo || currentContent.videoUrl || currentContent.hero_video || 'https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4';
  const heroVideoEffect = currentContent.heroVideoEffect || 'scroll-scrub';
  const heroScrollSpeed = currentContent.heroScrollSpeed || 1.0;
  const heroScrollTiming = currentContent.heroScrollTiming || 1.5;
  const heroScrollOpacity = currentContent.heroScrollOpacity || 0.45;

  let navCtaText = currentContent.navCtaText || (
    isEn
      ? (isRealEstate ? "TALK REAL ESTATE" : (isElectrician ? "TALK ELECTRICITY" : (isPlumber ? "TALK PLUMBING" : `TALK ${activeNiche.toUpperCase()}`)))
      : (isRealEstate ? "PARLER IMMOBILIER" : (isElectrician ? "PARLER ÉLECTRICIEN" : (isPlumber ? "PARLER PLOMBERIE" : `PARLER ${activeNiche.toUpperCase()}`)))
  );
  let contactHeading = currentContent.contactSectionTitle || (
    isEn
      ? (isRealEstate ? "Let's talk<br>real estate." : (isElectrician ? "Let's talk<br>electricity." : (isPlumber ? "Let's talk<br>plumbing." : `Let's talk<br>${activeNiche}.`)))
      : (isRealEstate ? "Parlons<br>immobilier." : (isElectrician ? "Parlons<br>électricité." : (isPlumber ? "Parlons<br>plomberie." : `Parlons<br>${activeNiche}.`)))
  );

  const heroEyebrow = currentContent.heroEyebrow || (
    isEn
      ? (isRealEstate ? `REAL ESTATE ADVISOR · ${displayCity.toUpperCase()}` :
         isElectrician ? `CERTIFIED ELECTRICIAN · 24/7 EMERGENCY · ${displayCity.toUpperCase()}` :
         isPlumber ? `MASTER PLUMBER · 24/7 REPAIR · ${displayCity.toUpperCase()}` :
         `EXPERT · ${displayCity.toUpperCase()}`)
      : (isRealEstate ? `CONSEILLER IMMOBILIER · ${displayCity.toUpperCase()}` :
         isElectrician ? `ÉLECTRICIEN QUALIFIÉ · INTERVENTION 24/7 · ${displayCity.toUpperCase()}` :
         isPlumber ? `PLOMBIER CHAUFFAGISTE · INTERVENTION 24/7 · ${displayCity.toUpperCase()}` :
         `EXPERT · ${displayCity.toUpperCase()}`)
  );
  const heroH2 = currentContent.heroSubtitle || (
    isEn
      ? (isRealEstate ? "Sell, buy or rent with clear, personalized support." :
         isElectrician ? "24/7 emergency repairs, compliance upgrades & certified installations." :
         isPlumber ? "24/7 emergency leak stops, water heaters & bathroom plumbing." :
         "Clear, personalized guidance oriented towards results.")
      : (isRealEstate ? "Vendre, acheter ou louer avec un accompagnement clair et personnalisé." :
         isElectrician ? "Dépannage d'urgence 24/7, remise aux normes NF C 15-100 & installations électriques sécurisées." :
         isPlumber ? "Dépannage d'urgence 24/7, recherche de fuite, chauffe-eau & installation sanitaire." :
         "Accompagnement clair, personnalisé et orienté résultats.")
  );
  const heroP = currentContent.heroDescription || (
    isEn
      ? (isRealEstate ? "Valuation, marketing strategy, viewings and project follow-up: real estate services tailored for owners, buyers, landlords and tenants." :
         isElectrician ? "Power outages, circuit breakers, short circuits, renovations or EV charging stations: benefit from certified electrical help with clear pricing and 10-year warranty." :
         isPlumber ? "Water leaks, drain unclogging, water heater replacement or bathroom renovations: certified plumbers with upfront pricing." :
         `Expert advice, tailored strategy and rigorous execution of every step of your project in ${displayCity}.`)
      : (isRealEstate ? "Estimation, stratégie de commercialisation, visites et suivi du projet : un accompagnement immobilier pensé pour les propriétaires, acquéreurs, bailleurs et locataires." :
         isElectrician ? "Panne de courant, tableau électrique, court-circuit, rénovation ou borne de recharge EV : bénéficiez de l'aide d'un électricien certifié avec diagnostic immédiat, tarifs transparents et garantie décennale." :
         isPlumber ? "Fuite d'eau, débouchage de canalisation, chauffe-eau en panne ou création de salle de bain : des plombiers qualifiés avec devis transparent." :
         `Conseil, stratégie sur mesure et exécution rigoureuse de chaque étape de votre projet à ${displayCity}.`)
  );

  const aboutLabel = currentContent.aboutLabel || (
    isEn ? (isElectrician ? "EXPERT ELECTRICIAN" : (isPlumber ? "MASTER PLUMBER" : "ABOUT US")) : (isElectrician ? "EXPERT ÉLECTRICIEN" : (isPlumber ? "PLOMBIER QUALIFIÉ" : "À PROPOS"))
  );
  const aboutLeadText = currentContent.aboutTitle || currentContent.aboutText || (
    isEn
      ? (isRealEstate ? "LOCAL REAL ESTATE ADVISORY, FROM THE FIRST ESTIMATE TO THE COMPLETION OF YOUR PROJECT." :
         isElectrician ? `YOUR ELECTRICAL SAFETY DEMANDS THE BEST SERVICE. FROM DIAGNOSTICS TO FULL RENOVATION IN ${displayCity.toUpperCase()}, WE ENSURE FAST, CERTIFIED INTERVENTIONS.` :
         isPlumber ? `TRUSTED PLUMBING SERVICES IN ${displayCity.toUpperCase()}, FROM 24/7 EMERGENCY LEAK REPAIRS TO TURNKEY BATHROOM FITTINGS.` :
         `EXCELLENT LOCAL GUIDANCE IN ${displayCity.toUpperCase()}, FROM INITIAL STUDY TO FINAL REALIZATION.`)
      : (isRealEstate ? "UN ACCOMPAGNEMENT IMMOBILIER DE PROXIMITÉ, DE LA PREMIÈRE ESTIMATION JUSQU'À LA CONCRÉTISATION DE VOTRE PROJET." :
         isElectrician ? `VOTRE SÉCURITÉ ÉLECTRIQUE EXIGE LE MEILLEUR ACCOMPAGNEMENT. DE LA RECHERCHE DE PANNE À LA RÉNOVATION COMPLÈTE À ${displayCity.toUpperCase()}, NOUS ASSURONS DES INTERVENTIONS RAPIDES, CONFORMES ET DURABLES.` :
         isPlumber ? `VOTRE PLOMBERIE MÉRITE UN SERVICE IRREPROCHABLE. DU DÉPANNAGE D'URGENCE À LA RÉNATION SANITAIRE À ${displayCity.toUpperCase()}, DES ARTISANS QUALIFIÉS À VOTRE ÉCOUTE.` :
         `UN ACCOMPAGNEMENT D'EXCELLENCE ET DE PROXIMITÉ À ${displayCity.toUpperCase()}, DE L'ÉTUDE INITIALE À LA RÉALISATION FINALE.`)
  );

  const defaultFacts = isEn
    ? (isRealEstate ? [
        { title: "Sales", desc: "Property positioning, presentation, marketing and follow-up until signature." },
        { title: "Rentals", desc: "Guiding landlords and tenant candidates through every stage of the rental process." },
        { title: "Advisory", desc: "A transparent approach helping you make informed decisions with accurate market data." }
      ] : (isElectrician ? [
        { title: "24/7 Fast Arrival", desc: "Emergency arrival in under 30 minutes in " + displayCity + " to safely restore your power." },
        { title: "Safety Standards", desc: "Certified compliance of your electrical panel and circuits for maximum protection." },
        { title: "Transparent Quote", desc: "Zero hidden fees. Clear diagnostic and detailed quote approved before work begins." }
      ] : (isPlumber ? [
        { title: "30 Min Arrival", desc: "Fast emergency intervention across " + displayCity + " for urgent leak repair." },
        { title: "Approved Rates", desc: "Fair, transparent pricing with insurance compatibility." },
        { title: "10-Year Warranty", desc: "Decennial insurance backing every installation and repair." }
      ] : [
        { title: "Expertise", desc: "In-depth analysis of your needs and tailored strategy aligned with your goals." },
        { title: "Transparency", desc: "Regular updates and clear communication at every stage of the project." },
        { title: "Results", desc: "Full commitment to delivering exceptional results within guaranteed deadlines." }
      ])))
    : (isRealEstate ? [
        { title: "Vente", desc: "Positionnement du bien, présentation, diffusion et suivi des contacts jusqu'à la signature." },
        { title: "Location", desc: "Accompagnement des bailleurs et candidats locataires dans les différentes étapes du projet." },
        { title: "Conseil", desc: "Une approche transparente pour vous aider à prendre vos décisions avec les bonnes informations." }
      ] : (isElectrician ? [
        { title: "Réactivité 24/7", desc: "Intervention d'urgence en moins de 30 minutes à " + displayCity + " pour rétablir votre courant en toute sécurité." },
        { title: "Norme NF C 15-100", desc: "Mise aux normes certifiée de votre tableau et circuits pour la protection optimale de vos proches et appareils." },
        { title: "Devis Transparent", desc: "Zéro coût caché. Diagnostic clair et tarification détaillée validée avant tout début de travaux." }
      ] : (isPlumber ? [
        { title: "Arrivée < 30 min", desc: "Dépannage d'urgence rapide dans tout le secteur pour stopper les fuites." },
        { title: "Tarifs Agréés", desc: "Tarification transparente et prise en charge par les assurances." },
        { title: "Garantie Décennale", desc: "Couverture décennale sur toutes nos installations sanitaires." }
      ] : [
        { title: "Expertise", desc: "Analyse précise de vos besoins et stratégie sur mesure adaptée à vos objectifs." },
        { title: "Transparence", desc: "Suivi régulier et communication claire à chaque étape de l'intervention." },
        { title: "Résultats", desc: "Engagement total pour vous offrir un résultat d'excellence dans les meilleurs délais." }
      ])));

  const factsList = currentContent.facts && currentContent.facts.length >= 3 ? currentContent.facts : defaultFacts;

  const marketLabel = currentContent.marketSectionLabel || (
    isEn
      ? (isRealEstate ? "Real estate insights" : (isElectrician ? "Electrical Safety Standards" : (isPlumber ? "Plumbing Standards" : "Commitments & Benchmarks")))
      : (isRealEstate ? "Repères immobiliers" : (isElectrician ? "Repères & Sécurité Électrique" : (isPlumber ? "Repères Plomberie & Qualité" : "Repères & Engagements")))
  );
  const marketLead = currentContent.marketLeadText || (
    isEn
      ? (isRealEstate ? "Selling or renting requires attractive presentation alongside accurate, verified details." :
         isElectrician ? "Every electrical setup must be secure, fully compliant with modern codes, and regularly audited." :
         isPlumber ? "Every pipe network must be water-tight, pressure tested, and built to last." :
         "Solid guarantees and a proven methodology for reliable success every time.")
      : (isRealEstate ? "Vendre ou louer en France demande une présentation attractive, mais aussi des informations exactes." :
         isElectrician ? "Chaque installation électrique doit être sécurisée, conforme aux normes actuelles et régulièrement contrôlée." :
         isPlumber ? "Chaque canalisation doit être étanche, testée sous pression et conçue pour durer." :
         "Des garanties solides et une méthodologie éprouvée pour réussir à coup sûr.")
  );

  const defaultMarketCards = isEn
    ? (isRealEstate ? [
        { img: section1Image, title: "Single Family Houses", tag: "For Selling", desc: "Price, surface, features, diagnostic reports and property location presented accurately based on local market dynamics." },
        { img: section2Image, title: "Apartments & Condos", tag: "For Renting", desc: "Rental application file, lease agreement, required diagnostics and regulations handled transparently for peace of mind." }
      ] : (isElectrician ? [
        { img: section1Image, title: "24/7 Emergency & Circuit Repair", tag: "Urgency & Safety", desc: "Tripped breakers, burning outlets or complete power loss: our technicians arrive immediately to isolate hazards." },
        { img: section2Image, title: "Electrical Panel & EV Chargers", tag: "Certified Code Compliance", desc: "Upgrading outdated breaker panels, installing 30mA differential switches and home EV charging wallboxes." }
      ] : (isPlumber ? [
        { img: section1Image, title: "Emergency Leak Detection", tag: "24/7 Urgency", desc: "Thermal camera diagnostic to locate hidden leaks without damaging walls or floors." },
        { img: section2Image, title: "Water Heater Swap & Plumbing", tag: "Sanitary Fitting", desc: "Same-day water heater replacement, copper/PER pipe installation, and bathroom upgrades." }
      ] : [
        { img: section1Image, title: "Troubleshooting & Repairs", tag: "Urgent Care", desc: "Speed, precise diagnostic testing and upfront transparent pricing before any repair begins." },
        { img: section2Image, title: "Custom Projects & Renovation", tag: "Bespoke Solutions", desc: "Design, premium material selection and certified execution according to strict quality standards." }
      ])))
    : (isRealEstate ? [
        { img: section1Image, title: "Maison individuelle", tag: "Pour vendre", desc: "Prix, surface, caractéristiques, diagnostics et situation du bien doivent être présentés de façon cohérente." },
        { img: section2Image, title: "Appartement & Copropriété", tag: "Pour louer", desc: "Le dossier locatif, le bail, les diagnostics et les informations obligatoires dépendent notamment du logement." }
      ] : (isElectrician ? [
        { img: section1Image, title: "Dépannage 24/7 & Court-Circuit", tag: "Urgence & Sécurité", desc: "Disjoncteur qui saute, prise défectueuse ou coupure générale : intervention immédiate." },
        { img: section2Image, title: "Tableau & Borne IRVE", tag: "Norme NF C 15-100", desc: "Remplacement de tableaux vétustes et pose de bornes de recharge pour véhicules électriques." }
      ] : (isPlumber ? [
        { img: section1Image, title: "Recherche de Fuite 24/7", tag: "Urgence & Diagnostic", desc: "Détection thermique non destructive pour localiser les fuites rapidement." },
        { img: section2Image, title: "Remplacement Chauffe-eau", tag: "Sanitaire & Confort", desc: "Pose et remplacement express de cumulus et installation de robinetterie haut de gamme." }
      ] : [
        { img: section1Image, title: "Dépannage & Interventions", tag: "Pour urgences", desc: "Réactivité, diagnostic précis et transparence tarifaire avant toute intervention." },
        { img: section2Image, title: "Projets & Rénovation", tag: "Pour sur-mesure", desc: "Conception, sélection des matériaux nobles et mise en œuvre certifiée." }
      ])));

  const marketCards = currentContent.marketCards && currentContent.marketCards.length >= 2 ? currentContent.marketCards : defaultMarketCards;

  let interactiveQuoteTitle = isEn ? "Estimate Your Project" : "Estimer votre projet";
  let interactiveQuoteSub = isEn ? "Select your criteria to calculate an instant quote or appointment." : "Sélectionnez vos critères pour obtenir un tarif ou un RDV immédiat.";
  let calcLabel1 = isEn ? "Type:" : "Type de besoin :";
  let calcOptions1 = isEn ? ["Apartment", "House", "Villa", "Land"] : ["Appartement", "Maison", "Villa", "Terrain"];
  let calcLabel2 = isEn ? "Scope:" : "Surface / Ampleur :";
  let calcUnit = "m²";
  let calcMin = 30;
  let calcMax = 300;
  let calcStep = 10;
  let calcDefault = 92;
  let basePricePerUnit = 4.5;
  let ctaTextNiche = isEn ? "Request Free Valuation" : "Demander mon Estimation Offerte";

  if (isPlumber) {
    interactiveQuoteTitle = isEn ? "Emergency Plumbing & Quote Calculator" : "Calculateur d'Intervention & Devis SOS 24/7";
    interactiveQuoteSub = isEn ? "Select your emergency to calculate instant estimate." : "Sélectionnez votre urgence pour estimer le tarif d'intervention immédiat.";
    calcLabel1 = isEn ? "Service Type:" : "Type de prestation :";
    calcOptions1 = isEn ? ["Water Leak SOS", "Water Heater", "Unclogging", "Bathroom Swap"] : ["Fuite d'eau SOS", "Chauffe-eau", "Débouchage", "Rénovation SdB"];
    calcLabel2 = isEn ? "Urgency level:" : "Degré d'urgence :";
    calcUnit = isEn ? "hours" : "heures";
    calcMin = 1; calcMax = 12; calcStep = 1; calcDefault = 2; basePricePerUnit = 85;
    ctaTextNiche = isEn ? "Request Immediate Dispatch" : "Déclencher l'Intervention Immédiate";
  } else if (isElectrician) {
    interactiveQuoteTitle = isEn ? "Electrical Audit & Instant Estimate" : "Audit Électrique & Estimation d'Intervention";
    interactiveQuoteSub = isEn ? "Select service type to estimate electrical work rate." : "Sélectionnez le type d'intervention pour calculer votre tarif estimatif d'électricien.";
    calcLabel1 = isEn ? "Work type:" : "Nature des travaux :";
    calcOptions1 = isEn ? ["24/7 Repair", "Code Compliance", "Electrical Panel", "EV Charger"] : ["Dépannage SOS 24/7", "Remise aux Normes", "Tableau Électrique", "Borne IRVE"];
    calcLabel2 = isEn ? "Number of rooms / points:" : "Nombre de pièces / points :";
    calcUnit = isEn ? "rooms" : "pièces";
    calcMin = 1; calcMax = 12; calcStep = 1; calcDefault = 4; basePricePerUnit = 180;
    ctaTextNiche = isEn ? "Book Electrical Diagnostic" : "Réserver mon Diagnostic Électrique";
  }

  const getValidImg = (givenImg, idx) => {
    if (givenImg && typeof givenImg === 'string' && givenImg.trim().length > 5) return givenImg.trim();
    return getPhoto(idx, activeFallbacks[idx % activeFallbacks.length]);
  };

  const rawServices = (currentContent.services && Array.isArray(currentContent.services) && currentContent.services.length >= 3) ? currentContent.services : [
    {
      num: '01 · SERVICE',
      title: isRealEstate ? (isEn ? 'Property Valuation' : 'Valoriser le bien') : (isElectrician ? (isEn ? '24/7 Repairs' : 'Dépannage 24/7') : (isPlumber ? (isEn ? 'Emergency Leak Stop' : 'Recherche de Fuite') : (isEn ? 'Audit & Diagnostic' : 'Conseil & Diagnostic'))),
      desc: isRealEstate ? (isEn ? 'Market analysis and comprehensive valuation report.' : 'Estimation argumentée et analyse du marché local.') : (isEn ? 'Rapid diagnostic and safe execution guaranteed.' : 'Diagnostic rapide et intervention sécurisée garantis.'),
      tag: isEn ? 'Premium Service' : 'Prestation d\'Excellence',
      img: getPhoto(0, activeFallbacks[0])
    },
    {
      num: '02 · EXPERTISE',
      title: isRealEstate ? (isEn ? 'Marketing & Viewing' : 'Présenter & diffuser') : (isElectrician ? (isEn ? 'Panel Upgrade' : 'Remise aux Normes') : (isPlumber ? (isEn ? 'Water Heater Swap' : 'Remplacement Chauffe-eau') : (isEn ? 'Execution & Setup' : 'Réalisation & Expertise'))),
      desc: isRealEstate ? (isEn ? 'HDR photography and targeted buyer distribution.' : 'Visuels soignés et diffusion ciblée.') : (isEn ? 'Certified equipment following latest safety codes.' : 'Matériel certifié et respect strict des normes.'),
      tag: isEn ? 'High Visibility' : 'Visibilité maximale',
      img: getPhoto(1, activeFallbacks[1])
    },
    {
      num: '03 · SUPPORT',
      title: isRealEstate ? (isEn ? 'Rental Management' : 'Louer sereinement') : (isElectrician ? (isEn ? 'Lighting & Automation' : 'Domotique & Éclairage') : (isPlumber ? (isEn ? 'Bathroom Renovation' : 'Salle de Bain') : (isEn ? 'Follow-up & Care' : 'Suivi & Assistance'))),
      desc: isRealEstate ? (isEn ? 'Tenant vetting, leases, and inventory checks.' : 'Gestion locative et sélection de locataires.') : (isEn ? 'Turnkey solutions for your ongoing peace of mind.' : 'Accompagnement continu pour votre sérénité.'),
      tag: isEn ? 'Full Care' : 'Service 7j/7',
      img: getPhoto(2, activeFallbacks[2])
    },
    {
      num: '04 · ADVISORY',
      title: isRealEstate ? (isEn ? 'Buying Guidance' : 'Acheter avec méthode') : (isElectrician ? (isEn ? 'EV Wallbox Chargers' : 'Bornes de Recharge VE') : (isPlumber ? (isEn ? 'Drain Unclogging' : 'Débouchage') : (isEn ? 'Turnkey Finish' : 'Finalisation Clé en main'))),
      desc: isRealEstate ? (isEn ? 'Targeted search and negotiation to notary closing.' : 'Recherche ciblée jusqu\'à la signature.') : (isEn ? 'Complete guidance to final handover.' : 'Livraison impeccable et résultat durable.'),
      tag: isEn ? 'Tailored' : 'Sur-mesure',
      img: getPhoto(3, activeFallbacks[3])
    }
  ];

  const serviceItems = rawServices.map((srv, idx) => ({
    ...srv,
    img: getValidImg(srv.img || currentContent[`service${idx+1}Img`] || currentContent[`method${idx+1}Img`] || currentContent[`step${idx+1}Img`], idx)
  }));

  const default3Catalog = [
    {
      title: isEn ? 'Premium Service Option #1' : 'Prestation d\'Exception #1 · Diagnostic',
      desc: isEn ? 'High standard execution tailored for complex projects.' : 'Un niveau d’exigence maximal pour répondre aux demandes les plus complexes.',
      img: getPhoto(1, activeFallbacks[1]),
      features: isEn ? ['Fast dispatch', 'Certified standards', 'Transparent quote', 'Dedicated follow-up'] : ['Intervention rapide', 'Normes certifiées', 'Devis transparent', 'Suivi dédié']
    },
    {
      title: isEn ? 'Premium Service Option #2' : 'Prestation d\'Exception #2 · Réalisation',
      desc: isEn ? 'Modern equipment and meticulous execution for ultimate peace of mind.' : 'Des équipements modernes et une exécution soignée pour votre confort.',
      img: getPhoto(2, activeFallbacks[2]),
      features: isEn ? ['Top-grade materials', '10-year warranty', 'VIP support', 'Bespoke project'] : ['Matériaux nobles', 'Garantie décennale', 'Accompagnement VIP', 'Projet sur mesure']
    },
    {
      title: isEn ? 'Premium Service Option #3' : 'Prestation d\'Exception #3 · Maintenance & Suivi',
      desc: isEn ? 'Long-term support to maintain your asset performance.' : 'Accompagnement sur le long terme pour maintenir la valeur de vos équipements.',
      img: getPhoto(3, activeFallbacks[3] || activeFallbacks[0]),
      features: isEn ? ['Maintenance contract', 'Priority assistance', 'Detailed report', 'Guaranteed compliance'] : ['Contrat d\'entretien', 'Assistance prioritaire', 'Compte-rendu détaillé', 'Conformité assurée']
    }
  ];

  const catalogList = currentContent.catalogList && currentContent.catalogList.length >= 3 ? currentContent.catalogList : default3Catalog;

  const benefitsLabel = currentContent.benefitsLabel || (isEn ? "WHY CHOOSE US" : "POURQUOI NOUS CHOISIR");
  const benefitsTitle = currentContent.benefitsTitle || (
    isEn
      ? (isRealEstate ? "Why entrusting your real estate project to us is your best decision." : (isElectrician ? "Why choosing our certified electrician is your best decision." : (isPlumber ? "Why choosing our master plumbers is your best decision." : "Why working with us is your best decision.")))
      : (isRealEstate ? "Pourquoi nous confier votre projet immobilier est votre meilleure décision." : (isElectrician ? "Pourquoi faire appel à notre électricien certifié est votre meilleure décision." : (isPlumber ? "Pourquoi faire appel à nos plombiers qualifiés est votre meilleure décision." : "Pourquoi faire appel à nos services est votre meilleure décision.")))
  );

  const defaultBenefits = isEn ? [
    { icon: "⚡", title: "Transparency & Accuracy", desc: "In-depth local market analysis and verified information for complete confidence." },
    { icon: "📸", title: "High Definition Presentation", desc: "Optimal property presentation with crisp visuals and targeted distribution." },
    { icon: "🤝", title: "Dedicated Support", desc: "A single point of contact supporting you at every stage of your project." }
  ] : [
    { icon: "✨", title: "Excellence & Savoir-Faire", desc: "Respect strict des règles de l'art et exécution soignée pour des résultats durables." },
    { icon: "🚀", title: "Réactivité & Disponibilité", desc: "Intervention rapide et suivi fluide pour répondre à toutes vos interrogations." },
    { icon: "🔒", title: "Garantie & Sérénité", desc: "Toutes nos prestations sont sous le couvert de garanties solides." }
  ];

  const benefitsList = currentContent.benefitsList && currentContent.benefitsList.length >= 3 ? currentContent.benefitsList : defaultBenefits;

  const defaultGallery = [
    { img: heroImage, caption: brandName + ' — ' + displayCity },
    { img: aboutImage, caption: isEn ? 'Craft & Quality' : 'Savoir-Faire & Qualité' },
    { img: section1Image, caption: isEn ? 'Services & Equipment' : 'Intervention & Équipements' },
    { img: section2Image, caption: isEn ? 'Realizations' : 'Finition & Réalisation' },
    { img: contactImage, caption: isEn ? 'Team & Contact' : 'Équipe & Contact' }
  ];

  const galleryItems = (currentContent.portfolio && Array.isArray(currentContent.portfolio) && currentContent.portfolio.length >= 3)
    ? currentContent.portfolio.map(item => ({
        img: typeof item === 'string' ? item : (item.img || item.url || item.image || heroImage),
        caption: typeof item === 'string' ? brandName : (item.caption || item.title || brandName)
      }))
    : defaultGallery;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} — ${isRealEstate ? (isEn ? 'Real Estate Advisor' : 'Conseiller immobilier') : (isEn ? 'Professional Service' : 'Service professionnel')} ${displayCity}</title>
  <style>
    :root {
      --ink: #171717;
      --muted: #737373;
      --cream: #f5f3ee;
      --dark: #202020;
      --line: #dedbd4;
      --white: #ffffff;
      --radius: 26px;
      --ease: cubic-bezier(.16,1,.3,1);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: Arial, Helvetica, sans-serif; color: var(--ink); background: #ffffff; line-height: 1.5; overflow-x: hidden; }
    .container { max-width: 1320px; margin: auto; padding: 0 30px; }

    /* 1. HERO SECTION */
    .hero { height: 94vh; min-height: 680px; margin: 10px; border-radius: 32px; overflow: hidden; position: relative; color: #fff; background: #111; }
    .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(.65); z-index: 0; }
    .hero:after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.72)); z-index: 1; pointer-events: none; }
    
    .nav { position: relative; z-index: 5; display: flex; align-items: center; justify-content: space-between; padding: 26px 30px; }
    .logo { font-size: 23px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; }
    .nav ul { display: flex; gap: 28px; list-style: none; }
    .nav a { color: #fff; text-decoration: none; text-transform: uppercase; font-size: 11px; letter-spacing: .8px; }
    .nav .cta { border: 1px solid rgba(255,255,255,.55); border-radius: 99px; padding: 11px 20px; font-weight: 700; text-transform: uppercase; text-decoration: none; color: #fff; transition: all 0.2s ease; }
    .nav .cta:hover { background: #fff; color: #111; }

    .hero-content { position: relative; z-index: 4; height: calc(100% - 80px); display: flex; flex-direction: column; justify-content: flex-end; padding: 40px 40px 36px; }
    .eyebrow { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 18px; opacity: .85; font-weight: 700; }
    .hero h1 { font-size: clamp(52px, 9vw, 115px); font-weight: 300; line-height: .91; letter-spacing: -.055em; text-transform: uppercase; max-width: 920px; }
    .hero h1 span { font-weight: 700; display: block; }
    .hero-bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 30px; margin-top: 32px; }
    .hero-copy { max-width: 580px; }
    .hero-copy h2 { font-size: clamp(21px, 2.5vw, 31px); font-weight: 400; line-height: 1.25; margin-bottom: 12px; }
    .hero-copy p { font-size: 14px; color: rgba(255,255,255,.85); max-width: 560px; line-height: 1.55; }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 22px; }
    .btn { display: inline-block; text-decoration: none; border-radius: 99px; padding: 14px 26px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; transition: all .2s; }
    .btn-light { background: #fff; color: #111; }
    .btn-light:hover { background: #e2e2e2; }
    .btn-ghost { border: 1px solid rgba(255,255,255,.55); color: #fff; }
    .btn-ghost:hover { background: rgba(255,255,255,0.15); }
    .scroll-note { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; opacity: .65; font-weight: 600; }

    /* 2. ABOUT SECTION */
    .section { padding: 105px 0; }
    .section-grid { display: grid; grid-template-columns: 230px 1fr; gap: 50px; }
    .label { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #171717; }
    .lead { font-size: clamp(26px, 3.8vw, 46px); line-height: 1.15; text-transform: uppercase; max-width: 960px; color: #171717; font-weight: 400; }
    .lead strong { font-weight: 700; color: #111; }
    .about-layout { display: grid; grid-template-columns: 1.1fr .9fr; gap: 55px; align-items: start; }
    .about-photo { height: 480px; border-radius: var(--radius); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
    .about-photo img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 35px; margin-top: 55px; border-top: 1px solid var(--line); padding-top: 32px; }
    .fact h3 { font-size: 22px; margin-bottom: 10px; font-weight: 700; color: #171717; text-transform: uppercase; }
    .fact p { font-size: 13px; color: var(--muted); line-height: 1.6; }

    /* 3. SERVICES SECTION */
    .service-wrap { background: var(--cream); margin: 0 20px; border-radius: 32px; padding: 80px 40px; }
    .service-head { max-width: 820px; }
    .service-head h2 { font-size: clamp(32px, 5.5vw, 68px); font-weight: 300; line-height: .98; text-transform: uppercase; letter-spacing: -.04em; margin: 16px 0 20px; }
    .service-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 60px; }
    .service { background: #fff; border-radius: 22px; overflow: hidden; min-height: 390px; display: flex; flex-direction: column; }
    .service img { display: block; width: 100%; height: 180px; object-fit: cover; }
    .service-body { padding: 25px; display: flex; flex: 1; flex-direction: column; }
    .service-num { font-size: 12px; font-weight: 800; margin-bottom: 35px; color: #111; }
    .service h3 { font-size: 17px; text-transform: uppercase; margin-bottom: 10px; font-weight: 700; }
    .service p { font-size: 12px; color: var(--muted); line-height: 1.6; }
    .service .tag { margin-top: auto; padding-top: 18px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .7px; color: #111; }

    /* 4. CATALOG SECTION */
    .catalog { padding-top: 100px; }
    .catalog-card { display: grid; grid-template-columns: 1.05fr .95fr; gap: 65px; align-items: center; border-top: 1px solid var(--line); padding-top: 55px; }
    .catalog-img { height: 480px; border-radius: var(--radius); overflow: hidden; }
    .catalog-img img { display: block; width: 100%; height: 100%; object-fit: cover; transition: opacity .3s; }
    .catalog-info h2 { font-size: clamp(34px, 4.5vw, 60px); font-weight: 300; line-height: .98; text-transform: uppercase; letter-spacing: -.04em; margin-bottom: 18px; }
    .catalog-info p { font-size: 13px; color: var(--muted); line-height: 1.65; margin-bottom: 25px; }
    .features { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 25px; list-style: none; margin-bottom: 32px; }
    .features li { font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .dark-btn { background: var(--dark); color: #fff; }
    .dots { display: flex; gap: 7px; margin-top: 25px; }
    .dot { width: 34px; height: 4px; background: #ddd; border-radius: 5px; cursor: pointer; }
    .dot.active { background: #222; }

    /* 5. GALLERY SECTION */
    .gallery-section { padding: 90px 0; overflow: hidden; }
    .gallery-intro { max-width: 700px; margin: 0 auto 40px; text-align: center; }
    .gallery-intro h2 { font-size: clamp(26px, 3.5vw, 46px); font-weight: 300; text-transform: uppercase; line-height: 1.1; }
    .track { display: flex; gap: 20px; width: max-content; animation: scroll 32s linear infinite; }
    @keyframes scroll { to { transform: translateX(-50%); } }
    .gallery-card { width: 380px; flex-shrink: 0; }
    .gallery-card img { display: block; width: 100%; height: 260px; object-fit: cover; border-radius: 22px; }
    .gallery-card p { font-size: 11px; color: var(--muted); margin-top: 10px; text-transform: uppercase; font-weight: 600; }

    /* 5.5 BENEFITS SECTION */
    .benefits-section { padding: 80px 0; background: #faf8f5; border-top: 1px solid #e8e4dc; border-bottom: 1px solid #e8e4dc; }
    .benefits-intro { max-width: 800px; margin: 0 auto 50px; text-align: center; }
    .benefits-intro h2 { font-size: clamp(28px, 3.8vw, 48px); font-weight: 300; text-transform: uppercase; line-height: 1.1; margin-top: 10px; }
    .benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
    .benefit-card { background: #ffffff; border: 1px solid #dedbd4; border-radius: 24px; padding: 35px 28px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.02); transition: transform 0.3s ease; }
    .benefit-card:hover { transform: translateY(-4px); }
    .benefit-icon { font-size: 28px; margin-bottom: 16px; display: inline-block; }
    .benefit-card h3 { font-size: 18px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; color: #171717; }
    .benefit-card p { font-size: 13px; color: var(--muted); line-height: 1.65; margin: 0; }

    /* 6. MARKET SECTION */
    .market { background: #202020; color: #fff; margin: 0 20px; border-radius: 32px; padding: 80px 40px; }
    .market-grid { display: grid; grid-template-columns: 230px 1fr; gap: 50px; }
    .market .label { color: #fff; }
    .market .lead { color: #fff; font-size: clamp(22px, 2.8vw, 36px); line-height: 1.25; text-transform: uppercase; }
    .market-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 45px; }
    .market-card { border: 1px solid rgba(255,255,255,.15); border-radius: 22px; overflow: hidden; background: rgba(255,255,255,0.03); }
    .market-card img { display: block; width: 100%; height: 220px; object-fit: cover; }
    .market-card div { padding: 24px; }
    .market-card h3 { font-size: 20px; font-weight: 700; text-transform: uppercase; color: #fff; }
    .market-card .tag-sub { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #a3a3a3; margin-top: 4px; margin-bottom: 12px; }
    .market-card p { font-size: 13px; color: #ccc; line-height: 1.6; margin: 0; }

    /* 7. CONTACT & CALCULATOR SECTION */
    .contact { margin: 40px 20px 20px; background: #f1efe9; border-radius: 32px; padding: 85px 40px 30px; }
    .contact h2 { font-size: clamp(48px, 8vw, 105px); font-weight: 300; line-height: .9; letter-spacing: -.05em; text-transform: uppercase; margin-bottom: 50px; color: #171717; }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
    
    .calc-box { background: #ffffff; border-radius: 24px; padding: 30px; border: 1px solid #dedbd4; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 25px; }
    .calc-box h3 { font-size: 18px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
    .calc-box p { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
    .calc-group { margin-bottom: 18px; }
    .calc-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px; display: block; }
    .calc-options { display: flex; gap: 8px; flex-wrap: wrap; }
    .calc-btn { background: #f5f3ee; border: 1px solid #ddd; padding: 10px 16px; border-radius: 999px; font-size: 11px; font-weight: 700; cursor: pointer; text-transform: uppercase; transition: all .2s; }
    .calc-btn.active { background: #171717; color: #fff; border-color: #171717; }
    .calc-slider { width: 100%; margin-top: 8px; accent-color: #171717; }
    .calc-result { background: #202020; color: #fff; border-radius: 16px; padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
    .calc-price { font-size: 22px; font-weight: 800; color: #10b981; }

    .form input, .form textarea { width: 100%; background: transparent; border: 0; border-bottom: 1px solid #bbb; padding: 15px 0; margin-bottom: 22px; font: 12px Arial, Helvetica, sans-serif; outline: none; text-transform: uppercase; }
    .contact-copy { font-size: 13px; color: #666; line-height: 1.7; }
    .contact-copy strong { color: #171717; }
    .contact-img { display: block; width: 100%; height: 260px; border-radius: 22px; object-fit: cover; margin-top: 28px; }
    .footer { border-top: 1px solid #d5d2ca; margin-top: 70px; padding-top: 20px; display: flex; justify-content: space-between; font-size: 10px; color: #777; text-transform: uppercase; }
    .footer a { color: #777; text-decoration: none; margin-left: 16px; }

    @media (max-width: 900px) {
      .section-grid, .market-grid, .about-layout, .catalog-card, .contact-grid { grid-template-columns: 1fr; gap: 30px; }
      .service-grid { grid-template-columns: 1fr 1fr; }
      .hero-bottom { flex-direction: column; align-items: flex-start; }
      .nav ul { display: none; }
      .market-cards { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- 1. HERO SECTION -->
  <section class="hero" id="home">
    <img id="heroBgImg" class="hero-bg" data-site-img src="${heroImage}" alt="${brandName}">
    
    <nav class="nav">
      <div class="logo">${firstWord.substring(0,1)}${restWords.substring(0,1)}</div>
      <ul>
        <li><a href="#home">${isEn ? 'Home' : 'Accueil'}</a></li>
        <li><a href="#about">${isEn ? 'About' : 'À propos'}</a></li>
        <li><a href="#services">${isEn ? (isRealEstate ? 'Buy & Sell' : 'Services') : (isRealEstate ? 'Vendre & Louer' : 'Services')}</a></li>
        <li><a href="#catalog">${isEn ? (isRealEstate ? 'Properties' : 'Offers') : (isRealEstate ? 'Biens' : 'Offres')}</a></li>
        <li><a href="#contact">${isEn ? 'Contact' : 'Contact'}</a></li>
      </ul>
      <a class="cta" href="#contact">${navCtaText}</a>
    </nav>

    <div class="hero-content">
      <div>
        <div class="eyebrow" id="heroEyebrow" data-site-text="heroEyebrow">${heroEyebrow}</div>
        <h1>${firstWord}<br><span>${restWords}</span></h1>
        <div class="hero-bottom">
          <div class="hero-copy">
            <h2>${heroH2}</h2>
            <p>${heroP}</p>
            <div class="hero-actions">
              <a href="#contact" class="btn btn-light">${isEn ? (isRealEstate ? 'ESTIMATE MY PROPERTY' : 'Get Quote / Appointment') : (isRealEstate ? 'ESTIMER MON BIEN' : 'Obtenir un devis / RDV')}</a>
              <a href="#services" class="btn btn-ghost">${isEn ? 'Explore Services' : 'Découvrir l\'accompagnement'}</a>
            </div>
          </div>
          <div class="scroll-note">${isEn ? 'Scroll to explore ↓' : 'Défiler pour découvrir ↓'}</div>
        </div>
      </div>
    </div>
  </section>

  ${renderTransparentSliderSection(currentContent.transparentSlider || currentContent.sliderConfig)}

  <!-- 2. ABOUT SECTION -->
  <section class="section container" id="about">
    <div class="section-grid">
      <div class="label">${aboutLabel}</div>
      <div>
        <div class="about-layout">
          <p class="lead">${aboutLeadText}</p>
          <div class="about-photo">
            <img id="aboutPhotoImg" data-site-img src="${aboutImage}" alt="${brandName}">
          </div>
        </div>
        <div class="facts">
          ${factsList.map(f => `
            <div class="fact">
              <h3>${f.title}</h3>
              <p>${f.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- 3. SERVICES SECTION -->
  <section class="service-wrap" id="services">
    <div class="service-head">
      <div class="label">${isEn ? 'Our Method' : 'Notre Méthode'}</div>
      <h2>${isEn ? 'A clear method, from first contact to realization.' : 'Une méthode simple, du premier échange à la réalisation.'}</h2>
      <p class="muted">${isEn ? 'Every project is unique. Our goal is to bring clarity and solutions tailored to your standards.' : 'Chaque projet est unique. Notre objectif est d\'apporter de la clarté et des solutions adaptées à vos exigences.'}</p>
    </div>
    <div class="service-grid">
      ${serviceItems.map((srv, idx) => `
        <article class="service">
          <img id="serviceImg_${idx}" data-site-img src="${srv.img || getPhoto(idx, activeFallbacks[idx % activeFallbacks.length])}" alt="${srv.title}">
          <div class="service-body">
            <div class="service-num">${srv.num || `0${idx+1} · SERVICE`}</div>
            <h3>${srv.title}</h3>
            <p>${srv.desc}</p>
            <div class="tag">${srv.tag || (isEn ? 'High Standard' : 'Prestation d\'Excellence')}</div>
          </div>
        </article>
      `).join('')}
    </div>
  </section>

  <!-- 4. CATALOG SECTION -->
  <section class="catalog container" id="catalog">
    <div class="label" style="margin-bottom:35px">${isEn ? 'Selection & Offers' : 'Sélection & Offres'}</div>
    <div class="catalog-card">
      <div class="catalog-img">
        <img id="catalogImg" data-site-img src="${catalogList[0].img}" alt="${catalogList[0].title}">
      </div>
      <div class="catalog-info">
        <h2 id="catalogTitle">${catalogList[0].title}</h2>
        <p id="catalogDesc">${catalogList[0].desc}</p>
        <ul class="features" id="catalogFeatures">
          ${catalogList[0].features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <a href="#contact" class="btn dark-btn">${isEn ? 'Get Details' : 'Recevoir les détails'}</a>
        <div class="dots">
          ${catalogList.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" onclick="switchCatalog(${i})"></span>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- 5. GALLERY SECTION -->
  <section class="gallery-section">
    <div class="gallery-intro">
      <div class="label">${isEn ? 'Projects & Works' : 'Projets & Réalisations'}</div>
      <h2>${isEn ? 'Tailored execution, consistent quality.' : 'Des réalisations soignées, un même niveau d\'attention.'}</h2>
    </div>
    <div class="track">
      ${galleryItems.map(g => `
        <div class="gallery-card">
          <img data-site-img src="${g.img}" alt="${g.caption}">
          <p>${g.caption}</p>
        </div>
      `).join('')}
      ${galleryItems.map(g => `
        <div class="gallery-card">
          <img data-site-img src="${g.img}" alt="${g.caption}">
          <p>${g.caption}</p>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- 5.5 BENEFITS SECTION -->
  <section class="benefits-section">
    <div class="container">
      <div class="benefits-intro">
        <div class="label">${benefitsLabel}</div>
        <h2>${benefitsTitle}</h2>
      </div>
      <div class="benefits-grid">
        ${benefitsList.map(b => `
          <div class="benefit-card">
            <span class="benefit-icon">${b.icon || '✓'}</span>
            <h3>${b.title}</h3>
            <p>${b.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- 6. MARKET SECTION -->
  <section class="market" id="approche">
    <div class="market-grid">
      <div class="label">${marketLabel}</div>
      <div>
        <p class="lead">${marketLead}</p>
        <div class="market-cards">
          ${marketCards.map((card, idx) => `
            <article class="market-card">
              <img id="marketImg_${idx}" data-site-img src="${card.img}" alt="${card.title}">
              <div>
                <h3>${card.title}</h3>
                <span class="tag-sub">${card.tag}</span>
                <p>${card.desc}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- 7. CONTACT & CALCULATOR SECTION -->
  <section class="contact" id="contact">
    <h2>${contactHeading}</h2>
    <div class="contact-grid">
      <div>
        <div class="calc-box">
          <h3>${interactiveQuoteTitle}</h3>
          <p>${interactiveQuoteSub}</p>
          
          <div class="calc-group">
            <span class="calc-label">${calcLabel1}</span>
            <div class="calc-options" id="calcOptions1">
              ${calcOptions1.map((opt, i) => `<button type="button" class="calc-btn ${i === 0 ? 'active' : ''}" onclick="selectCalcOpt(this)">${opt}</button>`).join('')}
            </div>
          </div>

          <div class="calc-group">
            <span class="calc-label">${calcLabel2} <span id="calcValText">${calcDefault} ${calcUnit}</span></span>
            <input type="range" class="calc-slider" min="${calcMin}" max="${calcMax}" step="${calcStep}" value="${calcDefault}" oninput="updateSliderVal(this.value)">
          </div>

          <div class="calc-result">
            <div>
              <small style="font-size: 10px; color: #aaa; text-transform: uppercase;">${isEn ? 'Instant Estimate:' : 'Estimation instantanée :'}</small>
              <div class="calc-price" id="calcPriceDisplay">~ ${isEn ? '$' : ''}450 ${isEn ? '' : '€ TTC'}</div>
            </div>
            <a href="#contactForm" class="btn btn-light" style="font-size: 10px; padding: 10px 16px;" onclick="fillFormRequest()">${ctaTextNiche}</a>
          </div>
        </div>

        <form class="form" id="contactForm" onsubmit="event.preventDefault(); alert('${isEn ? 'Thank you! Your request has been sent successfully.' : 'Merci ! Votre demande d\'estimation a bien été transmise.'}');">
          <input type="text" id="formName" placeholder="${isEn ? 'Your name' : 'Votre nom'}" required>
          <input type="email" id="formEmail" placeholder="${isEn ? 'Your email' : 'Votre e-mail'}" required>
          <input type="tel" id="formPhone" placeholder="${isEn ? 'Your phone' : 'Votre téléphone'}" required>
          <textarea id="formMsg" placeholder="${isEn ? 'Describe your project or preferred date...' : 'Précisez votre besoin ou date souhaitée...'}"></textarea>
          <button class="btn dark-btn" type="submit" style="width: 100%; border: 0; cursor: pointer;">${isEn ? 'Submit Request' : 'Envoyer ma demande'}</button>
        </form>
      </div>

      <div class="contact-copy">
        <p id="contactCopy" data-site-text="contactCopy">${currentContent.contactCopy || currentContent.contactText || (isEn ? "Have a project in mind? Let us discuss your requirements and define the best strategy together." : "Un projet en vue ? Échangeons sur votre situation et définissons ensemble la meilleure stratégie.")}</p><br>
        <p>
          <strong><span id="contactPhone" data-site-text="contactPhone">${displayPhone}</span></strong><br>
          <a href="mailto:${displayEmail}" id="contactEmail" data-site-text="contactEmail" style="color:inherit">${displayEmail}</a><br>
          <span id="contactAddress" data-site-text="contactAddress">${displayAddress}</span>
        </p>
        <img id="contactImg" data-site-img class="contact-img" src="${contactImage}" alt="${brandName}">
      </div>
    </div>

    <div class="footer">
      <div id="footerBrand" data-site-text="brandName">${displayBrandUpper}</div>
      <div id="footerCopyright" data-site-text="footerCopyright">${currentContent.footerCopyright || `© 2026 · ${isRealEstate ? (isEn ? 'Real Estate Advisor' : 'Conseiller Immobilier') : (isEn ? 'Professional Services' : 'Services Professionnels')}`}</div>
      <div id="footerEmailContainer"><a href="mailto:${displayEmail}" id="footerEmail" data-site-text="contactEmail" style="color:inherit">${displayEmail}</a></div>
      <div><a href="#about">${isEn ? 'About' : 'À propos'}</a><a href="#services">${isEn ? 'Services' : 'Services'}</a><a href="#contact">${isEn ? 'Contact' : 'Contact'}</a></div>
    </div>
  </section>

  <script>
    const catalogData = ${JSON.stringify(catalogList)};
    let currentCatalog = 0;
    const baseRate = ${basePricePerUnit};
    let currentVal = ${calcDefault};
    const unitStr = "${calcUnit}";

    function switchCatalog(i) {
      currentCatalog = i % catalogData.length;
      const d = catalogData[currentCatalog];
      const img = document.getElementById('catalogImg');
      if (img) {
        img.style.opacity = 0;
        setTimeout(() => {
          img.src = d.img;
          document.getElementById('catalogTitle').textContent = d.title;
          document.getElementById('catalogDesc').textContent = d.desc;
          document.getElementById('catalogFeatures').innerHTML = d.features.map(x => '<li>' + x + '</li>').join('');
          img.style.opacity = 1;
        }, 180);
      }
      document.querySelectorAll('.dot').forEach((x, n) => x.classList.toggle('active', n === currentCatalog));
    }

    function selectCalcOpt(btn) {
      document.querySelectorAll('#calcOptions1 .calc-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      recalcPrice();
    }

    function updateSliderVal(val) {
      currentVal = val;
      document.getElementById('calcValText').textContent = val + ' ' + unitStr;
      recalcPrice();
    }

    function recalcPrice() {
      let price = Math.round(currentVal * baseRate + 150);
      document.getElementById('calcPriceDisplay').textContent = '~ ' + price + '${isEn ? '$' : ' € TTC'}';
    }

    function fillFormRequest() {
      const activeOpt = document.querySelector('#calcOptions1 .calc-btn.active')?.textContent || '';
      const msg = document.getElementById('formMsg');
      if (msg) {
        msg.value = '${isEn ? 'Request for ' : 'Demande pour '}' + activeOpt + ' (' + currentVal + ' ' + unitStr + ') — ${isEn ? 'Estimate: ' : 'Estimation : '}' + document.getElementById('calcPriceDisplay').textContent;
      }
    }

    window.addEventListener('message', function(e) {
      if (!e || !e.data) return;
      var d = e.data;
      if (d.type === 'UPDATE_IMAGE' && d.url) {
        var f = d.field;
        if (f === 'hero' || f === 'heroImage') {
          var h = document.getElementById('heroBgImg');
          if (h) h.src = d.url;
        }
        if (f === 'contact' || f === 'contactImage') {
          var c = document.getElementById('contactImg');
          if (c) c.src = d.url;
        }
        var targetEl = document.getElementById(f) || document.querySelector('[data-site-img="' + f + '"]');
        if (targetEl && targetEl.tagName === 'IMG') {
          targetEl.src = d.url;
        }
      }
      if ((d.type === 'PINTEREST_PHOTOS' || d.type === 'UPDATE_ALL_PHOTOS') && Array.isArray(d.photos) && d.photos.length > 0) {
        if (d.photos[0]) {
          var h = document.getElementById('heroBgImg');
          if (h) h.src = d.photos[0];
        }
        if (d.photos[1]) {
          var hs = document.getElementById('heroStatImg');
          if (hs) hs.src = d.photos[1];
        }
        if (d.photos[2]) {
          var cat = document.getElementById('catalogImg');
          if (cat) cat.src = d.photos[2];
        }
        if (d.photos[3]) {
          var ci = document.getElementById('contactImg');
          if (ci) ci.src = d.photos[3];
        }
      }
    });
  </script>
</body>
</html>`;
}
