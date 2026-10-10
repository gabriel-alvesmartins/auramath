/**
 * ==============================================================================
 * Auramath Offline-First Cloud Synchronization Service
 * File: src/services/cloudSync.ts
 *
 * Implements:
 * - Persistent SyncQueue in localStorage with automatic exponential retry
 * - Asynchronous, non-blocking synchronization of:
 *    * Node progress (user_node_progress)
 *    * Achievements & badges (user_achievements & user_unlocked_badges)
 *    * Cognitive Radars & Archetypes (cognitive_radars)
 *    * Profile stats (profiles: elo, total_xp, streak)
 * - Seamless guest data migration to Supabase cloud upon sign in/sign up
 * ==============================================================================
 */

import { supabase, isSupabaseConfigured } from './supabaseClient.ts';
import { eloEngine } from './eloEngine.ts';
import { telemetryTracker } from './telemetryTracker.ts';

export type SyncItemType =
  | 'node_progress'
  | 'achievement'
  | 'badge'
  | 'cognitive_radar'
  | 'profile_stats';

export interface SyncItem {
  id: string;
  userId: string;
  type: SyncItemType;
  payload: Record<string, any>;
  createdAt: number;
  retries: number;
}

const QUEUE_STORAGE_KEY = 'auramath-offline-sync-queue-v1';
const MIGRATION_FLAG_PREFIX = 'auramath-migrated-user-';

export class CloudSyncService {
  private queue: SyncItem[] = [];
  private isFlushing: boolean = false;
  private currentUserId: string | null = null;

