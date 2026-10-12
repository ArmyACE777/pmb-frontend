import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';

function sharedSyncPlugin() {
  const syncFile = path.resolve(__dirname, './.shared_sync_state.json');

  return {
    name: 'shared-sync-plugin',
    configureServer(server) {
      server.middlewares.use('/api/shared-sync', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              fs.writeFileSync(syncFile, body, 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(syncFile)) {
            try {
              res.end(fs.readFileSync(syncFile, 'utf8'));
            } catch {
              res.end(JSON.stringify({}));
            }
          } else {
            res.end(JSON.stringify({}));
          }
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [vue(), sharedSyncPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/ocr-api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ocr-api/, '/internal/ocr'),
        headers: {
          'X-Internal-Token': 'secret-internal-token',
        },
      },
    },
  },
});
