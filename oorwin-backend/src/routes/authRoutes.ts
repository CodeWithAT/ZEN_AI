import { Router } from 'express';
// Use curly braces to import specific named exports
import { register, login } from '../controllers/authController';

const router = Router();

// Ensure these functions are NOT undefined
console.log("Auth Handlers:", { register, login }); 

router.post('/register', register);
router.post('/login', login);

export default router;
