/**
 * Leaderboard Service
 * Application layer service for builder leaderboard
 */

import { IBuilderProfileRepository } from '../../domain/repositories/builder-profile.repository';

export class LeaderboardService {
  constructor(private readonly profileRepository: IBuilderProfileRepository) {}

  async getLeaderboard(limit: number = 100) {
    return await this.profileRepository.getLeaderboard(limit);
  }

  async getBuilderRank(profileId: string): Promise<number> {
    return await this.profileRepository.getRank(profileId);
  }

  async getTopBuilders(count: number = 10) {
    const leaderboard = await this.getLeaderboard(count);
    return leaderboard.filter((profile) => profile.isTopBuilder());
  }

  async getBuilderPercentile(profileId: string): Promise<number> {
    const rank = await this.getBuilderRank(profileId);
    const leaderboard = await this.getLeaderboard(10000); // Get large sample
    
    return ((leaderboard.length - rank + 1) / leaderboard.length) * 100;
  }
}

