import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Named exports from the controller are mapped here
router.post('/register', register);
router.post('/login', login);

export default router;
