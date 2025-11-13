// Data visualization (commits 91-100)
export interface ChartData {
  labels: string[];
  datasets: Array<{ label: string; data: number[]; color?: string }>;
}

export function generateScoreTrendData(scores: Array<{ date: string; score: number }>): ChartData {
  return {
    labels: scores.map(s => s.date),
    datasets: [{ label: 'Score', data: scores.map(s => s.score), color: '#3b82f6' }],
  };
}

export function generateSkillRadarData(skills: Array<{ name: string; level: number }>): ChartData {
  return {
    labels: skills.map(s => s.name),
    datasets: [{ label: 'Skill Level', data: skills.map(s => s.level), color: '#8b5cf6' }],
  };
}

export function generateCredentialTimelineData(credentials: Array<{ name: string; date: string }>): ChartData {
  const grouped = credentials.reduce((acc, cred) => {
    const month = cred.date.slice(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(grouped),
    datasets: [{ label: 'Credentials', data: Object.values(grouped), color: '#22c55e' }],
  };
}

export function generatePortfolioGrowth(data: Array<{ month: string; value: number }>): ChartData {
  return {
    labels: data.map(d => d.month),
    datasets: [{ label: 'Portfolio Value', data: data.map(d => d.value), color: '#f59e0b' }],
  };
}

export function generateScoreDistribution(scores: number[]): ChartData {
  const bins = [0, 200, 400, 600, 800, 1000];
  const counts = bins.slice(0, -1).map((bin, i) => 
    scores.filter(s => s >= bin && s < bins[i + 1]).length
  );

  return {
    labels: bins.slice(0, -1).map((b, i) => `${b}-${bins[i + 1]}`),
    datasets: [{ label: 'Builders', data: counts, color: '#ef4444' }],
  };
}

export function generateHeatmapData(activity: Array<{ date: string; count: number }>): number[][] {
  // Convert to 2D array for heatmap
  const weeks = 52;
  const days = 7;
  const matrix: number[][] = Array(weeks).fill(0).map(() => Array(days).fill(0));
  
  activity.forEach(({ date, count }) => {
    const d = new Date(date);
    const week = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const day = d.getDay();
    if (matrix[week]) matrix[week][day] = count;
  });

  return matrix;
}

