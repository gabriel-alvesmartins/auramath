## 2026-10-02T13:44:03Z
You are Worker M1: Design System & Theming Foundations.
Your identity: teamwork_preview_worker
Your working directory: c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/teamwork_preview_worker_m1_1/
Caller/Parent conversation ID: 2f7fb863-0457-4780-9582-3735f6c86484

MANDATORY REQUIREMENTS:
1. You MUST read the authoritative user request at:
c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/ORIGINAL_REQUEST.md (specifically the section under ## 2026-10-02T13:26:38Z).
2. Read the master project plan at:
c:/Users/Pichau/Desktop/Projetos/auramath/PROJECT.md
3. Read the detailed Survey 1 Handoff report with exact code replacements at:
c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/teamwork_preview_explorer_survey_1/handoff.md
4. Consult design system guidelines at:
c:\Users\Pichau\Desktop\Projetos\auramath\.agents\skills\impeccable\SKILL.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE OWNERSHIP:
You have exclusive write ownership over:
- `src/theme/tokens.ts`
- `src/theme/theme.css`
- `index.html`
- `src/components/tactile/ThemeToggle.tsx`
- `src/views/TrackView.tsx` (ONLY to fix the unclosed `<button>` at line 608–694 so `npx vite build` compiles cleanly)

TASKS TO IMPLEMENT:
1. In `src/theme/tokens.ts`:
   - Consolidate full semantic tokens for Rebrand 01.1: Paper (`#F7F4EA`), Cream (`#FFFDF6`), Ink (`#202522`), Ink Secondary (`#5C645F`), Verdigris (`#176B5B`), Verdigris Bevel (`#104E42`), Verdigris Soft (`#DCEBE5`), Marigold (`#F2B84B`), Marigold Bevel (`#D49A2E`), Marigold Soft (`#FFF0C9`), Coral (`#E76F61`), Coral Bevel (`#C75144`), Coral Soft (`#F8DED9`), Iris (`#6E5AA6`), Iris Bevel (`#524080`), Iris Soft (`#E8E3F3`), Paper bevels (`#D9D5C8` / `#C2BDAE`).
   - Eliminate or replace neon cyans/purples in active styles. Ensure test compatibility with `test/e2e/r1-foundations-theming.test.mjs` (alias or maintain backward-compatible exported names).
2. In `src/theme/theme.css`:
   - Set Light Mode (Paper `#F7F4EA` and Cream `#FFFDF6`) as the immediate operational `:root` default!
   - Configure Dark Mode based on Mineral Ink (`#202522`) and Paper (`#F7F4EA`), eliminating cosmic blacks `#030407` and `#07090E`.
   - Ensure 3D tactile button styles `.aura-3d-btn` support all rebrand variants (`--verdigris`, `--marigold`, `--coral`, `--iris`, `--paper`, `--neutral`) with 0ms sink latency.
3. In `index.html`:
   - Update tag to `<html lang="pt-BR" data-theme="light">`.
   - Update title to `<title>Auramath | Não calcule. Veja.</title>`.
   - Replace dark inline fallback styles (`#07090E`) with Paper `#F7F4EA` and Cream `#FFFDF6` to completely prevent any dark flash on cold page load.
4. In `src/components/tactile/ThemeToggle.tsx`:
   - Refine colors to use Verdigris/Marigold/Ink rather than legacy cyan/blue.
5. In `src/views/TrackView.tsx`:
   - Fix the JSX syntax error at lines 608–694: ensure the `<button>` opened at line 608 is properly closed with `</button>` instead of mismatched `</div>`.

VERIFICATION:
You MUST run:
- `npm test` (must pass 100% with zero failures)
- `npx vite build` (must compile cleanly with zero errors)
- `npm run build --workspace=@auramath/engine` (must compile cleanly)

OUTPUT REQUIREMENTS:
Write your completion report to `c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/teamwork_preview_worker_m1_1/handoff.md`.
Update `progress.md` in your directory.
Send a completion message via send_message to Recipient 2f7fb863-0457-4780-9582-3735f6c86484 with the test and build results.
