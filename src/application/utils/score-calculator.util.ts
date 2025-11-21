/**
 * Score Calculator Utility
 */

export class ScoreCalculator {
  static calculateWeightedScore(
    scores: { value: number; weight: number }[]
  ): number {
    const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);

    if (totalWeight === 0) return 0;

    const weightedSum = scores.reduce((sum, s) => sum + s.value * s.weight, 0);

    return Math.round(weightedSum / totalWeight);
  }

  static normalizeScore(value: number, min: number, max: number): number {
    if (max === min) return 0;
    return ((value - min) / (max - min)) * 100;
  }

  static getRank(score: number): string {
    if (score >= 90) return 'Elite';
    if (score >= 75) return 'Expert';
    if (score >= 60) return 'Proficient';
    if (score >= 40) return 'Intermediate';
    if (score >= 20) return 'Beginner';
    return 'Novice';
  }
}

