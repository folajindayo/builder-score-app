/**
 * useBuilderProfile Hook
 */

import { useState, useEffect } from 'react';

export function useBuilderProfile(builderId: string) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/builders/${builderId}`);
        const data = await response.json();
        
        if (data.success) {
          setProfile(data.data);
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (builderId) {
      fetchProfile();
    }
  }, [builderId]);

  return { profile, loading, error };
}

