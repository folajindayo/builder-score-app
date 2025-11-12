"use client";

import { IconButton } from "@/components/IconButton";

interface FirstButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function FirstButton({
  onClick,
  disabled = false,
  label = "First",
  className = "",
}: FirstButtonProps) {
  return (
    <IconButton
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      }
      label={label}
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={className}
    />
  );
}

