const fs = require('fs');
const prettier = require('prettier');

let content = fs.readFileSync('src/App.tsx', 'utf8');
let lines = content.split('\n');
let target = -1;
for (let i = 8500; i < lines.length; i++) {
  if (lines[i].includes(') : activeTask ? (')) {
    target = i;
    break;
  }
}
let baseLines = lines.slice(0, target);
let baseContent = baseLines.join('\n');

async function tryPermutations() {
  let closures = [") : null}", ")}", "</div>"];
  
  let queue = [{str: [], len: 0}];
  let tested = 0;
  
  while (queue.length > 0 && tested < 10000) {
    let curr = queue.shift();
    
    let testContent = baseContent + '\n' + curr.str.join('\n') + "\n  );\n}\nexport default App;";
    
    try {
      await prettier.format(testContent, { filepath: 'src/App.tsx' });
      console.log("SUCCESS!", curr.str.join(' '));
      fs.writeFileSync('src/App.tsx', testContent);
      return;
    } catch(e) {
      tested++;
    }
    
    if (curr.len < 12) {
      for (let c of closures) {
        queue.push({str: [...curr.str, c], len: curr.len + 1});
      }
    }
  }
  console.log("All failed");
}

tryPermutations();
