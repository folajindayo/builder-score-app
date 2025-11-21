/**
 * Ranking Helper
 */

export interface RankableItem {
  id: string;
  score: number;
}

export interface RankedItem<T> extends RankableItem {
  rank: number;
  percentile: number;
  data: T;
}

export class RankingHelper {
  static rank<T extends RankableItem>(items: T[]): RankedItem<T>[] {
    const sorted = [...items].sort((a, b) => b.score - a.score);
    const total = sorted.length;

    return sorted.map((item, index) => ({
      ...item,
      data: item as any,
      rank: index + 1,
      percentile: ((total - index) / total) * 100,
    }));
  }

  static getRankForScore(score: number, allScores: number[]): number {
    const sorted = [...allScores].sort((a, b) => b - a);
    return sorted.findIndex((s) => s === score) + 1;
  }

  static getPercentile(rank: number, total: number): number {
    return ((total - rank + 1) / total) * 100;
  }

  static isTopTier(percentile: number, threshold = 20): boolean {
    return percentile >= 100 - threshold;
  }
}

