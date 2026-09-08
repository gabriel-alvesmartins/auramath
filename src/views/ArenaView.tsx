import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Clock, Trophy, RotateCcw, Sparkles, Zap, ArrowLeft, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuestion, Question } from '../engine';
import { AuraMascotWeb } from '../components/AuraMascotWeb';
import { NumpadWeb } from '../components/NumpadWeb';
import { audioSynth } from '../services/audioSynth';

interface ArenaViewProps {
  mode?: 'arena' | 'blitz' | 'sudden';
  onBackToTrack?: () => void;
}

export function ArenaView({ mode = 'blitz', onBackToTrack }: ArenaViewProps) {
  const [currentMode, setCurrentMode] = useState<'arena' | 'blitz' | 'sudden'>(mode);
  const [currentQ, setCurrentQ] = useState<Question>(() => generateQuestion());
  const [inputVal, setInputVal] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(currentMode === 'blitz' ? 60 : 15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [mascotState, setMascotState] = useState<'idle' | 'happy' | 'hit'>('idle');
  const [errorFlash, setErrorFlash] = useState(false);

  // Timer regressivo para Blitz e Morte Súbita
  useEffect(() => {
    if (isGameOver || currentMode === 'arena') return;
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
  }, [isGameOver, currentMode]);

  const handleSubmit = useCallback(() => {
    if (!inputVal) return;
    const numericAns = parseInt(inputVal, 10);
    setTotalAnswered(prev => prev + 1);

    if (numericAns === currentQ.answer) {
      // Acerto
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setCorrectCount(prev => prev + 1);

      const bonusMultiplier = 1 + newStreak * 0.15;
      const points = Math.round(100 * bonusMultiplier);
      setScore(prev => prev + points);

      setMascotState('happy');
      audioSynth.playSuccessNote(newStreak);

      if (newStreak % 5 === 0) {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#00F2FE', '#8A2BE2', '#FACC15'],
        });
      }

      setCurrentQ(generateQuestion());
      setInputVal('');

      if (currentMode === 'sudden') {
        setTimeLeft(Math.max(4, 12 - Math.floor(newStreak / 2)));
      }

      setTimeout(() => setMascotState('idle'), 350);
    } else {
      // Erro Empático (Soft Coral)
      setErrorFlash(true);
      setMascotState('hit');
      audioSynth.playErrorSoftRelease();

      if (currentMode === 'sudden') {
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
  }, [currentMode, currentQ.answer, inputVal, maxStreak, streak]);

  // Teclado físico do computador
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      if (e.key >= '0' && e.key <= '9') {
        audioSynth.playKeypressTick();
        setInputVal(prev => (prev.length < 5 ? prev + e.key : prev));
      } else if (e.key === 'Backspace') {
        audioSynth.playKeypressTick();
        setInputVal(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, isGameOver]);

  const restartGame = () => {
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalAnswered(0);
    setCorrectCount(0);
    setIsGameOver(false);
    setTimeLeft(currentMode === 'blitz' ? 60 : 15);
    setCurrentQ(generateQuestion());
    setInputVal('');
  };

  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 100;
  const multiplier = Math.max(1, 1 + streak * 0.15);

  return (
    <div style={{
      maxWidth: '460px',
      margin: '0 auto',
      minHeight: '82vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '12px 14px 24px',
      boxSizing: 'border-box',
    }}>
      {/* 1. SELETOR DE MODO & CABEÇALHO DA ARENA */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}>
          {onBackToTrack && (
            <button
              type="button"
              onClick={onBackToTrack}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Voltar à Trilha"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          {/* Abas Rápidas de Modo */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(13, 17, 26, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '3px',
            gap: '3px',
            flex: 1,
            margin: onBackToTrack ? '0 10px' : '0 auto',
            maxWidth: '320px',
          }}>
            {[
              { id: 'blitz', label: '⏱️ Blitz 60s' },
              { id: 'arena', label: '⚡ Zen Livre' },
              { id: 'sudden', label: '💀 Morte Súbita' },
            ].map(m => {
              const isCur = currentMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setCurrentMode(m.id as any);
                    audioSynth.playKeypressTick();
                    setScore(0);
                    setStreak(0);
                    setTimeLeft(m.id === 'blitz' ? 60 : 15);
                    setIsGameOver(false);
                    setInputVal('');
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isCur ? 'rgba(0, 242, 254, 0.2)' : 'transparent',
                    color: isCur ? '#00F2FE' : '#94A3B8',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. HUD DE ENERGIA & CRONÔMETRO (LEI 80/20) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(13, 17, 26, 0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '10px 18px',
          marginBottom: '16px',
        }}>
          {/* Cronômetro */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: timeLeft <= 5 && currentMode !== 'arena' ? 'rgba(251, 113, 133, 0.2)' : 'rgba(0, 242, 254, 0.1)',
              border: `1.5px solid ${timeLeft <= 5 && currentMode !== 'arena' ? '#FB7185' : '#00F2FE'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: timeLeft <= 5 && currentMode !== 'arena' ? '0 0 14px rgba(251, 113, 133, 0.4)' : 'none',
            }}>
              <Clock size={18} color={timeLeft <= 5 && currentMode !== 'arena' ? '#FB7185' : '#00F2FE'} />
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
                {currentMode === 'arena' ? 'SEM TEMPO' : 'TEMPO'}
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: timeLeft <= 5 && currentMode !== 'arena' ? '#FB7185' : '#F8FAFC',
              }}>
                {currentMode === 'arena' ? '∞' : `${timeLeft}s`}
              </div>
            </div>
          </div>

          {/* Streak & Multiplicador */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: streak > 0 ? 'rgba(250, 204, 21, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${streak > 0 ? 'rgba(250, 204, 21, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
            padding: '4px 12px',
            borderRadius: '14px',
          }}>
            <Flame size={18} color={streak > 0 ? '#FACC15' : '#64748B'} />
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 800 }}>COMBO</div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '1.1rem',
                fontWeight: 900,
                color: streak > 0 ? '#FACC15' : '#94A3B8',
              }}>
                x{multiplier.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Pontuação */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 800 }}>SCORE</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.3rem',
              fontWeight: 900,
              color: '#00F2FE',
              textShadow: '0 0 12px rgba(0, 242, 254, 0.35)',
            }}>
              {score}
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONSOLE HOLOGRÁFICO DA EQUAÇÃO COM MASCOTE AURA */}
      <div style={{
        position: 'relative',
        margin: '10px 0 18px',
      }}>
        {/* Mascote Aura Reativo Ancorado no Topo */}
        <div style={{
          position: 'absolute',
          top: '-42px',
          right: '24px',
          zIndex: 10,
        }}>
          <AuraMascotWeb combo={streak} size={74} state={mascotState} />
        </div>

        {/* Card Holográfico da Equação */}
        <div style={{
          backgroundColor: errorFlash ? 'rgba(251, 113, 133, 0.15)' : 'rgba(13, 17, 26, 0.85)',
          backdropFilter: 'blur(16px)',
          border: `1.5px solid ${errorFlash ? '#FB7185' : 'rgba(0, 242, 254, 0.3)'}`,
          borderRadius: '24px',
          padding: '24px 20px 20px',
          boxShadow: errorFlash
            ? '0 0 35px rgba(251, 113, 133, 0.35)'
            : '0 0 30px rgba(0, 242, 254, 0.15), inset 0 0 20px rgba(0, 242, 254, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Badge da Técnica */}
          <div style={{
            backgroundColor: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            padding: '3px 12px',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#00F2FE',
            letterSpacing: '0.06em',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}>
            {currentQ.technique.toUpperCase()}
          </div>

          {/* Linha da Equação — Zero Layout Shift com JetBrains Mono */}
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            fontWeight: 900,
            color: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            minHeight: '64px',
          }}>
            <span>{currentQ.equation}</span>
            <span style={{ color: '#00F2FE' }}>=</span>

            {/* Bounding Box de Input Fixa */}
            <div style={{
              minWidth: '80px',
              height: '52px',
              backgroundColor: 'rgba(7, 9, 14, 0.85)',
              border: `2px solid ${inputVal ? '#00F2FE' : 'rgba(255, 255, 255, 0.15)'}`,
              borderRadius: '14px',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00F2FE',
              boxShadow: inputVal ? '0 0 16px rgba(0, 242, 254, 0.35)' : 'none',
              letterSpacing: '0.05em',
            }}>
              {inputVal || <span style={{ opacity: 0.3, color: '#FFF' }}>?</span>}
            </div>
          </div>

          {/* Dica Pedagógica Sutil */}
          {currentQ.hint && (
            <div style={{
              marginTop: '14px',
              fontSize: '0.78rem',
              color: '#94A3B8',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              padding: '6px 12px',
              borderRadius: '10px',
              maxWidth: '90%',
            }}>
              💡 {currentQ.hint}
            </div>
          )}
        </div>
      </div>

      {/* 4. TECLADO IN-APP DE TOQUE CEGO COM RETROALIMENTAÇÃO TÁTIL */}
      <div style={{
        marginTop: 'auto',
      }}>
        <NumpadWeb
          onInput={val => setInputVal(prev => (prev.length < 5 ? prev + val : prev))}
          onClear={() => setInputVal('')}
          onSubmit={handleSubmit}
        />
      </div>

      {/* 5. MODAL DE FIM DE JOGO (GAMEOVER / SÍNTESE) */}
      {isGameOver && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(3, 4, 7, 0.88)',
          backdropFilter: 'blur(14px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#0D111A',
            border: '1.5px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '28px',
            padding: '28px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 242, 254, 0.25)',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(250, 204, 21, 0.15)',
              border: '1.5px solid #FACC15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 0 25px rgba(250, 204, 21, 0.4)',
            }}>
              <Trophy size={30} color="#FACC15" />
            </div>

            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FACC15', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              FIM DA PARTIDA
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F8FAFC', margin: '4px 0 16px' }}>
              {score.toLocaleString('pt-BR')} PTS
            </h2>

            {/* Grid de Resumo */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '20px',
            }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>PRECISÃO</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                  {accuracy}%
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>MAX STREAK</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 800, color: '#00F2FE', marginTop: '2px' }}>
                  {maxStreak}
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>ACERTOS</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 800, color: '#FACC15', marginTop: '2px' }}>
                  {correctCount}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={restartGame}
              style={{
                width: '100%',
                backgroundColor: '#00F2FE',
                color: '#07090E',
                padding: '14px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)',
                marginBottom: '10px',
              }}
            >
              <RotateCcw size={18} />
              <span>JOGAR NOVAMENTE</span>
            </button>

            {onBackToTrack && (
              <button
                type="button"
                onClick={onBackToTrack}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: '#94A3B8',
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Voltar à Trilha
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
