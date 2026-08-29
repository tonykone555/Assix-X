const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

let target = -1;
for (let i = 10050; i < lines.length; i++) {
  if (lines[i].includes(') : null}')) {
    target = i;
    break;
  }
}

let newLines = lines.slice(0, target);
newLines.push(
  "              ) : null}",
  "            </div>",
  "          </div>",
  "        </div>",
  "      </div>",
  "    </div>",
  "  );",
  "}",
  "export default App;"
);

// We know that `error TS1005: ')' expected.` means we need a `)` before the `}`!
// So let's change `) : null}` to `) : null})}`!
// If there are multiple, maybe `) : null}))}`!
// Let's just output it and see what Prettier says.
