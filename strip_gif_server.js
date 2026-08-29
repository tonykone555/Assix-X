const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Remove imports
content = content.replace(/import \{ generateWebsiteGif, captureGoogleScreenshot \} from '\.\/services\/gifGeneratorService';\n/, '');
content = content.replace(/import \{ generateUrlboxGifUrl, fetchUrlboxGif \} from '\.\/services\/urlboxService';\n/, '');

// Remove Website animated GIF preview generator block
content = content.replace(/\/\/ Website animated GIF preview generator[\s\S]*?res\.status\(500\)\.send\(err\.message \|\| 'Error generating GIF'\);\n\}\);\n\n/g, '');

// Remove Website GIF POST Route
content = content.replace(/app\.post\('\/api\/website\/:siteId\/generate-gif'[\s\S]*?\}\);\n\n/g, '');

// Remove URLbox GIF Route
content = content.replace(/\/\/ Outsourced URLbox Animated GIF Generator Endpoint \(GET\)[\s\S]*?res\.status\(500\)\.send\(err\.message \|\| 'Error generating URLbox GIF'\);\n\}\);\n\n/g, '');

fs.writeFileSync('server.ts', content);
