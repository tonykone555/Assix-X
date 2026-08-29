const fs = require('fs');
let content = fs.readFileSync('services/templates/outlandHomesTemplate.js', 'utf8');

const oldBlock = `<div class="hero-giant-title fade-in" style="position: relative; z-index: 10;">
      \${i18n.giantWordMain}
      <span>\${i18n.giantWordSub}</span>
    </div>

    <div class="hero-bottom-content fade-in fade-in-delay-1" style="position: relative; z-index: 10;">
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

const newBlock = `<div class="hero-brand-card fade-in">
          <h1>\${brandName.replace(' ', '<br/>')}</h1>
          <div class="subtitle">\${city || 'PARIS'}</div>
        </div>

        <div class="hero-text-content fade-in fade-in-delay-1">
          <h2>\${i18n.heroTitle}</h2>
          <p>\${i18n.heroDesc}</p>
        </div>
        
        <a href="#catalog" class="btn-full-width fade-in fade-in-delay-2">\${i18n.heroBtn}</a>`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync('services/templates/outlandHomesTemplate.js', content);
