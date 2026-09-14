import 'dotenv/config';
import express, { Express } from 'express';
import contactRouter from './routes/contact';
import adminRouter from './routes/admin';
import publicDataRouter from './routes/publicData';
import { ECOSYSTEM_PRODUCTS } from '../src/config/ecosystem';

export function createExpressApp(): Express {
  const app = express();

  // 1. Comprehensive CORS headers for cross-origin deployments (Netlify frontend -> Cloud Run / Backend)
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control'
    );
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // 2. Request body parsing
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // 3. Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // 4. API Endpoints
  app.get(['/api/health', '/api/ping', '/.netlify/functions/api/health', '/.netlify/functions/api/ping'], (req, res) => {
    res.json({
      status: 'ok',
      service: 'DynoDazzle API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'production',
      platform: process.env.NETLIFY ? 'netlify_functions' : 'node_server',
    });
  });

  app.get(['/api/ecosystem', '/.netlify/functions/api/ecosystem'], (req, res) => {
    res.json({
      success: true,
      data: ECOSYSTEM_PRODUCTS,
    });
  });

  // Mount routers for standard paths and Netlify functions path
  app.use('/api', contactRouter);
  app.use('/api', publicDataRouter);
  app.use('/api/admin', adminRouter);

  // Also support requests that hit /.netlify/functions/api directly
  app.use('/.netlify/functions/api', contactRouter);
  app.use('/.netlify/functions/api', publicDataRouter);
  app.use('/.netlify/functions/api/admin', adminRouter);

  return app;
}

export default createExpressApp;
