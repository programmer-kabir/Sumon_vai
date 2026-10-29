import { Wallet } from '../models/Wallet.js';
import { GameTransaction } from '../models/GameTransaction.js';
import { User } from '../models/User.js';
import { demoStore, DEMO_USER_ID, isDemoUser } from '../config/demoStore.js';

/**
 * 🎰 Seamless Wallet Protocol Specification
 * Standard B2B Aggregator Endpoints (Pragmatic, Spribe/Aviator, JILI, PG Soft)
 */

// 1. Get Balance
// POST /api/seamless/balance
// Body: { userId, currency }
export const getSeamlessBalance = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ status: 'ERROR', code: 'INVALID_PARAMS', message: 'userId is required' });
    }

    if (isDemoUser(userId)) {
      return res.status(200).json({
        status: 'OK',
        balance: Number(demoStore.wallet.realBalance.toFixed(2)),
        currency: demoStore.wallet.currency || 'BDT',
      });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(200).json({
        status: 'OK',
        balance: Number(demoStore.wallet.realBalance.toFixed(2)),
        currency: 'BDT',
      });
    }

    return res.status(200).json({
      status: 'OK',
      balance: Number(wallet.realBalance.toFixed(2)),
      currency: wallet.currency || 'BDT',
    });
  } catch (error) {
    // Demo fallback on connection error
    return res.status(200).json({
      status: 'OK',
      balance: Number(demoStore.wallet.realBalance.toFixed(2)),
      currency: 'BDT',
    });
  }
};

// 2. Debit (Bet Placement)
// POST /api/seamless/debit
// Body: { txId, userId, providerId, gameCode, roundId, amount }
export const seamlessDebit = async (req, res) => {
  try {
    const { txId, userId, providerId, gameCode, roundId, amount } = req.body;

    if (!txId || !userId || amount === undefined || amount < 0) {
      return res.status(400).json({ status: 'ERROR', code: 'INVALID_PARAMS', message: 'Invalid debit payload' });
    }

    const betAmount = Number(amount);

    if (isDemoUser(userId)) {
      if (demoStore.wallet.realBalance < betAmount) {
        return res.status(400).json({
          status: 'ERROR',
          code: 'INSUFFICIENT_FUNDS',
          message: 'Insufficient balance to place bet',
          currentBalance: demoStore.wallet.realBalance,
        });
      }
      const prevBal = demoStore.wallet.realBalance;
      demoStore.wallet.realBalance = Number((demoStore.wallet.realBalance - betAmount).toFixed(2));
      demoStore.wallet.wageringCurrent = Number((demoStore.wallet.wageringCurrent + betAmount).toFixed(2));
      demoStore.transactions.unshift({
        _id: `tx_${Date.now()}`,
        txId,
        userId,
        username: demoStore.user.username || 'demo',
        providerId: providerId || 'Pragmatic Play',
        gameCode: gameCode || 'pragmatic_highflyer',
        roundId: roundId || txId,
        type: 'DEBIT',
        amount: betAmount,
        balanceBefore: prevBal,
        balanceAfter: demoStore.wallet.realBalance,
        createdAt: new Date().toISOString(),
      });
      return res.status(200).json({
        status: 'OK',
        txId,
        balance: demoStore.wallet.realBalance,
        currency: 'BDT',
      });
    }

    // 1. Check Idempotency: Has this txId already been processed?
    const existingTx = await GameTransaction.findOne({ txId });
    if (existingTx) {
      const wallet = await Wallet.findOne({ userId });
      return res.status(200).json({
        status: 'OK',
        message: 'Transaction already processed (Idempotent response)',
        balance: Number(wallet.realBalance.toFixed(2)),
      });
    }

    // 2. Atomic Deduct from Wallet using MongoDB condition { realBalance: { $gte: betAmount } }
    // This prevents negative balances under concurrent race conditions
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId, realBalance: { $gte: betAmount } },
      {
        $inc: {
          realBalance: -betAmount,
          wageringCurrent: betAmount, // Track turnover for withdrawal compliance
        },
        $set: { version: Date.now() },
      },
      { new: true }
    );

    if (!updatedWallet) {
      // User does not have sufficient balance
      const currentWallet = await Wallet.findOne({ userId });
      return res.status(400).json({
        status: 'ERROR',
        code: 'INSUFFICIENT_FUNDS',
        message: 'Insufficient balance to place bet',
        currentBalance: currentWallet ? currentWallet.realBalance : 0,
      });
    }

    const balanceBefore = updatedWallet.realBalance + betAmount;
    const balanceAfter = updatedWallet.realBalance;

    // 3. Record Double-Entry Game Transaction Log
    await GameTransaction.create({
      txId,
      userId,
      providerId: providerId || 'MOCK_PROVIDER',
      gameCode: gameCode || 'unknown',
      roundId: roundId || txId,
      type: 'DEBIT',
      amount: betAmount,
      balanceBefore,
      balanceAfter,
      rawPayload: req.body,
    });

    return res.status(200).json({
      status: 'OK',
      txId,
      balance: Number(balanceAfter.toFixed(2)),
      currency: updatedWallet.currency,
    });
  } catch (error) {
    console.error('Seamless debit error:', error);
    return res.status(500).json({ status: 'ERROR', code: 'INTERNAL_ERROR', message: error.message });
  }
};

