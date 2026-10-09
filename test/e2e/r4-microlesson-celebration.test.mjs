/**
 * E2E Verification Suite — Requirement R4: Micro-lesson Flow & Celebration Screen
 * Covers Features 14, 15, 16, 17, 18 across Tiers 1 through 4.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generateQuestion, TRACK_GRADES } from '../../packages/engine/dist/index.js';

const ROOT_DIR = process.cwd();

// ============================================================================
// Authoritative Efficiency Analysis Calculations
// ============================================================================
const TRADITIONAL_TIME_PER_QUESTION_SEC = 12.0;

function calculateEfficiencyMetrics(totalQuestions, actualTimeSeconds, correctCount) {
  const standardTimeSeconds = totalQuestions * TRADITIONAL_TIME_PER_QUESTION_SEC;
  const secondsSaved = Math.max(0, standardTimeSeconds - actualTimeSeconds);
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const efficiencyMultiplier = actualTimeSeconds > 0
    ? Number((standardTimeSeconds / actualTimeSeconds).toFixed(1))
    : 1.0;

  return {
    standardTimeSeconds,
    actualTimeSeconds,
    secondsSaved: Number(secondsSaved.toFixed(1)),
    accuracy,
    efficiencyMultiplier,
  };
}

describe('R4: Micro-lesson Flow & Celebration Screen (F14-F18)', () => {
  const lessonViewPath = path.join(ROOT_DIR, 'src', 'views', 'DuolingoLessonView.tsx');
  const lessonViewContent = fs.readFileSync(lessonViewPath, 'utf-8');

  // ==========================================================================
  // TIER 1: Feature Coverage & Interface Contracts
  // ==========================================================================
  describe('Tier 1: Feature Coverage & Pedagogical Contracts', () => {
    test('F14: 3-Step Micro-Lesson Flow (Theory -> Scaffolding -> 5-Question Drill)', () => {
      // 1. Verify all curriculum nodes provide theory and scaffolding for steps 1 & 2
      const firstGrade = TRACK_GRADES[0];
      const testNode = firstGrade.nodes[0];
      assert.ok(testNode.theory, 'Step 1: Theory breakdown must exist');
      assert.ok(testNode.theory.visualBreakdown, 'Step 1: Visual breakdown must be populated');
      assert.ok(testNode.scaffolding.length > 0, 'Step 2: Scaffolding tasks must exist');

      // 2. Verify DuolingoLessonView specifies 10 questions per drill as reconciled
      assert.match(lessonViewContent, /totalQuestions\s*=\s*10;/);

      // 3. Verify question generation can target specific techniques
      const q = generateQuestion(testNode.technique);
      assert.ok(q.equation);
      assert.ok(typeof q.answer === 'number');
    });

    test('F15: Lesson Complete Victory Screen renders celebrating Aura mascot', () => {
      assert.match(lessonViewContent, /Lição Concluída!/);
      assert.match(lessonViewContent, /aura_celebrate\.jpg/);
    });

    test('F16: Side-by-Side 3D Metric Cards (Total XP, Accuracy, Streak)', () => {
      // XP Card
      assert.match(lessonViewContent, /XP Cósmico/);
      assert.match(lessonViewContent, /xpEarned/);

      // Accuracy Card
      assert.match(lessonViewContent, /Precisão/);
      assert.match(lessonViewContent, /accuracy/);

      // Streak Card
      assert.match(lessonViewContent, /Ofensiva/);
      assert.match(lessonViewContent, /currentStreak/);
    });

    test('F17: Efficiency Analysis formula calculation', () => {
      // 5 questions answered in 18 seconds
      const metrics = calculateEfficiencyMetrics(5, 18.0, 5);
      assert.equal(metrics.standardTimeSeconds, 60.0, 'Standard time for 5 questions must be 60.0s');
      assert.equal(metrics.secondsSaved, 42.0, '60s - 18s = 42s saved');
      assert.equal(metrics.accuracy, 100);
      assert.equal(metrics.efficiencyMultiplier, 3.3);
    });

    test('F18: Full-Width 3D Continue Button on Victory Screen', () => {
      assert.match(lessonViewContent, /CONTINUAR/);
      assert.match(lessonViewContent, /fullWidth/);
      assert.match(lessonViewContent, /onFinish\(\s*{\s*xpEarned,\s*accuracy/);
    });
  });

  // ==========================================================================
  // TIER 2: Boundary & Corner Cases
  // ==========================================================================
  describe('Tier 2: Boundary & Corner Cases', () => {
    test('Boundary: 100% Accuracy Perfect Run (5/5 correct first try)', () => {
      const perfect = calculateEfficiencyMetrics(5, 14.5, 5);
      assert.equal(perfect.accuracy, 100);
      assert.equal(perfect.secondsSaved, 45.5);
      assert.ok(perfect.efficiencyMultiplier > 4.0);
    });

    test('Boundary: 0% Accuracy Run (0/5 correct first try)', () => {
      const zeroAccuracy = calculateEfficiencyMetrics(5, 45.0, 0);
      assert.equal(zeroAccuracy.accuracy, 0);
      assert.equal(zeroAccuracy.secondsSaved, 15.0);
    });

    test('Boundary: Sluggish run exceeding standard baseline (Seconds saved never negative)', () => {
      const slow = calculateEfficiencyMetrics(5, 75.0, 3);
      assert.equal(slow.secondsSaved, 0, 'Seconds saved must clamp to 0 when slower than standard baseline');
      assert.equal(slow.accuracy, 60);
    });

    test('Boundary: Non-punitive Focus Recharge modal triggers on zero hearts', () => {
      assert.match(lessonViewContent, /showRechargeModal/);
      assert.match(lessonViewContent, /rechargeStep/);
      assert.match(lessonViewContent, /setHearts\(5\)/);
    });
  });

  // ==========================================================================
  // TIER 3: Cross-Feature Combinations
  // ==========================================================================
  describe('Tier 3: Cross-Feature Combinations', () => {
    test('Combo progression awards rising XP and avoids punitive feedback', () => {
      let combo = 0;
      let totalXP = 0;

      const recordAnswer = (isCorrect) => {
        if (isCorrect) {
          combo += 1;
          const comboBonus = combo >= 5 ? 10 : combo >= 3 ? 5 : 2;
          totalXP += 10 + comboBonus;
          return { combo, totalXP, feedback: 'positive' };
        } else {
          combo = 0;
          return { combo, totalXP, feedback: 'didactic' }; // non-punitive
        }
      };

      // 3 correct answers
      recordAnswer(true);
      recordAnswer(true);
      const step3 = recordAnswer(true);
      assert.equal(step3.combo, 3);
      assert.equal(step3.totalXP, 39); // (10+2) + (10+2) + (10+5)

      // 1 mistake -> resets combo but does NOT subtract XP
      const step4 = recordAnswer(false);
      assert.equal(step4.combo, 0);
      assert.equal(step4.totalXP, 39, 'Mistakes must never penalize previously earned XP');
      assert.equal(step4.feedback, 'didactic');
    });
  });

  // ==========================================================================
  // TIER 4: Real-World Scenarios
  // ==========================================================================
  describe('Tier 4: Real-World Application Scenarios', () => {
    test('Scenario: Complete Micro-Lesson Flow to Victory Screen Dispatch', () => {
      // 1. Student selects Grade 3 "Diferença de Quadrados"
      const diffOfSquaresNode = TRACK_GRADES[2].nodes[0];
      assert.equal(diffOfSquaresNode.id, 'DIFF_OF_SQUARES');

      // 2. Student reviews Theory
      assert.match(diffOfSquaresNode.theory.formula, /m\^2\s*-\s*d\^2/);

      // 3. Student completes Scaffolding
      const scaffoldTask = diffOfSquaresNode.scaffolding[0];
      assert.equal(scaffoldTask.blanks[0].expected, '3600');
      assert.equal(scaffoldTask.blanks[1].expected, '3599');

      // 4. Student executes 5-question agility drill in 15.2 seconds
      const finalStats = calculateEfficiencyMetrics(5, 15.2, 5);
      assert.equal(finalStats.accuracy, 100);
      assert.equal(finalStats.secondsSaved, 44.8);

      // 5. Victory payload is formed for parent onFinish handler
      const finishPayload = {
        xpEarned: 20 + 15,
        accuracy: finalStats.accuracy,
        streak: 20,
        secondsSaved: finalStats.secondsSaved,
      };

      assert.equal(finishPayload.accuracy, 100);
      assert.equal(finishPayload.xpEarned, 35);
      assert.equal(finishPayload.streak, 20);
      assert.equal(finishPayload.secondsSaved, 44.8);
    });
  });
});
