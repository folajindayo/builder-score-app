/**
 * ActivityTimeline Component
 */

'use client';

interface Activity {
  id: string;
  type: 'github' | 'transaction' | 'credential';
  title: string;
  description: string;
  timestamp: string;
  score: number;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const ACTIVITY_ICONS = {
  github: '📝',
  transaction: '💰',
  credential: '🏆',
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No activity yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              {ACTIVITY_ICONS[activity.type]}
            </div>
            {index < activities.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mt-2" />
            )}
          </div>

          <div className="flex-1 pb-8">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium text-gray-900">{activity.title}</h4>
              <span className="text-xs text-green-600 font-medium">+{activity.score}</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
            <p className="text-xs text-gray-400">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
