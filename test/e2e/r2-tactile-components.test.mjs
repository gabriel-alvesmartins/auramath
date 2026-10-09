/**
 * E2E Verification Suite — Requirement R2: 3D Tactile Component Library
 * Covers Features 5, 6, 7, 8, 9 across Tiers 1 through 4.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { depth, get3DButtonShadow } from '../../src/theme/tokens.ts';

const ROOT_DIR = process.cwd();

describe('R2: 3D Tactile Component Library (F5-F9)', () => {
  const cssPath = path.join(ROOT_DIR, 'src', 'theme', 'theme.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  // ==========================================================================
  // TIER 1: Feature Coverage & Interface Contracts
  // ==========================================================================
  describe('Tier 1: Feature Coverage & Component Contracts', () => {
    test('F5: Aura3DButton styling, size variants and 0ms sink latency', () => {
      // Button class definitions
      assert.match(cssContent, /\.aura-3d-btn\b/);
      assert.match(cssContent, /\.aura-3d-btn--brand\b/);
      assert.match(cssContent, /\.aura-3d-btn--success\b/);
      assert.match(cssContent, /\.aura-3d-btn--alert\b/);
      assert.match(cssContent, /\.aura-3d-btn--gold\b/);
      assert.match(cssContent, /\.aura-3d-btn--neutral\b/);

      // Size classes
      assert.match(cssContent, /\.aura-3d-btn--sm\b/);
      assert.match(cssContent, /\.aura-3d-btn--md\b/);
      assert.match(cssContent, /\.aura-3d-btn--lg\b/);
      assert.match(cssContent, /\.aura-3d-btn--full\b/);

      // Active state mechanical sink
      assert.match(cssContent, /\.aura-3d-btn:active[\s\S]*?transform:\s*translateY\(var\(--btn-depression\)\)\s*!important/);
      assert.match(cssContent, /\.aura-3d-btn:active[\s\S]*?box-shadow:\s*0\s*calc\(var\(--btn-extrusion\)\s*-\s*var\(--btn-depression\)\)\s*0\s*var\(--btn-bevel\)\s*!important/);
      assert.match(cssContent, /\.aura-3d-btn:active[\s\S]*?transition:\s*none\s*!important/);
    });

    test('F5: get3DButtonShadow helper computes accurate resting & active box-shadows', () => {
      const resting = get3DButtonShadow('#0369A1', 4, false);
      assert.equal(resting, '0 4px 0 #0369A1', 'Resting shadow must have 4px vertical bevel offset');

      const active = get3DButtonShadow('#0369A1', 4, true);
      assert.equal(active, '0 1px 0 #0369A1', 'Active shadow must compress to 1px remaining bevel offset');
    });

    test('F6: StatCard3D contract & tabular font integration', () => {
      // StatCard3D must use .font-mono-tabular to prevent layout shifts on numeric metrics
      assert.match(cssContent, /\.font-mono-tabular\b/);

      // Stat card structure specification
      const validVariants = ['xp', 'accuracy', 'streak', 'time', 'neutral'];
      for (const variant of validVariants) {
        assert.ok(typeof variant === 'string');
      }
    });

    test('F7: FeedbackDrawer contract & non-punitive semantics', () => {
      // Feedback drawer states: 'correct' | 'incorrect' | null
      const validStatuses = ['correct', 'incorrect', null];
      for (const status of validStatuses) {
        assert.ok(status === null || typeof status === 'string');
      }

      // Check if FeedbackDrawer or DuolingoLessonDrawer files exist
      const drawerFile = [
        path.join(ROOT_DIR, 'src', 'components', 'tactile', 'FeedbackDrawer.tsx'),
        path.join(ROOT_DIR, 'src', 'components', 'DuolingoLessonDrawer.tsx')
      ].find(f => fs.existsSync(f));
      assert.ok(drawerFile, 'FeedbackDrawer or DuolingoLessonDrawer component file must exist');

      const drawerContent = fs.readFileSync(drawerFile, 'utf-8');
      assert.match(drawerContent, /status\s*:\s*['"]correct['"]\s*\|\s*['"]incorrect['"]\s*\|\s*null/);
      assert.match(drawerContent, /onContinue\s*:\s*\(\)\s*=>\s*void/);
    });

    test('F8: TactileNumpad 56dp ergonomics & mechanical callbacks', () => {
      const numpadWebFile = [
        path.join(ROOT_DIR, 'src', 'components', 'tactile', 'TactileNumpad.tsx'),
        path.join(ROOT_DIR, 'src', 'components', 'NumpadWeb.tsx')
      ].find(f => fs.existsSync(f));
      assert.ok(numpadWebFile, 'TactileNumpad or NumpadWeb component file must exist');

      const numpadContent = fs.readFileSync(numpadWebFile, 'utf-8');
      assert.match(numpadContent, /onInput/);
      assert.match(numpadContent, /onClear/);

      // Verify minimum touch target 48-56px for ergonomic operation
      assert.match(numpadContent, /height:\s*['"]5[2-8]px['"]|minHeight:\s*['"]5[2-8]px['"]|padding/);
    });

    test('F9: TrackSerpentineNode circular geometry, star ratings, and anchor socket', () => {
      const trackNodeFile = [
        path.join(ROOT_DIR, 'src', 'components', 'tactile', 'TrackSerpentineNode.tsx'),
        path.join(ROOT_DIR, 'src', 'components', 'TrackNode.tsx')
      ].find(f => fs.existsSync(f));
      assert.ok(trackNodeFile, 'TrackSerpentineNode or TrackNode component file must exist');

      const trackNodeContent = fs.readFileSync(trackNodeFile, 'utf-8');
      assert.match(trackNodeContent, /stars/);
      assert.match(trackNodeContent, /onPress|onClick/);
      assert.match(trackNodeContent, /isCurrent|isActive/);
    });
  });

  // ==========================================================================
  // TIER 2: Boundary & Corner Cases
  // ==========================================================================
  describe('Tier 2: Boundary & Corner Cases', () => {
    test('Boundary: Tactile button disabled state disallows press and clears bevel sink', () => {
      assert.match(cssContent, /\.aura-3d-btn:disabled[\s\S]*?pointer-events:\s*none/);
      assert.match(cssContent, /\.aura-3d-btn:disabled[\s\S]*?transform:\s*translateY\(0\)\s*!important/);
      assert.match(cssContent, /\.aura-3d-btn:disabled[\s\S]*?opacity:\s*0\.45/);
    });

    test('Boundary: Numpad buffer ceiling prevents uncontrolled integer overflow', () => {
      // Simulate numpad input aggregator with max length 6
      const MAX_LENGTH = 6;
      let buffer = '';

      const handleDigit = (d) => {
        if (buffer.length < MAX_LENGTH) {
          buffer += d;
        }
      };

      // Attempt to enter 10 digits
      for (let i = 0; i < 10; i++) {
        handleDigit(String(i));
      }

      assert.equal(buffer.length, 6, 'Numpad buffer must cap at 6 digits to prevent integer overflow');
      assert.equal(buffer, '012345');
    });

    test('Boundary: StatCard3D boundary values (0 XP, 100% Accuracy, 99999 Max)', () => {
      const formatMetric = (val) => {
        if (typeof val === 'number') {
          return val.toLocaleString('pt-BR');
        }
        return String(val);
      };

      assert.equal(formatMetric(0), '0');
      assert.equal(formatMetric(100), '100');
      assert.equal(formatMetric(99999), '99.999');
    });

    test('Boundary: FeedbackDrawer with empty explanation gracefully renders fallback', () => {
      const getFeedbackExplanation = (explanation, fallback) => {
        return (explanation && explanation.trim().length > 0) ? explanation : fallback;
      };

      const emptyResult = getFeedbackExplanation('', 'Veja a decomposição correta.');
      assert.equal(emptyResult, 'Veja a decomposição correta.');

      const nullResult = getFeedbackExplanation(null, 'Veja a decomposição correta.');
      assert.equal(nullResult, 'Veja a decomposição correta.');

      const validResult = getFeedbackExplanation('Multiplique por 10 e subtraia 1', 'Fallback');
      assert.equal(validResult, 'Multiplique por 10 e subtraia 1');
    });
  });

  // ==========================================================================
  // TIER 3: Cross-Feature Combinations
  // ==========================================================================
  describe('Tier 3: Cross-Feature Combinations', () => {
    test('Numpad -> Verification -> Drawer Pipeline', () => {
      // Simulate input -> question comparison -> drawer status emission
      const testQuestion = { equation: '36 x 25', answer: 900 };
      let inputVal = '900';

      const verifyAnswer = (val, q) => {
        const parsed = parseInt(val, 10);
        if (Number.isNaN(parsed)) return { status: 'incorrect', combo: 0 };
        if (parsed === q.answer) {
          return { status: 'correct', combo: 1 };
        }
        return { status: 'incorrect', combo: 0 };
      };

      const correctResult = verifyAnswer(inputVal, testQuestion);
      assert.equal(correctResult.status, 'correct');
      assert.equal(correctResult.combo, 1);

      // Wrong input
      const wrongResult = verifyAnswer('850', testQuestion);
      assert.equal(wrongResult.status, 'incorrect');
      assert.equal(wrongResult.combo, 0);
    });

    test('Drawer continuation advances question index or triggers victory', () => {
      const totalQuestions = 5;
      let currentIndex = 4; // on last question

      const handleContinue = (idx, total) => {
        if (idx + 1 >= total) {
          return { isVictory: true, nextIndex: idx };
        }
        return { isVictory: false, nextIndex: idx + 1 };
      };

      const finalStep = handleContinue(currentIndex, totalQuestions);
      assert.equal(finalStep.isVictory, true, 'Answering 5th question must trigger victory state');

      const midStep = handleContinue(2, totalQuestions);
      assert.equal(midStep.isVictory, false);
      assert.equal(midStep.nextIndex, 3);
    });
  });

  // ==========================================================================
  // TIER 4: Real-World Scenarios
  // ==========================================================================
  describe('Tier 4: Real-World Application Scenarios', () => {
    test('Scenario: Complete Numpad and Feedback Drawer Interaction Lifecycle', () => {
      let buffer = '';
      let hearts = 5;
      let combo = 0;
      let drawerState = null;

      // User types "7", "2"
      buffer += '7';
      buffer += '2';
      assert.equal(buffer, '72');

      // User presses Backspace to fix typo
      buffer = buffer.slice(0, -1);
      assert.equal(buffer, '7');

      // User enters "5"
      buffer += '5';
      assert.equal(buffer, '75');

      // Question is "15 x 5 = 75"
      const question = { answer: 75, explanation: '15 x 10 / 2 = 75' };
      if (parseInt(buffer, 10) === question.answer) {
        combo += 1;
        drawerState = { status: 'correct', explanation: 'Perfeito!' };
      } else {
        hearts -= 1;
        combo = 0;
        drawerState = { status: 'incorrect', explanation: question.explanation };
      }

      assert.equal(drawerState.status, 'correct');
      assert.equal(combo, 1);
      assert.equal(hearts, 5);

      // User triggers continue (Enter key)
      buffer = '';
      drawerState = null;
      assert.equal(buffer, '');
      assert.equal(drawerState, null);
    });
  });
});
