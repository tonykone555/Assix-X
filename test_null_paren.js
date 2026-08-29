const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
lines[10062] = "              ) : null )}";
fs.writeFileSync('src/App.tsx', lines.join('\n'));
