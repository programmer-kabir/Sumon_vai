import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
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
      min: [500, 'Minimum withdrawal is 500 BDT'],
    },
    payoutAccount: {
      type: String,
      required: true,
      trim: true,
    },
    turnoverVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PENDING_REVIEW', 'PROCESSING', 'PAID', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
