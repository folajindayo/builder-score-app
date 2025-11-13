/**
 * Form Organism Component
 * Complete form with validation
 */

import { FormHTMLAttributes, forwardRef, useState, ReactNode } from 'react';
import { Button, ButtonProps } from '@atoms/Button';
import { Alert } from '@molecules/Alert';
import { ComponentProps } from '@presentation/types';

export interface FormProps extends ComponentProps, Omit<FormHTMLAttributes<HTMLFormElement>, 'className' | 'onSubmit'> {
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  isLoading?: boolean;
  successMessage?: string;
  errorMessage?: string;
  submitButton?: ButtonProps & { label: string };
  cancelButton?: ButtonProps & { label: string };
  onCancel?: () => void;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      children,
      onSubmit,
      isLoading = false,
      successMessage,
      errorMessage,
      submitButton,
      cancelButton,
      onCancel,
      className = '',
      ...props
    },
    ref
  ) => {
    const [localSuccess, setLocalSuccess] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLocalError(null);
      setLocalSuccess(null);

      const formData = new FormData(e.currentTarget);
      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      try {
        await onSubmit(data);
        if (successMessage) {
          setLocalSuccess(successMessage);
        }
      } catch (error) {
        setLocalError(errorMessage || 'An error occurred');
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        noValidate
        className={`space-y-6 ${className}`}
        {...props}
      >
        {(localSuccess || localError) && (
          <Alert
            variant={localSuccess ? 'success' : 'error'}
            description={localSuccess || localError || ''}
            onClose={() => {
              setLocalSuccess(null);
              setLocalError(null);
            }}
          />
        )}

        {children}

        <div className="flex items-center justify-end gap-3 pt-4">
          {cancelButton && onCancel && (
            <Button
              type="button"
              variant="outline"
              {...cancelButton}
              onClick={onCancel}
            >
              {cancelButton.label}
            </Button>
          )}
          <Button
            type="submit"
            isLoading={isLoading}
            {...submitButton}
          >
            {submitButton?.label || 'Submit'}
          </Button>
        </div>
      </form>
    );
  }
);

Form.displayName = 'Form';

