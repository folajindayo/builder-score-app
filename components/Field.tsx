'use client';

import { ReactNode } from 'react';
import { Label } from '@/components/Label';
import { HelperText } from '@/components/HelperText';

interface FieldProps {
  children: ReactNode;
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

export function Field({
  children,
  label,
  htmlFor,
  required = false,
  error,
  helperText,
  className = '',
}: FieldProps) {
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && <HelperText variant="error">{error}</HelperText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </div>
  );
}
