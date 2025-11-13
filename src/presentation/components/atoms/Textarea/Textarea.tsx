/**
 * Textarea Atom Component
 */

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface TextareaProps
  extends ComponentProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  isInvalid?: boolean;
  isDisabled?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      variant = 'default',
      isInvalid = false,
      isDisabled = false,
      resize = 'vertical',
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

    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
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
    };

    const classes = `${baseStyles} ${sizeStyles[size]} ${resizeStyles[resize]} ${variantStyles[variant]} ${className}`;

    return (
      <textarea
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-invalid={isInvalid}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

