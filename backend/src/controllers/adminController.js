import mongoose from 'mongoose';
import { demoStore, paymentSettings, platformSettings, demoPlayers } from '../config/demoStore.js';
import { Deposit } from '../models/Deposit.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { GameTransaction } from '../models/GameTransaction.js';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { GAME_CATALOG } from './gameController.js';

// @desc    Get Admin Live Platform Stats & Monthly Goal Progress
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    let totalDeposits = (demoStore.deposits || [])
      .filter((d) => d.status === 'APPROVED')
      .reduce((sum, d) => sum + Number(d.amount), 0);

    let totalWithdrawals = (demoStore.withdrawals || [])
      .filter((w) => w.status === 'PAID')
      .reduce((sum, w) => sum + Number(w.amount), 0);

    let totalBets = (demoStore.transactions || [])
      .filter((t) => t.type === 'DEBIT')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    let totalPayouts = (demoStore.transactions || [])
      .filter((t) => t.type === 'CREDIT')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    let activePlayersToday = demoPlayers.length;
    let totalPlayers = demoPlayers.length;

    if (mongoose.connection.readyState === 1) {
      try {
        const depAgg = await Deposit.aggregate([
          { $match: { status: 'APPROVED' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        if (depAgg.length > 0) totalDeposits = depAgg[0].total;

        const wthAgg = await Withdrawal.aggregate([
          { $match: { status: 'PAID' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        if (wthAgg.length > 0) totalWithdrawals = wthAgg[0].total;

        const txAgg = await GameTransaction.aggregate([
          {
            $group: {
              _id: null,
              totalBets: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0] } },
              totalPayouts: { $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0] } },
              betCount: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, 1, 0] } },
            },
          },
        ]);
        if (txAgg.length > 0) {
          totalBets = txAgg[0].totalBets || totalBets;
          totalPayouts = txAgg[0].totalPayouts || totalPayouts;
        }

        const uCount = await User.countDocuments();
        if (uCount > 0) {
          totalPlayers = uCount;
          activePlayersToday = uCount;
        }
      } catch (e) {
        console.warn('DB stats aggregation error:', e.message);
      }
    }

    const netProfit = totalDeposits - totalWithdrawals;
    const ggr = totalBets - totalPayouts; // Gross Gaming Revenue
    const startingReserve = platformSettings.reserveFund || 50000;
    const totalLiquidity = startingReserve + netProfit;
    const monthlyGoal = platformSettings.monthlyGoal || 150000;
    const goalProgress = Math.min(100, Math.max(0, Math.round((netProfit / monthlyGoal) * 100)));

    res.json({
      success: true,
      data: {
        totalDeposits,
        totalWithdrawals,
        totalBets,
        totalPayouts,
        ggr,
        netProfit,
        startingReserve,
        totalLiquidity,
        liquidityHealth: totalLiquidity > 20000 ? 'SAFE' : 'ATTENTION',
        activePlayersToday,
        totalPlayers,
        monthlyGoal,
        goalProgress,
        totalGames: GAME_CATALOG.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Profit/Loss & Turnover Analytics for Every Game
// @route   GET /api/admin/games-analytics
export const getGameAnalytics = async (req, res) => {
  try {
    const gameStatsMap = {};

    // 1. Initialize with all catalog games
    GAME_CATALOG.forEach((g) => {
      gameStatsMap[g.code] = {
        code: g.code,
        name: g.name,
        provider: g.provider,
        category: g.category,
        thumbnail: g.thumbnail,
        targetRtp: g.rtp || '96.5%',
        totalBets: 0,
        totalPayouts: 0,
        houseProfit: 0,
        actualRtp: 0,
        houseMargin: 0,
        betCount: 0,
        winCount: 0,
        lossCount: 0,
        status: 'BREAK_EVEN',
      };
    });

    // 2. Aggregate from DemoStore transactions
    (demoStore.transactions || []).forEach((tx) => {
      const code = tx.gameCode || 'pragmatic_highflyer';
      if (!gameStatsMap[code]) {
        gameStatsMap[code] = {
          code,
          name: code,
          provider: tx.providerId || 'Custom',
          category: 'slots',
          thumbnail: '',
          targetRtp: '96.5%',
          totalBets: 0,
          totalPayouts: 0,
          houseProfit: 0,
          actualRtp: 0,
          houseMargin: 0,
          betCount: 0,
          winCount: 0,
          lossCount: 0,
          status: 'BREAK_EVEN',
        };
      }
      if (tx.type === 'DEBIT') {
        gameStatsMap[code].totalBets += Number(tx.amount);
        gameStatsMap[code].betCount += 1;
      } else if (tx.type === 'CREDIT') {
        gameStatsMap[code].totalPayouts += Number(tx.amount);
        gameStatsMap[code].winCount += 1;
      }
    });

    // 3. Aggregate from MongoDB GameTransaction if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const dbAgg = await GameTransaction.aggregate([
          {
            $group: {
              _id: '$gameCode',
              totalBets: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0] } },
              totalPayouts: { $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0] } },
              betCount: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, 1, 0] } },
              winCount: { $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, 1, 0] } },
            },
          },
        ]);

        dbAgg.forEach((item) => {
          const code = item._id;
          if (gameStatsMap[code]) {
            gameStatsMap[code].totalBets += item.totalBets;
            gameStatsMap[code].totalPayouts += item.totalPayouts;
            gameStatsMap[code].betCount += item.betCount;
            gameStatsMap[code].winCount += item.winCount;
          }
        });
      } catch (e) {
        console.warn('Game analytics DB aggregation error:', e.message);
      }
    }

    // 4. Calculate P&L, RTP, and Margins
    const results = Object.values(gameStatsMap).map((g) => {
      const houseProfit = Number((g.totalBets - g.totalPayouts).toFixed(2));
      const actualRtp = g.totalBets > 0 ? Number(((g.totalPayouts / g.totalBets) * 100).toFixed(1)) : 96.5;
      const houseMargin = g.totalBets > 0 ? Number(((houseProfit / g.totalBets) * 100).toFixed(1)) : 3.5;
      const lossCount = Math.max(0, g.betCount - g.winCount);

      let status = 'BREAK_EVEN';
      if (houseProfit > 0) status = 'PROFIT'; // House won money
      else if (houseProfit < 0) status = 'LOSS'; // House lost money / player won

      return {
        ...g,
        houseProfit,
        actualRtp,
        houseMargin,
        lossCount,
        status,
      };
    });

    // Sort by total turnover (bets) descending
    results.sort((a, b) => b.totalBets - a.totalBets || b.houseProfit - a.houseProfit);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Recent Game Transactions Stream (Live Ledger)
