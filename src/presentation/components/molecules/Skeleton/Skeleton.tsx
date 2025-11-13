/**
 * Skeleton Molecule Component
 * Loading placeholder
 */

import { HTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface SkeletonProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      animation = 'pulse',
      className = '',
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
    };

    const animationStyles = {
      pulse: 'animate-pulse',
      wave: 'animate-pulse', // Could be customized
      none: '',
    };

    const baseStyles = 'bg-gray-200 dark:bg-gray-700';

    const style: React.CSSProperties = {
      width: width || (variant === 'text' ? '100%' : undefined),
      height: height || (variant === 'text' ? '1em' : undefined),
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
        style={style}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

