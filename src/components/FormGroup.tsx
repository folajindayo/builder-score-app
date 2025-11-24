'use client';

import { ReactNode } from 'react';

interface FormGroupProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spacingClasses = {
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
};

export function FormGroup({ children, spacing = 'md', className = '' }: FormGroupProps) {
  return <div className={`${spacingClasses[spacing]} ${className}`}>{children}</div>;
}
