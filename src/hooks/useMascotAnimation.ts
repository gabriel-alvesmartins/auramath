import { useState, useEffect, useRef, useCallback } from 'react';
import { getMascotConfig, PrismaMascotState, resolvePrismaState, getAssetUrl } from '../services/mascot/animationRegistry';
import { svgLoader } from '../services/mascot/svgLoader';

export interface UseMascotAnimationOptions {
  state: PrismaMascotState | string;
  fps?: number;
  loop?: boolean;
  onAnimationComplete?: () => void;
}

export interface UseMascotAnimationReturn {
  currentState: PrismaMascotState;
  svgContent: string | null;
  isLoading: boolean;
  play: () => void;
  pause: () => void;
  reset: () => void;
  transitionTo: (nextState: PrismaMascotState | string) => void;
}

/**
 * useMascotAnimation — Hook reativo para orquestrar ciclos e transições de quadros do Prisma
 *
 * Suporta avanço por delta time via requestAnimationFrame, modos loop/once e callbacks de conclusão.
 */
export function useMascotAnimation({
  state,
  fps = 30,
  loop = true,
  onAnimationComplete,
}: UseMascotAnimationOptions): UseMascotAnimationReturn {
  const [activeState, setActiveState] = useState<PrismaMascotState>(() => resolvePrismaState(state));
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isPlayingRef = useRef<boolean>(true);
  const lastTimeRef = useRef<number>(performance.now());
  const frameInterval = 1000 / fps;
  const animFrameIdRef = useRef<number | null>(null);

  // Sincroniza estado ativo com a prop
  useEffect(() => {
    const resolved = resolvePrismaState(state);
    setActiveState(resolved);
  }, [state]);

  // Carrega e atualiza SVG sempre que o estado ativo muda
  useEffect(() => {
    let isCurrent = true;
    const config = getMascotConfig(activeState);
    const assetUrl = getAssetUrl(config.svgPath);

    // Verificação rápida no cache síncrono
    const cached = svgLoader.getCachedSvg(assetUrl);
    if (cached) {
      setSvgContent(cached);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      svgLoader.loadSvg(assetUrl).then((content) => {
        if (isCurrent) {
          setSvgContent(content);
          setIsLoading(false);
        }
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [activeState]);

  // Loop com requestAnimationFrame e delta time
  useEffect(() => {
    isPlayingRef.current = true;
    lastTimeRef.current = performance.now();

    const loopStep = (now: number) => {
      if (!isPlayingRef.current) return;

      const delta = now - lastTimeRef.current;
      if (delta >= frameInterval) {
        lastTimeRef.current = now - (delta % frameInterval);

        const config = getMascotConfig(activeState);
        if (!loop && !config.loop && onAnimationComplete) {
          onAnimationComplete();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loopStep);
    };

    animFrameIdRef.current = requestAnimationFrame(loopStep);

    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [activeState, frameInterval, loop, onAnimationComplete]);

  const play = useCallback(() => {
    isPlayingRef.current = true;
  }, []);

  const pause = useCallback(() => {
    isPlayingRef.current = false;
  }, []);

  const reset = useCallback(() => {
    setActiveState('idle');
    isPlayingRef.current = true;
  }, []);

  const transitionTo = useCallback((nextState: PrismaMascotState | string) => {
    setActiveState(resolvePrismaState(nextState));
  }, []);

  return {
    currentState: activeState,
    svgContent,
    isLoading,
    play,
    pause,
    reset,
    transitionTo,
  };
}