// 3. Credit (Win Payout)
// POST /api/seamless/credit
// Body: { txId, userId, providerId, gameCode, roundId, amount }
export const seamlessCredit = async (req, res) => {
  try {
    const { txId, userId, providerId, gameCode, roundId, amount } = req.body;

    if (!txId || !userId || amount === undefined || amount < 0) {
      return res.status(400).json({ status: 'ERROR', code: 'INVALID_PARAMS', message: 'Invalid credit payload' });
    }

    const winAmount = Number(amount);

    if (isDemoUser(userId)) {
      const prevBal = demoStore.wallet.realBalance;
      demoStore.wallet.realBalance = Number((demoStore.wallet.realBalance + winAmount).toFixed(2));
      demoStore.transactions.unshift({
        _id: `tx_${Date.now()}`,
        txId,
        userId,
        username: demoStore.user.username || 'demo',
        providerId: providerId || 'Pragmatic Play',
        gameCode: gameCode || 'pragmatic_highflyer',
        roundId: roundId || txId,
        type: 'CREDIT',
        amount: winAmount,
        balanceBefore: prevBal,
        balanceAfter: demoStore.wallet.realBalance,
        createdAt: new Date().toISOString(),
      });
      return res.status(200).json({
        status: 'OK',
        txId,
        balance: demoStore.wallet.realBalance,
        currency: 'BDT',
      });
    }

    // 1. Check Idempotency: Has this payout already been credited?
    const existingTx = await GameTransaction.findOne({ txId });
    if (existingTx) {
      const wallet = await Wallet.findOne({ userId });
      return res.status(200).json({
        status: 'OK',
        message: 'Transaction already credited (Idempotent response)',
        balance: Number(wallet.realBalance.toFixed(2)),
      });
    }

    // 2. Fetch current balance before atomic update
    const prevWallet = await Wallet.findOne({ userId });
    if (!prevWallet) {
      return res.status(404).json({ status: 'ERROR', code: 'USER_NOT_FOUND', message: 'Wallet not found' });
    }

    const balanceBefore = prevWallet.realBalance;

    // 3. Atomically Credit Wallet
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId },
      {
        $inc: { realBalance: winAmount },
        $set: { version: Date.now() },
      },
      { new: true }
    );

    const balanceAfter = updatedWallet.realBalance;

    // 4. Record Transaction
    await GameTransaction.create({
      txId,
      userId,
      providerId: providerId || 'MOCK_PROVIDER',
      gameCode: gameCode || 'unknown',
      roundId: roundId || txId,
      type: 'CREDIT',
      amount: winAmount,
      balanceBefore,
      balanceAfter,
      rawPayload: req.body,
    });

    return res.status(200).json({
      status: 'OK',
      txId,
      balance: Number(balanceAfter.toFixed(2)),
      currency: updatedWallet.currency,
    });
  } catch (error) {
    console.error('Seamless credit error:', error);
    return res.status(500).json({ status: 'ERROR', code: 'INTERNAL_ERROR', message: error.message });
  }
};

// 4. Rollback (Cancel & Refund Bet)
// POST /api/seamless/rollback
// Body: { txId, originalTxId, userId, amount }
export const seamlessRollback = async (req, res) => {
  try {
    const { txId, originalTxId, userId, amount } = req.body;

    if (!txId || !originalTxId || !userId) {
      return res.status(400).json({ status: 'ERROR', code: 'INVALID_PARAMS', message: 'Invalid rollback payload' });
    }

    const refundAmount = Number(amount);

    if (isDemoUser(userId)) {
      demoStore.wallet.realBalance = Number((demoStore.wallet.realBalance + refundAmount).toFixed(2));
      return res.status(200).json({
        status: 'OK',
        message: 'Bet successfully refunded',
        balance: demoStore.wallet.realBalance,
      });
    }

    // 1. Check if rollback was already performed for this txId
    const existingRollback = await GameTransaction.findOne({ txId });
    if (existingRollback) {
      const wallet = await Wallet.findOne({ userId });
      return res.status(200).json({
        status: 'OK',
        message: 'Rollback already executed',
        balance: Number(wallet.realBalance.toFixed(2)),
      });
    }

    // 2. Atomically refund wallet
    const prevWallet = await Wallet.findOne({ userId });
    const balanceBefore = prevWallet ? prevWallet.realBalance : 0;

    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId },
      {
        $inc: {
          realBalance: refundAmount,
          wageringCurrent: -refundAmount, // Reverse turnover increment
        },
      },
      { new: true }
    );

    const balanceAfter = updatedWallet.realBalance;

    // 3. Record Rollback Log
    await GameTransaction.create({
      txId,
      userId,
      providerId: 'ROLLBACK',
      gameCode: originalTxId,
      roundId: `rollback_${originalTxId}`,
      type: 'ROLLBACK',
      amount: refundAmount,
      balanceBefore,
      balanceAfter,
      rawPayload: req.body,
    });

    return res.status(200).json({
      status: 'OK',
      message: 'Bet successfully refunded',
      balance: Number(balanceAfter.toFixed(2)),
    });
  } catch (error) {
    console.error('Seamless rollback error:', error);
    return res.status(500).json({ status: 'ERROR', code: 'INTERNAL_ERROR', message: error.message });
  }
};
