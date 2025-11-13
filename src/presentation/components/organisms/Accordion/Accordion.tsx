/**
 * Accordion Organism Component
 * Collapsible content sections
 */

import { useState, HTMLAttributes, forwardRef, ReactNode } from 'react';
import { Heading } from '@atoms/Heading';
import { IconButton } from '@atoms/IconButton';
import { Divider } from '@atoms/Divider';
import { ComponentProps } from '@presentation/types';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  isDisabled?: boolean;
}

export interface AccordionProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      allowMultiple = false,
      defaultExpanded = [],
      className = '',
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

    const toggleItem = (itemId: string) => {
      if (allowMultiple) {
        setExpandedItems((prev) =>
          prev.includes(itemId)
            ? prev.filter((id) => id !== itemId)
            : [...prev, itemId]
        );
      } else {
        setExpandedItems((prev) =>
          prev.includes(itemId) ? [] : [itemId]
        );
      }
    };

    const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
      <svg
        className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );

    return (
      <div ref={ref} className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`} {...props}>
        {items.map((item) => {
          const isExpanded = expandedItems.includes(item.id);

          return (
            <div key={item.id}>
              <button
                type="button"
                disabled={item.isDisabled}
                onClick={() => !item.isDisabled && toggleItem(item.id)}
                className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                  item.isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                }`}
                aria-expanded={isExpanded}
                aria-controls={`accordion-content-${item.id}`}
              >
                <Heading as="h3" size="md">
                  {item.title}
                </Heading>
                <ChevronIcon isExpanded={isExpanded} />
              </button>

              {isExpanded && (
                <div
                  id={`accordion-content-${item.id}`}
                  role="region"
                  className="p-4 pt-0 animate-in fade-in slide-in-from-top-2"
                >
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';

