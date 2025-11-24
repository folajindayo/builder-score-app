'use client';

import { ReactNode } from 'react';

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className = '' }: TableCellProps) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
}
