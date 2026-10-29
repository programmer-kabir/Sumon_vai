import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    realBalance: {
      type: Number,
      required: true,
      default: 0.0,
      min: [0, 'Balance cannot be negative'],
    },
    bonusBalance: {
      type: Number,
      default: 0.0,
      min: 0,
    },
    wageringTarget: {
      type: Number,
      default: 0.0,
    },
    wageringCurrent: {
      type: Number,
      default: 0.0,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Wallet = mongoose.model('Wallet', walletSchema);
