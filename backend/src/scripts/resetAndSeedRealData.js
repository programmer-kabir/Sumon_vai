import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { Deposit } from '../models/Deposit.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { GameTransaction } from '../models/GameTransaction.js';

const REAL_PLAYERS = [
  {
    username: 'sakib_hossain',
    email: 'sakib75@gmail.com',
    mobile: '01712984521',
    password: 'password123',
    depositAmount: 5000,
    depositChannel: 'BKASH',
    trxId: 'BL7A9K3291',
    vipLevel: 2,
  },
  {
    username: 'rashedul_islam',
    email: 'rashed.ctg@gmail.com',
    mobile: '01834112233',
    password: 'password123',
    depositAmount: 8000,
    depositChannel: 'NAGAD',
    trxId: '9K2M4P1982',
    vipLevel: 3,
  },
  {
    username: 'tamim_mahmud',
    email: 'tamim.syl@gmail.com',
    mobile: '01915443322',
    password: 'password123',
    depositAmount: 12000,
    depositChannel: 'BKASH',
    trxId: 'BM8D2J5510',
    vipLevel: 2,
  },
  {
    username: 'farhan_ahmed',
    email: 'farhan.dhk@gmail.com',
    mobile: '01620556677',
    password: 'password123',
    depositAmount: 4000,
    depositChannel: 'ROCKET',
    trxId: 'RK4N7H8923',
    vipLevel: 1,
  },
  {
    username: 'nayem_uddin',
    email: 'nayem.raj@gmail.com',
    mobile: '01799334455',
    password: 'password123',
    depositAmount: 15000,
    depositChannel: 'USDT_TRC20',
    trxId: 'TX982348a7b1c3d',
    vipLevel: 4,
  },
];

// Realistic game rounds with bets and outcomes
const ROUNDS = [
  // 1. Aviator (High Flyer Plane)
  { playerIdx: 0, gameCode: 'pragmatic_highflyer', gameName: 'Aviator (High Flyer Plane)', bet: 500, win: 880 }, // win 1.76x
  { playerIdx: 0, gameCode: 'pragmatic_highflyer', gameName: 'Aviator (High Flyer Plane)', bet: 700, win: 0 },   // loss
  { playerIdx: 1, gameCode: 'pragmatic_highflyer', gameName: 'Aviator (High Flyer Plane)', bet: 1000, win: 1950 }, // win 1.95x
  { playerIdx: 1, gameCode: 'pragmatic_highflyer', gameName: 'Aviator (High Flyer Plane)', bet: 1200, win: 0 },    // loss
  { playerIdx: 2, gameCode: 'pragmatic_highflyer', gameName: 'Aviator (High Flyer Plane)', bet: 1500, win: 0 },    // loss
  { playerIdx: 3, gameCode: 'pragmatic_highflyer', gameName: 'Aviator (High Flyer Plane)', bet: 600, win: 1140 },  // win 1.90x

  // 2. Gates of Olympus
  { playerIdx: 1, gameCode: 'pragmatic_olympus', gameName: 'Gates of Olympus', bet: 800, win: 0 },
  { playerIdx: 1, gameCode: 'pragmatic_olympus', gameName: 'Gates of Olympus', bet: 800, win: 1450 }, // tumble win
  { playerIdx: 2, gameCode: 'pragmatic_olympus', gameName: 'Gates of Olympus', bet: 1200, win: 0 },
  { playerIdx: 2, gameCode: 'pragmatic_olympus', gameName: 'Gates of Olympus', bet: 1200, win: 2600 }, // zeus 25x
  { playerIdx: 4, gameCode: 'pragmatic_olympus', gameName: 'Gates of Olympus', bet: 2000, win: 0 },

  // 3. Spaceman
  { playerIdx: 0, gameCode: 'pragmatic_spaceman', gameName: 'Spaceman', bet: 400, win: 0 },
  { playerIdx: 0, gameCode: 'pragmatic_spaceman', gameName: 'Spaceman', bet: 600, win: 960 },
  { playerIdx: 3, gameCode: 'pragmatic_spaceman', gameName: 'Spaceman', bet: 500, win: 0 },
  { playerIdx: 4, gameCode: 'pragmatic_spaceman', gameName: 'Spaceman', bet: 1500, win: 2400 },

  // 4. Sweet Bonanza
  { playerIdx: 2, gameCode: 'pragmatic_sweetbonanza', gameName: 'Sweet Bonanza', bet: 1000, win: 0 },
  { playerIdx: 2, gameCode: 'pragmatic_sweetbonanza', gameName: 'Sweet Bonanza', bet: 1000, win: 1850 },
  { playerIdx: 3, gameCode: 'pragmatic_sweetbonanza', gameName: 'Sweet Bonanza', bet: 500, win: 0 },

  // 5. Gates of Olympus 1000
  { playerIdx: 1, gameCode: 'pragmatic_olympus_1000', gameName: 'Gates of Olympus 1000', bet: 1000, win: 0 },
  { playerIdx: 4, gameCode: 'pragmatic_olympus_1000', gameName: 'Gates of Olympus 1000', bet: 2000, win: 3600 },

  // 6. Big Bass Crash
  { playerIdx: 0, gameCode: 'pragmatic_bigbasscrash', gameName: 'Big Bass Crash', bet: 500, win: 0 },
  { playerIdx: 2, gameCode: 'pragmatic_bigbasscrash', gameName: 'Big Bass Crash', bet: 800, win: 1280 },
];

