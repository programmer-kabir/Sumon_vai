import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  ArrowDownCircle,
  Check,
  X,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Copy,
  Clock,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { api } from '../services/api';

export const DepositsPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminDeposits();
      if (res.data) setDeposits(res.data);
    } catch (err) {
      console.error('Failed to load deposits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
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

  const handleApprove = async (id) => {
    try {
      await api.approveDeposit(id);
      showToast('Deposit successfully approved and funds credited to player wallet!');
      fetchDeposits();
    } catch (err) {
      alert(err.message || 'Approval failed');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this deposit request?')) return;
    try {
      await api.rejectDeposit(id);
      showToast('Deposit request marked as Rejected.');
      fetchDeposits();
    } catch (err) {
      alert(err.message || 'Rejection failed');
    }
  };

  // Metrics
  const pendingDeposits = deposits.filter((d) => d.status === 'PENDING');
  const pendingTotal = pendingDeposits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const approvedDeposits = deposits.filter((d) => d.status === 'APPROVED');
  const approvedTotal = approvedDeposits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const rejectedCount = deposits.filter((d) => d.status === 'REJECTED').length;

  const filtered = deposits.filter((d) => {
    if (filter !== 'all' && d.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchUser = (d.username || '').toLowerCase().includes(q);
      const matchTrx = (d.trxId || '').toLowerCase().includes(q);
      const matchSender = (d.senderMobile || '').toLowerCase().includes(q);
      const matchChannel = (d.channel || '').toLowerCase().includes(q);
      return matchUser || matchTrx || matchSender || matchChannel;
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
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <ArrowDownCircle size={14} className="text-emerald-400" />
              <span>Inflow Verification Queue</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              Deposit Requests & Verification Queue
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Verify player payments across bKash, Nagad, Rocket, and USDT TRC20 with one-click credit approval.
            </p>
          </div>

          <button
            onClick={fetchDeposits}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-emerald-400' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh Queue'}</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Pending Card */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#111726]/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Review</span>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
              {pendingDeposits.length} Requests
            </span>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-amber-400">
            ৳ {pendingTotal.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Action required to credit player balances</p>
        </div>

        {/* Approved Card */}
        <div className="rounded-2xl border border-emerald-500/30 bg-[#111726]/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Settled Inflow</span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
              {approvedDeposits.length} Approved
            </span>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-emerald-400">
            ৳ {approvedTotal.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Verified cash inflows credited</p>
        </div>

        {/* Rejected Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rejected Requests</span>
            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-bold text-rose-400">
              {rejectedCount} Rejected
            </span>
          </div>
          <div className="mt-3 font-mono text-2xl font-black text-slate-300">
            {rejectedCount} Records
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Declined due to invalid TrxID or mismatches</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Deposits', count: deposits.length },
            { id: 'PENDING', label: 'Pending Review', count: pendingDeposits.length, badge: 'amber' },
            { id: 'APPROVED', label: 'Approved', count: approvedDeposits.length, badge: 'emerald' },
            { id: 'REJECTED', label: 'Rejected', count: rejectedCount, badge: 'rose' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'border border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                  : 'border border-slate-800 bg-[#111726]/80 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-md px-1.5 py-0.2 font-mono text-[10px] ${
                  filter === tab.id
                    ? 'bg-emerald-500/30 text-white'
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
            placeholder="Search by Player, TrxID, Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#111726]/80 pl-9 pr-4 py-2 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-emerald-500/50"
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
                <th className="px-5 py-3.5 text-right">Amount (BDT)</th>
                <th className="px-4 py-3.5">Bonus</th>
                <th className="px-5 py-3.5">TrxID / Hash</th>
                <th className="px-5 py-3.5">Sender Contact</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No deposit transactions found matching this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => {
                  const isPending = d.status === 'PENDING';
                  const isApproved = d.status === 'APPROVED';

                  return (
                    <tr key={d._id} className="table-row">
                      <td className="px-5 py-3.5 font-bold text-white">
                        {d.username || 'player'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                          {d.channel}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-sm font-black text-emerald-400">
                        ৳ {Number(d.amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-400">
                        {d.bonusAmount > 0 ? (
                          <span className="text-emerald-400">+৳{d.bonusAmount}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span>{d.trxId}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(d.trxId, d._id)}
                            className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-white"
                            title="Copy TrxID"
                          >
                            <Copy size={12} className={copiedId === d._id ? 'text-emerald-400' : ''} />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-400">
                        {d.senderMobile || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isApproved
                              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : isPending
                              ? 'border border-amber-500/30 bg-amber-500/10 text-amber-400'
                              : 'border border-rose-500/30 bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(d._id)}
                              className="flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-300 transition-all hover:bg-emerald-500/30"
                              title="Approve and credit player"
                            >
                              <Check size={13} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(d._id)}
                              className="flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/15 px-2 py-1 text-xs font-bold text-rose-300 transition-all hover:bg-rose-500/30"
                              title="Reject request"
                            >
                              <X size={13} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono text-[11px] text-slate-500">
                            {isApproved ? 'Settled ✓' : 'Closed ✕'}
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
