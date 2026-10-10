import React, { useEffect, useState } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { resolvePrismaState, PrismaMascotState } from '../services/mascot/animationRegistry';
import { PrismaMascotWeb, PrismaMascotWebProps } from './PrismaMascotWeb';

export interface PrismaMascotRiveProps extends PrismaMascotWebProps {
  /**
   * Se verdadeiro, renderiza PrismaMascotWeb (SVG) caso o arquivo .riv falhe ou ocorra erro de canvas.
   * Padrão: true.
   */
  fallbackToSvg?: boolean;
  /**
   * Caminho para o ativo compilado .riv
   * Padrão: '/mascot/prisma.riv'
   */
  rivSource?: string;
}

/**
 * PrismaMascotRive — Componente Rive Oficial do Mascote Auramath (Prisma, o Camaleão Geômetra 🦎📐)
 *
 * Renderiza o mascote em tempo real via Rive Runtime (@rive-app/react-canvas)
 * utilizando o arquivo binário vetorial otimizado (`prisma.riv`, ~4.9 KB).
 *
 * Controla os estados via State Machine `PrismaController`:
 * - state = 0: idle (respiração suave e movimento sutil de cauda)
 * - state = 1: thinking (balanço inquisitivo e cálculo geométrico)
 * - state = 2: eureka (salto com squash & stretch e explosão de estrelas)
 * - state = 3: supernova (auréola solar 360° em rotação contínua e brilho de vitória)
 * - state = 4: hint (esquadro 30°-60°-90° apontado em foco de instrução)
 *
 * Possui fallback automático gracioso para PrismaMascotWeb caso o WebGL/Canvas falhe.
 */
export const PrismaMascotRive: React.FC<PrismaMascotRiveProps> = ({
  state = 'idle',
  size = 90,
  combo = 1,
  speechText,
  showSpeechBubble = true,
  fallbackToSvg = true,
  rivSource = '/mascot/prisma.riv',
  className = '',
  style,
  onClick,
  ...rest
}) => {
  const resolvedState = resolvePrismaState(state);
  const [hasError, setHasError] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: rivSource,
    stateMachines: 'PrismaController',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoadError: () => {
      setHasError(true);
    },
  });

  const stateInput = useStateMachineInput(rive, 'PrismaController', 'state');
  const triggerEureka = useStateMachineInput(rive, 'PrismaController', 'triggerEureka');

  // Mapeia o estado da aplicação para os inputs numéricos do PrismaController
  useEffect(() => {
    if (!stateInput) return;

    switch (resolvedState) {
      case 'thinking':
        stateInput.value = 1;
        break;
      case 'eureka':
        stateInput.value = 2;
        triggerEureka?.fire();
        break;
      case 'supernova':
        stateInput.value = 3;
        break;
      case 'hint':
        stateInput.value = 4;
        break;
      case 'idle':
      case 'camouflaged':
      default:
        stateInput.value = 0;
        break;
    }
  }, [resolvedState, stateInput, triggerEureka]);

  // Se o Rive falhou e temos fallback ativado, degrada graciosamente para o SVG
  if (hasError && fallbackToSvg) {
    return (
      <PrismaMascotWeb
        state={state}
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

  // Efeito de brilho de combo/streak
  const glowIntensity = Math.min(1, Math.max(0, (combo - 1) / 15));
  const glowFilter =
    glowIntensity > 0 || resolvedState === 'supernova'
      ? `drop-shadow(0 0 ${8 + glowIntensity * 16}px rgba(241, 175, 50, ${0.45 + glowIntensity * 0.45}))`
      : 'none';

  return (
    <div
      className={`prisma-rive-container prisma-state-${resolvedState} ${className}`}
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
      {/* Editorial Speech Bubble ("Não calcule. Veja!") */}
      {showSpeechBubble && speechText && (
        <div
          className="prisma-speech-bubble"
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
        className="prisma-rive-canvas-wrapper"
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

export default PrismaMascotRive;
