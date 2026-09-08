import React, { useState } from 'react';

export function TactileGeometryLabView() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);

  const aSq = a * a;
  const bSq = b * b;
  const ab = a * b;
  const total = (a + b) * (a + b);

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00F2FE' }}>Laboratório Tátil de Geometria</h3>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Visualização cinética proporcional de (a + b)² = a² + 2ab + b²</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.82rem', color: '#00F2FE', fontWeight: 700 }}>Termo A: {a}</label>
          <input
            type="range"
            min="1"
            max="8"
            value={a}
            onChange={e => setA(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: '#00F2FE' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.82rem', color: '#8A2BE2', fontWeight: 700 }}>Termo B: {b}</label>
          <input
            type="range"
            min="1"
            max="8"
            value={b}
            onChange={e => setB(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: '#8A2BE2' }}
          />
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `${a * 25}px ${b * 25}px`,
          gridTemplateRows: `${a * 25}px ${b * 25}px`,
          gap: '4px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: 'rgba(0, 242, 254, 0.3)',
            border: '2px solid #00F2FE',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
            color: '#00F2FE'
          }}>
            a² ({aSq})
          </div>

          <div style={{
            backgroundColor: 'rgba(250, 204, 21, 0.25)',
            border: '2px solid #FACC15',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
            color: '#FACC15'
          }}>
            ab ({ab})
          </div>

          <div style={{
            backgroundColor: 'rgba(250, 204, 21, 0.25)',
            border: '2px solid #FACC15',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
            color: '#FACC15'
          }}>
            ab ({ab})
          </div>

          <div style={{
            backgroundColor: 'rgba(138, 43, 226, 0.3)',
            border: '2px solid #8A2BE2',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
            color: '#C084FC'
          }}>
            b² ({bSq})
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
          <span style={{ color: '#00F2FE' }}>({a} + {b})²</span> = <span style={{ color: '#00F2FE' }}>{aSq}</span> + <span style={{ color: '#FACC15' }}>2×{ab}</span> + <span style={{ color: '#C084FC' }}>{bSq}</span> = <strong style={{ color: '#10B981', fontSize: '1.2rem' }}>{total}</strong>
        </div>
      </div>
    </div>
  );
}
