import { extractCity, detectLanguage } from '../siteTemplate.js';

// Niche configurations matching accent colors & industry-specific visual assets
const NICHE_CONFIGS = {
  traiteur: {
    accent: '#C9A96E',
    tagline: 'Maison de prestige',
    heroImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&q=85&auto=format&fit=crop',
    defaultHeroTitle: "Expert Traiteur",
    defaultHeroTitleEm: "de prestige",
    heroSubtitle: "Créations gastronomiques sur mesure pour vos mariages, événements d'entreprise et réceptions privées.",
    aboutLabel: "Notre histoire",
    aboutTitle: "Une passion,<br><em>un savoir-faire</em>",
    aboutTextTemplate: (brandName) => `Fondée il y a plus de 12 ans, ${brandName} est née d'une passion pour la gastronomie française et l'art de la table. Chaque événement est une nouvelle toile blanche sur laquelle nous créons votre histoire culinaire.\n\nDe l'amuse-bouche au mignardise, chaque détail est pensé pour sublimer votre événement et offrir à vos invités une expérience mémorable.`,
    benefits: [
      "Produits frais et de saison, sélectionnés chaque matin",
      "Menus entièrement personnalisés selon vos envies",
      "Équipe de service professionnelle et discrète",
      "Livraison et installation dans toute la région"
    ],
    servicesTitle: "Chaque événement <em>mérite l'excellence</em>",
    servicesSubtitle: "De l'intime dîner privé au grand mariage, nous adaptons notre savoir-faire à vos exigences et à votre budget. Chaque prestation est unique, comme votre événement.",
    services: [
      { num: '01', title: 'Mariages & Cérémonies', desc: 'Menu sur mesure, vin d\'honneur raffiné et dîner d\'exception pour célébrer votre amour.', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop' },
      { num: '02', title: 'Cocktails & Réceptions', desc: 'Bouchées gastronomiques, animations culinaires en direct et verrines créatives.', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop' },
      { num: '03', title: 'Événements Corporate', desc: 'Séminaires, soirées de gala, pauses café gourmandes et repas d\'affaires clé en main.', img: 'https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?w=800&q=80&auto=format&fit=crop' },
      { num: '04', title: 'Chef & Dîner à Domicile', desc: 'Une expérience de restaurant étoilé directement dans le confort de votre résidence.', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop' }
    ],
    aboutImg1: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop',
    aboutImg2: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop',
    signatureQuote: "La gastronomie est l'art de faire naître des émotions à travers la cuisine. Chaque plat raconte une histoire.",
    signatureAuthor: "Chef & Fondateur",
    signatureImg: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80&auto=format&fit=crop',
    eventsLabel: "Types d'événements",
    eventsTitle: "Pour chaque <em>occasion</em>",
    events: [
      { num: '01', title: 'Mariage & PACS', desc: 'De 30 à 500 convives. Cocktail, dîner assis, buffet ou formule mixte. Menu personnalisé et dégustation offerte.' },
      { num: '02', title: 'Anniversaires & Fêtes', desc: 'Anniversaires marquants, baptêmes, communions. Buffets gourmands ou dîners assis selon vos préférences.' },
      { num: '03', title: 'Événements Corporate', desc: 'Séminaires, team buildings, inaugurations, soirées de gala. Formules adaptées à toutes les tailles d\'entreprises.' }
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=75&auto=format&fit=crop'
    ],
    bookingTitle: "Parlons de votre <em>projet</em>",
    bookingSubtitle: "Remplissez le formulaire ci-dessous pour recevoir un devis gratuit et personnalisé sous 24 heures.",
    bookingTrust: ["Réponse sous 24h garantie", "Devis gratuit & sans engagement", "Dégustation offerte"]
  },
  electricien: {
    accent: '#C9A96E',
    tagline: 'Électricité Générale & Domotique',
    heroImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=85&auto=format&fit=crop',
    defaultHeroTitle: "Expert Électricien",
    defaultHeroTitleEm: "certifié",
    heroSubtitle: "Installations électriques, dépannages d'urgence 24/7 et mises aux normes certifiées NF C 15-100.",
    aboutLabel: "Notre expertise",
    aboutTitle: "Rigueur & sécurité,<br><em>à chaque intervention</em>",
    aboutTextTemplate: (brandName) => `Intervenant depuis plus de 10 ans, ${brandName} assure tous vos travaux électriques résidentiels et tertiaires avec un soin extrême.\n\nNous garantissons des installations durables, esthétiques et conformes aux normes environnementales et de sécurité les plus strictes.`,
    benefits: [
      "Intervention d'urgence disponible 24h/24 et 7j/7",
      "Mise aux normes et certification NF C 15-100",
      "Solutions domotiques et éclairage LED architectural",
      "Devis gratuit et détaillé avant tout chantier"
    ],
    servicesTitle: "Une gamme complète <em>de services électriques</em>",
    servicesSubtitle: "Du dépannage rapide à la rénovation globale de vos réseaux électriques et bornes IRVE.",
    services: [
      { num: '01', title: 'Tableau & Mise aux Normes', desc: 'Remplacement de tableau électrique, disjoncteurs différentiels et sécurisation NF C 15-100.', img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=80&auto=format&fit=crop' },
      { num: '02', title: 'Bornes de Recharge (IRVE)', desc: 'Installation certifiée de bornes Wallbox à domicile ou en entreprise.', img: 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=800&q=80&auto=format&fit=crop' },
      { num: '03', title: 'Domotique & Éclairage LED', desc: 'Automatisation volets, chauffage connecté, spots intégrés et gestion d\'énergie.', img: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&q=80&auto=format&fit=crop' },
      { num: '04', title: 'Dépannage Urgence 24/7', desc: 'Recherche de panne rapide, court-circuit, relance de courant en urgence.', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format&fit=crop' }
    ],
    aboutImg1: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=80&auto=format&fit=crop',
    aboutImg2: 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=600&q=80&auto=format&fit=crop',
    signatureQuote: "L'électricité moderne exige une précision absolue et une sécurité sans concession. Votre sérénité est notre priorité.",
    signatureAuthor: "Maître Électricien",
    signatureImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format&fit=crop',
    eventsLabel: "Nos domaines",
    eventsTitle: "Savoir-faire <em>technique</em>",
    events: [
      { num: '01', title: 'Résidentiel & Appartements', desc: 'Mise en conformité, création de prises, rénovation complète de circuits.' },
      { num: '02', title: 'Locaux Professionnels', desc: 'Armoires triphasées, éclairage tertiaire, réseaux informatiques et sécurité.' },
      { num: '03', title: 'Dépannage d\'Urgence', desc: 'Un technicien à votre domicile en moins de 30 minutes pour rétablir votre installation.' }
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&q=75&auto=format&fit=crop'
    ],
    bookingTitle: "Demander une <em>intervention</em>",
    bookingSubtitle: "Recevez une estimation claire et un rdv rapide pour vos travaux d'électricité.",
    bookingTrust: ["Intervention 24/7 garantie", "Matériel certifié NF", "Devis gratuit & transparent"]
  },
  plombier: {
    accent: '#C9A96E',
    tagline: 'Plomberie & Chauffage',
    heroImage: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=85&auto=format&fit=crop',
    defaultHeroTitle: "Artisan Plombier",
    defaultHeroTitleEm: "qualifié",
    heroSubtitle: "Dépannage de fuites, création de salles de bain et installation de chauffages thermodynamiques.",
    aboutLabel: "Notre savoir-faire",
    aboutTitle: "Plomberie d'art,<br><em>confiance & réactivité</em>",
    aboutTextTemplate: (brandName) => `${brandName} résout l'ensemble de vos problématiques d'eau, de canalisation et de chauffage avec professionnalisme.\n\nQu'il s'agisse d'une urgence à résoudre en 30 minutes ou d'un projet de salle de bain sur mesure, notre équipe vous accompagne.`,
    benefits: [
      "Intervention d'urgence fuite & canalisation en 30 min",
      "Rénovation complète de salle de bain clé en main",
      "Installation et entretien chauffe-eau & pompe à chaleur",
      "Tarifs transparents et devis gratuit préalable"
    ],
    servicesTitle: "Vos travaux de plomberie <em>en toute sérénité</em>",
    servicesSubtitle: "Matériel haut de gamme et finitions impeccables pour tous vos sanitaires et canalisations.",
    services: [
      { num: '01', title: 'Recherche & Réparation de Fuite', desc: 'Détection non destructive par caméra thermique et colmatage immédiat.', img: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80&auto=format&fit=crop' },
      { num: '02', title: 'Création Salle de Bain', desc: 'Douche à l\'italienne, robinetterie encastrée, carrelage et réseaux sanitaires.', img: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&q=80&auto=format&fit=crop' },
      { num: '03', title: 'Chauffe-Eau & Thermodynamique', desc: 'Pose, détartrage et remplacement de ballons d\'eau chaude toutes marques.', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80&auto=format&fit=crop' },
      { num: '04', title: 'Débouchage & Hydrocurage', desc: 'Désobstruction rapide de canalisations bouchées avec furet et pression.', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format&fit=crop' }
    ],
    aboutImg1: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80&auto=format&fit=crop',
    aboutImg2: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80&auto=format&fit=crop',
    signatureQuote: "Un travail de plomberie bien exécuté, c'est la garantie d'une tranquillité d'esprit pour des décennies.",
    signatureAuthor: "Maître Plombier",
    signatureImg: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format&fit=crop',
    eventsLabel: "Nos prestations",
    eventsTitle: "Interventions <em>spécialisées</em>",
    events: [
      { num: '01', title: 'Dépannage d\'Urgence', desc: 'Fuite d\'eau massive, rupture de canalisation ou ballon en panne résolus sur-le-champ.' },
      { num: '02', title: 'Rénovation Sanitaire', desc: 'Transformez votre salle de bain avec des matériaux nobles et des installations modernes.' },
      { num: '03', title: 'Traitement de l\'Eau', desc: 'Pose d\'adoucisseurs et systèmes de filtration pour préserver vos équipements.' }
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&q=75&auto=format&fit=crop'
    ],
    bookingTitle: "Besoin d'un <em>plombier</em> ?",
    bookingSubtitle: "Obtenez une intervention rapide ou un devis gratuit pour vos projets sanitaires.",
    bookingTrust: ["Arrivée sous 30 minutes", "Devis gratuit & sans surprise", "Garantie pièces & main d'œuvre"]
  },
  couvreur: {
    accent: '#C9A96E',
    tagline: 'Couverture & Zinguerie',
    heroImage: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=1600&q=85&auto=format&fit=crop',
    defaultHeroTitle: "Artisan Couvreur",
    defaultHeroTitleEm: "d'expérience",
    heroSubtitle: "Rénovation de toitures, étanchéité, zinguerie sur mesure et isolation de combles.",
    aboutLabel: "Notre tradition",
    aboutTitle: "Protection & esthétique,<br><em>pour votre toit</em>",
    aboutTextTemplate: (brandName) => `${brandName} protège votre patrimoine immobilier grâce à un savoir-faire artisanal éprouvé en couverture et zinguerie.\n\nNous sélectionnons des matériaux de haute qualité pour garantir l'étanchéité et l'isolation thermique de votre toiture.`,
    benefits: [
      "Garantie décennale sur tous nos chantiers",
      "Inspection de toiture et devis gratuits",
      "Traitements hydrofuges longue durée",
      "Pose de velux et zinguerie en zinc/cuivre"
    ],
    servicesTitle: "Des prestations complètes <em>de couverture</em>",
    servicesSubtitle: "De la simple réparation de tuiles cassées à la réfection intégrale de charpente et couverture.",
    services: [
      { num: '01', title: 'Réfection de Toiture', desc: 'Remplacement de tuiles, ardoises, bac acier avec sous-toiture respirante.', img: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80&auto=format&fit=crop' },
      { num: '02', title: 'Zinguerie & Gouttières', desc: 'Pose et réparation de gouttières zinc, chenaux et habillages de rives.', img: 'https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=800&q=80&auto=format&fit=crop' },
      { num: '03', title: 'Démoussage & Hydrofuge', desc: 'Nettoyage haute pression, traitement anti-mousse et imperméabilisation.', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop' },
      { num: '04', title: 'Isolation de Combles', desc: 'Isolation thermique performante par l\'extérieur ou sarking.', img: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80&auto=format&fit=crop' }
    ],
    aboutImg1: 'https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=800&q=80&auto=format&fit=crop',
    aboutImg2: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80&auto=format&fit=crop',
    signatureQuote: "Une toiture solide est le bouclier protecteur de votre foyer. Nous y mettons tout notre cœur d'artisan.",
    signatureAuthor: "Maître Couvreur",
    signatureImg: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80&auto=format&fit=crop',
    eventsLabel: "Nos chantiers",
    eventsTitle: "Projets de <em>couverture</em>",
    events: [
      { num: '01', title: 'Rénovation Complète', desc: 'Réfection à neuf de toitures anciennes dans le respect du style architectural local.' },
      { num: '02', title: 'Recherche de Fuite', desc: 'Mise en sécurité immédiate et bâchage d\'urgence après intempéries.' },
      { num: '03', title: 'Pose de Velux', desc: 'Création d\'ouvertures et fenêtres de toit pour apporter de la lumière naturelle.' }
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=75&auto=format&fit=crop'
    ],
    bookingTitle: "Demander un <em>devis toiture</em>",
    bookingSubtitle: "Recevez un diagnostic gratuit et détaillé pour vos travaux de couverture.",
    bookingTrust: ["Garantie Décennale", "Devis & déplacement gratuits", "Matériaux certifiés"]
  },
  serrurier: {
    accent: '#C9A96E',
    tagline: 'Serrurerie de Sécurité',
    heroImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1600&q=85&auto=format&fit=crop',
    defaultHeroTitle: "Serrurier d'Urgence",
    defaultHeroTitleEm: "24h/24 & 7j/7",
    heroSubtitle: "Ouverture de porte rapide sans dégât, blindage et installation de serrures A2P haute sécurité.",
    aboutLabel: "Sécurité & confiance",
    aboutTitle: "Protéger votre foyer,<br><em>notre métier</em>",
    aboutTextTemplate: (brandName) => `${brandName} intervient en urgence pour sécuriser vos accès et débloquer vos portes avec une précision professionnelle.\n\nNos serruriers qualifiés installent des équipements certifiés A2P agréés par les plus grandes compagnies d'assurance.`,
    benefits: [
      "Arrivée sur place en moins de 30 minutes 24h/24",
      "Ouverture de porte claquée sans abîmer le cadre",
      "Serrures certifiées A2P 3 et 5 points",
      "Tarifs agréés assurances et devis annoncé avant travaux"
    ],
    servicesTitle: "Des prestations <em>haute sécurité</em>",
    servicesSubtitle: "De l'ouverture fine d'urgence à l'installation de portes blindées certifiées.",
    services: [
      { num: '01', title: 'Ouverture de Porte', desc: 'Porte claquée ou fermée à clé, déblocage rapide et soigné sans destruction.', img: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80&auto=format&fit=crop' },
      { num: '02', title: 'Changement de Serrure', desc: 'Remplacement de cylindres et pose de serrures A2P multipoints.', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80&auto=format&fit=crop' },
      { num: '03', title: 'Blindage de Porte', desc: 'Installation de cornières anti-pinces, pênes de sécurité et blocs-portes.', img: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=800&q=80&auto=format&fit=crop' },
      { num: '04', title: 'Sécurisation Post-Cambriolage', desc: 'Fermeture provisoire d\'urgence et remise en état immédiate de vos accès.', img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&auto=format&fit=crop' }
    ],
    aboutImg1: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80&auto=format&fit=crop',
    aboutImg2: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=600&q=80&auto=format&fit=crop',
    signatureQuote: "La sécurité de vos proches ne tolère aucun compromis. Nous répondons présent à chaque heure du jour et de la nuit.",
    signatureAuthor: "Serrurier Expert",
    signatureImg: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80&auto=format&fit=crop',
    eventsLabel: "Nos urgences",
    eventsTitle: "Assistance <em>immédiate</em>",
    events: [
      { num: '01', title: 'Clé Perdue ou Volée', desc: 'Remplacement immédiat du barillet pour empêcher toute intrusion.' },
      { num: '02', title: 'Porte Claquée', desc: 'Ouverture par radio ou technique fine sans endommager la serrure d\'origine.' },
      { num: '03', title: 'Mise en Sécurité', desc: 'Fermeture provisoire solide suite à une tentative d\'effraction.' }
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=800&q=75&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=75&auto=format&fit=crop'
    ],
    bookingTitle: "Demander une <em>intervention</em>",
    bookingSubtitle: "Appel ou message pour un dépannage express en moins de 30 minutes.",
    bookingTrust: ["Disponibilité 24h/7j", "Agréé Assurances", "Tarifs transparents annoncés"]
  },
  realEstate: {
    accent: '#C9A96E',
    heroTitle: "L'Immobilier <em>d'Exception</em>",
    heroSubtitle: "Accompagnement sur-mesure pour l'achat, la vente et la gestion de biens de prestige.",
    statLabels: [
      { label: "TRANSACTIONS RÉUSSIES", value: 98 },
      { label: "DISPRÉTION ASSURÉE", value: 100 },
      { label: "ACCOMPAGNEMENT VIP", value: 95 }
    ],
    aboutLabel: "Prestige & Réseau",
    aboutTitle: "Votre partenaire <em>immobilier</em>",
    aboutTextTemplate: (brandName) => `${brandName} sélectionne des propriétés uniques et vous offre une expertise immobilière d'excellence.`,
    benefits: ["Estimation précise au juste prix", "Diffusion ciblée et confidentielle", "Accompagnement juridique complet", "Service conciergerie dédié"],
    servicesTitle: "Services <em>immobiliers</em>",
    servicesSubtitle: "Un accompagnement haut de gamme à chaque étape de votre projet.",
    services: [
      { num: '01', title: 'Vente & Acquisition', desc: 'Sourcing et commercialisation de demeures de charme et appartements d\'exception.', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format&fit=crop' },
      { num: '02', title: 'Estimation Confidentielle', desc: 'Évaluation rigoureuse basée sur les données réelles du marché haut de gamme.', img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80&auto=format&fit=crop' },
      { num: '03', title: 'Gestion Locative VIP', desc: 'Gestion sérénité de vos investissements immobiliers avec garanties loyers impayés.', img: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80&auto=format&fit=crop' },
      { num: '04', title: 'Chasseur Immobilier', desc: 'Mandat de recherche exclusif pour dénicher la perle rare hors marché.', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80&auto=format&fit=crop' }
    ],
    aboutImg1: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format&fit=crop',
    aboutImg2: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80&auto=format&fit=crop',
    signatureQuote: "Chaque bien a une histoire, nous révélons toute sa valeur avec élégance.",
    signatureAuthor: "Expert Immobilier",
    signatureImg: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80&auto=format&fit=crop',
    eventsLabel: "Nos expertises",
    eventsTitle: "Types de <em>biens</em>",
    events: [
      { num: '01', title: 'Villas & Propriétés', desc: 'Demeures d\'architecte et propriétés d\'exception.' },
      { num: '02', title: 'Appartements de Prestige', desc: 'Ateliers d\'artistes, penthouses et haussmanniens.' },
      { num: '03', title: 'Immeubles d\'Investissement', desc: 'Patrimoine de rendement et locaux commerciaux prime.' }
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80&auto=format&fit=crop'
    ],
    bookingTitle: "Confier votre <em>projet</em>",
    bookingSubtitle: "Rencontrons-nous pour échanger sur vos ambitions immobilières.",
    bookingTrust: ["Confidentialité Garantie", "Avis d'Expert Offert", "Réseau Privé"]
  },
  fitnessCoach: {
    accent: '#10B981',
    heroTitle: "Coaching Sportif <em>sur Mesure</em>",
    heroSubtitle: "Transformez votre physique et votre mental grâce à un suivi personnalisé de haut niveau.",
    statLabels: [
      { label: "RÉSULTATS GARANTIS", value: 98 },
      { label: "SUIVI PERSONNALISÉ", value: 100 },
      { label: "PROGRAMME ADAPTÉ", value: 95 }
    ],
    aboutLabel: "Performance & Santé",
    aboutTitle: "Votre coach <em>dédié</em>",
    aboutTextTemplate: (brandName) => `${brandName} vous accompagne avec bienveillance et exigence vers vos objectifs de remise en forme et de performance.`,
    benefits: ["Bilan physique complet offert", "Programmes nutritionnels personnalisés", "Séances en privé ou petit groupe", "Suivi quotidien via application"],
    servicesTitle: "Programmes de <em>coaching</em>",
    servicesSubtitle: "Une approche holistique adaptée à votre rythme et à votre condition physique.",
    services: [
      { num: '01', title: 'Coaching Privé 1-on-1', desc: 'Entraînement sur mesure à domicile ou en studio exclusif.', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop' },
      { num: '02', title: 'Remise en Forme & Perte de Poids', desc: 'Méthodes scientifiques efficaces pour éliminer les graisses et tonifier.', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop' },
      { num: '03', title: 'Prise de Masse & Renforcement', desc: 'Programmes de musculation et d\'hypertrophie ciblés.', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop' },
      { num: '04', title: 'Préparation Physique Spécifique', desc: 'Optimisation de la condition sportive pour compétition.', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&auto=format&fit=crop' }
    ],
    aboutImg1: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    aboutImg2: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&auto=format&fit=crop',
    signatureQuote: "Le seul mauvais entraînement est celui que vous n'avez pas fait. Révélez votre potentiel.",
    signatureAuthor: "Head Coach",
    signatureImg: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    eventsLabel: "Nos formats",
    eventsTitle: "Invisibles <em>limites</em>",
    events: [
      { num: '01', title: 'Studio Privé', desc: 'Espace haut de gamme réservé exclusivement à votre séance.' },
      { num: '02', title: 'À Domicile', desc: 'Le matèriel professionnel livré chez vous pour plus de confort.' },
      { num: '03', title: 'Small Group', desc: 'Énergie de groupe limitée à 4 personnes maximum.' }
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80&auto=format&fit=crop'
    ],
    bookingTitle: "Réserver votre <em>séance bilan</em>",
    bookingSubtitle: "Commencez dès aujourd'hui par une évaluation physique offerte.",
    bookingTrust: ["Bilan Offert", "Accès Privatif", "Sans Engagement"]
  },
  drivingSchool: {
    accent: '#3B82F6',
    heroTitle: "Permis de Conduire <em>Serein</em>",
    heroSubtitle: "Formation rapide, pédagogie moderne et moniteurs diplômés pour réussir du premier coup.",
    statLabels: [
      { label: "TAUX DE RÉUSSITE", value: 92 },
      { label: "MONITEURS DIPLÔMÉS", value: 100 },
      { label: "MONITEUR DÉDIÉ", value: 98 }
    ],
    aboutLabel: "Pédagogie & Réussite",
    aboutTitle: "Votre permis en toute <em>confiance</em>",
    aboutTextTemplate: (brandName) => `${brandName} vous forme à la conduite en toute sécurité grâce à des méthodes ludiques et des véhicules récents.`,
    benefits: ["Permis accéléré disponible en 15 jours", "Paiement en 3x ou 4x sans frais", "Véhicules récents et climatisés", "Code en ligne 24/7 avec suivi des fautes"],
    servicesTitle: "Nos <em>Formations</em>",
    servicesSubtitle: "Des formules adaptées à votre emploi du temps.",
    services: [
      { num: '01', title: 'Permis B Traditionnel & Boîte Auto', desc: 'Apprentissage progressif avec un moniteur référant dédié.', img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80&auto=format&fit=crop' },
      { num: '02', title: 'Stage Accéléré Permis B', desc: 'Formation intensive sur 2 à 3 semaines pour passer l\'examen rapidement.', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80&auto=format&fit=crop' },
      { num: '03', title: 'Conduite Accompagnée (AAC)', desc: 'Dès 15 ans pour acquérir une solide expérience au volant.', img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80&auto=format&fit=crop' },
      { num: '04', title: 'Remise en Confiance & Perfectionnement', desc: 'Reprenez le volant sereinement après une période d\'arrêt.', img: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80&auto=format&fit=crop' }
    ],
    aboutImg1: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80&auto=format&fit=crop',
    aboutImg2: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80&auto=format&fit=crop',
    signatureQuote: "Bien conduire, c'est acquérir des réflexes de sécurité pour toute sa vie.",
    signatureAuthor: "Directeur Pédagogique",
    signatureImg: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80&auto=format&fit=crop',
    eventsLabel: "Avantages",
    eventsTitle: "Pour votre <em>réussite</em>",
    events: [
      { num: '01', title: 'Moniteur Unique', desc: 'Un suivi personnalisé avec le même formateur tout au long de votre parcours.' },
      { num: '02', title: 'Code en Ligne 24/7', desc: 'Entraînez-vous depuis votre smartphone avec les séries officielles.' },
      { num: '03', title: 'Financement CPF / 1€', desc: 'Facilités de paiement et éligibilité aux aides d\'État.' }
    ],
    galleryPhotos: [
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=900&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=900&q=80&auto=format&fit=crop'
    ],
    bookingTitle: "S'inscrire à une <em>évaluation</em>",
    bookingSubtitle: "Évaluez votre volume d'heures nécessaires gratuitement.",
    bookingTrust: ["Paiement Facilités", "Agrément Égalité", "Agrée CPF"]
  }
};

NICHE_CONFIGS.restaurant = NICHE_CONFIGS.traiteur;
NICHE_CONFIGS.restauration = NICHE_CONFIGS.traiteur;
NICHE_CONFIGS.food = NICHE_CONFIGS.traiteur;
NICHE_CONFIGS.resto = NICHE_CONFIGS.traiteur;
NICHE_CONFIGS.bistro = NICHE_CONFIGS.traiteur;
NICHE_CONFIGS.brasserie = NICHE_CONFIGS.traiteur;

NICHE_CONFIGS.electrician = NICHE_CONFIGS.electricien;
NICHE_CONFIGS.plumber = NICHE_CONFIGS.plombier;
NICHE_CONFIGS.roofer = NICHE_CONFIGS.couvreur;
NICHE_CONFIGS.locksmith = NICHE_CONFIGS.serrurier;

NICHE_CONFIGS.immobilier = NICHE_CONFIGS.realEstate;
NICHE_CONFIGS.coach = NICHE_CONFIGS.fitnessCoach;
NICHE_CONFIGS.autoecole = NICHE_CONFIGS.drivingSchool;

// French alias keys
NICHE_CONFIGS.electricien = NICHE_CONFIGS.electrician || NICHE_CONFIGS.electricien;
NICHE_CONFIGS.plombier = NICHE_CONFIGS.plumber || NICHE_CONFIGS.plombier;
NICHE_CONFIGS.couvreur = NICHE_CONFIGS.roofer || NICHE_CONFIGS.couvreur;
NICHE_CONFIGS.serrurier = NICHE_CONFIGS.locksmith || NICHE_CONFIGS.serrurier;

export function buildLuxuryTemplate(lead, content = {}, nicheKey = 'traiteur') {
  const currentContent = content || {};
  const activeKey = currentContent.nicheOverride || nicheKey || 'traiteur';
  const config = NICHE_CONFIGS[activeKey] || NICHE_CONFIGS[nicheKey] || NICHE_CONFIGS.traiteur;

  const brandName = lead.name || lead.companyName || lead.company || lead.businessName || 'Entreprise';
  const displayCity = lead.city || extractCity(lead) || 'votre ville';
  const lang = detectLanguage(lead);
  const displayPhone = lead.phone || '01 89 00 00 00';
  const phoneClean = (lead.phone || '').replace(/\D/g, '') || '33189000000';
  const phoneHref = lead.phone ? `tel:${lead.phone}` : '#devis';
  const displayAddress = currentContent.mapAddress || currentContent.address || lead.address || (displayCity ? `${displayCity} & environs` : 'France');
  const accentColor = currentContent.accentColor || config.accent || '#C9A96E';

  const brandWords = brandName.split(' ');
  const firstPart = brandWords[0] || brandName;
  const secondPart = brandWords.slice(1).join(' ') || '';
  const websiteDomain = lead.website ? lead.website.replace(/https?:\/\/|www\./g, '').split('/')[0] : '';
  const faviconUrl = websiteDomain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(websiteDomain)}&sz=128` : null;
  const siteLogoUrl = lead.logo || lead.avatar || lead.profilePic || lead.photo || faviconUrl;

  const fallbackUnsplash = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop';

  const defaultGalleryList = config.galleryPhotos || [
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80&auto=format&fit=crop',
  ];

  // Photos setup
  const rawPhotos = (currentContent.photos && Array.isArray(currentContent.photos) && currentContent.photos.length > 0)
    ? currentContent.photos.filter(p => typeof p === 'string' && p.startsWith('http'))
    : ((lead.siteData?.photos && Array.isArray(lead.siteData.photos) && lead.siteData.photos.length > 0)
        ? lead.siteData.photos.filter(p => typeof p === 'string' && p.startsWith('http'))
        : ((lead.photos && Array.isArray(lead.photos) && lead.photos.length > 0)
            ? lead.photos.filter(p => typeof p === 'string' && p.startsWith('http'))
            : []));

  const galleryPhotos = rawPhotos.length > 0
    ? rawPhotos.slice(0, 8)
    : defaultGalleryList;

  const heroImage = currentContent.heroImage || (lead.siteData?.heroPhoto) || config.heroImage || fallbackUnsplash;

  // Title formatting with em
  const rawHeroTitle = currentContent.heroTitle || config.defaultHeroTitle;
  let formattedHeroTitle = rawHeroTitle;
  if (!currentContent.heroTitle) {
    formattedHeroTitle = `${config.defaultHeroTitle} <em>${config.defaultHeroTitleEm || ('in ' + displayCity)}</em>`;
  } else {
    const words = rawHeroTitle.split(' ');
    if (words.length > 2) {
      const lastWords = words.slice(-2).join(' ');
      formattedHeroTitle = words.slice(0, -2).join(' ') + ` <em>${lastWords}</em>`;
    } else {
      formattedHeroTitle = `<em>${rawHeroTitle}</em>`;
    }
  }

  const heroSubtitle = currentContent.heroSubtitle || config.heroSubtitle;
  const tagline = currentContent.tagline || config.tagline;

  // Stats
  const googleRating = lead.rating || '4.3';
  const reviewsCount = lead.userRatingsTotal || (lead.googleReviews?.length) || 115;

  // About Section formatting
  const aboutLabel = currentContent.aboutLabel || config.aboutLabel || "Notre histoire";
  const aboutTitle = currentContent.aboutTitle || config.aboutTitle;
  const aboutText = currentContent.aboutText || config.aboutTextTemplate(brandName);
  const paragraphs = aboutText.split('\n\n').filter(Boolean);
  const aboutParagraphsHTML = paragraphs.map(p => `<p class="reveal">${p}</p>`).join('\n');

  const benefits = currentContent.benefits || config.benefits;
  const benefitsHTML = benefits.map(b => `
    <div class="intro-feature">
      <div class="intro-feature-dot"></div>
      ${b}
    </div>
  `).join('\n');

  // Services
  const servicesToRender = (currentContent.services && currentContent.services.length)
    ? currentContent.services.map((s, idx) => ({
        ...s,
        img: s.img || s.image || (config.services && config.services[idx % config.services.length] ? (config.services[idx % config.services.length].img || config.services[idx % config.services.length].image) : fallbackUnsplash) || fallbackUnsplash,
        num: s.num || String(idx + 1).padStart(2, '0'),
      }))
    : config.services;
  const servicesList = servicesToRender;

  const servicesTitle = currentContent.servicesTitle || config.servicesTitle;
  const servicesSubtitle = currentContent.servicesSubtitle || config.servicesSubtitle;

  const servicesHTML = servicesToRender.map(s => `
    <div class="service-card reveal">
      <img class="service-card-img" src="${s.img || s.image}" alt="${s.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackUnsplash}';" />
      <div class="service-card-overlay"></div>
      <div class="service-card-content">
        <div class="service-card-num">${s.num || '01'}</div>
        <div class="service-card-title">${s.title}</div>
        <div class="service-card-desc">
          ${s.desc || s.description || ''}
        </div>
      </div>
    </div>
  `).join('\n');

  // Events / Occasions
  const eventsList = (currentContent.events && currentContent.events.length > 0)
    ? currentContent.events.map((e, idx) => ({
        ...e,
        num: e.num || String(idx + 1).padStart(2, '0'),
        title: e.title || (config.events[idx % config.events.length]?.title || ''),
        desc: e.desc || e.description || (config.events[idx % config.events.length]?.desc || '')
      }))
    : (currentContent.steps && currentContent.steps.length > 0)
    ? currentContent.steps.map((st, idx) => ({
        ...st,
        num: st.step || st.num || String(idx + 1).padStart(2, '0'),
        title: st.title || (config.events[idx % config.events.length]?.title || ''),
        desc: st.description || st.desc || (config.events[idx % config.events.length]?.desc || '')
      }))
    : config.events;

  const eventsHTML = eventsList.map((e, idx) => `
    <div class="event-card reveal">
      <div class="event-card-num">${e.num || (`0${idx + 1}`)}</div>
      <div class="event-card-title">${e.title}</div>
      <div class="event-card-desc">${e.desc || e.description || ''}</div>
    </div>
  `).join('\n');

  // Signature
  const signatureQuote = currentContent.signatureQuote || config.signatureQuote;
  const signatureAuthor = currentContent.signatureAuthor || `${config.signatureAuthor} de ${brandName}`;
  const signatureImg = currentContent.signatureImg || config.signatureImg;

  // Reviews / Testimonials
  let testimonialsList = currentContent.testimonials || [];
  if (lead.googleReviews && Array.isArray(lead.googleReviews) && lead.googleReviews.length > 0) {
    testimonialsList = lead.googleReviews.slice(0, 4).map((r, idx) => ({
      name: r.author || r.name || 'Client Vérifié',
      text: r.text || r.reviewText || '',
      rating: r.rating || 5,
      city: displayCity
    }));
  }
  if (testimonialsList.length === 0) {
    testimonialsList = [
      { name: 'Sylvie L.', text: '"Incredibly fast, polite, and fully restored things! Got things solved thoroughly in under an hour."', rating: 5, city: displayCity },
      { name: 'Marc A.', text: '"High attention to detail, very transparent flat fees, and took great care to sweep up. Unmatched team!"', rating: 5, city: displayCity }
    ];
  }

  const reviewsHTML = testimonialsList.map(t => `
    <div class="review-card reveal">
      <div class="review-stars">${'★'.repeat(t.rating || 5)}</div>
      <div class="review-text">${t.text}</div>
      <div class="review-author">${t.name}</div>
      <div class="review-event">${t.city || displayCity}</div>
    </div>
  `).join('\n');

  const galleryItemsHTML = galleryPhotos.map((photo, i) => `
    <div class="gallery-item reveal" onclick="openLightbox(${i})">
      <img src="${photo}" alt="Création ${i + 1}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackUnsplash}';" />
      <div class="gallery-item-hover">
        <span class="gallery-zoom-icon">🔍</span>
      </div>
    </div>
  `).join('\n');

  const ctaButton = currentContent.ctaButton || 'Demander un devis';
  const ctaButtonSecondary = currentContent.ctaButtonSecondary || 'Nos prestations';

  const bookingTrust = config.bookingTrust || ["Réponse sous 24h garantie", "Devis gratuit & sans engagement", "Intervention certifiée"];
  const bookingTrustHTML = bookingTrust.map(t => `
    <div class="form-trust-item">
      <div class="form-trust-dot"></div>
      ${t}
    </div>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<base href="/">
<meta name="referrer" content="no-referrer">
<title>${brandName} — ${config.tagline} à ${displayCity}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box }

:root {
  --noir: #0A0A0A;
  --noir2: #111111;
  --or: ${accentColor};
  --or-light: #E8D5B0;
  --blanc: #FAFAF7;
  --gris: #6B6B6B;
  --gris-light: #F2F0EB;
  --font-serif: 'Cormorant Garamond', serif;
  --font-sans: 'Jost', sans-serif;
}

html { scroll-behavior: smooth }

body {
  font-family: var(--font-sans);
  background: var(--blanc);
  color: var(--noir);
  overflow-x: hidden;
}

/* ─── NAVBAR ─── */
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 900;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.4s ease;
  background: transparent;
}
nav.scrolled {
  background: rgba(10,10,10,0.95);
  backdrop-filter: blur(20px);
  padding: 14px 40px;
  border-bottom: 1px solid rgba(201,169,110,0.15);
}
.nav-logo {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 400;
  color: white;
  letter-spacing: 0.08em;
}
.nav-logo span {
  color: var(--or);
  font-style: italic;
}
.nav-cta {
  background: transparent;
  border: 1px solid var(--or);
  color: var(--or);
  padding: 10px 24px;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}
.nav-cta:hover {
  background: var(--or);
  color: var(--noir);
}

/* ─── HERO ─── */
.hero {
  height: 100vh;
  min-height: 700px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: url('${heroImage}') center/cover no-repeat;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(10,10,10,0.88) 0%,
    rgba(10,10,10,0.65) 50%,
    rgba(10,10,10,0.3) 100%
  );
}
.hero-content {
  position: relative;
  z-index: 2;
  padding: 0 40px;
  max-width: 680px;
}
.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  opacity: 0;
  animation: fadeUp 0.8s 0.2s forwards;
}
.hero-label-line {
  width: 32px;
  height: 1px;
  background: var(--or);
}
.hero-label-text {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--or);
}
.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(48px, 7vw, 88px);
  font-weight: 300;
  color: white;
  line-height: 1.0;
  margin-bottom: 24px;
  opacity: 0;
  animation: fadeUp 0.8s 0.4s forwards;
}
.hero-title em {
  font-style: italic;
  color: var(--or);
  display: block;
}
.hero-subtitle {
  font-size: 15px;
  font-weight: 300;
  color: rgba(255,255,255,0.7);
  line-height: 1.8;
  max-width: 460px;
  margin-bottom: 40px;
  opacity: 0;
  animation: fadeUp 0.8s 0.6s forwards;
}
.hero-btns {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  opacity: 0;
  animation: fadeUp 0.8s 0.8s forwards;
}
.btn-gold {
  background: var(--or);
  color: var(--noir);
  padding: 16px 36px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
}
.btn-gold:hover {
  background: var(--or-light);
}
.btn-outline-white {
  background: transparent;
  color: white;
  border: 1px solid rgba(255,255,255,0.4);
  padding: 16px 36px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
}
.btn-outline-white:hover {
  border-color: white;
  background: rgba(255,255,255,0.08);
}

/* Stats bar */
.hero-stats {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  z-index: 3;
  display: flex;
  background: rgba(201,169,110,0.12);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(201,169,110,0.2);
}
.hero-stat {
  flex: 1;
  padding: 20px 24px;
  text-align: center;
  border-right: 1px solid rgba(201,169,110,0.15);
}
.hero-stat:last-child { border-right: none }
.hero-stat-num {
  font-family: var(--font-serif);
  font-size: 36px;
  font-weight: 300;
  color: var(--or);
  line-height: 1;
  margin-bottom: 4px;
}
.hero-stat-label {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
}

/* ─── SECTION LABEL ─── */
.section-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.section-label-line {
  width: 24px;
  height: 1px;
  background: var(--or);
}
.section-label-text {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--or);
}
.section-title {
  font-family: var(--font-serif);
  font-size: clamp(34px, 4vw, 54px);
  font-weight: 300;
  color: var(--noir);
  line-height: 1.15;
}
.section-title em {
  font-style: italic;
  color: var(--or);
}
.section-title-white {
  color: white;
}

/* ─── INTRO SECTION ─── */
.intro {
  padding: 100px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
.intro-img-wrap {
  position: relative;
  height: 560px;
}
.intro-img-main {
  width: 80%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  right: 0;
}
.intro-img-accent {
  width: 55%;
  height: 280px;
  object-fit: cover;
  position: absolute;
  bottom: -40px;
  left: -20px;
  border: 6px solid var(--blanc);
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
}
.intro-gold-badge {
  position: absolute;
  top: 40px;
  left: 0;
  background: var(--or);
  padding: 16px 20px;
  text-align: center;
  z-index: 2;
}
.intro-gold-badge-num {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 300;
  color: var(--noir);
  line-height: 1;
}
.intro-gold-badge-text {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--noir);
  margin-top: 3px;
}
.intro-text p {
  font-size: 15px;
  font-weight: 300;
  color: var(--gris);
  line-height: 1.9;
  margin-bottom: 16px;
}
.intro-features {
  margin: 28px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.intro-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 400;
  color: var(--noir);
}
.intro-feature-dot {
  width: 5px;
  height: 5px;
  background: var(--or);
  border-radius: 50%;
  flex-shrink: 0;
}

/* ─── SERVICES ─── */
.services {
  background: var(--noir);
  padding: 100px 40px;
}
.services-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.services-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: end;
  margin-bottom: 60px;
}
.services-header p {
  font-size: 14px;
  font-weight: 300;
  color: rgba(255,255,255,0.5);
  line-height: 1.8;
}
.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
}
.service-card {
  position: relative;
  overflow: hidden;
  height: 360px;
  cursor: default;
}
.service-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}
.service-card:hover .service-card-img {
  transform: scale(1.06);
}
.service-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10,10,10,0.92) 0%,
    rgba(10,10,10,0.4) 50%,
    transparent 100%
  );
  transition: all 0.4s;
}
.service-card:hover .service-card-overlay {
  background: linear-gradient(
    to top,
    rgba(10,10,10,0.96) 0%,
    rgba(10,10,10,0.6) 60%,
    rgba(10,10,10,0.2) 100%
  );
}
.service-card-content {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  padding: 32px;
}
.service-card-num {
  font-family: var(--font-serif);
  font-size: 13px;
  color: var(--or);
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.service-card-title {
  font-family: var(--font-serif);
  font-size: 26px;
  font-weight: 400;
  color: white;
  line-height: 1.2;
  margin-bottom: 10px;
}
.service-card-desc {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.6);
  line-height: 1.6;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}
.service-card:hover .service-card-desc {
  max-height: 80px;
}

/* ─── SIGNATURE ─── */
.signature {
  padding: 100px 40px;
  background: var(--gris-light);
}
.signature-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.signature-quote {
  font-family: var(--font-serif);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 300;
  font-style: italic;
  color: var(--noir);
  line-height: 1.5;
  margin-bottom: 24px;
}
.signature-quote-author {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--or);
}
.signature-img {
  width: 100%;
  height: 460px;
  object-fit: cover;
}

/* ─── EVENTS ─── */
.events {
  padding: 100px 40px;
  max-width: 1200px;
  margin: 0 auto;
}
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 56px;
}
.event-card {
  border-bottom: 1px solid #E0DDD6;
  padding-bottom: 28px;
  transition: all 0.3s;
}
.event-card:hover {
  border-bottom-color: var(--or);
}
.event-card-num {
  font-family: var(--font-serif);
  font-size: 48px;
  font-weight: 300;
  color: var(--gris-light);
  line-height: 1;
  margin-bottom: 12px;
}
.event-card-title {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 400;
  color: var(--noir);
  margin-bottom: 10px;
}
.event-card-desc {
  font-size: 13px;
  font-weight: 300;
  color: var(--gris);
  line-height: 1.7;
}

/* ─── REVIEWS ─── */
.reviews {
  background: var(--noir);
  padding: 100px 40px;
}
.reviews-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.reviews-header {
  text-align: center;
  margin-bottom: 60px;
}
.reviews-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}
.reviews-rating-num {
  font-family: var(--font-serif);
  font-size: 52px;
  font-weight: 300;
  color: var(--or);
  line-height: 1;
}
.reviews-rating-info {
  text-align: left;
}
.reviews-stars {
  color: var(--or);
  font-size: 18px;
  letter-spacing: 2px;
}
.reviews-count {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255,255,255,0.4);
  margin-top: 2px;
}
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
}
.review-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(201,169,110,0.1);
  padding: 36px;
  transition: all 0.3s;
}
.review-card:hover {
  background: rgba(201,169,110,0.06);
  border-color: rgba(201,169,110,0.2);
}
.review-stars {
  color: var(--or);
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 16px;
}
.review-text {
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 300;
  font-style: italic;
  color: rgba(255,255,255,0.85);
  line-height: 1.7;
  margin-bottom: 20px;
}
.review-author {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--or);
}
.review-event {
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  margin-top: 2px;
}

/* ─── BOOKING ─── */
.booking {
  padding: 100px 40px;
  background: var(--gris-light);
}
.booking-inner {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}
.booking-inner .section-label {
  justify-content: center;
}
.booking-inner .section-title {
  margin-bottom: 16px;
}
.booking-subtitle {
  font-size: 15px;
  font-weight: 300;
  color: var(--gris);
  max-width: 500px;
  margin: 0 auto 48px;
  line-height: 1.8;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  text-align: left;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group.full {
  grid-column: 1 / -1;
}
.form-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gris);
}
.form-input {
  width: 100%;
  padding: 14px 18px;
  background: white;
  border: 1px solid #E0DDD6;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 300;
  color: var(--noir);
  outline: none;
  transition: border-color 0.2s;
  -webkit-appearance: none;
}
.form-input:focus {
  border-color: var(--or);
}
.form-input::placeholder {
  color: #BBBAB5;
}
select.form-input {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B6B6B' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}
textarea.form-input {
  resize: none;
  height: 120px;
}
.form-trust {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.form-trust-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 400;
  color: var(--gris);
}
.form-trust-dot {
  width: 4px;
  height: 4px;
  background: var(--or);
  border-radius: 50%;
}

/* ─── FOOTER ─── */
footer {
  background: var(--noir2);
  padding: 48px 40px 32px;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.footer-logo {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 300;
  color: white;
  letter-spacing: 0.06em;
}
.footer-logo span { color: var(--or); font-style: italic; }
.footer-info {
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,0.35);
  text-align: center;
  line-height: 1.7;
}
.footer-contact a {
  font-size: 13px;
  color: var(--or);
  text-decoration: none;
}
.footer-bottom {
  max-width: 1200px;
  margin: 20px auto 0;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgba(255,255,255,0.2);
}

/* ─── WA FLOAT ─── */
.wa-float {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 56px;
  height: 56px;
  background: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 24px rgba(37,211,102,0.4);
  z-index: 999;
  text-decoration: none;
  transition: transform 0.2s;
}
.wa-float:hover { transform: scale(1.08) }

/* ─── ANIMATIONS ─── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px) }
  to { opacity: 1; transform: translateY(0) }
}
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ─── GALLERY ─── */
.gallery-sec {
  padding: 120px 40px;
  background: var(--blanc);
}
.gallery-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.gallery-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  background: #EAE8E3;
}
.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.gallery-item:hover img {
  transform: scale(1.05);
}
.gallery-item-hover {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 10, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.gallery-item:hover .gallery-item-hover {
  opacity: 1;
}
.gallery-zoom-icon {
  font-size: 24px;
  color: white;
  transform: translateY(10px);
  transition: transform 0.4s ease;
}
.gallery-item:hover .gallery-zoom-icon {
  transform: translateY(0);
}

/* ─── LIGHTBOX ─── */
.lightbox {
  display: none;
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(10, 10, 10, 0.95);
  align-items: center;
  justify-content: center;
  user-select: none;
}
.lightbox.active {
  display: flex;
}
.lightbox-content {
  max-width: 90%;
  max-height: 80vh;
  object-fit: contain;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.1);
  transition: transform 0.3s ease;
}
.lightbox-close {
  position: absolute;
  top: 30px;
  right: 40px;
  color: white;
  font-size: 40px;
  font-weight: 200;
  cursor: pointer;
  transition: color 0.3s;
}
.lightbox-close:hover {
  color: var(--or);
}
.lightbox-caption {
  position: absolute;
  bottom: 40px;
  color: #DDD;
  font-family: var(--font-serif);
  font-size: 18px;
  font-style: italic;
  letter-spacing: 0.05em;
}
.lightbox-prev, .lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: white;
  font-size: 32px;
  padding: 20px;
  cursor: pointer;
  transition: color 0.3s;
}
.lightbox-prev:hover, .lightbox-next:hover {
  color: var(--or);
}
.lightbox-prev { left: 20px; }
.lightbox-next { right: 20px; }

/* ─── MOBILE ─── */
@media (max-width: 768px) {
  nav { padding: 16px 20px }
  nav.scrolled { padding: 12px 20px }
  .hero-content { padding: 0 20px; max-width: 100% }
  .hero-title { font-size: 42px }
  .hero-stats { display: none }
  .intro { grid-template-columns: 1fr; gap: 40px; padding: 60px 20px }
  .intro-img-wrap { height: 340px }
  .intro-img-accent { display: none }
  .services { padding: 60px 20px }
  .services-header { grid-template-columns: 1fr; gap: 20px }
  .services-grid { grid-template-columns: 1fr }
  .service-card { height: 300px }
  .signature-inner { grid-template-columns: 1fr; padding: 60px 20px }
  .signature { padding: 60px 20px }
  .events { padding: 60px 20px }
  .events-grid { grid-template-columns: 1fr }
  .reviews { padding: 60px 20px }
  .reviews-grid { grid-template-columns: 1fr }
  .booking { padding: 60px 20px }
  .form-grid { grid-template-columns: 1fr }
  footer { padding: 40px 20px 24px }
  .footer-inner { flex-direction: column; text-align: center }
  .footer-bottom { flex-direction: column; gap: 8px; text-align: center }
  .hero-btns { flex-direction: column }
  .btn-gold, .btn-outline-white { text-align: center }
  .gallery-sec { padding: 60px 20px }
  .lightbox-content { max-width: 95%; max-height: 70vh }
  .lightbox-close { top: 20px; right: 20px; font-size: 30px }
  .lightbox-caption { bottom: 20px; font-size: 14px }
  .lightbox-prev, .lightbox-next { padding: 10px; font-size: 24px }
}
</style>
</head>
<body>

<!-- NAVBAR -->
<nav id="nav">
  <div class="nav-logo" style="display: flex; align-items: center; gap: 10px;">
    ${siteLogoUrl ? `<img src="${siteLogoUrl}" alt="${brandName}" style="height: 32px; width: 32px; object-fit: contain; border-radius: 6px; background: #FFF; padding: 2px;" onerror="this.style.display='none';">` : ''}
    <div>${firstPart} <span>${secondPart}</span></div>
  </div>
  <a href="#booking" class="nav-cta">${ctaButton}</a>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-label">
      <div class="hero-label-line"></div>
      <div class="hero-label-text">${tagline} · ${displayCity}</div>
    </div>
    <h1 class="hero-title">
      ${formattedHeroTitle}
    </h1>
    <p class="hero-subtitle">
      ${heroSubtitle}
    </p>
    <div class="hero-btns">
      <a href="#booking" class="btn-gold">${ctaButton}</a>
      <a href="#services" class="btn-outline-white">${ctaButtonSecondary}</a>
    </div>
  </div>

  <div class="hero-stats">
    <div class="hero-stat">
      <div class="hero-stat-num">${googleRating}★</div>
      <div class="hero-stat-label">Note Google</div>
    </div>
    <div class="hero-stat">
      <div class="hero-stat-num">${reviewsCount}</div>
      <div class="hero-stat-label">Avis vérifiés</div>
    </div>
    <div class="hero-stat">
      <div class="hero-stat-num">10+ ans</div>
      <div class="hero-stat-label">Ans d'expérience</div>
    </div>
  </div>
</section>

<!-- INTRO -->
<section class="intro">
  <div class="intro-img-wrap reveal">
    <img class="intro-img-main"
      src="${galleryPhotos[0] || config.aboutImg1}"
      alt="${brandName}"
      referrerpolicy="no-referrer"
      onerror="this.onerror=null; this.src='${fallbackUnsplash}';" />
    <img class="intro-img-accent"
      src="${galleryPhotos[1] || config.aboutImg2}"
      alt="${brandName}"
      referrerpolicy="no-referrer"
      onerror="this.onerror=null; this.src='${fallbackUnsplash}';" />
    <div class="intro-gold-badge">
      <div class="intro-gold-badge-num">${reviewsCount}+</div>
      <div class="intro-gold-badge-text">Avis Client</div>
    </div>
  </div>

  <div class="intro-text">
    <div class="section-label reveal">
      <div class="section-label-line"></div>
      <div class="section-label-text">${aboutLabel}</div>
    </div>
    <h2 class="section-title reveal">
      ${aboutTitle}
    </h2>
    <div style="height:24px"></div>
    ${aboutParagraphsHTML}
    <div class="intro-features reveal">
      ${benefitsHTML}
    </div>
    <div style="height:32px"></div>
    <a href="#booking" class="btn-gold reveal">Parlons de votre projet</a>
  </div>
</section>

<!-- SERVICES -->
<section class="services" id="services">
  <div class="services-inner">
    <div class="services-header">
      <div>
        <div class="section-label reveal">
          <div class="section-label-line"></div>
          <div class="section-label-text">Nos prestations</div>
        </div>
        <h2 class="section-title section-title-white reveal">
          ${servicesTitle}
        </h2>
      </div>
      <p class="reveal">
        ${servicesSubtitle}
      </p>
    </div>

    <div class="services-grid">
      ${servicesHTML}
    </div>
  </div>
</section>

<!-- GALLERY SEC -->
<section class="gallery-sec" id="galerie">
  <div class="gallery-inner">
    <div class="section-label reveal" style="justify-content:center">
      <div class="section-label-line"></div>
      <div class="section-label-text">Galerie</div>
      <div class="section-label-line"></div>
    </div>
    <h2 class="section-title reveal" style="margin-top:16px; margin-bottom:40px; text-align:center">
      Savoir-faire <em>en images</em>
    </h2>
    <div class="gallery-grid">
      ${galleryItemsHTML}
    </div>
  </div>
</section>

<!-- LIGHTBOX -->
<div id="lightbox" class="lightbox" onclick="closeLightbox()">
  <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
  <img class="lightbox-content" id="lightbox-img" onclick="event.stopPropagation()" alt="Agrandissement" />
  <div class="lightbox-caption" id="lightbox-caption"></div>
  <button class="lightbox-prev" onclick="changeLightboxImg(-1, event)">&#10094;</button>
  <button class="lightbox-next" onclick="changeLightboxImg(1, event)">&#10095;</button>
</div>

<!-- SIGNATURE QUOTE -->
<section class="signature">
  <div class="signature-inner">
    <div>
      <div class="section-label reveal">
        <div class="section-label-line"></div>
        <div class="section-label-text">Notre philosophie</div>
      </div>
      <div style="height:20px"></div>
      <p class="signature-quote reveal">
        "${signatureQuote}"
      </p>
      <div class="signature-quote-author reveal">
        — ${signatureAuthor}
      </div>
      <div style="height:32px"></div>
      <a href="#booking" class="btn-gold reveal">
        Commencer votre projet
      </a>
    </div>
    <img class="signature-img reveal"
      src="${signatureImg}"
      alt="${brandName}"
      referrerpolicy="no-referrer"
      onerror="this.onerror=null; this.src='${fallbackUnsplash}';" />
  </div>
</section>

<!-- EVENTS / OCCASIONS -->
<section class="events">
  <div class="section-label reveal">
    <div class="section-label-line"></div>
    <div class="section-label-text">${config.eventsLabel || "Types d'événements"}</div>
  </div>
  <h2 class="section-title reveal">
    ${config.eventsTitle || "Pour chaque <em>occasion</em>"}
  </h2>

  <div class="events-grid">
    ${eventsHTML}
  </div>
</section>

<!-- REVIEWS -->
<section class="reviews">
  <div class="reviews-inner">
    <div class="reviews-header">
      <div class="section-label reveal" style="justify-content:center">
        <div class="section-label-line"></div>
        <div class="section-label-text">Témoignages</div>
        <div class="section-label-line"></div>
      </div>
      <h2 class="section-title section-title-white reveal" style="text-align:center;margin-top:16px">
        Ils nous ont fait <em>confiance</em>
      </h2>
      <div class="reviews-rating reveal">
        <div class="reviews-rating-num">${googleRating}</div>
        <div class="reviews-rating-info">
          <div class="reviews-stars">★★★★★</div>
          <div class="reviews-count">${reviewsCount} avis Google vérifiés</div>
        </div>
      </div>
    </div>

    <div class="reviews-grid">
      ${reviewsHTML}
    </div>
  </div>
</section>

<!-- BOOKING -->
<section class="booking" id="booking">
  <div class="booking-inner">
    <div class="section-label reveal">
      <div class="section-label-line"></div>
      <div class="section-label-text">Devis gratuit</div>
      <div class="section-label-line"></div>
    </div>
    <h2 class="section-title reveal" style="margin-top:16px">
      ${config.bookingTitle || "Parlons de votre <em>projet</em>"}
    </h2>
    <p class="booking-subtitle reveal">
      ${config.bookingSubtitle || "Remplissez les champs ci-dessous pour recevoir une réponse rapide et un devis personnalisé."}
    </p>

    <form id="booking-form" onsubmit="handleSubmit(event)">
      <div class="form-grid">
        <div class="form-group reveal">
          <label class="form-label">Prénom *</label>
          <input type="text" name="firstName" class="form-input" placeholder="Marie" required />
        </div>
        <div class="form-group reveal">
          <label class="form-label">Nom *</label>
          <input type="text" name="lastName" class="form-input" placeholder="Dupont" required />
        </div>
        <div class="form-group reveal">
          <label class="form-label">Email *</label>
          <input type="email" name="email" class="form-input" placeholder="marie@email.com" required />
        </div>
        <div class="form-group reveal">
          <label class="form-label">Téléphone</label>
          <input type="tel" name="phone" class="form-input" placeholder="${displayPhone}" />
        </div>
        <div class="form-group reveal">
          <label class="form-label">Type de prestation *</label>
          <select name="eventType" class="form-input" required>
            <option value="">Sélectionnez...</option>
            ${servicesList.map(s => `<option>${s.title}</option>`).join('')}
            <option>Autre prestation</option>
          </select>
        </div>
        <div class="form-group reveal">
          <label class="form-label">Taille / Convives / Format</label>
          <select name="guestCount" class="form-input">
            <option value="">Sélectionnez...</option>
            <option>Format réduit / Intime</option>
            <option>30 à 80 personnes / Moyen</option>
            <option>80 à 150 personnes / Grand</option>
            <option>Plus de 150 personnes</option>
          </select>
        </div>
        <div class="form-group reveal">
          <label class="form-label">Date prévue</label>
          <input type="date" name="eventDate" class="form-input" />
        </div>
        <div class="form-group reveal">
          <label class="form-label">Lieu / Ville</label>
          <input type="text" name="eventLocation" class="form-input" placeholder="${displayCity}" />
        </div>
        <div class="form-group full reveal">
          <label class="form-label">Décrivez votre projet</label>
          <textarea name="projectDescription" class="form-input" placeholder="Partagez vos besoins, le lieu de l'intervention, vos préférences..."></textarea>
        </div>
      </div>

      <button type="submit" class="btn-gold reveal" style="width:100%;padding:18px;font-size:12px;cursor:pointer;border:none;font-family:var(--font-sans)">
        Envoyer ma demande de devis →
      </button>

      <div class="form-trust reveal">
        ${bookingTrustHTML}
      </div>
    </form>

    <div id="success-msg" style="display:none;margin-top:24px">
      <div style="
        background:white;
        border:1px solid #E0DDD6;
        padding:32px;
        text-align:center;
      ">
        <div style="font-family:var(--font-serif);font-size:28px;color:var(--or);margin-bottom:8px">
          ✓ Demande envoyée
        </div>
        <div style="font-size:14px;color:var(--gris);line-height:1.7">
          Merci pour votre message.<br>
          Nous vous répondrons dans les plus brefs délais
          avec une proposition personnalisée.
        </div>
      </div>
    </div>
  </div>
</section>

${(currentContent.showGoogleMaps !== false && currentContent.showMap !== false) ? `
<!-- GOOGLE MAPS LOCATION -->
<section id="localisation" style="padding: 60px 20px; background: var(--noir, #0e0d0b); border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
  <div style="max-width: 1100px; margin: 0 auto;">
    <h2 style="font-family: var(--font-serif); font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 8px;">Plan & Localisation</h2>
    <p style="color: #999; font-size: 14px; margin-bottom: 20px;">📍 ${displayAddress} — ${displayCity}</p>
    <div style="margin-bottom: 24px;">
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress || (brandName + ' ' + displayCity))}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background: #C5A059; color: #000; font-weight: 800; text-decoration: none; border-radius: 8px; font-size: 13px; box-shadow: 0 4px 15px rgba(197, 160, 89, 0.3);">
        📍 Ouvrir sur Google Maps
      </a>
    </div>
    <div style="border-radius: 16px; overflow: hidden; border: 1px solid rgba(197, 160, 89, 0.3); height: 380px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
      <iframe
        title="Google Maps - ${brandName}"
        width="100%"
        height="100%"
        style="border:0;"
        loading="lazy"
        allowfullscreen
        src="https://maps.google.com/maps?q=${encodeURIComponent(displayAddress || (brandName + ' ' + displayCity))}&t=&z=14&ie=UTF8&iwloc=&output=embed">
      </iframe>
    </div>
  </div>
</section>
` : ''}

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-logo">${firstPart} <span>${secondPart}</span></div>
    <div class="footer-info">
      ${config.tagline} • ${displayAddress}<br>
      Disponible pour vos projets à ${displayCity} et sa région
    </div>
    <div class="footer-contact">
      <a href="${phoneHref}">📞 ${displayPhone}</a>
    </div>
  </div>
  <div class="footer-bottom">
    <div>© 2026 ${brandName}</div>
    <div>⚡ Propulsé par Nesta</div>
  </div>
</footer>

<!-- WA FLOAT -->
${lead.phone ? `
<a href="https://wa.me/${phoneClean}" target="_blank" class="wa-float" title="Contact WhatsApp">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>` : ''}

<script>
// Lightbox Gallery logic
let currentImgIndex = 0;
const galleryImages = ${JSON.stringify(galleryPhotos)};

function openLightbox(index) {
  currentImgIndex = index;
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  
  if (lightbox && img) {
    img.src = galleryImages[index];
    if (caption) {
      caption.innerHTML = "Agrandissement " + (index + 1);
    }
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function changeLightboxImg(dir, event) {
  if (event) event.stopPropagation();
  currentImgIndex = (currentImgIndex + dir + galleryImages.length) % galleryImages.length;
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  
  if (img) {
    img.style.transform = 'scale(0.95)';
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = galleryImages[currentImgIndex];
      if (caption) {
        caption.innerHTML = "Agrandissement " + (currentImgIndex + 1);
      }
      img.style.transform = 'scale(1)';
      img.style.opacity = '1';
    }, 150);
  }
}

// Navbar scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav')
  if (nav) {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled')
    } else {
      nav.classList.remove('scrolled')
    }
  }
})

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal')
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible')
      }, i * 60)
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.1 })
reveals.forEach(el => observer.observe(el))

// Form submit
async function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('booking-form');
  const btn = form.querySelector('button[type="submit"]');
  const successMsg = document.getElementById('success-msg');
  
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = 'Envoi en cours...';
  }

  const formData = new FormData(form);
  const firstName = formData.get('firstName') || '';
  const lastName = formData.get('lastName') || '';
  const clientName = (firstName + ' ' + lastName).trim() || 'Client';
  const clientEmail = formData.get('email') || '';
  const clientPhone = formData.get('phone') || '';
  const eventType = formData.get('eventType') || '';
  const guestCount = formData.get('guestCount') || '';
  const eventDate = formData.get('eventDate') || '';
  const eventLocation = formData.get('eventLocation') || '';
  const projectDescription = formData.get('projectDescription') || '';

  const message = "Prestation: " + eventType + " · Format: " + guestCount + " · Date: " + eventDate + " · Ville: " + eventLocation + " · Détails: " + projectDescription;

  const requestBody = {
    agencyId: "${lead.userId || lead.agencyId || ''}",
    clientName: clientName,
    clientEmail: clientEmail,
    clientPhone: clientPhone,
    request: "Type: " + eventType + " · Format: " + guestCount + " · Date: " + eventDate + " · Lieu: " + eventLocation + " · " + projectDescription,
    name: clientName,
    email: clientEmail,
    phone: clientPhone,
    message: message,
    businessName: "${brandName.replace(/"/g, '\\"')}",
    source: "demo_site"
  };

  try {
    const primaryUrl = '/api/widget/quote';
    const backupUrl = 'https://nesta-157843592970.europe-west2.run.app/api/widget/quote';
    
    let res = await fetch(primaryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!res.ok) {
      res = await fetch(backupUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
    }
  } catch (err) {
    console.error("Booking error:", err);
  }

  form.style.display = 'none';
  if (successMsg) successMsg.style.display = 'block';
}
</script>

</body>
</html>`;
}

export function buildMagasinTemplate(lead, content, nicheKey = 'traiteur') {
  return buildLuxuryTemplate(lead, content, nicheKey);
}

export { NICHE_CONFIGS };
