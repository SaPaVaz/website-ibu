import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './src/server/authRoutes.js';
import storeRoutes from './src/server/storeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolvePort(): number {
  const portIndex = process.argv.indexOf('--port');
  if (portIndex !== -1 && process.argv[portIndex + 1]) {
    const cliPort = Number(process.argv[portIndex + 1]);
    if (!Number.isNaN(cliPort) && cliPort > 0) return cliPort;
  }
  const portEq = process.argv.find((arg) => arg.startsWith('--port='));
  if (portEq) {
    const cliPort = Number(portEq.split('=')[1]);
    if (!Number.isNaN(cliPort) && cliPort > 0) return cliPort;
  }
  const envPort = Number(process.env.PORT);
  const nginxPort = Number(process.env.NGINX_PORT);
  if (!Number.isNaN(envPort) && envPort > 0 && envPort !== nginxPort) {
    return envPort;
  }
  const defaultAppPort = Number(process.env.DEFAULT_APP_PORT);
  if (!Number.isNaN(defaultAppPort) && defaultAppPort > 0) {
    return defaultAppPort;
  }
  return 3000;
}

async function startServer() {
  const app = express();
  const PORT = resolvePort();

  app.use(express.json());

  // Mount backend authentication and store status API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/store', storeRoutes);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Mount Vite dev server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Warung Pojok Aro] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
