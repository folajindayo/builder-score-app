/**
 * Builder Repository Interface
 * 
 * Defines data access operations for Builder entities.
 */

import { Builder } from '../entities/Builder';
import { IRepository } from './IRepository';

export interface BuilderSearchCriteria {
  name?: string;
  address?: string;
  hasGithub?: boolean;
  hasTwitter?: boolean;
  minScore?: number;
  maxScore?: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBuilderRepository extends IRepository<Builder, string> {
  /**
   * Find builder by wallet address
   */
  findByAddress(address: string): Promise<Builder | null>;

  /**
   * Find builders by name (partial match)
   */
  findByName(name: string): Promise<Builder[]>;

  /**
   * Search builders with criteria
   */
  search(
    criteria: BuilderSearchCriteria,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Builder>>;

  /**
   * Find top builders by score
   */
  findTopBuilders(limit: number): Promise<Builder[]>;

  /**
   * Find builders with incomplete profiles
   */
  findIncompleteProfiles(): Promise<Builder[]>;

  /**
   * Update builder profile
   */
  updateProfile(
    address: string,
    updates: Partial<Builder>
  ): Promise<Builder | null>;

  /**
   * Bulk save builders
   */
  bulkSave(builders: Builder[]): Promise<Builder[]>;
}

