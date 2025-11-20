/**
 * Object Utilities
 */

export function groupByKey<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function keyBy<T>(array: T[], key: keyof T): Record<string, T> {
  return array.reduce((result, item) => {
    result[String(item[key])] = item;
    return result;
  }, {} as Record<string, T>);
}

