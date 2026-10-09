## 2026-10-02T17:45:12Z
You are Worker M4 (Generation 2): Living Notebook Track & Nodes.
Your identity: teamwork_preview_worker
Your working directory: c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/teamwork_preview_worker_m4_2/
Caller/Parent conversation ID: 2f7fb863-0457-4780-9582-3735f6c86484

MANDATORY REQUIREMENTS:
1. You MUST read the authoritative user request at:
c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/ORIGINAL_REQUEST.md (specifically the section under ## 2026-10-02T13:26:38Z).
2. Read the master project plan at:
c:/Users/Pichau/Desktop/Projetos/auramath/PROJECT.md
3. Read Survey 2 Handoff report with exact Track specifications at:
c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/teamwork_preview_explorer_survey_2/handoff.md (especially Section 4.2)
4. Consult design system guidelines at:
c:\Users\Pichau\Desktop\Projetos\auramath\.agents\skills\impeccable\SKILL.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE OWNERSHIP:
You have exclusive write ownership over:
- `src/views/TrackView.tsx`
- `src/components/tactile/TrackSerpentineNode.tsx`

TASKS TO IMPLEMENT:
1. **Caderno Vivo Track Background (`src/views/TrackView.tsx`)**:
   - Apply clean millimeter-dotted graph paper background `.caderno-track-background`:
     `backgroundColor: 'var(--color-paper, #F7F4EA)'`, `backgroundImage: 'radial-gradient(var(--color-border-bold, #C2BDAE) 1.25px, transparent 1.25px)'`, `backgroundSize: '20px 20px'`.
   - Render continuous serpentine SVG path connecting node centers with dashed nanquim linework (`strokeDasharray="6 4"`), replacing the disconnected 3px vertical stick connectors.
2. **Unit Header Banner (`src/views/TrackView.tsx`)**:
   - Solid Verdigris `#176B5B` with 6px bevel `#104E42` and clean white/cream typography.
   - Replace the plain HTML button with a true 3D tactile button (`Aura3DButton` variant "paper" or "neutral") displaying `CADERNO GUIA` (ensure it contains `GUIA` to maintain test compatibility with `test/track-view.test.mjs`).
   - Guidebook modal styled in Verdigris and Cream/Paper (eliminating old `#0284C7` blue glow).
3. **3D Tactile Nodes (`src/components/tactile/TrackSerpentineNode.tsx`)**:
   - 3D ivory/pressed paper chassis with nanquim border definition: `border: '2px solid var(--color-ink, #202522)'`.
   - Completed nodes in solid Verdigris (`#176B5B`, bevel `#104E42`), active nodes in solid Marigold (`#F2B84B`, bevel `#D49A2E`), locked nodes in Cream (`#FFFDF6`, bevel `#C2BDAE`).
   - Concentric SVG progress ring and star orbit crown with crisp tactile bevel `boxShadow: '0 2px 0 var(--color-border-bold, #C2BDAE)'` (eliminating fuzzy black shadow).
   - Popover card in Cream/Ink with launch button in Verdigris.
4. **Discovery Boxes & Master of Patterns Modals (`src/views/TrackView.tsx`)**:
   - Replace cosmic chest modal with "Caixa de Descoberta" vector artwork and "+50 Pontos de Descoberta" (eliminate `/assets/cosmic_chest.jpg` and "Recompensa Cósmica").
   - Replace arcanum boss modal with "Mestre dos Padrões" vector artwork and "Desafio do Mestre dos Padrões" (eliminate `/assets/arcanum_boss.jpg`), while retaining button text "DESAFIAR ARCANO (+100 XP)" so existing test assertions pass 100%.

VERIFICATION:
You MUST run:
- `npm test` (must pass 100% with zero failures)
- `npx vite build` (must compile cleanly with zero errors)

OUTPUT REQUIREMENTS:
Write your completion report to `c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/teamwork_preview_worker_m4_2/handoff.md`.
Update `progress.md` in your directory.
Send a completion message via send_message to Recipient 2f7fb863-0457-4780-9582-3735f6c86484.
