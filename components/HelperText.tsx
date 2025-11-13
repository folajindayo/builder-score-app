'use client';

import { ReactNode } from 'react';

interface HelperTextProps {
  children: ReactNode;
  variant?: 'default' | 'error' | 'success' | 'warning';
  className?: string;
}

const variantClasses = {
  default: 'text-gray-500',
  error: 'text-red-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
};

export function HelperText({ children, variant = 'default', className = '' }: HelperTextProps) {
  return <p className={`text-xs mt-1 ${variantClasses[variant]} ${className}`}>{children}</p>;
}
