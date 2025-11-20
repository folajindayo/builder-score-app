/**
 * BuilderSearch Component
 */

'use client';

import { useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import { SearchBar } from './ui/SearchBar';
import { BuilderCard } from './BuilderCard';

export function BuilderSearch() {
  const { results, loading, error, search } = useSearch();

  return (
    <div className="space-y-6">
      <SearchBar
        onSearch={search}
        placeholder="Search builders by name or address..."
      />

      {loading && <p className="text-center text-gray-500">Searching...</p>}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((builder) => (
          <BuilderCard key={builder.address} builder={builder} />
        ))}
      </div>

      {!loading && results.length === 0 && (
        <p className="text-center text-gray-500">No results found</p>
      )}
    </div>
  );
}

