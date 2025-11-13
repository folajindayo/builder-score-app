/**
 * Input Atom Component
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface InputProps
  extends ComponentProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flushed';
  isInvalid?: boolean;
  isDisabled?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      isInvalid = false,
      isDisabled = false,
      leftAddon,
      rightAddon,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const variantStyles = {
      default: `border rounded-md ${
        isInvalid
          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
      }`,
      filled: `rounded-md ${
        isInvalid
          ? 'bg-red-50 focus:bg-red-100'
          : 'bg-gray-100 focus:bg-gray-200'
      }`,
      flushed: `border-b-2 rounded-none ${
        isInvalid
          ? 'border-red-500 focus:border-red-600'
          : 'border-gray-300 focus:border-blue-500'
      }`,
    };

    const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

    if (leftAddon || rightAddon) {
      return (
        <div className="flex items-center">
          {leftAddon && <div className="mr-2">{leftAddon}</div>}
          <input
            ref={ref}
            className={classes}
            disabled={isDisabled}
            aria-invalid={isInvalid}
            {...props}
          />
          {rightAddon && <div className="ml-2">{rightAddon}</div>}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-invalid={isInvalid}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

