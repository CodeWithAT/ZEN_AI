import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Named exports from the controller are mapped here
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
