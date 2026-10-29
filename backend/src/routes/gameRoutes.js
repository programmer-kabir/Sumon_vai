import express from 'express';
import { getGames, launchGame, playGameRound } from '../controllers/gameController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getGames);
router.post('/launch', launchGame);
router.post('/play-round', optionalAuth, playGameRound);

export default router;
