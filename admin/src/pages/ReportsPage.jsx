import React, { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Award,
  RefreshCw,
  Gamepad2,
  Filter,
  BarChart3,
  Clock,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';

export const ReportsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today'); // 'today', 'yesterday', 'this_month', 'all'

  const fetchReports = async (selectedPeriod = period) => {
    setLoading(true);
    try {
      const res = await api.getReports(selectedPeriod);
      if (res.data) setData(res.data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(period);
  }, [period]);

  const activeSummary =
    period === 'today'
      ? data?.summaries?.today
      : period === 'yesterday'
      ? data?.summaries?.yesterday
      : period === 'this_month'
      ? data?.summaries?.thisMonth
      : data?.summaries?.allTime;

  return (
    <div className="space-y-6">
      {/* Header & Period Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={22} className="text-emerald-400" />
            <h2 className="text-xl font-black text-white">Financial Reports & Comparative Analytics</h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Audit daily, monthly, and lifetime platform Gross Gaming Revenue (GGR), player cashflow, and game-by-game margin returns
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Period Pills */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-[#0A0E1A] p-1">
            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: 'this_month', label: 'This Month' },
              { id: 'all', label: 'All-Time' },
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

          <button
            onClick={() => fetchReports(period)}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
            title="Refresh Report"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-rose-400' : ''} />
          </button>
        </div>
      </div>

      {/* Comparison Grid Across All 4 Timeframes */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Comparative Timeframe Snapshot
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Live Double-Entry Ledger</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Today Card */}
          <div
            onClick={() => setPeriod('today')}
            className={`cursor-pointer rounded-xl border p-4 transition-all ${
              period === 'today'
                ? 'border-rose-500/50 bg-rose-500/10 shadow-sm'
                : 'border-slate-800 bg-[#0D1322] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">TODAY</span>
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                ACTIVE
              </span>
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-slate-400">Net Platform Profit:</span>
              <div className="font-mono text-xl font-black text-white">
                ৳ {Number(data?.summaries?.today?.netProfit || 0).toLocaleString()}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px] font-mono text-slate-400">
              <span>Bets: ৳{Number(data?.summaries?.today?.turnover || 0).toLocaleString()}</span>
              <span className="text-emerald-400 font-bold">GGR: ৳{Number(data?.summaries?.today?.ggr || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Yesterday Card */}
          <div
            onClick={() => setPeriod('yesterday')}
            className={`cursor-pointer rounded-xl border p-4 transition-all ${
              period === 'yesterday'
                ? 'border-rose-500/50 bg-rose-500/10 shadow-sm'
                : 'border-slate-800 bg-[#0D1322] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">YESTERDAY</span>
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-400">SETTLED</span>
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-slate-400">Net Platform Profit:</span>
              <div className="font-mono text-xl font-black text-white">
                ৳ {Number(data?.summaries?.yesterday?.netProfit || 0).toLocaleString()}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px] font-mono text-slate-400">
              <span>Bets: ৳{Number(data?.summaries?.yesterday?.turnover || 0).toLocaleString()}</span>
              <span className="text-emerald-400 font-bold">GGR: ৳{Number(data?.summaries?.yesterday?.ggr || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* This Month Card */}
          <div
            onClick={() => setPeriod('this_month')}
            className={`cursor-pointer rounded-xl border p-4 transition-all ${
              period === 'this_month'
                ? 'border-rose-500/50 bg-rose-500/10 shadow-sm'
                : 'border-slate-800 bg-[#0D1322] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">THIS MONTH</span>
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                MTD
              </span>
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-slate-400">Monthly Net Profit:</span>
              <div className="font-mono text-xl font-black text-amber-400">
                ৳ {Number(data?.summaries?.thisMonth?.netProfit || 0).toLocaleString()}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px] font-mono text-slate-400">
              <span>Bets: ৳{Number(data?.summaries?.thisMonth?.turnover || 0).toLocaleString()}</span>
              <span className="text-emerald-400 font-bold">GGR: ৳{Number(data?.summaries?.thisMonth?.ggr || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* All-Time Card */}
          <div
            onClick={() => setPeriod('all')}
            className={`cursor-pointer rounded-xl border p-4 transition-all ${
              period === 'all'
                ? 'border-rose-500/50 bg-rose-500/10 shadow-sm'
                : 'border-slate-800 bg-[#0D1322] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">ALL-TIME</span>
              <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-[9px] font-bold text-cyan-300">
                LIFETIME
              </span>
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-slate-400">Cumulative Net Profit:</span>
              <div className="font-mono text-xl font-black text-cyan-400">
                ৳ {Number(data?.summaries?.allTime?.netProfit || 0).toLocaleString()}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px] font-mono text-slate-400">
              <span>Bets: ৳{Number(data?.summaries?.allTime?.turnover || 0).toLocaleString()}</span>
              <span className="text-emerald-400 font-bold">GGR: ৳{Number(data?.summaries?.allTime?.ggr || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Period Detailed Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={`${period.toUpperCase().replace('_', ' ')} APPROVED DEPOSITS`}
          value={`৳ ${Number(activeSummary?.deposits || 0).toLocaleString()}`}
          subtitle="Total verified cash inflow"
          icon={TrendingUp}
          color="emerald"
          trend="+ Inflow"
        />

        <StatCard
          title={`${period.toUpperCase().replace('_', ' ')} PAID WITHDRAWALS`}
          value={`৳ ${Number(activeSummary?.withdrawals || 0).toLocaleString()}`}
          subtitle="Total disbursed cash outflow"
          icon={TrendingDown}
          color="rose"
          trend="- Outflow"
        />

        <StatCard
          title={`${period.toUpperCase().replace('_', ' ')} NET REVENUE (NGR)`}
          value={`৳ ${Number(activeSummary?.netProfit || 0).toLocaleString()}`}
          subtitle="Deposits minus Withdrawals"
          icon={DollarSign}
          color="amber"
          trend={activeSummary?.netProfit >= 0 ? '+ Profit' : '- Loss'}
        />

        <StatCard
          title={`${period.toUpperCase().replace('_', ' ')} GROSS GAMING REVENUE (GGR)`}
          value={`৳ ${Number(activeSummary?.ggr || 0).toLocaleString()}`}
          subtitle={`Hold Margin: ${activeSummary?.margin || 3.5}%`}
          icon={Gamepad2}
          color="cyan"
          trend="Gaming Hold"
        />
      </div>

      {/* Game-wise P&L Table for the Selected Period */}
      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#111726]/80 shadow-sm backdrop-blur-md">
        <div className="border-b border-slate-800/80 bg-[#0F172A] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">
                Game Profit & Loss Performance ({period.toUpperCase().replace('_', ' ')})
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Performance breakdown per title: Turnover, Player Returns, and Net House Margin during this timeframe
              </p>
            </div>
            <span className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-mono font-bold text-amber-400">
              {data?.gameBreakdown?.length || 0} Games Tracked
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="table-header">
              <tr>
                <th className="px-5 py-3.5">Game Title</th>
                <th className="px-4 py-3.5 text-right">Bets (Turnover)</th>
                <th className="px-4 py-3.5 text-right">Player Returns</th>
                <th className="px-5 py-3.5 text-right">House P&L</th>
                <th className="px-4 py-3.5 text-center">House Edge %</th>
                <th className="px-4 py-3.5 text-center">Actual RTP %</th>
                <th className="px-4 py-3.5 text-center">Rounds</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-semibold text-slate-200">
              {!data?.gameBreakdown || data.gameBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No game transactions recorded for this period.
                  </td>
                </tr>
              ) : (
                data.gameBreakdown.map((g) => {
                  const isProfit = g.profit > 0;
                  const isLoss = g.profit < 0;

                  return (
                    <tr key={g.code} className="table-row">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {g.thumbnail ? (
                            <img src={g.thumbnail} alt={g.name} className="h-8 w-8 rounded-lg border border-slate-700/80 object-cover" />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-sm">🎰</div>
                          )}
                          <div>
                            <span className="block font-bold text-white">{g.name}</span>
                            <span className="text-[10px] text-slate-400">{g.provider} • <span className="uppercase">{g.category}</span></span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-400">
                        ৳ {Number(g.bets || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-bold text-rose-400">
                        ৳ {Number(g.payouts || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

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
                          {isProfit ? `+৳ ${g.profit.toFixed(2)}` : isLoss ? `-৳ ${Math.abs(g.profit).toFixed(2)}` : '৳ 0.00'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center font-mono text-slate-300">{g.margin}%</td>
                      <td className="px-4 py-3.5 text-center font-mono text-slate-300">{g.rtp}%</td>
                      <td className="px-4 py-3.5 text-center font-mono text-slate-400">{g.rounds || 0}</td>

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
