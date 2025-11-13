'use client';

import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  striped?: boolean;
  hover?: boolean;
  className?: string;
}

export function Table({ children, striped = false, hover = false, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full border-collapse ${striped ? '[&_tbody_tr:nth-child(even)]:bg-gray-50' : ''} ${hover ? '[&_tbody_tr:hover]:bg-gray-100' : ''} ${className}`}
      >
        {children}
      </table>
    </div>
  );
}
