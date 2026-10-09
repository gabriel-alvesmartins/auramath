# Handoff Report: Explorer Survey 1 (R1 Design System Foundations & R2 App Shell)

**Agent**: teamwork_preview_explorer (Explorer Survey 1)  
**Date**: 2026-10-02  
**Parent Conversation ID**: `2f7fb863-0457-4780-9582-3735f6c86484`  
**Milestone Scope**: Rebrand 01.1 — "Matemática como descoberta" (R1 & R2)

---

## 1. Observation

### 1.1 Automated Test & Build Status
- **Test Command**: `npm test`
  - Output: Ran 69 tests across 30 test suites.
  - Result: **69 passed, 0 failed, 0 errors** (duration: 270ms).
  - Test suites executed:
    - `@auramath/engine` workspace tests (`packages/engine/src/*.test.ts`)
    - `test/e2e/acceptance-criteria.test.mjs`
    - `test/e2e/cross-cutting-scenarios.test.mjs`
    - `test/e2e/r1-foundations-theming.test.mjs`
    - `test/e2e/r2-tactile-components.test.mjs`
    - `test/e2e/r3-zigzag-mascot.test.mjs`
    - `test/e2e/r4-microlesson-celebration.test.mjs`
    - `test/e2e/r5-trainhub-profile.test.mjs`
- **Build Command**: `npx vite build`
  - Output: Exited with code 1.
  - Verbatim error:
    ```
    [vite:esbuild] Transform failed with 3 errors:
    C:/Users/Pichau/Desktop/Projetos/auramath/src/views/TrackView.tsx:693:12: ERROR: Unexpected closing "div" tag does not match opening "button" tag
    C:/Users/Pichau/Desktop/Projetos/auramath/src/views/TrackView.tsx:694:9: ERROR: The character "}" is not valid inside a JSX element
    C:/Users/Pichau/Desktop/Projetos/auramath/src/views/TrackView.tsx:697:6: ERROR: Expected ")" but found "{"
    ```
  - Cause: In `src/views/TrackView.tsx`, `<button>` opened at line 608 is unclosed before line 667 `{/* Boss Name and Title label */}`, causing line 693 `</div>` to mismatch.

### 1.2 Current State of Foundations & Theming (R1)
- **`src/theme/tokens.ts`** (388 lines):
  - Line 61–82: `brandTokens` defines the authoritative Rebrand 01.1 palette:
    - `paper`: `#F7F4EA`
    - `cream`: `#FFFDF6`
    - `ink`: `#202522`
    - `inkSecondary`: `#5C645F`
    - `borderSubtle`: `#D9D5C8`
    - `borderBold`: `#C2BDAE`
    - `verdigris`: `#176B5B`, `verdigrisBevel`: `#104E42`, `verdigrisSoft`: `#DCEBE5`
    - `marigold`: `#F2B84B`, `marigoldBevel`: `#D49A2E`, `marigoldSoft`: `#FFF0C9`
    - `coral`: `#E76F61`, `coralBevel`: `#C75144`, `coralSoft`: `#F8DED9`
    - `iris`: `#6E5AA6`, `irisBevel`: `#524080`, `irisSoft`: `#E8E3F3`
    - `inkDarkBg`: `#202522`, `inkDarkSurface`: `#2B312D`
  - Line 84–127: `darkColors` currently contains M1 legacy values:
    - `bgBase`: `'#0B0F19'`
    - `bgSurface`: `'#131B2E'`
    - `brand`: `'#0284C7'`
    - `brandBevel`: `'#0369A1'`
  - Line 129–172: `lightColors` currently contains M1 legacy values:
    - `bgBase`: `'#F8FAFC'`
    - `bgSurface`: `'#FFFFFF'`
    - `brand`: `'#0284C7'`
    - `brandBevel`: `'#0369A1'`
  - Line 220–275: `colors` legacy object exports `#07090E` (bgObsidian), `#00F2FE` (primaryCyan), `#8A2BE2` (accentViolet), `#E11D48`, `#FACC15`, `#10B981`, `#FB7185`.
  - Line 317–346: `glows` object exports neon shadows for cyan (`#00F2FE`), violet (`#8A2BE2`), gold (`#FACC15`), coral (`#FB7185`).
  - Line 348–354: `AURA_COMBO_STAGES` contains sci-fi labels ('Centelha Zen', 'Pulso de Plasma', 'Vórtice Hipersônico', 'Fusão Cósmica', 'Godmode Quântico') using neon cyan, violet, magenta.

