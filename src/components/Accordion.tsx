'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  /** Initial open items */
  defaultOpen?: string[];
  /** Bordered style */
  bordered?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export function Accordion({
  items,
  allowMultiple = false,
  className = '',
  defaultOpen = [],
  bordered = true,
  size = 'md',
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-5 text-lg',
  };

  return (
    <div className={`${bordered ? 'border border-gray-200 rounded-lg' : ''} ${className}`}>
      {items.map((item, index) => {
        const isOpen = openItems.has(item.id);
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        
        return (
          <div
            key={item.id}
            className={`${!isLast ? 'border-b border-gray-200' : ''} ${
              bordered && isFirst ? 'rounded-t-lg' : ''
            } ${bordered && isLast ? 'rounded-b-lg' : ''} overflow-hidden`}
          >
            <button
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              className={`w-full flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${sizeClasses[size]} ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              aria-disabled={item.disabled}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {item.icon && <span className="shrink-0 text-gray-600">{item.icon}</span>}
                <span className="font-semibold text-gray-900 flex-1">{item.title}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 shrink-0">
                    {item.badge}
                  </span>
                )}
              </div>
              <motion.svg
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-5 text-gray-500 shrink-0 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden bg-gray-50"
                  role="region"
                  aria-labelledby={`accordion-button-${item.id}`}
                >
                  <motion.div
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    exit={{ y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`text-gray-700 ${sizeClasses[size]}`}
                  >
                    {item.content}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
