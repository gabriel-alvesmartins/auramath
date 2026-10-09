# Handoff Report: Codebase Architecture & Tooling Survey (Surveyor 1)

- **Date**: 2026-10-01T19:12:30Z
- **Author**: teamwork_preview_explorer (Surveyor 1: Codebase & Architecture)
- **Target Audience**: orchestrator_1 & Design System implementation agents

---

## 1. Observation

### 1.1 Repository & Workspace Topology
- **File**: `package.json` (lines 7–10, 11–16)
  ```json
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "vite",
    "test": "npm run test --workspaces --if-present",
    "build": "npm run build --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present"
  }
  ```
- **Monorepo Layout**:
  - `packages/engine`: Pure TypeScript package `@auramath/engine` (procedural questions, curriculum grades, cognitive radar, bosses, skins).
  - `apps/mobile`: React Native / Expo SDK 51 application using `expo-router` with mobile-specific screens (`mobile/app/`).
  - **Web Application Layout**: The web app is **not** inside `apps/web`. It resides directly at the project root (`index.html`, `vite.config.ts`, and `src/`).
  - **Vite Alias Setup** (`vite.config.ts`, lines 12–15):
    ```ts
    alias: {
      '@auramath/engine': path.resolve(__dirname, 'packages/engine/src/index.ts'),
      '@': path.resolve(__dirname, 'src'),
    }
    ```
  - `src/engine.ts` re-exports directly: `export * from '../packages/engine/src/index';`.

### 1.2 Tooling, Build, and Automated Health Check
- **Automated Test Suite**:
  - Command: `npm test`
  - Output:
    ```
    > auramath-workspace@1.0.0 test
    > npm run test --workspaces --if-present

    > @auramath/engine@1.0.0 test
    > node --test test/engine.test.mjs

    ▶ @auramath/engine Core Verification
      ✔ TRACK_GRADES covers all 6 Cognitive Grades (0.8874ms)
      ✔ generateQuestion produces valid arithmetic equations and answers (0.4995ms)
      ✔ generateQuestion with options produces valid multiple choice distractor sets (0.1499ms)
      ✔ generateDailyQuestions generates deterministic sequence for given seed date (0.2473ms)
      ✔ generateFlashAnzanSequence produces array of integers (0.1662ms)
      ✔ generateGhostRun produces realistic temporal telemetry (0.3031ms)
      ✔ AURA_SKINS and BOSS_LIST catalogs are populated and coherent (0.1323ms)
      ✔ MOCK_USER_PROFILE has calibrated 5-axis cognitive radar (0.1236ms)
      ✔ generatePatternRecognitionQuestion produces valid options with exactly 1 optimal choice (1.0938ms)
    ✔ @auramath/engine Core Verification (5.4322ms)
    ℹ tests 9 | suites 1 | pass 9 | fail 0
    ```
  - Result: **100% passing (9/9 passed, 0 failures, exit code 0)**.
- **Production Web Build**:
  - Command: `npx vite build`
  - Output:
    ```
    vite v5.4.21 building for production...
    transforming...
    ✓ 1485 modules transformed.
    rendering chunks...
    dist/index.html                  2.47 kB │ gzip:  1.08 kB
    dist/assets/index-BU4ijv7G.js  270.87 kB │ gzip: 78.92 kB
    ✓ built in 2.63s
    ```
  - Result: **Clean build, 0 TypeScript/JSX/CSS errors, exit code 0**.
- **Package Build**:
  - Command: `npm run build`
  - Triggers `tsc` in `@auramath/engine` -> successfully writes to `packages/engine/dist/` with exit code 0.

### 1.3 Styling, Fonts, and Assets Configuration
- **Tailwind / CSS Status**:
  - Neither `tailwindcss`, `postcss`, nor `@tailwindcss/vite` are installed in `package.json`.
  - Global styles are defined in `index.html` lines 10–69 (`:root` CSS variables `--color-bg`, `--color-card`, `--color-cyan`, etc.; `@keyframes float`, `@keyframes pulseGlow`).
  - View-level and component-level styling is currently written predominantly via React inline `style={{ ... }}` objects.
- **Typography & Font Loaders**:
  - Loaded via Google Fonts CDN in `index.html` (lines 7–9):
    - `Inter:wght@400;500;600;700` (Body / UI)
    - `JetBrains Mono:wght@500;700;800` (Equations & Tabular Numeral counters)
    - `Plus Jakarta Sans:wght@600;700;800;900` (Headings & Display)
- **Design Tokens**:
  - `src/theme/tokens.ts` (lines 6–43) defines dark bioluminescent tokens: `bgObsidian: '#07090E'`, `surfaceGlass: 'rgba(13, 17, 26, 0.75)'`, `primaryCyan: '#00F2FE'`, `accentViolet: '#8A2BE2'`, `goldStellar: '#FACC15'`, etc.
  - **Notice**: Currently **NO Light Mode** semantic tokens or theme switching hooks exist in `src/theme/tokens.ts`.
