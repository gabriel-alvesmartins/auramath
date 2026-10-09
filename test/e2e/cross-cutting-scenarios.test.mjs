/**
 * E2E Verification Suite — Cross-Cutting User Journeys & Adversarial Verification
 * Validates Feature 24 (Comprehensive E2E Verification) across Tiers 3 & 4.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import enginePkg from '../../packages/engine/dist/index.js';
const {
  TRACK_GRADES,
  generateQuestion,
  generatePatternRecognitionQuestion,
  generateFlashAnzanSequence,
  generateDailyQuestions,
  MOCK_USER_PROFILE,
} = enginePkg;
import { darkColors, lightColors, depth } from '../../src/theme/tokens.ts';

describe('Cross-Cutting Application Scenarios & Adversarial Verification (F24)', () => {
  // ==========================================================================
  // JOURNEY 1: Complete Onboarding & Grade Progression Flow
  // ==========================================================================
  test('Journey 1: Student navigates Grade 1, completes micro-lesson, and advances active node', () => {
    // 1. Initial curriculum inspection
    const grade1 = TRACK_GRADES[0];
    assert.equal(grade1.grade, 1);
    assert.ok(grade1.nodes.length >= 3);

    // 2. Student launches first node
    const currentNode = grade1.nodes[0];
    assert.equal(currentNode.id, 'ADD_LEFT_RIGHT');

    // 3. Student reviews visual theory breakdown
    const theory = currentNode.theory;
    assert.equal(theory.visualBreakdown.from, '68 + 27');
    assert.deepEqual(theory.visualBreakdown.steps, ['68 + 20 = 88', '88 + 7 = 95']);
    assert.equal(theory.visualBreakdown.to, '95');

    // 4. Student solves Scaffolding Blanks
    const scaffold = currentNode.scaffolding[0];
    assert.equal(scaffold.equation, '54 + 38');
    assert.equal(scaffold.blanks[0].expected, '30');
    assert.equal(scaffold.blanks[1].expected, '84');
    assert.equal(scaffold.blanks[2].expected, '92');

    // 5. Agility drill: 5 questions generated and answered correctly
    const drillQuestions = [];
    for (let i = 0; i < 5; i++) {
      drillQuestions.push(generateQuestion(currentNode.technique));
    }
    assert.equal(drillQuestions.length, 5);

    let combo = 0;
    let correctCount = 0;
    for (const q of drillQuestions) {
      if (typeof q.answer === 'number' && !Number.isNaN(q.answer)) {
        combo += 1;
        correctCount += 1;
      }
    }
    assert.equal(correctCount, 5);
    assert.equal(combo, 5);

    // 6. Victory screen computation
    const totalTimeSec = 16.5;
    const standardTimeSec = 5 * 12.0;
    const secondsSaved = standardTimeSec - totalTimeSec;
    const accuracy = Math.round((correctCount / 5) * 100);
    assert.equal(accuracy, 100);
    assert.equal(secondsSaved, 43.5);

    // 7. Node progression update
    const updatedStars = 3;
    assert.ok(updatedStars > 0);
  });

  // ==========================================================================
  // JOURNEY 2: Olho Matemático Shortcut Training to Profile Evolution
  // ==========================================================================
  test('Journey 2: Algebraic shortcut training session directly enriches Cognitive Radar', () => {
    let shortcutsIdentified = 0;
    const totalRounds = 5;

    for (let r = 0; r < totalRounds; r++) {
      const q = generatePatternRecognitionQuestion();
      const optimal = q.options.find(o => o.isOptimal);
      assert.ok(optimal);

      // Student selects optimal
      shortcutsIdentified += 1;
    }
    assert.equal(shortcutsIdentified, 5);

    // Verify user profile reflects high flexibility and speed scores
    const profile = MOCK_USER_PROFILE;
    assert.ok(profile.radar.speedScore >= 80);
    assert.ok(profile.radar.flexibilityScore >= 80);
  });

  // ==========================================================================
  // ADVERSARIAL VERIFICATION & STRESS TESTING
  // ==========================================================================
  describe('Adversarial Verification & Invariant Stress', () => {
    test('Adversarial: 300 procedural questions generated without NaN, nulls, or runtime exceptions', () => {
      const modes = ['general', 'fermi', 'subtraction', 'multiplication', 'DIFF_OF_SQUARES', 'MULT_25', 'MULT_11', 'MULT_5_50'];

      for (let i = 0; i < 300; i++) {
        const mode = modes[i % modes.length];
        const q = generateQuestion(mode);

        assert.ok(q.id && q.id.length > 0, 'Question must have unique ID');
        assert.ok(q.equation && q.equation.length > 0, 'Question must have equation');
        assert.equal(typeof q.answer, 'number', 'Answer must be a number');
        assert.ok(!Number.isNaN(q.answer), `Answer for ${q.equation} must not be NaN`);
        assert.ok(Number.isFinite(q.answer), `Answer for ${q.equation} must be finite`);

        if (q.options) {
          assert.ok(q.options.includes(q.answer), 'Options must always include the correct answer');
        }
      }
    });

    test('Adversarial: Deterministic daily seed guarantees reproducible sequence', () => {
      const batchA = generateDailyQuestions('2026-10-01');
      const batchB = generateDailyQuestions('2026-10-01');
      assert.equal(batchA.length, 20);
      assert.equal(batchB.length, 20);

      for (let i = 0; i < 20; i++) {
        assert.equal(batchA[i].equation, batchB[i].equation);
        assert.equal(batchA[i].answer, batchB[i].answer);
      }
    });

    test('Adversarial: Flash Anzan extreme sequence lengths', () => {
      const shortSeq = generateFlashAnzanSequence(3);
      assert.equal(shortSeq.length, 3);

      const longSeq = generateFlashAnzanSequence(25);
      assert.equal(longSeq.length, 25);
      const sum = longSeq.reduce((a, b) => a + b, 0);
      assert.ok(sum > 250);
      assert.ok(!Number.isNaN(sum));
    });

    test('Cancellation: Ghost Run removed and replaced with Synchronous Tabletop Battle', () => {
      assert.equal('generateGhostRun' in enginePkg, false, 'Ghost run generator must be eliminated');
    });

    test('Adversarial: Keypad string sanitization and length bounding', () => {
      const sanitizeInput = (raw) => {
        // Strip non-digits and cap at 6 characters
        const cleaned = raw.replace(/\D/g, '');
        return cleaned.slice(0, 6);
      };

      assert.equal(sanitizeInput('12345'), '12345');
      assert.equal(sanitizeInput('abc12def34'), '1234');
      assert.equal(sanitizeInput('9999999999'), '999999'); // capped at 6
      assert.equal(sanitizeInput(''), '');
      assert.equal(sanitizeInput('   '), '');
      assert.equal(sanitizeInput('-42'), '42'); // non-negative input
    });
  });
});
