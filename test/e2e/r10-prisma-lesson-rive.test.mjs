/**
 * ==============================================================================
 * Test Suite: Prisma Mascote — Contexto Lição Híbrido Rive (.riv) & State Machine
 * File: test/e2e/r10-prisma-lesson-rive.test.mjs
 *
 * Verifies:
 * - Rive Lesson Project: rive/lesson/rive.yaml & scene.rml
 * - Compiled Binary Asset: public/mascot/prisma-lesson.riv (< 50 KB)
 * - Skeletal Hierarchy: RootBone SpineRoot, ChestBone, HeadBone, ArmBone
 * - Modular Anchors: Anchor_HeadTop & Anchor_Hand
 * - State Machine Architecture: PrismaLessonController (idle, thinking, correct, incorrect)
 * - React Component Contract: PrismaLessonMascot.tsx with fallback to PrismaMascotWeb
 * - 80/20% Playbook Documentation: rive/lesson/PLAYBOOK_80_20.md
 * - Live Studio Integration: public/mascot-viewer.html Context Switcher
 * ==============================================================================
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const RIVE_YAML_PATH = path.join(ROOT_DIR, 'rive', 'lesson', 'rive.yaml');
const RIVE_RML_PATH = path.join(ROOT_DIR, 'rive', 'lesson', 'scene.rml');
const RIVE_COMPILED_PATH = path.join(ROOT_DIR, 'public', 'mascot', 'prisma-lesson.riv');
const RIVE_COMPONENT_PATH = path.join(ROOT_DIR, 'src', 'components', 'PrismaLessonMascot.tsx');
const RIVE_COMPONENT_REEXPORT = path.join(ROOT_DIR, 'src', 'components', 'mascot', 'PrismaLessonMascot.tsx');
const PLAYBOOK_PATH = path.join(ROOT_DIR, 'rive', 'lesson', 'PLAYBOOK_80_20.md');
const VIEWER_PATH = path.join(ROOT_DIR, 'public', 'mascot-viewer.html');
const ASSETS_DIR = path.join(ROOT_DIR, 'rive', 'lesson', 'assets');

describe('R10: Prisma Mascote — Contexto Lição Rive (.riv) & State Machine', () => {

  // ==========================================================================
  // TIER 1: Rive Project & Skeletal RML Architecture
  // ==========================================================================
  describe('Tier 1: Workspace, Esqueleto & RML Architecture', () => {
    test('Rive project config exists and is named prisma-lesson', () => {
      assert.ok(fs.existsSync(RIVE_YAML_PATH), 'rive/lesson/rive.yaml must exist');
      const yamlContent = fs.readFileSync(RIVE_YAML_PATH, 'utf-8');
      assert.match(yamlContent, /name:\s*prisma-lesson/);
    });

    test('Rive scene.rml defines Artboard, StateMachine PrismaLessonController e inputs tipados', () => {
      assert.ok(fs.existsSync(RIVE_RML_PATH), 'rive/lesson/scene.rml must exist');
      const rml = fs.readFileSync(RIVE_RML_PATH, 'utf-8');

      assert.match(rml, /<Artboard[^>]*name="PrismaLessonArtboard"/);
      assert.match(rml, /<StateMachine[^>]*name="PrismaLessonController"/);
      assert.match(rml, /<StateMachineNumber[^>]*name="state"/);
      assert.match(rml, /<StateMachineTrigger[^>]*name="triggerCorrect"/);
      assert.match(rml, /<StateMachineTrigger[^>]*name="triggerIncorrect"/);
      assert.match(rml, /<StateMachineBool[^>]*name="showMathOrbit"/);
    });

    test('Rive scene.rml implementa hierarquia de ossos (Bones) e ancoragens modulares (Anchors)', () => {
      const rml = fs.readFileSync(RIVE_RML_PATH, 'utf-8');

      // Ossos do esqueleto
      assert.match(rml, /<RootBone[^>]*name="SpineRoot"/);
      assert.match(rml, /<Bone[^>]*name="ChestBone"/);
      assert.match(rml, /<Bone[^>]*name="HeadBone"/);
      assert.match(rml, /<Bone[^>]*name="ArmBone"/);

      // Pontos de ancoragem modulares
      assert.match(rml, /<Node[^>]*name="Anchor_HeadTop"/);
      assert.match(rml, /<Node[^>]*name="Anchor_Hand"/);

      // Adereços desacoplados
      assert.match(rml, /<Node[^>]*name="QuestionMarkGroup"/);
      assert.match(rml, /<Node[^>]*name="MathOrbitGroup"/);
    });

    test('Rive scene.rml contém as 4 animações canônicas de lição', () => {
      const rml = fs.readFileSync(RIVE_RML_PATH, 'utf-8');
      assert.match(rml, /name="idle"/);
      assert.match(rml, /name="thinking"/);
      assert.match(rml, /name="correct"/);
      assert.match(rml, /name="incorrect"/);
    });
  });

  // ==========================================================================
  // TIER 2: Binary Asset Integrity & Underlap Camadas
  // ==========================================================================
  describe('Tier 2: Integridade do Ativo Binário e Camadas com Underlap', () => {
    test('public/mascot/prisma-lesson.riv existe e cumpre o orçamento rígido (< 50 KB)', () => {
      assert.ok(fs.existsSync(RIVE_COMPILED_PATH), 'public/mascot/prisma-lesson.riv must exist');
      const stats = fs.statSync(RIVE_COMPILED_PATH);
      assert.ok(stats.size > 5000, 'prisma-lesson.riv must be a valid binary > 5KB');
      assert.ok(stats.size < 50000, `prisma-lesson.riv must be < 50 KB, got ${stats.size} bytes`);
    });

    test('Camadas anatômicas com underlap anti-frestas existem em rive/lesson/assets/', () => {
      const requiredAssets = [
        'layer_body.png',
        'layer_arm.png',
        'layer_pupil_left.png',
        'layer_pupil_right.png',
        'layer_tail.png',
        'prop_question.png'
      ];

      for (const asset of requiredAssets) {
        const p = path.join(ASSETS_DIR, asset);
        assert.ok(fs.existsSync(p), `Asset ${asset} must exist in rive/lesson/assets/`);
        const stats = fs.statSync(p);
        assert.ok(stats.size > 500, `Asset ${asset} must not be empty`);
      }
    });
  });

  // ==========================================================================
  // TIER 3: React Component Integration & Graceful Fallback
  // ==========================================================================
  describe('Tier 3: Componente React PrismaLessonMascot & Fallback', () => {
    test('PrismaLessonMascot exporta componente e tipos', () => {
      assert.ok(fs.existsSync(RIVE_COMPONENT_PATH), 'src/components/PrismaLessonMascot.tsx must exist');
      assert.ok(fs.existsSync(RIVE_COMPONENT_REEXPORT), 'src/components/mascot/PrismaLessonMascot.tsx must exist');
      const src = fs.readFileSync(RIVE_COMPONENT_PATH, 'utf-8');

      assert.match(src, /export\s+type\s+PrismaLessonState/);
      assert.match(src, /export\s+interface\s+PrismaLessonMascotProps/);
      assert.match(src, /export\s+const\s+PrismaLessonMascot/);
      assert.match(src, /useRive/);
      assert.match(src, /useStateMachineInput/);
    });

    test('PrismaLessonMascot mapeia os estados contextuais e suporte a fallbackToSvg', () => {
      const src = fs.readFileSync(RIVE_COMPONENT_PATH, 'utf-8');
      assert.match(src, /PrismaLessonController/);
      assert.match(src, /prisma-lesson\.riv/);
      assert.match(src, /triggerCorrect/);
      assert.match(src, /triggerIncorrect/);
      assert.match(src, /showMathOrbit/);
      assert.match(src, /fallbackToSvg/);
      assert.match(src, /<PrismaMascotWeb/);
    });
  });

  // ==========================================================================
  // TIER 4: Playbook 80/20% & Studio Viewer
  // ==========================================================================
  describe('Tier 4: Playbook 80/20% & Visualizador Interativo', () => {
    test('Playbook 80/20% documenta o fluxo de rigging e curvas elásticas', () => {
      assert.ok(fs.existsSync(PLAYBOOK_PATH), 'PLAYBOOK_80_20.md must exist');
      const content = fs.readFileSync(PLAYBOOK_PATH, 'utf-8');
      assert.match(content, /80\/20%/);
      assert.match(content, /Bind to Bones/);
      assert.match(content, /Spring/);
    });

    test('mascot-viewer.html suporta alternância para o contexto de lição (prisma-lesson.riv)', () => {
      assert.ok(fs.existsSync(VIEWER_PATH), 'public/mascot-viewer.html must exist');
      const html = fs.readFileSync(VIEWER_PATH, 'utf-8');
      assert.match(html, /prisma-lesson\.riv/);
      assert.match(html, /PrismaLessonController/);
      assert.match(html, /switchRiveContext/);
      assert.match(html, /toggleMathOrbit/);
    });
  });
});
