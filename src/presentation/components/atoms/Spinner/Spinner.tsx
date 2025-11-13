/**
 * Spinner Atom Component
 */

import { HTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface SpinnerProps
  extends ComponentProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  thickness?: '2' | '3' | '4';
  speed?: 'slow' | 'normal' | 'fast';
  label?: string;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      color = 'primary',
      thickness = '2',
      speed = 'normal',
      label = 'Loading...',
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    const colorStyles = {
      primary: 'border-blue-600',
      secondary: 'border-purple-600',
      white: 'border-white',
      gray: 'border-gray-600',
    };

    const speedStyles = {
      slow: 'animate-spin duration-1000',
      normal: 'animate-spin',
      fast: 'animate-spin duration-500',
    };

    const classes = `inline-block rounded-full border-${thickness} border-t-transparent ${sizeStyles[size]} ${colorStyles[color]} ${speedStyles[speed]} ${className}`;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={classes}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

