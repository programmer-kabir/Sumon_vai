import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Trophy, Flame } from 'lucide-react';

export const MegaJackpotBanner = ({ baseJackpot = 5420890 }) => {
  const [jackpot, setJackpot] = useState(baseJackpot);

  useEffect(() => {
    setJackpot(baseJackpot);
  }, [baseJackpot]);

  // Simulate dynamic progressive jackpot accumulation from live wagers
  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Number((Math.random() * 2.8 + 0.5).toFixed(2));
      setJackpot((prev) => Number((prev + increment).toFixed(2)));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      margin: '16px auto',
      maxWidth: 1280,
      padding: '0 12px',
    }}>
      <div style={{
        background: 'radial-gradient(ellipse at center, rgba(30, 27, 75, 0.95) 0%, rgba(4, 41, 36, 0.98) 70%, rgba(2, 26, 23, 1) 100%)',
        border: '1.5px solid rgba(255, 215, 0, 0.45)',
        borderRadius: 16,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle decorative glowing corner particles */}
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        {/* Left Side: Trophy Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ffd700 0%, #f59e0b 50%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)',
            color: '#000',
          }}>
            <Trophy size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                background: '#ef4444',
                color: '#fff',
                fontSize: 10,
                fontWeight: 900,
                padding: '2px 6px',
                borderRadius: 4,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
              }}>
                <Flame size={12} /> GRAND MEGA JACKPOT
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>লাইভ প্রগ্রেসিভ পুল</span>
            </div>
            <div style={{ fontSize: 12, color: '#e2e8f0', marginTop: 2, fontWeight: 600 }}>
              যেকোনো গেমে বাজি ধরলেই মেগা ড্রপ পাওয়ার সুযোগ!
            </div>
          </div>
        </div>

        {/* Center / Right: The Ticking Mega Number */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.55)',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            borderRadius: 12,
            padding: '8px 18px',
            boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.8)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
              সর্বশেষ জ্যাকপট ভ্যালু
            </div>
            <div className="gold-text" style={{
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: 900,
              letterSpacing: 1.5,
              fontFamily: 'monospace',
              textShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
            }}>
              ৳ {jackpot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div style={{
            display: 'none',
            mdDisplay: 'flex',
            flexDirection: 'column',
            gap: 2,
            fontSize: 10,
            color: '#94a3b8',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6ee7b7', fontWeight: 700 }}>
              <Sparkles size={12} color="#10b981" />
              <span>প্রতি বাজিতে পুল বৃদ্ধি পায়</span>
            </div>
            <div>সর্বশেষ বিজয়ী: <strong style={{ color: '#fff' }}>sakib_pro (৳৩৫,২০০)</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
