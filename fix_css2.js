const fs = require('fs');
let content = fs.readFileSync('services/templates/outlandHomesTemplate.js', 'utf8');

const oldStr = `    @media (min-width: 768px) {
      .btn-full-width { max-width: 400px; }
      .hero-section { margin: 20px; padding: 40px; }
    }
    
    .nav-links { display: none; }
    
    .stat-card-large img {`;

const newStr = `    @media (min-width: 768px) {
      .btn-full-width { max-width: 400px; }
      .hero-section { margin: 20px; padding: 40px; }
      .nav-links { display: flex; }
    }
    
    .stat-card-large img {`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('services/templates/outlandHomesTemplate.js', content);
