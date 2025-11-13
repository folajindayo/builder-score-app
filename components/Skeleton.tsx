'use client';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  className = '',
  rounded = false,
}: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${rounded ? 'rounded-full' : 'rounded'} relative overflow-hidden ${className}`}
      style={{ width, height }}
      aria-label="Loading"
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}
