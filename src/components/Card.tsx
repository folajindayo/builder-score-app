'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  expandable?: boolean;
  expandedContent?: ReactNode;
  elevated?: boolean;
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Accessible label for the card */
  ariaLabel?: string;
  /** Role for accessibility */
  role?: string;
  /** Make card keyboard focusable */
  focusable?: boolean;
}

export function Card({
  children,
  className = '',
  hover = false,
  onClick,
  expandable = false,
  expandedContent,
  elevated = false,
  bordered = true,
  padding = 'md',
  ariaLabel,
  role = 'article',
  focusable = false,
}: CardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const baseClasses = `bg-white/80 backdrop-blur-sm rounded-xl ${
    bordered ? 'border-2 border-gray-200/50' : ''
  } ${elevated ? 'shadow-lg' : 'shadow-sm'} ${paddingClasses[padding]}`;
  const hoverClasses = hover
    ? 'hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer'
    : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  const focusClasses = isFocused && focusable ? 'ring-4 ring-blue-500 ring-opacity-50' : '';

  const handleToggle = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !focusable) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    card.addEventListener('focus', handleFocus);
    card.addEventListener('blur', handleBlur);

    return () => {
      card.removeEventListener('focus', handleFocus);
      card.removeEventListener('blur', handleBlur);
    };
  }, [focusable]);

  const content = (
    <div
      ref={cardRef}
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${focusClasses} ${className}`}
      role={role}
      aria-label={ariaLabel}
      aria-expanded={expandable ? isExpanded : undefined}
      tabIndex={focusable ? 0 : undefined}
      onKeyDown={focusable ? handleKeyDown : undefined}
    >
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
              role="region"
              aria-live="polite"
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
