// @ts-nocheck
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { exec } from 'node:child_process';

/**
 * Custom Vite Dev Middleware:
 * Allows the Admin Panel to write changes permanently to disk in `src/data/portfolio.ts`
 * and deploy live to GitHub Pages with zero user tokens required.
 */
function savePortfolioPlugin(): Plugin {
  return {
    name: 'save-portfolio-plugin',
    configureServer(server) {
      server.middlewares.use('/__api/save-portfolio', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              if (payload.sourceCode) {
                const targetFile = path.resolve(__dirname, 'src/data/portfolio.ts');
                fs.writeFileSync(targetFile, payload.sourceCode, 'utf8');

                if (payload.data) {
                  const targetJson = path.resolve(__dirname, 'public/data/portfolio.json');
                  fs.mkdirSync(path.dirname(targetJson), { recursive: true });
                  fs.writeFileSync(targetJson, JSON.stringify(payload.data, null, 2), 'utf8');
                }

                if (payload.deployLive) {
                  exec(
                    'npm run build && git add -A && git commit -m "feat(data): update portfolio via admin panel" && git push origin main && npx gh-pages -d dist',
                    { cwd: __dirname },
                    (execErr, stdout, stderr) => {
                      res.setHeader('Content-Type', 'application/json');
                      if (execErr) {
                        res.end(
                          JSON.stringify({
                            success: true,
                            message: 'Saved to disk. (Deploy notice: ' + (stderr || execErr.message) + ')',
                          })
                        );
                      } else {
                        res.end(
                          JSON.stringify({
                            success: true,
                            message: 'Saved to disk and published live worldwide via GitHub Pages!',
                          })
                        );
                      }
                    }
                  );
                  return;
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: true,
                    message: 'Source code permanently written to src/data/portfolio.ts',
                  })
                );
                return;
              }
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Missing sourceCode parameter' }));
            } catch (err: unknown) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: (err as Error).message }));
            }
          });
        } else {
          res.statusCode = 404;
          res.end();
        }
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), savePortfolioPlugin()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] },
      },
    },
  },
});
