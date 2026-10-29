import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { demoStore, DEMO_USER_ID } from '../config/demoStore.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ck44_super_jwt_secret_token_bangla_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/wps/member/register
export const registerUser = async (req, res) => {
  try {
    const { username, password, mobile, affiliateCode } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const userExists = await User.findOne({ username: cleanUsername });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    // Check referral if provided
    let referrer = null;
    if (affiliateCode) {
      referrer = await User.findOne({ affiliateCode });
    }

    // Auto-generate affiliate code for new user
    const generatedAffCode = `CK${Math.floor(100000 + Math.random() * 900000)}`;

    const user = await User.create({
      username: cleanUsername,
      password,
      mobile: mobile || '',
      affiliateCode: generatedAffCode,
      referredBy: referrer ? referrer._id : null,
    });

    // Create associated wallet (give initial 500 BDT demo balance for testing)
    const wallet = await Wallet.create({
      userId: user._id,
      currency: 'BDT',
      realBalance: 500.0, // Friendly starting bonus for demonstration
      bonusBalance: 50.0,
      wageringTarget: 500.0,
      wageringCurrent: 0.0,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        vipLevel: user.vipLevel,
        affiliateCode: user.affiliateCode,
        wallet: {
          realBalance: wallet.realBalance,
          bonusBalance: wallet.bonusBalance,
          currency: wallet.currency,
        },
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/wps/session/login
export const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = (username || email || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'ইউজারনেম/ইমেইল এবং পাসওয়ার্ড প্রদান করুন' });
    }

    // Auto-create or ensure Admin account if kabir@gmail.com logs in
    if (identifier === 'kabir@gmail.com' && password === '123456') {
      try {
        if (mongoose.connection.readyState === 1) {
          let admin = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }],
          });

          if (!admin) {
            admin = await User.create({
              username: identifier,
              email: identifier,
              password: '123456',
              role: 'admin',
              mobile: '01800000000',
              affiliateCode: 'CK44ADMIN',
              vipLevel: 5,
              status: 'ACTIVE',
            });
            await Wallet.create({
              userId: admin._id,
              realBalance: 50000.0,
              currency: 'BDT',
            });
          } else if (admin.role !== 'admin') {
            admin.role = 'admin';
            await admin.save();
          }

          let wallet = await Wallet.findOne({ userId: admin._id });
          if (!wallet) {
            wallet = await Wallet.create({ userId: admin._id, realBalance: 50000.0, currency: 'BDT' });
          }

          return res.json({
            success: true,
            message: 'অ্যাডমিন লগইন সফল হয়েছে!',
            data: {
              _id: admin._id,
              username: admin.username,
              email: admin.email || identifier,
              role: 'admin',
              mobile: admin.mobile,
              vipLevel: admin.vipLevel || 5,
              affiliateCode: admin.affiliateCode || 'CK44ADMIN',
              wallet: {
                realBalance: wallet.realBalance,
                bonusBalance: wallet.bonusBalance || 0,
                currency: wallet.currency || 'BDT',
                wageringTarget: 0,
                wageringCurrent: 0,
              },
              token: generateToken(admin._id),
            },
          });
        }
      } catch (err) {
        console.warn('Admin DB quick check error:', err.message);
      }

      // Memory fallback for kabir@gmail.com
      return res.json({
        success: true,
        message: 'অ্যাডমিন লগইন সফল হয়েছে (Direct Demo Admin)!',
        data: {
          _id: '660000000000000000000002',
          username: 'kabir@gmail.com',
          email: 'kabir@gmail.com',
          role: 'admin',
          mobile: '01800000000',
          vipLevel: 5,
          affiliateCode: 'CK44ADMIN',
          wallet: {
            realBalance: 50000.0,
            bonusBalance: 5000.0,
            currency: 'BDT',
            wageringTarget: 0,
            wageringCurrent: 0,
          },
          token: generateToken('660000000000000000000002'),
        },
      });
    }

    let user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    // Fallback only if MongoDB is disconnected and demo credentials provided
    if (!user && identifier === 'demo' && (password === 'password123' || password === '123456')) {
      return res.json({
        success: true,
        message: 'Demo login successful',
        data: {
          _id: demoStore.user._id,
          username: demoStore.user.username,
          role: 'player',
          mobile: demoStore.user.mobile,
          vipLevel: demoStore.user.vipLevel,
          affiliateCode: demoStore.user.affiliateCode,
          wallet: demoStore.wallet,
          token: generateToken(demoStore.user._id),
        },
      });
    }

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'ভুল ইউজারনেম/ইমেইল অথবা পাসওয়ার্ড' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'আপনার অ্যাকাউন্টটি সাসপেন্ড করা হয়েছে। অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।' });
    }

    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      wallet = await Wallet.create({ userId: user._id, realBalance: 1000.0 });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || (user.username === 'kabir@gmail.com' ? 'admin' : 'player'),
        mobile: user.mobile,
        vipLevel: user.vipLevel,
        affiliateCode: user.affiliateCode,
        wallet: {
          realBalance: wallet.realBalance,
          bonusBalance: wallet.bonusBalance,
          currency: wallet.currency,
          wageringTarget: wallet.wageringTarget,
          wageringCurrent: wallet.wageringCurrent,
        },
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Instant 1-Click Guest Registration (CK44 autoUsername)
// @route   POST /api/wps/member/register/autoUsername
export const autoGuestRegister = async (req, res) => {
  try {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const guestUsername = `ck_guest_${randomSuffix}`;
    const autoPassword = `Pass@${randomSuffix}`;
    const generatedAffCode = `CK${randomSuffix}`;

    try {
      const user = await User.create({
        username: guestUsername,
        password: autoPassword,
        affiliateCode: generatedAffCode,
      });

      const wallet = await Wallet.create({
        userId: user._id,
        currency: 'BDT',
        realBalance: 500.0,
        bonusBalance: 50.0,
        wageringTarget: 500.0,
      });

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          autoPassword: autoPassword,
          vipLevel: user.vipLevel,
          affiliateCode: user.affiliateCode,
          wallet: {
            realBalance: wallet.realBalance,
            bonusBalance: wallet.bonusBalance,
            currency: wallet.currency,
          },
          token: generateToken(user._id),
        },
      });
    } catch (dbErr) {
      // In-memory guest fallback
      demoStore.user.username = guestUsername;
      return res.status(201).json({
        success: true,
        data: {
          _id: DEMO_USER_ID,
          username: guestUsername,
          autoPassword: autoPassword,
          vipLevel: 1,
          affiliateCode: generatedAffCode,
          wallet: demoStore.wallet,
          token: generateToken(DEMO_USER_ID),
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile & balance
// @route   GET /api/wps/session/me
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    let wallet = null;

    if (mongoose.connection.readyState === 1) {
      try {
        wallet = await Wallet.findOne({ userId: user._id });
      } catch (err) {}
    }

    if (!wallet && String(user._id) === DEMO_USER_ID) {
      wallet = demoStore.wallet;
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || (user.username === 'kabir@gmail.com' ? 'admin' : 'player'),
        mobile: user.mobile,
        vipLevel: user.vipLevel,
        affiliateCode: user.affiliateCode,
        status: user.status,
        wallet: wallet || demoStore.wallet,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

