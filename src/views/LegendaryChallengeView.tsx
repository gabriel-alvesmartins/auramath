import React, { useState, useMemo } from 'react';
import {
  TrackNodeData,
  Question,
  generateQuestionsForNode,
  evaluateLegendaryChallenge,
} from '../engine';
import { audioSynth } from '../services/audioSynth';
import { gamificationEngine } from '../services/gamificationEngine';
import { Crown, Sparkles, X, CheckCircle2, RotateCcw, ShieldAlert, Award } from 'lucide-react';
import { TactileNumpad } from '../components/tactile/TactileNumpad';
import { FeedbackDrawer } from '../components/tactile/FeedbackDrawer';
import { Aura3DButton } from '../components/tactile/Aura3DButton';
import { PrismaMascotWeb } from '../components/PrismaMascotWeb';
import confetti from 'canvas-confetti';

export interface LegendaryChallengeViewProps {
  node: TrackNodeData;
  onClose: () => void;
  onSuccess: (nodeId: string, xpEarned: number) => void;
  className?: string;
}

export const LegendaryChallengeView: React.FC<LegendaryChallengeViewProps> = ({
  node,
  onClose,
  onSuccess,
  className = '',
}) => {
  const totalQuestions = 8;

  // Gera 8 questões no nível 'hard' para o teste de maestria lendária
  const questions: Question[] = useMemo(() => {
    const raw = generateQuestionsForNode(node.id, totalQuestions, 'hard');
    return raw.slice(0, totalQuestions);
  }, [node.id]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [drawerStatus, setDrawerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [challengeFinished, setChallengeFinished] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleDigit = (digit: string) => {
    if (drawerStatus !== null || challengeFinished) return;
    setInputVal((prev) => (prev.length < 8 ? prev + digit : prev));
  };

  const handleDelete = () => {
    if (drawerStatus !== null || challengeFinished) return;
    setInputVal((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (drawerStatus !== null || challengeFinished) return;
    setInputVal('');
  };

  const handleVerify = () => {
    if (!inputVal || drawerStatus !== null || challengeFinished) return;
    const num = parseInt(inputVal, 10);
    const isCorrect = num === currentQ.answer;

    if (isCorrect) {
      audioSynth.playSuccessNote(correctCount + 1);
      setCorrectCount((prev) => prev + 1);
      setDrawerStatus('correct');
    } else {
      audioSynth.playErrorSoftRelease();
      const newMistakes = mistakesCount + 1;
      setMistakesCount(newMistakes);
      setDrawerStatus('incorrect');
    }
  };

  const handleDrawerContinue = () => {
    setDrawerStatus(null);
    setInputVal('');

    // Verifica se excedeu 1 erro (para 8 questões com >= 87.5%, máximo de 1 erro permitido)
    if (mistakesCount >= 2) {
      setChallengeFinished(true);
      setIsPassed(false);
      return;
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Bateria finalizada! Avalia com o motor oficial
      const evalResult = evaluateLegendaryChallenge(totalQuestions, correctCount);
      setChallengeFinished(true);
      setIsPassed(evalResult.passed);

      if (evalResult.passed) {
        audioSynth.playVictoryFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#F2B84B', '#176B5B', '#FFF0C9'],
        });
        gamificationEngine.addXP(evalResult.xpReward);
      }
    }
  };

  const restartChallenge = () => {
    setCurrentIndex(0);
    setInputVal('');
    setCorrectCount(0);
    setMistakesCount(0);
    setDrawerStatus(null);
    setChallengeFinished(false);
    setIsPassed(false);
    audioSynth.playKeypressTick();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#202522]/80 backdrop-blur-sm select-none ${className}`}
      data-testid="legendary-challenge-view"
    >
      <div className="w-full max-w-[430px] bg-[#FFFDF6] border-2 border-[#F2B84B] rounded-3xl p-5 shadow-2xl flex flex-col relative overflow-hidden">
        {/* Barra de brilho dourado Marigold no topo */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#F2B84B] via-[#FFE299] to-[#F2B84B]" />

        {/* Header do Desafio Lendário */}
        <div className="w-full flex items-center justify-between mt-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#F2B84B]/20 border border-[#F2B84B]/40 flex items-center justify-center text-[#B87D0A] shadow-inner">
              <Crown className="w-5 h-5 fill-[#F2B84B]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#B87D0A] block">
                Nível Lendário Dourado
              </span>
              <h2 className="text-base font-black text-[#202522] leading-tight line-clamp-1">
                {node.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5C645F] hover:text-[#202522] hover:bg-[#F7F4EA] transition-colors"
            aria-label="Fechar desafio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fita de Progresso das 8 Questões & Tolerância a Falhas */}
        {!challengeFinished && (
          <div className="w-full mb-5">
            <div className="flex items-center justify-between text-xs font-bold text-[#5C645F] mb-1.5">
              <span>Questão {currentIndex + 1} de {totalQuestions}</span>
              <span className="flex items-center gap-1 font-mono-tabular">
                <ShieldAlert className="w-3.5 h-3.5 text-[#E76F61]" />
                Falhas: {mistakesCount}/1 max
              </span>
            </div>

            <div className="w-full h-2.5 bg-[#F7F4EA] rounded-full border border-[#F2B84B]/30 overflow-hidden flex">
              {Array.from({ length: totalQuestions }).map((_, idx) => {
                let barColor = 'bg-transparent';
                if (idx < currentIndex) {
                  barColor = 'bg-[#176B5B]';
                } else if (idx === currentIndex) {
                  barColor = 'bg-[#F2B84B] animate-pulse';
                }
                return (
                  <div
                    key={idx}
                    className={`h-full flex-1 border-r border-[#FFFDF6] last:border-r-0 ${barColor}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Área Principal de Questão */}
        {!challengeFinished ? (
          <div className="w-full flex flex-col items-center">
            {/* Display da Equação */}
            <div className="w-full bg-[#F7F4EA] border-2 border-[#176B5B]/20 rounded-2xl p-5 mb-4 text-center">
              <span className="text-[11px] font-extrabold text-[#176B5B] uppercase tracking-wide block mb-1">
                Resolva sem andaimes:
              </span>
              <div className="text-3xl font-black font-mono-tabular text-[#202522]">
                {currentQ.equation}
              </div>

              {/* Visor de Digitação */}
              <div className="mt-3 min-h-[46px] bg-[#FFFDF6] border-2 border-[#202522]/20 rounded-xl flex items-center justify-center font-mono-tabular text-2xl font-black text-[#202522] shadow-inner">
                {inputVal || <span className="text-[#C2BDAE] text-lg font-sans">Digite a resposta</span>}
              </div>
            </div>

            {/* Teclado Tátil */}
            <div className="w-full">
              <TactileNumpad
                onInput={handleDigit}
                onDelete={handleDelete}
                onClear={handleClear}
                onSubmit={handleVerify}
                submitLabel="HOMOLOGAR ➔"
                disabled={drawerStatus !== null}
              />
            </div>
          </div>
        ) : isPassed ? (
          /* Card de Vitória Lendária Consagrada */
          <div className="w-full flex flex-col items-center py-6 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-[#F2B84B]/20 border-2 border-[#F2B84B] flex items-center justify-center mb-4 shadow-lg ring-8 ring-[#F2B84B]/15 animate-bounce">
              <Crown className="w-10 h-10 text-[#B87D0A] fill-[#F2B84B]" />
            </div>

            <span className="text-xs font-black uppercase text-[#B87D0A] tracking-wider mb-1">
              Homologação Suprema
            </span>
            <h3 className="text-2xl font-black text-[#202522] mb-2 font-display">
              MAESTRIA LENDÁRIA!
            </h3>
            <p className="text-sm font-semibold text-[#5C645F] max-w-[280px] mb-6">
              Você conquistou a coroa dourada do nó com {correctCount} de {totalQuestions} acertos perfeitos!
            </p>

            <div className="w-full bg-[#F7F4EA] border border-[#F2B84B]/30 rounded-2xl p-3.5 flex items-center justify-around mb-6">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase text-[#5C645F]">Recompensa</span>
                <span className="text-xl font-black text-[#B87D0A] font-mono-tabular">+50 XP</span>
              </div>
              <div className="h-8 w-px bg-[#202522]/10" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase text-[#5C645F]">Acurácia</span>
                <span className="text-xl font-black text-[#176B5B] font-mono-tabular">
                  {Math.round((correctCount / totalQuestions) * 100)}%
                </span>
              </div>
            </div>

            <Aura3DButton
              variant="marigold"
              fullWidth
              size="lg"
              onClick={() => {
                onSuccess(node.id, 50);
                onClose();
              }}
              className="py-3 font-black flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              CONCLUIR E COROAR NÓ ➔
            </Aura3DButton>
          </div>
        ) : (
          /* Card de Tentativa Fracassada (Empática) */
          <div className="w-full flex flex-col items-center py-6 text-center animate-fade-in">
            <div className="mb-4">
              <PrismaMascotWeb
                state="thinking"
                size={90}
                speechText="Quase lá! Treine mais uma vez!"
              />
            </div>

            <h3 className="text-xl font-black text-[#202522] mb-1">
              Desafio Não Homologado
            </h3>
            <p className="text-xs font-semibold text-[#5C645F] max-w-[280px] mb-5">
              O Nível Lendário exige no mínimo 7 acertos de 8 questões. Suas 3 estrelas continuam seguras!
            </p>

            <div className="w-full flex flex-col gap-2.5">
              <Aura3DButton
                variant="brand"
                fullWidth
                size="md"
                onClick={restartChallenge}
                className="py-2.5 font-bold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                TENTAR NOVAMENTE
              </Aura3DButton>

              <button
                onClick={onClose}
                className="text-xs font-bold text-[#5C645F] hover:text-[#202522] py-1.5"
              >
                Voltar à Trilha
              </button>
            </div>
          </div>
        )}

        {/* Drawer de Feedback Rápido */}
        <FeedbackDrawer
          status={drawerStatus}
          correctAnswer={currentQ.answer}
          userAnswer={inputVal}
          explanation={currentQ.explanation || currentQ.hint}
          onContinue={handleDrawerContinue}
        />
      </div>
    </div>
  );
};
