import React, { useState, useEffect } from 'react';
import { Flame, Trophy, X } from 'lucide-react';
import { api } from '../services/api';

export const LiveWinnerToast = () => {
  const [currentWinner, setCurrentWinner] = useState(null);
  const [visible, setVisible] = useState(false);
  const [winnersQueue, setWinnersQueue] = useState([]);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await api.getLiveWinners();
        if (res.data && res.data.length > 0) {
          setWinnersQueue(res.data);
        }
      } catch (e) {}
    };

    fetchWinners();
    const refreshTimer = setInterval(fetchWinners, 30000);
    return () => clearInterval(refreshTimer);
  }, []);

  useEffect(() => {
    if (winnersQueue.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      const winner = winnersQueue[index % winnersQueue.length];
      setCurrentWinner(winner);
      setVisible(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setVisible(false);
      }, 4000);

      index++;
    }, 9000);

    return () => clearInterval(interval);
  }, [winnersQueue]);

  if (!visible || !currentWinner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 75,
      left: 16,
      zIndex: 45,
      background: 'rgba(2, 26, 23, 0.96)',
      border: '1.5px solid rgba(255, 215, 0, 0.45)',
      borderRadius: 12,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.75), 0 0 15px rgba(245, 158, 11, 0.3)',
      animation: 'slideInUp 0.3s ease-out',
      maxWidth: 320,
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        flexShrink: 0,
      }}>
        <Trophy size={16} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
          <span style={{ fontWeight: 800, color: '#fff' }}>{currentWinner.user}</span>
          <span>জিতেছেন</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>
            +৳ {Number(currentWinner.amount).toLocaleString()}
          </span>
          <span style={{
            background: 'rgba(255, 215, 0, 0.15)',
            color: '#fbbf24',
            fontSize: 9,
            fontWeight: 800,
            padding: '1px 5px',
            borderRadius: 4,
          }}>
            {currentWinner.gameName}
          </span>
        </div>
      </div>

      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: 2,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};
