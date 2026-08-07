/**
 * ASSIX - Complete Niche-Specific Email Templates & Processing Engine
 * 
 * Supports 8 Industry Sectors in French and English with responsive inline CSS markup.
 * Includes placeholders for dynamic substitution:
 * {{company}}, {{contactName}}, {{city}}, {{painPoint}}, {{demoLink}}, {{senderName}}, {{senderTitle}}, etc.
 */

export interface NicheEmailContent {
  subject: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  secondaryCta: string;
  stat1: { value: string; label: string };
  stat2: { value: string; label: string };
  stat3: { value: string; label: string };
  servicesTitle: string;
  servicesSubtitle: string;
  services: { title: string; desc: string; icon: string }[];
  workflowTitle: string;
  workflowSteps: { step: string; title: string; desc: string }[];
  whyUsTitle: string;
  whyUsPoints: string[];
  testimonial: { quote: string; author: string; role: string };
  formHeader: string;
  formSubheader: string;
}

export type NicheType = 
  | 'restaurant' 
  | 'disaster_restoration' 
  | 'plumbing' 
  | 'driving_school' 
  | 'electrical' 
  | 'locksmith' 
  | 'law_firm' 
  | 'real_estate'
  | 'general';

export type Language = 'fr' | 'en';

export const NICHE_EMAIL_TEMPLATES: Record<NicheType, Record<Language, NicheEmailContent>> = {
  restaurant: {
    fr: {
      subject: "L'art de recevoir à votre image — Démo interactive pour {{company}}",
      heroTitle: "L'art de recevoir à votre image",
      heroSubtitle: "Créations gastronomiques sur mesure pour vos mariages, événements d'entreprise et réceptions privées. Une expérience culinaire inoubliable.",
      primaryCta: "Obtenir un devis personnalisé",
      secondaryCta: "Découvrir nos créations",
      stat1: { value: "12+ ans", label: "Savoir-faire culinaire" },
      stat2: { value: "100%", label: "Produits frais & de saison" },
      stat3: { value: "4.9/5", label: "Note moyennes réceptions" },
      servicesTitle: "Chaque événement mérite l'excellence",
      servicesSubtitle: "De l'intime dîner privé au grand banquet de gala, nous adaptons notre savoir-faire à vos exigences.",
      services: [
        { title: "Mariages & Cérémonies", desc: "Menu sur mesure, cocktail raffiné et dîner assis d'exception.", icon: "🥂" },
        { title: "Cocktails & Réceptions", desc: "Bouchées gastronomiques, animations culinaires en direct et pièces montées.", icon: "🍢" },
        { title: "Événements Corporate", desc: "Séminaires, soirées de gala, pauses café gourmandes et repas d'affaires.", icon: "👔" },
        { title: "Chef & Dîner Privé", desc: "Une expérience gastronomique de haut vol directement dans votre résidence.", icon: "🍽️" }
      ],
      workflowTitle: "Notre Méthode en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Consultation & Dégustation", desc: "Échange sur vos attentes et dégustation privée de votre futur menu." },
        { step: "02", title: "Menu Sur-Mesure", desc: "Proposition détaillée adaptée à votre budget et régimes alimentaires." },
        { step: "03", title: "Préparation Gastronomique", desc: "Sélection rigoureuse des meilleurs produits du marché le matin même." },
        { step: "04", title: "Service & Animation", desc: "Maîtres d'hôtel et chefs dédiés pour une réception sans aucune contrainte." }
      ],
      whyUsTitle: "Pourquoi Choisir Notre Maison ?",
      whyUsPoints: [
        "Ingrédients 100% frais et locaux sélectionnés chaque matin",
        "Menus modulables selon vos allergies et préférences (halal, végan, sans gluten)",
        "Service clé en main : nappage, vaisselle de prestige, mobilier & décoration",
        "Équipe de service souriante, bilingue et hautement qualifiée"
      ],
      testimonial: {
        quote: "Une prestation culinaire sublime pour notre mariage de 180 convives. La qualité des mets et la discrétion du service ont émerveillé nos invités.",
        author: "Camille & Thomas L.",
        role: "Mariage au Château de Flaugergues"
      },
      formHeader: "Planifions votre Événement d'Exception",
      formSubheader: "Recevez une proposition détaillée et un devis personnalisé sous 24 heures sans engagement."
    },
    en: {
      subject: "Bespoke Culinary & Catering Excellence — Interactive Demo for {{company}}",
      heroTitle: "The Art of Hospitality Tailored to You",
      heroSubtitle: "Bespoke gastronomic creations for weddings, corporate galas, and private receptions. An unforgettable dining experience.",
      primaryCta: "Request a Custom Quote",
      secondaryCta: "Explore Our Menus",
      stat1: { value: "12+ Yrs", label: "Culinary Heritage" },
      stat2: { value: "100%", label: "Fresh Seasonal Ingredients" },
      stat3: { value: "4.9/5", label: "Client Satisfaction Score" },
      servicesTitle: "Every Event Deserves Excellence",
      servicesSubtitle: "From intimate private dinners to large-scale galas, we tailor our culinary art to your highest standards.",
      services: [
        { title: "Weddings & Ceremonies", desc: "Tailored multi-course menus, refined cocktail hours, and exquisite desserts.", icon: "🥂" },
        { title: "Cocktails & Receptions", desc: "Gourmet finger food, live cooking stations, and signature canapés.", icon: "🍢" },
        { title: "Corporate Events", desc: "Seminars, gala dinners, executive luncheons, and coffee break catering.", icon: "👔" },
        { title: "Private Chef Service", desc: "A Michelin-inspired dining experience crafted directly in your home.", icon: "🍽️" }
      ],
      workflowTitle: "Our 4-Step Event Method",
      workflowSteps: [
        { step: "01", title: "Consultation & Tasting", desc: "Detailed discussion of your vision paired with a private menu tasting." },
        { step: "02", title: "Bespoke Proposal", desc: "A customized menu outline fitted to your dietary requirements and budget." },
        { step: "03", title: "Fresh Preparation", desc: "Rigorous sourcing of top-tier local produce on the morning of your event." },
        { step: "04", title: "Seamless Execution", desc: "Professional maitre d's and culinary staff managing every detail." }
      ],
      whyUsTitle: "Why Choose Our Culinary House?",
      whyUsPoints: [
        "100% farm-fresh seasonal produce sourced directly from local producers",
        "Flexible menu options accommodating all dietary constraints (vegan, halal, GF)",
        "Turnkey solutions including luxury tableware, linens, and decor setup",
        "Discreet, bilingual, and highly trained front-of-house service staff"
      ],
      testimonial: {
        quote: "An extraordinary culinary presentation for our 180-guest wedding gala. The food quality and attentive service left everyone raving.",
        author: "Sarah & David M.",
        role: "Private Estate Reception"
      },
      formHeader: "Plan Your Exceptional Gathering",
      formSubheader: "Receive a tailored menu concept and itemized quote within 24 hours."
    }
  },

  disaster_restoration: {
    fr: {
      subject: "Intervention Urgence Sinistre & Réhabilitation — Support {{company}}",
      heroTitle: "Réactivité Absolue Après Sinistre & Dégâts",
      heroSubtitle: "Assistance d'urgence 24/7, assèchement express, décontamination incendie et réhabilitation intégrale clé en main.",
      primaryCta: "Demander une Intervention 24/7",
      secondaryCta: "Guide Prise en Charge Assurance",
      stat1: { value: "< 30 min", label: "Déplacement sur site" },
      stat2: { value: "100%", label: "Agréé toutes assurances" },
      stat3: { value: "15+ ans", label: "Expertise réhabilitation" },
      servicesTitle: "Services Urgence & Restauration Post-Sinistre",
      servicesSubtitle: "Matériel industriel de pointe pour stopper la dégradation et restaurer vos bâtiments.",
      services: [
        { title: "Assèchement & Dégât des Eaux", desc: "Extraction rapide, pompage et assèchement technique par déshumidification.", icon: "🌊" },
        { title: "Décontamination Incendie", desc: "Nettoyage des suies, traitement des odeurs de brûlé et neutralisation toxique.", icon: "🔥" },
        { title: "Recherche de Fuite Non Destructive", desc: "Détection thermique, gaz traceur et acoustique sans démolir les parois.", icon: "🔍" },
        { title: "Rénovation & Reconstruction", desc: "Plâtrerie, peinture, revêtements et remise à neuf intégrale après sinistre.", icon: "🏗️" }
      ],
      workflowTitle: "Prise en Charge d'Urgence en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Mise en Sécurité Express", desc: "Déplacement immédiat 24/7 pour stopper la fuite ou sécuriser la structure." },
        { step: "02", title: "Bilan Photo & Chiffrage Assurance", desc: "Établissement du rapport d'expertise conforme aux normes assurances." },
        { step: "03", title: "Assèchement & Décontamination", desc: "Mise en place de déshumidificateurs et purificateurs d'air industriels." },
        { step: "04", title: "Restauration Clé en Main", desc: "Travaux de remise en état sans aucune avance de frais selon convention." }
      ],
      whyUsTitle: "Pourquoi Faire Confiance à Notre Équipe ?",
      whyUsPoints: [
        "Prise en charge directe par votre compagnie d'assurance (Convention IRSI/IRCA)",
        "Disponibilité permanente 24h/24 et 7j/7 avec délai d'intervention Garanti",
        "Matériel de détection et d'assèchement thermique de dernière génération",
        "Accompagnement administratif complet pour accélérer vos remboursements"
      ],
      testimonial: {
        quote: "Suite à une fuite majeure dans nos locaux, leur équipe est arrivée en 25 minutes. Assèchement impeccable et gestion directe avec l'assurance !",
        author: "Marc V.",
        role: "Directeur d'Établissement"
      },
      formHeader: "Besoin d'une Intervention d'Urgence ?",
      formSubheader: "Remplissez le formulaire ci-dessous pour un rappel immédiat par un technicien d'astreinte."
    },
    en: {
      subject: "24/7 Emergency Disaster Restoration & Cleanup — {{company}}",
      heroTitle: "Rapid Disaster Restoration & Cleanup",
      heroSubtitle: "24/7 emergency response, water damage extraction, fire soot decontamination, and full structural restoration.",
      primaryCta: "Request 24/7 Emergency Dispatch",
      secondaryCta: "Insurance Claims Guide",
      stat1: { value: "< 30 min", label: "Average Response Time" },
      stat2: { value: "100%", label: "Direct Insurance Billing" },
      stat3: { value: "15+ Yrs", label: "Restoration Mastery" },
      servicesTitle: "Emergency Disaster & Restoration Services",
      servicesSubtitle: "Commercial-grade equipment to mitigate structural damage and rebuild your property.",
      services: [
        { title: "Water Damage & Extraction", desc: "Rapid water removal, structural drying, and industrial dehumidification.", icon: "🌊" },
        { title: "Fire & Smoke Restoration", desc: "Soot removal, toxic residue neutralization, and thermal fogging odor control.", icon: "🔥" },
        { title: "Non-Destructive Leak Detection", desc: "Infrared thermal imaging, acoustic tracing, and moisture mapping.", icon: "🔍" },
        { title: "Complete Reconstruction", desc: "Drywall replacement, painting, flooring, and turnkey property restoration.", icon: "🏗️" }
      ],
      workflowTitle: "Our 4-Step Emergency Response",
      workflowSteps: [
        { step: "01", title: "Immediate Hazard Mitigation", desc: "Rapid 24/7 dispatch to stop active water inflows or secure burned structures." },
        { step: "02", title: "Insurance Claim Dossier", desc: "Itemized photographic audit submitted directly to your insurance adjuster." },
        { step: "03", title: "Drying & Decontamination", desc: "Deployment of HEPA air scrubbers and industrial desiccant dehumidifiers." },
        { step: "04", title: "Turnkey Restoration", desc: "Full reconstruction back to pre-loss condition with zero out-of-pocket hassle." }
      ],
      whyUsTitle: "Why Choose Our Restoration Experts?",
      whyUsPoints: [
        "Direct billing with major insurance providers to eliminate out-of-pocket stress",
        "24/7/365 emergency hotline with guaranteed sub-30 minute local arrival",
        "IICRC certified technicians utilizing advanced thermal moisture detection",
        "Comprehensive documentation ensuring 100% claim approval compliance"
      ],
      testimonial: {
        quote: "When a burst pipe flooded our office, they arrived in 20 minutes. Dryout was fast and they billed our insurance directly!",
        author: "Robert T.",
        role: "Commercial Property Manager"
      },
      formHeader: "Require Immediate Emergency Dispatch?",
      formSubheader: "Submit below for an instant phone callback from our active duty technician."
    }
  },

  plumbing: {
    fr: {
      subject: "Artisan Plombier & Chauffagiste Certifié à {{city}} — Démo pour {{company}}",
      heroTitle: "L'Artisanat d'Excellence en Plomberie & Chauffage",
      heroSubtitle: "Dépannage d'urgence 24/7, création de salles de bain clé en main et installation de systèmes de chauffage à haute performance énergétique.",
      primaryCta: "💬 Échanger avec notre équipe",
      secondaryCta: "💬 Envoyez-nous un message",
      stat1: { value: "24h/24 & 7j/7", label: "Équipe disponible" },
      stat2: { value: "100%", label: "Accueil chaleureux" },
      stat3: { value: "10 ans", label: "Garantie sérénité" },
      servicesTitle: "Des Prestations Complètes & Certifiées",
      servicesSubtitle: "Équipements de marques leaders et finitions soignées pour l'ensemble de vos réseaux sanitaires.",
      services: [
        { title: "Recherche & Réparation de Fuite", desc: "Détection thermique non destructive et colmatage immédiat des canalisations.", icon: "💧" },
        { title: "Création Salle de Bain", desc: "Douches à l'italienne, robinetterie encastrée, carrelage et réseaux sanitaires.", icon: "🛁" },
        { title: "Chauffe-Eau & Pompe à Chaleur", desc: "Pose, remplacement et maintenance de ballons thermodynamiques et PAC RGE.", icon: "🔥" },
        { title: "Débouchage & Hydrocurage", desc: "Désobstruction haute pression de tous conduits et assainissement complet.", icon: "🔧" }
      ],
      workflowTitle: "Notre Méthode d'Intervention en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Diagnostic Téléphonique", desc: "Évaluation immédiate de l'urgence et annonce d'une fourchette tarifaire claire." },
        { step: "02", title: "Déplacement & Devis Préalable", desc: "Arrivée du plombier et validation signée du devis avant tout coup de clé." },
        { step: "03", title: "Réparation & Remplacement", desc: "Intervention propre avec matériel professionnel garanti et conforme aux normes." },
        { step: "04", title: "Contrôle & Nettoyage", desc: "Tests de pression, vérification d'étanchéité et chantier rendu impeccable." }
      ],
      whyUsTitle: "Pourquoi Faire Appel à Nos Artisans ?",
      whyUsPoints: [
        "Transparence tarifaire totale : aucun frais caché ni majoration abusive",
        "Entreprise certifiée RGE QualiPAC & RGE Chauffage pour aides d'État (MaPrimeRénov')",
        "Stock permanent de pièces détachées d'origine dans nos véhicules d'intervention",
        "Garantie pièces et main-d'œuvre assortie d'une assurance décennale française"
      ],
      testimonial: {
        quote: "Intervention en 25 minutes pour un cumulus percé le dimanche matin. Travail très propre et prix totalement respecté !",
        author: "Jean-Marc P.",
        role: "Propriétaire à {{city}}"
      },
      formHeader: "Notre équipe est à votre écoute 24h/24 et 7j/7",
      formSubheader: "Envoyez-nous un court message : nos conseillers vous répondent dans l'instant pour échanger et répondre à vos questions."
    },
    en: {
      subject: "Certified Master Plumbing & Heating Services — Demo for {{company}}",
      heroTitle: "Master Plumbing & Heating Solutions",
      heroSubtitle: "24/7 emergency leak repairs, luxury bathroom renovations, and eco-friendly heat pump installations.",
      primaryCta: "Schedule Emergency Repair",
      secondaryCta: "Get Free Project Quote",
      stat1: { value: "30 min", label: "Average On-Site Arrival" },
      stat2: { value: "100%", label: "Upfront Transparent Fees" },
      stat3: { value: "10 Yrs", label: "Workmanship Warranty" },
      servicesTitle: "Comprehensive Plumbing Services",
      servicesSubtitle: "Premium fixtures and expert installations across residential and commercial properties.",
      services: [
        { title: "Leak Detection & Repair", desc: "Non-destructive infrared camera inspection and permanent pipe sealing.", icon: "💧" },
        { title: "Bathroom Remodeling", desc: "Walk-in showers, custom tiling, concealed valves, and luxury sanitaryware.", icon: "🛁" },
        { title: "Water Heaters & Heat Pumps", desc: "Installation and servicing of tankless systems and energy-efficient heat pumps.", icon: "🔥" },
        { title: "Drain Unblocking & Jetting", desc: "High-pressure water jetting and CCTV drain camera surveys.", icon: "🔧" }
      ],
      workflowTitle: "Our 4-Step Service Process",
      workflowSteps: [
        { step: "01", title: "Phone Diagnostic", desc: "Instant severity check and upfront estimation over the phone." },
        { step: "02", title: "On-Site Inspection", desc: "Arrival of certified plumber and signed agreement before work commences." },
        { step: "03", title: "Expert Repair", desc: "Clean repair using top-tier OEM parts and specialized tools." },
        { step: "04", title: "Pressure Testing & Cleanup", desc: "Strict pressure check, site cleanup, and warranty issuance." }
      ],
      whyUsTitle: "Why Work With Our Plumbing Specialists?",
      whyUsPoints: [
        "Strict upfront pricing policy with no hidden call-out surprises",
        "Licensed & insured technicians carrying fully stocked emergency vans",
        "Energy Efficiency Certified for government rebates and green tax credits",
        "Comprehensive 10-year structural workmanship guarantee"
      ],
      testimonial: {
        quote: "Arrived within 30 minutes on a Sunday to fix a burst water main. Professional, courteous, and very fair pricing!",
        author: "David K.",
        role: "Homeowner in {{city}}"
      },
      formHeader: "Need a Qualified Plumber Today?",
      formSubheader: "Fill out the form below to receive a instant callback or free project quote."
    }
  },

  driving_school: {
    fr: {
      subject: "Permis de Conduire Réussi du 1er Coup — Démo pour {{company}}",
      heroTitle: "Obtenez Votre Permis en Toute Sérénité",
      heroSubtitle: "Formations accélérées, moniteurs diplômés d'État, code de la route 24/7 sur smartphone et taux de réussite exceptionnel.",
      primaryCta: "Réserver une Évaluation Gratuite",
      secondaryCta: "Découvrir nos Formules Permis",
      stat1: { value: "92%", label: "Taux de réussite au permis" },
      stat2: { value: "15 Jours", label: "Formule permis accéléré" },
      stat3: { value: "100%", label: "Moniteurs certifiés d'État" },
      servicesTitle: "Des Formules Adaptées à Votre Rythme",
      servicesSubtitle: "Boîte manuelle ou automatique, cours du soir et accès en ligne illimité.",
      services: [
        { title: "Permis B Traditionnel & Auto", desc: "Apprentissage progressif sur véhicules récents avec votre moniteur référent.", icon: "🚗" },
        { title: "Stage Permis Accéléré", desc: "Passage intensif du code et de la conduite en 15 à 20 jours ouvrés.", icon: "⚡" },
        { title: "Conduite Accompagnée (AAC)", desc: "Accessible dès 15 ans pour acquérir une expérience solide et baisser le coût d'assurance.", icon: "🎓" },
        { title: "Remise en Confiance", desc: "Séances de perfectionnement pour conducteurs souhaitant reprendre le volant sereinement.", icon: "🛣️" }
      ],
      workflowTitle: "Votre Parcours vers le Permis en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Évaluation Initiale Offerte", desc: "Test sur simulateur ou véhicule pour déterminer le volume d'heures idéal." },
        { step: "02", title: "Code en Ligne 24/7", desc: "Accès immédiat à l'application officielle d'entraînement aux questions d'examen." },
        { step: "03", title: "Leçons de Conduite Pro", desc: "Conduite individuelle sur circuits d'examen avec votre formateur dédié." },
        { step: "04", title: "Examen Blanc & Réussite", desc: "Validation lors d'un examen blanc avant présentation rapide à l'épreuve." }
      ],
      whyUsTitle: "Pourquoi Choisir Notre Auto-École ?",
      whyUsPoints: [
        "Moniteur unique dédié tout au long de votre formation pour un suivi optimal",
        "Paiement facilité en 3x, 4x sans frais ou financement CPF et Permis à 1€/jour",
        "Flotte de véhicules récents, climatisés et équipés de doubles commandes modernes",
        "Inscriptions rapides aux sessions d'examen grâce à notre agrément préfectoral"
      ],
      testimonial: {
        quote: "Grâce au stage accéléré, j'ai obtenu mon permis B en 18 jours du premier coup ! Moniteur très pédagogue et rassurant.",
        author: "Antoine B.",
        role: "Élève Permis B"
      },
      formHeader: "Évaluez Votre Niveau Gratuitement",
      formSubheader: "Complétez le formulaire pour réserver votre bilan de conduite offert et sans engagement."
    },
    en: {
      subject: "Pass Your Driving Test First Time — Interactive Demo for {{company}}",
      heroTitle: "Drive SMRT — Master Your Driving License",
      heroSubtitle: "Accelerated driver training, state-certified instructors, 24/7 theory app, and unmatched first-time pass rates.",
      primaryCta: "Book Free Driving Assessment",
      secondaryCta: "View License Packages",
      stat1: { value: "92%", label: "First-Time Pass Rate" },
      stat2: { value: "15 Days", label: "Express Fast-Track Option" },
      stat3: { value: "100%", label: "State-Certified Trainers" },
      servicesTitle: "Custom Driving Packages",
      servicesSubtitle: "Manual & automatic vehicles, flexible evening slots, and smartphone theory access.",
      services: [
        { title: "Standard & Automatic License", desc: "Progressive learning on modern vehicles with a dedicated mentor instructor.", icon: "🚗" },
        { title: "Fast-Track Intensive Course", desc: "Complete theory and practical training within 15 to 20 working days.", icon: "⚡" },
        { title: "Young Driver Mentorship", desc: "Early learning from age 15 to build road confidence and reduce insurance premiums.", icon: "🎓" },
        { title: "Refresher & Confidence Boost", desc: "Specialized sessions for nervous drivers returning to the road.", icon: "🛣️" }
      ],
      workflowTitle: "Your 4-Step Path to Passing",
      workflowSteps: [
        { step: "01", title: "Free Initial Assessment", desc: "Simulator or vehicle test to calculate your precise hour requirements." },
        { step: "02", title: "24/7 Mobile Theory Prep", desc: "Unlimited smartphone access to real exam questions and video mock tests." },
        { step: "03", title: "1-on-1 In-Car Lessons", desc: "Practical driving instruction focused on official test routes." },
        { step: "04", title: "Mock Exam & License Test", desc: "Final trial exam followed by prompt test slot reservation." }
      ],
      whyUsTitle: "Why Train With Our Driving Academy?",
      whyUsPoints: [
        "Dedicated personal instructor throughout your entire learning journey",
        "Flexible installment plans, government student grants, and 0% interest funding",
        "Modern fleet of dual-control, air-conditioned hybrid and electric vehicles",
        "Fast-track test slot bookings via our official government registry status"
      ],
      testimonial: {
        quote: "Passed my practical test on the first try after taking the 2-week intensive course. Instructor was patient and clear!",
        author: "Jessica M.",
        role: "Student Driver"
      },
      formHeader: "Book Your Free Driving Evaluation",
      formSubheader: "Fill out the form below to claim your complimentary skills assessment."
    }
  },

  electrical: {
    fr: {
      subject: "Mise aux Normes Électriques & Domotique — Support {{company}}",
      heroTitle: "Votre Sécurité Électrique Entre Mains d'Experts",
      heroSubtitle: "Installations électriques certifiées NF C 15-100, bornes de recharge IRVE pour véhicules électriques et domotique sur mesure.",
      primaryCta: "Demander un Diagnostic Électrique",
      secondaryCta: "Devis Borne IRVE & Domotique",
      stat1: { value: "100%", label: "Conforme norme NF C 15-100" },
      stat2: { value: "24/7", label: "Dépannage urgence panne" },
      stat3: { value: "10 ans", label: "Garantie décennale" },
      servicesTitle: "Solutions Électriques Industrielles & Résidentielles",
      servicesSubtitle: "Matériel certifié Schneider & Legrand pour des installations sécurisées et pérennes.",
      services: [
        { title: "Tableau & Remise aux Normes", desc: "Remplacement de tableau vétuste, disjoncteurs différentiels et sécurisation.", icon: "⚡" },
        { title: "Bornes de Recharge (IRVE)", desc: "Installation certifiée de bornes Wallbox rapides à domicile et en entreprise.", icon: "🔌" },
        { title: "Domotique & Éclairage LED", desc: "Commandes à distance, scénarios d'éclairage et gestion optimale de l'énergie.", icon: "💡" },
        { title: "Dépannage Urgence 24/7", desc: "Recherche de court-circuit, remise en route et sécurisation après panne.", icon: "🚨" }
      ],
      workflowTitle: "Déroulement de Votre Chantier en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Audit & Bilan Sécurité", desc: "Inspection complète de votre installation existante et repérage des risques." },
        { step: "02", title: "Devis Détaillé Transparent", desc: "Proposition claire chiffrant les appareillages et le temps de main-d'œuvre." },
        { step: "03", title: "Travaux & Câblage Soigné", desc: "Pose dans les règles de l'art avec saignées propres ou goulottes discrètes." },
        { step: "04", title: "Mise en Service & Attestation", desc: "Tests de terre, mesure de résistance et délivrance du certificat Consuel." }
      ],
      whyUsTitle: "Pourquoi Nous Confier Vos Travaux Électriques ?",
      whyUsPoints: [
        "Artisans certifiés IRVE & Qualifelec garants d'un travail aux normes nationales",
        "Composants électriques haut de gamme de marques reconnues (Legrand, Schneider, Hager)",
        "Nettoyage méthodique du chantier en fin d'intervention",
        "Devis gratuit sans engagement et tarifs fixes sans hausse imprévue"
      ],
      testimonial: {
        quote: "Remplacement complet de notre tableau électrique et pose d'une borne Wallbox. Travail d'une précision remarquable !",
        author: "Philippe D.",
        role: "Client Résidentiel"
      },
      formHeader: "Demandez Votre Diagnostic Électrique",
      formSubheader: "Remplissez le formulaire pour recevoir une estimation personnalisée sous 24h."
    },
    en: {
      subject: "Certified Electrical & Smart Home Engineering — Demo for {{company}}",
      heroTitle: "Master Electrical Engineering & Smart Automation",
      heroSubtitle: "Certified electrical panel upgrades, EV Wallbox charger installations, and custom smart building automation.",
      primaryCta: "Request Electrical Audit",
      secondaryCta: "Get EV Charger Quote",
      stat1: { value: "100%", label: "National Code Compliance" },
      stat2: { value: "24/7", label: "Emergency Outage Dispatch" },
      stat3: { value: "10 Yrs", label: "Electrical Warranty" },
      servicesTitle: "Residential & Commercial Electrical Services",
      servicesSubtitle: "Industry-certified components ensuring long-term power stability and safety.",
      services: [
        { title: "Panel Upgrades & Rewiring", desc: "Breaker panel replacements, surge protection, and safety grounding.", icon: "⚡" },
        { title: "EV Charger Installation (IRVE)", desc: "Certified fast-charging Wallbox installations for homes and commercial fleets.", icon: "🔌" },
        { title: "Smart Home & Architectural LED", desc: "Automated lighting scenes, smart switches, and energy management.", icon: "💡" },
        { title: "24/7 Emergency Repairs", desc: "Rapid troubleshooting for power cuts, short circuits, and faulty wiring.", icon: "🚨" }
      ],
      workflowTitle: "Our 4-Step Electrical Process",
      workflowSteps: [
        { step: "01", title: "Safety Inspection & Audit", desc: "Comprehensive thermal scan and wiring analysis of your property." },
        { step: "02", title: "Transparent Estimate", desc: "Itemized quote outlining hardware, cable runs, and labor hours." },
        { step: "03", title: "Clean Installation", desc: "Precision wiring, wall chasing, and dust-controlled installation." },
        { step: "04", title: "Testing & Certification", desc: "Ground resistance testing and formal safety certification issuance." }
      ],
      whyUsTitle: "Why Hire Our Master Electricians?",
      whyUsPoints: [
        "Fully licensed, bonded, and EVITP/IRVE certified electrical engineers",
        "Premium tier hardware strictly sourced from Schneider, Siemens, and Eaton",
        "Strict dust containment and post-job site sanitization",
        "Upfront flat-rate pricing with zero surprise charges"
      ],
      testimonial: {
        quote: "Upgraded our outdated 100A panel and added a dual EV charger. Professional, clean, and passed inspection immediately!",
        author: "Michael C.",
        role: "Commercial Director"
      },
      formHeader: "Request Your Electrical Assessment",
      formSubheader: "Complete the short form below for a fast, free estimate."
    }
  },

  locksmith: {
    fr: {
      subject: "Serrurerie de Sécurité & Dépannage 24/7 — Support {{company}}",
      heroTitle: "Dépannage Serrurerie 24/7 & Haute Sécurité",
      heroSubtitle: "Ouverture de porte sans dégât, installation de serrures multipoints A2P et blindage de porte agréé assurances.",
      primaryCta: "Appeler un Serrurier en Urgence",
      secondaryCta: "Devis Sécurisation & Blindage",
      stat1: { value: "< 20 min", label: "Délai moyen d'intervention" },
      stat2: { value: "100%", label: "Agréé par les assurances" },
      stat3: { value: "0 Dégât", label: "Technique d'ouverture fine" },
      servicesTitle: "Protections & Interventions de Sécurité",
      servicesSubtitle: "Matériel certifié A2P anti-effraction pour protéger ce qui vous est cher.",
      services: [
        { title: "Ouverture de Porte 24/7", desc: "Porte claquée ou fermée à clé, déblocage propre sans abîmer le dormant.", icon: "🔑" },
        { title: "Serrure A2P Multipoints", desc: "Pose de serrures de haute sécurité 3, 5 ou 7 points d'ancrage certifiées.", icon: "🔒" },
        { title: "Blindage & Bloc-Porte", desc: "Renforcement de porte existante ou pose de porte blindée sur-mesure.", icon: "🛡️" },
        { title: "Fermeture Provisoire", desc: "Sécurisation immédiate suite à effraction ou tentative de cambriolage.", icon: "🚨" }
      ],
      workflowTitle: "Intervention d'Urgence en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Appel & Annonce du Tarif", desc: "Confirmation immédiate du prix fixe au téléphone avant déplacement." },
        { step: "02", title: "Arrivée Express sur Site", desc: "Intervention du serrurier en moins de 20 minutes avec véhicule équipé." },
        { step: "03", title: "Ouverture Fine Sans Casse", desc: "Utilisation de pistolet de crochetage ou radio pour préserver votre porte." },
        { step: "04", title: "Facture Agréée Assurance", desc: "Délivrance du document officiel pour prise en charge remboursement." }
      ],
      whyUsTitle: "Pourquoi Faire Confiance à Nos Serruriers ?",
      whyUsPoints: [
        "Tarifs annoncés au téléphone et strictement respectés : aucune arnaque",
        "Agréé par l'ensemble des compagnies d'assurance françaises (MAMDA, AXA, MAIF...)",
        "Serrures certifiées A2P 1, 2 ou 3 étoiles résistant aux tentatives d'arrachage",
        "Service d'astreinte garanti 365 jours par an, week-ends et jours fériés inclus"
      ],
      testimonial: {
        quote: "Porte claquée avec les clés à l'intérieur à 23h. Serrurier arrivé en 15 minutes, ouverture en 2 minutes sans rien abîmer. Tarif très raisonnable !",
        author: "Valérie G.",
        role: "Habitante à {{city}}"
      },
      formHeader: "Besoin d'un Dépannage ou d'un Blindage ?",
      formSubheader: "Complétez le formulaire ci-dessous pour une demande urgente ou un devis gratuit."
    },
    en: {
      subject: "24/7 Emergency Locksmith & Door Armoring — Demo for {{company}}",
      heroTitle: "24/7 Emergency Locksmith & High Security",
      heroSubtitle: "Damage-free door opening, A2P high-security multi-point locks, and insurance-approved door armoring.",
      primaryCta: "Request Emergency Locksmith",
      secondaryCta: "Get Security & Armoring Quote",
      stat1: { value: "< 20 min", label: "Average On-Site Arrival" },
      stat2: { value: "100%", label: "Insurance Partner Approved" },
      stat3: { value: "Zero Damage", label: "Non-Destructive Entry" },
      servicesTitle: "Emergency Locksmith & Fortification Services",
      servicesSubtitle: "Certified anti-pick, anti-drill locksets to safeguard your family and business.",
      services: [
        { title: "24/7 Lockout Service", desc: "Damage-free opening for locked or slammed doors using precision tools.", icon: "🔑" },
        { title: "Multi-Point Security Locks", desc: "Installation of 3, 5, or 7-point heavy duty security deadbolts.", icon: "🔒" },
        { title: "Door Armoring & Steel Frame", desc: "Reinforcing existing doors or installing custom armored security doors.", icon: "🛡️" },
        { title: "Post-Burglary Securing", desc: "Emergency lock replacement and temporary board-up following break-ins.", icon: "🚨" }
      ],
      workflowTitle: "Our 4-Step Emergency Locksmith Process",
      workflowSteps: [
        { step: "01", title: "Upfront Phone Quote", desc: "Clear flat-rate fee confirmed on the call before dispatch." },
        { step: "02", title: "Rapid Mobile Arrival", desc: "Technician arrives within 20 minutes in a fully equipped service vehicle." },
        { step: "03", title: "Precision Lock Picking", desc: "Non-destructive entry preservation techniques saving your original door." },
        { step: "04", title: "Insurance Receipt", desc: "Issuance of formal documentation for insurance reimbursement claims." }
      ],
      whyUsTitle: "Why Choose Our Locksmith Specialists?",
      whyUsPoints: [
        "Guaranteed upfront pricing policy — what we quote over the phone is what you pay",
        "Official partner for major insurance companies and property management groups",
        "High-security drill-proof, pick-proof, and bump-proof lock cylinders",
        "365 days a year active emergency hotline including holidays and late nights"
      ],
      testimonial: {
        quote: "Locked out late at night. The locksmith arrived in 15 minutes and opened the door in under two minutes without a single scratch!",
        author: "Elena R.",
        role: "Resident in {{city}}"
      },
      formHeader: "Require Locksmith Assistance or Quote?",
      formSubheader: "Submit the form below for immediate dispatch or a free security audit."
    }
  },

  law_firm: {
    fr: {
      subject: "Conseil Juridique & Stratégie Contentieuse — Support {{company}}",
      heroTitle: "Rigueur Juridique & Stratégie d'Exception",
      heroSubtitle: "Accompagnement sur-mesure en droit des affaires, droit du travail, contentieux commercial et négociation stratégique.",
      primaryCta: "Prendre RDV avec un Avocat",
      secondaryCta: "Découvrir nos Domaines d'Intervention",
      stat1: { value: "98%", label: "Dossiers résolus avec succès" },
      stat2: { value: "100%", label: "Confidentialité absolue (Secret Pro)" },
      stat3: { value: "15+ ans", label: "Expertise du Barreau" },
      servicesTitle: "Expertises Juridiques Pliées à Vos Ambitions",
      servicesSubtitle: "Un cabinet indépendant dédié à la défense rigoureuse de vos intérêts stratégiques.",
      services: [
        { title: "Droit des Affaires & Sociétés", desc: "Création, fusions-acquisitions, rédaction de contrats commerciaux et baux.", icon: "⚖️" },
        { title: "Droit du Travail & Social", desc: "Conseil RH, négociation de ruptures conventionnelles et défense aux Prud'hommes.", icon: "📜" },
        { title: "Droit Immobilier & Construction", desc: "Contentieux locatifs, litiges de construction, copropriété et urbanisme.", icon: "🏛️" },
        { title: "Gestion des Litiges & Arbitrage", desc: "Plaidoiries devant les tribunaux de commerce et règlements amiables.", icon: "🛡️" }
      ],
      workflowTitle: "Notre Méthode d'Accompagnement en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Consultation Initiale Confidential", desc: "Analyse approfondie des pièces de votre dossier et qualification du risque." },
        { step: "02", title: "Stratégie Juridique Sur-Mesure", desc: "Élaboration de la ligne de défense ou du plan de négociation le plus avantageux." },
        { step: "03", title: "Rédaction d'Actes & Procédure", desc: "Rédaction rigoureuse des conclusions, assignations ou contrats d'affaires." },
        { step: "04", title: "Plaidoirie & Suivi d'Exécution", desc: "Représentation devant les juridictions et exécution forcée des décisions." }
      ],
      whyUsTitle: "Pourquoi Faire Confiance à Notre Cabinet ?",
      whyUsPoints: [
        "Réactivité sous 24h pour toute demande de consultation urgente",
        "Transparence totale des honoraires avec convention de paiement au forfait ou au temps passé",
        "Approche pragmatique orientée business et résolution rapide des conflits",
        "Secret professionnel absolu et indépendance déontologique garantie"
      ],
      testimonial: {
        quote: "Un accompagnement décisif lors de la restructuration de notre société. Conseils limpides, réactivité sans faille et négociation brillante.",
        author: "Maître François H.",
        role: "Fondateur Groupe Industriel"
      },
      formHeader: "Sollicitez une Consultation Juridique",
      formSubheader: "Remplissez le formulaire confidentiel pour échanger directement avec un avocat du cabinet."
    },
    en: {
      subject: "Strategic Legal Counsel & Advocacy — Demo for {{company}}",
      heroTitle: "Excellence in Legal Strategy & Advocacy",
      heroSubtitle: "Bespoke legal advisory in corporate law, commercial litigation, employment disputes, and strategic negotiations.",
      primaryCta: "Schedule Legal Consultation",
      secondaryCta: "View Practice Areas",
      stat1: { value: "98%", label: "Successful Case Resolution" },
      stat2: { value: "100%", label: "Strict Attorney-Client Privilege" },
      stat3: { value: "15+ Yrs", label: "Bar Association Expertise" },
      servicesTitle: "Comprehensive Practice Areas",
      servicesSubtitle: "An independent law firm dedicated to defending your commercial and private interests.",
      services: [
        { title: "Corporate Law & M&A", desc: "Entity structuring, mergers and acquisitions, shareholder agreements, and contracts.", icon: "⚖️" },
        { title: "Employment & Labor Disputes", desc: "Executive severance negotiations, HR advisory, and tribunal representation.", icon: "📜" },
        { title: "Real Estate & Construction Law", desc: "Commercial lease disputes, construction defect litigation, and land use.", icon: "🏛️" },
        { title: "Commercial Litigation", desc: "High-stakes court representation, breach of contract claims, and arbitration.", icon: "🛡️" }
      ],
      workflowTitle: "Our 4-Step Legal Framework",
      workflowSteps: [
        { step: "01", title: "Privileged Consultation", desc: "Thorough review of evidence, contracts, and legal risk exposure." },
        { step: "02", title: "Strategic Roadmap", desc: "Formulating a high-leverage negotiation plan or litigation strategy." },
        { step: "03", title: "Pleadings & Drafting", desc: "Precision legal drafting of claims, motions, and commercial agreements." },
        { step: "04", title: "Advocacy & Execution", desc: "Relentless representation in court or binding settlement enforcement." }
      ],
      whyUsTitle: "Why Work With Our Legal Partners?",
      whyUsPoints: [
        "Guaranteed 24-hour response window for all priority legal emergencies",
        "Transparent fee engagement agreements — fixed-rate or capped hourly billing",
        "Pragmatic business-first strategy aimed at swift, cost-effective dispute resolution",
        "Uncompromising adherence to attorney-client privilege and ethical standards"
      ],
      testimonial: {
        quote: "Crucial guidance during our corporate acquisition. Clear explanations, formidable contract drafting, and exceptional negotiation!",
        author: "Charles W.",
        role: "Managing Director"
      },
      formHeader: "Request a Confidential Consultation",
      formSubheader: "Complete the form below to connect directly with a senior partner."
    }
  },

  general: {
    fr: {
      subject: "Solutions D'Excellence & Accompagnement Sur-Mesure — Support {{company}}",
      heroTitle: "L'Excellence Opérationnelle au Service de Votre Réussite",
      heroSubtitle: "Services professionnels sur-mesure, réactivité garantie et accompagnement personnalisé pour propulser tous vos projets.",
      primaryCta: "Obtenir un Devis Gratuit",
      secondaryCta: "En Savoir Plus",
      stat1: { value: "99%", label: "Satisfaction client globale" },
      stat2: { value: "24h", label: "Délai de réponse garanti" },
      stat3: { value: "100%", label: "Engagement qualité & suivi" },
      servicesTitle: "Des Services Professionnels de Premier Ordre",
      servicesSubtitle: "Une méthodologie rigoureuse au service des entreprises et particuliers exigeants.",
      services: [
        { title: "Conseil & Stratégie Sur-Mesure", desc: "Analyse approfondie de vos besoins et élaboration de solutions performantes.", icon: "🚀" },
        { title: "Gestion & Exécution de Projets", desc: "Prise en charge intégrale de la planification à la livraison finale.", icon: "📊" },
        { title: "Support & Assistance Dédiée", desc: "Interlocuteur unique à votre écoute pour un suivi régulier et personnalisé.", icon: "🤝" },
        { title: "Audit & Optimisation", desc: "Analyse des processus et recommandations pour maximiser vos résultats.", icon: "⚡" }
      ],
      workflowTitle: "Notre Méthode en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Étude de Votre Besoin", desc: "Échange approfondi pour cerner vos objectifs et contraintes." },
        { step: "02", title: "Plan d'Action Personnalisé", desc: "Établissement d'un devis clair et d'un calendrier précis d'exécution." },
        { step: "03", title: "Mise en Œuvre Méticuleuse", desc: "Réalisation des prestations dans le respect strict des engagements." },
        { step: "04", title: "Suivi & Garantie de Résultats", desc: "Validation de fin de mission et accompagnement continu." }
      ],
      whyUsTitle: "Un accompagnement continu pour transformer votre activité",
      whyUsPoints: [
        "Nous vous apportons l'aide nécessaire pour convertir vos prospects, capturer chaque appel manqué et automatiser le suivi à chaque étape.",
        "Un gain de temps considérable au quotidien pour rendre votre travail plus fluide, efficace et vous concentrer sur votre cœur de métier.",
        "Essai en toute sérénité : vous pouvez tester notre solution et annuler à tout moment si besoin, sans engagement ni problème."
      ],
      testimonial: {
        quote: "Un partenaire de grande confiance. Rigueur, professionnalisme et respect des délais sur l'ensemble de nos demandes.",
        author: "Sophie M.",
        role: "Cliente Partenaire à {{city}}"
      },
      formHeader: "Discutons de Votre Projet",
      formSubheader: "Remplissez le formulaire ci-dessous pour recevoir une étude personnalisée et gratuite."
    },
    en: {
      subject: "Professional Solutions & Service Excellence — Demo for {{company}}",
      heroTitle: "Operational Excellence Tailored to Your Success",
      heroSubtitle: "Customized professional services, guaranteed responsiveness, and dedicated support for all your operational goals.",
      primaryCta: "Request Free Consultation",
      secondaryCta: "Learn More",
      stat1: { value: "99%", label: "Client Satisfaction Rate" },
      stat2: { value: "24h", label: "Guaranteed Response Window" },
      stat3: { value: "100%", label: "Quality Assurance Commitment" },
      servicesTitle: "Premier Professional Services",
      servicesSubtitle: "A disciplined, goal-oriented methodology tailored for demanding businesses and individuals.",
      services: [
        { title: "Strategy & Consultation", desc: "In-depth analysis of your objectives and formulation of actionable solutions.", icon: "🚀" },
        { title: "Turnkey Project Execution", desc: "Full end-to-end management from initial planning to final delivery.", icon: "📊" },
        { title: "Dedicated Support Specialist", desc: "Single point of contact providing continuous, hands-on communication.", icon: "🤝" },
        { title: "Audit & Performance Optimization", desc: "Systematic review and recommendations to maximize efficiency.", icon: "⚡" }
      ],
      workflowTitle: "Our 4-Step Process",
      workflowSteps: [
        { step: "01", title: "Requirements Gathering", desc: "Deep-dive discussion to define scope, goals, and key deliverables." },
        { step: "02", title: "Tailored Action Plan", desc: "Clear itemized proposal with explicit timelines and transparent pricing." },
        { step: "03", title: "Precision Execution", desc: "High-standard delivery meeting every milestone seamlessly." },
        { step: "04", title: "Quality Audit & Sign-off", desc: "Final verification ensuring 100% satisfaction and ongoing support." }
      ],
      whyUsTitle: "Dedicated Support to Convert Leads & Streamline Work",
      whyUsPoints: [
        "We provide hands-on assistance to convert leads, capture every missed call, and automate client follow-ups every step of the way.",
        "Save significant time daily to make your operations smoother, highly efficient, and focused on what matters most.",
        "Try risk-free: experience our platform with complete peace of mind and cancel anytime if needed without any hassle."
      ],
      testimonial: {
        quote: "An exceptionally reliable team. Professionalism, attention to detail, and flawless execution on every assignment.",
        author: "Mark S.",
        role: "Managing Director"
      },
      formHeader: "Let's Discuss Your Next Initiative",
      formSubheader: "Complete the short form below to receive a complimentary custom proposal."
    }
  },
  real_estate: {
    fr: {
      subject: "Visite immobilière & gestion de vos prospects pour {{company}}",
      heroTitle: "L'immobilier connecté & hyper réactif",
      heroSubtitle: "Captation de chaque prospect acquéreur ou locataire, organisation automatique des visites et relance instantanée des demandes.",
      primaryCta: "Découvrir la démonstration",
      secondaryCta: "Planifier un échange",
      stat1: { value: "100%", label: "Demandes de visite capturées" },
      stat2: { value: "< 2 min", label: "Temps de réponse prospect" },
      stat3: { value: "x2.5", label: "Mandats & visites concrétisés" },
      servicesTitle: "Solutions dédiées aux agences immobilières",
      servicesSubtitle: "Accélérez vos transactions et qualifiez vos prospects acquéreurs sans perdre de temps.",
      services: [
        { title: "Gestion des Visites", desc: "Planification automatique des visites sur les biens disponibles.", icon: "🔑" },
        { title: "Relance Acquéreurs", desc: "Suivi personnalisé et réponses instantanées WhatsApp/Email.", icon: "📲" },
        { title: "Qualification de Dossier", desc: "Collecte préalable des critères d'achat et dossiers locataires.", icon: "📂" },
        { title: "Estimation & Mandats", desc: "Prise de rendez-vous automatique pour l'estimation de biens.", icon: "🏠" }
      ],
      workflowTitle: "Un processus fluide en 4 étapes",
      workflowSteps: [
        { step: "01", title: "Demande Prospect", desc: "Le prospect demande des détails sur un bien sur votre site ou portail." },
        { step: "02", title: "Réponse Instantanée", desc: "Transmission des informations du bien et proposition de créneaux." },
        { step: "03", title: "Confirmation de Visite", desc: "Validation de la date de visite et envoi de la fiche récapitulative." },
        { step: "04", title: "Suivi & Offre", desc: "Relance automatique post-visite pour recueillir les offres d'achat." }
      ],
      whyUsTitle: "Un accompagnement continu pour transformer votre activité",
      whyUsPoints: [
        "Nous vous apportons l'aide nécessaire pour convertir vos prospects, capturer chaque appel manqué et automatiser le suivi à chaque étape.",
        "Un gain de temps considérable au quotidien pour rendre votre travail plus fluide, efficace et vous concentrer sur votre cœur de métier.",
        "Essai en toute sérénité : vous pouvez tester notre solution et annuler à tout moment si besoin, sans engagement ni problème."
      ],
      testimonial: {
        quote: "Grâce à cette automatisation, nous ne ratons plus aucun appel d'acquéreur. Les visites sont qualifiées et notre taux de concrétisation a bondi.",
        author: "Marc V.",
        role: "Directeur d'Agence Immobilière"
      },
      formHeader: "Testez la démonstration immobilière",
      formSubheader: "Découvrez comment convertir 100% de vos demandes de visite en transactions."
    },
    en: {
      subject: "Property Visit Automation & Lead Conversion for {{company}}",
      heroTitle: "Connected & High-Speed Real Estate Operations",
      heroSubtitle: "Capture every buyer and tenant inquiry, schedule property visits automatically, and follow up instantly.",
      primaryCta: "Explore Interactive Demo",
      secondaryCta: "Schedule a Quick Call",
      stat1: { value: "100%", label: "Lead Capture Rate" },
      stat2: { value: "< 2 mins", label: "Inquiry Response Time" },
      stat3: { value: "x2.5", label: "Closed Visits & Listings" },
      servicesTitle: "Solutions Built for Real Estate Agencies",
      servicesSubtitle: "Accelerate property deals and qualify buyers without spending hours on phone tag.",
      services: [
        { title: "Visit Scheduling", desc: "Automated booking for property showings and open houses.", icon: "🔑" },
        { title: "Buyer Follow-Up", desc: "Instant WhatsApp and Email replies with property brochures.", icon: "📲" },
        { title: "Lead Qualification", desc: "Pre-screen buyer budget and tenant application files.", icon: "📂" },
        { title: "Valuation Requests", desc: "Automate appointments for property seller valuations.", icon: "🏠" }
      ],
      workflowTitle: "Seamless 4-Step Process",
      workflowSteps: [
        { step: "01", title: "Lead Inquiry", desc: "Prospective buyer requests property details from your listing." },
        { step: "02", title: "Instant Information", desc: "Bot sends listing details and proposes available showing slots." },
        { step: "03", title: "Showing Confirmation", desc: "Confirmation sent with address, agent details, and calendar sync." },
        { step: "04", title: "Post-Showing Follow-Up", desc: "Automated check-in to collect buyer feedback and purchase offers." }
      ],
      whyUsTitle: "Dedicated Support to Convert Leads & Streamline Work",
      whyUsPoints: [
        "We provide hands-on assistance to convert leads, capture every missed call, and automate client follow-ups every step of the way.",
        "Save significant time daily to make your operations smoother, highly efficient, and focused on what matters most.",
        "Try risk-free: experience our platform with complete peace of mind and cancel anytime if needed without any hassle."
      ],
      testimonial: {
        quote: "We no longer miss buyer calls during property showings. Visits are pre-screened and our deal velocity doubled.",
        author: "Mark V.",
        role: "Real Estate Broker"
      },
      formHeader: "Experience the Real Estate Demo",
      formSubheader: "See how to convert 100% of property inquiries into active showings."
    }
  }
};