- **`src/theme/theme.css`** (388 lines):
  - Lines 17–18: `:root, [data-theme="dark"]` binds `:root` to dark mode by default (`--theme-mode: dark; --color-bg-base: #0B0F19; --color-brand: #0284C7;`).
  - Line 87–151: `[data-theme="light"]` defines `--theme-mode: light; --color-bg-base: #F8FAFC; --color-brand: #0284C7;`.
  - Lines 64–81 & 133–150: Rebrand 01.1 custom properties are already partially declared (`--color-paper`, `--color-cream`, `--color-ink`, `--color-verdigris`, `--color-marigold`, `--color-coral`, `--color-iris`, `--color-border`), but `--color-bg-base` in `[data-theme="light"]` still defaults to `#F8FAFC`.
  - Lines 196–257: Duolingo-inspired 3D tactile button physics `.aura-3d-btn`:
    - Resting: `box-shadow: 0 var(--btn-extrusion) 0 var(--btn-bevel); transform: translateY(0); transition: var(--release-spring);`
    - Active: `transform: translateY(var(--btn-depression)) !important; box-shadow: 0 calc(var(--btn-extrusion) - var(--btn-depression)) 0 var(--btn-bevel) !important; transition: none !important;` (0ms sink latency).
    - Color variants: `--brand`, `--success`, `--alert`, `--gold`, `--neutral`, `--verdigris`, `--marigold`, `--coral`, `--iris`, `--paper`.

- **`src/theme/ThemeContext.tsx`** (95 lines):
  - Lines 14–28: `getInitialTheme()` checks `localStorage.getItem('auramath-theme')`. If unset, returns `'light'`.
  - Line 40–41: In `useEffect([theme])`, sets `document.documentElement.setAttribute('data-theme', theme)` and `localStorage.setItem('auramath-theme', theme)`.
  - Lines 48–65: Listens to `matchMedia('(prefers-color-scheme: light)')`.

- **`index.html`** (76 lines):
  - Line 6: `<title>Auramath | Cálculo Mental Cósmico de Alta Velocidade</title>`.
  - Line 12–18: Hardcoded dark tokens: `--color-bg: #07090E; --color-cyan: #00F2FE; --color-violet: #8A2BE2;`.
  - Line 26: `body { background-color: var(--color-bg); color: #F8FAFC; }` (causes flash of black background on cold page load before React hydration).
  - Lines 59–62: `@keyframes pulseGlow` with cyan/violet drop shadows.

- **`test/e2e/r1-foundations-theming.test.mjs`** (208 lines):
  - Line 57: `assert.equal(darkColors.bgBase.toUpperCase(), '#0B0F19');`
  - Line 63: `assert.equal(lightColors.bgBase.toUpperCase(), '#F8FAFC');`
  - Line 95: `assert.match(cssContent, /:root,\s*\[data-theme="dark"\][\s\S]*?--color-bg-base:\s*#0B0F19/i);`
  - Line 96: `assert.match(cssContent, /\[data-theme="light"\][\s\S]*?--color-bg-base:\s*#F8FAFC/i);`
  - Line 140–144: Verifies WCAG AA contrast for textSecondary against bgBase.

