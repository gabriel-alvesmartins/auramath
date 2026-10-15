import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, Lightbulb, RotateCcw } from 'lucide-react';
import { Aura3DButton } from './Aura3DButton';
import { AuraMascotWeb } from '../AuraMascotWeb';

export interface CognitiveScaffoldingStep {
  stepIndex: number;
  explanation: string;
  algebraicHint: string;
}

export interface FeedbackModuleInfo {
  unit: number;
  moduleTitle: string;
  nodeId: string;
  scaffoldingSteps?: CognitiveScaffoldingStep[];
  accuracyBenchmark?: number;
}

export interface FeedbackDrawerProps {
  status: 'correct' | 'incorrect' | null;
  correctAnswer?: number | string;
  userAnswer?: string;
  explanation?: string;
  onContinue: () => void;
  moduleInfo?: FeedbackModuleInfo;
  onRetrainModule?: (nodeId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * FeedbackDrawer — Immediate non-punitive feedback drawer with smooth decompression slide-up.
 *
 * Characteristics:
 * - Non-punitive UX: Soft emerald tint for correct, soft rose tint for incorrect
 * - Didactical shortcut insight box with Sparkles/Lightbulb
 * - Unit & module attribution for missed questions with dedicated retraining action
 * - Miniature reactive Aura mascot (happy vs thinking)
 * - Full keyboard accessibility: binds Enter, Numpad Enter, and Space
 * - Visual [Enter ↵] hint badge on full-width 3D continue button
 */
export const FeedbackDrawer: React.FC<FeedbackDrawerProps> = ({
  status,
  correctAnswer,
  explanation,
  onContinue,
  moduleInfo,
  onRetrainModule,
  className = '',
  style,
}) => {
  // Global keyboard listener for Enter, Numpad Enter, and Space
  useEffect(() => {
    if (!status) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'Enter' || e.code === 'NumpadEnter' || e.key === ' ') {
        e.preventDefault();
        onContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status, onContinue]);

  if (!status) return null;

  const isCorrect = status === 'correct';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isCorrect ? 'Resposta Correta' : 'Solução'}
      className={`feedback-drawer ${isCorrect ? 'feedback-drawer--correct' : 'feedback-drawer--incorrect'} ${className}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        backgroundColor: 'var(--color-cream, #FFFDF6)',
        borderTop: `3px solid ${isCorrect ? 'var(--color-verdigris, #176B5B)' : 'var(--color-coral, #E76F61)'}`,
        boxShadow: isCorrect
          ? '0 -8px 28px rgba(23, 107, 91, 0.15), 0 0 1px var(--color-border-bold, #C2BDAE)'
          : '0 -8px 28px rgba(231, 111, 97, 0.15), 0 0 1px var(--color-border-bold, #C2BDAE)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '20px 20px 28px',
        zIndex: 60,
        boxSizing: 'border-box',
        animation: 'feedbackSlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
    >
      <style>{`
        @keyframes feedbackSlideUp {
          from {
            transform: translate(-50%, 100%);
            opacity: 0.6;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Header Info Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '18px',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: 0 }}>
          {/* Status Icon Badge */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: isCorrect ? 'var(--color-verdigris-soft, #DCEBE5)' : 'var(--color-coral-soft, #F8DED9)',
              border: `2px solid ${isCorrect ? 'var(--color-verdigris, #176B5B)' : 'var(--color-coral, #E76F61)'}`,
              color: isCorrect ? 'var(--color-verdigris, #176B5B)' : 'var(--color-coral, #E76F61)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isCorrect ? (
              <CheckCircle2 size={24} strokeWidth={2.6} />
            ) : (
              <AlertCircle size={24} strokeWidth={2.6} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: isCorrect ? 'var(--color-verdigris, #176B5B)' : 'var(--color-coral, #E76F61)',
                margin: 0,
                letterSpacing: '-0.01em',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              {isCorrect ? 'Descoberta Brilhante! ✦' : 'Veja a estrutura oculta:'}
            </h3>

            {!isCorrect && correctAnswer !== undefined && (
              <div
                className="font-mono-tabular"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  color: 'var(--color-ink, #202522)',
                  margin: '4px 0 6px',
                  letterSpacing: '-0.01em',
                }}
              >
                {correctAnswer}
              </div>
            )}

            {/* Didactical Shortcut Insight Box */}
            {explanation && (
              <div
                className="feedback-insight-box"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: isCorrect ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink, #202522)',
                  backgroundColor: isCorrect ? 'var(--color-verdigris-soft, #DCEBE5)' : 'var(--color-coral-soft, #F8DED9)',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  marginTop: '8px',
                  lineHeight: 1.4,
                  border: `1px solid ${isCorrect ? 'rgba(23, 107, 91, 0.25)' : 'rgba(231, 111, 97, 0.3)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ flexShrink: 0, display: 'inline-flex' }}>
                    {isCorrect ? <Sparkles size={16} /> : <Lightbulb size={16} />}
                  </span>
                  <span style={{ fontSize: '0.70rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isCorrect ? 'Simetria Identificada' : 'Atalho Mental (Não calcule. Veja):'}
                  </span>
                </div>
                <div
                  className="font-mono-tabular"
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.90rem',
                    fontWeight: 700,
                    paddingLeft: '24px',
                  }}
                >
                  {explanation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mascot Miniature Expression */}
        <div style={{ flexShrink: 0 }}>
          <AuraMascotWeb
            size={56}
            state={isCorrect ? 'happy' : 'thinking'}
            showTierBadge={false}
          />
        </div>
      </div>

      {/* Unit & Module Attribution & Retrain Action */}
      {!isCorrect && moduleInfo && (
        <div
          style={{
            marginBottom: '14px',
            padding: '12px 14px',
            borderRadius: '16px',
            backgroundColor: 'var(--color-paper, #F7F4EA)',
            border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                color: 'var(--color-verdigris, #176B5B)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              § REFORÇO RECOMENDADO · UNIDADE {moduleInfo.unit}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--color-ink-secondary, #5C645F)',
              }}
            >
              Currículo Oficial
            </span>
          </div>

          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
            Módulo: {moduleInfo.moduleTitle}
          </div>

          {onRetrainModule && (
            <Aura3DButton
              variant="brand"
              size="md"
              fullWidth
              onClick={() => onRetrainModule(moduleInfo.nodeId)}
              icon={<RotateCcw size={15} strokeWidth={2.4} />}
            >
              RETREINAR MÓDULO ➔
            </Aura3DButton>
          )}
        </div>
      )}

      {/* 3D Action Continue Button with [Enter ↵] Hint Badge */}
      <Aura3DButton
        variant={isCorrect ? 'success' : 'alert'}
        fullWidth
        size="lg"
        onClick={onContinue}
        aria-label={isCorrect ? 'Continuar (pressione Enter)' : 'Entendi (pressione Enter)'}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
          <span>{isCorrect ? 'CONTINUAR' : 'ENTENDI'}</span>
          <span
            className="font-mono-tabular"
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0, 0, 0, 0.22)',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
            }}
          >
            [Enter ↵]
          </span>
        </span>
      </Aura3DButton>
    </div>
  );
};

export default FeedbackDrawer;
