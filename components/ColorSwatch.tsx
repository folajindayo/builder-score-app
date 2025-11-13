'use client';

interface ColorSwatchProps {
  color: string;
  size?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function ColorSwatch({
  color,
  size = 'w-8 h-8',
  onClick,
  selected = false,
}: ColorSwatchProps) {
  return (
    <button
      type="button"
      className={`${size} rounded-full border-2 ${
        selected ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-300'
      } transition-all hover:scale-110`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      aria-label={`Select color ${color}`}
    />
  );
}
