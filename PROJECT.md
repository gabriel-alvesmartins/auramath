# Project: Auramath Rebrand 01.1 — “Matemática como descoberta”

## Architecture
- **Metaphor**: “Não calcule. Veja.” (Editorial Notebook & Laboratory of Mathematical Discovery).
- **Core Palette**:
  - `Paper`: `#F7F4EA` (Base background in light mode)
  - `Cream`: `#FFFDF6` (Elevated card/surface background)
  - `Ink`: `#202522` (Graphite nanquim primary text; Dark mode base background)
  - `Ink Secondary`: `#5C645F` (Muted pencil annotations and borders)
  - `Verdigris`: `#176B5B` (Patina signature brand, completed nodes, primary discovery buttons)
  - `Marigold`: `#F2B84B` (Active nodes, streak, observation dot)
  - `Coral`: `#E76F61` (Non-punitive adjustment feedback, alert)
  - `Iris`: `#6E5AA6` (Structure/algebraic relationship accent)
  - `Border Subtle`: `#D9D5C8` (Ruler markings and millimeter grid dots)
  - `Border Bold`: `#C2BDAE` (Firm pressed paper bevels and 3D shadows)
- **Design Foundations**:
  - Immediate Light Mode (`data-theme="light"`, `#F7F4EA` / `#FFFDF6`) on cold load.
  - Dark Mode grounded on Mineral Ink (`#202522`) and Paper (`#F7F4EA`), eliminating cosmic blacks `#030407` and neon cyans/purples.
  - Duolingo-style 3D tactile physics (4px bottom extrusion bevel, 3px depression at 0ms latency).
- **Component & View Layout**:
  - App Shell: Lowercase `aura●math` header with observation dot, 5-tab editorial tactile bottom bar.
  - Mascot Aura: Editorial SVG creature with nanquim stroke, observation antenna, newspaper comic speech bubble, and 5 pedagogical stages (Dot -> Line -> Shape -> Pattern -> Insight).
  - Living Notebook Track: Millimeter-dotted paper zigzag track, continuous serpentine path, solid Verdigris unit banner with "CADERNO GUIA" 3D button, 3D ivory/pressed paper nodes, Caixas de Descoberta, and Mestre dos Padrões.
  - Exercises & Victory: Visual equation diagrams before execution ("Não calcule. Veja."), non-punitive Feedback Drawer, structural celebration victory screen with 3D cards for "Pontos de Descoberta" (XP) and "Precisão", "Segundos economizados pensando antes de calcular", and 3D "PRÓXIMO INSIGHT ➔" button.
  - Train Hub: Laboratory notebook sheets with millimeter grid and specimen cards.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Semantic Tokens & Palette | Consolidate Paper, Cream, Ink, Verdigris, Marigold, Coral, Iris in `tokens.ts` and `theme.css` | M1 | ORIGINAL_REQUEST R1 |
