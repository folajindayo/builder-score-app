'use client';

import { TextareaHTMLAttributes, forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: string;
  showCharCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      success,
      showCharCount = false,
      maxLength,
      autoResize = false,
      size = 'md',
      className = '',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
      if (value !== undefined) {
        setCharCount(String(value).length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (autoResize) {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
      }
      onChange?.(e);
    };

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
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          className={`w-full border-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:outline-none transition-all ${
            autoResize ? 'resize-none' : 'resize-y'
          } disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses[size]} ${borderColor} ${className}`}
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
          aria-label={props['aria-label'] || label || props.placeholder || 'Text area'}
          {...props}
        />
        <div className="flex items-center justify-between mt-1">
          <div className="flex-1">
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
          {showCharCount && maxLength && (
            <span
              className={`text-xs ${
                charCount > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'
              }`}
              aria-live="polite"
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
