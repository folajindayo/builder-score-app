/**
 * Application Constants
 * Centralized configuration values
 */

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Time Constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// UI Constants
export const UI = {
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  MAX_MOBILE_WIDTH: 768,
  MAX_TABLET_WIDTH: 1024,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  THEME: "builder_score_theme",
  USER_PREFERENCES: "builder_score_preferences",
  AUTH_TOKEN: "builder_score_token",
  RECENT_SEARCHES: "builder_score_recent_searches",
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  LEADERBOARD: "/leaderboard",
  PROFILE: "/profile",
  SEARCH: "/search",
  SETTINGS: "/settings",
} as const;

// Validation
export const VALIDATION = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MIN_BIO_LENGTH: 10,
  MAX_BIO_LENGTH: 500,
} as const;

// Feature Flags
export const FEATURES = {
  ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
  SENTRY_ENABLED: process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true",
  WALLET_CONNECT_ENABLED: true,
} as const;

// External Links
export const LINKS = {
  DOCUMENTATION: "https://docs.builderscore.com",
  SUPPORT: "https://support.builderscore.com",
  GITHUB: "https://github.com/builderscore",
  TWITTER: "https://twitter.com/builderscore",
  DISCORD: "https://discord.gg/builderscore",
} as const;

// API Endpoints
export const ENDPOINTS = {
  BUILDER_SCORE: "/api/builderscore",
  TALENT_PROFILE: "/api/talent",
  LEADERBOARD: "/api/leaderboard",
  SEARCH: "/api/search",
} as const;
