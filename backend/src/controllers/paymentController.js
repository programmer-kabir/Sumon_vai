import mongoose from 'mongoose';
import { Deposit } from '../models/Deposit.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { Wallet } from '../models/Wallet.js';
import { GameTransaction } from '../models/GameTransaction.js';
import { demoStore, DEMO_USER_ID, isDemoUser, platformSettings } from '../config/demoStore.js';


// @desc    Submit deposit request (bKash, Nagad, Rocket, USDT TRC20)
// @route   POST /api/wallet/deposit
export const requestDeposit = async (req, res) => {
  try {
    const userId = req.user._id;
    const { channel, amount, trxId, senderMobile } = req.body;

    if (!channel || !amount || !trxId) {
      return res.status(400).json({ success: false, message: 'Please provide channel, amount, and TrxID' });
    }

    const depositAmount = Number(amount);
    if (depositAmount < 50) {
      return res.status(400).json({ success: false, message: 'Minimum deposit is 50 BDT' });
    }

    // Calculate bonus (e.g. 1.5% extra for USDT, or 5% welcome bonus)
    const bonusRate = channel === 'USDT_TRC20' ? 0.015 : 0.0;
    const bonusAmount = Number((depositAmount * bonusRate).toFixed(2));

    // 🌟 1. Real MongoDB Atlas Processing (Primary)
    if (mongoose.connection.readyState === 1) {
      const existing = await Deposit.findOne({ trxId: trxId.trim() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'This TrxID has already been submitted' });
      }

      const deposit = await Deposit.create({
        userId,
        channel,
        amount: depositAmount,
        bonusAmount,
        trxId: trxId.trim(),
        senderMobile: senderMobile || '',
        status: 'APPROVED',
      });

      const updatedWallet = await Wallet.findOneAndUpdate(
        { userId },
        {
          $inc: {
            realBalance: depositAmount,
            bonusBalance: bonusAmount,
            wageringTarget: depositAmount * 1.0,
          },
        },
        { new: true, upsert: true }
      );

      return res.status(201).json({
        success: true,
        message: `Deposit of ৳${depositAmount} processed successfully!`,
        data: {
          deposit,
          wallet: updatedWallet,
        },
      });
    }

    // 🌟 2. Offline In-Memory Fallback (Only if MongoDB disconnected)
    demoStore.wallet.realBalance = Number((demoStore.wallet.realBalance + depositAmount).toFixed(2));
    demoStore.wallet.bonusBalance = Number((demoStore.wallet.bonusBalance + bonusAmount).toFixed(2));
    demoStore.wallet.wageringTarget = Number((demoStore.wallet.wageringTarget + depositAmount).toFixed(2));

    const newDep = {
      _id: `dep_${Date.now()}`,
      username: req.user ? req.user.username : 'demo',
      channel,
      amount: depositAmount,
      bonusAmount,
      trxId: trxId.trim(),
      senderMobile: senderMobile || '',
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
    };
    demoStore.deposits.unshift(newDep);

    return res.status(201).json({
      success: true,
      message: `Deposit of ৳${depositAmount} processed successfully!`,
      data: {
        deposit: newDep,
        wallet: demoStore.wallet,
      },
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit withdrawal request with turnover verification
// @route   POST /api/wallet/withdraw
export const requestWithdrawal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { channel, amount, payoutAccount } = req.body;

    if (!channel || !amount || !payoutAccount) {
      return res.status(400).json({ success: false, message: 'Please fill in all withdrawal details' });
    }

    const withdrawAmount = Number(amount);
    const minWth = platformSettings.minWithdrawal || 500;
    const maxDaily = platformSettings.maxDailyWithdrawal || 5000;

    if (withdrawAmount < minWth) {
      return res.status(400).json({ success: false, message: `সর্বনিম্ন উইথড্রল পরিমাণ ৳${minWth} টাকা` });
    }

    if (withdrawAmount > maxDaily) {
      return res.status(400).json({
        success: false,
        message: `আপনার অনুরোধকৃত পরিমাণ ৳${withdrawAmount} টাকা দৈনিক সর্বোচ্চ উইথড্রল সীমা (৳${maxDaily.toLocaleString()}) অতিক্রম করেছে।`,
      });
    }

    // 🌟 1. Real MongoDB Atlas Processing (Primary)
    if (mongoose.connection.readyState === 1) {
      const wallet = await Wallet.findOne({ userId });
      if (!wallet || wallet.realBalance < withdrawAmount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance',
          currentBalance: wallet ? wallet.realBalance : 0,
        });
      }

      const turnoverComplete = wallet.wageringCurrent >= wallet.wageringTarget;
      if (!turnoverComplete) {
        const remaining = (wallet.wageringTarget - wallet.wageringCurrent).toFixed(2);
        return res.status(400).json({
          success: false,
          code: 'TURNOVER_INCOMPLETE',
          message: `Turnover condition not met. You must wager ৳${remaining} more before withdrawing.`,
          wageringRequired: wallet.wageringTarget,
          wageringCompleted: wallet.wageringCurrent,
        });
      }

      const updatedWallet = await Wallet.findOneAndUpdate(
        { userId, realBalance: { $gte: withdrawAmount } },
        { $inc: { realBalance: -withdrawAmount } },
        { new: true }
      );

      if (!updatedWallet) {
        return res.status(400).json({ success: false, message: 'Withdrawal failed. Insufficient funds.' });
      }

      const withdrawal = await Withdrawal.create({
        userId,
        channel,
        amount: withdrawAmount,
        payoutAccount: payoutAccount.trim(),
        turnoverVerified: true,
        status: 'PROCESSING',
      });

      return res.status(201).json({
        success: true,
        message: `Withdrawal of ৳${withdrawAmount} submitted! Payout will be sent to ${payoutAccount}.`,
        data: {
          withdrawal,
          wallet: updatedWallet,
        },
      });
    }

    // 🌟 2. Offline In-Memory Fallback
    if (demoStore.wallet.realBalance < withdrawAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance',
        currentBalance: demoStore.wallet.realBalance,
      });
    }

    demoStore.wallet.realBalance = Number((demoStore.wallet.realBalance - withdrawAmount).toFixed(2));

    const newWth = {
      _id: `wth_${Date.now()}`,
      username: req.user ? req.user.username : 'demo',
      channel,
      amount: withdrawAmount,
      payoutAccount: payoutAccount.trim(),
      turnoverVerified: true,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
    };
    demoStore.withdrawals.unshift(newWth);

    return res.status(201).json({
      success: true,
      message: `Withdrawal of ৳${withdrawAmount} submitted! Payout will be sent to ${payoutAccount}.`,
      data: {
        withdrawal: newWth,
        wallet: demoStore.wallet,
      },
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's transaction history (Bets, Deposits, Withdrawals)
// @route   GET /api/wallet/history
export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🌟 1. Real MongoDB Atlas Processing (Primary)
    if (mongoose.connection.readyState === 1) {
      const [deposits, withdrawals, gameTransactions] = await Promise.all([
        Deposit.find({ userId }).sort({ createdAt: -1 }).limit(10),
        Withdrawal.find({ userId }).sort({ createdAt: -1 }).limit(10),
        GameTransaction.find({ userId }).sort({ createdAt: -1 }).limit(20),
      ]);

      return res.json({
        success: true,
        data: {
          deposits,
          withdrawals,
          gameTransactions,
        },
      });
    }

    // 🌟 2. Offline In-Memory Fallback
    res.json({
      success: true,
      data: {
        deposits: demoStore.deposits || [],
        withdrawals: demoStore.withdrawals || [],
        gameTransactions: demoStore.transactions || [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
