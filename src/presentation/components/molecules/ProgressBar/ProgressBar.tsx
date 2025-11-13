/**
 * ProgressBar Molecule Component
 * Progress indicator with label and percentage
 */

import { HTMLAttributes, forwardRef } from 'react';
import { Text } from '@atoms/Text';
import { ComponentProps } from '@presentation/types';

export interface ProgressBarProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'primary' | 'success' | 'warning' | 'error';
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      label,
      showPercentage = false,
      size = 'md',
      colorScheme = 'primary',
      className = '',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min((value / max) * 100, 100);

    const sizeStyles = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    const colorStyles = {
      primary: 'bg-blue-600',
      success: 'bg-green-600',
      warning: 'bg-amber-600',
      error: 'bg-red-600',
    };

    return (
      <div ref={ref} className={className} {...props}>
        {(label || showPercentage) && (
          <div className="flex items-center justify-between mb-2">
            {label && <Text size="sm" color="muted">{label}</Text>}
            {showPercentage && (
              <Text size="sm" weight="medium">
                {Math.round(percentage)}%
              </Text>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeStyles[size]}`}
        >
          <div
            className={`h-full transition-all duration-300 ${colorStyles[colorScheme]}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

