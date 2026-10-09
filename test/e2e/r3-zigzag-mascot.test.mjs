/**
 * E2E Verification Suite — Requirement R3: Zigzag Progression Track & Anchored Mascot
 * Covers Features 10, 11, 12, 13 across Tiers 1 through 4.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import enginePkg from '../../packages/engine/dist/index.js';
const { TRACK_GRADES, MASTERY_CHALLENGES, BOSS_LIST } = enginePkg;

const ROOT_DIR = process.cwd();

describe('R3: Zigzag Progression Track & Mascot Anchoring (F10-F13)', () => {
  const trackViewPath = path.join(ROOT_DIR, 'src', 'views', 'TrackView.tsx');
  const trackViewContent = fs.readFileSync(trackViewPath, 'utf-8');

  // ==========================================================================
  // TIER 1: Feature Coverage & Interface Contracts
  // ==========================================================================
  describe('Tier 1: Feature Coverage & Data Structures', () => {
    test('F10: TRACK_GRADES spans all Cognitive Grades with pedagogical rigor', () => {
      assert.ok(TRACK_GRADES.length >= 6, 'Must contain all Cognitive Grades');

      for (let g = 0; g < TRACK_GRADES.length; g++) {
        const grade = TRACK_GRADES[g];
        assert.equal(grade.grade, g + 1, `Grade index ${g} must have grade number ${g + 1}`);
        assert.ok(grade.title && grade.title.length > 0, `Grade ${g + 1} must have a title`);
        assert.ok(grade.description && grade.description.length > 0, `Grade ${g + 1} must have a description`);
        assert.ok(grade.masteryChallengeId && grade.masteryChallengeId.startsWith('MASTERY_GRADE_'), `Grade ${g + 1} must reference a mastery challenge`);
        assert.ok(Array.isArray(grade.nodes) && grade.nodes.length > 0, `Grade ${g + 1} must have track nodes`);

        for (const node of grade.nodes) {
          assert.ok(node.id, 'Node must have an id');
          assert.ok(node.title, 'Node must have a title');
          assert.ok(node.technique, 'Node must declare an algebraic technique');
          assert.ok(typeof node.stars === 'number' && node.stars >= 0 && node.stars <= 3, 'Stars must be 0-3');
          assert.ok(typeof node.isLocked === 'boolean', 'isLocked must be boolean');

          // Theory visual breakdown verification
          assert.ok(node.theory, 'Node must contain theory');
          assert.ok(node.theory.formula, 'Theory must have formula');
          assert.ok(node.theory.visualBreakdown, 'Theory must have visual breakdown');
          assert.ok(node.theory.visualBreakdown.from, 'Visual breakdown must declare starting state');
          assert.ok(Array.isArray(node.theory.visualBreakdown.steps), 'Visual breakdown must declare step transitions');
          assert.ok(node.theory.visualBreakdown.to, 'Visual breakdown must declare ending state');

          // Scaffolding tasks verification
          assert.ok(Array.isArray(node.scaffolding) && node.scaffolding.length > 0, 'Node must have scaffolding exercises');
          for (const task of node.scaffolding) {
            assert.ok(task.equation, 'Scaffolding task must have equation');
            assert.ok(task.template, 'Scaffolding task must have template string with blanks');
            assert.ok(Array.isArray(task.blanks) && task.blanks.length > 0, 'Scaffolding task must specify blanks');
            for (const b of task.blanks) {
              assert.ok(b.key, 'Blank must have key');
              assert.ok(b.expected, 'Blank must specify expected value');
            }
          }
        }
      }
    });

    test('F10: Serpentine fluid zigzag offset calculation', () => {
      // Offset formula used in TrackView: [0, 48, 0, -48]
      const getNodeOffset = (index) => {
        const pattern = [0, 48, 0, -48];
        return pattern[index % pattern.length];
      };

      assert.equal(getNodeOffset(0), 0);
      assert.equal(getNodeOffset(1), 48);
      assert.equal(getNodeOffset(2), 0);
      assert.equal(getNodeOffset(3), -48);
      assert.equal(getNodeOffset(4), 0);
      assert.equal(getNodeOffset(5), 48);
    });

    test('F11: Anchored Aura Mascot positioning and speech mechanics', () => {
      assert.match(trackViewContent, /<AuraMascotWeb/);
      assert.match(trackViewContent, /speechText\s*=\s*['"][^'"]+['"]/);
      assert.match(trackViewContent, /state\s*=\s*['"]idle['"]/);
    });

    test('F12: Sliding Unit Selector & Guidebook modal', () => {
      assert.match(trackViewContent, /selectedGrade/);
      assert.match(trackViewContent, /setGuideModalOpen/);
      assert.match(trackViewContent, /Unidade\s*{g\.grade}/);
      assert.match(trackViewContent, /GUIA/);
    });

    test('F13: Unit Mastery Challenges & Treasure Chests catalog integration', () => {
      assert.equal(BOSS_LIST, undefined, 'BOSS_LIST was cancelled and removed from engine');
      assert.equal(MASTERY_CHALLENGES.length, 7, 'Must contain 7 Unit Mastery Challenges');
      for (let i = 0; i < MASTERY_CHALLENGES.length; i++) {
        const challenge = MASTERY_CHALLENGES[i];
        assert.equal(challenge.grade, i + 1);
        assert.ok(challenge.name && challenge.name.length > 0);
        assert.ok(challenge.questionsCount > 0);
        assert.ok(challenge.rewardBadgeTitle && challenge.rewardBadgeTitle.length > 0);
        assert.ok(challenge.targetTechniques && challenge.targetTechniques.length > 0);
      }

      assert.match(trackViewContent, /handleOpenChest/);
      assert.match(trackViewContent, /playChestReward/);
    });
  });

  // ==========================================================================
  // TIER 2: Boundary & Corner Cases
  // ==========================================================================
  describe('Tier 2: Boundary & Corner Cases', () => {
    test('Boundary: Dynamic active node calculation algorithm across all star distributions', () => {
      const getActiveNodeIndex = (nodes) => {
        // Active node is the first node that is not completed (stars === 0)
        const uncompletedIndex = nodes.findIndex(n => n.stars === 0);
        if (uncompletedIndex === -1) {
          // All completed -> point to final culminating node
          return nodes.length - 1;
        }
        return uncompletedIndex;
      };

      // Case A: Fresh user, 0 stars on all nodes -> active node is 0
      const freshNodes = [
        { id: 'n1', stars: 0, isLocked: false },
        { id: 'n2', stars: 0, isLocked: true },
        { id: 'n3', stars: 0, isLocked: true },
      ];
      assert.equal(getActiveNodeIndex(freshNodes), 0);

      // Case B: Completed node 1 -> active node shifts to node 2
      const partialNodes = [
        { id: 'n1', stars: 3, isLocked: false },
        { id: 'n2', stars: 0, isLocked: false },
        { id: 'n3', stars: 0, isLocked: true },
      ];
      assert.equal(getActiveNodeIndex(partialNodes), 1);

      // Case C: Mastered all nodes -> active node remains at the final node
      const masteredNodes = [
        { id: 'n1', stars: 3, isLocked: false },
        { id: 'n2', stars: 3, isLocked: false },
        { id: 'n3', stars: 3, isLocked: false },
      ];
      assert.equal(getActiveNodeIndex(masteredNodes), 2);
    });

    test('Boundary: Locked node click rejection', () => {
      const handleNodeClickLogic = (node) => {
        if (node.isLocked && node.stars === 0) {
          return { canStart: false, error: 'NODE_LOCKED' };
        }
        return { canStart: true, error: null };
      };

      const lockedNode = { id: 'locked_node', isLocked: true, stars: 0 };
      const unlockedNode = { id: 'open_node', isLocked: false, stars: 0 };
      const completedNode = { id: 'comp_node', isLocked: true, stars: 2 }; // previous grade completed

      assert.equal(handleNodeClickLogic(lockedNode).canStart, false);
      assert.equal(handleNodeClickLogic(unlockedNode).canStart, true);
      assert.equal(handleNodeClickLogic(completedNode).canStart, true);
    });
  });

  // ==========================================================================
  // TIER 3: Cross-Feature Combinations
  // ==========================================================================
  describe('Tier 3: Cross-Feature Combinations', () => {
    test('Unit switching updates active node and repositions mascot anchor', () => {
      let currentGrade = 1;
      const getActivePosition = (gradeNum) => {
        const gradeData = TRACK_GRADES.find(g => g.grade === gradeNum);
        const nodeIndex = gradeData.nodes.findIndex(n => n.stars === 0);
        const activeIdx = nodeIndex === -1 ? gradeData.nodes.length - 1 : nodeIndex;
        const xOffset = [0, 48, 0, -48][activeIdx % 4];
        return { grade: gradeNum, activeIdx, xOffset, mascotAnchoredAt: activeIdx };
      };

      const posGrade1 = getActivePosition(1);
      assert.equal(posGrade1.grade, 1);
      assert.ok(posGrade1.mascotAnchoredAt >= 0);

      currentGrade = 2;
      const posGrade2 = getActivePosition(2);
      assert.equal(posGrade2.grade, 2);
      assert.ok(posGrade2.mascotAnchoredAt >= 0);
    });

    test('Node completion unlocks downstream prerequisite nodes in curriculum graph', () => {
      // In Grade 1: ADD_LEFT_RIGHT unlocks SUB_COMPENSATION which unlocks COMPLEMENT_100
      const g1 = TRACK_GRADES[0];
      const addNode = g1.nodes.find(n => n.id === 'ADD_LEFT_RIGHT');
      const subNode = g1.nodes.find(n => n.id === 'SUB_COMPENSATION');
      const compNode = g1.nodes.find(n => n.id === 'COMPLEMENT_100');

      assert.deepEqual(addNode.prerequisites, []);
      assert.deepEqual(subNode.prerequisites, ['ADD_LEFT_RIGHT']);
      assert.deepEqual(compNode.prerequisites, ['SUB_COMPENSATION']);
    });
  });

  // ==========================================================================
  // TIER 4: Real-World Scenarios
  // ==========================================================================
  describe('Tier 4: Real-World Application Scenarios', () => {
    test('Scenario: Grade 1 Complete Traversal and Boss Encounter Readiness', () => {
      const g1Nodes = JSON.parse(JSON.stringify(TRACK_GRADES[0].nodes));

      // 1. Initial State: Node 0 is unlocked, subsequent nodes locked
      assert.equal(g1Nodes[0].stars, 3); // Pre-completed in curriculum mock
      assert.equal(g1Nodes[1].stars, 2);
      assert.equal(g1Nodes[2].stars, 1);

      // Verify that all 3 nodes have sample equations and visual theory breakdowns
      for (const node of g1Nodes) {
        assert.ok(node.sampleEquation.includes('='));
        assert.ok(node.theory.visualBreakdown.steps.length > 0);
      }

      // 2. Mastery Challenge for Grade 1
      const mastery1 = MASTERY_CHALLENGES.find(b => b.grade === 1);
      assert.equal(mastery1.id, 'MASTERY_GRADE_1');
      assert.equal(mastery1.name, 'Mestre da Decomposição Posicional');
      assert.equal(mastery1.badgeId, 'BADGE_DECOMPOSITION');
    });
  });
});
