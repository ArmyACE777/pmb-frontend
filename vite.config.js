import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';
import net from 'net';

function sharedSyncPlugin() {
  const syncFile = path.resolve(__dirname, './.shared_sync_state.json');
  const cmsSyncFile = path.resolve(__dirname, './.cms_sync_state.json');

  const mountJsonSync = (server, routePath, filePath) => {
    server.middlewares.use(routePath, (req, res, next) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            fs.writeFileSync(filePath, body, 'utf8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      } else if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        if (fs.existsSync(filePath)) {
          try {
            res.end(fs.readFileSync(filePath, 'utf8'));
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
  };

  return {
    name: 'shared-sync-plugin',
    configureServer(server) {
      mountJsonSync(server, '/api/shared-sync', syncFile);
      mountJsonSync(server, '/api/cms-sync', cmsSyncFile);
      server.middlewares.use('/api/gateway-ping', (_req, res) => {
        const socket = new net.Socket();
        let settled = false;
        const finish = (online) => {
          if (settled) return;
          settled = true;
          socket.destroy();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ online }));
        };
        socket.setTimeout(300);
        socket.once('connect', () => finish(true));
        socket.once('timeout', () => finish(false));
        socket.once('error', () => finish(false));
        socket.connect(8000, '127.0.0.1');
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
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
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
