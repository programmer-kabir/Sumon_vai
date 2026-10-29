import React, { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  Users,
  PlusCircle,
  Ban,
  CheckCircle,
  ShieldCheck,
  Eye,
  Sliders,
  Lock,
  Unlock,
} from 'lucide-react';
import { api } from '../services/api';
import { BalanceModal } from '../components/BalanceModal';
import { PlayerDossierModal } from '../components/PlayerDossierModal';

export const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [dossierPlayerId, setDossierPlayerId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await api.getPlayersList();
      if (res.data) setPlayers(res.data);
    } catch (err) {
      console.error('Failed to load players:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleToggleStatus = async (player) => {
    const nextStatus = player.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.updatePlayerStatus(player._id, { status: nextStatus });
      showToast(`Player ${player.username} status set to '${nextStatus}' successfully!`);
      fetchPlayers();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const filtered = players.filter((p) => {
    return (
      !search ||
      p.username?.toLowerCase().includes(search.toLowerCase()) ||
      p.mobile?.includes(search) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed right-8 top-20 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-4 py-2.5 text-xs font-bold text-emerald-300 shadow-sm backdrop-blur-xl">
          <CheckCircle size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Users size={22} className="text-amber-400" />
            <h2 className="text-xl font-black text-white">Player Directory & Wallet Management</h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Real-time player accounts, withdrawal turnover verification guard, game-by-game dossier, and balance adjustments
          </p>
        </div>

        <button
          onClick={fetchPlayers}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin text-rose-400' : ''} />
          <span>{loading ? 'Refreshing...' : 'Sync Directory'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username, mobile or email..."
          className="w-full rounded-xl border border-slate-800 bg-[#111726] py-2 pl-9 pr-4 text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-amber-400"
        />
      </div>

      {/* Players Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#111726]/80 shadow-sm backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="table-header">
              <tr>
                <th className="px-5 py-3.5">Player Profile</th>
                <th className="px-4 py-3.5">Contact</th>
                <th className="px-4 py-3.5 text-right">Wallet Balance</th>
                <th className="px-4 py-3.5 text-right">Deposits</th>
                <th className="px-4 py-3.5 text-right">Turnover</th>
                <th className="px-5 py-3.5">Wagering Compliance</th>
                <th className="px-4 py-3.5 text-right">House P&L</th>
                <th className="px-3 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-semibold text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No registered player accounts found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isActive = p.status === 'ACTIVE';
                  const canWithdraw = p.canWithdraw ?? (p.completedTurnover >= (p.requiredTurnover || 0));

                  return (
                    <tr key={p._id} className="table-row">
                      {/* Identity */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 font-bold text-amber-400 border border-amber-500/20">
                            {p.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="block font-bold text-white">{p.username}</span>
                            <span className="text-[10px] text-slate-500">{p.email || '—'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="px-4 py-3.5 font-mono text-slate-400">
                        {p.mobile || '—'}
                      </td>

                      {/* Real Balance */}
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-400">
                        ৳ {Number(p.balance || 0).toFixed(2)}
                      </td>

                      {/* Deposits */}
                      <td className="px-4 py-3.5 text-right font-mono text-slate-300">
                        ৳ {Number(p.totalDeposits || 0).toFixed(2)}
                      </td>

                      {/* Total Bets */}
                      <td className="px-4 py-3.5 text-right font-mono text-amber-400">
                        ৳ {Number((p.completedTurnover !== undefined ? p.completedTurnover : p.totalBets) || 0).toLocaleString()}
                      </td>

                      {/* Turnover Compliance Guard Column */}
                      <td className="px-5 py-3.5">
                        {canWithdraw ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                            <Unlock size={10} /> 100% Met (Eligible)
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                              <Lock size={10} /> Needs ৳{Number(p.remainingTurnover || 0).toLocaleString()}
                            </span>
                            <span className="block text-[9px] font-mono text-slate-500">
                              Target: ৳{Number(p.requiredTurnover || 0).toLocaleString()} ({p.turnoverMultiplier || 1.0}x)
                            </span>
                          </div>
                        )}
                      </td>

                      {/* House Profit from player */}
                      <td className="px-4 py-3.5 text-right font-mono">
                        <span className={p.netLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {p.netLoss >= 0 ? `+৳ ${p.netLoss}` : `-৳ ${Math.abs(p.netLoss)}`}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5 text-center">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            isActive
                              ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                              : 'border border-rose-500/30 bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Dossier & History Button */}
                          <button
                            onClick={() => setDossierPlayerId(p._id)}
                            title="View Full Player Dossier & Game P&L"
                            className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20"
                          >
                            <Eye size={12} />
                            <span>Dossier</span>
                          </button>

                          {/* Balance Button */}
                          <button
                            onClick={() => setSelectedPlayer(p)}
                            title="Adjust player balance (Credit/Debit)"
                            className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500/20"
                          >
                            <PlusCircle size={12} />
                            <span>Balance</span>
                          </button>

                          {/* Suspend/Activate Button */}
                          <button
                            onClick={() => handleToggleStatus(p)}
                            title={isActive ? 'Suspend account access' : 'Reactivate account'}
                            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
                              isActive
                                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                            }`}
                          >
                            <Ban size={12} />
                            <span>{isActive ? 'Suspend' : 'Activate'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Adjustment Modal */}
      {selectedPlayer && (
        <BalanceModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onSuccess={(msg) => {
            showToast(msg);
            fetchPlayers();
          }}
        />
      )}

      {/* Player Full Dossier & Game P&L Modal */}
      {dossierPlayerId && (
        <PlayerDossierModal
          playerId={dossierPlayerId}
          onClose={() => setDossierPlayerId(null)}
          onUpdated={fetchPlayers}
        />
      )}
    </div>
  );
};
