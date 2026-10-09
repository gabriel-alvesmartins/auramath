import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Aura3DButton } from '../tactile/Aura3DButton';

export interface ActiveDiscoveryCardProps {
  unitLabel?: string;
  statusBadge?: string;
  title?: string;
  expression?: string;
  targetCategory?: string;
  insightFormula?: string;
  onContinue?: () => void;
}

export const ActiveDiscoveryCard: React.FC<ActiveDiscoveryCardProps> = ({
  unitLabel = 'UNIDADE ATIVA · GRAU II',
  statusBadge = 'Em Andamento',
  title = 'Decomposição & Fatores Amigáveis',
  expression = '48 × 52',
  targetCategory = 'Produto Notável',
  insightFormula = 'Centro 50 ± 2 → 50² - 2² = 2.496',
  onContinue,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFDF6',
        borderRadius: '24px',
        border: '1px solid #D9D5C8',
        boxShadow: '0 4px 0 #C2BDAE',
        padding: '18px 16px',
        margin: '0 16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxSizing: 'border-box',
      }}
    >
      {/* Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#166A5A',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#166A5A',
              textTransform: 'uppercase',
            }}
          >
            {unitLabel}
          </span>
        </div>

        <span
          style={{
            backgroundColor: '#DCEBE5',
            color: '#166A5A',
            fontSize: '0.62rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '999px',
          }}
        >
          {statusBadge}
        </span>
      </div>

      {/* Unit Title */}
      <h2
        style={{
          fontSize: '1.25rem',
          lineHeight: '1.45',
          fontWeight: 900,
          color: '#181D1A',
          margin: 0,
          fontFamily: 'var(--font-display, "Georgia", serif)',
        }}
      >
        {title}
      </h2>

      {/* Math Visual Playground Preview Box */}
      <div
        style={{
          backgroundColor: '#F7F4EA',
          border: '1px solid #E5E1D4',
          borderRadius: '18px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#767268',
          }}
        >
          <span>EXPRESSÃO ALVO</span>
          <span style={{ color: '#166A5A' }}>{targetCategory}</span>
        </div>

        {/* Expression Big Row with Mini Mascot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            className="font-mono-tabular"
            style={{
              fontSize: '2.1rem',
              fontWeight: 900,
              fontFamily: 'var(--font-mono, monospace)',
              color: '#181D1A',
              letterSpacing: '-0.02em',
            }}
          >
            {expression}
          </div>

          {/* Mini Aura Mascot Indicator (Delta with observation dot) */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#FFFDF6',
              border: '1.5px solid #166A5A',
              boxShadow: '0 2px 0 #D9D5C8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Aura: Olhe a simetria oculta!"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <polygon
                points="12,4 20,20 4,20"
                stroke="#166A5A"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="#DCEBE5"
              />
              <circle cx="12" cy="14" r="2.2" fill="#181D1A" />
              <circle cx="12" cy="3" r="1.5" fill="#F2B84B" />
            </svg>
          </div>
        </div>

        {/* Tactile Marigold Highlight Band */}
        <div
          style={{
            backgroundColor: '#FFF0C9',
            border: '1px solid #F5DCA1',
            borderRadius: '12px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              backgroundColor: '#F2B84B',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Lightbulb size={14} color="#684800" strokeWidth={2.6} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#684800',
                textTransform: 'uppercase',
              }}
            >
              INSIGHT SIMÉTRICO
            </span>
            <span
              className="font-mono-tabular"
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#181D1A',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              {insightFormula}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Action Button */}
      <Aura3DButton
        variant="brand"
        size="md"
        fullWidth
        onClick={onContinue}
        icon={<ArrowRight size={18} />}
      >
        Continuar descoberta
      </Aura3DButton>
    </div>
  );
};
