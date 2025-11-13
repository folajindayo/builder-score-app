/**
 * Feature flags for enabling/disabling features
 */

/**
 * Feature flag configuration
 */
export const FEATURE_FLAGS = {
  ENABLE_EXPORT: process.env.NEXT_PUBLIC_ENABLE_EXPORT === 'true',
  ENABLE_SHARE: process.env.NEXT_PUBLIC_ENABLE_SHARE === 'true',
  ENABLE_PRINT: process.env.NEXT_PUBLIC_ENABLE_PRINT === 'true',
  ENABLE_COMPARISON: process.env.NEXT_PUBLIC_ENABLE_COMPARISON === 'true',
  ENABLE_BOOKMARKS: process.env.NEXT_PUBLIC_ENABLE_BOOKMARKS !== 'false', // Default true
  ENABLE_NOTES: process.env.NEXT_PUBLIC_ENABLE_NOTES !== 'false', // Default true
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_DARK_MODE: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === 'true',
} as const;

/**
 * Checks if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

/**
 * Gets all enabled features
 */
export function getEnabledFeatures(): string[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([, enabled]) => enabled)
    .map(([feature]) => feature);
}
