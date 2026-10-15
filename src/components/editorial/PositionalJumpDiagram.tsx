import React from 'react';

export interface PositionalJumpDiagramProps {
  expression?: string;
  start?: number;
  tensJump?: number;
  intermediate?: number;
  unitsJump?: number;
  finalTarget?: number;
  caption?: string;
}

/**
 * PositionalJumpDiagram — Visualizes left-to-right positional fusion via number line jump arcs.
 * Used for Grade 1 (ADD_LEFT_RIGHT, SUB_COMPENSATION).
 */
export const PositionalJumpDiagram: React.FC<PositionalJumpDiagramProps> = ({
  expression = '68 + 27 = 95',
  start = 68,
  tensJump = 20,
  intermediate = 88,
  unitsJump = 7,
  finalTarget = 95,
  caption = 'Não arme a conta: salte as dezenas primeiro, depois as unidades!',
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
          color: '#166A5A',
          marginBottom: '6px',
        }}
      >
        RETA DOS SALTOS POSICIONAIS
      </span>

      <div
        className="font-mono-tabular"
        style={{
          fontSize: '2.2rem',
          fontWeight: 900,
          fontFamily: 'var(--font-mono, monospace)',
          color: '#181D1A',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          marginBottom: '14px',
        }}
      >
        {expression}
      </div>

      {/* SVG Jump Arcs on Number Line */}
      <div style={{ width: '100%', maxWidth: '340px', margin: '4px 0 10px' }}>
        <svg viewBox="0 0 340 76" width="100%" height="76" fill="none">
          {/* Dashed baseline ruler */}
          <line
            x1="20"
            y1="52"
            x2="320"
            y2="52"
            stroke="#C2BDAE"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Jump 1: Tens Arc (+tensJump) */}
          <path
            d="M 45 48 Q 120 12 195 48"
            stroke="#166A5A"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Badge for Tens Jump */}
          <rect x="100" y="6" width="40" height="18" rx="6" fill="#DCEBE5" />
          <text
            x="120"
            y="19"
            fill="#166A5A"
            fontSize="11"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="monospace"
          >
            +{tensJump}
          </text>

          {/* Jump 2: Units Arc (+unitsJump) */}
          <path
            d="M 195 48 Q 245 24 295 48"
            stroke="#E76F61"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Badge for Units Jump */}
          <rect x="230" y="16" width="30" height="18" rx="6" fill="#FCEAE8" />
          <text
            x="245"
            y="29"
            fill="#E76F61"
            fontSize="11"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="monospace"
          >
            +{unitsJump}
          </text>

          {/* Point 1: Start */}
          <circle cx="45" cy="52" r="5" fill="#181D1A" />
          <text
            x="45"
            y="69"
            fill="#181D1A"
            fontSize="12"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {start}
          </text>

          {/* Point 2: Intermediate */}
          <circle cx="195" cy="52" r="5" fill="#166A5A" />
          <text
            x="195"
            y="69"
            fill="#166A5A"
            fontSize="12"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {intermediate}
          </text>

          {/* Point 3: Final Target */}
          <circle cx="295" cy="52" r="6" fill="#E76F61" />
          <text
            x="295"
            y="70"
            fill="#E76F61"
            fontSize="13"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {finalTarget}
          </text>
        </svg>
      </div>

      <p
        style={{
          fontSize: '0.82rem',
          color: '#5C645F',
          lineHeight: 1.4,
          margin: '6px 0 0',
          maxWidth: '320px',
        }}
      >
        {caption}
      </p>
    </div>
  );
};
