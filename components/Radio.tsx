'use client';

import { motion } from 'framer-motion';

interface RadioProps {
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  name?: string;
  className?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  id?: string;
}

export function Radio({
  value,
  checked,
  onChange,
  label,
  disabled = false,
  name,
  className = '',
  description,
  size = 'md',
  variant = 'primary',
  id,
}: RadioProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const variantClasses = {
    primary: 'text-blue-600 focus:ring-blue-500',
    success: 'text-green-600 focus:ring-green-500',
    warning: 'text-yellow-600 focus:ring-yellow-500',
    error: 'text-red-600 focus:ring-red-500',
  };

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          type="radio"
          value={value}
          checked={checked}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          name={name}
          className={`${sizeClasses[size]} ${variantClasses[variant]} border-gray-300 focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
          aria-describedby={description ? `${id}-description` : undefined}
        />
      </div>
      {(label || description) && (
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-3 flex-1"
        >
          {label && (
            <label
              htmlFor={id}
              className={`font-medium ${textSizeClasses[size]} ${
                disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer'
              }`}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${id}-description`}
              className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {description}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
