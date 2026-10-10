/**
 * E2E Verification Suite — Real Elo Rating, High-Res Telemetry & Offline-First Cloud Sync
 * File: test/e2e/auth-elo-telemetry.test.mjs
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage for Node test runner environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

import { EloRatingEngine, RANK_TIERS } from '../../src/services/eloEngine.ts';
import { TelemetryTracker } from '../../src/services/telemetryTracker.ts';
import { GhostMatchmaker } from '../../src/services/ghostMatchmaker.ts';
import { CloudSyncService } from '../../src/services/cloudSync.ts';

describe('Auth, Real Elo & Cognitive Telemetry Suite', () => {

  beforeEach(() => {
    mockStorage.clear();
  });

  // ==========================================================================
  // 1. Motor de Elo Real & Ranques Editoriais
  // ==========================================================================
  describe('1. Elo Rating Engine & Rank Hierarchy', () => {
    test('Default rating starts at 1200 and matches played at 0', () => {
      const engine = new EloRatingEngine();
      assert.equal(engine.getRating(), 1200);
      assert.equal(engine.getMatchesPlayed(), 0);
    });

    test('Adaptive K-factor responds to experience and tier', () => {
      const engine = new EloRatingEngine();
      // Novatos (< 15 partidas)
      assert.equal(engine.getAdaptiveKFactor(0, 1200), 40);
      assert.equal(engine.getAdaptiveKFactor(14, 1300), 40);
      // Regulares (>= 15 partidas e < 1800)
      assert.equal(engine.getAdaptiveKFactor(15, 1400), 24);
      assert.equal(engine.getAdaptiveKFactor(50, 1750), 24);
      // Mestres (>= 1800)
      assert.equal(engine.getAdaptiveKFactor(20, 1850), 16);
      assert.equal(engine.getAdaptiveKFactor(100, 2200), 16);
    });

    test('Win expectancy formula reflects rating difference', () => {
      const engine = new EloRatingEngine();
      // Ratings iguais -> 50% de probabilidade
      const expEqual = engine.calculateWinExpectancy(1200, 1200);
      assert.ok(Math.abs(expEqual - 0.5) < 0.001);

      // Jogador 1400 vs Adversário 1200 -> favorita (+ de 75%)
      const expFav = engine.calculateWinExpectancy(1400, 1200);
      assert.ok(expFav > 0.75);

      // Jogador 1200 vs Adversário 1400 -> azarão (- de 25%)
      const expUnder = engine.calculateWinExpectancy(1200, 1400);
      assert.ok(expUnder < 0.25);
    });

    test('Recording victory against equal opponent increases Elo by ~20-24 points', () => {
      const engine = new EloRatingEngine();
      // Primeiras partidas usam K=40, expectativa 0.5 => delta base = 40 * 0.5 = 20
      const result = engine.recordMatchOutcome(1, 1200, 1.0);
      assert.equal(result.previousRating, 1200);
      assert.equal(result.delta, 20);
      assert.equal(result.newRating, 1220);
      assert.equal(engine.getMatchesPlayed(), 1);
    });

    test('Speed bonus multiplier boosts Elo gain on rapid decisive win', () => {
      const engine = new EloRatingEngine();
      // Com speedBonusMultiplier de 1.2 => delta = 20 * 1.2 = 24
      const result = engine.recordMatchOutcome(1, 1200, 1.2);
      assert.equal(result.delta, 24);
      assert.equal(result.newRating, 1224);
    });

    test('Defeat against equal opponent decreases Elo correctly without floor crash', () => {
      const engine = new EloRatingEngine();
      const result = engine.recordMatchOutcome(0, 1200, 1.0);
      assert.equal(result.delta, -20);
      assert.equal(result.newRating, 1180);
    });

    test('Rank Tier maps accurately across all 5 editorial divisions', () => {
      const engine = new EloRatingEngine();
      assert.equal(engine.getRankForRating(950).id, 'papiro');
      assert.equal(engine.getRankForRating(1199).id, 'papiro');
      assert.equal(engine.getRankForRating(1200).id, 'abaco');
      assert.equal(engine.getRankForRating(1450).id, 'abaco');
      assert.equal(engine.getRankForRating(1500).id, 'astronomo');
      assert.equal(engine.getRankForRating(1799).id, 'astronomo');
      assert.equal(engine.getRankForRating(1800).id, 'alquimista');
      assert.equal(engine.getRankForRating(2050).id, 'alquimista');
      assert.equal(engine.getRankForRating(2100).id, 'arquimedes');
      assert.equal(engine.getRankForRating(2500).id, 'arquimedes');
    });
  });

  // ==========================================================================
  // 2. Telemetria Cognitiva de Alta Resolução (2 Fases & Tiers)
  // ==========================================================================
  describe('2. High-Resolution Cognitive Telemetry & Pedagogical Diagnostic', () => {
    test('Records 2-phase timing: recognition T_rec and execution T_exec', () => {
      const tracker = new TelemetryTracker();
      tracker.startQuestion('q-1', 'MULT_25', 2, 1000);

      // 400ms depois: primeiro toque no numpad (Reconhecimento)
      tracker.recordFirstInput(1400);

      // 1200ms depois: submissão da resposta (Execução total)
      const session = tracker.completeQuestion('250', '250', true, 2200);

      assert.ok(session);
      assert.equal(session.firstInputLatencyMs, 400);
      assert.equal(session.totalLatencyMs, 1200);
      assert.equal(session.executionLatencyMs, 800);
      assert.equal(session.difficulty, 2);
      assert.equal(session.techniqueId, 'MULT_25');
      assert.equal(session.isCorrect, true);
    });

    test('Stratifies metrics by difficulty tier (Fácil, Médio, Difícil)', () => {
      const tracker = new TelemetryTracker();

      // Tier 1 Fácil: 2 acertos de 1000ms
      tracker.startQuestion('t1-1', 'ADD_LEFT_RIGHT', 1, 1000);
      tracker.recordFirstInput(1300);
      tracker.completeQuestion('42', '42', true, 2000);

      tracker.startQuestion('t1-2', 'ADD_LEFT_RIGHT', 1, 2000);
      tracker.recordFirstInput(2300);
      tracker.completeQuestion('55', '55', true, 3000);

      // Tier 3 Difícil: 1 erro de 3000ms
      tracker.startQuestion('t3-1', 'DIFF_OF_SQUARES', 3, 3000);
      tracker.recordFirstInput(4200);
      tracker.completeQuestion('99', '100', false, 6000);

      const matrix = tracker.getProficiencyMatrix();
      const addTech = matrix['ADD_LEFT_RIGHT'];
      const diffTech = matrix['DIFF_OF_SQUARES'];

      assert.ok(addTech);
      assert.equal(addTech.byTier[1].attempts, 2);
      assert.equal(addTech.byTier[1].correct, 2);
      assert.equal(addTech.byTier[1].accuracy, 100);

      assert.ok(diffTech);
      assert.equal(diffTech.byTier[3].attempts, 1);
      assert.equal(diffTech.byTier[3].correct, 0);
      assert.equal(diffTech.byTier[3].accuracy, 0);
    });

    test('Diagnostic algorithm identifies Strengths and Blind Spots with drills', () => {
      const tracker = new TelemetryTracker();

      // Alimenta 5 acertos rápidos em MULT_25 (Fortaleza)
      for (let i = 0; i < 5; i++) {
        tracker.startQuestion(`m25-${i}`, 'MULT_25', 2, 1000);
        tracker.recordFirstInput(1350);
        tracker.completeQuestion('100', '100', true, 2100);
      }

      // Alimenta 4 erros lentos em COMPL_9 (Ponto Cego)
      for (let i = 0; i < 4; i++) {
        tracker.startQuestion(`c9-${i}`, 'COMPL_9', 2, 1000);
        tracker.recordFirstInput(2500);
        tracker.completeQuestion('80', '90', false, 4800);
      }

      const diagnostic = tracker.getDiagnosticReport();

      // MULT_25 deve constar nas Fortalezas
      const hasStrength = diagnostic.strengths.some((s) => s.techniqueId === 'MULT_25');
      assert.ok(hasStrength, 'MULT_25 deve ser classificado como Ponto Forte');

      // COMPL_9 deve constar nos Pontos Cegos com ação de drill recomendada
      const blindSpot = diagnostic.blindSpots.find((b) => b.techniqueId === 'COMPL_9');
      assert.ok(blindSpot, 'COMPL_9 deve ser classificado como Ponto Cego');
      assert.ok(blindSpot.suggestedDrill, 'Ponto Cego deve possuir micro-drill recomendado');
    });

    test('Computes 5-axis cognitive radar and assigns cognitive archetype', () => {
      const tracker = new TelemetryTracker();
      const radar = tracker.getCognitiveRadar();

      assert.ok(radar.speed >= 0 && radar.speed <= 100);
      assert.ok(radar.fermi >= 0 && radar.fermi <= 100);
      assert.ok(radar.flexibility >= 0 && radar.flexibility <= 100);
      assert.ok(radar.stamina >= 0 && radar.stamina <= 100);
      assert.ok(radar.memory >= 0 && radar.memory <= 100);

      const archetype = tracker.getArchetype();
      assert.ok(archetype.title.length > 0);
      assert.ok(archetype.subtitle.length > 0);
      assert.ok(archetype.description.length > 0);
    });
  });

  // ==========================================================================
  // 3. Ghost Matchmaker (Competidores Calibrados)
  // ==========================================================================
  describe('3. Ghost Matchmaker & Calibration', () => {
    test('Synthesizes calibrated bot within expected rating variance', () => {
      const matchmaker = new GhostMatchmaker();
      const bot = matchmaker.createCalibratedBot(1350, 5);

      assert.ok(bot.id.startsWith('bot-'));
      assert.ok(bot.name.length > 0);
      assert.ok(bot.elo >= 1200 && bot.elo <= 1500);
      assert.equal(bot.timeline.length, 5);
      assert.equal(bot.isBot, true);
    });

    test('Generated timeline events contain valid latencies and correctness', () => {
      const matchmaker = new GhostMatchmaker();
      const bot = matchmaker.createCalibratedBot(1600, 5);

      for (const ev of bot.timeline) {
        assert.ok(ev.latencyMs >= 500);
        assert.equal(typeof ev.isCorrect, 'boolean');
      }
    });
  });

  // ==========================================================================
  // 4. Offline SyncQueue & Persistência em Nuvem
  // ==========================================================================
  describe('4. Offline SyncQueue & Cloud Synchronization', () => {
    test('Enqueues sync items without error when offline', () => {
      const syncService = new CloudSyncService();
      syncService.setAuthenticatedUser('usr-test-123');

      syncService.syncNodeProgress('usr-test-123', 'MULT_25', 3, 100, 1800);
      syncService.syncAchievement('usr-test-123', 'FIRST_INSIGHT', 1);
      syncService.syncBadge('usr-test-123', 'BADGE_ADD_MASTERY');
      syncService.syncProfileStats('usr-test-123', { elo: 1320, totalXp: 500 });

      const storedRaw = mockStorage.get('auramath-offline-sync-queue-v1');
      assert.ok(storedRaw, 'Fila deve ser salva no localStorage');
      const queue = JSON.parse(storedRaw);
      assert.equal(queue.length, 4);
      assert.equal(queue[0].type, 'node_progress');
      assert.equal(queue[1].type, 'achievement');
      assert.equal(queue[2].type, 'badge');
      assert.equal(queue[3].type, 'profile_stats');
    });
  });
});
