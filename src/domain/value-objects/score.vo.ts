/**
 * Score Value Object
 * Represents a builder score with validation and ranking
 */

export class Score {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): Score {
    if (value < 0 || value > 100) {
      throw new Error('Score must be between 0 and 100');
    }
    return new Score(value);
  }

  static fromWeightedScores(scores: Array<{ score: number; weight: number }>): Score {
    const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
    
    if (totalWeight === 0) {
      return new Score(0);
    }

    const weightedSum = scores.reduce(
      (sum, s) => sum + s.score * s.weight,
      0
    );

    return new Score(weightedSum / totalWeight);
  }

  getValue(): number {
    return this.value;
  }

  getRank(): string {
    if (this.value >= 90) return 'Elite';
    if (this.value >= 75) return 'Expert';
    if (this.value >= 60) return 'Proficient';
    if (this.value >= 40) return 'Intermediate';
    if (this.value >= 20) return 'Beginner';
    return 'Novice';
  }

  isTopTier(): boolean {
    return this.value >= 80;
  }

  getPercentile(totalUsers: number, rank: number): number {
    return ((totalUsers - rank + 1) / totalUsers) * 100;
  }

  toString(): string {
    return `${this.value.toFixed(1)}`;
  }

  toJSON() {
    return {
      value: this.value,
      rank: this.getRank(),
      isTopTier: this.isTopTier(),
    };
  }
}

