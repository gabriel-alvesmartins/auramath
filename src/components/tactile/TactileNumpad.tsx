import React, { useState, useEffect } from 'react';
import { Delete } from 'lucide-react';
import { audioSynth } from '../../services/audioSynth';
import { Aura3DButton } from './Aura3DButton';

export interface TactileNumpadProps {
  onInput: (digit: string) => void;
  onDelete?: () => void;
  onClear: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
  submitLabel?: string;
  enablePhysicalKeys?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface KeyConfig {
  id: string;
  label?: string;
  type: 'digit' | 'clear' | 'backspace';
  icon?: React.ReactNode;
}

const NUMPAD_KEYS: KeyConfig[] = [
  { id: '1', label: '1', type: 'digit' },
  { id: '2', label: '2', type: 'digit' },
  { id: '3', label: '3', type: 'digit' },
  { id: '4', label: '4', type: 'digit' },
  { id: '5', label: '5', type: 'digit' },
  { id: '6', label: '6', type: 'digit' },
  { id: '7', label: '7', type: 'digit' },
  { id: '8', label: '8', type: 'digit' },
  { id: '9', label: '9', type: 'digit' },
  { id: 'C', label: 'C', type: 'clear' },
  { id: '0', label: '0', type: 'digit' },
  { id: 'backspace', type: 'backspace', icon: <Delete size={22} strokeWidth={2.4} /> },
];

/**
 * TactileNumpad — 56dp ergonomic number pad with mechanical 3D depression and procedural audio ticks.
 *
 * Characteristics:
 * - 3 columns x 4 rows layout: [1-9], [C, 0, ⌫]
 * - 56dp minimum touch target height per key
 * - 3px extrusion, 2px sink on active at strict 0ms latency
 * - Synchronized physical keyboard listener (0-9, Backspace, Escape/C, Enter)
 * - Anti-layout shift tabular font on digits
 */
export const TactileNumpad: React.FC<TactileNumpadProps> = ({
  onInput,
  onDelete,
  onClear,
  onSubmit,
  disabled = false,
  submitLabel = 'VERIFICAR',
  enablePhysicalKeys = true,
  className = '',
  style,
}) => {
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);

  // Synchronized Physical Keyboard Listener
  useEffect(() => {
    if (!enablePhysicalKeys || disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        audioSynth.playKeypressTick();
        onInput(e.key);
        setActiveKeyId(e.key);
        setTimeout(() => setActiveKeyId(null), 100);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        audioSynth.playKeypressTick();
        if (onDelete) {
          onDelete();
        } else {
          onClear();
        }
        setActiveKeyId('backspace');
        setTimeout(() => setActiveKeyId(null), 100);
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        audioSynth.playKeypressTick();
        onClear();
        setActiveKeyId('C');
        setTimeout(() => setActiveKeyId(null), 100);
      } else if (e.key === 'Enter') {
        if (onSubmit) {
          e.preventDefault();
          audioSynth.playKeypressTick();
          onSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enablePhysicalKeys, disabled, onInput, onDelete, onClear, onSubmit]);

  const handleKeyClick = (key: KeyConfig) => {
    if (disabled) return;
    audioSynth.playKeypressTick();

    if (key.type === 'digit' && key.label) {
      onInput(key.label);
    } else if (key.type === 'clear') {
      onClear();
    } else if (key.type === 'backspace') {
      if (onDelete) {
        onDelete();
      } else {
        onClear();
      }
    }
  };

  return (
    <div
      className={`tactile-numpad ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '360px',
        margin: '0 auto',
        gap: '10px',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* 3x4 Grid of 56dp Keys */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          width: '100%',
        }}
      >
        {NUMPAD_KEYS.map((key) => {
          const isPressed = activeKeyId === key.id;
          const isClearKey = key.type === 'clear';
          const isBackspaceKey = key.type === 'backspace';

          return (
            <button
              key={key.id}
              type="button"
              disabled={disabled}
              onClick={() => handleKeyClick(key)}
              aria-label={isClearKey ? 'Limpar entrada' : isBackspaceKey ? 'Apagar dígito' : `Dígito ${key.label}`}
              className={[
                'aura-3d-btn',
                'aura-3d-btn--neutral',
                isPressed ? 'is-active' : '',
                disabled ? 'is-disabled' : '',
              ].filter(Boolean).join(' ')}
              style={{
                height: '56px',
                minHeight: '56px',
                borderRadius: '14px',
                fontSize: key.type === 'digit' ? '1.45rem' : '1.15rem',
                fontWeight: 800,
                padding: 0,
                color: isClearKey ? 'var(--color-alert)' : 'var(--color-text-primary)',
                fontFamily: key.type === 'digit' ? 'var(--font-mono)' : 'var(--font-display)',
                // 3px extrusion, 2px sink
                ['--btn-extrusion' as string]: 'var(--extrusion-sm, 3px)',
                ['--btn-depression' as string]: 'var(--depression-sm, 2px)',
              }}
            >
              <span className={key.type === 'digit' ? 'font-mono-tabular' : ''}>
                {key.icon ? key.icon : key.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Optional Submit Action Button */}
      {onSubmit && (
        <Aura3DButton
          variant="brand"
          size="lg"
          fullWidth
          disabled={disabled}
          onClick={onSubmit}
          style={{ marginTop: '2px' }}
        >
          {submitLabel}
        </Aura3DButton>
      )}
    </div>
  );
};

export default TactileNumpad;
