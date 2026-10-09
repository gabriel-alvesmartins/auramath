## 2026-10-01T19:15:01Z
You are teamwork_preview_worker implementing Milestone M1: Design System Foundations & Theming.
Your working directory is: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\worker_m1
Read the authoritative request at: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\ORIGINAL_REQUEST.md
Read the project specification at: c:\Users\Pichau\Desktop\Projetos\auramath\PROJECT.md
Read the deep design specifications at: c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\explorer_survey_2\handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You EXCLUSIVELY own and will create/modify:
- `src/theme/theme.css`
- `src/theme/tokens.ts`
- `src/theme/ThemeContext.tsx`
- `src/components/tactile/ThemeToggle.tsx`
- Minor wiring in `src/main.tsx` (importing `theme.css` and wrapping `<App />` in `<ThemeProvider>`) and `src/App.tsx` (adding `<ThemeToggle />` into the top header next to the audio toggle).
DO NOT touch any files in `apps/mobile/` or other views yet.

Implementation Details:
1. `src/theme/theme.css`:
   - Declare `:root, [data-theme="dark"]` for Dark Obsidian (`--color-bg-base: #0B0F19`, `--color-bg-surface: #131B2E`, `--color-bg-elevated: #1E293B`, `--color-text-primary: #F8FAFC`, `--color-text-secondary: #94A3B8`, `--color-brand: #0284C7`, `--color-brand-bevel: #0369A1`, `--color-success: #059669`, `--color-alert: #E11D48`, `--color-gold: #D97706`, etc.).
   - Declare `[data-theme="light"]` for Paper / Nebula Light (`--color-bg-base: #F8FAFC`, `--color-bg-surface: #FFFFFF`, `--color-bg-elevated: #F1F5F9`, `--color-text-primary: #0F172A`, `--color-text-secondary: #475569`, etc.).
   - Declare 3D depth and extrusion variables: `--extrusion-sm: 3px`, `--depression-sm: 2px`, `--extrusion-md: 4px`, `--depression-md: 3px`, `--extrusion-lg: 6px`, `--depression-lg: 4px`.
   - Declare tactile button CSS classes (`.aura-3d-btn`, `.aura-3d-btn--brand`, `.aura-3d-btn--success`, `.aura-3d-btn--alert`, `.aura-3d-btn--gold`, `.aura-3d-btn--neutral`) with strict 0ms sink latency on `:active` (`transform: translateY(3px); box-shadow: 0 1px 0 var(--btn-bevel); transition: none;`).
   - Declare strict anti-layout shift tabular font class: `.font-mono-tabular { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; font-feature-settings: 'tnum' 1; }`.
2. `src/theme/tokens.ts`:
   - Export typed design token constants for both Dark and Light modes, layout dimensions, and elevation helper functions.
3. `src/theme/ThemeContext.tsx`:
   - React Context managing `'dark' | 'light'`.
   - Reads initialization priority: `localStorage.getItem('auramath-theme')` -> `window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'`.
   - Synchronizes `document.documentElement.setAttribute('data-theme', theme)` and writes to `localStorage`.
   - Provides `useTheme() => { theme, toggleTheme, setTheme }`.
4. `src/components/tactile/ThemeToggle.tsx`:
   - Ergonomic 36x36dp tactile button with 3px extrusion.
   - Shows Lucide `Sun` icon in Dark mode and `Moon` icon in Light mode with smooth transition and procedural audio tick.
5. Wire `src/main.tsx` and `src/App.tsx`:
   - Ensure app renders cleanly in both Dark and Light modes without breaking any existing styles.
6. Verification:
   - Run `npm test` to ensure `@auramath/engine` tests remain 100% passing.
   - Run `npx vite build` to ensure production compilation succeeds with 0 errors.

Deliverable:
Write a comprehensive report to `c:\Users\Pichau\Desktop\Projetos\auramath\.agents\teamwork\worker_m1\handoff.md`.
Maintain `progress.md` in your directory. Send a message to orchestrator_1 when finished.
