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
  async loadSvg(url: string): Promise<string> {
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
  getCachedSvg(url: string): string | null {
    return this.cache.get(url) || null;
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
  setCache(url: string, content: string): void {
    this.cache.set(url, content);
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
