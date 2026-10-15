import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  getLevelVerificationQuestions,
  evaluateLevelVerification,
  LevelVerificationResult,
} from '../../../packages/engine/src/diagnostic';
import { TactileNumpad } from '../../components/tactile/TactileNumpad';
import { FeedbackDrawer } from '../../components/tactile/FeedbackDrawer';
import { AuraMascotWeb, AuraMascotStage } from '../../components/AuraMascotWeb';
import { Aura3DButton } from '../../components/tactile/Aura3DButton';
import { audioSynth } from '../../services/audioSynth';

export interface LevelPickerVerifyViewProps {
  onComplete: (grade: number, nodeId: string) => void;
  onCancel: () => void;
}

const GRADES_INFO = [
  { grade: 1, title: 'Grau I: Fluxo Esquerda-Direita', desc: 'Decomposição posicional e soma sem vai-um', nodeId: 'ADD_LEFT_RIGHT' },
  { grade: 2, title: 'Grau II: Fatores Notáveis', desc: 'Multiplicações ágeis por 5, 25, 11 e 99', nodeId: 'MULT_BY_5' },
  { grade: 3, title: 'Grau III: Geometria & Produtos Notáveis', desc: 'Diferença de quadrados e simetria', nodeId: 'DIFF_SQUARES' },
  { grade: 4, title: 'Grau IV: Olho de Fermi & Estimativa', desc: 'Ordens de grandeza e cálculo aproximado', nodeId: 'FERMI_MAGNITUDE' },
  { grade: 5, title: 'Grau V: Sistemas Formais Históricos', desc: 'Trachtenberg e Matemática Védica', nodeId: 'VEDIC_BASE_100' },
  { grade: 6, title: 'Grau VI: Transcendência & Flash Anzan', desc: 'Cálculo mental relâmpago de alta velocidade', nodeId: 'FLASH_ANZAN' },
];