async function runResetAndSeed() {
  console.log('🔄 Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB Atlas.');

  // 1. Ensure Admin kabir@gmail.com is kept or created
  let admin = await User.findOne({
    $or: [{ username: 'kabir@gmail.com' }, { email: 'kabir@gmail.com' }],
  });

  if (!admin) {
    admin = await User.create({
      username: 'kabir@gmail.com',
      email: 'kabir@gmail.com',
      password: '123456',
      mobile: '01800000000',
      role: 'admin',
      vipLevel: 5,
      affiliateCode: 'CK44ADMIN',
      status: 'ACTIVE',
    });
    console.log('👑 Admin created: kabir@gmail.com');
  }

  // Ensure admin wallet
  await Wallet.findOneAndUpdate(
    { userId: admin._id },
    {
      $setOnInsert: {
        currency: 'BDT',
        realBalance: 50000,
        bonusBalance: 0,
        wageringTarget: 0,
        wageringCurrent: 0,
      },
    },
    { upsert: true, new: true }
  );

  // 2. Clear old mock data
  console.log('🧹 Purging all old mock users and fake game transactions...');
  await User.deleteMany({ _id: { $ne: admin._id } });
  await Wallet.deleteMany({ userId: { $ne: admin._id } });
  await GameTransaction.deleteMany({});
  await Deposit.deleteMany({});
  await Withdrawal.deleteMany({});
  console.log('✨ All old mock data successfully cleared.');

  // 3. Create real active players
  const createdPlayers = [];
  for (const p of REAL_PLAYERS) {
    const user = await User.create({
      username: p.username,
      email: p.email,
      password: p.password,
      mobile: p.mobile,
      role: 'player',
      vipLevel: p.vipLevel,
      affiliateCode: `CK${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'ACTIVE',
    });

    const bonusAmount = p.depositChannel === 'USDT_TRC20' ? p.depositAmount * 0.015 : 0;
    const initialBalance = p.depositAmount + bonusAmount;

    const wallet = await Wallet.create({
      userId: user._id,
      currency: 'BDT',
      realBalance: initialBalance,
      bonusBalance: bonusAmount,
      wageringTarget: p.depositAmount,
      wageringCurrent: 0,
    });

    // Create authentic approved deposit record
    await Deposit.create({
      userId: user._id,
      channel: p.depositChannel,
      amount: p.depositAmount,
      bonusAmount,
      trxId: p.trxId,
      senderMobile: p.mobile,
      status: 'APPROVED',
      approvedBy: admin._id,
    });

    createdPlayers.push({ user, wallet });
    console.log(`👤 Created player: ${p.username} (${p.mobile}) with deposit ৳${p.depositAmount}`);
  }

  // 4. Create 1 realistic pending withdrawal for testing
  const withdrawPlayer = createdPlayers[1]; // rashedul_islam
  await Withdrawal.create({
    userId: withdrawPlayer.user._id,
    channel: 'NAGAD',
    amount: 2500,
    payoutAccount: withdrawPlayer.user.mobile,
    turnoverVerified: true,
    status: 'PENDING',
    adminNotes: 'প্লেয়ার উইথড্রল রিকোয়েস্ট করেছেন, যাচাই করুন।',
  });
  console.log(`💸 Created test pending withdrawal of ৳2,500 for ${withdrawPlayer.user.username}`);

  // 5. Execute authentic gameplay rounds
  console.log('🎮 Simulating real game bets & payouts...');
  let roundSeq = 1001;

  for (const r of ROUNDS) {
    const p = createdPlayers[r.playerIdx];
    const roundId = `RND_${r.gameCode.toUpperCase()}_${roundSeq++}`;
    const debitTxId = `TX_DEB_${roundSeq}_${Date.now() % 100000}`;

    // A. Debit (Bet)
    const balBefore = p.wallet.realBalance;
    const balAfter = Number((balBefore - r.bet).toFixed(2));
    p.wallet.realBalance = balAfter;
    p.wallet.wageringCurrent = Number((p.wallet.wageringCurrent + r.bet).toFixed(2));
    await p.wallet.save();

    await GameTransaction.create({
      txId: debitTxId,
      userId: p.user._id,
      providerId: 'Pragmatic Play',
      gameCode: r.gameCode,
      roundId,
      type: 'DEBIT',
      amount: r.bet,
      balanceBefore: balBefore,
      balanceAfter: balAfter,
      rawPayload: { gameName: r.gameName, bet: r.bet },
    });

    // B. Credit (Win) if any
    if (r.win > 0) {
      const creditTxId = `TX_CRD_${roundSeq}_${Date.now() % 100000}`;
      const winBalBefore = p.wallet.realBalance;
      const winBalAfter = Number((winBalBefore + r.win).toFixed(2));
      p.wallet.realBalance = winBalAfter;
      await p.wallet.save();

      await GameTransaction.create({
        txId: creditTxId,
        userId: p.user._id,
        providerId: 'Pragmatic Play',
        gameCode: r.gameCode,
        roundId,
        type: 'CREDIT',
        amount: r.win,
        balanceBefore: winBalBefore,
        balanceAfter: winBalAfter,
        rawPayload: { gameName: r.gameName, win: r.win },
      });
    }
  }

  console.log('🎉 Reset and seeding complete! Database is now 100% clean and filled with authentic users and gameplay.');
  await mongoose.disconnect();
}

runResetAndSeed().catch((err) => {
  console.error('Error seeding data:', err);
  process.exit(1);
});

