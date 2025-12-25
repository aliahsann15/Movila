import { Router, Request, Response } from 'express';

import exampleRoutes from './example.routes';

const router = Router();

// Mount route modules
router.use('/example', exampleRoutes);

// Base API route
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Movila API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      example: '/api/example'
    }
  });
});

export default router;
