import { Router } from 'express';
import * as exampleController from '../controllers/example.controller';
import { validateExample } from '../middleware/validators';

const router = Router();

// GET /api/example
router.get('/', exampleController.getAll);

// GET /api/example/:id
router.get('/:id', exampleController.getById);

// POST /api/example
router.post('/', validateExample, exampleController.create);

// PUT /api/example/:id
router.put('/:id', validateExample, exampleController.update);

// DELETE /api/example/:id
router.delete('/:id', exampleController.remove);

export default router;
