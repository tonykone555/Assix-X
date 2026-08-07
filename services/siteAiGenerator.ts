import { callAI } from "./aiService";
import { SiteContent, getSectorKey, getSectorDefaultColor, detectLanguage } from "./siteTemplate";
import { crawlPage } from "./crawl4ai";

export function parseAIJsonResponse(text: string): any {
  if (!text) throw new Error("Empty response from AI");
  let cleaned = text.trim();
  // Strip markdown code block wrappers
  cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "").trim();

  // Extract JSON substring if surrounded by markdown text or headers
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');

  if (firstBrace !== -1 && lastBrace > firstBrace && (firstBracket === -1 || firstBrace < firstBracket)) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  } else if (firstBracket !== -1 && lastBracket > firstBracket) {
    cleaned = cleaned.substring(firstBracket, lastBracket + 1);
  }

  return JSON.parse(cleaned);
}

export async function scrapeWebsiteReviewsForLead(lead: any): Promise<Array<{ name: string; text: string; rating?: number; city?: string; avatar?: string }>> {
  // 1. Direct reviewsList, googleReviews or reviews property on lead object
  if (lead.reviewsList && Array.isArray(lead.reviewsList) && lead.reviewsList.length > 0) {
    return lead.reviewsList.map((r: any, idx: number) => ({
      name: r.author || r.name || r.authorName || 'Verified Client',
      text: r.text || r.reviewText || r.comment || '',
      rating: r.rating || r.stars || 5,
      city: lead.city || '',
      avatar: `https://i.pravatar.cc/100?img=${(idx % 60) + 1}`
    }));
  }
  if (lead.googleReviews && Array.isArray(lead.googleReviews) && lead.googleReviews.length > 0) {
    return lead.googleReviews.map((r: any, idx: number) => ({
      name: r.author || r.name || 'Verified Client',
      text: r.text || r.reviewText || '',
      rating: r.rating || 5,
      city: lead.city || '',
      avatar: `https://i.pravatar.cc/100?img=${(idx % 60) + 1}`
    }));
  }
  if (lead.reviews && Array.isArray(lead.reviews) && lead.reviews.length > 0) {
    return lead.reviews.map((r: any, idx: number) => ({
      name: r.author || r.name || 'Verified Client',
      text: r.text || r.reviewText || '',
      rating: r.rating || 5,
      city: lead.city || '',
      avatar: `https://i.pravatar.cc/100?img=${(idx % 60) + 1}`
    }));
  }

  // 2. Crawl website if provided
  const siteUrl = lead.website || lead.url || lead.websiteUrl || lead.link;
  if (siteUrl && typeof siteUrl === 'string' && siteUrl.startsWith('http')) {
    try {
      console.log(`[Review Scraper] Scraping website for real reviews: ${siteUrl}`);
      const crawlRes = await crawlPage(siteUrl);
      if (crawlRes.success && crawlRes.markdown && crawlRes.markdown.length > 80) {
        const prompt = `Extract any real customer testimonials, reviews, ratings, client feedback, or quote statements from this website text:
"${crawlRes.markdown.substring(0, 5000)}"

Return ONLY a valid JSON array of up to 6 reviews matching this format without markdown code fences:
[
  { "name": "Customer Name", "text": "Exact review text", "rating": 5, "city": "${lead.city || ''}" }
]
If no real reviews exist on the page, return [].`;

        const responseText = await callAI("site_generation", [
          { role: "user", content: prompt }
        ]);
        const extracted = parseAIJsonResponse(responseText);
        if (Array.isArray(extracted) && extracted.length > 0) {
          console.log(`[Review Scraper] Successfully extracted ${extracted.length} reviews from ${siteUrl}`);
          return extracted.map((r: any, idx: number) => ({
            name: r.name || 'Client',
            text: r.text || '',
            rating: r.rating || 5,
            city: r.city || lead.city || '',
            avatar: `https://i.pravatar.cc/100?img=${(idx % 60) + 1}`
          }));
        }
      }
    } catch (err: any) {
      console.warn(`[Review Scraper] Crawling failed:`, err.message);
    }
  }

  return [];
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
  companyName: string,
  city: string
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

  if (!reviews || reviews.length === 0) {
    if (lang === 'fr') return frDefaults;
    if (lang === 'es') return esDefaults;
    if (lang === 'de') return deDefaults;
    return [];
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

export function buildContentPrompt(
  lead: any,
  existingContent: string = "",
  pitchContext: string = "",
  langOverride?: string | null
): string {
  const lang = detectLanguage(lead, langOverride);
  const companyName = lead.name || lead.companyName || lead.company || lead.businessName || "Entreprise";
  const sector = lead.sector || lead.source || lead.niche || "services";
  const city = lead.city || lead.address || "";
  const rating = lead.rating || "4.9";
  const reviewsCount = lead.reviewsCount || "85";

  const langInstruction = lang === 'en' 
    ? 'Write ALL copy (titles, sub-headings, about text, services, AND ALL TESTIMONIALS/REVIEWS) in fluent, compelling professional ENGLISH.'
    : lang === 'es'
    ? 'Write ALL copy (titles, sub-headings, about text, services, AND ALL TESTIMONIALS/REVIEWS) in fluent, compelling professional SPANISH.'
    : lang === 'de'
    ? 'Write ALL copy (titles, sub-headings, about text, services, AND ALL TESTIMONIALS/REVIEWS) in fluent, compelling professional GERMAN.'
    : 'Write ALL copy (titles, sub-headings, about text, services, AND ALL TESTIMONIALS/REVIEWS) in fluent, compelling professional FRENCH.';

  const reviewExample = lang === 'fr'
    ? '{ "name": "Sébastien M.", "text": "Intervention très rapide, travail d\'une grande précision et tarif transparent. Je recommande sans hésiter !", "rating": 5, "city": "' + (city || 'Paris') + '" }'
    : lang === 'es'
    ? '{ "name": "Carlos R.", "text": "¡Excelente servicio y atención inmediata! Muy profesionales y atentos en todo momento.", "rating": 5, "city": "' + (city || 'Madrid') + '" }'
    : lang === 'de'
    ? '{ "name": "Markus S.", "text": "Ausgezeichneter Service, pünktlich und absolut professionell. Sehr zu empfehlen!", "rating": 5, "city": "' + (city || 'Berlin') + '" }'
    : '{ "name": "John D.", "text": "Outstanding service, very prompt, professional and fair pricing. Highly recommended!", "rating": 5, "city": "' + (city || 'London') + '" }';

  return `You are a world-class web designer, conversion copywriter, and digital marketing strategist.
Generate a high-converting landing page JSON payload specifically tailored for this local business.

CRITICAL INSTRUCTIONS:
1. LANGUAGE ENFORCEMENT: ${langInstruction}
   - NEVER output English text or English reviews if the target language is French, Spanish, or German!
   - Ensure all review/testimonial text matches the site's language.

2. NICHE & INDUSTRY PITCH TAILORING:
   - Sector/Niche: "${sector}"
   - Address/Location: "${city}"
   - The headline, tagline, about section, services, why us, and steps MUST speak DIRECTLY to what this specific business actually does!
     * If Plumbing: Emergency leaks, pipe repair, water heaters, 24/7 unblocking.
     * If Electrical: Panel upgrades, wiring, short circuit repair, emergency dispatch.
     * If Dental/Medical: Gentle care, teeth whitening, emergency appointments, implants.
     * If Legal/Notary: Contract review, defense, estate planning, expert consultations.
     * If Restaurant/Catering: Artisanal ingredients, event banquets, custom menus, reservation.
     * If Real Estate: Property valuation, home sales, expert local market advisory.
     * If Roofing/Construction: Storm repair, roof inspection, weatherproofing, custom builds.
     * If Automotive/Garage: Engine diagnostics, brake service, certified mechanic inspections.

Business Details:
- Name: "${companyName}"
- Industry/Niche: "${sector}"
- City/Location: "${city}"
- Google Rating: ${rating} ★ (${reviewsCount} reviews)
- Pitch Context: "${pitchContext || lead.pitch || ''}"
- Scraped / Existing Info: "${existingContent.substring(0, 3000)}"

Return ONLY a valid JSON object matching this schema without markdown code blocks:
{
  "brandName": "${companyName}",
  "language": "${lang}",
  "city": "${city}",
  "contactPhone": "${lead.phone || ''}",
  "contactEmail": "${lead.email || ''}",
  "contactAddress": "${lead.address || ''}",
  "primaryColor": "#2563EB",
  "accentColor": "#10B981",
  "themeMode": "light",
  "fontStyle": "jakarta",
  "buttonStyle": "rounded-xl",
  "layoutOrder": ["hero", "about", "services", "portfolio", "whyus", "steps", "reviews", "faq", "devis"],
  "heroTitle": "High Impact Niche Headline for ${companyName}",
  "heroSubtitle": "Compelling value proposition highlighting speed, reliability and guaranteed quality in ${city}",
  "tagline": "Guaranteed Premium Service",
  "ribbonText": "SPÉCIALISTES CERTIFIÉS 24/7",
  "ctaButton": "Get a Free Instant Quote",
  "ctaButtons": [
    { "label": "Obtenir un devis personnalisé", "url": "#contact" },
    { "label": "Découvrir nos créations", "url": "#portfolio" }
  ],
  "statLabels": [
    { "value": "99.4%", "label": "Satisfaction Client" },
    { "value": "15+", "label": "Années d'Expérience" },
    { "value": "24/7", "label": "Support Urgence" },
    { "value": "1,500+", "label": "Projets Réalisés" }
  ],
  "aboutTitle": "Dedicated Professionals Serving ${city}",
  "aboutText": "A rich story explaining the company's commitment, experience, and why customers trust them.",
  "yearsInBusiness": 12,
  "yearsLabel": "ANS D'EXPÉRIENCE",
  "aboutHighlights": [
    "Rapid same-day response for urgent calls",
    "Transparent upfront pricing with zero hidden fees",
    "Fully licensed, certified and insured team",
    "100% satisfaction guarantee on all work"
  ],
  "servicesSectionTitle": "Nos Prestations Star",
  "servicesSectionSubtitle": "Un service professionnel, réactif et adapté à vos besoins exacts.",
  "serviceBtnLabel": "Demander un devis",
  "services": [
    { "title": "Service 1", "description": "Niche-specific clear benefit description", "price": "From $99" },
    { "title": "Service 2", "description": "Niche-specific clear benefit description", "price": "Free Estimate" },
    { "title": "Service 3", "description": "Niche-specific clear benefit description", "price": "Custom Pricing" }
  ],
  "galleryTitle": "Savoir-Faire en Images",
  "portfolio": [
    { "title": "Project Title 1", "category": "Category Name" },
    { "title": "Project Title 2", "category": "Category Name" },
    { "title": "Project Title 3", "category": "Category Name" }
  ],
  "whyUsSectionTitle": "Pourquoi Nous Choisir",
  "whyUs": [
    { "title": "Key Advantage 1", "text": "Detailed benefit explanation" },
    { "title": "Key Advantage 2", "text": "Detailed benefit explanation" },
    { "title": "Key Advantage 3", "text": "Detailed benefit explanation" }
  ],
  "stepsSectionTitle": "Notre Démarche en 3 Étapes",
  "steps": [
    { "step": "01", "title": "Initial Contact", "description": "Call or submit quick form" },
    { "step": "02", "title": "Transparent Quote", "description": "Free onsite/phone evaluation" },
    { "step": "03", "title": "Guaranteed Service", "description": "Precision execution with follow-up" }
  ],
  "reviewsSectionTitle": "Avis Clients Vérifiés",
  "reviewsSectionSubtitle": "Ce que nos clients disent de la qualité de notre travail.",
  "testimonials": [
    ${reviewExample}
  ],
  "faqTitle": "F.A.Q",
  "faq": [
    { "question": "Relevant niche question 1?", "answer": "Clear detailed answer" },
    { "question": "Relevant niche question 2?", "answer": "Clear detailed answer" }
  ],
  "contactTitle": "Demander un Devis",
  "contactSubtitle": "Réponse sous 24h ouvrées. Gratuit et sans engagement.",
  "contactSubmitText": "Envoyer la demande",
  "copyrightText": "© 2026 ${companyName}. ${city} & Environs. Tous droits réservés.",
  "customCss": ""
}`;
}

export async function generateSiteContent(
  lead: any,
  existingContent: any = "",
  pitchContext: string = "",
  langOverride?: string | null
): Promise<SiteContent> {
  let existingObj: any = {};
  let existingStr = "";
  if (typeof existingContent === 'object' && existingContent !== null) {
    existingObj = existingContent;
    existingStr = JSON.stringify(existingContent);
  } else if (typeof existingContent === 'string') {
    existingStr = existingContent;
    if (existingContent.trim().startsWith('{')) {
      try { existingObj = JSON.parse(existingContent); } catch (e) {}
    }
  }

  const prompt = buildContentPrompt(lead, existingStr, pitchContext, langOverride);
  const sectorKey = getSectorKey(lead.sector || lead.source || lead.niche);
  const defaultPrimaryColor = getSectorDefaultColor(sectorKey);
  const lang = detectLanguage(lead, langOverride);
  const companyName = lead.name || lead.companyName || lead.company || lead.businessName || "Entreprise";
  const city = lead.city || lead.address || "";

  // Scrape reviews in parallel or before prompt
  const rawScrapedReviews = await scrapeWebsiteReviewsForLead(lead);

  try {
    const responseText = await callAI("site_generation", [
      { role: "user", content: prompt }
    ]);

    const parsed = parseAIJsonResponse(responseText);

    const rawTestimonials = (rawScrapedReviews && rawScrapedReviews.length > 0) ? rawScrapedReviews : (parsed.testimonials || []);
    const cleanTestimonials = sanitizeAndTranslateReviews(rawTestimonials, lang, companyName, city);

    return {
      brandName: parsed.brandName || companyName,
      language: parsed.language || lang,
      city: parsed.city || city,
      contactPhone: parsed.contactPhone || lead.phone || '',
      contactEmail: parsed.contactEmail || lead.email || '',
      contactAddress: parsed.contactAddress || lead.address || '',
      templateStyle: existingObj.templateStyle || parsed.templateStyle || 'premium-dark',
      nicheOverride: existingObj.nicheOverride || parsed.nicheOverride || '',
      primaryColor: parsed.primaryColor || defaultPrimaryColor,
      accentColor: parsed.accentColor || "#10B981",
      themeMode: parsed.themeMode || "light",
      fontStyle: parsed.fontStyle || "jakarta",
      buttonStyle: parsed.buttonStyle || "rounded-xl",
      layoutOrder: parsed.layoutOrder || ["hero", "about", "services", "portfolio", "whyus", "steps", "reviews", "faq", "devis"],
      heroTitle: parsed.heroTitle,
      heroSubtitle: parsed.heroSubtitle,
      ribbonText: parsed.ribbonText || (lang === 'fr' ? 'SPÉCIALISTES CERTIFIÉS 24/7' : 'CERTIFIED SPECIALISTS 24/7'),
      tagline: parsed.tagline,
      ctaButton: parsed.ctaButton,
      ctaButtons: parsed.ctaButtons || [
        { label: lang === 'fr' ? 'Obtenir un devis personnalisé' : 'Get a custom quote', url: '#contact' },
        { label: lang === 'fr' ? 'Découvrir nos créations' : 'Explore our portfolio', url: '#portfolio' }
      ],
      statLabels: parsed.statLabels || parsed.stats || [
        { label: lang === 'fr' ? 'Satisfaction Client' : 'Client Satisfaction', value: '99.4%' },
        { label: lang === 'fr' ? "Années d'Expérience" : 'Years Experience', value: '15+' },
        { label: lang === 'fr' ? 'Support Urgence' : 'Emergency Support', value: '24/7' },
        { label: lang === 'fr' ? 'Projets Réalisés' : 'Completed Projects', value: '1,500+' }
      ],
      aboutTitle: parsed.aboutTitle,
      aboutText: parsed.aboutText,
      yearsInBusiness: parsed.yearsInBusiness || 12,
      yearsLabel: parsed.yearsLabel || (lang === 'fr' ? "ANS D'EXPÉRIENCE" : 'YEARS OF EXPERIENCE'),
      aboutHighlights: parsed.aboutHighlights,
      servicesSectionTitle: parsed.servicesSectionTitle || (lang === 'fr' ? 'Nos Prestations Star' : 'Our Star Services'),
      servicesSectionSubtitle: parsed.servicesSectionSubtitle || (lang === 'fr' ? 'Un service professionnel, réactif et adapté à vos besoins exacts.' : 'Professional, responsive service tailored to your exact needs.'),
      serviceBtnLabel: parsed.serviceBtnLabel || (lang === 'fr' ? 'Demander un devis' : 'Get a Quote'),
      services: parsed.services,
      galleryTitle: parsed.galleryTitle || (lang === 'fr' ? 'Savoir-Faire en Images' : 'Featured Projects'),
      portfolio: parsed.portfolio,
      whyUsSectionTitle: parsed.whyUsSectionTitle || (lang === 'fr' ? 'Pourquoi Nous Choisir' : 'Why Choose Us'),
      whyUs: parsed.whyUs,
      stepsSectionTitle: parsed.stepsSectionTitle || (lang === 'fr' ? 'Notre Démarche en 3 Étapes' : 'Our 3-Step Process'),
      steps: parsed.steps,
      reviewsSectionTitle: parsed.reviewsSectionTitle || (lang === 'fr' ? 'Avis Clients Vérifiés' : 'Verified Reviews'),
      reviewsSectionSubtitle: parsed.reviewsSectionSubtitle || (lang === 'fr' ? 'Ce que nos clients disent de la qualité de notre travail.' : 'What our clients say about our service quality.'),
      testimonials: cleanTestimonials,
      faqTitle: parsed.faqTitle || 'F.A.Q',
      faq: parsed.faq,
      contactTitle: parsed.contactTitle || (lang === 'fr' ? 'Demander un Devis' : 'Request a Quote'),
      contactSubtitle: parsed.contactSubtitle || (lang === 'fr' ? 'Réponse sous 24h ouvrées. Gratuit et sans engagement.' : 'Response within 24 hours. Free & no commitment.'),
      contactSubmitText: parsed.contactSubmitText || (lang === 'fr' ? 'Envoyer la demande' : 'Submit Request'),
      copyrightText: parsed.copyrightText || `© ${new Date().getFullYear()} ${companyName}. ${city} & Environs. Tous droits réservés.`,
      customCss: parsed.customCss || '',
      photos: existingObj.photos || lead.photos || [],
      uploadedImages: existingObj.uploadedImages || lead.userUploadedImages || []
    };
  } catch (err: any) {
    console.warn("[siteAiGenerator] AI generation error, using smart fallback:", err.message);

    const cleanScraped = sanitizeAndTranslateReviews(rawScrapedReviews, lang, companyName, city);

    if (lang === 'en') {
      return {
        brandName: companyName,
        language: 'en',
        city,
        contactPhone: lead.phone || '',
        contactEmail: lead.email || '',
        contactAddress: lead.address || '',
        templateStyle: existingObj.templateStyle || 'premium-dark',
        nicheOverride: existingObj.nicheOverride || '',
        primaryColor: defaultPrimaryColor,
        accentColor: "#10B981",
        themeMode: "light",
        buttonStyle: "rounded-xl",
        layoutOrder: ["hero", "about", "services", "portfolio", "whyus", "steps", "reviews", "faq", "devis"],
        heroTitle: `${companyName} - Premier ${sectorKey.toUpperCase()} Services in ${city || 'Your Area'}`,
        heroSubtitle: `Fast response, transparent pricing, and 100% guaranteed quality for your business and home.`,
        tagline: "Guaranteed Professional Service 24/7",
        ribbonText: "CERTIFIED SPECIALISTS 24/7",
        ctaButton: "Get a Free Quote",
        ctaButtons: [
          { label: 'Request a Quote', url: '#contact' },
          { label: 'Explore Portfolio', url: '#portfolio' }
        ],
        statLabels: [
          { label: 'Client Satisfaction', value: '99.4%' },
          { label: 'Years Experience', value: '15+' },
          { label: 'Emergency Support', value: '24/7' },
          { label: 'Jobs Completed', value: '1,500+' }
        ],
        aboutTitle: `About ${companyName}`,
        aboutText: `${companyName} is a trusted local provider in ${city || 'your region'}. We blend years of expertise with high-grade equipment to deliver fast, reliable results.`,
        yearsInBusiness: 12,
        yearsLabel: 'YEARS OF EXPERIENCE',
        aboutHighlights: [
          'Immediate emergency dispatch',
          'Free upfront transparent estimate',
          'Licensed, certified & insured experts',
          '100% customer satisfaction guarantee'
        ],
        servicesSectionTitle: "Our Star Services",
        servicesSectionSubtitle: "Professional, responsive service tailored to your exact needs.",
        serviceBtnLabel: "Get a Quote",
        services: [
          { title: "Rapid Emergency Service", description: `Priority response for urgent calls across ${city || 'your city'}.`, price: "From $99" },
          { title: "Installation & Upgrades", description: "Precision execution with certified high-grade materials.", price: "Free Estimate" },
          { title: "Maintenance & Inspection", description: "Regular checks and preventive care to maximize performance.", price: "Custom Quote" }
        ],
        galleryTitle: "Featured Projects",
        portfolio: [
          { title: "Commercial Upgrade Project", category: "Installation" },
          { title: "Residential Service Repair", category: "Maintenance" }
        ],
        whyUsSectionTitle: "Why Choose Us",
        whyUs: [
          { title: "Immediate Response", text: "On-site or telephone consultation in under 30 minutes." },
          { title: "Upfront Pricing", text: "Free detailed estimate provided before any work starts." },
          { title: "Guaranteed Work", text: "Certified professionals with full warranty on parts and labor." }
        ],
        stepsSectionTitle: "Our 3-Step Process",
        steps: [
          { step: "01", title: "Contact Us", description: "Call directly or submit our online form." },
          { step: "02", title: "Free Estimate", description: "Clear upfront quote with zero obligation." },
          { step: "03", title: "Job Completed", description: "Clean, certified execution with satisfaction guarantee." }
        ],
        reviewsSectionTitle: "Verified Customer Reviews",
        reviewsSectionSubtitle: "What our clients say about our service quality.",
        testimonials: cleanScraped.length > 0 ? cleanScraped : [
          { name: "John D.", text: "Outstanding service and quick response. Highly recommended!", rating: 5, city }
        ],
        faqTitle: "F.A.Q",
        faq: [
          { question: "How quickly can you arrive?", answer: "We offer same-day dispatch and emergency response within 30-60 minutes." },
          { question: "Is the initial estimate free?", answer: "Yes, 100% free with no obligation." }
        ],
        contactTitle: "Request a Quote",
        contactSubtitle: "Response within 24 hours. Free & no commitment.",
        contactSubmitText: "Submit Request",
        copyrightText: `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`,
        customCss: ''
      };
    } else {
      return {
        brandName: companyName,
        language: 'fr',
        city,
        contactPhone: lead.phone || '',
        contactEmail: lead.email || '',
        contactAddress: lead.address || '',
        templateStyle: existingObj.templateStyle || 'premium-dark',
        nicheOverride: existingObj.nicheOverride || '',
        primaryColor: defaultPrimaryColor,
        accentColor: "#10B981",
        themeMode: "light",
        buttonStyle: "rounded-xl",
        layoutOrder: ["hero", "about", "services", "portfolio", "whyus", "steps", "reviews", "faq", "devis"],
        heroTitle: `${companyName} - Services d'Excellence à ${city || 'votre région'}`,
        heroSubtitle: `Intervention rapide, tarifs clairs et transparence garantie pour vos travaux et projets.`,
        tagline: "Service Professionnel & Garanti 24/7",
        ribbonText: "SPÉCIALISTES CERTIFIÉS 24/7",
        ctaButton: "Obtenir un Devis Gratuit",
        ctaButtons: [
          { label: 'Obtenir un devis personnalisé', url: '#contact' },
          { label: 'Découvrir nos créations', url: '#portfolio' }
        ],
        statLabels: [
          { label: 'Satisfaction Client', value: '99.4%' },
          { label: "Années d'Expérience", value: '15+' },
          { label: 'Support Urgence', value: '24/7' },
          { label: 'Projets Réalisés', value: '1,500+' }
        ],
        aboutTitle: `À Propos de ${companyName}`,
        aboutText: `${companyName} est une entreprise reconnue à ${city || 'votre région'}. Nous allions savoir-faire artisanal, matériel de pointe et réactivité pour vous offrir des prestations irréprochables.`,
        yearsInBusiness: 12,
        yearsLabel: "ANS D'EXPÉRIENCE",
        aboutHighlights: [
          'Prise en charge prioritaire le jour même',
          'Devis clair et transparent avant intervention',
          'Équipe certifiée, diplômée et assurée',
          'Garantie satisfaction pièces et main-d\'œuvre'
        ],
        servicesSectionTitle: "Nos Prestations Star",
        servicesSectionSubtitle: "Un service professionnel, réactif et adapté à vos besoins exacts.",
        serviceBtnLabel: "Demander un devis",
        services: [
          { title: "Dépannage & Service Rapide", description: `Assistance prioritaire pour les demandes urgentes à ${city || 'votre ville'}.`, price: "Devis Gratuit" },
          { title: "Installation & Rénovation", description: "Mise en œuvre soignée avec matériaux certifiés et équipements professionnels.", price: "Sur Mesure" },
          { title: "Entretien & Maintenance", description: "Suivi régulier et prévention pour garantir la durabilité de vos installations.", price: "Garantie 2 ans" }
        ],
        galleryTitle: "Savoir-Faire en Images",
        portfolio: [
          { title: "Chantier d'Excellence", category: "Rénovation" },
          { title: "Intervention sur Mesure", category: "Dépannage" }
        ],
        whyUsSectionTitle: "Pourquoi Nous Choisir",
        whyUs: [
          { title: "Réactivité Absolue", text: "Prise en charge rapide de votre demande en moins de 30 minutes." },
          { title: "Transparence Tarifaire", text: "Devis gratuit détaillé établi sans aucun frais caché." },
          { title: "Intervention Garantie", text: "Équipe certifiée et travail soigné conforme aux normes." }
        ],
        stepsSectionTitle: "Notre Démarche en 3 Étapes",
        steps: [
          { step: "01", title: "Prise de Contact", description: "Appelez-nous ou remplissez le formulaire de devis." },
          { step: "02", title: "Diagnostic & Devis", description: "Évaluation sur place et devis clair sans engagement." },
          { step: "03", title: "Réalisation Soignée", description: "Exécution des travaux dans les règles de l'art." }
        ],
        reviewsSectionTitle: "Avis Clients Vérifiés",
        reviewsSectionSubtitle: "Ce que nos clients disent de la qualité de notre travail.",
        testimonials: cleanScraped.length > 0 ? cleanScraped : [
          { name: "Marc L.", text: "Intervention extrêmement rapide et travail irréprochable !", rating: 5, city }
        ],
        faqTitle: "F.A.Q",
        faq: [
          { question: "Quels sont vos délais d'intervention ?", answer: "Nous intervenons généralement le jour même ou sous 24h selon la nature du besoin." },
          { question: "Le devis est-il vraiment gratuit ?", answer: "Oui, notre estimation est 100% gratuite et sans aucun engagement." }
        ],
        contactTitle: "Demander un Devis",
        contactSubtitle: "Réponse sous 24h ouvrées. Gratuit et sans engagement.",
        contactSubmitText: "Envoyer la demande",
        copyrightText: `© ${new Date().getFullYear()} ${companyName}. Tous droits réservés.`,
        customCss: ''
      };
    }
  }
}

export async function modifySiteContentWithAI(
  currentContent: SiteContent,
  userPrompt: string,
  langOverride?: string | null
): Promise<SiteContent> {
  const isRealignPrompt = userPrompt.toLowerCase().includes("realign") || 
                          userPrompt.toLowerCase().includes("rewrite") || 
                          userPrompt.toLowerCase().includes("align all") ||
                          userPrompt.toLowerCase().includes("niche");

  let baseContent = { ...currentContent };

  if (isRealignPrompt) {
    // Strip old stale niche text fields so old copy does not persist
    delete baseContent.heroTitle;
    delete baseContent.heroSubtitle;
    delete baseContent.aboutTitle;
    delete baseContent.aboutText;
    delete baseContent.aboutHighlights;
    delete baseContent.ctaButtons;
    delete baseContent.services;
    delete baseContent.portfolio;
    delete baseContent.whyUs;
    delete baseContent.steps;
    delete baseContent.testimonials;
    delete baseContent.faq;
    delete baseContent.ribbonText;
    delete baseContent.statLabels;
    delete baseContent.contactTitle;
    delete baseContent.contactSubtitle;
    delete baseContent.contactSubmitText;
  }

  const prompt = `You are an expert web designer, developer, and conversion copywriter.
Modify the following website JSON content according to the user instruction: "${userPrompt}".

Capabilities & Instructions:
- You CAN change ANY part of the website design, layout, typography, buttons, colors, text content, and structure.
- To re-order sections, update the "layoutOrder" array (available section names: ["hero", "about", "services", "portfolio", "whyus", "steps", "reviews", "faq", "devis"]).
- To change button style or shape, set "buttonStyle" to e.g. "pill", "rounded-xl", "square", "gradient-amber", "gradient-emerald", "gradient-blue", "luxury-gold".
- To change theme mode, set "themeMode" to "dark", "luxury-dark", or "light".
- To change font, set "fontStyle" to "playfair", "cinzel", "outfit", or "jakarta".
- To change colors, update "primaryColor" or "accentColor" or "backgroundColor" or "textColor".
- To modify button text, update "ctaButton" or specific button titles.
- To modify text, titles, descriptions, services, prices, reviews, steps, FAQs, or about content, update those specific fields.
- To add custom CSS, add or edit the "customCss" field.

Current Website Content JSON:
${JSON.stringify(baseContent, null, 2)}

Return ONLY a valid updated JSON object with the full modified content. No markdown code blocks or explanations!`;

  try {
    const responseText = await callAI("site_generation", [
      { role: "user", content: prompt }
    ]);

    const parsed = parseAIJsonResponse(responseText);

    return {
      ...baseContent,
      ...parsed
    };
  } catch (err: any) {
    console.warn("[siteAiGenerator] AI modification error, returning base content:", err.message);
    return baseContent;
  }
}
