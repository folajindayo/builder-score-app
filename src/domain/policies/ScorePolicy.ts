/**
 * Score Calculation Policies
 */

import { Score } from '../value-objects/Score';

export interface IScorePolicy {
  apply(baseScore: number): number;
}

export class BonusPolicy implements IScorePolicy {
  constructor(private bonusPercentage: number) {}

  apply(baseScore: number): number {
    return baseScore + baseScore * (this.bonusPercentage / 100);
  }
}

export class PenaltyPolicy implements IScorePolicy {
  constructor(private penaltyPercentage: number) {}

  apply(baseScore: number): number {
    return baseScore - baseScore * (this.penaltyPercentage / 100);
  }
}

export class MinimumScorePolicy implements IScorePolicy {
  constructor(private minimum: number) {}

  apply(baseScore: number): number {
    return Math.max(baseScore, this.minimum);
  }
}

export class ScorePolicyComposite {
  private policies: IScorePolicy[] = [];

  addPolicy(policy: IScorePolicy): this {
    this.policies.push(policy);
    return this;
  }

  applyAll(baseScore: number, maxScore: number = 100): Score {
    let result = baseScore;
    for (const policy of this.policies) {
      result = policy.apply(result);
    }
    return new Score(Math.min(result, maxScore), maxScore);
  }
}

