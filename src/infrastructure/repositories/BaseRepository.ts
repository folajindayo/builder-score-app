/**
 * Base Repository Implementation
 * 
 * Provides common functionality for repository implementations.
 */

import { IRepository } from '@domain/repositories/IRepository';

export abstract class BaseRepository<T, ID> implements IRepository<T, ID> {
  /**
   * Find entity by ID
   */
  abstract findById(id: ID): Promise<T | null>;

  /**
   * Find all entities
   */
  abstract findAll(criteria?: Record<string, any>): Promise<T[]>;

  /**
   * Save entity
   */
  abstract save(entity: T): Promise<T>;

  /**
   * Delete entity
   */
  abstract delete(id: ID): Promise<boolean>;

  /**
   * Check if entity exists
   */
  async exists(id: ID): Promise<boolean> {
    const entity = await this.findById(id);
    return entity !== null;
  }

  /**
   * Count entities
   */
  async count(criteria?: Record<string, any>): Promise<number> {
    const entities = await this.findAll(criteria);
    return entities.length;
  }

  /**
   * Batch save entities
   */
  async saveBatch(entities: T[]): Promise<T[]> {
    return Promise.all(entities.map((entity) => this.save(entity)));
  }

  /**
   * Batch delete entities
   */
  async deleteBatch(ids: ID[]): Promise<boolean[]> {
    return Promise.all(ids.map((id) => this.delete(id)));
  }

  /**
   * Find first entity matching criteria
   */
  async findOne(criteria: Record<string, any>): Promise<T | null> {
    const results = await this.findAll(criteria);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Map domain entity to persistence model
   */
  protected abstract toPersistence(entity: T): any;

  /**
   * Map persistence model to domain entity
   */
  protected abstract toDomain(raw: any): T;

  /**
   * Map array of persistence models to domain entities
   */
  protected toDomainArray(rawArray: any[]): T[] {
    return rawArray.map((raw) => this.toDomain(raw));
  }

  /**
   * Validate entity before save
   */
  protected validate(entity: T): void {
    // Override in concrete implementations
  }
}

