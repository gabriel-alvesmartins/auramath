/**
 * ==============================================================================
 * Empirical Adversarial Stress Test for Milestone M3 (TrackView & Serpentine Track)
 * Author: reviewer_m3_1 (Reviewer & Adversarial Critic)
 *
 * This test does NOT rely on regex or duplicated code:
 * It bundles src/views/TrackView.tsx with esbuild and tests the REAL module exports
 * and SSR-rendered DOM structures under standard and adversarial edge cases.
 * ==============================================================================
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { TRACK_GRADES, BOSS_LIST } from '../../../packages/engine/dist/index.js';

const ROOT_DIR = path.resolve(process.cwd());
const TEMP_BUNDLE = path.join(ROOT_DIR, '.agents', 'teamwork', 'reviewer_m3_1', 'temp_track_view_bundle.mjs');

let trackViewModule;

describe('Adversarial Critic Empirical Stress Testing of TrackView (M3)', () => {
  before(async () => {
    // Compile TrackView.tsx to standalone ESM bundle using esbuild
    esbuild.buildSync({
      entryPoints: [path.join(ROOT_DIR, 'src', 'views', 'TrackView.tsx')],
      bundle: true,
      platform: 'node',
      format: 'esm',
      external: [
        'react',
        'react-dom',
        'react-dom/server',
        'lucide-react',
        'canvas-confetti',
      ],
      outfile: TEMP_BUNDLE,
    });

    const fileUrl = 'file:///' + TEMP_BUNDLE.replace(/\\/g, '/');
    trackViewModule = await import(fileUrl);
  });

  after(() => {
    if (fs.existsSync(TEMP_BUNDLE)) {
      fs.unlinkSync(TEMP_BUNDLE);
    }
  });

  // ============================================================================
  // SUITE 1: Actual Exported Function Validation (Testing Real Module, not clones)
  // ============================================================================
  describe('1. Actual Module Exports & Invariants', () => {
    test('TrackView module exports canonical functions and components', () => {
      assert.ok(trackViewModule.TrackView, 'TrackView component must be exported');
      assert.ok(trackViewModule.getNodeOffset, 'getNodeOffset must be exported');
      assert.ok(trackViewModule.getMascotOrientation, 'getMascotOrientation must be exported');
      assert.ok(trackViewModule.findActiveNode, 'findActiveNode must be exported');
      assert.ok(trackViewModule.findActiveNodeIndex, 'findActiveNodeIndex must be exported');
      assert.ok(trackViewModule.getGradeBoss, 'getGradeBoss must be exported');
      assert.ok(trackViewModule.getChestPlacement, 'getChestPlacement must be exported');
      assert.ok(Array.isArray(trackViewModule.DEFAULT_MASCOT_SPEECHES), 'DEFAULT_MASCOT_SPEECHES must be exported array');
    });

    test('getNodeOffset adheres to 4-phase sequence [-48 to +48]', () => {
      const { getNodeOffset } = trackViewModule;
      const expected = [0, 48, 0, -48];
      for (let i = 0; i < 20; i++) {
        assert.equal(getNodeOffset(i), expected[i % 4]);
      }
    });

    test('getMascotOrientation handles positive, negative, and zero offsets', () => {
      const { getMascotOrientation } = trackViewModule;
      assert.equal(getMascotOrientation(48), 'left');
      assert.equal(getMascotOrientation(1), 'left');
      assert.equal(getMascotOrientation(0), 'right');
      assert.equal(getMascotOrientation(-48), 'right');
      assert.equal(getMascotOrientation(-1), 'right');
    });

    test('findActiveNode & findActiveNodeIndex across all grades and progressions', () => {
      const { findActiveNode, findActiveNodeIndex } = trackViewModule;

      for (const grade of TRACK_GRADES) {
        // 1. Fresh state
        const fresh = findActiveNode(grade.nodes, {});
        assert.equal(fresh?.id, grade.nodes[0].id);
        assert.equal(findActiveNodeIndex(grade.nodes, {}), 0);

        // 2. Completed all
        const completeProgress = {};
        for (const n of grade.nodes) {
          completeProgress[n.id] = { completed: true, stars: 3 };
        }
        const completeNode = findActiveNode(grade.nodes, completeProgress);
        assert.equal(completeNode, null);
        assert.equal(findActiveNodeIndex(grade.nodes, completeProgress), grade.nodes.length - 1);
      }
    });

    test('getGradeBoss matches all 6 grades in BOSS_LIST', () => {
      const { getGradeBoss } = trackViewModule;
      for (let g = 1; g <= 6; g++) {
        const boss = getGradeBoss(g);
        assert.ok(boss, `Grade ${g} must have a boss`);
        assert.equal(boss.grade, g);
      }
    });
  });

  // ============================================================================
  // SUITE 2: SSR DOM Rendering & Contract Adherence
  // ============================================================================
  describe('2. Real Component SSR DOM Verification', () => {
    test('TrackView renders all 6 Grade tabs in unit-selector-bar', () => {
      const { TrackView } = trackViewModule;
      const noop = () => {};

      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TrackView, { onStartLesson: noop })
      );

      for (let g = 1; g <= 6; g++) {
        assert.ok(html.includes(`Unidade ${g}`), `Must contain tab for Unidade ${g}`);
      }
    });

    test('TrackView renders Grade 1 unit header banner and pedagogy info', () => {
      const { TrackView } = trackViewModule;
      const noop = () => {};

      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TrackView, { onStartLesson: noop, initialGrade: 1 })
      );

      assert.ok(html.includes('unit-header-banner'));
      assert.ok(html.includes('Fluxo Esquerda-Direita'));
      assert.ok(html.includes('GUIA'));
    });

    test('TrackView renders TrackSerpentineNode for every node in Grade 1', () => {
      const { TrackView } = trackViewModule;
      const noop = () => {};

      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TrackView, { onStartLesson: noop, initialGrade: 1 })
      );

      const g1 = TRACK_GRADES[0];
      for (const node of g1.nodes) {
        assert.ok(html.includes(`node-${node.id}`), `Must render wrapper for node-${node.id}`);
        assert.ok(html.includes(node.title), `Must render title for ${node.title}`);
      }
    });

    test('TrackView anchors mascot beside the active node in fresh state', () => {
      const { TrackView } = trackViewModule;
      const noop = () => {};

      // In fresh state (no progress passed), default mock progress in TrackView marks ADD_LEFT_RIGHT complete, so node 1 is active
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TrackView, {
          onStartLesson: noop,
          initialGrade: 1,
          nodeProgress: {}, // truly fresh state
        })
      );

      assert.ok(html.includes('active-mascot-anchor'), 'Must render active mascot anchor');
      assert.ok(html.includes('Vamos treinar!'), 'Must include mascot speech');
    });

    test('TrackView positions mascot on LEFT when active node has positive xOffset', () => {
      const { TrackView } = trackViewModule;
      const noop = () => {};

      // Node index 1 has xOffset = +48px. Mascot must have class active-mascot-left and left: -115px
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TrackView, {
          onStartLesson: noop,
          initialGrade: 1,
          nodeProgress: {
            ADD_LEFT_RIGHT: { completed: true, stars: 3 }, // Node 0 complete -> Node 1 is active (xOffset = 48)
          },
        })
      );

      assert.ok(html.includes('active-mascot-left'), 'Must have active-mascot-left class for positive offset');
      assert.ok(html.includes('left:-115px'), 'Must have left:-115px inline style to prevent right clipping');
    });

    test('TrackView renders Cosmic Chest with audio hook and collected status', () => {
      const { TrackView } = trackViewModule;
      const noop = () => {};

      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TrackView, { onStartLesson: noop, initialGrade: 1 })
      );

      assert.ok(html.includes('cosmic-chest-intercalation'));
      assert.ok(html.includes('cosmic_chest.jpg'));
      assert.ok(html.includes('Abrir Baú 🎁'));
    });

    test('TrackView renders Culminating Boss Castle node for Chronos in Grade 1', () => {
      const { TrackView } = trackViewModule;
      const noop = () => {};

      // Not fully complete -> Boss locked
      const htmlLocked = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TrackView, {
          onStartLesson: noop,
          initialGrade: 1,
          nodeProgress: {},
        })
      );

      assert.ok(htmlLocked.includes('boss-castle-waypoint'));
      assert.ok(htmlLocked.includes('Chronos, o Guardião do Fluxo'));
      assert.ok(htmlLocked.includes('BLOQUEADO'));

      // Fully complete -> Boss unlocked
      const completeProgress = {
        ADD_LEFT_RIGHT: { completed: true, stars: 3 },
        SUB_COMPENSATION: { completed: true, stars: 3 },
        COMPLEMENT_100: { completed: true, stars: 3 },
      };
      const htmlUnlocked = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TrackView, {
          onStartLesson: noop,
          initialGrade: 1,
          nodeProgress: completeProgress,
        })
      );

      assert.ok(htmlUnlocked.includes('ARCANO'), 'Boss should display ARCANO when unlocked');
      assert.ok(htmlUnlocked.includes('boss-mascot-socket'), 'Mascot anchors to boss socket when all grade nodes complete');
    });
  });

  // ============================================================================
  // SUITE 3: Adversarial Edge Cases & Stress Scenarios
  // ============================================================================
  describe('3. Adversarial Edge Cases & Robustness', () => {
    test('Robustness: Empty nodes array does not crash TrackView', () => {
      const { findActiveNode, findActiveNodeIndex } = trackViewModule;
      assert.equal(findActiveNode([], {}), null);
      assert.equal(findActiveNodeIndex([], {}), -1);
    });

    test('Robustness: Malformed nodeProgress with non-boolean completed flag', () => {
      const { findActiveNode } = trackViewModule;
      const grade1Nodes = TRACK_GRADES[0].nodes;

      // Malformed progress object
      const malformedProgress = {
        ADD_LEFT_RIGHT: { completed: 'truthy_string' },
      };
      // Truthy string is treated as completed in JS boolean check
      const active = findActiveNode(grade1Nodes, malformedProgress);
      assert.equal(active?.id, 'SUB_COMPENSATION');
    });

    test('Robustness: Rendering Grade 2, 3, 4, 5, 6 with varying node counts', () => {
      const { TrackView } = trackViewModule;
      const noop = () => {};

      for (let g = 1; g <= 6; g++) {
        const html = ReactDOMServer.renderToStaticMarkup(
          React.createElement(TrackView, {
            onStartLesson: noop,
            initialGrade: g,
            nodeProgress: {},
          })
        );
        assert.ok(html.includes(`Unidade ${g}`));
        assert.ok(html.includes('boss-castle-waypoint'));
      }
    });

    test('Invariant: Dual theme token usage throughout CSS declarations', () => {
      const { TrackView } = trackViewModule;
      const noop = () => {};
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TrackView, { onStartLesson: noop })
      );

      assert.ok(html.includes('var(--color-bg-base)'));
      assert.ok(html.includes('var(--color-bg-surface)'));
      assert.ok(html.includes('var(--color-text-primary)'));
      assert.ok(html.includes('var(--color-brand)'));
      assert.ok(html.includes('var(--color-gold)'));
    });
  });
});
