"use client";

import { useState, useEffect } from "react";
import { searchBuilders } from "@/lib/talent-api";
import type { SearchFilters, SearchResult } from "@/types/talent";
import { formatAddress, formatScore } from "@/lib/utils";

interface SearchResultsProps {
  filters: SearchFilters;
}

export function SearchResults({ filters }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setPage(1);
    setResults([]);
    performSearch(filters, 1);
  }, [JSON.stringify(filters)]);

  const performSearch = async (searchFilters: SearchFilters, pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchBuilders(searchFilters, pageNum, 20);
      if (pageNum === 1) {
        setResults(response.results);
      } else {
        setResults((prev) => [...prev, ...response.results]);
      }
      setHasMore(response.hasMore);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search builders");
      console.error("Error searching builders:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      performSearch(filters, nextPage);
    }
  };

  if (loading && results.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <p className="text-sm text-red-500 dark:text-red-500 mt-2">
          Note: API key may need to be configured
        </p>
      </div>
    );
  }

  if (results.length === 0 && !loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          No builders found. Try adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {total > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Found {total} builder{total !== 1 ? "s" : ""}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <div
            key={result.address}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {result.profile?.name || result.ensName || formatAddress(result.address)}
              </h3>
              <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
                {result.ensName ? result.address : formatAddress(result.address)}
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatScore(result.score)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">score</span>
              </div>
            </div>

            {result.profile?.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {result.profile.bio}
              </p>
            )}

            {result.skills && result.skills.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {result.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {result.skills.length > 3 && (
                    <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                      +{result.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {result.credentials && result.credentials.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-1">
                  {result.credentials.slice(0, 2).map((cred) => (
                    <span
                      key={cred.id}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                    >
                      {cred.name}
                    </span>
                  ))}
                  {result.credentials.length > 2 && (
                    <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                      +{result.credentials.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}


