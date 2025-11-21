/**
 * useCredentials Hook
 */

'use client';

import { useState, useEffect } from 'react';
import { Credential } from '../lib/types/credential.types';

export function useCredentials(address: string | undefined) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setCredentials([]);
      return;
    }

    setIsLoading(true);
    fetch(`/api/credentials?address=${address}`)
      .then((res) => res.json())
      .then((data) => setCredentials(data.credentials || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [address]);

  const verifiedCount = credentials.filter((c) => c.verifiedOnChain).length;
  const totalScore = credentials.reduce((sum, c) => sum + c.score, 0);

  return { credentials, isLoading, verifiedCount, totalScore };
}

