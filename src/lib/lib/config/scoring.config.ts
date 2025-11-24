/**
 * Scoring Configuration
 */

export const SCORING_CONFIG = {
  WEIGHTS: {
    GITHUB_COMMITS: 0.20,
    GITHUB_PRS: 0.15,
    ON_CHAIN_TX: 0.15,
    CREDENTIALS: 0.20,
    SOCIAL: 0.15,
    LONGEVITY: 0.15,
  },
  THRESHOLDS: {
    ELITE: 90,
    ADVANCED: 75,
    INTERMEDIATE: 50,
    BEGINNER: 25,
  },
  MAX_SCORES: {
    GITHUB: 35,
    ON_CHAIN: 15,
    CREDENTIALS: 20,
    SOCIAL: 15,
    LONGEVITY: 15,
  },
} as const;

export const CREDENTIAL_POINTS = {
  GITCOIN_PASSPORT: 25,
  TALENT_PASSPORT: 20,
  GITHUB_VERIFIED: 10,
  TWITTER_VERIFIED: 5,
} as const;

