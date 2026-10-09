import { getAssetUrl } from './animationRegistry';

/**
 * SVG In-Memory Cache and Asynchronous Loader
 * Provides non-blocking fetching of SVG assets with 0ms cache hits.
 */

class MascotSvgLoader {
  private cache = new Map<string, string>();
  private pending = new Map<string, Promise<string>>();

  /**
   * Loads an SVG from URL or returns cached content immediately.
   */
  async loadSvg(rawUrl: string): Promise<string> {
    const url = getAssetUrl(rawUrl);
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    if (this.pending.has(url)) {
      return this.pending.get(url)!;
    }

    const promise = (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load SVG at ${url}: ${response.statusText}`);
        }
        const text = await response.text();
        this.cache.set(url, text);
        if (rawUrl !== url) {
          this.cache.set(rawUrl, text);
        }
        this.pending.delete(url);
        return text;
      } catch (err) {
        this.pending.delete(url);
        console.warn(`[MascotSvgLoader] Error loading ${url}`, err);
        return '';
      }
    })();

    this.pending.set(url, promise);
    return promise;
  }

  /**
   * Synchronously checks if an SVG is already present in cache.
   */
  getCachedSvg(rawUrl: string): string | null {
    const url = getAssetUrl(rawUrl);
    return this.cache.get(url) || this.cache.get(rawUrl) || null;
  }

  /**
   * Preloads a list of SVG URLs in parallel.
   */
  async preloadAll(urls: string[]): Promise<void> {
    await Promise.all(urls.map((u) => this.loadSvg(u)));
  }

  /**
   * Manually sets an SVG in cache (useful for tests or inline templates).
   */
  setCache(rawUrl: string, content: string): void {
    const url = getAssetUrl(rawUrl);
    this.cache.set(url, content);
    if (rawUrl !== url) {
      this.cache.set(rawUrl, content);
    }
  }

  /**
   * Clears in-memory cache.
   */
  clear(): void {
    this.cache.clear();
    this.pending.clear();
  }

  clearCache(): void {
    this.clear();
  }
}

export const svgLoader = new MascotSvgLoader();
