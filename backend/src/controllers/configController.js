import mongoose from 'mongoose';
import { PlatformConfig } from '../models/PlatformConfig.js';
import { GameTransaction } from '../models/GameTransaction.js';
import { demoStore, paymentSettings } from '../config/demoStore.js';

let memoryConfig = {
  marqueeAnnouncements: [
    '🔥 প্লেয়ার arafat_king Aviator গেমে ৳ ১৮,৪০০ ক্যাশআউট করলেন!',
    '💎 নতুন প্লেয়ারদের জন্য ১০০% ওয়েলকাম বোনাস চালু রয়েছে!',
    '⚡ USDT TRC20 ডিপোজিটে পান ইনস্ট্যান্ট ১.৫% অতিরিক্ত ক্যাশ রিবেট!',
    '🏆 প্লেয়ার sakib_pro Gates of Olympus-এ ৳ ৩৫,২০০ জ্যাকপট জিতলেন!',
    '📢 বিকাশ ও নগদ এজেন্ট নম্বর প্রতি ঘণ্টায় পরিবর্তিত হতে পারে, ডিপোজিট পেজের নম্বর দেখে টাকা পাঠান।',
  ],
  megaJackpot: 5420890,
  houseRtpMode: 'STANDARD', // STANDARD (96.5%), HIGH_PROFIT (88%), PROMO_BOOST (98%)
  bonusSettings: {
    welcomeBonusPct: 100,
    usdtBonusPct: 1.5,
    weeklyCashbackPct: 10,
  },
  luckyWheelSettings: {
    enabled: true,
    cooldownHours: 24,
    prizes: [
      { id: 1, label: '৳ ১০', amount: 10, type: 'cash', color: '#10b981', weight: 30 },
      { id: 2, label: '৳ ২৫', amount: 25, type: 'cash', color: '#3b82f6', weight: 25 },
      { id: 3, label: '৳ ৫০', amount: 50, type: 'cash', color: '#8b5cf6', weight: 15 },
      { id: 4, label: '৳ ১০০', amount: 100, type: 'cash', color: '#ec4899', weight: 10 },
      { id: 5, label: '৳ ৫০০ মেগা', amount: 500, type: 'cash', color: '#f59e0b', weight: 3 },
      { id: 6, label: 'পরের বার', amount: 0, type: 'miss', color: '#64748b', weight: 12 },
      { id: 7, label: '৳ ১৫ ক্যাশ', amount: 15, type: 'cash', color: '#06b6d4', weight: 20 },
      { id: 8, label: '৳ ২০০ গোল্ড', amount: 200, type: 'cash', color: '#eab308', weight: 5 },
    ],
  },
  heroBanners: [
    {
      id: 1,
      tag: '✈️ লাইভ ক্র্যাশ গেম',
      title: 'AVIATOR (HIGH FLYER)',
      highlight: 'প্লেন ওড়ার আগেই ক্যাশআউট করুন!',
      desc: 'লাল ফাইটার জেট আকাশে ওঠার সাথে সাথে বাড়বে আপনার মাল্টিপ্লায়ার। যেকোনো মুহূর্তে ক্যাশআউট নিন।',
      bg: 'linear-gradient(135deg, #450a0a 0%, #1c0404 100%)',
      borderColor: '#ef4444',
      actionText: 'খেলুন (Play Aviator)',
      actionType: 'play_aviator',
    },
    {
      id: 2,
      tag: '⚡ স্লটস জ্যাকপট',
      title: 'GATES OF OLYMPUS',
      highlight: 'জিউসের বাজ ও ৫,০০০x মেগা উইন',
      desc: 'প্র্যাগম্যাটিক প্লে-এর সর্বাধিক জনপ্রিয় স্লট। টাম্বল উইন ও ৫০০x মাল্টিপ্লায়ারে জিতুন কোটি টাকার জ্যাকপট।',
      bg: 'linear-gradient(135deg, #31135e 0%, #120529 100%)',
      borderColor: '#a855f7',
      actionText: 'খেলুন (Gates of Olympus)',
      actionType: 'play_olympus',
    },
    {
      id: 3,
      tag: '🚀 ফ্ল্যাগশিপ ক্র্যাশ গেম',
      title: 'PRAGMATIC PLAY SPACEMAN',
      highlight: 'সর্বোচ্চ ৫,০০০x জ্যাকপট মাল্টিপ্লায়ার',
      desc: 'মহাকাশে পাড়ি দিন স্পেসম্যানের সাথে! ৫০% এবং ১০০% ক্যাশআউট নিয়ে বড় অঙ্কের টাকা জিতুন।',
      bg: 'linear-gradient(135deg, #1e1b4b 0%, #0c0a2a 100%)',
      borderColor: '#818cf8',
      actionText: 'খেলুন (Play Spaceman)',
      actionType: 'play_spaceman',
    },
    {
      id: 4,
      tag: 'ওয়েলকাম অফার',
      title: '১০০% ফার্স্ট ডিপোজিট বোনাস',
      highlight: 'সর্বোচ্চ ৳ ১০,০০০ পর্যন্ত বোনাস',
      desc: 'বিকাশ, নগদ বা USDT-তে ডিপোজিট করে দ্বিগুণ ব্যালেন্স নিয়ে সব গেম উপভোগ করুন।',
      bg: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
      borderColor: '#10b981',
      actionText: 'ডিপোজিট করুন',
      actionType: 'deposit',
    },
  ],
};

