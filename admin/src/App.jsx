import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { ReportsPage } from './pages/ReportsPage';
import { GamesPage } from './pages/GamesPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { PlayersPage } from './pages/PlayersPage';
import { DepositsPage } from './pages/DepositsPage';
import { WithdrawalsPage } from './pages/WithdrawalsPage';
import { GatewaysPage } from './pages/GatewaysPage';
import { LimitsPage } from './pages/LimitsPage';
import { CmsPage } from './pages/CmsPage';
import { RtpPage } from './pages/RtpPage';
import { JackpotPage } from './pages/JackpotPage';
import { api, getAdminToken, removeAdminToken } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const checkAuth = async () => {
    const token = getAdminToken();
    if (!token) {
      setUser(null);
      setCheckingAuth(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.data && (res.data.role === 'admin' || res.data.username === 'kabir@gmail.com' || res.data.email === 'kabir@gmail.com')) {
        setUser(res.data);
      } else {
        removeAdminToken();
        setUser(null);
      }
    } catch (err) {
      removeAdminToken();
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    removeAdminToken();
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#030712] text-slate-300">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500/20 border-t-rose-500"></div>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Verifying Administrative Session...</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route path="*" element={<LoginPage onLoginSuccess={(userData) => setUser(userData)} />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
            <Route index element={<OverviewPage />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="games" element={<GamesPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="players" element={<PlayersPage />} />
            <Route path="deposits" element={<DepositsPage />} />
            <Route path="withdrawals" element={<WithdrawalsPage />} />
            <Route path="gateways" element={<GatewaysPage />} />
            <Route path="limits" element={<LimitsPage />} />
            <Route path="cms" element={<CmsPage />} />
            <Route path="rtp" element={<RtpPage />} />
            <Route path="jackpot" element={<JackpotPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}
