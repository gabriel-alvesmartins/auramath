import React from 'react';

export interface SymmetryRulerDiagramProps {
  expression?: string;
  leftValue?: number;
  centerSupport?: number;
  rightValue?: number;
  delta?: number;
  caption?: string;
}

export const SymmetryRulerDiagram: React.FC<SymmetryRulerDiagramProps> = ({
  expression = '48 × 52',
  leftValue = 48,
  centerSupport = 50,
  rightValue = 52,
  delta = 2,
  caption = 'Simetria equidistante em torno da dezena de ouro',
}) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFDF6',
        borderRadius: '24px',
        border: '1px solid #D9D5C8',
        boxShadow: '0 3px 0 #C2BDAE',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          fontSize: '0.68rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#767268',
          marginBottom: '8px',
        }}
      >
        OBSERVE ANTES DE CALCULAR
      </span>

      {/* Big Target Expression */}
      <div
        className="font-mono-tabular"
        style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          fontFamily: 'var(--font-mono, monospace)',
          color: '#181D1A',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          marginBottom: '16px',
        }}
      >
        {expression}
      </div>

      {/* SVG Symmetry Ruler Diagram */}
      <div style={{ width: '100%', maxWidth: '320px', margin: '4px 0 10px' }}>
        <svg viewBox="0 0 320 70" width="100%" height="70" fill="none">
          {/* Dashed baseline ruler */}
          <line
            x1="30"
            y1="45"
            x2="290"
            y2="45"
            stroke="#C2BDAE"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Left arc (-delta) */}
          <path
            d="M 50 42 Q 105 15 160 42"
            stroke="#166A5A"
            strokeWidth="2"
            fill="none"
          />
          {/* Left delta label */}
          <rect x="94" y="8" width="22" height="14" rx="4" fill="#DCEBE5" />
          <text
            x="105"
            y="19"
            fill="#166A5A"
            fontSize="10"
            fontWeight="800"
            textAnchor="middle"
          >
            -{delta}
          </text>

          {/* Right arc (+delta) */}
          <path
            d="M 160 42 Q 215 15 270 42"
            stroke="#166A5A"
            strokeWidth="2"
            fill="none"
          />
          {/* Right delta label */}
          <rect x="204" y="8" width="22" height="14" rx="4" fill="#DCEBE5" />
          <text
            x="215"
            y="19"
            fill="#166A5A"
            fontSize="10"
            fontWeight="800"
            textAnchor="middle"
          >
            +{delta}
          </text>

          {/* Left Node (48) */}
          <circle cx="50" cy="45" r="5" fill="#166A5A" />
          <text
            x="50"
            y="62"
            fill="#181D1A"
            fontSize="12"
            fontWeight="800"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {leftValue}
          </text>

          {/* Center Support Node (50 apoio) */}
          <circle cx="160" cy="45" r="7" fill="#F2B84B" stroke="#684800" strokeWidth="2" />
          <text
            x="160"
            y="62"
            fill="#684800"
            fontSize="12"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {centerSupport} <tspan fontSize="9" fontWeight="600">(apoio)</tspan>
          </text>

          {/* Right Node (52) */}
          <circle cx="270" cy="45" r="5" fill="#166A5A" />
          <text
            x="270"
            y="62"
            fill="#181D1A"
            fontSize="12"
            fontWeight="800"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {rightValue}
          </text>
        </svg>
      </div>

      <p
        style={{
          fontSize: '0.78rem',
          lineHeight: '1.3',
          color: '#494550',
          margin: '4px 0 0',
          fontWeight: 600,
        }}
      >
        {caption}
      </p>
    </div>
  );
};
