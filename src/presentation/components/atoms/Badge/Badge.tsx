/**
 * Badge Atom Component
 */

import { HTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface BadgeProps
  extends ComponentProps,
    Omit<HTMLAttributes<HTMLSpanElement>, 'className'> {
  variant?: 'solid' | 'subtle' | 'outline';
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'solid',
      colorScheme = 'primary',
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    const variantStyles = {
      solid: {
        primary: 'bg-blue-600 text-white',
        secondary: 'bg-purple-600 text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-amber-600 text-white',
        error: 'bg-red-600 text-white',
        info: 'bg-cyan-600 text-white',
      },
      subtle: {
        primary: 'bg-blue-100 text-blue-800',
        secondary: 'bg-purple-100 text-purple-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-amber-100 text-amber-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-cyan-100 text-cyan-800',
      },
      outline: {
        primary: 'border border-blue-600 text-blue-600',
        secondary: 'border border-purple-600 text-purple-600',
        success: 'border border-green-600 text-green-600',
        warning: 'border border-amber-600 text-amber-600',
        error: 'border border-red-600 text-red-600',
        info: 'border border-cyan-600 text-cyan-600',
      },
    };

    const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant][colorScheme]} ${className}`;

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

