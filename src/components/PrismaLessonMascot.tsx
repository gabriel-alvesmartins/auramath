import React, { useEffect, useState } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { PrismaMascotWeb, PrismaMascotWebProps } from './PrismaMascotWeb';

export type PrismaLessonState = 'idle' | 'thinking' | 'correct' | 'incorrect';

export interface PrismaLessonMascotProps extends Omit<PrismaMascotWebProps, 'state'> {
  /**
   * Estado semântico de lição do mascote Prisma:
   * - 'idle': respiração orgânica, repouso receptivo
   * - 'thinking': tap no queixo, inclinação de cabeça, órbita matemática e interrogação 3D
   * - 'correct': squash & stretch alegre, aceno vitorioso
   * - 'incorrect': inclinação solidária/empática e recuperação encorajadora
   */
  state?: PrismaLessonState;
  /**
   * Força a visibilidade do anel orbital de símbolos matemáticos (+, -, ÷, %, ×).
   * Por padrão, fica ativo durante o estado 'thinking'.
   */
  showMathOrbit?: boolean;
  /**
   * Se verdadeiro, renderiza PrismaMascotWeb (SVG) caso o arquivo .riv falhe ou ocorra erro de canvas.
   * Padrão: true.
   */
  fallbackToSvg?: boolean;
  /**
   * Caminho para o ativo binário contextual de lição .riv
   * Padrão: '/mascot/prisma-lesson.riv'
   */
  rivSource?: string;
  size?: number;
  combo?: number;
  speechText?: string;
  showSpeechBubble?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * PrismaLessonMascot — Componente Rive Especializado para o Contexto de Lição
 *
 * Utiliza o binário contextual enxuto `prisma-lesson.riv` (< 50 KB)
 * acoplado à State Machine `PrismaLessonController` e aos pontos de ancoragem modulares (Anchors).
 *
 * Possui fallback gracioso automático para o SVG `PrismaMascotWeb`.
 */
export const PrismaLessonMascot: React.FC<PrismaLessonMascotProps> = ({
  state = 'idle',
  showMathOrbit = false,
  size = 110,
  combo = 1,
  speechText,
  showSpeechBubble = true,
  fallbackToSvg = true,
  rivSource = '/mascot/prisma-lesson.riv',
  className = '',
  style,
  onClick,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: rivSource,
    stateMachines: 'PrismaLessonController',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoadError: () => {
      setHasError(true);
    },
  });

  const stateInput = useStateMachineInput(rive, 'PrismaLessonController', 'state');
  const triggerCorrect = useStateMachineInput(rive, 'PrismaLessonController', 'triggerCorrect');
  const triggerIncorrect = useStateMachineInput(rive, 'PrismaLessonController', 'triggerIncorrect');
  const mathOrbitInput = useStateMachineInput(rive, 'PrismaLessonController', 'showMathOrbit');

  // Mapeia os estados da lição para os inputs da State Machine
  useEffect(() => {
    if (!stateInput) return;

    switch (state) {
      case 'thinking':
        stateInput.value = 1;
        break;
      case 'correct':
        stateInput.value = 2;
        triggerCorrect?.fire();
        break;
      case 'incorrect':
        stateInput.value = 3;
        triggerIncorrect?.fire();
        break;
      case 'idle':
      default:
        stateInput.value = 0;
        break;
    }
  }, [state, stateInput, triggerCorrect, triggerIncorrect]);

  // Atualiza o controle do anel orbital de símbolos matemáticos
  useEffect(() => {
    if (!mathOrbitInput) return;
    mathOrbitInput.value = Boolean(showMathOrbit || state === 'thinking');
  }, [showMathOrbit, state, mathOrbitInput]);

  // Se o Rive falhou e temos fallback ativado, degrada graciosamente para o SVG
  if (hasError && fallbackToSvg) {
    const fallbackSvgState =
      state === 'correct'
        ? 'eureka'
        : state === 'incorrect'
        ? 'camouflaged'
        : state === 'thinking'
        ? 'thinking'
        : 'idle';

    return (
      <PrismaMascotWeb
        state={fallbackSvgState}
        size={size}
        combo={combo}
        speechText={speechText}
        showSpeechBubble={showSpeechBubble}
        className={className}
        style={style}
        onClick={onClick}
        {...rest}
      />
    );
  }

  // Efeito de brilho de combo
  const glowIntensity = Math.min(1, Math.max(0, (combo - 1) / 15));
  const glowFilter =
    glowIntensity > 0
      ? `drop-shadow(0 0 ${8 + glowIntensity * 16}px rgba(241, 175, 50, ${0.45 + glowIntensity * 0.45}))`
      : 'none';

  return (
    <div
      className={`prisma-lesson-rive-container prisma-lesson-state-${state} ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        userSelect: 'none',
        ...style,
      }}
      onClick={onClick}
    >
      {/* Speech Bubble opcional */}
      {showSpeechBubble && speechText && (
        <div
          className="prisma-lesson-speech-bubble"
          role="tooltip"
          style={{
            background: '#FFFDF6',
            color: '#1C2C27',
            border: '1.5px solid #E2DBD0',
            boxShadow: '0 4px 12px rgba(28, 44, 39, 0.08)',
            borderRadius: 12,
            padding: '6px 12px',
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: 8,
            position: 'relative',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          {speechText}
        </div>
      )}

      {/* Rive Canvas */}
      <div
        className="prisma-lesson-rive-canvas-wrapper"
        style={{
          width: size,
          height: size,
          filter: glowFilter,
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <RiveComponent
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};

export default PrismaLessonMascot;
