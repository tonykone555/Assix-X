const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  const distDir = path.join(__dirname, 'dist');
  
  // Ensure fresh dist folder
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  console.log('Copying static assets...');
  // Copy static files
  fs.copyFileSync(path.join(__dirname, 'manifest.json'), path.join(distDir, 'manifest.json'));
  fs.copyFileSync(path.join(__dirname, 'src/popup.html'), path.join(distDir, 'popup.html'));
  fs.copyFileSync(path.join(__dirname, 'src/popup.css'), path.join(distDir, 'popup.css'));

  console.log('Bundling scripts with esbuild...');
  // Build TS and TSX scripts
  await esbuild.build({
    entryPoints: [
      path.join(__dirname, 'src/background.ts'),
      path.join(__dirname, 'src/content.ts'),
      path.join(__dirname, 'src/popup.tsx')
    ],
    bundle: true,
    outdir: distDir,
    platform: 'browser',
    target: ['chrome58'],
    minify: false, // keep readable for debug/verification
    sourcemap: true,
  });

  console.log('Build completed successfully! Assets outputted to:', distDir);
}

build().catch((err) => {
  console.error('Build execution failed:', err);
  process.exit(1);
});
