import express from 'express';
import { getPublicConfig, updatePlatformConfig, getLiveWinners } from '../controllers/configController.js';

const router = express.Router();

router.get('/public', getPublicConfig);
router.put('/update', updatePlatformConfig);
router.get('/live-winners', getLiveWinners);

export default router;
