import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { audioSynth } from '../../services/audioSynth';

export interface ThemeToggleProps {
  className?: string;
  style?: React.CSSProperties;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, style }) => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.detail !== 0) {
      e.currentTarget.blur();
    }
    audioSynth.playKeypressTick();
    toggleTheme();
  };

  return (
    <button
      type="button"
      className={`aura-3d-btn aura-3d-btn--neutral aura-3d-btn--icon-sm ${className || ''}`}
      onClick={handleClick}
      aria-label={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
      title={isDark ? 'Modo Claro' : 'Modo Escuro'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(360deg) scale(1)',
          color: isDark ? 'var(--color-marigold, #F2B84B)' : 'var(--color-verdigris, #176B5B)',
        }}
      >
        {isDark ? <Sun size={17} strokeWidth={2.4} /> : <Moon size={17} strokeWidth={2.4} />}
      </span>
    </button>
  );
};

export default ThemeToggle;
