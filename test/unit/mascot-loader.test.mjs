import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getMascotConfig, resolvePrismaState, PRISMA_ANIMATIONS } from '../../src/services/mascot/animationRegistry.ts';
import { svgLoader } from '../../src/services/mascot/svgLoader.ts';

describe('Unit: Mascot Animation Registry & SVG Loader', () => {
  describe('animationRegistry', () => {
    test('Resolves all 6 canonical Prisma states correctly', () => {
      const canonicalStates = ['idle', 'thinking', 'hint', 'eureka', 'supernova', 'camouflaged'];
      for (const st of canonicalStates) {
        assert.equal(resolvePrismaState(st), st);
        const config = getMascotConfig(st);
        assert.equal(config.state, st);
        assert.ok(config.svgPath.includes('.svg'));
      }
    });

    test('Safely falls back to idle for unknown or empty states', () => {
      assert.equal(resolvePrismaState(''), 'idle');
      assert.equal(resolvePrismaState(undefined), 'idle');
      assert.equal(resolvePrismaState('unknown-quantum-state'), 'idle');
      const fallbackConfig = getMascotConfig('unknown');
      assert.equal(fallbackConfig.id, 'prisma-idle');
    });

    test('Correctly maps legacy alias states to canonical states', () => {
      assert.equal(resolvePrismaState('happy'), 'eureka');
      assert.equal(resolvePrismaState('encouraging'), 'hint');
      assert.equal(resolvePrismaState('hit'), 'thinking');
    });
  });

  describe('svgLoader in-memory cache', () => {
    test('Stores and retrieves SVG from in-memory cache with 0ms roundtrip', () => {
      const testPath = '/mascot/test-asset.svg';
      const testSvg = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>';

      // Set directly in cache for testing
      svgLoader.clearCache();
      assert.equal(svgLoader.getCachedSvg(testPath), null);

      // Verify that after preloading / caching, getCachedSvg returns identical content
      // Mocking fetch in Node environment
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () => ({
        ok: true,
        text: async () => testSvg,
      });

      return svgLoader.loadSvg(testPath).then((loaded) => {
        assert.equal(loaded, testSvg);
        assert.equal(svgLoader.getCachedSvg(testPath), testSvg);
        globalThis.fetch = originalFetch;
      });
    });

    test('Deduplicates concurrent requests for the same SVG asset', async () => {
      const pathA = '/mascot/dedup-test.svg';
      const mockSvg = '<svg viewBox="0 0 100 100"></svg>';
      let fetchCount = 0;

      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () => {
        fetchCount++;
        return {
          ok: true,
          text: async () => mockSvg,
        };
      };

      try {
        const [res1, res2, res3] = await Promise.all([
          svgLoader.loadSvg(pathA),
          svgLoader.loadSvg(pathA),
          svgLoader.loadSvg(pathA),
        ]);

        assert.equal(res1, mockSvg);
        assert.equal(res2, mockSvg);
        assert.equal(res3, mockSvg);
        assert.equal(fetchCount, 1, 'Concurrent fetches must be deduplicated into a single network call');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });
});
