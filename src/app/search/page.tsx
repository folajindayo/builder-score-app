'use client';

import { useState, useEffect } from 'react';
import { WalletButton } from '@/components/WalletButton';
import dynamic from 'next/dynamic';
import type { SearchFilters } from '@/types/talent';
import Link from 'next/link';

const BuilderSearcher = dynamic(() =>
  import('@/components/BuilderSearcher').then((mod) => ({ default: mod.BuilderSearcher }))
);
const SearchResults = dynamic(() =>
  import('@/components/SearchResults').then((mod) => ({ default: mod.SearchResults }))
);
import { motion } from 'framer-motion';
import { ScrollToTop } from '@/components/ScrollToTop';

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Search Builders - Builder Score';
  }, []);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setLoading(true);
    setTimeout(() => setLoading(false), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header
        className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-10"
        role="banner"
      >
        <nav
          className="mx-[200px] px-4 sm:px-6 lg:px-8 py-5"
          role="navigation"
          aria-label="Main navigation"
        >
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
                href="/leaderboard"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Leaderboard
              </Link>
              <WalletButton />
            </div>
          </div>
        </nav>
      </header>

      <main
        className="mx-[200px] px-4 sm:px-6 lg:px-8 py-10"
        role="main"
        aria-label="Search page main content"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Search Builders</h2>
          <p className="text-lg text-gray-600">
            Find builders by wallet address, ENS name, score range, skills, or credentials
          </p>
        </motion.div>

        <motion.section
          role="search"
          aria-label="Builder search"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <BuilderSearcher onSearch={handleSearch} loading={loading} />
        </motion.section>

        <motion.section
          role="region"
          aria-label="Search results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SearchResults filters={filters} />
        </motion.section>
      </main>
      <footer
        role="contentinfo"
        aria-label="Site footer"
        className="bg-white/90 border-t border-gray-200/50 mt-12"
      >
        <div className="mx-[200px] px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-500 text-center">Powered by Talent Protocol</p>
        </div>
      </footer>
      <ScrollToTop />
    </div>
  );
}
