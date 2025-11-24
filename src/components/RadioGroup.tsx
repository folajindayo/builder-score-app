'use client';

import { ReactNode } from 'react';
import { Radio } from '@/components/Radio';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  direction?: 'row' | 'column';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spacingClasses = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
};

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  direction = 'column',
  spacing = 'md',
  className = '',
}: RadioGroupProps) {
  return (
    <div
      className={`flex ${direction === 'row' ? 'flex-row' : 'flex-col'} ${spacingClasses[spacing]} ${className}`}
      role="radiogroup"
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          label={option.label}
          disabled={option.disabled}
          name={name}
        />
      ))}
    </div>
  );
}
