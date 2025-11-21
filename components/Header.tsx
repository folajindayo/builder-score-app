/**
 * Header Component
 */

'use client';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-600">Builder Score</h1>
        <nav className="flex gap-4">
          <a href="/" className="text-gray-700 hover:text-pink-600">Home</a>
          <a href="/leaderboard" className="text-gray-700 hover:text-pink-600">Leaderboard</a>
        </nav>
      </div>
    </header>
  );
}

