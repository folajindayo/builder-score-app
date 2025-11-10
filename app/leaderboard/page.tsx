"use client";

import { useState } from "react";
import { WalletButton } from "@/components/WalletButton";
import { Leaderboard } from "@/components/Leaderboard";
import { LeaderboardFilters } from "@/components/LeaderboardFilters";
import type { LeaderboardFilters as LeaderboardFiltersType } from "@/types/talent";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const [filters, setFilters] = useState<LeaderboardFiltersType>({
    per_page: 20,
    page: 1,
    sponsor_slug: process.env.NEXT_PUBLIC_DEFAULT_SPONSOR_SLUG || undefined,
    grant_id: process.env.NEXT_PUBLIC_DEFAULT_GRANT_ID
      ? Number(process.env.NEXT_PUBLIC_DEFAULT_GRANT_ID)
      : undefined,
  });
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (newFilters: LeaderboardFiltersType) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 when filters change
    setLoading(true);
    setTimeout(() => setLoading(false), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex items-center justify-between">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  Builder Score
                </motion.h1>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Search
              </Link>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Leaderboard
          </h2>
          <p className="text-lg text-gray-600">
            Top builders ranked by their onchain reputation score
          </p>
        </motion.div>

        <LeaderboardFilters
          onFilterChange={handleFilterChange}
          loading={loading}
          initialFilters={filters}
        />

        <Leaderboard filters={filters} />
      </main>
    </div>
  );
}

