import { WalletButton } from "@/components/WalletButton";
import { BuilderScore } from "@/components/BuilderScore";
import Link from "next/link";

export default function Home() {
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Builder Score
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Connect your wallet to view your onchain builder reputation score powered by Talent Protocol
            </p>
          </div>

          <BuilderScore />
        </div>
      </main>
    </div>
  );
}
