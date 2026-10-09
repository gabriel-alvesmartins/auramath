# Handoff Report: Workflows, Game Modes & E2E Features Survey (Surveyor 3)

**Author**: teamwork_preview_explorer (Surveyor 3: Workflows, Game Modes & E2E Features)  
**Date**: 2026-10-01T19:15:00Z  
**Target Milestone**: Phase 1 Comprehensive Survey (Requirements R3, R4, R5, and Acceptance Criteria)  
**Status**: Survey Complete, Hard Handoff Ready  

---

## 1. Observation

### 1.1 Home Screen & Navigation Flow
- **Shell & Navigation Hierarchy**:
  - `src/App.tsx` (lines 14–21, 196–206, 227–233):
    - App shell simulates a mobile viewport (`maxWidth: '430px'`, iOS status bar, dynamic island pill).
    - Top header (lines 108–180) displays Aura avatar, level (`Nv. 14`), streak (`Flame`), stars (`Star`), and audio mute toggle (`Volume2`/`VolumeX`).
    - Fixed bottom tab bar (lines 211–275) routes between 5 surfaces:
      * `track`: `TrackView` (lines 198–200)
      * `train`: `TrainHubView` (line 201)
      * `duels`: `DuelHubView` (line 202)
      * `lab`: `LabView` (line 203)
      * `profile`: `ProfileHubView` (line 204)
    - Fullscreen immersive lesson takeover: when `activeLessonNodeId` is set, header and tab bar are hidden, and `DuolingoLessonView` is rendered (lines 185–195).
- **Curriculum & Track Structure in `src/views/TrackView.tsx`**:
  - Sliding unit selector (lines 55–98) loops through `TRACK_GRADES` (from `@auramath/engine`), allowing selection of Grade 1 through 6 (`Unidade 1` to `Unidade 6`).
  - Unit banner (lines 101–175) renders current unit description and a "GUIA" button triggering a modal with pedagogical unit details (lines 459–552).
  - Path progression (lines 178–205):
    - Serpentine offset calculated via `getNodeOffset = (index) => [0, 48, 0, -48][index % 4]` (line 27).
    - Nodes are connected by a vertical line: `isCompleted ? 'linear-gradient(to bottom, #00F2FE, #8A2BE2)' : 'rgba(255, 255, 255, 0.12)'` (lines 208–222).
    - Node action popover (lines 339–404) opens on click, showing title, subtitle, and "COMEÇAR (+15 XP)" button which invokes `onStartLesson(node.id)`.
  - **Identified Gaps in Home Track vs R3**:
    1. **Mascot Anchoring is Hardcoded**: Line 225 hardcodes mascot rendering only on the very first node:
       ```tsx
       {index === 0 && (
         <div style={{ position: 'absolute', right: '-115px', top: '-15px', pointerEvents: 'none' }}>
           <AuraMascotWeb size={68} state="idle" speechText="Vamos treinar!" showTierBadge={false} />
         </div>
       )}
       ```
       The mascot does NOT track the user's active / in-progress node dynamically.
    2. **Boss Castle Nodes are Absent**: Although `packages/engine/src/index.ts` defines `BOSS_LIST` with 6 Arcanum bosses corresponding to the 6 grades (`BOSS_GRADE_1` Chronos to `BOSS_GRADE_6` Arcanum Prime, lines 624–700), `TrackView.tsx` only renders standard circular lesson nodes and does not render a final Boss Castle node at the end of each grade track.
    3. **Treasure Chest Placement is Hardcoded**: The cosmic chest reward is hardcoded at `index === 1` (`{index === 1 && ...}`, lines 407–452) rather than dynamically intercalated throughout the curriculum.
    4. **Serpentine Organic Fluidity**: The current offset uses a 4-step discrete array `[0, 48, 0, -48]`, resulting in a sharp zigzag rather than a fluid serpentine track with star crowns and orbit rings (`TrackSerpentineNode`).

