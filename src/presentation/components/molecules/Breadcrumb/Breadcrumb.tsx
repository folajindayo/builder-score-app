/**
 * Breadcrumb Molecule Component
 * Navigation breadcrumb trail
 */

import { HTMLAttributes, forwardRef, Fragment } from 'react';
import { Link } from '@atoms/Link';
import { Text } from '@atoms/Text';
import { ComponentProps } from '@presentation/types';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

export interface BreadcrumbProps extends ComponentProps, Omit<HTMLAttributes<HTMLElement>, 'className'> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      separator,
      className = '',
      ...props
    },
    ref
  ) => {
    const defaultSeparator = (
      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    );

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 ${className}`}
        {...props}
      >
        <ol className="flex items-center gap-2 flex-wrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <Fragment key={index}>
                <li className="flex items-center gap-2">
                  {item.isCurrentPage || isLast || !item.href ? (
                    <Text
                      aria-current={item.isCurrentPage || isLast ? 'page' : undefined}
                      color={item.isCurrentPage || isLast ? 'default' : 'muted'}
                    >
                      {item.label}
                    </Text>
                  ) : (
                    <Link href={item.href} colorScheme="inherit">
                      {item.label}
                    </Link>
                  )}
                </li>
                {!isLast && (
                  <li aria-hidden="true">
                    {separator || defaultSeparator}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

