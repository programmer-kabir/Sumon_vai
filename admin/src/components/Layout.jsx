import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Gamepad2,
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
  Activity,
  CreditCard,
  Sliders,
  ShieldCheck,
  LogOut,
  Sparkles,
  Zap,
  Globe,
  Radio,
  ChevronRight,
} from 'lucide-react';

export const Layout = ({ user, onLogout }) => {
  const location = useLocation();

  const navSections = [
    {
      title: 'Analytics & Financials',
      items: [
        { to: '/', label: 'Overview & Health', icon: LayoutDashboard },
        { to: '/reports', label: 'Financial Reports (P&L)', icon: BarChart3 },
        { to: '/games', label: 'Game Performance', icon: Gamepad2 },
        { to: '/transactions', label: 'Live Bet Ledger', icon: Activity, badge: 'LIVE' },
      ],
    },
    {
      title: 'Operations & Players',
      items: [
        { to: '/players', label: 'Players & Wallets', icon: Users },
        { to: '/deposits', label: 'Deposit Requests', icon: ArrowDownCircle },
        { to: '/withdrawals', label: 'Withdrawal Approvals', icon: ArrowUpCircle },
        { to: '/gateways', label: 'Payment Gateways', icon: CreditCard },
      ],
    },
    {
      title: 'Platform & Controls',
      items: [
        { to: '/limits', label: 'Risk & Limits', icon: Sliders },
        { to: '/rtp', label: 'RTP & Math Engine', icon: Zap, badge: 'GOD-MODE' },
        { to: '/jackpot', label: 'Jackpot & Bonus Pool', icon: Sparkles },
        { to: '/cms', label: 'Banners & Marquee', icon: Globe },
      ],
    },
  ];

  // Flattened for finding active label
  const allItems = navSections.flatMap((s) => s.items);
  const currentNav = allItems.find(
    (n) => n.to === location.pathname || (n.to === '/' && location.pathname === '/overview')
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F19] font-sans text-slate-100 antialiased selection:bg-rose-500 selection:text-white">
      {/* 🚀 LEFT NAVIGATION SIDEBAR */}
      <aside className="flex w-64 flex-shrink-0 flex-col border-r border-slate-800/80 bg-[#0E1322]">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-800/80 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-glow-red">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-wider text-white">CK44 BACKOFFICE</h1>
            <p className="text-[9px] font-bold uppercase tracking-widest text-rose-400">Master Control Engine</p>
          </div>
        </div>

        {/* Categorized Navigation List */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.to || (item.to === '/' && location.pathname === '/overview');

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'border border-rose-500/30 bg-rose-500/15 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={15}
                        className={isActive ? 'text-rose-400' : 'text-slate-400 group-hover:text-slate-200'}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[8px] font-black tracking-wider ${
                          item.badge === 'LIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.badge === 'GOD-MODE'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom System Health Footer */}
        <div className="border-t border-slate-800/80 p-3.5">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0A0E1A] px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-slate-300">MongoDB Atlas</span>
            </div>
            <span className="text-[9px] font-bold uppercase text-emerald-400">Connected</span>
          </div>
        </div>
      </aside>

      {/* 🌟 MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#0E1322]/90 px-6 backdrop-blur-md lg:px-8">
          {/* Active Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Backoffice</span>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {currentNav?.label || 'Console'}
            </span>
          </div>

          {/* Right Tools & User Profile */}
          <div className="flex items-center gap-3">
            {/* Super Admin Badge */}
            <div className="flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-800/60 px-3.5 py-1 text-xs font-bold text-slate-200">
              <span className="h-2 w-2 rounded-full bg-rose-500 shadow-glow-red"></span>
              <span>ADMIN: {user?.username || user?.email || 'Super Admin'}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content with optimal max-width */}
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="mx-auto max-w-[1520px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
