'use client';

import { IconButton } from '@/components/IconButton';
import { motion } from 'framer-motion';

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  label?: string;
  className?: string;
}

export function RefreshButton({
  onClick,
  loading = false,
  label = 'Refresh',
  className = '',
}: RefreshButtonProps) {
  return (
    <IconButton
      icon={
        <motion.svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          animate={loading ? { rotate: 360 } : { rotate: 0 }}
          transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </motion.svg>
      }
      label={label}
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={loading}
      className={className}
    />
  );
}
