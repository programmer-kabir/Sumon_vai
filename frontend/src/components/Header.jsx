import React, { useState } from 'react';
import {
  Wallet as WalletIcon,
  PlusCircle,
  LogOut,
  Download,
  ShieldCheck,
  Menu,
  Crown,
  Volume2,
  VolumeX,
  Flame,
} from 'lucide-react';
import { sound } from '../services/soundService';

export const Header = ({
  user,
  wallet,
  onOpenAuth,
  onOpenDeposit,
  onOpenWithdraw,
  onLogout,
  onToggleSidebar,
  onOpenLuckyWheel,
}) => {
  const [muted, setMuted] = useState(sound.isMuted());

  const handleToggleSound = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      sound.playWinSound();
    }
  };

  return (
    <header style={{
      background: 'rgba(2, 26, 23, 0.98)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '10px 16px',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        {/* Left Side: Sidebar Hamburger + Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Hamburger Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            title="সাইডবার মেনু খুলুন"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: 8,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            <Menu size={20} />
          </button>

          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #ffd700 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(251, 191, 36, 0.5)',
              fontWeight: 900,
              color: '#000',
              fontSize: 18,
            }}>
              CK
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="gold-text" style={{ fontSize: 20, letterSpacing: 1 }}>CK44</span>
                <span style={{
                  background: '#047857',
                  color: '#6ee7b7',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                }}>BD LIVE</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>বাংলাদেশ #১ প্রিমিয়াম ক্যাসিনো</div>
            </div>
          </div>
        </div>

        {/* Center: Live 24h Payout Ticker Badge (Hidden on mobile) */}
        <div style={{
          display: 'none',
          lgDisplay: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(4, 41, 36, 0.8)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 11,
        }}>
          <Flame size={14} color="#10b981" />
          <span style={{ color: '#94a3b8' }}>২৪ ঘণ্টায় মোট পেইড আউট:</span>
          <strong style={{ color: '#10b981' }}>৳ ১,৫১,৭২৪</strong>
        </div>

        {/* Right Action Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Sound Mute / Unmute Button */}
          <button
            onClick={handleToggleSound}
            title={muted ? 'সাউন্ড চালু করুন' : 'সাউন্ড বন্ধ করুন'}
            style={{
              background: muted ? 'rgba(255, 255, 255, 0.05)' : 'rgba(251, 191, 36, 0.15)',
              border: `1px solid ${muted ? 'rgba(255, 255, 255, 0.1)' : 'rgba(251, 191, 36, 0.4)'}`,
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: muted ? '#94a3b8' : '#fbbf24',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Daily Lucky Spin Button in Header */}
          <button
            onClick={onOpenLuckyWheel}
            title="ডেইলি লাকি স্পিন খুলুন"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.35))',
              border: '1px solid #f59e0b',
              borderRadius: 8,
              height: 32,
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              color: '#fef08a',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.25)',
              transition: 'var(--transition)',
            }}
          >
            <span>🎁</span>
            <span>স্পিন</span>
          </button>

          {user ? (
            <>
              {/* User Balance Display */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(4, 41, 36, 0.9)',
                border: '1px solid rgba(255, 215, 0, 0.25)',
                padding: '6px 12px',
                borderRadius: 24,
              }}>
                <WalletIcon size={16} color="#fbbf24" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1 }}>ব্যালেন্স</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#fbbf24' }}>
                    ৳ {wallet ? Number(wallet.realBalance).toFixed(2) : '0.00'}
                  </span>
                </div>
                <button
                  onClick={onOpenDeposit}
                  title="ডিপোজিট করুন"
                  style={{
                    background: 'var(--gold-gradient)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 26,
                    height: 26,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#000',
                    marginLeft: 4,
                  }}
                >
                  <PlusCircle size={18} />
                </button>
              </div>

              {/* Withdraw Button */}
              <button
                onClick={onOpenWithdraw}
                className="secondary-btn"
                style={{ fontSize: 13, padding: '6px 12px', display: 'none', mdDisplay: 'inline-flex' }}
              >
                উইথড্র
              </button>

              {/* User Profile / Logout */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '5px 10px',
                borderRadius: 20,
              }}>
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: '#047857',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fff',
                }}>
                  {user.username ? user.username[0].toUpperCase() : 'U'}
                </div>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fff',
                  maxWidth: 90,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {user.username}
                </span>
                <button
                  onClick={onLogout}
                  title="লগআউট"
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: 2 }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Auth Buttons */}
              <button
                onClick={() => onOpenAuth('login')}
                className="secondary-btn"
                style={{ padding: '6px 14px' }}
              >
                লগইন
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="gold-btn"
                style={{ padding: '6px 16px' }}
              >
                রেজিস্ট্রেশন
              </button>
            </>
          )}

          

          {/* Download App Mini Badge */}
          <button
            onClick={() => alert('📲 CK44 Android APK ডাউনলোড শুরু হচ্ছে...')}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#fff',
              border: '1px solid rgba(110, 231, 183, 0.3)',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Download size={14} />
            <span style={{ display: 'none', smDisplay: 'inline' }}>APK</span>
          </button>
        </div>
      </div>
    </header>
  );
};
