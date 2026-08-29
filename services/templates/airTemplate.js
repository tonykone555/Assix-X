export function buildAirTemplate(lead = {}, content = {}, nicheKey = 'hvac') {
  const companyName = lead.name || lead.companyName || lead.businessName || 'AirPro Services';
  const phone = lead.phone || '(555) 987-6543';
  let primaryColor = content.primaryColor || '#2563EB'; // Blue
  
  let heroImage = content.heroImage || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop';
  let heroTitle = content.heroTitle || 'Your Comfort Is Our Priority';
  let heroSubtitle = content.heroSubtitle || 'Professional services for homes and businesses. From installations to emergency repairs, we keep everything perfect year-round.';
  let aboutText = content.aboutText || 'We are a dedicated team of professionals committed to delivering top-tier services to our community. With years of experience and a passion for excellence, we ensure every job is done right the first time.';
  const heroVideo = content.heroVideo || content.heroVideoUrl || content.videoUrl || null;
  
  // Specific Niche Overrides
  if (nicheKey === 'cakedesign') {
    heroImage = content.heroImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2000&auto=format&fit=crop';
    heroTitle = content.heroTitle || 'Artisanal Cake Design';
    heroSubtitle = content.heroSubtitle || 'Custom cakes for your most special moments. Handcrafted with love, premium ingredients, and exquisite attention to detail.';
    aboutText = content.aboutText || 'We believe every celebration deserves a masterpiece. Our cake designers blend culinary artistry with your unique vision to create breathtaking, delicious custom cakes for weddings, birthdays, and corporate events.';
    if (!content.primaryColor) primaryColor = '#F472B6'; // Pink
  } else if (nicheKey === 'autoecole' || nicheKey === 'driving-school') {
    heroImage = content.heroImage || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop';
    heroTitle = content.heroTitle || 'Learn to Drive with Confidence';
    heroSubtitle = content.heroSubtitle || 'Expert instructors, modern vehicles, and personalized lesson plans to help you pass your driving test and stay safe on the road.';
    aboutText = content.aboutText || 'We are the top-rated driving school in the area, offering patient, comprehensive instruction for drivers of all skill levels.';
  } else if (nicheKey === 'traiteur' || nicheKey === 'restaurant') {
    heroImage = content.heroImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop';
    heroTitle = content.heroTitle || 'Exquisite Culinary Experiences';
    heroSubtitle = content.heroSubtitle || 'From intimate dinners to grand celebrations, our catering team delivers unforgettable flavors and impeccable service.';
    aboutText = content.aboutText || 'Our chefs use only the freshest seasonal ingredients to craft bespoke menus that delight the senses and bring people together.';
  }

  // Parse services
  let services = [
    { title: 'Premium Quality', desc: 'We never compromise on the quality of our materials or ingredients.', img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80' },
    { title: 'Expert Team', desc: 'Our highly trained professionals bring years of experience to every project.', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80' },
    { title: 'Custom Solutions', desc: 'Tailored approaches designed specifically to meet your unique needs and goals.', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' }
  ];
  if (content.services && content.services.length > 0) {
    services = content.services.map((s, i) => ({
      title: s.title || `Service ${i+1}`,
      desc: s.description || 'Professional service offering.',
      img: s.image || services[i%3].img
    }));
  } else if (nicheKey === 'cakedesign') {
    services = [
      { title: 'Wedding Cakes', desc: 'Elegant, multi-tiered masterpieces designed to be the centerpiece of your special day.', img: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80' },
      { title: 'Birthday Creations', desc: 'Fun, vibrant, and personalized cakes that bring joy to any birthday celebration.', img: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=800&q=80' },
      { title: 'Corporate Events', desc: 'Branded treats, cupcakes, and large-scale cakes designed to impress your clients and team.', img: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80' }
    ];
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} - ${nicheKey.toUpperCase()}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  ${content.model3dUrl ? '<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>' : ''}
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #F8FAFC; color: #0F172A; }
    
    .floating-nav {
      position: fixed;
      top: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 50;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 9999px;
      padding: 0.5rem 0.5rem 0.5rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: calc(100% - 2rem);
      max-width: 400px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .hero-section {
      position: relative;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 8rem 1.5rem 4rem;
      border-radius: 0 0 2rem 2rem;
      overflow: hidden;
      background-color: #0F172A;
    }

    .hero-bg-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%);
      z-index: 1;
    }
    
    .hero-content {
      position: relative;
      z-index: 10;
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }

    .btn-primary {
      background-color: ${primaryColor};
      color: white;
      border-radius: 9999px;
      padding: 0.875rem 1.5rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    
    .btn-secondary {
      background-color: rgba(255, 255, 255, 0.9);
      color: #0F172A;
      backdrop-filter: blur(4px);
      border-radius: 9999px;
      padding: 0.875rem 1.5rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .btn-secondary:hover { background-color: #fff; transform: translateY(-1px); }
    
    .section-padding { padding: 5rem 1.5rem; }
    
    .card-rounded {
      background: white;
      border-radius: 1.5rem;
      padding: 2.5rem;
      box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05);
      margin-bottom: 2rem;
      position: relative;
    }
    
    .number-badge {
      width: 3rem;
      height: 3rem;
      background-color: ${primaryColor};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .tag {
      background: white;
      color: #475569;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      display: inline-block;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .card-image-wrap {
      border-radius: 1rem;
      overflow: hidden;
      margin-top: 1.5rem;
      aspect-ratio: 16/9;
      position: relative;
      background: #F1F5F9;
    }
    .card-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
    
    .webild-badge {
      position: absolute;
      bottom: -1rem;
      right: 1.5rem;
      background: white;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      font-size: 0.75rem;
      font-weight: 600;
      color: #0F172A;
      z-index: 10;
    }
    .webild-icon {
      width: 1.5rem; height: 1.5rem; background: ${primaryColor}; border-radius: 0.25rem; display: flex; align-items: center; justify-content: center; color: white;
    }
  </style>
</head>
<body>

  <!-- Floating Nav -->
  <nav class="floating-nav">
    <div class="font-bold text-slate-800 text-lg ml-2">${companyName}</div>
    <a href="tel:${phone.replace(/\D/g,'')}" class="btn-primary py-2 px-4 text-sm" style="background-color: ${primaryColor}">
      Contact
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
    </a>
  </nav>

  <!-- Hero Section -->
  <section class="hero-section">
    <img class="hero-bg-image" id="heroBgImg" data-site-img="heroImage" src="${heroImage}" alt="${companyName}">
    ${heroVideo ? `<video class="hero-bg-image" id="mainHeroVideo" autoplay loop muted playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2;pointer-events:none;"><source src="${heroVideo}" type="video/mp4"></video>` : `<video class="hero-bg-image" id="mainHeroVideo" autoplay loop muted playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2;pointer-events:none;display:none;"></video>`}
    ${content.model3dUrl && content.show3dHero ? `
      <model-viewer 
        class="hero-bg-image" 
        src="${content.model3dUrl}" 
        camera-controls 
        auto-rotate 
        shadow-intensity="1" 
        style="width: 100%; height: 100%; position: absolute; inset: 0; background-color: transparent; z-index: 1;">
      </model-viewer>
    ` : ''}
    <div class="hero-overlay" style="z-index: 2; pointer-events: none; ${content.model3dUrl && content.show3dHero ? 'display: none;' : ''}"></div>
    
    <div class="hero-content">
      <h1 class="text-5xl md:text-6xl font-bold ${content.model3dUrl && content.show3dHero ? 'text-slate-900' : 'text-white'} mb-6 leading-tight tracking-tight">${heroTitle}</h1>
      <p class="text-lg ${content.model3dUrl && content.show3dHero ? 'text-slate-700' : 'text-slate-200'} mb-8 max-w-lg leading-relaxed">${heroSubtitle}</p>
      
      <div class="flex flex-col sm:flex-row gap-4 mb-12">
        <a href="#contact" class="btn-primary justify-center" style="background-color: ${primaryColor}">
          Get Started
          <svg class="w-5 h-5 bg-white/20 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
        <a href="#services" class="btn-secondary justify-center ${content.model3dUrl && content.show3dHero ? 'bg-slate-900 text-white' : ''}">
          Explore Services
          <svg class="w-5 h-5 bg-slate-900/10 rounded-full p-0.5 ${content.model3dUrl && content.show3dHero ? 'text-slate-900 bg-white/20' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
      
      <div class="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full p-2 pr-6 w-fit border border-white/20 ${content.model3dUrl && content.show3dHero ? 'bg-slate-900/10 border-slate-900/20' : ''}">
        <div class="flex -space-x-3">
          <img class="w-10 h-10 rounded-full border-2 border-slate-800 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Customer">
          <img class="w-10 h-10 rounded-full border-2 border-slate-800 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Customer">
          <img class="w-10 h-10 rounded-full border-2 border-slate-800 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Customer">
        </div>
        <div class="text-sm font-semibold ${content.model3dUrl && content.show3dHero ? 'text-slate-900' : 'text-white'} leading-tight">Over 500+<br>happy clients</div>
      </div>
    </div>
  </section>

  <!-- Main Content Wrapper -->
  <div class="max-w-2xl mx-auto px-4 -mt-6 relative z-20 pb-20">
    
    <!-- About Section -->
    <div class="text-center pt-16 pb-10" id="about">
      <div class="tag">About Us</div>
      <h2 class="text-4xl font-bold text-slate-800 mb-4" style="color: ${primaryColor}">Who We Are</h2>
    </div>
    
    <div class="card-rounded">
      <p class="text-slate-600 leading-relaxed text-lg">${aboutText}</p>
    </div>

    <!-- Services / Catalog Section -->
    <div class="text-center pt-10 pb-8" id="services">
      <div class="tag">What We Offer</div>
      <h2 class="text-4xl font-bold text-slate-800 mb-4" style="color: ${primaryColor}">Our Services</h2>
      <p class="text-slate-500 max-w-md mx-auto">Discover how we can help you achieve your goals with our professional offerings.</p>
    </div>

    ${services.map((s, index) => `
    <div class="card-rounded">
      <div class="number-badge" style="background-color: ${primaryColor}">${index + 1}</div>
      <h3 class="text-2xl font-bold text-slate-800 mb-3">${s.title}</h3>
      <p class="text-slate-600 leading-relaxed">${s.desc}</p>
      
      <div class="card-image-wrap">
        ${content.model3dUrl && content.show3dCatalog && index === 0 ? `
          <model-viewer 
            src="${content.model3dUrl}" 
            camera-controls 
            auto-rotate 
            shadow-intensity="1" 
            style="width: 100%; height: 100%; position: absolute; inset: 0;">
          </model-viewer>
        ` : `
          <img id="serviceImg_${index}" data-site-img="serviceImg_${index}" src="${s.img}" alt="${s.title}">
        `}
      </div>
    </div>
    `).join('')}

    <!-- Process Section -->
    <div class="text-center pt-10 pb-8">
      <div class="tag">How It Works</div>
      <h2 class="text-4xl font-bold text-slate-800 mb-4" style="color: ${primaryColor}">Our Simple Process</h2>
    </div>

    <div class="card-rounded">
      <h3 class="text-2xl font-bold text-slate-800 mb-3">1. Initial Consultation</h3>
      <p class="text-slate-500 mb-6 pb-6 border-b border-slate-100">Contact us to discuss your needs and vision. We'll listen carefully and provide initial recommendations.</p>
      
      <h3 class="text-2xl font-bold text-slate-800 mb-3">2. Custom Strategy</h3>
      <p class="text-slate-500 mb-6 pb-6 border-b border-slate-100">We develop a tailored plan and quote specifically designed to meet your requirements.</p>
      
      <h3 class="text-2xl font-bold text-slate-800 mb-3">3. Expert Execution</h3>
      <p class="text-slate-500 pb-2 border-b border-slate-100">Our team delivers the service with precision, ensuring high-quality results on time.</p>
    </div>

    <!-- Testimonials / Reviews -->
    <div class="text-center pt-10 pb-8">
      <div class="tag">Testimonials</div>
      <h2 class="text-4xl font-bold text-slate-800 mb-4" style="color: ${primaryColor}">What They Say</h2>
    </div>

    <div class="card-rounded" style="background-color: #F8FAFC;">
      <div class="flex text-yellow-400 mb-4">
        <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
      </div>
      <p class="text-slate-700 italic mb-4">"Absolutely incredible service. They understood exactly what we wanted and delivered beyond our expectations. Highly recommended!"</p>
      <div class="font-bold text-slate-900">- Sarah Jenkins</div>
    </div>

    <!-- CTA Section -->
    <div class="text-center pt-10 pb-8" id="contact">
      <div class="tag">Get in Touch</div>
      <h2 class="text-4xl font-bold text-slate-800 mb-8" style="color: ${primaryColor}">Ready to get started?</h2>
      
      <div class="flex flex-col gap-4 items-center">
        <a href="tel:${phone.replace(/\D/g,'')}" class="btn-primary w-full max-w-xs justify-center text-lg py-4" style="background-color: ${primaryColor}">
          Get a Free Quote
          <svg class="w-5 h-5 bg-white/20 rounded-full p-0.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
        <a href="tel:${phone.replace(/\D/g,'')}" class="btn-secondary w-full max-w-xs justify-center text-lg py-4 bg-slate-100 text-slate-700 hover:bg-slate-200" style="background-color: #E2E8F0;">
          Call ${phone}
          <svg class="w-5 h-5 bg-slate-300 rounded-full p-0.5 ml-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
      
      <div class="webild-badge" style="position: relative; right: auto; bottom: auto; margin: 3rem auto 0; width: fit-content;">
        <div class="webild-icon" style="background-color: ${primaryColor}">W</div>
        <span>Made with Webild</span>
      </div>
    </div>
    
  </div>

  <!-- Footer -->
  <footer class="text-slate-200 py-12 px-6 rounded-t-3xl text-sm" style="background-color: ${primaryColor}">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-3xl font-bold mb-10 text-white">${companyName}</h2>
      
      <div class="grid grid-cols-2 gap-8 mb-12">
        <div>
          <h4 class="text-white/60 mb-4 font-semibold uppercase tracking-wider text-xs">Menu</h4>
          <ul class="space-y-3">
            <li><a href="#about" class="hover:text-white transition">About Us</a></li>
            <li><a href="#services" class="hover:text-white transition">Services</a></li>
            <li><a href="#contact" class="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white/60 mb-4 font-semibold uppercase tracking-wider text-xs">Contact Info</h4>
          <ul class="space-y-3">
            <li>${phone}</li>
            <li>info@${companyName.replace(/\s/g,'').toLowerCase()}.com</li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/70">
        <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
        <div class="webild-badge" style="position: relative; right: auto; bottom: auto;">
          <div class="webild-icon" style="background-color: ${primaryColor}">W</div>
          <span style="color: #0F172A">Made with Webild</span>
        </div>
      </div>
    </div>
  </footer>

  <script>
  (function() {
    var v = document.getElementById('mainHeroVideo');
    var heroSection = document.querySelector('.hero-section') || document.body;
    var currentEffect = "${content.heroVideoEffect || 'scroll-scrub'}";
    var currentTiming = parseFloat("${content.heroScrollTiming || 1.5}") || 1.5;

    function handleVideoScroll() {
      if (!v) v = document.getElementById('mainHeroVideo');
      if (!v || v.style.display === 'none') return;

      var scrolled = window.scrollY || window.pageYOffset || 0;
      var heroHeight = heroSection ? heroSection.offsetHeight : (window.innerHeight || 600);
      var scrollSpan = Math.max(100, heroHeight * currentTiming);
      var scrollRatio = Math.min(1, Math.max(0, scrolled / scrollSpan));

      if (currentEffect === 'scroll-scrub') {
        try { if (!v.paused) v.pause(); } catch(e) {}
        if (v.duration && !isNaN(v.duration) && v.duration > 0) {
          var targetTime = scrollRatio * (v.duration - 0.05);
          try { v.currentTime = Math.min(v.duration - 0.05, Math.max(0, targetTime)); } catch(e) {}
        }
        v.style.transform = 'scale(' + (1 + scrollRatio * 0.15) + ')';
        v.style.filter = 'brightness(' + (1 - scrollRatio * 0.3) + ')';
      } else if (currentEffect === 'sticky-zoom') {
        try { if (v.paused) v.play().catch(function(){}); } catch(e) {}
        v.style.transform = 'scale(' + (1 + scrollRatio * 0.45) + ')';
        v.style.filter = 'brightness(' + (1 - scrollRatio * 0.35) + ') blur(' + (scrollRatio * 6) + 'px)';
      } else if (currentEffect === 'parallax-fade') {
        try { if (v.paused) v.play().catch(function(){}); } catch(e) {}
        v.style.transform = 'translateY(' + (scrolled * 0.35) + 'px)';
        v.style.opacity = Math.max(0.1, 1 - scrollRatio * 0.8);
      } else if (currentEffect === '3d-tilt') {
        try { if (v.paused) v.play().catch(function(){}); } catch(e) {}
        v.style.transform = 'perspective(1000px) rotateX(' + (scrollRatio * 20) + 'deg) scale(' + (1 + scrollRatio * 0.1) + ')';
      } else {
        try { if (v.paused) v.play().catch(function(){}); } catch(e) {}
        v.style.transform = 'none';
        v.style.filter = 'none';
        v.style.opacity = '1';
      }
    }

    window.addEventListener('scroll', handleVideoScroll, { passive: true });
    if (v) {
      v.addEventListener('loadedmetadata', handleVideoScroll);
      v.addEventListener('canplay', handleVideoScroll);
    }

    window.addEventListener('message', function(e) {
      if (!e || !e.data) return;
      var d = e.data;
      if (d.type === 'UPDATE_IMAGE' && d.url) {
        var f = d.field;
        if (f === 'hero' || f === 'heroImage') {
          var h = document.getElementById('heroBgImg');
          if (h) h.src = d.url;
        }
        var targetEl = document.getElementById(f) || document.querySelector('[data-site-img="' + f + '"]');
        if (targetEl && targetEl.tagName === 'IMG') {
          targetEl.src = d.url;
        }
      }
      if ((d.type === 'PINTEREST_PHOTOS' || d.type === 'UPDATE_ALL_PHOTOS') && Array.isArray(d.photos) && d.photos.length > 0) {
        if (d.photos[0]) {
          var h = document.getElementById('heroBgImg');
          if (h) h.src = d.photos[0];
        }
        d.photos.forEach(function(pUrl, idx) {
          if (idx > 0) {
            var sEl = document.getElementById('serviceImg_' + (idx - 1));
            if (sEl) sEl.src = pUrl;
          }
        });
      }
      if (d.type === 'UPDATE_VIDEO' || d.type === 'UPDATE_HERO_VIDEO' || d.heroVideo || d.heroVideoUrl || d.videoUrl) {
        var url = d.url || d.videoUrl || d.heroVideo || d.heroVideoUrl;
        if (d.heroVideoEffect) currentEffect = d.heroVideoEffect;
        if (d.heroScrollTiming) currentTiming = parseFloat(d.heroScrollTiming) || 1.5;

        if (url) {
          if (!v) {
            v = document.createElement('video');
            v.id = 'mainHeroVideo';
            v.className = 'hero-bg-image';
            v.autoplay = true;
            v.loop = true;
            v.muted = true;
            v.playsInline = true;
            v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2;pointer-events:none;transition:transform 0.1s linear, filter 0.1s linear, opacity 0.1s linear;';
            var parent = heroSection || document.body;
            parent.insertBefore(v, parent.firstChild);
          }
          v.style.display = 'block';
          v.style.opacity = '1';
          var srcEl = v.querySelector('source');
          if (srcEl) srcEl.src = url;
          else v.src = url;
          v.load();
          setTimeout(handleVideoScroll, 150);
        }
      }
    });
  })();
  </script>
</body>
</html>`;
}
