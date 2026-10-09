import React, { useState, forwardRef } from 'react';
import { audioSynth } from '../../services/audioSynth';

export type Aura3DButtonVariant =
  | 'brand'
  | 'success'
  | 'alert'
  | 'gold'
  | 'neutral'
  | 'verdigris'
  | 'marigold'
  | 'coral'
  | 'iris'
  | 'paper';
export type Aura3DButtonSize = 'sm' | 'md' | 'lg';

export interface Aura3DButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Aura3DButtonVariant;
  size?: Aura3DButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  enableSound?: boolean; // default true -> triggers audioSynth.playKeypressTick()
}

/**
 * Aura3DButton — Duolingo-inspired 3D tactile button with hardware-accelerated 0ms sink latency.
 *
 * Physics & Tokens:
 * - Resting: box-shadow: 0 4px 0 var(--btn-bevel) (md), translateY(0)
 * - Press (:active / .is-active): translateY(3px), box-shadow: 0 1px 0 var(--btn-bevel), transition: none !important
 * - Release: 80ms cubic-bezier spring decompression
 * - Sound: procedural Web Audio keypress tick via audioSynth.playKeypressTick()
 * - Accessibility: full keyboard Space/Enter handling with synchronized tactile depression
 */
export const Aura3DButton = forwardRef<HTMLButtonElement, Aura3DButtonProps>(({
  variant = 'brand',
  size = 'md',
  fullWidth = false,
  icon,
  rightIcon,
  children,
  enableSound = true,
  disabled = false,
  className = '',
  style,
  onClick,
  onKeyDown,
  onKeyUp,
  onBlur,
  type = 'button',
  ...restProps
}, ref) => {
  const [isKeyPressed, setIsKeyPressed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (enableSound) {
      audioSynth.playKeypressTick();
    }
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
      setIsKeyPressed(true);
    }
    onKeyDown?.(e);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      setIsKeyPressed(false);
    }
    onKeyUp?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    setIsKeyPressed(false);
    onBlur?.(e);
  };

  const classNames = [
    'aura-3d-btn',
    `aura-3d-btn--${variant}`,
    `aura-3d-btn--${size}`,
    fullWidth ? 'aura-3d-btn--full' : '',
    isKeyPressed ? 'is-active' : '',
    disabled ? 'is-disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={classNames}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      style={style}
      {...restProps}
    >
      {icon && (
        <span
          className="aura-3d-btn__icon"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      )}
      <span className="aura-3d-btn__content">{children}</span>
      {rightIcon && (
        <span
          className="aura-3d-btn__icon aura-3d-btn__icon--right"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginLeft: '8px',
          }}
        >
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Aura3DButton.displayName = 'Aura3DButton';

export default Aura3DButton;
