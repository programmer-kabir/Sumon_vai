import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { Deposit } from '../models/Deposit.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ [MongoDB Atlas Connected]: ${conn.connection.host}`);

    // Automatically seed the 1 initial player & 1,000 BDT deposit if database is fresh
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Seeding initial baseline player (demo) with 1,000 BDT deposit...');
        const initialUser = await User.create({
          username: 'demo',
          password: 'password123',
          mobile: '01711223344',
          affiliateCode: 'CK44OFFICIAL',
        });

        await Wallet.create({
          userId: initialUser._id,
          currency: 'BDT',
          realBalance: 1000.0,
          bonusBalance: 0,
          wageringTarget: 1000.0,
          wageringCurrent: 500.0,
        });

        await Deposit.create({
          userId: initialUser._id,
          channel: 'BKASH',
          amount: 1000,
          bonusAmount: 0,
          trxId: '8N7D9S734',
          senderMobile: '01711223344',
          status: 'APPROVED',
        });
        console.log('✅ Baseline player & 1,000 BDT deposit successfully created in MongoDB Atlas!');
      }

      // Seed or ensure Admin account (kabir@gmail.com / 123456)
      try {
        const adminEmail = 'kabir@gmail.com';
        let adminUser = await User.findOne({
          $or: [{ username: adminEmail }, { email: adminEmail }],
        });

        if (!adminUser) {
          console.log('👑 Creating Super Admin account: kabir@gmail.com ...');
          adminUser = await User.create({
            username: adminEmail,
            email: adminEmail,
            password: '123456',
            mobile: '01800000000',
            role: 'admin',
            affiliateCode: 'CK44ADMIN',
            vipLevel: 5,
            status: 'ACTIVE',
          });

          await Wallet.create({
            userId: adminUser._id,
            currency: 'BDT',
            realBalance: 50000.0,
            bonusBalance: 5000.0,
            wageringTarget: 0,
            wageringCurrent: 0,
          });
          console.log('✅ Admin Account kabir@gmail.com created successfully with ৳50,000 balance!');
        } else {
          // Ensure role is admin
          let changed = false;
          if (adminUser.role !== 'admin') {
            adminUser.role = 'admin';
            changed = true;
          }
          if (adminUser.status !== 'ACTIVE') {
            adminUser.status = 'ACTIVE';
            changed = true;
          }
          if (changed) {
            await adminUser.save();
          }
        }
      } catch (adminErr) {
        console.warn('Admin seed check warning:', adminErr.message);
      }
    } catch (seedErr) {
      console.warn('DB seed check warning:', seedErr.message);
    }

    return true;
  } catch (error) {
    console.error(`⚠️ [MongoDB Connection Warning]: ${error.message}`);
    return false;
  }
};
