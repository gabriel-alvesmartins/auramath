# Handoff Report — Survey 3: Exercise, Feedback, Victory Screens (R5) & Testing/Build Infrastructure

**Author**: Explorer Survey 3 (`teamwork_preview_explorer`)  
**Date**: 2026-10-02  
**Target Milestone**: Rebrand 01.1 — “Matemática como descoberta” (Tagline: “Não calcule. Veja.”)  
**Integrity Mode**: read-only investigation  

---

## 1. Observation

### 1.1 Testing & Build Toolchain Commands and Execution

#### Command 1: `npm test`
- **Executed Command**: `npm test` in `c:/Users/Pichau/Desktop/Projetos/auramath`
- **Result**: Exit code `0` (Success).
- **Duration**: ~284 ms.
- **Output Snippet**:
  ```
  > auramath-workspace@1.0.0 test
  > npm run test --workspaces --if-present && npm run test:e2e

  > @auramath/engine@1.0.0 test
  > node --test test/engine.test.mjs

  ▶ @auramath/engine Core Verification
    ✔ TRACK_GRADES covers all 6 Cognitive Grades (0.82ms)
    ✔ generateQuestion produces valid arithmetic equations and answers (1.38ms)
    ...
  ✔ @auramath/engine Core Verification (5.46ms)
  ℹ tests 9 | suites 1 | pass 9 | fail 0

  > auramath-workspace@1.0.0 test:e2e
  > node --experimental-strip-types --test test/e2e/*.test.mjs

  ▶ Cross-Cutting Application Scenarios & Adversarial Verification (F24) ...
  ▶ R1: Design System Foundations & Theming (F1-F4) ...
  ▶ R2: 3D Tactile Component Library (F5-F9) ...
  ▶ R3: Zigzag Progression Track & Mascot Anchoring (F10-F13) ...
  ▶ R4: Micro-lesson Flow & Celebration Screen (F14-F18) ...
  ▶ R5: Training Hub, Game Modes & Cognitive Profile (F19-F22) ...
  ℹ tests 69 | suites 30 | pass 69 | fail 0
  ```
- **Analysis**:
  - The workspace test runner is **Node.js Native Test Runner** (`node --test`) using `--experimental-strip-types`.
  - There is **no Vitest and no Jest** active in the root pipeline. While `packages/engine/package.json` contains `jest` in `devDependencies`, its test script runs `node --test test/engine.test.mjs`.
  - There is **no headless browser / Playwright / Cypress harness**. Tests are fast unit/contract tests executing AST pattern searches, invariant calculations, and token imports.
  - Total tests executed by `npm test`: **78 tests (9 engine + 69 E2E)**.

#### Command 2: `npm run build --workspace=@auramath/engine`
- **Executed Command**: `npm run build --workspace=@auramath/engine`
- **Result**: Exit code `0` (Success).
- **Execution**: Runs `tsc` inside `packages/engine`. Compiles types and ES modules into `packages/engine/dist/` without any error.

#### Command 3: `npx vite build`
- **Executed Command**: `npx vite build`
- **Result**: Exit code `1` (CRITICAL FAILURE).
- **Verbatim Error Output**:
  ```
  vite v5.4.21 building for production...
  transforming...
  ✓ 9 modules transformed.
  x Build failed in 2.23s
  error during build:
  [vite:esbuild] Transform failed with 3 errors:
  C:/Users/Pichau/Desktop/Projetos/auramath/src/views/TrackView.tsx:693:12: ERROR: Unexpected closing "div" tag does not match opening "button" tag
  C:/Users/Pichau/Desktop/Projetos/auramath/src/views/TrackView.tsx:694:9: ERROR: The character "}" is not valid inside a JSX element
  C:/Users/Pichau/Desktop/Projetos/auramath/src/views/TrackView.tsx:697:6: ERROR: Expected ")" but found "{"
  file: C:/Users/Pichau/Desktop/Projetos/auramath/src/views/TrackView.tsx:693:12
  ```
