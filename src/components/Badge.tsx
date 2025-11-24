'use client';

import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'pink';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
  interactive?: boolean;
  /** Add a dot indicator */
  dot?: boolean;
  /** Remove button */
  onRemove?: () => void;
  /** Badge icon */
  icon?: React.ReactNode;
  /** Outlined style */
  outlined?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  pulse = false,
  interactive = false,
  dot = false,
  onRemove,
  icon,
  outlined = false,
}: BadgeProps) {
  const variantClasses = outlined
    ? {
        default: 'bg-white text-gray-800 border-2 border-gray-300',
        success: 'bg-white text-green-800 border-2 border-green-300',
        warning: 'bg-white text-yellow-800 border-2 border-yellow-300',
        error: 'bg-white text-red-800 border-2 border-red-300',
        info: 'bg-white text-blue-800 border-2 border-blue-300',
        purple: 'bg-white text-purple-800 border-2 border-purple-300',
        pink: 'bg-white text-pink-800 border-2 border-pink-300',
      }
    : {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        purple: 'bg-purple-100 text-purple-800',
        pink: 'bg-pink-100 text-pink-800',
      };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-0.5',
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1',
    lg: 'px-3 py-1.5 text-sm gap-1.5',
  };

  const dotColor = {
    default: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  };

  const BadgeContent = (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${
        pulse ? 'animate-pulse' : ''
      } ${interactive ? 'hover:scale-105 transition-transform cursor-pointer' : ''} ${className}`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColor[variant]} ${pulse ? 'animate-pulse' : ''}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="inline-flex items-center justify-center ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current"
          aria-label="Remove badge"
          type="button"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );

  if (interactive) {
    return (
      <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        {BadgeContent}
      </motion.span>
    );
  }

  return BadgeContent;
}
