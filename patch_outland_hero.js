const fs = require('fs');
let content = fs.readFileSync('services/templates/outlandHomesTemplate.js', 'utf8');

// 1. Fix CSS
const cssToInsert = `
    .hero-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      position: relative;
      z-index: 10;
      margin-top: auto;
      gap: 40px;
    }
    .hero-stat-cards {
      display: flex;
      gap: 20px;
    }
    .stat-card-large {
      width: 260px;
      height: 340px;
      border-radius: var(--radius-lg);
      background: #111;
      position: relative;
      overflow: hidden;
    }
    .stat-card-large img { width: 100%; height: 100%; object-fit: cover; }
    .stat-card-large .num { font-size: 26px; font-weight: 700; text-align: center; }
    .stat-card-large .sub { font-size: 10px; color: var(--text-muted); text-align: center; line-height: 1.2; margin-top: 4px; }
`;

content = content.replace(/\.stat-card-large img \{[\s\S]*?margin-top: 4px; \}/, cssToInsert);

// 2. Fix HTML for both Hero sections
// They currently use:
// <div class="hero-text-content fade-in fade-in-delay-1"> ... </div>
// <a href="#catalog" class="btn-full-width fade-in fade-in-delay-2">${i18n.heroBtn}</a>

const scrubHtmlOld = `<div class="hero-text-content fade-in fade-in-delay-1">
          <h2>\${i18n.heroTitle}</h2>
          <p>\${i18n.heroDesc}</p>
        </div>
        
        <a href="#catalog" class="btn-full-width fade-in fade-in-delay-2">\${i18n.heroBtn}</a>`;

const nonScrubHtmlOld = `<div class="hero-text-content fade-in fade-in-delay-1">
          <h2>\${i18n.heroTitle}</h2>
          <p>\${i18n.heroDesc}</p>
        </div>
        
        <a href="#catalog" class="btn-full-width fade-in fade-in-delay-2">\${i18n.heroBtn}</a>`;

const newHtml = `
        <div class="hero-bottom-content">
          <div class="hero-text-content fade-in fade-in-delay-1">
            <h2>\${i18n.heroTitle}</h2>
            <p>\${i18n.heroDesc}</p>
            <a href="#catalog" class="btn-full-width" style="margin-top: 20px;">\${i18n.heroBtn}</a>
          </div>

          <div class="hero-stat-cards fade-in fade-in-delay-2">
            <div class="stat-card-large">
              \${currentContent.model3dUrl && currentContent.show3dHero ? \`
                <model-viewer 
                  id="hero3dModel" 
                  src="\${currentContent.model3dUrl}" 
                  camera-controls 
                  auto-rotate 
                  shadow-intensity="1" 
                  style="width: 100%; height: 100%; position: absolute; inset: 0; background-color: transparent; z-index: 2;">
                </model-viewer>
              \` : \`
                <img src="\${statCardImg}" alt="Feature Highlight">
              \`}
              <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); padding: 16px; color: #fff; z-index: 3;">
                <div class="num">\${i18n.stat1Num}</div>
                <div class="sub">\${i18n.stat1Sub}</div>
              </div>
            </div>
          </div>
        </div>`;

// Replace both occurrences
content = content.replace(scrubHtmlOld, newHtml);
content = content.replace(nonScrubHtmlOld, newHtml);

fs.writeFileSync('services/templates/outlandHomesTemplate.js', content);
