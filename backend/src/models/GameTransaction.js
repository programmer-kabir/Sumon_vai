import mongoose from 'mongoose';

const gameTransactionSchema = new mongoose.Schema(
  {
    txId: {
      type: String,
      required: true,
      unique: true, // Guarantees strict idempotency
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    providerId: {
      type: String,
      required: true,
      trim: true,
    },
    gameCode: {
      type: String,
      required: true,
      trim: true,
    },
    roundId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['DEBIT', 'CREDIT', 'ROLLBACK'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    rawPayload: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const GameTransaction = mongoose.model('GameTransaction', gameTransactionSchema);
