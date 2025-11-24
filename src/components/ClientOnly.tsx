'use client';

import { NoSSR } from '@/components/NoSSR';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback }: ClientOnlyProps) {
  return <NoSSR fallback={fallback}>{children}</NoSSR>;
}
