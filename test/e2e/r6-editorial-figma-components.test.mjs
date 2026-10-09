import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

describe('R6: Figma Editorial Component System Verification', () => {
  const editorialDir = path.join(ROOT_DIR, 'src', 'components', 'editorial');

  test('F25: EditorialHeader renders logo with observation dot and gamification pills', () => {
    const file = path.join(editorialDir, 'EditorialHeader.tsx');
    assert.ok(fs.existsSync(file), 'EditorialHeader.tsx must exist');
    const content = fs.readFileSync(file, 'utf-8');

    assert.match(content, /aura.*●.*math/i, 'Must contain lowercase brand with dot');
    assert.match(content, /currentStreak/, 'Must receive currentStreak prop');
    assert.match(content, /xpPoints/, 'Must receive xpPoints prop');
    assert.match(content, /polygon/, 'Must render Delta symbol polygon');
  });

  test('F26: GreetingBanner matches Figma node 1:5 layout specs', () => {
    const file = path.join(editorialDir, 'GreetingBanner.tsx');
    assert.ok(fs.existsSync(file), 'GreetingBanner.tsx must exist');
    const content = fs.readFileSync(file, 'utf-8');

    assert.match(content, /CADERNO DE INSIGHTS/, 'Must display default volume label');
    assert.match(content, /min restantes/, 'Must display remaining time estimate');
    assert.match(content, /Bom dia/, 'Must render personalized editorial greeting');
    assert.match(content, /decomposição de distância/, 'Must contain cognitive leap subtitle');
  });

  test('F27: ActiveDiscoveryCard renders target expression and Marigold insight band', () => {
    const file = path.join(editorialDir, 'ActiveDiscoveryCard.tsx');
    assert.ok(fs.existsSync(file), 'ActiveDiscoveryCard.tsx must exist');
    const content = fs.readFileSync(file, 'utf-8');

    assert.match(content, /UNIDADE ATIVA/, 'Must show unit badge');
    assert.match(content, /EXPRESSÃO ALVO/, 'Must show target expression label');
    assert.match(content, /INSIGHT SIMÉTRICO/, 'Must render Marigold insight band');
    assert.match(content, /Continuar descoberta/, 'Must contain 3D action CTA');
  });

  test('F28: SymmetryRulerDiagram renders numerical axis with equidistant arcs', () => {
    const file = path.join(editorialDir, 'SymmetryRulerDiagram.tsx');
    assert.ok(fs.existsSync(file), 'SymmetryRulerDiagram.tsx must exist');
    const content = fs.readFileSync(file, 'utf-8');

    assert.match(content, /OBSERVE ANTES DE CALCULAR/, 'Must feature observation prompt');
    assert.match(content, /centerSupport/, 'Must support golden center point');
    assert.match(content, /Simetria equidistante/, 'Must include explanatory caption');
    assert.match(content, /strokeDasharray/, 'Must draw dashed guideline axis');
  });

  test('F29: EurekaOptionCards renders pattern recognition choices with Eureka badge', () => {
    const file = path.join(editorialDir, 'EurekaOptionCards.tsx');
    assert.ok(fs.existsSync(file), 'EurekaOptionCards.tsx must exist');
    const content = fs.readFileSync(file, 'utf-8');

    assert.match(content, /O que você percebe\?/, 'Must prompt structural perception');
    assert.match(content, /PADRÃO EUREKA/, 'Must support Eureka badge highlight');
    assert.match(content, /onSelectOption/, 'Must support interactive selection');
  });

  test('F30: StructureUnfoldingSlate renders vertical step-by-step reasoning with climax', () => {
    const file = path.join(editorialDir, 'StructureUnfoldingSlate.tsx');
    assert.ok(fs.existsSync(file), 'StructureUnfoldingSlate.tsx must exist');
    const content = fs.readFileSync(file, 'utf-8');

    assert.match(content, /DESDOBRAMENTO DA ESTRUTURA/, 'Must display structure header');
    assert.match(content, /ArrowDown/, 'Must visually connect steps with arrows');
    assert.match(content, /RESULTADO VISUAL/, 'Must present climax box');
    assert.match(content, /zero cálculos no papel/, 'Must highlight zero-paper-calculation pedagogy');
  });

  test('F31: AuraTutorCard renders Delta mascot and speech balloon with XP reward', () => {
    const file = path.join(editorialDir, 'AuraTutorCard.tsx');
    assert.ok(fs.existsSync(file), 'AuraTutorCard.tsx must exist');
    const content = fs.readFileSync(file, 'utf-8');

    assert.match(content, /AURA · TUTOR INTUITIVO/, 'Must show tutor identity');
    assert.match(content, /XP/, 'Must award insight XP bonus');
    assert.match(content, /speechText/, 'Must render pedagogical insight text');
  });

  test('F32: TrackCurriculumCard and DeepeningMiniCard match Figma specifications', () => {
    const cardFile = path.join(editorialDir, 'TrackCurriculumCard.tsx');
    const miniFile = path.join(editorialDir, 'DeepeningMiniCard.tsx');

    assert.ok(fs.existsSync(cardFile), 'TrackCurriculumCard.tsx must exist');
    assert.ok(fs.existsSync(miniFile), 'DeepeningMiniCard.tsx must exist');

    const cardContent = fs.readFileSync(cardFile, 'utf-8');
    const miniContent = fs.readFileSync(miniFile, 'utf-8');

    assert.match(cardContent, /starsCount/, 'TrackCurriculumCard must support star ratings');
    assert.match(cardContent, /Multiplicação por 25/, 'TrackCurriculumCard default title');
    assert.match(miniContent, /Por que isso sempre funciona\?/, 'DeepeningMiniCard default prompt');
  });
});
