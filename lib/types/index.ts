/**
 * Type definitions
 */

export interface BuilderProfile {
  address: string;
  score: number;
  rank: number;
  commits: number;
  repos: number;
  languages: string[];
  joinedDate: string;
  lastActive: string;
  verified?: boolean;
}

export interface LeaderboardEntry extends BuilderProfile {
  change: number;
}

export interface Activity {
  id: string;
  type: "commit" | "pr" | "issue" | "review";
  repo: string;
  description: string;
  timestamp: string;
  url?: string;
}

export interface ScoreHistory {
  date: string;
  score: number;
  commits: number;
  rank: number;
}

export interface LeaderboardFilters {
  language?: string;
  minScore?: number;
  maxScore?: number;
  minCommits?: number;
  timeRange?: "week" | "month" | "year" | "all-time";
  verified?: boolean;
}

export interface CompareData {
  profiles: BuilderProfile[];
  metrics: {
    score: number[];
    commits: number[];
    repos: number[];
  };
}

export type ThemeMode = "light" | "dark" | "system";

export interface UserPreferences {
  theme: ThemeMode;
  notifications: boolean;
  language: string;
}

export interface SearchResult {
  address: string;
  name?: string;
  score: number;
  rank: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

