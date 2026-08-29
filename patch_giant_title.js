const fs = require('fs');
let content = fs.readFileSync('services/templates/outlandHomesTemplate.js', 'utf8');

// Add giant title CSS if missing
if (!content.includes('.hero-giant-title {')) {
  const cssToInsert = `
    .hero-giant-title {
      position: absolute;
      top: 15%;
      left: 40px;
      right: 40px;
      font-size: clamp(80px, 16vw, 180px);
      font-weight: 800;
      color: rgba(255,255,255,0.05);
      line-height: 0.8;
      text-transform: uppercase;
      z-index: 1;
      pointer-events: none;
    }
    .hero-giant-title span {
      display: block;
      color: transparent;
      -webkit-text-stroke: 1px rgba(255,255,255,0.2);
    }
    .hero-bottom-content {
`;
  content = content.replace(/\.hero-bottom-content \{/, cssToInsert);
}

// Add giant title HTML in both hero sections after <nav>
const scrubNav = `          <a href="#contact" class="btn-outline">\${i18n.bookViewing}</a>
        </nav>`;
const newScrubNav = scrubNav + `\n\n        <div class="hero-giant-title fade-in">\${i18n.giantWordMain}<br><span>\${i18n.giantWordSub}</span></div>`;

const nonScrubNav = `      <a href="#contact" class="btn-outline">\${i18n.bookViewing}</a>
    </nav>`;
const newNonScrubNav = nonScrubNav + `\n\n    <div class="hero-giant-title fade-in">\${i18n.giantWordMain}<br><span>\${i18n.giantWordSub}</span></div>`;

content = content.replace(scrubNav, newScrubNav);
content = content.replace(nonScrubNav, newNonScrubNav);

fs.writeFileSync('services/templates/outlandHomesTemplate.js', content);
