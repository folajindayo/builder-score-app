/**
 * Talent Protocol API Client
 */

import { BaseApiClient } from './BaseApiClient';

export interface TalentProfile {
  wallet_address: string;
  name?: string;
  bio?: string;
  avatar?: string;
  score: number;
}

export class TalentApiClient extends BaseApiClient {
  constructor(baseURL: string, apiKey?: string) {
    super({
      baseURL,
      headers: apiKey ? { 'X-API-Key': apiKey } : {},
    });
  }

  async getProfile(address: string): Promise<TalentProfile> {
    return this.get<TalentProfile>(`/profiles/${address}`);
  }

  async getLeaderboard(limit: number = 100): Promise<TalentProfile[]> {
    return this.get<TalentProfile[]>('/leaderboard', { limit });
  }

  async searchBuilders(query: string): Promise<TalentProfile[]> {
    return this.get<TalentProfile[]>('/search', { q: query });
  }
}

