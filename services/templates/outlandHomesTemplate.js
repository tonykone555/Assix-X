import { detectLanguage, extractCity } from '../siteTemplate.js';

export function buildOutlandHomesTemplate(lead = {}, content = {}, nicheKey = 'realEstate') {
  const currentContent = content || {};
  const lang = detectLanguage(lead, currentContent.language);

  const brandName = (
    currentContent.brandName ||
    lead.name ||
    lead.companyName ||
    lead.company ||
    lead.businessName ||
    (lang === 'fr' ? 'OUTLAND MAISONS' : 'OUTLAND HOMES')
  ).toUpperCase();

  const displayCity = currentContent.city || lead.city || extractCity(lead) || (lang === 'fr' ? 'Paris & Région' : 'Metropolitan Area');
  const displayPhone = currentContent.contactPhone || lead.phone || (lang === 'fr' ? '01 45 67 89 10' : '816-555-0192');
  const phoneHref = displayPhone ? `tel:${displayPhone.replace(/\s+/g, '')}` : 'tel:0145678910';
  const displayEmail = currentContent.contactEmail || lead.email || `contact@${brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'outland'}.com`;
  const displayAddress = currentContent.contactAddress || lead.address || `${displayCity}`;

  const activeNiche = (
    currentContent.nicheOverride ||
    nicheKey ||
    lead.niche ||
    lead.sector ||
    lead.category ||
    'airbnb'
  ).toLowerCase();

  const isAirbnb = activeNiche.includes('airbnb') || activeNiche.includes('vacat') || activeNiche.includes('gîte') || activeNiche.includes('chambre') || activeNiche.includes('real') || activeNiche.includes('immob') || activeNiche.includes('home');
  const isDrivingSchool = activeNiche.includes('auto') || activeNiche.includes('driv') || activeNiche.includes('permis');
  const isRestaurant = activeNiche.includes('restau') || activeNiche.includes('food') || activeNiche.includes('gastro') || activeNiche.includes('caf') || activeNiche.includes('bistr');
  const isElectrician = activeNiche.includes('electr') || activeNiche.includes('électr');
  const isPlumber = activeNiche.includes('plumb') || activeNiche.includes('plomb') || activeNiche.includes('chauff');
  const isLocksmith = activeNiche.includes('lock') || activeNiche.includes('serrur');
  const isCaterer = activeNiche.includes('cater') || activeNiche.includes('trait');
  const isLandscaping = activeNiche.includes('landscap') || activeNiche.includes('paysag') || activeNiche.includes('jardin');
  const isRenovation = activeNiche.includes('renov') || activeNiche.includes('rénov') || activeNiche.includes('bâtiment') || activeNiche.includes('construct');

  // Collect any scraped/user-uploaded photos
  const photoPool = Array.from(new Set([
    ...(currentContent.photos || []),
    ...(currentContent.uploadedImages || []),
    ...(lead.photos || []),
    ...(lead.userUploadedImages || [])
  ])).filter(Boolean);

  const getPhoto = (idx, fallback) => photoPool[idx] || fallback;

  // Niche Default Photos
  let defaultHero = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80';
  let defaultStatThumb = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80';
  let defaultProcessBg = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80';
  let defaultOfficeImg = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
  let defaultCatalog = [
    {
      title: lang === 'fr' ? "MAISON COSY & NATURE" : "COSY HOUSE",
      desc: lang === 'fr' ? "UN CHALET SPACIEUX ET LUMINEUX CONÇU POUR LE CONFORT, LA CHALEUR ET LE CALME. IDÉAL POUR LES SÉJOURS EN FAMILLE ET ENCADREMENTS DE RÊVE." : "A SPACIOUS COTTAGE HOUSE DESIGNED FOR COMFORT, WARMTH AND SLOW LIVING. IDEAL FOR FAMILIES WHO VALUE NATURE, PRIVACY AND QUALITY TIME TOGETHER.",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      features: lang === 'fr' ? ['• 1-GRAND SÉJOUR CUISINE', '• 1-CHEMINÉE COSY', '• 2-CHAMBRES SUITES', '• 1-TERRASSE PANORAMIQUE', '• 1-SPA JACUZZI', '• 2-PLACES PARKING'] : ['• 1-LARGE KITCHEN-LIVING ROOM', '• 1-FIREPLACE', '• 1-BEDROOM', '• 1-TERRACE', '• 1-BATHROOM', '• 2-PARKING SPACES']
    },
    {
      title: lang === 'fr' ? "VILLA FORESTIÈRE" : "FOREST VILLA",
      desc: lang === 'fr' ? "SANCTUAIRE ARCHITECTURAL ISOLÉ NICHÉ AU CŒUR DES PINÈDES. GRANDES BAIES VITRÉES AVEC VUE IMPRENABLE SUR LA NATURE." : "SECLUDED ARCHITECTURAL SANCTUARY NESTLED DEEP WITHIN PINE FORESTS. INTEGRATED PANORAMIC WINDOWS OFFER UNINTERRUPTED NATURE VIEWS.",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
      features: lang === 'fr' ? ['• 4-SUITES DE LUXE', '• 1-PISCINE CHAUFFÉE', '• 1-SALLON PANORAMIQUE', '• 1-ESPACE SAUNA', '• BORNES DE RECHARGE', '• SERVICE CONCIERGERIE'] : ['• 4-LUXURY SUITES', '• 1-HEATED POOL', '• 1-PANORAMIC LOUNGE', '• 1-SAUNA ROOM', '• EV CHARGERS', '• CONCIERGE SERVICE']
    },
    {
      title: lang === 'fr' ? "REFUGE DU LAC" : "LAKE RETREAT",
      desc: lang === 'fr' ? "LOGEMENT ÉCO-CONÇU EN BORD DE LAC AVEC PONTON PRIVÉ, TERRASSE EN BOIS NOBLE ET ÉQUIPEMENTS DE STANDING." : "MODERN MINIMALIST WATERFRONT CABIN FEATURING PRIVATE DOCK ACCESS, NATURAL TIMBER DECKING AND SUSTAINABLE SOLAR INFRASTRUCTURE.",
      img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
      features: lang === 'fr' ? ['• ACCÈS PONTON PRIVÉ', '• KAYAKS & PADDLES', '• 3-CHAMBRES DESIGN', '• BRASEIRO EXTÉRIEUR', '• VUE 360° LAC', '• SYSTEME AUDIO BOSE'] : ['• PRIVATE DOCK ACCESS', '• KAYAKS & PADDLES', '• 3-DESIGN BEDROOMS', '• OUTSIDE FIRE PIT', '• 360° LAKE VIEW', '• BOSE AUDIO SYSTEM']
    },
    {
      title: lang === 'fr' ? "CHALET DES CIMES" : "HILLSIDE HAVEN",
      desc: lang === 'fr' ? "DOMAINE PERCHÉ OFFRANT UNE VUE PANORAMIQUE SUR L'HORIZON, AVEC TERRASSE CHAUFFÉE ET SUITES DE LUXE." : "ELEVATED COTTAGE OFFERING VAST HORIZON VIEWS, EXPANSIVE LIVING ROOMS, AND MODERN HEATED TERRACES FOR YEAR-ROUND COMFORT.",
      img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80",
      features: lang === 'fr' ? ['• SÉJOUR CATHÉDRALE', '• JACUZZI EXTÉRIEUR', '• 3-SALLES DE BAIN', '• SKI/HIKE ROOM', '• SYSTEME DOMOTIQUE', '• ACCÈS SÉCURISÉ'] : ['• CATHEDRAL CEILING', '• OUTDOOR JACUZZI', '• 3-BATHROOMS', '• SKI/HIKE ROOM', '• SMART HOME SYSTEM', '• SECURE ACCESS']
    }
  ];

  let defaultGallery = [
    { img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', caption: lang === 'fr' ? 'Minimaliste, apaisant et raffiné. Chaque espace est pensé comme un refuge privé, élégant et facile à vivre.' : 'Minimal, calm, and refined. Every space is designed to feel like a private retreat — clean, elegant, and easy to maintain.' },
    { img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80', caption: lang === 'fr' ? 'Les espaces de vie s’ouvrent naturellement vers l’extérieur pour privilégier la lumière et la convivialité.' : 'The living area flows naturally into open modern spaces built for warmth and seamless interaction.' },
    { img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80', caption: lang === 'fr' ? 'Des pièces vastes baignées de lumière naturelle, conçues avec du bois noble et des teintes neutres apaisantes.' : 'Spacious rooms filled with natural light, crafted using natural timber accents and neutral tones.' }
  ];

  if (isDrivingSchool) {
    defaultHero = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80';
    defaultStatThumb = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80';
    defaultProcessBg = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1800&q=80';
    defaultOfficeImg = 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80';
    defaultCatalog = [
      { title: lang === 'fr' ? "PERMIS B ACCÉLÉRÉ" : "PERMIT B EXPRESS", desc: lang === 'fr' ? "FORMATION INTENSIVE AVECS MONITEURS DIPLÔMÉS ET VÉHICULES DE DERNIÈRE GÉNÉRATION." : "INTENSIVE DRIVING PROGRAM WITH CERTIFIED INSTRUCTORS AND LATEST VEHICLE FLEET.", img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80", features: lang === 'fr' ? ['• CODE EN LIGNE 24/7', '• HEURES SUR MESURE', '• SUIVI PÉDAGOGIQUE', '• VÉHICULES RÉCENTS'] : ['• 24/7 ONLINE CODE', '• CUSTOM SCHEDULE', '• PEDAGOGICAL TRACKING', '• MODERN FLEET'] },
      { title: lang === 'fr' ? "PERMIS MOTO A1/A2" : "MOTO PERMIT A1/A2", desc: lang === 'fr' ? "STAGE MOTO SUR PISTE PRIVÉE SÉCURISÉE AVEC ÉQUIPEMENT FOURNI." : "MOTORCYCLE TRAINING ON SECURE PRIVATE TRACK WITH EQUIPMENT PROVIDED.", img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80", features: lang === 'fr' ? ['• PISTE PRIVÉE EXCLUSIVE', '• MOTOS RÉCENTES', '• ÉQUIPEMENT SÉCURITÉ', '• EXAMEN RAPIDE'] : ['• PRIVATE TRACK ACCESS', '• RECENT BIKES', '• SAFETY GEAR INCLUDED', '• FAST EXAM DATES'] }
    ];
  } else if (isRestaurant || isCaterer) {
    defaultHero = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80';
    defaultStatThumb = 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80';
    defaultProcessBg = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=80';
    defaultOfficeImg = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
  } else if (isElectrician || isPlumber || isLocksmith || isRenovation) {
    defaultHero = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1800&q=80';
    defaultStatThumb = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80';
    defaultProcessBg = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1800&q=80';
    defaultOfficeImg = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
  }

  // Hero & Base Assets
  const heroBgImg = currentContent.heroImage || getPhoto(0, defaultHero);
  const statCardImg = getPhoto(1, defaultStatThumb);
  const processBgImg = currentContent.section2Video || getPhoto(2, defaultProcessBg);
  const officePreviewImg = currentContent.aboutImage || getPhoto(3, defaultOfficeImg);

  // Parse catalog services
  let catalogItems = defaultCatalog;
  if (currentContent.services && Array.isArray(currentContent.services) && currentContent.services.length > 0) {
    catalogItems = currentContent.services.map((srv, idx) => ({
      title: srv.title ? srv.title.toUpperCase() : `OFFRE #${idx + 1}`,
      desc: srv.description ? srv.description.toUpperCase() : 'PRESTATION HAUT DE GAMME SUR MESURE POUR VOTRE CONFORT.',
      img: srv.image || getPhoto(idx + 2, defaultCatalog[idx % defaultCatalog.length]?.img || defaultHero),
      features: srv.price ? [`• PRICE: ${srv.price}`, '• QUALITY GUARANTEED', '• VIP SUPPORT', '• PREMIUM SERVICE'] : ['• PRESTATION EXCLUSIVE', '• GARANTIE QUALITÉ', '• SUIVI PERSONNALISÉ', '• ACCOMPAGNEMENT 7J/7']
    }));
  }

  // Parse gallery items
  let galleryCards = defaultGallery;
  if (photoPool.length >= 3) {
    galleryCards = [
      { img: photoPool[0], caption: lang === 'fr' ? 'Chaque détail est pensé pour créer une expérience mémorable et élégante.' : 'Every detail is crafted to create a memorable and refined experience.' },
      { img: photoPool[1], caption: lang === 'fr' ? 'Un équilibre parfait entre confort moderne et esthétique haut de gamme.' : 'A perfect balance between modern comfort and high-end aesthetics.' },
      { img: photoPool[2], caption: lang === 'fr' ? 'Des espaces lumineux et chaleureux conçus pour votre bien-être.' : 'Bright and welcoming spaces designed for your well-being.' }
    ];
  }

  // Rich Niche Storytelling Copy Packs
  const getNicheCopy = () => {
    if (isRestaurant || isCaterer) {
      return {
        fr: {
          heroTitle: currentContent.heroSubtitle || 'Une symphonie culinaire guidée par la passion et les produits de saison',
          heroDesc: currentContent.aboutText || currentContent.tagline || 'Laissez-vous transporter par une expérience gastronomique inoubliable où chaque assiette raconte une histoire d’excellence, de fraîcheur et de convivialité.',
          aboutHighlight: (currentContent.aboutTitle || `DEPUIS DES ANNÉES, NOS CHEFS FAÇONNENT DES ASSIETTES SIGNATURES POUR ÉVEILLER VOS SENS ET CÉLÉBRER LE GOÛT.`).toUpperCase(),
          aboutNormal: (currentContent.aboutText || `NOUS SÉLECTIONNONS EXCLUSIVEMENT DES PRODUITS FRAIS, LOCAUX ET DE SAISON POUR DES EXPÉRIENCES CULINAIRES D'EXCEPTION.`).toUpperCase(),
          p1Title: 'SOURCING NOBLE', p1Desc: 'sélection rigoureuse de producteurs locaux et d’ingrédients d’exception.',
          p2Title: 'CRÉATION SIGNATURE', p2Desc: 'élaboration de recettes équilibrées mariant tradition et modernité.',
          p3Title: 'ACCORDS ET DRESSAGE', p3Desc: 'mises en place raffinées et accords mets-vins conçus par nos sommeliers.',
          p4Title: 'SERVICE EN LIGNE', p4Desc: 'accueil chaleureux et expérience sur mesure en salle ou sur événement.',
          galleryHighlight: 'CHAQUE PLAT EST UNE CRÉATION ARTISANALE PENSÉE POUR ÉMERVEILLER VOS PAPILLES.',
          galleryNormal: ' NOUS CRÉONS UNE AMBIANCE CHALEUREUSE ET INTEMPPORELLE POUR VOS MOMENTS D\'EXCEPTION.'
        },
        en: {
          heroTitle: currentContent.heroSubtitle || 'A culinary symphony guided by passion and seasonal ingredients',
          heroDesc: currentContent.aboutText || currentContent.tagline || 'Immerse yourself in an unforgettable dining experience where every dish tells a story of excellence, freshness, and warmth.',
          aboutHighlight: (currentContent.aboutTitle || `FOR YEARS, OUR CHEFS HAVE CRAFTED SIGNATURE DISHES TO AWAKEN YOUR SENSES AND CELEBRATE FINE DINING.`).toUpperCase(),
          aboutNormal: (currentContent.aboutText || `WE EXCLUSIVELY SOURCE FRESH, LOCAL, AND SEASONAL PRODUCE FOR UNRIVALLED GASTRONOMIC MOMENTS.`).toUpperCase(),
          p1Title: 'NOBLE SOURCING', p1Desc: 'rigorous selection of local artisans and premium organic ingredients.',
          p2Title: 'SIGNATURE CRAFT', p2Desc: 'recipes balancing traditional heritage with contemporary flair.',
          p3Title: 'PAIRING & PLATING', p3Desc: 'exquisite presentation and curated wine pairings by our sommelier.',
          p4Title: 'IMPECCABLE SERVICE', p4Desc: 'warm hospitality and bespoke dining in an intimate setting.',
          galleryHighlight: 'EVERY DISH IS AN ARTISANAL CREATION DESIGNED TO DELIGHT YOUR PALATE.',
          galleryNormal: ' WE CRAFT A WARM AND TIMELESS ATMOSPHERE FOR YOUR SPECIAL OCCASIONS.'
        }
      };
    }
    if (isPlumber) {
      return {
        fr: {
          heroTitle: currentContent.heroSubtitle || 'Ingénierie sanitaire & rénovation thermique haute précision',
          heroDesc: currentContent.aboutText || currentContent.tagline || 'De la création de salles de bains d’architecte aux interventions complexes sur réseaux d’eau, nous assurons une maîtrise technique et une sérénité absolue.',
          aboutHighlight: (currentContent.aboutTitle || `VOTRE CONFORT THERMIQUE ET VOTRE TRANQUILLITÉ SONT AU CŒUR DE CHACUNE DE NOS INTERVENTIONS D'ARTISANAT NOBLE.`).toUpperCase(),
          aboutNormal: (currentContent.aboutText || `INTERVENTIONS RAPIDES, MATÉRIAUX DURABLES ETS EXCELLENCE TECHNIQUE GARANTIE SUR CHAQUE CHANTIER.`).toUpperCase(),
          p1Title: 'DIAGNOSTIC HAUTE PRÉCISION', p1Desc: 'inspection approfondie et détection thermique des réseaux.',
          p2Title: 'SCHÉMA ET CONCEPTION', p2Desc: 'plans sur mesure intégrant les meilleures normes énergétiques.',
          p3Title: 'INSTALLATION SOIGNÉE', p3Desc: 'pose d’équipements haute performance et finitions impeccables.',
          p4Title: 'SUIVI ET MAINTENANCE', p4Desc: 'assistance réactive 7j/7 et garantie décennale assurée.',
          galleryHighlight: 'CHAQUE SALLE DE BAINS ET INSTALLATION THERMIQUE EST CONÇUE COMME UN ÉCRIN DE CONFORT.',
          galleryNormal: ' DES RÉSEAUX FIABLES ET PROPRES PENSÉS POUR LA DURABILITÉ.'
        },
        en: {
          heroTitle: currentContent.heroSubtitle || 'High-precision plumbing engineering & thermal renovation',
          heroDesc: currentContent.aboutText || currentContent.tagline || 'From bespoke architectural bathroom fitting to high-pressure network diagnostics, we deliver flawless technical craftsmanship.',
          aboutHighlight: (currentContent.aboutTitle || `YOUR THERMAL COMFORT AND PEACE OF MIND DRIVE EVERY SINGLE ONE OF OUR MASTER CRAFTSMAN INTERVENTIONS.`).toUpperCase(),
          aboutNormal: (currentContent.aboutText || `RAPID EMERGENCY RESPONSE, DURABLE MATERIALS AND GUARANTEED TECHNICAL EXCELLENCE.`).toUpperCase(),
          p1Title: 'PRECISION DIAGNOSTIC', p1Desc: 'thorough inspection and thermal network camera scanning.',
          p2Title: 'BESPOKE BLUEPRINT', p2Desc: 'tailored designs conforming to the highest energy standards.',
          p3Title: 'Meticulous FITTING', p3Desc: 'installation of premium high-performance equipment.',
          p4Title: 'LONG-TERM SUPPORT', p4Desc: 'responsive 24/7 service and comprehensive warranty guarantees.',
          galleryHighlight: 'EVERY BATHROOM AND HEATING INSTALLATION IS BUILT FOR LUXURY COMFORT.',
          galleryNormal: ' CLEAN, RELIABLE PIPELINE NETWORKS DESIGNED TO LAST A LIFETIME.'
        }
      };
    }
    if (isElectrician) {
      return {
        fr: {
          heroTitle: currentContent.heroSubtitle || 'Lumière, domotique d’exception & sécurité électrique indéfectible',
          heroDesc: currentContent.aboutText || currentContent.tagline || 'Sublimez l’architecture de vos intérieurs et sécurisez vos réseaux par une installation électrique intelligente, sobre et parfaitement intégrée.',
          aboutHighlight: (currentContent.aboutTitle || `SOULIGNER ARCHITECTURE ET CONFORT PAR UNE MAÎTRISE ABSOLUE DES ÉNERGIES ET TECHNOLOGIES INTELLIGENTES.`).toUpperCase(),
          aboutNormal: (currentContent.aboutText || `MISE AUX NORMES, DOMOTIQUE SUR MESURE ET ÉCLAIRAGES ARCHITECTURAUX POUR RÉSIDENCES D'EXCEPTION.`).toUpperCase(),
          p1Title: 'AUDIT ÉLECTRIQUE', p1Desc: 'analyse complète du tableau et des consommations d’énergie.',
          p2Title: 'DOMOTIQUE ET DESIGN', p2Desc: 'programmation d’ambiances lumineuses et gestion à distance.',
          p3Title: 'RACCORDEMENT SÉCURISÉ', p3Desc: 'câblage invisible et protection haute tension certifiée.',
          p4Title: 'MISE EN SERVICE', p4Desc: 'tests de sécurité rigoureux et livraison clé en main.',
          galleryHighlight: 'LA LUMIÈRE ET L’ÉNERGIE AU SERVICE DE VOTRE ARCHITECTURE D’INTÉRIEUR.',
          galleryNormal: ' DES INSTALLATIONS SÛRES ET SILENCIEUSES POUR UNE RÉSIDENCE CONNECTÉE.'
        },
        en: {
          heroTitle: currentContent.heroSubtitle || 'Lighting, refined smart home automation & supreme electrical safety',
          heroDesc: currentContent.aboutText || currentContent.tagline || 'Enhance your interior architecture and secure your residence with intelligent, discreetly integrated electrical systems.',
          aboutHighlight: (currentContent.aboutTitle || `ELEVATING ARCHITECTURE AND COMFORT THROUGH MASTERFUL CONTROL OF LIGHTING AND SMART HOME ENERGY.`).toUpperCase(),
          aboutNormal: (currentContent.aboutText || `COMPLIANCE CERTIFICATION, BESPOKE DOMOTICS AND ARCHITECTURAL LIGHTING FOR EXCLUSIVE HOMES.`).toUpperCase(),
          p1Title: 'POWER AUDIT', p1Desc: 'comprehensive panel inspection and smart consumption analysis.',
          p2Title: 'SMART AUTOMATION', p2Desc: 'custom scene programming and remote mobile controls.',
          p3Title: 'SECURE WIRING', p3Desc: 'concealed wiring and certified surge protection.',
          p4Title: 'FINAL COMMISSIONING', p4Desc: 'rigorous safety tests and key-in-hand handovers.',
          galleryHighlight: 'LIGHTING AND POWER CRAFTED TO ENHANCE YOUR ARCHITECTURAL SPACES.',
          galleryNormal: ' SAFE, SILENT, AND SMART INSTALLATIONS FOR FUTURE-PROOF LIVING.'
        }
      };
    }
    if (isDrivingSchool) {
      return {
        fr: {
          heroTitle: currentContent.heroSubtitle || 'L’apprentissage de la conduite avec élégance et pédagogie sur mesure',
          heroDesc: currentContent.aboutText || currentContent.tagline || 'Devenez un conducteur confiant, sûr et responsable grâce à des moniteurs passionnés, des cours sur véhicule moderne et un taux de réussite d’élite.',
          aboutHighlight: (currentContent.aboutTitle || `FORMER DES CONDUCTEURS EXPÉRIMENTÉS ET SEREINS DANS DES CONDITIONS D'APPRENTISSAGE OPTIMALES.`).toUpperCase(),
          aboutNormal: (currentContent.aboutText || `ACCOMPAGNEMENT INDIVIDUEL, PLANNING SOUPLE ETS SUIVI PÉDAGOGIQUE NUMÉRIQUE POUR UN SUCCÈS RAPIDE.`).toUpperCase(),
          p1Title: 'EVALUATION INITIALE', p1Desc: 'bilan personnalisé pour évaluer vos besoins et fixer le planning.',
          p2Title: 'CODE INTENSIF', p2Desc: 'entraînement interactif en salle et plateforme mobile 24/7.',
          p3Title: 'PRATIQUE GUIDÉE', p3Desc: 'leçons de conduite en situation réelle sur flotte récente.',
          p4Title: 'EXAMEN ET PERMIS', p4Desc: 'préparation mentale et technique pour l’obtention du permis.',
          galleryHighlight: 'DES VÉHICULES DE DERNIÈRE GÉNÉRATION POUR UNE EXPÉRIENCE DE CONDUITE SEREINE.',
          galleryNormal: ' UNE PÉDAGOGIE BIENVVEILLANTE ET MODERNE ADAPTÉE À CHAQUE ÉLÈVE.'
        },
        en: {
          heroTitle: currentContent.heroSubtitle || 'Master driving with confidence, modern fleet & elite success rates',
          heroDesc: currentContent.aboutText || currentContent.tagline || 'Become a confident, safety-minded driver with certified instructors, state-of-the-art dual-control vehicles, and flexible scheduling.',
          aboutHighlight: (currentContent.aboutTitle || `TRAINING SAFE, SERENE, AND SKILLED DRIVERS IN OPTIMAL HIGH-STANDARDS LEARNING CONDITIONS.`).toUpperCase(),
          aboutNormal: (currentContent.aboutText || `INDIVIDUAL COACHING, FLEXIBLE HOURS AND DIGITAL PEDAGOGICAL TRACKING FOR FAST SUCCESS.`).toUpperCase(),
          p1Title: 'INITIAL AUDIT', p1Desc: 'personalized evaluation to set your tailored timeline.',
          p2Title: 'THEORY & CODE', p2Desc: 'interactive online modules and 24/7 mobile app practice.',
          p3Title: 'ROAD PRACTICE', p3Desc: 'real-world driving lessons behind modern dual-control steering.',
          p4Title: 'EXAM PASS', p4Desc: 'mental and technical exam prep for smooth licensing.',
          galleryHighlight: 'LATEST GENERATION VEHICLES FOR A SAFE AND COMFORTABLE DRIVING EXPERIENCE.',
          galleryNormal: ' EMPATHETIC, MODERN PEDAGOGY TAILORED TO EVERY SINGLE STUDENT.'
        }
      };
    }
    // Default Airbnb / Luxury Living / Universal
    return {
      fr: {
        heroTitle: currentContent.heroSubtitle || 'Retrouvez votre place en pleine nature & demeures d’exception',
        heroDesc: currentContent.aboutText || currentContent.tagline || 'Nous vous accompagnons dans la réservation et l’achat de résidences d’exception — cachées au cœur des forêts, près des lacs, loin du bruit urbain.',
        aboutHighlight: (currentContent.aboutTitle || `DEPUIS DES ANNÉES, NOUS ACCOMPAGNONS NOS CLIENTS POUR CRÉER DES EXPÉRIENCES UNIQUES ET INOUBLIABLES.`).toUpperCase(),
        aboutNormal: (currentContent.aboutText || `NOUS SOMMES SPÉCIALISÉS DANS L'ACCOMPAGNEMENT HAUT DE GAMME ET SUR MESURE POUR VOTRE TRANQUILLITÉ D'ESPRIT.`).toUpperCase(),
        p1Title: 'RECHERCHE & ÉTUDE', p1Desc: 'analyse approfondie des besoins et sélection rigoureuse pour garantir le meilleur résultat.',
        p2Title: 'STRUCTURE & CONCEPTION', p2Desc: 'élaboration d’un plan d’action clair, intuitif et fluide adapté à vos attentes.',
        p3Title: 'CONCEPT VISUEL', p3Desc: 'design raffiné, finitions soignées et univers harmonieux pour valoriser votre projet.',
        p4Title: 'LIVRAISON FINALE', p4Desc: 'mise en place impeccable pour offrir une expérience sereine et inspirante.',
        galleryHighlight: 'CHAQUE ESPACE EST SOIGNEUSEMENT PENSÉ ET AMÉNAGÉ PAR NOS ARCHITECTES D\'INTÉRIEUR.',
        galleryNormal: ' NOUS CRÉONS DES LIEUX CHALEUREUX, FONCTIONNELS ET PRÊTS À VIVRE.'
      },
      en: {
        heroTitle: currentContent.heroSubtitle || 'Find your place in nature & luxury living sanctuaries',
        heroDesc: currentContent.aboutText || currentContent.tagline || 'We help you rent or own carefully selected properties — hidden in forests, near lakes, far from city noise. A slower way of living.',
        aboutHighlight: (currentContent.aboutTitle || `OVER THE YEARS, WE HAVE BEEN HELPING PEOPLE RECONNECT WITH NATURE THROUGH CAREFULLY SELECTED PROPERTIES.`).toUpperCase(),
        aboutNormal: (currentContent.aboutText || `WE SPECIALISE IN SECLUDED LANDSCAPES AND PREMIUM BESPOKE SERVICES.`).toUpperCase(),
        p1Title: 'RESEARCH & AUDIT', p1Desc: 'deep exploration of client needs and market insights to guarantee elite results.',
        p2Title: 'STRUCTURE & DESIGN', p2Desc: 'a clear roadmap created to make navigation simple, intuitive, and visually comfortable.',
        p3Title: 'VISUAL CONCEPT', p3Desc: 'focusing on minimalism, high imagery, and natural color tones for calm living.',
        p4Title: 'FINAL HANDOVER', p4Desc: 'impeccable setup delivering a serene, inspiring, and turnkey experience.',
        galleryHighlight: 'EVERY SPACE IS THOUGHTFULLY STYLED BY OUR PROFESSIONAL INTERIOR ARCHITECTS.',
        galleryNormal: ' WE CREATE SPACES THAT FEEL WARM, FUNCTIONAL, AND READY TO LIVE IN.'
      }
    };
  };

  const nicheCopy = getNicheCopy()[lang] || getNicheCopy()['en'];

  // i18n Localization Engine
  const i18n = {
    fr: {
      navHome: 'Accueil',
      navAbout: 'À Propos',
      navCatalog: 'Catalogue',
      navContact: 'Contact',
      navFaq: 'FAQ',
      bookViewing: 'Réserver un Sejour / RDV',
      giantWordMain: brandName.split(' ')[0] || 'OUTLAND',
      giantWordSub: brandName.split(' ').slice(1).join(' ') || 'HOMES',
      heroTitle: nicheCopy.heroTitle,
      heroDesc: nicheCopy.heroDesc,
      heroBtn: currentContent.ctaButton || 'Découvrir nos Offres',
      stat1Num: currentContent.stats?.[0]?.value || '+600',
      stat1Sub: currentContent.stats?.[0]?.label || 'clients satisfaits',
      stat2Num: currentContent.stats?.[1]?.value || '328',
      stat2Sub: currentContent.stats?.[1]?.label || 'projets d’exception livrés',
      aboutLabel: 'À PROPOS',
      aboutLeadHighlight: nicheCopy.aboutHighlight,
      aboutLeadNormal: nicheCopy.aboutNormal,
      yearsVal: `${currentContent.yearsInBusiness || 12}+ Ans`,
      yearsDesc: 'Savoir-faire éprouvé et connaissance approfondie du secteur.',
      clientsVal: '1,256+ Clients',
      clientsDesc: 'Fidélisés par la qualité de nos prestations et nos recommandations.',
      expertsVal: '35+ Experts',
      expertsDesc: 'Conseillers dédiés, experts techniques et gestionnaires à votre service.',
      processLabel: 'NOTRE MÉTHODE',
      p1Num: '01', p1Title: nicheCopy.p1Title, p1Desc: nicheCopy.p1Desc,
      p2Num: '02', p2Title: nicheCopy.p2Title, p2Desc: nicheCopy.p2Desc,
      p3Num: '03', p3Title: nicheCopy.p3Title, p3Desc: nicheCopy.p3Desc,
      p4Num: '04', p4Title: nicheCopy.p4Title, p4Desc: nicheCopy.p4Desc,
      catalogLabel: 'CATALOGUE & OFFRES',
      catalogBtn: 'Voir les détails',
      galleryHeadingHighlight: nicheCopy.galleryHighlight,
      galleryHeadingNormal: nicheCopy.galleryNormal,
      trustLabel: 'LA CONFIANCE PAR LE CHOIX',
      trustLead: 'NOUS SOMMES FIERS DE CRÉER DES LIEUX OÙ IL FAIT BON VIVRE. VOICI CE QUE DISENT CEUX QUI NOUS ONT FAIT CONFIANCE.',
      t1Text: '"Une prestation qui a dépassé toutes nos attentes. Ambiance chaleureuse, finitions impeccables et organisation parfaite."',
      t1Author: 'Kateryna M.',
      t2Text: '"Un accompagnement sur mesure d\'un grand grand professionnalisme. Tout était pensé dans les moindres détails pour notre confort."',
      t2Author: 'Alexandre & Victoria',
      t3Text: '"Une équipe réactive et transparente. Le résultat correspond exactement à nos exigences de standing."',
      t3Author: 'Roman B.',
      contactTitle: currentContent.contactTitle || 'PRENDRE CONTACT',
      contactNamePl: 'VOTRE NOM COMPLET',
      contactPhonePl: 'NUMÉRO DE TÉLÉPHONE',
      contactMsgPl: 'VOTRE MESSAGE OU DEMANDE',
      contactBtn: currentContent.contactSubmitText || 'Envoyer la demande',
      contactRightHighlight: 'UN CONSEIL SUR MESURE',
      contactRightText: 'POUR VOTRE PROJET, BÉNÉFICIEZ D’UNE CONSULTATION INDIVIDUELLE OÙ NOUS RÉPONDRONS À TOUTES VOS QUESTIONS.',
      footerRights: `© ${new Date().getFullYear()} ${brandName}. Tous droits réservés.`
    },
    en: {
      navHome: 'Home',
      navAbout: 'About',
      navCatalog: 'Catalog',
      navContact: 'Contact',
      navFaq: 'FAQ',
      bookViewing: 'Book a Viewing / Stay',
      giantWordMain: brandName.split(' ')[0] || 'OUTLAND',
      giantWordSub: brandName.split(' ').slice(1).join(' ') || 'HOMES',
      heroTitle: currentContent.heroSubtitle || 'Find your place in nature',
      heroDesc: currentContent.aboutText || currentContent.tagline || 'We help you rent or own carefully selected properties — hidden in forests, near lakes, far from city noise. A slower way of living.',
      heroBtn: currentContent.ctaButton || 'Explore Properties',
      stat1Num: currentContent.stats?.[0]?.value || '+600',
      stat1Sub: currentContent.stats?.[0]?.label || 'satisfied customers',
      stat2Num: currentContent.stats?.[1]?.value || '328',
      stat2Sub: currentContent.stats?.[1]?.label || 'premium projects & homes delivered',
      aboutLabel: 'ABOUT US',
      aboutLeadHighlight: (currentContent.aboutTitle || `OVER THE YEARS, WE HAVE BEEN HELPING PEOPLE RECONNECT WITH NATURE THROUGH CAREFULLY SELECTED PROPERTIES.`).toUpperCase(),
      aboutLeadNormal: (currentContent.aboutText || `WE SPECIALISE IN SECLUDED LANDSCAPES AND PREMIUM BESPOKE SERVICES.`).toUpperCase(),
      yearsVal: `${currentContent.yearsInBusiness || 12}+ Years`,
      yearsDesc: 'Deep experience and expertise. We understand both the market and lifestyle.',
      clientsVal: '1,256+ Clients',
      clientsDesc: 'Trusted by families, couples and investors across Europe and beyond.',
      expertsVal: '35+ Experts',
      expertsDesc: 'Dedicated advisors, legal specialists and project managers at your service.',
      processLabel: 'DESIGN PROCESS',
      p1Num: '01',
      p1Title: 'RESEARCH',
      p1Desc: 'we explore market insights and analyze user needs to craft tailored solutions.',
      p2Num: '02',
      p2Title: 'STRUCTURE',
      p2Desc: 'a clear roadmap created to make navigation simple, intuitive, and visually comfortable.',
      p3Num: '03',
      p3Title: 'VISUAL CONCEPT',
      p3Desc: 'focusing on minimalism, high imagery, and natural color tones for calm living.',
      p4Num: '04',
      p4Title: 'FINAL DELIVERY',
      p4Desc: 'a clean, modern interface and seamless service highlighting luxury living.',
      catalogLabel: 'CATALOG & OFFERS',
      catalogBtn: 'See details',
      galleryHeadingHighlight: 'EVERY SPACE IS THOUGHTFULLY STYLED BY OUR PROFESSIONAL DESIGNERS.',
      galleryHeadingNormal: ' WE CREATE SPACES THAT FEEL WARM, FUNCTIONAL, AND READY TO LIVE IN.',
      trustLabel: 'TRUST CONFIRMED BY CHOICE',
      trustLead: 'WE ARE PROUD TO CREATE NOT JUST HOUSING, BUT A PLACE FOR A HAPPY LIFE. THIS IS WHAT OUR CLIENTS SAY ABOUT US.',
      t1Text: '"Stay exceeded all expectations. A spacious kitchen-living room with a fireplace creates a special atmosphere of coziness and style."',
      t1Author: 'Kateryna M.',
      t2Text: '"We were looking for living space with harmonious layout and quality materials. Fully met our expectations."',
      t2Author: 'Alexander & Victoria',
      t3Text: '"Location, architecture and dedicated service — all speak to the quality of the project. Exactly what you aspire to."',
      t3Author: 'Roman B.',
      contactTitle: currentContent.contactTitle || 'GET IN TOUCH',
      contactNamePl: 'FULL NAME',
      contactPhonePl: 'PHONE NUMBER',
      contactMsgPl: 'YOUR MESSAGE OR INQUIRY',
      contactBtn: currentContent.contactSubmitText || 'Submit Request',
      contactRightHighlight: 'INDIVIDUAL CONSULTATION',
      contactRightText: 'WHEN MAKING DECISIONS, IT IS IMPORTANT TO BE CONFIDENT. WE INVITE YOU TO AN INDIVIDUAL CONSULTATION.',
      footerRights: `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`
    }
  }[lang] || {};

  // Reviews parser
  const testimonials = (currentContent.testimonials && currentContent.testimonials.length > 0)
    ? currentContent.testimonials
    : [
        { name: i18n.t1Author, text: i18n.t1Text, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
        { name: i18n.t2Author, text: i18n.t2Text, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
        { name: i18n.t3Author, text: i18n.t3Text, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' }
      ];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} — ${i18n.heroTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    /* ==========================================================================
       SYSTEM VARIABLES & BASE STYLES
       ========================================================================== */
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

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      background-color: var(--bg-light);
      color: var(--text-main);
      font-family: var(--font-main);
      overflow-x: hidden;
      line-height: 1.4;
    }

    .container {
      max-width: 1320px;
      margin: 0 auto;
      padding: 0 30px;
    }

    /* ==========================================================================
       SCROLL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    .fade-in {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }

    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .fade-in-delay-1 { transition-delay: 0.15s; }
    .fade-in-delay-2 { transition-delay: 0.3s; }
    .fade-in-delay-3 { transition-delay: 0.45s; }

    /* ==========================================================================
       1. HERO SECTION
       ========================================================================== */
    .hero-section {
      position: relative;
      height: 92vh;
      min-height: 680px;
      margin: 20px;
      border-radius: var(--radius-xl);
      overflow: hidden;
      background: #111;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px 40px;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.85;
      z-index: 1;
      transition: opacity 0.5s ease;
    }

    .nav-bar {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-mark {
      font-weight: 800;
      font-size: 24px;
      letter-spacing: -1px;
    }

    .nav-links {
      display: flex;
      gap: 30px;
      list-style: none;
    }

    .nav-links a {
      color: #fff;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    .nav-links a:hover { opacity: 1; }

    .btn-outline {
      border: 1px solid rgba(255, 255, 255, 0.6);
      background: transparent;
      color: #fff;
      padding: 10px 24px;
      border-radius: 999px;
      font-size: 13px;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: var(--transition-smooth);
      text-decoration: none;
      display: inline-block;
    }

    .btn-outline:hover {
      background: #fff;
      color: var(--text-main);
    }

    .hero-giant-title {
      position: absolute;
      top: 18%;
      left: 40px;
      right: 40px;
      z-index: 2;
      font-size: clamp(60px, 12vw, 180px);
      font-weight: 300;
      letter-spacing: -0.04em;
      line-height: 0.85;
      text-transform: uppercase;
      pointer-events: none;
    }

    .hero-giant-title span {
      display: block;
      text-align: right;
      font-size: 0.45em;
      letter-spacing: -0.02em;
      margin-top: -10px;
    }

    .hero-bottom-content {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .hero-description {
      max-width: 420px;
    }

    .hero-description h2 {
      font-size: 32px;
      font-weight: 400;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }

    .hero-description p {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.5;
      margin-bottom: 24px;
    }

    .btn-white {
      background: #fff;
      color: var(--text-main);
      border: none;
      padding: 14px 28px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .btn-white:hover {
      transform: translateY(-2px);
      background: #f0f0f0;
    }

    .hero-stat-cards {
      display: flex;
      gap: 16px;
    }

    .stat-card-small {
      background: var(--card-cream);
      color: var(--text-main);
      border-radius: 20px;
      padding: 16px 20px;
      min-width: 150px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .stat-card-small h3 { font-size: 24px; font-weight: 700; }
    .stat-card-small p { font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }

    .stat-card-large {
      background: var(--card-cream);
      color: var(--text-main);
      border-radius: 24px;
      padding: 12px;
      width: 220px;
    }

    .stat-card-large img {
      width: 100%;
      height: 110px;
      border-radius: 16px;
      object-fit: cover;
      margin-bottom: 12px;
    }

    .stat-card-large .num { font-size: 26px; font-weight: 700; text-align: center; }
    .stat-card-large .sub { font-size: 10px; color: var(--text-muted); text-align: center; line-height: 1.2; margin-top: 4px; }

    /* ==========================================================================
       2. ABOUT SECTION
       ========================================================================== */
    .section-padding { padding: 100px 0; }

    .section-grid {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 40px;
    }

    .section-label {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .about-lead-text {
      font-size: clamp(22px, 2.5vw, 32px);
      font-weight: 400;
      line-height: 1.3;
      color: var(--text-muted);
      margin-bottom: 60px;
      text-transform: uppercase;
    }

    .about-lead-text span { color: var(--text-main); }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }

    .stat-item h3 { font-size: 36px; font-weight: 700; margin-bottom: 8px; }
    .stat-item p { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

    /* ==========================================================================
       3. DESIGN PROCESS SECTION
       ========================================================================== */
    .process-section {
      position: relative;
      min-height: 600px;
      border-radius: var(--radius-xl);
      overflow: hidden;
      margin: 40px 20px;
      padding: 60px 40px;
      background: #efefec;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .process-bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
    }

    .process-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(2px);
      z-index: 2;
    }

    .process-header {
      position: relative;
      z-index: 5;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .process-grid {
      position: relative;
      z-index: 5;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 80px;
    }

    .process-card {
      background: #fafaf7;
      border-radius: var(--radius-lg);
      padding: 30px 24px;
      height: 320px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    }

    .process-card.offset { transform: translateY(-30px); }

    .card-num { font-size: 20px; font-weight: 600; }
    .card-title { font-size: 18px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
    .card-desc { font-size: 11px; color: var(--text-muted); line-height: 1.4; text-transform: lowercase; }

    /* ==========================================================================
       4. CATALOG SLIDER SECTION
       ========================================================================== */
    .catalog-card {
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      padding: 50px 0;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 60px;
      align-items: center;
    }

    .catalog-img-container {
      width: 100%;
      height: 420px;
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .catalog-img-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease;
    }

    .catalog-info h2 {
      font-size: 48px;
      font-weight: 400;
      text-transform: uppercase;
      margin-bottom: 16px;
      letter-spacing: -1px;
    }

    .catalog-info p {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 30px;
      text-transform: uppercase;
    }

    .features-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 24px;
      list-style: none;
      margin-bottom: 40px;
    }

    .features-list li {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .btn-dark {
      background: var(--bg-dark);
      color: #fff;
      border: none;
      padding: 14px 32px;
      border-radius: 999px;
      font-size: 12px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: background 0.2s ease;
    }

    .btn-dark:hover {
      background: #000;
    }

    /* Slider Dots */
    .slider-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 30px;
    }

    .dot {
      width: 32px;
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .dot.active { background: var(--bg-dark); }

    /* ==========================================================================
       5. AUTOMATIC CONTINUOUS IMAGE CAROUSEL
       ========================================================================== */
    .horizontal-slider-section {
      padding: 60px 0;
      overflow: hidden;
    }

    .slider-heading {
      font-size: clamp(18px, 2vw, 24px);
      text-transform: uppercase;
      color: var(--text-muted);
      max-width: 700px;
      margin-left: 280px;
      margin-bottom: 40px;
      line-height: 1.3;
    }

    .slider-heading span { color: var(--text-main); }

    .track-wrapper {
      display: flex;
      gap: 24px;
      width: max-content;
      animation: infiniteScroll 25s linear infinite;
    }

    .track-wrapper:hover { animation-play-state: paused; }

    @keyframes infiniteScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .gallery-card {
      width: 440px;
      flex-shrink: 0;
    }

    .gallery-card img {
      width: 100%;
      height: 280px;
      border-radius: var(--radius-lg);
      object-fit: cover;
      margin-bottom: 12px;
    }

    .gallery-card caption {
      display: block;
      font-size: 12px;
      color: var(--text-muted);
      text-align: left;
    }

    /* ==========================================================================
       6. REVIEWS / TESTIMONIALS SLIDER
       ========================================================================== */
    .testimonial-card {
      background: #333333;
      color: #fff;
      border-radius: var(--radius-lg);
      padding: 30px;
      width: 360px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 220px;
    }

    .testimonial-card p {
      font-size: 12px;
      line-height: 1.5;
      color: #d1d1d1;
    }

    .author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .author img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }

    .author-name { font-size: 13px; font-weight: 600; }

    /* ==========================================================================
       7. CONTACT FORM SECTION
       ========================================================================== */
    .contact-card {
      background: var(--bg-dark);
      color: #fff;
      border-radius: var(--radius-xl);
      padding: 80px 60px 40px;
      margin: 40px 20px;
      position: relative;
    }

    .contact-title {
      font-size: clamp(50px, 8vw, 110px);
      font-weight: 300;
      letter-spacing: -0.03em;
      text-transform: uppercase;
      margin-bottom: 60px;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: flex-start;
    }

    .input-group {
      margin-bottom: 30px;
    }

    .input-field {
      width: 100%;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(255,255,255,0.3);
      padding: 12px 0;
      color: #fff;
      font-family: var(--font-main);
      font-size: 12px;
      letter-spacing: 1px;
      text-transform: uppercase;
      outline: none;
      transition: border-color 0.3s;
    }

    .input-field:focus { border-bottom-color: #fff; }

    .contact-text-right {
      font-size: 13px;
      color: #aaaaaa;
      line-height: 1.6;
      text-transform: uppercase;
    }

    .contact-text-right span { color: #fff; }

    .office-preview-img {
      width: 100%;
      height: 120px;
      border-radius: 16px;
      object-fit: cover;
      margin-top: 30px;
    }

    .footer-bar {
      margin-top: 80px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #777;
    }

    .footer-links a {
      color: #777;
      text-decoration: none;
      margin-left: 20px;
    }

    @media (max-width: 900px) {
      .hero-section { height: auto; min-height: 560px; padding: 20px; }
      .hero-bottom-content { flex-direction: column; align-items: flex-start; gap: 24px; }
      .hero-stat-cards { width: 100%; flex-wrap: wrap; }
      .stat-card-large { width: 100%; }
      .section-grid { grid-template-columns: 1fr; gap: 20px; }
      .stats-row { grid-template-columns: 1fr; gap: 24px; }
      .process-grid { grid-template-columns: 1fr; gap: 16px; margin-top: 30px; }
      .process-card.offset { transform: none; }
      .catalog-card { grid-template-columns: 1fr; gap: 30px; }
      .catalog-img-container { height: 260px; }
      .contact-grid { grid-template-columns: 1fr; gap: 30px; }
      .slider-heading { margin-left: 0; }
      .hero-giant-title { top: 22%; left: 20px; right: 20px; font-size: clamp(40px, 10vw, 90px); }
      .nav-links { display: none; }
      .contact-card { padding: 40px 24px 24px; margin: 20px 10px; }
    }
  </style>
</head>
<body>

  <!-- 1. HERO SECTION -->
  <section class="hero-section" id="home">
    <img class="hero-bg" id="heroBgImg" src="${heroBgImg}" alt="${brandName}">
    
    <nav class="nav-bar">
      <div class="logo-mark">${brandName.charAt(0) || '▲'}</div>
      <ul class="nav-links">
        <li><a href="#home">${i18n.navHome}</a></li>
        <li><a href="#about">${i18n.navAbout}</a></li>
        <li><a href="#catalog">${i18n.navCatalog}</a></li>
        <li><a href="#contact">${i18n.navContact}</a></li>
      </ul>
      <a href="#contact" class="btn-outline">${i18n.bookViewing}</a>
    </nav>

    <div class="hero-giant-title fade-in">
      ${i18n.giantWordMain}
      <span>${i18n.giantWordSub}</span>
    </div>

    <div class="hero-bottom-content fade-in fade-in-delay-1">
      <div class="hero-description">
        <h2>${i18n.heroTitle}</h2>
        <p>${i18n.heroDesc}</p>
        <a href="#catalog" class="btn-white">${i18n.heroBtn}</a>
      </div>

      <div class="hero-stat-cards">
        <div class="stat-card-small">
          <h3>${i18n.stat1Num}</h3>
          <p>${i18n.stat1Sub}</p>
        </div>
        <div class="stat-card-large">
          <img src="${statCardImg}" alt="Feature thumbnail">
          <div class="num">${i18n.stat2Num}</div>
          <div class="sub">${i18n.stat2Sub}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. ABOUT SECTION -->
  <section class="section-padding container" id="about">
    <div class="section-grid">
      <div class="section-label fade-in">${i18n.aboutLabel}</div>
      <div>
        <p class="about-lead-text fade-in fade-in-delay-1">
          <span>${i18n.aboutLeadHighlight}</span> ${i18n.aboutLeadNormal}
        </p>

        <div class="stats-row fade-in fade-in-delay-2">
          <div class="stat-item">
            <h3>${i18n.yearsVal}</h3>
            <p>${i18n.yearsDesc}</p>
          </div>
          <div class="stat-item">
            <h3>${i18n.clientsVal}</h3>
            <p>${i18n.clientsDesc}</p>
          </div>
          <div class="stat-item">
            <h3>${i18n.expertsVal}</h3>
            <p>${i18n.expertsDesc}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. DESIGN PROCESS SECTION -->
  <section class="process-section">
    <img class="process-bg-img" src="${processBgImg}" alt="Process Background">
    <div class="process-overlay"></div>

    <div class="process-header fade-in">${i18n.processLabel}</div>

    <div class="process-grid">
      <div class="process-card fade-in fade-in-delay-1">
        <div class="card-num">${i18n.p1Num}</div>
        <div>
          <div class="card-title">${i18n.p1Title}</div>
          <div class="card-desc">${i18n.p1Desc}</div>
        </div>
      </div>

      <div class="process-card offset fade-in fade-in-delay-2">
        <div class="card-num">${i18n.p2Num}</div>
        <div>
          <div class="card-title">${i18n.p2Title}</div>
          <div class="card-desc">${i18n.p2Desc}</div>
        </div>
      </div>

      <div class="process-card fade-in fade-in-delay-1">
        <div class="card-num">${i18n.p3Num}</div>
        <div>
          <div class="card-title">${i18n.p3Title}</div>
          <div class="card-desc">${i18n.p3Desc}</div>
        </div>
      </div>

      <div class="process-card offset fade-in fade-in-delay-2">
        <div class="card-num">${i18n.p4Num}</div>
        <div>
          <div class="card-title">${i18n.p4Title}</div>
          <div class="card-desc">${i18n.p4Desc}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. CATALOG SECTION -->
  <section class="section-padding container" id="catalog">
    <div class="section-label fade-in" style="margin-bottom: 40px;">${i18n.catalogLabel}</div>

    <div class="catalog-card fade-in">
      <div class="catalog-img-container">
        <img id="catalogImg" src="${catalogItems[0]?.img || defaultHero}" alt="Catalog Feature">
      </div>

      <div class="catalog-info">
        <h2 id="catalogTitle">${catalogItems[0]?.title || 'COSY HOUSE'}</h2>
        <p id="catalogDesc">${catalogItems[0]?.desc || 'SPACIOUS COTTAGE DESIGNED FOR COMFORT AND SLOW LIVING.'}</p>

        <ul class="features-list" id="catalogFeatures">
          ${(catalogItems[0]?.features || []).map(f => `<li>${f}</li>`).join('')}
        </ul>

        <a href="#contact" class="btn-dark">${i18n.catalogBtn}</a>
      </div>
    </div>

    <div class="slider-dots">
      ${catalogItems.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}" onclick="switchCatalog(${i})"></div>`).join('')}
    </div>
  </section>

  <!-- 5. HORIZONTAL CONTINUOUS IMAGE CAROUSEL -->
  <section class="horizontal-slider-section">
    <div class="slider-heading fade-in">
      <span>${i18n.galleryHeadingHighlight}</span> ${i18n.galleryHeadingNormal}
    </div>

    <!-- Infinite Scrolling Track -->
    <div class="track-wrapper">
      ${galleryCards.map(g => `
        <div class="gallery-card">
          <img src="${g.img}" alt="Gallery item">
          <caption>${g.caption}</caption>
        </div>
      `).join('')}
      <!-- Duplicate elements for infinite loop -->
      ${galleryCards.map(g => `
        <div class="gallery-card">
          <img src="${g.img}" alt="Gallery item">
          <caption>${g.caption}</caption>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- 6. REVIEWS / TESTIMONIALS SLIDER -->
  <section class="section-padding container">
    <div class="section-grid">
      <div class="section-label fade-in">${i18n.trustLabel}</div>
      <div>
        <p class="about-lead-text fade-in" style="margin-bottom: 30px;">
          ${i18n.trustLead}
        </p>

        <div style="overflow: hidden; width: 100%;">
          <div class="track-wrapper" style="animation-duration: 35s;">
            ${testimonials.map(t => `
              <div class="testimonial-card">
                <p>${t.text}</p>
                <div class="author">
                  <img src="${t.avatar}" alt="${t.name}">
                  <div class="author-name">${t.name}</div>
                </div>
              </div>
            `).join('')}
            <!-- Loop Duplicates -->
            ${testimonials.map(t => `
              <div class="testimonial-card">
                <p>${t.text}</p>
                <div class="author">
                  <img src="${t.avatar}" alt="${t.name}">
                  <div class="author-name">${t.name}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. CONTACT FORM SECTION -->
  <section class="contact-card" id="contact">
    <div class="contact-title fade-in">${i18n.contactTitle}</div>

    <div class="contact-grid">
      <form class="fade-in fade-in-delay-1" onsubmit="event.preventDefault(); alert('${lang === 'fr' ? 'Merci ! Votre demande a bien été envoyée. Nous vous recontactons sous peu.' : 'Thank you! Your request has been sent successfully.'}');">
        <div class="input-group">
          <input type="text" class="input-field" placeholder="${i18n.contactNamePl}" required>
        </div>
        <div class="input-group">
          <input type="tel" class="input-field" placeholder="${i18n.contactPhonePl}" required>
        </div>
        <div class="input-group">
          <input type="text" class="input-field" placeholder="${i18n.contactMsgPl}">
        </div>
        <button type="submit" class="btn-white" style="margin-top: 20px;">${i18n.contactBtn}</button>
      </form>

      <div class="contact-text-right fade-in fade-in-delay-2">
        ${i18n.contactRightText} <span>${i18n.contactRightHighlight}</span>.
        <br><br>
        <strong>${displayPhone}</strong> — <a href="mailto:${displayEmail}" style="color: inherit;">${displayEmail}</a>
        <br>
        <span style="font-size: 11px; opacity: 0.8;">${displayAddress}</span>

        <img class="office-preview-img" src="${officePreviewImg}" alt="Office Studio">
      </div>
    </div>

    <div class="footer-bar">
      <div>${brandName}</div>
      <div>${i18n.footerRights}</div>
      <div class="footer-links">
        <a href="#about">${i18n.navAbout}</a>
        <a href="#catalog">${i18n.navCatalog}</a>
        <a href="#contact">${i18n.navContact}</a>
      </div>
    </div>
  </section>

  <!-- JS ANIMATIONS & AUTOMATED SLIDERS -->
  <script>
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 2. Interactive Catalog Carousel Data
    const catalogData = ${JSON.stringify(catalogItems)};

    let currentCatalogIndex = 0;

    function switchCatalog(index) {
      if (!catalogData || catalogData.length === 0) return;
      currentCatalogIndex = index % catalogData.length;
      const data = catalogData[currentCatalogIndex];
      
      const imgEl = document.getElementById('catalogImg');
      const titleEl = document.getElementById('catalogTitle');
      const descEl = document.getElementById('catalogDesc');
      const featuresEl = document.getElementById('catalogFeatures');

      if (imgEl) {
        imgEl.style.opacity = '0';
        setTimeout(() => {
          imgEl.src = data.img;
          if (titleEl) titleEl.textContent = data.title;
          if (descEl) descEl.textContent = data.desc;
          if (featuresEl && data.features) {
            featuresEl.innerHTML = data.features.map(f => '<li>' + f + '</li>').join('');
          }
          imgEl.style.opacity = '1';
        }, 200);
      }

      const dots = document.querySelectorAll('.slider-dots .dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentCatalogIndex);
      });
    }

    // Auto-advance catalog slider every 5 seconds
    setInterval(() => {
      if (catalogData && catalogData.length > 1) {
        currentCatalogIndex = (currentCatalogIndex + 1) % catalogData.length;
        switchCatalog(currentCatalogIndex);
      }
    }, 5000);

    // 3. PostMessage Handler for Live Image & Text Analysis Modifications
    window.addEventListener('message', function(event) {
      if (!event.data) return;
      var data = event.data;
      if (data.type === 'UPDATE_IMAGE' && data.field) {
        if (data.field === 'heroImage' && data.url) {
          var bg = document.getElementById('heroBgImg');
          if (bg) bg.src = data.url;
        }
        if (data.field === 'aboutImage' && data.url) {
          var office = document.querySelector('.office-preview-img');
          if (office) office.src = data.url;
        }
      }
    });
  </script>
</body>
</html>`;
}
