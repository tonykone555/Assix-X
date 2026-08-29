const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n').slice(-30);
console.log(lines.join('\n'));
