const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

let target = -1;
for (let i = 8500; i < lines.length; i++) {
  if (lines[i].includes(') : activeTask ? (')) {
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

fs.writeFileSync('src/App.tsx', newLines.join('\n'));
