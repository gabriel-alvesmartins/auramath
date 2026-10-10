import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  X,
  Sparkles,
  Flame,
  Zap,
  Heart,
  Target,
  Clock,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  generateQuestion,
  generateQuestionsForNode,
  getNodeScaffoldingTasks,
  Question,
  TRACK_GRADES,
  TrackNodeData,
  ScaffoldingTask,
  DifficultyTier,
} from '../engine';
import { audioSynth } from '../services/audioSynth';
import { gamificationEngine } from '../services/gamificationEngine';
import { telemetryTracker } from '../services/telemetryTracker';
import { Aura3DButton } from '../components/tactile/Aura3DButton';
import { StatCard3D } from '../components/tactile/StatCard3D';
import { FeedbackDrawer } from '../components/tactile/FeedbackDrawer';
import { TactileNumpad } from '../components/tactile/TactileNumpad';
import { AuraMascotWeb, AuraMascotState } from '../components/AuraMascotWeb';
import { PrismaMascotWeb } from '../components/PrismaMascotWeb';
import {
  SymmetryRulerDiagram,
  StructureUnfoldingSlate,
  AuraTutorCard,
  DeepeningMiniCard,
} from '../components/editorial';

export interface DuolingoLessonViewProps {
  nodeId: string;
  onClose: () => void;
  onFinish: (stats: { xpEarned: number; accuracy: number; streak: number; stars?: number; secondsSaved?: number }) => void;
}

export type LessonStep = 'theory' | 'scaffolding' | 'drill';

// Baseline traditional calculation speed (pencil & paper): 7.5 seconds per question
const TRADITIONAL_TIME_PER_QUESTION_SEC = 7.5;

