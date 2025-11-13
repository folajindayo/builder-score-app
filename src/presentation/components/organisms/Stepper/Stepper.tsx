/**
 * Stepper Organism Component
 * Multi-step progress indicator
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { Text } from '@atoms/Text';
import { Badge } from '@atoms/Badge';
import { ComponentProps } from '@presentation/types';

export interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

export interface StepperProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      orientation = 'horizontal',
      className = '',
      ...props
    },
    ref
  ) => {
    const CheckIcon = (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );

    const orientationStyles = orientation === 'horizontal'
      ? 'flex-row items-start'
      : 'flex-col items-stretch';

    return (
      <div
        ref={ref}
        className={`flex ${orientationStyles} ${className}`}
        {...props}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div
              key={step.id}
              className={`flex ${orientation === 'horizontal' ? 'flex-col items-center flex-1' : 'flex-row items-start'} gap-2`}
            >
              {/* Connector Line */}
              {orientation === 'horizontal' && index > 0 && (
                <div
                  className={`h-0.5 w-full ${
                    isCompleted
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}

              {/* Step Indicator */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted
                      ? 'bg-blue-600 text-white'
                      : isCurrent
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 ring-2 ring-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    CheckIcon
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className={orientation === 'vertical' ? 'flex-1' : ''}>
                  <Text weight="semibold" className={isCurrent ? 'text-blue-600' : ''}>
                    {step.label}
                  </Text>
                  {step.description && (
                    <Text size="sm" color="muted">
                      {step.description}
                    </Text>
                  )}
                </div>
              </div>

              {/* Vertical Connector */}
              {orientation === 'vertical' && index < steps.length - 1 && (
                <div
                  className={`w-0.5 h-12 ml-5 ${
                    index < currentStep
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';

