const fs = require('fs');
const path = require('path');
const paths = [
  path.resolve('node_modules/whatsapp-rust-bridge/package.json'),
  path.resolve('node_modules/@whiskeysockets/baileys/node_modules/whatsapp-rust-bridge/package.json')
];
for (const p of paths) {
  if (fs.existsSync(p)) {
    const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!pkg.exports) pkg.exports = {};
    pkg.exports['.'] = {
      import: './dist/index.js',
      require: './dist/index.js',
      default: './dist/index.js'
    };
    fs.writeFileSync(p, JSON.stringify(pkg, null, 2));
    console.log('Patched ' + p);
  }
}
