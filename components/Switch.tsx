'use client';

import { motion } from 'framer-motion';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Description text */
  description?: string;
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'error';
  /** Show loading state */
  loading?: boolean;
  /** ID for accessibility */
  id?: string;
  /** Icon for checked state */
  checkedIcon?: React.ReactNode;
  /** Icon for unchecked state */
  uncheckedIcon?: React.ReactNode;
}

const sizeClasses = {
  sm: 'w-8 h-4',
  md: 'w-11 h-6',
  lg: 'w-14 h-7',
};

const thumbSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const translateClasses = {
  sm: 'translate-x-4',
  md: 'translate-x-5',
  lg: 'translate-x-7',
};

export function Switch({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
  description,
  variant = 'primary',
  loading = false,
  id,
  checkedIcon,
  uncheckedIcon,
}: SwitchProps) {
  const variantClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative flex-shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled || loading}
          className="sr-only peer"
          aria-describedby={description ? `${id}-description` : undefined}
        />
        <label
          htmlFor={id}
          className={`relative inline-block ${sizeClasses[size]} rounded-full transition-colors duration-200 ${
            checked ? variantClasses[variant] : 'bg-gray-300'
          } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} peer-focus-visible:ring-4 peer-focus-visible:ring-offset-2 ${
            checked ? 'peer-focus-visible:ring-blue-500/50' : 'peer-focus-visible:ring-gray-400/50'
          }`}
        >
          <motion.div
            initial={false}
            animate={{
              x: checked ? (size === 'sm' ? 16 : size === 'md' ? 20 : 28) : 2,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute top-0.5 ${thumbSizeClasses[size]} bg-white rounded-full shadow-md flex items-center justify-center`}
          >
            {loading ? (
              <svg
                className="w-2.5 h-2.5 text-gray-400 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : checked && checkedIcon ? (
              <span className="text-[10px]">{checkedIcon}</span>
            ) : !checked && uncheckedIcon ? (
              <span className="text-[10px]">{uncheckedIcon}</span>
            ) : null}
          </motion.div>
        </label>
      </div>
      {(label || description) && (
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 min-w-0"
        >
          {label && (
            <label
              htmlFor={id}
              className={`block font-medium ${textSizeClasses[size]} ${
                disabled || loading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer'
              }`}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${id}-description`}
              className={`text-sm ${disabled || loading ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {description}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