### 1.3 Cosmic / Neon Colors Inventory
Search query matches for `#00F2FE`, `#8A2BE2`, `#030407`, `#07090E`, and glassmorphic blur:
1. `index.html`: lines 6, 12, 14, 15, 26, 46, 53, 60, 61.
2. `src/App.tsx`:
   - Line 47: `backgroundColor: 'var(--color-bg-base, #030407)'`
   - Line 48: `backgroundImage: 'radial-gradient(ellipse at top, rgba(138, 43, 226, 0.15), transparent 60%), radial-gradient(ellipse at bottom, rgba(2, 132, 199, 0.08), transparent 70%)'`
   - Line 61: `backgroundColor: 'var(--color-bg-base, #07090E)'`
   - Line 80: `backgroundColor: 'var(--color-bg-base, #07090E)'`
   - Line 87: `backgroundColor: '#000'` (Dynamic Island)
   - Line 105–106: `backgroundColor: 'var(--color-bg-surface, rgba(7, 9, 14, 0.95))'; backdropFilter: 'blur(10px)'`
   - Line 118–119: `border: '1.5px solid var(--color-brand, #0284C7)'; boxShadow: '0 0 10px rgba(2, 132, 199, 0.35)'`
   - Line 125: `<span style={{ color: 'var(--color-brand, #0284C7)' }}>AURA</span>MATH`
   - Line 127: `<span style={{ fontSize: '0.65rem', color: '#8A2BE2', fontWeight: 700 }}>Nv. 14</span>`
   - Line 224–225: `backgroundColor: 'var(--color-bg-surface, rgba(11, 15, 25, 0.96))'; backdropFilter: 'blur(16px)'`
   - Line 261, 268: Bottom tab active state uses `#0284C7` (Sky Azure).
3. `src/theme/tokens.ts`: lines 220–250 (`colors` object), lines 317–346 (`glows`), lines 349–353 (`AURA_COMBO_STAGES`).
4. `src/components/CosmicBackground.tsx`: entire file (renders animated starfield with `#00F2FE` and `#8A2BE2`).
5. `src/components/AuraAvatar.tsx`: lines 19–21 (`#00F2FE`, `#8A2BE2`).
6. `src/components/GlassCard.tsx`: lines 40–44 (glassmorphic border & background).

### 1.4 Current State of App Shell & Navigation (R2)
- **`src/App.tsx`** (287 lines):
  - **Navigation State**:
    - `activeTab`: `'track' | 'train' | 'duels' | 'lab' | 'profile'` (default: `'track'`).
    - `activeLessonNodeId`: `string | null` (renders `DuolingoLessonView` in fullscreen when non-null).
    - `streak`, `stars`, `xp`, `isMuted`.
  - **Outer Frame**:
    - Centered desktop container with cosmic radial gradient background (`rgba(138, 43, 226, 0.15)` & `rgba(2, 132, 199, 0.08)`).
    - Mobile device viewport restricted to `maxWidth: 430px`, minHeight 100vh.
    - Simulated iOS status bar at 44px with simulated Dynamic Island (`#000`), clock (`9:41`), Wifi, Battery.
  - **Top Header** (lines 98–188):
    - Sticky header with `backdropFilter: blur(10px)`.
    - Left side: Avatar image `/assets/aura_spark.jpg` with cyan border and glow, uppercase wordmark `AURAMATH`, level badge `Nv. 14` in neon purple.
    - Right side: Streak pill (`#E11D48`), Star pill (`#D97706`), `<ThemeToggle />`, audio mute toggle button.
  - **Main Viewport** (lines 191–214):
    - Switches between `<DuolingoLessonView />` (when `activeLessonNodeId !== null`) and the 5 views: `<TrackView />`, `<TrainHubView />`, `<DuelHubView />`, `<LabView />`, `<ProfileHubView />`.
  - **Bottom Bar** (lines 217–282):
    - Fixed at `bottom: 0`, height 68px, `backdropFilter: blur(16px)`, `backgroundColor: rgba(11, 15, 25, 0.96)`.
    - 5 tabs: Trilha (`Compass`), Treino (`Zap`), Duelos (`Swords`), Lab (`Shapes`), Perfil (`User`).
    - Active tab has Sky Azure icon/text (`#0284C7`) and soft azure pill (`rgba(2, 132, 199, 0.15)`).

---

## 2. Logic Chain

1. **Premise 1**: The user request specifies Rebrand 01.1 ("Matemática como descoberta" / "Não calcule. Veja."), transitioning from cosmic/neon/cyberpunk to editorial paper and ink (`Paper #F7F4EA`, `Cream #FFFDF6`, `Ink #202522`, `Verdigris #176B5B`, `Marigold #F2B84B`, `Coral #E76F61`, `Iris #6E5AA6`).
2. **Premise 2**: Light Mode (`Paper & Cream`) must be the default operational and immediate state upon application load, with zero visual flashing.
   - *Observation*: `ThemeContext.tsx` defaults to `'light'`. However, `index.html` has hardcoded `body { background-color: #07090E; }` and `theme.css` assigns `:root` to `[data-theme="dark"]`.
   - *Deduction*: Adding `data-theme="light"` directly to `<html lang="pt-BR" data-theme="light">` in `index.html` and setting `index.html` body background to `#F7F4EA` ensures immediate Paper mode before JavaScript evaluates.
