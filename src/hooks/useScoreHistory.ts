import { useState, useEffect } from "react";
import { builderService } from "@/services/builderService";

export interface ScoreHistoryPoint {
  date: string;
  score: number;
  commits: number;
  rank: number;
}

interface UseScoreHistoryResult {
  history: ScoreHistoryPoint[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  timeRange: "week" | "month" | "year";
  setTimeRange: (range: "week" | "month" | "year") => void;
}

export function useScoreHistory(address: string): UseScoreHistoryResult {
  const [history, setHistory] = useState<ScoreHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  const fetchHistory = async () => {
    if (!address) {
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await builderService.getScoreHistory(address, timeRange);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [address, timeRange]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
    timeRange,
    setTimeRange,
  };
}

