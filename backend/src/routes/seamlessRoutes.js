import express from 'express';
import {
  getSeamlessBalance,
  seamlessDebit,
  seamlessCredit,
  seamlessRollback,
} from '../controllers/seamlessController.js';

const router = express.Router();

/**
 * 🔒 B2B Seamless Wallet Aggregator Endpoints
 * Called by external game servers (Pragmatic, Spribe, JILI, etc.)
 */
router.post('/balance', getSeamlessBalance);
router.post('/debit', seamlessDebit);
router.post('/credit', seamlessCredit);
router.post('/rollback', seamlessRollback);

export default router;