### 1.2 Mascot Implementation (`AuraMascotWeb.tsx`, `AuraMascot.tsx`, Assets)
- **Web Mascot Rendering Engine (`src/components/AuraMascotWeb.tsx`)**:
  - Renders as either **pure vector SVG** or **asset image** based on `useArt` prop (default is SVG, line 21).
  - SVG includes:
    * Defs with radial gradients based on combo stage (`Spark`, `Surge`, `Overdrive`, `Supernova`, `Singularity`, lines 24–30, 121–131).
    * Dynamic plasma wings for stage >= 2 (lines 134–151).
    * Energy orbit rings with dashed strokes (lines 154–175).
    * Bioluminescent facial expressions for 5 mascot states: `'idle' | 'happy' | 'hit' | 'supernova' | 'thinking'` (lines 187–239).
    * Speech bubble implementation: lines 41–83 render an absolute-positioned bubble with floating animation (`animation: 'float 3s ease-in-out infinite'`), custom border matching stage/state color, and downward triangular arrow pointer.
  - Mascot assets in `public/assets/`:
    * `public/assets/aura_idle.jpg` (505 KB)
    * `public/assets/aura_spark.jpg` (631 KB)
    * `public/assets/aura_celebrate.jpg` (746 KB)
    * `public/assets/aura_thinking.jpg` (676 KB)
    * `public/assets/aura_supernova.jpg` (838 KB)
    * `public/assets/arcanum_boss.jpg` (978 KB)
    * `public/assets/cosmic_chest.jpg` (699 KB)
- **React Native Mascot (`src/components/AuraMascot.tsx`)**:
  - Uses `react-native-svg` and `Animated.loop` for translateY and pulse scaling. Note: this file is not used in the web app.

### 1.3 Micro-lesson Flow & Celebration Screen (`DuolingoLessonView.tsx`)
- **Current Lesson Flow (`src/views/DuolingoLessonView.tsx`)**:
  - **Structure**: It currently launches directly into the 5-question agility drill (lines 33, 49–55).
  - **Missing Stages**:
    * **Theory Presentation**: Skipped. The theory breakdown (`node.theory.title`, `formula`, `explanation`, `visualBreakdown`) defined in `packages/engine/src/index.ts` is never presented at the start of the lesson.
    * **Gap Scaffold (Andaime de Lacunas)**: Skipped. The structured scaffolding tasks (`node.scaffolding[].template` and `blanks[]`) defined in `packages/engine/src/index.ts` (lines 208–229, 253–264, etc.) are never executed.
  - **Question Drill Execution**:
    * Top bar: Close button, segmented shiny progress bar (emerald `#10B981`), hearts/energy counter (5 hearts).
    * Center: `AuraMascotWeb` with dynamic speech prompt, technique label, tabular equation display, and input placeholder.
    * Bottom: 3D tactile on-screen numpad (1–9, C, 0, backspace) + full-width verify button (`Duolingo3DButton`).
    * Slide-up feedback drawer: `DuolingoLessonDrawer` with success (`#10B981`) or error (`#FB7185`), answer correction, hint explanation, and mascot reaction.
    * Out-of-hearts recovery: `Focus Recharge Modal` requiring 2 basic arithmetic problems to restore 5 hearts (lines 643–714).
- **Incumbent Victory Celebration vs Requirement R4 ("Lesson Complete")**:
  - Incumbent Victory Screen (`DuolingoLessonView.tsx`, lines 205–355):
    * Centered circular celebration art (`/assets/aura_celebrate.jpg`).
    * Title "Lição Concluída!" with node title subtitle.
    * 3 grid cards: Total XP (+20, Zap icon), Accuracy (Trophy icon), Streak (19, Flame icon).
    * Full-width "CONTINUAR" button.
  - **Gaps vs Required R4 / Figma Reference**:
    * The required layout specifies **two side-by-side 3D cards** (`StatCard3D`): Total XP with lightning icon (`Zap`) and Accuracy with target icon (`Target` from `lucide-react`). Currently it renders 3 cards in a 3-column grid.
    * The required layout specifies an **efficiency analysis card ("Segundos economizados")** comparing user time with traditional pencil-and-paper mental calculation time. This is currently completely missing.
    * The celebration mascot should be centered celebrating Aura (`AuraMascotWeb` or `aura_celebrate.jpg`) with confetti celebration.
    * Bottom continue button must be a full-width 3D tactile button (`Aura3DButton`).

