/**
 * ScoreBreakdown Component
 */

'use client';

interface ScoreCategory {
  label: string;
  score: number;
  maxScore: number;
  description: string;
}

interface ScoreBreakdownProps {
  categories: ScoreCategory[];
}

export function ScoreBreakdown({ categories }: ScoreBreakdownProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Score Breakdown</h3>
      
      {categories.map((category) => (
        <div key={category.label} className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">{category.label}</p>
              <p className="text-xs text-gray-500">{category.description}</p>
            </div>
            <span className="font-bold text-blue-600">
              {category.score}/{category.maxScore}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(category.score / category.maxScore) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

