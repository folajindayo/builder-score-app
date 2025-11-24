"use client";

import { ReactNode } from "react";

interface LoadingStateProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
  children?: ReactNode;
}

export function LoadingState({
  size = "md",
  text,
  fullScreen = false,
  children,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
      {children}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-4 animate-pulse rounded bg-gray-200 ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <SkeletonLine className="mb-3 w-3/4" />
      <SkeletonLine className="mb-2 w-full" />
      <SkeletonLine className="mb-2 w-full" />
      <SkeletonLine className="w-1/2" />
    </div>
  );
}

