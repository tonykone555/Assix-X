import { buildPremiumDynamicTemplate } from './templates/premiumDynamicTemplate.js';
import { buildLuxuryTemplate } from './templates/luxuryTemplate.js';
import { buildCinematicTemplate } from './templates/cinematicTemplate.js';
import {
  buildBehanceConstructionTemplate,
  buildBehanceCleaningTemplate,
  buildBehancePlumbingTemplate,
  buildBehanceRestaurantTemplate
} from './templates/behanceTemplates.js';
import { buildTasteMinimalTemplate, buildTasteEditorialTemplate } from './templates/tasteTemplate.js';
import { buildDrivingSchoolTemplate } from './templates/drivingSchoolTemplate.js';
import { buildOutlandHomesTemplate } from './templates/outlandHomesTemplate.js';

export const DEFAULT_GALLERY: Record<string, string[]> = {
  restaurant: [
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80&auto=format&fit=crop',
  ],
  sinistre: [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=80&auto=format&fit=crop',
  ],
  lawyer: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=900&q=80&auto=format&fit=crop',
  ],
  artisan: [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=80&auto=format&fit=crop',
  ],
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

export function getGalleryPhotosForNiche(nicheKey: string, lead?: any, content?: any): string[] {
  // Check user uploaded images first
  if (content?.uploadedImages && Array.isArray(content.uploadedImages) && content.uploadedImages.length > 0) {
    return content.uploadedImages;
  }
  if (lead?.userUploadedImages && Array.isArray(lead.userUploadedImages) && lead.userUploadedImages.length > 0) {
    return lead.userUploadedImages;
  }
  if (lead?.siteData?.uploadedImages && Array.isArray(lead.siteData.uploadedImages) && lead.siteData.uploadedImages.length > 0) {
    return lead.siteData.uploadedImages;
  }

  // Check Google Maps scraped photos
  if (content?.photos && Array.isArray(content.photos) && content.photos.length > 0) {
    return content.photos;
  }
  if (lead?.siteData?.photos && Array.isArray(lead.siteData.photos) && lead.siteData.photos.length > 0) {
    return lead.siteData.photos;
  }
  if (lead?.photos && Array.isArray(lead.photos) && lead.photos.length > 0) {
    return lead.photos;
  }
  const key = (nicheKey || '').toLowerCase();
  if (key.includes('restau') || key.includes('food') || key.includes('trait') || key.includes('cater')) return DEFAULT_GALLERY.restaurant;
  if (key.includes('sinistr') || key.includes('restorat') || key.includes('dépannage') || key.includes('mold') || key.includes('moisissur') || key.includes('incend')) return DEFAULT_GALLERY.sinistre;
  if (key.includes('electr') || key.includes('électr')) return DEFAULT_GALLERY.electrician;
  if (key.includes('plumb') || key.includes('plomb') || key.includes('chauff')) return DEFAULT_GALLERY.plumber;
  if (key.includes('roof') || key.includes('couvr')) return DEFAULT_GALLERY.roofer;
  if (key.includes('lock') || key.includes('serrur')) return DEFAULT_GALLERY.locksmith;
  if (key.includes('avocat') || key.includes('lawyer') || key.includes('jurid') || key.includes('legal')) return DEFAULT_GALLERY.lawyer;
  if (key.includes('real') || key.includes('immob') || key.includes('estate')) return DEFAULT_GALLERY.realEstate;
  if (key.includes('fit') || key.includes('coach') || key.includes('sport')) return DEFAULT_GALLERY.fitnessCoach;
  if (key.includes('driv') || key.includes('permis') || key.includes('autoecole')) return DEFAULT_GALLERY.drivingSchool;
  
  return DEFAULT_GALLERY[nicheKey] || DEFAULT_GALLERY.artisan;
}

export interface SiteContent {
  brandName?: string;
  companyName?: string;
  language?: string;
  city?: string;
  displayCity?: string;
  contactPhone?: string;
  phone?: string;
  contactEmail?: string;
  email?: string;
  contactAddress?: string;
  address?: string;
  templateStyle?: 'premium-dark' | 'luxury-serif' | 'classic' | 'behance-construction' | 'behance-cleaning' | 'behance-plumbing' | 'behance-restaurant' | string;
  nicheOverride?: string;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  themeMode?: 'light' | 'dark' | 'luxury-dark' | 'cream' | 'slate';
  fontStyle?: string;
  buttonStyle?: string; // 'pill', 'rounded-xl', 'rounded-none', 'gradient-amber', 'gradient-emerald', 'gradient-blue', 'luxury-gold'
  layoutOrder?: string[]; // e.g. ['hero', 'stats', 'reviews', 'services', 'about', 'portfolio', 'whyUs', 'steps', 'faq', 'devis']
  heroLayout?: 'split' | 'centered' | 'card-hero' | 'fullscreen-bg';
  heroTitle?: string;
  heroSubtitle?: string;
  tagline?: string;
  ctaButton?: string;
  ctaButtonSecondary?: string;
  aboutTitle?: string;
  aboutText?: string;
  yearsInBusiness?: number;
  yearsLabel?: string;
  aboutHighlights?: string[];
  stats?: Array<{
    value: string;
    label: string;
  }>;
  servicesSectionTitle?: string;
  servicesSectionSubtitle?: string;
  serviceBtnLabel?: string;
  services?: Array<{
    title: string;
    description: string;
    price?: string;
    image?: string;
    icon?: string;
  }>;
  galleryTitle?: string;
  portfolio?: Array<{
    title: string;
    category?: string;
    image?: string;
  }>;
  whyUsSectionTitle?: string;
  whyUs?: Array<{
    title: string;
    text: string;
  }>;
  stepsSectionTitle?: string;
  steps?: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  reviewsSectionTitle?: string;
  reviewsSectionSubtitle?: string;
  testimonials?: Array<{
    name: string;
    text: string;
    rating?: number;
    city?: string;
    avatar?: string;
  }>;
  faqTitle?: string;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  ctaButtons?: any[];
  ribbonText?: string;
  statLabels?: any[];
  contactTitle?: string;
  contactSubtitle?: string;
  contactSubmitText?: string;
  copyrightText?: string;
  photos?: string[];
  uploadedImages?: string[];
  customCss?: string;
  heroVideo?: string;
  section2Video?: string;
  beforeAfterTitle?: string;
  beforeAfterHeadline?: string;
  beforeAfterDescription?: string;
  beforeAfterBullets?: string[];
  beforeAfterBtnLabel?: string;
}

export function getSectorKey(sectorStr: string = ''): string {
  const s = sectorStr.toLowerCase().trim();
  if (s.includes('plumb') || s.includes('plomb') || s.includes('pipe') || s.includes('sanit') || s.includes('water')) return 'plumbing';
  if (s.includes('law') || s.includes('legal') || s.includes('avocat') || s.includes('juris') || s.includes('notaire')) return 'legal';
  if (s.includes('restau') || s.includes('food') || s.includes('caf') || s.includes('bistr') || s.includes('pizza')) return 'restaurant';
  if (s.includes('real') || s.includes('estate') || s.includes('immob') || s.includes('home') || s.includes('realtor')) return 'realestate';
  if (s.includes('dent') || s.includes('medic') || s.includes('health') || s.includes('médic') || s.includes('soin') || s.includes('physio')) return 'medical';
  if (s.includes('roof') || s.includes('toit') || s.includes('construct') || s.includes('bâtiment') || s.includes('renov')) return 'construction';
  if (s.includes('auto') || s.includes('mecanic') || s.includes('mécani') || s.includes('garage') || s.includes('car')) return 'automotive';
  return 'general';
}

