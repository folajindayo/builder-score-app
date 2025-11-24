/**
 * Score Breakdown Component
 */

import React from 'react';
import { View, Text } from 'react-native';

interface ScoreBreakdownProps {
  scores: {
    overall: number;
    reputation: number;
    activity: number;
    skills: number;
    contributions: number;
  };
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ scores }) => {
  const categories = [
    { key: 'reputation', label: 'Reputation', value: scores.reputation },
    { key: 'activity', label: 'Activity', value: scores.activity },
    { key: 'skills', label: 'Skills', value: scores.skills },
    { key: 'contributions', label: 'Contributions', value: scores.contributions },
  ];

  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Score Breakdown
      </Text>
      {categories.map((category) => (
        <View key={category.key} className="mb-4">
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-700 dark:text-gray-300">{category.label}</Text>
            <Text className="font-semibold text-gray-900 dark:text-white">
              {category.value}
            </Text>
          </View>
          <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <View 
              className="h-full bg-blue-500"
              style={{ width: `${category.value}%` }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

