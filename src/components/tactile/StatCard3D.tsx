import React from 'react';
import { Zap, Target, Flame, Clock, Sparkles } from 'lucide-react';

export type StatCardVariant = 'xp' | 'accuracy' | 'streak' | 'time' | 'neutral';

export interface StatCard3DProps {
  variant: StatCardVariant;
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const variantConfig: Record<StatCardVariant, {
  color: string;
  bg: string;
  defaultIcon: React.ReactNode;
}> = {
  xp: {
    color: 'var(--color-gold)',
    bg: 'var(--color-gold-surface)',
    defaultIcon: <Zap size={18} strokeWidth={2.4} />,
  },
  accuracy: {
    color: 'var(--color-success)',
    bg: 'var(--color-success-surface)',
    defaultIcon: <Target size={18} strokeWidth={2.4} />,
  },
  streak: {
    color: 'var(--color-alert)',
    bg: 'var(--color-alert-surface)',
    defaultIcon: <Flame size={18} strokeWidth={2.4} />,
  },
  time: {
    color: 'var(--color-brand)',
    bg: 'var(--color-brand-surface)',
    defaultIcon: <Clock size={18} strokeWidth={2.4} />,
  },
  neutral: {
    color: 'var(--color-text-secondary)',
    bg: 'rgba(255, 255, 255, 0.06)',
    defaultIcon: <Sparkles size={18} strokeWidth={2.4} />,
  },
};

/**
 * StatCard3D — 3D tactile metric display card.
 *
 * Characteristics:
 * - 3D bottom bevel: box-shadow: 0 3px 0 var(--border-bold)
 * - Rounded 20px chassis with var(--color-bg-surface)
 * - Anti-layout shift tabular typography (.font-mono-tabular) in JetBrains Mono
 * - Flex-friendly (flex: 1, min-width: 0) for perfect side-by-side pairing
 */
export const StatCard3D: React.FC<StatCard3DProps> = ({
  variant,
  label,
  value,
  sublabel,
  icon,
  highlight = false,
  className = '',
  style,
}) => {
  const config = variantConfig[variant] || variantConfig.neutral;
  const renderedIcon = icon ?? config.defaultIcon;

  return (
    <div
      className={`stat-card-3d stat-card-3d--${variant} ${highlight ? 'stat-card-3d--highlight' : ''} ${className}`}
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: 'var(--color-cream, #FFFDF6)',
        borderRadius: '18px',
        border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
        boxShadow: highlight
          ? '0 3px 0 var(--color-border-bold, #C2BDAE), 0 0 16px rgba(23, 107, 91, 0.12)'
          : '0 3px 0 var(--color-border-bold, #C2BDAE)',
        padding: '16px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
    >
      {/* Top Row: Label and Badged Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>

        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: config.bg,
            color: config.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {renderedIcon}
        </div>
      </div>

      {/* Main Metric Display: Strict Tabular Anti-Layout Shift Numerals */}
      <div
        className="font-mono-tabular stat-card-3d__value"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.85rem',
          fontWeight: 900,
          color: 'var(--color-text-primary)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>

      {/* Sublabel / Pedagogical Insight */}
      {sublabel && (
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            marginTop: '6px',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};

export default StatCard3D;
