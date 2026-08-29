// services/templates/elanPermisTemplate.js
// ÉLAN Permis — Master Template matching exact requested HTML structure and design for all niches

import { renderTransparentSliderSection } from './transparentSliderHelper.js';

export function buildElanPermisTemplate(lead = {}, content = {}, nicheKey = 'drivingSchool') {
  const brandName = lead.name || lead.companyName || lead.company || lead.businessName || content.heroTitle || 'ÉLAN Permis';
  const displayCity = lead.city || content.city || 'Paris';
  const phone = lead.phone || content.phone || '01 89 00 00 00';
  const email = lead.email || content.email || 'contact@elan-permis.fr';
  const lang = content.lang || content.language || lead.lang || lead.language || 'fr';
  const isEn = lang === 'en';

  const goldColor = content.primaryColor || content.accentColor || content.goldColor || content.highlightColor || lead.primaryColor || '#c9a96a';
  const gold2Color = content.gold2Color || content.accentLight || '#ead6aa';

  // Split brand name for logo styling
  const brandWords = brandName.split(' ');
  const brandNameUpperFirst = brandWords[0] ? brandWords[0].toUpperCase() : 'ÉLAN';
  const brandNameUpperSecond = brandWords.slice(1).join(' ').toUpperCase() || 'PERMIS';

  const activeNiche = (
    content.nicheOverride ||
    nicheKey ||
    lead.niche ||
    lead.sector ||
    lead.category ||
    'drivingSchool'
  ).toLowerCase();

  const isPlumber = activeNiche.includes('plumb') || activeNiche.includes('plomb') || activeNiche.includes('sanit');
  const isElectrician = activeNiche.includes('electr') || activeNiche.includes('électr');
  const isRealEstate = activeNiche.includes('real') || activeNiche.includes('immob') || activeNiche.includes('estate') || activeNiche.includes('agence');
  const isHvac = activeNiche.includes('hvac') || activeNiche.includes('clim') || activeNiche.includes('chauff') || activeNiche.includes('froid');
  const isLandscaping = activeNiche.includes('landscap') || activeNiche.includes('paysag') || activeNiche.includes('jardin') || activeNiche.includes('vert') || activeNiche.includes('hardscap') || activeNiche.includes('outdoor') || activeNiche.includes('terrasse') || activeNiche.includes('maçonnerie') || activeNiche.includes('stone') || activeNiche.includes('paving');
  const isRestaurant = activeNiche.includes('restau') || activeNiche.includes('food') || activeNiche.includes('cater') || activeNiche.includes('traiteur') || activeNiche.includes('bistr') || activeNiche.includes('gastro');
  const isDrivingSchool = activeNiche.includes('driv') || activeNiche.includes('auto-école') || activeNiche.includes('permis');

  const photos = Array.isArray(content.photos) && content.photos.length > 0 ? content.photos :
                 Array.isArray(lead.photos) && lead.photos.length > 0 ? lead.photos :
                 Array.isArray(lead.googlePhotos) && lead.googlePhotos.length > 0 ? lead.googlePhotos : [];

  // Images with pool fallbacks
  const cityLessonImg = content.heroImage || content.cityLessonImg || photos[0] || (
    isPlumber ? 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80' :
    isElectrician ? 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80' :
    isRealEstate ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80' :
    isHvac ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80' :
    isLandscaping ? 'https://images.unsplash.com/photo-1558904541-efa8c196b27d?auto=format&fit=crop&w=1600&q=80' :
    isRestaurant ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80' :
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80'
  );

  const instructorLessonImg = content.choice1Image || content.choice1Img || content.choiceImg || content.instructorLessonImg || photos[1] || (
    isPlumber ? 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80' :
    isElectrician ? 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=900&q=80' :
    isRealEstate ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80' :
    isHvac ? 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80' :
    isLandscaping ? 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80' :
    isRestaurant ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80' :
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80'
  );

  const codeClassroomImg = content.choice3Image || content.choice3Img || content.section1Image || content.codeClassroomImg || photos[2] || (
    isPlumber ? 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' :
    isElectrician ? 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80' :
    isRealEstate ? 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80' :
    isHvac ? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80' :
    isLandscaping ? 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a67?auto=format&fit=crop&w=800&q=80' :
    isRestaurant ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' :
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'
  );

  const roadLessonImg = content.choice4Image || content.choice4Img || content.section2Image || content.roadLessonImg || photos[3] || (
    isPlumber ? 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80' :
    isElectrician ? 'https://images.unsplash.com/photo-1565538810844-1e119412e8d0?auto=format&fit=crop&w=800&q=80' :
    isRealEstate ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' :
    isHvac ? 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80' :
    isLandscaping ? 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=800&q=80' :
    isRestaurant ? 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80' :
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80'
  );

  const instructorCoachingImg = content.choice5Image || content.choice5Img || content.aboutImage || content.instructorCoachingImg || photos[4] || (
    isPlumber ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' :
    isElectrician ? 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80' :
    isRealEstate ? 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80' :
    isHvac ? 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80' :
    isLandscaping ? 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=800&q=80' :
    isRestaurant ? 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' :
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'
  );

  // Dynamic Content Object Generation
  let nicheData = {
    eyebrow: isEn ? `PREMIUM DRIVING SCHOOL · ${displayCity}` : `AUTO-ÉCOLE PREMIUM · PERMIS B · ${displayCity}`,
    h1Line1: isEn ? 'Your driving license.' : 'Votre permis.',
    h1Line2: isEn ? 'With method.' : 'Avec méthode.',
    heroLead: isEn ? 'Theory, driving practice, tailored support and exam prep: an experience designed to make every step clearer, human, and simple to book.' : 'Code, conduite, accompagnement et examen : une expérience pensée pour rendre chaque étape plus claire, plus humaine et plus simple à réserver.',
    heroCtaPrimary: isEn ? 'Book an Appointment →' : 'Réserver un rendez-vous →',
    heroCtaSecondary: isEn ? 'View Programs' : 'Voir les formations',
    stat1Val: isEn ? '20 hrs*' : '20 h*', stat1Label: isEn ? 'minimum manual' : 'minimum en manuelle',
    stat2Val: isEn ? '13 hrs*' : '13 h*', stat2Label: isEn ? 'minimum automatic' : 'minimum en automatique',
    stat3Val: isEn ? '15 yrs*' : '15 ans*', stat3Label: isEn ? 'to start early AAC' : "pour commencer l'AAC",
    disclaimer: isEn ? '* Standard situations subject to regulatory conditions.' : '* Situations standard et sous réserve des conditions réglementaires applicables.',
    navServices: isEn ? 'Programs' : 'Formations', navMethod: isEn ? 'Method' : 'Méthode', navParcours: isEn ? 'Path' : 'Parcours', navTarifs: isEn ? 'Pricing' : 'Tarifs', navCta: isEn ? 'Book Online' : 'Réserver',
    servicesKicker: isEn ? 'NOT JUST ONE WAY TO LEARN' : "PAS UNE SEULE FAÇON D'APPRENDRE",
    servicesTitle: isEn ? 'Choose the path tailored to you.' : 'Choisissez le parcours qui vous ressemble.',
    servicesLead: isEn ? 'A true driving school presents multiple learning paths clearly without overwhelming the student.' : "Une vraie auto-école doit pouvoir présenter plusieurs voies d'apprentissage sans noyer l'élève sous des paragraphes.",
    methodeKicker: isEn ? 'A VISIBLE METHODOLOGY' : 'UNE MÉTHODE VISIBLE',
    methodeTitle: isEn ? 'Not a row of four boxes. A real roadmap.' : 'Pas une rangée de quatre boîtes. Un vrai parcours.',
    methodeLead: isEn ? 'Every step becomes interactive: students visualize their trajectory and know what comes next.' : "L'élève visualise son chemin, comprend ce qui se passe maintenant et sait ce qui vient ensuite.",
    parcoursKicker: isEn ? 'LEARNING IN REAL LIFE' : 'APPRENDRE DANS LA VRAIE VIE',
    parcoursTitle: isEn ? 'Real situations, real images, concrete results.' : 'Des images, des situations, du concret.',
    parcoursLead: isEn ? 'Each visual module delivers a clear view of the hands-on driving experience.' : "Chaque bloc utilise un visuel pour donner immédiatement une idée de l'expérience proposée.",
    humanKicker: isEn ? 'MORE THAN A DRIVING SCHOOL' : "PLUS QU'UNE VOITURE-ÉCOLE",
    humanTitle: isEn ? 'A human-centered learning experience.' : 'Un accompagnement qui reste humain.',
    humanLead: isEn ? 'Technology makes scheduling and tracking effortless. The instructor remains at the core.' : "La technologie facilite la réservation et le suivi. Le moniteur reste au centre de l'apprentissage.",
    tarifsKicker: isEn ? 'TRANSPARENT RATES' : 'TARIFS LISIBLES',
    tarifsTitle: isEn ? 'Clear pricing understood in seconds.' : 'Le prix doit être compris en quelques secondes.',
    tarifsLead: isEn ? 'Transparent prices for packages, extra hours, skills audit, and conditions.' : "Des forfaits clairs pour maîtriser son budget sans mauvaise surprise.",
    bookingKicker: isEn ? 'ONLINE BOOKING' : 'RÉSERVATION EN LIGNE',
    bookingTitle: isEn ? 'A booking experience like a real service.' : 'Une réservation qui ressemble à un vrai service.',
    bookingLead: isEn ? 'Select your program, date, and time slot. Our team confirms availability instantly.' : "On choisit d'abord le besoin, puis la date et le créneau pour planifier votre formation.",
    whyKicker: isEn ? 'WHY CHOOSE US' : 'POURQUOI CHOISIR NOTRE AUTO-ÉCOLE',
    whyTitle: isEn ? 'The details that make the difference.' : 'Des détails qui font la différence.',
    whyLead: isEn ? 'Clear answers to common questions: organization, instructor pedagogy, and availability.' : "Des réponses claires avant d'engager votre projet.",
    faqKicker: 'FAQ',
    faqTitle: isEn ? 'Answers before your first call.' : 'Les réponses avant même le premier appel.',
    faqLead: isEn ? 'Essential regulatory and practical details presented simply and clearly.' : "Les informations clés présentées simplement pour éclairer votre choix.",
    ctaKicker: isEn ? 'NEXT STEP' : 'VOTRE PROCHAINE ÉTAPE',
    ctaTitle: isEn ? 'Your license starts with a great first meeting.' : 'Le permis commence par un bon premier rendez-vous.',
    ctaLead: isEn ? 'Share your availability and goal. Our team will guide you to the best program.' : "Présentez votre situation, vos disponibilités et votre objectif.",
    ctaPrimary: isEn ? 'Book Now →' : 'Réserver maintenant →',
    ctaSecondary: isEn ? 'Call School' : "Appeler l'auto-école"
  };

  if (isPlumber) {
    nicheData = {
      ...nicheData,
      eyebrow: isEn ? `24/7 EMERGENCY PLUMBING · ${displayCity}` : `PLOMBERIE & CHAUFFAGE 24/7 · ${displayCity}`,
      h1Line1: isEn ? 'Your plumbing systems.' : 'Vos installations.',
      h1Line2: isEn ? 'With master precision.' : 'En toute sérénité.',
      heroLead: isEn ? 'Emergency repairs, pipe leak detection, water heater replacement and bathroom fitting with guaranteed pricing and 10-year warranty.' : 'Dépannage d\'urgence 24/7, recherche de fuite, chauffe-eau et rénovation sanitaire : des artisans qualifiés avec tarifs agréés et garantie décennale.',
      heroCtaPrimary: isEn ? 'Request SOS Repair →' : 'Demander un dépannage →',
      heroCtaSecondary: isEn ? 'View Plumbing Services' : 'Voir nos prestations',
      stat1Val: '30 min*', stat1Label: isEn ? 'emergency response' : 'délai d\'intervention',
      stat2Val: '100%*', stat2Label: isEn ? 'approved clear rates' : 'tarifs agréés & clairs',
      stat3Val: '10 yrs*', stat3Label: isEn ? 'guaranteed warranty' : 'garantie décennale',
      disclaimer: isEn ? '* Standard arrival time depending on traffic and local technician availability.' : '* Intervention standard sous réserve de disponibilité immédiate des équipes.',
      navServices: isEn ? 'Services' : 'Prestations', navMethod: isEn ? 'Method' : 'Méthode', navParcours: isEn ? 'Projects' : 'Réalisations', navTarifs: isEn ? 'Rates' : 'Tarifs', navCta: isEn ? 'Get Quote' : 'Devis SOS',
      servicesKicker: isEn ? 'EXPERT PLUMBING SERVICES' : 'NOS PRESTATIONS PLOMBERIE',
      servicesTitle: isEn ? 'Choose the repair or service you need.' : 'Choisissez la prestation adaptée à votre urgence.',
      servicesLead: isEn ? 'From immediate leak stops to complete bathroom overhauls, discover our transparent services.' : 'Du simple dépannage d\'urgence à la création complète de salle de bain, un artisan certifié à votre écoute.',
      methodeKicker: isEn ? 'SAFETY & QUALITY METHOD' : 'NOTRE PROTOCOLE QUALITÉ',
      methodeTitle: isEn ? 'Clear diagnostics. Zero hidden fees.' : 'Pas de surprise. Un diagnostic transparent.',
      methodeLead: isEn ? 'Every job follows strict plumbing standards to ensure durable, safe water networks.' : 'Chaque intervention respecte les normes DTU pour garantir la durabilité de vos réseaux d\'eau.',
      parcoursKicker: isEn ? 'OUR PLUMBING WORK' : 'NOS RÉALISATIONS',
      parcoursTitle: isEn ? 'Clean installs, tested pipelines, real proof.' : 'Chantiers propres, réseaux testés, du concret.',
      parcoursLead: isEn ? 'Browse through our recent installations and emergency repair projects.' : 'Découvrez nos interventions sanitaires et installations récentes.',
      humanKicker: isEn ? 'TRUSTED LOCAL CRAFTSMEN' : 'VOTRE ARTISAN DE CONFIANCE',
      humanTitle: isEn ? 'Honest plumbing advice and long-term care.' : 'Un accompagnement transparent et humain.',
      humanLead: isEn ? 'Beyond fixing leaks, we help you optimize water efficiency and prevent future pipe damage.' : 'Nous privilégions l\'honnêteté tarifaire et les conseils d\'entretien préventif.',
      tarifsKicker: isEn ? 'TRANSPARENT PLUMBING RATES' : 'TARIFS DÉPANNAGE & FORFAITS',
      tarifsTitle: isEn ? 'Upfront pricing before work begins.' : 'Tarification claire validée avant travaux.',
      tarifsLead: isEn ? 'Check our standard intervention packages with no hidden costs.' : 'Des prix transparents pour vos dépannages et installations courantes.',
      bookingKicker: isEn ? 'BOOK A PLUMBER' : 'DEMANDE D\'INTERVENTION',
      bookingTitle: isEn ? 'Schedule an intervention or emergency call.' : 'Réservez votre créneau avec un artisan qualifié.',
      bookingLead: isEn ? 'Fill in your details and urgency. Our plumbing team will contact you in under 15 mins.' : 'Renseignez votre besoin. Un technicien valide votre demande immédiatement.',
      whyKicker: isEn ? 'WHY TRUST US' : 'POURQUOI NOS CLIENTS NOUS FONT CONFIANCE',
      whyTitle: isEn ? 'The standards that protect your home.' : 'Des garanties qui font la différence.',
      whyLead: isEn ? 'State certified plumbers, official insurance, and prompt customer care.' : 'Des professionnels qualifiés et un matériel de haute qualité.',
      ctaKicker: isEn ? 'NEED A PLUMBER?' : 'UNE FUITE ? UNE URGENCE ?',
      ctaTitle: isEn ? 'Your plumbing peace of mind starts with one call.' : 'Votre problème résolu dans les plus brefs délais.',
      ctaLead: isEn ? 'Our team is ready to intervene 24/7 across the entire metro area.' : 'Nos plombiers interviennent 24h/24 et 7j/7 dans toute la région.',
      ctaPrimary: isEn ? 'Request Free Quote →' : 'Obtenir mon devis gratuit →',
      ctaSecondary: isEn ? 'Call Plumber' : 'Appeler le plombier'
    };
  } else if (isElectrician) {
    nicheData = {
      ...nicheData,
      eyebrow: isEn ? `CERTIFIED ELECTRICIAN 24/7 · ${displayCity}` : `ÉLECTRICIEN QUALIFIÉ 24/7 · ${displayCity}`,
      h1Line1: isEn ? 'Your electrical safety.' : 'Vos installations.',
      h1Line2: isEn ? 'Completely secured.' : 'En toute sécurité.',
      heroLead: isEn ? 'Power outage repair, breaker panel compliance, short circuit diagnostics and EV charger setup with certified code compliance.' : 'Dépannage 24/7, remise aux normes NF C 15-100, tableau électrique et borne de recharge IRVE : sécurité maximale et intervention rapide.',
      heroCtaPrimary: isEn ? 'Request Electrician →' : 'Demander un électricien →',
      heroCtaSecondary: isEn ? 'View Electrical Services' : 'Voir les prestations',
      stat1Val: '30 min*', stat1Label: isEn ? 'emergency arrival' : 'délai d\'intervention',
      stat2Val: '100%*', stat2Label: isEn ? 'NFC 15-100 certified' : 'norme NF C 15-100',
      stat3Val: '15+ yrs*', stat3Label: isEn ? 'field experience' : 'ans d\'expérience',
      disclaimer: isEn ? '* Fast response subject to emergency technician dispatch.' : '* Intervention d\'urgence sous réserve de disponibilité.',
      navServices: isEn ? 'Services' : 'Services', navMethod: isEn ? 'Standards' : 'Normes', navParcours: isEn ? 'Works' : 'Chantiers', navTarifs: isEn ? 'Prices' : 'Tarifs', navCta: isEn ? 'Call SOS' : 'Urgence 24/7',
      servicesKicker: isEn ? 'ELECTRICAL EXPERTISE' : 'EXPERTISE ÉLECTRIQUE',
      servicesTitle: isEn ? 'Safe, certified electrical solutions.' : 'Des interventions adaptées à vos besoins.',
      servicesLead: isEn ? 'From sudden blackout repair to smart home wiring, our master technicians handle everything safely.' : 'Du dépannage express au remplacement de tableau disjoncteur, sécurité garantie.',
      methodeKicker: isEn ? 'CODE COMPLIANCE METHOD' : 'RIGOUREUX & SÉCURISÉ',
      methodeTitle: isEn ? 'Strict diagnostic before powering on.' : 'Diagnostic rigoureux avant toute remise sous tension.',
      methodeLead: isEn ? 'We strictly apply current electrical regulations to shield your family and appliances.' : 'Mise en conformité rigoureuse pour éliminer les risques d\'incendie et de surtension.',
      parcoursKicker: isEn ? 'RECENT PROJECTS' : 'NOS CHANTIERS ÉLECTRIQUES',
      parcoursTitle: isEn ? 'Precision wiring, clean panels, reliable power.' : 'Câblages soignés, tableaux certifiés, du solide.',
      parcoursLead: isEn ? 'Inspect our recent panel upgrades, LED installations, and IRVE EV charger setups.' : 'Aperçu de nos installations électriques résidentielles et tertiaires.',
      humanKicker: isEn ? 'MASTER ELECTRICIAN' : 'ARTISAN ÉLECTRICIEN',
      humanTitle: isEn ? 'Excellence in work and human advice.' : 'La sécurité électrique sans concession.',
      humanLead: isEn ? 'Clear explanations of your network state, clear pricing, and insurance-backed guarantees.' : 'Accompagnement pédagogique pour comprendre votre réseau et réduire votre consommation.',
      tarifsKicker: isEn ? 'CLEAR ELECTRICAL RATES' : 'TARIFS TRANSPARENTS',
      tarifsTitle: isEn ? 'Upfront pricing before work begins.' : 'Tarifs transparents sans coûts cachés.',
      tarifsLead: isEn ? 'Fixed rate pricing for emergency repairs, audits, and upgrades.' : 'Des prix clairs pour vos dépannages et remises aux normes.',
      bookingKicker: isEn ? 'BOOK AN ELECTRICIAN' : 'DEMANDE DE DEVIS & RDV',
      bookingTitle: isEn ? 'Book an electrician or request an emergency audit.' : 'Prenez rendez-vous avec un électricien certifié.',
      bookingLead: isEn ? 'Submit your request. We assign the closest certified technician to your address.' : 'Renseignez vos coordonnées. Notre équipe vous recontacte en quelques minutes.',
      whyKicker: isEn ? 'WHY US' : 'ENGAGEMENTS QUALITÉ',
      whyTitle: isEn ? 'Certifications that guarantee total safety.' : 'La garantie d\'une sécurité totale.',
      whyLead: isEn ? 'Consuel certification, 10-year insurance policy, and top-grade electrical gear.' : 'Appareillage Legrand/Schneider et attestation de conformité Consuel.',
      ctaKicker: isEn ? 'ELECTRICAL EMERGENCY?' : 'PANNE DE COURANT ? UN PROJET ?',
      ctaTitle: isEn ? 'Secure your home electrical system today.' : 'Faites sécuriser votre réseau par un expert.',
      ctaLead: isEn ? 'Our emergency response team is available 24 hours a day, 7 days a week.' : 'Assistance rapide 24h/24 et 7j/7 pour rétablir votre courant.',
      ctaPrimary: isEn ? 'Book Electrician Now →' : 'Prendre rendez-vous →',
      ctaSecondary: isEn ? 'Call Electrician' : 'Appeler l\'électricien'
    };
  } else if (isRealEstate) {
    nicheData = {
      ...nicheData,
      eyebrow: isEn ? `PREMIUM REAL ESTATE ADVISORY · ${displayCity}` : `AGENCE IMMOBILIÈRE DE PRESTIGE · ${displayCity}`,
      h1Line1: isEn ? 'Your real estate goals.' : 'Votre projet immobilier.',
      h1Line2: isEn ? 'Handled with precision.' : 'Avec méthode.',
      heroLead: isEn ? 'Valuations, sales strategy, premium property staging and personalized transaction support for buyers and sellers.' : 'Estimation offerte, vente, location et conseil en investissement : un accompagnement sur mesure pour valoriser et concrétiser votre projet.',
      heroCtaPrimary: isEn ? 'Free Property Estimate →' : 'Demander mon estimation →',
      heroCtaSecondary: isEn ? 'Browse Listings' : 'Voir nos biens',
      stat1Val: '98%*', stat1Label: isEn ? 'successful sales' : 'ventes concrétisées',
      stat2Val: '15 days*', stat2Label: isEn ? 'average valuation time' : 'délai moyen d\'estimation',
      stat3Val: '500+*', stat3Label: isEn ? 'accompanied clients' : 'projets concrétisés',
      disclaimer: isEn ? '* Based on internal market transactions completed in the sector.' : '* Statistiques basées sur les transactions réalisées sur notre secteur.',
      navServices: isEn ? 'Services' : 'Services', navMethod: isEn ? 'Strategy' : 'Stratégie', navParcours: isEn ? 'Listings' : 'Nos Biens', navTarifs: isEn ? 'Fees' : 'Honoraires', navCta: isEn ? 'Estimate Property' : 'Estimer mon bien',
      servicesKicker: isEn ? 'REAL ESTATE SERVICES' : 'NOS SERVICES IMMOBILIERS',
      servicesTitle: isEn ? 'Tailored solutions for sellers, buyers & landlords.' : 'Un accompagnement adapté à chaque étape.',
      servicesLead: isEn ? 'From accurate property valuation to final notary signature, rely on experienced local realtors.' : 'De la mise en valeur photo à la signature notariale, un suivi rigoureux.',
      methodeKicker: isEn ? 'TRANSACTION METHODOLOGY' : 'NOTRE DÉMARCHE VENTE',
      methodeTitle: isEn ? 'Data-driven marketing. Targeted buyers.' : 'Une commercialisation ciblée et efficace.',
      methodeLead: isEn ? 'We combine professional photography, active buyer databases, and local market analysis for optimal pricing.' : 'Mise en valeur HD, diffusion premium et sélection d\'acquéreurs qualifiés.',
      parcoursKicker: isEn ? 'EXCLUSIVITY & PROPERTIES' : 'NOTRE SÉLECTION IMMOBILIÈRE',
      parcoursTitle: isEn ? 'Houses, apartments, and investments in prime locations.' : 'Des biens d\'exception et des opportunités rares.',
      parcoursLead: isEn ? 'Discover our featured portfolio of residential properties and investments.' : 'Découvrez quelques exemples de biens accompagnés à la vente et à la location.',
      humanKicker: isEn ? 'YOUR DEDICATED REALTOR' : 'UN INTERLOCUTEUR DÉDIÉ',
      humanTitle: isEn ? 'Human values and transparent negotiations.' : 'Une relation fondée sur la confiance.',
      humanLead: isEn ? 'A single point of contact guides you through legal diagnostics, mortgage financing, and closing.' : 'Un conseiller unique suit votre dossier de A à Z avec réactivité et transparence.',
      tarifsKicker: isEn ? 'CLEAR COMMISSION FEES' : 'HONORAIRES DE TRANSACTION',
      tarifsTitle: isEn ? 'Transparent fee structures with no surprises.' : 'Des honoraires clairs et compétitifs.',
      tarifsLead: isEn ? 'Our sales and rental advisory packages are designed for complete clarity.' : 'Consultez nos forfaits d\'accompagnement et d\'estimation.',
      bookingKicker: isEn ? 'SCHEDULE A VALUATION' : 'DEMANDER UNE ESTIMATION',
      bookingTitle: isEn ? 'Book an in-person estimate or consultation.' : 'Prenez rendez-vous pour faire évaluer votre bien.',
      bookingLead: isEn ? 'Provide property details. Our local advisor will contact you within 24 hours.' : 'Renseignez les caractéristiques de votre bien pour fixer une visite d\'estimation.',
      whyKicker: isEn ? 'WHY CHOOSE OUR AGENCY' : 'LES ATOUTS DE NOTRE AGENCE',
      whyTitle: isEn ? 'High performance marketing and local expertise.' : 'Des outils modernes et un réseau solide.',
      whyLead: isEn ? 'HDR photos, virtual tours, verified buyer qualification, and local market presence.' : 'Visites 3D, visuels haute définition et fichier d\'acquéreurs qualifiés.',
      ctaKicker: isEn ? 'READY TO SELL OR BUY?' : 'UN PROJET IMMOBILIER ?',
      ctaTitle: isEn ? 'Let us discuss your property project over coffee.' : 'Discutons de votre projet en toute simplicité.',
      ctaLead: isEn ? 'Our advisors are at your service for free estimations and strategic consultation.' : 'Nos conseillers sont disponibles pour vous guider vers la réussite de votre transaction.',
      ctaPrimary: isEn ? 'Request Free Valuation →' : 'Demander mon estimation offerte →',
      ctaSecondary: isEn ? 'Call Agency' : 'Appeler l\'agence'
    };
  } else if (isHvac) {
    nicheData = {
      ...nicheData,
      eyebrow: isEn ? `HVAC & CLIMATE EXPERTS · ${displayCity}` : `CHAUFFAGE & CLIMATISATION · ${displayCity}`,
      h1Line1: isEn ? 'Your thermal comfort.' : 'Votre confort thermique.',
      h1Line2: isEn ? 'Optimized & efficient.' : 'En toute saison.',
      heroLead: isEn ? 'Heat pumps, air conditioning, boiler maintenance and energy-efficient ventilation installed by RGE certified technicians.' : 'Pompes à chaleur, climatisation réversible, entretien de chaudière et ventilation : des artisans RGE pour diviser vos factures d\'énergie.',
      heroCtaPrimary: isEn ? 'Request HVAC Quote →' : 'Demander une étude offerte →',
      heroCtaSecondary: isEn ? 'View HVAC Solutions' : 'Voir nos prestations',
      stat1Val: '24h*', stat1Label: isEn ? 'fast diagnostic' : 'délai de prise en charge',
      stat2Val: 'A+++', stat2Label: isEn ? 'energy efficiency' : 'performance énergétique',
      stat3Val: '100%*', stat3Label: isEn ? 'RGE certified firm' : 'certifié RGE & aides',
      disclaimer: isEn ? '* Eligible for government energy transition subsidies subject to audit.' : '* Éligible aux aides d\'État et MaPrimeRénov\' selon conditions de ressources.',
      navServices: isEn ? 'Services' : 'Solutions', navMethod: isEn ? 'Audits' : 'Méthode', navParcours: isEn ? 'Installations' : 'Réalisations', navTarifs: isEn ? 'Packages' : 'Forfaits', navCta: isEn ? 'Get Audit' : 'Devis Gratuit',
      servicesKicker: isEn ? 'HVAC & CLIMATE CONTROL' : 'NOS PRESTATIONS CLIMATISATION & CHAUFFAGE',
      servicesTitle: isEn ? 'Energy efficient heating & cooling.' : 'Des solutions adaptées à chaque bâtiment.',
      servicesLead: isEn ? 'Reversible air conditioning, air-to-water heat pumps, and maintenance contracts.' : 'De la pose de pompe à chaleur à l\'entretien annuel de vos systèmes thermiques.',
      methodeKicker: isEn ? 'THERMAL DIAGNOSTIC' : 'BILAN ÉNERGÉTIQUE',
      methodeTitle: isEn ? 'Custom sizing for maximum savings.' : 'Un dimensionnement précis pour réduire vos factures.',
      methodeLead: isEn ? 'We audit your home insulation and space volume to recommend the exact HVAC equipment.' : 'Analyse complète de vos besoins thermiques pour garantir un confort optimal toute l\'année.',
      parcoursKicker: isEn ? 'COMPLETED INSTALLATIONS' : 'NOS RÉALISATIONS THERMIQUES',
      parcoursTitle: isEn ? 'Clean setups, low decibel units, neat finishes.' : 'Des pompes à chaleur performantes et silencieuses.',
      parcoursLead: isEn ? 'Browse our recent heat pump and air conditioning installs.' : 'Découvrez nos installations chez des particuliers et professionnels.',
      humanKicker: isEn ? 'RGE CERTIFIED SPECIALIST' : 'EXPERT CERTIFIÉ RGE',
      humanTitle: isEn ? 'Professional guidance for government grants.' : 'Un accompagnement pour obtenir vos aides.',
      humanLead: isEn ? 'We assist you in building your subsidy files for MaPrimeRénov\' and CEE energy vouchers.' : 'Nous vous guidons pas à pas dans le montage de vos dossiers de primes énergie.',
      tarifsKicker: isEn ? 'HVAC FORFAITS' : 'FORFAITS DE MAINTENANCE & POSE',
      tarifsTitle: isEn ? 'Clear pricing for installation & maintenance.' : 'Des forfaits annuels d\'entretien tout inclus.',
      tarifsLead: isEn ? 'Explore our maintenance contracts and installation estimates.' : 'Masterisez vos coûts d\'énergie avec nos contrats d\'entretien réguliers.',
      bookingKicker: isEn ? 'REQUEST HVAC AUDIT' : 'DEMANDER UNE ÉTUDE',
      bookingTitle: isEn ? 'Schedule your free home thermal assessment.' : 'Prenez rendez-vous pour un bilan thermique gratuit.',
      bookingLead: isEn ? 'Submit your project details for an instant response from an HVAC specialist.' : 'Renseignez votre projet pour recevoir notre proposition chiffrée.',
      whyKicker: isEn ? 'WHY WORK WITH US' : 'ENGAGEMENTS CLIMATISATION',
      whyTitle: isEn ? 'Leading brands and certified installers.' : 'Le choix des plus grandes marques thermiques.',
      whyLead: isEn ? 'Daikin, Mitsubishi, Atlantic equipment with 10-year warranty.' : 'Matériel haut de gamme Garanti 10 ans et suivi SAV réactif.',
      ctaKicker: isEn ? 'UPGRADE YOUR HEATING?' : 'ENVIE DE RÉDUIRE VOS FACTURES ?',
      ctaTitle: isEn ? 'Start saving on energy bills today.' : 'Passez à la pompe à chaleur et économisez.',
      ctaLead: isEn ? 'Our RGE experts provide free home visits and detailed ROI calculations.' : 'Consultez nos experts pour une étude gratuite sur place.',
      ctaPrimary: isEn ? 'Claim Free Audit →' : 'Demander mon bilan gratuit →',
      ctaSecondary: isEn ? 'Call Technician' : 'Appeler le technicien'
    };
  } else if (isLandscaping) {
    nicheData = {
      ...nicheData,
      eyebrow: isEn ? `LANDSCAPE ARCHITECT & GARDENS · ${displayCity}` : `PAYSAGISTE & ESPACES VERTS · ${displayCity}`,
      h1Line1: isEn ? 'Your dream garden.' : 'Vos espaces verts.',
      h1Line2: isEn ? 'Designed with artistry.' : 'Sur mesure.',
      heroLead: isEn ? 'Garden design, paving, terrace construction, automatic irrigation and lawn care tailored for outdoor living.' : 'Création paysagère, terrasses bois et pierre, aliénation de jardins, entretien et arrosage automatique : des espaces extérieurs d\'exception.',
      heroCtaPrimary: isEn ? 'Request Garden Study →' : 'Demander mon étude paysagère →',
      heroCtaSecondary: isEn ? 'View Garden Portfolio' : 'Découvrir nos créations',
      stat1Val: '100%*', stat1Label: isEn ? 'custom garden designs' : 'créations sur mesure',
      stat2Val: '3D*', stat2Label: isEn ? 'modeling & render' : 'modélisation & devis',
      stat3Val: '15+ yrs*', stat3Label: isEn ? 'craftsmanship' : 'ans d\'expérience',
      disclaimer: isEn ? '* Project timelines depend on surface size and seasonal planting schedules.' : '* Délais d\'intervention selon la saisonnalité et l\'ampleur du projet.',
      navServices: isEn ? 'Services' : 'Créations', navMethod: isEn ? 'Design' : 'Méthode', navParcours: isEn ? 'Portfolio' : 'Réalisations', navTarifs: isEn ? 'Rates' : 'Tarifs', navCta: isEn ? 'Get Estimate' : 'Devis Jardin',
      servicesKicker: isEn ? 'OUTDOOR LANDSCAPING' : 'NOS PRESTATIONS PAYSAGÈRES',
      servicesTitle: isEn ? 'Bespoke landscapes & garden maintenance.' : 'Des aménagements extérieurs d\'exception.',
      servicesLead: isEn ? 'From wooden decks to Mediterranean planting, transform your outdoor spaces.' : 'Création de terrasses, maçonnerie paysagère, élagage et entretien annuel.',
      methodeKicker: isEn ? 'DESIGN METHODOLOGY' : 'NOTRE DÉMARCHE CRÉATIVE',
      methodeTitle: isEn ? 'From 3D sketch to lush green garden.' : 'De l\'esquisse 3D à la réalisation végétale.',
      methodeLead: isEn ? 'We model your outdoor space in 3D to visualize plant choices, materials, and lighting before building.' : 'Modélisation 3D préalable pour visualiser vos massifs, éclairages et terrasses.',
      parcoursKicker: isEn ? 'FEATURED GARDENS' : 'NOS JARDINS & TERRASSES',
      parcoursTitle: isEn ? 'Lush lawns, structured terraces, serene spaces.' : 'Terrasses élégantes, végétaux sélectionnés, du végétal d\'exception.',
      parcoursLead: isEn ? 'Explore our recent landscape creations for private estates and residential homes.' : 'Découvrez nos réalisations de jardins contemporains et terrasses.',
      humanKicker: isEn ? 'MASTER LANDSCAPER' : 'ARTISAN PAYSAGISTE',
      humanTitle: isEn ? 'Passion for nature and durable materials.' : 'La passion du végétal et des matériaux nobles.',
      humanLead: isEn ? 'Selecting eco-friendly plants, durable hardwoods, and water-saving irrigation systems.' : 'Sélection rigoureuse de plantes adaptées à votre sol et arrosage goutte-à-goutte économe.',
      tarifsKicker: isEn ? 'TRANSPARENT GARDEN RATES' : 'FORFAITS CRÉATION & ENTRETIEN',
      tarifsTitle: isEn ? 'Clear pricing for maintenance & projects.' : 'Des forfaits d\'entretien et devis personnalisés.',
      tarifsLead: isEn ? 'Discover our lawn care packages and landscaping project estimates.' : 'Forfaits d\'entretien annuel avec déduction fiscale de 50% selon éligibilité.',
      bookingKicker: isEn ? 'BOOK A LANDSCAPER' : 'DEMANDE D\'ÉTUDE PAYSAGÈRE',
      bookingTitle: isEn ? 'Book an on-site garden consultation.' : 'Prenez rendez-vous pour faire étudier votre jardin.',
      bookingLead: isEn ? 'Share your outdoor project ideas. Our landscape architect will visit your property.' : 'Présentez votre projet d\'aménagement pour fixer une visite sur place.',
      whyKicker: isEn ? 'WHY CHOOSE OUR LANDSCAPERS' : 'ENGAGEMENTS PAYSAGE',
      whyTitle: isEn ? 'Sustainable designs built to flourish over time.' : 'Des espaces conçus pour durer et s\'épanouir.',
      whyLead: isEn ? 'Handpicked nursery plants, sturdy paving, and 50% tax credit on maintenance.' : 'Végétaux de pépinière qualifiés et déduction fiscale services à la personne.',
      ctaKicker: isEn ? 'READY TO TRANSFORM YOUR OUTDOORS?' : 'UN PROJET DE JARDIN ?',
      ctaTitle: isEn ? 'Create your outdoor sanctuary this season.' : 'Donnez vie à vos espaces extérieurs.',
      ctaLead: isEn ? 'Our team is ready to design and construct your custom terrace and garden.' : 'Nos paysagistes vous accompagnent de la conception à la plantation.',
      ctaPrimary: isEn ? 'Request 3D Study →' : 'Demander mon projet 3D →',
      ctaSecondary: isEn ? 'Call Landscaper' : 'Appeler le paysagiste'
    };
  } else if (isRestaurant) {
    nicheData = {
      ...nicheData,
      eyebrow: isEn ? `GASTRONOMY & FINE DINING · ${displayCity}` : `GASTRONOMIE & TABLE GOURMANDE · ${displayCity}`,
      h1Line1: isEn ? 'Your culinary journey.' : 'Une expérience culinaire.',
      h1Line2: isEn ? 'Guided by passion.' : 'D\'exception.',
      heroLead: isEn ? 'Seasonal ingredients, signature dishes, warm hospitality and private catering for unforgettable dining moments.' : 'Produits frais et de saison, recettes signatures et ambiance chaleureuse : une cuisine passionnée au cœur de la ville.',
      heroCtaPrimary: isEn ? 'Reserve a Table →' : 'Réserver une table →',
      heroCtaSecondary: isEn ? 'View Our Menu' : 'Découvrir la carte',
      stat1Val: '100%*', stat1Label: isEn ? 'fresh local produce' : 'produits frais & locaux',
      stat2Val: '4.9/5', stat2Label: isEn ? 'gastronomic rating' : 'note gastronomique',
      stat3Val: '7d/7', stat3Label: isEn ? 'continuous service' : 'service continu & terrasse',
      disclaimer: isEn ? '* Reservations recommended for weekend lunch and dinner service.' : '* Réservation fortement conseillée pour les services du soir et week-end.',
      navServices: isEn ? 'Menu' : 'La Carte', navMethod: isEn ? 'Cuisine' : 'Savoir-Faire', navParcours: isEn ? 'Dishes' : 'Plats Signatures', navTarifs: isEn ? 'Menus' : 'Formules', navCta: isEn ? 'Book Table' : 'Réserver',
      servicesKicker: isEn ? 'OUR CULINARY OFFERINGS' : 'NOTRE CARTE & FORMULES',
      servicesTitle: isEn ? 'Refined dishes, fresh seasonal harvests.' : 'Une carte inspirée par les produits de saison.',
      servicesLead: isEn ? 'Discover our chef\'s menu, wine pairings, and event catering options.' : 'Assiettes gourmandes, menus dégustation et sélections de vins de vignerons.',
      methodeKicker: isEn ? 'CULINARY ART' : 'NOTRE SAVOIR-FAIRE',
      methodeTitle: isEn ? 'From farm to table with rigorous care.' : 'Du marché à l\'assiette, une rigueur passionnée.',
      methodeLead: isEn ? 'We select our meat, fish, and vegetables directly from local sustainable producers.' : 'Partenariats avec des producteurs locaux pour garantir authenticité et fraîcheur.',
      parcoursKicker: isEn ? 'SIGNATURE DISHES' : 'NOS SPÉCIALITÉS SIGNATURES',
      parcoursTitle: isEn ? 'A feast for the eyes and the palate.' : 'Des couleurs, du goût et des assiettes soignées.',
      parcoursLead: isEn ? 'Sneak peek of our signature starters, main courses, and house desserts.' : 'Aperçu de nos créations gourmandes servies quotidiennement.',
      humanKicker: isEn ? 'CHEF & HOSPITALITY' : 'L\'ÉQUIPE EN CUISINE',
      humanTitle: isEn ? 'A team dedicated to your culinary pleasure.' : 'Un service attentionné et une cuisine sincère.',
      humanLead: isEn ? 'Our chef and dining staff ensure every detail of your meal is comfortable and memorable.' : 'Savoir-recevoir, passion du produit et convivialité en salle.',
      tarifsKicker: isEn ? 'MENUS & PRICES' : 'FORMULES DE DÉJEUNER & DINER',
      tarifsTitle: isEn ? 'Accessible gastronomy and tasting menus.' : 'Des formules accessibles pour tous les gourmets.',
      tarifsLead: isEn ? 'Explore our lunch formulas, tasting menu, and drinks list.' : 'Formule du midi rapide et menus dégustation accord mets & vins.',
      bookingKicker: isEn ? 'ONLINE RESERVATION' : 'RÉSERVER UNE TABLE',
      bookingTitle: isEn ? 'Book your table in just a few clicks.' : 'Réservez votre moment parmi nous.',
      bookingLead: isEn ? 'Select date, time, and guest count. Immediate phone confirmation.' : 'Choisissez votre créneau et le nombre de convives pour garantir votre table.',
      whyKicker: isEn ? 'WHY DINING WITH US' : 'LES ATOUTS DE NOTRE TABLE',
      whyTitle: isEn ? 'Authentic flavors and cozy atmosphere.' : 'L\'assurance d\'un repas réussi.',
      whyLead: isEn ? 'Homemade desserts, fresh fish catch of the day, and private salon booking.' : 'Cuisine 100% fait maison et espace privatisable pour groupes.',
      ctaKicker: isEn ? 'JOIN US FOR DINNER?' : 'ENVIE D\'UNE BONNE TABLE ?',
      ctaTitle: isEn ? 'Taste the difference of true culinary passion.' : 'Venez partager un moment gourmand.',
      ctaLead: isEn ? 'Our doors are open daily. Book online or call us for group catering.' : 'Toute l\'équipe vous accueille dans une ambiance conviviale.',
      ctaPrimary: isEn ? 'Book Table Now →' : 'Réserver ma table →',
      ctaSecondary: isEn ? 'Call Restaurant' : 'Appeler le restaurant'
    };
  } else if (!isDrivingSchool) {
    const rawNicheName = (lead.niche || lead.sector || activeNiche || 'Services').trim();
    const cleanNiche = rawNicheName.charAt(0).toUpperCase() + rawNicheName.slice(1);
    nicheData = {
      ...nicheData,
      eyebrow: isEn ? `EXPERT ${cleanNiche.toUpperCase()} · ${displayCity}` : `EXPERT ${cleanNiche.toUpperCase()} · ${displayCity}`,
      h1Line1: isEn ? `Your ${cleanNiche} projects.` : `Vos projets de ${cleanNiche}.`,
      h1Line2: isEn ? 'Handled with precision.' : 'En toute sérénité.',
      heroLead: content.heroSubtitle || (isEn ? `Professional ${cleanNiche} services, fast response, transparent pricing and guaranteed quality work in ${displayCity}.` : `Prestations de ${cleanNiche} sur mesure, réactivité, tarifs transparents et travail soigné à ${displayCity}.`),
      heroCtaPrimary: isEn ? 'Get Free Estimate →' : 'Obtenir un devis gratuit →',
      heroCtaSecondary: isEn ? 'View Our Services' : 'Voir nos prestations',
      stat1Val: '100%*', stat1Label: isEn ? 'guaranteed satisfaction' : 'satisfaction garantie',
      stat2Val: '24/7', stat2Label: isEn ? 'fast inquiry response' : 'réponse rapide',
      stat3Val: '15+ yrs*', stat3Label: isEn ? 'field experience' : 'ans d\'expérience',
      disclaimer: isEn ? '* Standard service delivery subject to schedule availability.' : '* Prestations réalisées selon les règles de l\'art et sur devis préalable.',
      navServices: isEn ? 'Services' : 'Services', navMethod: isEn ? 'Method' : 'Méthode', navParcours: isEn ? 'Projects' : 'Réalisations', navTarifs: isEn ? 'Rates' : 'Tarifs', navCta: isEn ? 'Get Quote' : 'Devis Gratuit',
      servicesKicker: isEn ? `OUR ${cleanNiche.toUpperCase()} SERVICES` : `NOS PRESTATIONS DE ${cleanNiche.toUpperCase()}`,
      servicesTitle: isEn ? 'Tailored solutions for all your requirements.' : 'Des solutions adaptées à toutes vos demandes.',
      servicesLead: isEn ? 'Discover our complete range of interventions and specialized support.' : 'Découvrez nos prestations clés en main avec conseils d\'experts.',
      methodeKicker: isEn ? 'OUR QUALITY METHODOLOGY' : 'NOTRE PROTOCOLE QUALITÉ',
      methodeTitle: isEn ? 'Rigorous process. Guaranteed results.' : 'Un déroulé clair et sans surprise.',
      methodeLead: isEn ? 'From initial assessment to final delivery, we adhere to strict quality standards.' : 'Chaque projet suit une méthodologie éprouvée pour garantir votre satisfaction.',
      parcoursKicker: isEn ? 'FEATURED PROJECTS' : 'NOS RÉALISATIONS',
      parcoursTitle: isEn ? 'Proven expertise, clean execution, real results.' : 'Chantiers soignés, réalisations concrètes.',
      parcoursLead: isEn ? 'Explore our recent interventions and client projects.' : 'Aperçu de nos réalisations récentes auprès des particuliers et professionnels.',
      humanKicker: isEn ? 'DEDICATED SPECIALISTS' : 'VOTRE ARTISAN DE CONFIANCE',
      humanTitle: isEn ? 'Human values and transparent communication.' : 'Un accompagnement de proximité.',
      humanLead: isEn ? 'A dedicated advisor guides you through every phase of your project.' : 'Un interlocuteur unique vous écoute et valide vos choix.',
      tarifsKicker: isEn ? 'TRANSPARENT RATES' : 'TARIFS TRANSPARENTS',
      tarifsTitle: isEn ? 'Clear pricing with no hidden costs.' : 'Une tarification lisible et maîtrisée.',
      tarifsLead: isEn ? 'Explore our standard service packages and custom project estimates.' : 'Des forfaits clairs et devis personnalisés sans surprise.',
      bookingKicker: isEn ? 'BOOK A SERVICE' : 'RÉSERVATION & DEVIS',
      bookingTitle: isEn ? 'Schedule an intervention or consult our team.' : 'Prenez rendez-vous avec un spécialiste.',
      bookingLead: isEn ? 'Share your project details. We confirm availability immediately.' : 'Renseignez votre demande pour recevoir notre réponse rapidement.',
      whyKicker: isEn ? 'WHY WORK WITH US' : 'POURQUOI NOUS CHOISIR',
      whyTitle: isEn ? 'Commitments that guarantee peace of mind.' : 'Des engagements forts pour votre sérénité.',
      whyLead: isEn ? 'Certified team, top quality materials, and dedicated follow-up.' : 'Professionnels qualifiés, matériel certifié et suivi personnalisé.',
      ctaKicker: isEn ? 'READY TO START YOUR PROJECT?' : 'UN PROJET EN TÊTE ?',
      ctaTitle: isEn ? 'Let us bring your project to life today.' : 'Concrétisez votre projet avec un expert.',
      ctaLead: isEn ? 'Contact our team for a free consultation and personalized quote.' : 'Nos conseillers sont à votre disposition pour étudier votre demande.',
      ctaPrimary: isEn ? 'Request Free Quote →' : 'Demander mon devis gratuit →',
      ctaSecondary: isEn ? 'Contact Us' : 'Nous contacter'
    };
  }

  // Choices Object Mapping according to Niche
  const getChoicesData = () => {
    if (isPlumber) {
      return {
        choice1: { k: isEn ? 'EMERGENCY REPAIR' : 'DÉPANNAGE 24/7', t: isEn ? 'Urgent Water Leak Stop' : 'Recherche & Réparation de Fuite', d: isEn ? 'Immediate intervention to isolate water leaks, replace broken pipes, and prevent property water damage.' : "Intervention d'urgence pour stopper les fuites encastrées ou apparentes et sécuriser vos canalisations.", img: instructorLessonImg, l: [isEn ? 'Arrival in under 30 minutes' : 'Arrivée rapide sous 30 minutes', isEn ? 'Thermal leak detection camera' : 'Caméra thermique & recherche non destructive', isEn ? 'Upfront clear cost estimate' : 'Devis clair avant toute réparation', isEn ? 'Insurance compliant reports' : 'Prise en charge assurances'] },
        choice2: { k: isEn ? 'DRAIN UNCLOGGING' : 'DÉBOUCHAGE RAPÌDE', t: isEn ? 'Pipe & Sewer Unclogging' : 'Débouchage de Canalisation', d: isEn ? 'High pressure jetting to unblock sinks, toilets, and main sewer pipes quickly.' : "Débouchage haute pression pour évier, WC, douche et réseaux généraux d'évacuation.", img: cityLessonImg, l: [isEn ? 'Hydro-jetting equipment' : 'Passage de furet & hydrocurage', isEn ? 'Video camera pipe inspection' : 'Inspection vidéo par caméra', isEn ? 'Odor elimination & sanitizing' : 'Élimination des odeurs & nettoyage', isEn ? '24/7 emergency dispatch' : 'Disponible 24h/24 et 7j/7'] },
        choice3: { k: isEn ? 'WATER HEATERS' : 'CHAUFFE-EAU', t: isEn ? 'Water Heater Replacement' : 'Remplacement & Pose Chauffe-eau', d: isEn ? 'Electric, thermodynamic, and gas water heater installations with energy saving specs.' : "Remplacement express de cumulus en panne, installation de chauffe-eau thermodynamique économe.", img: codeClassroomImg, l: [isEn ? 'Same-day emergency swap' : 'Remplacement le jour même si panne totale', isEn ? 'Top brands: Atlantic, Ariston' : 'Marques leaders : Atlantic, De Dietrich', isEn ? 'Safety valve replacement' : 'Pose de groupe de sécurité neuf', isEn ? '10-year installation warranty' : 'Garantie décennale entreprise'] },
        choice4: { k: isEn ? 'BATHROOM RENOVATION' : 'SALLE DE BAIN', t: isEn ? 'Walk-in Shower & Sanitary' : 'Création & Rénovation Salle de Bain', d: isEn ? 'Full bathroom fitting: Italian walk-in showers, vanity units, and modern fixtures.' : "Aménagement complet de salle de bain PMR ou design : douche à l'italienne, meuble vasque et robinetterie.", img: roadLessonImg, l: [isEn ? 'Complete turn-key fitting' : 'Prise en charge de A à Z', isEn ? 'Waterproofing DTU compliant' : 'Étanchéité sous carrelage certifiée', isEn ? 'Modern water-saving faucets' : 'Robinetterie thermostatique moderne', isEn ? 'Free 3D layout project' : 'Devis & plan d\'aménagement gratuit'] },
        choice5: { k: isEn ? 'HEATING & BOILER' : 'CHAUFFAGE', t: isEn ? 'Boiler Maintenance & Care' : 'Entretien Chaudière & Radiateurs', d: isEn ? 'Annual boiler servicing, sludge flushing, and radiator thermostat installation.' : "Désembouage des circuits de chauffage, entretien chaudière gaz/fioul et purge radiateurs.", img: instructorCoachingImg, l: [isEn ? 'Annual maintenance certificate' : 'Attestation d\'entretien annuelle', isEn ? 'Radiator sludge removal' : 'Nettoyage des boues de chauffage', isEn ? 'Smart thermostat install' : 'Pose de thermostat connecté', isEn ? 'Energy consumption optimization' : 'Réduction des consommations d\'énergie'] }
      };
    }
    if (isElectrician) {
      return {
        choice1: { k: isEn ? 'EMERGENCY 24/7' : 'URGENCE 24/7', t: isEn ? 'Blackout & Short Circuit Repair' : 'Dépannage Panne & Court-Circuit', d: isEn ? 'Immediate troubleshooting for tripped disjunctions, burning smells, and dead outlets.' : "Recherche de panne électrique d'urgence, disjoncteur qui saute et remise en service immédiate.", img: instructorLessonImg, l: [isEn ? 'Arrival in under 30 minutes' : 'Intervention d\'urgence < 30 min', isEn ? 'Circuit isolate & safety lock' : 'Mise en sécurité du tableau', isEn ? 'Diagnostic report provided' : 'Diagnostic précis sur place', isEn ? 'Transparent emergency rate' : 'Tarifs transparents sans surprise'] },
        choice2: { k: isEn ? 'PANEL UPGRADE' : 'TABLEAU ÉLECTRIQUE', t: isEn ? 'Electrical Panel & Code Compliance' : 'Remplacement & Remise aux Normes', d: isEn ? 'Replacing obsolete breaker panels with modern 30mA differential protection.' : "Remplacement des vieux tableaux à fusibles par des disjoncteurs différentiels 30mA certifiés.", img: cityLessonImg, l: [isEn ? 'Full NFC 15-100 compliance' : 'Conformité norme NF C 15-100', isEn ? 'Legrand / Schneider gear' : 'Coffrets Schneider ou Legrand', isEn ? 'Earthing & ground testing' : 'Mise à la terre réglementaire', isEn ? 'Consuel certificate delivery' : 'Attestation Consuel disponible'] },
        choice3: { k: isEn ? 'EV CHARGERS' : 'BORNES IRVE', t: isEn ? 'EV Home Charging Wallbox' : 'Installation Borne de Recharge VE', d: isEn ? 'Certified 7kW to 22kW wallbox installation for electric vehicles with smart load shedding.' : "Pose certifiée IRVE de bornes de recharge pour voiture électrique avec délestage dynamique.", img: codeClassroomImg, l: [isEn ? 'IRVE certified installers' : 'Techniciens certifiés IRVE', isEn ? 'Dynamic power balancing' : 'Gestion intelligente de la puissance', isEn ? 'Tax credit eligible setup' : 'Éligible au crédit d\'impôt', isEn ? 'Compatible with all EVs' : 'Compatible avec tous les véhicules'] },
        choice4: { k: isEn ? 'RENOVATION' : 'RÉNOVATION TOTAL', t: isEn ? 'Complete Wiring & Lighting' : 'Rénovation Électrique Clé en Main', d: isEn ? 'Complete electrical wiring overhaul for apartments and houses during renovation.' : "Refonte intégrale du réseau électrique pour maison ou appartement : gaines encastrées et appareillage.", img: roadLessonImg, l: [isEn ? 'Recessed hidden conduits' : 'Câblage propre encastré', isEn ? 'LED spot & ambiance setup' : 'Éclairage LED & variateurs design', isEn ? 'Surge protection installed' : 'Parasurtenseur de tête posé', isEn ? '10-year decennial insurance' : 'Garantie décennale entreprise'] },
        choice5: { k: isEn ? 'SMART HOME' : 'DOMOTIQUE', t: isEn ? 'Home Automation & Security' : 'Maison Connectée & Interphonie', d: isEn ? 'Connected switches, video intercoms, motorized roller shutters, and remote control.' : "Installation d'interphones vidéo, motorisation de volets et gestion d'éclairage à distance.", img: instructorCoachingImg, l: [isEn ? 'Smartphone remote app' : 'Contrôle par smartphone', isEn ? 'Video door entry systems' : 'Interphone vidéo HD', isEn ? 'Motorized shutter control' : 'Commande centralisée des volets', isEn ? 'Custom automation scenarios' : 'Scénarios d\'éclairage sur mesure'] }
      };
    }
    if (isRealEstate) {
      return {
        choice1: { k: isEn ? 'SELLING ADVISORY' : 'MANDAT VENTE', t: isEn ? 'Property Sales & Marketing' : 'Vente & Commercialisation de Biens', d: isEn ? 'Full management of your real estate sale: valuation, HD photos, viewing, and closing.' : "Accompagnement complet pour vendre au meilleur prix : estimation, visuels HD et sélection d'acquéreurs.", img: instructorLessonImg, l: [isEn ? 'Free in-depth valuation' : 'Estimation approfondie offerte', isEn ? 'HDR photos & 3D virtual tour' : 'Photos HD & visite virtuelle 3D', isEn ? 'Pre-qualified buyer checks' : 'Filtrage bancaire des acquéreurs', isEn ? 'Notary follow-up to closing' : 'Suivi notaire jusqu\'à la vente'] },
        choice2: { k: isEn ? 'BUYER GUIDANCE' : 'CHASSE & ACHAT', t: isEn ? 'Targeted Buyer Search' : 'Recherche & Accompagnement Acquéreur', d: isEn ? 'Finding your ideal house or apartment according to your lifestyle and budget criteria.' : "Recherche ciblée de biens correspondant à vos critères de vie et négociation du prix.", img: cityLessonImg, l: [isEn ? 'Access to off-market properties' : 'Biens avant première & off-market', isEn ? 'Urban planning & diagnostic review' : 'Analyse des diagnostics & urbanisme', isEn ? 'Financing feasibility check' : 'Validation du plan de financement', isEn ? 'Guided visits & offer draft' : 'Visites accompagnées & offre d\'achat'] },
        choice3: { k: isEn ? 'RENTALS' : 'LOCATION', t: isEn ? 'Rental Management & Tenant Search' : 'Mise en Location & Gestion', d: isEn ? 'Guiding landlords through candidate selection, leases, diagnostics, and check-in.' : "Sélection de candidats locataires solvables, rédaction du bail et état des lieux rigoureux.", img: codeClassroomImg, l: [isEn ? 'Solvency checks on tenants' : 'Vérification stricte de solvabilité', isEn ? 'Regulatory lease drafting' : 'Rédaction du bail conforme', isEn ? 'Detailed check-in inventory' : 'État des lieux d\'entrée sur tablette', isEn ? 'Unpaid rent insurance option' : 'Garantie loyers impayés en option'] },
        choice4: { k: isEn ? 'INVESTMENT' : 'INVESTISSEMENT', t: isEn ? 'Rental Yield & Asset Building' : 'Investissement Locatif & Rendement', d: isEn ? 'Identifying high-yielding apartments and multi-unit buildings for investors.' : "Sélection de biens à fort rendement locatif et conseil en fiscalité immobilière (LMNP/Pinel).", img: roadLessonImg, l: [isEn ? 'Gross & net yield simulation' : 'Calcul de rentabilité brute & nette', isEn ? 'LMNP furnished rental advice' : 'Conseil statut LMNP / meublé', isEn ? 'Renovation cost estimates' : 'Chiffrage des travaux de rafraîchissement', isEn ? 'Tenant placement included' : 'Placement du premier locataire'] },
        choice5: { k: isEn ? 'FREE VALUATION' : 'ESTIMATION OFFERTE', t: isEn ? 'Official Property Assessment' : 'Avis de Valeur Immobilière', d: isEn ? 'Comparative market analysis to determine the exact selling price of your home.' : "Étude comparative du marché local pour déterminer la juste valeur vénale de votre bien.", img: instructorCoachingImg, l: [isEn ? 'Detailed written report' : 'Remise d\'un dossier complet sous 48h', isEn ? 'Based on real notarized sales' : 'Basé sur les ventes notariales récentes', isEn ? 'No obligation valuation' : 'Démarche gratuite sans engagement', isEn ? 'Local market dynamic review' : 'Analyse des tendances de quartier'] }
      };
    }

    if (isLandscaping) {
      return {
        choice1: { k: isEn ? 'GARDEN CREATION' : 'CRÉATION PAYSAGÈRE', t: isEn ? 'Custom Landscape Design' : 'Aménagement & Design Paysager', d: isEn ? 'Bespoke garden layouts combining native plants, stone paving, and aesthetic lighting.' : "Création de jardins sur mesure : choix des végétaux, massifs, rocailles et éclairage d'ambiance.", img: instructorLessonImg, l: [isEn ? '3D garden design rendering' : 'Plans & modélisation 3D offerts', isEn ? 'Soil & climate plant selection' : 'Sélection de végétaux adaptés au sol', isEn ? 'Stone & wood hardscaping' : 'Maçonnerie paysagère & terrasses', isEn ? 'Complete turn-key construction' : 'Réalisation complète de A à Z'] },
        choice2: { k: isEn ? 'HARDSCAPING & DECKS' : 'TERRASSES & PAVAGE', t: isEn ? 'Wooden & Stone Terraces' : 'Terrasses Bois, Composite & Pavage', d: isEn ? 'Custom patio, deck, driveway paving, and retaining wall construction for outdoor spaces.' : "Pose de terrasses en bois noble ou composite, création d'allées pavées et murets de tènement.", img: cityLessonImg, l: [isEn ? 'Exotic hardwood or composite decks' : 'Bois exotique, résineux ou composite', isEn ? 'Interlocking pavers & stone driveways' : 'Pavage d\'allées & carrossable', isEn ? 'Retaining walls & steps' : 'Murets de soutènement & escaliers', isEn ? '10-year decennial guarantee' : 'Garantie décennale travaux'] },
        choice3: { k: isEn ? 'SMART IRRIGATION' : 'ARROSAGE AUTOMATIQUE', t: isEn ? 'Drip & Lawn Irrigation Setup' : 'Arrosage Automatique & Goutte-à-Goutte', d: isEn ? 'Water-efficient automated irrigation systems controlled by smart rain sensors.' : "Installation d'arrosage intégré avec programmateur intelligent pour économiser jusqu'à 40% d'eau.", img: codeClassroomImg, l: [isEn ? 'Rain sensor & smart timer' : 'Sonde de pluie & programmateur', isEn ? 'Underground pop-up sprinklers' : 'Tuyères & tuyaux enterrés', isEn ? 'Drip lines for flower beds' : 'Goutte-à-goutte ciblé pour massifs', isEn ? 'Winterizing maintenance included' : 'Hivernage & remise en service'] },
        choice4: { k: isEn ? 'TREE TRIMMING' : 'ÉLAGAGE & TAILLE', t: isEn ? 'Pruning, Trimming & Felling' : 'Élagage, Taille de Haies & Abattage', d: isEn ? 'Professional tree care, hedge trimming, and safe removal of hazardous branches.' : "Taille raisonnée des arbres, rabattage de haies et abattage délicat en toute sécurité.", img: roadLessonImg, l: [isEn ? 'Certified tree climbers' : 'Élagueurs grimpeurs qualifiés', isEn ? 'Hedge shaping & reduction' : 'Taille de haies géométriques', isEn ? 'Branch chipping & green disposal' : 'Broyage & évacuation des déchets', isEn ? 'Full property safety compliance' : 'Assurance responsabilité civile pro'] },
        choice5: { k: isEn ? 'GARDEN MAINTENANCE' : 'ENTRETIEN SAISONNIER', t: isEn ? 'Annual Lawn & Garden Care' : 'Contrat d\'Entretien Annuel', d: isEn ? 'Regular mowing, weeding, fertilizing, and seasonal cleanup to keep your garden lush.' : "Tontes régulières, désherbage, scarification et ramassage des feuilles pour un jardin impeccable.", img: instructorCoachingImg, l: [isEn ? 'Scheduled bi-weekly or monthly visits' : 'Passages réguliers selon la saison', isEn ? '50% tax credit eligible (France)' : 'Éligible crédit d\'impôt 50%', isEn ? 'Organic soil treatment & feeds' : 'Engrais & fertilisation bio', isEn ? 'No binding long term commitment' : 'Forfaits modulables sans engagement'] }
      };
    }

    if (isHvac) {
      return {
        choice1: { k: isEn ? 'HEAT PUMPS' : 'POMPE À CHALEUR', t: isEn ? 'Air-to-Water & Air-to-Air Heat Pumps' : 'Installation Pompe à Chaleur (PAC)', d: isEn ? 'High efficiency heat pump installation drastically reducing home heating electricity bills.' : "Remplacement de chaudière par une pompe à chaleur air/eau ou air/air haute performance.", img: instructorLessonImg, l: [isEn ? 'Up to 70% energy bill savings' : 'Jusqu\'à 70% d\'économies d\'énergie', isEn ? 'RGE certified installer' : 'Artisan certifié RGE QualiPAC', isEn ? 'State grant application support' : 'Dossier MaPrimeRénov\' pris en charge', isEn ? 'Silent inverter technology' : 'Groupes extérieurs ultra-silencieux'] },
        choice2: { k: isEn ? 'AIR CONDITIONING' : 'CLIMATISATION', t: isEn ? 'Reversible Air Conditioning' : 'Climatisation Réversible Mono/Multi-Split', d: isEn ? 'Custom air conditioning fitting for homes and offices to maintain ideal temperatures year round.' : "Pose de climatiseurs réversibles muraux ou gainables pour rafraîchir en été et chauffer en hiver.", img: cityLessonImg, l: [isEn ? 'Daikin, Mitsubishi & Panasonic gear' : 'Marques leaders Daikin & Mitsubishi', isEn ? 'Hidden ductwork option' : 'Intégration gainable invisible', isEn ? 'Wi-Fi smartphone remote control' : 'Contrôle à distance par smartphone', isEn ? 'Quiet night mode operation' : 'Mode nuit ultra-silencieux (19dB)'] },
        choice3: { k: isEn ? 'BOILER SERVICING' : 'ENTRETIEN CHAUDIÈRE', t: isEn ? 'Annual Gas & Oil Boiler Maintenance' : 'Entretien Annuel Chaudière & PAC', d: isEn ? 'Regulatory servicing, burner cleaning, and safety checks to prevent winter breakdowns.' : "Visite de maintenance obligatoire, nettoyage du corps de chauffe et réglages d'optimisation.", img: codeClassroomImg, l: [isEn ? 'Official annual certificate' : 'Attestation d\'entretien obligatoire', isEn ? 'Emergency breakdown priority' : 'Dépannage prioritaire en 24h', isEn ? 'Flue gas analysis check' : 'Contrôle du monoxyde de carbone', isEn ? 'Parts & labor warranty' : 'Remise à niveau des consommables'] },
        choice4: { k: isEn ? 'ENERGY AUDIT' : 'BILAN THERMIQUE', t: isEn ? 'Complete Thermal Assessment' : 'Bilan Thermique & Diagnostic', d: isEn ? 'Auditing insulation and heating systems to pinpoint heat loss and recommend solutions.' : "Diagnostic précis des déperditions thermiques de votre logement avant travaux.", img: roadLessonImg, l: [isEn ? 'Thermal camera inspection' : 'Analyse par caméra thermique', isEn ? 'Custom equipment sizing' : 'Dimensionnement exact des puissances', isEn ? 'ROI & payback period calculation' : 'Calcul du retour sur investissement', isEn ? 'Free non-binding quote' : 'Devis gratuit & étude personnalisée'] },
        choice5: { k: isEn ? 'VENTILATION' : 'VENTILATION VMC', t: isEn ? 'Dual Flow & Humidity VMC' : 'VMC Hygro & Double Flux', d: isEn ? 'Controlled ventilation installation eliminating humidity, mold, and improving indoor air quality.' : "Installation et entretien de systèmes VMC hygroréglables pour assainir l'air intérieur.", img: instructorCoachingImg, l: [isEn ? 'Humidity sensor regulation' : 'Régulation automatique selon humidité', isEn ? 'Mold and damp prevention' : 'Élimination des moisissures', isEn ? 'Energy heat recovery (Dual flow)' : 'Récupération de chaleur (Double flux)', isEn ? 'Acoustic silent ducting' : 'Conduits insonorisés'] }
      };
    }

    if (isRestaurant) {
      return {
        choice1: { k: isEn ? 'TASTING MENU' : 'MENU DÉGUSTATION', t: isEn ? 'Multi-Course Gourmet Experience' : 'Menu Dégustation & Accord Vins', d: isEn ? 'A gastronomic journey featuring seasonal signature dishes crafted by our chef.' : "Un voyage culinaire en 5 ou 7 temps mettant à l'honneur les plus beaux produits de saison.", img: instructorLessonImg, l: [isEn ? '5 to 7 seasonal course menu' : 'Menu 5 ou 7 séquences gourmandes', isEn ? 'Sommelier wine pairing option' : 'Accord mets & vins par notre sommelier', isEn ? 'Fresh local farm sourcing' : 'Ingrédients frais en circuit court', isEn ? 'Vegetarian options available' : 'Adaptation végétarienne disponible'] },
        choice2: { k: isEn ? 'LUNCH SPECIAL' : 'FORMULE DU MIDI', t: isEn ? 'Fresh Express Lunch Menu' : 'Formule Déjeuner du Marché', d: isEn ? 'Quick, seasonal lunch menus updated daily for business lunches and casual dining.' : "Entrée, plat et dessert du jour cuisinés chaque matin selon le retour du marché.", img: cityLessonImg, l: [isEn ? 'Daily updated blackboard menu' : 'Ardoise renouvelée quotidiennement', isEn ? 'Served under 45 minutes' : 'Service rapide garanti sous 45 min', isEn ? 'Coffee & beverage options' : 'Café gourmand & eau plate inclus', isEn ? 'Great value price point' : 'Tarif formule très accessible'] },
        choice3: { k: isEn ? 'SIGNATURE DISHES' : 'SPÉCIALITÉS MAISON', t: isEn ? 'House Specialties & Meats' : 'Plats Signatures & Grillades', d: isEn ? 'Prime cut meats, fresh line-caught fish, and traditional wood-fired recipes.' : "Viandes d'exception, poissons issus de la pêche durable et accompagnements maison.", img: codeClassroomImg, l: [isEn ? 'Aged prime beef cuts' : 'Viandes maturées d\'exception', isEn ? 'Wild catch of the day' : 'Arrivage de poisson frais du jour', isEn ? 'Homemade sauces & purees' : 'Sauces & garnitures 100% maison', isEn ? 'Gluten-free choices' : 'Options sans gluten indiquées'] },
        choice4: { k: isEn ? 'PRIVATE EVENTS' : 'PRIVATISATION', t: isEn ? 'Group Dining & Private Salon' : 'Privatisation & Repas de Groupe', d: isEn ? 'Reserve our dining room or private lounge for family celebrations, birthdays, and corporate dinners.' : "Accueil de groupes, banquets d'entreprise et événements familiaux dans nos espaces privatisables.", img: roadLessonImg, l: [isEn ? 'Capacity up to 80 guests' : 'Espace privatisable jusqu\'à 80 personnes', isEn ? 'Custom banquet menus' : 'Menus sur mesure selon votre budget', isEn ? 'Sound & projector equipped' : 'Équipement son & écran disponible', isEn ? 'Dedicated waitstaff team' : 'Équipe de service dédiée'] },
        choice5: { k: isEn ? 'HOUSE DESSERTS' : 'PÂTISSERIES MAISON', t: isEn ? 'Artisanal Desserts & Sweets' : 'Desserts Artisanaux & Gourmandises', d: isEn ? 'Decadent chocolate tarts, soufflés, and artisanal ice creams prepared by our pastry chef.' : "Créations sucrées originales, tartes de saison et glaces artisanales préparées sur place.", img: instructorCoachingImg, l: [isEn ? '100% in-house pastry chef' : 'Pâtissier à demeure', isEn ? 'Valrhona chocolate desserts' : 'Chocolats grands crus Valrhona', isEn ? 'Seasonal fruit tarts' : 'Fruits frais de vergers régionaux', isEn ? 'Artisanal digestifs selection' : 'Sélection de digestifs & liqueurs'] }
      };
    }

    if (isDrivingSchool) {
      return {
        choice1: { k: isEn ? 'CLASSIC TRAINING' : 'FORMATION CLASSIQUE', t: isEn ? 'Manual License B' : 'Permis B — boîte manuelle', d: isEn ? 'Complete training to master vehicle control, traffic anticipation, and achieve total driving autonomy.' : "La formation complète pour apprendre à maîtriser le véhicule, circuler avec anticipation et devenir autonome, avec une préparation progressive à l'épreuve pratique.", img: instructorLessonImg, l: [isEn ? 'Initial assessment and personalized roadmap' : 'Évaluation initiale et plan de progression', isEn ? 'Highway code prep & online exercises' : 'Code de la route et préparation ciblée', isEn ? '20-hour minimum regulatory curriculum*' : 'Minimum réglementaire de 20 h dans le cadre standard*', isEn ? 'Mock exam conditions & exam support' : "Préparation à l'examen et accompagnement"] },
        choice2: { k: isEn ? 'AUTOMATIC TRAINING' : 'FORMATION AUTOMATIQUE', t: isEn ? 'Automatic License B' : 'Permis B — boîte automatique', d: isEn ? 'A training focused on traffic environment, trajectory, anticipation, and decision making.' : "Une formation qui permet de concentrer davantage l'apprentissage sur l'environnement, les trajectoires, l'anticipation et la prise de décision.", img: cityLessonImg, l: [isEn ? 'Initial assessment & custom route' : 'Évaluation initiale et parcours personnalisé', isEn ? '13-hour minimum regulatory requirement*' : '13 h minimum dans le cadre standard*', isEn ? 'Targeted traffic situation practice' : 'Préparation aux situations de circulation', isEn ? 'Easy bridge course to manual license' : 'Passerelle vers la boîte manuelle selon les conditions'] },
        choice3: { k: isEn ? 'FROM AGE 15' : 'DÈS 15 ANS', t: isEn ? 'AAC Accompanied Driving' : 'AAC — conduite accompagnée', d: isEn ? 'Early driving instruction gaining valuable real-world experience alongside an accompanying driver.' : "L'apprentissage anticipé de la conduite permet d'acquérir de l'expérience avec un accompagnateur après la formation initiale, avant l'examen pratique.", img: instructorCoachingImg, l: [isEn ? 'Available from age 15' : 'Accessible dès 15 ans sous conditions', isEn ? 'Initial course then accompanied driving phase' : 'Formation initiale puis conduite avec accompagnateur', isEn ? 'Pedagogical follow-up meetings' : 'Rendez-vous pédagogiques de suivi', isEn ? 'Higher first-time pass rates' : 'Objectif : gagner de l\'expérience et de l\'autonomie'] },
        choice4: { k: isEn ? 'EXTRA EXPERIENCE' : 'EXPÉRIENCE SUPPLÉMENTAIRE', t: isEn ? 'Supervised Driving' : 'Conduite supervisée', d: isEn ? 'Practice alongside an accompanying adult to reinforce skills after initial training.' : "Une voie pour continuer à pratiquer avec un accompagnateur lorsque les conditions du dispositif sont remplies, notamment après un parcours de formation initiale.", img: roadLessonImg, l: [isEn ? 'Build driving confidence' : 'Acquérir davantage d\'expérience', isEn ? 'Accompanied by a qualified relative' : 'Accompagnement par un proche répondant aux conditions', isEn ? 'Ideal after practical exam attempt' : 'Possibilité après un échec pratique sous conditions', isEn ? 'Validated roadmap with driving school' : 'Parcours validé avec l\'auto-école'] },
        choice5: { k: isEn ? 'BESPOKE' : 'SUR MESURE', t: isEn ? 'Refresher & Boost' : 'Perfectionnement & reprise', d: isEn ? 'A formula to regain confidence, practice tight parking, highway merging, or route prep.' : "Une formule pour reprendre confiance, préparer un trajet, travailler une compétence précise ou compléter une formation avant l'examen.", img: codeClassroomImg, l: [isEn ? 'City, highway, or open road' : 'Ville, route ou autoroute', isEn ? 'Tight parking and maneuvers' : 'Stationnement et manœuvres', isEn ? 'Restart after long break' : 'Reprise après une longue interruption', isEn ? 'Targeted exam preparation' : 'Préparation ciblée avant examen'] }
      };
    }

    // Universal Dynamic Fallback for ANY Niche
    const rawNicheName = (lead.niche || lead.sector || activeNiche || 'Services').trim();
    const cleanNiche = rawNicheName.charAt(0).toUpperCase() + rawNicheName.slice(1);
    return {
      choice1: { k: isEn ? 'EXPRESS SERVICE' : 'INTERVENTION EXPRESS', t: isEn ? `Emergency & Rapid ${cleanNiche}` : `Intervention Rapide ${cleanNiche}`, d: isEn ? `Fast intervention for urgent ${cleanNiche} requests with guaranteed response times.` : `Prise en charge rapide pour vos besoins urgents en ${cleanNiche}.`, img: instructorLessonImg, l: [isEn ? 'Fast response guaranteed' : 'Réponse rapide garantie', isEn ? 'Detailed initial audit' : 'Audit initial détaillé', isEn ? 'Upfront clear pricing' : 'Tarifs transparents', isEn ? 'Quality guarantee' : 'Garantie de qualité'] },
      choice2: { k: isEn ? 'STANDARD SERVICE' : 'PRESTATION STANDARD', t: isEn ? `Standard ${cleanNiche} Package` : `Prestation Standard ${cleanNiche}`, d: isEn ? `Complete turnkey ${cleanNiche} solution tailored to your residential or business needs.` : `Solution complète en ${cleanNiche} adaptée à vos contraintes.`, img: cityLessonImg, l: [isEn ? 'Custom planning' : 'Planification sur mesure', isEn ? 'Certified materials & tools' : 'Matériel certifié', isEn ? 'Experienced technicians' : 'Techniciens expérimentés', isEn ? 'Post-service follow-up' : 'Suivi après prestation'] },
      choice3: { k: isEn ? 'PREMIUM ADVISORY' : 'CONSEIL & AUDIT', t: isEn ? `Audit & Expert Consultation` : `Audit & Expertise ${cleanNiche}`, d: isEn ? `In-depth analysis, diagnostic, and technical recommendations for long term results.` : `Analyse approfondie et conseils d'experts pour vos installations.`, img: codeClassroomImg, l: [isEn ? 'Complete diagnostic report' : 'Rapport de diagnostic complet', isEn ? 'Regulatory compliance check' : 'Vérification des normes', isEn ? 'Optimization roadmap' : 'Plan d\'optimisation', isEn ? 'Free estimate included' : 'Devis gratuit inclus'] },
      choice4: { k: isEn ? 'RENOVATION & OVERHAUL' : 'PROJET CRÉATION', t: isEn ? `Complete ${cleanNiche} Overhaul` : `Création & Rénovation ${cleanNiche}`, d: isEn ? `Full project overhaul from initial design to final execution and site handover.` : `Prise en charge de A à Z pour vos projets d'envergure.`, img: roadLessonImg, l: [isEn ? 'Turnkey project management' : 'Gestion de projet clé en main', isEn ? 'High quality finishes' : 'Finitions soignées', isEn ? 'Dedicated site manager' : 'Suivi de chantier dédié', isEn ? 'Insurance backed warranty' : 'Garantie décennale / assurance'] },
      choice5: { k: isEn ? 'BESPOKE OFFER' : 'SUR MESURE', t: isEn ? `Custom Tailored Solution` : `Projet Sur-Mesure ${cleanNiche}`, d: isEn ? `Bespoke service tailored to unique specifications and complex requirements.` : `Accompagnement personnalisé selon votre cahier des charges.`, img: instructorCoachingImg, l: [isEn ? 'Dedicated advisor' : 'Conseiller dédié', isEn ? 'Flexible scheduling' : 'Horaires flexibles', isEn ? 'Custom pricing quote' : 'Proposition chiffrée sur mesure', isEn ? 'Long term maintenance' : 'Contrat d\'entretien sur mesure'] }
    };
  };

  const choicesMap = getChoicesData();

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#0b1220">
<title>${brandName} — ${nicheData.h1Line1} ${nicheData.h1Line2}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--ink:#0a1220;--ink2:#111c2e;--cream:#f5f2ea;--paper:#fbfbf8;--line:#e7e5df;--muted:#667085;--gold:${goldColor};--gold2:${gold2Color};--green:#24765a;--white:#fff;--shadow:0 25px 80px rgba(10,18,32,.10)}
*{box-sizing:border-box;scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:"DM Sans",sans-serif}h1,h2,h3,h4{font-family:Manrope,sans-serif;letter-spacing:-.04em}a{text-decoration:none;color:inherit}.container{width:min(1180px,calc(100% - 36px));margin:auto}.nav{position:fixed;z-index:100;top:14px;left:50%;transform:translateX(-50%);width:min(1160px,calc(100% - 24px));padding:10px 12px 10px 20px;border:1px solid rgba(255,255,255,.17);background:rgba(8,15,27,.76);backdrop-filter:blur(18px);border-radius:999px;box-shadow:0 18px 60px rgba(0,0,0,.18)}.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{color:#fff;font-weight:800;font-family:Manrope;font-size:15px}.brand span{color:var(--gold)}.nav-links{display:flex;gap:24px}.nav-links a{color:#e9edf3;font-size:13px;font-weight:700}.btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;border-radius:999px;padding:14px 21px;border:1px solid transparent;font-weight:800;font-size:14px;transition:.25s;cursor:pointer}.btn:hover{transform:translateY(-3px);box-shadow:0 15px 30px rgba(10,18,32,.13)}.btn-gold{background:var(--gold);color:#111}.btn-white{background:#fff;color:var(--ink)}.btn-dark{background:var(--ink);color:#fff}.btn-ghost{background:#fff;border-color:var(--line)}.hero{position:relative;min-height:820px;background:var(--ink);color:#fff;overflow:hidden}.hero-bg{position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(7,13,24,.98) 0%,rgba(7,13,24,.86) 40%,rgba(7,13,24,.28) 75%),url("${cityLessonImg}");background-size:cover;background-position:center}.hero-glow{position:absolute;width:650px;height:650px;border-radius:50%;right:-220px;bottom:-340px;background:radial-gradient(circle,rgba(201,169,106,.42),transparent 68%)}.hero-content{position:relative;z-index:2;padding:190px 0 80px;max-width:820px}.eyebrow{display:inline-flex;align-items:center;gap:9px;padding:8px 13px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);border-radius:999px;font-size:11px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}.eyebrow i{width:7px;height:7px;background:var(--gold);border-radius:50%}.hero h1{font-size:clamp(50px,7vw,88px);line-height:.96;margin:25px 0}.hero h1 span{color:var(--gold2)}.hero-lead{font-size:19px;line-height:1.7;color:#d6dde8;max-width:700px}.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:31px}.hero-meta{display:flex;flex-wrap:wrap;gap:35px;margin-top:54px}.hero-meta div{font-size:12px;color:#b8c1ce}.hero-meta strong{display:block;color:#fff;font:800 23px Manrope;margin-bottom:2px}.section{padding:112px 0}.cream{background:var(--cream)}.dark{background:var(--ink);color:#fff}.kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:900;color:#9b7b42}.dark .kicker{color:var(--gold2)}.head{display:flex;align-items:end;justify-content:space-between;gap:40px;margin-bottom:55px}.head h2{font-size:clamp(38px,5vw,62px);line-height:1;margin:10px 0 0;max-width:720px}.head p{max-width:470px;color:var(--muted);line-height:1.75}.dark .head p{color:#b8c1ce}.visual-row{display:grid;grid-template-columns:1.05fr .95fr;gap:32px;align-items:stretch}.photo-card{position:relative;min-height:500px;border-radius:32px;overflow:hidden;box-shadow:var(--shadow)}.photo-card img{width:100%;height:100%;object-fit:cover;display:block}.photo-card .photo-caption{position:absolute;left:20px;right:20px;bottom:20px;padding:18px 20px;border-radius:20px;background:rgba(8,15,27,.75);backdrop-filter:blur(12px);color:#fff}.photo-caption strong{display:block;font:700 18px Manrope;margin-bottom:4px}.photo-caption span{font-size:12px;color:#d0d6df}.copy-card{background:#fff;border:1px solid var(--line);border-radius:32px;padding:40px;display:flex;flex-direction:column;justify-content:center}.copy-card h3{font-size:31px;margin:12px 0}.copy-card p{color:var(--muted);line-height:1.75}.mini-pills{display:flex;flex-wrap:wrap;gap:9px;margin:20px 0 25px}.pill{border:1px solid var(--line);padding:9px 12px;border-radius:999px;font-size:12px;font-weight:800;background:#fafaf7}.choice-nav{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px}.choice{border:1px solid var(--line);background:#fff;padding:12px 16px;border-radius:999px;font-weight:800;font-size:13px;cursor:pointer}.choice.active{background:var(--ink);color:#fff;border-color:var(--ink)}.choice-panel{display:grid;grid-template-columns:.9fr 1.1fr;gap:25px;background:#fff;border:1px solid var(--line);border-radius:30px;padding:22px}.choice-image{height:390px;border-radius:23px;overflow:hidden}.choice-image img{width:100%;height:100%;object-fit:cover}.choice-copy{padding:22px}.choice-copy h3{font-size:32px;margin:8px 0 12px}.choice-copy p{color:var(--muted);line-height:1.75}.feature-list{list-style:none;padding:0;margin:23px 0}.feature-list li{display:flex;gap:10px;padding:11px 0;border-bottom:1px solid var(--line);font-size:14px}.feature-list li:last-child{border-bottom:0}.check{color:var(--green);font-weight:900}.bubble-roadmap{position:relative;padding:20px 0 10px}.bubble-roadmap:before{content:"";position:absolute;left:7%;right:7%;top:125px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}.road-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:22px;position:relative}.road-step{text-align:center}.bubble{width:92px;height:92px;margin:0 auto 22px;border-radius:50%;display:grid;place-items:center;background:#fff;border:8px solid #f1eadc;box-shadow:0 15px 35px rgba(10,18,32,.09);font:800 21px Manrope;position:relative;z-index:2;transition:.3s}.road-step:hover .bubble{transform:translateY(-8px) scale(1.05);border-color:var(--gold2)}.road-step h3{font-size:19px;margin:0 0 8px}.road-step p{font-size:13px;line-height:1.6;color:var(--muted);max-width:190px;margin:auto}.training-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.training-card{background:#fff;border:1px solid var(--line);border-radius:28px;overflow:hidden;transition:.3s;box-shadow:0 10px 45px rgba(10,18,32,.04)}.training-card:hover{transform:translateY(-8px);box-shadow:var(--shadow)}.training-photo{height:220px;position:relative;overflow:hidden}.training-photo img{width:100%;height:100%;object-fit:cover}.tag{position:absolute;top:16px;left:16px;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-radius:999px;padding:7px 10px;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.training-body{padding:26px}.training-body h3{font-size:24px;margin:0 0 10px}.training-body p{color:var(--muted);line-height:1.7;font-size:14px}.training-body .arrow{display:inline-flex;margin-top:15px;color:#876b38;font-weight:900;font-size:13px}.dark-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.dark-card{background:#111c2e;border:1px solid #26354c;border-radius:28px;overflow:hidden}.dark-card img{height:210px;width:100%;object-fit:cover;display:block}.dark-card-body{padding:26px}.dark-card h3{font-size:24px;margin:0 0 9px}.dark-card p{color:#b9c2cf;line-height:1.7;font-size:14px}.booking-wrap{display:grid;grid-template-columns:.8fr 1.2fr;gap:50px;align-items:start}.booking-copy h2{font-size:clamp(40px,5vw,64px);line-height:.98;margin:12px 0 18px}.booking-copy p{color:#b8c1ce;line-height:1.75}.booking-bubbles{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}.booking-bubble{display:flex;align-items:center;gap:9px;padding:10px 13px;border:1px solid #29364a;border-radius:999px;font-size:12px;color:#d8dee7}.booking-bubble b{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--gold);color:#111}.booking-panel{background:#fff;color:var(--ink);border-radius:30px;padding:30px;box-shadow:0 30px 90px rgba(0,0,0,.28)}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.field{margin-bottom:15px}.field.full{grid-column:1/-1}label{display:block;font-size:11px;font-weight:900;color:#344054;margin-bottom:7px}input,select,textarea{width:100%;padding:13px 14px;border:1px solid #dfe3e8;border-radius:13px;background:#fff;font:inherit;outline:none}input:focus,select:focus,textarea:focus{border-color:var(--gold);box-shadow:0 0 0 4px rgba(201,169,106,.12)}.notice{padding:13px;background:#f7f6f2;border-radius:14px;color:#667085;font-size:11px;line-height:1.6;margin:4px 0 17px}.faq-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:70px}.faq-photo{height:600px;border-radius:30px;overflow:hidden;position:sticky;top:110px}.faq-photo img{width:100%;height:100%;object-fit:cover}.faq details{border-top:1px solid var(--line);padding:22px 0}.faq details:last-child{border-bottom:1px solid var(--line)}.faq summary{font:700 18px Manrope;cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:20px}.faq summary::-webkit-details-marker{display:none}.faq summary span{color:#9b7b42}.faq details p{color:var(--muted);line-height:1.7;max-width:800px;margin:14px 0 0}.cta{padding:70px;border-radius:34px;background:linear-gradient(135deg,#111c2e,#0a1220);color:#fff;position:relative;overflow:hidden}.cta:after{content:"";position:absolute;width:520px;height:520px;border-radius:50%;right:-200px;top:-300px;background:radial-gradient(circle,rgba(201,169,106,.38),transparent 68%)}.cta-inner{position:relative;z-index:2;max-width:720px}.cta h2{font-size:clamp(40px,5vw,65px);line-height:1;margin:12px 0 18px}.cta p{color:#c0c8d4;line-height:1.7}footer{background:#070d17;color:#98a4b4;padding:58px 0 28px}.footer-grid{display:grid;grid-template-columns:1.4fr repeat(3,1fr);gap:30px}.footer-grid h4{color:#fff;margin:0 0 13px}.footer-grid a,.footer-grid p{font-size:13px;line-height:1.9}.legal{border-top:1px solid #1d2939;margin-top:35px;padding-top:20px;font-size:10px;line-height:1.7}.toast{position:fixed;right:20px;bottom:20px;z-index:200;background:var(--ink);color:#fff;padding:16px 18px;border-radius:16px;max-width:360px;box-shadow:0 20px 70px rgba(0,0,0,.25);opacity:0;transform:translateY(30px);transition:.3s;font-size:13px}.toast.show{opacity:1;transform:none}
@media(max-width:950px){.nav-links{display:none}.visual-row,.choice-panel,.booking-wrap,.faq-grid{grid-template-columns:1fr}.road-grid{grid-template-columns:repeat(3,1fr)}.bubble-roadmap:before{display:none}.training-grid,.dark-cards{grid-template-columns:1fr 1fr}.faq-photo{height:400px;position:relative;top:auto}.footer-grid{grid-template-columns:1fr 1fr}}
@media(max-width:650px){.container{width:min(100% - 28px,1180px)}.section{padding:78px 0}.hero{min-height:760px}.hero-content{padding-top:155px}.hero h1{font-size:50px}.hero-lead{font-size:16px}.head{display:block;margin-bottom:38px}.head p{margin-top:18px}.photo-card{min-height:360px}.copy-card{padding:28px}.choice-image{height:280px}.road-grid{grid-template-columns:1fr 1fr}.training-grid,.dark-cards,.form-grid,.footer-grid{grid-template-columns:1fr}.cta{padding:40px 25px}.nav{top:8px}.nav .btn{padding:10px 15px;font-size:12px}}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner"><a class="brand" href="#top">${brandNameUpperFirst} <span>${brandNameUpperSecond}</span></a><div class="nav-links"><a href="#formations">${nicheData.navServices}</a><a href="#methode">${nicheData.navMethod}</a><a href="#parcours">${nicheData.navParcours}</a><a href="#tarifs">${nicheData.navTarifs}</a><a href="#faq">FAQ</a></div><a href="#reservation" class="btn btn-gold" style="padding:10px 17px;font-size:12px">${nicheData.navCta}</a></div></nav>

<header id="top" class="hero"><div class="hero-bg" id="heroBg" data-site-img="heroImage" style="background-image:linear-gradient(90deg,rgba(7,13,24,.98) 0%,rgba(7,13,24,.86) 40%,rgba(7,13,24,.28) 75%),url('${cityLessonImg}');"></div><div class="hero-glow"></div><div class="container hero-content"><div class="eyebrow"><i></i> ${nicheData.eyebrow}</div><h1>${nicheData.h1Line1}<br><span>${nicheData.h1Line2}</span></h1><p class="hero-lead">${nicheData.heroLead}</p><div class="hero-actions"><a class="btn btn-gold" href="#reservation">${nicheData.heroCtaPrimary}</a><a class="btn btn-white" href="#formations">${nicheData.heroCtaSecondary}</a></div><div class="hero-meta"><div><strong>${nicheData.stat1Val}</strong>${nicheData.stat1Label}</div><div><strong>${nicheData.stat2Val}</strong>${nicheData.stat2Label}</div><div><strong>${nicheData.stat3Val}</strong>${nicheData.stat3Label}</div></div><div style="font-size:10px;color:#9da7b6;margin-top:19px">${nicheData.disclaimer}</div></div></header>

${renderTransparentSliderSection(content.transparentSlider || content.sliderConfig)}

<section class="section" id="formations"><div class="container"><div class="head"><div><div class="kicker">${nicheData.servicesKicker}</div><h2>${nicheData.servicesTitle}</h2></div><p>${nicheData.servicesLead}</p></div><div class="choice-nav"><button class="choice active" data-choice="choice1">${choicesMap.choice1.t}</button><button class="choice" data-choice="choice2">${choicesMap.choice2.t}</button><button class="choice" data-choice="choice3">${choicesMap.choice3.t}</button><button class="choice" data-choice="choice4">${choicesMap.choice4.t}</button><button class="choice" data-choice="choice5">${choicesMap.choice5.t}</button></div><div class="choice-panel"><div class="choice-image"><img id="choiceImg" data-site-img="choice1Image" src="${choicesMap.choice1.img}" alt="${choicesMap.choice1.t}"></div><div class="choice-copy"><div class="kicker" id="choiceKicker">${choicesMap.choice1.k}</div><h3 id="choiceTitle">${choicesMap.choice1.t}</h3><p id="choiceDesc">${choicesMap.choice1.d}</p><ul class="feature-list" id="choiceList">${choicesMap.choice1.l.map(i => `<li><span class="check">✓</span> ${i}</li>`).join('')}</ul><a href="#reservation" class="btn btn-dark">${isEn ? 'Request Service →' : 'Demander ce service →'}</a></div></div></div></section>

<section class="section cream" id="methode"><div class="container"><div class="head"><div><div class="kicker">${nicheData.methodeKicker}</div><h2>${nicheData.methodeTitle}</h2></div><p>${nicheData.methodeLead}</p></div><div class="bubble-roadmap"><div class="road-grid"><div class="road-step"><div class="bubble">01</div><h3>${isEn ? 'Audit & Contact' : 'Évaluer & Cadrer'}</h3><p>${isEn ? 'Understanding your exact requirements from day one.' : 'Votre demande et vos attentes sont analysées avec précision.'}</p></div><div class="road-step"><div class="bubble">02</div><h3>${isEn ? 'Diagnostic' : 'Diagnostiquer'}</h3><p>${isEn ? 'Thorough study, code verification, and custom estimate.' : 'Étude technique, vérification des règles et devis clair.'}</p></div><div class="road-step"><div class="bubble">03</div><h3>${isEn ? 'Execution' : 'Planifier'}</h3><p>${isEn ? 'Scheduling materials and logistics for seamless intervention.' : 'Planification des travaux et approvisionnement des matériaux.'}</p></div><div class="road-step"><div class="bubble">04</div><h3>${isEn ? 'Controls' : 'Mettre en œuvre'}</h3><p>${isEn ? 'Professional craftsmanship following high quality standards.' : 'Réalisation dans les règles de l\'art et contrôles intermédiaires.'}</p></div><div class="road-step"><div class="bubble">05</div><h3>${isEn ? 'Guarantee' : 'Livrer & Suivre'}</h3><p>${isEn ? 'Final inspection, site cleanup, and warranty delivery.' : 'Livraison finale, conseils d\'entretien et garantie.'}</p></div></div></div></div></section>

<section class="section" id="parcours"><div class="container"><div class="head"><div><div class="kicker">${nicheData.parcoursKicker}</div><h2>${nicheData.parcoursTitle}</h2></div><p>${nicheData.parcoursLead}</p></div><div class="training-grid"><article class="training-card"><div class="training-photo"><img id="parcoursImg_0" data-site-img="parcoursImg1" src="${codeClassroomImg}" alt="Service 1"><span class="tag">${isEn ? 'INTERVENTION' : 'Prestation'}</span></div><div class="training-body"><h3>${choicesMap.choice1.t}</h3><p>${choicesMap.choice1.d}</p><a class="arrow" href="#reservation">${isEn ? 'Request Details →' : 'Découvrir →'}</a></div></article><article class="training-card"><div class="training-photo"><img id="parcoursImg_1" data-site-img="parcoursImg2" src="${cityLessonImg}" alt="Service 2"><span class="tag">${isEn ? 'EXPERT' : 'Expertise'}</span></div><div class="training-body"><h3>${choicesMap.choice2.t}</h3><p>${choicesMap.choice2.d}</p><a class="arrow" href="#reservation">${isEn ? 'Request Details →' : 'Découvrir →'}</a></div></article><article class="training-card"><div class="training-photo"><img id="parcoursImg_2" data-site-img="parcoursImg3" src="${roadLessonImg}" alt="Service 3"><span class="tag">${isEn ? 'SOLUTIONS' : 'Solution'}</span></div><div class="training-body"><h3>${choicesMap.choice3.t}</h3><p>${choicesMap.choice3.d}</p><a class="arrow" href="#reservation">${isEn ? 'Request Details →' : 'Découvrir →'}</a></div></article><article class="training-card"><div class="training-photo"><img id="parcoursImg_3" data-site-img="parcoursImg4" src="${instructorCoachingImg}" alt="Service 4"><span class="tag">${isEn ? 'ADVISORY' : 'Conseil'}</span></div><div class="training-body"><h3>${choicesMap.choice4.t}</h3><p>${choicesMap.choice4.d}</p><a class="arrow" href="#reservation">${isEn ? 'Request Details →' : 'Découvrir →'}</a></div></article><article class="training-card"><div class="training-photo"><img id="parcoursImg_4" data-site-img="parcoursImg5" src="${instructorLessonImg}" alt="Service 5"><span class="tag">${isEn ? 'QUALITY' : 'Qualité'}</span></div><div class="training-body"><h3>${choicesMap.choice5.t}</h3><p>${choicesMap.choice5.d}</p><a class="arrow" href="#reservation">${isEn ? 'Request Details →' : 'Découvrir →'}</a></div></article><article class="training-card"><div class="training-photo"><img id="parcoursImg_5" data-site-img="parcoursImg6" src="${roadLessonImg}" alt="Service 6"><span class="tag">${isEn ? 'TAILORED' : 'Sur-Mesure'}</span></div><div class="training-body"><h3>${isEn ? 'Custom Project' : 'Projet Sur-Mesure'}</h3><p>${isEn ? 'Bespoke solutions crafted to meet complex specifications.' : 'Un accompagnement personnalisé selon vos contraintes et objectifs.'}</p><a class="arrow" href="#reservation">${isEn ? 'Contact Us →' : 'En savoir plus →'}</a></div></article></div></div></section>

<section class="section dark"><div class="container"><div class="head"><div><div class="kicker">${nicheData.humanKicker}</div><h2>${nicheData.humanTitle}</h2></div><p>${nicheData.humanLead}</p></div><div class="visual-row"><div class="photo-card"><img id="teamPhotoImg" data-site-img="aboutImage" src="${instructorCoachingImg}" alt="Team member"><div class="photo-caption"><strong>${isEn ? 'Every customer gets full personal care.' : 'Chaque client est écouté avec attention.'}</strong><span>${isEn ? 'Clear communication, high responsiveness, and commitment.' : 'Transparence, réactivité et engagement au quotidien.'}</span></div></div><div class="copy-card"><div class="kicker">${isEn ? 'PREMIUM QUALITY' : 'RIGOUREUX & ENGAGÉ'}</div><h3>${isEn ? 'A premium service experience.' : 'Un service haut de gamme de A à Z.'}</h3><p>${isEn ? 'Quick response, detailed quote, certified execution, and post-service follow-up.' : 'Un interlocuteur dédié vous conseille et garantit un travail soigné.'}</p><div class="mini-pills"><span class="pill">${isEn ? 'Certified Team' : 'Équipe certifiée'}</span><span class="pill">${isEn ? 'Clear Quote' : 'Devis gratuit'}</span><span class="pill">${isEn ? 'Fast Arrival' : 'Réactivité'}</span><span class="pill">${isEn ? 'Warranty' : 'Garanties'}</span><span class="pill">${isEn ? 'Clean Setup' : 'Propreté'}</span></div><a href="#reservation" class="btn btn-dark">${isEn ? 'Start Project →' : 'Engager mon projet →'}</a></div></div></div></section>

<section class="section cream" id="tarifs"><div class="container"><div class="head"><div><div class="kicker">${nicheData.tarifsKicker}</div><h2>${nicheData.tarifsTitle}</h2></div><p>${nicheData.tarifsLead}</p></div><div class="training-grid"><article class="training-card"><div class="training-body"><div class="kicker">01 · ${isEn ? 'ESSENTIAL' : 'DIAGNOSTIC'}</div><h3>${isEn ? 'Diagnostic & Audit' : 'Formule Diagnostic'}</h3><div style="font:800 42px Manrope;margin:15px 0">${isEn ? '$90' : '90 €'}</div><p>${isEn ? 'Initial assessment, safety check, and comprehensive quote.' : 'Bilan complet, audit technique et proposition chiffrée.'}</p><a href="#reservation" class="btn btn-ghost" style="margin-top:15px">${isEn ? 'Book Audit' : 'Choisir'}</a></div></article><article class="training-card" style="border:2px solid var(--gold)"><div class="training-body"><div class="kicker">02 · ${isEn ? 'POPULAR' : 'CONCERNÉ'}</div><h3>${isEn ? 'Standard Package' : 'Intervention Standard'}</h3><div style="font:800 42px Manrope;margin:15px 0">${isEn ? '$350' : '350 €'}</div><p>${isEn ? 'Complete intervention including labor, travel, and standard parts.' : 'Main d\'œuvre, déplacement et pièces de remplacement standard.'}</p><a href="#reservation" class="btn btn-gold" style="margin-top:15px">${isEn ? 'Select Package' : 'Choisir cette formule'}</a></div></article><article class="training-card"><div class="training-body"><div class="kicker">03 · ${isEn ? 'PREMIUM' : 'SUR MESURE'}</div><h3>${isEn ? 'Complete Overhaul' : 'Rénovation / Projets'}</h3><div style="font:800 42px Manrope;margin:15px 0">${isEn ? 'Custom' : 'Sur devis'}</div><p>${isEn ? 'Turnkey installation and major upgrades tailored to your space.' : 'Prise en charge complète pour grands chantiers et rénovations.'}</p><a href="#reservation" class="btn btn-ghost" style="margin-top:15px">${isEn ? 'Request Quote' : 'Demander devis'}</a></div></article></div></div></section>

<section class="section dark" id="reservation"><div class="container booking-wrap"><div class="booking-copy"><div class="kicker">${nicheData.bookingKicker}</div><h2>${nicheData.bookingTitle}</h2><p>${nicheData.bookingLead}</p><div class="booking-bubbles"><span class="booking-bubble"><b>1</b> ${isEn ? 'Service' : 'Besoin'}</span><span class="booking-bubble"><b>2</b> Date</span><span class="booking-bubble"><b>3</b> ${isEn ? 'Time' : 'Créneau'}</span><span class="booking-bubble"><b>4</b> ${isEn ? 'Confirm' : 'Confirmation'}</span></div></div><form class="booking-panel" id="bookingForm"><div class="form-grid"><div class="field"><label>${isEn ? 'First Name' : 'Prénom'}</label><input name="prenom" required placeholder="Alex"></div><div class="field"><label>${isEn ? 'Last Name' : 'Nom'}</label><input name="nom" required placeholder="Dupont"></div><div class="field"><label>${isEn ? 'Phone' : 'Téléphone'}</label><input name="tel" type="tel" required placeholder="${phone}"></div><div class="field"><label>${isEn ? 'Email' : 'Email'}</label><input name="email" type="email" required placeholder="${email}"></div><div class="field"><label>${isEn ? 'Service' : 'Prestation'}</label><select name="formation" required><option value="">${isEn ? 'Select service…' : 'Choisir…'}</option><option>${choicesMap.choice1.t}</option><option>${choicesMap.choice2.t}</option><option>${choicesMap.choice3.t}</option><option>${choicesMap.choice4.t}</option><option>${choicesMap.choice5.t}</option></select></div><div class="field"><label>${isEn ? 'Urgency' : 'Degré d\'urgence'}</label><select name="motif"><option>${isEn ? 'Emergency intervention' : 'Urgence immédiate'}</option><option>${isEn ? 'Planned project' : 'Projet dans le mois'}</option><option>${isEn ? 'Quote request' : 'Simple devis'}</option></select></div><div class="field"><label>${isEn ? 'Desired Date' : 'Date souhaitée'}</label><input name="date" type="date" required></div><div class="field"><label>${isEn ? 'Preferred Time' : 'Créneau préféré'}</label><select name="creneau"><option>08h00 — 12h00</option><option>12h00 — 14h00</option><option>14h00 — 18h00</option><option>18h00 — 20h00</option></select></div><div class="field full"><label>${isEn ? 'Message / Details' : 'Précisions sur votre demande'}</label><textarea name="message" rows="3" placeholder="${isEn ? 'Address, specific problem or details…' : 'Adresse, description du problème ou précision…'}"></textarea></div></div><div class="notice">${isEn ? 'Our team confirms availability within 30 minutes.' : 'Une confirmation immédiate vous sera envoyée par nos équipes.'}</div><button class="btn btn-dark" style="width:100%" type="submit">${isEn ? 'Send Request →' : 'Envoyer ma demande →'}</button></form></div></section>

<section class="section"><div class="container"><div class="head"><div><div class="kicker">${nicheData.whyKicker}</div><h2>${nicheData.whyTitle}</h2></div><p>${nicheData.whyLead}</p></div><div class="dark-cards"><article class="dark-card"><img id="whyImg_0" data-site-img="section1Image" src="${codeClassroomImg}" alt="Feature 1"><div class="dark-card-body"><h3>${isEn ? 'Clear Diagnostics' : 'Diagnostic Clair'}</h3><p>${isEn ? 'Accurate assessments provided prior to any work.' : 'Des explications limpides sur la nature des travaux à réaliser.'}</p></div></article><article class="dark-card"><img id="whyImg_1" data-site-img="section2Image" src="${instructorLessonImg}" alt="Feature 2"><div class="dark-card-body"><h3>${isEn ? 'Certified Pros' : 'Artisans Qualifiés'}</h3><p>${isEn ? 'Experienced technicians adhering to all safety codes.' : 'Une équipe expérimentée et formée aux dernières réglementations.'}</p></div></article><article class="dark-card"><img id="whyImg_2" data-site-img="contactImage" src="${roadLessonImg}" alt="Feature 3"><div class="dark-card-body"><h3>${isEn ? 'Clean & Reliable' : 'Chantiers Propres'}</h3><p>${isEn ? 'Careful execution, site protection, and guaranteed satisfaction.' : 'Propreté des lieux respectée et suivi après intervention.'}</p></div></article></div></div></section>

<section class="section cream" id="faq"><div class="container faq"><div class="head"><div><div class="kicker">${nicheData.faqKicker}</div><h2>${nicheData.faqTitle}</h2></div><p>${nicheData.faqLead}</p></div><div class="faq-grid"><div class="faq-photo"><img id="faqPhotoImg" data-site-img="faqPhoto" src="${roadLessonImg}" alt="FAQ section"></div><div><details open><summary>${isEn ? 'How fast can you intervene?' : 'Quel est le délai d\'intervention ?'} <span>＋</span></summary><p>${isEn ? 'For emergencies, our team arrives in 30 to 45 minutes. For planned jobs, we schedule within 48h.' : 'Pour les urgences, nous intervenons en 30 à 45 minutes selon la localisation. Pour les projets, un RDV est fixé sous 48h.'}</p></details><details><summary>${isEn ? 'Are your quotes free of charge?' : 'Les devis sont-ils gratuits ?'} <span>＋</span></summary><p>${isEn ? 'Yes, all detailed estimates and project consultations are 100% free with no obligation.' : 'Oui, l\'établissement d\'un devis détaillé est totalement gratuit et sans engagement.'}</p></details><details><summary>${isEn ? 'What guarantees are provided?' : 'Quelles garanties couvraient les travaux ?'} <span>＋</span></summary><p>${isEn ? 'All our installations are backed by 10-year decennial insurance and manufacturer warranties.' : 'Toutes nos interventions et installations bénéficient de la garantie décennale et des garanties constructeurs.'}</p></details><details><summary>${isEn ? 'How are prices calculated?' : 'Comment sont calculés les tarifs ?'} <span>＋</span></summary><p>${isEn ? 'We provide transparent flat rates or detailed quotes before starting any work. No hidden fees.' : 'Nous appliquons des forfaits clairs et transparents, validés avec vous avant tout démarrage.'}</p></details></div></div></div></section>

<section class="section"><div class="container"><div class="cta"><div class="cta-inner"><div class="kicker">${nicheData.ctaKicker}</div><h2>${nicheData.ctaTitle}</h2><p>${nicheData.ctaLead}</p><div class="hero-actions"><a href="#reservation" class="btn btn-gold">${nicheData.ctaPrimary}</a><a href="tel:${phone.replace(/\s/g, '')}" class="btn btn-white">${nicheData.ctaSecondary}</a></div></div></div></div></section>

<footer><div class="container"><div class="footer-grid"><div><h4>${brandNameUpperFirst} ${brandNameUpperSecond}</h4><p>${brandName} — ${nicheData.eyebrow}</p></div><div><h4>${isEn ? 'Services' : 'Prestations'}</h4><p><a href="#formations">${choicesMap.choice1.t}</a><br><a href="#formations">${choicesMap.choice2.t}</a><br><a href="#formations">${choicesMap.choice3.t}</a></p></div><div><h4>Navigation</h4><p><a href="#reservation">${isEn ? 'Book' : 'Réserver'}</a><br><a href="#tarifs">${isEn ? 'Rates' : 'Tarifs'}</a><br><a href="#faq">FAQ</a></p></div><div><h4>Contact</h4><p>${displayCity}<br><a href="tel:${phone.replace(/\s/g, '')}">${phone}</a><br><a href="mailto:${email}">${email}</a></p></div></div><div class="legal"><strong>Mentions légales :</strong> ${brandName} — ${displayCity}. ${phone} — ${email}.</div></div></footer>

<div class="toast" id="toast"></div>
<script>
const choices=${JSON.stringify(choicesMap)};
document.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.choice').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const x=choices[btn.dataset.choice];if(x){document.getElementById('choiceKicker').textContent=x.k;document.getElementById('choiceTitle').textContent=x.t;document.getElementById('choiceDesc').textContent=x.d;const cImg=document.getElementById('choiceImg');if(cImg)cImg.src=x.img;document.getElementById('choiceList').innerHTML=x.l.map(i=>\`<li><span class="check">✓</span> \${i}</li>\`).join('')}}));
const form=document.getElementById('bookingForm'),toast=document.getElementById('toast'),dateInput=document.querySelector('input[type="date"]');if(dateInput)dateInput.min=new Date().toISOString().split('T')[0];if(form){form.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());const arr=JSON.parse(localStorage.getItem('elanBookingRequests')||'[]');arr.push({...data,createdAt:new Date().toISOString()});localStorage.setItem('elanBookingRequests',JSON.stringify(arr));toast.textContent='${isEn ? 'Your request has been saved. We will contact you shortly.' : 'Votre demande a bien été enregistrée. Nous vous contacterons rapidement.'}';toast.classList.add('show');form.reset();setTimeout(()=>toast.classList.remove('show'),5000)});}

