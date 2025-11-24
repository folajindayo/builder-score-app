'use client';

import { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
  as?: 'p' | 'span' | 'div' | 'label';
  truncate?: boolean;
  lineClamp?: number;
  italic?: boolean;
  underline?: boolean;
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

const weightClasses = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const colorClasses = {
  default: 'text-gray-900',
  muted: 'text-gray-600',
  primary: 'text-blue-600',
  secondary: 'text-gray-500',
  error: 'text-red-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export function Text({
  children,
  size = 'base',
  weight = 'normal',
  color = 'default',
  align = 'left',
  className = '',
  as: Component = 'p',
  truncate = false,
  lineClamp,
  italic = false,
  underline = false,
}: TextProps) {
  const lineClampClass = lineClamp ? `line-clamp-${lineClamp}` : '';
  
  return (
    <Component
      className={`${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} ${alignClasses[align]} ${
        truncate ? 'truncate' : ''
      } ${lineClampClass} ${italic ? 'italic' : ''} ${underline ? 'underline' : ''} ${className}`}
    >
      {children}
    </Component>
  );
}
