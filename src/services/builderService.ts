export interface BuilderProfile {
  address: string;
  username?: string;
  score: number;
  rank: number;
  commits: number;
  repos: number;
  languages: string[];
  joinedDate: string;
  lastActive: string;
}

export interface BuilderActivity {
  id: string;
  type: "commit" | "repo_created" | "score_update" | "achievement";
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class BuilderService {
  async getProfile(address: string): Promise<BuilderProfile | null> {
    // Mock implementation - in real app, query database
    return {
      address,
      username: `builder_${address.slice(0, 6)}`,
      score: Math.floor(Math.random() * 100),
      rank: Math.floor(Math.random() * 1000) + 1,
      commits: Math.floor(Math.random() * 500),
      repos: Math.floor(Math.random() * 50),
      languages: ["TypeScript", "Solidity", "Rust"],
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date().toISOString(),
    };
  }

  async getActivity(address: string, limit: number = 10): Promise<BuilderActivity[]> {
    // Mock implementation
    return Array.from({ length: limit }, (_, i) => ({
      id: `activity-${i}`,
      type: ["commit", "repo_created", "score_update", "achievement"][i % 4] as any,
      description: `Activity description ${i + 1}`,
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      metadata: {
        repo: `repo-${i}`,
        language: ["TypeScript", "Solidity", "Rust"][i % 3],
      },
    }));
  }

  async updateProfile(
    address: string,
    updates: Partial<BuilderProfile>
  ): Promise<BuilderProfile> {
    // Mock implementation
    const profile = await this.getProfile(address);
    if (!profile) {
      throw new Error("Profile not found");
    }

    return {
      ...profile,
      ...updates,
    };
  }

  async calculateScore(address: string): Promise<number> {
    // Mock implementation - in real app, calculate based on activity
    const profile = await this.getProfile(address);
    if (!profile) return 0;

    // Simple scoring algorithm
    const commitScore = profile.commits * 0.5;
    const repoScore = profile.repos * 2;
    const languageScore = profile.languages.length * 5;

    return Math.min(100, Math.floor(commitScore + repoScore + languageScore));
  }
}

export const builderService = new BuilderService();

