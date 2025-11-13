/**
 * Card Organism Component
 * Complete card with header, body, and footer
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { CardHeader, CardHeaderProps } from '@molecules/CardHeader';
import { Divider } from '@atoms/Divider';
import { ComponentProps } from '@presentation/types';

export interface CardProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  header?: CardHeaderProps;
  footer?: ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  isClickable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      header,
      footer,
      variant = 'elevated',
      padding = 'md',
      isClickable = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      elevated: 'bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700',
      outlined: 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600',
      filled: 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
    };

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    const clickableStyles = isClickable
      ? 'cursor-pointer hover:shadow-lg transition-shadow'
      : '';

    return (
      <div
        ref={ref}
        className={`rounded-lg overflow-hidden ${variantStyles[variant]} ${clickableStyles} ${className}`}
        {...props}
      >
        {header && (
          <>
            <div className={paddingStyles[padding]}>
              <CardHeader {...header} />
            </div>
            <Divider />
          </>
        )}
        <div className={paddingStyles[padding]}>{children}</div>
        {footer && (
          <>
            <Divider />
            <div className={paddingStyles[padding]}>{footer}</div>
          </>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

