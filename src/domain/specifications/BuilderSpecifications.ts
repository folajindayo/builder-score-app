/**
 * Builder Specifications
 * 
 * Business rule specifications for builders.
 */

import { Builder } from '../entities/Builder';
import { Specification } from './Specification';

export class ActiveBuilderSpecification extends Specification<Builder> {
  isSatisfiedBy(candidate: Builder): boolean {
    return candidate.isProfileComplete();
  }
}

export class VerifiedBuilderSpecification extends Specification<Builder> {
  isSatisfiedBy(candidate: Builder): boolean {
    return candidate.hasSocialLinks();
  }
}

export class ExperiencedBuilderSpecification extends Specification<Builder> {
  constructor(private readonly minDays: number = 30) {
    super();
  }

  isSatisfiedBy(candidate: Builder): boolean {
    const daysSinceCreation =
      (Date.now() - candidate.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation >= this.minDays;
  }
}

export class EligibleForLeaderboardSpecification extends Specification<Builder> {
  isSatisfiedBy(candidate: Builder): boolean {
    return (
      new ActiveBuilderSpecification().isSatisfiedBy(candidate) &&
      new VerifiedBuilderSpecification().isSatisfiedBy(candidate)
    );
  }
}

