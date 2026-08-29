const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const textPart = content.substring(0, 523837); // rough estimate
const lines = textPart.split('\n');
console.log(lines.slice(-30).join('\n'));
