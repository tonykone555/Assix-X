const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// line 10063 (index 10062) is currently `              )}`
if (lines[10062].includes(')}')) {
  lines[10062] = "              ) : null}";
}
fs.writeFileSync('src/App.tsx', lines.join('\n'));
