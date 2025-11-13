/**
 * Button Atom Component
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface ButtonProps
  extends ComponentProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'solid',
      size = 'md',
      colorScheme = 'primary',
      isLoading = false,
      isDisabled = false,
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantStyles = {
      solid: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      },
      outline: {
        primary: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        secondary: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-500',
        success: 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
        error: 'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
      },
      ghost: {
        primary: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        secondary: 'text-purple-600 hover:bg-purple-50 focus:ring-purple-500',
        success: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
        error: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
      },
      link: {
        primary: 'text-blue-600 hover:underline focus:ring-blue-500',
        secondary: 'text-purple-600 hover:underline focus:ring-purple-500',
        success: 'text-green-600 hover:underline focus:ring-green-500',
        error: 'text-red-600 hover:underline focus:ring-red-500',
      },
    };

    const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant][colorScheme]} ${className}`;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

