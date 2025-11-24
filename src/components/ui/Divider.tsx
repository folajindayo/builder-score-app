/**
 * Divider Component
 */

'use client';

interface DividerProps {
  text?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ text, orientation = 'horizontal' }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className="w-px h-full bg-gray-200" />;
  }

  if (text) {
    return (
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-500">{text}</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
    );
  }

  return <div className="border-t border-gray-200" />;
}
