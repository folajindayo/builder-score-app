"use client";

import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string;
  className?: string;
}

/**
 * Spinner Component
 * Loading spinner with customizable size and color
 */
export default function Spinner({
  size = "md",
  color = "blue-600",
  text,
  className = "",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`animate-spin rounded-full border-gray-300 border-t-${color} ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}

