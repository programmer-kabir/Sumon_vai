import React from 'react';
import { Home, Gift, PlusCircle, Crown, User } from 'lucide-react';

export const BottomNav = ({ activeTab, onSelectTab, onOpenDeposit, onOpenAuth, user }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(2, 26, 23, 0.98)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255, 215, 0, 0.2)',
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '6px 0 8px 0',
      maxWidth: 1280,
      margin: '0 auto',
    }}>
      {/* Home */}
      <button
        onClick={() => onSelectTab('home')}
        style={{
          background: 'transparent',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: activeTab === 'home' ? '#fbbf24' : '#94a3b8',
          fontSize: 10,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <Home size={20} />
        <span>হোম</span>
      </button>

      {/* Promotions */}
      <button
        onClick={() => onSelectTab('promotions')}
        style={{
          background: 'transparent',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: activeTab === 'promotions' ? '#fbbf24' : '#94a3b8',
          fontSize: 10,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <Gift size={20} />
        <span>অফার</span>
      </button>

      {/* Glowing Center Deposit Button */}
      <button
        onClick={onOpenDeposit}
        style={{
          background: 'var(--gold-gradient)',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#000',
          marginTop: -22,
          boxShadow: '0 0 20px rgba(245, 158, 11, 0.7)',
        }}
      >
        <PlusCircle size={26} />
      </button>

      {/* VIP */}
      <button
        onClick={() => onSelectTab('vip')}
        style={{
          background: 'transparent',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: activeTab === 'vip' ? '#fbbf24' : '#94a3b8',
          fontSize: 10,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <Crown size={20} />
        <span>ভিআইপি</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => {
          if (!user) {
            onOpenAuth('login');
          } else {
            onSelectTab('profile');
          }
        }}
        style={{
          background: 'transparent',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: activeTab === 'profile' ? '#fbbf24' : '#94a3b8',
          fontSize: 10,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <User size={20} />
        <span>{user ? 'প্রোফাইল' : 'লগইন'}</span>
      </button>
    </div>
  );
};
