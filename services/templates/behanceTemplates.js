// Behance High-End Website Design Templates
// Direct implementations inspired by top Behance showcase portfolios:
// 1. Construction Company: https://www.behance.net/gallery/253285809/Landing-page-dlja-stroitelnoj-kompanii-lending-sajt
// 2. Home Cleaning Service: https://www.behance.net/gallery/163204349/Home-Cleaning-Service-website
// 3. Modern Plumbing Services: https://www.behance.net/gallery/245989723/Modern-Plumbing-Services-Website-Design
// 4. Gourmet Restaurant: https://www.behance.net/gallery/245591699/Restaurant-Web-Site-Design

import { detectLanguage } from '../siteTemplate.js';

export const BEHANCE_TEMPLATES_META = [
  {
    id: 'behance-construction',
    name: 'Industrial Construction & Renovation',
    behanceUrl: 'https://www.behance.net/gallery/253285809/Landing-page-dlja-stroitelnoj-kompanii-lending-sajt',
    category: 'Construction & Building',
    badge: 'Behance Featured',
    previewColor: '#F59E0B',
    bgPreview: '#0F172A',
    description: 'Heavy dark slate canvas, architectural grid lines, project specs, interactive estimate calculator, and bold safety amber accents.',
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop'
  },
  {
    id: 'behance-cleaning',
    name: 'FreshSparkle Cleaning & Housekeeping',
    behanceUrl: 'https://www.behance.net/gallery/163204349/Home-Cleaning-Service-website',
    category: 'Home Services & Cleaning',
    badge: 'Behance Gold',
    previewColor: '#0EA5E9',
    bgPreview: '#F0F9FF',
    description: 'Ultra-fresh sky blue & mint layout, interactive room cleaning price calculator slider, eco-friendly badges, and before/after slider.',
    thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80&auto=format&fit=crop'
  },
  {
    id: 'behance-plumbing',
    name: 'AquaFlow Pro Emergency Plumbing',
    behanceUrl: 'https://www.behance.net/gallery/245989723/Modern-Plumbing-Services-Website-Design',
    category: 'Plumbing & Emergency Repair',
    badge: 'Behance Pro',
    previewColor: '#0284C7',
    bgPreview: '#0369A1',
    description: 'Deep ocean aquatic blue theme, 24/7 emergency alert ticker, upfront service price matrix, instant diagnostic wizard & 1-tap call.',
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format&fit=crop'
  },
  {
    id: 'behance-restaurant',
    name: 'Le Jardin Luxury Gourmet Dining',
    behanceUrl: 'https://www.behance.net/gallery/245591699/Restaurant-Web-Site-Design',
    category: 'Gastronomy & Fine Dining',
    badge: 'Behance Luxury',
    previewColor: '#D97706',
    bgPreview: '#090A0F',
    description: 'Atmospheric dark mood dining, Playfair Display typography, warm champagne gold accents, interactive food menu tabs & table reservation widget.',
    thumbnail: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop'
  }
];

