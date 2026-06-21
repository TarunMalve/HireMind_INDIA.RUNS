import { Router, Request, Response } from 'express';
import candidateRoutes from './candidates';
import jobRoutes from './jobs';
import applicationRoutes from './applications';
import aiRoutes from './ai';

const router = Router();

// Health check — no auth required
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '2.0.0',
    },
  });
});

// Mount sub-routers
router.use('/candidates', candidateRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/ai', aiRoutes);

export default router;
