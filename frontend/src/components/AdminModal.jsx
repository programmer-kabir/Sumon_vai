import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  Gamepad2,
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
  Activity,
  CreditCard,
  Sliders,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Plus,
  Minus,
  Lock,
  Unlock,
  Crown,
  Sparkles,
  Save,
  Filter,
  Volume2,
  Zap,
  Flame,
} from 'lucide-react';
import { api, setAuthToken } from '../services/api';

export const AdminModal = ({ onClose, onPlayerUpdate, onConfigUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, games, players, deposits, withdrawals, transactions, settings, limits, cms, rtp, jackpot
  const [stats, setStats] = useState(null);
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState({
    bkash: '01712-345678',
    nagad: '01899-876543',
    rocket: '01911-223344',
    usdt: 'TYDzsxdczSu4mE9GfF1k4eBq8yL3K9wP3e',
  });
  const [limits, setLimits] = useState({
    reserveFund: 50000,
    monthlyGoal: 150000,
    maxDailyWithdrawal: 5000,
    minWithdrawal: 500,
    maxBetPerRound: 1000,
  });

  // CMS, RTP Engine & Jackpot States
  const [cmsAnnouncements, setCmsAnnouncements] = useState('');
  const [megaJackpotPool, setMegaJackpotPool] = useState(5420890);
  const [houseRtpMode, setHouseRtpMode] = useState('STANDARD');
  const [bonusRules, setBonusRules] = useState({
    welcomeBonusPct: 100,
    usdtBonusPct: 1.5,
    weeklyCashbackPct: 10,
  });

  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Filters & Search
  const [gameSearch, setGameSearch] = useState('');
  const [gameCatFilter, setGameCatFilter] = useState('all');
  const [playerSearch, setPlayerSearch] = useState('');
  const [depFilter, setDepFilter] = useState('all');
  const [wthFilter, setWthFilter] = useState('all');

  // Player Balance Modal State
  const [balanceModalUser, setBalanceModalUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState('ADD'); // ADD or DEDUCT
  const [adjustRemark, setAdjustRemark] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sRes, gRes, pRes, dRes, wRes, tRes, setRes, limRes, cfgRes] = await Promise.all([
        api.getAdminStats().catch(() => ({ data: null })),
        api.getGameAnalytics().catch(() => ({ data: [] })),
        api.getPlayersList().catch(() => ({ data: [] })),
        api.getAdminDeposits().catch(() => ({ data: [] })),
        api.getAdminWithdrawals().catch(() => ({ data: [] })),
        api.getGameTransactions().catch(() => ({ data: [] })),
        api.getPaymentSettings().catch(() => ({ data: null })),
        api.getPlatformLimits().catch(() => ({ data: null })),
        api.getPublicConfig().catch(() => ({ data: null })),
      ]);

      if (sRes.data) setStats(sRes.data);
      if (gRes.data) setGames(gRes.data);
      if (pRes.data) setPlayers(pRes.data);
      if (dRes.data) setDeposits(dRes.data);
      if (wRes.data) setWithdrawals(wRes.data);
      if (tRes.data) setTransactions(tRes.data);
      if (setRes.data) setSettings(setRes.data);
      if (limRes.data) setLimits(limRes.data);
      if (cfgRes?.data) {
        if (cfgRes.data.marqueeAnnouncements) {
          setCmsAnnouncements(cfgRes.data.marqueeAnnouncements.join('\n'));
        }
        if (cfgRes.data.megaJackpot !== undefined) setMegaJackpotPool(cfgRes.data.megaJackpot);
        if (cfgRes.data.houseRtpMode) setHouseRtpMode(cfgRes.data.houseRtpMode);
        if (cfgRes.data.bonusSettings) setBonusRules(cfgRes.data.bonusSettings);
      }
    } catch (e) {
      console.warn('Admin load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  // Actions
  const handleApproveDeposit = async (id) => {
    try {
      const res = await api.approveDeposit(id);
      showFeedback(res.message || 'ডিপোজিট সফলভাবে অনুমোদিত হয়েছে!');
      loadAllData();
    } catch (e) {
      alert(e.message || 'ডিপোজিট অনুমোদনে ত্রুটি');
    }
  };

  const handleRejectDeposit = async (id) => {
    if (!window.confirm('আপনি কি এই ডিপোজিট রিকোয়েস্টটি বাতিল করতে চান?')) return;
    try {
      const res = await api.rejectDeposit(id);
      showFeedback(res.message || 'ডিপোজিট বাতিল করা হয়েছে!');
      loadAllData();
    } catch (e) {
      alert(e.message || 'ত্রুটি');
    }
  };

  const handlePayWithdrawal = async (id) => {
    try {
      const res = await api.payWithdrawal(id);
      showFeedback(res.message || 'উইথড্রল সফলভাবে পরিশোধ করা হয়েছে (PAID)!');
      loadAllData();
    } catch (e) {
      alert(e.message || 'উইথড্রল পরিশোধে ত্রুটি');
    }
  };

  const handleRejectWithdrawal = async (id) => {
    if (!window.confirm('আপনি কি এই উইথড্রল বাতিল করে টাকা ইউজারের অ্যাকাউন্টে রিফান্ড করতে চান?')) return;
    try {
      const res = await api.rejectWithdrawal(id);
      showFeedback(res.message || 'উইথড্রল বাতিল ও টাকা রিফান্ড করা হয়েছে!');
      loadAllData();
    } catch (e) {
      alert(e.message || 'ত্রুটি');
    }
  };

  const handleExecuteBalanceAdjustment = async (e) => {
    e.preventDefault();
    if (!balanceModalUser || !adjustAmount) return;
    try {
      const res = await api.adjustPlayerBalance(balanceModalUser._id, {
        amount: Number(adjustAmount),
        type: adjustType,
        remark: adjustRemark || 'অ্যাডমিন সরাসরি সমন্বয়',
      });
      showFeedback(res.message || 'ব্যালেন্স আপডেট সফল হয়েছে!');
      setBalanceModalUser(null);
      setAdjustAmount('');
      setAdjustRemark('');
      loadAllData();
      if (onPlayerUpdate) onPlayerUpdate();
    } catch (err) {
      alert(err.message || 'ব্যালেন্স সমন্বয়ে ত্রুটি');
    }
  };

  const handleTogglePlayerStatus = async (user, newStatus) => {
    try {
      const res = await api.updatePlayerStatus(user._id, { status: newStatus });
      showFeedback(res.message || `প্লেয়ার স্ট্যাটাস '${newStatus}' করা হয়েছে!`);
      loadAllData();
    } catch (e) {
      alert(e.message || 'ত্রুটি');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updatePaymentSettings(settings);
      showFeedback(res.message || 'পেমেন্ট নম্বর আপডেট সম্পন্ন হয়েছে!');
    } catch (err) {
      alert(err.message || 'ত্রুটি');
    }
  };

  const handleSaveLimits = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updatePlatformLimits(limits);
      showFeedback(res.message || 'প্ল্যাটফর্ম লক্ষ্য ও লিমিট সংরক্ষিত হয়েছে!');
      loadAllData();
    } catch (err) {
      alert(err.message || 'ত্রুটি');
    }
  };

  // Direct fast login as kabir@gmail.com
  const handleFastLoginAsAdmin = async () => {
    try {
      const res = await api.login({ username: 'kabir@gmail.com', password: '123456' });
      if (res.data?.token) {
        setAuthToken(res.data.token);
        showFeedback('সুপার অ্যাডমিন kabir@gmail.com হিসেবে সেশন রিফ্রেশ হয়েছে!');
        loadAllData();
        if (onPlayerUpdate) onPlayerUpdate();
      }
    } catch (e) {
      alert(e.message || 'অ্যাডমিন লগইনে ত্রুটি');
    }
  };

  // Filtered views
  const filteredGames = games.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(gameSearch.toLowerCase()) || g.code.toLowerCase().includes(gameSearch.toLowerCase());
    const matchCat = gameCatFilter === 'all' || g.category === gameCatFilter;
    return matchSearch && matchCat;
  });

  const filteredPlayers = players.filter((p) => {
    const term = playerSearch.toLowerCase();
    return (
      (p.username && p.username.toLowerCase().includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term)) ||
      (p.mobile && p.mobile.includes(term))
    );
  });

  const filteredDeposits = deposits.filter((d) => {
    if (depFilter === 'all') return true;
    return d.status === depFilter;
  });

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (wthFilter === 'all') return true;
    return w.status === wthFilter;
  });

  // Calculate totals for games
  const totalGameBets = games.reduce((acc, g) => acc + (g.totalBets || 0), 0);
  const totalGameWins = games.reduce((acc, g) => acc + (g.totalPayouts || 0), 0);
  const totalGameProfit = totalGameBets - totalGameWins;

  const pendingDepCount = deposits.filter((d) => d.status === 'PENDING').length;
  const pendingWthCount = withdrawals.filter((w) => w.status === 'PENDING').length;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.92)',
      backdropFilter: 'blur(10px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
    }}>
      <div style={{
        background: '#021815',
        border: '1px solid rgba(255, 215, 0, 0.35)',
        borderRadius: 16,
        width: '100%',
        maxWidth: 1260,
        height: '96vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(245, 158, 11, 0.25)',
      }}>
        {/* TOP STATUS BAR */}
        <div style={{
          background: 'rgba(4, 41, 36, 0.95)',
          padding: '10px 18px',
          borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              width: 32,
              height: 32,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)',
            }}>
              <ShieldCheck size={18} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="gold-text" style={{ fontSize: 16, fontWeight: 800 }}>CK44 MASTER ADMIN ENGINE</span>
                <span style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #ef4444',
                  color: '#fca5a5',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}>
                  SUPER ADMIN: kabir@gmail.com
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                প্ল্যাটফর্ম আর্কিটেকচার, গেম লাভ/ক্ষতি ও প্লেয়ার ফুল কন্ট্রোল ড্যাশবোর্ড
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {feedbackMsg && (
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                color: '#6ee7b7',
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 6,
              }}>
                ✓ {feedbackMsg}
              </span>
            )}

            <button
              onClick={handleFastLoginAsAdmin}
              title="kabir@gmail.com হিসেবে সেশন লগইন রিফ্রেশ করুন"
              style={{
                background: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                color: '#fbbf24',
                padding: '5px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Crown size={13} />
              <span>Kabir Admin Auth</span>
            </button>

            <button
              onClick={loadAllData}
              title="ডেটা রিফ্রেশ করুন"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94a3b8',
                borderRadius: 6,
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={onClose}
              title="বন্ধ করুন"
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                color: '#f87171',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* BODY: DUAL PANE (LEFT SIDEBAR + MAIN WORKSPACE) */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* 1. LEFT ADMIN SIDEBAR */}
          <div style={{
            width: 250,
            background: 'rgba(2, 26, 23, 0.98)',
            borderRight: '1px solid rgba(255, 215, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 8px',
            gap: 4,
            overflowY: 'auto',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '6px 10px' }}>
              কোর ম্যানেজমেন্ট
            </div>

            {[
              { id: 'overview', label: 'প্ল্যাটফর্ম লক্ষ্য ও ওভারভিউ', icon: <LayoutDashboard size={16} /> },
              { id: 'games', label: 'গেম লাভ/ক্ষতি (P&L)', icon: <Gamepad2 size={16} />, badge: 'হট' },
              { id: 'rtp', label: 'RTP ও অ্যালগরিদম ইঞ্জিন', icon: <Zap size={16} color="#fbbf24" />, badge: 'GOD-MODE' },
              { id: 'jackpot', label: 'মেগা জ্যাকপট ও বোনাস পুল', icon: <Crown size={16} color="#f59e0b" /> },
              { id: 'cms', label: 'ব্যানার ও নোটিশ কন্ট্রোল', icon: <Volume2 size={16} /> },
              { id: 'players', label: 'প্লেয়ার ও ইউজার ব্যালেন্স', icon: <Users size={16} />, count: players.length },
              { id: 'deposits', label: 'ডিপোজিট অনুমোদন', icon: <ArrowDownCircle size={16} />, count: pendingDepCount, countColor: '#ef4444' },
              { id: 'withdrawals', label: 'উইথড্রল ম্যানেজমেন্ট', icon: <ArrowUpCircle size={16} />, count: pendingWthCount, countColor: '#f59e0b' },
              { id: 'transactions', label: 'লাইভ বেট লেজার', icon: <Activity size={16} />, badge: 'LIVE' },
              { id: 'settings', label: 'পেমেন্ট গেটওয়ে সেটিংস', icon: <CreditCard size={16} /> },
              { id: 'limits', label: 'রিস্ক ও প্ল্যাটফর্ম লিমিট', icon: <Sliders size={16} /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.35) 100%)' : 'transparent',
                    border: isActive ? '1px solid rgba(251, 191, 36, 0.5)' : '1px solid transparent',
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: isActive ? '#fbbf24' : '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: isActive ? 800 : 600,
                    textAlign: 'left',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge && (
                    <span style={{
                      background: tab.badge === 'LIVE' ? '#10b981' : '#ef4444',
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: 4,
                    }}>
                      {tab.badge}
                    </span>
                  )}

                  {tab.count !== undefined && tab.count > 0 && (
                    <span style={{
                      background: tab.countColor || 'rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: 10,
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Sidebar bottom diagnostic */}
            <div style={{
              marginTop: 'auto',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 215, 0, 0.1)',
              borderRadius: 8,
              padding: '10px',
              fontSize: 10,
              color: '#94a3b8',
              lineHeight: 1.5,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span style={{ color: '#6ee7b7', fontWeight: 700 }}>MongoDB Atlas: Active</span>
              </div>
              <div>Node Engine: Port 5000</div>
              <div>Double-Entry Webhooks: OK</div>
            </div>
          </div>

          {/* 2. MAIN CONTENT WORKSPACE */}
          <div style={{ flex: 1, background: '#021815', overflowY: 'auto', padding: '18px 24px' }}>
            {/* TAB 1: OVERVIEW & GOALS */}
            {activeTab === 'overview' && (
              <div>
                {/* MONTHLY GOAL CARD */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(8, 59, 52, 0.9) 0%, rgba(4, 41, 36, 0.95) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.35)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  marginBottom: 18,
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Crown size={20} color="#fbbf24" />
                        <h3 className="gold-text" style={{ fontSize: 16, margin: 0 }}>
                          মাসিক প্ল্যাটফর্ম লক্ষ্য ও প্রফিট ট্র্যাকার (Target Goal)
                        </h3>
                      </div>
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                        ক্যাসিনো নেট লাভের লক্ষ্যমাত্রা: ৳{stats ? Number(stats.monthlyGoal || 150000).toLocaleString() : '150,000'} BDT
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        background: 'var(--gold-gradient)',
                        color: '#000',
                        fontWeight: 900,
                        fontSize: 13,
                        padding: '4px 12px',
                        borderRadius: 20,
                      }}>
                        {stats ? stats.goalProgress : 0}% সম্পন্ন
                      </span>
                    </div>
                  </div>

                  {/* Goal Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: 12,
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: 6,
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    marginBottom: 8,
                  }}>
                    <div style={{
                      width: `${stats ? Math.min(100, Math.max(5, stats.goalProgress)) : 5}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #10b981 0%, #fbbf24 100%)',
                      borderRadius: 6,
                      transition: 'width 0.8s ease',
                      boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)',
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
                    <span>বর্তমান নেট লাভ: <strong style={{ color: '#10b981' }}>৳{stats ? Number(stats.netProfit).toLocaleString() : 0}</strong></span>
                    <span>টার্গেট ঘাটতি: <strong style={{ color: '#f59e0b' }}>৳{stats ? Math.max(0, (stats.monthlyGoal || 150000) - stats.netProfit).toLocaleString() : 0}</strong></span>
                  </div>
                </div>

                {/* KPI METRIC CARDS */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 14,
                  marginBottom: 20,
                }}>
                  {/* Total Deposits */}
                  <div style={{
                    background: 'rgba(4, 41, 36, 0.7)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 12,
                    padding: 14,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>মোট সংগৃহীত ডিপোজিট</span>
                      <ArrowDownCircle size={18} color="#10b981" />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>
                      ৳ {stats ? Number(stats.totalDeposits).toLocaleString() : '0.00'}
                    </div>
                    <div style={{ fontSize: 10, color: '#6ee7b7', marginTop: 4 }}>প্লেয়ারদের লাইভ জমা টাকা</div>
                  </div>

                  {/* Total Withdrawals */}
                  <div style={{
                    background: 'rgba(4, 41, 36, 0.7)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 12,
                    padding: 14,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>মোট পরিশোধিত উইথড্রল</span>
                      <ArrowUpCircle size={18} color="#ef4444" />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#f87171' }}>
                      ৳ {stats ? Number(stats.totalWithdrawals).toLocaleString() : '0.00'}
                    </div>
                    <div style={{ fontSize: 10, color: '#fca5a5', marginTop: 4 }}>প্লেয়ারদের কাছে পেইড আউট</div>
                  </div>

                  {/* Net Profit */}
                  <div style={{
                    background: 'rgba(4, 41, 36, 0.7)',
                    border: '1px solid rgba(251, 191, 36, 0.4)',
                    borderRadius: 12,
                    padding: 14,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>ক্যাসিনো নেট প্রফিট</span>
                      <DollarSign size={18} color="#fbbf24" />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#fbbf24' }}>
                      ৳ {stats ? Number(stats.netProfit).toLocaleString() : '0.00'}
                    </div>
                    <div style={{ fontSize: 10, color: '#fde68a', marginTop: 4 }}>ডিপোজিট - উইথড্রল মার্জিন</div>
                  </div>

                  {/* Total Liquidity */}
                  <div style={{
                    background: 'rgba(4, 41, 36, 0.7)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: 12,
                    padding: 14,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>মোট রিজার্ভ ও লিকুইডিটি</span>
                      <ShieldCheck size={18} color="#60a5fa" />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#60a5fa' }}>
                      ৳ {stats ? Number(stats.totalLiquidity).toLocaleString() : '50,000'}
                    </div>
                    <div style={{ fontSize: 10, color: '#93c5fd', marginTop: 4 }}>মালিকের নিরাপদ ব্যাকআপ ফান্ড</div>
                  </div>
                </div>

                {/* GAMING GGR & REVENUE SUMMARY */}
                <div style={{
                  background: 'rgba(4, 41, 36, 0.6)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>
                      🎮 গেম টার্নওভার ও জিজিআর (Gross Gaming Revenue)
                    </h4>
                    <button
                      onClick={() => setActiveTab('games')}
                      style={{ background: 'transparent', border: 'none', color: '#fbbf24', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      প্রতিটি গেমের হিসাব দেখুন →
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>মোট বাজি (All Bets)</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fbbf24' }}>৳ {Number(totalGameBets).toFixed(2)}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>মোট পেআউট (All Payouts)</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#f87171' }}>৳ {Number(totalGameWins).toFixed(2)}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>হাউস প্রফিট (GGR)</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: totalGameProfit >= 0 ? '#10b981' : '#ef4444' }}>
                        {totalGameProfit >= 0 ? `+৳ ${Number(totalGameProfit).toFixed(2)}` : `-৳ ${Math.abs(totalGameProfit).toFixed(2)}`}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>ক্যাসিনো হাউস এজ</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#6ee7b7' }}>
                        {totalGameBets > 0 ? ((totalGameProfit / totalGameBets) * 100).toFixed(1) : 3.5}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GAME P&L TRACKER ("kon game thaiak ki poriman loss, ba lav sob trac kortam") */}
            {activeTab === 'games' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h3 className="gold-text" style={{ fontSize: 18, margin: 0 }}>
                      🎮 গেম অনুযায়ী লাভ ও ক্ষতি ট্র্যাকার (Game Profit & Loss)
                    </h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      কোন গেম থেকে কী পরিমাণ টাকা লাভ বা ক্ষতি হয়েছে তা রিয়েল-টাইমে মনিটর করুন
                    </p>
                  </div>

                  <div style={{
                    background: totalGameProfit >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    border: `1px solid ${totalGameProfit >= 0 ? '#10b981' : '#ef4444'}`,
                    padding: '8px 16px',
                    borderRadius: 10,
                  }}>
                    <span style={{ fontSize: 11, color: '#cbd5e1' }}>ক্যাসিনোর মোট গেম লাভ: </span>
                    <strong style={{ fontSize: 16, color: totalGameProfit >= 0 ? '#10b981' : '#f87171' }}>
                      {totalGameProfit >= 0 ? `+৳ ${Number(totalGameProfit).toFixed(2)}` : `-৳ ${Math.abs(totalGameProfit).toFixed(2)}`}
                    </strong>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div style={{
                  display: 'flex',
                  gap: 10,
                  marginBottom: 16,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 11 }} />
                    <input
                      type="text"
                      placeholder="গেমের নাম দিয়ে খুঁজুন (যেমন: Aviator, Olympus, Spaceman)..."
                      value={gameSearch}
                      onChange={(e) => setGameSearch(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(4, 41, 36, 0.8)',
                        border: '1px solid rgba(255, 215, 0, 0.25)',
                        borderRadius: 8,
                        padding: '8px 12px 8px 32px',
                        color: '#fff',
                        fontSize: 12,
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {['all', 'crash', 'slots', 'fishing', 'live'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setGameCatFilter(cat)}
                        style={{
                          background: gameCatFilter === cat ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.08)',
                          color: gameCatFilter === cat ? '#000' : '#cbd5e1',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 12px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comprehensive Game P&L Table */}
                <div style={{
                  background: 'rgba(4, 41, 36, 0.7)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: 12,
                  overflowX: 'auto',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: 'rgba(2, 26, 23, 0.95)', borderBottom: '1px solid rgba(255, 215, 0, 0.2)' }}>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>গেমের নাম ও প্রোভাইডার</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>মোট বাজি (Bets)</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>প্লেয়ার পেআউট (Wins)</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>হাউস লাভ / ক্ষতি (P&L)</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>হাউস এজ %</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>প্লেয়ার RTP %</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>বেট ও রাউন্ড</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGames.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                            কোনো গেম পাওয়া যায়নি
                          </td>
                        </tr>
                      ) : (
                        filteredGames.map((g) => {
                          const isProfit = g.houseProfit >= 0;
                          return (
                            <tr
                              key={g.code}
                              style={{ borderBottom: '1px solid rgba(255, 215, 0, 0.08)' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  {g.thumbnail && (
                                    <img
                                      src={g.thumbnail}
                                      alt={g.name}
                                      style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }}
                                    />
                                  )}
                                  <div>
                                    <div style={{ fontWeight: 800, color: '#fff' }}>{g.name}</div>
                                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{g.provider} • {g.category}</div>
                                  </div>
                                </div>
                              </td>

                              <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fbbf24' }}>
                                ৳ {Number(g.totalBets).toFixed(2)}
                              </td>

                              <td style={{ padding: '12px 14px', fontWeight: 700, color: '#f87171' }}>
                                ৳ {Number(g.totalPayouts).toFixed(2)}
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <span style={{
                                  background: isProfit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                  border: `1px solid ${isProfit ? '#10b981' : '#ef4444'}`,
                                  color: isProfit ? '#6ee7b7' : '#fca5a5',
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  fontWeight: 800,
                                  fontSize: 12,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}>
                                  {isProfit ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                                  {isProfit ? `+৳ ${Number(g.houseProfit).toFixed(2)} (লাভ)` : `-৳ ${Math.abs(g.houseProfit).toFixed(2)} (লস)`}
                                </span>
                              </td>

                              <td style={{ padding: '12px 14px', fontWeight: 700, color: '#e2e8f0' }}>
                                {g.houseMargin}%
                              </td>

                              <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                                {g.actualRtp}%
                              </td>

                              <td style={{ padding: '12px 14px', color: '#94a3b8' }}>
                                <div>মোট বেট: {g.betCount}</div>
                                <div style={{ fontSize: 10, color: '#6ee7b7' }}>উইন: {g.winCount} | লস: {g.lossCount}</div>
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <span style={{
                                  background: isProfit ? '#047857' : '#b91c1c',
                                  color: '#fff',
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                }}>
                                  {isProfit ? 'PROFIT' : 'LOSS'}
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
            )}

            {/* TAB 3: PLAYERS & USERS ("sob user, kar ki khbr") */}
            {activeTab === 'players' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h3 className="gold-text" style={{ fontSize: 18, margin: 0 }}>
                      👥 প্লেয়ার ও ইউজার অ্যাকাউন্ট ম্যানেজমেন্ট (Users List)
                    </h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      প্লেয়ারদের বিস্তারিত খবরাখবর, ব্যালেন্স, ডিপোজিট, লাভ/ক্ষতি ও অ্যাকাউন্ট নিয়ন্ত্রণ
                    </p>
                  </div>

                  <div style={{ position: 'relative', width: 260 }}>
                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 11 }} />
                    <input
                      type="text"
                      placeholder="ইউজারনেম, ইমেইল বা ফোন..."
                      value={playerSearch}
                      onChange={(e) => setPlayerSearch(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(4, 41, 36, 0.8)',
                        border: '1px solid rgba(255, 215, 0, 0.25)',
                        borderRadius: 8,
                        padding: '8px 12px 8px 32px',
                        color: '#fff',
                        fontSize: 12,
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Players Table */}
                <div style={{
                  background: 'rgba(4, 41, 36, 0.7)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: 12,
                  overflowX: 'auto',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: 'rgba(2, 26, 23, 0.95)', borderBottom: '1px solid rgba(255, 215, 0, 0.2)' }}>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>ইউজারনেম ও রোল</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>মোবাইল নম্বর</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>বর্তমান ব্যালেন্স</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>ডিপোজিট / উইথড্র</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>মোট বাজি ও উইন</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>ক্যাসিনোর লাভ/ক্ষতি</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>স্ট্যাটাস</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8', textAlign: 'right' }}>অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlayers.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                            কোনো প্লেয়ার পাওয়া যায়নি
                          </td>
                        </tr>
                      ) : (
                        filteredPlayers.map((p) => {
                          const isHouseProfit = (p.netLoss || 0) >= 0;
                          return (
                            <tr
                              key={p._id}
                              style={{ borderBottom: '1px solid rgba(255, 215, 0, 0.08)' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    background: p.role === 'admin' ? '#ef4444' : '#047857',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 11,
                                    fontWeight: 700,
                                  }}>
                                    {p.role === 'admin' ? '👑' : p.username[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span>{p.username}</span>
                                      {p.role === 'admin' && (
                                        <span style={{ background: '#ef4444', color: '#fff', fontSize: 9, padding: '1px 4px', borderRadius: 3 }}>
                                          ADMIN
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{p.email || '—'}</div>
                                  </div>
                                </div>
                              </td>

                              <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                                {p.mobile || '—'}
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: 13 }}>
                                  ৳ {Number(p.balance || 0).toFixed(2)}
                                </div>
                                {p.bonusBalance > 0 && (
                                  <div style={{ fontSize: 10, color: '#6ee7b7' }}>+৳{p.bonusBalance} বোনাস</div>
                                )}
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ color: '#10b981', fontWeight: 600 }}>↓ ৳{p.totalDeposits || 0}</div>
                                <div style={{ color: '#f87171', fontSize: 10 }}>↑ ৳{p.totalWithdrawals || 0}</div>
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ color: '#cbd5e1' }}>বাজি: ৳{p.totalBets || 0}</div>
                                <div style={{ color: '#94a3b8', fontSize: 10 }}>উইন: ৳{p.totalWins || 0}</div>
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <span style={{
                                  color: isHouseProfit ? '#10b981' : '#f87171',
                                  fontWeight: 800,
                                }}>
                                  {isHouseProfit ? `+৳${p.netLoss || 0} (লাভ)` : `-৳${Math.abs(p.netLoss || 0)} (লস)`}
                                </span>
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <span style={{
                                  background: p.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                  border: `1px solid ${p.status === 'ACTIVE' ? '#10b981' : '#ef4444'}`,
                                  color: p.status === 'ACTIVE' ? '#6ee7b7' : '#fca5a5',
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                }}>
                                  {p.status || 'ACTIVE'}
                                </span>
                              </td>

                              <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                  {/* Adjust Balance Button */}
                                  <button
                                    onClick={() => setBalanceModalUser(p)}
                                    title="ব্যালেন্স যোগ বা কর্তন করুন"
                                    style={{
                                      background: 'rgba(251, 191, 36, 0.15)',
                                      border: '1px solid rgba(251, 191, 36, 0.5)',
                                      color: '#fbbf24',
                                      padding: '4px 8px',
                                      borderRadius: 6,
                                      fontSize: 11,
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    ± ব্যালেন্স
                                  </button>

                                  {/* Toggle Ban / Active */}
                                  <button
                                    onClick={() => handleTogglePlayerStatus(p, p.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE')}
                                    title={p.status === 'ACTIVE' ? 'প্লেয়ারকে ব্যান করুন' : 'আনব্যান করুন'}
                                    style={{
                                      background: p.status === 'ACTIVE' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                      border: `1px solid ${p.status === 'ACTIVE' ? '#ef4444' : '#10b981'}`,
                                      color: p.status === 'ACTIVE' ? '#f87171' : '#6ee7b7',
                                      padding: '4px 8px',
                                      borderRadius: 6,
                                      fontSize: 11,
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {p.status === 'ACTIVE' ? 'ব্যান' : 'আনব্যান'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* MODAL: ADJUST PLAYER BALANCE */}
                {balanceModalUser && (
                  <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.85)',
                    zIndex: 110,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 12,
                  }}>
                    <div style={{
                      background: '#042924',
                      border: '1px solid rgba(255, 215, 0, 0.4)',
                      borderRadius: 14,
                      width: '100%',
                      maxWidth: 400,
                      padding: 20,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <h4 className="gold-text" style={{ margin: 0, fontSize: 16 }}>
                          ব্যালেন্স পরিবর্তন: {balanceModalUser.username}
                        </h4>
                        <button onClick={() => setBalanceModalUser(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                          <X size={18} />
                        </button>
                      </div>

                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>
                        বর্তমান ওয়ালেট ব্যালেন্স: <strong style={{ color: '#fbbf24' }}>৳ {Number(balanceModalUser.balance || 0).toFixed(2)}</strong>
                      </div>

                      <form onSubmit={handleExecuteBalanceAdjustment}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                          <button
                            type="button"
                            onClick={() => setAdjustType('ADD')}
                            style={{
                              flex: 1,
                              background: adjustType === 'ADD' ? '#047857' : 'rgba(255, 255, 255, 0.08)',
                              border: adjustType === 'ADD' ? '1px solid #10b981' : 'none',
                              color: '#fff',
                              borderRadius: 6,
                              padding: '8px',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 4,
                            }}
                          >
                            <Plus size={14} /> যোগ করুন (+)
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdjustType('DEDUCT')}
                            style={{
                              flex: 1,
                              background: adjustType === 'DEDUCT' ? '#b91c1c' : 'rgba(255, 255, 255, 0.08)',
                              border: adjustType === 'DEDUCT' ? '1px solid #ef4444' : 'none',
                              color: '#fff',
                              borderRadius: 6,
                              padding: '8px',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 4,
                            }}
                          >
                            <Minus size={14} /> কর্তন করুন (-)
                          </button>
                        </div>

                        <div style={{ marginBottom: 14 }}>
                          <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>টাকার পরিমাণ (BDT):</label>
                          <input
                            type="number"
                            min="1"
                            step="any"
                            placeholder="যেমন: 500"
                            value={adjustAmount}
                            onChange={(e) => setAdjustAmount(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              background: 'rgba(2, 26, 23, 0.9)',
                              border: '1px solid rgba(255, 215, 0, 0.3)',
                              borderRadius: 8,
                              padding: '8px 12px',
                              color: '#fff',
                              fontSize: 14,
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>কারণ / রিমার্ক (ঐচ্ছিক):</label>
                          <input
                            type="text"
                            placeholder="যেমন: টেস্ট বোনাস বা ম্যানুয়াল সংশোধন"
                            value={adjustRemark}
                            onChange={(e) => setAdjustRemark(e.target.value)}
                            style={{
                              width: '100%',
                              background: 'rgba(2, 26, 23, 0.9)',
                              border: '1px solid rgba(255, 215, 0, 0.3)',
                              borderRadius: 8,
                              padding: '8px 12px',
                              color: '#fff',
                              fontSize: 12,
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => setBalanceModalUser(null)}
                            className="secondary-btn"
                            style={{ flex: 1, justifyContent: 'center' }}
                          >
                            বাতিল
                          </button>
                          <button
                            type="submit"
                            className="gold-btn"
                            style={{ flex: 1 }}
                          >
                            কনফার্ম করুন
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: DEPOSITS */}
            {activeTab === 'deposits' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <h3 className="gold-text" style={{ fontSize: 18, margin: 0 }}>
                      📥 ডিপোজিট রিকোয়েস্ট অনুমোদন (Deposits)
                    </h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      bKash, Nagad, Rocket ও USDT TRC20 ডিপোজিট রিকোয়েস্ট যাচাই ও অনুমোদন
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {['all', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setDepFilter(st)}
                        style={{
                          background: depFilter === st ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.08)',
                          color: depFilter === st ? '#000' : '#cbd5e1',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 12px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(4, 41, 36, 0.7)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: 12,
                  overflowX: 'auto',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: 'rgba(2, 26, 23, 0.95)', borderBottom: '1px solid rgba(255, 215, 0, 0.2)' }}>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>ইউজার</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>চ্যানেল</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>টাকার পরিমাণ</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>ট্রানজেকশন ID (TrxID)</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>প্রেরক মোবাইল</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>স্ট্যাটাস</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8', textAlign: 'right' }}>অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDeposits.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                            কোনো ডিপোজিট রিকোয়েস্ট নেই
                          </td>
                        </tr>
                      ) : (
                        filteredDeposits.map((d) => (
                          <tr key={d._id} style={{ borderBottom: '1px solid rgba(255, 215, 0, 0.08)' }}>
                            <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fff' }}>{d.username}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ background: '#047857', color: '#6ee7b7', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10 }}>
                                {d.channel}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', fontWeight: 800, color: '#10b981' }}>
                              ৳ {Number(d.amount).toFixed(2)}
                              {d.bonusAmount > 0 && <span style={{ fontSize: 10, color: '#fbbf24' }}> (+৳{d.bonusAmount})</span>}
                            </td>
                            <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#fbbf24' }}>{d.trxId}</td>
                            <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{d.senderMobile || '—'}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{
                                background: d.status === 'APPROVED' ? '#047857' : d.status === 'REJECTED' ? '#b91c1c' : '#d97706',
                                color: '#fff',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 800,
                              }}>
                                {d.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              {d.status === 'PENDING' ? (
                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                  <button
                                    onClick={() => handleApproveDeposit(d._id)}
                                    style={{
                                      background: '#047857',
                                      border: 'none',
                                      color: '#fff',
                                      padding: '4px 10px',
                                      borderRadius: 6,
                                      fontSize: 11,
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    অনুমোদন
                                  </button>
                                  <button
                                    onClick={() => handleRejectDeposit(d._id)}
                                    style={{
                                      background: '#b91c1c',
                                      border: 'none',
                                      color: '#fff',
                                      padding: '4px 8px',
                                      borderRadius: 6,
                                      fontSize: 11,
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    বাতিল
                                  </button>
                                </div>
                              ) : (
                                <span style={{ color: '#64748b', fontSize: 11 }}>সম্পন্ন</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: WITHDRAWALS */}
            {activeTab === 'withdrawals' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <h3 className="gold-text" style={{ fontSize: 18, margin: 0 }}>
                      📤 উইথড্রল রিকোয়েস্ট ও টার্নওভার গার্ড (Withdrawals)
                    </h3>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                      প্লেয়ারদের ক্যাশআউট অনুমোদন ও ১x টার্নওভার যাচাইকরণ
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {['all', 'PENDING', 'PAID', 'REJECTED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setWthFilter(st)}
                        style={{
                          background: wthFilter === st ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.08)',
                          color: wthFilter === st ? '#000' : '#cbd5e1',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 12px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(4, 41, 36, 0.7)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: 12,
                  overflowX: 'auto',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: 'rgba(2, 26, 23, 0.95)', borderBottom: '1px solid rgba(255, 215, 0, 0.2)' }}>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>প্লেয়ার</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>উইথড্র মাধ্যম</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>টাকার পরিমাণ</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>প্রাপক অ্যাকাউন্ট নম্বর</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>টার্নওভার যাচাই</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8' }}>স্ট্যাটাস</th>
                        <th style={{ padding: '12px 14px', color: '#94a3b8', textAlign: 'right' }}>অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWithdrawals.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                            কোনো উইথড্রল রিকোয়েস্ট নেই
                          </td>
                        </tr>
                      ) : (
                        filteredWithdrawals.map((w) => (
                          <tr key={w._id} style={{ borderBottom: '1px solid rgba(255, 215, 0, 0.08)' }}>
                            <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fff' }}>{w.username}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ background: '#083b34', color: '#fbbf24', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10 }}>
                                {w.channel}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', fontWeight: 800, color: '#f87171' }}>
                              ৳ {Number(w.amount).toFixed(2)}
                            </td>
                            <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#e2e8f0' }}>{w.payoutAccount}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{
                                background: w.turnoverVerified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                border: `1px solid ${w.turnoverVerified ? '#10b981' : '#ef4444'}`,
                                color: w.turnoverVerified ? '#6ee7b7' : '#fca5a5',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                              }}>
                                {w.turnoverVerified ? '✓ 1x Turnover OK' : '⚠ Turnover Incomplete'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{
                                background: w.status === 'PAID' ? '#047857' : w.status === 'REJECTED' ? '#b91c1c' : '#d97706',
                                color: '#fff',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 800,
                              }}>
                                {w.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              {w.status === 'PENDING' ? (
                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                  <button
                                    onClick={() => handlePayWithdrawal(w._id)}
                                    style={{
                                      background: 'var(--gold-gradient)',
                                      border: 'none',
                                      color: '#000',
                                      padding: '4px 10px',
                                      borderRadius: 6,
                                      fontSize: 11,
                                      fontWeight: 800,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    পেইড মার্ক করুন
                                  </button>
                                  <button
                                    onClick={() => handleRejectWithdrawal(w._id)}
                                    style={{
                                      background: '#b91c1c',
                                      border: 'none',
                                      color: '#fff',
                                      padding: '4px 8px',
                                      borderRadius: 6,
                                      fontSize: 11,
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    বাতিল ও রিফান্ড
                                  </button>
                                </div>
                              ) : (
                                <span style={{ color: '#64748b', fontSize: 11 }}>পরিশোধিত</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: TRANSACTIONS STREAM */}
            {activeTab === 'transactions' && (
              <div>
                <div style={{ marginBottom: 14 }}>
                  <h3 className="gold-text" style={{ fontSize: 18, margin: 0 }}>
                    ⚡ লাইভ সিমলেস ট্রানজেকশন লেজার (Live Webhook Ledger)
                  </h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                    প্লেয়ারদের প্রতিটি বাজি (DEBIT) এবং জেতার পেআউট (CREDIT) এর তাৎক্ষণিক হিসাব
                  </p>
                </div>

                <div style={{
                  background: 'rgba(4, 41, 36, 0.7)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: 12,
                  overflowX: 'auto',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: 'rgba(2, 26, 23, 0.95)', borderBottom: '1px solid rgba(255, 215, 0, 0.2)' }}>
                        <th style={{ padding: '10px 12px', color: '#94a3b8' }}>টাইমস্ট্যাম্প</th>
                        <th style={{ padding: '10px 12px', color: '#94a3b8' }}>প্লেয়ার</th>
                        <th style={{ padding: '10px 12px', color: '#94a3b8' }}>গেম কোড</th>
                        <th style={{ padding: '10px 12px', color: '#94a3b8' }}>টাইপ</th>
                        <th style={{ padding: '10px 12px', color: '#94a3b8' }}>টাকার পরিমাণ</th>
                        <th style={{ padding: '10px 12px', color: '#94a3b8' }}>পূর্ববর্তী ব্যালেন্স</th>
                        <th style={{ padding: '10px 12px', color: '#94a3b8' }}>পরবর্তী ব্যালেন্স</th>
                        <th style={{ padding: '10px 12px', color: '#94a3b8' }}>TxID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                            কোনো গেম ট্রানজেকশন নেই
                          </td>
                        </tr>
                      ) : (
                        transactions.map((t, idx) => {
                          const isDebit = t.type === 'DEBIT';
                          return (
                            <tr key={t.txId || idx} style={{ borderBottom: '1px solid rgba(255, 215, 0, 0.05)' }}>
                              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>
                                {new Date(t.createdAt).toLocaleTimeString()}
                              </td>
                              <td style={{ padding: '10px 12px', fontWeight: 700, color: '#fff' }}>{t.username || 'demo'}</td>
                              <td style={{ padding: '10px 12px', color: '#fbbf24' }}>{t.gameCode}</td>
                              <td style={{ padding: '10px 12px' }}>
                                <span style={{
                                  background: isDebit ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                  border: `1px solid ${isDebit ? '#ef4444' : '#10b981'}`,
                                  color: isDebit ? '#f87171' : '#6ee7b7',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  fontWeight: 800,
                                }}>
                                  {isDebit ? 'DEBIT (বাজি)' : 'CREDIT (উইন)'}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', fontWeight: 800, color: isDebit ? '#f87171' : '#10b981' }}>
                                {isDebit ? `-৳${Number(t.amount).toFixed(2)}` : `+৳${Number(t.amount).toFixed(2)}`}
                              </td>
                              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>৳{Number(t.balanceBefore || 0).toFixed(2)}</td>
                              <td style={{ padding: '10px 12px', fontWeight: 700, color: '#fbbf24' }}>৳{Number(t.balanceAfter || 0).toFixed(2)}</td>
                              <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#64748b', fontSize: 10 }}>{t.txId}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 7: PAYMENT GATEWAYS */}
            {activeTab === 'settings' && (
              <div style={{ maxWidth: 600 }}>
                <div style={{ marginBottom: 14 }}>
                  <h3 className="gold-text" style={{ fontSize: 18, margin: 0 }}>
                    💳 ওনার পেমেন্ট গেটওয়ে সেটিংস (Payment Settings)
                  </h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                    প্লেয়ারদের ডিপোজিট স্ক্রিনে প্রদর্শিত নম্বরসমূহ সরাসরি পরিবর্তন করুন
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} style={{ background: 'rgba(4, 41, 36, 0.7)', border: '1px solid rgba(255, 215, 0, 0.2)', borderRadius: 12, padding: 20 }}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', display: 'block', marginBottom: 4 }}>bKash নম্বর:</label>
                    <input
                      type="text"
                      value={settings.bkash}
                      onChange={(e) => setSettings({ ...settings, bkash: e.target.value })}
                      style={{ width: '100%', background: 'rgba(2, 26, 23, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', display: 'block', marginBottom: 4 }}>Nagad নম্বর:</label>
                    <input
                      type="text"
                      value={settings.nagad}
                      onChange={(e) => setSettings({ ...settings, nagad: e.target.value })}
                      style={{ width: '100%', background: 'rgba(2, 26, 23, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', display: 'block', marginBottom: 4 }}>Rocket নম্বর:</label>
                    <input
                      type="text"
                      value={settings.rocket}
                      onChange={(e) => setSettings({ ...settings, rocket: e.target.value })}
                      style={{ width: '100%', background: 'rgba(2, 26, 23, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', display: 'block', marginBottom: 4 }}>USDT (TRC20) ডিপোজিট ওয়ালেট:</label>
                    <input
                      type="text"
                      value={settings.usdt}
                      onChange={(e) => setSettings({ ...settings, usdt: e.target.value })}
                      style={{ width: '100%', background: 'rgba(2, 26, 23, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, fontFamily: 'monospace' }}
                    />
                  </div>

                  <button type="submit" className="gold-btn" style={{ width: '100%', padding: '10px' }}>
                    <Save size={15} /> পরিবর্তন সংরক্ষণ করুন
                  </button>
                </form>
              </div>
            )}

            {/* TAB 8: RISK & LIMITS */}
            {activeTab === 'limits' && (
              <div style={{ maxWidth: 600 }}>
                <div style={{ marginBottom: 14 }}>
                  <h3 className="gold-text" style={{ fontSize: 18, margin: 0 }}>
                    🛡️ প্ল্যাটফর্ম রিস্ক ও প্লেয়ার লিমিট (Risk Limits)
                  </h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                    মাসিক লাভ গোল, রিজার্ভ ফান্ড ও উইথড্রল নিরাপত্তা সিলিং কনফিগার করুন
                  </p>
                </div>

                <form onSubmit={handleSaveLimits} style={{ background: 'rgba(4, 41, 36, 0.7)', border: '1px solid rgba(255, 215, 0, 0.2)', borderRadius: 12, padding: 20 }}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', display: 'block', marginBottom: 4 }}>
                      মাসিক লাভের লক্ষ্যমাত্রা (Monthly Target Goal - ৳):
                    </label>
                    <input
                      type="number"
                      value={limits.monthlyGoal || 150000}
                      onChange={(e) => setLimits({ ...limits, monthlyGoal: Number(e.target.value) })}
                      style={{ width: '100%', background: 'rgba(2, 26, 23, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', display: 'block', marginBottom: 4 }}>
                      মালিকের ব্যাকআপ রিজার্ভ ফান্ড (Reserve Fund - ৳):
                    </label>
                    <input
                      type="number"
                      value={limits.reserveFund || 50000}
                      onChange={(e) => setLimits({ ...limits, reserveFund: Number(e.target.value) })}
                      style={{ width: '100%', background: 'rgba(2, 26, 23, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', display: 'block', marginBottom: 4 }}>
                      প্লেয়ারের দৈনিক সর্বোচ্চ উইথড্রল সীমা (৳):
                    </label>
                    <input
                      type="number"
                      value={limits.maxDailyWithdrawal || 5000}
                      onChange={(e) => setLimits({ ...limits, maxDailyWithdrawal: Number(e.target.value) })}
                      style={{ width: '100%', background: 'rgba(2, 26, 23, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', display: 'block', marginBottom: 4 }}>
                      প্রতি রাউন্ডে সর্বোচ্চ বাজি সীমা (Max Bet Per Round - ৳):
                    </label>
                    <input
                      type="number"
                      value={limits.maxBetPerRound || 1000}
                      onChange={(e) => setLimits({ ...limits, maxBetPerRound: Number(e.target.value) })}
                      style={{ width: '100%', background: 'rgba(2, 26, 23, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13 }}
                    />
                  </div>

                  <button type="submit" className="gold-btn" style={{ width: '100%', padding: '10px' }}>
                    <Save size={15} /> লিমিট সংরক্ষণ করুন
                  </button>
                </form>
              </div>
            )}

            {/* TAB 9: RTP & HOUSE EDGE ENGINE (GOD-MODE) */}
            {activeTab === 'rtp' && (
              <div style={{ maxWidth: 680 }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={22} color="#fbbf24" />
                    <h3 className="gold-text" style={{ fontSize: 18, margin: 0 }}>
                      🎛️ গেম RTP ও হাউস অ্যালগরিদম মোড (God-Mode Win/Loss Engine)
                    </h3>
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                    প্ল্যাটফর্মের বাজি জয়ের সম্ভাবনা ও ক্যাসিনো মার্জিন সরাসরি এক ক্লিকে নিয়ন্ত্রণ করুন
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                  {/* Mode 1: STANDARD */}
                  <div
                    onClick={async () => {
                      setHouseRtpMode('STANDARD');
                      await api.updatePlatformConfig({ houseRtpMode: 'STANDARD' });
                      showFeedback('RTP মোড পরিবর্তন করে Standard (96.5%) করা হয়েছে!');
                      if (onConfigUpdate) onConfigUpdate();
                    }}
                    style={{
                      background: houseRtpMode === 'STANDARD' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(4, 41, 36, 0.6)',
                      border: `2px solid ${houseRtpMode === 'STANDARD' ? '#10b981' : 'rgba(255, 215, 0, 0.15)'}`,
                      borderRadius: 12,
                      padding: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#10b981' }}>
                          🟢 ব্যালেন্সড স্ট্যান্ডার্ড মোড (Balanced Standard - 96.5% RTP)
                        </span>
                        {houseRtpMode === 'STANDARD' && (
                          <span style={{ background: '#10b981', color: '#000', fontSize: 10, fontWeight: 900, padding: '2px 6px', borderRadius: 4 }}>
                            অ্যাক্টিভ
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                        আন্তর্জাতিক প্র্যাগম্যাটিক ও এভিয়েটর নিয়ম অনুযায়ী ভারসাম্যপূর্ণ উইন রেট (ক্যাসিনো হাউস এজ ৩.৫%)।
                      </p>
                    </div>
                  </div>

                  {/* Mode 2: HIGH_PROFIT */}
                  <div
                    onClick={async () => {
                      setHouseRtpMode('HIGH_PROFIT');
                      await api.updatePlatformConfig({ houseRtpMode: 'HIGH_PROFIT' });
                      showFeedback('⚠️ কঠোর ক্যাসিনো লাভ মোড (88.0% RTP) অ্যাক্টিভ করা হয়েছে!');
                      if (onConfigUpdate) onConfigUpdate();
                    }}
                    style={{
                      background: houseRtpMode === 'HIGH_PROFIT' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(4, 41, 36, 0.6)',
                      border: `2px solid ${houseRtpMode === 'HIGH_PROFIT' ? '#ef4444' : 'rgba(255, 215, 0, 0.15)'}`,
                      borderRadius: 12,
                      padding: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#f87171' }}>
                          🔴 কঠোর ক্যাসিনো প্রফিট মোড (Strict House Profit - 88.0% RTP)
                        </span>
                        {houseRtpMode === 'HIGH_PROFIT' && (
                          <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 900, padding: '2px 6px', borderRadius: 4 }}>
                            অ্যাক্টিভ
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#fca5a5', margin: '4px 0 0 0' }}>
                        ক্যাসিনোর সর্বোচ্চ লাভ নিশ্চিত করতে Aviator তাড়াতাড়ি ক্র্যাশ করবে এবং স্লট পেআউট টাইট থাকবে (হাউস এজ ১২.০%)।
                      </p>
                    </div>
                  </div>

                  {/* Mode 3: PROMO_BOOST */}
                  <div
                    onClick={async () => {
                      setHouseRtpMode('PROMO_BOOST');
                      await api.updatePlatformConfig({ houseRtpMode: 'PROMO_BOOST' });
                      showFeedback('🎉 প্লেয়ার প্রোমো ইভেন্ট বুস্ট মোড (98.0% RTP) অ্যাক্টিভ করা হয়েছে!');
                      if (onConfigUpdate) onConfigUpdate();
                    }}
                    style={{
                      background: houseRtpMode === 'PROMO_BOOST' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(4, 41, 36, 0.6)',
                      border: `2px solid ${houseRtpMode === 'PROMO_BOOST' ? '#f59e0b' : 'rgba(255, 215, 0, 0.15)'}`,
                      borderRadius: 12,
                      padding: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#fbbf24' }}>
                          🟡 প্লেয়ার প্রোমো ইভেন্ট বুস্ট (Promo High Win Rate - 98.0% RTP)
                        </span>
                        {houseRtpMode === 'PROMO_BOOST' && (
                          <span style={{ background: '#fbbf24', color: '#000', fontSize: 10, fontWeight: 900, padding: '2px 6px', borderRadius: 4 }}>
                            অ্যাক্টিভ
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#fde68a', margin: '4px 0 0 0' }}>
                        বিশেষ উৎসব বা অফার চলাকালীন প্লেয়ারদের ঘনঘন উইনিং ও আকর্ষণ বাড়াতে মাল্টিপ্লায়ার বৃদ্ধি পাবে।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 10: JACKPOT & BONUSES */}
            {activeTab === 'jackpot' && (
              <div style={{ maxWidth: 650 }}>
                <div style={{ marginBottom: 14 }}>
                  <h3 className="gold-text" style={{ fontSize: 18, margin: 0 }}>
                    🏆 মেগা প্রগ্রেসিভ জ্যাকপট ও বোনাস পুল সেটিংস
                  </h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                    হেডারের নিচে প্রদর্শিত লাইভ মেগা জ্যাকপট কাউন্টার ও স্বয়ংক্রিয় বোনাস রুলস নিয়ন্ত্রণ
                  </p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await api.updatePlatformConfig({
                      megaJackpot: Number(megaJackpotPool),
                      bonusSettings: bonusRules,
                    });
                    showFeedback('জ্যাকপট ও বোনাস সেটিংস সফলভাবে সেভ হয়েছে!');
                    if (onConfigUpdate) onConfigUpdate();
                  }}
                  style={{ background: 'rgba(4, 41, 36, 0.7)', border: '1px solid rgba(255, 215, 0, 0.2)', borderRadius: 12, padding: 20 }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', display: 'block', marginBottom: 4 }}>
                      মেগা জ্যাকপট বেস পুল (Mega Jackpot Base Amount - ৳):
                    </label>
                    <input
                      type="number"
                      value={megaJackpotPool}
                      onChange={(e) => setMegaJackpotPool(Number(e.target.value))}
                      style={{ width: '100%', background: 'rgba(2, 26, 23, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 15, fontFamily: 'monospace' }}
                    />
                    <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, display: 'block' }}>
                      এটি হোমপেজে গোল্ডেন অ্যানিমেশনের সাথে প্রতি সেকেন্ডে লাইভ বৃদ্ধি পায়।
                    </span>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', display: 'block', marginBottom: 4 }}>
                      ১ম ডিপোজিট ওয়েলকাম বোনাস (%):
                    </label>
                    <input
                      type="number"
                      value={bonusRules.welcomeBonusPct}
                      onChange={(e) => setBonusRules({ ...bonusRules, welcomeBonusPct: Number(e.target.value) })}
                      style={{ width: '100%', background: 'rgba(2, 26, 23, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', display: 'block', marginBottom: 4 }}>
                      USDT (TRC20) ডিপোজিট এক্সট্রা ক্যাশব্যাক (%):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={bonusRules.usdtBonusPct}
                      onChange={(e) => setBonusRules({ ...bonusRules, usdtBonusPct: Number(e.target.value) })}
                      style={{ width: '100%', background: 'rgba(2, 26, 23, 0.9)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13 }}
                    />
                  </div>

                  <button type="submit" className="gold-btn" style={{ width: '100%', padding: '10px' }}>
                    <Save size={15} /> জ্যাকপট ও বোনাস সংরক্ষণ করুন
                  </button>
                </form>
              </div>
            )}

            {/* TAB 11: CMS BANNERS & NOTICES */}
            {activeTab === 'cms' && (
              <div style={{ maxWidth: 700 }}>
                <div style={{ marginBottom: 14 }}>
                  <h3 className="gold-text" style={{ fontSize: 18, margin: 0 }}>
                    📢 ব্যানার ও লাইভ নোটিশ কন্ট্রোল (Notice & CMS Manager)
                  </h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
                    ওয়েবসাইটে স্ক্রলিং হওয়া লাইভ নোটিশ পরিবর্তন করুন (প্রতি লাইনে একটি করে নোটিশ লিখুন)
                  </p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const lines = cmsAnnouncements.split('\n').map((l) => l.trim()).filter(Boolean);
                    await api.updatePlatformConfig({ marqueeAnnouncements: lines });
                    showFeedback('লাইভ স্ক্রলিং নোটিশ সফলভাবে আপডেট হয়েছে!');
                    if (onConfigUpdate) onConfigUpdate();
                  }}
                  style={{ background: 'rgba(4, 41, 36, 0.7)', border: '1px solid rgba(255, 215, 0, 0.2)', borderRadius: 12, padding: 20 }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', display: 'block', marginBottom: 6 }}>
                      স্ক্রলিং নোটিশ তালিকা (প্রতি লাইনে একটি নোটিশ):
                    </label>
                    <textarea
                      rows={6}
                      value={cmsAnnouncements}
                      onChange={(e) => setCmsAnnouncements(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(2, 26, 23, 0.9)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: 8,
                        padding: '10px 12px',
                        color: '#fff',
                        fontSize: 13,
                        lineHeight: 1.6,
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <button type="submit" className="gold-btn" style={{ width: '100%', padding: '10px' }}>
                    <Save size={15} /> নোটিশ সেভ করুন (লাইভ আপডেট হবে)
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
