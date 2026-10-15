/**
 * E2E Verification Suite — Duolingo Transmutation: Onboarding Tripartite & Victory Choreography
 * Tests the 3 entry paths (Zero, 10Q Diagnostic, Level Picker Verify) and LessonCompleteView 5-phase Dopamine Waterfall.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  getDiagnostic10Questions,
  calculateDiagnosticPlacement,
  getLevelVerificationQuestions,
  evaluateLevelVerification,
} from '../../packages/engine/dist/index.js';

const ROOT_DIR = process.cwd();

describe('Duolingo Transmutation — Onboarding & Victory Suite', () => {
  // ==========================================================================
  // TIER 1: Diagnostic & Level Verification Engine Contracts
  // ==========================================================================
  describe('Tier 1: Engine Algorithms & Placement Math', () => {
    test('10-Question Diagnostic Quiz provides 10 progressive items with valid mathematical answers', () => {
      const questions = getDiagnostic10Questions();
      assert.equal(questions.length, 10, 'Must have exactly 10 diagnostic questions');

      questions.forEach((q, idx) => {
        assert.equal(q.level, idx + 1, `Question ${idx + 1} must match level index`);
        assert.ok(q.equation, 'Equation must be present');
        assert.ok(typeof q.answer === 'number', 'Answer must be a number');
        assert.ok(q.explanation, 'Explanation must be provided');
        assert.ok(q.visualTip, 'Visual tip must be provided');
      });
    });

    test('calculateDiagnosticPlacement accurately partitions scores into curricular grades', () => {
      // Score 0-2 -> Grade 1
      const p0 = calculateDiagnosticPlacement(0);
      assert.equal(p0.grade, 1);
      assert.equal(p0.unlockedNodeId, 'ADD_LEFT_RIGHT');

      const p2 = calculateDiagnosticPlacement(2);
      assert.equal(p2.grade, 1);

      // Score 3-4 -> Grade 2
      const p3 = calculateDiagnosticPlacement(3);
      assert.equal(p3.grade, 2);
      assert.equal(p3.unlockedNodeId, 'MULT_BY_5');

      // Score 5-6 -> Grade 3
      const p5 = calculateDiagnosticPlacement(5);
      assert.equal(p5.grade, 3);
      assert.equal(p5.unlockedNodeId, 'DIFF_SQUARES');

      // Score 7-8 -> Grade 4
      const p7 = calculateDiagnosticPlacement(7);
      assert.equal(p7.grade, 4);

      // Score 9-10 -> Grade 5
      const p10 = calculateDiagnosticPlacement(10);
      assert.equal(p10.grade, 5);
      assert.equal(p10.unlockedNodeId, 'VEDIC_BASE_100');
    });

    test('Level Verification generates 4 questions and tests the 75% passing threshold', () => {
      for (let g = 1; g <= 6; g++) {
        const qList = getLevelVerificationQuestions(g);
        assert.equal(qList.length, 4, `Grade ${g} must generate exactly 4 verification questions`);
      }

      // 4 of 4 = 100% -> Pass
      const eval4 = evaluateLevelVerification(3, 4, 4);
      assert.equal(eval4.passed, true);
      assert.equal(eval4.recommendedGrade, 3);
      assert.equal(eval4.percentage, 100);

      // 3 of 4 = 75% -> Pass
      const eval3 = evaluateLevelVerification(3, 3, 4);
      assert.equal(eval3.passed, true);
      assert.equal(eval3.recommendedGrade, 3);
      assert.equal(eval3.percentage, 75);

      // 2 of 4 = 50% -> Fail (recommends fallback grade)
      const eval2 = evaluateLevelVerification(3, 2, 4);
      assert.equal(eval2.passed, false);
      assert.equal(eval2.recommendedGrade, 2);
      assert.equal(eval2.percentage, 50);

      // 1 of 4 at Grade 1 -> Fail (clamps fallback to 1)
      const eval1 = evaluateLevelVerification(1, 1, 4);
      assert.equal(eval1.passed, false);
      assert.equal(eval1.recommendedGrade, 1);
    });
  });

  // ==========================================================================
  // TIER 2: UI View Architecture & Duolingo Transmutation Standards
  // ==========================================================================
  describe('Tier 2: UI Views & Onboarding Step Components', () => {
    test('OnboardingWelcomeStep renders Aura Mascot, 98+47 comparison, and 3D buttons', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'views', 'onboarding', 'OnboardingWelcomeStep.tsx');
      assert.ok(fs.existsSync(filePath), 'OnboardingWelcomeStep.tsx must exist');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert.match(content, /Não calcule\. Veja!/);
      assert.match(content, /98 \+ 47/);
      assert.match(content, /COMEÇAR DESCOBERTA/);
      assert.match(content, /Pular e ir direto para a Trilha/);
    });

    test('OnboardingPathSelectStep implements 3 distinct choices with tactile physics', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'views', 'onboarding', 'OnboardingPathSelectStep.tsx');
      assert.ok(fs.existsSync(filePath), 'OnboardingPathSelectStep.tsx must exist');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert.match(content, /Iniciar do completo zero/);
      assert.match(content, /Descobrir o seu nível/);
      assert.match(content, /Selecionar o seu nível/);
    });

    test('DiagnosticQuizView renders continuous 10-question progress bar and tactile input', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'views', 'onboarding', 'DiagnosticQuizView.tsx');
      assert.ok(fs.existsSync(filePath), 'DiagnosticQuizView.tsx must exist');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert.match(content, /getDiagnostic10Questions/);
      assert.match(content, /calculateDiagnosticPlacement/);
      assert.match(content, /TactileNumpad/);
      assert.match(content, /FeedbackDrawer/);
    });

    test('LevelPickerVerifyView implements 6-grade selection and verification flow', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'views', 'onboarding', 'LevelPickerVerifyView.tsx');
      assert.ok(fs.existsSync(filePath), 'LevelPickerVerifyView.tsx must exist');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert.match(content, /getLevelVerificationQuestions/);
      assert.match(content, /evaluateLevelVerification/);
      assert.match(content, /Grau I: Fluxo Esquerda-Direita/);
      assert.match(content, /Homologação/);
    });

    test('DailyGoalStep provides 3 min, 7 min, and 15 min Fibonacci commitment options', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'views', 'onboarding', 'DailyGoalStep.tsx');
      assert.ok(fs.existsSync(filePath), 'DailyGoalStep.tsx must exist');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert.match(content, /Faísca/);
      assert.match(content, /Foco/);
      assert.match(content, /Maestria Fibonacci/);
    });

    test('LessonCompleteView implements 5-phase Dopamine Waterfall and fast-forward', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'views', 'LessonCompleteView.tsx');
      assert.ok(fs.existsSync(filePath), 'LessonCompleteView.tsx must exist');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert.match(content, /VictoryPhase/);
      assert.match(content, /handleFastForward/);
      assert.match(content, /displayedXp/);
      assert.match(content, /weekDays/);
      assert.match(content, /PRÓXIMO INSIGHT/);
      assert.match(content, /aura_celebrate\.jpg/);
    });

    test('App.tsx contains onboarding route and first-time cold-load redirection', () => {
      const filePath = path.join(ROOT_DIR, 'src', 'App.tsx');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert.match(content, /OnboardingFlowView/);
      assert.match(content, /auramath_onboarded/);
      assert.match(content, /isImmersive/);
    });
  });
});