- **Exact Code Location in `src/views/TrackView.tsx`**:
  - Lines 608–639:
    ```tsx
    <button
      type="button"
      onClick={() => handleBossClick(gradeBoss, isAllGradeCompleted)}
      ...
      className={`aura-3d-btn boss-castle-button ...`}
      style={{ ... }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        ...
      </div>
      <span>{isAllGradeCompleted ? 'MESTRE' : 'BLOQUEADO'}</span>
    ```
  - Notice: The `<button>` tag opened at line 608 is **never closed with `</button>`**!
  - Instead, lines 667–692 place a separate `<div style={{ textAlign: 'center', marginTop: '10px', maxWidth: '170px' }}>...</div>` inside the button, and at line 693 an un-matched `</div>` appears where `</button>` was expected.
  - This syntax error breaks the production build completely.

---

### 1.2 Exercise & Microlesson Screen (`src/views/DuolingoLessonView.tsx`)

#### File State & Metrics
- **Path**: `src/views/DuolingoLessonView.tsx`
- **Size**: 49,397 bytes (1,451 lines).
- **Component**: `DuolingoLessonView: React.FC<DuolingoLessonViewProps>`
- **Step Architecture**:
  - `'theory'` (Lines 879–1043): Rapid theory presentation.
  - `'scaffolding'` (Lines 1049–1209): Interactive blanks parsing template string (`/(\{.*?\})/g`).
  - `'drill'` (Lines 1215–1283): 5-question agility drill.

#### Question Rendering & Answer Input (Step 3: Drill)
- **Lines 1238–1254**:
  ```tsx
  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-brand)', ... }}>
    {currentQ.technique || node.technique || 'Cálculo Mental Rápido'}
  </div>
  <div
    className="font-mono-tabular"
    style={{
      fontSize: '2.5rem',
      fontWeight: 900,
      color: 'var(--color-text-primary)',
      letterSpacing: '0.02em',
      margin: '4px 0 16px',
      fontFamily: 'var(--font-mono)',
    }}
  >
    {currentQ.equation}
  </div>
  ```
- **Observations on Question Rendering**:
  - The equation is rendered as a raw plain-text string (e.g. `"68 + 27"` or `"48 × 5"`).
  - There are **no visual diagramming elements, no arrows, and no relational indicators** in the drill stage.
- **Answer Input (Lines 1256–1283 & 1324–1332)**:
  - Input box displaying `inputVal` or placeholder `"Digite o resultado..."`.
  - Driven by `TactileNumpad` (56dp touch targets with 0ms mechanical sink).
  - Verified by `handleVerify` callback (lines 248–280).

#### Cosmic / Neon Remnants in `DuolingoLessonView.tsx`
- **Line 174, 268, 305**:
  `colors: ['#00F2FE', '#8A2BE2', '#FACC15', '#10B981']` (Neon Cyan `#00F2FE` and Purple `#8A2BE2` in canvas-confetti calls).
- **Line 259**: `newCombo > 2 ? 'Incrível! Combo x${newCombo} cósmico!' : ...`
- **Line 380**: `'Energia cósmica recarregada! Vamos continuar!'`
- **Line 446**: `<img src="/assets/aura_celebrate.jpg" alt="Aura Celebrate" ... />` (Raster image with glowing gold/brand box-shadow).
- **Line 488**: `label="XP Cósmico"`
- **Line 645**: `<Aura3DButton variant="brand" size="lg" fullWidth>CONTINUAR</Aura3DButton>`
- **Line 1349, 1385**: `"Recarga de Foco Cósmica"` and `"Seus cristais esgotaram!"` (Cyberpunk lore).

---

### 1.3 Feedback Drawer (`src/components/tactile/FeedbackDrawer.tsx`)

#### File State & Metrics
- **Path**: `src/components/tactile/FeedbackDrawer.tsx`
- **Size**: 7,769 bytes (231 lines).
- **Component**: `FeedbackDrawer: React.FC<FeedbackDrawerProps>`

#### Current Implementation Observations
- **Lines 73–77**:
  ```tsx
  backgroundColor: 'var(--color-cream, #FFFDF6)',
  borderTop: `3px solid ${isCorrect ? 'var(--color-verdigris, #176B5B)' : 'var(--color-coral, #E76F61)'}`,
  boxShadow: isCorrect
    ? '0 -8px 28px rgba(23, 107, 91, 0.15), 0 0 1px var(--color-border-bold, #C2BDAE)'
    : '0 -8px 28px rgba(231, 111, 97, 0.15), 0 0 1px var(--color-border-bold, #C2BDAE)',
  ```
