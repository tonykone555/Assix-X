const fs = require('fs');
let content = fs.readFileSync('services/templates/outlandHomesTemplate.js', 'utf8');

// Replace CSS
content = content.replace(
  /\.hero-giant-title \{[\s\S]*?\.stat-card-large img \{[\s\S]*?\}/,
  `.hero-brand-card {
      background: rgba(20, 20, 20, 0.85);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-radius: 20px;
      padding: 40px 30px;
      margin-top: 40px;
      display: flex;
      flex-direction: column;
      max-width: 500px;
      position: relative;
      z-index: 10;
    }
    .hero-brand-card h1 {
      font-size: clamp(40px, 12vw, 80px);
      line-height: 0.95;
      font-weight: 300;
      letter-spacing: -0.03em;
      text-transform: uppercase;
    }
    .hero-brand-card .subtitle {
      align-self: flex-end;
      font-size: clamp(20px, 5vw, 32px);
      font-weight: 300;
      margin-top: 20px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .hero-text-content {
      margin-top: auto;
      margin-bottom: 30px;
      max-width: 500px;
      position: relative;
      z-index: 10;
    }
    .hero-text-content h2 {
      font-size: clamp(22px, 6vw, 32px);
      font-weight: 400;
      margin-bottom: 12px;
      line-height: 1.2;
    }
    .hero-text-content p {
      color: rgba(255,255,255,0.8);
      font-size: 15px;
      font-weight: 300;
    }

    .btn-full-width {
      display: block;
      width: 100%;
      background: #fff;
      color: #000;
      text-align: center;
      padding: 20px;
      border-radius: 99px;
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      transition: opacity 0.2s;
      position: relative;
      z-index: 10;
    }
    .btn-full-width:hover {
      opacity: 0.9;
    }
    
    @media (min-width: 768px) {
      .btn-full-width { max-width: 400px; }
      .hero-section { margin: 20px; padding: 40px; }
    }
    
    .nav-links { display: none; }
    
    .stat-card-large img {`
);

// We need to also adjust hero-section margin/padding
content = content.replace(
  /\.hero-section \{[\s\S]*?padding: 30px 40px;[\s\S]*?\}/,
  `.hero-section {
      position: relative;
      height: 94vh;
      min-height: 680px;
      margin: 10px;
      border-radius: var(--radius-xl);
      overflow: hidden;
      background: #111;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px 20px;
    }`
);

// We need to replace the HTML for scrub
const scrubHeroOld = `<div class="hero-giant-title fade-in" style="transform: translateY(0);">
          \${i18n.giantWordMain}
          <span>\${i18n.giantWordSub}</span>
        </div>

        <div class="hero-bottom-content fade-in fade-in-delay-1" style="padding: 0 48px 48px;">
          <div class="hero-description">
            <h2>\${i18n.heroTitle}</h2>
            <p>\${i18n.heroDesc}</p>
            <a href="#catalog" class="btn-white">\${i18n.heroBtn}</a>
          </div>

          <div class="hero-stat-cards">
            <div class="stat-card-small">
              <h3>\${i18n.stat1Num}</h3>
              <p>\${i18n.stat1Sub}</p>
            </div>
            <div class="stat-card-large">
              <img src="\${statCardImg}" alt="Feature thumbnail">
              <div class="num">\${i18n.stat2Num}</div>
              <div class="sub">\${i18n.stat2Sub}</div>
            </div>
          </div>
        </div>`;

const newHeroHTML = `<div class="hero-brand-card fade-in">
          <h1>\${i18n.giantWordMain}</h1>
          <div class="subtitle">\${i18n.giantWordSub}</div>
        </div>

        <div class="hero-text-content fade-in fade-in-delay-1">
          <h2>\${i18n.heroTitle}</h2>
          <p>\${i18n.heroDesc}</p>
        </div>
        
        <a href="#catalog" class="btn-full-width fade-in fade-in-delay-2">\${i18n.heroBtn}</a>`;

content = content.replace(scrubHeroOld, newHeroHTML);

const nonScrubHeroOld = `<div class="hero-giant-title fade-in">
      \${i18n.giantWordMain}
      <span>\${i18n.giantWordSub}</span>
    </div>

    <div class="hero-bottom-content fade-in fade-in-delay-1">
      <div class="hero-description">
        <h2>\${i18n.heroTitle}</h2>
        <p>\${i18n.heroDesc}</p>
        <a href="#catalog" class="btn-white">\${i18n.heroBtn}</a>
      </div>

      <div class="hero-stat-cards">
        <div class="stat-card-small">
          <h3>\${i18n.stat1Num}</h3>
          <p>\${i18n.stat1Sub}</p>
        </div>
        <div class="stat-card-large">
          <img src="\${statCardImg}" alt="Feature thumbnail">
          <div class="num">\${i18n.stat2Num}</div>
          <div class="sub">\${i18n.stat2Sub}</div>
        </div>
      </div>
    </div>`;

content = content.replace(nonScrubHeroOld, newHeroHTML);

fs.writeFileSync('services/templates/outlandHomesTemplate.js', content);
