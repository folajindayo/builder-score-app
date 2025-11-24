"use client";

import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

/**
 * Loading Component
 * Loading indicator with optional text
 */
export default function Loading({
  size = "md",
  text,
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4",
  };

  const spinner = (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-gray-300 border-t-blue-600`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {spinner}
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * Skeleton loading patterns
 */
export function SkeletonLine({ width = "w-full" }: { width?: string }) {
  return (
    <div
      className={`h-4 animate-pulse rounded bg-gray-200 ${width}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <SkeletonLine width="w-1/4" />
      <div className="mt-4 space-y-3">
        <SkeletonLine />
        <SkeletonLine width="w-5/6" />
        <SkeletonLine width="w-4/6" />
      </div>
    </div>
  );
}