window.addEventListener('message', function(e) {
  if (!e || !e.data) return;
  var d = e.data;
  if (d.type === 'UPDATE_IMAGE' && d.url) {
    var f = d.field;
    if (f === 'hero' || f === 'heroImage') {
      var h = document.getElementById('heroBg');
      if (h) h.style.backgroundImage = "linear-gradient(90deg,rgba(7,13,24,.98) 0%,rgba(7,13,24,.86) 40%,rgba(7,13,24,.28) 75%),url('" + d.url + "')";
    }
    if (f === 'choiceImg' || f === 'choice1' || f === 'choice1Image') {
      var ci = document.getElementById('choiceImg');
      if (ci) ci.src = d.url;
    }
    var targetEl = document.getElementById(f) || document.querySelector('[data-site-img="' + f + '"]');
    if (targetEl && targetEl.tagName === 'IMG') {
      targetEl.src = d.url;
    }
  }
  if ((d.type === 'PINTEREST_PHOTOS' || d.type === 'UPDATE_ALL_PHOTOS') && Array.isArray(d.photos) && d.photos.length > 0) {
    if (d.photos[0]) {
      var h = document.getElementById('heroBg');
      if (h) h.style.backgroundImage = "linear-gradient(90deg,rgba(7,13,24,.98) 0%,rgba(7,13,24,.86) 40%,rgba(7,13,24,.28) 75%),url('" + d.photos[0] + "')";
    }
    if (d.photos[1]) {
      var t = document.getElementById('teamPhotoImg');
      if (t) t.src = d.photos[1];
    }
    if (d.photos[2]) {
      var c = document.getElementById('choiceImg');
      if (c) c.src = d.photos[2];
    }
    if (d.photos[3]) {
      var p0 = document.getElementById('parcoursImg_0');
      if (p0) p0.src = d.photos[3];
    }
    if (d.photos[4]) {
      var w0 = document.getElementById('whyImg_0');
      if (w0) w0.src = d.photos[4];
    }
    if (d.photos[5]) {
      var fq = document.getElementById('faqPhotoImg');
      if (fq) fq.src = d.photos[5];
    }
  }
});
</script>

