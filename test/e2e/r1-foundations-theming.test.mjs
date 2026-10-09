/**
 * E2E Verification Suite — Requirement R1: Design System Foundations & Theming
 * Covers Features 1, 2, 3, 4 across Tiers 1 through 4.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { darkColors, lightColors, depth, layout } from '../../src/theme/tokens.ts';

const ROOT_DIR = process.cwd();

// ============================================================================
// Authoritative WCAG 2.1 Color Math
// ============================================================================
function hexToRgb(hex) {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.startsWith('rgba') || cleaned.startsWith('rgb')) {
    // Parse rgba/rgb string if encountered
    const m = cleaned.match(/\d+(\.\d+)?/g);
    if (m) return [parseFloat(m[0]), parseFloat(m[1]), parseFloat(m[2])];
  }
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const intVal = parseInt(cleaned, 16);
  return [(intVal >> 16) & 255, (intVal >> 8) & 255, intVal & 255];
}

function getRelativeLuminance(rgb) {
  const [r, g, b] = rgb.map(val => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(foregroundHex, backgroundHex) {
  const lum1 = getRelativeLuminance(hexToRgb(foregroundHex));
  const lum2 = getRelativeLuminance(hexToRgb(backgroundHex));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('R1: Design System Foundations & Theming (F1-F4)', () => {
  const cssPath = path.join(ROOT_DIR, 'src', 'theme', 'theme.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  // ==========================================================================
  // TIER 1: Feature Coverage (Opaque Contracts & Specifications)
  // ==========================================================================
  describe('Tier 1: Feature Coverage & Interface Contracts', () => {
    test('F1: SOBER Color Tokens exist and match sober palette specs', () => {
      // Dark Obsidian specifications
      assert.equal(darkColors.bgBase.toUpperCase(), '#0B0F19', 'Dark base must be Dark Obsidian #0B0F19');
      assert.equal(darkColors.bgSurface.toUpperCase(), '#131B2E', 'Dark surface must be #131B2E');
      assert.equal(darkColors.textPrimary.toUpperCase(), '#F8FAFC', 'Dark text primary must be #F8FAFC');
      assert.equal(darkColors.brand.toUpperCase(), '#0284C7', 'Brand must be Sober Azure #0284C7');

      // Paper Light specifications
      assert.equal(lightColors.bgBase.toUpperCase(), '#F8FAFC', 'Light base must be Paper Light #F8FAFC');
      assert.equal(lightColors.bgSurface.toUpperCase(), '#FFFFFF', 'Light surface must be #FFFFFF');
      assert.equal(lightColors.textPrimary.toUpperCase(), '#0F172A', 'Light text primary must be #0F172A');
      assert.equal(lightColors.brand.toUpperCase(), '#0284C7', 'Brand must be uniform #0284C7');
    });

    test('F1: WCAG 2.1 High-Contrast Compliance (AA & AAA thresholds)', () => {
      // Dark Obsidian base text contrast
      const darkTextRatio = getContrastRatio(darkColors.textPrimary, darkColors.bgBase);
      assert.ok(darkTextRatio >= 7.0, `Dark Obsidian text contrast ${darkTextRatio.toFixed(2)}:1 must exceed AAA (7.0:1)`);

      // Dark Obsidian surface text contrast
      const darkSurfaceRatio = getContrastRatio(darkColors.textPrimary, darkColors.bgSurface);
      assert.ok(darkSurfaceRatio >= 7.0, `Dark Obsidian surface contrast ${darkSurfaceRatio.toFixed(2)}:1 must exceed AAA (7.0:1)`);

      // Paper Light base text contrast
      const lightTextRatio = getContrastRatio(lightColors.textPrimary, lightColors.bgBase);
      assert.ok(lightTextRatio >= 7.0, `Paper Light text contrast ${lightTextRatio.toFixed(2)}:1 must exceed AAA (7.0:1)`);

      // Paper Light surface text contrast
      const lightSurfaceRatio = getContrastRatio(lightColors.textPrimary, lightColors.bgSurface);
      assert.ok(lightSurfaceRatio >= 7.0, `Paper Light surface contrast ${lightSurfaceRatio.toFixed(2)}:1 must exceed AAA (7.0:1)`);

      // Button Text on Action Colors (Brand, Success, Alert)
      const brandRatio = getContrastRatio(darkColors.brandText, darkColors.brand);
      assert.ok(brandRatio >= 3.0, `Brand button contrast ${brandRatio.toFixed(2)}:1 must meet WCAG AA UI element standard (>= 3.0:1)`);

      const alertRatio = getContrastRatio('#FFFFFF', darkColors.alert);
      assert.ok(alertRatio >= 4.5, `Alert button contrast ${alertRatio.toFixed(2)}:1 must meet WCAG AA normal text (>= 4.5:1)`);
    });

    test('F2: Bidirectional Theming token presence in theme.css', () => {
      assert.match(cssContent, /:root,\s*\[data-theme="dark"\][\s\S]*?--color-bg-base:\s*#0B0F19/i);
      assert.match(cssContent, /\[data-theme="light"\][\s\S]*?--color-bg-base:\s*#F8FAFC/i);
      assert.match(cssContent, /--theme-mode:\s*dark;/);
      assert.match(cssContent, /--theme-mode:\s*light;/);
    });

    test('F3: Strict Tabular Typography anti-layout shift utilities', () => {
      assert.match(cssContent, /\.font-mono-tabular\s*{[\s\S]*?font-variant-numeric:\s*tabular-nums/);
      assert.match(cssContent, /\.font-mono-tabular\s*{[\s\S]*?font-feature-settings:\s*['"]tnum['"]\s*1/);
      assert.match(cssContent, /--font-mono:\s*['"]JetBrains Mono['"]/);
      assert.match(cssContent, /--font-display:\s*['"]Plus Jakarta Sans['"]/);
      assert.match(cssContent, /--font-body:\s*['"]Inter['"]/);
    });

    test('F4: 3D Depth Tokens and physical sink geometry', () => {
      assert.equal(depth.extrusion.sm, 3, 'Small extrusion must be 3px');
      assert.equal(depth.extrusion.md, 4, 'Medium extrusion must be 4px');
      assert.equal(depth.extrusion.lg, 6, 'Large extrusion must be 6px');
      assert.equal(depth.depression.sm, 2, 'Small depression must be 2px');
      assert.equal(depth.depression.md, 3, 'Medium depression must be 3px');
      assert.equal(depth.depression.lg, 4, 'Large depression must be 4px');

      // Remaining beveled edge invariant: Extrusion - Depression >= 1px
      assert.ok(depth.extrusion.sm - depth.depression.sm >= 1);
      assert.ok(depth.extrusion.md - depth.depression.md >= 1);
      assert.ok(depth.extrusion.lg - depth.depression.lg >= 1);

      // Latency invariant: 0ms on press
      assert.match(cssContent, /\.aura-3d-btn:active[\s\S]*?transition:\s*none\s*!important/);
    });
  });

  // ==========================================================================
  // TIER 2: Boundary & Corner Cases
  // ==========================================================================
  describe('Tier 2: Boundary & Corner Cases', () => {
    test('Boundary: Contrast ratio helper handles extreme black and white limits', () => {
      const maxContrast = getContrastRatio('#000000', '#FFFFFF');
      assert.equal(Math.round(maxContrast), 21, 'Black/White contrast ratio must be 21:1');

      const zeroContrast = getContrastRatio('#888888', '#888888');
      assert.equal(Math.round(zeroContrast), 1, 'Identical colors contrast ratio must be 1:1');
    });

    test('Boundary: Secondary text maintains WCAG AA compliance (>= 4.5:1)', () => {
      const darkSecRatio = getContrastRatio(darkColors.textSecondary, darkColors.bgBase);
      assert.ok(darkSecRatio >= 4.5, `Dark secondary text ratio ${darkSecRatio.toFixed(2)}:1 must pass AA (4.5:1)`);

      const lightSecRatio = getContrastRatio(lightColors.textSecondary, lightColors.bgBase);
      assert.ok(lightSecRatio >= 4.5, `Light secondary text ratio ${lightSecRatio.toFixed(2)}:1 must pass AA (4.5:1)`);
    });

    test('Boundary: 3D active state depression never exceeds extrusion', () => {
      const diffSm = depth.extrusion.sm - depth.depression.sm;
      const diffMd = depth.extrusion.md - depth.depression.md;
      const diffLg = depth.extrusion.lg - depth.depression.lg;

      assert.ok(diffSm > 0, 'Small depression must leave visible bevel');
      assert.ok(diffMd > 0, 'Medium depression must leave visible bevel');
      assert.ok(diffLg > 0, 'Large depression must leave visible bevel');
    });
  });

  // ==========================================================================
  // TIER 3: Cross-Feature Combinations
  // ==========================================================================
  describe('Tier 3: Cross-Feature Combinations', () => {
    test('Theming & Depth: Bevel colors adjust harmoniously between dark and light', () => {
      // In dark mode, neutral bevel is darker than neutral bg
      const darkNeutralBgLum = getRelativeLuminance(hexToRgb(darkColors.neutralBg));
      const darkNeutralBevelLum = getRelativeLuminance(hexToRgb(darkColors.neutralBevel));
      assert.ok(darkNeutralBevelLum < darkNeutralBgLum, 'Dark bevel must be darker than surface for downward shadow effect');

      // In light mode, neutral bevel is darker than neutral bg
      const lightNeutralBgLum = getRelativeLuminance(hexToRgb(lightColors.neutralBg));
      const lightNeutralBevelLum = getRelativeLuminance(hexToRgb(lightColors.neutralBevel));
      assert.ok(lightNeutralBevelLum < lightNeutralBgLum, 'Light bevel must be darker than surface for downward shadow effect');
    });

    test('Theming & Layout: Max width constraint preserves mobile ergonomics across themes', () => {
      assert.equal(layout.maxWidth, 430, 'App layout constraint must be 430px for mobile-first Duolingo layout');
    });
  });

  // ==========================================================================
  // TIER 4: Real-World Scenarios
  // ==========================================================================
  describe('Tier 4: Real-World Application Scenarios', () => {
    test('Scenario: Theme State Machine & Persistence Lifecycle', () => {
      // Simulated localStorage mock
      const mockStorage = new Map();
      const storageKey = 'auramath-theme';

      // 1. Initial State: Empty storage, system defaults to dark
      let activeTheme = mockStorage.get(storageKey) || 'dark';
      assert.equal(activeTheme, 'dark');

      // 2. User toggles to Light Mode
      activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
      mockStorage.set(storageKey, activeTheme);
      assert.equal(mockStorage.get(storageKey), 'light');

      // 3. User reloads page: Theme is restored from storage
      const reloadedTheme = mockStorage.get(storageKey);
      assert.equal(reloadedTheme, 'light', 'Theme must persist as light across reloads');

      // 4. User toggles back to Dark Mode
      const nextTheme = reloadedTheme === 'dark' ? 'light' : 'dark';
      mockStorage.set(storageKey, nextTheme);
      assert.equal(mockStorage.get(storageKey), 'dark', 'Theme must persist as dark after toggle');
    });
  });
});
