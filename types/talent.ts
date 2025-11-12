// Talent Protocol API Types

/**
 * Builder score data structure
 */
export interface BuilderScore {
  /** The builder's score value */
  score: number;
  /** Rank position among all builders */
  rank?: number;
  /** Percentile position (0-100) */
  percentile?: number;
  /** Data points contributing to the score */
  dataPoints?: DataPoint[];
  /** Credentials earned by the builder */
  credentials?: Credential[];
  /** Skills associated with the builder */
  skills?: Skill[];
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * Data point contributing to builder score
 */
export interface DataPoint {
  /** Unique identifier */
  id: string;
  /** Source of the data point */
  source: string;
  /** Type of data point */
  type: string;
  /** Numeric value */
  value: number;
  /** Whether the data point is verified */
  verified: boolean;
  /** Creation timestamp */
  createdAt: string;
}

export interface Credential {
  id: string;
  name: string;
  issuer: string;
  description?: string;
  verified: boolean;
  issuedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  level?: number;
}

export interface BuilderProfile {
  address: string;
  ensName?: string;
  score: BuilderScore;
  profile?: {
    name?: string;
    bio?: string;
    avatar?: string;
    website?: string;
    twitter?: string;
    github?: string;
  };
}

export interface SearchFilters {
  address?: string;
  ensName?: string;
  minScore?: number;
  maxScore?: number;
  skills?: string[];
  credentials?: string[];
}

export interface SearchResult {
  address: string;
  ensName?: string;
  score: number;
  profile?: BuilderProfile['profile'];
  credentials?: Credential[];
  skills?: Skill[];
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// BuilderScore API Types (builderscore.xyz)
/**
 * User data from the leaderboard API
 */
export interface LeaderboardUser {
  id: number;
  distributed_at: string | null;
  hall_of_fame: boolean;
  leaderboard_position: number;
  profile: UserProfile;
  ranking_change: number;
  recipient_wallet: string | null;
  reward_amount: number | string; // API returns as string, but we'll parse it
  reward_transaction_hash: string | null;
  summary: string | null;
}

export interface UserProfile {
  bio: string | null;
  builder_score: Score;
  calculating_score: boolean;
  created_at: string;
  display_name: string;
  human_checkmark: boolean;
  id: string;
  image_url: string;
  location: string | null;
  name: string;
  scores: Score[];
  tags: string[];
  talent_protocol_id: number | null;
  verified_nationality: boolean;
}

export interface Score {
  last_calculated_at: string;
  points: number;
  rank_position: number | null;
  slug: string;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  pagination: Pagination;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
}

/**
 * Filters for leaderboard queries
 */
export interface LeaderboardFilters {
  per_page?: number;
  page?: number;
  sponsor_slug?: string;
  grant_id?: number;
  search?: string;
}

