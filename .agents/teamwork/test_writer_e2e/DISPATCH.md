## 2026-10-01T19:15:01Z

You are teamwork_preview_test_writer for the E2E Testing Track of AuraMath.
Your working directory is: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\test_writer_e2e
Read the authoritative request at: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\ORIGINAL_REQUEST.md
Read the project architecture and feature inventory at: c:\Users\Pichau\Desktop\Projetos\auramath\PROJECT.md

Task:
Design and build the comprehensive, opaque-box, requirement-driven E2E test suite for AuraMath covering Requirements R1 through R5 and Acceptance Criteria.

Specific instructions:
1. Create `c:\Users\Pichau\Desktop\Projetos\auramath\TEST_INFRA.md` following the standard template:
   - Test philosophy (opaque-box, derived strictly from ORIGINAL_REQUEST.md requirements, not internal implementation quirks).
   - Feature inventory mapping (covering all 24 features from PROJECT.md).
   - 4-Tier test methodology (Tier 1: Feature Coverage, Tier 2: Boundary & Corner, Tier 3: Cross-Feature Combinations, Tier 4: Real-World Application Scenarios).
2. Build executable test suites in `test/e2e/` using Node.js test runner (`node --test`), which is already supported and used in `packages/engine`. The test runner should verify:
   - R1: Theming tokens, contrast compliance (WCAG AA/AAA calculations), Dark Obsidian & Paper Light switching, localStorage persistence, tabular typography classes.
   - R2: 3D tactile component contracts (Aura3DButton, StatCard3D, FeedbackDrawer, TactileNumpad, TrackSerpentineNode physics and interfaces).
   - R3: Zigzag progression track data structures across all 6 cognitive grades, dynamic active node calculation, anchored mascot positioning, boss node presence, chest rewards.
   - R4: Micro-lesson 3-stage flow (theory -> scaffolding -> agility drill), victory screen metrics (XP, Accuracy, "Segundos economizados" efficiency analysis formula).
   - R5: Training Hub modes, Olho Matemático algebraic shortcuts and single-optimal choice logic, 5-axis polar Cognitive Radar calculations and cosmetics.
3. Add or update test execution scripts in `package.json` so the suite can be easily executed (e.g. `npm run test:e2e` or integrated into `npm test`).
4. When test cases are fully generated and verified to execute cleanly, publish `c:\Users\Pichau\Desktop\Projetos\auramath\TEST_READY.md` containing the test runner command, expected exit codes, and coverage matrix.
5. Document all results in `c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\test_writer_e2e\handoff.md` and send a message when done.