/**
 * Resolves lead category / sector string to one of the canonical NicheTypes
 */
export function resolveNicheType(nicheInput?: string): NicheType {
  if (!nicheInput) return 'general';
  const kw = nicheInput.toLowerCase();

  if (kw.includes('immo') || kw.includes('estate') || kw.includes('logement') || kw.includes('foncier') || kw.includes('realt') || kw.includes('agence')) {
    return 'real_estate';
  }
  if (kw.includes('restau') || kw.includes('traiteur') || kw.includes('caterer') || kw.includes('food') || kw.includes('bistro') || kw.includes('brasserie') || kw.includes('cafe')) {
    return 'restaurant';
  }
  if (kw.includes('sinistre') || kw.includes('disaster') || kw.includes('restoration') || kw.includes('incendie') || kw.includes('dégât') || kw.includes('flood') || kw.includes('water damage')) {
    return 'disaster_restoration';
  }
  if (kw.includes('plomb') || kw.includes('plumb') || kw.includes('chauffa') || kw.includes('heat') || kw.includes('pipe') || kw.includes('leak')) {
    return 'plumbing';
  }
  if (kw.includes('auto') || kw.includes('ecole') || kw.includes('école') || kw.includes('driv') || kw.includes('permis') || kw.includes('license')) {
    return 'driving_school';
  }
  if (kw.includes('electr') || kw.includes('électr') || kw.includes('domoti') || kw.includes('irve') || kw.includes('wallbox') || kw.includes('wire')) {
    return 'electrical';
  }
  if (kw.includes('serrur') || kw.includes('lock') || kw.includes('blindage') || kw.includes('a2p') || kw.includes('porte')) {
    return 'locksmith';
  }
  if (kw.includes('avocat') || kw.includes('law') || kw.includes('jurid') || kw.includes('legal') || kw.includes('barreau') || kw.includes('droit')) {
    return 'law_firm';
  }

  return 'general';
}

