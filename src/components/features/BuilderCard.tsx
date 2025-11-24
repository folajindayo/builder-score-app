/**
 * Builder Card Component
 */

import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';

interface BuilderCardProps {
  builder: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    score: number;
    rank: number;
  };
  onPress?: () => void;
}

export const BuilderCard: React.FC<BuilderCardProps> = ({ builder, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mr-3">
          {builder.avatarUrl ? (
            <Image
              source={{ uri: builder.avatarUrl }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <Text className="text-white font-bold text-lg">
              {builder.username[0].toUpperCase()}
            </Text>
          )}
        </View>

        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {builder.displayName || builder.username}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            @{builder.username}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-2xl font-bold text-blue-500">
            #{builder.rank}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Score: {builder.score}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

