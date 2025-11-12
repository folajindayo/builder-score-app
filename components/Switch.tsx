"use client";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-4",
  md: "w-11 h-6",
  lg: "w-14 h-7",
};

const thumbSizeClasses = {
  sm: "w-3 h-3",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const translateClasses = {
  sm: "translate-x-4",
  md: "translate-x-5",
  lg: "translate-x-7",
};

export function Switch({
  checked,
  onChange,
  label,
  disabled = false,
  size = "md",
  className = "",
}: SwitchProps) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`${sizeClasses[size]} rounded-full transition-colors ${
            checked ? "bg-blue-600" : "bg-gray-300"
          } ${disabled ? "cursor-not-allowed" : ""}`}
        >
          <div
            className={`${thumbSizeClasses[size]} absolute top-0.5 left-0.5 bg-white rounded-full transition-transform ${
              checked ? translateClasses[size] : ""
            }`}
          />
        </div>
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}