export const LevelPickerVerifyView: React.FC<LevelPickerVerifyViewProps> = ({
  onComplete,
  onCancel,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [verificationQuestions, setVerificationQuestions] = useState<ReturnType<typeof getLevelVerificationQuestions>>([]);
  const [qIndex, setQIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [drawerStatus, setDrawerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [verificationResult, setVerificationResult] = useState<LevelVerificationResult | null>(null);

  const handleSelectGrade = (grade: number) => {
    audioSynth.playKeypressTick();
    const questions = getLevelVerificationQuestions(grade);
    setSelectedGrade(grade);
    setVerificationQuestions(questions);
    setQIndex(0);
    setInputVal('');
    setCorrectCount(0);
    setDrawerStatus(null);
    setVerificationResult(null);
  };

  const handleDigit = (digit: string) => {
    audioSynth.playKeypressTick();
    if (inputVal.length < 6) {
      setInputVal((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    audioSynth.playKeypressTick();
    setInputVal((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    audioSynth.playKeypressTick();
    setInputVal('');
  };

  const currentQ = verificationQuestions[qIndex];

  const handleVerify = () => {
    if (!inputVal || !currentQ) return;
    const userNum = parseInt(inputVal, 10);
    const isCorrect = userNum === currentQ.answer;

    if (isCorrect) {
      audioSynth.playVictoryFanfare();
      setCorrectCount((c) => c + 1);
      setDrawerStatus('correct');
    } else {
      audioSynth.playErrorSoftRelease();
      setDrawerStatus('incorrect');
    }
  };

  const handleContinue = () => {
    audioSynth.playKeypressTick();
    setDrawerStatus(null);
    setInputVal('');

    if (qIndex + 1 < verificationQuestions.length) {
      setQIndex((i) => i + 1);
    } else {
      // Evaluation
      if (selectedGrade !== null) {
        const result = evaluateLevelVerification(selectedGrade, correctCount);
        setVerificationResult(result);
      }
    }
  };

  // State 1: Picker of Grades (if none selected yet)
  if (selectedGrade === null) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '100%',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => {
                audioSynth.playKeypressTick();
                onCancel();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary, #5C645F)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <ArrowLeft size={16} />
              <span>Voltar</span>
            </button>
          </div>

          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              color: 'var(--color-text-primary, #202522)',
              margin: '0 0 6px',
              fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
            }}
          >
            Selecione o seu Grau Alvo
          </h2>
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--color-text-secondary, #5C645F)',
              margin: '0 0 16px',
            }}
          >
            Após escolher, você resolverá 4 questões rápidas daquele Grau para homologar sua maestria:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {GRADES_INFO.map((g) => (
              <button
                key={g.grade}
                type="button"
                onClick={() => handleSelectGrade(g.grade)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
                  border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                  borderRadius: '12px',
                  boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
                  padding: '12px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-text-primary, #202522)' }}>
                    {g.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary, #5C645F)' }}>
                    {g.desc}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: 'var(--color-verdigris, #176B5B)',
                    backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    flexShrink: 0,
                  }}
                >
                  Testar ➔
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: '16px' }} />
      </div>
    );
  }

  // State 2: Verification Result (Pass or Fallback recommendation)
  if (verificationResult) {
    const isSuccess = verificationResult.passed;
    const finalGradeInfo = GRADES_INFO.find((g) => g.grade === verificationResult.recommendedGrade) || GRADES_INFO[0];

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '100%',
          padding: '24px 20px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '380px', width: '100%', marginTop: '20px' }}>
          <AuraMascotWeb
            size={130}
            state={isSuccess ? 'happy' : 'thinking'}
            stage={Math.min(5, Math.max(1, verificationResult.recommendedGrade)) as AuraMascotStage}
            speechText={isSuccess ? 'Maestria Aprovada!' : 'Vamos reforçar!'}
            showTierBadge={false}
          />

          <h2
            style={{
              fontSize: '1.45rem',
              fontWeight: 900,
              color: isSuccess ? 'var(--color-brand, #176B5B)' : 'var(--color-marigold-bevel, #D49A2E)',
              margin: '18px 0 6px',
              fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
            }}
          >
            {verificationResult.headline}
          </h2>

          <div
            style={{
              backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
              border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
              borderRadius: '16px',
              boxShadow: '0 3px 0 var(--color-border-bold, #C2BDAE)',
              padding: '16px',
              margin: '16px 0',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-text-secondary, #5C645F)', textTransform: 'uppercase' }}>
                Resultado da Homologação
              </span>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: isSuccess ? 'var(--color-verdigris, #176B5B)' : 'var(--color-coral, #E76F61)',
                  backgroundColor: isSuccess ? 'var(--color-verdigris-soft, #DCEBE5)' : 'var(--color-coral-soft, #F8DED9)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {verificationResult.score} / {verificationResult.total} Acertos ({verificationResult.percentage}%)
              </span>
            </div>

            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 900,
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                marginBottom: '6px',
              }}
            >
              Grau Liberado: {finalGradeInfo.title}
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary, #5C645F)', margin: 0, lineHeight: 1.4 }}>
              {verificationResult.feedback}
            </p>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Aura3DButton
            variant="brand"
            size="lg"
            fullWidth
            onClick={() => {
              audioSynth.playKeypressTick();
              onComplete(finalGradeInfo.grade, finalGradeInfo.nodeId);
            }}
          >
            DEFINIR META & AVANÇAR ➔
          </Aura3DButton>

          {!isSuccess && (
            <button
              type="button"
              onClick={() => {
                audioSynth.playKeypressTick();
                setSelectedGrade(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary, #5C645F)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '6px',
                textDecoration: 'underline',
              }}
            >
              Escolher outro Grau para testar
            </button>
          )}
        </div>
      </div>
    );
  }

  // State 3: Quiz in Progress (4 questions)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100%',
        padding: '16px 20px',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <button
            type="button"
            onClick={() => {
              audioSynth.playKeypressTick();
              setSelectedGrade(null);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary, #5C645F)', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} />
          </button>

          <span className="font-mono-tabular" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-secondary, #5C645F)' }}>
            Homologação: {qIndex + 1} de {verificationQuestions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '8px', backgroundColor: 'var(--color-border-subtle, #D9D5C8)', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.round(((qIndex + (drawerStatus ? 1 : 0)) / verificationQuestions.length) * 100)}%`,
              height: '100%',
              backgroundColor: 'var(--color-verdigris, #176B5B)',
              borderRadius: '999px',
              transition: 'width 0.2s ease',
            }}
          />
        </div>
      </div>

      {currentQ && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', margin: 'auto 0' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary, #5C645F)',
              backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
              padding: '3px 10px',
              borderRadius: '999px',
              border: '1px solid var(--color-border-subtle, #D9D5C8)',
              marginBottom: '10px',
            }}
          >
            Teste de Grau {selectedGrade}
          </span>

          <div
            className="font-mono-tabular"
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: 'var(--color-text-primary, #202522)',
              fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
              marginBottom: '16px',
            }}
          >
            {currentQ.equation}
          </div>

          <div
            style={{
              width: '180px',
              height: '52px',
              backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
              border: '2px solid var(--color-border-bold, #C2BDAE)',
              borderRadius: '14px',
              boxShadow: '0 3px 0 var(--color-border-bold, #C2BDAE)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 900,
              color: 'var(--color-verdigris, #176B5B)',
              fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
            }}
          >
            {inputVal || <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted, #767268)' }}>Resposta</span>}
          </div>
        </div>
      )}

      <div style={{ width: '100%', marginTop: '16px' }}>
        <TactileNumpad
          onInput={handleDigit}
          onDelete={handleDelete}
          onClear={handleClear}
          onSubmit={handleVerify}
          submitLabel="VERIFICAR"
          disabled={drawerStatus !== null}
        />
      </div>

      {currentQ && (
        <FeedbackDrawer
          status={drawerStatus}
          correctAnswer={currentQ.answer}
          userAnswer={inputVal}
          explanation={currentQ.explanation || currentQ.hint}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};
