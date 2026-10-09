/**
 * @auramath/engine - Behavioral Gamification & User Retention System
 *
 * Implements the 6 pillars of behavioral gamification:
 * 1. Streaks with Freeze protection, Wagers (self-contracts), and Rescue mechanics
 * 2. Day 1 Instant Achievements & Tiered Badges (Editorial Prestige)
 * 3. Weekly Segmented Leagues (Cohorts of 30 learners)
 * 4. Variable Intermittent Rewards (Chests with drops, 2x XP Focus Boosts)
 * 5. Community Quests (Collective Goals with exclusive Badges, NO skins)
 * 6. Humanized Aura Mascot Nudges (Witty, complicit, non-biological copy)
 */

export type LeagueTier = 'papiro' | 'abaco' | 'astrolabio' | 'compasso' | 'arquimedes';

export interface StreakWager {
  targetDays: 7 | 14;
  betStars: number;
  rewardMultiplier: number;
  startedAt: string; // YYYY-MM-DD
  daysCompleted: number;
  status: 'active' | 'won' | 'lost';
}

export interface StreakState {
  current: number;
  highest: number;
  lastActiveDate: string; // YYYY-MM-DD
  freezesAvailable: number; // max 2
  freezesUsedDates: string[];
  wager: StreakWager | null;
  canRescue: boolean;
  rescueTasksCompleted: number; // 0 to 3
}

export interface ActiveXpBoost {
  multiplier: number;
  expiresAt: number; // timestamp ms
  durationMinutes: number;
}

export interface DiscoveryChestReward {
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  xp: number;
  stars: number;
  xpBoostMinutes?: number;
  freezeAwarded?: boolean;
  badgeId?: string;
  badgeTitle?: string;
  headline: string;
  description: string;
}

export interface LeagueParticipant {
  id: string;
  name: string;
  avatarLetter: string;
  avatarColor: string;
  xp: number;
  isUser: boolean;
  rank: number;
  previousRank: number;
}

export interface WeeklyLeagueState {
  tier: LeagueTier;
  tierName: string;
  cohortId: string;
  resetTime: string; // ISO string
  participants: LeagueParticipant[];
  userRank: number;
}

export type AchievementCategory = 'day1' | 'symmetry' | 'speed' | 'consistency' | 'community';
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  targetValue: number;
  unlocked: boolean;
  progress: number;
  unlockedAt?: string;
  iconName: string;
}

export interface CommunityQuestState {
  id: string;
  title: string;
  tagline: string;
  targetTotal: number;
  currentTotal: number;
  userContribution: number;
  deadline: string;
  rewardBadgeTitle: string;
  rewardDescription: string;
}

export interface AuraNudge {
  id: string;
  title: string;
  message: string;
  style: 'complice' | 'provocacao' | 'urgencia' | 'celebracao';
  actionLabel: string;
  actionRoute: 'track' | 'duels' | 'train';
}

// ==========================================
// 1. STREAK ENGINE & CALCULATIONS
// ==========================================

