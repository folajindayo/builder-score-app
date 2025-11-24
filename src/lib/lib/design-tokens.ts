// Design system (commits 61-70: UI/UX enhancements)
export const designTokens = {
  colors: {
    primary: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 900: '#1e3a8a' },
    secondary: { 50: '#f5f3ff', 500: '#8b5cf6', 900: '#4c1d95' },
    success: { 50: '#f0fdf4', 500: '#22c55e', 900: '#14532d' },
    warning: { 50: '#fffbeb', 500: '#f59e0b', 900: '#78350f' },
    error: { 50: '#fef2f2', 500: '#ef4444', 900: '#7f1d1d' },
    neutral: { 50: '#fafafa', 100: '#f5f5f5', 500: '#737373', 900: '#171717' },
  },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' },
  typography: {
    fontFamily: { sans: 'Inter, sans-serif', mono: 'Fira Code, monospace' },
    fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem' },
    fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  },
  borderRadius: { none: '0', sm: '0.125rem', md: '0.375rem', lg: '0.5rem', full: '9999px' },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  animation: {
    duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
    easing: { linear: 'linear', in: 'cubic-bezier(0.4, 0, 1, 1)', out: 'cubic-bezier(0, 0, 0.2, 1)' },
  },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
};

export const themes = {
  light: { background: '#ffffff', foreground: '#000000', ...designTokens.colors },
  dark: { background: '#000000', foreground: '#ffffff', primary: { ...designTokens.colors.primary, 500: '#60a5fa' } },
  highContrast: { background: '#000000', foreground: '#ffffff', primary: { 500: '#ffff00' } },
};

export function applyTheme(theme: keyof typeof themes): void {
  const root = document.documentElement;
  Object.entries(themes[theme]).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([shade, color]) => {
        root.style.setProperty(`--${key}-${shade}`, color);
      });
    } else {
      root.style.setProperty(`--${key}`, value);
    }
  });
}

