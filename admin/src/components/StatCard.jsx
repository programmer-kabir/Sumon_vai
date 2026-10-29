import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'emerald', trend }) => {
  const colorMap = {
    emerald: {
      icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    rose: {
      icon: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
    amber: {
      icon: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    cyan: {
      icon: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    },
    purple: {
      icon: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-[#111726]/80 p-5 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-slate-700 hover:bg-[#131B2E]">
      {/* Top Header: Title + Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${scheme.icon}`}>
            <Icon size={16} />
          </div>
        )}
      </div>

      {/* Middle: Big Value */}
      <div className="my-2.5">
        <span className="font-mono text-2xl font-black tracking-tight text-white tabular-nums sm:text-3xl">
          {value}
        </span>
      </div>

      {/* Bottom: Subtitle + Trend Badge */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/40">
        <span className="text-xs font-medium text-slate-400 truncate">
          {subtitle || '—'}
        </span>
        {trend && (
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${scheme.badge}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
