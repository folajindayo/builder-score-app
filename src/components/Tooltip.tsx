'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: string;
  className?: string;
  /** Disable tooltip */
  disabled?: boolean;
  /** Show arrow pointer */
  showArrow?: boolean;
  /** Tooltip theme */
  theme?: 'dark' | 'light';
  /** Trigger on click instead of hover */
  triggerOnClick?: boolean;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 300,
  maxWidth = '200px',
  className = '',
  disabled = false,
  showArrow = true,
  theme = 'dark',
  triggerOnClick = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const themeClasses = {
    dark: 'text-white bg-gray-900',
    light: 'text-gray-900 bg-white border border-gray-200 shadow-md',
  };

  const arrowClasses = {
    dark: {
      top: 'border-t-gray-900',
      bottom: 'border-b-gray-900',
      left: 'border-l-gray-900',
      right: 'border-r-gray-900',
    },
    light: {
      top: 'border-t-white border-r-transparent border-b-transparent border-l-transparent drop-shadow',
      bottom: 'border-b-white border-r-transparent border-t-transparent border-l-transparent drop-shadow',
      left: 'border-l-white border-t-transparent border-r-transparent border-b-transparent drop-shadow',
      right: 'border-r-white border-t-transparent border-l-transparent border-b-transparent drop-shadow',
    },
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (triggerOnClick && isVisible) {
      const handleClickOutside = (e: MouseEvent) => {
        if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
          setIsVisible(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [triggerOnClick, isVisible]);

  const handleMouseEnter = () => {
    if (disabled || triggerOnClick) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (disabled || triggerOnClick) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const handleClick = () => {
    if (disabled || !triggerOnClick) return;
    setIsVisible(!isVisible);
  };

  const animations = {
    top: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } },
    bottom: { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 10 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 } },
  };

  return (
    <div
      ref={tooltipRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {isVisible && !disabled && (
          <motion.div
            initial={animations[position].initial}
            animate={animations[position].animate}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 px-3 py-2 text-sm rounded-lg ${themeClasses[theme]} ${positionClasses[position]} ${className}`}
            style={{ maxWidth }}
            role="tooltip"
            aria-hidden={!isVisible}
          >
            {content}
            {showArrow && (
              <div
                className={`absolute w-0 h-0 border-4 ${
                  position === 'top'
                    ? `top-full left-1/2 -translate-x-1/2 ${arrowClasses[theme].top} border-r-transparent border-b-transparent border-l-transparent`
                    : position === 'bottom'
                      ? `bottom-full left-1/2 -translate-x-1/2 ${arrowClasses[theme].bottom} border-r-transparent border-t-transparent border-l-transparent`
                      : position === 'left'
                        ? `left-full top-1/2 -translate-y-1/2 ${arrowClasses[theme].left} border-t-transparent border-r-transparent border-b-transparent`
                        : `right-full top-1/2 -translate-y-1/2 ${arrowClasses[theme].right} border-t-transparent border-l-transparent border-b-transparent`
                }`}
                aria-hidden="true"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
