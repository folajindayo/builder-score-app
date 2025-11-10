"use client";

import { useState, useEffect } from "react";
import type { LeaderboardFilters } from "@/types/talent";
import { motion } from "framer-motion";

// Sponsor slugs - ordered list
const SPONSOR_SLUGS = [
  { value: "all", label: "All Sponsors" },
  { value: "walletconnect", label: "WalletConnect" },
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
  const [grantDuration, setGrantDuration] = useState<"thisWeek" | "lastWeek" | "allTime">("thisWeek");
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
    // If "all" sponsors selected, force "allTime" duration
    if (value === "all") {
      setGrantDuration("allTime");
    } else if (value && GRANT_IDS[value]) {
      // Reset to "thisWeek" when sponsor changes (if it has grant IDs)
      setGrantDuration("thisWeek");
    } else {
      // For sponsors without grant IDs, default to "allTime"
      setGrantDuration("allTime");
    }
  };

  const handleGrantDurationChange = (value: "thisWeek" | "lastWeek" | "allTime") => {
    setGrantDuration(value);
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(value);
  };

  const handleApplyFilters = () => {
    const filters: LeaderboardFilters = {
      per_page: perPage ? Number(perPage) : undefined,
      page: 1,
    };

    // Handle "all sponsors" - don't set sponsor_slug, only works with allTime
    if (sponsorSlug === "all") {
      // For "all sponsors", don't set sponsor_slug (API will return all)
      // Only works with "allTime" (no grant_id)
      if (grantDuration !== "allTime") {
        // Force allTime if somehow not set
        setGrantDuration("allTime");
      }
      // grant_id is undefined (not set) for all sponsors
    } else if (sponsorSlug) {
      filters.sponsor_slug = sponsorSlug;
      // Auto-set grant ID based on sponsor and duration (controlled from code)
      // All time has no grant_id
      if (GRANT_IDS[sponsorSlug] && grantDuration !== "allTime") {
        filters.grant_id = GRANT_IDS[sponsorSlug][grantDuration];
      }
    }

    onFilterChange(filters);
  };

  const handleClear = () => {
    setSponsorSlug("");
    setGrantDuration("allTime");
    setPerPage("20");
    onFilterChange({ per_page: 20, page: 1 });
  };

  const hasFilters = sponsorSlug || (perPage && perPage !== "20");
  const currentGrantId = sponsorSlug && GRANT_IDS[sponsorSlug] && grantDuration !== "allTime"
    ? GRANT_IDS[sponsorSlug][grantDuration] 
    : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Sponsor
          </label>
          <select
            value={sponsorSlug}
            onChange={(e) => handleSponsorSlugChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            {SPONSOR_SLUGS.map((sponsor) => (
              <option key={sponsor.value} value={sponsor.value}>
                {sponsor.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Duration {sponsorSlug && sponsorSlug !== "all" && GRANT_IDS[sponsorSlug] && currentGrantId && (
              <span className="text-xs text-gray-500 ml-1 font-normal">
                (Grant ID: {currentGrantId})
              </span>
            )}
          </label>
          {sponsorSlug ? (
            <select
              value={grantDuration}
              onChange={(e) => handleGrantDurationChange(e.target.value as "thisWeek" | "lastWeek" | "allTime")}
              disabled={sponsorSlug === "all"}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                sponsorSlug === "all" ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="allTime">
                All Time {sponsorSlug === "all" && "(Only option for All Sponsors)"}
              </option>
              {sponsorSlug !== "all" && GRANT_IDS[sponsorSlug] && (
                <>
                  <option value="thisWeek">
                    This Week (Grant ID: {GRANT_IDS[sponsorSlug].thisWeek})
                  </option>
                  <option value="lastWeek">
                    Last Week (Grant ID: {GRANT_IDS[sponsorSlug].lastWeek})
                  </option>
                </>
              )}
            </select>
          ) : (
            <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400">
              Select a sponsor to see duration options
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Results Per Page
          </label>
          <select
            value={perPage}
            onChange={(e) => handlePerPageChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-colors"
          >
            Clear
          </button>
        )}
        <button
          type="button"
          onClick={handleApplyFilters}
          disabled={loading}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {loading ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  );
}

