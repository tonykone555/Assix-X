const fs = require('fs');

let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let code = lines.slice(0, 10062).join('\n');

let stack = [];
let i = 0;
while (i < code.length) {
  let c = code[i];
  if (code.slice(i, i+4) === '<div' && !code.slice(i, i+6).includes('/>')) {
    stack.push('</div>');
    i += 4;
  } else if (code.slice(i, i+6) === '</div>') {
    let idx = stack.lastIndexOf('</div>');
    if (idx !== -1) stack.splice(idx, 1);
    i += 6;
  } else if (c === '(') {
    stack.push(')');
    i++;
  } else if (c === '{') {
    stack.push('}');
    i++;
  } else if (c === ')') {
    let idx = stack.lastIndexOf(')');
    if (idx !== -1) stack.splice(idx, 1);
    i++;
  } else if (c === '}') {
    let idx = stack.lastIndexOf('}');
    if (idx !== -1) stack.splice(idx, 1);
    i++;
  } else {
    i++;
  }
}

stack.reverse();
let newCode = code + '\n' + stack.join('\n') + '\n; export default App;';

fs.writeFileSync('src/App.tsx', newCode);
console.log("Written!");
