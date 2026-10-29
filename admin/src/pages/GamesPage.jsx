import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Gamepad2, TrendingUp, TrendingDown, Filter, Calendar } from 'lucide-react';
import { api } from '../services/api';

export const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [period, setPeriod] = useState('all'); // 'all', 'today', 'this_month'

  const fetchGames = async (timePeriod = period) => {
    setLoading(true);
    try {
      const res = await api.getGameAnalytics(timePeriod);
      if (res.data) setGames(res.data);
    } catch (err) {
      console.error('Failed to load games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(period);
  }, [period]);

  const filteredGames = games.filter((g) => {
    const matchesCat = catFilter === 'all' || g.category?.toLowerCase() === catFilter.toLowerCase();
    const matchesSearch =
      !search ||
      g.name?.toLowerCase().includes(search.toLowerCase()) ||
      g.provider?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalGameBets = games.reduce((acc, g) => acc + (g.totalBets || 0), 0);
  const totalGameWins = games.reduce((acc, g) => acc + (g.totalPayouts || 0), 0);
  const totalProfit = totalGameBets - totalGameWins;

  return (
    <div className="space-y-6">
      {/* Top Banner with Total Profit */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 size={22} className="text-rose-400" />
            <h2 className="text-xl font-black text-white">Game Profit & Loss Performance Tracker</h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Real-time analytics per game title: Turnover, Player Returns, Net House Margin, and Theoretical vs Actual RTP
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-[#0A0E1A] p-1">
            {[
              { id: 'all', label: 'All-Time' },
              { id: 'today', label: 'Today' },
              { id: 'this_month', label: 'This Month' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  period === p.id
                    ? 'border border-rose-500/40 bg-rose-500/20 text-rose-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div
            className={`rounded-xl border px-4 py-2 text-right shadow-sm ${
              totalProfit >= 0
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
            }`}
          >
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
              {period.toUpperCase().replace('_', ' ')} HOUSE GGR:
            </span>
            <span className="font-mono text-base font-black">
              {totalProfit >= 0
                ? `+৳ ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `-৳ ${Math.abs(totalProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
          </div>

          <button
            onClick={() => fetchGames(period)}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white"
            title="Refresh game analytics"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-rose-400' : ''} />
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by game title or provider..."
            className="w-full rounded-xl border border-slate-800 bg-[#111726] py-2 pl-9 pr-4 text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-rose-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'crash', 'slots', 'fishing', 'live'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                catFilter === cat
                  ? 'border border-slate-700 bg-slate-700 text-white shadow-sm'
                  : 'border border-slate-800/80 bg-[#111726] text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'ALL' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 📋 Games P&L Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#111726]/80 shadow-sm backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="table-header">
              <tr>
                <th className="px-5 py-3.5">Game & Provider</th>
                <th className="px-4 py-3.5 text-right">Bets (Turnover)</th>
                <th className="px-4 py-3.5 text-right">Player Payouts</th>
                <th className="px-5 py-3.5 text-right">House P&L</th>
                <th className="px-4 py-3.5 text-center">House Edge %</th>
                <th className="px-4 py-3.5 text-center">Player RTP %</th>
                <th className="px-4 py-3.5 text-center">Rounds & Wins</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-semibold text-slate-200">
              {filteredGames.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No game performance records found.
                  </td>
                </tr>
              ) : (
                filteredGames.map((g) => {
                  const isProfit = g.houseProfit > 0;
                  const isLoss = g.houseProfit < 0;

                  return (
                    <tr key={g.code} className="table-row">
                      {/* Game Identity */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {g.thumbnail ? (
                            <img
                              src={g.thumbnail}
                              alt={g.name}
                              className="h-9 w-9 rounded-xl border border-slate-700/80 object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-sm">
                              🎰
                            </div>
                          )}
                          <div>
                            <span className="block font-bold text-white">{g.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {g.provider} • <span className="uppercase">{g.category}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Bets */}
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-400">
                        ৳ {Number(g.totalBets || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Payouts */}
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-rose-400">
                        ৳ {Number(g.totalPayouts || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* P&L */}
                      <td className="px-5 py-3.5 text-right font-mono">
                        <span
                          className={`inline-block rounded-lg px-2.5 py-0.5 text-xs font-black ${
                            isProfit
                              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : isLoss
                              ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {isProfit
                            ? `+৳ ${g.houseProfit.toFixed(2)}`
                            : isLoss
                            ? `-৳ ${Math.abs(g.houseProfit).toFixed(2)}`
                            : '৳ 0.00'}
                        </span>
                      </td>

                      {/* House Edge % */}
                      <td className="px-4 py-3.5 text-center font-mono text-slate-300">
                        {g.houseMargin}%
                      </td>

                      {/* Actual RTP % */}
                      <td className="px-4 py-3.5 text-center font-mono text-slate-300">
                        {g.actualRtp}%
                      </td>

                      {/* Bet & Win count */}
                      <td className="px-4 py-3.5 text-center text-[11px] font-mono text-slate-400">
                        <span className="text-white font-bold">{g.betCount || 0}</span> / <span className="text-emerald-400">{g.winCount || 0}</span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            isProfit
                              ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                              : isLoss
                              ? 'border border-rose-500/30 bg-rose-500/20 text-rose-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {g.status}
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
    </div>
  );
};
