/**
 * CSV export utilities
 */

/**
 * Converts an array of objects to CSV string
 */
export function arrayToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers?: string[]
): string {
  if (data.length === 0) return '';

  const keys = headers || Object.keys(data[0]);
  const csvRows: string[] = [];

  // Add headers
  csvRows.push(keys.map((key) => escapeCSVValue(String(key))).join(','));

  // Add data rows
  for (const row of data) {
    const values = keys.map((key) => {
      const value = row[key];
      return escapeCSVValue(value != null ? String(value) : '');
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Escapes a value for CSV format
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Downloads a CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