// Helper to render full Behance design showcase vertical mockups & design system
function renderBehanceDesignShowcaseSection(photos, isEn) {
  if (!photos || photos.length === 0) return '';

  return `
  <!-- Behance Full Design Blueprint & Mockup Showcase -->
  <section class="py-20 bg-slate-950/80 border-t border-b border-amber-500/20 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <span>🎨</span> ${isEn ? 'Scraped Behance UI Design Blueprint' : 'Structure UI Scrappée sur Behance'}
          </div>
          <h2 class="text-3xl sm:text-5xl font-black text-white font-heading">
            ${isEn ? 'Full-Length Visual Layout & Design System' : 'Rendu de la Maquette & Structure Visuelle Full-Design'}
          </h2>
          <p class="text-sm text-slate-400 mt-2 max-w-2xl">
            ${isEn ? 'Extracted high-resolution full page layout mockups and assets directly from the original Behance portfolio showcase.' : 'Reproduction exacte du design vertical et des composants graphiques extraits de la galerie Behance d origine.'}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${photos.map((img, idx) => `
          <div class="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition duration-500 shadow-2xl">
            <div class="relative overflow-hidden aspect-[9/16] bg-slate-950">
              <img src="${img}" alt="Behance Design Layout ${idx + 1}" class="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30">
                ${isEn ? `Layout Spec Block #${idx + 1}` : `Composant Design #${idx + 1}`}
              </div>
            </div>
            <div class="p-6 space-y-2">
              <h4 class="text-base font-bold text-white font-heading">${isEn ? 'UI Mockup & Asset Element' : 'Élément Graphique Extrai de Behance'}</h4>
              <p class="text-xs text-slate-400 leading-relaxed">${isEn ? 'Full resolution asset integrated into the live interactive framework.' : 'Composant haute résolution réintégré dans le site fonctionnel.'}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

export function buildBehanceConstructionTemplate(lead, content, lang = 'fr') {
  const companyName = lead.name || lead.companyName || lead.company || lead.businessName || 'Construx Pro';
  const phone = lead.phone || content.contactPhone || '01 89 00 12 34';
  const email = lead.email || content.contactEmail || 'contact@' + companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  const city = lead.city || content.city || 'votre région';
  const isEn = lang === 'en';

  const photos = content.photos && content.photos.length >= 3 ? content.photos : [
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1000&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80&auto=format&fit=crop'
  ];

  return `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} | ${isEn ? 'Construction & Renovation Experts' : 'Entreprise de Construction & Rénovation'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0F172A; color: #F8FAFC; }
    h1, h2, h3, .font-heading { font-family: 'Montserrat', sans-serif; }
    .bg-grid-pattern {
      background-image: radial-gradient(rgba(245, 158, 11, 0.15) 1px, transparent 0);
      background-size: 28px 28px;
    }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 antialiased bg-grid-pattern">

  <!-- Top Emergency / Hotline Ticker -->
  <div class="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center justify-between">
    <div class="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
      <span class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
        ${isEn ? '🏗️ Expert General Contractors & Structural Builders' : '🏗️ Constructeur Général Certifié & Rénovations Générales'} — ${city}
      </span>
      <div class="flex items-center gap-4">
        <span>${isEn ? 'Licensed & Fully Insured' : 'Garantie Décennale Certifiée'}</span>
        <a href="tel:${phone}" class="underline hover:text-white font-extrabold">📞 ${phone}</a>
      </div>
    </div>
  </div>

  <!-- Header Navigation -->
  <header class="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20">
          ${companyName.charAt(0)}
        </div>
        <div>
          <span class="text-xl font-extrabold tracking-tight text-white block leading-tight font-heading">${companyName}</span>
          <span class="text-[10px] text-amber-400 font-bold uppercase tracking-widest">${isEn ? 'Construction & Engineering' : 'Bâtiment & Travaux'}</span>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
        <a href="#about" class="hover:text-amber-400 transition">${isEn ? 'About Us' : 'Expertise'}</a>
        <a href="#services" class="hover:text-amber-400 transition">${isEn ? 'Services' : 'Prestations'}</a>
        <a href="#portfolio" class="hover:text-amber-400 transition">${isEn ? 'Projects' : 'Réalisations'}</a>
        <a href="#calculator" class="hover:text-amber-400 transition">${isEn ? 'Cost Calculator' : 'Estimateur'}</a>
        <a href="#contact" class="hover:text-amber-400 transition">Contact</a>
      </nav>

      <a href="#contact" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all transform hover:scale-105 shadow-lg shadow-amber-500/20">
        ${isEn ? 'Get Estimate' : 'Devis Gratuit'}
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative py-24 md:py-32 overflow-hidden border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
          <span>⚡</span> ${isEn ? 'Precision Engineering & General Contracting' : 'Excellence & Garantie Décennale'}
        </div>
        <h1 class="text-4xl sm:text-6xl font-black text-white leading-none tracking-tight font-heading">
          ${content.heroTitle || (isEn ? 'Building Sustainable Architectural Landmark Properties' : `Construire & Rénover Vos Projets d'Exception à ${city}`)}
        </h1>
        <p class="text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
          ${content.heroSubtitle || (isEn ? 'From foundation to final finishes. We deliver turnkey residential and commercial structural construction with absolute budget guarantee.' : 'Du gros œuvre aux finitions haut de gamme. Nous concrétisons vos projets de rénovation et construction neuve avec respect strict des délais.')}
        </p>

        <div class="pt-4 flex flex-wrap items-center gap-4">
          <a href="#calculator" class="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition">
            ${isEn ? 'Calculate Cost Online' : 'Calculer Mon Devis'}
          </a>
          <a href="tel:${phone}" class="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition">
            📞 ${phone}
          </a>
        </div>

        <!-- Key Stats Bar -->
        <div class="pt-8 grid grid-cols-3 gap-6 border-t border-slate-800">
          <div>
            <div class="text-3xl font-black text-amber-400 font-heading">150+</div>
            <div class="text-xs text-slate-400 font-bold uppercase">${isEn ? 'Projects Delivered' : 'Chantiers Livrés'}</div>
          </div>
          <div>
            <div class="text-3xl font-black text-amber-400 font-heading">100%</div>
            <div class="text-xs text-slate-400 font-bold uppercase">${isEn ? 'On-Time Rate' : 'Délais Respectés'}</div>
          </div>
          <div>
            <div class="text-3xl font-black text-amber-400 font-heading">10 Ans</div>
            <div class="text-xs text-slate-400 font-bold uppercase">${isEn ? 'Decennial Guarantee' : 'Garantie Décennale'}</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 relative">
        <div class="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl">
          <img src="${photos[0]}" alt="Construction Project" class="w-full h-[520px] object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800">
            <span class="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">📐 ${isEn ? 'Blueprint Specs' : 'Normes Qualité High-Tech'}</span>
            <div class="text-sm font-extrabold text-white">${isEn ? 'Certifications & Compliance ISO 9001' : 'Conformité RE2020 & Normes Énergétiques'}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Estimate Calculator Widget -->
  <section id="calculator" class="py-20 bg-slate-950 border-b border-slate-800">
    <div class="max-w-5xl mx-auto px-6">
      <div class="text-center space-y-3 mb-12">
        <span class="text-xs font-extrabold text-amber-400 uppercase tracking-widest">🧮 ${isEn ? 'Instant Estimator' : 'Estimateur de Budget en Ligne'}</span>
        <h2 class="text-3xl sm:text-4xl font-black text-white font-heading">${isEn ? 'Estimate Your Construction Cost' : 'Estimez le Coût de Vos Travaux en 1 Clic'}</h2>
      </div>

      <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-8 shadow-2xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-400 mb-2">${isEn ? 'Project Type' : 'Type de Projet'}</label>
            <select id="calcType" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-amber-500">
              <option value="1200">${isEn ? 'Full Home Renovation (€1200 / m²)' : 'Rénovation Complète (€1 200 / m²)'}</option>
              <option value="2100">${isEn ? 'New House Construction (€2100 / m²)' : 'Construction Neuve Clé en Main (€2 100 / m²)'}</option>
              <option value="850">${isEn ? 'Commercial Fit-Out (€850 / m²)' : 'Aménagement Commercial (€850 / m²)'}</option>
              <option value="600">${isEn ? 'Roofing & Exterior Refurbishment (€600 / m²)' : 'Rénovation Toiture & Façade (€600 / m²)'}</option>
            </select>
          </div>

          <div>
            <div class="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
              <span>${isEn ? 'Surface Area (m²)' : 'Surface des Travaux (m²)'}</span>
              <span id="surfaceVal" class="text-amber-400 font-extrabold text-sm">85 m²</span>
            </div>
            <input type="range" id="calcSurface" min="20" max="400" value="85" step="5" class="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg">
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span class="text-xs font-bold text-slate-400 uppercase block">${isEn ? 'Estimated Total Investment' : 'Estimation Budget Indicative'}</span>
            <span id="calcTotal" class="text-3xl font-black text-amber-400 font-heading">102 000 €</span>
          </div>
          <a href="#contact" class="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
            ${isEn ? 'Lock In This Quote' : 'Valider Mon Devis Gratuit'}
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Services Grid -->
  <section id="services" class="py-24 max-w-7xl mx-auto px-6">
    <div class="text-center space-y-3 mb-16">
      <span class="text-xs font-extrabold text-amber-400 uppercase tracking-widest">⚙️ ${isEn ? 'Our Expertise' : 'Nos Domaines d Interventions'}</span>
      <h2 class="text-3xl sm:text-5xl font-black text-white font-heading">${isEn ? 'Comprehensive Building Solutions' : 'Services Complètes de Construction'}</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-amber-500/50 transition">
        <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-2xl font-black">🏗️</div>
        <h3 class="text-xl font-bold text-white font-heading">${isEn ? 'Structural & New Builds' : 'Construction Neuve & Extension'}</h3>
        <p class="text-sm text-slate-400 leading-relaxed">${isEn ? 'Turnkey residential houses, foundation engineering, and structural masonry.' : 'Fondations, gros œuvre, maçonnerie générale et agrandissement de maisons.'}</p>
      </div>

      <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-amber-500/50 transition">
        <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-2xl font-black">🔨</div>
        <h3 class="text-xl font-bold text-white font-heading">${isEn ? 'Complete Renovation' : 'Rénovation Lourde & Clé en Main'}</h3>
        <p class="text-sm text-slate-400 leading-relaxed">${isEn ? 'Interior redesign, load-bearing wall removal, electrical and plumbing overhaul.' : 'Réaménagement d intérieur, ouverture de murs porteurs et rénovation énergétique.'}</p>
      </div>

      <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-amber-500/50 transition">
        <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-2xl font-black">🏠</div>
        <h3 class="text-xl font-bold text-white font-heading">${isEn ? 'Roofing & Facades' : 'Toiture & Ravalement de Façade'}</h3>
        <p class="text-sm text-slate-400 leading-relaxed">${isEn ? 'Complete roof replacement, waterproofing, thermal insulation, and stone restoration.' : 'Charpente, couverture, étanchéité et ravalement isolant extérieur.'}</p>
      </div>
    </div>
  </section>

  ${renderBehanceDesignShowcaseSection(photos, isEn)}

  <!-- Project Portfolio Gallery -->
  <section id="portfolio" class="py-24 bg-slate-950 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-wrap items-end justify-between gap-6 mb-16">
        <div>
          <span class="text-xs font-extrabold text-amber-400 uppercase tracking-widest block mb-2">📷 ${isEn ? 'Recent Work' : 'Galerie de Nos Chantiers'}</span>
          <h2 class="text-3xl sm:text-5xl font-black text-white font-heading">${isEn ? 'Craftsmanship In Action' : 'Nos Plus Belles Réalisations'}</h2>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${photos.slice(0, 6).map((img, idx) => `
          <div class="group relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
            <img src="${img}" alt="Project ${idx + 1}" class="w-full h-72 object-cover group-hover:scale-110 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80"></div>
            <div class="absolute bottom-6 left-6 right-6">
              <span class="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">${isEn ? 'Commercial & Residential' : 'Projet Réalisé'}</span>
              <h3 class="text-lg font-bold text-white font-heading">${companyName} — ${city}</h3>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Contact Form Section -->
  <section id="contact" class="py-24 max-w-4xl mx-auto px-6">
    <div class="p-10 rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-2xl space-y-8">
      <div class="text-center space-y-2">
        <span class="text-xs font-extrabold text-amber-400 uppercase tracking-widest">📞 ${isEn ? 'Direct Contact' : 'Demandez Votre Devis Gratuit'}</span>
        <h2 class="text-3xl font-black text-white font-heading">${isEn ? 'Start Your Project Today' : 'Discutons de Votre Projet de Construction'}</h2>
        <p class="text-xs text-slate-400">${isEn ? 'Response within 24 hours guaranteed with itemized pricing.' : 'Réponse sous 24h avec chiffrage détaillé garanti.'}</p>
      </div>

      <form class="space-y-4" onsubmit="event.preventDefault(); alert('Merci ! Votre demande de devis a été envoyée.');">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" required placeholder="${isEn ? 'Your Name' : 'Votre Nom Complet'}" class="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500">
          <input type="tel" required placeholder="${isEn ? 'Phone Number' : 'Numéro de Téléphone'}" value="${phone}" class="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500">
        </div>
        <input type="email" required placeholder="${isEn ? 'Email Address' : 'Adresse Email'}" value="${email}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500">
        <textarea rows="4" placeholder="${isEn ? 'Describe your project...' : 'Décrivez votre projet (Rénovation, Extension, Surface...)'}" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"></textarea>
        
        <button type="submit" class="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/20">
          ${isEn ? 'Send Quote Request' : 'Envoyer Ma Demande de Devis'}
        </button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 border-t border-slate-800 text-slate-500 text-xs text-center">
    <p>© ${new Date().getFullYear()} ${companyName}. Tous droits réservés. Design certifié Behance Pro.</p>
  </footer>

  <script>
    const calcType = document.getElementById('calcType');
    const calcSurface = document.getElementById('calcSurface');
    const surfaceVal = document.getElementById('surfaceVal');
    const calcTotal = document.getElementById('calcTotal');

    function updateCalc() {
      if(!calcType || !calcSurface) return;
      const rate = parseInt(calcType.value);
      const m2 = parseInt(calcSurface.value);
      surfaceVal.textContent = m2 + ' m²';
      const total = rate * m2;
      calcTotal.textContent = total.toLocaleString() + ' €';
    }

    if(calcType && calcSurface) {
      calcType.addEventListener('change', updateCalc);
      calcSurface.addEventListener('input', updateCalc);
      updateCalc();
    }
  </script>
</body>
</html>`;
}

export function buildBehanceCleaningTemplate(lead, content, lang = 'fr') {
  const companyName = lead.name || lead.companyName || lead.company || lead.businessName || 'FreshSparkle Clean';
  const phone = lead.phone || content.contactPhone || '01 45 67 89 10';
  const email = lead.email || content.contactEmail || 'contact@freshsparkle.com';
  const city = lead.city || content.city || 'votre ville';
  const isEn = lang === 'en';

  const photos = content.photos && content.photos.length >= 3 ? content.photos : [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1000&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&q=80&auto=format&fit=crop'
  ];

  return `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} | ${isEn ? 'Home Cleaning & Housekeeping Services' : 'Service de Nettoyage & Ménage à Domicile'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #F8FAFC; color: #0F172A; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased">

  <!-- Fresh Banner Header -->
  <div class="bg-sky-500 text-white px-4 py-2 text-xs font-bold flex items-center justify-between">
    <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
      <span>✨ ${isEn ? 'Eco-Friendly Housekeeping & Maid Services' : 'Ménage & Nettoyage Éco-Responsable Certifié'} — ${city}</span>
      <a href="tel:${phone}" class="font-extrabold underline">📞 ${phone}</a>
    </div>
  </div>

  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black text-xl shadow-md">
          🧹
        </div>
        <div>
          <span class="text-xl font-extrabold text-slate-900 block leading-tight">${companyName}</span>
          <span class="text-[10px] text-sky-600 font-bold uppercase tracking-widest">${isEn ? 'Sparkle Housekeeping' : 'Nettoyage Pro'}</span>
        </div>
      </div>

      <a href="#booking" class="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
        ${isEn ? 'Book Cleaning' : 'Réserver Mon Ménage'}
      </a>
    </div>
  </header>

  <section class="py-20 bg-gradient-to-b from-sky-50 to-slate-50">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <span class="px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-sky-700 text-xs font-bold uppercase tracking-wider">
          🌱 100% Produits Éco-Certifiés
        </span>
        <h1 class="text-4xl sm:text-6xl font-black text-slate-900 leading-tight">
          ${content.heroTitle || (isEn ? 'Spotless Homes & Office Cleaning Services' : `Votre Maison Impeccable Sans le Moindre Effort à ${city}`)}
        </h1>
        <p class="text-lg text-slate-600 leading-relaxed">
          ${content.heroSubtitle || (isEn ? 'Professional vetted cleaners using non-toxic eco products. 100% satisfaction guarantee on every booking.' : 'Intervenants qualifiés, produits 100% éco-responsables et réservation simple en 60 secondes.')}
        </p>

        <div class="flex items-center gap-4">
          <a href="#booking" class="px-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-sky-500/25">
            ${isEn ? 'Instant Online Booking' : 'Réserver en 1 Clic'}
          </a>
          <a href="tel:${phone}" class="px-8 py-4 rounded-2xl bg-white border border-slate-300 text-slate-800 font-bold text-sm">
            📞 ${phone}
          </a>
        </div>
      </div>

      <div>
        <img src="${photos[0]}" alt="Cleaning Service" class="rounded-3xl shadow-2xl border-4 border-white object-cover w-full h-[480px]">
      </div>
    </div>
  </section>

  <!-- Pricing Calculator -->
  <section id="booking" class="py-20 max-w-4xl mx-auto px-6">
    <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
      <div class="text-center space-y-2">
        <span class="text-xs font-extrabold text-sky-600 uppercase tracking-widest">🧹 ${isEn ? 'Price Calculator' : 'Calculateur Tarif Inédit'}</span>
        <h2 class="text-3xl font-black text-slate-900">${isEn ? 'Customize Your Housekeeping Plan' : 'Estimez Votre Tarif de Ménage'}</h2>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-500 mb-2">${isEn ? 'Home Size' : 'Nombre de Pièces'}</label>
          <input type="range" id="rooms" min="1" max="8" value="3" class="w-full accent-sky-500">
          <div class="flex justify-between text-xs font-bold text-slate-600 mt-1">
            <span>1 Pièce (Studio)</span>
            <span id="roomCountText" class="text-sky-600 font-extrabold">3 Pièces</span>
            <span>8+ Pièces</span>
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-500 uppercase block">${isEn ? 'Estimated Cost per Visit' : 'Tarif Estimé par Passage'}</span>
            <span id="cleanCost" class="text-3xl font-black text-sky-600">65 €</span>
          </div>
          <button onclick="alert('Réservation confirmée pour ' + document.getElementById('roomCountText').textContent);" class="px-6 py-3 rounded-xl bg-sky-500 text-white font-extrabold text-xs uppercase">
            ${isEn ? 'Confirm Booking' : 'Réserver ce Créneau'}
          </button>
        </div>
      </div>
    </div>
  </section>

  ${renderBehanceDesignShowcaseSection(photos, isEn)}

  <footer class="py-10 border-t border-slate-200 text-center text-xs text-slate-500">
    <p>© ${new Date().getFullYear()} ${companyName}. Tous droits réservés.</p>
  </footer>

  <script>
    const rooms = document.getElementById('rooms');
    const roomCountText = document.getElementById('roomCountText');
    const cleanCost = document.getElementById('cleanCost');

    if(rooms) {
      rooms.addEventListener('input', () => {
        const val = parseInt(rooms.value);
        roomCountText.textContent = val + ' Pièce' + (val > 1 ? 's' : '');
        cleanCost.textContent = (25 + val * 15) + ' €';
      });
    }
  </script>
</body>
</html>`;
}

export function buildBehancePlumbingTemplate(lead, content, lang = 'fr') {
  const companyName = lead.name || lead.companyName || lead.company || lead.businessName || 'AquaFlow Pro Plumbing';
  const phone = lead.phone || content.contactPhone || '01 70 80 90 00';
  const email = lead.email || content.contactEmail || 'urgence@aquaflow.fr';
  const city = lead.city || content.city || 'votre secteur';
  const isEn = lang === 'en';

  const photos = content.photos && content.photos.length >= 3 ? content.photos : [
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1000&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581094128506-45a4b0824927?w=1000&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=1000&q=80&auto=format&fit=crop'
  ];

  return `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} | ${isEn ? '24/7 Emergency Plumbing & Heating' : 'Plomberie Dépannage Urgence 24h/7j'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0369A1; color: #F0F9FF; }
  </style>
</head>
<body class="bg-sky-900 text-sky-50 antialiased">

  <!-- Emergency Ticker Banner -->
  <div class="bg-red-600 text-white px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center justify-between">
    <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
      <span class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
        🚨 ${isEn ? '24/7 Emergency Dispatchers Active' : 'Plombier en Intervention Urgente Imédiate sur'} ${city} (&lt; 30 Mins)
      </span>
      <a href="tel:${phone}" class="bg-white text-red-600 px-3 py-1 rounded font-black text-xs">
        📞 APPELER LE ${phone}
      </a>
    </div>
  </div>

  <header class="sticky top-0 z-50 bg-sky-950/90 backdrop-blur-md border-b border-sky-800">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black text-xl">
          💧
        </div>
        <div>
          <span class="text-xl font-extrabold text-white block leading-tight">${companyName}</span>
          <span class="text-[10px] text-sky-400 font-bold uppercase tracking-widest">${isEn ? 'Pro Plumbers' : 'Urgence Plomberie'}</span>
        </div>
      </div>

      <a href="tel:${phone}" class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg">
        📞 ${phone}
      </a>
    </div>
  </header>

  <section class="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div class="space-y-6">
      <span class="px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-widest">
        ⚡ Interventions en Moins de 30 Minutes
      </span>
      <h1 class="text-4xl sm:text-6xl font-black text-white leading-tight">
        ${content.heroTitle || (isEn ? '24/7 Emergency Plumbing & Leak Repairs' : `Dépannage Plomberie & Fuite d'Eau en Urgence à ${city}`)}
      </h1>
      <p class="text-lg text-sky-200 leading-relaxed">
        ${content.heroSubtitle || (isEn ? 'Rapid response plumbing, water damage repair, and boiler installation with transparent upfront pricing.' : 'Fuite d eau, canalisation bouchée ou panne de chauffe-eau. Tarif annonce clair avant intervention.')}
      </p>

      <div class="flex flex-wrap gap-4">
        <a href="tel:${phone}" class="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-600/30">
          🚨 Appeler pour Urgence (${phone})
        </a>
      </div>
    </div>

    <div>
      <img src="${photos[0]}" alt="Plumbing Service" class="rounded-3xl shadow-2xl border-2 border-sky-400/30 object-cover w-full h-[450px]">
    </div>
  </section>

  ${renderBehanceDesignShowcaseSection(photos, isEn)}

  <footer class="py-10 border-t border-sky-800 text-center text-xs text-sky-400">
    <p>© ${new Date().getFullYear()} ${companyName}. Service Certifié Behance Pro.</p>
  </footer>
</body>
</html>`;
}

export function buildBehanceRestaurantTemplate(lead, content = {}, lang = 'fr') {
  const isEn = lang === 'en' || content.language === 'en';
  const companyName = content.companyName || content.brandName || lead.name || lead.companyName || lead.company || lead.businessName || 'LuxBite Restaurant';
  const phone = content.contactPhone || content.phone || lead.phone || '+33 1 42 68 55 00';
  const email = content.contactEmail || content.email || lead.email || 'contact@luxbite-restaurant.fr';
  const city = content.city || content.displayCity || lead.city || 'Paris';
  const address = content.contactAddress || content.address || (isEn ? '12 Champs-Élysées, 75008 Paris, France' : '12 Avenue des Champs-Élysées, 75008 Paris');

  // Collect all photos from content (photos, uploadedImages, lead photos)
  const userPhotos = [
    ...(content.photos || []),
    ...(content.uploadedImages || []),
    ...(lead.photos || [])
  ].filter(p => typeof p === 'string' && p.trim().length > 0);

  const defaultPhotos = [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&q=80&auto=format&fit=crop', // Burger
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&q=80&auto=format&fit=crop', // Pizza
    'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=1000&q=80&auto=format&fit=crop', // Fried Chicken
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1000&q=80&auto=format&fit=crop', // Pasta
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=80&auto=format&fit=crop', // Steak / Ribs
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&q=80&auto=format&fit=crop', // Skewers
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000&q=80&auto=format&fit=crop', // Pizza 2
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1000&q=80&auto=format&fit=crop'  // Dessert
  ];

  const photos = userPhotos.length >= 4 ? userPhotos : [...userPhotos, ...defaultPhotos];

  // Header / Hero Background Image
  const headerBgImage = content.headerBgImage || content.heroBgImage || content.heroImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop';
  const heroMainPhoto = content.heroImage || photos[0];

  // Editable text & translations
  const heroBadge = content.tagline || content.heroBadge || (isEn ? 'PREMIUM DINING EXPERIENCE' : 'GASTRONOMIE & RESTAURATION LUXE');
  const heroTitle = content.heroTitle || (isEn 
    ? 'Delicious Food Delivered Fresh' 
    : 'Restauration Gastronomique & Saveurs d\'Exception');
  const heroSubtitle = content.heroSubtitle || (isEn 
    ? 'Experience the perfect blend of luxury dining and modern fast food. Crafted with passion, served with excellence.' 
    : 'Savourez l\'alliance parfaite entre haute gastronomie et restauration rapide moderne. Préparé avec passion, servi avec excellence.');

  const orderBtnText = content.ctaButton || (isEn ? 'Order Now' : 'Commander');
  const viewMenuBtnText = content.ctaButtonSecondary || (isEn ? 'View Menu' : 'Voir la Carte');

  const navHome = isEn ? 'Home' : 'Accueil';
  const navMenu = isEn ? 'Menu' : 'La Carte';
  const navOffers = isEn ? 'Offers' : 'Offres';
  const navAbout = isEn ? 'About' : 'À propos';
  const navGallery = isEn ? 'Gallery' : 'Galerie';
  const navContact = isEn ? 'Contact' : 'Contact';
  const navBook = isEn ? 'Book a Table' : 'Réserver une Table';

  // Menu Items (Dynamic or Fallback)
  const menuItems = (content.menuItems || content.services || []).length > 0 ? content.menuItems || content.services : [
    {
      category: isEn ? 'BURGER' : 'BURGER',
      title: isEn ? 'Truffle Wagyu Burger' : 'Burger Wagyu à la Truffe',
      description: isEn ? 'Premium wagyu beef, black truffle aioli, aged cheddar.' : 'Bœuf Wagyu d\'exception, aioli à la truffe noire, cheddar affiné.',
      price: '$19.99',
      image: photos[0]
    },
    {
      category: isEn ? 'PIZZA' : 'PIZZA',
      title: isEn ? 'Burrata Margherita' : 'Pizza Burrata Margherita',
      description: isEn ? 'San Marzano tomatoes, fresh burrata, basil oil pizza.' : 'Tomates San Marzano, burrata fraîche et huile de basilic.',
      price: '$22.50',
      image: photos[1]
    },
    {
      category: isEn ? 'FAST FOOD' : 'GASTRONOMIE',
      title: isEn ? 'Spicy Korean Chicken' : 'Poulet Croustillant Épicé',
      description: isEn ? 'Double-fried crispy chicken with gochujang glaze.' : 'Poulet croustillant double cuisson, glaçage doux et épicé.',
      price: '$14.99',
      image: photos[2]
    },
    {
      category: isEn ? 'PASTA' : 'PÂTES',
      title: isEn ? 'Lobster Carbonara' : 'Carbonara au Homard',
      description: isEn ? 'Fresh linguine, butter-poached lobster, pancetta.' : 'Linguine fraîches, homard poché au beurre et pancetta.',
      price: '$28.00',
      image: photos[3]
    }
  ];

  // Special Offers (Dynamic or Fallback)
  const specialOffers = (content.specialOffers || content.offers || []).length > 0 ? content.specialOffers || content.offers : [
    {
      badge: isEn ? 'FAMILY DEAL' : 'MENU FAMILLE',
      title: isEn ? 'Weekend Pizza Feast' : 'Feast Pizza du Weekend',
      description: isEn ? '2 Large Pizzas + 4 Drinks + Garlic Bread' : '2 Grandes Pizzas au choix + 4 Boissons + Pain à l\'Ail',
      price: '$39.99',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80'
    },
    {
      badge: isEn ? 'BEST SELLER' : 'INCONTOURNABLE',
      title: isEn ? 'The Ultimate Combo' : 'Le Combo Ultime LuxBite',
      description: isEn ? 'Double Wagyu Burger + Truffle Fries + Milkshake' : 'Double Burger Wagyu + Frites à la Truffe + Milkshake',
      price: '$24.50',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80'
    }
  ];

  // Story section
  const aboutTitle = content.aboutTitle || (isEn ? 'Where Luxury Meets Fast Food Passion' : 'Où le Luxe Rencontre la Passion Culinaire');
  const aboutText = content.aboutText || content.aboutDescription || (isEn 
    ? 'Founded in 2010, LuxBite was born from a simple idea: why should fast food be ordinary? We have combined the speed and convenience of modern dining with the premium ingredients and craftsmanship of luxury restaurants.' 
    : 'Fondé en 2010, notre établissement est né d\'une idée simple : pourquoi la restauration rapide devrait-elle être ordinaire ? Nous associons la rapidité du service à la qualité d\'ingrédients nobles sélectionnés chez nos producteurs locaux.');

  // Testimonials
  const testimonials = (content.testimonials || content.reviews || []).length > 0 ? content.testimonials || content.reviews : [
    {
      quote: isEn ? '“The best burger I have ever had! The truffle aioli is a game changer.”' : '« Le meilleur burger que j\'ai mangé ! L\'aioli à la truffe est absolument incroyable. »',
      name: 'Sarah Johnson',
      role: isEn ? 'Food Critic' : 'Critique Gastronomique',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
    },
    {
      quote: isEn ? '“Luxury dining at fast food speed. The Burrata Pizza is a must-try.”' : '« Une cuisine raffinée avec un service ultra rapide. La Pizza Burrata est divine. »',
      name: 'Michaël Laurent',
      role: isEn ? 'Regular Guest' : 'Client Fidèle',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
    },
    {
      quote: isEn ? '“Incredible service and even better food. The ambiance is just perfect.”' : '« Service irréprochable et mets délicieux. Une ambiance dînatoire exceptionnelle. »',
      name: 'Émilie Davis',
      role: isEn ? 'Local Guide' : 'Guide Culinaire',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
    }
  ];

  return `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'fr'}" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} | ${isEn ? 'Premium Dining & Fast Food Experience' : 'Restaurant Gastronomique & Fast-Food de Luxe'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #08090B; color: #F8FAFC; }
    h1, h2, h3, .font-serif-title { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="bg-[#08090B] text-slate-100 antialiased selection:bg-[#E52E42] selection:text-white">

  <!-- HEADER NAVBAR -->
  <header class="sticky top-0 z-50 bg-[#08090B]/90 backdrop-blur-md border-b border-zinc-900/60">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-1">
        <a href="#" class="flex flex-col">
          <span class="text-2xl font-serif-title text-white font-extrabold tracking-tight">${companyName}</span>
          <span class="text-[10px] text-[#E52E42] font-bold tracking-widest uppercase -mt-1">${isEn ? 'Restaurant' : 'Restaurant Gastronomique'}</span>
        </a>
      </div>

      <nav class="hidden lg:flex items-center gap-8 text-xs font-semibold text-zinc-300">
        <a href="#" class="text-[#D9A752] font-bold">${navHome}</a>
        <a href="#menu" class="hover:text-[#D9A752] transition">${navMenu}</a>
        <a href="#offers" class="hover:text-[#D9A752] transition">${navOffers}</a>
        <a href="#about" class="hover:text-[#D9A752] transition">${navAbout}</a>
        <a href="#gallery" class="hover:text-[#D9A752] transition">${navGallery}</a>
        <a href="#contact" class="hover:text-[#D9A752] transition">${navContact}</a>
      </nav>

      <div class="flex items-center gap-4">
        <button onclick="alert('${isEn ? 'Your cart is currently empty' : 'Votre panier est actuellement vide'}')" class="w-10 h-10 rounded-full bg-[#16171B] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition relative">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span class="absolute -top-1 -right-1 bg-[#E52E42] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
        </button>
        <a href="#booking" class="px-6 py-2.5 rounded-full bg-[#D9A752] hover:bg-[#c59441] text-slate-950 font-bold text-xs transition shadow-md shadow-[#D9A752]/20">
          ${navBook}
        </a>
      </div>
    </div>
  </header>

  <!-- HERO SECTION WITH BACKGROUND IMAGE OVERLAY -->
  <section class="relative overflow-hidden py-20 sm:py-28 border-b border-zinc-900/80">
    <!-- Header Background Image -->
    <div class="absolute inset-0 z-0">
      <img src="${headerBgImage}" alt="Header Background" class="w-full h-full object-cover opacity-25">
      <div class="absolute inset-0 bg-gradient-to-r from-[#08090B] via-[#08090B]/90 to-[#08090B]/60"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#08090B] via-transparent to-[#08090B]/80"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-6 space-y-8">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16171B]/90 border border-zinc-800/80 backdrop-blur-sm">
          <span class="text-[11px] font-bold text-[#D9A752] uppercase tracking-wider">${heroBadge}</span>
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-serif-title text-white font-bold tracking-tight leading-[1.08]">
          ${heroTitle}
        </h1>

        <p class="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-lg font-light">
          ${heroSubtitle}
        </p>

        <div class="flex flex-wrap items-center gap-4 pt-2">
          <a href="#menu" class="px-8 py-3.5 rounded-full bg-[#E52E42] hover:bg-[#d02538] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-red-600/25">
            ${orderBtnText} <span>→</span>
          </a>
          <a href="#menu" class="px-7 py-3.5 rounded-full bg-[#1A1C20]/90 hover:bg-[#25282e] border border-zinc-800 text-white font-semibold text-xs transition flex items-center gap-2 backdrop-blur-sm">
            <span>▶</span> ${viewMenuBtnText}
          </a>
        </div>

        <!-- Rating Reviews -->
        <div class="flex items-center gap-4 pt-4 border-t border-zinc-800/80">
          <div class="flex -space-x-2">
            <img class="inline-block h-8 w-8 rounded-full ring-2 ring-[#08090B] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Avatar">
            <img class="inline-block h-8 w-8 rounded-full ring-2 ring-[#08090B] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Avatar">
            <img class="inline-block h-8 w-8 rounded-full ring-2 ring-[#08090B] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Avatar">
          </div>
          <div class="flex flex-col text-xs">
            <span class="text-amber-400">★★★★★</span>
            <span class="text-[10px] text-zinc-400 font-medium">${isEn ? 'Over 1,200+ 5-Star Reviews' : 'Plus de 1 200+ Avis 5 Étoiles'}</span>
          </div>
        </div>
      </div>

      <!-- Hero Main Image Stack -->
      <div class="lg:col-span-6 relative">
        <div class="bg-gradient-to-tr from-[#16171B] to-[#1F2128] rounded-[36px] p-4 sm:p-6 relative border border-zinc-800/60 shadow-2xl">
          <!-- Floating Special Offer Badge -->
          <div class="absolute -top-4 -right-4 bg-[#D9A752] text-slate-950 p-4 rounded-2xl shadow-xl z-20 text-center">
            <span class="block text-[10px] font-extrabold uppercase tracking-widest">${isEn ? 'SPECIAL OFFER' : 'OFFRE EXCLUSIVE'}</span>
            <span class="text-2xl font-serif-title font-black">${content.heroDiscountTag || '-50%'}</span>
          </div>

          <img src="${heroMainPhoto}" alt="Gourmet Speciality" class="rounded-2xl object-cover w-full h-[380px] sm:h-[460px] transform hover:scale-[1.01] transition duration-500 shadow-xl">

          <!-- Floating Fast Delivery Badge -->
          <div class="absolute bottom-8 left-8 bg-[#141518]/90 backdrop-blur-md p-3.5 px-5 rounded-2xl border border-zinc-700/60 flex items-center gap-3.5 shadow-2xl z-20">
            <div class="w-10 h-10 rounded-xl bg-[#E52E42]/20 text-[#E52E42] flex items-center justify-center font-bold text-lg">
              🔥
            </div>
            <div>
              <h4 class="text-xs font-bold text-white">${isEn ? 'Fast Delivery' : 'Livraison Express'}</h4>
              <p class="text-[11px] text-zinc-400">${isEn ? 'Under 30 mins' : 'Moins de 30 minutes'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3 FEATURE HIGHLIGHTS -->
  <section class="py-12 border-b border-zinc-900/80 bg-[#0B0C0F]">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="flex flex-col items-center text-center space-y-3">
        <div class="w-14 h-14 rounded-full bg-[#E52E42]/15 text-[#E52E42] flex items-center justify-center text-xl shadow-inner">
          🚀
        </div>
        <h3 class="text-base font-serif-title font-bold text-white">${isEn ? 'Fast Delivery' : 'Livraison Rapide'}</h3>
        <p class="text-xs text-zinc-400 max-w-xs">${isEn ? "We guarantee delivery within 30 minutes or it's on us." : "Livraison rapide garantie directement à votre domicile."}</p>
      </div>

      <div class="flex flex-col items-center text-center space-y-3">
        <div class="w-14 h-14 rounded-full bg-[#D9A752]/15 text-[#D9A752] flex items-center justify-center text-xl shadow-inner">
          📦
        </div>
        <h3 class="text-base font-serif-title font-bold text-white">${isEn ? 'Safe & Fresh' : 'Frais & Isotherme'}</h3>
        <p class="text-xs text-zinc-400 max-w-xs">${isEn ? "Sealed packaging and thermal bags to keep your food hot." : "Emballage hermétique pour conserver la fraîcheur des plats."}</p>
      </div>

      <div class="flex flex-col items-center text-center space-y-3">
        <div class="w-14 h-14 rounded-full bg-amber-600/15 text-amber-500 flex items-center justify-center text-xl shadow-inner">
          📍
        </div>
        <h3 class="text-base font-serif-title font-bold text-white">${isEn ? 'Live Tracking' : 'Suivi en Temps Réel'}</h3>
        <p class="text-xs text-zinc-400 max-w-xs">${isEn ? "Track your order in real-time from our kitchen to your door." : "Suivez l'avancement de votre commande en direct."}</p>
      </div>
    </div>
  </section>

  <!-- SECTION 2: MENU -->
  <section id="menu" class="py-24 max-w-7xl mx-auto px-6">
    <div class="text-center space-y-3 mb-12">
      <span class="text-xs font-bold text-[#D9A752] uppercase tracking-widest block">${isEn ? 'OUR SIGNATURE SELECTION' : 'NOTRE SÉLECTION GASTRONOMIQUE'}</span>
      <h2 class="text-4xl sm:text-5xl font-serif-title text-white">${isEn ? 'Explore Our' : 'Découvrez Notre'} <span class="italic text-[#D9A752]">${isEn ? 'Menu' : 'Carte Exquise'}</span></h2>
    </div>

    <!-- Category Tabs -->
    <div class="flex flex-wrap justify-center gap-3 mb-12">
      <button class="px-6 py-2.5 rounded-full bg-[#16171B] border border-zinc-800 text-white font-semibold text-xs flex items-center gap-2 hover:border-[#D9A752] transition">
        <span>🍕</span> Pizza
      </button>
      <button class="px-6 py-2.5 rounded-full bg-[#1C1D22] border border-[#D9A752]/50 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-[#D9A752]/10">
        <span>🍔</span> Burgers
      </button>
      <button class="px-6 py-2.5 rounded-full bg-[#16171B] border border-zinc-800 text-white font-semibold text-xs flex items-center gap-2 hover:border-[#D9A752] transition">
        <span>🍝</span> Pasta
      </button>
      <button class="px-6 py-2.5 rounded-full bg-[#16171B] border border-zinc-800 text-white font-semibold text-xs flex items-center gap-2 hover:border-[#D9A752] transition">
        <span>🥂</span> ${isEn ? 'Drinks' : 'Boissons'}
      </button>
    </div>

    <!-- Menu Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${menuItems.slice(0, 8).map((item, idx) => `
        <div class="bg-[#121316] border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 transition group flex flex-col justify-between">
          <div class="relative h-52 overflow-hidden">
            <img src="${item.image || photos[idx % photos.length]}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          </div>
          <div class="p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-bold text-[#D9A752] tracking-wider uppercase block mb-1">${item.category || 'MENU'}</span>
              <h3 class="text-lg font-serif-title font-bold text-white">${item.title}</h3>
              <p class="text-xs text-zinc-400 mt-1 line-clamp-2">${item.description}</p>
            </div>
            <div class="flex items-center justify-between pt-3 border-t border-zinc-800/60">
              <span class="text-xl font-bold text-white">${item.price || '$18.00'}</span>
              <button onclick="alert('${isEn ? 'Added ' + item.title + ' to cart!' : 'Ajouté ' + item.title + ' au panier !'}')" class="w-9 h-9 rounded-full bg-[#E52E42] hover:bg-[#c92235] text-white flex items-center justify-center font-bold text-lg transition shadow-md shadow-red-600/30">
                +
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="text-center mt-12">
      <button onclick="alert('${isEn ? 'Displaying full menu selection' : 'Affichage de la carte complète'}')" class="px-8 py-3.5 rounded-full bg-[#1C1D22] hover:bg-[#282a30] border border-zinc-800 text-white font-semibold text-xs transition">
        ${isEn ? 'View Full Menu' : 'Voir Toute la Carte'}
      </button>
    </div>
  </section>

  <!-- SECTION 3: SPECIAL OFFERS + OUR STORY -->
  <section id="offers" class="py-20 bg-[#0A0B0E] border-t border-zinc-900/80">
    <div class="max-w-7xl mx-auto px-6 space-y-24">
      
      <!-- Special Offers -->
      <div>
        <div class="text-center space-y-2 mb-12">
          <span class="text-xs font-bold text-[#D9A752] uppercase tracking-widest block">${isEn ? 'LIMITED TIME' : 'DURÉE LIMITÉE'}</span>
          <h2 class="text-4xl sm:text-5xl font-serif-title text-white">${isEn ? 'Special' : 'Offres'} <span class="italic text-[#D9A752]">${isEn ? 'Offers' : 'Exclusives'}</span></h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${specialOffers.slice(0, 2).map((offer) => `
            <div class="relative rounded-3xl overflow-hidden border border-zinc-800/80 h-72 flex items-end p-8 group">
              <img src="${offer.image || photos[0]}" alt="${offer.title}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              
              <div class="relative z-10 space-y-2 w-full">
                <span class="inline-block px-3 py-1 rounded-md bg-[#D9A752]/90 text-slate-950 font-bold text-[10px] uppercase">${offer.badge || 'PROMO'}</span>
                <h3 class="text-2xl font-serif-title font-bold text-white">${offer.title}</h3>
                <p class="text-xs text-zinc-300">${offer.description}</p>
                <div class="flex items-center justify-between pt-2">
                  <span class="text-2xl font-bold text-white">${offer.price || '$29.99'}</span>
                  <button onclick="alert('${isEn ? 'Ordered ' + offer.title + '!' : 'Commande enregistrée pour ' + offer.title + ' !'}')" class="px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-slate-950 font-bold text-xs uppercase transition shadow-lg">
                    ${isEn ? 'Order Now' : 'Commander'}
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Our Story -->
      <div id="about" class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
        <!-- Left Media Mosaic -->
        <div class="lg:col-span-6 grid grid-cols-2 gap-4">
          <div class="rounded-2xl overflow-hidden h-48 sm:h-56">
            <img src="${photos[4] || photos[0]}" alt="Kitchen" class="w-full h-full object-cover">
          </div>
          <div class="bg-[#E52E42] text-white rounded-2xl p-6 flex flex-col justify-between">
            <span class="text-3xl">🏅</span>
            <div>
              <h4 class="text-lg font-serif-title font-bold leading-tight">${isEn ? 'Best Luxury Fast Food 2024' : 'Meilleure Table Fast-Food 2024'}</h4>
            </div>
          </div>
          <div class="bg-[#D9A752] text-slate-950 rounded-2xl p-6 flex flex-col justify-between">
            <span class="text-4xl font-serif-title font-black">15+</span>
            <p class="text-sm font-bold leading-tight">${isEn ? 'Years of Excellence' : 'Ans d\'Excellence Culinaire'}</p>
          </div>
          <div class="rounded-2xl overflow-hidden h-48 sm:h-56">
            <img src="${photos[5] || photos[1]}" alt="Ambiance" class="w-full h-full object-cover">
          </div>
        </div>

        <!-- Right Text Content -->
        <div class="lg:col-span-6 space-y-6">
          <span class="text-xs font-bold text-[#D9A752] uppercase tracking-widest block">${isEn ? 'OUR STORY' : 'NOTRE HISTOIRE'}</span>
          <h2 class="text-3xl sm:text-5xl font-serif-title text-white leading-tight">
            ${aboutTitle}
          </h2>
          <p class="text-zinc-400 text-sm leading-relaxed font-light">
            ${aboutText}
          </p>

          <div class="grid grid-cols-2 gap-4 pt-2">
            <div class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-[#D9A752]">✓</span>
              <div>
                <h4 class="text-xs font-bold text-white">${isEn ? 'Fresh Ingredients' : 'Ingrédients Frais'}</h4>
                <p class="text-[11px] text-zinc-500">${isEn ? 'Sourced daily from local farms' : 'Approvisionnement quotidien'}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-[#D9A752]">⏱</span>
              <div>
                <h4 class="text-xs font-bold text-white">${isEn ? 'Fast Delivery' : 'Livraison Rapide'}</h4>
                <p class="text-[11px] text-zinc-500">${isEn ? 'Hot food in 30 mins' : 'Chaud chez vous en 30 min'}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-[#D9A752]">🎖</span>
              <div>
                <h4 class="text-xs font-bold text-white">${isEn ? 'Expert Chefs' : 'Chefs Étoilés'}</h4>
                <p class="text-[11px] text-zinc-500">${isEn ? 'Crafted by top talent' : 'Savoir-faire d\'exception'}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-[#D9A752]">❤️</span>
              <div>
                <h4 class="text-xs font-bold text-white">${isEn ? 'Made with Love' : 'Fait avec Passion'}</h4>
                <p class="text-[11px] text-zinc-500">${isEn ? 'Every dish is a masterpiece' : 'Chaque plat est unique'}</p>
              </div>
            </div>
          </div>

          <div class="pt-4">
            <a href="#about" class="inline-block px-8 py-3.5 rounded-full bg-[#D9A752] hover:bg-[#c59441] text-slate-950 font-bold text-xs uppercase tracking-wider transition">
              ${isEn ? 'Learn More About Us' : 'En Savoir Plus'}
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- SECTION 4: GALLERY + TESTIMONIALS -->
  <section id="gallery" class="py-24 max-w-7xl mx-auto px-6 space-y-24">
    
    <!-- Gallery -->
    <div>
      <div class="text-center space-y-2 mb-12">
        <span class="text-xs font-bold text-[#D9A752] uppercase tracking-widest block">${isEn ? 'VISUAL FEAST' : 'DÉLICES EN IMAGES'}</span>
        <h2 class="text-4xl sm:text-5xl font-serif-title text-white">${isEn ? 'Our' : 'Notre'} <span class="italic text-[#D9A752]">${isEn ? 'Gallery' : 'Galerie Photos'}</span></h2>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        ${photos.slice(0, 8).map((p, idx) => `
          <div class="rounded-2xl overflow-hidden h-44 sm:h-52 group relative">
            <img src="${p}" alt="Gallery Dish ${idx + 1}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Testimonials -->
    <div>
      <div class="text-center space-y-2 mb-12">
        <span class="text-xs font-bold text-[#D9A752] uppercase tracking-widest block">${isEn ? 'GUEST REVIEWS' : 'AVIS & TÉMOIGNAGES'}</span>
        <h2 class="text-4xl sm:text-5xl font-serif-title text-white">${isEn ? 'What Our' : 'Ce Que Disent'} <span class="italic text-[#D9A752]">${isEn ? 'Guests Say' : 'Nos Clients'}</span></h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${testimonials.slice(0, 3).map((item) => `
          <div class="bg-[#121316] border border-zinc-800/80 rounded-2xl p-6 space-y-4">
            <div class="text-amber-400 text-xs">★★★★★</div>
            <p class="text-xs text-zinc-300 leading-relaxed font-light">
              ${item.quote || item.text}
            </p>
            <div class="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
              <img src="${item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}" alt="${item.name}" class="w-9 h-9 rounded-full object-cover">
              <div>
                <h4 class="text-xs font-bold text-white">${item.name}</h4>
                <p class="text-[10px] text-zinc-500">${item.role || item.city || 'Gourmet'}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

  </section>

  <!-- SECTION 5: RESERVATION & FOOTER -->
  <section id="booking" class="py-20 max-w-7xl mx-auto px-6">
    <div class="bg-[#121316] border border-zinc-800/80 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      
      <!-- Form Left -->
      <div class="lg:col-span-6 space-y-6">
        <div>
          <span class="text-xs font-bold text-[#D9A752] uppercase tracking-widest block">${isEn ? 'BOOK A TABLE' : 'RÉSERVATION'}</span>
          <h2 class="text-4xl font-serif-title text-white mt-1">${isEn ? 'Reserve Your' : 'Réservez Votre'} <span class="italic text-[#D9A752]">${isEn ? 'Experience' : 'Table'}</span></h2>
        </div>

        <form onsubmit="event.preventDefault(); alert('${isEn ? 'Your reservation request has been confirmed!' : 'Votre demande de réservation a bien été enregistrée !'}');" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] text-zinc-400 mb-1">${isEn ? 'Full Name' : 'Nom Complet'}</label>
              <input type="text" placeholder="${isEn ? 'John Doe' : 'Jean Dupont'}" required class="w-full bg-[#18191E] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D9A752]">
            </div>
            <div>
              <label class="block text-[11px] text-zinc-400 mb-1">${isEn ? 'Email Address' : 'Adresse Email'}</label>
              <input type="email" placeholder="jean@example.com" required class="w-full bg-[#18191E] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D9A752]">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-[11px] text-zinc-400 mb-1">Date</label>
              <input type="date" required class="w-full bg-[#18191E] border border-zinc-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#D9A752]">
            </div>
            <div>
              <label class="block text-[11px] text-zinc-400 mb-1">${isEn ? 'Time' : 'Heure'}</label>
              <input type="time" required class="w-full bg-[#18191E] border border-zinc-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#D9A752]">
            </div>
            <div>
              <label class="block text-[11px] text-zinc-400 mb-1">${isEn ? 'Guests' : 'Couverts'}</label>
              <select class="w-full bg-[#18191E] border border-zinc-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#D9A752]">
                <option>${isEn ? '2 Guests' : '2 Personnes'}</option>
                <option>${isEn ? '4 Guests' : '4 Personnes'}</option>
                <option>${isEn ? '6+ Guests' : '6+ Personnes'}</option>
              </select>
            </div>
          </div>

          <button type="submit" class="w-full py-3.5 rounded-xl bg-[#D9A752] hover:bg-[#c59441] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-[#D9A752]/20">
            ${isEn ? 'Confirm Reservation' : 'Confirmer Ma Réservation'} <span>↗</span>
          </button>
        </form>
      </div>

      <!-- Image Right -->
      <div class="lg:col-span-6 relative rounded-2xl overflow-hidden h-[380px] group">
        <img src="${photos[6] || photos[0]}" alt="Restaurant Interior" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        <div class="absolute bottom-6 left-6 right-6 bg-[#16171B]/90 backdrop-blur-md p-4 rounded-xl border border-zinc-700/50 flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Sarah" class="w-10 h-10 rounded-full object-cover">
          <div>
            <p class="text-[11px] text-zinc-200 italic font-light">${testimonials[0]?.quote || '“Des plats raffinés préparés avec brio.”'}</p>
            <h5 class="text-[10px] font-bold text-[#D9A752] mt-0.5">${testimonials[0]?.name || 'Sarah Johnson'}</h5>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- FOOTER -->
  <footer id="contact" class="bg-[#050507] border-t border-zinc-900 pt-16 pb-12 text-zinc-400">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
      
      <!-- Col 1 -->
      <div class="space-y-4">
        <div>
          <span class="text-2xl font-serif-title text-white font-extrabold tracking-tight">${companyName}</span>
          <span class="text-[10px] text-[#E52E42] font-bold tracking-widest uppercase block -mt-1">${isEn ? 'Restaurant' : 'Gastronomie & Fast-Food'}</span>
        </div>
        <p class="text-xs text-zinc-500 leading-relaxed">
          ${isEn ? 'Redefining the dining experience with a perfect blend of luxury and speed. Quality ingredients, exceptional service.' : 'L\'excellence culinaire alliée à la rapidité d\'un service contemporain. Ingrédients nobles et recettes raffinées.'}
        </p>
        <div class="flex items-center gap-3 pt-2">
          <a href="#" class="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-400 hover:text-white hover:bg-[#E52E42] transition">f</a>
          <a href="#" class="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-400 hover:text-white hover:bg-[#E52E42] transition">ig</a>
          <a href="#" class="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-400 hover:text-white hover:bg-[#E52E42] transition">tw</a>
        </div>
      </div>

      <!-- Col 2 -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-white uppercase tracking-wider">${isEn ? 'Opening Hours' : 'Horaires d\'Ouverture'}</h4>
        <ul class="space-y-2 text-xs text-zinc-500">
          <li><span class="block font-semibold text-zinc-300">${isEn ? 'Monday – Friday' : 'Lundi – Vendredi'}</span> 10:00 – 22:00</li>
          <li><span class="block font-semibold text-zinc-300">${isEn ? 'Saturday' : 'Samedi'}</span> 11:00 – 23:00</li>
          <li><span class="block font-semibold text-zinc-300">${isEn ? 'Sunday' : 'Dimanche'}</span> 11:00 – 21:00</li>
        </ul>
      </div>

      <!-- Col 3 -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-white uppercase tracking-wider">${isEn ? 'Contact Us' : 'Contactez-Nous'}</h4>
        <ul class="space-y-2 text-xs text-zinc-500">
          <li class="flex items-start gap-2">📍 <span>${address}</span></li>
          <li class="flex items-center gap-2">📞 <span>${phone}</span></li>
          <li class="flex items-center gap-2">✉️ <span>${email}</span></li>
        </ul>
      </div>

      <!-- Col 4 -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-white uppercase tracking-wider">Newsletter</h4>
        <p class="text-xs text-zinc-500">${isEn ? 'Subscribe to get special offers and menu updates.' : 'Inscrivez-vous pour recevoir nos offres exclusives.'}</p>
        <form onsubmit="event.preventDefault(); alert('${isEn ? 'Subscribed to newsletter!' : 'Inscription à la newsletter enregistrée !'}');" class="space-y-2">
          <input type="email" placeholder="${isEn ? 'Your Email Address' : 'Votre adresse email'}" required class="w-full bg-[#121316] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E52E42]">
          <button type="submit" class="w-full py-2.5 rounded-xl bg-[#E52E42] hover:bg-[#d02538] text-white font-bold text-xs uppercase tracking-wider transition">
            ${isEn ? 'Subscribe Now' : 'S\'abonner'}
          </button>
        </form>
      </div>

    </div>

    <div class="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-900/80 text-center text-[11px] text-zinc-600">
      <p>© ${new Date().getFullYear()} ${companyName}. ${isEn ? 'All rights reserved.' : 'Tous droits réservés.'}</p>
    </div>
  </footer>

</body>
</html>`;
}