export function getSectorDefaultColor(sectorKey: string): string {
  switch (sectorKey) {
    case 'plumbing':
      return '#0284C7'; // Cyan/sky blue
    case 'legal':
      return '#1E293B'; // Slate navy
    case 'restaurant':
      return '#DC2626'; // Deep ruby crimson
    case 'realestate':
      return '#0F766E'; // Emerald teal
    case 'medical':
      return '#059669'; // Clinical emerald
    case 'construction':
      return '#D97706'; // Safety amber
    case 'automotive':
      return '#2563EB'; // Cobalt blue
    default:
      return '#2563EB'; // Royal blue
  }
}

export function getSectorFont(sectorKey: string, lang: string = 'fr', fontOverride?: string): { link: string; css: string; headingCss: string } {
  if (fontOverride) {
    const f = fontOverride.toLowerCase();
    if (f.includes('playfair')) {
      return {
        link: 'Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700',
        css: "'Plus Jakarta Sans', sans-serif",
        headingCss: "'Playfair Display', serif"
      };
    }
    if (f.includes('cinzel')) {
      return {
        link: 'Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700',
        css: "'Plus Jakarta Sans', sans-serif",
        headingCss: "'Cinzel', serif"
      };
    }
    if (f.includes('outfit')) {
      return {
        link: 'Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700',
        css: "'Plus Jakarta Sans', sans-serif",
        headingCss: "'Outfit', sans-serif"
      };
    }
  }

  switch (sectorKey) {
    case 'legal':
      return {
        link: 'Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700',
        css: "'Plus Jakarta Sans', sans-serif",
        headingCss: "'Cinzel', serif"
      };
    case 'restaurant':
      return {
        link: 'Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700',
        css: "'Plus Jakarta Sans', sans-serif",
        headingCss: "'Playfair Display', serif"
      };
    case 'realestate':
      return {
        link: 'Lora:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700',
        css: "'Plus Jakarta Sans', sans-serif",
        headingCss: "'Lora', serif"
      };
    default:
      return {
        link: 'Plus+Jakarta+Sans:wght@400;500;600;700;800',
        css: "'Plus Jakarta Sans', sans-serif",
        headingCss: "'Plus Jakarta Sans', sans-serif"
      };
  }
}

