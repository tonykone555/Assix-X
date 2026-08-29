const fs = require('fs');

let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
// Let's truncate at 9452, which is `searchStep === 'complete' ? (`
let newLines = lines.slice(0, 9452);
newLines.push(
  "              ) : null}", // closes activeTask
  "            </div>",
  "          ) : null}", // closes activeTab === 'leads'
  "        </div>",
  "      </div>",
  "    </div>",
  "  );",
  "}",
  "export default App;"
);

fs.writeFileSync('src/App.test.tsx', newLines.join('\n'));