<!-- ✨ AI VIRTUAL TRY-ON STUDIO FLOATING WIDGET -->
<div id="aiTryonFloatingContainer" style="position:fixed;bottom:24px;right:24px;z-index:99999;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <button id="aiTryonLauncherBtn" onclick="toggleAiTryonModal(true)" style="background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#ffffff;border:1px solid rgba(255,255,255,0.2);padding:12px 22px;border-radius:9999px;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 12px 30px -5px rgba(99,102,241,0.6);display:flex;align-items:center;gap:9px;transition:transform 0.2s ease,box-shadow 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
    <span style="font-size:16px;line-height:1;">✨</span> AI Virtual Try-On Studio
  </button>
</div>

<!-- TRY-ON MODAL OVERLAY -->
<div id="aiTryonModal" style="display:none;position:fixed;inset:0;z-index:100000;background:rgba(5,7,12,0.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="background:#0f1117;border:1px solid rgba(139,92,246,0.3);border-radius:24px;max-width:920px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 25px 50px -12px rgba(0,0,0,0.8);color:#fff;padding:24px;display:flex;flex-direction:column;gap:20px;">
    
    <!-- HEADER -->
    <div style="display:flex;align-items:center;justify-content:between;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:16px;">
      <div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:20px;">✨</span>
          <h3 style="margin:0;font-size:18px;font-weight:900;letter-spacing:-0.02em;color:#ffffff;">AI Virtual Try-On & Visual Simulator</h3>
          <span style="background:rgba(139,92,246,0.2);color:#a78bfa;border:1px solid rgba(139,92,246,0.4);font-size:10px;font-weight:800;padding:2px 8px;border-radius:9999px;text-transform:uppercase;">Live Demo</span>
        </div>
        <p style="margin:4px 0 0 0;font-size:12px;color:#9ca3af;">Upload a selfie or pick a model to see products fitted onto your photo in real time.</p>
      </div>
      <button onclick="toggleAiTryonModal(false)" style="background:rgba(255,255,255,0.1);border:none;color:#9ca3af;width:32px;height:32px;border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;margin-left:auto;">✕</button>
    </div>

    <!-- MAIN GRID: LEFT (USER PHOTO) & RIGHT (PRODUCT CATALOG) -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      
      <!-- LEFT COLUMN: USER PHOTO UPLOAD & PREVIEW CANVAS -->
      <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:16px;display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;align-items:center;justify-content:between;">
          <span style="font-size:12px;font-weight:800;color:#d1d5db;text-transform:uppercase;letter-spacing:0.05em;">1. Your Photo / Selfie</span>
          <label style="background:#27272a;hover:bg-#3f3f46;color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;cursor:pointer;">
            📁 Upload Photo
            <input type="file" id="tryonFileInput" accept="image/*" style="display:none;" onchange="handleTryonPhotoUpload(event)">
          </label>
        </div>

        <!-- PHOTO CONTAINER / CANVAS -->
        <div style="position:relative;width:100%;height:280px;background:#18181b;border-radius:14px;overflow:hidden;display:flex;align-items:center;justify-content:center;border:1px dashed rgba(139,92,246,0.4);">
          <img id="tryonUserPhoto" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" alt="User Photo" style="width:100%;height:100%;object-fit:cover;transition:opacity 0.3s ease;">
          <img id="tryonOverlayProduct" src="" alt="Overlay Product" style="display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;filter:drop-shadow(0 10px 15px rgba(0,0,0,0.5));">
          <div id="tryonLoadingSpinner" style="display:none;position:absolute;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);display:none;flex-direction:column;align-items:center;justify-content:center;gap:8px;">
            <div style="width:28px;height:28px;border:3px solid #8b5cf6;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
            <span style="font-size:11px;font-weight:700;color:#a78bfa;">AI Fitting in Progress…</span>
          </div>
        </div>

        <!-- SAMPLE MODELS PICKER -->
        <div>
          <span style="font-size:11px;color:#9ca3af;display:block;margin-bottom:6px;">Or choose a sample model:</span>
          <div style="display:flex;gap:8px;">
            <button onclick="setSampleModel('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80')" style="flex:1;padding:6px;background:#27272a;border:1px solid #3f3f46;border-radius:8px;color:#fff;font-size:10px;font-weight:700;cursor:pointer;">Model 1 (Female)</button>
            <button onclick="setSampleModel('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80')" style="flex:1;padding:6px;background:#27272a;border:1px solid #3f3f46;border-radius:8px;color:#fff;font-size:10px;font-weight:700;cursor:pointer;">Model 2 (Male)</button>
            <button onclick="setSampleModel('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80')" style="flex:1;padding:6px;background:#27272a;border:1px solid #3f3f46;border-radius:8px;color:#fff;font-size:10px;font-weight:700;cursor:pointer;">Model 3 (Portrait)</button>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: PRODUCT CATALOG SELECTOR -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;align-items:center;justify-content:between;">
          <span style="font-size:12px;font-weight:800;color:#d1d5db;text-transform:uppercase;letter-spacing:0.05em;">2. Select Product To Try On</span>
          <span id="selectedProductBadge" style="font-size:11px;font-weight:700;color:#8b5cf6;">Selected: Summer Silk Dress</span>
        </div>

        <!-- PRODUCT CARDS GRID -->
        <div id="tryonProductGrid" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-height:270px;overflow-y:auto;padding-right:4px;">
          <!-- Product Item 1 -->
          <div class="tryon-prod-card active" onclick="selectTryonProduct(this, 'Summer Floral Maxi Dress', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80', 'fashion')" style="background:#18181b;border:2px solid #8b5cf6;border-radius:12px;padding:8px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all 0.2s;">
            <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80" style="width:44px;height:44px;object-fit:cover;border-radius:8px;">
            <div>
              <div style="font-size:11px;font-weight:800;color:#fff;">Summer Floral Dress</div>
              <div style="font-size:10px;color:#a1a1aa;">Fashion / Wear</div>
            </div>
          </div>
          <!-- Product Item 2 -->
          <div class="tryon-prod-card" onclick="selectTryonProduct(this, 'Platinum Sleek Bob Wig', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80', 'wigs_hair')" style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:8px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all 0.2s;">
            <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80" style="width:44px;height:44px;object-fit:cover;border-radius:8px;">
            <div>
              <div style="font-size:11px;font-weight:800;color:#fff;">Platinum Bob Wig</div>
              <div style="font-size:10px;color:#a1a1aa;">Hair & Wigs</div>
            </div>
          </div>
          <!-- Product Item 3 -->
          <div class="tryon-prod-card" onclick="selectTryonProduct(this, 'Hollywood Porcelain Veneers', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80', 'dental_smile')" style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:8px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all 0.2s;">
            <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80" style="width:44px;height:44px;object-fit:cover;border-radius:8px;">
            <div>
              <div style="font-size:11px;font-weight:800;color:#fff;">Hollywood Smile</div>
              <div style="font-size:10px;color:#a1a1aa;">Dental & Teeth</div>
            </div>
          </div>
          <!-- Product Item 4 -->
          <div class="tryon-prod-card" onclick="selectTryonProduct(this, 'Gold Aviator Sunglasses', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80', 'eyewear')" style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:8px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all 0.2s;">
            <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80" style="width:44px;height:44px;object-fit:cover;border-radius:8px;">
            <div>
              <div style="font-size:11px;font-weight:800;color:#fff;">Aviator Sunglasses</div>
              <div style="font-size:10px;color:#a1a1aa;">Eyewear</div>
            </div>
          </div>
        </div>

        <!-- ACTION BUTTON -->
        <button id="runTryonActionBtn" onclick="runAiTryonProcess()" style="width:100%;padding:14px;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;border:none;border-radius:14px;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 10px 20px -5px rgba(139,92,246,0.5);display:flex;align-items:center;justify-content:center;gap:8px;">
          ✨ Run AI Fitting & Calculate Match Score
        </button>
      </div>

    </div>

    <!-- AI RESULT & MATCH METRICS PANEL -->
    <div id="tryonResultBox" style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:10px;">
      <div style="display:flex;align-items:center;justify-content:between;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:24px;font-weight:900;color:#a78bfa;" id="tryonScoreVal">97%</span>
          <div>
            <div style="font-size:12px;font-weight:800;color:#fff;">AI Fit & Match Score</div>
            <div style="font-size:10px;color:#9ca3af;" id="tryonConfidenceTag">Confidence Level: High (Photorealistic Alignment)</div>
          </div>
        </div>
        <span id="recommendedVariantBadge" style="background:rgba(255,255,255,0.1);color:#38bdf8;font-size:11px;font-weight:800;padding:4px 10px;border-radius:8px;">Size M / Shade 1B</span>
      </div>

      <p id="tryonFitSummary" style="margin:0;font-size:12px;color:#e5e7eb;line-height:1.5;">
        The AI detected optimal body proportions. The garment neck contour and fabric drape align perfectly with your photo lighting and skin tone.
      </p>

      <div style="display:flex;flex-wrap:wrap;gap:6px;" id="tryonKeypointsList">
        <span style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);font-size:10px;color:#a1a1aa;padding:3px 8px;border-radius:6px;">✓ Flattering Neckline Drop</span>
        <span style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);font-size:10px;color:#a1a1aa;padding:3px 8px;border-radius:6px;">✓ 95%+ Skin Undertone Match</span>
        <span style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);font-size:10px;color:#a1a1aa;padding:3px 8px;border-radius:6px;">✓ Natural Shadow Integration</span>
      </div>
    </div>

  </div>
