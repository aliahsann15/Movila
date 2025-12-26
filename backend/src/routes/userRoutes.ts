import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Users collection
router.get('/', userController.getAll);
router.post('/', userController.create);

// Single user operations
router.get('/:id', userController.getById);
router.put('/:id', requireAuth, userController.updateById);
router.delete('/:id', requireAuth, userController.remove);

// Saved movies
router.get('/:id/saved', requireAuth, userController.getSavedMovies);
router.post('/:id/saved', requireAuth, userController.addSavedMovie);
router.delete('/:id/saved/:movieId', requireAuth, userController.removeSavedMovie);

export default router;

