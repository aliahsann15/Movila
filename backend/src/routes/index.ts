import { Router, Request, Response } from 'express';

const router = Router();

// Base API route
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Movila API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      metrics: '/api/metrics'
    }
  });
});

export default router;
