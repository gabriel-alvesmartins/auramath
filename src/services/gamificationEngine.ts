import type {
  StreakState,
  DiscoveryChestReward,
  WeeklyLeagueState,
  AchievementItem,
  CommunityQuestState,
  AuraNudge,
  NotebookThemeId,
  NotebookTheme,
  ShopItem,
  FibonacciSubscriptionState,
} from '../../packages/engine/src/gamification.ts';
import {
  INITIAL_STREAK_STATE,
  evaluateStreakStatus,
  registerDailyActivity,
  buyStreakFreeze as engineBuyStreakFreeze,
  placeStreakWager as enginePlaceStreakWager,
  completeRescueStep as engineCompleteRescueStep,
  rollDiscoveryChestReward,
  generateWeeklyCohort,
  getLeagueZone,
  INITIAL_ACHIEVEMENTS,
  INITIAL_COMMUNITY_QUEST,
  AURA_NUDGES,
  formatISODate,
  DEFAULT_NOTEBOOK_THEMES,
  DEFAULT_SHOP_ITEMS,
  buyStreakFreezeItem,
  buyXpBoostItem,
  activateFibonacciSubscription,
  setNotebookTheme,
} from '../../packages/engine/src/gamification.ts';
import { cloudSync } from './cloudSync.ts';

const STORAGE_KEY = 'auramath-gamification-v1';

export interface TrackNodeProgress {
  nodeId: string;
  completed: boolean;
  stars: number; // 0 to 3
  bestAccuracy: number;
  completedAt: string;
}

export interface CircadianChestState {
  id: 'early_bird' | 'night_owl';
  title: string;
  subtitle: string;
  availableFromHour: number;
  availableToHour: number;
  isUnlocked: boolean;
  isClaimedToday: boolean;
  boostMinutes: number;
  bonusMarigoldGems: number;
}

export interface GamificationStoreState {
  streak: StreakState;
  stars: number;
  gems?: number; // Alias for stars (Marigold Gems)
  xp: number;
  weeklyXp: number;
  activeXpBoost: {
    multiplier: number;
    expiresAt: number; // timestamp ms
  } | null;
  circadianChests?: {
    earlyBird: CircadianChestState;
    nightOwl: CircadianChestState;
  };
  league: WeeklyLeagueState;
  achievements: AchievementItem[];
  communityQuest: CommunityQuestState;
  activeNudge: AuraNudge | null;
  recentlyUnlockedAchievement: AchievementItem | null;
  nodeProgress: Record<string, TrackNodeProgress>;
  // Aura Fibonacci & Store State
  isFibonacciMember: boolean;
  fibonacciPlan?: 'annual' | 'monthly' | null;
  fibonacciTrialEndsAt?: string | null;
  activeTheme: NotebookThemeId;
  unlockedThemes: NotebookThemeId[];
}

const DEFAULT_STATE: GamificationStoreState = {
  streak: INITIAL_STREAK_STATE,
  stars: 48,
  gems: 48,
  xp: 320,
  weeklyXp: 420,
  activeXpBoost: null,
  isFibonacciMember: false,
  fibonacciPlan: null,
  fibonacciTrialEndsAt: null,
  activeTheme: 'papiro',
  unlockedThemes: ['papiro'],
  circadianChests: {
    earlyBird: {
      id: 'early_bird',
      title: 'Baú de Foco Matinal',
      subtitle: 'Disponível das 06:00 às 12:00',
      availableFromHour: 6,
      availableToHour: 12,
      isUnlocked: true,
      isClaimedToday: false,
      boostMinutes: 15,
      bonusMarigoldGems: 25,
    },
    nightOwl: {
      id: 'night_owl',
      title: 'Baú de Fixação Noturna',
      subtitle: 'Disponível das 18:00 às 24:00',
      availableFromHour: 18,
      availableToHour: 24,
      isUnlocked: true,
      isClaimedToday: false,
      boostMinutes: 15,
      bonusMarigoldGems: 25,
    },
  },
  league: {
    tier: 'papiro',
    tierName: 'Liga Papiro',
    cohortId: 'cohort-2026-w41',
    resetTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    participants: generateWeeklyCohort('papiro', 420),
    userRank: 12,
  },
  achievements: INITIAL_ACHIEVEMENTS,
  communityQuest: INITIAL_COMMUNITY_QUEST,
  activeNudge: null,
  recentlyUnlockedAchievement: null,
  nodeProgress: {
    'ADD_LEFT_RIGHT': {
      nodeId: 'ADD_LEFT_RIGHT',
      completed: true,
      stars: 3,
      bestAccuracy: 100,
      completedAt: '2026-09-08',
    },
  },
};

