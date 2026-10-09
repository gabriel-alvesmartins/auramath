# E2E Test Infra: Auramath Rebrand 01.1

## Test Philosophy
- Opaque-box, requirement-driven. Derives from user requirements and Rebrand 01.1 design specifications.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial + Real-World Workload Testing.

## Feature Inventory Mapping
| # | Feature | Source (Requirement) | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Workload) |
|---|---------|---------------------|:----------------:|:-----------------:|:-----------------:|:-----------------:|
| F1 | Semantic Tokens & Palette | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| F2 | Immediate Light Mode Default | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| F3 | Refined Mineral Dark Mode | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| F4 | 3D Tactile Button Styles | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ | ✓ |
| F5 | App Shell Frame Redesign | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| F6 | Editorial Header `aura●math` | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| F7 | Editorial Bottom Bar (5 Tabs) | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ | ✓ |
| F8 | Aura Editorial SVG Mascot | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| F9 | Newspaper Comic Speech Bubble | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| F10 | 5 Pedagogical Stages Progression | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ | ✓ |
| F11 | TrackView Syntax Correction | Build & Acceptance Criteria | 5 | 5 | ✓ | ✓ |
| F12 | Millimeter-Dotted Notebook Track | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| F13 | Serpentine Connector Path | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| F14 | Solid Verdigris Unit Banner | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| F15 | 3D Ivory/Paper Track Nodes | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| F16 | Caixas de Descoberta & Mestre dos Padrões | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ | ✓ |
| F17 | Visual Equation Diagrams | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| F18 | Non-Punitive Feedback Drawer | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| F19 | Structural Recognition Victory Screen | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| F20 | Laboratory Notebook Train Hub | ORIGINAL_REQUEST R5 | 5 | 5 | ✓ | ✓ |
| F21 | Full Verification & Hardening | Acceptance Criteria | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Test Runner**: Node.js Native Test Runner (`node --test`).
- **Core Engine Test**: `node --test test/engine.test.mjs` (via `npm test --workspaces`).
- **Web Build Test**: `npx vite build` (verifies complete TypeScript, JSX, and CSS compilation).
- **Engine Build Test**: `npm run build --workspace=@auramath/engine`.
- **E2E Contract Test Suite**: `test/e2e/*.test.mjs`.

## Coverage Thresholds
- Tier 1: Feature Coverage (≥5 checks per feature)
- Tier 2: Boundary & Corner Cases (theme switches, empty/max values, extremes)
- Tier 3: Cross-Feature Interactions (Theme toggle across views, Mascot + Track, Lesson + Victory)
- Tier 4: Real-World Workload Scenarios (Full lesson progression, streak increment, boss challenge)
