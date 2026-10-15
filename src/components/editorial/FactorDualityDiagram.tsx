import React from 'react';

export interface FactorDualityDiagramProps {
  expression?: string;
  leftOperation?: string;
  rightOperation?: string;
  exampleStep1?: string;
  exampleStep2?: string;
  finalResult?: string | number;
  caption?: string;
}

/**
 * FactorDualityDiagram — Visualizes duality between hard multiplication/division and decimal scaling.
 * Used for Grade 2 (MULT_5_50, DIV_5, MULT_25, DIV_25, MULT_11).
 */
export const FactorDualityDiagram: React.FC<FactorDualityDiagramProps> = ({
  expression = '48 × 5',
  leftOperation = 'Multiplicação por 5',
  rightOperation = '(÷ 2) seguido de (× 10)',
  exampleStep1 = '48 ÷ 2 = 24',
  exampleStep2 = '24 × 10 = 240',
  finalResult = 240,
  caption = 'Transforme multiplicações complexas em cortes de metade e zeros!',
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
          color: '#F2B84B',
          marginBottom: '6px',
        }}
      >
        DUALIDADE DE ESCALA DECIMAL
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

      {/* Duality Scale Representation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '8px',
          alignItems: 'center',
          width: '100%',
          maxWidth: '340px',
          backgroundColor: '#F7F4EA',
          border: '1.5px solid #D9D5C8',
          borderRadius: '16px',
          padding: '12px 10px',
          marginBottom: '12px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#767268', fontWeight: 800, textTransform: 'uppercase' }}>
            Operação Aparente
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#C25E50', marginTop: '4px' }}>
            {leftOperation}
          </div>
        </div>

        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#166A5A' }}>
          ⟷
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#767268', fontWeight: 800, textTransform: 'uppercase' }}>
            Atalho Real
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#166A5A', marginTop: '4px' }}>
            {rightOperation}
          </div>
        </div>
      </div>

      {/* Two-step decomposition pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span
          style={{
            backgroundColor: '#DCEBE5',
            color: '#166A5A',
            border: '1px solid #166A5A',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          {exampleStep1}
        </span>
        <span style={{ color: '#767268', fontWeight: 900, alignSelf: 'center' }}>➔</span>
        <span
          style={{
            backgroundColor: '#F5E8C9',
            color: '#8A6818',
            border: '1px solid #F2B84B',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          {exampleStep2}
        </span>
      </div>

      <p
        style={{
          fontSize: '0.82rem',
          color: '#5C645F',
          lineHeight: 1.4,
          margin: '10px 0 0',
          maxWidth: '320px',
        }}
      >
        {caption}
      </p>
    </div>
  );
};
