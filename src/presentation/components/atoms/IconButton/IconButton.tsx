/**
 * IconButton Atom Component
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface IconButtonProps
  extends ComponentProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  icon: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error';
  isRounded?: boolean;
  isDisabled?: boolean;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = 'md',
      variant = 'solid',
      colorScheme = 'primary',
      isRounded = false,
      isDisabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeStyles = {
      xs: 'p-1 text-xs',
      sm: 'p-1.5 text-sm',
      md: 'p-2 text-base',
      lg: 'p-3 text-lg',
    };

    const shapeStyles = isRounded ? 'rounded-full' : 'rounded-md';

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
    };

    const classes = `${baseStyles} ${sizeStyles[size]} ${shapeStyles} ${variantStyles[variant][colorScheme]} ${className}`;

    return (
      <button ref={ref} className={classes} disabled={isDisabled} {...props}>
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

