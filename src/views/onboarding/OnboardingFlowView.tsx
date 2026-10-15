import React, { useState } from 'react';
import { OnboardingWelcomeStep } from './OnboardingWelcomeStep';
import { OnboardingPathSelectStep, OnboardingPath } from './OnboardingPathSelectStep';
import { DiagnosticQuizView } from './DiagnosticQuizView';
import { LevelPickerVerifyView } from './LevelPickerVerifyView';
import { DailyGoalStep, DailyGoalMinutes } from './DailyGoalStep';
import { DiagnosticPlacementResult } from '../../../packages/engine/src/diagnostic';
import { gamificationEngine } from '../../services/gamificationEngine';

export interface OnboardingFlowViewProps {
  onFinish: (targetNodeId?: string) => void;
}

export type OnboardingStep =
  | 'welcome'
  | 'path_select'
  | 'diagnostic'
  | 'picker'
  | 'goal';

export const OnboardingFlowView: React.FC<OnboardingFlowViewProps> = ({ onFinish }) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [targetNodeId, setTargetNodeId] = useState<string>('ADD_LEFT_RIGHT');

  const completeOnboarding = (dailyGoalMinutes?: DailyGoalMinutes) => {
    try {
      localStorage.setItem('auramath_onboarded', 'true');
      if (dailyGoalMinutes) {
        localStorage.setItem('auramath_daily_goal_minutes', dailyGoalMinutes.toString());
      }
      localStorage.setItem('auramath_initial_grade', selectedGrade.toString());
      localStorage.setItem('auramath_initial_node', targetNodeId);
    } catch {}

    onFinish(targetNodeId);
  };

  const handleStart = () => {
    setStep('path_select');
  };

  const handleSkip = () => {
    completeOnboarding(7);
  };

  const handleSelectPath = (path: OnboardingPath) => {
    if (path === 'zero') {
      setSelectedGrade(1);
      setTargetNodeId('ADD_LEFT_RIGHT');
      setStep('goal');
    } else if (path === 'diagnostic') {
      setStep('diagnostic');
    } else if (path === 'picker') {
      setStep('picker');
    }
  };

  const handleDiagnosticComplete = (result: DiagnosticPlacementResult) => {
    setSelectedGrade(result.grade);
    setTargetNodeId(result.unlockedNodeId);
    setStep('goal');
  };

  const handlePickerComplete = (grade: number, nodeId: string) => {
    setSelectedGrade(grade);
    setTargetNodeId(nodeId);
    setStep('goal');
  };

  const handleGoalConfirm = (goalMinutes: DailyGoalMinutes) => {
    completeOnboarding(goalMinutes);
  };

  return (
    <div
      className="onboarding-flow-container"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-base, #F7F4EA)',
        color: 'var(--color-text-primary, #202522)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {step === 'welcome' && (
        <OnboardingWelcomeStep onStart={handleStart} onSkip={handleSkip} />
      )}

      {step === 'path_select' && (
        <OnboardingPathSelectStep
          onSelectPath={handleSelectPath}
          onBack={() => setStep('welcome')}
        />
      )}

      {step === 'diagnostic' && (
        <DiagnosticQuizView
          onComplete={handleDiagnosticComplete}
          onCancel={() => setStep('path_select')}
        />
      )}

      {step === 'picker' && (
        <LevelPickerVerifyView
          onComplete={handlePickerComplete}
          onCancel={() => setStep('path_select')}
        />
      )}

      {step === 'goal' && (
        <DailyGoalStep onConfirm={handleGoalConfirm} />
      )}
    </div>
  );
};

export default OnboardingFlowView;
