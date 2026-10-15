import React, { useState } from 'react';
import {
  TapToSplitExercise,
  SplitBlock,
  validateBlockMerge,
  createTapToSplitExercise,
} from '../../engine';
import { audioSynth } from '../../services/audioSynth';
import { RotateCcw, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { Aura3DButton } from './Aura3DButton';

export interface TapToSplitSlateProps {
  exercise?: TapToSplitExercise;
  onComplete?: (finalValue: number) => void;
  className?: string;
}

export const TapToSplitSlate: React.FC<TapToSplitSlateProps> = ({
  exercise: initialExercise = createTapToSplitExercise('47_plus_38'),
  onComplete,
  className = '',
}) => {
  const [exercise] = useState<TapToSplitExercise>(initialExercise);
  const [blocks, setBlocks] = useState<SplitBlock[]>(() =>
    initialExercise.initialBlocks.map((b) => ({ ...b }))
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [historySteps, setHistorySteps] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [shakeBlockId, setShakeBlockId] = useState<string | null>(null);

  // Reiniciar exercício
  const handleReset = () => {
    setBlocks(exercise.initialBlocks.map((b) => ({ ...b })));
    setSelectedBlockId(null);
    setHistorySteps([]);
    setIsCompleted(false);
    audioSynth.playKeypressTick();
  };

  // Clique em um bloco
  const handleBlockClick = (block: SplitBlock) => {
    if (isCompleted) return;

    // 1. Se o bloco pode ser dividido e ainda não foi dividido, executa a cisão (Tap-to-Split)
    if (block.canSplit && block.splitInto && block.splitInto.length > 0) {
      audioSynth.playKeypressTick();
      const newSubBlocks: SplitBlock[] = block.splitInto.map((sub, idx) => ({
        id: `${block.id}_sub_${idx}_${Date.now()}`,
        value: sub.value,
        label: sub.label,
        type: sub.type,
        canSplit: false,
      }));

      const newBlocks = blocks.flatMap((b) => (b.id === block.id ? newSubBlocks : [b]));
      setBlocks(newBlocks);
      setHistorySteps((prev) => [...prev, `Cisão: [${block.label}] ➔ ${newSubBlocks.map((s) => `[${s.label}]`).join(' + ')}`]);
      setSelectedBlockId(null);
      return;
    }

    // 2. Se nenhum bloco estava selecionado para fusão, seleciona este
    if (!selectedBlockId) {
      setSelectedBlockId(block.id);
      audioSynth.playKeypressTick();
      return;
    }

    // Se clicou no mesmo bloco, desmarca
    if (selectedBlockId === block.id) {
      setSelectedBlockId(null);
      return;
    }

    // 3. Tenta fundir o bloco previamente selecionado com o bloco atual
    const firstBlock = blocks.find((b) => b.id === selectedBlockId);
    if (!firstBlock) {
      setSelectedBlockId(block.id);
      return;
    }

    const mergeResult = validateBlockMerge(exercise, firstBlock.value, block.value);

    if (mergeResult.canMerge && mergeResult.resultingValue !== undefined) {
      // Fusão válida!
      audioSynth.playSuccessNote(historySteps.length + 1);
      const mergedBlock: SplitBlock = {
        id: `merged_${Date.now()}`,
        value: mergeResult.resultingValue,
        label: mergeResult.resultingLabel || String(mergeResult.resultingValue),
        type: mergeResult.resultingValue === exercise.finalAnswer ? 'final' : 'partial_sum',
        canSplit: false,
      };

      const remaining = blocks.filter((b) => b.id !== firstBlock.id && b.id !== block.id);
      const nextBlocks = [...remaining, mergedBlock];
      setBlocks(nextBlocks);
      setSelectedBlockId(null);

      const stepDesc = `Fusão: [${firstBlock.label}] + [${block.label}] = [${mergedBlock.label}]`;
      setHistorySteps((prev) => [...prev, stepDesc]);

      // Verifica se atingiu o valor final esperado
      if (
        nextBlocks.length === 1 &&
        nextBlocks[0].value === exercise.finalAnswer
      ) {
        setIsCompleted(true);
        audioSynth.playVictoryFanfare();
        if (onComplete) {
          setTimeout(() => onComplete(exercise.finalAnswer), 700);
        }
      }
    } else {
      // Tentativa de fusão inválida: micro-shake de descompressão
      audioSynth.playErrorSoftRelease();
      setShakeBlockId(block.id);
      setTimeout(() => setShakeBlockId(null), 400);
      setSelectedBlockId(null);
    }
  };

  return (
    <div
      className={`w-full max-w-[430px] mx-auto flex flex-col items-center bg-[#FFFDF6] border-2 border-[#176B5B]/20 rounded-3xl p-5 shadow-sm select-none ${className}`}
      data-testid="tap-to-split-slate"
    >
      {/* Cabeçalho da Lição Cinética */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#176B5B]/10 flex items-center justify-center text-[#176B5B]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B5B]">
              Decomposição por Toque
            </span>
            <h3 className="text-xl font-black text-[#202522] font-mono-tabular">
              {exercise.targetEquation}
            </h3>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl text-[#5C645F] hover:text-[#202522] hover:bg-[#F7F4EA] transition-colors"
          title="Reiniciar decomposição"
          aria-label="Reiniciar"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Balão Orientador Editorial */}
      <div className="w-full bg-[#F7F4EA] border border-[#176B5B]/15 rounded-2xl p-3 mb-5 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#F2B84B] flex-shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-[#5C645F] leading-snug">
          {isCompleted
            ? 'Fantástico! Você quebrou a complexidade e fundiu as partes com precisão visual!'
            : exercise.instruction}
        </p>
      </div>

      {/* Palco Interativo de Blocos */}
      <div className="w-full min-h-[160px] bg-[#F7F4EA]/60 rounded-2xl border-2 border-dashed border-[#176B5B]/20 p-4 flex flex-wrap items-center justify-center gap-3 mb-4">
        {blocks.map((block) => {
          const isSelected = selectedBlockId === block.id;
          const isShaking = shakeBlockId === block.id;
          const isFinal = block.type === 'final' || isCompleted;

          let bgClasses = 'bg-[#FFFDF6] text-[#202522] border-[#202522]/20';
          let shadowColor = '#CBD5E1';

          if (block.type === 'tens') {
            bgClasses = 'bg-[#176B5B]/10 text-[#176B5B] border-[#176B5B]/40';
            shadowColor = '#0F473D';
          } else if (block.type === 'units') {
            bgClasses = 'bg-[#F2B84B]/15 text-[#B87D0A] border-[#F2B84B]/50';
            shadowColor = '#D49520';
          } else if (isFinal) {
            bgClasses = 'bg-[#176B5B] text-white border-[#176B5B]';
            shadowColor = '#0E483C';
          }

          if (isSelected) {
            bgClasses = 'bg-[#F2B84B] text-[#202522] border-[#D49520] ring-4 ring-[#F2B84B]/30';
            shadowColor = '#B87D0A';
          }

          return (
            <button
              key={block.id}
              onClick={() => handleBlockClick(block)}
              style={{
                boxShadow: `0 4px 0 ${shadowColor}`,
                transform: isShaking
                  ? 'translateX(-4px)'
                  : isSelected
                  ? 'scale(1.06)'
                  : 'none',
              }}
              className={`min-w-[68px] h-[58px] px-4 rounded-2xl border-2 font-mono-tabular text-xl font-black flex items-center justify-center transition-all duration-150 active:translate-y-1 active:shadow-none cursor-pointer ${bgClasses} ${
                block.canSplit ? 'hover:scale-105' : ''
              }`}
            >
              <span>{block.label}</span>
              {block.canSplit && (
                <span className="ml-1 text-[10px] text-[#5C645F] font-sans font-bold">
                  ✂
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Histórico Cinético dos Passos */}
      {historySteps.length > 0 && (
        <div className="w-full bg-[#FFFDF6] border border-[#202522]/10 rounded-xl p-2.5 mb-4">
          <span className="text-[10px] font-bold uppercase text-[#5C645F] block mb-1">
            Raciocínio Visual Desdobrado:
          </span>
          <div className="flex flex-col gap-1">
            {historySteps.map((step, idx) => (
              <div
                key={idx}
                className="text-xs font-mono font-semibold text-[#176B5B] flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B]" />
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão de Conclusão / Avanço */}
      {isCompleted && (
        <div className="w-full animate-fade-in mt-2">
          <Aura3DButton
            variant="marigold"
            fullWidth
            onClick={() => onComplete && onComplete(exercise.finalAnswer)}
            className="text-base py-3 font-black flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-[#202522]" />
            CONCLUIR INSIGHT VISUAL ➔
          </Aura3DButton>
        </div>
      )}
    </div>
  );
};
