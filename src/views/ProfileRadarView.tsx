import React from 'react';
import { MOCK_USER_PROFILE, AURA_SKINS } from '../engine';
import { AuraMascotWeb } from '../components/AuraMascotWeb';

export function ProfileRadarView() {
  const profile = MOCK_USER_PROFILE;
  const { radar } = profile;

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '16px' }}>
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #00F2FE, #8A2BE2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)'
        }}>
          <AuraMascotWeb size={50} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{profile.displayName}</h3>
          <span style={{ fontSize: '0.75rem', color: '#00F2FE', fontWeight: 700 }}>NÍVEL {profile.level} • {radar.archetypeTitle}</span>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '2px 0 0 0' }}>{radar.archetypeDescription}</p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '20px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>DNA Cognitivo Pentagonal</h4>
        <div style={{ width: '260px', height: '260px', margin: '0 auto' }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <polygon points="100,20 176,75 147,165 53,165 24,75" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
            <polygon points="100,50 145,82 128,136 72,136 55,82" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />

            <polygon
              points={`
                100,${100 - (radar.speedScore * 0.8)}
                ${100 + (radar.fermiScore * 0.76)},${100 - (radar.fermiScore * 0.25)}
                ${100 + (radar.flexibilityScore * 0.47)},${100 + (radar.flexibilityScore * 0.65)}
                ${100 - (radar.staminaScore * 0.47)},${100 + (radar.staminaScore * 0.65)}
                ${100 - (radar.memoryScore * 0.76)},${100 - (radar.memoryScore * 0.25)}
              `}
              fill="rgba(0, 242, 254, 0.25)"
              stroke="#00F2FE"
              strokeWidth="2"
            />

            <text x="100" y="14" fill="#00F2FE" fontSize="9" textAnchor="middle" fontWeight="bold">Velocidade ({radar.speedScore})</text>
            <text x="180" y="75" fill="#FACC15" fontSize="9" textAnchor="start" fontWeight="bold">Fermi ({radar.fermiScore})</text>
            <text x="155" y="178" fill="#C084FC" fontSize="9" textAnchor="start" fontWeight="bold">Flexibilidade ({radar.flexibilityScore})</text>
            <text x="45" y="178" fill="#10B981" fontSize="9" textAnchor="end" fontWeight="bold">Resistência ({radar.staminaScore})</text>
            <text x="18" y="75" fill="#FB7185" fontSize="9" textAnchor="end" fontWeight="bold">Memória ({radar.memoryScore})</text>
          </svg>
        </div>
      </div>

      <div style={{ backgroundColor: 'rgba(13, 17, 26, 0.9)', borderRadius: '20px', padding: '16px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Guarda-Roupa da Aura</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
          {AURA_SKINS.map(skin => (
            <div
              key={skin.id}
              style={{
                backgroundColor: 'rgba(19, 25, 38, 0.8)',
                border: skin.unlocked ? '1px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '10px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>✨</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{skin.name}</div>
              <div style={{ fontSize: '0.68rem', color: skin.unlocked ? '#10B981' : '#64748B' }}>
                {skin.unlocked ? 'Desbloqueado' : skin.rarity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

