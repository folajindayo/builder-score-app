import { useEffect, useCallback } from "react";
import { builderService } from "@/services/builderService";

interface PrefetchOptions {
  enabled?: boolean;
  delay?: number;
}

export function usePrefetchProfile(
  address: string | null,
  options: PrefetchOptions = {}
) {
  const { enabled = true, delay = 0 } = options;

  const prefetch = useCallback(() => {
    if (!address || !enabled) return;

    const timer = setTimeout(() => {
      // Prefetch profile data in the background
      builderService.getProfile(address).catch(() => {
        // Silently fail - this is just prefetching
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [address, enabled, delay]);

  useEffect(() => {
    return prefetch();
  }, [prefetch]);
}

export function usePrefetchLeaderboard(options: PrefetchOptions = {}) {
  const { enabled = true, delay = 0 } = options;

  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      // Prefetch first page of leaderboard
      builderService.getLeaderboard(1, 10).catch(() => {
        // Silently fail
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [enabled, delay]);
}

