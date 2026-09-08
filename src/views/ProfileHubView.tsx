import React, { useState } from 'react';
import { Shield, Sparkles, Volume2, Users, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { MOCK_USER_PROFILE, AURA_SKINS, MOCK_CLASSROOMS } from '../engine';
import { audioSynth } from '../services/audioSynth';

export function ProfileHubView() {
  const profile = MOCK_USER_PROFILE;
  const { radar } = profile;
  const classroom = MOCK_CLASSROOMS[0];
  const [vol, setVol] = useState(80);

  return (
    <div style={{ padding: '16px', paddingBottom: '90px', maxWidth: '390px', margin: '0 auto' }}>
      {/* User Card */}
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '18px',
          overflow: 'hidden',
          border: '2px solid #00F2FE',
          boxShadow: '0 0 16px rgba(0, 242, 254, 0.4)'
        }}>
          <img src="/assets/aura_spark.jpg" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{profile.displayName}</h3>
            <span style={{ fontSize: '0.65rem', padding: '2px 6px', backgroundColor: 'rgba(0, 242, 254, 0.15)', color: '#00F2FE', borderRadius: '6px', fontWeight: 700 }}>
              Nv. {profile.level}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#8A2BE2', fontWeight: 700 }}>{radar.archetypeTitle}</span>
          <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: '2px 0 0 0' }}>{radar.archetypeDescription}</p>
        </div>
      </div>

      {/* 5-Axis Radar Chart */}
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '16px',
        textAlign: 'center',
        marginBottom: '16px'
      }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0 0 12px 0' }}>DNA Cognitivo Pentagonal</h4>
        <div style={{ width: '220px', height: '220px', margin: '0 auto' }}>
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            {/* Background Polygons */}
            <polygon points="100,20 176,75 147,165 53,165 24,75" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
            <polygon points="100,50 145,82 128,136 72,136 55,82" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />

            {/* Radar Data */}
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

            {/* Labels */}
            <text x="100" y="14" fill="#00F2FE" fontSize="8" textAnchor="middle" fontWeight="bold">Velocidade ({radar.speedScore})</text>
            <text x="180" y="75" fill="#FACC15" fontSize="8" textAnchor="start" fontWeight="bold">Fermi ({radar.fermiScore})</text>
            <text x="150" y="178" fill="#C084FC" fontSize="8" textAnchor="start" fontWeight="bold">Flexibilidade ({radar.flexibilityScore})</text>
            <text x="50" y="178" fill="#10B981" fontSize="8" textAnchor="end" fontWeight="bold">Resistência ({radar.staminaScore})</text>
            <text x="20" y="75" fill="#FB7185" fontSize="8" textAnchor="end" fontWeight="bold">Memória ({radar.memoryScore})</text>
          </svg>
        </div>
      </div>

      {/* Aura Skins Showcase */}
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, margin: '0 0 10px 0' }}>Skins da Aura</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {AURA_SKINS.slice(0, 3).map(skin => (
            <div
              key={skin.id}
              style={{
                backgroundColor: 'rgba(19, 25, 38, 0.8)',
                border: skin.unlocked ? '1px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '10px 6px',
                textAlign: 'center'
              }}
            >
              <Sparkles size={20} color={skin.unlocked ? '#00F2FE' : '#64748B'} style={{ margin: '0 auto 4px auto' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>{skin.name}</div>
              <div style={{ fontSize: '0.62rem', color: skin.unlocked ? '#10B981' : '#64748B' }}>
                {skin.unlocked ? 'Equipado' : 'Bloqueado'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classroom Link */}
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="#8A2BE2" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{classroom.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Código: {classroom.inviteCode}</div>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#00F2FE', fontWeight: 700 }}>Turma Ativa</span>
        </div>
      </div>

      {/* Audio Volume Slider */}
      <div style={{
        backgroundColor: 'rgba(13, 17, 26, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
          <span>Volume Sintetizador Web Audio</span>
          <span style={{ color: '#00F2FE' }}>{vol}%</span>
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
    </div>
  );
}
