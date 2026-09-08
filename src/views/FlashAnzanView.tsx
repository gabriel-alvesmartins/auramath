import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { generateFlashAnzanSequence } from '../engine';
import { NumpadWeb } from '../components/NumpadWeb';
import { audioSynth } from '../services/audioSynth';

export function FlashAnzanView() {
  const [sequence] = useState(() => generateFlashAnzanSequence(6));
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState<boolean | null>(null);

  const totalSum = sequence.reduce((a, b) => a + b, 0);

  const startSequence = () => {
    setIsPlaying(true);
    setResult(null);
    setInputVal('');
    setCurrentIdx(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < sequence.length) {
        setCurrentIdx(idx);
        audioSynth.playKeypressTick();
      } else {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentIdx(sequence.length);
      }
    }, 400);
  };

  const handleVerify = () => {
    const isOk = parseInt(inputVal, 10) === totalSum;
    setResult(isOk);
    if (isOk) {
      audioSynth.playSuccessNote(8);
      confetti({ particleCount: 30 });
    } else {
      audioSynth.playErrorSoftRelease();
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '16px', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Flash Anzan Visuoespacial</h3>
      <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '24px' }}>
        Projeção de números rápidos para ativação do ábaco mental
      </p>

      {currentIdx === -1 && (
        <button
          onClick={startSequence}
          style={{
            padding: '14px 28px',
            borderRadius: '14px',
            backgroundColor: '#00F2FE',
            color: '#07090E',
            border: 'none',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Iniciar Projeção Flash (400ms)
        </button>
      )}

      {isPlaying && currentIdx >= 0 && currentIdx < sequence.length && (
        <div style={{
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '4.5rem',
          fontWeight: 900,
          color: '#00F2FE',
          textShadow: '0 0 30px rgba(0, 242, 254, 0.7)'
        }}>
          {sequence[currentIdx]}
        </div>
      )}

      {currentIdx >= sequence.length && (
        <div>
          <p style={{ fontSize: '1rem', color: '#94A3B8', marginBottom: '12px' }}>Qual foi a soma calculada?</p>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2.5rem', fontWeight: 800, color: '#FACC15', marginBottom: '16px' }}>
            {inputVal || '_'}
          </div>

          <NumpadWeb
            onInput={k => setInputVal(prev => prev + k)}
            onClear={() => setInputVal('')}
            onSubmit={handleVerify}
          />

          {result !== null && (
            <div style={{ marginTop: '16px', fontSize: '1.1rem', fontWeight: 800, color: result ? '#10B981' : '#FB7185' }}>
              {result ? '✓ Perfeito! O ábaco mental acertou.' : `Incorreto! A soma real foi ${totalSum}.`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}



