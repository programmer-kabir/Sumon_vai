import React, { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle, RefreshCw, ShieldAlert, Award, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const LimitsPage = () => {
  const [limits, setLimits] = useState({
    reserveFund: 50000,
    monthlyGoal: 150000,
    maxDailyWithdrawal: 5000,
    minWithdrawal: 500,
    maxBetPerRound: 1000,
    turnoverMultiplier: 1.0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchLimits = async () => {
    setLoading(true);
    try {
      const res = await api.getPlatformLimits();
      if (res.data) setLimits(res.data);
    } catch (err) {
      console.error('Failed to load limits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updatePlatformLimits(limits);
      setToastMsg('Platform risk management policies and turnover rules successfully saved!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Limits update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed right-8 top-20 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-300 shadow-lg backdrop-blur-md">
          <CheckCircle size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <Sliders size={14} className="text-cyan-400" />
              <span>Risk & Limits Policy</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              Platform Limits & Wagering Multipliers
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Define corporate reserve pools, monthly profit benchmarks, default withdrawal turnover requirements, and player wager caps.
            </p>
          </div>

          <button
            onClick={fetchLimits}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-cyan-400' : ''} />
            <span>{loading ? 'Refreshing...' : 'Reload Policies'}</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Turnover Requirement Multiplier */}
          <div className="space-y-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <ShieldCheck size={16} />
              <span>Global Turnover Multiplier (x):</span>
            </div>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="10"
              value={limits.turnoverMultiplier || 1.0}
              onChange={(e) => setLimits({ ...limits, turnoverMultiplier: Number(e.target.value) })}
              className="w-full rounded-xl border border-amber-500/30 bg-slate-900/90 px-3.5 py-2.5 font-mono text-base font-bold text-amber-400 outline-none focus:border-amber-400"
              required
            />
            <p className="text-[11px] text-slate-400">
              e.g., <strong>1.0x</strong> means if a player deposits ৳1,000, they must place ৳1,000 in bets before withdrawal is unlocked.
            </p>
          </div>

          {/* Reserve Fund */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Primary Reserve Fund (BDT):
            </label>
            <input
              type="number"
              value={limits.reserveFund}
              onChange={(e) => setLimits({ ...limits, reserveFund: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 font-mono text-base font-bold text-cyan-400 outline-none focus:border-cyan-500"
              required
            />
            <p className="text-[11px] text-slate-400">Guaranteed liquidity pool held for large player payout solvency.</p>
          </div>

          {/* Monthly Goal */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Monthly Net Profit Target (BDT):
            </label>
            <input
              type="number"
              value={limits.monthlyGoal}
              onChange={(e) => setLimits({ ...limits, monthlyGoal: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 font-mono text-base font-bold text-amber-400 outline-none focus:border-amber-500"
              required
            />
            <p className="text-[11px] text-slate-400">Primary KPI benchmark tracked on the overview dashboard.</p>
          </div>

          {/* Daily Withdrawal */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Max Daily Payout Per Player (BDT):
            </label>
            <input
              type="number"
              value={limits.maxDailyWithdrawal}
              onChange={(e) => setLimits({ ...limits, maxDailyWithdrawal: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 font-mono text-base font-bold text-rose-400 outline-none focus:border-rose-500"
              required
            />
            <p className="text-[11px] text-slate-400">Maximum cumulative payout allowed for a single account in 24 hours.</p>
          </div>

          {/* Min Withdrawal */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Minimum Withdrawal Threshold (BDT):
            </label>
            <input
              type="number"
              value={limits.minWithdrawal}
              onChange={(e) => setLimits({ ...limits, minWithdrawal: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 font-mono text-base font-bold text-slate-200 outline-none focus:border-rose-500"
              required
            />
            <p className="text-[11px] text-slate-400">Lowest withdrawal amount players can request in the cashier.</p>
          </div>

          {/* Max Bet */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Maximum Bet Cap Per Round (BDT):
            </label>
            <input
              type="number"
              value={limits.maxBetPerRound}
              onChange={(e) => setLimits({ ...limits, maxBetPerRound: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 font-mono text-base font-bold text-emerald-400 outline-none focus:border-emerald-500"
              required
            />
            <p className="text-[11px] text-slate-400">Ceiling wager limit to mitigate abnormal volatility exposure.</p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-800/80 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition-all hover:bg-cyan-400 disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save Risk & Turnover Policies'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
