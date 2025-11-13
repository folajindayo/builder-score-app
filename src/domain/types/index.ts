/**
 * Domain Type Definitions
 * 
 * Shared types and interfaces used across the domain layer.
 */

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly isSuccess = true;
  readonly isFailure = false;

  constructor(public readonly value: T) {}

  static of<T>(value: T): Success<T> {
    return new Success(value);
  }
}

export class Failure<E> {
  readonly isSuccess = false;
  readonly isFailure = true;

  constructor(public readonly error: E) {}

  static of<E>(error: E): Failure<E> {
    return new Failure(error);
  }
}

/**
 * Domain event interface
 */
export interface IDomainEvent {
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly eventType: string;
}

/**
 * Domain service interface
 */
export interface IDomainService {
  readonly name: string;
}

/**
 * Specification interface for business rules
 */
export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: ISpecification<T>): ISpecification<T>;
  or(other: ISpecification<T>): ISpecification<T>;
  not(): ISpecification<T>;
}

/**
 * Entity ID type
 */
export type EntityId = string | number;

/**
 * Timestamp types
 */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Soft delete support
 */
export interface SoftDeletable {
  deletedAt: Date | null;
  isDeleted: boolean;
}

/**
 * Audit trail
 */
export interface Auditable extends Timestamps {
  createdBy?: string;
  updatedBy?: string;
}

