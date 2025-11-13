/**
 * StatCard Molecule Component
 * Displays a statistic with label, value, and optional trend
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { Badge } from '@atoms/Badge';
import { ComponentProps } from '@presentation/types';

export interface StatCardProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  helpText?: string;
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      label,
      value,
      trend,
      icon,
      helpText,
      className = '',
      ...props
    },
    ref
  ) => {
    const TrendIcon = trend ? (
      trend.isPositive ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )
    ) : null;

    return (
      <div
        ref={ref}
        className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Text size="sm" color="muted" className="uppercase tracking-wide">
              {label}
            </Text>
            <Heading as="h3" size="3xl" className="mt-2">
              {value}
            </Heading>
            {helpText && (
              <Text size="sm" color="muted" className="mt-1">
                {helpText}
              </Text>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <Badge
                  variant="subtle"
                  colorScheme={trend.isPositive ? 'success' : 'error'}
                  size="sm"
                >
                  <span className="flex items-center gap-0.5">
                    {TrendIcon}
                    {Math.abs(trend.value)}%
                  </span>
                </Badge>
                <Text size="sm" color="muted">
                  vs last period
                </Text>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 text-gray-400 dark:text-gray-600">
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