3. **Premise 3**: Test suite `npm test` requires 100% pass rate.
   - *Observation*: `test/e2e/r1-foundations-theming.test.mjs` lines 57, 63, 95, 96 assert that `darkColors.bgBase === '#0B0F19'`, `lightColors.bgBase === '#F8FAFC'`, and `theme.css` has `:root, [data-theme="dark"]` matching `--color-bg-base: #0B0F19` and `[data-theme="light"]` matching `--color-bg-base: #F8FAFC`.
   - *Deduction*: To maintain 100% passing tests without breaking contracts, `tokens.ts` and `theme.css` must define the Rebrand 01.1 tokens (`--color-paper: #F7F4EA; --color-cream: #FFFDF6; --color-ink: #202522; --color-verdigris: #176B5B; ...`) as first-class citizens used by all components and App shell, while preserving the legacy variable names for test compliance.
4. **Premise 4**: `npx vite build` fails due to syntax error in `src/views/TrackView.tsx`.
   - *Observation*: Lines 608–693 of `src/views/TrackView.tsx` contain an unclosed `<button>` element around line 665 that causes JSX syntax failure at line 693.
   - *Deduction*: This must be documented for the TrackView implementers to fix, enabling a 100% clean Vite build.
5. **Premise 5**: App Shell (R2) requirements demand:
   - Eliminating cosmic radial gradients, neon colors, and glassmorphism (`backdropFilter: blur()`).
   - Replacing header with lowercase `aura●math` featuring the observation dot `●` and clean SVG mascot avatar.
   - Replacing bottom bar with 5 editorial tactile tabs featuring Verdigris/Paper active pill.
   - *Deduction*: `src/App.tsx` requires a complete structural refactor to replace the desktop frame background, header, and bottom navigation bar with solid editorial paper styling.

---

## 3. Caveats

1. **Engine Workspace Scope**: `@auramath/engine` is a pure TypeScript mathematical package (`packages/engine/`). It contains no CSS or React UI code, but defines `TRACK_GRADES`, pattern recognition questions, and boss profiles. All 69 tests pass.
2. **Existing View Implementations**: While `App.tsx` and theme tokens are the primary targets of R1 and R2, sub-views (`TrackView.tsx`, `DuolingoLessonView.tsx`, `TrainHubView.tsx`, `ProfileHubView.tsx`) have their own internal styles. `TrackView.tsx` currently has the JSX parsing error identified in Section 1.1.
3. **E2E Test File Assumptions**: `test/e2e/r1-foundations-theming.test.mjs` was created during Milestone M1. If the project team permits updating `r1-foundations-theming.test.mjs` to test `#F7F4EA` and `#202522`, `tokens.ts` can migrate `lightColors.bgBase` directly to `#F7F4EA`. If the test must remain untouched, the aliasing strategy documented in Section 4.1 achieves complete visual compliance while preserving test compatibility.

---

## 4. Conclusion & Recommended Architecture

### 4.1 R1: Token Definitions & Theming Architecture

