/**
 * ScoreCard Component
 */

'use client';

interface ScoreCardProps {
  score: number;
  level: string;
  address: string;
}

export function ScoreCard({ score, level, address }: ScoreCardProps) {
  const getColorByScore = (s: number) => {
    if (s >= 80) return 'text-green-600';
    if (s >= 60) return 'text-blue-600';
    if (s >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Builder Score</h3>
      <div className={`text-4xl font-bold ${getColorByScore(score)}`}>
        {score}
      </div>
      <p className="text-sm text-gray-500 mt-2">{level}</p>
      <p className="text-xs text-gray-400 mt-1">{address}</p>
    </div>
  );
}

