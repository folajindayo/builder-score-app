/**
 * Application constants
 */

/**
 * Default pagination settings
 */
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

/**
 * Scroll thresholds
 */
export const SCROLL_TO_TOP_THRESHOLD = 300;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

/**
 * Debounce delays (in milliseconds)
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 250,
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  BUILDER_NOTES: 'builderNotes',
  BOOKMARKED_BUILDERS: 'bookmarkedBuilders',
  FILTER_PREFERENCES: 'filterPreferences',
  VIEW_PREFERENCES: 'viewPreferences',
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  DEFAULT_TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * UI configuration
 */
export const UI_CONFIG = {
  MAX_SEARCH_RESULTS: 100,
  ITEMS_PER_PAGE: [10, 20, 50, 100],
  TOOLTIP_DELAY: 300,
} as const;

/**
 * Color themes
 */
export const THEME_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#6b7280',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
} as const;
