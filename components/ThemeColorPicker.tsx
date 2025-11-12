"use client";

import { useTheme, ThemeVariant } from "@/lib/use-theme";
import { themes } from "@/lib/theme";

export function ThemeColorPicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Theme Color</label>
      <div className="flex flex-wrap gap-2">
        {Object.keys(themes).map((variant) => {
          const themeVariant = variant as ThemeVariant;
          const themeColors = themes[themeVariant];
          return (
            <button
              key={variant}
              onClick={() => setTheme(themeVariant)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                theme === variant
                  ? "border-gray-900 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{
                backgroundColor: `var(--color-${themeColors.primary})`,
              }}
              aria-label={`Select ${variant} theme`}
              title={variant.charAt(0).toUpperCase() + variant.slice(1)}
            />
          );
        })}
      </div>
    </div>
  );
}

