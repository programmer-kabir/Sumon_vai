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
