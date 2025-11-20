/**
 * useBuilder Hook
 */

'use client';

import { useState, useEffect } from 'react';
import { Builder } from '../lib/types/builder.types';
import { BuilderService } from '../lib/services/builder.service';

export function useBuilder(address: string | null) {
  const [builder, setBuilder] = useState<Builder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchBuilder = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const service = new BuilderService(process.env.NEXT_PUBLIC_TALENT_API_KEY || '');
        const data = await service.getBuilderByAddress(address);
        setBuilder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilder();
  }, [address]);

  return { builder, loading, error };
}

