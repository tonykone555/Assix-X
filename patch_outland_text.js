const fs = require('fs');
let content = fs.readFileSync('services/templates/outlandHomesTemplate.js', 'utf8');

content = content.replace(
  /<h1>\$\{i18n\.giantWordMain\}<\/h1>[\s]*<div class="subtitle">\$\{i18n\.giantWordSub\}<\/div>/g,
  `<h1>\$\{brandName.replace(' ', '<br/>')\}</h1>
          <div class="subtitle">\$\{city || 'PARIS'\}</div>`
);

fs.writeFileSync('services/templates/outlandHomesTemplate.js', content);
