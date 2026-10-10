/**
 * ==============================================================================
 * Auramath Ghost Matchmaker & Shadow Competitor Simulation
 * File: src/services/ghostMatchmaker.ts
 *
 * Implements:
 * - Querying stored real player runs from Supabase (`ghost_runs`)
 * - Fallback to procedurally calibrated bots matching target Elo
 * - Replay timeline event generation for parallel 1v1 duels
 * ==============================================================================
 */

import { supabase, isSupabaseConfigured } from './supabaseClient.ts';

export interface GhostTimelineEvent {
  questionIndex: number;
  latencyMs: number;
  isCorrect: boolean;
}

export interface GhostOpponent {
  id: string;
  name: string;
  elo: number;
  avatarLetter: string;
  avatarColor: string;
  isBot: boolean;
  timeline: GhostTimelineEvent[];
}

const HISTORICAL_NAMES = [
  'Hipátia de Alexandria', 'Pitágoras de Samos', 'Brahmagupta', 'Ada Lovelace',
  'Carl Friedrich Gauss', 'Emmy Noether', 'Leonhard Euler', 'Srinivasa Ramanujan',
  'Sofia Kovalevskaya', 'René Descartes', 'Al-Khwarizmi', 'Blaise Pascal',
  'Euclides de Alexandria', 'Évariste Galois', 'Maria Gaetana Agnesi'
];

export class GhostMatchmaker {
  /**
   * Encontra um adversário adequado para o Elo do jogador.
   * Tenta buscar um Ghost Run no Supabase; se não houver, gera um bot calibrado.
   */
  public async findOpponent(playerElo: number, totalQuestions: number = 5): Promise<GhostOpponent> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('ghost_runs')
          .select('*')
          .gte('elo', playerElo - 120)
          .lte('elo', playerElo + 120)
          .limit(10);

        if (!error && data && data.length > 0) {
          const picked = data[Math.floor(Math.random() * data.length)];
          const timeline = Array.isArray(picked.timeline_events)
            ? (picked.timeline_events as GhostTimelineEvent[])
            : this.generateCalibratedTimeline(picked.elo, totalQuestions);

          return {
            id: picked.id,
            name: `Explorador (Ghost)`,
            elo: picked.elo,
            avatarLetter: 'G',
            avatarColor: '#176B5B',
            isBot: false,
            timeline,
          };
        }
      } catch {
        // Fallback para geração local
      }
    }

    // Geração de Bot Calibrado
    return this.createCalibratedBot(playerElo, totalQuestions);
  }

  /**
   * Sintetiza um bot com distribuição de tempo e acurácia correspondente ao Elo.
   */
  public createCalibratedBot(targetElo: number, totalQuestions: number = 5): GhostOpponent {
    // Variação de Elo do oponente entre -45 e +45
    const variance = Math.floor((Math.random() - 0.5) * 90);
    const opponentElo = Math.max(800, targetElo + variance);
    const name = HISTORICAL_NAMES[Math.floor(Math.random() * HISTORICAL_NAMES.length)];
    const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('');

    const colors = ['#176B5B', '#6E5AA6', '#F2B84B', '#E76F61'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const timeline = this.generateCalibratedTimeline(opponentElo, totalQuestions);

    return {
      id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${name} (Simulado)`,
      elo: opponentElo,
      avatarLetter: initials,
      avatarColor: color,
      isBot: true,
      timeline,
    };
  }

  /**
   * Gera a trilha de respostas baseada no Elo do oponente.
   */
  private generateCalibratedTimeline(elo: number, questionCount: number): GhostTimelineEvent[] {
    // Probabilidade de acerto: Elo 1000 -> 70%, Elo 1800 -> 92%
    const probCorrect = Math.min(0.96, Math.max(0.60, 0.62 + ((elo - 900) / 1200) * 0.34));

    // Latência média: Elo 1000 -> ~2400ms, Elo 1800 -> ~1100ms
    const baseLatency = Math.max(900, Math.round(3100 - ((elo - 800) / 1400) * 2000));

    const events: GhostTimelineEvent[] = [];

    for (let i = 0; i < questionCount; i++) {
      const isCorrect = Math.random() <= probCorrect;
      // Adiciona jitter gaussiano de +/- 30%
      const jitter = (Math.random() - 0.5) * 0.6;
      const latencyMs = Math.max(650, Math.round(baseLatency * (1 + jitter)));

      events.push({
        questionIndex: i,
        latencyMs,
        isCorrect,
      });
    }

    return events;
  }

  /**
   * Salva um ghost run de partida concluída no Supabase para matchmaking futuro.
   */
  public async saveGhostRun(
    userId: string,
    elo: number,
    totalScore: number,
    durationMs: number,
    timeline: GhostTimelineEvent[]
  ): Promise<void> {
    if (!isSupabaseConfigured || !supabase || !userId) return;

    try {
      await supabase.from('ghost_runs').insert({
        user_id: userId,
        game_mode: 'duel_1v1',
        elo,
        seed: `run-${Date.now()}`,
        total_score: totalScore,
        duration_ms: durationMs,
        timeline_events: timeline,
      });
    } catch {
      // Falha silenciosa offline
    }
  }
}

export const ghostMatchmaker = new GhostMatchmaker();
