import React from 'react';

interface AuraMascotWebProps {
  combo?: number;
  size?: number;
  state?: 'idle' | 'happy' | 'hit' | 'supernova';
}

export const AuraMascotWeb: React.FC<AuraMascotWebProps> = ({ combo = 1, size = 90, state = 'idle' }) => {
  const stage = combo >= 35 ? 5 : combo >= 20 ? 4 : combo >= 10 ? 3 : combo >= 5 ? 2 : 1;
  const stageInfo = [
    { name: 'Spark', core: '#00F2FE', outer: '#8A2BE2', glow: 'rgba(0, 242, 254, 0.4)' },
    { name: 'Surge', core: '#38BDF8', outer: '#6366F1', glow: 'rgba(56, 189, 248, 0.5)' },
    { name: 'Overdrive', core: '#8A2BE2', outer: '#E11D48', glow: 'rgba(138, 43, 226, 0.6)' },
    { name: 'Supernova', core: '#FACC15', outer: '#F97316', glow: 'rgba(250, 204, 21, 0.7)' },
    { name: 'Singularity', core: '#E11D48', outer: '#00F2FE', glow: 'rgba(225, 29, 72, 0.8)' }
  ][stage - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="animate-float" style={{ width: size, height: size, filter: `drop-shadow(0 0 18px ${stageInfo.glow})` }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <radialGradient id={`auraGrad_${stage}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={stageInfo.core} stopOpacity="1" />
              <stop offset="65%" stopColor={stageInfo.outer} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#07090E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Energy Orbit Rings */}
          <circle cx="50" cy="50" r="42" fill="none" stroke={stageInfo.core} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
          {stage >= 3 && (
            <circle cx="50" cy="50" r="46" fill="none" stroke={stageInfo.outer} strokeWidth="2" strokeDasharray="8 6" opacity="0.6" />
          )}

          {/* Main Core Body */}
          <circle cx="50" cy="50" r="34" fill={`url(#auraGrad_${stage})`} />

          {/* Bioluminescent Eyes */}
          {state === 'hit' ? (
            <g stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round">
              <line x1="38" y1="44" x2="44" y2="50" />
              <line x1="44" y1="44" x2="38" y2="50" />
              <line x1="56" y1="44" x2="62" y2="50" />
              <line x1="62" y1="44" x2="56" y2="50" />
            </g>
          ) : (
            <g fill="#F8FAFC">
              <ellipse cx="41" cy="46" rx="4.5" ry="6" />
              <ellipse cx="59" cy="46" rx="4.5" ry="6" />
              <circle cx="43" cy="44" r="2" fill="#07090E" />
              <circle cx="61" cy="44" r="2" fill="#07090E" />
            </g>
          )}

          {/* Mouth */}
          <path
            d={state === 'hit' ? "M 44 60 Q 50 56 56 60" : "M 42 56 Q 50 64 58 56"}
            fill="none"
            stroke="#F8FAFC"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div style={{
        marginTop: '6px',
        fontSize: '0.72rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: stageInfo.core,
        backgroundColor: 'rgba(13, 17, 26, 0.8)',
        padding: '2px 8px',
        borderRadius: '10px',
        border: `1px solid ${stageInfo.core}40`
      }}>
        Tier {stage}: {stageInfo.name}
      </div>
    </div>
  );
};
