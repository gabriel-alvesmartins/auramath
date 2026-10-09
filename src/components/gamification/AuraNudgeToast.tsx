import React from 'react';
import { X, Sparkles, ArrowRight, Zap, Flame } from 'lucide-react';
import { AuraNudge } from '../../engine';
import { AuraMascotWeb } from '../AuraMascotWeb';

export interface AuraNudgeToastProps {
  nudge: AuraNudge | null;
  onDismiss: () => void;
  onAction: (route: string) => void;
}

export const AuraNudgeToast: React.FC<AuraNudgeToastProps> = ({ nudge, onDismiss, onAction }) => {
  if (!nudge) return null;

  const styleColors = {
    urgencia: {
      bg: 'var(--color-coral-soft, #F8DED9)',
      border: 'var(--color-coral, #E76F61)',
      icon: Flame,
      iconColor: 'var(--color-coral, #E76F61)',
    },
    complice: {
      bg: 'var(--color-marigold-soft, #FFF0C9)',
      border: 'var(--color-marigold-bevel, #D49A2E)',
      icon: Sparkles,
      iconColor: 'var(--color-marigold-bevel, #D49A2E)',
    },
    provocacao: {
      bg: 'var(--color-iris-soft, #E8E3F3)',
      border: 'var(--color-iris, #6E5AA6)',
      icon: Zap,
      iconColor: 'var(--color-iris, #6E5AA6)',
    },
    celebracao: {
      bg: 'var(--color-verdigris-soft, #DCEBE5)',
      border: 'var(--color-verdigris, #176B5B)',
      icon: Sparkles,
      iconColor: 'var(--color-verdigris, #176B5B)',
    },
  }[nudge.style] || {
    bg: 'var(--color-bg-surface, #FFFDF6)',
    border: 'var(--color-border-bold, #C2BDAE)',
    icon: Sparkles,
    iconColor: 'var(--color-verdigris, #176B5B)',
  };

  const Icon = styleColors.icon;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '398px',
        backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
        border: `2px solid ${styleColors.border}`,
        boxShadow: `0 4px 0 ${styleColors.border}, 0 10px 24px rgba(32, 37, 34, 0.15)`,
        borderRadius: '20px',
        padding: '12px 14px',
        zIndex: 60,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      {/* Mini Mascot Avatar */}
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <AuraMascotWeb size={46} stage={2} state="thinking" showSpeechBubble={false} showTierBadge={false} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon size={14} color={styleColors.iconColor} />
            <strong style={{ fontSize: '0.8rem', color: 'var(--color-text-primary, #202522)' }}>
              {nudge.title}
            </strong>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              color: 'var(--color-ink-secondary, #5C645F)',
            }}
            aria-label="Dispensar aviso"
          >
            <X size={14} />
          </button>
        </div>

        <p
          style={{
            fontSize: '0.76rem',
            color: 'var(--color-ink-secondary, #5C645F)',
            margin: '0 0 8px',
            lineHeight: 1.35,
          }}
        >
          {nudge.message}
        </p>

        <button
          type="button"
          onClick={() => {
            onAction(nudge.actionRoute);
            onDismiss();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: styleColors.bg,
            border: `1.5px solid ${styleColors.border}`,
            boxShadow: `0 2px 0 ${styleColors.border}`,
            borderRadius: '10px',
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--color-ink, #202522)',
            cursor: 'pointer',
          }}
        >
          <span>{nudge.actionLabel}</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};