### 1.4 Training Hub & Game Modes (`TrainHubView.tsx`, `packages/engine`)
- **Hub Modes (`src/views/TrainHubView.tsx`, lines 220–226)**:
  - `subMode`: `'arena' | 'pattern' | 'blitz' | 'sudden' | 'anzan' | 'zen'`
  - **1. Olho Matemático (`pattern`)**:
    - Generator: `generatePatternRecognitionQuestion()` from `@auramath/engine` (lines 8, 30, 49).
    - Question schema (`PatternRecognitionQuestion`):
      * `equation`: e.g. `98 × 4`, `45 × 11`, `134 - 78`, `48 × 52`
      * `technique`: e.g. `Decomposição Distributiva`, `Fator Notável 11`, `Compensação Subtrativa`
      * `prompt`: e.g. `"Qual é o atalho mental ótimo para calcular sem carregar dígitos?"`
      * `options`: 3–4 `PatternOption` items, exactly 1 having `isOptimal: true` with a detailed `explanation` (verified in engine test line 98).
    - Interaction & Feedback (lines 100–131, 335–424):
      * Clicking an option checks `opt.isOptimal`.
      * Correct: streak increases, score +150 * min(streak, 5), `mascotState = 'happy'`, `audioSynth.playSuccessNote(streak)`, confetti burst on streak % 5.
      * Incorrect: error flash, `mascotState = 'hit'`, `audioSynth.playErrorSoftRelease()`, streak resets.
      * Reveals "Insight do Atalho" callout displaying `explanation` and "Próximo Reconhecimento ➔" button.
  - **2. Blitz 60s (`blitz`)**: 60-second countdown timer, arithmetic question generation via `generateQuestion()`, score multiplier based on streak.
  - **3. Morte Súbita (`sudden`)**: Survival mode starting with 15s (decreasing to 4s as streak rises). Any single mistake or timeout triggers immediate Game Over (`isGameOver = true`).
  - **4. Flash Anzan (`anzan`)**: Japanese mental arithmetic drill using `generateFlashAnzanSequence(6)`. Numbers flash one-by-one every 400ms. User inputs cumulative sum.
  - **5. Flow Zen (`zen`)**: Untimed, peaceful arithmetic session. Automatically activates `audioSynth.startZenMode()` (continuous binaural audio drone) and shuts down on unmount (`audioSynth.stopZenMode()`).
  - **6. Arena (`arena`)**: Procedural unlimited rapid-fire practice.

### 1.5 Profile Screen & 5-Axis Cognitive Radar (`ProfileHubView.tsx`)
- **Profile Architecture (`src/views/ProfileHubView.tsx`)**:
  - Displays user card with name (`MOCK_USER_PROFILE.displayName`), level (14), cognitive archetype title (`radar.archetypeTitle`, e.g. "Arquiteto Quântico"), and archetype description.
  - **5-Axis Cognitive Radar Calculation & Rendering**:
    - Rendered as inline SVG (lines 58–84) in a 200x200 viewBox:
      * Speed (`speedScore`): top vertex (100, `100 - speedScore * 0.8`)
      * Fermi (`fermiScore`): top-right vertex (`100 + fermiScore * 0.76`, `100 - fermiScore * 0.25`)
      * Flexibility (`flexibilityScore`): bottom-right vertex (`100 + flexibilityScore * 0.47`, `100 + flexibilityScore * 0.65`)
      * Stamina (`staminaScore`): bottom-left vertex (`100 - staminaScore * 0.47`, `100 + staminaScore * 0.65`)
      * Memory (`memoryScore`): top-left vertex (`100 - memoryScore * 0.76`, `100 - memoryScore * 0.25`)
    - Shows concentric reference pentagons (25%, 50%, 75%, 100%) and axis labels with numerical values.
  - **Cosmetics Catalog**:
    - Renders `AURA_SKINS` from `@auramath/engine` (e.g. `Centelha Primordial`, `Chronos Cristalino`, `Vórtice Dourado`, `Singularidade Carmesim`) with equipped/unlocked status tags.
  - **Identified Gaps in Profile vs R5**:
    - Uses hardcoded dark colors; does not adapt to Light Mode.
    - Mathematical formula is currently hardcoded approximation strings rather than an organic, parameterized SVG component sharing the design system tokens.

