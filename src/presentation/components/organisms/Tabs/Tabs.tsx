/**
 * Tabs Organism Component
 * Complete tab system with panels
 */

import { useState, HTMLAttributes, forwardRef, ReactNode } from 'react';
import { TabItem } from '@molecules/TabItem';
import { ComponentProps } from '@presentation/types';

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  badge?: string | number;
  isDisabled?: boolean;
}

export interface TabsProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'line' | 'enclosed' | 'pills';
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      defaultTab,
      onChange,
      variant = 'line',
      className = '',
      ...props
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId: string) => {
      setActiveTab(tabId);
      onChange?.(tabId);
    };

    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

    const variantStyles = {
      line: 'border-b border-gray-200 dark:border-gray-700',
      enclosed: 'border border-gray-200 dark:border-gray-700 rounded-t-lg',
      pills: 'gap-2',
    };

    return (
      <div ref={ref} className={className} {...props}>
        {/* Tab List */}
        <div
          role="tablist"
          className={`flex items-center ${variantStyles[variant]}`}
        >
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              label={tab.label}
              badge={tab.badge}
              isActive={activeTab === tab.id}
              isDisabled={tab.isDisabled}
              onClick={() => handleTabChange(tab.id)}
            />
          ))}
        </div>

        {/* Tab Panel */}
        <div
          role="tabpanel"
          aria-labelledby={activeTab}
          className="py-4"
        >
          {activeTabContent}
        </div>
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

