import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { audioSynth } from '../../services/audioSynth';

export interface ActiveXpBoostPillProps {
  expiresAt: number;
  multiplier?: number;
  onExpire?: () => void;
  onClick?: () => void;
}

export const ActiveXpBoostPill: React.FC<ActiveXpBoostPillProps> = ({
  expiresAt,
  multiplier = 2,
  onExpire,
  onClick,
}) => {
  const calculateRemaining = () => Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  const [secondsLeft, setSecondsLeft] = useState(calculateRemaining);

  useEffect(() => {
    const update = () => {
      const left = calculateRemaining();
      setSecondsLeft(left);
      if (left <= 0) {
        onExpire?.();
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (secondsLeft <= 0) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <button
      type="button"
      onClick={() => {
        audioSynth.playKeypressTick();
        onClick?.();
      }}
      className="aura-3d-btn aura-3d-btn--marigold"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        borderRadius: '12px',
        border: '1.5px solid var(--color-marigold, #F2B84B)',
        backgroundColor: 'rgba(242, 184, 75, 0.15)',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 2px 0 var(--color-marigold-deep, #A97A1C)',
        transition: 'all 0.1s ease',
      }}
      title={`Bônus de XP Ativo (${multiplier}x)`}
      aria-label={`Bônus de XP Ativo: ${multiplier}x durante ${formatted}`}
    >
      <Zap size={13} color="var(--color-marigold-deep, #A97A1C)" fill="var(--color-marigold, #F2B84B)" />
      <span
        style={{
          fontSize: '0.68rem',
          fontWeight: 800,
          color: 'var(--color-marigold-deep, #A97A1C)',
          fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
        }}
      >
        {multiplier}x
      </span>
      <span
        className="font-mono-tabular"
        style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          color: 'var(--color-text-primary, #202522)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatted}
      </span>
    </button>
  );
};
