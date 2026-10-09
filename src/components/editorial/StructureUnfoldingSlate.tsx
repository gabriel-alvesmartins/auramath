import React from 'react';
import { ArrowDown, Check } from 'lucide-react';

export interface UnfoldingStep {
  number: number;
  label: string;
  expression: React.ReactNode;
  highlighted?: boolean;
}

export interface StructureUnfoldingSlateProps {
  formulaTitle?: string;
  formulaCanon?: string;
  steps?: UnfoldingStep[];
  finalResult?: string;
  climaxCaption?: string;
}

export const StructureUnfoldingSlate: React.FC<StructureUnfoldingSlateProps> = ({
  formulaTitle = 'DESDOBRAMENTO DA ESTRUTURA',
  formulaCanon = '(a − b)(a + b) = a² − b²',
  steps = [
    {
      number: 1,
      label: 'Ponto de partida',
      expression: '48 × 52',
    },
    {
      number: 2,
      label: 'Reconfiguração simétrica',
      expression: '(50 − 2)(50 + 2)',
      highlighted: true,
    },
    {
      number: 3,
      label: 'Diferença de quadrados',
      expression: (
        <span>
          50² <span style={{ color: '#BA1A1A' }}>−</span> 2²
        </span>
      ),
    },
    {
      number: 4,
      label: 'Aritmética imediata',
      expression: '2.500 − 4',
    },
  ],
  finalResult = '2.496',
  climaxCaption = 'zero cálculos no papel',
}) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFDF6',
        borderRadius: '28px',
        border: '1px solid #D9D5C8',
        boxShadow: '0 3px 0 #C2BDAE',
        padding: '18px 16px',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Slate Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#6E5AA6',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#181D1A',
              textTransform: 'uppercase',
            }}
          >
            {formulaTitle}
          </span>
        </div>

        <span
          className="font-mono-tabular"
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            color: '#166A5A',
            letterSpacing: '0.04em',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          {formulaCanon}
        </span>
      </div>

      {/* Step-by-Step Flow Slate */}
      <div
        style={{
          backgroundColor: '#F0F5F0',
          borderRadius: '22px',
          padding: '14px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {steps.map((step, idx) => (
          <React.Fragment key={step.number}>
            {/* Step row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: step.highlighted ? '8px 12px' : '6px 8px',
                backgroundColor: step.highlighted ? '#FFFDF6' : 'transparent',
                borderRadius: step.highlighted ? '16px' : '0',
                boxShadow: step.highlighted ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
              }}
            >
              {/* Left label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#E5E9E4',
                    color: '#181D1A',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.number}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#494550',
                    fontWeight: 600,
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* Right formula/expression */}
              <div
                className="font-mono-tabular"
                style={{
                  fontSize: step.highlighted ? '1.05rem' : '0.98rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono, monospace)',
                  color: step.highlighted ? '#166A5A' : '#181D1A',
                  letterSpacing: '0.02em',
                }}
              >
                {step.expression}
              </div>
            </div>

            {/* Down arrow connector */}
            {idx < steps.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.5, margin: '1px 0' }}>
                <ArrowDown size={14} color="#166A5A" strokeWidth={2.4} />
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Final connector arrow */}
        <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.5, margin: '2px 0' }}>
          <ArrowDown size={14} color="#166A5A" strokeWidth={2.4} />
        </div>

        {/* Step 5 Climax / Final Visual Result */}
        <div
          style={{
            backgroundColor: '#FFF0C9',
            border: '1.5px solid #F5DCA1',
            borderRadius: '18px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#684800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={14} color="#FFFDF6" strokeWidth={3} />
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#684800',
                textTransform: 'uppercase',
              }}
            >
              RESULTADO VISUAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span
              className="font-mono-tabular"
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#684800',
                fontFamily: 'var(--font-display, "Georgia", serif)',
                lineHeight: 1,
              }}
            >
              {finalResult}
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#767268',
                marginTop: '3px',
              }}
            >
              {climaxCaption}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
