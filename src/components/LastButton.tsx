'use client';

import { IconButton } from '@/components/IconButton';

interface LastButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function LastButton({
  onClick,
  disabled = false,
  label = 'Last',
  className = '',
}: LastButtonProps) {
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
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
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
