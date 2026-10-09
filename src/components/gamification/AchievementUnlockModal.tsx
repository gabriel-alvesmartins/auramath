import React from 'react';
import { Award, Sparkles, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AchievementItem } from '../../engine';
import { Aura3DButton } from '../tactile/Aura3DButton';
import { AuraMascotWeb } from '../AuraMascotWeb';

export interface AchievementUnlockModalProps {
  achievement: AchievementItem | null;
  onClose: () => void;
}

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({ achievement, onClose }) => {
  if (!achievement) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Conquista Desbloqueada"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(32, 37, 34, 0.76)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 95,
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '2px solid var(--color-ink, #202522)',
          borderRadius: '24px',
          padding: '28px 24px',
          width: '100%',
          maxWidth: '360px',
          textAlign: 'center',
          boxShadow: '0 8px 0 var(--color-border-bold, #C2BDAE)',
          boxSizing: 'border-box',
          position: 'relative',
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

        {/* Mascot Celebration */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <AuraMascotWeb
            size={72}
            stage={3}
            state="happy"
            showSpeechBubble={false}
            showTierBadge={false}
          />
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: '999px',
            backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
            border: '1px solid var(--color-marigold-bevel, #D49A2E)',
            marginBottom: '10px',
          }}
        >
          <Sparkles size={13} color="var(--color-marigold-bevel, #D49A2E)" />
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: 'var(--color-marigold-bevel, #D49A2E)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            NOVA CONQUISTA REGISTRADA
          </span>
        </div>

        <h3
          style={{
            fontSize: '1.35rem',
            fontWeight: 900,
            color: 'var(--color-text-primary, #202522)',
            margin: '0 0 6px',
            fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
          }}
        >
          {achievement.title}
        </h3>

        <p
          style={{
            fontSize: '0.84rem',
            color: 'var(--color-ink-secondary, #5C645F)',
            margin: '0 0 20px',
            lineHeight: 1.4,
          }}
        >
          {achievement.description}
        </p>

        {/* Seal Badge Graphic */}
        <div
          style={{
            backgroundColor: 'var(--color-paper, #F7F4EA)',
            border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
            borderRadius: '16px',
            padding: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <Award size={24} color="var(--color-verdigris, #176B5B)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-verdigris, #176B5B)' }}>
            Selo de Prestígio Arquivado no Caderno
          </span>
        </div>

        <Aura3DButton
          variant="brand"
          size="md"
          fullWidth
          onClick={onClose}
        >
          GUARDAR NO CADERNO
        </Aura3DButton>
      </div>
    </div>
  );
};