// @route   GET /api/admin/game-transactions
export const getRecentGameTransactions = async (req, res) => {
  try {
    let transactions = [...(demoStore.transactions || [])];

    if (mongoose.connection.readyState === 1) {
      try {
        const dbTxs = await GameTransaction.find()
          .populate('userId', 'username mobile')
          .sort({ createdAt: -1 })
          .limit(50);

        if (dbTxs.length > 0) {
          transactions = dbTxs.map((t) => ({
            _id: t._id,
            txId: t.txId,
            username: t.userId ? t.userId.username : 'player',
            providerId: t.providerId,
            gameCode: t.gameCode,
            roundId: t.roundId,
            type: t.type,
            amount: t.amount,
            balanceBefore: t.balanceBefore,
            balanceAfter: t.balanceAfter,
            createdAt: t.createdAt,
          }));
        }
      } catch (e) {
        console.warn('Game transactions DB load error:', e.message);
      }
    }

    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Registered Players List with Individual P&L & Turnovers
// @route   GET /api/admin/players
export const getPlayersList = async (req, res) => {
  try {
    let players = [...demoPlayers];

    if (mongoose.connection.readyState === 1) {
      try {
        const dbUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(100);
        if (dbUsers.length > 0) {
          players = await Promise.all(
            dbUsers.map(async (u) => {
              const w = await Wallet.findOne({ userId: u._id });
              const depAgg = await Deposit.aggregate([
                { $match: { userId: u._id, status: 'APPROVED' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
              ]);
              const userDeps = depAgg.length > 0 ? depAgg[0].total : 0;

              const wthAgg = await Withdrawal.aggregate([
                { $match: { userId: u._id, status: 'PAID' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
              ]);
              const userWths = wthAgg.length > 0 ? wthAgg[0].total : 0;

              const txAgg = await GameTransaction.aggregate([
                { $match: { userId: u._id } },
                {
                  $group: {
                    _id: null,
                    totalBets: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0] } },
                    totalWins: { $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0] } },
                    betCount: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, 1, 0] } },
                  },
                },
              ]);
              const totalBets = txAgg.length > 0 ? txAgg[0].totalBets : 0;
              const totalWins = txAgg.length > 0 ? txAgg[0].totalWins : 0;
              const netLoss = totalBets - totalWins; // House profit from this player

              return {
                _id: u._id,
                username: u.username,
                email: u.email || '',
                role: u.role || 'player',
                mobile: u.mobile || '—',
                balance: w ? w.realBalance : 0,
                bonusBalance: w ? w.bonusBalance : 0,
                totalDeposits: userDeps,
                totalWithdrawals: userWths,
                totalBets,
                totalWins,
                netLoss, // Player loss to casino (profit for platform)
                wageringStatus: w && w.wageringCurrent >= w.wageringTarget ? 'COMPLETED' : 'IN_PROGRESS',
                status: u.status || 'ACTIVE',
                createdAt: u.createdAt,
              };
            })
          );
        }
      } catch (e) {
        console.warn('Players list DB load error:', e.message);
      }
    }

    res.json({ success: true, data: players });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Adjust Player Balance (Add or Deduct)
