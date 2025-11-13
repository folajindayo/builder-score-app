/**
 * Domain Constants and Enums
 */

export const DOMAIN_CONSTANTS = {
  SCORE: {
    MIN: 0,
    MAX: 100,
    DEFAULT: 0,
  },
  BUILDER: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    MAX_BIO_LENGTH: 500,
  },
  ACHIEVEMENT: {
    POINTS: {
      BRONZE_MULTIPLIER: 1,
      SILVER_MULTIPLIER: 1.5,
      GOLD_MULTIPLIER: 2,
      PLATINUM_MULTIPLIER: 3,
      DIAMOND_MULTIPLIER: 5,
    },
  },
  LEADERBOARD: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
} as const;

export const SCORE_TIERS = {
  S: { min: 95, name: 'S-Tier', color: '#FFD700' },
  A: { min: 85, name: 'A-Tier', color: '#C0C0C0' },
  B: { min: 70, name: 'B-Tier', color: '#CD7F32' },
  C: { min: 55, name: 'C-Tier', color: '#87CEEB' },
  D: { min: 40, name: 'D-Tier', color: '#90EE90' },
  F: { min: 0, name: 'F-Tier', color: '#FF6B6B' },
} as const;