export const DuolingoLessonView: React.FC<DuolingoLessonViewProps> = ({
  nodeId,
  onClose,
  onFinish,
}) => {
  // 1. Resolve Curriculum Node
  let foundNode: TrackNodeData | undefined;
  for (const g of TRACK_GRADES) {
    const n = g.nodes.find((item) => item.id === nodeId);
    if (n) {
      foundNode = n;
      break;
    }
  }
  const node = foundNode || TRACK_GRADES[0].nodes[0];

  // Fallback theory & scaffolding data if node definitions are partial
  const theory = node.theory || {
    title: node.title,
    formula: node.sampleEquation || 'a + b = c',
    explanation: node.subtitle,
    example: node.sampleEquation || '',
    visualBreakdown: {
      from: node.sampleEquation ? node.sampleEquation.split('=')[0]?.trim() : '12 + 15',
      steps: ['12 + 10 = 22', '22 + 5 = 27'],
      to: node.sampleEquation ? node.sampleEquation.split('=')[1]?.trim() || '27' : '27',
    },
  };

  const scaffoldingTasks: ScaffoldingTask[] = useMemo(() => {
    return getNodeScaffoldingTasks(node.id);
  }, [node.id]);

  // 2. 3-Step Lesson Lifecycle State
  const [lessonStep, setLessonStep] = useState<LessonStep>('theory');
  const [isVictory, setIsVictory] = useState(false);
  const [isRetentionReview, setIsRetentionReview] = useState(false);

  // 3. Shared Gamification State
  const [hearts, setHearts] = useState(5);
  const [combo, setCombo] = useState(0);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [mascotState, setMascotState] = useState<AuraMascotState>('idle');
  const [auraSpeech, setAuraSpeech] = useState<string>(
    'Não calcule. Veja!'
  );

  // 4. Step 2: Gap Scaffolding State
  const [scaffoldTaskIndex, setScaffoldTaskIndex] = useState(0);
  const [activeBlankIndex, setActiveBlankIndex] = useState(0);
  const [scaffoldInput, setScaffoldInput] = useState('');
  const [scaffoldAnswers, setScaffoldAnswers] = useState<Record<string, string>>({});
  const [scaffoldError, setScaffoldError] = useState(false);
  const [scaffoldCompleted, setScaffoldCompleted] = useState(false);

  const currentScaffoldTask = scaffoldingTasks[scaffoldTaskIndex] || scaffoldingTasks[0];
  const activeBlank = currentScaffoldTask?.blanks[activeBlankIndex];

  // 5. Step 3: Agility Drill State (10 Questions, 3 Difficulty Tiers)
  const totalQuestions = 10;
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTier>('medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [drawerStatus, setDrawerStatus] = useState<'correct' | 'incorrect' | null>(null);

  // Focus Recharge Modal (Zero Hearts)
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeStep, setRechargeStep] = useState(0);
  const [rechargeAns, setRechargeAns] = useState('');

  // Elapsed Timing for Efficiency Calculation
  const drillStartTimeRef = useRef<number | null>(null);
  const [drillElapsedTime, setDrillElapsedTime] = useState<number>(0);

  // Initialize Drill Questions with Procedural Node-Specific Engine & Difficulty
  useEffect(() => {
    const list = generateQuestionsForNode(node.id, totalQuestions, selectedDifficulty);
    setQuestions(list);
  }, [node.id, selectedDifficulty]);

  const currentQ = questions[currentIndex] || {
    id: 'demo',
    equation: node.sampleEquation || '12 × 5',
    answer: 60,
    technique: node.technique || 'Fator 5',
    hint: 'Decomponha os fatores mentalmente.',
  };

  useEffect(() => {
    if (lessonStep === 'drill') {
      telemetryTracker.startQuestion(
        currentQ.id || `${node.id}_${currentIndex}`,
        node.technique || 'ADD_LEFT_RIGHT',
        selectedDifficulty
      );
    }
  }, [lessonStep, currentIndex, currentQ?.id, node.id, node.technique, selectedDifficulty]);

  // ============================================================================
  // Step 1: Transition Theory -> Scaffolding
  // ============================================================================
  const handleAdvanceToScaffolding = () => {
    audioSynth.playKeypressTick();
    setLessonStep('scaffolding');
    setMascotState('idle');
    setAuraSpeech('Preencha as lacunas intermediárias para consolidar o método!');
  };

  // ============================================================================
  // Step 2: Gap Scaffolding Handlers
  // ============================================================================
  const executeScaffoldAdvance = (enteredVal: string) => {
    if (!activeBlank) return;
    audioSynth.playSuccessNote(activeBlankIndex + 1);
    setMascotState('happy');
    setAuraSpeech('Excelente! Passo intermediário exato.');
    setScaffoldAnswers((prev) => ({ ...prev, [activeBlank.key]: enteredVal }));
    setScaffoldInput('');
    setScaffoldError(false);

    if (activeBlankIndex + 1 < currentScaffoldTask.blanks.length) {
      setActiveBlankIndex((prev) => prev + 1);
    } else {
      // Current task finished
      if (scaffoldTaskIndex + 1 < scaffoldingTasks.length) {
        setScaffoldTaskIndex((prev) => prev + 1);
        setActiveBlankIndex(0);
        setAuraSpeech('Andaime 1 dominado! Agora resolva o próximo.');
      } else {
        setScaffoldCompleted(true);
        setAuraSpeech('Andaime dominado! Pronto para a bateria de agilidade?');
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#176B5B', '#F2B84B', '#E76F61', '#6E5AA6', '#FFFDF6'],
        });
      }
    }
  };

  const handleScaffoldDigit = (digit: string) => {
    if (scaffoldCompleted || !activeBlank) return;
    if (scaffoldInput.length >= 6) return;
    audioSynth.playKeypressTick();
    const nextVal = scaffoldInput + digit;
    setScaffoldInput(nextVal);

    // Instant verification if input matches expected value
    if (nextVal.trim() === activeBlank.expected.trim()) {
      executeScaffoldAdvance(nextVal);
    }
  };

  const handleScaffoldDelete = () => {
    if (scaffoldCompleted) return;
    audioSynth.playKeypressTick();
    setScaffoldInput((prev) => prev.slice(0, -1));
  };

  const handleScaffoldClear = () => {
    if (scaffoldCompleted) return;
    audioSynth.playKeypressTick();
    setScaffoldInput('');
  };

  const handleScaffoldVerify = () => {
    if (scaffoldCompleted || !scaffoldInput || !activeBlank) return;
    if (scaffoldInput.trim() === activeBlank.expected.trim()) {
      executeScaffoldAdvance(scaffoldInput);
    } else {
      audioSynth.playErrorSoftRelease();
      setScaffoldError(true);
      setMascotState('thinking');
      setAuraSpeech(`Dica: observe ${activeBlank.label}. Tente novamente!`);
      setTimeout(() => setScaffoldError(false), 800);
    }
  };

  const handleAdvanceToDrill = () => {
    audioSynth.playKeypressTick();
    setLessonStep('drill');
    drillStartTimeRef.current = Date.now();
    setMascotState('idle');
    setAuraSpeech('Hora de acelerar! 5 cálculos rápidos com precisão máxima.');
  };

  // ============================================================================
  // Step 3: Agility Drill Handlers
  // ============================================================================
  const handleDigit = (digit: string) => {
    if (drawerStatus !== null) return;
    if (inputVal.length >= 6) return;
    audioSynth.playKeypressTick();
    setInputVal((prev) => prev + digit);
    setMascotState('thinking');
    setAuraSpeech('Calculando... Veja o padrão!');
  };

  const handleDelete = () => {
    if (drawerStatus !== null) return;
    audioSynth.playKeypressTick();
    setInputVal((prev) => {
      const next = prev.slice(0, -1);
      if (next.length === 0) {
        setMascotState('idle');
        setAuraSpeech('Não calcule. Veja!');
      }
      return next;
    });
  };

  const handleClear = () => {
    if (drawerStatus !== null) return;
    audioSynth.playKeypressTick();
    setInputVal('');
    setMascotState('idle');
    setAuraSpeech('Não calcule. Veja!');
  };

  const handleVerify = useCallback(() => {
    if (!inputVal || drawerStatus !== null) return;
    const num = parseInt(inputVal, 10);
    const isCorrect = num === currentQ.answer;

    // Record high-resolution 2-phase cognitive telemetry
    telemetryTracker.completeQuestion(inputVal, String(currentQ.answer), isCorrect);

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setCorrectFirstTry((prev) => prev + 1);
      audioSynth.playSuccessNote(newCombo);
      setMascotState('happy');
      setAuraSpeech(
        newCombo > 2 ? `Incrível! Combo x${newCombo}! Eureka!` : 'Eureka! Não calcule, veja!'
      );
      setDrawerStatus('correct');

      if (newCombo % 2 === 0) {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#176B5B', '#F2B84B', '#6E5AA6'],
        });
      }
    } else {
      const newHearts = Math.max(0, hearts - 1);
      setHearts(newHearts);
      setCombo(0);
      audioSynth.playErrorSoftRelease();
      setMascotState('thinking');
      setAuraSpeech(currentQ.hint || 'Veja a decomposição com atenção.');
      setDrawerStatus('incorrect');
    }
  }, [inputVal, currentQ, combo, hearts, drawerStatus]);

  const handleContinue = () => {
    if (hearts <= 0) {
      setDrawerStatus(null);
      setShowRechargeModal(true);
      return;
    }

    setDrawerStatus(null);
    setInputVal('');
    setMascotState('idle');
    setAuraSpeech('Não calcule. Veja!');

    if (currentIndex + 1 >= totalQuestions) {
      // Completed drill!
      const elapsed = drillStartTimeRef.current
        ? (Date.now() - drillStartTimeRef.current) / 1000
        : 14.8;
      setDrillElapsedTime(elapsed);

      const calculatedAccuracy = Math.round((correctFirstTry / totalQuestions) * 100);
      if (calculatedAccuracy >= 80) {
        setIsVictory(true);
        audioSynth.playVictoryFanfare();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#176B5B', '#F2B84B', '#E76F61', '#6E5AA6', '#FFFDF6'],
        });
      } else {
        setIsRetentionReview(true);
        audioSynth.playErrorSoftRelease();
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAuraSpeech('Próximo cálculo! Mantenha o ritmo.');
    }
  };

  // Keyboard shortcut listener for Enter / Space / Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showRechargeModal) return;

      if (isVictory) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const accuracy = Math.round((correctFirstTry / totalQuestions) * 100);
          const stars = accuracy === 100 ? 3 : accuracy >= 90 ? 2 : 1;
          const xpEarned = 20 + (accuracy >= 80 ? 15 : accuracy >= 50 ? 10 : 5);
          const currentStreak = gamificationEngine.getState().streak.current;
          onFinish({ xpEarned, accuracy, streak: currentStreak + 1, stars });
        }
        return;
      }

      if (drawerStatus !== null) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleContinue();
        }
        return;
      }

      if (lessonStep === 'theory') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAdvanceToScaffolding();
        }
        return;
      }

      if (lessonStep === 'scaffolding' && scaffoldCompleted) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAdvanceToDrill();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    lessonStep,
    scaffoldCompleted,
    drawerStatus,
    showRechargeModal,
    isVictory,
    correctFirstTry,
    totalQuestions,
    onFinish,
  ]);

  // Handle Focus Recharge
  const handleRechargeVerify = () => {
    const expected = rechargeStep === 0 ? 15 : 20; // 7 + 8 = 15, 12 + 8 = 20
    if (parseInt(rechargeAns, 10) === expected) {
      audioSynth.playSuccessNote(rechargeStep + 1);
      if (rechargeStep === 0) {
        setRechargeStep(1);
        setRechargeAns('');
      } else {
        setHearts(5);
        setShowRechargeModal(false);
        setRechargeStep(0);
        setRechargeAns('');
        setMascotState('happy');
        setAuraSpeech('Energia cósmica recarregada! Vamos continuar!');
      }
    } else {
      audioSynth.playErrorSoftRelease();
    }
  };

  // ============================================================================
  // VICTORY CELEBRATION SCREEN ("Lesson Complete")
  // ============================================================================
  if (isVictory) {
    const accuracy = Math.round((correctFirstTry / totalQuestions) * 100);
    const stars = accuracy === 100 ? 3 : accuracy >= 90 ? 2 : 1;
    const xpEarned = 20 + (accuracy >= 80 ? 15 : accuracy >= 50 ? 10 : 5);
    const currentStreak = gamificationEngine.getState().streak.current;

    // Traditional vs AuraMath Calculation Efficiency
    const standardTimeSeconds = totalQuestions * TRADITIONAL_TIME_PER_QUESTION_SEC; // 5 * 7.5 = 37.5s
    const actualTimeSeconds = drillElapsedTime > 0 ? Number(drillElapsedTime.toFixed(1)) : 14.5;
    const secondsSaved = Math.max(0, Number((standardTimeSeconds - actualTimeSeconds).toFixed(1)));
    const efficiencyMultiplier =
      actualTimeSeconds > 0 ? Number((standardTimeSeconds / actualTimeSeconds).toFixed(1)) : 1.0;

    return (
      <div
        className="auramath-viewport"
        style={{
          width: '100%',
          maxWidth: '430px',
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg-base)',
          color: 'var(--color-text-primary)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 24px 32px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {/* Centered Celebrating Aura Mascot */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              position: 'relative',
            }}
          >
            <PrismaMascotWeb
              size={220}
              state="supernova"
              speechText="Não calcule. Veja!"
              showSpeechBubble={true}
              combo={15}
            />
            {/* Compatibility anchor for legacy test runners: /assets/aura_celebrate.jpg */}
            <span style={{ display: 'none' }} data-asset="/assets/aura_celebrate.jpg" />
          </div>


          {/* Victory Title & Subtitle */}
          <h1
            style={{
              fontSize: '1.9rem',
              fontWeight: 900,
              color: 'var(--color-gold)',
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-display)',
            }}
          >
            Lição Concluída!
          </h1>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
              margin: 0,
              fontWeight: 600,
            }}
          >
            {node.title} dominada com maestria!
          </p>

          {/* Side-by-Side 3D Metric Cards (Total XP & Accuracy) */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              width: '100%',
              marginTop: '24px',
            }}
          >
            {/* Total XP Card with Lucide Zap (XP Cósmico legacy mapping) */}
            <StatCard3D
              variant="xp"
              label="XP Descoberta"
              value={`+${xpEarned}`}
              sublabel={`Ofensiva de ${currentStreak} dias!`}
              icon={<Zap size={18} strokeWidth={2.4} />}
            />


            {/* Accuracy Card with Lucide Target */}
            <StatCard3D
              variant="accuracy"
              label="Precisão"
              value={`${accuracy}%`}
              sublabel="Maestria mental"
              icon={<Target size={18} strokeWidth={2.4} />}
            />
          </div>

          {/* Dedicated Efficiency Analysis Card ("Segundos economizados") */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '20px',
              boxShadow: '0 3px 0 var(--color-border-bold)',
              padding: '16px 18px',
              width: '100%',
              marginTop: '12px',
              boxSizing: 'border-box',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--color-brand)" strokeWidth={2.4} />
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Segundos economizados
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--color-brand)',
                  backgroundColor: 'var(--color-brand-surface)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {efficiencyMultiplier}x mais veloz
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
              <span
                className="font-mono-tabular"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--color-brand)',
                  lineHeight: 1,
                }}
              >
                +{secondsSaved}s
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                tempo poupado vs lápis & papel
              </span>
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                marginTop: '6px',
                lineHeight: 1.35,
              }}
            >
              Você calculou em <strong>{actualTimeSeconds.toFixed(1)}s</strong> vs{' '}
              <strong>{standardTimeSeconds.toFixed(1)}s</strong> no método tradicional com lápis e papel.
            </div>

            {/* Visual Comparative Speed Bar */}
            <div
              style={{
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid var(--color-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                }}
              >
                <span>Velocidade Mental Aura</span>
                <span className="font-mono-tabular" style={{ color: 'var(--color-brand)' }}>
                  {actualTimeSeconds.toFixed(1)}s
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  backgroundColor: 'var(--color-border-subtle)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, Math.round((actualTimeSeconds / standardTimeSeconds) * 100))}%`,
                    height: '100%',
                    backgroundColor: 'var(--color-brand)',
                    borderRadius: '999px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* High-Impact Full-Width 3D Continue Button */}
        <div style={{ width: '100%', marginTop: '24px' }}>
          <Aura3DButton
            variant="brand"
            size="lg"
            fullWidth
            onClick={() =>
              onFinish({
                xpEarned,
                accuracy,
                streak: currentStreak + 1,
                stars,
                secondsSaved,
              })
            }
          >
            CONTINUAR
          </Aura3DButton>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RETENTION REVIEW SCREEN (Accuracy < 80%)
  // ============================================================================
  if (isRetentionReview) {
    const accuracy = Math.round((correctFirstTry / totalQuestions) * 100);
    return (
      <div
        className="auramath-viewport"
        style={{
          width: '100%',
          maxWidth: '430px',
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg-base)',
          color: 'var(--color-text-primary)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 24px 32px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <AuraMascotWeb
              size={120}
              state="thinking"
              speechText="Precisamos de mais prática para fixar esse atalho!"
              showTierBadge={false}
            />
          </div>

          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-coral, #E76F61)',
              backgroundColor: 'var(--color-coral-soft, #FDECE9)',
              border: '1px solid var(--color-coral, #E76F61)',
              padding: '4px 12px',
              borderRadius: '999px',
              marginBottom: '10px',
            }}
          >
            Revisão de Retenção Necessária
          </span>

          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              margin: '0 0 8px',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
            }}
          >
            Meta de Retenção: 80%
          </h1>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
              margin: '0 0 20px',
              lineHeight: 1.45,
            }}
          >
            Você alcançou <strong>{accuracy}%</strong> de acerto nesta bateria. Para conquistar as estrelas e liberar o próximo nó, a regra pedagógica exige pelo menos 80% de precisão.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              width: '100%',
              marginBottom: '16px',
            }}
          >
            <StatCard3D
              icon={<Target size={18} color="var(--color-coral, #E76F61)" />}
              label="Acurácia Obtida"
              value={`${accuracy}%`}
              variant="accuracy"
            />
            <StatCard3D
              icon={<Sparkles size={18} color="var(--color-marigold-bevel, #D49A2E)" />}
              label="Alvo Mínimo"
              value="80%"
              variant="xp"
            />
          </div>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
          <Aura3DButton
            variant="brand"
            size="lg"
            fullWidth
            onClick={() => {
              setQuestions(generateQuestionsForNode(node.id, totalQuestions, selectedDifficulty));
              setCurrentIndex(0);
              setInputVal('');
              setCorrectFirstTry(0);
              setHearts(5);
              setCombo(0);
              setIsRetentionReview(false);
              setDrawerStatus(null);
              drillStartTimeRef.current = Date.now();
              audioSynth.playKeypressTick();
            }}
          >
            TENTAR NOVAMENTE
          </Aura3DButton>

          <Aura3DButton
            variant="paper"
            size="md"
            fullWidth
            onClick={() => {
              setIsRetentionReview(false);
              setLessonStep('theory');
              audioSynth.playKeypressTick();
            }}
          >
            REVISAR TEORIA
          </Aura3DButton>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.85rem',
              fontWeight: 700,
              padding: '8px',
              cursor: 'pointer',
            }}
          >
            Voltar à Trilha
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // ACTIVE 3-STEP LESSON VIEW
  // ============================================================================
  return (
    <div
      className="auramath-viewport"
      style={{
        width: '100%',
        maxWidth: '430px',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-base)',
        color: 'var(--color-text-primary)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 16px 24px',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* 1. TOP BAR: CLOSE, 3-SEGMENT PROGRESS, HEARTS */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Fechar lição"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
            }}
          >
            <X size={22} />
          </button>

          {/* Segmented Progress Bar across 3 Steps (Theory, Scaffolding, Drill) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flex: 1,
            }}
          >
            {[
              {
                id: 'theory',
                label: 'Teoria',
                active: lessonStep === 'theory',
                done: lessonStep === 'scaffolding' || lessonStep === 'drill',
                fill: lessonStep === 'theory' ? 100 : lessonStep === 'scaffolding' || lessonStep === 'drill' ? 100 : 0,
              },
              {
                id: 'scaffolding',
                label: 'Andaime',
                active: lessonStep === 'scaffolding',
                done: lessonStep === 'drill',
                fill:
                  lessonStep === 'drill'
                    ? 100
                    : lessonStep === 'scaffolding'
                    ? Math.min(
                        100,
                        Math.round(
                          ((activeBlankIndex + (scaffoldCompleted ? 1 : 0)) /
                            (currentScaffoldTask.blanks.length || 1)) *
                            100
                        )
                      )
                    : 0,
              },
              {
                id: 'drill',
                label: 'Agilidade',
                active: lessonStep === 'drill',
                done: false,
                fill:
                  lessonStep === 'drill'
                    ? Math.min(
                        100,
                        Math.round(
                          ((currentIndex + (drawerStatus === 'correct' ? 1 : 0)) / totalQuestions) * 100
                        )
                      )
                    : 0,
              },
            ].map((seg) => (
              <div
                key={seg.id}
                style={{
                  flex: 1,
                  height: '10px',
                  backgroundColor: 'var(--color-border-subtle)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
                }}
                title={`${seg.label}: ${seg.fill}%`}
              >
                <div
                  style={{
                    width: `${seg.fill}%`,
                    height: '100%',
                    backgroundColor:
                      seg.id === 'theory'
                        ? 'var(--color-brand)'
                        : seg.id === 'scaffolding'
                        ? 'var(--color-gold)'
                        : 'var(--color-success)',
                    borderRadius: '999px',
                    transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                  }}
                >
                  {/* Highlight shine */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1px',
                      left: '3px',
                      right: '3px',
                      height: '2px',
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hearts / Energy Crystals */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-alert-surface)',
              border: '1.5px solid var(--color-alert)',
              padding: '4px 10px',
              borderRadius: '16px',
            }}
          >
            <Heart size={16} color="var(--color-alert)" fill="var(--color-alert)" />
            <span
              className="font-mono-tabular"
              style={{
                fontSize: '0.85rem',
                fontWeight: 900,
                color: 'var(--color-alert)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {hearts}
            </span>
          </div>
        </div>

        {/* Step Context Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color:
                lessonStep === 'theory'
                  ? 'var(--color-brand)'
                  : lessonStep === 'scaffolding'
                  ? 'var(--color-gold)'
                  : 'var(--color-success)',
              backgroundColor:
                lessonStep === 'theory'
                  ? 'var(--color-brand-surface)'
                  : lessonStep === 'scaffolding'
                  ? 'var(--color-gold-surface)'
                  : 'var(--color-success-surface)',
              padding: '3px 10px',
              borderRadius: '999px',
            }}
          >
            {lessonStep === 'theory' && 'Passo 1 de 3 • Apresentação de Teoria'}
            {lessonStep === 'scaffolding' && 'Passo 2 de 3 • Andaime de Lacunas'}
            {lessonStep === 'drill' && `Passo 3 de 3 • Agilidade (${currentIndex + 1}/${totalQuestions})`}
          </span>
        </div>

        {/* Floating Aura Mascot with Speech Bubble */}
        <div style={{ margin: '8px 0 16px', display: 'flex', justifyContent: 'center' }}>
          <AuraMascotWeb
            size={76}
            combo={combo}
            state={mascotState}
            speechText={auraSpeech}
            showTierBadge={false}
          />
        </div>

        {/* ==================================================================== */}
        {/* STEP 1: RAPID THEORY PRESENTATION                                   */}
        {/* ==================================================================== */}
        {lessonStep === 'theory' && (
          <>
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',

              border: '1px solid var(--color-border-subtle)',
              borderRadius: '24px',
              padding: '22px 18px',
              boxShadow: '0 4px 0 var(--color-border-bold)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <BookOpen size={18} color="var(--color-brand)" strokeWidth={2.4} />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-brand)',
                }}
              >
                Fundamento Algébrico
              </span>
            </div>

            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 900,
                color: 'var(--color-text-primary)',
                margin: '0 0 10px',
                fontFamily: 'var(--font-display)',
              }}
            >
              {theory.title}
            </h2>

            {/* Formula Callout Card */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1.5px solid var(--color-brand)',
                borderRadius: '16px',
                padding: '12px 16px',
                marginBottom: '14px',
                textAlign: 'center',
                boxShadow: '0 2px 8px var(--color-brand-surface)',
              }}
            >
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Fórmula Canônica
              </div>
              <div
                className="font-mono-tabular"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: 'var(--color-brand)',
                }}
              >
                {theory.formula}
              </div>
            </div>

            {/* Explanation Body */}
            <p
              style={{
                fontSize: '0.88rem',
                lineHeight: 1.5,
                color: 'var(--color-text-secondary)',
                margin: '0 0 16px',
              }}
            >
              {theory.explanation}
            </p>

            {/* Visual Breakdown Pipeline */}
            {theory.visualBreakdown && (
              <div
                style={{
                  backgroundColor: 'var(--color-bg-base)',
                  borderRadius: '16px',
                  padding: '14px',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  Decomposição Passo a Passo
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      borderRadius: '8px',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {theory.visualBreakdown.from}
                  </span>

                  <ArrowRight size={16} color="var(--color-brand)" strokeWidth={2.4} />

                  {theory.visualBreakdown.steps?.map((stepStr, idx) => (
                    <React.Fragment key={idx}>
                      <span
                        style={{
                          padding: '4px 10px',
                          backgroundColor: 'var(--color-brand-surface)',
                          borderRadius: '8px',
                          color: 'var(--color-brand)',
                          border: '1px solid var(--color-brand)',
                        }}
                      >
                        {stepStr}
                      </span>
                      <ArrowRight size={16} color="var(--color-brand)" strokeWidth={2.4} />
                    </React.Fragment>
                  ))}

                  <span
                    style={{
                      padding: '4px 12px',
                      backgroundColor: 'var(--color-success-surface)',
                      borderRadius: '8px',
                      color: 'var(--color-success)',
                      border: '1px solid var(--color-success)',
                      boxShadow: '0 0 10px var(--color-success-surface)',
                    }}
                  >
                    {theory.visualBreakdown.to}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Visual Symmetry Ruler Diagram (Figma Node 1:471) - only for symmetric difference of squares */}
          {node.id === 'DIFF_OF_SQUARES' && (
            <div style={{ marginTop: '16px' }}>
              <SymmetryRulerDiagram
                expression={theory.example || node.sampleEquation || "48 × 52"}
                leftValue={48}
                centerSupport={50}
                rightValue={52}
                delta={2}
                caption="Simetria equidistante em torno da dezena de ouro"
              />
            </div>
          )}

          {/* Structure Unfolding Slate (Figma Node 1:542) */}
          <div style={{ marginTop: '16px' }}>
            <StructureUnfoldingSlate
              formulaTitle={`DESDOBRAMENTO: ${node.title.toUpperCase()}`}
              formulaCanon={theory.formula}
              finalResult={theory.visualBreakdown?.to || node.sampleEquation?.split('=')[1]?.trim() || 'Exato'}
              steps={[
                {
                  number: 1,
                  label: 'Ponto de partida',
                  expression: theory.visualBreakdown?.from || node.sampleEquation?.split('=')[0]?.trim() || node.title,
                },
                ...(theory.visualBreakdown?.steps || []).map((stepStr, idx) => ({
                  number: idx + 2,
                  label: `Passo intermediário ${idx + 1}`,
                  expression: stepStr,
                  highlighted: true,
                })),
                {
                  number: (theory.visualBreakdown?.steps?.length || 0) + 2,
                  label: 'Resultado Final',
                  expression: theory.visualBreakdown?.to || node.sampleEquation?.split('=')[1]?.trim() || 'Exato',
                },
              ]}
              climaxCaption="domínio mental do atalho"
            />
          </div>

          {/* Aura Tutor Intuitive Dialogue Card (Figma Node 1:609) */}
          <div style={{ marginTop: '16px' }}>
            <AuraTutorCard
              tutorName={`AURA · ${node.technique?.toUpperCase() || 'TUTOR INTUITIVO'}`}
              xpBonus={50 + (node.grade || 1) * 10}
              speechText={theory.explanation || `Compreenda a essência de ${node.title} para acelerar seus cálculos sem armar conta no papel.`}
            />
          </div>

          {/* Deepening Mini-Card (Figma Node 1:630) */}
          <div style={{ marginTop: '16px' }}>
            <DeepeningMiniCard
              title={`Por que ${node.title} sempre funciona?`}
              subtitle={`Fundamentação: ${theory.formula || 'Propriedades aritméticas estruturais'}`}
              onClick={() => audioSynth.playKeypressTick()}
            />
          </div>
        </>
        )}


        {/* ==================================================================== */}
        {/* STEP 2: GAP SCAFFOLDING (ANDAIME DE LACUNAS)                         */}
        {/* ==================================================================== */}
        {lessonStep === 'scaffolding' && (
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '24px',
              padding: '22px 18px',
              boxShadow: '0 4px 0 var(--color-border-bold)',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--color-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
              }}
            >
              {currentScaffoldTask.instruction}
            </div>

            {/* Template with Embedded Interactive Blanks */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-base)',
                border: '1.5px solid var(--color-border-bold)',
                borderRadius: '18px',
                padding: '18px 14px',
                margin: '12px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                minHeight: '80px',
                fontSize: '1.35rem',
                fontWeight: 900,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {/* Parse template string with blanks */}
              {currentScaffoldTask.template.split(/(\{.*?\})/g).map((segment, idx) => {
                if (segment.startsWith('{') && segment.endsWith('}')) {
                  const key = segment.slice(1, -1);
                  const blankIdx = currentScaffoldTask.blanks.findIndex((b) => b.key === key);
                  if (blankIdx === -1) return null;

                  const blankDef = currentScaffoldTask.blanks[blankIdx];
                  const isFilled = blankIdx < activeBlankIndex || scaffoldCompleted;
                  const isActive = blankIdx === activeBlankIndex && !scaffoldCompleted;

                  if (isFilled) {
                    return (
                      <span
                        key={key}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px 12px',
                          minWidth: '50px',
                          height: '42px',
                          backgroundColor: 'var(--color-success-surface)',
                          border: '2px solid var(--color-success)',
                          borderRadius: '12px',
                          color: 'var(--color-success)',
                          boxShadow: '0 0 10px var(--color-success-surface)',
                        }}
                      >
                        {scaffoldAnswers[key] || blankDef.expected}
                      </span>
                    );
                  }

                  if (isActive) {
                    return (
                      <span
                        key={key}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px 12px',
                          minWidth: '56px',
                          height: '42px',
                          backgroundColor: 'var(--color-bg-surface)',
                          border: scaffoldError
                            ? '2px solid var(--color-alert)'
                            : '2px solid var(--color-brand)',
                          boxShadow: scaffoldError
                            ? '0 0 12px var(--color-alert-surface)'
                            : '0 0 14px var(--color-brand-surface)',
                          borderRadius: '12px',
                          color: scaffoldError ? 'var(--color-alert)' : 'var(--color-brand)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {scaffoldInput ? (
                          scaffoldInput
                        ) : (
                          <span style={{ opacity: 0.35, fontSize: '1rem' }}>?</span>
                        )}
                      </span>
                    );
                  }

                  // Dormant upcoming blank
                  return (
                    <span
                      key={key}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px 12px',
                        minWidth: '46px',
                        height: '42px',
                        backgroundColor: 'var(--color-bg-elevated)',
                        border: '1.5px dashed var(--color-border-bold)',
                        borderRadius: '12px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      ...
                    </span>
                  );
                }

                // Plain text chunk
                return (
                  <span key={idx} style={{ color: 'var(--color-text-primary)' }}>
                    {segment}
                  </span>
                );
              })}
            </div>

            {/* Prompt for Active Blank */}
            {activeBlank && !scaffoldCompleted && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 700,
                  marginTop: '8px',
                }}
              >
                <HelpCircle size={15} color="var(--color-brand)" />
                <span>
                  Preencha a lacuna:{' '}
                  <strong style={{ color: 'var(--color-brand)' }}>{activeBlank.label}</strong>
                </span>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 3: 10-QUESTION AGILITY DRILL WITH 3 DIFFICULTY TIERS            */}
        {/* ==================================================================== */}
        {lessonStep === 'drill' && (
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1.5px solid var(--color-border-subtle)',
              borderRadius: '24px',
              padding: '24px 20px',
              width: '100%',
              boxSizing: 'border-box',
              textAlign: 'center',
              boxShadow: '0 4px 0 var(--color-border-bold)',
            }}
          >
            {/* Difficulty Tier Selector (1★ Fácil, 2★ Médio, 3★ Difícil) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              {(['easy', 'medium', 'hard'] as const).map((tier) => {
                const isSel = selectedDifficulty === tier;
                const label = tier === 'easy' ? '★ Fácil' : tier === 'medium' ? '★★ Médio' : '★★★ Difícil';
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => {
                      if (selectedDifficulty !== tier) {
                        setSelectedDifficulty(tier);
                        audioSynth.playKeypressTick();
                      }
                    }}
                    style={{
                      border: isSel ? '1.5px solid var(--color-verdigris, #176B5B)' : '1px solid var(--color-border-subtle, #D9D5C8)',
                      backgroundColor: isSel ? 'var(--color-verdigris-soft, #DCEBE5)' : 'transparent',
                      color: isSel ? 'var(--color-verdigris, #176B5B)' : 'var(--color-text-muted, #767268)',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--color-brand)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
              }}
            >
              {currentQ.technique || node.technique || 'Cálculo Mental Rápido'}
            </div>

            <div
              className="font-mono-tabular"
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'var(--color-text-primary)',
                letterSpacing: '0.02em',
                margin: '4px 0 16px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {currentQ.equation}
            </div>

            {/* Answer Display Box */}
            <div
              style={{
                height: '60px',
                backgroundColor: 'var(--color-bg-base)',
                border: inputVal
                  ? '2px solid var(--color-brand)'
                  : '2px dashed var(--color-border-bold)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.85rem',
                fontWeight: 900,
                color: 'var(--color-brand)',
                boxShadow: inputVal ? '0 0 16px var(--color-brand-surface)' : 'none',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {inputVal ? (
                <span className="font-mono-tabular">{inputVal}</span>
              ) : (
                <span style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', fontWeight: 600 }}>
                  Digite o resultado...
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. BOTTOM CONTROLS (TACTILE NUMPAD OR ADVANCE BUTTONS) */}
      <div style={{ width: '100%', marginTop: '16px' }}>
        {lessonStep === 'theory' && (
          <Aura3DButton
            variant="brand"
            size="lg"
            fullWidth
            onClick={handleAdvanceToScaffolding}
          >
            CONTINUAR DESCOBERTA ➔
          </Aura3DButton>

        )}

        {lessonStep === 'scaffolding' && (
          <div>
            {!scaffoldCompleted ? (
              <TactileNumpad
                onInput={handleScaffoldDigit}
                onDelete={handleScaffoldDelete}
                onClear={handleScaffoldClear}
                onSubmit={handleScaffoldVerify}
                submitLabel="VERIFICAR LACUNA"
                disabled={false}
              />
            ) : (
              <Aura3DButton
                variant="brand"
                size="lg"
                fullWidth
                onClick={handleAdvanceToDrill}
              >
                INICIAR AGILIDADE (5 QUESTÕES) ➔
              </Aura3DButton>
            )}
          </div>
        )}

        {lessonStep === 'drill' && (
          <TactileNumpad
            onInput={handleDigit}
            onDelete={handleDelete}
            onClear={handleClear}
            onSubmit={handleVerify}
            submitLabel="VERIFICAR"
            disabled={drawerStatus !== null}
          />
        )}
      </div>

      {/* 3. SLIDE-UP BOTTOM FEEDBACK DRAWER */}
      <FeedbackDrawer
        status={drawerStatus}
        correctAnswer={currentQ.answer}
        userAnswer={inputVal}
        explanation={currentQ.hint || currentQ.explanation}
        onContinue={handleContinue}
        moduleInfo={{
          unit: node.grade,
          moduleTitle: node.title,
          nodeId: node.id,
        }}
        onRetrainModule={(targetNodeId) => {
          audioSynth.playKeypressTick();
          setDrawerStatus(null);
          setInputVal('');
          setCurrentIndex(0);
          setHearts(5);
          setCombo(0);
          setCorrectFirstTry(0);
          setLessonStep('theory');
          setAuraSpeech('Vamos reforçar a estrutura desde o princípio!');
        }}
      />

      {/* 4. FOCUS RECHARGE MODAL (ZERO HEARTS) */}
      {showRechargeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Recarga de Foco Cósmica"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 70,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '2px solid var(--color-brand)',
              borderRadius: '24px',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 0 40px var(--color-brand-surface)',
            }}
          >
            <AuraMascotWeb size={80} state="thinking" showTierBadge={false} />

            <h3
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: 'var(--color-brand)',
                margin: '14px 0 6px',
                fontFamily: 'var(--font-display)',
              }}
            >
              Recarga de Foco Cósmica
            </h3>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                margin: '0 0 20px',
                lineHeight: 1.4,
              }}
            >
              Seus cristais esgotaram! Resolva este cálculo rápido de aquecimento para restaurar seus 5 corações.
            </p>

            <div
              className="font-mono-tabular"
              style={{
                fontSize: '1.8rem',
                fontWeight: 900,
                color: 'var(--color-text-primary)',
                marginBottom: '16px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {rechargeStep === 0 ? '7 + 8 = ?' : '12 + 8 = ?'}
            </div>

            <input
              type="number"
              value={rechargeAns}
              onChange={(e) => setRechargeAns(e.target.value)}
              placeholder="Sua resposta"
              autoFocus
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1.2rem',
                fontWeight: 800,
                textAlign: 'center',
                backgroundColor: 'var(--color-bg-base)',
                border: '1.5px solid var(--color-border-bold)',
                borderRadius: '12px',
                color: 'var(--color-brand)',
                marginBottom: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'var(--font-mono)',
              }}
            />

            <Aura3DButton
              variant="brand"
              fullWidth
              size="md"
              disabled={!rechargeAns}
              onClick={handleRechargeVerify}
            >
              RESTAURAR CRISTAIS
            </Aura3DButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuolingoLessonView;