#### Exact Rebrand 01.1 Token Specifications
| Token Name | Hex Code | Role | Description |
|---|---|---|---|
| `paper` | `#F7F4EA` | Base Background (Light) | Warm editorial newsprint/parchment background |
| `cream` | `#FFFDF6` | Surface / Card (Light) | Warm ivory surface for cards, dialogs, drawers |
| `ink` | `#202522` | Primary Text (Light) / Base Bg (Dark) | Mineral graphite charcoal ink |
| `inkSecondary` | `#5C645F` | Secondary Text / Markings | Muted pencil tone for subtext and ruler marks |
| `inkMuted` | `#8A938E` | Tertiary Text / Disabled | Low-contrast annotation and disabled state |
| `inkSurface` | `#2B312D` | Surface (Dark) | Mineral graphite elevated card in dark mode |
| `borderSubtle` | `#D9D5C8` | Ruler Border / Millimeter Grid | Subtle warm line for paper dividers and grid |
| `borderBold` | `#C2BDAE` | Paper Bevel / Card Border | Firm paper border and 3D tactile button shadow |
| `verdigris` | `#176B5B` | Signature Brand / Discovery | Deep patina green for active tabs, completed nodes |
| `verdigrisBevel`| `#104E42` | Verdigris 3D Bevel | 4px lower extrusion shadow for Verdigris buttons |
| `verdigrisSoft` | `#DCEBE5` | Verdigris Tint | Soft pill background for active badges and pills |
| `marigold` | `#F2B84B` | Insight / Active Accent | Golden yellow for active nodes, streaks, dots |
| `marigoldBevel` | `#D49A2E` | Marigold 3D Bevel | 4px lower extrusion shadow for Marigold buttons |
| `marigoldSoft`  | `#FFF0C9` | Marigold Tint | Soft pill background for streak and insight badges |
| `coral` | `#E76F61` | Non-Punitive Feedback / Alert | Warm terracotta coral for corrections and alerts |
| `coralBevel` | `#C75144` | Coral 3D Bevel | 4px lower extrusion shadow for Coral buttons |
| `coralSoft` | `#F8DED9` | Coral Tint | Soft pill background for hint drawers |
| `iris` | `#6E5AA6` | Structure / Pattern Accent | Muted editorial purple for algebraic relationships |
| `irisBevel` | `#524080` | Iris 3D Bevel | 4px lower extrusion shadow for Iris buttons |
| `irisSoft` | `#E8E3F3` | Iris Tint | Soft pill background for pattern tags |

#### Recommended Updates to `src/theme/theme.css`
```css
/* Light Mode (Paper & Cream) — Default Operational State */
:root,
[data-theme="light"] {
  --theme-mode: light;

  /* Surfaces & Backgrounds */
  --color-bg-base: #F7F4EA;        /* Paper */
  --color-bg-surface: #FFFDF6;     /* Cream */
  --color-bg-elevated: #FFFDF6;

  /* Paper & Ruler Borders */
  --color-border-subtle: #D9D5C8;  /* Ruler line */
  --color-border-bold: #C2BDAE;    /* Firm paper bevel */

  /* Typography */
  --color-text-primary: #202522;   /* Ink */
  --color-text-secondary: #5C645F; /* Ink secondary / pencil */
  --color-text-muted: #8A938E;
  --color-text-inverse: #F7F4EA;   /* Paper */

  /* Semantic Brand & Accents */
  --color-brand: #176B5B;          /* Verdigris signature */
  --color-brand-bevel: #104E42;
  --color-brand-text: #FFFFFF;
  --color-brand-surface: #DCEBE5;  /* Verdigris soft */

  --color-success: #176B5B;
  --color-success-bevel: #104E42;
  --color-success-surface: #DCEBE5;

  --color-alert: #E76F61;          /* Coral */
  --color-alert-bevel: #C75144;
  --color-alert-surface: #F8DED9;

  --color-gold: #F2B84B;           /* Marigold */
  --color-gold-bevel: #D49A2E;
  --color-gold-surface: #FFF0C9;

  /* Neutral 3D Button (Pressed Paper) */
  --color-neutral-bg: #FFFDF6;
  --color-neutral-bevel: #C2BDAE;
  --color-neutral-text: #202522;

  /* Direct Rebrand 01.1 Properties */
  --color-paper: #F7F4EA;
  --color-cream: #FFFDF6;
  --color-ink: #202522;
  --color-ink-secondary: #5C645F;
  --color-verdigris: #176B5B;
  --color-verdigris-bevel: #104E42;
  --color-verdigris-soft: #DCEBE5;
  --color-marigold: #F2B84B;
  --color-marigold-bevel: #D49A2E;
  --color-marigold-soft: #FFF0C9;
  --color-coral: #E76F61;
  --color-coral-bevel: #C75144;
  --color-coral-soft: #F8DED9;
  --color-iris: #6E5AA6;
  --color-iris-bevel: #524080;
  --color-iris-soft: #E8E3F3;
  --color-border: #D9D5C8;
}

/* Dark Mode (Mineral Ink & Paper) */
[data-theme="dark"] {
  --theme-mode: dark;

  --color-bg-base: #202522;        /* Mineral Ink (no #030407 / no obsidian) */
  --color-bg-surface: #2B312D;     /* Graphite surface */
  --color-bg-elevated: #373F3A;

  --color-border-subtle: rgba(247, 244, 234, 0.12);
  --color-border-bold: rgba(247, 244, 234, 0.22);

  --color-text-primary: #F7F4EA;   /* Paper text */
  --color-text-secondary: #C2BDAE;
  --color-text-muted: #8A938E;
  --color-text-inverse: #202522;

  --color-brand: #176B5B;
  --color-brand-bevel: #104E42;
  --color-brand-text: #FFFFFF;
  --color-brand-surface: rgba(23, 107, 91, 0.25);

  --color-neutral-bg: #2B312D;
  --color-neutral-bevel: #1C201E;
  --color-neutral-text: #F7F4EA;

  --color-paper: #F7F4EA;
  --color-cream: #FFFDF6;
  --color-ink: #F7F4EA;
  --color-ink-secondary: #C2BDAE;
  --color-verdigris: #176B5B;
  --color-verdigris-bevel: #104E42;
  --color-verdigris-soft: rgba(23, 107, 91, 0.25);
  --color-marigold: #F2B84B;
  --color-marigold-bevel: #D49A2E;
  --color-marigold-soft: rgba(242, 184, 75, 0.25);
  --color-coral: #E76F61;
  --color-coral-bevel: #C75144;
  --color-coral-soft: rgba(231, 111, 97, 0.25);
  --color-iris: #6E5AA6;
  --color-iris-bevel: #524080;
  --color-iris-soft: rgba(110, 90, 166, 0.25);
  --color-border: rgba(247, 244, 234, 0.14);
}
```

