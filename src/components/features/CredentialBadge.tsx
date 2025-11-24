/**
 * Credential Badge Component
 */

import React from 'react';
import { View, Text } from 'react-native';

interface CredentialBadgeProps {
  type: string;
  verified: boolean;
  issuer: string;
}

export const CredentialBadge: React.FC<CredentialBadgeProps> = ({ 
  type, 
  verified, 
  issuer 
}) => {
  const getBadgeColor = () => {
    if (!verified) return 'bg-gray-200 dark:bg-gray-700';
    
    switch (type) {
      case 'github': return 'bg-purple-100 dark:bg-purple-900';
      case 'talent_protocol': return 'bg-blue-100 dark:bg-blue-900';
      case 'ens': return 'bg-green-100 dark:bg-green-900';
      case 'lens': return 'bg-lime-100 dark:bg-lime-900';
      case 'farcaster': return 'bg-indigo-100 dark:bg-indigo-900';
      default: return 'bg-gray-100 dark:bg-gray-900';
    }
  };

  const getTextColor = () => {
    if (!verified) return 'text-gray-600 dark:text-gray-400';
    
    switch (type) {
      case 'github': return 'text-purple-700 dark:text-purple-300';
      case 'talent_protocol': return 'text-blue-700 dark:text-blue-300';
      case 'ens': return 'text-green-700 dark:text-green-300';
      case 'lens': return 'text-lime-700 dark:text-lime-300';
      case 'farcaster': return 'text-indigo-700 dark:text-indigo-300';
      default: return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <View className={`px-3 py-2 rounded-lg ${getBadgeColor()} flex-row items-center`}>
      <Text className={`font-medium text-sm ${getTextColor()}`}>
        {type.toUpperCase()}
      </Text>
      {verified && (
        <Text className="ml-2 text-xs">✓</Text>
      )}
    </View>
  );
};