export function formatISODate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysBetween(dateStrA: string, dateStrB: string): number {
  if (!dateStrA || !dateStrB) return 999;
  const a = new Date(`${dateStrA}T00:00:00`);
  const b = new Date(`${dateStrB}T00:00:00`);
  const diffMs = Math.abs(b.getTime() - a.getTime());
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export const INITIAL_STREAK_STATE: StreakState = {
  current: 18,
  highest: 24,
  lastActiveDate: formatISODate(),
  freezesAvailable: 1,
  freezesUsedDates: [],
  wager: null,
  canRescue: false,
  rescueTasksCompleted: 0,
};

/**
 * Evaluates the streak status based on the current date and user activity.
 */
export function evaluateStreakStatus(state: StreakState, todayStr: string = formatISODate()): StreakState {
  if (!state.lastActiveDate) {
    return { ...state, current: 0, lastActiveDate: todayStr };
  }

  const diff = daysBetween(state.lastActiveDate, todayStr);

  if (diff === 0) {
    // Already practiced today
    return state;
  }

  if (diff === 1) {
    // Normal day transition (yesterday practiced, today still waiting)
    return state;
  }

  // User missed 1 or more days
  const missedDays = diff - 1;
  const nextState = { ...state };

  if (nextState.freezesAvailable >= missedDays && missedDays === 1) {
    // Consumes 1 streak freeze
    nextState.freezesAvailable -= 1;
    nextState.freezesUsedDates = [...nextState.freezesUsedDates, state.lastActiveDate];
    // Streak preserved!
    return nextState;
  }

  // No freeze available or missed more than 1 day: Streak broken, offer rescue
  nextState.current = 0;
  nextState.canRescue = true;
  nextState.rescueTasksCompleted = 0;

  if (nextState.wager && nextState.wager.status === 'active') {
    nextState.wager = { ...nextState.wager, status: 'lost' };
  }

  return nextState;
}

/**
 * Registers completion of daily practice.
 */
export function registerDailyActivity(state: StreakState, todayStr: string = formatISODate()): {
  updatedState: StreakState;
  wagerRewardStars: number;
} {
  const evaluated = evaluateStreakStatus(state, todayStr);
  const diff = daysBetween(evaluated.lastActiveDate, todayStr);

  let newCurrent = evaluated.current;
  if (diff >= 1 || evaluated.current === 0) {
    newCurrent = evaluated.current + 1;
  }

  const newHighest = Math.max(evaluated.highest, newCurrent);
  let wagerRewardStars = 0;
  let nextWager = evaluated.wager;

  if (nextWager && nextWager.status === 'active') {
    const daysDone = nextWager.daysCompleted + 1;
    if (daysDone >= nextWager.targetDays) {
      wagerRewardStars = Math.round(nextWager.betStars * nextWager.rewardMultiplier);
      nextWager = { ...nextWager, daysCompleted: daysDone, status: 'won' };
    } else {
      nextWager = { ...nextWager, daysCompleted: daysDone };
    }
  }

  return {
    updatedState: {
      ...evaluated,
      current: newCurrent,
      highest: newHighest,
      lastActiveDate: todayStr,
      canRescue: false,
      rescueTasksCompleted: 0,
      wager: nextWager,
    },
    wagerRewardStars,
  };
}

/**
 * Buys or equips a Streak Freeze using Stars. Max capacity is 2.
 */
export function buyStreakFreeze(
  state: StreakState,
  currentStars: number,
  cost: number = 100
): { success: boolean; state: StreakState; remainingStars: number } {
  if (state.freezesAvailable >= 2 || currentStars < cost) {
    return { success: false, state, remainingStars: currentStars };
  }

  return {
    success: true,
    state: { ...state, freezesAvailable: state.freezesAvailable + 1 },
    remainingStars: currentStars - cost,
  };
}

/**
 * Places a Streak Wager (self-contract).
 */
export function placeStreakWager(
  state: StreakState,
  currentStars: number,
  targetDays: 7 | 14 = 7,
  betStars: number = 50
): { success: boolean; state: StreakState; remainingStars: number } {
  if (state.wager?.status === 'active' || currentStars < betStars) {
    return { success: false, state, remainingStars: currentStars };
  }

  const wager: StreakWager = {
    targetDays,
    betStars,
    rewardMultiplier: 2.0,
    startedAt: formatISODate(),
    daysCompleted: 0,
    status: 'active',
  };

  return {
    success: true,
    state: { ...state, wager },
    remainingStars: currentStars - betStars,
  };
}

/**
 * Progresses the Streak Rescue operation (3 challenging puzzles to restore streak).
 */
export function completeRescueStep(state: StreakState, restoredStreakValue: number = 18): StreakState {
  const tasksDone = state.rescueTasksCompleted + 1;
  if (tasksDone >= 3) {
    return {
      ...state,
      current: Math.max(1, restoredStreakValue),
      canRescue: false,
      rescueTasksCompleted: 3,
      lastActiveDate: formatISODate(),
    };
  }
  return {
    ...state,
    rescueTasksCompleted: tasksDone,
  };
}

// ==========================================
// 2. VARIABLE REWARDS & CHEST DROPS
// ==========================================

export function rollDiscoveryChestReward(grade: number = 1, randomSeed: number = Math.random()): DiscoveryChestReward {
  // Ponderação:
  // 55% Comum
  // 25% Incomum
  // 15% Raro (XP Boost de 15 min)
  // 5% Lendário (Streak Freeze + 200 XP)
  if (randomSeed < 0.55) {
    const xp = 40 + Math.floor(randomSeed * 40); // 40..62
    return {
      rarity: 'common',
      xp,
      stars: 5,
      headline: 'Anotação Marginal de Descoberta',
      description: `Você encontrou atalhos preciosos na Unidade ${grade}. +${xp} Pontos de Descoberta e +5 Estrelas.`,
    };
  }

  if (randomSeed < 0.80) {
    const xp = 80 + Math.floor((randomSeed - 0.55) * 160); // 80..120
    return {
      rarity: 'uncommon',
      xp,
      stars: 15,
      badgeId: 'SEAL_EUREKA',
      badgeTitle: 'Selo Eureka de Observação',
      headline: 'Envelope Selado com Eureka',
      description: `Um registro estrutural notável! +${xp} XP, +15 Estrelas e o Selo Eureka gravado em seu caderno.`,
    };
  }

  if (randomSeed < 0.95) {
    return {
      rarity: 'rare',
      xp: 100,
      stars: 20,
      xpBoostMinutes: 15,
      headline: 'Frasco de Tinta Concentrada (✦ 2x XP)',
      description: 'Impulso de Foco Ativado! Durante os próximos 15 minutos, todas as suas descobertas rendem o dobro de XP!',
    };
  }

  // 0.95..1.00 (Lendário)
  return {
    rarity: 'legendary',
    xp: 220,
    stars: 50,
    freezeAwarded: true,
    headline: 'Manuscrito Antigo de Arquimedes',
    description: 'Um achado extraordinário! +220 XP, +50 Estrelas e 1 Bloqueio de Ofensiva (Escudo de Gelo) adicionado ao inventário.',
  };
}

// ==========================================
// 3. WEEKLY SEGMENTED LEAGUES
// ==========================================

export const LEAGUE_TIER_CONFIG: Record<LeagueTier, { name: string; color: string; order: number; minXp: number }> = {
  papiro: { name: 'Liga Papiro', color: '#176B5B', order: 1, minXp: 0 },
  abaco: { name: 'Liga Ábaco', color: '#F2B84B', order: 2, minXp: 400 },
  astrolabio: { name: 'Liga Astrolábio', color: '#E76F61', order: 3, minXp: 900 },
  compasso: { name: 'Liga Compasso', color: '#6E5AA6', order: 4, minXp: 1600 },
  arquimedes: { name: 'Liga Arquimedes', color: '#176B5B', order: 5, minXp: 2500 },
};

const COHORT_NAMES = [
  'Beatriz Silva', 'Lucas Mendes', 'Carlos Drumond', 'Helena Roitman', 'Mateus Siqueira',
  'Laura Paiva', 'Gabriel Toledo', 'Camila Duarte', 'Rodrigo Naves', 'Sofia Esteves',
  'Felipe Antunes', 'Mariana Bastos', 'Thiago Vilela', 'Renata Gusmão', 'Otávio Prado',
  'Juliana Reis', 'Daniel Fogaça', 'Clarice Falcão', 'Eduardo Neves', 'Bianca Morais',
  'Henrique Diniz', 'Isabela Couto', 'Vitor Meireles', 'Larissa Fontes', 'Guilherme Maia',
  'Tatiana Lins', 'Caio Albuquerque', 'Vanessa Porto', 'Arthur Ferraz'
];

export function generateWeeklyCohort(tier: LeagueTier = 'papiro', userWeeklyXp: number = 420): LeagueParticipant[] {
  const participants: LeagueParticipant[] = [];

  // Generate 29 realistic simulated peers around the user's score
  COHORT_NAMES.forEach((name, i) => {
    // Gaussian-like spread from 50 to 950 XP
    const factor = (i + 1) / 30;
    const baseVariance = Math.sin(i * 1.7) * 80;
    const peerXp = Math.max(30, Math.round(920 - factor * 820 + baseVariance));

    const initials = name.split(' ').map((n) => n[0]).join('');
    participants.push({
      id: `peer-${i + 1}`,
      name,
      avatarLetter: initials,
      avatarColor: i % 2 === 0 ? '#176B5B' : i % 3 === 0 ? '#6E5AA6' : '#F2B84B',
      xp: peerXp,
      isUser: false,
      rank: 0,
      previousRank: Math.min(30, Math.max(1, i + 1 + (i % 3 === 0 ? -1 : 1))),
    });
  });

  // Insert user
  participants.push({
    id: 'user-self',
    name: 'Você (Alexandre)',
    avatarLetter: 'AM',
    avatarColor: '#176B5B',
    xp: userWeeklyXp,
    isUser: true,
    rank: 0,
    previousRank: 12,
  });

  // Sort descending by XP
  participants.sort((a, b) => b.xp - a.xp);

  // Assign ranks
  participants.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  return participants;
}

export function getLeagueZone(rank: number): 'promotion' | 'safe' | 'relegation' {
  if (rank <= 7) return 'promotion';
  if (rank >= 26) return 'relegation';
  return 'safe';
}

// ==========================================
// 4. ACHIEVEMENTS & PRESTIGE BADGES
// ==========================================

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  // Day 1 / Onboarding Instant Victories
  {
    id: 'FIRST_INSIGHT',
    title: 'Primeiro Olhar Estrutural',
    description: 'Concluiu a 1ª lição observando o padrão sem recorrer a papel ou cálculo armado.',
    category: 'day1',
    tier: 'bronze',
    targetValue: 1,
    unlocked: true,
    progress: 1,
    unlockedAt: '2026-10-09',
    iconName: 'Eye',
  },
  {
    id: 'FERMI_SPARK',
    title: 'Salto de Fermi',
    description: 'Estimou com precisão a ordem de grandeza antes de calcular a expressão.',
    category: 'day1',
    tier: 'bronze',
    targetValue: 1,
    unlocked: false,
    progress: 0,
    iconName: 'Zap',
  },
  {
    id: 'FIRST_STAMP',
    title: 'Página Inaugural',
    description: 'Abriu seu primeiro envelope de descoberta e fixou um selo no caderno.',
    category: 'day1',
    tier: 'bronze',
    targetValue: 1,
    unlocked: true,
    progress: 1,
    unlockedAt: '2026-10-09',
    iconName: 'BookOpen',
  },

  // Scaled Multi-tier Badges (74.2% Retention Driver)
  {
    id: 'SYMMETRY_HUNTER_1',
    title: 'Caçador de Simetrias I',
    description: 'Aplicou a regra da diferença de quadrados (a-b)(a+b) em 10 operações.',
    category: 'symmetry',
    tier: 'bronze',
    targetValue: 10,
    unlocked: true,
    progress: 10,
    unlockedAt: '2026-10-09',
    iconName: 'Compass',
  },
  {
    id: 'SYMMETRY_HUNTER_2',
    title: 'Caçador de Simetrias II',
    description: 'Reconheceu atalhos simétricos e pivôs de base 50 em 50 operações.',
    category: 'symmetry',
    tier: 'silver',
    targetValue: 50,
    unlocked: false,
    progress: 24,
    iconName: 'Compass',
  },
  {
    id: 'TITANIUM_STREAK_7',
    title: 'Semana de Nanquim',
    description: 'Manteve sua ofensiva ininterrupta por 7 dias consecutivos.',
    category: 'consistency',
    tier: 'bronze',
    targetValue: 7,
    unlocked: true,
    progress: 7,
    unlockedAt: '2026-10-02',
    iconName: 'Flame',
  },
  {
    id: 'TITANIUM_STREAK_30',
    title: 'Ciclo Lunar de Foco',
    description: 'Alcançou a marca sagrada de 30 dias de prática diária no caderno.',
    category: 'consistency',
    tier: 'gold',
    targetValue: 30,
    unlocked: false,
    progress: 18,
    iconName: 'Flame',
  },
  {
    id: 'COMMUNITY_PILLAR',
    title: 'Pilar da Comunidade',
    description: 'Contribuiu com 20 ou mais padrões no Grande Desafio Coletivo de Alexandria.',
    category: 'community',
    tier: 'silver',
    targetValue: 20,
    unlocked: true,
    progress: 38,
    unlockedAt: '2026-10-08',
    iconName: 'Award',
  },
];

