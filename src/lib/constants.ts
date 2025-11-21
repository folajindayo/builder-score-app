/**
 * Application-wide Constants
 */

export const APP_NAME = 'Builder Score';
export const APP_DESCRIPTION = 'Track your builder reputation on-chain';
export const APP_URL = 'https://builderscore.app';

export const SCORE_WEIGHTS = {
  GITHUB: 0.3,
  TALENT_PROTOCOL: 0.25,
  ENS: 0.15,
  LENS: 0.15,
  FARCASTER: 0.1,
  CUSTOM: 0.05,
};

export const LEADERBOARD_SIZE = 100;
export const SCORE_UPDATE_INTERVAL = 3600000; // 1 hour

