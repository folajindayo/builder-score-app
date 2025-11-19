/**
 * API type definitions
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ResponseMeta {
  pagination?: PaginationMeta;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: ResponseMeta & {
    pagination: PaginationMeta;
  };
}

// Builder API types
export interface BuilderProfile {
  address: string;
  username?: string;
  avatar?: string;
  bio?: string;
  score: number;
  rank: number;
  stats: BuilderStats;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BuilderStats {
  totalCommits: number;
  totalRepos: number;
  totalPRs: number;
  totalIssues: number;
  languages: LanguageStat[];
  streak: number;
}

export interface LanguageStat {
  language: string;
  percentage: number;
  commits: number;
}

export interface LeaderboardEntry {
  address: string;
  username?: string;
  avatar?: string;
  score: number;
  rank: number;
  change: number;
  verified: boolean;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  repo?: string;
  timestamp: string;
  url?: string;
}

export type ActivityType = "commit" | "pr" | "issue" | "review";

export interface ComparisonResult {
  profiles: BuilderProfile[];
  metrics: ComparisonMetric[];
}

export interface ComparisonMetric {
  name: string;
  values: number[];
  winner: number;
}

export interface SearchResult {
  builders: BuilderProfile[];
  total: number;
}

// Request types
export interface LeaderboardRequest {
  page?: number;
  limit?: number;
  sortBy?: "score" | "commits" | "repos" | "rank";
  sortOrder?: "asc" | "desc";
  language?: string;
  minScore?: number;
  maxScore?: number;
  verified?: boolean;
}

export interface ActivityRequest {
  address: string;
  type?: ActivityType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

