/**
 * DropdownMenu Organism Component
 * Dropdown menu with items
 */

import { useState, useEffect, useRef, HTMLAttributes, forwardRef, ReactNode } from 'react';
import { Button, ButtonProps } from '@atoms/Button';
import { Divider } from '@atoms/Divider';
import { MenuItem, MenuItemProps } from '@molecules/MenuItem';
import { ComponentProps } from '@presentation/types';

export interface DropdownMenuProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  trigger?: ReactNode;
  triggerProps?: ButtonProps;
  items: (MenuItemProps | 'divider')[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      trigger,
      triggerProps,
      items,
      placement = 'bottom-start',
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const placementStyles = {
      'bottom-start': 'top-full left-0 mt-2',
      'bottom-end': 'top-full right-0 mt-2',
      'top-start': 'bottom-full left-0 mb-2',
      'top-end': 'bottom-full right-0 mb-2',
    };

    const defaultTrigger = (
      <Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
        Menu
      </Button>
    );

    return (
      <div ref={menuRef} className={`relative inline-block ${className}`} {...props}>
        <div onClick={() => setIsOpen(!isOpen)}>
          {trigger || defaultTrigger}
        </div>

        {isOpen && (
          <div
            ref={ref}
            role="menu"
            className={`absolute ${placementStyles[placement]} min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50`}
          >
            {items.map((item, index) =>
              item === 'divider' ? (
                <Divider key={index} className="my-2" />
              ) : (
                <MenuItem
                  key={index}
                  {...item}
                  onClick={(e) => {
                    item.onClick?.(e);
                    setIsOpen(false);
                  }}
                />
              )
            )}
          </div>
        )}
      </div>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';

