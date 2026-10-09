import React from 'react';
import { Clock } from 'lucide-react';

export interface GreetingBannerProps {
  volumeLabel?: string;
  estimatedMinutes?: number;
  userName?: string;
  subtitle?: string;
}

export const GreetingBanner: React.FC<GreetingBannerProps> = ({
  volumeLabel = 'CADERNO DE INSIGHTS · VOL. 2',
  estimatedMinutes = 3,
  userName = 'Gabriel',
  subtitle = 'Seu próximo salto cognitivo está a uma decomposição de distância.',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '16px 16px 8px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Top badges bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Volume tag */}
        <span
          style={{
            backgroundColor: '#E5E9E4',
            color: '#494550',
            fontSize: '0.62rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            padding: '2px 8px',
            borderRadius: '999px',
            textTransform: 'uppercase',
          }}
        >
          {volumeLabel}
        </span>

        {/* Estimated time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#166A5A',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.03em',
          }}
        >
          <Clock size={13} color="#166A5A" strokeWidth={2.4} />
          <span>{estimatedMinutes} min restantes</span>
        </div>
      </div>

      {/* Greeting Title */}
      <h1
        style={{
          fontSize: '1.875rem', // 30px
          lineHeight: '2.25rem', // 36px
          fontWeight: 900,
          color: '#181D1A',
          letterSpacing: '-0.025em',
          margin: '2px 0 0',
          fontFamily: 'var(--font-display, "Georgia", serif)',
        }}
      >
        Bom dia, {userName}.
      </h1>

      {/* Explanatory subtitle */}
      <p
        style={{
          fontSize: '0.82rem', // 13px
          lineHeight: '1.15rem', // 18px
          color: '#494550',
          margin: 0,
          fontWeight: 500,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};
