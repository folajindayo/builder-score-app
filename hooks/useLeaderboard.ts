/**
 * useLeaderboard Hook
 */

import { useState, useEffect } from 'react';

export function useLeaderboard(limit: number = 100) {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/builders/leaderboard?limit=${limit}`);
        const data = await response.json();
        
        if (data.success) {
          setBuilders(data.data);
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [limit]);

  return { builders, loading, error };
}
