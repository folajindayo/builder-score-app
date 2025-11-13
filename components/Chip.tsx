'use client';

import { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'filled';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  onDelete?: () => void;
  className?: string;
}

const variantClasses = {
  default: {
    primary: 'bg-blue-50 text-blue-700 border border-blue-200',
    secondary: 'bg-gray-50 text-gray-700 border border-gray-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
  },
  outlined: {
    primary: 'bg-transparent text-blue-700 border border-blue-300',
    secondary: 'bg-transparent text-gray-700 border border-gray-300',
    success: 'bg-transparent text-green-700 border border-green-300',
    warning: 'bg-transparent text-yellow-700 border border-yellow-300',
    error: 'bg-transparent text-red-700 border border-red-300',
  },
  filled: {
    primary: 'bg-blue-600 text-white border border-blue-600',
    secondary: 'bg-gray-600 text-white border border-gray-600',
    success: 'bg-green-600 text-white border border-green-600',
    warning: 'bg-yellow-600 text-white border border-yellow-600',
    error: 'bg-red-600 text-white border border-red-600',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function Chip({
  children,
  variant = 'default',
  color = 'primary',
  size = 'md',
  icon,
  onDelete,
  className = '',
}: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variantClasses[variant][color]} ${sizeClasses[size]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-1 hover:opacity-70 transition-opacity flex-shrink-0"
          aria-label="Delete chip"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
