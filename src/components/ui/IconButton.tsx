/**
 * Icon Button Component
 */

'use client';

import React from 'react';
import { Pressable, View } from 'react-native';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  ariaLabel?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  ariaLabel,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-700';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 p-1';
      case 'lg':
        return 'w-12 h-12 p-3';
      default:
        return 'w-10 h-10 p-2';
    }
  };

  return (
    <Pressable
      onPress={onClick}
      disabled={disabled}
      accessibilityLabel={ariaLabel}
      className={`inline-flex items-center justify-center rounded-full transition-colors ${getVariantStyles()} ${getSizeStyles()} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <View>{icon}</View>
    </Pressable>
  );
};

