# Domain Layer

The domain layer contains the core business logic and rules of the application. It is the innermost layer and has no dependencies on external frameworks or infrastructure.

## Structure

```
domain/
├── entities/        # Core business objects with identity
├── value-objects/   # Immutable objects without identity
├── aggregates/      # Cluster of domain objects treated as a unit
├── services/        # Domain logic that doesn't belong to entities
├── repositories/    # Interfaces for data access
├── events/          # Domain events
├── specifications/  # Business rules encapsulation
├── factories/       # Object creation logic
├── errors/          # Domain-specific errors
└── types/           # Domain type definitions
```

## Principles

1. **Framework Independence**: No dependencies on UI, database, or external frameworks
2. **Testability**: Pure business logic that's easy to test
3. **Business-Centric**: Written in ubiquitous language of the domain
4. **Immutability**: Prefer immutable objects where possible
5. **Validation**: Business rules enforced at domain level

## Guidelines

- Entities must have identity and lifecycle
- Value objects are immutable and compared by value
- Domain services contain logic that doesn't naturally fit in entities
- Repository interfaces define data contracts
- Domain events communicate changes within the domain
- No infrastructure concerns (HTTP, databases, etc.)

