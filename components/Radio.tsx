"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex items-start">
        <input
          ref={ref}
          type="radio"
          className={`mt-1 w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-300" : ""
          } ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {label && (
          <label htmlFor={props.id} className="ml-2 text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
        {error && (
          <p id={`${props.id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

