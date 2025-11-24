/**
 * Responsive breakpoint utilities and helpers
 */

export const breakpoints = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get responsive class for a breakpoint
 */
export function getResponsiveClass(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string,
  "2xl"?: string
): string {
  const classes = [base];
  if (sm) classes.push(`sm:${sm}`);
  if (md) classes.push(`md:${md}`);
  if (lg) classes.push(`lg:${lg}`);
  if (xl) classes.push(`xl:${xl}`);
  if ("2xl") classes.push(`2xl:${"2xl"}`);
  return classes.join(" ");
}

/**
 * Responsive grid columns
 */
export const gridCols = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
  wide: 4,
} as const;

/**
 * Responsive spacing
 */
export const spacing = {
  mobile: "p-4",
  tablet: "sm:p-6",
  desktop: "md:p-8",
  wide: "lg:p-10",
} as const;

/**
 * Responsive text sizes
 */
export const textSizes = {
  mobile: {
    h1: "text-2xl",
    h2: "text-xl",
    h3: "text-lg",
    body: "text-base",
    small: "text-sm",
  },
  tablet: {
    h1: "sm:text-3xl",
    h2: "sm:text-2xl",
    h3: "sm:text-xl",
    body: "sm:text-base",
    small: "sm:text-sm",
  },
  desktop: {
    h1: "md:text-4xl",
    h2: "md:text-3xl",
    h3: "md:text-2xl",
    body: "md:text-lg",
    small: "md:text-base",
  },
} as const;

