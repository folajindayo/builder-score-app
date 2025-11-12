"use client";

import { ReactNode } from "react";

interface VisuallyHiddenProps {
  children: ReactNode;
  className?: string;
}

export function VisuallyHidden({
  children,
  className = "",
}: VisuallyHiddenProps) {
  return (
    <span
      className={`sr-only ${className}`}
      aria-hidden="false"
    >
      {children}
    </span>
  );
}

