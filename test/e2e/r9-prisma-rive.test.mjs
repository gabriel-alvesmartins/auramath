/**
 * ==============================================================================
 * Test Suite: Prisma Mascote — Pipeline Rive Nativo (.riv) & State Machine
 * File: test/e2e/r9-prisma-rive.test.mjs
 *
 * Verifies:
 * - Rive Project Workspace: rive/prisma/rive.yaml & scene.rml
 * - Compiled Binary Asset: public/mascot/prisma.riv (~4.9 KB, highly optimized)
 * - State Machine Architecture: PrismaController with inputs `state` & `triggerEureka`
 * - React Component Contract: PrismaMascotRive.tsx with fallback to PrismaMascotWeb
 * - Offline Vendor Assets: public/vendor/rive/rive.js & rive.wasm
 * - Live Studio Integration: public/mascot-viewer.html Tab 4 (Rive Runtime Interativo)
 * ==============================================================================
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const RIVE_YAML_PATH = path.join(ROOT_DIR, 'rive', 'prisma', 'rive.yaml');
const RIVE_RML_PATH = path.join(ROOT_DIR, 'rive', 'prisma', 'scene.rml');
const RIVE_COMPILED_PATH = path.join(ROOT_DIR, 'public', 'mascot', 'prisma.riv');
const RIVE_COMPONENT_PATH = path.join(ROOT_DIR, 'src', 'components', 'PrismaMascotRive.tsx');
const VIEWER_PATH = path.join(ROOT_DIR, 'public', 'mascot-viewer.html');
const VENDOR_RIVE_JS = path.join(ROOT_DIR, 'public', 'vendor', 'rive', 'rive.js');
const VENDOR_RIVE_WASM = path.join(ROOT_DIR, 'public', 'vendor', 'rive', 'rive.wasm');

describe('R9: Prisma Mascote — Pipeline Rive Nativo (.riv) & State Machine', () => {

  // ==========================================================================
  // TIER 1: Rive Project & Markup Structure
  // ==========================================================================
  describe('Tier 1: Rive Workspace & RML Architecture', () => {
    test('Rive project config exists and is named prisma', () => {
      assert.ok(fs.existsSync(RIVE_YAML_PATH), 'rive/prisma/rive.yaml must exist');
      const yamlContent = fs.readFileSync(RIVE_YAML_PATH, 'utf-8');
      assert.match(yamlContent, /name:\s*prisma/);
    });

    test('Rive scene.rml defines Artboard, StateMachine PrismaController and required inputs', () => {
      assert.ok(fs.existsSync(RIVE_RML_PATH), 'rive/prisma/scene.rml must exist');
      const rml = fs.readFileSync(RIVE_RML_PATH, 'utf-8');

      assert.match(rml, /<Artboard[^>]*name="PrismaMascot"/);
      assert.match(rml, /<StateMachine[^>]*name="PrismaController"/);
      assert.match(rml, /<StateMachineNumber[^>]*name="state"/);
      assert.match(rml, /<StateMachineTrigger[^>]*name="triggerEureka"/);
    });

    test('Rive scene.rml contains all 5 canonical timelines', () => {
      const rml = fs.readFileSync(RIVE_RML_PATH, 'utf-8');
      assert.match(rml, /name="idle"/);
      assert.match(rml, /name="thinking"/);
      assert.match(rml, /name="eureka"/);
      assert.match(rml, /name="supernova"/);
      assert.match(rml, /name="hint"/);
    });
  });

  // ==========================================================================
  // TIER 2: Binary Asset Integrity
  // ==========================================================================
  describe('Tier 2: Binary Asset Integrity', () => {
    test('public/mascot/prisma.riv is compiled and exists as a lightweight binary (< 50 KB)', () => {
      assert.ok(fs.existsSync(RIVE_COMPILED_PATH), 'public/mascot/prisma.riv must exist');
      const stats = fs.statSync(RIVE_COMPILED_PATH);
      assert.ok(stats.size > 1000, 'prisma.riv must be a valid non-empty binary');
      assert.ok(stats.size < 50000, `prisma.riv should be lightweight, got ${stats.size} bytes`);
    });

    test('Local vendor assets (rive.js and rive.wasm) exist for offline resilience', () => {
      assert.ok(fs.existsSync(VENDOR_RIVE_JS), 'public/vendor/rive/rive.js must exist');
      assert.ok(fs.existsSync(VENDOR_RIVE_WASM), 'public/vendor/rive/rive.wasm must exist');
    });
  });

  // ==========================================================================
  // TIER 3: React Component Integration & Graceful Fallback
  // ==========================================================================
  describe('Tier 3: React Component & Graceful Fallback', () => {
    test('PrismaMascotRive exports component and TypeScript props', () => {
      assert.ok(fs.existsSync(RIVE_COMPONENT_PATH), 'src/components/PrismaMascotRive.tsx must exist');
      const src = fs.readFileSync(RIVE_COMPONENT_PATH, 'utf-8');

      assert.match(src, /export\s+interface\s+PrismaMascotRiveProps/);
      assert.match(src, /export\s+const\s+PrismaMascotRive/);
      assert.match(src, /@rive-app\/react-canvas/);
      assert.match(src, /useRive/);
      assert.match(src, /useStateMachineInput/);
    });

    test('PrismaMascotRive maps states to PrismaController inputs and supports fallbackToSvg', () => {
      const src = fs.readFileSync(RIVE_COMPONENT_PATH, 'utf-8');
      assert.match(src, /PrismaController/);
      assert.match(src, /stateInput\.value/);
      assert.match(src, /triggerEureka/);
      assert.match(src, /fallbackToSvg/);
      assert.match(src, /<PrismaMascotWeb/);
    });
  });

  // ==========================================================================
  // TIER 4: Studio Mascot Viewer Integration
  // ==========================================================================
  describe('Tier 4: Studio Mascot Viewer Integration', () => {
    test('mascot-viewer.html features Tab 4 Rive Runtime Interativo (.riv)', () => {
      const html = fs.readFileSync(VIEWER_PATH, 'utf-8');
      assert.match(html, /4\.\s*Rive\s*Runtime\s*Interativo\s*\(\.riv\)/);
      assert.match(html, /id="tab-rive-player"/);
      assert.match(html, /id="rive-canvas"/);
      assert.match(html, /vendor\/rive\/rive\.js/);
      assert.match(html, /setRiveState/);
      assert.match(html, /triggerRiveEureka/);
    });
  });
});
