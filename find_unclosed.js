const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

let open = 0;
for (let i = 9049; i < 10062; i++) {
  let line = lines[i];
  for (let char of line) {
    if (char === '(') open++;
    if (char === ')') open--;
  }
  if (open > 2) {
    // maybe too much noise, let's just print open count at each line
    // console.log(i, open);
  }
}
console.log('Final open:', open);
