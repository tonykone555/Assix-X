export function buildLuminaTemplate(lead = {}, content = {}, nicheKey = 'fashion') {
  const companyName = lead.name || lead.companyName || lead.businessName || content.brandName || 'LUMINA';
  const phone = lead.phone || '+33 1 42 68 55 00';
  const email = lead.email || 'contact@' + (companyName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'lumina-store') + '.com';
  const city = lead.city || 'Paris';
  
  const market = (lead.market || lead.country || '').toLowerCase();
  const lang = (content.langOverride || (market.includes('english') || market.includes('uk') || market.includes('us') ? 'en' : 'fr')).toLowerCase();
  const isFr = lang.startsWith('fr');

  const activeNiche = (nicheKey || lead.niche || lead.sector || 'fashion').toLowerCase();
  
  const isBeauty = activeNiche.includes('beaut') || activeNiche.includes('skin') || activeNiche.includes('cosmet') || activeNiche.includes('soin');
  const isHair = activeNiche.includes('hair') || activeNiche.includes('wig') || activeNiche.includes('cheveu') || activeNiche.includes('perruq');
  const isEyewear = activeNiche.includes('eye') || activeNiche.includes('glass') || activeNiche.includes('opti') || activeNiche.includes('lunet');
  const isJewelry = activeNiche.includes('jewel') || activeNiche.includes('bijou') || activeNiche.includes('gold') || activeNiche.includes('or');

  // Hero default images & headings by niche
  let heroImg = content.heroImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80';
  let heroTitle = isFr 
    ? (content.heroTitle || `L'Élégance Redéfinie Pour Votre Style Moderne`)
    : (content.heroTitle || `Elegance Redefined For Modern Living`);
  let heroSubtitle = isFr 
    ? (content.heroSubtitle || `Découvrez nos collections exclusives avec essayage virtuel par IA en direct sur votre photo.`)
    : (content.heroSubtitle || `Discover curated luxury collections. Experience real-time AI Virtual Try-On on your own photo.`);

  if (isBeauty) {
    heroImg = content.heroImage || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80';
    heroTitle = isFr ? `Révélez Votre Éclat Naturel & Soins Botaniques` : `Unveil Your Radiant Glow With Botanical Skincare`;
    heroSubtitle = isFr ? `Formules végétales cliniquement prouvées pour sublimer votre profil de peau.` : `Clinical vegan formulations engineered to restore and elevate your natural skin profile.`;
  } else if (isHair) {
    heroImg = content.heroImage || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1600&q=80';
    heroTitle = isFr ? `Perruques HD Lace & Extensions Capillaires` : `Premium HD Lace Wigs & Silk Extensions`;
    heroSubtitle = isFr ? `Cheveux 100% humains vierges. Essayez chaque coupe en direct sur votre photo.` : `100% Virgin human hair extensions & seamless lace wigs. Test every style live on your selfie using AI.`;
  } else if (isEyewear) {
    heroImg = content.heroImage || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=80';
    heroTitle = isFr ? `Montures Architecturale & Lunettes Designer` : `Architectural Eyewear & Designer Sunglasses`;
    heroSubtitle = isFr ? `Design avant-gardiste et protection UV400. Ajustement IA instantané sur votre visage.` : `Precision acetate frames & UV400 lenses. Instant AI face fitting simulation.`;
  } else if (isJewelry) {
    heroImg = content.heroImage || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80';
    heroTitle = isFr ? `Joaillerie Fine & Pièces Signatures Or 18K` : `Fine Jewelry & 18k Gold Signature Creations`;
    heroSubtitle = isFr ? `Élégance intemporelle pour chaque occasion. Essayez nos bijoux en réalité augmentée.` : `Timeless artisan jewelry crafted for daily elegance. Try necklaces and rings live in augmented AI.`;
  }

  // Pre-configured Niche Products Collections for dropshippers
  const nicheProductsDatabase = {
    fashion: [
      {
        id: 'f1',
        title: isFr ? 'Robe Longue Soie Florale' : 'Floral Silk Maxi Dress',
        price: 89.90,
        oldPrice: 129.00,
        category: 'fashion',
        badge: isFr ? 'Meilleure Vente' : 'Best Seller',
        img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Coupe fluide en soie naturelle avec imprimé botanique délicat. Idéale pour les soirées.' : 'Flowing natural silk silhouette with delicate botanical motif. Perfect for summer galas.',
        tryonCat: 'fashion',
        rating: '4.9/5'
      },
      {
        id: 'f2',
        title: isFr ? 'Veste Blazer Structurée Oversize' : 'Structured Oversized Blazer Jacket',
        price: 110.00,
        oldPrice: 150.00,
        category: 'fashion',
        badge: isFr ? 'Nouveauté' : 'New Arrival',
        img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Épaulettes affirmées et coupe masculine élégante en laine mélangée.' : 'Sharp shoulder pads and refined tailoring crafted from lightweight wool blend.',
        tryonCat: 'fashion',
        rating: '4.8/5'
      },
      {
        id: 'f3',
        title: isFr ? 'Ensemble Manteau Cashmere Trench' : 'Cashmere Minimal Trench Coat',
        price: 165.00,
        oldPrice: 220.00,
        category: 'fashion',
        badge: isFr ? 'Édition Limitée' : 'Limited Edition',
        img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Laine et cachemire ultra-doux avec ceinture ajustée et col châle.' : 'Luxurious cashmere wool mix featuring detachable sash belt and lapel collar.',
        tryonCat: 'fashion',
        rating: '4.95/5'
      },
      {
        id: 'f4',
        title: isFr ? 'Ensemble Tailleur Satin Champagne' : 'Champagne Satin Tailored Set',
        price: 125.00,
        oldPrice: 175.00,
        category: 'fashion',
        badge: isFr ? 'Tendance' : 'Trending',
        img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Fluidité satinée et finitions boutonnées dorées pour un style raffiné.' : 'Fluid satin drape paired with tailored high-waist trousers.',
        tryonCat: 'fashion',
        rating: '4.85/5'
      }
    ],
    beauty: [
      {
        id: 'b1',
        title: isFr ? 'Sérum Éclat Vitamine C & Hyaluronique' : 'Vitamin C & Hyaluronic Glow Serum',
        price: 45.00,
        oldPrice: 65.00,
        category: 'beauty',
        badge: 'Vegan & Bio',
        img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Sérum repulpant hydratant intense booster de collagène et réducteur de taches.' : 'Intense plumping serum engineered to boost natural collagen and fade hyperpigmentation.',
        tryonCat: 'beauty',
        rating: '4.92/5'
      },
      {
        id: 'b2',
        title: isFr ? 'Huile Botanique Réparatrice Nuit' : 'Botanical Night Repair Facial Oil',
        price: 52.00,
        oldPrice: 75.00,
        category: 'beauty',
        badge: isFr ? 'Soin Intensif' : 'Intensive Care',
        img: 'https://images.unsplash.com/photo-1608248597261-83325805435f?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Mélange d\'huiles rares de rose musquée et jojoba pour une régénération nocturne.' : 'Rare blend of cold-pressed rosehip and jojoba oils for overnight cellular renewal.',
        tryonCat: 'beauty',
        rating: '4.9/5'
      },
      {
        id: 'b3',
        title: isFr ? 'Baume Hydratant Lèvres au Beurre de Rose' : 'Rose Butter Ultra Hydrating Lip Balm',
        price: 24.00,
        oldPrice: 32.00,
        category: 'beauty',
        badge: isFr ? 'Essentiel' : 'Daily Essential',
        img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Nourrit intensément et apporte une brillance rosée naturelle.' : 'Deeply restorative lip butter providing long-lasting hydration and subtle sheen.',
        tryonCat: 'beauty',
        rating: '4.88/5'
      }
    ],
    hair: [
      {
        id: 'h1',
        title: isFr ? 'Perruque Bob Carré HD Lace Platine' : 'Platinum HD Lace Bob Wig',
        price: 149.00,
        oldPrice: 199.00,
        category: 'hair',
        badge: isFr ? 'Essayage IA' : 'AI Try-On',
        img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Dentelle suisse invisible HD Lace, cheveux 100% humains vierges ultra-lisses.' : 'Swiss invisible HD lace front, pre-plucked 100% virgin human hair with ultra-sleek finish.',
        tryonCat: 'hair',
        rating: '4.95/5'
      },
      {
        id: 'h2',
        title: isFr ? 'Perruque Ondulée HD Lace Châtain Miel' : 'Honey Blonde HD Lace Body Wave Wig',
        price: 179.00,
        oldPrice: 240.00,
        category: 'hair',
        badge: isFr ? 'Top Ventes' : 'Top Seller',
        img: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Volume naturel et brillance soyeuse. Dentelle transparente indétectable.' : 'Lush natural body wave pattern crafted with HD transparent lace base.',
        tryonCat: 'hair',
        rating: '4.91/5'
      },
      {
        id: 'h3',
        title: isFr ? 'Extensions Clips Cheveux Lisses 24 Pouces' : '24-Inch Straight Clip-In Silk Extensions',
        price: 99.00,
        oldPrice: 140.00,
        category: 'hair',
        badge: isFr ? 'Pose Facile' : 'Easy Clip',
        img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Ajoutez de la longueur et du volume en 2 minutes sans abîmer vos cheveux.' : 'Instant length and volume in 7 seamless human hair tracks.',
        tryonCat: 'hair',
        rating: '4.86/5'
      }
    ],
    eyewear: [
      {
        id: 'e1',
        title: isFr ? 'Lunettes de Soleil Aviateur Or 18K' : '18k Gold Aviator Sunglasses',
        price: 119.00,
        oldPrice: 159.00,
        category: 'eyewear',
        badge: 'UV400 Polarized',
        img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Monture légère plaquée or avec verres minéraux polarisés antireflet.' : 'Ultralight gold-plated alloy frame featuring anti-glare polarized mineral lenses.',
        tryonCat: 'eyewear',
        rating: '4.94/5'
      },
      {
        id: 'e2',
        title: isFr ? 'Monture Optique Acétate Écaille Ovale' : 'Oval Tortoiseshell Acetate Optical Frames',
        price: 95.00,
        oldPrice: 130.00,
        category: 'eyewear',
        badge: isFr ? 'Filtre Lumière Bleue' : 'Blue Light Filter',
        img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Monture sculptée à la main en acétate haut de gamme avec verres anti-fatigue.' : 'Hand-sculpted premium Japanese acetate frames with blue-light coating.',
        tryonCat: 'eyewear',
        rating: '4.89/5'
      }
    ],
    jewelry: [
      {
        id: 'j1',
        title: isFr ? 'Collier Chaîne Maille Royale Or 18K' : '18k Gold Royal Chain Necklace',
        price: 135.00,
        oldPrice: 180.00,
        category: 'jewelry',
        badge: isFr ? 'Édition Limitée' : 'Limited Edition',
        img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Maillons forgés à la main résistants à l\'eau et hypoallergéniques.' : 'Hand-forged hypoallergenic links engineered to resist water and tarnish.',
        tryonCat: 'jewelry',
        rating: '4.96/5'
      },
      {
        id: 'j2',
        title: isFr ? 'Bague Solitaire Zirconia & Or Rose' : 'Rose Gold Zirconia Solitaire Ring',
        price: 85.00,
        oldPrice: 115.00,
        category: 'jewelry',
        badge: isFr ? 'Intemporel' : 'Timeless',
        img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Bande fine en or rose sertie d\'un cristal à taille brillant de qualité supérieure.' : 'Dainty rose-gold band set with brilliant-cut sparkling solitaire crystal.',
        tryonCat: 'jewelry',
        rating: '4.92/5'
      }
    ],
    home: [
      {
        id: 'h1_home',
        title: isFr ? 'Diffuseur d\'Arômes en Céramique Grise' : 'Minimalist Slate Ceramic Aroma Diffuser',
        price: 68.00,
        oldPrice: 92.00,
        category: 'home',
        badge: isFr ? 'Maison & Bien-être' : 'Home Wellness',
        img: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80',
        desc: isFr ? 'Technologie ultrasonique silencieuse avec éclairage d\'ambiance chaleureux.' : 'Ultrasonic quiet diffuser with ambient warm LED light ring.',
        tryonCat: 'home',
        rating: '4.88/5'
      }
    ]
  };

  // Combine default initial catalog
  let initialProducts = [
    ...nicheProductsDatabase.fashion,
    ...nicheProductsDatabase.hair,
    ...nicheProductsDatabase.beauty,
    ...nicheProductsDatabase.eyewear,
    ...nicheProductsDatabase.jewelry
  ];

  if (Array.isArray(content.products) && content.products.length > 0) {
    initialProducts = content.products.map((p, idx) => ({
      id: `custom_${idx}`,
      title: p.title || p.name || `Product ${idx+1}`,
      price: Number(p.price) || 89.90,
      oldPrice: Number(p.oldPrice) || 120.00,
      category: p.category || activeNiche,
      badge: p.badge || (idx === 0 ? 'Best Seller' : 'AI Try-On'),
      img: p.image || p.img || initialProducts[idx % initialProducts.length].img,
      desc: p.description || p.desc || 'Premium quality dropshipping product.',
      tryonCat: p.tryonCat || activeNiche,
      rating: '4.9/5'
    }));
  }

  return `<!doctype html>
<html lang="${isFr ? 'fr' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${companyName} — Universal E-commerce Storefront with AI Virtual Try-On Studio.">
  <title>${companyName} — ${isFr ? 'Boutique E-Commerce & Essayage Virtuel IA' : 'Universal E-commerce Storefront & AI Virtual Try-On'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background: #f7f6f3;
      color: #151515;
      font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow-x: hidden;
      padding-bottom: 70px;
    }

    button, a, input, select { font-family: inherit; }
    button { cursor: pointer; }
    a { text-decoration: none; color: inherit; }

    /* ANNOUNCEMENT BAR */
    .announcement {
      height: 36px;
      background: #111111;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      letter-spacing: .06em;
      text-transform: uppercase;
      font-weight: 600;
      padding: 0 16px;
    }

    /* HEADER */
    .header {
      height: 72px;
      background: rgba(255,255,255,.96);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 clamp(20px, 5vw, 70px);
      border-bottom: 1px solid #e7e4de;
      position: sticky;
      top: 0;
      z-index: 40;
    }

    .logo {
      font-size: 19px;
      letter-spacing: .22em;
      font-weight: 800;
      color: #111;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .logo span { color: #8c765c; }

    .desktop-nav {
      display: flex;
      gap: 28px;
      margin: auto;
      font-size: 13px;
      font-weight: 600;
    }
    .desktop-nav a { transition: color .2s; color: #444; }
    .desktop-nav a:hover, .desktop-nav a.active { color: #111; }

    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .icon-btn, .menu-btn {
      border: 1px solid #e5e2dc;
      background: #fff;
      padding: 8px 14px;
      border-radius: 8px;
      position: relative;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
      transition: all 0.2s;
    }
    .icon-btn:hover, .menu-btn:hover { background: #f0efec; border-color: #d8d4cd; }

    .cart-icon #cartCount {
      background: #111;
      color: #fff;
      border-radius: 99px;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 7px;
      margin-left: 2px;
    }

    .menu-btn { display: none; }

    /* HERO */
    .hero {
      max-width: 1400px;
      margin: 20px auto 0;
      padding: 0 20px;
    }

    .hero-card {
      min-height: 560px;
      border-radius: 24px;
      overflow: hidden;
      position: relative;
      background: linear-gradient(110deg, #f2ece3 0%, #e6dccf 55%, #d9ccbc 100%);
      display: flex;
      align-items: center;
      border: 1px solid #e2ddd5;
    }

    .hero-art {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 75% 40%, rgba(255,255,255,0.7), transparent 35%);
    }

    .hero-art:after {
      content: "";
      position: absolute;
      width: 360px;
      height: 440px;
      border-radius: 20px;
      background: url('${heroImg}') center/cover no-repeat;
      right: 8%;
      bottom: 6%;
      box-shadow: 0 25px 50px rgba(0,0,0,0.14);
      border: 4px solid rgba(255,255,255,0.8);
      transition: background 0.4s ease;
    }

    .hero-copy {
      position: relative;
      z-index: 2;
      width: min(560px, 55%);
      padding: clamp(35px, 6vw, 80px);
    }

    .eyebrow {
      font-size: 11px;
      letter-spacing: .15em;
      text-transform: uppercase;
      font-weight: 800;
      color: #4a3e33;
      margin-bottom: 16px;
      display: inline-flex;
      align-items: center;
      background: rgba(255,255,255,0.75);
      padding: 5px 14px;
      border-radius: 99px;
      border: 1px solid rgba(255,255,255,0.9);
    }

    .hero h1 {
      font-size: clamp(36px, 4.5vw, 60px);
      line-height: 1.08;
      font-weight: 800;
      margin: 0 0 20px;
      letter-spacing: -.03em;
      color: #111;
    }

    .hero p {
      max-width: 460px;
      line-height: 1.65;
      font-size: 14px;
      color: #444;
      font-weight: 500;
    }

    .hero-actions {
      display: flex;
      gap: 12px;
      margin-top: 28px;
      flex-wrap: wrap;
    }

    .primary {
      border: 0;
      background: #111111;
      color: #ffffff;
      padding: 14px 26px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      transition: all .2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .primary:hover {
      background: #282828;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }

    .secondary {
      border: 1px solid #d4d0c8;
      background: #ffffff;
      color: #111111;
      padding: 14px 24px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      transition: all .2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .secondary:hover {
      background: #f4f2ee;
      border-color: #b8b4ab;
    }

    /* TRUST ROW */
    .trust-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      max-width: 1400px;
      margin: 0 auto;
      padding: 22px 34px;
      background: #ffffff;
      border-bottom: 1px solid #e7e4de;
    }

    .trust-item {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #eeeae4;
      padding: 0 16px;
    }
    .trust-item:last-child { border: 0; }
    .trust-item b { display: block; font-size: 13px; color: #111; font-weight: 700; }
    .trust-item small { color: #666; font-size: 11px; font-weight: 500; }

    /* SECTIONS */
    .section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 60px 24px;
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .section h2 {
      font-size: 32px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -.02em;
      color: #111;
    }

    .section-head p {
      font-size: 13px;
      color: #666;
      margin: 4px 0 0;
      font-weight: 500;
    }

    /* NICHE SELECTOR BAR */
    .niche-selector-bar {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 12px;
      margin-bottom: 28px;
      border-bottom: 1px solid #e5e2db;
      scrollbar-width: none;
    }
    .niche-selector-bar::-webkit-scrollbar { display: none; }

    .niche-pill {
      border: 1px solid #dcd8d0;
      background: #ffffff;
      color: #333333;
      padding: 10px 20px;
      border-radius: 99px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .niche-pill:hover, .niche-pill.active {
      background: #111111;
      color: #ffffff;
      border-color: #111111;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    /* PRODUCTS GRID */
    .products {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }

    .product-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 14px;
      position: relative;
      overflow: hidden;
      transition: all .25s;
      border: 1px solid #e7e4de;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(0,0,0,.07);
    }

    .product-image {
      aspect-ratio: 1/1.1;
      border-radius: 12px;
      overflow: hidden;
      background: #f0eeea;
      position: relative;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }

    .product-card:hover .product-image img {
      transform: scale(1.04);
    }

    .badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(8px);
      padding: 4px 10px;
      border-radius: 99px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      box-shadow: 0 4px 10px rgba(0,0,0,0.06);
      color: #111;
    }

    .product-tryon-badge {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: #111111;
      color: #ffffff;
      border: 0;
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .product-info {
      padding: 12px 2px 2px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .product-rating {
      font-size: 11px;
      font-weight: 700;
      color: #666;
      margin-bottom: 4px;
    }

    .product-name {
      font-size: 14px;
      font-weight: 700;
      color: #111;
      margin-bottom: 6px;
      line-height: 1.3;
    }

    .product-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 6px;
      font-size: 14px;
    }

    .product-price {
      font-weight: 800;
      color: #111;
    }

    .product-price del {
      color: #888;
      font-size: 12px;
      margin-left: 6px;
      font-weight: 500;
    }

    .product-actions {
      display: flex;
      gap: 8px;
      margin-top: 14px;
    }

    .quick-add {
      flex: 1;
      border: 1px solid #111;
      background: #111;
      color: #fff;
      border-radius: 8px;
      padding: 10px;
      font-size: 12px;
      font-weight: 700;
      transition: .2s;
    }
    .quick-add:hover {
      background: #2a2a2a;
    }

    .quick-view {
      border: 1px solid #dcd8d0;
      background: #f7f6f3;
      color: #111;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 12px;
      font-weight: 700;
      transition: .2s;
    }
    .quick-view:hover { background: #e8e5df; }

    /* MINIMALIST CLEAN CREAM TAB (DEMO & SCRAPED PRODUCT IMPORTER) */
    .cream-tab-container {
      background: #f4f1ea;
      border: 1px solid #e2ddd3;
      border-radius: 24px;
      padding: clamp(30px, 5vw, 50px);
      max-width: 1400px;
      margin: 40px auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    }

    .cream-head {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 36px;
    }

    .cream-head h2 {
      font-size: clamp(26px, 3.5vw, 38px);
      font-weight: 800;
      margin: 0 0 12px;
      letter-spacing: -.02em;
      color: #111;
    }

    .cream-head p {
      font-size: 14px;
      color: #555;
      line-height: 1.6;
      margin: 0;
      font-weight: 500;
    }

    .cream-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .cream-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 28px;
      border: 1px solid #e4dfd5;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .cream-card-title {
      font-size: 16px;
      font-weight: 800;
      color: #111;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eee9e0;
      padding-bottom: 12px;
    }

    .cream-card-step {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .08em;
      background: #111;
      color: #fff;
      padding: 4px 10px;
      border-radius: 99px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .input-group label {
      font-size: 12px;
      font-weight: 700;
      color: #333;
    }

    .input-group input, .input-group select {
      border: 1px solid #d8d3c9;
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 13px;
      background: #faf8f5;
      outline: none;
      transition: border-color 0.2s;
    }
    .input-group input:focus, .input-group select:focus {
      border-color: #111;
      background: #fff;
    }

    /* TRYON DEMO STAGE CANVAS */
    .tryon-stage {
      background: #e9e5dc;
      border-radius: 16px;
      height: 320px;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #c9c3b7;
    }

    .tryon-stage img.person-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .tryon-stage img.overlay-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
      opacity: 0.88;
      mix-blend-mode: multiply;
      transition: opacity 0.3s ease;
    }

    .match-result-box {
      background: #faf8f5;
      border: 1px solid #e0dbd1;
      border-radius: 14px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .match-percent {
      font-size: 28px;
      font-weight: 800;
      color: #111;
    }

    .match-info {
      font-size: 12px;
      color: #555;
      text-align: right;
    }

    /* BENEFITS */
    .benefits {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }

    .benefit {
      background: #ffffff;
      border-radius: 18px;
      padding: 28px;
      border: 1px solid #e7e4de;
    }

    .benefit b { display: block; margin-bottom: 8px; font-size: 15px; color: #111; font-weight: 800; }
    .benefit p { font-size: 13px; line-height: 1.6; color: #555; margin: 0; font-weight: 500; }

    /* FAQ LIST */
    .faq-list {
      background: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid #e7e4de;
    }

    .faq { border-bottom: 1px solid #eee9e0; }
    .faq:last-child { border: 0; }

    .faq button {
      width: 100%;
      border: 0;
      background: none;
      padding: 22px 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      font-size: 15px;
      font-weight: 700;
      color: #111;
    }

    .faq button span { font-size: 18px; transition: transform 0.3s; font-weight: 800; }
    .faq.open button span { transform: rotate(45deg); }

    .faq p {
      display: none;
      padding: 0 26px 22px;
      margin: 0;
      color: #555;
      font-size: 13px;
      line-height: 1.65;
      font-weight: 500;
    }
    .faq.open p { display: block; }

    /* NEWSLETTER */
    .newsletter {
      background: #ece8e0;
      border-radius: 20px;
      padding: 50px 28px;
      text-align: center;
      max-width: 1400px;
      margin: 0 auto 60px;
      border: 1px solid #dfdad0;
    }

    .newsletter h2 {
      font-size: 32px;
      font-weight: 800;
      margin: 0 0 10px;
    }

    .newsletter p {
      color: #555;
      font-size: 14px;
      max-width: 480px;
      margin: 0 auto 24px;
      font-weight: 500;
    }

    .newsletter form {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .newsletter input {
      border: 1px solid #d0cbb5;
      border-radius: 10px;
      padding: 14px 22px;
      width: min(340px, 100%);
      font-size: 13px;
      outline: none;
      background: #ffffff;
    }

    /* FOOTER */
    .footer {
      background: #111111;
      color: #ffffff;
      border-radius: 24px 24px 0 0;
      padding: 60px max(24px, 6vw) 90px;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
    }

    .footer .logo { color: #ffffff; display: block; margin-bottom: 16px; }
    .footer p, .footer a { font-size: 12px; color: #aaaaaa; line-height: 1.8; display: block; font-weight: 500; }
    .footer a:hover { color: #ffffff; }
    .footer h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 16px; color: #ffffff; font-weight: 800; }

    /* DRAWERS & OVERLAY */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.45);
      backdrop-filter: blur(4px);
      z-index: 50;
      opacity: 0;
      pointer-events: none;
      transition: .2s;
    }
    .overlay.show { opacity: 1; pointer-events: auto; }

    .drawer {
      position: fixed;
      z-index: 60;
      top: 0;
      bottom: 0;
      width: min(420px, 92vw);
      background: #ffffff;
      box-shadow: 0 0 50px rgba(0,0,0,.15);
      transition: .3s ease;
      display: flex;
      flex-direction: column;
    }

    .menu-drawer { left: 0; transform: translateX(-105%); }
    .cart-drawer { right: 0; transform: translateX(105%); }
    .drawer.open { transform: none; }

    .drawer-head {
      height: 70px;
      padding: 0 24px;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 800;
    }

    .close-btn {
      border: 0;
      background: #f0eeea;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      font-size: 16px;
      font-weight: 800;
    }

    .drawer-links { padding: 15px 25px; }
    .drawer-links a {
      display: flex;
      justify-content: space-between;
      padding: 18px 0;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      font-weight: 600;
    }

    .cart-items { padding: 18px 24px; overflow: auto; flex: 1; }
    .cart-empty { text-align: center; color: #777; padding: 60px 20px; font-size: 13px; font-weight: 500; }

    .cart-item {
      display: grid;
      grid-template-columns: 65px 1fr auto;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      align-items: center;
    }

    .cart-item img { width: 65px; height: 65px; border-radius: 8px; background: #eee; object-fit: cover; }
    .cart-item b { font-size: 13px; color: #111; font-weight: 700; }
    .cart-item small { display: block; color: #666; margin-top: 3px; font-size: 12px; font-weight: 600; }

    .cart-summary { padding: 20px 24px; border-top: 1px solid #eee; }
    .cart-summary > div { display: flex; justify-content: space-between; font-size: 13px; margin: 8px 0; font-weight: 600; }
    .full { width: 100%; margin-top: 14px; }

    /* MODALS */
    .modal {
      position: fixed;
      inset: 0;
      z-index: 80;
      background: rgba(0,0,0,.55);
      backdrop-filter: blur(6px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal.open { display: flex; }

    .finder-card {
      background: #ffffff;
      width: min(840px, 96vw);
      border-radius: 24px;
      padding: 36px;
      position: relative;
      max-height: 90vh;
      overflow-y: auto;
    }

    .quick-card {
      background: #ffffff;
      border-radius: 20px;
      width: min(720px, 95vw);
      padding: 28px;
      position: relative;
    }
    .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; }
    .quick-grid img { width: 100%; border-radius: 14px; background: #eee; aspect-ratio: 1; object-fit: cover; }

    /* TOAST */
    .toast {
      position: fixed;
      bottom: 25px;
      left: 50%;
      transform: translate(-50%, 20px);
      background: #111111;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 99px;
      font-size: 12px;
      font-weight: 700;
      z-index: 100;
      opacity: 0;
      pointer-events: none;
      transition: .25s;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .toast.show { opacity: 1; transform: translate(-50%, 0); pointer-events: auto; }

    /* MOBILE NAVIGATION */
    .mobile-nav { display: none; }

    @media (max-width: 900px) {
      .desktop-nav { display: none; }
      .menu-btn { display: flex; }
      .hero-card { min-height: 480px; }
      .hero-art:after { display: none; }
      .hero-copy { width: 100%; padding: 36px 20px; }
      .trust-row { grid-template-columns: repeat(2, 1fr); gap: 14px; }
      .trust-item { border: 0; }
      .benefits, .footer, .cream-grid { grid-template-columns: 1fr; }
      .quick-grid { grid-template-columns: 1fr; }
      .mobile-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: rgba(255,255,255,0.96);
        backdrop-filter: blur(16px);
        border-top: 1px solid #e7e4de;
        display: flex;
        align-items: center;
        justify-content: space-around;
        z-index: 45;
      }
      .mobile-nav a, .mobile-nav button {
        background: none;
        border: none;
        color: #555;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
      }
    }
  </style>
</head>
<body>

  <!-- ANNOUNCEMENT BAR -->
  <div class="announcement">
    ${isFr ? 'LIVRAISON EXPRESS OFFERTE DÈS 50€ • STUDIO ESSAYAGE VIRTUEL IA EN DIRECT' : 'FREE EXPRESS SHIPPING OVER $50 • REAL-TIME AI VIRTUAL TRY-ON STUDIO'}
  </div>

  <!-- HEADER -->
  <header class="header">
    <a class="logo" href="#home">${companyName} <span>LUMINA</span></a>
    <nav class="desktop-nav">
      <a href="#shop" class="active">${isFr ? 'Boutique' : 'Shop Catalog'}</a>
      <a href="#niche-filter">${isFr ? 'Filtres Niches' : 'Niche Selector'}</a>
      <a href="#tryon-studio">${isFr ? 'Studio Essayage IA' : 'AI Try-On Studio'}</a>
      <a href="#faqs">${isFr ? 'FAQs' : 'FAQs'}</a>
      <a href="#contact">${isFr ? 'Contact' : 'Contact'}</a>
    </nav>
    <div class="header-actions">
      <button class="secondary" style="padding: 7px 14px; font-size: 12px;" onclick="openAiTryonModal()">${isFr ? 'Essayage IA' : 'AI Try-On'}</button>
      <button class="icon-btn cart-icon" aria-label="Cart" onclick="toggleCartDrawer(true)">
        ${isFr ? 'Panier' : 'Cart'} <span id="cartCount">0</span>
      </button>
      <button class="menu-btn" aria-label="Open menu" onclick="toggleMenuDrawer(true)">Menu</button>
    </div>
  </header>

  <!-- MAIN -->
  <main>
    <!-- HERO SECTION -->
    <section class="hero" id="home">
      <div class="hero-card">
        <div class="hero-art" id="heroArtEl"></div>
        <div class="hero-copy">
          <div class="eyebrow" id="heroEyebrowEl">${isFr ? 'Studio Essayage Virtuel IA' : 'AI Virtual Try-On Studio'}</div>
          <h1 id="heroTitleEl">${heroTitle}</h1>
          <p id="heroSubtitleEl">${heroSubtitle}</p>
          <div class="hero-actions">
            <a href="#shop" class="primary">${isFr ? 'Découvrir la Collection' : 'Shop Collection'}</a>
            <button class="secondary" onclick="openAiTryonModal()">${isFr ? 'Tester l\'Essayage IA' : 'Test AI Try-On'}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- TRUST ROW -->
    <div class="trust-row">
      <div class="trust-item">
        <div>
          <b>${isFr ? 'Livraison Offerte' : 'Free Global Delivery'}</b>
          <small>${isFr ? 'Partout dès 50€ d\'achat' : 'Express shipping over $50'}</small>
        </div>
      </div>
      <div class="trust-item">
        <div>
          <b>${isFr ? 'Essayage IA en En Direct' : 'Live AI Virtual Try-On'}</b>
          <small>${isFr ? 'Visualisez le rendu sur vous' : 'Simulate fit on your selfie'}</small>
        </div>
      </div>
      <div class="trust-item">
        <div>
          <b>${isFr ? 'Garantie Satisfait' : '30-Day Guarantee'}</b>
          <small>${isFr ? 'Retours gratuits & faciles' : 'Hassle-free exchanges'}</small>
        </div>
      </div>
      <div class="trust-item">
        <div>
          <b>${isFr ? 'Qualité Supérieure' : 'Ethical Crafting'}</b>
          <small>${isFr ? 'Matériaux certifiés & durables' : 'Sustainably sourced'}</small>
        </div>
      </div>
    </div>

    <!-- PRODUCTS & NICHE SELECTOR SECTION -->
    <section class="section" id="shop">
      <div class="section-head" id="niche-filter">
        <div>
          <h2 id="catalogHeading">${isFr ? 'Boutique & Sélections Par Niche' : 'Niche Dropshipping Storefront'}</h2>
          <p>${isFr ? 'Sélectionnez une niche dropshipping pour filtrer instantanément les produits et tester l\'essayage IA' : 'Select a dropshipping niche to instantly filter products and test AI virtual try-on'}</p>
        </div>
        <button class="secondary" onclick="openAiTryonModal()">${isFr ? 'Ouvrir Studio IA' : 'Open AI Studio'}</button>
      </div>

      <!-- NICHE SELECTOR BAR -->
      <div class="niche-selector-bar">
        <button class="niche-pill active" onclick="switchNicheCatalog('all', this)">${isFr ? 'Tous les produits' : 'All Products'}</button>
        <button class="niche-pill" onclick="switchNicheCatalog('fashion', this)">${isFr ? 'Mode & Vêtements' : 'Fashion & Clothing'}</button>
        <button class="niche-pill" onclick="switchNicheCatalog('hair', this)">${isFr ? 'Perruques & Wigs' : 'Wigs & Extensions'}</button>
        <button class="niche-pill" onclick="switchNicheCatalog('beauty', this)">${isFr ? 'Sérums & Soins' : 'Skincare & Beauty'}</button>
        <button class="niche-pill" onclick="switchNicheCatalog('eyewear', this)">${isFr ? 'Montures & Solaire' : 'Designer Eyewear'}</button>
        <button class="niche-pill" onclick="switchNicheCatalog('jewelry', this)">${isFr ? 'Bijoux & Or 18K' : 'Fine Jewelry'}</button>
        <button class="niche-pill" onclick="switchNicheCatalog('home', this)">${isFr ? 'Maison & Bien-être' : 'Home & Wellness'}</button>
      </div>

      <div class="products" id="productGrid">
        <!-- Rendered via JS -->
      </div>
    </section>

    <!-- MINIMALIST CLEAN CREAM TAB (SCREENRECORD DEMO & SCRAPED PRODUCT IMPORTER) -->
    <section class="cream-tab-container" id="tryon-studio">
      <div class="cream-head">
        <h2>${isFr ? 'Studio Essayage Virtuel IA & Importateur Dropshipping' : 'AI Virtual Try-On Studio & Dropship Importer'}</h2>
        <p>${isFr ? 'Importez n\'importe quel produit scrapé depuis AliExpress, Shopify ou Amazon, chargez une photo client et générez le rendu IA en direct.' : 'Import any scraped product from suppliers, upload a customer portrait, and render real-time AI fitting visual results.'}</p>
      </div>

      <div class="cream-grid">
        <!-- STEP 1: SCRAPED PRODUCT IMPORTER FORM -->
        <div class="cream-card">
          <div class="cream-card-title">
            <span>${isFr ? '1. Importer Produit Scrapé' : '1. Import Scraped Product'}</span>
            <span class="cream-card-step">Étape 1</span>
          </div>

          <div class="input-group">
            <label>${isFr ? 'URL Image du Produit (Scrapé)' : 'Scraped Product Image URL'}</label>
            <input type="text" id="demoScrapedUrl" value="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80" placeholder="https://...">
          </div>

          <div class="input-group">
            <label>${isFr ? 'Titre / Nom du Produit' : 'Product Title'}</label>
            <input type="text" id="demoScrapedTitle" value="Robe Satin Soie Édition Limitée" placeholder="Product Name">
          </div>

          <div class="input-group">
            <label>${isFr ? 'Niche Produit' : 'Product Niche Category'}</label>
            <select id="demoScrapedCat">
              <option value="fashion">Fashion & Clothing</option>
              <option value="hair">Wigs & Hair Extensions</option>
              <option value="beauty">Skincare & Cosmetics</option>
              <option value="eyewear">Eyewear & Sunglasses</option>
              <option value="jewelry">Fine Jewelry</option>
            </select>
          </div>

          <button class="primary" onclick="importScrapedItemDemo()">${isFr ? 'Importer ce Produit & Lancer Essayage' : 'Import Product & Test AI Try-On'}</button>
        </div>

        <!-- STEP 2 & 3: REAL TIME AI TRY-ON CANVAS RENDER -->
        <div class="cream-card">
          <div class="cream-card-title">
            <span>${isFr ? '2. Rendu Simulation IA en En Direct' : '2. Live AI Fitting Simulation'}</span>
            <span class="cream-card-step">Résultat IA</span>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
            <span style="font-size:12px;font-weight:700;color:#444;" id="demoActiveTitle">Robe Satin Soie Édition Limitée</span>
            <label style="background:#111;color:#fff;font-size:11px;font-weight:700;padding:6px 12px;border-radius:6px;cursor:pointer;">
              ${isFr ? 'Changer Photo Client' : 'Upload Selfie'}
              <input type="file" accept="image/*" style="display:none;" onchange="handleDemoUserPhotoUpload(event)">
            </label>
          </div>

          <!-- CANVAS CANVAS -->
          <div class="tryon-stage">
            <img id="demoPersonImg" class="person-img" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" alt="Customer Selfie">
            <img id="demoProductOverlayImg" class="overlay-img" src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80" alt="Product Overlay">
          </div>

          <!-- SCORE RESULTS -->
          <div class="match-result-box">
            <div>
              <div style="font-size:10px;font-weight:800;text-transform:uppercase;color:#777;">Score d'Ajustement IA</div>
              <div class="match-percent" id="demoMatchScore">98.6%</div>
            </div>
            <div class="match-info">
              <strong style="color:#111;" id="demoMatchStatus">${isFr ? 'Alignement Parfait' : 'Perfect Fit Match'}</strong>
              <div style="margin-top:2px;">${isFr ? 'Taille Recommandée: M' : 'Recommended Size: M'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFITS -->
    <section class="section">
      <div class="benefits">
        <div class="benefit">
          <b>${isFr ? 'Rendu Virtuel Instantané' : 'Real-Time AI Fitting'}</b>
          <p>${isFr ? 'Notre moteur de vision par ordinateur projette précisément le produit sur le selfie du client.' : 'Our computer vision engine renders colors, fits, and contours directly onto selfie photos.'}</p>
        </div>
        <div class="benefit">
          <b>${isFr ? 'Qualité Supérieure' : 'Premium Standard'}</b>
          <p>${isFr ? 'Chaque article est rigoureusement vérifié avant expédition express.' : 'Every item undergoes strict multi-stage quality control before express dispatch.'}</p>
        </div>
        <div class="benefit">
          <b>${isFr ? 'Support Client Dédié' : 'Dedicated Support 24/7'}</b>
          <p>${isFr ? 'Notre équipe vous aide à choisir la taille et suit vos colis en direct.' : 'Our team assists with sizing pick and provides real-time tracking support.'}</p>
        </div>
      </div>
    </section>

    <!-- FAQ LIST -->
    <section class="section" id="faqs">
      <div class="section-head">
        <div>
          <h2>${isFr ? 'Questions Fréquentes' : 'Frequently Asked Questions'}</h2>
          <p>${isFr ? 'Tout ce que vous devez savoir sur notre boutique et l\'essayage IA' : 'Everything you need to know about our catalog and AI try-on'}</p>
        </div>
      </div>
      <div class="faq-list">
        <div class="faq open">
          <button onclick="toggleFaq(this)">
            ${isFr ? 'Comment fonctionne l\'essayage virtuel en direct ?' : 'How does the Live AI Virtual Try-On work?'}
            <span>+</span>
          </button>
          <p>${isFr ? 'Importez simplement une photo de votre visage ou silhouette. L\'IA adapte automatiquement la taille, l\'éclairage et le rendu du produit.' : 'Simply upload a selfie photo. The AI automatically aligns proportions, lighting, and textures onto your photo.'}</p>
        </div>
        <div class="faq">
          <button onclick="toggleFaq(this)">
            ${isFr ? 'Quels sont les délais de livraison ?' : 'What are the delivery timescales?'}
            <span>+</span>
          </button>
          <p>${isFr ? 'Toutes les commandes sont expédiées sous 24h. La livraison prend 2 à 4 jours ouvrés avec numéro de suivi.' : 'All orders are dispatched within 24 hours. Delivery takes 2-4 business days with full tracking numbers.'}</p>
        </div>
        <div class="faq">
          <button onclick="toggleFaq(this)">
            ${isFr ? 'Quelle est votre politique de retour ?' : 'What is your return policy?'}
            <span>+</span>
          </button>
          <p>${isFr ? 'Vous bénéficiez de 30 jours pour effectuer un retour sans frais et demander un échange instantané.' : 'We offer a hassle-free 30-day window for full refunds or instant exchanges.'}</p>
        </div>
      </div>
    </section>

    <!-- NEWSLETTER -->
    <div class="newsletter">
      <h2>${isFr ? 'Rejoignez le Club VIP' : 'Join The VIP Club'}</h2>
      <p>${isFr ? 'Inscrivez-vous pour bénéficier d\'un code de réduction de 15% immédiat sur votre première commande.' : 'Subscribe to receive private sales access and an instant 15% discount code.'}</p>
      <form onsubmit="event.preventDefault(); showToast('${isFr ? 'Inscription réussie ! Code : LUMINA15' : 'Subscribed! Discount Code: LUMINA15'}');">
        <input type="email" placeholder="${isFr ? 'Votre adresse email' : 'Enter your email address'}" required>
        <button type="submit" class="primary">${isFr ? 'S\'inscrire' : 'Subscribe'}</button>
      </form>
    </div>
  </main>

  <!-- FOOTER -->
  <footer class="footer" id="contact">
    <div>
      <a class="logo" href="#home">${companyName} <span>LUMINA</span></a>
      <p>${isFr ? 'Plateforme dropshipping haut de gamme avec studio d\'essayage virtuel par IA.' : 'High-end dropshipping storefront featuring real-time AI Virtual Try-On technology.'}</p>
      <p style="margin-top: 14px;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
    </div>
    <div>
      <h4>${isFr ? 'Navigation' : 'Navigation'}</h4>
      <a href="#shop">${isFr ? 'Boutique' : 'Shop'}</a>
      <a href="#tryon-studio">${isFr ? 'Studio IA' : 'AI Studio'}</a>
      <a href="#faqs">${isFr ? 'FAQs' : 'FAQs'}</a>
    </div>
    <div>
      <h4>${isFr ? 'Service Client' : 'Customer Service'}</h4>
      <a href="#shipping">${isFr ? 'Livraison' : 'Shipping'}</a>
      <a href="#returns">${isFr ? 'Retours' : 'Returns'}</a>
      <a href="#terms">${isFr ? 'Conditions' : 'Terms'}</a>
    </div>
    <div>
      <h4>${isFr ? 'Contact' : 'Contact'}</h4>
      <p>Ville: ${city}</p>
      <p>Tél: ${phone}</p>
      <p>Email: ${email}</p>
    </div>
  </footer>

  <!-- MENU DRAWER -->
  <aside class="drawer menu-drawer" id="menuDrawer">
    <div class="drawer-head">
      <span>Menu</span>
      <button class="close-btn" onclick="toggleMenuDrawer(false)">X</button>
    </div>
    <div class="drawer-links">
      <a href="#shop" onclick="toggleMenuDrawer(false)">${isFr ? 'Boutique' : 'Shop'}</a>
      <a href="#niche-filter" onclick="toggleMenuDrawer(false)">${isFr ? 'Niches' : 'Niches'}</a>
      <a href="#tryon-studio" onclick="toggleMenuDrawer(false)">${isFr ? 'Studio IA' : 'AI Studio'}</a>
      <a href="#faqs" onclick="toggleMenuDrawer(false)">${isFr ? 'FAQs' : 'FAQs'}</a>
      <a href="#contact" onclick="toggleMenuDrawer(false)">${isFr ? 'Contact' : 'Contact'}</a>
    </div>
  </aside>

  <!-- CART DRAWER -->
  <aside class="drawer cart-drawer" id="cartDrawer">
    <div class="drawer-head">
      <span>${isFr ? 'Votre Panier' : 'Shopping Cart'} (<span id="drawerCartCount">0</span>)</span>
      <button class="close-btn" onclick="toggleCartDrawer(false)">X</button>
    </div>
    <div id="cartItems" class="cart-items">
      <div class="cart-empty">${isFr ? 'Votre panier est vide pour le moment.' : 'Your cart is currently empty.'}</div>
    </div>
    <div class="cart-summary">
      <div><span>Subtotal</span><strong id="cartSubtotal">$0.00</strong></div>
      <div><span>Shipping</span><strong>FREE</strong></div>
      <button class="primary full" onclick="showToast('${isFr ? 'Commande validée avec succès !' : 'Order placed successfully!'}')">
        ${isFr ? 'Passer au Paiement' : 'Proceed to Checkout'}
      </button>
    </div>
  </aside>

  <!-- OVERLAY -->
  <div class="overlay" id="overlay" onclick="closeAllDrawers()"></div>

  <!-- QUICK VIEW MODAL -->
  <div class="modal" id="quickModal">
    <div class="quick-card">
      <button class="close-btn" style="position:absolute;top:18px;right:18px;" onclick="closeQuickModal()">X</button>
      <div class="quick-grid" id="quickContent"></div>
    </div>
  </div>

  <!-- AI VIRTUAL TRY-ON STUDIO MODAL -->
  <div class="modal" id="aiTryonModal">
    <div class="finder-card">
      <button class="close-btn" style="position:absolute;top:18px;right:18px;" onclick="closeAiTryonModal()">X</button>
      
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid #eee;">
        <h3 style="font-size:22px;font-weight:800;margin:0;color:#111;">
          ${isFr ? 'Studio d\'Essayage Virtuel IA' : 'AI Virtual Try-On Studio'}
        </h3>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
        <!-- USER PHOTO CANVAS -->
        <div style="background:#faf8f5;border:1px solid #e2ddd3;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:12px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:11px;font-weight:800;color:#555;text-transform:uppercase;">
              1. ${isFr ? 'Votre Selfie / Photo' : 'Customer Selfie'}
            </span>
            <label style="background:#111;color:#fff;font-size:11px;font-weight:700;padding:6px 12px;border-radius:6px;cursor:pointer;">
              ${isFr ? 'Importer Image' : 'Upload Selfie'}
              <input type="file" accept="image/*" style="display:none;" onchange="handleModalTryonUpload(event)">
            </label>
          </div>

          <div style="position:relative;width:100%;height:280px;background:#e9e5dc;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;border:1px dashed #c4bfb7;">
            <img id="modalTryonUserPhoto" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" alt="User Photo" style="width:100%;height:100%;object-fit:cover;">
            <img id="modalTryonOverlayProduct" src="${initialProducts[0].img}" alt="Product Overlay" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;opacity:0.85;mix-blend-mode:multiply;">
            <div id="modalTryonSpinner" style="display:none;position:absolute;inset:0;background:rgba(255,255,255,0.9);flex-direction:column;align-items:center;justify-content:center;gap:10px;">
              <div style="width:28px;height:28px;border:3px solid #111;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
              <span style="font-size:12px;font-weight:800;color:#111;">${isFr ? 'Calcul de la coupe IA...' : 'Computing AI Fit...'}</span>
            </div>
          </div>
        </div>

        <!-- PRODUCT MATCH & DETAILS -->
        <div style="display:flex;flex-direction:column;gap:14px;">
          <span style="font-size:11px;font-weight:800;color:#555;text-transform:uppercase;">
            2. ${isFr ? 'Produit Sélectionné' : 'Selected Product'}
          </span>
          <div id="modalTryonProductTitle" style="font-size:18px;font-weight:800;color:#111;">
            ${initialProducts[0].title}
          </div>

          <button onclick="runModalAiTryonProcess()" class="primary" style="width:100%;justify-content:center;">
            ${isFr ? 'Générer Rendu IA & Fit Score' : 'Render AI Virtual Fit Result'}
          </button>

          <div style="background:#faf8f5;border:1px solid #e0dbd1;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span style="font-size:26px;font-weight:800;color:#111;" id="modalScoreVal">98.4%</span>
              <span style="font-size:11px;font-weight:800;background:#111;color:#fff;padding:4px 10px;border-radius:99px;" id="modalRecommendedSize">Size M / Standard Fit</span>
            </div>
            <p id="modalFitSummary" style="margin:0;font-size:12px;color:#555;line-height:1.5;font-weight:500;">
              ${isFr ? 'L\'IA a ajusté la forme, la réflexion lumineuse et les proportions sur la photo client.' : 'AI seamlessly aligned proportions, lighting reflections, and fabric drape.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- TOAST -->
  <div class="toast" id="toast"></div>

  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>

  <script>
    var allProducts = ${JSON.stringify(initialProducts)};
    var nicheDb = ${JSON.stringify(nicheProductsDatabase)};
    var cart = [];
    var currentTryonItem = { title: "${initialProducts[0].title.replace(/'/g, "\\'")}", img: "${initialProducts[0].img}", cat: "${initialProducts[0].category}" };

    // Initial render
    window.addEventListener('DOMContentLoaded', function() {
      renderProductsGrid(allProducts);
    });

    function renderProductsGrid(items) {
      var grid = document.getElementById('productGrid');
      if (!grid) return;
      if (!items || items.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#666;font-weight:600;">No products found in this category.</div>';
        return;
      }

      grid.innerHTML = items.map(function(p) {
        var cleanTitle = p.title.replace(/'/g, "\\'");
        var cleanDesc = (p.desc || '').replace(/'/g, "\\'");
        return '<div class="product-card">' +
          '<div class="product-image">' +
            '<img src="' + p.img + '" alt="' + p.title + '">' +
            '<span class="badge">' + (p.badge || 'New') + '</span>' +
            '<button class="product-tryon-badge" onclick="openTryonForProduct(\'' + cleanTitle + '\', \'' + p.img + '\', \'' + p.category + '\')">' +
              '${isFr ? 'Essayage IA' : 'AI Try-On'}' +
            '</button>' +
          '</div>' +
          '<div class="product-info">' +
            '<div class="product-rating">Rating: ' + (p.rating || '4.9/5') + '</div>' +
            '<div class="product-name">' + p.title + '</div>' +
            '<div class="product-meta">' +
              '<div class="product-price">$' + p.price.toFixed(2) + (p.oldPrice ? ' <del>$' + p.oldPrice.toFixed(2) + '</del>' : '') + '</div>' +
            '</div>' +
            '<div class="product-actions">' +
              '<button class="quick-add" onclick="addToCart(\'' + p.id + '\', \'' + cleanTitle + '\', ' + p.price + ', \'' + p.img + '\')">' +
                '${isFr ? 'Ajouter' : 'Add to Cart'}' +
              '</button>' +
              '<button class="quick-view" onclick="openQuickView(\'' + p.id + '\', \'' + cleanTitle + '\', ' + p.price + ', \'' + p.img + '\', \'' + cleanDesc + '\')">' +
                '${isFr ? 'Aperçu' : 'View'}' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function switchNicheCatalog(nicheKey, btn) {
      document.querySelectorAll('.niche-pill').forEach(function(b) { b.classList.remove('active'); });
      if (btn) btn.classList.add('active');

      var heading = document.getElementById('catalogHeading');
      var list = [];

      if (nicheKey === 'all') {
        list = allProducts;
        if (heading) heading.textContent = "${isFr ? 'Boutique & Sélections Par Niche' : 'Niche Dropshipping Storefront'}";
      } else if (nicheDb[nicheKey]) {
        list = nicheDb[nicheKey];
        var nicheNames = {
          fashion: "${isFr ? 'Collection Mode & Vêtements' : 'Fashion & Clothing Collection'}",
          hair: "${isFr ? 'Collection Perruques & Extensions HD Lace' : 'Wigs & Extensions Collection'}",
          beauty: "${isFr ? 'Collection Sérums & Soins Visage' : 'Skincare & Beauty Elixirs'}",
          eyewear: "${isFr ? 'Collection Montures & Lunettes de Soleil' : 'Designer Eyewear Collection'}",
          jewelry: "${isFr ? 'Collection Bijoux Signatures Or 18K' : 'Fine Jewelry Signature Line'}",
          home: "${isFr ? 'Collection Maison & Bien-être' : 'Home & Wellness Collection'}"
        };
        if (heading) heading.textContent = nicheNames[nicheKey] || nicheKey;
        
        // Update Hero preview visually
        if (list[0]) {
          var heroArt = document.getElementById('heroArtEl');
          if (heroArt) {
            heroArt.style.backgroundImage = "radial-gradient(circle at 75% 40%, rgba(255,255,255,0.7), transparent 35%)";
          }
        }
      } else {
        list = allProducts;
      }

      renderProductsGrid(list);
    }

    function importScrapedItemDemo() {
      var urlInput = document.getElementById('demoScrapedUrl').value;
      var titleInput = document.getElementById('demoScrapedTitle').value || 'Scraped Item';
      var catInput = document.getElementById('demoScrapedCat').value;

      if (!urlInput) {
        showToast("${isFr ? 'Veuillez coller une URL d\'image' : 'Please paste an image URL'}");
        return;
      }

      // Update Demo Canvas
      document.getElementById('demoProductOverlayImg').src = urlInput;
      document.getElementById('demoActiveTitle').textContent = titleInput;

      // Add to Catalog
      var newItem = {
        id: 'scraped_' + Date.now(),
        title: titleInput,
        price: 99.00,
        oldPrice: 140.00,
        category: catInput,
        badge: 'Scraped Item',
        img: urlInput,
        desc: 'Custom scraped product imported for live testing.',
        rating: '5.0/5'
      };

      allProducts.unshift(newItem);
      renderProductsGrid(allProducts);

      // Simulate AI Fit update
      document.getElementById('demoMatchScore').textContent = '99.1%';
      document.getElementById('demoMatchStatus').textContent = "${isFr ? 'Produit Scrapé Aligné' : 'Scraped Item Aligned'}";

      showToast("${isFr ? 'Produit scrapé importé et ajouté au catalogue !' : 'Scraped product imported & tested live!'}");
    }

    function handleDemoUserPhotoUpload(e) {
      var file = e.target.files && e.target.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('demoPersonImg').src = evt.target.result;
          showToast("${isFr ? 'Photo client mise à jour !' : 'Customer portrait updated!'}");
        };
        reader.readAsDataURL(file);
      }
    }

    function openTryonForProduct(title, img, cat) {
      currentTryonItem = { title: title, img: img, cat: cat };
      document.getElementById('modalTryonProductTitle').textContent = title;
      var overlay = document.getElementById('modalTryonOverlayProduct');
      if (overlay) overlay.src = img;
      openAiTryonModal();
    }

    function runModalAiTryonProcess() {
      var spinner = document.getElementById('modalTryonSpinner');
      if (spinner) spinner.style.display = 'flex';
      setTimeout(function() {
        if (spinner) spinner.style.display = 'none';
        document.getElementById('modalScoreVal').textContent = '98.8%';
        document.getElementById('modalFitSummary').textContent = "${isFr ? 'Simulation IA terminée avec succès !' : 'AI visual fitting simulation complete!'}";
        showToast("${isFr ? 'Ajustement IA calculé !' : 'AI Fit computed successfully!'}");
      }, 700);
    }

    function handleModalTryonUpload(e) {
      var file = e.target.files && e.target.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('modalTryonUserPhoto').src = evt.target.result;
          showToast("${isFr ? 'Photo mise à jour' : 'Photo updated'}");
        };
        reader.readAsDataURL(file);
      }
    }

    function toggleCartDrawer(show) {
      document.getElementById('cartDrawer').classList.toggle('open', show);
      document.getElementById('overlay').classList.toggle('show', show);
    }

    function toggleMenuDrawer(show) {
      document.getElementById('menuDrawer').classList.toggle('open', show);
      document.getElementById('overlay').classList.toggle('show', show);
    }

    function closeAllDrawers() {
      toggleCartDrawer(false);
      toggleMenuDrawer(false);
      closeQuickModal();
      closeAiTryonModal();
    }

    function openQuickView(id, title, price, img, desc) {
      var content = document.getElementById('quickContent');
      content.innerHTML = '<img src="' + img + '" alt="' + title + '">' +
        '<div>' +
          '<h2 style="font-size:22px;font-weight:800;margin:0 0 8px;">' + title + '</h2>' +
          '<div style="font-size:20px;font-weight:800;margin-bottom:12px;">$' + price.toFixed(2) + '</div>' +
          '<p style="font-size:13px;color:#555;line-height:1.6;margin-bottom:20px;">' + desc + '</p>' +
          '<div style="display:flex;gap:10px;">' +
            '<button class="primary" style="flex:1;" onclick="addToCart(\'' + id + '\', \'' + title + '\', ' + price + ', \'' + img + '\'); closeQuickModal();">${isFr ? 'Ajouter au Panier' : 'Add to Cart'}</button>' +
            '<button class="secondary" onclick="openTryonForProduct(\'' + title + '\', \'' + img + '\', \'fashion\'); closeQuickModal();">${isFr ? 'Essayage IA' : 'AI Try-On'}</button>' +
          '</div>' +
        '</div>';
      document.getElementById('quickModal').classList.add('open');
    }

    function closeQuickModal() {
      document.getElementById('quickModal').classList.remove('open');
    }

    function openAiTryonModal() {
      document.getElementById('aiTryonModal').classList.add('open');
    }

    function closeAiTryonModal() {
      document.getElementById('aiTryonModal').classList.remove('open');
    }

    function toggleFaq(btn) {
      var item = btn.closest('.faq');
      item.classList.toggle('open');
    }

    function addToCart(id, title, price, img) {
      cart.push({ id: id, title: title, price: price, img: img });
      updateCartUI();
      showToast(title + " ${isFr ? 'ajouté au panier !' : 'added to cart!'}");
    }

    function updateCartUI() {
      document.getElementById('cartCount').textContent = cart.length;
      document.getElementById('drawerCartCount').textContent = cart.length;
      var container = document.getElementById('cartItems');
      var total = cart.reduce(function(acc, item) { return acc + item.price; }, 0);
      document.getElementById('cartSubtotal').textContent = '$' + total.toFixed(2);

      if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty">${isFr ? 'Votre panier est vide pour le moment.' : 'Your cart is currently empty.'}</div>';
        return;
      }

      container.innerHTML = cart.map(function(item, idx) {
        return '<div class="cart-item">' +
          '<img src="' + item.img + '">' +
          '<div>' +
            '<b>' + item.title + '</b>' +
            '<small>$' + item.price.toFixed(2) + '</small>' +
          '</div>' +
          '<button onclick="removeFromCart(' + idx + ')" style="background:none;border:none;color:#ef4444;cursor:pointer;font-weight:bold;">X</button>' +
        '</div>';
      }).join('');
    }

    function removeFromCart(idx) {
      cart.splice(idx, 1);
      updateCartUI();
    }

    function showToast(msg) {
      var toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(function() { toast.classList.remove('show'); }, 3000);
    }
  </script>
</body>
</html>`;
}
