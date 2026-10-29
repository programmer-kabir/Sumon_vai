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
    bonusBalance: 150.0,
    wageringTarget: 500.0,
    wageringCurrent: 250.0,
    currency: 'BDT',
  },
  transactions: [
    {
      _id: 'tx_sample_1',
      txId: 'TX_DEBIT_17110001',
      userId: DEMO_USER_ID,
      username: 'demo',
      providerId: 'Pragmatic Play',
      gameCode: 'pragmatic_highflyer',
      roundId: 'RND_AV_101',
      type: 'DEBIT',
      amount: 100,
      balanceBefore: 1000,
      balanceAfter: 900,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      _id: 'tx_sample_2',
      txId: 'TX_CREDIT_17110002',
      userId: DEMO_USER_ID,
      username: 'demo',
      providerId: 'Pragmatic Play',
      gameCode: 'pragmatic_highflyer',
      roundId: 'RND_AV_101',
      type: 'CREDIT',
      amount: 220,
      balanceBefore: 900,
      balanceAfter: 1120,
      createdAt: new Date(Date.now() - 3600000 * 4 + 15000).toISOString(),
    },
    {
      _id: 'tx_sample_3',
      txId: 'TX_DEBIT_17110003',
      userId: DEMO_USER_ID,
      username: 'demo',
      providerId: 'Pragmatic Play',
      gameCode: 'pragmatic_olympus',
      roundId: 'RND_SL_202',
      type: 'DEBIT',
      amount: 200,
      balanceBefore: 1120,
      balanceAfter: 920,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      _id: 'tx_sample_4',
      txId: 'TX_DEBIT_17110004',
      userId: DEMO_USER_ID,
      username: 'demo',
      providerId: 'Pragmatic Play',
      gameCode: 'pragmatic_spaceman',
      roundId: 'RND_SM_303',
      type: 'DEBIT',
      amount: 150,
      balanceBefore: 920,
      balanceAfter: 770,
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
  ],
  deposits: [
    {
      _id: 'dep_1',
      username: 'demo',
      channel: 'BKASH',
      amount: 1000,
      bonusAmount: 0,
      trxId: '8N7D9S734',
      senderMobile: '01711223344',
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: 'dep_2',
      username: 'player_sakib',
      channel: 'NAGAD',
      amount: 2500,
      bonusAmount: 125,
      trxId: '9K2M4P198',
      senderMobile: '01911998877',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
  withdrawals: [
    {
      _id: 'wth_1',
      username: 'player_shuvo',
      channel: 'BKASH',
      amount: 1500,
      payoutAccount: '01799887766',
      turnoverVerified: true,
      status: 'PENDING',
      createdAt: new Date(Date.now() - 900000).toISOString(),
    },
  ],
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
  reserveFund: 50000, // মালিকের প্রাথমিক ব্যাকআপ রিজার্ভ ফান্ড (৫০,০০০ টাকা)
  monthlyGoal: 150000, // মাসিক লাভ/টার্গেট গোল (১,৫০,০০০ টাকা)
  maxDailyWithdrawal: 5000, // প্লেয়ারের দৈনিক সর্বোচ্চ উইথড্র লিমিট (৫,০০০ টাকা)
  minWithdrawal: 500, // সর্বনিম্ন উইথড্র (৫০০ টাকা)
  maxBetPerRound: 1000, // প্রতি রাউন্ডে সর্বোচ্চ বাজি (১,০০০ টাকা)
};

export const demoPlayers = [
  {
    _id: DEMO_USER_ID,
    username: 'demo',
    email: 'demo@ck44.internal',
    role: 'player',
    mobile: '01711223344',
    balance: 1000,
    totalDeposits: 1000,
    totalWithdrawals: 0,
    totalBets: 450,
    totalWins: 220,
    netLoss: 230,
    wageringStatus: 'IN_PROGRESS',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: '660000000000000000000002',
    username: 'kabir@gmail.com',
    email: 'kabir@gmail.com',
    role: 'admin',
    mobile: '01800000000',
    balance: 50000,
    totalDeposits: 50000,
    totalWithdrawals: 0,
    totalBets: 0,
    totalWins: 0,
    netLoss: 0,
    wageringStatus: 'COMPLETED',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: '660000000000000000000003',
    username: 'player_sakib',
    email: 'sakib@gmail.com',
    role: 'player',
    mobile: '01911998877',
    balance: 3200,
    totalDeposits: 5000,
    totalWithdrawals: 1500,
    totalBets: 8200,
    totalWins: 7900,
    netLoss: 300,
    wageringStatus: 'COMPLETED',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    _id: '660000000000000000000004',
    username: 'player_shuvo',
    email: 'shuvo@gmail.com',
    role: 'player',
    mobile: '01799887766',
    balance: 450,
    totalDeposits: 2000,
    totalWithdrawals: 0,
    totalBets: 3400,
    totalWins: 1850,
    netLoss: 1550,
    wageringStatus: 'IN_PROGRESS',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];


