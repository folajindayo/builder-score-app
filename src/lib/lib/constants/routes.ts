/**
 * Route Constants
 */

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  BUILDER: (address: string) => `/builder/${address}`,
  LEADERBOARD: '/leaderboard',
};

export const API_ROUTES = {
  BUILDER: '/api/builder',
  SEARCH: '/api/search',
};

