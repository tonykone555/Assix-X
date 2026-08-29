const fs = require('fs');
let content = fs.readFileSync('services/siteTemplate.ts', 'utf8');

const hiddenForm = `
  <!-- HIDDEN NETLIFY FORM FOR QUOTES -->
  <form name="quote-request" netlify netlify-honeypot="bot-field" hidden>
    <input type="text" name="step1" />
    <input type="text" name="step2" />
    <input type="text" name="name" />
    <input type="tel" name="phone" />
  </form>
  <!-- DYNAMICALLY ORDERED BODY SECTIONS -->`;

content = content.replace('<!-- DYNAMICALLY ORDERED BODY SECTIONS -->', hiddenForm);
fs.writeFileSync('services/siteTemplate.ts', content);
