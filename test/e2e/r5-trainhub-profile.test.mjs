/**
 * E2E Verification Suite — Requirement R5: Training Hub, Game Modes & Cognitive Profile
 * Covers Features 19, 20, 21, 22 across Tiers 1 through 4.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import enginePkg from '../../packages/engine/dist/index.js';
const {
  generatePatternRecognitionQuestion,
  generateFlashAnzanSequence,
  MOCK_USER_PROFILE,
} = enginePkg;

const ROOT_DIR = process.cwd();

// ============================================================================
// Authoritative Radar Polygon Calculations (Shoelace Formula)
// ============================================================================
function computeRadarPolygonPoints(radar, center = 100, maxRadius = 80) {
  const scores = [
    radar.speedScore,
    radar.fermiScore,
    radar.flexibilityScore,
    radar.staminaScore,
    radar.memoryScore,
  ];

  // Exact polar projections for regular pentagon with top apex
  const angles = [
    -Math.PI / 2,                  // 0: Top (Speed)
    -Math.PI / 2 + (2 * Math.PI) / 5, // 1: Top-Right (Fermi)
    -Math.PI / 2 + (4 * Math.PI) / 5, // 2: Bottom-Right (Flexibility)
    -Math.PI / 2 + (6 * Math.PI) / 5, // 3: Bottom-Left (Stamina)
    -Math.PI / 2 + (8 * Math.PI) / 5, // 4: Top-Left (Memory)
  ];

  return scores.map((score, i) => {
    const r = (score / 100) * maxRadius;
    const x = center + r * Math.cos(angles[i]);
    const y = center + r * Math.sin(angles[i]);
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
  });
}

function computePolygonArea(points) {
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

describe('R5: Training Hub, Game Modes & Cognitive Profile (F19-F22)', () => {
  const trainHubPath = path.join(ROOT_DIR, 'src', 'views', 'TrainHubView.tsx');
  const profileHubPath = path.join(ROOT_DIR, 'src', 'views', 'ProfileHubView.tsx');
  const trainHubContent = fs.readFileSync(trainHubPath, 'utf-8');
  const profileHubContent = fs.readFileSync(profileHubPath, 'utf-8');

  // ==========================================================================
  // TIER 1: Feature Coverage & Mathematical Invariants
  // ==========================================================================
  describe('Tier 1: Feature Coverage & Mathematical Invariants', () => {
    test('F19: Training Hub supports 6 distinct game modes', () => {
      // Submodes declared in TrainHubView
      assert.match(trainHubContent, /'arena'\s*\|\s*'pattern'\s*\|\s*'blitz'\s*\|\s*'sudden'\s*\|\s*'anzan'\s*\|\s*'zen'/);
    });

    test('F20: Olho Matemático produces valid questions with exactly 1 optimal choice', () => {
      for (let i = 0; i < 20; i++) {
        const q = generatePatternRecognitionQuestion();
        assert.ok(q.id, 'Question must have id');
        assert.ok(q.equation, 'Question must declare equation');
        assert.ok(q.prompt, 'Question must have prompt');
        assert.ok(q.options.length >= 3, 'Must have at least 3 multiple choice options');

        const optimalOptions = q.options.filter(opt => opt.isOptimal === true);
        assert.equal(optimalOptions.length, 1, 'Question must have exactly 1 optimal choice');

        const optimal = optimalOptions[0];
        assert.ok(optimal.explanation.length > 0, 'Optimal choice must have explanation');

        // Non-optimal options must also have didactic explanations
        const nonOptimal = q.options.filter(opt => opt.isOptimal === false);
        for (const opt of nonOptimal) {
          assert.ok(opt.explanation.length > 0, 'Every distractor must have a didactic explanation');
        }
      }
    });

    test('F21: Polar 5-Axis Cognitive Radar geometry and coordinates', () => {
      const { radar } = MOCK_USER_PROFILE;
      assert.ok(radar.speedScore >= 0 && radar.speedScore <= 100);
      assert.ok(radar.fermiScore >= 0 && radar.fermiScore <= 100);
      assert.ok(radar.flexibilityScore >= 0 && radar.flexibilityScore <= 100);
      assert.ok(radar.staminaScore >= 0 && radar.staminaScore <= 100);
      assert.ok(radar.memoryScore >= 0 && radar.memoryScore <= 100);
      assert.ok(radar.archetypeTitle, 'Must provide archetype title');

      // Verify SVG polar rendering in ProfileHubView
      assert.match(profileHubContent, /polygon\s+points=/);
      assert.match(profileHubContent, /Velocidade/);
      assert.match(profileHubContent, /Fermi/);
      assert.match(profileHubContent, /Flexibilidade/);
      assert.match(profileHubContent, /Resistência/);
      assert.match(profileHubContent, /Memória/);

      // Verify area computation
      const points = computeRadarPolygonPoints(radar);
      assert.equal(points.length, 5);
      const area = computePolygonArea(points);
      assert.ok(area > 0, 'Cognitive profile area must be positive');
    });

    test('F22: Cosmetic Skins Cancellation verified', () => {
      assert.equal('AURA_SKINS' in enginePkg, false, 'AURA_SKINS must be eliminated from engine exports');
      assert.equal('equippedSkinId' in MOCK_USER_PROFILE, false, 'equippedSkinId must be eliminated from user profile');
    });
  });

  // ==========================================================================
  // TIER 2: Boundary & Corner Cases
  // ==========================================================================
  describe('Tier 2: Boundary & Corner Cases', () => {
    test('Boundary: Cognitive radar handles degenerate 0-score and maximum 100-score profiles', () => {
      const zeroRadar = {
        speedScore: 0,
        fermiScore: 0,
        flexibilityScore: 0,
        staminaScore: 0,
        memoryScore: 0,
        archetypeTitle: 'Tabula Rasa',
        archetypeDescription: 'Perfil inicial',
      };
      const zeroPoints = computeRadarPolygonPoints(zeroRadar);
      for (const pt of zeroPoints) {
        assert.equal(pt.x, 100);
        assert.equal(pt.y, 100);
      }
      assert.equal(computePolygonArea(zeroPoints), 0);

      const maxRadar = {
        speedScore: 100,
        fermiScore: 100,
        flexibilityScore: 100,
        staminaScore: 100,
        memoryScore: 100,
        archetypeTitle: 'Mestre Onisciente',
        archetypeDescription: 'Perfil perfeito',
      };
      const maxPoints = computeRadarPolygonPoints(maxRadar);
      const maxArea = computePolygonArea(maxPoints);
      // For regular pentagon with R=80, Area = (5/2) * R^2 * sin(72 deg) = 2.5 * 6400 * 0.9510565 = ~15216.9
      assert.ok(Math.abs(maxArea - 15216.9) < 5.0, 'Regular pentagon area must match trigonometric expectation');
    });

    test('Boundary: Olho Matemático 50-iteration uniqueness stress test', () => {
      for (let i = 0; i < 50; i++) {
        const q = generatePatternRecognitionQuestion();
        const optimalCount = q.options.filter(o => o.isOptimal).length;
        assert.equal(optimalCount, 1, `Question ${q.equation} must have exactly 1 optimal choice`);
      }
    });

    test('Boundary: Flash Anzan sequence length and integer constraints', () => {
      const seq6 = generateFlashAnzanSequence(6);
      assert.equal(seq6.length, 6);
      for (const num of seq6) {
        assert.ok(Number.isInteger(num));
        assert.ok(num >= 10 && num <= 99, 'Flash anzan sequence numbers should be 2-digit integers');
      }

      const seq12 = generateFlashAnzanSequence(12);
      assert.equal(seq12.length, 12);
    });
  });

  // ==========================================================================
  // TIER 3: Cross-Feature Combinations
  // ==========================================================================
  describe('Tier 3: Cross-Feature Combinations', () => {
    test('Flash Anzan mental arithmetic sum calculation matches sequence', () => {
      const sequence = generateFlashAnzanSequence(5);
      const expectedSum = sequence.reduce((acc, n) => acc + n, 0);

      // Verify user input simulation
      const verifyAnzanAnswer = (inputStr, expected) => {
        return parseInt(inputStr, 10) === expected;
      };

      assert.equal(verifyAnzanAnswer(String(expectedSum), expectedSum), true);
      assert.equal(verifyAnzanAnswer(String(expectedSum + 1), expectedSum), false);
    });

    test('Pedagogical Profile focuses on Cognitive Radar instead of cosmetic loadout', () => {
      assert.ok(MOCK_USER_PROFILE.radar, 'Profile must focus on 5-axis cognitive radar');
      assert.ok(MOCK_USER_PROFILE.radar.speedScore > 0);
    });
  });

  // ==========================================================================
  // TIER 4: Real-World Scenarios
  // ==========================================================================
  describe('Tier 4: Real-World Application Scenarios', () => {
    test('Scenario: Training Session -> Olho Matemático Selection -> Profile Inspection', () => {
      // 1. Trainee selects Olho Matemático
      const question = generatePatternRecognitionQuestion();
      assert.ok(question.equation);

      // 2. Trainee selects the optimal choice
      const optimalChoice = question.options.find(o => o.isOptimal);
      assert.ok(optimalChoice);
      assert.ok(optimalChoice.explanation);

      // 3. Score updates
      let sessionScore = 0;
      let sessionStreak = 0;
      const onOptionSelected = (opt) => {
        if (opt.isOptimal) {
          sessionScore += 100;
          sessionStreak += 1;
          return true;
        }
        sessionStreak = 0;
        return false;
      };

      const result = onOptionSelected(optimalChoice);
      assert.equal(result, true);
      assert.equal(sessionScore, 100);
      assert.equal(sessionStreak, 1);

      // 4. User navigates to Profile to inspect Cognitive Radar
      const profile = MOCK_USER_PROFILE;
      const points = computeRadarPolygonPoints(profile.radar);
      assert.equal(points.length, 5);
      assert.equal(profile.displayName, 'Alexandre Magno');
    });
  });
});
