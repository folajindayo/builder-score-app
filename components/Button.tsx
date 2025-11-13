'use client';

import { ButtonHTMLAttributes, ReactNode, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { buttonPress } from '@/lib/micro-interactions';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Button content */
  children: ReactNode;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Accessible label for the button */
  ariaLabel?: string;
  /** Custom ripple color */
  rippleColor?: string;
  /** Icon to display before text */
  leftIcon?: ReactNode;
  /** Icon to display after text */
  rightIcon?: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Show focus ring */
  showFocusRing?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled,
  className = '',
  ariaLabel,
  rippleColor = 'white',
  leftIcon,
  rightIcon,
  fullWidth = false,
  showFocusRing = true,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [isFocused, setIsFocused] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-400',
    outline: 'border-2 border-blue-600 text-blue-700 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  };

  // Ensure WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3',
  };

  const baseClasses = `font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden flex items-center justify-center ${
    fullWidth ? 'w-full' : ''
  } ${showFocusRing && isFocused ? 'ring-4 ring-opacity-50' : ''}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleIdRef.current++;

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);

    props.onClick?.(e);
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    button.addEventListener('focus', handleFocus);
    button.addEventListener('blur', handleBlur);

    return () => {
      button.removeEventListener('focus', handleFocus);
      button.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <motion.button
      ref={buttonRef}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      onClick={handleClick}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full opacity-30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.6s ease-out',
            backgroundColor: rippleColor,
          }}
        />
      ))}
      {loading ? (
        <span className="flex items-center gap-2" aria-live="polite" aria-busy="true">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="sr-only">Loading</span>
          <span aria-hidden="true">Loading...</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span className="inline-flex items-center">{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}
