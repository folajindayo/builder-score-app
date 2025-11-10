"use client";

import { useState } from "react";
import { useDebounce } from "@/lib/hooks";
import type { LeaderboardFilters } from "@/types/talent";

// Common sponsor slugs - ordered list
const SPONSOR_SLUGS = [
  { value: "", label: "All Sponsors" },
  { value: "walletconnect", label: "WalletConnect" },
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "optimism", label: "Optimism" },
  { value: "base", label: "Base" },
  { value: "zksync", label: "zkSync" },
  { value: "starknet", label: "Starknet" },
  { value: "avalanche", label: "Avalanche" },
  { value: "bsc", label: "BNB Chain" },
  { value: "fantom", label: "Fantom" },
  { value: "gnosis", label: "Gnosis" },
  { value: "celo", label: "Celo" },
  { value: "linea", label: "Linea" },
  { value: "scroll", label: "Scroll" },
  { value: "mantle", label: "Mantle" },
  { value: "blast", label: "Blast" },
];

interface LeaderboardFiltersProps {
  onFilterChange: (filters: LeaderboardFilters) => void;
  loading?: boolean;
  initialFilters?: LeaderboardFilters;
}

export function LeaderboardFilters({
  onFilterChange,
  loading,
  initialFilters = {},
}: LeaderboardFiltersProps) {
  const [sponsorSlug, setSponsorSlug] = useState(initialFilters.sponsor_slug || "");
  const [grantId, setGrantId] = useState(initialFilters.grant_id?.toString() || "");
  const [perPage, setPerPage] = useState(initialFilters.per_page?.toString() || "20");

  const debouncedFilter = useDebounce((filters: LeaderboardFilters) => {
    onFilterChange(filters);
  }, 500);

  const handleSponsorSlugChange = (value: string) => {
    setSponsorSlug(value);
    debouncedFilter({
      sponsor_slug: value || undefined,
      grant_id: grantId ? Number(grantId) : undefined,
      per_page: perPage ? Number(perPage) : undefined,
    });
  };

  const handleGrantIdChange = (value: string) => {
    setGrantId(value);
    debouncedFilter({
      sponsor_slug: sponsorSlug || undefined,
      grant_id: value ? Number(value) : undefined,
      per_page: perPage ? Number(perPage) : undefined,
    });
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(value);
    debouncedFilter({
      sponsor_slug: sponsorSlug || undefined,
      grant_id: grantId ? Number(grantId) : undefined,
      per_page: value ? Number(value) : undefined,
    });
  };

  const handleClear = () => {
    setSponsorSlug("");
    setGrantId("");
    setPerPage("20");
    onFilterChange({ per_page: 20, page: 1 });
  };

  const hasFilters = sponsorSlug || grantId || (perPage && perPage !== "20");

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Filter Leaderboard
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sponsor
          </label>
          <select
            value={sponsorSlug}
            onChange={(e) => handleSponsorSlugChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SPONSOR_SLUGS.map((sponsor) => (
              <option key={sponsor.value} value={sponsor.value}>
                {sponsor.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Grant ID
          </label>
          <input
            type="number"
            value={grantId}
            onChange={(e) => handleGrantIdChange(e.target.value)}
            placeholder="710"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Results Per Page
          </label>
          <select
            value={perPage}
            onChange={(e) => handlePerPageChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      {hasFilters && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

