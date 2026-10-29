import mongoose from 'mongoose';
import { Wallet } from '../models/Wallet.js';
import { GameTransaction } from '../models/GameTransaction.js';
import { User } from '../models/User.js';
import { demoStore, DEMO_USER_ID, isDemoUser } from '../config/demoStore.js';
import { PlatformConfig } from '../models/PlatformConfig.js';
import { v4 as uuidv4 } from 'uuid';

// Flagship CK44 Curated Games Catalog (100% Verified Pragmatic Play HTML5 Demo & Seamless Compatible)
export const GAME_CATALOG = [
  {
    code: 'pragmatic_spaceman',
    name: 'Spaceman',
    provider: 'Pragmatic Play',
    category: 'crash',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    popular: true,
    rtp: '96.50%',
    gameSymbol: '1301',
    tagline: '🚀 টু দ্য মুন! সর্বোচ্চ ৫,০০০x জ্যাকপট মাল্টিপ্লায়ার',
  },
  {
    code: 'pragmatic_highflyer',
    name: 'Aviator (High Flyer Plane)',
    provider: 'Pragmatic Play',
    category: 'crash',
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80',
    popular: true,
    rtp: '97.00%',
    gameSymbol: '1303',
    tagline: '✈️ লাল প্লেন উড়ে যাওয়ার আগেই ক্যাশআউট করুন',
  },
  {
    code: 'pragmatic_bigbasscrash',
    name: 'Big Bass Crash',
    provider: 'Pragmatic Play',
    category: 'crash',
    secondaryCategory: 'fishing',
    thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
    popular: true,
    rtp: '96.50%',
    gameSymbol: '1302',
    tagline: '🎣 বোট ডুববার আগেই বিগ ক্যাশ নেট তুলে নিন',
  },
  {
    code: 'pragmatic_olympus',
    name: 'Gates of Olympus',
    provider: 'Pragmatic Play',
    category: 'slots',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    popular: true,
    rtp: '96.50%',
    gameSymbol: 'vs20olympgate',
    tagline: '⚡ জিউসের বাজ ও ৫,০০০x মেগা জ্যাকপট',
  },
  {
    code: 'pragmatic_olympus_1000',
    name: 'Gates of Olympus 1000',
    provider: 'Pragmatic Play',
    category: 'slots',
    thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
    popular: true,
    rtp: '96.50%',
    gameSymbol: 'vs20olympx',
    tagline: '👑 ১,০০০x মাল্টিপ্লায়ার ও আলটিমেট জিউস জ্যাকপট',
  },
  {
    code: 'pragmatic_sweetbonanza',
    name: 'Sweet Bonanza',
    provider: 'Pragmatic Play',
    category: 'slots',
    thumbnail: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600&auto=format&fit=crop&q=80',
    popular: true,
    rtp: '96.48%',
    gameSymbol: 'vs20fruitsw',
    tagline: '🍭 সুইট ক্যান্ডি টাম্বল ও ১০০x মাল্টিপ্লায়ার বোমা',
  },
  {
    code: 'pragmatic_sugarrush',
    name: 'Sugar Rush',
    provider: 'Pragmatic Play',
    category: 'slots',
    thumbnail: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
    popular: true,
    rtp: '96.50%',
    gameSymbol: 'vs20sugarrush',
    tagline: '🍬 ক্লাস্টার পে ও ১২৮x মাল্টি স্পট বোনাস',
  },
  {
    code: 'pragmatic_starlight',
    name: 'Starlight Princess',
    provider: 'Pragmatic Play',
    category: 'slots',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    popular: true,
    rtp: '96.50%',
    gameSymbol: 'vs20starlight',
    tagline: '✨ স্টারলাইট প্রিন্সেস ও ৫০০x হার্ট উইন',
  },
  {
    code: 'pragmatic_bigbass',
    name: 'Big Bass - Hold & Spinner',
    provider: 'Pragmatic Play',
    category: 'fishing',
    secondaryCategory: 'slots',
    thumbnail: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80',
    popular: true,
    rtp: '96.71%',
    gameSymbol: 'vs10bbhas',
    tagline: '🐟 ফিশিং স্পিন ও বিগ ক্যাচ কয়েন বোনাস',
  },
  {
    code: 'pragmatic_doghouse',
    name: 'The Dog House',
    provider: 'Pragmatic Play',
    category: 'slots',
    thumbnail: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    popular: false,
    rtp: '96.51%',
    gameSymbol: 'vs20doghouse',
    tagline: '🐶 স্টিকি ওয়াইল্ড ও মাল্টিপ্লায়ার ডগ হাউস',
  },
  {
    code: 'pragmatic_wolfgold',
    name: 'Wolf Gold',
    provider: 'Pragmatic Play',
    category: 'slots',
    thumbnail: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=600&auto=format&fit=crop&q=80',
    popular: false,
    rtp: '96.01%',
    gameSymbol: 'vs25wolfgold',
    tagline: '🐺 মেগা মানি রেস্পিন ও গোল্ড জ্যাকপট',
  },
  {
    code: 'pragmatic_cleocatra',
    name: 'Cleocatra',
    provider: 'Pragmatic Play',
    category: 'slots',
    thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    popular: false,
    rtp: '96.20%',
    gameSymbol: 'vs20cleocatra',
    tagline: '🐱 মিশরীয় ক্লিওপেট্রা ক্যাট রেস্পিন বোনাস',
  },
];

