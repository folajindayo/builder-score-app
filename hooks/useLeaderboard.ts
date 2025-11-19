import { useState, useEffect } from "react";
import { LeaderboardEntry, leaderboardService } from "@/services/leaderboardService";

interface LeaderboardFilters {
  language?: string;
  minScore?: number;
  timeRange?: "week" | "month" | "all-time";
}

interface UseLeaderboardResult {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  setPage: (page: number) => void;
  setFilters: (filters: LeaderboardFilters) => void;
  refetch: () => Promise<void>;
}

export function useLeaderboard(
  initialPage: number = 1,
  initialLimit: number = 10
): UseLeaderboardResult {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [filters, setFilters] = useState<LeaderboardFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await leaderboardService.getLeaderboard(
        page,
        limit,
        "score",
        "desc",
        filters
      );

      setEntries(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [page, limit, filters]);

  return {
    entries,
    loading,
    error,
    pagination,
    setPage,
    setFilters,
    refetch: fetchLeaderboard,
  };
}

