/**
 * Leaderboard Table Component
 */

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

interface Builder {
  id: string;
  username: string;
  score: number;
  rank: number;
}

interface LeaderboardTableProps {
  builders: Builder[];
  onBuilderPress?: (builder: Builder) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  builders, 
  onBuilderPress 
}) => {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <View className="flex-row bg-gray-100 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
        <Text className="w-16 font-semibold text-gray-700 dark:text-gray-300">Rank</Text>
        <Text className="flex-1 font-semibold text-gray-700 dark:text-gray-300">Builder</Text>
        <Text className="w-20 font-semibold text-gray-700 dark:text-gray-300 text-right">
          Score
        </Text>
      </View>
      <ScrollView className="max-h-96">
        {builders.map((builder) => (
          <Pressable
            key={builder.id}
            onPress={() => onBuilderPress?.(builder)}
            className="flex-row p-4 border-b border-gray-100 dark:border-gray-700"
          >
            <Text className="w-16 font-bold text-blue-500">#{builder.rank}</Text>
            <Text className="flex-1 text-gray-900 dark:text-white">{builder.username}</Text>
            <Text className="w-20 font-semibold text-gray-900 dark:text-white text-right">
              {builder.score}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

