import mongoose from 'mongoose';
import { demoStore, platformSettings, demoPlayers } from '../config/demoStore.js';
import { Deposit } from '../models/Deposit.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { GameTransaction } from '../models/GameTransaction.js';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { GAME_CATALOG } from './gameController.js';

// Helper to calculate date boundaries
const getDateBoundaries = () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, -1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return { now, startOfToday, startOfYesterday, endOfYesterday, startOfMonth };
};

// @desc    Get Comprehensive Daily, Monthly & Comparative Financial Reports
// @route   GET /api/admin/reports
export const getAdminReports = async (req, res) => {
  try {
    const { period = 'today' } = req.query;
    const { now, startOfToday, startOfYesterday, endOfYesterday, startOfMonth } = getDateBoundaries();

    // Default mock data calculations
    const calcMetrics = (deps, wths, txs) => {
      const deposits = deps.filter((d) => d.status === 'APPROVED').reduce((s, d) => s + Number(d.amount), 0);
      const withdrawals = wths.filter((w) => w.status === 'PAID').reduce((s, w) => s + Number(w.amount), 0);
      const bets = txs.filter((t) => t.type === 'DEBIT').reduce((s, t) => s + Number(t.amount), 0);
      const payouts = txs.filter((t) => t.type === 'CREDIT').reduce((s, t) => s + Number(t.amount), 0);
      const netProfit = deposits - withdrawals;
      const ggr = bets - payouts;
      const margin = bets > 0 ? Number(((ggr / bets) * 100).toFixed(1)) : 3.5;
      return { deposits, withdrawals, netProfit, turnover: bets, payouts, ggr, margin };
    };

    let todaySummary = calcMetrics(demoStore.deposits || [], demoStore.withdrawals || [], demoStore.transactions || []);
    let yesterdaySummary = { deposits: 14000, withdrawals: 4000, netProfit: 10000, turnover: 18500, payouts: 15100, ggr: 3400, margin: 18.4 };
    let monthSummary = calcMetrics(demoStore.deposits || [], demoStore.withdrawals || [], demoStore.transactions || []);
    let allTimeSummary = calcMetrics(demoStore.deposits || [], demoStore.withdrawals || [], demoStore.transactions || []);

    if (mongoose.connection.readyState === 1) {
      try {
        const fetchScope = async (startDate, endDate) => {
          const matchDate = {};
          if (startDate && endDate) matchDate.createdAt = { $gte: startDate, $lte: endDate };
          else if (startDate) matchDate.createdAt = { $gte: startDate };

          const [depRes, wthRes, txRes] = await Promise.all([
            Deposit.aggregate([
              { $match: { status: 'APPROVED', ...matchDate } },
              { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            Withdrawal.aggregate([
              { $match: { status: 'PAID', ...matchDate } },
              { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            GameTransaction.aggregate([
              { $match: matchDate },
              {
                $group: {
                  _id: null,
                  totalBets: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0] } },
                  totalPayouts: { $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0] } },
                },
              },
            ]),
          ]);

          const deposits = depRes[0]?.total || 0;
          const withdrawals = wthRes[0]?.total || 0;
          const bets = txRes[0]?.totalBets || 0;
          const payouts = txRes[0]?.totalPayouts || 0;
          const netProfit = deposits - withdrawals;
          const ggr = bets - payouts;
          const margin = bets > 0 ? Number(((ggr / bets) * 100).toFixed(1)) : 3.5;
          return { deposits, withdrawals, netProfit, turnover: bets, payouts, ggr, margin };
        };

        const [tDb, yDb, mDb, aDb] = await Promise.all([
          fetchScope(startOfToday, now),
          fetchScope(startOfYesterday, endOfYesterday),
          fetchScope(startOfMonth, now),
          fetchScope(null, null),
        ]);

        todaySummary = { ...todaySummary, ...tDb };
        yesterdaySummary = yDb.turnover > 0 ? yDb : yesterdaySummary;
        monthSummary = { ...monthSummary, ...mDb };
        allTimeSummary = { ...allTimeSummary, ...aDb };
      } catch (err) {
        console.warn('DB report aggregation error:', err.message);
      }
    }

    // Game-wise breakdown based on chosen period
    let filterStart = null;
    let filterEnd = null;
    if (period === 'today') {
      filterStart = startOfToday;
      filterEnd = now;
    } else if (period === 'yesterday') {
      filterStart = startOfYesterday;
      filterEnd = endOfYesterday;
    } else if (period === 'this_month') {
      filterStart = startOfMonth;
      filterEnd = now;
    }

    const gameMap = {};
    GAME_CATALOG.forEach((g) => {
      gameMap[g.code] = {
        code: g.code,
        name: g.name,
        provider: g.provider,
        category: g.category,
        thumbnail: g.thumbnail,
        bets: 0,
        payouts: 0,
        rounds: 0,
      };
    });

    if (mongoose.connection.readyState === 1) {
      try {
        const matchGame = {};
        if (filterStart && filterEnd) matchGame.createdAt = { $gte: filterStart, $lte: filterEnd };
        else if (filterStart) matchGame.createdAt = { $gte: filterStart };

        const gameAgg = await GameTransaction.aggregate([
          { $match: matchGame },
          {
            $group: {
              _id: '$gameCode',
              bets: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0] } },
              payouts: { $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0] } },
              rounds: { $sum: 1 },
            },
          },
        ]);

        gameAgg.forEach((item) => {
          if (gameMap[item._id]) {
            gameMap[item._id].bets += item.bets;
            gameMap[item._id].payouts += item.payouts;
            gameMap[item._id].rounds += item.rounds;
          }
        });
      } catch (e) {}
    }

    const gameBreakdown = Object.values(gameMap)
      .map((g) => {
        const profit = Number((g.bets - g.payouts).toFixed(2));
        const margin = g.bets > 0 ? Number(((profit / g.bets) * 100).toFixed(1)) : 3.5;
        const rtp = g.bets > 0 ? Number(((g.payouts / g.bets) * 100).toFixed(1)) : 96.5;
        return {
          ...g,
          profit,
          margin,
          rtp,
          status: profit > 0 ? 'PROFIT' : profit < 0 ? 'LOSS' : 'BREAK_EVEN',
        };
      })
      .sort((a, b) => b.bets - a.bets);

    res.json({
      success: true,
      data: {
        period,
        summaries: {
          today: todaySummary,
          yesterday: yesterdaySummary,
          thisMonth: monthSummary,
          allTime: allTimeSummary,
        },
        gameBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Detailed Player Dossier, Wagering & Game Activity
// @route   GET /api/admin/players/:id/dossier
export const getPlayerDossier = async (req, res) => {
  try {
    const { id } = req.params;
    let user = null;
    let wallet = null;
    let deposits = [];
    let withdrawals = [];
    let gameTransactions = [];

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(id).select('-password');
        if (user) {
          wallet = await Wallet.findOne({ userId: id });
          deposits = await Deposit.find({ userId: id }).sort({ createdAt: -1 });
          withdrawals = await Withdrawal.find({ userId: id }).sort({ createdAt: -1 });
          gameTransactions = await GameTransaction.find({ userId: id }).sort({ createdAt: -1 }).limit(100);
        }
      } catch (e) {}
    }

    if (!user) {
      const demo = demoPlayers.find((p) => String(p._id) === String(id));
      if (demo) {
        user = {
          _id: demo._id,
          username: demo.username,
          email: demo.email,
          mobile: demo.mobile,
          role: demo.role,
          status: demo.status,
          createdAt: demo.createdAt,
          customTurnoverMultiplier: demo.customTurnoverMultiplier !== undefined ? demo.customTurnoverMultiplier : null,
          customMaxDailyWithdrawal: demo.customMaxDailyWithdrawal || null,
          customMaxBet: demo.customMaxBet || null,
          manualTurnoverGranted: demo.manualTurnoverGranted || 0,
          turnoverWaived: demo.turnoverWaived || false,
        };
        wallet = { realBalance: demo.balance, bonusBalance: demo.bonusBalance || 0 };
        deposits = [{ _id: 'dep_d1', channel: 'bKash', amount: demo.totalDeposits, status: 'APPROVED', createdAt: new Date() }];
        withdrawals = [{ _id: 'wth_d1', channel: 'Nagad', amount: demo.totalWithdrawals, status: 'PAID', createdAt: new Date() }];
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'Player account not found' });
    }

    // Financial totals
    const totalDeposits = deposits.filter((d) => d.status === 'APPROVED').reduce((s, d) => s + Number(d.amount), 0);
    const totalWithdrawals = withdrawals.filter((w) => w.status === 'PAID').reduce((s, w) => s + Number(w.amount), 0);
    const totalBets = gameTransactions.filter((t) => t.type === 'DEBIT').reduce((s, t) => s + Number(t.amount), 0);
    const totalWins = gameTransactions.filter((t) => t.type === 'CREDIT').reduce((s, t) => s + Number(t.amount), 0);
    const playerNetProfit = totalWins - totalBets; // Player perspective
    const houseNetProfit = totalBets - totalWins;  // Casino perspective

    // Turnover & Wagering calculation
    const isWaived = user.turnoverWaived === true || user.customTurnoverMultiplier === 0;
    const effectiveMultiplier = user.customTurnoverMultiplier !== null && user.customTurnoverMultiplier !== undefined
      ? user.customTurnoverMultiplier
      : (platformSettings.turnoverMultiplier || 1.0);
    const requiredTurnover = isWaived ? 0 : Number((totalDeposits * effectiveMultiplier).toFixed(2));
    const completedTurnover = totalBets + (user.manualTurnoverGranted || 0);
    const remainingTurnover = isWaived ? 0 : Math.max(0, Number((requiredTurnover - completedTurnover).toFixed(2)));
    const turnoverProgress = isWaived || requiredTurnover === 0
      ? 100
      : Math.min(100, Math.round((completedTurnover / requiredTurnover) * 100));
    const canWithdraw = isWaived || completedTurnover >= requiredTurnover;

    // Game breakdown for this player
    const playerGameMap = {};
    gameTransactions.forEach((tx) => {
      const code = tx.gameCode || 'pragmatic_highflyer';
      if (!playerGameMap[code]) {
        const catItem = GAME_CATALOG.find((g) => g.code === code);
        playerGameMap[code] = {
          gameCode: code,
          gameName: catItem ? catItem.name : code,
          provider: tx.providerId || 'Pragmatic Play',
          totalBets: 0,
          totalWins: 0,
          rounds: 0,
        };
      }
      if (tx.type === 'DEBIT') {
        playerGameMap[code].totalBets += Number(tx.amount);
        playerGameMap[code].rounds += 1;
      } else if (tx.type === 'CREDIT') {
        playerGameMap[code].totalWins += Number(tx.amount);
      }
    });

    const gamesPlayed = Object.values(playerGameMap)
      .map((g) => {
        const playerPnl = Number((g.totalWins - g.totalBets).toFixed(2));
        return {
          ...g,
          playerPnl,
          status: playerPnl > 0 ? 'PLAYER_WIN' : playerPnl < 0 ? 'PLAYER_LOSS' : 'EVEN',
        };
      })
      .sort((a, b) => b.totalBets - a.totalBets);

    res.json({
      success: true,
      data: {
        profile: {
          _id: user._id,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          realBalance: wallet?.realBalance || 0,
          bonusBalance: wallet?.bonusBalance || 0,
        },
        financials: {
          totalDeposits,
          totalWithdrawals,
          netCashflow: totalDeposits - totalWithdrawals,
          totalBets,
          totalWins,
          playerNetProfit,
          houseNetProfit,
        },
        turnoverCompliance: {
          turnoverMultiplier: effectiveMultiplier,
          requiredTurnover,
          completedTurnover,
          remainingTurnover,
          turnoverProgress,
          canWithdraw,
          turnoverWaived: isWaived,
          manualTurnoverGranted: user.manualTurnoverGranted || 0,
        },
        customLimits: {
          turnoverMultiplier: user.customTurnoverMultiplier || platformSettings.turnoverMultiplier || 1.0,
          maxDailyWithdrawal: user.customMaxDailyWithdrawal || platformSettings.maxDailyWithdrawal || 5000,
          maxBetPerRound: user.customMaxBet || platformSettings.maxBetPerRound || 1000,
        },
        gamesPlayed,
        recentDeposits: deposits.slice(0, 5),
        recentWithdrawals: withdrawals.slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Custom Risk & Turnover Multiplier or Grant/Waive Turnover
// @route   PUT /api/admin/players/:id/limits
export const updatePlayerLimits = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      turnoverMultiplier,
      maxDailyWithdrawal,
      maxBetPerRound,
      grantTurnoverAmount,
      waiveTurnover,
    } = req.body;

    const grantAmount = grantTurnoverAmount ? Math.max(0, Number(grantTurnoverAmount)) : 0;
    const isWaived = waiveTurnover === true || turnoverMultiplier === 0;

    const demo = demoPlayers.find((p) => String(p._id) === String(id));
    if (demo) {
      if (turnoverMultiplier !== undefined) demo.customTurnoverMultiplier = Number(turnoverMultiplier);
      if (maxDailyWithdrawal !== undefined) demo.customMaxDailyWithdrawal = Number(maxDailyWithdrawal);
      if (maxBetPerRound !== undefined) demo.customMaxBet = Number(maxBetPerRound);
      if (grantAmount > 0) demo.manualTurnoverGranted = (demo.manualTurnoverGranted || 0) + grantAmount;
      if (isWaived) {
        demo.turnoverWaived = true;
        demo.customTurnoverMultiplier = 0;
      }
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(id);
        if (user) {
          if (turnoverMultiplier !== undefined) user.customTurnoverMultiplier = Number(turnoverMultiplier);
          if (maxDailyWithdrawal !== undefined) user.customMaxDailyWithdrawal = Number(maxDailyWithdrawal);
          if (maxBetPerRound !== undefined) user.customMaxBet = Number(maxBetPerRound);
          if (grantAmount > 0) user.manualTurnoverGranted = (user.manualTurnoverGranted || 0) + grantAmount;
          if (isWaived) {
            user.turnoverWaived = true;
            user.customTurnoverMultiplier = 0;
          }
          await user.save();
        }

        // Also update player wallet's wagering so withdrawal cashier recognizes the update
        if (grantAmount > 0) {
          await Wallet.findOneAndUpdate(
            { userId: id },
            { $inc: { wageringCurrent: grantAmount } }
          );
        }
        if (isWaived) {
          await Wallet.findOneAndUpdate(
            { userId: id },
            { $set: { wageringTarget: 0 } }
          );
        }
      } catch (e) {
        console.warn('Update player limits error:', e.message);
      }
    }

    res.json({
      success: true,
      message: isWaived
        ? 'টার্নওভার সম্পূর্ণ মাফ করা হয়েছে এবং প্লেয়ারের উইথড্রয়াল আনলক করা হয়েছে!'
        : grantAmount > 0
        ? `সফলভাবে ৳${grantAmount.toLocaleString()} টার্নওভার প্লেয়ারকে প্রদান করা হয়েছে!`
        : 'Player custom risk limits and turnover requirements successfully updated!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

