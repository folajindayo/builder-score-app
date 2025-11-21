/**
 * Activity Aggregator
 */

interface Activity {
  type: string;
  timestamp: string;
  score: number;
}

export function aggregateActivities(activities: Activity[]): {
  totalScore: number;
  byType: Record<string, number>;
  recent: Activity[];
} {
  const totalScore = activities.reduce((sum, a) => sum + a.score, 0);
  
  const byType: Record<string, number> = {};
  activities.forEach((activity) => {
    if (!byType[activity.type]) {
      byType[activity.type] = 0;
    }
    byType[activity.type] += activity.score;
  });
  
  const recent = activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
  
  return { totalScore, byType, recent };
}

export function filterActivitiesByDateRange(
  activities: Activity[],
  startDate: Date,
  endDate: Date
): Activity[] {
  return activities.filter((activity) => {
    const date = new Date(activity.timestamp);
    return date >= startDate && date <= endDate;
  });
}

