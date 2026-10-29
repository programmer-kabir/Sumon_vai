import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gift, Zap, Shield, ArrowRight } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    tag: '✈️ লাইভ ক্র্যাশ গেম',
    title: 'AVIATOR (HIGH FLYER)',
    highlight: 'প্লেন ওড়ার আগেই ক্যাশআউট করুন!',
    desc: 'লাল ফাইটার জেট আকাশে ওঠার সাথে সাথে বাড়বে আপনার মাল্টিপ্লায়ার। যেকোনো মুহূর্তে ক্যাশআউট নিন।',
    bg: 'linear-gradient(135deg, #450a0a 0%, #1c0404 100%)',
    borderColor: '#ef4444',
    actionText: 'খেলুন (Play Aviator)',
    actionType: 'play_aviator',
  },
  {
    id: 2,
    tag: '⚡ স্লটস জ্যাকপট',
    title: 'GATES OF OLYMPUS',
    highlight: 'জিউসের বাজ ও ৫,০০০x মেগা উইন',
    desc: 'প্র্যাগম্যাটিক প্লে-এর সর্বাধিক জনপ্রিয় স্লট। টাম্বল উইন ও ৫০০x মাল্টিপ্লায়ারে জিতুন কোটি টাকার জ্যাকপট।',
    bg: 'linear-gradient(135deg, #31135e 0%, #120529 100%)',
    borderColor: '#a855f7',
    actionText: 'খেলুন (Gates of Olympus)',
    actionType: 'play_olympus',
  },
  {
    id: 3,
    tag: '🚀 ফ্ল্যাগশিপ ক্র্যাশ গেম',
    title: 'PRAGMATIC PLAY SPACEMAN',
    highlight: 'সর্বোচ্চ ৫,০০০x জ্যাকপট মাল্টিপ্লায়ার',
    desc: 'মহাকাশে পাড়ি দিন স্পেসম্যানের সাথে! ৫০% এবং ১০০% ক্যাশআউট নিয়ে বড় অঙ্কের টাকা জিতুন।',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #0c0a2a 100%)',
    borderColor: '#818cf8',
    actionText: 'খেলুন (Play Spaceman)',
    actionType: 'play_spaceman',
  },
  {
    id: 4,
    tag: 'ওয়েলকাম অফার',
    title: '১০০% ফার্স্ট ডিপোজিট বোনাস',
    highlight: 'সর্বোচ্চ ৳ ১০,০০০ পর্যন্ত বোনাস',
    desc: 'বিকাশ, নগদ বা USDT-তে ডিপোজিট করে দ্বিগুণ ব্যালেন্স নিয়ে সব গেম উপভোগ করুন।',
    bg: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
    borderColor: '#10b981',
    actionText: 'ডিপোজিট করুন',
    actionType: 'deposit',
  },
];

export const BannerSlider = ({ onAction, banners }) => {
  const [current, setCurrent] = useState(0);
  const bannerList = banners && banners.length > 0 ? banners : BANNERS;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerList.length]);

  const banner = bannerList[current] || bannerList[0] || BANNERS[0];

  return (
    <div style={{ padding: '16px 16px 8px 16px' }}>
      <div style={{
        position: 'relative',
        borderRadius: 16,
        background: banner.bg,
        border: `1px solid ${banner.borderColor}`,
        overflow: 'hidden',
        minHeight: 160,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px 24px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.5s ease-in-out',
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          right: -30,
          top: -30,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: banner.borderColor,
          filter: 'blur(70px)',
          opacity: 0.25,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 650 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0, 0, 0, 0.4)',
            border: `1px solid ${banner.borderColor}`,
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            color: '#fbbf24',
            marginBottom: 8,
          }}>
            <Gift size={13} />
            <span>{banner.tag}</span>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, color: '#fff' }}>
            {banner.title}
          </h2>

          <div style={{ fontSize: 17, fontWeight: 900, color: '#fbbf24', marginBottom: 6 }}>
            {banner.highlight}
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.4 }}>
            {banner.desc}
          </p>

          <button
            onClick={() => onAction(banner.actionType)}
            className="gold-btn"
            style={{ fontSize: 13, padding: '8px 18px' }}
          >
            <span>{banner.actionText}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Carousel Dots */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          right: 20,
          display: 'flex',
          gap: 6,
          zIndex: 3,
        }}>
          {BANNERS.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: current === i ? 20 : 6,
                height: 6,
                borderRadius: 4,
                background: current === i ? '#ffd700' : 'rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
