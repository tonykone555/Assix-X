const fs = require('fs');
const content = fs.readFileSync('src/App.tsx');
let lastTextIndex = 0;
for (let i = 0; i < content.length; i++) {
  const byte = content[i];
  // Normal text characters: tab, newline, carriage return, or printable ascii
  if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
    lastTextIndex = i;
  } else {
    // maybe utf-8?
    // Let's just find a long sequence of non-printable chars.
    let nonPrintable = 0;
    for (let j = 0; j < 50; j++) {
      if (i + j < content.length) {
         const b = content[i+j];
         if (b < 32 && b !== 9 && b !== 10 && b !== 13) nonPrintable++;
         if (b > 127) nonPrintable++;
      }
    }
    if (nonPrintable > 20) {
      console.log('Corruption starts around index:', i);
      console.log('Last valid text:', content.toString('utf8', i - 200, i));
      break;
    }
  }
}
