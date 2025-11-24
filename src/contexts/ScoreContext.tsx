"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BuilderProfile } from "@/services/builderService";
import { cachedBuilderService } from "@/services/cachedBuilderService";

interface ScoreState {
  profile: BuilderProfile | null;
  loading: boolean;
  error: string | null;
}

interface ScoreContextType {
  state: ScoreState;
  loadProfile: (address: string) => Promise<void>;
  refreshScore: (address: string) => Promise<void>;
  clearProfile: () => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScoreState>({
    profile: null,
    loading: false,
    error: null,
  });

  const loadProfile = async (address: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const profile = await cachedBuilderService.getProfile(address);

      setState({
        profile,
        loading: false,
        error: profile ? null : "Profile not found",
      });
    } catch (error) {
      setState({
        profile: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load profile",
      });
    }
  };

  const refreshScore = async (address: string) => {
    try {
      // Clear cache to force fresh data
      cachedBuilderService.clearCache(address);

      await loadProfile(address);
    } catch (error) {
      console.error("Failed to refresh score:", error);
    }
  };

  const clearProfile = () => {
    setState({
      profile: null,
      loading: false,
      error: null,
    });
  };

  return (
    <ScoreContext.Provider value={{ state, loadProfile, refreshScore, clearProfile }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const context = useContext(ScoreContext);

  if (context === undefined) {
    throw new Error("useScore must be used within a ScoreProvider");
  }

  return context;
}

