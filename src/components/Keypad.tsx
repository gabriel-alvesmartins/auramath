import React from 'react';
import { Delete, Check } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

interface KeypadProps {
  onInput: (val: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({ onInput, onClear, onSubmit }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      width: '100%',
      maxWidth: '360px',
      margin: '0 auto',
      padding: '0 8px'
    }}>
      {keys.map(k => {
        const isOk = k === 'OK';
        const isClear = k === 'C';

        return (
          <button
            key={k}
            type="button"
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
              height: '58px',
              borderRadius: '16px',
              border: isOk
                ? '1px solid rgba(0, 242, 254, 0.5)'
                : isClear
                ? '1px solid rgba(251, 113, 133, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: isOk
                ? 'rgba(0, 242, 254, 0.18)'
                : isClear
                ? 'rgba(251, 113, 133, 0.12)'
                : 'rgba(19, 25, 38, 0.85)',
              color: isOk ? '#00F2FE' : isClear ? '#FB7185' : '#F8FAFC',
              fontSize: '1.4rem',
              fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isOk ? '0 4px 16px rgba(0, 242, 254, 0.25)' : '0 2px 6px rgba(0, 0, 0, 0.3)',
              userSelect: 'none',
              transition: 'transform 0.06s, background-color 0.1s',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.93)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.93)')}
            onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isClear ? <Delete size={22} /> : isOk ? <Check size={26} strokeWidth={3} /> : k}
          </button>
        );
      })}
    </div>
  );
};
