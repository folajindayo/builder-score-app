import { useState, useCallback } from "react";

export interface LeaderboardFilters {
  language?: string;
  minScore?: number;
  maxScore?: number;
  minCommits?: number;
  timeRange?: "week" | "month" | "year" | "all-time";
  verified?: boolean;
}

interface UseFiltersStateResult {
  filters: LeaderboardFilters;
  setFilter: <K extends keyof LeaderboardFilters>(
    key: K,
    value: LeaderboardFilters[K]
  ) => void;
  removeFilter: (key: keyof LeaderboardFilters) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
}

export function useFiltersState(
  initialFilters: LeaderboardFilters = {}
): UseFiltersStateResult {
  const [filters, setFilters] = useState<LeaderboardFilters>(initialFilters);

  const setFilter = useCallback(
    <K extends keyof LeaderboardFilters>(key: K, value: LeaderboardFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const removeFilter = useCallback((key: keyof LeaderboardFilters) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  const activeFiltersCount = Object.keys(filters).length;
  const hasActiveFilters = activeFiltersCount > 0;

  return {
    filters,
    setFilter,
    removeFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFiltersCount,
  };
}

