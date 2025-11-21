/**
 * Builder Profile Repository Interface
 */

import { BuilderProfileEntity } from '../entities/builder-profile.entity';

export interface BuilderFilters {
  minScore?: number;
  hasVerifiedCredentials?: boolean;
  search?: string;
}

export interface IBuilderProfileRepository {
  findById(id: string): Promise<BuilderProfileEntity | null>;
  findByWallet(address: string): Promise<BuilderProfileEntity | null>;
  findByUsername(username: string): Promise<BuilderProfileEntity | null>;
  findAll(filters: BuilderFilters): Promise<BuilderProfileEntity[]>;
  getLeaderboard(limit: number): Promise<BuilderProfileEntity[]>;
  create(profile: BuilderProfileEntity): Promise<BuilderProfileEntity>;
  update(id: string, profile: BuilderProfileEntity): Promise<BuilderProfileEntity>;
  delete(id: string): Promise<void>;
  getRank(profileId: string): Promise<number>;
}

