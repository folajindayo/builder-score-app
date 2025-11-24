'use client';

import { ReactNode } from 'react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /** Text or content in the middle of divider */
  label?: ReactNode;
  /** Label position */
  labelPosition?: 'left' | 'center' | 'right';
  /** Divider thickness */
  thickness?: 'thin' | 'normal' | 'thick';
  /** Divider style */
  variant?: 'solid' | 'dashed' | 'dotted';
}

const spacingClasses = {
  none: 'my-0',
  xs: 'my-1',
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-6',
  xl: 'my-8',
};

const thicknessClasses = {
  thin: 'border-t',
  normal: 'border-t-2',
  thick: 'border-t-4',
};

const variantClasses = {
  solid: '',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

export function Divider({
  orientation = 'horizontal',
  spacing = 'md',
  className = '',
  label,
  labelPosition = 'center',
  thickness = 'normal',
  variant = 'solid',
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={`inline-block ${thickness === 'thin' ? 'w-px' : thickness === 'normal' ? 'w-0.5' : 'w-1'} h-full bg-gray-200 ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    const labelPositionClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    return (
      <div
        className={`flex items-center ${spacingClasses[spacing]} ${className}`}
        role="separator"
        aria-orientation="horizontal"
      >
        {labelPosition !== 'left' && (
          <hr
            className={`flex-1 border-0 ${thicknessClasses[thickness]} ${variantClasses[variant]} border-gray-200`}
          />
        )}
        <span className="px-3 text-sm text-gray-500 whitespace-nowrap">{label}</span>
        {labelPosition !== 'right' && (
          <hr
            className={`flex-1 border-0 ${thicknessClasses[thickness]} ${variantClasses[variant]} border-gray-200`}
          />
        )}
      </div>
    );
  }

  return (
    <hr
      className={`border-0 ${thicknessClasses[thickness]} ${variantClasses[variant]} border-gray-200 ${spacingClasses[spacing]} ${className}`}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}
