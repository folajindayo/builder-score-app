/**
 * Avatar Component
 */

'use client';

interface AvatarProps {
  address: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ address, size = 'md' }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold`}
    >
      {shortAddress}
    </div>
  );
}
