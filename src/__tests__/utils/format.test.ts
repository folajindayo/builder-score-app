/**
 * Format Utilities Tests
 */

import { formatNumber, formatDate, formatRelativeTime } from '../lib/utils/format.utils';

describe('formatNumber', () => {
  it('should format large numbers with K', () => {
    expect(formatNumber(5000)).toBe('5.0K');
  });

  it('should format millions with M', () => {
    expect(formatNumber(2500000)).toBe('2.5M');
  });

  it('should format small numbers as-is', () => {
    expect(formatNumber(500)).toBe('500');
  });
});

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    const formatted = formatDate(date);
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('2024');
  });
});

describe('formatRelativeTime', () => {
  it('should return "Today" for today', () => {
    const today = new Date();
    expect(formatRelativeTime(today)).toBe('Today');
  });
});

