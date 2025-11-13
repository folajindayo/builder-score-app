'use client';

interface LoadingBarProps {
  progress: number; // 0-100
  height?: string;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
}

export function LoadingBar({
  progress,
  height = '4px',
  color = 'bg-blue-600',
  backgroundColor = 'bg-gray-200',
  animated = true,
}: LoadingBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${backgroundColor} rounded-full overflow-hidden`} style={{ height }}>
      <div
        className={`${color} h-full ${animated ? 'transition-all duration-300 ease-out' : ''}`}
        style={{ width: `${clampedProgress}%` }}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
