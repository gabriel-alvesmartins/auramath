import React, { useState } from 'react';
import { generateQuestion, Question } from '../engine';
import { NumpadWeb } from '../components/NumpadWeb';
import { audioSynth } from '../services/audioSynth';

export function FlowZenView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [streak, setStreak] = useState(0);
  const [q, setQ] = useState<Question>(() => generateQuestion());
  const [inputVal, setInputVal] = useState('');

  const toggleZen = () => {
    if (isPlaying) {
      audioSynth.stopZenMode();
      setIsPlaying(false);
    } else {
      audioSynth.startZenMode();
      setIsPlaying(true);
    }
  };

  const handleSubmit = () => {
    if (parseInt(inputVal, 10) === q.answer) {
      const next = streak + 1;
      setStreak(next);
      audioSynth.updateZenStreak(next);
      audioSynth.playSuccessNote(next);
      setQ(generateQuestion());
      setInputVal('');
    } else {
      audioSynth.playErrorSoftRelease();
      setInputVal('');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '16px', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38BDF8' }}>Modo Flow Zen</h3>
      <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '16px' }}>
        Aritmética meditativa sem tempo regressivo com sintetizador procedural Lofi (Rhodes, Chuva, Baixo)
      </p>

      <button
        onClick={toggleZen}
        style={{
          padding: '8px 16px',
          borderRadius: '20px',
          backgroundColor: isPlaying ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
          border: '1px solid #38BDF8',
          color: '#38BDF8',
          fontSize: '0.82rem',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {isPlaying ? '⏸ Pausar Música Lofi' : '▶ Ativar Camadas Sonoras Lofi'}
      </button>

      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2.5rem', fontWeight: 800, margin: '20px 0' }}>
        {q.equation} = {inputVal || '_'}
      </div>

      <NumpadWeb
        onInput={k => setInputVal(prev => prev + k)}
        onClear={() => setInputVal('')}
        onSubmit={handleSubmit}
      />
    </div>
  );
}



