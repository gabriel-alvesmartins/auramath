import React from 'react';
import { AuraMascotWeb, AuraMascotStage, AuraMascotState } from './AuraMascotWeb';

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
  showBadge = true,
}) => {
  const stageNum: number = combo >= 35 ? 5 : combo >= 20 ? 4 : combo >= 10 ? 3 : combo >= 5 ? 2 : 1;
  const stageMap: Record<number, AuraMascotStage> = {
    1: 'dot',
    2: 'line',
    3: 'shape',
    4: 'pattern',
    5: 'insight',
  };
  const stageKey = stageMap[stageNum] || 'dot';

  const stageLabels: Record<number, { name: string; color: string }> = {
    1: { name: 'Ponto', color: '#176B5B' },
    2: { name: 'Linha', color: '#6E5AA6' },
    3: { name: 'Forma', color: '#E76F61' },
    4: { name: 'Padrão', color: '#F2B84B' },
    5: { name: 'Insight', color: '#176B5B' },
  };

  const currentMeta = stageLabels[stageNum];
  const mascotState: AuraMascotState = state === 'hit' ? 'thinking' : state === 'happy' ? 'happy' : 'idle';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <AuraMascotWeb
          size={size}
          stage={stageNum as AuraMascotStage}
          state={mascotState}
          showTierBadge={false}
          showSpeechBubble={false}
        />
      </div>

      {showBadge && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: 'var(--color-ink, #202522)',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            padding: '3px 10px',
            borderRadius: '12px',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
            boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: currentMeta.color,
              display: 'inline-block',
            }}
          />
          {currentMeta.name} {combo > 1 ? `${combo}x` : ''}
        </div>
      )}
    </div>
  );
};

