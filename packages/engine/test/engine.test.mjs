import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../dist/index.js';

describe('@auramath/engine Core Verification', () => {
  test('TRACK_GRADES covers all 6 Cognitive Grades', () => {
    assert.equal(engine.TRACK_GRADES.length, 6, 'Must contain 6 cognitive grades');
    for (let i = 0; i < 6; i++) {
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

  test('generateGhostRun produces realistic temporal telemetry', () => {
    const ghost = engine.generateGhostRun(1400);
    assert.ok(ghost.opponentName, 'Ghost must have an opponent name');
    assert.ok(ghost.elo >= 1200 && ghost.elo <= 1600, 'Ghost elo must be near target');
    assert.ok(ghost.events.length > 0, 'Ghost must have run events');
    for (const event of ghost.events) {
      assert.ok(event.deltaMs > 0, 'Event delta must be positive');
      assert.equal(typeof event.correct, 'boolean');
    }
  });

  test('AURA_SKINS and BOSS_LIST catalogs are populated and coherent', () => {
    assert.ok(engine.AURA_SKINS.length >= 5, 'Must have at least 5 skins');
    assert.ok(engine.BOSS_LIST.length >= 6, 'Must have 6 Arcanum bosses');
    for (const boss of engine.BOSS_LIST) {
      assert.ok(boss.maxHp > 0, 'Boss HP must be positive');
      assert.ok(boss.attackTimeoutMs > 0, 'Attack timeout must be positive');
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
});
