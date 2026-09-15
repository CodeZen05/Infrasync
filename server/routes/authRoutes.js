import { Router } from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  logout 
} from '../controllers/authController.js';
import { 
  validateSignup, 
  validateLogin 
} from '../middleware/validateMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Public auth endpoints
router.post('/register', validateSignup, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Protected auth endpoints
router.get('/me', authenticate, getCurrentUser);

export default router;
