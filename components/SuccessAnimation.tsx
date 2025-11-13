'use client';

import { motion } from 'framer-motion';
import { successCheck, successBounce } from '@/lib/micro-interactions';

interface SuccessAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export function SuccessAnimation({ size = 'md', className = '' }: SuccessAnimationProps) {
  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      variants={successBounce}
      initial="initial"
      animate="animate"
    >
      <svg
        className="w-full h-full text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
          variants={successCheck}
          initial="initial"
          animate="animate"
        />
      </svg>
    </motion.div>
  );
}
