"use client";

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingDots({ size = "md", className = "" }: LoadingDotsProps) {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span
        className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}
        style={{ animationDelay: "0ms" }}
      />
      <span
        className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}
        style={{ animationDelay: "150ms" }}
      />
      <span
        className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}
        style={{ animationDelay: "300ms" }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

