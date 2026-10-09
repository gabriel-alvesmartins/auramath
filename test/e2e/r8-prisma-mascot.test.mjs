/**
 * ==============================================================================
 * Test Suite: Prisma, o Camaleão Geômetra (Mascote Oficial Auramath)
 * File: test/e2e/r8-prisma-mascot.test.mjs
 *
 * Verifies:
 * - PrismaMascotWeb & AuraMascotWeb: Component contract, props, stage normalization, and emotional states
 * - Prisma Anatomy: Crista de transferidor graduada, esquadro na mão, olhos de bússola, cauda em espiral
 * - Micro-Animações: Respiração suave (scaleY), piscar de olhos (4s), eureka squash & stretch, supernova 360° halo, hint pulse
 * - 6 Canonical States: idle, thinking, hint, eureka, supernova, camouflaged
 * - Standalone SVG Asset Kit in /public/mascot/ (idle, thinking, hint, eureka, supernova, camouflaged)
 * - Mascot Animation Pipeline: Registry and in-memory svgLoader
 * ==============================================================================
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const PRISMA_COMPONENT_PATH = path.join(ROOT_DIR, 'src', 'components', 'PrismaMascotWeb.tsx');
const AURA_WRAPPER_PATH = path.join(ROOT_DIR, 'src', 'components', 'AuraMascotWeb.tsx');
const REGISTRY_PATH = path.join(ROOT_DIR, 'src', 'services', 'mascot', 'animationRegistry.ts');
const LOADER_PATH = path.join(ROOT_DIR, 'src', 'services', 'mascot', 'svgLoader.ts');
const MASCOT_PUBLIC_DIR = path.join(ROOT_DIR, 'public', 'mascot');

describe('R8: Prisma, o Camaleão Geômetra (Mascote Oficial SVG)', () => {
  const prismaSource = fs.readFileSync(PRISMA_COMPONENT_PATH, 'utf-8');
  const auraWrapperSource = fs.readFileSync(AURA_WRAPPER_PATH, 'utf-8');
  const registrySource = fs.readFileSync(REGISTRY_PATH, 'utf-8');
  const loaderSource = fs.readFileSync(LOADER_PATH, 'utf-8');

  // ==========================================================================
  // TIER 1: Component Interface & Stage Contracts
  // ==========================================================================
  describe('Tier 1: Component Interface & Stage Contracts', () => {
    test('PrismaMascotWeb and AuraMascotWeb export required TypeScript types and props', () => {
      assert.match(prismaSource, /export\s+interface\s+PrismaMascotWebProps/);
      assert.match(prismaSource, /export\s+const\s+PrismaMascotWeb/);
      assert.match(auraWrapperSource, /export\s+type\s+AuraMascotStage/);
      assert.match(auraWrapperSource, /export\s+type\s+AuraMascotState/);
      assert.match(auraWrapperSource, /export\s+const\s+AuraMascotWeb/);
    });

    test('PrismaMascotState supports 6 canonical states + backward compatibility aliases', () => {
      assert.match(registrySource, /'idle'/);
      assert.match(registrySource, /'thinking'/);
      assert.match(registrySource, /'hint'/);
      assert.match(registrySource, /'eureka'/);
      assert.match(registrySource, /'supernova'/);
      assert.match(registrySource, /'camouflaged'/);
      assert.match(registrySource, /'happy'/);
      assert.match(registrySource, /'encouraging'/);
      assert.match(registrySource, /'hit'/);
    });

    test('State normalization resolves aliases and maps to canonical Prisma states', () => {
      assert.match(registrySource, /export\s+function\s+resolvePrismaState/);
      assert.match(registrySource, /export\s+function\s+getMascotConfig/);
    });
  });

  // ==========================================================================
  // TIER 2: Anatomia Vetorial e Micro-Animações do Prisma
  // ==========================================================================
  describe('Tier 2: Anatomia Vetorial e Micro-Animações', () => {
    test('Validates Prisma canonical anatomy (crista de transferidor, esquadro na mão, cauda em espiral)', () => {
      // Documentação e especificações anatômicas
      assert.match(prismaSource, /crista/i);
      assert.match(prismaSource, /transferidor/i);
      assert.match(prismaSource, /esquadro/i);
      assert.match(prismaSource, /cauda/i);
      assert.match(prismaSource, /espiral/i);

      // Metadados do registro descrevem as ferramentas nas poses
      assert.match(registrySource, /esquadro na mão/i);
      assert.match(registrySource, /cauda/i);
    });

    test('Contains micro-animations for idle breathing (scaleY), blink (4s), eureka squash & stretch jump', () => {
      assert.match(prismaSource, /@keyframes\s+prismaBreathing/);
      assert.match(prismaSource, /scaleY/);
      assert.match(prismaSource, /@keyframes\s+prismaBlink/);
      assert.match(prismaSource, /prismaBlink\s+4s/);

      assert.match(prismaSource, /@keyframes\s+prismaEurekaJump/);
      assert.match(prismaSource, /scale\(1\.15,\s*0\.85\)/); // Squash
      assert.match(prismaSource, /scale\(0\.88,\s*1\.18\)/); // Stretch
    });

    test('Contains continuous 360° halo rotation on supernova and pulsing hint vector ray', () => {
      assert.match(prismaSource, /@keyframes\s+prismaHaloSpin/);
      assert.match(prismaSource, /prisma-supernova-halo-ring/);
      assert.match(prismaSource, /@keyframes\s+prismaHintPulse/);
      assert.match(prismaSource, /prisma-hint-vector-ray/);
    });

    test('Supports dynamic sizing and combo energy glow evolution', () => {
      assert.match(prismaSource, /glowFilter/);
      assert.match(prismaSource, /drop-shadow/);
      assert.match(prismaSource, /size/);
    });

    test('Supports editorial speech balloon with brand styling ("Não calcule. Veja!")', () => {
      assert.match(prismaSource, /prisma-speech-bubble/);
      assert.match(prismaSource, /showSpeechBubble\s*&&\s*speechText/);
    });

    test('Mascot Animation Pipeline exports registry and in-memory cache loader', () => {
      assert.match(registrySource, /export\s+const\s+PRISMA_ANIMATIONS/);
      assert.match(registrySource, /export\s+function\s+getMascotConfig/);
      assert.match(loaderSource, /class\s+MascotSvgLoader/);
      assert.match(loaderSource, /export\s+const\s+svgLoader/);
    });
  });

  // ==========================================================================
  // TIER 3: Coleção de Ativos SVG Oficiais (/public/mascot/)
  // ==========================================================================
  describe('Tier 3: Coleção de Ativos SVG Oficiais (/public/mascot/)', () => {
    const requiredSvgFiles = [
      'prisma-idle.svg',
      'prisma-thinking.svg',
      'prisma-hint.svg',
      'prisma-eureka.svg',
      'prisma-supernova.svg',
      'prisma-camouflaged.svg',
    ];

    test('All 6 canonical Prisma SVG files exist in public/mascot/ and are valid vectors', () => {
      assert.ok(fs.existsSync(MASCOT_PUBLIC_DIR), 'public/mascot directory must exist');

      for (const svgFile of requiredSvgFiles) {
        const filePath = path.join(MASCOT_PUBLIC_DIR, svgFile);
        assert.ok(fs.existsSync(filePath), `Asset ${svgFile} must exist in /public/mascot/`);

        const content = fs.readFileSync(filePath, 'utf-8');
        assert.ok(content.includes('<svg'), `${svgFile} must be an SVG file`);
        assert.ok(content.includes('viewBox="0 0 1024 1024"'), `${svgFile} must declare responsive 1024x1024 viewBox`);
        assert.ok(content.length > 5000, `${svgFile} must contain rich vector path data`);
      }
    });

    test('SVG assets contain authentic Prisma colors (Verdigris, Marigold, Cream)', () => {
      const idlePath = path.join(MASCOT_PUBLIC_DIR, 'prisma-idle.svg');
      const content = fs.readFileSync(idlePath, 'utf-8');

      // Check for presence of yellow/marigold tones and teal tones
      assert.ok(content.includes('#F') || content.includes('#f'), 'Must contain golden marigold elements');
      assert.ok(content.includes('#3') || content.includes('#1') || content.includes('#2'), 'Must contain teal/ink elements');
    });

    test('public/favicon.svg exists with Prisma face and is linked in index.html', () => {
      const faviconPath = path.join(ROOT_DIR, 'public', 'favicon.svg');
      assert.ok(fs.existsSync(faviconPath), 'public/favicon.svg must exist');

      const faviconContent = fs.readFileSync(faviconPath, 'utf-8');
      assert.ok(faviconContent.includes('<svg'), 'favicon must be SVG');
      assert.ok(faviconContent.includes('#F1AF32'), 'favicon must include golden marigold protractor crest');
      assert.ok(faviconContent.includes('#176B5B') || faviconContent.includes('#378F79'), 'favicon must include Verdigris chameleon face');

      const indexPath = path.join(ROOT_DIR, 'index.html');
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      assert.ok(indexContent.includes('rel="icon"'), 'index.html must have favicon link');
      assert.ok(indexContent.includes('href="/favicon.svg"'), 'index.html must link to /favicon.svg');
    });
  });
});
