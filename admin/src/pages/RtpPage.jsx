import React, { useState, useEffect } from 'react';
import {
  Zap,
  Save,
  CheckCircle,
  RefreshCw,
  Flame,
  ShieldAlert,
  Award,
  Sliders,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { api } from '../services/api';

export const RtpPage = () => {
  const [houseRtpMode, setHouseRtpMode] = useState('STANDARD'); // STANDARD, HIGH_PROFIT, PROMO_BOOST
  const [bonusRules, setBonusRules] = useState({
    welcomeBonusPct: 100,
    usdtBonusPct: 1.5,
    weeklyCashbackPct: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await api.getPublicConfig();
      if (res.data) {
        if (res.data.houseRtpMode) setHouseRtpMode(res.data.houseRtpMode);
        if (res.data.bonusSettings) setBonusRules(res.data.bonusSettings);
      }
    } catch (err) {
      console.error('Failed to load RTP config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updatePublicConfig({
        houseRtpMode,
        bonusSettings: bonusRules,
      });
      setToastMsg('House RTP algorithm mode and promotional bonus rules successfully applied!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'RTP mode update failed');
    } finally {
      setSaving(false);
    }
  };

  const rtpModes = [
    {
      id: 'STANDARD',
      title: 'Standard Market Fair (RTP: 96.5%)',
      desc: 'Industry standard mathematical model. Ensures optimal player retention with steady, sustainable long-term casino edge.',
      edge: '3.5% House Edge',
      icon: ShieldCheck,
      badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    },
    {
      id: 'HIGH_PROFIT',
      title: 'High Margin Squeeze (RTP: 88.0%)',
      desc: 'Aggressive house edge configuration. Tightens multipliers, reduces bonus round frequency, and maximizes net revenue.',
      edge: '12.0% House Edge',
      icon: Flame,
      badgeColor: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    },
    {
      id: 'PROMO_BOOST',
      title: 'Weekend Promo Boost (RTP: 99.2%)',
      desc: 'High-frequency win event mode. Excellent for weekend marketing acquisition campaigns, VIP tournaments, and player hype.',
      edge: '0.8% House Edge',
      icon: Award,
      badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    },
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

      {/* Header */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
              <Zap size={14} className="text-purple-400" />
              <span>God-Mode Mathematical Engine</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              RTP (Return to Player) & Algorithm Engine
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Govern server-side multiplier calculations, RNG volatility profiles, and player promotional bonus allocations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchConfig}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-purple-400' : ''} />
              <span>{loading ? 'Refreshing...' : 'Reload Config'}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-500 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Deploying...' : 'Deploy Math Engine'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selection Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Active RNG Preset Profile:
          </span>
          <span className="text-xs text-slate-400">Click a profile card to select it</span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {rtpModes.map((m) => {
            const isSelected = houseRtpMode === m.id;
            const Icon = m.icon;

            return (
              <div
                key={m.id}
                onClick={() => setHouseRtpMode(m.id)}
                className={`relative cursor-pointer rounded-2xl border p-6 transition-all ${
                  isSelected
                    ? 'border-purple-500/60 bg-[#161d31] shadow-lg ring-1 ring-purple-500/50'
                    : 'border-slate-800/80 bg-[#111726]/80 hover:border-slate-700/80 hover:bg-[#141b2c]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-2.5 ${m.badgeColor}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
                      {m.edge}
                    </span>
                    {isSelected && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="mt-4 font-bold text-white text-sm">{m.title}</h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{m.desc}</p>

                <div className="mt-4 border-t border-slate-800/80 pt-3">
                  <span
                    className={`text-[11px] font-bold ${
                      isSelected ? 'text-purple-400' : 'text-slate-500'
                    }`}
                  >
                    {isSelected ? '● Currently Active Mode' : 'Click to Activate'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Promotional Bonus Rules */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-4">
          <Sliders size={18} className="text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Promotional Bonus Allocations</h3>
            <p className="text-xs text-slate-400">Manage incentive bonuses credited automatically to player balances</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Welcome Bonus */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Welcome First Deposit Bonus (%):
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="300"
                value={bonusRules.welcomeBonusPct}
                onChange={(e) =>
                  setBonusRules({ ...bonusRules, welcomeBonusPct: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 font-mono text-base font-bold text-white outline-none focus:border-purple-400"
              />
              <span className="font-mono text-slate-400 font-bold">%</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Credited on 1st verified deposit (e.g. 100% = ৳1,000 matches ৳1,000).
            </p>
          </div>

          {/* USDT Bonus */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Crypto USDT Deposit Incentive (%):
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={bonusRules.usdtBonusPct}
                onChange={(e) =>
                  setBonusRules({ ...bonusRules, usdtBonusPct: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 font-mono text-base font-bold text-white outline-none focus:border-purple-400"
              />
              <span className="font-mono text-slate-400 font-bold">%</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Extra percentage credited for on-chain TRC20 crypto deposits.
            </p>
          </div>

          {/* Weekly Cashback */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Weekly VIP Loss Cashback (%):
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="30"
                value={bonusRules.weeklyCashbackPct}
                onChange={(e) =>
                  setBonusRules({ ...bonusRules, weeklyCashbackPct: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 font-mono text-base font-bold text-white outline-none focus:border-purple-400"
              />
              <span className="font-mono text-slate-400 font-bold">%</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Calculated every Monday 00:00 UTC on cumulative net losses.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-800/80 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-500 disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save RTP & Bonus Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