/**
 * Replaces dynamic variables in text template
 */
export function interpolateVariables(text: string, vars: Record<string, string>): string {
  if (!text) return '';
  let result = text;
  for (const [k, v] of Object.entries(vars)) {
    const reg = new RegExp(`{{\\s*${k}\\s*}}`, 'gi');
    result = result.replace(reg, v || '');
  }
  return result;
}

/**
 * Returns sector-coherent WhatsApp and Email generator conversations
 */
export function getNicheConversations(
  nicheType: NicheType,
  company: string,
  cityPhrase: string,
  lang: Language = 'fr'
) {
  const isFr = lang === 'fr';

  switch (nicheType) {
    case 'real_estate':
      return {
        whatsappCustomer: isFr 
          ? `Bonjour, l'appartement aperçu sur votre site est-il toujours disponible pour une visite ?`
          : `Hello, is the property listed on your website still available for a visit?`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Oui, ce bien est actuellement disponible chez ${company}. Nous organisons plusieurs visites cette semaine.`
          : `Hello! Yes, this property is available at ${company}. We are scheduling visits this week.`,
        whatsappBotQuestion: isFr
          ? `Pourriez-vous nous indiquer vos disponibilités ainsi que la référence du bien ou votre budget mensuel ?`
          : `Could you let us know your availability and preferred move-in timeline?`,
        emailSubject: isFr
          ? `Visite & dossier d'information pour votre bien - ${company}`
          : `Property details and visit schedule - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, suite à votre demande concernant nos logements disponibles chez ${company}, voici la fiche détaillée et la liste des créneaux de visite.`
          : `Hello, following your inquiry about our available properties at ${company}, here is the detailed datasheet and visit schedule.`
      };

    case 'law_firm':
      return {
        whatsappCustomer: isFr 
          ? `Bonjour, je cherche un avocat spécialisé pour un conseil juridique rapide.`
          : `Hello, I am looking for an attorney for a quick legal consultation.`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Le cabinet ${company} vous accompagne dans l'ensemble de vos démarches juridiques.`
          : `Hello! ${company} is available to guide you through your legal proceedings.`,
        whatsappBotQuestion: isFr
          ? `Pourriez-vous nous préciser brièvement le domaine (droit des affaires, immobilier, famille...) afin de planifier une consultation ?`
          : `Could you briefly specify the practice area (business law, real estate, family...) to schedule a consultation?`,
        emailSubject: isFr
          ? `Demande de consultation juridique - Cabinet ${company}`
          : `Legal consultation request - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, nous avons bien reçu votre demande de prise de contact avec le cabinet ${company}. Voici nos disponibilités de consultation.`
          : `Hello, we received your inquiry with ${company}. Here is our lawyer consultation schedule.`
      };

    case 'restaurant':
      return {
        whatsappCustomer: isFr
          ? `Bonjour, avez-vous une table pour 4 personnes disponible ce samedi à 20h ?`
          : `Hello, do you have a table for 4 available this Saturday at 8 PM?`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Oui, nous avons encore quelques tables disponibles ce samedi soir chez ${company}.`
          : `Hello! Yes, we still have a few tables open this Saturday evening at ${company}.`,
        whatsappBotQuestion: isFr
          ? `Préférez-vous une table en salle principale ou en terrasse pour votre réservation ?`
          : `Would you prefer a table in the main dining room or on the terrace?`,
        emailSubject: isFr
          ? `Confirmation de votre réservation chez ${company}`
          : `Table reservation confirmation - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, votre table pour 4 personnes ce samedi à 20h chez ${company} est bien confirmée. Au plaisir de vous recevoir !`
          : `Hello, your table for 4 people this Saturday at 8 PM at ${company} is confirmed. We look forward to welcoming you!`
      };

    case 'plumbing':
      return {
        whatsappCustomer: isFr
          ? `Bonjour, j'ai une fuite d'eau sous mon évier, pouvez-vous faire intervenir un plombier rapidement ?`
          : `Hello, I have a water leak under my kitchen sink, can a plumber come take a look today?`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Tout à fait, un plombier certifié de ${company} peut intervenir dans votre secteur.`
          : `Hello! Absolutely, a certified plumber from ${company} can assist you in your area today.`,
        whatsappBotQuestion: isFr
          ? `Pourriez-vous nous indiquer votre ville et m'envoyer une photo de la fuite pour estimer le besoin ?`
          : `Could you share your address and a quick picture of the leak so we can prepare the intervention?`,
        emailSubject: isFr
          ? `Votre devis de dépannage plomberie - ${company}`
          : `Your plumbing service estimate - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, suite à votre demande concernant votre problème de plomberie, voici votre devis d'intervention préparé par ${company}.`
          : `Hello, regarding your plumbing issue, here is your detailed service estimate prepared by ${company}.`
      };

    case 'electrical':
      return {
        whatsappCustomer: isFr
          ? `Bonjour, mon tableau électrique a disjoncté et je n'ai plus de courant. Un technicien peut-il passer ?`
          : `Hello, my circuit breaker tripped and I have no power. Can a technician inspect my installation?`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Oui, un électricien de ${company} est disponible pour un diagnostic à domicile.`
          : `Hello! Yes, an electrician from ${company} is available for an on-site diagnosis.`,
        whatsappBotQuestion: isFr
          ? `Merci de nous préciser votre adresse exacte afin d'envoyer l'artisan le plus proche.`
          : `Please share your exact address so we can dispatch the nearest technician.`,
        emailSubject: isFr
          ? `Intervention électrique & diagnostic - ${company}`
          : `Electrical repair & diagnosis - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, suite à votre demande de dépannage électrique, l'équipe de ${company} vous confirme les modalités d'intervention.`
          : `Hello, regarding your electrical troubleshooting request, the team at ${company} confirms our technician dispatch.`
      };

    case 'locksmith':
      return {
        whatsappCustomer: isFr
          ? `Bonjour, j'ai claqué ma porte et laissé mes clés à l'intérieur. Quel est le délai d'intervention ?`
          : `Hello, I locked myself out and left my keys inside. How fast can a locksmith arrive?`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Pas d'inquiétude, un serrurier de ${company} peut se déplacer rapidement chez vous.`
          : `Hello! No worries, a locksmith from ${company} can arrive at your location within 30 minutes.`,
        whatsappBotQuestion: isFr
          ? `Pouvez-vous nous indiquer votre adresse exacte et si la porte est simplement claquée ou verrouillée ?`
          : `Could you confirm your address and whether the door is simply slammed or locked key-wise?`,
        emailSubject: isFr
          ? `Intervention d'urgence serrurerie - ${company}`
          : `Emergency locksmith service - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, un technicien de ${company} a bien pris en compte votre demande d'ouverture de porte.`
          : `Hello, a technician from ${company} is handling your door opening request.`
      };

    case 'driving_school':
      return {
        whatsappCustomer: isFr
          ? `Bonjour, proposez-vous des créneaux de conduite rapide ou un stage accéléré ce mois-ci ?`
          : `Hello, do you have fast-track driving lesson slots or an intensive course available this month?`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Oui, l'auto-école ${company} dispose de créneaux ouverts pour des formations accélérées.`
          : `Hello! Yes, ${company} Driving Academy has open slots for accelerated driving courses.`,
        whatsappBotQuestion: isFr
          ? `Souhaitez-vous une formation sur véhicule en boîte manuelle ou en boîte automatique ?`
          : `Would you prefer training in a manual or automatic vehicle?`,
        emailSubject: isFr
          ? `Votre calendrier d'évaluation de conduite - ${company}`
          : `Your driving assessment schedule - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, voici votre devis et votre planning prévisionnel de leçons de conduite préparé par ${company}.`
          : `Hello, here is your driving lesson schedule and theory access code from ${company}.`
      };

    case 'disaster_restoration':
      return {
        whatsappCustomer: isFr
          ? `Bonjour, suite à un dégât des eaux, faites-vous l'assèchement et le rapport pour les assurances ?`
          : `Hello, following a water leak, do you provide emergency drying and insurance claims reports?`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Oui, l'équipe d'urgence de ${company} prend en charge le traitement du sinistre et votre dossier assurance.`
          : `Hello! Yes, the emergency team at ${company} handles restoration and insurance claim filing.`,
        whatsappBotQuestion: isFr
          ? `S'agit-il d'un bâtiment résidentiel ou professionnel, et quelle est l'adresse exacte du sinistre ?`
          : `Is this a residential or commercial building, and what is the property address?`,
        emailSubject: isFr
          ? `Dossier de prise en charge sinistre - ${company}`
          : `Emergency restoration protocol - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, suite à votre signalement de sinistre ${cityPhrase}, voici votre dossier d'intervention prioritaire établi par ${company}.`
          : `Hello, following your damage report ${cityPhrase}, here is your emergency claim file for insurance.`
      };

    default:
      return {
        whatsappCustomer: isFr
          ? `Bonjour, je souhaite obtenir un devis personnalisé pour vos prestations.`
          : `Hello, I would like to get a custom quote for your services.`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Avec plaisir, l'équipe de ${company} est à votre écoute pour étudier votre projet.`
          : `Hello! We would be glad to assist you. The team at ${company} is ready to review your project.`,
        whatsappBotQuestion: isFr
          ? `Pourriez-vous nous décrire brièvement vos besoins afin de vous orienter vers la meilleure offre ?`
          : `Could you briefly describe your requirements so we can provide the best recommendation?`,
        emailSubject: isFr
          ? `Votre devis & propositions sur-mesure - ${company}`
          : `Your quote & service proposal - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, suite à votre demande, voici la présentation de nos prestations et notre proposition sur-mesure pour ${company}.`
          : `Hello, following your inquiry, here is our service presentation and custom proposal for ${company}.`
      };
  }
}

