import React, { useState, useEffect } from 'react';
import { Flame, Clock, Trophy, Zap, ShieldAlert, Sparkles, Volume2, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuestion, Question, generateFlashAnzanSequence } from '../engine';
import { AuraAvatar } from '../components/AuraAvatar';
import { Keypad } from '../components/Keypad';
import { audioSynth } from '../services/audioSynth';

export function TrainHubView() {
  const [subMode, setSubMode] = useState<'arena' | 'blitz' | 'sudden' | 'anzan' | 'zen'>('arena');

  // Gameplay State
  const [q, setQ] = useState<Question>(() => generateQuestion());
  const [inputVal, setInputVal] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(subMode === 'blitz' ? 60 : 15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [mascotState, setMascotState] = useState<'idle' | 'happy' | 'hit'>('idle');
  const [errorFlash, setErrorFlash] = useState(false);

  // Flash Anzan specific state
  const [anzanSeq, setAnzanSeq] = useState<number[]>([]);
  const [anzanIdx, setAnzanIdx] = useState(-1);
  const [anzanPlaying, setAnzanPlaying] = useState(false);

  // Reset when submode changes
  useEffect(() => {
    setScore(0);
    setStreak(0);
    setInputVal('');
    setIsGameOver(false);
    setMascotState('idle');
    setQ(generateQuestion(subMode === 'zen' ? 'general' : undefined));
    setTimeLeft(subMode === 'blitz' ? 60 : 15);

    if (subMode === 'zen') {
      audioSynth.startZenMode();
    } else {
      audioSynth.stopZenMode();
    }

    return () => {
      audioSynth.stopZenMode();
    };
  }, [subMode]);

  // Timer loop for timed modes
  useEffect(() => {
    if (isGameOver || subMode === 'arena' || subMode === 'zen' || subMode === 'anzan') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          audioSynth.playErrorSoftRelease();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver, subMode, q]);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isGameOver) return;
      if (e.key >= '0' && e.key <= '9') {
        audioSynth.playKeypressTick();
        setInputVal(prev => prev + e.key);
      } else if (e.key === 'Backspace') {
        audioSynth.playKeypressTick();
        setInputVal(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        if (subMode === 'anzan') handleAnzanSubmit();
        else handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [inputVal, q, isGameOver, subMode, anzanSeq]);

  const handleSubmit = () => {
    if (!inputVal) return;
    const numericAns = parseInt(inputVal, 10);
    if (numericAns === q.answer) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore(prev => prev + 100 * Math.min(nextStreak, 5));
      setMascotState('happy');
      audioSynth.playSuccessNote(nextStreak);

      if (nextStreak % 5 === 0) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      }

      setQ(generateQuestion());
      setInputVal('');
      if (subMode === 'sudden') {
        setTimeLeft(Math.max(4, 12 - Math.floor(nextStreak / 2)));
      }
      setTimeout(() => setMascotState('idle'), 400);
    } else {
      setErrorFlash(true);
      setMascotState('hit');
      audioSynth.playErrorSoftRelease();
      if (subMode === 'sudden') {
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

  const startAnzan = () => {
    const seq = generateFlashAnzanSequence(6);
    setAnzanSeq(seq);
    setAnzanPlaying(true);
    setInputVal('');
    setAnzanIdx(0);

    let i = 0;
    const itv = setInterval(() => {
      i++;
      if (i < seq.length) {
        setAnzanIdx(i);
        audioSynth.playKeypressTick();
      } else {
        clearInterval(itv);
        setAnzanPlaying(false);
        setAnzanIdx(seq.length);
      }
    }, 400);
  };

  const handleAnzanSubmit = () => {
    const sum = anzanSeq.reduce((a, b) => a + b, 0);
    if (parseInt(inputVal, 10) === sum) {
      audioSynth.playSuccessNote(6);
      confetti({ particleCount: 35 });
      setScore(prev => prev + 500);
      setAnzanIdx(-1);
      setInputVal('');
    } else {
      audioSynth.playErrorSoftRelease();
      setInputVal('');
    }
  };

  return (
    <div style={{ paddingBottom: '90px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)' }}>
      {/* Submode Segmented Control */}
      <div style={{
        display: 'flex',
        padding: '6px 12px',
        backgroundColor: '#0B0F19',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        gap: '6px',
        overflowX: 'auto',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        {[
          { id: 'arena', label: 'Arena' },
          { id: 'blitz', label: 'Blitz 60s' },
          { id: 'sudden', label: 'Morte Súbita' },
          { id: 'anzan', label: 'Flash Anzan' },
          { id: 'zen', label: 'Flow Zen' }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => {
              setSubMode(m.id as any);
              audioSynth.playKeypressTick();
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: subMode === m.id ? '#00F2FE' : 'transparent',
              color: subMode === m.id ? '#07090E' : '#94A3B8',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Arena Stage */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 20px',
        maxWidth: '420px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Top Metric Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 14px',
          backgroundColor: 'rgba(13, 17, 26, 0.85)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={18} color={streak > 0 ? '#00F2FE' : '#64748B'} />
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#00F2FE' }}>{streak}x</span>
          </div>

          {(subMode === 'blitz' || subMode === 'sudden') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color={timeLeft <= 5 ? '#FB7185' : '#FACC15'} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: timeLeft <= 5 ? '#FB7185' : '#FACC15' }}>
                {timeLeft}s
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Trophy size={16} color="#38BDF8" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#F8FAFC' }}>
              {score}
            </span>
          </div>
        </div>

        {/* Center Arena Body */}
        {subMode === 'anzan' ? (
          <div style={{ textAlign: 'center', margin: 'auto 0' }}>
            {anzanIdx === -1 && (
              <button
                onClick={startAnzan}
                style={{
                  padding: '14px 28px',
                  borderRadius: '16px',
                  backgroundColor: '#00F2FE',
                  color: '#07090E',
                  fontWeight: 800,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Disparar Sequência Flash
              </button>
            )}

            {anzanPlaying && anzanIdx >= 0 && (
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '4.5rem',
                fontWeight: 900,
                color: '#00F2FE',
                textShadow: '0 0 25px rgba(0, 242, 254, 0.7)'
              }}>
                {anzanSeq[anzanIdx]}
              </div>
            )}

            {anzanIdx >= anzanSeq.length && (
              <div>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '8px' }}>Soma dos números:</p>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#FACC15',
                  marginBottom: '16px'
                }}>
                  {inputVal || '_'}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', margin: 'auto 0' }}>
            <AuraAvatar combo={streak} size={90} state={mascotState} />

            <div style={{
              margin: '16px 0 10px 0',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '2.8rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F8FAFC',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {q.equation}
            </div>

            {/* Answer Display Box with Soft Coral flash */}
            <div style={{
              height: '46px',
              maxWidth: '200px',
              margin: '0 auto',
              borderRadius: '12px',
              border: errorFlash ? '2px solid #FB7185' : '1px solid rgba(0, 242, 254, 0.4)',
              backgroundColor: errorFlash ? 'rgba(251, 113, 133, 0.15)' : 'rgba(13, 17, 26, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: errorFlash ? '#FB7185' : '#00F2FE'
            }}>
              {inputVal || <span style={{ opacity: 0.2 }}>_</span>}
            </div>

            {q.hint && (
              <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '8px' }}>
                💡 {q.hint}
              </p>
            )}
          </div>
        )}

        {/* Tactile Keypad */}
        <Keypad
          onInput={k => setInputVal(prev => prev + k)}
          onClear={() => setInputVal('')}
          onSubmit={subMode === 'anzan' ? handleAnzanSubmit : handleSubmit}
        />
      </div>

      {/* Game Over Overlay */}
      {isGameOver && (
        <div style={{
          position: 'fixed',
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
          zIndex: 50,
          padding: '24px'
        }}>
          <Trophy size={48} color="#FACC15" />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '12px 0 4px 0' }}>Rodada Finalizada</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Pontuação registrada no córtex neural.</p>

          <div style={{
            backgroundColor: 'rgba(19, 25, 38, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px 28px',
            margin: '18px 0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>PONTOS FINAIS</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2.2rem', fontWeight: 800, color: '#00F2FE' }}>
              {score}
            </div>
          </div>

          <button
            onClick={() => {
              setIsGameOver(false);
              setScore(0);
              setStreak(0);
              setInputVal('');
              setTimeLeft(subMode === 'blitz' ? 60 : 15);
              setQ(generateQuestion());
            }}
            style={{
              padding: '12px 28px',
              borderRadius: '14px',
              backgroundColor: '#00F2FE',
              color: '#07090E',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
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
