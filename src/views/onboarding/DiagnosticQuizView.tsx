import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, HelpCircle } from 'lucide-react';
import {
  getDiagnostic10Questions,
  calculateDiagnosticPlacement,
  DiagnosticPlacementResult,
} from '../../../packages/engine/src/diagnostic';
import { TactileNumpad } from '../../components/tactile/TactileNumpad';
import { FeedbackDrawer } from '../../components/tactile/FeedbackDrawer';
import { AuraMascotWeb, AuraMascotStage } from '../../components/AuraMascotWeb';
import { Aura3DButton } from '../../components/tactile/Aura3DButton';
import { audioSynth } from '../../services/audioSynth';

export interface DiagnosticQuizViewProps {
  onComplete: (result: DiagnosticPlacementResult) => void;
  onCancel: () => void;
}

export const DiagnosticQuizView: React.FC<DiagnosticQuizViewProps> = ({
  onComplete,
  onCancel,
}) => {
  const [questions] = useState(getDiagnostic10Questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [drawerStatus, setDrawerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [placementResult, setPlacementResult] = useState<DiagnosticPlacementResult | null>(null);

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + (drawerStatus ? 1 : 0)) / questions.length) * 100);

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

  const handleVerify = () => {
    if (!inputVal) return;
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

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Diagnostic complete
      const finalScore = correctCount + (drawerStatus === 'correct' ? 0 : 0); // already updated
      const result = calculateDiagnosticPlacement(correctCount);
      setPlacementResult(result);
      setIsFinished(true);
    }
  };

  if (isFinished && placementResult) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '100%',
          padding: '28px 20px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '380px', width: '100%', marginTop: '16px' }}>
          <AuraMascotWeb
            size={130}
            state="happy"
            stage={Math.min(5, Math.max(1, placementResult.grade)) as AuraMascotStage}
            speechText="Diagnóstico Concluído!"
            showTierBadge={false}
          />

          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: 'var(--color-brand, #176B5B)',
              margin: '18px 0 6px',
              fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
              letterSpacing: '-0.02em',
            }}
          >
            {placementResult.headline}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-text-secondary, #5C645F)', textTransform: 'uppercase' }}>
                Posicionamento Recomendado
              </span>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: 'var(--color-verdigris, #176B5B)',
                  backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {placementResult.score} / 10 Acertos
              </span>
            </div>

            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                color: 'var(--color-text-primary, #202522)',
                fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
                marginBottom: '6px',
              }}
            >
              {placementResult.gradeTitle}
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary, #5C645F)', margin: 0, lineHeight: 1.4 }}>
              {placementResult.feedback}
            </p>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '380px' }}>
          <Aura3DButton
            variant="brand"
            size="lg"
            fullWidth
            onClick={() => {
              audioSynth.playKeypressTick();
              onComplete(placementResult);
            }}
          >
            DEFINIR META & AVANÇAR ➔
          </Aura3DButton>
        </div>
      </div>
    );
  }

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
      {/* Top Header: Progress Bar & Exit */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
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
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Cancelar teste"
          >
            <ArrowLeft size={20} />
          </button>

          <span
            className="font-mono-tabular"
            style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-secondary, #5C645F)' }}
          >
            {currentIndex + 1} de {questions.length}
          </span>
        </div>

        {/* Progress Bar with 0ms transition */}
        <div
          style={{
            height: '8px',
            backgroundColor: 'var(--color-border-subtle, #D9D5C8)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: 'var(--color-verdigris, #176B5B)',
              borderRadius: '999px',
              transition: 'width 0.2s ease',
            }}
          />
        </div>
      </div>

      {/* Center Question Area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          margin: 'auto 0',
        }}
      >
        <span
          style={{
            fontSize: '0.74rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-text-secondary, #5C645F)',
            backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
            padding: '4px 12px',
            borderRadius: '999px',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
            marginBottom: '12px',
          }}
        >
          {currentQ.levelName}
        </span>

        <p
          style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--color-text-secondary, #5C645F)',
            margin: '0 0 16px',
          }}
        >
          {currentQ.prompt || 'Resolva mentalmente sem armar conta:'}
        </p>

        {/* Target Equation Display */}
        <div
          className="font-mono-tabular"
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: 'var(--color-text-primary, #202522)',
            fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
            marginBottom: '18px',
            letterSpacing: '-0.02em',
          }}
        >
          {currentQ.equation}
        </div>

        {/* User Input Slot */}
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
          {inputVal || (
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted, #767268)', fontWeight: 600 }}>
              Sua resposta
            </span>
          )}
        </div>
      </div>

      {/* Bottom Tactile Numpad */}
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

      {/* Slide-Up Feedback Drawer */}
      <FeedbackDrawer
        status={drawerStatus}
        correctAnswer={currentQ.answer}
        userAnswer={inputVal}
        explanation={currentQ.explanation || currentQ.visualTip}
        onContinue={handleContinue}
      />
    </div>
  );
};
