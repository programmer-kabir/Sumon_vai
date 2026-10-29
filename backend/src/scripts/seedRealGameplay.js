import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { Deposit } from '../models/Deposit.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { GameTransaction } from '../models/GameTransaction.js';

const MOCK_PLAYERS = [
  { username: 'tanvir_gamer', email: 'tanvir@gmail.com', mobile: '01711223344', initialDeposit: 15000, channel: 'BKASH' },
  { username: 'sakib_pro', email: 'sakib@gmail.com', mobile: '01822334455', initialDeposit: 25000, channel: 'NAGAD' },
  { username: 'rahim_boss', email: 'rahim@gmail.com', mobile: '01933445566', initialDeposit: 20000, channel: 'BKASH' },
  { username: 'nusrat_luck', email: 'nusrat@gmail.com', mobile: '01644556677', initialDeposit: 10000, channel: 'ROCKET' },
  { username: 'arafat_king', email: 'arafat@gmail.com', mobile: '01555667788', initialDeposit: 30000, channel: 'USDT_TRC20' },
];

const GAME_ROUNDS = [
  // 1. Aviator (High Flyer Plane)
  { gameCode: 'pragmatic_highflyer', providerId: 'Pragmatic Play', playerIndex: 0, bet: 1000, win: 1850, note: 'Cashout at 1.85x' },
  { gameCode: 'pragmatic_highflyer', providerId: 'Pragmatic Play', playerIndex: 0, bet: 2000, win: 0, note: 'Flew away at 1.15x' },
  { gameCode: 'pragmatic_highflyer', providerId: 'Pragmatic Play', playerIndex: 1, bet: 3000, win: 5400, note: 'Cashout at 1.80x' },
  { gameCode: 'pragmatic_highflyer', providerId: 'Pragmatic Play', playerIndex: 1, bet: 4000, win: 0, note: 'Crashed at 1.02x' },
  { gameCode: 'pragmatic_highflyer', providerId: 'Pragmatic Play', playerIndex: 2, bet: 2500, win: 0, note: 'Crashed at 1.45x' },
  { gameCode: 'pragmatic_highflyer', providerId: 'Pragmatic Play', playerIndex: 4, bet: 6000, win: 5150, note: 'Partial cashout' },

  // 2. Gates of Olympus
  { gameCode: 'pragmatic_olympus', providerId: 'Pragmatic Play', playerIndex: 2, bet: 1500, win: 0, note: 'Spin dry' },
  { gameCode: 'pragmatic_olympus', providerId: 'Pragmatic Play', playerIndex: 2, bet: 1500, win: 2400, note: 'Zeus lightning 15x' },
  { gameCode: 'pragmatic_olympus', providerId: 'Pragmatic Play', playerIndex: 3, bet: 2000, win: 800, note: 'Minor tumble' },
  { gameCode: 'pragmatic_olympus', providerId: 'Pragmatic Play', playerIndex: 3, bet: 2000, win: 0, note: 'Spin dry' },
  { gameCode: 'pragmatic_olympus', providerId: 'Pragmatic Play', playerIndex: 1, bet: 5000, win: 3600, note: 'Free spins bonus' },
  { gameCode: 'pragmatic_olympus', providerId: 'Pragmatic Play', playerIndex: 4, bet: 10000, win: 10000, note: 'Break even spin' },

  // 3. Spaceman
  { gameCode: 'pragmatic_spaceman', providerId: 'Pragmatic Play', playerIndex: 0, bet: 1500, win: 0, note: 'Crash at 1.05x' },
  { gameCode: 'pragmatic_spaceman', providerId: 'Pragmatic Play', playerIndex: 1, bet: 2500, win: 4750, note: 'Cashout at 1.90x' },
  { gameCode: 'pragmatic_spaceman', providerId: 'Pragmatic Play', playerIndex: 3, bet: 1000, win: 0, note: 'Crash at 1.20x' },
  { gameCode: 'pragmatic_spaceman', providerId: 'Pragmatic Play', playerIndex: 4, bet: 5000, win: 6450, note: 'Moon landing 2.15x' },
  { gameCode: 'pragmatic_spaceman', providerId: 'Pragmatic Play', playerIndex: 2, bet: 5000, win: 0, note: 'Crash at 1.10x' },

  // 4. Sweet Bonanza
  { gameCode: 'pragmatic_sweetbonanza', providerId: 'Pragmatic Play', playerIndex: 3, bet: 1200, win: 0, note: 'Spin dry' },
  { gameCode: 'pragmatic_sweetbonanza', providerId: 'Pragmatic Play', playerIndex: 3, bet: 1200, win: 2100, note: 'Candy bomb 25x' },
  { gameCode: 'pragmatic_sweetbonanza', providerId: 'Pragmatic Play', playerIndex: 2, bet: 3000, win: 1400, note: 'Fruit tumble' },
  { gameCode: 'pragmatic_sweetbonanza', providerId: 'Pragmatic Play', playerIndex: 0, bet: 4000, win: 7600, note: 'Mega sweet win' },
  { gameCode: 'pragmatic_sweetbonanza', providerId: 'Pragmatic Play', playerIndex: 4, bet: 5000, win: 0, note: 'Spin dry' },

  // 5. Gates of Olympus 1000 (Player Jackpot Win)
  { gameCode: 'pragmatic_olympus_1000', providerId: 'Pragmatic Play', playerIndex: 1, bet: 2000, win: 15000, note: '1,000x Zeus Mega Jackpot!' },
  { gameCode: 'pragmatic_olympus_1000', providerId: 'Pragmatic Play', playerIndex: 4, bet: 5000, win: 0, note: 'Spin dry' },
  { gameCode: 'pragmatic_olympus_1000', providerId: 'Pragmatic Play', playerIndex: 2, bet: 5000, win: 1200, note: 'Tumble win' },

  // 6. Sugar Rush
  { gameCode: 'pragmatic_sugarrush', providerId: 'Pragmatic Play', playerIndex: 3, bet: 1500, win: 0, note: 'Spin dry' },
  { gameCode: 'pragmatic_sugarrush', providerId: 'Pragmatic Play', playerIndex: 0, bet: 2500, win: 1900, note: 'Multiplier spot' },
  { gameCode: 'pragmatic_sugarrush', providerId: 'Pragmatic Play', playerIndex: 4, bet: 4000, win: 4000, note: 'Even spin' },

  // 7. Big Bass Crash
  { gameCode: 'pragmatic_bigbasscrash', providerId: 'Pragmatic Play', playerIndex: 2, bet: 2000, win: 3600, note: 'Net catch at 1.8x' },
  { gameCode: 'pragmatic_bigbasscrash', providerId: 'Pragmatic Play', playerIndex: 1, bet: 4000, win: 0, note: 'Boat sunk at 1.08x' },
  { gameCode: 'pragmatic_bigbasscrash', providerId: 'Pragmatic Play', playerIndex: 0, bet: 3000, win: 2600, note: 'Early catch' },
];

