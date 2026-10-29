import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  CheckCircle,
  RefreshCw,
  Trophy,
  Coins,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sliders,
  Eye,
  History,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';

export const JackpotPage = () => {
  const [jackpot, setJackpot] = useState(5420890);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Config parameters for jackpot policy
  const [minBetToQualify, setMinBetToQualify] = useState(50);
  const [turnoverContributionPct, setTurnoverContributionPct] = useState(1.5);
  const [autoTickSpeed, setAutoTickSpeed] = useState('NORMAL');

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await api.getPublicConfig();
      if (res.data && res.data.megaJackpot !== undefined) {
        setJackpot(res.data.megaJackpot);
      }
    } catch (err) {
      console.error('Failed to load jackpot config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await api.updatePublicConfig({ megaJackpot: Number(jackpot) });
      setToastMsg('Mega Jackpot prize pool successfully updated and broadcast to player ticker!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Jackpot update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAmount = (add) => {
    setJackpot((prev) => Math.max(0, Number(prev) + add));
  };

  const handleResetBaseline = () => {
    if (window.confirm('Reset jackpot to baseline pool of ৳1,000,000 BDT?')) {
      setJackpot(1000000);
    }
  };

  const sampleDropHistory = [
    { id: 'JKP-9021', winner: 'shakib_king', game: 'Aviator Crash', payout: 245000, time: '2 hours ago', status: 'Settled' },
    { id: 'JKP-9018', winner: 'hasan_77', game: 'Gates of Olympus', payout: 150000, time: '1 day ago', status: 'Settled' },
    { id: 'JKP-9012', winner: 'rakib_boss', game: 'Crazy Time Live', payout: 380000, time: '3 days ago', status: 'Settled' },
    { id: 'JKP-9005', winner: 'tanvir_99', game: 'Sweet Bonanza', payout: 120000, time: '5 days ago', status: 'Settled' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed right-8 top-20 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-300 shadow-lg backdrop-blur-md">
          <CheckCircle size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping"></span>
              <span>Progressive Jackpot Control Engine</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              Mega Jackpot & Bonus Pool Controller
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Synchronize real-time jackpot counters, configure progressive growth algorithms, and simulate player drops.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchConfig}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-amber-400' : ''} />
              <span>{loading ? 'Syncing...' : 'Sync Live Pool'}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Publishing...' : 'Save & Broadcast'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Jackpot Control Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Main Pool Card & Quick Adjusters */}
        <div className="space-y-6 lg:col-span-2">
          {/* Main Gold Hero Card */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#181d2a] via-[#151c2e] to-[#0d1322] p-6 sm:p-8 shadow-md">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                  <Trophy size={14} className="text-amber-400" />
                  <span>Grand Casino Progressive Jackpot</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Broadcasting Live to Player Lobbies</span>
                </span>
              </div>

              {/* Big Numerics */}
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-4xl font-black tracking-tight text-amber-400 sm:text-6xl drop-shadow-sm">
                  ৳ {Number(jackpot).toLocaleString()}
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">BDT</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                This exact value is animated on the frontend lobby golden ticker and triggers on qualified player win events.
              </p>

              {/* Preset Increment Buttons */}
              <div className="mt-8 border-t border-slate-800/80 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Quick Pool Adjustments
                  </span>
                  <button
                    type="button"
                    onClick={handleResetBaseline}
                    className="text-[11px] font-semibold text-slate-400 hover:text-rose-400 underline transition-colors"
                  >
                    Reset to Baseline (৳1M)
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {[
                    { val: 10000, label: '+৳10,000' },
                    { val: 50000, label: '+৳50,000' },
                    { val: 100000, label: '+৳100,000' },
                    { val: 500000, label: '+৳500,000' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAddAmount(val)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs font-bold text-amber-300 transition-all hover:border-amber-500/50 hover:bg-amber-500/15"
                    >
                      <Coins size={13} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input Controller */}
              <form onSubmit={handleSave} className="mt-6 border-t border-slate-800/80 pt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Set Exact Target Amount (BDT):
                </label>
                <div className="mt-2.5 flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-slate-400">
                      ৳
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={jackpot}
                      onChange={(e) => setJackpot(e.target.value)}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 pl-8 pr-4 py-2.5 font-mono text-base font-bold text-white outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-amber-400 disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{saving ? 'Updating...' : 'Apply Pool Update'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Recent Jackpot Drops History Table */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <History size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white">Recent Jackpot Drops & Winners</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Total Distributed: ৳895,000 BDT</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="table-header border-b border-slate-800 text-[11px]">
                    <th className="pb-3 font-semibold text-slate-400">Drop ID</th>
                    <th className="pb-3 font-semibold text-slate-400">Lucky Player</th>
                    <th className="pb-3 font-semibold text-slate-400">Triggering Game</th>
                    <th className="pb-3 font-semibold text-slate-400 text-right">Prize Amount</th>
                    <th className="pb-3 font-semibold text-slate-400 text-center">Settlement</th>
                    <th className="pb-3 font-semibold text-slate-400 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
                  {sampleDropHistory.map((drop) => (
                    <tr key={drop.id} className="table-row">
                      <td className="py-3 font-mono text-slate-400">{drop.id}</td>
                      <td className="py-3 font-bold text-white">{drop.winner}</td>
                      <td className="py-3 text-slate-300">{drop.game}</td>
                      <td className="py-3 text-right font-mono font-bold text-amber-400">
                        ৳ {drop.payout.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <span className="inline-block rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          {drop.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-slate-400">{drop.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Mathematical Policy & Player Preview */}
        <div className="space-y-6">
          {/* Player Lobby Live Simulation Preview */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-5 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Eye size={16} className="text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Player Lobby Live Ticker Preview
              </h3>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Live simulation of how this jackpot banner renders in the player casino lobby header:
            </p>

            {/* Simulated Casino Header Widget */}
            <div className="mt-4 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-slate-950 p-4 text-center shadow-inner">
              <div className="flex items-center justify-center gap-1.5 text-amber-400">
                <Sparkles size={14} className="animate-spin text-amber-400" />
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                  CK44 GRAND CASINO JACKPOT
                </span>
                <Sparkles size={14} className="animate-spin text-amber-400" />
              </div>
              <div className="mt-2 font-mono text-2xl font-black text-amber-400">
                ৳ {Number(jackpot).toLocaleString()}
              </div>
              <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-amber-500/80">
                Drop Odds Active on All Wagers &gt; ৳50
              </span>
            </div>
          </div>

          {/* Progressive Growth & Distribution Rules */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-5 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Sliders size={16} className="text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Progressive Pool Policy
              </h3>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300">
                  Minimum Qualifying Wager:
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="font-mono text-slate-400">৳</span>
                  <input
                    type="number"
                    value={minBetToQualify}
                    onChange={(e) => setMinBetToQualify(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 font-mono text-white outline-none focus:border-purple-400"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Bets below this threshold will not qualify for the Mega Jackpot drop.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-300">
                  Turnover Auto-Contribution Rate (%):
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={turnoverContributionPct}
                    onChange={(e) => setTurnoverContributionPct(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 font-mono text-white outline-none focus:border-purple-400"
                  />
                  <span className="font-mono text-slate-400">%</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Fraction of total casino turnover streamed directly to increment the progressive pool.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-300">
                  Visual Tick Frequency:
                </label>
                <select
                  value={autoTickSpeed}
                  onChange={(e) => setAutoTickSpeed(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 font-semibold text-white outline-none focus:border-purple-400"
                >
                  <option value="SLOW">Slow (+৳10 every 60s)</option>
                  <option value="NORMAL">Standard Dynamic (+৳25 every 30s)</option>
                  <option value="FAST">High Pulse (+৳50 every 10s)</option>
                </select>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <ShieldCheck size={14} />
                  <span>Fair Play & RNG Security Guaranteed</span>
                </div>
                <p className="mt-1">
                  Jackpot payout algorithm is governed by the server-side God-Mode RNG engine with verifiable fairness logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
