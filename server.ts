import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import contactRouter from './server/routes/contact';
import adminRouter from './server/routes/admin';
import publicDataRouter from './server/routes/publicData';
import { ECOSYSTEM_PRODUCTS } from './src/config/ecosystem';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parser with size limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Basic security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'DynoDazzle API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.get('/api/ecosystem', (req, res) => {
    res.json({
      success: true,
      data: ECOSYSTEM_PRODUCTS,
    });
  });

  app.use('/api', contactRouter);
  app.use('/api', publicDataRouter);
  app.use('/api/admin', adminRouter);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DynoDazzle] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
