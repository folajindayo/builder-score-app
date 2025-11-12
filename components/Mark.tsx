"use client";

import { ReactNode } from "react";

interface MarkProps {
  children: ReactNode;
  variant?: "default" | "highlight" | "warning" | "error";
  className?: string;
}

const variantClasses = {
  default: "bg-yellow-200 text-yellow-900",
  highlight: "bg-blue-200 text-blue-900",
  warning: "bg-orange-200 text-orange-900",
  error: "bg-red-200 text-red-900",
};

export function Mark({
  children,
  variant = "default",
  className = "",
}: MarkProps) {
  return (
    <mark
      className={`${variantClasses[variant]} px-1 rounded ${className}`}
    >
      {children}
    </mark>
  );
}

