'use client';

import { ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

const sizeClasses = {
  1: 'text-4xl font-bold',
  2: 'text-3xl font-bold',
  3: 'text-2xl font-semibold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-medium',
  6: 'text-base font-medium',
};

export function Heading({ children, level = 1, as, className = '' }: HeadingProps) {
  const Component = as || (`h${level}` as keyof JSX.IntrinsicElements);
  const sizeClass = sizeClasses[level];

  return <Component className={`${sizeClass} text-gray-900 ${className}`}>{children}</Component>;
}
