/**
 * Percentile Utility
 */

export class PercentileUtil {
  static calculate(value: number, values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const rank = sorted.filter((v) => v <= value).length;
    return (rank / sorted.length) * 100;
  }

  static getRank(values: number[], targetValue: number): number {
    const sorted = [...values].sort((a, b) => b - a);
    return sorted.indexOf(targetValue) + 1;
  }

  static getTopPercentage(rank: number, total: number): number {
    return (rank / total) * 100;
  }

  static isTopTier(percentile: number, threshold: number = 20): boolean {
    return percentile >= 100 - threshold;
  }
}

