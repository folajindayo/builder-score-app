/**
 * Navbar Organism Component
 * Navigation bar with logo, links, and actions
 */

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { Link } from '@atoms/Link';
import { Button } from '@atoms/Button';
import { IconButton } from '@atoms/IconButton';
import { Avatar, AvatarProps } from '@atoms/Avatar';
import { ComponentProps } from '@presentation/types';

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface NavbarProps extends ComponentProps, Omit<HTMLAttributes<HTMLElement>, 'className'> {
  logo?: ReactNode;
  links?: NavLink[];
  actions?: ReactNode;
  avatar?: AvatarProps;
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      logo,
      links = [],
      actions,
      avatar,
      onMenuClick,
      showMenu = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const MenuIcon = (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    );

    return (
      <nav
        ref={ref}
        className={`flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}
        {...props}
      >
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {showMenu && onMenuClick && (
            <IconButton
              icon={MenuIcon}
              variant="ghost"
              aria-label="Toggle menu"
              onClick={onMenuClick}
              className="lg:hidden"
            />
          )}
          {logo && <div className="flex-shrink-0">{logo}</div>}
          {links.length > 0 && (
            <div className="hidden lg:flex items-center gap-6">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  variant={link.isActive ? 'underline' : 'default'}
                  colorScheme={link.isActive ? 'primary' : 'inherit'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {actions}
          {avatar && <Avatar {...avatar} />}
        </div>
      </nav>
    );
  }
);

Navbar.displayName = 'Navbar';

