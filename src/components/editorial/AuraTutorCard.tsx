import React from 'react';
import { Sparkles } from 'lucide-react';

export interface AuraTutorCardProps {
  tutorName?: string;
  xpBonus?: number;
  speechText?: string;
}

export const AuraTutorCard: React.FC<AuraTutorCardProps> = ({
  tutorName = 'AURA · TUTOR INTUITIVO',
  xpBonus = 80,
  speechText = 'Você encontrou a estrutura! Quando a distância para a dezena é simétrica, você substitui um cálculo trabalhoso por uma subtração rápida de quadrados.',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* SVG Mascot Aura Delta Icon Badge */}
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: '#DCEBE5',
          border: '1.5px solid #166A5A',
          boxShadow: '0 2px 0 #C2BDAE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        title="Aura Tutor"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <polygon
            points="12,3 22,21 2,21"
            stroke="#166A5A"
            strokeWidth="2.2"
            strokeLinejoin="round"
            fill="#FFFDF6"
          />
          {/* Observation Eye */}
          <circle cx="12" cy="14" r="3.2" fill="#166A5A" />
          <circle cx="12" cy="14" r="1.2" fill="#FFFDF6" />
          {/* Observation Dot Top */}
          <circle cx="12" cy="3" r="1.6" fill="#F2B84B" />
        </svg>
      </div>

      {/* Speech Bubble Card */}
      <div
        style={{
          backgroundColor: '#EBEFEA',
          border: '1px solid #D9D5C8',
          borderRadius: '20px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1,
          boxShadow: '0 2px 0 #D0CCC0',
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#166A5A',
              textTransform: 'uppercase',
            }}
          >
            {tutorName}
          </span>

          {xpBonus > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Sparkles size={11} color="#684800" />
              <span
                className="font-mono-tabular"
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#684800',
                  letterSpacing: '0.04em',
                }}
              >
                +{xpBonus} XP
              </span>
            </div>
          )}
        </div>

        {/* Speech content */}
        <p
          style={{
            fontSize: '0.8rem',
            lineHeight: '1.35',
            color: '#181D1A',
            margin: 0,
            fontWeight: 500,
          }}
        >
          "{speechText}"
        </p>
      </div>
    </div>
  );
};
