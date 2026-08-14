import { detectLanguage, extractCity } from '../siteTemplate.js';

export function buildDrivingSchoolTemplate(lead = {}, content = {}, nicheKey = 'autoecole') {
  const currentContent = content || {};
  const lang = detectLanguage(lead, currentContent.language);

  const brandName = lead.name || lead.companyName || lead.company || lead.businessName || 'Mustang+ Academy & Services';
  const displayCity = lead.city || extractCity(lead) || (lang === 'fr' ? 'Paris' : 'Metropolitan Area');
  const displayPhone = lead.phone || (lang === 'fr' ? '01 45 67 89 10' : '816-555-0192');
  const phoneHref = lead.phone ? `tel:${lead.phone}` : 'tel:0145678910';
  const displayEmail = lead.email || `contact@${brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.fr`;
  const displayAddress = lead.address || `${displayCity}, France`;

  const activeNiche = (
    currentContent.nicheOverride ||
    nicheKey ||
    lead.niche ||
    lead.sector ||
    lead.category ||
    ''
  ).toLowerCase();

  const isDrivingSchool = activeNiche.includes('auto') || activeNiche.includes('driv') || activeNiche.includes('permis');
  const isRestaurant = activeNiche.includes('restau') || activeNiche.includes('food') || activeNiche.includes('gastro') || activeNiche.includes('caf');
  const isElectrician = activeNiche.includes('electr') || activeNiche.includes('électr');
  const isPlumber = activeNiche.includes('plumb') || activeNiche.includes('plomb') || activeNiche.includes('chauff');
  const isLocksmith = activeNiche.includes('lock') || activeNiche.includes('serrur');
  const isCaterer = activeNiche.includes('cater') || activeNiche.includes('trait');
  const isLandscaping = activeNiche.includes('landscap') || activeNiche.includes('paysag') || activeNiche.includes('jardin');
  const isRenovation = activeNiche.includes('renov') || activeNiche.includes('rénov') || activeNiche.includes('bâtiment') || activeNiche.includes('construct');

  // Niche Default Images (High Quality & Reliable)
  let defaultHero = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80';
  let defaultShowcase = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80';
  let defaultProg1 = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
  let defaultProg2 = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80';
  let defaultProg3 = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80';
  let defaultProg4 = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80';
  let defaultCard1 = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80';
  let defaultCard2 = 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80';
  let defaultCard3 = 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80';
  let defaultSafety = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80';

  if (isRestaurant) {
    defaultHero = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80';
    defaultShowcase = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80';
    defaultProg1 = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
    defaultProg2 = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
    defaultProg3 = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80';
    defaultProg4 = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';
    defaultCard1 = 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80';
    defaultCard2 = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';
    defaultCard3 = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80';
    defaultSafety = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80';
  } else if (isElectrician) {
    defaultHero = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80';
    defaultShowcase = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80';
    defaultProg1 = 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80';
    defaultProg2 = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=600&q=80';
    defaultProg3 = 'https://images.unsplash.com/photo-1565538810844-1e119412e8d0?auto=format&fit=crop&w=600&q=80';
    defaultProg4 = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
    defaultCard1 = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80';
    defaultCard2 = 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80';
    defaultCard3 = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=600&q=80';
    defaultSafety = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
  } else if (isPlumber) {
    defaultHero = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80';
    defaultShowcase = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80';
    defaultProg1 = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80';
    defaultProg2 = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80';
    defaultProg3 = 'https://images.unsplash.com/photo-1581094128506-45a4b0824927?auto=format&fit=crop&w=600&q=80';
    defaultProg4 = 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80';
    defaultCard1 = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80';
    defaultCard2 = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80';
    defaultCard3 = 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80';
    defaultSafety = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80';
  } else if (isLocksmith) {
    defaultHero = 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=80';
    defaultShowcase = 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=80';
    defaultProg1 = 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80';
    defaultProg2 = 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&w=600&q=80';
    defaultProg3 = 'https://images.unsplash.com/photo-1618579895756-cbfd52a20ca2?auto=format&fit=crop&w=600&q=80';
    defaultProg4 = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80';
    defaultCard1 = 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80';
    defaultCard2 = 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80';
    defaultCard3 = 'https://images.unsplash.com/photo-1618579895756-cbfd52a20ca2?auto=format&fit=crop&w=600&q=80';
    defaultSafety = 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&w=800&q=80';
  } else if (isCaterer) {
    defaultHero = 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=80';
    defaultShowcase = 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80';
    defaultProg1 = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';
    defaultProg2 = 'https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?auto=format&fit=crop&w=600&q=80';
    defaultProg3 = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
    defaultProg4 = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80';
    defaultCard1 = 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80';
    defaultCard2 = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';
    defaultCard3 = 'https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?auto=format&fit=crop&w=600&q=80';
    defaultSafety = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
  } else if (isLandscaping) {
    defaultHero = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80';
    defaultShowcase = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80';
    defaultProg1 = 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=600&q=80';
    defaultProg2 = 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12765?auto=format&fit=crop&w=600&q=80';
    defaultProg3 = 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=600&q=80';
    defaultProg4 = 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80';
    defaultCard1 = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80';
    defaultCard2 = 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=600&q=80';
    defaultCard3 = 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12765?auto=format&fit=crop&w=600&q=80';
    defaultSafety = 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=800&q=80';
  } else if (isRenovation) {
    defaultHero = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80';
    defaultShowcase = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80';
    defaultProg1 = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
    defaultProg2 = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80';
    defaultProg3 = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80';
    defaultProg4 = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
    defaultCard1 = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80';
    defaultCard2 = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
    defaultCard3 = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80';
    defaultSafety = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';
  }

  const heroImage = currentContent.heroImage || currentContent.heroImg || currentContent.bgImage || defaultHero;
  const heroVideo = currentContent.heroVideo || currentContent.videoUrl || currentContent.heroMedia || currentContent.video || (
    typeof heroImage === 'string' && (
      heroImage.endsWith('.mp4') || heroImage.endsWith('.webm') || heroImage.endsWith('.mov') ||
      heroImage.includes('video') || heroImage.includes('youtube') || heroImage.includes('vimeo')
    ) ? heroImage : null
  );

  const showcaseCarImage = currentContent.showcaseCarImage || currentContent.showcaseCutout || currentContent.cutoutImage || currentContent.carCutout || currentContent.heroCarImage || defaultShowcase;
  const showcaseVideo = currentContent.showcaseVideo || (
    typeof showcaseCarImage === 'string' && (
      showcaseCarImage.endsWith('.mp4') || showcaseCarImage.endsWith('.webm') ||
      showcaseCarImage.includes('youtube') || showcaseCarImage.includes('vimeo')
    ) ? showcaseCarImage : null
  );

  const notebookImage = currentContent.program1Image || currentContent.notebookImage || currentContent.theoryImage || defaultProg1;
  const tabletImage = currentContent.program2Image || currentContent.tabletImage || currentContent.ipadImage || currentContent.onlineCodeImage || defaultProg2;
  const steeringWheelImage = currentContent.program3Image || currentContent.steeringWheelImage || currentContent.practiceImage || defaultProg3;
  const motorcycleImage = currentContent.program4Image || currentContent.motorcycleImage || currentContent.motoImage || currentContent.trackMotoImage || defaultProg4;

  const autoCarImage = currentContent.autoCarImage || currentContent.card1Image || currentContent.automaticImage || defaultCard1;
  const manualCarImage = currentContent.manualCarImage || currentContent.card2Image || currentContent.mustangImage || defaultCard2;
  const motoAcademyImage = currentContent.motoAcademyImage || currentContent.card3Image || currentContent.motoLicenseImage || defaultCard3;

  const safetyImage = currentContent.safetyImage || currentContent.fleetSafetyImage || defaultSafety;

  const stopSignImage = currentContent.stopSignImage || 'https://cdn-icons-png.flaticon.com/512/564/564619.png';
  const licenseIcon = currentContent.licenseIcon || 'https://cdn-icons-png.flaticon.com/512/1570/1570887.png';
  const trafficLightIcon = currentContent.trafficLightIcon || 'https://cdn-icons-png.flaticon.com/512/814/814588.png';
  const speedLimitIcon = currentContent.speedLimitIcon || 'https://cdn-icons-png.flaticon.com/512/876/876204.png';
  const mapIframeUrl = currentContent.mapUrl || `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.96777320147!2d2.2770198486328125!3d48.858837700000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2s${encodeURIComponent(displayCity)}!5e0!3m2!1s${lang}!2sfr`;

  // Dynamic Hero Media (Video vs Image)
  let heroMediaHTML = `<img class="hero-bg" id="mainHeroImg" src="${heroImage}" alt="${brandName} Background">`;
  if (heroVideo) {
    if (heroVideo.includes('youtube.com') || heroVideo.includes('youtu.be')) {
      let videoId = '';
      if (heroVideo.includes('youtu.be/')) videoId = heroVideo.split('youtu.be/')[1].split('?')[0];
      else if (heroVideo.includes('v=')) videoId = heroVideo.split('v=')[1].split('&')[0];
      else if (heroVideo.includes('embed/')) videoId = heroVideo.split('embed/')[1].split('?')[0];
      if (videoId) {
        heroMediaHTML = `<iframe class="hero-bg" id="mainHeroIframe" src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&autohide=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="object-fit:cover; pointer-events:none; width:100%; height:100%; border:none;"></iframe>`;
      }
    } else if (heroVideo.includes('vimeo.com')) {
      const vimeoId = heroVideo.split('vimeo.com/')[1]?.split('?')[0];
      if (vimeoId) {
        heroMediaHTML = `<iframe class="hero-bg" id="mainHeroIframe" src="https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="object-fit:cover; pointer-events:none; width:100%; height:100%; border:none;"></iframe>`;
      }
    } else {
      heroMediaHTML = `<video class="hero-bg" id="mainHeroVideo" autoplay loop muted playsinline poster="${heroImage}">
        <source src="${heroVideo}" type="video/mp4">
        <source src="${heroVideo}" type="video/webm">
        <img src="${heroImage}" class="hero-bg" alt="${brandName}">
      </video>`;
    }
  }

  // Dynamic Showcase Cutout (Video or Image)
  let showcaseCutoutHTML = `<img class="car-cutout" id="showcaseCarImg" src="${showcaseCarImage}" alt="Showcase Cutout">`;
  if (showcaseVideo) {
    if (showcaseVideo.includes('youtube.com') || showcaseVideo.includes('youtu.be')) {
      let vId = '';
      if (showcaseVideo.includes('youtu.be/')) vId = showcaseVideo.split('youtu.be/')[1].split('?')[0];
      else if (showcaseVideo.includes('v=')) vId = showcaseVideo.split('v=')[1].split('&')[0];
      if (vId) showcaseCutoutHTML = `<div class="car-cutout" style="height:320px; border-radius:24px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.3);"><iframe id="showcaseIframe" src="https://www.youtube.com/embed/${vId}?autoplay=1&mute=1&loop=1&playlist=${vId}&controls=0" frameborder="0" allow="autoplay; encrypted-media" style="width:100%; height:100%; border:none;"></iframe></div>`;
    } else {
      showcaseCutoutHTML = `<video class="car-cutout" id="showcaseVideo" autoplay loop muted playsinline style="height:320px; object-fit:cover; border-radius:24px; box-shadow:0 20px 40px rgba(0,0,0,0.3);"><source src="${showcaseVideo}" type="video/mp4"></video>`;
    }
  }

  // Niche-specific Copy Dictionaries
  let nicheDefaults = {
    tag1: 'Expertise 2026',
    tag2: 'Service Premium',
    tag3: '100% Satisfait',
    heroTitle: `${brandName}<br>Service & Réalisations d'Excellence`,
    bookNow: 'PRENDRE RENDEZ-VOUS',
    heroSubtext: 'Découvrez notre savoir-faire d\'exception et bénéficiez d\'un accompagnement sur-mesure.',
    showcaseLabel: 'Présentation de notre entreprise',
    stat1Title: 'Taux de Satisfaction 99%',
    stat1Sub: 'Un travail soigné et des interventions garanties.',
    stat2Title: 'Artisans Qualifiés',
    stat2Sub: 'Équipe diplômée et expérimentée.',
    stat3Title: 'Intervention Rapide',
    stat3Sub: 'Prise en charge réactive à ' + displayCity,
    prog1Title: 'Prestation 1',
    prog1Sub: 'Services sur-mesure adaptés à vos besoins.',
    prog2Title: 'Devis en Ligne 24/7',
    prog2Sub: 'Demandez votre devis gratuit en quelques secondes.',
    prog3Title: 'Prestation 2',
    prog3Sub: 'Travail de haute précision et équipements professionnels.',
    prog4Title: 'Prestation 3',
    prog4Sub: 'Garantie et suivi personnalisé.',
    catTitle: 'Nos Offres & Solutions',
    catSub: 'Sélectionnez la formule adaptée à votre projet.',
    tabCar: 'Particuliers',
    tabMoto: 'Professionnels',
    card1Badge: 'FORMULE ESSENTIELLE',
    card1Title: 'Service Clé en Main',
    card1Sub: 'Intervention rapide et complète.',
    card1Btn: 'Sélectionner Essentiel',
    card2Badge: 'FORMULE CONFORT',
    card2Title: 'Accompagnement Sur-Mesure',
    card2Sub: 'Prestation haut de gamme personnalisée.',
    card2Btn: 'Sélectionner Confort',
    card3Badge: 'FORMULE PRESTIGE',
    card3Title: 'Projets Spéciaux',
    card3Sub: 'Service prioritaire et garanties étendues.',
    card3Btn: 'Sélectionner Prestige',
    frenchSectionTag: 'Garanties & Certifications',
    frenchSectionTitle: 'Spécificités & Engagement Qualité',
    frenchSectionSub: 'Bénéficiez de toutes nos garanties professionnelles.',
    cpfTitle: 'Assurance & Garanties',
    cpfSub: 'Travaux couverts et respect des normes en vigueur.',
    oneEuroTitle: 'Devis Gratuit Sans Engagement',
    oneEuroSub: 'Estimation claire et transparente sous 24h.',
    aacTitle: 'Disponibilité 7j/7',
    aacSub: 'Intervention urgente ou sur rendez-vous.',
    qualiopiTitle: 'Entreprise Certifiée & Agréée',
    safetyTag: 'Sécurité & Qualité',
    safetyTitle: 'Équipements & Normes de Haute Sécurité',
    safetySub: 'Nos équipes interviennent avec du matériel professionnel homologué.',
    statSafety1: '5 Étoiles',
    statSafety1Sub: 'Avis Clients Vérifiés',
    statSafety2: '100%',
    statSafety2Sub: 'Engagement Qualité',
    priceTitle: 'Tarifs & Forfaits Transparents',
    priceSub: 'Des prix clairs sans aucun frais caché.',
    pack1Title: 'Forfait Starter',
    pack1Sub: 'Idéal pour petits projets et urgences',
    pack1Price: '190 €',
    pack1Feat1: 'Déplacement & Diagnostic',
    pack1Feat2: 'Intervention Rapide',
    pack1Feat3: 'Matériel Inclus',
    pack1Feat4: 'Garantie Pièces & Main d\'Œuvre',
    pack1Btn: 'Réserver Starter',
    pack2Title: 'Forfait Complet',
    pack2Sub: 'Solution recommandée pour votre projet',
    pack2Price: '490 €',
    pack2Feat1: 'Prestation Complète Clé en Main',
    pack2Feat2: 'Devis Détaillé Offert',
    pack2Feat3: 'Garantie Décennale / Professionnelle',
    pack2Feat4: 'Suivi Dédié',
    pack2Btn: 'Réserver Complet',
    pack3Title: 'Forfait Sur-Mesure',
    pack3Sub: 'Pour grands projets et rénovations',
    pack3Price: '990 €',
    pack3Feat1: 'Étude Personnalisée',
    pack3Feat2: 'Planning Prioritaire',
    pack3Feat3: 'Matériaux Haut de Gamme',
    pack3Feat4: 'Paiement en Plusieurs Fois',
    pack3Btn: 'Réserver Sur-Mesure',
    formTitle: 'Demander un Devis Gratuit',
    formSub: 'Nous vous recontactons sous 2 heures pour valider votre demande !',
    formName: 'Votre Nom et Prénom',
    formContact: 'Téléphone ou Adresse Email',
    formSelectDef: 'Sélectionnez le Service Souhaité',
    formOptAuto: 'Option 1 (Intervention Rapide)',
    formOptManu: 'Option 2 (Rénovation / Projets)',
    formOptMoto: 'Option 3 (Sur-Mesure)',
    formOptAAC: 'Option 4 (Maintenance / Entretien)',
    formOptCombo: 'Option 5 (Pack Général)',
    formBtn: 'Envoyer ma Demande',
    bannerTitle: `Entreprise "${brandName}" — Référence à ${displayCity} !`,
    bannerSub: 'Bénéficiez d\'un accompagnement personnalisé et de conseils d\'experts.',
    alertSent: 'Merci ! Votre demande a bien été envoyée à '
  };

  if (isDrivingSchool) {
    nicheDefaults = {
      ...nicheDefaults,
      tag1: 'Flotte 2026', tag2: 'Auto & Moto', tag3: '98% de Réussite',
      heroTitle: `${brandName}<br>Académie de Conduite & Moto`,
      heroSubtext: 'Maîtrisez la route sur 4 roues ou 2 roues. Formations professionnelles axées sur la sécurité et la confiance.',
      showcaseLabel: 'Présentation de notre auto-école',
      prog1Title: 'Code en Salle', prog1Sub: 'Cours théoriques en agence avec moniteur diplômé.',
      prog2Title: 'Code en Ligne 24/7', prog2Sub: 'Entraînement au Code sur smartphone et visioconférence.',
      prog3Title: 'Conduite Automobile', prog3Sub: 'Leçons personnalisées sur boîte manuelle ou automatique.',
      prog4Title: 'Permis Moto A1 / A2', prog4Sub: 'Plateau privé fermé, évitement, slalom et circulation.',
      catTitle: 'Choisissez Votre Catégorie de Permis',
      catSub: 'Formations disponibles pour voiture automatique, manuelle et toutes catégories moto.',
      tabCar: 'Permis B (Voiture)', tabMoto: 'Permis Moto (A1, A2, A)',
      card1Badge: 'PERMIS B / AUTOMATIQUE', card1Title: 'Permis Boîte Automatique', card1Sub: 'Apprentissage rapide et simplifié.', card1Btn: 'Choisir Boîte Auto',
      card2Badge: 'PERMIS B / MANUELLE', card2Title: 'Permis Boîte Manuelle', card2Sub: 'Maîtrise complète de l\'embrayage.', card2Btn: 'Choisir Boîte Manu',
      card3Badge: 'PERMIS A1 / A2 / A', card3Title: 'Académie Moto complète', card3Sub: 'Du scooter 125cm³ aux gros cubes.', card3Btn: 'Choisir Permis Moto',
      frenchSectionTag: 'Agréments & Dispositifs France', frenchSectionTitle: 'Spécificités Auto-École & Financements',
      frenchSectionSub: 'Profitez de tous les dispositifs nationaux d\'aide au permis de conduire.',
      cpfTitle: 'Financement CPF 100%', cpfSub: 'Financer votre permis B avec 0€ d\'acompte via CPF.',
      oneEuroTitle: 'Permis à 1€ par Jour', oneEuroSub: 'Prêt aidé par l\'État pour les jeunes de 15 à 25 ans.',
      aacTitle: 'Conduite Accompagnée (AAC)', aacSub: 'Apprentissage anticipé dès 15 ans (taux de réussite > 85%).',
      qualiopiTitle: 'Certifié Qualiopi & Agrée Préfecture',
      safetyTag: 'Sécurité Maximale', safetyTitle: 'Véhicules Double Commandes & Équipement Moto',
      safetySub: 'Voitures équipées de doubles pédales homologuées et motos avec crash-bars et ABS.',
      priceTitle: 'Forfaits Permis Transparents', priceSub: 'Formules complètes sans aucun frais caché.',
      pack1Title: 'Forfait Permis Moto A2', pack1Sub: 'Préparation complète Plateau + Circulation', pack1Price: '690 €',
      pack2Title: 'Forfait Permis B Complet', pack2Sub: 'Code en ligne + Conduite 20h', pack2Price: '990 €',
      pack3Title: 'Forfait Duo Auto + Moto', pack3Sub: 'Double Permis B + A2', pack3Price: '1 490 €'
    };
  } else if (isRestaurant) {
    nicheDefaults = {
      ...nicheDefaults,
      tag1: 'Cuisine Fait Maison', tag2: 'Produits Frais & Locaux', tag3: '4.9/5 sur Google',
      heroTitle: `${brandName}<br>Restaurant & Gastronomie`,
      heroSubtext: 'Une expérience culinaire raffinée où tradition et passion s\'unissent pour ravir vos papilles.',
      showcaseLabel: 'Créations Culinaires & Ambiance',
      prog1Title: 'Menu Dégustation', prog1Sub: 'Accords mets et vins préparés par notre Chef.',
      prog2Title: 'Réservation Ligne 24/7', prog2Sub: 'Réservez votre table en quelques clics.',
      prog3Title: 'Spécialités de Saison', prog3Sub: 'Produits frais issus des producteurs locaux.',
      prog4Title: 'Privatisation & Banquets', prog4Sub: 'Salles privatives pour vos événements et anniversaires.',
      catTitle: 'Nos Formules & Cartes Gourmandes',
      card1Badge: 'ENTRÉES & PLATS', card1Title: 'Menu du Marché', card1Sub: 'Formule rapide du midi renouvelée chaque jour.', card1Btn: 'Voir le Menu',
      card2Badge: 'CARTE GASTRONOMIQUE', card2Title: 'Spécialités du Chef', card2Sub: 'Plats signature aux saveurs authentiques.', card2Btn: 'Découvrir la Carte',
      card3Badge: 'DESSERTS & VINS', card3Title: 'Pâtisseries & Cave', card3Sub: 'Sélection de grands crus et douceurs maison.', card3Btn: 'Réserver une Table',
      frenchSectionTag: 'Label & Engagement Qualité', frenchSectionTitle: 'Spécificités Gastronomie & Hygiène',
      frenchSectionSub: 'Cuisine authentique Fait Maison et normes sanitaires irréprochables.',
      cpfTitle: 'Titre Maître Restaurateur', cpfSub: 'Garantie certifiée d\'une cuisine 100% fait maison sur place.',
      oneEuroTitle: 'Produits Locaux & Bio', oneEuroSub: 'Ingrédients de saison issus de circuits courts régionaux.',
      aacTitle: 'Normes HACCP Strictes', aacSub: 'Contrôles sanitaires rigoureux et chaîne du froid garantie.',
      qualiopiTitle: 'Établissement Homologué & Recommandé',
      safetyTag: 'Hygiène & Qualité', safetyTitle: 'Cuisine Ouverte & Produits Sélectionnés',
      safetySub: 'Nos cuisiniers travaillent des ingrédients rigoureusement sélectionnés dans le respect strict des règles d\'hygiène.',
      priceTitle: 'Nos Cartes & Menus', priceSub: 'Menu du midi, carte du soir et formules dégustation.',
      pack1Title: 'Menu Midi Express', pack1Sub: 'Entrée + Plat ou Plat + Dessert', pack1Price: '24 €',
      pack2Title: 'Menu Dégustation 5 Services', pack2Sub: 'L\'expérience complète du Chef', pack2Price: '68 €',
      pack3Title: 'Formule Privatisation', pack3Sub: 'Groupe & Événements privés (>10 pers)', pack3Price: '85 € / pers'
    };
  } else if (isElectrician) {
    nicheDefaults = {
      ...nicheDefaults,
      tag1: 'Dépannage 24h/7j', tag2: 'Garantie Décennale', tag3: 'Artisan Certifié',
      heroTitle: `${brandName}<br>Électricité Générale & Domotique`,
      heroSubtext: 'Installation, rénovation et dépannage électrique urgent pour particuliers et professionnels.',
      showcaseLabel: 'Savoir-Faire & Matériel Électrique',
      prog1Title: 'Tableaux Électriques', prog1Sub: 'Mise aux normes NF C 15-100 et sécurisation.',
      prog2Title: 'Devis Connecté 24/7', prog2Sub: 'Estimation rapide et prise de RDV en ligne.',
      prog3Title: 'Éclairage & Domotique', prog3Sub: 'Gestion intelligente de votre énergie et éclairage LED.',
      prog4Title: 'Bornes de Recharge IRVE', prog4Sub: 'Installation de bornes pour véhicules électriques.',
      catTitle: 'Nos Domaines d\'Intervention Électrique',
      card1Badge: 'URGENCE 24/7', card1Title: 'Dépannage Panne Électrique', card1Sub: 'Intervention rapide pour coupure ou court-circuit.', card1Btn: 'Appeler l\'Électricien',
      card2Badge: 'RÉNOVATION & NORMES', card2Title: 'Mise aux Normes NF C 15-100', card2Sub: 'Rénovation complète du tableau et réseaux.', card2Btn: 'Demander un Devis',
      card3Badge: 'INNOVATION', card3Title: 'Domotique & Borne IRVE', card3Sub: 'Maison connectée et recharge auto.', card3Btn: 'En Savoir Plus',
      frenchSectionTag: 'Assurances & Certifications France', frenchSectionTitle: 'Garanties Électricien & Aides d\'État',
      frenchSectionSub: 'Toutes nos prestations sont couvertes par notre garantie décennale.',
      cpfTitle: 'Garantie Décennale 10 Ans', cpfSub: 'Vos installations électriques assurées contre tout vice.',
      oneEuroTitle: 'Qualification RGE Qualifelec', oneEuroSub: 'Éligibilité aux aides financières de transition énergétique.',
      aacTitle: 'Intervention Express 30 Min', aacSub: 'Déplacement d\'urgence en cas de panne totale.',
      qualiopiTitle: 'Électricien Agrée & Certifié',
      safetyTag: 'Sécurité Électrique', safetyTitle: 'Matériel Homologué NF & Schneider Electric',
      safetySub: 'Nous utilisons exclusivement du matériel aux normes NF garantissant une sécurité optimale contre les surtensions.',
      priceTitle: 'Tarifs Électricité Transparents', priceSub: 'Forfaits dépannage et devis sur-mesure.',
      pack1Title: 'Forfait Dépannage Urgent', pack1Sub: 'Déplacement + 1h de recherche de panne', pack1Price: '120 €',
      pack2Title: 'Mise en Sécurité Tableau', pack2Sub: 'Remplacement disjoncteurs & différentiels', pack2Price: '590 €',
      pack3Title: 'Rénovation Électrique', pack3Sub: 'Appartement / Maison complet', pack3Price: 'Sur Devis'
    };
  } else if (isPlumber) {
    nicheDefaults = {
      ...nicheDefaults,
      tag1: 'Urgence Fuite 24h/7j', tag2: 'Chauffage & Sanitaire', tag3: 'Agrée Assurances',
      heroTitle: `${brandName}<br>Plomberie, Chauffage & Sanitaire`,
      heroSubtext: 'Dépannage rapide, débouchage, recherche de fuite et rénovation de salle de bain.',
      showcaseLabel: 'Interventions & Équipements de Plomberie',
      prog1Title: 'Recherche de Fuite', prog1Sub: 'Détection thermique sans casse et réparation immédiate.',
      prog2Title: 'Demande de Devis 24/7', prog2Sub: 'Tarifs transparents sans supplément caché.',
      prog3Title: 'Installation Sanitaire', prog3Sub: 'Création de salle de bain clé en main et douches italienne.',
      prog4Title: 'Pompes à Chaleur & Chaudières', prog4Sub: 'Entretien et remplacement de systèmes de chauffage.',
      catTitle: 'Nos Prestations Plomberie & Chauffage',
      card1Badge: 'URGENCE 24/7', card1Title: 'Dépannage Fuite & Débouchage', card1Sub: 'Intervention d\'urgence fuite d\'eau et canalisation.', card1Btn: 'Urgence Plombier',
      card2Badge: 'SANITAIRE', card2Title: 'Rénovation Salle de Bain', card2Sub: 'Installation douche italienne, WC et lavabos.', card2Btn: 'Devis Salle de Bain',
      card3Badge: 'CHAUFFAGE', card3Title: 'Chaudière & Pompe à Chaleur', card3Sub: 'Installation et entretien annuel de chauffage.', card3Btn: 'Devis Chauffage',
      frenchSectionTag: 'Agréments & Garanties', frenchSectionTitle: 'Spécificités Plomberie & Aides MaPrimeRénov',
      frenchSectionSub: 'Entreprise agréée par les plus grandes compagnies d\'assurance.',
      cpfTitle: 'Assurance Décennale AXA', cpfSub: 'Tous travaux de tuyauterie et chauffage assurés 10 ans.',
      oneEuroTitle: 'Éligible MaPrimeRénov', oneEuroSub: 'Aides de l\'État pour le changement de votre chaudière.',
      aacTitle: 'Agrée Assurances', aacSub: 'Prise en charge directe de vos dégâts des eaux par l\'assurance.',
      priceTitle: 'Tarifs Plomberie Clair & Net', priceSub: 'Forfaits dépannage et devis gratuits.',
      pack1Title: 'Dépannage Urgent Fuite', pack1Sub: 'Déplacement + réparation immédiate', pack1Price: '110 €',
      pack2Title: 'Débouchage Canalisation', pack2Sub: 'Furet électrique & furet haute pression', pack2Price: '180 €',
      pack3Title: 'Entretien Chaudière', pack3Sub: 'Visite annuelle + attestation d\'entretien', pack3Price: '140 €'
    };
  } else if (isLocksmith) {
    nicheDefaults = {
      ...nicheDefaults,
      tag1: 'Ouverture Porte 24/7', tag2: 'Portes Blindées A2P', tag3: 'Arrivée 20 Min',
      heroTitle: `${brandName}<br>Serrurerie & Sécurité Porte`,
      heroSubtext: 'Serrurier d\'urgence pour ouverture de porte claquée, remplacement de serrure et blindage.',
      showcaseLabel: 'Serrures de Haute Sécurité & Cylindres',
      prog1Title: 'Ouverture Sans Dégât', prog1Sub: 'Techniques d\'ouverture fine pour porte claquée ou fermée.',
      prog2Title: 'Assistance 24h/7j', prog2Sub: 'Ligne d\'urgence directe intervention jour et nuit.',
      prog3Title: 'Serrures A2P★', prog3Sub: 'Installation de verrous et cylindres anti-crochetage.',
      prog4Title: 'Blindage de Porte', prog4Sub: 'Renforcement de bâti et portes blindées sur-mesure.',
      catTitle: 'Nos Interventions Serrurerie',
      card1Badge: 'URGENCE 24/7', card1Title: 'Ouverture de Porte Claquée', card1Sub: 'Ouverture rapide sans abîmer la serrure ni le bâti.', card1Btn: 'Appeler le Serrurier',
      card2Badge: 'SÉCURITÉ', card2Title: 'Changement de Serrure', card2Sub: 'Remplacement cylindres toutes marques (Fichet, Picard, Bricard).', card2Btn: 'Changer Serrure',
      card3Badge: 'PROTECTION', card3Title: 'Porte Blindée & Blindage', card3Sub: 'Protection maximale contre le cambriolage.', card3Btn: 'Devis Blindage',
      frenchSectionTag: 'Agréments Assurances', frenchSectionTitle: 'Engagements Serrurerie Confiance',
      frenchSectionSub: 'Devis écrit fourni avant le début de l\'intervention.',
      cpfTitle: 'Tarifs Agréés Assurances', cpfSub: 'Facturation conforme aux barèmes d\'assurance.',
      oneEuroTitle: 'Serrures Certifiées A2P', oneEuroSub: 'Série de verrous haute sécurité certifiés CNPP.',
      aacTitle: 'Devis Préalable Obligatoire', aacSub: 'Prix annoncé et validé par vos soins avant travail.',
      priceTitle: 'Tarifs Serrurerie Transparents', priceSub: 'Transparence totale sur les tarifs d\'urgence.',
      pack1Title: 'Ouverture Porte Claquée', pack1Sub: 'Jour (8h-20h) - Sans dégât', pack1Price: '90 €',
      pack2Title: 'Ouverture Porte Fermée', pack2Sub: 'Porte verrouillée à clef + remplacement cylindre', pack2Price: '180 €',
      pack3Title: 'Installation Serrure 3 Points', pack3Sub: 'Serrure A2P certifiée avec clefs sécurisées', pack3Price: '390 €'
    };
  } else if (isCaterer) {
    nicheDefaults = {
      ...nicheDefaults,
      tag1: 'Réceptions & Mariages', tag2: 'Cocktails & Buffets', tag3: 'Sur-Mesure 10-500 Pers.',
      heroTitle: `${brandName}<br>Traiteur d'Exception & Banquets`,
      heroSubtext: 'Organisation gastronomique sur-mesure pour mariages, séminaires et événements privés.',
      showcaseLabel: 'Buffets Gastronomiques & Pièces Montées',
      prog1Title: 'Cocktails Dînatoires', prog1Sub: 'Bouchées salées et sucrées élégantes à déguster debout.',
      prog2Title: 'Devis Événement 24/7', prog2Sub: 'Menu personnalisé ajusté selon vos invités et budget.',
      prog3Title: 'Repas Assis Gastronomiques', prog3Sub: 'Service à l\'assiette digne des plus grandes tables.',
      prog4Title: 'Animations Culinaires', prog4Sub: 'Ateliers découpe de jambon, sushi bar et plancha.',
      catTitle: 'Nos Prestations Traiteur',
      card1Badge: 'ENTREPRISES & SÉMINAIRES', card1Title: 'Plateaux Repas & Cocktails', card1Sub: 'Buffets professionnels pour vos réunions d\'affaires.', card1Btn: 'Devis Entreprise',
      card2Badge: 'MARIAGES & BANQUETS', card2Title: 'Réception de Mariage', card2Sub: 'Menu sur-mesure avec vin d\'honneur et vin dînatoire.', card2Btn: 'Devis Mariage',
      card3Badge: 'ÉVÉNEMENTS PRIVÉS', card3Title: 'Anniversaires & Fêtes', card3Sub: 'Traiteur à domicile pour des fêtes inoubliables.', card3Btn: 'Devis Fête',
      priceTitle: 'Forfaits Traiteur & Réceptions', priceSub: 'Solutions complètes avec ou sans personnel de service.',
      pack1Title: 'Formule Cocktail 12 Pièces', pack1Sub: 'Buffet froid & chaud à livrer', pack1Price: '28 € / pers',
      pack2Title: 'Menu Mariage Prestige', pack2Sub: 'Vin d\'honneur + Repas 3 plats + Service', pack2Price: '75 € / pers',
      pack3Title: 'Buffet Champêtre Chic', pack3Sub: 'Grillades, salades bar & desserts maison', pack3Price: '42 € / pers'
    };
  } else if (isLandscaping) {
    nicheDefaults = {
      ...nicheDefaults,
      tag1: 'Création & Entretien', tag2: 'Aménagement Paysager', tag3: 'Crédit d\'Impôt 50%',
      heroTitle: `${brandName}<br>Paysagiste & Espaces Verts`,
      heroSubtext: 'Conception de jardins sur-mesure, taille de haies, élagage et pose de terrasses.',
      showcaseLabel: 'Jardins d\'Exception & Aménagements',
      prog1Title: 'Tonte & Taille de Haies', prog1Sub: 'Entretien régulier de votre pelouse et arbustes.',
      prog2Title: 'Devis Jardin 24/7', prog2Sub: 'Estimation gratuite pour projet de création ou entretien.',
      prog3Title: 'Création & Plantations', prog3Sub: 'Aménagement minéral, engazonnement et massifs floraux.',
      prog4Title: 'Élagage & Abattage', prog4Sub: 'Taille douce et abattage délicat d\'arbres de toutes hauteurs.',
      catTitle: 'Nos Services Paysagistes',
      card1Badge: 'ENTRETIEN RÉGULIER', card1Title: 'Tonte & Entretien Jardin', card1Sub: 'Service à la personne éligible à 50% de crédit d\'impôt.', card1Btn: 'Réserver Entretien',
      card2Badge: 'CRÉATION & TERRASSES', card2Title: 'Aménagement de Jardin', card2Sub: 'Pose de terrasse bois, murets et engazonnement.', card2Btn: 'Projet Jardin',
      card3Badge: 'ÉLAGAGE', card3Title: 'Élagage & Soin des Arbres', card3Sub: 'Taille d\'arbres et sécurisation des branches.', card3Btn: 'Devis Élagage',
      frenchSectionTag: 'Avantages Fiscaux', frenchSectionTitle: 'Spécificités Paysagiste & Service à la Personne',
      frenchSectionSub: 'Bénéficiez de 50% de crédit d\'impôt immédiat sur vos travaux d\'entretien.',
      cpfTitle: '50% Crédit d\'Impôt Immédiat', cpfSub: 'Payer seulement la moitié du montant sur l\'entretien de jardin.',
      oneEuroTitle: 'Éco-Jardinage & Zero Phyto', oneEuroSub: 'Méthodes respectueuses de l\'environnement et de la biodiversité.',
      aacTitle: 'Matériel Électrique Silencieux', aacSub: 'Outillage professionnel réduisant le bruit au voisinage.',
      priceTitle: 'Tarifs Entretien & Aménagement', priceSub: 'Forfaits réguliers et devis création.',
      pack1Title: 'Forfait Tonte & Taille', pack1Sub: 'Intervention jusqu\'à 500m² de terrain', pack1Price: '140 €',
      pack2Title: 'Contrat Entretien Annuel', pack2Sub: 'Passages mensuels mars à novembre', pack2Price: '95 € / mois',
      pack3Title: 'Création Terrasse Bois', pack3Sub: 'Fourniture & pose de terrasse en résineux/exotique', pack3Price: 'Sur Devis'
    };
  } else if (isRenovation) {
    nicheDefaults = {
      ...nicheDefaults,
      tag1: 'Rénovation Clé en Main', tag2: 'Artisans Tous Corps d\'État', tag3: 'Devis Gratuit',
      heroTitle: `${brandName}<br>Rénovation Intérieure & Maçonnerie`,
      heroSubtext: 'Transformation globale de votre habitat : cuisine, salle de bain, peinture et sols.',
      showcaseLabel: 'Projets de Rénovation Avant / Après',
      prog1Title: 'Peinture & Sols', prog1Sub: 'Pose de parquet, carrelage et peintures écologiques.',
      prog2Title: 'Devis Rénovation 24/7', prog2Sub: 'Métré sur place et devis détaillé sous 48h.',
      prog3Title: 'Rénovation Cuisine & Bain', prog3Sub: 'Conception et pose clé en main avec plomberie/électricité.',
      prog4Title: 'Isolation & Plâtrerie', prog4Sub: 'Cloisonnement, faux plafonds et isolation thermique.',
      catTitle: 'Nos Prestations Rénovation',
      card1Badge: 'SECOND OEUVRE', card1Title: 'Peinture & Parquet', card1Sub: 'Remise à neuf complète de vos murs et sols.', card1Btn: 'Devis Peinture',
      card2Badge: 'RÉNOVATION GLOBALE', card2Title: 'Cuisine & Salle de Bain', card2Sub: 'Aménagement sur-mesure clé en main.', card2Btn: 'Devis Rénovation',
      card3Badge: 'ISOLATION & GROS OEUVRE', card3Title: 'Plâtrerie & Démolition', card3Sub: 'Ouverture de mur porteur et cloisons.', card3Btn: 'Devis Gros Oeuvre',
      frenchSectionTag: 'Garanties Bâtiment', frenchSectionTitle: 'Spécificités Rénovation & Normes',
      frenchSectionSub: 'Toutes nos équipes disposent des qualifications professionnelles requises.',
      cpfTitle: 'Garantie Décennale Bâtiment', cpfSub: 'Protection de 10 ans sur l\'ensemble des gros travaux.',
      oneEuroTitle: 'Label RGE Éco-Artisan', oneEuroSub: 'Accès aux prime énergie pour l\'isolation et fenêtres.',
      aacTitle: 'Suivi de Chantier Dédié', aacSub: 'Un interlocuteur unique durant toute la durée de vos travaux.',
      priceTitle: 'Estimations Rénovation Habitat', priceSub: 'Transparence totale selon les m² à rénover.',
      pack1Title: 'Rénovation Légère', pack1Sub: 'Peinture + Rafraîchissement sols (par m²)', pack1Price: '45 € / m²',
      pack2Title: 'Rénovation Intermédiaire', pack2Sub: 'Cuisine/Bain + Peinture + Électricité', pack2Price: '450 € / m²',
      pack3Title: 'Rénovation Lourde Clé en Main', pack3Sub: 'Refonte complète avec modification de cloisons', pack3Price: '950 € / m²'
    };
  }

  // Merge with content overrides
  const t = {
    ...nicheDefaults,
    ...(currentContent.heroTitle ? { heroTitle: currentContent.heroTitle } : {}),
    ...(currentContent.heroSubtext ? { heroSubtext: currentContent.heroSubtext } : {}),
    ...(currentContent.showcaseLabel ? { showcaseLabel: currentContent.showcaseLabel } : {}),
    ...(currentContent.stat1Title ? { stat1Title: currentContent.stat1Title } : {}),
    ...(currentContent.stat1Sub ? { stat1Sub: currentContent.stat1Sub } : {}),
    ...(currentContent.stat2Title ? { stat2Title: currentContent.stat2Title } : {}),
    ...(currentContent.stat2Sub ? { stat2Sub: currentContent.stat2Sub } : {}),
    ...(currentContent.stat3Title ? { stat3Title: currentContent.stat3Title } : {}),
    ...(currentContent.stat3Sub ? { stat3Sub: currentContent.stat3Sub } : {}),
    ...(currentContent.prog1Title ? { prog1Title: currentContent.prog1Title } : {}),
    ...(currentContent.prog1Sub ? { prog1Sub: currentContent.prog1Sub } : {}),
    ...(currentContent.prog2Title ? { prog2Title: currentContent.prog2Title } : {}),
    ...(currentContent.prog2Sub ? { prog2Sub: currentContent.prog2Sub } : {}),
    ...(currentContent.prog3Title ? { prog3Title: currentContent.prog3Title } : {}),
    ...(currentContent.prog3Sub ? { prog3Sub: currentContent.prog3Sub } : {}),
    ...(currentContent.prog4Title ? { prog4Title: currentContent.prog4Title } : {}),
    ...(currentContent.prog4Sub ? { prog4Sub: currentContent.prog4Sub } : {}),
    ...(currentContent.catTitle ? { catTitle: currentContent.catTitle } : {}),
    ...(currentContent.catSub ? { catSub: currentContent.catSub } : {}),
    ...(currentContent.frenchSectionTitle ? { frenchSectionTitle: currentContent.frenchSectionTitle } : {}),
    ...(currentContent.frenchSectionSub ? { frenchSectionSub: currentContent.frenchSectionSub } : {}),
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} — ${t.tag2}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    /* ==========================================================================
       NEUMORPHIC & CLAYMORPHIC SYSTEM PALETTE
       ========================================================================== */
    :root {
      --bg-canvas: #ebeef3;
      --card-bg: rgba(255, 255, 255, 0.7);
      --card-solid: #ffffff;
      --input-bg: #dbdfe6;
      --text-dark: #1e293b;
      --text-muted: #64748b;
      --accent-red: #e11d48;
      --accent-blue: #2563eb;
      --radius-xl: 32px;
      --radius-lg: 24px;
      --radius-pill: 9999px;
      --font-family: 'Plus Jakarta Sans', sans-serif;
      --clay-shadow: 0 10px 30px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8);
      --soft-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.08);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-canvas);
      color: var(--text-dark);
      font-family: var(--font-family);
      padding: 30px 20px;
      line-height: 1.5;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 70px;
    }

    /* ==========================================================================
       1. CINEMATIC HERO HEADER
       ========================================================================== */
    .hero-container {
      position: relative;
      height: 560px;
      border-radius: var(--radius-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 44px;
      box-shadow: var(--soft-shadow);
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.6) 100%);
      z-index: 2;
    }

    .hero-title {
      position: relative;
      z-index: 3;
      font-size: 52px;
      font-weight: 800;
      color: white;
      text-transform: uppercase;
      line-height: 1.02;
      letter-spacing: -0.03em;
      max-width: 760px;
      text-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }

    .hero-bottom {
      position: relative;
      z-index: 3;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
    }

    .glass-badge-card {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.35);
      padding: 20px 24px;
      border-radius: var(--radius-lg);
      color: white;
      max-width: 380px;
    }

    .pill-tags {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .tag-pill {
      background: rgba(255, 255, 255, 0.25);
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .explore-btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      transition: transform 0.2s ease;
    }
    .explore-btn:hover {
      transform: translateY(-2px);
    }

    .arrow-circle-btn {
      width: 36px;
      height: 36px;
      border: 2px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .hero-subcaption {
      color: rgba(255, 255, 255, 0.95);
      font-size: 13px;
      max-width: 340px;
      text-align: right;
      text-shadow: 0 2px 8px rgba(0,0,0,0.5);
    }

    /* ==========================================================================
       2. BEHANCE CUTOUT SHOWCASE
       ========================================================================== */
    .hero-visual-section {
      position: relative;
      width: 100%;
      min-height: 440px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    .section-title-label {
      position: absolute;
      top: 0;
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .car-cutout {
      width: 580px;
      max-width: 92%;
      max-height: 340px;
      object-fit: cover;
      border-radius: 24px;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15));
      margin-bottom: -10px;
    }

    .floating-glass-row {
      position: absolute;
      top: 50px;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      z-index: 3;
    }

    .glass-stat-card {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.9);
      border-radius: var(--radius-lg);
      padding: 20px 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      position: relative;
      min-height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .glass-stat-card h3 {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .glass-stat-card p {
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.3;
    }

    .glass-stat-card .accent-line {
      width: 100%;
      height: 3px;
      background: var(--text-dark);
      margin-top: 10px;
      border-radius: 2px;
    }

    .micro-icon {
      position: absolute;
      bottom: 12px;
      right: 16px;
      height: 22px;
      object-fit: contain;
    }

    /* ==========================================================================
       3. 4-COLUMN PROGRAM CARDS
       ========================================================================== */
    .programs-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .program-card {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.9);
      border-radius: var(--radius-lg);
      padding: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 260px;
    }

    .program-card h4 {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .program-card p {
      font-size: 10px;
      color: var(--text-muted);
      line-height: 1.3;
    }

    .card-asset-container {
      width: 100%;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 12px;
    }

    .card-asset-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
      filter: drop-shadow(0 6px 10px rgba(0,0,0,0.08));
    }

    /* ==========================================================================
       4. CATEGORIES & CARDS
       ========================================================================== */
    .category-tabs {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .tab-btn {
      background: var(--input-bg);
      border: none;
      padding: 10px 24px;
      border-radius: var(--radius-pill);
      font-family: var(--font-family);
      font-size: 12px;
      font-weight: 700;
      color: var(--text-dark);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background: var(--text-dark);
      color: white;
    }

    .license-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .license-card {
      background: var(--card-solid);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--clay-shadow);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid rgba(255,255,255,0.8);
    }

    .license-card h3 {
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 6px;
    }

    .license-badge {
      display: inline-block;
      background: #e2e8f0;
      color: var(--text-dark);
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      margin-bottom: 12px;
    }

    .license-card-img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 14px;
      margin: 12px 0;
      filter: drop-shadow(0 6px 10px rgba(0,0,0,0.08));
    }

    /* ==========================================================================
       5. FRENCH SPECIFIC SECTION
       ========================================================================== */
    .french-info-section {
      background: var(--card-solid);
      border-radius: var(--radius-xl);
      padding: 36px 40px;
      box-shadow: var(--clay-shadow);
      border: 1px solid rgba(255, 255, 255, 0.9);
    }

    .french-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .french-header span {
      color: var(--accent-blue);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .french-header h2 {
      font-size: 26px;
      font-weight: 800;
      margin-top: 4px;
    }

    .french-header p {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .french-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .french-card {
      background: #f8fafc;
      border-radius: var(--radius-lg);
      padding: 24px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .french-card-icon {
      width: 42px;
      height: 42px;
      background: rgba(37, 99, 235, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-blue);
      font-size: 18px;
      font-weight: 800;
    }

    .french-card h4 {
      font-size: 16px;
      font-weight: 800;
      color: var(--text-dark);
    }

    .french-card p {
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .french-accreditation-bar {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: white;
      padding: 16px 24px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .french-accreditation-bar div {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .french-accreditation-bar span {
      font-weight: 700;
      font-size: 13px;
    }

    .french-tag-badge {
      background: rgba(255, 255, 255, 0.15);
      padding: 4px 12px;
      border-radius: var(--radius-pill);
      font-size: 11px;
      font-weight: 700;
    }

    /* ==========================================================================
       6. FLEET & SAFETY BANNER
       ========================================================================== */
    .safety-banner {
      background: var(--card-solid);
      border-radius: var(--radius-xl);
      padding: 36px 40px;
      box-shadow: var(--clay-shadow);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .safety-banner img {
      width: 100%;
      height: 240px;
      border-radius: var(--radius-lg);
      object-fit: cover;
    }

    /* ==========================================================================
       7. PRICING & PACKAGES
       ========================================================================== */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 24px;
    }

    .price-card {
      background: var(--card-solid);
      border-radius: var(--radius-lg);
      padding: 28px;
      box-shadow: var(--clay-shadow);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    .price-card.featured {
      border: 2px solid var(--accent-red);
    }

    .featured-badge {
      position: absolute;
      top: -12px;
      right: 20px;
      background: var(--accent-red);
      color: white;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      text-transform: uppercase;
    }

    .price-amount {
      font-size: 34px;
      font-weight: 800;
      margin: 12px 0;
    }

    .price-features {
      list-style: none;
      margin-bottom: 24px;
    }

    .price-features li {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .price-features li::before {
      content: "✓";
      color: var(--accent-red);
      font-weight: bold;
    }

    /* ==========================================================================
       8. APPLICATION FORM
       ========================================================================== */
    .form-section {
      text-align: center;
      max-width: 480px;
      margin: 0 auto;
      width: 100%;
    }

    .form-section h2 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .form-section p {
      font-size: 11px;
      color: var(--text-muted);
      margin-bottom: 20px;
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }

    .neumorphic-input, .neumorphic-select {
      width: 100%;
      padding: 12px 20px;
      background: var(--input-bg);
      border: none;
      border-radius: var(--radius-pill);
      font-family: var(--font-family);
      font-size: 12px;
      text-align: center;
      outline: none;
      color: var(--text-dark);
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.04);
    }

    .neumorphic-input::placeholder {
      color: #94a3b8;
    }

    .submit-btn {
      background: var(--input-bg);
      color: var(--text-dark);
      border: none;
      padding: 12px 32px;
      border-radius: var(--radius-pill);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
      width: 100%;
    }

    .submit-btn:hover {
      transform: translateY(-1px);
    }

    .submit-btn.primary {
      background: var(--accent-red);
      color: white;
    }

    .banner-card {
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: var(--radius-lg);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 10px 25px rgba(0,0,0,0.02);
      gap: 16px;
    }

    .banner-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stop-sign-img {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }

    .banner-text-content h4 {
      font-size: 14px;
      font-weight: 700;
    }

    .banner-text-content p {
      font-size: 10px;
      color: var(--text-muted);
    }

    .banner-assets-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .asset-thumbnail {
      height: 30px;
      object-fit: contain;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
    }

    .map-wrapper {
      width: 100%;
      height: 280px;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.04);
      border: 2px solid white;
    }

    .map-wrapper iframe {
      width: 100%;
      height: 100%;
      border: none;
      filter: grayscale(0.3) contrast(1.1);
    }

    /* RESPONSIVE LAYOUT BREAKPOINTS */
    @media (max-width: 868px) {
      .hero-container {
        height: auto;
        min-height: 480px;
        padding: 24px;
      }
      .hero-title {
        font-size: 36px;
      }
      .hero-bottom {
        flex-direction: column;
        align-items: stretch;
      }
      .hero-subcaption {
        text-align: left;
        max-width: 100%;
      }
      .floating-glass-row, .programs-grid, .license-cards-grid, .french-cards-grid, .pricing-grid {
        grid-template-columns: 1fr;
      }
      .safety-banner {
        grid-template-columns: 1fr;
        padding: 24px;
      }
      .car-cutout {
        width: 100%;
      }
      .banner-card {
        flex-direction: column;
        align-items: flex-start;
      }
      .banner-assets-right {
        margin-top: 8px;
      }
    }
  </style>
</head>
<body>

  <div class="container">

    <!-- 1. CINEMATIC HERO HEADER SECTION -->
    <div class="hero-container">
      ${heroMediaHTML}
      <div class="hero-overlay"></div>

      <h1 class="hero-title">${t.heroTitle}</h1>

      <div class="hero-bottom">
        <div class="glass-badge-card">
          <div class="pill-tags">
            <span class="tag-pill">${t.tag1}</span>
            <span class="tag-pill">${t.tag2}</span>
            <span class="tag-pill">${t.tag3}</span>
          </div>
          <a href="#booking" class="explore-btn">
            <span class="arrow-circle-btn">↘</span>
            ${t.bookNow}
          </a>
        </div>

        <p class="hero-subcaption">
          ${t.heroSubtext}
        </p>
      </div>
    </div>

    <!-- 2. BEHANCE CUTOUT SHOWCASE -->
    <div class="hero-visual-section">
      <div class="section-title-label">
        ${t.showcaseLabel}
      </div>

      <div class="floating-glass-row">
        <div class="glass-stat-card">
          <h3>${t.stat1Title}</h3>
          <p>${t.stat1Sub}</p>
          <div class="accent-line"></div>
        </div>

        <div class="glass-stat-card">
          <h3>${t.stat2Title}</h3>
          <p>${t.stat2Sub}</p>
          <img class="micro-icon" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Icon">
        </div>

        <div class="glass-stat-card">
          <h3>${t.stat3Title}</h3>
          <p>${t.stat3Sub}</p>
          <img class="micro-icon" src="https://cdn-icons-png.flaticon.com/512/814/814588.png" alt="Star">
        </div>
      </div>

      ${showcaseCutoutHTML}
    </div>

    <!-- 3. 4-COLUMN PROGRAM CARDS -->
    <div class="programs-grid">
      <div class="program-card">
        <div>
          <h4>${t.prog1Title}</h4>
          <p>${t.prog1Sub}</p>
        </div>
        <div class="card-asset-container">
          <img id="programNotebookImg" src="${notebookImage}" alt="Program Asset 1">
        </div>
      </div>

      <div class="program-card">
        <div class="card-asset-container" style="height: 110px; margin-top: 6px;">
          <img id="programTabletImg" src="${tabletImage}" alt="Program Asset 2">
        </div>
        <div>
          <h4>${t.prog2Title}</h4>
          <p>${t.prog2Sub}</p>
        </div>
      </div>

      <div class="program-card">
        <div>
          <h4>${t.prog3Title}</h4>
          <p>${t.prog3Sub}</p>
        </div>
        <div class="card-asset-container">
          <img id="programSteeringWheelImg" src="${steeringWheelImage}" alt="Program Asset 3">
        </div>
      </div>

      <div class="program-card">
        <div>
          <h4>${t.prog4Title}</h4>
          <p>${t.prog4Sub}</p>
        </div>
        <div class="card-asset-container">
          <img id="programMotorcycleImg" src="${motorcycleImage}" alt="Program Asset 4">
        </div>
      </div>
    </div>

    <!-- 4. LESSON / OFFER CATEGORIES -->
    <div>
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 26px; font-weight: 800;">${t.catTitle}</h2>
        <p style="color: var(--text-muted); font-size: 13px;">${t.catSub}</p>
      </div>

      <div class="category-tabs">
        <button class="tab-btn active">${t.tabCar}</button>
        <button class="tab-btn">${t.tabMoto}</button>
      </div>

      <div class="license-cards-grid">
        <!-- Card 1 -->
        <div class="license-card">
          <div>
            <span class="license-badge">${t.card1Badge}</span>
            <h3>${t.card1Title}</h3>
            <p style="font-size: 11px; color: var(--text-muted);">${t.card1Sub}</p>
          </div>
          <img class="license-card-img" id="autoCarImg" src="${autoCarImage}" alt="Card 1">
          <button class="submit-btn" onclick="document.getElementById('booking').scrollIntoView({behavior: 'smooth'})">${t.card1Btn}</button>
        </div>

        <!-- Card 2 -->
        <div class="license-card">
          <div>
            <span class="license-badge">${t.card2Badge}</span>
            <h3>${t.card2Title}</h3>
            <p style="font-size: 11px; color: var(--text-muted);">${t.card2Sub}</p>
          </div>
          <img class="license-card-img" id="manualCarImg" src="${manualCarImage}" alt="Card 2">
          <button class="submit-btn" onclick="document.getElementById('booking').scrollIntoView({behavior: 'smooth'})">${t.card2Btn}</button>
        </div>

        <!-- Card 3 -->
        <div class="license-card">
          <div>
            <span class="license-badge">${t.card3Badge}</span>
            <h3>${t.card3Title}</h3>
            <p style="font-size: 11px; color: var(--text-muted);">${t.card3Sub}</p>
          </div>
          <img class="license-card-img" id="motoAcademyImg" src="${motoAcademyImage}" alt="Card 3">
          <button class="submit-btn primary" onclick="document.getElementById('booking').scrollIntoView({behavior: 'smooth'})">${t.card3Btn}</button>
        </div>
      </div>
    </div>

    <!-- 5. FRENCH SPECIFIC SECTION -->
    <div class="french-info-section">
      <div class="french-header">
        <span>${t.frenchSectionTag}</span>
        <h2>${t.frenchSectionTitle}</h2>
        <p>${t.frenchSectionSub}</p>
      </div>

      <div class="french-cards-grid">
        <div class="french-card">
          <div class="french-card-icon">€</div>
          <h4>${t.cpfTitle}</h4>
          <p>${t.cpfSub}</p>
        </div>

        <div class="french-card">
          <div class="french-card-icon">0€</div>
          <h4>${t.oneEuroTitle}</h4>
          <p>${t.oneEuroSub}</p>
        </div>

        <div class="french-card">
          <div class="french-card-icon">7/7</div>
          <h4>${t.aacTitle}</h4>
          <p>${t.aacSub}</p>
        </div>
      </div>

      <div class="french-accreditation-bar">
        <div>
          <span style="font-size:18px;">🎖️</span>
          <span>${t.qualiopiTitle}</span>
        </div>
        <span class="french-tag-badge">N° Certificat Officiel</span>
      </div>
    </div>

    <!-- 6. FLEET & SAFETY CALLOUT -->
    <div class="safety-banner">
      <div>
        <span style="color: var(--accent-red); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${t.safetyTag}</span>
        <h2 style="font-size: 26px; font-weight: 800; margin: 6px 0 12px;">${t.safetyTitle}</h2>
        <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 13px;">
          ${t.safetySub}
        </p>
        <div style="display: flex; gap: 28px;">
          <div>
            <h4 style="font-size: 20px; font-weight: 800;">${t.statSafety1}</h4>
            <p style="font-size: 11px; color: var(--text-muted);">${t.statSafety1Sub}</p>
          </div>
          <div>
            <h4 style="font-size: 20px; font-weight: 800;">${t.statSafety2}</h4>
            <p style="font-size: 11px; color: var(--text-muted);">${t.statSafety2Sub}</p>
          </div>
        </div>
      </div>
      <div>
        <img id="safetyBannerImg" src="${safetyImage}" alt="Quality & Safety">
      </div>
    </div>

    <!-- 7. PACKAGES & PRICING -->
    <div>
      <div style="text-align: center;">
        <h2 style="font-size: 26px; font-weight: 800;">${t.priceTitle}</h2>
        <p style="color: var(--text-muted); font-size: 13px;">${t.priceSub}</p>
      </div>

      <div class="pricing-grid">
        <div class="price-card">
          <div>
            <h3>${t.pack1Title}</h3>
            <p style="font-size: 11px; color: var(--text-muted);">${t.pack1Sub}</p>
            <div class="price-amount">${t.pack1Price}</div>
            <ul class="price-features">
              <li>${t.pack1Feat1 || 'Diagnostic & Intervention'}</li>
              <li>${t.pack2Feat2 || 'Devis Détaillé Offert'}</li>
              <li>${t.pack1Feat3 || 'Matériel & Déplacement Inclus'}</li>
            </ul>
          </div>
          <button class="submit-btn" onclick="document.getElementById('booking').scrollIntoView({behavior: 'smooth'})">${t.pack1Btn || 'Réserver'}</button>
        </div>

        <div class="price-card featured">
          <span class="featured-badge">Recommandé</span>
          <div>
            <h3>${t.pack2Title}</h3>
            <p style="font-size: 11px; color: var(--text-muted);">${t.pack2Sub}</p>
            <div class="price-amount">${t.pack2Price}</div>
            <ul class="price-features">
              <li>${t.pack2Feat1 || 'Prestation Complète Clé en Main'}</li>
              <li>${t.pack2Feat2 || 'Accompagnement Personnalisé'}</li>
              <li>${t.pack2Feat3 || 'Garanties Etendues'}</li>
            </ul>
          </div>
          <button class="submit-btn primary" onclick="document.getElementById('booking').scrollIntoView({behavior: 'smooth'})">${t.pack2Btn || 'Réserver'}</button>
        </div>

        <div class="price-card">
          <div>
            <h3>${t.pack3Title}</h3>
            <p style="font-size: 11px; color: var(--text-muted);">${t.pack3Sub}</p>
            <div class="price-amount">${t.pack3Price}</div>
            <ul class="price-features">
              <li>${t.pack3Feat1 || 'Étude Sur-Mesure'}</li>
              <li>${t.pack3Feat2 || 'Prestation Prioritaire'}</li>
              <li>${t.pack3Feat3 || 'Paiement Plusieurs Fois'}</li>
            </ul>
          </div>
          <button class="submit-btn" onclick="document.getElementById('booking').scrollIntoView({behavior: 'smooth'})">${t.pack3Btn || 'Réserver'}</button>
        </div>
      </div>
    </div>

    <!-- 8. APPLICATION FORM -->
    <div class="form-section" id="booking">
      <h2>${t.formTitle}</h2>
      <p>${t.formSub}</p>

      <form class="form-fields" onsubmit="event.preventDefault(); alert('${t.alertSent}${brandName}.');">
        <input type="text" class="neumorphic-input" placeholder="${t.formName}" required>
        <input type="text" class="neumorphic-input" placeholder="${t.formContact}" required>
        <select class="neumorphic-select" required>
          <option value="">${t.formSelectDef}</option>
          <option value="opt1">${t.formOptAuto}</option>
          <option value="opt2">${t.formOptManu}</option>
          <option value="opt3">${t.formOptMoto}</option>
          <option value="opt4">${t.formOptAAC}</option>
          <option value="opt5">${t.formOptCombo}</option>
        </select>
        <button type="submit" class="submit-btn primary">${t.formBtn}</button>
      </form>
    </div>

    <!-- 9. BANNER & VECTOR MAP -->
    <div>
      <div class="banner-card" style="margin-bottom: 24px;">
        <div class="banner-left">
          <img class="stop-sign-img" src="${stopSignImage}" alt="Badge">
          <div class="banner-text-content">
            <h4>${t.bannerTitle}</h4>
            <p>${t.bannerSub}</p>
          </div>
        </div>

        <div class="banner-assets-right">
          <img class="asset-thumbnail" src="${licenseIcon}" alt="Icon 1">
          <img class="asset-thumbnail" src="${trafficLightIcon}" alt="Icon 2">
          <img class="asset-thumbnail" src="${speedLimitIcon}" alt="Icon 3">
        </div>
      </div>

      <div class="map-wrapper">
        <iframe src="${mapIframeUrl}" allowfullscreen="" loading="lazy"></iframe>
      </div>
    </div>

  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Autoplay resilience for hero video
      const v = document.getElementById('mainHeroVideo');
      if (v) {
        v.play().catch(function(err) {
          console.log('Hero video autoplay deferred until user interaction:', err);
          const playOnInteract = function() {
            v.play().catch(function() {});
            document.removeEventListener('click', playOnInteract);
            document.removeEventListener('touchstart', playOnInteract);
          };
          document.addEventListener('click', playOnInteract);
          document.addEventListener('touchstart', playOnInteract);
        });
      }
    });

    // Real-time message listener for live settings updates
    window.addEventListener('message', function(event) {
      if (!event.data) return;
      
      // Update Hero Video
      if (event.data.type === 'UPDATE_VIDEO' || event.data.type === 'UPDATE_HERO_VIDEO') {
        const videoUrl = event.data.url || event.data.heroVideo || event.data.videoUrl;
        if (videoUrl) {
          const v = document.getElementById('mainHeroVideo');
          if (v) {
            const src = v.querySelector('source');
            if (src) src.src = videoUrl;
            else v.src = videoUrl;
            v.load();
            v.play().catch(function() {});
          }
        }
      }

      // Update Hero Image
      if (event.data.type === 'UPDATE_HERO_IMAGE' || event.data.type === 'UPDATE_IMAGE') {
        const imgUrl = event.data.url || event.data.heroImage;
        if (imgUrl) {
          const heroImg = document.getElementById('mainHeroImg');
          if (heroImg) heroImg.src = imgUrl;
        }
      }

      // Update Showcase Cutout
      if (event.data.type === 'UPDATE_SHOWCASE' || event.data.type === 'UPDATE_SHOWCASE_IMAGE' || event.data.type === 'UPDATE_SHOWCASE_VIDEO') {
        const showcaseUrl = event.data.url || event.data.showcaseCarImage || event.data.showcaseCutout;
        if (showcaseUrl) {
          const scImg = document.getElementById('showcaseCarImg');
          if (scImg) scImg.src = showcaseUrl;
        }
      }

      // Update Program Images
      if (event.data.type === 'UPDATE_PROGRAM_IMAGE' || event.data.program1Image || event.data.program2Image || event.data.program3Image || event.data.program4Image) {
        if (event.data.program1Image || event.data.notebookImage) {
          const el = document.getElementById('programNotebookImg');
          if (el) el.src = event.data.program1Image || event.data.notebookImage;
        }
        if (event.data.program2Image || event.data.tabletImage) {
          const el = document.getElementById('programTabletImg');
          if (el) el.src = event.data.program2Image || event.data.tabletImage;
        }
        if (event.data.program3Image || event.data.steeringWheelImage) {
          const el = document.getElementById('programSteeringWheelImg');
          if (el) el.src = event.data.program3Image || event.data.steeringWheelImage;
        }
        if (event.data.program4Image || event.data.motorcycleImage) {
          const el = document.getElementById('programMotorcycleImg');
          if (el) el.src = event.data.program4Image || event.data.motorcycleImage;
        }
      }

      // Update Service Cards
      if (event.data.type === 'UPDATE_CARD_IMAGE' || event.data.card1Image || event.data.card2Image || event.data.card3Image) {
        if (event.data.card1Image || event.data.autoCarImage) {
          const el = document.getElementById('autoCarImg');
          if (el) el.src = event.data.card1Image || event.data.autoCarImage;
        }
        if (event.data.card2Image || event.data.manualCarImage) {
          const el = document.getElementById('manualCarImg');
          if (el) el.src = event.data.card2Image || event.data.manualCarImage;
        }
        if (event.data.card3Image || event.data.motoAcademyImage) {
          const el = document.getElementById('motoAcademyImg');
          if (el) el.src = event.data.card3Image || event.data.motoAcademyImage;
        }
      }
    });
  </script>

</body>
</html>`;
}
