/**
 * Achievement Criteria Evaluators
 */

import { BuilderAggregate } from '../aggregates/BuilderAggregate';

export interface IAchievementCriteria {
  evaluate(aggregate: BuilderAggregate): boolean;
}

export class TransactionCountCriteria implements IAchievementCriteria {
  constructor(private minCount: number) {}

  evaluate(aggregate: BuilderAggregate): boolean {
    return aggregate.getConfirmedTransactionCount() >= this.minCount;
  }
}

export class ScoreThresholdCriteria implements IAchievementCriteria {
  constructor(private minScore: number) {}

  evaluate(aggregate: BuilderAggregate): boolean {
    return aggregate.score.numericValue >= this.minScore;
  }
}

export class ProfileCompletenessCriteria implements IAchievementCriteria {
  evaluate(aggregate: BuilderAggregate): boolean {
    return aggregate.builder.isProfileComplete();
  }
}

export class SocialLinksCriteria implements IAchievementCriteria {
  evaluate(aggregate: BuilderAggregate): boolean {
    return aggregate.builder.hasSocialLinks();
  }
}

export class CompositeCriteria implements IAchievementCriteria {
  private criteria: IAchievementCriteria[] = [];

  addCriteria(criterion: IAchievementCriteria): this {
    this.criteria.push(criterion);
    return this;
  }

  evaluate(aggregate: BuilderAggregate): boolean {
    return this.criteria.every((c) => c.evaluate(aggregate));
  }
}

