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
  | 'accountant'
  | 'funeral_home'
  | 'dog_groomer'
  | 'photographer'
  | 'dentist'
  | 'general';

export type Language = 'fr' | 'en';

export const NICHE_EMAIL_TEMPLATES: Record<NicheType, Record<Language, NicheEmailContent>> = {
  restaurant: {
    fr: {
      subject: "L'art de recevoir à votre image — Démo interactive pour {{company}}",
      heroTitle: "L'art de recevoir à votre image",
      heroSubtitle: "Bonjour à l'équipe {{company}}, en tant que professionnel(le)s de la gastronomie et de l'accueil, offrir une expérience mémorable à vos convives est votre priorité au quotidien. Nous vous accompagnons pour sublimer la réservation de vos tables et la gestion de vos événements privés, en offrant à vos clients un accueil instantané, fluide et attentionné.",
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
      heroSubtitle: "To the {{company}} team, as a hospitality leader at {{company}}, delivering an exceptional culinary and dining experience is at the heart of what you do. We partner with your team to elevate table bookings and private event inquiries, providing your guests with instant responses and seamless, personalized care.",
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
      heroSubtitle: "Bonjour à l'équipe {{company}}, en tant qu'experts de la rénovation et du secours après sinistre, vous intervenez lors de moments critiques pour vos clients. Nous accompagnons votre équipe pour garantir une prise en charge immédiate 24/7 des sinistrés, rassurer les assurés en temps réel et organiser vos interventions d'urgence sans délai.",
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
      heroSubtitle: "To the {{company}} team, as restoration professionals at {{company}}, you support property owners during critical emergency situations. We empower your team to deliver immediate 24/7 assistance, reassure affected clients in real time, and dispatch emergency restoration crews with complete reliability.",
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
      heroSubtitle: "Bonjour à l'équipe {{company}}, en tant que professionnels de la plomberie et du chauffage, la réactivité et la confiance sont essentielles lors de chaque dépannage. Nous aidons votre équipe à répondre instantanément aux demandes d'urgence de vos clients, qualifier leurs besoins et planifier vos rendez-vous de chantier sans perdre un seul appel.",
      primaryCta: "💬 Échanger avec notre équipe",
      secondaryCta: "💬 Envoyez-nous un message",
      stat1: { value: "24h/24 & 7j/7", label: "Équipe disponible" },
      stat2: { value: "100%", label: "Accueil chaleureux" },
      stat3: { value: "10 ans", label: "Garantie sérénité" },
      servicesTitle: "Des Prestations Complètes & Certifiées",
      servicesSubtitle: "Équipements de marques leaders et finitions soignées pour l'ensemble de vos réseaux sanitaires.",
      services: [
        { title: "Recherche & Réparation de Fuite", desc: "Détection thermique non destructive et colmatage immédiat des canalisations.", icon: "💧" },
        { title: "Création Salle de Bain", desc: "Douches à l'italienne, robinetterie encastrée, carrelage et réseaux sanitaires.", icon: "旬" },
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
        role: "Propriétaire"
      },
      formHeader: "Notre équipe est à votre écoute 24h/24 et 7j/7",
      formSubheader: "Envoyez-nous un court message : nos conseillers vous répondent dans l'instant pour échanger et répondre à vos questions."
    },
    en: {
      subject: "Certified Master Plumbing & Heating Services — Demo for {{company}}",
      heroTitle: "Master Plumbing & Heating Solutions",
      heroSubtitle: "To the {{company}} team, as skilled plumbing and heating specialists at {{company}}, speed and reliability are key to keeping your clients satisfied. We support your team with 24/7 automated inquiry handling, instant emergency response, and seamless job scheduling so you never miss a client request.",
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
        role: "Homeowner"
      },
      formHeader: "Need a Qualified Plumber Today?",
      formSubheader: "Fill out the form below to receive a instant callback or free project quote."
    }
  },

  driving_school: {
    fr: {
      subject: "Permis de Conduire Réussi du 1er Coup — Démo pour {{company}}",
      heroTitle: "Obtenez Votre Permis en Toute Sérénité",
      heroSubtitle: "Bonjour à l'équipe {{company}}, en tant que professionnels de la formation routière, guider vos élèves vers la réussite du permis de conduire est votre engagement au quotidien. Nous accompagnons votre auto-école pour simplifier l'inscription des candidats, répondre instantanément à leurs questions et organiser leurs heures de conduite en toute fluidité.",
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
      heroSubtitle: "To the {{company}} team, as dedicated driving education leaders at {{company}}, guiding students toward earning their driver's license is your core mission. We help your school streamline candidate enrollments, answer student questions instantly, and schedule driving sessions effortlessly.",
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
      heroSubtitle: "Bonjour à l'équipe {{company}}, en tant qu'experts en électricité et rénovation, la sécurité et la précision de vos installations font votre réputation. Nous épaulons votre équipe pour capturer chaque demande de devis, répondre immédiatement aux urgences électriques et planifier vos chantiers en toute sérénité.",
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
      heroSubtitle: "To the {{company}} team, as electrical engineering experts at {{company}}, safety and precision define the quality of your work. We support your business by capturing every service lead, responding instantly to emergency electrical calls, and scheduling site consultations smoothly.",
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
      heroSubtitle: "Bonjour à l'équipe {{company}}, en tant que serruriers professionnels et experts en sécurité, intervenir en quelques minutes lors d'une urgence est capital pour vos clients. Nous aidons votre entreprise à gérer les appels de dépannage 24/7, rassurer immédiatement vos clients bloqués et organiser vos interventions sur le terrain sans délai.",
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
        "Tarifs annoncés au téléphone et strictly respectés : aucune arnaque",
        "Agréé par l'ensemble des compagnies d'assurance françaises (MAMDA, AXA, MAIF...)",
        "Serrures certifiées A2P 1, 2 ou 3 étoiles résistant aux tentatives d'arrachage",
        "Service d'astreinte garanti 365 jours par an, week-ends et jours fériés inclus"
      ],
      testimonial: {
        quote: "Porte claquée avec les clés à l'intérieur à 23h. Serrurier arrivé en 15 minutes, ouverture en 2 minutes sans rien abîmer. Tarif très raisonnable !",
        author: "Valérie G.",
        role: "Habitante"
      },
      formHeader: "Besoin d'un Dépannage ou d'un Blindage ?",
      formSubheader: "Complétez le formulaire ci-dessous pour une demande urgente ou un devis gratuit."
    },
    en: {
      subject: "24/7 Emergency Locksmith & Door Armoring — Demo for {{company}}",
      heroTitle: "24/7 Emergency Locksmith & High Security",
      heroSubtitle: "To the {{company}} team, as trusted locksmith and security specialists at {{company}}, fast emergency response is vital to your clients' peace of mind. We enable your business to handle 24/7 lockout inquiries, reassure stranded clients immediately, and dispatch technicians with speed.",
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
        role: "Local Resident"
      },
      formHeader: "Require Locksmith Assistance or Quote?",
      formSubheader: "Submit the form below for immediate dispatch or a free security audit."
    }
  },

  law_firm: {
    fr: {
      subject: "Conseil Juridique & Stratégie Contentieuse — Support {{company}}",
      heroTitle: "Rigueur Juridique & Stratégie d'Exception",
      heroSubtitle: "Bonjour à l'équipe du cabinet {{company}}, en tant que professionnels du droit, la réactivité et la confidentialité envers vos clients sont au cœur de votre pratique. Nous accompagnons votre cabinet pour accueillir vos futurs clients 24/7, qualifier en amont leurs demandes de consultation et planifier vos rendez-vous juridiques en toute sérénité.",
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
      heroSubtitle: "To the {{company}} team, as legal professionals at {{company}}, responsiveness and client trust are paramount to your practice. We support your firm in providing 24/7 client intake, pre-qualifying legal consultation inquiries, and scheduling appointments seamlessly and securely.",
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
      subject: "Solutions & Accompagnement Sur-Mesure — Support {{company}}",
      heroTitle: "Un accompagnement sur-mesure pour développer votre activité",
      heroSubtitle: "Bonjour,\n\nAprès avoir effectué des recherches sur {{company}}, nous avons réalisé qu'une automatisation intelligente de votre accueil prospect vous permettrait de développer davantage votre activité.\n\nJe vous propose deux solutions complémentaires :\n\n- Répondez instantanément aux questions fréquentes\n- Capturez les leads même après 18h\n- Relancez automatiquement les prospects intéressés",
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
        { step: "04", title: "Suivi & Garantie de Résultats", desc: "Validation de fin de mission et accompagnement continuous." }
      ],
      whyUsTitle: "Un accompagnement continu pour transformer votre activité",
      whyUsPoints: [
        "Essai en toute sérénité : vous pouvez tester notre solution et annuler à tout moment si besoin, sans engagement ni problème."
      ],
      testimonial: {
        quote: "Un partenaire de grande confiance. Rigueur, professionnalisme et respect des délais sur l'ensemble de nos demandes.",
        author: "Sophie M.",
        role: "Cliente Partenaire"
      },
      formHeader: "Discutons de Votre Projet",
      formSubheader: "Remplissez le formulaire ci-dessous pour recevoir une étude personnalisée et gratuite."
    },
    en: {
      subject: "Professional Solutions & Tailored Support — Demo for {{company}}",
      heroTitle: "Tailored Solutions to Support Your Business Growth",
      heroSubtitle: "To the {{company}} team, as business leaders at {{company}}, delivering high-quality service while growing your client base is your top priority. We help your team streamline client engagement, provide 24/7 instant inquiry responses, and convert more opportunities efficiently.",
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
      subject: "Vidéo visites immersives & gestion de vos prospects pour {{company}}",
      heroTitle: "L'immobilier connecté, réactif avec Vidéo Visite",
      heroSubtitle: "Captation de chaque prospect acquéreur ou locataire, envoi automatique de vidéos de visites virtuelles (video tours inside) et organisation instantanée des visites physiques.",
      primaryCta: "Découvrir la démonstration vidéo",
      secondaryCta: "Planifier un échange",
      stat1: { value: "100%", label: "Demandes de visite capturées" },
      stat2: { value: "< 2 min", label: "Temps de réponse prospect" },
      stat3: { value: "x2.5", label: "Mandats & visites concrétisés" },
      servicesTitle: "Solutions dédiées aux agences immobilières",
      servicesSubtitle: "Accélérez vos transactions, envoyez des visites vidéo immersives et qualifiez vos prospects acquéreurs sans perdre de temps.",
      services: [
        { title: "Visites Vidéo Immersives", desc: "Présentation interactive de vidéos de visites virtuelles (video tours inside) directement sur votre site pour pré-qualifier les acquéreurs.", icon: "🎥" },
        { title: "Gestion des Visites", desc: "Planification automatique des visites physiques sur les biens disponibles.", icon: "🔑" },
        { title: "Relance Acquéreurs", desc: "Suivi personnalisé et réponses instantanées WhatsApp/Email.", icon: "📲" },
        { title: "Estimation & Mandats", desc: "Prise de rendez-vous automatique pour l'estimation de biens.", icon: "🏠" }
      ],
      workflowTitle: "Un processus fluide en 4 étapes",
      workflowSteps: [
        { step: "01", title: "Demande Prospect", desc: "Le prospect demande des détails sur un bien sur votre site ou portail." },
        { step: "02", title: "Visite Vidéo Instantanée", desc: "Transmission automatique d'une vidéo de visite immersive pour susciter l'intérêt." },
        { step: "03", title: "Planification de Visite", desc: "Validation rapide de la date de visite physique sur les créneaux disponibles." },
        { step: "04", title: "Suivi & Offre", desc: "Relance automatique post-visite pour recueillir les offres d'achat." }
      ],
      whyUsTitle: "Un accompagnement continu pour transformer votre activité",
      whyUsPoints: [
        "Essai en toute sérénité : vous pouvez tester notre solution et annuler à tout moment si besoin, sans engagement ni problème."
      ],
      testimonial: {
        quote: "Grâce à cette automatisation et l'envoi instantané des visites vidéo, nous ne ratons plus aucun acquéreur. Les visites physiques sont hautement qualifiées.",
        author: "Marc V.",
        role: "Directeur d'Agence Immobilière"
      },
      formHeader: "Testez la démonstration immobilière",
      formSubheader: "Découvrez comment convertir 100% de vos demandes de visite grâce à la vidéo immersive."
    },
    en: {
      subject: "Video Walkthroughs & Lead Conversion for {{company}}",
      heroTitle: "Connected & High-Speed Real Estate with Video Tours Inside",
      heroSubtitle: "Capture every buyer and tenant inquiry, instantly showcase interactive video walkthroughs (video tours inside), and schedule visits automatically.",
      primaryCta: "Explore Video Demo",
      secondaryCta: "Schedule a Quick Call",
      stat1: { value: "100%", label: "Lead Capture Rate" },
      stat2: { value: "< 2 mins", label: "Inquiry Response Time" },
      stat3: { value: "x2.5", label: "Closed Visits & Listings" },
      servicesTitle: "Solutions Built for Real Estate Agencies",
      servicesSubtitle: "Accelerate property deals with interactive video walkthroughs and qualify buyers without spending hours on phone tag.",
      services: [
        { title: "Video Tours Inside", desc: "Showcase interactive, high-fidelity video walkthroughs directly on your website to pre-qualify buyers.", icon: "🎥" },
        { title: "Visit Scheduling", desc: "Automated booking for physical property showings and open houses.", icon: "🔑" },
        { title: "Buyer Follow-Up", desc: "Instant WhatsApp and Email replies with property video brochures.", icon: "📲" },
        { title: "Valuation Requests", desc: "Automate appointments for property seller valuations.", icon: "🏠" }
      ],
      workflowTitle: "Seamless 4-Step Process",
      workflowSteps: [
        { step: "01", title: "Lead Inquiry", desc: "Prospective buyer requests property details from your listing." },
        { step: "02", title: "Instant Video Tour", desc: "Bot automatically delivers an immersive video walkthrough of the property." },
        { step: "03", title: "Showing Confirmation", desc: "Confirmation sent with physical address, agent details, and calendar sync." },
        { step: "04", title: "Post-Showing Follow-Up", desc: "Automated check-in to collect buyer feedback and purchase offers." }
      ],
      whyUsTitle: "Dedicated Support to Convert Leads & Streamline Work",
      whyUsPoints: [
        "We provide hands-on assistance to convert leads, capture every missed call, and showcase video tours automatically.",
        "Save significant time daily to make your operations smoother, highly efficient, and focused on what matters most.",
        "Try risk-free: experience our platform with complete peace of mind and cancel anytime if needed without any hassle."
      ],
      testimonial: {
        quote: "We no longer miss buyer calls during property showings. Video tours pre-screen buyers, and our deal velocity doubled.",
        author: "Mark V.",
        role: "Real Estate Broker"
      },
      formHeader: "Experience the Real Estate Demo",
      formSubheader: "See how to convert 100% of property inquiries into active showings using interactive video tours."
    }
  },
  accountant: {
    fr: {
      subject: "Onboarding Client AI & Ingestion Pièces Comptables — Démo pour {{company}}",
      heroTitle: "Incorporez 100% de vos Nouveaux Clients sans Aucun Papier",
      heroSubtitle: "Bonjour à l'équipe du cabinet {{company}}, en tant qu'experts-comptables et conseillers privilégiés, vous apportez une valeur stratégique essentielle aux dirigeants et entreprises. Nous accompagnons votre cabinet pour fluidifier l'accueil de vos nouveaux clients, répondre aux interrogations courantes et organiser la signature de vos lettres de mission sans surcharge administrative.",
      primaryCta: "Tester l'Onboarding AI Client",
      secondaryCta: "Voir la Démo CPA",
      stat1: { value: "3 min", label: "Durée d'Onboarding Client" },
      stat2: { value: "-85%", label: "De Pièces Manquantes" },
      stat3: { value: "100%", label: "Conforme Ordre & RGPD" },
      servicesTitle: "L'Accueil Client Nouvelle Génération pour Cabinets Comptables",
      servicesSubtitle: "Offrez à vos clients une expérience moderne dès la première prise de contact.",
      services: [
        { title: "Ingestion KYC & Pièces", desc: "Collecte automatique de la pièce d'identité, KBIS et RIB avec contrôle instantané.", icon: "📑" },
        { title: "Synchro Bancaire & OCR", desc: "Rapprochement bancaire en temps réel et extraction intelligente des factures.", icon: "⚡" },
        { title: "Checklist Fiscale & TVA", desc: "Formulaires dynamiques guidés par IA selon le régime (IS, BNC, LMNP, Micro).", icon: "🏛️" },
        { title: "Espace Client & Signature", desc: "Lettre de mission signée en ligne et accès direct au portail comptable.", icon: "✍️" }
      ],
      workflowTitle: "Processus Onboarding Client en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Lien d'Invitation Sécurisé", desc: "Le prospect reçoit un lien WhatsApp/SMS personnalisé aux couleurs de votre cabinet." },
        { step: "02", title: "Collecte Guidée par IA", desc: "L'assistant intelligent collecte les statuts, le KBIS et scanne les pièces en 60s." },
        { step: "03", title: "Contrôle & Sync Banque", desc: "Vérification automatique des données juridiques et connexion bancaire sécurisée." },
        { step: "04", title: "Lettre de Mission & CPA", desc: "Génération automatique de la lettre de mission et validation finale de l'expert." }
      ],
      whyUsTitle: "Pourquoi Moderniser l'Onboarding de {{company}} ?",
      whyUsPoints: [
        "Finies les relances interminables pour obtenir les pièces manquantes en période fiscale",
        "Satisfaction client décuplée grâce à une expérience 100% sur mobile sans papier",
        "Conformité anti-blanchiment (LCB-FT) et archivage à valeur probante intégrés",
        "Intégration directe avec vos logiciels de production comptable (Pennylane, QuickBooks, Cegid)"
      ],
      testimonial: {
        quote: "Nous avons réduit notre temps d'intégration client de 2 semaines à 10 minutes. Nos clients adorent la simplicité WhatsApp.",
        author: "Arnaud M.",
        role: "Expert-Comptable Associé"
      },
      formHeader: "Simplifiez l'Onboarding de vos Clients Comptables",
      formSubheader: "Découvrez comment intégrer vos nouveaux dossiers en 3 minutes sans relance."
    },
    en: {
      subject: "AI Client Onboarding & Automated Document Intake — Demo for {{company}}",
      heroTitle: "Onboard 100% of New Accounting Clients 100% Paperless",
      heroSubtitle: "To the {{company}} team, as trusted accounting and financial advisors at {{company}}, you deliver strategic guidance to business leaders. We support your practice by streamlining prospective client intake, answering common accounting inquiries, and onboarding new clients efficiently.",
      primaryCta: "Test AI Client Onboarding",
      secondaryCta: "Watch CPA Workflow Demo",
      stat1: { value: "3 mins", label: "Client Onboarding Time" },
      stat2: { value: "-85%", label: "Missing Document Chassings" },
      stat3: { value: "100%", label: "AML / Compliance Ready" },
      servicesTitle: "Next-Gen Client Intake for Accounting Firms",
      servicesSubtitle: "Deliver a modern, frictionless onboarding experience from the very first contact.",
      services: [
        { title: "KYC & Document Intake", desc: "Automated collection of ID, business registration, and bank details.", icon: "📑" },
        { title: "Bank Sync & OCR Receipts", desc: "Real-time bank feed connection and smart receipt extraction.", icon: "⚡" },
        { title: "Tax & Compliance Checklists", desc: "Dynamic AI-guided intake forms tailored to business legal structure.", icon: "🏛️" },
        { title: "Portal Access & E-Sign", desc: "Instant engagement letter e-signing and immediate portal provisioning.", icon: "✍️" }
      ],
      workflowTitle: "4-Step Client Onboarding Pipeline",
      workflowSteps: [
        { step: "01", title: "Branded Invite Link", desc: "Prospect receives a branded mobile invitation link over WhatsApp or SMS." },
        { step: "02", title: "AI-Guided Document Scan", desc: "Interactive assistant collects company details and scans documents in 60s." },
        { step: "03", title: "Verification & Bank Feed", desc: "Automated legal data check and instant read-only bank feed connection." },
        { step: "04", title: "Engagement Letter & Sign", desc: "Automatic engagement letter generation and CPA review signoff." }
      ],
      whyUsTitle: "Why Upgrade Onboarding at {{company}}?",
      whyUsPoints: [
        "Eliminate tedious chasing for missing tax documents during peak tax season",
        "Dramatically improve client satisfaction with 100% mobile paperless onboarding",
        "Built-in Anti-Money Laundering (AML) compliance and tamper-proof audit trails",
        "Seamless integration with production software (QuickBooks, Xero, Pennylane)"
      ],
      testimonial: {
        quote: "We cut client onboarding time from 2 weeks down to 10 minutes. Clients love the easy WhatsApp document upload.",
        author: "Arthur P.",
        role: "Managing Partner CPA"
      },
      formHeader: "Streamline Your Accounting Client Onboarding",
      formSubheader: "See how to onboard new clients in under 3 minutes with zero paperwork."
    }
  },
  funeral_home: {
    fr: {
      subject: "Accueil Compatissant 24/7 & Support Familles — Démo pour {{company}}",
      heroTitle: "Un Accueil Digne et Attentif H24 pour Accompagner les Familles",
      heroSubtitle: "Bonjour à l'équipe {{company}}, en tant que professionnels des services funéraires, accompagner les familles avec dignité, écoute et bienveillance est au cœur de votre vocation. Nous aidons votre maison funéraire à offrir un accueil chaleureux et disponible 24/7 pour guider les proches et répondre à leurs besoins dans le plus grand respect.",
      primaryCta: "Découvrir l'Assistant Familial 24/7",
      secondaryCta: "Voir la Démo Prise en Charge",
      stat1: { value: "24h/24", label: "Présence Familiale Absolue" },
      stat2: { value: "< 5s", label: "Temps de Prise en Charge" },
      stat3: { value: "100%", label: "Respect & Dignité" },
      servicesTitle: "Services Funéraires & Accompagnement sur-Mesure",
      servicesSubtitle: "Un relais humain et technologique d'exception pour épauler vos conseillers funéraires.",
      services: [
        { title: "Accueil & Support Deuil 24/7", desc: "Écoute bienveillante et réponse immédiate aux familles en cas de décès.", icon: "🕊️" },
        { title: "Estimation & Devis Obsèques", desc: "Établissement transparent d'un devis préalable personnalisé selon les volontés.", icon: "📜" },
        { title: "Organisation des Cérémonies", desc: "Coordination des soins de conservation, transports, marbrerie et avis de décès.", icon: "🕯️" },
        { title: "Contrats de Prévoyance", desc: "Information claire et souscription guidée pour anticiper les obsèques.", icon: "🛡️" }
      ],
      workflowTitle: "Accompagnement Famille en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Écoute & Recueil du Besoin", desc: "Accueil délicat sur WhatsApp/Tél pour identifier l'urgence de la situation." },
        { step: "02", title: "Orientation & Prise en Charge", desc: "Saisie des informations indispensables (lieu, transport, volontés du défunt)." },
        { step: "03", title: "Devis Clair & Transparence", desc: "Envoi instantané d'une estimation conforme à la réglementation." },
        { step: "04", title: "Relais Conseiller Funéraire", desc: "Mise en relation directe avec le conseiller dédié de votre agence." }
      ],
      whyUsTitle: "Pourquoi Équiper {{company}} d'un Support 24/7 ?",
      whyUsPoints: [
        "Un décès survient à toute heure : offrez une écoute immédiate sans basculer sur un répondeur froid",
        "Rassurer instantanément les familles sur les premières démarches obligatoires",
        "Soulager la charge mentale des conseillers d'astreinte tout en conservant une réactivité parfaite",
        "Transmettre des fiches de prise en charge complètes et organisées avant le premier RDV"
      ],
      testimonial: {
        quote: "Les familles apprécient énormément la clarté et la douceur du premier contact à toute heure de la nuit. Un précieux soutien pour nos équipes.",
        author: "Hélène B.",
        role: "Directrice d'Agence Funéraire"
      },
      formHeader: "Accompagnez les Familles avec Dignité 24/7",
      formSubheader: "Découvrez notre assistant virtuel d'accueil compatissant pour pompes funèbres."
    },
    en: {
      subject: "24/7 Compassionate Family Support & Inquiry Assistant — Demo for {{company}}",
      heroTitle: "Dignified 24/7 Family Care & Immediate Guidance",
      heroSubtitle: "To the {{company}} team, as compassionate funeral service professionals at {{company}}, supporting families with care and dignity during challenging times is your solemn calling. We help your establishment provide 24/7 gentle guidance and respectful assistance to grieving families when they need it most.",
      primaryCta: "Explore 24/7 Family Assistant",
      secondaryCta: "View Funeral Intake Demo",
      stat1: { value: "24/7", label: "Immediate Availability" },
      stat2: { value: "< 5s", label: "Compassionate Response" },
      stat3: { value: "100%", label: "Dignity & Privacy" },
      servicesTitle: "Compassionate Funeral Services & Support",
      servicesSubtitle: "A seamless bridge supporting your funeral directors with total care and empathy.",
      services: [
        { title: "24/7 Compassionate Support", desc: "Gentle, respectful response to families facing a recent loss.", icon: "🕊️" },
        { title: "Transparent Funeral Quotes", desc: "Instant transparent estimate customized to family preferences.", icon: "📜" },
        { title: "Ceremony & Memorial Planning", desc: "Coordinating transport, memorial services, cremation, or burial.", icon: "🕯️" },
        { title: "Pre-Need Planning", desc: "Clear information and guidance for advance funeral arrangements.", icon: "🛡️" }
      ],
      workflowTitle: "Family Guidance Workflow",
      workflowSteps: [
        { step: "01", title: "Gentle First Intake", desc: "Empathetic messaging over WhatsApp or web to assess urgent needs." },
        { step: "02", title: "Core Details Gathering", desc: "Gathering necessary info (location, transport, wishes) with utmost care." },
        { step: "03", title: "Transparent Estimate", desc: "Sending a compliant, clear cost estimate to the family immediately." },
        { step: "04", title: "Funeral Director Handover", desc: "Direct assignment to your dedicated local funeral director." }
      ],
      whyUsTitle: "Why Upgrade Family Outreach at {{company}}?",
      whyUsPoints: [
        "Loss happens at any hour: provide immediate warmth rather than an answering service",
        "Reassure families instantly regarding immediate legal and transport steps",
        "Ease the burden on on-call directors while maintaining 100% responsiveness",
        "Provide your team with organized, complete intake notes before the first meeting"
      ],
      testimonial: {
        quote: "Families consistently mention how reassuring it was to get clear guidance at 3 AM. It has transformed our intake process.",
        author: "Eleanor W.",
        role: "Funeral Home Director"
      },
      formHeader: "Provide Dignified 24/7 Care to Every Family",
      formSubheader: "Discover how our compassionate AI assistant supports funeral home directors."
    }
  },
  dog_groomer: {
    fr: {
      subject: "Rappels de Toilettage & Réservations Récurrentes — Démo pour {{company}}",
      heroTitle: "Maximisez le Remplissage de Votre Salon de Toilettage",
      heroSubtitle: "Bonjour à l'équipe {{company}}, en tant que spécialistes passionnés du bien-être animal, prendre soin de nos compagnons à quatre pattes est votre métier de cœur. Nous aidons votre salon de toilettage à simplifier la prise de rendez-vous pour leurs maîtres, présenter vos soins sur-mesure et fidéliser vos clients en toute simplicité.",
      primaryCta: "Tester les Rappels Automatiques",
      secondaryCta: "Voir le Planning Toilettage",
      stat1: { value: "-90%", label: "De Rendez-vous Oubliés" },
      stat2: { value: "+35%", label: "De Fréquentation Récurrente" },
      stat3: { value: "24/7", label: "Réservation en Ligne" },
      servicesTitle: "Gestion Intelligente & Fidelisation de Vos Clients Poilus",
      servicesSubtitle: "Gardez votre carnet de rendez-vous complet toute l'année sans passer des heures au téléphone.",
      services: [
        { title: "Rappels SMS/WhatsApp Auto", desc: "Rappels automatiques 24h avant le rendez-vous pour éviter les absences.", icon: "🐾" },
        { title: "Relance Cycle de Toilettage", desc: "Relance automatique tous les 2 à 3 mois selon la race (bain, coupe, tontes).", icon: "✂️" },
        { title: "Fiche Santé & Race Chien", desc: "Enregistrement des préférences, comportement, shampoing hypoallergénique.", icon: "🐩" },
        { title: "Réservation en Ligne 24/7", desc: "Choix de la prestation et du créneau horaire direct sur mobile.", icon: "📅" }
      ],
      workflowTitle: "Le Cycle de Toilettage Automatisé",
      workflowSteps: [
        { step: "01", title: "Prise de RDV en 3 Clics", desc: "Le client choisit la race, le type de soin (bain/coupe) et l'horaire." },
        { step: "02", title: "Confirmation & Consignes", desc: "SMS instantané avec consignes d'arrivée et lien d'annulation." },
        { step: "03", title: "Rappel J-1 & WhatsApp", desc: "Rappel automatique 24h avant pour garantir la présence du toutou." },
        { step: "04", title: "Relance Récurrence +8 Semaines", desc: "Message automatique après 8 semaines : 'C'est l'heure du rafraîchissement !'" }
      ],
      whyUsTitle: "Pourquoi Remplir le Salon de {{company}} ?",
      whyUsPoints: [
        "Réduisez drastiquement les rendez-vous manqués qui plombent votre chiffre d'affaires",
        "Fidélisez vos clients en leur rappelant exactement quand refaire la coupe de leur chien",
        "Gagnez jusqu'à 1 heure par jour en supprimant la gestion manuelle du téléphone",
        "Proposez un carnet de santé virtuel pour chaque compagnon à quatre pattes"
      ],
      testimonial: {
        quote: "Mon agenda de toilettage est complet 3 semaines à l'avance grâce aux relances automatiques à 8 semaines. Mes clients adorent !",
        author: "Sophie T.",
        role: "Gérante Salon Canin & Félin"
      },
      formHeader: "Remplissez Votre Salon de Toilettage",
      formSubheader: "Découvrez la solution de réservation & rappels automatiques pour paires de ciseaux passionnées."
    },
    en: {
      subject: "Automated Grooming Reminders & Booking Assistant — Demo for {{company}}",
      heroTitle: "Keep Your Dog Grooming Salon Fully Booked Year-Round",
      heroSubtitle: "To the {{company}} team, as passionate pet care professionals at {{company}}, ensuring the comfort and well-being of dogs is your true passion. We help your grooming salon simplify appointment bookings for pet owners, highlight your specialized care services, and build lasting client relationships.",
      primaryCta: "Test Automated Reminders",
      secondaryCta: "View Grooming Schedule Demo",
      stat1: { value: "-90%", label: "No-Show Reduction" },
      stat2: { value: "+35%", label: "Recurring Care Retention" },
      stat3: { value: "24/7", label: "Mobile Online Booking" },
      servicesTitle: "Smart Grooming Assistant & Client Loyalty",
      servicesSubtitle: "Eliminate empty slots and phone disruptions while delivering top-tier pet care.",
      services: [
        { title: "Automated SMS/WhatsApp Reminders", desc: "Instant reminders sent 24 hours prior to prevent no-shows.", icon: "🐾" },
        { title: "Recurring Breed Relances", desc: "Automated check-in every 6-8 weeks tailored to breed coat needs.", icon: "✂️" },
        { title: "Pet Profile & Preferences", desc: "Tracking coat type, temperament, sensitive skin shampoo choices.", icon: "🐩" },
        { title: "24/7 Online Booking", desc: "Clients choose service type and open slots straight from their phone.", icon: "📅" }
      ],
      workflowTitle: "4-Step Grooming Retention Cycle",
      workflowSteps: [
        { step: "01", title: "3-Click Mobile Booking", desc: "Pet owner selects breed, grooming package, and preferred time." },
        { step: "02", title: "Instant Confirmation", desc: "Confirmation SMS with drop-off instructions and directions." },
        { step: "03", title: "24h Pre-Appointment Alert", desc: "Automated reminder asking for quick confirmation." },
        { step: "04", title: "+8 Week Care Re-engagement", desc: "Friendly automated ping when it's time for the next bath & haircut." }
      ],
      whyUsTitle: "Why Upgrade Grooming Operations at {{company}}?",
      whyUsPoints: [
        "Drastically eliminate costly no-shows and last-minute cancellations",
        "Turn one-off appointments into predictable, recurring grooming subscriptions",
        "Save over an hour every day previously wasted answering phone calls mid-groom",
        "Maintain detailed pet profiles to deliver personalized care every visit"
      ],
      testimonial: {
        quote: "Our appointment calendar is booked 3 weeks out consistently. Automated 8-week reminders brought back 40% more repeat clients.",
        author: "Jessica R.",
        role: "Pet Salon Owner"
      },
      formHeader: "Fill Your Grooming Salon Calendar",
      formSubheader: "Discover automated reminders and effortless online booking built for pet professionals."
    }
  },
  photographer: {
    fr: {
      subject: "Relance Prospect 5s & Portfolio Instantané — Démo pour {{company}}",
      heroTitle: "Convertissez Chaque Demande de Shooting en 5 Secondes",
      heroSubtitle: "Bonjour à l'équipe {{company}}, en tant que studio et créateurs visuels professionnels, sublimer les instants précieux de vos clients est votre signature. Nous accompagnons votre studio pour mettre en valeur votre portfolio, répondre instantanément aux demandes de réservations de séances et simplifier vos échanges de devis.",
      primaryCta: "Voir la Démo Photographe",
      secondaryCta: "Tester la Galerie Portfolio",
      stat1: { value: "5 sec", label: "Délai de Réponse Client" },
      stat2: { value: "x3", label: "Taux de Conversion Shooting" },
      stat3: { value: "100%", label: "Portfolio Ciblé Automatique" },
      servicesTitle: "L'Assistant Studio & Relance Prospect pour Photographes",
      servicesSubtitle: "Ne laissez plus jamais une demande de devis sans réponse pendant que vous êtes en shooting.",
      services: [
        { title: "Qualification du Shooting", desc: "Analyse automatique du besoin : mariage, portrait corporate, grossesse, événement.", icon: "📸" },
        { title: "Envoi Portfolio Ciblé", desc: "Présentation automatique de votre galerie photo spécifique au type de demande.", icon: "🖼️" },
        { title: "Tarifs & Grille Formules", desc: "Transmission instantanée de vos plaquettes tarifaires et options optionnelles.", icon: "🏷️" },
        { title: "Prise de RDV & Acompte", desc: "Réservation directe de la date avec blocage du calendrier et réservation.", icon: "📆" }
      ],
      workflowTitle: "Tunnel de Conversion Shooting en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Demande Prospect Instantanée", desc: "Le prospect envoie une demande sur votre site, Instagram ou WhatsApp." },
        { step: "02", title: "Qualification & Type de Shooting", desc: "L'IA identifie la date, le lieu, le type de prestation et le budget." },
        { step: "03", title: "Envoi Galerie & Plaquette", desc: "Envoi automatique du portfolio correspondant et de la grille tarifaire." },
        { step: "04", title: "Option de Date & Acompte", desc: "Verrouillage de la date dans votre agenda et signature de contrat." }
      ],
      whyUsTitle: "Pourquoi Automatiser les Demandes de {{company}} ?",
      whyUsPoints: [
        "Les clients réservent le premier photographe qualifié qui leur répond avec un vrai portfolio",
        "Ne perdez plus de contrats mariage ou corporate lorsque vous êtes sur le terrain",
        "Présentez automatiquement vos plus belles réalisations adaptées exactement à la demande",
        "Générez et faites signer vos contrats de droit d'image et acomptes en 1 clic"
      ],
      testimonial: {
        quote: "Pendant mes shootings de 8h, l'assistant a qualifié 3 mariages et envoyé mes tarifs. J'ai signé 2 contrats le soir même !",
        author: "Lucas D.",
        role: "Photographe Mariage & Portrait"
      },
      formHeader: "Multipliez vos Réservations de Shooting",
      formSubheader: "Découvrez notre assistant de relance rapide et envoi de portfolio pour photographes."
    },
    en: {
      subject: "Instant Enquiry Follow-Up & Portfolio Showcase — Demo for {{company}}",
      heroTitle: "Convert Every Photo Enquiry Within 5 Seconds",
      heroSubtitle: "To the {{company}} team, as creative professional photographers at {{company}}, capturing meaningful moments for your clients is your signature craft. We support your studio by showcasing your portfolio, answering shoot inquiries instantly, and making session bookings effortless.",
      primaryCta: "Explore Photographer Assistant",
      secondaryCta: "Test Portfolio Showcase",
      stat1: { value: "5 sec", label: "Instant Response Speed" },
      stat2: { value: "3x", label: "Booking Conversion Rate" },
      stat3: { value: "100%", label: "Targeted Gallery Delivery" },
      servicesTitle: "Studio Assistant & Fast Lead Qualification for Photographers",
      servicesSubtitle: "Never let a high-value photoshoot lead go cold while you're busy shooting on location.",
      services: [
        { title: "Shoot Qualification", desc: "Automatic requirement analysis: wedding, corporate, portrait, product.", icon: "📸" },
        { title: "Targeted Portfolio Delivery", desc: "Auto-send gallery examples tailored directly to the client's request.", icon: "🖼️" },
        { title: "Pricing & Package Guide", desc: "Instant distribution of your package sheets, licensing, and options.", icon: "🏷️" },
        { title: "Calendar Lock & Deposit", desc: "Direct date selection, contract signing, and retainer deposit collection.", icon: "📆" }
      ],
      workflowTitle: "4-Step Photoshoot Booking Funnel",
      workflowSteps: [
        { step: "01", title: "Instant Lead Capture", desc: "Lead submits an inquiry via website, Instagram, or WhatsApp." },
        { step: "02", title: "AI Qualification", desc: "System parses event date, location, shooting style, and budget." },
        { step: "03", title: "Portfolio & Pricing Delivery", desc: "Instant dispatch of relevant sample gallery and package breakdown." },
        { step: "04", title: "Date Lock & Retainer", desc: "Automated booking hold on calendar and digital contract signature." }
      ],
      whyUsTitle: "Why Upgrade Enquiry Response at {{company}}?",
      whyUsPoints: [
        "Clients book the first responsive photographer who sends a relevant portfolio",
        "Stop losing lucrative wedding or corporate gigs while working on set",
        "Automatically showcase your best work matching the exact shoot style requested",
        "Streamline model releases, contracts, and deposit payments effortlessly"
      ],
      testimonial: {
        quote: "While on an 8-hour shoot, the assistant qualified 3 wedding inquiries and sent pricing. I closed 2 bookings that same evening!",
        author: "Marcus V.",
        role: "Commercial & Wedding Photographer"
      },
      formHeader: "Multiply Your Photoshoot Bookings",
      formSubheader: "Discover instant lead follow-up and automated portfolio distribution for photographers."
    }
  },

  dentist: {
    fr: {
      subject: "Visualisation facettes dentaires en temps réel — Démo interactive pour {{company}}",
      heroTitle: "Vos patients visualisent leur futur sourire en 5 secondes",
      heroSubtitle: "Bonjour à l'équipe du cabinet {{company}}, en tant que chirurgiens-dentistes et professionnels de la santé, offrir un sourire éclatant et un confort absolu à vos patients est votre priorité. Nous vous accompagnons pour intégrer en 2 minutes un simulateur de facettes dentaires sur votre site web, permettant à vos patients d'essayer leur nouveau sourire en temps réel et de réserver directement leur consultation.",
      primaryCta: "Essayer le Simulateur de Sourire",
      secondaryCta: "Demander l'Intégration du Widget",
      stat1: { value: "3.5x", label: "Plus de rdv esthétiques" },
      stat2: { value: "< 5s", label: "Aperçu Réaliste Instantané" },
      stat3: { value: "100%", label: "Capture Prospects Automatique" },
      servicesTitle: "Révolutionnez le marketing de votre clinique dentaire",
      servicesSubtitle: "Permettez à vos futurs patients d'essayer virtuellement leurs facettes directement sur votre site web, éliminant toute hésitation.",
      services: [
        { title: "Intégration Script Simple", desc: "Copiez-collez une seule ligne de code sur votre site web (WordPress, Webflow, custom) pour activer l'essai de sourire virtuel instantané.", icon: "💻" },
        { title: "Aperçu de Teintes & Formes", desc: "Permet aux patients de tester différentes teintes (BL1, B1, A1) et styles de courbures.", icon: "🦷" },
        { title: "Importation de Photo Réelle", desc: "Le patient importe son propre portrait pour un rendu de facettes ultra-personnalisé.", icon: "📸" },
        { title: "Alertes Cabinet en Direct", desc: "Recevez les fiches prospects avec leur photo avant/après directement dans votre boîte mail.", icon: "📩" }
      ],
      workflowTitle: "Notre Méthode d'Acquisition en 4 Étapes",
      workflowSteps: [
        { step: "01", title: "Le Patient Importe son Portrait", desc: "Le visiteur se rend sur votre site et télécharge un selfie de son sourire actuel." },
        { step: "02", title: "Simulation Interactive", desc: "Il ajuste la teinte et la forme des facettes dentaires en temps réel sur le widget." },
        { step: "03", title: "Curseur Avant / Après", desc: "Un curseur interactif dévoile le sourire transformé, déclenchant l'effet 'Wow'." },
        { step: "04", title: "Prise de Rendez-vous", desc: "Le widget recueille ses coordonnées et planifie une consultation esthétique de prestige." }
      ],
      whyUsTitle: "Pourquoi Intégrer Notre Simulateur de Sourire ?",
      whyUsPoints: [
        "Augmente le taux de conversion des demandes de facettes de plus de 300%",
        "Entièrement personnalisable aux couleurs et au catalogue de votre cabinet",
        "Installation ultra-simple en 5 minutes : un seul script universel à copier-coller",
        "Fonctionne en autonomie complète 24h/24 pour capter une clientèle premium"
      ],
      testimonial: {
        quote: "L'intégration du simulateur de sourire a été une révélation. Nous avons copié-collé le script en 2 minutes et avons enregistré 24 nouvelles demandes de facettes haut de gamme dès le premier mois !",
        author: "Dr. Aurélie Bertrand, Chirurgien-Dentiste",
        role: "Cabinet Dentaire Esthétique Bertrand"
      },
      formHeader: "Installez le Simulateur sur votre Site Clinique",
      formSubheader: "Découvrez comment notre widget interactif avant/après peut s'implémenter en 2 minutes pour automatiser la génération de patients."
    },
    en: {
      subject: "See how your patients look with veneers in real-time — Interactive demo for {{company}}",
      heroTitle: "Your patients can preview their new smile in 5 seconds",
      heroSubtitle: "To the {{company}} team, as healthcare professionals and cosmetic dental specialists at {{company}}, giving patients confidence through a beautiful smile is your top commitment. We empower your clinic to embed an interactive Veneers Smile Simulator in just 2 minutes, allowing patients to preview their dream smile in real time and book consultations immediately.",
      primaryCta: "Try the Smile Simulator Widget",
      secondaryCta: "Inquire About Widget Integration",
      stat1: { value: "3.5x", label: "More Cosmetic Bookings" },
      stat2: { value: "< 5s", label: "Instant Visual Results" },
      stat3: { value: "100%", label: "Automated Lead Capture" },
      servicesTitle: "Transform Your Cosmetic Dentistry Marketing",
      servicesSubtitle: "Allow patients to try on their new smile directly on your website, removing all doubt and driving premium veneers bookings.",
      services: [
        { title: "Easy Script Integration", desc: "Copy-paste a single line of code onto your website (WordPress, Webflow, Squarespace) to instantly go live with interactive smile preview capabilities.", icon: "💻" },
        { title: "Instant Veneers Matcher", desc: "Allows patients to choose different veneer shades and shapes to fit their facial features.", icon: "🦷" },
        { title: "Real Life Image Upload", desc: "Patients upload a real photo of themselves for highly personalized mockups.", icon: "📸" },
        { title: "Direct CRM Notifications", desc: "Get high-quality before/after leads delivered straight to your clinic's inbox.", icon: "📩" }
      ],
      workflowTitle: "How It Transforms Patient Acquisition in 4 Steps",
      workflowSteps: [
        { step: "01", title: "Patient Uploads Selfie", desc: "Prospect visits your clinic website and uploads a standard front-facing smile photo." },
        { step: "02", title: "Interactive Shade Customization", desc: "Prospect chooses their desired veneer shade and shape directly in the interactive widget." },
        { step: "03", title: "Real-time Before/After Slider", desc: "Our interactive slider reveals their stunning veneer makeover, creating instant excitement." },
        { step: "04", title: "Instant Consultation Booking", desc: "Widget captures their name, email, and selfie, booking a premium consultation directly." }
      ],
      whyUsTitle: "Why Embed Our Smile Visualizer ?",
      whyUsPoints: [
        "Proven to increase cosmetic consult conversion rates by over 300%",
        "Fully customizable to match your clinic's branding and veneer catalog",
        "Frictionless integration: works with WordPress, Webflow, Squarespace, or custom sites in 2 minutes",
        "Zero staff intervention required: runs 24/7 on autopilot to capture high-value clients"
      ],
      testimonial: {
        quote: "Embedding the Veneer Smile Visualizer was a game-changer. We copy-pasted the script in 2 minutes and received 24 new premium veneer consultation requests in the first month alone !",
        author: "Dr. Sarah Sterling, DDS",
        role: "Founder of Sterling Elite Dental"
      },
      formHeader: "Add the Smile Visualizer to Your Clinic Website",
      formSubheader: "Discover how our interactive before/after widget can automate premium patient generation in just 2 minutes."
    }
  },
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
  if (kw.includes('comptab') || kw.includes('account') || kw.includes('cpa') || kw.includes('fiscal') || kw.includes('audit') || kw.includes('bookkeep')) {
    return 'accountant';
  }
  if (kw.includes('funer') || kw.includes('obsequ') || kw.includes('obsèq') || kw.includes('pompe') || kw.includes('deuil') || kw.includes('mortuar') || kw.includes('cremat')) {
    return 'funeral_home';
  }
  if (kw.includes('groom') || kw.includes('toilett') || kw.includes('canin') || kw.includes('chasseur') || kw.includes('animal') || kw.includes('pet') || kw.includes('chien') || kw.includes('chat')) {
    return 'dog_groomer';
  }
  if (kw.includes('photo') || kw.includes('videog') || kw.includes('vidéo') || kw.includes('shoot') || kw.includes('studio') || kw.includes('portrait')) {
    return 'photographer';
  }
  if (kw.includes('dentis') || kw.includes('dentaire') || kw.includes('ortho') || kw.includes('veneer') || kw.includes('facette') || kw.includes('dental') || kw.includes('smile') || kw.includes('sourire')) {
    return 'dentist';
  }

  return 'general';
}

