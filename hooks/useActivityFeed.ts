import { useState, useEffect } from "react";
import { Activity, builderService } from "@/services/builderService";

interface UseActivityFeedResult {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useActivityFeed(
  address: string,
  initialLimit: number = 20
): UseActivityFeedResult {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchActivities = async (reset: boolean = false) => {
    if (!address) {
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentPage = reset ? 1 : page;
      const result = await builderService.getActivity(address, currentPage, initialLimit);

      if (reset) {
        setActivities(result.data);
        setPage(1);
      } else {
        setActivities((prev) => [...prev, ...result.data]);
      }

      setHasMore(result.pagination.page < result.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;

    setPage((prev) => prev + 1);
    await fetchActivities(false);
  };

  const refetch = async () => {
    await fetchActivities(true);
  };

  useEffect(() => {
    fetchActivities(true);
  }, [address]);

  return {
    activities,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
  };
}

