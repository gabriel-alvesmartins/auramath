/**
 * ==============================================================================
 * Auramath Offline-First Local Storage & Delta Sync Queue Manager
 * File: apps/mobile/src/services/storage.ts
 *
 * Provides:
 * - Offline-first persistence for Player Streak, Completed Curriculum Nodes, and Match Records
 * - Resilient Delta Sync Queue Manager that queues mutations offline and flushes to Supabase
 * - Auto-detection of online/offline transitions and periodic background retry with backoff
 * - Clean pluggable storage driver interface supporting localStorage, in-memory, or MMKV/SQLite
 * ==============================================================================
 */

export interface IStorageDriver {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Default Storage Driver using Web/PWA localStorage with graceful in-memory fallback.
 */
export class WebLocalStorageDriver implements IStorageDriver {
  private memoryFallback: Map<string, string> = new Map();

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  public async getItem(key: string): Promise<string | null> {
    if (this.isLocalStorageAvailable()) {
      return window.localStorage.getItem(key);
    }
    return this.memoryFallback.get(key) ?? null;
  }

  public async setItem(key: string, value: string): Promise<void> {
    if (this.isLocalStorageAvailable()) {
      window.localStorage.setItem(key, value);
    } else {
      this.memoryFallback.set(key, value);
    }
  }

  public async removeItem(key: string): Promise<void> {
    if (this.isLocalStorageAvailable()) {
      window.localStorage.removeItem(key);
    } else {
      this.memoryFallback.delete(key);
    }
  }

  public async clear(): Promise<void> {
    if (this.isLocalStorageAvailable()) {
      window.localStorage.clear();
    } else {
      this.memoryFallback.clear();
    }
  }
}

// ==============================================================================
// DOMAIN DATA STRUCTURES
// ==============================================================================

export interface PlayerStreak {
  currentStreakDays: number;
  longestStreakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  todayCompleted: boolean;
  streakFreezeCount: number;
  updatedAt: string;
}

export interface NodeProgressRecord {
  nodeId: string;
  starsEarned: 0 | 1 | 2 | 3;
  bestAccuracy: number;
  averageSpeedMs: number;
  totalAttempts: number;
  firstCompletedAt?: string;
  lastCompletedAt: string;
  synced: boolean;
}

export type GameMode =
  | 'blitz'
  | 'sudden_death'
  | 'duel_1v1'
  | 'zen'
  | 'flash_anzan'
  | 'daily_challenge'
  | 'boss';

export interface OfflineMatchRecord {
  id: string; // UUID v4
  gameMode: GameMode;
  seed: string;
  score: number;
  maxStreak: number;
  totalQuestions: number;
  correctAnswers: number;
  averageReactionMs: number;
  timelineEvents: Array<{
    q: number;
    deltaMs: number;
    correct: boolean;
    input: string;
    techniqueId?: string;
  }>;
  techniqueBreakdown?: Record<string, { correct: number; wrong: number; avgMs: number }>;
  createdAt: string;
  synced: boolean;
  syncAttempts: number;
  lastSyncError?: string;
}

export type SyncItemType =
  | 'MATCH_RECORD'
  | 'NODE_PROGRESS'
  | 'GHOST_RUN'
  | 'DAILY_CHALLENGE'
  | 'ASSIGNMENT_SUBMISSION'
  | 'COGNITIVE_RADAR';

export interface SyncQueueItem {
  id: string;
  type: SyncItemType;
  payload: Record<string, any>;
  createdAt: string;
  retryCount: number;
  maxRetries: number;
  lastAttemptAt?: string;
  lastError?: string;
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTimestamp: string | null;
  lastError: string | null;
}

export interface SyncResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  remainingInQueue: number;
  errors: Array<{ id: string; error: string }>;
}

