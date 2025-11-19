"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { LeaderboardEntry } from "@/services/leaderboardService";

interface LeaderboardFilters {
  language?: string;
  minScore?: number;
  timeRange?: "week" | "month" | "all-time";
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  filters: LeaderboardFilters;
  sortBy: "score" | "commits" | "repos";
  sortOrder: "asc" | "desc";
  loading: boolean;
  error: string | null;
}

interface LeaderboardContextType {
  state: LeaderboardState;
  setEntries: (entries: LeaderboardEntry[]) => void;
  setFilters: (filters: LeaderboardFilters) => void;
  setSortBy: (sortBy: LeaderboardState["sortBy"]) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearFilters: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

const initialState: LeaderboardState = {
  entries: [],
  filters: {},
  sortBy: "score",
  sortOrder: "desc",
  loading: false,
  error: null,
};

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LeaderboardState>(initialState);

  const setEntries = (entries: LeaderboardEntry[]) => {
    setState((prev) => ({ ...prev, entries }));
  };

  const setFilters = (filters: LeaderboardFilters) => {
    setState((prev) => ({ ...prev, filters: { ...prev.filters, ...filters } }));
  };

  const setSortBy = (sortBy: LeaderboardState["sortBy"]) => {
    setState((prev) => ({ ...prev, sortBy }));
  };

  const setSortOrder = (sortOrder: "asc" | "desc") => {
    setState((prev) => ({ ...prev, sortOrder }));
  };

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const clearFilters = () => {
    setState((prev) => ({ ...prev, filters: {} }));
  };

  return (
    <LeaderboardContext.Provider
      value={{
        state,
        setEntries,
        setFilters,
        setSortBy,
        setSortOrder,
        setLoading,
        setError,
        clearFilters,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboardContext() {
  const context = useContext(LeaderboardContext);

  if (context === undefined) {
    throw new Error("useLeaderboardContext must be used within a LeaderboardProvider");
  }

  return context;
}

