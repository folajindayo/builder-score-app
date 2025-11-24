'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  gradient?: boolean;
  underline?: boolean;
  animated?: boolean;
  id?: string;
}

const sizeClasses = {
  1: 'text-4xl md:text-5xl font-bold',
  2: 'text-3xl md:text-4xl font-bold',
  3: 'text-2xl md:text-3xl font-semibold',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg md:text-xl font-medium',
  6: 'text-base md:text-lg font-medium',
};

export function Heading({
  children,
  level = 1,
  as,
  className = '',
  gradient = false,
  underline = false,
  animated = false,
  id,
}: HeadingProps) {
  const Component = as || (`h${level}` as keyof JSX.IntrinsicElements);
  const sizeClass = sizeClasses[level];

  const content = (
    <Component
      id={id}
      className={`${sizeClass} ${
        gradient
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
          : 'text-gray-900'
      } ${underline ? 'border-b-4 border-blue-600 pb-2 inline-block' : ''} ${className}`}
    >
      {children}
    </Component>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