### 1.6 Verification Status of Core Engine & Build Tooling
- **Command 1: `npm test`**
  - Path: Root workspace calling `@auramath/engine`
  - Result: **9/9 tests pass (100% success)**. Execution time: ~108ms.
  - Verifies: `TRACK_GRADES` across 6 grades, arithmetic question generator, Fermi options, deterministic seed dates for daily challenges, Flash Anzan integer sequences, ghost telemetry generation, `AURA_SKINS` and `BOSS_LIST` catalogs, calibrated 5-axis cognitive radar, and `generatePatternRecognitionQuestion` single-optimal choice logic.
- **Command 2: `npx vite build`**
  - Path: Root workspace
  - Result: **Builds cleanly in 3.80s**. 1485 modules transformed, 0 TypeScript/CSS/JSX errors. Output size: `dist/assets/index-BU4ijv7G.js` (270.87 kB).

---

## 2. Logic Chain

1. **Premise 1 (Curriculum & Home Track)**:
   - Observation 1.1 reveals that `TRACK_GRADES` contains rich data for all 6 Cognitive Grades, each with titles, descriptions, theory breakdowns, and scaffolding tasks.
   - Observation 1.1 also reveals that the current `TrackView.tsx` hardcodes the floating Aura mascot to `index === 0`, uses a static 4-step zigzag offset `[0, 48, 0, -48]`, hardcodes the cosmic chest to `index === 1`, and completely omits Boss Castle nodes despite `BOSS_LIST` defining 6 Arcanum bosses.
   - *Inference*: To satisfy Requirement R3, `TrackView.tsx` must be refactored into the Zigzag Progression Track:
     * Compute active node index by finding the first uncompleted, unlocked node (`stars < 1`).
     * Dynamically anchor `AuraMascotWeb` next to that active node with context-aware speech bubbles ("Vamos nessa!", "Domine esta técnica!").
     * Replace the 4-step array with an alternating serpentine track formula.
     * Intercalate treasure chests at structured intervals (e.g. midpoint of each grade).
     * Render a culminating Boss Castle node (`TrackSerpentineNode` variant="boss") at the end of each grade track that links to the corresponding Arcanum Boss battle.

2. **Premise 2 (Micro-lesson Architecture)**:
   - Observation 1.3 shows that each node in `TRACK_GRADES` contains three pedagogical tiers: (1) `theory`, (2) `scaffolding`, and (3) procedural agility questions.
   - Observation 1.3 shows that `DuolingoLessonView.tsx` currently bypasses (1) theory and (2) scaffolding, jumping immediately to 5 agility questions.
   - Observation 1.3 shows that the incumbent victory screen shows 3 cards in a 3-column grid without efficiency analysis ("Segundos economizados").
   - *Inference*: To satisfy Requirement R4:
     * `DuolingoLessonView.tsx` should support a 3-step micro-lesson flow:
       1) **Theory Slide**: Clean visual card showcasing `node.theory.title`, formula, and step-by-step `visualBreakdown` with a 3D "CONTINUAR" button.
       2) **Scaffolding Exercise**: Interactive step-by-step gap completion using `node.scaffolding` where users fill intermediate blanks (e.g., decomposing `54 + 38 = 54 + [30] = [84] + 8 = [92]`).
       3) **5-Question Agility Drill**: Rapid-fire execution with on-screen numpad and tactile verification.
     * The victory celebration screen must be restructured to mirror the Figma specification:
       * Centered celebrating Aura mascot.
       * Two side-by-side 3D cards (`StatCard3D`): Total XP (with lightning icon) and Accuracy (with target icon).
       * Dedicated efficiency analysis card displaying **"Segundos economizados"** (calculating time saved compared to standard mental calculation benchmark of 7–8s per question).
       * Full-width 3D continue button (`Aura3DButton`).

