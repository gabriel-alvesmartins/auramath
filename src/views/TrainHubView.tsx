import React, { useState, useEffect, useRef } from 'react';
import {
  Flame, Clock, Trophy, Eye, Check, X, Sparkles, Zap, Shield, ChevronRight,
  ArrowLeft, Info, Play, Compass, Target, Brain, Lightbulb, RotateCcw, Filter,
  type LucideIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  generateQuestion,
  Question,
  generateFlashAnzanSequence,
  generatePatternRecognitionQuestion,
  PatternRecognitionQuestion,
  PatternOption,
  generateQuestionForUnits,
  resolveModuleForQuestion
} from '../engine';
import { AuraAvatar } from '../components/AuraAvatar';
import { Aura3DButton, TactileNumpad } from '../components/tactile';
import { AuraTutorCard } from '../components/editorial';
import { audioSynth } from '../services/audioSynth';

export type TrainingSubMode = 'arena' | 'pattern' | 'blitz' | 'sudden' | 'anzan' | 'zen';

export interface TrainHubViewProps {
  onStartLesson?: (nodeId: string) => void;
}

interface ModeDefinition {
  id: TrainingSubMode;
  title: string;
  tagline: string;
  category: string;
  durationLabel: string;
  icon: LucideIcon;
  color: string;
  softColor: string;
  borderColor: string;
  description: string;
  rules: string[];
  cognitiveSkills: string[];
  pedagogyQuote: string;
}

