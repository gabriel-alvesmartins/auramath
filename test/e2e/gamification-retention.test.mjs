/**
 * E2E Verification Suite — Behavioral Gamification & User Retention System
 * Tests all 6 core retention strategies and guardrails.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateStreakStatus,
  registerDailyActivity,
  buyStreakFreeze,
  placeStreakWager,
  completeRescueStep,
  rollDiscoveryChestReward,
  generateWeeklyCohort,
  getLeagueZone,
  INITIAL_STREAK_STATE,
  INITIAL_ACHIEVEMENTS,
  INITIAL_COMMUNITY_QUEST,
  AURA_NUDGES,
} from '../../packages/engine/src/gamification.ts';

describe('Gamification Retention Suite', () => {

  // ==========================================================================
  // Pillar 1: Streaks with Freeze, Wager and Rescue
  // ==========================================================================
  describe('Pillar 1: Streaks, Freeze Protection & Wagers', () => {
    test('Daily consecutive activity increments streak counter', () => {
      const state = {
        ...INITIAL_STREAK_STATE,
        current: 5,
        highest: 10,
        lastActiveDate: '2026-10-08',
      };

      const { updatedState } = registerDailyActivity(state, '2026-10-09');
      assert.equal(updatedState.current, 6);
      assert.equal(updatedState.lastActiveDate, '2026-10-09');
    });

    test('Missing one day with available freeze consumes 1 freeze and preserves streak', () => {
      const state = {
        ...INITIAL_STREAK_STATE,
        current: 14,
        lastActiveDate: '2026-10-07',
        freezesAvailable: 1,
        freezesUsedDates: [],
      };

      // 2 days later (missed Oct 8)
      const evaluated = evaluateStreakStatus(state, '2026-10-09');
      assert.equal(evaluated.current, 14, 'Streak must be preserved by freeze');
      assert.equal(evaluated.freezesAvailable, 0, 'Freeze must be consumed');
      assert.equal(evaluated.freezesUsedDates.length, 1);
    });

    test('Missing days without freeze breaks streak and activates rescue mode', () => {
      const state = {
        ...INITIAL_STREAK_STATE,
        current: 18,
        lastActiveDate: '2026-10-06',
        freezesAvailable: 0,
        freezesUsedDates: [],
        canRescue: false,
      };

      const evaluated = evaluateStreakStatus(state, '2026-10-09');
      assert.equal(evaluated.current, 0, 'Streak resets to 0');
      assert.equal(evaluated.canRescue, true, 'Rescue mode becomes available');
    });

    test('Completing 3 rescue steps restores lost streak', () => {
      let state = {
        ...INITIAL_STREAK_STATE,
        current: 0,
        canRescue: true,
        rescueTasksCompleted: 0,
      };

      state = completeRescueStep(state, 18);
      assert.equal(state.rescueTasksCompleted, 1);
      assert.equal(state.current, 0);

      state = completeRescueStep(state, 18);
      assert.equal(state.rescueTasksCompleted, 2);

      state = completeRescueStep(state, 18);
      assert.equal(state.rescueTasksCompleted, 3);
      assert.equal(state.current, 18, 'Streak restored after 3 tasks');
      assert.equal(state.canRescue, false, 'Rescue mode closed');
    });

    test('Streak Wager (7-day autocontract) pays out 2x stars upon completion', () => {
      let state = {
        ...INITIAL_STREAK_STATE,
        current: 10,
        lastActiveDate: '2026-10-10',
        wager: null,
      };

      // Place wager with 50 stars
      const wagerRes = placeStreakWager(state, 100, 7, 50);
      assert.equal(wagerRes.success, true);
      assert.equal(wagerRes.remainingStars, 50);
      state = wagerRes.state;

      // Simulate 6 days of consecutive daily activity
      for (let i = 11; i <= 16; i++) {
        const res = registerDailyActivity(state, `2026-10-${i}`);
        state = res.updatedState;
        assert.equal(res.wagerRewardStars, 0, 'No reward until target reached');
      }

      // Day 7 activity
      const finalDay = registerDailyActivity(state, '2026-10-17');
      assert.equal(finalDay.wagerRewardStars, 100, 'Pays 2x bet (50 * 2 = 100)');
      assert.equal(finalDay.updatedState.wager?.status, 'won');
    });

    test('Buying Streak Freeze caps at 2 max capacity', () => {
      let state = { ...INITIAL_STREAK_STATE, freezesAvailable: 1 };
      const res1 = buyStreakFreeze(state, 150, 100);
      assert.equal(res1.success, true);
      assert.equal(res1.state.freezesAvailable, 2);
      assert.equal(res1.remainingStars, 50);

      // Attempt buying third freeze
      const res2 = buyStreakFreeze(res1.state, 200, 100);
      assert.equal(res2.success, false, 'Cannot buy past 2 freezes');
      assert.equal(res2.state.freezesAvailable, 2);
    });
  });

  // ==========================================================================
  // Pillar 2: Day 1 & Tiered Badges (Editorial Prestige, NO SKINS)
  // ==========================================================================
  describe('Pillar 2: Badges and Achievements', () => {
    test('Initial catalog includes Day 1 instant achievements', () => {
      const day1Badges = INITIAL_ACHIEVEMENTS.filter((a) => a.category === 'day1');
      assert.ok(day1Badges.length >= 3, 'Must have at least 3 Day 1 onboarding badges');

      const firstInsight = day1Badges.find((a) => a.id === 'FIRST_INSIGHT');
      assert.ok(firstInsight, 'Must have FIRST_INSIGHT');
      assert.equal(firstInsight.tier, 'bronze');
    });

    test('All achievement rewards are prestige seals, zero skins', () => {
      INITIAL_ACHIEVEMENTS.forEach((ach) => {
        assert.ok(!ach.id.includes('SKIN'), 'No skin in achievement id');
        assert.ok(!ach.title.toLowerCase().includes('skin'), 'No skin in title');
        assert.ok(!ach.description.toLowerCase().includes('skin'), 'No skin in description');
      });
    });
  });

  // ==========================================================================
  // Pillar 3: Weekly Segmented Leagues (Cohorts of 30)
  // ==========================================================================
  describe('Pillar 3: Weekly Segmented Leagues', () => {
    test('Generates cohort of exactly 30 participants including user', () => {
      const cohort = generateWeeklyCohort('papiro', 450);
      assert.equal(cohort.length, 30, 'Cohort must contain exactly 30 students');

      const user = cohort.find((p) => p.isUser);
      assert.ok(user, 'User must be present in cohort');
      assert.equal(user.xp, 450);
    });

    test('Participants are strictly sorted by XP descending and ranks 1 to 30', () => {
      const cohort = generateWeeklyCohort('papiro', 500);
      for (let i = 0; i < cohort.length - 1; i++) {
        assert.ok(cohort[i].xp >= cohort[i + 1].xp, `Rank ${cohort[i].rank} XP >= Rank ${cohort[i + 1].rank} XP`);
        assert.equal(cohort[i].rank, i + 1);
      }
      assert.equal(cohort[29].rank, 30);
    });

    test('League zones match retention specifications (Top 7 promotion, Bottom 5 relegation)', () => {
      assert.equal(getLeagueZone(1), 'promotion');
      assert.equal(getLeagueZone(7), 'promotion');
      assert.equal(getLeagueZone(8), 'safe');
      assert.equal(getLeagueZone(25), 'safe');
      assert.equal(getLeagueZone(26), 'relegation');
      assert.equal(getLeagueZone(30), 'relegation');
    });
  });

  // ==========================================================================
  // Pillar 4: Variable Rewards & Intermittent Drops
  // ==========================================================================
  describe('Pillar 4: Variable Drops & Intermittent Reinforcement', () => {
    test('Simulated drops follow expected probability curve (55% Common, 15% Rare Boost, 5% Legendary)', () => {
      const sampleSize = 2000;
      let commonCount = 0;
      let rareCount = 0;
      let legendaryCount = 0;

      for (let i = 0; i < sampleSize; i++) {
        const seed = Math.random();
        const drop = rollDiscoveryChestReward(1, seed);
        if (drop.rarity === 'common') commonCount++;
        if (drop.rarity === 'rare') rareCount++;
        if (drop.rarity === 'legendary') legendaryCount++;
      }

      const commonPct = commonCount / sampleSize;
      const rarePct = rareCount / sampleSize;
      const legendaryPct = legendaryCount / sampleSize;

      assert.ok(commonPct >= 0.50 && commonPct <= 0.60, `Common % (${commonPct}) should be near 55%`);
      assert.ok(rarePct >= 0.11 && rarePct <= 0.19, `Rare % (${rarePct}) should be near 15%`);
      assert.ok(legendaryPct >= 0.03 && legendaryPct <= 0.08, `Legendary % (${legendaryPct}) should be near 5%`);
    });

    test('Rare drop grants 15-minute 2x XP boost', () => {
      const rareDrop = rollDiscoveryChestReward(2, 0.85);
      assert.equal(rareDrop.rarity, 'rare');
      assert.equal(rareDrop.xpBoostMinutes, 15);
      assert.ok(rareDrop.headline.includes('2x XP'));
    });
  });

  // ==========================================================================
  // Pillar 5: Community Quests
  // ==========================================================================
  describe('Pillar 5: Community Quests', () => {
    test('Community quest is collective with exclusive honorary badge, zero skins', () => {
      assert.equal(INITIAL_COMMUNITY_QUEST.targetTotal, 250000);
      assert.ok(INITIAL_COMMUNITY_QUEST.rewardBadgeTitle.includes('Selo'));
      assert.ok(!INITIAL_COMMUNITY_QUEST.rewardDescription.toLowerCase().includes('skin'));
    });
  });

  // ==========================================================================
  // Pillar 6: Mascot Personality Guardrails (Non-Biological)
  // ==========================================================================
  describe('Pillar 6: Mascot Copy Guardrails', () => {
    test('Mascot copy does not contain biological bird traits (penas, bico, asas)', () => {
      AURA_NUDGES.forEach((nudge) => {
        const text = (nudge.title + ' ' + nudge.message).toLowerCase();
        assert.ok(!text.includes('penas'), 'Must not mention penas');
        assert.ok(!text.includes('bico'), 'Must not mention bico');
        assert.ok(!text.includes('asas'), 'Must not mention asas');
        assert.ok(!text.includes('coruja'), 'Must not mention coruja');
      });
    });

    test('Nudges cover all 4 pedagogical psychological styles', () => {
      const styles = new Set(AURA_NUDGES.map((n) => n.style));
      assert.ok(styles.has('urgencia'));
      assert.ok(styles.has('complice'));
      assert.ok(styles.has('provocacao'));
      assert.ok(styles.has('celebracao'));
    });
  });
});
