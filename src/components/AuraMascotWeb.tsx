import React from 'react';
import { PrismaMascotWeb } from './PrismaMascotWeb';
import { PrismaMascotState } from '../services/mascot/animationRegistry';

export type AuraMascotStage = 1 | 2 | 3 | 4 | 5 | 'dot' | 'line' | 'shape' | 'pattern' | 'insight';
export type AuraMascotState = 'idle' | 'happy' | 'hit' | 'supernova' | 'thinking' | 'encouraging';

export interface AuraMascotWebProps {
  stage?: AuraMascotStage;
  combo?: number;
  size?: number;
  state?: AuraMascotState;
  speechText?: string;
  showTierBadge?: boolean;
  showSpeechBubble?: boolean;
  useArt?: boolean;
  tailDirection?: 'down' | 'down-left' | 'down-right';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Normalizes stage prop into a strict 1..5 numeric tier.
 */
export function resolveStageNumber(stage?: AuraMascotStage, combo: number = 1): 1 | 2 | 3 | 4 | 5 {
  if (typeof stage === 'number' && !isNaN(stage)) {
    return Math.max(1, Math.min(5, Math.round(stage))) as 1 | 2 | 3 | 4 | 5;
  }
  if (typeof stage === 'string') {
    const map: Record<string, 1 | 2 | 3 | 4 | 5> = {
      dot: 1,
      line: 2,
      shape: 3,
      pattern: 4,
      insight: 5,
    };
    const mapped = map[stage.toLowerCase()];
    if (mapped) return mapped;
  }
  return combo >= 35 ? 5 : combo >= 20 ? 4 : combo >= 10 ? 3 : combo >= 5 ? 2 : 1;
}

/**
 * Maps legacy mascot states to canonical Prisma states.
 */
export function mapToPrismaState(state?: AuraMascotState, stageNum: number = 1): PrismaMascotState {
  if (state === 'happy') return 'eureka';
  if (state === 'encouraging') return 'hint';
  if (state === 'hit') return 'thinking';
  if (state === 'thinking') return 'thinking';
  if (state === 'supernova' || stageNum === 5) return 'supernova';
  return 'idle';
}

/**
 * AuraMascotWeb — Mascote Oficial Auramath (Prisma, o Camaleão Geômetra 🦎📐)
 *
 * Wrapper de retrocompatibilidade: repassa transparentemente para o PrismaMascotWeb.
 */
export const AuraMascotWeb: React.FC<AuraMascotWebProps> = ({
  stage,
  combo = 1,
  size = 90,
  state = 'idle',
  speechText,
  showSpeechBubble = true,
  tailDirection = 'down',
  className = '',
  style,
  onClick,
}) => {
  const activeStage = resolveStageNumber(stage, combo);
  const prismaState = mapToPrismaState(state, activeStage);

  return (
    <PrismaMascotWeb
      state={prismaState}
      size={size}
      combo={combo}
      speechText={speechText}
      showSpeechBubble={showSpeechBubble}
      tailDirection={tailDirection}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
};

export default AuraMascotWeb;
