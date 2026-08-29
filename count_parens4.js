const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let block = lines.slice(9452, 10062).join('\n');

let openP = (block.match(/\(/g) || []).length;
let closeP = (block.match(/\)/g) || []).length;
console.log('Open (:', openP, 'Close ):', closeP, 'Diff:', openP - closeP);