type Listener = (state: GamificationStoreState) => void;

class GamificationEngine {
  private state: GamificationStoreState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = this.loadState();
    // Re-evaluate streak status upon load
    const evaluatedStreak = evaluateStreakStatus(this.state.streak);
    if (evaluatedStreak !== this.state.streak) {
      this.state.streak = evaluatedStreak;
      this.saveState();
    }
  }

  private loadState(): GamificationStoreState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_STATE;
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        circadianChests: {
          ...DEFAULT_STATE.circadianChests,
          ...(parsed.circadianChests || {}),
        },
        nodeProgress: {
          ...DEFAULT_STATE.nodeProgress,
          ...(parsed.nodeProgress || {}),
        },
        league: {
          ...DEFAULT_STATE.league,
          ...parsed.league,
          participants:
            parsed.league?.participants?.length === 30
              ? parsed.league.participants
              : generateWeeklyCohort(parsed.league?.tier || 'papiro', parsed.weeklyXp || 420),
        },
      };
    } catch {
      return DEFAULT_STATE;
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to persist gamification state', e);
    }
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.state));
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  public getState(): GamificationStoreState {
    return this.state;
  }

  // --- XP Boost Helper ---
  public getActiveBoostMultiplier(): number {
    if (!this.state.activeXpBoost) return 1;
    if (Date.now() > this.state.activeXpBoost.expiresAt) {
      this.state.activeXpBoost = null;
      this.saveState();
      return 1;
    }
    return this.state.activeXpBoost.multiplier;
  }

  // --- Track Progression Helpers ---
  public completeTrackNode(nodeId: string, stars?: number, accuracy: number = 100): boolean {
    if (accuracy < 80) return false;
    const existing = this.state.nodeProgress[nodeId];
    const prevStars = existing?.stars || 0;
    const finalStars = stars !== undefined && stars > 0
      ? Math.min(3, Math.max(prevStars, stars))
      : Math.min(3, prevStars + 1);
    const starsDiff = Math.max(0, finalStars - prevStars);

    this.state.nodeProgress = {
      ...this.state.nodeProgress,
      [nodeId]: {
        nodeId,
        completed: true,
        stars: finalStars,
        bestAccuracy: Math.max(existing?.bestAccuracy || 0, accuracy),
        completedAt: formatISODate(),
      },
    };

    if (starsDiff > 0) {
      this.state.stars += starsDiff;
    }

    this.saveState();

    const authUserId = cloudSync.getAuthenticatedUserId();
    if (authUserId) {
      cloudSync.syncNodeProgress(
        authUserId,
        nodeId,
        finalStars,
        Math.max(existing?.bestAccuracy || 0, accuracy),
        2100,
        formatISODate()
      );
      cloudSync.syncProfileStats(authUserId, {
        totalXp: this.state.xp,
        currentStreakDays: this.state.streak.current,
      });
    }

    return true;
  }

  public getNodeProgress(nodeId: string): TrackNodeProgress | undefined {
    return this.state.nodeProgress[nodeId];
  }

  // --- Circadian Chest System (Early Bird & Night Owl) ---
  public getCircadianChests(): { earlyBird: CircadianChestState; nightOwl: CircadianChestState } {
    if (!this.state.circadianChests) {
      this.state.circadianChests = DEFAULT_STATE.circadianChests;
    }
    return this.state.circadianChests!;
  }

  public claimCircadianChest(chestId: 'early_bird' | 'night_owl'): { success: boolean; boostMinutes: number } {
    const chests = this.getCircadianChests();
    const chest = chestId === 'early_bird' ? chests.earlyBird : chests.nightOwl;
    const now = new Date();
    const currentHour = now.getHours();
    const inWindow = currentHour >= chest.availableFromHour && currentHour < chest.availableToHour;

    if (!chest.isUnlocked || chest.isClaimedToday || !inWindow) {
      return { success: false, boostMinutes: 0 };
    }

    const expiresAt = Date.now() + chest.boostMinutes * 60 * 1000;
    this.state.activeXpBoost = {
      multiplier: 2,
      expiresAt,
    };
    this.state.stars += chest.bonusMarigoldGems;
    chest.isClaimedToday = true;
    this.saveState();
    return { success: true, boostMinutes: chest.boostMinutes };
  }

  public isNodeUnlocked(nodeId: string, prerequisites: string[] = []): boolean {
    if (!prerequisites || prerequisites.length === 0) return true;
    return prerequisites.every((preId) => Boolean(this.state.nodeProgress[preId]?.completed));
  }

  public unlockMasteryBadge(badgeId: string): void {
    const authUserId = cloudSync.getAuthenticatedUserId();
    if (authUserId) {
      cloudSync.syncBadge(authUserId, badgeId, formatISODate());
    }
  }

  // --- Lesson Finished Handler ---
  public recordLessonCompletion(
    baseXp: number,
    accuracy: number,
    nodeId?: string,
    starsEarned: number = 0
  ): {
    awardedXp: number;
    wagerReward: number;
    newStreak: number;
    unlockedAchievement: AchievementItem | null;
  } {
    const boostMultiplier = this.getActiveBoostMultiplier();
    const awardedXp = Math.round(baseXp * boostMultiplier);

    // Register streak
    const { updatedState: nextStreak, wagerRewardStars } = registerDailyActivity(this.state.streak);
    this.state.streak = nextStreak;

    // Currency update
    this.state.xp += awardedXp;
    this.state.weeklyXp += awardedXp;
    this.state.stars += wagerRewardStars;

    // Node Progress Persistence (Crown Star Progression: +1 star per successful tier completion up to 3 stars)
    if (nodeId && accuracy >= 80) {
      const existing = this.state.nodeProgress[nodeId];
      const prevStars = existing?.stars || 0;
      const finalStars = starsEarned > 0
        ? Math.min(3, Math.max(prevStars, starsEarned))
        : Math.min(3, prevStars + 1);
      const starsDiff = Math.max(0, finalStars - prevStars);

      this.state.nodeProgress = {
        ...this.state.nodeProgress,
        [nodeId]: {
          nodeId,
          completed: true,
          stars: finalStars,
          bestAccuracy: Math.max(existing?.bestAccuracy || 0, accuracy),
          completedAt: formatISODate(),
        },
      };
      if (starsDiff > 0) {
        this.state.stars += starsDiff;
      }
    } else if (!nodeId) {
      this.state.stars += 3;
    }

    // Update community quest contribution
    this.state.communityQuest.currentTotal += 1;
    this.state.communityQuest.userContribution += 1;

    // Update League rank with new weekly XP
    const updatedParticipants = this.state.league.participants.map((p) => {
      if (p.isUser) {
        return { ...p, xp: this.state.weeklyXp };
      }
      return p;
    });
    updatedParticipants.sort((a, b) => b.xp - a.xp);
    let userRank = 1;
    updatedParticipants.forEach((p, idx) => {
      p.rank = idx + 1;
      if (p.isUser) userRank = idx + 1;
    });
    this.state.league.participants = updatedParticipants;
    this.state.league.userRank = userRank;

    // Check Day 1 & other achievements
    let newlyUnlocked: AchievementItem | null = null;
    const achievements = this.state.achievements.map((ach) => {
      if (ach.id === 'FIRST_INSIGHT' && !ach.unlocked) {
        newlyUnlocked = { ...ach, unlocked: true, progress: 1, unlockedAt: formatISODate() };
        return newlyUnlocked;
      }
      if (ach.id === 'TITANIUM_STREAK_7' && !ach.unlocked && nextStreak.current >= 7) {
        newlyUnlocked = { ...ach, unlocked: true, progress: 7, unlockedAt: formatISODate() };
        return newlyUnlocked;
      }
      return ach;
    });
    this.state.achievements = achievements;
    this.state.recentlyUnlockedAchievement = newlyUnlocked;

    // Circadian Chest cross-unlocking (Duolingo bi-daily loop)
    const currentHour = new Date().getHours();
    if (this.state.circadianChests) {
      if (currentHour >= 6 && currentHour < 12) {
        this.state.circadianChests.nightOwl.isUnlocked = true;
      } else if (currentHour >= 18 && currentHour < 24) {
        this.state.circadianChests.earlyBird.isUnlocked = true;
      }
    }

    this.saveState();

    const authUserId = cloudSync.getAuthenticatedUserId();
    if (authUserId) {
      if (nodeId && accuracy >= 80) {
        const prog = this.state.nodeProgress[nodeId];
        if (prog) {
          cloudSync.syncNodeProgress(
            authUserId,
            nodeId,
            prog.stars,
            prog.bestAccuracy,
            2100,
            prog.completedAt
          );
        }
      }
      if (newlyUnlocked) {
        const achToSync: AchievementItem = newlyUnlocked;
        cloudSync.syncAchievement(
          authUserId,
          achToSync.id,
          achToSync.progress || 1,
          achToSync.unlockedAt
        );
      }
      cloudSync.syncProfileStats(authUserId, {
        totalXp: this.state.xp,
        currentStreakDays: nextStreak.current,
      });
    }

    return {
      awardedXp,
      wagerReward: wagerRewardStars,
      newStreak: nextStreak.current,
      unlockedAchievement: newlyUnlocked,
    };
  }

  // --- Streak Freezes & Wager ---
  public buyStreakFreeze(cost: number = 100): boolean {
    const res = engineBuyStreakFreeze(this.state.streak, this.state.stars, cost);
    if (!res.success) return false;
    this.state.streak = res.state;
    this.state.stars = res.remainingStars;
    this.saveState();
    return true;
  }

  public placeStreakWager(targetDays: 7 | 14, betStars: number = 50): boolean {
    const res = enginePlaceStreakWager(this.state.streak, this.state.stars, targetDays, betStars);
    if (!res.success) return false;
    this.state.streak = res.state;
    this.state.stars = res.remainingStars;
    this.saveState();
    return true;
  }

  public completeRescueStep(): boolean {
    const next = engineCompleteRescueStep(this.state.streak, 18);
    this.state.streak = next;
    this.saveState();
    return next.rescueTasksCompleted >= 3;
  }

  // --- Discovery Chest Open ---
  public openDiscoveryChest(grade: number): DiscoveryChestReward {
    const reward = rollDiscoveryChestReward(grade);

    this.state.xp += reward.xp;
    this.state.stars += reward.stars;
    this.state.weeklyXp += reward.xp;

    if (reward.xpBoostMinutes) {
      this.state.activeXpBoost = {
        multiplier: 2.0,
        expiresAt: Date.now() + reward.xpBoostMinutes * 60 * 1000,
      };
    }

    if (reward.freezeAwarded && this.state.streak.freezesAvailable < 2) {
      this.state.streak.freezesAvailable += 1;
    }

    this.saveState();
    return reward;
  }

  // --- Nudges ---
  public triggerRandomNudge(): AuraNudge {
    const index = Math.floor(Math.random() * AURA_NUDGES.length);
    const nudge = AURA_NUDGES[index];
    this.state.activeNudge = nudge;
    this.saveState();
    return nudge;
  }

  public dismissNudge(): void {
    this.state.activeNudge = null;
    this.saveState();
  }

  public dismissAchievementModal(): void {
    this.state.recentlyUnlockedAchievement = null;
    this.saveState();
  }

  // --- Dev / Cheats Helpers ---
  public addXp(amount: number = 100): void {
    this.state.xp += amount;
    this.state.weeklyXp += amount;
    this.saveState();
  }

  public addXP(amount: number = 100): void {
    this.addXp(amount);
  }

  public addStars(amount: number = 1): void {
    this.state.stars += amount;
    this.state.gems = this.state.stars;
    this.saveState();
  }

  public addGems(amount: number = 50): void {
    this.addStars(amount);
  }

  public resetHearts(): void {
    this.saveState();
  }

  // --- Editorial Shop & Fibonacci Mechanics ---
  public get gems(): number {
    return this.state.stars;
  }

  public getShopCatalog(): ShopItem[] {
    return DEFAULT_SHOP_ITEMS.map((item) => {
      if (item.actionType === 'buy_freeze') {
        const isMax = this.state.streak.freezesAvailable >= 2;
        return {
          ...item,
          isMaxCapacity: isMax,
          isEquipped: this.state.streak.freezesAvailable > 0,
        };
      }
      if (item.actionType === 'buy_wager') {
        const isActive = this.state.streak.wager?.status === 'active';
        return {
          ...item,
          isEquipped: isActive,
        };
      }
      if (item.actionType === 'open_fibonacci_modal') {
        return {
          ...item,
          isEquipped: this.state.isFibonacciMember,
        };
      }
      return item;
    });
  }

  public getNotebookThemes(): NotebookTheme[] {
    return DEFAULT_NOTEBOOK_THEMES;
  }

  public buyShopItem(item: ShopItem): { success: boolean; message: string } {
    if (item.actionType === 'buy_freeze') {
      const res = buyStreakFreezeItem(this.state.stars, this.state.streak.freezesAvailable, item.costGems);
      if (!res.success) {
        return { success: false, message: res.error || 'Erro ao comprar Bloqueio de Gelo.' };
      }
      this.state.stars = res.remainingGems;
      this.state.gems = res.remainingGems;
      this.state.streak = {
        ...this.state.streak,
        freezesAvailable: res.newFreezesAvailable,
      };
      this.saveState();
      return { success: true, message: `Bloqueio de Gelo equipado! Cargas: ${res.newFreezesAvailable}/2.` };
    }

    if (item.actionType === 'buy_boost') {
      return this.activateXpBoost(15, item.costGems);
    }

    if (item.actionType === 'buy_wager') {
      const ok = this.placeStreakWager(7, item.costGems || 50);
      return ok
        ? { success: true, message: 'Contrato de Foco de 7 dias firmado!' }
        : { success: false, message: 'Não foi possível firmar o contrato.' };
    }

    if (item.actionType === 'open_fibonacci_modal') {
      return { success: true, message: 'Abra o modal de assinatura.' };
    }

    return { success: false, message: 'Item não reconhecido.' };
  }

  public activateXpBoost(durationMinutes: number = 15, costGems: number = 150): { success: boolean; message: string } {
    const res = buyXpBoostItem(this.state.stars, durationMinutes, costGems);
    if (!res.success || !res.boost) {
      return { success: false, message: res.error || 'Saldo insuficiente para a Poção de Foco.' };
    }
    this.state.stars = res.remainingGems;
    this.state.gems = res.remainingGems;
    this.state.activeXpBoost = {
      multiplier: res.boost.multiplier,
      expiresAt: res.boost.expiresAt,
    };
    this.saveState();
    return { success: true, message: `Poção de Foco ativada! 2x XP durante ${durationMinutes} minutos.` };
  }

  public setFibonacciSubscription(plan: 'annual' | 'monthly' = 'annual', trialDays: number = 7): FibonacciSubscriptionState {
    const sub = activateFibonacciSubscription(plan, trialDays);
    this.state.isFibonacciMember = true;
    this.state.fibonacciPlan = plan;
    this.state.fibonacciTrialEndsAt = sub.trialEndsAt;
    // Unlock all themes for Fibonacci subscribers
    const allThemeIds = DEFAULT_NOTEBOOK_THEMES.map((t) => t.id);
    this.state.unlockedThemes = Array.from(new Set([...this.state.unlockedThemes, ...allThemeIds]));
    this.saveState();
    return sub;
  }

  public cancelFibonacciSubscription(): void {
    this.state.isFibonacciMember = false;
    this.state.fibonacciPlan = null;
    this.state.fibonacciTrialEndsAt = null;
    this.saveState();
  }

  public equipTheme(themeId: NotebookThemeId): { success: boolean; message: string } {
    const res = setNotebookTheme(themeId, this.state.isFibonacciMember, this.state.unlockedThemes);
    if (!res.success) {
      return { success: false, message: res.error || 'Não foi possível equipar o tema.' };
    }
    this.state.activeTheme = res.activeTheme;
    this.saveState();
    return { success: true, message: `Tema ${res.activeTheme} equipado no caderno!` };
  }
}

export const gamificationEngine = new GamificationEngine();
