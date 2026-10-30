import fs from 'fs';
import path from 'path';

// 1. Generate dist/404.html for GitHub Pages SPA routing
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'dist/404.html');
  fs.copyFileSync('dist/index.html', '404.html');
}

// 2. Mirror dist/assets into root assets/ so main branch hosts compiled JS/CSS
if (fs.existsSync('dist/assets')) {
  fs.cpSync('dist/assets', 'assets', { recursive: true });
}

// 3. Mirror dist into docs/ so GitHub Pages /docs folder option works instantly
fs.cpSync('dist', 'docs', { recursive: true });

// 4. Mirror dist/data into root data/ so root-based paths resolve
if (fs.existsSync('dist/data')) {
  fs.cpSync('dist/data', 'data', { recursive: true });
}

console.log('✓ Postbuild artifacts mirrored to /assets, /docs, /data, and 404.html');
