/**
 * GitHub Service
 */

interface GitHubActivity {
  commits: number;
  pullRequests: number;
  issues: number;
  repositories: number;
  contributions: number;
}

export class GitHubService {
  async getUserActivity(username: string): Promise<GitHubActivity | null> {
    try {
      const response = await fetch(`/api/github/activity?username=${username}`);
      
      if (!response.ok) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('GitHubService error:', error);
      return null;
    }
  }

  async calculateGitHubScore(username: string): Promise<number> {
    const activity = await this.getUserActivity(username);
    
    if (!activity) return 0;
    
    const scores = {
      commits: Math.min(activity.commits / 100, 25),
      prs: Math.min(activity.pullRequests / 20, 25),
      issues: Math.min(activity.issues / 30, 15),
      repos: Math.min(activity.repositories / 10, 20),
      contributions: Math.min(activity.contributions / 500, 15),
    };
    
    return Math.round(
      Object.values(scores).reduce((sum, score) => sum + score, 0)
    );
  }
}

export const githubService = new GitHubService();

