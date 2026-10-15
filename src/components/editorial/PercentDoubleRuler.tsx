import React from 'react';

export interface PercentDoubleRulerProps {
  expression?: string;
  percentValue?: number;
  baseNumber?: number;
  calculatedValue?: number;
  isSymmetric?: boolean;
  symmetricExpression?: string;
  caption?: string;
}

/**
 * PercentDoubleRuler — Visualizes double number line and commutative symmetry for percentages.
 * Used for Grade 7 (PERCENT_PIVOT_10_1, PERCENT_TIP_15, PERCENT_FRIENDLY_FRACTIONS, PERCENT_SYMMETRY, PERCENT_DISCOUNT_ADD).
 */
export const PercentDoubleRuler: React.FC<PercentDoubleRulerProps> = ({
  expression = '16% de 50 = 8',
  percentValue = 16,
  baseNumber = 50,
  calculatedValue = 8,
  isSymmetric = true,
  symmetricExpression = '50% de 16 = 8',
  caption = 'A Simetria Mágica: x% de y é exatamente igual a y% de x!',
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
          color: '#6E5AA6',
          marginBottom: '6px',
        }}
      >
        RÉGUA DUPLA & SIMETRIA PERCENTUAL
      </span>

      <div
        className="font-mono-tabular"
        style={{
          fontSize: '2.1rem',
          fontWeight: 900,
          fontFamily: 'var(--font-mono, monospace)',
          color: '#181D1A',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          marginBottom: '12px',
        }}
      >
        {expression}
      </div>

      {/* Symmetric Equivalence Pill */}
      {isSymmetric && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#EAE5F5',
            border: '1.5px solid #6E5AA6',
            borderRadius: '12px',
            padding: '6px 14px',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4D3B82', textTransform: 'uppercase' }}>
            Inversão Simétrica:
          </span>
          <span
            className="font-mono-tabular"
            style={{ fontSize: '1.05rem', fontWeight: 900, color: '#6E5AA6', fontFamily: 'var(--font-mono, monospace)' }}
          >
            {symmetricExpression}
          </span>
        </div>
      )}

      {/* SVG Double Number Line */}
      <div style={{ width: '100%', maxWidth: '340px', margin: '4px 0 8px' }}>
        <svg viewBox="0 0 340 68" width="100%" height="68" fill="none">
          {/* Top Line: Percentages */}
          <line x1="25" y1="20" x2="315" y2="20" stroke="#6E5AA6" strokeWidth="2.5" />
          <circle cx="25" cy="20" r="4" fill="#6E5AA6" />
          <text x="25" y="12" fill="#767268" fontSize="9" fontWeight="800" textAnchor="middle">0%</text>

          <circle cx="170" cy="20" r="4" fill="#6E5AA6" />
          <text x="170" y="12" fill="#6E5AA6" fontSize="10" fontWeight="900" textAnchor="middle">50%</text>

          <circle cx="315" cy="20" r="4" fill="#6E5AA6" />
          <text x="315" y="12" fill="#767268" fontSize="9" fontWeight="800" textAnchor="middle">100%</text>

          {/* Dotted Connection */}
          <line x1="170" y1="20" x2="170" y2="48" stroke="#166A5A" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Bottom Line: Real Values */}
          <line x1="25" y1="48" x2="315" y2="48" stroke="#166A5A" strokeWidth="2.5" />
          <circle cx="25" cy="48" r="4" fill="#166A5A" />
          <text x="25" y="62" fill="#767268" fontSize="9" fontWeight="800" textAnchor="middle">0</text>

          <circle cx="170" cy="48" r="5" fill="#E76F61" />
          <text x="170" y="64" fill="#E76F61" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            {calculatedValue}
          </text>

          <circle cx="315" cy="48" r="4" fill="#166A5A" />
          <text x="315" y="62" fill="#166A5A" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            {baseNumber}
          </text>
        </svg>
      </div>

      <p
        style={{
          fontSize: '0.82rem',
          color: '#5C645F',
          lineHeight: 1.4,
          margin: '4px 0 0',
          maxWidth: '320px',
        }}
      >
        {caption}
      </p>
    </div>
  );
};