- **Lines 117–118**:
  ```tsx
  backgroundColor: isCorrect ? 'var(--color-verdigris-soft, #DCEBE5)' : 'var(--color-coral-soft, #F8DED9)',
  border: `2px solid ${isCorrect ? 'var(--color-verdigris, #176B5B)' : 'var(--color-coral, #E76F61)'}`,
  ```
- **Lines 144**:
  ```tsx
  {isCorrect ? 'Descoberta Brilhante! ✦' : 'Veja a estrutura oculta:'}
  ```
- **Line 202**:
  ```tsx
  <Aura3DButton
    variant={isCorrect ? 'success' : 'alert'}
    fullWidth
    size="lg"
    onClick={onContinue}
  >
  ```
- **Observations on Gaps**:
  - The header title and border styling have already been partially updated to Verdigris and Coral Soft.
  - However, the continue button still passes `variant="success"` and `variant="alert"` (lines 202) instead of the semantic Rebrand 01.1 variants `variant="verdigris"` and `variant="coral"`.
  - Legacy test `test/components-tactile.test.mjs` failed because it expected `var(--color-success)` instead of `var(--color-verdigris)`.

---

### 1.4 Victory Screen ("Lesson Complete")

#### Current Implementation (`DuolingoLessonView.tsx` lines 388–649)
- **Trigger**: `isVictory === true` (after question 5).
- **Mascot Presentation (Lines 431–450)**:
  - 160px circular avatar with `border: '3px solid var(--color-gold)'` and `boxShadow: '0 0 32px var(--color-gold-surface), 0 0 48px var(--color-brand-surface)'`.
  - Loads raster JPEG `/assets/aura_celebrate.jpg`.
- **Title**: `"Lição Concluída!"` with subtitle `"${node.title} dominada com maestria!"`.
- **Dual Cards (Lines 486–502)**:
  - `StatCard3D` with `variant="xp"`, `label="XP Cósmico"`, `value="+${xpEarned}"`, `sublabel="Ofensiva de 19 dias!"`, Lucide `<Zap />`.
  - `StatCard3D` with `variant="accuracy"`, `label="Precisão"`, `value="${accuracy}%"`, `sublabel="Maestria mental"`, Lucide `<Target />`.
- **Efficiency Analysis Card (Lines 505–627)**:
  - Card with `label="Segundos economizados"`, badge `"${efficiencyMultiplier}x mais veloz"`, big tabular numeral `"+${secondsSaved}s"`.
  - Sublabel: `"tempo poupado vs lápis & papel"`.
  - Comparison text: `"Você calculou em X.Xs vs Y.Ys no método tradicional com lápis e papel."`
  - Visual speed progress bar.
- **Button (Lines 631–647)**:
  - `<Aura3DButton variant="brand" size="lg" fullWidth onClick={...}>CONTINUAR</Aura3DButton>`.

---

### 1.5 Training Hub & "Olho Matemático" (`src/views/TrainHubView.tsx`)

#### File State & Metrics
- **Path**: `src/views/TrainHubView.tsx`
- **Size**: 24,364 bytes (748 lines).
- **Component**: `TrainHubView: () => JSX.Element`
- **Submodes (Line 17)**: `'arena' | 'pattern' | 'blitz' | 'sudden' | 'anzan' | 'zen'`.

#### Current Implementation Observations
- **Mode Bar (Lines 219–268)**:
  - Sticky horizontal bar with 6 modes.
  - Buttons styled with `className={['aura-3d-btn', 'aura-3d-btn--sm', isActive ? 'aura-3d-btn--brand' : 'aura-3d-btn--neutral'].join(' ')}`.
- **Mascot (Lines 362 & 612)**:
  - Imports and uses `<AuraAvatar />` (old circular image avatar), NOT `AuraMascotWeb`.
- **Olho Matemático Stage (`subMode === 'pattern'`, Lines 350–552)**:
  - Uses `patternQ = generatePatternRecognitionQuestion()`.
  - Technique badge: `var(--color-brand-surface)` and `var(--color-brand)`.
  - Equation: `patternQ.equation` in `2.6rem`.
  - Options list: buttons with `.aura-3d-shortcut-card`.
  - Selection: sets `selectedOptionId`. Optimal shows green check (`var(--color-success)`), suboptimal shows red cross (`var(--color-alert)`).
  - Shortcut insight: `<div style={{ backgroundColor: 'var(--color-bg-surface)' }}>` with "Insight do Atalho:" and button "Próximo Reconhecimento ➔".
