import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Activity, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.getGameTransactions();
      if (res.data) setTransactions(res.data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesSearch =
      !search ||
      t.txId?.toLowerCase().includes(search.toLowerCase()) ||
      t.username?.toLowerCase().includes(search.toLowerCase()) ||
      t.gameCode?.toLowerCase().includes(search.toLowerCase()) ||
      t.roundId?.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={22} className="text-emerald-400" />
            <h2 className="text-xl font-black text-white">Live Double-Entry Game Bet Ledger</h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Immutable, audit-ready stream of real-time DEBIT (bets) and CREDIT (wins) synchronized with game aggregators
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin text-rose-400' : ''} />
          <span>{loading ? 'Streaming...' : 'Refresh Ledger'}</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by TxID, Player, Game or Round..."
            className="w-full rounded-xl border border-slate-800 bg-[#111726] py-2 pl-9 pr-4 text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'ALL TRANSACTIONS' },
            { id: 'DEBIT', label: '🔴 BETS (DEBIT)' },
            { id: 'CREDIT', label: '🟢 PAYOUTS (CREDIT)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTypeFilter(item.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                typeFilter === item.id
                  ? 'border border-slate-700 bg-slate-700 text-white shadow-sm'
                  : 'border border-slate-800/80 bg-[#111726] text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#111726]/80 shadow-sm backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="table-header">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Transaction ID</th>
                <th className="px-4 py-3.5">Player</th>
                <th className="px-4 py-3.5">Game Title</th>
                <th className="px-4 py-3.5">Round ID</th>
                <th className="px-3 py-3.5 text-center">Type</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-right">Balance Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-semibold text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No ledger transactions matching the criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const isDebit = t.type === 'DEBIT';

                  return (
                    <tr key={t._id || t.txId} className="table-row">
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">
                        {new Date(t.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-amber-400">
                        {t.txId}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-white">
                        {t.username || 'demo'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="block font-bold text-slate-200">{t.gameCode}</span>
                        <span className="text-[10px] text-slate-500">{t.providerId}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                        {t.roundId}
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            isDebit
                              ? 'border border-rose-500/30 bg-rose-500/10 text-rose-300'
                              : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          }`}
                        >
                          {isDebit ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                          <span>{t.type}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold">
                        <span className={isDebit ? 'text-rose-400' : 'text-emerald-400'}>
                          {isDebit ? `-৳ ${Number(t.amount).toFixed(2)}` : `+৳ ${Number(t.amount).toFixed(2)}`}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-[11px] text-slate-400">
                        <span>৳{Number(t.balanceBefore || 0).toFixed(2)}</span>
                        <span className="mx-1 text-slate-600">→</span>
                        <strong className="text-white">৳{Number(t.balanceAfter || 0).toFixed(2)}</strong>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
