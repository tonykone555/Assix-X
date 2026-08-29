const fs = require('fs');
let content = fs.readFileSync('services/siteTemplate.ts', 'utf8');

// The outer return is using backticks. I need to make sure my innerHTML strings use \` instead of actual unescaped backticks.
// Wait, my patch_template.js literally had \` in the template string!
// \` in a node string literal evaluates to just a backtick \` in the file.
// I should have used \\\` in patch_template.js!

// Let's replace the problematic backticks in the injected script with \\\`
const startIdx = content.indexOf('// Configuration based on niche');
if (startIdx !== -1) {
  const endIdx = content.indexOf('</script>', startIdx);
  let scriptBody = content.substring(startIdx, endIdx);
  scriptBody = scriptBody.replace(/\`/g, '\\\`');
  content = content.substring(0, startIdx) + scriptBody + content.substring(endIdx);
  fs.writeFileSync('services/siteTemplate.ts', content);
}
