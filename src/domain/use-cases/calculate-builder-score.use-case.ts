/**
 * Calculate Builder Score Use Case
 */

import { IBuilderProfileRepository } from '../repositories/builder-profile.repository';
import { BuilderProfileEntity, BuilderScore } from '../entities/builder-profile.entity';

export interface CalculateScoreRequest {
  builderId: string;
  metrics: {
    githubContributions?: number;
    talentProtocolScore?: number;
    onchainActivity?: number;
    communityEngagement?: number;
    projectComplexity?: number;
  };
}

export class CalculateBuilderScoreUseCase {
  constructor(private readonly profileRepository: IBuilderProfileRepository) {}

  async execute(request: CalculateScoreRequest): Promise<BuilderScore> {
    const profile = await this.profileRepository.findById(request.builderId);
    
    if (!profile) {
      throw new Error('Builder profile not found');
    }

    const score = this.calculateScore(request.metrics);
    const updatedProfile = profile.updateScore(score);
    
    await this.profileRepository.update(request.builderId, updatedProfile);

    return score;
  }

  private calculateScore(metrics: any): BuilderScore {
    const weights = {
      reputation: 0.3,
      activity: 0.25,
      skills: 0.25,
      contributions: 0.2,
    };

    const reputation = this.calculateReputation(metrics);
    const activity = this.calculateActivity(metrics);
    const skills = this.calculateSkills(metrics);
    const contributions = this.calculateContributions(metrics);

    const overall =
      reputation * weights.reputation +
      activity * weights.activity +
      skills * weights.skills +
      contributions * weights.contributions;

    return {
      overall: Math.round(overall),
      reputation: Math.round(reputation),
      activity: Math.round(activity),
      skills: Math.round(skills),
      contributions: Math.round(contributions),
    };
  }

  private calculateReputation(metrics: any): number {
    const talentScore = metrics.talentProtocolScore || 0;
    return Math.min(100, talentScore);
  }

  private calculateActivity(metrics: any): number {
    const onchain = metrics.onchainActivity || 0;
    const community = metrics.communityEngagement || 0;
    return Math.min(100, (onchain + community) / 2);
  }

  private calculateSkills(metrics: any): number {
    const complexity = metrics.projectComplexity || 0;
    return Math.min(100, complexity);
  }

  private calculateContributions(metrics: any): number {
    const github = metrics.githubContributions || 0;
    return Math.min(100, Math.log(github + 1) * 20);
  }
}

