import React from 'react';
import { Check } from 'lucide-react';

export interface EurekaOptionItem {
  id: string;
  badgeLetter?: string;
  title: string;
  isEureka?: boolean;
  eurekaBadgeText?: string;
  explanation: string;
}

export interface EurekaOptionCardsProps {
  questionTitle?: string;
  questionSubtitle?: string;
  options: EurekaOptionItem[];
  selectedId: string | null;
  onSelectOption: (id: string) => void;
}

export const EurekaOptionCards: React.FC<EurekaOptionCardsProps> = ({
  questionTitle = 'O que você percebe?',
  questionSubtitle = 'Enxergue o ponto de apoio que simplifica a operação mental.',
  options,
  selectedId,
  onSelectOption,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header Question */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 900,
            color: '#181D1A',
            margin: 0,
            fontFamily: 'var(--font-display, "Georgia", serif)',
            letterSpacing: '-0.015em',
          }}
        >
          {questionTitle}
        </h3>
        <p
          style={{
            fontSize: '0.8rem',
            lineHeight: '1.25rem',
            color: '#494550',
            margin: 0,
          }}
        >
          {questionSubtitle}
        </p>
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt, idx) => {
          const isSelected = selectedId === opt.id;
          const letter = opt.badgeLetter || String.fromCharCode(65 + idx); // A, B, C

          return (
            <div
              key={opt.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectOption(opt.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelectOption(opt.id);
              }}
              style={{
                backgroundColor: '#FFFDF6',
                borderRadius: '20px',
                border: isSelected
                  ? '2px solid #166A5A'
                  : '1.5px solid #D9D5C8',
                boxShadow: isSelected
                  ? '0 3px 0 #104E42'
                  : '0 2px 0 #C2BDAE',
                padding: '14px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px',
                transition: 'transform 0.1s ease, border-color 0.15s ease',
                opacity: selectedId && !isSelected ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                {/* Badge Indicator */}
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? '#166A5A' : '#E5E9E4',
                    color: isSelected ? '#FFFDF6' : '#494550',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  {isSelected ? <Check size={16} strokeWidth={3} /> : letter}
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        color: '#181D1A',
                        lineHeight: 1.25,
                      }}
                    >
                      {opt.title}
                    </span>

                    {/* Eureka Tag */}
                    {opt.isEureka && (
                      <span
                        style={{
                          backgroundColor: '#FFDEAA',
                          color: '#271900',
                          fontSize: '0.62rem',
                          fontWeight: 900,
                          letterSpacing: '0.04em',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {opt.eurekaBadgeText || 'PADRÃO EUREKA'}
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: '0.78rem',
                      lineHeight: '1.25rem',
                      color: '#494550',
                      margin: 0,
                    }}
                  >
                    {opt.explanation}
                  </p>
                </div>
              </div>

              {/* Radio dot indicator */}
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  border: isSelected ? '4.5px solid #166A5A' : '1.5px solid #C2BDAE',
                  backgroundColor: '#FFFDF6',
                  flexShrink: 0,
                  marginTop: '6px',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
