"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-2 border-2 rounded-lg bg-white text-gray-900 focus:ring-2 focus:outline-none transition-all resize-y ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          } ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          aria-label={props['aria-label'] || label || props.placeholder || 'Text area'}
          {...props}
        />
        {error && (
          <p id={`${props.id}-error`} className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="mt-1 text-sm text-gray-700">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

