import express from 'express';
import { getLuckyWheelStatus, spinLuckyWheel } from '../controllers/luckyWheelController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/status', optionalAuth, getLuckyWheelStatus);
router.post('/spin', protect, spinLuckyWheel);

export default router;
