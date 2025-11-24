'use client';

import { ReactNode } from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';

interface LinkProps {
  children: ReactNode;
  href: string;
  external?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'muted' | 'success' | 'danger';
  className?: string;
  underline?: 'always' | 'hover' | 'none';
  showIcon?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const variantClasses = {
  default: 'text-gray-900 hover:text-gray-700',
  primary: 'text-blue-600 hover:text-blue-700',
  secondary: 'text-gray-600 hover:text-gray-800',
  muted: 'text-gray-500 hover:text-gray-700',
  success: 'text-green-600 hover:text-green-700',
  danger: 'text-red-600 hover:text-red-700',
};

export function Link({
  children,
  href,
  external = false,
  variant = 'default',
  className = '',
  underline = 'always',
  showIcon = false,
  disabled = false,
  onClick,
}: LinkProps) {
  const underlineClasses = {
    always: 'underline',
    hover: 'hover:underline',
    none: 'no-underline',
  };

  const baseClasses = `${variantClasses[variant]} ${underlineClasses[underline]} transition-all inline-flex items-center gap-1 ${
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
  } ${className}`;

  const content = (
    <>
      {children}
      {external && showIcon && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </>
  );

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  if (external) {
    return (
      <motion.a
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        onClick={handleClick}
        aria-disabled={disabled}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <NextLink href={href} className={baseClasses} onClick={handleClick} aria-disabled={disabled}>
      <motion.span whileHover={{ scale: disabled ? 1 : 1.02 }} className="inline-flex items-center gap-1">
        {content}
      </motion.span>
    </NextLink>
  );
}
