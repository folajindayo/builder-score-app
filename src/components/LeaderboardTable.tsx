/**
 * LeaderboardTable Component
 */

'use client';

interface LeaderboardEntry {
  rank: number;
  address: string;
  score: number;
  change?: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Address
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Score
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Change
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr key={entry.rank} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                #{entry.rank}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                {entry.score}
              </td>
              <td className="px-6 py-4 text-sm text-right">
                {entry.change !== undefined && (
                  <span
                    className={
                      entry.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {entry.change >= 0 ? '+' : ''}
                    {entry.change}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

