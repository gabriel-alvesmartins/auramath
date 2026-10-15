import React, { useState } from 'react';
import { PrismaMascotWeb } from '../../components/PrismaMascotWeb';
import { PrismaMascotRive } from '../../components/PrismaMascotRive';
import { PrismaMascotState } from '../../services/mascot/animationRegistry';
import { Sparkles, Sliders, MessageSquare, Play, RefreshCw, Cpu, Layers } from 'lucide-react';

export const PrismaTheaterTab: React.FC = () => {
  const [renderMode, setRenderMode] = useState<'svg' | 'rive'>('svg');
  const [mascotState, setMascotState] = useState<PrismaMascotState>('idle');
  const [size, setSize] = useState(140);
  const [combo, setCombo] = useState(3);
  const [tailDir, setTailDir] = useState<'down' | 'down-left' | 'down-right'>('down');
  const [speechText, setSpeechText] = useState('Não calcule. Veja!');
  const [showBubble, setShowBubble] = useState(true);
  const [speed, setSpeed] = useState<'0.25' | '0.5' | '1'>('1');

  const states: Array<{ id: PrismaMascotState; label: string; desc: string }> = [
    { id: 'idle', label: '1. Idle', desc: 'Respiração suave do tórax e piscar a cada 4s' },
    { id: 'thinking', label: '2. Thinking', desc: 'Pêndulo sutil de dúvida e cálculo geométrico' },
    { id: 'hint', label: '3. Hint', desc: 'Vetor pontilhado apontando o esquadro âmbar' },
    { id: 'eureka', label: '4. Eureka', desc: 'Salto com squash & stretch e explosão' },
    { id: 'supernova', label: '5. Supernova', desc: 'Auréola solar 360° em rotação contínua' },
    { id: 'camouflaged', label: '6. Camouflaged', desc: 'Dissolução em tons de ardósia para streak' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#FFFDF6',
          border: '1px solid #D9D5C8',
          borderRadius: '16px',
          padding: '18px 24px',
          boxShadow: '0 2px 0 #C2BDAE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#176B5B" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#202522' }}>
              Palco de Ensaio do Mascote Prisma (Rive & SVG)
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#5C645F' }}>
            Inspecione a anatomia geométrica do Camaleão Geômetra Prisma em tempo real em todos os 6 estados canônicos.
          </p>
        </div>

        {/* Renderer Mode Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F7F4EA', padding: '4px', borderRadius: '10px', border: '1px solid #D9D5C8' }}>
          <button
            onClick={() => setRenderMode('svg')}
            style={{
              backgroundColor: renderMode === 'svg' ? '#176B5B' : 'transparent',
              color: renderMode === 'svg' ? '#FFFDF6' : '#5C645F',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Layers size={13} />
            <span>SVG Nativo</span>
          </button>

          <button
            onClick={() => setRenderMode('rive')}
            style={{
              backgroundColor: renderMode === 'rive' ? '#176B5B' : 'transparent',
              color: renderMode === 'rive' ? '#FFFDF6' : '#5C645F',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Cpu size={13} />
            <span>Rive Runtime (.riv)</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Controls + Live Theater Stage */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Left Column: Stage Controls */}
        <div
          style={{
            backgroundColor: '#FFFDF6',
            border: '1px solid #D9D5C8',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 0 #C2BDAE',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.92rem', color: '#202522' }}>
            <Sliders size={16} color="#176B5B" />
            <span>Estados Canônicos</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {states.map((st) => (
              <button
                key={st.id}
                onClick={() => setMascotState(st.id)}
                style={{
                  padding: '9px 10px',
                  backgroundColor: mascotState === st.id ? '#DCEBE5' : '#FFFDF6',
                  border: mascotState === st.id ? '2px solid #176B5B' : '1px solid #D9D5C8',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: mascotState === st.id ? 800 : 600,
                  color: mascotState === st.id ? '#176B5B' : '#202522',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Size & Combo Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '10px', borderTop: '1px solid #EAE6DB' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700 }}>
                <span>Dimensão do Mascote:</span>
                <span style={{ color: '#176B5B', fontWeight: 800 }}>{size}px</span>
              </div>
              <input
                type="range"
                min="60"
                max="260"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#176B5B' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700 }}>
                <span>Multiplicador de Combo:</span>
                <span style={{ color: '#176B5B', fontWeight: 800 }}>{combo}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={combo}
                onChange={(e) => setCombo(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F2B84B' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Direção da Cauda Fibonacci:</label>
              <select
                value={tailDir}
                onChange={(e) => setTailDir(e.target.value as any)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', marginTop: '4px' }}
              >
                <option value="down">Para Baixo (Padrão)</option>
                <option value="down-left">Para Baixo-Esquerda</option>
                <option value="down-right">Para Baixo-Direita</option>
              </select>
            </div>
          </div>

          {/* Speech Bubble Simulator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid #EAE6DB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C645F' }}>Balão de Fala:</span>
              <button
                onClick={() => setShowBubble((p) => !p)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#176B5B',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {showBubble ? 'Ocultar' : 'Exibir'}
              </button>
            </div>

            <input
              type="text"
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              placeholder="Digite o texto do balão..."
              style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #D9D5C8', fontSize: '0.8rem' }}
            />

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['Não calcule. Veja!', 'Eureka!', 'Fator 4 + 25 = 100', 'Quase lá!'].map((phrase) => (
                <button
                  key={phrase}
                  onClick={() => setSpeechText(phrase)}
                  style={{
                    backgroundColor: '#F7F4EA',
                    border: '1px solid #D9D5C8',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Staging Stage Canvas */}
        <div
          style={{
            backgroundColor: '#FFFDF6',
            border: '2px solid #202522',
            borderRadius: '20px',
            boxShadow: '0 4px 0 #202522',
            minHeight: '480px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '32px',
          }}
        >
          {/* Stage Background Grid */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(#D9D5C8 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />

          {/* Active State Indicator Pill */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              backgroundColor: '#DCEBE5',
              border: '1px solid #176B5B',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#176B5B',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={13} />
            <span>Estado: {mascotState.toUpperCase()} · Modo: {renderMode.toUpperCase()}</span>
          </div>

          {/* Render Active Mascot */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {renderMode === 'svg' ? (
              <PrismaMascotWeb
                state={mascotState}
                size={size}
                combo={combo}
                speechText={speechText}
                showSpeechBubble={showBubble}
                tailDirection={tailDir}
              />
            ) : (
              <PrismaMascotRive
                state={mascotState}
                size={size}
                combo={combo}
                speechText={speechText}
                showSpeechBubble={showBubble}
                fallbackToSvg={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
