'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DragDropIndicatorProps {
  isDragging?: boolean;
  isOver?: boolean;
  children: ReactNode;
  className?: string;
}

export function DragDropIndicator({
  isDragging = false,
  isOver = false,
  children,
  className = '',
}: DragDropIndicatorProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 0.95 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-50/50 rounded-lg pointer-events-none" />
      )}
      {isDragging && (
        <div className="absolute inset-0 border-2 border-blue-500 bg-blue-100/30 rounded-lg pointer-events-none" />
      )}
    </motion.div>
  );
}
