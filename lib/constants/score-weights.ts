/**
 * Score Weight Constants
 */

export const SCORE_WEIGHTS = {
  GITHUB_ACTIVITY: 0.25,
  ON_CHAIN_ACTIVITY: 0.2,
  CREDENTIALS: 0.2,
  SOCIAL_REPUTATION: 0.15,
  CONTRIBUTIONS: 0.1,
  LONGEVITY: 0.1,
} as const;

export const SCORE_THRESHOLDS = {
  ELITE: 90,
  ADVANCED: 75,
  INTERMEDIATE: 50,
  BEGINNER: 25,
} as const;

export function getScoreLevel(score: number): string {
  if (score >= SCORE_THRESHOLDS.ELITE) return 'Elite Builder';
  if (score >= SCORE_THRESHOLDS.ADVANCED) return 'Advanced Builder';
  if (score >= SCORE_THRESHOLDS.INTERMEDIATE) return 'Intermediate Builder';
  if (score >= SCORE_THRESHOLDS.BEGINNER) return 'Beginner Builder';
  return 'New Builder';
}

