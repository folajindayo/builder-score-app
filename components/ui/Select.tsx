"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, fullWidth = false, className = "", ...props }, ref) => {
    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          className={`
            rounded-lg border px-3 py-2 text-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:cursor-not-allowed disabled:opacity-50
            ${error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }
            ${fullWidth ? "w-full" : ""}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