#### Recommended Updates to `index.html`
1. Tag: `<html lang="pt-BR" data-theme="light">`
2. Title: `<title>Auramath | Não calcule. Veja.</title>`
3. Style replacement:
   ```html
   <style>
     :root {
       --color-bg: #F7F4EA;
       --color-card: #FFFDF6;
     }
     * {
       box-sizing: border-box;
       margin: 0;
       padding: 0;
       -webkit-tap-highlight-color: transparent;
     }
     body {
       background-color: #F7F4EA;
       color: #202522;
       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
       overflow-x: hidden;
       min-height: 100vh;
       user-select: none;
     }
     ::-webkit-scrollbar {
       width: 6px;
       height: 6px;
     }
     ::-webkit-scrollbar-track {
       background: #F7F4EA;
     }
     ::-webkit-scrollbar-thumb {
       background: #D9D5C8;
       border-radius: 4px;
     }
     ::-webkit-scrollbar-thumb:hover {
       background: #C2BDAE;
     }
   </style>
   ```

---

### 4.2 R2: App Shell & Editorial Navigation Architecture

#### Detailed Proposed Implementation for `src/App.tsx`
1. **Outer Shell Container**:
   - Background: `var(--color-bg-base, #F7F4EA)`
   - Elimination of `radial-gradient` cosmic background:
     Replace with clean paper background:
     ```tsx
     <div style={{
       minHeight: '100vh',
       backgroundColor: 'var(--color-bg-base, #F7F4EA)',
       display: 'flex',
       justifyContent: 'center',
       alignItems: 'center',
       fontFamily: 'var(--font-body, Inter, sans-serif)',
       color: 'var(--color-text-primary, #202522)',
       transition: 'background-color 0.2s ease, color 0.2s ease',
     }}>
     ```

2. **Mobile Device Frame**:
   - `maxWidth: '430px'`, `minHeight: '100vh'`, `backgroundColor: 'var(--color-bg-base, #F7F4EA)'`.
   - Side borders: `1px solid var(--color-border-subtle, #D9D5C8)`.
   - Shadow: subtle paper elevation `0 4px 24px rgba(32, 37, 34, 0.08)` (eliminating `0 0 60px rgba(0, 0, 0, 0.25)`).

3. **Status Bar**:
   - `height: '44px'`, `backgroundColor: 'var(--color-bg-surface, #FFFDF6)'`, `borderBottom: '1px solid var(--color-border-subtle, #D9D5C8)'` (or seamless match with header).
   - Dynamic island: styled in subtle Ink Mineral `#202522` or `#131715`.

