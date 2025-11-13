'use client';

interface NumberBadgeProps {
  count: number;
  max?: number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function NumberBadge({
  count,
  max = 99,
  variant = 'default',
  size = 'md',
}: NumberBadgeProps) {
  const displayCount = count > max ? `${max}+` : count.toString();

  const variants = {
    default: 'bg-gray-600',
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };

  const sizes = {
    sm: 'text-xs min-w-[16px] h-4 px-1',
    md: 'text-xs min-w-[20px] h-5 px-1.5',
    lg: 'text-sm min-w-[24px] h-6 px-2',
  };

  return (
    <span
      className={`inline-flex items-center justify-center ${variants[variant]} ${sizes[size]} text-white rounded-full font-semibold`}
    >
      {displayCount}
    </span>
  );
}
