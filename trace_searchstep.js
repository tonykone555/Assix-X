const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let block = lines.slice(9452, 10062);

let count = 0;
for (let i = 0; i < block.length; i++) {
  let line = block[i];
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '(') count++;
    else if (line[j] === ')') count--;
  }
  if (count === 0 && i > 0) {
    console.log("Closed at line:", i + 9453);
    break;
  }
}