3. **Premise 3 (Training Hub & Game Modes)**:
   - Observation 1.4 confirms that `TrainHubView.tsx` already contains functional engines for Olho Matemático, Blitz 60s, Morte Súbita, Flash Anzan, and Flow Zen.
   - Observation 1.4 confirms that Olho Matemático (`subMode === 'pattern'`) is powered by `generatePatternRecognitionQuestion()`, which generates 4 algebraic shortcuts with exactly 1 optimal choice.
   - Observation 1.4 shows that `TrainHubView.tsx` currently relies on hardcoded dark hex colors, lacks Light Mode support, and uses standard flat buttons rather than the new 3D tactile component library (`Aura3DButton`, `TactileNumpad`).
   - *Inference*: To satisfy Requirement R5:
     * Harmonize `TrainHubView.tsx` with semantic design system tokens.
     * In Olho Matemático, convert shortcut choice buttons into tactile 3D cards with instantaneous visual feedback (emerald for optimal, coral for suboptimal), animated check/X icons, audio synth chimes, and an expandable "Insight do Atalho" callout.
     * Integrate the theme toggle so all game mode surfaces render legibly in both Dark Obsidian and Paper/Nebula Light modes.

4. **Premise 4 (Profile & Cognitive Radar)**:
   - Observation 1.5 shows that `ProfileHubView.tsx` renders a 5-axis SVG radar polygon, but the coordinates are calculated using manual approximation strings and fixed dark colors.
   - *Inference*: To satisfy Requirement R5:
     * Extract the pentagonal radar chart into a reusable web component that accepts `CognitiveRadar` data and calculates vertices using clean polar coordinates:
       $$\theta_i = -\frac{\pi}{2} + i \cdot \frac{2\pi}{5}, \quad x_i = x_0 + r \cdot \frac{\text{score}_i}{100} \cdot \cos(\theta_i), \quad y_i = y_0 + r \cdot \frac{\text{score}_i}{100} \cdot \sin(\theta_i)$$
     * Support theme tokens for stroke, fill opacity, grid lines, and axis labels.
     * Harmonize the cosmetics catalog with 3D skin cards and equip/lock states.

5. **Premise 5 (E2E Verification & Test Suite)**:
   - Observation 1.6 confirms `npm test` (engine tests) passes 100% (9/9) and `npx vite build` builds cleanly.
   - There are currently no automated UI/E2E test files in `src/`.
   - *Inference*: To guarantee that Requirements R1 through R5 and all Acceptance Criteria remain strictly satisfied throughout the redesign, an automated E2E test suite (or automated browser/integration test script) must be formulated to verify theme switching, 3D button physics, serpentine track layout, micro-lesson flow, Olho Matemático gameplay, and production build cleanliness.

---

## 3. Caveats

1. **React Native Mobile App Isolation**: `apps/mobile` contains Expo/React Native files (`expo-router`, `react-native-svg`). Our survey focuses on the Web application (`index.html`, `src/App.tsx`, and `packages/engine`). Changes to web components should not break `@auramath/engine` exports or shared interfaces.
2. **Audio Autoplay Restrictions**: Web Audio synthesis (`audioSynth.ts`) requires an initial user interaction (click/keydown) to unlock the `AudioContext`. In automated headless test environments, Web Audio calls must be safely mocked or ignored to avoid `AudioContext not allowed to start` warnings.
3. **Timer-based Modes in Tests**: Modes like Blitz 60s, Morte Súbita, and Flash Anzan use `setInterval`. E2E tests for these modes should test state transitions and problem generation rather than waiting for full real-time countdowns.

---

## 4. Conclusion

