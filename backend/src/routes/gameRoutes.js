import express from 'express';
import { getGames, launchGame } from '../controllers/gameController.js';

const router = express.Router();

router.get('/', getGames);
router.post('/launch', launchGame);

export default router;
