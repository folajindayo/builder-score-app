'use client';

import { Button } from '@/components/Button';
import { Spinner } from '@/components/Spinner';

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({
  children,
  loading = false,
  disabled = false,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}: LoadingButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      variant={variant}
      size={size}
      className={className}
      type={type}
    >
      {loading && (
        <span className="mr-2">
          <Spinner size="sm" variant="primary" />
        </span>
      )}
      {children}
    </Button>
  );
}
