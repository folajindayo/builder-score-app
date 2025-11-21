/**
 * Scoring Configuration
 */

export interface ScoringConfig {
  weights: {
    reputation: number;
    activity: number;
    skills: number;
    contributions: number;
  };
  updateInterval: number;
  cacheTimeout: number;
}

export const scoringConfig: ScoringConfig = {
  weights: {
    reputation: 0.3,
    activity: 0.25,
    skills: 0.25,
    contributions: 0.2,
  },
  updateInterval: 3600000, // 1 hour
  cacheTimeout: 300000, // 5 minutes
};