/**
 * Generates responsive inline HTML email for any lead matching the 8 niche templates
 */
export function buildNicheHtmlEmail(
  lead: any,
  lang: Language = 'fr',
  options: {
    senderName?: string;
    senderTitle?: string;
    customDemoLink?: string;
    customPainPoint?: string;
    brandName?: string;
    customNiche?: NicheType;
    customSubject?: string;
    customHeroTitle?: string;
    customHeroSubtitle?: string;
    customPrimaryCta?: string;
    customSecondaryCta?: string;
    customBodyText?: string;
  } = {}
): { subject: string; html: string; text: string } {
  const nicheType = options.customNiche || resolveNicheType(lead.niche || lead.category || lead.sector || lead.searchKeyword);
  const template = NICHE_EMAIL_TEMPLATES[nicheType]?.[lang] || NICHE_EMAIL_TEMPLATES.general[lang];

  const company = lead.company || lead.name || lead.businessName || 'votre entreprise';
  const contactName = lead.contactName || lead.pageName || lead.name || 'Madame, Monsieur';
  const firstName = contactName.split(' ')[0] || contactName;
  
  const rawCity = lead.city || lead.location || lead.targetCountry || '';
  const cityClean = (rawCity && !rawCity.toLowerCase().includes('secteur') && !rawCity.toLowerCase().includes('sector')) ? rawCity : '';
  const cityPhrase = cityClean ? (lang === 'fr' ? `à ${cityClean}` : `in ${cityClean}`) : (lang === 'fr' ? 'dans la région' : 'in the area');

  const painPoint = options.customPainPoint || lead.gapSignal || lead.pitch || (lang === 'fr' ? 'Réponse instantanée 24/7 & accueil client personnalisé' : '24/7 instant response & personalized client welcome');
  const demoLink = options.customDemoLink || lead.website || `https://assix-agency.app/demo?lead=${encodeURIComponent(company)}`;
  const senderName = options.senderName || 'Anthony';
  const senderTitle = options.senderTitle || 'Directeur des Stratégies Digitales @ ASSIX';
  const assixBrand = options.brandName || 'ASSIX Agency';

  const convo = getNicheConversations(nicheType, company, cityPhrase, lang);

  const vars: Record<string, string> = {
    company,
    contactName,
    firstName,
    city: cityClean || (lang === 'fr' ? 'votre ville' : 'your city'),
    painPoint,
    demoLink,
    senderName,
    senderTitle,
    brandName: company
  };

  const defaultFormHeader = lang === 'fr' ? `Planifier un échange avec ${senderName}` : `Schedule a call with ${senderName}`;
  const defaultFormSubheader = lang === 'fr' ? `Notre équipe est à votre entière disposition pour échanger avec ${senderName} et vous présenter notre solution sur-mesure.` : `Our team is at your disposal to connect with ${senderName} and present our custom solution.`;
  const defaultSecondaryCta = lang === 'fr' ? `💬 Planifier un échange avec ${senderName}` : `💬 Schedule a call with ${senderName}`;

  const defaultIntroText = lang === 'fr' 
    ? `Nous avons analysé la présence de <strong>${company}</strong> ${cityPhrase}. Notre analyse a révélé des opportunités d'amélioration concrètes, et notre solution répond directement à ces enjeux en prenant le relais instantanément sur vos demandes prospects.` 
    : `We analyzed <strong>${company}</strong> ${cityPhrase}. Our audit identified clear growth opportunities, and our solution directly addresses these challenges by responding instantly to prospective clients.`;

  const rawIntroText = options.customHeroSubtitle || options.customBodyText || defaultIntroText;
  const formattedIntroText = rawIntroText.includes('<') ? rawIntroText : rawIntroText.replace(/\n/g, '<br/>');

  const subject = interpolateVariables(options.customSubject || convo.emailSubject || template.subject, vars);
  const heroTitle = interpolateVariables(options.customHeroTitle || template.heroTitle, vars);
  const heroSubtitle = interpolateVariables(formattedIntroText, vars);
  const primaryCta = interpolateVariables(options.customPrimaryCta || template.primaryCta, vars);
  const secondaryCta = interpolateVariables(options.customSecondaryCta || defaultSecondaryCta, vars);
  const servicesTitle = interpolateVariables(template.servicesTitle, vars);
  const servicesSubtitle = interpolateVariables(template.servicesSubtitle, vars);
  const workflowTitle = interpolateVariables(template.workflowTitle, vars);
  const whyUsTitle = interpolateVariables(template.whyUsTitle, vars);
  const formHeader = interpolateVariables(defaultFormHeader, vars);
  const formSubheader = interpolateVariables(defaultFormSubheader, vars);

  // Split company name for logo
  const words = company.split(' ');
  const logoFirst = words[0] || 'Assix';
  const logoSecond = words.slice(1).join(' ') || '';

  // Blue accent frame for all niches
  const accentColor = '#3B82F6';

  const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    @keyframes pulseGlow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.15); }
    }
    @keyframes pulseRed {
      0%, 100% { opacity: 1; background-color: #EF4444; }
      50% { opacity: 0.4; background-color: #991B1B; }
    }
    @keyframes typingEffect {
      0% { max-width: 0; }
      100% { max-width: 100%; }
    }
    .animated-pulse-dot {
      animation: pulseGlow 2s infinite ease-in-out;
    }
    .animated-red-dot {
      animation: pulseRed 1.2s infinite ease-in-out;
    }
    .typewriter-text {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      border-right: 2px solid #3B82F6;
      animation: typingEffect 4s steps(35, end) infinite;
    }
    @media only screen and (max-width: 600px) {
      .email-main-card { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .email-cell { padding-left: 16px !important; padding-right: 16px !important; }
      .typewriter-text { white-space: normal !important; animation: none !important; border-right: none !important; word-break: break-word !important; }
      .whatsapp-bubble-customer { margin-right: 4% !important; }
      .whatsapp-bubble-bot { margin-left: 4% !important; }
    }
    table { width: 100% !important; table-layout: fixed; }
    td, div, p, span, h1, h2, h3 { word-break: break-word; overflow-wrap: anywhere; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAF9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased;">
  <!-- Email Wrapper Container -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAF9; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 640px; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="background-color: #0F172A; padding: 12px 20px; border-bottom: 1px solid #1E293B;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #EF4444; margin-right: 6px;"></span>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #F59E0B; margin-right: 6px;"></span>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #10B981; margin-right: 12px;"></span>
                    <span style="color: #94A3B8; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;">${company.toUpperCase()} • OUTREACH</span>
                  </td>
                  <td align="right">
                    <a href="${demoLink}" target="_blank" style="color: ${accentColor}; font-size: 11px; font-weight: 600; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">${lang === 'fr' ? 'Aperçu Démo Live ↗' : 'Live Demo Preview ↗'}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Header / Brand Banner -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0F172A; text-align: center;">
              <div style="font-size: 26px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.05em;">
                ${logoFirst} <span style="color: ${accentColor}; font-style: italic;">${logoSecond}</span>
              </div>
              <div style="color: #94A3B8; font-size: 12px; margin-top: 4px; letter-spacing: 0.05em;">
                ${company} ${cityPhrase}
              </div>
            </td>
          </tr>

          <!-- Clean Personalized Intro Hook (No AUDIT DIGITAL badge) -->
          <tr>
            <td style="padding: 24px 32px 0 32px;">
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 18px 22px; border-radius: 12px; font-size: 13.5px; color: #1E293B; line-height: 1.6;">
                <strong>${lang === 'fr' ? 'Bonjour,' : 'Hello,'}</strong><br/>
                ${heroSubtitle}
              </div>
            </td>
          </tr>

          <!-- SECTION 1: WHATSAPP CHATBOT MOBILE UI -->
          <tr>
            <td style="padding: 20px 32px 0 32px;">
              <div style="background-color: #0B141A; border: 1px solid #1F2C34; border-radius: 16px; padding: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.25);">
                <!-- Mobile UI Header with 3 ASSIX Colored Status Dots -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-bottom: 1px solid #1F2C34; padding-bottom: 10px; margin-bottom: 12px;">
                  <tr>
                    <td width="48" valign="middle">
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #EF4444; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #F59E0B; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #10B981; margin-right: 6px;"></span>
                    </td>
                    <td width="36" valign="middle">
                      <div style="width: 32px; height: 32px; background-color: #128C7E; color: #FFFFFF; border-radius: 50%; text-align: center; line-height: 32px; font-size: 14px; font-weight: 800;">
                        ${company.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td style="padding-left: 8px;" valign="middle">
                      <div style="color: #E9EDEF; font-size: 13px; font-weight: 700;">
                        ${company} <span style="color: #25D366; font-size: 10px; font-weight: 800;">● ${lang === 'fr' ? 'EN LIGNE' : 'ONLINE'}</span>
                      </div>
                      <div style="color: #8696A0; font-size: 10px;">
                        ${lang === 'fr' ? 'Assistant WhatsApp réactif' : 'Instant WhatsApp Assistant'}
                      </div>
                    </td>
                    <td align="right" valign="middle">
                      <span style="background-color: rgba(37, 211, 102, 0.15); color: #25D366; font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 12px; border: 1px solid rgba(37, 211, 102, 0.3);">
                        WHATSAPP
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- Chat Log -->
                <div style="space-y: 8px;">
                  <!-- System Notification -->
                  <div style="text-align: center; margin-bottom: 10px;">
                    <span style="background-color: #182229; color: #8696A0; font-size: 10px; padding: 4px 10px; border-radius: 6px; display: inline-block;">
                      ${lang === 'fr' ? 'Appel manqué à 14:32 — Relance automatique' : 'Missed call at 14:32 — Automatic reply'}
                    </span>
                  </div>

                  <!-- Customer Message (Incoming bubble) -->
                  <div style="background-color: #202C33; color: #E9EDEF; padding: 10px 12px; border-radius: 10px 10px 10px 2px; font-size: 12px; line-height: 1.4; margin-right: 18%; margin-bottom: 8px;">
                    ${convo.whatsappCustomer}
                    <div style="text-align: right; font-size: 9px; color: #8696A0; margin-top: 4px;">14:32</div>
                  </div>

                  <!-- Bot Reply (Outgoing green bubble) -->
                  <div style="background-color: #005C4B; color: #E9EDEF; padding: 10px 12px; border-radius: 10px 10px 2px 10px; font-size: 12px; line-height: 1.4; margin-left: 18%; margin-bottom: 8px; border-left: 3px solid #25D366;">
                    ${convo.whatsappBotGreeting} ${convo.whatsappBotQuestion}
                    <div style="text-align: right; font-size: 9px; color: #8696A0; margin-top: 4px;">14:33 ✓✓</div>
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <!-- SECTION 2: MINI INBOX EMAIL GENERATOR -->
          <tr>
            <td style="padding: 16px 32px 0 32px;">
              <div style="background-color: #0F172A; border: 1px solid #1E293B; border-radius: 16px; padding: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.25);">
                <!-- Inbox Header with 3 ASSIX Colored Status Dots -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-bottom: 1px solid #1E293B; padding-bottom: 10px; margin-bottom: 12px;">
                  <tr>
                    <td width="48" valign="middle">
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #EF4444; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #F59E0B; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #10B981; margin-right: 6px;"></span>
                    </td>
                    <td width="24" valign="middle">
                      <span style="font-size: 14px; color: #60A5FA;">✉️</span>
                    </td>
                    <td valign="middle" style="padding-left: 6px;">
                      <div style="color: #F8FAFC; font-size: 12px; font-weight: 700;">
                        ${lang === 'fr' ? 'Rédaction d\'E-mail Client Automatisée' : 'Automated Client Email Writer'}
                      </div>
                      <div style="color: #64748B; font-size: 10px;">
                        ${company}
                      </div>
                    </td>
                    <td align="right" valign="middle">
                      <span style="background-color: rgba(59, 130, 246, 0.15); color: #60A5FA; font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.3);">
                        EMAIL AUTO
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- Typewriter Email Field -->
                <div style="background-color: #1E293B; border-radius: 8px; padding: 12px; border: 1px solid #334155; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; color: #93C5FD; line-height: 1.5;">
                  <div style="color: #64748B; margin-bottom: 6px; font-size: 10px; font-family: monospace;">
                    TO: client@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com<br/>
                    SUBJECT: ${convo.emailSubject}
                  </div>
                  <div class="typewriter-text" style="color: #E2E8F0; font-family: monospace;">
                    ${convo.emailDraftText}
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              <h1 style="font-size: 28px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0; line-height: 1.2;">
                ${heroTitle}
              </h1>
              <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 24px 0; max-width: 520px; display: inline-block;">
                ${heroSubtitle}
              </p>
              <br/>
              <a href="${demoLink}" target="_blank" style="display: inline-block; background-color: ${accentColor}; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 6px; letter-spacing: 0.05em; text-transform: uppercase; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                ${primaryCta} →
              </a>
            </td>
          </tr>

          <!-- Stats / Key Figures Section -->
          <tr>
            <td style="padding: 20px 32px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="33%" align="center" style="padding: 10px;">
                    <div style="font-size: 22px; font-weight: 800; color: ${accentColor};">${template.stat1.value}</div>
                    <div style="font-size: 11px; color: #64748B; font-weight: 500; margin-top: 2px;">${template.stat1.label}</div>
                  </td>
                  <td width="33%" align="center" style="padding: 10px; border-left: 1px solid #CBD5E1; border-right: 1px solid #CBD5E1;">
                    <div style="font-size: 22px; font-weight: 800; color: ${accentColor};">${template.stat2.value}</div>
                    <div style="font-size: 11px; color: #64748B; font-weight: 500; margin-top: 2px;">${template.stat2.label}</div>
                  </td>
                  <td width="33%" align="center" style="padding: 10px;">
                    <div style="font-size: 22px; font-weight: 800; color: ${accentColor};">${template.stat3.value}</div>
                    <div style="font-size: 11px; color: #64748B; font-weight: 500; margin-top: 2px;">${template.stat3.label}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Workflow / 4-Step Process Section -->
          <tr>
            <td style="padding: 28px 32px; background-color: #0F172A; color: #FFFFFF;">
              <h2 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 20px 0; text-align: center; letter-spacing: 0.05em; text-transform: uppercase;">
                ${workflowTitle}
              </h2>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${template.workflowSteps.map(step => `
                  <tr>
                    <td width="40" valign="top" style="padding-bottom: 16px;">
                      <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${accentColor}; color: #0F172A; font-weight: 800; font-size: 12px; text-align: center; line-height: 28px;">
                        ${step.step}
                      </div>
                    </td>
                    <td valign="top" style="padding-bottom: 16px; padding-left: 12px;">
                      <div style="font-size: 14px; font-weight: 700; color: #FFFFFF;">${step.title}</div>
                      <div style="font-size: 12px; color: #94A3B8; margin-top: 2px; line-height: 1.4;">${step.desc}</div>
                    </td>
                  </tr>
                `).join('')}
              </table>
            </td>
          </tr>

          <!-- Why Choose Us / Value Proposition -->
          <tr>
            <td style="padding: 32px; background-color: #FFFFFF;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0; text-align: center;">
                ${whyUsTitle}
              </h2>

              <ul style="margin: 0; padding: 0 0 0 20px; color: #334155; font-size: 13px; line-height: 1.8;">
                ${template.whyUsPoints.map(point => `
                  <li style="margin-bottom: 8px;">${point}</li>
                `).join('')}
              </ul>
            </td>
          </tr>

          <!-- Testimonial Section -->
          <tr>
            <td style="padding: 24px 32px; background-color: #F1F5F9; border-top: 1px solid #E2E8F0; text-align: center;">
              <div style="font-size: 20px; color: ${accentColor}; margin-bottom: 8px;">★★★★★</div>
              <blockquote style="margin: 0 0 12px 0; font-size: 13px; font-style: italic; color: #334155; line-height: 1.5;">
                "${template.testimonial.quote}"
              </blockquote>
              <div style="font-size: 12px; font-weight: 700; color: #0F172A;">${template.testimonial.author}</div>
              <div style="font-size: 11px; color: #64748B;">${template.testimonial.role}</div>
            </td>
          </tr>

          <!-- Contact / CTA Footer Section -->
          <tr>
            <td style="padding: 32px; background-color: #0F172A; text-align: center; color: #FFFFFF;">
              <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">${formHeader}</h3>
              <p style="font-size: 12px; color: #94A3B8; margin: 0 0 20px 0; max-width: 440px; display: inline-block;">
                ${formSubheader}
              </p>
              <br/>
              <a href="${demoLink}" target="_blank" style="display: inline-block; background-color: ${accentColor}; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 6px;">
                ${secondaryCta} →
              </a>

              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #1E293B; font-size: 11px; color: #64748B; line-height: 1.6;">
                <strong>${senderName}</strong> • ${senderTitle}<br/>
                ${assixBrand} • Enterprise Outreach & Automation<br/>
                <a href="${demoLink}" style="color: #94A3B8; text-decoration: underline;">${lang === 'fr' ? 'Consulter la démo interactive' : 'View Interactive Demo'}</a> • 
                <a href="#" style="color: #64748B; text-decoration: none;">${lang === 'fr' ? 'Se désabonner' : 'Unsubscribe'}</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
${company} - ${subject}

${lang === 'fr' ? 'Bonjour,' : 'Hello,'}

${lang === 'fr' 
  ? `Nous avons analysé ${company} ${cityPhrase}. Opportunité identifiée: ${painPoint}.` 
  : `We audited ${company} ${cityPhrase}. Opportunity identified: ${painPoint}.`}

${heroTitle}
${heroSubtitle}

${lang === 'fr' ? 'Consulter la démonstration interactive ici' : 'View the interactive demo here'}:
${demoLink}

${workflowTitle}:
${template.workflowSteps.map(st => `${st.step}. ${st.title} - ${st.desc}`).join('\n')}

${whyUsTitle}:
${template.whyUsPoints.map(p => `• ${p}`).join('\n')}

--
${senderName}
${senderTitle}
${assixBrand}
  `.trim();

  return { subject, html, text };
}
