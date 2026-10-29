import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MarqueeTicker } from './components/MarqueeTicker';
import { BannerSlider } from './components/BannerSlider';
import { CategoryNav } from './components/CategoryNav';
import { GameGrid } from './components/GameGrid';
import { GameModal } from './components/GameModal';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';
import { MainSidebar } from './components/MainSidebar';
import { MegaJackpotBanner } from './components/MegaJackpotBanner';
import { LiveWinnerToast } from './components/LiveWinnerToast';
import { LuckyWheelModal } from './components/LuckyWheelModal';
import { LuckyWheelFloatingButton } from './components/LuckyWheelFloatingButton';
import { BottomNav } from './components/BottomNav';
import { api, getAuthToken, removeAuthToken } from './services/api';
import { ShieldCheck, Award, Smartphone, HelpCircle } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [games, setGames] = useState([]);
  const [platformConfig, setPlatformConfig] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('home');

  // Modals & Drawers
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [luckyWheelOpen, setLuckyWheelOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  // Fetch current user & wallet
  const fetchUserData = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await api.getMe();
      if (res.data) {
        setUser(res.data);
        setWallet(res.data.wallet);
      }
    } catch (err) {
      console.warn('Session expired or guest mode:', err.message);
      removeAuthToken();
      setUser(null);
      setWallet(null);
    }
  };

  // Fetch games catalog
  const fetchGames = async (cat = 'all') => {
    try {
      const res = await api.getGames({ category: cat });
      if (res.data) {
        setGames(res.data);
      }
    } catch (err) {
      console.error('Failed to load games:', err);
    }
  };

  // Fetch live CMS platform config (announcements, banners, jackpot)
  const fetchPlatformConfig = async () => {
    try {
      const res = await api.getPublicConfig();
      if (res.data) {
        setPlatformConfig(res.data);
      }
    } catch (err) {
      console.warn('Failed to load platform config:', err.message);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchGames('all');
    fetchPlatformConfig();
  }, []);

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    fetchGames(cat);
  };

  const handleLaunchGame = (game) => {
    setActiveGame(game);
  };

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setWallet(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: '#fff' }}>
      {/* 1. Header */}
      <Header
        user={user}
        wallet={wallet}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onOpenDeposit={() => {
          if (!user) {
            setAuthMode('login');
            setAuthModalOpen(true);
          } else {
            setDepositModalOpen(true);
          }
        }}
        onOpenWithdraw={() => {
          if (!user) {
            setAuthMode('login');
            setAuthModalOpen(true);
          } else {
            setWithdrawModalOpen(true);
          }
        }}
        onLogout={handleLogout}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenLuckyWheel={() => setLuckyWheelOpen(true)}
      />

      {/* 1.1 Left Navigation Sidebar Drawer */}
      <MainSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        wallet={wallet}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onOpenDeposit={() => {
          if (!user) {
            setAuthMode('login');
            setAuthModalOpen(true);
          } else {
            setDepositModalOpen(true);
          }
        }}
        onOpenWithdraw={() => {
          if (!user) {
            setAuthMode('login');
            setAuthModalOpen(true);
          } else {
            setWithdrawModalOpen(true);
          }
        }}
        onLogout={handleLogout}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenLuckyWheel={() => setLuckyWheelOpen(true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* 2. Marquee Live Ticker */}
      <MarqueeTicker items={platformConfig?.marqueeAnnouncements} />

      {/* Main Container */}
      <main className="app-container">
        {/* 3. Hero Promo Slider */}
        <BannerSlider
          banners={platformConfig?.heroBanners}
          onAction={(type) => {
            if (type === 'deposit') {
              if (!user) {
                setAuthMode('login');
                setAuthModalOpen(true);
              } else {
                setDepositModalOpen(true);
              }
            } else if (type === 'play_aviator') {
              const aviator = games.find((g) => g.code === 'pragmatic_highflyer') || games[0];
              if (aviator) handleLaunchGame(aviator);
            } else if (type === 'play_olympus') {
              const olympus = games.find((g) => g.code === 'pragmatic_olympus') || games[0];
              if (olympus) handleLaunchGame(olympus);
            } else if (type === 'play_spaceman') {
              const spaceman = games.find((g) => g.code === 'pragmatic_spaceman') || games[0];
              if (spaceman) handleLaunchGame(spaceman);
            }
          }}
        />

        {/* 3.1 Glowing Grand Mega Jackpot Counter */}
        <MegaJackpotBanner baseJackpot={platformConfig?.megaJackpot || 5420890} />

        {/* 4. Horizontal Category Nav */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 5. Game Catalog Grid */}
        <GameGrid
          games={games}
          onLaunchGame={handleLaunchGame}
        />

        {/* 6. Footer Disclaimers & Security Badges */}
        <footer style={{
          marginTop: 30,
          borderTop: '1px solid rgba(255, 215, 0, 0.1)',
          padding: '24px 16px 40px 16px',
          background: 'rgba(2, 26, 23, 0.6)',
        }}>
          {/* Payment Methods Banner */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 20,
          }}>
            {['bKash', 'Nagad', 'Rocket', 'USDT TRC20', 'Pragmatic Play', 'Evolution', 'Spribe'].map((item) => (
              <div
                key={item}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 6,
                  padding: '4px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#94a3b8',
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto', fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
            <p style={{ marginBottom: 6 }}>
              🔒 256-Bit SSL এনক্রিপশন ও B2B Seamless Wallet প্রযুক্তির সাহায্যে সুরক্ষিত গেমিং সার্ভার।
            </p>
            <p>© 2026 CK44 Gaming Aggregator Platform. All Rights Reserved.</p>
          </div>
        </footer>
      </main>

      {/* 7. Bottom Navigation for Mobile */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={user}
        onOpenDeposit={() => {
          if (!user) {
            setAuthMode('login');
            setAuthModalOpen(true);
          } else {
            setDepositModalOpen(true);
          }
        }}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
      />

      {/* 8. Modals */}
      {authModalOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(userData) => {
            setUser(userData);
            setWallet(userData.wallet);
          }}
        />
      )}

      {depositModalOpen && (
        <DepositModal
          onClose={() => setDepositModalOpen(false)}
          onSuccess={fetchUserData}
        />
      )}

      {withdrawModalOpen && (
        <WithdrawModal
          wallet={wallet}
          onClose={() => setWithdrawModalOpen(false)}
          onSuccess={fetchUserData}
        />
      )}

      {activeGame && (
        <GameModal
          game={activeGame}
          user={user}
          wallet={wallet}
          platformConfig={platformConfig}
          onClose={() => setActiveGame(null)}
          onWalletUpdate={fetchUserData}
        />
      )}

      {/* 9. Live Social Proof Real Winners Toast */}
      <LiveWinnerToast />

      {/* 10. Daily Lucky Wheel Floating Launcher Button & Modal */}
      <LuckyWheelFloatingButton onClick={() => setLuckyWheelOpen(true)} />
      <LuckyWheelModal
        isOpen={luckyWheelOpen}
        onClose={() => setLuckyWheelOpen(false)}
        user={user}
        onWalletUpdate={fetchUserData}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
      />

      {adminModalOpen && (
        <AdminModal
          onClose={() => setAdminModalOpen(false)}
          onPlayerUpdate={fetchUserData}
          onConfigUpdate={fetchPlatformConfig}
        />
      )}
    </div>
  );
}