// ==========================================
// 5. COMMUNITY QUEST (NO SKINS, EXCLUSIVE BADGE)
// ==========================================

export const INITIAL_COMMUNITY_QUEST: CommunityQuestState = {
  id: 'QUEST_ALEXANDRIA_01',
  title: 'Construção do Observatório de Alexandria',
  tagline: 'Meta coletiva de toda a comunidade Auramath para despertar o Grande Astrolábio.',
  targetTotal: 250000,
  currentTotal: 184320,
  userContribution: 38,
  deadline: '5 dias restantes',
  rewardBadgeTitle: 'Selo Honorário de Alexandria',
  rewardDescription: 'Distinção comemorativa exclusiva gravada no perfil de todos que contribuírem com 10+ padrões.',
};

// ==========================================
// 6. HUMANIZED AURA MASCOT NUDGES (NON-BIOLOGICAL)
// ==========================================

export const AURA_NUDGES: AuraNudge[] = [
  {
    id: 'nudge-streak-risk',
    title: 'O Fogo do Caderno',
    message: 'Faltam poucas horas e sua sequência de 18 dias pode virar pó. Venha resolver 1 padrão em 60s ou ative um Bloqueio de Gelo!',
    style: 'urgencia',
    actionLabel: 'Proteger Ofensiva',
    actionRoute: 'track',
  },
  {
    id: 'nudge-pedagogy-wit',
    title: 'Atalho da Preguiça Inteligente',
    message: 'Você vai mesmo armar continha no papel para 48 × 52? Eu conheço um truque de simetria que mata isso em 2 segundos. Vem ver!',
    style: 'complice',
    actionLabel: 'Ver Padrão Oculto',
    actionRoute: 'train',
  },
  {
    id: 'nudge-vanity-spark',
    title: 'Desafio Rápido',
    message: 'Seu cérebro ainda lembra como decompor números da esquerda para a direita ou enferrujou desde ontem?',
    style: 'provocacao',
    actionLabel: 'Testar Agora',
    actionRoute: 'duels',
  },
  {
    id: 'nudge-victory',
    title: 'Elegância Geométrica',
    message: 'Você economizou segundos preciosos de esforço mecânico hoje pensando antes de calcular. Isso é maestria!',
    style: 'celebracao',
    actionLabel: 'Continuar no Ritmo',
    actionRoute: 'track',
  },
];