async function seedRealData() {
  console.log('🔄 Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB Atlas successfully.');

  const createdUsers = [];

  // 1. Create or load real players
  for (const p of MOCK_PLAYERS) {
    let user = await User.findOne({ username: p.username });
    if (!user) {
      user = await User.create({
        username: p.username,
        email: p.email,
        password: 'password123',
        mobile: p.mobile,
        role: 'player',
        vipLevel: 2,
        affiliateCode: `CK${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'ACTIVE',
      });
      console.log(`👤 Created player: ${p.username}`);
    }

    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      wallet = await Wallet.create({
        userId: user._id,
        realBalance: p.initialDeposit,
        bonusBalance: p.initialDeposit * 0.05,
        wageringTarget: p.initialDeposit,
        wageringCurrent: 0,
        currency: 'BDT',
      });
    }

    // Create approved deposit
    const existingDep = await Deposit.findOne({ userId: user._id, trxId: `TRX_${p.username}` });
    if (!existingDep) {
      await Deposit.create({
        userId: user._id,
        channel: p.channel,
        amount: p.initialDeposit,
        bonusAmount: p.initialDeposit * 0.05,
        trxId: `TRX_${p.username}`,
        senderMobile: p.mobile,
        status: 'APPROVED',
      });
      console.log(`💰 Created approved deposit: ৳${p.initialDeposit} for ${p.username}`);
    }

    createdUsers.push({ user, wallet });
  }

  // 2. Execute Real Gameplay Rounds (DEBIT bets & CREDIT wins)
  console.log('🎰 Simulating real gameplay rounds & writing GameTransaction records...');
  let roundCounter = 1;

  for (const r of GAME_ROUNDS) {
    const playerObj = createdUsers[r.playerIndex];
    if (!playerObj) continue;

    const roundId = `RND_REAL_${Date.now()}_${roundCounter++}`;
    const debitTxId = `TX_DEB_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    const wallet = await Wallet.findOne({ userId: playerObj.user._id });
    if (!wallet || wallet.realBalance < r.bet) continue;

    const balBeforeBet = wallet.realBalance;
    wallet.realBalance = Number((wallet.realBalance - r.bet).toFixed(2));
    wallet.wageringCurrent = Number((wallet.wageringCurrent + r.bet).toFixed(2));
    await wallet.save();

    // 1. Write DEBIT transaction (Bet)
    await GameTransaction.create({
      txId: debitTxId,
      userId: playerObj.user._id,
      providerId: r.providerId,
      gameCode: r.gameCode,
      roundId,
      type: 'DEBIT',
      amount: r.bet,
      balanceBefore: balBeforeBet,
      balanceAfter: wallet.realBalance,
      rawPayload: { note: r.note },
    });

    // 2. If won, write CREDIT transaction (Win)
    if (r.win > 0) {
      const creditTxId = `TX_CRE_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      const balBeforeWin = wallet.realBalance;
      wallet.realBalance = Number((wallet.realBalance + r.win).toFixed(2));
      await wallet.save();

      await GameTransaction.create({
        txId: creditTxId,
        userId: playerObj.user._id,
        providerId: r.providerId,
        gameCode: r.gameCode,
        roundId,
        type: 'CREDIT',
        amount: r.win,
        balanceBefore: balBeforeWin,
        balanceAfter: wallet.realBalance,
        rawPayload: { note: r.note },
      });
    }
  }

  // 3. Create sample withdrawals (both PAID and PENDING)
  const sakib = createdUsers[1].user;
  const existingWth1 = await Withdrawal.findOne({ userId: sakib._id });
  if (!existingWth1) {
    await Withdrawal.create({
      userId: sakib._id,
      channel: 'NAGAD',
      amount: 8000,
      payoutAccount: '01822334455',
      turnoverVerified: true,
      status: 'PAID',
    });
    console.log('💳 Created paid withdrawal: ৳8,000 for sakib_pro');
  }

  const rahim = createdUsers[2].user;
  const existingWth2 = await Withdrawal.findOne({ userId: rahim._id, status: 'PENDING' });
  if (!existingWth2) {
    await Withdrawal.create({
      userId: rahim._id,
      channel: 'BKASH',
      amount: 5000,
      payoutAccount: '01933445566',
      turnoverVerified: true,
      status: 'PENDING',
    });
    console.log('⏳ Created PENDING withdrawal: ৳5,000 for rahim_boss (For admin to test approval/reject)');
  }

  // 4. Print Summary from MongoDB
  const totalDeps = await Deposit.aggregate([
    { $match: { status: 'APPROVED' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalWths = await Withdrawal.aggregate([
    { $match: { status: 'PAID' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalTxs = await GameTransaction.aggregate([
    {
      $group: {
        _id: null,
        totalBets: { $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0] } },
        totalPayouts: { $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0] } },
        txCount: { $sum: 1 },
      },
    },
  ]);

  const depositSum = totalDeps[0]?.total || 0;
  const withdrawSum = totalWths[0]?.total || 0;
  const betSum = totalTxs[0]?.totalBets || 0;
  const payoutSum = totalTxs[0]?.totalPayouts || 0;
  const ggrProfit = betSum - payoutSum;
  const netCashProfit = depositSum - withdrawSum;

  console.log('\n=============================================');
  console.log('🎉 REAL GAMEPLAY SIMULATION COMPLETED IN MONGODB ATLAS!');
  console.log(`📥 Total Real Deposits: ৳${depositSum.toLocaleString()}`);
  console.log(`📤 Total Paid Withdrawals: ৳${withdrawSum.toLocaleString()}`);
  console.log(`💵 Net Platform Profit (Cash): ৳${netCashProfit.toLocaleString()}`);
  console.log(`🎲 Total Bets Placed (Turnover): ৳${betSum.toLocaleString()}`);
  console.log(`🏆 Total Player Payouts: ৳${payoutSum.toLocaleString()}`);
  console.log(`🎰 Casino GGR Profit from Games: ৳${ggrProfit.toLocaleString()}`);
  console.log(`📜 Total Game Transaction Records: ${totalTxs[0]?.txCount || 0}`);
  console.log('=============================================\n');

  process.exit(0);
}

seedRealData().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