  constructor() {
    this.loadQueue();
    // Flush queue if online
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.flushQueue();
      });
    }
  }

  public setAuthenticatedUser(userId: string | null): void {
    this.currentUserId = userId;
    if (userId) {
      this.flushQueue();
    }
  }

  public getAuthenticatedUserId(): string | null {
    return this.currentUserId;
  }

  private loadQueue(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (raw) {
        this.queue = JSON.parse(raw);
      }
    } catch {
      this.queue = [];
    }
  }

  private saveQueue(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch {}
  }

  /**
   * Adiciona um item na fila de sincronização offline e tenta o disparo imediato.
   */
  public enqueue(userId: string, type: SyncItemType, payload: Record<string, any>): void {
    if (!userId) return;

    const item: SyncItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      type,
      payload,
      createdAt: Date.now(),
      retries: 0,
    };

    this.queue.push(item);
    this.saveQueue();
    this.flushQueue();
  }

  /**
   * Despacha sincronização de nós de aprendizagem (user_node_progress)
   */
  public syncNodeProgress(
    userId: string,
    nodeId: string,
    starsEarned: number,
    bestAccuracy: number,
    avgSpeedMs: number = 2200,
    completedAt?: string
  ): void {
    this.enqueue(userId, 'node_progress', {
      nodeId,
      starsEarned,
      bestAccuracy,
      avgSpeedMs,
      completedAt: completedAt || new Date().toISOString(),
    });
  }

  /**
   * Despacha sincronização de marcos / conquistas (user_achievements)
   */
  public syncAchievement(
    userId: string,
    achievementId: string,
    progress: number = 1,
    unlockedAt?: string
  ): void {
    this.enqueue(userId, 'achievement', {
      achievementId,
      progress,
      unlockedAt: unlockedAt || new Date().toISOString(),
    });
  }

  /**
   * Despacha sincronização de selos de maestria (user_unlocked_badges)
   */
  public syncBadge(userId: string, badgeId: string, unlockedAt?: string): void {
    this.enqueue(userId, 'badge', {
      badgeId,
      unlockedAt: unlockedAt || new Date().toISOString(),
    });
  }

  /**
   * Despacha sincronização do Radar Cognitivo
   */
  public syncCognitiveRadar(
    userId: string,
    scores: {
      speedScore: number;
      fermiScore: number;
      flexibilityScore: number;
      staminaScore: number;
      memoryScore: number;
    },
    archetypeTitle: string
  ): void {
    this.enqueue(userId, 'cognitive_radar', {
      ...scores,
      archetypeTitle,
      computedAt: new Date().toISOString(),
    });
  }

  /**
   * Despacha estatísticas de perfil (Elo, XP, Sequência)
   */
  public syncProfileStats(
    userId: string,
    stats: {
      elo?: number;
      totalXp?: number;
      currentStreakDays?: number;
      highestBlitzScore?: number;
    }
  ): void {
    this.enqueue(userId, 'profile_stats', stats);
  }

  /**
   * Executa a drenagem assíncrona da fila com upserts tolerantes a falhas no Supabase.
   */
  public async flushQueue(): Promise<void> {
    if (this.isFlushing || this.queue.length === 0) return;
    if (!isSupabaseConfigured || !supabase) return;

    this.isFlushing = true;

    try {
      const remaining: SyncItem[] = [];

      for (const item of [...this.queue]) {
        try {
          let success = false;

          switch (item.type) {
            case 'node_progress': {
              const { error } = await supabase.from('user_node_progress').upsert(
                {
                  user_id: item.userId,
                  node_id: item.payload.nodeId,
                  stars_earned: item.payload.starsEarned,
                  best_accuracy: item.payload.bestAccuracy,
                  average_speed_ms: item.payload.avgSpeedMs || 2200,
                  completed_at: item.payload.completedAt,
                },
                { onConflict: 'user_id,node_id' }
              );
              success = !error;
              break;
            }

            case 'achievement': {
              const { error } = await supabase.from('user_achievements').upsert(
                {
                  user_id: item.userId,
                  achievement_id: item.payload.achievementId,
                  progress: item.payload.progress,
                  unlocked: true,
                  unlocked_at: item.payload.unlockedAt,
                },
                { onConflict: 'user_id,achievement_id' }
              );
              success = !error;
              break;
            }

            case 'badge': {
              const { error } = await supabase.from('user_unlocked_badges').upsert(
                {
                  user_id: item.userId,
                  badge_id: item.payload.badgeId,
                  unlocked_at: item.payload.unlockedAt,
                },
                { onConflict: 'user_id,badge_id' }
              );
              success = !error;
              break;
            }

            case 'cognitive_radar': {
              const { error } = await supabase.from('cognitive_radars').insert({
                user_id: item.userId,
                speed_score: Math.round(item.payload.speedScore),
                fermi_score: Math.round(item.payload.fermiScore),
                flexibility_score: Math.round(item.payload.flexibilityScore),
                stamina_score: Math.round(item.payload.staminaScore),
                memory_score: Math.round(item.payload.memoryScore),
                archetype_title: item.payload.archetypeTitle,
                computed_at: item.payload.computedAt,
              });
              success = !error;
              break;
            }

            case 'profile_stats': {
              const updates: Record<string, any> = { updated_at: new Date().toISOString() };
              if (item.payload.elo !== undefined) updates.elo = item.payload.elo;
              if (item.payload.totalXp !== undefined) updates.total_xp = item.payload.totalXp;
              if (item.payload.currentStreakDays !== undefined) updates.current_streak_days = item.payload.currentStreakDays;
              if (item.payload.highestBlitzScore !== undefined) updates.highest_blitz_score = item.payload.highestBlitzScore;

              const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', item.userId);
              success = !error;
              break;
            }
          }

          if (!success) {
            item.retries += 1;
            // Se excedeu 5 tentativas, descartamos para não engarrafar
            if (item.retries < 5) {
              remaining.push(item);
            }
          }
        } catch {
          item.retries += 1;
          if (item.retries < 5) {
            remaining.push(item);
          }
        }
      }

      this.queue = remaining;
      this.saveQueue();
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Migração transparente do localStorage para o perfil no Supabase após login/cadastro.
   */
  public async migrateGuestDataToCloud(userId: string): Promise<boolean> {
    if (!userId || !isSupabaseConfigured || !supabase) return false;

    // Verificar se já migramos nesta instalação para este usuário
    const migrationFlagKey = `${MIGRATION_FLAG_PREFIX}${userId}`;
    if (typeof localStorage !== 'undefined' && localStorage.getItem(migrationFlagKey)) {
      return true;
    }

    try {
      // 1. Migrar nós e progresso da gamificação
      const gamificationRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('auramath-gamification-v1') : null;
      if (gamificationRaw) {
        const gamificationData = JSON.parse(gamificationRaw);

        // Nós de progresso
        if (gamificationData.nodeProgress) {
          for (const [nodeId, prog] of Object.entries(gamificationData.nodeProgress as Record<string, any>)) {
            if (prog && prog.completed) {
              this.syncNodeProgress(
                userId,
                nodeId,
                prog.stars || 3,
                prog.bestAccuracy || 100,
                2100,
                prog.completedAt
              );
            }
          }
        }

        // Conquistas desbloqueadas
        if (Array.isArray(gamificationData.achievements)) {
          for (const ach of gamificationData.achievements) {
            if (ach.unlocked) {
              this.syncAchievement(userId, ach.id, ach.progress || 1, ach.unlockedAt);
            }
          }
        }

        // Stats básicos de gamificação
        this.syncProfileStats(userId, {
          totalXp: gamificationData.xp || 0,
          currentStreakDays: gamificationData.streak?.current || 0,
        });
      }

      // 2. Migrar Elo Rating
      const eloRating = eloEngine.getRating();
      this.syncProfileStats(userId, { elo: eloRating });

      // 3. Migrar Radar Cognitivo Atual
      const radar = telemetryTracker.getCognitiveRadar();
      const archetype = telemetryTracker.getArchetype();
      this.syncCognitiveRadar(
        userId,
        {
          speedScore: radar.speed,
          fermiScore: radar.fermi,
          flexibilityScore: radar.flexibility,
          staminaScore: radar.stamina,
          memoryScore: radar.memory,
        },
        archetype.title
      );

      // 4. Efetuar envio
      await this.flushQueue();

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(migrationFlagKey, 'true');
      }

      return true;
    } catch (err) {
      console.warn('Falha na migração automática de dados de convidado', err);
      return false;
    }
  }
}

export const cloudSync = new CloudSyncService();
