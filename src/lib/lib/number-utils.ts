/**
 * Number formatting utilities with various formats
 */

/**
 * Formats number with thousand separators
 */
export function formatWithSeparators(num: number, separator: string = ','): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * Formats number as currency with symbol
 */
export function formatAsCurrency(
  num: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(num);
}

/**
 * Formats number with unit (K, M, B, T)
 */
export function formatWithUnit(num: number, decimals: number = 1): string {
  if (num >= 1e12) return `${(num / 1e12).toFixed(decimals)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
  return num.toFixed(decimals);
}

/**
 * Formats number as percentage
 */
export function formatAsPercent(num: number, decimals: number = 1): string {
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Formats number with fixed decimal places
 */
export function formatFixed(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

/**
 * Formats number with significant digits
 */
export function formatSignificant(num: number, digits: number = 3): string {
  return num.toPrecision(digits);
}

/**
 * Formats number in scientific notation
 */
export function formatScientific(num: number, decimals: number = 2): string {
  return num.toExponential(decimals);
}

/**
 * Formats number with locale-specific formatting
 */
export function formatLocale(num: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Formats number as ordinal (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(num: number): string {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
}

/**
 * Formats number with leading zeros
 */
export function formatWithLeadingZeros(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

/**
 * Formats number as binary
 */
export function formatBinary(num: number): string {
  return num.toString(2);
}

/**
 * Formats number as hexadecimal
 */
export function formatHex(num: number): string {
  return num.toString(16).toUpperCase();
}

/**
 * Formats number as octal
 */
export function formatOctal(num: number): string {
  return num.toString(8);
}

/**
 * Formats number with custom precision
 */
export function formatPrecision(num: number, precision: number): string {
  return num.toPrecision(precision);
}

/**
 * Formats number range
 */
export function formatRange(min: number, max: number, separator: string = ' - '): string {
  return `${min}${separator}${max}`;
}

/**
 * Formats number as file size (bytes, KB, MB, GB, TB)
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Formats number as duration (seconds to human readable)
 */
export function formatDuration(seconds: number): string {
  const units = [
    { value: 31536000, label: 'year' },
    { value: 2592000, label: 'month' },
    { value: 86400, label: 'day' },
    { value: 3600, label: 'hour' },
    { value: 60, label: 'minute' },
    { value: 1, label: 'second' },
  ];

  for (const unit of units) {
    const count = Math.floor(seconds / unit.value);
    if (count > 0) {
      return `${count} ${unit.label}${count !== 1 ? 's' : ''}`;
    }
  }
  return '0 seconds';
}
