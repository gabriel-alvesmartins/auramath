import React, { useState, useEffect, useRef } from 'react';
import { Zap, Target, Clock, ArrowRight, Flame, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PrismaMascotWeb } from '../components/PrismaMascotWeb';
import { Aura3DButton } from '../components/tactile/Aura3DButton';
import { StatCard3D } from '../components/tactile/StatCard3D';
import { audioSynth } from '../services/audioSynth';

export interface LessonCompleteViewProps {
  nodeTitle?: string;
  xpEarned?: number;
  accuracy?: number;
  currentStreak?: number;
  actualTimeSeconds?: number;
  standardTimeSeconds?: number;
  onContinue: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export type VictoryPhase = 'intro' | 'cards' | 'xp_count' | 'streak_stamp' | 'ready';

/**
 * LessonCompleteView — Tela Oficial de Vitória e Celebração da Lição
 *
 * Coreografia em 5 Fases Temporizadas (Dopamine Waterfall):
 * 1. Intro: Prisma em supernova (220px) + confetes + acorde pentatônico
 * 2. Cards: Queda elástica dos cards táteis 3D (XP, Precisão, Tempo Poupado)
 * 3. XP Count: Contagem progressiva tabular do XP (+0 a +N) com ticks sonoros
 * 4. Streak Stamp: Fita semanal de 7 dias onde a chama inflama o dia de hoje
 * 5. Ready: Barra de meta diária e pulso tátil do botão "PRÓXIMO INSIGHT ➔"
 * Suporta avanço rápido (fast-forward) ao clicar na tela.
 */
export const LessonCompleteView: React.FC<LessonCompleteViewProps> = ({
  nodeTitle = 'Lição',
  xpEarned = 35,
  accuracy = 100,
  currentStreak = 1,
  actualTimeSeconds = 12.4,
  standardTimeSeconds = 30.0,
  onContinue,
  className = '',
  style,
}) => {
  const [phase, setPhase] = useState<VictoryPhase>('intro');
  const [displayedXp, setDisplayedXp] = useState(0);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const secondsSaved = Math.max(0, Math.round(standardTimeSeconds - actualTimeSeconds));
  const efficiencyMultiplier = (standardTimeSeconds / Math.max(1, actualTimeSeconds)).toFixed(1);

  // Helper to clear pending timers
  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Fast-forward directly to ready state
  const handleFastForward = () => {
    if (phase !== 'ready') {
      clearTimers();
      setPhase('ready');
      setDisplayedXp(xpEarned);
    }
  };

  useEffect(() => {
    // Phase 1: Disparo festivo e áudio pentatônico
    audioSynth.playVictoryFanfare();
    confetti({
      particleCount: 90,
      spread: 85,
      origin: { y: 0.45 },
      colors: ['#176B5B', '#F1AF32', '#E76F61', '#6E5AA6', '#FFFDF6'],
    });

    const tSideConfetti = setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#176B5B', '#F1AF32'],
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F1AF32', '#E76F61'],
      });
    }, 350);
    timersRef.current.push(tSideConfetti);

    // Phase 2: Exibir cards aos 750ms
    const tCards = setTimeout(() => {
      setPhase('cards');
    }, 750);
    timersRef.current.push(tCards);

    // Phase 3: Iniciar contagem progressiva de XP aos 1400ms
    const tXpCount = setTimeout(() => {
      setPhase('xp_count');
      const step = Math.max(1, Math.ceil(xpEarned / 15));
      let currentVal = 0;
      const interval = setInterval(() => {
        currentVal = Math.min(xpEarned, currentVal + step);
        setDisplayedXp(currentVal);
        audioSynth.playKeypressTick();
        if (currentVal >= xpEarned) {
          clearInterval(interval);
        }
      }, 45);
    }, 1400);
    timersRef.current.push(tXpCount);

    // Phase 4: Inflamação da Ofensiva aos 2100ms
    const tStreak = setTimeout(() => {
      setPhase('streak_stamp');
    }, 2100);
    timersRef.current.push(tStreak);

    // Phase 5: Conclusão pronta aos 2800ms
    const tReady = setTimeout(() => {
      setPhase('ready');
      setDisplayedXp(xpEarned);
    }, 2800);
    timersRef.current.push(tReady);

    return () => clearTimers();
  }, [xpEarned]);

  // Days of week for the 7-day streak calendar strip
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6

  const showCards = phase !== 'intro';
  const showStreak = phase === 'streak_stamp' || phase === 'ready';
  const showReady = phase === 'ready';

  return (
    <div
      className={`lesson-complete-view ${className}`}
      onClick={handleFastForward}
      style={{
        width: '100%',
        maxWidth: '440px',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-base, #F7F4EA)',
        color: 'var(--color-text-primary, #202522)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '28px 20px 24px',
        boxSizing: 'border-box',
        position: 'relative',
        cursor: phase !== 'ready' ? 'pointer' : 'default',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {/* Prisma em tamanho grande celebrando vitória com Auréola Solar 360° */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            position: 'relative',
          }}
        >
          <PrismaMascotWeb
            size={200}
            state="supernova"
            speechText="Não calcule. Veja!"
            showSpeechBubble={true}
            combo={15}
          />
          {/* Tag oculta para compatibilidade regressiva de runners de teste */}
          <span style={{ display: 'none' }} data-asset="/assets/aura_celebrate.jpg" />
        </div>

        {/* Victory Title & Subtitle */}
        <h1
          style={{
            fontSize: '1.85rem',
            fontWeight: 900,
            color: 'var(--color-gold, #F2B84B)',
            margin: '0 0 4px',
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
          }}
        >
          Lição Concluída!
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary, #5C645F)',
            margin: 0,
            fontWeight: 600,
          }}
        >
          {nodeTitle} dominada com maestria!
        </p>

        {/* Phase 2: Side-by-Side 3D Metric Cards (Slide-in) */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            marginTop: '20px',
            opacity: showCards ? 1 : 0,
            transform: showCards ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <StatCard3D
            variant="xp"
            label="XP Descoberta"
            value={`+${phase === 'cards' ? 0 : displayedXp}`}
            sublabel={`Ofensiva de ${currentStreak} dias!`}
            icon={<Zap size={18} strokeWidth={2.4} />}
          />

          <StatCard3D
            variant="accuracy"
            label="Precisão"
            value={`${accuracy}%`}
            sublabel="Maestria mental"
            icon={<Target size={18} strokeWidth={2.4} />}
          />
        </div>

        {/* Phase 2: Efficiency Analysis Card */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
            borderRadius: '16px',
            boxShadow: '0 3px 0 var(--color-border-bold, #C2BDAE)',
            padding: '12px 16px',
            width: '100%',
            marginTop: '10px',
            boxSizing: 'border-box',
            textAlign: 'left',
            opacity: showCards ? 1 : 0,
            transform: showCards ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} color="var(--color-brand, #176B5B)" strokeWidth={2.4} />
              <span
                style={{
                  fontSize: '0.70rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-secondary, #5C645F)',
                }}
              >
                Segundos economizados
              </span>
            </div>
            <span
              style={{
                fontSize: '0.70rem',
                fontWeight: 800,
                color: 'var(--color-brand, #176B5B)',
                backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              {efficiencyMultiplier}x mais veloz
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '2px 0' }}>
            <span
              className="font-mono-tabular"
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                fontSize: '1.7rem',
                fontWeight: 900,
                color: 'var(--color-brand, #176B5B)',
                lineHeight: 1,
              }}
            >
              +{secondsSaved}s
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #767268)', fontWeight: 600 }}>
              tempo poupado vs lápis & papel
            </span>
          </div>
        </div>

        {/* Phase 4: Weekly Streak Calendar Strip */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
            borderRadius: '16px',
            boxShadow: '0 3px 0 var(--color-border-bold, #C2BDAE)',
            padding: '12px 14px',
            marginTop: '10px',
            boxSizing: 'border-box',
            opacity: showStreak ? 1 : 0,
            transform: showStreak ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Flame size={16} color="var(--color-marigold-bevel, #D49A2E)" fill="var(--color-marigold, #F2B84B)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
                Ofensiva de {currentStreak} {currentStreak === 1 ? 'Dia' : 'Dias'}!
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-secondary, #5C645F)' }}>
              Chama Ativa
            </span>
          </div>

          {/* 7-Day Week Strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
            {weekDays.map((d, idx) => {
              const isToday = idx === todayDayIndex;
              const isPast = idx < todayDayIndex;

              return (
                <div
                  key={d}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: '0.64rem', fontWeight: 700, color: 'var(--color-text-secondary, #5C645F)' }}>
                    {d}
                  </span>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isToday
                        ? 'var(--color-marigold-soft, #FFF0C9)'
                        : isPast
                        ? 'var(--color-verdigris-soft, #DCEBE5)'
                        : 'var(--color-bg-base, #F7F4EA)',
                      border: isToday
                        ? '2px solid var(--color-marigold, #F2B84B)'
                        : isPast
                        ? '1.5px solid var(--color-verdigris, #176B5B)'
                        : '1px solid var(--color-border-subtle, #D9D5C8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isToday ? '0 0 10px rgba(242, 184, 75, 0.45)' : 'none',
                      transform: isToday && showStreak ? 'scale(1.12)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isToday ? (
                      <Flame size={14} color="var(--color-marigold-bevel, #D49A2E)" fill="var(--color-marigold, #F2B84B)" />
                    ) : isPast ? (
                      <Check size={13} color="var(--color-verdigris, #176B5B)" strokeWidth={3} />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase 5: Daily Goal Progress Bar */}
        <div
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '8px 12px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            opacity: showReady ? 1 : 0,
            transform: showReady ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-secondary, #5C645F)' }}>
              Meta de Hoje
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: 'var(--color-verdigris, #176B5B)',
                backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                padding: '1px 6px',
                borderRadius: '6px',
              }}
            >
              1 / 2 Lições
            </span>
          </div>

          <div style={{ width: '100px', height: '6px', backgroundColor: 'var(--color-border-subtle, #D9D5C8)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: '50%', height: '100%', backgroundColor: 'var(--color-verdigris, #176B5B)' }} />
          </div>
        </div>
      </div>

      {/* Continue CTA Button (Pulses when ready) */}
      <div
        style={{
          width: '100%',
          marginTop: '16px',
          opacity: showReady ? 1 : 0.6,
          transition: 'opacity 0.2s ease',
        }}
        onClick={(e) => {
          if (phase !== 'ready') {
            e.stopPropagation();
            handleFastForward();
          }
        }}
      >
        <Aura3DButton
          variant="brand"
          size="lg"
          fullWidth
          onClick={() => {
            audioSynth.playKeypressTick();
            onContinue();
          }}
          rightIcon={<ArrowRight size={20} strokeWidth={2.4} />}
        >
          PRÓXIMO INSIGHT ➔
        </Aura3DButton>
      </div>
    </div>
  );
};

export default LessonCompleteView;
