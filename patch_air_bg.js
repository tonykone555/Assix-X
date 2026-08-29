const fs = require('fs');
let content = fs.readFileSync('services/templates/airTemplate.js', 'utf8');

// Replace the Hero Section logic
content = content.replace(
  /\$\{content\.model3dUrl && content\.show3dHero \? `[\s\S]*?<model-viewer[\s\S]*?<\/model-viewer>[\s\S]*?` : `[\s\S]*?<img class="hero-bg-image"[\s\S]*?`\}/,
  `<img class="hero-bg-image" src="\${heroImage}" alt="\${companyName}">
    \${content.model3dUrl && content.show3dHero ? \`
      <model-viewer 
        class="hero-bg-image" 
        src="\${content.model3dUrl}" 
        camera-controls 
        auto-rotate 
        shadow-intensity="1" 
        style="width: 100%; height: 100%; position: absolute; inset: 0; background-color: transparent; z-index: 1;">
      </model-viewer>
    \` : ''}`
);

// Fix the overlay z-index
content = content.replace(
  /<div class="hero-overlay" style="[^"]*"><\/div>/,
  `<div class="hero-overlay" style="z-index: 2; pointer-events: none; \${content.model3dUrl && content.show3dHero ? 'display: none;' : ''}"></div>`
);

fs.writeFileSync('services/templates/airTemplate.js', content);
