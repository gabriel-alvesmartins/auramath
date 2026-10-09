import React, { useState, useEffect } from 'react';
import { getMascotConfig, resolvePrismaState, PrismaMascotState, getAssetUrl } from '../services/mascot/animationRegistry';
import { svgLoader } from '../services/mascot/svgLoader';

export interface PrismaMascotWebProps {
  state?: PrismaMascotState | string;
  size?: number;
  combo?: number;
  speechText?: string;
  showSpeechBubble?: boolean;
  tailDirection?: 'down' | 'down-left' | 'down-right';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * PrismaMascotWeb — Componente Oficial do Mascote Auramath (Prisma, o Camaleão Geômetra 🦎📐)
 *
 * Características Anatômicas & Geometria:
 * - Crista em arco de transferidor graduado de 180°
 * - Olhos telescópicos de torre/bússola com rotação independente
 * - Esquadro 30°-60°-90° de acrílico ambarino sempre à mão
 * - Cauda em espiral áurea de Fibonacci
 *
 * Estados Suportados:
 * - idle: Respiração sutil do tórax e piscar a cada 4s
 * - thinking: Pêndulo sutil de dúvida e cálculo geométrico
 * - hint: Vetor luminoso pontilhado apontando o esquadro
 * - eureka: Salto com amortecimento elástico (squash & stretch)
 * - supernova: Auréola solar 360° em rotação contínua e brilho de vitória
 * - camouflaged: Dissolução em tons de ardósia para streaks em risco
 */
export const PrismaMascotWeb: React.FC<PrismaMascotWebProps> = ({
  state = 'idle',
  size = 90,
  combo = 1,
  speechText,
  showSpeechBubble = true,
  tailDirection = 'down',
  className = '',
  style,
  onClick,
}) => {
  const resolvedState = resolvePrismaState(state);
  const config = getMascotConfig(resolvedState);
  const assetUrl = getAssetUrl(config.svgPath);

  const [svgContent, setSvgContent] = useState<string | null>(() => {
    return svgLoader.getCachedSvg(assetUrl);
  });

  useEffect(() => {
    let isMounted = true;
    svgLoader.loadSvg(assetUrl).then((content) => {
      if (isMounted && content) {
        setSvgContent(content);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [assetUrl]);

  // Compute combo energy level for glow enhancement
  const glowIntensity = Math.min(1, Math.max(0, (combo - 1) / 15));
  const glowFilter =
    glowIntensity > 0 || resolvedState === 'supernova'
      ? `drop-shadow(0 0 ${8 + glowIntensity * 16}px rgba(241, 175, 50, ${0.45 + glowIntensity * 0.45}))`
      : 'none';

  return (
    <div
      className={`prisma-mascot-container prisma-state-${resolvedState} ${className}`}
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
      <style>{`
        /* ========================================================================== */
        /* Micro-Animações Vivas do Prisma                                           */
        /* ========================================================================== */

        /* No idle: Respiração suave do peito (scaleY) e piscar a cada 4s */
        @keyframes prismaBreathing {
          0%, 100% {
            transform: scaleY(1) scaleX(1);
          }
          50% {
            transform: scaleY(1.03) scaleX(0.985);
          }
        }

        @keyframes prismaBlink {
          0%, 94%, 98%, 100% {
            filter: brightness(1);
          }
          96% {
            filter: brightness(0.9);
          }
        }

        /* No eureka: Salto alegre com amortecimento elástico (squash & stretch) */
        @keyframes prismaEurekaJump {
          0% {
            transform: translateY(0) scale(1, 1);
          }
          15% {
            transform: translateY(5px) scale(1.15, 0.85); /* Squash antes do salto */
          }
          45% {
            transform: translateY(-28px) scale(0.88, 1.18); /* Stretch no ar */
          }
          65% {
            transform: translateY(2px) scale(1.1, 0.94); /* Squash no pouso */
          }
          82% {
            transform: translateY(-5px) scale(0.98, 1.02); /* Amortecimento elástico */
          }
          100% {
            transform: translateY(0) scale(1, 1);
          }
        }

        /* No supernova: Auréola solar 360° girando continuamente */
        @keyframes prismaHaloSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* No hint: Vetor luminoso pontilhado pulsando ao apontar esquadro */
        @keyframes prismaHintPulse {
          0%, 100% {
            transform: scale(1) translateX(0);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.08) translateX(6px);
            opacity: 1;
          }
        }

        /* No thinking: Balanço suave em dúvida investigativa */
        @keyframes prismaThinkingSway {
          0%, 100% {
            transform: rotate(0deg);
          }
          30% {
            transform: rotate(-3.5deg);
          }
          70% {
            transform: rotate(3.5deg);
          }
        }

        /* No camouflaged: Respiração sutil com transparência ardósia */
        @keyframes prismaCamouflagedFade {
          0%, 100% {
            opacity: 0.85;
          }
          50% {
            opacity: 0.6;
          }
        }

        .prisma-mascot-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .prisma-state-idle .prisma-mascot-wrapper {
          animation: prismaBreathing 3.6s ease-in-out infinite, prismaBlink 4s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .prisma-state-eureka .prisma-mascot-wrapper {
          animation: prismaEurekaJump 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-origin: bottom center;
        }

        .prisma-state-supernova .prisma-mascot-wrapper {
          animation: prismaBreathing 2.4s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .prisma-state-thinking .prisma-mascot-wrapper {
          animation: prismaThinkingSway 2.8s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .prisma-state-hint .prisma-mascot-wrapper {
          animation: prismaBreathing 3s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .prisma-state-camouflaged .prisma-mascot-wrapper {
          animation: prismaCamouflagedFade 3s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .prisma-svg-canvas {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .prisma-svg-canvas svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Editorial Speech Bubble ("Não calcule. Veja!") */
        .prisma-speech-bubble {
          background: #FFFDF6;
          color: #1C2C27;
          border: 1.5px solid #E2DBD0;
          box-shadow: 0 4px 12px rgba(28, 44, 39, 0.08);
          border-radius: 12px;
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 8px;
          position: relative;
          white-space: nowrap;
          z-index: 10;
          animation: prismaBreathing 3s ease-in-out infinite;
        }

        .prisma-speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 6px 6px 0;
          border-style: solid;
          border-color: #FFFDF6 transparent;
          display: block;
          width: 0;
        }

        .prisma-speech-bubble::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 7px 7px 0;
          border-style: solid;
          border-color: #E2DBD0 transparent;
          display: block;
          width: 0;
        }
      `}</style>

      {/* Editorial Speech Bubble */}
      {showSpeechBubble && speechText && (
        <div className="prisma-speech-bubble" role="tooltip">
          {speechText}
        </div>
      )}

      {/* Mascot Graphic View */}
      <div
        className="prisma-mascot-wrapper"
        style={{
          width: size,
          height: size,
          filter: glowFilter,
        }}
      >
        {/* Continuous 360° Solar Halo on Supernova */}
        {resolvedState === 'supernova' && (
          <div
            className="prisma-supernova-halo-ring"
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '128%',
              height: '128%',
              top: '-14%',
              left: '-14%',
              borderRadius: '50%',
              border: '2px dashed rgba(241, 175, 50, 0.65)',
              boxShadow: '0 0 28px rgba(241, 175, 50, 0.4), inset 0 0 20px rgba(241, 175, 50, 0.25)',
              animation: 'prismaHaloSpin 10s linear infinite',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        {/* Luminous Pulsing Vector Ray on Hint */}
        {resolvedState === 'hint' && (
          <div
            className="prisma-hint-vector-ray"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '28%',
              right: '-6px',
              width: '28px',
              height: '28px',
              borderTop: '2.5px dashed #F1AF32',
              borderRight: '2.5px dashed #F1AF32',
              transform: 'rotate(25deg)',
              animation: 'prismaHintPulse 1.8s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        )}

        {svgContent ? (
          <div
            className="prisma-svg-canvas"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <img
            src={assetUrl}
            alt={config.title}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            loading="eager"
          />
        )}
      </div>
    </div>
  );
};

export default PrismaMascotWeb;
