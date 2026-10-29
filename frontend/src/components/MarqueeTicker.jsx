import React from 'react';
import { Volume2 } from 'lucide-react';

export const MarqueeTicker = ({ items }) => {
  const announcements = items && items.length > 0 ? items : [
    '🔥 প্লেয়ার arafat_king Aviator গেমে ৳ ১৮,৪০০ ক্যাশআউট করলেন!',
    '💎 নতুন প্লেয়ারদের জন্য ১০০% ওয়েলকাম বোনাস চালু রয়েছে!',
    '⚡ USDT TRC20 ডিপোজিটে পান ইনস্ট্যান্ট ১.৫% অতিরিক্ত ক্যাশ রিবেট!',
    '🏆 প্লেয়ার sakib_pro Gates of Olympus-এ ৳ ৩৫,২০০ জ্যাকপট জিতলেন!',
    '📢 বিকাশ ও নগদ এজেন্ট নম্বর প্রতি ঘণ্টায় পরিবর্তিত হতে পারে, সবসময় ডিপোজিট পেজের নম্বর দেখে টাকা পাঠান।',
  ];

  return (
    <div style={{
      background: 'rgba(4, 41, 36, 0.95)',
      borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
      padding: '7px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      overflow: 'hidden',
      fontSize: 12,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        color: '#fbbf24',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        background: 'rgba(251, 191, 36, 0.1)',
        padding: '2px 8px',
        borderRadius: 4,
      }}>
        <Volume2 size={14} />
        <span>লাইভ নোটিশ</span>
      </div>

      <div style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
      }}>
        <div style={{
          display: 'inline-block',
          animation: 'marquee 30s linear infinite',
          paddingLeft: '100%',
        }}>
          {announcements.map((item, idx) => (
            <span key={idx} style={{ marginRight: 50, color: '#e2e8f0' }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