// @route   PUT /api/admin/players/:id/balance
export const adjustPlayerBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, remark } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'সঠিক টাকার পরিমাণ প্রদান করুন' });
    }

    const multiplier = type === 'DEDUCT' ? -1 : 1;
    const diff = numAmount * multiplier;

    // Check demo store
    const demoPlayer = demoPlayers.find((p) => String(p._id) === String(id));
    if (demoPlayer) {
      demoPlayer.balance = Math.max(0, Number((demoPlayer.balance + diff).toFixed(2)));
    }
    if (String(demoStore.user._id) === String(id)) {
      demoStore.wallet.realBalance = Math.max(0, Number((demoStore.wallet.realBalance + diff).toFixed(2)));
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const wallet = await Wallet.findOne({ userId: id });
        if (wallet) {
          const newBalance = Math.max(0, wallet.realBalance + diff);
          wallet.realBalance = newBalance;
          await wallet.save();
        }
      } catch (e) {
        console.warn('Wallet balance adjustment DB error:', e.message);
      }
    }

    res.json({
      success: true,
      message: `প্লেয়ারের ব্যালেন্স সফলভাবে ${type === 'DEDUCT' ? 'কর্তন' : 'যোগ'} করা হয়েছে (৳${numAmount})!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Update Player Status (ACTIVE, SUSPENDED, BANNED)
// @route   PUT /api/admin/players/:id/status
export const updatePlayerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const demoPlayer = demoPlayers.find((p) => String(p._id) === String(id));
    if (demoPlayer) demoPlayer.status = status;

    if (mongoose.connection.readyState === 1) {
      try {
        await User.findByIdAndUpdate(id, { status });
      } catch (e) {
        console.warn('Player status DB update error:', e.message);
      }
    }

    res.json({
      success: true,
      message: `প্লেয়ারের স্ট্যাটাস পরিবর্তন করে '${status}' করা হয়েছে!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Update Player Role (player, admin)
// @route   PUT /api/admin/players/:id/role
export const updatePlayerRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['player', 'admin', 'agent'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const demoPlayer = demoPlayers.find((p) => String(p._id) === String(id));
    if (demoPlayer) demoPlayer.role = role;

    if (mongoose.connection.readyState === 1) {
      try {
        await User.findByIdAndUpdate(id, { role });
      } catch (e) {
        console.warn('Player role DB update error:', e.message);
      }
    }

    res.json({
      success: true,
      message: `ইউজারের রোল পরিবর্তন করে '${role}' করা হয়েছে!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Deposits for Admin
// @route   GET /api/admin/deposits
export const getAdminDeposits = async (req, res) => {
  try {
    let deposits = [...(demoStore.deposits || [])];

    if (mongoose.connection.readyState === 1) {
      try {
        const dbDeps = await Deposit.find().populate('userId', 'username mobile').sort({ createdAt: -1 }).limit(50);
        if (dbDeps.length > 0) {
          deposits = dbDeps.map((d) => ({
            _id: d._id,
            username: d.userId ? d.userId.username : 'player',
            channel: d.channel,
            amount: d.amount,
            bonusAmount: d.bonusAmount,
            trxId: d.trxId,
            senderMobile: d.senderMobile || (d.userId ? d.userId.mobile : ''),
            status: d.status,
            createdAt: d.createdAt,
          }));
        }
      } catch (e) {}
    }

    res.json({ success: true, data: deposits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Deposit
// @route   PUT /api/admin/deposits/:id/approve
export const approveDeposit = async (req, res) => {
  const { id } = req.params;
  const dep = (demoStore.deposits || []).find((d) => String(d._id) === String(id));
  if (dep) dep.status = 'APPROVED';

  if (mongoose.connection.readyState === 1) {
    try {
      const deposit = await Deposit.findById(id);
      if (deposit && deposit.status !== 'APPROVED') {
        deposit.status = 'APPROVED';
        await deposit.save();
        await Wallet.findOneAndUpdate(
          { userId: deposit.userId },
          { $inc: { realBalance: deposit.amount, bonusBalance: deposit.bonusAmount } }
        );
      }
    } catch (e) {}
  }
  res.json({ success: true, message: 'ডিপোজিট সফলভাবে অনুমোদিত হয়েছে এবং ব্যালেন্স যোগ হয়েছে!' });
};

// @desc    Reject Deposit
// @route   PUT /api/admin/deposits/:id/reject
export const rejectDeposit = async (req, res) => {
  const { id } = req.params;
  const dep = (demoStore.deposits || []).find((d) => String(d._id) === String(id));
  if (dep) dep.status = 'REJECTED';

  if (mongoose.connection.readyState === 1) {
    try {
      await Deposit.findByIdAndUpdate(id, { status: 'REJECTED' });
    } catch (e) {}
  }
  res.json({ success: true, message: 'ডিপোজিট বাতিল (REJECTED) করা হয়েছে।' });
};

// @desc    Get All Withdrawals for Admin
// @route   GET /api/admin/withdrawals
export const getAdminWithdrawals = async (req, res) => {
  try {
    let withdrawals = [...(demoStore.withdrawals || [])];

    if (mongoose.connection.readyState === 1) {
      try {
        const dbWths = await Withdrawal.find().populate('userId', 'username mobile').sort({ createdAt: -1 }).limit(50);
        if (dbWths.length > 0) {
          withdrawals = dbWths.map((w) => ({
            _id: w._id,
            username: w.userId ? w.userId.username : 'player',
            channel: w.channel,
            amount: w.amount,
            payoutAccount: w.payoutAccount,
            turnoverVerified: w.turnoverVerified,
            status: w.status,
            createdAt: w.createdAt,
          }));
        }
      } catch (e) {}
    }

    res.json({ success: true, data: withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark Withdrawal Paid
// @route   PUT /api/admin/withdrawals/:id/pay
export const payWithdrawal = async (req, res) => {
  const { id } = req.params;
  const wth = (demoStore.withdrawals || []).find((w) => String(w._id) === String(id));
  if (wth) wth.status = 'PAID';

  if (mongoose.connection.readyState === 1) {
    try {
      await Withdrawal.findByIdAndUpdate(id, { status: 'PAID' });
    } catch (e) {}
  }
  res.json({ success: true, message: 'উইথড্রল সফলভাবে পরিশোধ করা হয়েছে (PAID)!' });
};

// @desc    Reject Withdrawal & Refund Balance
// @route   PUT /api/admin/withdrawals/:id/reject
export const rejectWithdrawal = async (req, res) => {
  const { id } = req.params;
  const wth = (demoStore.withdrawals || []).find((w) => String(w._id) === String(id));
  if (wth) {
    wth.status = 'REJECTED';
    demoStore.wallet.realBalance += Number(wth.amount);
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const withdrawal = await Withdrawal.findById(id);
      if (withdrawal && withdrawal.status === 'PENDING') {
        withdrawal.status = 'REJECTED';
        await withdrawal.save();
        await Wallet.findOneAndUpdate(
          { userId: withdrawal.userId },
          { $inc: { realBalance: withdrawal.amount } }
        );
      }
    } catch (e) {}
  }
  res.json({ success: true, message: 'উইথড্রল বাতিল করা হয়েছে এবং টাকা ইউজারের ওয়ালেটে রিফান্ড করা হয়েছে!' });
};

// @desc    Get Owner Payment Numbers
// @route   GET /api/admin/payment-settings
export const getPaymentSettings = (req, res) => {
  res.json({
    success: true,
    data: paymentSettings || {
      bkash: '01712-345678',
      nagad: '01899-876543',
      rocket: '01911-223344',
      usdt: 'TYDzsxdczSu4mE9GfF1k4eBq8yL3K9wP3e',
    },
  });
};

// @desc    Update Owner Payment Numbers
// @route   PUT /api/admin/payment-settings
export const updatePaymentSettings = (req, res) => {
  const { bkash, nagad, rocket, usdt } = req.body;
  if (bkash) paymentSettings.bkash = bkash;
  if (nagad) paymentSettings.nagad = nagad;
  if (rocket) paymentSettings.rocket = rocket;
  if (usdt) paymentSettings.usdt = usdt;

  res.json({
    success: true,
    message: 'পেমেন্ট নম্বর সফলভাবে আপডেট করা হয়েছে!',
    data: paymentSettings,
  });
};

// @desc    Get Platform Risk & Reserve Limits
// @route   GET /api/admin/limits
export const getPlatformLimits = (req, res) => {
  res.json({
    success: true,
    data: platformSettings,
  });
};

// @desc    Update Platform Risk & Reserve Limits
// @route   PUT /api/admin/limits
export const updatePlatformLimits = (req, res) => {
  const { reserveFund, monthlyGoal, maxDailyWithdrawal, minWithdrawal, maxBetPerRound } = req.body;
  if (reserveFund !== undefined) platformSettings.reserveFund = Number(reserveFund);
  if (monthlyGoal !== undefined) platformSettings.monthlyGoal = Number(monthlyGoal);
  if (maxDailyWithdrawal !== undefined) platformSettings.maxDailyWithdrawal = Number(maxDailyWithdrawal);
  if (minWithdrawal !== undefined) platformSettings.minWithdrawal = Number(minWithdrawal);
  if (maxBetPerRound !== undefined) platformSettings.maxBetPerRound = Number(maxBetPerRound);

  res.json({
    success: true,
    message: 'প্ল্যাটফর্মের রিজার্ভ, লক্ষ্য ও প্লেয়ার লিমিট সফলভাবে আপডেট করা হয়েছে!',
    data: platformSettings,
  });
};
