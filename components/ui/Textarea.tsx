"use client";

import React, { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
}

/**
 * Textarea Component
 * Multi-line text input with character count
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      showCount = false,
      className = "",
      value,
      ...props
    },
    ref
  ) => {
    const charCount = value ? String(value).length : 0;

    return (
      <div className="w-full">
        <div className="flex items-center justify-between">
          {label && (
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {label}
              {props.required && <span className="text-red-500">*</span>}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-sm text-gray-500">
              {charCount}/{maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={`w-full rounded-lg border px-4 py-2 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } ${className}`}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;

