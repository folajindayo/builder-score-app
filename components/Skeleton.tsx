'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  animated?: boolean;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  animated = true,
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const style = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '40px' : '120px'),
  };

  if (animated) {
    return (
      <motion.div
        className={`bg-gray-200 ${variantClasses[variant]} ${className}`}
        style={style}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        aria-busy="true"
        aria-live="polite"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </motion.div>
    );
  }

  return (
    <div
      className={`bg-gray-200 ${variantClasses[variant]} ${className}`}
      style={style}
      aria-busy="true"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
