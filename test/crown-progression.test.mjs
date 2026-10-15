/**
 * Crown Star Progression Test Suite
 * Tests incremental 3-Star / Crown mastery progression:
 * 0★ -> 1★ (Fácil), 1★ -> 2★ (Médio), 2★ -> 3★ (Difícil), 3★ (Manutenção)
 * and retention failure threshold (< 80%).
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage for Node.js test environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

// Import gamificationEngine after mock is established
const { gamificationEngine } = await import('../src/services/gamificationEngine.ts');

describe('Crown Star Progression Model (3-Star Mastery)', () => {
  beforeEach(() => {
    mockStorage.clear();
    const state = gamificationEngine.getState();
    state.nodeProgress = {};
    state.stars = 0;
  });

  test('Stage 1: Inédito (0 estrelas) -> Conclui com >= 80% ganha 1ª Estrela (Fácil)', () => {
    const nodeId = 'm1_sub_comp';
    assert.equal(gamificationEngine.getNodeProgress(nodeId), undefined);

    // Conclui lição com 90% de acurácia (Fácil)
    gamificationEngine.recordLessonCompletion(20, 90, nodeId, 0);

    const progress = gamificationEngine.getNodeProgress(nodeId);
    assert.ok(progress, 'Nó deve estar registrado no progresso');
    assert.equal(progress.completed, true);
    assert.equal(progress.stars, 1, 'Primeira aprovação deve conceder exatamente 1 estrela');
    assert.equal(gamificationEngine.getState().stars, 1, 'Saldo global de estrelas deve incrementar em 1');
  });

  test('Stage 2: Nó com 1 estrela -> Conclui com >= 80% ganha 2ª Estrela (Médio)', () => {
    const nodeId = 'm1_sub_comp';

    // 1ª Lição: 0★ -> 1★
    gamificationEngine.recordLessonCompletion(20, 85, nodeId, 0);
    assert.equal(gamificationEngine.getNodeProgress(nodeId)?.stars, 1);

    // 2ª Lição: 1★ -> 2★
    gamificationEngine.recordLessonCompletion(25, 90, nodeId, 0);
    assert.equal(gamificationEngine.getNodeProgress(nodeId)?.stars, 2, 'Segunda aprovação deve avançar para 2 estrelas');
    assert.equal(gamificationEngine.getState().stars, 2, 'Saldo global deve ter 2 estrelas acumuladas');
  });

  test('Stage 3: Nó com 2 estrelas -> Conclui com >= 80% ganha 3ª Estrela (Difícil - Maestria)', () => {
    const nodeId = 'm1_sub_comp';

    // 0★ -> 1★ -> 2★
    gamificationEngine.recordLessonCompletion(20, 85, nodeId, 0);
    gamificationEngine.recordLessonCompletion(25, 90, nodeId, 0);
    assert.equal(gamificationEngine.getNodeProgress(nodeId)?.stars, 2);

    // 3ª Lição: 2★ -> 3★
    gamificationEngine.recordLessonCompletion(30, 95, nodeId, 0);
    assert.equal(gamificationEngine.getNodeProgress(nodeId)?.stars, 3, 'Terceira aprovação deve coroar com 3 estrelas');
    assert.equal(gamificationEngine.getState().stars, 3, 'Saldo global deve refletir 3 estrelas');
  });

  test('Stage 4: Nó dominado (3 estrelas) -> Treino adicional não ultrapassa 3 estrelas', () => {
    const nodeId = 'm1_sub_comp';

    // Eleva para 3 estrelas
    gamificationEngine.recordLessonCompletion(20, 100, nodeId, 1);
    gamificationEngine.recordLessonCompletion(20, 100, nodeId, 2);
    gamificationEngine.recordLessonCompletion(20, 100, nodeId, 3);
    assert.equal(gamificationEngine.getNodeProgress(nodeId)?.stars, 3);

    const starsBefore = gamificationEngine.getState().stars;

    // Treino de manutenção lendário
    gamificationEngine.recordLessonCompletion(25, 100, nodeId, 0);
    assert.equal(gamificationEngine.getNodeProgress(nodeId)?.stars, 3, 'Estrelas devem permanecer no teto de 3');
    assert.equal(gamificationEngine.getState().stars, starsBefore, 'Nenhuma estrela excedente deve ser inflacionada');
  });

  test('Retenção pedagógica: Acurácia < 80% não avança estrelas nem marca como dominado', () => {
    const nodeId = 'm1_sub_comp';

    // Tentativa com 70% de acurácia
    gamificationEngine.recordLessonCompletion(20, 70, nodeId, 0);

    const progress = gamificationEngine.getNodeProgress(nodeId);
    assert.equal(progress, undefined, 'Acurácia < 80% não deve registrar aprovação no nó');
    assert.equal(gamificationEngine.getState().stars, 0);
  });

  test('completeTrackNode também respeita a progressão incremental', () => {
    const nodeId = 'm2_add_left';

    // 1ª chamada
    const res1 = gamificationEngine.completeTrackNode(nodeId, 0, 85);
    assert.equal(res1, true);
    assert.equal(gamificationEngine.getNodeProgress(nodeId)?.stars, 1);

    // 2ª chamada
    const res2 = gamificationEngine.completeTrackNode(nodeId, 0, 90);
    assert.equal(res2, true);
    assert.equal(gamificationEngine.getNodeProgress(nodeId)?.stars, 2);

    // Falha por acurácia insuficiente
    const resFail = gamificationEngine.completeTrackNode(nodeId, 0, 75);
    assert.equal(resFail, false);
    assert.equal(gamificationEngine.getNodeProgress(nodeId)?.stars, 2);
  });
});
