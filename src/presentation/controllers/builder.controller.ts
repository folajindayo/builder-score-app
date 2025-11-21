/**
 * Builder Controller
 */

import { LeaderboardService } from '../../application/services/leaderboard.service';
import { CalculateBuilderScoreUseCase } from '../../domain/use-cases/calculate-builder-score.use-case';
import { IBuilderProfileRepository } from '../../domain/repositories/builder-profile.repository';
import { BuilderProfileMapper } from '../../application/mappers/builder-profile.mapper';

export class BuilderController {
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly calculateScoreUseCase: CalculateBuilderScoreUseCase,
    private readonly profileRepository: IBuilderProfileRepository
  ) {}

  async getLeaderboard(req: { limit?: number }) {
    try {
      const profiles = await this.leaderboardService.getLeaderboard(req.limit || 100);

      return {
        success: true,
        data: BuilderProfileMapper.toDTOList(profiles),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getProfile(req: { identifier: string }) {
    try {
      const profile =
        (await this.profileRepository.findById(req.identifier)) ||
        (await this.profileRepository.findByWallet(req.identifier)) ||
        (await this.profileRepository.findByUsername(req.identifier));

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found',
        };
      }

      return {
        success: true,
        data: BuilderProfileMapper.toDTO(profile),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async calculateScore(req: { builderId: string; metrics: any }) {
    try {
      const score = await this.calculateScoreUseCase.execute({
        builderId: req.builderId,
        metrics: req.metrics,
      });

      return {
        success: true,
        data: { score },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getBuilderRank(req: { profileId: string }) {
    try {
      const rank = await this.leaderboardService.getBuilderRank(req.profileId);

      return {
        success: true,
        data: { rank },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

