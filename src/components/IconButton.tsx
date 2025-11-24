'use client';

import { ButtonHTMLAttributes } from 'react';
import { Tooltip } from '@/components/Tooltip';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function IconButton({
  icon,
  label,
  variant = 'default',
  size = 'md',
  className = '',
  showTooltip = true,
  ...props
}: IconButtonProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const button = (
    <button
      className={`inline-flex items-center justify-center rounded-lg transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );

  if (showTooltip) {
    return <Tooltip content={label}>{button}</Tooltip>;
  }

  return button;
}
