export const DEMO_USER_ID = '660000000000000000000001';

export const demoStore = {
  user: {
    _id: DEMO_USER_ID,
    username: 'demo',
    password: 'password123',
    mobile: '01711223344',
    vipLevel: 3,
    affiliateCode: 'CK44DEMO',
    status: 'ACTIVE',
  },
  wallet: {
    userId: DEMO_USER_ID,
    realBalance: 1000.0,
    bonusBalance: 0.0,
    wageringTarget: 0.0,
    wageringCurrent: 0.0,
    currency: 'BDT',
  },
  transactions: [],
  deposits: [],
  withdrawals: [],
};

export const isDemoUser = (identifier) => {
  if (!identifier) return false;
  const str = String(identifier).toLowerCase();
  return str === 'demo' || str === DEMO_USER_ID || str.startsWith('ck_guest_') || str === 'guest';
};

export const paymentSettings = {
  bkash: '01712-345678',
  nagad: '01899-876543',
  rocket: '01911-223344',
  usdt: 'TYDzsxdczSu4mE9GfF1k4eBq8yL3K9wP3e',
};

export const platformSettings = {
  reserveFund: 50000,
  monthlyGoal: 150000,
  maxDailyWithdrawal: 5000,
  minWithdrawal: 500,
  maxBetPerRound: 1000,
  turnoverMultiplier: 1.0,
};

export const demoPlayers = [];
