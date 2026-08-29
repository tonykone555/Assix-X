const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

let block = lines.slice(9453, 10062).join('\n');
fs.writeFileSync('branch.tsx', "export default function Test() { return (\n" + block + "\n); }");