- **Game Over Screen (Lines 684–744)**:
  - Cosmic background `rgba(11, 15, 25, 0.88)` with blur.
  - Lore copy: `"Pontuação registrada no córtex neural."`

---

## 2. Logic Chain

```
[Observation 1.1: `npx vite build` fails with 3 JSX errors in `src/views/TrackView.tsx:693:12`]
   │
   ├──> [Reasoning Step 1]: In `TrackView.tsx`, the `<button>` opened at line 608 for the
   │    Mestre dos Padrões (boss node) was never closed before the label div at line 667,
   │    leaving JSX tags unclosed and crashing esbuild during `npx vite build`.
   │
   └──> [Direct Impact]: Acceptance Criterion "npx vite build compila o simulador web com
        zero erros" cannot pass until this JSX nesting syntax defect is corrected.

[Observation 1.2: `DuolingoLessonView.tsx` renders equation as bare text without diagrams]
   │
   ├──> [Reasoning Step 2]: In Step 3 (agility drill), `currentQ.equation` is rendered inside
   │    a static `div` (`font-mono-tabular`) without graphical relations.
   │
   └──> [Requirement Gap R5]: Rebrand 01.1 specifically requires:
        "equações diagramadas visualmente com setas e relações antes da execução ('Não calcule. Veja.')."
        Students must see structural decomposition (e.g. halve-and-double arrows for Factor 5,
        pivot branches for Difference of Squares, compensation jumps) to foster pattern recognition.

[Observation 1.3: `FeedbackDrawer.tsx` uses `variant="success"`/`"alert"` on continue button]
   │
   ├──> [Reasoning Step 3]: While the drawer chassis has been upgraded to Cream `#FFFDF6` and
   │    headers to Verdigris/Coral, the action button uses legacy blue/red semantic variants.
   │
   └──> [Requirement Gap R5]: To ensure 100% adherence to Rebrand 01.1 non-punitive physical tactile
        styling, the button must use `variant="verdigris"` (correct) and `variant="coral"` (adjustment).

[Observation 1.4: Victory screen has raster JPEG `aura_celebrate.jpg`, "XP Cósmico", and "CONTINUAR"]
   │
   ├──> [Reasoning Step 4]: The victory screen retains cosmic theme assets: raster image, neon
   │    confetti (`#00F2FE`, `#8A2BE2`), cosmic XP copy, and a generic button label.
   │
   └──> [Requirement Gap R5]: Rebrand 01.1 requires:
        1. Editorial SVG `AuraMascotWeb` (state "happy" or "supernova") replacing raster JPEG.
        2. Celebrating structural recognition: "Estrutura Reconhecida! ✦".
        3. 3D editorial cards for "Pontos de Descoberta" (XP) and "Precisão".
        4. "Segundos economizados pensando antes de calcular" efficiency card.
        5. Full-width 3D continue button with copy "PRÓXIMO INSIGHT ➔" in Verdigris.

[Observation 1.5: `TrainHubView.tsx` uses `AuraAvatar`, cybernetic lore, and generic cards]
   │
   ├──> [Reasoning Step 5]: Olho Matemático does not visually reflect the laboratory/notebook aesthetic.
   │
   └──> [Requirement Gap R5]: TrainHub and Olho Matemático must be styled as laboratory sheets /
        notebook cards (fichas de laboratório com grelha de caderno, carimbo de observação,
        cabeçalho de hipótese e espécimes de atalho).

[Observation 1.1: `test/e2e/*.test.mjs` has hardcoded regexes for old 2026-10-01 strings]
   │
   ├──> [Reasoning Step 6]: `test/e2e/r4-microlesson-celebration.test.mjs` asserts on `/XP Cósmico/`,
   │    `/aura_celebrate\.jpg/`, and `/CONTINUAR/`.
   │
   └──> [Verification Consequence]: When implementing Rebrand 01.1 in `DuolingoLessonView.tsx`,
        the E2E test assertions must be updated to match the new editorial strings ("Pontos de Descoberta",
        "PRÓXIMO INSIGHT ➔", SVG mascot) so `npm test` continues to pass 100%.
