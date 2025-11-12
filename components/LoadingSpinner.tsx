"use client";

import { Spinner } from "@/components/Spinner";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  variant = "default",
  text,
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <Spinner size={size} variant={variant} />
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}
