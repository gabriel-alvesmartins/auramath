# DISPATCH — 2026-10-01T23:40:00Z

## Assignment: Milestone M5 — Training Hub, Game Modes & Cognitive Profile
You are teamwork_preview_worker implementing Milestone M5: Training Hub, Game Modes & Cognitive Profile.
Working directory: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\worker_m5

## Authoritative Inputs
- Original Request: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\ORIGINAL_REQUEST.md
- Project Architecture & Contracts: c:\Users\Pichau\Desktop\Projetos\auramath\PROJECT.md
- Survey Hand-offs:
  * c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\explorer_survey_2\handoff.md
  * c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\explorer_survey_3\handoff.md

## Scope & File Ownership
You EXCLUSIVELY own and will modify:
- `src/views/TrainHubView.tsx`
- `src/views/ProfileHubView.tsx`
- `src/components/tactile/CognitiveRadarChart.tsx` (new component)
- `src/components/tactile/index.ts` (export `CognitiveRadarChart`)
And create:
- `test/train-profile.test.mjs`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## 2026-10-01T23:40:07Z
You are teamwork_preview_worker implementing Milestone M5: Training Hub, Game Modes & Cognitive Profile.
Your working directory is: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\worker_m5
Read the authoritative request at: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\ORIGINAL_REQUEST.md
Read the project architecture and contracts at: c:\Users\Pichau\Desktop\Projetos\auramath\PROJECT.md
Read the survey findings at:
- c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\explorer_survey_2\handoff.md
- c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\explorer_survey_3\handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You EXCLUSIVELY own and will create/modify:
- `src/components/tactile/CognitiveRadarChart.tsx` (new component)
- `src/components/tactile/index.ts` (export `CognitiveRadarChart`)
- `src/views/TrainHubView.tsx` (harmonize hub, 3D tactile Olho Matemático, game modes)
- `src/views/ProfileHubView.tsx` (modernize profile, integrate CognitiveRadarChart, 3D skin cards)
- `test/train-profile.test.mjs` (unit test suite)

Detailed Requirements:
1. `CognitiveRadarChart.tsx`:
   - Standalone SVG component in `src/components/tactile/CognitiveRadarChart.tsx`.
   - Props: `radar: { speedScore: number, fermiScore: number, flexibilityScore: number, staminaScore: number, memoryScore: number }`, `size?: number`.
   - Exact polar trigonometry:
     * 5 axes: Speed, Fermi, Flexibility, Stamina, Memory.
     * Angle $\theta_i = -\pi/2 + i \times (2\pi / 5)$ for $i \in [0..4]$.
     * Concentric guideline polygons (25%, 50%, 75%, 100%) with `stroke="var(--color-border-subtle)"` or semantic CSS tokens.
     * User data polygon with `fill="var(--color-brand-surface)"` and `stroke="var(--color-brand)"` (strokeWidth 2).
     * Labels for each axis with tabular numeric score formatted in JetBrains Mono (`.font-mono-tabular`).
     * Seamless dual-theme support (Dark Obsidian and Paper Light).
   - Export from `src/components/tactile/index.ts`.

2. `TrainHubView.tsx`:
   - Harmonize entire view with 100% semantic CSS custom properties (`var(--color-bg-base)`, `var(--color-bg-surface)`, `var(--color-text-primary)`, `var(--color-brand)`, `var(--color-gold)`, etc.). Remove all hardcoded dark container background values.
   - Mode Selector: Modern 3D tactile tabs/pills for all 6 modes (`'arena' | 'pattern' | 'blitz' | 'sudden' | 'anzan' | 'zen'`).
   - **Olho Matemático (`pattern`)**:
     * Procedural equation from `generatePatternRecognitionQuestion()` displayed prominently with tabular numerals (`.font-mono-tabular`).
     * Technique badge (`patternQ.technique`) and prompt (`patternQ.prompt`).
     * Options rendered as 3D tactile shortcut cards (`Aura3DButton` or 3D beveled cards with 4px bevel and mechanical depression).
     * Selection feedback:
       - Optimal option: Emerald/Success highlight (`var(--color-success)`), `audioSynth.playSuccessNote(streak)`, streak increments, confetti on milestone streak (e.g. % 5).
       - Suboptimal option: Coral/Alert highlight (`var(--color-alert)`), `audioSynth.playErrorSoftRelease()`, streak resets to 0.
       - Reveals "Insight do Atalho" callout displaying `explanation` with didactical insight.
       - Action button: `<Aura3DButton variant="brand" size="lg" fullWidth>` ("Próximo Reconhecimento ➔") to generate the next pattern recognition question.
   - **Other Game Modes (`blitz`, `sudden`, `anzan`, `zen`, `arena`)**:
     * Replace legacy `Keypad` with `TactileNumpad` (56dp touch targets, mechanical depression, audio ticks, physical keyboard synchronization).
     * Timers, score counters, and streak indicators styled with `.font-mono-tabular`.
     * Clean dual theming for both Dark and Light modes.

3. `ProfileHubView.tsx`:
   - Reconstructed using semantic CSS custom properties for dual theming (Dark Obsidian and Paper Light).
   - User card with display name, level badge, cognitive archetype title, and description.
   - Embeds the new `<CognitiveRadarChart radar={profile.radar} />`.
   - Cosmetics Catalog: Renders `AURA_SKINS` as 3D cards with skin visual avatar/badge, title, rarity, and equip/lock button using `<Aura3DButton>`.

4. Automated Test Suite (`test/train-profile.test.mjs`):
   - Verify `CognitiveRadarChart` exports, props, mathematical calculation, and theme tokens.
   - Verify `TrainHubView` mode switching across all 6 modes.
   - Verify Olho Matemático question generation, single optimal choice invariant, selection state, and audio call contracts.
   - Verify `TactileNumpad` integration in training modes.
   - Verify Cosmetics Catalog rendering and equipping state.

5. Verification:
   - `npm test` passes 100%.
   - `node --test test/train-profile.test.mjs` passes 100%.
   - `npx vite build` compiles cleanly with 0 TypeScript/CSS/JSX errors.
