/**
 * Leaderboard Service
 * 
 * Domain service for leaderboard ranking and calculations.
 */

import { IDomainService } from '../types';
import { BuilderAggregate } from '../aggregates/BuilderAggregate';

export interface RankedBuilder {
  address: string;
  score: number;
  rank: number;
  percentile: number;
}

export class LeaderboardService implements IDomainService {
  readonly name = 'LeaderboardService';

  /**
   * Calculate rankings for builders
   */
  calculateRankings(builders: BuilderAggregate[]): RankedBuilder[] {
    const sorted = [...builders].sort(
      (a, b) => b.score.numericValue - a.score.numericValue
    );

    const total = sorted.length;

    return sorted.map((builder, index) => ({
      address: builder.builder.address,
      score: builder.score.numericValue,
      rank: index + 1,
      percentile: this.calculatePercentile(index, total),
    }));
  }

  /**
   * Get top builders
   */
  getTopBuilders(builders: BuilderAggregate[], limit: number): RankedBuilder[] {
    const rankings = this.calculateRankings(builders);
    return rankings.slice(0, limit);
  }

  /**
   * Get builder rank
   */
  getBuilderRank(
    targetAddress: string,
    builders: BuilderAggregate[]
  ): RankedBuilder | null {
    const rankings = this.calculateRankings(builders);
    return rankings.find((r) => r.address === targetAddress) || null;
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(index: number, total: number): number {
    if (total <= 1) return 100;
    return Math.round(((total - index) / total) * 100);
  }

  /**
   * Get tier distribution
   */
  getTierDistribution(builders: BuilderAggregate[]): Record<string, number> {
    const distribution: Record<string, number> = {
      S: 0,
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,
    };

    builders.forEach((builder) => {
      const tier = builder.score.tier;
      distribution[tier]++;
    });

    return distribution;
  }
}

