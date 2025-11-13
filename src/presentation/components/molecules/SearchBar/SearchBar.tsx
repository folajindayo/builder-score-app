/**
 * SearchBar Molecule Component
 * Combines Input + Search Icon + Clear Button
 */

import { useState } from 'react';
import { Input, InputProps } from '@atoms/Input';
import { IconButton } from '@atoms/IconButton';
import { ComponentProps } from '@presentation/types';

export interface SearchBarProps extends ComponentProps, Omit<InputProps, 'leftAddon' | 'rightAddon'> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchBar = ({
  onSearch,
  onClear,
  showClearButton = true,
  className = '',
  ...inputProps
}: SearchBarProps) => {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    inputProps.onChange?.(e);
  };

  const handleSearch = () => {
    onSearch?.(value);
  };

  const handleClear = () => {
    setValue('');
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    inputProps.onKeyDown?.(e);
  };

  const SearchIcon = (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const ClearIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div className={`relative ${className}`}>
      <Input
        {...inputProps}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        leftAddon={SearchIcon}
        rightAddon={
          showClearButton && value ? (
            <IconButton
              icon={ClearIcon}
              size="sm"
              variant="ghost"
              aria-label="Clear search"
              onClick={handleClear}
            />
          ) : undefined
        }
      />
    </div>
  );
};

SearchBar.displayName = 'SearchBar';

