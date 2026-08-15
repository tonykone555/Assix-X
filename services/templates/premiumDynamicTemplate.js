import { extractCity, detectLanguage } from '../siteTemplate.js';

// Default gallery fallbacks (Unsplash) — reused per niche if lead.siteData.photos is empty
export const DEFAULT_GALLERY = {
  traiteur: [
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80&auto=format&fit=crop',
  ],
  electrician: [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565538810844-1e119412e8d0?w=900&q=80&auto=format&fit=crop',
  ],
  plumber: [
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581094128506-45a4b0824927?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=900&q=80&auto=format&fit=crop',
  ],
  roofer: [
    'https://images.unsplash.com/photo-1635616207962-144914ec9ac5?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80&auto=format&fit=crop',
  ],
  locksmith: [
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618579895756-cbfd52a20ca2?w=900&q=80&auto=format&fit=crop',
  ],
  realEstate: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80&auto=format&fit=crop',
  ],
  fitnessCoach: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80&auto=format&fit=crop',
  ],
  drivingSchool: [
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=900&q=80&auto=format&fit=crop',
  ],
};

DEFAULT_GALLERY.electricien = DEFAULT_GALLERY.electrician;
DEFAULT_GALLERY.plombier = DEFAULT_GALLERY.plumber;
DEFAULT_GALLERY.couvreur = DEFAULT_GALLERY.roofer;
DEFAULT_GALLERY.serrurier = DEFAULT_GALLERY.locksmith;
DEFAULT_GALLERY.immobilier = DEFAULT_GALLERY.realEstate;
DEFAULT_GALLERY.coach = DEFAULT_GALLERY.fitnessCoach;
DEFAULT_GALLERY.autoecole = DEFAULT_GALLERY.drivingSchool;

