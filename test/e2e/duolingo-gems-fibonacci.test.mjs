/**
 * E2E Verification Suite — Frente C: Economia de Gemas & Assinatura Aura Fibonacci
 * Tests:
 * 1. Pure Economy Transactions in @auramath/engine (Streak Freeze, XP Boost, Fibonacci, Notebook Themes)
 * 2. Shop & Theme Catalogs Integrity
 * 3. Component and View Structural Integrity (ShopView, AuraFibonacciModal, ActiveXpBoostPill)
 * 4. App Shell Integration & Theming Propagation
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  buyStreakFreezeItem,
  buyXpBoostItem,
  activateFibonacciSubscription,
  setNotebookTheme,
  DEFAULT_SHOP_ITEMS,
  DEFAULT_NOTEBOOK_THEMES,
} from '../../packages/engine/dist/index.js';

const ROOT_DIR = process.cwd();

describe('Frente C — Economia de Gemas & Assinatura Aura Fibonacci', () => {
  // ==========================================================================
  // TIER 1: Funções de Economia Pura (@auramath/engine)
  // ==========================================================================
  describe('Tier 1: Engine Economy Algorithms & Transactions', () => {
    test('buyStreakFreezeItem executes valid purchase and bounds at max 2 charges', () => {
      // 1. Compra com saldo suficiente (0 -> 1 carga)
      const res1 = buyStreakFreezeItem(200, 0, 100);
      assert.equal(res1.success, true);
      assert.equal(res1.remainingGems, 100);
      assert.equal(res1.newFreezesAvailable, 1);

      // 2. Compra de segunda carga (1 -> 2 cargas)
      const res2 = buyStreakFreezeItem(100, 1, 100);
      assert.equal(res2.success, true);
      assert.equal(res2.remainingGems, 0);
      assert.equal(res2.newFreezesAvailable, 2);

      // 3. Tentativa de compra acima do teto de 2 cargas -> rejeitado
      const res3 = buyStreakFreezeItem(500, 2, 100);
      assert.equal(res3.success, false);
      assert.equal(res3.newFreezesAvailable, 2);
      assert.ok(res3.error?.includes('máxima de 2'));

      // 4. Tentativa com saldo insuficiente -> rejeitado
      const res4 = buyStreakFreezeItem(50, 0, 100);
      assert.equal(res4.success, false);
      assert.equal(res4.remainingGems, 50);
      assert.ok(res4.error?.includes('Saldo insuficiente'));
    });

    test('buyXpBoostItem creates a 15-minute 2x multiplier boost', () => {
      const now = Date.now();
      const res = buyXpBoostItem(300, 15, 150);

      assert.equal(res.success, true);
      assert.equal(res.remainingGems, 150);
      assert.ok(res.boost !== null);
      assert.equal(res.boost.multiplier, 2);
      assert.equal(res.boost.durationMinutes, 15);
      // Valida janela de 15 minutos (~900.000 ms)
      assert.ok(res.boost.expiresAt >= now + 14 * 60 * 1000);
      assert.ok(res.boost.expiresAt <= now + 16 * 60 * 1000);

      // Saldo insuficiente
      const resInsuf = buyXpBoostItem(80, 15, 150);
      assert.equal(resInsuf.success, false);
      assert.equal(resInsuf.boost, null);
    });

    test('activateFibonacciSubscription computes 7-day trial and duration', () => {
      const subAnnual = activateFibonacciSubscription('annual', 7);
      assert.equal(subAnnual.isFibonacciMember, true);
      assert.equal(subAnnual.plan, 'annual');
      assert.ok(subAnnual.startedAt);
      assert.ok(subAnnual.trialEndsAt);
      assert.ok(subAnnual.expiresAt);

      const trialDate = new Date(subAnnual.trialEndsAt);
      const startDate = new Date(subAnnual.startedAt);
      const diffDays = Math.round((trialDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      assert.equal(diffDays, 7, 'Trial period must be exactly 7 days');

      const subMonthly = activateFibonacciSubscription('monthly', 7);
      assert.equal(subMonthly.plan, 'monthly');
    });

    test('setNotebookTheme enforces prestige access for exclusive themes', () => {
      // Papiro Clássico: Livre para todos
      const rPapiro = setNotebookTheme('papiro', false, ['papiro']);
      assert.equal(rPapiro.success, true);
      assert.equal(rPapiro.activeTheme, 'papiro');

      // Blueprint: Bloqueado para não-membros sem desbloqueio
      const rBlueprintFail = setNotebookTheme('blueprint', false, ['papiro']);
      assert.equal(rBlueprintFail.success, false);
      assert.ok(rBlueprintFail.error?.includes('requer assinatura Aura Fibonacci'));

      // Blueprint: Permitido para Membro Fibonacci
      const rBlueprintOk = setNotebookTheme('blueprint', true, ['papiro', 'blueprint']);
      assert.equal(rBlueprintOk.success, true);
      assert.equal(rBlueprintOk.activeTheme, 'blueprint');

      // Dark Obsidian: Permitido para Membro Fibonacci
      const rObsidianOk = setNotebookTheme('obsidian', true, ['papiro', 'blueprint', 'obsidian']);
      assert.equal(rObsidianOk.success, true);
      assert.equal(rObsidianOk.activeTheme, 'obsidian');
    });
  });

  // ==========================================================================
  // TIER 2: Integridade dos Catálogos da Loja e Papelaria
  // ==========================================================================
  describe('Tier 2: Shop and Themes Catalogs', () => {
    test('DEFAULT_SHOP_ITEMS contains all 4 canonical items with valid pricing', () => {
      assert.ok(DEFAULT_SHOP_ITEMS.length >= 4);

      const freeze = DEFAULT_SHOP_ITEMS.find((i) => i.id === 'shop_streak_freeze');
      assert.ok(freeze);
      assert.equal(freeze.costGems, 100);
      assert.equal(freeze.actionType, 'buy_freeze');

      const boost = DEFAULT_SHOP_ITEMS.find((i) => i.id === 'shop_xp_boost_15m');
      assert.ok(boost);
      assert.equal(boost.costGems, 150);
      assert.equal(boost.actionType, 'buy_boost');

      const wager = DEFAULT_SHOP_ITEMS.find((i) => i.id === 'shop_streak_wager_7d');
      assert.ok(wager);
      assert.equal(wager.costGems, 50);

      const fibonacci = DEFAULT_SHOP_ITEMS.find((i) => i.id === 'shop_fibonacci_tier');
      assert.ok(fibonacci);
      assert.equal(fibonacci.actionType, 'open_fibonacci_modal');
    });

    test('DEFAULT_NOTEBOOK_THEMES contains papiro, blueprint, and obsidian', () => {
      assert.equal(DEFAULT_NOTEBOOK_THEMES.length, 3);

      const ids = DEFAULT_NOTEBOOK_THEMES.map((t) => t.id);
      assert.deepEqual(ids, ['papiro', 'blueprint', 'obsidian']);

      const blueprint = DEFAULT_NOTEBOOK_THEMES.find((t) => t.id === 'blueprint');
      assert.equal(blueprint.isExclusiveFibonacci, true);
      assert.equal(blueprint.previewBg, '#0F2633');

      const obsidian = DEFAULT_NOTEBOOK_THEMES.find((t) => t.id === 'obsidian');
      assert.equal(obsidian.isExclusiveFibonacci, true);
      assert.equal(obsidian.previewBg, '#151817');
    });
  });

  // ==========================================================================
  // TIER 3: Verificação Estrutural de Componentes e Vistas
  // ==========================================================================
  describe('Tier 3: Component and UI Integrity', () => {
    test('AuraFibonacciModal.tsx renders golden spiral, Prisma supernova, and 7-day trial button', () => {
      const modalPath = path.join(ROOT_DIR, 'src/components/editorial/AuraFibonacciModal.tsx');
      assert.ok(fs.existsSync(modalPath), 'AuraFibonacciModal.tsx must exist');

      const content = fs.readFileSync(modalPath, 'utf8');
      assert.ok(content.includes('Aura Fibonacci'), 'Must display title');
      assert.ok(content.includes('PrismaMascotWeb'), 'Must include Prisma mascot');
      assert.ok(content.includes('state="supernova"'), 'Prisma must be in supernova state');
      assert.ok(content.includes('EXPERIMENTAR 7 DIAS GRÁTIS'), 'Must include 7-day trial CTA');
      assert.ok(content.includes('Radar Cognitivo Ilimitado'), 'Must list cognitive radar benefit');
      assert.ok(content.includes('audioSynth'), 'Must trigger audio synthesis');
    });

    test('ShopView.tsx contains 4 editorial sections and 430px layout alignment', () => {
      const shopPath = path.join(ROOT_DIR, 'src/views/ShopView.tsx');
      assert.ok(fs.existsSync(shopPath), 'ShopView.tsx must exist');

      const content = fs.readFileSync(shopPath, 'utf8');
      assert.ok(content.includes('Loja Editorial'), 'Must render shop header');
      assert.ok(content.includes('Ofensiva & Proteção'), 'Must render streak section');
      assert.ok(content.includes('Impulso Cognitivo'), 'Must render XP boost section');
      assert.ok(content.includes('Cadernos & Personalização'), 'Must render notebook theme section');
      assert.ok(content.includes('onOpenFibonacciModal'), 'Must support opening Fibonacci modal');
      assert.ok(content.includes('gamState.stars'), 'Must display dynamic gem balance');
    });

    test('ActiveXpBoostPill.tsx implements tabular countdown timer', () => {
      const pillPath = path.join(ROOT_DIR, 'src/components/editorial/ActiveXpBoostPill.tsx');
      assert.ok(fs.existsSync(pillPath), 'ActiveXpBoostPill.tsx must exist');

      const content = fs.readFileSync(pillPath, 'utf8');
      assert.ok(content.includes('font-mono-tabular'), 'Must use tabular numeric font');
      assert.ok(content.includes('setInterval'), 'Must count down each second');
      assert.ok(content.includes('onExpire'), 'Must notify on timer expiration');
    });

    test('App.tsx integrates /shop route, interactive gems header pill, and Fibonacci modal', () => {
      const appPath = path.join(ROOT_DIR, 'src/App.tsx');
      const content = fs.readFileSync(appPath, 'utf8');

      assert.ok(content.includes("type === 'shop'"), 'Must route to shop');
      assert.ok(content.includes('<ShopView'), 'Must render ShopView');
      assert.ok(content.includes('<AuraFibonacciModal'), 'Must render AuraFibonacciModal');
      assert.ok(content.includes("navigateTo('/shop')"), 'Gems pill must navigate to /shop');
      assert.ok(content.includes('themeCssVars'), 'Must apply dynamic theme CSS variables');
    });
  });
});
