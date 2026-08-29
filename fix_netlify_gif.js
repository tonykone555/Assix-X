const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Replace URLbox logic in real Netlify deploy
content = content.replace(/const urlboxGifUrl = generateUrlboxGifUrl\(deployUrl, \{ scroll: true, duration: 4000 \}\);\n\s*\/\/ Trigger background GIF warmup\n\s*fetchUrlboxGif\(deployUrl, \{ scroll: true \}\)\.catch[\s\S]*?\n/, 'const urlboxGifUrl = "";\n');

// Replace URLbox logic in mock Netlify deploy
content = content.replace(/const urlboxGifUrl = generateUrlboxGifUrl\(mockDeployUrl, \{ scroll: true, duration: 4000 \}\);/, 'const urlboxGifUrl = "";');

fs.writeFileSync('server.ts', content);
