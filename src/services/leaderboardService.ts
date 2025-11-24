import { BuilderProfile } from "./builderService";

export interface LeaderboardEntry extends BuilderProfile {
  change?: number; // Rank change from last period
  trend?: "up" | "down" | "stable";
}

export interface LeaderboardFilters {
  language?: string;
  minScore?: number;
  timeRange?: "week" | "month" | "all-time";
}

export class LeaderboardService {
  async getLeaderboard(
    page: number = 1,
    limit: number = 10,
    sortBy: string = "score",
    order: "asc" | "desc" = "desc",
    filters?: LeaderboardFilters
  ): Promise<{
    data: LeaderboardEntry[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    // Mock implementation
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      score: Math.floor(Math.random() * 100),
      rank: i + 1,
      commits: Math.floor(Math.random() * 1000),
      repos: Math.floor(Math.random() * 100),
      languages: ["TypeScript", "Solidity", "Rust"].slice(0, Math.floor(Math.random() * 3) + 1),
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date().toISOString(),
      change: Math.floor(Math.random() * 10) - 5,
      trend: (["up", "down", "stable"][Math.floor(Math.random() * 3)] as any),
    }));

    // Apply filters
    let filteredData = mockData;

    if (filters?.language) {
      filteredData = filteredData.filter((entry) =>
        entry.languages.includes(filters.language!)
      );
    }

    if (filters?.minScore !== undefined) {
      filteredData = filteredData.filter((entry) => entry.score >= filters.minScore!);
    }

    // Sort
    filteredData.sort((a, b) => {
      const multiplier = order === "desc" ? -1 : 1;
      if (sortBy === "score") {
        return (b.score - a.score) * multiplier;
      }
      if (sortBy === "commits") {
        return (b.commits - a.commits) * multiplier;
      }
      return 0;
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
      },
    };
  }

  async getTopBuilders(limit: number = 5): Promise<LeaderboardEntry[]> {
    const result = await this.getLeaderboard(1, limit, "score", "desc");
    return result.data;
  }
}

export const leaderboardService = new LeaderboardService();

