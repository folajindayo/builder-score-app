'use client';

import { motion } from 'framer-motion';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
  /** Custom label text */
  label?: string;
  /** Show percentage inside bar */
  showPercentageInside?: boolean;
  /** Striped pattern */
  striped?: boolean;
  /** Indeterminate loading state */
  indeterminate?: boolean;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
  xl: 'h-6',
};

const variantClasses = {
  default: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  error: 'bg-red-600',
  gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
};

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  animated = true,
  className = '',
  label,
  showPercentageInside = false,
  striped = false,
  indeterminate = false,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label || 'Progress'}</span>
          <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden relative ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        {indeterminate ? (
          <motion.div
            className={`${variantClasses[variant]} h-full rounded-full absolute`}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ width: '50%' }}
          />
        ) : animated ? (
          <motion.div
            className={`${variantClasses[variant]} h-full rounded-full relative ${
              striped ? 'progress-striped' : ''
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {showPercentageInside && size !== 'sm' && percentage > 10 && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                {Math.round(percentage)}%
              </span>
            )}
          </motion.div>
        ) : (
          <div
            className={`${variantClasses[variant]} h-full rounded-full relative ${
              striped ? 'progress-striped' : ''
            }`}
            style={{ width: `${percentage}%` }}
          >
            {showPercentageInside && size !== 'sm' && percentage > 10 && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
