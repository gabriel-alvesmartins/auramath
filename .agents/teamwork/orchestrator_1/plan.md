# Execution Plan: AuraMath UI Redesign & Tactile 3D Design System

## Objectives
Deliver a complete UI redesign of AuraMath with a proprietary Duolingo-inspired Tactile 3D Design System, native Light/Dark modes, fluid zigzag progression track with anchored mascot, micro-lessons with victory screen, and a unified training hub.

## Phases
1. **Phase 0: Scope Survey**
   - Dispatch 3 Explorers in parallel:
     - Explorer 1: Project structure, dependencies, build/test toolchain, current components and state management.
     - Explorer 2: Design system foundations, tokens, themes (Dark Obsidian / Paper Light), typography, 3D tactile CSS/tokens, component APIs.
     - Explorer 3: Screen workflows (Home zigzag track & mascot, Lesson flow & completion, Training Hub & game modes, Profile & radar).
2. **Phase 1: Architecture & Decomposition (PROJECT.md)**
   - Synthesize survey findings into PROJECT.md:
     - Architecture, Code Layout, Shared Interfaces, Feature Inventory.
     - Milestone breakdown (M1: Foundations & Theming, M2: 3D Components, M3: Zigzag & Mascot, M4: Micro-lesson & Victory, M5: Hub & Profile, M6: E2E Verification).
     - Parallel E2E Testing Track setup (TEST_INFRA.md, test cases across Tiers 1-4).
3. **Phase 2: Milestone Iteration & Execution**
   - Execute milestones using the Explorer -> Worker -> Reviewer -> Challenger -> Auditor cycle.
   - Rigorous audit gating on every milestone.
4. **Phase 3: E2E Test Suite & Adversarial Hardening**
   - Verify 100% test pass on `@auramath/engine` and clean `npx vite build`.
   - Verify all acceptance criteria.
   - Final review and handoff to Sentinel.
