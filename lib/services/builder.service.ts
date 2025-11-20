/**
 * Builder Service
 */

import { Builder } from '../types/builder.types';
import { TalentClient } from '../api/talent-client';

export class BuilderService {
  private client: TalentClient;

  constructor(apiKey: string) {
    this.client = new TalentClient(apiKey);
  }

  async getBuilderByAddress(address: string): Promise<Builder> {
    const data = await this.client.getBuilderScore(address);
    return {
      address: data.address,
      score: data.score,
      level: data.level,
      credentials: data.credentials || [],
      skills: data.skills || [],
      reputation: data.reputation || 0,
    };
  }

  async searchBuilders(query: string): Promise<Builder[]> {
    const results = await this.client.searchBuilders(query);
    return results.map((r: any) => ({
      address: r.address,
      score: r.score,
      level: r.level,
      credentials: r.credentials || [],
      skills: r.skills || [],
      reputation: r.reputation || 0,
    }));
  }
}

