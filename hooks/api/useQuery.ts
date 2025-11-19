/**
 * useQuery Hook
 * Custom hook for data fetching with caching
 */

import { useState, useEffect } from "react";

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface QueryOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
  cacheTime?: number;
}

const queryCache = new Map<string, {
  data: any;
  timestamp: number;
}>();

export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: QueryOptions = {}
): QueryState<T> & { refetch: () => Promise<void> } {
  const {
    enabled = true,
    refetchOnMount = false,
    cacheTime = 300000, // 5 minutes
  } = options;

  const [state, setState] = useState<QueryState<T>>({
    data: null,
    loading: enabled,
    error: null,
  });

  const fetchData = async () => {
    // Check cache
    const cached = queryCache.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setState({ data: cached.data, loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await fetcher();
      queryCache.set(key, { data, timestamp: Date.now() });
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [key, enabled]);

  return {
    ...state,
    refetch: fetchData,
  };
}

