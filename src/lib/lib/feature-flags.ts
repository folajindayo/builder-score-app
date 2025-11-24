/**
 * Feature flag system for gradual rollouts
 */

interface FeatureFlags {
  // UI Features
  darkMode: boolean;
  newSearchUI: boolean;
  enhancedProfiles: boolean;
  
  // Functionality
  socialSharing: boolean;
  notifications: boolean;
  achievements: boolean;
  
  // Experiments
  experimentalSearch: boolean;
  betaFeatures: boolean;
  
  // Performance
  virtualizedLists: boolean;
  imageOptimization: boolean;
}

// Default feature flags
const DEFAULT_FLAGS: FeatureFlags = {
  // UI Features
  darkMode: true,
  newSearchUI: false,
  enhancedProfiles: false,
  
  // Functionality
  socialSharing: true,
  notifications: false,
  achievements: false,
  
  // Experiments
  experimentalSearch: false,
  betaFeatures: false,
  
  // Performance
  virtualizedLists: true,
  imageOptimization: true,
};

// Feature flags from environment or remote config
const FEATURE_FLAGS: FeatureFlags = {
  ...DEFAULT_FLAGS,
  // Override with environment variables
  darkMode: process.env.NEXT_PUBLIC_FEATURE_DARK_MODE === 'true' ?? DEFAULT_FLAGS.darkMode,
  newSearchUI: process.env.NEXT_PUBLIC_FEATURE_NEW_SEARCH === 'true' ?? DEFAULT_FLAGS.newSearchUI,
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return FEATURE_FLAGS[feature];
}

/**
 * Get all feature flags
 */
export function getAllFeatureFlags(): FeatureFlags {
  return { ...FEATURE_FLAGS };
}

/**
 * Check if user is in beta group
 */
export function isUserInBeta(userId?: string): boolean {
  if (!userId) return false;
  
  // Simple hash-based assignment (replace with proper service)
  const hash = Array.from(userId).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  
  return hash % 10 < 3; // 30% of users
}

/**
 * Feature flag hook for React components
 */
export function useFeatureFlag(feature: keyof FeatureFlags): boolean {
  return isFeatureEnabled(feature);
}

/**
 * Conditional rendering based on feature flag
 */
export function withFeatureFlag<T>(
  feature: keyof FeatureFlags,
  component: T,
  fallback?: T
): T | null {
  return isFeatureEnabled(feature) ? component : (fallback ?? null);
}
