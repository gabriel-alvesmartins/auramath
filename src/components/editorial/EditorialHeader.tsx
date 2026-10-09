import React from 'react';
import { Flame, Sun, User } from 'lucide-react';

export interface EditorialHeaderProps {
  currentStreak?: number;
  xpPoints?: number;
  activeTabTitle?: string;
  onProfileClick?: () => void;
  onStreakClick?: () => void;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  currentStreak = 7,
  xpPoints = 420,
  activeTabTitle = 'TRILHA',
  onProfileClick,
  onStreakClick,
}) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: 'var(--color-bg-base, #F7F4EA)',
        borderBottom: '1px solid var(--color-border-subtle, #D9D5C8)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Brand Logo & Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Prisma Mascote Geômetra Emblem */}
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="var(--color-verdigris-soft, #DCEBE5)" stroke="var(--color-verdigris, #176B5B)" strokeWidth="2" />
          {/* Crista de transferidor graduada */}
          <path d="M 10 13 C 12 7, 22 7, 24 13" fill="none" stroke="#F1AF32" strokeWidth="1.8" strokeLinecap="round" />
          {/* Cabeça do Prisma */}
          <path d="M 8 17 C 8 12, 14 11, 20 11 C 25 11, 28 14, 28 19 C 28 23, 24 26, 19 26 C 13 26, 8 22, 8 17 Z" fill="#378F79" />
          {/* Olho telescópico / bússola */}
          <circle cx="18" cy="17" r="5.5" fill="#FFFDF6" stroke="#1C2C27" strokeWidth="1.2" />
          <circle cx="18.5" cy="17" r="3.2" fill="#F1AF32" />
          <circle cx="19" cy="17" r="1.8" fill="#1C2C27" />
          <circle cx="18" cy="16" r="0.7" fill="#FFFFFF" />
          {/* Esquadro ambarino do geômetra */}
          <polygon points="7,25 12,18 12,25" fill="var(--color-marigold, #F2B84B)" stroke="var(--color-marigold-bevel, #D49A2E)" strokeWidth="0.8" />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '1.05rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display, inherit)',
              letterSpacing: '-0.02em',
              color: 'var(--color-ink, #202522)',
              lineHeight: 1.1,
            }}
          >
            aura<span style={{ color: '#176B5B', margin: '0 1px' }}>●</span>math
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#176B5B',
              textTransform: 'uppercase',
            }}
          >
            {activeTabTitle}
          </span>
        </div>
      </div>

      {/* Gamification Stats & Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Streak Pill */}
        <button
          type="button"
          onClick={onStreakClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
            borderRadius: '999px',
            padding: '4px 10px',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
          }}
          title={`${currentStreak} dias seguidos`}
        >
          <Flame size={15} color="#E76F61" fill="#E76F61" />
          <span
            className="font-mono-tabular"
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--color-ink, #202522)',
            }}
          >
            {currentStreak}
          </span>
        </button>

        {/* Energy / XP Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
            borderRadius: '999px',
            padding: '4px 10px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
          }}
          title={`${xpPoints} pontos de descoberta`}
        >
          <Sun size={15} color="#F2B84B" strokeWidth={2.4} />
          <span
            className="font-mono-tabular"
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--color-ink, #202522)',
            }}
          >
            {xpPoints}
          </span>
        </div>

        {/* Profile Avatar */}
        <button
          type="button"
          onClick={onProfileClick}
          aria-label="Perfil do usuário"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#6E5AA6',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 0 #524080',
          }}
        >
          <User size={16} color="#FFFDF6" strokeWidth={2.4} />
        </button>
      </div>
    </header>
  );
};
