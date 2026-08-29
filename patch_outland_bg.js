const fs = require('fs');
let content = fs.readFileSync('services/templates/outlandHomesTemplate.js', 'utf8');

// Replace the Hero Section logic for model-viewer
content = content.replace(
  /\$\{currentContent\.model3dUrl && currentContent\.show3dHero \? `[\s\S]*?<model-viewer[\s\S]*?<\/model-viewer>[\s\S]*?` : `[\s\S]*?<img class="hero-bg"[\s\S]*?`\}/,
  `<img class="hero-bg" id="heroBgImg" src="\${heroBgImg}" alt="\${brandName}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    \${currentContent.model3dUrl && currentContent.show3dHero ? \`
      <model-viewer 
        class="hero-bg" 
        id="hero3dModel" 
        src="\${currentContent.model3dUrl}" 
        camera-controls 
        auto-rotate 
        shadow-intensity="1" 
        style="width: 100%; height: 100%; position: absolute; inset: 0; background-color: transparent; z-index: 2;">
      </model-viewer>
    \` : ''}`
);

fs.writeFileSync('services/templates/outlandHomesTemplate.js', content);
