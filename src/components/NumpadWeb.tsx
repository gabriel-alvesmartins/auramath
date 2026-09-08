import React from 'react';
import { audioSynth } from '../services/audioSynth';

interface NumpadWebProps {
  onInput: (val: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

export const NumpadWeb: React.FC<NumpadWebProps> = ({ onInput, onClear, onSubmit }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      maxWidth: '340px',
      width: '100%',
      margin: '0 auto'
    }}>
      {keys.map(k => {
        const isOk = k === 'OK';
        const isClear = k === 'C';

        return (
          <button
            key={k}
            onClick={() => {
              if (isOk) {
                onSubmit();
              } else if (isClear) {
                audioSynth.playKeypressTick();
                onClear();
              } else {
                audioSynth.playKeypressTick();
                onInput(k);
              }
            }}
            style={{
              height: '56px',
              borderRadius: '14px',
              border: isOk ? '1px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: isOk
                ? 'rgba(0, 242, 254, 0.2)'
                : isClear
                ? 'rgba(251, 113, 133, 0.15)'
                : 'rgba(19, 25, 38, 0.9)',
              color: isOk ? '#00F2FE' : isClear ? '#FB7185' : '#F8FAFC',
              fontSize: isOk ? '1rem' : '1.35rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isOk ? '0 0 15px rgba(0, 242, 254, 0.25)' : 'none',
              transition: 'transform 0.08s, background-color 0.1s',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
};


