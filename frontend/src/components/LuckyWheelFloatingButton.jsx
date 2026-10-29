import React from 'react';
import { Gift, Sparkles } from 'lucide-react';

export const LuckyWheelFloatingButton = ({ onClick }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 84,
        right: 18,
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Floating Free Badge */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: '#fff',
          fontSize: 10,
          fontWeight: 900,
          padding: '2px 8px',
          borderRadius: 10,
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.6)',
          marginBottom: -8,
          zIndex: 2,
          letterSpacing: '0.5px',
          animation: 'bounce 1.5s infinite',
        }}
      >
        ফ্রি স্পিন!
      </div>

      {/* Main Wheel Button */}
      <button
        onClick={onClick}
        title="ডেইলি লাকি স্পিন খুলুন"
        style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
          border: '2px solid #fef08a',
          boxShadow: '0 6px 20px rgba(245, 158, 11, 0.5), 0 0 15px rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        }}
      >
        <Gift size={26} />
      </button>

      <span
        style={{
          marginTop: 4,
          fontSize: 11,
          fontWeight: 800,
          color: '#f59e0b',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '1px 6px',
          borderRadius: 6,
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
      >
        লাকি হুইল
      </span>
    </div>
  );
};
