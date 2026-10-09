/**
 * Adversarial Empirical Verification Suite — Milestone M1: Foundations & Theming
 * Challenger: teamwork_preview_challenger (Challenger M1_1)
 *
 * Verifies:
 * 1. Precision token fidelity (all hex values specified in Rebrand 01.1 vs tokens.ts)
 * 2. Operational Light Mode & CSS Cascade specificity in theme.css (:root, [data-theme="light"], html[data-theme="light"], html[data-theme="dark"])
 * 3. index.html zero-flash cold load configuration and fallback CSS
 * 4. Elimination of neon cyans (#00F2FE), space purples (#8A2BE2), and cosmic blacks (#07090E, #030407) in M1 files
 * 5. WCAG AA (>= 4.5:1) and AAA (>= 7:1) contrast calculation between Paper background and Ink typography
 * 6. 3D tactile button physics, extrusion/depression geometry, and 0ms latency invariants
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT_DIR = process.cwd();

// --- WCAG Contrast Ratio Helper ---
function getLuminance(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('Challenger M1: Adversarial Empirical Verification', () => {

  // =========================================================================
  // 1. Rebrand 01.1 Token Fidelity & Hex Value Accuracy
  // =========================================================================
  describe('1. Rebrand 01.1 Token Precision in src/theme/tokens.ts', () => {
    const tokensPath = path.join(ROOT_DIR, 'src', 'theme', 'tokens.ts');

    test('tokens.ts exists and is readable', () => {
      assert.ok(fs.existsSync(tokensPath), 'tokens.ts must exist');
    });

    test('brandTokens exports exact Rebrand 01.1 hex codes', async () => {
      const content = fs.readFileSync(tokensPath, 'utf-8');

      // Expected Rebrand 01.1 canonical values
      const expectedTokens = {
        paper: '#F7F4EA',
        cream: '#FFFDF6',
        ink: '#202522',
        inkSecondary: '#5C645F',
        borderSubtle: '#D9D5C8',
        borderBold: '#C2BDAE',
        paperBevelSubtle: '#D9D5C8',
        paperBevelBold: '#C2BDAE',
        verdigris: '#176B5B',
        verdigrisBevel: '#104E42',
        verdigrisSoft: '#DCEBE5',
        marigold: '#F2B84B',
        marigoldBevel: '#D49A2E',
        marigoldSoft: '#FFF0C9',
        coral: '#E76F61',
        coralBevel: '#C75144',
        coralSoft: '#F8DED9',
        iris: '#6E5AA6',
        irisBevel: '#524080',
        irisSoft: '#E8E3F3',
      };

      for (const [key, expectedHex] of Object.entries(expectedTokens)) {
        const regex = new RegExp(`${key}:\\s*['"]${expectedHex}['"]`, 'i');
        assert.match(content, regex, `brandTokens must define ${key} as ${expectedHex}`);
      }
    });

    test('rebrandTokens alias exists and is exported', () => {
      const content = fs.readFileSync(tokensPath, 'utf-8');
      assert.match(content, /export const rebrandTokens\s*=\s*brandTokens;/);
    });

    test('backward-compatible colors object replaced neon values with Rebrand palette', () => {
      const content = fs.readFileSync(tokensPath, 'utf-8');

      // Verify that old neon keys now map to sober Rebrand 01.1 colors
      assert.match(content, /bgObsidian:\s*['"]#202522['"]/i, 'bgObsidian must be Mineral Ink #202522');
      assert.match(content, /primaryCyan:\s*['"]#176B5B['"]/i, 'primaryCyan must be Verdigris #176B5B');
      assert.match(content, /accentViolet:\s*['"]#6E5AA6['"]/i, 'accentViolet must be Iris #6E5AA6');
      assert.match(content, /plasmaMagenta:\s*['"]#E76F61['"]/i, 'plasmaMagenta must be Coral #E76F61');
      assert.match(content, /goldStellar:\s*['"]#F2B84B['"]/i, 'goldStellar must be Marigold #F2B84B');
      assert.match(content, /borderSubtle:\s*['"]#D9D5C8['"]/i, 'borderSubtle must be #D9D5C8');
      assert.match(content, /borderBold:\s*['"]#C2BDAE['"]/i, 'borderBold must be #C2BDAE');
    });

    test('glows exports paper-elevation shadows instead of bioluminescent spreads', () => {
      const content = fs.readFileSync(tokensPath, 'utf-8');
      assert.match(content, /cyan:\s*\{[\s\S]*?shadowColor:\s*['"]#176B5B['"]/i);
      assert.match(content, /violet:\s*\{[\s\S]*?shadowColor:\s*['"]#6E5AA6['"]/i);
      assert.match(content, /gold:\s*\{[\s\S]*?shadowColor:\s*['"]#F2B84B['"]/i);
      assert.match(content, /coral:\s*\{[\s\S]*?shadowColor:\s*['"]#E76F61['"]/i);
    });

    test('AURA_COMBO_STAGES conforms to the 5 pedagogical stages of discovery', () => {
      const content = fs.readFileSync(tokensPath, 'utf-8');
      assert.match(content, /name:\s*['"]Dot['"][\s\S]*?label:\s*['"]Observação['"]/);
      assert.match(content, /name:\s*['"]Line['"][\s\S]*?label:\s*['"]Conexão['"]/);
      assert.match(content, /name:\s*['"]Shape['"][\s\S]*?label:\s*['"]Estrutura['"]/);
      assert.match(content, /name:\s*['"]Pattern['"][\s\S]*?label:\s*['"]Reconhecimento['"]/);
      assert.match(content, /name:\s*['"]Insight['"][\s\S]*?label:\s*['"]Antecipação['"]/);
    });
  });

  // =========================================================================
  // 2. theme.css Specificity & Operational Light Mode Cascade
  // =========================================================================
  describe('2. Operational Light Mode & CSS Specificity in src/theme/theme.css', () => {
    const cssPath = path.join(ROOT_DIR, 'src', 'theme', 'theme.css');

    test('theme.css defines Rebrand 01.1 Operational block for :root and html[data-theme="light"]', () => {
      const css = fs.readFileSync(cssPath, 'utf-8');

      // The operational block must define Paper and Cream as default
      const operationalBlockMatch = css.match(/:root,\s*html\[data-theme="light"\]\s*\{([\s\S]*?)\}/);
      assert.ok(operationalBlockMatch, ':root, html[data-theme="light"] block must exist');

      const blockBody = operationalBlockMatch[1];
      assert.match(blockBody, /--theme-mode:\s*light;/);
      assert.match(blockBody, /--color-bg-base:\s*#F7F4EA;/);
      assert.match(blockBody, /--color-bg-surface:\s*#FFFDF6;/);
      assert.match(blockBody, /--color-border-subtle:\s*#D9D5C8;/);
      assert.match(blockBody, /--color-border-bold:\s*#C2BDAE;/);
      assert.match(blockBody, /--color-text-primary:\s*#202522;/);
      assert.match(blockBody, /--color-text-secondary:\s*#5C645F;/);
      assert.match(blockBody, /--color-brand:\s*#176B5B;/);
      assert.match(blockBody, /--color-brand-bevel:\s*#104E42;/);
      assert.match(blockBody, /--color-brand-surface:\s*#DCEBE5;/);
    });

    test('theme.css defines html[data-theme="dark"] with Mineral Ink and no cosmic black', () => {
      const css = fs.readFileSync(cssPath, 'utf-8');

      const darkBlockMatch = css.match(/html\[data-theme="dark"\]\s*\{([\s\S]*?)\}/);
      assert.ok(darkBlockMatch, 'html[data-theme="dark"] block must exist');

      const blockBody = darkBlockMatch[1];
      assert.match(blockBody, /--theme-mode:\s*dark;/);
      assert.match(blockBody, /--color-bg-base:\s*#202522;/);
      assert.match(blockBody, /--color-bg-surface:\s*#2B312D;/);
      assert.match(blockBody, /--color-text-primary:\s*#F7F4EA;/);
      assert.match(blockBody, /--color-brand:\s*#176B5B;/);

      // Must not declare cosmic blacks in CSS properties
      const bodyWithoutComments = blockBody.replace(/\/\*[\s\S]*?\*\//g, '');
      assert.doesNotMatch(bodyWithoutComments, /#030407/);
      assert.doesNotMatch(bodyWithoutComments, /#07090E/);
    });

    test('Cascading Order Invariant: Operational :root block appears AFTER legacy test-contract block', () => {
      const css = fs.readFileSync(cssPath, 'utf-8');

      const legacyIndex = css.indexOf(':root,\n[data-theme="dark"]');
      const operationalIndex = css.indexOf(':root,\nhtml[data-theme="light"]');

      assert.ok(legacyIndex !== -1, 'Legacy block must be found');
      assert.ok(operationalIndex !== -1, 'Operational block must be found');
      assert.ok(
        operationalIndex > legacyIndex,
        'Operational Light Mode (:root) MUST appear later in stylesheet order to override legacy :root declarations by standard CSS cascading rules'
      );
    });

    test('3D tactile button classes defined for all Rebrand variants', () => {
      const css = fs.readFileSync(cssPath, 'utf-8');

      const variants = [
        'aura-3d-btn--verdigris',
        'aura-3d-btn--marigold',
        'aura-3d-btn--coral',
        'aura-3d-btn--iris',
        'aura-3d-btn--paper',
      ];

      for (const variant of variants) {
        assert.match(css, new RegExp(`\\.${variant}\\b`), `Must define CSS class .${variant}`);
      }
    });

    test('Tactile button active latency invariant: transition: none !important', () => {
      const css = fs.readFileSync(cssPath, 'utf-8');

      const activeRuleMatch = css.match(/\.aura-3d-btn:active[^{]*\{([^}]*)\}/);
      assert.ok(activeRuleMatch, '.aura-3d-btn:active rule must exist');
      assert.match(activeRuleMatch[1], /transition:\s*none\s*!important/);
      assert.match(activeRuleMatch[1], /transform:\s*translateY\(var\(--btn-depression\)\)\s*!important/);
    });
  });

  // =========================================================================
  // 3. index.html Cold Load & Fallback Verification
  // =========================================================================
  describe('3. index.html Cold-Load & Title Verification', () => {
    const indexPath = path.join(ROOT_DIR, 'index.html');

    test('index.html explicitly declares data-theme="light" on <html>', () => {
      const html = fs.readFileSync(indexPath, 'utf-8');
      assert.match(html, /<html\s+lang="pt-BR"\s+data-theme="light">/i);
    });

    test('index.html sets canonical Rebrand title "Auramath | Não calcule. Veja."', () => {
      const html = fs.readFileSync(indexPath, 'utf-8');
      assert.match(html, /<title>Auramath\s*\|\s*Não calcule\.\s*Veja\.<\/title>/i);
    });

    test('index.html inline fallback styles use Paper and Cream colors', () => {
      const html = fs.readFileSync(indexPath, 'utf-8');
      assert.match(html, /--color-bg:\s*#F7F4EA/i);
      assert.match(html, /--color-card:\s*#FFFDF6/i);
      assert.match(html, /background-color:\s*#F7F4EA/i);
      assert.match(html, /color:\s*#202522/i);
    });

    test('index.html contains zero instances of neon cyan, space purple, or dark obsidian fallback', () => {
      const html = fs.readFileSync(indexPath, 'utf-8');
      assert.doesNotMatch(html, /#00F2FE/i, 'index.html must not contain #00F2FE');
      assert.doesNotMatch(html, /#8A2BE2/i, 'index.html must not contain #8A2BE2');
      assert.doesNotMatch(html, /#07090E/i, 'index.html must not contain #07090E');
      assert.doesNotMatch(html, /#030407/i, 'index.html must not contain #030407');
      assert.doesNotMatch(html, /pulseGlow/i, 'index.html must not contain pulseGlow keyframes');
    });
  });

  // =========================================================================
  // 4. Absolute Absence of Neon Cyan & Space Purple in M1 Artifacts
  // =========================================================================
  describe('4. Elimination of Neon Cyans & Space Purples in Milestone M1 Files', () => {
    const m1Files = [
      path.join(ROOT_DIR, 'src', 'theme', 'tokens.ts'),
      path.join(ROOT_DIR, 'src', 'theme', 'theme.css'),
      path.join(ROOT_DIR, 'index.html'),
      path.join(ROOT_DIR, 'src', 'components', 'tactile', 'ThemeToggle.tsx'),
    ];

    for (const file of m1Files) {
      const relPath = path.relative(ROOT_DIR, file);

      test(`${relPath} has zero occurrences of neon cyan (#00F2FE)`, () => {
        const content = fs.readFileSync(file, 'utf-8');
        assert.doesNotMatch(content, /#00F2FE/i, `${relPath} must have 0 occurrences of #00F2FE`);
      });

      test(`${relPath} has zero occurrences of space purple (#8A2BE2)`, () => {
        const content = fs.readFileSync(file, 'utf-8');
        assert.doesNotMatch(content, /#8A2BE2/i, `${relPath} must have 0 occurrences of #8A2BE2`);
      });
    }
  });

  // =========================================================================
  // 5. WCAG AA / AAA Accessibility Contrast Calculations
  // =========================================================================
  describe('5. WCAG Contrast Compliance for Rebrand 01.1 Palette', () => {
    test('Paper (#F7F4EA) vs Ink (#202522) meets WCAG AAA (> 7:1) for body text', () => {
      const ratio = getContrastRatio('#F7F4EA', '#202522');
      // Paper luminance is ~0.87, Ink is ~0.025 -> contrast is ~12.8:1
      assert.ok(ratio >= 7.0, `Contrast ratio ${ratio.toFixed(2)} must satisfy AAA (>= 7.0)`);
    });

    test('Cream (#FFFDF6) vs Ink (#202522) meets WCAG AAA (> 7:1) on elevated cards', () => {
      const ratio = getContrastRatio('#FFFDF6', '#202522');
      assert.ok(ratio >= 7.0, `Contrast ratio ${ratio.toFixed(2)} must satisfy AAA (>= 7.0)`);
    });

    test('Paper (#F7F4EA) vs Ink Secondary (#5C645F) meets WCAG AA (> 4.5:1) for annotations', () => {
      const ratio = getContrastRatio('#F7F4EA', '#5C645F');
      assert.ok(ratio >= 4.5, `Contrast ratio ${ratio.toFixed(2)} must satisfy AA (>= 4.5)`);
    });

    test('Verdigris (#176B5B) button text on white (#FFFFFF) meets WCAG AA (> 4.5:1)', () => {
      const ratio = getContrastRatio('#176B5B', '#FFFFFF');
      assert.ok(ratio >= 4.5, `Contrast ratio ${ratio.toFixed(2)} must satisfy AA (>= 4.5)`);
    });

    test('Coral (#E76F61) button text on white (#FFFFFF) meets UI threshold (>= 3.0:1)', () => {
      const ratio = getContrastRatio('#E76F61', '#FFFFFF');
      assert.ok(ratio >= 3.0, `Contrast ratio ${ratio.toFixed(2)} must satisfy UI threshold (>= 3.0)`);
    });

    test('Marigold (#F2B84B) button with dark Ink (#202522) text meets WCAG AAA (>= 7.0:1)', () => {
      const ratio = getContrastRatio('#F2B84B', '#202522');
      // Marigold is bright yellow-orange (~0.52 luminance) and Ink is dark (~0.025) -> ratio is ~7.6:1
      assert.ok(ratio >= 7.0, `Contrast ratio ${ratio.toFixed(2)} must satisfy AAA (>= 7.0)`);
    });
  });

  // =========================================================================
  // 6. TrackView Syntax Gate Verification
  // =========================================================================
  describe('6. TrackView Syntax Gate & Unclosed Button Verification', () => {
    test('src/views/TrackView.tsx has balanced button tag at boss node (line 666)', () => {
      const trackPath = path.join(ROOT_DIR, 'src', 'views', 'TrackView.tsx');
      const content = fs.readFileSync(trackPath, 'utf-8');

      // Check specifically around line 660-670
      assert.match(
        content,
        /\{isAllGradeCompleted \? 'MESTRE' : 'BLOQUEADO'\}\s*<\/span>\s*<\/button>/,
        'TrackView must properly close the button element before the boss name label'
      );
    });
  });

  // =========================================================================
  // 7. Production Build Artifacts (dist/) Empirical Verification
  // =========================================================================
  describe('7. Production Bundle (dist/) Empirical Verification', () => {
    test('dist/index.html contains data-theme="light" and Rebrand title', () => {
      const distIndexPath = path.join(ROOT_DIR, 'dist', 'index.html');
      assert.ok(fs.existsSync(distIndexPath), 'dist/index.html must exist');
      const html = fs.readFileSync(distIndexPath, 'utf-8');
      assert.ok(html.includes('data-theme="light"'), 'dist/index.html must have data-theme="light"');
      assert.ok(html.includes('Não calcule. Veja.'), 'dist/index.html must contain rebrand tagline');
      assert.ok(!html.includes('#00F2FE'), 'dist/index.html must not contain #00F2FE');
      assert.ok(!html.includes('#8A2BE2'), 'dist/index.html must not contain #8A2BE2');
    });

    test('dist/assets/*.css contains Paper & Cream theme properties', () => {
      const assetsDir = path.join(ROOT_DIR, 'dist', 'assets');
      const cssFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'));
      assert.ok(cssFiles.length > 0, 'Must have at least one built CSS file');

      const bundledCss = fs.readFileSync(path.join(assetsDir, cssFiles[0]), 'utf-8').toLowerCase();
      assert.ok(bundledCss.includes('#f7f4ea'), 'bundled CSS must contain Paper #f7f4ea');
      assert.ok(bundledCss.includes('#fffdf6'), 'bundled CSS must contain Cream #fffdf6');
      assert.ok(bundledCss.includes('#176b5b'), 'bundled CSS must contain Verdigris #176b5b');
      assert.ok(bundledCss.includes('aura-3d-btn'), 'bundled CSS must contain tactile button classes');
    });
  });
});
