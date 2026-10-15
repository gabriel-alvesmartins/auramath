import React, { useState } from 'react';
import { Zap, Flame, Sparkles, ArrowRight } from 'lucide-react';
import { Aura3DButton } from '../../components/tactile/Aura3DButton';
import { audioSynth } from '../../services/audioSynth';

export type DailyGoalMinutes = 3 | 7 | 15;

export interface DailyGoalStepProps {
  onConfirm: (goalMinutes: DailyGoalMinutes) => void;
}

export const DailyGoalStep: React.FC<DailyGoalStepProps> = ({ onConfirm }) => {
  const [selectedGoal, setSelectedGoal] = useState<DailyGoalMinutes>(7);

  const goals = [
    {
      minutes: 3 as DailyGoalMinutes,
      name: 'Faísca',
      sub: '3 min / dia',
      desc: '1 lição rápida. Ideal para rotinas intensas.',
      xp: '+20 XP / dia',
      icon: Zap,
      color: 'var(--color-verdigris, #176B5B)',
    },
    {
      minutes: 7 as DailyGoalMinutes,
      name: 'Foco',
      sub: '7 min / dia',
      desc: '2 lições + 1 treino ágil. Ritmo perfeito de retenção.',
      xp: '+50 XP / dia',
      badge: 'Recomendado',
      icon: Flame,
      color: 'var(--color-marigold, #F2B84B)',
    },
    {
      minutes: 15 as DailyGoalMinutes,
      name: 'Maestria Fibonacci',
      sub: '15 min / dia',
      desc: 'Imersão completa em decomposição e cálculo mental.',
      xp: '+120 XP / dia',
      icon: Sparkles,
      color: 'var(--color-iris, #6E5AA6)',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '100%',
        padding: '24px 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '380px', width: '100%', marginTop: '12px' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: 'var(--color-text-primary, #202522)',
            margin: '0 0 6px',
            fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
            letterSpacing: '-0.02em',
          }}
        >
          Qual é a sua meta diária?
        </h2>
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--color-text-secondary, #5C645F)',
            margin: '0 0 20px',
            lineHeight: 1.4,
          }}
        >
          Estudantes com meta diária têm 4x mais chance de construir fluência de cálculo para a vida toda.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {goals.map((g) => {
            const isSel = selectedGoal === g.minutes;
            const Icon = g.icon;

            return (
              <button
                key={g.minutes}
                type="button"
                onClick={() => {
                  audioSynth.playKeypressTick();
                  setSelectedGoal(g.minutes);
                }}
                style={{
                  width: '100%',
                  backgroundColor: isSel ? 'var(--color-cream, #FFFDF6)' : 'var(--color-bg-surface, #FFFDF6)',
                  border: isSel ? '2px solid var(--color-verdigris, #176B5B)' : '1.5px solid var(--color-border-subtle, #D9D5C8)',
                  borderRadius: '16px',
                  boxShadow: isSel ? '0 3px 0 var(--color-verdigris-bevel, #104E42)' : '0 2px 0 var(--color-border-bold, #C2BDAE)',
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  transform: isSel ? 'translateY(-1px)' : 'none',
                  transition: 'all 0.12s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: isSel ? 'var(--color-verdigris-soft, #DCEBE5)' : 'var(--color-bg-base, #F7F4EA)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: g.color,
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.96rem',
                          fontWeight: 800,
                          color: 'var(--color-text-primary, #202522)',
                          fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                        }}
                      >
                        {g.name}
                      </span>
                      {g.badge && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '999px',
                            backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
                            border: '1px solid var(--color-marigold-bevel, #D49A2E)',
                            color: 'var(--color-ink, #202522)',
                          }}
                        >
                          {g.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary, #5C645F)', marginTop: '2px' }}>
                      {g.desc}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div
                    className="font-mono-tabular"
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      color: isSel ? 'var(--color-verdigris, #176B5B)' : 'var(--color-text-secondary, #5C645F)',
                    }}
                  >
                    {g.sub}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted, #767268)' }}>
                    {g.xp}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '380px', marginTop: '24px' }}>
        <Aura3DButton
          variant="brand"
          size="lg"
          fullWidth
          onClick={() => {
            audioSynth.playKeypressTick();
            onConfirm(selectedGoal);
          }}
          rightIcon={<ArrowRight size={20} strokeWidth={2.4} />}
        >
          CONFIRMAR & ENTRAR NA TRILHA ➔
        </Aura3DButton>
      </div>
    </div>
  );
};
