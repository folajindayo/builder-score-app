/**
 * Builder Score Caching
 */

export class ScoreCache {
  private cache = new Map<string, { score: number; timestamp: number }>();
  private ttl = 300000; // 5 minutes

  set(builderId: string, score: number): void {
    this.cache.set(builderId, {
      score,
      timestamp: Date.now(),
    });
  }

  get(builderId: string): number | null {
    const entry = this.cache.get(builderId);

    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(builderId);
      return null;
    }

    return entry.score;
  }

  invalidate(builderId: string): void {
    this.cache.delete(builderId);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const scoreCache = new ScoreCache();

