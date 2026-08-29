const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let block = lines.slice(9049, 9452); // lines 9050 to 9452

let count = 0;
let stack = [];
for (let i = 0; i < block.length; i++) {
  let line = block[i];
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '(') {
      count++;
      stack.push({line: i + 9050, col: j + 1});
    } else if (line[j] === ')') {
      count--;
      stack.pop();
    }
  }
}
console.log("Remaining parens:", stack);