The AuraMath codebase has an exceptionally strong procedural mathematics engine (`@auramath/engine` with 100% test pass rate) and functional gameplay logic for all major modes. However, the UI layer is currently in an unharmonized state:
1. **Home Track**: Needs the Zigzag Progression Track with dynamic mascot anchoring, boss castle nodes, and fluid serpentine pathing.
2. **Micro-lesson Flow**: Needs the 3-step cycle (theory -> scaffolding -> agility drill) and the redesigned Figma-compliant "Lesson Complete" victory screen with side-by-side XP/Accuracy 3D cards and "Segundos economizados" efficiency analysis.
3. **Training Hub**: Needs theme harmonization, tactile 3D cards for Olho Matemático, and a unified mode selector.
4. **Profile**: Needs polar-calculated 5-axis cognitive radar supporting dark/light palettes.
5. **Quality Assurance**: `npm test` and `npx vite build` are currently green and must remain 100% clean during implementation.

### Comprehensive E2E Testing Strategy Matrix (Verifying R1 through R5)

| Req | Acceptance Criterion | Test Verification Method | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **R1** | Theme Switcher (Dark Obsidian / Paper Light) | Programmatic toggle test / DOM inspection of `data-theme` and CSS variables | All surface backgrounds, cards, typography, and borders update instantaneously; contrast ratios meet WCAG AA (>= 4.5:1). |
| **R2** | 3D Button Tactile Physics (`Aura3DButton`) | Inspect computed styles & mousedown event on 3D buttons | Bevel extrusion of 4px (`box-shadow: 0 4px 0 ...`); mousedown triggers `translateY(3px)` with bevel collapsing to 1px; click triggers audio tick. |
| **R3** | Zigzag Progression Track & Anchored Aura | Verify `TrackView` rendering across all 6 cognitive grades | Nodes display alternating horizontal offsets; floating Aura mascot renders anchored beside the active/in-progress node; Boss Castle node renders at grade end; chest modal opens on reward node. |
| **R4** | Micro-lesson 3-Step Flow & Victory Screen | Complete a lesson flow from track node launch to finish | (1) Theory screen displays breakdown; (2) Scaffolding exercises validate intermediate blanks; (3) 5-question agility drill validates answers; (4) Victory screen displays centered celebrating Aura, side-by-side XP/Accuracy 3D cards, "Segundos economizados", and full-width continue button. |
| **R5** | Training Hub & "Olho Matemático" | Launch `TrainHubView` and select Olho Matemático | Displays procedural equation and prompt; selecting optimal shortcut triggers green highlight, success sound, and insight callout; selecting suboptimal triggers coral highlight and reset streak. |
| **R5** | Profile 5-Axis Radar & Cosmetics | Inspect `ProfileHubView` | SVG pentagon renders correct vertices for speed, fermi, flexibility, stamina, and memory; cosmetics catalog renders unlocked/locked skins. |
| **Build**| Automated Engine & Build Verification | Run `npm test` and `npx vite build` | 100% pass on 9 engine tests; Vite production build passes with 0 errors. |

---

## 5. Verification Method

To independently verify the facts and findings documented in this report:

1. **Run Engine Automated Tests**:
   ```bash
   npm test
   ```
   *Expected output*: 9 passed, 0 failed, 1 suite, duration ~108ms.
2. **Run Web Production Build**:
   ```bash
   npx vite build
   ```
   *Expected output*: Vite transforms 1485+ modules, bundles to `dist/`, exit code 0 with zero TypeScript or JSX compilation errors.
3. **Inspect Core Workflows & Code Points**:
   - `src/views/TrackView.tsx`: Inspect line 225 to verify hardcoded mascot anchoring `index === 0`.
   - `src/views/DuolingoLessonView.tsx`: Inspect lines 49–55 (absence of theory/scaffolding step) and lines 265–340 (3-column victory card grid instead of 2 side-by-side cards + efficiency analysis).
   - `src/views/TrainHubView.tsx`: Inspect lines 295–424 to verify Olho Matemático implementation with `generatePatternRecognitionQuestion`.
   - `src/views/ProfileHubView.tsx`: Inspect lines 58–84 to verify 5-axis SVG radar polygon points calculation.
   - `packages/engine/src/index.ts`: Inspect lines 178–622 (`TRACK_GRADES` with theory and scaffolding) and lines 624–700 (`BOSS_LIST`).
