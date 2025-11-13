'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  group?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: string;
  options: SelectOption[];
  /** Placeholder option text */
  placeholder?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Left icon */
  leftIcon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      success,
      options,
      className = '',
      placeholder,
      size = 'md',
      leftIcon,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const borderColor = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : success
        ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';

    // Group options by group property
    const groupedOptions = options.reduce(
      (acc, option) => {
        const group = option.group || '__default__';
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(option);
        return acc;
      },
      {} as Record<string, SelectOption[]>
    );

    return (
      <div className="w-full">
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-sm font-semibold text-gray-700 mb-2"
            htmlFor={props.id}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            className={`w-full border-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 appearance-none ${sizeClasses[size]} ${borderColor} ${leftIcon ? 'pl-10' : ''} ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${props.id}-error`
                : success
                  ? `${props.id}-success`
                  : helperText
                    ? `${props.id}-helper`
                    : undefined
            }
            aria-label={props['aria-label'] || label || 'Select option'}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {Object.entries(groupedOptions).map(([group, groupOptions]) => {
              if (group === '__default__') {
                return groupOptions.map((option) => (
                  <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </option>
                ));
              }
              return (
                <optgroup key={group} label={group}>
                  {groupOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <div className="mt-1">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              id={`${props.id}-error`}
              className="text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              {error}
            </motion.p>
          )}
          {success && !error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              id={`${props.id}-success`}
              className="text-sm text-green-600"
            >
              {success}
            </motion.p>
          )}
          {helperText && !error && !success && (
            <p id={`${props.id}-helper`} className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
