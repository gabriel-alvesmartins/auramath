import React, { useState, useEffect } from 'react';
import { Flame, Clock, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuestion, Question } from '../engine';
import { AuraMascotWeb } from '../components/AuraMascotWeb';
import { NumpadWeb } from '../components/NumpadWeb';
import { audioSynth } from '../services/audioSynth';

export function ArenaView({ mode = 'arena' }: { mode?: 'arena' | 'blitz' | 'sudden' }) {
  const [currentQ, setCurrentQ] = useState<Question>(() => generateQuestion());
  const [inputVal, setInputVal] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === 'blitz' ? 60 : 15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [mascotState, setMascotState] = useState<'idle' | 'happy' | 'hit'>('idle');
  const [errorFlash, setErrorFlash] = useState(false);

  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsGameOver(true);
          audioSynth.playErrorSoftRelease();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, currentQ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      if (e.key >= '0' && e.key <= '9') {
        audioSynth.playKeypressTick();
        setInputVal(prev => prev + e.key);
      } else if (e.key === 'Backspace') {
        audioSynth.playKeypressTick();
        setInputVal(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputVal, currentQ, isGameOver]);

  const handleSubmit = () => {
    if (!inputVal) return;
    const numericAns = parseInt(inputVal, 10);
    if (numericAns === currentQ.answer) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(score + 100 * Math.min(newStreak, 5));
      setMascotState('happy');
      audioSynth.playSuccessNote(newStreak);

      if (newStreak % 5 === 0) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      }

      setCurrentQ(generateQuestion());
      setInputVal('');
      if (mode === 'sudden') {
        setTimeLeft(Math.max(4, 12 - Math.floor(newStreak / 2)));
      }
      setTimeout(() => setMascotState('idle'), 400);
    } else {
      setErrorFlash(true);
      setMascotState('hit');
      audioSynth.playErrorSoftRelease();
      if (mode === 'sudden') {
        setIsGameOver(true);
      } else {
        setStreak(0);
      }
      setTimeout(() => {
        setErrorFlash(false);
        setMascotState('idle');
        setInputVal('');
      }, 500);
    }
  };

  const restartGame = () => {
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setTimeLeft(mode === 'blitz' ? 60 : 15);
    setCurrentQ(generateQuestion());
    setInputVal('');
  };

  return (
    <div style={{
      maxWidth: '440px',
      margin: '0 auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '600px',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        backgroundColor: 'rgba(13, 17, 26, 0.8)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={20} color={streak > 0 ? '#00F2FE' : '#64748B'} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#00F2FE' }}>{streak}x</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={18} color={timeLeft <= 5 ? '#FB7185' : '#FACC15'} />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: timeLeft <= 5 ? '#FB7185' : '#FACC15'
          }}>
            {timeLeft}s
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>PONTOS</span>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1.1rem', color: '#F8FAFC' }}>
            {score}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '14px 0' }}>
        <AuraMascotWeb combo={streak} size={90} state={mascotState} />

        <div style={{ marginTop: '10px' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#8A2BE2',
            backgroundColor: 'rgba(138, 43, 226, 0.15)',
            border: '1px solid rgba(138, 43, 226, 0.3)',
            padding: '3px 10px',
            borderRadius: '20px'
          }}>
            {currentQ.technique || 'Aritmética Mental'}
          </span>
        </div>

        <div style={{
          margin: '16px 0 10px 0',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '2.5rem',
          fontWeight: 800,
          letterSpacing: '0.02em',
          color: '#F8FAFC',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {currentQ.equation}
        </div>

        <div style={{
          height: '48px',
          maxWidth: '220px',
          margin: '0 auto',
          borderRadius: '12px',
          border: errorFlash ? '2px solid #FB7185' : '1px solid rgba(0, 242, 254, 0.4)',
          backgroundColor: errorFlash ? 'rgba(251, 113, 133, 0.15)' : 'rgba(13, 17, 26, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '1.7rem',
          fontWeight: 800,
          color: errorFlash ? '#FB7185' : '#00F2FE',
          transition: 'all 0.15s'
        }}>
          {inputVal || <span style={{ opacity: 0.25 }}>_</span>}
        </div>

        {currentQ.hint && (
          <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px' }}>
            💡 {currentQ.hint}
          </p>
        )}
      </div>

      <NumpadWeb
        onInput={k => setInputVal(prev => prev + k)}
        onClear={() => setInputVal('')}
        onSubmit={handleSubmit}
      />

      {isGameOver && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(7, 9, 14, 0.92)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          padding: '24px',
          borderRadius: '20px'
        }}>
          <Trophy size={48} color="#FACC15" />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '12px 0 4px 0' }}>Fim de Partida!</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Parabéns pelo treino neural.</p>

          <div style={{
            backgroundColor: 'rgba(19, 25, 38, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px 24px',
            margin: '18px 0',
            textAlign: 'center',
            width: '100%',
            maxWidth: '260px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>PONTUAÇÃO</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 800, color: '#00F2FE' }}>
              {score}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#FACC15', marginTop: '4px' }}>
              Maior Streak: {streak}x
            </div>
          </div>

          <button
            onClick={restartGame}
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              backgroundColor: '#00F2FE',
              color: '#07090E',
              border: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
}



