/**
 * FormField Molecule Component
 * Combines Label + Input/Textarea/Select + Error/Helper text
 */

import { ReactElement, cloneElement } from 'react';
import { Label } from '@atoms/Label';
import { Text } from '@atoms/Text';
import { ComponentProps } from '@presentation/types';

export interface FormFieldProps extends ComponentProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  children: ReactElement;
}

export const FormField = ({
  label,
  helperText,
  errorText,
  isRequired = false,
  isInvalid = false,
  children,
  className = '',
}: FormFieldProps) => {
  const fieldId = children.props.id || `field-${Math.random()}`;

  const enhancedChild = cloneElement(children, {
    id: fieldId,
    isInvalid: isInvalid || !!errorText,
    'aria-describedby': errorText
      ? `${fieldId}-error`
      : helperText
      ? `${fieldId}-helper`
      : undefined,
  });

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <Label htmlFor={fieldId} isRequired={isRequired} isInvalid={isInvalid}>
          {label}
        </Label>
      )}
      {enhancedChild}
      {errorText && (
        <Text
          id={`${fieldId}-error`}
          size="sm"
          color="error"
          role="alert"
          aria-live="polite"
        >
          {errorText}
        </Text>
      )}
      {helperText && !errorText && (
        <Text id={`${fieldId}-helper`} size="sm" color="muted">
          {helperText}
        </Text>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';

