"use client";

import { useState } from "react";
import { WalletButton } from "@/components/WalletButton";
import { BuilderSearcher } from "@/components/BuilderSearcher";
import { SearchResults } from "@/components/SearchResults";
import type { SearchFilters } from "@/types/talent";
import Link from "next/link";

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [loading, setLoading] = useState(false);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setLoading(true);
    setTimeout(() => setLoading(false), 100);
  };

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
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search Builders
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find builders by wallet address, ENS name, score range, skills, or credentials
          </p>
        </div>

        <div className="mb-8">
          <BuilderSearcher onSearch={handleSearch} loading={loading} />
        </div>

        <SearchResults filters={filters} />
      </main>
    </div>
  );
}


