const fs = require('fs');
const path = require('path');

const filePath = '/tmp/page-agent/packages/extension/src/agent/constants.ts';
if (!fs.existsSync(filePath)) {
  console.error('File not found at:', filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// We want to find the first DEMO_CONFIG definition and remove it, keeping the second one.
const pattern1 = `export const DEMO_CONFIG: LLMConfig = {
\tbaseURL: DEMO_BASE_URL,
\tmodel: DEMO_MODEL,
}`;

if (content.includes(pattern1)) {
  content = content.replace(pattern1, '');
  console.log('Found and removed duplicate DEMO_CONFIG using exact match!');
} else {
  // Let's do a regex replacement for any variant
  content = content.replace(/export const DEMO_CONFIG: LLMConfig = \{[\s\S]*?model: DEMO_MODEL,[\s\S]*?\}/, '');
  console.log('Cleaned up duplicate DEMO_CONFIG via regex!');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully resolved duplicate DEMO_CONFIG in constants.ts!');
