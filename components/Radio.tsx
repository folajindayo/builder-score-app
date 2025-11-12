"use client";

interface RadioProps {
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  name?: string;
  className?: string;
}

export function Radio({
  value,
  checked,
  onChange,
  label,
  disabled = false,
  name,
  className = "",
}: RadioProps) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        name={name}
        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}
