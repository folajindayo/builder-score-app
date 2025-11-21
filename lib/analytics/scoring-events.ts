/**
 * Scoring Analytics Events
 */

export const SCORING_EVENTS = {
  PROFILE_VIEWED: 'profile_viewed',
  SCORE_CALCULATED: 'score_calculated',
  CREDENTIAL_VERIFIED: 'credential_verified',
  LEADERBOARD_VIEWED: 'leaderboard_viewed',
} as const;

export function trackScoringEvent(
  event: string,
  data?: Record<string, any>
) {
  if (typeof window === 'undefined') return;
  
  console.log('Scoring Event:', event, data);
  
  // Analytics integration
}

