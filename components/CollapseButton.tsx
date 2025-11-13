'use client';

import { IconButton } from '@/components/IconButton';

interface CollapseButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function CollapseButton({
  onClick,
  label = 'Collapse',
  className = '',
}: CollapseButtonProps) {
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      }
      label={label}
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={className}
    />
  );
}
