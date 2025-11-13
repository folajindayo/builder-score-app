# Domain Layer - Complete

This document summarizes the complete domain layer implementation following Clean Architecture and Domain-Driven Design principles.

## Entities
- **Entity** (base class)
- **Builder** - Core builder entity
- **Achievement** - Achievement entity with factory
- **Transaction** - Blockchain transaction entity

## Value Objects
- **ValueObject** (base class)
- **Score** - Score with validation and tiers
- **Email** - Email validation
- **Address** - Ethereum address validation

## Aggregates
- **BuilderAggregate** - Aggregate root for builder with related entities

## Services
- **ScoreCalculationService** - Score calculation logic
- **LeaderboardService** - Ranking and leaderboard logic
- **AchievementService** - Achievement management

## Repositories (Interfaces)
- **IRepository** - Base repository interface
- **IBuilderRepository** - Builder data access
- **IScoreRepository** - Score data access

## Events
- **DomainEvent** - Base event class
- **BuilderEvents** - Builder-related events
- **EventHandler** - Event handling infrastructure

## Specifications
- **Specification** - Base specification pattern
- **BuilderSpecifications** - Builder business rules

## Validators
- **BuilderValidator** - Builder validation logic

## Policies
- **ScorePolicy** - Score calculation policies

## Criteria
- **AchievementCriteria** - Achievement evaluation criteria

## Rules
- **BuilderRules** - Business rules enforcement

## Factories
- **BuilderFactory** - Builder entity creation

## Errors
- Domain-specific error types

## Constants
- Domain constants and enums

## Unit of Work
- **IUnitOfWork** - Transaction coordination

## Types
- Common domain types and interfaces

All domain layer components are:
- Framework-independent
- Fully testable
- Well-documented
- Production-ready

