import React from 'react';
import {
  X,
  Home,
  Flame,
  Gamepad2,
  Trophy,
  Gift,
  Crown,
  ShieldCheck,
  User,
  Wallet,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const MainSidebar = ({
  isOpen,
  onClose,
  user,
  wallet,
  onOpenAuth,
  onOpenDeposit,
  onOpenWithdraw,
  onLogout,
  onSelectCategory,
  onOpenLuckyWheel,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 90,
      display: 'flex',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Sidebar Panel */}
      <div style={{
        position: 'relative',
        width: 310,
        maxWidth: '85vw',
        height: '100%',
        background: '#021a17',
        borderRight: '1px solid rgba(255, 215, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '10px 0 35px rgba(0, 0, 0, 0.85)',
        zIndex: 10,
        animation: 'slideInLeft 0.25s ease-out',
      }}>
        {/* Header / Brand */}
        <div style={{
          padding: '16px 18px',
          background: 'rgba(4, 41, 36, 0.95)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #ffd700 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              color: '#000',
              fontSize: 16,
              boxShadow: '0 0 15px rgba(251, 191, 36, 0.5)',
            }}>
              CK
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="gold-text" style={{ fontSize: 18, letterSpacing: 1 }}>CK44</span>
                <span style={{
                  background: '#047857',
                  color: '#6ee7b7',
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '2px 5px',
                }}>PORTAL</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>নেভিগেশন ও কন্ট্রোল সাইডবার</div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Status Card */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255, 215, 0, 0.1)' }}>
          {user ? (
            <div style={{
              background: 'rgba(4, 41, 36, 0.7)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: 12,
              padding: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#047857',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 13,
                  }}>
                    {user.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                      {user.username}
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>
                      {`ভিআইপি লেভেল ${user.vipLevel || 1}`}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '6px 10px',
                borderRadius: 8,
                marginBottom: 10,
              }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>ওয়ালেট ব্যালেন্স:</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#fbbf24' }}>
                  ৳ {wallet ? Number(wallet.realBalance).toFixed(2) : '0.00'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => { onClose(); onOpenDeposit(); }}
                  className="gold-btn"
                  style={{ flex: 1, padding: '6px 8px', fontSize: 11 }}
                >
                  ডিপোজিট
                </button>
                <button
                  onClick={() => { onClose(); onOpenWithdraw(); }}
                  className="secondary-btn"
                  style={{ flex: 1, padding: '6px 8px', fontSize: 11, justifyContent: 'center' }}
                >
                  উইথড্র
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(4, 41, 36, 0.7)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: 12,
              padding: 14,
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>
                বেট ধরা ও সম্পূর্ণ ফিচার পেতে অ্যাকাউন্টে প্রবেশ করুন
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { onClose(); onOpenAuth('login'); }}
                  className="secondary-btn"
                  style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}
                >
                  লগইন
                </button>
                <button
                  onClick={() => { onClose(); onOpenAuth('register'); }}
                  className="gold-btn"
                  style={{ flex: 1, fontSize: 12 }}
                >
                  রেজিস্ট্রেশন
                </button>
              </div>
            </div>
          )}
        </div>

        

        {/* Navigation Categories */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '6px 8px' }}>
            গেমিং সেকশন
          </div>

          {[
            { id: 'all', label: 'সকল গেমস (All Games)', icon: <Gamepad2 size={16} /> },
            { id: 'crash', label: 'ক্র্যাশ ও এভিয়েটর (Aviator)', icon: <Flame size={16} color="#ef4444" />, badge: 'হট' },
            { id: 'slots', label: 'স্লটস ও জ্যাকপট (Slots)', icon: <Sparkles size={16} color="#fbbf24" />, badge: 'জনপ্রিয়' },
            { id: 'live', label: 'লাইভ ক্যাসিনো (Live Casino)', icon: <Trophy size={16} color="#10b981" /> },
            { id: 'table', label: 'টেবিল ও কার্ড গেমস', icon: <Crown size={16} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectCategory(item.id);
                onClose();
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderRadius: 8,
                padding: '10px 12px',
                color: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  background: item.badge === 'হট' ? '#ef4444' : '#f59e0b',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 800,
                  padding: '2px 6px',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div style={{ height: 1, background: 'rgba(255, 215, 0, 0.1)', margin: '12px 6px' }} />

          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '6px 8px' }}>
            অফার ও রিওয়ার্ডস
          </div>

          <button
            onClick={() => { onClose(); alert('🎁 CK44 সাপ্তাহিক ক্যাশব্যাক ও ১ম ডিপোজিটে ১০০% ওয়েলকাম বোনাস সক্রিয় রয়েছে!'); }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderRadius: 8,
              padding: '10px 12px',
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <Gift size={16} color="#fbbf24" />
            <span>প্রমোশন ও বোনাস অফার</span>
          </button>

          <button
            onClick={() => { onClose(); alert('👑 CK44 ভিআইপি ক্লাব: ডায়মন্ড মেম্বারদের জন্য আনলিমিটেড উইথড্র ও ডেডিকেটেড ম্যানেজার!'); }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderRadius: 8,
              padding: '10px 12px',
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <Crown size={16} color="#fbbf24" />
            <span>ভিআইপি ক্লাব ও সুবিধা</span>
          </button>
        </div>

        {/* Footer info */}
        {user && (
          <div style={{
            padding: '12px 18px',
            borderTop: '1px solid rgba(255, 215, 0, 0.1)',
            background: 'rgba(2, 26, 23, 0.8)',
          }}>
            <button
              onClick={() => { onClose(); onLogout(); }}
              style={{
                width: '100%',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <LogOut size={14} />
              <span>লগআউট করুন</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
