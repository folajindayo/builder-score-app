import { useState, useCallback, useMemo } from "react";

type SortOrder = "asc" | "desc";

interface UseSortOptions<T> {
  initialSortBy?: keyof T;
  initialSortOrder?: SortOrder;
}

interface UseSortResult<T> {
  sortBy: keyof T | null;
  sortOrder: SortOrder;
  sortedData: T[];
  setSortBy: (key: keyof T) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSort: (key: keyof T) => void;
  resetSort: () => void;
}

export function useSort<T>(
  data: T[],
  options: UseSortOptions<T> = {}
): UseSortResult<T> {
  const { initialSortBy = null, initialSortOrder = "asc" } = options;

  const [sortBy, setSortByState] = useState<keyof T | null>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

  const sortedData = useMemo(() => {
    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === bValue) return 0;

      let comparison = 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [data, sortBy, sortOrder]);

  const setSortBy = useCallback((key: keyof T) => {
    setSortByState(key);
  }, []);

  const toggleSort = useCallback((key: keyof T) => {
    setSortByState((prev) => {
      if (prev === key) {
        // Same key, toggle order
        setSortOrder((order) => (order === "asc" ? "desc" : "asc"));
        return key;
      } else {
        // Different key, reset to asc
        setSortOrder("asc");
        return key;
      }
    });
  }, []);

  const resetSort = useCallback(() => {
    setSortByState(initialSortBy);
    setSortOrder(initialSortOrder);
  }, [initialSortBy, initialSortOrder]);

  return {
    sortBy,
    sortOrder,
    sortedData,
    setSortBy,
    setSortOrder,
    toggleSort,
    resetSort,
  };
}

