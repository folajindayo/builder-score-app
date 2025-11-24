/**
 * Theme color variations
 */

export type ThemeVariant = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'indigo';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}

export const themes: Record<ThemeVariant, ThemeColors> = {
  blue: {
    primary: 'blue-600',
    primaryHover: 'blue-700',
    primaryLight: 'blue-50',
    secondary: 'gray-600',
    accent: 'cyan-500',
    background: 'white',
    surface: 'gray-50',
    text: 'gray-900',
    textMuted: 'gray-600',
  },
  purple: {
    primary: 'purple-600',
    primaryHover: 'purple-700',
    primaryLight: 'purple-50',
    secondary: 'gray-600',
    accent: 'pink-500',
    background: 'white',
    surface: 'gray-50',
    text: 'gray-900',
    textMuted: 'gray-600',
  },
  green: {
    primary: 'green-600',
    primaryHover: 'green-700',
    primaryLight: 'green-50',
    secondary: 'gray-600',
    accent: 'emerald-500',
    background: 'white',
    surface: 'gray-50',
    text: 'gray-900',
    textMuted: 'gray-600',
  },
  orange: {
    primary: 'orange-600',
    primaryHover: 'orange-700',
    primaryLight: 'orange-50',
    secondary: 'gray-600',
    accent: 'amber-500',
    background: 'white',
    surface: 'gray-50',
    text: 'gray-900',
    textMuted: 'gray-600',
  },
  red: {
    primary: 'red-600',
    primaryHover: 'red-700',
    primaryLight: 'red-50',
    secondary: 'gray-600',
    accent: 'rose-500',
    background: 'white',
    surface: 'gray-50',
    text: 'gray-900',
    textMuted: 'gray-600',
  },
  indigo: {
    primary: 'indigo-600',
    primaryHover: 'indigo-700',
    primaryLight: 'indigo-50',
    secondary: 'gray-600',
    accent: 'violet-500',
    background: 'white',
    surface: 'gray-50',
    text: 'gray-900',
    textMuted: 'gray-600',
  },
};

export function getThemeColors(variant: ThemeVariant): ThemeColors {
  return themes[variant];
}

export function getThemeClass(variant: ThemeVariant, type: keyof ThemeColors): string {
  return themes[variant][type];
}
