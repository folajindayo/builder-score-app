"use client";

import { useState } from "react";
import { WalletButton } from "@/components/WalletButton";
import { Leaderboard } from "@/components/Leaderboard";
import type { LeaderboardFilters } from "@/types/talent";
import Link from "next/link";

export default function LeaderboardPage() {
  const [filters, setFilters] = useState<LeaderboardFilters>({
    per_page: 20,
    page: 1,
    sponsor_slug: process.env.NEXT_PUBLIC_DEFAULT_SPONSOR_SLUG || undefined,
    grant_id: process.env.NEXT_PUBLIC_DEFAULT_GRANT_ID
      ? Number(process.env.NEXT_PUBLIC_DEFAULT_GRANT_ID)
      : undefined,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Builder Score
            </h1>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Search
              </Link>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Leaderboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Top builders ranked by their onchain reputation score
          </p>
        </div>

        <Leaderboard filters={filters} />
      </main>
    </div>
  );
}

