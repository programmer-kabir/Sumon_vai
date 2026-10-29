import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
  Rocket,
  RefreshCw,
  ExternalLink,
  Globe,
  Plane,
  Flame,
  Coins,
  Volume2,
} from 'lucide-react';
import { api } from '../services/api';
import { sound } from '../services/soundService';

export const GameModal = ({ game, user, wallet, platformConfig, onClose, onWalletUpdate }) => {
  // Mode switcher: 'seamless' (Instant 0.1s Local Engine) | 'official' (Official Pragmatic Play Server)
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('ck44_game_mode') || 'seamless';
  });

  const handleSetMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('ck44_game_mode', mode);
  };

  // Iframe states
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  // Common Betting State
  const [betAmount, setBetAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);

  // ================= CRASH GAME STATES =================
  const [gameState, setGameState] = useState('IDLE'); // 'IDLE', 'FLYING', 'WON', 'CRASHED'
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(2.0);
  const [currentRoundId, setCurrentRoundId] = useState('');
  const [winAmount, setWinAmount] = useState(0);
  const [hasCashedOut50, setHasCashedOut50] = useState(false);
  const [cashout50Win, setCashout50Win] = useState(0);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(false);
  const [pastRounds, setPastRounds] = useState([
    { mult: 2.45, type: 'mid' },
    { mult: 1.15, type: 'low' },
    { mult: 8.64, type: 'high' },
    { mult: 1.05, type: 'low' },
    { mult: 3.2, type: 'mid' },
    { mult: 14.8, type: 'mega' },
    { mult: 1.92, type: 'mid' },
    { mult: 4.5, type: 'mid' },
  ]);

  // ================= SLOT GAME STATES =================
  const [slotSpinning, setSlotSpinning] = useState(false);
  const [slotResult, setSlotResult] = useState(null); // { won: bool, winAmount: num, multiplier: num, message: str }

  // Game-specific symbol palettes for Slot Machine
  const getSlotSymbols = () => {
    const code = game?.code || '';
    if (code.includes('olympus')) {
      return ['⚡', '👑', '💎', '🏆', '⏳', '💍', '7️⃣'];
    }
    if (code.includes('sweet') || code.includes('sugar')) {
      return ['🍭', '🍬', '🍇', '🍉', '🍓', '🍒', '💣'];
    }
    if (code.includes('bigbass') || game?.category === 'fishing') {
      return ['🐟', '🎣', '🧰', '🛥️', '💰', '🌊', '🪙'];
    }
    if (code.includes('doghouse')) {
      return ['🐶', '🦴', '🏠', '🎾', '🐾', '💎', '7️⃣'];
    }
    if (code.includes('cleocatra')) {
      return ['🐱', '🏺', '👑', '🐍', '💎', '☀️', '7️⃣'];
    }
    return ['7️⃣', '🔔', '💎', '🍒', '🍀', '👑', '⭐'];
  };

  const [reels, setReels] = useState(['⚡', '👑', '💎']);

  useEffect(() => {
    const syms = getSlotSymbols();
    setReels([syms[0], syms[1], syms[2]]);
    setIframeLoading(true);
    setIframeKey((k) => k + 1);
  }, [game?.code]);

  // Add Log to Webhook Inspector
  const addLog = (type, title, data) => {
    setLogs((prev) => [
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        type,
        title,
        data: JSON.stringify(data),
      },
      ...prev.slice(0, 10),
    ]);
  };

  // Determine Game Identity & Theme
  const isCrashGame = game?.category === 'crash';
  const isAviatorPlane = game?.code === 'pragmatic_highflyer' || game?.name?.toLowerCase().includes('aviator');
  const isBigBassCrash = game?.code === 'pragmatic_bigbasscrash';
  const isSpaceman = game?.code === 'pragmatic_spaceman';

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

  // Official Demo Iframe URL
  const officialIframeUrl = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=USD&gameSymbol=${game?.gameSymbol || '1301'}&jurisdiction=99`;

  // ================= CRASH BETTING LOGIC =================
  const handlePlaceBet = async () => {
    if (!user) {
      alert('বেট ধরার জন্য অনুগ্রহ করে প্রথমে লগইন করুন।');
      return;
    }

    if (wallet && wallet.realBalance < betAmount) {
      alert('অপর্যাপ্ত ব্যালেন্স! অনুগ্রহ করে ডিপোজিট করুন।');
      return;
    }

    setLoading(true);
    setHasCashedOut50(false);
    setCashout50Win(0);
    setWinAmount(0);
    const roundId = `RND_${game?.code?.toUpperCase() || 'CRASH'}_${Date.now()}`;
    const txId = `TX_DEBIT_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    setCurrentRoundId(roundId);

    try {
      const res = await api.seamlessDebit({
        txId,
        userId: user._id,
        providerId: game?.provider || 'Pragmatic Play',
        gameCode: game?.code || 'pragmatic_spaceman',
        roundId,
        amount: betAmount,
      });

      addLog('DEBIT', `POST /api/seamless/debit (-৳${betAmount})`, res);
      onWalletUpdate();
      sound.playBetSound();

      // Crash Point Probability distribution governed by Admin RTP Mode
      const rtpMode = platformConfig?.houseRtpMode || 'STANDARD';
      const rand = Math.random();
      let target;

      if (rtpMode.includes('HIGH_PROFIT')) {
        // High Profit Mode (88% RTP) -> 26% instant crash < 1.18x, tighter multipliers
        if (rand < 0.26) {
          target = 1.0 + Math.random() * 0.18;
        } else if (rand < 0.8) {
          target = 1.2 + Math.random() * 1.6;
        } else if (rand < 0.96) {
          target = 2.8 + Math.random() * 3.0;
        } else {
          target = 6.0 + Math.random() * 8.0;
        }
      } else if (rtpMode.includes('PROMO_BOOST')) {
        // Promo Boost (98.5% RTP) -> Low instant crash, higher payouts
        if (rand < 0.04) {
          target = 1.0 + Math.random() * 0.15;
        } else if (rand < 0.5) {
          target = 1.5 + Math.random() * 3.0;
        } else if (rand < 0.85) {
          target = 4.0 + Math.random() * 8.0;
        } else {
          target = 12.0 + Math.random() * 30.0;
        }
      } else {
        // STANDARD_96 (96.5% RTP)
        if (rand < 0.1) {
          target = 1.0 + Math.random() * 0.2;
        } else if (rand < 0.65) {
          target = 1.25 + Math.random() * 2.5;
        } else if (rand < 0.9) {
          target = 3.5 + Math.random() * 6.0;
        } else {
          target = 10.0 + Math.random() * 25.0;
        }
      }
      target = Number(target.toFixed(2));
      setCrashPoint(target);

      setMultiplier(1.0);
      setGameState('FLYING');
    } catch (err) {
      addLog('ERROR', 'Debit Failed', { error: err.message });
      alert(`বেট ব্যর্থ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Crash Flying interval loop
  useEffect(() => {
    let interval;
    if (gameState === 'FLYING') {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const currentM = Number((1.0 + Math.pow(elapsed * 0.45, 1.45)).toFixed(2));

        if (currentM >= crashPoint) {
          clearInterval(interval);
          setMultiplier(crashPoint);
          setGameState('CRASHED');
          sound.playCrashSound();
          addLog('CRASH', `💥 Crashed @ ${crashPoint}x`, { roundId: currentRoundId, crashedAt: crashPoint });

          const type = crashPoint >= 10 ? 'mega' : crashPoint >= 3 ? 'high' : crashPoint >= 1.5 ? 'mid' : 'low';
          setPastRounds((prev) => [{ mult: crashPoint, type }, ...prev.slice(0, 9)]);
        } else {
          setMultiplier(currentM);

          if (autoCashoutEnabled && currentM >= autoCashout && !hasCashedOut50) {
            handleCashoutFull(currentM);
          }
        }
      }, 60);
    }
    return () => clearInterval(interval);
  }, [gameState, crashPoint, autoCashoutEnabled, autoCashout, hasCashedOut50]);

  // Crash 50% Cashout
  const handleCashout50 = async () => {
    if (gameState !== 'FLYING' || hasCashedOut50) return;

    setLoading(true);
    const halfBet = Number((betAmount / 2).toFixed(2));
    const wonHalf = Number((halfBet * multiplier).toFixed(2));
    setCashout50Win(wonHalf);
    setHasCashedOut50(true);

    const txId = `TX_CREDIT_50_${Date.now()}`;
    try {
      const res = await api.seamlessCredit({
        txId,
        userId: user._id,
        providerId: game?.provider || 'Pragmatic Play',
        gameCode: game?.code || 'pragmatic_spaceman',
        roundId: currentRoundId,
        amount: wonHalf,
      });

      addLog('CREDIT_50', `৫০% ক্যাশআউট (+৳${wonHalf}) @ ${multiplier}x`, res);
      sound.playWinSound();
      onWalletUpdate();
    } catch (err) {
      alert(`৫০% ক্যাশআউট ব্যর্থ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Crash Full Cashout
  const handleCashoutFull = async (multOverride) => {
    if (gameState !== 'FLYING') return;

    setLoading(true);
    const activeMult = multOverride || multiplier;
    const remainingBet = hasCashedOut50 ? Number((betAmount / 2).toFixed(2)) : betAmount;
    const finalWin = Number((remainingBet * activeMult).toFixed(2));
    const totalWon = Number((finalWin + cashout50Win).toFixed(2));
    setWinAmount(totalWon);

    const txId = `TX_CREDIT_FULL_${Date.now()}`;
    try {
      const res = await api.seamlessCredit({
        txId,
        userId: user._id,
        providerId: game?.provider || 'Pragmatic Play',
        gameCode: game?.code || 'pragmatic_spaceman',
        roundId: currentRoundId,
        amount: finalWin,
      });

      addLog('CREDIT_FULL', `ফুল ক্যাশআউট (+৳${finalWin}) @ ${activeMult}x`, res);
      setGameState('WON');
      if (activeMult >= 8) {
        sound.playJackpotSound();
      } else {
        sound.playWinSound();
      }
      onWalletUpdate();

      const type = activeMult >= 10 ? 'mega' : activeMult >= 3 ? 'high' : activeMult >= 1.5 ? 'mid' : 'low';
      setPastRounds((prev) => [{ mult: activeMult, type }, ...prev.slice(0, 9)]);
    } catch (err) {
      alert(`ক্যাশআউট ব্যর্থ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ================= SLOT MACHINE SPIN LOGIC =================
  const handleSpinSlot = async () => {
    if (!user) {
      alert('স্পিন করার জন্য অনুগ্রহ করে প্রথমে লগইন করুন।');
      return;
    }

    if (wallet && wallet.realBalance < betAmount) {
      alert('অপর্যাপ্ত ব্যালেন্স! অনুগ্রহ করে ডিপোজিট করুন।');
      return;
    }

    if (slotSpinning) return;

    setSlotSpinning(true);
    setSlotResult(null);

    const roundId = `RND_SLOT_${Date.now()}`;
    const txId = `TX_DEBIT_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    try {
      // 1. Debit Bet from Wallet
      const res = await api.seamlessDebit({
        txId,
        userId: user._id,
        providerId: game?.provider || 'Pragmatic Play',
        gameCode: game?.code || 'pragmatic_olympus',
        roundId,
        amount: betAmount,
      });

      addLog('DEBIT', `POST /api/seamless/debit (-৳${betAmount})`, res);
      onWalletUpdate();
      sound.playBetSound();

      // 2. Animate Reel spinning for 1.4 seconds
      const symbols = getSlotSymbols();
      const spinInterval = setInterval(() => {
        setReels([
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ]);
      }, 70);

      setTimeout(async () => {
        clearInterval(spinInterval);

        // Calculate Slot Result Probability based on Admin House RTP Mode
        const rtpMode = platformConfig?.houseRtpMode || 'STANDARD';
        let hitMegaProb = 0.35;
        let hitMiniProb = 0.65;
        if (rtpMode.includes('HIGH_PROFIT')) {
          hitMegaProb = 0.22;
          hitMiniProb = 0.50;
        } else if (rtpMode.includes('PROMO_BOOST')) {
          hitMegaProb = 0.44;
          hitMiniProb = 0.75;
        }

        const roll = Math.random();
        let finalReels;
        let winMultiplier = 0;

        if (roll < hitMegaProb) {
          // Mega match win
          const luckySym = symbols[Math.floor(Math.random() * 3)]; // Pick one of top 3 symbols
          finalReels = [luckySym, luckySym, luckySym];

          if (luckySym === symbols[0]) winMultiplier = 15.0; // Mega Symbol (e.g. ⚡ or 🍭)
          else if (luckySym === symbols[1]) winMultiplier = 8.0;
          else winMultiplier = 4.0;
        } else if (roll < hitMiniProb) {
          // 2-matching symbols (small win)
          const symA = symbols[Math.floor(Math.random() * symbols.length)];
          const symB = symbols[Math.floor(Math.random() * symbols.length)];
          finalReels = [symA, symA, symB];
          winMultiplier = 1.5;
        } else {
          // No win
          const symA = symbols[0];
          const symB = symbols[2];
          const symC = symbols[4];
          finalReels = [symA, symB, symC];
          winMultiplier = 0;
        }

        setReels(finalReels);

        if (winMultiplier > 0) {
          const wonCash = Number((betAmount * winMultiplier).toFixed(2));
          const creditTxId = `TX_CREDIT_SLOT_${Date.now()}`;

          try {
            const creditRes = await api.seamlessCredit({
              txId: creditTxId,
              userId: user._id,
              providerId: game?.provider || 'Pragmatic Play',
              gameCode: game?.code || 'pragmatic_olympus',
              roundId,
              amount: wonCash,
            });

            addLog('CREDIT', `🎉 স্পিন উইন! (+৳${wonCash}) [${winMultiplier}x]`, creditRes);
            onWalletUpdate();
            if (winMultiplier >= 8) {
              sound.playJackpotSound();
            } else {
              sound.playWinSound();
            }
            setSlotResult({
              won: true,
              winAmount: wonCash,
              multiplier: winMultiplier,
              message: `অভিনন্দন! আপনি পেয়েছেন ${winMultiplier}x মেগা জ্যাকপট (+৳${wonCash})!`,
            });
          } catch (creditErr) {
            alert(`উইনিং যোগ করতে সমস্যা: ${creditErr.message}`);
          }
        } else {
          sound.playCrashSound();
          setSlotResult({
            won: false,
            winAmount: 0,
            multiplier: 0,
            message: 'কোনো ম্যাচ মেলেনি। পরবর্তী স্পিনে জ্যাকপট ট্রাই করুন!',
          });
        }

        setSlotSpinning(false);
      }, 1400);
    } catch (err) {
      addLog('ERROR', 'Debit Failed', { error: err.message });
      alert(`স্পিন ব্যর্থ: ${err.message}`);
      setSlotSpinning(false);
    }
  };

  const progressRatio = Math.min(Math.max((multiplier - 1.0) / 8.0, 0), 1);
  const astroX = 15 + progressRatio * 55;
  const astroY = 70 - progressRatio * 45;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
      }}
    >
      <div
        style={{
          background: '#0a081e',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: 18,
          width: '100%',
          maxWidth: viewMode === 'official' ? 960 : 780,
          maxHeight: '96vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(124, 58, 237, 0.25)',
          transition: 'max-width 0.3s ease',
        }}
      >
        {/* Top Header: Game Branding, Mode Switcher & Wallet */}
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
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(236, 72, 153, 0.6)',
                fontSize: 18,
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
                    padding: '1px 6px',
                    borderRadius: 4,
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                  }}
                >
                  {game?.provider || 'PRAGMATIC PLAY'}
                </span>
              </div>
              <div style={{ fontSize: 10, color: '#a78bfa' }}>
                {viewMode === 'official'
                  ? `🌐 অফিশিয়াল ${game?.provider || 'Pragmatic Play'} ডেমো সার্ভার`
                  : '⚡ B2B Seamless রিয়েল-মানি ইঞ্জিন'}
              </div>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 20,
              padding: 3,
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            <button
              onClick={() => handleSetMode('seamless')}
              style={{
                background: viewMode === 'seamless' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                color: viewMode === 'seamless' ? '#fff' : '#94a3b8',
                border: 'none',
                borderRadius: 16,
                padding: '5px 12px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Zap size={13} />
              <span>⚡ Seamless ওয়ালেট (তাৎক্ষণিক)</span>
            </button>

            <button
              onClick={() => handleSetMode('official')}
              style={{
                background: viewMode === 'official' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                color: viewMode === 'official' ? '#fff' : '#94a3b8',
                border: 'none',
                borderRadius: 16,
                padding: '5px 12px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Globe size={13} />
              <span>🌐 অফিসিয়াল ৩D সার্ভার</span>
            </button>
          </div>

          {/* User Wallet Balance & Window Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '5px 12px',
                borderRadius: 20,
                border: '1px solid rgba(251, 191, 36, 0.35)',
                fontSize: 13,
                fontWeight: 800,
                color: '#fbbf24',
              }}
            >
              ৳ {wallet ? Number(wallet.realBalance).toFixed(2) : '0.00'}
            </div>

            {viewMode === 'official' && (
              <button
                onClick={() => window.open(officialIframeUrl, '_blank')}
                title="নতুন ট্যাবে ফুলস্ক্রিন খেলুন"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fbbf24',
                  borderRadius: 8,
                  padding: '5px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ExternalLink size={15} />
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* 🌟 OPTION A: OFFICIAL PRAGMATIC PLAY HTML5 DEMO SERVER (IFRAME) */}
        {viewMode === 'official' && (
          <div style={{ position: 'relative', width: '100%', height: 550, background: '#000', display: 'flex', flexDirection: 'column' }}>
            {/* Quick Switch Helper Banner */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '7px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
                fontSize: 11,
                color: '#6ee7b7',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={14} color="#10b981" />
                <span>
                  অফিসিয়াল ৩D সার্ভারের ভারী গ্রাফিক্স (৫০+ MB) ডাউনলোড হচ্ছে। <strong>বিনা দেরিতে সাথে সাথে খেলতে চান?</strong>
                </span>
              </div>
              <button
                onClick={() => handleSetMode('seamless')}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 14,
                  padding: '4px 12px',
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)',
                }}
              >
                <span>⚡ Seamless ইনস্ট্যান্ট মোড (০ সেকেন্ড)</span>
              </button>
            </div>

            <div style={{ position: 'relative', flex: 1, width: '100%' }}>
              {iframeLoading && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#0a081e',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    color: '#fff',
                    zIndex: 10,
                  }}
                >
                  <div style={{ fontSize: 42 }}>{getGameIcon()}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#c084fc' }}>
                    {game?.provider || 'Pragmatic Play'} অফিসিয়াল সার্ভার থেকে {game?.name} লোড হচ্ছে...
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    লাইভ ৩D গ্রাফিক্স ও সাউন্ড কানেক্ট হচ্ছে...
                  </div>
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
                allow="autoplay; fullscreen; encrypted-media; screen-wake-lock"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* 🌟 OPTION B: SEAMLESS WALLET INTERACTIVE ENGINE (DIRECT MONGODB REAL-MONEY MODE) */}
        {viewMode === 'seamless' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            {/* 🚀 B1. CRASH GAME ENGINE (Aviator, Spaceman, Big Bass Crash) */}
            {isCrashGame ? (
              <>
                {/* Recent Multipliers Bar */}
                <div
                  style={{
                    background: 'rgba(10, 8, 25, 0.9)',
                    borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
                    padding: '6px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: '#94a3b8',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginRight: 4,
                    }}
                  >
                    হিস্টোরি:
                  </span>
                  {pastRounds.map((r, i) => {
                    let bg = 'rgba(239, 68, 68, 0.2)';
                    let color = '#f87171';
                    let border = 'rgba(239, 68, 68, 0.3)';

                    if (r.type === 'mid') {
                      bg = 'rgba(16, 185, 129, 0.2)';
                      color = '#34d399';
                      border = 'rgba(16, 185, 129, 0.3)';
                    } else if (r.type === 'high') {
                      bg = 'rgba(245, 158, 11, 0.2)';
                      color = '#fbbf24';
                      border = 'rgba(245, 158, 11, 0.4)';
                    } else if (r.type === 'mega') {
                      bg = 'rgba(168, 85, 247, 0.3)';
                      color = '#c084fc';
                      border = 'rgba(168, 85, 247, 0.5)';
                    }

                    return (
                      <span
                        key={i}
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 12,
                          background: bg,
                          color,
                          border: `1px solid ${border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {r.mult.toFixed(2)}x
                      </span>
                    );
                  })}
                </div>

                {/* Central Crash Flight Arena */}
                <div
                  style={{
                    position: 'relative',
                    height: 250,
                    background: isAviatorPlane
                      ? 'radial-gradient(ellipse at 50% 80%, #7f1d1d 0%, #200505 70%, #0a0101 100%)'
                      : isBigBassCrash
                      ? 'radial-gradient(ellipse at 50% 80%, #0369a1 0%, #082f49 70%, #02131f 100%)'
                      : 'radial-gradient(ellipse at 50% 80%, #2e1065 0%, #0c0827 70%, #050314 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  {/* Decorative Glow */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -30,
                      left: -30,
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: isAviatorPlane
                        ? 'radial-gradient(circle, #dc2626 0%, #7f1d1d 70%)'
                        : isBigBassCrash
                        ? 'radial-gradient(circle, #0284c7 0%, #0369a1 70%)'
                        : 'radial-gradient(circle, #7c3aed 0%, #3b0764 70%)',
                      boxShadow: '0 0 35px rgba(220, 38, 38, 0.6)',
                      opacity: 0.6,
                    }}
                  />

                  {/* Flying Object Representation */}
                  {gameState === 'FLYING' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${astroX}%`,
                        top: `${astroY}%`,
                        transform: 'translate(-50%, -50%)',
                        transition: 'all 0.15s ease-out',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: isAviatorPlane ? 46 : 42,
                          filter: isAviatorPlane
                            ? 'drop-shadow(0 0 16px rgba(239, 68, 68, 0.9))'
                            : 'drop-shadow(0 0 16px rgba(192, 132, 252, 0.9))',
                          transform: isAviatorPlane ? 'rotate(-15deg)' : 'rotate(-25deg)',
                        }}
                      >
                        {isAviatorPlane ? '✈️' : isBigBassCrash ? '🎣' : '🧑‍🚀'}
                      </div>
                      <div
                        style={{
                          width: 14,
                          height: 22,
                          background: isAviatorPlane
                            ? 'linear-gradient(to bottom, #ef4444, #f59e0b, #fbbf24)'
                            : 'linear-gradient(to bottom, #38bdf8, #f43f5e, #fbbf24)',
                          borderRadius: '50%',
                          filter: 'blur(2px)',
                          marginTop: -8,
                          boxShadow: '0 0 15px #f43f5e, 0 0 25px #38bdf8',
                        }}
                      />
                    </div>
                  )}

                  {/* Crashed State */}
                  {gameState === 'CRASHED' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${astroX}%`,
                        top: `${astroY}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 38, opacity: 0.7 }}>{isAviatorPlane ? '💥' : '🪂'}</div>
                      <div style={{ fontSize: 10, color: '#f87171', fontWeight: 800, marginTop: -4 }}>CRASHED</div>
                    </div>
                  )}

                  {/* Center Multiplier Display */}
                  <div style={{ zIndex: 5, textAlign: 'center' }}>
                    {gameState === 'FLYING' && (
                      <div>
                        <div
                          style={{
                            fontSize: 56,
                            fontWeight: 900,
                            color: multiplier >= 10 ? '#c084fc' : multiplier >= 3 ? '#fbbf24' : '#fff',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            textShadow:
                              multiplier >= 10
                                ? '0 0 30px rgba(192, 132, 252, 0.9)'
                                : '0 0 25px rgba(251, 191, 36, 0.7)',
                          }}
                        >
                          {multiplier.toFixed(2)}x
                        </div>
                        <div
                          style={{
                            color: '#c4b5fd',
                            fontSize: 12,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                          }}
                        >
                          {isAviatorPlane
                            ? '✈️ এভিয়েটর জেট আকাশে উড়ছে...'
                            : isBigBassCrash
                            ? '🎣 বিগ বাস বোট নেট টানছে...'
                            : '🚀 স্পেসম্যান মহাকাশে উড়ছে...'}
                        </div>
                      </div>
                    )}

                    {gameState === 'CRASHED' && (
                      <div>
                        <div style={{ fontSize: 44, fontWeight: 900, color: '#ef4444' }}>
                          💥 CRASHED @ {multiplier.toFixed(2)}x
                        </div>
                        <div style={{ color: '#cbd5e1', fontSize: 12, marginTop: 4 }}>
                          {hasCashedOut50
                            ? `আপনি ৫০% ক্যাশআউটে ৳${cashout50Win} জিতেছেন!`
                            : 'পরবর্তী রাউন্ডের জন্য নিচে বাজি নিশ্চিত করুন।'}
                        </div>
                      </div>
                    )}

                    {gameState === 'WON' && (
                      <div>
                        <div style={{ fontSize: 18, color: '#34d399', fontWeight: 800 }}>
                          🎉 অভিনন্দন! আপনি জিতেছেন!
                        </div>
                        <div
                          style={{
                            fontSize: 48,
                            fontWeight: 900,
                            color: '#ffd700',
                            textShadow: '0 0 30px rgba(255, 215, 0, 0.8)',
                          }}
                        >
                          +৳ {winAmount}
                        </div>
                        <div style={{ fontSize: 12, color: '#cbd5e1' }}>
                          ক্যাশআউট হয়েছে @ {multiplier.toFixed(2)}x
                        </div>
                      </div>
                    )}

                    {gameState === 'IDLE' && (
                      <div style={{ color: '#a78bfa' }}>
                        <div style={{ fontSize: 34, marginBottom: 4 }}>{getGameIcon()}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>পরবর্তী রাউন্ড শুরু হচ্ছে</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                          আপনার বাজি নির্বাচন করে "বেট ধরুন" বাটনে চাপ দিন।
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Crash Controls Panel */}
                <div style={{ padding: '14px 18px', background: 'rgba(15, 12, 38, 0.98)' }}>
                  {/* Quick Bet Chips */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 6,
                      marginBottom: 10,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>কুইক বেট:</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[50, 100, 250, 500, 1000].map((amt) => (
                        <button
                          key={amt}
                          disabled={gameState === 'FLYING'}
                          onClick={() => setBetAmount(amt)}
                          style={{
                            background:
                              betAmount === amt
                                ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                                : 'rgba(255, 255, 255, 0.06)',
                            border: betAmount === amt ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.1)',
                            color: betAmount === amt ? '#fff' : '#cbd5e1',
                            borderRadius: 8,
                            padding: '4px 10px',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          ৳{amt}
                        </button>
                      ))}
                      <button
                        disabled={gameState === 'FLYING'}
                        onClick={() => setBetAmount((prev) => Math.max(50, Math.floor(prev / 2)))}
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#94a3b8',
                          borderRadius: 8,
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ½x
                      </button>
                      <button
                        disabled={gameState === 'FLYING'}
                        onClick={() => setBetAmount((prev) => prev * 2)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#94a3b8',
                          borderRadius: 8,
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        2x
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons: 50% Cashout & Full Cashout */}
                  {gameState === 'FLYING' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 10 }}>
                      <button
                        onClick={handleCashout50}
                        disabled={loading || hasCashedOut50}
                        style={{
                          background: hasCashedOut50
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#fff',
                          border: hasCashedOut50 ? '1px solid #10b981' : 'none',
                          borderRadius: 12,
                          padding: '12px 10px',
                          fontSize: 13,
                          fontWeight: 900,
                          cursor: hasCashedOut50 ? 'not-allowed' : 'pointer',
                          boxShadow: hasCashedOut50 ? 'none' : '0 0 20px rgba(245, 158, 11, 0.5)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {hasCashedOut50 ? (
                          <>
                            <span style={{ fontSize: 12, color: '#34d399' }}>৫০% ক্যাশআউট ডান ✅</span>
                            <span style={{ fontSize: 10, color: '#6ee7b7' }}>+৳ {cashout50Win} সুরক্ষিত</span>
                          </>
                        ) : (
                          <>
                            <span>৫০% ক্যাশআউট</span>
                            <span style={{ fontSize: 12, color: '#fef08a' }}>
                              +৳ {Number(((betAmount / 2) * multiplier).toFixed(2))}
                            </span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCashoutFull()}
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 12,
                          padding: '12px 10px',
                          fontSize: 15,
                          fontWeight: 900,
                          cursor: 'pointer',
                          boxShadow: '0 0 25px rgba(16, 185, 129, 0.7)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span>ক্যাশআউট (ফুল)</span>
                        <span style={{ fontSize: 13, color: '#d1fae5' }}>
                          +৳{' '}
                          {hasCashedOut50
                            ? Number(((betAmount / 2) * multiplier).toFixed(2))
                            : Number((betAmount * multiplier).toFixed(2))}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                      <div
                        style={{
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: 10,
                          padding: '6px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: 10, color: '#94a3b8' }}>বাজির পরিমাণ (টাকা):</span>
                        <input
                          type="number"
                          value={betAmount}
                          onChange={(e) => setBetAmount(Math.max(50, Number(e.target.value)))}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ffd700',
                            fontSize: 17,
                            fontWeight: 900,
                            outline: 'none',
                            width: '100%',
                          }}
                        />
                      </div>

                      <button
                        onClick={handlePlaceBet}
                        disabled={loading}
                        style={{
                          background: isAviatorPlane
                            ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                            : 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 12,
                          padding: '12px',
                          fontSize: 16,
                          fontWeight: 900,
                          cursor: 'pointer',
                          boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                        }}
                      >
                        {isAviatorPlane ? <Plane size={18} /> : <Rocket size={18} />}
                        <span>{loading ? 'বেট হচ্ছে...' : `বেট ধরুন (৳${betAmount})`}</span>
                      </button>
                    </div>
                  )}

                  {/* Auto Cashout Config */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 10,
                      paddingTop: 8,
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: 11,
                      color: '#94a3b8',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={autoCashoutEnabled}
                          onChange={(e) => setAutoCashoutEnabled(e.target.checked)}
                        />
                        <span>অটো-ক্যাশআউট:</span>
                      </label>
                      {autoCashoutEnabled && (
                        <input
                          type="number"
                          step="0.1"
                          value={autoCashout}
                          onChange={(e) => setAutoCashout(Number(e.target.value))}
                          style={{
                            width: 50,
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid #8b5cf6',
                            borderRadius: 4,
                            color: '#fff',
                            padding: '1px 4px',
                            fontSize: 11,
                            textAlign: 'center',
                          }}
                        />
                      )}
                    </div>

                    <button
                      onClick={() => setShowLogs(!showLogs)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#a78bfa',
                        cursor: 'pointer',
                        fontSize: 11,
                        textDecoration: 'underline',
                      }}
                    >
                      {showLogs ? 'লগ লুকান 🔼' : 'লাইভ Seamless API লগ দেখুন 🔽'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* 🎰 B2. INTERACTIVE SEAMLESS SLOT REEL ENGINE (Gates of Olympus, Sweet Bonanza, etc.) */
              <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 20px' }}>
                {/* Slot Machine Cabinet Header */}
                <div
                  style={{
                    background: 'radial-gradient(ellipse at 50% 50%, #2e1065 0%, #0d0628 100%)',
                    border: '2px solid rgba(251, 191, 36, 0.4)',
                    borderRadius: 16,
                    padding: '24px 16px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(251, 191, 36, 0.2)',
                    marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', marginBottom: 6 }}>
                    ⚡ {game?.name} Seamless Slot Studio ⚡
                  </div>
                  <div style={{ fontSize: 11, color: '#c084fc', marginBottom: 16 }}>
                    মঙ্গোডিবি ওয়ালেট থেকে সরাসরি বাজি ধরুন ও লাইভ মেগা পেআউট ক্যাশআউট নিন
                  </div>

                  {/* 3 Reels Display */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 14,
                      marginBottom: 16,
                    }}
                  >
                    {reels.map((sym, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: 80,
                          height: 90,
                          borderRadius: 12,
                          background: 'linear-gradient(180deg, #180d38 0%, #0c071d 100%)',
                          border: '2px solid rgba(251, 191, 36, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 42,
                          boxShadow: slotSpinning
                            ? '0 0 25px rgba(236, 72, 153, 0.8), inset 0 0 15px rgba(236, 72, 153, 0.4)'
                            : '0 4px 15px rgba(0, 0, 0, 0.6), inset 0 0 10px rgba(251, 191, 36, 0.2)',
                          transform: slotSpinning ? 'scale(1.04)' : 'scale(1)',
                          transition: 'all 0.1s ease',
                        }}
                      >
                        {sym}
                      </div>
                    ))}
                  </div>

                  {/* Slot Win/Loss Result Banner */}
                  {slotResult && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: slotResult.won ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                        border: slotResult.won ? '1px solid #10b981' : '1px solid rgba(239, 68, 68, 0.3)',
                        color: slotResult.won ? '#34d399' : '#f87171',
                        fontSize: 13,
                        fontWeight: 800,
                        display: 'inline-block',
                      }}
                    >
                      {slotResult.message}
                    </div>
                  )}
                </div>

                {/* Slot Machine Bet Controls */}
                <div
                  style={{
                    background: 'rgba(15, 12, 38, 0.98)',
                    borderRadius: 14,
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 6,
                      marginBottom: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>প্রতি স্পিনে বাজি:</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[50, 100, 250, 500, 1000].map((amt) => (
                        <button
                          key={amt}
                          disabled={slotSpinning}
                          onClick={() => setBetAmount(amt)}
                          style={{
                            background:
                              betAmount === amt
                                ? 'linear-gradient(135deg, #ffd700, #f59e0b)'
                                : 'rgba(255, 255, 255, 0.06)',
                            border: betAmount === amt ? '1px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.1)',
                            color: betAmount === amt ? '#000' : '#cbd5e1',
                            borderRadius: 8,
                            padding: '5px 10px',
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          ৳{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: 10,
                        padding: '6px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>বাজির পরিমাণ:</span>
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(50, Number(e.target.value)))}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ffd700',
                          fontSize: 17,
                          fontWeight: 900,
                          outline: 'none',
                          width: '100%',
                        }}
                      />
                    </div>

                    <button
                      onClick={handleSpinSlot}
                      disabled={slotSpinning}
                      style={{
                        background: slotSpinning
                          ? 'rgba(139, 92, 246, 0.3)'
                          : 'linear-gradient(135deg, #ffd700 0%, #f59e0b 50%, #d97706 100%)',
                        color: slotSpinning ? '#cbd5e1' : '#000',
                        border: 'none',
                        borderRadius: 12,
                        padding: '14px',
                        fontSize: 16,
                        fontWeight: 900,
                        cursor: slotSpinning ? 'not-allowed' : 'pointer',
                        boxShadow: slotSpinning ? 'none' : '0 0 25px rgba(245, 158, 11, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <RefreshCw size={20} className={slotSpinning ? 'spin-anim' : ''} />
                      <span>{slotSpinning ? 'স্পিন হচ্ছে...' : `স্পিন করুন (৳${betAmount})`}</span>
                    </button>
                  </div>

                  {/* Webhook Log Toggle */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: 10,
                      paddingTop: 8,
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <button
                      onClick={() => setShowLogs(!showLogs)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#a78bfa',
                        cursor: 'pointer',
                        fontSize: 11,
                        textDecoration: 'underline',
                      }}
                    >
                      {showLogs ? 'লগ লুকান 🔼' : 'লাইভ Seamless API লগ দেখুন 🔽'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Expandable Seamless Live Webhook Logs */}
            {showLogs && (
              <div
                style={{
                  margin: '0 16px 14px 16px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 8,
                  padding: 10,
                  maxHeight: 90,
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: '#34d399',
                }}
              >
                {logs.length === 0 ? (
                  <div style={{ color: '#6b7280' }}>কোনো ট্রানজেকশন লগ এখনও নেই।</div>
                ) : (
                  logs.map((l) => (
                    <div key={l.id} style={{ marginBottom: 4 }}>
                      <span style={{ color: '#94a3b8' }}>[{l.time}]</span>{' '}
                      <span style={{ color: l.type.includes('ERROR') ? '#f87171' : '#34d399' }}>{l.title}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
