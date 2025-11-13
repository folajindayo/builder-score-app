/**
 * Modal Organism Component
 * Modal dialog with overlay
 */

import { HTMLAttributes, forwardRef, useEffect, ReactNode } from 'react';
import { Heading } from '@atoms/Heading';
import { Button, ButtonProps } from '@atoms/Button';
import { IconButton } from '@atoms/IconButton';
import { Divider } from '@atoms/Divider';
import { ComponentProps } from '@presentation/types';

export interface ModalProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
  primaryAction?: ButtonProps & { label: string };
  secondaryAction?: ButtonProps & { label: string };
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEsc = true,
      showCloseButton = true,
      children,
      footer,
      primaryAction,
      secondaryAction,
      className = '',
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      if (!isOpen) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (closeOnEsc && e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, closeOnEsc, onClose]);

    if (!isOpen) return null;

    const sizeStyles = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full m-4',
    };

    const CloseIcon = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          className={`relative w-full ${sizeStyles[size]} bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] flex flex-col ${className}`}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <>
              <div className="flex items-start justify-between p-6">
                {title && (
                  <Heading id="modal-title" as="h2" size="xl">
                    {title}
                  </Heading>
                )}
                {showCloseButton && (
                  <IconButton
                    icon={CloseIcon}
                    variant="ghost"
                    size="sm"
                    aria-label="Close modal"
                    onClick={onClose}
                    className="-mt-1 -mr-1"
                  />
                )}
              </div>
              <Divider />
            </>
          )}

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto">{children}</div>

          {/* Footer */}
          {(footer || primaryAction || secondaryAction) && (
            <>
              <Divider />
              <div className="flex items-center justify-end gap-3 p-6">
                {footer ? (
                  footer
                ) : (
                  <>
                    {secondaryAction && (
                      <Button variant="outline" {...secondaryAction}>
                        {secondaryAction.label}
                      </Button>
                    )}
                    {primaryAction && (
                      <Button {...primaryAction}>{primaryAction.label}</Button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