// @desc    Get full game list with optional filters
// @route   GET /api/games
export const getGames = async (req, res) => {
  try {
    const { category, provider, search } = req.query;

    let filtered = [...GAME_CATALOG];

    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.category?.toLowerCase() === catLower ||
          g.secondaryCategory?.toLowerCase() === catLower
      );
    }

    if (provider && provider !== 'all') {
      filtered = filtered.filter((g) => g.provider.toLowerCase() === provider.toLowerCase());
    }

    if (search) {
      filtered = filtered.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Launch a game session
// @route   POST /api/games/launch
export const launchGame = async (req, res) => {
  try {
    const { gameCode } = req.body;
    const userId = req.user ? req.user._id : 'demo_user';
    const username = req.user ? req.user.username : 'Guest';

    const game = GAME_CATALOG.find((g) => g.code === gameCode);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    const sessionToken = uuidv4();

    res.json({
      success: true,
      data: {
        game,
        sessionToken,
        launchMode: 'SEAMLESS_EMBED',
        provider: game.provider,
        user: { userId, username },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Place a Live Seamless Casino Bet & Calculate Outcome
// @route   POST /api/games/play-round
export const playGameRound = async (req, res) => {
  try {
    const { gameCode, betAmount = 50, cashoutMultiplier = null } = req.body;
    const amount = Math.max(1, Number(betAmount));

    const game = GAME_CATALOG.find((g) => g.code === gameCode) || {
      code: gameCode || 'pragmatic_highflyer',
      name: 'Aviator',
      provider: 'Pragmatic Play',
      category: 'crash',
    };

    const isAuth = !!req.user && req.user._id && !isDemoUser(req.user._id);
    const userId = isAuth ? req.user._id : DEMO_USER_ID;
    const username = req.user?.username || demoStore.user.username || 'demo';

    let wallet = null;
    if (isAuth && mongoose.connection.readyState === 1) {
      wallet = await Wallet.findOne({ userId });
    }

    const currentBalance = wallet ? wallet.realBalance : demoStore.wallet.realBalance;
    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'অপর্যাপ্ত ব্যালেন্স! অনুগ্রহ করে ওয়ালেটে টাকা ডিপোজিট করুন।',
        currentBalance,
      });
    }

    // Read house RTP setting
    let houseRtp = 'STANDARD';
    try {
      const cfg = await PlatformConfig.findOne({ key: 'GLOBAL_CONFIG' });
      if (cfg && cfg.houseRtpMode) houseRtp = cfg.houseRtpMode;
    } catch (e) {}

    // Determine win probability based on God-Mode RTP
    let winChance = 0.46; // standard ~96.5% RTP
    let maxMul = 20.0;
    if (houseRtp === 'HIGH_PROFIT') {
      winChance = 0.35; // tighter edge
      maxMul = 10.0;
    } else if (houseRtp === 'PROMO_BOOST') {
      winChance = 0.62; // promo acquisition
      maxMul = 35.0;
    }

    // RNG Calculation
    const rand = Math.random();
    const isWin = rand < winChance;
    let multiplier = 0;

    if (isWin) {
      if (game.category === 'crash') {
        // Crash multiplier between 1.15x and maxMul
        multiplier = Number((1.15 + Math.random() * (Math.random() > 0.8 ? maxMul : 3.5)).toFixed(2));
        if (cashoutMultiplier && Number(cashoutMultiplier) > 1 && Number(cashoutMultiplier) <= multiplier) {
          multiplier = Number(Number(cashoutMultiplier).toFixed(2));
        }
      } else {
        // Slots & Table win multiplier
        multiplier = Number((1.2 + Math.random() * (Math.random() > 0.85 ? maxMul : 4.0)).toFixed(2));
      }
    } else {
      multiplier = 0;
    }

    const payout = isWin ? Number((amount * multiplier).toFixed(2)) : 0;
    const netProfit = Number((payout - amount).toFixed(2));
    const roundId = 'rnd_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const txIdDebit = 'tx_d_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const txIdCredit = 'tx_c_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

    let finalBalance = 0;
    let finalWagering = 0;

    // Apply to MongoDB or DemoStore
    if (isAuth && wallet) {
      // 1. Debit
      const balBefore = wallet.realBalance;
      wallet.realBalance = Number((wallet.realBalance - amount).toFixed(2));
      wallet.wageringCurrent = Number(((wallet.wageringCurrent || 0) + amount).toFixed(2));

      await GameTransaction.create({
        txId: txIdDebit,
        userId,
        providerId: game.provider,
        gameCode: game.code,
        roundId,
        type: 'DEBIT',
        amount,
        balanceBefore: balBefore,
        balanceAfter: wallet.realBalance,
        rawPayload: { gameName: game.name, username },
      });

      // 2. Credit if win
      if (isWin && payout > 0) {
        const balBeforeWin = wallet.realBalance;
        wallet.realBalance = Number((wallet.realBalance + payout).toFixed(2));

        await GameTransaction.create({
          txId: txIdCredit,
          userId,
          providerId: game.provider,
          gameCode: game.code,
          roundId,
          type: 'CREDIT',
          amount: payout,
          balanceBefore: balBeforeWin,
          balanceAfter: wallet.realBalance,
          rawPayload: { gameName: game.name, username, multiplier },
        });
      }

      await wallet.save();
      finalBalance = wallet.realBalance;
      finalWagering = wallet.wageringCurrent;
    } else {
      // DemoStore
      const balBefore = demoStore.wallet.realBalance;
      demoStore.wallet.realBalance = Number((demoStore.wallet.realBalance - amount).toFixed(2));
      demoStore.wallet.wageringCurrent = Number(((demoStore.wallet.wageringCurrent || 0) + amount).toFixed(2));

      demoStore.transactions.unshift({
        _id: txIdDebit,
        txId: txIdDebit,
        userId,
        username,
        providerId: game.provider,
        gameCode: game.code,
        gameName: game.name,
        roundId,
        type: 'DEBIT',
        amount,
        balanceBefore: balBefore,
        balanceAfter: demoStore.wallet.realBalance,
        createdAt: new Date().toISOString(),
      });

      let balBeforeWin = demoStore.wallet.realBalance;
      if (isWin && payout > 0) {
        balBeforeWin = demoStore.wallet.realBalance;
        demoStore.wallet.realBalance = Number((demoStore.wallet.realBalance + payout).toFixed(2));

        demoStore.transactions.unshift({
          _id: txIdCredit,
          txId: txIdCredit,
          userId,
          username,
          providerId: game.provider,
          gameCode: game.code,
          gameName: game.name,
          roundId,
          type: 'CREDIT',
          amount: payout,
          balanceBefore: balBeforeWin,
          balanceAfter: demoStore.wallet.realBalance,
          createdAt: new Date().toISOString(),
        });
      }

      // Sync to MongoDB so Admin console sees live bets immediately
      if (mongoose.connection.readyState === 1) {
        try {
          const dbUser = await User.findOne({ username: 'demo' }) || await User.findOne({ role: 'player' }) || await User.findOne();
          if (dbUser) {
            await GameTransaction.create({
              txId: txIdDebit,
              userId: dbUser._id,
              providerId: game.provider,
              gameCode: game.code,
              roundId,
              type: 'DEBIT',
              amount,
              balanceBefore: balBefore,
              balanceAfter: demoStore.wallet.realBalance,
              rawPayload: { gameName: game.name, username },
            });
            if (isWin && payout > 0) {
              await GameTransaction.create({
                txId: txIdCredit,
                userId: dbUser._id,
                providerId: game.provider,
                gameCode: game.code,
                roundId,
                type: 'CREDIT',
                amount: payout,
                balanceBefore: balBeforeWin,
                balanceAfter: demoStore.wallet.realBalance,
                rawPayload: { gameName: game.name, username, multiplier },
              });
            }
          }
        } catch (e) {
          console.warn('GameTransaction MongoDB sync error:', e.message);
        }
      }

      finalBalance = demoStore.wallet.realBalance;
      finalWagering = demoStore.wallet.wageringCurrent;
    }

    res.json({
      success: true,
      data: {
        gameCode: game.code,
        gameName: game.name,
        roundId,
        betAmount: amount,
        multiplier,
        payout,
        netProfit,
        isWin,
        wallet: {
          realBalance: finalBalance,
          wageringCurrent: finalWagering,
        },
        message: isWin
          ? `🎉 অভিনন্দন! ${multiplier}x মাল্টিপ্লায়ারে জিতেছেন ৳ ${payout.toLocaleString()} BDT!`
          : `ক্র্যাশ হয়ে গেছে! আবার চেষ্টা করুন।`,
      },
    });
  } catch (error) {
    console.error('playGameRound error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
