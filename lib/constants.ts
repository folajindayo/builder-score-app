/**
 * Application-wide constants
 */

export const DEFAULT_PAGE_SIZE = 30;
export const MAX_COMPARISON_BUILDERS = 3;
export const DEFAULT_REFRESH_INTERVAL = 60; // seconds

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 second

// UI Configuration
export const DEBOUNCE_DELAY = 300; // milliseconds
export const TOAST_DURATION = 3000; // milliseconds
export const ANIMATION_DURATION = 200; // milliseconds

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