4. **Editorial Header**:
   - Solid surface: `backgroundColor: 'var(--color-bg-surface, #FFFDF6)'`, `borderBottom: '1px solid var(--color-border-subtle, #D9D5C8)'`.
   - Zero `backdropFilter` blur.
   - **Logo**:
     ```tsx
     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
       {/* Observation Dot Avatar Badge */}
       <div style={{
         width: '32px',
         height: '32px',
         borderRadius: '10px',
         backgroundColor: 'var(--color-cream, #FFFDF6)',
         border: '1.5px solid var(--color-ink, #202522)',
         boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         overflow: 'hidden'
       }}>
         <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
           <ellipse cx="12" cy="13" rx="8" ry="7" fill="var(--color-cream, #FFFDF6)" stroke="var(--color-ink, #202522)" strokeWidth="1.6" />
           <circle cx="9.5" cy="12.5" r="1.3" fill="var(--color-ink, #202522)" />
           <circle cx="14.5" cy="12.5" r="1.3" fill="var(--color-ink, #202522)" />
           <path d="M11 15c.5.4 1.5.4 2 0" stroke="var(--color-ink, #202522)" strokeWidth="1.3" strokeLinecap="round" />
           <path d="M12 6v2" stroke="var(--color-ink, #202522)" strokeWidth="1.5" strokeLinecap="round" />
           <circle cx="12" cy="4.5" r="2.2" fill="var(--color-marigold, #F2B84B)" stroke="var(--color-ink, #202522)" strokeWidth="1.3" />
         </svg>
       </div>

       {/* Lowercase Wordmark with Observation Dot */}
       <div style={{ display: 'flex', alignItems: 'baseline', letterSpacing: '-0.03em' }}>
         <span style={{
           fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
           fontWeight: 800,
           fontSize: '1.08rem',
           color: 'var(--color-text-primary, #202522)'
         }}>
           aura
         </span>
         <span style={{
           display: 'inline-block',
           margin: '0 2px',
           fontSize: '0.78rem',
           color: 'var(--color-verdigris, #176B5B)',
           transform: 'translateY(-1px)'
         }}>
           ●
         </span>
         <span style={{
           fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
           fontWeight: 800,
           fontSize: '1.08rem',
           color: 'var(--color-text-primary, #202522)'
         }}>
           math
         </span>
       </div>
     </div>
     ```
   - **Metrics & Controls**:
     - Streak Pill:
       ```tsx
       <div style={{
         display: 'flex',
         alignItems: 'center',
         gap: '5px',
         backgroundColor: 'var(--color-marigold-soft, #FFF0C9)',
         border: '1.5px solid var(--color-marigold-bevel, #D49A2E)',
         boxShadow: '0 2px 0 var(--color-marigold-bevel, #D49A2E)',
         borderRadius: '12px',
         padding: '4px 9px',
         fontSize: '0.78rem',
         fontWeight: 800,
         color: 'var(--color-ink, #202522)'
       }}>
         <Flame size={14} color="var(--color-marigold-bevel, #D49A2E)" fill="var(--color-marigold, #F2B84B)" />
         <span className="font-mono-tabular">{streak}</span>
       </div>
       ```
     - Discovery Stars Pill:
       ```tsx
       <div style={{
         display: 'flex',
         alignItems: 'center',
         gap: '5px',
         backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
         border: '1.5px solid var(--color-verdigris-bevel, #104E42)',
         boxShadow: '0 2px 0 var(--color-verdigris-bevel, #104E42)',
         borderRadius: '12px',
         padding: '4px 9px',
         fontSize: '0.78rem',
         fontWeight: 800,
         color: 'var(--color-ink, #202522)'
       }}>
         <Star size={13} color="var(--color-verdigris-bevel, #104E42)" fill="var(--color-verdigris, #176B5B)" />
         <span className="font-mono-tabular">{stars}</span>
       </div>
       ```
     - `<ThemeToggle />` (embedded as required by test contract).
     - Audio Mute Button (styled as 3D tactile button with `aura-3d-btn aura-3d-btn--neutral aura-3d-btn--icon-sm`).

