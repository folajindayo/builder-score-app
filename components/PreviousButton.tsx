'use client';

import { IconButton } from '@/components/IconButton';

interface PreviousButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function PreviousButton({
  onClick,
  disabled = false,
  label = 'Previous',
  className = '',
}: PreviousButtonProps) {
  return (
    <IconButton
      icon={
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
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