const TRAINING_MODES: ModeDefinition[] = [
  {
    id: 'pattern',
    title: 'Olho Matemático',
    tagline: 'Reconheça a estrutura antes de executar o cálculo.',
    category: 'Percepção Estrutural',
    durationLabel: 'Sem tempo · Foco Puro',
    icon: Eye,
    color: 'var(--color-verdigris, #176B5B)',
    softColor: 'var(--color-verdigris-soft, #DCEBE5)',
    borderColor: 'var(--color-verdigris-bevel, #104E42)',
    description: 'A assinatura do Auramath: diante de equações aparentemente complexas, identifique o atalho de simetria ou decomposição ideal para resolver em segundos sem esforço mecânico.',
    rules: [
      '4 alternativas conceituais estruturadas.',
      'Identifique a resolução ótima (Padrão Eureka).',
      'Receba mentoria explicativa imediata da Aura.',
      'Sequências perfeitas concedem bônus de XP elevado.',
    ],
    cognitiveSkills: ['Simetria Numérica', 'Produtos Notáveis', 'Decomposição em Base 50/100'],
    pedagogyQuote: 'Não calcule mecanicamente. Veja a relação que desfaz a complexidade.',
  },
  {
    id: 'arena',
    title: 'Laboratório de Agilidade',
    tagline: 'Cálculo mental contínuo com progressão de insight.',
    category: 'Fluência Mental',
    durationLabel: 'Treino Contínuo',
    icon: Flame,
    color: 'var(--color-marigold, #F2B84B)',
    softColor: 'var(--color-marigold-soft, #FFF0C9)',
    borderColor: '#C79331',
    description: 'Prática contínua de agilidade aritmética com teclado tátil de 56dp. Resolva em sequência para avançar no seu fluxo e ver a Aura evoluir em tempo real.',
    rules: [
      'Geração procedural contínua da esquerda para a direita.',
      'Multiplicador de insight progressivo até 5x.',
      'A mascote Aura evolui de estágio a cada marco de acertos.',
      'Ajustes de rota não encerram a sessão, apenas reiniciam o multiplicador.',
    ],
    cognitiveSkills: ['Aritmética Mental', 'Eliminação do "Vai-Um"', 'Resistência'],
    pedagogyQuote: 'A fluência nasce quando a mente soma ordens maiores primeiro.',
  },
  {
    id: 'blitz',
    title: 'Blitz 60 Segundos',
    tagline: 'Máxima velocidade contra o cronômetro.',
    category: 'Velocidade Cognitiva',
    durationLabel: '60 Segundos',
    icon: Clock,
    color: 'var(--color-iris, #6E5AA6)',
    softColor: 'var(--color-iris-soft, #E8E3F3)',
    borderColor: '#5B488C',
    description: '60 segundos no relógio. Quantas estruturas você consegue desarmar antes do tempo zerar? Cada segundo economizado e resposta correta eleva sua pontuação final.',
    rules: [
      'Cronômetro contínuo de 60 segundos.',
      'Cada acerto concede 100 pontos base multiplicados pelo combo.',
      'Ajustes de rota reiniciam o combo, mas não descontam tempo.',
      'Recorde registrado na sua Assinatura Cognitiva.',
    ],
    cognitiveSkills: ['Velocidade de Processamento', 'Reflexo Numérico', 'Foco Sob Pressão'],
    pedagogyQuote: 'Velocidade não é pressa; é clareza de caminho.',
  },
  {
    id: 'sudden',
    title: 'Sequência de Precisão',
    tagline: 'Construa a maior cadeia ininterrupta com tempo dinâmico.',
    category: 'Precisão Cirúrgica',
    durationLabel: 'Tempo Dinâmico',
    icon: Shield,
    color: 'var(--color-coral, #E76F61)',
    softColor: 'var(--color-coral-soft, #F8DED9)',
    borderColor: '#C25144',
    description: 'Desafio de concentração pura: o tempo por questão encurta a cada acerto consecutivo. Mantenha a clareza e precisão para estabelecer seu recorde de sequência.',
    rules: [
      'Foco ininterrupto: uma resposta divergente conclui o ensaio.',
      'O tempo limite encurta conforme sua sequência cresce.',
      'Exige foco sereno e tomada de decisão sem hesitação.',
      'Multiplicadores de XP proporcionais ao tamanho da cadeia.',
    ],
    cognitiveSkills: ['Calma Sob Estresse', 'Precisão Sem Margem de Erro', 'Foco Tubular'],
    pedagogyQuote: 'A verdadeira maestria é precisa mesmo sob o limite do tempo.',
  },
  {
    id: 'anzan',
    title: 'Flash Anzan',
    tagline: 'Retenção e soma de números relâmpago no soroban mental.',
    category: 'Memória de Trabalho',
    durationLabel: '6 Números / Rodada',
    icon: Zap,
    color: 'var(--color-verdigris, #176B5B)',
    softColor: 'var(--color-verdigris-soft, #DCEBE5)',
    borderColor: 'var(--color-verdigris-bevel, #104E42)',
    description: 'Sequências rápidas de números piscam na tela em fração de segundo. Projete o ábaco mental, retenha cada valor e digite a soma acumulada ao final.',
    rules: [
      '6 números são disparados a cada 400ms.',
      'Mantenha a soma acumulada mentalmente durante a exibição.',
      'Digite o total no teclado tático ao final da sequência.',
      'Recompensa de +500 pontos por rodada completada.',
    ],
    cognitiveSkills: ['Memória RAM de Trabalho', 'Projeção Visual', 'Retenção Transitória'],
    pedagogyQuote: 'O cérebro calcula o próximo número enquanto retém o anterior.',
  },
  {
    id: 'zen',
    title: 'Flow Zen',
    tagline: 'Imersão sonora lofi, sem cronômetro e foco profundo.',
    category: 'Foco & Meditação',
    durationLabel: 'Sessão Relaxante',
    icon: Sparkles,
    color: 'var(--color-verdigris, #176B5B)',
    softColor: 'var(--color-verdigris-soft, #DCEBE5)',
    borderColor: 'var(--color-verdigris-bevel, #104E42)',
    description: 'Matemática como meditação ativa. Sem relógio, sem pontuação punitiva e acompanhado por uma paisagem sonora acústica binaural sintetizada pelo dispositivo em tempo real.',
    rules: [
      'Zero cronômetro ou contagem regressiva.',
      'Música procedural Lo-fi com sintetizador Web Audio relaxante.',
      'Avanço no seu próprio ritmo natural.',
      'Ideal para sessões noturnas de estudo e foco sereno.',
    ],
    cognitiveSkills: ['Redução de Ansiedade', 'Intuição Espontânea', 'Atenção Plena'],
    pedagogyQuote: 'Quando a pressa desaparece, a estrutura matemática se revela.',
  },
];

