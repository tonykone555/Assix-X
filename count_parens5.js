const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let block = lines.slice(0, 10062).join('\n');

let openP = (block.match(/\(/g) || []).length;
let closeP = (block.match(/\)/g) || []).length;
console.log('Open (:', openP, 'Close ):', closeP, 'Diff:', openP - closeP);

let openD = (block.match(/<div(\s|>)/g) || []).length;
let closeD = (block.match(/<\/div>/g) || []).length;
console.log('Open div:', openD, 'Close div:', closeD, 'Diff:', openD - closeD);

let openB = (block.match(/\{/g) || []).length;
let closeB = (block.match(/\}/g) || []).length;
console.log('Open {:', openB, 'Close }:', closeB, 'Diff:', openB - closeB);
