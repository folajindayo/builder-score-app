'use client';

import { useState, useEffect } from 'react';
import { ThemeVariant, getThemeColors } from '@/lib/theme';
import { useLocalStorage } from '@/lib/use-local-storage';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<ThemeVariant>('theme', 'blue');
  const [themeColors, setThemeColors] = useState(getThemeColors(theme));

  useEffect(() => {
    setThemeColors(getThemeColors(theme));
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return {
    theme,
    setTheme,
    themeColors,
  };
}