| F2 | Immediate Light Mode Default | Set Light Mode (Paper `#F7F4EA`) as immediate default on cold load in `index.html` and `:root` | M1 | ORIGINAL_REQUEST R1 |
| F3 | Refined Mineral Dark Mode | Ground Dark Mode on Ink `#202522` and Paper `#F7F4EA`, eliminating `#030407` and `#07090E` | M1 | ORIGINAL_REQUEST R1 |
| F4 | 3D Tactile Button Styles | Refine 3D bevels for verdigris, marigold, coral, iris, and pressed-paper neutral buttons | M1 | ORIGINAL_REQUEST R1 |
| F5 | App Shell Frame Redesign | Remove cosmic radial gradients and space backdrops in `src/App.tsx`; replace with warm paper frame | M2 | ORIGINAL_REQUEST R2 |
| F6 | Editorial Header `aura●math` | Clean header with lowercase `aura●math`, observation dot `●`, and SVG observation avatar | M2 | ORIGINAL_REQUEST R2 |
| F7 | Editorial Bottom Bar (5 Tabs) | 5 tactile tabs (Trilha, Treino, Duelos, Lab, Perfil) with Verdigris/Paper active pill | M2 | ORIGINAL_REQUEST R2 |
| F8 | Aura Editorial SVG Mascot | Smooth oval body with nanquim ink stroke, dot eyes `• •`, observation dot antenna `●` | M3 | ORIGINAL_REQUEST R3 |
| F9 | Newspaper Comic Speech Bubble | Cream speech bubble with clean triangular tail and paper tactile shadow | M3 | ORIGINAL_REQUEST R3 |
| F10 | 5 Pedagogical Stages Progression | Visual SVG geometry for Dot (1), Line (2), Shape (3), Pattern (4), Insight (5) in `AuraMascotWeb.tsx` | M3 | ORIGINAL_REQUEST R3 |
| F11 | TrackView Syntax Correction | Fix unclosed `<button>` at lines 608–693 in `src/views/TrackView.tsx` to restore clean Vite build | M4 | Survey Finding / Build Gate |
| F12 | Millimeter-Dotted Notebook Track | Dotted graph paper background `.caderno-track-background` on zigzag path in `TrackView.tsx` | M4 | ORIGINAL_REQUEST R4 |
| F13 | Serpentine Connector Path | Continuous dashed nanquim serpentine line connecting zigzag node offsets | M4 | ORIGINAL_REQUEST R4 |
| F14 | Solid Verdigris Unit Banner | Verdigris banner with white/cream typography and 3D "CADERNO GUIA" button | M4 | ORIGINAL_REQUEST R4 |
| F15 | 3D Ivory/Paper Track Nodes | Tactile nodes with nanquim border, Verdigris completed, Marigold active, concentric ring, Cream/Ink popover | M4 | ORIGINAL_REQUEST R4 |
| F16 | Caixas de Descoberta & Mestre dos Padrões | Replace cosmic chests and arcanum bosses with Discovery Boxes and Master of Patterns | M4 | ORIGINAL_REQUEST R4 |
| F17 | Visual Equation Diagrams | Pre-execution diagrams with arrows and relations ("Não calcule. Veja.") in `DuolingoLessonView.tsx` | M5 | ORIGINAL_REQUEST R5 |
| F18 | Non-Punitive Feedback Drawer | Verdigris Soft ("Descoberta Brilhante! ✦") and Coral Soft ("Veja a estrutura oculta:") with 3D buttons | M5 | ORIGINAL_REQUEST R5 |
| F19 | Structural Recognition Victory Screen | SVG mascot, 3D cards for Pontos de Descoberta & Precisão, seconds saved analysis, "PRÓXIMO INSIGHT ➔" | M5 | ORIGINAL_REQUEST R5 |
| F20 | Laboratory Notebook Train Hub | TrainHub and "Olho Matemático" styled as millimeter laboratory sheets and specimen cards | M5 | ORIGINAL_REQUEST R5 |
| F21 | Full Verification & Hardening | 100% passing tests (`npm test`), clean build (`npx vite build`), WCAG AA contrast, zero neon | M6 | Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Design System & Theming Foundations | F1, F2, F3, F4 (`tokens.ts`, `theme.css`, `index.html`, `ThemeToggle.tsx`) | none | DONE (101/101 tests, clean build) |
| M2 | App Shell & Editorial Navigation | F5, F6, F7 (`src/App.tsx`) | M1 | DONE (aura●math header, 5-tab bar, clean build) |
| M3 | Aura Mascot & Central Symbolism | F8, F9, F10 (`src/components/AuraMascotWeb.tsx`) | M1 | DONE (5-stage SVG, comic speech bubble) |
| M4 | Living Notebook Track & Nodes | F11, F12, F13, F14, F15, F16 (`TrackView.tsx`, `TrackSerpentineNode.tsx`) | M1, M3 | DONE (Millimeter grid, Serpentine path, Discovery Boxes) |
| M5 | Exercise, Feedback & Victory Screens | F17, F18, F19, F20 (`DuolingoLessonView.tsx`, `FeedbackDrawer.tsx`, `TrainHubView.tsx`) | M1, M3 | DONE (Microlesson, Non-punitive drawer, Structural celebration) |
| M6 | Final Verification & Hardening | F21, F25-F35 (183/183 passing tests, clean vite build, 0 neon) | M1, M2, M3, M4, M5 | DONE (183/183 tests, clean build, zero neon) |