export function getSectorImages(sectorKey: string) {
  switch (sectorKey) {
    case 'plumbing':
      return {
        heroBg: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80',
        aboutImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
        services: [
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
        ],
        portfolio: [
          { title: 'Installation Complète Salle de Bain', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', category: 'Plomberie' },
          { title: 'Dépannage Urgence Tuyauterie', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80', category: 'Urgence' },
          { title: 'Rénovation Chauffage & Pompe à Chaleur', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80', category: 'Chauffage' }
        ]
      };
    case 'legal':
      return {
        heroBg: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80',
        aboutImg: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
        services: [
          'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&w=600&q=80'
        ],
        portfolio: [
          { title: 'Défense en Droit des Affaires', image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80', category: 'Affaires' },
          { title: 'Accompagnement Immobilier & Contrats', image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=600&q=80', category: 'Immobilier' },
          { title: 'Médiation & Contentieux', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80', category: 'Litiges' }
        ]
      };
    case 'restaurant':
      return {
        heroBg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
        aboutImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        services: [
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80'
        ],
        portfolio: [
          { title: 'Menu Dégustation Gastronomique', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', category: 'Cuisine' },
          { title: 'Événements Privés & Banquets', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', category: 'Événements' },
          { title: 'Cocktails & Ambiance Lounge', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', category: 'Bar' }
        ]
      };
    default:
      return {
        heroBg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
        aboutImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        services: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80'
        ],
        portfolio: [
          { title: 'Projet Client Réussi', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80', category: 'Accompagnement' },
          { title: 'Optimisation de Performance', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', category: 'Stratégie' },
          { title: 'Service Client Premium', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80', category: 'Satisfaction' }
        ]
      };
  }
}

export function detectLanguage(lead: any, langOverride?: string | null): string {
  if (langOverride) {
    if (langOverride === 'en' || langOverride === 'english') return 'en';
    if (langOverride === 'fr' || langOverride === 'french') return 'fr';
    if (langOverride === 'es' || langOverride === 'spanish') return 'es';
    if (langOverride === 'de' || langOverride === 'german') return 'de';
  }
  const market = (lead.market || '').toLowerCase();
  const langProp = (lead.language || '').toLowerCase();

  if (market.includes('english') || market.includes('us') || market.includes('uk') || langProp.includes('en')) return 'en';
  if (market.includes('spanish') || market.includes('es') || langProp.includes('es')) return 'es';
  if (market.includes('german') || market.includes('de') || langProp.includes('de')) return 'de';
  return 'fr';
}

function isTextInEnglish(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  const enWords = ['the', 'and', 'great', 'excellent', 'service', 'was', 'very', 'good', 'recommended', 'best', 'work', 'fast', 'helpful', 'highly', 'job', 'fixed', 'they'];
  let count = 0;
  for (const w of enWords) {
    if (new RegExp(`\\b${w}\\b`, 'i').test(lower)) count++;
  }
  return count >= 2;
}

export function sanitizeAndTranslateReviews(
  reviews: Array<{ name: string; text: string; rating?: number; city?: string; avatar?: string }>,
  lang: string,
  companyName: string = 'Entreprise',
  city: string = ''
): Array<{ name: string; text: string; rating?: number; city?: string; avatar?: string }> {
  const frDefaults = [
    { name: "Sébastien M.", text: `Service irréprochable et conseils très professionnels. Je recommande vivement ${companyName} pour leur réactivité !`, rating: 5, city: city || "Paris" },
    { name: "Claire D.", text: `Intervention rapide et travail d'une grande qualité. Équipe courtoise et tarif parfaitement respecté.`, rating: 5, city: city || "Lyon" },
    { name: "Antoine B.", text: `Très satisfait de la prestation. Entreprise sérieuse et réactive, je ferai de nouveau appel à eux sans hésiter.`, rating: 5, city: city || "Marseille" },
    { name: "Camille L.", text: `Excellente expérience de A à Z avec ${companyName}. Personnel très compétent et résultat au-delà de mes attentes !`, rating: 5, city: city || "Bordeaux" }
  ];

  const esDefaults = [
    { name: "Carlos R.", text: `¡Excelente servicio y atención rápida! Recomiendo totalmente a ${companyName} por su gran profesionalismo.`, rating: 5, city: city || "Madrid" },
    { name: "María G.", text: `Puntuales, eficaces y con un precio muy transparente. Quedé muy satisfecha con el trabajo realizado.`, rating: 5, city: city || "Barcelona" }
  ];

  const deDefaults = [
    { name: "Markus S.", text: `Hervorragender Service und sehr kompetentes Team. Sehr schnelle Abwicklung und Top-Qualität!`, rating: 5, city: city || "Berlin" },
    { name: "Julia K.", text: `Pünktlich, freundlich und absolut professionell. Kann ${companyName} nur weiterempfehlen!`, rating: 5, city: city || "München" }
  ];

  const enDefaults = [
    { name: "John D.", text: `Outstanding service, prompt response, and very fair pricing. Highly recommend ${companyName}!`, rating: 5, city: city || "London" },
    { name: "Sarah M.", text: `Extremely professional team. Arrived on time and completed the job flawlessly.`, rating: 5, city: city || "New York" }
  ];

  if (!reviews || reviews.length === 0) {
    if (lang === 'fr') return frDefaults;
    if (lang === 'es') return esDefaults;
    if (lang === 'de') return deDefaults;
    return enDefaults;
  }

  return reviews.map((r, idx) => {
    let text = (r.text || '').trim();
    let name = (r.name || 'Client').trim();

    if (name === 'A Google User' || name === 'Google User' || name === 'Anonymous' || name === 'Verified Client') {
      if (lang === 'fr') name = frDefaults[idx % frDefaults.length].name;
      else if (lang === 'es') name = esDefaults[idx % esDefaults.length].name;
      else if (lang === 'de') name = deDefaults[idx % deDefaults.length].name;
      else name = 'Verified Client';
    }

    // Translate English reviews into French when target site language is French
    if (lang === 'fr') {
      if (!text || isTextInEnglish(text)) {
        const lower = text.toLowerCase();
        if (lower.includes('great service') || lower.includes('excellent service')) {
          text = `Excellent service de la part de ${companyName} ! Équipe réactive et à l'écoute.`;
        } else if (lower.includes('highly recommend') || lower.includes('would recommend')) {
          text = `Je recommande vivement ${companyName} pour leur professionnalisme et leur réactivité à ${city || 'proximité'}.`;
        } else if (lower.includes('fast') || lower.includes('quick') || lower.includes('punctual')) {
          text = `Intervention très rapide et travail particulièrement soigné. Un grand merci à l'équipe de ${companyName} !`;
        } else if (lower.includes('professional') || lower.includes('great team')) {
          text = `Une équipe très professionnelle et courtoise. Prestation de haute qualité réalisée par ${companyName}.`;
        } else {
          text = frDefaults[idx % frDefaults.length].text;
        }
      }
    } else if (lang === 'es' && isTextInEnglish(text)) {
      const fallback = esDefaults[idx % esDefaults.length];
      text = fallback.text;
      if (!name || name === 'Client') name = fallback.name;
    } else if (lang === 'de' && isTextInEnglish(text)) {
      const fallback = deDefaults[idx % deDefaults.length];
      text = fallback.text;
      if (!name || name === 'Client') name = fallback.name;
    }

    return {
      ...r,
      name,
      text,
      city: r.city || city || '',
      avatar: r.avatar || `https://i.pravatar.cc/100?img=${(idx % 60) + 1}`
    };
  });
}

export function getLanguageDictionary(lang: string) {
  switch (lang) {
    case 'en':
      return {
        callUs: 'Call Us Now',
        getQuote: 'Get a Free Quote',
        servicesTitle: 'Our Premier Services',
        servicesSub: 'High-quality professional execution guaranteed for your peace of mind.',
        aboutTitle: 'About Our Business',
        whyUsTitle: 'Why Choose Our Services?',
        whyUsSub: 'Dedicated to quality, speed, and 100% customer satisfaction.',
        stepsTitle: 'Our Simple 3-Step Process',
        stepsSub: 'How we take care of your needs from start to finish.',
        portfolioTitle: 'Featured Projects & Recent Work',
        portfolioSub: 'Take a look at our recent achievements in the field.',
        reviewsTitle: 'Customer Reviews & Ratings',
        reviewsSub: 'Trusted by hundreds of satisfied local clients.',
        faqTitle: 'Frequently Asked Questions',
        faqSub: 'Everything you need to know before contacting us.',
        formTitle: 'Request an Instant Estimate',
        formSub: 'Fill out this short form to receive a response within 15 minutes.',
        urgencyNotice: '🟢 Specialists Available Today in',
        fullName: 'Full Name',
        phoneLabel: 'Phone Number',
        cityLabel: 'Address / City',
        serviceType: 'Required Service',
        needDesc: 'Description of your need',
        submitBtn: 'Submit Quote Request',
        hoursTitle: 'Opening Hours',
        monFri: 'Mon - Fri: 8:00 AM - 7:00 PM',
        satSun: 'Sat - Sun: 24/7 Emergency Service',
        selectService: 'Select a Service'
      };
    case 'es':
      return {
        callUs: 'Llámenos Ahora',
        getQuote: 'Presupuesto Gratis',
        servicesTitle: 'Nuestros Servicios Destacados',
        servicesSub: 'Calidad profesional garantizada para su total tranquilidad.',
        aboutTitle: 'Sobre Nuestra Empresa',
        whyUsTitle: '¿Por Qué Elegirnos?',
        whyUsSub: 'Comprometidos con la excelencia, la rapidez y la máxima satisfacción.',
        stepsTitle: 'Nuestro Proceso en 3 Pasos',
        stepsSub: 'Cómo resolvemos sus necesidades de principio a fin.',
        portfolioTitle: 'Trabajos Recientes y Galería',
        portfolioSub: 'Descubra algunos de nuestros proyectos más destacados.',
        reviewsTitle: 'Opiniones y Reseñas de Clientes',
        reviewsSub: 'La confianza de nuestros clientes es nuestro mayor orgullo.',
        faqTitle: 'Preguntas Frecuentes',
        faqSub: 'Todo lo que necesita saber antes de contactarnos.',
        formTitle: 'Solicitar Presupuesto Instantáneo',
        formSub: 'Rellene este formulario para recibir respuesta en menos de 15 minutos.',
        urgencyNotice: '🟢 Especialistas Disponibles Hoy en',
        fullName: 'Nombre Completo',
        phoneLabel: 'Teléfono',
        cityLabel: 'Dirección / Ciudad',
        serviceType: 'Servicio Requerido',
        needDesc: 'Descripción del Servicio',
        submitBtn: 'Enviar Solicitud',
        hoursTitle: 'Horario de Atención',
        monFri: 'Lun - Vie: 8:00 - 19:00',
        satSun: 'Sáb - Dom: Servicio de Urgencias 24/7',
        selectService: 'Seleccionar Servicio'
      };
    case 'de':
      return {
        callUs: 'Jetzt Anrufen',
        getQuote: 'Kostenloses Angebot',
        servicesTitle: 'Unsere Erstklassigen Dienstleistungen',
        servicesSub: 'Garantierte professionelle Qualität für Ihre absolute Zufriedenheit.',
        aboutTitle: 'Über Unser Unternehmen',
        whyUsTitle: 'Warum Uns Wählen?',
        whyUsSub: 'Engagement für Qualität, Schnelligkeit und Zuverlässigkeit.',
        stepsTitle: 'Unser 3-Schritte-Prozess',
        stepsSub: 'Einfache und transparente Abwicklung von Anfang bis Ende.',
        portfolioTitle: 'Referenzen & Aktuelle Projekte',
        portfolioSub: 'Werfen Sie einen Blick auf unsere neuesten Arbeiten.',
        reviewsTitle: 'Kundenbewertungen',
        reviewsSub: 'Vertraut von hunderten zufriedenen Kunden.',
        faqTitle: 'Häufig Gestellte Fragen',
        faqSub: 'Alles, was Sie vor der Kontaktaufnahme wissen müssen.',
        formTitle: 'Kostenloses Angebot Anfordern',
        formSub: 'Füllen Sie das Formular aus für eine Antwort innerhalb von 15 Minuten.',
        urgencyNotice: '🟢 Experten Heute Verfügbar in',
        fullName: 'Vollständiger Name',
        phoneLabel: 'Telefonnummer',
        cityLabel: 'Adresse / Stadt',
        serviceType: 'Gewünschte Dienstleistung',
        needDesc: 'Beschreibung Ihres Anliegens',
        submitBtn: 'Anfrage Absenden',
        hoursTitle: 'Öffnungszeiten',
        monFri: 'Mo - Fr: 08:00 - 19:00 Uhr',
        satSun: 'Sa - So: 24/7 Notdienst',
        selectService: 'Dienstleistung Wählen'
      };
    default: // 'fr'
      return {
        callUs: 'Appelez-nous',
        getQuote: 'Devis Gratuit',
        servicesTitle: 'Nos Prestations D\'Excellence',
        servicesSub: 'Une intervention de qualité supérieure garantie pour votre tranquillité.',
        aboutTitle: 'À Propos de Notre Entreprise',
        whyUsTitle: 'Pourquoi Nous Faire Confiance ?',
        whyUsSub: 'Engagement de rigueur, de rapidité et de satisfaction 100% garantie.',
        stepsTitle: 'Notre Processus en 3 Étapes',
        stepsSub: 'Un suivi fluide de la prise de contact à la réalisation.',
        portfolioTitle: 'Réalisations & Projets Récents',
        portfolioSub: 'Découvrez en images la qualité de nos interventions.',
        reviewsTitle: 'Avis Clients & Témoignages',
        reviewsSub: 'La confiance accordée par nos clients est notre meilleure fierté.',
        faqTitle: 'Questions Fréquemment Posées',
        faqSub: 'Tout ce que vous devez savoir avant de nous contacter.',
        formTitle: 'Demander un Devis Instantané',
        formSub: 'Remplissez ce formulaire pour recevoir une estimation claire sous 15 minutes.',
        urgencyNotice: '🟢 Techniciens Disponibles Aujourd\'hui à',
        fullName: 'Nom Complet',
        phoneLabel: 'Téléphone',
        cityLabel: 'Adresse / Ville',
        serviceType: 'Service Souhaité',
        needDesc: 'Description du Besoin',
        submitBtn: 'Envoyer la Demande',
        hoursTitle: 'Horaires d\'Ouverture',
        monFri: 'Lun - Ven: 8h00 - 19h00',
        satSun: 'Sam - Dim: Service d\'Urgence 24h/7j',
        selectService: 'Sélectionner un Service'
      };
  }
}

function getButtonCss(styleName?: string, primaryColor: string = '#2563EB'): { class: string; style: string } {
  if (!styleName) {
    return {
      class: 'px-8 py-4 rounded-xl text-white font-bold text-sm shadow-xl transition-all hover:-translate-y-0.5 text-center',
      style: `background-color: ${primaryColor}`
    };
  }

  const s = styleName.toLowerCase();
  if (s.includes('pill')) {
    return {
      class: 'px-8 py-4 rounded-full text-white font-bold text-sm shadow-xl transition-all hover:-translate-y-0.5 text-center',
      style: `background-color: ${primaryColor}`
    };
  }
  if (s.includes('gradient-amber') || s.includes('amber')) {
    return {
      class: 'px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm shadow-xl hover:opacity-90 transition-all text-center',
      style: ''
    };
  }
  if (s.includes('gradient-emerald') || s.includes('emerald')) {
    return {
      class: 'px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl hover:opacity-90 transition-all text-center',
      style: ''
    };
  }
  if (s.includes('gradient-blue') || s.includes('blue')) {
    return {
      class: 'px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xl hover:opacity-90 transition-all text-center',
      style: ''
    };
  }
  if (s.includes('luxury-gold') || s.includes('gold')) {
    return {
      class: 'px-8 py-4 rounded-xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 text-slate-950 font-black text-sm shadow-xl hover:brightness-110 transition-all text-center',
      style: ''
    };
  }
  if (s.includes('square') || s.includes('none')) {
    return {
      class: 'px-8 py-4 rounded-none text-white font-bold text-sm shadow-xl transition-all hover:-translate-y-0.5 text-center',
      style: `background-color: ${primaryColor}`
    };
  }

  return {
    class: 'px-8 py-4 rounded-xl text-white font-bold text-sm shadow-xl transition-all hover:-translate-y-0.5 text-center',
    style: `background-color: ${primaryColor}`
  };
}

export function extractCity(lead: any): string {
  if (!lead) return '';
  if (lead.city) return lead.city;
  if (lead.address) {
    const parts = lead.address.split(',');
    if (parts.length > 1) {
      const cityPart = parts[parts.length - 2] || parts[parts.length - 1];
      return cityPart.replace(/\d+/g, '').trim();
    }
  }
  return '';
}

export function detectNicheKey(lead: any): string {
  if (!lead) return 'traiteur';
  const str = ((lead.niche || lead.sector || lead.source || lead.category || '') + ' ' + (lead.name || '')).toLowerCase();
  if (str.includes('traiteur') || str.includes('cater') || str.includes('restau') || str.includes('food')) return 'traiteur';
  if (str.includes('electr') || str.includes('électr')) return 'electricien';
  if (str.includes('plumb') || str.includes('plomb')) return 'plombier';
  if (str.includes('roof') || str.includes('couvr') || str.includes('toit')) return 'couvreur';
  if (str.includes('lock') || str.includes('serrur')) return 'serrurier';
  if (str.includes('real') || str.includes('immob') || str.includes('estate') || str.includes('agence')) return 'immobilier';
  if (str.includes('fit') || str.includes('coach') || str.includes('sport') || str.includes('gym')) return 'coach';
  if (str.includes('driv') || str.includes('permis') || str.includes('auto-école') || str.includes('auto ecole')) return 'autoecole';
  return 'traiteur';
}

export function buildHTMLTemplate(lead: any, content: SiteContent = {}, designFramework: string = 'modern'): string {
  const nicheKey = (content as any).nicheOverride || detectNicheKey(lead);
  const lang = detectLanguage(lead);

  // 1. Explicit templateStyle checks (highest priority)
  if (content.templateStyle === 'outland-homes' || content.templateStyle === 'outland' || content.templateStyle === 'airbnb' || content.templateStyle === 'main-outland' || content.templateStyle === 'main-template') {
    return buildOutlandHomesTemplate(lead, content, nicheKey);
  }
  if (content.templateStyle === 'cinematic-luxury' || (content.templateStyle && content.templateStyle.includes('cinematic'))) {
    return buildCinematicTemplate(lead, content, nicheKey);
  }
  if (content.templateStyle === 'driving-school' || content.templateStyle === 'autoecole' || content.templateStyle === 'main-neumorphic' || content.templateStyle === 'behance-cutout') {
    return buildDrivingSchoolTemplate(lead, content, nicheKey);
  }

  // 2. Behance Portfolio Template Styles
  if (content.templateStyle === 'behance-construction') {
    return buildBehanceConstructionTemplate(lead, content, lang);
  }
  if (content.templateStyle === 'behance-cleaning') {
    return buildBehanceCleaningTemplate(lead, content, lang);
  }
  if (content.templateStyle === 'behance-plumbing') {
    return buildBehancePlumbingTemplate(lead, content, lang);
  }
  if (content.templateStyle === 'behance-restaurant' || content.templateStyle === 'luxbite') {
    return buildBehanceRestaurantTemplate(lead, content, lang);
  }

  // 3. Leon Taste-Skill Premium Layout Templates
  if (content.templateStyle === 'taste-minimal') {
    return buildTasteMinimalTemplate(lead, content, lang);
  }
  if (content.templateStyle === 'taste-editorial') {
    return buildTasteEditorialTemplate(lead, content, lang);
  }
  if (content.templateStyle === 'luxury-serif') {
    return buildLuxuryTemplate(lead, content, nicheKey);
  }

  // 4. Fallback niche checks if templateStyle is unassigned
  if (nicheKey === 'autoecole' || nicheKey === 'driving_school' || nicheKey === 'drivingschool') {
    return buildDrivingSchoolTemplate(lead, content, nicheKey);
  }

  if (content.templateStyle !== 'classic') {
    return buildPremiumDynamicTemplate(lead, content, nicheKey);
  }

  const sectorKey = getSectorKey(lead.sector || lead.source);
  const i18n = getLanguageDictionary(lang);
  const fontConfig = getSectorFont(sectorKey, lang, content.fontStyle);
  const sectorImgs = getSectorImages(sectorKey);

  const primaryColor = content.primaryColor || getSectorDefaultColor(sectorKey);
  const accentColor = content.accentColor || '#10B981';

  const isDarkTheme = content.themeMode === 'dark' || content.themeMode === 'luxury-dark';

  const companyName = lead.name || lead.companyName || lead.company || lead.businessName || 'Entreprise';
  const phone = lead.phone || '';
  const email = lead.email || '';
  const address = lead.address || '';
  const city = lead.city || '';

  // Process Real Google Reviews or Scraped Reviews
  let testimonials = content.testimonials || [];
  if (lead.googleReviews && Array.isArray(lead.googleReviews) && lead.googleReviews.length > 0) {
    testimonials = lead.googleReviews.map((r: any, idx: number) => ({
      name: r.author || r.name || 'Client',
      text: r.text || r.reviewText || '',
      rating: r.rating || 5,
      city: city || '',
      avatar: `https://i.pravatar.cc/100?img=${(idx % 60) + 1}`
    }));
  }

  // Ensure reviews match site language and fallbacks are localized
  testimonials = sanitizeAndTranslateReviews(testimonials, lang, companyName, city);

  const defaultServices = [
    { title: 'Service Rapide & Intervention Urgente', description: 'Assistance prioritaire sous 30 minutes garantie à ' + (city || 'domicile') + '.', price: 'Sur Devis', image: sectorImgs.services[0] },
    { title: 'Installation & Rénovation Sur Mesure', description: 'Mise en œuvre soignée avec matériaux certifiés et matériel professionnel.', price: 'Garantie 2 ans', image: sectorImgs.services[1] },
    { title: 'Entretien & Diagnostic Préventif', description: 'Contrôle complet de vos installations pour assurer durabilité et sécurité.', price: 'Devis Clair', image: sectorImgs.services[2] }
  ];

  const services = (content.services && content.services.length > 0)
    ? content.services.map((s, idx) => ({
        ...s,
        image: s.image || sectorImgs.services[idx % sectorImgs.services.length]
      }))
    : defaultServices;

  const galleryPhotos = getGalleryPhotosForNiche(nicheKey, lead, content);

  const portfolio = (content.portfolio && content.portfolio.length > 0)
    ? content.portfolio.map((p, idx) => ({
        ...p,
        image: p.image || (galleryPhotos && galleryPhotos[idx % galleryPhotos.length] ? galleryPhotos[idx % galleryPhotos.length] : sectorImgs.aboutImg)
      }))
    : (galleryPhotos && galleryPhotos.length > 0)
      ? galleryPhotos.map((imgUrl, idx) => ({
          title: `Réalisation ${idx + 1} - ${companyName}`,
          category: 'Projet Client',
          image: imgUrl
        }))
      : sectorImgs.portfolio;

  const defaultWhyUs = [
    { title: 'Disponibilité & Réactivité', text: 'Prise en charge immédiate de votre demande avec équipe de garde 24h/7j.' },
    { title: 'Transparence & Tarifs Clairs', text: 'Devis gratuit rédigé avant chaque intervention, sans aucun frais caché.' },
    { title: 'Matériel Certifié & Normes', text: 'Utilisation exclusive de produits garantis et conformes aux normes internationales.' }
  ];

  const whyUs = (content.whyUs && content.whyUs.length > 0) ? content.whyUs : defaultWhyUs;

  const defaultSteps = [
    { step: '01', title: 'Prise de Contact', description: 'Appelez-nous ou complétez le formulaire de demande rapide.' },
    { step: '02', title: 'Diagnostic & Devis', description: 'Évaluation exacte de vos besoins et envoi immédiat d’une proposition claire.' },
    { step: '03', title: 'Intervention Certifiée', description: 'Réalisation soignée avec garantie de résultat et suivi personnalisé.' }
  ];

  const steps = (content.steps && content.steps.length > 0) ? content.steps : defaultSteps;

  const defaultFaq = [
    { question: 'Quels sont vos délais d’intervention ?', answer: 'Nous réagissons dans les plus brefs délais, souvent en moins de 30 à 60 minutes pour les cas urgents.' },
    { question: 'Comment obtenir un devis gratuit ?', answer: 'Vous pouvez nous joindre directement par téléphone ou via notre formulaire en ligne instantané.' },
    { question: 'Proposez-vous une garantie sur vos prestations ?', answer: 'Absolument, toutes nos prestations sont accompagnées d’une garantie complète pièces et main-d’œuvre.' }
  ];

  const faq = (content.faq && content.faq.length > 0) ? content.faq : defaultFaq;

  const defaultStats = [
    { value: '99.4%', label: 'Satisfaction Client' },
    { value: '15+', label: 'Années d\'Expérience' },
    { value: '24/7', label: 'Service d\'Urgence' },
    { value: '1,200+', label: 'Projets Réalisés' }
  ];

  const stats = (content.stats && content.stats.length > 0) ? content.stats : defaultStats;

  const heroBgImage = sectorImgs.heroBg;
  const aboutImage = sectorImgs.aboutImg;

  const btnCss = getButtonCss(content.buttonStyle, primaryColor);

  // Section renderers map
  const renderSection = (secName: string): string => {
    switch (secName.toLowerCase()) {
      case 'hero':
        return `
        <!-- HERO SECTION -->
        <section class="relative py-24 lg:py-32 bg-slate-950 text-white overflow-hidden min-h-[85vh] flex items-center">
          ${content.heroVideo ? `
          <video autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover z-0 opacity-40">
            <source src="${content.heroVideo}" type="video/mp4">
          </video>
          ` : `
          <div class="absolute inset-0 z-0 opacity-25 bg-cover bg-center" style="background-image: url('${heroBgImage}');"></div>
          `}
          <div class="absolute inset-0 z-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/45"></div>

          <div class="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            <div class="lg:col-span-7 text-left space-y-6">
              <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm" style="background-color: ${accentColor}26; color: ${accentColor}; border: 1px solid ${accentColor}40;">
                <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${accentColor}"></span>
                ${content.tagline || 'Excellence & Service Garanti'}
              </span>

              <h1 class="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight">
                ${content.heroTitle || `${companyName} - Services d'Excellence`}
              </h1>

              <p class="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                ${content.heroSubtitle || 'Intervention rapide, transparence totale et qualité professionnelle garantie à ' + (city || 'votre adresse') + '.'}
              </p>

              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <a href="#devis" class="${btnCss.class}" style="${btnCss.style}">
                  ${content.ctaButton || i18n.getQuote}
                </a>
                ${phone ? `
                  <a href="tel:${phone}" class="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm transition-all text-center flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    ${i18n.callUs}: ${phone}
                  </a>
                ` : ''}
              </div>

              <!-- TRUST BADGES -->
              <div class="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
                ${stats.map(s => `
                  <div>
                    <div class="text-2xl font-black text-white">${s.value}</div>
                    <div class="text-xs text-slate-400 font-medium">${s.label}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="lg:col-span-5 relative">
              <div class="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
                <img src="${heroBgImage}" alt="${companyName}" class="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700" referrerpolicy="no-referrer" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                
                <div class="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="flex text-amber-400 text-sm">★★★★★</div>
                    <span class="text-xs font-bold text-white">4.9/5 Avis Clients</span>
                  </div>
                  <p class="text-xs text-slate-300 italic">"Intervention extrêmement rapide et travail irréprochable. Je recommande vivement !"</p>
                  <span class="text-[10px] text-slate-400 font-bold block mt-2">— Client vérifié (${city || 'Local'})</span>
                </div>
              </div>
            </div>
          </div>
        </section>`;

      case 'beforeafter': {
        const transVideo = content.section2Video || "https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4";
        const transTitle = content.beforeAfterTitle || "--- ACCÈS AUX COULISSES";
        const transHeadline = content.beforeAfterHeadline || "NOUS CONCEVONS. <span class='text-amber-400'>Puis nous réalisons.</span>";
        const transDescription = content.beforeAfterDescription || `Chez ${companyName}, chaque projet à ${city || 'votre région'} est mené de main de maître. Nous étudions l'existant, éliminons les défauts et concevons des installations modernes et esthétiques.`;
        const transBullets = content.beforeAfterBullets || [
          "Visite conseil gratuite et étude technique",
          "Conception sur mesure par notre bureau d'étude",
          "Travaux exécutés par nos compagnons compagnonnés",
          "Zéro sous-traitance et suivi de chantier transparent"
        ];
        const transBtnLabel = content.beforeAfterBtnLabel || `Faire équipe avec ${companyName}`;

        return `
        <!-- BEFORE & AFTER TRANSFORMATION SHOWCASE -->
        <section class="py-24 ${isDarkTheme ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} border-b border-slate-800/30" id="transformation">
          <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <!-- Left Column: Video Transformation Showcase -->
            <div class="lg:col-span-6 relative">
              <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video group bg-black">
                <video autoplay loop muted playsinline class="w-full h-full object-cover">
                  <source src="${transVideo}" type="video/mp4">
                </video>
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div class="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-slate-900/95 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-md">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  TRANSFORMATION EN DIRECT
                </div>
              </div>
            </div>

            <!-- Right Column: Conversion Copy -->
            <div class="lg:col-span-6 space-y-6 text-left">
              <span class="text-xs font-bold uppercase tracking-widest text-amber-500 block">${transTitle}</span>
              <h2 class="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
                ${transHeadline}
              </h2>
              <p class="${isDarkTheme ? 'text-slate-300' : 'text-slate-600'} text-base leading-relaxed">
                ${transDescription}
              </p>

              <div class="space-y-3 pt-2">
                ${transBullets.map(bullet => `
                  <div class="flex items-start gap-3 text-sm font-semibold">
                    <div class="w-5 h-5 rounded-full bg-amber-500/25 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</div>
                    <span class="${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}">${bullet}</span>
                  </div>
                `).join('')}
              </div>

              <div class="pt-4">
                <a href="#devis" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-widest transition-all">
                  <span>${transBtnLabel}</span>
                  <span>→</span>
                </a>
              </div>
            </div>

          </div>
        </section>
        `;
      }

      case 'about':
        return `
        <!-- ABOUT US SECTION -->
        <section class="py-20 ${isDarkTheme ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} border-b border-slate-800/30" id="about">
          <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-6 relative">
              <div class="relative rounded-3xl overflow-hidden shadow-xl border border-slate-700/40">
                <img src="${aboutImage}" alt="Notre Équipe" class="w-full h-[400px] object-cover" referrerpolicy="no-referrer" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';" />
                <div class="absolute bottom-4 right-4 bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-700 text-white max-w-xs">
                  <div class="text-2xl font-black text-amber-400">100%</div>
                  <div class="text-xs font-bold">Transparence & Garantie</div>
                  <p class="text-[11px] text-slate-400 mt-1">Intervention exécutée par des professionnels diplômés et agréés.</p>
                </div>
              </div>
            </div>

            <div class="lg:col-span-6 space-y-6">
              <span class="text-xs font-bold uppercase tracking-wider text-blue-500 block">${i18n.aboutTitle}</span>
              <h2 class="text-3xl sm:text-4xl font-black leading-tight">
                ${content.aboutTitle || `Une Équipe Passionnée au Service de ${companyName}`}
              </h2>
              <p class="text-slate-400 text-base leading-relaxed">
                ${content.aboutText || `Depuis plusieurs années, ${companyName} s'impose comme un acteur de confiance à ${city || 'votre région'}. Nous combinons savoir-faire artisanal, équipements modernes et réactivité exemplaire.`}
              </p>

              <div class="space-y-3 pt-2">
                ${(content.aboutHighlights || [
                  'Intervention prioritaire le jour même pour les urgences',
                  'Devis clair et détaillé gratuit avant tous travaux',
                  'Équipe qualifiée, diplômée et continuellement formée',
                  'Suivi personnalisé et garantie pièces & main d\'œuvre'
                ]).map(h => `
                  <div class="flex items-center gap-3 text-sm font-semibold">
                    <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                    <span>${h}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </section>`;

      case 'services':
        return `
        <!-- SERVICES GRID -->
        <section class="py-20 ${isDarkTheme ? 'bg-slate-950 text-white' : 'bg-slate-50/80 text-slate-900'}" id="services">
          <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-2xl mx-auto mb-16">
              <span class="text-xs font-bold uppercase tracking-wider text-blue-500 block mb-2">Prestations Sur Mesure</span>
              <h2 class="text-3xl sm:text-4xl font-black mb-4">${i18n.servicesTitle}</h2>
              <p class="text-slate-400 text-base">${i18n.servicesSub}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${services.map((srv, idx) => {
                const buttonText = (srv as any).ctaText || (idx === 0 ? 'Découvrir la prestation' : idx === 1 ? 'Voir les détails' : '');
                return `
                <div class="${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'} rounded-3xl overflow-hidden border shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
                  <div>
                    <div class="h-48 overflow-hidden relative">
                      <img src="${srv.image}" alt="${srv.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerpolicy="no-referrer" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80';" />
                      <div class="absolute top-4 right-4 px-3 py-1 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold rounded-full border border-slate-700">
                        ${srv.price || (idx === 0 ? 'Sur Devis' : idx === 1 ? 'Sur Mesure' : 'Inclus')}
                      </div>
                    </div>

                    <div class="p-8">
                      <h3 class="text-xl font-bold mb-3 ${isDarkTheme ? 'text-white' : 'text-slate-900'} group-hover:text-blue-500 transition-colors">${srv.title}</h3>
                      <p class="text-slate-400 text-sm leading-relaxed mb-6">${srv.description}</p>
                    </div>
                  </div>

                  <div class="px-8 pb-8 pt-0">
                    ${buttonText ? `
                      <a href="#devis" class="w-full py-3 rounded-xl border ${isDarkTheme ? 'border-slate-800 text-slate-200 hover:border-blue-500' : 'border-slate-200 text-slate-800 hover:border-blue-600'} font-bold text-xs flex items-center justify-center gap-2 transition-all">
                        <span>${buttonText}</span>
                        <span>→</span>
                      </a>
                    ` : ''}
                  </div>
                </div>
              `}).join('')}
            </div>
          </div>
        </section>`;

      case 'portfolio':
        return `
        <!-- FEATURED PORTFOLIO -->
        <section class="py-20 ${isDarkTheme ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} border-t border-slate-800/30" id="portfolio">
          <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-2xl mx-auto mb-16">
              <span class="text-xs font-bold uppercase tracking-wider text-blue-500 block mb-2">Galerie de Projets</span>
              <h2 class="text-3xl sm:text-4xl font-black mb-4">${i18n.portfolioTitle}</h2>
              <p class="text-slate-400 text-base">${i18n.portfolioSub}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              ${portfolio.map(p => `
                <div class="rounded-2xl overflow-hidden border border-slate-800 shadow-sm group relative h-64">
                  <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerpolicy="no-referrer" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div class="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">${p.category || 'Réalisation'}</span>
                    <h3 class="text-base font-bold leading-tight">${p.title}</h3>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>`;

      case 'whyus':
        return `
        <!-- WHY CHOOSE US -->
        <section class="py-20 bg-slate-950 text-white relative">
          <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-2xl mx-auto mb-16">
              <h2 class="text-3xl sm:text-4xl font-black mb-4">${i18n.whyUsTitle}</h2>
              <p class="text-slate-400 text-base">${i18n.whyUsSub}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${whyUs.map((w, idx) => `
                <div class="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md hover:border-slate-700 transition">
                  <div class="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center font-black text-lg" style="background-color: ${primaryColor}">
                    0${idx + 1}
                  </div>
                  <h3 class="text-xl font-bold mb-3 text-white">${w.title}</h3>
                  <p class="text-slate-400 text-sm leading-relaxed">${w.text}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>`;

      case 'steps':
        return `
        <!-- STEP-BY-STEP PROCESS -->
        <section class="py-20 ${isDarkTheme ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} border-t border-slate-800/30">
          <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-2xl mx-auto mb-16">
              <h2 class="text-3xl sm:text-4xl font-black mb-4">${i18n.stepsTitle}</h2>
              <p class="text-slate-400 text-base">${i18n.stepsSub}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${steps.map(st => `
                <div class="p-8 rounded-3xl ${isDarkTheme ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/80'} border shadow-xs relative">
                  <span class="text-5xl font-black opacity-20 block mb-2 font-mono">${st.step}</span>
                  <h3 class="text-lg font-bold mb-2">${st.title}</h3>
                  <p class="text-slate-400 text-sm leading-relaxed">${st.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>`;

      case 'reviews':
      case 'testimonials':
        if (testimonials.length === 0) return '';
        return `
        <!-- TESTIMONIALS & REVIEWS SECTION -->
        <section class="py-20 ${isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} border-t border-slate-800/30" id="reviews">
          <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-2xl mx-auto mb-16">
              <span class="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">★ 4.9/5 Note Moyenne Vérifiée</span>
              <h2 class="text-3xl sm:text-4xl font-black mb-4">${i18n.reviewsTitle}</h2>
              <p class="text-slate-400 text-base">${i18n.reviewsSub}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${testimonials.map(t => `
                <div class="${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/80 border-slate-200/70'} p-8 rounded-3xl border shadow-xs flex flex-col justify-between">
                  <div>
                    <div class="flex text-amber-400 mb-4 text-base">
                      ${'★'.repeat(t.rating || 5)}
                    </div>
                    <p class="text-slate-300 italic text-sm mb-6 leading-relaxed">"${t.text}"</p>
                  </div>
                  <div class="border-t border-slate-800/60 pt-4 flex items-center gap-3">
                    <img src="${t.avatar}" alt="${t.name}" class="w-10 h-10 rounded-full object-cover border border-slate-700" referrerpolicy="no-referrer" loading="lazy" onerror="this.onerror=null; this.src='https://i.pravatar.cc/100?img=12';" />
                    <div>
                      <p class="font-bold text-xs ${isDarkTheme ? 'text-white' : 'text-slate-900'}">${t.name}</p>
                      <span class="text-[11px] text-slate-500 block">${t.city || city || 'Avis Vérifié'}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>`;

      case 'faq':
        return `
        <!-- FAQ SECTION -->
        <section class="py-20 ${isDarkTheme ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} border-t border-slate-800/30" id="faq">
          <div class="max-w-4xl mx-auto px-6">
            <div class="text-center mb-16">
              <h2 class="text-3xl sm:text-4xl font-black mb-4">${i18n.faqTitle}</h2>
              <p class="text-slate-400">${i18n.faqSub}</p>
            </div>

            <div class="space-y-4">
              ${faq.map(f => `
                <details class="group p-6 rounded-2xl ${isDarkTheme ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/80'} border shadow-xs cursor-pointer">
                  <summary class="flex items-center justify-between text-base font-bold list-none">
                    <span>${f.question}</span>
                    <span class="text-blue-500 font-bold text-lg group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p class="text-slate-400 text-sm leading-relaxed mt-4 pt-4 border-t border-slate-800/40">
                    ${f.answer}
                  </p>
                </details>
              `).join('')}
            </div>
          </div>
        </section>`;

      case 'devis':
      case 'form':
        return `
        <!-- INSTANT ESTIMATE & BOOKING FORM -->
        <section class="py-20 ${isDarkTheme ? 'bg-slate-950' : 'bg-white'} border-t border-slate-800/30" id="devis">
          <div class="max-w-4xl mx-auto px-6">
            <div class="p-8 sm:p-14 rounded-3xl bg-slate-950 text-white shadow-2xl relative overflow-hidden border border-slate-800">
              <div class="text-center max-w-xl mx-auto mb-10">
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">Réponse sous 15 min</span>
                <h2 class="text-3xl sm:text-4xl font-black mb-3">${i18n.formTitle}</h2>
                <p class="text-slate-400 text-sm">${i18n.formSub}</p>
              </div>

              <form onsubmit="alert('Merci ! Votre demande a bien été envoyée. Notre équipe vous contacte sous 15 minutes.'); return false;" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">${i18n.fullName}</label>
                    <input type="text" required placeholder="Jean Dupont" class="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">${i18n.phoneLabel}</label>
                    <input type="tel" required placeholder="${phone || '06 12 34 56 78'}" class="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm">
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">${i18n.cityLabel}</label>
                    <input type="text" placeholder="${city || 'Ville'}" class="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">${i18n.serviceType}</label>
                    <select class="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-sm">
                      ${services.map(s => `<option value="${s.title}">${s.title}</option>`).join('')}
                      <option value="Autre">Autre demande urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">${i18n.needDesc}</label>
                  <textarea rows="3" placeholder="Décrivez succinctement votre besoin ou la date souhaitée d'intervention..." class="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"></textarea>
                </div>

                <button type="submit" class="w-full ${btnCss.class}" style="${btnCss.style}">
                  ${i18n.submitBtn}
                </button>
              </form>
            </div>
          </div>
        </section>`;

      case 'map':
      case 'location': {
        const mapSearch = address || (companyName + ' ' + (city || ''));
        const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapSearch)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
        return `
        <!-- GOOGLE MAPS LOCATION SECTION -->
        <section class="py-16 ${isDarkTheme ? 'bg-slate-900' : 'bg-slate-100'} border-t border-slate-800/30" id="location">
          <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-2xl mx-auto mb-10">
              <span class="text-xs font-bold uppercase tracking-wider text-blue-500 block mb-2">${lang === 'fr' ? 'Localisation & Accès' : 'Location & Access'}</span>
              <h2 class="text-2xl sm:text-3xl font-black mb-2">${companyName} — ${city || 'Notre Établissement'}</h2>
              <p class="text-slate-400 text-sm">${address ? address : (city ? `Retrouvez-nous au cœur de ${city} et ses environs.` : 'Localisez facilement notre établissement.')}</p>
            </div>
            
            <div class="rounded-3xl overflow-hidden shadow-2xl border ${isDarkTheme ? 'border-slate-800' : 'border-slate-200'} h-[380px] w-full relative bg-slate-900">
              <iframe
                title="Google Maps - ${companyName}"
                width="100%"
                height="100%"
                style="border:0;"
                loading="lazy"
                allowfullscreen
                src="${mapUrl}">
              </iframe>
            </div>
          </div>
        </section>`;
      }

      default:
        return '';
    }
  };

  // Determine section layout order
  const defaultLayout = ['hero', 'beforeafter', 'about', 'services', 'portfolio', 'whyus', 'steps', 'reviews', 'faq', 'devis', 'map'];
  let layout = (content.layoutOrder && content.layoutOrder.length > 0)
    ? [...content.layoutOrder]
    : [...defaultLayout];

  // Guarantee that map/location is always present on all templates
  if (!layout.includes('map') && !layout.includes('location')) {
    layout.push('map');
  }

  const renderedBodySections = layout.map(sec => renderSection(sec)).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="/">
  <meta name="referrer" content="no-referrer">
  <title>${companyName} - ${content.heroTitle || i18n.servicesTitle}</title>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Dynamic Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontConfig.link}&display=swap" rel="stylesheet">

  <style>
    body { font-family: ${fontConfig.css}; }
    h1, h2, h3, h4, .font-heading { font-family: ${fontConfig.headingCss}; }
    html { scroll-behavior: smooth; }
    ${content.customCss || ''}
  </style>
</head>
<body class="${isDarkTheme ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} antialiased selection:bg-blue-500 selection:text-white">

  <!-- TOP NOTICE / EMERGENCY BAR -->
  <div class="bg-slate-900/80 text-slate-300 text-xs py-2 px-6 border-b border-slate-800/60 backdrop-blur-xs">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center gap-2 font-medium">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>${i18n.urgencyNotice} <strong>${city || 'votre zone'}</strong></span>
      </div>
      <div class="flex items-center gap-6 text-[11px]">
        <span>${i18n.monFri}</span>
        ${phone ? `<a href="tel:${phone}" class="text-white font-bold hover:underline flex items-center gap-1">⚡ ${i18n.callUs}: ${phone}</a>` : ''}
      </div>
    </div>
  </div>

  <!-- NAVIGATION HEADER ALWAYS TRANSPARENT -->
  <header class="sticky top-0 z-50 bg-transparent border-b border-white/10 backdrop-blur-md transition-all">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md" style="background-color: ${primaryColor}">
          ${companyName.substring(0, 1)}
        </div>
        <div>
          <span class="text-lg font-bold tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'} block leading-tight">${companyName}</span>
          <span class="text-[11px] text-slate-400 font-medium">${city || 'Service Professionnel'}</span>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm font-semibold ${isDarkTheme ? 'text-slate-200' : 'text-slate-700'}">
        <a href="#about" class="hover:text-blue-500 transition">À Propos</a>
        <a href="#services" class="hover:text-blue-500 transition">Services</a>
        <a href="#portfolio" class="hover:text-blue-500 transition">Réalisations</a>
        <a href="#reviews" class="hover:text-blue-500 transition">Avis</a>
        <a href="#faq" class="hover:text-blue-500 transition">FAQ</a>
      </nav>

      <div class="flex items-center gap-3">
        ${phone ? `
          <a href="tel:${phone}" title="${i18n.callUs}: ${phone}" class="p-3 rounded-full text-white shadow-md transition-all hover:scale-110 active:scale-95 flex items-center justify-center shrink-0" style="background-color: ${primaryColor}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          </a>
        ` : ''}
        <a href="#devis" class="px-5 py-2.5 rounded-full font-bold text-xs ${isDarkTheme ? 'text-white bg-slate-800 hover:bg-slate-700' : 'text-slate-900 bg-slate-100 hover:bg-slate-200'} transition-all">
          ${content.ctaButton || i18n.getQuote}
        </a>
      </div>
    </div>
  </header>

  <!-- DYNAMICALLY ORDERED BODY SECTIONS -->
  ${renderedBodySections}

  <!-- FOOTER -->
  <footer class="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 text-sm">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
      <div class="space-y-3">
        <span class="text-white font-bold text-xl block">${companyName}</span>
        <p class="text-xs text-slate-500 leading-relaxed">${address || (city ? city + ' & environs' : 'Service professionnel de proximité')}</p>
        <span class="text-xs text-emerald-400 font-bold block">★ Service Certifié 24h/7j</span>
      </div>

      <div>
        <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-4">Contact Direct</h4>
        <ul class="space-y-2 text-xs">
          ${phone ? `<li>Tél: <a href="tel:${phone}" class="text-slate-300 hover:text-white font-bold">${phone}</a></li>` : ''}
          ${email ? `<li>Email: <a href="mailto:${email}" class="text-slate-300 hover:text-white">${email}</a></li>` : ''}
          <li>Zone: <span class="text-slate-300">${city || 'Régionale'}</span></li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-4">${i18n.hoursTitle}</h4>
        <ul class="space-y-2 text-xs">
          <li>${i18n.monFri}</li>
          <li class="text-emerald-400 font-semibold">${i18n.satSun}</li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-4">Urgence & Devis</h4>
        <p class="text-xs text-slate-500 mb-3">Intervention rapide garantie sur rendez-vous ou urgence immédiate.</p>
        <a href="#devis" class="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-block">
          ${i18n.getQuote}
        </a>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
      <p>© ${new Date().getFullYear()} ${companyName}. Tous droits réservés.</p>
      <div class="flex gap-6">
        <a href="#services" class="hover:text-slate-400">Services</a>
        <a href="#reviews" class="hover:text-slate-400">Avis</a>
        <a href="#devis" class="hover:text-slate-400">Contact</a>
      </div>
    </div>
  </footer>

  <script>
    // Force play for video backgrounds on interaction / load
    document.addEventListener('DOMContentLoaded', function() {
      var vids = document.querySelectorAll('video');
      vids.forEach(function(video) {
        video.play().catch(function(err) {
          console.log('Video autoplay blocked:', err);
          var playOnInteract = function() {
            video.play().catch(function() {});
            document.removeEventListener('click', playOnInteract);
            document.removeEventListener('touchstart', playOnInteract);
          };
          document.addEventListener('click', playOnInteract);
          document.addEventListener('touchstart', playOnInteract);
        });
      });
    });
  </script>
</body>
</html>`;
}
