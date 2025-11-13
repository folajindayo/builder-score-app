/**
 * Achievement Service
 * 
 * Domain service for managing achievements.
 */

import {
  Achievement,
  AchievementTier,
  AchievementType,
} from '../entities/Achievement';
import { BuilderAggregate } from '../aggregates/BuilderAggregate';
import { IDomainService } from '../types';

export class AchievementService implements IDomainService {
  readonly name = 'AchievementService';

  /**
   * Check and award achievements
   */
  checkAchievements(aggregate: BuilderAggregate): Achievement[] {
    const newAchievements: Achievement[] = [];

    // Check transaction milestones
    const txCount = aggregate.getConfirmedTransactionCount();
    newAchievements.push(...this.checkTransactionMilestones(aggregate, txCount));

    // Check achievement milestones
    const achievementCount = aggregate.getAchievementCount();
    if (achievementCount === 1 && !aggregate.hasAchievement(AchievementType.FIRST_CONTRIBUTION)) {
      newAchievements.push(
        Achievement.create(
          aggregate.builder.address,
          AchievementType.FIRST_CONTRIBUTION,
          AchievementTier.BRONZE
        )
      );
    }

    return newAchievements;
  }

  /**
   * Check transaction milestones
   */
  private checkTransactionMilestones(
    aggregate: BuilderAggregate,
    count: number
  ): Achievement[] {
    const achievements: Achievement[] = [];

    if (count >= 10 && !aggregate.hasAchievement(AchievementType.MILESTONE_10)) {
      achievements.push(
        Achievement.create(
          aggregate.builder.address,
          AchievementType.MILESTONE_10,
          AchievementTier.BRONZE
        )
      );
    }

    if (count >= 50 && !aggregate.hasAchievement(AchievementType.MILESTONE_50)) {
      achievements.push(
        Achievement.create(
          aggregate.builder.address,
          AchievementType.MILESTONE_50,
          AchievementTier.SILVER
        )
      );
    }

    if (count >= 100 && !aggregate.hasAchievement(AchievementType.MILESTONE_100)) {
      achievements.push(
        Achievement.create(
          aggregate.builder.address,
          AchievementType.MILESTONE_100,
          AchievementTier.GOLD
        )
      );
    }

    return achievements;
  }

  /**
   * Calculate achievement score contribution
   */
  calculateAchievementScore(achievements: Achievement[]): number {
    return achievements.reduce((sum, achievement) => {
      const tierMultiplier = achievement.getTierValue();
      return sum + achievement.points * tierMultiplier;
    }, 0);
  }
}

