import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['player', 'admin', 'agent'],
      default: 'player',
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: '',
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    vipLevel: {
      type: Number,
      default: 1, // 1: Bronze, 2: Silver, 3: Gold, 4: Platinum, 5: Diamond
    },
    affiliateCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'BANNED'],
      default: 'ACTIVE',
    },
    lastLuckySpin: {
      type: Date,
      default: null,
    },
    totalLuckyWheelWins: {
      type: Number,
      default: 0,
    },
    customTurnoverMultiplier: {
      type: Number,
      default: null,
    },
    customMaxDailyWithdrawal: {
      type: Number,
      default: null,
    },
    customMaxBet: {
      type: Number,
      default: null,
    },
    manualTurnoverGranted: {
      type: Number,
      default: 0,
    },
    turnoverWaived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
