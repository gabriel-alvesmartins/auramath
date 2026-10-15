import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MatchPairDefinition,
  generateComplementaryPairs,
  generateAlgebraicPairs,
} from '../../engine';
import { audioSynth } from '../../services/audioSynth';
import { Zap, Clock, Trophy, Flame, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Aura3DButton } from './Aura3DButton';
import confetti from 'canvas-confetti';

export interface MatchMadnessGridProps {
  initialPairs?: MatchPairDefinition[];
  timeLimitSec?: number;
  onFinish?: (stats: {
    pairsMatched: number;
    maxCombo: number;
    score: number;
    xpEarned: number;
  }) => void;
  onClose?: () => void;
  className?: string;
}

interface GridButtonState {
  id: string;
  pairId: string;
  label: string;
  side: 'left' | 'right';
  status: 'idle' | 'selected' | 'matched' | 'wrong';
}

export const MatchMadnessGrid: React.FC<MatchMadnessGridProps> = ({
  initialPairs,
  timeLimitSec = 45,
  onFinish,
  onClose,
  className = '',
}) => {
  // Pool de pares disponíveis
  const allPairsRef = useRef<MatchPairDefinition[]>([]);
  const queueIndexRef = useRef<number>(0);

  // Estados de jogo
  const [timeLeft, setTimeLeft] = useState<number>(timeLimitSec);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [pairsMatched, setPairsMatched] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeBonusFlash, setTimeBonusFlash] = useState<boolean>(false);

  // 5 botões na esquerda e 5 na direita
  const [leftButtons, setLeftButtons] = useState<GridButtonState[]>([]);
  const [rightButtons, setRightButtons] = useState<GridButtonState[]>([]);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);

  // Inicialização de pares e grid
  const initGame = useCallback(() => {
    const pairs =
      initialPairs && initialPairs.length >= 10
        ? [...initialPairs]
        : [...generateComplementaryPairs(100, 10), ...generateAlgebraicPairs(6)];

    allPairsRef.current = pairs;
    queueIndexRef.current = 5;

    const initialActive = pairs.slice(0, 5);

    const initialLeft: GridButtonState[] = initialActive.map((p) => ({
      id: `l_${p.id}`,
      pairId: p.id,
      label: p.leftLabel,
      side: 'left',
      status: 'idle',
    }));

    // Embaralha a coluna direita para não ficar espelhada na mesma linha
    const initialRight: GridButtonState[] = [...initialActive]
      .sort(() => Math.random() - 0.5)
      .map((p) => ({
        id: `r_${p.id}`,
        pairId: p.id,
        label: p.rightLabel,
        side: 'right',
        status: 'idle',
      }));

    setLeftButtons(initialLeft);
    setRightButtons(initialRight);
    setTimeLeft(timeLimitSec);
    setIsPlaying(true);
    setCombo(0);
    setMaxCombo(0);
    setPairsMatched(0);
    setScore(0);
    setSelectedLeftId(null);
    setSelectedRightId(null);
  }, [initialPairs, timeLimitSec]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Temporizador decrescente
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Trata seleção de botões e verificação de par
  const handleItemClick = (side: 'left' | 'right', buttonId: string) => {
    if (!isPlaying) return;

    audioSynth.playKeypressTick();

    if (side === 'left') {
      setSelectedLeftId(buttonId);
      setLeftButtons((prev) =>
        prev.map((b) => ({
          ...b,
          status: b.id === buttonId ? 'selected' : b.status === 'selected' ? 'idle' : b.status,
        }))
      );

      if (selectedRightId) {
        verifyMatch(buttonId, selectedRightId);
      }
    } else {
      setSelectedRightId(buttonId);
      setRightButtons((prev) =>
        prev.map((b) => ({
          ...b,
          status: b.id === buttonId ? 'selected' : b.status === 'selected' ? 'idle' : b.status,
        }))
      );

      if (selectedLeftId) {
        verifyMatch(selectedLeftId, buttonId);
      }
    }
  };

  // Verificação de par
  const verifyMatch = (leftId: string, rightId: string) => {
    const leftBtn = leftButtons.find((b) => b.id === leftId);
    const rightBtn = rightButtons.find((b) => b.id === rightId);

    if (!leftBtn || !rightBtn) return;

    const isMatch = leftBtn.pairId === rightBtn.pairId;

    if (isMatch) {
      // SUCESSO: Par Conectado!
      const newCombo = combo + 1;
      const newMaxCombo = Math.max(maxCombo, newCombo);
      setCombo(newCombo);
      setMaxCombo(newMaxCombo);
      setPairsMatched((prev) => prev + 1);

      const multiplier = newCombo >= 10 ? 3 : newCombo >= 5 ? 2 : 1;
      setScore((prev) => prev + 10 * multiplier);

      audioSynth.playSuccessNote(newCombo);

      // Bônus de tempo a cada marco de 5 pares
      if (newCombo > 0 && newCombo % 5 === 0) {
        setTimeLeft((prev) => prev + 3);
        setTimeBonusFlash(true);
        setTimeout(() => setTimeBonusFlash(false), 800);
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.3 },
          colors: ['#F2B84B', '#176B5B'],
        });
      }

      // Feedback visual de acerto nos botões
      setLeftButtons((prev) =>
        prev.map((b) => (b.id === leftId ? { ...b, status: 'matched' } : b))
      );
      setRightButtons((prev) =>
        prev.map((b) => (b.id === rightId ? { ...b, status: 'matched' } : b))
      );

      // Substituição in-place fluida (CLS = 0)
      setTimeout(() => {
        const nextPair = allPairsRef.current[queueIndexRef.current];
        if (nextPair) {
          queueIndexRef.current += 1;
          setLeftButtons((prev) =>
            prev.map((b) =>
              b.id === leftId
                ? {
                    id: `l_${nextPair.id}_${Date.now()}`,
                    pairId: nextPair.id,
                    label: nextPair.leftLabel,
                    side: 'left',
                    status: 'idle',
                  }
                : b
            )
          );
          setRightButtons((prev) =>
            prev.map((b) =>
              b.id === rightId
                ? {
                    id: `r_${nextPair.id}_${Date.now()}`,
                    pairId: nextPair.id,
                    label: nextPair.rightLabel,
                    side: 'right',
                    status: 'idle',
                  }
                : b
            )
          );
        } else {
          // Esgotou a fila: remove os botões
          setLeftButtons((prev) => prev.filter((b) => b.id !== leftId));
          setRightButtons((prev) => prev.filter((b) => b.id !== rightId));

          if (leftButtons.length <= 1) {
            setIsPlaying(false);
            audioSynth.playVictoryFanfare();
          }
        }

        setSelectedLeftId(null);
        setSelectedRightId(null);
      }, 250);
    } else {
      // ERRO: Não combinam
      audioSynth.playErrorSoftRelease();
      setCombo(0);

      setLeftButtons((prev) =>
        prev.map((b) => (b.id === leftId ? { ...b, status: 'wrong' } : b))
      );
      setRightButtons((prev) =>
        prev.map((b) => (b.id === rightId ? { ...b, status: 'wrong' } : b))
      );

      setTimeout(() => {
        setLeftButtons((prev) =>
          prev.map((b) => (b.id === leftId ? { ...b, status: 'idle' } : b))
        );
        setRightButtons((prev) =>
          prev.map((b) => (b.id === rightId ? { ...b, status: 'idle' } : b))
        );
        setSelectedLeftId(null);
        setSelectedRightId(null);
      }, 350);
    }
  };

  const xpEarned = Math.round(pairsMatched * 3 + score * 0.2);

  return (
    <div
      className={`w-full max-w-[430px] mx-auto flex flex-col items-center bg-[#FFFDF6] border-2 border-[#176B5B]/25 rounded-3xl p-5 shadow-md select-none ${className}`}
      data-testid="match-madness-grid"
    >
      {/* HUD Superior: Cronômetro, Combo e Pontuação */}
      <div className="w-full flex items-center justify-between mb-4 bg-[#F7F4EA] border border-[#176B5B]/15 rounded-2xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Clock
            className={`w-5 h-5 ${
              timeLeft <= 10 ? 'text-[#E76F61] animate-pulse' : 'text-[#176B5B]'
            }`}
          />
          <span
            className={`font-mono-tabular text-xl font-black ${
              timeLeft <= 10 ? 'text-[#E76F61]' : 'text-[#202522]'
            }`}
          >
            {timeLeft}s
          </span>
          {timeBonusFlash && (
            <span className="text-xs font-black text-[#176B5B] bg-[#176B5B]/15 px-1.5 py-0.5 rounded-full animate-bounce">
              +3s!
            </span>
          )}
        </div>

        {/* Combo Pill */}
        <div className="flex items-center gap-1.5 bg-[#FFFDF6] px-3 py-1 rounded-full border border-[#202522]/10 shadow-sm">
          <Flame
            className={`w-4 h-4 ${
              combo >= 10
                ? 'text-[#E76F61] fill-[#E76F61] animate-bounce'
                : combo >= 5
                ? 'text-[#F2B84B] fill-[#F2B84B]'
                : 'text-[#5C645F]'
            }`}
          />
          <span className="font-mono-tabular text-sm font-black text-[#202522]">
            {combo}x
          </span>
        </div>

        {/* Pares Conectados */}
        <div className="flex items-center gap-1.5 text-right">
          <Zap className="w-4 h-4 text-[#F2B84B]" />
          <span className="font-mono-tabular text-sm font-extrabold text-[#202522]">
            {pairsMatched} pares
          </span>
        </div>
      </div>

      {/* Grade de 2 Colunas com 5 Linhas (Altura Fixa 60px por linha para CLS = 0) */}
      {isPlaying ? (
        <div className="w-full grid grid-cols-2 gap-3 mb-5">
          {/* Coluna Esquerda */}
          <div className="flex flex-col gap-2.5">
            {leftButtons.map((btn) => {
              let bgClasses = 'bg-[#FFFDF6] text-[#202522] border-[#202522]/20';
              let shadow = '0 4px 0 #CBD5E1';

              if (btn.status === 'selected') {
                bgClasses = 'bg-[#F2B84B] text-[#202522] border-[#D49520] ring-4 ring-[#F2B84B]/30';
                shadow = '0 2px 0 #B87D0A';
              } else if (btn.status === 'matched') {
                bgClasses = 'bg-[#176B5B] text-white border-[#0F473D] scale-95';
                shadow = '0 2px 0 #0E483C';
              } else if (btn.status === 'wrong') {
                bgClasses = 'bg-[#E76F61]/20 text-[#E76F61] border-[#E76F61] animate-pulse';
                shadow = '0 2px 0 #C95447';
              }

              return (
                <button
                  key={btn.id}
                  onClick={() => handleItemClick('left', btn.id)}
                  style={{ boxShadow: shadow }}
                  className={`w-full h-[58px] px-3 rounded-2xl border-2 font-mono-tabular text-lg font-black flex items-center justify-center transition-all duration-150 active:translate-y-1 active:shadow-none cursor-pointer ${bgClasses}`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Coluna Direita */}
          <div className="flex flex-col gap-2.5">
            {rightButtons.map((btn) => {
              let bgClasses = 'bg-[#FFFDF6] text-[#202522] border-[#202522]/20';
              let shadow = '0 4px 0 #CBD5E1';

              if (btn.status === 'selected') {
                bgClasses = 'bg-[#F2B84B] text-[#202522] border-[#D49520] ring-4 ring-[#F2B84B]/30';
                shadow = '0 2px 0 #B87D0A';
              } else if (btn.status === 'matched') {
                bgClasses = 'bg-[#176B5B] text-white border-[#0F473D] scale-95';
                shadow = '0 2px 0 #0E483C';
              } else if (btn.status === 'wrong') {
                bgClasses = 'bg-[#E76F61]/20 text-[#E76F61] border-[#E76F61] animate-pulse';
                shadow = '0 2px 0 #C95447';
              }

              return (
                <button
                  key={btn.id}
                  onClick={() => handleItemClick('right', btn.id)}
                  style={{ boxShadow: shadow }}
                  className={`w-full h-[58px] px-3 rounded-2xl border-2 font-mono-tabular text-lg font-black flex items-center justify-center transition-all duration-150 active:translate-y-1 active:shadow-none cursor-pointer ${bgClasses}`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Tela de Resumo / Fim de Jogo */
        <div className="w-full flex flex-col items-center py-4 animate-fade-in text-center">
          <div className="w-16 h-16 rounded-full bg-[#F2B84B]/20 flex items-center justify-center mb-3">
            <Trophy className="w-8 h-8 text-[#B87D0A]" />
          </div>

          <h3 className="text-2xl font-black text-[#202522] mb-1">
            FIM DA RODADA!
          </h3>
          <p className="text-sm text-[#5C645F] font-semibold mb-6">
            Você conectou padrões com extrema fluência mental!
          </p>

          <div className="w-full grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#F7F4EA] border border-[#176B5B]/15 p-3 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-[#5C645F] block">
                Pares
              </span>
              <span className="text-2xl font-black text-[#176B5B] font-mono-tabular">
                {pairsMatched}
              </span>
            </div>
            <div className="bg-[#F7F4EA] border border-[#176B5B]/15 p-3 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-[#5C645F] block">
                Max Combo
              </span>
              <span className="text-2xl font-black text-[#F2B84B] font-mono-tabular">
                {maxCombo}x
              </span>
            </div>
            <div className="bg-[#F7F4EA] border border-[#176B5B]/15 p-3 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-[#5C645F] block">
                XP Ganho
              </span>
              <span className="text-2xl font-black text-[#6E5AA6] font-mono-tabular">
                +{xpEarned}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <Aura3DButton
              variant="brand"
              fullWidth
              size="lg"
              onClick={initGame}
              className="py-3 font-black flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              JOGAR NOVAMENTE ➔
            </Aura3DButton>

            {onClose && (
              <button
                onClick={() => {
                  if (onFinish) {
                    onFinish({ pairsMatched, maxCombo, score, xpEarned });
                  }
                  onClose();
                }}
                className="text-xs font-bold text-[#5C645F] hover:text-[#202522] py-2"
              >
                Voltar ao Hub
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
