/**
 * Sidebar Organism Component
 * Navigation sidebar with sections
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { Link } from '@atoms/Link';
import { Heading } from '@atoms/Heading';
import { Divider } from '@atoms/Divider';
import { ComponentProps } from '@presentation/types';

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export interface SidebarProps extends ComponentProps, Omit<HTMLAttributes<HTMLElement>, 'className'> {
  sections: SidebarSection[];
  header?: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      sections,
      header,
      footer,
      width = '16rem',
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <aside
        ref={ref}
        className={`flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${className}`}
        style={{ width }}
        {...props}
      >
        {/* Header */}
        {header && (
          <>
            <div className="p-4">{header}</div>
            <Divider />
          </>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && (
                <Heading as="h3" size="sm" className="mb-2 px-2 uppercase tracking-wide">
                  {section.title}
                </Heading>
              )}
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        variant="subtle"
                        colorScheme={item.isActive ? 'primary' : 'inherit'}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                          item.isActive
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : ''
                        }`}
                      >
                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={item.onClick}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                          item.isActive
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                        <span>{item.label}</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {footer && (
          <>
            <Divider />
            <div className="p-4">{footer}</div>
          </>
        )}
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';

