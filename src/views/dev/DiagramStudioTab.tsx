import React, { useState } from 'react';
import {
  FactorDualityDiagram,
  PercentDoubleRuler,
  PositionalJumpDiagram,
  StructureUnfoldingSlate,
  SymmetryRulerDiagram,
} from '../../components/editorial';
import { Smartphone, Monitor, CheckCircle, Sparkles, Sliders } from 'lucide-react';

type DiagramType = 'factor' | 'percent' | 'jump' | 'unfolding' | 'symmetry';

export const DiagramStudioTab: React.FC = () => {
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType>('factor');
  const [viewportWidth, setViewportWidth] = useState<'375px' | '390px' | '430px' | '100%'>('430px');

  // Factor Duality State
  const [factorExpr, setFactorExpr] = useState('48 × 5');
  const [factorLeft, setFactorLeft] = useState('Multiplicação por 5');
  const [factorRight, setFactorRight] = useState('(÷ 2) seguido de (× 10)');
  const [factorStep1, setFactorStep1] = useState('48 ÷ 2 = 24');
  const [factorStep2, setFactorStep2] = useState('24 × 10 = 240');
  const [factorResult, setFactorResult] = useState('240');

  // Percent Ruler State
  const [percentExpr, setPercentExpr] = useState('16% de 50 = 8');
  const [percentVal, setPercentVal] = useState(16);
  const [percentBase, setPercentBase] = useState(50);
  const [percentCalc, setPercentCalc] = useState(8);
  const [percentSymmExpr, setPercentSymmExpr] = useState('50% de 16 = 8');

  // Positional Jump State
  const [jumpExpr, setJumpExpr] = useState('68 + 27 = 95');
  const [jumpStart, setJumpStart] = useState(68);
  const [jumpTens, setJumpTens] = useState(20);
  const [jumpInter, setJumpInter] = useState(88);
  const [jumpUnits, setJumpUnits] = useState(7);
  const [jumpFinal, setJumpFinal] = useState(95);

  // Symmetry Ruler State
  const [symmExpr, setSymmExpr] = useState('48 × 52');
  const [symmLeft, setSymmLeft] = useState(48);
  const [symmCenter, setSymmCenter] = useState(50);
  const [symmRight, setSymmRight] = useState(52);
  const [symmDelta, setSymmDelta] = useState(2);

  // Presets applicator
  const applyPreset = (preset: string) => {
    if (preset === 'mult_25') {
      setSelectedDiagram('factor');
      setFactorExpr('36 × 25');
      setFactorLeft('Multiplicação por 25');
      setFactorRight('(÷ 4) seguido de (× 100)');
      setFactorStep1('36 ÷ 4 = 9');
      setFactorStep2('9 × 100 = 900');
      setFactorResult('900');
    } else if (preset === 'percent_symm') {
      setSelectedDiagram('percent');
      setPercentExpr('18% de 50 = 9');
      setPercentVal(18);
      setPercentBase(50);
      setPercentCalc(9);
      setPercentSymmExpr('50% de 18 = 9');
    } else if (preset === 'jump_sub') {
      setSelectedDiagram('jump');
      setJumpExpr('94 − 38 = 56');
      setJumpStart(94);
      setJumpTens(30);
      setJumpInter(64);
      setJumpUnits(8);
      setJumpFinal(56);
    } else if (preset === 'symm_squares') {
      setSelectedDiagram('symmetry');
      setSymmExpr('29 × 31');
      setSymmLeft(29);
      setSymmCenter(30);
      setSymmRight(31);
      setSymmDelta(1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Controls Bar */}
      <div
        style={{
          backgroundColor: '#FFFDF6',
          border: '1px solid #D9D5C8',
          borderRadius: '16px',
          padding: '18px 24px',
          boxShadow: '0 2px 0 #C2BDAE',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#176B5B" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#202522' }}>
                Laboratório de Diagramas Pedagógicos ("Não calcule. Veja.")
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#5C645F' }}>
              Bancada de validação visual e responsiva dos 5 diagramas do sistema editorial do AuraMath.
            </p>
          </div>

          {/* Viewport Width Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F7F4EA', padding: '4px', borderRadius: '10px', border: '1px solid #D9D5C8' }}>
            {(['375px', '390px', '430px', '100%'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setViewportWidth(w)}
                style={{
                  backgroundColor: viewportWidth === w ? '#176B5B' : 'transparent',
                  color: viewportWidth === w ? '#FFFDF6' : '#5C645F',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {w === '100%' ? <Monitor size={12} /> : <Smartphone size={12} />}
                <span>{w}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Diagram Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'factor', label: 'Dualidade de Fator (5 / 25)' },
            { id: 'percent', label: 'Régua Dupla de Porcentagem' },
            { id: 'jump', label: 'Saltos Posicionais (Reta)' },
            { id: 'unfolding', label: 'Desdobramento Estrutural' },
            { id: 'symmetry', label: 'Régua de Simetria e Média' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDiagram(tab.id as DiagramType)}
              style={{
                backgroundColor: selectedDiagram === tab.id ? '#DCEBE5' : '#FFFDF6',
                border: selectedDiagram === tab.id ? '2px solid #176B5B' : '1px solid #D9D5C8',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: selectedDiagram === tab.id ? 800 : 600,
                color: selectedDiagram === tab.id ? '#176B5B' : '#202522',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Presets Quick Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #EAE6DB' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#5C645F', textTransform: 'uppercase' }}>
            Presets Rápidos:
          </span>
          <button
            onClick={() => applyPreset('mult_25')}
            style={{ backgroundColor: '#F7F4EA', border: '1px solid #D9D5C8', borderRadius: '6px', padding: '4px 10px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
          >
            36 × 25 (Grau 2)
          </button>
          <button
            onClick={() => applyPreset('percent_symm')}
            style={{ backgroundColor: '#F7F4EA', border: '1px solid #D9D5C8', borderRadius: '6px', padding: '4px 10px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
          >
            18% de 50 (Grau 7)
          </button>
          <button
            onClick={() => applyPreset('jump_sub')}
            style={{ backgroundColor: '#F7F4EA', border: '1px solid #D9D5C8', borderRadius: '6px', padding: '4px 10px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
          >
            94 − 38 (Grau 1)
          </button>
          <button
            onClick={() => applyPreset('symm_squares')}
            style={{ backgroundColor: '#F7F4EA', border: '1px solid #D9D5C8', borderRadius: '6px', padding: '4px 10px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
          >
            29 × 31 (Grau 3)
          </button>
        </div>
      </div>

      {/* Main Workbench Layout: Inputs + Preview Frame */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 360px) 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Dynamic Controls Editor */}
        <div
          style={{
            backgroundColor: '#FFFDF6',
            border: '1px solid #D9D5C8',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 0 #C2BDAE',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.9rem', color: '#202522' }}>
            <Sliders size={16} color="#176B5B" />
            <span>Parâmetros do Diagrama</span>
          </div>

          {selectedDiagram === 'factor' && (
            <>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Expressão Alvo</label>
                <input
                  type="text"
                  value={factorExpr}
                  onChange={(e) => setFactorExpr(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Passo 1 (Divisão)</label>
                <input
                  type="text"
                  value={factorStep1}
                  onChange={(e) => setFactorStep1(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Passo 2 (Escala Decimal)</label>
                <input
                  type="text"
                  value={factorStep2}
                  onChange={(e) => setFactorStep2(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Resultado Final</label>
                <input
                  type="text"
                  value={factorResult}
                  onChange={(e) => setFactorResult(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                />
              </div>
            </>
          )}

          {selectedDiagram === 'percent' && (
            <>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Expressão Alvo</label>
                <input
                  type="text"
                  value={percentExpr}
                  onChange={(e) => setPercentExpr(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>% Valor</label>
                  <input
                    type="number"
                    value={percentVal}
                    onChange={(e) => setPercentVal(Number(e.target.value))}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Número Base</label>
                  <input
                    type="number"
                    value={percentBase}
                    onChange={(e) => setPercentBase(Number(e.target.value))}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Expressão Simétrica Comutativa</label>
                <input
                  type="text"
                  value={percentSymmExpr}
                  onChange={(e) => setPercentSymmExpr(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                />
              </div>
            </>
          )}

          {selectedDiagram === 'jump' && (
            <>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Expressão Alvo</label>
                <input
                  type="text"
                  value={jumpExpr}
                  onChange={(e) => setJumpExpr(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Ponto Inicial</label>
                  <input
                    type="number"
                    value={jumpStart}
                    onChange={(e) => setJumpStart(Number(e.target.value))}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Salto Dezenas</label>
                  <input
                    type="number"
                    value={jumpTens}
                    onChange={(e) => setJumpTens(Number(e.target.value))}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </>
          )}

          {selectedDiagram === 'symmetry' && (
            <>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Expressão Alvo</label>
                <input
                  type="text"
                  value={symmExpr}
                  onChange={(e) => setSymmExpr(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Centro de Ouro</label>
                  <input
                    type="number"
                    value={symmCenter}
                    onChange={(e) => setSymmCenter(Number(e.target.value))}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Delta (Distância)</label>
                  <input
                    type="number"
                    value={symmDelta}
                    onChange={(e) => setSymmDelta(Number(e.target.value))}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </>
          )}

          {selectedDiagram === 'unfolding' && (
            <div style={{ fontSize: '0.82rem', color: '#5C645F', lineHeight: 1.5 }}>
              O <strong>StructureUnfoldingSlate</strong> utiliza a decomposição formal algébrica da diferença de quadrados <code>(a − b)(a + b) = a² − b²</code>.
            </div>
          )}

          {/* CLS & Spec Compliance Check Badge */}
          <div
            style={{
              backgroundColor: '#DCEBE5',
              border: '1px solid #176B5B',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#176B5B',
            }}
          >
            <CheckCircle size={15} />
            <span>CLS = 0 Garantido via font-mono-tabular</span>
          </div>
        </div>

        {/* Viewport Frame Container */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#EAE6DB',
            borderRadius: '20px',
            padding: '24px',
            border: '1px dashed #D9D5C8',
            minHeight: '480px',
          }}
        >
          <div
            style={{
              width: viewportWidth,
              transition: 'width 200ms ease',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {selectedDiagram === 'factor' && (
              <FactorDualityDiagram
                expression={factorExpr}
                leftOperation={factorLeft}
                rightOperation={factorRight}
                exampleStep1={factorStep1}
                exampleStep2={factorStep2}
                finalResult={factorResult}
              />
            )}
            {selectedDiagram === 'percent' && (
              <PercentDoubleRuler
                expression={percentExpr}
                percentValue={percentVal}
                baseNumber={percentBase}
                calculatedValue={percentCalc}
                symmetricExpression={percentSymmExpr}
              />
            )}
            {selectedDiagram === 'jump' && (
              <PositionalJumpDiagram
                expression={jumpExpr}
                start={jumpStart}
                tensJump={jumpTens}
                intermediate={jumpInter}
                unitsJump={jumpUnits}
                finalTarget={jumpFinal}
              />
            )}
            {selectedDiagram === 'symmetry' && (
              <SymmetryRulerDiagram
                expression={symmExpr}
                leftValue={symmLeft}
                centerSupport={symmCenter}
                rightValue={symmRight}
                delta={symmDelta}
              />
            )}
            {selectedDiagram === 'unfolding' && <StructureUnfoldingSlate />}
          </div>
        </div>
      </div>
    </div>
  );
};
