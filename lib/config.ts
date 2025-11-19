/**
 * Application configuration
 */

import { PAGINATION, SCORE_RANGES, TIME_RANGES, CACHE_KEYS, ROUTES } from "./constants";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export const config = {
  app: {
    name: "Builder Score",
    version: "1.0.0",
    environment: isDevelopment ? "development" : "production",
  },

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 30000,
    retryAttempts: 3,
  },

  pagination: PAGINATION,
  scoreRanges: SCORE_RANGES,
  timeRanges: TIME_RANGES,
  cacheKeys: CACHE_KEYS,
  routes: ROUTES,

  features: {
    enableAnalytics: isProduction,
    enableServiceWorker: isProduction,
    enablePrefetch: true,
  },

  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
  },
} as const;

export type Config = typeof config;