// @desc    Get Public Platform Config (Banners, Marquee, Jackpot, RTP Mode)
// @route   GET /api/config/public
export const getPublicConfig = async (req, res) => {
  try {
    let config = memoryConfig;

    if (mongoose.connection.readyState === 1) {
      try {
        let dbConfig = await PlatformConfig.findOne({ key: 'GLOBAL_CONFIG' });
        if (!dbConfig) {
          dbConfig = await PlatformConfig.create({ key: 'GLOBAL_CONFIG', ...memoryConfig });
        }
        config = dbConfig;
      } catch (e) {
        console.warn('DB config load error:', e.message);
      }
    }

    const configObj = config && config.toObject ? config.toObject() : { ...(config || {}) };
    configObj.paymentSettings = paymentSettings;

    res.json({
      success: true,
      data: configObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Platform Config (CMS Banners, Notices, RTP Mode, Jackpot)
// @route   PUT /api/config/update
export const updatePlatformConfig = async (req, res) => {
  try {
    const { marqueeAnnouncements, megaJackpot, houseRtpMode, bonusSettings, heroBanners } = req.body;

    if (marqueeAnnouncements) memoryConfig.marqueeAnnouncements = marqueeAnnouncements;
    if (megaJackpot !== undefined) memoryConfig.megaJackpot = Number(megaJackpot);
    if (houseRtpMode) memoryConfig.houseRtpMode = houseRtpMode;
    if (bonusSettings) memoryConfig.bonusSettings = { ...memoryConfig.bonusSettings, ...bonusSettings };
    if (heroBanners) memoryConfig.heroBanners = heroBanners;

    let updated = memoryConfig;

    if (mongoose.connection.readyState === 1) {
      try {
        updated = await PlatformConfig.findOneAndUpdate(
          { key: 'GLOBAL_CONFIG' },
          {
            $set: {
              marqueeAnnouncements: memoryConfig.marqueeAnnouncements,
              megaJackpot: memoryConfig.megaJackpot,
              houseRtpMode: memoryConfig.houseRtpMode,
              bonusSettings: memoryConfig.bonusSettings,
              heroBanners: memoryConfig.heroBanners,
            },
          },
          { new: true, upsert: true }
        );
      } catch (e) {
        console.warn('DB config save error:', e.message);
      }
    }

    res.json({
      success: true,
      message: 'প্ল্যাটফর্ম সিএমএস ও সেটিংস সফলভাবে আপডেট করা হয়েছে!',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Live Social Proof Real Winners Stream
// @route   GET /api/config/live-winners
export const getLiveWinners = async (req, res) => {
  try {
    let winners = [];

    if (mongoose.connection.readyState === 1) {
      try {
        const txWins = await GameTransaction.find({ type: 'CREDIT', amount: { $gte: 200 } })
          .populate('userId', 'username')
          .sort({ createdAt: -1 })
          .limit(15);

        if (txWins.length > 0) {
          winners = txWins.map((w) => {
            const rawUser = w.userId ? w.userId.username : 'player';
            const maskedUser = rawUser.length > 4 ? `${rawUser.slice(0, 3)}***` : rawUser;
            return {
              id: w._id,
              user: maskedUser,
              gameCode: w.gameCode,
              gameName: w.gameCode.replace('pragmatic_', '').replace('_', ' ').toUpperCase(),
              amount: w.amount,
              time: w.createdAt,
            };
          });
        }
      } catch (e) {}
    }

    // Fallback if empty
    if (winners.length === 0) {
      winners = [
        { id: '1', user: 'ara***', gameName: 'AVIATOR', amount: 5150, time: new Date() },
        { id: '2', user: 'sak***', gameName: 'OLYMPUS', amount: 15000, time: new Date() },
        { id: '3', user: 'tan***', gameName: 'SPACEMAN', amount: 4750, time: new Date() },
        { id: '4', user: 'nus***', gameName: 'SWEET BONANZA', amount: 2100, time: new Date() },
      ];
    }

    res.json({ success: true, data: winners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
