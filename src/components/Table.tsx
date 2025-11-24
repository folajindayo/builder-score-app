'use client';

import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  striped?: boolean;
  hover?: boolean;
  className?: string;
  bordered?: boolean;
  compact?: boolean;
  sticky?: boolean;
  caption?: string;
}

export function Table({
  children,
  striped = false,
  hover = false,
  className = '',
  bordered = false,
  compact = false,
  sticky = false,
  caption,
}: TableProps) {
  return (
    <div className={`overflow-x-auto ${sticky ? 'relative' : ''}`}>
      <table
        className={`w-full border-collapse ${bordered ? 'border border-gray-200' : ''} ${
          striped ? '[&_tbody_tr:nth-child(even)]:bg-gray-50' : ''
        } ${hover ? '[&_tbody_tr:hover]:bg-gray-100' : ''} ${
          compact ? '[&_td]:py-2 [&_th]:py-2' : '[&_td]:py-3 [&_th]:py-3'
        } ${sticky ? '[&_thead]:sticky [&_thead]:top-0 [&_thead]:bg-white [&_thead]:z-10' : ''} ${className}`}
      >
        {caption && (
          <caption className="text-left text-sm font-medium text-gray-900 p-4">{caption}</caption>
        )}
        {children}
      </table>
    </div>
  );
}
