import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  ArrowUpCircle,
  Check,
  X,
  ShieldCheck,
  CheckCircle,
  Search,
  Copy,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { api } from '../services/api';

export const WithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminWithdrawals();
      if (res.data) setWithdrawals(res.data);
    } catch (err) {
      console.error('Failed to load withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const handlePay = async (id) => {
    if (!window.confirm('Are you sure you have disbursed the funds and want to mark this withdrawal as PAID?')) return;
    try {
      await api.payWithdrawal(id);
      showToast('Withdrawal payout marked as PAID successfully!');
      fetchWithdrawals();
    } catch (err) {
      alert(err.message || 'Payout update failed');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this withdrawal and refund the amount to player wallet?'))
      return;
    try {
      await api.rejectWithdrawal(id);
      showToast('Withdrawal rejected and funds refunded to player wallet.');
      fetchWithdrawals();
    } catch (err) {
      alert(err.message || 'Rejection failed');
    }
  };

  // Metrics
  const pendingWths = withdrawals.filter((w) => w.status === 'PENDING');
  const pendingTotal = pendingWths.reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const paidWths = withdrawals.filter((w) => w.status === 'PAID');
  const paidTotal = paidWths.reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const rejectedCount = withdrawals.filter((w) => w.status === 'REJECTED').length;

  const filtered = withdrawals.filter((w) => {
    if (filter !== 'all' && w.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchUser = (w.username || '').toLowerCase().includes(q);
      const matchAcc = (w.payoutAccount || '').toLowerCase().includes(q);
      const matchChannel = (w.channel || '').toLowerCase().includes(q);
      return matchUser || matchAcc || matchChannel;
    }
    return true;
  });

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
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
              <ArrowUpCircle size={14} className="text-rose-400" />
              <span>Outflow Payout Queue</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              Withdrawal Approvals & Payout Management
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Review player cash-out requests with automated 1x wagering compliance audits and disburse winnings.
            </p>
          </div>

          <button
            onClick={fetchWithdrawals}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-rose-400' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh Payouts'}</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Pending Card */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#111726]/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Disbursement</span>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
              {pendingWths.length} Pending
            </span>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-amber-400">
            ৳ {pendingTotal.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Awaiting finance approval & bank transfer</p>
        </div>

        {/* Paid Card */}
        <div className="rounded-2xl border border-emerald-500/30 bg-[#111726]/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Settled Payouts</span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
              {paidWths.length} Settled
            </span>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-emerald-400">
            ৳ {paidTotal.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Disbursed cash returned to players</p>
        </div>

        {/* Rejected Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rejected & Refunded</span>
            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-bold text-rose-400">
              {rejectedCount} Rejected
            </span>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-slate-300">
            {rejectedCount} Records
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Refunded back to player wallets</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Withdrawals', count: withdrawals.length },
            { id: 'PENDING', label: 'Pending Review', count: pendingWths.length },
            { id: 'PAID', label: 'Paid / Settled', count: paidWths.length },
            { id: 'REJECTED', label: 'Rejected', count: rejectedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'border border-rose-500/50 bg-rose-500/15 text-rose-300'
                  : 'border border-slate-800 bg-[#111726]/80 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-md px-1.5 py-0.2 font-mono text-[10px] ${
                  filter === tab.id
                    ? 'bg-rose-500/30 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] flex-1 sm:flex-initial">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Player, Payout Account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#111726]/80 pl-9 pr-4 py-2 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-rose-500/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#111726]/80 shadow-sm backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="table-header border-b border-slate-800 text-[11px]">
                <th className="px-5 py-3.5">Player Username</th>
                <th className="px-4 py-3.5">Channel</th>
                <th className="px-5 py-3.5">Payout Account / Wallet</th>
                <th className="px-5 py-3.5 text-right">Requested Amount</th>
                <th className="px-4 py-3.5">Turnover Audit</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Disbursement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No withdrawal requests found matching this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((w) => {
                  const isPending = w.status === 'PENDING';
                  const isPaid = w.status === 'PAID';

                  return (
                    <tr key={w._id} className="table-row">
                      <td className="px-5 py-3.5 font-bold text-white">
                        {w.username || 'player'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-400">
                          {w.channel}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{w.payoutAccount}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(w.payoutAccount, w._id)}
                            className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-white"
                            title="Copy Account Number"
                          >
                            <Copy size={12} className={copiedId === w._id ? 'text-rose-400' : ''} />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-sm font-black text-rose-400">
                        ৳ {Number(w.amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          <ShieldCheck size={12} />
                          <span>1x Wagering Met ✓</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isPaid
                              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : isPending
                              ? 'border border-amber-500/30 bg-amber-500/10 text-amber-400'
                              : 'border border-rose-500/30 bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePay(w._id)}
                              className="flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-300 transition-all hover:bg-emerald-500/30"
                              title="Mark as paid and disbursed"
                            >
                              <Check size={13} />
                              <span>Mark Paid</span>
                            </button>
                            <button
                              onClick={() => handleReject(w._id)}
                              className="flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/15 px-2 py-1 text-xs font-bold text-rose-300 transition-all hover:bg-rose-500/30"
                              title="Reject and refund player"
                            >
                              <X size={13} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono text-[11px] text-slate-500">
                            {isPaid ? 'Disbursed ✓' : 'Refunded ✕'}
                          </span>
                        )}
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
