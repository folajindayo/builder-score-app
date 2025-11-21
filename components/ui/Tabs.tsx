/**
 * Tabs Component
 */

'use client';

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <View className="w-full">
      <View className="flex flex-row border-b border-gray-200">
        {tabs.map(tab => (
          <Pressable
            key={tab.id}
            onPress={() => handleTabChange(tab.id)}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Text>{tab.label}</Text>
          </Pressable>
        ))}
      </View>
      <View className="py-4">
        {activeTabContent}
      </View>
    </View>
  );
};
