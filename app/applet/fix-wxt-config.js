const fs = require('fs');
const path = require('path');

const configPath = '/tmp/page-agent/packages/extension/wxt.config.js';
if (!fs.existsSync(configPath)) {
  console.error('File not found at:', configPath);
  process.exit(1);
}

let content = fs.readFileSync(configPath, 'utf8');

// Replace the syntax error in externally_connectable
const badSegment = `\t\texternally_connectable: {
\t\t\tmatches: ['http://localhost/*'],
\t\t\t'https://assix-y.onrender.com/*',
            'https://*.onrender.com/*'
\t\t},`;

const fixedSegment = `\t\texternally_connectable: {
\t\t\tmatches: [
\t\t\t\t'http://localhost/*',
\t\t\t\t'https://assix-y.onrender.com/*',
\t\t\t\t'https://*.onrender.com/*',
\t\t\t\t'https://ais-dev-2oavfz2ihz7aw4zh567kr6-18900512743.europe-west2.run.app/*',
\t\t\t\t'https://ais-pre-2oavfz2ihz7aw4zh567kr6-18900512743.europe-west2.run.app/*'
\t\t\t]
\t\t},`;

if (content.includes(badSegment)) {
  content = content.replace(badSegment, fixedSegment);
} else {
  // Try relaxed regex replacement if there are spaces/formatting differences
  content = content.replace(
    /externally_connectable:\s*\{[\s\S]*?matches:[\s\S]*?http:\/\/localhost\/\*[\s\S]*?onrender\.com\/\*[\s\S]*?\}/,
    `externally_connectable: {
\t\t\tmatches: [
\t\t\t\t'http://localhost/*',
\t\t\t\t'https://assix-y.onrender.com/*',
\t\t\t\t'https://*.onrender.com/*',
\t\t\t\t'https://ais-dev-2oavfz2ihz7aw4zh567kr6-18900512743.europe-west2.run.app/*',
\t\t\t\t'https://ais-pre-2oavfz2ihz7aw4zh567kr6-18900512743.europe-west2.run.app/*'
\t\t\t]
\t\t}`
  );
}

fs.writeFileSync(configPath, content, 'utf8');
console.log('Successfully fixed wxt.config.js!');
