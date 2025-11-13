/**
 * Select Atom Component
 */

import { SelectHTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface SelectProps
  extends ComponentProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  isInvalid?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      children,
      size = 'md',
      variant = 'default',
      isInvalid = false,
      isDisabled = false,
      placeholder,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-right pr-10';

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
    };

    const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

    return (
      <div className="relative inline-block w-full">
        <select
          ref={ref}
          className={classes}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

