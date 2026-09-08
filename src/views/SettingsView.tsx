import React, { useState } from 'react';
import { audioSynth } from '../services/audioSynth';

export function SettingsView() {
  const [vol, setVol] = useState(80);

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '16px' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Configurações & Ergonomia</h3>

      <div style={{ backgroundColor: 'rgba(13, 17, 26, 0.9)', borderRadius: '16px', padding: '16px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 700 }}>Volume Sintetizador Web Audio</label>
          <span style={{ color: '#00F2FE', fontFamily: 'JetBrains Mono, monospace' }}>{vol}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={vol}
          onChange={e => {
            const v = parseInt(e.target.value, 10);
            setVol(v);
            audioSynth.setMasterVolume(v / 100);
          }}
          style={{ width: '100%', accentColor: '#00F2FE' }}
        />
      </div>

      <div style={{ backgroundColor: 'rgba(13, 17, 26, 0.9)', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Feedback Háptico</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Vibração micro-tátil a cada toque numérico</div>
        </div>
        <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#00F2FE' }} />
      </div>
    </div>
  );
}


