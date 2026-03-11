import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// These names MUST match the exports in authController.ts
router.post('/register', register);
router.post('/login', login);

export default router;
