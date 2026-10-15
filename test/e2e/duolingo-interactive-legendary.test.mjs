/**
 * E2E Verification Suite — Frente B: Primitivas de Lição Interativas & Maestria Lendária
 * Tests:
 * 1. Tap-to-Split (Cisão e Fusão Tátil)
 * 2. Match Madness (Pares Complementares e Algébricos)
 * 3. Nós Lendários Dourados (Avaliação Suprema e Coroa 3D)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  evaluateLegendaryChallenge,
  generateComplementaryPairs,
  generateAlgebraicPairs,
  createTapToSplitExercise,
  validateBlockMerge,
} from '../../packages/engine/dist/index.js';

const ROOT_DIR = process.cwd();

describe('Frente B — Primitivas de Lição Interativas & Maestria Lendária', () => {
  // ==========================================================================
  // TIER 1: Algoritmos do Motor Matemático (@auramath/engine)
  // ==========================================================================
  describe('Tier 1: Engine Algorithms & Game Mechanics', () => {
    test('evaluateLegendaryChallenge enforces 87.5% passing threshold (7/8)', () => {
      // 8 de 8 -> Aprovado
      const r8 = evaluateLegendaryChallenge(8, 8);
      assert.equal(r8.passed, true);
      assert.equal(r8.accuracyPct, 100);
      assert.equal(r8.xpReward, 50);

      // 7 de 8 -> Aprovado (Limiar exato: 87.5%)
      const r7 = evaluateLegendaryChallenge(8, 7);
      assert.equal(r7.passed, true);
      assert.equal(r7.accuracyPct, 88);
      assert.equal(r7.xpReward, 50);

      // 6 de 8 -> Reprovado (75% < 87.5%)
      const r6 = evaluateLegendaryChallenge(8, 6);
      assert.equal(r6.passed, false);
      assert.equal(r6.accuracyPct, 75);
      assert.equal(r6.xpReward, 10);
      assert.ok(r6.feedbackMessage.includes('7 acertos'));

      // 0 de 8 -> Reprovado
      const r0 = evaluateLegendaryChallenge(8, 0);
      assert.equal(r0.passed, false);
    });

    test('generateComplementaryPairs produces valid pairs summing to 100 and 1000', () => {
      const pairs100 = generateComplementaryPairs(100, 10);
      assert.equal(pairs100.length, 10, 'Should generate 10 pairs of base 100');

      pairs100.forEach((pair) => {
        const valA = parseInt(pair.leftLabel, 10);
        const valB = parseInt(pair.rightLabel, 10);
        assert.equal(valA + valB, 100, `Pair ${valA} + ${valB} must sum to 100`);
      });

      const pairs1000 = generateComplementaryPairs(1000, 8);
      assert.equal(pairs1000.length, 8, 'Should generate 8 pairs of base 1000');

      pairs1000.forEach((pair) => {
        const valA = parseInt(pair.leftLabel, 10);
        const valB = parseInt(pair.rightLabel, 10);
        assert.equal(valA + valB, 1000, `Pair ${valA} + ${valB} must sum to 1000`);
      });
    });

    test('generateAlgebraicPairs produces valid mental arithmetic equivalences', () => {
      const algPairs = generateAlgebraicPairs(6);
      assert.equal(algPairs.length, 6);

      algPairs.forEach((pair) => {
        assert.ok(pair.leftLabel, 'Left label must exist');
        assert.ok(pair.rightLabel, 'Right label must exist');
        assert.ok(pair.targetRelation, 'Target relation must be specified');
      });
    });

    test('createTapToSplitExercise and validateBlockMerge execute positional arithmetic splitting', () => {
      const ex = createTapToSplitExercise('47_plus_38');
      assert.equal(ex.finalAnswer, 85);
      assert.equal(ex.initialBlocks.length, 2);

      // Bloco 47 deve permitir cisão em 40 e 7
      const b47 = ex.initialBlocks.find((b) => b.value === 47);
      assert.ok(b47?.canSplit);
      assert.deepEqual(
        b47?.splitInto?.map((s) => s.value),
        [40, 7]
      );

      // Fusão válida de dezenas 40 + 30 = 70
      const mergeTens = validateBlockMerge(ex, 40, 30);
      assert.equal(mergeTens.canMerge, true);
      assert.equal(mergeTens.resultingValue, 70);

      // Fusão válida de unidades 7 + 8 = 15
      const mergeUnits = validateBlockMerge(ex, 7, 8);
      assert.equal(mergeUnits.canMerge, true);
      assert.equal(mergeUnits.resultingValue, 15);

      // Fusão final 70 + 15 = 85
      const mergeFinal = validateBlockMerge(ex, 70, 15);
      assert.equal(mergeFinal.canMerge, true);
      assert.equal(mergeFinal.resultingValue, 85);

      // Fusão inválida (ex: 40 + 7 não está na lista de soma de dezenas cruzadas)
      const mergeInvalid = validateBlockMerge(ex, 40, 999);
      assert.equal(mergeInvalid.canMerge, false);
    });
  });

  // ==========================================================================
  // TIER 2: Componentes de UI e Integrações de Sistema
  // ==========================================================================
  describe('Tier 2: UI Components & System Wiring', () => {
    test('TapToSplitSlate component file exists and implements 3D tactile physics', () => {
      const filePath = path.join(ROOT_DIR, 'src/components/tactile/TapToSplitSlate.tsx');
      assert.ok(fs.existsSync(filePath), 'TapToSplitSlate.tsx must exist');

      const content = fs.readFileSync(filePath, 'utf-8');
      assert.ok(content.includes('data-testid="tap-to-split-slate"'));
      assert.ok(content.includes('handleBlockClick'));
      assert.ok(content.includes('font-mono-tabular'));
      assert.ok(content.includes('audioSynth.playSuccessNote'));
    });

    test('MatchMadnessGrid component file exists and implements 2-column sliding buffer', () => {
      const filePath = path.join(ROOT_DIR, 'src/components/tactile/MatchMadnessGrid.tsx');
      assert.ok(fs.existsSync(filePath), 'MatchMadnessGrid.tsx must exist');

      const content = fs.readFileSync(filePath, 'utf-8');
      assert.ok(content.includes('data-testid="match-madness-grid"'));
      assert.ok(content.includes('handleItemClick'));
      assert.ok(content.includes('grid-cols-2'));
      assert.ok(content.includes('timeLeft'));
      assert.ok(content.includes('+3s'));
    });

    test('LegendaryChallengeView component file exists and executes 8-question verification', () => {
      const filePath = path.join(ROOT_DIR, 'src/views/LegendaryChallengeView.tsx');
      assert.ok(fs.existsSync(filePath), 'LegendaryChallengeView.tsx must exist');

      const content = fs.readFileSync(filePath, 'utf-8');
      assert.ok(content.includes('data-testid="legendary-challenge-view"'));
      assert.ok(content.includes('evaluateLegendaryChallenge'));
      assert.ok(content.includes('totalQuestions = 8'));
      assert.ok(content.includes('MAESTRIA LENDÁRIA!'));
      assert.ok(content.includes('+50 XP'));
    });

    test('TrackSerpentineNode and TrackView support isLegendary and golden Marigold styling', () => {
      const nodePath = path.join(ROOT_DIR, 'src/components/tactile/TrackSerpentineNode.tsx');
      const nodeContent = fs.readFileSync(nodePath, 'utf-8');
      assert.ok(nodeContent.includes('isLegendary'));
      assert.ok(nodeContent.includes('onStartLegendary'));
      assert.ok(nodeContent.includes('DESAFIO LENDÁRIO'));

      const trackPath = path.join(ROOT_DIR, 'src/views/TrackView.tsx');
      const trackContent = fs.readFileSync(trackPath, 'utf-8');
      assert.ok(trackContent.includes('LegendaryChallengeView'));
      assert.ok(trackContent.includes('selectedLegendaryNode'));
      assert.ok(trackContent.includes('auramath_legendary_nodes'));
    });

    test('DuelHubView integrates Match Madness as accessible game mode', () => {
      const duelPath = path.join(ROOT_DIR, 'src/views/DuelHubView.tsx');
      const duelContent = fs.readFileSync(duelPath, 'utf-8');
      assert.ok(duelContent.includes("id: 'match_madness'"));
      assert.ok(duelContent.includes('Match Madness'));
      assert.ok(duelContent.includes('<MatchMadnessGrid'));
    });

    test('DuolingoLessonView integrates TapToSplitSlate as alternate kinetic input mode', () => {
      const lessonPath = path.join(ROOT_DIR, 'src/views/DuolingoLessonView.tsx');
      const lessonContent = fs.readFileSync(lessonPath, 'utf-8');
      assert.ok(lessonContent.includes('TapToSplitSlate'));
      assert.ok(lessonContent.includes('useTapToSplit'));
      assert.ok(lessonContent.includes('Decomposição por Toque'));
    });
  });
});