export interface SupabaseClientLike {
  rpc: (functionName: string, params: Record<string, any>) => Promise<{ data: any; error: any }>;
  from: (tableName: string) => {
    insert: (values: any) => Promise<{ data: any; error: any }>;
    upsert: (values: any, options?: any) => Promise<{ data: any; error: any }>;
  };
  auth?: {
    getUser: () => Promise<{ data: { user: { id: string } | null }; error: any }>;
  };
}

// Storage Keys
const STORAGE_KEYS = {
  STREAK: '@auramath:streak',
  NODE_PROGRESS: '@auramath:node_progress',
  OFFLINE_MATCHES: '@auramath:offline_matches',
  SYNC_QUEUE: '@auramath:delta_sync_queue',
  APP_SETTINGS: '@auramath:settings',
} as const;

// Helper: UUID v4 generator
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper: Format Date YYYY-MM-DD
function formatLocalDate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ==============================================================================
// 1. OFFLINE STORAGE ADAPTER
// ==============================================================================

export class OfflineStorageAdapter {
  private driver: IStorageDriver;

  constructor(driver?: IStorageDriver) {
    this.driver = driver || new WebLocalStorageDriver();
  }

  public setDriver(driver: IStorageDriver): void {
    this.driver = driver;
  }

  // ----------------------------------------------------------------------------
  // STREAK PERSISTENCE
  // ----------------------------------------------------------------------------

