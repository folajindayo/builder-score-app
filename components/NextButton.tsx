"use client";

import { IconButton } from "@/components/IconButton";

interface NextButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function NextButton({
  onClick,
  disabled = false,
  label = "Next",
  className = "",
}: NextButtonProps) {
  return (
    <IconButton
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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

