import mongoose from 'mongoose';

const platformConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'GLOBAL_CONFIG',
      unique: true,
    },
    marqueeAnnouncements: {
      type: [String],
      default: [
        '🔥 প্লেয়ার arafat_king Aviator গেমে ৳ ১৮,৪০০ ক্যাশআউট করলেন!',
        '💎 নতুন প্লেয়ারদের জন্য ১০০% ওয়েলকাম বোনাস চালু রয়েছে!',
        '⚡ USDT TRC20 ডিপোজিটে পান ইনস্ট্যান্ট ১.৫% অতিরিক্ত ক্যাশ রিবেট!',
        '🏆 প্লেয়ার sakib_pro Gates of Olympus-এ ৳ ৩৫,২০০ জ্যাকপট জিতলেন!',
        '📢 বিকাশ ও নগদ এজেন্ট নম্বর প্রতি ঘণ্টায় পরিবর্তিত হতে পারে, ডিপোজিট পেজের নম্বর দেখে টাকা পাঠান।',
      ],
    },
    megaJackpot: {
      type: Number,
      default: 5420890,
    },
    houseRtpMode: {
      type: String,
      enum: ['STANDARD', 'HIGH_PROFIT', 'PROMO_BOOST'],
      default: 'STANDARD',
    },
    bonusSettings: {
      welcomeBonusPct: { type: Number, default: 100 },
      usdtBonusPct: { type: Number, default: 1.5 },
      weeklyCashbackPct: { type: Number, default: 10 },
    },
    luckyWheelSettings: {
      enabled: { type: Boolean, default: true },
      cooldownHours: { type: Number, default: 24 },
      prizes: {
        type: Array,
        default: [
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
    },
    heroBanners: {
      type: Array,
      default: [
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
    },
  },
  {
    timestamps: true,
  }
);

export const PlatformConfig = mongoose.model('PlatformConfig', platformConfigSchema);
