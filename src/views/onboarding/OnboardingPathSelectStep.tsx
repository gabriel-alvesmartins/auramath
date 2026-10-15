import React from 'react';
import { Zap, Compass, Target, ArrowLeft } from 'lucide-react';
import { audioSynth } from '../../services/audioSynth';

export type OnboardingPath = 'zero' | 'diagnostic' | 'picker';

export interface OnboardingPathSelectStepProps {
  onSelectPath: (path: OnboardingPath) => void;
  onBack: () => void;
}

export const OnboardingPathSelectStep: React.FC<OnboardingPathSelectStepProps> = ({
  onSelectPath,
  onBack,
}) => {
  const options = [
    {
      id: 'zero' as OnboardingPath,
      title: 'Iniciar do completo zero',
      subtitle: 'Fundações & Decomposição Posicional',
      description: 'Comece do início aprendendo a somar e subtrair sem nunca armar conta no papel.',
      icon: Zap,
      badge: 'Grau I • Fundações',
      accentColor: 'var(--color-verdigris, #176B5B)',
      badgeBg: 'var(--color-verdigris-soft, #DCEBE5)',
      badgeBorder: 'var(--color-verdigris, #176B5B)',
    },
    {
      id: 'diagnostic' as OnboardingPath,
      title: 'Descobrir o seu nível',
      subtitle: 'Quiz Diagnóstico de 10 Questões',
      description: 'Desafie 10 questões progressivas para medir sua intuição e posicionar você no grau ideal.',
      icon: Compass,
      badge: '2 Minutos • Recomendado',
      accentColor: 'var(--color-marigold, #F2B84B)',
      badgeBg: 'var(--color-marigold-soft, #FFF0C9)',
      badgeBorder: 'var(--color-marigold-bevel, #D49A2E)',
    },
    {
      id: 'picker' as OnboardingPath,
      title: 'Selecionar o seu nível',
      subtitle: 'Escolha de Grau (1 a 6) + Teste',
      description: 'Escolha diretamente o Grau que deseja e comprove sua maestria em 4 questões de homologação.',
      icon: Target,
      badge: 'Homologação Rápida',
      accentColor: 'var(--color-iris, #6E5AA6)',
      badgeBg: 'var(--color-iris-soft, #E8E3F3)',
      badgeBorder: 'var(--color-iris, #6E5AA6)',
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
      {/* Top Bar with Back Button */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: '8px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            audioSynth.playKeypressTick();
            onBack();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary, #5C645F)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '6px 0',
          }}
        >
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </button>
      </div>

      {/* Title */}
      <div style={{ maxWidth: '380px', width: '100%', marginBottom: '16px' }}>
        <h2
          style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            color: 'var(--color-text-primary, #202522)',
            margin: '0 0 6px',
            fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
            letterSpacing: '-0.02em',
          }}
        >
          Como você deseja começar?
        </h2>
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--color-text-secondary, #5C645F)',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Escolha o caminho que melhor reflete sua confiança no cálculo mental:
        </p>
      </div>

      {/* 3 Interactive Cards */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          margin: 'auto 0',
        }}
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                audioSynth.playKeypressTick();
                onSelectPath(opt.id);
              }}
              style={{
                width: '100%',
                backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                borderRadius: '16px',
                boxShadow: '0 3px 0 var(--color-border-bold, #C2BDAE)',
                padding: '14px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                boxSizing: 'border-box',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(2px)';
                e.currentTarget.style.boxShadow = '0 1px 0 var(--color-border-bold, #C2BDAE)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 3px 0 var(--color-border-bold, #C2BDAE)';
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'translateY(2px)';
                e.currentTarget.style.boxShadow = '0 1px 0 var(--color-border-bold, #C2BDAE)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 3px 0 var(--color-border-bold, #C2BDAE)';
              }}
            >
              {/* Header Badge & Icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: opt.badgeBg,
                      border: `1.5px solid ${opt.badgeBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-text-primary, #202522)',
                    }}
                  >
                    <Icon size={18} color={opt.accentColor} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: 'var(--color-text-primary, #202522)',
                    }}
                  >
                    {opt.title}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: opt.badgeBg,
                    border: `1px solid ${opt.badgeBorder}`,
                    color: 'var(--color-text-primary, #202522)',
                  }}
                >
                  {opt.badge}
                </span>
              </div>

              {/* Subtitle & Description */}
              <div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: opt.accentColor,
                    marginBottom: '2px',
                  }}
                >
                  {opt.subtitle}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary, #5C645F)',
                    lineHeight: 1.35,
                  }}
                >
                  {opt.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ height: '24px' }} />
    </div>
  );
};
