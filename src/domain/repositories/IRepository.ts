/**
 * Base Repository Interface
 * 
 * Defines common operations for all repositories.
 * This follows the Repository pattern from Domain-Driven Design.
 */

export interface IRepository<T, ID> {
  /**
   * Find an entity by its ID
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Find all entities matching criteria
   */
  findAll(criteria?: Record<string, any>): Promise<T[]>;

  /**
   * Save an entity (create or update)
   */
  save(entity: T): Promise<T>;

  /**
   * Delete an entity by ID
   */
  delete(id: ID): Promise<boolean>;

  /**
   * Check if entity exists
   */
  exists(id: ID): Promise<boolean>;

  /**
   * Count entities matching criteria
   */
  count(criteria?: Record<string, any>): Promise<number>;
}

