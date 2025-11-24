'use client';

import { Suspense, ReactNode } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingText?: string;
}

export function SuspenseBoundary({ children, fallback, loadingText }: SuspenseBoundaryProps) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner text={loadingText || 'Loading...'} />}>
      {children}
    </Suspense>
  );
}
