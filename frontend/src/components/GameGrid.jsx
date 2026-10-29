import React, { useState } from 'react';
import { Play, Sparkles, Filter, Search } from 'lucide-react';

export const GameGrid = ({ games, onLaunchGame }) => {
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const providerList = ['All', ...Array.from(new Set(games.map((g) => g.provider).filter(Boolean)))];

  const filteredGames = games.filter((game) => {
    const matchesProvider =
      selectedProvider === 'All' || game.provider.toLowerCase() === selectedProvider.toLowerCase();
    const matchesSearch =
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProvider && matchesSearch;
  });

  return (
    <div style={{ padding: '8px 16px 24px 16px' }}>
      {/* Search and Provider Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 16,
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          flex: '1 1 200px',
          maxWidth: 320,
        }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 11 }} />
          <input
            type="text"
            placeholder="গেম খুঁজুন (যেমন Spaceman)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(4, 41, 36, 0.8)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: 20,
              padding: '8px 14px 8px 36px',
              color: '#fff',
              fontSize: 13,
              outline: 'none',
            }}
          />
        </div>

        {/* Provider Pills */}
        <div style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          maxWidth: '100%',
          paddingBottom: 4,
          scrollbarWidth: 'none',
        }}>
          {providerList.map((prov) => {
            const isSel = selectedProvider === prov;
            return (
              <button
                key={prov}
                onClick={() => setSelectedProvider(prov)}
                style={{
                  background: isSel ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: isSel ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isSel ? '#fbbf24' : '#94a3b8',
                  padding: '5px 12px',
                  borderRadius: 14,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {prov}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Game Cards */}
      {filteredGames.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'rgba(4, 41, 36, 0.4)',
          borderRadius: 12,
          border: '1px dashed rgba(255, 215, 0, 0.2)',
          color: '#94a3b8',
          fontSize: 13,
        }}>
          এই ক্যাটাগরিতে শীঘ্রই নতুন গেম যুক্ত করা হবে।
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 12,
        }}>
          {filteredGames.map((game) => (
            <div
              key={game.code}
              onClick={() => onLaunchGame(game)}
              className="glass-card"
              style={{
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'var(--transition)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.6)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 12px rgba(245, 158, 11, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.15)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
            >
              {/* Thumbnail Container */}
              <div style={{ position: 'relative', width: '100%', height: 110, overflow: 'hidden' }}>
                <img
                  src={game.thumbnail}
                  alt={game.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Popular Badge */}
                {game.popular && (
                  <div style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
                  }}>
                    HOT
                  </div>
                )}

                {/* RTP Badge */}
                <div style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  background: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(4px)',
                  color: '#6ee7b7',
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '2px 5px',
                  borderRadius: 4,
                  border: '1px solid rgba(110, 231, 183, 0.3)',
                }}>
                  RTP {game.rtp}
                </div>

                {/* Hover Play Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(2, 26, 23, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.9,
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--gold-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 15px rgba(251, 191, 36, 0.8)',
                  }}>
                    <Play size={18} color="#000" fill="#000" style={{ marginLeft: 2 }} />
                  </div>
                </div>
              </div>

              {/* Game Meta */}
              <div style={{ padding: '8px 10px', background: 'rgba(4, 41, 36, 0.95)' }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {game.name}
                </div>
                <div style={{
                  fontSize: 11,
                  color: 'var(--text-gold)',
                  fontWeight: 600,
                  marginTop: 2,
                }}>
                  {game.provider}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
