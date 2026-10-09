import React from 'react';

export interface TrackCurriculumCardProps {
  nodeIndexLabel?: string;
  starsCount?: number;
  maxStars?: number;
  title: string;
  subtitle: string;
  isCompleted?: boolean;
  isActive?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
}

export const TrackCurriculumCard: React.FC<TrackCurriculumCardProps> = ({
  nodeIndexLabel = 'NÓ 01 · CONCLUÍDO',
  starsCount = 3,
  maxStars = 3,
  title = 'Multiplicação por 25',
  subtitle = '100% fluente via escala ×100 ÷ 4',
  isCompleted = true,
  isActive = false,
  isLocked = false,
  onClick,
}) => {
  return (
    <div
      role="button"
      tabIndex={isLocked ? -1 : 0}
      onClick={isLocked ? undefined : onClick}
      onKeyDown={(e) => {
        if (!isLocked && (e.key === 'Enter' || e.key === ' ')) onClick?.();
      }}
      style={{
        backgroundColor: '#FFFDF6',
        borderRadius: '18px',
        border: isActive ? '2px solid #F2B84B' : '1px solid #D9D5C8',
        boxShadow: isActive ? '0 3px 0 #D49A2E' : '0 2px 0 #C2BDAE',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        width: '100%',
        maxWidth: '280px',
        boxSizing: 'border-box',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.6 : 1,
        textAlign: 'left',
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span
          style={{
            fontSize: '0.62rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            color: isCompleted ? '#166A5A' : isActive ? '#B8821F' : '#767268',
            textTransform: 'uppercase',
          }}
        >
          {nodeIndexLabel}
        </span>

        {/* Stars */}
        <span
          style={{
            fontSize: '0.7rem',
            color: '#F2B84B',
            letterSpacing: '0.06em',
          }}
        >
          {'★'.repeat(starsCount)}
          {'☆'.repeat(Math.max(0, maxStars - starsCount))}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '1.05rem',
          lineHeight: '1.3',
          fontWeight: 800,
          color: '#181D1A',
          margin: '2px 0 0',
          fontFamily: 'var(--font-display, "Georgia", serif)',
        }}
      >
        {title}
      </h3>

      {/* Subtitle */}
      <p
        style={{
          fontSize: '0.78rem',
          lineHeight: '1.25',
          color: '#494550',
          margin: 0,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};
