// Leon Taste-Skill Premium Layout Templates
// Anti-slop, non-generic frontend designs implementing strict mathematical grids, premium typography, and clean aesthetic balances.

import { detectLanguage } from '../siteTemplate.js';

export const TASTE_TEMPLATES_META = [
  {
    id: 'taste-minimal',
    name: 'Leon Taste Minimalist (Anti-Slop, Strict-Grid)',
    description: 'Off-white linen canvas, extreme asymmetric spacing, strict serif headers, and fine-line border divisions. Zero AI-slop gradients.',
    previewColor: '#18181B',
    bgPreview: '#F9F9FB',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop'
  },
  {
    id: 'taste-editorial',
    name: 'Leon Taste Editorial (Journal, Broadssheet Modern)',
    description: 'Warm cream bookish paper, classic serif headlines with small tracked-out labels, high density, and custom interactive panels.',
    previewColor: '#78350F',
    bgPreview: '#FAF8F5',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80&auto=format&fit=crop'
  }
];

// Helper to sanitize brand names for slug creation
function getSlug(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * 1. Leon Taste Minimalist Template
 */
export function buildTasteMinimalTemplate(lead, content, lang = 'fr') {
  const companyName = content.brandName || lead.name || lead.companyName || lead.company || lead.businessName || 'Elite Services';
  const phone = content.contactPhone || lead.phone || '01 89 00 12 34';
  const email = content.contactEmail || lead.email || `contact@${getSlug(companyName)}.com`;
  const city = content.city || lead.city || 'votre ville';
  const address = content.contactAddress || lead.address || '';
  const isEn = lang === 'en';
  
  const primaryColor = content.primaryColor || '#18181B';
  const tagline = content.tagline || (isEn ? 'Bespoke Services' : 'Prestation d\'Exception');
  const ribbonText = content.ribbonText || (isEn ? 'CERTIFIED EXPERT SERVICES' : 'SAVOIR-FAIRE ARTISANAL CERTIFIÉ');
  
  const heroTitle = content.heroTitle || (isEn ? `Precision Craftsmanship & Premium Quality in ${city}` : `Artisanat de Précision & Rénovation Haute Qualité à ${city}`);
  const heroSubtitle = content.heroSubtitle || (isEn ? 'Delivering high-end results with absolute transparency, strict mathematical precision, and certified materials.' : 'Des finitions impeccables réalisées avec rigueur, une transparence tarifaire absolue et des matériaux éco-responsables de premier choix.');
  
  const photos = content.uploadedImages?.length ? content.uploadedImages : (content.photos?.length ? content.photos : [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80&auto=format&fit=crop'
  ]);

  const defaultServices = [
    { title: isEn ? 'Premium General Contracting' : 'Maîtrise d’Œuvre Complète', description: isEn ? 'Complete supervision from structural planning to bespoke final aesthetics.' : 'Gestion complète de votre projet, de l\'étude de faisabilité à la livraison des finitions.', price: isEn ? 'Custom Quote' : 'Sur Devis' },
    { title: isEn ? 'Bespoke Architectural Renovation' : 'Rénovation Architecturale', description: isEn ? 'High-end interior transformations respecting heritage and structural integrity.' : 'Aménagements intérieurs haut de gamme respectant le caractère et l\'architecture de votre bâti.', price: isEn ? 'From $1,200' : 'Dès 1200€' },
    { title: isEn ? 'Precision Cabinetry & Fittings' : 'Menuiserie & Agencement Intérieur', description: isEn ? 'Custom millwork designed and installed with flawless micro-millimeter tolerances.' : 'Création de pièces sur mesure et d\'agencements intégrés avec une tolérance au millimètre.', price: isEn ? 'Fixed Pricing' : 'Tarifs Fermes' }
  ];
  const services = content.services?.length ? content.services : defaultServices;

  const defaultWhyUs = [
    { title: isEn ? 'Zero-tolerance execution' : 'Rigueur millimétrique', text: isEn ? 'Every measurement, cut, and join is verified multiple times for absolute flawless alignment.' : 'Chaque prise de mesure et chaque assemblage sont contrôlés pour garantir un alignement parfait.' },
    { title: isEn ? 'Fixed timeline penalty guarantee' : 'Délais stricts contractuels', text: isEn ? 'We commit to strict deadlines with contractual penalties if your project runs even a day late.' : 'Nous nous engageons par écrit sur un calendrier clair, avec des indemnités contractuelles en cas de retard.' },
    { title: isEn ? 'Direct craftsman line' : 'Communication directe artisan', text: isEn ? 'Direct access to your head project craftsman at any hour, bypassing administrative bureaucracy.' : 'Ligne directe avec le chef de chantier référent, sans intermédiaires ni secrétariat inutile.' }
  ];
  const whyUs = content.whyUs?.length ? content.whyUs : defaultWhyUs;

  const testimonials = content.testimonials?.length ? content.testimonials : [
    { name: 'Sébastien Morel', text: isEn ? 'A flawless project from start to finish. The team is punctual, extremely respectful of the property, and the detailing is perfect.' : 'Un chantier exemplaire de bout en bout. L\'équipe est ponctuelle, extrêmement respectueuse des lieux, et le soin du détail frôle la perfection.', rating: 5, city: city },
    { name: 'Valérie Chardin', text: isEn ? 'Excellent communication and stict timeline tracking. Their fixed quote was respected to the last cent.' : 'Excellente communication et suivi rigoureux du planning. Le devis ferme a été respecté au centime près, sans aucun avenant surprise.', rating: 5, city: city }
  ];

  const faq = content.faq?.length ? content.faq : [
    { question: isEn ? 'Are your quotes guaranteed and binding?' : 'Vos devis sont-ils fermes et définitifs ?', answer: isEn ? 'Yes. Once signed, our detailed quotes are legally binding and guaranteed. No additional costs will ever be added unless you request changes.' : 'Oui. Une fois signé, notre devis détaillé fait foi de contrat d’engagement de prix. Aucun supplément ne vous sera facturé sans un avenant écrit validé par vos soins.' },
    { question: isEn ? 'How do you handle site clean-up?' : 'Comment gérez-vous la propreté du chantier ?', answer: isEn ? 'We implement strict site clean-up protocols, clearing debris daily and vacuuming all workspaces to leave your property immaculate.' : 'Nous appliquons une charte de chantier propre rigoureuse. Les déchets sont triés et évacués quotidiennement, et un nettoyage d\'aspiration complet est réalisé chaque fin de journée.' }
  ];

  const statLabels = content.statLabels?.length ? content.statLabels : [
    { value: '100%', label: isEn ? 'Fixed Quotes Guaranteed' : 'Devis Contractuels Fermes' },
    { value: '0', label: isEn ? 'Unpredicted Surprises' : 'Aucun Avenant Masqué' },
    { value: '12+', label: isEn ? 'Years Active in Region' : 'Années de Métier Local' },
    { value: '250+', label: isEn ? 'Premium Projects Finished' : 'Chantiers d\'Exception Terminés' }
  ];

  return `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} — ${tagline} ${city}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #FAF9F6;
      color: #1A1A1E;
    }
    .font-serif-luxury {
      font-family: 'Instrument Serif', Georgia, serif;
    }
    .grid-fine-line {
      background-image: linear-gradient(to right, #EBE7DF 1px, transparent 1px),
                        linear-gradient(to bottom, #EBE7DF 1px, transparent 1px);
      background-size: 40px 40px;
    }
  </style>
</head>
<body class="bg-[#FAF9F6] text-[#1A1A1E] antialiased">

  <!-- Micro Header Banner -->
  <div class="border-b border-[#E1DDD5] px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider flex justify-between items-center bg-[#FAF9F6] relative z-20">
    <div class="flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
      <span>${ribbonText} — ${city}</span>
    </div>
    <div class="flex items-center gap-6">
      <a href="tel:${phone}" class="hover:underline transition">📞 ${phone}</a>
      <a href="#contact" class="hover:underline transition">${isEn ? 'Request Instant Devis' : 'Obtenir un Devis Ferme'}</a>
    </div>
  </div>

  <!-- Header Navigation -->
  <header class="border-b border-[#E1DDD5] sticky top-0 bg-[#FAF9F6]/90 backdrop-blur-md z-50">
    <div class="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
      <a href="#" class="text-xl font-extrabold tracking-tight font-serif-luxury text-[28px] uppercase">
        ${companyName}
      </a>
      <nav class="hidden md:flex items-center gap-8 text-[12px] font-bold uppercase tracking-widest text-[#5E5D57]">
        <a href="#services" class="hover:text-[#1A1A1E] transition">Services</a>
        <a href="#about" class="hover:text-[#1A1A1E] transition">About</a>
        <a href="#whyus" class="hover:text-[#1A1A1E] transition">Philosophy</a>
        <a href="#portfolio" class="hover:text-[#1A1A1E] transition">Portfolio</a>
        <a href="#faq" class="hover:text-[#1A1A1E] transition">FAQ</a>
      </nav>
      <a href="#contact" class="px-5 h-11 border border-[#1A1A1E] hover:bg-[#1A1A1E] hover:text-[#FAF9F6] transition flex items-center justify-center text-[11px] font-black uppercase tracking-widest">
        ${isEn ? 'Start Project' : 'Lancer un Projet'}
      </a>
    </div>
  </header>

  <!-- Hero Section (Asymmetrical layout: Taste-Skill constraint) -->
  <section class="border-b border-[#E1DDD5] relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 space-y-6">
        <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8A877E]">
          <span>—</span> ${tagline}
        </div>
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-light leading-[1.05] font-serif-luxury italic text-[#1A1A1E]">
          ${heroTitle}
        </h1>
        <p class="text-base sm:text-lg text-[#5E5D57] max-w-xl font-normal leading-relaxed">
          ${heroSubtitle}
        </p>
        <div class="pt-4 flex flex-wrap gap-4">
          <a href="#contact" class="px-8 h-14 bg-[#1A1A1E] text-[#FAF9F6] hover:bg-zinc-800 transition flex items-center justify-center text-xs font-extrabold uppercase tracking-widest shadow-sm">
            ${isEn ? 'Get Transparent Quote' : 'Demander mon Devis Ferme'}
          </a>
          <a href="#portfolio" class="px-8 h-14 border border-[#E1DDD5] hover:border-[#1A1A1E] transition flex items-center justify-center text-xs font-bold uppercase tracking-widest text-[#1A1A1E]">
            ${isEn ? 'View Architectural Portfolio' : 'Découvrir nos Réalisations'}
          </a>
        </div>
      </div>
      <div class="lg:col-span-5 relative">
        <div class="border border-[#E1DDD5] p-3 bg-white shadow-xl rounded-sm">
          <div class="aspect-[4/5] overflow-hidden bg-zinc-200">
            <img src="${photos[0]}" alt="${companyName} Hero Representation" class="w-full h-full object-cover">
          </div>
        </div>
        <div class="absolute -bottom-6 -left-6 bg-[#1A1A1E] text-[#FAF9F6] px-5 py-4 text-xs font-bold uppercase tracking-widest hidden sm:block">
          📍 ${city} & REGION
        </div>
      </div>
    </div>
  </section>

  <!-- Mathematical Stat Strip (No typical grid blocks, sleek divided bar) -->
  <section class="border-b border-[#E1DDD5] bg-white">
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#EBE7DF]">
        ${statLabels.map((s, idx) => `
          <div class="flex flex-col items-center text-center px-4 ${idx > 0 ? 'pt-6 md:pt-0' : ''}">
            <span class="text-3xl sm:text-4xl font-light font-serif-luxury italic text-[#1A1A1E]">${s.value}</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#8A877E] mt-1">${s.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- About Section - Pure Asymmetry, No nested cards -->
  <section id="about" class="border-b border-[#E1DDD5] py-20 md:py-28">
    <div class="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-5 space-y-6">
        <div class="text-xs font-bold uppercase tracking-widest text-[#8A877E]">— ${isEn ? 'Our Commitment' : 'Notre Philosophie'}</div>
        <h2 class="text-3xl sm:text-5xl font-light leading-tight font-serif-luxury text-[#1A1A1E]">
          ${content.aboutTitle || (isEn ? 'A legacy of uncompromising architectural excellence' : 'L\'amour du travail soigné, sans aucun compromis')}
        </h2>
        <div class="aspect-square border border-[#E1DDD5] p-2 bg-white rounded-sm">
          <img src="${photos[1] || photos[0]}" alt="Detailed craft work close up" class="w-full h-full object-cover">
        </div>
      </div>
      <div class="lg:col-span-7 flex flex-col justify-between py-2">
        <div class="text-base sm:text-lg text-[#5E5D57] leading-relaxed space-y-6 max-w-xl">
          <p class="first-letter:text-5xl first-letter:font-serif-luxury first-letter:italic first-letter:float-left first-letter:mr-3 first-letter:text-[#1A1A1E]">
            ${content.aboutText || (isEn 
              ? `We operate on one fundamental premise: your property deserves absolute, timeless perfection. We do not use sub-contractors, we do not take shortcuts, and we never compromise on structural and material standards.` 
              : `Chaque intervention est guidée par une exigence de précision absolue. Nous n'employons aucun sous-traitant temporaire, nous ne faisons aucune économie sur la qualité des matériaux, et nous garantissons par écrit la conformité de chaque ouvrage.`)}
          </p>
        </div>
        
        <div class="border-t border-[#E1DDD5] pt-8 mt-8 space-y-4">
          <h4 class="text-xs font-black uppercase tracking-widest text-[#1A1A1E]">${isEn ? 'Uncompromising Standards:' : 'Engagements Qualité Exclusifs :'}</h4>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5E5D57] font-medium">
            ${(content.aboutHighlights || [
              isEn ? 'All craftsmen are highly vetted and local' : 'Compagnons qualifiés et certifiés locaux',
              isEn ? 'Strict compliance to ecological regulations' : 'Respect rigoureux des chartes environnementales',
              isEn ? 'Detailed billing with 100% price transparency' : 'Facturation détaillée sans suppléments cachés',
              isEn ? 'Full ten-year legal insurance' : 'Garantie décennale et assurances complètes'
            ]).map(h => `
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-[#1A1A1E]"></span>
                <span>${h}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Services (Asymmetrical Grid Family - Pure Taste-Skill Grid Planning) -->
  <section id="services" class="border-b border-[#E1DDD5] bg-white py-20 md:py-28">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div class="text-xs font-bold uppercase tracking-widest text-[#8A877E]">— SERVICES</div>
          <h2 class="text-3xl sm:text-5xl font-light leading-tight font-serif-luxury text-[#1A1A1E] mt-2">
            ${content.servicesSectionTitle || (isEn ? 'Specialized Craft Engineering' : 'Nos Secteurs d’Expertise')}
          </h2>
        </div>
        <p class="text-xs sm:text-sm text-[#5E5D57] max-w-md font-medium leading-relaxed">
          ${content.servicesSectionSubtitle || (isEn ? 'Transparent fixed pricing paired with direct master craftsman oversight.' : 'Chaque pôle technique est piloté par un artisan qualifié avec assurance professionnelle obligatoire.')}
        </p>
      </div>

      <!-- Asymmetrical 3-Column Family: Grid planning avoids generic layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        ${services.map((s, idx) => `
          <div class="border border-[#EBE7DF] rounded-sm bg-[#FAF9F6] p-8 flex flex-col justify-between hover:border-[#1A1A1E] transition duration-500 group">
            <div class="space-y-6">
              <div class="text-[11px] font-black tracking-widest text-[#8A877E] uppercase flex justify-between">
                <span>0${idx + 1} // UNIT</span>
                <span class="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">${s.price || 'QUOTE'}</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-light text-[#1A1A1E] font-serif-luxury italic">${s.title}</h3>
              <p class="text-xs sm:text-sm text-[#5E5D57] leading-relaxed font-normal">${s.description}</p>
            </div>
            <a href="#contact" class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#1A1A1E] mt-8 hover:gap-3 transition-all">
              ${content.serviceBtnLabel || (isEn ? 'Inquire for specifications' : 'Demander une étude')} 
              <span>→</span>
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Interactive Visual Calculator Widget (High-end engagement instead of standard card) -->
  <section class="border-b border-[#E1DDD5] py-20">
    <div class="max-w-4xl mx-auto px-6">
      <div class="border border-[#1A1A1E] bg-white p-8 md:p-12 relative">
        <div class="absolute -top-3.5 left-8 bg-[#1A1A1E] text-[#FAF9F6] text-[10px] font-black uppercase tracking-widest px-3 py-1">
          📊 ESTIMATOR WIDGET
        </div>
        <div class="space-y-6 text-center">
          <h3 class="text-2xl sm:text-3xl font-light font-serif-luxury italic text-[#1A1A1E]">
            ${isEn ? 'Estimate your bespoke project instantly' : 'Estimez votre budget de projet sur-mesure'}
          </h3>
          <p class="text-xs text-[#8A877E] tracking-wider uppercase">${isEn ? 'Interactive Estimate Calculation Tool' : 'Outil interactif d\'estimation immédiate'}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div class="space-y-3 text-left">
              <label class="text-[11px] font-extrabold uppercase tracking-wider text-[#1A1A1E] block">${isEn ? 'Approximate Area (m²)' : 'Surface approximative (m²)'}</label>
              <input type="range" id="calc-area" min="5" max="300" value="50" class="w-full accent-[#1A1A1E]" oninput="document.getElementById('calc-area-val').innerText = this.value + ' m²'; calculateEstimate()">
              <span id="calc-area-val" class="text-xs font-mono font-bold bg-[#FAF9F6] border border-[#E1DDD5] px-2 py-1">50 m²</span>
            </div>
            
            <div class="space-y-3 text-left">
              <label class="text-[11px] font-extrabold uppercase tracking-wider text-[#1A1A1E] block">${isEn ? 'Finish Level Style' : 'Niveau de Finition exigé'}</label>
              <select id="calc-finish" class="w-full h-11 border border-[#E1DDD5] px-3 text-xs uppercase font-bold tracking-wider bg-white focus:outline-none focus:border-[#1A1A1E]" onchange="calculateEstimate()">
                <option value="90">${isEn ? 'Standard Certified' : 'Garantie Standard Certifiée'}</option>
                <option value="250" selected>${isEn ? 'Bespoke Premium' : 'Gamme Prestige Sélectionnée'}</option>
                <option value="550">${isEn ? 'Ultra-High End Luxury' : 'Luxe Signature Haute Couture'}</option>
              </select>
            </div>
          </div>
          
          <div class="bg-[#FAF9F6] border border-[#EBE7DF] p-6 rounded-sm text-center space-y-1">
            <div class="text-[10px] font-bold uppercase tracking-widest text-[#8A877E]">${isEn ? 'Approximate Budget Range' : 'Fourchette d\'estimation budgétaire'}</div>
            <div id="calc-result" class="text-3xl sm:text-4xl font-light font-serif-luxury italic text-[#1A1A1E]">12,500 € - 18,200 €</div>
            <p class="text-[10px] text-zinc-400 leading-relaxed max-w-sm mx-auto">${isEn ? 'Calculated on regional labor standards and material supply indexes.' : 'Estimation calculée d\'après l\'indice régional des prix du bâtiment.'}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Philosophy and Strategic Guarantees -->
  <section id="whyus" class="border-b border-[#E1DDD5] bg-[#FAF9F6] py-20 md:py-28">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-4 space-y-4">
          <div class="text-xs font-bold uppercase tracking-widest text-[#8A877E]">— ${isEn ? 'Direct Line Quality' : 'Garanties Pratiques'}</div>
          <h2 class="text-3xl sm:text-4xl font-light leading-tight font-serif-luxury text-[#1A1A1E]">
            ${content.whyUsSectionTitle || (isEn ? 'Why we do not compromise' : 'Pourquoi nous refusons le travail bâclé')}
          </h2>
          <p class="text-xs sm:text-sm text-[#5E5D57] leading-relaxed max-w-sm">
            ${isEn ? 'We choose elite craftsmanship over scalable mass assembly. Every project receives dedicated project head oversight.' : 'Chaque chantier est traité comme une œuvre unique, supervisé personnellement par un artisan qualifié.'}
          </p>
        </div>
        
        <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          ${whyUs.map((w, idx) => `
            <div class="space-y-4 border-l border-[#E1DDD5] pl-6 py-2">
              <span class="text-xs font-mono font-bold text-[#8A877E]">0${idx + 1} / BLOCK</span>
              <h4 class="text-base font-extrabold uppercase tracking-wide text-[#1A1A1E]">${w.title}</h4>
              <p class="text-xs sm:text-sm text-[#5E5D57] leading-relaxed">${w.text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- Real-Estate Portfolio Showcase -->
  <section id="portfolio" class="border-b border-[#E1DDD5] bg-white py-20 md:py-28">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div class="text-xs font-bold uppercase tracking-widest text-[#8A877E]">— PORTFOLIO</div>
          <h2 class="text-3xl sm:text-5xl font-light leading-tight font-serif-luxury text-[#1A1A1E] mt-2">
            ${content.galleryTitle || (isEn ? 'Selected Visual Architecture' : 'Nos Réalisations Marquantes')}
          </h2>
        </div>
        <a href="#contact" class="px-6 h-12 bg-[#1A1A1E] text-[#FAF9F6] hover:bg-zinc-800 transition flex items-center justify-center text-xs font-bold uppercase tracking-widest">
          ${isEn ? 'Inquire About Projects' : 'Demander une Étude Similaire'}
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        ${photos.slice(1, 5).map((img, idx) => `
          <div class="group space-y-4">
            <div class="border border-[#E1DDD5] p-2 bg-white rounded-sm overflow-hidden aspect-[16/10]">
              <img src="${img}" alt="Project Showcase ${idx + 1}" class="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700">
            </div>
            <div class="flex justify-between items-center text-xs font-bold uppercase tracking-widest px-1">
              <span class="text-[#1A1A1E]">${isEn ? `ARCHITECTURAL BLOCK #${idx + 1}` : `PROJET RÉSIDENTIEL #${idx + 1}`}</span>
              <span class="text-[#8A877E]">${city}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Client Testimonials -->
  <section class="border-b border-[#E1DDD5] bg-[#FAF9F6] py-20 md:py-28">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div class="text-xs font-bold uppercase tracking-widest text-[#8A877E]">— TESTIMONIALS</div>
        <h2 class="text-3xl sm:text-5xl font-light font-serif-luxury text-[#1A1A1E] italic">
          ${content.reviewsSectionTitle || (isEn ? 'What our clients say about our precision' : 'Ce que nos clients disent de notre rigueur')}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        ${testimonials.map(t => `
          <div class="border border-[#EBE7DF] bg-white p-8 rounded-sm relative flex flex-col justify-between">
            <div class="space-y-4">
              <div class="flex items-center gap-1 text-amber-500">
                ${'★'.repeat(t.rating || 5)}
              </div>
              <p class="text-xs sm:text-sm text-[#5E5D57] leading-relaxed italic">
                "${t.text}"
              </p>
            </div>
            <div class="flex items-center gap-4 border-t border-[#EBE7DF] pt-6 mt-8">
              <div class="w-10 h-10 rounded-full overflow-hidden border border-[#E1DDD5] bg-zinc-100">
                <img src="${t.avatar || 'https://i.pravatar.cc/100?img=1'}" alt="Customer avatar" class="w-full h-full object-cover">
              </div>
              <div>
                <h4 class="text-xs font-black uppercase tracking-wider text-[#1A1A1E]">${t.name}</h4>
                <p class="text-[10px] font-bold text-[#8A877E] uppercase mt-0.5">${t.city || city}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section id="faq" class="border-b border-[#E1DDD5] bg-white py-20 md:py-28">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center space-y-4 mb-16">
        <div class="text-xs font-bold uppercase tracking-widest text-[#8A877E]">— FAQ</div>
        <h2 class="text-3xl sm:text-4xl font-light font-serif-luxury text-[#1A1A1E] italic">
          ${content.faqTitle || (isEn ? 'Frequently Asked Questions' : 'Questions Fréquentes')}
        </h2>
      </div>

      <div class="space-y-6">
        ${faq.map(f => `
          <div class="border-b border-[#E1DDD5] pb-6 space-y-2">
            <h4 class="text-sm sm:text-base font-extrabold uppercase tracking-wide text-[#1A1A1E]">
              💡 ${f.question}
            </h4>
            <p class="text-xs sm:text-sm text-[#5E5D57] leading-relaxed max-w-3xl">
              ${f.answer}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Contact Form Section - Pristine, ultra clean grid, no heavy boxes -->
  <section id="contact" class="bg-[#FAF9F6] py-20 md:py-28">
    <div class="max-w-5xl mx-auto px-6 md:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-5 space-y-6">
          <div class="text-xs font-bold uppercase tracking-widest text-[#8A877E]">— REQUEST QUOTE</div>
          <h2 class="text-3xl sm:text-4xl font-light font-serif-luxury text-[#1A1A1E] italic leading-tight">
            ${content.contactTitle || (isEn ? 'Start your architectural project estimate' : 'Demander une étude personnalisée')}
          </h2>
          <p class="text-xs sm:text-sm text-[#5E5D57] leading-relaxed">
            ${content.contactSubtitle || (isEn ? 'Submit your specifications and our technician will contact you within 24 hours.' : 'Remplissez le formulaire ci-contre. Nous répondons sous 24h ouvrées par écrit.')}
          </p>
          
          <div class="pt-8 border-t border-[#E1DDD5] space-y-4">
            <div class="text-[11px] font-black uppercase tracking-widest text-[#1A1A1E]">${isEn ? 'OFFICE CONTACTS' : 'COORDONNÉES DE L’ARTISAN'}</div>
            <div class="text-xs text-[#5E5D57] space-y-2 font-medium">
              ${address ? `<p class="flex items-center gap-2">📍 <span>${address}</span></p>` : ''}
              <p class="flex items-center gap-2">📞 <a href="tel:${phone}" class="underline hover:text-[#1A1A1E]">${phone}</a></p>
              <p class="flex items-center gap-2">✉️ <a href="mailto:${email}" class="underline hover:text-[#1A1A1E]">${email}</a></p>
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-7 bg-white border border-[#E1DDD5] p-8 sm:p-12 shadow-sm rounded-sm">
          <form class="space-y-6" onsubmit="alert('${isEn ? 'Thank you! Your request has been recorded.' : 'Merci ! Votre demande a bien été reçue. Notre technicien vous recontactera sous 24h.'}'); return false;">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-wider text-[#1A1A1E] block">${isEn ? 'Full Name' : 'Nom Complet'}</label>
                <input type="text" required class="w-full h-11 border-b border-[#E1DDD5] bg-transparent text-xs text-[#1A1A1E] placeholder-zinc-400 focus:outline-none focus:border-b-2 focus:border-[#1A1A1E]">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-wider text-[#1A1A1E] block">${isEn ? 'Phone Number' : 'Numéro de Téléphone'}</label>
                <input type="tel" required class="w-full h-11 border-b border-[#E1DDD5] bg-transparent text-xs text-[#1A1A1E] placeholder-zinc-400 focus:outline-none focus:border-b-2 focus:border-[#1A1A1E]">
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-wider text-[#1A1A1E] block">${isEn ? 'Email Address' : 'Adresse Email'}</label>
              <input type="email" required class="w-full h-11 border-b border-[#E1DDD5] bg-transparent text-xs text-[#1A1A1E] placeholder-zinc-400 focus:outline-none focus:border-b-2 focus:border-[#1A1A1E]">
            </div>
            
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-wider text-[#1A1A1E] block">${isEn ? 'Project Location' : 'Localité du Chantier'}</label>
              <input type="text" value="${city}" class="w-full h-11 border-b border-[#E1DDD5] bg-transparent text-xs text-[#1A1A1E] placeholder-zinc-400 focus:outline-none focus:border-b-2 focus:border-[#1A1A1E]">
            </div>
            
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-wider text-[#1A1A1E] block">${isEn ? 'Project Specifications' : 'Cahier des charges / Descriptif projet'}</label>
              <textarea rows="3" required class="w-full border-b border-[#E1DDD5] bg-transparent text-xs text-[#1A1A1E] placeholder-zinc-400 focus:outline-none focus:border-b-2 focus:border-[#1A1A1E] resize-none"></textarea>
            </div>
            
            <button type="submit" class="w-full h-14 bg-[#1A1A1E] text-[#FAF9F6] hover:bg-zinc-800 transition text-[11px] font-black uppercase tracking-widest cursor-pointer shadow-sm">
              ${content.contactSubmitText || (isEn ? 'Submit Devis Request' : 'Envoyer ma Demande de Devis')}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-[#E1DDD5] py-8 bg-white text-center">
    <div class="max-w-7xl mx-auto px-6 text-[10px] font-bold uppercase tracking-wider text-[#8A877E] flex flex-col sm:flex-row justify-between items-center gap-4">
      <p>${content.copyrightText || `© 2026 ${companyName}. Tous droits réservés.`}</p>
      <div class="flex gap-6">
        <a href="#" class="hover:text-[#1A1A1E] transition">Legal Notice</a>
        <a href="#" class="hover:text-[#1A1A1E] transition">Privacy Policy</a>
      </div>
    </div>
  </footer>

  <script>
    function calculateEstimate() {
      const area = parseInt(document.getElementById('calc-area').value);
      const finish = parseInt(document.getElementById('calc-finish').value);
      
      const low = area * finish;
      const high = Math.floor(low * 1.45);
      
      document.getElementById('calc-result').innerText = low.toLocaleString() + ' € - ' + high.toLocaleString() + ' €';
    }
  </script>

</body>
</html>`;
}

/**
 * 2. Leon Taste Editorial Template
 */
export function buildTasteEditorialTemplate(lead, content, lang = 'fr') {
  const companyName = content.brandName || lead.name || lead.companyName || lead.company || lead.businessName || 'Elite Services';
  const phone = content.contactPhone || lead.phone || '01 89 00 12 34';
  const email = content.contactEmail || lead.email || `contact@${getSlug(companyName)}.com`;
  const city = content.city || lead.city || 'votre ville';
  const address = content.contactAddress || lead.address || '';
  const isEn = lang === 'en';
  
  const primaryColor = content.primaryColor || '#78350F';
  const tagline = content.tagline || (isEn ? 'The Journal of Fine Crafts' : 'Le Journal du Bâtiment & des Métiers d\'Art');
  const ribbonText = content.ribbonText || (isEn ? 'COMMITTED TO THE ABSOLUTE STANDARDS OF THE CRAFT' : 'ENGAGÉ SUR LA CHARTE QUALITÉ DES COMPAGNONS DU DEVOIR');
  
  const heroTitle = content.heroTitle || (isEn ? `Modern engineering with classic craftsmanship in ${city}` : `Une ingénierie rigoureuse au service du patrimoine à ${city}`);
  const heroSubtitle = content.heroSubtitle || (isEn ? 'We refuse the industrialization of the craft. Our services are tailored exclusively for those seeking meticulous detailing, local materials, and legal security.' : 'Nous refusons l\'industrialisation et le travail à la chaîne. Nos chantiers sont menés de façon exclusive pour garantir un soin extrême, des essences locales et une sécurité juridique décennale totale.');

  const photos = content.uploadedImages?.length ? content.uploadedImages : (content.photos?.length ? content.photos : [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop'
  ]);

  const defaultServices = [
    { title: isEn ? 'Master Level Woodwork' : 'Menuiserie d’Art & Ébénisterie', description: isEn ? 'From solid oak doors to custom library fittings designed for structural longevity.' : 'Création de parquets traditionnels, bibliothèques sur mesure et huisseries d\'art en chêne massif.', price: 'Sur Devis' },
    { title: isEn ? 'Structural Masonry & Lime' : 'Maçonnerie de Caractère & Enduits Chaux', description: isEn ? 'Traditional stone repairs, lime rendering, and structural reinforcement.' : 'Rejointoiement de pierres anciennes, pose d\'enduits à la chaux respirants et consolidation structurelle.', price: 'Forfait Clair' },
    { title: isEn ? 'Complete Modern Restoration' : 'Rénovation Énergétique Premium', description: isEn ? 'Updating plumbing, heating, and insulation while fully preserving architectural soul.' : 'Mise à niveau de vos réseaux sanitaires et de chauffage en préservant l\'intégrité esthétique de votre logement.', price: 'Étude Gratuite' }
  ];
  const services = content.services?.length ? content.services : defaultServices;

  const defaultWhyUs = [
    { title: isEn ? 'One exclusive project at a time' : 'Une seule réalisation exclusive', text: isEn ? 'We never stack or overlap clients. Your project has the absolute undivided attention of our team.' : 'Nous n’acceptons jamais plusieurs chantiers en parallèle. Votre projet bénéficie de notre attention exclusive.' },
    { title: isEn ? 'A direct local registry source' : 'Matériaux locaux traçables', text: isEn ? 'Every timber panel, stone tile, or lime wash is fully traceable to sustainably managed local quarries.' : 'Chaque essence de bois ou pierre de taille est issue de forêts ou carrières locales à traçabilité stricte.' },
    { title: isEn ? 'Legally locked fixed pricing' : 'Contrat de prix garanti ferme', text: isEn ? 'We assume all pricing risks. Our quote is fully legally locked, with absolutely zero indexation surprise.' : 'Nous assumons tous les risques d’indexation. Notre prix reste ferme de la signature à la livraison.' }
  ];
  const whyUs = content.whyUs?.length ? content.whyUs : defaultWhyUs;

  return `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} — ${tagline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #FAF6F0;
      color: #2D2A26;
    }
    .font-editorial {
      font-family: 'Playfair Display', Georgia, serif;
    }
    .thin-divider {
      border-color: #E6DFD5;
    }
  </style>
</head>
<body class="bg-[#FAF6F0] text-[#2D2A26] antialiased">

  <!-- Editorial Top Banner -->
  <div class="bg-[#2D2A26] text-[#FAF6F0] px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-center">
    🗞️ ${ribbonText} — ${city}
  </div>

  <!-- Main Newspaper-style Grid Container -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
    
    <!-- Masthead -->
    <header class="thin-divider border-b pb-8 mb-8 text-center space-y-4">
      <div class="flex justify-between items-center text-[11px] font-extrabold uppercase tracking-widest text-[#7C756B] mb-2">
        <span>VOL. XIV // NO. 2026</span>
        <span class="hidden md:inline">— ESTABLISHED LOCAL CRAFT —</span>
        <span>📍 ${city} & REGION</span>
      </div>
      <h1 class="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight font-editorial uppercase text-[#2D2A26]">
        ${companyName}
      </h1>
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#7C756B] italic font-editorial">
        — ${tagline} —
      </p>
    </header>

    <!-- Top Headline News Hero (Editorial layout grid: asymmetry rules) -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 thin-divider border-b pb-12">
      
      <!-- Column Left (Main Story) -->
      <div class="lg:col-span-8 space-y-6 lg:border-r thin-divider lg:pr-8">
        <div class="inline-flex items-center gap-2 px-2 py-0.5 border border-[#78350F]/25 bg-[#78350F]/5 rounded-sm text-[10px] font-black uppercase tracking-wider text-[#78350F]">
          FEATURED REPORT
        </div>
        <h2 class="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] font-editorial text-[#2D2A26]">
          ${heroTitle}
        </h2>
        
        <div class="aspect-[16/9] overflow-hidden bg-zinc-200 border border-[#E6DFD5] p-1.5 bg-white shadow-sm">
          <img src="${photos[0]}" alt="${companyName} Editorial Cover" class="w-full h-full object-cover">
        </div>
        
        <p class="text-base text-[#4D4842] leading-relaxed font-normal">
          ${heroSubtitle}
        </p>
        
        <div class="pt-2 flex flex-wrap gap-4">
          <a href="#contact" class="px-6 h-12 bg-[#2D2A26] text-[#FAF6F0] hover:bg-zinc-800 transition flex items-center justify-center text-xs font-extrabold uppercase tracking-widest">
            ${isEn ? 'Consult our specialists' : 'Contacter nos experts'}
          </a>
          <a href="#services" class="px-6 h-12 border border-[#E6DFD5] hover:border-[#2D2A26] transition flex items-center justify-center text-xs font-bold uppercase tracking-widest text-[#2D2A26]">
            ${isEn ? 'Browse Classified Services' : 'Consulter notre catalogue'}
          </a>
        </div>
      </div>
      
      <!-- Column Right (Quick facts & Urgent Dispatch ticker) -->
      <div class="lg:col-span-4 space-y-8 flex flex-col justify-between">
        <div class="space-y-6">
          <div class="border-b border-[#2D2A26] pb-2">
            <h3 class="text-xs font-black uppercase tracking-widest text-[#2D2A26]">${isEn ? 'CLASSIFIED TELEPHONY' : 'HOTLINE & COORDINATION'}</h3>
          </div>
          <div class="p-6 bg-[#FAF1E6] border border-[#E6DFD5] text-center space-y-3">
            <div class="text-[10px] font-black uppercase tracking-wider text-[#78350F]">${isEn ? 'DIRECT TELEPHONE INTERVENTION' : 'LIGNE DIRECTE D’INTERVENTION'}</div>
            <a href="tel:${phone}" class="text-2xl font-black font-editorial text-[#2D2A26] tracking-tight hover:underline block">${phone}</a>
            <p class="text-[10px] text-zinc-500 font-medium leading-relaxed">${isEn ? 'Response within 30 minutes in city bounds.' : 'Conseiller d\'astreinte disponible immédiatement.'}</p>
          </div>
          
          <div class="space-y-4 pt-4">
            <h4 class="text-xs font-black tracking-widest uppercase text-[#7C756B]">— ${isEn ? 'EDITORIAL HIGHLIGHTS' : 'NOTES DE SÉCURITÉ'}</h4>
            <div class="space-y-3 text-xs text-[#4D4842] font-medium">
              <p class="flex items-start gap-2.5">
                <span class="text-[#78350F] mt-0.5">✓</span>
                <span>${isEn ? 'We hold all official certifications and legal insurances' : 'Titulaires de la garantie décennale et qualifications obligatoires.'}</span>
              </p>
              <p class="flex items-start gap-2.5">
                <span class="text-[#78350F] mt-0.5">✓</span>
                <span>${isEn ? 'Strict environmental preservation protocol applied' : 'Tri et recyclage des déchets assurés selon les normes européennes.'}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="border-t thin-divider pt-6 space-y-3">
          <div class="text-[11px] font-black uppercase tracking-widest text-[#2D2A26]">${isEn ? 'INQUIRY SUBMISSIONS' : 'ENVOYER UN DOSSIER'}</div>
          <p class="text-xs text-[#7C756B] leading-relaxed">${isEn ? 'We establish fully legally legally binding quotes under 24 hours.' : 'Nous établissons des devis fermes et définitifs sous 24 heures.'}</p>
          <a href="#contact" class="w-full h-11 bg-[#78350F] text-white hover:bg-amber-900 transition flex items-center justify-center text-[10px] font-black uppercase tracking-widest">${isEn ? 'Submit Devis Request' : 'Soumettre un dossier'}</a>
        </div>
      </div>
    </section>

    <!-- Services Classified Columns (Editorial layout has custom section style) -->
    <section id="services" class="py-12 thin-divider border-b">
      <div class="text-center space-y-2 mb-12">
        <span class="text-xs font-black uppercase tracking-widest text-[#7C756B]">— ${isEn ? 'CLASSIFIED SECTION' : 'COMMUNIQUÉS OFFICIELS'} —</span>
        <h3 class="text-3xl sm:text-4xl font-black font-editorial text-[#2D2A26]">${content.servicesSectionTitle || (isEn ? 'Classified Craft Offerings' : 'Nos Pôles de Spécialités')}</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${services.map((s, idx) => `
          <div class="space-y-4 pb-6 border-b md:border-b-0 ${idx < 2 ? 'md:border-r thin-divider md:pr-8' : ''}">
            <div class="aspect-[16/10] overflow-hidden bg-zinc-200 border border-[#E6DFD5] p-1 bg-white mb-4">
              <img src="${s.image || photos[idx % photos.length]}" alt="Service representing ${s.title}" class="w-full h-full object-cover">
            </div>
            <div class="flex justify-between items-center border-b border-[#2D2A26] pb-1.5">
              <h4 class="text-base font-black font-editorial text-[#2D2A26]">${s.title}</h4>
              <span class="text-xs font-mono font-bold text-[#78350F]">${s.price || 'DEVIS'}</span>
            </div>
            <p class="text-xs sm:text-sm text-[#4D4842] leading-relaxed">${s.description}</p>
            <a href="#contact" class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#78350F] hover:underline">
              ${isEn ? 'Submit inquiry' : 'Faire une demande de prix'} <span>→</span>
            </a>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Philosophy columns -->
    <section id="whyus" class="py-12 bg-[#FAF1E6] px-6 sm:px-10 border border-[#E6DFD5] my-12 grid grid-cols-1 md:grid-cols-12 gap-8">
      <div class="md:col-span-4 space-y-3 flex flex-col justify-between">
        <div>
          <div class="text-[10px] font-black tracking-widest uppercase text-[#78350F]">${isEn ? 'CRAFT PHILOSOPHY' : 'CHARTE QUALITÉ'}</div>
          <h3 class="text-2xl sm:text-3xl font-black font-editorial text-[#2D2A26] mt-2">${content.whyUsSectionTitle || (isEn ? 'Unbending Commitment' : 'La Charte de l\'Artisan')}</h3>
        </div>
        <p class="text-xs text-[#7C756B] leading-relaxed max-w-sm">${isEn ? 'Our principles are backed by decades of regional masonry and carpentry experience.' : 'Une exigence de rigueur héritée du savoir-faire des compagnons d\'artisanat.'}</p>
      </div>
      <div class="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        ${whyUs.map((w, idx) => `
          <div class="space-y-3">
            <span class="text-xs font-mono font-bold text-[#78350F]">RULE 0${idx + 1}</span>
            <h4 class="text-xs font-black uppercase tracking-wide text-[#2D2A26]">${w.title}</h4>
            <p class="text-xs text-[#4D4842] leading-relaxed">${w.text}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Portfolio & Works -->
    <section id="portfolio" class="py-12 thin-divider border-b">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span class="text-xs font-black uppercase tracking-widest text-[#7C756B]">— PORTFOLIO</span>
          <h3 class="text-3xl sm:text-4xl font-black font-editorial text-[#2D2A26] mt-1">${content.galleryTitle || (isEn ? 'Visual Chronicle of Hand-Crafted Projects' : 'Registre des Chantiers Réalisés')}</h3>
        </div>
        <a href="#contact" class="px-5 h-11 bg-[#2D2A26] text-white hover:bg-zinc-800 transition flex items-center justify-center text-[11px] font-black uppercase tracking-widest">${isEn ? 'Inquire for detailing' : 'Demander des photos d\'autres chantiers'}</a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${photos.slice(0, 3).map((img, idx) => `
          <div class="border border-[#E6DFD5] p-2 bg-white rounded-sm space-y-3 shadow-sm">
            <div class="aspect-video overflow-hidden">
              <img src="${img}" alt="Project details ${idx + 1}" class="w-full h-full object-cover">
            </div>
            <div class="text-[11px] font-black uppercase tracking-wider text-center text-[#2D2A26]">
              ${isEn ? `ARCHITECTURAL BLOCK SPEC_0${idx + 1}` : `RÉALISATION COORDONNÉE RÉSIDENTIELLE _0${idx + 1}`}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Unified Form Section -->
    <section id="contact" class="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-5 space-y-6">
        <span class="text-xs font-black uppercase tracking-widest text-[#7C756B]">— SUBMIT APPLICATION</span>
        <h3 class="text-3xl sm:text-4xl font-black font-editorial text-[#2D2A26]">${content.contactTitle || (isEn ? 'Lodge a project contract query' : 'Soumettre un cahier des charges')}</h3>
        <p class="text-xs sm:text-sm text-[#4D4842] leading-relaxed">
          ${content.contactSubtitle || (isEn ? 'Submit your specifications and architectural requirements for a transparent, legally bound estimate under 24 hours.' : 'Faites-nous part de vos besoins de rénovation ou de menuiserie. Nous établissons des propositions fermes sous 24 heures.')}
        </p>
        
        <div class="pt-6 border-t thin-divider space-y-3 font-semibold text-xs text-[#4D4842]">
          <p>📞 <a href="tel:${phone}" class="underline hover:text-[#2D2A26]">${phone}</a></p>
          <p>✉️ <a href="mailto:${email}" class="underline hover:text-[#2D2A26]">${email}</a></p>
          ${address ? `<p>📍 <span>${address}</span></p>` : ''}
        </div>
      </div>
      
      <div class="lg:col-span-7 bg-white border border-[#E6DFD5] p-8 sm:p-12 shadow-sm rounded-sm">
        <form class="space-y-6" onsubmit="alert('${isEn ? 'Thank you! Your specifications have been saved.' : 'Merci ! Votre dossier a été transmis avec succès. Un technicien vous appellera sous 24h.'}'); return false;">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-wider block text-[#2D2A26]">${isEn ? 'Full Name' : 'Nom Complet'}</label>
              <input type="text" required class="w-full h-11 border-b border-[#E6DFD5] bg-transparent text-xs text-[#2D2A26] focus:outline-none focus:border-b-2 focus:border-[#78350F]">
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-wider block text-[#2D2A26]">${isEn ? 'Telephone Number' : 'Numéro de Téléphone'}</label>
              <input type="tel" required class="w-full h-11 border-b border-[#E6DFD5] bg-transparent text-xs text-[#2D2A26] focus:outline-none focus:border-b-2 focus:border-[#78350F]">
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-wider block text-[#2D2A26]">${isEn ? 'Email Address' : 'Adresse Email'}</label>
            <input type="email" required class="w-full h-11 border-b border-[#E6DFD5] bg-transparent text-xs text-[#2D2A26] focus:outline-none focus:border-b-2 focus:border-[#78350F]">
          </div>
          
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-wider block text-[#2D2A26]">${isEn ? 'Project Location / Address' : 'Adresse / Ville du Chantier'}</label>
            <input type="text" value="${city}" class="w-full h-11 border-b border-[#E6DFD5] bg-transparent text-xs text-[#2D2A26] focus:outline-none focus:border-b-2 focus:border-[#78350F]">
          </div>
          
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-wider block text-[#2D2A26]">${isEn ? 'Description of Works' : 'Descriptif des Travaux'}</label>
            <textarea rows="3" required class="w-full border-b border-[#E6DFD5] bg-transparent text-xs text-[#2D2A26] focus:outline-none focus:border-b-2 focus:border-[#78350F] resize-none"></textarea>
          </div>
          
          <button type="submit" class="w-full h-14 bg-[#2D2A26] text-white hover:bg-zinc-800 transition text-[11px] font-black uppercase tracking-widest cursor-pointer">
            ${isEn ? 'Submit dossier application' : 'Transmettre mon dossier'}
          </button>
        </form>
      </div>
    </section>

  </div>

  <!-- Newspaper Footer -->
  <footer class="bg-[#2D2A26] text-[#FAF6F0] py-12 border-t thin-divider mt-12">
    <div class="max-w-7xl mx-auto px-6 text-center space-y-3">
      <p class="text-[11px] font-black uppercase tracking-widest">${companyName}</p>
      <p class="text-[10px] text-[#7C756B] leading-relaxed max-w-md mx-auto">
        ${content.copyrightText || `© 2026 ${companyName}. Tous droits réservés.`}
      </p>
    </div>
  </footer>

</body>
</html>`;
}
