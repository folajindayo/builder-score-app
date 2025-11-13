'use client';

import { IconButton } from '@/components/IconButton';

interface CloseButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CloseButton({
  onClick,
  label = 'Close',
  className = '',
  size = 'sm',
}: CloseButtonProps) {
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      }
      label={label}
      variant="ghost"
      size={size}
      onClick={onClick}
      className={className}
    />
  );
}
