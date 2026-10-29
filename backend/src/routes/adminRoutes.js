import express from 'express';
import {
  getAdminStats,
  getGameAnalytics,
  getRecentGameTransactions,
  getAdminDeposits,
  approveDeposit,
  rejectDeposit,
  getAdminWithdrawals,
  payWithdrawal,
  rejectWithdrawal,
  getPaymentSettings,
  updatePaymentSettings,
  getPlatformLimits,
  updatePlatformLimits,
  getPlayersList,
  adjustPlayerBalance,
  updatePlayerStatus,
  updatePlayerRole,
} from '../controllers/adminController.js';

const router = express.Router();

// Stats & Platform Goals
router.get('/stats', getAdminStats);

// Game Profit / Loss & RTP Analytics
router.get('/games-analytics', getGameAnalytics);
router.get('/game-transactions', getRecentGameTransactions);

// Player Management
router.get('/players', getPlayersList);
router.put('/players/:id/balance', adjustPlayerBalance);
router.put('/players/:id/status', updatePlayerStatus);
router.put('/players/:id/role', updatePlayerRole);

// Financial Management
router.get('/deposits', getAdminDeposits);
router.put('/deposits/:id/approve', approveDeposit);
router.put('/deposits/:id/reject', rejectDeposit);

router.get('/withdrawals', getAdminWithdrawals);
router.put('/withdrawals/:id/pay', payWithdrawal);
router.put('/withdrawals/:id/reject', rejectWithdrawal);

// Configuration & Gateways
router.get('/payment-settings', getPaymentSettings);
router.put('/payment-settings', updatePaymentSettings);
router.get('/limits', getPlatformLimits);
router.put('/limits', updatePlatformLimits);

export default router;
