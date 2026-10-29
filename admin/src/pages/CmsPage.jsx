import React, { useState, useEffect } from 'react';
import { Globe, Save, CheckCircle, RefreshCw, BellRing, Sparkles, Megaphone, Eye } from 'lucide-react';
import { api } from '../services/api';

export const CmsPage = () => {
  const [announcements, setAnnouncements] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await api.getPublicConfig();
      if (res.data && res.data.marqueeAnnouncements) {
        setAnnouncements(res.data.marqueeAnnouncements.join('\n'));
      }
    } catch (err) {
      console.error('Failed to load CMS config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const list = announcements
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.updatePublicConfig({ marqueeAnnouncements: list });
      setToastMsg('Scrolling marquee notices and banner messages published live!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'CMS update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPreset = (text) => {
    setAnnouncements((prev) => (prev ? `${prev}\n${text}` : text));
  };

  const announcementLines = announcements
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

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
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <Globe size={14} className="text-cyan-400" />
              <span>Public Content & Announcements</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              Scrolling Marquee & Banner Notice CMS
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Publish real-time promotional updates, system alerts, and winning announcements to the player lobby ticker.
            </p>
          </div>

          <button
            onClick={fetchConfig}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-cyan-400' : ''} />
            <span>{loading ? 'Refreshing...' : 'Reload Notices'}</span>
          </button>
        </div>
      </div>

      {/* Live Marquee Simulator Preview */}
      <div className="rounded-2xl border border-cyan-500/30 bg-[#111726]/80 p-5 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Eye size={16} className="text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Player Lobby Marquee Live Simulation
          </h3>
        </div>

        <div className="mt-3 flex items-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 px-4 text-xs font-semibold text-cyan-300">
          <div className="flex items-center gap-1.5 whitespace-nowrap text-amber-400 pr-4 border-r border-slate-800">
            <Megaphone size={14} />
            <span className="font-bold uppercase tracking-wider text-[11px]">Notice</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap pl-4">
            <span className="inline-block animate-marquee font-medium">
              {announcementLines.length > 0
                ? announcementLines.join('  ✦  ')
                : 'Welcome to CK44 Casino! Instant 24/7 deposits & payouts with 100% deposit bonus on first top-up.'}
            </span>
          </div>
        </div>
      </div>

      {/* Main CMS Editor Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-6 shadow-sm backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Marquee Notice Broadcast List</h3>
              <p className="text-xs text-slate-400">Enter each notice on a new line. They will cycle continuously.</p>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-mono font-bold text-slate-300">
              {announcementLines.length} Active Messages
            </span>
          </div>

          {/* Quick Presets */}
          <div className="mt-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Template Prompts:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                '🎉 100% Welcome Bonus on your first bKash & Nagad deposit!',
                '⚡ Instant automated withdrawals processed in under 5 minutes 24/7.',
                '🏆 Mega Progressive Jackpot pool reached over ৳5,400,000 BDT!',
                '💎 VIP Cashback Club: Earn 10% weekly loss rebates every Monday.',
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddPreset(preset)}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
                >
                  + Add Preset
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="mt-4">
            <textarea
              rows={8}
              value={announcements}
              onChange={(e) => setAnnouncements(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 p-4 font-mono text-xs leading-relaxed text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
              placeholder="Enter marquee messages, one per line..."
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
            <span className="text-xs text-slate-400">
              Live updates propagate instantly via WebSockets to player clients.
            </span>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition-all hover:bg-cyan-400 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Publishing...' : 'Publish to Player Marquee'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
