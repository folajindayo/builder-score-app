/**
 * Score Calculation Service
 * 
 * Domain service for calculating builder scores.
 */

import { IDomainService } from '../types';
import { Score } from '../value-objects/Score';

export interface ScoreFactors {
  transactionCount: number;
  achievementPoints: number;
  codeQuality: number;
  consistency: number;
  innovation: number;
}

export class ScoreCalculationService implements IDomainService {
  readonly name = 'ScoreCalculationService';

  private readonly weights = {
    transactionCount: 0.3,
    achievementPoints: 0.25,
    codeQuality: 0.2,
    consistency: 0.15,
    innovation: 0.1,
  };

  /**
   * Calculate score based on various factors
   */
  calculateScore(factors: ScoreFactors, maxScore: number = 100): Score {
    const transactionScore = this.normalizeTransactionCount(
      factors.transactionCount
    );
    const achievementScore = this.normalizeAchievementPoints(
      factors.achievementPoints
    );
    const qualityScore = this.normalizeQuality(factors.codeQuality);
    const consistencyScore = this.normalizeConsistency(factors.consistency);
    const innovationScore = this.normalizeInnovation(factors.innovation);

    const weightedScore =
      transactionScore * this.weights.transactionCount +
      achievementScore * this.weights.achievementPoints +
      qualityScore * this.weights.codeQuality +
      consistencyScore * this.weights.consistency +
      innovationScore * this.weights.innovation;

    const finalScore = Math.round(weightedScore * maxScore);
    return new Score(finalScore, maxScore);
  }

  /**
   * Calculate score improvement
   */
  calculateImprovement(
    oldScore: Score,
    newFactors: ScoreFactors
  ): { newScore: Score; improvement: number; percentageChange: number } {
    const newScore = this.calculateScore(newFactors, oldScore.maxValue);
    const improvement = newScore.numericValue - oldScore.numericValue;
    const percentageChange =
      (improvement / oldScore.numericValue) * 100;

    return { newScore, improvement, percentageChange };
  }

  /**
   * Normalize transaction count (0-100)
   */
  private normalizeTransactionCount(count: number): number {
    const max = 1000; // Consider 1000+ transactions as perfect
    return Math.min(count / max, 1);
  }

  /**
   * Normalize achievement points (0-100)
   */
  private normalizeAchievementPoints(points: number): number {
    const max = 10000; // Consider 10000+ points as perfect
    return Math.min(points / max, 1);
  }

  /**
   * Normalize code quality score (already 0-100)
   */
  private normalizeQuality(quality: number): number {
    return Math.min(Math.max(quality / 100, 0), 1);
  }

  /**
   * Normalize consistency score (already 0-100)
   */
  private normalizeConsistency(consistency: number): number {
    return Math.min(Math.max(consistency / 100, 0), 1);
  }

  /**
   * Normalize innovation score (already 0-100)
   */
  private normalizeInnovation(innovation: number): number {
    return Math.min(Math.max(innovation / 100, 0), 1);
  }

  /**
   * Get score breakdown
   */
  getScoreBreakdown(factors: ScoreFactors): Record<string, number> {
    return {
      transactionScore: Math.round(
        this.normalizeTransactionCount(factors.transactionCount) * 100
      ),
      achievementScore: Math.round(
        this.normalizeAchievementPoints(factors.achievementPoints) * 100
      ),
      qualityScore: Math.round(
        this.normalizeQuality(factors.codeQuality) * 100
      ),
      consistencyScore: Math.round(
        this.normalizeConsistency(factors.consistency) * 100
      ),
      innovationScore: Math.round(
        this.normalizeInnovation(factors.innovation) * 100
      ),
    };
  }
}

