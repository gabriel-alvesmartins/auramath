## 2026-10-02T14:10:16Z
You are Worker M3: Aura Mascot & Central Symbolism.
Your identity: teamwork_preview_worker
Your working directory: c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/teamwork_preview_worker_m3_1/
Caller/Parent conversation ID: 2f7fb863-0457-4780-9582-3735f6c86484

MANDATORY REQUIREMENTS:
1. You MUST read the authoritative user request at:
c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/ORIGINAL_REQUEST.md (specifically the section under ## 2026-10-02T13:26:38Z).
2. Read the master project plan at:
c:/Users/Pichau/Desktop/Projetos/auramath/PROJECT.md
3. Read Survey 2 Handoff report with exact Mascot specifications at:
c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/teamwork_preview_explorer_survey_2/handoff.md (especially Section 4.2)
4. Consult the design system excellence guidelines at:
c:\Users\Pichau\Desktop\Projetos\auramath\.agents\skills\impeccable\SKILL.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE OWNERSHIP:
You have exclusive write ownership over:
- `src/components/AuraMascotWeb.tsx`

TASKS TO IMPLEMENT IN `src/components/AuraMascotWeb.tsx`:
1. **Body & Anatomy**:
   - Clean editorial SVG geometric creature: smooth oval body (`rx=24, ry=27`) with nanquim ink stroke (`#202522`), warm cream fill (`#FFFDF6`), and soft chest spot in Verdigris Soft (`#DCEBE5`).
   - Expressive dot eyes (`• •`), subtle friendly smile, and antenna topped with the sacred Observation Dot (`●`) in Marigold (`#F2B84B`) with nanquim rim.
   - States: `'idle' | 'happy' | 'hit' | 'supernova' | 'thinking'`.
   - Embed self-contained `<style>` with `@keyframes mascotFloat` and `@keyframes mascotBlink` so Aura breathes and floats on any view without external dependencies!
2. **Pedagogical 5 Shapes Progression**:
   - Support direct prop `stage?: 1 | 2 | 3 | 4 | 5` (as well as combo fallback: 1=Dot, 2=Line, 3=Shape, 4=Pattern, 5=Insight):
     - Stage 1 (Dot / Observação): Sacred observation dot on antenna.
     - Stage 2 (Line / Conexão): Two dashed projection lines on sides (`strokeDasharray="2 2"`).
     - Stage 3 (Shape / Estrutura): Floating geometric lozenges/diamonds in Verdigris Soft (`#DCEBE5`) and Iris Soft (`#E8E3F3`).
     - Stage 4 (Pattern / Reconhecimento): Concentric geometric arc dots and millimeter tick markers framing the upper body.
     - Stage 5 (Insight / Antecipação): Radiating insight star or geometric aureole in Marigold/Verdigris around the observation dot.
3. **Newspaper Comic Speech Bubble**:
   - Editorial comic balloon in Cream `#FFFDF6` with 2px nanquim ink border `#202522`.
   - Clean triangular tail (with support for `tailDirection?: 'down' | 'down-left' | 'down-right'`).
   - Tactile paper shadow: `box-shadow: 0 4px 0 var(--color-border-bold, #C2BDAE), 0 2px 8px rgba(32, 37, 34, 0.08)`.
   - Tag badge: `<span style={{ color: 'var(--color-verdigris)' }}>● aura</span>`.

VERIFICATION:
You MUST run:
- `npm test` (must pass 100% with zero failures)
- `npx vite build` (must compile cleanly with zero errors)

OUTPUT REQUIREMENTS:
Write your completion report to `c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/teamwork_preview_worker_m3_1/handoff.md`.
Update `progress.md` in your directory.
Send a completion message via send_message to Recipient 2f7fb863-0457-4780-9582-3735f6c86484.
