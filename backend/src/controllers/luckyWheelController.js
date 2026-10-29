import mongoose from 'mongoose';
import { PlatformConfig } from '../models/PlatformConfig.js';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { GameTransaction } from '../models/GameTransaction.js';
import { demoStore } from '../config/demoStore.js';

// Default prizes fallback
const DEFAULT_PRIZES = [
  { id: 1, label: '৳ ১০', amount: 10, type: 'cash', color: '#10b981', weight: 30 },
  { id: 2, label: '৳ ২৫', amount: 25, type: 'cash', color: '#3b82f6', weight: 25 },
  { id: 3, label: '৳ ৫০', amount: 50, type: 'cash', color: '#8b5cf6', weight: 15 },
  { id: 4, label: '৳ ১০০', amount: 100, type: 'cash', color: '#ec4899', weight: 10 },
  { id: 5, label: '৳ ৫০০ মেগা', amount: 500, type: 'cash', color: '#f59e0b', weight: 3 },
  { id: 6, label: 'পরের বার', amount: 0, type: 'miss', color: '#64748b', weight: 12 },
  { id: 7, label: '৳ ১৫ ক্যাশ', amount: 15, type: 'cash', color: '#06b6d4', weight: 20 },
  { id: 8, label: '৳ ২০০ গোল্ড', amount: 200, type: 'cash', color: '#eab308', weight: 5 },
];

/**
 * GET /api/lucky-wheel/status
 * Returns wheel config, user eligibility, cooldown timer
 */
