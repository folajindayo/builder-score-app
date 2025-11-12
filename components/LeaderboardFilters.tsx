"use client";

import { useState, useEffect, memo, useCallback } from "react";
import type { LeaderboardFilters } from "@/types/talent";
import { motion, AnimatePresence } from "framer-motion";
import { FilterChip } from "@/components/FilterChip";

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

// Filter presets
const FILTER_PRESETS = [
  { label: "All Time", sponsor: "all", duration: "allTime" as const },
  { label: "This Week", sponsor: "walletconnect", duration: "thisWeek" as const },
  { label: "Last Week", sponsor: "walletconnect", duration: "lastWeek" as const },
  { label: "Top Builders", sponsor: "all", duration: "allTime" as const },
] as const;

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

export const LeaderboardFilters = memo(function LeaderboardFilters({
  onFilterChange,
  loading,
  initialFilters = {},
}: LeaderboardFiltersProps) {
  const [sponsorSlug, setSponsorSlug] = useState(initialFilters.sponsor_slug || "");
  const [grantDuration, setGrantDuration] = useState<"thisWeek" | "lastWeek" | "allTime">("thisWeek");

  // Auto-set grant ID based on sponsor and duration (controlled from code)
  useEffect(() => {
    if (sponsorSlug && GRANT_IDS[sponsorSlug]) {
      // Grant ID is automatically determined by sponsor and duration
      // No need to store it in state, it's calculated when applying filters
    }
  }, [sponsorSlug, grantDuration]);

  const handleSponsorSlugChange = useCallback((value: string) => {
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
  }, []);

  const handleGrantDurationChange = useCallback((value: "thisWeek" | "lastWeek" | "allTime") => {
    setGrantDuration(value);
  };

  const handleApplyFilters = () => {
    const filters: LeaderboardFilters = {
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

  const handleClear = useCallback(() => {
    setSponsorSlug("");
    setGrantDuration("allTime");
    onFilterChange({ page: 1 });
  };

  const hasFilters = sponsorSlug;
  const currentGrantId = sponsorSlug && GRANT_IDS[sponsorSlug] && grantDuration !== "allTime"
    ? GRANT_IDS[sponsorSlug][grantDuration] 
    : null;

  const applyPreset = useCallback((preset: typeof FILTER_PRESETS[number]) => {
    setSponsorSlug(preset.sponsor);
    setGrantDuration(preset.duration);
    const filters: LeaderboardFilters = { page: 1 };
    if (preset.sponsor !== "all") {
      filters.sponsor_slug = preset.sponsor;
      if (GRANT_IDS[preset.sponsor] && preset.duration !== "allTime") {
        filters.grant_id = GRANT_IDS[preset.sponsor][preset.duration];
      }
    }
    onFilterChange(filters);
  }, [onFilterChange]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-gray-500">Presets:</span>
        {FILTER_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => applyPreset(preset)}
            className="px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Sponsors
          </label>
          <select
            value={sponsorSlug}
            onChange={(e) => handleSponsorSlugChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
            Duration
          </label>
          <AnimatePresence mode="wait">
            {sponsorSlug ? (
              <motion.div
                key="duration-buttons"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                <motion.button
                  type="button"
                  onClick={() => handleGrantDurationChange("allTime")}
                  disabled={sponsorSlug === "all"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                    grantDuration === "allTime"
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : sponsorSlug === "all"
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  All Time
                </motion.button>
                {sponsorSlug !== "all" && GRANT_IDS[sponsorSlug] && (
                  <>
                    <motion.button
                      type="button"
                      onClick={() => handleGrantDurationChange("thisWeek")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                        grantDuration === "thisWeek"
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      This Week
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => handleGrantDurationChange("lastWeek")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                        grantDuration === "lastWeek"
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Last Week
                    </motion.button>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-400"
              >
                Select a sponsor to see duration options
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {hasFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 pb-2 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-500">Active filters:</span>
          {sponsorSlug && (
            <FilterChip
              label={SPONSOR_SLUGS.find((s) => s.value === sponsorSlug)?.label || sponsorSlug}
              variant="active"
              onRemove={() => {
                setSponsorSlug("");
                setGrantDuration("allTime");
              }}
            />
          )}
          {grantDuration !== "allTime" && (
            <FilterChip
              label={grantDuration === "thisWeek" ? "This Week" : "Last Week"}
              variant="active"
              onRemove={() => setGrantDuration("allTime")}
            />
          )}
        </div>
      )}
      <div className="mt-4 flex justify-end gap-2">
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-xl transition-colors"
          >
            Clear
          </button>
        )}
        <button
          type="button"
          onClick={handleApplyFilters}
          disabled={loading}
          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-sm"
        >
          {loading ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  );
});