export function TrainHubView({ onStartLesson }: TrainHubViewProps = {}) {
  // Navigation State: Menu vs Inspected vs Active Gameplay
  const [activeMode, setActiveMode] = useState<TrainingSubMode | null>(null);
  const [inspectedMode, setInspectedMode] = useState<ModeDefinition | null>(null);

  // SubMode state maintained for contracts & compatibility
  const [subMode, setSubMode] = useState<'arena' | 'pattern' | 'blitz' | 'sudden' | 'anzan' | 'zen'>('arena');

  // Curricular unit filter state
  const [selectedUnits, setSelectedUnits] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  const getNextQuestion = () =>
    generateQuestionForUnits(selectedUnits.length > 0 ? selectedUnits : [1, 2, 3, 4, 5, 6]);

  // Gameplay State
  const [q, setQ] = useState<Question>(() => getNextQuestion());
  const [inputVal, setInputVal] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(subMode === 'blitz' ? 60 : 15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [mascotState, setMascotState] = useState<'idle' | 'happy' | 'hit'>('idle');
  const [errorFlash, setErrorFlash] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [lastMissedQuestion, setLastMissedQuestion] = useState<Question | null>(null);

  // Pattern Recognition ("Olho Matemático") state
  const [patternQ, setPatternQ] = useState<PatternRecognitionQuestion>(() => generatePatternRecognitionQuestion());
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Flash Anzan specific state
  const [anzanSeq, setAnzanSeq] = useState<number[]>([]);
  const [anzanIdx, setAnzanIdx] = useState(-1);
  const [anzanPlaying, setAnzanPlaying] = useState(false);
  const anzanTimerRef = useRef<any>(null);

  // Synchronize activeMode with subMode
  const handleStartMode = (modeId: TrainingSubMode) => {
    audioSynth.playKeypressTick();
    setSubMode(modeId);
    setActiveMode(modeId);
    setInspectedMode(null);
  };

  const handleReturnToMenu = () => {
    audioSynth.playKeypressTick();
    audioSynth.stopZenMode();
    setActiveMode(null);
    setInspectedMode(null);
  };

  // Reset when activeMode or subMode changes
  useEffect(() => {
    if (!activeMode) {
      audioSynth.stopZenMode();
      return;
    }

    setScore(0);
    setStreak(0);
    setInputVal('');
    setIsGameOver(false);
    setMascotState('idle');
    setQ(getNextQuestion());
    setShowHint(false);
    setLastMissedQuestion(null);
    setTimeLeft(activeMode === 'blitz' ? 60 : 15);

    if (activeMode === 'pattern') {
      setPatternQ(generatePatternRecognitionQuestion());
      setSelectedOptionId(null);
    }

    if (activeMode === 'zen') {
      audioSynth.startZenMode();
    } else {
      audioSynth.stopZenMode();
    }

    return () => {
      audioSynth.stopZenMode();
      if (anzanTimerRef.current) {
        clearInterval(anzanTimerRef.current);
        anzanTimerRef.current = null;
      }
    };
  }, [activeMode, subMode]);

  // Timer loop for timed modes
  useEffect(() => {
    if (!activeMode || isGameOver || activeMode === 'arena' || activeMode === 'zen' || activeMode === 'anzan' || activeMode === 'pattern') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          audioSynth.playErrorSoftRelease();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeMode, isGameOver, q]);

  const handlePatternSelect = (opt: PatternOption) => {
    if (selectedOptionId) return;
    setSelectedOptionId(opt.id);

    if (opt.isOptimal) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore(prev => prev + 150 * Math.min(nextStreak, 5));
      setMascotState('happy');
      audioSynth.playSuccessNote(nextStreak);

      if (nextStreak % 5 === 0) {
        confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
      }
    } else {
      setErrorFlash(true);
      setMascotState('hit');
      audioSynth.playErrorSoftRelease();
      setStreak(0);
      setTimeout(() => {
        setErrorFlash(false);
        setMascotState('idle');
      }, 500);
    }
  };

  const nextPatternQuestion = () => {
    audioSynth.playKeypressTick();
    setPatternQ(generatePatternRecognitionQuestion());
    setSelectedOptionId(null);
    setMascotState('idle');
  };

  const handleSubmit = () => {
    if (!inputVal) return;
    const numericAns = parseInt(inputVal, 10);
    if (numericAns === q.answer) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore(prev => prev + 100 * Math.min(nextStreak, 5));
      setMascotState('happy');
      audioSynth.playSuccessNote(nextStreak);

      if (nextStreak % 5 === 0) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      }

      setQ(getNextQuestion());
      setShowHint(false);
      setInputVal('');
      if (activeMode === 'sudden') {
        setTimeLeft(Math.max(4, 12 - Math.floor(nextStreak / 2)));
      }
      setTimeout(() => setMascotState('idle'), 400);
    } else {
      setLastMissedQuestion(q);
      setErrorFlash(true);
      setMascotState('hit');
      audioSynth.playErrorSoftRelease();
      if (activeMode === 'sudden') {
        setIsGameOver(true);
      } else {
        setStreak(0);
      }
      setTimeout(() => {
        setErrorFlash(false);
        setMascotState('idle');
        setInputVal('');
      }, 500);
    }
  };

  const startAnzan = () => {
    const seq = generateFlashAnzanSequence(6);
    setAnzanSeq(seq);
    setAnzanPlaying(true);
    setInputVal('');
    setAnzanIdx(0);

    if (anzanTimerRef.current) {
      clearInterval(anzanTimerRef.current);
    }

    let i = 0;
    anzanTimerRef.current = setInterval(() => {
      i++;
      if (i < seq.length) {
        setAnzanIdx(i);
        audioSynth.playKeypressTick();
      } else {
        if (anzanTimerRef.current) {
          clearInterval(anzanTimerRef.current);
          anzanTimerRef.current = null;
        }
        setAnzanPlaying(false);
        setAnzanIdx(seq.length);
      }
    }, 400);
  };

  const handleAnzanSubmit = () => {
    const sum = anzanSeq.reduce((a, b) => a + b, 0);
    if (parseInt(inputVal, 10) === sum) {
      audioSynth.playSuccessNote(6);
      confetti({ particleCount: 35 });
      setScore(prev => prev + 500);
      setAnzanIdx(-1);
      setInputVal('');
    } else {
      audioSynth.playErrorSoftRelease();
      setInputVal('');
    }
  };

  const resetGame = () => {
    setIsGameOver(false);
    setScore(0);
    setStreak(0);
    setInputVal('');
    setTimeLeft(activeMode === 'blitz' ? 60 : 15);
    setQ(getNextQuestion());
    setShowHint(false);
    setLastMissedQuestion(null);
  };

  // ==========================================================================
  // VIEW 1: PRE-SELECTION MODE MENU (Aba Anterior com Botões Horizontais)
  // ==========================================================================
  if (!activeMode) {
    return (
      <div
        style={{
          padding: '16px',
          paddingBottom: '96px',
          maxWidth: '430px',
          margin: '0 auto',
          backgroundColor: 'var(--color-bg-base, #F7F4EA)',
          color: 'var(--color-text-primary, #202522)',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        {/* Editorial Eyebrow & Header */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                border: '1px solid var(--color-verdigris, #176B5B)',
              }}
            >
              <Zap size={13} color="var(--color-verdigris, #176B5B)" />
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  color: 'var(--color-verdigris, #176B5B)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                § 02 · LABORATÓRIO DE TREINAMENTO
              </span>
            </div>

            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                color: 'var(--color-ink-secondary, #5C645F)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              SELECIONE O MODO
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '0 0 4px',
              color: 'var(--color-text-primary, #202522)',
              fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
            }}
          >
            Centro de Treino
          </h1>
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--color-ink-secondary, #5C645F)',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            Escolha uma disciplina mental abaixo para ver suas regras pedagógicas e iniciar a prática.
          </p>
        </div>

        {/* Curricular Unit Scope Filter */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
            boxShadow: '0 3px 0 var(--color-border-bold, #C2BDAE)',
            borderRadius: '18px',
            padding: '12px 14px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={13} color="var(--color-verdigris, #176B5B)" />
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary, #202522)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Unidades no Treino ({selectedUnits.length}/6)
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                audioSynth.playKeypressTick();
                setSelectedUnits(selectedUnits.length === 6 ? [1] : [1, 2, 3, 4, 5, 6]);
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px 4px',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--color-verdigris, #176B5B)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {selectedUnits.length === 6 ? 'Limpar' : 'Todas'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
            {[1, 2, 3, 4, 5, 6].map((u) => {
              const isSelected = selectedUnits.includes(u);
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => {
                    audioSynth.playKeypressTick();
                    setSelectedUnits((prev) => {
                      if (prev.includes(u)) {
                        return prev.length === 1 ? prev : prev.filter((x) => x !== u);
                      }
                      return [...prev, u].sort((a, b) => a - b);
                    });
                  }}
                  style={{
                    padding: '8px 0',
                    borderRadius: '10px',
                    border: isSelected ? '1.5px solid var(--color-verdigris, #176B5B)' : '1.5px solid var(--color-border-subtle, #D9D5C8)',
                    backgroundColor: isSelected ? 'var(--color-verdigris, #176B5B)' : 'var(--color-bg-base, #F7F4EA)',
                    color: isSelected ? '#FFFFFF' : 'var(--color-ink-secondary, #5C645F)',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 2px 0 var(--color-verdigris-bevel, #104E42)' : '0 2px 0 var(--color-border-bold, #C2BDAE)',
                    transition: 'all 0.1s ease',
                  }}
                >
                  U{u}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stack of Horizontal Mode Buttons (Menu com botões um abaixo do outro) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {TRAINING_MODES.map((mode) => {
            const Icon = mode.icon;
            const isInspected = inspectedMode?.id === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  audioSynth.playKeypressTick();
                  setInspectedMode(mode);
                }}
                className="aura-3d-btn aura-3d-btn--paper"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textAlign: 'left',
                  backgroundColor: isInspected ? mode.softColor : 'var(--color-bg-surface, #FFFDF6)',
                  border: isInspected ? `2px solid ${mode.color}` : '1.5px solid var(--color-border-subtle, #D9D5C8)',
                  boxShadow: isInspected ? `0 4px 0 ${mode.borderColor}` : '0 3px 0 var(--color-border-bold, #C2BDAE)',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Icon in styled tactile badge */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: mode.softColor,
                    border: `1.5px solid ${mode.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: mode.color,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} strokeWidth={2.4} />
                </div>

                {/* Info Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: 'var(--color-text-primary, #202522)',
                        fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                      }}
                    >
                      {mode.title}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        backgroundColor: mode.softColor,
                        color: mode.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {mode.durationLabel}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.76rem',
                      color: 'var(--color-ink-secondary, #5C645F)',
                      lineHeight: 1.35,
                      fontWeight: 500,
                    }}
                  >
                    {mode.tagline}
                  </p>
                </div>

                {/* Right Action Chevron */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: isInspected ? mode.color : 'var(--color-ink-secondary, #5C645F)',
                    flexShrink: 0,
                  }}
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Mode Explanation Modal / Bottom Card (Explicação do modo quando clicar nele) */}
        {inspectedMode && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(32, 37, 34, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '16px',
              boxSizing: 'border-box',
            }}
            onClick={() => setInspectedMode(null)}
          >
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                border: '2px solid var(--color-ink, #202522)',
                borderRadius: '28px',
                padding: '24px 20px',
                maxWidth: '430px',
                width: '100%',
                boxShadow: '0 8px 0 var(--color-border-bold, #C2BDAE)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      backgroundColor: inspectedMode.softColor,
                      border: `1.5px solid ${inspectedMode.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: inspectedMode.color,
                      flexShrink: 0,
                    }}
                  >
                    <inspectedMode.icon size={26} strokeWidth={2.4} />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        color: inspectedMode.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {inspectedMode.category} · {inspectedMode.durationLabel}
                    </span>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: '1.35rem',
                        fontWeight: 900,
                        color: 'var(--color-text-primary, #202522)',
                        fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                      }}
                    >
                      {inspectedMode.title}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectedMode(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '6px',
                    cursor: 'pointer',
                    color: 'var(--color-ink-secondary, #5C645F)',
                  }}
                  aria-label="Fechar"
                >
                  <X size={20} strokeWidth={2.4} />
                </button>
              </div>

              {/* Description & Pedagogy Quote */}
              <div
                style={{
                  backgroundColor: inspectedMode.softColor,
                  border: `1px solid ${inspectedMode.borderColor}`,
                  borderRadius: '16px',
                  padding: '12px 14px',
                }}
              >
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-primary, #202522)', lineHeight: 1.45, fontWeight: 500 }}>
                  {inspectedMode.description}
                </p>
                <div style={{ marginTop: '8px', fontSize: '0.74rem', fontStyle: 'italic', color: inspectedMode.color, fontWeight: 700 }}>
                  “{inspectedMode.pedagogyQuote}”
                </div>
              </div>

              {/* How it Works / Rules */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-ink-secondary, #5C645F)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dinâmica & Regras
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {inspectedMode.rules.map((rule, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--color-text-primary, #202522)' }}>
                      <span style={{ color: inspectedMode.color, fontWeight: 900 }}>✓</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cognitive Skills Chips */}
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-ink-secondary, #5C645F)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Habilidades Calibradas
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {inspectedMode.cognitiveSkills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-paper, #F7F4EA)',
                        border: '1px solid var(--color-border-subtle, #D9D5C8)',
                        color: 'var(--color-text-primary, #202522)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <Aura3DButton
                  variant="brand"
                  size="lg"
                  fullWidth
                  onClick={() => handleStartMode(inspectedMode.id)}
                  icon={<Play size={16} fill="currentColor" />}
                >
                  INICIAR {inspectedMode.title.toUpperCase()} ➔
                </Aura3DButton>

                <Aura3DButton
                  variant="paper"
                  size="md"
                  fullWidth
                  onClick={() => setInspectedMode(null)}
                >
                  Voltar ao Menu
                </Aura3DButton>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // VIEW 2: ACTIVE GAMEPLAY STAGE (Modo de Jogo em Andamento)
  // ==========================================================================
  const currentModeMeta = TRAINING_MODES.find((m) => m.id === activeMode) || TRAINING_MODES[0];

  return (
    <div
      style={{
        paddingBottom: '90px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: 'var(--color-bg-base, #F7F4EA)',
        color: 'var(--color-text-primary, #202522)',
      }}
    >
      {/* Top Header Navigation: Return to Menu & Active Mode Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          borderBottom: '1px solid var(--color-border-subtle, #D9D5C8)',
          boxShadow: '0 1px 3px rgba(32, 37, 34, 0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 15,
        }}
      >
        <button
          type="button"
          onClick={handleReturnToMenu}
          className="aura-3d-btn aura-3d-btn--paper aura-3d-btn--sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: 800,
            padding: '0 10px',
            height: '32px',
          }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Menu de Treinos
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '12px',
            backgroundColor: currentModeMeta.softColor,
            border: `1px solid ${currentModeMeta.borderColor}`,
            fontSize: '0.74rem',
            fontWeight: 800,
            color: currentModeMeta.color,
          }}
        >
          <currentModeMeta.icon size={13} strokeWidth={2.4} />
          {currentModeMeta.title}
        </div>
      </div>

      {/* Main Training Stage */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px 20px',
          maxWidth: '430px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Metric Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 16px',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            borderRadius: '16px',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
            boxShadow: '0 3px 0 var(--color-border-bold, #C2BDAE)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame
              size={18}
              color={streak > 0 ? 'var(--color-brand, #176B5B)' : 'var(--color-text-muted, #8A938E)'}
            />
            <span
              className="font-mono-tabular"
              style={{
                fontWeight: 800,
                fontSize: '1.05rem',
                color: streak > 0 ? 'var(--color-brand, #176B5B)' : 'var(--color-text-muted, #8A938E)',
              }}
            >
              {streak}x
            </span>
          </div>

          {(activeMode === 'blitz' || activeMode === 'sudden') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock
                size={16}
                color={timeLeft <= 5 ? 'var(--color-coral, #E76F61)' : 'var(--color-marigold, #F2B84B)'}
              />
              <span
                className="font-mono-tabular"
                style={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: timeLeft <= 5 ? 'var(--color-coral, #E76F61)' : 'var(--color-marigold, #F2B84B)',
                }}
              >
                {timeLeft}s
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Trophy size={16} color="var(--color-marigold, #F2B84B)" />
            <span
              className="font-mono-tabular"
              style={{
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--color-text-primary, #202522)',
              }}
            >
              {score}
            </span>
          </div>
        </div>

        {/* Center Stage Body */}
        {activeMode === 'pattern' ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: 'auto 0',
              width: '100%',
              gap: '12px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <AuraAvatar combo={streak} size={72} state={mascotState} />

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                  border: '1px solid var(--color-verdigris, #176B5B)',
                  color: 'var(--color-verdigris, #176B5B)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  marginTop: '10px',
                  marginBottom: '6px',
                }}
              >
                <Eye size={13} />
                {patternQ.technique}
              </div>

              <div
                className="font-mono-tabular"
                style={{
                  fontSize: '2.6rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary, #202522)',
                  letterSpacing: '-0.02em',
                  marginTop: '4px',
                }}
              >
                {patternQ.equation}
              </div>

              <p
                style={{
                  color: 'var(--color-ink-secondary, #5C645F)',
                  fontSize: '0.82rem',
                  margin: '4px 0 0 0',
                  fontWeight: 600,
                }}
              >
                {patternQ.prompt}
              </p>
            </div>

            {/* 3D Tactile Shortcut Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              {patternQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let cardBg = 'var(--color-bg-surface, #FFFDF6)';
                let cardBorder = '1.5px solid var(--color-border-subtle, #D9D5C8)';
                let cardShadow = '0 4px 0 var(--color-border-bold, #C2BDAE)';
                let cardColor = 'var(--color-text-primary, #202522)';

                if (selectedOptionId) {
                  if (opt.isOptimal) {
                    cardBg = 'var(--color-verdigris-soft, #DCEBE5)';
                    cardBorder = '2px solid var(--color-verdigris, #176B5B)';
                    cardShadow = '0 4px 0 var(--color-verdigris-bevel, #104E42)';
                    cardColor = 'var(--color-verdigris, #176B5B)';
                  } else if (isSelected && !opt.isOptimal) {
                    cardBg = 'var(--color-coral-soft, #F8DED9)';
                    cardBorder = '2px solid var(--color-coral, #E76F61)';
                    cardShadow = '0 4px 0 #C25144';
                    cardColor = 'var(--color-coral, #E76F61)';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    className="aura-3d-shortcut-card"
                    disabled={selectedOptionId !== null}
                    onClick={() => {
                      audioSynth.playKeypressTick();
                      handlePatternSelect(opt);
                    }}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '16px',
                      backgroundColor: cardBg,
                      border: cardBorder,
                      boxShadow: cardShadow,
                      cursor: selectedOptionId ? 'default' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {selectedOptionId && opt.isOptimal && (
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--color-marigold, #F2B84B)',
                            color: '#202522',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          PADRÃO EUREKA
                        </span>
                      )}
                      <span
                        className="font-mono-tabular"
                        style={{
                          fontWeight: 800,
                          fontSize: '1.02rem',
                          color: cardColor,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {opt.label}
                      </span>
                    </div>

                    {selectedOptionId && opt.isOptimal && (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-verdigris, #176B5B)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                    {selectedOptionId && isSelected && !opt.isOptimal && (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-coral, #E76F61)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      >
                        <X size={16} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Insight do Atalho com AuraTutorCard */}
            {selectedOptionId && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AuraTutorCard
                  tutorName="AURA · TUTOR DE ESTRUTURA"
                  xpBonus={patternQ.options.find((o) => o.id === selectedOptionId)?.isOptimal ? 150 : 50}
                  speechText={patternQ.options.find((o) => o.isOptimal)?.explanation || 'Reconheça a simetria antes de calcular mecanicamente!'}
                />
                <Aura3DButton
                  variant="brand"
                  size="lg"
                  fullWidth
                  onClick={nextPatternQuestion}
                >
                  PRÓXIMO RECONHECIMENTO ➔
                </Aura3DButton>
              </div>
            )}
          </div>
        ) : activeMode === 'anzan' ? (
          <div
            style={{
              textAlign: 'center',
              margin: 'auto 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {anzanIdx === -1 && (
              <Aura3DButton variant="brand" size="lg" onClick={startAnzan}>
                Disparar Sequência Flash
              </Aura3DButton>
            )}

            {anzanPlaying && anzanIdx >= 0 && (
              <div
                className="font-mono-tabular"
                style={{
                  fontSize: '4.8rem',
                  fontWeight: 900,
                  color: 'var(--color-verdigris, #176B5B)',
                  letterSpacing: '-0.03em',
                }}
              >
                {anzanSeq[anzanIdx]}
              </div>
            )}

            {anzanIdx >= anzanSeq.length && (
              <div style={{ width: '100%' }}>
                <p
                  style={{
                    color: 'var(--color-ink-secondary, #5C645F)',
                    fontSize: '0.88rem',
                    marginBottom: '10px',
                    fontWeight: 600,
                  }}
                >
                  Soma dos números:
                </p>
                <div
                  className="font-mono-tabular"
                  style={{
                    fontSize: '2.8rem',
                    fontWeight: 800,
                    color: 'var(--color-marigold, #F2B84B)',
                    marginBottom: '16px',
                  }}
                >
                  {inputVal || '_'}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', margin: 'auto 0' }}>
            <AuraAvatar combo={streak} size={90} state={mascotState} />

            <div
              className="font-mono-tabular"
              style={{
                margin: '16px 0 10px 0',
                fontSize: '2.8rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--color-text-primary, #202522)',
              }}
            >
              {q.equation}
            </div>

            {/* Answer Display Box with Soft Coral flash */}
            <div
              className="font-mono-tabular"
              style={{
                height: '48px',
                maxWidth: '220px',
                margin: '0 auto',
                borderRadius: '14px',
                border: errorFlash
                  ? '2px solid var(--color-coral, #E76F61)'
                  : '2px solid var(--color-verdigris, #176B5B)',
                backgroundColor: errorFlash
                  ? 'var(--color-coral-soft, #F8DED9)'
                  : 'var(--color-bg-surface, #FFFDF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.65rem',
                fontWeight: 800,
                color: errorFlash ? 'var(--color-coral, #E76F61)' : 'var(--color-verdigris, #176B5B)',
                boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
              }}
            >
              {inputVal || <span style={{ opacity: 0.25 }}>_</span>}
            </div>

            {q.hint && (
              <div style={{ marginTop: '12px' }}>
                {!showHint ? (
                  <button
                    type="button"
                    onClick={() => {
                      audioSynth.playKeypressTick();
                      setShowHint(true);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      border: '1.5px solid var(--color-marigold-bevel, #C89228)',
                      backgroundColor: 'var(--color-marigold-soft, #FCF3DF)',
                      color: 'var(--color-text-primary, #202522)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 0 var(--color-marigold-bevel, #C89228)',
                    }}
                  >
                    <Lightbulb size={14} color="var(--color-marigold-bevel, #C89228)" />
                    Pedir Dica
                  </button>
                ) : (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-marigold-soft, #FCF3DF)',
                      border: '1.5px solid var(--color-marigold, #F2B84B)',
                      color: 'var(--color-text-primary, #202522)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      boxShadow: '0 2px 0 var(--color-marigold-bevel, #C89228)',
                    }}
                  >
                    <Lightbulb size={15} color="var(--color-marigold-bevel, #C89228)" />
                    <span>{q.hint}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tactile Numpad (Hidden in Pattern recognition mode) */}
        {activeMode !== 'pattern' && (
          <div style={{ width: '100%', marginTop: '16px' }}>
            <TactileNumpad
              disabled={activeMode === 'anzan' && (anzanPlaying || anzanIdx < 0 || anzanIdx < anzanSeq.length)}
              onInput={(k) => setInputVal((prev) => (prev.length < 6 ? prev + k : prev))}
              onDelete={() => setInputVal((prev) => prev.slice(0, -1))}
              onClear={() => setInputVal('')}
              onSubmit={activeMode === 'anzan' ? handleAnzanSubmit : handleSubmit}
              submitLabel={activeMode === 'anzan' ? 'ENVIAR RESPOSTA' : 'VERIFICAR'}
            />
          </div>
        )}
      </div>

      {/* Game Over Overlay */}
      {isGameOver && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(32, 37, 34, 0.82)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '24px',
            color: 'var(--color-text-primary, #202522)',
          }}
        >
          <Trophy size={48} color="var(--color-marigold, #F2B84B)" />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '14px 0 4px 0', color: '#FFFFFF' }}>
            Rodada Finalizada
          </h3>
          <p style={{ color: 'var(--color-paper, #F7F4EA)', fontSize: '0.88rem' }}>
            Pontuação registrada no córtex neural.
          </p>

          <div
            style={{
              backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
              border: '2px solid var(--color-ink, #202522)',
              boxShadow: '0 4px 0 var(--color-border-bold, #C2BDAE)',
              borderRadius: '18px',
              padding: '16px 32px',
              margin: '20px 0',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-secondary, #5C645F)', fontWeight: 700 }}>
              PONTOS FINAIS
            </div>
            <div
              className="font-mono-tabular"
              style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                color: 'var(--color-verdigris, #176B5B)',
                marginTop: '4px',
              }}
            >
              {score}
            </div>
          </div>

          {/* Missed Module Attribution and Retrain */}
          {lastMissedQuestion && (() => {
            const modInfo = resolveModuleForQuestion(lastMissedQuestion);
            return (
              <div
                style={{
                  backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                  border: '2px solid var(--color-coral, #E76F61)',
                  boxShadow: '0 4px 0 var(--color-coral-bevel, #B84739)',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  margin: '0 0 16px',
                  width: '100%',
                  maxWidth: '280px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <RotateCcw size={13} color="var(--color-coral, #E76F61)" />
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      color: 'var(--color-coral, #E76F61)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Reforço · Unidade {modInfo.unit}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-text-primary, #202522)',
                    marginBottom: '10px',
                  }}
                >
                  {modInfo.moduleTitle}
                </div>
                {onStartLesson && (
                  <Aura3DButton
                    variant="coral"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setIsGameOver(false);
                      onStartLesson(modInfo.nodeId);
                    }}
                  >
                    Retreinar Módulo ➔
                  </Aura3DButton>
                )}
              </div>
            );
          })()}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '280px' }}>
            <Aura3DButton variant="brand" size="lg" fullWidth onClick={resetGame}>
              Jogar Novamente
            </Aura3DButton>
            <Aura3DButton variant="paper" size="md" fullWidth onClick={handleReturnToMenu}>
              Trocar de Modo
            </Aura3DButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainHubView;
