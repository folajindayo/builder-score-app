"use client";

import { IconButton } from "@/components/IconButton";

interface ExpandButtonProps {
  onClick: () => void;
  expanded?: boolean;
  label?: string;
  className?: string;
}

export function ExpandButton({
  onClick,
  expanded = false,
  label,
  className = "",
}: ExpandButtonProps) {
  return (
    <IconButton
      icon={
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      }
      label={label || (expanded ? "Collapse" : "Expand")}
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={className}
    />
  );
}

