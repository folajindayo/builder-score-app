"use client";

import { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export function Label({
  children,
  htmlFor,
  required = false,
  className = "",
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
