"use client";

import React from "react";

interface DividerProps {
  label?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Divider Component
 * Visual separator with optional label
 */
export default function Divider({
  label,
  orientation = "horizontal",
  className = "",
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div className={`h-full w-px bg-gray-200 ${className}`} role="separator" />
    );
  }

  if (label) {
    return (
      <div className={`relative flex items-center ${className}`} role="separator">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-4 flex-shrink text-sm text-gray-500">{label}</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>
    );
  }

  return (
    <hr className={`border-t border-gray-200 ${className}`} role="separator" />
  );
}

