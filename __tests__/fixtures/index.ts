/**
 * Central export for all test fixtures
 */

// Builder profiles
export * from './builder-profiles';

// Search results
export * from './search-results';

// Leaderboard data
export * from './leaderboard';

// API errors
export * from './api-errors';

// Re-export commonly used fixtures
export {
  fixtureBuilderProfile,
  fixtureBuilderScore,
  fixtureSkills,
  fixtureCredentials,
} from './builder-profiles';

export {
  fixtureSearchResults,
  fixtureSearchResponsePage1,
  fixtureEmptySearchResponse,
} from './search-results';

export { fixtureLeaderboardPage1, fixtureHallOfFameUsers } from './leaderboard';

export { fixtureError404, fixtureError500, fixtureNetworkError } from './api-errors';
