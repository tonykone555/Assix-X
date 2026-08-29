const fs = require('fs');
const parser = require('@babel/parser');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// The file is currently ending at line 10062 with some closing tags.
// Let's strip the closing tags from my naive script:
let lines = content.split('\n');
let cleanLines = lines.slice(0, 10062);
let cleanContent = cleanLines.join('\n');

const closures = [")", "}", "</div>", "</form>"];
function tryFix(str, depth) {
  if (depth > 25) return null;
  try {
    parser.parse(str + "\n  );\n}\nexport default App;", {
      sourceType: "module",
      plugins: ["jsx", "typescript"]
    });
    return str;
  } catch (e) {
    if (e.message.includes("Unexpected token")) {
      // try adding different closures
      for (let c of closures) {
        let res = tryFix(str + "\n" + c, depth + 1);
        if (res) return res;
      }
    }
  }
  return null;
}

let result = tryFix(cleanContent, 0);
if (result) {
  fs.writeFileSync('src/App.tsx', result + "\n  );\n}\nexport default App;");
  console.log("Fixed!");
} else {
  console.log("Failed");
}