- **Assets Catalog**:
  - Static images in `public/assets/`:
    - `aura_spark.jpg` (631 kB) — Mascot spark form
    - `aura_celebrate.jpg` (746 kB) — Victory / celebration mascot
    - `aura_idle.jpg` (505 kB) — Neutral floating mascot
    - `aura_thinking.jpg` (676 kB) — Pedagogical hint mascot
    - `aura_supernova.jpg` / `aura_supernova_form_1788822311839.jpg` (838 kB)
    - `arcanum_boss.jpg` (978 kB) — Boss illustration
    - `cosmic_chest.jpg` (699 kB) — Interactive treasure chest
    - `auramath_icon.jpg` (884 kB) — App icon

### 1.4 State Management, Persistence & Audio Engine
- **State Management**:
  - In `src/App.tsx`, all top-level states (`activeTab`, `isMuted`, `activeLessonNodeId`, `streak`, `stars`, `xp`) are managed via standard React `useState` hooks.
  - No global state manager (Zustand, Redux, or React Context) is currently used in `src/`.
- **Local Storage & Offline Sync**:
  - `src/` (web) currently has **no persistence** (`localStorage` is not called anywhere in `src/`).
  - In `apps/mobile/src/services/storage.ts`, there is an existing, enterprise-grade offline-first persistence implementation:
    - `WebLocalStorageDriver` (localStorage with in-memory fallback)
    - `OfflineStorageAdapter` (manages `PlayerStreak`, `NodeProgressRecord`, and `OfflineMatchRecord`)
    - `DeltaSyncQueueManager` (manages mutation queue with retry backoff for Supabase)
- **Procedural Audio Engine**:
  - Located in `src/services/audioSynth.ts` (lines 1–827).
  - Built strictly on the Web Audio API (`AudioContext`, `GainNode`, `OscillatorNode`, `BiquadFilterNode`, `AudioBufferSourceNode`).
  - **Zero external audio file assets** (0ms latency, synthesized at runtime).
  - Features:
    - Ascending notes on C Major Pentatonic Scale (`PENTATONIC_SCALE`, C4 to C7) mapped to combo streaks.
    - 5 Aura milestone energy chords (Spark, Surge, Overdrive, Supernova, Singularity).
    - Acoustic soft dissipation (non-punitive warm downward tone bend on errors).
    - 12ms micro-tick for tactile keypad touches.
    - Boss battle hit impact and fanfare victory arpeggios.
    - 3-layer generative lofi engine for Zen mode (vinyl crackle, procedural rain, Rhodes chords, sub-bass).

### 1.5 Full Inventory of Components & Screens

#### Components in `src/components/`:
| File | Technology | Description |
|---|---|---|
| `Duolingo3DButton.tsx` | React Web / HTML | 3D tactile button with bevel extrusion (`boxShadow: 0 Xpx 0 <shadow>`) and translateY click depression. |
| `DuolingoLessonDrawer.tsx` | React Web / HTML | Slide-up feedback drawer for correct/incorrect answers with mascot reaction. |
| `AuraMascotWeb.tsx` | React Web / SVG | Vector/raster mascot with 5 combo tiers, speech bubbles, and emotional expressions. |
| `NumpadWeb.tsx` | React Web / HTML | 3x4 on-screen numerical keypad (56px buttons). |
| `Keypad.tsx` | React Web / HTML | Alternative numeric keypad with enter/backspace. |
| `AuraAvatar.tsx` | React Web / HTML | Circular avatar badge representing Aura level. |
| `CosmicBackground.tsx` | React Web / HTML | Radial gradient and starfield background canvas. |
| `AuraMascot.tsx` | React Native | RN Animated / SVG version of mascot. |
| `TrackNode.tsx` | React Native | RN version of serpentine track node with SVG progress ring. |
| `Numpad.tsx` | React Native | RN tactile keypad. |
| `GlassCard.tsx` | React Native | RN glassmorphism card wrapper. |
| `EquationDisplay.tsx` | React Native | RN tabular equation formatter. |
| `ComboHUD.tsx` | React Native | RN combo counter display. |
| `RadarChart.tsx` | React Native | RN 5-axis cognitive radar chart. |

#### Views in `src/views/`:
| File | Role |
|---|---|
| `TrackView.tsx` | Duolingo-style serpentine zigzag curriculum progression, unit selector, guidebook modal, cosmic chest rewards, and anchored mascot. |
| `DuolingoLessonView.tsx` | Microlesson runner: 5 questions, progress bar, hearts, numpad input, feedback drawer, and victory celebration screen. |
| `TrainHubView.tsx` | Training Hub with 6 modes: Arena, Olho Matemático (Pattern Recognition), Blitz 60s, Morte Súbita, Flash Anzan, and Flow Zen. |
| `DuelHubView.tsx` | 4 Competitive modes: 2P Split Screen (inverted), Shadow Racing (Gauss ghost), Desafio Diário, and Arcanum Boss battle. |
| `ProfileHubView.tsx` | User profile with 5-axis cognitive radar SVG, Aura skin catalog, classroom info, and audio volume slider. |
| `LabView.tsx` | Interactive kinetic geometry lab illustrating $(a+b)^2 = a^2 + 2ab + b^2$. |
| `SettingsView.tsx` | Audio volume and haptic toggle preferences. |

