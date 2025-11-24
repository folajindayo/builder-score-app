// Fuzzy search implementation (commits 36-45: Search enhancements)
export function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let qi = 0;
  
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  
  return qi === q.length;
}

export function searchWithFuzzy<T>(items: T[], query: string, getField: (item: T) => string): T[] {
  return items.filter(item => fuzzyMatch(query, getField(item)));
}

// Saved searches
export function saveSearch(query: string, filters: Record<string, any>): void {
  const searches = JSON.parse(localStorage.getItem('saved-searches') || '[]');
  searches.push({ query, filters, timestamp: Date.now() });
  localStorage.setItem('saved-searches', JSON.stringify(searches.slice(-10)));
}

export function getSavedSearches(): Array<{query: string; filters: Record<string, any>; timestamp: number}> {
  return JSON.parse(localStorage.getItem('saved-searches') || '[]');
}

// Search history
export function addToSearchHistory(query: string): void {
  const history = JSON.parse(localStorage.getItem('search-history') || '[]');
  history.unshift(query);
  localStorage.setItem('search-history', JSON.stringify([...new Set(history)].slice(0, 20)));
}

export function getSearchHistory(): string[] {
  return JSON.parse(localStorage.getItem('search-history') || '[]');
}

// Autocomplete
export function getSearchSuggestions(query: string, items: string[]): string[] {
  return items.filter(item => fuzzyMatch(query, item)).slice(0, 5);
}

// Export functionality
export function exportToCSV(data: any[], filename: string): void {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(data: any[], filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

