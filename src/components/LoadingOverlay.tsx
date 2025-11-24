'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  className?: string;
}

export function LoadingOverlay({ isLoading, text, className = '' }: LoadingOverlayProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <LoadingSpinner text={text} />
      </div>
    </div>
  );
}