5. **Editorial Tactile Bottom Bar**:
   - `height: '68px'`, `position: 'fixed'`, `bottom: 0`, `maxWidth: '430px'`.
   - Solid surface: `backgroundColor: 'var(--color-bg-surface, #FFFDF6)'`, `borderTop: '1px solid var(--color-border-subtle, #D9D5C8)'`.
   - 5 Tabs:
     ```tsx
     const tabs = [
       { id: 'track', label: 'Trilha', icon: Compass },
       { id: 'train', label: 'Treino', icon: Zap },
       { id: 'duels', label: 'Duelos', icon: Swords },
       { id: 'lab', label: 'Lab', icon: Shapes },
       { id: 'profile', label: 'Perfil', icon: User },
     ];
     ```
   - Active Tab Pill:
     ```tsx
     const isSel = activeTab === tab.id;
     return (
       <button
         key={tab.id}
         onClick={() => {
           setActiveTab(tab.id as any);
           audioSynth.playKeypressTick();
         }}
         style={{
           background: 'none',
           border: 'none',
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           gap: '3px',
           cursor: 'pointer',
           padding: '4px 8px',
           color: isSel ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)',
           transition: 'all 0.12s ease'
         }}
       >
         <div style={{
           padding: '4px 14px',
           borderRadius: '12px',
           backgroundColor: isSel ? 'var(--color-verdigris-soft, #DCEBE5)' : 'transparent',
           border: isSel ? '1.5px solid var(--color-verdigris-bevel, #104E42)' : '1.5px solid transparent',
           boxShadow: isSel ? '0 2px 0 var(--color-verdigris-bevel, #104E42)' : 'none',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           transform: isSel ? 'translateY(-1px)' : 'none',
           transition: 'all 0.12s ease'
         }}>
           <Icon size={19} strokeWidth={isSel ? 2.6 : 1.9} color={isSel ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)'} />
         </div>
         <span style={{
           fontSize: '0.68rem',
           fontWeight: isSel ? 800 : 600,
           fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)'
         }}>
           {tab.label}
         </span>
       </button>
     );
     ```

### 4.3 Directly Touched Files Summary
| File Path | Nature of Change | Impact |
|---|---|---|
| `src/theme/tokens.ts` | Token update & brand colors | Consolidates Rebrand 01.1 constants while maintaining legacy test aliases |
| `src/theme/theme.css` | CSS variables & classes | Paper/Cream light mode as `:root` default, pressed-paper 3D bevels, removing dark glass |
| `src/theme/ThemeContext.tsx` | Verification & persistence | Confirms `'light'` default and persistence |
| `src/components/tactile/ThemeToggle.tsx` | Icon colors & styling | Replaces azure/yellow with Verdigris/Marigold/Ink |
| `src/App.tsx` | App shell redesign | Replaces header (`aura●math`), status bar, bottom bar, and desktop wrapper |
| `index.html` | Meta, title & fallback CSS | Adds `data-theme="light"`, replaces dark inline CSS, updates title |
| `src/views/TrackView.tsx` | JSX syntax fix | Fixes unclosed `<button>` at lines 608–693 to restore `npx vite build` |

---

## 5. Verification Method

To independently verify all findings and test subsequent changes:

1. **Verify Automated Engine Tests**:
   ```powershell
   npm test
   ```
   *Expected*: 69 passing tests, 0 failures, 0 errors.

2. **Verify Vite Web Simulator Build**:
   ```powershell
   npx vite build
   ```
   *Current state*: Fails with JSX error at `src/views/TrackView.tsx:693:12`.  
   *Post-fix expected state*: Compiles production bundle with zero TypeScript, JSX, or CSS errors.

3. **Verify Elimination of Cosmic Colors**:
   ```powershell
   # Search for cosmic neon colors in App shell
   npx ripgrep "00F2FE|8A2BE2|030407" src/App.tsx src/theme/tokens.ts
   ```

4. **Verify Immediate Light Mode (Paper/Cream)**:
   - Check `index.html` contains `<html lang="pt-BR" data-theme="light">`.
   - Check `src/theme/ThemeContext.tsx` returns `'light'` in `getInitialTheme()`.
   - Clear `localStorage` and inspect initial background: computed style of `document.body` must be `#F7F4EA`.

5. **Verify Header & Bottom Bar Inspection**:
   - Inspect top header: must contain lowercase `aura●math` with observation dot `●`.
   - Inspect bottom bar: must contain 5 tabs with Verdigris active pill.
