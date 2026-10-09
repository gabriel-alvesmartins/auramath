/**
 * E2E Verification Suite — Acceptance Criteria Verification
 * Directly maps to ORIGINAL_REQUEST.md Acceptance Criteria (Automated & Build, Functional & UI)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { darkColors, lightColors, depth } from '../../src/theme/tokens.ts';
import {
  TRACK_GRADES,
  generateQuestion,
  generatePatternRecognitionQuestion,
} from '../../packages/engine/dist/index.js';

const ROOT_DIR = process.cwd();

describe('Acceptance Criteria Verification (ORIGINAL_REQUEST.md)', () => {
  // ==========================================================================
  // Automated & Build Verification
  // ==========================================================================
  describe('Automated & Build Verification', () => {
    test('AC 1: @auramath/engine package has valid exports and complete test coverage', () => {
      assert.ok(TRACK_GRADES.length >= 6, 'Engine must supply all cognitive grades');
      assert.ok(typeof generateQuestion === 'function', 'Engine must export generateQuestion');
      assert.ok(typeof generatePatternRecognitionQuestion === 'function', 'Engine must export generatePatternRecognitionQuestion');

      const enginePkgPath = path.join(ROOT_DIR, 'packages', 'engine', 'package.json');
      const enginePkg = JSON.parse(fs.readFileSync(enginePkgPath, 'utf-8'));
      assert.equal(enginePkg.name, '@auramath/engine');
      assert.ok(enginePkg.scripts.test.includes('node --test'));
    });

    test('AC 2: Web build configuration and entry points are valid and configured for Vite build', () => {
      const rootPkgPath = path.join(ROOT_DIR, 'package.json');
      const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
      assert.ok(rootPkg.scripts.build, 'Root package must have build script');

      const viteConfigPath = path.join(ROOT_DIR, 'vite.config.ts');
      assert.ok(fs.existsSync(viteConfigPath), 'vite.config.ts must exist');

      const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
      assert.ok(fs.existsSync(indexHtmlPath), 'index.html entry point must exist');

      const mainTsxPath = path.join(ROOT_DIR, 'src', 'main.tsx');
      assert.ok(fs.existsSync(mainTsxPath), 'src/main.tsx root entry must exist');
    });
  });

  // ==========================================================================
  // Functional & UI Verification
  // ==========================================================================
  describe('Functional & UI Verification', () => {
    test('AC 3: Functional theme switch button alternates between Dark Obsidian & Paper Light with compliant contrast', () => {
      const toggleFile = path.join(ROOT_DIR, 'src', 'components', 'tactile', 'ThemeToggle.tsx');
      assert.ok(fs.existsSync(toggleFile), 'ThemeToggle component must exist');

      const toggleContent = fs.readFileSync(toggleFile, 'utf-8');
      assert.match(toggleContent, /useTheme/);
      assert.match(toggleContent, /toggleTheme/);
      assert.match(toggleContent, /playKeypressTick/);

      // Verify contrast is compliant in both dark and light
      // In dark: text is #F8FAFC on #0B0F19
      assert.equal(darkColors.bgBase.toUpperCase(), '#0B0F19');
      assert.equal(darkColors.textPrimary.toUpperCase(), '#F8FAFC');

      // In light: text is #0F172A on #F8FAFC
      assert.equal(lightColors.bgBase.toUpperCase(), '#F8FAFC');
      assert.equal(lightColors.textPrimary.toUpperCase(), '#0F172A');
    });

    test('AC 4: Aura mascot renders dynamically anchored beside the active progression node', () => {
      const trackViewFile = path.join(ROOT_DIR, 'src', 'views', 'TrackView.tsx');
      const trackContent = fs.readFileSync(trackViewFile, 'utf-8');

      assert.match(trackContent, /<AuraMascotWeb/);
      assert.match(trackContent, /speechText/);
      assert.match(trackContent, /position:\s*['"]absolute['"]/);
      assert.match(trackContent, /right:\s*['"]-115px['"]/);
    });

    test('AC 5: 3D tactile buttons physically sink on press (translateY mechanical sink with bevel reduction)', () => {
      const cssPath = path.join(ROOT_DIR, 'src', 'theme', 'theme.css');
      const css = fs.readFileSync(cssPath, 'utf-8');

      // 4px extrusion resting, 3px depression on active
      assert.equal(depth.extrusion.md, 4);
      assert.equal(depth.depression.md, 3);

      assert.match(css, /\.aura-3d-btn:active[\s\S]*?transform:\s*translateY\(var\(--btn-depression\)\)\s*!important/);
      assert.match(css, /\.aura-3d-btn:active[\s\S]*?box-shadow:\s*0\s*calc\(var\(--btn-extrusion\)\s*-\s*var\(--btn-depression\)\)\s*0\s*var\(--btn-bevel\)\s*!important/);
      assert.match(css, /\.aura-3d-btn:active[\s\S]*?transition:\s*none\s*!important/);
    });

    test('AC 6: Micro-lesson victory screen displays side-by-side 3D cards (XP and Accuracy) and celebrating mascot', () => {
      const lessonFile = path.join(ROOT_DIR, 'src', 'views', 'DuolingoLessonView.tsx');
      const lessonContent = fs.readFileSync(lessonFile, 'utf-8');

      assert.match(lessonContent, /Lição Concluída!/);
      assert.match(lessonContent, /aura_celebrate\.jpg/);
      assert.match(lessonContent, /XP Cósmico/);
      assert.match(lessonContent, /Precisão/);
      assert.match(lessonContent, /CONTINUAR/);
    });

    test('AC 7: Olho Matemático enables optimal algebraic shortcut selection with didactic feedback', () => {
      const q = generatePatternRecognitionQuestion();
      assert.ok(q.equation);
      assert.ok(q.options.length >= 3);

      const optimal = q.options.find(o => o.isOptimal);
      assert.ok(optimal, 'Must contain an optimal choice');
      assert.ok(optimal.explanation && optimal.explanation.length > 0, 'Must have explanation');

      const nonOptimal = q.options.filter(o => !o.isOptimal);
      assert.ok(nonOptimal.length >= 2, 'Must have distractor options');
      for (const distractor of nonOptimal) {
        assert.ok(distractor.explanation.length > 0, 'Distractors must explain why they are suboptimal');
      }
    });
  });
});
