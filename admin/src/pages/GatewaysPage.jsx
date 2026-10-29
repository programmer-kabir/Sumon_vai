import React, { useState, useEffect } from 'react';
import { CreditCard, Save, CheckCircle, RefreshCw, Smartphone, DollarSign, Copy, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const GatewaysPage = () => {
  const [settings, setSettings] = useState({
    bkash: '01712-345678',
    nagad: '01899-876543',
    rocket: '01911-223344',
    usdt: 'TYDzsxdczSu4mE9GfF1k4eBq8yL3K9wP3e',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.getPaymentSettings();
      if (res.data) setSettings(res.data);
    } catch (err) {
      console.error('Failed to load payment settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updatePaymentSettings(settings);
      setToastMsg('Receiving payment gateways and crypto addresses updated successfully!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Payment settings update failed');
    } finally {
      setSaving(false);
    }
  };

  const gateways = [
    {
      id: 'bkash',
      name: 'bKash Merchant / Agent',
      color: 'border-pink-500/40 text-pink-400 bg-pink-500/10',
      badge: 'Agent SIM',
      icon: Smartphone,
      desc: 'Instant P2P or merchant payment collection via bKash mobile banking app.',
    },
    {
      id: 'nagad',
      name: 'Nagad Commercial Agent',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      badge: 'Postal Agent',
      icon: Smartphone,
      desc: 'Zero-commission mobile financial service network across Bangladesh.',
    },
    {
      id: 'rocket',
      name: 'DBBL Rocket Agent',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
      badge: 'Bank Agent',
      icon: Smartphone,
      desc: 'Dutch-Bangla Bank secure mobile payment terminal integration.',
    },
    {
      id: 'usdt',
      name: 'USDT Tether (TRC-20)',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      badge: 'TRON TRC20',
      icon: DollarSign,
      desc: 'Global cryptocurrency settlement with 1.5% instant top-up bonus.',
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
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <CreditCard size={14} className="text-amber-400" />
              <span>Cashier Gateway Settings</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              Payment Gateways & Receiving Accounts
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Manage the recipient mobile numbers and TRON wallet addresses displayed to players on the deposit cashier page.
            </p>
          </div>

          <button
            onClick={fetchSettings}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-amber-400' : ''} />
            <span>{loading ? 'Refreshing...' : 'Reload Settings'}</span>
          </button>
        </div>
      </div>

      {/* Gateways Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {gateways.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.id}
                className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2.5 ${g.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{g.name}</h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{g.badge}</span>
                    </div>
                  </div>
                  <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    ACTIVE
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400">{g.desc}</p>

                <div className="mt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Recipient Number / Address:
                  </label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <input
                      type="text"
                      value={settings[g.id] || ''}
                      onChange={(e) => setSettings({ ...settings, [g.id]: e.target.value })}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 font-mono text-sm font-bold text-white outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
                      placeholder={`Enter ${g.name} address`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(settings[g.id], g.id)}
                      className="rounded-xl border border-slate-700 bg-slate-800/60 p-2.5 text-slate-400 hover:text-white"
                      title="Copy"
                    >
                      <Copy size={16} className={copiedKey === g.id ? 'text-emerald-400' : ''} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Save Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Changes reflect instantly across all live player deposit modal screens.</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-400 disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Updating Gateways...' : 'Save Gateway Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
