import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Gift, Crown, Trophy, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { sound } from '../services/soundService';

export const LuckyWheelModal = ({ isOpen, onClose, user, onWalletUpdate, onOpenAuth }) => {
  const [wheelStatus, setWheelStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [countdownText, setCountdownText] = useState('');
  const [confetti, setConfetti] = useState([]);
  const canvasRef = useRef(null);

  // Fetch status on open
  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setWonPrize(null);
    }
  }, [isOpen, user]);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await api.getLuckyWheelStatus();
      if (res.success) {
        setWheelStatus(res);
      }
    } catch (err) {
      console.warn('Could not fetch lucky wheel status:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cooldown countdown timer
  useEffect(() => {
    if (!wheelStatus?.nextSpinAt || wheelStatus?.canSpin) {
      setCountdownText('');
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(wheelStatus.nextSpinAt).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdownText('স্পিন করার জন্য প্রস্তুত!');
        setWheelStatus((prev) => (prev ? { ...prev, canSpin: true } : prev));
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdownText(`${hours} ঘণ্টা ${mins} মিনিট ${secs} সেকেন্ড`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [wheelStatus?.nextSpinAt]);

  const prizes = wheelStatus?.prizes?.length
    ? wheelStatus.prizes
    : [
        { id: 1, label: '৳ ১০', amount: 10, type: 'cash', color: '#10b981' },
        { id: 2, label: '৳ ২৫', amount: 25, type: 'cash', color: '#3b82f6' },
        { id: 3, label: '৳ ৫০', amount: 50, type: 'cash', color: '#8b5cf6' },
        { id: 4, label: '৳ ১০০', amount: 100, type: 'cash', color: '#ec4899' },
        { id: 5, label: '৳ ৫০০ মেগা', amount: 500, type: 'cash', color: '#f59e0b' },
        { id: 6, label: 'পরের বার', amount: 0, type: 'miss', color: '#475569' },
        { id: 7, label: '৳ ১৫ ক্যাশ', amount: 15, type: 'cash', color: '#06b6d4' },
        { id: 8, label: '৳ ২০০ গোল্ড', amount: 200, type: 'cash', color: '#eab308' },
      ];

  // Draw Wheel on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 16;
    const numSlices = prizes.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw outer gold decorative rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e1b2e';
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    // Outer LED lights around rim
    for (let i = 0; i < 24; i++) {
      const angle = (i * (2 * Math.PI)) / 24;
      const dotX = centerX + (radius + 6) * Math.cos(angle);
      const dotY = centerY + (radius + 6) * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#ffffff';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    ctx.restore();

    // 2. Draw Slices
    for (let i = 0; i < numSlices; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const prize = prizes[i];

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color || '#334155';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();

      // Label text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(prize.label, radius - 24, 6);

      // Icon symbol
      ctx.font = '13px sans-serif';
      ctx.fillText(prize.amount > 0 ? '🪙' : '🍀', radius - 90, 5);
      ctx.restore();

      ctx.restore();
    }

    // 3. Center Hub Base
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 38, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#d97706';
    ctx.fill();
    ctx.restore();
  }, [prizes]);

  // Handle Wheel Spin
  const handleSpin = async () => {
    if (!user) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }

    if (spinning || !wheelStatus?.canSpin) return;

    setSpinning(true);
    setWonPrize(null);
    setConfetti([]);

    try {
      const res = await api.spinLuckyWheel();

      if (!res.success) {
        alert(res.message || 'স্পিন ব্যর্থ হয়েছে।');
        setSpinning(false);
        return;
      }

      const prizeIndex = res.prizeIndex;
      const numSlices = prizes.length;
      const sliceDeg = 360 / numSlices;

      // Pointer is at the top (270 degrees in canvas coordinates)
      // We want slice `prizeIndex` to align with the top needle
      const targetSliceCenterDeg = prizeIndex * sliceDeg + sliceDeg / 2;
      const stopAtDeg = (270 - targetSliceCenterDeg + 360) % 360;

      // Add 6 full spins for dynamic suspense
      const fullSpins = 6 * 360;
      const currentRotationMod = rotation % 360;
      const finalRotation = rotation + (360 - currentRotationMod) + fullSpins + stopAtDeg;

      setRotation(finalRotation);

      // Sound ticker loop
      let tickCount = 0;
      const tickInterval = setInterval(() => {
        sound.playWheelTickSound();
        tickCount++;
        if (tickCount > 35) clearInterval(tickInterval);
      }, 110);

      // Wheel lands after 4.5 seconds
      setTimeout(() => {
        clearInterval(tickInterval);
        setSpinning(false);
        setWonPrize(res.prize);

        if (res.prize?.amount > 0) {
          if (res.prize.amount >= 100) {
            sound.playJackpotSound();
          } else {
            sound.playWinSound();
          }
          // Confetti particles
          const parts = Array.from({ length: 30 }, (_, idx) => ({
            id: idx,
            x: Math.random() * 100,
            y: Math.random() * 50,
            color: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'][idx % 5],
            size: Math.random() * 8 + 6,
          }));
          setConfetti(parts);
        } else {
          sound.playCrashSound();
        }

        // Update wheel status to prevent duplicate spins
        setWheelStatus((prev) => ({
          ...prev,
          canSpin: false,
          nextSpinAt: res.nextSpinAt,
          totalWins: (prev?.totalWins || 0) + (res.prize?.amount || 0),
        }));

        if (onWalletUpdate) onWalletUpdate();
      }, 4500);
    } catch (err) {
      alert(`স্পিন করতে সমস্যা: ${err.message}`);
      setSpinning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !spinning) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'linear-gradient(180deg, #131722 0%, #0c0e17 100%)',
          borderRadius: 24,
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(245, 158, 11, 0.15)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 20px',
        }}
      >
        {/* Confetti Animation Overlay */}
        {confetti.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              top: `${p.y}%`,
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.id % 2 === 0 ? '50%' : '2px',
              opacity: 0.9,
              animation: 'bounce 1s infinite alternate',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        ))}

        {/* Header */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
              }}
            >
              <Gift size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                ডেইলি লাকি স্পিন <Sparkles size={16} color="#f59e0b" />
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                প্রতি ২৪ ঘণ্টায় ১টি ফ্রি স্পিন ও নিশ্চিত ক্যাশ প্রাইজ
              </p>
            </div>
          </div>
          <button
            onClick={() => !spinning && onClose()}
            disabled={spinning}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: 34,
              height: 34,
              cursor: spinning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Wheel Container */}
        <div
          style={{
            position: 'relative',
            width: 340,
            height: 340,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px 0 20px',
          }}
        >
          {/* Top Pointer / Needle Indicator */}
          <div
            style={{
              position: 'absolute',
              top: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              width: 0,
              height: 0,
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderTop: '28px solid #ef4444',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6)) drop-shadow(0 0 6px #ef4444)',
            }}
          />

          {/* Rotating Wheel Canvas */}
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4.5s cubic-bezier(0.12, 0.88, 0.24, 1)' : 'none',
              filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.7))',
            }}
          />

          {/* Center Spin Button */}
          <button
            onClick={handleSpin}
            disabled={spinning || (user && !wheelStatus?.canSpin)}
            style={{
              position: 'absolute',
              width: 76,
              height: 76,
              borderRadius: '50%',
              background:
                spinning || (user && !wheelStatus?.canSpin)
                  ? 'linear-gradient(135deg, #475569, #334155)'
                  : 'linear-gradient(135deg, #f59e0b, #b45309)',
              border: '3px solid #fef08a',
              color: '#fff',
              fontWeight: 900,
              fontSize: 15,
              cursor: spinning || (user && !wheelStatus?.canSpin) ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.6)',
              zIndex: 15,
              transition: 'all 0.2s ease',
            }}
          >
            <Crown size={16} />
            <span>{spinning ? 'ঘুরছে..' : 'SPIN'}</span>
          </button>
        </div>

        {/* Won Prize Celebration Card */}
        {wonPrize && (
          <div
            style={{
              width: '100%',
              background:
                wonPrize.amount > 0
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 78, 59, 0.3))'
                  : 'linear-gradient(135deg, rgba(100, 116, 139, 0.2), rgba(30, 41, 59, 0.3))',
              border: wonPrize.amount > 0 ? '1px solid #10b981' : '1px solid #64748b',
              borderRadius: 16,
              padding: '12px 16px',
              textAlign: 'center',
              marginBottom: 16,
              animation: 'fadeIn 0.4s ease',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>
              {wonPrize.amount > 0 ? '🎉 🏆 💰' : '🍀 🌟'}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: wonPrize.amount > 0 ? '#34d399' : '#cbd5e1' }}>
              {wonPrize.amount > 0 ? `অভিনন্দন! আপনি জিতেছেন ${wonPrize.label}` : 'পরবর্তী স্পিনের জন্য শুভকামনা!'}
            </div>
            {wonPrize.amount > 0 && (
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
                টাকা সরাসরি আপনার রিয়েল ওয়ালেটে যোগ হয়ে গেছে।
              </p>
            )}
          </div>
        )}

        {/* Status / Countdown Info */}
        <div
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 14,
            padding: '12px 14px',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} color="#f59e0b" />
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>পরবর্তী ফ্রি স্পিন</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                {!user
                  ? 'লগইন করুন'
                  : wheelStatus?.canSpin
                  ? 'এখনই ফ্রি স্পিন করুন! 🎁'
                  : countdownText || 'অপেক্ষা করুন'}
              </div>
            </div>
          </div>

          <div>
            {user ? (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>মোট স্পিন উইন</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>
                  ৳ {wheelStatus?.totalWins || 0}
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  if (onOpenAuth) onOpenAuth('login');
                }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                লগইন করুন
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
