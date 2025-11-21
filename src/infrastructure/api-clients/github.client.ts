/**
 * GitHub API Client
 */

export class GitHubClient {
  private token: string;
  private baseUrl = 'https://api.github.com';

  constructor(token: string) {
    this.token = token;
  }

  async getUser(username: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/users/${username}`, {
      headers: {
        Authorization: `token ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }

  async getRepositories(username: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/users/${username}/repos?per_page=100`,
      {
        headers: {
          Authorization: `token ${this.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    return response.json();
  }

  async getContributions(username: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/users/${username}/events/public`,
      {
        headers: {
          Authorization: `token ${this.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch contributions');
    }

    return response.json();
  }

  async getUserStats(username: string): Promise<any> {
    const [user, repos, events] = await Promise.all([
      this.getUser(username),
      this.getRepositories(username),
      this.getContributions(username),
    ]);

    return {
      user,
      repos,
      events,
      totalRepos: repos.length,
      totalStars: repos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0),
      totalForks: repos.reduce((sum: number, r: any) => sum + r.forks_count, 0),
    };
  }
}

