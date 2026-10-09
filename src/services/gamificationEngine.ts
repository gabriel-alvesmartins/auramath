import {
  StreakState,
  INITIAL_STREAK_STATE,
  evaluateStreakStatus,
  registerDailyActivity,
  buyStreakFreeze as engineBuyStreakFreeze,
  placeStreakWager as enginePlaceStreakWager,
  completeRescueStep as engineCompleteRescueStep,
  DiscoveryChestReward,
  rollDiscoveryChestReward,
  WeeklyLeagueState,
  generateWeeklyCohort,
  getLeagueZone,
  AchievementItem,
  INITIAL_ACHIEVEMENTS,
  CommunityQuestState,
  INITIAL_COMMUNITY_QUEST,
  AuraNudge,
  AURA_NUDGES,
  formatISODate,
} from '../engine';

const STORAGE_KEY = 'auramath-gamification-v1';

export interface TrackNodeProgress {
  nodeId: string;
  completed: boolean;
  stars: number; // 0 to 3
  bestAccuracy: number;
  completedAt: string;
}

export interface GamificationStoreState {
  streak: StreakState;
  stars: number;
  xp: number;
  weeklyXp: number;
  activeXpBoost: {
    multiplier: number;
    expiresAt: number; // timestamp ms
  } | null;
  league: WeeklyLeagueState;
  achievements: AchievementItem[];
  communityQuest: CommunityQuestState;
  activeNudge: AuraNudge | null;
  recentlyUnlockedAchievement: AchievementItem | null;
  nodeProgress: Record<string, TrackNodeProgress>;
}

const DEFAULT_STATE: GamificationStoreState = {
  streak: INITIAL_STREAK_STATE,
  stars: 48,
  xp: 320,
  weeklyXp: 420,
  activeXpBoost: null,
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
  public completeTrackNode(nodeId: string, stars: number = 3, accuracy: number = 100): boolean {
    if (accuracy < 80) return false;
    const calcStars = Math.min(3, Math.max(1, stars));
    const existing = this.state.nodeProgress[nodeId];
    const prevStars = existing?.stars || 0;
    const finalStars = Math.max(prevStars, calcStars);
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
    } else if (!existing?.completed) {
      this.state.stars += 3;
    }

    this.saveState();
    return true;
  }

  public getNodeProgress(nodeId: string): TrackNodeProgress | undefined {
    return this.state.nodeProgress[nodeId];
  }

  public isNodeUnlocked(nodeId: string, prerequisites: string[] = []): boolean {
    if (!prerequisites || prerequisites.length === 0) return true;
    return prerequisites.every((preId) => Boolean(this.state.nodeProgress[preId]?.completed));
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

    // Node Progress Persistence (Mandatory retention rule: >= 80% to master)
    if (nodeId && accuracy >= 80) {
      const calcStars = starsEarned > 0 ? starsEarned : accuracy >= 95 ? 3 : accuracy >= 85 ? 2 : 1;
      const existing = this.state.nodeProgress[nodeId];
      const prevStars = existing?.stars || 0;
      const finalStars = Math.max(prevStars, calcStars);
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
      this.state.stars += starsDiff > 0 ? starsDiff : (existing?.completed ? 0 : 3);
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

    this.saveState();

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
}

export const gamificationEngine = new GamificationEngine();
