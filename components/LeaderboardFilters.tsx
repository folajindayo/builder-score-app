"use client";

import { useState, useEffect } from "react";
import type { LeaderboardFilters } from "@/types/talent";

// Sponsor slugs - ordered list
const SPONSOR_SLUGS = [
  { value: "", label: "All Sponsors" },
  { value: "celo", label: "Celo" },
  { value: "base", label: "Base" },
  { value: "base-summer", label: "Base Summer" },
  { value: "syndicate", label: "Syndicate" },
  { value: "talent-protocol", label: "Talent Protocol" },
];

// Grant IDs by sponsor and duration
const GRANT_IDS: Record<string, { thisWeek: number; lastWeek: number }> = {
  walletconnect: { thisWeek: 710, lastWeek: 704 },
  celo: { thisWeek: 716, lastWeek: 291 },
};

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
  const [grantDuration, setGrantDuration] = useState<"thisWeek" | "lastWeek">("thisWeek");
  const [perPage, setPerPage] = useState(initialFilters.per_page?.toString() || "20");

  // Auto-set grant ID based on sponsor and duration (controlled from code)
  useEffect(() => {
    if (sponsorSlug && GRANT_IDS[sponsorSlug]) {
      // Grant ID is automatically determined by sponsor and duration
      // No need to store it in state, it's calculated when applying filters
    }
  }, [sponsorSlug, grantDuration]);

  const handleSponsorSlugChange = (value: string) => {
    setSponsorSlug(value);
    // Reset to "thisWeek" when sponsor changes
    if (value && GRANT_IDS[value]) {
      setGrantDuration("thisWeek");
    }
  };

  const handleGrantDurationChange = (value: "thisWeek" | "lastWeek") => {
    setGrantDuration(value);
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(value);
  };

  const handleApplyFilters = () => {
    const filters: LeaderboardFilters = {
      sponsor_slug: sponsorSlug || undefined,
      per_page: perPage ? Number(perPage) : undefined,
      page: 1,
    };

    // Auto-set grant ID based on sponsor and duration (controlled from code)
    if (sponsorSlug && GRANT_IDS[sponsorSlug]) {
      filters.grant_id = GRANT_IDS[sponsorSlug][grantDuration];
    }

    onFilterChange(filters);
  };

  const handleClear = () => {
    setSponsorSlug("");
    setGrantDuration("thisWeek");
    setPerPage("20");
    onFilterChange({ per_page: 20, page: 1 });
  };

  const hasFilters = sponsorSlug || (perPage && perPage !== "20");
  const currentGrantId = sponsorSlug && GRANT_IDS[sponsorSlug] 
    ? GRANT_IDS[sponsorSlug][grantDuration] 
    : null;

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
            Duration {sponsorSlug && GRANT_IDS[sponsorSlug] && currentGrantId && (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                (Grant ID: {currentGrantId})
              </span>
            )}
          </label>
          {sponsorSlug && GRANT_IDS[sponsorSlug] ? (
            <select
              value={grantDuration}
              onChange={(e) => handleGrantDurationChange(e.target.value as "thisWeek" | "lastWeek")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="thisWeek">
                This Week (Grant ID: {GRANT_IDS[sponsorSlug].thisWeek})
              </option>
              <option value="lastWeek">
                Last Week (Grant ID: {GRANT_IDS[sponsorSlug].lastWeek})
              </option>
            </select>
          ) : (
            <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Select a sponsor to see duration options
            </div>
          )}
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
      <div className="mt-4 flex justify-end gap-3">
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            Clear Filters
          </button>
        )}
        <button
          type="button"
          onClick={handleApplyFilters}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {loading ? "Applying..." : "Apply Filters"}
        </button>
      </div>
    </div>
  );
}

