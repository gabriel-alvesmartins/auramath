## 2026-10-01T19:42:47Z

You are teamwork_preview_worker implementing Milestone M3: Zigzag Progression Track & Mascot Anchoring.
Your working directory is: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\worker_m3
Read the authoritative request at: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\ORIGINAL_REQUEST.md
Read the project specification at: c:\Users\Pichau\Desktop\Projetos\auramath\PROJECT.md
Read the survey findings at: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\explorer_survey_3\handoff.md
Read reviewer recommendations at: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\reviewer_m2_2\handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You EXCLUSIVELY own and will modify:
- `src/views/TrackView.tsx`
And create:
- `test/track-view.test.mjs`

Detailed Requirements:
1. Reconstruct `src/views/TrackView.tsx`:
   - Fluid zigzag serpentine progression track covering all 6 Cognitive Grades from `TRACK_GRADES` (`@auramath/engine`).
   - Top sliding unit selector with smooth tab switching across the 6 grades, unit banner, and "GUIA" button triggering pedagogical guidebook modal.
   - Nodes: Utilize `TrackSerpentineNode` from `@/components/tactile` with concentric SVG progress ring (`strokeDashoffset`), Star Orbit Crown (3 stars), and action popover card with lesson title, XP reward, and full-width `Aura3DButton` to launch the lesson (`onStartLesson`).
   - Dynamic Mascot Anchoring: Find the player's active in-progress node (first node where `!nodeProgress[node.id]?.completed`). Render `AuraMascotWeb` anchored adjacent to this active node with floating animation and contextual speech bubbles ("Vamos treinar!", "Domine este atalho!", "Você consegue!").
   - Dynamic Mascot Orientation: Position the mascot on the left when the node is offset to the right, and on the right when the node is offset to the left, preventing clipping on 360-430px viewports.
   - Reward Chests: Intercalate interactive cosmic treasure chests along the path that open when reached, awarding bonus XP/stars with audio feedback (`audioSynth.playChestReward()`).
   - Boss Castle Nodes: Render a culminating Boss Castle node at the end of each grade track that links to the corresponding Arcanum Boss from `BOSS_LIST` (`@auramath/engine`).
   - Dual Theme Support: Use semantic CSS custom properties (`var(--color-bg-base)`, `var(--color-text-primary)`, `var(--color-brand)`, etc.) so the entire track seamlessly supports Dark Obsidian and Paper Light modes.
2. Automated Test Suite:
   - Create `test/track-view.test.mjs` verifying:
     - Active node detection across different completion states.
     - Serpentine alternating offsets.
     - Dynamic mascot socket attachment to the active node.
     - Presence of Boss Castle nodes for all 6 grades.
     - Cosmic chest placement and reward logic.
3. Verification:
   - `npm test` passes 100%.
   - `node --test test/track-view.test.mjs` passes 100%.
   - `npx vite build` compiles cleanly with 0 TypeScript/CSS/JSX errors.

Deliverable:
Write a comprehensive report to `c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\worker_m3\handoff.md`.
Maintain `progress.md`. Send a message when finished.