```

---

## 3. Caveats

1. **Scope Boundary**: As an Explorer, this investigation is strictly **read-only**. No application files in `src/` or `packages/` were modified.
2. **Build Failure Dependency**: `npx vite build` fails on `TrackView.tsx` (an R4 surface). That file is being surveyed by Survey 2. However, the exact syntax error and line range have been documented here because build verification is a primary acceptance criterion across all features.
3. **Engine Tests vs E2E Tests**: `@auramath/engine` produces question equations procedurally. Equation diagramming can either be dynamically derived from the question's `technique` and `hint` fields or augmented via an engine helper function. Both approaches are viable; deriving it visually from `technique` requires zero schema breaking changes in the engine.
4. **No True Browser Headless Engine**: Tests execute in Node.js runtime without DOM layout calculation. Font loading (`JetBrains Mono`, `Plus Jakarta Sans`) and CSS box-shadow visual rendering cannot be verified by `npm test` alone; they require Vite visual preview inspection.

---

## 4. Conclusion & Concrete Architectural Recommendations

### 4.1 Solution Architecture for Equation Diagramming ("Não calcule. Veja.")
In `src/views/DuolingoLessonView.tsx`:
- Before or directly framing `{currentQ.equation}`, render a `VisualEquationDiagram` component.
- The diagram decomposes the equation into its visual structural representation based on `currentQ.technique`:

```tsx
interface VisualEquationDiagramProps {
  equation: string;
  technique?: string;
  hint?: string;
  isExpanded?: boolean;
}
```

#### Diagram Visual Schemas:
1. **Fator 5 (Halve & Double)** (e.g. `48 × 5`):
   - Left branch: `48` with curved arrow pointing to `24` labeled `(÷ 2)`.
   - Right branch: `5` with curved arrow pointing to `10` labeled `(× 2)`.
   - Resulting insight: `24 × 10 = 240`.
   - Banner: `"NÃO CALCULE. VEJA: Dobre o 5 e reduza a metade o 48."`
2. **Diferença de Quadrados** (e.g. `48 × 52`):
   - Center pivot node: `50` in Marigold `#F2B84B`.
   - Left branch: `50 - 2` in Coral `#E76F61`.
   - Right branch: `50 + 2` in Verdigris `#176B5B`.
   - Formula ribbon: `50² - 2² = 2500 - 4 = 2496`.
3. **Compensação Subtrativa** (e.g. `134 - 78`):
   - `78` connects to `80` with arched arrow `+ 2 (arredonda)`.
   - Subtraction: `134 - 80 = 54`.
   - Refund arrow: `54 + 2 = 56`.
4. **Multiplicação por 11** (e.g. `43 × 11`):
   - `4` and `3` open up with arrows leaving a slot for `(4 + 3 = 7)`: `4 [ 7 ] 3 = 473`.

### 4.2 Rebrand of Victory Screen ("Lesson Complete")
Update `DuolingoLessonView.tsx` lines 388–649:
1. **Mascot**:
   ```tsx
   <AuraMascotWeb
     size={130}
     state="happy"
     showTierBadge={false}
     speechText="Estrutura matemática dominada!"
   />
   ```
2. **Title**:
   - `<h1>Estrutura Reconhecida! ✦</h1>` in `var(--color-ink, #202522)`.
   - `<p>{node.title} — Descoberta Consolidada</p>` in `var(--color-ink-secondary, #5C645F)`.
3. **Side-by-Side 3D Metric Cards**:
   - Card 1: `label="Pontos de Descoberta"`, `value="+${xpEarned}"`, `sublabel="Ofensiva de ${currentStreak} dias!"`, `variant="xp"`.
   - Card 2: `label="Precisão"`, `value="${accuracy}%"`, `sublabel="Reconhecimento visual"`, `variant="accuracy"`.
4. **Efficiency Analysis Card**:
   - Header: `"Segundos economizados pensando antes de calcular"`.
   - Value: `"+${secondsSaved}s"`.
   - Subtitle: `"Você reconheceu a estrutura em ${actualTimeSeconds.toFixed(1)}s vs ${standardTimeSeconds.toFixed(1)}s no cálculo mecânico tradicional."`.
5. **CTA Button**:
   ```tsx
   <Aura3DButton
     variant="verdigris"
     size="lg"
     fullWidth
     onClick={() => onFinish({ xpEarned, accuracy, streak: currentStreak, secondsSaved })}
   >
     PRÓXIMO INSIGHT ➔
   </Aura3DButton>
   ```
