/**
 * Switch Atom Component
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { ComponentProps } from '@presentation/types';

export interface SwitchProps
  extends ComponentProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'primary' | 'secondary' | 'success';
  label?: string;
  isDisabled?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      size = 'md',
      colorScheme = 'primary',
      label,
      isDisabled = false,
      checked,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: { container: 'w-8 h-4', thumb: 'w-3 h-3' },
      md: { container: 'w-11 h-6', thumb: 'w-5 h-5' },
      lg: { container: 'w-14 h-7', thumb: 'w-6 h-6' },
    };

    const colorStyles = {
      primary: 'peer-checked:bg-blue-600',
      secondary: 'peer-checked:bg-purple-600',
      success: 'peer-checked:bg-green-600',
    };

    const container = (
      <div className="relative inline-flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          disabled={isDisabled}
          checked={checked}
          {...props}
        />
        <div
          className={`${sizeStyles[size].container} ${colorStyles[colorScheme]} ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-${colorScheme === 'primary' ? 'blue' : colorScheme === 'secondary' ? 'purple' : 'green'}-500 transition-colors ${className}`}
        >
          <div
            className={`${sizeStyles[size].thumb} absolute top-0.5 left-0.5 bg-white rounded-full transition-transform ${
              checked ? 'translate-x-full' : ''
            }`}
          />
        </div>
      </div>
    );

    if (label) {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {container}
          <span className="text-gray-700 dark:text-gray-300">{label}</span>
        </label>
      );
    }

    return container;
  }
);

Switch.displayName = 'Switch';

