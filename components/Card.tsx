'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  expandable?: boolean;
  expandedContent?: ReactNode;
}

export function Card({
  children,
  className = '',
  hover = false,
  onClick,
  expandable = false,
  expandedContent,
}: CardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const baseClasses =
    'bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-200/50 shadow-sm';
  const hoverClasses = hover
    ? 'hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer'
    : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const handleToggle = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
    onClick?.();
  };

  const content = (
    <div className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}>
      <div onClick={expandable ? handleToggle : onClick}>{children}</div>
      {expandable && expandedContent && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-gray-200 mt-4 pt-4"
            >
              {expandedContent}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );

  if (onClick) {
    return (
      <motion.div
        whileHover={hover ? { scale: 1.02, y: -4 } : { scale: 1.01 }}
        whileTap={onClick ? { scale: 0.98 } : {}}
        onClick={onClick}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {content}
      </motion.div>
    );
  }

  return hover ? (
    <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
      {content}
    </motion.div>
  ) : (
    content
  );
}
