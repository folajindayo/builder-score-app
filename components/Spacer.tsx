"use client";

interface SpacerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const sizeClasses = {
  xs: "h-1",
  sm: "h-2",
  md: "h-4",
  lg: "h-6",
  xl: "h-8",
  "2xl": "h-12",
};

export function Spacer({
  size = "md",
  className = "",
}: SpacerProps) {
  return (
    <div
      className={`${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    />
  );
}

