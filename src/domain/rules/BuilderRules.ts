/**
 * Builder Business Rules
 */

import { Builder } from '../entities/Builder';
import { ValidationError } from '../errors/DomainErrors';

export class BuilderRules {
  static enforceProfileCompleteness(builder: Builder): void {
    if (!builder.name || builder.name.trim().length < 2) {
      throw new ValidationError('Builder must have a valid name', [
        'Name is required and must be at least 2 characters',
      ]);
    }

    if (!builder.bio || builder.bio.trim().length === 0) {
      throw new ValidationError('Builder must have a bio', [
        'Bio is required for profile completion',
      ]);
    }
  }

  static enforceVerification(builder: Builder): void {
    if (!builder.hasSocialLinks()) {
      throw new ValidationError('Builder must have at least one social link', [
        'At least one social profile (GitHub, Twitter, or website) is required',
      ]);
    }
  }

  static canUpdateScore(builder: Builder): boolean {
    return builder.isProfileComplete();
  }

  static canEarnAchievements(builder: Builder): boolean {
    return builder.isProfileComplete() && builder.hasSocialLinks();
  }
}

