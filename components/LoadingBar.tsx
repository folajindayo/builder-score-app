"use client";

interface LoadingBarProps {
  progress?: number;
  className?: string;
}

export function LoadingBar({ progress, className = "" }: LoadingBarProps) {
  return (
    <div
      className={`w-full h-1 bg-gray-200 rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={progress ? `Loading ${progress}%` : "Loading"}
    >
      {progress !== undefined ? (
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      ) : (
        <div className="h-full bg-blue-600 animate-pulse" style={{ width: "30%" }} />
      )}
    </div>
  );
}

