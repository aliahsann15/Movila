import { Router } from 'express';
import * as metricsController from '../controllers/metricsController.js';

const router = Router();

router.get('/', metricsController.getAll);
router.get('/:id', metricsController.getById);
router.post('/', metricsController.upsert);
router.patch('/:id/increment', metricsController.incrementById);
router.delete('/:id', metricsController.remove);

export default router;
