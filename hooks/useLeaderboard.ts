/**
 * useLeaderboard Hook
 */

'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  address: string;
  score: number;
  rank: number;
}

export function useLeaderboard(limit: number = 100) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    fetch(`/api/leaderboard?limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [limit]);

  return { entries, isLoading };
}
