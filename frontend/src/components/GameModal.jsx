import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  RefreshCw,
  Globe,
  Sparkles,
  ShieldCheck,
  Coins,
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';

export const GameModal = ({ game, user, wallet, platformConfig, onClose, onWalletUpdate }) => {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  // Seamless real-balance betting state
  const [betAmount, setBetAmount] = useState('50');
  const [betting, setBetting] = useState(false);
  const [lastOutcome, setLastOutcome] = useState(null);
  const [dockExpanded, setDockExpanded] = useState(true);

  useEffect(() => {
    setIframeLoading(true);
    setIframeKey((k) => k + 1);
    setLastOutcome(null);
  }, [game?.code]);

  // Determine Game Icon
  const isAviatorPlane = game?.code === 'pragmatic_highflyer' || game?.name?.toLowerCase().includes('aviator');
  const isBigBassCrash = game?.code === 'pragmatic_bigbasscrash';
  const isSpaceman = game?.code === 'pragmatic_spaceman';
  const isCrashGame = isAviatorPlane || isBigBassCrash || isSpaceman || game?.category === 'crash';

  const getGameIcon = () => {
    if (isAviatorPlane) return '✈️';
    if (isBigBassCrash) return '🎣';
    if (isSpaceman) return '🧑‍🚀';
    if (game?.code?.includes('olympus')) return '⚡';
    if (game?.code?.includes('sweet')) return '🍭';
    if (game?.code?.includes('sugar')) return '🍬';
    if (game?.code?.includes('starlight')) return '✨';
    if (game?.code?.includes('bigbass')) return '🐟';
    if (game?.code?.includes('doghouse')) return '🐶';
    if (game?.code?.includes('wolf')) return '🐺';
    if (game?.code?.includes('cleocatra')) return '🐱';
    return '🎰';
  };

  const getActionButtonText = () => {
    if (betting) return 'বেট প্রসেস হচ্ছে...';
    if (isAviatorPlane) return '✈️ বেট প্লেস করুন (Fly & Win)';
    if (isSpaceman) return '🚀 স্পেসম্যান লঞ্চ (Bet & Launch)';
    if (isCrashGame) return '💥 ক্র্যাশ বেট প্লেস করুন';
    if (game?.category === 'slots') return `🎰 স্পিন করুন (৳${betAmount})`;
    return `🎮 বাজি ধরুন (৳${betAmount})`;
  };

  // Official Provider HTML5 Game URL
  const officialIframeUrl = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=USD&gameSymbol=${game?.gameSymbol || '1301'}&jurisdiction=99`;

  const handleReloadGame = () => {
    setIframeLoading(true);
    setIframeKey((k) => k + 1);
  };

  const handlePlaceBet = async (e) => {
    if (e) e.preventDefault();
    const amount = Number(betAmount);
    if (!amount || amount <= 0) {
      alert('সঠিক বেট পরিমাণ লিখুন');
      return;
    }

    const currentBal = wallet ? Number(wallet.realBalance) : 1000;
    if (currentBal < amount) {
      alert('অপর্যাপ্ত ব্যালেন্স! অনুগ্রহ করে ওয়ালেটে টাকা ডিপোজিট করুন।');
      return;
    }

    setBetting(true);
    try {
      const res = await api.playGameRound({
        gameCode: game?.code || 'pragmatic_highflyer',
        betAmount: amount,
      });

      if (res.data) {
        setLastOutcome(res.data);
        if (onWalletUpdate) onWalletUpdate();
      }
    } catch (err) {
      alert(err.message || 'Bet placement failed');
    } finally {
      setBetting(false);
    }
  };

  const quickPresets = [10, 50, 100, 200, 500, 1000];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
      }}
    >
      <div
        style={{
          background: '#0a081e',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: 18,
          width: '100%',
          maxWidth: 1080,
          maxHeight: '96vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(124, 58, 237, 0.25)',
        }}
      >
        {/* Top Header: Game Branding & Controls */}
        <div
          style={{
            background: 'rgba(15, 12, 38, 0.98)',
            borderBottom: '1px solid rgba(139, 92, 246, 0.25)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {/* Brand & Game Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(236, 72, 153, 0.6)',
                fontSize: 20,
              }}
            >
              {getGameIcon()}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{game?.name || 'GAME'}</span>
                <span
                  style={{
                    background: 'rgba(236, 72, 153, 0.2)',
                    color: '#f472b6',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 4,
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                  }}
                >
                  {game?.provider || 'PRAGMATIC PLAY'}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#a78bfa',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 2,
                }}
              >
                <Globe size={11} color="#10b981" />
                <span>অফিশিয়াল {game?.provider || 'Pragmatic Play'} সার্ভার</span>
                {game?.rtp && (
                  <span style={{ color: '#34d399', marginLeft: 4, fontWeight: 700 }}>
                    • RTP: {game.rtp}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* User Wallet Balance & Action Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '5px 14px',
                borderRadius: 20,
                border: '1px solid rgba(251, 191, 36, 0.35)',
                fontSize: 13,
                fontWeight: 800,
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>৳</span>
              <span>{wallet ? Number(wallet.realBalance).toFixed(2) : '1000.00'}</span>
            </div>

            {/* Reload Game Button */}
            <button
              onClick={handleReloadGame}
              title="গেম রিলোড করুন"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                borderRadius: 8,
                padding: '6px 9px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              <RefreshCw size={15} />
            </button>

            {/* Open Fullscreen Tab Button */}
            <button
              onClick={() => window.open(officialIframeUrl, '_blank')}
              title="নতুন ট্যাবে ফুলস্ক্রিন খেলুন"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fbbf24',
                borderRadius: 8,
                padding: '6px 9px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              <ExternalLink size={15} />
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              title="বন্ধ করুন"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: 8,
                padding: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                marginLeft: 4,
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Official Game HTML5 Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: dockExpanded ? 'calc(90vh - 180px)' : 'calc(90vh - 65px)',
            minHeight: 460,
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            transition: 'height 0.3s ease',
          }}
        >
          {iframeLoading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#070614',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                color: '#fff',
                zIndex: 10,
              }}
            >
              <div style={{ fontSize: 50, filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.5))' }}>
                {getGameIcon()}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#c084fc' }}>
                {game?.provider || 'Pragmatic Play'} সার্ভার থেকে {game?.name} লোড হচ্ছে...
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                অফিসিয়াল ৩D গ্রাফিক্স ও অডিও কানেক্ট হচ্ছে...
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  border: '3px solid rgba(139, 92, 246, 0.2)',
                  borderTop: '3px solid #a855f7',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginTop: 8,
                }}
              />
            </div>
          )}

          <iframe
            key={`${game?.code}-${iframeKey}`}
            src={officialIframeUrl}
            title={game?.name || 'Official Game'}
            onLoad={() => setIframeLoading(false)}
            loading="eager"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="autoplay; fullscreen; encrypted-media; screen-wake-lock; clipboard-write"
            allowFullScreen
          />
        </div>

        {/* 🎮 Seamless Live Betting Controller Dock */}
        <div
          style={{
            background: 'rgba(10, 8, 30, 0.98)',
            borderTop: '1px solid rgba(139, 92, 246, 0.3)',
            padding: '8px 16px',
            position: 'relative',
          }}
        >
          {/* Dock Header Bar with Collapse Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: dockExpanded ? 8 : 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#fbbf24',
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                <Zap size={12} color="#fbbf24" />
                <span>Seamless Real-Balance Bet Engine</span>
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                (অ্যাডমিন লাইভ লেজার ও P&L-এ ইনস্ট্যান্ট রেকর্ড হয়)
              </span>
            </div>

            <button
              onClick={() => setDockExpanded((prev) => !prev)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a78bfa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <span>{dockExpanded ? 'হাইড ডক' : 'বেটিং প্যানেল ওপেন'}</span>
              {dockExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

          {/* Outcome Banner (Pops up when winning or losing) */}
          {lastOutcome && (
            <div
              style={{
                marginBottom: 8,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: lastOutcome.isWin
                  ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.25), rgba(6, 78, 59, 0.4))'
                  : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${lastOutcome.isWin ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.4)'}`,
                color: lastOutcome.isWin ? '#34d399' : '#f87171',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{lastOutcome.isWin ? '🏆' : '💥'}</span>
                <span>{lastOutcome.message}</span>
              </div>
              {lastOutcome.multiplier > 0 && (
                <span
                  style={{
                    background: '#047857',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontFamily: 'monospace',
                  }}
                >
                  {lastOutcome.multiplier}x
                </span>
              )}
            </div>
          )}

          {/* Expanded Bet Controls */}
          {dockExpanded && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              {/* Presets & Input */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>বেট:</span>
                {quickPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBetAmount(String(val))}
                    style={{
                      background:
                        betAmount === String(val)
                          ? 'rgba(236, 72, 153, 0.3)'
                          : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${
                        betAmount === String(val) ? '#ec4899' : 'rgba(255, 255, 255, 0.1)'
                      }`,
                      color: betAmount === String(val) ? '#fff' : '#cbd5e1',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 11,
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ৳{val}
                  </button>
                ))}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    borderRadius: 6,
                    padding: '2px 6px',
                    marginLeft: 4,
                  }}
                >
                  <span style={{ color: '#94a3b8', fontSize: 11, marginRight: 2 }}>৳</span>
                  <input
                    type="number"
                    min="1"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    style={{
                      width: 60,
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 800,
                      outline: 'none',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </div>

              {/* Big Bet Action Button */}
              <button
                onClick={handlePlaceBet}
                disabled={betting}
                style={{
                  background: isCrashGame
                    ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                    : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: betting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  opacity: betting ? 0.7 : 1,
                }}
              >
                <span>{getActionButtonText()}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
