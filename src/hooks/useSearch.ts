/**
 * useSearch Hook
 */

'use client';

import { useState } from 'react';
import { Builder } from '../lib/types/builder.types';
import { BuilderService } from '../lib/services/builder.service';

export function useSearch() {
  const [results, setResults] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const service = new BuilderService(process.env.NEXT_PUBLIC_TALENT_API_KEY || '');
      const data = await service.searchBuilders(query);
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}

