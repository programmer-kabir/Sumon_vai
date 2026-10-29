import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Gamepad2,
  Sliders,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Save,
  Lock,
  Unlock,
  Coins,
  Activity,
  Zap,
  Plus,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';

export const PlayerDossierModal = ({ playerId, onClose, onUpdated }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingLimits, setSavingLimits] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form state for custom limits
  const [turnoverMult, setTurnoverMult] = useState(1.0);
  const [maxWithdrawal, setMaxWithdrawal] = useState(5000);
  const [maxBet, setMaxBet] = useState(1000);

  // Manual turnover granting state
  const [manualAmount, setManualAmount] = useState('');

  const fetchDossier = async () => {
    setLoading(true);
    try {
      const res = await api.getPlayerDossier(playerId);
      if (res.data) {
        setData(res.data);
        setTurnoverMult(res.data.customLimits?.turnoverMultiplier ?? 1.0);
        setMaxWithdrawal(res.data.customLimits?.maxDailyWithdrawal || 5000);
        setMaxBet(res.data.customLimits?.maxBetPerRound || 1000);
      }
    } catch (err) {
      console.error('Failed to load dossier:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playerId) fetchDossier();
  }, [playerId]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // 1. One-Click Waive & Instant Unlock Cashout
  const handleWaiveTurnover = async () => {
    if (!window.confirm('Are you sure you want to completely WAIVE turnover and instantly UNLOCK cashout for this player?')) {
      return;
    }
    setActionLoading(true);
    try {
      await api.updatePlayerLimits(playerId, { waiveTurnover: true });
      showToast('Turnover waived! Cashout is now 100% UNLOCKED for this player.');
      fetchDossier();
      if (onUpdated) onUpdated();
    } catch (err) {
      alert(err.message || 'Failed to waive turnover');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Grant Manual Turnover Amount
  const handleGrantTurnover = async (amt) => {
    const amountToGrant = amt !== undefined ? Number(amt) : Number(manualAmount);
    if (!amountToGrant || amountToGrant <= 0) {
      alert('Please enter a valid turnover amount to grant');
      return;
    }

    setActionLoading(true);
    try {
      await api.updatePlayerLimits(playerId, { grantTurnoverAmount: amountToGrant });
      showToast(`Successfully granted ৳${amountToGrant.toLocaleString()} turnover to player!`);
      setManualAmount('');
      fetchDossier();
      if (onUpdated) onUpdated();
    } catch (err) {
      alert(err.message || 'Failed to grant turnover');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Save Custom Limits Form
  const handleSaveLimits = async (e) => {
    e.preventDefault();
    setSavingLimits(true);
    try {
      await api.updatePlayerLimits(playerId, {
        turnoverMultiplier: Number(turnoverMult),
        maxDailyWithdrawal: Number(maxWithdrawal),
        maxBetPerRound: Number(maxBet),
      });
      showToast('Player limits and turnover multiplier updated successfully!');
      fetchDossier();
      if (onUpdated) onUpdated();
    } catch (err) {
      alert(err.message || 'Failed to update player limits');
    } finally {
      setSavingLimits(false);
    }
  };

  if (!playerId) return null;

  const profile = data?.profile;
  const fin = data?.financials;
  const turnover = data?.turnoverCompliance;
  const remaining = Number(turnover?.remainingTurnover || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0F1424] shadow-2xl">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="absolute right-6 top-16 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-2.5 text-xs font-bold text-emerald-300 shadow-lg backdrop-blur-xl">
            <CheckCircle size={15} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#12182B] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 font-mono text-base font-black text-amber-400 border border-amber-500/30">
              {profile?.username ? profile.username.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{profile?.username || 'Player Dossier'}</h3>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    profile?.status === 'ACTIVE'
                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border border-rose-500/30 bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {profile?.status || 'ACTIVE'}
                </span>
                <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  {profile?.role?.toUpperCase()}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">
                Contact: <span className="font-mono text-slate-300">{profile?.mobile || profile?.email || 'N/A'}</span> • Joined:{' '}
                {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDossier}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-white transition-all"
              title="Refresh Dossier"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-rose-400' : ''} />
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-white transition-all"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {loading && !data ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <RefreshCw size={22} className="animate-spin text-rose-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Loading Player Dossier...</span>
            </div>
          ) : (
            <>
              {/* 1. Key Financial Stats Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-800/80 bg-[#13192C] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Wallet Balance</span>
                  <div className="mt-1 font-mono text-xl font-black text-emerald-400">
                    ৳ {Number(profile?.realBalance || 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Available Real Funds</span>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-[#13192C] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lifetime Deposits</span>
                  <div className="mt-1 font-mono text-xl font-black text-white">
                    ৳ {Number(fin?.totalDeposits || 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">+ Cash Inflow</span>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-[#13192C] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paid Withdrawals</span>
                  <div className="mt-1 font-mono text-xl font-black text-rose-400">
                    ৳ {Number(fin?.totalWithdrawals || 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-rose-400 font-semibold">- Cash Outflow</span>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-[#13192C] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Casino Net Profit</span>
                  <div className={`mt-1 font-mono text-xl font-black ${
                    (fin?.houseNetProfit || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {(fin?.houseNetProfit || 0) >= 0 ? `+৳ ${Number(fin?.houseNetProfit).toLocaleString()}` : `-৳ ${Math.abs(fin?.houseNetProfit).toLocaleString()}`}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">From this account</span>
                </div>
              </div>

              {/* 2. 🛡️ Turnover & Wagering Compliance Guard + Admin Instant Controls */}
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#181d2f] to-[#121626] p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-amber-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                        Turnover & Wagering Compliance Guard
                      </h4>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-300">
                      Rule: Player must wager{' '}
                      <strong className="text-amber-400">{turnover?.turnoverMultiplier || 1.0}x</strong> of total deposits before withdrawal is allowed.
                    </p>
                  </div>

                  <div>
                    {turnover?.canWithdraw ? (
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-bold text-emerald-300 shadow-sm">
                        <Unlock size={14} className="text-emerald-400" />
                        <span>ELIGIBLE FOR CASHOUT (100% Wagering Met)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-1.5 text-xs font-bold text-amber-300 shadow-sm">
                        <Lock size={14} className="text-amber-400" />
                        <span>CASHOUT LOCKED (Needs ৳{remaining.toLocaleString()} more wagering)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Turnover Progress Metrics */}
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">
                      Completed Turnover: <strong className="text-white font-bold">৳ {Number(turnover?.completedTurnover || 0).toLocaleString()}</strong>
                      {turnover?.manualTurnoverGranted > 0 && (
                        <span className="text-emerald-400 text-[11px] ml-1.5 font-bold">
                          (+৳{Number(turnover.manualTurnoverGranted).toLocaleString()} Admin Granted)
                        </span>
                      )}
                    </span>
                    <span className="text-amber-400 font-bold">
                      {turnover?.turnoverProgress || 0}% Met (Target: ৳ {Number(turnover?.requiredTurnover || 0).toLocaleString()})
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        turnover?.canWithdraw
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-amber-500 to-orange-400'
                      }`}
                      style={{ width: `${Math.min(100, turnover?.turnoverProgress || 0)}%` }}
                    ></div>
                  </div>
                </div>

                {/* ⚡ DIRECT ADMIN TURNOVER OVERRIDES & GRANTING BAR */}
                <div className="mt-4 border-t border-slate-800/80 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                      <Zap size={14} className="text-amber-400" />
                      <span>Admin Turnover Grant & Waive Controls:</span>
                    </div>

                    {/* Instant Waive Button */}
                    <button
                      type="button"
                      onClick={handleWaiveTurnover}
                      disabled={actionLoading || turnover?.canWithdraw}
                      className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-1.5 text-xs font-bold text-emerald-300 transition-all hover:bg-emerald-500/30 disabled:opacity-40"
                      title="Waive all remaining turnover and unlock cashout immediately"
                    >
                      <Sparkles size={13} />
                      <span>{turnover?.canWithdraw ? '✓ Cashout Unlocked' : '⚡ Waive Turnover & Instant Unlock'}</span>
                    </button>
                  </div>

                  {/* Manual Grant Input & Quick Pills */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400">Quick Grant:</span>
                    {[
                      { label: '+৳1,000', val: 1000 },
                      { label: '+৳2,000', val: 2000 },
                      { label: '+৳5,000', val: 5000 },
                      ...(remaining > 0 ? [{ label: `+Full Remaining (৳${remaining.toLocaleString()})`, val: remaining }] : []),
                    ].map((pill, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleGrantTurnover(pill.val)}
                        disabled={actionLoading}
                        className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 font-mono text-xs font-bold text-amber-300 transition-all hover:border-amber-500 hover:bg-amber-500/10 disabled:opacity-50"
                      >
                        {pill.label}
                      </button>
                    ))}

                    {/* Custom Grant Input */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-500">৳</span>
                        <input
                          type="number"
                          placeholder="Custom Amount"
                          value={manualAmount}
                          onChange={(e) => setManualAmount(e.target.value)}
                          className="w-32 rounded-lg border border-slate-700 bg-slate-900/90 pl-6 pr-2.5 py-1 font-mono text-xs font-bold text-white outline-none focus:border-amber-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGrantTurnover()}
                        disabled={actionLoading || !manualAmount}
                        className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950 transition-all hover:bg-amber-400 disabled:opacity-50"
                      >
                        <Plus size={13} />
                        <span>Grant</span>
                      </button>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">ℹ️ Note:</span>
                    Granting turnover fulfills the wagering requirement to unlock cashout. It does <strong className="text-amber-300">NOT</strong> alter real cash balance (use <strong className="text-amber-400">+ Balance</strong> in directory to credit cash).
                  </p>
                </div>
              </div>

              {/* 3. 🎮 Game-by-Game P&L History for THIS Player */}
              <div className="rounded-2xl border border-slate-800/80 bg-[#13192C] p-5 shadow-sm">
                <div className="mb-3.5 flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Gamepad2 size={16} className="text-rose-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Game-by-Game Activity & Profitability
                    </h4>
                  </div>
                  <span className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[11px] font-mono font-bold text-slate-300">
                    {data?.gamesPlayed?.length || 0} Games Played
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="table-header border-b border-slate-800 text-[11px]">
                        <th className="px-4 py-3 font-semibold text-slate-400">Game Title</th>
                        <th className="px-4 py-3 font-semibold text-slate-400 text-right">Wagers (Bets)</th>
                        <th className="px-4 py-3 font-semibold text-slate-400 text-right">Returns (Wins)</th>
                        <th className="px-4 py-3 font-semibold text-slate-400 text-right">Player P&L</th>
                        <th className="px-3 py-3 font-semibold text-slate-400 text-center">Rounds</th>
                        <th className="px-4 py-3 font-semibold text-slate-400 text-center">Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
                      {!data?.gamesPlayed || data.gamesPlayed.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            This player has not placed any game bets yet.
                          </td>
                        </tr>
                      ) : (
                        data.gamesPlayed.map((g) => {
                          const playerWon = g.playerPnl > 0;
                          const playerLost = g.playerPnl < 0;

                          return (
                            <tr key={g.gameCode} className="table-row">
                              <td className="px-4 py-3">
                                <span className="block font-bold text-white">{g.gameName}</span>
                                <span className="text-[10px] text-slate-400">{g.provider}</span>
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">
                                ৳ {Number(g.totalBets || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                                ৳ {Number(g.totalWins || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right font-mono">
                                <span
                                  className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${
                                    playerWon
                                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                      : playerLost
                                      ? 'border border-rose-500/30 bg-rose-500/10 text-rose-400'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {playerWon ? `+৳ ${g.playerPnl}` : playerLost ? `-৳ ${Math.abs(g.playerPnl)}` : '৳ 0.00'}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center font-mono text-slate-400">{g.rounds || 0}</td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    playerWon
                                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                      : playerLost
                                      ? 'border border-rose-500/30 bg-rose-500/10 text-rose-400'
                                      : 'border border-slate-700 bg-slate-800 text-slate-300'
                                  }`}
                                >
                                  {playerWon ? 'PLAYER WON' : playerLost ? 'HOUSE WON' : 'EVEN'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. ⚙️ Custom Limits & Administrative Overrides Form */}
              <form onSubmit={handleSaveLimits} className="rounded-2xl border border-slate-800/80 bg-[#13192C] p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders size={16} className="text-cyan-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Custom Player Limits & Turnover Overrides
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400">Overrides Global Defaults for this Player</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Turnover Multiplier */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Turnover Multiplier (x):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={turnoverMult}
                      onChange={(e) => setTurnoverMult(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 font-mono text-xs font-bold text-amber-400 outline-none focus:border-amber-400"
                      required
                    />
                    <p className="mt-1 text-[11px] text-slate-400">e.g. 1.0 = 1x deposit. Set to 0 to remove turnover completely.</p>
                  </div>

                  {/* Daily Cashout Limit */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Daily Max Cashout Limit (BDT):
                    </label>
                    <input
                      type="number"
                      step="100"
                      min="500"
                      value={maxWithdrawal}
                      onChange={(e) => setMaxWithdrawal(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 font-mono text-xs font-bold text-rose-400 outline-none focus:border-rose-400"
                      required
                    />
                    <p className="mt-1 text-[11px] text-slate-400">Max amount player can withdraw in 24 hours</p>
                  </div>

                  {/* Max Bet Limit */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Max Bet Per Round (BDT):
                    </label>
                    <input
                      type="number"
                      step="50"
                      min="100"
                      value={maxBet}
                      onChange={(e) => setMaxBet(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 font-mono text-xs font-bold text-cyan-400 outline-none focus:border-cyan-400"
                      required
                    />
                    <p className="mt-1 text-[11px] text-slate-400">Single round wager ceiling</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end border-t border-slate-800/80 pt-3.5">
                  <button
                    type="submit"
                    disabled={savingLimits}
                    className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-rose-500 disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{savingLimits ? 'Saving...' : 'Save & Recalculate Limits'}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
