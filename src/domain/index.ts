/**
 * Domain Layer Barrel Export
 * 
 * This file exports all domain layer modules for convenient importing.
 * The domain layer contains pure business logic with no external dependencies.
 */

// Entities - Core business objects with identity
export * from './entities';

// Value Objects - Immutable objects without identity
export * from './value-objects';

// Aggregates - Clusters of domain objects
export * from './aggregates';

// Services - Domain logic that doesn't belong to entities
export * from './services';

// Repositories - Data access interfaces
export * from './repositories';

// Events - Domain events for communication
export * from './events';

// Specifications - Business rules encapsulation
export * from './specifications';

// Factories - Object creation logic
export * from './factories';

// Errors - Domain-specific errors
export * from './errors';

// Types - Domain type definitions
export * from './types';

