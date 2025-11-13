/**
 * Checkbox Atom Component
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface CheckboxProps
  extends ComponentProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'primary' | 'secondary' | 'success';
  isIndeterminate?: boolean;
  isInvalid?: boolean;
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      colorScheme = 'primary',
      isIndeterminate = false,
      isInvalid = false,
      label,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const colorStyles = {
      primary: 'text-blue-600 focus:ring-blue-500',
      secondary: 'text-purple-600 focus:ring-purple-500',
      success: 'text-green-600 focus:ring-green-500',
    };

    const classes = `${sizeStyles[size]} ${colorStyles[colorScheme]} ${
      isInvalid ? 'border-red-500' : 'border-gray-300'
    } rounded focus:ring-2 focus:ring-offset-2 transition ${className}`;

    const checkbox = (
      <input
        ref={ref}
        type="checkbox"
        className={classes}
        aria-invalid={isInvalid}
        {...props}
      />
    );

    if (label) {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {checkbox}
          <span className="text-gray-700 dark:text-gray-300">{label}</span>
        </label>
      );
    }

    return checkbox;
  }
);

Checkbox.displayName = 'Checkbox';

