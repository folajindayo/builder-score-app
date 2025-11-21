/**
 * Score Weights Constants
 */

export const SCORE_WEIGHTS = {
  REPUTATION: 0.3,
  ACTIVITY: 0.25,
  SKILLS: 0.25,
  CONTRIBUTIONS: 0.2,
} as const;

export const SCORE_THRESHOLDS = {
  ELITE: 90,
  EXPERT: 75,
  PROFICIENT: 60,
  INTERMEDIATE: 40,
  BEGINNER: 20,
  NOVICE: 0,
};

export const RANK_LABELS: Record<string, string> = {
  elite: 'Elite',
  expert: 'Expert',
  proficient: 'Proficient',
  intermediate: 'Intermediate',
  beginner: 'Beginner',
  novice: 'Novice',
};

