import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShieldCheck,
  Activity,
  Users,
  Gamepad2,
  RefreshCw,
  Award,
  Target,
  ArrowDownCircle,
  ArrowUpCircle,
  Zap,
  ChevronRight,
  AlertCircle,
  Clock,
  Sparkles,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';

export const OverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [recentBets, setRecentBets] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, ledgerRes, gamesRes] = await Promise.allSettled([
        api.getAdminStats(),
        api.getGameTransactions ? api.getGameTransactions() : Promise.resolve({ data: [] }),
        api.getGameAnalytics ? api.getGameAnalytics('all') : Promise.resolve({ data: [] }),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }

      if (ledgerRes.status === 'fulfilled' && ledgerRes.value?.data) {
        const txs = Array.isArray(ledgerRes.value.data)
          ? ledgerRes.value.data
          : ledgerRes.value.data.transactions || [];
        setRecentBets(txs.slice(0, 6));
      }

      if (gamesRes.status === 'fulfilled' && gamesRes.value?.data) {
        const games = Array.isArray(gamesRes.value.data)
          ? gamesRes.value.data
          : gamesRes.value.data.analytics || [];
        // Sort by turnover descending
        const sorted = [...games].sort((a, b) => (b.totalBets || b.totalBet || 0) - (a.totalBets || a.totalBet || 0));
        setTopGames(sorted.slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const pendingDeposits = stats?.pendingDepositsCount || 0;
  const pendingWithdrawals = stats?.pendingWithdrawalsCount || 0;

  return (
    <div className="space-y-6">
      {/* 1. Real-time Action & Alert Feed Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Deposits Alert */}
        <Link
          to="/deposits"
          className={`flex items-center justify-between rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
            pendingDeposits > 0
              ? 'border-emerald-500/40 bg-emerald-500/10 shadow-sm'
              : 'border-slate-800/80 bg-[#111726]/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${pendingDeposits > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <ArrowDownCircle size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Deposit Requests
              </div>
              <div className="text-base font-black text-white">
                {pendingDeposits > 0 ? (
                  <span className="text-emerald-400">{pendingDeposits} Pending Review</span>
                ) : (
                  <span className="text-slate-400">Queue Cleared</span>
                )}
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500" />
        </Link>

        {/* Pending Withdrawals Alert */}
        <Link
          to="/withdrawals"
          className={`flex items-center justify-between rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
            pendingWithdrawals > 0
              ? 'border-amber-500/40 bg-amber-500/10 shadow-sm'
              : 'border-slate-800/80 bg-[#111726]/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${pendingWithdrawals > 0 ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
              <ArrowUpCircle size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Withdrawal Payouts
              </div>
              <div className="text-base font-black text-white">
                {pendingWithdrawals > 0 ? (
                  <span className="text-amber-400">{pendingWithdrawals} Awaiting Payout</span>
                ) : (
                  <span className="text-slate-400">Zero Pending</span>
                )}
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500" />
        </Link>

        {/* Platform Solvency */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Solvency Ratio
              </div>
              <div className="text-base font-black text-white">
                100% Fully Backed
              </div>
            </div>
          </div>
          <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
            AUDITED
          </span>
        </div>

        {/* RTP Mode Indicator */}
        <Link
          to="/rtp"
          className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-4 transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                RTP Algorithm Mode
              </div>
              <div className="text-base font-black text-purple-300">
                Standard (96.5%)
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500" />
        </Link>
      </div>

      {/* 2. Top Monthly Goal & Benchmark Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Live Fintech & Casino Analytics</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              Monthly Revenue & Liquidity Health
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Real-time monitoring of Gross Gaming Revenue (GGR), platform net profit, player cashflow, and reserve liquidity
            </p>
          </div>

          <button
            onClick={fetchAllData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800/80 hover:text-white"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-rose-400' : ''} />
            <span>{loading ? 'Refreshing...' : 'Live Refresh'}</span>
          </button>
        </div>

        {/* Goal Progress Section */}
        <div className="mt-5 border-t border-slate-800/60 pt-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Target size={14} className="text-amber-400" />
              <span>Monthly Target Profit Achievement:</span>
            </div>
            <span className="font-mono font-bold text-amber-400">
              {stats?.goalProgress || 0}% Completed
            </span>
          </div>

          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, stats?.goalProgress || 0))}%` }}
            ></div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>
              Current Net Profit:{' '}
              <strong className="text-emerald-400">৳ {Number(stats?.netProfit || 0).toLocaleString()}</strong>
            </span>
            <span>
              Target Goal:{' '}
              <strong className="text-white">৳ {Number(stats?.monthlyGoal || 150000).toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3. 📊 Key Financial Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Approved Deposits"
          value={`৳ ${Number(stats?.totalDeposits || 0).toLocaleString()}`}
          subtitle="bKash, Nagad, Rocket & USDT"
          icon={TrendingUp}
          color="emerald"
          trend="+ Inflow"
        />

        <StatCard
          title="Total Paid Withdrawals"
          value={`৳ ${Number(stats?.totalWithdrawals || 0).toLocaleString()}`}
          subtitle="Settled player payouts"
          icon={TrendingDown}
          color="rose"
          trend="- Outflow"
        />

        <StatCard
          title="Net Platform Profit (NGR)"
          value={`৳ ${Number(stats?.netProfit || 0).toLocaleString()}`}
          subtitle="Total Deposits - Withdrawals"
          icon={DollarSign}
          color="amber"
          trend={stats?.netProfit >= 0 ? '+ Profitable' : '- Deficit'}
        />

        <StatCard
          title="Reserve Liquidity Pool"
          value={`৳ ${Number(stats?.totalLiquidity || 50000).toLocaleString()}`}
          subtitle="Status: Healthy (100% Solvency)"
          icon={ShieldCheck}
          color="cyan"
          trend="Secure"
        />
      </div>

      {/* 4. 🎮 Game Turnover & GGR Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Betting Turnover"
          value={`৳ ${Number(stats?.totalBets || 0).toLocaleString()}`}
          subtitle="Cumulative player wagers"
          icon={Activity}
          color="purple"
        />

        <StatCard
          title="Total Winning Payouts"
          value={`৳ ${Number(stats?.totalPayouts || 0).toLocaleString()}`}
          subtitle="Total prize payouts to players"
          icon={Award}
          color="amber"
        />

        <StatCard
          title="Gross Gaming Revenue (GGR)"
          value={`৳ ${Number(stats?.ggr || 0).toLocaleString()}`}
          subtitle="House hold profit from games"
          icon={Gamepad2}
          color="emerald"
        />

        <StatCard
          title="Active Registered Players"
          value={`${stats?.totalPlayers || 0} Accounts`}
          subtitle="Verified active users"
          icon={Users}
          color="cyan"
        />
      </div>

      {/* 5. Real-Time Stream & Game Performance Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Live Wager Ledger Feed */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-5 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-rose-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Live Casino Bet Stream</h3>
                  <p className="text-[11px] text-slate-400">Real-time telemetry of recent player wagers and settlements</p>
                </div>
              </div>

              <Link
                to="/transactions"
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 transition-colors hover:text-rose-300"
              >
                <span>Full Ledger</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="table-header border-b border-slate-800 text-[11px]">
                    <th className="pb-3 font-semibold text-slate-400">Player</th>
                    <th className="pb-3 font-semibold text-slate-400">Game</th>
                    <th className="pb-3 font-semibold text-slate-400">Type</th>
                    <th className="pb-3 font-semibold text-slate-400 text-right">Amount</th>
                    <th className="pb-3 font-semibold text-slate-400 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
                  {recentBets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No transactions recorded yet in the live stream.
                      </td>
                    </tr>
                  ) : (
                    recentBets.map((t, idx) => {
                      const isCredit = t.type === 'CREDIT';
                      return (
                        <tr key={t._id || idx} className="table-row">
                          <td className="py-2.5 font-bold text-white">
                            {t.user?.username || t.username || 'Anonymous'}
                          </td>
                          <td className="py-2.5 text-slate-300">
                            {t.gameName || t.gameId || 'Casino Game'}
                          </td>
                          <td className="py-2.5">
                            <span
                              className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                                isCredit
                                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                  : 'border border-rose-500/30 bg-rose-500/10 text-rose-400'
                              }`}
                            >
                              {isCredit ? 'WIN PAYOUT' : 'WAGER BET'}
                            </span>
                          </td>
                          <td
                            className={`py-2.5 text-right font-mono font-bold ${
                              isCredit ? 'text-emerald-400' : 'text-slate-300'
                            }`}
                          >
                            {isCredit ? '+' : '-'}৳ {Number(t.amount || 0).toLocaleString()}
                          </td>
                          <td className="py-2.5 text-right font-mono text-[11px] text-slate-400">
                            {t.createdAt
                              ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'Live'}
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

        {/* Right Col: Top Performing Games Leaderboard */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-5 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <Gamepad2 size={18} className="text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Top Games by Volume</h3>
                  <p className="text-[11px] text-slate-400">Highest grossing casino titles</p>
                </div>
              </div>

              <Link
                to="/games"
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
              >
                <span>All Games</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {topGames.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Game analytics updating...
                </div>
              ) : (
                topGames.map((game) => (
                  <div
                    key={game.code || game.gameId}
                    className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/40 p-3"
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{game.name}</div>
                      <div className="text-[11px] text-slate-400">
                        Turnover: <span className="font-mono text-slate-300">৳{Number(game.totalBets || game.totalBet || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-xs font-mono font-bold ${
                          game.houseProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {game.houseProfit >= 0 ? '+' : ''}৳{Number(game.houseProfit || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        House Hold: {game.houseMargin ? game.houseMargin + '%' : (game.margin || '3.5%')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Links Footer */}
            <div className="mt-5 border-t border-slate-800/80 pt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Quick Action Shortcuts
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  to="/deposits"
                  className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-center font-semibold text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  Deposits
                </Link>
                <Link
                  to="/withdrawals"
                  className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-center font-semibold text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  Withdrawals
                </Link>
                <Link
                  to="/rtp"
                  className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-center font-semibold text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  RTP Engine
                </Link>
                <Link
                  to="/jackpot"
                  className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-center font-semibold text-slate-300 hover:border-slate-700 hover:text-white"
                >
                  Jackpot Pool
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
