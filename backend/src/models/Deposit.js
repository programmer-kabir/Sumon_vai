import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: ['BKASH', 'NAGAD', 'ROCKET', 'USDT_TRC20'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [50, 'Minimum deposit is 50 BDT'],
    },
    bonusAmount: {
      type: Number,
      default: 0,
    },
    trxId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    senderMobile: {
      type: String,
      trim: true,
    },
    receiverAccount: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Deposit = mongoose.model('Deposit', depositSchema);
