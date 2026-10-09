## 2026-10-02T14:10:16Z
Worker M2: App Shell & Editorial Navigation.
Identity: teamwork_preview_worker
Working directory: c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/teamwork_preview_worker_m2_1/
Caller/Parent conversation ID: 2f7fb863-0457-4780-9582-3735f6c86484

MANDATORY REQUIREMENTS:
1. Read the authoritative user request at:
c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/ORIGINAL_REQUEST.md (specifically the section under ## 2026-10-02T13:26:38Z).
2. Read the master project plan at:
c:/Users/Pichau/Desktop/Projetos/auramath/PROJECT.md
3. Read Survey 1 Handoff report with exact App.tsx specifications at:
c:/Users/Pichau/Desktop/Projetos/auramath/.agents/teamwork/teamwork_preview_explorer_survey_1/handoff.md (especially Section 4.2)
4. Consult the design system excellence guidelines at:
c:\Users\Pichau\Desktop\Projetos\auramath\.agents\skills\impeccable\SKILL.md

EXCLUSIVE WRITE OWNERSHIP:
`src/App.tsx`

TASKS TO IMPLEMENT IN `src/App.tsx`:
1. Outer Shell & Container:
   - Eliminate cosmic radial gradients (`rgba(138, 43, 226, 0.15)`, `rgba(2, 132, 199, 0.08)`) and cosmic black backgrounds (`#030407`, `#07090E`).
   - Use warm paper background: `backgroundColor: 'var(--color-bg-base, #F7F4EA)'`.
   - Style the mobile frame with `maxWidth: '430px'`, `minHeight: '100vh'`, subtle paper border `1px solid var(--color-border-subtle, #D9D5C8)` and paper elevation shadow.
2. Editorial Header:
   - Solid background: `backgroundColor: 'var(--color-bg-surface, #FFFDF6)'`, border `1px solid var(--color-border-subtle, #D9D5C8)`.
   - Remove `backdropFilter: blur(...)`.
   - Logo: Replace uppercase `AURAMATH` and raster avatar with:
     - Vector avatar badge with observation dot.
     - Lowercase wordmark `aura●math` featuring the observation dot `●` in Verdigris (`var(--color-verdigris, #176B5B)`).
   - Streak Pill: Styled with Marigold soft background, 1.5px border, and 2px tactile bevel.
   - Discovery Stars Pill: Styled with Verdigris soft background, 1.5px border, and 2px tactile bevel.
   - Maintain `<ThemeToggle />` and audio mute button (using `.aura-3d-btn--neutral`).
3. Editorial Tactile Bottom Bar:
   - Solid background: `backgroundColor: 'var(--color-bg-surface, #FFFDF6)'`, `borderTop: '1px solid var(--color-border-subtle, #D9D5C8)'`.
   - Remove `backdropFilter: blur(...)`.
   - 5 tabs: Trilha (`Compass`), Treino (`Zap`), Duelos (`Swords`), Lab (`Shapes`), Perfil (`User`).
   - Active tab state: Clean tactile pill in Verdigris Soft (`#DCEBE5`) with 1.5px Verdigris border and 2px bevel `0 2px 0 var(--color-verdigris-bevel, #104E42)`, with icon and label in Verdigris (`#176B5B`). Inactive tabs in pencil/ink secondary (`#5C645F`).

VERIFICATION:
Run `npm test` and `npx vite build`.
Output handoff.md, progress.md, send_message.
