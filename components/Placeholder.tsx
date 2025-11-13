'use client';

import { ReactNode } from 'react';

interface PlaceholderProps {
  children?: ReactNode;
  text?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Placeholder({
  children,
  text,
  icon,
  size = 'md',
  className = '',
}: PlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-gray-400 ${sizeClasses[size]} ${className}`}
    >
      {icon && <div className="mb-4">{icon}</div>}
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