</div>

<style>
@keyframes spin { to { transform: rotate(360deg); } }
</style>

<script>
var currentTryonProduct = {
  name: 'Summer Floral Maxi Dress',
  img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80',
  cat: 'fashion'
};

function toggleAiTryonModal(show) {
  var modal = document.getElementById('aiTryonModal');
  if (modal) modal.style.display = show ? 'flex' : 'none';
}

function setSampleModel(url) {
  var userImg = document.getElementById('tryonUserPhoto');
  if (userImg) userImg.src = url;
}

function handleTryonPhotoUpload(e) {
  var file = e.target.files && e.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function(evt) {
      var userImg = document.getElementById('tryonUserPhoto');
      if (userImg) userImg.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function selectTryonProduct(el, name, img, cat) {
  document.querySelectorAll('.tryon-prod-card').forEach(function(c) {
    c.style.borderColor = '#27272a';
    c.classList.remove('active');
  });
  el.style.borderColor = '#8b5cf6';
  el.classList.add('active');
  
  currentTryonProduct = { name: name, img: img, cat: cat };
  var badge = document.getElementById('selectedProductBadge');
  if (badge) badge.textContent = 'Selected: ' + name;

  var overlay = document.getElementById('tryonOverlayProduct');
  if (overlay && img) {
    overlay.src = img;
    overlay.style.display = 'block';
    overlay.style.opacity = '0.85';
    overlay.style.mixBlendMode = cat.includes('dental') ? 'screen' : 'multiply';
  }
}

async function runAiTryonProcess() {
  var spinner = document.getElementById('tryonLoadingSpinner');
  if (spinner) spinner.style.display = 'flex';
  
  var userPhotoEl = document.getElementById('tryonUserPhoto');
  var userImgData = userPhotoEl ? userPhotoEl.src : '';

  var overlay = document.getElementById('tryonOverlayProduct');
  if (overlay && currentTryonProduct.img) {
    overlay.src = currentTryonProduct.img;
    overlay.style.display = 'block';
    overlay.style.opacity = '0.9';
  }

  try {
    var res = await fetch('/api/ai/virtual-tryon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userImage: userImgData.startsWith('data:') ? userImgData : 'data:image/jpeg;base64,placeholder',
        productName: currentTryonProduct.name,
        productCategory: currentTryonProduct.cat,
        productImage: currentTryonProduct.img
      })
    });
    var data = await res.json();
    if (data.success && data.data) {
      var d = data.data;
      document.getElementById('tryonScoreVal').textContent = (d.matchScore || 96) + '%';
      document.getElementById('tryonFitSummary').textContent = d.fitSummary || 'Optimal alignment detected.';
      document.getElementById('recommendedVariantBadge').textContent = d.recommendedSizeOrShade || 'Size M / Shade 1B';
      if (Array.isArray(d.aestheticKeypoints)) {
        document.getElementById('tryonKeypointsList').innerHTML = d.aestheticKeypoints.map(function(k) {
          return '<span style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);font-size:10px;color:#a1a1aa;padding:3px 8px;border-radius:6px;">✓ ' + k + '</span>';
        }).join('');
      }
    }
  } catch(err) {
    console.warn('Tryon API fallback:', err);
  } finally {
    if (spinner) spinner.style.display = 'none';
  }
}
</script>
</body>
</html>`;
}
