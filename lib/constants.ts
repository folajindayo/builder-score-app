/**
 * Application-wide constants
 */

export const DEFAULT_PAGE_SIZE = 30;
export const MAX_COMPARISON_BUILDERS = 3;
export const DEFAULT_REFRESH_INTERVAL = 60; // seconds

export const SPONSOR_SLUGS = [
  "walletconnect",
  "celo",
  "base",
  "base-summer",
  "syndicate",
  "talent-protocol",
] as const;

export const GRANT_IDS = {
  walletconnect: {
    thisWeek: 710,
    lastWeek: 704,
  },
  celo: {
    thisWeek: 716,
    lastWeek: 291,
  },
} as const;