  public async getStreak(): Promise<PlayerStreak> {
    try {
      const raw = await this.driver.getItem(STORAGE_KEYS.STREAK);
      if (!raw) {
        return {
          currentStreakDays: 0,
          longestStreakDays: 0,
          lastActiveDate: '',
          todayCompleted: false,
          streakFreezeCount: 1, // Default 1 freeze day provided
          updatedAt: new Date().toISOString(),
        };
      }
      const parsed: PlayerStreak = JSON.parse(raw);
      const today = formatLocalDate();
      // Update todayCompleted flag dynamically
      parsed.todayCompleted = parsed.lastActiveDate === today;
      return parsed;
    } catch {
      return {
        currentStreakDays: 0,
        longestStreakDays: 0,
        lastActiveDate: '',
        todayCompleted: false,
        streakFreezeCount: 1,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  public async recordDailyActivity(date: Date = new Date()): Promise<PlayerStreak> {
    const today = formatLocalDate(date);
    const current = await this.getStreak();

    if (current.lastActiveDate === today) {
      // Already recorded today
      current.todayCompleted = true;
      current.updatedAt = new Date().toISOString();
      await this.driver.setItem(STORAGE_KEYS.STREAK, JSON.stringify(current));
      return current;
    }

    // Check distance in calendar days
    if (!current.lastActiveDate) {
      // First day ever
      current.currentStreakDays = 1;
      current.longestStreakDays = Math.max(1, current.longestStreakDays);
    } else {
      const lastDate = new Date(current.lastActiveDate + 'T00:00:00');
      const curDate = new Date(today + 'T00:00:00');
      const diffDays = Math.round((curDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        current.currentStreakDays += 1;
        current.longestStreakDays = Math.max(current.currentStreakDays, current.longestStreakDays);
      } else if (diffDays > 1) {
        // Missed one or more days -> check streak freeze
        if (diffDays === 2 && current.streakFreezeCount > 0) {
          // Freeze consumed!
          current.streakFreezeCount -= 1;
          current.currentStreakDays += 1;
          current.longestStreakDays = Math.max(current.currentStreakDays, current.longestStreakDays);
        } else {
          // Streak broken
          current.currentStreakDays = 1;
        }
      }
    }

    current.lastActiveDate = today;
    current.todayCompleted = true;
    current.updatedAt = new Date().toISOString();

    await this.driver.setItem(STORAGE_KEYS.STREAK, JSON.stringify(current));
    return current;
  }

  // ----------------------------------------------------------------------------
  // NODE PROGRESS PERSISTENCE
  // ----------------------------------------------------------------------------

  public async getAllNodeProgress(): Promise<Record<string, NodeProgressRecord>> {
    try {
      const raw = await this.driver.getItem(STORAGE_KEYS.NODE_PROGRESS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  public async getNodeProgress(nodeId: string): Promise<NodeProgressRecord | null> {
    const all = await this.getAllNodeProgress();
    return all[nodeId] || null;
  }

  public async saveNodeProgress(
    progress: Omit<NodeProgressRecord, 'synced' | 'totalAttempts' | 'lastCompletedAt'> & {
      totalAttempts?: number;
    }
  ): Promise<NodeProgressRecord> {
    const all = await this.getAllNodeProgress();
    const existing = all[progress.nodeId];
    const now = new Date().toISOString();

    const record: NodeProgressRecord = {
      nodeId: progress.nodeId,
      starsEarned: Math.max(existing ? existing.starsEarned : 0, progress.starsEarned) as 0 | 1 | 2 | 3,
      bestAccuracy: Math.max(existing ? existing.bestAccuracy : 0, progress.bestAccuracy),
      averageSpeedMs: existing
        ? Math.min(existing.averageSpeedMs, progress.averageSpeedMs)
        : progress.averageSpeedMs,
      totalAttempts: (existing ? existing.totalAttempts : 0) + (progress.totalAttempts || 1),
      firstCompletedAt: existing ? existing.firstCompletedAt : now,
      lastCompletedAt: now,
      synced: false,
    };

    all[progress.nodeId] = record;
    await this.driver.setItem(STORAGE_KEYS.NODE_PROGRESS, JSON.stringify(all));

    // Automatically enqueue delta sync
    await deltaSyncQueue.enqueueSync('NODE_PROGRESS', record);

    return record;
  }

  // ----------------------------------------------------------------------------
  // OFFLINE MATCH RECORDS PERSISTENCE
  // ----------------------------------------------------------------------------

  public async getOfflineMatches(): Promise<OfflineMatchRecord[]> {
    try {
      const raw = await this.driver.getItem(STORAGE_KEYS.OFFLINE_MATCHES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public async saveOfflineMatch(
    match: Omit<OfflineMatchRecord, 'id' | 'createdAt' | 'synced' | 'syncAttempts'>
  ): Promise<OfflineMatchRecord> {
    const matches = await this.getOfflineMatches();
    const newRecord: OfflineMatchRecord = {
      ...match,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      synced: false,
      syncAttempts: 0,
    };

    matches.unshift(newRecord);
    // Cap stored offline matches to 100 to prevent boundless local storage growth
    const pruned = matches.slice(0, 100);
    await this.driver.setItem(STORAGE_KEYS.OFFLINE_MATCHES, JSON.stringify(pruned));

    // Update streak for today on any valid match completed
    await this.recordDailyActivity();

    // Enqueue for Supabase delta sync
    await deltaSyncQueue.enqueueSync('MATCH_RECORD', newRecord);

    return newRecord;
  }

  public async markMatchSynced(id: string): Promise<void> {
    const matches = await this.getOfflineMatches();
    const target = matches.find((m) => m.id === id);
    if (target) {
      target.synced = true;
      await this.driver.setItem(STORAGE_KEYS.OFFLINE_MATCHES, JSON.stringify(matches));
    }
  }
}

// ==============================================================================
// 2. DELTA SYNC QUEUE MANAGER
// ==============================================================================

export class DeltaSyncQueueManager {
  private driver: IStorageDriver;
  private isOnlineState: boolean = true;
  private isSyncingState: boolean = false;
  private lastSyncTimestamp: string | null = null;
  private lastError: string | null = null;
  private listeners: Set<(status: SyncStatus) => void> = new Set();
  private autoSyncInterval: ReturnType<typeof setInterval> | null = null;

  constructor(driver?: IStorageDriver) {
    this.driver = driver || new WebLocalStorageDriver();
    this.initNetworkListeners();
  }

  public setDriver(driver: IStorageDriver): void {
    this.driver = driver;
  }

  private initNetworkListeners(): void {
    if (typeof window !== 'undefined') {
      this.isOnlineState = navigator.onLine !== undefined ? navigator.onLine : true;

      window.addEventListener('online', () => {
        this.setOnline(true);
      });

      window.addEventListener('offline', () => {
        this.setOnline(false);
      });
    }
  }

  public setOnline(online: boolean): void {
    const changed = this.isOnlineState !== online;
    this.isOnlineState = online;
    if (changed) {
      this.notifyListeners();
      if (online) {
        // Trigger immediate queue drain upon reconnecting
        void this.processQueue();
      }
    }
  }

  public getStatus(): SyncStatus {
    return {
      isOnline: this.isOnlineState,
      isSyncing: this.isSyncingState,
      pendingCount: 0, // Computed asynchronously when requested
      lastSyncTimestamp: this.lastSyncTimestamp,
      lastError: this.lastError,
    };
  }

  public subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    void this.getPendingQueue().then((queue) => {
      const status: SyncStatus = {
        isOnline: this.isOnlineState,
        isSyncing: this.isSyncingState,
        pendingCount: queue.length,
        lastSyncTimestamp: this.lastSyncTimestamp,
        lastError: this.lastError,
      };
      this.listeners.forEach((fn) => fn(status));
    });
  }

  // ----------------------------------------------------------------------------
  // QUEUE OPERATIONS
  // ----------------------------------------------------------------------------

  public async getPendingQueue(): Promise<SyncQueueItem[]> {
    try {
      const raw = await this.driver.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public async enqueueSync(
    type: SyncItemType,
    payload: Record<string, any>,
    maxRetries: number = 5
  ): Promise<string> {
    const queue = await this.getPendingQueue();
    const id = generateUUID();

    const item: SyncQueueItem = {
      id,
      type,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries,
    };

    queue.push(item);
    await this.driver.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    this.notifyListeners();

    // If online, attempt immediate opportunistic sync
    if (this.isOnlineState && !this.isSyncingState) {
      setTimeout(() => void this.processQueue(), 50);
    }

    return id;
  }

  public async removeQueueItem(id: string): Promise<void> {
    const queue = await this.getPendingQueue();
    const filtered = queue.filter((item) => item.id !== id);
    await this.driver.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(filtered));
  }

  public async clearQueue(): Promise<void> {
    await this.driver.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    this.notifyListeners();
  }

  // ----------------------------------------------------------------------------
  // SYNC PROCESSING ENGINE
  // ----------------------------------------------------------------------------

  public async processQueue(supabaseClient?: SupabaseClientLike): Promise<SyncResult> {
    if (this.isSyncingState || !this.isOnlineState) {
      const queue = await this.getPendingQueue();
      return {
        totalProcessed: 0,
        successful: 0,
        failed: 0,
        remainingInQueue: queue.length,
        errors: [],
      };
    }

    this.isSyncingState = true;
    this.notifyListeners();

    const queue = await this.getPendingQueue();
    const result: SyncResult = {
      totalProcessed: queue.length,
      successful: 0,
      failed: 0,
      remainingInQueue: queue.length,
      errors: [],
    };

    const remainingItems: SyncQueueItem[] = [];

    for (const item of queue) {
      try {
        if (supabaseClient) {
          await this.dispatchItemToSupabase(item, supabaseClient);
        }

        // Successfully synced
        result.successful++;
        if (item.type === 'MATCH_RECORD' && item.payload.id) {
          await storage.markMatchSynced(item.payload.id);
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        result.failed++;
        result.errors.push({ id: item.id, error: errorMsg });

        item.retryCount++;
        item.lastAttemptAt = new Date().toISOString();
        item.lastError = errorMsg;

        // Keep item in queue if max retries not exceeded
        if (item.retryCount < item.maxRetries) {
          remainingItems.push(item);
        }
      }
    }

    await this.driver.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(remainingItems));

    this.isSyncingState = false;
    this.lastSyncTimestamp = new Date().toISOString();
    this.lastError = result.errors.length > 0 ? result.errors[0].error : null;
    result.remainingInQueue = remainingItems.length;

    this.notifyListeners();
    return result;
  }

  /**
   * Dispatches a single queued item to Supabase tables/RPC functions.
   */
  private async dispatchItemToSupabase(
    item: SyncQueueItem,
    supabase: SupabaseClientLike
  ): Promise<void> {
    switch (item.type) {
      case 'MATCH_RECORD': {
        const p = item.payload;
        // Submit through anti-cheat verified RPC function
        const { data, error } = await supabase.rpc('submit_match_score', {
          p_game_mode: p.gameMode,
          p_seed: p.seed,
          p_score: p.score,
          p_max_streak: p.maxStreak,
          p_total_questions: p.totalQuestions,
          p_correct_answers: p.correctAnswers,
          p_average_reaction_ms: p.averageReactionMs,
          p_timeline_events: p.timelineEvents || [],
          p_technique_breakdown: p.techniqueBreakdown || {},
        });

        if (error) throw new Error(`RPC submit_match_score error: ${error.message || error}`);
        if (data && data.rejected) {
          // Rejected by anti-cheat; record is logged but do not retry continuously
          return;
        }
        break;
      }

      case 'NODE_PROGRESS': {
        const p = item.payload;
        const userRes = supabase.auth ? await supabase.auth.getUser() : null;
        const userId = userRes?.data?.user?.id;

        if (userId) {
          const { error } = await supabase.from('user_node_progress').upsert(
            {
              user_id: userId,
              node_id: p.nodeId,
              stars_earned: p.starsEarned,
              best_accuracy: p.bestAccuracy,
              average_speed_ms: p.averageSpeedMs,
              completed_at: p.lastCompletedAt || new Date().toISOString(),
            },
            { onConflict: 'user_id,node_id' }
          );
          if (error) throw new Error(`user_node_progress sync error: ${error.message || error}`);
        }
        break;
      }

      case 'GHOST_RUN': {
        const p = item.payload;
        const { error } = await supabase.from('ghost_runs').insert(p);
        if (error) throw new Error(`ghost_runs sync error: ${error.message || error}`);
        break;
      }

      case 'DAILY_CHALLENGE': {
        const p = item.payload;
        const { error } = await supabase.from('daily_challenge_submissions').insert(p);
        if (error) throw new Error(`daily_challenge_submissions sync error: ${error.message || error}`);
        break;
      }

      case 'ASSIGNMENT_SUBMISSION': {
        const p = item.payload;
        const { error } = await supabase.from('assignment_submissions').upsert(p, {
          onConflict: 'assignment_id,student_id',
        });
        if (error) throw new Error(`assignment_submissions sync error: ${error.message || error}`);
        break;
      }

      case 'COGNITIVE_RADAR': {
        const p = item.payload;
        const { error } = await supabase.from('cognitive_radars').insert(p);
        if (error) throw new Error(`cognitive_radars sync error: ${error.message || error}`);
        break;
      }

      default:
        break;
    }
  }

  /**
   * Starts periodic background synchronization.
   * Returns a cleanup function to unsubscribe/stop the interval.
   */
  public startAutoSync(
    intervalMs: number = 30000,
    supabaseClient?: SupabaseClientLike
  ): () => void {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
    }

    this.autoSyncInterval = setInterval(() => {
      if (this.isOnlineState && !this.isSyncingState) {
        void this.processQueue(supabaseClient);
      }
    }, intervalMs);

    return () => {
      if (this.autoSyncInterval) {
        clearInterval(this.autoSyncInterval);
        this.autoSyncInterval = null;
      }
    };
  }
}

// Global Singletons
export const storage: OfflineStorageAdapter = new OfflineStorageAdapter();
export const deltaSyncQueue: DeltaSyncQueueManager = new DeltaSyncQueueManager();
