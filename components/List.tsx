"use client";

import { ReactNode } from "react";

interface ListProps {
  children: ReactNode;
  variant?: "ordered" | "unordered" | "none";
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

const spacingClasses = {
  sm: "space-y-1",
  md: "space-y-2",
  lg: "space-y-4",
};

export function List({
  children,
  variant = "unordered",
  spacing = "md",
  className = "",
}: ListProps) {
  const baseClasses = `${spacingClasses[spacing]} ${className}`;

  if (variant === "ordered") {
    return (
      <ol className={`list-decimal list-inside ${baseClasses}`}>
        {children}
      </ol>
    );
  }

  if (variant === "none") {
    return (
      <ul className={`list-none ${baseClasses}`}>
        {children}
      </ul>
    );
  }

  return (
    <ul className={`list-disc list-inside ${baseClasses}`}>
      {children}
    </ul>
  );
}

