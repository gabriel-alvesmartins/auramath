import React from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';

export interface DeepeningMiniCardProps {
  title?: string;
  subtitle?: string;
  onClick?: () => void;
}

export const DeepeningMiniCard: React.FC<DeepeningMiniCardProps> = ({
  title = 'Por que isso sempre funciona?',
  subtitle = 'Veja a prova geométrica por corte de áreas e decomposição.',
  onClick,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
      style={{
        backgroundColor: '#FFFDF6',
        borderRadius: '24px',
        border: '1px solid #D9D5C8',
        boxShadow: '0 2px 0 #C2BDAE',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        width: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#DCEBE5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <HelpCircle size={20} color="#166A5A" strokeWidth={2.4} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: '#181D1A',
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#494550',
              marginTop: '1px',
            }}
          >
            {subtitle}
          </span>
        </div>
      </div>

      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#F7F4EA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <ChevronRight size={16} color="#494550" />
      </div>
    </div>
  );
};
