import React from 'react';

interface AuraAvatarProps {
  combo?: number;
  size?: number;
  state?: 'idle' | 'happy' | 'hit';
  showBadge?: boolean;
}

export const AuraAvatar: React.FC<AuraAvatarProps> = ({
  combo = 1,
  size = 84,
  state = 'idle',
  showBadge = true
}) => {
  const stage = combo >= 35 ? 5 : combo >= 20 ? 4 : combo >= 10 ? 3 : combo >= 5 ? 2 : 1;

  const stageMeta = [
    { name: 'Spark', color: '#00F2FE', glow: 'rgba(0, 242, 254, 0.6)', img: '/assets/aura_spark.jpg' },
    { name: 'Surge', color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.6)', img: '/assets/aura_spark.jpg' },
    { name: 'Overdrive', color: '#8A2BE2', glow: 'rgba(138, 43, 226, 0.7)', img: '/assets/aura_supernova.jpg' },
    { name: 'Supernova', color: '#FACC15', glow: 'rgba(250, 204, 21, 0.8)', img: '/assets/aura_supernova.jpg' },
    { name: 'Singularity', color: '#E11D48', glow: 'rgba(225, 29, 72, 0.85)', img: '/assets/aura_supernova.jpg' }
  ][stage - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        className="animate-float"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          padding: '3px',
          background: `linear-gradient(135deg, ${stageMeta.color}, rgba(13, 17, 26, 0.3))`,
          boxShadow: `0 0 24px ${stageMeta.glow}`,
          position: 'relative',
          transform: state === 'hit' ? 'scale(0.92) rotate(-4deg)' : state === 'happy' ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <img
          src={stageMeta.img}
          alt="Aura Mascot"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        {/* Pulsing ring */}
        <div style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          border: `1.5px dashed ${stageMeta.color}`,
          opacity: 0.5,
          pointerEvents: 'none'
        }} />
      </div>

      {showBadge && (
        <div style={{
          marginTop: '8px',
          fontSize: '0.68rem',
          fontWeight: 800,
          letterSpacing: '0.06em',
          color: stageMeta.color,
          backgroundColor: 'rgba(13, 17, 26, 0.9)',
          padding: '3px 10px',
          borderRadius: '12px',
          border: `1px solid ${stageMeta.color}40`,
          textTransform: 'uppercase'
        }}>
          {stageMeta.name} {combo > 1 ? `${combo}x` : ''}
        </div>
      )}
    </div>
  );
};
