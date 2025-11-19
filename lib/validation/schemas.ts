/**
 * Zod validation schemas
 */

import { z } from "zod";

// Builder address schema
export const builderAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address");

// Score range schema
export const scoreRangeSchema = z.object({
  min: z.number().min(0).max(100).optional(),
  max: z.number().min(0).max(100).optional(),
});

// Leaderboard filters schema
export const leaderboardFiltersSchema = z.object({
  language: z.string().optional(),
  minScore: z.number().min(0).max(100).optional(),
  maxScore: z.number().min(0).max(100).optional(),
  minCommits: z.number().int().min(0).optional(),
  timeRange: z.enum(["week", "month", "year", "all-time"]).optional(),
  verified: z.boolean().optional(),
});

export type LeaderboardFilters = z.infer<typeof leaderboardFiltersSchema>;

// Profile query schema
export const profileQuerySchema = z.object({
  address: builderAddressSchema,
  includeActivity: z.boolean().default(false),
  includeHistory: z.boolean().default(false),
});

export type ProfileQuery = z.infer<typeof profileQuerySchema>;

// Activity filters schema
export const activityFiltersSchema = z.object({
  type: z.enum(["commit", "pr", "issue", "review"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  repo: z.string().optional(),
});

export type ActivityFilters = z.infer<typeof activityFiltersSchema>;

// Comparison schema
export const compareSchema = z.object({
  addresses: z
    .array(builderAddressSchema)
    .min(2, "Must compare at least 2 profiles")
    .max(4, "Can compare maximum 4 profiles"),
  metrics: z.array(z.enum(["score", "commits", "repos", "languages"])).optional(),
});

export type CompareInput = z.infer<typeof compareSchema>;

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  filters: leaderboardFiltersSchema.optional(),
  limit: z.number().int().positive().max(50).default(10),
});

export type SearchInput = z.infer<typeof searchSchema>;

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// Sort schema
export const sortSchema = z.object({
  sortBy: z.enum(["score", "commits", "repos", "rank"]).default("score"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type SortInput = z.infer<typeof sortSchema>;

// Query schema
export const querySchema = paginationSchema.merge(sortSchema).merge(leaderboardFiltersSchema);

export type QueryInput = z.infer<typeof querySchema>;

