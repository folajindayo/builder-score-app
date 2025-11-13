/**
 * Base Entity Class
 * 
 * Entities are objects with a unique identity that runs through time and different states.
 * Two entities are equal only if their IDs are equal.
 */

export abstract class Entity<T> {
  protected readonly _id: T;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;

  constructor(id: T, createdAt?: Date, updatedAt?: Date) {
    this._id = id;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  /**
   * Get entity ID
   */
  get id(): T {
    return this._id;
  }

  /**
   * Get creation timestamp
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Get last update timestamp
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Update the timestamp
   */
  protected touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Check if this entity equals another
   */
  equals(other: Entity<T>): boolean {
    if (!(other instanceof Entity)) {
      return false;
    }
    return this._id === other._id;
  }

  /**
   * Clone the entity
   */
  abstract clone(): Entity<T>;
}

