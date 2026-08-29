const fs = require('fs');

let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let code = lines.slice(0, 10062).join('\n');

// This is a naive stack, but we can do a slightly smarter one.
let stack = [];
for (let i = 0; i < code.length; i++) {
  let c = code[i];
  if (c === '(') stack.push(')');
  else if (c === '{') stack.push('}');
  else if (c === '[') stack.push(']');
  else if (c === '<') {
    // Check if it's <div
    if (code.slice(i, i+4) === '<div') {
      stack.push('</div>');
    } else if (code.slice(i, i+2) === '</') {
      // It's a closing tag
      if (code.slice(i, i+6) === '</div>') {
        // find last </div> in stack
        let idx = stack.lastIndexOf('</div>');
        if (idx !== -1) stack.splice(idx, 1);
      }
    }
  } else if (c === ')' || c === '}' || c === ']') {
    let expected = c;
    let idx = stack.lastIndexOf(expected);
    if (idx !== -1) stack.splice(idx, 1);
  }
}

// Let's print the stack!
console.log("Remaining stack:", stack.join(' '));
