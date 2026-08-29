const fs = require('fs');
let content = fs.readFileSync('services/templates/outlandHomesTemplate.js', 'utf8');

const oldCSS = `    .stat-card-large img {

    .stat-card-large .num { font-size: 26px; font-weight: 700; text-align: center; }`;

const newCSS = `    .stat-card-large img { width: 100%; height: 100%; object-fit: cover; }

    .stat-card-large .num { font-size: 26px; font-weight: 700; text-align: center; }`;

content = content.replace(oldCSS, newCSS);
fs.writeFileSync('services/templates/outlandHomesTemplate.js', content);
