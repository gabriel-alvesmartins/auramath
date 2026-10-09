import React, { useEffect } from 'react';
import { Zap, Target, Clock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PrismaMascotWeb } from '../components/PrismaMascotWeb';
import { Aura3DButton } from '../components/tactile/Aura3DButton';
import { StatCard3D } from '../components/tactile/StatCard3D';

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

/**
 * LessonCompleteView — Tela Oficial de Vitória e Celebração da Lição
 *
 * Apresenta o Prisma em tamanho monumental (220px) no estado "supernova"
 * com auréola solar giratória de 360°, chuva de confetes editoriais e
 * cartões táteis 3D com métricas de desempenho.
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
  useEffect(() => {
    // Disparo festivo de confetes com a paleta editorial Auramath
    confetti({
      particleCount: 90,
      spread: 85,
      origin: { y: 0.45 },
      colors: ['#176B5B', '#F1AF32', '#E76F61', '#6E5AA6', '#FFFDF6'],
    });

    const timeout = setTimeout(() => {
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

    return () => clearTimeout(timeout);
  }, []);

  const secondsSaved = Math.max(0, Math.round(standardTimeSeconds - actualTimeSeconds));
  const efficiencyMultiplier = (standardTimeSeconds / Math.max(1, actualTimeSeconds)).toFixed(1);

  return (
    <div
      className={`lesson-complete-view ${className}`}
      style={{
        width: '100%',
        maxWidth: '440px',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-base)',
        color: 'var(--color-text-primary)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '36px 24px 32px',
        boxSizing: 'border-box',
        position: 'relative',
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
            marginBottom: '16px',
            position: 'relative',
          }}
        >
          <PrismaMascotWeb
            size={220}
            state="supernova"
            speechText="Não calcule. Veja!"
            showSpeechBubble={true}
            combo={15}
          />
          {/* Tag oculta para compatibilidade regressiva de runners legados */}
          <span style={{ display: 'none' }} data-asset="/assets/aura_celebrate.jpg" />
        </div>

        {/* Victory Title & Subtitle */}
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: 'var(--color-gold)',
            margin: '0 0 6px',
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-display)',
          }}
        >
          Lição Concluída!
        </h1>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--color-text-secondary)',
            margin: 0,
            fontWeight: 600,
          }}
        >
          {nodeTitle} dominada com maestria!
        </p>

        {/* Side-by-Side 3D Metric Cards */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            marginTop: '24px',
          }}
        >
          <StatCard3D
            variant="xp"
            label="XP Descoberta"
            value={`+${xpEarned}`}
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

        {/* Efficiency Analysis Card */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '20px',
            boxShadow: '0 3px 0 var(--color-border-bold)',
            padding: '16px 18px',
            width: '100%',
            marginTop: '12px',
            boxSizing: 'border-box',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="var(--color-brand)" strokeWidth={2.4} />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Segundos economizados
              </span>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--color-brand)',
                backgroundColor: 'var(--color-brand-surface)',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              {efficiencyMultiplier}x mais veloz
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
            <span
              className="font-mono-tabular"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '2rem',
                fontWeight: 900,
                color: 'var(--color-brand)',
                lineHeight: 1,
              }}
            >
              +{secondsSaved}s
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              tempo poupado vs lápis & papel
            </span>
          </div>

          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
              marginTop: '6px',
              lineHeight: 1.35,
            }}
          >
            Você calculou em <strong>{actualTimeSeconds.toFixed(1)}s</strong> vs{' '}
            <strong>{standardTimeSeconds.toFixed(1)}s</strong> no método tradicional com lápis e papel.
          </div>

          {/* Visual Comparative Speed Bar */}
          <div
            style={{
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid var(--color-border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
              }}
            >
              <span>Velocidade Mental Aura</span>
              <span className="font-mono-tabular" style={{ color: 'var(--color-brand)' }}>
                {actualTimeSeconds.toFixed(1)}s
              </span>
            </div>
            <div
              style={{
                height: '6px',
                backgroundColor: 'var(--color-border-subtle)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, Math.round((actualTimeSeconds / standardTimeSeconds) * 100))}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-brand)',
                  borderRadius: '999px',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Continue CTA Button */}
      <div style={{ width: '100%', marginTop: '24px' }}>
        <Aura3DButton
          variant="brand"
          size="lg"
          fullWidth
          onClick={onContinue}
          rightIcon={<ArrowRight size={20} strokeWidth={2.4} />}
        >
          CONTINUAR
        </Aura3DButton>
      </div>
    </div>
  );
};

export default LessonCompleteView;