export const getLuckyWheelStatus = async (req, res) => {
  try {
    let config = null;
    if (mongoose.connection.readyState === 1) {
      config = await PlatformConfig.findOne({ key: 'GLOBAL_CONFIG' }).lean();
    }

    const luckyWheelConfig = config?.luckyWheelSettings || {
      enabled: true,
      cooldownHours: 24,
      prizes: DEFAULT_PRIZES,
    };

    const prizes = luckyWheelConfig.prizes?.length ? luckyWheelConfig.prizes : DEFAULT_PRIZES;
    const cooldownMs = (luckyWheelConfig.cooldownHours || 24) * 60 * 60 * 1000;

    if (!req.user) {
      return res.json({
        success: true,
        canSpin: false,
        isGuest: true,
        prizes,
        cooldownHours: luckyWheelConfig.cooldownHours || 24,
        message: 'স্পিন করার জন্য অনুগ্রহ করে লগইন করুন।',
      });
    }

    const userId = req.user._id;
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(userId).select('lastLuckySpin totalLuckyWheelWins username').lean();
    } else {
      user = demoStore.users?.find((u) => u._id.toString() === userId.toString());
    }

    const lastSpin = user?.lastLuckySpin ? new Date(user.lastLuckySpin) : null;
    const now = new Date();
    let canSpin = true;
    let nextSpinAt = null;
    let remainingMs = 0;

    if (lastSpin) {
      const elapsed = now.getTime() - lastSpin.getTime();
      if (elapsed < cooldownMs) {
        canSpin = false;
        nextSpinAt = new Date(lastSpin.getTime() + cooldownMs);
        remainingMs = Math.max(0, nextSpinAt.getTime() - now.getTime());
      }
    }

    return res.json({
      success: true,
      canSpin,
      isGuest: false,
      prizes,
      cooldownHours: luckyWheelConfig.cooldownHours || 24,
      nextSpinAt,
      remainingMs,
      totalWins: user?.totalLuckyWheelWins || 0,
      lastSpinAt: lastSpin,
    });
  } catch (error) {
    console.error('getLuckyWheelStatus error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/lucky-wheel/spin
 * Executes 1 lucky spin, credits wallet balance atomically, records transaction
 */
export const spinLuckyWheel = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'লগইন আবশ্যক।' });
    }

    const userId = req.user._id;
    let config = null;
    if (mongoose.connection.readyState === 1) {
      config = await PlatformConfig.findOne({ key: 'GLOBAL_CONFIG' }).lean();
    }

    const luckyWheelConfig = config?.luckyWheelSettings || {
      enabled: true,
      cooldownHours: 24,
      prizes: DEFAULT_PRIZES,
    };

    if (luckyWheelConfig.enabled === false) {
      return res.status(400).json({ success: false, message: 'ডেইলি লাকি স্পিন বর্তমানে স্থগিত আছে।' });
    }

    const prizes = luckyWheelConfig.prizes?.length ? luckyWheelConfig.prizes : DEFAULT_PRIZES;
    const cooldownMs = (luckyWheelConfig.cooldownHours || 24) * 60 * 60 * 1000;
    const now = new Date();

    // Verify user eligibility
    let dbUser = null;
    if (mongoose.connection.readyState === 1) {
      dbUser = await User.findById(userId);
    } else {
      dbUser = demoStore.users?.find((u) => u._id.toString() === userId.toString());
    }

    if (!dbUser) {
      return res.status(404).json({ success: false, message: 'ইউজার পাওয়া যায়নি।' });
    }

    if (dbUser.lastLuckySpin) {
      const elapsed = now.getTime() - new Date(dbUser.lastLuckySpin).getTime();
      if (elapsed < cooldownMs) {
        const remainingHours = Math.ceil((cooldownMs - elapsed) / (1000 * 60 * 60));
        return res.status(400).json({
          success: false,
          canSpin: false,
          message: `আপনি আজকের ফ্রি স্পিন করে ফেলেছেন। পরবর্তী স্পিনের জন্য ${remainingHours} ঘণ্টা অপেক্ষা করুন।`,
        });
      }
    }

    // Weighted Random Selection
    const totalWeight = prizes.reduce((sum, p) => sum + (Number(p.weight) || 10), 0);
    let rand = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < prizes.length; i++) {
      const w = Number(prizes[i].weight) || 10;
      if (rand < w) {
        selectedIndex = i;
        break;
      }
      rand -= w;
    }

    const wonPrize = prizes[selectedIndex];
    const prizeAmount = Number(wonPrize.amount) || 0;

    // Update user spin record and credit wallet
    let newBalance = 0;
    const nextSpinAt = new Date(now.getTime() + cooldownMs);

    if (mongoose.connection.readyState === 1) {
      // 1. Update User
      await User.findByIdAndUpdate(userId, {
        lastLuckySpin: now,
        $inc: { totalLuckyWheelWins: prizeAmount },
      });

      // 2. Credit Wallet if prize > 0
      const wallet = await Wallet.findOne({ userId });
      const currentBalance = wallet ? wallet.realBalance : 0;
      newBalance = currentBalance + prizeAmount;

      if (wallet) {
        wallet.realBalance = newBalance;
        await wallet.save();
      }

      // 3. Record GameTransaction
      if (prizeAmount > 0) {
        const txId = `TX_WHEEL_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        await GameTransaction.create({
          txId,
          userId,
          providerId: 'CK44 System',
          gameCode: 'lucky_wheel',
          roundId: `RND_WHEEL_${Date.now()}`,
          type: 'CREDIT',
          amount: prizeAmount,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          rawPayload: { prize: wonPrize, spinAt: now },
        });
      }
    } else {
      // Demo Store fallback
      dbUser.lastLuckySpin = now;
      dbUser.totalLuckyWheelWins = (dbUser.totalLuckyWheelWins || 0) + prizeAmount;
      const demoWallet = demoStore.wallets?.find((w) => w.userId.toString() === userId.toString());
      if (demoWallet) {
        demoWallet.realBalance += prizeAmount;
        newBalance = demoWallet.realBalance;
      }
    }

    return res.json({
      success: true,
      prizeIndex: selectedIndex,
      prize: wonPrize,
      newBalance,
      nextSpinAt,
      message:
        prizeAmount > 0
          ? `অভিনন্দন! আপনি জিতেছেন ${wonPrize.label} (+৳${prizeAmount})!`
          : 'পরবর্তী স্পিনে জ্যাকপটের জন্য শুভকামনা!',
    });
  } catch (error) {
    console.error('spinLuckyWheel error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
