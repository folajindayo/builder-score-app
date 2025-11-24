'use client';

import { ReactNode } from 'react';

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className = '' }: TableHeadProps) {
  return <thead className={`bg-gray-50 ${className}`}>{children}</thead>;
}