6. **Confetti Colors**:
   - `colors: ['#176B5B', '#F2B84B', '#E76F61', '#6E5AA6', '#202522']`.

### 4.3 Rebrand of FeedbackDrawer (`src/components/tactile/FeedbackDrawer.tsx`)
1. Change button variants on line 202:
   ```tsx
   <Aura3DButton
     variant={isCorrect ? 'verdigris' : 'coral'}
     fullWidth
     size="lg"
     onClick={onContinue}
   >
   ```
2. Wrap shortcut explanation in an editorial notebook card with soft dashed border and ink text.

### 4.4 Laboratory Sheet Styling for `TrainHubView.tsx` ("Olho Matemático")
1. Replace `AuraAvatar` with `AuraMascotWeb` (state `"idle"` or `"thinking"`, size 76).
2. Style the background with a subtle millimeter grid pattern:
   `backgroundImage: 'radial-gradient(circle, var(--color-border-bold, #C2BDAE) 1px, transparent 1px)'`, `backgroundSize: '16px 16px'`.
3. Header badge: `"LABORATÓRIO COGNITIVO • FICHA Nº [ID]"` with `"HIPÓTESE: Não calcule. Identifique o atalho algébrico ótimo."`.
4. Render shortcut options as notebook specimen cards (Ficha A, B, C, D) with cream background and 3D bevel.
5. In game over overlay, replace "córtex neural" with:
   - `"Relatório de Sessão do Laboratório"`.
   - `"Descobertas Registradas: ${score} Pontos"`.
   - Button: `<Aura3DButton variant="verdigris" size="lg">NOVA SESSÃO DE LABORATÓRIO</Aura3DButton>`.

### 4.5 Testing & Build Remediation Strategy
1. **Fix `src/views/TrackView.tsx` JSX tag mismatch**:
   - Close `<button>` after the label content, replacing the stray `</div>` tag at line 693.
   - Run `npx vite build` to confirm zero errors.
2. **Update `test/e2e/r4-microlesson-celebration.test.mjs`**:
   - Update string assertions to match Rebrand 01.1:
     - `/aura_celebrate\.jpg/` -> `/AuraMascotWeb/`
     - `/XP Cósmico/` -> `/Pontos de Descoberta/`
     - `/CONTINUAR/` -> `/PRÓXIMO INSIGHT/`
3. **Update `test/e2e/r1-foundations-theming.test.mjs`**:
   - Align token checks if default theme becomes Light Mode (Paper `#F7F4EA` and Cream `#FFFDF6`).

---

## 5. Verification Method

### Step-by-Step Commands to Independently Verify:

1. **Verify Current Engine Build & Test Suite**:
   ```bash
   npm run build --workspace=@auramath/engine
   # Expected: Exit code 0, clean tsc compilation
   npm test
   # Expected: Exit code 0, 78 tests pass (9 engine + 69 E2E)
   ```

2. **Verify Vite Build Failure in `TrackView.tsx`**:
   ```bash
   npx vite build
   # Expected: Exit code 1 with error at src/views/TrackView.tsx:693:12
   ```

3. **Verify Cosmic Tokens and Strings in `DuolingoLessonView.tsx`**:
   ```bash
   # Inspect cosmic image and strings
   Select-String -Path src/views/DuolingoLessonView.tsx -Pattern "aura_celebrate|XP Cósmico|CONTINUAR|#00F2FE|#8A2BE2|córtex|cristais"
   ```

4. **Verify FeedbackDrawer Button Variants**:
   ```bash
   # Check line 202
   Select-String -Path src/components/tactile/FeedbackDrawer.tsx -Pattern "variant="
   ```

5. **Verify TrainHubView Mascot and Lore**:
   ```bash
   # Check AuraAvatar and neural cortex references
   Select-String -Path src/views/TrainHubView.tsx -Pattern "AuraAvatar|córtex|aura-3d-btn--brand"
   ```

6. **Post-Implementation Verification Invariant**:
   After the implementing agent applies the changes:
   - `npx vite build` must exit with code `0`.
   - `npm test` must pass 100% of tests.
   - Zero occurrences of `#00F2FE`, `#8A2BE2`, or `aura_celebrate.jpg` in active UI views.
