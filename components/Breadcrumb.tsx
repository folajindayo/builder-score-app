'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Breadcrumb({ items, separator = '/', size = 'md', className = '' }: BreadcrumbProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <nav aria-label="Breadcrumb" className={`${sizeClasses[size]} ${className}`}>
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1"
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <motion.span whileHover={{ scale: 1.05 }}>{item.label}</motion.span>
                </Link>
              ) : (
                <span
                  className={`flex items-center gap-1 ${isLast ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span className="text-gray-400" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
