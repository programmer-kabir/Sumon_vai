import express from 'express';
import { registerUser, loginUser, autoGuestRegister, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes (matches CK44 /wps pattern)
router.post('/member/register', registerUser);
router.post('/member/register/autoUsername', autoGuestRegister);
router.post('/session/login', loginUser);

// Protected routes
router.get('/session/me', protect, getMe);

export default router;