/**
 * Formats ALL-CAPS or raw business names into clean Title Case (e.g. "AGENCE IMMOBILIERE DU GOLFE" -> "Agence Immobiliere du Golfe")
 * while preserving already mixed-case or formatted business names.
 */
export function formatBusinessName(name: string): string {
  if (!name || typeof name !== 'string') return name || '';
  const trimmed = name.trim();
  if (!trimmed) return '';

  // Extract alphabetic characters to check case
  const letters = trimmed.replace(/[^a-zA-ZÀ-ÿ]/g, '');
  // If name contains lowercase letters already, keep as is
  if (letters.length > 1 && letters !== letters.toUpperCase()) {
    return trimmed;
  }

  // Articles, prepositions & conjunctions to keep lowercase when not at start
  const lowercaseWords = new Set([
    'de', 'du', 'des', 'la', 'le', 'les', 'en', 'à', 'au', 'aux', 'sur', 'et', 'pour', 'par', 'un', 'une',
    'of', 'the', 'and', 'for', 'in', 'on', 'at', 'to', 'with', 'by'
  ]);

  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((word, idx) => {
      if (!word) return '';
      
      // Handle d', l', c', s', m', t', n', qu'
      const apostropheMatch = word.match(/^(d'|l'|c'|s'|m'|t'|n'|qu')(.*)$/i);
      if (apostropheMatch) {
        const prefix = apostropheMatch[1].toLowerCase();
        const rest = apostropheMatch[2];
        const capRest = rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : '';
        const capPrefix = idx === 0 ? prefix.charAt(0).toUpperCase() + prefix.slice(1) : prefix;
        return capPrefix + capRest;
      }

      if (idx > 0 && lowercaseWords.has(word.toLowerCase())) {
        return word.toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
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
/**
 * Returns sector-coherent WhatsApp and Email generator conversations
 */
export function getNicheIntroText(
  nicheType: NicheType,
  companyRaw: string,
  cityPhrase: string,
  lang: Language = 'fr'
): string {
  const isFr = lang === 'fr';
  const company = companyRaw.includes('{{') ? companyRaw : formatBusinessName(companyRaw);

  switch (nicheType) {
    case 'real_estate':
      return isFr
        ? `Bonjour,\n\nAprès avoir effectué des recherches sur l'agence ${company}, nous avons réalisé que la plupart des demandes de prospects nécessitent une réactivité immédiate pour se transformer en mandats.\n\nJe vous propose deux solutions complémentaires :\n\n- Répondez instantanément aux questions fréquentes & diffusez des visites vidéo immersives (video tours inside)\n- Capturez les leads même après 18h\n- Relancez automatiquement les prospects intéressés\n\nRésultat typique : +25% de mandats exclusifs en 30 jours.\n\nDe plus, nous automatisons et personnalisons l'intégralité de vos e-mails et relances prospects. Chaque message est 100% sur-mesure pour vos clients, ce qui vous fait gagner un temps considérable au quotidien tout en maximisant vos conversions.`
        : `Hello,\n\nAfter conducting research on ${company}, we realized that prompt lead follow-ups are critical to converting buyer inquiries into exclusive listings.\n\nWe offer two complementary solutions:\n\n- Respond instantly to frequently asked questions & deliver video tours inside\n- Capture qualified leads even after 6 PM\n- Automatically follow up with interested prospects\n\nTypical result: +25% exclusive mandates in 30 days.\n\nFurthermore, we fully automate and personalize all your emails and prospect follow-ups. Every single message is 100% tailored to your leads, saving you huge amounts of time daily while maximizing your conversions.`;

    case 'dentist':
      return isFr
        ? `Bonjour,\n\nAprès avoir effectué des recherches sur le cabinet dentaire ${company}, nous avons réalisé que de nombreux visiteurs sur votre site s'intéressent aux soins esthétiques et facettes sans oser sauter le pas.\n\nJe vous propose une solution sur-mesure pour ${company} :\n\n- Un simulateur de sourire interactif directement sur votre site web\n- Vos patients importent leur photo et voient instantanément leur transformation de sourire avec facettes dentaires\n- Une intégration ultra-simple en 2 minutes via un script léger à copier-coller sur votre site internet\n- Captation automatique des coordonnées pour planifier la consultation de prestige\n\nRésultat typique : +300% de rendez-vous pour des soins esthétiques sous 30 jours.`
        : `Hello,\n\nAfter conducting research on ${company}, we realized that many website visitors looking for cosmetic dental treatments do not complete their booking.\n\nWe offer a game-changing solution:\n\n- An interactive Smile Simulator embedded directly on your website\n- Patients upload their photo and instantly preview their new veneer smile makeover\n- Easy integration: copy and paste a single lightweight script onto your website in 2 minutes\n- Automated lead capture to seamlessly book aesthetic consultations\n\nTypical outcome: +300% increase in high-ticket cosmetic dentistry bookings in 30 days.`;

    case 'law_firm':
      return isFr
        ? `Bonjour,\n\nAprès avoir effectué des recherches sur le cabinet ${company}, nous avons réalisé que la conversion rapide des demandes d'information en consultations est essentielle pour signer de nouveaux dossiers.\n\nJe vous propose deux solutions complémentaires :\n\n- Répondez instantanément aux questions fréquentes\n- Capturez les demandes même après 18h\n- Relancez automatiquement les prospects intéressés\n\nRésultat typique : +25% de dossiers qualifiés signés en 30 jours.\n\nDe plus, nous automatisons et personnalisons l'intégralité de vos e-mails et relances prospects. Chaque message est 100% sur-mesure pour vos interlocuteurs, ce qui vous fait gagner un temps considérable au quotidien tout en maximisant vos conversions.`
        : `Hello,\n\nAfter conducting research on ${company}, we realized that converting consultation requests into signed retainers requires immediate, structured follow-up.\n\nWe offer two complementary solutions:\n\n- Answer common questions instantly 24/7\n- Capture case inquiries after hours\n- Automatically follow up with prospective clients\n\nTypical result: +25% signed client retainers in 30 days.\n\nAdditionally, we fully automate and personalize all your emails and client outreach. Every message is tailored to your prospects, saving huge amounts of time while driving higher conversions.`;

    case 'restaurant':
      return isFr
        ? `Bonjour,\n\nAprès avoir effectué des recherches sur l'établissement ${company}, nous avons réalisé que de nombreuses demandes de réservation et de privatisation restent sans réponse en dehors des heures de service.\n\nJe vous propose deux solutions complémentaires :\n\n- Répondez instantanément aux questions fréquentes\n- Capturez les demandes même après 18h\n- Relancez automatiquement les prospects intéressés\n\nRésultat typique : +25% de réservations firmes en 30 jours.\n\nDe plus, nous automatisons et personnalisons l'intégralité de vos e-mails et relances de devis événements. Chaque message est 100% sur-mesure, ce qui vous fait gagner un temps considérable au quotidien tout en maximisant vos réservations.`
        : `Hello,\n\nAfter conducting research on ${company}, we realized that many dining and event reservation inquiries arrive when your team is busy or off-duty.\n\nWe provide two complementary solutions:\n\n- Answer FAQs instantly\n- Capture reservation requests after 6 PM\n- Automatically follow up with event prospects\n\nTypical result: +25% confirmed bookings in 30 days.\n\nPlus, we fully automate and personalize all your emails and event quote follow-ups. Every message is customized, saving massive amounts of time while filling your reservations.`;

    case 'accountant':
      return isFr
        ? `Bonjour,\n\nAprès avoir effectué des recherches sur le cabinet ${company}, nous avons réalisé que l'automatisation de l'accueil prospect et de l'onboarding digital vous permettrait d'accélérer la signature de nouvelles lettres de mission.\n\nJe vous propose deux solutions complémentaires :\n\n- Répondez instantanément aux questions fréquentes\n- Capturez les demandes même après 18h\n- Relancez automatiquement les prospects intéressés\n\nRésultat typique : +25% de nouveaux dossiers signés en 30 jours.\n\nDe plus, nous automatisons et personnalisons l'intégralité de vos e-mails et relances prospects. Chaque message est 100% sur-mesure pour vos clients, ce qui vous fait gagner un temps considérable au quotidien tout en maximisant votre taux de conversion.`
        : `Hello,\n\nAfter conducting research on ${company}, we realized that automating client intake and onboarding documents speeds up signing engagement letters.\n\nWe deliver two complementary solutions:\n\n- Answer common business FAQs instantly 24/7\n- Capture lead details after 6 PM\n- Automatically follow up with prospective clients\n\nTypical result: +25% new signed engagements in 30 days.\n\nFurthermore, we fully automate and personalize all your emails and onboarding follow-ups. Every communication is 100% tailored to your client, saving hours of work every week while raising conversion rates.`;

    case 'plumbing':
    case 'electrical':
    case 'locksmith':
    case 'disaster_restoration':
      return isFr
        ? `Bonjour,\n\nAprès avoir effectué des recherches sur l'entreprise ${company}, nous avons réalisé que répondre instantanément aux demandes d'urgence et appels manqués vous permettrait de remporter plus de chantiers.\n\nJe vous propose deux solutions complémentaires :\n\n- Répondez instantanément aux questions fréquentes & urgences\n- Capturez les leads même après 18h\n- Relancez automatiquement les prospects intéressés\n\nRésultat typique : +25% de chantiers signés en 30 jours.\n\nDe plus, nous automatisons et personnalisons l'intégralité de vos e-mails et relances prospects. Chaque message est 100% sur-mesure pour vos clients, ce qui vous fait gagner un temps considérable au quotidien tout en maximisant vos conversions.`
        : `Hello,\n\nAfter conducting research on ${company}, we realized that immediate call-back and emergency dispatch capabilities are essential to securing more service jobs.\n\nWe provide two complementary solutions:\n\n- Answer service FAQs & emergency inquiries instantly\n- Capture leads even after 6 PM\n- Automatically follow up on pending quotes\n\nTypical result: +25% booked jobs in 30 days.\n\nIn addition, we fully automate and personalize all your emails and quote reminders. Each message is customized for your client, saving you huge amounts of time while closing more jobs.`;

    default:
      return isFr
        ? `Bonjour,\n\nAprès avoir effectué des recherches sur l'entreprise ${company}, nous avons réalisé qu'une automatisation intelligente de votre accueil prospect vous permettrait de développer davantage votre activité.\n\nJe vous propose deux solutions complémentaires :\n\n- Répondez instantanément aux questions fréquentes\n- Capturez les leads même après 18h\n- Relancez automatiquement les prospects intéressés\n\nRésultat typique : +25% de conversions en 30 jours.\n\nDe plus, nous automatisons et personnalisons l'intégralité de vos e-mails et relances prospects. Chaque message est 100% sur-mesure pour votre interlocuteur, ce qui vous fait gagner un temps considérable au quotidien tout en maximisant vos conversions.`
        : `Hello,\n\nAfter conducting research on ${company}, we realized that an intelligent lead response system would help you significantly grow your client base.\n\nWe offer two complementary solutions:\n\n- Answer common FAQs instantly 24/7\n- Capture leads after 6 PM\n- Automatically follow up with interested prospects\n\nTypical outcome: +25% client conversion in 30 days.\n\nIn addition, we fully automate and personalize all your emails and outreach. Every message is tailored specifically to your prospect, saving massive amounts of time while maximizing conversion rates.`;
  }
}

export function getNicheConversations(
  nicheType: NicheType,
  companyRaw: string,
  cityPhrase: string,
  lang: Language = 'fr'
) {
  const isFr = lang === 'fr';
  const company = companyRaw.includes('{{') ? companyRaw : formatBusinessName(companyRaw);

  switch (nicheType) {
    case 'real_estate':
      return {
        whatsappCustomer: isFr 
          ? `Bonjour, l'appartement aperçu sur votre site est-il toujours disponible pour une visite ?`
          : `Hello, is the property listed on your website still available for a visit?`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Oui, ce bien géré par ${company} est actuellement disponible. Nous organisons plusieurs visites cette semaine.`
          : `Hello! Yes, this property at ${company} is available. We are scheduling visits this week.`,
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
          ? `Bonjour, je cherche un avocat disponible pour un rendez-vous ou une première consultation.`
          : `Hello, I am looking for an attorney for an initial legal consultation.`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Le cabinet ${company} vous accompagne dans l'ensemble de vos démarches juridiques.`
          : `Hello! ${company} is available to guide you through your legal proceedings.`,
        whatsappBotQuestion: isFr
          ? `Pourriez-vous nous préciser le domaine (droit des affaires, immobilier, famille...) afin de fixer une consultation ?`
          : `Could you briefly specify the practice area (business, real estate, family...) to schedule a consultation?`,
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
          ? `Bonjour ! Tout à fait, un plombier certifié de ${company} peut intervenir rapidement chez vous.`
          : `Hello! Absolutely, a certified plumber from ${company} can assist you in your area today.`,
        whatsappBotQuestion: isFr
          ? `Pourriez-vous nous indiquer votre adresse et m'envoyer une photo de la fuite pour estimer l'intervention ?`
          : `Could you share your address and a quick picture of the leak so we can prepare the intervention?`,
        emailSubject: isFr
          ? `Votre devis de dépannage plomberie - ${company}`
          : `Your plumbing service estimate - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, suite à votre demande concernant votre problème de plomberie, voici votre devis préparé par ${company}.`
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
          ? `Votre calendrier d'évaluation de conduite & Suivi Permis - ${company}`
          : `Your driving assessment schedule & student portal - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, voici votre planning prévisionnel de leçons de conduite et votre accès au portail élève préparé par ${company}.`
          : `Hello, here is your driving lesson schedule and theory access code from ${company}.`
      };

    case 'accountant':
      return {
        whatsappCustomer: isFr
          ? `Bonjour, je souhaite transférer mon dossier comptable chez vous. Comment se passe le changement ?`
          : `Hello, I would like to transfer my accounting files to your firm. How does the onboarding work?`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Bienvenue chez ${company}. Notre processus d'intégration est 100% numérisé et prend 3 minutes.`
          : `Hello! Welcome to ${company}. Our client onboarding is 100% paperless and takes under 3 minutes.`,
        whatsappBotQuestion: isFr
          ? `Pouvez-vous nous indiquer la forme juridique de votre société (SASU, SARL, EURL) et votre numéro SIREN ?`
          : `Could you share your business legal structure and registration number to prepare your onboarding link?`,
        emailSubject: isFr
          ? `Lien d'intégration client & Lettre de Mission - Cabinet ${company}`
          : `Client onboarding link & engagement letter - ${company} CPA`,
        emailDraftText: isFr
          ? `Bonjour, bienvenue chez ${company}. Voici votre lien sécurisé d'onboarding client pour transmettre vos pièces KYC et signer votre lettre de mission.`
          : `Hello, welcome to ${company}. Here is your secure client onboarding link to upload KYC documents and e-sign your engagement letter.`
      };

    case 'funeral_home':
      return {
        whatsappCustomer: isFr
          ? `Bonjour, nous faisons face au décès d'un proche. Pourriez-vous nous guider pour les obsèques ?`
          : `Hello, we experienced a recent loss in the family. Could you guide us on funeral arrangements?`,
        whatsappBotGreeting: isFr
          ? `Toutes nos condoléances. L'équipe des pompes funèbres ${company} est à vos côtés pour vous épauler avec bienveillance.`
          : `Our deepest condolences. The team at ${company} Funeral Services is here to gently guide you through every step.`,
        whatsappBotQuestion: isFr
          ? `Pouvez-vous nous indiquer le lieu du décès et s'il y a des volontés particulières concernant la cérémonie ?`
          : `Could you let us know the location of your loved one and any immediate wishes regarding the service?`,
        emailSubject: isFr
          ? `Guide des premières démarches & Devis estimatif - Pompes Funèbres ${company}`
          : `Immediate guidance & funeral estimate - ${company} Funeral Home`,
        emailDraftText: isFr
          ? `Bonjour, nous renouvelons nos condoléances de la part de ${company}. Voici le guide des démarches et l'estimation transparente.`
          : `Hello, with our sincere condolences from ${company}. Here is our immediate step-by-step guidance guide and transparent estimate.`
      };

    case 'dog_groomer':
      return {
        whatsappCustomer: isFr
          ? `Bonjour, avez-vous de la place pour le toilettage complet d'un Golden Retriever cette semaine ?`
          : `Hello, do you have an open appointment for a full Golden Retriever grooming session this week?`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Oui, le salon de toilettage ${company} a encore quelques créneaux disponibles cette semaine.`
          : `Hello! Yes, ${company} Pet Grooming Salon has a few open slots available this week.`,
        whatsappBotQuestion: isFr
          ? `Souhaitez-vous la formule bain + coupe aux ciseaux ou tonte hygiénique pour votre loulou ?`
          : `Would you prefer a full bath & scissor haircut or a seasonal trim for your furry friend?`,
        emailSubject: isFr
          ? `Rappel de toilettage & confirmation de RDV - Salon ${company}`
          : `Grooming appointment confirmation & reminder - ${company}`,
        emailDraftText: isFr
          ? `Bonjour, votre rendez-vous de toilettage chez ${company} est confirmé ! Voici les détails et conseils avant votre arrivée.`
          : `Hello, your pet grooming appointment at ${company} is confirmed! Here are drop-off details and pre-grooming tips.`
      };

    case 'photographer':
      return {
        whatsappCustomer: isFr
          ? `Bonjour, faites-vous les reportages photo de mariage et seriez-vous disponible le 18 juillet ?`
          : `Hello, do you cover wedding photography and are you available on July 18th?`,
        whatsappBotGreeting: isFr
          ? `Bonjour ! Oui, le studio ${company} couvre les mariages et la date du 18 juillet est actuellement libre !`
          : `Hello! Yes, ${company} Photography covers wedding galas and July 18th is currently available on our calendar!`,
        whatsappBotQuestion: isFr
          ? `Pourriez-vous nous indiquer le lieu des festivités et le nombre d'invités estimé pour vous envoyer notre portfolio mariage ?`
          : `Could you mention your wedding venue location and estimated guest count so we can share our wedding portfolio?`,
        emailSubject: isFr
          ? `Portfolio mariage & Grille tarifaire - Studio ${company}`
          : `Wedding portfolio & pricing breakdown - ${company} Studio`,
        emailDraftText: isFr
          ? `Bonjour, félicitations pour votre futur mariage ! Voici notre portfolio complet et nos formules de reportage préparés par ${company}.`
          : `Hello, congratulations on your upcoming wedding! Here is our full sample gallery and package guide from ${company}.`
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

export function getNicheLogoHtml(nicheType: NicheType): string {
  let icon = '✨';
  let bgColor = '#3B82F6'; // Default Blue
  let nicheLabel = 'Digital Transformation';
  
  switch (nicheType) {
    case 'restaurant':
      icon = '🍽️';
      bgColor = '#F97316'; // Orange
      nicheLabel = 'Gastronomie & Restauration';
      break;
    case 'real_estate':
      icon = '🏠';
      bgColor = '#0EA5E9'; // Sky Blue
      nicheLabel = 'Immobilier & Visites';
      break;
    case 'dentist':
      icon = '🦷';
      bgColor = '#0D9488'; // Teal
      nicheLabel = 'Cabinet Dentaire Esthétique';
      break;
    case 'law_firm':
      icon = '⚖️';
      bgColor = '#7F1D1D'; // Burgundy
      nicheLabel = 'Cabinet Juridique';
      break;
    case 'accountant':
      icon = '📊';
      bgColor = '#16A34A'; // Green
      nicheLabel = 'Expertise Comptable';
      break;
    case 'plumbing':
      icon = '🔧';
      bgColor = '#2563EB'; // Royal Blue
      nicheLabel = 'Plomberie & Chauffage';
      break;
    case 'electrical':
      icon = '⚡';
      bgColor = '#EAB308'; // Amber
      nicheLabel = 'Électricité & Énergie';
      break;
    case 'locksmith':
      icon = '🔑';
      bgColor = '#D97706'; // Gold
      nicheLabel = 'Serrurerie & Sécurité';
      break;
    case 'disaster_restoration':
      icon = '🛡️';
      bgColor = '#DC2626'; // Red
      nicheLabel = 'Rénovation après Sinistre';
      break;
    case 'driving_school':
      icon = '🚗';
      bgColor = '#4F46E5'; // Indigo
      nicheLabel = 'Auto-École';
      break;
    case 'funeral_home':
      icon = '🕊️';
      bgColor = '#64748B'; // Slate
      nicheLabel = 'Services Funéraires';
      break;
    case 'dog_groomer':
      icon = '🐕';
      bgColor = '#EC4899'; // Pink
      nicheLabel = 'Toilettage Canin';
      break;
    case 'photographer':
      icon = '📸';
      bgColor = '#8B5CF6'; // Violet
      nicheLabel = 'Studio Photographie';
      break;
    default:
      icon = '✨';
      bgColor = '#3B82F6';
      nicheLabel = 'Partenaire Digital';
      break;
  }

  return `
    <div style="margin-bottom: 4px; text-align: center;">
      <div style="font-size: 42px; line-height: 1; text-align: center; display: inline-block;">
        ${icon}
      </div>
      <div style="color: #64748B; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 6px;">
        ${nicheLabel}
      </div>
    </div>
  `;
}

export interface NicheProofDoc {
  clientName: string;
  docNum: string;
  title: string;
  bigMetric: string;
  subText: string;
  bullet1: string;
  bullet2: string;
  badge: string;
  icon: string;
}

export function getNicheProofDocs(nicheType: NicheType, lang: Language = 'fr'): NicheProofDoc[] {
  if (lang === 'fr') {
    switch (nicheType) {
      case 'restaurant':
        return [
          {
            clientName: "Bistro Le Gabriel (Paris 8e)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Réservations Tables & Groupes 24/7",
            bigMetric: "+48 Tables / mois",
            subText: "Bot WhatsApp & Web d'accueil automatique",
            bullet1: "• +120 convives réservés en autonomie 24/7",
            bullet2: "• Rappels SMS automatiques (-95% de no-show)",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Brasserie L'Épicure (Lyon)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Automatisation Menus & Banquets",
            bigMetric: "14,5 h / sem. gagnées",
            subText: "Envoi automatique de devis privatifs",
            bullet1: "• Confirmation instantanée des réservations",
            bullet2: "• Intégration en direct avec le cahier de salle",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Ristorante Bella Vista (Nice)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Chiffre d'Affaires Repas & Banquets",
            bigMetric: "+8 400 € / mois",
            subText: "Conversion en hausse sur les privatisations",
            bullet1: "• +38% de soirées de groupes conclues",
            bullet2: "• Monétisation immédiate des appels manqués",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'disaster_restoration':
        return [
          {
            clientName: "SDR Sinistres Express (Marseille)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Réception Urgence Sinistres 24/7",
            bigMetric: "+19 Sinistres / mois",
            subText: "Dépannage & secours dégâts des eaux",
            bullet1: "• Prise en charge immédiate nuit et week-end",
            bullet2: "• Collecte automatique des photos de l'assuré",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Aquitaine Assainissement (Bordeaux)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Transmission Rapports Assurances",
            bigMetric: "22,0 h / sem. gagnées",
            subText: "Saisie automatique des constats de dégâts",
            bullet1: "• Rapprochement instantané avec les experts",
            bullet2: "• Classification automatique par degré d'urgence",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Secours Habitat IDF (Versailles)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Volume d'Affaires Chantiers",
            bigMetric: "+34 500 € / mois",
            subText: "Captation intégrale des chantiers d'urgence",
            bullet1: "• Taux de transformation des secours : 94%",
            bullet2: "• Paiement acompte accéléré par signature eIDAS",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'plumbing':
        return [
          {
            clientName: "Plomberie Martin & Fils (Toulouse)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Relance Appels Manqués Dépannage",
            bigMetric: "+32 Interventions / mo",
            subText: "Système SMS/WhatsApp de secours 5s",
            bullet1: "• Conversion automatique des fuites urgentes",
            bullet2: "• Localisation & description panne pré-remplies",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Savoie Dépannage Eau (Chambéry)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Planning Plombiers & Devis",
            bigMetric: "16,5 h / sem. gagnées",
            subText: "Prise de créneau autonome géolocalisée",
            bullet1: "• Plus de coupure téléphonique sur les chantiers",
            bullet2: "• Envoi automatique de devis chauffe-eau",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Azur Chauffage Sanitaire (Cannes)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Progression Chiffre d'Affaires",
            bigMetric: "+11 200 € / mois",
            subText: "Boost des urgences & installations PAC",
            bullet1: "• +32% de hausse du panier moyen dépannage",
            bullet2: "• Encaissement immédiat des devis acceptés",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'driving_school':
        return [
          {
            clientName: "Auto-École Capitole (Lille)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Inscriptions Permis 24/7",
            bigMetric: "+55 Élèves / mois",
            subText: "Bot WhatsApp & Test d'Évaluation",
            bullet1: "• Inscription candidats accélérée et autonome",
            bullet2: "• Réponses instantanées aux demandes NEPH/CPF",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Permis Express Voltz (Strasbourg)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Gestion Planning Moniteurs",
            bigMetric: "20,0 h / sem. gagnées",
            subText: "Collecte dossiers numérisée à 100%",
            bullet1: "• Réservations d'heures de conduite en ligne",
            bullet2: "• Rappels de cours automatiques 24h avant",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Conduite Sérénité (Nantes)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Ventes Forfaits Accélérés",
            bigMetric: "+14 800 € / mois",
            subText: "Conversion accrue des permis B, BVA & CPF",
            bullet1: "• +40% de souscriptions aux forfaits permis premium",
            bullet2: "• Taux d'abandon de dossier réduit à quasi zéro",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'electrical':
        return [
          {
            clientName: "Électricité Bernard & Cie (Rennes)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Demandes Bornes IRVE & Domotique",
            bigMetric: "+28 Chantiers / mois",
            subText: "Diagnostic Électrique Interactif Web",
            bullet1: "• Pré-audit de conformité tableau électrique 24/7",
            bullet2: "• Captation des demandes d'installation IRVE",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Savoie Watt & Elec (Grenoble)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Chiffrage & Photos Compteur",
            bigMetric: "15,0 h / sem. gagnées",
            subText: "Pré-devis automatique sur photos client",
            bullet1: "• Suppression des déplacements d'audit inutiles",
            bullet2: "• Saisie conforme norme NF C 15-100",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Provencale Énergie (Aix-en-Provence)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Marge Chantiers Résidentiels",
            bigMetric: "+12 600 € / mois",
            subText: "Contrats haute valeur ajoutée signés",
            bullet1: "• +29% sur le montant moyen des devis acceptés",
            bullet2: "• Signature électronique immédiate",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'locksmith':
        return [
          {
            clientName: "Serrurerie Clés D'Or (Paris 11e)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Urgence Portes Claquées 24/7",
            bigMetric: "+41 Lockouts / mois",
            subText: "Bot SMS de secours 5-secondes",
            bullet1: "• Conversion immédiate des personnes bloquées",
            bullet2: "• Envoi de tarif & géolocalisation automatique",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Serrurerie Moderne (Montpellier)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Dispatch Techniciens & Photos",
            bigMetric: "12,0 h / sem. gagnées",
            subText: "Identification automatique du canon",
            bullet1: "• Transmission de la photo de serrure sur le mobile",
            bullet2: "• Zéro appel téléphonique perturbateur sur la route",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Securibat Protection (Toulon)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Vente Blindages & Serrures 3P",
            bigMetric: "+9 400 € / mois",
            subText: "Up-sells sécurisation post-dépannage",
            bullet1: "• +50% de taux de conversion sur les blindages",
            bullet2: "• Encaissement CB immédiat sur place via lien",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'law_firm':
        return [
          {
            clientName: "Cabinet Juridique Lex (Bordeaux)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Accueil Juridique Confidentiel",
            bigMetric: "+22 Dossiers / mois",
            subText: "Qualification Préalable 24/7 en Ligne",
            bullet1: "• Questionnaire d'analyse de litige interactif",
            bullet2: "• Prise de rendez-vous de consultation payante",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Juris Avocats Associés (Lyon)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Collecte Pièces & Conflits",
            bigMetric: "24,0 h / sem. gagnées",
            subText: "Vérification des conflits d'intérêts",
            bullet1: "• Dossier client complet réuni avant le 1er RDV",
            bullet2: "• Convention d'honoraires pré-remplie",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Cabinet Moreau & Partenaires (Paris)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Honoraires & Retainers Cabinet",
            bigMetric: "+28 000 € / mois",
            subText: "Signature accélérée des conventions",
            bullet1: "• +35% de hausse des honoraires facturés",
            bullet2: "• Paiement automatique des provisions d'honoraires",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'real_estate':
        return [
          {
            clientName: "Agence Immobilier Prestige (Cannes)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Capture Acquéreurs Video Tours",
            bigMetric: "+38 Acheteurs / mois",
            subText: "Visites virtuelles 3D & Bot WhatsApp",
            bullet1: "• Distribution instantanée des fiches vidéo",
            bullet2: "• Test d'éligibilité au crédit acheteur",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Haussmann & Associés (Paris 16e)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Filtrage Visites Physiques",
            bigMetric: "26,0 h / sem. gagnées",
            subText: "Élimination des visites sans offre",
            bullet1: "• Seuls les acheteurs qualifiés visitent sur place",
            bullet2: "• Envoi automatique d'offres d'achat en ligne",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Azur Invest Immobilier (Nice)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Commissions Mandats Exclusifs",
            bigMetric: "+45 000 € Comm. / mo",
            subText: "Taux de signature de mandats multiplié",
            bullet1: "• +52% de prise de mandats exclusifs en RDV",
            bullet2: "• Vente des biens 3x plus rapide grâce au drone 3D",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'accountant':
        return [
          {
            clientName: "Cabinet Comptable Audit (Nantes)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Onboarding Client 100% Digital",
            bigMetric: "+30 Nouveaux Clients / mo",
            subText: "Lancement Dossier sans papier en 3 min",
            bullet1: "• Extractions KBIS & vérifications KYC en direct",
            bullet2: "• Signature eIDAS de la Lettre de Mission",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Fiduciaire Expert conseil (Lille)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "OCR TVA & Synchro Banque",
            bigMetric: "32,0 h / sem. gagnées",
            subText: "Factures & flux bancaires automatisés",
            bullet1: "• Relances intelligentes des pièces manquantes par SMS",
            bullet2: "• Zéro saisie manuelle pour les collaborateurs",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Alliance Compta Finance (Toulouse)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Chiffre Récurrent Honoraires",
            bigMetric: "+18 500 € MRR / mois",
            subText: "Ventes de packages DAF Virtuel & Conseil",
            bullet1: "• +42% de valeur annuelle par dossier client",
            bullet2: "• Marge opérationnelle du cabinet augmentée de 38%",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'funeral_home':
        return [
          {
            clientName: "Pompes Funèbres Sérénité (Strasbourg)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Accompagnement Familles 24/7",
            bigMetric: "+16 Familles Aidées / mo",
            subText: "Service d'Accueil Bienveillant H24",
            bullet1: "• Réponse immédiate aux démarches d'urgence",
            bullet2: "• Prise en charge avec écoute et zéro attente",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Maison Funéraire D'Alsace (Mulhouse)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Formalités Mairie & Cérémonie",
            bigMetric: "18,0 h / sem. gagnées",
            subText: "Saisie numérisée des choix de la famille",
            bullet1: "• Registre de condoléances digital instantané",
            bullet2: "• Transmission administrative simplifiée",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Services Funèbres De L'Ouest (Rennes)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Contrats Prévoyance Obsèques",
            bigMetric: "+15 200 € / mois",
            subText: "Souscriptions en ligne en toute clarté",
            bullet1: "• Devis personnalisés transparents en 2 minutes",
            bullet2: "• Taux de satisfaction & confiance familles : 100%",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'dog_groomer':
        return [
          {
            clientName: "Salon Canin Toutou Chic (Nice)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Réservations Toilettage 24/7",
            bigMetric: "+64 Soins / mois",
            subText: "Rappels Automatiques Entretien Pelage",
            bullet1: "• Réservations autonomes par race & gabarit",
            bullet2: "• Bot WhatsApp de confirmation de RDV",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Grooming & Spa Canin (Paris 15e)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Sérénité en Salon & SMS Prêt",
            bigMetric: "14,0 h / sem. gagnées",
            subText: "Fin du téléphone pendant la tonte",
            bullet1: "• SMS automatique : 'Votre chien est prêt !'",
            bullet2: "• Gestion autonome des reports par les maîtres",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Au Toutou Royal (Lyon)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Vente Soins Spa & Anti-No-Show",
            bigMetric: "+5 800 € / mois",
            subText: "Baisse des rendez-vous oubliés de 92%",
            bullet1: "• Vente de suppléments démêlage & bain bouillonnant",
            bullet2: "• Carnet de rendez-vous rempli 3 semaines à l'avance",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'photographer':
        return [
          {
            clientName: "Studio Photo Lumina (Bordeaux)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Shootings & Portfolio Instantané",
            bigMetric: "+24 Shootings / mois",
            subText: "Réponse sous 5s avec Galerie Interactive",
            bullet1: "• Devis automatique mariages, portraits & corporate",
            bullet2: "• Réservation avec acompte CB en direct",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Atelier Photographique Riva (Marseille)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Contrats Droit d'Image & Calendrier",
            bigMetric: "16,0 h / sem. gagnées",
            subText: "Signature contrat mobile en 1 clic",
            bullet1: "• Synchronisation automatique des dates de shooting",
            bullet2: "• Transmission automatisée des accès galeries web",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Lumière & Mariage Studio (Toulouse)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Ventes Albums & Tirages Luxe",
            bigMetric: "+11 800 € / mois",
            subText: "Conversion demandes mariages & entreprises",
            bullet1: "• +48% de hausse de taux de signature de devis",
            bullet2: "• Ventes additionnelles d'albums haute qualité",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      case 'dentist':
        return [
          {
            clientName: "Cabinet Dentaire Esthétique D'Opéra (Paris)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Simulateur Sourire Facettes AI",
            bigMetric: "+36 Consults / mois",
            subText: "Transformation SourireVirtuel en 60s",
            bullet1: "• Les patients voient leurs facettes sur leur smartphone",
            bullet2: "• Prise de RDV esthétique en direct dans le widget",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Clinique Dentaire Riviera (Cannes)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Secrétariat Dentaire & Photos",
            bigMetric: "21,0 h / sem. gagnées",
            subText: "Collecte photo pré-consultation auto",
            bullet1: "• Questionnaire médical pré-rempli sur mobile",
            bullet2: "• Relances SMS pré-consultation esthétique",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Centre Dentaire Vauban (Lille)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "CA Soins Esthétiques & Facettes",
            bigMetric: "+32 000 € / mois",
            subText: "Acceptation des plans de traitement x3.5",
            bullet1: "• +310% de patients signant leurs facettes en porcelaine",
            bullet2: "• ROI rentabilisé dès le 1er plan de traitement accepté",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
      default:
        return [
          {
            clientName: "Apex Digital Services (Paris)",
            docNum: "RAPPORT #01 • GAIN CLIENTS",
            title: "Capture Leads & Contacts 24/7",
            bigMetric: "+42 Clients / mois",
            subText: "Moteur Inbound Web & WhatsApp",
            bullet1: "• Réponse sous 5 secondes à toutes les demandes",
            bullet2: "• Qualification automatique des besoins prospects",
            badge: "✓ Preuve Attestée ASSIX",
            icon: "📄"
          },
          {
            clientName: "Nexus Enterprise Systems (Lyon)",
            docNum: "RAPPORT #02 • GAIN DE TEMPS",
            title: "Automatisation Admin & Devis",
            bigMetric: "20,0 h / sem. gagnées",
            subText: "Zéro tâche répétitive ou relance manuelle",
            bullet1: "• Envoi de devis & prise de RDV automatique",
            bullet2: "• Synchronisation complète des données clients",
            badge: "⚡ Gain de Temps Certifié",
            icon: "⏱️"
          },
          {
            clientName: "Vanguard Solutions (Marseille)",
            docNum: "RAPPORT #03 • REVENU GÉNÉRÉ",
            title: "Croissance Chiffre d'Affaires",
            bigMetric: "+16 400 € / mois",
            subText: "Conversion des opportunités manquées",
            bullet1: "• +38% de chiffre d'affaires mesuré chez nos clients",
            bullet2: "• Rentabilisation immédiate du trafic entrant",
            badge: "💰 ROI Vainqueur Certifié",
            icon: "💰"
          }
        ];
    }
  } else {
    // English Version
    switch (nicheType) {
      case 'restaurant':
        return [
          {
            clientName: "The Grand Bistro & Grill",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "24/7 Table & Group Bookings",
            bigMetric: "+48 Tables / month",
            subText: "Automated WhatsApp & Web Guest Assistant",
            bullet1: "• +120 guests booked on autopilot 24/7",
            bullet2: "• Automated SMS reminders (-95% no-shows)",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Harborview Steakhouse",
            docNum: "DOC #02 • TIME SAVED",
            title: "Banquet & Menu Automation",
            bigMetric: "14.5 hrs / wk saved",
            subText: "Instant private party quote generator",
            bullet1: "• Instant table reservation confirmations",
            bullet2: "• Direct sync with floor management software",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Bella Italia Ristorante",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "Monthly Banquet & Dining Turnover",
            bigMetric: "+$8,400 / month",
            subText: "Surge in private event conversions",
            bullet1: "• +38% increase in booked group banquets",
            bullet2: "• Immediate capture of off-hour inquiries",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
      case 'disaster_restoration':
        return [
          {
            clientName: "Rapid Response Restoration Co.",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "24/7 Emergency Disaster Intake",
            bigMetric: "+19 Claims / month",
            subText: "Water damage & fire restoration engine",
            bullet1: "• Immediate intake on nights & weekends",
            bullet2: "• Automatic customer photo & damage collection",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Apex Emergency Water Damage",
            docNum: "DOC #02 • TIME SAVED",
            title: "Insurance Report Automation",
            bigMetric: "22.0 hrs / wk saved",
            subText: "Instant claim & loss report generation",
            bullet1: "• Direct sync with insurance adjusters",
            bullet2: "• Automated emergency severity triage",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Metro Restoration Services",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "Restoration Project Revenue",
            bigMetric: "+$34,500 / month",
            subText: "Zero lost high-ticket emergency calls",
            bullet1: "• 94% emergency claim close rate",
            bullet2: "• Accelerated deposit collection via digital sign",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
      case 'plumbing':
        return [
          {
            clientName: "Premier Plumbing & Drain Co.",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "Missed Call Emergency Converter",
            bigMetric: "+32 Jobs / month",
            subText: "5-Second SMS/WhatsApp Rescue Bot",
            bullet1: "• Auto-conversion of urgent leak inquiries",
            bullet2: "• Pre-filled issue photo & location capture",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Highland Heating & Plumbing",
            docNum: "DOC #02 • TIME SAVED",
            title: "Plumber Schedule & Quote Dispatch",
            bigMetric: "16.5 hrs / wk saved",
            subText: "Geo-located self-scheduling portal",
            bullet1: "• Zero phone interruptions while on job site",
            bullet2: "• Automated water heater quote dispatch",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Cascade Mechanical Services",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "Monthly Plumbing Turnover",
            bigMetric: "+$11,200 / month",
            subText: "Surge in high-margin emergency jobs",
            bullet1: "• +32% increase in average ticket size",
            bullet2: "• Immediate online deposit payment",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
      case 'driving_school':
        return [
          {
            clientName: "Summit Driving Academy",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "24/7 Driving Student Intake",
            bigMetric: "+55 Students / month",
            subText: "WhatsApp Bot & Initial Evaluation Test",
            bullet1: "• Accelerated self-service student enrollment",
            bullet2: "• Instant answers to license package questions",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Pacific Coast Driving School",
            docNum: "DOC #02 • TIME SAVED",
            title: "Instructor Schedule & ID Intake",
            bigMetric: "20.0 hrs / wk saved",
            subText: "100% Paperless student onboarding",
            bullet1: "• Self-service driving lesson booking portal",
            bullet2: "• Automated 24h SMS lesson reminders",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Metro Auto Academy",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "License Package Sales Growth",
            bigMetric: "+$14,800 / month",
            subText: "Boost in accelerated & automatic license sales",
            bullet1: "• +40% increase in premium package enrollments",
            bullet2: "• Student drop-out rate cut to near zero",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
      case 'electrical':
        return [
          {
            clientName: "VoltMaster Electrical Services",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "EV Charger & Smart Home Inquiries",
            bigMetric: "+28 Projects / month",
            subText: "Interactive Electrical Audit Tool",
            bullet1: "• 24/7 Panel compliance pre-assessment",
            bullet2: "• Direct capture of EV charger installation leads",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Tri-County Electric & Solar",
            docNum: "DOC #02 • TIME SAVED",
            title: "Photo Estimate & Site Prep",
            bigMetric: "15.0 hrs / wk saved",
            subText: "Automated quote draft from panel photos",
            bullet1: "• Elimination of unnecessary audit trips",
            bullet2: "• National code compliance validation",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Beacon Electrical Contractors",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "Electrical Project Turnover",
            bigMetric: "+$12,600 / month",
            subText: "Surge in high-margin installation sales",
            bullet1: "• +29% increase in average ticket size",
            bullet2: "• Instant e-signature for proposals",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
      case 'locksmith':
        return [
          {
            clientName: "Golden Key Locksmiths",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "24/7 Lockout Emergency Capture",
            bigMetric: "+41 Interventions / mo",
            subText: "5-Second SMS Rescue Assistant",
            bullet1: "• Instant conversion of stranded clients",
            bullet2: "• Automated pricing & GPS location dispatch",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Metro Security & Lock",
            docNum: "DOC #02 • TIME SAVED",
            title: "Tech Dispatch & Photo ID",
            bigMetric: "12.0 hrs / wk saved",
            subText: "Automatic lock type identification",
            bullet1: "• Lock image forwarded directly to technician mobile",
            bullet2: "• Zero driving phone calls or delays",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Guardian Lock & Armoring",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "Armoring & High-Security Sales",
            bigMetric: "+$9,400 / month",
            subText: "Up-sells on multi-point locks & armoring",
            bullet1: "• +50% conversion on post-lockout security upgrades",
            bullet2: "• Instant on-site credit card link payment",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
      case 'law_firm':
        return [
          {
            clientName: "Lexington Legal Group",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "Confidential Legal Client Intake",
            bigMetric: "+22 Cases / month",
            subText: "24/7 Online Dispute Qualification",
            bullet1: "• Interactive case screening questionnaire",
            bullet2: "• Paid initial consultation scheduling",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Sterling & Partners Attorneys",
            docNum: "DOC #02 • TIME SAVED",
            title: "Conflict Check & Document Intake",
            bigMetric: "24.0 hrs / wk saved",
            subText: "Automated background conflict checks",
            bullet1: "• Complete client file gathered prior to 1st meeting",
            bullet2: "• Pre-filled retainer & engagement agreement",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Vanguard Legal Counsel",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "Monthly Firm Billings & Retainers",
            bigMetric: "+$28,000 / month",
            subText: "Accelerated agreement signatures",
            bullet1: "• +35% overall increase in billed fees",
            bullet2: "• Automatic initial retainer fee collection",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
      case 'real_estate':
        return [
          {
            clientName: "Prestige Real Estate Group",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "24/7 Buyer Video Tour Capture",
            bigMetric: "+38 Buyers / month",
            subText: "3D Drone Walkthroughs & WhatsApp Bot",
            bullet1: "• Instant automated property video delivery",
            bullet2: "• Pre-screening of buyer financing & readiness",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Harbor & Coast Properties",
            docNum: "DOC #02 • TIME SAVED",
            title: "Physical Showing Qualification",
            bigMetric: "26.0 hrs / wk saved",
            subText: "Elimination of unqualified site visits",
            bullet1: "• Showing schedule reserved exclusively for vetted buyers",
            bullet2: "• Automated post-showing offer collection",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Skyline Exclusive Realty",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "Exclusive Listing Commissions",
            bigMetric: "+$45,000 Comm. / mo",
            subText: "Surge in signed exclusive mandates",
            bullet1: "• +52% increase in listing pitch win rate",
            bullet2: "• 3x faster property closing velocity",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
      case 'accountant':
        return [
          {
            clientName: "Apex Financial & CPA Services",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "100% Digital Client Onboarding",
            bigMetric: "+30 New Clients / mo",
            subText: "3-Minute paperless client setup",
            bullet1: "• Instant business ID & KYC verification",
            bullet2: "• Certified eIDAS signature for Engagement Letter",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Benchmark Tax & Accounting",
            docNum: "DOC #02 • TIME SAVED",
            title: "OCR Invoice & Bank Feed Sync",
            bigMetric: "32.0 hrs / wk saved",
            subText: "Automated receipt & bank reconciliation",
            bullet1: "• Intelligent automated SMS reminders for missing documents",
            bullet2: "• Zero manual data entry for staff accountants",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Summit Financial Advisory",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "Monthly Recurring Practice MRR",
            bigMetric: "+$18,500 MRR / month",
            subText: "Virtual CFO & Advisory Package Sales",
            bullet1: "• +42% higher annual engagement fee per client",
            bullet2: "• Firm operating margin boosted by 38 points",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
      case 'funeral_home':
        return [
          {
            clientName: "Serenity Memorial Services",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "24/7 Compassionate Family Care",
            bigMetric: "+16 Families Served / mo",
            subText: "Dignified 24/7 Digital Assistant",
            bullet1: "• Instant guidance during urgent grief moments",
            bullet2: "• Zero phone delay or administrative friction",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Heritage Funeral Home",
            docNum: "DOC #02 • TIME SAVED",
            title: "Ceremony & Logistics Intake",
            bigMetric: "18.0 hrs / wk saved",
            subText: "Paperless family preferences collection",
            bullet1: "• Instant digital guestbook & memorial page",
            bullet2: "• Automated municipal paperwork sync",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Graceful Rest Memorials",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "Pre-Need Plan & Service Revenue",
            bigMetric: "+$15,200 / month",
            subText: "Growth in transparent pre-plan sales",
            bullet1: "• Clear, transparent online estimate builder",
            bullet2: "• 100% family trust & satisfaction rating",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
      case 'dog_groomer':
        return [
          {
            clientName: "Paws & Whiskers Luxury Spa",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "24/7 Pet Grooming Bookings",
            bigMetric: "+64 Appointments / mo",
            subText: "Automated Breed-Based Care Reminders",
            bullet1: "• Self-service booking by dog breed & size",
            bullet2: "• Instant WhatsApp booking confirmation",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Bark & Groom Pet Salon",
            docNum: "DOC #02 • TIME SAVED",
            title: "Salon Quietude & Pickup SMS",
            bigMetric: "14.0 hrs / wk saved",
            subText: "Zero phone ringing during grooming cuts",
            bullet1: "• Auto SMS: 'Your pet is ready for pickup!' • Pre-filled questionnaire",
            bullet2: "• Self-service appointment rescheduling & SMS reminders",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Downtown Dental Specialists",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "Cosmetic Dental Case Revenue",
            bigMetric: "+$32,000 / month",
            subText: "3.5x increase in veneer case acceptance",
            bullet1: "• +310% increase in signed porcelain veneer cases",
            bullet2: "• Full ROI paid back from the very first accepted case",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
      default:
        return [
          {
            clientName: "Apex Global Growth",
            docNum: "DOC #01 • CLIENT GROWTH",
            title: "24/7 Inbound Lead Engine",
            bigMetric: "+42 Clients / month",
            subText: "Multi-Channel Web & WhatsApp Capture",
            bullet1: "• 5-second response time to all prospect inquiries",
            bullet2: "• Automated prospect qualification & routing",
            badge: "✓ ASSIX Verified Proof",
            icon: "📄"
          },
          {
            clientName: "Nexus Enterprise Tech",
            docNum: "DOC #02 • TIME SAVED",
            title: "Admin & Quote Automation",
            bigMetric: "20.0 hrs / wk saved",
            subText: "Zero repetitive manual follow-up tasks",
            bullet1: "• Automated quote dispatch & appointment booking",
            bullet2: "• Full data sync across business tools",
            badge: "⚡ Time Saved Audit",
            icon: "⏱️"
          },
          {
            clientName: "Vanguard Business Systems",
            docNum: "DOC #03 • REVENUE GAIN",
            title: "Monthly Business Revenue Surge",
            bigMetric: "+$16,400 / month",
            subText: "Monetization of missed calls & prospects",
            bullet1: "• +38% overall measured client revenue growth",
            bullet2: "• Instant monetization of existing web traffic",
            badge: "💰 Certified ROI Result",
            icon: "💰"
          }
        ];
    }
  }
}

export function getNicheProofSection(nicheType: NicheType, company: string, lang: Language = 'fr'): string {
  const docs = getNicheProofDocs(nicheType, lang);

  const sectionHeading = lang === 'fr' 
    ? `RÉSULTATS CERTIFIÉS & GAINS MESURÉS` 
    : `VERIFIED CLIENT PROOF & ROI CERTIFICATES`;
  const sectionTitle = lang === 'fr'
    ? `3 Preuves Documentées de Performance pour ${company}`
    : `3 Documented Proofs of Improvement for ${company}`;
  const sectionSub = lang === 'fr'
    ? `Exemples réels de résultats mesurés chez nos clients (Gain de clients, Temps économisé & Chiffre d'affaires généré) :`
    : `Real performance metrics measured for clients in your industry (Adding clients, Saving time & Making money):`;

  return `
  <!-- VERIFIED 3 PROOF DOCUMENTS SECTION (LIGHT BACKDROP WITH CLEAN WHITE CARDS) -->
  <tr>
    <td style="padding: 28px 20px; background-color: #F8FAFC; border-top: 2px solid #E2E8F0; border-bottom: 2px solid #E2E8F0; border-radius: 0px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="background-color: #EEF2FF; color: #3b82f6; font-size: 10px; font-weight: 800; padding: 6px 14px; border-radius: 20px; border: 1px solid #C7D2FE; text-transform: uppercase; letter-spacing: 0.08em; display: inline-block;">
          📂 ${sectionHeading}
        </span>
        <h3 style="color: #0F172A; font-size: 17px; font-weight: 800; margin: 10px 0 4px 0; letter-spacing: -0.01em;">
          ${sectionTitle}
        </h3>
        <p style="color: #475569; font-size: 11.5px; margin: 0; max-width: 520px; display: inline-block; line-height: 1.5;">
          ${sectionSub}
        </p>
      </div>

      <!-- 3 LIGHT DOCUMENT CARDS GRID -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <!-- DOC 1: ADDING CLIENTS -->
          <td width="33.33%" valign="top" style="padding: 5px;">
            <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); text-align: left;">
              <!-- Header with Big Company Name -->
              <div style="border-bottom: 1px solid #F1F5F9; padding-bottom: 6px; margin-bottom: 8px;">
                <div style="color: #0F172A; font-size: 13px; font-weight: 800; letter-spacing: -0.01em;">🏢 ${docs[0].clientName}</div>
              </div>
              <div style="color: #64748B; font-size: 9.5px; font-weight: 700; text-transform: uppercase; margin-bottom: 3px;">
                ${docs[0].title}
              </div>
              <div style="color: #2563EB; font-size: 17px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.02em;">
                ${docs[0].bigMetric}
              </div>
              <div style="color: #1E293B; font-size: 10px; font-weight: 600; line-height: 1.35; margin-bottom: 8px; background-color: #F8FAFC; padding: 6px; border-radius: 6px; border: 1px solid #E2E8F0;">
                ${docs[0].subText}
              </div>
              <div style="color: #475569; font-size: 9.5px; line-height: 1.4; margin-bottom: 8px;">
                <div style="margin-bottom: 3px;">${docs[0].bullet1}</div>
                <div>${docs[0].bullet2}</div>
              </div>
              <div style="padding: 3px 8px; background-color: #EFF6FF; border-radius: 12px; color: #1D4ED8; font-size: 8.5px; font-weight: 700; display: inline-block; border: 1px solid #BFDBFE;">
                ${docs[0].badge}
              </div>
            </div>
          </td>

          <!-- DOC 2: SAVING TIME -->
          <td width="33.33%" valign="top" style="padding: 5px;">
            <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); text-align: left;">
              <!-- Header with Big Company Name -->
              <div style="border-bottom: 1px solid #F1F5F9; padding-bottom: 6px; margin-bottom: 8px;">
                <div style="color: #0F172A; font-size: 13px; font-weight: 800; letter-spacing: -0.01em;">🏢 ${docs[1].clientName}</div>
              </div>
              <div style="color: #64748B; font-size: 9.5px; font-weight: 700; text-transform: uppercase; margin-bottom: 3px;">
                ${docs[1].title}
              </div>
              <div style="color: #7C3AED; font-size: 17px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.02em;">
                ${docs[1].bigMetric}
              </div>
              <div style="color: #1E293B; font-size: 10px; font-weight: 600; line-height: 1.35; margin-bottom: 8px; background-color: #F8FAFC; padding: 6px; border-radius: 6px; border: 1px solid #E2E8F0;">
                ${docs[1].subText}
              </div>
              <div style="color: #475569; font-size: 9.5px; line-height: 1.4; margin-bottom: 8px;">
                <div style="margin-bottom: 3px;">${docs[1].bullet1}</div>
                <div>${docs[1].bullet2}</div>
              </div>
              <div style="padding: 3px 8px; background-color: #F3E8FF; border-radius: 12px; color: #6D28D9; font-size: 8.5px; font-weight: 700; display: inline-block; border: 1px solid #DDD6FE;">
                ${docs[1].badge}
              </div>
            </div>
          </td>

          <!-- DOC 3: MAKING MONEY -->
          <td width="33.33%" valign="top" style="padding: 5px;">
            <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); text-align: left;">
              <!-- Header with Big Company Name -->
              <div style="border-bottom: 1px solid #F1F5F9; padding-bottom: 6px; margin-bottom: 8px;">
                <div style="color: #0F172A; font-size: 13px; font-weight: 800; letter-spacing: -0.01em;">🏢 ${docs[2].clientName}</div>
              </div>
              <div style="color: #64748B; font-size: 9.5px; font-weight: 700; text-transform: uppercase; margin-bottom: 3px;">
                ${docs[2].title}
              </div>
              <div style="color: #059669; font-size: 17px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.02em;">
                ${docs[2].bigMetric}
              </div>
              <div style="color: #1E293B; font-size: 10px; font-weight: 600; line-height: 1.35; margin-bottom: 8px; background-color: #F8FAFC; padding: 6px; border-radius: 6px; border: 1px solid #E2E8F0;">
                ${docs[2].subText}
              </div>
              <div style="color: #475569; font-size: 9.5px; line-height: 1.4; margin-bottom: 8px;">
                <div style="margin-bottom: 3px;">${docs[2].bullet1}</div>
                <div>${docs[2].bullet2}</div>
              </div>
              <div style="padding: 3px 8px; background-color: #ECFDF5; border-radius: 12px; color: #047857; font-size: 8.5px; font-weight: 700; display: inline-block; border: 1px solid #A7F3D0;">
                ${docs[2].badge}
              </div>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;
}

/**
 * Resolves the Netlify hosted demo link for each niche
 */
export function getNetlifyNicheDemoUrl(nicheType: NicheType): string {
  const map: Record<string, string> = {
    real_estate: 'https://nestarealreach.netlify.app',
    law_firm: 'https://nestademos.netlify.app/avocat.html',
    driving_school: 'https://nestademos.netlify.app/auto-ecole.html',
    coiffeur: 'https://nestademos.netlify.app/coiffeur.html',
    conciergerie: 'https://nestademos.netlify.app/conciergerie.html',
    couvreur: 'https://nestademos.netlify.app/couvreur.html',
    electrical: 'https://nestademos.netlify.app/electricien.html',
    jardinier: 'https://nestademos.netlify.app/jardinier.html',
    dentist: 'https://nestademos.netlify.app/nail.html',
    dog_groomer: 'https://nestademos.netlify.app/coiffeur.html',
    plumbing: 'https://nestademos.netlify.app/plombier.html',
    disaster_restoration: 'https://nestademos.netlify.app/plombier.html',
    restaurant: 'https://nestademos.netlify.app/restaurant.html',
    locksmith: 'https://nestademos.netlify.app/serrurier.html',
    accountant: 'https://nestademos.netlify.app/traiteur.html',
    traiteur: 'https://nestademos.netlify.app/traiteur.html',
    photographer: 'https://nestademos.netlify.app/wedding.html',
    funeral_home: 'https://nestademos.netlify.app/avocat.html',
    general: 'https://nestademos.netlify.app/'
  };
  return map[nicheType] || 'https://nestademos.netlify.app/';
}

/**
 * Generates responsive inline HTML email for any lead matching the 8 niche templates
 */
export function getUpcomingBookingSlots(lang: 'fr' | 'en' = 'fr', baseDateInput?: Date | string) {
  const baseDate = baseDateInput && !isNaN(new Date(baseDateInput).getTime()) ? new Date(baseDateInput) : new Date();

  const getNextBusinessDay = (date: Date, offsetDays: number = 1): Date => {
    const result = new Date(date);
    let added = 0;
    while (added < offsetDays) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) {
        added++;
      }
    }
    return result;
  };

  const day1 = getNextBusinessDay(baseDate, 1);
  const day2 = getNextBusinessDay(baseDate, 2);

  const formatDay = (d: Date) => {
    if (lang === 'fr') {
      const daysFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      return daysFr[d.getDay()];
    } else {
      const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return daysEn[d.getDay()];
    }
  };

  const day1Name = formatDay(day1);
  const day2Name = formatDay(day2);

  return [
    {
      label: lang === 'fr' ? `${day1Name} 10h00` : `${day1Name} 10:00 AM`,
      hash: `book-${day1.toISOString().split('T')[0]}-1000`
    },
    {
      label: lang === 'fr' ? `${day1Name} 14h30` : `${day1Name} 2:30 PM`,
      hash: `book-${day1.toISOString().split('T')[0]}-1430`
    },
    {
      label: lang === 'fr' ? `${day2Name} 11h00` : `${day2Name} 11:00 AM`,
      hash: `book-${day2.toISOString().split('T')[0]}-1100`
    }
  ];
}

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
    customGifUrl?: string;
    gifUrl?: string;
    serverUrl?: string;
  } = {}
): { subject: string; html: string; text: string } {
  const nicheType = options.customNiche || resolveNicheType(lead.niche || lead.category || lead.sector || lead.searchKeyword);
  const template = NICHE_EMAIL_TEMPLATES[nicheType]?.[lang] || NICHE_EMAIL_TEMPLATES.general[lang];

  const rawCompany = lead.company || lead.name || lead.businessName || 'votre entreprise';
  const company = formatBusinessName(rawCompany);
  const companyUpper = rawCompany.toUpperCase();
  const contactName = formatBusinessName(lead.contactName || lead.businessName || lead.company || rawCompany);
  const firstName = contactName;
  
  const rawCity = lead.city || lead.location || lead.targetCountry || '';
  const cityClean = (rawCity && !rawCity.toLowerCase().includes('secteur') && !rawCity.toLowerCase().includes('sector')) ? rawCity : '';
  const cityPhrase = cityClean ? (lang === 'fr' ? `à ${cityClean}` : `in ${cityClean}`) : (lang === 'fr' ? 'dans la région' : 'in the area');

  const painPoint = options.customPainPoint || lead.gapSignal || lead.pitch || (lang === 'fr' ? 'Réponse instantanée 24/7 & accueil client personnalisé' : '24/7 instant response & personalized client welcome');
  const netlifyDemoUrl = getNetlifyNicheDemoUrl(nicheType);
  const demoLink = (options.customDemoLink && options.customDemoLink !== '#onboarding-demo' && !options.customDemoLink.startsWith('#')) ? options.customDemoLink : netlifyDemoUrl;
  const senderName = options.senderName || 'Anthony';
  const senderTitle = options.senderTitle || 'Directeur des Stratégies Digitales @ ASSIX';
  const assixBrand = options.brandName || 'ASSIX Agency';

  // Extract siteId for animated GIF generation
  let siteId = lead.siteId || lead.id || '';
  if (siteId && !siteId.startsWith('site_')) {
    siteId = '';
  }
  if (!siteId && lead.previewUrl) {
    const match = lead.previewUrl.match(/\/preview\/(site_[a-zA-Z0-9_]+)/);
    if (match) siteId = match[1];
  }
  if (!siteId && demoLink) {
    const match = demoLink.match(/\/preview\/(site_[a-zA-Z0-9_]+)/);
    if (match) siteId = match[1];
  }
  if (!siteId && lead.deployedWebsiteUrl) {
    const match = lead.deployedWebsiteUrl.match(/\/preview\/(site_[a-zA-Z0-9_]+)/);
    if (match) siteId = match[1];
  }

  const serverUrl = options.serverUrl || '';
  let gifUrl = lead.deployedWebsiteGif || lead.gifUrl || options.gifUrl || '';
  if (!gifUrl && (lead.deployedWebsiteUrl || options.customDemoLink || demoLink)) {
    const targetLink = lead.deployedWebsiteUrl || options.customDemoLink || demoLink;
    if (targetLink && targetLink.startsWith('http') && !targetLink.includes('#')) {
      gifUrl = `${serverUrl}/api/urlbox/gif?url=${encodeURIComponent(targetLink)}`;
    }
  }
  if (!gifUrl && siteId) {
    gifUrl = `${serverUrl}/api/website/${siteId}/preview.gif`;
  }

  const convo = getNicheConversations(nicheType, company, cityPhrase, lang);

  const vars: Record<string, string> = {
    company,
    companyUpper,
    contactName,
    firstName,
    city: cityClean || (lang === 'fr' ? 'votre ville' : 'your city'),
    painPoint,
    demoLink,
    senderName,
    senderTitle,
    brandName: company
  };

  const defaultFormHeader = lang === 'fr' ? `Bloquer un Échange de 5 min avec ${senderName}` : `Book a 5-min Call with ${senderName}`;
  const defaultFormSubheader = lang === 'fr' ? `Pas de long discours commercial : 5 minutes montre en main pour vous montrer la démo dédiée à ${company}.` : `No long sales pitches: 5 minutes sharp to show the live demo for ${company}.`;
  const defaultSecondaryCta = lang === 'fr' ? `⚡ Bloquer un créneau de 5 min` : `⚡ Book a 5-min Call`;

  const nicheDefaultIntro = getNicheIntroText(nicheType, company, cityPhrase, lang);

  const dynamicSlots = getUpcomingBookingSlots(lang, lead.createdAt || lead.lastEmailedAt || new Date());

  const rawIntroText = options.customHeroSubtitle || options.customBodyText || nicheDefaultIntro;
  const formattedIntroText = rawIntroText.includes('<') ? rawIntroText : rawIntroText.replace(/\n/g, '<br/>');

  const subject = interpolateVariables(options.customSubject || convo.emailSubject || template.subject, vars);
  const heroTitle = interpolateVariables(options.customHeroTitle || template.heroTitle, vars);
  const heroSubtitle = interpolateVariables(formattedIntroText, vars);
  const topPersonalizedHook = interpolateVariables(formattedIntroText, vars);
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

  // Green accent frame for all niches (Assix Green & Black Theme)
  const accentColor = '#10B981';

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
      border-right: 2px solid #10B981;
      animation: typingEffect 4s steps(35, end) infinite;
    }
    .typewriter-text-wa {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      max-width: 100%;
      border-right: 2px solid #25D366;
      animation: typingEffect 4.5s steps(40, end) infinite;
      vertical-align: bottom;
    }
    @media only screen and (max-width: 600px) {
      .email-main-card { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .email-cell { padding-left: 16px !important; padding-right: 16px !important; }
      .typewriter-text, .typewriter-text-wa { white-space: normal !important; animation: none !important; border-right: none !important; word-break: break-word !important; }
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
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 640px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 12px 20px; border-bottom: 1px solid #E2E8F0; border-top-left-radius: 24px; border-top-right-radius: 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #EF4444; margin-right: 6px;"></span>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #F59E0B; margin-right: 6px;"></span>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #10B981; margin-right: 12px;"></span>
                    <span style="color: #64748B; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">${company.toUpperCase()} • OUTREACH</span>
                  </td>
                  <td align="right">
                    <a href="${demoLink}" target="_blank" style="color: ${accentColor}; font-size: 11px; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">${lang === 'fr' ? 'Aperçu Démo Live ↗' : 'Live Demo Preview ↗'}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Header / Brand Banner (White Background, Frameless Emoji, No Big Agence Text) -->
          <tr>
            <td style="padding: 16px 24px 8px 24px; background-color: #FFFFFF; text-align: center;">
              ${getNicheLogoHtml(nicheType)}
            </td>
          </tr>

          <!-- Clean Personalized Intro Hook Bubble -->
          <tr>
            <td style="padding: 16px 24px 0 24px;">
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 18px; padding: 20px 24px; font-size: 14px; font-weight: 600; color: #0F172A; line-height: 1.6; box-shadow: 0 6px 20px rgba(0,0,0,0.06);">
                ${topPersonalizedHook}
              </div>
            </td>
          </tr>

          <!-- SECTION 1: WHATSAPP CHATBOT MOBILE UI -->
          <tr>
            <td style="padding: 20px 32px 0 32px;">
              <div style="background-color: #0B141A; border: 1px solid #1F2C34; border-radius: 20px; padding: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.25);">
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
                      <span style="background-color: rgba(37, 211, 102, 0.15); color: #25D366; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(37, 211, 102, 0.3);">
                        WHATSAPP
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- Chat Log -->
                <div style="space-y: 8px;">
                  <!-- System Notification -->
                  <div style="text-align: center; margin-bottom: 10px;">
                    <span style="background-color: #182229; color: #8696A0; font-size: 10px; padding: 4px 12px; border-radius: 20px; display: inline-block;">
                      ${lang === 'fr' ? 'Appel manqué à 14:32 — Relance automatique' : 'Missed call at 14:32 — Automatic reply'}
                    </span>
                  </div>

                  <!-- Customer Message (Incoming bubble) -->
                  <div style="background-color: #202C33; color: #E9EDEF; padding: 10px 12px; border-radius: 12px 12px 12px 2px; font-size: 12px; line-height: 1.4; margin-right: 18%; margin-bottom: 8px;">
                    <span class="typewriter-text-wa" style="border-right-color: #8696A0;">
                      ${convo.whatsappCustomer}
                    </span>
                    <div style="text-align: right; font-size: 9px; color: #8696A0; margin-top: 4px;">14:32</div>
                  </div>

                  <!-- Bot Reply (Outgoing green bubble) -->
                  <div style="background-color: #005C4B; color: #E9EDEF; padding: 10px 12px; border-radius: 12px 12px 2px 12px; font-size: 12px; line-height: 1.4; margin-left: 18%; margin-bottom: 8px; border-left: 3px solid #25D366;">
                    <span class="typewriter-text-wa" style="border-right-color: #25D366;">
                      ${convo.whatsappBotGreeting} ${convo.whatsappBotQuestion}
                    </span>
                    <div style="text-align: right; font-size: 9px; color: #8696A0; margin-top: 4px;">14:33 ✓✓</div>
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <!-- SECTION 2: MINI INBOX EMAIL GENERATOR -->
          <tr>
            <td style="padding: 16px 32px 0 32px;">
              <div style="background-color: #0F172A; border: 1px solid #1E293B; border-radius: 20px; padding: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.25);">
                <!-- Inbox Header with 3 ASSIX Colored Status Dots -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-bottom: 1px solid #1E293B; padding-bottom: 10px; margin-bottom: 12px;">
                  <tr>
                    <td width="48" valign="middle">
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #EF4444; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #F59E0B; margin-right: 3px;"></span>
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #10B981; margin-right: 6px;"></span>
                    </td>
                    <td width="24" valign="middle">
                      <span style="font-size: 14px; color: #10B981;">✉️</span>
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
                      <span style="background-color: rgba(16, 185, 129, 0.15); color: #34D399; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.3);">
                        EMAIL AUTO
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- Typewriter Email Field -->
                <div style="background-color: #1E293B; border-radius: 12px; padding: 12px; border: 1px solid #334155; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; color: #A7F3D0; line-height: 1.5;">
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

          ${(gifUrl || siteId || lead.deployedWebsiteUrl) ? `
          <!-- SECTION 2.5: PERSONALIZED WEBSITE GIF PREVIEW -->
          <tr>
            <td style="padding: 16px 32px 0 32px; text-align: center;">
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 20px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <div style="font-size: 10px; font-weight: 800; color: #10B981; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em;">
                  ✨ ${lang === 'fr' ? 'CONCEPTION WEB PERSONNALISÉE UNIQUE' : 'UNIQUE PERSONALIZED WEB DESIGN'}
                </div>
                <h3 style="color: #0F172A; font-size: 15px; font-weight: 800; margin: 0 0 12px 0;">
                  ${lang === 'fr' ? 'Aperçu Animé de Votre Nouveau Site Web' : 'Animated Preview of Your New Website'}
                </h3>
                
                <div style="border: 2px solid #E2E8F0; border-radius: 16px; overflow: hidden; background-color: #0F172A; line-height: 0; box-shadow: 0 8px 24px rgba(0,0,0,0.12);">
                  <!-- Header bar for the simulated browser -->
                  <div style="background-color: #1E293B; padding: 8px 14px; text-align: left; border-bottom: 2px solid #E2E8F0;">
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #EF4444; margin-right: 4px;"></span>
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #F59E0B; margin-right: 4px;"></span>
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #10B981; margin-right: 8px;"></span>
                    <span style="display: inline-block; background-color: #0F172A; color: #94A3B8; font-size: 9.5px; padding: 3px 12px; border-radius: 10px; width: 180px; text-align: center; font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle;">
                      ${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.nesta.ai
                    </span>
                  </div>
                  
                  <!-- GIF Image wrapper with link -->
                  <a href="${demoLink}" target="_blank" style="display: block; text-decoration: none;">
                    <img 
                      src="${gifUrl || `/api/website/${siteId}/preview.gif`}" 
                      alt="Animated Website Prototype" 
                      style="width: 100%; max-width: 100%; height: auto; display: block;" 
                    />
                  </a>
                </div>
                
                <p style="color: #64748B; font-size: 11px; margin: 12px 0 0 0; line-height: 1.4;">
                  ${lang === 'fr' ? 'Cliquez sur l\'aperçu ci-dessus pour naviguer sur la version interactive en temps réel !' : 'Click the preview above to navigate the interactive real-time version!'}
                </p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Hero Section -->
          <tr>
            <td style="padding: 24px 20px; text-align: center;">
              <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 16px 0; line-height: 1.25; letter-spacing: -0.01em;">
                ${heroTitle}
              </h1>
              <a href="${demoLink}" target="_blank" style="display: inline-block; background-color: ${accentColor}; color: #FFFFFF; font-size: 13.5px; font-weight: 800; text-decoration: none; padding: 13px 28px; border-radius: 30px; letter-spacing: 0.02em; text-transform: uppercase; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); border: 1px solid #059669;">
                ${primaryCta} →
              </a>
            </td>
          </tr>

          ${getNicheProofSection(nicheType, company, lang)}

          ${nicheType === 'accountant' ? `
          <!-- VISUAL ONBOARDING CSS PICTURE GALLERY (Visual UI Mockups - Accountant Niche Only) -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0B132B; border-top: 1px solid #1E293B;">
              <div style="text-align: center; margin-bottom: 16px;">
                <span style="background-color: rgba(16, 185, 129, 0.2); color: #34D399; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.4); text-transform: uppercase; letter-spacing: 0.05em;">
                  📸 APERÇU VISUEL DANS L'EMAIL
                </span>
                <h3 style="color: #FFFFFF; font-size: 16px; font-weight: 800; margin: 8px 0 4px 0;">
                  Aperçu du Parcours Client 100% Automatisé
                </h3>
                <p style="color: #94A3B8; font-size: 12px; margin: 0;">
                  Voici ce que vos clients voient directement sur leur smartphone ou ordinateur :
                </p>
              </div>

              <!-- 2x2 GRID OF VISUAL CSS UI MOCKUP CARDS -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="50%" valign="top" style="padding: 6px;">
                    <!-- CARD 1: KBIS & IDENTITY -->
                    <div style="background-color: #1E293B; border: 1px solid #334155; border-radius: 12px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                      <div style="font-size: 10px; font-weight: 800; color: #60A5FA; text-transform: uppercase; margin-bottom: 6px;">
                        Étape 1 • KBIS & Identité
                      </div>
                      <div style="background-color: #0F172A; border-radius: 8px; padding: 8px; border: 1px solid #1E293B;">
                        <div style="color: #10B981; font-size: 10px; font-weight: 700;">
                          ✓ KBIS Extrait Validé
                        </div>
                        <div style="color: #E2E8F0; font-size: 11px; font-weight: 700; margin-top: 2px;">
                          ${company}
                        </div>
                        <div style="color: #94A3B8; font-size: 9px; font-mono: monospace;">
                          SIREN: 894 302 918
                        </div>
                        <div style="margin-top: 6px; padding: 4px 6px; background-color: rgba(16, 185, 129, 0.15); border-radius: 4px; color: #34D399; font-size: 9px; font-weight: 700; display: inline-block;">
                          ID Conforme ✅
                        </div>
                      </div>
                    </div>
                  </td>

                  <td width="50%" valign="top" style="padding: 6px;">
                    <!-- CARD 2: FISCAL OCR & RECEIPTS -->
                    <div style="background-color: #1E293B; border: 1px solid #334155; border-radius: 12px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                      <div style="font-size: 10px; font-weight: 800; color: #A855F7; text-transform: uppercase; margin-bottom: 6px;">
                        Étape 2 • Scan OCR TVA
                      </div>
                      <div style="background-color: #0F172A; border-radius: 8px; padding: 8px; border: 1px solid #1E293B;">
                        <div style="color: #A855F7; font-size: 10px; font-weight: 700;">
                          ⚡ Facture Traitée IA
                        </div>
                        <div style="color: #E2E8F0; font-size: 11px; font-weight: 700; margin-top: 2px;">
                          Facture Cloud 210,00 €
                        </div>
                        <div style="color: #94A3B8; font-size: 9px;">
                          TVA 20% Extaite (35,00 €)
                        </div>
                        <div style="margin-top: 6px; padding: 4px 6px; background-color: rgba(168, 85, 247, 0.15); border-radius: 4px; color: #C084FC; font-size: 9px; font-weight: 700; display: inline-block;">
                          Rapproché auto 📑
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td width="50%" valign="top" style="padding: 6px;">
                    <!-- CARD 3: BANK FEED DSP2 -->
                    <div style="background-color: #1E293B; border: 1px solid #334155; border-radius: 12px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                      <div style="font-size: 10px; font-weight: 800; color: #34D399; text-transform: uppercase; margin-bottom: 6px;">
                        Étape 3 • Synchro Banque
                      </div>
                      <div style="background-color: #0F172A; border-radius: 8px; padding: 8px; border: 1px solid #1E293B;">
                        <div style="color: #34D399; font-size: 10px; font-weight: 700;">
                          🟢 Connexion DSP2 Active
                        </div>
                        <div style="color: #E2E8F0; font-size: 11px; font-weight: 700; margin-top: 2px;">
                          Compte Pro BNP / Qonto
                        </div>
                        <div style="color: #94A3B8; font-size: 9px; font-mono: monospace;">
                          IBAN FR76 *** 9012
                        </div>
                        <div style="margin-top: 6px; padding: 4px 6px; background-color: rgba(52, 211, 153, 0.15); border-radius: 4px; color: #34D399; font-size: 9px; font-weight: 700; display: inline-block;">
                          Flux En direct 🏦
                        </div>
                      </div>
                    </div>
                  </td>

                  <td width="50%" valign="top" style="padding: 6px;">
                    <!-- CARD 4: E-SIGNATURE -->
                    <div style="background-color: #1E293B; border: 1px solid #334155; border-radius: 12px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                      <div style="font-size: 10px; font-weight: 800; color: #F59E0B; text-transform: uppercase; margin-bottom: 6px;">
                        Étape 4 • Signature eIDAS
                      </div>
                      <div style="background-color: #0F172A; border-radius: 8px; padding: 8px; border: 1px solid #1E293B;">
                        <div style="color: #F59E0B; font-size: 10px; font-weight: 700;">
                          ✍️ Lettre de Mission
                        </div>
                        <div style="color: #E2E8F0; font-size: 11px; font-weight: 700; margin-top: 2px;">
                          Contrat Accompagnement
                        </div>
                        <div style="color: #94A3B8; font-size: 9px;">
                          Signé en ligne le ${new Date().toLocaleDateString('fr-FR')}
                        </div>
                        <div style="margin-top: 6px; padding: 4px 6px; background-color: rgba(245, 158, 11, 0.15); border-radius: 4px; color: #FBBF24; font-size: 9px; font-weight: 700; display: inline-block;">
                          Certifié eIDAS 🔒
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Workflow / 4-Step Process Section (HORIZONTAL SLIDE PANEL LAYOUT) -->
          <tr>
            <td style="padding: 28px 20px; background-color: #FFFFFF; color: #0F172A;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0; text-align: center; letter-spacing: -0.01em;">
                  ${workflowTitle}
                </h2>
              </div>

              <!-- HORIZONTAL 4-STEP SLIDE PANELS GRID -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed;">
                <tr>
                  ${template.workflowSteps.map((step, idx) => `
                    <td width="25%" valign="top" style="padding: 4px;">
                      <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: left; height: 100%;">
                        <div style="margin-bottom: 8px; border-bottom: 1px solid #F1F5F9; padding-bottom: 6px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td>
                                <span style="color: #EF4444; font-size: 15px; font-weight: 900; letter-spacing: -0.01em; display: inline-block;">
                                  ${step.step.length === 1 ? '0' + step.step : step.step}
                                </span>
                              </td>
                              ${idx < 3 ? `<td align="right" style="color: #CBD5E1; font-size: 11px; font-weight: 800;">→</td>` : ''}
                            </tr>
                          </table>
                        </div>
                        <div style="font-size: 11px; font-weight: 700; color: #0F172A; margin-bottom: 4px; line-height: 1.3;">
                          ${step.title}
                        </div>
                        <div style="font-size: 9.5px; color: #475569; line-height: 1.35;">
                          ${step.desc}
                        </div>
                      </div>
                    </td>
                  `).join('')}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Why Choose Us / Value Proposition -->
          <tr>
            <td style="padding: 32px; background-color: #FFFFFF;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0; text-align: center;">
                ${whyUsTitle}
              </h2>

              <ul style="margin: 0; padding: 0 0 0 20px; color: #0F172A; font-size: 13.5px; line-height: 1.8;">
                ${template.whyUsPoints.map(point => `
                  <li style="margin-bottom: 8px; font-weight: 800;"><strong>${point}</strong></li>
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

          <!-- Contact / CTA Footer Section (PURE BLACK BACKGROUND WITH ASSIX ROUNDED EDGES) -->
          <tr>
            <td style="padding: 36px 32px; background-color: #000000; text-align: center; color: #FFFFFF; border-bottom-left-radius: 24px; border-bottom-right-radius: 24px;">
              <h3 style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0 0 8px 0;">${formHeader}</h3>
              <p style="font-size: 12.5px; color: #A1A1AA; margin: 0 0 18px 0; max-width: 460px; display: inline-block; line-height: 1.5;">
                ${formSubheader}
              </p>

              <!-- 1-CLICK 5-MIN TIME SLOT SELECTION BUTTONS -->
              <div style="margin-bottom: 22px;">
                <div style="font-size: 10.5px; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">
                  ${lang === 'fr' ? '⚡ RÉSERVATION EXPRESS (5 MIN) — CHOISISSEZ UN CRÉNEAU :' : '⚡ EXPRESS BOOKING (5 MIN) — CHOOSE A SLOT:'}
                </div>
                <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto; max-width: 100%;">
                  <tr>
                    <td style="padding: 4px;">
                      <a href="${demoLink}#${dynamicSlots[0].hash}" target="_blank" style="display: inline-block; background-color: #18181B; color: #34D399; border: 1px solid #27272A; border-radius: 20px; padding: 8px 14px; font-size: 11.5px; font-weight: 700; text-decoration: none;">
                        📅 ${dynamicSlots[0].label}
                      </a>
                    </td>
                    <td style="padding: 4px;">
                      <a href="${demoLink}#${dynamicSlots[1].hash}" target="_blank" style="display: inline-block; background-color: #18181B; color: #34D399; border: 1px solid #27272A; border-radius: 20px; padding: 8px 14px; font-size: 11.5px; font-weight: 700; text-decoration: none;">
                        📅 ${dynamicSlots[1].label}
                      </a>
                    </td>
                    <td style="padding: 4px;">
                      <a href="${demoLink}#${dynamicSlots[2].hash}" target="_blank" style="display: inline-block; background-color: #18181B; color: #34D399; border: 1px solid #27272A; border-radius: 20px; padding: 8px 14px; font-size: 11.5px; font-weight: 700; text-decoration: none;">
                        📅 ${dynamicSlots[2].label}
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <a href="${demoLink}" target="_blank" style="display: inline-block; background-color: ${accentColor}; color: #FFFFFF; font-size: 13.5px; font-weight: 800; text-decoration: none; padding: 14px 30px; border-radius: 30px; letter-spacing: 0.03em; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); border: 1px solid #059669;">
                ${secondaryCta} →
              </a>

              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #27272A; font-size: 11px; color: #71717A; line-height: 1.6;">
                <strong style="color: #E4E4E7;">${senderName}</strong> • ${senderTitle}<br/>
                ${assixBrand} • Enterprise Outreach & Automation<br/>
                <a href="${demoLink}" style="color: #34D399; text-decoration: underline;">${lang === 'fr' ? 'Consulter la démo interactive' : 'View Interactive Demo'}</a> • 
                <a href="#" style="color: #71717A; text-decoration: none;">${lang === 'fr' ? 'Se désabonner' : 'Unsubscribe'}</a>
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
