/**
 * Unit of Work Pattern Interface
 * 
 * Maintains a list of objects affected by a business transaction
 * and coordinates the writing out of changes.
 */

export interface IUnitOfWork {
  /**
   * Begin a transaction
   */
  begin(): Promise<void>;

  /**
   * Commit the transaction
   */
  commit(): Promise<void>;

  /**
   * Rollback the transaction
   */
  rollback(): Promise<void>;

  /**
   * Check if transaction is active
   */
  isActive(): boolean;
}

export abstract class BaseUnitOfWork implements IUnitOfWork {
  protected active: boolean = false;

  async begin(): Promise<void> {
    if (this.active) {
      throw new Error('Transaction already active');
    }
    this.active = true;
  }

  abstract commit(): Promise<void>;

  async rollback(): Promise<void> {
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }
}

