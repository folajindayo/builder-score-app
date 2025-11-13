'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  /** Tab list position */
  variant?: 'line' | 'pills' | 'contained';
  /** Enable keyboard navigation */
  keyboardNavigation?: boolean;
  /** Full width tabs */
  fullWidth?: boolean;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'line',
  keyboardNavigation = true,
  fullWidth = false,
}: TabsProps) {
  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
      const enabledTabs = tabs.filter((tab) => !tab.disabled);
      const currentEnabledIndex = enabledTabs.findIndex((tab) => tab.id === activeTab);

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const direction = e.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (currentEnabledIndex + direction + enabledTabs.length) % enabledTabs.length;
        const nextTab = enabledTabs[nextIndex];
        onChange(nextTab.id);
        
        const nextTabIndex = tabs.findIndex((tab) => tab.id === nextTab.id);
        tabsRef.current[nextTabIndex]?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, tabs, onChange, keyboardNavigation]);

  const getTabStyles = (tab: Tab, isActive: boolean) => {
    const baseStyles = `font-semibold transition-all flex items-center gap-2 ${fullWidth ? 'flex-1 justify-center' : ''}`;
    
    if (variant === 'pills') {
      return `${baseStyles} px-4 py-2 rounded-lg ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
    } else if (variant === 'contained') {
      return `${baseStyles} px-6 py-3 border-b-2 ${
        isActive
          ? 'border-blue-600 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
    } else {
      return `${baseStyles} px-6 py-3 relative ${
        isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
      } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
    }
  };

  return (
    <div className={className} role="tablist">
      <div
        className={`flex ${variant === 'line' ? 'border-b-2 border-gray-200' : 'gap-2'} ${
          variant === 'pills' ? 'bg-gray-100 p-1 rounded-lg' : ''
        } relative`}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => (tabsRef.current[index] = el)}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              className={getTabStyles(tab, isActive)}
              aria-label={`Switch to ${tab.label} tab`}
              aria-selected={isActive}
              aria-disabled={tab.disabled}
              role="tab"
              tabIndex={isActive ? 0 : -1}
            >
              {tab.icon && <span className="inline-flex shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                  {tab.badge}
                </span>
              )}
              {isActive && variant === 'line' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-4"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTabContent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