---

## 2. Logic Chain

1. **Monorepo Structure**: `package.json` registers `packages/*` and `apps/*`. While `apps/mobile` contains the Expo application, `vite.config.ts` and `src/` at the root contain the web application. When tests and builds are executed, `npm test` checks `@auramath/engine`, and `npx vite build` bundles `src/`.
2. **Acceptance Criteria Alignment**:
   - The Acceptance Criteria in `ORIGINAL_REQUEST.md` states:
     - `npm test` must run with 100% success -> **Currently passing (9/9)**.
     - `npx vite build` must compile without errors -> **Currently passing (0 errors, 2.63s)**.
3. **Theming & Token Architecture**:
   - The user request requires a Design System with Dual Theme support (Dark Obsidian and Paper/Nebula Light) with instantaneous persisted theme switching (R1).
   - Currently, `src/theme/tokens.ts` only defines dark colors, and components use hardcoded inline styles.
   - Therefore, a clean ThemeContext/Provider or CSS variables system (`[data-theme="light"]` / `[data-theme="dark"]`) must be established to satisfy R1 without breaking existing builds.
4. **Duolingo-Inspired Components (R2, R3, R4)**:
   - `Duolingo3DButton.tsx` already contains the 3D bevel extrusion and translateY click mechanism, but needs unification as `Aura3DButton` with strict tokens.
   - The victory celebration screen in `DuolingoLessonView.tsx` currently displays 3 stat cards (XP, Trophy accuracy, Streak); R4 specifically requests mirroring the Figma reference layout: 2 cards side-by-side (Total XP with lightning icon, Accuracy with target icon), efficiency analysis ("Segundos economizados"), and a full-width 3D continue button.
   - In `TrackView.tsx`, the mascot is currently placed only at `index === 0`. To satisfy R3, the mascot must dynamically anchor to the player's active progression node.
5. **Olho Matemático Integration (R5)**:
   - In `TrainHubView.tsx`, the `pattern` submode already implements `generatePatternRecognitionQuestion` with 4 algebraic choices and optimal explanation. It simply needs to be visually polished to the new tactile Design System.

---

## 3. Caveats

1. **Tailwind Absence**: The codebase does not have Tailwind configured; all styling is currently CSS-in-JS inline styles and raw CSS in `index.html`. Introducing Tailwind might require additional dependencies and build configuration changes, whereas semantic CSS variables and typed TS token objects can be applied immediately with zero build friction.
2. **Dual Platform Components**: `src/components/` contains both web components and React Native components (`react-native-svg`, `StyleSheet`). The web application runs purely on web components (`AuraMascotWeb.tsx`, `NumpadWeb.tsx`, etc.). Care must be taken not to mix React Native imports into Web views during refactoring.
3. **Audio Autoplay Restrictions**: Browsers require a user interaction (click/touch/key) before `AudioContext` can produce sound. `App.tsx` handles this correctly with a first-touch event listener.

---

## 4. Conclusion

The AuraMath codebase has a solid, healthy foundation:
- The procedural engine (`@auramath/engine`) is fully operational with 100% passing tests.
- The web app builds in ~2.6s with Vite without warnings.
- The procedural audio synthesizer is exceptional (0ms latency, no external audio files).
- The primary tasks for the redesign are:
  1. Implement a semantic Dual Theme system (Dark Obsidian / Paper Light) in `tokens.ts` with persisted switcher.
  2. Standardize the 3D tactile component suite (`Aura3DButton`, `StatCard3D`, `FeedbackDrawer`, `TactileNumpad`, `TrackSerpentineNode`).
  3. Update `TrackView.tsx` to dynamically anchor the Aura mascot to the active node.
  4. Refactor the lesson completion screen in `DuolingoLessonView.tsx` to match the 2-card Figma specification with efficiency metrics.
  5. Harmonize the training modes (especially Olho Matemático) with the new Design System tokens.

---

## 5. Verification Method

To verify the observations and baseline health independently:

1. **Verify Engine Tests**:
   ```powershell
   npm test
   ```
   *Expected output*: 9 passed, 0 failed, exit code 0.

2. **Verify Production Web Build**:
   ```powershell
   npx vite build
   ```
   *Expected output*: `✓ built in ~2-3s`, `dist/` generated with 0 errors.

3. **Verify Dev Server**:
   ```powershell
   npx vite --port 5173
   ```
   *Expected output*: Vite server starts on port 5173 without runtime compilation errors.
