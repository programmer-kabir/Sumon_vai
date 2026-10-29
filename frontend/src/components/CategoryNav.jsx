import React from 'react';
import { Flame, Plane, Disc3, Radio, Trophy, Fish, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'সব গেম', icon: Sparkles },
  { id: 'crash', name: 'ক্র্যাশ গেম', icon: Plane, highlight: true },
  { id: 'slots', name: 'স্লটস', icon: Disc3 },
  { id: 'live_casino', name: 'লাইভ ক্যাসিনো', icon: Radio },
  { id: 'sports', name: 'স্পোর্টস বেটিং', icon: Trophy },
  { id: 'fishing', name: 'ফিশিং গেম', icon: Fish },
];

export const CategoryNav = ({ activeCategory, onSelectCategory }) => {
  return (
    <div style={{
      padding: '8px 16px',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      display: 'flex',
      gap: 8,
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            style={{
              background: isActive
                ? 'var(--gold-gradient)'
                : 'rgba(4, 41, 36, 0.85)',
              color: isActive ? '#000' : '#fff',
              border: isActive
                ? '1px solid #ffd700'
                : '1px solid rgba(255, 215, 0, 0.15)',
              padding: '8px 16px',
              borderRadius: 30,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 13,
              fontWeight: 700,
              boxShadow: isActive ? 'var(--shadow-gold)' : 'none',
              transition: 'var(--transition)',
              flexShrink: 0,
            }}
          >
            <Icon size={16} color={isActive ? '#000' : (cat.highlight ? '#fbbf24' : '#10b981')} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
