'use client';

import { ReactNode } from 'react';

interface QuickActionProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function QuickAction({
  icon,
  label,
  onClick,
  disabled = false,
  className = '',
}: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-gray-50 transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      aria-label={label}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <span className="text-sm font-medium text-center">{label}</span>
    </button>
  );
}