// ============================================================
// REAL, NICHE-CORRECT DEFAULT COPY & DATA FOR ALL 8 NICHES
// ============================================================
const NICHE_CONFIGS = {
  restaurant: {
    accent: '#E11D48',
    ribbonText: "GASTRONOMIE... PRODUITS FRAIS & AMBIANCE SOIGNÉE",
    heroTitleTemplate: (city) => `Restaurant & Table Gastronomique à ${city}`,
    heroSubtitle: "Découvrez une cuisine raffinée élaborée chaque jour à partir de produits frais, locaux et de saison dans un cadre d'exception.",
    statLabels: [
      { label: "FAIT MAISON", value: 100 },
      { label: "PRODUITS LOCAUX", value: 98 },
      { label: "CARTE DES VINS", value: 95 },
      { label: "SATISFACTION CLIENTS", value: 99 }
    ],
    aboutTitle: "La passion du goût,<br><em>une cuisine authentique</em>",
    aboutTextTemplate: (name) => `${name} vous accueille chaleureusement pour vous faire vivre une véritable escapade gourmande. Notre chef met à l'honneur des produits frais travaillés avec passion et créativité.`,
    aboutGuarantees: [
      { title: "100% Fait Maison", desc: "Plats cuisinés sur place chaque jour avec exigence et savoir-faire." },
      { title: "Producteurs de la Région", desc: "Sélection rigoureuse des meilleurs produits auprès de nos artisans locaux." },
      { title: "Cadre & Ambiance Soignés", desc: "Décoration élégante et terrasse agréable pour vos repas de fête ou d'affaires." },
      { title: "Accueil Chaleureux", desc: "Une équipe attentionnée veillant au moindre détail de votre moment." }
    ],
    yearsLabel: "ANS DE TRADITION CULINAIRE",
    ctaButtons: [
      { label: "RÉSERVER UNE TABLE", url: "#contact" },
      { label: "NOTRE CARTE & MENU", url: "#services" },
      { label: "RÉSERVER PAR TÉLÉPHONE", url: "#contact" }
    ],
    services: [
      {
        title: "Menu Dégustation du Chef",
        price: "48€",
        description: "Parcours gastronomique en 5 temps orchestré selon les produits du marché et les créations de saison.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Plats à la Carte & Spécialités",
        price: "dès 18€",
        description: "Entrées créatives, viandes d'exception, poissons frais et desserts gourmands confectionnés sur place.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Formule Déjeuner du Marché",
        price: "24€",
        description: "Entrée + Plat + Dessert renouvelés chaque semaine pour un déjeuner rapide et équilibré.",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Privatisation & Repas de Groupe",
        price: "sur devis",
        description: "Espace privatif disponible pour vos banquets de famille, repas d'entreprise et événements privés.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&auto=format&fit=crop"
      }
    ],
    portfolio: [
      { title: "Assiette Gastronomique & Fleur de Sel", category: "Création Chef", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop" },
      { title: "Cuvées Sélectionnées & Dégustation", category: "Vins", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80&auto=format&fit=crop" },
      { title: "Salle Principale & Ambiance Cocon", category: "Le Lieu", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&auto=format&fit=crop" },
      { title: "Dessert Signature Chocolat & Framboise", category: "Douceurs", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop" }
    ],
    whyUs: [
      { number: "01", title: "Cuisine Fine & Ingrédients Bruts", text: "Aucun produit surgelé. Tout est cuisiné minute avec des produits frais réceptionnés le jour même." },
      { number: "02", title: "Accords Mets & Vins Personnalisés", text: "Notre sommelier saura vous guider vers le vin parfait pour sublimer vos assiettes." },
      { number: "03", title: "Réservation Simple & Garantie", text: "Réservez en ligne ou par téléphone en quelques clics avec confirmation immédiate." }
    ],
    steps: [
      { step: "01", title: "Réservation de Table", description: "Choisissez votre date, votre heure et le nombre de convives sur notre formulaire." },
      { step: "02", title: "Accueil & Cocktail", description: "Installez-vous confortablement et profitez de nos apéritifs maison et conseils culinaires." },
      { step: "03", title: "Dégustation & Plaisir", description: "Laissez-vous transporter par une succession de saveurs concoctées pour vous." }
    ],
    testimonials: [
      { name: "Julien R.", rating: 5, city: "Dîner Romantique", text: "Un moment féerique ! Les plats sont aussi beaux que délicieux. Service souriant et irréprochable du début à la fin.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop" },
      { name: "Sophie & Marc", rating: 5, city: "Repas de Famille", text: "Nous avons fêté l'anniversaire de ma mère au restaurant. Tout le monde s'est régalé ! La formule dégustation est une merveille.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop" },
      { name: "David L.", rating: 5, city: "Déjeuner d'Affaires", text: "Lieu idéal pour mes repas professionnels. Rapidité, grande finesse dans l'assiette et cadre très calme.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format&fit=crop" }
    ],
    faq: [
      { question: "Comment réserver une table ?", answer: "Vous pouvez réserver directement via notre bouton de réservation en ligne ou en nous appelant au numéro indiqué sur le site." },
      { question: "Proposez-vous des menus végétariens ou allergènes ?", answer: "Oui, notre carte comporte toujours des options végétariennes gourmandes. Prévenez-nous lors de votre réservation pour toute allergie spécifique." },
      { question: "Les enfants sont-ils les bienvenus ?", answer: "Absolument ! Nous disposons d'un menu enfant spécialement concocté avec des produits frais et de chaises hautes." },
      { question: "Quels sont les moyens de paiement acceptés ?", answer: "Nous acceptons les cartes bancaires, espèces, chèques vacances et titres restaurant." }
    ]
  },

  traiteur: {
    accent: '#C9A96E',
    ribbonText: "BON APPÉTIT... BONNE AMBIANCE",
    heroTitleTemplate: (city) => `Traiteur d'exception à ${city}`,
    heroSubtitle: "Des créations gastronomiques sur mesure pour vos mariages, cocktails, réceptions et événements d'entreprise.",
    statLabels: [
      { label: "SUR MESURE", value: 98 },
      { label: "TRAITEUR MOBILE", value: 100 },
      { label: "LIVRAISON REPAS VIP", value: 95 },
      { label: "PLATEAUX COCKTAIL", value: 92 },
      { label: "SATISFACTION CLIENTS", value: 99 },
    ],
    aboutTitle: "Une passion,<br><em>un savoir-faire gastronomique</em>",
    aboutTextTemplate: (name) => `${name} vous fait découvrir des saveurs authentiques préparées avec des produits frais, locaux et de saison. Chaque plat est confectionné avec soin et passion par notre chef pour garantir une expérience culinaire inoubliable lors de vos plus beaux événements.`,
    aboutGuarantees: [
      { title: "100% Frais & Local", desc: "Produits rigoureusement sélectionnés auprès des meilleurs producteurs de la région." },
      { title: "Service Maître d'Hôtel", desc: "Équipe qualifiée, souriante et attentive au moindre détail de votre réception." },
      { title: "Respect Chaîne du Froid", desc: "Transport frigorifique certifié et normes d'hygiène HACCP strictes." },
      { title: "Menus Sur Mesure", desc: "Adaptation parfaite aux régimes spécifiques (végétarien, sans gluten, halal)." }
    ],
    yearsLabel: "ANNÉES D'EXPÉRIENCE",
    ctaButtons: [
      { label: "COCKTAIL DÎNATOIRE", url: "#services" },
      { label: "MENU MARIAGE", url: "#services" },
      { label: "DEMANDER UN DEVIS", url: "#contact" },
    ],
    services: [
      {
        title: "Cocktail Dînatoire & Buffet Prestige",
        price: "dès 28€/pers",
        description: "Assortiment raffiné de pièces chaudes et froides, verrines gourmandes et animations culinaires en direct.",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Réceptions & Mariages",
        price: "dès 65€/pers",
        description: "Prise en charge complète : vin d'honneur, repas servi à table ou buffet champêtre chic, wedding cake et maître d'hôtel.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Plateaux Repas VIP & Séminaires",
        price: "dès 18€/repas",
        description: "Coffrets repas gastronomiques livrés au bureau pour vos réunions d'affaires et séminaires d'entreprise.",
        image: "https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Chef Privé à Domicile",
        price: "sur devis",
        description: "Une expérience culinaire haut de gamme directement dans votre cuisine pour vos dîners privés exclusifs.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop"
      }
    ],
    portfolio: [
      { title: "Mariage Champêtre Chic (150 convives)", category: "Mariage", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop" },
      { title: "Cocktail Dînatoire Tech Summit", category: "Entreprise", image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop" },
      { title: "Dîner de Gala Gastronomique", category: "Prestige", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop" },
      { title: "Buffet Anniversaire & Atelier Braise", category: "Réception Privée", image: "https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?w=800&q=80&auto=format&fit=crop" }
    ],
    whyUs: [
      { number: "01", title: "Cuisine Artisanale 100% Fait Maison", text: "Aucun produit industriel. Nos recettes sont élaborées le jour même à partir d'ingrédients bruts de qualité." },
      { number: "02", title: "Logistique Frigorifique Intégrée", text: "Flotte de véhicules réfrigérés garantissant la fraîcheur absolue des mets jusqu'à votre table." },
      { number: "03", title: "Accompagnement Dédié", text: "Un interlocuteur unique pour coordonnée le déroulement, le nappage et le personnel de service." }
    ],
    steps: [
      { step: "01", title: "Échange & Dégustation", description: "Nous définissons ensemble vos envies et nous organisons une séance de dégustation personnalisée." },
      { step: "02", title: "Validation & Préparation", description: "Élaboration précise du planning de production et sélection rigoureuse des ingrédients." },
      { step: "03", title: "Service & Magie le Jour J", description: "Mise en place élégante et service impeccable pour que vous profitiez pleinement de vos invités." }
    ],
    testimonials: [
      { name: "Camille & Antoine", rating: 5, city: "Mariage", text: "Un vin d'honneur et un repas de mariage exceptionnels ! Nos invités nous en parlent encore. Le service était discret et d'une grande gentillesse.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop" },
      { name: "Jean-Marc L.", rating: 5, city: "Événement Pro", text: "Buffet parfait pour nos 200 collaborateurs. Produits très frais, présentations modernes et livraison ponctuelle. Je recommande vivement !", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop" },
      { name: "Nathalie B.", rating: 5, city: "Anniversaire 50 ans", text: "Prestation au top pour mes 50 ans. Les pièces cocktails étaient succulentes et l'atelier découpe a fait sensation auprès des invités.", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80&auto=format&fit=crop" }
    ],
    faq: [
      { question: "Combien de temps à l'avance faut-il réserver ?", answer: "Pour les mariages, nous recommandons de réserver 6 à 12 mois à l'avance. Pour les cocktails et réceptions d'entreprise, un préavis de 2 semaines suffit généralement." },
      { question: "Proposez-vous des options végétariennes ou sans gluten ?", answer: "Oui, absolument ! Tous nos menus peuvent être adaptés selon les restrictions alimentaires de vos convives sans compromis sur la gourmandise." },
      { question: "Le matériel et la vaisselle sont-ils inclus ?", answer: "Nous pouvons fournir la vaisselle haut de gamme, le nappage en tissu ainsi que les mange-debout sur simple demande dans notre offre globale." },
      { question: "Quelle est votre zone d'intervention ?", answer: "Nous intervenons dans toute la région et jusqu'à 80 km autour de notre laboratoire de cuisine." }
    ]
  },

  electrician: {
    accent: '#F5A623',
    ribbonText: "SÉCURITÉ... TRANQUILLITÉ 24/7",
    heroTitleTemplate: (city) => `Électricien certifié à ${city}`,
    heroSubtitle: "Installations, dépannages d'urgence et mises aux normes réalisés par des artisans qualifiés.",
    statLabels: [
      { label: "DÉPANNAGE RAPIDE 30MIN", value: 100 },
      { label: "CONFORMITÉ NF C 15-100", value: 100 },
      { label: "REMISE AUX NORMES", value: 98 },
      { label: "INSTALLATION DOMOTIQUE", value: 92 },
      { label: "GARANTIE DÉCENNALE", value: 100 },
    ],
    aboutTitle: "Sécurité & Fiabilité,<br><em>chaque intervention</em>",
    aboutTextTemplate: (name) => `${name} intervient en urgence et sur rendez-vous pour tous vos besoins électriques. De la panne générale à la rénovation complète de tableau électrique, nos artisans électriciens garantissent un travail soigné et conforme aux normes en vigueur.`,
    aboutGuarantees: [
      { title: "Garantie Décennale", desc: "Couverture assurance professionnelle sur l'ensemble de nos installations électriques." },
      { title: "Norme NF C 15-100", desc: "Mise en sécurité totale et délivrance d'attestations de conformité." },
      { title: "Arrivée sous 30 Min", desc: "Dépannage d'urgence prioritaire 7j/7 pour panne de courant ou court-circuit." },
      { title: "Devis Transparent", desc: "Tarifs clairs annoncés avant intervention, aucune mauvaise surprise." }
    ],
    yearsLabel: "ANNÉES D'EXPÉRIENCE",
    ctaButtons: [
      { label: "DÉPANNAGE URGENT 24/7", url: "tel:" },
      { label: "DEVIS GRATUIT", url: "#contact" },
      { label: "BORNE RECHARGE EV", url: "#services" },
    ],
    services: [
      {
        title: "Dépannage Électrique d'Urgence",
        price: "dès 89€",
        description: "Recherche de panne, coupure de courant, disjoncteur qui saute et remplacement de prises en urgence 24/7.",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Remplacement Tableau & Mise aux Normes",
        price: "dès 450€",
        description: "Remplacement de tableaux anciens, pose de disjoncteurs différentiels 30mA et mise en conformité NF C 15-100.",
        image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Bornes de Recharge Véhicule Électrique (IRVE)",
        price: "dès 690€",
        description: "Installation certifiée de bornes Wallbox à domicile ou en entreprise avec éligibilité à la prime ADVENIR.",
        image: "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Domotique & Éclairage Architectural LED",
        price: "sur devis",
        description: "Automatisation volets, chauffage connecté, spots intégrés et gestion d'énergie intelligente.",
        image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&q=80&auto=format&fit=crop"
      }
    ],
    portfolio: [
      { title: "Rénovation Complète Tableau Électrique NF C 15-100", category: "Rénovation", image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=80&auto=format&fit=crop" },
      { title: "Installation Borne Wallbox 11kW", category: "Écomobilité", image: "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=800&q=80&auto=format&fit=crop" },
      { title: "Éclairage LED Sur Mesure Villa Contemporaine", category: "Design", image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&q=80&auto=format&fit=crop" },
      { title: "Dépannage Industriel & Armoire Triphasée", category: "Tertiaire", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format&fit=crop" }
    ],
    whyUs: [
      { number: "01", title: "Disponibilité Réelle 7j/7", text: "Nos techniciens de garde interviennent jour et nuit pour rétablir votre électricité en toute sécurité." },
      { number: "02", title: "Certification Qualifelec & IRVE", text: "Des qualifications reconnues attestant de notre maîtrise technique et de la sécurité de nos chantiers." },
      { number: "03", title: "Prix Fixe Avant Travaux", text: "Un devis détaillé vous est soumis systématiquement avant la moindre manipulation." }
    ],
    steps: [
      { step: "01", title: "Appel ou Demande en Ligne", description: "Évaluation téléphonique du problème et envoi immédiat de l'électricien le plus proche." },
      { step: "02", title: "Diagnostic & Devis Gratuit", description: "Analyse du réseau à l'aide de testeurs professionnels et proposition tarifaire claire." },
      { step: "03", title: "Réparation & Attestation", description: "Exécution des travaux dans le respect strict des normes et remise de la fiche d'intervention." }
    ],
    testimonials: [
      { name: "Marc D.", rating: 5, city: "Dépannage Nuit", text: "Panne de courant totale un dimanche soir. Électricien arrivé en 25 minutes ! Problème identifié et réglé rapidement. Merci pour la réactivité.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format&fit=crop" },
      { name: "Sylvie V.", rating: 5, city: "Mise aux Normes", text: "Changement de tableau électrique vétuste dans mon appartement. Travail très propre, explications claires et tarif très raisonnable.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&auto=format&fit=crop" },
      { name: "Laurent K.", rating: 5, city: "Borne EV", text: "Installation parfaite de ma borne de recharge pour ma voiture électrique. Électricien très professionnel et de bon conseil.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&auto=format&fit=crop" }
    ],
    faq: [
      { question: "Mon disjoncteur saute dès que j'allume un appareil, que faire ?", answer: "Coupez l'appareil en question et ne forcez pas le réarmement du disjoncteur. Contactez-nous immédiatement pour un diagnostic de court-circuit." },
      { question: "Combien coûte la remise aux normes d'un tableau électrique ?", answer: "Selon le nombre de circuits et la taille du logement, le coût varie entre 450€ et 1200€. Nous établissons un devis gratuit personnalisé." },
      { question: "Êtes-vous agréé pour la prime ADVENIR sur les bornes de recharge ?", answer: "Oui, notre qualification IRVE vous permet de bénéficier du crédit d'impôt et de la prime ADVENIR jusqu'à 500€ par borne." },
      { question: "Intervenez-vous les jours fériés et week-ends ?", answer: "Oui, notre service de dépannage d'urgence est opérationnel 24 heures sur 24, 365 jours par an." }
    ]
  },

  plumber: {
    accent: '#1E6FBF',
    ribbonText: "URGENCE 24/7... ZÉRO FUITE",
    heroTitleTemplate: (city) => `Plombier de confiance à ${city}`,
    heroSubtitle: "Dépannage rapide, détection de fuite, chauffe-eau et rénovation sanitaire complète.",
    statLabels: [
      { label: "INTERVENTION RAPIDE 30MIN", value: 100 },
      { label: "DÉTECTION SANS CASSE", value: 98 },
      { label: "REMPLACEMENT CHAUFFE-EAU", value: 95 },
      { label: "AGRÉÉ ASSURANCES", value: 100 },
      { label: "GARANTIE DÉCENNALE", value: 100 },
    ],
    aboutTitle: "Expertise Plomberie,<br><em>intervention garantie</em>",
    aboutTextTemplate: (name) => `${name} met son savoir-faire au service de votre confort sanitaire. Qu'il s'agisse d'un débouchage urgent, d'une fuite d'eau invisible ou d'un changement de chauffe-eau, nos plombiers diplômés interviennent avec du matériel de pointe.`,
    aboutGuarantees: [
      { title: "Dépannage 24/7", desc: "Permanence téléphonique et intervention rapide de jour comme de nuit." },
      { title: "Agréé Compagnies Assurances", desc: "Devis et factures conformes pour la prise en charge de vos dégâts des eaux." },
      { title: "Matériel Haute Pression", desc: "Débouchage hydrocurage et détection thermique sans dégradation." },
      { title: "Garantie Pièces & Main d'Œuvre", desc: "Toutes nos pièces posées sont garanties constructeur avec suivi après-vente." }
    ],
    yearsLabel: "ANNÉES D'EXPÉRIENCE",
    ctaButtons: [
      { label: "URGENCE FUITE 24/7", url: "tel:" },
      { label: "DÉBOUCHAGE RAPIDE", url: "#services" },
      { label: "DEVIS GRATUIT", url: "#contact" },
    ],
    services: [
      {
        title: "Recherche & Réparation de Fuite d'Eau",
        price: "dès 95€",
        description: "Détection thermique et acoustique non destructive. Réparation immédiate sur cuivre, PER, multicouche ou plomb.",
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Remplacement Chauffe-Eau & Ballon",
        price: "dès 590€",
        description: "Installation et vidange de chauffe-eau électrique, thermodynamique ou gaz toutes marques (Atlantic, De Dietrich, Ariston).",
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Débouchage & Hydrocurage Canalisations",
        price: "dès 110€",
        description: "Dégorgement d'urgence pour évier, WC, douche ou canalisation principale par furet électrique et camion pompe.",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Création Salle de Bain Italienne",
        price: "sur devis",
        description: "Aménagement complet : douche à l'italienne, meuble vasque, WC suspendu et étanchéité sous carrelage.",
        image: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&q=80&auto=format&fit=crop"
      }
    ],
    portfolio: [
      { title: "Douche à l'Italienne & Carrelage Grand Format", category: "Rénovation", image: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&q=80&auto=format&fit=crop" },
      { title: "Pose Ballon Thermodynamique 250L", category: "Chauffe-eau", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80&auto=format&fit=crop" },
      { title: "Réparation Fuite Encastrée après Détection Caméra", category: "Dépannage", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format&fit=crop" },
      { title: "Installation Adoucisseur d'Eau & Filtration", category: "Traitement Eau", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80&auto=format&fit=crop" }
    ],
    whyUs: [
      { number: "01", title: "Arrivée sous 30 à 45 minutes", text: "Un réseau de plombiers de proximité équipés pour colmater toute fuite immédiatement." },
      { number: "02", title: "Détection Caméra Infrarouge", text: "Nous évitons de casser vos sols ou murs grâce aux caméras d'inspection professionnelles." },
      { number: "03", title: "Transparence Tarifaire Totale", text: "Devis écrit signé avant toute intervention. Aucun supplément non approuvé." }
    ],
    steps: [
      { step: "01", title: "Appel d'Urgence", description: "Conseil immédiat pour couper l'arrivée d'eau principale et envoi du technicien." },
      { step: "02", title: "Inspection & Devis Gratuit", description: "Localisation exacte du problème et devis précis communiqué sans engagement." },
      { step: "03", title: "Intervention & Nettoyage", description: "Réparation durable, contrôle de pression et remise en état du chantier." }
    ],
    testimonials: [
      { name: "Philippe R.", rating: 5, city: "Dégât des eaux", text: "Grosse fuite d'eau sous l'évier un samedi matin. Le plombier est arrivé en 30min, a changé le raccord défectueux et m'a fourni la facture pour l'assurance. Nickel !", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&auto=format&fit=crop" },
      { name: "Sandrine M.", rating: 5, city: "Changement Chauffe-eau", text: "Chauffe-eau en panne remplacé le jour même. Équipe très courtoise et ponctuelle. Prix conforme au devis.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&auto=format&fit=crop" },
      { name: "Julien B.", rating: 5, city: "Rénovation Salle de Bain", text: "Superbe transformation de ma vieille baignoire en douche italienne moderne. Travail soigné et délais respectés.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop" }
    ],
    faq: [
      { question: "Ma facture de fuite sera-t-elle prise en charge par mon assurance ?", answer: "Oui, la plupart des contrats d'habitation remboursent la recherche de fuite et les dégâts causés. Nous vous fournissons tous les documents nécessaires." },
      { question: "Quel est le prix moyen pour déboucher un WC ou un évier ?", answer: "Un débouchage classique coûte entre 110€ et 180€. En cas de bouchon profond dans la colonne, nous proposons le curage haute pression." },
      { question: "Combien de temps faut-il pour remplacer un chauffe-eau ?", answer: "L'intervention dure généralement 3 à 4 heures, incluant la vidange de l'ancien ballon, la pose du neuf et la mise en eau." },
      { question: "Proposez-vous des contrats d'entretien de chaudière ?", answer: "Oui, nous assurons la révision annuelle obligatoire pour chaudières gaz et pompes à chaleur." }
    ]
  },

  roofer: {
    accent: '#E07B39',
    ribbonText: "SOLIDE... PROTECTEUR... DURABLE",
    heroTitleTemplate: (city) => `Couvreur qualifié à ${city}`,
    heroSubtitle: "Réfection de toiture, isolation des combles, étanchéité et nettoyage hydrofuge.",
    statLabels: [
      { label: "GARANTIE DÉCENNALE 10 ANS", value: 100 },
      { label: "RÉNOVATION TOITURE", value: 98 },
      { label: "ISOLATION RGE QUALIBAT", value: 95 },
      { label: "DÉPANNAGE INFILTRATION", value: 100 },
      { label: "SATISFACTION CLIENTS", value: 99 },
    ],
    aboutTitle: "Un savoir-faire artisanal,<br><em>pour protéger votre habitat</em>",
    aboutTextTemplate: (name) => `${name} est spécialisé dans les travaux de couverture, charpente et zinguerie. Nos couvreurs expérimentés mettent tout leur savoir-faire en œuvre pour rénover, isoler et étanchéifier votre toiture avec des matériaux de première qualité.`,
    aboutGuarantees: [
      { title: "Garantie Décennale 10 Ans", desc: "Couverture intégrale contre tout vice de construction ou d'étanchéité." },
      { title: "Certification RGE Qualibat", desc: "Éligibilité garantie aux aides MaPrimeRénov' et CEE pour vos travaux d'isolation." },
      { title: "Matériaux Haute Durabilité", desc: "Tuiles terre cuite, ardoises naturelles et zinc certifiés NF." },
      { title: "Diagnostic & Devis Gratuits", desc: "Déplacement et inspection complète de votre toiture offerts sans engagement." }
    ],
    yearsLabel: "ANNÉES D'EXPÉRIENCE",
    ctaButtons: [
      { label: "DIAGNOSTIC TOITURE GRATUIT", url: "#contact" },
      { label: "DÉPANNAGE FUITE URGENT", url: "tel:" },
      { label: "NOS RÉALISATIONS", url: "#gallery" },
    ],
    services: [
      {
        title: "Réfection & Rénovation de Toiture",
        price: "sur devis",
        description: "Changement de tuiles, ardoises, shingle ou bac acier avec pose de sous-toiture respirante imperméable.",
        image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Nettoyage, Démoussage & Hydrofuge",
        price: "dès 15€/m²",
        description: "Elimination des mousses et lichens, application de produit fongicide et traitement hydrofuge protecteur incolore ou coloré.",
        image: "https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Zinguerie & Pose de Gouttières",
        price: "dès 35€/m",
        description: "Façonnage et pose de gouttières en zinc, alu ou PVC, chenaux, noues et entourages de cheminée sur mesure.",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Isolation des Combles RGE",
        price: "dès 20€/m²",
        description: "Isolation thermique par soufflage de laine de roche ou panneaux sous rampant pour réduire vos factures de chauffage.",
        image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80&auto=format&fit=crop"
      }
    ],
    portfolio: [
      { title: "Renovation Toiture Tuiles Terres Cuites Méridionales", category: "Couverture", image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80&auto=format&fit=crop" },
      { title: "Démoussage & Traitement Hydrofuge Coloré", category: "Entretien", image: "https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=800&q=80&auto=format&fit=crop" },
      { title: "Pose Fenêtre de Toit Velux & Zinguerie", category: "Zinguerie", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop" },
      { title: "Isolation Combles Perdus Laine de Bois RGE", category: "Isolation", image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80&auto=format&fit=crop" }
    ],
    whyUs: [
      { number: "01", title: "Artisans Couvreurs Expérimentés", text: "Maîtrise parfaite de la charpente bois, de la pose de tuiles et des finitions en zinc." },
      { number: "02", title: "Entreprise Qualifiée RGE", text: "Bénéficiez des aides financières de l'État grâce à notre label de qualité environnementale." },
      { number: "03", title: "Bâchage d'Urgence en 2h", text: "En cas d'intempérie ou de fuite soudaine, nous posons une bâche de protection immédiate." }
    ],
    steps: [
      { step: "01", title: "Inspection Toiture", description: "Diagnostic complet de l'état de la couverture, des éléments de zinguerie et de la charpente." },
      { step: "02", title: "Devis Détaillé & Aides", description: "Remise d'une étude technique avec chiffrage précis et simulation des subventions éligibles." },
      { step: "03", title: "Chantier & Finitions", description: "Mise en place des échafaudages de sécurité, exécution soignée et nettoyage de chantier." }
    ],
    testimonials: [
      { name: "Bernard T.", rating: 5, city: "Réfection toiture", text: "Excellente entreprise de couverture. Réfection totale de notre toiture en tuiles. Travail soigné, chantier toujours propre. Je conseille sans hésiter.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop" },
      { name: "Martine L.", rating: 5, city: "Démoussage & Velux", text: "Démoussage impressionnant ! La toiture paraît comme neuve. Pose de deux Velux impeccable.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&auto=format&fit=crop" },
      { name: "David S.", rating: 5, city: "Infiltration Urgente", text: "Intervention rapide après la tempête pour colmater une infiltration d'eau. Équipe professionnelle et réactive.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format&fit=crop" }
    ],
    faq: [
      { question: "Quelle est la durée de vie moyenne d'une toiture en tuiles ?", answer: "Une toiture en tuiles terre cuite ou béton bien entretenue dure entre 30 et 50 ans. Un démoussage tous les 3-5 ans prolonge fortement cette durée." },
      { question: "Comment savoir si ma toiture a besoin d'être rénovée ?", answer: "Si vous observez des tuiles cassées, de la mousse abondante, des traces d'humidité dans les combles ou une facture de chauffage en hausse, un diagnostic s'impose." },
      { question: "Quelles aides puis-je obtenir pour l'isolation de ma toiture ?", answer: "Grâce à notre certification RGE, vous pouvez bénéficier de MaPrimeRénov', des primes CEE et de l'éco-PTZ jusqu'à 75% du montant." },
      { question: "Le devis et le déplacement sont-ils vraiment gratuits ?", answer: "Oui, nos déplacements pour inspection et l'établissement du devis sont 100% gratuits et sans aucun engagement." }
    ]
  },

  locksmith: {
    accent: '#9B9B9B',
    ribbonText: "ARRIVÉE EN 20 MIN... SÉCURITÉ 24/7",
    heroTitleTemplate: (city) => `Serrurier professionnel à ${city}`,
    heroSubtitle: "Ouverture de porte claquée/fermée, changement de serrure A2P et blindage d'urgence.",
    statLabels: [
      { label: "ARRIVÉE CHRONO 20MIN", value: 100 },
      { label: "OUVERTURE SANS CASSE", value: 95 },
      { label: "SERRURES CERTIFIÉES A2P", value: 98 },
      { label: "AGRÉÉ ASSURANCES", value: 100 },
      { label: "PRIX FIXE ANNONCÉ", value: 100 },
    ],
    aboutTitle: "Urgence & Sécurité,<br><em>intervention rapide 24h/24</em>",
    aboutTextTemplate: (name) => `${name} est votre serrurier de confiance disponible nuit et jour. Bloqué à l'extérieur, clé cassée dans la serrure ou victime d'une tentative d'effraction ? Nos serruriers qualifiés interviennent en moins de 20 minutes avec un équipement complet.`,
    aboutGuarantees: [
      { title: "Arrivée en 20 Min Chrono", desc: "Serrurier géolocalisé pour une prise en charge immédiate de votre urgence." },
      { title: "Ouverture Fine Sans Dégât", desc: "Utilisation de la technique de la radio ou crochetage pour préserver votre porte." },
      { title: "Serrures A2P 3 à 7 Points", desc: "Installation de cylindres et serrures haute sécurité agréés par les assurances." },
      { title: "Tarif Annoncé avant Départ", desc: "Forfait d'intervention garanti au téléphone, zéro surprise à l'arrivée." }
    ],
    yearsLabel: "ANNÉES D'EXPÉRIENCE",
    ctaButtons: [
      { label: "SOS SERRURIER 24/7", url: "tel:" },
      { label: "OUVERTURE DE PORTE", url: "#services" },
      { label: "DEVIS BLINDAGE", url: "#contact" },
    ],
    services: [
      {
        title: "Ouverture de Porte Claquée ou Verrouillée",
        price: "dès 79€",
        description: "Dépannage d'urgence 24/7. Ouverture sans dégât pour porte simple, blindée ou serrure multipoints.",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Remplacement de Serrure & Cylindre A2P",
        price: "dès 149€",
        description: "Pose de serrures certifiées A2P*, A2P** et A2P*** résistant aux tentatives de crochetage et perçage.",
        image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Blindage de Porte & Cornières Anti-Pince",
        price: "dès 490€",
        description: "Renforcement de votre porte existante avec plaque d'acier, paumelles renforcées et cornières de sécurité.",
        image: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Sécurisation Après Cambriolage",
        price: "urgence 24/7",
        description: "Fermeture provisoire, remplacement immédiat de cylindre dégradé et fourniture du dossier d'assurance.",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&auto=format&fit=crop"
      }
    ],
    portfolio: [
      { title: "Installation Serrure Multipoints A2P***", category: "Sécurité", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80&auto=format&fit=crop" },
      { title: "Pose Porte Blindée Appartement Certifiée BP1", category: "Blindage", image: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=800&q=80&auto=format&fit=crop" },
      { title: "Ouverture de Porte Claquée sans Abîmer le Cadre", category: "Dépannage", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80&auto=format&fit=crop" },
      { title: "Installation Serrures Connectées & Control d'Accès", category: "High-Tech", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&auto=format&fit=crop" }
    ],
    whyUs: [
      { number: "01", title: "Disponibilité 24h/24 & 7j/7", text: "Jour, nuit, week-ends et jours fériés : notre équipe reste d'astreinte permanente." },
      { number: "02", title: "Agréé par toutes les Assurances", text: "Nos factures sont directement acceptées pour les remboursements de perte de clés ou effraction." },
      { number: "03", title: "Aucune Casse Inutile", text: "Nous privilégions toujours l'ouverture fine pour vous éviter le coût d'une nouvelle porte." }
    ],
    steps: [
      { step: "01", title: "Appel SOS", description: "Prise en charge téléphonique rapide et annonce ferme du tarif de l'intervention." },
      { step: "02", title: "Arrivée sous 20 minutes", description: "Le serrurier inspecte la serrure et applique la solution la plus économique." },
      { step: "03", title: "Accès Rétabli & Facture", description: "Ouverture réussie, conseils de sécurité et remise du justificatif d'assurance." }
    ],
    testimonials: [
      { name: "Élodie P.", rating: 5, city: "Porte claquée à 2h du matin", text: "Porte claquée avec les clés à l'intérieur en rentrant de soirée. Le serrurier est arrivé en 18 minutes. Porte ouverte en 2 minutes avec la radio sans rien casser. Merci mille fois !", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop" },
      { name: "Guillaume N.", rating: 5, city: "Changement de serrure", text: "Clés perdues lors d'un déplacement. Remplacement du cylindre par une serrure haute sécurité A2P. Très bon travail et prix raisonnable.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop" },
      { name: "Corinne M.", rating: 5, city: "Blindage de porte", text: "Installation d'un blindage et d'une serrure 5 points après un cambriolage dans mon immeuble. Je me sens enfin en sécurité chez moi.", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80&auto=format&fit=crop" }
    ],
    faq: [
      { question: "Est-il possible d'ouvrir une porte claquée sans casser la serrure ?", answer: "Dans 95% des cas, une porte simplement claquée s'ouvre sans aucune dégradation au moyen d'une feuille de radio ou d'un outil de crochetage pro." },
      { question: "L'assurance habitation prend-elle en charge le dépannage ?", answer: "En cas de perte/vol de clés ou de tentative d'effraction, l'assurance prend généralement en charge les frais d'ouverture et de remplacement." },
      { question: "Quel est le prix pour faire changer un barillet de porte ?", answer: "Le remplacement d'un barillet standard commence à 149€ pose comprise. Les serrures A2P certifiées dépendent du niveau de sécurité." },
      { question: "En combien de temps le serrurier arrive-t-il sur place ?", answer: "Nos serruriers étant répartis par zones géographiques, le délai moyen constaté est de 15 à 25 minutes." }
    ]
  },

  realEstate: {
    accent: '#D4AF37',
    ribbonText: "VOTRE PROJET... NOTRE PASSION",
    heroTitleTemplate: (city) => `Agence immobilière d'exception à ${city}`,
    heroSubtitle: "Estimation gratuite, vente rapide, achat sur mesure et gestion locative clé en main.",
    statLabels: [
      { label: "ESTIMATION OFFERTE 48H", value: 100 },
      { label: "VENTES EN MOINS DE 30J", value: 92 },
      { label: "VISITES VIRTUELLES 3D", value: 95 },
      { label: "ACQUÉREURS QUALIFIÉS", value: 98 },
      { label: "SATISFACTION CLIENTS", value: 99 },
    ],
    aboutTitle: "Votre patrimoine,<br><em>notre expertise locale</em>",
    aboutTextTemplate: (name) => `${name} est votre partenaire immobilier de référence. Que vous souhaitiez vendre votre bien au meilleur prix, acheter la maison de vos rêves ou confier la gestion de votre appartement, nos conseillers experts vous accompagnent à chaque étape avec transparence et rigueur.`,
    aboutGuarantees: [
      { title: "Estimation Gratuite sous 48h", desc: "Évaluation précise basée sur les ventes réelles notariales de votre quartier." },
      { title: "Marketing Média Premium", desc: "Photos professionnelles HD, visite virtuelle 3D et prises de vue par drone." },
      { title: "Diffusion Multi-Portails Top 10", desc: "Publication de votre annonce sur SeLoger, LeBonCoin, Belles Demeures, etc." },
      { title: "Acquéreurs Solvables Vérifiés", desc: "Vérification systématique du financement auprès des banques avant toute visite." }
    ],
    yearsLabel: "ANNÉES D'EXPÉRIENCE",
    ctaButtons: [
      { label: "ESTIMER MON BIEN", url: "#contact" },
      { label: "NOS BIENS À LA VENTE", url: "#services" },
      { label: "NOUS CONTACTER", url: "tel:" },
    ],
    services: [
      {
        title: "Estimation Immobilier Gratuite & Vente",
        price: "offerte",
        description: "Étude comparative du marché local, dossier d'estimation détaillé et mise en vente optimale sous mandat exclusif.",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Chasseur Immobilier & Accompagnement Achat",
        price: "sur mesure",
        description: "Recherche personnalisée du bien idéal, accès aux offres off-market et négociation au meilleur prix du marché.",
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Gestion Locative & Garantie Loyers Impayés",
        price: "dès 4,9%",
        description: "Sélection rigoureuse du locataire, rédaction des baux, états des lieux et assurance loyers impayés à 100%.",
        image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Immobilier Neuf & Investissement Locatif",
        price: "frais réduits",
        description: "Conseils en défiscalisation (Pinel, LMNP), sélection de programmes neufs à fort rendement locatif.",
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80&auto=format&fit=crop"
      }
    ],
    portfolio: [
      { title: "Appartement Haussmannien Rénové 110m²", category: "Vendu en 12j", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format&fit=crop" },
      { title: "Maison Contemporaine avec Piscine & Jardin", category: "Exclusivité", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80&auto=format&fit=crop" },
      { title: "Loft Lumineux Dernier Étage avec Terrasse", category: "Coup de Cœur", image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80&auto=format&fit=crop" },
      { title: "Immeuble de Rapport 6 Lots Renta 8,5%", category: "Investissement", image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80&auto=format&fit=crop" }
    ],
    whyUs: [
      { number: "01", title: "Ancrage Local & Réseau Étendu", text: "Une parfaite maîtrise des prix au mètre carré rue par rue pour valoriser au mieux votre logement." },
      { number: "02", title: "Moyens Média Haute Définition", text: "Nous sublimons votre logement avec du Home Staging virtuel et des reportages vidéo captivants." },
      { number: "03", title: "Accompagnement Notarié Complet", text: "Suivi administratif et juridique rigoureux du compromis de vente jusqu'à la remise des clés." }
    ],
    steps: [
      { step: "01", title: "Estimation sur Place", description: "Rendez-vous d'évaluation et étude comparative précise des transactions récentes dans votre secteur." },
      { step: "02", title: "Mise en Valeur & Diffusion", description: "Shooting photo pro, création de la visite 3D et diffusion massive sur les meilleurs portails." },
      { step: "03", title: "Visites & Signature", description: "Sélection des acquéreurs solvables, gestion des offres et signature chez le notaire." }
    ],
    testimonials: [
      { name: "Frédéric & Valérie", rating: 5, city: "Vente Maison", text: "Maison vendue en seulement 3 semaines au prix de l'estimation ! L'équipe a géré toutes les visites avec un grand professionnalisme. Merci !", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop" },
      { name: "Cécile D.", rating: 5, city: "Achat Appartement", text: "Agent immobilier à l'écoute et très réactif. Nous avons trouvé notre premier appartement grâce à ses conseils avisés.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&auto=format&fit=crop" },
      { name: "Antoine H.", rating: 5, city: "Gestion Locative", text: "Je leur confie la gestion de 3 studios depuis 4 ans. Zéro impayé, locataires sérieux. Je dors sur mes deux oreilles.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&auto=format&fit=crop" }
    ],
    faq: [
      { question: "Combien coûte une estimation immobilière ?", answer: "Notre avis de valeur et l'estimation détaillée de votre bien immobilier sont 100% gratuits et sans aucun engagement de votre part." },
      { question: "Pourquoi choisir un mandat exclusif ?", answer: "Le mandat exclusif nous permet d'investir un budget marketing supérieur (photos pro, visite 3D, sponsorisation) et garantit une vente en moyenne 2x plus rapide." },
      { question: "Comment vérifiez-vous la solvabilité des acheteurs ?", answer: "Avant toute offre validée, nous exigeons un accord de principe bancaire ou une attestation de financement délivrée par un courtier partenaire." },
      { question: "Quels sont vos honoraires d'agence ?", answer: "Nos honoraires sont clairs, compétitifs et dégressifs selon la valeur du bien. Ils ne sont dus qu'en cas de vente définitive chez le notaire." }
    ]
  },

  fitnessCoach: {
    accent: '#EF4444',
    ribbonText: "DISCIPLINE... RÉSULTATS... TRANSFORMATION",
    heroTitleTemplate: (city) => `Coach sportif personnel à ${city}`,
    heroSubtitle: "Programmes sur mesure, coaching privé en salle, à domicile ou en extérieur pour atteindre vos objectifs.",
    statLabels: [
      { label: "DIPLÔMÉ D'ÉTAT BPJEPS", value: 100 },
      { label: "TRANSFORMATION PHYSIQUE", value: 96 },
      { label: "SUIVI NUTRITIONNEL 7/7", value: 98 },
      { label: "PERTE DE POIDS & SÈCHE", value: 95 },
      { label: "SATISFACTION ÉLÈVES", value: 100 },
    ],
    aboutTitle: "Atteignez votre meilleur niveau,<br><em>coaching sur mesure</em>",
    aboutTextTemplate: (name) => `${name} vous accompagne individuellement pour transformer votre corps et votre mental. Que vous souhaitiez perdre du poids, prendre de la masse musculaire ou préparer une compétition, bénéficiez de séances dynamiques et d'un plan d'action personnalisé.`,
    aboutGuarantees: [
      { title: "Coach Diplômé d'État", desc: "Encadrement sécurisé BPJEPS pour éviter toute blessure et optimiser vos mouvements." },
      { title: "Bilan Corporel Offert", desc: "Analyse d'impédancemétrie et tests de condition physique lors de la 1ère séance." },
      { title: "Suivi Nutritionnel Dédié", desc: "Plan alimentaire adapté à vos goûts sans privation extrême ni effet yoyo." },
      { title: "Séances à Domicile ou Salle", desc: "Matériel professionnel apporté sur place pour un confort d'entraînement total." }
    ],
    yearsLabel: "ANNÉES D'EXPÉRIENCE",
    ctaButtons: [
      { label: "BİLAN OFFERT", url: "#contact" },
      { label: "SÉANCE DÉCOUVERTE", url: "#services" },
      { label: "ME CONTACTER", url: "tel:" },
    ],
    services: [
      {
        title: "Coaching Particulier Solo / Duo",
        price: "dès 45€/h",
        description: "Séance d'entraînement 100% personnalisée à domicile, en salle partenaires ou en parc extérieur.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Programme Perte de Poids & Remise en Forme",
        price: "dès 89€/mois",
        description: "Combinaison de séances cardio/HIIT brûle-graisses intensives et rééquilibrage alimentaire ciblé.",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Prise de Muscle & Renforcement Musculaire",
        price: "dès 99€/mois",
        description: "Programmation d'hypertrophie musculaire, apprentissage de la surcharge progressive et suivi macro-nutriments.",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Coaching En Ligne & Application Mobile",
        price: "dès 49€/mois",
        description: "Programme d'entraînement vidéo sur application, corrections posturales à distance et bilan hebdomadaire.",
        image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&auto=format&fit=crop"
      }
    ],
    portfolio: [
      { title: "Transformation -14kg & Perte de Masse Grasse", category: "Perte de Poids", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop" },
      { title: "Prise de Masse Athlétique +7kg de Muscle", category: "Musculation", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop" },
      { title: "Préparation Physique Marathon 42km", category: "Endurance", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop" },
      { title: "Remise en Forme Post-Grossesse & Sangle Abdominale", category: "Sante", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&auto=format&fit=crop" }
    ],
    whyUs: [
      { number: "01", title: "Méthodologie Scientifique Validée", text: "Pas de régimes miracles. Une progression basée sur la physiologie et l'adaptation progressive." },
      { number: "02", title: "Soutien & Motivation 7j/7", text: "Un contact direct via messagerie pour répondre à vos doutes et maintenir une discipline de fer." },
      { number: "03", title: "Adaptation Totale à votre Emploi du Temps", text: "Séances tôt le matin (dès 6h) ou en soirée jusqu'à 21h selon vos disponibilités." }
    ],
    steps: [
      { step: "01", title: "Bilan Initial Offert", description: "Évaluation de la composition corporelle, habitudes de vie, blessures passées et fixation des objectifs." },
      { step: "02", title: "Planification Personnalisée", description: "Conception de votre programme sportif et nutritionnel adapté à votre métabolisme." },
      { step: "03", title: "Entraînement & Résultats", description: "Suivi rigoureux des séances, ajustements continus et célébration de vos victoires physiques !" }
    ],
    testimonials: [
      { name: "Thomas M.", rating: 5, city: "Perte de poids -12kg", text: "J'ai perdu 12kg en 4 mois sans jamais avoir l'impression de me priver. Le coach sait exactement comment motiver quand on a un coup de mou. Je recommande !", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format&fit=crop" },
      { name: "Laura B.", rating: 5, city: "Coaching à domicile", text: "Séances à domicile très pratiques avec mon travail exigeant. Mon mal de dos a disparu et je me sens enfin tonique !", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop" },
      { name: "Kevin G.", rating: 5, city: "Prise de masse", text: "Progression impressionnante en musculation. Les conseils en nutrition ont fait toute la différence. Merci pour tout !", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&auto=format&fit=crop" }
    ],
    faq: [
      { question: "Je suis totalement débutant(e), puis-je commencer le coaching ?", answer: "Absolument ! La majorité de mes clients débutent. Chaque exercice est adapté à votre niveau initial pour progresser en toute sécurité." },
      { question: "Où se déroulent les séances de coaching ?", answer: "Les séances peuvent avoir lieu à votre domicile, dans des salles de sport partenaires ou en extérieur selon vos préférences." },
      { question: "Devrai-je suivre un régime strict et peser mes aliments ?", answer: "Non. Nous visons un rééquilibrage alimentaire durable. Pas de régimes restrictifs mais des choix intelligents adaptés à votre vie sociale." },
      { question: "Au bout de combien de temps verrai-je les premiers résultats ?", answer: "Les premiers effets sur l'énergie et le sommeil se ressentent dès 2 semaines. Les changements physiques visibles apparaissent généralement après 4 à 6 semaines." }
    ]
  },

  drivingSchool: {
    accent: '#3B82F6',
    ribbonText: "APPRENDRE... RÉUSSIR DU 1ER COUP",
    heroTitleTemplate: (city) => `Auto-école de référence à ${city}`,
    heroSubtitle: "Permis B manuel/automatique, conduite accompagnée (AAC), stage intensif et code en ligne 24/7.",
    statLabels: [
      { label: "TAUX RÉUSSITE PERMIS >88%", value: 88 },
      { label: "MONITEURS DIPLÔMÉS D'ÉTAT", value: 100 },
      { label: "FORMATION CODE EN LIGNE", value: 98 },
      { label: "CONDUITE ACCOMPAGNÉE (AAC)", value: 92 },
      { label: "SATISFACTION ÉLÈVES", value: 99 },
    ],
    aboutTitle: "Pédagogie & Réussite,<br><em>passez votre permis en toute sérénité</em>",
    aboutTextTemplate: (name) => `${name} forme les conducteurs de demain avec exigence et bienveillance. Grâce à nos moniteurs diplômés d'État et à une flotte de véhicules récents et confortables, vous apprenez la conduite à votre rythme dans une ambiance rassurante.`,
    aboutGuarantees: [
      { title: "Moniteurs Diplômés d'État", desc: "Instructeurs agréés passionnés, patients et experts des parcours d'examen officiels." },
      { title: "Véhicules Récents & Crit'Air 0", desc: "Flotte moderne (Peugeot 208, Renault Clio, véhicules électriques silencieux)." },
      { title: "Code en Ligne 24/7", desc: "Plateforme d'entraînement avec cours, séries officielles et suivi statistique en temps réel." },
      { title: "Financement Facilité", desc: "Paiement en 3x ou 4x sans frais, permis à 1€ par jour et éligibilité CPF." }
    ],
    yearsLabel: "ANNÉES D'EXPÉRIENCE",
    ctaButtons: [
      { label: "S'INSCRIRE EN LIGNE", url: "#contact" },
      { label: "NOS FORFAITS PERMIS", url: "#services" },
      { label: "NOUS APPELER", url: "tel:" },
    ],
    services: [
      {
        title: "Permis B Traditionnel (Boîte Manuelle / Auto)",
        price: "dès 790€",
        description: "Formation complète incluant livre de code, évaluation sur simulateur, leçons de conduite et présentation à l'examen.",
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Conduite Accompagnée (AAC dès 15 ans)",
        price: "dès 890€",
        description: "La meilleure formule pour réussir du 1er coup avec de l'expérience et bénéficier d'une surprime d'assurance réduite.",
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Stage Intensif Permis 15 Jours",
        price: "dès 1190€",
        description: "Passage accéléré du code et leçons de conduite groupées pour obtenir votre permis en un temps record.",
        image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80&auto=format&fit=crop"
      },
      {
        title: "Annulation de Permis & Remise à Niveau",
        price: "dès 45€/h",
        description: "Leçons de perfectionnement, éco-conduite, reconquête de confiance au volant ou repassage rapide d'examen.",
        image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80&auto=format&fit=crop"
      }
    ],
    portfolio: [
      { title: "Nouveaux Véhicules Peugeot 208 Double Commande", category: "Flotte", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80&auto=format&fit=crop" },
      { title: "Simulateur de Conduite 3D Haute Définition", category: "Equipement", image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80&auto=format&fit=crop" },
      { title: "Leçons de Conduite sur Voie Rapide & Nuit", category: "Formation", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80&auto=format&fit=crop" },
      { title: "Remise des Permis & Félicitations aux Élevés", category: "Réussite", image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80&auto=format&fit=crop" }
    ],
    whyUs: [
      { number: "01", title: "Pédagogie Positive & Zéro Stress", text: "Nos moniteurs sont formés pour accompagner les personnes anxieuses avec calme et méthode." },
      { number: "02", title: "Planning 100% Flexible", text: "Réservez et modifiez vos heures de conduite facilement selon vos cours ou votre travail." },
      { number: "03", title: "Entraînement sur Parcours d'Examen", text: "Nous vous faisons travailler précisément les pièges et intersections des centres d'examen locaux." }
    ],
    steps: [
      { step: "01", title: "Évaluation Initiale", description: "Test d'aptitude sur simulateur pour déterminer le volume d'heures préconisé." },
      { step: "02", title: "Code & Pratique Simultanés", description: "Apprentissage du code en ligne et premières heures de conduite en toute sécurité." },
      { step: "03", title: "Examen Blanc & Réussite", description: "Validation sur examen blanc avant la présentation officielle au permis de conduire." }
    ],
    testimonials: [
      { name: "Mathieu V.", rating: 5, city: "Permis du 1er coup", text: "Permis obtenu du premier coup avec 29/31 ! Moniteur au top, très pédagogue et rassurant. Les voitures sont neuves et agréables à conduire.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format&fit=crop" },
      { name: "Chloé A.", rating: 5, city: "Conduite Accompagnée", text: "Super expérience en conduite accompagnée. Équipe très disponible et démarches administratives très simples.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop" },
      { name: "Sarah K.", rating: 5, city: "Boîte Automatique", text: "Inscrite en formule automatique, permis en poche en seulement 6 semaines ! Merci à toute l'équipe de l'auto-école.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&auto=format&fit=crop" }
    ],
    faq: [
      { question: "À partir de quel âge peut-on s'inscrire à la conduite accompagnée (AAC) ?", answer: "Vous pouvez débuter la formation initiale à la conduite accompagnée dès l'âge de 15 ans révolus." },
      { question: "Puis-je financer mon permis de conduire avec mon compte CPF ?", answer: "Oui, notre auto-école agréée Qualiopi permet le financement intégral de la préparation au permis B via votre solde CPF." },
      { question: "Quelle est la différence entre boîte manuelle et boîte automatique ?", answer: "Le permis boîte automatique nécessite un minimum légal de seulement 13 heures de conduite (contre 20h en manuelle) et offre un apprentissage plus rapide." },
      { question: "Comment se déroule l'apprentissage du code de la route ?", answer: "Vous avez accès 24h/24 à notre plateforme d'entraînement en ligne et pouvez venir aux séances thématiques avec moniteur dans notre salle de code." }
    ]
  }
};

export function buildPremiumDynamicTemplate(lead, content, niche = 'traiteur') {
  const currentContent = content || {};
  const nicheKey = (currentContent.nicheOverride || niche || lead.niche || lead.sector || 'traiteur').toLowerCase();
  
  let resolvedNiche = 'restaurant';
  if (currentContent.nicheOverride && NICHE_CONFIGS[currentContent.nicheOverride]) {
    resolvedNiche = currentContent.nicheOverride;
  } else if (nicheKey.includes('restau') || nicheKey.includes('food') || nicheKey.includes('bistr') || nicheKey.includes('brasser') || nicheKey.includes('resto') || nicheKey.includes('table') || nicheKey.includes('trait') || nicheKey.includes('cater')) {
    resolvedNiche = 'restaurant';
  } else if (nicheKey.includes('sinistr') || nicheKey.includes('restorat') || nicheKey.includes('dépannage') || nicheKey.includes('mold') || nicheKey.includes('moisissur') || nicheKey.includes('incend')) {
    resolvedNiche = 'sinistre';
  } else if (nicheKey.includes('electr') || nicheKey.includes('électr')) {
    resolvedNiche = 'electrician';
  } else if (nicheKey.includes('plumb') || nicheKey.includes('plomb') || nicheKey.includes('chauff')) {
    resolvedNiche = 'plumber';
  } else if (nicheKey.includes('roof') || nicheKey.includes('couvr')) {
    resolvedNiche = 'roofer';
  } else if (nicheKey.includes('lock') || nicheKey.includes('serrur')) {
    resolvedNiche = 'locksmith';
  } else if (nicheKey.includes('avocat') || nicheKey.includes('lawyer') || nicheKey.includes('jurid') || nicheKey.includes('legal')) {
    resolvedNiche = 'lawyer';
  } else if (nicheKey.includes('real') || nicheKey.includes('immob')) {
    resolvedNiche = 'realEstate';
  } else if (nicheKey.includes('fit') || nicheKey.includes('coach')) {
    resolvedNiche = 'fitnessCoach';
  } else if (nicheKey.includes('driv') || nicheKey.includes('permis') || nicheKey.includes('auto')) {
    resolvedNiche = 'drivingSchool';
  } else {
    resolvedNiche = 'artisan';
  }

  const activeNiche = resolvedNiche;
  const lang = currentContent.language || detectLanguage(lead);
  const displayCity = extractCity(lead) || lead.city || (lang === 'fr' ? 'votre ville' : 'your area');
  const brandName = lead.name || lead.companyName || lead.company || lead.businessName || (lang === 'fr' ? 'Notre Entreprise' : 'Our Business');
  const websiteDomain = lead.website ? lead.website.replace(/https?:\/\/|www\./g, '').split('/')[0] : '';
  const faviconUrl = websiteDomain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(websiteDomain)}&sz=128` : null;
  const siteLogoUrl = lead.logo || lead.avatar || lead.profilePic || lead.photo || faviconUrl;

  const rawConfig = NICHE_CONFIGS[activeNiche] || NICHE_CONFIGS[nicheKey] || NICHE_CONFIGS.restaurant || NICHE_CONFIGS.artisan;
  const config = (typeof rawConfig.getLangConfig === 'function') 
    ? rawConfig.getLangConfig(lang, displayCity, brandName)
    : rawConfig;

  const accent = currentContent.accentColor || config.accent;

  const heroTitle = currentContent.heroTitle || (config.heroTitleTemplate ? config.heroTitleTemplate(displayCity) : config.heroTitle);
  const heroSubtitle = currentContent.heroSubtitle || config.heroSubtitle;
  const ribbonText = currentContent.ribbonText || config.ribbonText;
  
  const fallbackUnsplash = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop';

  const rawPhotos = (currentContent.photos && Array.isArray(currentContent.photos) && currentContent.photos.length > 0)
    ? currentContent.photos.filter(p => typeof p === 'string' && p.startsWith('http'))
    : ((lead.siteData?.photos && Array.isArray(lead.siteData.photos) && lead.siteData.photos.length > 0)
        ? lead.siteData.photos.filter(p => typeof p === 'string' && p.startsWith('http'))
        : ((lead.photos && Array.isArray(lead.photos) && lead.photos.length > 0)
            ? lead.photos.filter(p => typeof p === 'string' && p.startsWith('http'))
            : []));

  const galleryPhotos = rawPhotos.length > 0
    ? rawPhotos.slice(0, 8)
    : (DEFAULT_GALLERY[activeNiche] || (config.portfolio ? config.portfolio.map(p => p.image) : []));

  const heroImage = currentContent.heroImage || galleryPhotos[0] || fallbackUnsplash;
  const aboutImage = currentContent.aboutImage;

  const statLabels = currentContent.statLabels || config.statLabels || [];
  const statsHTML = statLabels.map(s => {
    const valStr = String(s.value);
    const displayVal = (typeof s.value === 'number' && !valStr.includes('%')) ? `${s.value}%` : valStr;
    return `
      <div class="stat-row">
        <span class="stat-label">${s.label}</span>
        <span class="stat-value">${displayVal}</span>
      </div>
    `;
  }).join('');

  const aboutTitle = currentContent.aboutTitle || config.aboutTitle;
  const aboutText = currentContent.aboutText || (typeof config.aboutTextTemplate === 'function' ? config.aboutTextTemplate(brandName) : config.aboutText);
  const yearsInBusiness = currentContent.yearsInBusiness || (lead.foundedYear ? new Date().getFullYear() - parseInt(lead.foundedYear) : 12);

  const guarantees = currentContent.aboutHighlights?.map(h => typeof h === 'string' ? { title: h, desc: '' } : h) || config.aboutGuarantees || [];
  const guaranteesHTML = guarantees.map(g => `
    <div class="guarantee-card">
      <div class="guarantee-icon">✓</div>
      <div>
        <h4>${g.title}</h4>
        ${g.desc ? `<p>${g.desc}</p>` : ''}
      </div>
    </div>
  `).join('');

  const serviceBtnLabel = (activeNiche === 'restaurant')
    ? (lang === 'fr' ? 'Réserver une Table' : 'Book a Table')
    : (activeNiche === 'traiteur')
    ? (lang === 'fr' ? 'Réserver / Devis' : 'Book / Quote')
    : (activeNiche === 'fitnessCoach' || activeNiche === 'drivingSchool')
    ? (lang === 'fr' ? 'S\'inscrire' : 'Register')
    : (lang === 'fr' ? 'Demander un devis' : 'Get a Quote');

  const servicesList = (currentContent.services && currentContent.services.length)
    ? currentContent.services.map((s, idx) => ({
        ...s,
        image: s.image || s.img || (config.services?.[idx % config.services.length]?.image || fallbackUnsplash),
        title: s.title || (config.services?.[idx % config.services.length]?.title || ''),
        description: s.description || s.desc || (config.services?.[idx % config.services.length]?.description || '')
      }))
    : config.services;
  const servicesHTML = servicesList.map(s => `
    <div class="service-card">
      <div class="service-img-wrap">
        <img src="${s.image}" alt="${s.title}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackUnsplash}';">
        ${s.price ? `<span class="price-tag">${s.price}</span>` : ''}
      </div>
      <div class="service-body">
        <h3>${s.title}</h3>
        <p>${s.description}</p>
        <a href="#contact" class="service-btn">${serviceBtnLabel}</a>
      </div>
    </div>
  `).join('');

  const portfolioList = (currentContent.portfolio && currentContent.portfolio.length)
    ? currentContent.portfolio.map((p, idx) => ({
        ...p,
        image: p.image || p.img || (config.portfolio?.[idx % (config.portfolio?.length || 1)]?.image || fallbackUnsplash),
        title: p.title || (config.portfolio?.[idx % (config.portfolio?.length || 1)]?.title || ''),
        desc: p.desc || p.description || (config.portfolio?.[idx % (config.portfolio?.length || 1)]?.desc || '')
      }))
    : config.portfolio;

  const whyUsList = (currentContent.whyUs && currentContent.whyUs.length)
    ? currentContent.whyUs.map((w, idx) => ({
        ...w,
        number: w.number || String(idx + 1).padStart(2, '0'),
        title: w.title || (config.whyUs?.[idx % (config.whyUs?.length || 1)]?.title || ''),
        text: w.text || w.desc || (config.whyUs?.[idx % (config.whyUs?.length || 1)]?.text || '')
      }))
    : config.whyUs;
  const whyUsHTML = whyUsList.map(w => `
    <div class="why-card">
      <span class="why-num">${w.number}</span>
      <h3>${w.title}</h3>
      <p>${w.text}</p>
    </div>
  `).join('');

  const stepsList = (currentContent.steps && currentContent.steps.length)
    ? currentContent.steps.map((st, idx) => ({
        ...st,
        step: st.step || String(idx + 1).padStart(2, '0'),
        title: st.title || (config.steps?.[idx % (config.steps?.length || 1)]?.title || ''),
        description: st.description || st.desc || (config.steps?.[idx % (config.steps?.length || 1)]?.description || '')
      }))
    : config.steps;
  const stepsHTML = stepsList.map(st => `
    <div class="step-card">
      <div class="step-badge">${st.step}</div>
      <h3>${st.title}</h3>
      <p>${st.description}</p>
    </div>
  `).join('');

  const testimonialsList = currentContent.testimonials || config.testimonials;
  const testimonialsHTML = testimonialsList.map(t => `
    <div class="review-card">
      <div class="review-header">
        <img src="${t.avatar}" alt="${t.name}" class="review-avatar" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop';">
        <div>
          <h4>${t.name}</h4>
          <span class="review-city">${t.city || displayCity}</span>
        </div>
      </div>
      <div class="review-stars">★★★★★</div>
      <p class="review-text">"${t.text}"</p>
    </div>
  `).join('');

  const faqList = currentContent.faq || config.faq;
  const faqHTML = faqList.map((f, i) => `
    <details class="faq-item" ${i === 0 ? 'open' : ''}>
      <summary class="faq-question"><span>${f.question}</span> <span class="faq-icon">+</span></summary>
      <div class="faq-answer"><p>${f.answer}</p></div>
    </details>
  `).join('');

  const ctaButtons = currentContent.ctaButtons || config.ctaButtons;
  const ctaButtonsHTML = ctaButtons.map(b => `
    <a href="${b.url || '#contact'}" class="cta-pill">${b.label}</a>
  `).join('');

  const displayPhone = lead.phone || '';
  const phoneHref = lead.phone ? `tel:${lead.phone.replace(/\s+/g, '')}` : '#';
  let waNumber = (lead.phone || '').replace(/[^0-9+]/g, '');
  if (waNumber.startsWith('0')) waNumber = '33' + waNumber.substring(1);
  else if (waNumber.startsWith('+')) waNumber = waNumber.substring(1);
  const whatsappUrl = waNumber ? `https://wa.me/${waNumber}` : null;

  const contactTitle = currentContent.contactTitle || (activeNiche === 'restaurant'
    ? (lang === 'fr' ? 'Réserver une Table' : 'Book a Table')
    : activeNiche === 'traiteur'
    ? (lang === 'fr' ? 'Devis & Réservation' : 'Request a Quote')
    : (lang === 'fr' ? 'Demander un Devis' : 'Request a Quote'));

  const contactSubtitle = currentContent.contactSubtitle || (activeNiche === 'restaurant'
    ? (lang === 'fr' ? 'Confirmation rapide par SMS ou email. Simple et immédiat.' : 'Fast confirmation by SMS or email.')
    : (lang === 'fr' ? 'Réponse sous 24h ouvrées. Gratuit et sans engagement.' : 'Response within 24 hours. Free & no commitment.'));

  const contactSubmitText = currentContent.contactSubmitText || (activeNiche === 'restaurant'
    ? (lang === 'fr' ? 'Confirmer ma Réservation' : 'Confirm Booking')
    : (lang === 'fr' ? 'Envoyer la demande' : 'Submit Request'));

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<base href="/">
<meta name="referrer" content="no-referrer">
<title>${brandName} — ${displayCity}</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
  :root { --accent: ${accent}; --bg: #0A0A0C; --card-bg: #131317; --border: #22222A; --text: #F5F5F0; --dim: #A0A0AA; }
  * { box-sizing: border-box; margin: 0; padding: 0; scroll-behavior: smooth; }
  body { font-family: 'Jost', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; line-height: 1.6; }
  h1, h2, h3 { font-family: 'Archivo Black', sans-serif; text-transform: uppercase; letter-spacing: -0.02em; }

  /* NAVIGATION */
  nav { position: fixed; top: 0; width: 100%; z-index: 100; display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; background: rgba(10, 10, 12, 0.88); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
  .nav-logo { font-family: 'Archivo Black', sans-serif; font-size: 20px; color: var(--accent); letter-spacing: 1px; }
  .nav-links { display: flex; gap: 24px; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; }
  .nav-links a { color: var(--text); text-decoration: none; transition: color 0.2s; }
  .nav-links a:hover { color: var(--accent); }
  .nav-links a.whatsapp { color: #25D366; font-weight: 700; }

  /* HERO */
  .hero { position: relative; min-height: 100vh; display: flex; padding-top: 80px; }
  .hero-photo { position: relative; width: 55%; min-height: 90vh; }
  .hero-photo img { width: 100%; height: 100%; object-fit: cover; }
  .hero-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 65%, var(--bg)); }
  .ribbon { position: absolute; bottom: 12%; left: -4%; background: var(--accent); color: #000; padding: 18px 50px; transform: rotate(-6deg); font-family: 'Archivo Black', sans-serif; font-size: clamp(18px, 2.5vw, 38px); white-space: nowrap; box-shadow: 0 15px 35px rgba(0,0,0,0.6); z-index: 10; }

  .hero-stats { width: 45%; display: flex; flex-direction: column; justify-content: center; padding: 4% 5%; gap: 10px; }
  .stat-row { display: flex; justify-content: space-between; align-items: baseline; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .stat-label { font-size: 14px; font-weight: 700; letter-spacing: 0.05em; }
  .stat-value { color: var(--accent); font-weight: 800; font-size: 20px; font-family: 'Archivo Black', sans-serif; }

  /* CTA ROW */
  .cta-row { display: flex; gap: 16px; justify-content: center; padding: 50px 5%; flex-wrap: wrap; background: #0E0E12; border-y: 1px solid var(--border); }
  .cta-pill { border: 2px solid var(--accent); color: var(--text); padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.25s; }
  .cta-pill:hover { background: var(--accent); color: #000; transform: translateY(-2px); }

  /* ABOUT & GUARANTEES */
  .about { padding: 90px 5%; max-width: 1200px; margin: 0 auto; }
  .about-header { text-align: center; max-width: 800px; margin: 0 auto 60px; }
  .about h2 { font-size: clamp(30px, 4.5vw, 52px); margin-bottom: 24px; line-height: 1.1; }
  .about em { color: var(--accent); font-style: normal; }
  .about p { color: var(--dim); font-size: 17px; line-height: 1.7; margin-bottom: 30px; }
  .years-badge { width: 140px; height: 140px; border-radius: 50%; border: 2px solid var(--accent); display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 50px; background: rgba(201,169,110,0.05); }
  .years-badge .num { font-family: 'Archivo Black', sans-serif; font-size: 44px; color: var(--accent); line-height: 1; }
  .years-badge .label { font-size: 9px; letter-spacing: 0.12em; color: var(--dim); text-align: center; margin-top: 4px; font-weight: 700; }

  .guarantees-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
  .guarantee-card { background: var(--card-bg); border: 1px solid var(--border); padding: 24px; border-radius: 12px; display: flex; gap: 16px; align-items: flex-start; }
  .guarantee-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--accent); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 900; flex-shrink: 0; }
  .guarantee-card h4 { font-size: 16px; margin-bottom: 6px; font-family: 'Jost', sans-serif; font-weight: 700; color: #FFF; }
  .guarantee-card p { font-size: 13px; color: var(--dim); line-height: 1.5; margin: 0; }

  /* SERVICES GRID */
  .services-section { padding: 90px 5%; background: #0E0E12; border-t: 1px solid var(--border); }
  .section-title { text-align: center; font-size: clamp(28px, 4vw, 44px); margin-bottom: 16px; }
  .section-subtitle { text-align: center; color: var(--dim); max-width: 600px; margin: 0 auto 60px; font-size: 16px; }
  .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
  .service-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s, border-color 0.3s; }
  .service-card:hover { transform: translateY(-6px); border-color: var(--accent); }
  .service-img-wrap { position: relative; height: 200px; }
  .service-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .price-tag { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.85); color: var(--accent); font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: 999px; border: 1px solid var(--accent); font-family: 'Jost', sans-serif; }
  .service-body { padding: 24px; display: flex; flex-direction: column; flex-grow: 1; }
  .service-body h3 { font-size: 18px; margin-bottom: 12px; color: #FFF; line-height: 1.3; }
  .service-body p { color: var(--dim); font-size: 14px; line-height: 1.6; margin-bottom: 24px; flex-grow: 1; }
  .service-btn { display: inline-block; text-align: center; padding: 12px; background: transparent; border: 1px solid var(--accent); color: var(--accent); text-decoration: none; font-weight: 700; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 8px; transition: all 0.2s; }
  .service-btn:hover { background: var(--accent); color: #000; }

  /* CAROUSEL & PORTFOLIO */
  .gallery-section { padding: 90px 0; text-align: center; }
  .carousel { position: relative; height: 460px; display: flex; align-items: center; justify-content: center; perspective: 1200px; margin-top: 40px; }
  .carousel-track { position: relative; width: 280px; height: 380px; transform-style: preserve-3d; }
  .carousel-card { position: absolute; width: 280px; height: 380px; top: 0; left: 0; border-radius: 12px; overflow: hidden; transition: transform 0.6s ease, opacity 0.6s ease; box-shadow: 0 20px 50px rgba(0,0,0,0.6); border: 1px solid var(--border); }
  .carousel-card img { width: 100%; height: 100%; object-fit: cover; }
  .carousel-nav { display: flex; gap: 16px; justify-content: center; margin-top: 30px; }
  .carousel-btn { width: 46px; height: 46px; border-radius: 50%; border: 1px solid #3A3A3A; background: var(--card-bg); color: var(--text); cursor: pointer; font-size: 20px; transition: all 0.2s; }
  .carousel-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* WHY US & STEPS */
  .why-section { padding: 90px 5%; max-width: 1200px; margin: 0 auto; }
  .why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 80px; }
  .why-card { background: var(--card-bg); border: 1px solid var(--border); padding: 36px 28px; border-radius: 14px; position: relative; }
  .why-num { font-family: 'Archivo Black', sans-serif; font-size: 40px; color: var(--accent); opacity: 0.8; display: block; margin-bottom: 12px; }
  .why-card h3 { font-size: 20px; margin-bottom: 12px; color: #FFF; }
  .why-card p { color: var(--dim); font-size: 14px; line-height: 1.6; }

  .steps-title { text-align: center; font-size: 28px; margin-bottom: 40px; }
  .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
  .step-card { background: #0E0E12; border: 1px dashed var(--border); padding: 28px; border-radius: 12px; text-align: center; }
  .step-badge { width: 40px; height: 40px; border-radius: 50%; background: var(--accent); color: #000; font-family: 'Archivo Black', sans-serif; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 16px; }
  .step-card h3 { font-size: 18px; margin-bottom: 10px; color: #FFF; }
  .step-card p { font-size: 13px; color: var(--dim); margin: 0; }

  /* REVIEWS */
  .reviews-section { padding: 90px 5%; background: #0E0E12; border-t: 1px solid var(--border); }
  .reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
  .review-card { background: var(--card-bg); border: 1px solid var(--border); padding: 30px; border-radius: 14px; }
  .review-header { display: flex; items-center; gap: 14px; margin-bottom: 16px; }
  .review-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent); }
  .review-header h4 { font-size: 16px; color: #FFF; font-weight: 700; }
  .review-city { font-size: 12px; color: var(--dim); display: block; }
  .review-stars { color: #F5A623; margin-bottom: 14px; font-size: 16px; }
  .review-text { font-style: italic; color: #DDD; font-size: 14px; line-height: 1.6; }

  /* FAQ & CONTACT */
  .faq-contact { padding: 90px 5%; max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
  .faq-container h2 { font-size: 32px; margin-bottom: 30px; }
  .faq-item { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 14px; overflow: hidden; }
  .faq-question { padding: 18px 20px; font-weight: 700; cursor: pointer; display: flex; justify-content: space-between; align-items: center; list-style: none; color: #FFF; font-size: 15px; }
  .faq-answer { padding: 0 20px 18px; color: var(--dim); font-size: 14px; border-top: 1px solid rgba(255,255,255,0.05); }

  .contact-container { background: var(--card-bg); border: 1px solid var(--border); padding: 40px; border-radius: 16px; }
  .contact-container h2 { font-size: 32px; margin-bottom: 12px; }
  .contact-container p { color: var(--dim); margin-bottom: 30px; font-size: 14px; }
  form { display: flex; flex-direction: column; gap: 16px; }
  input, select, textarea { background: #18181E; border: 1px solid #2C2C36; color: var(--text); padding: 14px 16px; border-radius: 8px; font-family: 'Jost', sans-serif; font-size: 14px; }
  input:focus, select:focus, textarea:focus { outline: none; border-color: var(--accent); }
  button[type=submit] { background: var(--accent); color: #000; border: none; padding: 16px; border-radius: 8px; font-weight: 800; font-family: 'Archivo Black', sans-serif; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: opacity 0.2s; }
  button[type=submit]:hover { opacity: 0.9; }

  footer { padding: 40px 5%; text-align: center; border-top: 1px solid var(--border); color: var(--dim); font-size: 13px; }

  @media (max-width: 900px) {
    .faq-contact { grid-template-columns: 1fr; }
    .hero { flex-direction: column; height: auto; }
    .hero-photo, .hero-stats { width: 100%; min-height: auto; }
    .hero-photo { height: 45vh; }
    .ribbon { font-size: 22px; padding: 12px 30px; left: -2%; }
    .nav-links { display: none; }
  }
</style>
</head>
<body>

<nav>
  <div class="nav-logo" style="display: flex; align-items: center; gap: 10px;">
    ${siteLogoUrl ? `<img src="${siteLogoUrl}" alt="${brandName}" style="height: 32px; width: 32px; object-fit: contain; border-radius: 6px; background: #FFF; padding: 2px;" onerror="this.style.display='none';">` : ''}
    <span>${brandName}</span>
  </div>
  <div class="nav-links">
    <a href="#about">${lang === 'fr' ? 'À PROPOS' : 'ABOUT'}</a>
    <a href="#services">${lang === 'fr' ? 'SERVICES' : 'SERVICES'}</a>
    <a href="#gallery">${lang === 'fr' ? 'RÉALISATIONS' : 'PORTFOLIO'}</a>
    <a href="#reviews">${lang === 'fr' ? 'AVIS' : 'REVIEWS'}</a>
    <a href="#faq">${lang === 'fr' ? 'FAQ' : 'FAQ'}</a>
    ${whatsappUrl ? `<a href="${whatsappUrl}" class="whatsapp" target="_blank">WHATSAPP</a>` : ''}
    <a href="#contact">${lang === 'fr' ? 'DEVIS' : 'QUOTE'}</a>
  </div>
</nav>

<section class="hero">
  <div class="hero-photo">
    <img src="${heroImage}" alt="${brandName}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackUnsplash}';">
    <div class="ribbon">${ribbonText}</div>
  </div>
  <div class="hero-stats">
    <h1 style="font-size: clamp(22px, 2.8vw, 36px); margin-bottom: 16px; line-height: 1.15;">${heroTitle}</h1>
    <p style="color: var(--dim); margin-bottom: 24px; font-size: 15px;">${heroSubtitle}</p>
    ${statsHTML}
  </div>
</section>

<div class="cta-row">${ctaButtonsHTML}</div>

<section class="about" id="about">
  <div class="about-header">
    <h2>${aboutTitle}</h2>
    ${aboutImage ? `<div style="max-width: 600px; margin: 0 auto 30px; border-radius: 16px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 20px 40px rgba(0,0,0,0.5);"><img src="${aboutImage}" alt="About ${brandName}" style="width: 100%; height: 320px; object-fit: cover;" referrerpolicy="no-referrer"></div>` : ''}
    <p>${aboutText}</p>
    <div class="years-badge">
      <span class="num">${yearsInBusiness}</span>
      <span class="label">${config.yearsLabel}</span>
    </div>
  </div>
  <div class="guarantees-grid">${guaranteesHTML}</div>
</section>

<section class="services-section" id="services">
  <h2 class="section-title">${lang === 'fr' ? 'Nos Prestations Star' : 'Our Star Services'}</h2>
  <p class="section-subtitle">${lang === 'fr' ? 'Un service professionnel, réactif et adapté à vos besoins exacts.' : 'Professional, responsive service tailored to your exact needs.'}</p>
  <div class="services-grid">${servicesHTML}</div>
</section>

<section class="gallery-section" id="gallery">
  <h2 class="section-title">${config.galleryTitle || (lang === 'fr' ? 'Savoir-Faire en Images' : 'Featured Projects')}</h2>
  <div class="carousel">
    <div class="carousel-track" id="carouselTrack">
      ${galleryPhotos.map((photo, i) => `<div class="carousel-card" data-index="${i}"><img src="${photo}" alt="Project ${i}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackUnsplash}';"></div>`).join('')}
    </div>
  </div>
  <div class="carousel-nav">
    <button class="carousel-btn" onclick="moveCarousel(-1)">‹</button>
    <button class="carousel-btn" onclick="moveCarousel(1)">›</button>
  </div>
</section>

<section class="why-section">
  <h2 class="section-title" style="text-align: center; margin-bottom: 50px;">${lang === 'fr' ? 'Pourquoi Nous Choisir' : 'Why Choose Us'}</h2>
  <div class="why-grid">${whyUsHTML}</div>

  <h3 class="steps-title">${lang === 'fr' ? 'Notre Démarche en 3 Étapes' : 'Our 3-Step Process'}</h3>
  <div class="steps-grid">${stepsHTML}</div>
</section>

<section class="reviews-section" id="reviews">
  <h2 class="section-title">${lang === 'fr' ? 'Avis Clients Vérifiés' : 'Verified Reviews'}</h2>
  <p class="section-subtitle">${lang === 'fr' ? 'Ce que nos clients disent de la qualité de notre travail.' : 'What our clients say about our service quality.'}</p>
  <div class="reviews-grid">${testimonialsHTML}</div>
</section>

<div class="faq-contact" id="faq">
  <div class="faq-container">
    <h2>F.A.Q</h2>
    ${faqHTML}
  </div>

  <div class="contact-container" id="contact">
    <h2>${contactTitle}</h2>
    <p>${contactSubtitle}</p>
    <form onsubmit="handleSubmit(event)">
      <input type="text" name="name" placeholder="${lang === 'fr' ? 'Votre nom complet' : 'Your full name'}" required>
      <input type="email" name="email" placeholder="${lang === 'fr' ? 'Votre adresse email' : 'Your email address'}" required>
      <input type="tel" name="phone" placeholder="${lang === 'fr' ? 'Votre téléphone' : 'Your phone number'}">
      <select name="service">
        <option value="">${lang === 'fr' ? '— Choisir une option —' : '— Select an option —'}</option>
        ${servicesList.map(s => `<option value="${s.title}">${s.title}</option>`).join('')}
      </select>
      <textarea name="message" rows="4" placeholder="${activeNiche === 'restaurant' ? (lang === 'fr' ? 'Nombre de couverts, date & heure souhaitées...' : 'Number of guests, date & time...') : (lang === 'fr' ? 'Décrivez votre demande...' : 'Describe your project...')}" required></textarea>
      <button type="submit">${contactSubmitText}</button>
    </form>
  </div>
</div>

${(currentContent.showGoogleMaps !== false && currentContent.showMap !== false) ? `
<section id="location" style="padding: 60px 20px; background: rgba(10, 10, 15, 0.7); border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
  <div style="max-width: 1100px; margin: 0 auto;">
    <span style="display: inline-block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #3b82f6; background: rgba(59, 130, 246, 0.12); padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; border: 1px solid rgba(59, 130, 246, 0.25);">
      📍 ${lang === 'fr' ? 'Localisation & Accès' : 'Location & Access'}
    </span>
    <h2 style="font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 8px;">${brandName} — ${displayCity || 'Notre Établissement'}</h2>
    <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 20px;">📍 ${currentContent.mapAddress || currentContent.address || lead.address || (displayCity ? displayCity + ' & Environs' : 'Notre Établissement')}</p>
    <div style="margin-bottom: 24px;">
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentContent.mapAddress || currentContent.address || lead.address || (brandName + ' ' + (displayCity || '')))}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #fff; font-weight: 700; text-decoration: none; border-radius: 12px; font-size: 13px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35); transition: transform 0.2s;">
        📍 ${lang === 'fr' ? 'Ouvrir dans Google Maps' : 'Open in Google Maps'}
      </a>
    </div>
    <div style="border-radius: 20px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.12); height: 380px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
      <iframe
        title="Google Maps Location"
        width="100%"
        height="100%"
        style="border:0;"
        loading="lazy"
        allowfullscreen
        src="https://maps.google.com/maps?q=${encodeURIComponent(currentContent.mapAddress || currentContent.address || lead.address || (brandName + ' ' + (displayCity || '')))}&t=&z=14&ie=UTF8&iwloc=&output=embed">
      </iframe>
    </div>
  </div>
</section>
` : ''}

<footer>
  <p>© ${new Date().getFullYear()} ${brandName}. ${displayCity} & Environs. ${lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
</footer>

<script>
  let activeIndex = 0;
  const cards = document.querySelectorAll('.carousel-card');
  const total = cards.length;

  function renderCarousel() {
    cards.forEach((card, i) => {
      let offset = i - activeIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;
      const translateX = offset * 140;
      const translateZ = offset === 0 ? 0 : -200;
      const rotateY = offset * -35;
      const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25;
      card.style.transform = \`translateX(\${translateX}px) translateZ(\${translateZ}px) rotateY(\${rotateY}deg)\`;
      card.style.opacity = opacity;
      card.style.zIndex = total - Math.abs(offset);
    });
  }

  function moveCarousel(dir) {
    activeIndex = (activeIndex + dir + total) % total;
    renderCarousel();
  }

  if (total > 0) {
    renderCarousel();
    setInterval(() => moveCarousel(1), 4000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    try {
      await fetch('/api/widget/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyId: "${lead.userId || lead.agencyId || ''}",
          clientName: formData.get('name'),
          clientEmail: formData.get('email'),
          clientPhone: formData.get('phone'),
          service: formData.get('service'),
          message: formData.get('message'),
          businessName: "${brandName.replace(/"/g, '\\"')}",
          source: "demo_site"
        })
      });
    } catch (err) { console.error(err); }
    form.innerHTML = '<div style="padding: 30px; text-align: center; background: rgba(201,169,110,0.1); border: 1px solid var(--accent); border-radius: 12px;"><h3 style="color: var(--accent); margin-bottom: 8px;">${lang === 'fr' ? 'Demande Envoyée !' : 'Request Sent!'}</h3><p style="color: var(--dim); font-size: 14px;">${lang === 'fr' ? 'Merci ! Notre équipe vous recontacte très rapidement.' : 'Thank you! We will get back to you shortly.'}</p></div>';
  }
</script>
</body>
</html>`;
}

export { NICHE_CONFIGS };
