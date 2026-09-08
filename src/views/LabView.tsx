import React, { useState } from 'react';

export function LabView() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);

  const aSq = a * a;
  const bSq = b * b;
  const ab = a * b;
  const total = (a + b) * (a + b);

  return (
    <div style={{ padding: '16px', paddingBottom: '90px', maxWidth: '390px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>Laboratório Tátil</h2>
        <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '4px 0 0 0' }}>Visualização Cinética de (a + b)² = a² + 2ab + b²</p>
      </div>

      {/* Sliders */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div style={{ flex: 1, backgroundColor: 'rgba(13, 17, 26, 0.8)', padding: '10px 14px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#00F2FE' }}>
            <span>Termo a</span>
            <span>{a}</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={a}
            onChange={e => setA(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: '#00F2FE', marginTop: '6px' }}
          />
        </div>

        <div style={{ flex: 1, backgroundColor: 'rgba(13, 17, 26, 0.8)', padding: '10px 14px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#8A2BE2' }}>
            <span>Termo b</span>
            <span>{b}</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={b}
            onChange={e => setB(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: '#8A2BE2', marginTop: '6px' }}
          />
        </div>
      </div>

      {/* Geometric Square Canvas */}
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `${a * 24}px ${b * 24}px`,
          gridTemplateRows: `${a * 24}px ${b * 24}px`,
          gap: '3px',
          margin: '0 auto',
          transition: 'all 0.2s'
        }}>
          {/* a² */}
          <div style={{
            backgroundColor: 'rgba(0, 242, 254, 0.25)',
            border: '2px solid #00F2FE',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: '#00F2FE'
          }}>
            a² ({aSq})
          </div>

          {/* ab */}
          <div style={{
            backgroundColor: 'rgba(250, 204, 21, 0.2)',
            border: '2px solid #FACC15',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: '#FACC15'
          }}>
            ab ({ab})
          </div>

          {/* ab */}
          <div style={{
            backgroundColor: 'rgba(250, 204, 21, 0.2)',
            border: '2px solid #FACC15',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: '#FACC15'
          }}>
            ab ({ab})
          </div>

          {/* b² */}
          <div style={{
            backgroundColor: 'rgba(138, 43, 226, 0.25)',
            border: '2px solid #8A2BE2',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: '#C084FC'
          }}>
            b² ({bSq})
          </div>
        </div>

        {/* Formula breakdown */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: 'rgba(19, 25, 38, 0.8)',
          borderRadius: '14px',
          width: '100%',
          textAlign: 'center',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.9rem'
        }}>
          <div>
            <span style={{ color: '#00F2FE' }}>({a} + {b})²</span> = <span style={{ color: '#00F2FE' }}>{aSq}</span> + <span style={{ color: '#FACC15' }}>2×{ab}</span> + <span style={{ color: '#C084FC' }}>{bSq}</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '1.3rem', fontWeight: 800, color: '#10B981' }}>
            = {total}
          </div>
        </div>
      </div>
    </div>
  );
}
