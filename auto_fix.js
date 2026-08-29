const fs = require('fs');
const { execSync } = require('child_process');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Truncate at line 10062
let lines = content.split('\n');
let target = -1;
for (let i = 10050; i < lines.length; i++) {
  if (lines[i].includes(') : null}')) {
    target = i;
    break;
  }
}
let baseLines = lines.slice(0, target);
let baseContent = baseLines.join('\n');

const testClosures = [
  ") : null} </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> ); } export default App;",
  ") : null} )} </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> ); } export default App;",
  ") : null} )} )} </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> ); } export default App;",
  ") : null} )} )} )} </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> ); } export default App;",
  "</div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> </div> ); } export default App;",
];

for (let closure of testClosures) {
  let testContent = baseContent + '\n' + closure;
  fs.writeFileSync('src/App.test.tsx', testContent);
  try {
    execSync('npx prettier src/App.test.tsx', { stdio: 'ignore' });
    console.log("SUCCESS with closure:", closure);
    fs.writeFileSync('src/App.tsx', testContent);
    process.exit(0);
  } catch (e) {
    // console.log("Failed");
  }
}
console.log("All failed");
