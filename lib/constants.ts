/**
 * Application constants
 */

export const APP_NAME = "Builder Score";
export const APP_VERSION = "1.0.0";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
export const API_TIMEOUT = 30000;
export const API_RETRY_ATTEMPTS = 3;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const SCORE_RANGES = {
  BEGINNER: { min: 0, max: 25, label: "Beginner", color: "#94a3b8" },
  INTERMEDIATE: { min: 26, max: 50, label: "Intermediate", color: "#60a5fa" },
  ADVANCED: { min: 51, max: 75, label: "Advanced", color: "#34d399" },
  EXPERT: { min: 76, max: 100, label: "Expert", color: "#fbbf24" },
} as const;

export const TIME_RANGES = {
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
  ALL_TIME: "all-time",
} as const;

export const SORT_OPTIONS = {
  SCORE: "score",
  COMMITS: "commits",
  REPOS: "repos",
  RANK: "rank",
} as const;

export const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Solidity",
  "Java",
  "C++",
  "Ruby",
  "Swift",
] as const;

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export const CACHE_KEYS = {
  PROFILE: "profile",
  LEADERBOARD: "leaderboard",
  ACTIVITY: "activity",
  SCORE_HISTORY: "score_history",
} as const;

export const ROUTES = {
  HOME: "/",
  LEADERBOARD: "/leaderboard",
  PROFILE: "/profile",
  COMPARE: "/compare",
  SEARCH: "/search",
} as const;
