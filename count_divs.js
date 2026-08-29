const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

let openDivs = (content.match(/<div(\s|>)/g) || []).length;
let closeDivs = (content.match(/<\/div>/g) || []).length;
console.log('Open:', openDivs, 'Close:', closeDivs, 'Diff:', openDivs - closeDivs);

let openParen = (content.match(/\{[^}]*\(/g) || []).length; 
