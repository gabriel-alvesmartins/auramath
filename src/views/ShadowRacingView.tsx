import React, { useState, useEffect } from 'react';
import { generateQuestion, generateGhostRun, Question } from '../engine';
import { NumpadWeb } from '../components/NumpadWeb';
import { audioSynth } from '../services/audioSynth';

export function ShadowRacingView() {
  const [ghost] = useState(() => generateGhostRun(1480));
  const [playerProgress, setPlayerProgress] = useState(0);
  const [ghostProgress, setGhostProgress] = useState(0);
  const [q, setQ] = useState<Question>(() => generateQuestion());
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setGhostProgress(prev => (prev >= 15 ? 15 : prev + 0.15));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (parseInt(inputVal, 10) === q.answer) {
      setPlayerProgress(prev => prev + 1);
      audioSynth.playSuccessNote(playerProgress + 1);
      setQ(generateQuestion());
      setInputVal('');
    } else {
      audioSynth.playErrorSoftRelease();
      setInputVal('');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Duelo Fantasma (1v1 Assíncrono)</h3>
        <p style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Corra contra a gravação de {ghost.opponentName} ({ghost.elo} Elo)</p>
      </div>

      <div style={{ backgroundColor: 'rgba(13, 17, 26, 0.8)', padding: '14px', borderRadius: '16px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span style={{ color: '#00F2FE', fontWeight: 700 }}>Você</span>
            <span>{playerProgress}/15 questões</span>
          </div>
          <div style={{ height: '10px', backgroundColor: '#1E293B', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${(playerProgress / 15) * 100}%`, height: '100%', backgroundColor: '#00F2FE', transition: 'width 0.3s' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span style={{ color: '#94A3B8', fontWeight: 700 }}>👻 {ghost.opponentName}</span>
            <span>{Math.floor(ghostProgress)}/15 questões</span>
          </div>
          <div style={{ height: '10px', backgroundColor: '#1E293B', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${(ghostProgress / 15) * 100}%`, height: '100%', backgroundColor: '#8A2BE2', transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2.4rem', fontWeight: 800 }}>
          {q.equation} = {inputVal || '?'}
        </div>
      </div>

      <NumpadWeb
        onInput={k => setInputVal(prev => prev + k)}
        onClear={() => setInputVal('')}
        onSubmit={handleSubmit}
      />
    </div>
  );
}



