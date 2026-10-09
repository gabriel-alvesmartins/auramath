import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export interface XpBoostBadgeProps {
  expiresAt: number; // timestamp ms
}

export const XpBoostBadge: React.FC<XpBoostBadgeProps> = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, expiresAt - Date.now());
      if (diff <= 0) {
        setTimeLeft('00:00');
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (Date.now() > expiresAt) return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'var(--color-iris-soft, #E8E3F3)',
        border: '1.5px solid var(--color-iris, #6E5AA6)',
        boxShadow: '0 2px 0 var(--color-iris-bevel, #524080)',
        borderRadius: '12px',
        padding: '3px 8px',
        fontSize: '0.74rem',
        fontWeight: 800,
        color: 'var(--color-iris, #6E5AA6)',
      }}
      title="Multiplicador 2x XP ativo"
    >
      <Zap size={13} fill="var(--color-iris, #6E5AA6)" color="var(--color-iris, #6E5AA6)" />
      <span className="font-mono-tabular">2x ({timeLeft})</span>
    </div>
  );
};
