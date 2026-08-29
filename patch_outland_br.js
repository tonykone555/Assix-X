const fs = require('fs');
let content = fs.readFileSync('services/templates/outlandHomesTemplate.js', 'utf8');

content = content.replace(
  /brandName\.replace\(' ', '<br\/>'\)/g,
  `brandName.split(' ').join('<br/>')`
);

fs.writeFileSync('services/templates/outlandHomesTemplate.js', content);
