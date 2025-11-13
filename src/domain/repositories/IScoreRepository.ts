/**
 * Score Repository Interface
 * 
 * Defines data access operations for Builder scores.
 */

import { Score } from '../value-objects/Score';

export interface ScoreHistory {
  address: string;
  score: Score;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ScoreRanking {
  address: string;
  score: Score;
  rank: number;
  percentile: number;
}

export interface IScoreRepository {
  /**
   * Get current score for a builder
   */
  getScore(address: string): Promise<Score | null>;

  /**
   * Save score for a builder
   */
  saveScore(address: string, score: Score): Promise<void>;

  /**
   * Get score history for a builder
   */
  getScoreHistory(
    address: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ScoreHistory[]>;

  /**
   * Get leaderboard rankings
   */
  getLeaderboard(limit: number, offset?: number): Promise<ScoreRanking[]>;

  /**
   * Get builder's rank
   */
  getRank(address: string): Promise<number | null>;

  /**
   * Get percentile for a builder
   */
  getPercentile(address: string): Promise<number | null>;

  /**
   * Get average score
   */
  getAverageScore(): Promise<number>;

  /**
   * Get score distribution
   */
  getScoreDistribution(): Promise<{ tier: string; count: number }[]>;
}

