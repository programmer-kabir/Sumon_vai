import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
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
import {
  getAdminReports,
  getPlayerDossier,
  updatePlayerLimits,
} from '../controllers/adminReports.js';

const router = express.Router();

// 🔒 STRICT SECURITY GUARD: ALL ADMIN ROUTES REQUIRE AUTH & ADMIN ROLE
router.use(protect, adminOnly);

// Stats & Platform Goals
router.get('/stats', getAdminStats);

// Comprehensive Financial & Daily/Monthly Reports
router.get('/reports', getAdminReports);

// Game Profit / Loss & RTP Analytics
router.get('/games-analytics', getGameAnalytics);
router.get('/game-transactions', getRecentGameTransactions);

// Player Management & Individual Dossier
router.get('/players', getPlayersList);
router.get('/players/:id/dossier', getPlayerDossier);
router.put('/players/:id/limits', updatePlayerLimits);
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
