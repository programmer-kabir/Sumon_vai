import express from 'express';
import { requestDeposit, requestWithdrawal, getTransactionHistory } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/deposit', protect, requestDeposit);
router.post('/withdraw', protect, requestWithdrawal);
router.get('/history', protect, getTransactionHistory);

export default router;