## Interface Contracts

### Tokens & Theming (M1) ↔ App Shell & Views (M2, M4, M5)
- Semantic CSS variables:
  - `--color-bg-base`: `#F7F4EA` (light), `#202522` (dark)
  - `--color-bg-surface`: `#FFFDF6` (light), `#2B312D` (dark)
  - `--color-text-primary`: `#202522` (light), `#F7F4EA` (dark)
  - `--color-text-secondary`: `#5C645F` (light), `#C2BDAE` (dark)
  - `--color-brand`: `#176B5B` (Verdigris)
  - `--color-verdigris`: `#176B5B`, `--color-verdigris-bevel`: `#104E42`, `--color-verdigris-soft`: `#DCEBE5`
  - `--color-marigold`: `#F2B84B`, `--color-marigold-bevel`: `#D49A2E`, `--color-marigold-soft`: `#FFF0C9`
  - `--color-coral`: `#E76F61`, `--color-coral-bevel`: `#C75144`, `--color-coral-soft`: `#F8DED9`
  - `--color-iris`: `#6E5AA6`, `--color-iris-bevel`: `#524080`, `--color-iris-soft`: `#E8E3F3`
  - `--color-border-subtle`: `#D9D5C8`, `--color-border-bold`: `#C2BDAE`
- 3D Button Classes:
  - `.aura-3d-btn`: base class with 0ms depression latency.
  - Variants: `.aura-3d-btn--verdigris`, `.aura-3d-btn--marigold`, `.aura-3d-btn--coral`, `.aura-3d-btn--paper`, `.aura-3d-btn--neutral`.

### Mascot Aura (M3) ↔ Track & Views (M2, M4, M5)
- `AuraMascotWeb`:
  - `stage?: 1 | 2 | 3 | 4 | 5` (1=Dot, 2=Line, 3=Shape, 4=Pattern, 5=Insight)
  - `combo?: number` (backward compatible)
  - `state?: 'idle' | 'happy' | 'hit' | 'supernova' | 'thinking'`
  - `size?: number`
  - `speechText?: string`
  - `showTierBadge?: boolean`
  - `tailDirection?: 'down' | 'down-left' | 'down-right'`

### Track & Lesson Flow (M4 ↔ M5)
- Node completion contract:
  - `onNodeSelect(nodeId: string)` initiates lesson modal in `App.tsx`.
  - `onFinish(results: { xpEarned, accuracy, streak, secondsSaved })` updates user state and returns to `TrackView`.

## Code Layout
- `src/theme/tokens.ts`: Authoritative TypeScript tokens and brand palettes.
- `src/theme/theme.css`: Core CSS variables, light/dark mode root selectors, and 3D tactile button physics.
- `src/theme/ThemeContext.tsx`: Theme persistence and reactive context.
- `src/components/tactile/ThemeToggle.tsx`: Theme toggle button.
- `src/App.tsx`: App Shell, editorial header, bottom navigation bar, mobile device frame.
- `src/components/AuraMascotWeb.tsx`: Canonical SVG mascot, speech bubble, and pedagogical stages.
- `src/views/TrackView.tsx`: Living Notebook zigzag track, unit banner, Caixas de Descoberta, and Mestre dos Padrões.
- `src/components/tactile/TrackSerpentineNode.tsx`: 3D tactile track node with concentric progress ring and popover.
- `src/views/DuolingoLessonView.tsx`: Step-by-step microlesson, equation diagramming, and structural victory screen.
- `src/components/tactile/FeedbackDrawer.tsx`: Immediate non-punitive feedback drawer.
- `src/views/TrainHubView.tsx`: Cognitive training hub and Olho Matemático laboratory sheet.
- `test/e2e/*.test.mjs`: Node native test runner E2E and acceptance criteria suites.
