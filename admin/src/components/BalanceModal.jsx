import React, { useState } from 'react';
import { X, Plus, Minus, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { api } from '../services/api';

export const BalanceModal = ({ player, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('ADD'); // ADD or DEDUCT
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setErrorMsg('Please enter a valid positive amount');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await api.adjustPlayerBalance(player._id, {
        amount: Number(amount),
        type,
        remark: remark.trim() || (type === 'ADD' ? 'Admin manual credit adjustment' : 'Admin manual debit adjustment'),
      });
      onSuccess(`৳${amount} BDT successfully ${type === 'ADD' ? 'credited to' : 'debited from'} ${player.username}'s account!`);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Balance adjustment failed');
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 5000, 10000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-slate-800/80 bg-[#111726] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Manual Wallet Adjustment</h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Player: <span className="font-semibold text-white">{player.username}</span> | Current:{' '}
              <span className="font-mono font-bold text-emerald-400">৳{Number(player.balance || 0).toLocaleString()}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Action Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Adjustment Type:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('ADD')}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  type === 'ADD'
                    ? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <Plus size={14} />
                <span>Credit (Deposit)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('DEDUCT')}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  type === 'DEDUCT'
                    ? 'border border-rose-500/50 bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <Minus size={14} />
                <span>Debit (Deduct)</span>
              </button>
            </div>
          </div>

          {/* Quick Amounts */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Quick Preset Amount:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 py-1.5 text-xs font-mono font-bold text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  ৳{q.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Exact Amount (BDT):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">
                ৳
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 pl-8 pr-4 py-2.5 font-mono text-base font-bold text-white outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>

          {/* Audit Remark */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Audit Note / Reason:
            </label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="e.g. VIP Promo Bonus / Manual settlement adjustment"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-rose-500"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white transition-all disabled:opacity-50 ${
                type === 'ADD' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>{loading ? 'Processing...' : type === 'ADD' ? 'Confirm Credit' : 'Confirm Debit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
