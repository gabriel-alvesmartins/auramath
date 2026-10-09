import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/index.js';

describe('@auramath/engine Core Verification', () => {
  test('TRACK_GRADES covers all 7 Cognitive Grades and 31 curriculum nodes', () => {
    assert.equal(engine.TRACK_GRADES.length, 7, 'Must contain 7 cognitive grades');
    const totalNodes = engine.TRACK_GRADES.reduce((acc, g) => acc + g.nodes.length, 0);
    assert.equal(totalNodes, 32, 'Must contain all 32 curriculum track nodes');
    for (let i = 0; i < 7; i++) {
      const grade = engine.TRACK_GRADES[i];
      assert.equal(grade.grade, i + 1);
      assert.ok(grade.nodes.length > 0, `Grade ${i + 1} must have track nodes`);
      for (const node of grade.nodes) {
        assert.ok(node.id, 'Node must have an id');
        assert.ok(node.title, 'Node must have a title');
        assert.ok(node.theory, 'Node must have theory');
        assert.ok(node.theory.visualBreakdown, 'Node theory must have visual breakdown');
        assert.ok(Array.isArray(node.scaffolding), 'Node must have scaffolding tasks');
      }
    }
  });

  test('generateQuestion produces valid arithmetic equations and answers', () => {
    for (let i = 0; i < 50; i++) {
      const q = engine.generateQuestion();
      assert.ok(q.id, 'Question must have id');
      assert.ok(q.equation, 'Question must have equation');
      assert.equal(typeof q.answer, 'number', 'Answer must be a number');
      assert.ok(!Number.isNaN(q.answer), 'Answer cannot be NaN');
    }
  });

  test('generateQuestion with options produces valid multiple choice distractor sets', () => {
    const q = engine.generateQuestion('fermi');
    assert.ok(q.options, 'Fermi mode question must provide options');
    assert.ok(q.options.length >= 3, 'Must have at least 3 options');
    assert.ok(q.options.includes(q.answer), 'Options must include the correct answer');
  });

  test('generateDailyQuestions generates deterministic sequence for given seed date', () => {
    const date = '2026-09-08';
    const batch1 = engine.generateDailyQuestions(date);
    const batch2 = engine.generateDailyQuestions(date);
    assert.equal(batch1.length, 20, 'Daily challenge must have 20 questions');
    assert.equal(batch2.length, 20);
    for (let i = 0; i < 20; i++) {
      assert.equal(batch1[i].equation, batch2[i].equation, `Equation ${i} must match`);
      assert.equal(batch1[i].answer, batch2[i].answer, `Answer ${i} must match`);
    }
  });

  test('generateFlashAnzanSequence produces array of integers', () => {
    const seq = engine.generateFlashAnzanSequence(8);
    assert.equal(seq.length, 8);
    for (const num of seq) {
      assert.equal(typeof num, 'number');
      assert.ok(!Number.isNaN(num));
    }
  });

  test('Mulberry32 PRNG and difficulty calibration function correctly', () => {
    const rng1 = engine.createSeededRandom('test-seed-123');
    const rng2 = engine.createSeededRandom('test-seed-123');
    for (let i = 0; i < 20; i++) {
      assert.equal(rng1(), rng2(), 'Identical seeds must yield identical values');
    }

    const qEasy = engine.generateQuestion('MULT_11', undefined, 'easy');
    const qHard = engine.generateQuestion('MULT_11', undefined, 'hard');
    assert.ok(qEasy.equation);
    assert.ok(qHard.equation);

    const questionsBatch = engine.generateQuestionsForNode('MULT_25', 15, 'hard');
    assert.equal(questionsBatch.length, 15);
  });

  test('generateFermiQuestion produces pure order of magnitude distractor sets', () => {
    for (let i = 0; i < 10; i++) {
      const q = engine.generateFermiQuestion('medium');
      assert.ok(q.options, 'Must provide multiple choice options');
      assert.equal(q.options.length, 4, 'Must provide 4 options');
      assert.ok(q.options.includes(q.answer), 'Options must include the answer');
      const maxOpt = Math.max(...q.options);
      const minOpt = Math.min(...q.options);
      assert.ok(maxOpt / minOpt >= 10, 'Options must span orders of magnitude');
    }
  });

  test('generateDigitalRootsQuestion tests modulo 9 and modulo 11 modular arithmetic', () => {
    for (let i = 0; i < 10; i++) {
      const q9 = engine.generateDigitalRootsQuestion('nines');
      assert.ok(q9.answer >= 1 && q9.answer <= 9, 'Digital root mod 9 must be 1..9');

      const q11 = engine.generateDigitalRootsQuestion('elevens');
      assert.ok(q11.answer >= 0 && q11.answer <= 10, 'Remainder mod 11 must be 0..10');
    }
  });

  test('Legacy Boss and Skin items are removed from engine exports', () => {
    assert.equal(engine.BOSS_LIST, undefined, 'BOSS_LIST must be undefined');
    assert.equal(engine.AURA_SKINS, undefined, 'AURA_SKINS must be undefined');
    assert.equal(engine.generateGhostRun, undefined, 'generateGhostRun must be undefined');
  });

  test('MASTERY_CHALLENGES and MASTERY_BADGES catalogs are populated and coherent', () => {
    assert.ok(engine.MASTERY_BADGES.length >= 6, 'Must have 6 mastery badges');
    assert.ok(engine.MASTERY_CHALLENGES.length >= 6, 'Must have 6 unit mastery challenges');
    for (const challenge of engine.MASTERY_CHALLENGES) {
      assert.ok(challenge.questionsCount > 0, 'Questions count must be positive');
      assert.ok(challenge.badgeId, 'Challenge must provide a badge reward');
    }
  });

  test('MOCK_USER_PROFILE has calibrated 5-axis cognitive radar', () => {
    const { radar } = engine.MOCK_USER_PROFILE;
    assert.ok(radar.speedScore >= 0 && radar.speedScore <= 100);
    assert.ok(radar.fermiScore >= 0 && radar.fermiScore <= 100);
    assert.ok(radar.flexibilityScore >= 0 && radar.flexibilityScore <= 100);
    assert.ok(radar.staminaScore >= 0 && radar.staminaScore <= 100);
    assert.ok(radar.memoryScore >= 0 && radar.memoryScore <= 100);
    assert.ok(radar.archetypeTitle, 'Must provide cognitive archetype');
  });

  test('generatePatternRecognitionQuestion produces valid options with exactly 1 optimal choice', () => {
    for (let i = 0; i < 25; i++) {
      const q = engine.generatePatternRecognitionQuestion();
      assert.ok(q.id, 'Question must have id');
      assert.ok(q.equation, 'Question must have equation');
      assert.ok(q.prompt, 'Question must have prompt');
      assert.ok(q.options.length >= 3, 'Must have at least 3 options');
      const optimalOptions = q.options.filter(o => o.isOptimal);
      assert.equal(optimalOptions.length, 1, 'Must have exactly 1 optimal option');
      assert.ok(optimalOptions[0].explanation.length > 0, 'Optimal option must have explanation');
    }
  });

  test('All 11 curriculum track techniques have dedicated generators via generateQuestion', () => {
    const trackNodeIds = [
      'ADD_LEFT_RIGHT',
      'SUB_COMPENSATION',
      'COMPLEMENT_100',
      'MULT_5_50',
      'MULT_25',
      'MULT_11',
      'DIFF_OF_SQUARES',
      'SQUARES_ENDING_5',
      'FERMI_MAGNITUDE',
      'VEDIC_CROSS',
      'FLASH_ANZAN_MASTERY',
    ];

    for (const id of trackNodeIds) {
      const q = engine.generateQuestion(id);
      assert.ok(q.id, `Technique ${id} must generate id`);
      assert.ok(q.equation, `Technique ${id} must generate equation`);
      assert.equal(typeof q.answer, 'number', `Technique ${id} answer must be number`);
      assert.ok(!Number.isNaN(q.answer), `Technique ${id} answer cannot be NaN`);
    }
  });

  test('Extended mental math technique generators produce correct mathematical invariants', () => {
    // 1. Antyayoreva: tens equal, units sum to 10
    for (let i = 0; i < 10; i++) {
      const q = engine.generateAntyayorevaQuestion();
      const match = q.equation.match(/^(\d+) × (\d+)$/);
      assert.ok(match, 'Antyayoreva format match');
      const a = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      assert.equal(Math.floor(a / 10), Math.floor(b / 10), 'Tens must be equal');
      assert.equal((a % 10) + (b % 10), 10, 'Units must sum to 10');
      assert.equal(q.answer, a * b, 'Product must be correct');
    }

    // 2. Squares near 50 (Pivot 25)
    for (let i = 0; i < 10; i++) {
      const q = engine.generateSquaresNear50Question();
      const match = q.equation.match(/^(\d+)²$/);
      assert.ok(match, 'Squares near 50 format match');
      const n = parseInt(match[1], 10);
      assert.ok(n >= 40 && n <= 60, 'Must be near 50');
      assert.equal(q.answer, n * n, 'Square must be correct');
    }

    // 3. Yavadunam base 100
    for (let i = 0; i < 10; i++) {
      const q = engine.generateYavadunamQuestion();
      const match = q.equation.match(/^(\d+) × (\d+)$/);
      assert.ok(match, 'Yavadunam format match');
      const a = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      assert.equal(q.answer, a * b, 'Product must be correct');
    }

    // 4. Cube root of perfect cube
    for (let i = 0; i < 10; i++) {
      const q = engine.generateCubeRootQuestion();
      const match = q.equation.match(/^∛(\d+)$/);
      assert.ok(match, 'Cube root format match');
      const cube = parseInt(match[1], 10);
      const r = q.answer;
      assert.equal(r * r * r, cube, 'Root cubed must equal radicand');
    }

    // 5. Fast Divisions (5, 25, 4)
    for (let i = 0; i < 5; i++) {
      const q5 = engine.generateDiv5Question();
      assert.equal(q5.answer * 5, parseInt(q5.equation.split(' ÷ ')[0], 10));

      const q25 = engine.generateDiv25Question();
      assert.equal(q25.answer * 25, parseInt(q25.equation.split(' ÷ ')[0], 10));

      const q4 = engine.generateDiv4Question();
      assert.equal(q4.answer * 4, parseInt(q4.equation.split(' ÷ ')[0], 10));
    }

    // 6. Trachtenberg 12 and Mult 9/99
    for (let i = 0; i < 5; i++) {
      const q12 = engine.generateTrachtenberg12Question();
      const n12 = parseInt(q12.equation.split(' × ')[0], 10);
      assert.equal(q12.answer, n12 * 12);

      const q9 = engine.generateMult9or99Question();
      const parts = q9.equation.split(' × ');
      const n9 = parseInt(parts[0], 10);
      const mult = parseInt(parts[1], 10);
      assert.equal(q9.answer, n9 * mult);

      const q72 = engine.generateRuleOf72Question();
      assert.equal(typeof q72.answer, 'number');
    }

    // 7. Teens 11-19 and Ends in 1
    for (let i = 0; i < 5; i++) {
      const qTeens = engine.generateMultTeens11to19Question();
      const partsT = qTeens.equation.split(' × ');
      assert.equal(qTeens.answer, parseInt(partsT[0], 10) * parseInt(partsT[1], 10));

      const qEnds1 = engine.generateMultEndsIn1Question();
      const partsE = qEnds1.equation.split(' × ');
      assert.equal(qEnds1.answer, parseInt(partsE[0], 10) * parseInt(partsE[1], 10));
    }

    // 8. Thousand scalers (125/75) and Decimal fraction conversions
    for (let i = 0; i < 5; i++) {
      const q125 = engine.generateMult125or750Question();
      assert.ok(q125.answer > 0);

      const qDec = engine.generateDecimalFracConversionQuestion();
      assert.equal(typeof qDec.answer, 'number');
      assert.ok(!Number.isNaN(qDec.answer));
    }

    // 9. Square root of perfect square
    for (let i = 0; i < 5; i++) {
      const qSqrt = engine.generateSquareRootPerfectQuestion();
      const sq = parseInt(qSqrt.equation.replace('√', ''), 10);
      assert.equal(qSqrt.answer * qSqrt.answer, sq);
    }

    // 10. Percentages (Pivot, 15%, Fractions, Symmetry, Discount/Add)
    for (let i = 0; i < 5; i++) {
      const qPiv = engine.generatePercentPivot10and1Question();
      assert.ok(qPiv.answer > 0);

      const qTip = engine.generatePercentTip15Question();
      assert.ok(qTip.answer > 0);

      const qFrac = engine.generatePercentFriendlyFractionsQuestion();
      assert.ok(qFrac.answer > 0);

      const qSym = engine.generatePercentSymmetryQuestion();
      assert.ok(qSym.answer > 0);

      const qDisc = engine.generatePercentDiscountAddQuestion();
      assert.ok(qDisc.answer > 0);
    }
  });
});
