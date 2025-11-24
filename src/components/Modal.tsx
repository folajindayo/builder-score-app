'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Prevent closing when clicking outside */
  disableBackdropClose?: boolean;
  /** Prevent closing with escape key */
  disableEscapeKey?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Footer content */
  footer?: ReactNode;
  /** Custom z-index */
  zIndex?: number;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  disableBackdropClose = false,
  disableEscapeKey = false,
  showCloseButton = true,
  footer,
  zIndex = 50,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Focus modal on open
      modalRef.current?.focus();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !disableEscapeKey) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        // Restore body scroll
        document.body.style.overflow = '';
        // Restore focus
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose, disableEscapeKey]);

  const handleBackdropClick = () => {
    if (!disableBackdropClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            style={{ zIndex: zIndex - 10 }}
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white rounded-xl shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] flex flex-col`}
              tabIndex={-1}
            >
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
                  <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                    {title}
                  </h2>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
                      aria-label="Close modal"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <div className="p-6 overflow-y-auto flex-1">{children}</div>
              {footer && (
                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
