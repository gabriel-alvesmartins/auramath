import React, { useState, useEffect, useRef } from 'react';
import { Flame, Shield, TrendingUp, Sparkles, X, Check, Award, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StreakState, StreakWager } from '../../engine';
import { Aura3DButton } from '../tactile/Aura3DButton';
import { AuraMascotWeb } from '../AuraMascotWeb';
import { audioSynth } from '../../services/audioSynth';

export interface StreakPopoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakState: StreakState;
  starsCount: number;
  onBuyFreeze: () => boolean;
  onPlaceWager: (days: 7 | 14, bet: number) => boolean;
  onSolveRescueTask: () => void;
}

const StreakPopoverModalComponent: React.FC<StreakPopoverModalProps> = ({
  isOpen,
  onClose,
  streakState,
  starsCount,
  onBuyFreeze,
  onPlaceWager,
  onSolveRescueTask,
}) => {
  const [wagerChoice, setWagerChoice] = useState<7 | 14>(7);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up feedback timer on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  // Keyboard Escape dismissal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const showFeedback = (msg: string, durationMs: number = 3000) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setFeedbackMsg(msg);
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackMsg(null);
      feedbackTimerRef.current = null;
    }, durationMs);
  };

  if (!isOpen) return null;

  const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  // Display last 7 days representation
  const todayIdx = 4; // e.g. Friday

  const handleBuyFreeze = () => {
    audioSynth.playKeypressTick();
    const ok = onBuyFreeze();
    if (ok) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      showFeedback('Bloqueio de Ofensiva equipado com sucesso!', 3000);
    } else {
      audioSynth.playErrorSoftRelease();
      showFeedback(
        starsCount < 100
          ? 'Estrelas insuficientes (requer 100 ✦)'
          : 'Capacidade máxima de bloqueios atingida (2/2)',
        3500
      );
    }
  };

  const handleWager = () => {
    audioSynth.playKeypressTick();
    const bet = wagerChoice === 7 ? 50 : 100;
    const ok = onPlaceWager(wagerChoice, bet);
    if (ok) {
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
      showFeedback(`Aposta de ${wagerChoice} dias ativada! Boa sorte!`, 3000);
    } else {
      audioSynth.playErrorSoftRelease();
      showFeedback('Estrelas insuficientes para esta aposta.', 3000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Detalhes da Ofensiva"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(32, 37, 34, 0.72)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 90,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '2px solid var(--color-ink, #202522)',
          borderRadius: '24px',
          padding: '24px',
          width: '100%',
          maxWidth: '380px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 8px 0 var(--color-border-bold, #C2BDAE)',
          boxSizing: 'border-box',
          position: 'relative',
          animation: 'modalSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform, opacity',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--color-ink-secondary, #5C645F)',
          }}
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        {/* 1. Big Streak Flame Badge */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '22px',
              margin: '0 auto 12px',
              backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
              border: '2px solid var(--color-marigold-bevel, #D49A2E)',
              boxShadow: '0 4px 0 var(--color-marigold-bevel, #D49A2E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Flame size={42} color="var(--color-marigold-bevel, #D49A2E)" fill="var(--color-marigold, #F2B84B)" />
          </div>

          <div
            className="font-mono-tabular"
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              lineHeight: 1,
              color: 'var(--color-text-primary, #202522)',
            }}
          >
            {streakState.current} {streakState.current === 1 ? 'Dia' : 'Dias'}
          </div>

          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--color-ink-secondary, #5C645F)',
              margin: '6px 0 0',
              lineHeight: 1.35,
            }}
          >
            {streakState.current > 0
              ? 'Seu hábito de descoberta diária está ativo e consistente!'
              : 'Comece sua sequência resolvendo um desafio agora!'}
          </p>

          {/* Urgency Alert Banner (Duolingo: "Less than 3 hours to extend your streak!") */}
          {streakState.current > 0 && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                border: '1px solid var(--color-marigold-bevel, #D49A2E)',
                color: '#684800',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginTop: '8px',
              }}
            >
              <Sparkles size={13} color="#D49A2E" />
              <span>
                {new Date().getHours() >= 20
                  ? `Menos de ${Math.max(1, 24 - new Date().getHours())} horas para estender sua sequência de ${streakState.current} dias!`
                  : `Mantenha seu foco ativo hoje para estender sua sequência!`}
              </span>
            </div>
          )}
        </div>

        {/* 2. Mini Weekly Consistency Dots */}
        <div
          style={{
            backgroundColor: 'var(--color-paper, #F7F4EA)',
            border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
            borderRadius: '16px',
            padding: '12px 14px',
            marginBottom: '18px',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-ink-secondary, #5C645F)', textTransform: 'uppercase', marginBottom: '8px' }}>
            REGISTRO DA SEMANA
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {daysOfWeek.map((day, idx) => {
              const isPastOrToday = idx <= todayIdx;
              return (
                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isPastOrToday ? 'var(--color-marigold-soft, #FFF0C9)' : 'var(--color-bg-surface, #FFFDF6)',
                      border: isPastOrToday ? '1.5px solid var(--color-marigold-bevel, #D49A2E)' : '1px dashed var(--color-border-bold, #C2BDAE)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isPastOrToday ? (
                      <Flame size={14} color="var(--color-marigold-bevel, #D49A2E)" fill="var(--color-marigold, #F2B84B)" />
                    ) : (
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-border-bold, #C2BDAE)' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--color-ink-secondary, #5C645F)' }}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Streak Rescue Card (if broken) */}
        {streakState.canRescue && (
          <div
            style={{
              backgroundColor: 'var(--color-coral-soft, #F8DED9)',
              border: '1.5px solid var(--color-coral, #E76F61)',
              borderRadius: '16px',
              padding: '14px',
              marginBottom: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <AlertCircle size={18} color="var(--color-coral, #E76F61)" />
              <strong style={{ fontSize: '0.86rem', color: 'var(--color-coral, #E76F61)' }}>
                Operação Resgate de Ofensiva
              </strong>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--color-ink, #202522)', margin: '0 0 10px', lineHeight: 1.35 }}>
              Sua sequência foi interrompida, mas a Aura preparou 3 desafios de compensação para restaurar seus dias perdidos!
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-ink-secondary, #5C645F)' }}>
                Progresso do resgate: {streakState.rescueTasksCompleted}/3
              </span>
            </div>
            <Aura3DButton
              variant="coral"
              size="sm"
              fullWidth
              onClick={() => {
                onSolveRescueTask();
                showFeedback('Desafio de resgate avançado com sucesso!', 3000);
              }}
            >
              RESOLVER DESAFIO DE RESGATE
            </Aura3DButton>
          </div>
        )}

        {/* 4. Bloqueio de Ofensiva (Streak Freeze) */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-base, #F7F4EA)',
            border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--color-verdigris, #176B5B)" />
              <strong style={{ fontSize: '0.86rem', color: 'var(--color-text-primary, #202522)' }}>
                Bloqueio de Ofensiva
              </strong>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--color-verdigris, #176B5B)',
                backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                padding: '2px 8px',
                borderRadius: '8px',
              }}
            >
              {streakState.freezesAvailable}/2 Equipados
            </span>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '0 0 10px', lineHeight: 1.35 }}>
            Protege sua sequência por 1 dia atípico em que você não conseguir abrir o caderno.
          </p>

          <Aura3DButton
            variant="brand"
            size="sm"
            fullWidth
            disabled={streakState.freezesAvailable >= 2}
            onClick={handleBuyFreeze}
          >
            {streakState.freezesAvailable >= 2 ? 'CAPACIDADE MÁXIMA ATINGIDA' : 'EQUIPAR BLOQUEIO (100 ✦)'}
          </Aura3DButton>
        </div>

        {/* 5. Aposta de Sequência (Streak Wager) */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-base, #F7F4EA)',
            border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
            borderRadius: '16px',
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <TrendingUp size={18} color="var(--color-marigold-bevel, #D49A2E)" />
            <strong style={{ fontSize: '0.86rem', color: 'var(--color-text-primary, #202522)' }}>
              Aposta de Sequência
            </strong>
          </div>

          {streakState.wager && streakState.wager.status === 'active' ? (
            <div>
              <p style={{ fontSize: '0.76rem', color: 'var(--color-ink, #202522)', margin: '0 0 8px' }}>
                Aposta ativa: <strong>{streakState.wager.daysCompleted}/{streakState.wager.targetDays} dias</strong> concluídos!
              </p>
              <div
                style={{
                  height: '6px',
                  backgroundColor: 'var(--color-border-subtle, #D9D5C8)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(streakState.wager.daysCompleted / streakState.wager.targetDays) * 100}%`,
                    backgroundColor: 'var(--color-marigold, #F2B84B)',
                    borderRadius: '4px',
                  }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary, #5C645F)', fontWeight: 600 }}>
                Ao completar, você receberá <strong>+{streakState.wager.betStars * 2} ✦ Estrelas</strong> de lucro!
              </span>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.74rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '0 0 10px', lineHeight: 1.35 }}>
                Faça um autocontrato com seu estudo: aposte estrelas e receba o dobro se mantiver a rotina!
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => setWagerChoice(7)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '10px',
                    border: wagerChoice === 7 ? '1.5px solid var(--color-verdigris, #176B5B)' : '1px solid var(--color-border-bold, #C2BDAE)',
                    backgroundColor: wagerChoice === 7 ? 'var(--color-verdigris-soft, #DCEBE5)' : 'var(--color-bg-surface, #FFFDF6)',
                    cursor: 'pointer',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  7 Dias (50 ✦)
                </button>
                <button
                  type="button"
                  onClick={() => setWagerChoice(14)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '10px',
                    border: wagerChoice === 14 ? '1.5px solid var(--color-verdigris, #176B5B)' : '1px solid var(--color-border-bold, #C2BDAE)',
                    backgroundColor: wagerChoice === 14 ? 'var(--color-verdigris-soft, #DCEBE5)' : 'var(--color-bg-surface, #FFFDF6)',
                    cursor: 'pointer',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  14 Dias (100 ✦)
                </button>
              </div>

              <Aura3DButton
                variant="marigold"
                size="sm"
                fullWidth
                onClick={handleWager}
              >
                APOSTAR E DOBRAR (2x)
              </Aura3DButton>
            </div>
          )}
        </div>

        {/* Feedback Message Banner */}
        {feedbackMsg && (
          <div
            style={{
              marginTop: '14px',
              padding: '8px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-ink, #202522)',
              color: 'var(--color-cream, #FFFDF6)',
              fontSize: '0.74rem',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            {feedbackMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export const StreakPopoverModal = React.memo(StreakPopoverModalComponent);
export default StreakPopoverModal;
